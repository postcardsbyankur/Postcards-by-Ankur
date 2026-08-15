import { motion } from 'motion/react';
import { states } from '../data';

interface HeroProps {
  activeState: string;
  setActiveState: (state: string) => void;
}

export function Hero({ activeState, setActiveState }: HeroProps) {
  return (
    <section id="home" className="pt-24 lg:pt-32 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-2xl overflow-hidden bg-[#134E4A] py-16 lg:py-24 shadow-sm border border-gray-100 mb-8">
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-40 z-0">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full object-cover text-emerald-300"><path fill="currentColor" d="M44.7,-76.4C58.3,-69.2,70.1,-57.4,78.2,-43.3C86.3,-29.2,90.7,-12.8,88.4,2.9C86.1,18.7,77,33.7,66.3,46.7C55.6,59.7,43.2,70.7,29.3,75.4C15.4,80.1,0,78.5,-15.8,74.5C-31.6,70.5,-47.8,64.1,-60.1,53.2C-72.4,42.3,-80.8,26.9,-84,10.6C-87.2,-5.7,-85.2,-22.8,-77.4,-37.4C-69.6,-52,-56,-64.1,-41.3,-70.8C-26.6,-77.5,-10.8,-78.8,3.5,-84.9C17.8,-91,31.1,-83.6,44.7,-76.4Z" transform="translate(100 100)" /></svg>
        </div>

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto mb-4">
              <span className="block text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-200 mb-2">
                Postcards by Ankur:
              </span>
              Discover the Unexplored Wonders of Northeast India
            </h1>
            <p className="mt-4 text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto font-medium">
              Curated itineraries and offbeat local stories by Ankur Singha.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
