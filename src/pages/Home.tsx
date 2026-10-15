import { Link } from 'react-router';
import { PosterCanvas } from '@/components/PosterCanvas';
import { generateAdText } from '@/lib/generator';
import { SAMPLES } from '@/lib/samples';
import { COLOR_SCHEMES } from '@/lib/types';

function SampleCard({ id }: { id: string }) {
  const s = SAMPLES.find((x) => x.id === id)!;
  const colors = COLOR_SCHEMES.find((c) => c.id === s.colorId) ?? COLOR_SCHEMES[0];
  const text = generateAdText({ ...s.data, adType: s.adType });
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg shadow-amber-100 border border-amber-100 bg-white hover:shadow-xl hover:-translate-y-1 transition">
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
      <div className="p-3 text-center">
        <p className="font-extrabold text-amber-800 text-sm">{s.title}</p>
      </div>
    </div>
  );
}

const STEPS = [
  { n: '1', t: 'اكتب بيانات منتجك', d: 'اسم المتجر، المنتج، السعر ورقم التواصل في نموذج بسيط.' },
  { n: '2', t: 'أورو يكتب ويصمّم', d: 'نص تسويقي جاهز ومنشور بصري احترافي خلال ثوانٍ.' },
  { n: '3', t: 'حمّل وانشر', d: 'اختر القالب والألوان التي تعجبك ونزّل إعلانك PNG جاهزاً للنشر.' },
];

export default function Home() {
  return (
    <div>
      {/* قسم الترحيب */}
      <section className="oro-hero-bg">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-xs font-extrabold mb-6">
            منصة عربية لتصميم الإعلانات
          </span>
          <h1 className="text-6xl md:text-8xl font-black oro-gradient-text leading-tight">أورو</h1>
          <p className="mt-1 text-lg font-bold tracking-[0.5em] text-amber-600/70">ORO</p>
          <p className="mt-6 text-2xl md:text-4xl font-black text-stone-800 leading-snug">
            حوّل فكرة مشروعك إلى إعلان احترافي خلال دقائق
          </p>
          <p className="mt-4 text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
            «أورو تخلي متجرك يتكلم، وسوقك يذكرك مع أورو» — صمّم منشورات تسويقية جميلة لمتجرك
            المنزلي دون الحاجة إلى مصمم محترف.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/create"
              className="px-8 py-4 rounded-full bg-gradient-to-l from-amber-500 to-amber-600 text-white text-lg font-black shadow-lg shadow-amber-300/60 hover:scale-105 transition"
            >
              ابدأ تصميم إعلانك
            </Link>
            <Link
              to="/templates"
              className="px-8 py-4 rounded-full bg-white border-2 border-violet-200 text-violet-700 text-lg font-black hover:bg-violet-50 transition"
            >
              شاهد النماذج الجاهزة
            </Link>
          </div>
          <p className="mt-5 text-xs text-stone-400">بدون تسجيل • بدون اشتراكات • يعمل مباشرة في المتصفح</p>
        </div>
      </section>

      {/* كيف يعمل */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-center text-3xl font-black text-stone-800">كيف يعمل أورو؟</h2>
        <p className="text-center text-stone-500 mt-2">ثلاث خطوات فقط تفصلك عن إعلانك الجاهز</p>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl bg-white border border-amber-100 p-6 shadow-sm hover:shadow-md transition text-center">
              <span className="inline-grid place-items-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white text-xl font-black shadow-md shadow-amber-200">
                {s.n}
              </span>
              <h3 className="mt-4 font-black text-lg text-stone-800">{s.t}</h3>
              <p className="mt-2 text-sm text-stone-500 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* أمثلة منشورات */}
      <section className="bg-gradient-to-b from-white to-amber-50/70 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-center text-3xl font-black text-stone-800">أمثلة لمنشورات تسويقية</h2>
          <p className="text-center text-stone-500 mt-2">
            منشورات حقيقية وُلدت بأورو — جرّبها بنفسك من صفحة النماذج الجاهزة
          </p>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-5">
            <SampleCard id="perfume" />
            <SampleCard id="cafe" />
            <SampleCard id="sweets" />
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/templates"
              className="inline-block px-8 py-3.5 rounded-full bg-violet-600 text-white font-black shadow-md shadow-violet-200 hover:bg-violet-700 transition"
            >
              جرّب كل النماذج الخمسة
            </Link>
          </div>
        </div>
      </section>

      {/* شريط دعوة أخير */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="rounded-3xl bg-gradient-to-l from-violet-700 via-violet-600 to-amber-600 p-10 md:p-14 text-center text-white shadow-xl shadow-violet-200">
          <h2 className="text-3xl md:text-4xl font-black">متجرك يستاهل يشوفه الناس</h2>
          <p className="mt-3 text-violet-100 max-w-xl mx-auto">
            أنشئ أول إعلان لك الآن — يستغرق أقل من دقيقتين من البداية حتى التنزيل.
          </p>
          <Link
            to="/create"
            className="mt-6 inline-block px-10 py-4 rounded-full bg-white text-violet-700 text-lg font-black shadow-lg hover:scale-105 transition"
          >
            ابدأ الآن مجاناً
          </Link>
        </div>
      </section>
    </div>
  );
}
