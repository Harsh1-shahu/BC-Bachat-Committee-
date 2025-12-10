import { useEffect, useState } from "react";
import Navbar from "../Navigation/Navbar";
import Footer from "../Navigation/Footer";
import { BiSearchAlt2 } from "react-icons/bi";
import { useProject2 } from "../../../Context/ProjectContext2";
import { useProject } from "../../../Context/ProjectContext";

const TransactionReport = () => {
  const { getReports, reportsPerPage } = useProject2();
  const { user } = useProject();

  const [showModal, setShowModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [showModal]);


  // LOAD WALLET TRANSACTIONS
  useEffect(() => {
    if (!user?.MEMB_CODE) return; // WAIT FOR USER

    const loadWalletReport = async () => {
      setLoading(true);

      const response = await getReports("walletTransaction", 0);

      let parsed = [];

      try {
        if (typeof response.Data === "string") {
          let cleaned = response.Data.trim();
          cleaned = cleaned.replace(/\\/g, "");

          if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
            cleaned = cleaned.slice(1, -1);
          }

          if (cleaned.startsWith("[") || cleaned.startsWith("{")) {
            parsed = JSON.parse(cleaned);
          }
        }
      } catch (err) {
        console.log("JSON Parse Error:", err);
      }

      if (Array.isArray(parsed)) {
        const formatted = parsed.map((item) => ({
          id: item.SRNO,
          amount: item.AMT,
          balance: item.BALANCE,
          date: item.TDATE,
          debit: item.DR,
          credit: item.CR,
          remark: item.REMARK,
        }))
          .reverse();
        setTransactions(formatted);
      }

      setLoading(false);
    };

    loadWalletReport();
  }, [user]);


  // SEARCH FILTER
  const filteredData = transactions.filter((tx) =>
    tx.date?.toLowerCase().includes(search.toLowerCase()) ||
    tx.amount?.toString().toLowerCase().includes(search.toLowerCase())
  );

  // PAGINATION LOGIC
  const indexOfLast = currentPage * reportsPerPage;
  const indexOfFirst = indexOfLast - reportsPerPage;
  const currentReports = filteredData.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredData.length / reportsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <h1 className="pt-20 text-center text-xl font-bold">Wallet Transaction Report</h1>

      {/* Search Box */}
      <div className="px-3">
        <div className="bg-white mb-3 mt-3 rounded-xl shadow-md border-l-4 border-r-4 border-gray-400 p-1 relative flex items-center">

          <div className="absolute right-1 bg-gray-300 p-2.5 rounded-r-lg text-gray-900 text-lg">
            <BiSearchAlt2 />
          </div>

          <input
            type="text"
            placeholder="Search by Date or Amount"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset page on search
            }}
            className="w-full pl-3 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 
                 focus:ring-gray-400 focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="max-w-lg mx-auto mt-5 px-3 pb-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-10">
            <div className="w-6 h-6 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
            <p className="text-center text-gray-500 mt-3">Loading Transaction List...</p>
          </div>
        ) : currentReports.length === 0 ? (
          <p className="text-center text-gray-600 mt-5">No results found</p>
        ) : (
          currentReports.map((tx, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedTx({ ...tx, index: indexOfFirst + index + 1 });
                setShowModal(true);
              }}
              className={`bg-white p-2 mb-3 rounded-xl shadow-md border-l-4 border-r-4 
                      ${tx.debit > 0 ? "border-red-500" : tx.credit > 0 ? "border-green-500" : "border-gray-500"} 
                       flex items-center justify-between cursor-pointer hover:shadow-lg transition`}
            >
              {/* LEFT — INDEX + DATE + REMARK */}
              <div className="flex items-start gap-3 col-span-2">
                <div className="h-10 w-10 bg-gray-600 text-white flex items-center justify-center 
                  rounded-full text-lg font-bold">
                  {indexOfFirst + index + 1}
                </div>

                <div>
                  <div className="flex gap-5 md:gap-12">
                    <h2 className="font-semibold text-sm md:text-lg">{tx.date}</h2>
                    <p className="text-gray-800 text-sm md:text-base font-semibold">
                      Amount= {tx.amount}
                    </p>
                  </div>
                  <p className="text-xs md:text-sm text-gray-900 break-all whitespace-normal leading-tight pr-4 mt-1 md:px-0">
                    (Remark: {tx.remark})
                  </p>
                </div>
              </div>

              {/* RIGHT — DR / CR */}
              <div className="flex flex-col items-end whitespace-nowrap gap-2">
                <p className="text-xs md:text-sm text-gray-900">DR: ₹{tx.debit}</p>
                <p className="text-xs md:text-sm text-gray-900">CR: ₹{tx.credit}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SMART PAGINATION */}
      {filteredData.length > reportsPerPage && (
        <div className="max-w-lg mx-auto px-3 mt-3 mb-4">
          <div className="flex items-center justify-center gap-1 flex-wrap">

            {/* Prev */}
            <button
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              className={`px-3 py-1 rounded-md border text-sm 
          ${currentPage === 1 ? "bg-gray-200 text-gray-400" : "bg-white text-black"}
        `}
            >
              Prev
            </button>

            {/* Page Numbers */}
            {(() => {
              let pages = [];

              const maxButtons = 5; // Only show 5 numbers

              let start = Math.max(1, currentPage - 2);
              let end = Math.min(totalPages, currentPage + 2);

              if (start > 1) {
                pages.push(
                  <button
                    key={1}
                    onClick={() => goToPage(1)}
                    className="px-3 py-1 rounded-md border bg-white text-black text-sm"
                  >
                    1
                  </button>
                );
                if (start > 2) pages.push(<span key="dots1">...</span>);
              }

              for (let i = start; i <= end; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`px-3 py-1 rounded-md border text-sm ${currentPage === i
                      ? "bg-gray-700 text-white"
                      : "bg-white text-black"
                      }`}
                  >
                    {i}
                  </button>
                );
              }

              if (end < totalPages) {
                if (end < totalPages - 1) pages.push(<span key="dots2">...</span>);
                pages.push(
                  <button
                    key={totalPages}
                    onClick={() => goToPage(totalPages)}
                    className="px-3 py-1 rounded-md border bg-white text-black text-sm"
                  >
                    {totalPages}
                  </button>
                );
              }

              return pages;
            })()}

            {/* Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
              className={`px-3 py-1 rounded-md border text-sm 
          ${currentPage === totalPages ? "bg-gray-200 text-gray-400" : "bg-white text-black"}
        `}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Popup Modal */}
      {selectedTx && showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-5 relative">
            <button
              className="absolute top-3 right-4 text-3xl font-bold text-gray-700"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>

            <h2 className="text-lg font-bold text-center mb-4">
              Transaction Details
            </h2>

            <div className="bg-white p-4 rounded-lg shadow-md border grid gap-3 text-sm">
              <div className="absolute top-18 right-8 h-8 w-8 bg-gray-600 text-white flex items-center justify-center 
                  rounded-full text-lg font-bold">{selectedTx.index}
              </div>
              <p><strong>Date:</strong> {selectedTx.date}</p>
              <p><strong>Amount:</strong> ₹{selectedTx.amount}</p>

              <p><strong>Debit:</strong> <span className="text-red-600">₹{selectedTx.debit}</span></p>
              <p><strong>Credit:</strong> <span className="text-green-600">₹{selectedTx.credit}</span></p>
              <p><strong>Balance:</strong> ₹{selectedTx.balance}</p>

              <p><strong>Remark:</strong> {selectedTx.remark}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TransactionReport;
