const groupInvitationQuery = `
select a.*, b.name, b.photo
from(select id as "idSubscribe",id_group as "idGroup",date from group_users where id_user =$1 and status='0') as a
inner join groups as b on a."idGroup" = b.id
`;

const changeRelationRequestQuery = `
select c.*,d.first_name as "firstName", d.last_name as "lastName", d.photo
from(select a.*, case when b.id_user_1 =$1 then b.id_user_2 else b.id_user_1 end as "idUser"
	from(select id as "idRelation",id_friendship as "idFriendship",relation,new_relation as "newRelation", date from friend_relation where id_user=$1) as a
	inner join friends as b on a."idFriendship"=b.id) as c
inner join users as d on c."idUser" = d.id
`;

module.exports = {
  groupInvitationQuery,
  changeRelationRequestQuery,
};
