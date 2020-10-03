update friend_relations
set new_relation = $1,
    user_id = $2
where friendship_id = $3