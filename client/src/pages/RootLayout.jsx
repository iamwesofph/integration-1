import { Outlet, NavLink } from "react-router-dom";
import Footer from "./Footer";
import Notification from "./Notification";
import DropDown from "./DropDown";

export default function RootLayout({ notification, user }) {
    const isUserLoaded = user && user.firstName && user.profilePhoto;

    return (
        <div className="flex flex-col p-6 h-screen bg-slate-600 text-white">
            <header>
                <nav className="flex justify-between items-center">
                    <div></div>
                    <div className="flex justify-center gap-10 uppercase text-lg specific">
                        <NavLink className="text-cyan-400 bg-gray-800 hover:underline rounded-md px-4 py-2" to="/">
                            anecdotes
                        </NavLink>
                        <NavLink className="text-cyan-400 bg-gray-800 hover:underline rounded-md px-4 py-2 whitespace-nowrap" to="/create">
                            create new
                        </NavLink>
                        <NavLink className="text-cyan-400 bg-gray-800 hover:underline rounded-md px-4 py-2" to="/about">
                            about
                        </NavLink>
                    </div>
                    <div>
                        {isUserLoaded ? (
                            <DropDown user={user}></DropDown>
                        ) : (
                            <NavLink className="text-cyan-400 bg-gray-800 hover:underline rounded-md px-4 py-2 uppercase" to="/login">
                                Login
                            </NavLink>
                        )}
                    </div>
                </nav>
            </header>
            <main className="grow p-6">
                <Notification notification={notification} />
                <Outlet />
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    );
}
