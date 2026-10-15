import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Leaf, Microscope, FlaskConical, NotebookText, GraduationCap, Menu, X, Users, UserCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageVideoBackground from "@/components/PageVideoBackground";

const navItems = [
  { to: "/", label: "Trang chủ", icon: Leaf, exact: true },
  { to: "/plant-lab", label: "Phòng Thực Vật", icon: Leaf },
  { to: "/microscope", label: "Kính Hiển Vi Ảo", icon: Microscope },
  { to: "/experiments", label: "Thí Nghiệm Sinh Học", icon: FlaskConical },
  { to: "/journal", label: "Nhật Ký Quan Sát", icon: NotebookText },
  { to: "/hub", label: "Cộng Đồng", icon: Users },
];

export default function Layout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const items = user?.role === "admin"
    ? [...navItems, { to: "/teacher", label: "Dành Cho Giáo Viên", icon: GraduationCap }]
    : navItems;

  return (
    <div className="min-h-screen bg-[#F6F8F4] flex flex-col">
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between bg-[#0F2A20] px-4 text-white">
        <button onClick={() => setOpen((v) => !v)} aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} className="rounded-lg p-2 hover:bg-white/10">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight"><img src="https://media.base44.com/images/public/6aae26965c22f8ce890f0526/925916732_Gemini_Generated_Image_jxi2q4jxi2q4jxi2-removebg-preview.png" alt="" className="h-11 w-11 object-contain" />BIO-LAB</Link>
        <Link to="/profile" className="flex max-w-[45%] items-center gap-2 rounded-full bg-white/10 py-1.5 pl-1.5 pr-3 hover:bg-white/20">
          <UserCircle className="h-6 w-6 shrink-0 text-emerald-200" />
          <span className="truncate text-sm">{user?.full_name || user?.email || "Hồ sơ"}</span>
        </Link>
      </header>

      {open && (
        <div className="fixed inset-0 top-14 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-[#0F2A20] text-white flex flex-col">
            <nav className="flex-1 space-y-1 px-3 pt-4">
              {items.map(({ to, label, icon: Icon, exact }) => {
                const active = exact ? location.pathname === to : location.pathname.startsWith(to);
                return (
                  <Link key={to} to={to} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-emerald-400/15 text-emerald-200" : "text-white/70 hover:bg-white/5 hover:text-white"}`}>
                    <Icon className="h-4 w-4" />{label}
                  </Link>
                );
              })}
            </nav>
            <div className="px-6 pb-6 text-[11px] text-white/30">Lớp 10–12 · Sinh Học</div>
          </aside>
        </div>
      )}

      <main className={`flex-1 min-w-0 ${['/plant-lab', '/experiments', '/journal', '/hub'].includes(location.pathname) ? 'relative isolate' : ''}`}>
        {['/plant-lab', '/experiments', '/journal', '/hub'].includes(location.pathname) && <PageVideoBackground />}
        <Outlet />
      </main>
    </div>
  );
}