/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './lib/firebase';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Itineraries } from './components/Itineraries';
import { Blog } from './components/Blog';
import { About } from './components/About';
import { Footer } from './components/Footer';
import { Admin } from './Admin';
import { BlogPost } from './components/BlogPost';
import { itineraries as mockItineraries } from './data';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MainSite() {

  const [activeState, setActiveState] = useState("All States");
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);

  const sortItemsByOrder = (items: any[]) => {
    return [...items].sort((a, b) => {
      const orderA = a.order !== undefined && a.order !== null && !isNaN(Number(a.order)) ? Number(a.order) : 999999;
      const orderB = b.order !== undefined && b.order !== null && !isNaN(Number(b.order)) ? Number(b.order) : 999999;
      if (orderA !== orderB) return orderA - orderB;
      return 0;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itinsSnapshot = await getDocs(collection(db, 'itineraries'));
        const itinsList = itinsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItineraries(sortItemsByOrder(itinsList));
        
        const blogsSnapshot = await getDocs(collection(db, 'blogs'));
        const blogsList = blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBlogs(sortItemsByOrder(blogsList));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#0F172A] font-sans selection:bg-[#134E4A]/20 selection:text-[#134E4A] scroll-smooth">
      <Navigation />
      <main>
        <Hero activeState={activeState} setActiveState={setActiveState} />
        <Itineraries activeState={activeState} setActiveState={setActiveState} itinerariesData={itineraries} />
        <Blog blogData={blogs} />
        <About />
      </main>
      <Footer />
      
      {/* Admin Link Floating Button for easy access */}
      <Link to="/admin" className="fixed bottom-4 left-4 bg-[#134E4A] text-white p-3 rounded-full shadow-lg hover:bg-emerald-800 transition-colors z-50">
        Admin
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/blog/:id" element={<BlogPost />} />
      </Routes>
    </BrowserRouter>
  );
}
