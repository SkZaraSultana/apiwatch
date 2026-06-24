import React, { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";
import { fetchNotifications } from "../../services/notificationService";
import { getSocket } from "../../services/socketClient";

const NotificationBell: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const items = await fetchNotifications(20);
        setUnreadCount(items.filter((n: any) => !n.read).length);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("Failed to load notifications", err);
      }
    };

    load();

    const socket = getSocket();
    const onCreated = () => {
      setUnreadCount((c) => c + 1);
    };

    socket?.on("notification:created", onCreated);

    return () => {
      socket?.off("notification:created", onCreated);
    };
  }, []);

  return (
    <div className="relative">
      <button className="p-2 text-gray-600 hover:text-gray-800">
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full px-1 text-xs">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default NotificationBell;
