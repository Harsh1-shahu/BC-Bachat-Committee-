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

    return (
        <ProjectContext2.Provider value={{
            renewBhisi, walletTransfer, bidForBhisi, getReports, reportsPerPage, bhisiMultiplier,
            setBhisiMultiplier
        }}>
            {children}
        </ProjectContext2.Provider>
    );
};
