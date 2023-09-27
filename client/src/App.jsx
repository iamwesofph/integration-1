import { useState, useEffect } from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import NotFound from "./pages/NotFound";
import RootLayout from "./pages/RootLayout";
import AnecdoteList from "./pages/AnecdoteList";
import AnecdoteDetails from "./pages/AnecdoteDetails";
import CreateNew from "./pages/CreateNew";
import Login from "./pages/Login";
import anecdoteService from "./services/anecdotes";
import About from "./pages/About";
import axios from "axios";

axios.defaults.withCredentials = true;

function App() {
    const [notification, setNotification] = useState(null);
    const [anecdotes, setAnecdotes] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                // const url = `${import.meta.env.VITE_SERVER_URL}/auth/login/success`;
                const url = `/auth/login/success`;
                const { data } = await axios.get(url, { withCredentials: true });
                console.log("USEFFECT LOG");
                console.log(data.user);
                setUser(data.user);
            } catch (err) {
                console.log("USEFFECT ERROR");
                // if there is no user found, or if there is duplicate record with another provider it will catch error
                console.log(err);
                console.log(err.response.data.message[0]);
                setNotification({ message: err.response.data.message[0], type: "error" });
                setTimeout(() => {
                    setNotification(null);
                }, 5000);
            }
        };
        getUser();
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
            <Route path="/" element={<RootLayout notification={notification} user={user} />}>
                <Route path="login" element={<Login />}></Route>
                <Route index element={<AnecdoteList anecdotes={anecdotes} />} />
                <Route path="anecdotes" element={<AnecdoteList anecdotes={anecdotes} />} />
                <Route path="anecdotes/:id" element={<AnecdoteDetails anecdotes={anecdotes} />} />
                <Route path="create" element={<CreateNew setNotification={setNotification} anecdotes={anecdotes} setAnecdotes={setAnecdotes} />} />
                <Route path="about" element={<About />}></Route>
                <Route path="*" element={<NotFound />} />
            </Route>
        )
    );

    return <RouterProvider router={router} />;
}

export default App;
