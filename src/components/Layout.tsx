import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';

const LINKS = [
  { to: '/', label: 'الرئيسية' },
  { to: '/create', label: 'أنشئ إعلانك' },
  { to: '/templates', label: 'النماذج الجاهزة' },
  { to: '/pricing', label: 'الباقات' },
  { to: '/about', label: 'عن أورو' },
];

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-2.5 shrink-0">
      <span className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white font-black text-xl shadow-md shadow-amber-200">
        O
      </span>
      <span className="leading-none">
        <span className="block font-black text-xl text-amber-700 tracking-wide">أورو</span>
        <span className="block text-[11px] font-bold text-violet-500 tracking-[0.3em]">ORO</span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-amber-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Logo onClick={() => setOpen(false)} />

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-full text-sm font-bold transition-colors ${
                  isActive ? 'bg-amber-100 text-amber-800' : 'text-stone-600 hover:bg-amber-50 hover:text-amber-700'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <button
            onClick={() => navigate('/create')}
            className="px-5 py-2.5 rounded-full bg-gradient-to-l from-amber-500 to-amber-600 text-white text-sm font-extrabold shadow-md shadow-amber-200 hover:opacity-90 transition"
          >
            ابدأ تصميم إعلانك
          </button>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-amber-50"
          onClick={() => setOpen((v) => !v)}
          aria-label="القائمة"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-amber-100 bg-white px-4 py-3 flex flex-col gap-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-xl font-bold text-sm ${
                  isActive ? 'bg-amber-100 text-amber-800' : 'text-stone-600 hover:bg-amber-50'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              navigate('/create');
            }}
            className="mt-1 px-4 py-3 rounded-xl bg-gradient-to-l from-amber-500 to-amber-600 text-white font-extrabold text-sm"
          >
            ابدأ تصميم إعلانك
          </button>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 bg-gradient-to-b from-amber-50 to-amber-100/70 border-t-2 border-amber-200/70">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center space-y-2.5">
        <p className="font-black text-xl md:text-2xl oro-gradient-text">
          مشروع طلابي تعليمي — منصة أورو ORO
        </p>
        <p className="text-sm md:text-base font-bold text-stone-600">
          مشروع الطالبة — الصف العاشر (10/1)
          <span className="text-amber-500 mx-1.5">•</span> العام الدراسي 2026–2027
        </p>
        <p className="text-xs md:text-sm text-stone-500">
          مشروع طلابي يدعم المشاريع الصغيرة والأسر المنتجة — جميع البيانات تحفظ محلياً في متصفحك فقط.
        </p>
        <p className="text-xs text-stone-400">
          © 2026–2027 <span className="text-amber-500 mx-0.5">|</span> جميع الحقوق محفوظة لمدرسة جميلة بنت عمرو
        </p>
      </div>
    </footer>
  );
}
