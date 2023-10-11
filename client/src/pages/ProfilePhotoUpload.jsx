import { useState } from "react";
import noProfilePhoto from "../icons/noprofile.jpg";
import EditPen from "../icons/editPen.svg?react";
import axios from "axios";
import FormData from "form-data";

const ProfilePhotoUpload = ({ setNotification }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    // async function uploadImage() {
    //     const form = new FormData();
    //     const url = "http://localhost:3001/api/profile";

    //     form.append("image", blob, "image.jpg");

    //     const headers = { "Content-Type": "multipart/form-data" };

    //     try {
    //         const response = await axios.post(url, form, { headers: headers });
    //         console.log(response.data);
    //     } catch (error) {
    //         console.error("Failure", error);
    //     }
    // }

    const handleImageUpload = async (event) => {
        // Display uploaded image to the DOM
        const files = event.target.files;
        if (files.length === 0) {
            // User canceled the file selection, do nothing or show a message
            console.log("File upload canceled.");
            return;
        }
        const file = files[0];
        try {
            setSelectedImage(URL.createObjectURL(file));
        } catch (error) {
            console.error("Error creating object URL:", error);
        }

        // Confirm uploading of image to storage and database
        const text = "Are you sure you want to set this photo as your current avatar?";

        if (confirm(text) === true) {
            const form = new FormData();
            try {
                form.append("image", file, "image.jpg");
                // Save the new profile photo to the file storage
                const response = await axios.post("/api/profile", form, { headers: { "Content-Type": "multipart/form-data" } });
                //TODO Delete the old profile photo from the file storage
                console.log(response.data);
                setNotification({ message: "Your profile picture has been updated", type: "success" });
                setTimeout(() => {
                    setNotification(null);
                }, 5000);
            } catch (error) {
                console.error("Failure", error);
            }
        } else {
            return;
        }
    };

    const handleImageRemove = () => {
        const text = "Are you sure you want to reset your current avatar?";
        if (confirm(text) === true) {
            setSelectedImage(null);
            try {
                //TODO Delete the old profile photo from the file storage
                setNotification({ message: "Your profile picture has been removed", type: "success" });
                setTimeout(() => {
                    setNotification(null);
                }, 5000);
            } catch (error) {
                console.error("Failure", error);
            }
        } else {
            return;
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
                            {/* <button type="button" className="absolute -bottom-20 hover:bg-cyan-400 w-20 h-10 select-none border border-white whitespace-nowrap text-sm cursor-pointer text-left px-4 py-2 hover-bg-cyan-400 hover-text-slate-700" onClick={uploadImage}>
                                Submit
                            </button> */}
                        </form>

                        {selectedImage && (
                            <label htmlFor="remove_photo" className="select-none whitespace-nowrap text-sm cursor-pointer w-full text-left px-4 py-2 hover:bg-cyan-400 hover:text-slate-700" onClick={handleImageRemove} tabIndex="0">
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
