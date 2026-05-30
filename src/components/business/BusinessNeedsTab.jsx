import React, { useState, useEffect } from 'react';
import { 
  Printer, Edit3, Image as ImageIcon, QrCode, Sparkles, Loader2, 
  Users, ShieldCheck, Link2, Settings, Plus, Trash2, Edit, Save, 
  ArrowRight, Globe, Check, AlertCircle, Phone, Heart, Award, ArrowUpRight, X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import './PrintStyles.css';

export default function BusinessNeedsTab({ profile }) {
  const [subTab, setSubTab] = useState('team'); // 'team', 'branding', 'print'
  
  // ─── Print Studio State ───
  const [activeTemplate, setActiveTemplate] = useState('card15x10');
  const [customMessage, setCustomMessage] = useState('Hey, it was great meeting you! Scan my code to stay connected.');
  const [theme, setTheme] = useState('dark'); // 'dark', 'light', 'accent'
  const [isPrinting, setIsPrinting] = useState(false);
  const [dynamicUrl, setDynamicUrl] = useState(`https://knowmi.in/p/${profile?.secure_slug || ''}?src=business`);

  // ─── Team Management State ───
  const [teamOrders, setTeamOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [teamName, setTeamName] = useState('KnoWMi Elite Squad');
  const [members, setMembers] = useState([
    { id: 1, name: 'Siddharth Mehta', role: 'Product Lead', size: 'L', color: 'Midnight Black', qrLinked: 'WM-SID-882', status: 'Active' },
    { id: 2, name: 'Neha Sharma', role: 'Lead Developer', size: 'M', color: 'Off White', qrLinked: 'WM-NEH-491', status: 'Active' },
    { id: 3, name: 'Vikram Singh', role: 'UI/UX Designer', size: 'XL', color: 'Sage Green', qrLinked: 'WM-VIK-230', status: 'Setup Pending' },
    { id: 4, name: 'Priya Iyer', role: 'Marketing Lead', size: 'S', color: 'Pista Green', qrLinked: 'WM-PRI-105', status: 'Dispatched' }
  ]);
  const [editingMember, setEditingMember] = useState(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: 'Team Member', size: 'M', color: 'Midnight Black' });

  // ─── Brand Control State ───
  const [redirectMode, setRedirectMode] = useState('brand_header'); // 'individual', 'direct_corporate', 'brand_header'
  const [redirectUrl, setRedirectUrl] = useState('https://acme.com');
  const [accentColor, setAccentColor] = useState('#F97316');
  const [tagline, setTagline] = useState('Unified Branding for Elite Creators & Squads');
  const [linkedin, setLinkedin] = useState('https://linkedin.com/company/knowmi');
  const [instagram, setInstagram] = useState('https://instagram.com/knowmi');
  const [savingBranding, setSavingBranding] = useState(false);

  // Load brand details and actual team orders from DB
  useEffect(() => {
    // 1. Load brand preferences from persona_data if available
    const brandSettings = profile?.persona_data?.team_branding;
    if (brandSettings) {
      if (brandSettings.team_name) setTeamName(brandSettings.team_name);
      if (brandSettings.redirect_mode) setRedirectMode(brandSettings.redirect_mode);
      if (brandSettings.redirect_url) setRedirectUrl(brandSettings.redirect_url);
      if (brandSettings.accent_color) setAccentColor(brandSettings.accent_color);
      if (brandSettings.tagline) setTagline(brandSettings.tagline);
      if (brandSettings.linkedin) setLinkedin(brandSettings.linkedin);
      if (brandSettings.instagram) setInstagram(brandSettings.instagram);
    }

    // 2. Fetch actual paid team orders
    const fetchTeamOrders = async () => {
      if (!profile?.id) return;
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('profile_id', profile.id)
          .eq('status', 'paid');
        
        if (!error && data && data.length > 0) {
          const parsed = [];
          data.forEach(order => {
            const details = typeof order.customer_details === 'string'
              ? JSON.parse(order.customer_details)
              : order.customer_details;
            
            if (details && details.members) {
              parsed.push({
                orderNumber: order.order_number || order.id,
                teamName: details.team_name || 'My Team',
                members: details.members
              });
            }
          });
          
          setTeamOrders(parsed);
          if (parsed.length > 0) {
            setTeamName(parsed[0].teamName);
            // Convert DB members into table structure
            const dbMembers = parsed[0].members.map((m, idx) => ({
              id: idx + 1,
              name: m.name,
              role: idx === 0 ? 'Team Lead' : 'Team Member',
              size: m.size,
              color: m.color_label || m.color || 'Midnight Black',
              qrLinked: `WM-MEM-${100 + idx}`,
              status: 'Active'
            }));
            setMembers(dbMembers);
          }
        }
      } catch (err) {
        console.error("Error loading team orders", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchTeamOrders();
  }, [profile?.id, profile?.persona_data]);

  // ─── Print studio print handler ───
  const handlePrint = async () => {
    if (isPrinting) return;
    setIsPrinting(true);
    try {
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
        setDynamicUrl(`https://knowmi.in/q/${token.scan_token}?src=business`);
        setTimeout(() => {
          window.print();
          setIsPrinting(false);
        }, 800);
        return;
      }
    } catch (err) {
      console.error("Failed to generate tracking token", err);
    }
    window.print();
    setIsPrinting(false);
  };

  // ─── Brand Control save handler ───
  const handleSaveBranding = async () => {
    setSavingBranding(true);
    try {
      const updatedPersonaData = {
        ...(profile?.persona_data || {}),
        team_branding: {
          team_name: teamName,
          redirect_mode: redirectMode,
          redirect_url: redirectUrl,
          accent_color: accentColor,
          tagline: tagline,
          linkedin: linkedin,
          instagram: instagram
        }
      };
      
      const { error } = await supabase
        .from('profiles')
        .update({ persona_data: updatedPersonaData })
        .eq('id', profile.id);
        
      if (!error) {
        toast.success('Brand control preferences updated successfully!');
      } else {
        throw error;
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update preferences: ' + err.message);
    } finally {
      setSavingBranding(false);
    }
  };

  // ─── Team actions CRUD ───
  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name.trim()) return;
    setMembers(prev => [...prev, {
      id: Date.now(),
      name: newMember.name,
      role: newMember.role,
      size: newMember.size,
      color: newMember.color,
      qrLinked: `WM-MEM-${100 + prev.length + 1}`,
      status: 'Setup Pending'
    }]);
    setNewMember({ name: '', role: 'Team Member', size: 'M', color: 'Midnight Black' });
    setIsAddMemberOpen(false);
    toast.success('Team member slot configured!');
  };

  const handleRemoveMember = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    toast.success('Member slot released.');
  };

  const handleUpdateMember = (e) => {
    e.preventDefault();
    setMembers(prev => prev.map(m => m.id === editingMember.id ? editingMember : m));
    setEditingMember(null);
    toast.success('Member profile updated.');
  };

  const logoUrl = '/logo-square.png';
  const themeClasses = {
    dark: 'bg-neutral-900 text-white',
    light: 'bg-white text-neutral-900',
    accent: 'bg-gradient-to-br from-orange-500 to-rose-500 text-white'
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 animate-slideUp pb-24 text-neutral-900">
      
      {/* Visual Sub-Tab Header Switcher */}
      <div className="flex border-b border-neutral-100 mb-8 overflow-x-auto gap-8 scrollbar-none">
        {[
          { id: 'team', label: 'Team Management', icon: Users },
          { id: 'branding', label: 'Brand Control', icon: Settings },
          { id: 'print', label: 'Print Studio', icon: Printer }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all shrink-0 flex items-center gap-2 ${
              subTab === t.id 
                ? 'border-black text-black' 
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── TAB 1: TEAM MANAGEMENT PANEL ─── */}
      {subTab === 'team' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-50 p-6 rounded-3xl border border-neutral-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-display font-black tracking-tight text-neutral-900">{teamName}</h3>
                <span className="text-[9px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Elite Squad Plan</span>
              </div>
              <p className="text-xs text-neutral-500">Unified digital identity tracking dashboard for all member smart-apparel tags.</p>
            </div>
            
            <button 
              onClick={() => setIsAddMemberOpen(true)}
              className="px-5 py-3 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 self-start md:self-center transition-all"
            >
              <Plus size={16} /> Add Member Slot
            </button>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-3xl shadow-xl shadow-neutral-100 border border-neutral-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[9px]">
                    <th className="px-6 py-4">Team Member</th>
                    <th className="px-6 py-4">Corporate Role</th>
                    <th className="px-6 py-4 text-center">Apparel Size</th>
                    <th className="px-6 py-4">Tag Colour</th>
                    <th className="px-6 py-4">Linked QR Code</th>
                    <th className="px-6 py-4">Member Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs text-neutral-600 font-semibold">
                  {members.map(member => (
                    <tr key={member.id} className="hover:bg-neutral-50/40 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-neutral-100 text-neutral-800 font-black flex items-center justify-center uppercase">
                          {member.name.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-black text-neutral-900">{member.name}</p>
                          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Apparel Active</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-neutral-100 text-neutral-800 px-2.5 py-1 text-[9px] font-black uppercase rounded">
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-black text-neutral-800">{member.size}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full border border-neutral-200" style={{ 
                            backgroundColor: member.color === 'Midnight Black' ? '#111' : (member.color === 'Sage Green' ? '#86a397' : (member.color === 'Off White' ? '#faf8f5' : '#a2b9bc')) 
                          }} />
                          <span className="text-[10px] uppercase font-bold text-neutral-500">{member.color}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-neutral-700 tracking-wider">
                        <div className="flex items-center gap-1.5">
                          <QrCode size={14} className="text-neutral-400" />
                          {member.qrLinked}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            member.status === 'Active' ? 'bg-green-500 animate-pulse' : (member.status === 'Dispatched' ? 'bg-blue-500' : 'bg-amber-500')
                          }`} />
                          <span className="text-[9px] uppercase font-bold tracking-wider">{member.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2.5">
                          <button 
                            onClick={() => setEditingMember(member)}
                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors"
                            title="Edit profile details"
                          >
                            <Edit size={13} />
                          </button>
                          <button 
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                            title="Release member slot"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: UNIFIED BRAND CONTROL ─── */}
      {subTab === 'branding' && (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Brand Configurations Form */}
          <div className="w-full lg:w-2/3 bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-neutral-100 border border-neutral-100 space-y-6">
            <div>
              <h3 className="text-xl font-display font-black tracking-tight text-neutral-900 mb-1">Unified Brand Control Panel</h3>
              <p className="text-xs text-neutral-400">Apply centralized configuration settings that govern scanning experiences across all member tags.</p>
            </div>

            {/* Redirect mode choices */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">Brand Routing Strategy</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 'individual',
                    title: 'Standard Profiles',
                    desc: 'Forward viewers to individual member personal cards.'
                  },
                  {
                    id: 'brand_header',
                    title: 'Shared Corporate Header',
                    desc: 'Load member cards with unified corporate header banners.'
                  },
                  {
                    id: 'direct_corporate',
                    title: 'Portal Direct Redirect',
                    desc: 'Bypass profiles and instantly open company redirect URL.'
                  }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setRedirectMode(mode.id)}
                    className={`p-5 rounded-2xl border text-left flex flex-col transition-all ${
                      redirectMode === mode.id 
                        ? 'border-black bg-black text-white shadow-xl shadow-black/10 scale-[1.01]' 
                        : 'border-neutral-100 bg-neutral-50/50 text-neutral-700 hover:border-neutral-200'
                    }`}
                  >
                    <span className="text-[11px] font-black uppercase tracking-wider mb-1">{mode.title}</span>
                    <span className="text-[10px] leading-relaxed opacity-70 font-semibold">{mode.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Config Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1.5">Central Redirection URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Globe size={16} />
                  </div>
                  <input
                    type="url"
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    placeholder="https://yourbrand.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all bg-neutral-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1.5">Unified Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Acme Studio"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all bg-neutral-50/50"
                />
              </div>

              {/* Accent Color picker */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1.5">Corporate Brand Accent Color</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md border border-neutral-200">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-125"
                    />
                  </div>
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    placeholder="#F97316"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-mono outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all bg-neutral-50/50"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1.5">Corporate Tagline / Shared Mission</label>
                <textarea
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  rows={2}
                  placeholder="e.g. Crafting premium physical products embedded with cryptographic identity tokens."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all bg-neutral-50/50 resize-none h-20"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1.5">LinkedIn Handle</label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/company/..."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all bg-neutral-50/50"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1.5">Instagram Handle</label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all bg-neutral-50/50"
                />
              </div>
            </div>

            <button
              onClick={handleSaveBranding}
              disabled={savingBranding}
              className="w-full bg-neutral-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest py-4.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {savingBranding ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {savingBranding ? 'Saving Settings...' : 'Save Brand Settings'}
            </button>
          </div>

          {/* live Brand Preview Mockup */}
          <div className="w-full lg:w-1/3 flex flex-col items-center">
            <div className="w-full max-w-[280px] bg-black rounded-[44px] p-3 shadow-2xl relative border-4 border-neutral-800 overflow-hidden aspect-[9/18]">
              {/* Phone Speaker */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-2xl z-50 flex items-center justify-center">
                <div className="w-8 h-1 bg-neutral-800 rounded-full mb-1"></div>
              </div>

              <div className="w-full h-full rounded-[36px] overflow-hidden bg-neutral-50 relative flex flex-col">
                {/* Simulated Screen Body */}
                {redirectMode === 'direct_corporate' ? (
                  <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                    <Globe size={36} className="text-neutral-400 mb-3 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Scan Redirect Active</p>
                    <p className="text-xs font-bold text-neutral-900 truncate max-w-xs">{redirectUrl.replace('https://', '')}</p>
                    <div className="mt-6 px-4 py-1.5 bg-neutral-200 rounded-full text-[9px] font-bold text-neutral-600 flex items-center gap-1.5">
                      Opening Website <ArrowRight size={10} />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-start relative animate-fadeIn overflow-y-auto scrollbar-none pb-6">
                    {/* Brand Banner Header for Redirect Mode Option C */}
                    {redirectMode === 'brand_header' && (
                      <div className="p-4 text-center border-b border-neutral-100 flex flex-col items-center justify-center relative overflow-hidden transition-colors" style={{ backgroundColor: accentColor }}>
                        <div className="w-7 h-7 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center mb-1">
                          <Award size={14} className="text-white" />
                        </div>
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-white">{teamName}</h4>
                        <p className="text-[8px] text-white/80 uppercase font-semibold tracking-wider mt-0.5 truncate w-full px-2">{tagline}</p>
                      </div>
                    )}

                    {/* Member details mock card */}
                    <div className="p-5 flex flex-col items-center pt-8">
                      <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center text-lg font-black text-neutral-700 mb-3">
                        SM
                      </div>
                      <h4 className="text-sm font-black text-neutral-900 leading-none">Siddharth Mehta</h4>
                      <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-1.5">Product Lead</p>

                      {/* Mock bio */}
                      <div className="mt-4 p-3 bg-white rounded-xl border border-neutral-100 text-center w-full shadow-sm">
                        <p className="text-[9px] text-neutral-500 leading-normal">Building streetwear tag systems linking physical goods to corporate profiles.</p>
                      </div>

                      {/* Member links */}
                      <div className="w-full mt-4 space-y-2">
                        <div className="flex items-center justify-between p-2 bg-neutral-100 rounded-lg text-[9px] font-bold text-neutral-700">
                          <span>Portfolio Link</span>
                          <ArrowUpRight size={11} className="text-neutral-400" />
                        </div>
                        <div className="flex items-center justify-between p-2 bg-neutral-100 rounded-lg text-[9px] font-bold text-neutral-700">
                          <span>LinkedIn Corporate</span>
                          <ArrowUpRight size={11} className="text-neutral-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-4">Scan Redirection Preview</p>
          </div>
        </div>
      )}

      {/* ─── TAB 3: PRINT STUDIO (ORIGINAL TEMPLATES) ─── */}
      {subTab === 'print' && (
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
                  <span>Laptop Sticker</span>
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

              {/* Laptop Sticker Template */}
              {activeTemplate === 'sticker' && (
                <div 
                  className="print-sticker relative flex items-center justify-center transition-all duration-500 hover:scale-[1.05] hover:rotate-1" 
                  style={{ width: '65mm', height: '65mm', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.15))' }}
                >
                  <div className="w-full h-full rounded-[32px] p-2 bg-white flex items-center justify-center relative overflow-hidden">
                    <div className={`w-full h-full rounded-[24px] flex flex-col items-center justify-center relative overflow-hidden ${themeClasses[theme]}`}>
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 2px, transparent 2px, transparent 8px)' }}></div>
                      
                      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 mt-2">
                        <div className={`px-4 py-1.5 transform -rotate-3 rounded shadow-lg mb-5 ${theme === 'light' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                          <span className="text-[14px] font-black uppercase tracking-widest">SCAN TO CONNECT</span>
                        </div>
                        
                        <div className="bg-white p-2.5 rounded-2xl shadow-xl transform rotate-2">
                          <QRCodeSVG value={dynamicUrl} size={110} level="H" fgColor="#000000" bgColor="#FFFFFF" />
                        </div>
                        
                        <div className="mt-5 flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md transform -rotate-1 border border-neutral-100">
                          <img src={logoUrl} alt="KnoWMi" className="h-4 w-4 object-cover rounded bg-neutral-100 p-0.5" onError={(e) => e.target.style.display = 'none'} />
                          <span className="text-[10px] font-black text-neutral-900 uppercase tracking-widest">{profile?.first_name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: EDIT MEMBER PROFILE ─── */}
      {editingMember && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl relative border border-neutral-100">
            <button 
              onClick={() => setEditingMember(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
            >
              <X size={16} />
            </button>
            <h3 className="text-xl font-display font-black text-neutral-900 mb-6">Edit Team Member</h3>
            
            <form onSubmit={handleUpdateMember} className="space-y-4">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={(e) => setEditingMember(m => ({ ...m, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium outline-none focus:border-black transition-all bg-neutral-50/50"
                />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5 block">Corporate Role</label>
                <input
                  type="text"
                  required
                  value={editingMember.role}
                  onChange={(e) => setEditingMember(m => ({ ...m, role: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium outline-none focus:border-black transition-all bg-neutral-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5 block">Apparel Size</label>
                  <select
                    value={editingMember.size}
                    onChange={(e) => setEditingMember(m => ({ ...m, size: e.target.value }))}
                    className="w-full px-3 py-3 rounded-xl border border-neutral-200 text-sm font-semibold outline-none focus:border-black bg-neutral-50/50"
                  >
                    {['S', 'M', 'L', 'XL', 'XXL'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5 block">Member Status</label>
                  <select
                    value={editingMember.status}
                    onChange={(e) => setEditingMember(m => ({ ...m, status: e.target.value }))}
                    className="w-full px-3 py-3 rounded-xl border border-neutral-200 text-sm font-semibold outline-none focus:border-black bg-neutral-50/50"
                  >
                    {['Active', 'Setup Pending', 'Dispatched'].map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-neutral-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest py-4.5 rounded-xl transition-all shadow-lg mt-2"
              >
                Apply Details
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: ADD MEMBER SLOT ─── */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl relative border border-neutral-100">
            <button 
              onClick={() => setIsAddMemberOpen(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
            >
              <X size={16} />
            </button>
            <h3 className="text-xl font-display font-black text-neutral-900 mb-6">Allocate Team Member Slot</h3>
            
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyanjali Sen"
                  value={newMember.name}
                  onChange={(e) => setNewMember(m => ({ ...m, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium outline-none focus:border-black transition-all bg-neutral-50/50"
                />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5 block">Corporate Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sales Specialist"
                  value={newMember.role}
                  onChange={(e) => setNewMember(m => ({ ...m, role: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium outline-none focus:border-black transition-all bg-neutral-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5 block">Apparel Size</label>
                  <select
                    value={newMember.size}
                    onChange={(e) => setNewMember(m => ({ ...m, size: e.target.value }))}
                    className="w-full px-3 py-3 rounded-xl border border-neutral-200 text-sm font-semibold outline-none focus:border-black bg-neutral-50/50"
                  >
                    {['S', 'M', 'L', 'XL', 'XXL'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5 block">Tag Colour</label>
                  <select
                    value={newMember.color}
                    onChange={(e) => setNewMember(m => ({ ...m, color: e.target.value }))}
                    className="w-full px-3 py-3 rounded-xl border border-neutral-200 text-sm font-semibold outline-none focus:border-black bg-neutral-50/50"
                  >
                    {['Midnight Black', 'Off White', 'Sage Green', 'Pista Green'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-neutral-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest py-4.5 rounded-xl transition-all shadow-lg mt-2"
              >
                Provision Member Slot
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
