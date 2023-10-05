import { useNavigate } from "react-router-dom";
import { useField } from "../hooks/";
import anecdoteService from "../services/anecdotes";

function CreateNew({ setNotification, anecdotes, setAnecdotes }) {
    const navigate = useNavigate();
    const content = useField("text");
    const author = useField("text");
    const info = useField("text");

    const resetAll = () => {
        content.reset();
        author.reset();
        info.reset();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newAnecdote = {
            content: content.value,
            author: author.value,
            info: info.value,
            votes: 0,
        };

        const config = {
            headers: {
                "Content-Type": "application/json", // Set Content-Type header
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MWQ0Y2ViZjNhZDU0MTMwYTE1MzU4YiIsImlhdCI6MTY5NjQzNDU2NCwiZXhwIjoxNjk2NDM4MTY0fQ.mD05RMUg18t7TbLAqnZ4RnFDConxrTHQhxW-z2mDssU`, // Set Authorization header
            },
        };

        const returnedAnecdote = await anecdoteService.create(newAnecdote, config);
        // console.log(`RETURNED ANEC: ${JSON.stringify(returnedAnecdote)}`);
        setAnecdotes(anecdotes.concat(returnedAnecdote));

        setNotification({ message: `Successfully added an anecdote: ${newAnecdote.content} by ${newAnecdote.author}!`, type: "success" });
        setTimeout(() => {
            setNotification(null);
        }, 5000);
        navigate("/");
    };

    return (
        <div>
            <h2 className="text-2xl mb-8">Create a new anecdote</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block  text-sm font-bold mb-2" htmlFor="content">
                        Content
                    </label>
                    <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" {...content} reset="" />
                </div>
                <div className="mb-4">
                    <label className="block  text-sm font-bold mb-2" htmlFor="author">
                        Author
                    </label>
                    <input className="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" {...author} reset="" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="info">
                        URL for more info
                    </label>
                    <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" {...info} reset="" />
                </div>
                <button className="bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outlin mr-2" type="submit">
                    Create
                </button>
                <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2" type="button" onClick={resetAll}>
                    Reset
                </button>
            </form>
        </div>
    );
}

export default CreateNew;
