insert into posts(user_id, fanpage_id, content, date, photo)
values($1, $2, $3, $4, $5)
returning id