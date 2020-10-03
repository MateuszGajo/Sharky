update friends
set status = '1'
where id = $1
    and status = '0'
returning id