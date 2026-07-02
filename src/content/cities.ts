/**
 * Curated city list for manual location selection.
 * Names are in Arabic by design — the app's sacred/locale anchor language.
 */
export interface City {
  key: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export const CITIES: City[] = [
  { key: 'jerusalem', name: 'القدس', country: 'فلسطين', latitude: 31.7683, longitude: 35.2137 },
  { key: 'amman', name: 'عمّان', country: 'الأردن', latitude: 31.9539, longitude: 35.9106 },
  { key: 'cairo', name: 'القاهرة', country: 'مصر', latitude: 30.0444, longitude: 31.2357 },
  { key: 'istanbul', name: 'إسطنبول', country: 'تركيا', latitude: 41.0082, longitude: 28.9784 },
  { key: 'dubai', name: 'دبي', country: 'الإمارات', latitude: 25.2048, longitude: 55.2708 },
  { key: 'makkah', name: 'مكة المكرمة', country: 'السعودية', latitude: 21.4225, longitude: 39.8262 },
  { key: 'madinah', name: 'المدينة المنورة', country: 'السعودية', latitude: 24.5247, longitude: 39.5692 },
  { key: 'riyadh', name: 'الرياض', country: 'السعودية', latitude: 24.7136, longitude: 46.6753 },
  { key: 'jeddah', name: 'جدة', country: 'السعودية', latitude: 21.4858, longitude: 39.1925 },
  { key: 'doha', name: 'الدوحة', country: 'قطر', latitude: 25.2854, longitude: 51.531 },
  { key: 'kuwait', name: 'مدينة الكويت', country: 'الكويت', latitude: 29.3759, longitude: 47.9774 },
  { key: 'manama', name: 'المنامة', country: 'البحرين', latitude: 26.2285, longitude: 50.586 },
  { key: 'muscat', name: 'مسقط', country: 'عُمان', latitude: 23.588, longitude: 58.3829 },
  { key: 'beirut', name: 'بيروت', country: 'لبنان', latitude: 33.8938, longitude: 35.5018 },
  { key: 'damascus', name: 'دمشق', country: 'سوريا', latitude: 33.5138, longitude: 36.2765 },
  { key: 'baghdad', name: 'بغداد', country: 'العراق', latitude: 33.3152, longitude: 44.3661 },
  { key: 'gaza', name: 'غزة', country: 'فلسطين', latitude: 31.5017, longitude: 34.4668 },
  { key: 'rabat', name: 'الرباط', country: 'المغرب', latitude: 34.0209, longitude: -6.8416 },
  { key: 'casablanca', name: 'الدار البيضاء', country: 'المغرب', latitude: 33.5731, longitude: -7.5898 },
  { key: 'algiers', name: 'الجزائر', country: 'الجزائر', latitude: 36.7538, longitude: 3.0588 },
  { key: 'tunis', name: 'تونس', country: 'تونس', latitude: 36.8065, longitude: 10.1815 },
  { key: 'tripoli', name: 'طرابلس', country: 'ليبيا', latitude: 32.8872, longitude: 13.1913 },
  { key: 'khartoum', name: 'الخرطوم', country: 'السودان', latitude: 15.5007, longitude: 32.5599 },
  { key: 'sanaa', name: 'صنعاء', country: 'اليمن', latitude: 15.3694, longitude: 44.191 },
  { key: 'london', name: 'لندن', country: 'بريطانيا', latitude: 51.5074, longitude: -0.1278 },
  { key: 'paris', name: 'باريس', country: 'فرنسا', latitude: 48.8566, longitude: 2.3522 },
  { key: 'berlin', name: 'برلين', country: 'ألمانيا', latitude: 52.52, longitude: 13.405 },
  { key: 'newyork', name: 'نيويورك', country: 'أمريكا', latitude: 40.7128, longitude: -74.006 },
  { key: 'toronto', name: 'تورونتو', country: 'كندا', latitude: 43.6532, longitude: -79.3832 },
  { key: 'jakarta', name: 'جاكرتا', country: 'إندونيسيا', latitude: -6.2088, longitude: 106.8456 },
  { key: 'kualalumpur', name: 'كوالالمبور', country: 'ماليزيا', latitude: 3.139, longitude: 101.6869 },
  { key: 'karachi', name: 'كراتشي', country: 'باكستان', latitude: 24.8607, longitude: 67.0011 },
  { key: 'dhaka', name: 'دكا', country: 'بنغلاديش', latitude: 23.8103, longitude: 90.4125 },
];

export const DEFAULT_CITY = CITIES[0];
