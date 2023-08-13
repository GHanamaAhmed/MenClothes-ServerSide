module.exports.auth = (req, res) => {
  res.status(200).send();
};
module.exports.logOut = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).send();
  });
};
