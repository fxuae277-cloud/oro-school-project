import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { PosterCanvas } from '@/components/PosterCanvas';
import { generateAdText } from '@/lib/generator';
import { SAMPLES } from '@/lib/samples';
import { AD_TYPES, COLOR_SCHEMES, type AdData, type AdType, type ColorScheme } from '@/lib/types';
import { TEMPLATE_NAMES } from '@/lib/posters';

const LS_KEY = 'oro-ad-data';

const DEFAULT_FORM: AdData = {
  storeName: '',
  businessType: '',
  productName: '',
  description: '',
  price: '',
  contact: '',
  adType: 'new',
};

function loadSaved(): AdData {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...DEFAULT_FORM, ...JSON.parse(raw) };
  } catch {
    /* تجاهل */
  }
  return DEFAULT_FORM;
}

export default function Create() {
  const [params] = useSearchParams();
  const [form, setForm] = useState<AdData>(loadSaved);
  const [template, setTemplate] = useState(1);
  const [colors, setColors] = useState<ColorScheme>(COLOR_SCHEMES[0]);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [headline, setHeadline] = useState('');
  const [body, setBody] = useState('');
  const [cta, setCta] = useState('');
  const [variant, setVariant] = useState(0);
  const [generated, setGenerated] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // تعبئة النموذج من نموذج جاهز عبر ?sample=
  useEffect(() => {
    const sid = params.get('sample');
    if (!sid) return;
    const s = SAMPLES.find((x) => x.id === sid);
    if (!s) return;
    const next = { ...s.data, adType: s.adType };
    setForm(next);
    setTemplate(s.template);
    setColors(COLOR_SCHEMES.find((c) => c.id === s.colorId) ?? COLOR_SCHEMES[0]);
    applyGenerated(next, s.adType, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // حفظ تلقائي في المتصفح
  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem(LS_KEY, JSON.stringify(form)), 400);
    return () => clearTimeout(t);
  }, [form]);

  function applyGenerated(f: AdData, adType: AdType = f.adType, v = 0) {
    const g = generateAdText({ ...f, adType }, v);
    setHeadline(g.headline);
    setBody(g.body);
    setCta(g.cta);
    setGenerated(true);
  }

  const set = (key: keyof AdData, value: string) => setForm((f) => ({ ...f, [key]: value }));

  function onImageFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => setImage(img);
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  const options = useMemo(
    () => ({
      template,
      colors,
      storeName: form.storeName,
      productName: form.productName,
      headline: headline || 'عنوان إعلانك يظهر هنا',
      body: body || 'اكتب بيانات منتجك واضغط «إنشاء إعلاني» ليصنع أورو لك نصاً تسويقياً وتصميماً جاهزاً.',
      cta: cta || 'اطلب الآن',
      price: form.price,
      contact: form.contact,
      adType: form.adType,
      image,
    }),
    [template, colors, form, headline, body, cta, image],
  );

  function downloadPNG() {
    const canvas = previewRef.current?.querySelector('canvas');
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = `oro-ad-${form.storeName || 'ad'}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  }

  const inputCls =
    'w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-stone-300';
  const labelCls = 'block mb-1.5 text-sm font-extrabold text-stone-700';

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-stone-800 text-center">أنشئ إعلانك</h1>
      <p className="text-center text-stone-500 mt-2">املأ البيانات، اضغط زراً واحداً، واحصل على إعلانك الجاهز</p>

      <div className="mt-8 grid lg:grid-cols-2 gap-8 items-start">
        {/* النموذج */}
        <div className="rounded-2xl bg-white border border-amber-100 shadow-sm p-6 space-y-4">
          <div>
            <label className={labelCls}>اسم المتجر أو المشروع *</label>
            <input className={inputCls} placeholder="مثال: عطور همس" value={form.storeName} onChange={(e) => set('storeName', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>نوع النشاط التجاري *</label>
            <input className={inputCls} placeholder="مثال: متجر عطور، حلويات منزلية، مقهى..." value={form.businessType} onChange={(e) => set('businessType', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>اسم المنتج أو الخدمة *</label>
            <input className={inputCls} placeholder="مثال: عطر أكاسيا" value={form.productName} onChange={(e) => set('productName', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>وصف مختصر للمنتج</label>
            <textarea className={inputCls + ' min-h-[80px] resize-y'} placeholder="مثال: برائحة تجمع بين النقاء والدفء، ثبات يدوم طوال اليوم." value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>السعر (اختياري)</label>
              <input className={inputCls} placeholder="مثال: 12" inputMode="decimal" value={form.price} onChange={(e) => set('price', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>رقم التواصل (اختياري)</label>
              <input className={inputCls} placeholder="مثال: 9500 1234" inputMode="tel" value={form.contact} onChange={(e) => set('contact', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>صورة المنتج (اختياري)</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2.5 rounded-xl border-2 border-dashed border-amber-300 text-amber-700 text-sm font-bold hover:bg-amber-50 transition"
              >
                {image ? '✓ تم رفع الصورة — اضغط للتغيير' : 'اختر صورة من جهازك'}
              </button>
              {image && (
                <button onClick={() => setImage(null)} className="text-xs font-bold text-red-400 hover:text-red-600">
                  إزالة الصورة
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onImageFile(e.target.files?.[0])} />
          </div>
          <div>
            <label className={labelCls}>نوع الإعلان</label>
            <div className="grid grid-cols-3 gap-2">
              {AD_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => set('adType', t.id)}
                  className={`rounded-xl border-2 px-2 py-2.5 text-sm font-extrabold transition ${
                    form.adType === t.id
                      ? 'border-amber-500 bg-amber-50 text-amber-800'
                      : 'border-stone-200 text-stone-500 hover:border-amber-200'
                  }`}
                >
                  {t.label}
                  <span className="block text-[10px] font-medium mt-0.5 opacity-70">{t.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setVariant(0);
              applyGenerated(form, form.adType, 0);
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-l from-amber-500 to-amber-600 text-white text-lg font-black shadow-lg shadow-amber-200 hover:opacity-90 transition"
          >
            ✨ إنشاء إعلاني
          </button>
        </div>

        {/* المعاينة والتخصيص */}
        <div className="space-y-5 lg:sticky lg:top-24">
          <div className="rounded-2xl bg-white border border-amber-100 shadow-sm p-4">
            <p className="text-sm font-extrabold text-stone-700 mb-3">معاينة مباشرة</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-1" ref={previewRef}>
                <PosterCanvas options={options} />
              </div>
              <div className="col-span-1 flex flex-col gap-3">
                {/* اختيار القالب */}
                <p className="text-xs font-extrabold text-stone-500">القالب</p>
                <div className="grid grid-cols-1 gap-2">
                  {TEMPLATE_NAMES.map((name, i) => (
                    <button
                      key={name}
                      onClick={() => setTemplate(i + 1)}
                      className={`text-right px-3 py-2 rounded-lg text-xs font-extrabold border-2 transition ${
                        template === i + 1
                          ? 'border-amber-500 bg-amber-50 text-amber-800'
                          : 'border-stone-200 text-stone-500 hover:border-amber-200'
                      }`}
                    >
                      {i + 1}. {name}
                    </button>
                  ))}
                </div>
                {/* اختيار الألوان */}
                <p className="text-xs font-extrabold text-stone-500 mt-1">ألوان الإعلان</p>
                <div className="flex flex-wrap gap-2">
                  {COLOR_SCHEMES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setColors(c)}
                      title={c.label}
                      className={`w-9 h-9 rounded-full border-2 transition hover:scale-110 ${
                        colors.id === c.id ? 'border-stone-700 ring-2 ring-amber-300' : 'border-white shadow'
                      }`}
                      style={{ background: `linear-gradient(135deg, ${c.bg} 50%, ${c.accent} 50%)` }}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-stone-400">المخطط الحالي: {colors.label}</p>
                {template === 1 && (
                  <p className="text-[11px] text-amber-600 bg-amber-50 rounded-lg px-2.5 py-1.5 leading-relaxed">
                    القالب الفاخر الذهبي يعتمد ألوانه الذهبية الثابتة لتناغمه مع خلفيته الفوتوغرافية.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* النص التسويقي */}
          <div className="rounded-2xl bg-white border border-amber-100 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-extrabold text-stone-700">النص التسويقي</p>
              {generated && (
                <button
                  onClick={() => {
                    const v = variant + 1;
                    setVariant(v);
                    applyGenerated(form, form.adType, v);
                  }}
                  className="text-xs font-extrabold text-violet-600 hover:text-violet-800"
                >
                  ↻ أعد التوليد
                </button>
              )}
            </div>
            {!generated ? (
              <p className="text-sm text-stone-400 leading-relaxed">
                املأ البيانات واضغط «إنشاء إعلاني» ليظهر هنا عنوان جذاب ووصف تسويقي وعبارة تحفيزية —
                وتقدر تعدّل أي نص يدوياً.
              </p>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">العنوان</label>
                  <input className={inputCls} value={headline} onChange={(e) => setHeadline(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">الوصف التسويقي</label>
                  <textarea className={inputCls + ' min-h-[90px] resize-y'} value={body} onChange={(e) => setBody(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">عبارة تشجيعية</label>
                  <input className={inputCls} value={cta} onChange={(e) => setCta(e.target.value)} />
                </div>
                <p className="text-[11px] text-stone-400 bg-amber-50 rounded-lg px-3 py-2 leading-relaxed">
                  ℹ️ النص مُنشأ محلياً من قوالب تسويقية متنوعة (مولد قوالب) — وليس ذكاءً اصطناعياً
                  حقيقياً، حتى تعمل التجربة دون أي اشتراكات مدفوعة.
                </p>
              </>
            )}
          </div>

          <button
            onClick={downloadPNG}
            className="w-full py-4 rounded-2xl bg-gradient-to-l from-violet-600 to-violet-700 text-white text-lg font-black shadow-lg shadow-violet-200 hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            ⬇️ تنزيل الإعلان PNG
          </button>
        </div>
      </div>
    </div>
  );
}
