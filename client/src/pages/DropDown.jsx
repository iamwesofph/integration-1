import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DropDownCaret from "../icons/dropdowncaretsmall.svg?react";
import BellIcon from "../icons/bell.svg?react";
import MessengerIcon from "../icons/messenger.svg?react";
import PlusIcon from "../icons/plus.svg?react";
import CogIcon from "../icons/cog.svg?react";

export default function DropDown({ user }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button className="flex justify-center items-center bg-slate-700 border border-cyan-400 rounded-3xl px-4 py-2 text-sm hover:bg-slate-900 transition-colors duration-300 whitespace-nowrap" onClick={() => setOpen(!open)}>
                <span className="mr-1">{user.firstName || user.displayName}</span>
                <DropDownCaret />
            </button>
            <AnimatePresence>{open && <DropdownMenu user={user} />}</AnimatePresence>
        </>
    );
}

function DropdownMenu({ user }) {
    // TODO: understand why this doesnt work instead of the window.open method + try POST if its better than GET for logouts.
    // const handleLogout = async () => {
    //     try {
    //         // Replace "backend-url" with the actual URL of your backend server
    //         await axios.post("http://localhost:3001/auth/logout");
    //         // Redirect or perform any other actions after successful logout
    //     } catch (error) {
    //         // Handle any errors here
    //         console.error("Logout failed x", error);
    //     }
    // };
    const handleLogout = () => {
        // window.open(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, "_self");
        window.open("/auth/logout", "_self");
    };

    return (
        <motion.div
            className="h-auto w-72 absolute right-0 flex flex-col border border-cyan-400 bg-gray-800 rounded-lg text-sm"
            initial={{ opacity: 0, scale: 0.3, x: 50, y: -150 }}
            animate={{ opacity: 1, scale: 1, x: -22, y: 20 }}
            exit={{ opacity: 0, scale: 0.3, x: 50, y: -150 }} // Define the exit animation
            transition={{ duration: 0.2, ease: "easeIn" }}
        >
            <div className="flex flex-col items-center gap-6 py-6">
                <div>{user.profilePhoto ? <img className="rounded-full w-14 border border-white" src={user.profilePhoto} alt="profile photo" referrerPolicy="no-referrer" /> : <CogIcon className="w-6 h-6 fill-current m-3" />}</div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-lg font-bold">{user.firstName || user.displayName}</span>
                    <h3 className="text-xs">{user.email}</h3>
                </div>
                <div>
                    <button className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-500 transition-colors">Manage your account</button>
                </div>
            </div>

            <div className="flex flex-col items-start">
                <button className="flex items-center hover:text-cyan-400 hover:bg-slate-700 w-full transition-colors">
                    <BellIcon className="w-6 h-6 fill-current m-3" />
                    <span>Notifications</span>
                </button>
                <button className="flex items-center hover:text-cyan-400 hover:bg-slate-700 w-full transition-colors">
                    <PlusIcon className="w-6 h-6 fill-current m-3" />
                    <span>Support</span>
                </button>
                <button className="flex items-center hover:text-cyan-400 hover:bg-slate-700 w-full transition-colors">
                    <MessengerIcon className="w-6 h-6 fill-current m-3" />
                    <span>Give us Feedback</span>
                </button>
                <button className="flex items-center hover:text-cyan-400 hover:bg-slate-700 w-full transition-colors">
                    <CogIcon className="w-6 h-6 fill-current m-3" />
                    <span>Settings</span>
                </button>

                <div className="h-[1px] relative bg-cyan-400 w-full"></div>
            </div>
            <div className="m-3">
                <span className="cursor-pointer" onClick={handleLogout}>
                    Logout
                </span>
            </div>
        </motion.div>
    );
}
