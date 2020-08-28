const getMessagesQuery = `
select c.id, c.id_chat as "idChat", c.id_user as "idUser", c.message, c.date  from chat_messages as c
where id_chat = $1
`;

const addMessageQuery = `
insert into chat_messages(id_chat, id_user, message, date)
values($1, $2, $3, $4)
returning id
  `;

module.exports = {
  getMessagesQuery,
  addMessageQuery,
};
