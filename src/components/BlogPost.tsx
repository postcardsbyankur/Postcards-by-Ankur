import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { Calendar, ArrowLeft } from 'lucide-react';

export function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#134E4A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-[#0F172A] mb-4">Blog Post Not Found</h1>
        <Link to="/" className="text-[#134E4A] hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#0F172A] font-sans">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#134E4A] transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-[#134E4A] text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
              {post.state}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-[#0F172A] mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span>• {post.readTime}</span>
            </div>
          </div>
          
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
            {/* Render HTML content safely using dangerouslySetInnerHTML */}
            <div 
              className="prose prose-lg max-w-none text-left prose-headings:text-[#0F172A] prose-a:text-[#EA580C] hover:prose-a:text-[#D97706] prose-img:rounded-2xl prose-img:w-full prose-img:h-auto prose-img:shadow-sm [&_p]:!whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: post.excerpt.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ') }}
            />
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
