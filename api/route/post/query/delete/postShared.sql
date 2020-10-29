delete from post_shares
where id = $1
    and user_id = $2
returning id