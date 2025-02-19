import passport from "passport";
import User from "../models/UserModel.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

export const configurePassport = () => {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/v1/auth/google/callback",
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id }).populate(
            "followers following profile"
          );

          if (!user) {
            user = new User({
              googleId: profile.id,
              username: profile.emails[0].value.split("@")[0],
              email: profile.emails[0].value,
              profilePic: profile.photos[0].value,
              name: profile.displayName,
            });
            await user.save();
          }

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
  return passport;
};
