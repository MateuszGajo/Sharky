const chats = {};

const joinChat = (idChat, idSocket) => {
  chats[idChat] = [...(chats[idChat] ? chats[idChat] : []), idSocket];
};

const chatUsers = (idChat) => chats[idChat];

const leaveChat = (idChat, idSocket) => {
  chats[idChat] = chats[idChat].filter((chat) => chat != idSocket);
};
module.exports = { joinChat, chatUsers, leaveChat };
