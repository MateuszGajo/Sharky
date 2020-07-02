import axios from "axios";
import { uuid } from "uuidv4";

export const getUsers = async (users, setUsers, elements) => {
  const idUsers = [];

  for (let i = 0; i < elements.length; i++) {
    const { idUser } = elements[i];
    if (users[idUser] === undefined) idUsers.push(idUser);
  }

  if (idUsers.length > 0)
    await axios
      .post("/user/get", {
        idUsers,
      })
      .then(({ data: { users: u } }) => {
        let usersKey = {};

        for (let i = 0; i < u.length; i++) {
          const { id, firstName, lastName, photo } = u[i];
          usersKey[id] = {
            id,
            firstName,
            lastName,
            photo,
          };
        }
        setUsers({ ...users, ...usersKey });
      })
      .catch((err) => console.log(err));
};

export const muteUser = ({ idMuteUser, posts, setPosts }) => {
  axios
    .post("/user/mute", {
      idMuteUser,
    })
    .then((resp) => {
      const filtredPosts = posts.filter((post) => {
        const idUser = post.idUserShare || post.idUser;

        return idMuteUser != idUser;
      });
      setPosts(filtredPosts);
    })
    .catch((err) => console.log(err));
};

export const blockUser = ({ idBlockUser, posts, setPosts }) => {
  axios
    .post("/user/block", { idBlockUser })
    .then((resp) => {
      const filtredPosts = posts.filter((post) => {
        const idUser = post.idUserShare || post.idUser;
        return idUser != idBlockUser;
      });
      setPosts(filtredPosts);
    })
    .catch((err) => console.log(err));
};

export const getPosts = ({
  posts,
  setPosts,
  from,
  users,
  setUsers,
  setStatusOfMorePosts,
  setStatusOfMoreComments,
}) => {
  axios
    .post("/post/get", { from })
    .then(
      async ({ data: { posts: p, comments, isMorePosts, isMoreComments } }) => {
        await getUsers(users, setUsers, p);
        await getUsers(users, setUsers, comments);

        const commentsKey = {};
        for (let i = 0; i < comments.length; i++) {
          if (!commentsKey[comments[i].idPost])
            commentsKey[comments[i].idPost] = [];
          commentsKey[comments[i].idPost].push(comments[i]);
        }
        const newPosts = p.map((item) => {
          return {
            ...item,
            id: uuid(),
            comments: commentsKey[item.idPost],
            isMoreComments:
              commentsKey[item.idPost] == undefined
                ? false
                : commentsKey[item.idPost][0].number < 4
                ? false
                : true,
          };
        });

        setStatusOfMorePosts(isMorePosts);
        setStatusOfMoreComments(isMoreComments);
        setPosts([...posts, ...newPosts]);
      }
    )
    .catch((err) => console.log(err));
};

export const addPost = ({
  content,
  date,
  photo,
  posts,
  setPosts,
  clearText,
}) => {
  axios
    .post("/post/add", {
      content,
      date,
      photo,
    })
    .then(({ data: { idPost: id, idUser } }) => {
      setUser(data.user);
      setPosts([
        {
          id,
          idUser,
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
    .catch((err) => console.log(err.response));
};

export const likePost = ({ idPost, setNewLike }) => {
  axios
    .post("/post/like", { idPost })
    .then(({ data: { idPostLike } }) =>
      setNewLike({ idLike: idPostLike, idElement: idPost, type: "post" })
    )
    .catch((err) => console.log(err));
};

export const unlikePost = ({ idLike, idPost, setNewLike }) => {
  axios
    .post("/post/unlike", { idLike })
    .then((resp) =>
      setNewLike({ idLike: null, idElement: idPost, type: "post" })
    )
    .catch((err) => console.log(err));
};

export const getComments = ({
  idPost,
  from,
  users,
  setUsers,
  comments,
  setComments,
  setStatusOfMoreData,
}) => {
  axios
    .post("/comment/get", { idPost, from })
    .then(async ({ data: { comments: newComments, isMore } }) => {
      await getUsers(users, setUsers, newComments);
      setComments([...comments, ...newComments]);
      setStatusOfMoreData(isMore);
    })
    .catch((err) => console.log(err));
};

export const sharePost = ({ post, posts, setPosts }) => {
  const date = new Date();
  axios
    .post("/post/share", {
      idPost: post.idPost,
      date,
    })
    .then(({ data: { idShare, idUser } }) => {
      setPosts([
        {
          ...post,
          idShare,
          id: uuid(),
          date,
          idUserShare: idUser,
          numberOfShares: Number(post.numberOfShares) + 1,
        },
        ...posts,
      ]);
    })
    .catch((err) => console.log(err));
};

export const editPost = ({ idPost, content }) => {
  axios
    .post("/post/edit", { idPost, content })
    .then((resp) => console.log(resp))
    .catch((err) => console.log(err));
};

export const addComent = ({
  idPost,
  content,
  date,
  clearText,
  setNewComment,
}) => {
  axios
    .post("/comment/add", {
      idPost,
      content,
      date,
    })
    .then(({ data: { idComment } }) => {
      setNewComment({
        content,
        idElement: idPost,
        idComment,
        type: "post",
        date,
      });
      clearText("");
    })
    .catch((err) => console.log("err"));
};

export const likeComment = ({ idComment, setNewLike }) => {
  axios
    .post("/comment/like", { idComment })
    .then(({ data: { idCommentLike } }) => {
      setNewLike({
        idLike: idCommentLike,
        idElement: idComment,
        type: "comment",
      });
    })
    .catch((err) => console.log(err));
};

export const unlikeComment = ({ idLike, idComment, setNewLike }) => {
  axios
    .post("/comment/unlike", { idLike })
    .then((resp) =>
      setNewLike({ idLike: null, idElement: idComment, type: "comment" })
    )
    .catch((err) => console.log(err));
};

export const getReplies = async ({
  idComment,
  from,
  replies,
  setReplies,
  users,
  setUsers,
  setStatusOfMoreData,
}) => {
  axios
    .post("/reply/get", {
      idComment,
      from,
    })
    .then(async ({ data: { replies: r, isMore } }) => {
      await getUsers(users, setUsers, r);
      console.log(r);
      console.log(replies);
      setReplies([...replies, ...r]);
      setStatusOfMoreData(isMore);
    })
    .catch((err) => console.log(err));
};

export const addReply = ({
  idComment,
  content,
  date,
  clearText,
  setNewComment,
}) => {
  axios
    .post("/reply/add", {
      idComment,
      content,
      date,
    })
    .then(({ data: { idReply } }) => {
      setNewComment({
        content,
        idElement: idComment,
        idReply,
        type: "comment",
        date,
      });
      clearText("");
    })
    .catch((err) => console.log(err));
};

export const likeReply = async ({ idReply, setNewLike }) => {
  axios
    .post("/reply/like", { idReply })
    .then(({ data: { idReplyLike } }) =>
      setNewLike({ idLike: idReplyLike, idElement: idReply, type: "reply" })
    )
    .catch((err) => console.log(err));
};

export const unlikeReply = async ({ idLike, idReply, setNewLike }) => {
  axios
    .post("/reply/unlike", { idLike })
    .then((resp) =>
      setNewLike({ idLike: null, idElement: idReply, type: "reply" })
    )
    .catch((err) => console.log(err));
};
