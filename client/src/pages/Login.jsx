import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
    const googleAuth = () => {
        window.open(`http://localhost:3001/auth/google`, "_self");
    };

    return (
        <section className="max-w-[400px] mx-auto p-6 text-black bg-white border border-gray-300 rounded-lg">
            <h1 className="mb-2">Login</h1>
            <hr />
            <button className="flex justify-center items-center w-full text-center bg-white text-gray-600 text-lg font-semibold h-14 border border-gray-600 rounded-lg mb-4 hover:shadow-xl hover:scale-105" onClick={googleAuth}>
                <div className="flex justify-center items-center mr-2 w-10 h-10 min-w-10 min-h-10">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 256 256">
                        <g transform="translate(25.6,25.6) scale(0.8,0.8)">
                            <g fill="none" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none">
                                <g transform="scale(5.33333,5.33333)">
                                    <path d="M43.611,20.083h-1.611v-0.083h-18v8h11.303c-1.649,4.657 -6.08,8 -11.303,8c-6.627,0 -12,-5.373 -12,-12c0,-6.627 5.373,-12 12,-12c3.059,0 5.842,1.154 7.961,3.039l5.657,-5.657c-3.572,-3.329 -8.35,-5.382 -13.618,-5.382c-11.045,0 -20,8.955 -20,20c0,11.045 8.955,20 20,20c11.045,0 20,-8.955 20,-20c0,-1.341 -0.138,-2.65 -0.389,-3.917z" fill="#fbc02d"></path>
                                    <path d="M6.306,14.691l6.571,4.819c1.778,-4.402 6.084,-7.51 11.123,-7.51c3.059,0 5.842,1.154 7.961,3.039l5.657,-5.657c-3.572,-3.329 -8.35,-5.382 -13.618,-5.382c-7.682,0 -14.344,4.337 -17.694,10.691z" fill="#e53935"></path>
                                    <path d="M24,44c5.166,0 9.86,-1.977 13.409,-5.192l-6.19,-5.238c-2.008,1.521 -4.504,2.43 -7.219,2.43c-5.202,0 -9.619,-3.317 -11.283,-7.946l-6.522,5.025c3.31,6.477 10.032,10.921 17.805,10.921z" fill="#4caf50"></path>
                                    <path d="M43.611,20.083l-0.016,-0.083h-1.595h-18v8h11.303c-0.792,2.237 -2.231,4.166 -4.087,5.571c0.001,-0.001 0.002,-0.001 0.003,-0.002l6.19,5.238c-0.438,0.398 6.591,-4.807 6.591,-14.807c0,-1.341 -0.138,-2.65 -0.389,-3.917z" fill="#1565c0"></path>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
                <span>Google</span>
            </button>
            {/* <a className="flex justify-center items-center w-full text-center bg-white text-gray-600 text-lg font-semibold h-14 border border-gray-600 rounded-lg mb-4 hover:shadow-xl hover:scale-105" href="/login/federated/facebook"> */}
            <a className="flex justify-center items-center w-full text-center bg-white text-gray-600 text-lg font-semibold h-14 border border-gray-600 rounded-lg mb-4 hover:shadow-xl hover:scale-105" href={"/auth/facebook"}>
                <div className="flex justify-center items-center mr-2 w-10 h-10 min-w-10 min-h-10">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 256 256">
                        <defs>
                            <linearGradient x1="9.993" y1="9.993" x2="40.615" y2="40.615" gradientUnits="userSpaceOnUse" id="color-1_uLWV5A9vXIPu_gr1">
                                <stop offset="0" stopColor="#2aa4f4"></stop>
                                <stop offset="1" stopColor="#007ad9"></stop>
                            </linearGradient>
                        </defs>
                        <g transform="translate(25.6,25.6) scale(0.8,0.8)">
                            <g fill="none" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none">
                                <g transform="scale(5.33333,5.33333)">
                                    <path d="M24,4c-11.046,0 -20,8.954 -20,20c0,11.046 8.954,20 20,20c11.046,0 20,-8.954 20,-20c0,-11.046 -8.954,-20 -20,-20z" fill="url(#color-1_uLWV5A9vXIPu_gr1)"></path>
                                    <path d="M26.707,29.301h5.176l0.813,-5.258h-5.989v-2.874c0,-2.184 0.714,-4.121 2.757,-4.121h3.283v-4.588c-0.577,-0.078 -1.797,-0.248 -4.102,-0.248c-4.814,0 -7.636,2.542 -7.636,8.334v3.498h-4.949v5.258h4.948v14.452c0.98,0.146 1.973,0.246 2.992,0.246c0.921,0 1.82,-0.084 2.707,-0.204z" fill="#ffffff"></path>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
                <span>Facebook</span>
            </a>
            <hr />
            <p className="mt-4">
                Don't have an account?{" "}
                <a className="underline hover:text-cyan-400" href="/signup">
                    Sign up
                </a>
            </p>
        </section>
    );
}
