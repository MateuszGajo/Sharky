update fanpage_users
set role = $1
where id = $2
    and fanpage_id = $3