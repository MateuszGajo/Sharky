import React, { useState, useEffect } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const PhotoList = ({ idUser }) => {
  const [photos, setPhotos] = useState([]);
  const [isMore, setStatusOfMore] = useState(false);

  const fetchData = (from) => {
    axios
      .post("/user/get/photo", { idUser, from })
      .then(({ data: { photos, isMore } }) => {
        setPhotos((prev) => [...prev, ...photos]);
        setStatusOfMore(isMore);
      });
  };

  useEffect(() => {
    fetchData(0);
  }, []);

  return (
    <InfiniteScroll
      dataLength={photos.length}
      next={() => fetchData(photos.length)}
      hasMore={isMore}
    >
      <div className="photo-list">
        {photos.map((photo) => (
          <div className="photo-list__item" key={photo.id}>
            <img
              src={"/static/images/" + photo.name}
              alt="Zdjęcia użytkowika"
              className="photo-list__item--img"
            />
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default PhotoList;
