import React from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
export default function PhotoGasChart({ records }) {
  if (!records.length) return null;
  return <div className="mt-4 h-44" aria-label="Biểu đồ các lần đo thể tích khí"><ResponsiveContainer width="100%" height="100%"><LineChart data={records.map((r, i) => ({ measurement: i + 1, gas: Number(r.value) }))} margin={{ left: -15, right: 15, top: 10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" stroke="var(--sim-wall)" /><XAxis dataKey="measurement" tick={{ fontSize: 11 }} /><YAxis unit=" mL" tick={{ fontSize: 11 }} /><Tooltip /><Line dataKey="gas" name="Khí thu được (mL)" stroke="var(--sim-edge)" strokeWidth={2} /></LineChart></ResponsiveContainer></div>;
}