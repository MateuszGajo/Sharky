update group_users
set status = '1',
    role = 'member'
where id = $1