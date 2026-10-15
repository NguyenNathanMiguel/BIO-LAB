const cell = (x, y, w, h, fill = '#dce9bb') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(w, h) / 3}" fill="${fill}" stroke="#6c9362" stroke-width="5"/>`;
const chloroplasts = (x, y, count) => Array.from({ length: count }, (_, i) => `<ellipse cx="${x + (i % 3) * 19}" cy="${y + Math.floor(i / 3) * 27}" rx="7" ry="11" fill="#609539" opacity=".8"/>`).join('');
function epidermis() {
  let out = ''; for (let y = 30; y < 1000; y += 150) for (let x = 20; x < 1000; x += 195) out += cell(x + (y % 300 ? 25 : 0), y, 190, 145, '#e6ecca');
  out += `<ellipse cx="420" cy="500" rx="95" ry="138" fill="#e5eec4"/>`;
  out += `<path d="M408 382 C300 383 300 618 408 618 C364 546 364 455 408 382Z" fill="#97bd69" stroke="#45633b" stroke-width="6"/><path d="M432 382 C540 383 540 618 432 618 C476 546 476 455 432 382Z" fill="#97bd69" stroke="#45633b" stroke-width="6"/><ellipse cx="420" cy="500" rx="16" ry="77" fill="#3b4e30"/>`;
  return out + chloroplasts(346, 440, 9) + chloroplasts(454, 440, 9);
}
function leafSection() {
  let out = ''; for (let x = 0; x < 1000; x += 100) out += cell(x, 145, 99, 70, '#eceec9');
  for (let x = 10; x < 1000; x += 85) out += cell(x, 228, 75, 190, '#c2d494') + chloroplasts(x + 14, 250, 15);
  for (const [x, y] of [[70,510],[170,665],[475,480],[535,545],[720,455],[770,650],[870,560],[470,730]]) out += `<ellipse cx="${x}" cy="${y}" rx="57" ry="44" fill="#d0dda6" stroke="#719667" stroke-width="5"/>` + chloroplasts(x - 22, y - 22, 6);
  out += `<ellipse cx="300" cy="550" rx="115" ry="125" fill="#e8cca7" stroke="#826c53" stroke-width="7"/>`;
  for (const [x,y,r] of [[275,490,27],[325,490,27],[300,535,25],[265,580,17],[305,585,17],[340,580,17],[290,618,16]]) out += `<circle cx="${x}" cy="${y}" r="${r}" fill="#f2e8cf" stroke="#9e7062" stroke-width="7"/>`;
  for (let x = 0; x < 1000; x += 115) out += cell(x, 810, 113, 65, '#e4e8c0');
  return out;
}
function plantCell() {
  return `<rect x="285" y="280" width="470" height="480" rx="60" fill="#c7d8a0" stroke="#688751" stroke-width="18"/><rect x="303" y="298" width="434" height="444" rx="48" fill="none" stroke="#889158" stroke-width="5"/><ellipse cx="455" cy="570" rx="100" ry="126" fill="#dfedce" stroke="#a5bea0" stroke-width="4"/><ellipse cx="550" cy="500" rx="58" ry="52" fill="#b593bf" stroke="#785d8d" stroke-width="7"/><circle cx="558" cy="502" r="17" fill="#73527e"/>${chloroplasts(660, 355, 12)}${chloroplasts(350, 337, 9)}${chloroplasts(595, 675, 9)}`;
}
export default function trainingSlide(specimen) {
  const artwork = specimen.id === 'leaf-epidermis' ? epidermis() : specimen.id === 'plant-cell' ? plantCell() : leafSection();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000"><defs><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".065"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter></defs><rect width="1000" height="1000" fill="#eef0d3"/><g filter="url(#grain)">${artwork}</g></svg>`;
  return { ...specimen, training: true, image: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` };
}