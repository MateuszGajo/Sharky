delete from fanpage_users
where id = $1
    and fanpage_id = $2
returning id