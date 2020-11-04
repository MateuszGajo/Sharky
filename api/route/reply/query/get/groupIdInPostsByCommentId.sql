select group_id as "groupId",
    "postId"
from (
        select post_id as "postId"
        from post_comments
        where id = $1
    ) as a
    inner join posts as b on b.id = a."postId"