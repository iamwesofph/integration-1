import React from "react";
import FacebookLogo from "../icons/facebooklogo.svg?react";
import GoogleLogo from "../icons/googlelogo.svg?react";
import GithubLogo from "../icons/githublogo.svg?react";

export default function Login({ setNotification }) {
    const googleAuth = () => {
        // window.open(`${import.meta.env.VITE_SERVER_URL}/auth/google`, "_self");
        window.open(`/auth/google`, "_self");
    };
    const facebookAuth = () => {
        // window.open(`${import.meta.env.VITE_SERVER_URL}/auth/google`, "_self");
        // window.open(`/auth/facebook`, "_self");
        // alert("Sorry! Currently not working because facebook login requires business verification :(");
        setNotification({ message: "Sorry! Facebook login currently not working due to business verification requirement :(", type: "warning" });
        setTimeout(() => {
            setNotification(null);
        }, 7000);
    };
    const githubAuth = () => {
        // window.open(`${import.meta.env.VITE_SERVER_URL}/auth/google`, "_self");
        window.open(`/auth/github`, "_self");
    };

    return (
        <section className="w-auto sm:w-[400px] p-6 text-black bg-white border border-gray-300 rounded-lg mx-auto">
            <h1 className="mb-2">Login</h1>
            <hr />
            <button className="flex justify-center items-center w-full text-center bg-white text-gray-600 text-lg font-semibold h-14 border border-gray-600 rounded-lg mb-4 hover:shadow-xl hover:scale-105" onClick={googleAuth}>
                <div className="flex justify-center items-center mr-2 w-10 h-10 min-w-10 min-h-10">
                    <GoogleLogo />
                </div>
                <span>Google</span>
            </button>

            <button className="flex justify-center items-center w-full text-center bg-white text-gray-600 text-lg font-semibold h-14 border border-gray-600 rounded-lg mb-4 hover:shadow-xl hover:scale-105" onClick={facebookAuth}>
                <div className="flex justify-center items-center mr-2 w-10 h-10 min-w-10 min-h-10">
                    <FacebookLogo />
                </div>
                <span>Facebook</span>
            </button>

            <button className="flex justify-center items-center w-full text-center bg-white text-gray-600 text-lg font-semibold h-14 border border-gray-600 rounded-lg mb-4 hover:shadow-xl hover:scale-105" onClick={githubAuth}>
                <div className="flex justify-center items-center mr-2 w-10 h-10 min-w-10 min-h-10">
                    <GithubLogo />
                </div>
                <span>Github</span>
            </button>

            <hr />

            <label className="block">
                <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">Email</span>
                <input type="email" name="email" className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" placeholder="you@example.com" />
            </label>

            <p className="mt-4">
                Don't have an account?{" "}
                <a className="underline hover:text-cyan-400" href="/signup">
                    Sign up
                </a>
            </p>
        </section>
    );
}
