const users = {};

const userJoin = (idUser, idSocket) => {
  users[idUser] = [...(users[idUser] ? users[idUser] : []), idSocket];
};

const existUser = (idUser) => {
  if (!users[idUser]) return false;
  return users[idUser].length > 0 ? true : false;
};

const getSocket = (idUser) => {
  if (!users[idUser]) return null;
  return users[idUser];
};

const userLeave = (idUser, idSocket) => {
  let newUser = [];
  if (users[idUser]) newUser = users[idUser].filter((user) => user != idSocket);
  users[idUser] = newUser;
};

module.exports = { userJoin, userLeave, existUser, getSocket };
