insert into friend_relations(friendship_id, relation)
values($1, $2)
returning relation