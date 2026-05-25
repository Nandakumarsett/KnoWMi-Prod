import React, { useState } from 'react';
import { Printer, Edit3, Image as ImageIcon } from 'lucide-react';
import './PrintStyles.css';

export default function BusinessNeedsTab({ profile }) {
  const [activeTemplate, setActiveTemplate] = useState('card15x10');
  const [customMessage, setCustomMessage] = useState('Hey, it was great meeting you! Scan my code to stay connected.');

  const handlePrint = () => {
    window.print();
  };

  const qrCodeUrl = profile?.qr_code_url || '/assets/BrandKit.png'; // Fallback to logo if no QR code yet
  const logoUrl = '/BrandKit.png';

  return (
    <div className="max-w-4xl mx-auto p-6 animate-slideUp pb-24">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Controls Sidebar */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
            <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 mb-6 flex items-center gap-2">
              <Printer size={18} className="text-orange-500" /> Print Templates
            </h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => setActiveTemplate('card15x10')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTemplate === 'card15x10' ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100'}`}
              >
                15x10cm Card
              </button>
              <button 
                onClick={() => setActiveTemplate('business_card')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTemplate === 'business_card' ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100'}`}
              >
                Business Card
              </button>
              <button 
                onClick={() => setActiveTemplate('sticker')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTemplate === 'sticker' ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100'}`}
              >
                Circle Sticker
              </button>
            </div>
          </div>

          {activeTemplate === 'card15x10' && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-3 flex items-center gap-1.5">
                <Edit3 size={14} /> Custom Message
              </label>
              <textarea 
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-sm font-medium outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none h-32"
                placeholder="Type your message here..."
              />
            </div>
          )}

          <button 
            onClick={handlePrint}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Printer size={18} /> Print Now
          </button>
        </div>

        {/* Preview Area */}
        <div className="w-full md:w-2/3 bg-neutral-100 rounded-3xl p-8 flex items-center justify-center overflow-hidden border border-neutral-200 relative min-h-[400px]">
          <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
            <ImageIcon size={14} /> Live Preview
          </div>

          <div id="printable-area" className="flex items-center justify-center w-full h-full">
            
            {/* 15x10cm Card Template */}
            {activeTemplate === 'card15x10' && (
              <div className="print-15x10 bg-white shadow-2xl relative overflow-hidden" style={{ width: '150mm', height: '100mm' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-white pointer-events-none" />
                <div className="p-8 h-full flex flex-col relative z-10">
                  <div className="flex justify-between items-start mb-auto">
                    <img src={logoUrl} alt="KnoWMi Logo" className="h-10 object-contain" onError={(e) => e.target.style.display = 'none'} />
                    <div className="text-right">
                      <h2 className="text-lg font-black tracking-tight text-neutral-900">{profile?.first_name} {profile?.last_name}</h2>
                      <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{profile?.designation || profile?.tier || 'Member'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 mt-6">
                    <div className="w-28 h-28 bg-white p-2 rounded-2xl shadow-lg border border-neutral-100 flex-shrink-0">
                      <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-700 italic leading-relaxed border-l-2 border-orange-500 pl-4">
                        "{customMessage}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Business Card Template */}
            {activeTemplate === 'business_card' && (
              <div className="print-business-card bg-neutral-900 text-white shadow-2xl relative overflow-hidden flex" style={{ width: '85mm', height: '55mm' }}>
                <div className="w-1/2 p-5 flex flex-col justify-center relative z-10 border-r border-white/10">
                  <img src={logoUrl} alt="KnoWMi" className="h-6 object-contain mb-4 opacity-90" onError={(e) => e.target.style.display = 'none'} />
                  <h2 className="text-sm font-black tracking-tight leading-tight">{profile?.first_name} <br/>{profile?.last_name}</h2>
                  <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest mt-1">{profile?.designation || 'Member'}</p>
                </div>
                <div className="w-1/2 p-5 flex items-center justify-center bg-white">
                  <div className="w-20 h-20">
                    <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            )}

            {/* Sticker Template */}
            {activeTemplate === 'sticker' && (
              <div className="print-sticker bg-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center border-4 border-orange-500" style={{ width: '50mm', height: '50mm', borderRadius: '50%' }}>
                <img src={logoUrl} alt="KnoWMi Logo" className="h-4 object-contain absolute top-4 opacity-50" onError={(e) => e.target.style.display = 'none'} />
                <div className="w-24 h-24 mt-2">
                  <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-cover" />
                </div>
                <p className="text-[7px] font-black uppercase tracking-widest text-neutral-900 mt-3">Scan to connect</p>
              </div>
            )}

          </div>
        </div>
        
      </div>
    </div>
  );
}
