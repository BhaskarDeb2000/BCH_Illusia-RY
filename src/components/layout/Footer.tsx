
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-illusia-purple-900 text-white mt-auto py-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Illusia Storage</h3>
            <p className="text-gray-300 text-sm">
              Illusia's inventory management system for event and game equipment.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Links</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/" className="hover:text-illusia-purple transition-colors">
                Home
              </Link>
              <Link to="/items" className="hover:text-illusia-purple transition-colors">
                Items
              </Link>
              <Link to="/about" className="hover:text-illusia-purple transition-colors">
                About
              </Link>
              <Link to="/login" className="hover:text-illusia-purple transition-colors">
                Login
              </Link>
              <Link to="/register" className="hover:text-illusia-purple transition-colors">
                Register
              </Link>
            </nav>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <div className="text-sm text-gray-300 space-y-2">
              <p>Illusia ry</p>
              <p>info@illusia.fi</p>
              <p><a href="https://illusia.fi" target="_blank" rel="noopener noreferrer" className="hover:text-illusia-purple transition-colors">
                illusia.fi
              </a></p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>
            © {currentYear} Illusia ry. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
