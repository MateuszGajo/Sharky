const addReplyQuery = `INSERT INTO comment_replies(id_comment, id_user, content, date) values($1,$2,$3,$4) RETURNING id;`;

const replyQuery = `
select result.id as "idComment", result.id_user as "idUser", result.content, result.date, result.numberoflikes as "numberOfLikes" ,reply_like.id as "idLike"  
from(select comment_replies.*, count(reply_like.id_reply) as "numberoflikes"
  from comment_replies
  left join reply_like on comment_replies.id = reply_like.id_reply
  where comment_replies.id_comment=$1
  group by comment_replies.id, reply_like.id_reply) as result
left join reply_like on result.id = reply_like.id_reply and reply_like.id_user = $2
order by date desc
limit 21 offset $3
`;

const likeReplyQuery = `
insert into reply_like(id_reply, id_user)
select $1,$2 where not exists (select id from reply_like where id_reply=$1 and id_user=$2)
returning id`;

const getIdLike = `select id from reply_like where id_reply=$1 and id_user=$2`;

const unlikeReplyQuery = `
  delete from reply_like
  where id = $1;
  `;

module.exports = {
  addReplyQuery,
  replyQuery,
  likeReplyQuery,
  unlikeReplyQuery,
  getIdLike,
};
