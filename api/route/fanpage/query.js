const getFanpagesQuery = `
with fanpageIds as(
  select b.fanpage_id
    from(select a.fanpage_id
    from fanpage_users as a
    where user_id=$1) as b
  left join(
    select a.fanpage_id
    from fanpage_users as a
    where user_id=$2) as c
  on c.fanpage_id = b.fanpage_id
  where c.fanpage_id is null
  )

select a."subId",a."fanpageId",a."numberOfSubscribes", b.name, b.description, b.photo
from(select id as "subId",user_id,fanpage_id as "fanpageId", count(*) over (partition by fanpage_id)  as "numberOfSubscribes"
    from fanpage_users 
    where fanpage_id in(
        select a.fanpage_id
        from fanpage_users as a
        where user_id=$1
      )
    )as a
left join fanpages as b
on a."fanpageId" = b.id
where a.user_id=$2
union
select null as "subId", b.*, fanpages.name, fanpages.description, fanpages.photo
from(select a.id as "fanpageId", count(*) as "numberOfSubscribes"
    from(select fanpages.id 
       from fanpages
       left join fanpage_users on
       fanpages.id = fanpage_users.fanpage_id
       where fanpages.id in(select * from fanpageIds)
      ) as a
    group by a.id) as b
inner join fanpages on b."fanpageId" = fanpages.id
limit 21 offset $3`;

const getSortedSubscribedFanpagesQuery = `
with fanpageSubscribedIds as(
  select fanpage_id from fanpage_users where user_id = $1
  ),
  
   fanpagesSorted as(
    select id from fanpages where lower(name) like($2) and id in(select * from fanpageSubscribedIds)
  ),
  
  numberOfSubscribers as (
  select fanpage_id as "fanpageId",count(*) as "numberOfSubscribers" from fanpage_users where fanpage_id in(select * from fanpagesSorted) group by fanpage_id
  )
  
  select a.*, b.id as "subId", c.name, c.photo from numberOfSubscribers as a
  left join fanpage_users  as b
  on a."fanpageId" = b.fanpage_id and b.user_id =$3
  inner join fanpages as c 
  on a."fanpageId" = c.id
  order by name asc
  limit 21 offset $4
`;

const getSortedFanpagesQuery = `
with fanpageSorted as(
  select id from fanpages where lower(name) like($1)
),

fanpagesSubscribed as (
select fanpage_id as "fanpageId",count(*) as "numberOfSubscribes" from fanpage_users where fanpage_id in(select * from fanpageSorted) group by fanpage_id
),

fanpagesUnsubscribed as(
select id, 0 as  "numberOfSubscribes" from fanpageSorted where id not in (select "fanpageId" from fanpagesSubscribed )
),

fanpagesCounted as(
select * from fanpagesSubscribed
union
select * from fanpagesUnsubscribed
)

select a.*, b.id as "subId", c.name, c.photo from fanpagesCounted as a
left join fanpage_users  as b
on a."fanpageId" = b.fanpage_id and b.user_id =$2
inner join fanpages as c 
on a."fanpageId" = c.id
order by "subId"
limit 21 offset $3`;

const createFanpageQuery = `insert into fanpages(name, description, photo, date) values($1, $2, 'fanpage.png', $3) returning id`;

const addAdminQuery = `insert into fanpage_users(fanpage_id, user_id, role) values($1, $2, 'admin')`;

const addUserQuery = `
insert into fanpage_users(fanpage_id, user_id, role) 
select $1, $2, $3 where not exists(select id from fanpage_users where fanpage_id=$1 and user_id=$2)
returning id
`;

const getFanpageAdminsQuery =
  "select * from fanpage_users where id_fanpage=$1 and role='admin'";

const getIdUserQuery = `select id from fanpage_users where fanpage_id=$1 and user_id=$2`;

const deleteUserQuery = `delete from fanpage_users where id=$1`;

const fanpageInfoQuery = `
select a.*,a."idFanpage", b.name, b.date	
from(select id_fanpage as "idFanpage", count(*) as "numberOfSubscribers" 
  from fanpage_users 
  where id_fanpage=$1 
  group by "idFanpage") as a
inner join fanpages as b
on a."idFanpage" = b.id
`;

const checkUserQuery = `
select a.*,b.id as "idSub",b.role
from(select  id 
	from fanpages 
	where id=$1) as a
left join fanpage_users as b on a.id=b.id_fanpage and b.id_user=$2
`;

const deleteFanpageQuery = "delete from fanpages where id=$1";

const deleteFanpageUsersQuery = "delete from fanpage_users where id_fanpage=$1";

const deleteFanpagePostsQuery = "delete from posts where id_fanpage=$1";

const getMembersQuery = `
select a.id as "idSub", a.id_user as "idUser",a.role, b.first_name as "firstName", b.last_name as "lastName", b.photo 
from fanpage_users as a
inner join users as b
on b.id = a.id_user
where a.id_fanpage=$1
limit 21 offset $2
`;

const updateMemberRealtionQuery = `update fanpage_users set role=$1 where id=$2`;

const changeFanpagePhotoQuery = `update fanpages set photo=$1 where id=$2`;

module.exports = {
  getFanpagesQuery,
  getSortedFanpagesQuery,
  getSortedSubscribedFanpagesQuery,
  addUserQuery,
  deleteUserQuery,
  getIdUserQuery,
  getFanpageAdminsQuery,
  fanpageInfoQuery,
  checkUserQuery,
  deleteFanpageQuery,
  deleteFanpageUsersQuery,
  deleteFanpagePostsQuery,
  getMembersQuery,
  updateMemberRealtionQuery,
  createFanpageQuery,
  addAdminQuery,
  changeFanpagePhotoQuery,
};
