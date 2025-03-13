import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import * as api from "../services/api"
import { Calendar, CreditCard, DollarSign, FileText, LinkIcon, Copy, ArrowLeft, Loader2 } from "lucide-react"

function InvoiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoiceDetails()
  }, []) // Removed unnecessary dependency 'id'

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true)
      const response = await api.getInvoiceById(id)
      setInvoice(response.data.data)
    } catch (error) {
      toast.error("Error fetching invoice details")
      navigate("/invoices")
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePaymentLink = async () => {
    try {
      await api.createPaymentLink({
        userId: invoice.user,
        invoiceId: invoice._id,
        amount: invoice.total,
      })
      toast.success("Payment link created successfully")
      fetchInvoiceDetails()
    } catch (error) {
      toast.error("Error creating payment link")
    }
  }

  const copyPaymentLink = () => {
    navigator.clipboard.writeText(invoice.paymentLink)
    toast.success("Payment link copied to clipboard")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <FileText className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700">Invoice not found</h2>
        <button
          onClick={() => navigate("/invoices")}
          className="mt-4 flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Invoices
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Invoice Details</h1>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-indigo-600 mr-2" />
              <span className="text-gray-600 font-medium">Invoice ID:</span>
              <span className="ml-2 text-gray-800">{invoice._id}</span>
            </div>
            <div className="flex items-center">
              <CreditCard className="w-6 h-6 text-indigo-600 mr-2" />
              <span className="text-gray-600 font-medium">Status:</span>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  invoice.status === "Paid"
                    ? "bg-green-100 text-green-800"
                    : invoice.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {invoice.status}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-indigo-600 mr-2" />
              <span className="text-gray-600 font-medium">Created At:</span>
              <span className="ml-2 text-gray-800">{new Date(invoice.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <LinkIcon className="w-6 h-6 text-indigo-600 mr-2" />
              <span className="text-gray-600 font-medium">Payment Link:</span>
              {invoice.paymentLink ? (
                <div className="ml-2 flex items-center">
                  <span className="text-indigo-600 truncate max-w-xs">{invoice.paymentLink}</span>
                  <button onClick={copyPaymentLink} className="ml-2 text-gray-400 hover:text-gray-600">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className="ml-2 text-gray-500 italic">Not Generated Yet</span>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Invoice Items</h2>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Name
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoice.invoiceItems.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.serviceName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                        ${item.servicePrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-indigo-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-800">Total</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-800 text-right">
                      ${invoice.total.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => navigate("/invoices")}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Invoices
            </button>
            {!invoice.paymentLink && (
              <button
                onClick={handleCreatePaymentLink}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Create Payment Link
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceDetail

