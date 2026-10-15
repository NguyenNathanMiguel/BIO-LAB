import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, Microscope, FlaskConical, NotebookText } from "lucide-react";

const tiles = [
  { to: "/experiments", icon: FlaskConical, title: "Thí Nghiệm Sinh Học", desc: "Thay đổi biến số trong các mô phỏng tương tác và quan sát kết quả.", video: "https://media.base44.com/videos/public/6aae26965c22f8ce890f0526/c445ad9b3_197486-905015022_medium1.mp4" },
  { to: "/plant-lab", icon: Leaf, title: "Phòng Thực Vật", desc: "Tải lên ảnh lá hoặc cây và nhận phân tích triệu chứng bằng AI.", video: "https://media.base44.com/videos/public/6aae26965c22f8ce890f0526/5bb5ba95f_106867-674260860_medium.mp4" },
  { to: "/microscope", icon: Microscope, title: "Kính Hiển Vi Ảo", desc: "Phóng to tế bào và mô thực vật để nhận diện các cấu trúc.", video: "https://media.base44.com/videos/public/6aae26965c22f8ce890f0526/9c10ae4bd_262188_medium.mp4" },
  { to: "/journal", icon: NotebookText, title: "Nhật Ký Quan Sát", desc: "Ghi lại quan sát, giả thuyết và kết luận của bạn.", video: "https://media.base44.com/videos/public/6aae26965c22f8ce890f0526/ba77cb312_12040-236265335.mp4" },
];

function Tile({ tile }) {
  const [active, setActive] = useState(false);
  const videoRef = useRef(null);
  const enter = () => { setActive(true); videoRef.current?.play().catch(() => {}); };
  const leave = () => { setActive(false); if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; } };
  return (
    <Link to={tile.to} onMouseEnter={enter} onMouseLeave={leave} onFocus={enter} onBlur={leave}
      className="group relative flex min-h-[220px] items-center justify-center overflow-hidden bg-[#0A0A0A] p-6 md:min-h-[280px]">
      <video ref={videoRef} src={tile.video} muted loop playsInline preload="metadata" aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`} />
      <div className={`pointer-events-none absolute inset-0 bg-black/45 transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`} />
      {active ? (
        <p className="relative max-w-sm text-center text-base font-medium leading-relaxed text-white md:text-lg">{tile.desc}</p>
      ) : (
        <div className="relative flex flex-col items-center gap-4 text-center">
          <tile.icon className="h-10 w-10 text-emerald-300" />
          <h3 className="text-xl font-semibold tracking-tight text-white md:text-2xl">{tile.title}</h3>
        </div>
      )}
    </Link>
  );
}

export default function FeatureVideoGrid() {
  return (
    <section className="grid grid-cols-1 gap-px bg-white sm:grid-cols-2" data-testid="feature-video-grid">
      {tiles.map((tile) => <Tile key={tile.to} tile={tile} />)}
    </section>
  );
}