import { Link } from "react-router-dom";
import IllusiaLogo from "../assets/logo_kaksivärinen_eitaustaa.png";

const NavBar = () => {
  return (
    <nav className="bg-illusia-light border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={IllusiaLogo}
              alt="Illusia ry Logo"
              className="h-12"
              style={{ height: "8vh" }}
            />
          </Link>
        </div>

        <div className="hidden md:flex">
          <ul className="font-lato flex gap-8 items-center">
            <li>
              <Link
                to="/"
                className="text-illusia-font hover:text-illusia-highlight1 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/items"
                className="text-illusia-font hover:text-illusia-highlight1 transition-colors"
              >
                Items
              </Link>
            </li>
            <li>
              <Link
                to="/bookings"
                className="text-illusia-font hover:text-illusia-highlight1 transition-colors"
              >
                Bookings
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="px-4 py-2 border border-illusia-highlight1 text-illusia-highlight1 rounded hover:bg-illusia-highlight1 hover:text-white transition-colors"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="px-4 py-2 bg-illusia-highlight1 text-white rounded hover:bg-opacity-90 transition-colors"
              >
                Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile menu button - would implement toggle functionality in a real app */}
        <div className="md:hidden">
          <button className="text-illusia-font p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
