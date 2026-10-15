import { Link } from 'react-router';

const PLANS = [
  {
    name: 'الباقة المجانية',
    price: '0',
    period: 'للأبد',
    features: ['3 منشورات تجريبية', 'جميع القوالب الأساسية', 'تحميل PNG بجودة عالية', 'بدون تسجيل'],
    cta: 'ابدأ مجاناً',
    highlight: false,
  },
  {
    name: 'الباقة الأساسية',
    price: '1',
    period: 'ريال عماني / شهرياً',
    features: ['30 منشوراً شهرياً', 'جميع القوالب الخمسة', 'ألوان غير محدودة', 'أولوية في الدعم'],
    cta: 'الأنسب للبداية',
    highlight: true,
  },
  {
    name: 'الباقة الاحترافية',
    price: '2',
    period: 'ريال عماني / شهرياً',
    features: ['منشورات غير محدودة', 'مجموعة قوالب إضافية حصرية', 'توليد نصوص بخيارات متقدمة', 'دعم مميز'],
    cta: 'للمحترفين',
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-stone-800 text-center">الباقات والأسعار</h1>
      <p className="text-center text-stone-500 mt-2">
        أسعار رمزية صُممت لتناسب أصحاب المشاريع الصغيرة
      </p>

      <div className="mt-10 grid md:grid-cols-3 gap-6 items-stretch">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`rounded-3xl p-7 flex flex-col ${
              p.highlight
                ? 'bg-gradient-to-b from-violet-700 to-violet-800 text-white shadow-xl shadow-violet-200 ring-4 ring-amber-300/70 md:-translate-y-3'
                : 'bg-white border border-amber-100 shadow-sm'
            }`}
          >
            <p className={`font-black text-lg ${p.highlight ? 'text-amber-200' : 'text-violet-700'}`}>{p.name}</p>
            <p className="mt-4 flex items-end gap-2">
              <span className={`text-6xl font-black leading-none ${p.highlight ? 'text-white' : 'text-stone-800'}`}>
                {p.price}
              </span>
              <span className={`text-sm font-bold pb-1.5 ${p.highlight ? 'text-violet-200' : 'text-stone-400'}`}>
                {p.period}
              </span>
            </p>
            <ul className="mt-6 space-y-3 grow">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm font-bold">
                  <span className={`grid place-items-center w-5 h-5 rounded-full text-[10px] ${p.highlight ? 'bg-amber-300 text-violet-900' : 'bg-amber-100 text-amber-700'}`}>
                    ✓
                  </span>
                  <span className={p.highlight ? 'text-violet-50' : 'text-stone-600'}>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/create"
              className={`mt-7 text-center py-3 rounded-full font-black text-sm transition ${
                p.highlight
                  ? 'bg-amber-400 text-violet-900 hover:bg-amber-300'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              }`}
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-stone-400 max-w-xl mx-auto leading-relaxed">
        🎓 هذه الباقات مُقترحة لأغراض الدراسة المدرسية ودراسة الجدوى فقط — لا توجد بوابة دفع أو
        تحصيل أموال حقيقي في هذه النسخة، وجميع الوظائف الحالية مجانية بالكامل.
      </p>
    </div>
  );
}
