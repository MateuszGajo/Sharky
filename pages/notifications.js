import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import { v4 as uuid } from "uuid";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "~features/service/Axios";
import HomeLayout from "~components/Layout/Home/HomeLayout";
import Item from "~components/Notifications/Item/Item";
import Spinner from "~components/Spinner/Spinner";
import PopUpHandlers from "~components/PopUpHandlers/PopUpHandlers";
import AppContext from "~features/context/AppContext";
import { getOwner } from "~features/service/Functions/index";
import "~styles/notifications.scss";

const Notifications = () => {
  const { setOwner } = useContext(AppContext);

  const [notifications, setNotifications] = useState([]);
  const [allNotification, setAllNotifications] = useState([]);
  const [deleteNotification, setDeleteNotification] = useState({ id: null });
  const [isMore, setStatusOfMore] = useState(true);
  const [isAuth, setStatusOfAuth] = useState(null);

  const fetchData = () => {
    if (notifications.length > allNotification.length + 20) {
      setStatusOfMore(false);
      setNotifications((prev) => [
        ...prev,
        allNotification.slice(prev.length, allNotification.length),
      ]);
    } else {
      setNotifications((prev) => [
        ...prev,
        allNotification.slice(prev.length, prev.length + 20),
      ]);
    }
  };

  useEffect(() => {
    const { id } = deleteNotification;
    if (id) {
      const newNotifications = notifications.filter(
        (notification) => notification.id !== id
      );
      setNotifications(newNotifications);
    }
  }, [deleteNotification]);

  useEffect(() => {
    isAuth &&
      axios
        .get("/notification/get")
        .then(({ data: { invitations, newRelations } }) => {
          const items = [...invitations, ...newRelations];

          const initialNotifications = items
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((item) => ({ ...item, id: uuid() }));

          setAllNotifications(initialNotifications);
          setNotifications(initialNotifications.slice(0, 20));
          if (items.length < 20) setStatusOfMore(false);
        });
  }, [isAuth]);

  useEffect(() => {
    getOwner({ setStatusOfAuth, setOwner });
  }, []);

  if (isAuth === null) return <Spinner />;
  if (!isAuth) {
    Router.push("/signin");
    return <Spinner />;
  }
  return (
    <HomeLayout>
      <PopUpHandlers />
      <InfiniteScroll
        dataLength={notifications.length}
        next={fetchData}
        hasMore={isMore}
        loader={<Spinner />}
      >
        {notifications.map((item) => (
          <Item
            item={item}
            key={item.id}
            setDeleteNotification={setDeleteNotification}
          />
        ))}
      </InfiniteScroll>
    </HomeLayout>
  );
};

export default Notifications;
