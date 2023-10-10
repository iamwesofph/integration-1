import { useState } from "react";
import noProfilePhoto from "../icons/noprofile.jpg";

const ProfilePhotoUpload = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageUpload = (event) => {
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
            // Handle any errors that occur during object URL creation
            console.error("Error creating object URL:", error);
        }
    };

    return (
        <details className="relative">
            <summary className="list-none" aria-haspopup="menu" role="button">
                <img className="rounded-full overflow-hidden inline-block border-none w-52 h-52 object-cover" src={selectedImage ? selectedImage : noProfilePhoto} alt="@iamwesofph" />

                <div className="relative w-16 left-0 bottom-10 bg-gray-800 rounded-md fill-current text-sm px-2 py-1 mb-2 border border-gray-500">
                    <div className="flex justify-around items-center">
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" className="fill-current">
                            <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z"></path>
                        </svg>
                        <span className="select-none">Edit</span>
                    </div>
                </div>
            </summary>
            <div className="rounded-md absolute bottom-36 translate-y-full" role="menu">
                <div className="rounded-md flex flex-col items-start border border-gray-500 bg-gray-800 overflow-hidden">
                    <label htmlFor="upload_photo" className="select-none whitespace-nowrap text-sm cursor-pointer w-full text-left px-4 py-2 hover:bg-cyan-400 hover:text-slate-700" tabIndex="1">
                        Upload a photo…
                        <input name="image" className="hidden" type="file" id="upload_photo" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    {selectedImage && (
                        <label htmlFor="remove_photo" className="select-none whitespace-nowrap text-sm cursor-pointer w-full text-left px-4 py-2 hover:bg-cyan-400 hover:text-slate-700" onClick={() => setSelectedImage(null)} tabIndex="0">
                            Remove photo
                        </label>
                    )}
                </div>
            </div>
        </details>
    );
};

export default ProfilePhotoUpload;
