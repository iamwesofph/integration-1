import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import Footer from "./Footer";
import Notification from "./Notification";
import DropDown from "./DropDown";
import WesbookLogo from "../icons/wesbooklogo.svg?react";
import Hamburger from "../icons/hamburger.svg?react";
import { motion } from "framer-motion";
import Menu from "../icons/menu.svg?react";
import X from "../icons/x.svg?react";

export default function RootLayout({ notification, user }) {
    // const isUserLoaded = user && user.firstName && user.profilePhoto;
    const isUserLoaded = user;
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="flex flex-col h-screen bg-slate-600 text-white text-sm sm:text-base">
            <header>
                <nav className="w-full sm:justify-between sm:items-center p-6 bg-gray-800 sm:h-20 specific sm:text-lg">
                    <div className={`flex items-center justify-between ${isExpanded && "mb-4"}`}>
                        <div className="flex items-center">
                            <WesbookLogo className="w-16 h-auto select-none" />
                            <div className="-skew-y-6 select-none">
                                <span className="font-handlee text-4xl font-extrabold italic text-cyan-400">Wes</span>
                                <span className="font-handlee text-4xl font-extrabold italic">book</span>
                            </div>
                        </div>
                        <button onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? <X className="w-8 h-auto fill-current" /> : <Hamburger className="w-8 h-auto fill-current" />}</button>
                    </div>

                    {isExpanded && (
                        <motion.div
                            className="flex flex-col sm:flex-row sm:justify-center sm:items-center sm:gap-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }} // Define the exit animation
                            transition={{ duration: 0.5, ease: "easeIn" }}
                        >
                            <NavLink className="text-cyan-400 bg-gray-800 hover:underline rounded-md px-4 py-1 uppercase" to="/">
                                anecdotes
                            </NavLink>
                            <NavLink className="text-cyan-400 bg-gray-800 hover:underline rounded-md px-4 py-1 whitespace-nowrap uppercase" to="/create">
                                create new
                            </NavLink>
                            <NavLink className="text-cyan-400 bg-gray-800 hover:underline rounded-md px-4 py-1 uppercase" to="/about">
                                about
                            </NavLink>
                        </motion.div>
                    )}

                    <div>
                        {/* {isUserLoaded ? (
                            <DropDown user={user}></DropDown>
                        ) : (
                            <NavLink className="text-cyan-400 bg-gray-800 hover:underline rounded-md px-4 py-1 uppercase" to="/login">
                                Login
                            </NavLink>
                        )} */}
                    </div>
                </nav>
            </header>
            <main className="grow p-6">
                <Notification notification={notification} />
                <Outlet />
            </main>
            <footer className="fixed bottom-0">
                <Footer />
            </footer>
        </div>
    );
}
