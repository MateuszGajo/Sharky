import React from "react";

const PostList = ({
  posts = [
    {
      id: 1,
      content: "dasdsa",
      date: new Date("2019-03-25"),
      photo: "profile.png",
    },
    {
      id: 2,
      content: "dasdsa",
      date: new Date("2015-03-25"),
      photo: null,
    },
  ],
  user = {
    id: 345,
    firstName: "Jan",
    lastName: "Kowalski",
    photo: "profile.png",
  },
}) => {
  return (
    <div className="post-list">
      {posts.map((post) => {
        const dtf = new Intl.DateTimeFormat("pl", {
          year: "numeric",
          month: "long",
          day: "2-digit",
        });
        const [
          { value: da },
          ,
          { value: mo },
          ,
          { value: ye },
        ] = dtf.formatToParts(post.date);
        return (
          <div className="post-list__item" key={post.id}>
            <div className="post-list__item__navbar">
              <div className="post-list__item__navbar__user">
                <div className="post-list__item__navbar__user--photo">
                  <img
                    src={"/static/images/" + user.photo}
                    alt="Zdjęcie użytkownika"
                    className="post-list__item__navbar__user--photo--img"
                  />
                </div>
                <div className="post-list__item__navbar__user--name">
                  <span className="post-list__item__navbar__user--name--span">
                    {user.firstName + " " + user.lastName}
                  </span>
                </div>
              </div>
              <div className="post-list__item__navbar__data">
                <span className="post-list__item__navbar__data--span">
                  {da} {mo} {ye}
                </span>
              </div>
            </div>
            <div className="post-list__item__content">
              <span className="post-list__item__content--span">
                {post.content}
              </span>
            </div>
            {post.photo !== null && (
              <div className="post-list__item__photo">
                <img
                  src={"/static/images/" + post.photo}
                  alt=""
                  className="post-list__item__photo--img"
                />
              </div>
            )}
            <div className="post-list__item__downbar">
              <div className="post-list__item__downbar__item">
                <div className="post-list__item__downbar__item--icon"></div>
                <div className="post-list__item__downbar__item--name"></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostList;
