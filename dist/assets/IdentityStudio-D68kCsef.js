import{ba as ye,bk as ke,r as d,j as e,b7 as H,bb as j,b4 as Ne}from"./vendor-DJ8AXdcW.js";import{u as Ce,A as Se,s as O}from"./index-BFeyMteL.js";import{p as G,P as fe}from"./personaConfig-B7n70ZT7.js";import{c as $e}from"./completion-score-D5PUhF_l.js";import{D as Le,S as ze,C as Ee,T as De}from"./CreatorForm-BKwnVYLu.js";import{o as Pe,c as Ae,t as Fe,aj as Me,ap as ge,an as q,U as Te,$ as Ue,J as Be,v as Ie,X as Oe,d as Ge}from"./vendor-icons-Kupq-i__.js";import"./vendor-supabase-BkJ-lukb.js";import"./vendor-animation-DPn91hQ9.js";const Ye=`
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
`,F={creator:{label:"Content Creator",emoji:"🎬",color:"#F97316",icon:Ae},developer:{label:"Tech",emoji:"💻",color:"#3B82F6",icon:Pe},student:{label:"Student",emoji:"🎓",color:"#10B981",icon:Fe}},M=m=>{if(!m)return!1;const c=m.toLowerCase();return c.includes("creator")||["influencer","gamer","fitness"].includes(c)},V={first_name:"",last_name:"",bio:"",tagline:"",location:"",website:"",instagram:"",linkedin:"",github:"",twitter:"",youtube:"",threads:"",behance:"",dribbble:"",medium:"",twitch:"",whatsapp:"",est_year:"",avatar_url:"",skills:[],achievements:[],projects:[],works:[],platforms:[],collab_info:"",niche:"",total_reach:"",avg_engagement:"",profile_theme:"default"};function we({children:m}){var B;const[c,p]=d.useState(null),[T,$]=d.useState(!1);d.useEffect(()=>{var C;if(!c)return;const b=c.contentDocument||((C=c.contentWindow)==null?void 0:C.document);if(!b)return;b.open(),b.write(`
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
    `),b.close();const I=b.head;document.querySelectorAll('link[rel="stylesheet"], style').forEach(r=>{I.appendChild(r.cloneNode(!0))}),$(!0)},[c]);const U=(B=c==null?void 0:c.contentDocument)==null?void 0:B.getElementById("preview-root");return e.jsx("iframe",{ref:p,className:"w-full h-full border-none bg-transparent",title:"Mobile Live Preview",children:T&&U&&Ne.createPortal(m,U)})}function Qe(){var ie;const m=ye(),[c]=ke(),{user:p,refreshProfile:T,loading:$}=Ce(),[U,B]=d.useState(!0),[b,I]=d.useState(!1),[L,C]=d.useState(!1),[r,X]=d.useState(null),[s,Y]=d.useState(()=>{const a=c.get("persona");return a?["tech","dev","developer"].includes(a.toLowerCase())?"developer":a.toLowerCase():""}),[t,S]=d.useState({...V}),[z,K]=d.useState(!1),[E,Q]=d.useState(!1),[ve,Z]=d.useState(!1);d.useEffect(()=>{!$&&!p&&m("/")},[p,$,m]),d.useEffect(()=>{async function a(){var n,l,o,u,f,g,D,_,ne,le,oe,de,ce,pe,xe,me,he;try{if(!p)return;const{data:w,error:ue}=await O.from("profiles").select("*").eq("user_id",p.id).maybeSingle();if(ue)throw ue;if(w){X(w);const P=((n=w.persona_data)==null?void 0:n.identities)||[];let y=c.get("persona"),A=c.get("edit");const je=c.get("mode")==="new";if(!y&&!A&&!je&&P.length>0){const v=P.find(k=>k.active)||P[0];y=v.persona_type,A=v.id,Y(y||""),m(`/studio?persona=${y}&edit=${A}`,{replace:!0})}else Y(y||"");const i=A?P.find(v=>v.id===A):P.find(v=>v.persona_type===y),_e={first_name:w.first_name||"",last_name:w.last_name||"",bio:(i==null?void 0:i.bio)||((l=i==null?void 0:i.data)==null?void 0:l.bio)||"",instagram:((o=i==null?void 0:i.data)==null?void 0:o.instagram)||"",linkedin:((u=i==null?void 0:i.data)==null?void 0:u.linkedin)||"",github:((f=i==null?void 0:i.data)==null?void 0:f.github)||"",youtube:((g=i==null?void 0:i.data)==null?void 0:g.youtube)||"",twitter:((D=i==null?void 0:i.data)==null?void 0:D.twitter)||"",tiktok:((_=i==null?void 0:i.data)==null?void 0:_.tiktok)||"",twitch:((ne=i==null?void 0:i.data)==null?void 0:ne.twitch)||"",whatsapp:((le=i==null?void 0:i.data)==null?void 0:le.whatsapp)||"",avatar_url:(i==null?void 0:i.avatar_url)||((oe=i==null?void 0:i.data)==null?void 0:oe.avatar_url)||""};if(i){const v=((de=i.data)==null?void 0:de.skills)&&i.data.skills.length>0||((ce=i.data)==null?void 0:ce.projects)&&i.data.projects.length>0||((pe=i.data)==null?void 0:pe.experience)&&i.data.experience.length>0||((xe=i.data)==null?void 0:xe.education)&&i.data.education.length>0||((me=i.data)==null?void 0:me.custom_links)&&i.data.custom_links.length>0,k=((he=i.data)==null?void 0:he.achievements)&&i.data.achievements.length>0;K(!!v),Q(!!k),S(N=>{const be={...N,..._e,...i.data||{}};try{const W=sessionStorage.getItem(`draft_persona_${y||""}`);if(W)return{...be,...JSON.parse(W)}}catch{}return be})}else c.get("mode")==="new"?S(v=>{const k={...V,first_name:w.first_name||"",last_name:w.last_name||"",avatar_url:""};try{const N=sessionStorage.getItem(`draft_persona_${y||""}`);if(N)return{...k,...JSON.parse(N)}}catch{}return k}):S(v=>{const k={...V,first_name:w.first_name||"",last_name:w.last_name||""};try{const N=sessionStorage.getItem(`draft_persona_${y||""}`);if(N)return{...k,...JSON.parse(N)}}catch{}return k})}}catch{}finally{B(!1)}}a()},[p]),d.useEffect(()=>{s&&t&&Object.keys(t).length>0&&(t.first_name!==""||t.last_name!==""||t.bio!==""||t.tagline!==""||t.about||t.tech_stack)&&sessionStorage.setItem(`draft_persona_${s}`,JSON.stringify(t))},[t,s]);const x=(a,n)=>{S(l=>({...l,[a]:n}))},ee=async a=>{if(!a||a.size>2*1024*1024){j.error("Image must be less than 2MB");return}if(!(p!=null&&p.id)){j.error("Please log in to upload an image");return}try{C(!0);const n=a.name.split(".").pop(),l=`${p.id}-${Math.random()}.${n}`,{error:o}=await O.storage.from("avatars").upload(l,a);if(o)throw o;const u=`/content/avatars/${l}`;x("avatar_url",u)}catch(n){j.error("Upload failed: "+n.message)}finally{C(!1)}},J=async(a,n)=>{if(!a||a.size>50*1024*1024)return j.error("File must be less than 50MB"),null;if(!(p!=null&&p.id))return j.error("Please log in to upload a file"),null;try{C(!0);const l=a.name.split(".").pop(),o=`${p.id}/${n}-${Math.random()}.${l}`,{error:u}=await O.storage.from("avatars").upload(o,a);if(u)throw u;const f=`/content/avatars/${o}`;return!n.startsWith("work_media_")&&!n.includes("_project_media_")&&x(n,f),f}catch(l){return j.error("Upload failed: "+l.message),null}finally{C(!1)}},te=async()=>{var a;if(!p){j.error("You must be logged in to save.");return}I(!0);try{const n=((a=r==null?void 0:r.persona_data)==null?void 0:a.identities)||[],l=c.get("edit"),o=l?n.findIndex(_=>_.id===l):n.findIndex(_=>_.persona_type===s),u={id:o>=0?n[o].id:l||`id_${Date.now()}`,persona_type:s,avatar_url:t.avatar_url||"",first_name:t.first_name||(r==null?void 0:r.first_name),last_name:t.last_name||(r==null?void 0:r.last_name),bio:t.bio||"",active:!0,data:{...t,bio:t.bio||""}},f=n.map(_=>({..._,active:!1}));o>=0?f[o]=u:f.push(u);const g={};t.instagram&&(g.instagram_url=t.instagram),t.linkedin&&(g.linkedin_url=t.linkedin),t.github&&(g.github_url=t.github),t.youtube&&(g.youtube_url=t.youtube),t.twitter&&(g.twitter_url=t.twitter),t.tiktok&&(g.tiktok_url=t.tiktok),t.twitch&&(g.twitch_url=t.twitch);const{error:D}=await O.from("profiles").update({persona_type:s,avatar_url:u.avatar_url,persona_data:{...(r==null?void 0:r.persona_data)||{},identities:f},first_name:t.first_name,last_name:t.last_name,bio:t.bio,profile_theme:t.profile_theme||"default"}).eq("user_id",p.id);if(D){j.error("Failed to save: "+D.message);return}X({...r,persona:s,persona_type:s,profile_theme:t.profile_theme||"default",persona_data:{...(r==null?void 0:r.persona_data)||{},identities:f}}),sessionStorage.removeItem(`draft_persona_${s}`),j.success("Changes saved successfully! 🎉");try{H.capture("Save Persona Theme",{persona_type:s,profile_theme:t.profile_theme||"default",completion_score:h})}catch{}T&&T()}catch(n){j.error("Save failed: "+n.message)}finally{I(!1)}},{score:h,incomplete:ae}=d.useMemo(()=>$e(s||"creator",t),[s,t]),re=d.useMemo(()=>{const a=(t.first_name||"").trim(),n=(t.last_name||"").trim(),l=[{platform:"instagram",url:t.instagram?`https://instagram.com/${t.instagram.replace(/^@/,"")}`:""},{platform:"linkedin",url:t.linkedin?t.linkedin.includes("linkedin.com")?t.linkedin:`https://linkedin.com/in/${t.linkedin}`:""},{platform:"github",url:t.github?t.github.includes("github.com")?t.github:`https://github.com/${t.github}`:""},{platform:"twitter",url:t.twitter?t.twitter.includes("twitter.com")?t.twitter:`https://twitter.com/${t.twitter}`:""},{platform:"youtube",url:t.youtube?t.youtube.includes("youtube.com")?t.youtube:`https://youtube.com/${t.youtube}`:""},{platform:"website",url:t.website||""},{platform:"whatsapp",url:t.whatsapp?`https://wa.me/${t.whatsapp.replace(/\D/g,"")}`:""}].filter(o=>o.url);return{id:(r==null?void 0:r.id)||"preview-id",user_id:(r==null?void 0:r.user_id)||null,username:a.toLowerCase()||"preview",display_name:a&&n?`${a} ${n}`:a||n||"Your Name",first_name:a,last_name:n,avatar_url:t.avatar_url,member_id:(r==null?void 0:r.wm_code)||"WM-PREVIEW-001",persona:s,mood:t.mood||"Expressive & Curious",bio:t.bio||"",pulse:h||20,tier:(r==null?void 0:r.status)==="paid"?"Creator":"Starter",status:(r==null?void 0:r.status)||"free",is_verified:(r==null?void 0:r.is_verified)??!1,joined_at:(r==null?void 0:r.created_at)||new Date().toISOString(),views:0,top_location:"India",ghost_mode:!1,profile_theme:t.profile_theme||"default",social_links:l,persona_data:{...t,identities:[{active:!0,persona_type:s,first_name:a,last_name:n,avatar_url:t.avatar_url,bio:t.bio,data:{...t}}],[s]:{...t}}}},[t,s,r,h]),R=d.useMemo(()=>{const a=(s||"creator").toLowerCase();return["tech","dev","developer"].includes(a)?G.developer:M(a)?G.creator:G[a]||G.creator},[s]),se=d.useMemo(()=>{const a=(s||"creator").toLowerCase();return["tech","dev","developer"].includes(a)?F.developer:M(a)?F.creator:F[a]||F.creator},[s]);return d.useMemo(()=>h===100?"Your profile is optimized for maximum impact! You're ready to dominate.":h>=80?"Excellent work. Just a few more details to reach elite status.":h>=50?`You're ${h}% complete. Every detail you add builds more trust with your visitors.`:"Let's build a powerful identity. Start with the basics to get noticed.",[h,ae]),ae.slice(0,3),U||$?e.jsx("div",{className:"studio-page flex items-center justify-center",children:e.jsx("div",{className:"w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"})}):e.jsxs("div",{className:"studio-page pb-40",children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:Ye}}),e.jsx("header",{className:"sticky top-0 z-50 bg-[#0a0a0a] border-b-[4px] border-white",children:e.jsxs("div",{className:"max-w-[1000px] mx-auto px-4 sm:px-6 min-h-[80px] py-4 flex flex-row items-center justify-between gap-2 sm:gap-4",children:[e.jsxs("div",{className:"flex items-center gap-3 sm:gap-4 flex-1 min-w-0",children:[e.jsx("button",{onClick:()=>m("/dashboard?tab=profile"),className:"w-10 h-10 shrink-0 rounded-xl bg-white text-black border-[3px] border-black shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center transition-all",children:e.jsx(Me,{size:20})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("h1",{className:"text-lg sm:text-xl font-black font-display tracking-tight truncate",children:["Build your"," ",s?((R==null?void 0:R.name)||s.charAt(0).toUpperCase()+s.slice(1))+" ":"","Identity ",s?se.emoji:"✨"]}),e.jsx("p",{className:"text-[9px] sm:text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5 truncate",children:s?"Complete your profile to unlock more visibility":"Choose your path to begin"})]})]}),s?e.jsxs("div",{className:"flex items-center gap-4 shrink-0",children:[e.jsxs("button",{onClick:te,disabled:b,className:"hidden md:flex px-6 py-2.5 bg-orange-500 text-black border-[3px] border-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all items-center gap-2 shadow-[4px_4px_0px_#000] disabled:opacity-50",children:[b?e.jsx("div",{className:"w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"}):e.jsx(ge,{size:14}),"Save Changes"]}),e.jsxs("div",{className:"text-right hidden md:block",children:[e.jsx("p",{className:"text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1",children:"Strength"}),e.jsx("p",{className:"text-xs font-bold text-orange-500",children:h>=80?"Elite Level Achieved! 🏆":"Good progress. Let's hit 80% 🚀"})]}),e.jsxs("div",{className:"relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0",children:[e.jsxs("svg",{className:"w-full h-full transform -rotate-90",children:[e.jsx("circle",{cx:"50%",cy:"50%",r:"40%",stroke:"#F1F1EF",strokeWidth:"4",fill:"transparent"}),e.jsx("circle",{cx:"50%",cy:"50%",r:"40%",stroke:se.color,strokeWidth:"4",fill:"transparent",strokeDasharray:"251",strokeDashoffset:251*(1-h/100),strokeLinecap:"round",className:"progress-ring"})]}),e.jsxs("span",{className:"absolute text-[9px] sm:text-[10px] font-black",children:[h,"%"]})]})]}):null]})}),e.jsx("main",{className:"max-w-[1200px] mx-auto px-4 sm:px-6 py-10",children:e.jsxs("div",{className:s?"grid grid-cols-1 lg:grid-cols-[1fr_385px] gap-10 items-start":"max-w-[1000px] mx-auto",children:[e.jsxs("div",{className:"space-y-12 w-full min-w-0",children:[!s&&e.jsxs("section",{className:"space-y-6",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 rounded-xl bg-orange-500 text-black flex items-center justify-center font-black text-lg border-[3px] border-black shadow-[4px_4px_0px_#000]",children:"01"}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-display font-black text-white",children:"Choose Your Path"}),e.jsx("p",{className:"text-[10px] font-bold text-neutral-400 uppercase tracking-widest",children:"Select your core identity theme"})]})]}),e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-6",children:Object.entries(F).filter(([a])=>{var l;return!(((l=r==null?void 0:r.persona_data)==null?void 0:l.identities)||[]).some(o=>o.persona_type===a)}).map(([a,n])=>e.jsxs("div",{onClick:()=>{Y(a),m(`/studio?persona=${a}&mode=new`,{replace:!0})},className:"glass-card group p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-orange-500 transition-all",children:[e.jsx("div",{className:"w-16 h-16 rounded-xl bg-[#0a0a0a] border-[3px] border-white flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform",children:n.emoji}),e.jsx("h3",{className:"text-lg font-black uppercase tracking-wider",children:n.label||a}),e.jsx("p",{className:"text-[10px] text-neutral-400 font-bold uppercase mt-1",children:"Select Protocol"})]},a))})]}),s&&e.jsxs(e.Fragment,{children:[e.jsx("section",{className:"glass-card p-10 animate-slideUp mb-8 bg-[#1a1a1a]",children:e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-6",children:[e.jsxs("div",{className:"flex items-center gap-5",children:[e.jsx("div",{className:"w-14 h-14 rounded-xl bg-orange-500 text-black border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]",children:e.jsx(q,{size:28})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-black font-display tracking-tight text-white",children:"Public Profile"}),e.jsx("p",{className:"text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1",children:"See how your identity looks to the world"})]})]}),e.jsxs("button",{onClick:()=>m(`/p/${(r==null?void 0:r.username)||(r==null?void 0:r.id)}?from=studio`),className:"px-6 py-3 bg-white text-black border-[3px] border-black rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center gap-2 shrink-0",children:[e.jsx(q,{size:16})," View Profile"]})]})}),e.jsxs("section",{id:"tagline",className:"glass-card p-10 animate-slideUp",children:[e.jsxs("div",{className:"flex items-center justify-between mb-10",children:[e.jsxs("div",{className:"flex items-center gap-5",children:[e.jsx("div",{className:"w-14 h-14 rounded-xl bg-orange-500 text-black border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]",children:e.jsx(Te,{size:28})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-black font-display tracking-tight text-white",children:"Basic Identity"}),e.jsx("p",{className:"text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1",children:"Foundational profile details"})]})]}),t.tagline&&e.jsx("span",{className:"status-badge completed",children:"Completed ✅"})]}),e.jsxs("div",{id:"avatar_upload_input",className:"flex items-center gap-8 pb-10 mb-10 border-b border-neutral-100",children:[e.jsxs("div",{className:"relative group",children:[e.jsxs("div",{className:"w-24 h-24 rounded-xl bg-[#0a0a0a] border-[4px] border-white shadow-[6px_6px_0px_#fff] overflow-hidden group-hover:scale-105 transition-transform duration-500",children:[e.jsx(Se,{src:t.avatar_url,name:`${t.first_name} ${t.last_name}`,username:(r==null?void 0:r.secure_slug)||(r==null?void 0:r.id),size:"w-full h-full text-4xl"}),L&&e.jsx("div",{className:"absolute inset-0 bg-black/40 flex items-center justify-center",children:e.jsx("div",{className:"w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"})})]}),e.jsxs("label",{className:"absolute -bottom-2 -right-2 w-10 h-10 bg-orange-500 border-[3px] border-black rounded-lg shadow-[3px_3px_0px_#000] flex items-center justify-center text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer",children:[e.jsx(Ue,{size:18}),e.jsx("input",{type:"file",accept:"image/*",className:"hidden",onChange:a=>{var n;return((n=a.target.files)==null?void 0:n[0])&&ee(a.target.files[0])}})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-xl font-black text-white mb-1 tracking-tighter",children:t.first_name||t.last_name?`${t.first_name} ${t.last_name}`:"New Identity"}),e.jsx("p",{className:"text-[10px] text-neutral-400 font-bold mb-4 uppercase tracking-widest",children:"JPG or PNG • Max 2MB"}),e.jsxs("div",{className:"flex gap-3",children:[e.jsxs("label",{className:"px-4 py-2 bg-white text-black border-[2px] border-black shadow-[2px_2px_0px_#000] text-[9px] font-black uppercase tracking-widest rounded-lg hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer",children:["Upload New",e.jsx("input",{type:"file",accept:"image/*",className:"hidden",onChange:a=>{var n;return((n=a.target.files)==null?void 0:n[0])&&ee(a.target.files[0])}})]}),e.jsx("button",{onClick:()=>x("avatar_url",""),className:"px-4 py-2 bg-white border border-neutral-200 text-neutral-600 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-neutral-50 transition-colors",children:"Remove"})]})]})]}),e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"First Name"}),e.jsx("input",{id:"first_name_input",type:"text",placeholder:"Enter first name",className:"input-field",value:t.first_name,maxLength:50,onChange:a=>x("first_name",a.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"Last Name"}),e.jsx("input",{type:"text",placeholder:"Enter last name",className:"input-field",value:t.last_name,maxLength:50,onChange:a=>x("last_name",a.target.value)})]})]}),M(s)&&e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"Location Name"}),e.jsx("input",{type:"text",placeholder:"e.g. Mumbai, India",className:"input-field",value:t.location,maxLength:100,onChange:a=>x("location",a.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"Established Since"}),e.jsx("input",{type:"text",placeholder:"e.g. 2021",className:"input-field",value:t.est_year,maxLength:4,onChange:a=>{const n=a.target.value.replace(/\D/g,"");x("est_year",n)}})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"Profile Theme"}),e.jsx("div",{className:"grid grid-cols-4 gap-2",children:(()=>{let a=["default","classic","minimal","neon"];return["tech","dev","developer"].includes((s==null?void 0:s.toLowerCase())||"")?a=["default","classic","blueprint","hacker"]:s!=null&&s.toLowerCase().includes("student")&&(a=["default","classic","campus","night owl"]),a.map(n=>{var l,o;return e.jsx("div",{onClick:()=>x("profile_theme",n),className:`p-3 rounded-xl border-[3px] cursor-pointer transition-all text-center flex flex-col justify-center items-center ${(((l=t.profile_theme)==null?void 0:l.toLowerCase())||"default")===n?"border-orange-500 bg-orange-500 text-black shadow-[4px_4px_0px_#000] translate-y-[2px] translate-x-[2px]":"border-white bg-[#0a0a0a] hover:border-orange-500 shadow-[4px_4px_0px_#fff]"}`,children:e.jsx("p",{className:`text-[10px] font-black uppercase tracking-wider ${(((o=t.profile_theme)==null?void 0:o.toLowerCase())||"default")===n?"text-black":"text-neutral-400"}`,children:n==="default"?["tech","dev","developer"].includes((s==null?void 0:s.toLowerCase())||"")?"Terminal":s!=null&&s.toLowerCase().includes("student")?"Notebook":"Glow":n==="classic"?"Classic":n})},n)})})()})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"section-label",children:["Public Bio",!t.bio&&e.jsx("span",{className:"ml-auto text-orange-400 font-bold text-[9px] uppercase tracking-widest animate-pulse",children:"← Tap a vibe to fill instantly"})]}),e.jsx("textarea",{id:"bio_input",placeholder:"Tell the world who you are...",className:"input-field min-h-[100px] py-4",value:t.bio,maxLength:500,onChange:a=>x("bio",a.target.value)}),e.jsxs("div",{className:"flex flex-wrap gap-2 mt-3",children:[(M(s)?[{emoji:"🎬",label:"Creator",bio:"Creating content that connects and inspires. Building community one story at a time."},{emoji:"✨",label:"Visionary",bio:"Turning ideas into viral moments. Here to make noise and leave a mark."},{emoji:"🌍",label:"Storyteller",bio:"Authentic storyteller. Brand collaborator. Helping people discover what they love."},{emoji:"🚀",label:"Ambitious",bio:"Growing every day. Content is my craft, community is my purpose."}]:s!=null&&s.toLowerCase().includes("student")?[{emoji:"🎓",label:"Learner",bio:"Forever a student. Building skills, chasing goals, and making the most of every opportunity."},{emoji:"💡",label:"Builder",bio:"Student by day, builder by night. Learning, experimenting, and sharing the journey."},{emoji:"🌱",label:"Growing",bio:"Early in the journey but full of drive. Open to learning, networking, and growing."},{emoji:"🔥",label:"Hustler",bio:"Studying hard, building harder. Future-focused and ready to create real impact."}]:[{emoji:"💻",label:"Tech",bio:"Building things that matter. Passionate about technology, clean code, and solving real problems."},{emoji:"🚀",label:"Ambitious",bio:"Shipping products, solving problems, and levelling up every day. Open to collabs."},{emoji:"⚡",label:"Minimal",bio:"Code. Create. Repeat. Focused on building with purpose."},{emoji:"🌐",label:"Open",bio:"Developer, maker, and community contributor. Let's build something great together."}]).map(a=>e.jsxs("button",{type:"button",onClick:()=>x("bio",a.bio),className:"flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-white/20 bg-white/5 hover:bg-orange-500/20 hover:border-orange-500 text-[11px] font-bold text-neutral-300 hover:text-white transition-all",title:a.bio,children:[e.jsx("span",{children:a.emoji}),e.jsx("span",{children:a.label})]},a.label)),t.bio&&e.jsx("button",{type:"button",onClick:()=>x("bio",""),className:"flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-[11px] font-bold text-red-400 hover:text-red-300 transition-all",children:"Clear"})]})]})]})]}),e.jsxs("section",{id:"detailed_attributes",className:"glass-card p-10 animate-slideUp",style:{animationDelay:"0.2s"},children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10",children:[e.jsxs("div",{className:"flex items-center gap-5",children:[e.jsx("div",{className:"w-14 h-14 rounded-xl bg-orange-500 text-black border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]",children:e.jsx(Be,{size:28})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-black font-display tracking-tight text-white",children:"Detailed Persona Attributes"}),e.jsxs("p",{className:"text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1",children:["Specific details for your ",s," identity"]})]})]}),e.jsx("button",{type:"button",onClick:()=>{K(!z);try{H.capture("Toggle Detailed Form",{expanded:!z,persona:s})}catch{}},className:`px-6 py-2.5 border-[3px] border-black text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${z?"bg-white text-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none":"bg-orange-500 text-black shadow-[5px_5px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"}`,children:z?"Collapse Details":"Configure Details +25%"})]}),z&&e.jsxs("div",{className:"p-0 sm:p-2 animate-fadeIn",children:[["developer","dev"].includes(s)&&e.jsx(Le,{data:t,onChange:S,isOwner:!0,onUpload:J,uploading:L}),s==="student"&&e.jsx(ze,{data:t,onChange:S,onUpload:J,uploading:L}),M(s)&&e.jsx(Ee,{data:t,onChange:S,onUpload:J,uploading:L})]})]}),e.jsxs("section",{id:"achievements",className:"glass-card p-10 animate-slideUp",style:{animationDelay:"0.5s"},children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10",children:[e.jsxs("div",{className:"flex items-center gap-5",children:[e.jsx("div",{className:"w-14 h-14 rounded-xl bg-orange-500 text-black border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]",children:e.jsx(Ie,{size:28})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-black font-display tracking-tight text-white",children:"Achievements"}),e.jsx("p",{className:"text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1",children:"Trust & Authority"})]})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[((ie=t.achievements)==null?void 0:ie.length)>0?e.jsx("span",{className:"status-badge completed",children:"Completed ✅"}):e.jsx("span",{className:"status-badge missing",children:"Missing +10% ⚠️"}),e.jsx("button",{type:"button",onClick:()=>{Q(!E);try{H.capture("Toggle Achievements Form",{expanded:!E})}catch{}},className:`px-6 py-2.5 border-[3px] border-black text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${E?"bg-white text-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none":"bg-orange-500 text-black shadow-[5px_5px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"}`,children:E?"Collapse":"Add Achievements"})]})]}),E&&e.jsxs("div",{className:"space-y-6 animate-fadeIn",children:[e.jsx("p",{className:"text-[11px] text-neutral-400 font-medium leading-relaxed",children:"Boost trust with achievements (awards, milestones, or high-value certifications)."}),e.jsx(De,{value:t.achievements||[],onChange:a=>x("achievements",a),placeholder:"Add achievement (e.g., Verified on Instagram, Best Actor 2023)"})]})]})]})]}),s&&e.jsxs("div",{className:"hidden lg:block lg:fixed lg:top-[120px] lg:w-[350px] lg:right-[calc((100vw-1200px)/2+40px)] max-[1200px]:lg:right-10 z-30 phone-preview-fixed",children:[e.jsx("p",{className:"text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-3 text-center",children:"Live Preview Card"}),e.jsxs("div",{className:"relative mx-auto w-[350px] h-[680px] bg-black border-[12px] border-neutral-900 rounded-[56px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col ring-4 ring-neutral-800/80",children:[e.jsxs("div",{className:"absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-50 flex items-center justify-center",children:[e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800 mr-2"}),e.jsx("div",{className:"w-12 h-1 bg-neutral-950 rounded-full"})]}),e.jsx("div",{className:"flex-1 w-full h-full bg-[#0d1117] relative",children:e.jsx(we,{children:e.jsx(fe,{profile:re,hideHeader:!1})})})]})]})]})}),s&&e.jsx("button",{onClick:()=>Z(!0),className:"lg:hidden fixed bottom-28 right-6 z-50 w-12 h-12 rounded-full bg-orange-500 text-black border-[3px] border-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none flex items-center justify-center transition-all active:scale-95",title:"Show Live Preview",children:e.jsx(q,{size:20})}),ve&&e.jsx("div",{className:"fixed inset-0 z-[9999] lg:hidden bg-black/80 backdrop-blur-sm flex items-center justify-center p-4",children:e.jsxs("div",{className:"relative w-full max-w-[360px] h-[90vh] bg-black border-[12px] border-neutral-900 rounded-[56px] overflow-hidden flex flex-col shadow-2xl ring-4 ring-neutral-800/80",children:[e.jsx("button",{onClick:()=>Z(!1),className:"absolute top-4 right-4 z-[9999] w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center border border-white/10 hover:bg-neutral-850",children:e.jsx(Oe,{size:16})}),e.jsx("div",{className:"flex-1 w-full h-full bg-[#0d1117] relative",children:e.jsx(we,{children:e.jsx(fe,{profile:re,hideHeader:!1})})})]})}),s?e.jsxs("footer",{className:"relative md:fixed bottom-0 left-0 right-0 z-[60] bg-[#0a0a0a] border-t-[4px] border-white p-6 pb-8 flex flex-col items-center justify-center gap-3",children:[e.jsx("button",{onClick:te,disabled:b,className:"px-14 py-4 rounded-xl bg-orange-500 text-black border-[4px] border-black font-black text-xs uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all shadow-[6px_6px_0px_#000] disabled:opacity-50 flex items-center gap-2",children:b?"Saving Profile...":e.jsxs(e.Fragment,{children:[e.jsx(ge,{size:20})," Save Profile"]})}),e.jsxs("div",{className:"flex items-center gap-1.5 text-neutral-400",children:[e.jsx(Ge,{size:12}),e.jsx("span",{className:"text-[10px] font-bold uppercase tracking-widest",children:"Secured by KnoWMi Identity Cloud • End-to-End Encrypted"})]})]}):null]})}export{Qe as default};
