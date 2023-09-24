import { useState, useEffect } from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import NotFound from "./pages/NotFound";
import RootLayout from "./pages/RootLayout";
import AnecdoteList from "./pages/AnecdoteList";
import AnecdoteDetails from "./pages/AnecdoteDetails";
import CreateNew from "./pages/CreateNew";
import Login from "./pages/Login";
import anecdoteService from "./services/anecdotes";
import axios from "axios";
axios.defaults.withCredentials = true;

const About = () => (
    <div>
        <h2 className="text-4xl mb-8 text-white">About anecdote app</h2>
        <p>According to Wikipedia:</p>

        <em>An anecdote is a brief, revealing account of an individual person or an incident. Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself, such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative. An anecdote is "a story with a point."</em>

        <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
    </div>
);

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
                console.log(data.user);
                setUser(data.user);
            } catch (err) {
                console.log(err);
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
