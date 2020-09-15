const getMessagesQuery = `
select c.id, c.id_chat as "idChat", c.id_user as "idUser", c.message, c.date  from chat_messages as c
where id_chat = $1
`;

const getConversationsQuery = `
with userFriends as (
select id_user_1, id 
from friends 
where id_user_2=$1 and status='1'
union
select id_user_2, id
from friends 
where id_user_1=$1 and status='1'
),

userChats as (
select result.id_user_1 as "idUser", chats.id as "idChat", chats.message_to as "messageTo", users.first_name as "firstName", users.last_name as "lastName", users.photo
from(select * from userFriends) as result
inner join chats on chats.id_friendship = result.id
left join users on users.id = result.id_user_1
),

lastMessage as (
select a.message, a."idChat"
from (
    select message, "idChat",
          row_number() over (partition by b.id_chat order by b.date desc) as rn
      from userChats as a
  inner join chat_messages as b
  on a."idChat" = b.id_chat
) as a
WHERE a.rn = 1
)

select a.*, b.message from userChats as a
left join lastMessage as b on a."idChat" = b."idChat"
`;

const addMessageQuery = `
insert into chat_messages(id_chat, id_user, message, date)
values($1, $2, $3, $4)
returning id
  `;

module.exports = {
  getMessagesQuery,
  getConversationsQuery,
  addMessageQuery,
};
