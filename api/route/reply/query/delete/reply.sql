delete from comment_replies
where id = $1
    and user_id = $2