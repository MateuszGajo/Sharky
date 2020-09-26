const group_getFriendsQuery = `
with friendIds as(
select user_id_1 as "userId" from friends where user_id_2=$1  and status='1' 
union
select user_id_2 as "userId" from friends where  user_id_1=$1  and status='1'  
),
        
friendsCounted as(
select a."userId", sum(a.count) as "numberOfFriends"	  
from( select user_id_1 as "userId",count(user_id_1)  from friends where user_id_1 in(select * from friendIds) group by user_id_1
union
select user_id_2 as "userId",count(user_id_2)  from friends where user_id_2 in(select * from friendIds) group by user_id_2) as a
group by a."userId"
),
        
friendsInvited as (
select user_id as "userId",id::text as "subId",status::text, CASE WHEN status='0'  THEN true::text  else null end as "isInvitationSent" from group_users where user_id in (select * from friendIds) and group_id=$2	
),
		
friendsNotInvited as(
select *, null as "subId", null as status, null as "isInvitationSent" from friendIds where "userId" not in (select "userId" from friendsInvited)
),
		
friendsStatus as (
select * from friendsInvited where status !='1'
union
select * from friendsNotInvited
)
		
select a.*, b."numberOfFriends", c.first_name as "firstName", c.last_name as "lastName", c.photo
from friendsStatus as a
inner join friendsCounted as b on a."userId" = b."userId"
inner join users as c on a."userId" = c.id
order by c.first_name asc
limit 21 offset $3`;

const group_getPeopleQuery = `
with usersSorted as (
select id from users 
where (lower(first_name) like lower($1) and lower(last_name) like lower($2)) 
or (lower(last_name) like lower($1) and lower(first_name) like lower($2))
),
        
usersSortedCounted as(
select a."userId",sum(a.count) as "numberOfFriends"
from(select user_id_1 as "userId", count(user_id_1)  from friends where user_id_1 in(select * from usersSorted) group by "userId"
union 
select user_id_2 as "userId", count(user_id_2)  from friends where user_id_2 in(select * from usersSorted) group by "userId") as a
group by a."userId"
),
        
usersInvited as (
select  user_id as  "userId",id::text as "subId",status::text, CASE WHEN status='0'  THEN true::text  else null end as "isInvitationSent" from group_users where user_id in (select *from usersSorted) and group_id=$3
),
    
usersNotInvited as(
select id as "userId", null as "subId", null as status, null as "isInvitationSent" from usersSorted where id not in (select "userId" from usersInvited)
),
    
usersStatus as (
select * from usersInvited where status !='1'
union
select * from usersNotInvited
)
    
    
select a.*, b."numberOfFriends", c.first_name as "firstName", c.last_name  as "lastName", c.photo 
from usersStatus as a 
inner join usersSortedCounted as b on a."userId" = b."userId"
inner join users as c on a."userId" = c.id
order by c.first_name desc
limit 21 offset $4`;

module.exports = { group_getFriendsQuery, group_getPeopleQuery };
