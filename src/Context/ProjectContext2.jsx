import { createContext, useContext, useState } from "react";
import { useProject } from "./ProjectContext";

const ProjectContext2 = createContext();
export const useProject2 = () => useContext(ProjectContext2);

export const ProjectProvider = ({ children }) => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const apiKey = import.meta.env.VITE_API_KEY;

    const { user } = useProject(); // Get logged-in user details

    const reportsPerPage = 6;

    // Bhisi amount multiplier state
    const [bhisiMultiplier, setBhisiMultiplier] = useState(15); // Default multiplier is 15

    // confirm check state status
    const [confirmData, setConfirmData] = useState(null);

    const confirmAction = (message) => {
        return new Promise((resolve) => {
            setConfirmData({
                message,
                resolve
            });
        });
    };

    // ---------------------------------------------
    // CONFIRMATION POPUP UI
    // ---------------------------------------------
    const ConfirmationPopup = () => {
        if (!confirmData) return null;

        return (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                <div className="bg-white p-5 rounded-lg w-80 shadow-lg text-center">
                    <h3 className="text-lg font-semibold mb-3">Are you sure?</h3>
                    <p className="text-gray-700 mb-5">{confirmData.message}</p>

                    <div className="flex justify-between">
                        <button
                            onClick={() => {
                                confirmData.resolve(false);
                                setConfirmData(null);
                            }}
                            className="bg-gray-300 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => {
                                confirmData.resolve(true);
                                setConfirmData(null);
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Yes, Continue
                        </button>
                    </div>
                </div>
            </div>
        );
    };


    // ----------------------------------------------------
    //   RENEW BHISI API
    // ----------------------------------------------------
    const renewBhisi = async (bhisino, username) => {
        try {
            const formData = new FormData();
            formData.append("mcode", user?.MEMB_CODE);
            formData.append("bhisino", bhisino);
            formData.append("username", username);
            formData.append("apiKey", apiKey);

            // // 🔥 LOG FORM DATA
            // console.log("Renew Bhisi — FormData values:");
            // for (let pair of formData.entries()) {
            //     console.log(pair[0] + ": " + pair[1]);
            // }

            const response = await fetch(`${apiUrl}/Statistic/renewBhisi`, {
                method: "POST",
                body: formData,
            });

            return await response.json();

        } catch (error) {
            return {
                ResponseStatus: "error",
                ResponseMessage: error.message,
            };
        }
    };

    // ----------------------------------------------------
    // WALLET TRANSFER / WITHDRAW API
    // ----------------------------------------------------
    const walletTransfer = async (amount, targetUsername, type = "Transfer") => {
        try {
            const formData = new FormData();
            formData.append("mcode", user?.MEMB_CODE);     // logged-in user mcode
            formData.append("amount", amount);
            formData.append("username", targetUsername);   // transfer to this username
            formData.append("apiKey", apiKey);
            formData.append("type", type);                 // Transfer / Withdrawal

            console.log("Wallet Transfer Sending →", {
                mcode: user?.MEMB_CODE,
                amount,
                username: targetUsername,
                type
            });

            const response = await fetch(`${apiUrl}/Statistic/withdrawalOrTransfer`, {
                method: "POST",
                body: formData,
            });

            return await response.json();

        } catch (error) {
            return {
                ResponseStatus: "error",
                ResponseMessage: error.message,
            };
        }
    };


    // ----------------------------------------------------
    //   BID FOR BHISI API
    // ----------------------------------------------------
    const bidForBhisi = async (bhisino, amount) => {
        try {
            const formData = new FormData();
            formData.append("mcode", user?.MEMB_CODE);  // Logged in user
            formData.append("bhisino", bhisino);
            formData.append("amount", amount);
            formData.append("apiKey", apiKey);

            console.log("Bid API Sending →", {
                mcode: user?.MEMB_CODE,
                bhisino,
                amount
            });

            const response = await fetch(`${apiUrl}/Statistic/bidForBhisi`, {
                method: "POST",
                body: formData,
            });

            return await response.json();
        } catch (error) {
            return { ResponseStatus: "error", ResponseMessage: error.message };
        }
    };

    // ----------------------------------------------------
    //   GET REPORTS API
    // ----------------------------------------------------
    const getReports = async (type, value) => {
        try {
            const formData = new FormData();
            formData.append("mcode", user?.MEMB_CODE); // logged-in user's mcode
            formData.append("type", type);             // BidDetails / walletTransaction / withdrawalOrTransfer
            formData.append("value", value);           // BhisiNo OR other relevant ID
            formData.append("apiKey", apiKey);

            console.log("Reports API Sending →", {
                mcode: user?.MEMB_CODE,
                type,
                value
            });

            const response = await fetch(`${apiUrl}/Statistic/reports`, {
                method: "POST",
                body: formData,
            });

            return await response.json();


        } catch (error) {
            return {
                ResponseStatus: "error",
                ResponseMessage: error.message,
            };
        }
    };

    // ----------------------------------------------------
    //   GET Bid Amount API
    // ----------------------------------------------------
    const getBidAmount = async (bhisino) => {
        try {
            const formData = new FormData();
            formData.append("bhisino", bhisino);
            formData.append("apiKey", apiKey);

            const response = await fetch(`${apiUrl}/Statistic/bidAmount`, {
                method: "POST",
                body: formData,
            });

            return await response.json();
        } catch (error) {
            return { ResponseStatus: "error", ResponseMessage: error.message };
        }
    };

    return (
        <ProjectContext2.Provider value={{
            renewBhisi, walletTransfer, bidForBhisi, getReports, reportsPerPage, bhisiMultiplier,
            setBhisiMultiplier, getBidAmount, confirmAction
        }}>
            {children}
            {/* 🔥 RENDER CONFIRM POPUP HERE (IMPORTANT) */}
            <ConfirmationPopup />
        </ProjectContext2.Provider>
    );
};
