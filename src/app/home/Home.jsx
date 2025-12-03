
import ImageCropper from "@/components/ImageCropper";
import BASE_URL from "@/config/BaseUrl";
import axios from "axios";
import React, { useState } from "react";

const Home = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    totalFamily: "",
    gnati: "",
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    gender: "Male",
    category: "Patron",
    address: "",
    pincode: "",
    telephone: "",
    mobile: "",
    email: "",
    website: "",
    profileImage: "",
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New loading state

  const keyDown = (e) => {
    if (
      [8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return;
    }

    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleTabSelect = (field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));
    }
  };

  const handleCropComplete = (croppedImage) => {
    setFormData((prevState) => ({
      ...prevState,
      profileImage: croppedImage,
    }));
    setShowCropper(false);
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullname.trim()) newErrors.fullname = "Full name is required";
    if (!formData.dobDay || !formData.dobMonth || !formData.dobYear) {
      newErrors.age = "DOB is required";
    }
    
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.gnati.trim()) newErrors.gnati = "Gnati is required";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    if (!formData.email) newErrors.email = "Email is required";

    if (!formData.profileImage)
      newErrors.profileImage = "Profile image is required";

    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setAlertMessage("Please fix the errors in the form before submitting.");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true); // Start loading

    try {
      const form = new FormData();
      const dob = `${formData.dobYear}-${formData.dobMonth}-${formData.dobDay}`;

      form.append("name", formData.fullname);
      form.append("totalFamily", formData.totalFamily);
      form.append("gnati", formData.gnati);
      form.append("user_dob", dob);
      form.append("gender", formData.gender);
      form.append("category", formData.category);
      form.append("address", formData.address);
      form.append("pincode", formData.pincode);
      form.append("telephone", formData.telephone);
      form.append("mobile", formData.mobile);
      form.append("email", formData.email);
      form.append("website", formData.website);

      if (formData.profileImage) {
        if (formData.profileImage.startsWith("data:")) {
          const res = await fetch(formData.profileImage);
          const blob = await res.blob();
          const file = new File([blob], "profile.jpg", { type: blob.type });
          form.append("user_image", file);
        } else {
          form.append("user_image", formData.profileImage);
        }
      }

      const response = await axios.post(
        `${BASE_URL}/api/createWebenquiry`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response.data);

      setAlertMessage(
        "Registration submitted successfully! We will contact you soon."
      );
      setAlertType("success");
      setShowAlert(true);


      setFormData({
        fullname: "",
        totalFamily: "",
        gnati: "",
        dobDay: '',
        dobMonth: '',
        dobYear: '',
        gender: "Male",
        category: "Patron",
        address: "",
        pincode: "",
        telephone: "",
        mobile: "",
        email: "",
        website: "",
        profileImage: "",
      });

    } catch (error) {
      console.error("API Error:", error);
      
      let errorMessage = "Something went wrong, please try again.";
      
      if (error.response) {
      
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
       
        errorMessage = "Network error. Please check your connection and try again.";
      } else {

        errorMessage = error.message || "An unexpected error occurred.";
      }
      
      setAlertMessage(errorMessage);
      setAlertType("error");
      setShowAlert(true);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div
              className={`flex items-center justify-center h-12 w-12 rounded-full ${
                alertType === "success" ? "bg-green-100" : "bg-red-100"
              } mx-auto`}
            >
              {alertType === "success" ? (
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>
            <div className="mt-3 text-center">
              <h3
                className={`text-lg font-medium ${
                  alertType === "success" ? "text-green-800" : "text-red-800"
                }`}
              >
                {alertType === "success" ? "Success!" : "Error!"}
              </h3>
              <div className="mt-2 px-4">
                <p className="text-sm text-gray-500">{alertMessage}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={closeAlert}
                className={`px-4 py-2 ${
                  alertType === "success"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  alertType === "success"
                    ? "focus:ring-green-500"
                    : "focus:ring-red-500"
                }`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showCropper && (
        <ImageCropper
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop}
        />
      )}

      <div className="relative h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1433838552652-f9a46b332c40?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Header background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
        </div>
      </div>

      <div className="relative -mt-32 z-20 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[0.4rem] shadow-2xl overflow-hidden">
            <div className="px-8 py-4">
              <div className="flex items-center justify-center gap-4 mb-4">
                {/* Logo */}
                <img
                  src="/logo-bg2.png"
                  alt="Shri Bangalore Vaishnav Samaj Logo"
                  className="w-16 h-16 object-contain "
                />

                {/* Title & Subtitle */}
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-transparent bg-orange-700 bg-clip-text mb-1">
                    Shri Bangalore Vaishnav Samaj
                  </h2>
                  <p className="text-gray-600">
                    Please fill your details to update membership data
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-3">
                      Category
                    </label>
                    <div className="flex space-x-1">
                      {["Patron", "Dy Patron", "Life Membership"].map(
                        (category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() =>
                              handleTabSelect("category", category)
                            }
                            className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                              formData.category === category
                                ? "bg-amber-500 text-white shadow-lg"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {category}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-3">
                      Gender *
                    </label>
                    <div className="flex space-x-2">
                      {["Male", "Female"].map((gender) => (
                        <button
                          key={gender}
                          type="button"
                          onClick={() => handleTabSelect("gender", gender)}
                          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                            formData.gender === gender
                              ? "bg-amber-500 text-white shadow-lg"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {gender}
                        </button>
                      ))}
                    </div>
                    {errors.gender && (
                      <span className="text-xs text-red-500">
                        {errors.gender}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.fullname
                          ? "border-red-500"
                          : "border-gray-400/80"
                      } rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors`}
                      required
                      disabled={isSubmitting}
                    />
                    {errors.fullname && (
                      <span className="text-xs text-red-500">
                        {errors.fullname}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">
                      Date of Birth *
                    </label>
                    <div className="flex gap-0.5">
                      {/* Day */}
                      <select
                        name="dobDay"
                        value={formData.dobDay || ""}
                        onChange={handleInputChange}
                        className="flex-1 py-3 bg-white border border-gray-400/80 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                        disabled={isSubmitting}
                      >
                        <option value="">Day</option>
                        {[...Array(31)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>

                      {/* Month */}
                      <select
                        name="dobMonth"
                        value={formData.dobMonth || ""}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 bg-white border border-gray-400/80 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                        disabled={isSubmitting}
                      >
                        <option value="">Month</option>
                        {[
                          "January",
                          "February",
                          "March",
                          "April",
                          "May",
                          "June",
                          "July",
                          "August",
                          "September",
                          "October",
                          "November",
                          "December",
                        ].map((month, index) => (
                          <option key={index + 1} value={index + 1}>
                            {month}
                          </option>
                        ))}
                      </select>

                      {/* Year */}
                      <select
                        name="dobYear"
                        value={formData.dobYear || ""}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 bg-white border border-gray-400/80 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                        disabled={isSubmitting}
                      >
                        <option value="">Year</option>
                        {Array.from(
                          { length: 120 },
                          (_, i) => new Date().getFullYear() - i
                        ).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    {errors.age && (
                      <span className="text-xs text-red-500">{errors.age}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">
                      Gnati *
                    </label>
                    <input
                      type="text"
                      name="gnati"
                      value={formData.gnati}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.gnati ? "border-red-500" : "border-gray-400/80"
                      } rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors`}
                      required
                      disabled={isSubmitting}
                    />
                    {errors.gnati && (
                      <span className="text-xs text-red-500">
                        {errors.gnati}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      onKeyDown={keyDown}
                      maxLength="10"
                      className={`w-full px-4 py-3 border ${
                        errors.mobile ? "border-red-500" : "border-gray-400/80"
                      } rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors`}
                      required
                      disabled={isSubmitting}
                    />
                    {errors.mobile && (
                      <span className="text-xs text-red-500">
                        {errors.mobile}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.email ? "border-red-500" : "border-gray-400/80"
                      } rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors`}
                      required
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <span className="text-xs text-red-500">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-amber-800 mb-2">
                      Complete Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-400/80 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
                      placeholder="Enter your complete address..."
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">
                      Profile Image *
                    </label>
                    <div className="flex items-center space-x-4">
                      {formData.profileImage ? (
                        <div className="relative">
                          <img
                            src={formData.profileImage}
                            alt="Profile preview"
                            className="w-24 h-24 rounded-full object-cover border-2 border-amber-500"
                          />
                        </div>
                      ) : (
                        <div
                          className={`w-24 h-24 rounded-xl flex items-center justify-center border-2 border-dashed ${
                            errors.profileImage
                              ? "border-red-500 bg-red-50"
                              : "border-yellow-800/20 bg-gray-200"
                          }`}
                        >
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                        </div>
                      )}

                      <div>
                        <button
                          type="button"
                          onClick={() => setShowCropper(true)}
                          className="px-4 py-2 bg-amber-500 text-white rounded-lg cursor-pointer hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSubmitting}
                        >
                          {formData.profileImage
                            ? "Change Image"
                            : "Upload Image"}
                        </button>
                      </div>
                    </div>
                    {errors.profileImage && (
                      <span className="text-xs text-red-500">
                        {errors.profileImage}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-[1rem] rounded-md transform transition-all duration-200 shadow-lg flex items-center justify-center min-w-[120px] ${
                      isSubmitting 
                        ? 'opacity-70 cursor-not-allowed' 
                        : 'hover:from-amber-600 hover:to-orange-600 hover:scale-105 hover:shadow-xl'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg 
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24"
                        >
                          <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                          ></circle>
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-center mt-4 text-sm">
                If you face any difficulty, please contact{" "}
                <a
                  href="tel:+918867171061"
                  className="text-blue-600 font-medium hover:underline"
                >
                  +91 8867171061
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;