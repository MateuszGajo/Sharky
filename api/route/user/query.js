const getUserQuery = `select id, first_name as "firstName", last_name as "lastName", photo from users where id = ANY($1);`;

const muteUserQuery = `insert into user_mute(id_user_1, id_user_2, date) values($1, $2, $3)`;

const removeFriendQuery = `
delete from friends where id =
  (
  select id from friends where id_user_1=$1 and id_user_2=$2
  union
  select id from friends where id_user_1=$2 and id_user_2=$1
  )`;

const blockUserQuery = `
  insert into user_block(id_user_1,id_user_2,date)
    values($1,$2,$3)
    `;

module.exports = {
  getUserQuery,
  muteUserQuery,
  removeFriendQuery,
  blockUserQuery,
};
