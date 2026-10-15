import { Link } from 'react-router';

const VALUES = [
  {
    emoji: '🏡',
    title: 'دعم المشاريع الصغيرة',
    text: 'نُساعد المتاجر المنزلية والأسر المنتجة على الوصول إلى عملائهم بصورة احترافية دون تكلفة باهظة.',
  },
  {
    emoji: '⏱️',
    title: 'توفير الوقت',
    text: 'إعلان كامل من الفكرة إلى التصميم الجاهز للنشر خلال دقائق، بدلاً من أيام الانتظار على المصممين.',
  },
  {
    emoji: '💸',
    title: 'تقليل التكاليف',
    text: 'بدائل ذكية ومجانية للتصميم والتسويق تجعل أصحاب المشاريع يستثمرون أموالهم في منتجاتهم.',
  },
  {
    emoji: '🤖',
    title: 'تبسيط التقنية',
    text: 'أدوات كانت حكراً على المحترفين أصبحت في متناول الجميع بضغطة زر وواجهة عربية بسيطة.',
  },
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center">
        <h1 className="text-4xl font-black oro-gradient-text">عن أورو</h1>
        <p className="mt-3 text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
          أورو فكرة طلابية وُلدت من سؤال بسيط: لماذا يحتاج صاحب المشروع الصغير إلى مصمم ومال كثير
          ليحصل على إعلان جميل؟
        </p>
      </div>

      <div className="mt-8 rounded-3xl bg-white border border-amber-100 shadow-sm p-8 leading-loose text-stone-600 space-y-4">
        <p>
          <strong className="text-amber-800">أورو (ORO)</strong> — وبالإيطالية تعني «ذهب» — منصة
          إلكترونية عربية تساعد أصحاب المشاريع الصغيرة والمتاجر المنزلية والأسر المنتجة على تصميم
          منشورات وإعلانات تسويقية بسهولة وخلال دقائق، دون الحاجة إلى مصمم محترف أو خبرة تقنية.
        </p>
        <p>
          يكتب المستخدم بيانات منتجه، ويقوم أورو بإنشاء نص تسويقي جذاب وتحويله إلى منشور بصري
          احترافي قابل للتنزيل والنشر مباشرة. هدفنا توفير الوقت، وتقليل تكاليف التصميم والتسويق،
          وتمكين الشباب وأصحاب الأسر المنتجة من التسويق لمشاريعهم بأنفسهم.
        </p>
        <p className="text-sm text-stone-400 bg-amber-50 rounded-xl px-4 py-3">
          ملاحظة تقنية: هذه النسخة الأولى تعمل بمولد نصوص محلي يعتمد على قوالب تسويقية متنوعة، وتحفظ
          البيانات محلياً في المتصفح فقط — دون تسجيل حساب أو قواعد بيانات أو أي خدمات مدفوعة.
        </p>
      </div>

      <div className="mt-10 grid sm:grid-cols-2 gap-5">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-2xl bg-white border border-amber-100 p-6 shadow-sm hover:shadow-md transition">
            <span className="text-3xl">{v.emoji}</span>
            <h3 className="mt-3 font-black text-stone-800">{v.title}</h3>
            <p className="mt-2 text-sm text-stone-500 leading-relaxed">{v.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/create"
          className="inline-block px-10 py-4 rounded-full bg-gradient-to-l from-amber-500 to-amber-600 text-white text-lg font-black shadow-lg shadow-amber-200 hover:opacity-90 transition"
        >
          جرّب أورو الآن
        </Link>
      </div>
    </div>
  );
}
