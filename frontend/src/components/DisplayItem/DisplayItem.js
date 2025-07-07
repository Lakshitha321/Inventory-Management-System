import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

function DisplayItem() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => { loadInventory(); }, []);

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get("http://localhost:8080/inventory");
      setInventoryItems(result.data);
      setError(null);
    } catch (error) {
      setError("Failed to load inventory items. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateNavigate = (id) => {
    navigate(`/updateitem/${id}`);
  };

  const deleteItem = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/inventory/${id}`);
        loadInventory();
        alert("Item deleted successfully.");
      } catch (error) {
        alert("Error deleting item. Please try again later.");
      }
    }
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF("portrait");
      doc.setFontSize(16);
      doc.text("Inventory Item List", 14, 15);

      const columns = [
        { header: "ID", dataKey: "itemId" },
        { header: "Name", dataKey: "itemName" },
        { header: "Category", dataKey: "itemCategory" },
        { header: "Quantity", dataKey: "itemQty" },
        { header: "Details", dataKey: "itemDetails" }
      ];

      const rows = inventoryItems.map(item => ({
        itemId: item.itemId || 'N/A',
        itemName: item.itemName || 'N/A',
        itemCategory: item.itemCategory || 'N/A',
        itemQty: item.itemQty || 'N/A',
        itemDetails: item.itemDetails || 'N/A'
      }));

      autoTable(doc, {
        startY: 25,
        head: [columns.map(col => col.header)],
        body: rows.map(row => columns.map(col => row[col.dataKey])),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] },
        margin: { left: 14, right: 14 }
      });

      doc.save("inventory_items.pdf");
    } catch (error) {
      alert('Error generating PDF. Please try again.');
    }
  };

  const filteredItems = inventoryItems.filter(item =>
    String(item.itemId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(item.itemName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading inventory items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700">
        <div className="text-center bg-white p-8 rounded-xl shadow-2xl max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button 
            onClick={loadInventory} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!inventoryItems || inventoryItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700">
        <div className="text-center bg-white p-8 rounded-xl shadow-2xl max-w-md">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <div className="text-gray-600 text-lg mb-4">No inventory items found.</div>
          <button 
            onClick={loadInventory} 
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Inventory Items</h1>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={generatePDF} 
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition flex items-center gap-2"
              >
                <span>📄</span> Generate PDF
              </button>
              <input
                type="text"
                placeholder="Search by ID and name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={loadInventory} 
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition flex items-center gap-2"
              >
                <span>🔄</span> Refresh
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                    Item ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl mb-2">🔍</div>
                        <p>No items match your search.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <tr key={item.id || `${item.itemId}-${index}`} className="hover:bg-indigo-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.itemId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.itemImage ? (
                          <img
                            src={`http://localhost:8080/uploads/${item.itemImage}`}
                            alt={item.itemName || 'Item image'}
                            className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="h-16 w-16 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-300 text-xs border border-gray-200">
                            No image
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.itemName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                          {item.itemCategory || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium">{item.itemQty || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={item.itemDetails || 'N/A'}>
                          {item.itemDetails || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => updateNavigate(item.id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition text-xs"
                          title="Edit item"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition text-xs"
                          title="Delete item"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisplayItem;