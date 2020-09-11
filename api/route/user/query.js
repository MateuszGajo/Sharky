const getUserQuery = `select id, first_name as "firstName", last_name as "lastName", photo from users where id = ANY($1);`;

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

const getUserInfoQuery = `select email, phone, country, language from users where id=$1`;

module.exports = {
  getUserQuery,
  muteUserQuery,
  removeFriendQuery,
  getPhotosQuery,
  blockUserQuery,
  verifyCountryQuery,
  changeCountryQuery,
  verifyLanguageQuery,
  changeLanguageQuery,
  changeEmailQuery,
  changePhoneQuery,
  changePasswordQuery,
  getPasswordQuery,
  getUserInfoQuery,
};
