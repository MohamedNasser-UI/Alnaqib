/**
 * Official 27 Egyptian governorates (Arabic and English).
 */
export const GOVERNORATES = [
  { value: 'cairo', labelEn: 'Cairo', labelAr: 'القاهرة' },
  { value: 'alexandria', labelEn: 'Alexandria', labelAr: 'الإسكندرية' },
  { value: 'giza', labelEn: 'Giza', labelAr: 'الجيزة' },
  { value: 'dakahlia', labelEn: 'Dakahlia', labelAr: 'الدقهلية' },
  { value: 'red-sea', labelEn: 'Red Sea', labelAr: 'البحر الأحمر' },
  { value: 'beheira', labelEn: 'Beheira', labelAr: 'البحيرة' },
  { value: 'fayoum', labelEn: 'Fayoum', labelAr: 'الفيوم' },
  { value: 'gharbia', labelEn: 'Gharbia', labelAr: 'الغربية' },
  { value: 'ismailia', labelEn: 'Ismailia', labelAr: 'الإسماعيلية' },
  { value: 'menoufia', labelEn: 'Menoufia', labelAr: 'المنوفية' },
  { value: 'minya', labelEn: 'Minya', labelAr: 'المنيا' },
  { value: 'qalyubia', labelEn: 'Qalyubia', labelAr: 'القليوبية' },
  { value: 'new-valley', labelEn: 'New Valley', labelAr: 'الوادي الجديد' },
  { value: 'north-sinai', labelEn: 'North Sinai', labelAr: 'شمال سيناء' },
  { value: 'port-said', labelEn: 'Port Said', labelAr: 'بورسعيد' },
  { value: 'qena', labelEn: 'Qena', labelAr: 'قنا' },
  { value: 'sohag', labelEn: 'Sohag', labelAr: 'سوهاج' },
  { value: 'south-sinai', labelEn: 'South Sinai', labelAr: 'جنوب سيناء' },
  { value: 'suez', labelEn: 'Suez', labelAr: 'السويس' },
  { value: 'luxor', labelEn: 'Luxor', labelAr: 'الأقصر' },
  { value: 'aswan', labelEn: 'Aswan', labelAr: 'أسوان' },
  { value: 'damietta', labelEn: 'Damietta', labelAr: 'دمياط' },
  { value: 'kafr-el-sheikh', labelEn: 'Kafr El Sheikh', labelAr: 'كفر الشيخ' },
  { value: 'matrouh', labelEn: 'Matrouh', labelAr: 'مطروح' },
  { value: 'sharqia', labelEn: 'Sharqia', labelAr: 'الشرقية' },
  { value: 'beni-suef', labelEn: 'Beni Suef', labelAr: 'بني سويف' },
  { value: 'asyut', labelEn: 'Asyut', labelAr: 'أسيوط' },
] as const;

export type GovernorateValue = (typeof GOVERNORATES)[number]['value'];

export const BOTTLE_SIZES = [35, 55, 110] as const;
export type BottleSize = (typeof BOTTLE_SIZES)[number];

/** Flat delivery fee in EGP (Egypt-wide). */
export const DELIVERY_FLAT_RATE_EGP = 50;
