const checkPermission = `select id from journalists where id_user=$1`;

module.exports = { checkPermission };
