'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Plus, Download, Trash2, Power, MapPin, Activity, 
  ChevronRight, ExternalLink, Loader2, CheckCircle2,
  QrCode, Signal, Smartphone, Users
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import TokenScanCard from '../analytics/TokenScanCard';

export default function QRManager({ initialTokens, profileId, profileSlug }) {
  const [tokens, setTokens] = useState(initialTokens);
  const [label, setLabel] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateToken = async (e) => {
    e.preventDefault();
    if (!label || isCreating) return;

    setIsCreating(true);
    try {
      const { data: token, error } = await supabase
        .from('qr_tokens')
        .insert({
          profile_id: profileId,
          profile_slug: profileSlug,
          label: label || 'New T-Shirt Token'
        })
        .select(`
          *,
          stats:qr_token_stats(*)
        `)
        .single();

      if (error) throw error;
      
      setTokens([token, ...tokens]);
      setLabel('');
    } catch (err) {
      console.error('Failed to create token:', err);
      alert('Error creating QR token. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleActive = async (tokenId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('qr_tokens')
        .update({ is_active: !currentStatus })
        .eq('id', tokenId);
      
      if (!error) {
        setTokens(tokens.map(t => t.id === tokenId ? { ...t, is_active: !currentStatus } : t));
      }
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const handleDelete = async (tokenId) => {
    if (!confirm('Are you sure? This will deactivate the QR code permanently.')) return;

    try {
      const { error } = await supabase
        .from('qr_tokens')
        .delete()
        .eq('id', tokenId);
        
      if (!error) {
        setTokens(tokens.filter(t => t.id !== tokenId));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const downloadQR = (tokenId, tokenLabel) => {
    const svg = document.getElementById(`qr-${tokenId}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 1200;
      canvas.height = 1200;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 1200, 1200);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `knowmi-qr-${tokenLabel || 'code'}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
      <div className="space-y-8">
        {/* Create Token Form */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-neutral-100 premium-shimmer overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-xl font-display font-black mb-6">Generate Tracking Token</h3>
            <form onSubmit={handleCreateToken} className="flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                placeholder="e.g. Black Oversized Tee - L - Batch 2025" 
                className="flex-1 bg-neutral-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
              />
              <button 
                type="submit" 
                disabled={isCreating}
                className="bg-neutral-900 text-white rounded-2xl px-8 py-4 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50"
              >
                {isCreating ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                Generate Code
              </button>
            </form>
            <p className="text-[10px] font-bold text-neutral-400 mt-4 uppercase tracking-[0.2em]">A unique scan identifier will be created for this specific item.</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
        </div>

        {/* Tokens List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Active Phygital Assets</h3>
            <span className="text-[10px] font-black text-neutral-200 bg-neutral-900 px-3 py-1 rounded-full">{tokens.length} TOKENS</span>
          </div>
          
          {tokens.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-neutral-100">
              <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-200">
                <QrCode size={32} />
              </div>
              <p className="text-sm font-black text-neutral-300 uppercase tracking-widest">No tracking tokens found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {tokens.map(token => (
                <div key={token.id} className="bg-white rounded-3xl p-6 border border-neutral-100 hover:border-orange-500/20 transition-all group shadow-sm hover:shadow-xl hover:shadow-orange-500/5">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                    <div className="flex-1 space-y-6 w-full">
                      <div className="flex items-center justify-between md:justify-start gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${token.is_active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-neutral-300'}`} />
                          <h4 className="font-black text-neutral-900 tracking-tight">{token.label || 'Unnamed Token'}</h4>
                        </div>
                        <span className="text-[10px] font-black text-neutral-300 font-mono bg-neutral-50 px-2 py-0.5 rounded-md">ID: {token.scan_token.slice(0, 8)}</span>
                      </div>
                      
                      <div className="bg-neutral-50/50 rounded-2xl p-4">
                        <TokenScanCard stats={token.stats?.[0] || token.stats || { total_scans: 0, unique_scans: 0, last_scanned: null, top_city: null, top_country: null }} />
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
                      <div className="p-4 bg-white rounded-2xl border border-neutral-50 shadow-inner relative flex items-center justify-center">
                        <QRCodeSVG 
                          id={`qr-${token.id}`}
                          value={`https://knowmi.in/q/${token.scan_token}`}
                          size={120}
                          level="H"
                          includeMargin={false}
                        />
                        <div className="absolute inset-0 m-auto w-7.5 h-7.5 bg-white rounded-full flex items-center justify-center shadow-lg border border-neutral-100 p-0.5 z-20 select-none overflow-hidden">
                          <img src="/favicon.png" className="w-full h-full object-contain rounded-full" alt="KnoWMi Logo" />
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <button 
                          onClick={() => downloadQR(token.id, token.label)}
                          className="w-full bg-orange-500 text-white h-11 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black tracking-widest uppercase hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                        >
                          <Download size={14} />
                          Export
                        </button>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleToggleActive(token.id, token.is_active)}
                            className={`flex-1 h-11 rounded-xl flex items-center justify-center transition-all ${token.is_active ? 'bg-neutral-900 text-white' : 'bg-emerald-50 text-emerald-600'}`}
                          >
                            <Power size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(token.id)}
                            className="flex-1 h-11 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar: Print Logic */}
      <div className="space-y-6">
        <div className="bg-neutral-900 rounded-[32px] p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-lg font-display font-black mb-6">Print Masterclass</h4>
            <div className="space-y-6">
              {[
                { title: 'Fabric Stability', desc: 'Use Level H error correction (default) for items with deep folds or stretch.', icon: Smartphone },
                { title: 'Safe Zone', desc: 'Maintain a 10% white border around the QR for high-speed camera focus.', icon: Signal },
                { title: 'Resolution', desc: 'Our export tool generates 1200px PNGs for museum-grade print quality.', icon: Activity }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                   <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <item.icon size={14} className="text-orange-500" />
                   </div>
                   <div>
                      <p className="text-[11px] font-black uppercase text-white tracking-wider mb-1">{item.title}</p>
                      <p className="text-[10px] text-neutral-400 font-bold leading-relaxed">{item.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mb-16 -mr-16" />
        </div>
        
        <div className="bg-white rounded-[32px] p-8 border border-neutral-100">
          <div className="flex items-center gap-3 mb-4">
            <Signal size={16} className="text-orange-500" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-900">Legacy Traffic</h4>
          </div>
          <p className="text-[10px] text-neutral-500 font-bold leading-relaxed">
            Direct profile links <span className="text-neutral-900 underline">/p/[id]</span> still work globally but will not appear in this studio. For per-t-shirt tracking, migrate to the new <span className="text-orange-600">/q/[token]</span> codes.
          </p>
        </div>
      </div>
    </div>
  );
}
