const findUserQuery = `select id, email, password, first_name as "firstName", last_name as "lastName", phone, country, language, photo, birth_date as "birthDate", city from users where email=$1`;

const createUserQuery =
  "INSERT INTO users(email, password, first_name, last_name, phone,photo) values($1,$2,$3,$4,$5,'profile.png') returning id";

const getIdUserQuery = "select * from users where email=$1";

module.exports = {
  findUserQuery,
  createUserQuery,
  getIdUserQuery,
};
