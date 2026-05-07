'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ViewsChart({ data }: { data: any[] }) {
  const formattedData = data.map(d => ({
    ...d,
    formattedDate: new Date(d.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="formattedDate" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#9A9AAE', fontWeight: 'bold' }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#9A9AAE', fontWeight: 'bold' }} 
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              fontFamily: 'DM Sans, sans-serif'
            }}
            labelStyle={{ fontWeight: '800', marginBottom: '4px', color: '#111' }}
          />
          <Area 
            type="monotone" 
            dataKey="total_views" 
            stroke="#3B82F6" 
            fill="url(#colorViews)" 
            fillOpacity={1} 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1500}
          />
          <Area 
            type="monotone" 
            dataKey="unique_views" 
            stroke="#10B981" 
            fill="none" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
