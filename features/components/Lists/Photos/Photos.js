import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "~features/service/Axios";

const Photos = ({ userId }) => {
  const [photos, setPhotos] = useState([]);
  const [isMore, setStatusOfMore] = useState(false);

  const fetchData = (from) => {
    axios
      .post("/user/get/photo", { userId, from })
      .then(({ data: { photos: initialPhotos, isMorePhotos } }) => {
        setPhotos((prev) => [...prev, ...initialPhotos]);
        setStatusOfMore(isMorePhotos);
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
              src={`/static/images/${photo.name}`}
              alt="Zdjęcia użytkowika"
              className="photo-list__item__photo"
            />
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
};

Photos.propTypes = {
  userId: PropTypes.number.isRequired,
};

export default Photos;
