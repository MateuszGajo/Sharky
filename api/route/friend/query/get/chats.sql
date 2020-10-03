select result.user_id_1 as "userId",
    chats.id as "chatId",
    chats.message_to as "messageTo",
    users.first_name as "firstName",
    users.last_name as "lastName",
    users.photo
from(
        select user_id_1,
            id
        from friends
        where user_id_2 = $1
            and status = '1'
        union
        select user_id_2,
            id
        from friends
        where user_id_1 = $1
            and status = '1'
    ) as result
    inner join chats on result.id = chats.friendship_id
    left join users on users.id = result.user_id_1