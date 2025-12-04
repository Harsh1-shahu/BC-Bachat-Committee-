import { useProject } from "../../Context/ProjectContext";
import { useEffect } from "react";
import { CgProfile } from "react-icons/cg";

const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-center border-b group transition">
        <span className="font-semibold text-gray-700">{label}:</span>
        <span className="text-gray-900 font-medium">{value}</span>
    </div>
);

const WellcomeLetter = () => {
    const { toggleWellcomeModal, wellcomeModal, welcomeData } = useProject();

    useEffect(() => {
        document.body.style.overflow = wellcomeModal ? "hidden" : "auto";
        return () => (document.body.style.overflow = "auto");
    }, [wellcomeModal]);

    if (!wellcomeModal || !welcomeData) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-100 px-3">
            <div className="bg-white text-black p-6 rounded-2xl shadow-2xl w-[92vw] md:w-[32vw] relative overflow-y-auto max-h-[92vh]">

                {/* Close Button */}
                <button
                    onClick={toggleWellcomeModal}
                    className="absolute top-3 right-4 text-3xl font-bold text-black hover:text-red-500"
                >
                    ×
                </button>

                {/* Title */}
                <h2 className="text-center text-xl md:text-2xl font-bold border-b border-gray-600 pb-2">
                    Registration Success
                </h2>

                <div className="flex flex-col items-center justify-center mt-2 bg-white/50 p-1 rounded-lg shadow-md">
                    <img src="/Bhisi/logo-white.png" className="w-10" />

                    <h3 className="text-center text-lg font-semibold">
                        Welcome To Our BC System
                    </h3>
                </div>

                {/* User Details */}
                <div className="mt-5 bg-gray-100 p-3 rounded-xl shadow-sm">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                        <CgProfile /> Member Registration Details
                    </h3>

                    <div className="space-y-2 text-sm">
                        <DetailRow label="Name" value={welcomeData.MEMB_NAME} />
                        <DetailRow label="Username" value={welcomeData.USERNAME} />
                        <DetailRow label="Sponsor Name" value={welcomeData.SPMEMB} />
                        <DetailRow label="Sponsor ID" value={welcomeData.SPUSER} />
                        <DetailRow label="Login Password" value={welcomeData.MPWD} />
                        <DetailRow label="Mobile No" value={welcomeData.MOBILE_NO} />
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-sm">
                    <p>Regards,</p>
                    <p className="font-semibold">BC System Team</p>
                    <p className="mt-2 text-purple-300 text-xs font-bold">support@bc-system.com</p>
                </div>

                <div className="mt-5 flex justify-center">
                    <button
                        onClick={() => window.location.href = "/"}
                        className="bg-purple-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-teal-300 transition"
                    >
                        LOGIN HERE
                    </button>
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={toggleWellcomeModal}
                        className="bg-[#1d1a3b] border border-purple-300 text-purple-300 font-semibold px-6 py-2 rounded-full hover:bg-[#25214d] transition"
                    >
                        CLOSE
                    </button>
                </div>

            </div>
        </div>
    );
};

export default WellcomeLetter;
