// ข้อมูลคาเฟอีนในเครื่องดื่ม (mg per serving)
export interface Drink {
  id: string;
  name: string;
  nameTh: string;
  caffeinePerServing: number; // mg per serving
  servingSize: string; // ขนาดมาตรฐาน
  category: 'coffee' | 'tea' | 'energy' | 'other';
  icon: string; // emoji icon
}

export const drinks: Drink[] = [
  // ☕ กาแฟ
  {
    id: 'espresso',
    name: 'Espresso',
    nameTh: 'เอสเพรสโซ',
    caffeinePerServing: 63,
    servingSize: '30 ml',
    category: 'coffee',
    icon: '☕',
  },
  {
    id: 'americano',
    name: 'Americano',
    nameTh: 'อเมริกาโน',
    caffeinePerServing: 95,
    servingSize: '240 ml',
    category: 'coffee',
    icon: '☕',
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    nameTh: 'คาปูชิโน',
    caffeinePerServing: 63,
    servingSize: '180 ml',
    category: 'coffee',
    icon: '☕',
  },
  {
    id: 'latte',
    name: 'Latte',
    nameTh: 'ลาเต้',
    caffeinePerServing: 63,
    servingSize: '240 ml',
    category: 'coffee',
    icon: '☕',
  },
  {
    id: 'drip-coffee',
    name: 'Drip Coffee',
    nameTh: 'กาแฟดริป',
    caffeinePerServing: 95,
    servingSize: '240 ml',
    category: 'coffee',
    icon: '☕',
  },
  {
    id: 'instant-coffee',
    name: 'Instant Coffee',
    nameTh: 'กาแฟสำเร็จรูป',
    caffeinePerServing: 63,
    servingSize: '240 ml',
    category: 'coffee',
    icon: '☕',
  },

  // 🍵 ชา
  {
    id: 'green-tea',
    name: 'Green Tea',
    nameTh: 'ชาเขียว',
    caffeinePerServing: 28,
    servingSize: '240 ml',
    category: 'tea',
    icon: '🍵',
  },
  {
    id: 'matcha',
    name: 'Matcha',
    nameTh: 'มัทฉะ',
    caffeinePerServing: 70,
    servingSize: '240 ml',
    category: 'tea',
    icon: '🍵',
  },
  {
    id: 'oolong-tea',
    name: 'Oolong Tea',
    nameTh: 'ชาอู่หลง',
    caffeinePerServing: 37,
    servingSize: '240 ml',
    category: 'tea',
    icon: '🍵',
  },
  {
    id: 'black-tea',
    name: 'Black Tea',
    nameTh: 'ชาดำ',
    caffeinePerServing: 47,
    servingSize: '240 ml',
    category: 'tea',
    icon: '🍵',
  },
  {
    id: 'thai-milk-tea',
    name: 'Thai Milk Tea',
    nameTh: 'ชาไทย',
    caffeinePerServing: 47,
    servingSize: '300 ml',
    category: 'tea',
    icon: '🧋',
  },
  {
    id: 'jasmine-tea',
    name: 'Jasmine Tea',
    nameTh: 'ชามะลิ',
    caffeinePerServing: 25,
    servingSize: '240 ml',
    category: 'tea',
    icon: '🌸',
  },
  {
    id: 'herbal-tea',
    name: 'Herbal Tea',
    nameTh: 'ชาสมุนไพร',
    caffeinePerServing: 0,
    servingSize: '240 ml',
    category: 'tea',
    icon: '🌿',
  },

  // ⚡ เครื่องดื่มพลังงาน
  {
    id: 'red-bull',
    name: 'Red Bull',
    nameTh: 'เรดบูลล์',
    caffeinePerServing: 80,
    servingSize: '250 ml',
    category: 'energy',
    icon: '⚡',
  },
  {
    id: 'monster',
    name: 'Monster Energy',
    nameTh: 'มอนสเตอร์',
    caffeinePerServing: 160,
    servingSize: '473 ml',
    category: 'energy',
    icon: '⚡',
  },
  {
    id: 'carabao',
    name: 'Carabao',
    nameTh: 'คาราบาว',
    caffeinePerServing: 50,
    servingSize: '180 ml',
    category: 'energy',
    icon: '⚡',
  },
  {
    id: 'lipovitan-d',
    name: 'Lipovitan-D',
    nameTh: 'ลิโพวิตัน-ดี',
    caffeinePerServing: 50,
    servingSize: '150 ml',
    category: 'energy',
    icon: '⚡',
  },

  // 🥤 อื่นๆ
  {
    id: 'cola',
    name: 'Cola',
    nameTh: 'โค้ก',
    caffeinePerServing: 32,
    servingSize: '330 ml',
    category: 'other',
    icon: '🥤',
  },
  {
    id: 'pepsi',
    name: 'Pepsi',
    nameTh: 'เปปsi',
    caffeinePerServing: 32,
    servingSize: '330 ml',
    category: 'other',
    icon: '🥤',
  },
  {
    id: 'hot-chocolate',
    name: 'Hot Chocolate',
    nameTh: 'โกโก่ร้อน',
    caffeinePerServing: 9,
    servingSize: '240 ml',
    category: 'other',
    icon: '🍫',
  },
];

// ข้อมูลหมวดหมู่
export const categories = [
  { id: 'coffee', name: 'Coffee', nameTh: 'กาแฟ', icon: '☕' },
  { id: 'tea', name: 'Tea', nameTh: 'ชา', icon: '🍵' },
  { id: 'energy', name: 'Energy Drink', nameTh: 'เครื่องดื่มพลังงาน', icon: '⚡' },
  { id: 'other', name: 'Other', nameTh: 'อื่นๆ', icon: '🥤' },
] as const;

// ค่าคงที่สำหรับการคำนวณคาเฟอีน
export const CAFFEINE_CONSTANTS = {
  HALF_LIFE_HOURS: 5, // ครึ่งชีวิตของคาเฟอีน (ชั่วโมง)
  PEAK_TIME_MINUTES: 45, // เวลาที่คาเฟอีนถึงจุดสูงสุด (นาที)
  SAFE_DAILY_LIMIT_MG: 400, // ขีดจำกัดคาเฟอีนต่อวัน (mg)
  SENSITIVE_LIMIT_MG: 100, // ขีดจำกัดสำหรับคนที่ sensitive (mg)
} as const;

// คำนวณระดับคาเฟอีนตามเวลา
export interface CaffeineLevel {
  time: number; // นาทีที่ผ่านไป
  level: number; // ระดับคาเฟอีน (mg)
}

export function calculateCaffeineLevel(
  initialDose: number, // ขนาดคาเฟอีนเริ่มต้น (mg)
  timeMinutes: number, // เวลาที่ผ่านไป (นาที)
): number {
  const { HALF_LIFE_HOURS, PEAK_TIME_MINUTES } = CAFFEINE_CONSTANTS;
  
  // คำนวณการดูดซึมและ peak
  let absorptionFactor: number;
  if (timeMinutes <= PEAK_TIME_MINUTES) {
    // ช่วงดูดซึม - คาเฟอีนเพิ่มขึ้น
    absorptionFactor = Math.pow(timeMinutes / PEAK_TIME_MINUTES, 0.8);
  } else {
    // หลัง peak - เริ่มลดลง
    absorptionFactor = 1;
  }
  
  // คำนวณการกำจัด (half-life decay)
  const timeHours = timeMinutes / 60;
  const eliminationFactor = Math.pow(0.5, timeHours / HALF_LIFE_HOURS);
  
  return initialDose * absorptionFactor * eliminationFactor;
}

// สร้างข้อมูลกราฟคาเฟอีน
export function generateCaffeineGraphData(initialDose: number, durationHours: number = 12): CaffeineLevel[] {
  const data: CaffeineLevel[] = [];
  const totalMinutes = durationHours * 60;
  const interval = 15; // ทุก 15 นาที
  
  for (let minutes = 0; minutes <= totalMinutes; minutes += interval) {
    data.push({
      time: minutes,
      level: calculateCaffeineLevel(initialDose, minutes),
    });
  }
  
  return data;
}

// หาเวลาที่คาเฟอีนหมดฤทธิ์ (< 10mg)
export function getTimeToClear(initialDose: number): { hours: number; minutes: number } {
  const threshold = 10; // mg
  
  for (let hours = 1; hours <= 24; hours++) {
    const level = calculateCaffeineLevel(initialDose, hours * 60);
    if (level < threshold) {
      return { hours, minutes: 0 };
    }
  }
  
  return { hours: 24, minutes: 0 };
}

// หาเวลาที่คาเฟอีนถึงจุดสูงสุด
export function getPeakTime(): { hours: number; minutes: number } {
  const { PEAK_TIME_MINUTES } = CAFFEINE_CONSTANTS;
  return {
    hours: Math.floor(PEAK_TIME_MINUTES / 60),
    minutes: PEAK_TIME_MINUTES % 60,
  };
}
