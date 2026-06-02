const fs = require('fs');

const FILE = 'src/components/profile/personas/StudentProfile.tsx';
let content = fs.readFileSync(FILE, 'utf8');

// 1. CAMPUS THEME TWEAKS
// Reduce sticky note sizes
content = content.replace(/w-32 sm:w-40 aspect-square/g, 'w-28 sm:w-32 aspect-square');

// Remove Academic Snapshot completely.
// It starts with:
// <div className="w-full md:w-[62%] bg-[#fdfbf7] p-6 pt-10 pb-10 pl-14 cork-shadow rotate-1 relative lined-paper">
// We need to cut from there to the end of its div.
const snapshotStart = content.indexOf('<div className="w-full md:w-[62%] bg-[#fdfbf7] p-6 pt-10 pb-10 pl-14 cork-shadow rotate-1 relative lined-paper">');
if (snapshotStart !== -1) {
  const snapshotEnd = content.indexOf('</div>\n            </div>', snapshotStart);
  if (snapshotEnd !== -1) {
    content = content.substring(0, snapshotStart) + content.substring(snapshotEnd + 26);
  }
}

// Adjust Upcoming Events to be wider now that Snapshot is gone.
// Change Upcoming Events from md:w-[32%] to md:w-[46%]
content = content.replace(
  '<div className="w-full md:w-[32%] bg-[#c0d6e4] p-6 pb-8 cork-shadow -rotate-2 relative">',
  '{(data.upcoming_events && data.upcoming_events.length > 0) && (\n<div className="w-full md:w-[46%] bg-[#c0d6e4] p-6 pb-8 cork-shadow -rotate-2 relative">'
);

// Map Upcoming events in Campus theme
const eventsCampusCode = `
              <div className="space-y-4">
                 {data.upcoming_events.map((ev: any, i: number) => (
                   <div key={i} className="flex gap-3">
                     <Calendar size={18} className="text-[#1e3a8a] shrink-0 mt-1" strokeWidth={1.5} />
                     <div>
                       <div className="text-xl text-neutral-800 leading-tight" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>{ev.title}</div>
                       <div className="text-sm text-neutral-600 font-sans">{ev.date}</div>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
            )}`;
// Replace hardcoded events code in Campus with the dynamic mapping.
// Find the exact block.
const hardcodedEvents = `              <div className="space-y-4">
                 <div className="flex gap-3">
                   <Calendar size={18} className="text-[#1e3a8a] shrink-0 mt-1" strokeWidth={1.5} />
                   <div>
                     <div className="text-xl text-neutral-800 leading-tight" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Midterm Exams</div>
                     <div className="text-sm text-neutral-600 font-sans">May 15 - May 20</div>
                   </div>
                 </div>
                 <div className="flex gap-3">
                   <Calendar size={18} className="text-[#1e3a8a] shrink-0 mt-1" strokeWidth={1.5} />
                   <div>
                     <div className="text-xl text-neutral-800 leading-tight" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Hackathon</div>
                     <div className="text-sm text-neutral-600 font-sans">May 25 - May 27</div>
                   </div>
                 </div>
              </div>
            </div>`;
if (content.includes(hardcodedEvents)) {
    content = content.replace(hardcodedEvents, eventsCampusCode);
} else {
    console.log("Could not find hardcoded events in Campus theme.");
}

// Advice I Live By is already dynamic in Campus theme. We just make sure Projects and Connect are also 46% so the grid balances nicely.
content = content.replace('<div className="w-full md:w-[28%] bg-[#fdfbf7] p-6 pb-8 pl-10 cork-shadow rotate-[1deg] relative solid-paper min-h-[220px]">', '<div className="w-full md:w-[46%] bg-[#fdfbf7] p-6 pb-8 pl-10 cork-shadow rotate-[1deg] relative solid-paper min-h-[220px]">');
content = content.replace('<div className="w-full md:w-[32%] bg-[#FDE68A] p-6 pb-8 cork-shadow -rotate-1 relative min-h-[220px]">', '<div className="w-full md:w-[46%] bg-[#FDE68A] p-6 pb-8 cork-shadow -rotate-1 relative min-h-[220px]">');
content = content.replace('<div className="w-full md:w-[28%] bg-[#fdfbf7] p-6 pb-8 pl-10 cork-shadow rotate-2 relative solid-paper min-h-[220px] flex flex-col justify-center text-center">', '<div className="w-full md:max-w-xl mx-auto bg-[#fdfbf7] p-6 pb-8 pl-10 cork-shadow rotate-1 relative solid-paper min-h-[220px] flex flex-col justify-center text-center mt-4">');

// 2. CLASSIC (DEFAULT) THEME
// Find where to insert Advice and Events
const classicSkillsEnd = '{data.core_skills && data.core_skills.length > 0 && (\n            <div className="w-full mb-10 text-left">\n              <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-4 sm:mb-6 px-2 text-center">Core Superpowers</h4>\n              <div className="flex flex-wrap justify-center gap-2">\n                {data.core_skills.map((skill: string, i: number) => (\n                  <span key={i} className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] sm:text-xs font-black text-indigo-600 tracking-wider flex items-center gap-2 shadow-sm">\n                    <Zap size={14} className="text-indigo-400" /> {skill}\n                  </span>\n                ))}\n              </div>\n            </div>\n          )}';

const classicNewSection = `
          {data.thought_bubble && (
            <div className="w-full mb-10 text-center">
              <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-4 sm:mb-6 px-2">Advice I Live By</h4>
              <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100 italic text-emerald-800 text-lg font-medium">
                "{data.thought_bubble}"
              </div>
            </div>
          )}

          {data.upcoming_events && data.upcoming_events.length > 0 && (
            <div className="w-full mb-10 text-left">
              <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-4 sm:mb-6 px-2 text-center">Upcoming Events</h4>
              <div className="space-y-3">
                {data.upcoming_events.map((ev: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Calendar size={18} />
                      </div>
                      <span className="font-bold text-neutral-900">{ev.title}</span>
                    </div>
                    <span className="text-sm font-medium text-neutral-500">{ev.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
`;
if (content.includes(classicSkillsEnd)) {
    content = content.replace(classicSkillsEnd, classicSkillsEnd + '\n' + classicNewSection);
}

// 3. NOTEBOOK THEME
// Find Projects end in notebook theme
const notebookProjectsEnd = `{data.projects && data.projects.length > 0 && (
            <div className="w-full mb-10">
              <h4 className="text-xl font-black text-slate-800 mb-4 font-mono uppercase tracking-widest border-b-2 border-slate-800/10 pb-2">Projects</h4>
              <div className="grid grid-cols-1 gap-4">
                {data.projects.map((p: any, i: number) => (
                  <div key={i} className="p-4 bg-white/50 border border-slate-800/20 rounded-lg hover:bg-white/80 transition-colors">
                    <h5 className="font-bold text-slate-800 font-mono flex items-center gap-2"><span className="text-xl">{p.emoji}</span> {p.name}</h5>
                    {p.description && <p className="text-sm text-slate-600 mt-2 font-mono">{p.description}</p>}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {p.tech && p.tech.map((t: string, j: number) => (
                        <span key={j} className="text-[10px] bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold uppercase">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}`;

const notebookNewSection = `
          {data.thought_bubble && (
            <div className="w-full mb-10 bg-[#fefce8] p-6 border-2 border-slate-800 transform rotate-1 shadow-[4px_4px_0_rgba(30,41,59,1)]">
              <h4 className="text-sm font-black text-slate-800 mb-2 font-mono uppercase tracking-widest">Advice I Live By</h4>
              <p className="text-xl text-slate-800 font-mono italic">"{data.thought_bubble}"</p>
            </div>
          )}

          {data.upcoming_events && data.upcoming_events.length > 0 && (
            <div className="w-full mb-10">
              <h4 className="text-xl font-black text-slate-800 mb-4 font-mono uppercase tracking-widest border-b-2 border-slate-800/10 pb-2">Upcoming Events</h4>
              <ul className="list-square pl-6 space-y-2">
                {data.upcoming_events.map((ev: any, i: number) => (
                  <li key={i} className="font-mono text-slate-700 font-medium">
                    <strong className="text-slate-900">{ev.title}</strong> — {ev.date}
                  </li>
                ))}
              </ul>
            </div>
          )}
`;
if (content.includes(notebookProjectsEnd)) {
    content = content.replace(notebookProjectsEnd, notebookProjectsEnd + '\n' + notebookNewSection);
}

// 4. NIGHT OWL THEME
// Find Projects in night owl theme
const nightowlProjectsEnd = `{data.projects && data.projects.length > 0 && (
            <div className="w-full mb-10">
              <h4 className="text-sm font-bold text-[#b48ead] mb-6 flex items-center gap-2 font-mono"><span className="text-[#a3be8c]">//</span> PROJECTS</h4>
              <div className="grid grid-cols-1 gap-4">
                {data.projects.map((p: any, i: number) => (
                  <div key={i} className="p-4 bg-[#3b4252] rounded-lg border border-[#434c5e] hover:border-[#81a1c1] transition-colors group">
                    <h5 className="font-bold text-[#eceff4] flex items-center gap-2"><span className="text-xl">{p.emoji}</span> {p.name}</h5>
                    {p.description && <p className="text-sm text-[#d8dee9] mt-2">{p.description}</p>}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {p.tech && p.tech.map((t: string, j: number) => (
                        <span key={j} className="text-[10px] bg-[#2e3440] text-[#81a1c1] px-2 py-1 rounded font-bold uppercase">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}`;

const nightowlNewSection = `
          {data.thought_bubble && (
            <div className="w-full mb-10">
              <div className="p-6 bg-[#3b4252]/50 border-l-4 border-[#ebcb8b] rounded-r-lg">
                <p className="text-[#d8dee9] font-mono italic">"{data.thought_bubble}"</p>
                <p className="text-xs text-[#ebcb8b] mt-2 font-mono">-- Advice I Live By</p>
              </div>
            </div>
          )}

          {data.upcoming_events && data.upcoming_events.length > 0 && (
            <div className="w-full mb-10">
              <h4 className="text-sm font-bold text-[#b48ead] mb-6 flex items-center gap-2 font-mono"><span className="text-[#a3be8c]">//</span> UPCOMING_EVENTS</h4>
              <div className="space-y-3 font-mono">
                {data.upcoming_events.map((ev: any, i: number) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-[#8fbcbb] w-24 shrink-0">{ev.date}</span>
                    <span className="text-[#eceff4]">{ev.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
`;
if (content.includes(nightowlProjectsEnd)) {
    content = content.replace(nightowlProjectsEnd, nightowlProjectsEnd + '\n' + nightowlNewSection);
}

fs.writeFileSync(FILE, content);
console.log("Successfully updated all themes!");
