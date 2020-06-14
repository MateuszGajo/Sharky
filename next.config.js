const withSass = require("@zeit/next-sass");
module.exports = withSass({
  node: {
    fs: "empty",
  },
});
