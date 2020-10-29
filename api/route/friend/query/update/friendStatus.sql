update friends
set status = '1'
where (
        user_id_1 = $1
        and user_id_2 = $2
        and status = '0'
    )
    or (
        user_id_1 = $2
        and user_id_2 = $1
        and status = '0'
    )
returning id