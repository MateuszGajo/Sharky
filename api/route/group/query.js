const getGroupsQuery = `
with groupIds as(
  select b.group_id
    from(select a.group_id
    from group_users as a
    where user_id=$1) as b
  left join(
    select a.group_id
    from group_users as a
    where user_id=$2) as c
  on c.group_id = b.group_id
  where c.group_id is null
  )
  
  select a."subId",a."groupId",a."numberOfMembers", b.name, b.description, b.photo
  from(select id as "subId",group_id as "groupId", count(*) over (partition by group_id)  as "numberOfMembers",user_id
       from group_users 
       where group_id in(
            select a.group_id
            from group_users as a
            where user_id=$1
          )
        ) as a
     left join groups as b
  on a."groupId" = b.id
  where a.user_id =$2
  union
  select null as "subId", b.*, groups.name, groups.description, groups.photo
  from(select a.id as "groupId", count(*) as "numberOfMembers"
    from(select groups.id 
       from groups
       left join group_users on
       groups.id = group_users.group_id
       where groups.id in(select * from groupIds)
      ) as a
    group by a.id) as b
  inner join groups on b."groupId" = groups.id
  limit 21 offset $3
`;

const getSortedSubscribedGroupsQuery = `
with groupSubscribedIds as(
select group_id from group_users where user_id = $1
),

  groupSorted as(
  select id from groups where lower(name) like($2) and id in(select * from groupSubscribedIds)
),

numberOfMembers as (
select group_id as "groupId",count(*) as "numberOfMembers" from group_users where group_id in(select * from groupSorted) group by group_id
)

select a.*, b.id as "subId", c.name, c.photo from numberOfMembers as a
left join group_users  as b
on a."groupId" = b.group_id and b.user_id =$3
inner join groups as c 
on a."groupId" = c.id
order by name asc
limit 21 offset $4
`;

const getSortedGroupsQuery = `
with groupSorted as(
  select id from groups where lower(name) like($1)
),

groupsSubscribed as (
select group_id as "groupId",count(*) as "numberOfMembers" from group_users where group_id in(select * from groupSorted) group by group_id
),

groupsUnsubscribed as(
select id, 0 as  "numberOfMembers" from groupSorted where id not in (select "groupId" from  groupsSubscribed )
),

groupsCounted as(
select * from groupsSubscribed
union
select * from groupsUnsubscribed
)


select a.*, b.id as "subId", c.name, c.photo from groupsCounted as a
left join group_users  as b
on a."groupId" = b.group_id and b.user_id =$2
inner join groups as c 
on a."groupId" = c.id
order by "subId"
limit 21 offset $3
`;

const createGroupQuery = `insert into groups(name, description, photo, date) values($1, $2, 'group.png', $3) returning id`;

const addAdminQuery = `insert into group_users(group_id, user_id, role, status, date) values($1, $2, 'admin', '1', $3)`;

const addUserQuery = `
insert into group_users(group_id, user_id, status, role, date) 
select $1, $2, '0', $3, $4 where not exists(select id from group_users where group_id=$1 and user_id=$2) returning id;
`;

const getIdUserQuery = `select id from group_users where group_id=$1 and user_id=$2`;

const deleteUserQuery = `delete from group_users where id=$1`;

const inviteUserQuery = `
insert into group_users(group_id, user_id, status) 
select $1, $2, '0'
where not exists(
  select * from group_users where group_id=$1 and user_id=$2
)
`;

const getMembersQuery = `
select b.first_name as "firstName", b.last_name as "lastName", b.id as "userId", b.photo, a.role, a.id "subId" from group_users as a
inner join users as b on b.id = a.user_id
where a.group_id=$1
`;

const getInfoQuery = `
select name, date, b."numberOfMembers" 
from groups as a 
inner join(
select group_id, count(*) as "numberOfMembers" from group_users where group_id=$1 group by group_id) as b
on a.id = b.group_id`;

const enterQuery = `
select a.id, a.name, a.photo, b.id as "memberId", b.role
from (select id, name, photo from groups where id = $1) as a
left join(
select id,group_id, role from group_users where group_id=$1 and user_id=$2) as b
on a.id = b.group_id
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
  changeGroupPhotoQuery,
};
