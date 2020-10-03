insert into chat_messages(chat_id, user_id, message, date)
values($1, $2, $3, $4)
returning id