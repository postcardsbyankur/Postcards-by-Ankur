import { Compass, CheckCircle2, X } from 'lucide-react';
import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'subscribers'), {
        email,
        subscribedAt: serverTimestamp(),
      });
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Failed to subscribe. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-white text-gray-500 py-16 border-t border-gray-200 relative">
      {/* Success Popup */}
      {showPopup && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#134E4A] text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#34D399]" />
          <span className="font-medium text-sm">Successfully joined the newsletter!</span>
          <button 
            onClick={() => setShowPopup(false)}
            className="ml-2 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#134E4A] rounded-lg flex items-center justify-center text-white">
                <Compass className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl text-[#0F172A] tracking-tight">
                Postcards by Ankur
              </span>
            </div>
            <p className="max-w-md text-gray-500 leading-relaxed text-sm">
              Dedicated to exploring the unexplored. Join me as we uncover the raw beauty, vibrant cultures, and hidden trails of Northeast India.
            </p>
          </div>
          
          <div>
            <h4 className="text-[#0F172A] font-bold mb-6 uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Itineraries', 'Blog', 'About Ankur'].map(link => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-sm hover:text-[#EA580C] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-[#0F172A] font-bold mb-6 uppercase tracking-wider text-xs">Newsletter</h4>
            <p className="text-sm mb-4">Get the latest stories and secret trail maps delivered to your inbox.</p>
            <form 
              className="flex gap-2"
              onSubmit={handleSubscribe}
            >
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address" 
                className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-[#134E4A] focus:ring-1 focus:ring-[#134E4A] transition-all text-sm disabled:opacity-50"
                disabled={loading}
              />
              <button 
                type="submit" 
                className="bg-[#EA580C] hover:bg-[#D97706] text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
                disabled={loading}
              >
                {loading ? '...' : 'Join'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-100 text-xs flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 font-bold uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} Postcards by Ankur. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/ankursingha_?igsh=MWluZnQxNnA1dWRvcQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:text-[#134E4A] transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
