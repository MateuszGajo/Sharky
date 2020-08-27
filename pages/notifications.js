import React, { useState, useEffect } from "react";
import axios from "axios";
import { uuid } from "uuidv4";
import InfiniteScroll from "react-infinite-scroll-component";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import Item from "@components/Notifications/Item/Item";
import Spinner from "@components/Spinner/Spinner";
import "../styles/main.scss";

const notifications = () => {
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
    axios
      .get("/notification/get")
      .then(({ data: { invitations, newRelations } }) => {
        const items = [...invitations, ...newRelations];
        console.log(items);
        const notifications = items
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((item) => ({ ...item, id: uuid() }));

        console.log(notifications);
        setAllNotifications(notifications);
        setNotifications(notifications.slice(0, 20));
        if (items.length < 20) setStatusOfMore(false);
      });
  }, []);
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
