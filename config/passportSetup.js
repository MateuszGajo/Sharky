const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const { client } = require("./pgAdaptor");
const defaultCountryAndLanguage = require("../utils/defaultCountryAndLanguage");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APPID,
      clientSecret: process.env.FACEBOOK_APPSECRET,
      callbackURL: "/auth/facebook/callback",
      passReqToCallback: true,
    },
    function (req, accessToken, refreshToken, profile, done) {
      const { displayName, id } = profile;
      const defaultValues = defaultCountryAndLanguage(
        req.cookies["next-i18next"]
      );
      const [defaultLanguage, defaultCountry] = defaultValues;

      const firstName = displayName.match(/^([\w\-]+)/g)[0];
      const lastName = displayName.match(/\b(\w+)\W*$/g)[0];
      const query = `select id, email, first_name as "firstName", last_name as "lastName", photo, phone, country, language, city, birthdate from users where facebook_id=$1`;

      client.query(query, [id], (err, res) => {
        if (err) return done(null, false);
        if (res.rowCount == 0) {
          const createUser =
            "INSERT INTO users(facebook_id, first_name, last_name, photo, country, language) VALUES($1, $2, $3, 'profile.png', $4, $5) RETURNING id";
          client.query(
            createUser,
            [id, firstName, lastName, defaultCountry, defaultLanguage],
            (err, res) => {
              if (err || res.rowCount == 0) return done(null, false);
              if (res.rowCount == 1) {
                const user = {
                  id: res.rows[0].id,
                  email: null,
                  firstName,
                  lastName,
                  photo: "profile.png",
                  phone: null,
                  country: defaultCountry,
                  language: defaultLanguage,
                  city: null,
                  birthdate: null,
                };
                return done(null, user);
              }
            }
          );
        } else {
          return done(null, res.rows[0]);
        }
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_APPID,
      clientSecret: process.env.GOOGLE_APPSECRET,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
    },
    function (req, token, tokenSecret, profile, done) {
      const { displayName, id } = profile;
      const defaultValues = defaultCountryAndLanguage(
        req.cookies["next-i18next"]
      );
      const [defaultLanguage, defaultCountry] = defaultValues;

      const firstName = displayName.match(/^([\w\-]+)/g)[0];
      const lastName = displayName.match(/\b(\w+)\W*$/g)[0];
      const query = `select id, email, first_name as "firstName", last_name as "lastName", phone, country, language, photo, birthdate, city from users where google_id=$1`;

      client.query(query, [id], (err, res) => {
        if (err) return done(null, false);

        if (res.rowCount == 0) {
          const createUser =
            "INSERT INTO users(google_id, first_name, last_name, photo, country, language) VALUES($1, $2, $3, 'profile.png', $4, $5) RETURNING id";
          client.query(
            createUser,
            [id, firstName, lastName, defaultCountry, defaultLanguage],
            (err, res) => {
              if (err || res.rowCount == 0) return done(null, false);

              if (res.rowCount == 1) {
                const user = {
                  id: res.rows[0].id,
                  email: null,
                  firstName,
                  lastName,
                  photo: "profile.png",
                  phone: null,
                  country: defaultCountry,
                  language: defaultLanguage,
                  city: null,
                  birthdate: null,
                };
                return done(null, user);
              }
            }
          );
        } else {
          return done(null, res.rows[0]);
        }
      });
    }
  )
);

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_APPID,
      consumerSecret: process.env.TWITTER_APPSECRET,
      callbackURL: "/auth/twitter/callback",
      passReqToCallback: true,
    },
    function (req, token, tokenSecret, profile, done) {
      const { displayName, id } = profile;
      const defaultValues = defaultCountryAndLanguage(
        req.cookies["next-i18next"]
      );
      const [defaultLanguage, defaultCountry] = defaultValues;
      const firstName = displayName.match(/^([\w\-]+)/g)[0];
      const lastName = displayName.match(/\b(\w+)\W*$/g)[0];
      const query = `select id, email, first_name as "firstName", last_name as "lastName", photo, phone, country, language, city, birthdate from users where twitter_id=$1`;

      client.query(query, [id], (err, res) => {
        if (err) return done(null, false);

        if (res.rowCount == 0) {
          const createUser =
            "INSERT INTO users(twitter_id, first_name, last_name, photo, country, language) VALUES($1, $2, $3, 'profile.png', $4, $5) RETURNING id";
          client.query(
            createUser,
            [id, firstName, lastName, defaultCountry, defaultLanguage],
            (err, res) => {
              if (err) return done(null, false);

              if (res.rowCount == 0) return done(null, false);

              if (res.rowCount == 1) {
                const user = {
                  id: res.rows[0].id,
                  email: null,
                  firstName,
                  lastName,
                  photo: "profile.png",
                  phone: null,
                  country: defaultCountry,
                  language: defaultLanguage,
                  city: null,
                  birthdate: null,
                };
                return done(null, user);
              }
            }
          );
        } else {
          return done(null, res.rows[0]);
        }
      });
    }
  )
);
