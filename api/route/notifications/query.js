const groupInvitationQuery = `
select a.*, b.name, b.photo
from(select id as "subscribeId",group_id as "groupId",date from group_users where user_id =$1 and status='0') as a
inner join groups as b on a."groupId" = b.id
`;

const changeRelationRequestQuery = `
select c.*,d.first_name as "firstName", d.last_name as "lastName", d.photo
from(select a.*, case when b.user_id_1 =$1 then b.user_id_2 else b.user_id_1 end as "userId"
	from(select id as "relationId", friendship_id as "friendshipId", relation, new_relation as "newRelation", date from friend_relations where user_id=$1) as a
	inner join friends as b on a."friendshipId"=b.id) as c
inner join users as d on c."userId" = d.id
`;

module.exports = {
  groupInvitationQuery,
  changeRelationRequestQuery,
};
