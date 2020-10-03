update friend_relations
set user_id = null,
    new_relation = null,
    relation = $1
where id = $2