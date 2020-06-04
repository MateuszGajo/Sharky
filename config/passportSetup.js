const passport = require("koa-passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const jwt = require("jsonwebtoken");
const { client } = require("./pgAdaptor");
const { jwtSecret } = require("./keys");

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   return client.query("select * from users where id=$1", [id], (err, res) => {
//     if (err) return done(null, false, { message: "connect-db-error" });
//     if (res.rowCount == 0) return done(null, false, { message: "user-error" });
//     done(null, id);
//   });
// });

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APPID,
      clientSecret: process.env.FACEBOOK_APPSECRET,
      callbackURL: "/auth/facebook/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      const { displayName, id } = profile;

      const firstName = displayName.match(/^([\w\-]+)/g)[0];
      const lastName = displayName.match(/\b(\w+)\W*$/g)[0];
      const query = "select * from users where facebook_id=$1";

      client.query(query, [id], (err, res) => {
        if (err)
          return done(null, false, {
            message: "connect-db-error",
          });

        if (res.rowCount == 0) {
          const createNewUser =
            "INSERT INTO users(facebook_id, first_name, last_name) VALUES($1,$2,$3) RETURNING id";
          client.query(createNewUser, [id, firstName, lastName], (err, res) => {
            if (err) {
              return done(null, false, { message: "connect-db-error" });
            }

            if (res.rowCount === 0) {
              return done(null, false, { message: "create-user-error" });
            }
            const user = {
              id: res.rows[0].id,
              email: null,
              firstName,
              lastName,
              phone: null,
              country: null,
              language: null,
            };

            const token = jwt.sign(
              {
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
                data: user,
              },
              jwtSecret
            );

            return done(null, token);
          });
        } else {
          const user = res.rows[0];
          const {
            id,
            first_name,
            last_name,
            email,
            phone,
            country,
            language,
          } = user;
          const token = jwt.sign(
            {
              exp: Math.floor(Date.now() / 1000) + 60 * 60,
              data: {
                id,
                firstName: first_name,
                lastName: last_name,
                email,
                phone,
                country,
                language,
              },
            },
            jwtSecret
          );
          return done(null, token);
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
    },
    function (token, tokenSecret, profile, done) {
      const { displayName, id } = profile;
      const firstName = displayName.match(/^([\w\-]+)/g)[0];
      const lastName = displayName.match(/\b(\w+)\W*$/g)[0];
      const query = "select * from users where google_id=$1";

      client.query(query, [id], (err, res) => {
        if (err)
          return done(null, false, {
            message: "connect-db-error",
          });

        if (res.rowCount == 0) {
          const createNewUser =
            "INSERT INTO users(google_id, first_name, last_name) VALUES($1,$2,$3) RETURNING id";
          client.query(createNewUser, [id, firstName, lastName], (err, res) => {
            if (err) {
              return done(null, false, { message: "connect-db-error" });
            }

            if (res.rowCount === 0) {
              return done(null, false, { message: "create-user-error" });
            }
            const user = {
              id: res.rows[0].id,
              email: null,
              firstName,
              lastName,
              phone: null,
              country: null,
              language: null,
            };

            return done(null, user);
          });
        } else {
          const user = res.rows[0];
          return done(null, user);
        }
      });
    }
  )
);
