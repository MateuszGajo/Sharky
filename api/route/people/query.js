const group_getFriendsQuery = `
with userFriends as(
select id_user_1 as "idUser" from friends where id_user_2=$1  and status='1' 
union
select id_user_2 as "idUser" from friends where  id_user_1=$1  and status='1'  
),
        
userFriendsCounted as(
select a."idUser", sum(a.count) as "numberOfFriends"	  
from( select id_user_1 as "idUser",count(id_user_1)  from friends where id_user_1 in(select * from userFriends) group by id_user_1
union
select id_user_2 as "idUser",count(id_user_2)  from friends where id_user_2 in(select * from userFriends) group by id_user_2) as a
group by a."idUser"
),
        
invitedFriends as (
select id_user as "idUser",id::text as "idSub",status::text, CASE WHEN status='0'  THEN true::text  else null end as "isInvitationSent" from group_users where id_user in (select * from userFriends) and id_group=$2	
),
		
notInvitedFriends as(
select *, null as "idSub", null as status, null as "isInvitationSent" from userFriends where "idUser" not in (select "idUser" from invitedFriends)
),
		
friendsStatus as (
select * from invitedFriends
union
select * from notInvitedFriends
)
		
select a.*, b."numberOfFriends", c.first_name as "firstName", c.last_name as "lastName", c.photo
from friendsStatus as a
inner join userFriendsCounted as b on a."idUser" = b."idUser"
inner join users as c on a."idUser" = c.id
order by c.first_name asc
limit 21 offset $3`;

const group_getPeopleQuery = `
with usersSorted as (
select id from users 
where (lower(first_name) like lower($1) and lower(last_name) like lower($2)) 
or (lower(last_name) like lower($1) and lower(first_name) like lower($2))
),
        
usersSortedCounted as(
select a."idUser",sum(a.count) as "numberOfFriends"
from(select id_user_1 as "idUser", count(id_user_1)  from friends where id_user_1 in(select * from usersSorted) group by "idUser"
union 
select id_user_2 as "idUser", count(id_user_2)  from friends where id_user_2 in(select * from usersSorted) group by "idUser") as a
group by a."idUser"
),
        
invitedUsers as (
select  id_user as  "idUser",id::text as "idSub",status::text, CASE WHEN status='0'  THEN true::text  else null end as "isInvitationSent" from group_users where id_user in (select *from usersSorted) and id_group=$3
),
    
notInvitedUsers as(
select id as "idUser", null as "idSub", null as status, null as "isInvitationSent" from usersSorted where id not in (select "idUser" from invitedUsers)
),
    
usersStatus as (
select * from invitedUsers
union
select * from notInvitedUsers
)
    
    
select a.*, b."numberOfFriends", c.first_name as "firstName", c.last_name  as "lastName", c.photo 
from usersStatus as a 
inner join usersSortedCounted as b on a."idUser" = b."idUser"
inner join users as c on a."idUser" = c.id
order by c.first_name desc
limit 21 offset $4`;

module.exports = { group_getFriendsQuery, group_getPeopleQuery };
