'use client';

import { useMemo } from 'react';

export default function RecentVisitors({ events }: { events: any[] }) {
  const rtf = useMemo(() => new Intl.RelativeTimeFormat('en', { numeric: 'auto' }), []);

  const getRelativeTime = (date: string) => {
    const diff = new Date(typeof date === 'string' ? date.replace(' ', 'T') : date).getTime() - new Date().getTime();
    const minutes = Math.round(diff / (1000 * 60));
    const hours = Math.round(diff / (1000 * 60 * 60));
    const days = Math.round(diff / (1000 * 60 * 60 * 24));

    if (Math.abs(minutes) < 1) return 'Just now';
    if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute');
    if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');
    return rtf.format(days, 'day');
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[500px]">
        <thead>
          <tr className="border-b border-neutral-100">
            {['Visitor', 'Time', 'Device', 'Source', 'Country', 'Type'].map(h => (
              <th key={h} className="pb-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {events.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-10 text-center text-sm font-medium text-neutral-400">
                No recent activity yet. Share your QR code to get started!
              </td>
            </tr>
          ) : (
            events.map((event, i) => (
              <tr key={i} className="group hover:bg-neutral-50 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    {event.visitor ? (
                      <>
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200">
                          <img 
                            src={event.visitor.avatar_url?.startsWith('http') ? event.visitor.avatar_url : `https://mrtbqfkhvpsrtvdyunqr.supabase.co/storage/v1/object/public/avatars/${event.visitor.avatar_url?.replace('/content/avatars/', '')}`} 
                            alt={event.visitor.first_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as any).src = `https://ui-avatars.com/api/?name=${event.visitor.first_name}&background=random`;
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold text-neutral-900">{event.visitor.first_name}</span>
                      </>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-neutral-400">?</span>
                        </div>
                        <span className="text-sm font-medium text-neutral-400 italic">Anonymous</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 text-sm font-bold text-neutral-900">{getRelativeTime(event.viewed_at)}</td>
                <td className="py-4 text-sm font-medium text-neutral-500 capitalize">{event.device_type}</td>
                <td className="py-4 text-sm font-medium text-neutral-500 capitalize">{event.referrer}</td>
                <td className="py-4 text-sm font-medium text-neutral-500">{event.country}</td>
                <td className="py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                    event.is_repeat 
                      ? 'bg-orange-50 text-orange-600 border border-orange-100' 
                      : 'bg-green-50 text-green-600 border border-green-100'
                  }`}>
                    {event.is_repeat ? 'Returning' : 'New'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

