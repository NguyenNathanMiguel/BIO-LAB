import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
export default function LabGraph({ definition, history, runs = [], comparison = false }) {
  const [metric, setMetric] = useState(definition.graphs[0].key);
  const series = comparison ? runs : [{ name: 'Đang quan sát', history }];
  const days = [...new Set(series.flatMap(r => r.history.map(s => Number(s.day.toFixed(3)))))].sort((a, b) => a - b);
  const maps = series.map(r => new Map(r.history.map(s => [Number(s.day.toFixed(3)), s[metric]])));
  const data = days.map(day => Object.fromEntries([['day', day], ...maps.map((m, i) => [`run${i}`, m.get(day) ?? null])]));
  return <section className="lab-panel min-w-0" data-testid={comparison ? 'comparison-graph' : 'live-graph'} data-points={data.length}>
    <div className="flex flex-wrap items-center justify-between gap-2 mb-3"><h3 className="lab-heading !mb-0">{comparison ? 'ĐỒ THỊ SO SÁNH' : 'PHÁT TRIỂN THEO THỜI GIAN'}</h3>
      <select aria-label={comparison ? 'Đại lượng so sánh' : 'Đại lượng biểu đồ'} value={metric} onChange={e => setMetric(e.target.value)} className="lab-select">{definition.graphs.map(g => <option key={g.key} value={g.key}>{g.label}</option>)}</select>
    </div>
    <p className="lab-muted text-xs mb-2">Giá trị đo · {definition.graphs.find(g => g.key === metric).label}</p>
    <div className="h-60 w-full min-w-0"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 10, right: 16, left: -18, bottom: 10 }}>
      <CartesianGrid stroke="var(--sim-edge)" strokeDasharray="3 5" /><XAxis dataKey="day" type="number" domain={[0, Math.max(1, ...days)]} tick={{ fill: 'var(--sim-muted)', fontSize: 11 }} tickFormatter={n => Number(n.toFixed(1))} />
      <YAxis domain={[0, 'auto']} tick={{ fill: 'var(--sim-muted)', fontSize: 11 }} width={58} />
      <Tooltip contentStyle={{ background: 'var(--sim-panel)', borderColor: 'var(--sim-edge)', color: 'var(--sim-paper)' }} labelFormatter={day => `Ngày ${Number(day).toFixed(2)}`} formatter={(value, name) => [Number(value).toFixed(2), name]} /><Legend />
      {series.map((r, i) => <Line key={r.name + i} name={r.name} dataKey={`run${i}`} type="linear" connectNulls={true} stroke={['var(--sim-mint)', 'var(--sim-light)', 'var(--sim-water)', 'var(--sim-heat)'][i % 4]} strokeWidth={2.5} dot={false} isAnimationActive={false} />)}
    </LineChart></ResponsiveContainer></div><p className="lab-muted text-center text-xs">Thời gian (ngày mô phỏng)</p>
  </section>;
}