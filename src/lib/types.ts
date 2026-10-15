export type AdType = 'offer' | 'new' | 'intro';

export interface AdData {
  storeName: string;
  businessType: string;
  productName: string;
  description: string;
  price: string;
  contact: string;
  adType: AdType;
}

export interface GeneratedAd {
  headline: string;
  body: string;
  cta: string;
  sourceNote: string;
}

export interface ColorScheme {
  id: string;
  label: string;
  bg: string;
  bg2: string;
  text: string;
  subtext: string;
  accent: string;
  accentText: string;
}

export const AD_TYPES: { id: AdType; label: string; hint: string }[] = [
  { id: 'offer', label: 'عرض خاص', hint: 'تخفيضات وعروض لفترة محدودة' },
  { id: 'new', label: 'منتج جديد', hint: 'إطلاق منتج أو خدمة حديثة' },
  { id: 'intro', label: 'إعلان تعريفي', hint: 'تعريف الناس بمتجرك ونشاطك' },
];

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: 'gold',
    label: 'ذهبي ملكي',
    bg: '#fdf8ec',
    bg2: '#f3e5c0',
    text: '#3d2e07',
    subtext: '#7a6520',
    accent: '#b8860b',
    accentText: '#ffffff',
  },
  {
    id: 'violet',
    label: 'بنفسجي أنيق',
    bg: '#f6f2ff',
    bg2: '#e5dbff',
    text: '#2a1a4d',
    subtext: '#5b4a8a',
    accent: '#7c3aed',
    accentText: '#ffffff',
  },
  {
    id: 'rose',
    label: 'وردي ناعم',
    bg: '#fff5f7',
    bg2: '#ffe0e8',
    text: '#4d1a2a',
    subtext: '#8a4a5b',
    accent: '#db2777',
    accentText: '#ffffff',
  },
  {
    id: 'emerald',
    label: 'زمردي طبيعي',
    bg: '#f2fbf6',
    bg2: '#d9f2e3',
    text: '#123a26',
    subtext: '#3f6b52',
    accent: '#059669',
    accentText: '#ffffff',
  },
  {
    id: 'navy',
    label: 'كحلي فاخر',
    bg: '#101a2e',
    bg2: '#1d2c4d',
    text: '#f5f0e1',
    subtext: '#c9bd97',
    accent: '#d4af37',
    accentText: '#1a1405',
  },
];
