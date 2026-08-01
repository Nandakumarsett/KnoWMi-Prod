import{ba as Se,bk as Le,r as p,j as e,b7 as V,bb as h,b4 as $e}from"./vendor-DJ8AXdcW.js";import{u as Ae,A as ze,s as G}from"./index-B1b4VjcX.js";import{p as R,P as we}from"./personaConfig-Da-gqQz6.js";import{c as Pe}from"./completion-score-D5PUhF_l.js";import{D as Ee,S as De,C as Fe,T as Te}from"./CreatorForm-BwjRCy2v.js";import{g as Me,d as je,m as Ue,ai as Ie,ao as ve,am as q,U as Be,O as Oe,u as Ge,o as Re,X as Ye,y as He}from"./vendor-icons-CWTa-WjU.js";import"./vendor-supabase-BkJ-lukb.js";import"./vendor-animation-DPn91hQ9.js";const We=`
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
`,T={creator:{label:"Content Creator",emoji:"🎬",color:"#F97316",icon:je},developer:{label:"Tech",emoji:"💻",color:"#3B82F6",icon:Me},student:{label:"Student",emoji:"🎓",color:"#10B981",icon:Ue}},M=b=>{if(!b)return!1;const x=b.toLowerCase();return x.includes("creator")||["influencer","gamer","fitness"].includes(x)},X={first_name:"",last_name:"",bio:"",tagline:"",location:"",website:"",instagram:"",linkedin:"",github:"",twitter:"",youtube:"",threads:"",behance:"",dribbble:"",medium:"",twitch:"",whatsapp:"",est_year:"",avatar_url:"",skills:[],achievements:[],projects:[],works:[],platforms:[],collab_info:"",niche:"",total_reach:"",avg_engagement:"",profile_theme:"default"};function _e({children:b}){var B;const[x,m]=p.useState(null),[U,$]=p.useState(!1);p.useEffect(()=>{var C;if(!x)return;const g=x.contentDocument||((C=x.contentWindow)==null?void 0:C.document);if(!g)return;g.open(),g.write(`
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
    `),g.close();const O=g.head;document.querySelectorAll('link[rel="stylesheet"], style').forEach(s=>{O.appendChild(s.cloneNode(!0))}),$(!0)},[x]);const I=(B=x==null?void 0:x.contentDocument)==null?void 0:B.getElementById("preview-root");return e.jsx("iframe",{ref:m,className:"w-full h-full border-none bg-transparent",title:"Mobile Live Preview",children:U&&I&&$e.createPortal(b,I)})}function tt(){var le;const b=Se(),[x]=Le(),{user:m,refreshProfile:U,loading:$}=Ae(),[I,B]=p.useState(!0),[g,O]=p.useState(!1),[A,C]=p.useState(!1),[s,K]=p.useState(null),[i,Y]=p.useState(()=>{const a=x.get("persona");return a?["tech","dev","developer"].includes(a.toLowerCase())?"developer":a.toLowerCase():""}),[t,S]=p.useState({...X}),[z,Q]=p.useState(!1),[P,Z]=p.useState(!1),[ke,ee]=p.useState(!1);p.useEffect(()=>{!$&&!m&&b("/")},[m,$,b]),p.useEffect(()=>{async function a(){var r,o,l,c,u,w,E,j,oe,ce,de,pe,xe,me,he,ue,be;try{if(!m)return;const{data:v,error:fe}=await G.from("profiles").select("*").eq("user_id",m.id).maybeSingle();if(fe)throw fe;if(v){K(v);const D=((r=v.persona_data)==null?void 0:r.identities)||[];let k=x.get("persona"),F=x.get("edit");const Ne=x.get("mode")==="new";if(!k&&!F&&!Ne&&D.length>0){const _=D.find(y=>y.active)||D[0];k=_.persona_type,F=_.id,Y(k||""),b(`/studio?persona=${k}&edit=${F}`,{replace:!0})}else Y(k||"");const n=F?D.find(_=>_.id===F):D.find(_=>_.persona_type===k),Ce={first_name:v.first_name||"",last_name:v.last_name||"",bio:(n==null?void 0:n.bio)||((o=n==null?void 0:n.data)==null?void 0:o.bio)||"",instagram:((l=n==null?void 0:n.data)==null?void 0:l.instagram)||"",linkedin:((c=n==null?void 0:n.data)==null?void 0:c.linkedin)||"",github:((u=n==null?void 0:n.data)==null?void 0:u.github)||"",youtube:((w=n==null?void 0:n.data)==null?void 0:w.youtube)||"",twitter:((E=n==null?void 0:n.data)==null?void 0:E.twitter)||"",tiktok:((j=n==null?void 0:n.data)==null?void 0:j.tiktok)||"",twitch:((oe=n==null?void 0:n.data)==null?void 0:oe.twitch)||"",whatsapp:((ce=n==null?void 0:n.data)==null?void 0:ce.whatsapp)||"",avatar_url:(n==null?void 0:n.avatar_url)||((de=n==null?void 0:n.data)==null?void 0:de.avatar_url)||""};if(n){const _=((pe=n.data)==null?void 0:pe.skills)&&n.data.skills.length>0||((xe=n.data)==null?void 0:xe.projects)&&n.data.projects.length>0||((me=n.data)==null?void 0:me.experience)&&n.data.experience.length>0||((he=n.data)==null?void 0:he.education)&&n.data.education.length>0||((ue=n.data)==null?void 0:ue.custom_links)&&n.data.custom_links.length>0,y=((be=n.data)==null?void 0:be.achievements)&&n.data.achievements.length>0;Q(!!_),Z(!!y),S(N=>{const ge={...N,...Ce,...n.data||{}};try{const J=sessionStorage.getItem(`draft_persona_${k||""}`);if(J)return{...ge,...JSON.parse(J)}}catch{}return ge})}else x.get("mode")==="new"?S(_=>{const y={...X,first_name:v.first_name||"",last_name:v.last_name||"",avatar_url:""};try{const N=sessionStorage.getItem(`draft_persona_${k||""}`);if(N)return{...y,...JSON.parse(N)}}catch{}return y}):S(_=>{const y={...X,first_name:v.first_name||"",last_name:v.last_name||""};try{const N=sessionStorage.getItem(`draft_persona_${k||""}`);if(N)return{...y,...JSON.parse(N)}}catch{}return y})}}catch{}finally{B(!1)}}a()},[m]),p.useEffect(()=>{i&&t&&Object.keys(t).length>0&&(t.first_name!==""||t.last_name!==""||t.bio!==""||t.tagline!==""||t.about||t.tech_stack)&&sessionStorage.setItem(`draft_persona_${i}`,JSON.stringify(t))},[t,i]);const d=(a,r)=>{S(o=>({...o,[a]:r}))},te=async a=>{if(!a||a.size>2*1024*1024){h.error("Image must be less than 2MB");return}if(!(m!=null&&m.id)){h.error("Please log in to upload an image");return}try{C(!0);const r=a.name.split(".").pop(),o=`${m.id}-${Math.random()}.${r}`,{error:l}=await G.storage.from("avatars").upload(o,a);if(l)throw l;const c=`/content/avatars/${o}`;d("avatar_url",c)}catch(r){h.error("Upload failed: "+r.message)}finally{C(!1)}},H=async(a,r)=>{if(!a||a.size>50*1024*1024)return h.error("File must be less than 50MB"),null;if(!(m!=null&&m.id))return h.error("Please log in to upload a file"),null;try{C(!0);const o=a.name.split(".").pop(),l=`${m.id}/${r}-${Math.random()}.${o}`,{error:c}=await G.storage.from("avatars").upload(l,a);if(c)throw c;const u=`/content/avatars/${l}`;return!r.startsWith("work_media_")&&!r.includes("_project_media_")&&d(r,u),u}catch(o){return h.error("Upload failed: "+o.message),null}finally{C(!1)}},L=p.useMemo(()=>{if(!i)return[];const a=[];return!t.avatar_url&&!(s!=null&&s.avatar_url)&&a.push({id:"avatar_upload_input",label:"📸 Add Profile Photo",desc:"+25%"}),!t.first_name&&!(s!=null&&s.first_name)&&a.push({id:"first_name_input",label:"👤 Fill First & Last Name",desc:"+25%"}),!t.bio&&!t.tagline&&!(s!=null&&s.bio)&&a.push({id:"bio_input",label:"💬 Select 1-Tap Bio",desc:"+25%"}),t.instagram||t.linkedin||t.github||t.twitter||t.platforms&&t.platforms.length>0||a.push({id:"social_input_bar",label:"🌐 Connect 1 Social",desc:"+25%"}),a},[i,t,s]),ye=a=>{const r=document.getElementById(a);r&&(r.scrollIntoView({behavior:"smooth",block:"center"}),r.focus())},ae=a=>{if(a)try{const r=a.trim(),o=new URL(r.startsWith("http")?r:`https://${r}`),l=o.pathname.split("/").filter(Boolean);if(o.hostname.includes("instagram.com")&&l[0]){const c=l[0].replace(/^@/,"");d("instagram",c);const u=c.replace(/[_.]/g," ");t.first_name||d("first_name",u.charAt(0).toUpperCase()+u.slice(1)),h.success("✨ Instagram connected and handle pre-filled!")}else if(o.hostname.includes("linkedin.com")&&l[0]==="in"&&l[1]){const c=l[1].replace(/[-_]/g," ").split(" ");d("linkedin",l[1]),!t.first_name&&c[0]&&d("first_name",c[0].charAt(0).toUpperCase()+c[0].slice(1)),!t.last_name&&c[1]&&d("last_name",c[1].charAt(0).toUpperCase()+c[1].slice(1)),h.success("✨ LinkedIn connected and details pre-filled!")}else if(o.hostname.includes("github.com")&&l[0]){const c=l[0].replace(/^@/,"");d("github",c),t.first_name||d("first_name",c.charAt(0).toUpperCase()+c.slice(1)),h.success("✨ GitHub connected and details pre-filled!")}else if((o.hostname.includes("twitter.com")||o.hostname.includes("x.com"))&&l[0]){const c=l[0].replace(/^@/,"");d("twitter",c),t.first_name||d("first_name",c.charAt(0).toUpperCase()+c.slice(1)),h.success("✨ Twitter / X connected and details pre-filled!")}else if(o.hostname.includes("youtube.com")&&l[0]){const c=l[0].replace(/^@/,"");d("youtube",c),h.success("✨ YouTube channel connected!")}else h.error("URL format not recognized. Try pasting Instagram, LinkedIn, GitHub, or Twitter links.")}catch{h.error("Invalid URL format.")}},se=async()=>{var a;if(!m){h.error("You must be logged in to save.");return}O(!0);try{const r=((a=s==null?void 0:s.persona_data)==null?void 0:a.identities)||[],o=x.get("edit"),l=o?r.findIndex(j=>j.id===o):r.findIndex(j=>j.persona_type===i),c={id:l>=0?r[l].id:o||`id_${Date.now()}`,persona_type:i,avatar_url:t.avatar_url||"",first_name:t.first_name||(s==null?void 0:s.first_name),last_name:t.last_name||(s==null?void 0:s.last_name),bio:t.bio||"",active:!0,data:{...t,bio:t.bio||""}},u=r.map(j=>({...j,active:!1}));l>=0?u[l]=c:u.push(c);const w={};t.instagram&&(w.instagram_url=t.instagram),t.linkedin&&(w.linkedin_url=t.linkedin),t.github&&(w.github_url=t.github),t.youtube&&(w.youtube_url=t.youtube),t.twitter&&(w.twitter_url=t.twitter),t.tiktok&&(w.tiktok_url=t.tiktok),t.twitch&&(w.twitch_url=t.twitch);const{error:E}=await G.from("profiles").update({persona_type:i,avatar_url:c.avatar_url,persona_data:{...(s==null?void 0:s.persona_data)||{},identities:u},first_name:t.first_name,last_name:t.last_name,bio:t.bio,profile_theme:t.profile_theme||"default"}).eq("user_id",m.id);if(E){h.error("Failed to save: "+E.message);return}K({...s,persona:i,persona_type:i,profile_theme:t.profile_theme||"default",persona_data:{...(s==null?void 0:s.persona_data)||{},identities:u}}),sessionStorage.removeItem(`draft_persona_${i}`),h.success("Changes saved successfully! 🎉");try{V.capture("Save Persona Theme",{persona_type:i,profile_theme:t.profile_theme||"default",completion_score:f})}catch{}U&&U()}catch(r){h.error("Save failed: "+r.message)}finally{O(!1)}},{score:f,incomplete:re}=p.useMemo(()=>Pe(i||"creator",t),[i,t]),ie=p.useMemo(()=>{const a=(t.first_name||"").trim(),r=(t.last_name||"").trim(),o=[{platform:"instagram",url:t.instagram?`https://instagram.com/${t.instagram.replace(/^@/,"")}`:""},{platform:"linkedin",url:t.linkedin?t.linkedin.includes("linkedin.com")?t.linkedin:`https://linkedin.com/in/${t.linkedin}`:""},{platform:"github",url:t.github?t.github.includes("github.com")?t.github:`https://github.com/${t.github}`:""},{platform:"twitter",url:t.twitter?t.twitter.includes("twitter.com")?t.twitter:`https://twitter.com/${t.twitter}`:""},{platform:"youtube",url:t.youtube?t.youtube.includes("youtube.com")?t.youtube:`https://youtube.com/${t.youtube}`:""},{platform:"website",url:t.website||""},{platform:"whatsapp",url:t.whatsapp?`https://wa.me/${t.whatsapp.replace(/\D/g,"")}`:""}].filter(l=>l.url);return{id:(s==null?void 0:s.id)||"preview-id",user_id:(s==null?void 0:s.user_id)||null,username:a.toLowerCase()||"preview",display_name:a&&r?`${a} ${r}`:a||r||"Your Name",first_name:a,last_name:r,avatar_url:t.avatar_url,member_id:(s==null?void 0:s.wm_code)||"WM-PREVIEW-001",persona:i,mood:t.mood||"Expressive & Curious",bio:t.bio||"",pulse:f||20,tier:(s==null?void 0:s.status)==="paid"?"Creator":"Starter",status:(s==null?void 0:s.status)||"free",is_verified:(s==null?void 0:s.is_verified)??!1,joined_at:(s==null?void 0:s.created_at)||new Date().toISOString(),views:0,top_location:"India",ghost_mode:!1,profile_theme:t.profile_theme||"default",social_links:o,persona_data:{...t,identities:[{active:!0,persona_type:i,first_name:a,last_name:r,avatar_url:t.avatar_url,bio:t.bio,data:{...t}}],[i]:{...t}}}},[t,i,s,f]),W=p.useMemo(()=>{const a=(i||"creator").toLowerCase();return["tech","dev","developer"].includes(a)?R.developer:M(a)?R.creator:R[a]||R.creator},[i]),ne=p.useMemo(()=>{const a=(i||"creator").toLowerCase();return["tech","dev","developer"].includes(a)?T.developer:M(a)?T.creator:T[a]||T.creator},[i]);return p.useMemo(()=>f===100?"Your profile is optimized for maximum impact! You're ready to dominate.":f>=80?"Excellent work. Just a few more details to reach elite status.":f>=50?`You're ${f}% complete. Every detail you add builds more trust with your visitors.`:"Let's build a powerful identity. Start with the basics to get noticed.",[f,re]),re.slice(0,3),I||$?e.jsx("div",{className:"studio-page flex items-center justify-center",children:e.jsx("div",{className:"w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"})}):e.jsxs("div",{className:"studio-page pb-40",children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:We}}),e.jsx("header",{className:"sticky top-0 z-50 bg-[#0a0a0a] border-b-[4px] border-white",children:e.jsxs("div",{className:"max-w-[1000px] mx-auto px-4 sm:px-6 min-h-[80px] py-4 flex flex-row items-center justify-between gap-2 sm:gap-4",children:[e.jsxs("div",{className:"flex items-center gap-3 sm:gap-4 flex-1 min-w-0",children:[e.jsx("button",{onClick:()=>b("/dashboard?tab=profile"),className:"w-10 h-10 shrink-0 rounded-xl bg-white text-black border-[3px] border-black shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center transition-all",children:e.jsx(Ie,{size:20})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("h1",{className:"text-lg sm:text-xl font-black font-display tracking-tight truncate",children:["Build your"," ",i?((W==null?void 0:W.name)||i.charAt(0).toUpperCase()+i.slice(1))+" ":"","Identity ",i?ne.emoji:"✨"]}),e.jsx("p",{className:"text-[9px] sm:text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5 truncate",children:i?"Complete your profile to unlock more visibility":"Choose your path to begin"})]})]}),i?e.jsxs("div",{className:"flex items-center gap-4 shrink-0",children:[e.jsxs("button",{onClick:se,disabled:g,className:"hidden md:flex px-6 py-2.5 bg-orange-500 text-black border-[3px] border-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all items-center gap-2 shadow-[4px_4px_0px_#000] disabled:opacity-50",children:[g?e.jsx("div",{className:"w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"}):e.jsx(ve,{size:14}),"Save Changes"]}),e.jsxs("div",{className:"text-right hidden md:block",children:[e.jsx("p",{className:"text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1",children:"Strength"}),e.jsx("p",{className:"text-xs font-bold text-orange-500",children:f>=80?"Elite Level Achieved! 🏆":"Good progress. Let's hit 80% 🚀"})]}),e.jsxs("div",{className:"relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0",children:[e.jsxs("svg",{className:"w-full h-full transform -rotate-90",children:[e.jsx("circle",{cx:"50%",cy:"50%",r:"40%",stroke:"#F1F1EF",strokeWidth:"4",fill:"transparent"}),e.jsx("circle",{cx:"50%",cy:"50%",r:"40%",stroke:ne.color,strokeWidth:"4",fill:"transparent",strokeDasharray:"251",strokeDashoffset:251*(1-f/100),strokeLinecap:"round",className:"progress-ring"})]}),e.jsxs("span",{className:"absolute text-[9px] sm:text-[10px] font-black",children:[f,"%"]})]})]}):null]})}),e.jsx("main",{className:"max-w-[1200px] mx-auto px-4 sm:px-6 py-10",children:e.jsxs("div",{className:i?"grid grid-cols-1 lg:grid-cols-[1fr_385px] gap-10 items-start":"max-w-[1000px] mx-auto",children:[e.jsxs("div",{className:"space-y-12 w-full min-w-0",children:[!i&&e.jsxs("section",{className:"space-y-6",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 rounded-xl bg-orange-500 text-black flex items-center justify-center font-black text-lg border-[3px] border-black shadow-[4px_4px_0px_#000]",children:"01"}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-display font-black text-white",children:"Choose Your Path"}),e.jsx("p",{className:"text-[10px] font-bold text-neutral-400 uppercase tracking-widest",children:"Select your core identity theme"})]})]}),e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-6",children:Object.entries(T).filter(([a])=>{var o;return!(((o=s==null?void 0:s.persona_data)==null?void 0:o.identities)||[]).some(l=>l.persona_type===a)}).map(([a,r])=>e.jsxs("div",{onClick:()=>{Y(a),b(`/studio?persona=${a}&mode=new`,{replace:!0})},className:"glass-card group p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-orange-500 transition-all",children:[e.jsx("div",{className:"w-16 h-16 rounded-xl bg-[#0a0a0a] border-[3px] border-white flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform",children:r.emoji}),e.jsx("h3",{className:"text-lg font-black uppercase tracking-wider",children:r.label||a}),e.jsx("p",{className:"text-[10px] text-neutral-400 font-bold uppercase mt-1",children:"Select Protocol"})]},a))})]}),i&&e.jsxs(e.Fragment,{children:[e.jsx("section",{className:"glass-card p-10 animate-slideUp mb-8 bg-[#1a1a1a]",children:e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-6",children:[e.jsxs("div",{className:"flex items-center gap-5",children:[e.jsx("div",{className:"w-14 h-14 rounded-xl bg-orange-500 text-black border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]",children:e.jsx(q,{size:28})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-black font-display tracking-tight text-white",children:"Public Profile"}),e.jsx("p",{className:"text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1",children:"See how your identity looks to the world"})]})]}),e.jsxs("button",{onClick:()=>b(`/p/${(s==null?void 0:s.username)||(s==null?void 0:s.id)}?from=studio`),className:"px-6 py-3 bg-white text-black border-[3px] border-black rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center gap-2 shrink-0",children:[e.jsx(q,{size:16})," View Profile"]})]})}),e.jsxs("div",{className:"glass-card p-6 bg-gradient-to-r from-orange-500/10 via-[#1a1a1a] to-orange-500/5 border-2 border-orange-500/30 rounded-2xl mb-8 animate-fadeIn",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-xl bg-orange-500 text-black border-2 border-black font-black flex items-center justify-center shadow-[3px_3px_0px_#000]",children:"⚡"}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-base font-black uppercase tracking-wider text-white",children:"Fast-Track Setup"}),e.jsx("p",{className:"text-[10px] font-bold text-neutral-400 uppercase tracking-widest",children:L.length===0?"🎉 Core profile 100% complete! Your card is ready.":`${4-L.length}/4 Core Steps Completed`})]})]}),L.length===0?e.jsx("span",{className:"px-4 py-1.5 bg-green-500/20 text-green-400 border border-green-500/40 text-[10px] font-black uppercase tracking-widest rounded-full",children:"100% Core Ready ✨"}):e.jsxs("span",{className:"px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] font-black uppercase tracking-widest rounded-full",children:[L.length," Quick Action",L.length>1?"s":""," Left"]})]}),L.length>0&&e.jsx("div",{className:"flex flex-wrap gap-2.5 mt-2",children:L.map(a=>e.jsxs("button",{onClick:()=>ye(a.id),className:"px-4 py-2.5 bg-[#0a0a0a] hover:bg-orange-500 hover:text-black text-white border-2 border-neutral-700 hover:border-black rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-[3px_3px_0px_#000] active:translate-y-[1px]",children:[e.jsx("span",{children:a.label}),e.jsxs("span",{className:"text-[9px] opacity-70",children:["(",a.desc,")"]})]},a.id))})]}),e.jsxs("section",{id:"tagline",className:"glass-card p-10 animate-slideUp",children:[e.jsxs("div",{className:"flex items-center justify-between mb-10",children:[e.jsxs("div",{className:"flex items-center gap-5",children:[e.jsx("div",{className:"w-14 h-14 rounded-xl bg-orange-500 text-black border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]",children:e.jsx(Be,{size:28})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-black font-display tracking-tight text-white",children:"Basic Identity"}),e.jsx("p",{className:"text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1",children:"Foundational profile details"})]})]}),t.tagline&&e.jsx("span",{className:"status-badge completed",children:"Completed ✅"})]}),e.jsxs("div",{id:"social_input_bar",className:"p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl mb-8 flex flex-col sm:flex-row items-center gap-3",children:[e.jsxs("div",{className:"flex items-center gap-2 shrink-0",children:[e.jsx(je,{size:16,className:"text-orange-500 animate-pulse"}),e.jsx("span",{className:"text-[11px] font-black uppercase tracking-wider text-orange-400",children:"1-Click Pre-fill:"})]}),e.jsx("input",{type:"text",placeholder:"Paste LinkedIn, Instagram, or GitHub profile link...",className:"w-full bg-[#0a0a0a] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-orange-500 transition-colors",onPaste:a=>{const r=a.clipboardData.getData("text");r&&ae(r)},onChange:a=>{(a.target.value.includes("http")||a.target.value.includes(".com"))&&ae(a.target.value)}})]}),e.jsxs("div",{id:"avatar_upload_input",className:"flex items-center gap-8 pb-10 mb-10 border-b border-neutral-100",children:[e.jsxs("div",{className:"relative group",children:[e.jsxs("div",{className:"w-24 h-24 rounded-xl bg-[#0a0a0a] border-[4px] border-white shadow-[6px_6px_0px_#fff] overflow-hidden group-hover:scale-105 transition-transform duration-500",children:[e.jsx(ze,{src:t.avatar_url,name:`${t.first_name} ${t.last_name}`,username:(s==null?void 0:s.secure_slug)||(s==null?void 0:s.id),size:"w-full h-full text-4xl"}),A&&e.jsx("div",{className:"absolute inset-0 bg-black/40 flex items-center justify-center",children:e.jsx("div",{className:"w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"})})]}),e.jsxs("label",{className:"absolute -bottom-2 -right-2 w-10 h-10 bg-orange-500 border-[3px] border-black rounded-lg shadow-[3px_3px_0px_#000] flex items-center justify-center text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer",children:[e.jsx(Oe,{size:18}),e.jsx("input",{type:"file",accept:"image/*",className:"hidden",onChange:a=>{var r;return((r=a.target.files)==null?void 0:r[0])&&te(a.target.files[0])}})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-xl font-black text-white mb-1 tracking-tighter",children:t.first_name||t.last_name?`${t.first_name} ${t.last_name}`:"New Identity"}),e.jsx("p",{className:"text-[10px] text-neutral-400 font-bold mb-4 uppercase tracking-widest",children:"JPG or PNG • Max 2MB"}),e.jsxs("div",{className:"flex gap-3",children:[e.jsxs("label",{className:"px-4 py-2 bg-white text-black border-[2px] border-black shadow-[2px_2px_0px_#000] text-[9px] font-black uppercase tracking-widest rounded-lg hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer",children:["Upload New",e.jsx("input",{type:"file",accept:"image/*",className:"hidden",onChange:a=>{var r;return((r=a.target.files)==null?void 0:r[0])&&te(a.target.files[0])}})]}),e.jsx("button",{onClick:()=>d("avatar_url",""),className:"px-4 py-2 bg-white border border-neutral-200 text-neutral-600 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-neutral-50 transition-colors",children:"Remove"})]})]})]}),e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"First Name"}),e.jsx("input",{id:"first_name_input",type:"text",placeholder:"Enter first name",className:"input-field",value:t.first_name,maxLength:50,onChange:a=>d("first_name",a.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"Last Name"}),e.jsx("input",{type:"text",placeholder:"Enter last name",className:"input-field",value:t.last_name,maxLength:50,onChange:a=>d("last_name",a.target.value)})]})]}),M(i)&&e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"Location Name"}),e.jsx("input",{type:"text",placeholder:"e.g. Mumbai, India",className:"input-field",value:t.location,maxLength:100,onChange:a=>d("location",a.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"Established Since"}),e.jsx("input",{type:"text",placeholder:"e.g. 2021",className:"input-field",value:t.est_year,maxLength:4,onChange:a=>{const r=a.target.value.replace(/\D/g,"");d("est_year",r)}})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"Profile Theme"}),e.jsx("div",{className:"grid grid-cols-4 gap-2",children:(()=>{let a=["default","classic","minimal","neon"];return["tech","dev","developer"].includes((i==null?void 0:i.toLowerCase())||"")?a=["default","classic","blueprint","hacker"]:i!=null&&i.toLowerCase().includes("student")&&(a=["default","classic","campus","night owl"]),a.map(r=>{var o,l;return e.jsx("div",{onClick:()=>d("profile_theme",r),className:`p-3 rounded-xl border-[3px] cursor-pointer transition-all text-center flex flex-col justify-center items-center ${(((o=t.profile_theme)==null?void 0:o.toLowerCase())||"default")===r?"border-orange-500 bg-orange-500 text-black shadow-[4px_4px_0px_#000] translate-y-[2px] translate-x-[2px]":"border-white bg-[#0a0a0a] hover:border-orange-500 shadow-[4px_4px_0px_#fff]"}`,children:e.jsx("p",{className:`text-[10px] font-black uppercase tracking-wider ${(((l=t.profile_theme)==null?void 0:l.toLowerCase())||"default")===r?"text-black":"text-neutral-400"}`,children:r==="default"?["tech","dev","developer"].includes((i==null?void 0:i.toLowerCase())||"")?"Terminal":i!=null&&i.toLowerCase().includes("student")?"Notebook":"Glow":r==="classic"?"Classic":r})},r)})})()})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"section-label",children:["Public Bio",!t.bio&&e.jsx("span",{className:"ml-auto text-orange-400 font-bold text-[9px] uppercase tracking-widest animate-pulse",children:"← Tap a vibe to fill instantly"})]}),e.jsx("textarea",{id:"bio_input",placeholder:"Tell the world who you are...",className:"input-field min-h-[100px] py-4",value:t.bio,maxLength:500,onChange:a=>d("bio",a.target.value)}),e.jsxs("div",{className:"flex flex-wrap gap-2 mt-3",children:[(M(i)?[{emoji:"🎬",label:"Creator",bio:"Creating content that connects and inspires. Building community one story at a time."},{emoji:"✨",label:"Visionary",bio:"Turning ideas into viral moments. Here to make noise and leave a mark."},{emoji:"🌍",label:"Storyteller",bio:"Authentic storyteller. Brand collaborator. Helping people discover what they love."},{emoji:"🚀",label:"Ambitious",bio:"Growing every day. Content is my craft, community is my purpose."}]:i!=null&&i.toLowerCase().includes("student")?[{emoji:"🎓",label:"Learner",bio:"Forever a student. Building skills, chasing goals, and making the most of every opportunity."},{emoji:"💡",label:"Builder",bio:"Student by day, builder by night. Learning, experimenting, and sharing the journey."},{emoji:"🌱",label:"Growing",bio:"Early in the journey but full of drive. Open to learning, networking, and growing."},{emoji:"🔥",label:"Hustler",bio:"Studying hard, building harder. Future-focused and ready to create real impact."}]:[{emoji:"💻",label:"Tech",bio:"Building things that matter. Passionate about technology, clean code, and solving real problems."},{emoji:"🚀",label:"Ambitious",bio:"Shipping products, solving problems, and levelling up every day. Open to collabs."},{emoji:"⚡",label:"Minimal",bio:"Code. Create. Repeat. Focused on building with purpose."},{emoji:"🌐",label:"Open",bio:"Developer, maker, and community contributor. Let's build something great together."}]).map(a=>e.jsxs("button",{type:"button",onClick:()=>d("bio",a.bio),className:"flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-white/20 bg-white/5 hover:bg-orange-500/20 hover:border-orange-500 text-[11px] font-bold text-neutral-300 hover:text-white transition-all",title:a.bio,children:[e.jsx("span",{children:a.emoji}),e.jsx("span",{children:a.label})]},a.label)),t.bio&&e.jsx("button",{type:"button",onClick:()=>d("bio",""),className:"flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-[11px] font-bold text-red-400 hover:text-red-300 transition-all",children:"Clear"})]})]})]})]}),e.jsxs("section",{id:"detailed_attributes",className:"glass-card p-10 animate-slideUp",style:{animationDelay:"0.2s"},children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10",children:[e.jsxs("div",{className:"flex items-center gap-5",children:[e.jsx("div",{className:"w-14 h-14 rounded-xl bg-orange-500 text-black border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]",children:e.jsx(Ge,{size:28})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-black font-display tracking-tight text-white",children:"Detailed Persona Attributes"}),e.jsxs("p",{className:"text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1",children:["Specific details for your ",i," identity"]})]})]}),e.jsx("button",{type:"button",onClick:()=>{Q(!z);try{V.capture("Toggle Detailed Form",{expanded:!z,persona:i})}catch{}},className:`px-6 py-2.5 border-[3px] border-black text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${z?"bg-white text-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none":"bg-orange-500 text-black shadow-[5px_5px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"}`,children:z?"Collapse Details":"Configure Details +25%"})]}),z&&e.jsxs("div",{className:"p-0 sm:p-2 animate-fadeIn",children:[["developer","dev"].includes(i)&&e.jsx(Ee,{data:t,onChange:S,isOwner:!0,onUpload:H,uploading:A}),i==="student"&&e.jsx(De,{data:t,onChange:S,onUpload:H,uploading:A}),M(i)&&e.jsx(Fe,{data:t,onChange:S,onUpload:H,uploading:A})]})]}),e.jsxs("section",{id:"achievements",className:"glass-card p-10 animate-slideUp",style:{animationDelay:"0.5s"},children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10",children:[e.jsxs("div",{className:"flex items-center gap-5",children:[e.jsx("div",{className:"w-14 h-14 rounded-xl bg-orange-500 text-black border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]",children:e.jsx(Re,{size:28})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-black font-display tracking-tight text-white",children:"Achievements"}),e.jsx("p",{className:"text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1",children:"Trust & Authority"})]})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[((le=t.achievements)==null?void 0:le.length)>0?e.jsx("span",{className:"status-badge completed",children:"Completed ✅"}):e.jsx("span",{className:"status-badge missing",children:"Missing +10% ⚠️"}),e.jsx("button",{type:"button",onClick:()=>{Z(!P);try{V.capture("Toggle Achievements Form",{expanded:!P})}catch{}},className:`px-6 py-2.5 border-[3px] border-black text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${P?"bg-white text-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none":"bg-orange-500 text-black shadow-[5px_5px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"}`,children:P?"Collapse":"Add Achievements"})]})]}),P&&e.jsxs("div",{className:"space-y-6 animate-fadeIn",children:[e.jsx("p",{className:"text-[11px] text-neutral-400 font-medium leading-relaxed",children:"Boost trust with achievements (awards, milestones, or high-value certifications)."}),e.jsx(Te,{value:t.achievements||[],onChange:a=>d("achievements",a),placeholder:"Add achievement (e.g., Verified on Instagram, Best Actor 2023)"})]})]})]})]}),i&&e.jsxs("div",{className:"hidden lg:block lg:fixed lg:top-[120px] lg:w-[350px] lg:right-[calc((100vw-1200px)/2+40px)] max-[1200px]:lg:right-10 z-30 phone-preview-fixed",children:[e.jsx("p",{className:"text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-3 text-center",children:"Live Preview Card"}),e.jsxs("div",{className:"relative mx-auto w-[350px] h-[680px] bg-black border-[12px] border-neutral-900 rounded-[56px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col ring-4 ring-neutral-800/80",children:[e.jsxs("div",{className:"absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-50 flex items-center justify-center",children:[e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800 mr-2"}),e.jsx("div",{className:"w-12 h-1 bg-neutral-950 rounded-full"})]}),e.jsx("div",{className:"flex-1 w-full h-full bg-[#0d1117] relative",children:e.jsx(_e,{children:e.jsx(we,{profile:ie,hideHeader:!1})})})]})]})]})}),i&&e.jsx("button",{onClick:()=>ee(!0),className:"lg:hidden fixed bottom-28 right-6 z-50 w-12 h-12 rounded-full bg-orange-500 text-black border-[3px] border-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none flex items-center justify-center transition-all active:scale-95",title:"Show Live Preview",children:e.jsx(q,{size:20})}),ke&&e.jsx("div",{className:"fixed inset-0 z-[9999] lg:hidden bg-black/80 backdrop-blur-sm flex items-center justify-center p-4",children:e.jsxs("div",{className:"relative w-full max-w-[360px] h-[90vh] bg-black border-[12px] border-neutral-900 rounded-[56px] overflow-hidden flex flex-col shadow-2xl ring-4 ring-neutral-800/80",children:[e.jsx("button",{onClick:()=>ee(!1),className:"absolute top-4 right-4 z-[9999] w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center border border-white/10 hover:bg-neutral-850",children:e.jsx(Ye,{size:16})}),e.jsx("div",{className:"flex-1 w-full h-full bg-[#0d1117] relative",children:e.jsx(_e,{children:e.jsx(we,{profile:ie,hideHeader:!1})})})]})}),i?e.jsxs("footer",{className:"relative md:fixed bottom-0 left-0 right-0 z-[60] bg-[#0a0a0a] border-t-[4px] border-white p-6 pb-8 flex flex-col items-center justify-center gap-3",children:[e.jsx("button",{onClick:se,disabled:g,className:"px-14 py-4 rounded-xl bg-orange-500 text-black border-[4px] border-black font-black text-xs uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all shadow-[6px_6px_0px_#000] disabled:opacity-50 flex items-center gap-2",children:g?"Saving Profile...":e.jsxs(e.Fragment,{children:[e.jsx(ve,{size:20})," Save Profile"]})}),e.jsxs("div",{className:"flex items-center gap-1.5 text-neutral-400",children:[e.jsx(He,{size:12}),e.jsx("span",{className:"text-[10px] font-bold uppercase tracking-widest",children:"Secured by KnoWMi Identity Cloud • End-to-End Encrypted"})]})]}):null]})}export{tt as default};
