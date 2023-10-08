import { useState } from "react";
import userService from "../services/users";
import { useNavigate } from "react-router-dom";

const SignupForm = ({ setNotification }) => {
    const navigate = useNavigate();
    const [isDisabled, setIsDisabled] = useState(false);
    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        password: "",
        // profilePhoto: null, // For file input, initialize with null
        // uploadPhoto: null,
    });

    const handleChange = (event) => {
        const { name, value, type, files } = event.target;
        // If the input is a file input, use `files` to get the selected file(s)
        const newValue = type === "file" ? files[0] : value;

        setFormData({
            ...formData,
            [name]: newValue,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsDisabled(true);

        try {
            await userService.create(formData);
            setNotification({ message: `You're signed up as ${formData.displayName}!  Redirecting to login page...`, type: "success" });
            setTimeout(() => {
                setNotification(null);
                navigate("/login");
                navigate(0);
            }, 5000);
        } catch (error) {
            if (error.response.data.error) {
                const firstError = error.response.data.error;
                setNotification({ message: firstError, type: "error" });
                setIsDisabled(false);
                setTimeout(() => {
                    setNotification(null);
                }, 5000);
            }
        }
    };

    return (
        <>
            <h2 className="text-2xl mb-8 text-white text-center">Signup Form</h2>
            <div className="flex justify-evenly items-center p-4">
                <div>
                    <details className="relative">
                        <summary className="list-none" aria-haspopup="menu" role="button">
                            <img className="rounded-full overflow-hidden inline-block border-none" src="https://avatars.githubusercontent.com/u/121594156?s=400&amp;v=4" width="200" height="200" alt="@iamwesofph" />
                            <div className="relative w-16 left-0 bottom-10 bg-gray-800 rounded-md fill-current text-sm px-2 py-1 mb-2 border border-gray-500">
                                <div className="flex justify-around items-center">
                                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" className="fill-current">
                                        <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z"></path>
                                    </svg>
                                    <span>Edit</span>
                                </div>
                            </div>
                        </summary>

                        <div className="absolute bottom-2" role="menu" tabIndex="0">
                            <label htmlFor="avatar_upload" className="whitespace-nowrap text-sm cursor-pointer bg-gray-800 rounded-md border border-gray-500 px-4 py-2 hover:bg-cyan-400" role="menuitem">
                                Upload a photo…
                            </label>
                        </div>
                    </details>
                </div>

                <form className="sm:w-[400px]" onSubmit={handleSubmit}>
                    <label>
                        <span className="block text-sm font-medium text-white">Display Name</span>
                        <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} className="mt-1 mb-2 px-3 py-2 bg-white text-black border-2 shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1  valid:border-green-400 disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300" placeholder="John Wick" autoComplete="displayName" required autoFocus pattern=".*\S+.*" title="Display name is required" disabled={isDisabled} />
                    </label>

                    <label>
                        <span className="block text-sm font-medium text-white">Email Address</span>
                        <input type="text" name="email" value={formData.email} onChange={handleChange} className="mt-1 mb-2 px-3 py-2 bg-white text-black border-2 shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1  valid:border-green-400 disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300 " placeholder="john@example.com" required disabled={isDisabled} />
                    </label>

                    <label>
                        <span className="block text-sm font-medium text-white">Password</span>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 mb-2 px-3 py-2 bg-white text-black border-2 shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1  valid:border-green-400 disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300" placeholder="JohnWick@123" autoComplete="current-password" required minLength="8" disabled={isDisabled} />
                    </label>

                    <label>
                        <span className="block text-sm font-medium text-white">Confirm Password</span>
                        <input
                            className="mt-1 mb-2 px-3 py-2 bg-white text-black border-2 shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1 valid:border-green-400 disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            required
                            pattern={`^${formData.password}$`} // Use a regular expression to match the password
                            title="Passwords must match" // Custom error message
                            disabled={isDisabled}
                        />
                    </label>

                    {/* <label>
                        <span className="block text-sm font-medium text-white">Profile Photo</span>
                        <input type="file" name="uploadPhoto" onChange={handleChange} className="mt-1 mb-2 px-3 py-2 bg-white text-black border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-40 h-40 rounded-full sm:text-sm focus:ring-1 disabled:bg-gray-200 disabled:text-gray-300 disabled:border-gray-500" disabled={isDisabled} />
                    </label> */}

                    {isDisabled ? (
                        <button disabled className="flex items-center bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded focus:outline-none mr-2" type="submit">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing
                        </button>
                    ) : (
                        <div className="flex justify-end">
                            <button className="bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded focus:outline-none mt-4" type="submit">
                                Sign Up
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
};

export default SignupForm;
