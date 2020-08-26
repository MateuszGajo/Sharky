const getPostQuery = `
  with numberOfLikes as(
  select id_post as "idPost", count(id)  from post_like where id_post=$1 group by id_post
  ),
  
  numberOfComments as(
  select id_post as "idPost", count(id)  from post_comments where id_post=$1 group by id_post
  ),
  
  numberOfShares as(
  select id_post as "idPost", count(id)  from post_share where id_post=$1 group by id_post
  )
  select a.*, coalesce(b.count,0) as "numberOfLikes", coalesce(c.count ,0) as "numberOfComments", 
  coalesce(d.count,0) as "numberOfShares", e.id as "idLike",null as "idShare", null as "idUserShare"
  from(select id as "idPost",id_fanpage as "idFanpage", id_group as "idGroup", content, photo, date, id_user as "idUser" from posts where id=$1 ) as a
  left join numberOfLikes as b on a."idPost" = b."idPost"
  left join numberOfComments as c on a."idPost" = c."idPost"
  left join numberOfShares as d on a."idPost" = d."idPost"
  left join post_like as e on a."idPost"= e.id_post and e.id_user=$2
`;

const getPostsQuery = `
with idUsers as(
  SELECT 1 AS "idUser"
  union
  select id_user_1 as "idUser"  from friends  where id_user_2=$1 and id_user_1 not in (select id_user_2 from user_mute where id_user_1=$1) and status='1'
  union 
  select id_user_2 as "idUser" from friends where id_user_1=$1 and id_user_2 not in (select id_user_2 from user_mute where id_user_1=$1) and status='1'
  ),
  
  idPosts as(
  select id as "idPost" from posts where id_user in(select * from idUsers) and id_group is null and id_fanpage is null
  
  ),
  
  idPostShare as (
  select id_post as "idPost" from post_share where id_user in(select * from idUsers)
  ),
  
  idPostAndShare as(
  select * from idPosts
  union
  select * from idPostShare
  ),
  
  numberOfShares as(
  select a."idPost", count(b.id) as "numberOfShares" from idPostAndShare as a  left join post_share as  b on a."idPost" = b.id_post group by a."idPost"
  ),
     
  numberOfComments as(
  select a."idPost", count(b.id) as "numberOfComments" from idPostAndShare as a  left join post_comments as  b on a."idPost" = b.id_post group by a."idPost"
  ),
    
  numberOfLikes as(
  select a."idPost", count(b.id) as "numberOfLikes" from idPostAndShare as a  left join post_like as  b on a."idPost" = b.id_post group by a."idPost"
  ),

  idShares as (
  select id as "idPost" from post_share where id_user in(select * from idUsers)
  ),
  
  postsShare as (
  select a.id_post as "idPost", c."numberOfShares", d."numberOfComments", e."numberOfLikes",b.id_user as "idUser",b.content,b.photo,a.date , a.id::text as "idShare", a.id_user::text as "idUserShare" 
  from post_share as a
  inner join posts as b on a.id_post = b.id
  inner join numberOfShares as c on a.id_post =c."idPost"
  inner join numberOfComments as d on a.id_post =d."idPost"
  inner join numberOfLikes as e on a.id_post =e."idPost"
  where a.id in (select * from idShares)
  ),
  posts as (
  select a.id as "idPost",b."numberOfShares", c."numberOfComments",d."numberOfLikes",a.id_user as "idUser", a.content, a.photo, a.date, null as "idShare", null as "idUserShare" from 
  posts as a
  inner join numberOfShares as b on a.id =b."idPost"
  inner join numberOfComments as c on a.id =c."idPost"
  inner join numberOfLikes as d on a.id =d."idPost"
  where id in(select * from idPosts)
  )
  
  select a.*, b.id as "idLike"
  from(select * from postsShare
    union all
    select * from posts) as a
  left join post_like as b on
  a."idPost" = b.id_post and b.id_user =$1
  order by date desc
  limit 21 offset $2
`;

const getUserPostQuery = `
with idPosts as(
  select id  as "idPost" from posts where id_user=$1 and id_group is null and id_fanpage is null
  ),
  
  numberOfShares as(
  select a."idPost", count(b.id) as "numberOfShares" from idPosts as a  left join post_share as  b on a."idPost" = b.id_post group by a."idPost"
  ),
  
  numberOfComments as(
  select a."idPost", count(b.id) as "numberOfComments" from idPosts as a  left join post_comments as  b on a."idPost" = b.id_post group by a."idPost"
  ),
  
  numberOfLikes as(
  select a."idPost", count(b.id) as "numberOfLikes" from idPosts as a  left join post_like as  b on a."idPost" = b.id_post group by a."idPost"
  )
  
  select e.*, f.id as "idLike"
  from(select a.id as "idPost", a.id_user as "idUser", a.content, a.photo, a.date, b."numberOfShares", c."numberOfComments", d."numberOfLikes",null as "idShare", null as "idUserShare"  
    from posts as a
    inner join numberOfShares as b on a.id = b."idPost"
    inner join numberOfComments as c on a.id=c."idPost"
    inner join numberOfLikes as d on a.id =d."idPost"
    where id in (select * from idPosts)) as e
  left join post_like as f on
  e."idPost" = f.id_post and f.id_user =$2
  order by e.date desc
  limit 21 offset $3
`;

const getFanpagePostsQuery = `
with idPosts as(
 select id  as "idPost" from posts where id_fanpage=$1
 ),
 
 numberOfShares as(
 select a."idPost", count(b.id) as "numberOfShares" from idPosts as a  left join post_share as  b on a."idPost" = b.id_post group by a."idPost"
 ),
 
 numberOfComments as(
 select a."idPost", count(b.id) as "numberOfComments" from idPosts as a  left join post_comments as  b on a."idPost" = b.id_post group by a."idPost"
 ),
 
 numberOfLikes as(
 select a."idPost", count(b.id) as "numberOfLikes" from idPosts as a  left join post_like as  b on a."idPost" = b.id_post group by a."idPost"
 )
 
 select e.*, f.id as "idLike"
 from(select a.id as "idPost", a.id_user as "idUser", a.content, a.photo, a.date, b."numberOfShares", c."numberOfComments", d."numberOfLikes",null as "idShare", null as "idUserShare"  
   from posts as a
   inner join numberOfShares as b on a.id = b."idPost"
   inner join numberOfComments as c on a.id=c."idPost"
   inner join numberOfLikes as d on a.id =d."idPost"
   where id in (select * from idPosts)) as e
 left join post_like as f on
 e."idPost" = f.id_post and f.id_user =$2
 order by e.date desc
 limit 21 offset $3
`;

const getGroupPostsQuery = `
with idPosts as(
  select id  as "idPost" from posts where id_group=$1
  ),
  
  numberOfShares as(
  select a."idPost", count(b.id) as "numberOfShares" from idPosts as a  left join post_share as  b on a."idPost" = b.id_post group by a."idPost"
  ),
  
  numberOfComments as(
  select a."idPost", count(b.id) as "numberOfComments" from idPosts as a  left join post_comments as  b on a."idPost" = b.id_post group by a."idPost"
  ),
  
  numberOfLikes as(
  select a."idPost", count(b.id) as "numberOfLikes" from idPosts as a  left join post_like as  b on a."idPost" = b.id_post group by a."idPost"
  )
  
  select e.*, f.id as "idLike"
  from(select a.id as "idPost", a.id_user as "idUser", a.content, a.photo, a.date, b."numberOfShares", c."numberOfComments", d."numberOfLikes",null as "idShare", null as "idUserShare"  
    from posts as a
    inner join numberOfShares as b on a.id = b."idPost"
    inner join numberOfComments as c on a.id=c."idPost"
    inner join numberOfLikes as d on a.id =d."idPost"
    where id in (select * from idPosts)) as e
  order by e.date desc
  left join post_like as f on
  e."idPost" = f.id_post and f.id_user =$2
  limit 21 offset $3
`;

const getCommentsQuery = `
  
with idComments as(
  select id as "idComment", id_post as "idPost" from post_comments where id_post =any($1)
  ),
  
  numberOfLikes  as (
  select a."idComment", count(b.id) as "numberOfLikes" from idComments as a left join comment_like as b on a."idComment" = b.id_comment group by a."idComment"
  ),
  
  numberOfReplies as (
  select a."idComment",a."idPost", count(b.id) as "numberOfReplies" from idComments as a left join comment_replies as b on a."idComment" = b.id_comment group by a."idComment",a."idPost"
  ),
  
  
  likedComment as(
  select id as "idLike", id_comment as "idComment" from comment_like where id_comment in (select "idComment" from idComments) and id_user =$2
  )
  
  select a.id as "idComment", a.id_post as "idPost", a.id_user as "idUser", a.content, a.date, b."numberOfLikes", c."numberOfReplies", d."idLike" 
  from post_comments as a
  inner join numberOfLikes as b on a.id = b."idComment"
  inner join numberOfReplies as c on a.id = c."idComment"
  left join likedComment as d on a.id = d."idComment"
  where id in(select "idComment" from idComments)
`;

const addGroupPostQuery =
  "insert into posts(id_user,id_group, content, date, photo) values($1, $2, $3, $4, $5) RETURNING id";

const addFanpagePostQuery =
  "insert into posts(id_user,id_fanpage, content, date, photo) values($1, $2, $3, $4, $5) RETURNING id";

const addPostQuery =
  "insert into posts(id_user, content, date, photo) values($1, $2, $3, $4) RETURNING id";

const postLikeQuery = `
INSERT INTO post_like(id_user, id_post) 
select $1,$2 where not exists (select id from post_like where id_user=$1 and id_post=$2) 
returning id`;

const getIdPostQuery = `select id from post_like where id_user=$1 and id_post=$2`;

const unLikeQuery = `delete from post_like where id=$1`;

const postShareQuery = `insert into post_share(id_post, id_user, date) values($1,$2,$3) returning id`;

const editPostQuery = `update posts set content=$1 where id=$2`;

const deletePostQuery = `delete from posts where id=$1`;

const deleteSharePostQuery = `delete from post_share where id=$1`;

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
  getCommentsQuery,
  addGroupPostQuery,
  addFanpagePostQuery,
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
};
