const addReplyQuery = `INSERT INTO comment_replies(comment_id, user_id, content, date) values($1,$2,$3,$4) RETURNING id;`;

const replyQuery = `
select result.id as "replyId", result.user_id as "userId", result.content, result.date, result.numberoflikes as "numberOfLikes" ,reply_likes.id as "likeId"  
from(select comment_replies.*, count(reply_likes.reply_id) as "numberoflikes"
  from comment_replies
  left join reply_likes on comment_replies.id = reply_likes.reply_id
  where comment_replies.comment_id=$1
  group by comment_replies.id, reply_likes.reply_id) as result
left join reply_likes on result.id = reply_likes.reply_id and reply_likes.user_id = $2
order by date desc
limit 21 offset $3
`;

const likeReplyQuery = `
insert into reply_likes(reply_id, user_id)
select $1,$2 where not exists (select id from reply_likes where reply_id=$1 and user_id=$2)
returning id`;

const getIdLike = `select id from reply_likes where reply_id=$1 and user_id=$2`;

const unlikeReplyQuery = `
  delete from reply_likes
  where id = $1;
  `;

module.exports = {
  addReplyQuery,
  replyQuery,
  likeReplyQuery,
  unlikeReplyQuery,
  getIdLike,
};
