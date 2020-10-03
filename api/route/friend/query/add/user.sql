insert into friends(user_id_1, user_id_2, status)
values($1, $2, '0')
returning id