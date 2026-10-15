import { Link } from 'react-router';
import { PosterCanvas } from '@/components/PosterCanvas';
import { generateAdText } from '@/lib/generator';
import { SAMPLES } from '@/lib/samples';
import { COLOR_SCHEMES } from '@/lib/types';

export default function Templates() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-stone-800 text-center">النماذج الجاهزة</h1>
      <p className="text-center text-stone-500 mt-2 max-w-2xl mx-auto">
        خمسة أنشطة تجارية تجريبية ببيانات جاهزة — اضغط «جرّب هذا النموذج» ليتم نقلك إلى صفحة الإنشاء
        مع تعبئة كل البيانات تلقائياً، ومن هناك يمكنك التعديل والتنزيل.
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLES.map((s) => {
          const colors = COLOR_SCHEMES.find((c) => c.id === s.colorId) ?? COLOR_SCHEMES[0];
          const text = generateAdText({ ...s.data, adType: s.adType });
          return (
            <div
              key={s.id}
              className="rounded-2xl overflow-hidden bg-white border border-amber-100 shadow-md shadow-amber-100/60 hover:shadow-xl hover:-translate-y-1 transition flex flex-col"
            >
              <PosterCanvas
                options={{
                  template: s.template,
                  colors,
                  storeName: s.data.storeName,
                  productName: s.data.productName,
                  headline: text.headline,
                  body: text.body,
                  cta: text.cta,
                  price: s.data.price,
                  contact: s.data.contact,
                  adType: s.adType,
                  image: null,
                }}
              />
              <div className="p-4 flex flex-col gap-1 grow">
                <p className="font-black text-amber-800">
                  {s.emoji} {s.title}
                </p>
                <p className="text-sm text-stone-500">{s.blurb}</p>
                <div className="mt-3 flex items-center justify-between">
                  <Link
                    to={`/create?sample=${s.id}`}
                    className="px-4 py-2 rounded-full bg-gradient-to-l from-amber-500 to-amber-600 text-white text-xs font-black shadow hover:opacity-90 transition"
                  >
                    جرّب هذا النموذج ←
                  </Link>
                  <span className="text-[11px] text-stone-400">
                    قالب {s.template} • {colors.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* بطاقة دعوة إضافية لإكمال الشبكة */}
        <div className="rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/50 p-6 flex flex-col items-center justify-center text-center gap-3">
          <span className="text-4xl">✨</span>
          <p className="font-black text-violet-800">نشاطك غير موجود هنا؟</p>
          <p className="text-sm text-violet-600">أورو يعمل مع أي نوع نشاط — جرّبه ببياناتك الخاصة.</p>
          <Link
            to="/create"
            className="mt-1 px-5 py-2.5 rounded-full bg-violet-600 text-white text-sm font-black hover:bg-violet-700 transition"
          >
            أنشئ إعلانك الخاص
          </Link>
        </div>
      </div>
    </div>
  );
}
