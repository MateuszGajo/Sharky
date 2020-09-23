const getUserQuery = `select id, first_name as "firstName", last_name as "lastName", photo from users where id = ANY($1);`;

const getUserInfoQuery = `
with numberOfGroups as(
  select id_user as "idUser", count(id)  from group_users where id_user=$1 group by id_user
  ),
  
  numberOfFanpages as(
  select id_user as "idUser", count(id)  from fanpage_users where id_user=$1 group by id_user
  ),
  
  numberOfFriends as(
  select a."idUser", sum(a.count) 
  from(
    select id_user_1 as "idUser", count(id) from friends where id_user_1=$1 and status='1' group by id_user_1
    union
    select id_user_2 as "idUser", count(id)  from friends where id_user_2=$1 and status='1' group by id_user_2
  )as a
  group by a."idUser"
  ),
  
  numberOfPosts as(
  select id_user as "idUser", count(id)  from posts where id_user=$1 and id_fanpage is null and id_group is null group by id_user
  ),
  
  numberOfPhotos as(
  select id_user as "idUser",  count(id)   from user_photos where id_user=$1 group by id_user
  )
    
  select a.*,coalesce(b.count,0) as "numberOfGroups", coalesce(c.count ,0) as "numberOfFanpages",
  coalesce(d.sum,0) as "numberOfFriends", coalesce(e.count,0) as "numberOfPosts",
  coalesce(f.count,0) as "numberOfPhotos" 
  from (select id,first_name as "firstName", last_name as "lastName", photo, city, birth_date as "birthDate" from users where id=$1) as a 
  left join numberOfGroups as b on a.id = b."idUser"
  left join numberOfFanpages as c on a.id = c."idUser"
  left join numberOfFriends as d on a.id = d."idUser"
  left join numberOfPosts as e on a.id = e."idUser"
  left join numberOfPhotos as f on a.id= f."idUser"
`;
const getLanguageQuery = "select language from users where id=$1";

const muteUserQuery = `
insert into user_mute(id_user_1, id_user_2, date) 
select $1, $2, $3 where not exists (select id from user_mute where id_user_1 =$1 and id_user_2=$2)`;

const removeFriendQuery = `
delete from friends where id =
  (
  select id from friends where id_user_1=$1 and id_user_2=$2
  union
  select id from friends where id_user_1=$2 and id_user_2=$1
  )`;

const blockUserQuery = `
insert into user_block(id_user_1,id_user_2,date)
select $1,$2,$3 where not exists (select id from user_block where id_user_1=$1 and id_user_2=$2)
    `;

const addPhotoQuery = `insert into user_photos(id_user, name, date) values($1, $2, $3)`;

const changePhotoQuery = `update users set photo=$1 where id=$2`;
const getPhotosQuery = `
    select id, name, date from user_photos where id_user=$1 limit 7 offset $2
`;

const verifyCountryQuery = "select id from countries where name=$1";

const changeCountryQuery = "update users set country=$1 where id=$2";

const verifyLanguageQuery = "select id from languages where name=$1";

const changeLanguageQuery = "update users set language=$1 where id=$2";

const changeEmailQuery = "update users set email=$1 where id=$2";

const changePhoneQuery = "update users set phone=$1 where id=$2";

const changePasswordQuery = "update users set password=$1 where id=$2";

const getPasswordQuery = "select password from users where id=$1";

const getUserPersonalInfoQuery = `select email, phone, country, language from users where id=$1`;

module.exports = {
  getUserQuery,
  getUserInfoQuery,
  muteUserQuery,
  removeFriendQuery,
  getPhotosQuery,
  blockUserQuery,
  addPhotoQuery,
  changePhotoQuery,
  verifyCountryQuery,
  changeCountryQuery,
  verifyLanguageQuery,
  changeLanguageQuery,
  changeEmailQuery,
  changePhoneQuery,
  changePasswordQuery,
  getPasswordQuery,
  getUserPersonalInfoQuery,
  getLanguageQuery,
};
