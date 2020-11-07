module.exports = (name) => {
  switch (name) {
    case "pl":
      return ["polish", "poland"];
    case "english":
      return ["english", "usa"];
    default:
      return ["english", "usa"];
  }
};
