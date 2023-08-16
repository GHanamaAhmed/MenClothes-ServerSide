const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserModel = require("../models/userModel");
const admins = ["ghanamaahmed@gmail.com", "foxdeath100@mail.com"];
const passportGoogle = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "960212867626-nd0o9999bm3c0rvmd6ge91gvr4k6ncrs.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "https://api.fri7a.com/auth/google/callback",
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
