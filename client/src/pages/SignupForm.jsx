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

        const loggedUserToken = window.localStorage.getItem("loggedUserToken");
        const headerConfig = {
            //TODO
            headers: {
                Authorization: `Bearer ${loggedUserToken}`,
                // Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MWQ0Y2ViZjNhZDU0MTMwYTE1MzU4YiIsImlhdCI6MTY5NjQ3OTI0OCwiZXhwIjoxNjk2NDgyODQ4fQ.7r50zQFjpBv1kkvLNE3iMToKrrJoSsohSLTmmSoQ5Hc",
            },
        };

        try {
            const x = await userService.create(formData);
            setNotification({ message: `You're signed up as ${formData.displayName}!  Redirecting to login page...`, type: "success" });
            setTimeout(() => {
                setNotification(null);
                navigate("/login");
                navigate(0);
            }, 5000);
        } catch (error) {
            if (error.response.data.errors) {
                const firstError = error.response.data.errors[0];
                setNotification({ message: firstError.msg, type: "error" });
                setIsDisabled(false);
                setTimeout(() => {
                    setNotification(null);
                }, 5000);
            } else {
                // Handle other types of errors here
                console.log(`HANDLESUBMIT ERROR ${error}`);
            }
        }
    };

    return (
        <>
            <h2 className="text-2xl mb-8 text-white text-center">Signup Form</h2>
            <form className="sm:w-[400px] mx-auto" onSubmit={handleSubmit}>
                <label>
                    <span className="block text-sm font-medium text-white">Display Name</span>
                    <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} className="mt-1 mb-2 px-3 py-2 bg-white text-black border-2 shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1  valid:border-green-400 disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300" placeholder="John Wick" autoComplete="displayName" required autoFocus pattern=".*\S+.*" title="Display name is required" disabled={isDisabled} />
                </label>

                <label>
                    <span className="block text-sm font-medium text-white">Email Address</span>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 mb-2 px-3 py-2 bg-white text-black border-2 shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1  valid:border-green-400 disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300 " placeholder="john@example.com" required disabled={isDisabled} />
                </label>

                <label>
                    <span className="block text-sm font-medium text-white">Password</span>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 mb-2 px-3 py-2 bg-white text-black border-2 shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1  valid:border-green-400 disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300" placeholder="JohnWick@123" autoComplete="current-password" required minLength="8" disabled={isDisabled} />
                </label>

                <label>
                    <span>Confirm Password</span>
                    <input
                        className="mt-1 mb-2 px-3 py-2 bg-white text-black border-2 shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1 valid:border-green-400 disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300"
                        name="confirmPassword"
                        type="password"
                        // value={formData.confirmPassword}
                        // onChange={handleChange}
                        placeholder="Confirm Password"
                        required
                        pattern={`^${formData.password}$`} // Use a regular expression to match the password
                        // pattern={formData.password} // Check if it matches the password
                        title="Passwords must match" // Custom error message
                        disabled={isDisabled}
                    />
                </label>

                <label>
                    <span className="block text-sm font-medium text-white">Profile Photo</span>
                    <input type="file" name="uploadPhoto" onChange={handleChange} className="mt-1 mb-2 px-3 py-2 bg-white text-black border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1 disabled:bg-gray-200 disabled:text-gray-300 disabled:border-gray-500" disabled={isDisabled} />
                </label>
                {isDisabled ? (
                    <button disabled className="flex items-center bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded focus:outline-none mr-2" type="submit">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing
                    </button>
                ) : (
                    <button className="bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded focus:outline-none mr-2" type="submit">
                        Sign Up
                    </button>
                )}
            </form>
        </>
    );
};

export default SignupForm;
