import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import * as api from "../services/api"
import { Plus, Edit, Trash, User, Mail, Phone, Save, Search, ChevronDown } from "lucide-react"

function Users() {
  const [users, setUsers] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.getAllUsers()
      setUsers(response.data.data)
    } catch (error) {
      toast.error("Error fetching users")
    }
  }

  const handleOpen = (user = null) => {
    if (user) {
      setFormData(user)
      setSelectedUser(user)
    } else {
      setFormData({ name: "", email: "", phoneNo: "" })
      setSelectedUser(null)
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedUser(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedUser) {
        await api.updateUser(selectedUser._id, formData)
        toast.success("User updated successfully")
      } else {
        await api.createUser(formData)
        toast.success("User created successfully")
      }
      handleClose()
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error processing request")
    }
  }

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this user?")) return
    try {
      await api.deleteUser(id)
      toast.success("User deleted successfully")
      fetchUsers()
    } catch (error) {
      toast.error("Error deleting user")
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNo.includes(searchTerm),
  )

  const sortedUsers = [...filteredUsers].sort((a, b) => {
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

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
              <User className="mr-2 text-indigo-600" /> Users
            </h3>
            <button
              onClick={() => handleOpen()}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="mr-2" /> Add New User
            </button>
          </div>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              <div className="flex space-x-4">
                {["name", "email", "phoneNo"].map((field) => (
                  <button
                    key={field}
                    onClick={() => toggleSort(field)}
                    className={`flex items-center space-x-1 text-sm font-medium ${
                      sortBy === field ? "text-indigo-600" : "text-gray-500"
                    } hover:text-indigo-600 transition-colors duration-200`}
                  >
                    <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
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
            {sortedUsers.map((user) => (
              <li key={user._id} className="hover:bg-gray-50 transition duration-200">
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <div className="text-lg font-semibold text-gray-800">{user.name}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Mail className="mr-1 w-4 h-4" /> {user.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="mr-1 w-4 h-4" /> {user.phoneNo}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleOpen(user)}
                      className="text-indigo-600 hover:text-indigo-800 flex items-center transition duration-200"
                    >
                      <Edit className="mr-1 w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-800 flex items-center transition duration-200"
                    >
                      <Trash className="mr-1 w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {selectedUser ? "Edit User" : "Add New User"}
                    </h3>
                    <div className="mt-2">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phoneNo"
                            id="phoneNo"
                            value={formData.phoneNo}
                            onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            required
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition duration-200"
                >
                  <Save className="mr-2 w-4 h-4" /> {selectedUser ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users

