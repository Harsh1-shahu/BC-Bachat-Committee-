import React from "react";
import { useProject } from "../../Context/ProjectContext";

const Notification = () => {
  const { notification } = useProject();

  if (!notification.visible) return null;

  const colorClass =
    notification.type === "success" ? "bg-green-500" :
    notification.type === "error"   ? "bg-red-500" :
    notification.type === "warning" ? "bg-yellow-500" :
    "bg-blue-500";

  return (
    <div className={`fixed top-5 right-2 z-1000 px-4 py-2 rounded-lg shadow-lg text-white ${colorClass} animate-slide-in`}>
      {notification.message}
    </div>
  );
};

export default Notification;
