const getFriendsQuery = `
with friendIds as(
select user_id_1 as "userId" from friends where CASE when $4 then user_id_2=$1 and status='1' else user_id_2=$1 end
union
select user_id_2 as "userId" from friends where CASE when $4 then user_id_1=$1 and status='1' else user_id_1=$1 end 
),

friendsCounted as(
select a."userId", sum(a.count) as "numberOfFriends"	  
  from( select user_id_1 as "userId",count(user_id_1)  from friends where user_id_1 in(select * from friendIds) and status='1'  group by user_id_1
      union
      select user_id_2 as "userId",count(user_id_2)  from friends where user_id_2 in(select * from friendIds) and status='1'  group by user_id_2) as a
group by a."userId"
),

friendsStatus as(
select user_id_1 as "userId",id as "friendshipId",status,date, CASE WHEN status='0'  THEN true  else null end as "isInvited", null as "isInvitationSent" from friends where user_id_1 in(select * from friendIds) and user_id_2 =$2
union
select user_id_2 as "userId",id as "friendshipId",status,date,null as "isInvited",CASE WHEN status='0'  THEN true  else null end as "isInvitationSent" from friends where user_id_2 in(select * from friendIds) and user_id_1=$2
)

select d.*,e.first_name as "firstName", e.last_name as "lastName", e.photo
from(select a.*,coalesce(b."numberOfFriends",0) as "numberOfFriends", c.relation 
  from friendsStatus as a 
  left join friendsCounted as b on a."userId" = b."userId"
  left join friend_relations as c on a."friendshipId"= c.friendship_id
  union
  select a."userId",null as  friendshipId,null as  status,null as  date,null as "isInvited",null as "isInvitationSent",a."numberOfFriends",null as  relation from friendsCounted as a where a."userId" not in (select "userId" from friendsStatus)) as d
inner join users as e on d."userId" = e.id
order by "isInvited","isInvitationSent",date
limit 21 offset $3`;

const getSortedFriendsQuery = `
with friendIds as (
	select user_id_2 as "userId" from friends where user_id_1=$3 and status='1'
	union
	select user_id_1 as "userId" from friends where user_id_2=$3 and status='1'
),

userSorted as (
  select id from users 
  where(
	  (lower(first_name) like lower($1) and lower(last_name) like lower($2)) 
  	   or 
	  (lower(last_name) like lower($1) and lower(first_name) like lower($2)))
	   and
	   id in (select * from friendIds)
  ),
  
  userSortedCounted as(
  select a."userId",sum(a.count) as "numberOfFriends"
  from(select user_id_1 as "userId", count(user_id_1)  from friends where user_id_1 in(select * from userSorted) and status='1' group by "userId"
    union 
    select user_id_2 as "userId", count(user_id_2)  from friends where user_id_2 in(select * from userSorted) and status='1' group by "userId") as a
  group by a."userId"
  ),
  
  userRelation as (
    select  user_id_1 as "userId",id as "friendshipId",status,date, CASE WHEN status='0'  THEN true  else null end as "isInvited", null as "isInvitationSent"from friends where user_id_1 in (select * from userSorted) and user_id_2=$3
    union
    select user_id_2 as "userId",id as "friendshipId" ,status,date,null as "isInvited",CASE WHEN status='0'  THEN true  else null end as "isInvitationSent" from friends where user_id_2 in (select * from userSorted) and user_id_1=$3
  )
  
  select d.*,e.first_name as "firstName", e.last_name as "lastName", e.photo
  from(select a.*,b.relation,c."numberOfFriends" 
     from userRelation as a 
     left join friend_relations as b on a."friendshipId" =b.friendship_id 
     inner join userSortedCounted as c on  a."userId" = c."userId"
     union
     select a."userId",null as "friendshipId", null as status, null as date,null as "isInvited",null as "isInvitationSent", null as relation, b."numberOfFriends" 
     from userSortedCounted as a 
     inner join userSortedCounted as b on  a."userId" = b."userId"
     where a."userId" not in (select "userId" from userRelation)
     union
     select id as "userId", null as friendshipId,null as status, null as date,null as "isInvited",null as "isInvitationSent", null as relation,  0 as numberOfFriends
     from userSorted 
     where id not in (select "userId" from userSortedCounted)) as d
  inner join users as e on d."userId" = e.id
  order by "isInvited","isInvitationSent",date
  limit 21 offset $4
`;

const getSortedUsersQuery = `
with userSorted as (
  select id from users 
  where (lower(first_name) like lower($1) and lower(last_name) like lower($2) and id!= $3) 
  or (lower(last_name) like lower($1) and lower(first_name) like lower($2) and id!=$3)
  ),
  
  userSortedCounted as(
  select a."userId",sum(a.count) as "numberOfFriends"
  from(select user_id_1 as "userId", count(user_id_1)  from friends where user_id_1 in(select * from userSorted) and status='1' group by "userId"
    union 
    select user_id_2 as "userId", count(user_id_2)  from friends where user_id_2 in(select * from userSorted) and status='1' group by "userId") as a
  group by a."userId"
  ),
  
  userRelation as (
    select  user_id_1 as "userId",id as "friendshipId",status,date, CASE WHEN status='0'  THEN true  else null end as "isInvited", null as "isInvitationSent"from friends where user_id_1 in (select * from userSorted) and user_id_2=$3
    union
    select user_id_2 as "userId",id as "friendshipId" ,status,date,null as "isInvited",CASE WHEN status='0'  THEN true  else null end as "isInvitationSent" from friends where user_id_2 in (select * from userSorted) and user_id_1=$3
  )
  
  select d.*,e.first_name as "firstName", e.last_name as "lastName", e.photo
  from(select a.*,b.relation,coalesce(c."numberOfFriends",0)  as "numberOfFriends"
     from userRelation as a 
     left join friend_relations as b on a."friendshipId" =b.friendship_id 
     left join userSortedCounted as c on  a."userId" = c."userId"
     union
     select a."userId",null as "friendshipId", null as status, null as date,null as "isInvited",null as "isInvitationSent", null as relation, b."numberOfFriends" 
     from userSortedCounted as a 
     inner join userSortedCounted as b on  a."userId" = b."userId"
     where a."userId" not in (select "userId" from userRelation)
     union
     select id as "userId", null as friendshipId,null as status, null as date,null as "isInvited",null as "isInvitationSent", null as relation,  0 as numberOfFriends
     from userSorted 
     where id not in (select "userId" from userSortedCounted union select "userId" from userRelation)) as d
  inner join users as e on d."userId" = e.id
  order by "isInvited","isInvitationSent",date
  limit 21 offset $4`;

const getChatsQuery = `
select result.user_id_1 as "userId", chats.id as "chatId", chats.message_to as "messageTo", users.first_name as "firstName", users.last_name as "lastName", users.photo
  from(select user_id_1, id 
      from friends 
      where user_id_2=$1 and status='1'
      union
      select user_id_2, id
      from friends 
      where user_id_1=$1 and status='1') as result
      inner join chats on result.id = chats.friendship_id
left join users on users.id = result.user_id_1`;

const getfriendshipIDQuery = `
select id from friends where user_id_1=$1 and user_id_2=$2
union
select id from friends where user_id_2=$1 and user_id_1=$2
 `;

const addUserQuery = `
insert into friends(user_id_1, user_id_2, status) values($1,$2,'0') returning id;
`;

const deleteUserQuery = `delete from friends where id=$1;`;

const deleteFriendRelationQuery = `delete from friend_relations where friendship_id=$1`;

const deleteChatQuery = `delete from chats where id_frienship=$1`;

const acceptRequest = `update friends set status='1' where id=$1 and status='0' returning id`;

const setRelation = `insert into friend_relations(friendship_id, relation) values($1,$2) returning relation`;

const addChatQuery = `insert into chats(friendship_id) values($1) returning id`;

const removeFriendsRequest = `delete from friends where id=$1 and not exists(select id  from friends where id=$1 and status='1')`;

const readMessageQuery = `update chats set message_to=null where id=$1;`;

const updateRelationQuery = `update friend_relations set new_relation=$1, user_id=$2 where friendship_id=$3;`;

module.exports = {
  getFriendsQuery,
  getSortedFriendsQuery,
  getSortedUsersQuery,
  getChatsQuery,
  getfriendshipIDQuery,
  addUserQuery,
  deleteUserQuery,
  deleteFriendRelationQuery,
  deleteChatQuery,
  acceptRequest,
  setRelation,
  removeFriendsRequest,
  readMessageQuery,
  updateRelationQuery,
  addChatQuery,
};
