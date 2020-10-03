select result.id as "replyId",
    result.user_id as "userId",
    result.content,
    result.date,
    result.numberoflikes as "numberOfLikes",
    reply_likes.id as "likeId"
from(
        select comment_replies.*,
            count(reply_likes.reply_id) as "numberoflikes"
        from comment_replies
            left join reply_likes on comment_replies.id = reply_likes.reply_id
        where comment_replies.comment_id = $1
        group by comment_replies.id,
            reply_likes.reply_id
    ) as result
    left join reply_likes on result.id = reply_likes.reply_id
    and reply_likes.user_id = $2
order by date desc
limit 21 offset $3