const getGroupsQuery = `
with idGroups as(
  select b.id_group
    from(select a.id_group
    from group_users as a
    where id_user=$1) as b
  left join(
    select a.id_group
    from group_users as a
    where id_user=$2) as c
  on c.id_group = b.id_group
  where c.id_group is null
  )
  
  select a."idSub",a."idGroup",a."numberOfMembers", b.name, b.description, b.photo
  from(select id as "idSub",id_group as "idGroup", count(*) over (partition by id_group)  as "numberOfMembers",id_user
       from group_users 
       where id_group in(
            select a.id_group
            from group_users as a
            where id_user=$1
          )
        ) as a
     left join groups as b
  on a."idGroup" = b.id
  where a.id_user =$2
  union
  select null as "idSub", b.*, groups.name, groups.description, groups.photo
  from(select a.id as "idGroup", count(*) as "numberOfMembers"
    from(select groups.id 
       from groups
       left join group_users on
       groups.id = group_users.id_group
       where groups.id in(select * from idGroups)
      ) as a
    group by a.id) as b
  inner join groups on b."idGroup" = groups.id
  limit 21 offset $3
`;

const getSortedSubscribedGroupsQuery = `
with idSubscribedGroups as(
select id_group from group_users where id_user = $1
),

  groupSorted as(
  select id from groups where lower(name) like($2) and id in(select * from idSubscribedGroups)
),

numberOfMembers as (
select id_group as "idGroup",count(*) as "numberOfMembers" from group_users where id_group in(select * from groupSorted) group by id_group
)

select a.*, b.id as "idSub", c.name, c.photo from numberOfMembers as a
left join group_users  as b
on a."idGroup" = b.id_group and b.id_user =$3
inner join groups as c 
on a."idGroup" = c.id
order by name asc
limit 21 offset $4
`;

const getSortedGroupsQuery = `
with groupSorted as(
  select id from groups where lower(name) like($1)
),

subscribedGroups as (
select id_group as "idGroup",count(*) as "numberOfMembers" from group_users where id_group in(select * from groupSorted) group by id_group
),

unSubscribedGroups as(
select id, 0 as  "numberOfMembers" from groupSorted where id not in (select "idGroup" from  subscribedGroups )
),

countedGroups as(
select * from subscribedGroups
union
select * from unSubscribedGroups
)


select a.*, b.id as "idSub", c.name, c.photo from countedGroups as a
left join group_users  as b
on a."idGroup" = b.id_group and b.id_user =$2
inner join groups as c 
on a."idGroup" = c.id
order by "idSub"
limit 21 offset $3
`;

const createGroupQuery = `insert into groups(name, description, photo, date) values($1, $2, 'group.png', $3) returning id`;

const addAdminQuery = `insert into group_users(id_group, id_user, role, status, date) values($1, $2, 'admin', '1', $3)`;

const addUserQuery = `
insert into group_users(id_group, id_user, status, role, date) 
select $1, $2, '0', $3, $4 where not exists(select id from group_users where id_group=$1 and id_user=$2) returning id;
`;

const getIdUserQuery = `select id from group_users where id_group=$1 and id_user=$2`;

const deleteUserQuery = `delete from group_users where id=$1`;

const inviteUserQuery = `
insert into group_users(id_group, id_user, status) 
select $1, $2, '0'
where not exists(
  select * from group_users where id_group=$1 and id_user=$2
)
`;

const getMembersQuery = `
select b.first_name as "firstName", b.last_name as "lastName", b.id as "idUser", b.photo, a.role, a.id "idSub" from group_users as a
inner join users as b on b.id = a.id_user
where a.id_group=$1
`;

const getInfoQuery = `
select name, date, b."numberOfMembers" 
from groups as a 
inner join(
select id_group, count(*) as "numberOfMembers" from group_users where id_group=$1 group by id_group) as b
on a.id = b.id_group`;

const enterQuery = `
select a.id, a.name, a.photo, b.id as "idMember", b.role
from (select id, name, photo from groups where id = $1) as a
left join(
select id,id_group, role from group_users where id_group=$1 and id_user=$2) as b
on a.id = b.id_group
`;
const acceptInvitationToGroup = `update group_users set status='1', role='user' where id=$1`;

const declineInvitationToGroup = `delete from group_users where id=$1`;

const changeGroupPhotoQuery = `update groups set photo=$1 where id=$2`;

module.exports = {
  getGroupsQuery,
  getSortedGroupsQuery,
  getSortedSubscribedGroupsQuery,
  addUserQuery,
  deleteUserQuery,
  inviteUserQuery,
  getIdUserQuery,
  getMembersQuery,
  getInfoQuery,
  enterQuery,
  acceptInvitationToGroup,
  declineInvitationToGroup,
  createGroupQuery,
  addAdminQuery,
  createGroupQuery,
  addAdminQuery,
  changeGroupPhotoQuery,
};
