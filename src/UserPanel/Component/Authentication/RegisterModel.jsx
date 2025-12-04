import { useState, useEffect } from "react";
import {
  FaUser,
  FaPhone,
  FaIdCard,
  FaImage,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaTimesCircle,
} from "react-icons/fa";
import { TbPasswordUser } from "react-icons/tb";
import { useProject } from "../../../Context/ProjectContext";

const RegisterModel = () => {



  const {
    user,
    registerUser,
    getSponsorDetails,
    showNotification,
    registerModal,
    toggleRigesterModal,
    toggleWellcomeModal,
    showWelcomeLetter,
    walletBalance
  } = useProject();

  //  Prevent background scroll
  useEffect(() => {
    if (registerModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [registerModal]);


  const [formData, setFormData] = useState({
    memberName: "",
    mobile: "",
    aadhar: "",
    sponsorId: "",
    password: "",
    aadharPhoto: null,
    cancelCheque: null,
  });


  const resetForm = () => {
    setFormData({
      memberName: "",
      mobile: "",
      aadhar: "",
      sponsorId: "",
      password: "",
      aadharPhoto: null,
      cancelCheque: null,
    });

    setErrors({});
    setSponsorValid(null);
    setSponsorName("");
  };

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [sponsorValid, setSponsorValid] = useState(null);
  const [sponsorName, setSponsorName] = useState("");

  if (!registerModal) return null;

  // Handle text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    let cleanedValue = value;

    // 🧹 Remove spaces ONLY for fields EXCEPT memberName
    if (name !== "memberName") {
      cleanedValue = cleanedValue.replace(/\s+/g, "");  // removes spaces
    }

    if (name === "mobile") {
      cleanedValue = cleanedValue.replace(/\D/g, ""); // only digits
      if (cleanedValue.length > 10) return;
    }

    if (name === "aadhar") {
      cleanedValue = cleanedValue.replace(/\D/g, ""); // only digits
      if (cleanedValue.length > 12) return;
    }

    setFormData({ ...formData, [name]: cleanedValue });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };


  // Sponsor ID change handler + live validation
  const handleSponsorChange = async (e) => {
    const value = e.target.value.replace(/\s+/g, "");
    setFormData({ ...formData, sponsorId: value });

    if (!value) {
      setSponsorValid(null);
      setSponsorName("");
      return;
    }

    const res = await getSponsorDetails(value);

    if (res.ResponseStatus === "success") {
      const parsed = JSON.parse(res.Data)[0];
      setSponsorValid(true);
      setSponsorName(parsed.MEMB_NAME);
    } else {
      setSponsorValid(false);
      setSponsorName("");
    }
  };

  // Handle Upload Image fields
  const handleFileUpload = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // VALIDATION FUNCTION
  const validate = () => {
    let newErrors = {};

    if (!formData.memberName.trim()) {
      newErrors.memberName = "Member name is required";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (formData.mobile.length !== 10) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    if (!formData.sponsorId.trim()) {
      newErrors.sponsorId = "Sponsor ID is required";
    }

    if (!formData.aadhar.trim()) {
      newErrors.aadhar = "Aadhar number is required";
    } else if (formData.aadhar.length !== 12) {
      newErrors.aadhar = "Aadhar must be 12 digits";
    }

    if (!formData.aadharPhoto) {
      newErrors.aadharPhoto = "Aadhar photo is required";
    }

    if (!formData.cancelCheque) {
      newErrors.cancelCheque = "Cancelled cheque photo is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const mcode = user?.MEMB_CODE
      const res = await registerUser(
        mcode,
        formData.memberName,
        formData.mobile,
        formData.password,
        formData.sponsorId,
        formData.aadhar,
        formData.aadharPhoto,
        formData.cancelCheque
      );

      if (res.ResponseStatus === "error") {
        showNotification(res.ResponseMessage, "error");   // <-- show API error
        return;
      }

      if (res.ResponseStatus === "success") {
        showNotification("✅ Member Registered Successfully!", "success");

        if (user?.MEMB_CODE) {
          walletBalance(user.MEMB_CODE);
        }

        // ⭐ Store welcome data
        showWelcomeLetter(res.regData);

        // ⭐ Open welcome modal
        toggleWellcomeModal();

        resetForm();
        toggleRigesterModal();
      }

    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-100 px-3">

      {/* POPUP BOX */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[92vw] md:w-[30vw] border-2 border-gray-400 relative overflow-y-auto max-h-[90vh]">

        {/* Close Button */}
        <button
          onClick={() => {
            resetForm();   // ← CLEAR INPUTS
            toggleRigesterModal();   // CLOSE MODAL
          }}
          className="absolute top-3 right-4 text-3xl font-bold text-gray-600 hover:text-red-600"
        >
          ×
        </button>

        {/* TITLE */}
        <div className="flex flex-col items-center mb-6">
          <img src="/Bhisi/logo-white.png" className="w-12" />
          <h2 className="bg-linear-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text text-2xl font-bold flex items-center gap-2">
            <FaUserPlus className="text-purple-700" /> Add New Member
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Member Name */}
          <div className="mb-4">
            <label className="font-semibold flex items-center gap-2">
              <FaUser /> Member Name
            </label>
            <input
              type="text"
              name="memberName"
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
              placeholder="Enter Member Name"
              value={formData.memberName}
              onChange={handleChange}
            />
            {errors.memberName && (
              <p className="text-red-500 text-xs mt-1">{errors.memberName}</p>
            )}
          </div>

          {/* Mobile */}
          <div className="mb-4">
            <label className="text-gray-700 font-semibold flex items-center gap-2">
              <FaPhone /> Mobile Number
            </label>
            <input
              type="number"
              name="mobile"
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={handleChange}
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
            )}
          </div>

          {/* Sponsor ID */}
          <div className="mb-4">
            <label className="text-gray-700 font-semibold flex items-center gap-2">
              <FaUser /> Sponsor ID
            </label>

            <div className="relative">
              <input
                type="text"
                name="sponsorId"
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 pr-28"
                placeholder="Enter Sponsor ID"
                value={formData.sponsorId}
                onChange={handleSponsorChange}
              />

              {sponsorValid === true && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-xs font-semibold text-right w-[100px] whitespace-nowrap">
                  ✅ {sponsorName}
                </span>
              )}

              {sponsorValid === false && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-xs font-semibold">
                  ❌ Invalid
                </span>
              )}
            </div>

            {errors.sponsorId && (
              <p className="text-red-500 text-xs mt-1">{errors.sponsorId}</p>
            )}
          </div>

          {/* Aadhar */}
          <div className="mb-4">
            <label className="text-gray-700 font-semibold flex items-center gap-2">
              <FaIdCard /> Aadhar Number
            </label>
            <input
              type="number"
              name="aadhar"
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
              placeholder="Enter Aadhar number"
              value={formData.aadhar}
              onChange={handleChange}
            />
            {errors.aadhar && (
              <p className="text-red-500 text-xs mt-1">{errors.aadhar}</p>
            )}
          </div>

          {/* File Uploads */}
          <div className="mb-4 flex gap-2">
            {/* Aadhar Photo */}
            <div className="w-1/2">
              <label className="text-xs text-gray-700 font-semibold flex items-center gap-2">
                <FaImage /> Aadhar Photo
              </label>
              <input
                type="file"
                name="aadharPhoto"
                accept="image/*"
                className="w-full border-2 text-xs border-gray-300 rounded-lg px-2"
                onChange={handleFileUpload}
              />
              {errors.aadharPhoto && (
                <p className="text-red-500 text-xs mt-1">{errors.aadharPhoto}</p>
              )}
              {formData.aadharPhoto && (
                <img
                  src={URL.createObjectURL(formData.aadharPhoto)}
                  className="mt-2 w-full h-24 object-cover rounded-lg border"
                />
              )}
            </div>

            {/* Cancel Cheque */}
            <div className="w-1/2">
              <label className="text-xs text-gray-700 font-semibold flex items-center gap-2">
                <FaImage /> Cancel Cheque
              </label>
              <input
                type="file"
                name="cancelCheque"
                accept="image/*"
                className="w-full border-2 text-xs border-gray-300 rounded-lg px-2"
                onChange={handleFileUpload}
              />
              {errors.cancelCheque && (
                <p className="text-red-500 text-xs mt-1">{errors.cancelCheque}</p>
              )}
              {formData.cancelCheque && (
                <img
                  src={URL.createObjectURL(formData.cancelCheque)}
                  className="mt-2 w-full h-24 object-cover rounded-lg border"
                />
              )}
            </div>
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="text-gray-700 font-semibold flex items-center gap-2">
              <TbPasswordUser /> New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 pr-10"
              placeholder="Enter New Unique password"
              value={formData.password}
              onChange={handleChange}
            />

            <div
              className="absolute right-3 top-9 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>


          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl font-semibold shadow-md"
            >
              Register
            </button>

            <button
              type="button"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-md"
              onClick={toggleRigesterModal}
            >
              <FaTimesCircle /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModel;
