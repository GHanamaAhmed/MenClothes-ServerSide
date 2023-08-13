module.exports.auth = (req, res) => {
  res.status(200).send();
};
module.exports.logOut = (req, res) => {
  try {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.status(200).send();
    });
  } catch (e) {
    res.status(400).send(e);
  }
};
