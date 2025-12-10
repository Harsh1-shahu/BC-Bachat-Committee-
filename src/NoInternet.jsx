import React from "react";
import { RiWifiOffLine } from "react-icons/ri";

function NoInternet() {
    return (
        <div className="h-screen flex flex-col justify-center items-center text-center p-6 bg-gray-50">
            <RiWifiOffLine className="text-red-500 w-20 h-20 mb-6 opacity-80 animate-pulse" />

            <h1 className="text-3xl font-bold text-red-500 mb-2">
                You're Offline
            </h1>

            <p className="text-gray-600 text-lg">
                Check your internet connection.
            </p>
        </div>
    );
}

export default NoInternet;
