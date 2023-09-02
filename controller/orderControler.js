const { rangeValidate } = require("../utils/validate/genralValidate");
const {
  addOrderValidate,
  productsItemValidate,
  updateOrderValidate,
} = require("../utils/validate/orderValidate");
const likeModel = require("../models/likeModel");
const orderModel = require("../models/orderModel");
const { default: mongoose } = require("mongoose");
const fs = require("fs");
const path = require("path");
const productModel = require("../models/productModel");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const signature = fs.readFileSync(
  path.join(process.cwd(), "signature.html"),
  "utf-8"
);
const template = handlebars.compile(signature);
const htmlToSend = (content) => {
  let replacements = {
    content: content,
  };
  return template(replacements);
};
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
module.exports.postOrder = async (req, res) => {
  // try {
  const { error } = addOrderValidate.validate(req.body);
  if (error) return res.status(400).send(error.message);
  const products = await Promise.all(
    req.body.productsIds.map(async (e, i) => await productModel.findById(e.id))
  );
  const restQuntity = products.map(
    (e, i) =>
      e.photos[
        e.photos.findIndex(
          (e) =>
            e.color == req.body.productsIds[i].color &&
            e.sizes.includes(req.body.productsIds[i].size)
        )
      ].quntity - req.body.productsIds[i].quntity
  );
  console.log(restQuntity);
  console.log(restQuntity.some((e) => e <= 0));
  if (restQuntity.some((e) => e < 0)) {
    const quntity = products.map(
      (e, i) =>
        e.photos[
          e.photos.findIndex(
            (e) =>
              e.color == req.body.productsIds[i].color &&
              e.sizes.includes(req.body.productsIds[i].size)
          )
        ].quntity
    );
    console.log(quntity);
    return res.status(200).json({ error: quntity });
  }
  const order = new orderModel({
    ...req.body,
  });
  await order.save();
  res.status(200).send(order);
  // } catch (e) {
  //   res.status(400).send(e);
  // }
};

module.exports.getOrder = async (req, res) => {
  try {
    const { error } = rangeValidate.validate(req.query);
    if (error) return res.status(400).send(error.message);
    const { min, max, type, name, reverse } = req.query;
    const orders = await orderModel.aggregate([
      {
        $match: {
          $and: type
            ? [
                { states: { $regex: type ? type : "" } },
                { states: { $ne: "removed" } },
                {
                  $or: [
                    { phone: { $regex: name ? name : "" } },
                    { name: { $regex: name ? name : "" } },
                    { email: { $regex: name ? name : "" } },
                    { address: { $regex: name ? name : "" } },
                    { city: { $regex: name ? name : "" } },
                    {
                      _id: name ? new mongoose.Types.ObjectId(name) : "",
                    },
                  ],
                },
              ]
            : [
                { states: { $ne: "removed" } },
                {
                  $or: [
                    { phone: { $regex: name ? name : "" } },
                    { name: { $regex: name ? name : "" } },
                    { email: { $regex: name ? name : "" } },
                    { address: { $regex: name ? name : "" } },
                    { city: { $regex: name ? name : "" } },
                  ],
                },
              ],
        },
      },
      {
        $sort: { createAt: reverse ? 1 : -1 },
      },
      {
        $lookup: {
          from: "orders",
          let: { userId: "$userId", phone: "$phone" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$userId", "$$userId"] },
                    { $eq: ["$phone", "$$phone"] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: "$states",
                count: { $sum: 1 },
              },
            },
          ],
          as: "status",
        },
      },
    ]);

    res
      .status(200)
      .send({ orders: orders.slice(min, max), count: orders.length });
  } catch (e) {
    res.status(400).send(e);
  }
};
module.exports.updateOrder = async (req, res) => {
  const { error } = updateOrderValidate.validate(req.body);
  if (error) return res.status(400).send(error.message);
  const body = req.body;
  const id = body.id;
  delete body.id;
  const order2 = await orderModel.findByIdAndUpdate(id, {
    $set: { ...body },
  });
  const states = body?.states;
  // change quntity after order changed
  if (states != "removed") {
    if (
      order2.states != "completed" &&
      order2.states != "accepted" &&
      (states == "completed" || states == "accepted")
    ) {
      await Promise.all(
        order2.productsIds.map(async (e) => {
          const prod = await productModel.findById(e.id);
          if (!prod) return;
          await Promise.all(
            prod.photos.map(async (el) => {
              if (el.color == e.color && el.sizes.includes(e.size)) {
                el.quntity = el.quntity - e.quntity || 0;
              }
            })
          );
          await prod.save();
        })
      );
    } else {
      if (
        (order2.states == "completed" || order2.states == "accepted") &&
        states != "completed" &&
        states != "accepted"
      ) {
        await Promise.all(
          order2.productsIds.map(async (e) => {
            const prod = await productModel.findById(e.id);
            if (!prod) return;
            await Promise.all(
              prod.photos.map(async (el) => {
                if (el.color == e.color && el.sizes.includes(e.size)) {
                  el.quntity = el.quntity + e.quntity;
                }
              })
            );
            await prod.save();
          })
        );
      }
    }
    let transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        user: process.env.email,
        pass: process.env.pass,
      },
    });
    if (states == "accepted") {
      const mes = `تأكيد طلبك في متجرنا ${order2.name}</p>
      <p>نأمل أن تكون بأتم الصحة والعافية. نود أن نعلمك أن طلبك في متجرنا قد تم استلامه ومعالجته بنجاح.</p>
      <p>تفاصيل الطلب:</p>
      <ul>
          <li>معرف الطلب: ${order2._id}</li>
          <li>رقم الهاتف: ${order2.phone}</li>
          <li>تاريخ الطلب: ${formatDate(order2.createAt)}</li>
          <li>قائمة المنتجات:</li>
          <ul>
          ${order2.productsIds.map(
            (e, i) =>
              `<li>${i + 1}. الاسم: ${
                e.name
              } - اللون:   <div style="height: 10px;width: 10px;background-color:${
                e.color
              } ;border-radius: 50%;"></div> - الحجم: ${e.size} - الكمية: ${
                e.quntity
              }</li>`
          )}
      </ul>
      </ul>
      <p>سيتم شحن طلبك في أقرب وقت ممكن.</p>
      <p>إذا كان لديك أي استفسار أو ملاحظة بخصوص طلبك، فلا تتردد في التواصل معنا عبر وسائل الاتصال المتاحة في الموقع.</p>
      <p>نشكرك مجددًا على ثقتك في منتجاتنا وخدماتنا. نتطلع إلى خدمتك مرة أخرى في المستقبل.</p>
      <p>مع خالص التقدير،</p>
      <p>Fri7a</p>`;
      let mailOption = {
        from: process.env.email,
        to: order2.email,
        subject: "متجر Fri7a clothes",
        html: htmlToSend(mes),
      };
      transport.sendMail(mailOption, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
    if (states == "rejected") {
      const rejectionMessage = `
<p><strong>عذرًا،</strong></p>
<p>نأسف لإبلاغك بأن طلبك في متجرنا ${
        order2.name
      } تم رفضه بسبب عدم توفر الكمية المطلوبة من بعض المنتجات.</p>
<p>نأمل أن تكون بأتم الصحة والعافية. ونرجو أن نتمكن من تقديم خدمة أفضل لك في المرات القادمة.</p>
<p>تفاصيل الطلب:</p>
<ul>
    <li>معرف الطلب: ${order2._id}</li>
    <li>رقم الهاتف: ${order2.phone}</li>
    <li>تاريخ الطلب: ${formatDate(order2.createAt)}</li>
    <li>قائمة المنتجات:</li>
    <ul>
    ${order2.productsIds.map(
      (e, i) =>
        `<li>${i + 1}. الاسم: ${
          e.name
        } - اللون:   <div style="height: 10px;width: 10px;background-color:${
          e.color
        } ;border-radius: 50%;"></div> - الحجم: ${e.size} - الكمية: ${
          e.quntity
        }</li>`
    )}
    </ul>
</ul>
<p>نود أن نقدم لك خيارات أخرى أو ننصحك بزيارة موقعنا لاختيار منتجات أخرى تناسب احتياجاتك.</p>
<p>إذا كان لديك أي استفسار أو ملاحظة، فلا تتردد في التواصل معنا عبر وسائل الاتصال المتاحة في الموقع.</p>
<p>نشكرك على تفهمك، ونأمل أن نتمكن من خدمتك في المستقبل.</p>
<p>مع خالص التقدير،</p>
<p>Fri7a</p>
`;

      let mailOption = {
        from: process.env.email,
        to: order2.email,
        subject: "متجر Fri7a clothes",
        html: htmlToSend(rejectionMessage),
      };
      transport.sendMail(mailOption, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
  }
  const order = await orderModel
    .aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "orders",
          let: { userId: "$userId", phone: "$phone" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$userId", "$$userId"] },
                    { $eq: ["$phone", "$$phone"] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: "$states",
                count: { $sum: 1 },
              },
            },
          ],
          as: "status",
        },
      },
    ])
    .then((res) => (res.length ? res[0] : null));
  res.status(200).send(order);
};
module.exports.statstique = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ states: { $ne: "removed" } })
      .count();
    const lastOrders = await orderModel
      .find({
        states: { $ne: "removed" },
        createAt: { $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24) },
      })
      .count();
    const likes = await likeModel.find({ type: "product" }).count();
    const lastLikes = await likeModel
      .find({
        type: "product",
        createAt: { $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24) },
      })
      .count();
    const sales = await orderModel.find({ states: "completed" }).count();
    const lastSales = await orderModel
      .find({
        createAt: {
          $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24),
        },
        states: "completed",
      })
      .count();
    const returns = await orderModel.find({ states: "return" }).count();
    const lastReturns = await orderModel
      .find({
        states: "return",
        createAt: {
          $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24),
        },
      })
      .count();
    res.status(200).json({
      orders,
      lastOrders,
      likes,
      lastLikes,
      sales,
      lastSales,
      returns,
      lastReturns,
    });
  } catch (e) {
    res.status(400).send(e);
  }
};
