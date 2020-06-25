import axios from "axios";

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
      .then(({ data: { users } }) => {
        let usersKey = {};

        for (let i = 0; i < users.length; i++) {
          const { id, firstName, lastName, photo } = users[i];
          usersKey[id] = {
            id,
            firstName,
            lastName,
            photo,
          };
        }

        setUsers({ ...users, ...data });
      })
      .catch((err) => console.log(err));
};

export const getPosts = (
  posts,
  setPosts,
  from,
  users,
  setUsers,
  setStatusOfMorePosts,
  setStatusOfMoreComments
) => {
  axios
    .post("/post/get", { from })
    .then(
      async ({
        data: { posts: p, comments: c, isMorePosts, isMoreComments },
      }) => {
        await getUsers(users, setUsers, p);
        await getUsers(users, setUsers, c);

        const comments = new Array(2);
        c.forEach((item, index) => {
          if (!comments[item.idPost]) {
            comments[item.idPost] = [];
          }
          comments[item.idPost].push({ ...item, replies: replies[index] });
        });

        const newPosts = p.map((item, index) => {
          return {
            ...item,
            comments: comments[index],
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
          photo: "profile.png",
        },
        ...posts,
      ]);
      clearText("");
    })
    .catch((err) => console.log(err.response));
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
      console.log(newComments);
      await getUsers(users, setUsers, newComments);
      setComments([...newComments, ...comments]);
      setStatusOfMoreData(isMore);
    })
    .catch((err) => console.log(err));
};

export const addComent = ({
  comments,
  setComments,
  idPost,
  content,
  date,
  clearText,
}) => {
  axios
    .post("/comment/add", {
      idPost,
      content,
      date,
    })
    .then(({ data: { idUser, idComment: id } }) => {
      setComments([
        {
          id,
          idUser,
          likes: 0,
          content,
          numberOfReplies: 0,
        },
        ...comments,
      ]);

      clearText("");
    })
    .catch((err) => console.log("err"));
};

export const likeComment = ({ idComment, setIdLike }) => {
  console.log("postlike");
  axios
    .post("/comment/like", { idComment })
    .then(({ data: { idCommentLike } }) => {
      console.log(idCommentLike);
      setIdLike(idCommentLike);
    })
    .catch((err) => console.log(err));
};

export const unlikeComment = ({ idLike, setIdLike }) => {
  console.log("postunlike");
  axios
    .post("/comment/unlike", { idLike })
    .then((resp) => setIdLike(null))
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
      setReplies([...replies, ...r]);
      setStatusOfMoreData(isMore);
    })
    .catch((err) => console.log(err));
};

export const addReply = ({
  idComment,
  content,
  replies,
  setReplies,
  date,
  clearText,
}) => {
  axios
    .post("/reply/add", {
      idComment,
      content,
      date,
    })
    .then(({ data: { idReply: id, idUser } }) => {
      clearText("");
      setReplies([{ id, idUser, likes: 0, content }, ...replies]);
    })
    .catch((err) => console.log(err));
};

export const likeReply = async ({ idReply, setIdLike }) => {
  console.log("replylike");
  axios
    .post("/reply/like", { idReply })
    .then(({ data: { idReplyLike } }) => setIdLike(idReplyLike))
    .catch((err) => console.log(err));
};

export const unlikeReply = async ({ idLike, setIdLike }) => {
  console.log("replyunlike");
  axios
    .post("/reply/unlike", { idLike })
    .then((resp) => setIdLike(null))
    .catch((err) => console.log(err));
};
