update friend_relations
set user_id = null,
    new_relation = null
where id = $1