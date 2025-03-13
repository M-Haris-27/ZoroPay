import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { User, FileText, Home, Menu, X } from "lucide-react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navItems = [
    { to: "/", icon: <User className="w-5 h-5" />, text: "Users" },
    { to: "/invoices", icon: <FileText className="w-5 h-5" />, text: "Invoices" },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-3 text-2xl font-bold text-indigo-600 hover:text-indigo-500 transition duration-300"
            >
              <Home className="w-8 h-8" />
              <span className="hidden sm:inline">InvoiceApp</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out
                  ${
                    isActive(item.to)
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                  }`}
              >
                <span className="transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                <span>{item.text}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition duration-300 ease-in-out"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="sm:hidden block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="sm:hidden block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden bg-white overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-48" : "max-h-0"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition duration-300 ease-in-out
                ${
                  isActive(item.to)
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.icon}
              <span>{item.text}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

