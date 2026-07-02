import{b9 as se,bi as re,r as d,j as e,ba as v}from"./vendor-DEPEQOfQ.js";import{u as ie,A as ne,s as U}from"./index-DETV8ggI.js";import{c as le}from"./completion-score-D5PUhF_l.js";import{D as oe,S as ce,C as de,T as xe}from"./CreatorForm-DKpELIAj.js";import{p as M}from"./personaConfig-kq04fUx4.js";import{g as pe,d as me,m as he,ai as ue,ao as K,am as Q,U as fe,O as be,u as ge,o as ve,y as we}from"./vendor-icons-Dk6crnUy.js";import"./vendor-supabase-CYEKtbMV.js";import"./vendor-animation-BNaKi-4Q.js";const je=`
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
    border-radius: 12px;
    box-shadow: 8px 8px 0px #fff;
    border: 4px solid #fff;
    transition: all 0.3s ease;
  }
  
  .glass-card:hover {
    box-shadow: none;
    transform: translate(2px, 2px);
  }

  .input-field {
    width: 100%;
    padding: 12px 16px;
    background: #0a0a0a;
    border: 3px solid #fff;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 800;
    transition: all 0.2s;
    outline: none;
    color: white;
    box-shadow: 4px 4px 0px #fff;
  }
  
  .input-field:focus {
    border-color: #F97316;
    box-shadow: 4px 4px 0px #F97316;
  }

  .section-label {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #a3a3a3;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 3px solid #333;
    padding-bottom: 4px;
  }

  .chip {
    padding: 8px 16px;
    background: #1a1a1a;
    border: 3px solid #fff;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 900;
    cursor: pointer;
    transition: all 0.2s;
    color: white;
    text-transform: uppercase;
    box-shadow: 4px 4px 0px #fff;
  }

  .chip:hover {
    transform: translate(2px, 2px);
    box-shadow: none;
  }

  .chip.active {
    background: #F97316;
    color: black;
    border-color: #000;
    box-shadow: 4px 4px 0px #000;
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
`,$={creator:{label:"Content Creator",emoji:"🎬",color:"#F97316",icon:me},developer:{label:"Tech",emoji:"💻",color:"#3B82F6",icon:pe},student:{label:"Student",emoji:"🎓",color:"#10B981",icon:he}},A=k=>{if(!k)return!1;const w=k.toLowerCase();return w.includes("creator")||["influencer","gamer","fitness"].includes(w)},B={first_name:"",last_name:"",bio:"",tagline:"",location:"",website:"",instagram:"",linkedin:"",github:"",twitter:"",youtube:"",threads:"",behance:"",dribbble:"",medium:"",twitch:"",whatsapp:"",est_year:"",avatar_url:"",skills:[],achievements:[],projects:[],works:[],platforms:[],collab_info:"",niche:"",total_reach:"",avg_engagement:"",profile_theme:"default"};function ze(){const k=se(),[w]=re(),{user:c,refreshProfile:O}=ie(),[Z,ee]=d.useState(!0),[z,I]=d.useState(!1),[E,F]=d.useState(!1),[n,G]=d.useState(null),[s,P]=d.useState(()=>{const a=w.get("persona");return a?["tech","dev","developer"].includes(a.toLowerCase())?"developer":a.toLowerCase():""}),[t,N]=d.useState({...B});d.useEffect(()=>{async function a(){var r,l,o,x,h,u,C,y,q,V,X;try{if(!c)return;const{data:f,error:H}=await U.from("profiles").select("*").eq("user_id",c.id).maybeSingle();if(H)throw H;if(f){G(f);const S=((r=f.persona_data)==null?void 0:r.identities)||[];let j=w.get("persona"),L=w.get("edit");const te=w.get("mode")==="new";if(!j&&!L&&!te&&S.length>0){const b=S.find(g=>g.active)||S[0];j=b.persona_type,L=b.id,P(j||""),k(`/studio?persona=${j}&edit=${L}`,{replace:!0})}else P(j||"");const i=L?S.find(b=>b.id===L):S.find(b=>b.persona_type===j),ae={first_name:f.first_name||"",last_name:f.last_name||"",bio:(i==null?void 0:i.bio)||((l=i==null?void 0:i.data)==null?void 0:l.bio)||"",instagram:((o=i==null?void 0:i.data)==null?void 0:o.instagram)||"",linkedin:((x=i==null?void 0:i.data)==null?void 0:x.linkedin)||"",github:((h=i==null?void 0:i.data)==null?void 0:h.github)||"",youtube:((u=i==null?void 0:i.data)==null?void 0:u.youtube)||"",twitter:((C=i==null?void 0:i.data)==null?void 0:C.twitter)||"",tiktok:((y=i==null?void 0:i.data)==null?void 0:y.tiktok)||"",twitch:((q=i==null?void 0:i.data)==null?void 0:q.twitch)||"",whatsapp:((V=i==null?void 0:i.data)==null?void 0:V.whatsapp)||"",avatar_url:(i==null?void 0:i.avatar_url)||((X=i==null?void 0:i.data)==null?void 0:X.avatar_url)||""};i?N(b=>{const g={...b,...ae,...i.data||{}};try{const p=sessionStorage.getItem(`draft_persona_${j||""}`);if(p)return{...g,...JSON.parse(p)}}catch{}return g}):w.get("mode")==="new"?N(b=>{const g={...B,first_name:f.first_name||"",last_name:f.last_name||"",avatar_url:""};try{const p=sessionStorage.getItem(`draft_persona_${j||""}`);if(p)return{...g,...JSON.parse(p)}}catch{}return g}):N(b=>{const g={...B,first_name:f.first_name||"",last_name:f.last_name||""};try{const p=sessionStorage.getItem(`draft_persona_${j||""}`);if(p)return{...g,...JSON.parse(p)}}catch{}return g})}}catch{}finally{ee(!1)}}a()},[c]),d.useEffect(()=>{s&&t&&Object.keys(t).length>0&&(t.first_name!==""||t.last_name!==""||t.bio!==""||t.tagline!==""||t.about||t.tech_stack)&&sessionStorage.setItem(`draft_persona_${s}`,JSON.stringify(t))},[t,s]);const m=(a,r)=>{N(l=>({...l,[a]:r}))},J=async a=>{if(!a||a.size>2*1024*1024){v.error("Image must be less than 2MB");return}if(!(c!=null&&c.id)){v.error("Please log in to upload an image");return}try{F(!0);const r=a.name.split(".").pop(),l=`${c.id}-${Math.random()}.${r}`,{error:o}=await U.storage.from("avatars").upload(l,a);if(o)throw o;const x=`/content/avatars/${l}`;m("avatar_url",x)}catch(r){v.error("Upload failed: "+r.message)}finally{F(!1)}},T=async(a,r)=>{if(!a||a.size>50*1024*1024)return v.error("File must be less than 50MB"),null;if(!(c!=null&&c.id))return v.error("Please log in to upload a file"),null;try{F(!0);const l=a.name.split(".").pop(),o=`${c.id}/${r}-${Math.random()}.${l}`,{error:x}=await U.storage.from("avatars").upload(o,a);if(x)throw x;const h=`/content/avatars/${o}`;return!r.startsWith("work_media_")&&!r.includes("_project_media_")&&m(r,h),h}catch(l){return v.error("Upload failed: "+l.message),null}finally{F(!1)}},Y=async()=>{var a;if(!c){v.error("You must be logged in to save.");return}I(!0);try{const r=((a=n==null?void 0:n.persona_data)==null?void 0:a.identities)||[],l=w.get("edit"),o=l?r.findIndex(y=>y.id===l):r.findIndex(y=>y.persona_type===s),x={id:o>=0?r[o].id:l||`id_${Date.now()}`,persona_type:s,avatar_url:t.avatar_url||"",first_name:t.first_name||(n==null?void 0:n.first_name),last_name:t.last_name||(n==null?void 0:n.last_name),bio:t.bio||"",active:!0,data:{...t,bio:t.bio||""}},h=r.map(y=>({...y,active:!1}));o>=0?h[o]=x:h.push(x);const u={};t.instagram&&(u.instagram_url=t.instagram),t.linkedin&&(u.linkedin_url=t.linkedin),t.github&&(u.github_url=t.github),t.youtube&&(u.youtube_url=t.youtube),t.twitter&&(u.twitter_url=t.twitter),t.tiktok&&(u.tiktok_url=t.tiktok),t.twitch&&(u.twitch_url=t.twitch);const{error:C}=await U.from("profiles").update({persona_type:s,avatar_url:x.avatar_url,persona_data:{...(n==null?void 0:n.persona_data)||{},identities:h},first_name:t.first_name,last_name:t.last_name,bio:t.bio,profile_theme:t.profile_theme||"default"}).eq("user_id",c.id);if(C){v.error("Failed to save: "+C.message);return}G({...n,persona:s,persona_type:s,profile_theme:t.profile_theme||"default",persona_data:{...(n==null?void 0:n.persona_data)||{},identities:h}}),sessionStorage.removeItem(`draft_persona_${s}`),v.success("Changes saved successfully! 🎉"),O&&O()}catch(r){v.error("Save failed: "+r.message)}finally{I(!1)}},{score:_,incomplete:W}=d.useMemo(()=>le(s||"creator",t),[s,t]),D=d.useMemo(()=>{const a=(s||"creator").toLowerCase();return["tech","dev","developer"].includes(a)?M.developer:A(a)?M.creator:M[a]||M.creator},[s]),R=d.useMemo(()=>{const a=(s||"creator").toLowerCase();return["tech","dev","developer"].includes(a)?$.developer:A(a)?$.creator:$[a]||$.creator},[s]);return d.useMemo(()=>_===100?"Your profile is optimized for maximum impact! You're ready to dominate.":_>=80?"Excellent work. Just a few more details to reach elite status.":_>=50?`You're ${_}% complete. Every detail you add builds more trust with your visitors.`:"Let's build a powerful identity. Start with the basics to get noticed.",[_,W]),W.slice(0,3),Z?e.jsx("div",{className:"studio-page flex items-center justify-center",children:e.jsx("div",{className:"w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"})}):e.jsxs("div",{className:"studio-page pb-40",children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:je}}),e.jsx("header",{className:"sticky top-0 z-50 bg-[#0a0a0a] border-b-[4px] border-white",children:e.jsxs("div",{className:"max-w-[1000px] mx-auto px-4 sm:px-6 min-h-[80px] py-4 flex flex-row items-center justify-between gap-2 sm:gap-4",children:[e.jsxs("div",{className:"flex items-center gap-3 sm:gap-4 flex-1 min-w-0",children:[e.jsx("button",{onClick:()=>k("/dashboard?tab=profile"),className:"w-10 h-10 shrink-0 rounded-xl bg-white text-black border-[3px] border-black shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center transition-all",children:e.jsx(ue,{size:20})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("h1",{className:"text-lg sm:text-xl font-black font-display tracking-tight truncate",children:["Build your"," ",s?((D==null?void 0:D.name)||s.charAt(0).toUpperCase()+s.slice(1))+" ":"","Identity ",s?R.emoji:"✨"]}),e.jsx("p",{className:"text-[9px] sm:text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5 truncate",children:s?"Complete your profile to unlock more visibility":"Choose your path to begin"})]})]}),s?e.jsxs("div",{className:"flex items-center gap-4 shrink-0",children:[e.jsxs("button",{onClick:Y,disabled:z,className:"hidden md:flex px-6 py-2.5 bg-orange-500 text-black border-[3px] border-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all items-center gap-2 shadow-[4px_4px_0px_#000] disabled:opacity-50",children:[z?e.jsx("div",{className:"w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"}):e.jsx(K,{size:14}),"Save Changes"]}),e.jsxs("div",{className:"text-right hidden md:block",children:[e.jsx("p",{className:"text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1",children:"Strength"}),e.jsx("p",{className:"text-xs font-bold text-orange-500",children:_>=80?"Elite Level Achieved! 🏆":"Good progress. Let's hit 80% 🚀"})]}),e.jsxs("div",{className:"relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0",children:[e.jsxs("svg",{className:"w-full h-full transform -rotate-90",children:[e.jsx("circle",{cx:"50%",cy:"50%",r:"40%",stroke:"#F1F1EF",strokeWidth:"4",fill:"transparent"}),e.jsx("circle",{cx:"50%",cy:"50%",r:"40%",stroke:R.color,strokeWidth:"4",fill:"transparent",strokeDasharray:"251",strokeDashoffset:251*(1-_/100),strokeLinecap:"round",className:"progress-ring"})]}),e.jsxs("span",{className:"absolute text-[9px] sm:text-[10px] font-black",children:[_,"%"]})]})]}):null]})}),e.jsx("main",{className:"max-w-[1000px] mx-auto px-6 py-10",children:e.jsx("div",{className:"max-w-[1000px] mx-auto",children:e.jsxs("div",{className:"space-y-12",children:[!s&&e.jsxs("section",{className:"space-y-6",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 rounded-xl bg-orange-500 text-black flex items-center justify-center font-black text-lg border-[3px] border-black shadow-[4px_4px_0px_#000]",children:"01"}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-display font-black text-white",children:"Choose Your Path"}),e.jsx("p",{className:"text-[10px] font-bold text-neutral-400 uppercase tracking-widest",children:"Select your core identity theme"})]})]}),e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-6",children:Object.entries($).filter(([a])=>{var l;return!(((l=n==null?void 0:n.persona_data)==null?void 0:l.identities)||[]).some(o=>o.persona_type===a)}).map(([a,r])=>e.jsxs("div",{onClick:()=>{P(a),k(`/studio?persona=${a}&mode=new`,{replace:!0})},className:"glass-card group p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-orange-500 transition-all",children:[e.jsx("div",{className:"w-16 h-16 rounded-xl bg-[#0a0a0a] border-[3px] border-white flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform",children:r.emoji}),e.jsx("h3",{className:"text-lg font-black uppercase tracking-wider",children:r.label||a}),e.jsx("p",{className:"text-[10px] text-neutral-400 font-bold uppercase mt-1",children:"Select Protocol"})]},a))})]}),s&&e.jsxs(e.Fragment,{children:[e.jsx("section",{className:"glass-card p-10 animate-slideUp mb-8 bg-[#1a1a1a]",children:e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-6",children:[e.jsxs("div",{className:"flex items-center gap-5",children:[e.jsx("div",{className:"w-14 h-14 rounded-xl bg-orange-500 text-black border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]",children:e.jsx(Q,{size:28})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-black font-display tracking-tight text-white",children:"Public Profile"}),e.jsx("p",{className:"text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1",children:"See how your identity looks to the world"})]})]}),e.jsxs("button",{onClick:()=>k(`/p/${(n==null?void 0:n.username)||(n==null?void 0:n.id)}?from=studio`),className:"px-6 py-3 bg-white text-black border-[3px] border-black rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center gap-2 shrink-0",children:[e.jsx(Q,{size:16})," View Profile"]})]})}),e.jsxs("section",{id:"tagline",className:"glass-card p-10 animate-slideUp",children:[e.jsxs("div",{className:"flex items-center justify-between mb-10",children:[e.jsxs("div",{className:"flex items-center gap-5",children:[e.jsx("div",{className:"w-14 h-14 rounded-xl bg-orange-500 text-black border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]",children:e.jsx(fe,{size:28})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-black font-display tracking-tight text-white",children:"Basic Identity"}),e.jsx("p",{className:"text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1",children:"Foundational profile details"})]})]}),t.tagline&&e.jsx("span",{className:"status-badge completed",children:"Completed ✅"})]}),e.jsxs("div",{className:"flex items-center gap-8 pb-10 mb-10 border-b border-neutral-100",children:[e.jsxs("div",{className:"relative group",children:[e.jsxs("div",{className:"w-24 h-24 rounded-xl bg-[#0a0a0a] border-[4px] border-white shadow-[6px_6px_0px_#fff] overflow-hidden group-hover:scale-105 transition-transform duration-500",children:[e.jsx(ne,{src:t.avatar_url,name:`${t.first_name} ${t.last_name}`,username:(n==null?void 0:n.secure_slug)||(n==null?void 0:n.id),size:"w-full h-full text-4xl"}),E&&e.jsx("div",{className:"absolute inset-0 bg-black/40 flex items-center justify-center",children:e.jsx("div",{className:"w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"})})]}),e.jsxs("label",{className:"absolute -bottom-2 -right-2 w-10 h-10 bg-orange-500 border-[3px] border-black rounded-lg shadow-[3px_3px_0px_#000] flex items-center justify-center text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer",children:[e.jsx(be,{size:18}),e.jsx("input",{type:"file",accept:"image/*",className:"hidden",onChange:a=>{var r;return((r=a.target.files)==null?void 0:r[0])&&J(a.target.files[0])}})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-xl font-black text-white mb-1 tracking-tighter",children:t.first_name||t.last_name?`${t.first_name} ${t.last_name}`:"New Identity"}),e.jsx("p",{className:"text-[10px] text-neutral-400 font-bold mb-4 uppercase tracking-widest",children:"JPG or PNG • Max 2MB"}),e.jsxs("div",{className:"flex gap-3",children:[e.jsxs("label",{className:"px-4 py-2 bg-white text-black border-[2px] border-black shadow-[2px_2px_0px_#000] text-[9px] font-black uppercase tracking-widest rounded-lg hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer",children:["Upload New",e.jsx("input",{type:"file",accept:"image/*",className:"hidden",onChange:a=>{var r;return((r=a.target.files)==null?void 0:r[0])&&J(a.target.files[0])}})]}),e.jsx("button",{onClick:()=>m("avatar_url",""),className:"px-4 py-2 bg-white border border-neutral-200 text-neutral-600 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-neutral-50 transition-colors",children:"Remove"})]})]})]}),e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"First Name"}),e.jsx("input",{type:"text",placeholder:"Enter first name",className:"input-field",value:t.first_name,maxLength:50,onChange:a=>m("first_name",a.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"Last Name"}),e.jsx("input",{type:"text",placeholder:"Enter last name",className:"input-field",value:t.last_name,maxLength:50,onChange:a=>m("last_name",a.target.value)})]})]}),A(s)&&e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"Location Name"}),e.jsx("input",{type:"text",placeholder:"e.g. Mumbai, India",className:"input-field",value:t.location,maxLength:100,onChange:a=>m("location",a.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"Established Since"}),e.jsx("input",{type:"text",placeholder:"e.g. 2021",className:"input-field",value:t.est_year,maxLength:4,onChange:a=>{const r=a.target.value.replace(/\D/g,"");m("est_year",r)}})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"Profile Theme"}),e.jsx("div",{className:"grid grid-cols-4 gap-2",children:(()=>{let a=["default","classic","minimal","neon"];return["tech","dev","developer"].includes((s==null?void 0:s.toLowerCase())||"")?a=["default","classic","blueprint","hacker"]:s!=null&&s.toLowerCase().includes("student")&&(a=["default","classic","campus","night owl"]),a.map(r=>{var l,o;return e.jsx("div",{onClick:()=>m("profile_theme",r),className:`p-3 rounded-xl border-[3px] cursor-pointer transition-all text-center flex flex-col justify-center items-center ${(((l=t.profile_theme)==null?void 0:l.toLowerCase())||"default")===r?"border-orange-500 bg-orange-500 text-black shadow-[4px_4px_0px_#000] translate-y-[2px] translate-x-[2px]":"border-white bg-[#0a0a0a] hover:border-orange-500 shadow-[4px_4px_0px_#fff]"}`,children:e.jsx("p",{className:`text-[10px] font-black uppercase tracking-wider ${(((o=t.profile_theme)==null?void 0:o.toLowerCase())||"default")===r?"text-black":"text-neutral-400"}`,children:r==="default"?["tech","dev","developer"].includes((s==null?void 0:s.toLowerCase())||"")?"Terminal":s!=null&&s.toLowerCase().includes("student")?"Notebook":"Glow":r==="classic"?"Classic":r})},r)})})()})]}),e.jsxs("div",{children:[e.jsx("label",{className:"section-label",children:"Public Bio"}),e.jsx("textarea",{placeholder:"Tell the world who you are...",className:"input-field min-h-[100px] py-4",value:t.bio,maxLength:500,onChange:a=>m("bio",a.target.value)})]})]})]}),e.jsxs("section",{id:"detailed_attributes",className:"glass-card p-10 animate-slideUp",style:{animationDelay:"0.2s"},children:[e.jsxs("div",{className:"flex items-center gap-5 mb-10",children:[e.jsx("div",{className:"w-14 h-14 rounded-xl bg-orange-500 text-black border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]",children:e.jsx(ge,{size:28})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-black font-display tracking-tight text-white",children:"Detailed Persona Attributes"}),e.jsxs("p",{className:"text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1",children:["Specific details for your ",s," identity"]})]})]}),e.jsxs("div",{className:"p-0 sm:p-2",children:[["developer","dev"].includes(s)&&e.jsx(oe,{data:t,onChange:N,isOwner:!0,onUpload:T,uploading:E}),s==="student"&&e.jsx(ce,{data:t,onChange:N,onUpload:T,uploading:E}),A(s)&&e.jsx(de,{data:t,onChange:N,onUpload:T,uploading:E})]})]}),e.jsxs("section",{id:"achievements",className:"glass-card p-10 animate-slideUp",style:{animationDelay:"0.5s"},children:[e.jsxs("div",{className:"flex items-center justify-between mb-10",children:[e.jsxs("div",{className:"flex items-center gap-5",children:[e.jsx("div",{className:"w-14 h-14 rounded-xl bg-orange-500 text-black border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]",children:e.jsx(ve,{size:28})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-black font-display tracking-tight text-white",children:"Achievements"}),e.jsx("p",{className:"text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1",children:"Trust & Authority"})]})]}),t.achievements.length>0?e.jsx("span",{className:"status-badge completed",children:"Completed ✅"}):e.jsx("span",{className:"status-badge missing",children:"Missing +10% ⚠️"})]}),e.jsxs("div",{className:"space-y-6",children:[e.jsx("p",{className:"text-[11px] text-neutral-400 font-medium leading-relaxed",children:"Boost trust with achievements (awards, milestones, or high-value certifications)."}),e.jsx(xe,{value:t.achievements||[],onChange:a=>m("achievements",a),placeholder:"Add achievement (e.g., Verified on Instagram, Best Actor 2023)"})]})]})]})]})})}),s?e.jsxs("footer",{className:"fixed bottom-0 left-0 right-0 z-[60] bg-[#0a0a0a] border-t-[4px] border-white p-6 pb-8 flex flex-col items-center justify-center gap-3",children:[e.jsx("button",{onClick:Y,disabled:z,className:"px-14 py-4 rounded-xl bg-orange-500 text-black border-[4px] border-black font-black text-xs uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all shadow-[6px_6px_0px_#000] disabled:opacity-50 flex items-center gap-2",children:z?"Saving Profile...":e.jsxs(e.Fragment,{children:[e.jsx(K,{size:20})," Save Profile"]})}),e.jsxs("div",{className:"flex items-center gap-1.5 text-neutral-400",children:[e.jsx(we,{size:12}),e.jsx("span",{className:"text-[10px] font-bold uppercase tracking-widest",children:"Secured by KnoWMi Identity Cloud • End-to-End Encrypted"})]})]}):null]})}export{ze as default};
