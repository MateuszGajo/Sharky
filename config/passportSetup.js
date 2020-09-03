const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const { client } = require("./pgAdaptor");

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
      const query = `select id, email, first_name as "firstName", last_name as "lastName", photo, phone, country, language, city, birth_date as "birthDate" from users where facebook_id=$1`;

      client.query(query, [id], (err, res) => {
        if (err) return done(null, false);
        if (res.rowCount == 0) {
          const createNewUser =
            "INSERT INTO users(facebook_id, first_name, last_name, photo) VALUES($1, $2, $3, 'profile.png') RETURNING id";
          client.query(createNewUser, [id, firstName, lastName], (err, res) => {
            if (err) return done(null, false);

            if (res.rowCount == 0);

            if (res.rowCount == 1) {
              const user = {
                id: res.rows[0].id,
                email: null,
                firstName,
                lastName,
                photo: "profile.png",
                phone: null,
                country: null,
                language: null,
                city: null,
                birthDate: null,
              };
              return done(null, user);
            }
          });
        } else {
          const {
            id,
            email,
            firstName,
            lastName,
            photo,
            phone,
            country,
            language,
            city,
            birthDate,
          } = res.rows[0];

          const user = {
            id,
            email,
            firstName,
            lastName,
            photo,
            phone,
            country,
            language,
            city,
            birthDate,
          };
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
      const query = `select id, email, first_name as "firstName", last_name as "lastName", phone, country, language, photo, birth_date as "birthDate", city from users where google_id=$1`;

      client.query(query, [id], (err, res) => {
        if (err) return done(null, false);

        if (res.rowCount == 0) {
          const createNewUser =
            "INSERT INTO users(google_id, first_name, last_name, photo) VALUES($1, $2, $3, 'profile.png') RETURNING id";
          client.query(createNewUser, [id, firstName, lastName], (err, res) => {
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
                country: null,
                language: null,
                city: null,
                birthDate: null,
              };
              return done(null, user);
            }
          });
        } else {
          const {
            id,
            email,
            firstName,
            lastName,
            photo,
            phone,
            country,
            language,
            city,
            birthDate,
          } = res.rows[0];

          const user = {
            id,
            email,
            firstName,
            lastName,
            photo,
            phone,
            country,
            language,
            city,
            birthDate,
          };
          return done(null, user);
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
    },
    function (token, tokenSecret, profile, done) {
      const { displayName, id } = profile;
      const firstName = displayName.match(/^([\w\-]+)/g)[0];
      const lastName = displayName.match(/\b(\w+)\W*$/g)[0];
      const query = `select id, email, first_name as "firstName", last_name as "lastName", photo, phone, country, language, city, birth_date as "birthDate" from users where twitter_id=$1`;

      client.query(query, [id], (err, res) => {
        if (err) return done(null, false);

        if (res.rowCount == 0) {
          const createNewUser =
            "INSERT INTO users(twitter_id, first_name, last_name, photo) VALUES($1, $2, $3, 'profile.png') RETURNING id";
          client.query(createNewUser, [id, firstName, lastName], (err, res) => {
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
                country: null,
                language: null,
                city: null,
                birthDate: null,
              };
              return done(null, user);
            }
          });
        } else {
          const {
            id,
            email,
            firstName,
            lastName,
            photo,
            phone,
            country,
            language,
            city,
            birthDate,
          } = res.rows[0];

          const user = {
            id,
            email,
            firstName,
            lastName,
            photo,
            phone,
            country,
            language,
            city,
            birthDate,
          };
          return done(null, user);
        }
      });
    }
  )
);
