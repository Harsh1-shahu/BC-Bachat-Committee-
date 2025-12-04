import { useState } from "react";
import Navbar from "../../Navigation/Navbar";
import Footer from "../../Navigation/Footer";
import { FaUserCircle } from "react-icons/fa";
import { BiSearchAlt2 } from "react-icons/bi";

const CutOffReport = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [search, setSearch] = useState("");

  // STATIC CUT-OFF REPORT DATA
  const cutoffData = [
    {
      id: "CUT001",
      member: "Rahul Sharma",
      amount: "₹1,200",
      date: "10-12-2025",
      remark: "Cut-off Applied",
    },
    {
      id: "CUT002",
      member: "Amit Patel",
      amount: "₹850",
      date: "08-12-2025",
      remark: "Weekly Cut-off",
    },
    {
      id: "CUT003",
      member: "Priya Verma",
      amount: "₹950",
      date: "09-12-2025",
      remark: "Performance Cut-off",
    },
  ];

  // FILTER BASED ON SEARCH
  const filteredData = cutoffData.filter((item) =>
    item.member.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (item) => {
    setSelectedRecord(item);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <h1 className="text-center pt-20 text-xl font-bold">Cut-off Income Report</h1>

      {/* Search Section */}
      <div className="px-4">
        <div className="bg-white mb-3 mt-3 rounded-xl shadow-md border-l-4 border-r-4 border-gray-400 p-1 relative flex items-center">

          {/* Search Icon */}
          <div className="absolute right-1 bg-gray-300 p-2.5 rounded-r-lg text-gray-900 text-lg">
            <BiSearchAlt2 />
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-3 pr-3 py-2 rounded-lg border border-gray-300 
                       focus:ring-2 focus:ring-gray-400 focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* REPORT LIST */}
      <div className="max-w-lg mx-auto mt-6 px-4 pb-10">
        {filteredData.length === 0 ? (
          <p className="text-center text-gray-600">No records found</p>
        ) : (
          filteredData.map((item, index) => (
            <div
              key={index}
              onClick={() => openModal(item)}
              className="bg-white p-4 mb-3 rounded-xl shadow-md border-l-4 border-r-4 border-gray-500 
                         flex items-center justify-between cursor-pointer hover:shadow-lg transition"
            >
              {/* Left Side */}
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-gray-600 text-white flex items-center justify-center 
                                rounded-full text-lg font-bold">
                  {item.member.charAt(0)}
                </div>

                <div>
                  <h2 className="font-semibold text-lg">{item.member}</h2>
                  <p className="text-gray-600 text-sm">
                    {item.amount} • {item.date}
                  </p>
                </div>
              </div>

              {/* Right Icon */}
              <FaUserCircle className="text-gray-600 text-3xl" />
            </div>
          ))
        )}
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
              Cut-off Income Details
            </h2>

            <div className="bg-white shadow-md border p-4 rounded-lg grid gap-2 text-sm">
              <p><strong>Cut-off ID:</strong> {selectedRecord.id}</p>
              <p><strong>Member:</strong> {selectedRecord.member}</p>
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

export default CutOffReport;
