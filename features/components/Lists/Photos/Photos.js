import React from "react";

const PhotoList = ({
  photoList = [
    {
      id: 1,
      name: "profile.png",
    },
    {
      id: 2,
      name: "profile.png",
    },
    {
      id: 3,
      name: "profile.png",
    },
    {
      id: 4,
      name: "profile.png",
    },
    {
      id: 5,
      name: "profile.png",
    },
    {
      id: 6,
      name: "profile.png",
    },
  ],
}) => {
  return (
    <div className="photo-list">
      {photoList.map((photo) => (
        <div className="photo-list__item">
          <img
            src={"/static/images/" + photo.name}
            alt="Zdjęcia użytkowika"
            className="photo-list__item--img"
          />
        </div>
      ))}
    </div>
  );
};

export default PhotoList;
