insert into posts(user_id, content, date, photo)
values($1, $2, $3, $4)
returning id