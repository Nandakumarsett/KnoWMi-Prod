import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Share2, Download, Check, Sparkles, ShieldCheck, MessageCircle, Linkedin, Twitter, Send, Mail } from 'lucide-react';

export default function ShareBrandCardModal({ isOpen, onClose, profile, username }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !profile) return null;

  const profileName = profile.display_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.username || 'KnoWMi Creator';
  
  const isFree = profile.status === 'free' || (!profile.status && (!profile.tier || profile.tier === 'Starter' || profile.tier === 'Free')) || profile.tier === 'Free' || profile.tier === 'Starter';
  const isPaid = !isFree || profile.role === 'owner';
  
  const resolvedSlug = (
    profile.username || 
    username || 
    (isPaid ? (profile.first_name || profile.secure_slug || profile.id) : (profile.secure_slug || profile.id || profile.first_name))
  )?.toString().trim() || profile.id || 'user';

  const profileUrl = `${window.location.origin}/p/${resolvedSlug}`;
  const wmCode = (profile.wm_code || `WM-${(profile.id || '1001').slice(0, 6)}`).replace('PT-', 'WM-');
  const personaTitle = (profile.persona || 'Phygital Creator').toUpperCase();
  const tagline = profile.tagline || 'Scan Me. Know Me. • Phygital Identity Protocol';

  const whatsappCardTemplate = `⚡ *KnoWMi® Official Phygital Brand Card*
──────────────────────────
👤 *Name:* ${profileName}
🏷️ *Persona:* ${personaTitle}
🆔 *WM Code:* ${wmCode}
💬 *Tagline:* "${tagline}"

📲 *Scan / Visit Live Identity Pass:*
${profileUrl}
──────────────────────────
🔥 *Scan Me. Know Me. • KnoWMi® Phygital Protocol*`;

  const shareText = `Check out ${profileName}'s official KnoWMi Phygital Brand Card! Scan Me. Know Me.`;

  const socialPlatforms = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      bgColor: 'bg-emerald-500 hover:bg-emerald-600 text-black',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappCardTemplate)}`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      bgColor: 'bg-blue-600 hover:bg-blue-700 text-white',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      bgColor: 'bg-black hover:bg-neutral-800 text-white border border-white/20',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`⚡ Check out ${profileName}'s official KnoWMi Brand Card!`)}&url=${encodeURIComponent(profileUrl)}`
    },
    {
      name: 'Telegram',
      icon: Send,
      bgColor: 'bg-sky-500 hover:bg-sky-600 text-white',
      url: `https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(`⚡ ${profileName}'s KnoWMi Digital Brand Card`)}`
    },
    {
      name: 'Email',
      icon: Mail,
      bgColor: 'bg-neutral-800 hover:bg-neutral-700 text-white',
      url: `mailto:?subject=${encodeURIComponent(`${profileName} — KnoWMi Digital Brand Card`)}&body=${encodeURIComponent(whatsappCardTemplate)}`
    }
  ];

  const generateCardCanvasBlob = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1060;
    const ctx = canvas.getContext('2d');

    // === Premium dark gradient background ===
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1060);
    bgGrad.addColorStop(0, '#12121E');
    bgGrad.addColorStop(0.5, '#0A0A14');
    bgGrad.addColorStop(1, '#050508');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 1060);

    // === Outer card frame – clean white border ===
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 6;
    const rx = 32, ry = 32, fw = 720, fh = 980, fx = 40, fy = 40;
    // Rounded rect helper
    const roundRect = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };
    roundRect(fx, fy, fw, fh, rx);
    ctx.stroke();

    // === Top accent line – thin orange strip ===
    ctx.fillStyle = '#F97316';
    roundRect(fx, fy, fw, 8, rx);
    ctx.fill();

    // === Load KnoWMi Logo ===
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/favicon.png';
    await new Promise((res) => { logoImg.onload = res; logoImg.onerror = res; });

    // === Centered brand logo icon (replaces removed badge) ===
    if (logoImg.complete && logoImg.naturalWidth !== 0) {
      ctx.drawImage(logoImg, 376, 80, 48, 48);
    }

    // === Thin separator below logo ===
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(260, 148);
    ctx.lineTo(540, 148);
    ctx.stroke();

    // === Profile Name ===
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 38px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(profileName.toUpperCase(), 400, 190);

    // === Persona Title & WM Code ===
    ctx.fillStyle = '#F97316';
    ctx.font = 'bold 17px monospace';
    ctx.fillText(`${personaTitle}  •  ${wmCode}`, 400, 232);

    // === Tagline ===
    ctx.fillStyle = '#8A8A9A';
    ctx.font = 'italic 17px sans-serif';
    const displayTagline = tagline.length > 60 ? tagline.slice(0, 57) + '…' : tagline;
    ctx.fillText(`"${displayTagline}"`, 400, 272);

    // === Subtle divider above QR ===
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(180, 305);
    ctx.lineTo(620, 305);
    ctx.stroke();

    // === QR Container – clean rounded white box ===
    const qrBoxX = 195, qrBoxY = 325, qrBoxW = 410, qrBoxH = 410, qrR = 24;
    ctx.fillStyle = '#FFFFFF';
    roundRect(qrBoxX, qrBoxY, qrBoxW, qrBoxH, qrR);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 3;
    roundRect(qrBoxX, qrBoxY, qrBoxW, qrBoxH, qrR);
    ctx.stroke();

    // === Draw QR Code Image (centred in white box) ===
    const qrImage = new Image();
    qrImage.crossOrigin = 'anonymous';
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=340x340&data=${encodeURIComponent(profileUrl)}`;
    await new Promise((res) => { qrImage.onload = res; qrImage.onerror = res; });
    if (qrImage.complete && qrImage.naturalWidth !== 0) {
      ctx.drawImage(qrImage, 230, 360, 340, 340);
    }

    // === Logo overlay centred inside QR ===
    if (logoImg.complete && logoImg.naturalWidth !== 0) {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(400, 530, 34, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.drawImage(logoImg, 376, 506, 48, 48);
    }

    // (QR white box has no text inside – clean)

    // === Subtle divider below QR ===
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(180, 760);
    ctx.lineTo(620, 760);
    ctx.stroke();

    // === Bottom slogan: "SCAN ME. KNOW ME." ===
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCAN ME. KNOW ME.', 400, 810);

    // === Thin orange accent under slogan ===
    ctx.fillStyle = '#F97316';
    ctx.fillRect(340, 832, 120, 3);

    // === Profile URL ===
    ctx.fillStyle = '#F97316';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(profileUrl, 400, 870);

    // === Tiny bottom branding watermark ===
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.font = '600 11px sans-serif';
    ctx.fillText('KnoWMi® Phygital Identity Protocol', 400, 920);

    // === Bottom orange accent line (mirrors top) ===
    ctx.fillStyle = '#F97316';
    roundRect(fx, fy + fh - 8, fw, 8, rx);
    ctx.fill();

    return new Promise((res) => canvas.toBlob(res, 'image/png'));
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const handleNativeShare = async () => {
    try {
      const blob = await generateCardCanvasBlob();
      if (blob) {
        const file = new File([blob], `${profileName.replace(/\s+/g, '_')}_KnoWMi_Card.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${profileName} — KnoWMi Brand Card`,
            text: whatsappCardTemplate,
            files: [file]
          });
          return;
        }
      }
    } catch (err) {
      console.warn('File share failed, falling back to URL share', err);
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileName} — KnoWMi Brand Card`,
          text: whatsappCardTemplate,
          url: profileUrl
        });
      } catch (err) {
        console.warn('Share cancelled', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadCardImage = async () => {
    try {
      const blob = await generateCardCanvasBlob();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profileName.replace(/\s+/g, '_')}_KnoWMi_Brand_Card.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      console.error('Failed to generate image', e);
    }
  };

  // Escape HTML entities to prevent XSS in exported HTML card
  const escapeHtml = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const handleDownloadCard = () => {
    const safeName = escapeHtml(profileName);
    const safePersona = escapeHtml(personaTitle);
    const safeWmCode = escapeHtml(wmCode);
    const safeTagline = escapeHtml(tagline);
    const safeAvatarUrl = escapeHtml(profile.avatar_url);
    const safeProfileUrl = escapeHtml(profileUrl);

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeName} — KnoWMi Brand Card</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { background: #05050A; color: #fff; font-family: 'Inter', sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; margin: 0; }
        .card { width: 100%; max-width: 400px; background: linear-gradient(160deg, #141420 0%, #08080E 100%); border: 3px solid #FFF; border-radius: 36px; padding: 36px 28px; box-shadow: 8px 8px 0px #F97316; text-align: center; }
        .badge { background: rgba(249, 115, 22, 0.12); border: 1px solid rgba(249, 115, 22, 0.3); color: #FF9933; padding: 6px 14px; border-radius: 100px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; display: inline-block; margin-bottom: 20px; }
        .avatar { width: 90px; height: 90px; border-radius: 50%; border: 3px solid #FFF; margin: 0 auto 16px; object-fit: cover; box-shadow: 4px 4px 0px #F97316; }
        .name { font-family: 'Montserrat', sans-serif; font-size: 26px; font-weight: 900; text-transform: uppercase; margin-bottom: 4px; }
        .persona { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; color: #F97316; margin-bottom: 12px; }
        .tagline { font-size: 12px; color: #aaa; margin-bottom: 24px; font-weight: 600; }
        .qr-box { background: #FFF; border: 3px solid #000; border-radius: 24px; padding: 20px; box-shadow: 4px 4px 0px #000; margin-bottom: 24px; }
        .btn { display: block; width: 100%; background: #F97316; color: #000; font-weight: 900; text-decoration: none; padding: 14px; border-radius: 16px; border: 2px solid #000; text-transform: uppercase; letter-spacing: 1px; box-shadow: 3px 3px 0px #FFF; }
    </style>
</head>
<body>
    <div class="card">
        <div class="badge">✦ KnoWMi Identity ✦</div>
        ${safeAvatarUrl ? `<img src="${safeAvatarUrl}" class="avatar" alt="${safeName}">` : ''}
        <div class="name">${safeName}</div>
        <div class="persona">${safePersona} • ${safeWmCode}</div>
        <div class="tagline">"${safeTagline}"</div>
        <div class="qr-box">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(profileUrl)}" style="width: 180px; height: 180px;">
            <div style="font-size: 10px; font-weight: 900; color: #000; text-transform: uppercase; margin-top: 10px; letter-spacing: 2px;">Scan Me. Know Me.</div>
        </div>
        <a href="${safeProfileUrl}" target="_blank" class="btn">View Live Profile</a>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profileName.replace(/\s+/g, '_')}_KnoWMi_Card.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center pt-20 sm:pt-6 pb-6 px-4 select-none animate-fadeIn">
      <div className="relative w-full max-w-[440px] bg-[#0E0E16] border-[3px] border-white rounded-[32px] p-6 sm:p-8 pt-8 sm:pt-8 shadow-[10px_10px_0px_#F97316] text-white my-auto max-h-[85vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white border-2 border-black text-black font-black flex items-center justify-center shadow-[2px_2px_0px_#000] hover:bg-orange-500 transition-colors z-30"
          title="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Top Protocol Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[9px] font-black uppercase tracking-widest w-fit mb-5 mt-1 sm:mt-0">
          <Sparkles size={12} className="text-orange-500" />
          KnoWMi Share Card
        </div>

        {/* Card Body */}
        <div className="bg-[#141422] border-2 border-white/20 rounded-[28px] p-6 text-center shadow-inner relative overflow-hidden mb-6">
          
          {/* Avatar & Badges */}
          <div className="relative inline-block mb-3">
            <div className="w-20 h-20 rounded-full border-[3px] border-white shadow-[4px_4px_0px_#F97316] overflow-hidden bg-neutral-900 mx-auto flex items-center justify-center">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profileName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-white">{profileName.charAt(0)}</span>
              )}
            </div>
            {profile.is_verified && (
              <div className="absolute -bottom-1 -right-1 bg-orange-500 text-black rounded-full p-1 border-2 border-black" title="Founding Member">
                <ShieldCheck size={14} />
              </div>
            )}
          </div>

          <h3 className="font-display font-black text-xl text-white tracking-tight leading-tight uppercase mb-1">
            {profileName}
          </h3>

          <p className="text-[10px] font-black text-orange-400 uppercase tracking-luxury mb-3">
            {personaTitle} • <span className="font-mono text-white/80">{wmCode}</span>
          </p>

          <p className="text-xs text-neutral-400 font-bold leading-relaxed mb-5 px-2 line-clamp-2">
            "{tagline}"
          </p>

          {/* Integrated High-Res QR Code */}
          <div className="bg-white p-3.5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] inline-block mb-3">
            <QRCodeSVG
              value={profileUrl}
              size={135}
              level="H"
              includeMargin={false}
              imageSettings={{
                src: "/favicon.png",
                x: undefined,
                y: undefined,
                height: 28,
                width: 28,
                excavate: true,
              }}
            />
            <p className="text-[9px] font-black text-black uppercase tracking-widest mt-1.5 flex items-center justify-center gap-1">
              <img src="/favicon.png" className="w-3 h-3 inline-block" alt="KnoWMi" /> Scan Me. Know Me.
            </p>
          </div>

          <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">
            AUTHENTIC PHYGITAL CARD
          </p>
        </div>

        {/* Social Apps Row */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-1.5">
            <Share2 size={12} className="text-orange-500" /> Share via Social Apps
          </p>
          <div className="grid grid-cols-5 gap-2">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all shadow-[2px_2px_0px_#000] hover:scale-105 active:scale-95 ${platform.bgColor}`}
                  title={`Share on ${platform.name}`}
                >
                  <Icon size={20} />
                  <span className="text-[8px] font-black uppercase tracking-wider mt-1.5 truncate max-w-full">
                    {platform.name.split(' ')[0]}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 py-3.5 px-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
          >
            {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>

          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 py-3.5 px-4 bg-orange-500 text-black font-black text-xs uppercase tracking-widest rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
          >
            <Share2 size={16} />
            Share Image & Link
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={handleDownloadCardImage}
            className="flex items-center justify-center gap-1.5 py-3 px-3 bg-neutral-900 text-orange-400 font-black text-[10px] uppercase tracking-wider rounded-xl border border-orange-500/40 hover:bg-neutral-800 transition-colors"
          >
            <Download size={14} />
            Download Image (PNG)
          </button>

          <button
            onClick={handleDownloadCard}
            className="flex items-center justify-center gap-1.5 py-3 px-3 bg-[#1a1a1a] text-neutral-300 font-black text-[10px] uppercase tracking-wider rounded-xl border border-white/20 hover:text-white hover:border-white transition-colors"
          >
            <Download size={14} />
            Export HTML Card
          </button>
        </div>

      </div>
    </div>
  );
}
