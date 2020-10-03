insert into post_shares(post_id, user_id, date)
values($1, $2, $3)
returning id