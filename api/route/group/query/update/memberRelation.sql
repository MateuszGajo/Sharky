update group_users
set role = $1
where id = $2
    and group_id = $3