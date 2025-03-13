import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as api from "../services/api";
import { Plus, Trash, X, User, FileText, DollarSign, Save } from "lucide-react";

function CreateInvoice() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [items, setItems] = useState([{ serviceName: "", servicePrice: "" }]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.getAllUsers();
      setUsers(response.data.data);
    } catch (error) {
      toast.error("Error fetching users");
    }
  };

  const handleAddItem = () => {
    setItems([...items, { serviceName: "", servicePrice: "" }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (Number(item.servicePrice) || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    if (items.some((item) => !item.serviceName || !item.servicePrice)) {
      toast.error("Please fill all item details");
      return;
    }

    try {
      const invoiceData = {
        userId: selectedUser,
        totalAmount: calculateTotal(),
        invoiceItems: items,
      };

      await api.createInvoice(invoiceData);
      toast.success("Invoice created successfully");
      navigate("/invoices");
    } catch (error) {
      toast.error("Error creating invoice");
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
              <FileText className="mr-2" /> Create New Invoice
            </h3>
            <button
              onClick={() => navigate("/invoices")}
              className="text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>
          </div>
          <div className="px-6 py-5">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                  Select User
                </label>
                <select
                  id="user"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-grow">
                      <label htmlFor={`serviceName-${index}`} className="block text-sm font-medium text-gray-700">
                        Service Name
                      </label>
                      <input
                        type="text"
                        id={`serviceName-${index}`}
                        value={item.serviceName}
                        onChange={(e) => handleItemChange(index, "serviceName", e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex-grow">
                      <label htmlFor={`servicePrice-${index}`} className="block text-sm font-medium text-gray-700">
                        Price
                      </label>
                      <input
                        type="number"
                        id={`servicePrice-${index}`}
                        value={item.servicePrice}
                        onChange={(e) => handleItemChange(index, "servicePrice", e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="mt-6 text-red-600 hover:text-red-700"
                    >
                      <Trash />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="mr-2" /> Add Item
              </button>

              <div className="mt-4">
                <strong className="block text-lg font-semibold text-gray-800">
                  Total Amount: <span className="text-indigo-600">${calculateTotal()}</span>
                </strong>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/invoices")}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition duration-200 flex items-center"
                >
                  <Save className="mr-2" /> Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateInvoice;