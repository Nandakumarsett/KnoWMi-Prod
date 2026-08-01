import{ba as Ne,bk as Ce,r as p,j as e,b7 as J,bb as h,b4 as Se}from"./vendor-DJ8AXdcW.js";import{u as Le,A as $e,s as O}from"./index-DSPiNPQs.js";import{p as G,P as ge}from"./personaConfig-CSDpeC1R.js";import{c as ze}from"./completion-score-D5PUhF_l.js";import{D as Ae,S as Pe,C as De,T as Ee}from"./CreatorForm-BO4zBw5A.js";import{g as Fe,d as _e,m as Ue,ai as Me,ao as we,am as q,U as Te,O as Ie,u as Be,o as Oe,X as Ge,y as Re}from"./vendor-icons-CWTa-WjU.js";import"./vendor-supabase-BkJ-lukb.js";import"./vendor-animation-DPn91hQ9.js";const He=`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  
  .studio-page {
    font-family: 'Inter', sans-serif;
    background-color: #0a0a0a;
    color: #ffffff;
    min-height: 100vh;
  }
  
  .font-display { font-family: 'Montserrat', sans-serif; text-transform: uppercase; }
  
  .glass-card {
    background: #1a1a1a;
    border-radius: 16px;
    box-shadow: 4px 4px 0px #fff;
    border: 2px solid #fff;
    transition: all 0.2s ease;
  }
  
  .glass-card:hover {
    box-shadow: 2px 2px 0px #fff;
    transform: translate(1px, 1px);
  }

  .input-field {
    width: 100%;
    padding: 10px 14px;
    background: #0a0a0a;
    border: 2px solid #333;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s;
    outline: none;
    color: white;
    box-shadow: 2px 2px 0px #333;
  }
  
  .input-field:focus {
    border-color: #F97316;
    background: #0a0a0a;
    box-shadow: 2px 2px 0px #F97316;
  }

  .section-label {
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #a3a3a3;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 2px solid #262626;
    padding-bottom: 4px;
  }

  .chip {
    padding: 6px 14px;
    background: #1a1a1a;
    border: 2px solid #404040;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    color: white;
    text-transform: uppercase;
    box-shadow: 2px 2px 0px #404040;
  }

  .chip:hover {
    transform: translate(1px, 1px);
    box-shadow: none;
  }

  .chip.active {
    background: #F97316;
    color: black;
    border-color: #000;
    box-shadow: 2px 2px 0px #000;
  }

  .progress-ring {
    transition: stroke-dashoffset 0.8s ease-in-out;
  }

  .animate-float-preview {
    animation: float 4s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translate(-50%, 0); }
    50% { transform: translate(-50%, -10px); }
  }

  .sticky-insight {
    position: fixed;
    bottom: 110px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 40;
    width: fit-content;
    white-space: nowrap;
  }

  .status-badge {
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 9px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border: 2px solid #000;
    box-shadow: 2px 2px 0px #000;
  }

  .status-badge.completed { background: #34d399; color: #000; }
  .status-badge.missing { background: #F97316; color: #000; }

  .scrollbar-thin::-webkit-scrollbar {
    width: 4px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  /* Overrides for mobile replica inside studio preview */
  .studio-preview-wrapper .min-h-screen {
    min-height: 100% !important;
    padding-top: 2rem !important; /* Make room for the notch bezel */
  }
  /* Disable cursor pointer-events for navigation links in preview */
  .studio-preview-wrapper a,
  .studio-preview-wrapper button {
    pointer-events: none !important;
  }
  /* Allow scroll gestures on child items */
  .studio-preview-wrapper * {
    pointer-events: auto;
  }

  /* Auto-scale the fixed phone preview based on viewport height to fit all screen sizes & zooms */
  @media (max-height: 900px) {
    .phone-preview-fixed {
      transform: scale(0.9);
      transform-origin: top center;
    }
  }
  @media (max-height: 800px) {
    .phone-preview-fixed {
      transform: scale(0.8);
      transform-origin: top center;
    }
  }
  @media (max-height: 700px) {
    .phone-preview-fixed {
      transform: scale(0.7);
      transform-origin: top center;
    }
  }
  @media (max-height: 600px) {
    .phone-preview-fixed {
      transform: scale(0.6);
      transform-origin: top center;
    }
  }
`,F={creator:{label:"Content Creator",emoji:"🎬",color:"#F97316",icon:_e},developer:{label:"Tech",emoji:"💻",color:"#3B82F6",icon:Fe},student:{label:"Student",emoji:"🎓",color:"#10B981",icon:Ue}},U=b=>{if(!b)return!1;const x=b.toLowerCase();return x.includes("creator")||["influencer","gamer","fitness"].includes(x)},V={first_name:"",last_name:"",bio:"",tagline:"",location:"",website:"",instagram:"",linkedin:"",github:"",twitter:"",youtube:"",threads:"",behance:"",dribbble:"",medium:"",twitch:"",whatsapp:"",est_year:"",avatar_url:"",skills:[],achievements:[],projects:[],works:[],platforms:[],collab_info:"",niche:"",total_reach:"",avg_engagement:"",profile_theme:"default"};function ve({children:b}){var I;const[x,m]=p.useState(null),[M,L]=p.useState(!1);p.useEffect(()=>{var C;if(!x)return;const g=x.contentDocument||((C=x.contentWindow)==null?void 0:C.document);if(!g)return;g.open(),g.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Mobile Preview</title>
          <style>
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              background-color: #0D1117;
              overflow-x: hidden;
              overflow-y: auto;
            }
            /* Custom thin scrollbar inside iframe */
            ::-webkit-scrollbar {
              width: 4px;
            }
            ::-webkit-scrollbar-track {
              background: transparent;
            }
            ::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 2px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.2);
            }
            
            /* Bezel notch buffer */
            .min-h-screen {
              min-height: 100% !important;
              padding-top: 2.2rem !important;
            }
            /* Disable pointers for preview interaction safety */
            a, button {
              pointer-events: none !important;
            }
            * {
              pointer-events: auto;
            }
          </style>
        </head>
        <body>
          <div id="preview-root" style="width: 100%; height: 100%;"></div>
        </body>
      </html>
    `),g.close();const B=g.head;document.querySelectorAll('link[rel="stylesheet"], style').forEach(s=>{B.appendChild(s.cloneNode(!0))}),L(!0)},[x]);const T=(I=x==null?void 0:x.contentDocument)==null?void 0:I.getElementById("preview-root");return e.jsx("iframe",{ref:m,className:"w-full h-full border-none bg-transparent",title:"Mobile Live Preview",children:M&&T&&Se.createPortal(b,T)})}function Ze(){var ne;const b=Ne(),[x]=Ce(),{user:m,refreshProfile:M,loading:L}=Le(),[T,I]=p.useState(!0),[g,B]=p.useState(!1),[$,C]=p.useState(!1),[s,X]=p.useState(null),[r,R]=p.useState(()=>{const a=x.get("persona");return a?["tech","dev","developer"].includes(a.toLowerCase())?"developer":a.toLowerCase():""}),[t,S]=p.useState({...V}),[z,K]=p.useState(!1),[A,Q]=p.useState(!1),[je,Z]=p.useState(!1);p.useEffect(()=>{!L&&!m&&b("/")},[m,L,b]),p.useEffect(()=>{async function a(){var i,o,l,d,u,w,P,j,le,oe,de,ce,pe,xe,me,he,ue;try{if(!m)return;const{data:v,error:be}=await O.from("profiles").select("*").eq("user_id",m.id).maybeSingle();if(be)throw be;if(v){X(v);const D=((i=v.persona_data)==null?void 0:i.identities)||[];let y=x.get("persona"),E=x.get("edit");const ye=x.get("mode")==="new";if(!y&&!E&&!ye&&D.length>0){const _=D.find(k=>k.active)||D[0];y=_.persona_type,E=_.id,R(y||""),b(`/studio?persona=${y}&edit=${E}`,{replace:!0})}else R(y||"");const n=E?D.find(_=>_.id===E):D.find(_=>_.persona_type===y),ke={first_name:v.first_name||"",last_name:v.last_name||"",bio:(n==null?void 0:n.bio)||((o=n==null?void 0:n.data)==null?void 0:o.bio)||"",instagram:((l=n==null?void 0:n.data)==null?void 0:l.instagram)||"",linkedin:((d=n==null?void 0:n.data)==null?void 0:d.linkedin)||"",github:((u=n==null?void 0:n.data)==null?void 0:u.github)||"",youtube:((w=n==null?void 0:n.data)==null?void 0:w.youtube)||"",twitter:((P=n==null?void 0:n.data)==null?void 0:P.twitter)||"",tiktok:((j=n==null?void 0:n.data)==null?void 0:j.tiktok)||"",twitch:((le=n==null?void 0:n.data)==null?void 0:le.twitch)||"",whatsapp:((oe=n==null?void 0:n.data)==null?void 0:oe.whatsapp)||"",avatar_url:(n==null?void 0:n.avatar_url)||((de=n==null?void 0:n.data)==null?void 0:de.avatar_url)||""};if(n){const _=((ce=n.data)==null?void 0:ce.skills)&&n.data.skills.length>0||((pe=n.data)==null?void 0:pe.projects)&&n.data.projects.length>0||((xe=n.data)==null?void 0:xe.experience)&&n.data.experience.length>0||((me=n.data)==null?void 0:me.education)&&n.data.education.length>0||((he=n.data)==null?void 0:he.custom_links)&&n.data.custom_links.length>0,k=((ue=n.data)==null?void 0:ue.achievements)&&n.data.achievements.length>0;K(!!_),Q(!!k),S(N=>{const fe={...N,...ke,...n.data||{}};try{const W=sessionStorage.getItem(`draft_persona_${y||""}`);if(W)return{...fe,...JSON.parse(W)}}catch{}return fe})}else x.get("mode")==="new"?S(_=>{const k={...V,first_name:v.first_name||"",last_name:v.last_name||"",avatar_url:""};try{const N=sessionStorage.getItem(`draft_persona_${y||""}`);if(N)return{...k,...JSON.parse(N)}}catch{}return k}):S(_=>{const k={...V,first_name:v.first_name||"",last_name:v.last_name||""};try{const N=sessionStorage.getItem(`draft_persona_${y||""}`);if(N)return{...k,...JSON.parse(N)}}catch{}return k})}}catch{}finally{I(!1)}}a()},[m]),p.useEffect(()=>{r&&t&&Object.keys(t).length>0&&(t.first_name!==""||t.last_name!==""||t.bio!==""||t.tagline!==""||t.about||t.tech_stack)&&sessionStorage.setItem(`draft_persona_${r}`,JSON.stringify(t))},[t,r]);const c=(a,i)=>{S(o=>({...o,[a]:i}))},ee=async a=>{if(!a||a.size>2*1024*1024){h.error("Image must be less than 2MB");return}if(!(m!=null&&m.id)){h.error("Please log in to upload an image");return}try{C(!0);const i=a.name.split(".").pop(),o=`${m.id}-${Math.random()}.${i}`,{error:l}=await O.storage.from("avatars").upload(o,a);if(l)throw l;const d=`/content/avatars/${o}`;c("avatar_url",d)}catch(i){h.error("Upload failed: "+i.message)}finally{C(!1)}},H=async(a,i)=>{if(!a||a.size>50*1024*1024)return h.error("File must be less than 50MB"),null;if(!(m!=null&&m.id))return h.error("Please log in to upload a file"),null;try{C(!0);const o=a.name.split(".").pop(),l=`${m.id}/${i}-${Math.random()}.${o}`,{error:d}=await O.storage.from("avatars").upload(l,a);if(d)throw d;const u=`/content/avatars/${l}`;return!i.startsWith("work_media_")&&!i.includes("_project_media_")&&c(i,u),u}catch(o){return h.error("Upload failed: "+o.message),null}finally{C(!1)}},te=a=>{if(a)try{const i=a.trim(),o=new URL(i.startsWith("http")?i:`https://${i}`),l=o.pathname.split("/").filter(Boolean);if(o.hostname.includes("instagram.com")&&l[0]){const d=l[0].replace(/^@/,"");c("instagram",d);const u=d.replace(/[_.]/g," ");t.first_name||c("first_name",u.charAt(0).toUpperCase()+u.slice(1)),h.success("✨ Instagram connected and handle pre-filled!")}else if(o.hostname.includes("linkedin.com")&&l[0]==="in"&&l[1]){const d=l[1].replace(/[-_]/g," ").split(" ");c("linkedin",l[1]),!t.first_name&&d[0]&&c("first_name",d[0].charAt(0).toUpperCase()+d[0].slice(1)),!t.last_name&&d[1]&&c("last_name",d[1].charAt(0).toUpperCase()+d[1].slice(1)),h.success("✨ LinkedIn connected and details pre-filled!")}else if(o.hostname.includes("github.com")&&l[0]){const d=l[0].replace(/^@/,"");c("github",d),t.first_name||c("first_name",d.charAt(0).toUpperCase()+d.slice(1)),h.success("✨ GitHub connected and details pre-filled!")}else if((o.hostname.includes("twitter.com")||o.hostname.includes("x.com"))&&l[0]){const d=l[0].replace(/^@/,"");c("twitter",d),t.first_name||c("first_name",d.charAt(0).toUpperCase()+d.slice(1)),h.success("✨ Twitter / X connected and details pre-filled!")}else if(o.hostname.includes("youtube.com")&&l[0]){const d=l[0].replace(/^@/,"");c("youtube",d),h.success("✨ YouTube channel connected!")}else h.error("URL format not recognized. Try pasting Instagram, LinkedIn, GitHub, or Twitter links.")}catch{h.error("Invalid URL format.")}},ae=async()=>{var a;if(!m){h.error("You must be logged in to save.");return}B(!0);try{const i=((a=s==null?void 0:s.persona_data)==null?void 0:a.identities)||[],o=x.get("edit"),l=o?i.findIndex(j=>j.id===o):i.findIndex(j=>j.persona_type===r),d={id:l>=0?i[l].id:o||`id_${Date.now()}`,persona_type:r,avatar_url:t.avatar_url||"",first_name:t.first_name||(s==null?void 0:s.first_name),last_name:t.last_name||(s==null?void 0:s.last_name),bio:t.bio||"",active:!0,data:{...t,bio:t.bio||""}},u=i.map(j=>({...j,active:!1}));l>=0?u[l]=d:u.push(d);const w={};t.instagram&&(w.instagram_url=t.instagram),t.linkedin&&(w.linkedin_url=t.linkedin),t.github&&(w.github_url=t.github),t.youtube&&(w.youtube_url=t.youtube),t.twitter&&(w.twitter_url=t.twitter),t.tiktok&&(w.tiktok_url=t.tiktok),t.twitch&&(w.twitch_url=t.twitch);const{error:P}=await O.from("profiles").update({persona_type:r,avatar_url:d.avatar_url,persona_data:{...(s==null?void 0:s.persona_data)||{},identities:u},first_name:t.first_name,last_name:t.last_name,bio:t.bio,profile_theme:t.profile_theme||"default"}).eq("user_id",m.id);if(P){h.error("Failed to save: "+P.message);return}X({...s,persona:r,persona_type:r,profile_theme:t.profile_theme||"default",persona_data:{...(s==null?void 0:s.persona_data)||{},identities:u}}),sessionStorage.removeItem(`draft_persona_${r}`),h.success("Changes saved successfully! 🎉");try{J.capture("Save Persona Theme",{persona_type:r,profile_theme:t.profile_theme||"default",completion_score:f})}catch{}M&&M()}catch(i){h.error("Save failed: "+i.message)}finally{B(!1)}},{score:f,incomplete:se}=p.useMemo(()=>ze(r||"creator",t),[r,t]),re=p.useMemo(()=>{const a=(t.first_name||"").trim(),i=(t.last_name||"").trim(),o=[{platform:"instagram",url:t.instagram?`https://instagram.com/${t.instagram.replace(/^@/,"")}`:""},{platform:"linkedin",url:t.linkedin?t.linkedin.includes("linkedin.com")?t.linkedin:`https://linkedin.com/in/${t.linkedin}`:""},{platform:"github",url:t.github?t.github.includes("github.com")?t.github:`https://github.com/${t.github}`:""},{platform:"twitter",url:t.twitter?t.twitter.includes("twitter.com")?t.twitter:`https://twitter.com/${t.twitter}`:""},{platform:"youtube",url:t.youtube?t.youtube.includes("youtube.com")?t.youtube:`https://youtube.com/${t.youtube}`:""},{platform:"website",url:t.website||""},{platform:"whatsapp",url:t.whatsapp?`https://wa.me/${t.whatsapp.replace(/\D/g,"")}`:""}].filter(l=>l.url);return{id:(s==null?void 0:s.id)||"preview-id",user_id:(s==null?void 0:s.user_id)||null,username:a.toLowerCase()||"preview",display_name:a&&i?`${a} ${i}`:a||i||"Your Name",first_name:a,last_name:i,avatar_url:t.avatar_url,member_id:(s==null?void 0:s.wm_code)||"WM-PREVIEW-001",persona:r,mood:t.mood||"Expressive & Curious",bio:t.bio||"",pulse:f||20,tier:(s==null?void 0:s.status)==="paid"?"Creator":"Starter",status:(s==null?void 0:s.status)||"free",is_verified:(s==null?void 0:s.is_verified)??!1,joined_at:(s==null?void 0:s.created_at)||new Date().toISOString(),views:0,top_location:"India",ghost_mode:!1,profile_theme:t.profile_theme||"default",social_links:o,persona_data:{...t,identities:[{active:!0,persona_type:r,first_name:a,last_name:i,avatar_url:t.avatar_url,bio:t.bio,data:{...t}}],[r]:{...t}}}},[t,r,s,f]),Y=p.useMemo(()=>{const a=(r||"creator").toLowerCase();return["tech","dev","developer"].includes(a)?G.developer:U(a)?G.creator:G[a]||G.creator},[r]),ie=p.useMemo(()=>{const a=(r||"creator").toLowerCase();return["tech","dev","developer"].includes(a)?F.developer:U(a)?F.creator:F[a]||F.creator},[r]);return p.useMemo(()=>f===100?"Your profile is optimized for maximum impact! You're ready to dominate.":f>=80?"Excellent work. Just a few more details to reach elite status.":f>=50?`You're ${f}% complete. Every detail you add builds more trust with your visitors.`:"Let's build a powerful identity. Start with the basics to get noticed.",[f,se]),se.slice(0,3),T||L?e.jsx("div",{className:"studio-page flex items-center justify-center",children:e.jsx("div",{className:"w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"})}):e.jsxs("div",{className:"studio-page pb-40",children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:He}}),e.jsx("header",{className:"sticky top-0 z-50 bg-[#0a0a0a] border-b-[4px] border-white",children:e.jsxs("div",{className:"max-w-[1000px] mx-auto px-4 sm:px-6 min-h-[80px] py-4 flex flex-row items-center justify-between gap-2 sm:gap-4",children:[e.jsxs("div",{className:"flex items-center gap-3 sm:gap-4 flex-1 min-w-0",children:[e.jsx("button",{onClick:()=>b("/dashboard?tab=profile"),className:"w-10 h-10 shrink-0 rounded-xl bg-white text-black border-[3px] border-black shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center transition-all",children:e.jsx(Me,{size:20})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("h1",{className:"text-lg sm:text-xl font-black font-display tracking-tight truncate",children:["Build your"," ",r?((Y==null?void 0:Y.name)||r.charAt(0).toUpperCase()+r.slice(1))+" ":"","Identity ",r?ie.emoji:"✨"]}),e.jsx("p",{className:"text-[9px] sm:text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5 truncate",children:r?"Complete your profile to unlock more visibility":"Choose your path to begin"})]})]}),r?e.jsxs("div",{className:"flex items-center gap-4 shrink-0",children:[e.jsxs("button",{onClick:ae,disabled:g,className:"hidden md:flex px-6 py-2.5 bg-orange-500 text-black border-[3px] border-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all items-center gap-2 shadow-[4px_4px_0px_#000] disabled:opacity-50",children:[g?e.jsx("div",{className:"w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"}):e.jsx(we,{size:14}),"Save Changes"]}),e.jsxs("div",{className:"text-right hidden md:block",children:[e.jsx("p",{className:"text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1",children:"Strength"}),e.jsx("p",{className:"text-xs font-bold text-orange-500",children:f>=80?"Elite Level Achieved! 🏆":"Good progress. Let's hit 80% 🚀"})]}),e.jsxs("div",{className:"relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0",children:[e.jsxs("svg",{className:"w-full h-full transform -rotate-90",children:[e.jsx("circle",{cx:"50%",cy:"50%",r:"40%",stroke:"#F1F1EF",strokeWidth:"4",fill:"transparent"}),e.jsx("circle",{cx:"50%",cy:"50%",r:"40%",stroke:ie.color,strokeWidth:"4",fill:"transparent",strokeDasharray:"251",strokeDashoffset:251*(1-f/100),strokeLinecap:"round",className:"progress-ring"})]}),e.jsxs("span",{className:"absolute text-[9px] sm:text-[10px] font-black",children:[f,"%"]})]})]}):null]})}),e.jsx("main",{className:"max-w-[1200px] mx-auto px-4 sm:px-6 py-10",children:e.jsxs("div",{className:r?"grid grid-cols-1 lg:grid-cols-[1fr_385px] gap-10 items-start":"max-w-[1000px] mx-auto",children:[e.jsxs("div",{className:"space-y-12 w-full min-w-0",children:[!r&&e.jsxs("section",{className:"space-y-6",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 rounded-xl bg-orange-500 text-black flex items-center justify-center font-black text-lg border-[3px] border-black shadow-[4px_4px_0px_#000]",children:"01"}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-display font-black text-white",children:"Choose Your Path"}),e.jsx("p",{className:"text-[10px] font-bold text-neutral-400 uppercase tracking-widest",children:"Select your core identity theme"})]})]}),e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-6",children:Object.entries(F).filter(([a])=>{var o;return!(((o=s==null?void 0:s.persona_data)==null?void 0:o.identities)||[]).some(l=>l.persona_type===a)}).map(([a,i])=>e.jsxs("div",{onClick:()=>{R(a),b(`/studio?persona=${a}&mode=new`,{replace:!0})},className:"glass-card group p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-orange-500 transition-all",children:[e.jsx("div",{className:"w-16 h-16 rounded-xl bg-[#0a0a0a] border-[3px] border-white flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform",children:i.emoji}),e.jsx("h3",{className:"text-lg font-black uppercase tracking-wider",children:i.label||a}),e.jsx("p",{className:"text-[10px] text-neutral-400 font-bold uppercase mt-1",children:"Select Protocol"})]},a))})]}),r&&e.jsxs(e.Fragment,{children:[e.jsx("section",{className:"glass-card p-10 animate-slideUp mb-8 bg-[#1a1a1a]",children:e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-6",children:[e.jsxs("div",{className:"flex items-center gap-5",children:[e.jsx("div",{className:"w-14 h-14 rounded-xl bg-orange-500 text-black border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]",children:e.jsx(q,{size:28})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-black font-display tracking-tight text-white",children:"Public Profile"}),e.jsx("p",{className:"text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1",children:"See how your identity looks to the world"})]})]}),e.jsxs("button",{onClick:()=>b(`/p/${(s==null?void 0:s.username)||(s==null?void 0:s.id)}?from=studio`),className:"px-6 py-3 bg-white text-black border-[3px] border-black rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center gap-2 shrink-0",children:[e.jsx(q,{size:16})," View Profile"]})]})}),e.jsxs("section",{id:"tagline",className:"glass-card p-10 animate-slideUp",children:[e.jsxs("div",{className:"flex items-center justify-between mb-10",children:[e.jsxs("div",{className:"flex items-center gap-5",children:[e.jsx("div",{className:"w-14 h-14 rounded-xl bg-orange-500 text-black border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]",children:e.jsx(Te,{size:28})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-black font-display tracking-tight text-white",children:"Basic Identity"}),e.jsx("p",{className:"text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1",children:"Foundational profile details"})]})]}),t.tagline&&e.jsx("span",{className:"status-badge completed",children:"Completed ✅"})]}),e.jsxs("div",{className:"p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl mb-8 flex flex-col sm:flex-row items-center gap-3",children:[e.jsxs("div",{className:"flex items-center gap-2 shrink-0",children:[e.jsx(_e,{size:16,className:"text-orange-500 animate-pulse"}),e.jsx("span",{className:"text-[11px] font-black uppercase tracking-wider text-orange-400",children:"1-Click Pre-fill:"})]}),e.jsx("input",{type:"text",placeholder:"Paste LinkedIn, Instagram, or GitHub profile link...",className:"w-full bg-[#0a0a0a] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-orange-500 transition-colors",onPaste:a=>{const i=a.clipboardData.getData("text");i&&te(i)},onChange:a=>{(a.target.value.includes("http")||a.target.value.includes(".com"))&&te(a.target.value)}})]}),e.jsxs("div",{className:"flex items-center gap-8 pb-10 mb-10 border-b border-neutral-100",children:[e.jsxs("div",{className:"relative group",children:[e.jsxs("div",{className:"w-24 h-24 rounded-xl bg-[#0a0a0a] border-[4px] border-white shadow-[6px_6px_0px_#fff] overflow-hidden group-hover:scale-105 transition-transform duration-500",children:[e.jsx($e,{src:t.avatar_url,name:`${t.first_name} ${t.last_name}`,username:(s==null?void 0:s.secure_slug)||(s==null?void 0:s.id),size:"w-full h-full text-4xl"}),$&&e.jsx("div",{className:"absolute inset-0 bg-black/40 flex items-center justify-center",children:e.jsx("div",{className:"w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"})})]}),e.jsxs("label",{className:"absolute -bottom-2 -right-2 w-10 h-10 bg-orange-500 border-[3px] border-black rounded-lg shadow-[3px_3px_0px_#000] flex items-center justify-center text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer",children:[e.jsx(Ie,{size:18}),e.jsx("input",{type:"file",accept:"image/*",className:"hidden",onChange:a=>{var i;return((i=a.target.files)==null?void 0:i[0])&&ee(a.target.files[0])}})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-xl font-black text-white mb-1 tracking-tighter",children:t.first_name||t.last_name?`${t.first_name} ${t.last_name}`:"New Identity"}),e.jsx("p",{className:"text-[10px] text-neutral-400 font-bold mb-4 uppercase tracking-widest",children:"JPG or PNG • Max 2MB"}),e.jsxs("div",{className:"flex gap-3",children:[e.jsxs("label",{className:"px-4 py-2 bg-white text-black border-[2px] border-black shadow-[2px_2px_0px_#000] text-[9px] font-black uppercase tracking-widest rounded-lg hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer",children:["Upload New",e.jsx("input",{type:"file",accept:"image/*",className:"hidden",onChange:a=>{var i;return((i=a.target.files)==null?void 0:i[0])&&ee(a.target.files[0])}})]}),e.jsx("button",{onClick:()=>c("avatar_url",""),className:"px-4 py-2 bg-white border border-neutral-200 text-neutral-600 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-neutral-50 transition-colors",children:"Remove"})]})]})]}),e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"First Name"}),e.jsx("input",{type:"text",placeholder:"Enter first name",className:"input-field",value:t.first_name,maxLength:50,onChange:a=>c("first_name",a.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"Last Name"}),e.jsx("input",{type:"text",placeholder:"Enter last name",className:"input-field",value:t.last_name,maxLength:50,onChange:a=>c("last_name",a.target.value)})]})]}),U(r)&&e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"Location Name"}),e.jsx("input",{type:"text",placeholder:"e.g. Mumbai, India",className:"input-field",value:t.location,maxLength:100,onChange:a=>c("location",a.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"Established Since"}),e.jsx("input",{type:"text",placeholder:"e.g. 2021",className:"input-field",value:t.est_year,maxLength:4,onChange:a=>{const i=a.target.value.replace(/\D/g,"");c("est_year",i)}})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"Profile Theme"}),e.jsx("div",{className:"grid grid-cols-4 gap-2",children:(()=>{let a=["default","classic","minimal","neon"];return["tech","dev","developer"].includes((r==null?void 0:r.toLowerCase())||"")?a=["default","classic","blueprint","hacker"]:r!=null&&r.toLowerCase().includes("student")&&(a=["default","classic","campus","night owl"]),a.map(i=>{var o,l;return e.jsx("div",{onClick:()=>c("profile_theme",i),className:`p-3 rounded-xl border-[3px] cursor-pointer transition-all text-center flex flex-col justify-center items-center ${(((o=t.profile_theme)==null?void 0:o.toLowerCase())||"default")===i?"border-orange-500 bg-orange-500 text-black shadow-[4px_4px_0px_#000] translate-y-[2px] translate-x-[2px]":"border-white bg-[#0a0a0a] hover:border-orange-500 shadow-[4px_4px_0px_#fff]"}`,children:e.jsx("p",{className:`text-[10px] font-black uppercase tracking-wider ${(((l=t.profile_theme)==null?void 0:l.toLowerCase())||"default")===i?"text-black":"text-neutral-400"}`,children:i==="default"?["tech","dev","developer"].includes((r==null?void 0:r.toLowerCase())||"")?"Terminal":r!=null&&r.toLowerCase().includes("student")?"Notebook":"Glow":i==="classic"?"Classic":i})},i)})})()})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"section-label",children:["Public Bio",!t.bio&&e.jsx("span",{className:"ml-auto text-orange-400 font-bold text-[9px] uppercase tracking-widest animate-pulse",children:"← Tap a vibe to fill instantly"})]}),e.jsx("textarea",{placeholder:"Tell the world who you are...",className:"input-field min-h-[100px] py-4",value:t.bio,maxLength:500,onChange:a=>c("bio",a.target.value)}),e.jsxs("div",{className:"flex flex-wrap gap-2 mt-3",children:[(U(r)?[{emoji:"🎬",label:"Creator",bio:"Creating content that connects and inspires. Building community one story at a time."},{emoji:"✨",label:"Visionary",bio:"Turning ideas into viral moments. Here to make noise and leave a mark."},{emoji:"🌍",label:"Storyteller",bio:"Authentic storyteller. Brand collaborator. Helping people discover what they love."},{emoji:"🚀",label:"Ambitious",bio:"Growing every day. Content is my craft, community is my purpose."}]:r!=null&&r.toLowerCase().includes("student")?[{emoji:"🎓",label:"Learner",bio:"Forever a student. Building skills, chasing goals, and making the most of every opportunity."},{emoji:"💡",label:"Builder",bio:"Student by day, builder by night. Learning, experimenting, and sharing the journey."},{emoji:"🌱",label:"Growing",bio:"Early in the journey but full of drive. Open to learning, networking, and growing."},{emoji:"🔥",label:"Hustler",bio:"Studying hard, building harder. Future-focused and ready to create real impact."}]:[{emoji:"💻",label:"Tech",bio:"Building things that matter. Passionate about technology, clean code, and solving real problems."},{emoji:"🚀",label:"Ambitious",bio:"Shipping products, solving problems, and levelling up every day. Open to collabs."},{emoji:"⚡",label:"Minimal",bio:"Code. Create. Repeat. Focused on building with purpose."},{emoji:"🌐",label:"Open",bio:"Developer, maker, and community contributor. Let's build something great together."}]).map(a=>e.jsxs("button",{type:"button",onClick:()=>c("bio",a.bio),className:"flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-white/20 bg-white/5 hover:bg-orange-500/20 hover:border-orange-500 text-[11px] font-bold text-neutral-300 hover:text-white transition-all",title:a.bio,children:[e.jsx("span",{children:a.emoji}),e.jsx("span",{children:a.label})]},a.label)),t.bio&&e.jsx("button",{type:"button",onClick:()=>c("bio",""),className:"flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-[11px] font-bold text-red-400 hover:text-red-300 transition-all",children:"Clear"})]})]})]})]}),e.jsxs("section",{id:"detailed_attributes",className:"glass-card p-10 animate-slideUp",style:{animationDelay:"0.2s"},children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10",children:[e.jsxs("div",{className:"flex items-center gap-5",children:[e.jsx("div",{className:"w-14 h-14 rounded-xl bg-orange-500 text-black border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]",children:e.jsx(Be,{size:28})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-black font-display tracking-tight text-white",children:"Detailed Persona Attributes"}),e.jsxs("p",{className:"text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1",children:["Specific details for your ",r," identity"]})]})]}),e.jsx("button",{type:"button",onClick:()=>{K(!z);try{J.capture("Toggle Detailed Form",{expanded:!z,persona:r})}catch{}},className:`px-6 py-2.5 border-[3px] border-black text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${z?"bg-white text-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none":"bg-orange-500 text-black shadow-[5px_5px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"}`,children:z?"Collapse Details":"Configure Details +25%"})]}),z&&e.jsxs("div",{className:"p-0 sm:p-2 animate-fadeIn",children:[["developer","dev"].includes(r)&&e.jsx(Ae,{data:t,onChange:S,isOwner:!0,onUpload:H,uploading:$}),r==="student"&&e.jsx(Pe,{data:t,onChange:S,onUpload:H,uploading:$}),U(r)&&e.jsx(De,{data:t,onChange:S,onUpload:H,uploading:$})]})]}),e.jsxs("section",{id:"achievements",className:"glass-card p-10 animate-slideUp",style:{animationDelay:"0.5s"},children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10",children:[e.jsxs("div",{className:"flex items-center gap-5",children:[e.jsx("div",{className:"w-14 h-14 rounded-xl bg-orange-500 text-black border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]",children:e.jsx(Oe,{size:28})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-black font-display tracking-tight text-white",children:"Achievements"}),e.jsx("p",{className:"text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1",children:"Trust & Authority"})]})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[((ne=t.achievements)==null?void 0:ne.length)>0?e.jsx("span",{className:"status-badge completed",children:"Completed ✅"}):e.jsx("span",{className:"status-badge missing",children:"Missing +10% ⚠️"}),e.jsx("button",{type:"button",onClick:()=>{Q(!A);try{J.capture("Toggle Achievements Form",{expanded:!A})}catch{}},className:`px-6 py-2.5 border-[3px] border-black text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${A?"bg-white text-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none":"bg-orange-500 text-black shadow-[5px_5px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"}`,children:A?"Collapse":"Add Achievements"})]})]}),A&&e.jsxs("div",{className:"space-y-6 animate-fadeIn",children:[e.jsx("p",{className:"text-[11px] text-neutral-400 font-medium leading-relaxed",children:"Boost trust with achievements (awards, milestones, or high-value certifications)."}),e.jsx(Ee,{value:t.achievements||[],onChange:a=>c("achievements",a),placeholder:"Add achievement (e.g., Verified on Instagram, Best Actor 2023)"})]})]})]})]}),r&&e.jsxs("div",{className:"hidden lg:block lg:fixed lg:top-[120px] lg:w-[350px] lg:right-[calc((100vw-1200px)/2+40px)] max-[1200px]:lg:right-10 z-30 phone-preview-fixed",children:[e.jsx("p",{className:"text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-3 text-center",children:"Live Preview Card"}),e.jsxs("div",{className:"relative mx-auto w-[350px] h-[680px] bg-black border-[12px] border-neutral-900 rounded-[56px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col ring-4 ring-neutral-800/80",children:[e.jsxs("div",{className:"absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-50 flex items-center justify-center",children:[e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800 mr-2"}),e.jsx("div",{className:"w-12 h-1 bg-neutral-950 rounded-full"})]}),e.jsx("div",{className:"flex-1 w-full h-full bg-[#0d1117] relative",children:e.jsx(ve,{children:e.jsx(ge,{profile:re,hideHeader:!1})})})]})]})]})}),r&&e.jsx("button",{onClick:()=>Z(!0),className:"lg:hidden fixed bottom-28 right-6 z-50 w-12 h-12 rounded-full bg-orange-500 text-black border-[3px] border-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none flex items-center justify-center transition-all active:scale-95",title:"Show Live Preview",children:e.jsx(q,{size:20})}),je&&e.jsx("div",{className:"fixed inset-0 z-[9999] lg:hidden bg-black/80 backdrop-blur-sm flex items-center justify-center p-4",children:e.jsxs("div",{className:"relative w-full max-w-[360px] h-[90vh] bg-black border-[12px] border-neutral-900 rounded-[56px] overflow-hidden flex flex-col shadow-2xl ring-4 ring-neutral-800/80",children:[e.jsx("button",{onClick:()=>Z(!1),className:"absolute top-4 right-4 z-[9999] w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center border border-white/10 hover:bg-neutral-850",children:e.jsx(Ge,{size:16})}),e.jsx("div",{className:"flex-1 w-full h-full bg-[#0d1117] relative",children:e.jsx(ve,{children:e.jsx(ge,{profile:re,hideHeader:!1})})})]})}),r?e.jsxs("footer",{className:"relative md:fixed bottom-0 left-0 right-0 z-[60] bg-[#0a0a0a] border-t-[4px] border-white p-6 pb-8 flex flex-col items-center justify-center gap-3",children:[e.jsx("button",{onClick:ae,disabled:g,className:"px-14 py-4 rounded-xl bg-orange-500 text-black border-[4px] border-black font-black text-xs uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all shadow-[6px_6px_0px_#000] disabled:opacity-50 flex items-center gap-2",children:g?"Saving Profile...":e.jsxs(e.Fragment,{children:[e.jsx(we,{size:20})," Save Profile"]})}),e.jsxs("div",{className:"flex items-center gap-1.5 text-neutral-400",children:[e.jsx(Re,{size:12}),e.jsx("span",{className:"text-[10px] font-bold uppercase tracking-widest",children:"Secured by KnoWMi Identity Cloud • End-to-End Encrypted"})]})]}):null]})}export{Ze as default};
