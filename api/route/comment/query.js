const commentsQuery = `
select secondResult.*, post_comments.id_user as "idUser", post_comments.content, post_comments.date , comment_like.id as "idLike"  from
  (select result.id, result.numberofreplies as "numberOfReplies", count(comment_like.id_comment) as "numberOfLikes"
   from(select post_comments.id,  count(comment_replies.id) as "numberofreplies"
        from post_comments
        left join comment_replies on post_comments.id = comment_replies.id_comment
        where id_post=$1
        group by  post_comments.id) as result
    left join comment_like on result.id = comment_like.id_comment
    group by result.id,result.numberofreplies) as secondResult
left join comment_like on secondResult.id = comment_like.id_comment and comment_like.id_user=$2
left join post_comments on post_comments.id = secondResult.id
order by post_comments.date desc
limit 21 offset $3`;

const addCommentQuery = `INSERT INTO post_comments(id_post, id_user, content, date) values($1, $2, $3, $4) RETURNING id;`;

const likeCommentQuery = `
insert into comment_like(id_comment, id_user)
select $1, $2 where not exists(select id from comment_like where id_comment=$1 and id_user=$2) 
returning id`;

const getIdLikeQuery = `select id from comment_like where id_comment=$1 and id_user=$2`;

const unlikeCommentQuery = `
delete from comment_like
where id = $1;
`;

module.exports = {
  commentsQuery,
  addCommentQuery,
  likeCommentQuery,
  unlikeCommentQuery,
  getIdLikeQuery,
};
