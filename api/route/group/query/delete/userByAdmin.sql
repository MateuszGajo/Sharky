delete from group_users
where id = $1
    and group_id = $2
returning id