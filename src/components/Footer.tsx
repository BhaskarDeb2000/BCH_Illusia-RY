
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-illusia-dark text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-roboto-slab text-xl mb-4 text-illusia-highlight2">Illusia ry</h3>
            <p className="font-lato mb-4">
              Storage booking system for game and event creators across Finland.
            </p>
          </div>
          
          <div>
            <h3 className="font-roboto-slab text-xl mb-4 text-illusia-highlight2">Quick Links</h3>
            <ul className="font-lato space-y-2">
              <li>
                <Link to="/" className="hover:text-illusia-highlight2 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/items" className="hover:text-illusia-highlight2 transition-colors">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-illusia-highlight2 transition-colors">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-roboto-slab text-xl mb-4 text-illusia-highlight2">Contact</h3>
            <ul className="font-lato space-y-2">
              <li>Email: contact@illusia.fi</li>
              <li>Helsinki, Finland</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center font-lato text-sm">
          <p>&copy; {new Date().getFullYear()} Illusia ry. All rights reserved.</p>
          <p className="mt-2">Built by Business College Helsinki Students</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
