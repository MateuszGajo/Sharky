select c.id,
    c.chat_id as "chatId",
    c.user_id as "userId",
    c.message,
    c.date
from chat_messages as c
where chat_id = $1