const passport = require("koa-passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuthStrategy;
const { client } = require("./pgAdaptor");

const findUserQuery = "select * from users where $1=$2";

passport.serializeUser((user, done) => {
  // console.log(user);
  done(null, user.id);
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

      client.query(findUserQuery, ["facebookId", id], (err, res) => {
        if (err)
          return next(null, false, {
            message: "invalid e-mail address or password",
          });
        if (res.rowCount == 0) {
          console.log("Stwórzmy użytkownika");
          const createNewUser =
            "INSERT INTO users(facebookId, firstName, lastName)";
          client.query(createNewUser, [id, firstName, lastName], (err, res) => {
            if (err) {
              console.log("błąd");
              // console.log(err);
              // console.log(res);
              return done(null, false, { message: "Incorrect password." });
            }
            if (res.rowCount === 0) {
              console.log(res);
              return done(null, false, "create user error");
            }
            console.log(res);
            return done(err, res);
          });
        } else return done(err, res);
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
