const passport = require("koa-passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuthStrategy;
const { client } = require("./pgAdaptor");

const findUserQuery =
  "select * from users where facebookid1='1590082907813263'";

passport.serializeUser((id, done) => {
  done(null, id);
});
passport.deserializeUser((id, done) => {
  return client.query("select * from users where id=$1", [id], (err, res) => {
    done(err, res);
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

      client.query(findUserQuery, (err, res) => {
        console.log(res);
        if (err)
          return done(null, false, {
            message: "connect-db-error",
          });
        if (res.rowCount == 0) {
          const createNewUser =
            "INSERT INTO users(facebookId, firstName, lastName) VALUES($1,$2,$3)";
          client.query(createNewUser, [id, firstName, lastName], (err, res) => {
            if (err) {
              return done(null, false, { message: "connect-db-error" });
            }
            if (res.rowCount === 0) {
              return done(null, false, { message: "create-user-error" });
            }
            return done(null, id);
          });
        } else return done(null, id);
      });
    }
  )
  // new GoogleStrategy(
  //   {
  //     consumerKey: process.env.GOOGLE_APPID,
  //     consumerSecret: process.env.GOOGLE_APPSECRET,
  //     callbackURL: "/auth/google/callback",
  //   },
  //   function (token, tokenSecret, profile, done) {}
  // )
);
