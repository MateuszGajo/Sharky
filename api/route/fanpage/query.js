const getFanpagesQuery = `
with idFanpages as(
  select b.id_fanpage
    from(select a.id_fanpage
    from fanpage_users as a
    where id_user=$1) as b
  left join(
    select a.id_fanpage
    from fanpage_users as a
    where id_user=$2) as c
  on c.id_fanpage = b.id_fanpage
  where c.id_fanpage is null
  )

select a."idSub",a."idFanpage",a."numberOfSubscribes", b.name, b.description, b.photo
from(select id as "idSub",id_user,id_fanpage as "idFanpage", count(*) over (partition by id_fanpage)  as "numberOfSubscribes"
    from fanpage_users 
    where id_fanpage in(
        select a.id_fanpage
        from fanpage_users as a
        where id_user=$1
      )
    )as a
left join fanpages as b
on a."idFanpage" = b.id
where a.id_user=$2
union
select null as "idSub", b.*, fanpages.name, fanpages.description, fanpages.photo
from(select a.id as "idFanpage", count(*) as "numberOfSubscribes"
    from(select fanpages.id 
       from fanpages
       left join fanpage_users on
       fanpages.id = fanpage_users.id_fanpage
       where fanpages.id in(select * from idFanpages)
      ) as a
    group by a.id) as b
inner join fanpages on b."idFanpage" = fanpages.id
limit 21 offset $3`;

const getSortedSubscribedFanpagesQuery = `
with idSubscribedFanpages as(
  select id_fanpage from fanpage_users where id_user = $1
  ),
  
   fanpagesSorted as(
    select id from fanpages where lower(name) like($2) and id in(select * from idSubscribedFanpages)
  ),
  
  numberOfSubscribers as (
  select id_fanpage as "idFanpage",count(*) as "numberOfSubscribers" from fanpage_users where id_fanpage in(select * from fanpagesSorted) group by id_fanpage
  )
  
  select a.*, b.id as "idSub", c.name, c.photo from numberOfSubscribers as a
  left join fanpage_users  as b
  on a."idFanpage" = b.id_fanpage and b.id_user =$3
  inner join fanpages as c 
  on a."idFanpage" = c.id
  order by name asc
  limit 21 offset $4
`;

const getSortedFanpagesQuery = `
with fanpageSorted as(
  select id from fanpages where lower(name) like($1)
),

subscribedFanpages as (
select id_fanpage as "idFanpage",count(*) as "numberOfSubscribes" from fanpage_users where id_fanpage in(select * from fanpageSorted) group by id_fanpage
),

unSubscribedFanpages as(
select id, 0 as  "numberOfSubscribes" from fanpageSorted where id not in (select "idFanpage" from subscribedFanpages )
),

countedFanpages as(
select * from subscribedFanpages
union
select * from unSubscribedFanpages
)

select a.*, b.id as "idSub", c.name, c.photo from countedFanpages as a
left join fanpage_users  as b
on a."idFanpage" = b.id_fanpage and b.id_user =$2
inner join fanpages as c 
on a."idFanpage" = c.id
order by "idSub"
limit 21 offset $3`;

const createFanpageQuery = `insert into fanpages(name, description, photo, date) values($1, $2, 'fanpage.png', $3) returning id`;

const addAdminQuery = `insert into fanpage_users(id_fanpage, id_user, role) values($1, $2, 'admin')`;

const addUserQuery = `
insert into fanpage_users(id_fanpage, id_user, role) 
select $1, $2, $3 where not exists(select id from fanpage_users where id_fanpage=$1 and id_user=$2)
returning id
`;

const getFanpageAdminsQuery =
  "select * from fanpage_users where id_fanpage=$1 and role='admin'";

const getIdUserQuery = `select id from fanpage_users where id_fanpage=$1 and id_user=$2`;

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
};
