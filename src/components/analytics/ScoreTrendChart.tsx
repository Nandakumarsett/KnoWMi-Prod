'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';

export default function ScoreTrendChart({ history }: { history: any[] }) {
  const formattedData = history.map(h => ({
    date: new Date(h.day).toLocaleDateString('en', { day: 'numeric', month: 'short' }),
    score: h.knowmi_score,
    rank: h.rank
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fontWeight: 'bold', fill: '#A3A3A3' }}
          minTickGap={30}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fontWeight: 'bold', fill: '#A3A3A3' }}
          domain={['dataMin - 50', 'dataMax + 50']}
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '16px', 
            border: 'none', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            padding: '12px 16px'
          }}
          itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#111' }}
          labelStyle={{ fontSize: '10px', color: '#A3A3A3', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
          formatter={(value: any, name: string) => [value, name === 'score' ? 'KnoWMi Score' : 'Rank']}
        />
        <ReferenceLine y={450} stroke="#E5E7EB" strokeDasharray="3 3" label={{ position: 'right', value: 'Avg', fill: '#9CA3AF', fontSize: 10 }} />
        <Line 
          type="monotone" 
          dataKey="score" 
          stroke="#14B8A6" 
          strokeWidth={3} 
          dot={false}
          activeDot={{ r: 6, strokeWidth: 0, fill: '#14B8A6' }}
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
