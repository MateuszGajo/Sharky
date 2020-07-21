const users = {};

const userJoin = (idUser) => {
  users[idUser] = true;
};

const existUser = (idUser) => (users[idUser] ? true : false);

const userLeave = (idUser) => {
  users[idUser] = false;
};

module.exports = { userJoin, userLeave, existUser };
