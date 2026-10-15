import type { AdData, AdType, GeneratedAd } from './types';

/**
 * مولد النصوص التسويقية — نسخة محلية تعتمد على قوالب جاهزة.
 * هذه النسخة لا تستخدم أي خدمة ذكاء اصطناعي خارجية ولا مفاتيح API،
 * حتى تعمل التجربة كاملة دون اشتراكات مدفوعة.
 */

const SOURCE_NOTE =
  'النص مُنشأ محلياً من قوالب تسويقية متنوعة (مولد قوالب)، ويمكن استبداله لاحقاً بنموذج ذكاء اصطناعي.';

const HEADLINES: Record<AdType, string[]> = {
  offer: [
    'عرض لا يُفوَّت لفترة محدودة!',
    'خصم استثنائي ينتظرك الآن',
    'الوقت ينفد والعرض ما يتكرر',
    'فرصتك وصلت... لا تؤجلها!',
  ],
  new: [
    'وصل حديثاً... وصل الجديد!',
    'منتج جديد يفرض نفسه',
    'أحدث إضافة لمتجرك المفضل',
    'تشويق انتهى... التوفرة بدأت!',
  ],
  intro: [
    'تعرّف علينا عن قرب',
    'اسم جديد يستحق التجربة',
    'قريبون منك أكثر مما تتخيل',
    'قصة شغف تبدأ من هنا',
  ],
};

const ACTIVITY_HINTS: { keywords: string[]; bodies: string[] }[] = [
  {
    keywords: ['عطر', 'عطور', 'مسك', 'عود', 'بخور', 'فانيلا', 'مسك'],
    bodies: [
      'عطر {product} من {store} يترك أثراً لا يُنسى من أول لحظة، ثبات عالٍ وفوحان يليق بك وبمن تحب.',
      'اكتشف عطر {product} — مزيج متقن من النفحات الفاخرة، متوفر الآن لدى {store}.',
      'مع عطر {product} من {store}، حضورك يبدأ قبل كلامك. جرّبه ودع الفوحان يتحدث عنك.',
    ],
  },
  {
    keywords: ['حلويات', 'كيك', 'معجنات', 'تمر', 'شوكولاتة', 'حلا', 'قهوة عربية'],
    bodies: [
      'حلا {product} من {store} يُحضّر بأجود المكونات وبحب، طعم يذوّب القلب ويرضي كل الأذواق.',
      'من مطبخنا إلى مائدتك: {product} من {store} — حلاوة تستاهل المناسبة، وجودة تستاهل التكرار.',
    ],
  },
  {
    keywords: ['ملابس', 'عباية', 'فستان', 'أزياء', 'حجاب', 'قماش'],
    bodies: [
      'أناقة تليق بك مع {product} من {store} — قطع مختارة بعناية لتكملي إطلالتك في كل مناسبة.',
      'وصلت تشكيلة {product} الجديدة لدى {store}: خامات فاخرة، قصّات عصرية، وأسعار تُرضي الجميع.',
    ],
  },
  {
    keywords: ['قهوة', 'كافيه', 'مقهى', 'لاتيه', 'إسبريسو', 'كيك'],
    bodies: [
      'رشفة {product} من {store} تكفي لتغيّر مزاجك كله. قهوة مختصة تحضّر بشغف، في مكان يليق بك.',
      'في {store}، {product} ليس مجرد مشروب... تجربة هدوء ونكهة تستحق أن تتكرر كل يوم.',
    ],
  },
  {
    keywords: ['تجميل', 'صالون', 'بشرة', 'مكياج', 'شعر', 'عناية', 'نظارة'],
    bodies: [
      'دلّلي نفسك مع {product} في {store} — أيدي خبيرة ومنتجات أصلية تعيد لبشرتك نضارتها.',
      'جمالك يستاهل {store}: جرّبي {product} واستمتعي بإطلالة تليق بك، بإشراف خبراء العناية.',
    ],
  },
];

const GENERIC_BODIES: { [k in AdType]: string[] } = {
  offer: [
    'لا تفوّت عرض {product} من {store} — جودة ممتازة وسعر ما يتكرر إلا نادراً!',
    '{store} يقدّم لك {product} بعرض خاص حقيقي: نفس الجودة، سعر أجمل.',
  ],
  new: [
    'نقدّم لكم بكل فخر {product} — إضافة جديدة من {store} صُنعت بعناية لتنال إعجابكم.',
    'الجديد من {store} وصل: {product}. جودة تستاهل التجربة وسعر يريّح القلب.',
  ],
  intro: [
    '{store} وجهة موثوقة لكل من يبحث عن الجودة. تعرّف على {product} واكتشف الفرق بنفسك.',
    'في {store} نؤمن أن التفاصيل تصنع الفرق. جرّب {product} وكن جزءاً من قصة نجاحنا.',
  ],
};

const CTAS: string[] = [
  'اطلب الآن قبل انتهاء الكمية',
  'تواصل معنا اليوم ولا تتردد',
  'الكمية محدودة... سارع بالحجز',
  'راسلنا الآن واحصل على عرضك',
  'جرّبه مرة، وستعود لنا دائماً',
];

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

function hashSeed(s: string): number {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003;
  return h;
}

function fill(template: string, data: AdData): string {
  return template.replaceAll('{product}', data.productName.trim()).replaceAll('{store}', data.storeName.trim());
}

export function generateAdText(data: AdData, variant = 0): GeneratedAd {
  const seed = hashSeed(
    data.storeName + '|' + data.productName + '|' + data.businessType + '|' + data.adType + '|' + variant,
  );

  const headline = pick(HEADLINES[data.adType], seed);

  const lowerType = (data.businessType || '').toLowerCase();
  let bodies: string[] | null = null;
  for (const group of ACTIVITY_HINTS) {
    if (group.keywords.some((k) => lowerType.includes(k))) {
      bodies = group.bodies;
      break;
    }
  }
  const bodyPool = bodies ?? GENERIC_BODIES[data.adType];
  const body = fill(pick(bodyPool, seed + variant), data);

  // إضافة وصف المستخدم إن وُجد (مختصر)
  const desc = data.description.trim();
  const extra = desc ? ` ${desc.length > 90 ? desc.slice(0, 90) + '…' : desc}` : '';

  const cta = pick(CTAS, seed + variant * 3);

  return {
    headline,
    body: body + extra,
    cta,
    sourceNote: SOURCE_NOTE,
  };
}
