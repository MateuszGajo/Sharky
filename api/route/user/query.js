const getUserQuery = `select id, first_name as "firstName", last_name as "lastName", photo from users where id = ANY($1);`;

const getUserInfoQuery = `
with numberOfGroups as(
  select user_id as "userId", count(id)  from group_users where user_id=$1 group by user_id
  ),
  
  numberOfFanpages as(
  select user_id as "userId", count(id)  from fanpage_users where user_id=$1 group by user_id
  ),
  
  numberOfFriends as(
  select a."userId", sum(a.count) 
  from(
    select user_id_1 as "userId", count(id) from friends where user_id_1=$1 and status='1' group by user_id_1
    union
    select user_id_2 as "userId", count(id)  from friends where user_id_2=$1 and status='1' group by user_id_2
  )as a
  group by a."userId"
  ),
  
  numberOfPosts as(
  select user_id as "userId", count(id)  from posts where user_id=$1 and fanpage_id is null and group_id is null group by user_id
  ),
  
  numberOfPhotos as(
  select user_id as "userId",  count(id)   from user_photos where user_id=$1 group by user_id
  )
    
  select a.*,coalesce(b.count,0) as "numberOfGroups", coalesce(c.count ,0) as "numberOfFanpages",
  coalesce(d.sum,0) as "numberOfFriends", coalesce(e.count,0) as "numberOfPosts",
  coalesce(f.count,0) as "numberOfPhotos" 
  from (select id,first_name as "firstName", last_name as "lastName", photo, city, birthdate as "birthDate" from users where id=$1) as a 
  left join numberOfGroups as b on a.id = b."userId"
  left join numberOfFanpages as c on a.id = c."userId"
  left join numberOfFriends as d on a.id = d."userId"
  left join numberOfPosts as e on a.id = e."userId"
  left join numberOfPhotos as f on a.id= f."userId"
`;
const getLanguageQuery = "select language from users where id=$1";

const muteUserQuery = `
insert into user_mutes(user_id_1, user_id_2, date) 
select $1, $2, $3 where not exists (select id from user_mutes where user_id_1 =$1 and user_id_2=$2)`;

const removeFriendQuery = `
delete from friends where id =
  (
  select id from friends where user_id_1=$1 and user_id_2=$2
  union
  select id from friends where user_id_1=$2 and user_id_2=$1
  )`;

const blockUserQuery = `
insert into user_blocks(user_id_1,user_id_2,date)
select $1,$2,$3 where not exists (select id from user_blocks where user_id_1=$1 and user_id_2=$2)
    `;

const addPhotoQuery = `insert into user_photos(user_id, name, date) values($1, $2, $3)`;

const changePhotoQuery = `update users set photo=$1 where id=$2`;
const getPhotosQuery = `
    select id, name, date from user_photos where user_id=$1 limit 7 offset $2
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
