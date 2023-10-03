import React from "react";
import { Link } from "react-router-dom";

const VerificationSuccessful = () => {
    return (
        <>
            <div>Verification successful!</div>
            <Link className="underline hover:text-cyan-400" to="/login">
                Click here to login
            </Link>
        </>
    );
};

export default VerificationSuccessful;
