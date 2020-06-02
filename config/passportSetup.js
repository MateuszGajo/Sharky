const passport = require("koa-passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const { client } = require("./pgAdaptor");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  return client.query("select * from users where id=$1", [id], (err, res) => {
    if (err) return done(null, false, { message: "connect-db-error" });
    if (res.rowCount == 0) return done(null, false, { message: "user-error" });
    done(null, id);
  });
});

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
      const query = "select * from users where facebookid=$1";

      client.query(query, [id], (err, res) => {
        if (err)
          return done(null, false, {
            message: "connect-db-error",
          });

        if (res.rowCount == 0) {
          const createNewUser =
            "INSERT INTO users(facebookId, firstName, lastName) VALUES($1,$2,$3) RETURNING id";
          client.query(createNewUser, [id, firstName, lastName], (err, res) => {
            console.log(res);
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
      const query = "select * from users where googleid=$1";

      client.query(query, [id], (err, res) => {
        console.log(res);
        if (err)
          return done(null, false, {
            message: "connect-db-error",
          });

        if (res.rowCount == 0) {
          const createNewUser =
            "INSERT INTO users(googleid, firstName, lastName) VALUES($1,$2,$3) RETURNING id";
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
