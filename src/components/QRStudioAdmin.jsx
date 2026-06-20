'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Plus, Download, Trash2, Power, MapPin, Activity, 
  ChevronRight, ExternalLink, Loader2, CheckCircle2,
  QrCode, Signal, Smartphone, Users, Search
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function QRStudioAdmin() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const [tokens, setTokens] = useState([]);
  const [label, setLabel] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [fetchingTokens, setFetchingTokens] = useState(false);

  // Factory Mode State
  const [factoryMode, setFactoryMode] = useState(false);
  const [batchSize, setBatchSize] = useState(50);
  const [batchLabel, setBatchLabel] = useState('Factory Batch');
  const [generatingBatch, setGeneratingBatch] = useState(false);

  const handleGenerateFactoryBatch = async (e) => {
    e.preventDefault();
    setGeneratingBatch(true);
    try {
      const newProfiles = [];
      for (let i = 0; i < batchSize; i++) {
        newProfiles.push({
          status: 'free',
          ghost_mode: false,
          first_name: `${batchLabel} #${i+1}`,
          secure_slug: Math.random().toString(36).substring(2, 12)
        });
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .insert(newProfiles)
        .select('id');
        
      if (error) throw error;
      

      // Google Sheets Webhook Auto-Append
      const sheetsWebhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;
      if (sheetsWebhookUrl) {
        const rows = data.map(p => ({
          date: new Date().toISOString().split('T')[0],
          id: p.id,
          claimUrl: `${window.location.origin}/s/${p.id}`,
          status: "Unclaimed"
        }));
        
        await fetch(sheetsWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "no-cors",
          body: JSON.stringify({ action: "append", rows })
        }).catch(err => console.error("Google Sheets sync failed:", err));
      }
      
      alert(`Successfully generated ${batchSize} unclaimed tees!`);
      setFactoryMode(false);
    } catch (err) {
      console.error(err);
      alert('Error generating batch');
    } finally {
      setGeneratingBatch(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data } = await supabase.rpc('get_all_profiles');
    if (data) setUsers(data);
    setLoadingUsers(false);
  };

  const fetchUserTokens = async (userId, userSlug) => {
    setFetchingTokens(true);
    const { data } = await supabase
      .from('qr_tokens')
      .select('*, stats:qr_token_stats(*)')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false });

    setTokens(data || []);
    setFetchingTokens(false);
  };

  const handleSelectUser = (u) => {
    setSelectedUser(u);
    setFactoryMode(false);
    setTokens([]);
    fetchUserTokens(u.id, u.secure_slug || u.id);
  };

  const [hasRlsIssue, setHasRlsIssue] = useState(false);

  const handleCreateToken = async (e) => {
    e.preventDefault();
    if (!label || isCreating || !selectedUser) return;

    setIsCreating(true);
    setHasRlsIssue(false);
    try {
      const { data: token, error } = await supabase
        .from('qr_tokens')
        .insert({
          profile_id: selectedUser.id,
          profile_slug: selectedUser.secure_slug || selectedUser.id,
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
      setHasRlsIssue(true);
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

  const filtered = users.filter(u => 
    (u.first_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.wm_code || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 animate-fadeIn">
      {/* Search and Select User Sidebar */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/20 shadow-[2px_2px_0px_#fff] flex flex-col gap-4">
        <button 
          onClick={() => { setFactoryMode(true); setSelectedUser(null); }}
          className={`w-full py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${factoryMode ? 'bg-neutral-900 text-white shadow-[8px_8px_0px_#fff]' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}
        >
          <Users size={16} /> Factory Bulk Generator
        </button>
        <div className="h-px bg-[#2a2a2a] my-2 w-full" />
        <h3 className="text-sm font-black uppercase tracking-wider text-neutral-200">1. Select Customer</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <input 
            type="text" 
            placeholder="Search Name or WM code..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/20 outline-none focus:border-orange-500 transition-all text-xs"
          />
        </div>
        
        {loadingUsers ? (
          <div className="text-center py-8 text-xs text-neutral-400 font-bold uppercase tracking-wider">Loading Customers...</div>
        ) : (
          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
            {filtered.map(u => (
              <button
                key={u.id}
                onClick={() => handleSelectUser(u)}
                className={`p-3.5 rounded-xl text-left border flex flex-col gap-1.5 transition-all hover:bg-orange-50/30 ${selectedUser?.id === u.id ? 'bg-orange-50 border-orange-200 ring-2 ring-orange-500/20' : 'bg-[#1a1a1a] border-white/20'}`}
              >
                <span className="font-bold text-white text-sm leading-none">{u.first_name || 'Unknown'}</span>
                <div className="flex justify-between items-center w-full">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">{(u.wm_code || 'WM-NEW-000').replace('PT-', 'WM-')}</span>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${u.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-[#1a1a1a] text-neutral-400'}`}>{u.status || 'free'}</span>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center py-6 text-xs text-neutral-400">No customers found</p>
            )}
          </div>
        )}
      </div>

      {/* Admin QR Studio Generator UI */}
      <div className="flex flex-col gap-6">
        {factoryMode ? (
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/20 shadow-[2px_2px_0px_#fff] flex flex-col gap-6 animate-fadeIn h-full">
            <div>
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-4">
                <Users size={32} />
              </div>
              <h2 className="text-2xl font-black font-display text-white">Factory Bulk Generator</h2>
              <p className="text-sm text-neutral-400 font-bold mt-2">Generate blank, unclaimed physical tees. Download a CSV to provide to the factory for QR code printing. When a user scans the printed QR, they will be prompted to claim and pair the tee to their account.</p>
            </div>
            
            <form onSubmit={handleGenerateFactoryBatch} className="space-y-6 mt-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2 block">Batch Label</label>
                <input type="text" value={batchLabel} onChange={e => setBatchLabel(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/20 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 transition-all outline-none" required />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2 block">Quantity</label>
                <input type="number" min="1" max="1000" value={batchSize} onChange={e => setBatchSize(Number(e.target.value))} className="w-full bg-[#1a1a1a] border border-white/20 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 transition-all outline-none" required />
              </div>
              <button disabled={generatingBatch} type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6 py-4 font-black uppercase text-[12px] tracking-widest transition-all shadow-[6px_6px_0px_#fff] shadow-orange-500/20 disabled:opacity-50">
                {generatingBatch ? 'Generating...' : 'Generate & Download CSV'}
              </button>
            </form>
          </div>
        ) : !selectedUser ? (
          <div className="bg-[#1a1a1a] rounded-2xl p-20 text-center border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-4 h-full">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center text-neutral-300">
              <QrCode size={32} />
            </div>
            <div>
              <p className="text-sm font-black text-neutral-300 uppercase tracking-wider mb-1">Owner Admin QR Studio</p>
              <p className="text-xs text-neutral-400 font-medium">Select a customer profile on the left to enter their dedicated QR Studio, generate, and print phygital codes on T-shirts.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/20 shadow-[2px_2px_0px_#fff] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-orange-500 tracking-wider">Active Workspace</p>
                <h3 className="text-lg font-black text-white leading-tight">{selectedUser.first_name}'s QR Builder</h3>
                <p className="text-xs font-bold text-neutral-400 uppercase mt-1">{(selectedUser.wm_code || 'WM-NEW-000').replace('PT-', 'WM-')} · {selectedUser.status} Status</p>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 border border-white/20 hover:bg-[#1a1a1a] rounded-xl text-xs font-bold transition-all"
              >
                Change Customer
              </button>
            </div>

            {hasRlsIssue && (
              <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col gap-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-amber-800 font-black text-xs uppercase tracking-wider">
                  ⚠️ Row Level Security (RLS) Policy Fix Required
                </div>
                <p className="text-xs text-amber-700 font-medium">
                  The <code>qr_tokens</code> table restricts creation when performed by the Owner Admin for another user's workspace.
                  To resolve this error permanently, copy the SQL below and run it in your <strong>Supabase Dashboard &gt; SQL Editor</strong>:
                </p>
                <pre className="p-3.5 bg-[#1a1a1a] border border-amber-100 rounded-xl text-xs font-mono text-amber-900 select-all overflow-x-auto">
{`CREATE POLICY "Owners manage all tokens" ON public.qr_tokens FOR ALL
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'owner'));`}
                </pre>
              </div>
            )}

            {/* Create Tracking Token */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/20 shadow-[2px_2px_0px_#fff] relative overflow-hidden">
              <h3 className="text-sm font-black uppercase tracking-wider text-neutral-200 mb-4">Generate T-Shirt Token</h3>
              <form onSubmit={handleCreateToken} className="flex flex-col md:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="e.g. Signature Tee - L - May Batch" 
                  className="flex-1 bg-[#1a1a1a] border border-white/20 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  required
                />
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="bg-neutral-900 text-white rounded-xl px-6 py-3 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50"
                >
                  {isCreating ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                  Create Token & Generate QR
                </button>
              </form>
            </div>

            {/* Active Token Assets */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">Available QR T-Shirt Assets</h3>
                <span className="text-[10px] font-black text-neutral-100 bg-neutral-900 px-3 py-1 rounded-full">{tokens.length} TOKENS</span>
              </div>
              
              {fetchingTokens ? (
                <div className="text-center py-10 bg-[#1a1a1a] rounded-2xl border border-white/20 text-xs font-bold uppercase tracking-wider text-neutral-400">Loading Tokens...</div>
              ) : tokens.length === 0 ? (
                <div className="bg-[#1a1a1a] rounded-2xl p-12 text-center border-2 border-dashed border-white/20">
                  <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-3 text-neutral-300">
                    <QrCode size={24} />
                  </div>
                  <p className="text-xs font-black text-neutral-400 uppercase tracking-wider">No tokens exist for this user yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {tokens.map(token => (
                    <div key={token.id} className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/20 hover:border-orange-500/20 transition-all shadow-[2px_2px_0px_#fff]">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1 space-y-4 w-full">
                          <div className="flex items-center justify-between md:justify-start gap-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-2.5 h-2.5 rounded-full ${token.is_active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-neutral-300'}`} />
                              <h4 className="font-black text-white tracking-tight text-sm">{token.label || 'Unnamed Token'}</h4>
                            </div>
                            <span className="text-[9px] font-black text-neutral-300 font-mono bg-[#1a1a1a] px-2 py-0.5 rounded-md">ID: {token.scan_token.slice(0, 8)}</span>
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
                          <div className="p-3 bg-[#1a1a1a] rounded-xl border border-white/20 flex items-center justify-center relative">
                            <QRCodeSVG 
                              id={`qr-${token.id}`}
                              value={`${window.location.origin}/q/${token.scan_token}?src=tshirt`}
                              size={100}
                              level="H"
                              includeMargin={false}
                              imageSettings={{
                                src: "/favicon.png",
                                height: 24,
                                width: 24,
                                excavate: true,
                              }}
                            />
                          </div>
                          <div className="flex-1 flex flex-col gap-2">
                            <button 
                              onClick={() => downloadQR(token.id, token.label)}
                              className="w-full bg-orange-500 text-white h-10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black tracking-widest uppercase hover:bg-orange-600 transition-all shadow-[6px_6px_0px_#fff] shadow-orange-500/20"
                            >
                              <Download size={12} />
                              Export QR
                            </button>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleToggleActive(token.id, token.is_active)}
                                className={`flex-1 h-10 rounded-xl flex items-center justify-center transition-all ${token.is_active ? 'bg-neutral-900 text-white' : 'bg-emerald-50 text-emerald-600'}`}
                              >
                                <Power size={12} />
                              </button>
                              <button 
                                onClick={() => handleDelete(token.id)}
                                className="flex-1 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                              >
                                <Trash2 size={12} />
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
        )}
      </div>
    </div>
  );
}
