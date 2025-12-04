import Navbar from "./Navigation/Navbar";
import Footer from "./Navigation/Footer";
import { useProject } from "../../Context/ProjectContext";
import { FaUser, FaMapMarkerAlt, FaIdCard, FaUniversity } from "react-icons/fa";
import { ImProfile } from "react-icons/im";

const ProfilePage = () => {

    const { user } = useProject();

    if (!user) {
        return (
            <div className="min-h-screen flex justify-center items-center text-lg font-semibold">
                Loading Profile...
            </div>
        );
    }

    // Format Join Date
    const rawDate = user.REG_DATE?.split("T")[0];
    let formattedDate = "Not Provided";

    if (rawDate) {
        const [year, month, day] = rawDate.split("-");
        formattedDate = `${day}/${month}/${year}`;
    }

    const member = {
        name: user.MEMB_NAME,
        memberId: user.USERNAME,
        phone: user.MOBILE_NO,
        email: user.EMAIL,
        address: user.ADDRESS1 || "Not Provided",
        city: user.CITY || "Not Provided",
        district: user.DISTRICT || "Not Provided",
        state: user.STATE || "Not Provided",
        country: user.M_COUNTRY || "Not Provided",
        pinCode: user.PIN_CODE || "Not Provided",
        bankAccName: user.ACCOUNT_NAME || "Not Provided",
        bankAccNo: user.BANKAC || "Not Provided",
        bankName: user.BANKNAME || "Not Provided",
        bankBranch: user.BANKBRANCH || "Not Provided",
        ifsc: user.IFSC || "Not Provided",
        aadharNo: user.AADHAR_NO || "Not Provided",
        joinDate: formattedDate,
        status: user.MPOSITION,
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="flex items-center justify-between pt-20 px-4">

                <h1 className="flex items-center gap-2 text-xl md:text-2xl font-bold text-gray-800">
                    <ImProfile />   Member Profile
                </h1>

                {/* <button
                    className="bg-purple-600 active:bg-purple-700 text-white font-semibold 
                   py-2 px-4 rounded-lg shadow-md transition-all duration-200 
                   text-sm md:text-base"
                >
                    Edit Profile
                </button> */}
            </div>


            <div className="px-3 pb-20">
                <div className="max-w-2xl mx-auto mt-6 bg-white shadow-xl rounded-2xl p-6">

                    {/* Profile Header */}
                    <div className="flex items-center gap-4 border-b pb-4 mb-4">
                        <div className="h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                            {member.name.charAt(0)}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FaUser /> {member.name}
                            </h2>
                            <p className="text-gray-600">Member ID: {member.memberId}</p>
                            <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                                {member.status}
                            </span>
                        </div>
                    </div>

                    {/* Personal Info Section */}
                    <SectionTitle title="Personal Information" icon={<FaUser />} />

                    <Detail label="Phone Number" value={member.phone} />
                    <Detail label="Email Address" value={member.email} />
                    <Detail label="Join Date" value={member.joinDate} />

                    {/* Address Section */}
                    <SectionTitle title="Address Details" icon={<FaMapMarkerAlt />} />

                    <Detail label="Address" value={member.address} />
                    <Detail label="City" value={member.city} />
                    <Detail label="State" value={member.state} />
                    <Detail label="PIN Code" value={member.pinCode} />

                    {/* Identity Section */}
                    <SectionTitle title="Identity Information" icon={<FaIdCard />} />
                    <Detail label="Aadhaar Number" value={member.aadharNo} />

                    {/* Bank Section */}
                    <SectionTitle title="Bank Information" icon={<FaUniversity />} />

                    <Detail label="Account Holder Name" value={member.bankAccName} />
                    <Detail label="Account Number" value={member.bankAccNo} />
                    <Detail label="Bank Name" value={member.bankName} />
                    <Detail label="Bank Branch" value={member.bankBranch} />
                    <Detail label="IFSC Code" value={member.ifsc} />

                </div>
            </div>

            <Footer />
        </div>
    );
};

// Reusable Section Title Component
const SectionTitle = ({ title, icon }) => (
    <div className="mt-6 mb-2 flex items-center gap-2 text-lg font-bold text-gray-700">
        <span className="text-xl">{icon}</span>
        {title}
    </div>
);

// Detail Component
const Detail = ({ label, value }) => (
    <div className="flex justify-between border-b py-2 text-sm">
        <span className="font-semibold text-gray-600">{label}:</span>
        <span className="text-gray-800">{value}</span>
    </div>
);

export default ProfilePage;
