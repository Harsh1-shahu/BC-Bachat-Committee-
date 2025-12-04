import { useState } from "react";
import Navbar from "../../Navigation/Navbar";
import Footer from "../../Navigation/Footer";
import { FaUserCircle } from "react-icons/fa";
import { BiSearchAlt2 } from "react-icons/bi"; 

const CommandoIncome = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [search, setSearch] = useState("");

    // STATIC COMMANDO INCOME REPORT
    const commandoData = [
        {
            id: "CMD001",
            member: "Rahul Sharma",
            incomeType: "Daily Income",
            amount: "₹500",
            date: "10-12-2025",
            remark: "Completed Task",
        },
        {
            id: "CMD002",
            member: "Amit Patel",
            incomeType: "Weekly Bonus",
            amount: "₹2,000",
            date: "08-12-2025",
            remark: "Reward Bonus",
        },
        {
            id: "CMD003",
            member: "Priya Verma",
            incomeType: "Daily Income",
            amount: "₹450",
            date: "11-12-2025",
            remark: "Task Performance",
        },
    ];

    const openModal = (item) => {
        setSelectedRecord(item);
        setShowModal(true);
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <h1 className="text-center pt-20 text-xl font-bold">
                Commando Income Report
            </h1>

            {/* Search Section */}
            <div className="px-4">
                <div className="bg-white mb-3 mt-3 rounded-xl shadow-md border-l-4 border-r-4 border-gray-400 p-1 relative flex items-center">

                    {/* Search Icon */}
                    <div className="absolute right-1 bg-gray-300 p-2.5 rounded-r-lg text-gray-900 text-lg">
                        <BiSearchAlt2 />
                    </div>

                    {/* Input */}
                    <input
                        type="text"
                        placeholder="Search by Name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-3 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 
                 focus:ring-gray-400 focus:outline-none text-sm"
                    />
                </div>
            </div>

            {/* REPORT LIST */}
            <div className="max-w-lg mx-auto mt-6 px-4 pb-10">
                {commandoData.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => openModal(item)}
                        className="bg-white p-4 mb-3 rounded-xl shadow-md border-l-4 border-r-4 border-gray-500 
                       flex items-center justify-between cursor-pointer hover:shadow-lg transition"
                    >
                        {/* Left Section */}
                        <div className="flex items-center gap-3">
                            {/* Circle Initial */}
                            <div className="h-12 w-12 bg-gray-600 text-white flex items-center justify-center 
                              rounded-full text-lg font-bold">
                                {item.member.charAt(0)}
                            </div>

                            {/* Details */}
                            <div>
                                <h2 className="font-semibold text-lg">{item.member}</h2>
                                <p className="text-gray-600 text-sm">
                                    {item.incomeType} • {item.amount} • {item.date}
                                </p>
                            </div>
                        </div>

                        {/* Right Icon */}
                        <FaUserCircle className="text-gray-600 text-3xl" />
                    </div>
                ))}
            </div>

            {/* POPUP MODAL */}
            {showModal && selectedRecord && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-5 relative">
                        <button
                            className="absolute top-3 right-4 text-3xl font-bold text-gray-700"
                            onClick={() => setShowModal(false)}
                        >
                            ×
                        </button>

                        <h2 className="text-lg font-bold text-center mb-4">
                            Commando Income Details
                        </h2>

                        <div className="bg-white shadow-md border p-4 rounded-lg grid gap-2 text-sm">
                            <p><strong>Income ID:</strong> {selectedRecord.id}</p>
                            <p><strong>Member:</strong> {selectedRecord.member}</p>
                            <p><strong>Income Type:</strong> {selectedRecord.incomeType}</p>
                            <p><strong>Amount:</strong> {selectedRecord.amount}</p>
                            <p><strong>Date:</strong> {selectedRecord.date}</p>
                            <p><strong>Remark:</strong> {selectedRecord.remark}</p>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default CommandoIncome;
