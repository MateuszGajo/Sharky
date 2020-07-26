const { ConsoleView } = require("react-device-detect");

const users = {};

const userJoin = (idUser, idSocket) => {
  users[idUser] = [...(users[idUser] ? users[idUser] : []), idSocket];
};

const existUser = (idUser) => (users[idUser].length > 0 ? true : false);

const userLeave = (idUser, idSocket) => {
  let newUser = [];
  if (users[idUser]) newUser = users[idUser].filter((user) => user != idSocket);
  users[idUser] = newUser;
};

module.exports = { userJoin, userLeave, existUser };
