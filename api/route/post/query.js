const getPostQuery = `
  with numberOfLikes as(
  select post_id as "postId", count(id)  from post_likes where post_id=$1 group by post_id
  ),
  
  numberOfComments as(
  select post_id as "postId", count(id)  from post_comments where post_id=$1 group by post_id
  ),
  
  numberOfShares as(
  select post_id as "postId", count(id)  from post_shares where post_id=$1 group by post_id
  )
  select a.*, coalesce(b.count,0) as "numberOfLikes", coalesce(c.count ,0) as "numberOfComments", 
  coalesce(d.count,0) as "numberOfShares", e.id as "likeId",null as "shareId", null as "postSharedUserId"
  from(select id as "postId",fanpage_id as "fanpageId", group_id as "groupId", content, photo, date, user_id as "userId" from posts where id=$1 ) as a
  left join numberOfLikes as b on a."postId" = b."postId"
  left join numberOfComments as c on a."postId" = c."postId"
  left join numberOfShares as d on a."postId" = d."postId"
  left join post_likes as e on a."postId"= e.post_id and e.user_id=$2
`;

const getPostsQuery = `
with userIds as(
  SELECT $1 AS "userId"
  union
  select user_id_1 as "userId"  from friends  where user_id_2=$1 and user_id_1 not in (select user_id_2 from user_mutes where user_id_1=$1) and status='1'
  union 
  select user_id_2 as "userId" from friends where user_id_1=$1 and user_id_2 not in (select user_id_2 from user_mutes where user_id_1=$1) and status='1'
  ),
  
  postIds as(
  select id as "postId" from posts where user_id in(select * from userIds) and group_id is null and fanpage_id is null
  
  ),
  
  postSharedIds as (
  select post_id as "postId" from post_shares where user_id in(select * from userIds)
  ),
  
  postAndPostSharedIds as(
  select * from postIds
  union
  select * from postSharedIds
  ),
  
  numberOfShares as(
  select a."postId", count(b.id) as "numberOfShares" from postAndPostSharedIds as a  left join post_shares as  b on a."postId" = b.post_id group by a."postId"
  ),
     
  numberOfComments as(
  select a."postId", count(b.id) as "numberOfComments" from postAndPostSharedIds as a  left join post_comments as  b on a."postId" = b.post_id group by a."postId"
  ),
    
  numberOfLikes as(
  select a."postId", count(b.id) as "numberOfLikes" from postAndPostSharedIds as a  left join post_likes as  b on a."postId" = b.post_id group by a."postId"
  ),

  shareIDs as (
  select id as "postId" from post_shares where user_id in(select * from userIds)
  ),
  
  postsShared as (
  select a.post_id as "postId", c."numberOfShares", d."numberOfComments", e."numberOfLikes",b.user_id as "userId",b.content,b.photo,a.date , a.id::text as "shareId", a.user_id::text as "postSharedUserId" 
  from post_shares as a
  inner join posts as b on a.post_id = b.id
  inner join numberOfShares as c on a.post_id =c."postId"
  inner join numberOfComments as d on a.post_id =d."postId"
  inner join numberOfLikes as e on a.post_id =e."postId"
  where a.id in (select * from shareIDs)
  ),
  posts as (
  select a.id as "postId",b."numberOfShares", c."numberOfComments",d."numberOfLikes",a.user_id as "userId", a.content, a.photo, a.date, null as "shareId", null as "postSharedUserId" from 
  posts as a
  inner join numberOfShares as b on a.id =b."postId"
  inner join numberOfComments as c on a.id =c."postId"
  inner join numberOfLikes as d on a.id =d."postId"
  where id in(select * from postIds)
  )
  
  select a.*, b.id as "likeId"
  from(select * from postsShared
    union all
    select * from posts) as a
  left join post_likes as b on
  a."postId" = b.post_id and b.user_id =$1
  order by date desc
  limit 21 offset $2
`;

const getUserPostQuery = `
with postIds as(
  select id  as "postId" from posts where user_id=$1 and group_id is null and fanpage_id is null
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
  e."postId" = f.post_id and f.user_id =$2
  order by e.date desc
  limit 21 offset $3
`;

const getFanpagePostsQuery = `
with postIds as(
 select id  as "postId" from posts where fanpage_id=$1
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
 e."postId" = f.post_id and f.user_id =$2
 order by e.date desc
 limit 21 offset $3
`;

const getGroupPostsQuery = `
with postIds as(
  select id  as "postId" from posts where group_id=$1
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
  e."postId" = f.post_id and f.user_id =$2
  order by e.date desc
  limit 21 offset $3
`;

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

const doesUserBelongToFanpageQuery =
  "select id from fanpage_users where id_user=$1";

const doesUserBelongToGroupqQuery =
  "select id from group_users where id_user=$1";

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
  doesUserBelongToFanpageQuery,
  doesUserBelongToGroupqQuery,
  deleteCommentsQuery,
  deleteRepliesQuery,
};
