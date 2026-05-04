import { useState, useEffect, useRef } from 'react'

const TEE_COLORS = [
  { name: 'Midnight Black', hex: '#1a1a1a', textColor: '#fff' },
  { name: 'Arctic White', hex: '#f5f5f5', textColor: '#1a1a1a' },
  { name: 'Saffron Orange', hex: '#FF9933', textColor: '#fff' },
  { name: 'Navy Blue', hex: '#000080', textColor: '#fff' },
  { name: 'Forest Green', hex: '#138808', textColor: '#fff' },
  { name: 'Slate Grey', hex: '#6b7280', textColor: '#fff' },
  { name: 'Burgundy', hex: '#800020', textColor: '#fff' },
  { name: 'Sky Blue', hex: '#38bdf8', textColor: '#1a1a1a' },
]

const SIZES = {
  men: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  women: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
}

const PLANS = {
  starter: { name: 'Starter', basePrice: 699, desc: '1 tee, basic profile' },
  creator: { name: 'Creator', basePrice: 999, desc: 'Full profile + analytics' },
}

// Advanced SVG paths for Half & Full Sleeves (Front & Back)
const SHIRT_PATHS = {
  half: {
    front: "M62 35 L22 58 L38 105 L62 88 L62 215 L158 215 L158 88 L182 105 L198 58 L158 35 L138 12 C133 21 122 27 110 27 C98 27 87 21 82 12 Z",
    back: "M62 35 L22 58 L38 105 L62 88 L62 215 L158 215 L158 88 L182 105 L198 58 L158 35 L138 12 C133 15 122 18 110 18 C98 18 87 15 82 12 Z"
  },
  full: {
    front: "M62 35 L10 70 L25 180 L50 170 L62 88 L62 215 L158 215 L158 88 L170 170 L195 180 L210 70 L158 35 L138 12 C133 21 122 27 110 27 C98 27 87 21 82 12 Z",
    back: "M62 35 L10 70 L25 180 L50 170 L62 88 L62 215 L158 215 L158 88 L170 170 L195 180 L210 70 L158 35 L138 12 C133 15 122 18 110 18 C98 18 87 15 82 12 Z"
  }
}

function TShirtPreview({ color, sleeve, side, qrPlacement, qrSize, personaText, customImage }) {
  const path = SHIRT_PATHS[sleeve][side]

  // Translate QR Size to px
  const sizeMap = { small: 30, medium: 50, large: 80 }
  const qs = sizeMap[qrSize]

  // Placement logic relative to the SVG 220x260 grid
  // We use absolute positioning over the SVG for HTML elements (images/text)
  const isFront = side === 'front'
  
  const showQR = (isFront && qrPlacement.includes('front')) || (!isFront && qrPlacement === 'back')
  let qrStyle = {}
  if (showQR) {
    if (qrPlacement === 'front-left') qrStyle = { top: '35%', left: '65%', transform: 'translate(-50%, -50%)' }
    if (qrPlacement === 'front-center') qrStyle = { top: '45%', left: '50%', transform: 'translate(-50%, -50%)' }
    if (qrPlacement === 'back') qrStyle = { top: '35%', left: '50%', transform: 'translate(-50%, -50%)' }
  }

  return (
    <div className="relative w-full max-w-[240px] mx-auto transition-all duration-300">
      <svg viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.2))' }}>
        <defs>
          <clipPath id="shirtClip">
            <path d={path} />
          </clipPath>
        </defs>
        
        {/* Base Solid Color */}
        <path d={path} fill={color.hex} />
        
        {/* Realistic Texture Overlay */}
        <image 
          href={`/assets/tees/${side}.png`} 
          width="220" 
          height="260" 
          preserveAspectRatio="xMidYMid slice" 
          clipPath="url(#shirtClip)" 
          style={{ mixBlendMode: 'multiply', opacity: 0.9 }} 
        />
        
        {/* SVG Outline for crisp edges */}
        <path d={path} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
        {isFront && <path d="M82 12 C87 21 98 27 110 27 C122 27 133 21 138 12" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="2"/>}
      </svg>

      {/* HTML Overlays */}
      {showQR && (
        <div className="absolute flex items-center justify-center bg-white rounded shadow-sm border border-black/10" 
          style={{ ...qrStyle, width: qs, height: qs, padding: qs * 0.1 }}>
          {/* Fake QR pattern */}
          <div className="w-full h-full bg-black rounded-sm relative">
            <div className="absolute inset-[2px] bg-white rounded-sm border-2 border-black"></div>
            <div className="absolute inset-[6px] bg-black rounded-[1px]"></div>
          </div>
        </div>
      )}

      {isFront && personaText && (
        <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-[60%] text-center font-bold break-words"
          style={{ color: color.textColor, fontFamily: 'Fraunces,serif', fontSize: 'clamp(10px, 4vw, 16px)', lineHeight: 1.1, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
          {personaText}
        </div>
      )}

      {isFront && customImage && (
        <div className="absolute left-1/2 top-[70%] -translate-x-1/2 -translate-y-1/2 w-[50%] max-h-[80px] flex justify-center items-center overflow-hidden mix-blend-multiply"
          style={{ opacity: 0.9 }}>
          <img src={customImage} alt="Custom upload" className="object-contain w-full h-full" />
        </div>
      )}
    </div>
  )
}

const steps = ['Plan', 'Style', 'Personalize', 'Order']

function StepHeader({ num, label, active, done }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
        style={{ background: done ? 'var(--green-india)' : active ? 'var(--saffron)' : 'var(--border)', color: active || done ? '#fff' : 'var(--ink4)' }}>
        {done ? '✓' : num}
      </div>
      <span className="hidden md:inline" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: active ? 'var(--saffron)' : done ? 'var(--green-india)' : 'var(--ink4)' }}>
        {label}
      </span>
    </div>
  )
}

export default function Customizer({ plan = 'creator', user, onClose, onAuth }) {
  // Step 1: Plan
  const [selectedPlan, setSelectedPlan] = useState(plan)
  
  // Step 2: Style
  const [selectedColor, setSelectedColor] = useState(TEE_COLORS[0])
  const [gender, setGender] = useState('men')
  const [size, setSize] = useState('M')
  const [sleeve, setSleeve] = useState('half') // 'half' | 'full'
  const [qty, setQty] = useState(1)
  
  // Step 3: Personalize
  const [qrPlacement, setQrPlacement] = useState('front-left') // 'front-left', 'front-center', 'back'
  const [qrSize, setQrSize] = useState('medium') // 'small', 'medium', 'large'
  const [personaText, setPersonaText] = useState('')
  const [customImage, setCustomImage] = useState(null)
  const fileInputRef = useRef(null)
  
  const [step, setStep] = useState(1)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [viewSide, setViewSide] = useState('front') // 'front' | 'back'

  const planData = PLANS[selectedPlan] || PLANS.creator
  
  // Full sleeve adds ₹150
  const sleevePrice = sleeve === 'full' ? 150 : 0
  const perTeePrice = planData.basePrice + sleevePrice
  const totalPrice = perTeePrice * qty

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { alert("File too large. Max 5MB."); return }
      const url = URL.createObjectURL(file)
      setCustomImage(url)
    }
  }

  const handleWhatsApp = () => {
    if (!user) {
      onAuth()
      return
    }

    const msg = `Hi KnoWMi! I want to place a custom order.
    
📦 *Order Summary:*
• Plan: ${planData.name}
• Color: ${selectedColor.name}
• Sleeve: ${sleeve === 'full' ? 'Full Sleeve' : 'Half Sleeve'}
• Size: ${gender === 'men' ? 'Men' : 'Women'}'s ${size}
• Quantity: ${qty}

🎨 *Customization:*
• QR Placement: ${qrPlacement}
• QR Size: ${qrSize}
${personaText ? `• Persona Text: "${personaText}"\n` : ''}${customImage ? `• Note: I have a custom image to print.\n` : ''}
💰 *Total Estimate:* ₹${totalPrice.toLocaleString('en-IN')}

Please share payment and delivery details!`
    window.open(`https://wa.me/917981325397?text=${encodeURIComponent(msg)}`, '_blank')
  }

  // To let user see what they are editing
  useEffect(() => {
    if (step === 3) {
      if (qrPlacement === 'back') setViewSide('back')
      else setViewSide('front')
    }
  }, [qrPlacement, step])

  const progressPct = (step / 4) * 100

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: 'var(--paper)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--paper2)' }}>
        <div>
          <h2 style={{ fontFamily: 'Fraunces,serif', fontSize: '20px', fontWeight: 700, color: 'var(--ink)' }}>Design Studio</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)' }}>Build your personalized KnoWMi</p>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
          style={{ background: 'var(--paper)', border: '1.5px solid var(--border)', color: 'var(--muted)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--saffron)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--saffron)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--paper)'; e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
          ✕
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-6 py-3" style={{ background: 'var(--paper)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 md:gap-5">
            {steps.map((s, i) => (
              <StepHeader key={s} num={i + 1} label={s} active={step === i + 1} done={step > i + 1} />
            ))}
          </div>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', color: 'var(--saffron)' }}>{Math.round(progressPct)}%</span>
        </div>
        <div className="h-1 rounded-full" style={{ background: 'var(--border)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, var(--saffron), var(--saffron-dark))' }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 grid lg:grid-cols-[1fr_1.2fr] gap-8 items-start">

          {/* LEFT: 2D Interactive Preview */}
          <div className="lg:sticky lg:top-4 flex flex-col gap-4">
            <div className="rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden"
              style={{ background: 'var(--paper2)', border: '1.5px solid var(--border)', minHeight: '380px' }}>
              
              {/* 360 View Toggle */}
              <div className="absolute top-4 right-4 flex bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: '1px solid var(--border)', zIndex: 10 }}>
                <button onClick={() => setViewSide('front')} className="px-3 py-1.5 text-xs font-bold transition-colors"
                  style={{ background: viewSide === 'front' ? 'var(--saffron)' : 'transparent', color: viewSide === 'front' ? '#fff' : 'var(--muted)' }}>Front</button>
                <button onClick={() => setViewSide('back')} className="px-3 py-1.5 text-xs font-bold transition-colors"
                  style={{ background: viewSide === 'back' ? 'var(--saffron)' : 'transparent', color: viewSide === 'back' ? '#fff' : 'var(--muted)' }}>Back</button>
              </div>

              <TShirtPreview 
                color={selectedColor} 
                sleeve={sleeve} 
                side={viewSide}
                qrPlacement={qrPlacement}
                qrSize={qrSize}
                personaText={personaText}
                customImage={customImage}
              />
              
              <div className="mt-6 flex flex-wrap justify-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'white', border: '1px solid var(--border)' }}>
                <span className="text-[11px] font-bold" style={{ color: 'var(--ink)' }}>{selectedColor.name}</span>
                <span className="text-[11px]" style={{ color: 'var(--muted)' }}>•</span>
                <span className="text-[11px] font-bold" style={{ color: 'var(--ink)' }}>{sleeve === 'full' ? 'Full Sleeve' : 'Half Sleeve'}</span>
                <span className="text-[11px]" style={{ color: 'var(--muted)' }}>•</span>
                <span className="text-[11px] font-bold" style={{ color: 'var(--ink)' }}>Size {size}</span>
              </div>
            </div>

            {/* Price Summary */}
            <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1.5px solid var(--border)' }}>
              <div className="flex justify-between items-end">
                <div>
                  <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>Total Estimate</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Includes {planData.name} Plan {sleeve==='full'?'+ Full Sleeve':''}</p>
                </div>
                <div className="text-right">
                  <span style={{ fontFamily: 'Fraunces,serif', fontSize: '32px', fontWeight: 700, color: 'var(--saffron)' }}>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Steps configuration */}
          <div className="flex flex-col gap-6 pb-12">

            {/* STEP 1: PLAN */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h3 className="font-bold text-xl mb-4" style={{ color: 'var(--ink)' }}>Select Your Plan</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(PLANS).map(([id, p]) => (
                    <button key={id} onClick={() => setSelectedPlan(id)}
                      className="rounded-xl p-5 text-left transition-all"
                      style={{ border: `2px solid ${selectedPlan === id ? 'var(--saffron)' : 'var(--border)'}`, background: selectedPlan === id ? 'rgba(255,153,51,0.04)' : '#fff' }}>
                      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>{p.name}</div>
                      <div style={{ fontFamily: 'Fraunces,serif', fontSize: '28px', fontWeight: 700, color: selectedPlan === id ? 'var(--saffron)' : 'var(--ink)' }}>₹{p.basePrice}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: STYLE */}
            {step === 2 && (
              <div className="animate-fade-in flex flex-col gap-6">
                <h3 className="font-bold text-xl" style={{ color: 'var(--ink)' }}>Choose Your Style</h3>
                
                {/* Color */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>T-Shirt Color</p>
                  <div className="flex flex-wrap gap-3">
                    {TEE_COLORS.map(c => (
                      <button key={c.hex} onClick={() => setSelectedColor(c)}
                        className="w-10 h-10 rounded-full relative transition-transform hover:scale-110"
                        style={{ background: c.hex, border: `2px solid ${selectedColor.hex === c.hex ? 'var(--saffron)' : 'rgba(0,0,0,0.1)'}`, boxShadow: selectedColor.hex === c.hex ? '0 0 0 4px rgba(255,153,51,0.2)' : 'none' }}>
                        {selectedColor.hex === c.hex && <span className="absolute inset-0 flex items-center justify-center text-xs" style={{ color: c.textColor }}>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sleeve */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>Sleeve Type</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setSleeve('half')} className="py-3 rounded-xl text-sm font-bold transition-all"
                      style={{ border: `1.5px solid ${sleeve === 'half' ? 'var(--saffron)' : 'var(--border)'}`, background: sleeve === 'half' ? 'rgba(255,153,51,0.05)' : '#fff', color: sleeve === 'half' ? 'var(--saffron)' : 'var(--ink)' }}>Half Sleeve</button>
                    <button onClick={() => setSleeve('full')} className="py-3 rounded-xl text-sm font-bold transition-all"
                      style={{ border: `1.5px solid ${sleeve === 'full' ? 'var(--saffron)' : 'var(--border)'}`, background: sleeve === 'full' ? 'rgba(255,153,51,0.05)' : '#fff', color: sleeve === 'full' ? 'var(--saffron)' : 'var(--ink)' }}>Full Sleeve (+₹150)</button>
                  </div>
                </div>

                {/* Size & Gender */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Size</p>
                    <button onClick={() => setShowSizeGuide(true)} className="text-[10px] font-bold text-blue-600 underline">Size Guide</button>
                  </div>
                  <div className="flex gap-2 mb-3">
                    {['men', 'women'].map(g => (
                      <button key={g} onClick={() => setGender(g)} className="px-5 py-2 rounded-lg text-xs font-bold capitalize transition-colors"
                        style={{ background: gender === g ? 'var(--ink)' : 'var(--paper2)', color: gender === g ? '#fff' : 'var(--muted)' }}>{g}</button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SIZES[gender].map(s => (
                      <button key={s} onClick={() => setSize(s)} className="w-12 h-12 rounded-xl font-bold transition-all"
                        style={{ border: `1.5px solid ${size === s ? 'var(--ink)' : 'var(--border)'}`, background: size === s ? 'var(--ink)' : '#fff', color: size === s ? '#fff' : 'var(--ink)' }}>{s}</button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>Quantity</p>
                  <div className="flex items-center rounded-xl overflow-hidden w-fit" style={{ border: '1.5px solid var(--border)', background: '#fff' }}>
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-12 h-12 text-xl hover:bg-gray-50">−</button>
                    <span className="w-16 text-center font-bold font-mono">{qty}</span>
                    <button onClick={() => setQty(q => Math.min(50, q + 1))} className="w-12 h-12 text-xl hover:bg-gray-50">+</button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PERSONALIZE */}
            {step === 3 && (
              <div className="animate-fade-in flex flex-col gap-6">
                <h3 className="font-bold text-xl" style={{ color: 'var(--ink)' }}>Make It Yours</h3>
                
                {/* QR Placement */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>QR Code Placement</p>
                    <select value={qrPlacement} onChange={e => setQrPlacement(e.target.value)} className="w-full p-3 rounded-xl outline-none text-sm font-medium" style={{ border: '1.5px solid var(--border)' }}>
                      <option value="front-left">Front Left Chest</option>
                      <option value="front-center">Front Center</option>
                      <option value="back">Back Center</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>QR Code Size</p>
                    <div className="flex gap-2">
                      {['small', 'medium', 'large'].map(s => (
                        <button key={s} onClick={() => setQrSize(s)} className="flex-1 py-3 rounded-xl text-xs font-bold capitalize transition-colors"
                          style={{ border: `1.5px solid ${qrSize === s ? 'var(--saffron)' : 'var(--border)'}`, background: qrSize === s ? 'rgba(255,153,51,0.05)' : '#fff', color: qrSize === s ? 'var(--saffron)' : 'var(--muted)' }}>{s}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Persona Text */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Add Persona Title / Text</p>
                  <p className="text-[10px] text-gray-500 mb-3">Optional. E.g. "Software Engineer", "Creative Lead". Printed on the front.</p>
                  <input type="text" value={personaText} onChange={e => setPersonaText(e.target.value)} placeholder="Type your text here..."
                    className="w-full p-4 rounded-xl outline-none text-sm font-medium" style={{ border: '1.5px solid var(--border)', background: '#fff' }} maxLength={30} />
                </div>

                {/* Custom Image Upload */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Upload Custom Graphic</p>
                  <p className="text-[10px] text-gray-500 mb-3">Optional. Provide your own logo or artwork to be printed.</p>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                  <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    {customImage ? (
                      <div className="flex flex-col items-center gap-2">
                        <img src={customImage} alt="Preview" className="h-16 object-contain" />
                        <span className="text-xs text-blue-600 font-bold">Change Image</span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 font-medium">
                        <span className="text-2xl block mb-2">📸</span>
                        Click to upload image (PNG/JPG)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: ORDER */}
            {step === 4 && (
              <div className="animate-fade-in text-center p-8 rounded-2xl" style={{ background: 'rgba(255,153,51,0.05)', border: '2px solid var(--saffron)' }}>
                <div className="text-5xl mb-4">👕</div>
                <h3 className="font-bold text-2xl mb-2" style={{ color: 'var(--ink)', fontFamily: 'Fraunces,serif' }}>Your Custom Tee is Ready!</h3>
                <p className="text-sm text-gray-600 mb-8 max-w-md mx-auto">
                  Click below to send us your exact customizer choices via WhatsApp. We will manually review your design, confirm it, and process the payment.
                </p>
                <button onClick={handleWhatsApp} className="w-full max-w-sm mx-auto py-4 rounded-xl font-bold text-white flex items-center justify-center gap-3 text-lg transition-transform hover:-translate-y-1"
                  style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', boxShadow: '0 8px 24px rgba(37,211,102,0.3)' }}>
                  Submit Order on WhatsApp
                </button>
              </div>
            )}

            {/* Nav Buttons */}
            {step < 4 && (
              <div className="flex gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                {step > 1 && (
                  <button onClick={() => setStep(s => s - 1)} className="px-6 py-3 rounded-xl font-bold text-sm" style={{ border: '1.5px solid var(--border)' }}>Back</button>
                )}
                <button onClick={() => setStep(s => s + 1)} className="flex-1 py-3 rounded-xl font-bold text-sm text-white"
                  style={{ background: 'linear-gradient(135deg, var(--saffron), var(--saffron-dark))', boxShadow: '0 4px 16px rgba(255,153,51,0.3)' }}>
                  {step === 3 ? 'Review Custom Order →' : 'Continue →'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Size Guide Modal (unchanged) */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowSizeGuide(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-bold text-lg text-ink">Size Guide (Inches)</h3>
              <button onClick={() => setShowSizeGuide(false)} className="text-ink3 hover:text-ink">✕</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-ink3 font-mono text-[10px] uppercase">
                  <tr><th className="py-2 px-3">Size</th><th className="py-2 px-3">Chest</th><th className="py-2 px-3">Length</th></tr>
                </thead>
                <tbody className="font-mono text-[11px] text-ink2">
                  <tr style={{ borderTop: '1px solid var(--border)' }}><td className="py-2 px-3 font-bold">XS</td><td className="py-2 px-3">36"</td><td className="py-2 px-3">26"</td></tr>
                  <tr style={{ borderTop: '1px solid var(--border)' }}><td className="py-2 px-3 font-bold">S</td><td className="py-2 px-3">38"</td><td className="py-2 px-3">27"</td></tr>
                  <tr style={{ borderTop: '1px solid var(--border)' }}><td className="py-2 px-3 font-bold">M</td><td className="py-2 px-3">40"</td><td className="py-2 px-3">28"</td></tr>
                  <tr style={{ borderTop: '1px solid var(--border)' }}><td className="py-2 px-3 font-bold">L</td><td className="py-2 px-3">42"</td><td className="py-2 px-3">29"</td></tr>
                  <tr style={{ borderTop: '1px solid var(--border)' }}><td className="py-2 px-3 font-bold">XL</td><td className="py-2 px-3">44"</td><td className="py-2 px-3">30"</td></tr>
                  <tr style={{ borderTop: '1px solid var(--border)' }}><td className="py-2 px-3 font-bold">XXL</td><td className="py-2 px-3">46"</td><td className="py-2 px-3">31"</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-ink4 mt-4 font-mono text-center">Measurements may vary by +/- 0.5 inches.</p>
          </div>
        </div>
      )}
    </div>
  )
}
