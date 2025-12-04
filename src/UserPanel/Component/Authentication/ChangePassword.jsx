import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import { useProject } from "../../../Context/ProjectContext";

const ChangePassword = () => {
    const { toggleChangePasswModal, changePasswModal, showNotification } = useProject();

    //  Prevent background scroll
    useEffect(() => {
        if (changePasswModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [changePasswModal]);


    const [form, setForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [show, setShow] = useState({
        old: false,
        new: false,
        confirm: false,
    });

    const resetPasswordForm = () => {
        setForm({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        setErrors({});

        setShow({
            old: false,
            new: false,
            confirm: false,
        });
    };


    if (!changePasswModal) return null;

    // Input handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        const cleaned = value.replace(/\s+/g, "");
        setForm({ ...form, [name]: cleaned });
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // Validation
    const validate = () => {
        let newErrors = {};

        if (!form.oldPassword.trim()) {
            newErrors.oldPassword = "Old password is required";
        }

        if (!form.newPassword.trim()) {
            newErrors.newPassword = "New password is required";
        } else if (form.newPassword.length < 6) {
            newErrors.newPassword = "New password must be at least 6 characters";
        }

        // ⭐ NEW VALIDATION RULE:
        if (form.oldPassword && form.newPassword && form.oldPassword === form.newPassword) {
            newErrors.newPassword = "New password cannot be the same as old password";
        }

        if (!form.confirmPassword.trim()) {
            newErrors.confirmPassword = "Confirm your new password";
        } else if (form.newPassword !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            showNotification("Password changed successfully!", "success");

            resetPasswordForm();   // ← Reset form
            toggleChangePasswModal(); // Optional: Close modal
        }
    };


    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-100 p-4">

            {/* POPUP BOX */}
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-[92vw] md:w-[28vw] border border-gray-400 relative overflow-y-auto max-h-[90vh]">

                {/* Close Button */}
                <button
                    onClick={() => {
                        resetPasswordForm();      // ← Reset fields
                        toggleChangePasswModal(); // Close modal
                    }}
                    className="absolute top-3 right-4 text-3xl font-bold text-gray-600 hover:text-red-600"
                >
                    ×
                </button>

                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                    <img src="/Bhisi/logo-white.png" className="w-12" />
                    <h2 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text flex items-center gap-2">
                        <MdOutlineSecurity className="text-violet-700" /> Change Password
                    </h2>
                </div>

                {/* Old Password */}
                <div className="mb-5">
                    <label className="block text-gray-700 mb-1 font-semibold">
                        Old Password
                    </label>

                    <div className="relative">
                        <FaLock className="absolute left-3 top-3 text-gray-600" />

                        <input
                            type={show.old ? "text" : "password"}
                            name="oldPassword"
                            className="w-full border rounded-lg pl-10 pr-10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="Enter old password"
                            value={form.oldPassword}
                            onChange={handleChange}
                        />

                        <div
                            className="absolute right-3 top-3 cursor-pointer text-gray-600"
                            onClick={() => setShow({ ...show, old: !show.old })}
                        >
                            {show.old ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>

                    {errors.oldPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.oldPassword}</p>
                    )}
                </div>

                {/* New Password */}
                <div className="mb-5">
                    <label className="block text-gray-700 mb-1 font-semibold">
                        New Password
                    </label>

                    <div className="relative">
                        <FaLock className="absolute left-3 top-3 text-gray-600" />

                        <input
                            type={show.new ? "text" : "password"}
                            name="newPassword"
                            className="w-full border rounded-lg pl-10 pr-10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="Enter new password"
                            value={form.newPassword}
                            onChange={handleChange}
                        />

                        <div
                            className="absolute right-3 top-3 cursor-pointer text-gray-600"
                            onClick={() => setShow({ ...show, new: !show.new })}
                        >
                            {show.new ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>

                    {errors.newPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="mb-5">
                    <label className="block text-gray-700 mb-1 font-semibold">
                        Confirm Password
                    </label>

                    <div className="relative">
                        <FaLock className="absolute left-3 top-3 text-gray-600" />

                        <input
                            type={show.confirm ? "text" : "password"}
                            name="confirmPassword"
                            className="w-full border rounded-lg pl-10 pr-10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="Confirm new password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                        />

                        <div
                            className="absolute right-3 top-3 cursor-pointer text-gray-600"
                            onClick={() =>
                                setShow({ ...show, confirm: !show.confirm })
                            }
                        >
                            {show.confirm ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>

                    {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.confirmPassword}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition duration-200 shadow-md"
                >
                    Update Password
                </button>
            </div>
        </div>
    );
};

export default ChangePassword;
