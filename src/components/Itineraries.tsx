import React, { useState, Fragment } from 'react';
import { Clock, MapPin, Star, ArrowRight, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { states } from '../data';

interface ItinerariesProps {
  activeState: string;
  setActiveState?: (state: string) => void;
  itinerariesData: any[];
}

export function Itineraries({ activeState, setActiveState, itinerariesData }: ItinerariesProps) {
  const [selectedItin, setSelectedItin] = useState<any | null>(null);

  const filtered = activeState === "All States" 
    ? itinerariesData 
    : itinerariesData.filter(it => it.state === activeState);

  return (
    <section id="itineraries" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-2">Curated Itineraries</h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Handcrafted journeys designed to immerse you in the raw beauty and culture of the region.
            </p>
          </div>
          {setActiveState && (
            <div className="flex flex-wrap gap-2">
              <select
                value={activeState}
                onChange={(e) => setActiveState(e.target.value)}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-white border border-gray-200 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#134E4A] focus:border-transparent transition-all cursor-pointer"
              >
                <option value="All States">All States</option>
                {Array.from(new Set(itinerariesData.map(it => it.state))).filter(Boolean).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence>
            {filtered.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                onClick={() => setSelectedItin(item)}
                className="group cursor-pointer flex flex-col bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 block"
              >
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <div className="absolute top-2 left-2 z-10">
                    <span className="px-2 py-0.5 bg-white/95 backdrop-blur-sm text-[#134E4A] text-[10px] font-bold rounded-lg border border-gray-100 uppercase">
                      {item.state}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 z-10 md:hidden">
                    <span className="px-2 py-0.5 bg-[#EA580C] text-white text-[10px] font-bold rounded-lg uppercase">
                      {item.duration}
                    </span>
                  </div>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                
                <div className="flex flex-col flex-grow px-2 justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-3 text-xs font-medium text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {item.bestTime}
                      </span>
                      <span className="flex items-center gap-1.5 text-[#EA580C] font-bold">
                        <Star className="w-3.5 h-3.5" />
                        {item.difficulty}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A] mb-3 leading-snug group-hover:text-[#134E4A] transition-colors">
                      {item.title}
                    </h3>
                    
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {item.highlights.slice(0, 3).map(h => (
                          <span key={h} className="text-[11px] text-gray-600 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#134E4A]" />
                            {h}
                          </span>
                        ))}
                        {item.highlights.length > 3 && (
                          <span className="text-[11px] text-gray-500 font-medium px-2 py-1 bg-gray-50 rounded-md border border-gray-100 flex items-center">
                            +{item.highlights.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedItin(item)}
                    className="mt-4 w-full py-2.5 bg-gray-50 hover:bg-[#134E4A] hover:text-white text-gray-600 text-xs font-bold rounded-xl transition-all border border-gray-100 hover:border-[#134E4A]"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg">No itineraries found for this state yet. Check back soon!</p>
          </div>
        )}

        <AnimatePresence>
          {selectedItin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedItin(null)}
            >
              <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 50, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-y-auto shadow-2xl flex flex-col relative"
              >
                <div className="relative shrink-0 flex flex-col md:flex-row bg-white border-b border-gray-100 p-6 md:p-8 gap-6 md:gap-8">
                  <div className="md:w-2/5 shrink-0 relative mt-8 md:mt-0">
                    <img 
                      src={selectedItin.image} 
                      alt={selectedItin.title}
                      className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-sm"
                    />
                  </div>
                  <button 
                    onClick={() => setSelectedItin(null)}
                    className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 backdrop-blur-md rounded-full text-gray-500 transition-colors z-10"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div className="flex flex-col justify-center">
                    <span className="px-3 py-1 bg-[#EA580C]/10 text-[#EA580C] text-xs font-bold rounded-lg uppercase mb-4 inline-block self-start">
                      {selectedItin.state}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4 leading-tight">{selectedItin.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600 bg-gray-50 p-4 rounded-xl self-start">
                      <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#EA580C]" /> {selectedItin.duration}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="flex items-center gap-2"><Star className="w-4 h-4 text-[#EA580C]" /> {selectedItin.difficulty}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 md:p-8 bg-gray-50 flex-grow">
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-[#0F172A] mb-4">Trip Highlights</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItin.highlights.map((h: string) => (
                        <span key={h} className="text-sm text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 flex items-center gap-1.5 shadow-sm">
                          <MapPin className="w-4 h-4 text-[#134E4A]" />
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedItin.destinations && selectedItin.destinations.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-[#EA580C]" />
                        Destinations & Stops
                      </h3>
                      <div className="space-y-6">
                        {(() => {
                          let currentDay = '';
                          let stopCounter = 0;
                          return selectedItin.destinations.map((dest: any, idx: number) => {
                            const showDayHeader = dest.day && dest.day !== currentDay;
                            if (showDayHeader) {
                              currentDay = dest.day;
                              stopCounter = 1; // reset stop counter per day
                            } else {
                              stopCounter += 1;
                            }
                            
                            return (
                              <Fragment key={idx}>
                                {showDayHeader && (
                                  <div className="pt-4 pb-2">
                                    <h4 className="text-xl font-bold text-[#134E4A] border-b-2 border-emerald-100 pb-2 inline-block">
                                      {dest.day.toLowerCase().startsWith('day') ? dest.day : `Day ${dest.day}`}
                                    </h4>
                                  </div>
                                )}
                                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                                  {dest.image && (
                                    <div className="md:w-1/3 shrink-0">
                                      <img 
                                        src={dest.image} 
                                        alt={dest.title} 
                                        className="w-full h-48 md:h-full object-cover rounded-xl"
                                      />
                                    </div>
                                  )}
                                  <div className="md:w-2/3 flex flex-col justify-center">
                                    <div className="inline-block px-2 py-1 bg-emerald-50 text-[#134E4A] text-xs font-bold rounded mb-2 w-fit">
                                      {dest.day ? `Spot ${stopCounter}` : `Stop ${idx + 1}`}
                                    </div>
                                    <h4 className="text-lg font-bold text-[#0F172A] mb-2">{dest.title}</h4>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                      {dest.description}
                                    </p>
                                  </div>
                                </div>
                              </Fragment>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
