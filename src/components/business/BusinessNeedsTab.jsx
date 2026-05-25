import React, { useState } from 'react';
import { Printer, Edit3, Image as ImageIcon, QrCode, Sparkles, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../../lib/supabase';
import './PrintStyles.css';

export default function BusinessNeedsTab({ profile }) {
  const [activeTemplate, setActiveTemplate] = useState('card15x10');
  const [customMessage, setCustomMessage] = useState('Hey, it was great meeting you! Scan my code to stay connected.');
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'
  const [isPrinting, setIsPrinting] = useState(false);
  const [dynamicUrl, setDynamicUrl] = useState(`https://knowmi.in/p/${profile?.secure_slug || ''}?src=business`);

  const handlePrint = async () => {
    if (isPrinting) return;
    setIsPrinting(true);
    
    try {
      // 1. Generate a unique tracking token for this print batch
      const { data: token, error } = await supabase
        .from('qr_tokens')
        .insert({
          profile_id: profile?.id,
          profile_slug: profile?.secure_slug,
          label: `Printed ${activeTemplate.replace('_', ' ')}`,
          is_active: true
        })
        .select('*')
        .single();
        
      if (token && !error) {
        // 2. Update the QR code URL to use the new tracking token
        setDynamicUrl(`https://knowmi.in/q/${token.scan_token}?src=business`);
        
        // 3. Wait for React to re-render the QR code before opening the print dialog
        setTimeout(() => {
          window.print();
          setIsPrinting(false);
        }, 800);
        return;
      }
    } catch (err) {
      console.error("Failed to generate tracking token", err);
    }
    
    // Fallback if token generation fails
    window.print();
    setIsPrinting(false);
  };

  const logoUrl = '/logo-square.png';

  const themeClasses = {
    dark: 'bg-neutral-900 text-white',
    light: 'bg-white text-neutral-900',
    accent: 'bg-gradient-to-br from-orange-500 to-rose-500 text-white'
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 animate-slideUp pb-24">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Controls Sidebar */}
        <div className="w-full lg:w-[350px] space-y-6 flex-shrink-0">
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-neutral-200/50 border border-neutral-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-rose-500"></div>
            
            <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-orange-500" /> Print Studio
            </h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => setActiveTemplate('card15x10')}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${activeTemplate === 'card15x10' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-[1.02]' : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100'}`}
              >
                <span>15x10cm Card</span>
                {activeTemplate === 'card15x10' && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
              </button>
              <button 
                onClick={() => setActiveTemplate('business_card')}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${activeTemplate === 'business_card' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-[1.02]' : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100'}`}
              >
                <span>Business Card</span>
                {activeTemplate === 'business_card' && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
              </button>
              <button 
                onClick={() => setActiveTemplate('sticker')}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${activeTemplate === 'sticker' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-[1.02]' : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100'}`}
              >
                <span>Circle Sticker</span>
                {activeTemplate === 'sticker' && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-neutral-200/50 border border-neutral-100">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
              <ImageIcon size={14} /> Theme Selector
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setTheme('dark')}
                className={`h-10 rounded-xl bg-neutral-900 transition-all ${theme === 'dark' ? 'ring-2 ring-orange-500 ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                title="Dark Mode"
              />
              <button 
                onClick={() => setTheme('light')}
                className={`h-10 rounded-xl bg-neutral-100 border border-neutral-200 transition-all ${theme === 'light' ? 'ring-2 ring-orange-500 ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                title="Light Mode"
              />
              <button 
                onClick={() => setTheme('accent')}
                className={`h-10 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 transition-all ${theme === 'accent' ? 'ring-2 ring-orange-500 ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                title="Gradient Mode"
              />
            </div>
          </div>

          {activeTemplate === 'card15x10' && (
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-neutral-200/50 border border-neutral-100">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-3 flex items-center gap-1.5">
                <Edit3 size={14} /> Custom Message
              </label>
              <textarea 
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-sm font-medium outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none h-32 transition-all"
                placeholder="Type your message here..."
              />
            </div>
          )}

          <button 
            onClick={handlePrint}
            disabled={isPrinting}
            className="w-full bg-neutral-900 hover:bg-black text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-xl shadow-black/20 transition-all active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:active:scale-100"
          >
            {isPrinting ? <Loader2 size={18} className="animate-spin" /> : <Printer size={18} className="group-hover:-translate-y-1 transition-transform" />}
            {isPrinting ? 'Activating Tracker...' : 'Print & Activate'}
          </button>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-neutral-100 rounded-[40px] p-4 sm:p-12 flex items-center justify-center overflow-hidden border border-neutral-200 relative min-h-[500px] print-preview-container shadow-inner">
          <div className="absolute top-6 left-6 flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live Render
          </div>

          <div id="printable-area" className="flex items-center justify-center w-full h-full transform transition-all duration-500 hover:scale-[1.02]">
            
            {/* 15x10cm Card Template */}
            {activeTemplate === 'card15x10' && (
              <div 
                className={`print-15x10 relative overflow-hidden shadow-2xl rounded-2xl transition-all duration-500 ${themeClasses[theme]}`} 
                style={{ width: '150mm', height: '100mm' }}
              >
                {/* Decorative background elements */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl mix-blend-overlay"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl mix-blend-overlay"></div>
                
                <div className="p-10 h-full flex flex-col relative z-10">
                  <div className="flex justify-between items-start mb-auto">
                    <img src={logoUrl} alt="KnoWMi Logo" className="h-12 w-12 object-cover rounded-xl shadow-md bg-white p-1" onError={(e) => e.target.style.display = 'none'} />
                    <div className="text-right">
                      <h2 className="text-2xl font-black tracking-tight">{profile?.first_name} {profile?.last_name}</h2>
                      <p className={`text-xs font-black uppercase tracking-widest mt-1 ${theme === 'dark' ? 'text-orange-400' : (theme === 'accent' ? 'text-white/80' : 'text-orange-500')}`}>
                        {profile?.designation || profile?.tier || 'Member'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 mt-6 bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg">
                    <div className="bg-white p-3 rounded-2xl shadow-lg shrink-0">
                      <QRCodeSVG value={dynamicUrl} size={90} level="H" fgColor="#000000" bgColor="#FFFFFF" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium italic leading-relaxed border-l-4 pl-5 py-1 ${theme === 'accent' ? 'border-white/50 text-white' : 'border-orange-500'}`}>
                        "{customMessage}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Business Card Template */}
            {activeTemplate === 'business_card' && (
              <div 
                className={`print-business-card relative overflow-hidden shadow-2xl rounded-xl flex transition-all duration-500 ${themeClasses[theme]}`} 
                style={{ width: '85mm', height: '55mm' }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,_currentColor_1px,_transparent_0)] [background-size:16px_16px]"></div>
                
                <div className={`w-[60%] p-6 flex flex-col justify-center relative z-10 border-r ${theme === 'light' ? 'border-neutral-200' : 'border-white/10'}`}>
                  <img src={logoUrl} alt="KnoWMi" className="h-8 w-8 object-cover rounded-lg bg-white p-1 mb-4 shadow-sm" onError={(e) => e.target.style.display = 'none'} />
                  <h2 className="text-lg font-black tracking-tight leading-none mb-1">{profile?.first_name}</h2>
                  <h2 className="text-lg font-black tracking-tight leading-none mb-2">{profile?.last_name}</h2>
                  <p className={`text-[8px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-orange-400' : (theme === 'accent' ? 'text-white/80' : 'text-orange-500')}`}>
                    {profile?.designation || 'KnoWMi Member'}
                  </p>
                </div>
                <div className={`w-[40%] p-4 flex flex-col items-center justify-center relative z-10 ${theme === 'light' ? 'bg-neutral-50' : 'bg-black/20'}`}>
                  <div className="bg-white p-2 rounded-xl shadow-xl">
                    <QRCodeSVG value={dynamicUrl} size={65} level="M" fgColor="#000000" bgColor="#FFFFFF" />
                  </div>
                  <p className="text-[6px] font-black uppercase tracking-widest mt-3 opacity-60">Scan to Connect</p>
                </div>
              </div>
            )}

            {/* Sticker Template */}
            {activeTemplate === 'sticker' && (
              <div 
                className={`print-sticker shadow-2xl relative overflow-hidden flex flex-col items-center justify-center transition-all duration-500 ${themeClasses[theme]}`} 
                style={{ width: '50mm', height: '50mm', borderRadius: '50%' }}
              >
                <div className={`absolute inset-0 border-[6px] rounded-full pointer-events-none ${theme === 'light' ? 'border-orange-500' : 'border-white/20'}`}></div>
                
                <img src={logoUrl} alt="KnoWMi Logo" className="h-5 w-5 object-cover rounded bg-white p-0.5 absolute top-3" onError={(e) => e.target.style.display = 'none'} />
                
                <div className="bg-white p-2 rounded-xl shadow-xl mt-3">
                  <QRCodeSVG value={dynamicUrl} size={80} level="M" fgColor="#000000" bgColor="#FFFFFF" />
                </div>
                
                <p className={`text-[7px] font-black uppercase tracking-widest mt-3 ${theme === 'accent' ? 'text-white' : ''}`}>Scan me</p>
              </div>
            )}

          </div>
        </div>
        
      </div>
    </div>
  );
}
