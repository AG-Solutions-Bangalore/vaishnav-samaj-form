import React, { useState, useRef } from 'react';
import { Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';

const ImageCropper = ({ onCropComplete, onCancel }) => {
  const [image, setImage] = useState(null);
  const cropperRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCanvas();
      if (canvas) {
        onCropComplete(canvas.toDataURL('image/jpeg'));
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Crop Image</h3>
        
        {!image ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p className="text-gray-500 mb-4">Select an image to crop</p>
            <label className="px-4 py-2 bg-amber-500 text-white rounded-lg cursor-pointer hover:bg-amber-600 transition-colors">
              Select Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <>
          <div className="relative mb-4 flex justify-center items-center">
  <Cropper
    ref={cropperRef}
    src={image}
    stencilProps={{
      aspectRatio: 1,
    }}
    className="max-w-full max-h-[70vh] "
    style={{ height: "auto", width: "auto" }} 
  />

 
</div>

            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  onCancel();
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCrop}
                className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
              >
                Apply Crop
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageCropper;
