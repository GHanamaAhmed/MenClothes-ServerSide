module.exports.auth = (req, res) => {
  res.status(200).send();
};
module.exports.logOut = (req, res) => {
  console.log(req.user);
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).send();
  });
};
