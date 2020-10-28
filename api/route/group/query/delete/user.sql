delete from group_users
where group_id = $1
    and user_id = $2