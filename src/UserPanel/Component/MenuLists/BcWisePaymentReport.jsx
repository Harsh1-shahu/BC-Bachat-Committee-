import { useState, useEffect } from "react";
import Navbar from "../Navigation/Navbar";
import Footer from "../Navigation/Footer";
import { FaUserCircle } from "react-icons/fa";
import { BiSearchAlt2 } from "react-icons/bi";

const BcWisePaymentReport = () => {
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");

    const staticReport = [
        {
            bcId: "BC001",
            member: "Rahul Sharma",
            installment: "1 / 10",
            amount: "₹2,000",
            date: "10-11-2025",
            status: "Paid",
        },
        {
            bcId: "BC001",
            member: "Amit Patel",
            installment: "2 / 10",
            amount: "₹2,000",
            date: "10-12-2025",
            status: "Pending",
        },
        {
            bcId: "BC002",
            member: "Priya Verma",
            installment: "1 / 12",
            amount: "₹1,500",
            date: "05-11-2025",
            status: "Paid",
        },
        {
            bcId: "BC002",
            member: "Riya Roy",
            installment: "2 / 12",
            amount: "₹1,500",
            date: "05-12-2025",
            status: "Paid",
        },
    ];

    const openModal = (item) => {
        setSelectedRecord(item);
        setShowModal(true);
    };

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => (document.body.style.overflow = "auto");
    }, [showModal]);


    // Filter by search
    const filteredData = staticReport.filter((item) =>
        item.member.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <div className="min-h-screen">
            <Navbar />
            <h1 className="text-center pt-20 text-lg font-bold">
                BC Wise Payment Report
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


            {/* CARD LIST */}
            <div className="max-w-lg mx-auto mt-5 px-4 pb-10">
                {filteredData.map((item, index) => (
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
                                    {item.amount} • {item.date} • {item.status}
                                </p>
                            </div>
                        </div>

                        {/* Right Side Icon */}
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
                            BC Payment Details
                        </h2>

                        <div className="bg-white p-4 rounded-lg shadow-md border grid gap-3 text-sm">
                            <p><strong>BC ID:</strong> {selectedRecord.bcId}</p>
                            <p><strong>Member:</strong> {selectedRecord.member}</p>
                            <p><strong>Installment:</strong> {selectedRecord.installment}</p>
                            <p><strong>Amount:</strong> {selectedRecord.amount}</p>
                            <p><strong>Date:</strong> {selectedRecord.date}</p>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span
                                    className={`font-bold ${selectedRecord.status === "Paid"
                                        ? "text-green-600"
                                        : "text-red-600"
                                        }`}
                                >
                                    {selectedRecord.status}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default BcWisePaymentReport;
