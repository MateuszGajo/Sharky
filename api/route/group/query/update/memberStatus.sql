update group_users
set status = '1',
    role = 'member',
    date = current_timestamp
where id = $1
    and user_id = $2