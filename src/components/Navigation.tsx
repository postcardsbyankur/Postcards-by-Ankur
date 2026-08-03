import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = ['Home', 'Itineraries', 'Blogs', 'About Ankur'];

  return (
    <nav className="fixed w-full z-50 bg-white border-b border-gray-200 shadow-sm h-16 flex items-center shrink-0">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center w-full">
          <Link to="/" onClick={() => window.scrollTo(0,0)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-[#134E4A] rounded-lg flex items-center justify-center text-white">
              <Compass className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[#0F172A]">
              Postcards by Ankur
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            {links.map((link) => (
              <a 
                key={link} 
                href={`#${link.toLowerCase().replace(' ', '-')}`}
                className="hover:text-[#134E4A] transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-b border-gray-100"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 shadow-lg">
              {links.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(' ', '-')}`}
                  className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-[#134E4A] hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
