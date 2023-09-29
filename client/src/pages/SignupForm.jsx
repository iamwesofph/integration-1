import { useState } from "react";
import userService from "../services/users";
import { useNavigate } from "react-router-dom";

const SignupForm = ({ setNotification }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        password: "",
        confirmPassword: "",
        // profilePhoto: null, // For file input, initialize with null
        source: "local",
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

        const returnedUser = await userService.create(formData);
        console.log(`RETURNED USER: ${JSON.stringify(returnedUser)}`);

        setNotification({ message: `You're signed up as ${formData.displayName}!`, type: "success" });
        setTimeout(() => {
            setNotification(null);
        }, 5000);
        navigate("/");
    };

    return (
        <>
            <h2 className="text-2xl mb-8 text-white text-center">Signup Form</h2>
            <form className="sm:w-[400px] mx-auto" onSubmit={handleSubmit}>
                <label>
                    <span className="block text-sm font-medium text-white">Display Name</span>
                    <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} className="mt-1 mb-2 px-3 py-2 bg-white text-black border-2 shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1  valid:border-green-400 " placeholder="John Wick" autoComplete="displayName" required autoFocus />
                </label>

                <label>
                    <span className="block text-sm font-medium text-white">Email Address</span>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 mb-2 px-3 py-2 bg-white text-black border-2 shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1  valid:border-green-400 " placeholder="john@example.com" required />
                </label>

                <label>
                    <span className="block text-sm font-medium text-white">Password</span>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 mb-2 px-3 py-2 bg-white text-black border-2 shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1  valid:border-green-400 " placeholder="JohnWick@123" autoComplete="current-password" required />
                </label>

                {/* <label>
                    <span className="block text-sm font-medium text-white">Confirm Password</span>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="mt-1 mb-2 px-3 py-2 bg-white text-black border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" placeholder="JohnWick@123" required />
                </label> */}
                <label>
                    <span>Confirm Password</span>
                    <input
                        className="mt-1 mb-2 px-3 py-2 bg-white text-black border-2 shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1 valid:border-green-400"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        required
                        pattern={`^${formData.password}$`} // Use a regular expression to match the password
                        // pattern={formData.password} // Check if it matches the password
                        title="Passwords must match" // Custom error message
                    />
                </label>

                <label>
                    <span className="block text-sm font-medium text-white">Profile Photo</span>
                    <input type="file" name="uploadPhoto" onChange={handleChange} className="mt-1 mb-2 px-3 py-2 bg-white text-black border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" />
                </label>

                <button className="bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded focus:outline-none mr-2" type="submit">
                    Sign Up
                </button>
            </form>
        </>
    );
};

export default SignupForm;
