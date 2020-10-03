with userFriends as (
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
),
userChats as (
    select result.user_id_1 as "userId",
        chats.id as "chatId",
        chats.message_to as "messageTo",
        users.first_name as "firstName",
        users.last_name as "lastName",
        users.photo
    from(
            select *
            from userFriends
        ) as result
        inner join chats on chats.friendship_id = result.id
        left join users on users.id = result.user_id_1
),
lastMessage as (
    select a.message,
        a."chatId"
    from (
            select message,
                "chatId",
                row_number() over (
                    partition by b.chat_id
                    order by b.date desc
                ) as rn
            from userChats as a
                inner join chat_messages as b on a."chatId" = b.chat_id
        ) as a
    WHERE a.rn = 1
)
select a.*,
    b.message
from userChats as a
    left join lastMessage as b on a."chatId" = b."chatId"