import { v4 as uuid } from "uuid";
import Router from "next/router";
import axios from "~features/service/Axios";

export const getUsers = async (users, setUsers, elements) => {
  const userIds = [];

  for (let i = 0; i < elements.length; i++) {
    const { userId } = elements[i];
    if (users[userId] === undefined) userIds.push(userId);
  }
  if (userIds.length > 0) {
    await axios
      .post("/user/get", {
        userIds,
      })
      .then(({ data: { users: u } }) => {
        const usersKey = {};

        for (let i = 0; i < u.length; i++) {
          const { id, firstName, lastName, photo } = u[i];
          usersKey[id] = {
            id,
            firstName,
            lastName,
            photo,
          };
        }
        setUsers({
          ...users,
          ...usersKey,
        });
      });
  }
};

export const muteUser = ({ userId, setMuteUser, isSingle, setError }) => {
  axios
    .post("/user/mute", {
      userId,
    })
    .then(() => {
      isSingle && Router.push("/");
      setMuteUser({ userId });
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const blockUser = ({ userId, posts, setPosts, isSingle, setError }) => {
  axios
    .post("/user/block", { userId })
    .then(() => {
      const userBlockedID = userId;
      isSingle && Router.push("/");
      const filtredPosts = posts.filter((post) => {
        const uId = post.postSharedUserId || post.userId;
        return uId !== userBlockedID;
      });
      setPosts(filtredPosts);
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const getPosts = ({
  fanpageId,
  groupId,
  news,
  userId,
  authorPost,
  posts,
  setPosts,
  from,
  users,
  setUsers,
  setStatusOfMorePosts,
}) => {
  axios
    .post("/post/get", { from, groupId, fanpageId, news, authorPost, userId })
    .then(async ({ data: { posts: p, comments, isMorePosts } }) => {
      await getUsers(users, setUsers, [...p, ...comments]);
      const commentsKey = {};
      for (let i = 0; i < comments.length; i++) {
        if (!commentsKey[comments[i].postId]) {
          commentsKey[comments[i].postId] = [];
        }
        commentsKey[comments[i].postId].push(comments[i]);
      }
      const newPosts = p.map((item) => {
        if (!commentsKey[item.postId]) {
          return {
            ...item,
            id: uuid(),
            comments: [],
            isMoreComments: false,
          };
        }
        if (Object.keys(commentsKey[item.postId]).length < 3) {
          return {
            ...item,
            id: uuid(),
            comments: commentsKey[item.postId],
            isMoreComments: false,
          };
        }

        return {
          ...item,
          id: uuid(),
          comments: commentsKey[item.postId].slice(0, -1),
          isMoreComments: true,
        };
      });
      setStatusOfMorePosts(isMorePosts);
      setPosts([...posts, ...newPosts]);
    });
};

export const addPost = ({
  content,
  date,
  photo,
  posts,
  setPosts,
  clearText,
  setError,
}) => {
  axios
    .post("/post/add", {
      content,
      date,
      photo,
    })
    .then(({ data: { postId: id, userId } }) => {
      setPosts([
        {
          id,
          userId,
          content,
          date,
          comments: null,
          numberOfLikes: 0,
          numberOfShares: 0,
          numberOfComments: 0,
          photo: "profile.png",
        },
        ...posts,
      ]);
      clearText("");
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const likePost = ({ postId, setNewLike, setError }) => {
  axios
    .post("/post/like", { postId })
    .then(({ data: { likeId } }) =>
      setNewLike({ likeId, idElement: postId, type: "post" })
    )
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const unlikePost = ({ postId, setNewLike, setError }) => {
  axios
    .post("/post/unlike", { postId })
    .then(() => setNewLike({ likeId: null, idElement: postId, type: "post" }))
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const sharePost = ({
  post,
  posts,
  comments,
  setNewComment,
  numberOfComments,
  numberOfLikes,
  numberOfShares,
  setPosts,
  setError,
  isSingle,
}) => {
  axios
    .post("/post/share", {
      postId: post.postId,
    })
    .then(({ data: { shareId, userId, date } }) => {
      if (!isSingle) {
        setNewComment({});
        setPosts([
          {
            ...post,
            comments: [],
            isMoreComments: !!comments.length,
            shareId,
            id: uuid(),
            date,
            postSharedUserId: userId,
            numberOfShares: Number(numberOfShares) + 1,
            numberOfComments,
            numberOfLikes,
          },
          ...posts,
        ]);
      }
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const editPost = ({
  postId,
  content,
  setNewContent,
  setStatusOfEdit,
  setError,
}) => {
  axios
    .post("/post/edit", { postId, content })
    .then(() => {
      setNewContent({ text: content, postId });
      setStatusOfEdit(false);
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const deletePost = ({ postId, posts, setPosts, isSingle, setError }) => {
  axios
    .post("/post/delete", { postId })
    .then(() => {
      isSingle && Router.push("/");
      const newPosts = posts.filter((post) => post.postId !== postId);
      setPosts(newPosts);
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const deletePostShare = ({
  shareId,
  posts,
  setPosts,
  isSingle,
  setError,
}) => {
  axios
    .post("/post/share/delete", { shareId })
    .then(() => {
      isSingle && Router.push("/");
      const newPosts = posts.filter((post) => post.shareId !== shareId);
      setPosts(newPosts);
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const getComments = ({
  postId,
  from,
  users,
  setUsers,
  comments,
  setComments,
  setStatusOfMoreData,
}) => {
  axios
    .post("/comment/get", { postId, from })
    .then(async ({ data: { comments: newComments, isMore } }) => {
      await getUsers(users, setUsers, newComments);
      setComments([...comments, ...newComments]);
      setStatusOfMoreData(isMore);
    });
};

export const addComent = ({
  postId,
  content,
  clearText,
  setNewComment,
  setError,
}) => {
  axios
    .post("/comment/add", {
      postId,
      content,
    })
    .then(({ data: { commentId, date } }) => {
      setNewComment({
        content,
        idElement: postId,
        commentId,
        type: "post",
        date,
      });
      clearText("");
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const deleteComment = ({
  commentId,
  comments,
  setComments,
  setError,
  setNumberOfComments,
}) => {
  axios
    .post("/comment/delete", {
      commentId,
    })
    .then(() => {
      const filteredComments = comments.filter(
        (comment) => comment.commentId !== commentId
      );
      setComments(filteredComments);
      setNumberOfComments((prev) => prev - 1);
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const likeComment = ({ commentId, setNewLike, setError }) => {
  axios
    .post("/comment/like", { commentId })
    .then(({ data: { likeId } }) => {
      setNewLike({
        likeId,
        idElement: commentId,
        type: "comment",
      });
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const unlikeComment = ({ commentId, setNewLike, setError }) => {
  axios
    .post("/comment/unlike", { commentId })
    .then(() =>
      setNewLike({ likeId: null, idElement: commentId, type: "comment" })
    )
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const getReplies = async ({
  commentId,
  from,
  replies,
  setReplies,
  users,
  setUsers,
  setStatusOfMoreData,
}) => {
  axios
    .post("/reply/get", {
      commentId,
      from,
    })
    .then(async ({ data: { replies: r, isMore } }) => {
      await getUsers(users, setUsers, r);
      setReplies([...replies, ...r]);
      setStatusOfMoreData(isMore);
    });
};

export const addReply = ({
  commentId,
  content,
  clearText,
  setNewComment,
  setError,
}) => {
  axios
    .post("/reply/add", {
      commentId,
      content,
    })
    .then(({ data: { replyId, date } }) => {
      setNewComment({
        content,
        idElement: commentId,
        replyId,
        type: "comment",
        date,
      });
      clearText("");
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const deleteReply = ({
  replyId,
  replies,
  setReplies,
  setError,
  setNumberOfReplies,
}) => {
  axios
    .post("/reply/delete", {
      replyId,
    })
    .then(() => {
      const filteredReplies = replies.filter(
        (reply) => reply.replyId !== replyId
      );
      setReplies(filteredReplies);
      setNumberOfReplies((prev) => prev - 1);
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const likeReply = async ({ replyId, setNewLike, setError }) => {
  axios
    .post("/reply/like", { replyId })
    .then(({ data: { likeId } }) =>
      setNewLike({ likeId, idElement: replyId, type: "reply" })
    )
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const unlikeReply = async ({ replyId, setNewLike, setError }) => {
  axios
    .post("/reply/unlike", { replyId })
    .then(() => setNewLike({ likeId: null, idElement: replyId, type: "reply" }))
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};
