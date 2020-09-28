const getMessagesQuery = `
select c.id, c.chat_id as "chatId", c.user_id as "userId", c.message, c.date  from chat_messages as c
where chat_id = $1
`;

const addMessageQuery = `
insert into chat_messages(chat_id, user_id, message, date)
values($1, $2, $3, $4)
returning id
  `;

module.exports = {
  getMessagesQuery,
  addMessageQuery,
};
