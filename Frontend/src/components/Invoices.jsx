import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import * as api from "../services/api"
import { FileText, Plus, Eye, LinkIcon, Search, ChevronDown, DollarSign, Calendar } from "lucide-react"

function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const navigate = useNavigate()

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await api.getAllInvoices()
      setInvoices(response.data.data)
    } catch (error) {
      toast.error("Error fetching invoices")
    }
  }

  const handleCreatePaymentLink = async (invoice) => {
    try {
      await api.createPaymentLink({
        userId: invoice.user,
        invoiceId: invoice._id,
        amount: invoice.total,
      })
      toast.success("Payment link created successfully")
      fetchInvoices()
    } catch (error) {
      toast.error("Error creating payment link")
    }
  }

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1
    if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
              <FileText className="mr-2 text-indigo-600" /> Invoices
            </h3>
            <button
              onClick={() => navigate("/create-invoice")}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="mr-2" /> Create New Invoice
            </button>
          </div>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              <div className="flex space-x-4">
                {["createdAt", "total", "status"].map((field) => (
                  <button
                    key={field}
                    onClick={() => toggleSort(field)}
                    className={`flex items-center space-x-1 text-sm font-medium ${
                      sortBy === field ? "text-indigo-600" : "text-gray-500"
                    } hover:text-indigo-600 transition-colors duration-200`}
                  >
                    <span>{field === "createdAt" ? "Date" : field.charAt(0).toUpperCase() + field.slice(1)}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        sortBy === field && sortOrder === "desc" ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <ul className="divide-y divide-gray-200">
            {sortedInvoices.map((invoice) => (
              <li key={invoice._id} className="hover:bg-gray-50 transition duration-200">
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <div className="text-md font-semibold text-gray-800">Invoice ID: {invoice._id}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <DollarSign className="mr-1 w-4 h-4" /> ${invoice.total.toFixed(2)}
                    </div>
                    <div className={`text-sm px-2 py-1 rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calendar className="mr-1 w-4 h-4" /> {new Date(invoice.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                      className="text-indigo-600 hover:text-indigo-800 flex items-center transition duration-200"
                    >
                      <Eye className="mr-1 w-4 h-4" /> View
                    </button>
                    {!invoice.paymentLink && (
                      <button
                        onClick={() => handleCreatePaymentLink(invoice)}
                        className="text-green-600 hover:text-green-800 flex items-center transition duration-200"
                      >
                        <LinkIcon className="mr-1 w-4 h-4" /> Create Payment Link
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Invoices

