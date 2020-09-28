const users = {};

const userJoin = (userId, idSocket) => {
  users[userId] = [...(users[userId] ? users[userId] : []), idSocket];
};

const existUser = (userId) => {
  if (!users[userId]) return false;
  return users[userId].length > 0 ? true : false;
};

const getSocket = (userId) => {
  if (!users[userId]) return null;
  return users[userId];
};

const userLeave = (userId, idSocket) => {
  let newUser = [];
  if (users[userId]) newUser = users[userId].filter((user) => user != idSocket);
  users[userId] = newUser;
};

module.exports = { userJoin, userLeave, existUser, getSocket };
