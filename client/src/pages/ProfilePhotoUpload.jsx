import { useState } from "react";
import noProfilePhoto from "../icons/noprofile.jpg";
import EditPen from "../icons/editPen.svg?react";
import axios from "axios";
import FormData from "form-data";

const ProfilePhotoUpload = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [xfile, setxFile] = useState(null);
    const [blob, setBlob] = useState(null);

    async function uploadImage() {
        const form = new FormData();
        const url = "http://localhost:3001/api/profile";

        // Append the selected image to the FormData object
        form.append("image", blob, "exampl.jpg");

        const headers = { "Content-Type": "multipart/form-data" };

        try {
            const response = await axios.post(url, form, { headers: headers });
            console.log(response.data);
        } catch (error) {
            console.error("Failure", error);
        }
    }

    const handleImageUpload = (event) => {
        const files = event.target.files;

        if (files.length === 0) {
            // User canceled the file selection, do nothing or show a message
            console.log("File upload canceled.");
            return;
        }

        const file = files[0];
        setBlob(file);
        // Display uploaded image to the DOM
        try {
            setSelectedImage(URL.createObjectURL(file));
        } catch (error) {
            // Handle any errors that occur during object URL creation
            console.error("Error creating object URL:", error);
        }
    };

    return (
        <>
            <details className="relative">
                <summary className="list-none" aria-haspopup="menu" role="button">
                    <img className="rounded-full overflow-hidden inline-block border-none w-52 h-52 object-cover" src={selectedImage ? selectedImage : noProfilePhoto} alt="@iamwesofph" />

                    <div className="relative w-16 left-0 bottom-10 bg-gray-800 rounded-md fill-current text-sm px-2 py-1 mb-2 border border-gray-500">
                        <div className="flex justify-around items-center">
                            <EditPen />
                            <span className="select-none">Edit</span>
                        </div>
                    </div>
                </summary>

                <div className="rounded-md absolute bottom-36 translate-y-full" role="menu">
                    <div className="rounded-md flex flex-col items-start border border-gray-500 bg-gray-800 overflow-hidden">
                        <form encType="multipart/form-data" className="flex">
                            <label htmlFor="upload_photo" className="select-none whitespace-nowrap text-sm cursor-pointer w-full text-left px-4 py-2 hover:bg-cyan-400 hover:text-slate-700" tabIndex="1">
                                Upload a photo…
                                <input name="image" className="hidden" type="file" id="upload_photo" accept="image/*" onChange={handleImageUpload} />
                            </label>
                            <button type="button" className="absolute -bottom-20 hover:bg-cyan-400 w-20 h-10 select-none border border-white whitespace-nowrap text-sm cursor-pointer text-left px-4 py-2 hover-bg-cyan-400 hover-text-slate-700" onClick={uploadImage}>
                                Submit
                            </button>
                        </form>

                        {selectedImage && (
                            <label htmlFor="remove_photo" className="select-none whitespace-nowrap text-sm cursor-pointer w-full text-left px-4 py-2 hover:bg-cyan-400 hover:text-slate-700" onClick={() => setSelectedImage(null)} tabIndex="0">
                                Remove photo
                            </label>
                        )}
                    </div>
                </div>
            </details>
        </>
    );
};

export default ProfilePhotoUpload;
