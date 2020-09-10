const getFriendsQuery = `
with userFriends as(
select id_user_1 as "users" from friends where CASE when $4 then id_user_2=$1 else id_user_2=$1   end
union
select id_user_2 as "users" from friends where CASE when $4 then  id_user_1=$1 else id_user_1=$1   end 
),

userFriendsCounted as(
select a."idUser", sum(a.count) as "numberOfFriends"	  
  from( select id_user_1 as "idUser",count(id_user_1)  from friends where id_user_1 in(select * from userFriends) and status='1'  group by id_user_1
      union
      select id_user_2 as "idUser",count(id_user_2)  from friends where id_user_2 in(select * from userFriends) and status='1'  group by id_user_2) as a
group by a."idUser"
),

friendsStatus as(
select id_user_1 as "idUser",id as "idFriendShip",status,date, CASE WHEN status='0'  THEN true  else null end as "isInvited", null as "isInvitationSent" from friends where id_user_1 in(select * from userFriends) and id_user_2 =$2
union
select id_user_2 as "idUser",id as "idFriendShip",status,date,null as "isInvited",CASE WHEN status='0'  THEN true  else null end as "isInvitationSent" from friends where id_user_2 in(select * from userFriends) and id_user_1=$2
)

select d.*,e.first_name as "firstName", e.last_name as "lastName", e.photo
from(select a.*,coalesce(b."numberOfFriends",0) as "numberOfFriends", c.relation 
  from friendsStatus as a 
  left join userFriendsCounted as b on a."idUser" = b."idUser"
  left join friend_relation as c on a."idFriendShip"= c.id_friendship
  union
  select a."idUser",null as  idFriendShip,null as  status,null as  date,null as "isInvited",null as "isInvitationSent",a."numberOfFriends",null as  relation from userFriendsCounted as a where a."idUser" not in (select "idUser" from friendsStatus)) as d
inner join users as e on d."idUser" = e.id
order by "isInvited","isInvitationSent",date
limit 21 offset $3`;

const getSortedFriendsQuery = `
with idFriends as (
	select id_user_2 as "idUser" from friends where id_user_1=$3 and status='1'
	union
	select id_user_1 as "idUser" from friends where id_user_2=$3 and status='1'
),

userSorted as (
  select id from users 
  where(
	  (lower(first_name) like lower($1) and lower(last_name) like lower($2)) 
  	   or 
	  (lower(last_name) like lower($1) and lower(first_name) like lower($2)))
	   and
	   id in (select * from idFriends)
  ),
  
  userSortedCounted as(
  select a."idUser",sum(a.count) as "numberOfFriends"
  from(select id_user_1 as "idUser", count(id_user_1)  from friends where id_user_1 in(select * from userSorted) and status='1' group by "idUser"
    union 
    select id_user_2 as "idUser", count(id_user_2)  from friends where id_user_2 in(select * from userSorted) and status='1' group by "idUser") as a
  group by a."idUser"
  ),
  
  userRelation as (
    select  id_user_1 as "idUser",id as "idFriendShip",status,date, CASE WHEN status='0'  THEN true  else null end as "isInvited", null as "isInvitationSent"from friends where id_user_1 in (select * from userSorted) and id_user_2=$3
    union
    select id_user_2 as "idUser",id as "idFriendShip" ,status,date,null as "isInvited",CASE WHEN status='0'  THEN true  else null end as "isInvitationSent" from friends where id_user_2 in (select * from userSorted) and id_user_1=$3
  )
  
  select d.*,e.first_name as "firstName", e.last_name as "lastName", e.photo
  from(select a.*,b.relation,c."numberOfFriends" 
     from userRelation as a 
     left join friend_relation as b on a."idFriendShip" =b.id_friendship 
     inner join userSortedCounted as c on  a."idUser" = c."idUser"
     union
     select a."idUser",null as "idFriendShip", null as status, null as date,null as "isInvited",null as "isInvitationSent", null as relation, b."numberOfFriends" 
     from userSortedCounted as a 
     inner join userSortedCounted as b on  a."idUser" = b."idUser"
     where a."idUser" not in (select "idUser" from userRelation)
     union
     select id as "idUser", null as idFriendShip,null as status, null as date,null as "isInvited",null as "isInvitationSent", null as relation,  0 as numberOfFriends
     from userSorted 
     where id not in (select "idUser" from userSortedCounted)) as d
  inner join users as e on d."idUser" = e.id
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
  select a."idUser",sum(a.count) as "numberOfFriends"
  from(select id_user_1 as "idUser", count(id_user_1)  from friends where id_user_1 in(select * from userSorted) and status='1' group by "idUser"
    union 
    select id_user_2 as "idUser", count(id_user_2)  from friends where id_user_2 in(select * from userSorted) and status='1' group by "idUser") as a
  group by a."idUser"
  ),
  
  userRelation as (
    select  id_user_1 as "idUser",id as "idFriendShip",status,date, CASE WHEN status='0'  THEN true  else null end as "isInvited", null as "isInvitationSent"from friends where id_user_1 in (select * from userSorted) and id_user_2=$3
    union
    select id_user_2 as "idUser",id as "idFriendShip" ,status,date,null as "isInvited",CASE WHEN status='0'  THEN true  else null end as "isInvitationSent" from friends where id_user_2 in (select * from userSorted) and id_user_1=$3
  )
  
  select d.*,e.first_name as "firstName", e.last_name as "lastName", e.photo
  from(select a.*,b.relation,coalesce(c."numberOfFriends",0)  as "numberOfFriends"
     from userRelation as a 
     left join friend_relation as b on a."idFriendShip" =b.id_friendship 
     left join userSortedCounted as c on  a."idUser" = c."idUser"
     union
     select a."idUser",null as "idFriendShip", null as status, null as date,null as "isInvited",null as "isInvitationSent", null as relation, b."numberOfFriends" 
     from userSortedCounted as a 
     inner join userSortedCounted as b on  a."idUser" = b."idUser"
     where a."idUser" not in (select "idUser" from userRelation)
     union
     select id as "idUser", null as idFriendShip,null as status, null as date,null as "isInvited",null as "isInvitationSent", null as relation,  0 as numberOfFriends
     from userSorted 
     where id not in (select "idUser" from userSortedCounted union select "idUser" from userRelation)) as d
  inner join users as e on d."idUser" = e.id
  order by "isInvited","isInvitationSent",date
  limit 21 offset $4`;

const getChatsQuery = `
select result.id_user_1 as "idUser", chats.id as "idChat", chats.message_to as "messageTo", users.first_name as "firstName", users.last_name as "lastName", users.photo
  from(select id_user_1 
      from friends 
      where id_user_2=$1 and status='1'
      union
      select id_user_2
      from friends 
      where id_user_1=$1 and status='1') as result
      inner join chats on (chats.id_user_1 = result.id_user_1 and  chats.id_user_2=1) or (chats.id_user_2 = result.id_user_1 and  chats.id_user_1=1)
left join users on users.id = result.id_user_1`;

const addUserQuery = `
insert into friends(id_user_1, id_user_2, status) values($1,$2,'0') returning id;
`;

const removeUserQuery = `delete from friends where id=$1;`;

const acceptRequest = `update friends set status='1' where id=$1 and status='0' returning id`;

const setRelation = `insert into friend_relation(id_friendship, relation) values($1,$2) returning relation`;

const addChatQuery = `insert into chats(id_user_1, id_user_2) values($1, $2) returning id`;

const removeFriendsRequest = `delete from friends where id=$1 and not exists(select id  from friends where id=$1 and status='1')`;

const readMessageQuery = `update chats set message_to=null where id=$1;`;

const updateRelationQuery = `update friend_relation set new_relation=$1, id_user=$2 where id_friendship=$3;`;

module.exports = {
  getFriendsQuery,
  getSortedFriendsQuery,
  getSortedUsersQuery,
  getChatsQuery,
  addUserQuery,
  removeUserQuery,
  acceptRequest,
  setRelation,
  removeFriendsRequest,
  readMessageQuery,
  updateRelationQuery,
  addChatQuery,
};
