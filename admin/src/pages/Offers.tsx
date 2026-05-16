import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ImagePlus, Calendar, Plus, Save, Clock, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Offers() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [endTime, setEndTime] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <PageWrapper 
      title="Create New Offer" 
      description="Publish promotions and offers to your clients looking like blog posts."
      action={
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors">
          <Save className="w-4 h-4" />
          Publish Offer
        </button>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Title & End Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">Offer Title</label>
              <input 
                type="text" 
                placeholder="e.g. Summer Mega Sale - 50% Off Laptops!" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium text-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">Short Description / Subtitle</label>
              <input 
                type="text" 
                placeholder="A brief summary showing on the card" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-lg px-4 py-2 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
             <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider flex items-center gap-2">
               <Calendar className="w-4 h-4" />
               Ends On
             </label>
             <input 
                type="datetime-local" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all [color-scheme:dark]"
              />
              <div className="mt-4 p-3 bg-emerald-900/10 border border-emerald-900/30 rounded-lg">
                <div className="flex items-center gap-2 text-emerald-500 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Status Preview</span>
                </div>
                <p className="text-xs text-neutral-400">Offer will automatically tag as "Expired" after the date selected.</p>
              </div>
          </div>
        </div>

        {/* Cover Image Upload (Blog Style) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-1 shadow-sm overflow-hidden relative group">
          {image ? (
            <div className="relative w-full h-64 md:h-80 bg-black group rounded-lg overflow-hidden">
              <img src={image} alt="Offer Cover" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                <label className="cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded font-medium text-sm transition-colors border border-neutral-600">
                   Change Image
                   <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                <button 
                  onClick={() => setImage(null)}
                  className="p-2 bg-red-900/80 text-white rounded hover:bg-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <label className="w-full h-64 border-2 border-dashed border-neutral-700 rounded-lg bg-[#0a0a0a] hover:bg-neutral-800/50 hover:border-neutral-500 transition-all cursor-pointer flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 shadow-inner">
                <ImagePlus className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white mb-1">Upload Cover Photo</p>
                <p className="text-xs text-neutral-500">Suggested size: 1200 x 600px. JPG, PNG</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          )}
        </div>

        {/* Blog / Text Box Content */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-neutral-800 bg-[#0a0a0a] flex gap-2">
            {['B', 'I', 'U'].map((style, i) => (
              <button key={i} className="w-8 h-8 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-serif font-bold text-sm transition-colors border border-neutral-700">
                {style}
              </button>
            ))}
            <div className="h-8 w-px bg-neutral-800 mx-1"></div>
            <button className="px-3 h-8 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-xs transition-colors border border-neutral-700">
              H1
            </button>
            <button className="px-3 h-8 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-xs transition-colors border border-neutral-700">
              H2
            </button>
          </div>
          <textarea 
            className="w-full h-96 bg-transparent border-none p-6 text-neutral-300 font-mono text-sm focus:outline-none resize-none leading-relaxed"
            placeholder="Write the full offer details here... Treat it like a blog post!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        
      </div>
    </PageWrapper>
  );
}
