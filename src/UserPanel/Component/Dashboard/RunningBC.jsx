import { useState, useEffect } from "react";
import { useProject } from "../../../Context/ProjectContext";
import { useProject2 } from "../../../Context/ProjectContext2";

const RunningBC = () => {
  const { showNotification, loading, dashboardBhisi } = useProject();
  const { reportsPerPage } = useProject2();

  const [selectedBC, setSelectedBC] = useState(null);

  // -------------------------------
  // PAGINATION
  // -------------------------------
  // Set your per-page limit
  const [currentPage, setCurrentPage] = useState(1);

  const runningBCData =
    dashboardBhisi?.running?.map((item) => {
      const rawDate = item.EXP_DATE?.split("T")[0];
      let formattedDate = "Not Provided";

      if (rawDate) {
        const [year, month, day] = rawDate.split("-");
        formattedDate = `${day}/${month}/${year}`;
      }

      return {
        srNo: item.SRNO,
        id: item.BHISINO,
        expiry: formattedDate,
        amount: `₹${item.AMOUNT}`,
        name: item.NAME,
      };
    }) || [];

  // -------------------------------
  // PAGINATION CALCULATION
  // -------------------------------
  const totalPages = Math.ceil(runningBCData.length / reportsPerPage);
  const indexOfLast = currentPage * reportsPerPage;
  const indexOfFirst = indexOfLast - reportsPerPage;
  const currentItems = runningBCData.slice(indexOfFirst, indexOfLast);

  // Reset to page 1 when fresh data loads
  useEffect(() => {
    setCurrentPage(1);
  }, [dashboardBhisi]);

  useEffect(() => {
    document.body.style.overflow = selectedBC ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [selectedBC]);

  const handleCloseModal = () => setSelectedBC(null);

  const handleConfirmPurchase = () => {
    showNotification(`BC ${selectedBC.id} purchased successfully!`, "success");
    setSelectedBC(null);
  };

  return (
    <div>
      <div className="bg-white rounded-md p-2">
        <h2 className="text-xl font-semibold mb-3 bg-sky-600 p-2 rounded-md text-center text-white">
          Running Bhisi
        </h2>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
            <thead className="bg-gray-400 text-gray-700">
              <tr className="whitespace-nowrap text-xs md:text-sm font-semibold">
                <th className="p-2 md:p-3 text-left">Sr. No</th>
                <th className="p-2 md:p-3 text-left">Bhisi No</th>
                <th className="p-2 md:p-3 text-left">Expiry Date</th>
                <th className="p-2 md:p-3 text-left">Amount</th>
                {/* <th className="p-2 md:p-3 text-center">Name</th> */}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                // SHOW LOADING UI
                <tr>
                  <td colSpan="5">
                    <div className="flex flex-col items-center py-6">
                      <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-center mt-3 font-semibold text-gray-600">
                        Loading Running Bhisi...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : currentItems.length ? (
                currentItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 text-center">{item.srNo}</td>
                    <td className="p-2 font-medium">{item.id}</td>
                    <td className="p-2 font-semibold text-gray-700">{item.expiry}</td>
                    <td className="p-2 font-semibold text-blue-600">{item.amount}</td>
                    {/* <td className="p-2 font-semibold text-gray-700">{item.name}</td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-gray-500">
                    No running bhisi found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ---------------------------------------------------- */}
        {/* PAGINATION */}
        {/* ---------------------------------------------------- */}
        {runningBCData.length > reportsPerPage && (
          <div className="flex justify-center gap-2 mt-4">

            {/* Prev */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`px-3 py-1 rounded-md border ${currentPage === 1
                ? "bg-gray-200 text-gray-400"
                : "bg-white text-black"
                }`}
            >
              Prev
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md border ${currentPage === i + 1
                  ? "bg-gray-700 text-white"
                  : "bg-white text-black"
                  }`}
              >
                {i + 1}
              </button>
            ))}

            {/* Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`px-3 py-1 rounded-md border ${currentPage === totalPages
                ? "bg-gray-200 text-gray-400"
                : "bg-white text-black"
                }`}
            >
              Next
            </button>

          </div>
        )}

        {/* Buy Modal */}
        {selectedBC && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-[400px] p-6 relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-3xl"
              >
                ×
              </button>

              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Bhisi Purchase Details
              </h3>

              <div className="space-y-2 text-gray-700 text-sm">
                <p><span className="font-medium">Bhisi No:</span> {selectedBC.id}</p>
                <p><span className="font-medium">Expiry Date:</span> {selectedBC.expiry}</p>
                <p><span className="font-medium">Amount:</span> {selectedBC.amount}</p>
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPurchase}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                >
                  Confirm Purchase
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RunningBC;
