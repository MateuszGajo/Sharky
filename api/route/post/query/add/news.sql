insert into posts(user_id, is_news, content, date, photo)
values($1, true, $2, $3, $4)
returning id