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
      <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex flex-col gap-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-neutral-800">1. Select Customer</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <input 
            type="text" 
            placeholder="Search Name or WM code..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 outline-none focus:border-orange-500 transition-all text-xs"
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
                className={`p-3.5 rounded-xl text-left border flex flex-col gap-1.5 transition-all hover:bg-orange-50/30 ${selectedUser?.id === u.id ? 'bg-orange-50 border-orange-200 ring-2 ring-orange-500/20' : 'bg-white border-neutral-100'}`}
              >
                <span className="font-bold text-neutral-900 text-sm leading-none">{u.first_name || 'Unknown'}</span>
                <div className="flex justify-between items-center w-full">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">{(u.wm_code || 'WM-NEW-000').replace('PT-', 'WM-')}</span>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${u.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-50 text-neutral-400'}`}>{u.status || 'free'}</span>
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
        {!selectedUser ? (
          <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-4 h-full">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-300">
              <QrCode size={32} />
            </div>
            <div>
              <p className="text-sm font-black text-neutral-700 uppercase tracking-wider mb-1">Owner Admin QR Studio</p>
              <p className="text-xs text-neutral-400 font-medium">Select a customer profile on the left to enter their dedicated QR Studio, generate, and print phygital codes on T-shirts.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-orange-500 tracking-wider">Active Workspace</p>
                <h3 className="text-lg font-black text-neutral-900 leading-tight">{selectedUser.first_name}'s QR Builder</h3>
                <p className="text-xs font-bold text-neutral-400 uppercase mt-1">{(selectedUser.wm_code || 'WM-NEW-000').replace('PT-', 'WM-')} · {selectedUser.status} Status</p>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-bold transition-all"
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
                <pre className="p-3.5 bg-white border border-amber-100 rounded-xl text-xs font-mono text-amber-900 select-all overflow-x-auto">
{`CREATE POLICY "Owners manage all tokens" ON public.qr_tokens FOR ALL
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'owner'));`}
                </pre>
              </div>
            )}

            {/* Create Tracking Token */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm relative overflow-hidden">
              <h3 className="text-sm font-black uppercase tracking-wider text-neutral-800 mb-4">Generate T-Shirt Token</h3>
              <form onSubmit={handleCreateToken} className="flex flex-col md:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="e.g. Signature Tee - L - May Batch" 
                  className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
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
                <div className="text-center py-10 bg-white rounded-2xl border border-neutral-100 text-xs font-bold uppercase tracking-wider text-neutral-400">Loading Tokens...</div>
              ) : tokens.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-neutral-200">
                  <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-3 text-neutral-300">
                    <QrCode size={24} />
                  </div>
                  <p className="text-xs font-black text-neutral-400 uppercase tracking-wider">No tokens exist for this user yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {tokens.map(token => (
                    <div key={token.id} className="bg-white rounded-2xl p-5 border border-neutral-100 hover:border-orange-500/20 transition-all shadow-sm">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1 space-y-4 w-full">
                          <div className="flex items-center justify-between md:justify-start gap-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-2.5 h-2.5 rounded-full ${token.is_active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-neutral-300'}`} />
                              <h4 className="font-black text-neutral-900 tracking-tight text-sm">{token.label || 'Unnamed Token'}</h4>
                            </div>
                            <span className="text-[9px] font-black text-neutral-300 font-mono bg-neutral-50 px-2 py-0.5 rounded-md">ID: {token.scan_token.slice(0, 8)}</span>
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
                          <div className="p-3 bg-white rounded-xl border border-neutral-100 flex items-center justify-center relative">
                            <QRCodeSVG 
                              id={`qr-${token.id}`}
                              value={`${window.location.origin}/q/${token.scan_token}`}
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
                              className="w-full bg-orange-500 text-white h-10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black tracking-widest uppercase hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
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
