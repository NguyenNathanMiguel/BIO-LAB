import React from 'react';
export default function LabMeasurements({ definition, state }) {
  return <section className="lab-panel" aria-label="Thông số hiện tại"><h3 className="lab-heading">THÔNG SỐ HIỆN TẠI</h3>
    <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 xl:grid-cols-6">{definition.measurements.map(m => <div key={m.key}>
      <dt className="lab-muted text-xs">{m.label}</dt><dd className="mt-1 text-xl font-semibold tabular-nums"><span data-testid={`measure-${m.key}`}>{state[m.key].toFixed(m.digits)}</span> <span className="lab-muted text-xs font-normal">{m.unit}</span></dd>
    </div>)}</dl>
    <div className="lab-status mt-4 text-sm"><span className="lab-muted">TRẠNG THÁI · </span><span data-testid="plant-status">{state.status}</span></div>
  </section>;
}