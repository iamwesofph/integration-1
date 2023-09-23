const Notification = ({ notification }) => {
    if (notification === null) {
        return null;
    }

    return <div className="w-full px-4 py-2 rounded-md bg-slate-500 border border-black text-green-400 mb-4">{notification}</div>;
};

export default Notification;
