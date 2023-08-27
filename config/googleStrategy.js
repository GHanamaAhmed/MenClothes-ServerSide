const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserModel = require("../models/userModel");
const admins = ["ghanamaahmed@gmail.com", "foxdeath100@gmail.com"];
const passportGoogle = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          process.env.googleClientID,
        clientSecret:process.env.googleClientSecret,
        callbackURL:process.env.googleCallbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        let user = await UserModel.findOne({
          clientId: profile?.id,
          provider: profile?.provider,
        });
        if (!user) {
          user = new UserModel({
            email: profile?.emails[0]?.value,
            clientId: profile?.id,
            provider: profile?.provider,
            Photo: profile?.photos[0]?.value,
            role: admins.includes(profile.emails[0].value) ? "admin" : "client",
            sex: profile?.gender,
            firstName: profile?.name.givenName,
            lastName: profile?.name.familyName,
            age: profile?.birthday,
          });
          await user.save();
        }
        done(null, user);
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
module.exports = passportGoogle;
