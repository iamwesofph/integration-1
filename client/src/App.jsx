import { useState, useEffect } from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import NotFound from "./pages/NotFound";
import RootLayout from "./pages/RootLayout";
import AnecdoteList from "./pages/AnecdoteList";
import AnecdoteDetails from "./pages/AnecdoteDetails";
import SignupForm from "./pages/SignupForm";
import CreateNew from "./pages/CreateNew";
import Login from "./pages/Login";
import anecdoteService from "./services/anecdotes";
import loginService from "./services/login";
import About from "./pages/About";
import axios from "axios";
import VerificationSuccessful from "./pages/VerificationSuccessful";
import VerificationNothing from "./pages/VerificationNothing";
import UpdateProfile from "./pages/UpdateProfile";

axios.defaults.withCredentials = true;

function App() {
    const [notification, setNotification] = useState(null);
    const [anecdotes, setAnecdotes] = useState([]);
    const [user, setUser] = useState(null);
    const [userToken, setUserToken] = useState("");

    useEffect(() => {
        const getUserOauth = async () => {
            // console.log("USEEFFECT OAUTH");
            try {
                // const url = `${import.meta.env.VITE_SERVER_URL}/auth/login/success`;
                const { data } = await axios.get("/auth/login/success", { withCredentials: true });
                console.log(data);
                setUser(data);
                setNotification({ message: "Login successful!", type: "success" });
            } catch (err) {
                // if there is no user found, or if there is duplicate record with another provider it will catch error
                // console.log(err);

                if (err.response.data.message) {
                    // if (err.response.data.message && Array.isArray(err.response.data.message) && err.response.data.message.length > 0) {
                    setNotification({ message: err.response.data.message[0], type: "error" });
                    setTimeout(() => {
                        setNotification(null);
                    }, 7000);
                } else {
                    setNotification({ message: "Hello! Login to gain complete access", type: "info" });
                }
            }
        };

        const getUserLocal = async () => {
            // console.log("USEEFFECT LOCAL");

            if (loggedUserToken) {
                try {
                    const headerConfig = {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${loggedUserToken}`,
                        },
                    };

                    // const response = await axios.get(url, {
                    //     headers: {
                    //         Authorization: `Bearer ${token}`,
                    //         "Content-Type": "application/json", // Set the Content-Type header if needed
                    //     },
                    // });
                    // console.log("Response:", response.data);

                    // console.log(headerConfig);
                    const data = await loginService.loginSuccess(headerConfig);

                    setUser(data.user);
                    setNotification({ message: "Login successful!", type: "success" });
                    setTimeout(() => {
                        setNotification(null);
                    }, 10000);
                } catch (error) {
                    setNotification({ message: "Login to gain complete access", type: "info" });
                    setTimeout(() => {
                        setNotification(null);
                    }, 10000);
                    // next(error);
                }
            }
        };

        const loggedUserToken = window.localStorage.getItem("loggedUserToken");

        if (loggedUserToken) {
            getUserLocal();
        } else {
            getUserOauth();
        }
    }, []);

    useEffect(() => {
        const getAnecdotes = async () => {
            try {
                const anecdotes = await anecdoteService.getAll();
                setAnecdotes(anecdotes);
            } catch (error) {
                console.error("Error fetching anecdotes:", error);
            }
        };
        getAnecdotes();
    }, []);

    const anecdoteById = (id) => anecdotes.find((a) => a.id === id);

    const vote = (id) => {
        const anecdote = anecdoteById(id);

        const voted = {
            ...anecdote,
            votes: anecdote.votes + 1,
        };

        setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)));
    };

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<RootLayout notification={notification} setNotification={setNotification} user={user} />}>
                <Route path="login" element={<Login setNotification={setNotification} setUserToken={setUserToken} />}></Route>
                <Route index element={<AnecdoteList anecdotes={anecdotes} />} />
                <Route path="anecdotes" element={<AnecdoteList anecdotes={anecdotes} />} />
                <Route path="anecdotes/:id" element={<AnecdoteDetails anecdotes={anecdotes} />} />
                <Route path="create" element={<CreateNew setNotification={setNotification} anecdotes={anecdotes} setAnecdotes={setAnecdotes} />} />
                <Route path="about" element={<About />}></Route>
                <Route path="signup" element={<SignupForm setNotification={setNotification} />}></Route>
                <Route path="verification-successful" element={<VerificationSuccessful />}></Route>
                <Route path="verification-nothing" element={<VerificationNothing />}></Route>
                <Route path="update-profile" element={<UpdateProfile user={user} setUser={setUser} setNotification={setNotification} />}></Route>
                <Route path="*" element={<NotFound />} />
            </Route>
        )
    );

    return <RouterProvider router={router} />;
}

export default App;
