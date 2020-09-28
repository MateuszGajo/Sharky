const commentsQuery = `
select secondResult.*, post_comments.user_id as "userId", post_comments.content, post_comments.date , comment_likes.id as "likeId"  from
  (select result.id, result.numberofreplies as "numberOfReplies", count(comment_likes.comment_id) as "numberOfLikes"
   from(select post_comments.id,  count(comment_replies.id) as "numberofreplies"
        from post_comments
        left join comment_replies on post_comments.id = comment_replies.comment_id
        where post_id=$1
        group by  post_comments.id) as result
    left join comment_likes on result.id = comment_likes.comment_id
    group by result.id,result.numberofreplies) as secondResult
left join comment_likes on secondResult.id = comment_likes.comment_id and comment_likes.user_id=$2
left join post_comments on post_comments.id = secondResult.id
order by post_comments.date desc
limit 21 offset $3`;

const addCommentQuery = `INSERT INTO post_comments(post_id, user_id, content, date) values($1, $2, $3, $4) RETURNING id;`;

const likeCommentQuery = `
insert into comment_likes(comment_id, user_id)
select $1, $2 where not exists(select id from comment_likes where comment_id=$1 and user_id=$2) 
returning id`;

const getIdLikeQuery = `select id from comment_likes where comment_id=$1 and user_id=$2`;

const unlikeCommentQuery = `
delete from comment_likes
where id = $1;
`;

module.exports = {
  commentsQuery,
  addCommentQuery,
  likeCommentQuery,
  unlikeCommentQuery,
  getIdLikeQuery,
};
