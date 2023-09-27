const Notification = ({ notification }) => {
    if (notification === null) {
        return null;
    }
    if (notification.type === "success") {
        return <div className="w-full px-4 py-2 rounded-md bg-gray-800 border-black text-green-400 mb-4">{notification.message}</div>;
    } else if (notification.type === "error") {
        return <div className="w-full px-4 py-2 rounded-md bg-gray-800 border border-black text-red-600 mb-4">{notification.message}</div>;
    }
};

export default Notification;
