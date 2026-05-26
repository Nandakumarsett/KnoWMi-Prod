import { MapPin, Users, Activity, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TokenStats {
  total_scans: number;
  unique_scans: number;
  last_scanned: string | null;
  top_city: string | null;
  top_country: string | null;
}

interface TokenScanCardProps {
  stats: TokenStats;
}

export default function TokenScanCard({ stats }: TokenScanCardProps) {
  const { total_scans, unique_scans, last_scanned, top_city, top_country } = stats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[9px] font-black uppercase text-neutral-400 tracking-widest">
          <Activity size={10} className="text-orange-500" />
          <span>Total Scans</span>
        </div>
        <p className="text-lg font-black text-neutral-900">{total_scans.toLocaleString()}</p>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[9px] font-black uppercase text-neutral-400 tracking-widest">
          <Users size={10} className="text-blue-500" />
          <span>Unique Reach</span>
        </div>
        <p className="text-lg font-black text-neutral-900">{unique_scans.toLocaleString()}</p>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[9px] font-black uppercase text-neutral-400 tracking-widest">
          <MapPin size={10} className="text-emerald-500" />
          <span>Top Location</span>
        </div>
        <p className="text-xs font-bold text-neutral-700 truncate">
          {top_city ? `${top_city}, ${top_country}` : 'No data yet'}
        </p>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[9px] font-black uppercase text-neutral-400 tracking-widest">
          <Clock size={10} className="text-violet-500" />
          <span>Last Scan</span>
        </div>
        <p className="text-[10px] font-bold text-neutral-400 uppercase">
          {last_scanned ? `${formatDistanceToNow(new Date(typeof last_scanned === 'string' ? last_scanned.replace(' ', 'T') : last_scanned))} ago` : 'Never'}
        </p>
      </div>
    </div>
  );
}

