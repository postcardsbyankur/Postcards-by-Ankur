import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { db, auth, googleProvider } from './lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { states, itineraries as mockItineraries, blogPosts as mockBlogs } from './data';
import { Plus, Trash2, LogOut, Edit2, Upload } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'postcardsbyankur');

  const res = await fetch(`https://api.cloudinary.com/v1_1/fhyotvjh/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload to Cloudinary');
  }

  const data = await res.json();
  return data.secure_url;
};

export function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [showUnauthorizedPopup, setShowUnauthorizedPopup] = useState(false);
  const [activeTab, setActiveTab] = useState<'itineraries' | 'blogs' | 'subscribers'>('itineraries');
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && (user.email === 'postcardsbyankur@gmail.com' || user.email === 'akshaysinhs12@gmail.com')) {
        setUser(user);
        fetchData();
      } else if (user) {
        signOut(auth);
        setUser(null);
        setShowUnauthorizedPopup(true);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    const itinsSnapshot = await getDocs(collection(db, 'itineraries'));
    setItineraries(itinsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    
    const blogsSnapshot = await getDocs(collection(db, 'blogs'));
    setBlogs(blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    
    const subsSnapshot = await getDocs(collection(db, 'subscribers'));
    setSubscribers(subsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => {
      const timeA = a.subscribedAt?.toMillis() || 0;
      const timeB = b.subscribedAt?.toMillis() || 0;
      return timeB - timeA;
    }));
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const seedData = async () => {
    for (const itin of mockItineraries) {
      await addDoc(collection(db, 'itineraries'), itin);
    }
    for (const blog of mockBlogs) {
      await addDoc(collection(db, 'blogs'), blog);
    }
    fetchData();
    alert('Data seeded successfully!');
  };

  const handleDelete = async (collectionName: string, id: string) => {
    await deleteDoc(doc(db, collectionName, id));
    fetchData();
  };

  // Simple form state for new item
  const [newItem, setNewItem] = useState<any>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingQuill, setIsUploadingQuill] = useState(false);
  
  const quillRef = useRef<any>(null);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (file) {
        setIsUploadingQuill(true);
        try {
          const url = await uploadToCloudinary(file);
          
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range?.index || quill.getLength(), 'image', url);
          }
        } catch (error: any) {
          console.error("Error uploading image:", error);
          alert(`Failed to upload image. ${error.message}`);
        } finally {
          setIsUploadingQuill(false);
        }
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  const handleAddDestination = () => {
    const currentDestinations = newItem.destinations || [];
    setNewItem({
      ...newItem,
      destinations: [...currentDestinations, { day: '', title: '', description: '', image: '' }]
    });
  };

  const handleUpdateDestination = (index: number, field: string, value: string) => {
    const currentDestinations = [...(newItem.destinations || [])];
    currentDestinations[index] = { ...currentDestinations[index], [field]: value };
    setNewItem({ ...newItem, destinations: currentDestinations });
  };

  const handleRemoveDestination = (index: number) => {
    const currentDestinations = [...(newItem.destinations || [])];
    currentDestinations.splice(index, 1);
    setNewItem({ ...newItem, destinations: currentDestinations });
  };

  const handleDestinationImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      handleUpdateDestination(index, 'image', url);
    } catch (error: any) {
      console.error("Error uploading destination image:", error);
      alert(`Failed to upload image. ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateDoc(doc(db, activeTab, editingId), newItem);
      setEditingId(null);
    } else {
      await addDoc(collection(db, activeTab), newItem);
    }
    setNewItem({});
    fetchData();
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setNewItem(item);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewItem({});
  };

  const handleImageUpload = async (e: any) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setNewItem({ ...newItem, image: url });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      alert(`Failed to upload image. ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative">
        <div className="absolute top-8 left-8">
          <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50">
            Back to Website
          </Link>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-[#0F172A]">Admin Access</h2>
          <p className="text-gray-600 mb-8">Please sign in to manage your blogs and itineraries.</p>
          <button 
            onClick={handleLogin}
            className="w-full bg-[#134E4A] text-white py-3 rounded-xl font-bold hover:bg-emerald-800 transition-colors"
          >
            Sign In with Google
          </button>
        </div>

        {showUnauthorizedPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h3>
              <p className="text-gray-600 mb-6">Only admins allowed</p>
              <button 
                onClick={() => setShowUnauthorizedPopup(false)}
                className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50">
              Back to Website
            </Link>
            <h1 className="text-3xl font-bold text-[#0F172A]">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">Signed in as {user.email}</span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('itineraries')}
            className={`px-6 py-2 rounded-xl font-bold ${activeTab === 'itineraries' ? 'bg-[#134E4A] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            Manage Itineraries
          </button>
          <button 
            onClick={() => setActiveTab('blogs')}
            className={`px-6 py-2 rounded-xl font-bold ${activeTab === 'blogs' ? 'bg-[#134E4A] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            Manage Blogs
          </button>
          <button 
            onClick={() => setActiveTab('subscribers')}
            className={`px-6 py-2 rounded-xl font-bold ${activeTab === 'subscribers' ? 'bg-[#134E4A] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            Subscribers
          </button>
          {itineraries.length === 0 && blogs.length === 0 && (
            <button 
              onClick={seedData}
              className="px-6 py-2 bg-[#EA580C] text-white rounded-xl font-bold ml-auto"
            >
              Seed Initial Data
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={activeTab === 'subscribers' ? "lg:col-span-3" : "lg:col-span-2"}>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#0F172A] capitalize">
                  {activeTab === 'subscribers' ? 'Newsletter Subscribers' : `Existing ${activeTab}`}
                </h2>
                {activeTab === 'subscribers' && (
                   <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                     {subscribers.length} Total
                   </span>
                )}
              </div>
              
              {activeTab === 'subscribers' ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm font-medium">
                        <th className="p-4 pl-6">Email Address</th>
                        <th className="p-4">Subscribed At</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {subscribers.map(sub => (
                        <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 pl-6 font-medium text-gray-900">{sub.email}</td>
                          <td className="p-4 text-gray-500">
                            {sub.subscribedAt ? new Date(sub.subscribedAt.toMillis()).toLocaleString() : 'Unknown'}
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <button 
                              onClick={() => handleDelete('subscribers', sub.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                      {subscribers.length === 0 && (
                        <tr>
                          <td colSpan={3} className="p-8 text-center text-gray-500">No subscribers yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {(activeTab === 'itineraries' ? itineraries : blogs).map(item => (
                  <li key={item.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      {item.image && <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover" />}
                      <div>
                        <h3 className="font-bold text-[#0F172A]">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.state}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(activeTab, item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
                {(activeTab === 'itineraries' ? itineraries : blogs).length === 0 && (
                  <li className="p-6 text-center text-gray-500">No {activeTab} found.</li>
                )}
              </ul>
              )}
            </div>
          </div>

          {activeTab !== 'subscribers' && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#0F172A] capitalize">
                  {editingId ? `Edit ${activeTab.slice(0, -1)}` : `Add New ${activeTab.slice(0, -1)}`}
                </h2>
                {editingId && (
                  <button onClick={handleCancelEdit} className="text-sm text-red-500 hover:underline">
                    Cancel
                  </button>
                )}
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#134E4A]"
                    value={newItem.title || ''}
                    onChange={e => setNewItem({...newItem, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                  <select 
                    required 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#134E4A] bg-white"
                    value={newItem.state || ''}
                    onChange={e => setNewItem({...newItem, state: e.target.value})}
                  >
                    <option value="">Select state...</option>
                    {states.filter(s => s !== "All States").map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL or Upload</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="url" 
                      placeholder="https://..."
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#134E4A]"
                      value={newItem.image || ''}
                      onChange={e => setNewItem({...newItem, image: e.target.value})}
                    />
                    <label 
                      className={`cursor-pointer border-2 border-dashed ${isUploading ? 'border-[#134E4A] bg-emerald-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'} p-2 rounded-xl transition-colors flex items-center justify-center shrink-0 w-24 h-11 relative overflow-hidden`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          handleImageUpload({ target: { files: e.dataTransfer.files } } as any);
                        }
                      }}
                      title="Drag and drop or click to upload"
                    >
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload} 
                        disabled={isUploading}
                      />
                      {isUploading ? (
                        <div className="w-4 h-4 border-2 border-[#134E4A] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-gray-500 font-bold">
                           <Upload className="w-3.5 h-3.5" /> Upload
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                
                {activeTab === 'itineraries' ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Duration</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 7 Days"
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#134E4A]"
                          value={newItem.duration || ''}
                          onChange={e => setNewItem({...newItem, duration: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Difficulty</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Moderate"
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#134E4A]"
                          value={newItem.difficulty || ''}
                          onChange={e => setNewItem({...newItem, difficulty: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Best Time</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Oct - May"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#134E4A]"
                        value={newItem.bestTime || ''}
                        onChange={e => setNewItem({...newItem, bestTime: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Highlights (comma separated)</label>
                      <input 
                        type="text" 
                        placeholder="Shillong, Dawki"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#134E4A]"
                        value={newItem.highlights ? newItem.highlights.join(', ') : ''}
                        onChange={e => setNewItem({...newItem, highlights: e.target.value.split(',').map((s: string) => s.trim())})}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2 mt-4">
                        <label className="block text-sm font-semibold text-gray-700">Destinations (Optional)</label>
                        <button 
                          type="button" 
                          onClick={handleAddDestination}
                          className="text-xs font-bold text-[#134E4A] hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Destination
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {(newItem.destinations || []).map((dest: any, index: number) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-3 relative">
                            <button 
                              type="button"
                              onClick={() => handleRemoveDestination(index)}
                              className="absolute top-2 right-2 text-red-500 hover:bg-red-100 p-1 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">Day (e.g. 1)</label>
                              <input 
                                type="text" 
                                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#134E4A]"
                                value={dest.day || ''}
                                onChange={e => handleUpdateDestination(index, 'day', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">Destination Name</label>
                              <input 
                                type="text" 
                                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#134E4A]"
                                value={dest.title}
                                onChange={e => handleUpdateDestination(index, 'title', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                              <textarea 
                                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#134E4A]"
                                rows={2}
                                value={dest.description}
                                onChange={e => handleUpdateDestination(index, 'description', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL or Upload</label>
                              <div className="flex gap-2 items-center">
                                <input 
                                  type="url" 
                                  className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#134E4A]"
                                  value={dest.image}
                                  onChange={e => handleUpdateDestination(index, 'image', e.target.value)}
                                />
                                <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-100 p-1.5 rounded-lg transition-colors flex items-center justify-center shrink-0">
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => handleDestinationImageUpload(index, e)} 
                                    disabled={isUploading}
                                  />
                                  <Upload className="w-4 h-4 text-gray-500" />
                                </label>
                              </div>
                              {dest.image && (
                                <img src={dest.image} alt="Preview" className="h-12 w-12 object-cover rounded mt-2 border border-gray-200" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                        <input 
                          type="text" 
                          placeholder="e.g. March 15, 2026"
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#134E4A]"
                          value={newItem.date || ''}
                          onChange={e => setNewItem({...newItem, date: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Read Time</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 5 min read"
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#134E4A]"
                          value={newItem.readTime || ''}
                          onChange={e => setNewItem({...newItem, readTime: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <label className="block text-sm font-semibold text-gray-700">Excerpt / Content</label>
                        {isUploadingQuill && <span className="text-xs text-emerald-600 font-medium animate-pulse">Uploading image...</span>}
                      </div>
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden relative">
                        {isUploadingQuill && (
                          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-[#134E4A] border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        {/* @ts-ignore */}
                        <ReactQuill 
                          {...({ref: quillRef} as any)}
                          theme="snow" 
                          value={newItem.excerpt || ''} 
                          onChange={(content) => setNewItem({...newItem, excerpt: content})}
                          modules={modules}
                          className="h-[300px] mb-12"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button 
                  type="submit"
                  disabled={isUploading}
                  className="w-full flex items-center justify-center gap-2 bg-[#134E4A] text-white py-3 rounded-xl font-bold hover:bg-emerald-800 transition-colors disabled:opacity-70"
                >
                  {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {editingId ? 'Save Changes' : `Add ${activeTab.slice(0, -1)}`}
                </button>
              </form>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
