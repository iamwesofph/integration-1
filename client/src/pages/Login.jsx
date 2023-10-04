import { useState } from "react";
import FacebookLogo from "../icons/facebooklogo.svg?react";
import GoogleLogo from "../icons/googlelogo.svg?react";
import GithubLogo from "../icons/githublogo.svg?react";
import { Link } from "react-router-dom";
import { useField } from "../hooks/";

export default function Login({ setNotification }) {
    const [showPassword, setShowPassword] = useState(false);
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    const email = useField("email");
    const password = useField("password");

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

    const handleNextLogin = async () => {
        if (showPassword === false) {
            setShowPassword(true);
        } else {
            const url = `/auth/login-local`;
            const { data } = await axios.get(url);
            console.log(data.user);
        }
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
                <input {...email} reset="" name="email" className="mt-1 mb-2 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1 disabled:bg-slate-300" placeholder="you@example.com" autoFocus disabled={showPassword ? true : false} />
            </label>

            {showPassword && (
                <label className="block">
                    <span className="block text-sm font-medium text-slate-700">Password</span>
                    <input {...password} reset="" name="password" className="mt-1 mb-2 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" placeholder="You@1234" />
                </label>
            )}

            <button className="bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded focus:outline-none mr-2" type="button" onClick={() => handleNextLogin()}>
                {showPassword ? "Login" : "Next"}
            </button>

            <p className="mt-4">
                Don't have an account?{" "}
                <Link className="underline hover:text-cyan-400" to="/signup">
                    Sign up
                </Link>
            </p>
        </section>
    );
}
