const getNewsQuery = `
with postIds as(
  select id  as "postId" from posts where is_news=true
  ),
  
  numberOfShares as(
  select a."postId", count(b.id) as "numberOfShares" from postIds as a  left join post_shares as  b on a."postId" = b.post_id group by a."postId"
  ),
  
  numberOfComments as(
  select a."postId", count(b.id) as "numberOfComments" from postIds as a  left join post_comments as  b on a."postId" = b.post_id group by a."postId"
  ),
  
  numberOfLikes as(
  select a."postId", count(b.id) as "numberOfLikes" from postIds as a  left join post_likes as  b on a."postId" = b.post_id group by a."postId"
  )
  
  select e.*, f.id as "likeId"
  from(select a.id as "postId", a.user_id as "userId", a.content, a.photo, a.date, b."numberOfShares", c."numberOfComments", d."numberOfLikes",null as "shareId", null as "postSharedUserId"  
    from posts as a
    inner join numberOfShares as b on a.id = b."postId"
    inner join numberOfComments as c on a.id=c."postId"
    inner join numberOfLikes as d on a.id =d."postId"
    where id in (select * from postIds)) as e
  left join post_likes as f on
  e."postId" = f.post_id and f.user_id =$1
  order by e.date desc
  limit 21 offset $2
`;

const getCommentsQuery = `
  
with commentsIds as(
  select id as "commnetId", post_id as "postId" from post_comments where post_id =any($1)
  ),
  
  numberOfLikes  as (
  select a."commnetId", count(b.id) as "numberOfLikes" from commentsIds as a left join comment_likes as b on a."commnetId" = b.comment_id group by a."commnetId"
  ),
  
  numberOfReplies as (
  select a."commnetId",a."postId", count(b.id) as "numberOfReplies" from commentsIds as a left join comment_replies as b on a."commnetId" = b.comment_id group by a."commnetId",a."postId"
  ),
  
  likedComment as(
  select id as "likeId", comment_id as "commnetId" from comment_likes where comment_id in (select "commnetId" from commentsIds) and user_id =$2
  )
  
  select e.* 
  from(select a.id as "commnetId", a.post_id as "postId", a.user_id as "userId", a.content, a.date, b."numberOfLikes", c."numberOfReplies", d."likeId" 
	  from post_comments as a
	  inner join numberOfLikes as b on a.id = b."commnetId"
	  inner join numberOfReplies as c on a.id = c."commnetId"
	  left join likedComment as d on a.id = d."commnetId"
	  where id in(select "commnetId" from commentsIds)) as e
   order by date desc
   limit 3 offset 0
`;

const addGroupPostQuery =
  "insert into posts(user_id,group_id, content, date, photo) values($1, $2, $3, $4, $5) RETURNING id";

const addFanpagePostQuery =
  "insert into posts(user_id,fanpage_id, content, date, photo) values($1, $2, $3, $4, $5) RETURNING id";

const addNewsQuery =
  "insert into posts(user_id,is_news, content, date, photo) values($1, true, $2, $3, $4) RETURNING id";

const addPostQuery =
  "insert into posts(user_id, content, date, photo) values($1, $2, $3, $4) RETURNING id";

const postLikeQuery = `
INSERT INTO post_likes(user_id, post_id) 
select $1,$2 where not exists (select id from post_likes where user_id=$1 and post_id=$2) 
returning id`;

const getIdPostQuery = `select id from post_likes where user_id=$1 and post_id=$2`;

const unLikeQuery = `delete from post_likes where id=$1`;

const postShareQuery = `insert into post_shares(post_id, user_id, date) values($1,$2,$3) returning id`;

const editPostQuery = `update posts set content=$1 where id=$2`;

const deletePostQuery = `delete from posts where id=$1`;

const deleteCommentsQuery = `delete from post_comments where post_id=$1`;

const deleteRepliesQuery = `delete from comment_replies where comment_id in(select id from post_comments where post_id=$1)`;

const deleteSharePostQuery = `delete from post_shares where id=$1`;

module.exports = {
  getPostQuery,
  getPostsQuery,
  getUserPostQuery,
  getFanpagePostsQuery,
  getGroupPostsQuery,
  getNewsQuery,
  getCommentsQuery,
  addGroupPostQuery,
  addFanpagePostQuery,
  addNewsQuery,
  addPostQuery,
  postLikeQuery,
  unLikeQuery,
  postShareQuery,
  editPostQuery,
  deletePostQuery,
  deleteSharePostQuery,
  getIdPostQuery,
  deleteCommentsQuery,
  deleteRepliesQuery,
};
