import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import axios from "axios";
import { uuid } from "uuidv4";
import InfiniteScroll from "react-infinite-scroll-component";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import Item from "@components/Notifications/Item/Item";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions/index";
import "../styles/main.scss";

const notifications = () => {
  const { setOwner, isAuth, setStatusOfAuth } = useContext(AppContext);

  const [notifications, setNotifications] = useState([]);
  const [allNotification, setAllNotifications] = useState([]);
  const [deleteNotification, setDeleteNotification] = useState({ id: null });
  const [isMore, setStatusOfMore] = useState(true);

  const fetchData = () => {
    if (notifications.length > allNotification.length + 20) {
      setStatusOfMore(false);
      setNotifications((prev) => [
        ...prev,
        allNotification.slice(prev.length, allNotification.length),
      ]);
    } else
      setNotifications((prev) => [
        ...prev,
        allNotification.slice(prev.length, prev.length + 20),
      ]);
  };

  useEffect(() => {
    const { id } = deleteNotification;
    if (id) {
      const newNotifications = notifications.filter(
        (notification) => notification.id != id
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

          const notifications = items
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((item) => ({ ...item, id: uuid() }));

          setAllNotifications(notifications);
          setNotifications(notifications.slice(0, 20));
          if (items.length < 20) setStatusOfMore(false);
        });
  }, [isAuth]);

  useEffect(() => {
    getOwner({ setStatusOfAuth, setOwner });
  }, []);

  if (isAuth == null) return <Spinner />;
  else if (!isAuth) {
    Router.push("/signin");
    return <Spinner />;
  }
  return (
    <HomeLayout>
      <InfiniteScroll
        dataLength={notifications.length}
        next={fetchData}
        hasMore={isMore}
        loader={<Spinner />}
      >
        {notifications.map((item) => {
          return (
            <Item
              item={item}
              key={item.id}
              setDeleteNotification={setDeleteNotification}
            />
          );
        })}
      </InfiniteScroll>
    </HomeLayout>
  );
};

export default notifications;
