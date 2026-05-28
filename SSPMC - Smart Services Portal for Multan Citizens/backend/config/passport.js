import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/api/users/auth/google/callback`,
    scope: ["profile", "email"]
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        
        // Check if user already exists via Google ID
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
            // Check if user registered locally with this email previously
            user = await User.findOne({ email: email.toLowerCase() });
            
            if (user) {
                // Link Google account to existing local account
                user.googleId = profile.id;
                user.authProvider = "google";
                await user.save();
            } else {
                // Provision a brand new OAuth account
                user = new User({
                    firstname: profile.name.givenName || "Firstname",
                    lastname: profile.name.familyName || "Lastname",
                    email: email,
                    googleId: profile.id,
                    authProvider: "google",
                    isVerified: true // Google already verified this email address
                });
                await user.save();
            }
        }
        
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
  }
));