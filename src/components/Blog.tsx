import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogProps {
  blogData: any[];
}

export function Blog({ blogData }: BlogProps) {
  return (
    <section id="blogs" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">Latest from the Trail</h2>
            <p className="text-lg text-gray-600">
              Stories, tips, and inspiration from my travels across the Northeast.
            </p>
          </div>
          <button className="flex items-center gap-2 text-[#EA580C] font-semibold hover:text-[#D97706] transition-colors shrink-0 group">
            View all stories
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogData.length > 0 ? (
            blogData.map((post) => (
              <Link to={`/blog/${post.id}`} key={post.id} className="group cursor-pointer flex flex-col bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 block">
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 bg-white/95 backdrop-blur-sm text-[#134E4A] text-[10px] font-bold rounded-lg border border-gray-100 uppercase">
                      {post.state}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col flex-grow px-2">
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span>• {post.readTime}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2 group-hover:text-[#EA580C] transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <div 
                    className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow [&>p]:my-0 [&>p]:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ') }}
                  />
                  
                  <div className="mt-auto">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#134E4A] uppercase group-hover:text-[#EA580C] transition-colors">
                      Read Story
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-lg font-medium text-gray-600">No stories published yet.</p>
              <p className="text-sm mt-1">Check back soon for new adventures.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
