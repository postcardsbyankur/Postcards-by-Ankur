import { useState, useEffect } from 'react';
import { Mail, ChevronLeft, ChevronRight, Instagram } from 'lucide-react';

const carouselImages = [
  "/images/Ankur_bumla.PNG",
  "/images/asas.jpeg",
  "/images/IMG_2232.PNG",
];

export function About() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);

  return (
    <section id="about-ankur" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-5/12 relative w-full max-w-lg mx-auto">
            <div className="relative w-full min-h-[350px] md:min-h-[450px] aspect-[4/3] sm:aspect-square md:aspect-[4/5] lg:aspect-[4/5] flex items-center justify-center">
              {carouselImages.map((src, idx) => {
                const diff = (idx - currentImageIndex + carouselImages.length) % carouselImages.length;
                
                let transform = '';
                let zIndex = 0;
                let opacity = 0;

                if (diff === 0) {
                  transform = 'translateX(0) scale(1)';
                  zIndex = 30;
                  opacity = 1;
                } else if (diff === 1) {
                  transform = 'translateX(45%) scale(0.85)';
                  zIndex = 20;
                  opacity = 0.5;
                } else if (diff === carouselImages.length - 1) {
                  transform = 'translateX(-45%) scale(0.85)';
                  zIndex = 20;
                  opacity = 0.5;
                } else {
                  transform = 'translateX(0) scale(0.5)';
                  zIndex = 10;
                  opacity = 0;
                }

                return (
                  <div
                    key={idx}
                    className="absolute w-[65%] h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl transition-all duration-500 ease-out cursor-pointer"
                    style={{ transform, zIndex, opacity }}
                    onClick={() => setCurrentImageIndex(idx)}
                  >
                    <img
                      src={src}
                      alt={`Slide ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent p-6 pb-4 transition-opacity duration-500 ${diff === 0 ? 'opacity-100' : 'opacity-0'}`}>
                      <h3 className="text-2xl font-bold text-white text-center">Ankur Singha</h3>
                    </div>
                  </div>
                );
              })}

              <button 
                onClick={prevImage}
                className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-md hover:bg-white text-gray-800 p-2.5 rounded-full transition-all z-40 shadow-lg"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-md hover:bg-white text-gray-800 p-2.5 rounded-full transition-all z-40 shadow-lg"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center gap-2.5 mt-8">
              {carouselImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImageIndex ? 'w-8 bg-[#134E4A]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          
          <div className="lg:w-7/12">
            <h2 className="text-sm font-bold tracking-widest text-[#134E4A] uppercase mb-4">Explorer & Storyteller</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-[#0F172A]">
              Uncovering the hidden soul of Northeast India.
            </h3>
            
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed mb-10">
              <p>
                Hi, I'm Ankur. For several years, I've been exploring misty hills, dense jungles, and vibrant local communities, discovering stories and experiences that most travelers miss.
              </p>
              <p>
                My mission is simple: to share the untold stories of this incredible region. From sipping authentic orthodox tea in Assam to trekking the living root bridges of Meghalaya, I document raw, unfiltered travel experiences.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10 pb-10 border-b border-gray-100">
              <div className="bg-[#F9FAFB] p-4 rounded-xl border border-gray-100">
                <div className="text-3xl font-bold text-[#EA580C] mb-1">16</div>
                <div className="text-xs text-gray-500 font-bold uppercase">States Explored</div>
              </div>
              <div className="bg-[#F9FAFB] p-4 rounded-xl border border-gray-100">
                <div className="text-3xl font-bold text-[#EA580C] mb-1">30+</div>
                <div className="text-xs text-gray-500 font-bold uppercase">Waterfalls</div>
              </div>
              <div className="bg-[#F9FAFB] p-4 rounded-xl border border-gray-100">
                <div className="text-3xl font-bold text-[#EA580C] mb-1">100+</div>
                <div className="text-xs text-gray-500 font-bold uppercase">Stories Shared</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=postcardsbyankur@gmail.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex justify-center items-center gap-2 bg-[#134E4A] text-white hover:bg-[#0F3F3C] px-8 py-4 rounded-xl font-bold transition-all w-fit shadow-md hover:shadow-lg"
              >
                <Mail className="w-5 h-5" />
                Reach Out Directly
              </a>
              <a 
                href="https://www.instagram.com/ankursingha_?igsh=MWluZnQxNnA1dWRvcQ%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex justify-center items-center gap-2 bg-gradient-to-tr from-[#fd5949] to-[#d6249f] text-white px-8 py-4 rounded-xl font-bold transition-all w-fit shadow-md hover:shadow-lg opacity-90 hover:opacity-100"
              >
                <Instagram className="w-5 h-5" />
                Follow on Instagram
              </a>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
