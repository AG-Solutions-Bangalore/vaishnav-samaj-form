import ImageCropper from '@/components/ImageCropper';
import React, { useState } from 'react';



const Home = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    totalFamily: '',
    gnati: '',
    age: '',
    gender: 'Male',
    category: 'Donor',
    address: '',
    pincode: '',
    telephone: '',
    mobile: '',
    email: '',
    website: '',
    fax: '',
    other: '',
    profileImage: ''
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); 
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState(null);

  const keyDown = (e) => {
    if ([8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
        (e.keyCode === 65 && e.ctrlKey === true) || 
        (e.keyCode === 67 && e.ctrlKey === true) || 
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true)) {
      return;
    }
  
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const handleTabSelect = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: ''
      }));
    }
  };

  const handleCropComplete = (croppedImage) => {
    setFormData(prevState => ({
      ...prevState,
      profileImage: croppedImage
    }));
    setShowCropper(false);
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
  };

  const validateForm = () => {
    const newErrors = {};
  
    if (!formData.fullname.trim()) newErrors.fullname = 'Full name is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.gnati.trim()) newErrors.gnati = 'Gnati is required';
    if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
    if (!formData.email) newErrors.email = 'Email is required';

    if (!formData.profileImage) newErrors.profileImage = 'Profile image is required';  
  
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    if (formData.age && (formData.age < 1 || formData.age > 120)) {
      newErrors.age = 'Please enter a valid age';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form Data:", formData);
      setAlertMessage("Registration submitted successfully! We will contact you soon.");
      setAlertType('success');
      setShowAlert(true);
    } else {
      setAlertMessage("Please fix the errors in the form before submitting.");
      setAlertType('error');
      setShowAlert(true);
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
            <div className={`flex items-center justify-center h-12 w-12 rounded-full ${alertType === 'success' ? 'bg-green-100' : 'bg-red-100'} mx-auto`}>
              {alertType === 'success' ? (
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div className="mt-3 text-center">
              <h3 className={`text-lg font-medium ${alertType === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {alertType === 'success' ? 'Success!' : 'Error!'}
              </h3>
              <div className="mt-2 px-4">
                <p className="text-sm text-gray-500">
                  {alertMessage}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={closeAlert}
                className={`px-4 py-2 ${alertType === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${alertType === 'success' ? 'focus:ring-green-500' : 'focus:ring-red-500'}`}
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
    src="/logo-bg1.png" 
    alt="Shri Bangalore Vaishnav Samaj Logo" 
    className="w-16 h-16 object-contain -rotate-90"
  />

  {/* Title & Subtitle */}
  <div className="text-left">
    <h2 className="text-2xl font-bold text-transparent bg-orange-700 bg-clip-text mb-1">
      Shri Bangalore Vaishnav Samaj
    </h2>
    <p className="text-gray-600">Please fill in your details to register</p>
  </div>
</div>


              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-3">Category</label>
                    <div className="flex space-x-1">
                      {["Donor", "Patron", "Life Membership"].map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => handleTabSelect("category", category)}
                          className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                            formData.category === category
                              ? "bg-amber-500 text-white shadow-lg"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-3">Gender *</label>
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
                    {errors.gender && <span className="text-xs text-red-500">{errors.gender}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${errors.fullname ? 'border-red-500' : 'border-gray-400/80'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors`}
                      required
                    />
                    {errors.fullname && <span className="text-xs text-red-500">{errors.fullname}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">Age *</label>
                    <input
                      type="date"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${errors.age ? 'border-red-500' : 'border-gray-400/80'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors`}
                      required
                    />
                    {errors.age && <span className="text-xs text-red-500">{errors.age}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">Gnati *</label>
                    <input
                      type="text"
                      name="gnati"
                      value={formData.gnati}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${errors.gnati ? 'border-red-500' : 'border-gray-400/80'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors`}
                      required
                    />
                    {errors.gnati && <span className="text-xs text-red-500">{errors.gnati}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">Mobile Number *</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      onKeyDown={keyDown}
                      maxLength="10"
                      className={`w-full px-4 py-3 border ${errors.mobile ? 'border-red-500' : 'border-gray-400/80'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors`}
                      required
                    />
                    {errors.mobile && <span className="text-xs text-red-500">{errors.mobile}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-400/80'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors`}
                      required
                    />
                    {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className='col-span-1 md:col-span-2'>
                    <label className="block text-sm font-medium text-amber-800 mb-2">Complete Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-400/80 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
                      placeholder="Enter your complete address..."
                    />
                  </div>
                
                  <div>
  <label className="block text-sm font-medium text-amber-800 mb-2">Profile Image *</label>
  <div className="flex items-center space-x-4">
    {formData.profileImage ? (
      <div className="relative">
        <img 
          src={formData.profileImage} 
          alt="Profile preview" 
          className="w-24 h-24 rounded-full object-cover border-2 border-amber-500"
        />
        <button
          type="button"
          onClick={() => {
            setFormData(prev => ({...prev, profileImage: ''}));
          }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
        >
          ×
        </button>
      </div>
    ) : (
      <div className={`w-24 h-24 rounded-xl flex items-center justify-center border-2 border-dashed ${errors.profileImage ? 'border-red-500 bg-red-50' : 'border-yellow-800/20 bg-gray-200'}`}>
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
      </div>
    )}
    
    <div>
      <button
        type="button"
        onClick={() => setShowCropper(true)}
        className="px-4 py-2 bg-amber-500 text-white rounded-lg cursor-pointer hover:bg-amber-600 transition-colors"
      >
        {formData.profileImage ? 'Change Image' : 'Upload Image'}
      </button>
    </div>
  </div>
  {errors.profileImage && <span className="text-xs text-red-500">{errors.profileImage}</span>}
</div>

              
                  <div className='flex flex-col gap-4'>
                    <div>
                      <label className="block text-sm font-medium text-amber-800 mb-2">Pincode </label>
                      <input
                        type="tel"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        onKeyDown={keyDown}
                        maxLength="6"
                        className={`w-full px-4 py-3 border ${errors.pincode ? 'border-red-500' : 'border-gray-400/80'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors`}
                        required
                      />
                      {/* {errors.pincode && <span className="text-xs text-red-500">{errors.pincode}</span>} */}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-amber-800 mb-2">Total Family Members </label>
                      <input
                        type="tel"
                        name="totalFamily"
                        value={formData.totalFamily}
                        onChange={handleInputChange}
                        onKeyDown={keyDown}
                        className={`w-full px-4 py-3 border ${errors.totalFamily ? 'border-red-500' : 'border-gray-400/80'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors`}
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload Section */}
             

                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-[1rem] rounded-md hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Submit Registration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;