import type { AdData, AdType } from './types';

export interface Sample {
  id: string;
  title: string;
  emoji: string;
  blurb: string;
  template: number;
  colorId: string;
  adType: AdType;
  data: Omit<AdData, 'adType'>;
}

export const SAMPLES: Sample[] = [
  {
    id: 'perfume',
    title: 'متجر عطور',
    emoji: '🌸',
    blurb: 'عطر «أكاسيا» برائحة الأزهار الفاخرة',
    template: 1,
    colorId: 'gold',
    adType: 'new',
    data: {
      storeName: 'عطور همس',
      businessType: 'متجر عطور',
      productName: 'عطر أكاسيا',
      description: 'برائحة تجمع بين النقاء والدفء، ثبات يدوم طوال اليوم.',
      price: '12',
      contact: '9500 1234',
    },
  },
  {
    id: 'sweets',
    title: 'حلويات منزلية',
    emoji: '🍰',
    blurb: 'كيك التمر بالكراميل — طلبات المناسبات',
    template: 5,
    colorId: 'rose',
    adType: 'offer',
    data: {
      storeName: 'حلا بيتنا',
      businessType: 'حلويات منزلية',
      productName: 'كيك التمر بالكراميل',
      description: 'يُحضّر طازجاً بمكونات طبيعية 100%، مناسب للمناسبات والضيافة.',
      price: '5',
      contact: '9200 5678',
    },
  },
  {
    id: 'fashion',
    title: 'متجر ملابس',
    emoji: '👗',
    blurb: 'تشكيلة عبايات موسم الشتاء وصلت الآن',
    template: 3,
    colorId: 'violet',
    adType: 'new',
    data: {
      storeName: 'أناقتي',
      businessType: 'متجر ملابس وعبايات',
      productName: 'عباية كتف مطرزة',
      description: 'قماش كوري فاخر وتطريز يدوي أنيق، بمقاسات متعددة وألوان متوفرة.',
      price: '18',
      contact: '9300 8765',
    },
  },
  {
    id: 'cafe',
    title: 'مقهى',
    emoji: '☕',
    blurb: 'لاتيه الورد المميز — تجربة تشويق جديدة',
    template: 2,
    colorId: 'navy',
    adType: 'intro',
    data: {
      storeName: 'ركن الهدوء',
      businessType: 'مقهى وكوفي شوب',
      productName: 'لاتيه الورد',
      description: 'بن مختص مع لمسة ورد طبيعية، يُقدَّم في أجواء هادئة تليق بك.',
      price: '2.5',
      contact: '9400 4321',
    },
  },
  {
    id: 'salon',
    title: 'صالون تجميل',
    emoji: '💆‍♀️',
    blurb: 'باقة العناية بالبشرة — عرض خاص للمناسبات',
    template: 4,
    colorId: 'emerald',
    adType: 'offer',
    data: {
      storeName: 'لمسة جمال',
      businessType: 'صالون تجميل وعناية',
      productName: 'باقة نضارة البشرة',
      description: 'جلسة تنظيف وترطيب عميق بمنتجات طبيعية، بإشراف أخصائية بشرة.',
      price: '10',
      contact: '9100 2468',
    },
  },
];
