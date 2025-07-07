import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [itemData, setItemData] = useState({
    itemId: "",
    itemName: "",
    itemCategory: "",
    itemQty: "",
    itemDetails: "",
    itemImage: ""
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchItemData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:8080/inventory/${id}`);
        setItemData(response.data);
        if (response.data.itemImage) {
          setPreviewImage(`http://localhost:8080/uploads/${response.data.itemImage}`);
        }
      } catch (err) {
        setError("Failed to load item data. " + (err.response?.data?.message || err.message));
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchItemData();
    else {
      setError("No item ID provided");
      setIsLoading(false);
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Image file size must be less than 5MB");
        return;
      }
      setFile(selectedFile);
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const validateForm = () => {
    if (!itemData.itemName?.trim()) {
      setError("Item name is required");
      return false;
    }
    if (!itemData.itemCategory?.trim()) {
      setError("Category is required");
      return false;
    }
    if (!itemData.itemQty || itemData.itemQty < 0) {
      setError("Quantity must be a positive number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      let response;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const imageResponse = await axios.post("http://localhost:8080/inventory/itemImg", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const imageName = imageResponse.data.fileName;
        response = await axios.put(`http://localhost:8080/inventory/${id}`, {
          ...itemData,
          itemImage: imageName
        });
      } else {
        response = await axios.put(`http://localhost:8080/inventory/${id}`, itemData);
      }
      alert('Item updated successfully!');
      navigate("/allitems");
    } catch (err) {
      setError("Failed to update item. " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => navigate("/allitems");

  // Loading state
  if (isLoading && !itemData.itemId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading item data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 py-8 px-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Update Item {id && <span className="text-blue-600">(ID: {id})</span>}
        </h1>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
            <div className="flex justify-between items-start">
              <div className="flex">
                <span className="text-red-400 text-xl">⚠️</span>
                <div className="ml-3">
                  <p className="text-sm text-red-700"><strong>Error:</strong> {error}</p>
                </div>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <span className="sr-only">Dismiss</span>
                <span className="text-xl">&times;</span>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="itemId" className="block text-sm font-medium text-blue-700 mb-2">
              Item ID
            </label>
            <input
              type="text"
              id="itemId"
              name="itemId"
              value={itemData.itemId}
              readOnly
              className="w-full border px-4 py-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="itemName" className="block text-sm font-medium text-blue-700 mb-2">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              value={itemData.itemName}
              onChange={handleInputChange}
              required
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Enter item name"
            />
          </div>
          <div>
            <label htmlFor="itemCategory" className="block text-sm font-medium text-blue-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="itemCategory"
              name="itemCategory"
              value={itemData.itemCategory}
              onChange={handleInputChange}
              required
              className="w-full border px-4 py-2 rounded bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="Apparel & Fashion">Apparel & Fashion</option>
              <option value="Electronics & Gadgets">Electronics & Gadgets</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Home & Furniture">Home & Furniture</option>
            </select>
          </div>
          <div>
            <label htmlFor="itemQty" className="block text-sm font-medium text-blue-700 mb-2">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="itemQty"
              name="itemQty"
              value={itemData.itemQty}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quantity"
            />
          </div>
          <div>
            <label htmlFor="itemDetails" className="block text-sm font-medium text-blue-700 mb-2">
              Details
            </label>
            <textarea
              id="itemDetails"
              name="itemDetails"
              value={itemData.itemDetails}
              onChange={handleInputChange}
              rows="4"
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 resize-vertical"
              placeholder="Enter item details (optional)"
            />
          </div>
          <div>
            <label htmlFor="itemImage" className="block text-sm font-medium text-blue-700 mb-2">
              Image
            </label>
            <input
              type="file"
              id="itemImage"
              name="itemImage"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full border px-4 py-2 rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              Supported formats: JPG, PNG, GIF. Max size: 5MB
            </p>
            {previewImage && (
              <div className="mt-4 text-center">
                <img
                  src={previewImage}
                  alt="Item preview"
                  className="max-w-xs max-h-48 object-cover rounded-lg border border-gray-200 shadow-sm mx-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                  }}
                />
                <p className="mt-2 text-sm text-gray-600">
                  {file ? (
                    <span className="text-green-600 font-medium">✓ New image selected</span>
                  ) : (
                    <span className="text-blue-600 font-medium">Current image</span>
                  )}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 space-y-4 space-y-reverse sm:space-y-0 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateItem;