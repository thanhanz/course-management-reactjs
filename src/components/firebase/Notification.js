import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Badge, Dropdown, List } from "antd";
import { db } from "../firebase/config";
import { ref, onValue, update } from "firebase/database";
import moment from "moment/moment";

const Notifications = ({ lecturerId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!lecturerId) return;

    const notiRef = ref(db, `notifications/${lecturerId}`);

    return onValue(notiRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setNotifications(list.sort((a, b) => b.createdAt - a.createdAt));
      } else {
        setNotifications([]);
      }
    });
  }, [lecturerId]);

  const unseenCount = notifications.filter((n) => !n.seen).length;

  // Đánh dấu đã đọc khi click vào
  const markAsSeen = async (notiId) => {
    try {
      const notiRef = ref(db, `notifications/${lecturerId}/${notiId}`);
      await update(notiRef, { seen: true });
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };
 return (
    <Dropdown
      trigger={["click"]}
      dropdownRender={() => (
        <div className="bg-white shadow-lg rounded-lg w-80 max-h-96 overflow-y-auto p-2">
          <List
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                onClick={() => markAsSeen(item.id)}
                className={`rounded-lg mb-2 cursor-pointer transition-colors px-3 py-2 ${
                  !item.seen
                    ? "bg-gray-100 hover:bg-gray-200 font-semibold"
                    : "hover:bg-gray-50 text-gray-600"
                }`}
              >
                <div className="flex flex-col">
                  <p className="text-sm leading-snug">{item.message}</p>
                  <span className="text-xs text-gray-400 mt-1">
                    {moment(item.createdAt).fromNow()}
                  </span>
                </div>
              </List.Item>
            )}
          />
          {notifications.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              Chưa có thông báo nào
            </div>
          )}
        </div>
      )}
    >
      <Badge count={unseenCount} offset={[0, 6]} showZero>
        <Bell className="w-6 h-6 cursor-pointer text-white" />
      </Badge>
    </Dropdown>
  );
};

export default Notifications;