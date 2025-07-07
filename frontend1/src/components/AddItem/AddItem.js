import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddItem() {
  const navigate = useNavigate();
  const [Inventory, setInventory] = useState({
    itemId: '',
    itemName: '',
    itemCategory: '',
    itemQty: '',
    itemDetails: '',
    itemImage: '',
  }); 

  const { itemId, itemName, itemCategory, itemQty, itemDetails } = Inventory;

  const onInputChange = (e) => {
    if (e.target.name === "itemImage") {
      setInventory({ ...Inventory, [e.target.name]: e.target.files[0] });
    } else {
      setInventory({ ...Inventory, [e.target.name]: e.target.value }); 
    }
  };

  const onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", Inventory.itemImage);
    let imageName = "";

    try {
      const response = await axios.post("http://localhost:8080/inventory/itemImg", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      imageName = response.data.fileName;
    } catch (error) {
      alert("Error uploading image. Please try again.");
      return;
    }

    const updatedInventory = { ...Inventory, itemImage: imageName };
    await axios.post("http://localhost:8080/inventory", updatedInventory);
    alert("Item added successfully!");
    window.location.reload();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Add Item</h1>
        <form id="itemForm" onSubmit={onsubmit} className="space-y-6">
          <div>
            <label htmlFor="itemId" className="block text-sm font-medium text-blue-700 mb-2">
              Item ID
            </label>
            <input 
              type="text" id="itemId" name="itemId" value={itemId} onChange={onInputChange} required 
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="itemName" className="block text-sm font-medium text-blue-700 mb-2">
              Item Name
            </label>
            <input 
              type="text" id="itemName" name="itemName" value={itemName} onChange={onInputChange} required 
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="itemCategory" className="block text-sm font-medium text-blue-700 mb-2">
              Item Category
            </label>
            <select 
              id="itemCategory" name="itemCategory" value={itemCategory} onChange={onInputChange} required
              className="w-full border px-4 py-2 rounded bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Item Category</option>
              <option value="Apparel & Fashion">Apparel & Fashion</option>
              <option value="Electronics & Gadgets">Electronics & Gadgets</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Home & Furniture">Home & Furniture</option>
            </select>
          </div>
          <div>
            <label htmlFor="itemQty" className="block text-sm font-medium text-blue-700 mb-2">
              Item Quantity
            </label>
            <input 
              type="number" id="itemQty" name="itemQty" value={itemQty} onChange={onInputChange} required min="0"
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="itemDetails" className="block text-sm font-medium text-blue-700 mb-2">
              Item Details
            </label>
            <textarea 
              id="itemDetails" name="itemDetails" rows="4" value={itemDetails} onChange={onInputChange} required
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 resize-vertical"
              placeholder="Enter item details..."
            />
          </div>
          <div>
            <label htmlFor="itemImage" className="block text-sm font-medium text-blue-700 mb-2">
              Item Image
            </label>
            <input 
              type="file" id="itemImage" name="itemImage" accept="image/*" onChange={onInputChange}
              className="w-full border px-4 py-2 rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItem;