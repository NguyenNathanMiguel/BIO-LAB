const defaultVariables = definition => Object.fromEntries(definition.variables.map(v => [v.id, v.initial]));

// Fixed biological steps: frame rate affects playback only, never the equations.
export default class SimulationEngine {
  constructor(definition) { this.definition = definition; this.reset(); }
  reset() {
    this.variables = defaultVariables(this.definition); this.state = this.definition.initialState();
    this.running = false; this.speed = 1; this.accumulator = 0; this.ticks = 0;
    this.history = [{ ...this.state }]; this.changes = [{ day: 0, ...this.variables }];
  }
  change(key, value) {
    const spec = this.definition.variables.find(v => v.id === key);
    if (!spec || !Number.isFinite(value)) return;
    this.variables = { ...this.variables, [key]: Math.max(spec.min, Math.min(spec.max, Math.round(value))) };
    this.state = this.definition.onVariable?.(this.state, key, this.variables[key]) || this.state;
    const change = { day: this.state.day, ...this.variables };
    if (this.changes.at(-1).day === this.state.day) this.changes[this.changes.length - 1] = change;
    else this.changes.push(change);
    if (this.history.at(-1).day === this.state.day) this.history[this.history.length - 1] = { ...this.state };
  }
  advance(seconds) {
    if (!this.running) return;
    this.accumulator += seconds * this.speed / 2;
    while (this.accumulator + 1e-9 >= this.definition.stepDays && this.state.day < this.definition.maxDays) {
      this.state = this.definition.step(this.state, this.variables, this.definition.stepDays);
      this.accumulator -= this.definition.stepDays; this.ticks++;
      if (this.ticks % 5 === 0 || this.state.day >= this.definition.maxDays - 1e-8) this.history.push({ ...this.state });
      if (this.state.day >= this.definition.maxDays - 1e-8) { this.state.day = this.definition.maxDays; this.running = false; break; }
    }
  }
  snapshot() { return { state: { ...this.state }, variables: { ...this.variables }, running: this.running, speed: this.speed, history: [...this.history], changes: [...this.changes] }; }
  capture(name) {
    this.running = false;
    const result = this.snapshot();
    if (result.history.at(-1).day !== this.state.day) result.history.push({ ...this.state });
    return { ...result, name };
  }
}