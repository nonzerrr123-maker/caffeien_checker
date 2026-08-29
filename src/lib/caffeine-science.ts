// ข้อมูลทางวิทยาศาสตร์เกี่ยวกับคาเฟอีน

// ระดับคาเฟอีนในเลือด
export interface BloodCaffeineLevel {
  level: number // mg/L
  category: string
  effects: string[]
  color: string
  icon: string
}

export const BLOOD_CAFFEINE_LEVELS: BloodCaffeineLevel[] = [
  {
    level: 0,
    category: "ไม่มี / หมดฤทธิ์",
    effects: ["ไม่มีผลจากคาเฟอีน", "ร่างกายกลับสู่สภาพปกติ"],
    color: "emerald",
    icon: "😴"
  },
  {
    level: 1,
    category: "ต่ำ (1-3 mg/L)",
    effects: [
      "รู้สึกตื่นตัวเล็กน้อย",
      "อารมณ์ดีขึ้น",
      "เพิ่มความสมาธิเล็กน้อย"
    ],
    color: "green",
    icon: "🙂"
  },
  {
    level: 3,
    category: "ปานกลาง (3-6 mg/L)",
    effects: [
      "ตื่นตัวชัดเจน",
      "เพิ่มความสามารถในการทำงาน",
      "ลดอาการเมื่อยล้า",
      "เพิ่ดอัตราการเต้นของหัวใจเล็กน้อย (5-10 bpm)"
    ],
    color: "yellow",
    icon: "⚡"
  },
  {
    level: 6,
    category: "สูง (6-12 mg/L)",
    effects: [
      "กระตุ้นประสาทมาก",
      "สมาธิดี / โฟกัสสูง",
      "อาจรู้สึกกระวนกระวาย",
      "เพิ่มอัตราการเต้นหัวใจ (10-20 bpm)",
      "เพิ่ดความดันโลหิตเล็กน้อย",
      "ปัสสาวะบ่อย"
    ],
    color: "orange",
    icon: "🔥"
  },
  {
    level: 12,
    category: "สูงมาก (12-20 mg/L)",
    effects: [
      "กระตุ้นประสาทรุนแรง",
      "ใจสั่น / หัวใจเต้นเร็ว",
      "กระวนกระวายมาก",
      "มือสั่น",
      "ปวดศีรษะ",
      "อาจเกิด acid reflux",
      "นอนไม่หลับ"
    ],
    color: "red",
    icon: "⚠️"
  },
  {
    level: 20,
    category: "อันตราย (>20 mg/L) - Toxic Range",
    effects: [
      "หัวใจเต้นผิดจังหวะได้",
      "ชัก (seizures) ในคน sensitive",
      "คลื่นไส้ / อาเจียน",
      "สับสน / วิงเวียนศีรษะ",
      "อาจเป็นอันตรายถึงชีวิต (LD50 ~150-200mg/kg)",
      "ต้องรับการรักษาทางการแพทย์"
    ],
    color: "purple",
    icon: "☠️"
  }
]

// ผลกระทบตามระบบอวัยวะภาค
export interface SystemEffect {
  system: string
  icon: string
  positiveEffects: string[]
  negativeEffects: string[]
  timing: string
  scientificNote: string
}

export const SYSTEM_EFFECTS: SystemEffect[] = [
  {
    system: "สมอง & ระบบประสาท",
    icon: "🧠",
    positiveEffects: [
      "กระตุ้นสาร Adenosine → ตื่นตัว",
      "เพิ่ด Dopamine → อารมณ์ดี",
      "เพิ่ด Norepinephrine → โฟกัสดีขึ้น",
      "ป้องกัน Alzheimer's ได้บางส่วน",
      "ลดความเสี่ยง Parkinson's 20-30%"
    ],
    negativeEffects: [
      "ดื่มมาก → วิตก / กระวนกระวาย",
      "ขาด → อาการขาด (withdrawal): ปวดศีรษะ, เซ็ง, เหนื่อยล้า",
      "เสพติด (mild addiction) - ทางกายภาพ",
      "อาจทำให้นอนไม่หลับ",
      "เสี่ยง Panic Attack ในคนมีปัญหา"
    ],
    timing: "30-60 นาที: เริ่มผล | 3-5 ชม.: Peak | 5-6 ชม.: Half-life",
    scientificNote: "คาเฟอีน block receptor ของ adenosine (สารทำให้ง่วง) → สมอง 'คิดว่า' ไม่เหนื่อย"
  },
  {
    system: "หัวใจ & หลอดเลือด",
    icon: "❤️",
    positiveEffects: [
      "เพิ่ดอัตราการเต้นหัวใจ 10-15% (ปกติ)",
      "เพิ่ดการไหลเวียนเลือด",
      "ลดความเสี่ยง Heart Failure บางกรณี",
      "Vasodilation ในกล้ามเนื้อหัวใจ"
    ],
    negativeEffects: [
      "เกิน 400mg/วัน → เสี่ยง Arrhythmia",
      "ความดันสูงขึ้นชั่วคราว (5-10 mmHg)",
      "Palpitations (ใจสั่น) ในคน sensitive",
      "เสี่ยงสูงขึ้นถ้า + แอลกอฮอล",
      "ควรหลีกเลี่ยงถ้ามีโรคหัวใจ"
    ],
    timing: "15-30 นาที: เริ่มผล | 1-2 ชม.: Max effect",
    scientificNote: "คาเฟอีนเป็น stimulant ของระบบ sympathetic nervous system → เพิ่ด catecholamines"
  },
  {
    system: "กระเพาะอาหาร & ทางเดินอาหาร",
    icon: "🫃",
    positiveEffects: [
      "กระตุ้นการย่อยอาหาร",
      "ลดความเสี่ยง Gallstones 25%",
      "ช่วยขับถ่าย (laxative effect)",
      "ลดความเสี่ยง NAFLD (ตับมัน) บางส่วน"
    ],
    negativeEffects: [
      "กระตุ้นกรดในกระเพาะ → Acid Reflux / GERD",
      "ทำให้ IBS แย่ลง (diarrhea/cramps)",
      "อาจทำให้ปวดท้อง / ท้องอืด",
      "ไม่ควรดื่มเปล่าท้องว่าง",
      "เสี่ยง Gastric Ulcer ถ้าดื่มบ่อย"
    ],
    timing: "ทันที: กระตุ้นกรด | 30-60 นาที: ขับถ่าย",
    scientificNote: "คาเฟอีน stimulate Gastric Acid secretion + relaxes LES (Lower Esophageal Sphincter)"
  },
  {
    system: "ไต & ระบบขับถ่าย",
    icon: "💧",
    positiveEffects: [
      "Diuretic effect → ขับน้ำ / ลดบวม",
      "ช่วย prevent Kidney Stones บางชนิด",
      "ลดความเสี่ยง Kidney Disease บางงานวิจัย"
    ],
    negativeEffects: [
      "ขับน้ำมาก → ขาดน้ำ (Dehydration)",
      "ทำให้ปัสสาวะบ่อย / จำเป็น",
      "สูญเสีย electrolytes (Na+, K+)",
      "ไม่ควรดื่มก่อนออกกำลังกายหนัก",
      "อาจทำให้ปัสสาวะกลัด"
    ],
    timing: "30-90 นาที: Diuretic effect เริ่ม",
    scientificNote: "คาเฟอีน inhibit ADH (Antidiuretic Hormone) → ไต reabsorb น้ำน้อยลง"
  },
  {
    system: "กล้ามเนื้อ & การออกกำลังกาย",
    icon: "💪",
    positiveEffects: [
      "เพิ่ด Endurance / ความอดทน",
      "ลดความรู้สึกเหนื่อย (RPE ↓)",
      "เพิ่ด Fat Oxidation (เผาผลาญไขมัน)",
      "ประสิทธิภาพ↑ 2-5% ใน endurance sports",
      "ช่วย Recovery บางกรณี"
    ],
    negativeEffects: [
      "เกิน 9mg/kg → Banned in Olympics!",
      "อาจทำให้ Tremor (มือสั่น) → affect precision sports",
      "Dehydration risk during exercise",
      "Insomnia ถ้าดื่มใกล้เวลาฝึก",
      "Tolerance build up ถ้าดื่มทุกวัน"
    ],
    timing: "30-60 นาที: Performance boost | 3-4 ชม.: Effect fades",
    scientificNote: "Mechanism: ↑ Calcium release in muscle + ↑ Epinephrine + ↓ Perception of effort"
  },
  {
    system: "เมตาบอลิซึม & น้ำหนัก",
    icon: "⚖️",
    positiveEffects: [
      "เพิ่ด Metabolic Rate 3-11%",
      "เผาผลาญไขมัน ↑ 10-29%",
      "Thermogenic effect (~100 cal/day)",
      "ช่วยลดน้ำหนักระยะสั้น (water weight)",
      "Appetite suppressant เล็กน้อย"
    ],
    negativeEffects: [
      "Tolerance develops fast → effect ลดลง",
      "อาจเพิ่ด Cortisol (stress hormone)",
      "Blood sugar spike ในบางคน",
      "Crash หลัง effect หมด → โหลดขึ้น",
      "ไม่ใช่ magic bullet สำหรับลดน้ำหนัก"
    ],
    timing: "1-3 ชม.: Metabolic peak | 4-6 ชม.: Return to baseline",
    scientificNote: "Stimulates Thermogenesis via β3-adrenergic receptors + increases lipolysis"
  },
  {
    system: "การนอน & ระบบ Circadian",
    icon: "😴",
    positiveEffects: [
      "- (ไม่มี positive ต่อการนอนโดยตรง)",
      "อาจช่วย counteract jet lag บางกรณี"
    ],
    negativeEffects: [
      "ลด Deep Sleep (Stage 3&4) ถ้ายังมีในร่างกาย",
      "เพิ่ด Sleep Latency (นานขึ้นก่อนหลับ)",
      "ลด Total Sleep Time ถ้าดื่ม <6 ชม.ก่อนนอน",
      "ทำให้ Sleep Quality แย่ลง (fragmented)",
      "Half-life 5-6 ชม. → 200mg เที่ยง = ~100mg เวลานอน!"
    ],
    timing: "Effect lasts 8-14 ชม. (individual variation)",
    scientificNote: "Block Adenosine buildup → body can't signal sleep need properly → circadian disruption"
  }
]

// ข้อมูล Withdrawal Symptoms
export interface WithdrawalSymptom {
  symptom: string
  severity: "mild" | "moderate" | "severe"
  timing: string
  duration: string
  relief: string
}

export const WITHDRAWAL_SYMPTOMS: WithdrawalSymptom[] = [
  { symptom: "ปวดศีรษะ (Headache)", severity: "moderate", timing: "12-24 ชม.หลังขาด", duration: "2-9 วัน", relief: "ดื่มน้ำมาก, พัก, painkiller อ่อนๆ" },
  { symptom: "เหนื่อยล้า / Exhaustion", severity: "moderate", timing: "18-24 ชม.", duration: "2-7 วัน", relief: "พักผ่อนเพียงพอ, ออกกำลังกายเบาๆ" },
  { symptom: "เซ็ง / Irritability", severity: "mild", timing: "12-24 ชม.", duration: "2-9 วัน", relief: " mindfulness, หลีกเลี่ยง stress" },
  { symptom: "ซึม / Depression-like", severity: "moderate", timing: "2-5 วัน", duration: "2-7 วัน", relief: "exercise, sunlight, social support" },
  { symptom: "เซ็ง / Difficulty Concentrating", severity: "mild", timing: "12-24 ชม.", duration: "2-4 วัน", relief: "break tasks into small chunks" },
  { symptom: "ความจำลดลง / Brain Fog", severity: "mild", timing: "1-2 วัน", duration: "3-7 วัน", relief: "sleep well, stay hydrated" },
  { symptom: " Flu-like symptoms", severity: "moderate", timing: "1-3 วัน", duration: "2-4 วัน", relief: "rest, fluids, OTC meds" },
  { symptom: "ปวดกล้ามเนื้อ / Muscle Pain", severity: "mild", timing: "1-3 วัน", duration: "2-5 วัน", relief: "light stretching, warm bath" }
]

// ข้อมูล Tolerance
export interface ToleranceInfo {
  dailyIntake: number; // mg
  toleranceLevel: "none" | "low" | "moderate" | "high" | "critical";
  description: string;
  effects: string[];
  recommendation: string;
  resetTime: string;
}

export const TOLERANCE_LEVELS: ToleranceInfo[] = [
  {
    dailyIntake: 0,
    toleranceLevel: "none",
    description: "ไม่ดื่มคาเฟอีน / ดื่มน้อยมาก (<25mg/วัน)",
    effects: ["Sensitive ต่อคาเฟอีนมาก", "25mg ก็รู้สึกตื่นตัว", "Effect ชัดเจนและยาวนาน"],
    recommendation: "ถ้าเริ่มดื่ม เริ่มจากน้อยๆ (50mg) เพื่อ avoid shock",
    resetTime: "N/A - ไม่มี tolerance"
  },
  {
    dailyIntake: 100,
    toleranceLevel: "low",
    description: "ดื่มเล็กน้อย (25-100mg/วัน)",
    effects: ["รู้สึก effect ชัดเจน", "Tolerance เริ่มต้นเล็กน้อย", "ยัง sensitive พอสมครร"],
    recommendation: "พยายาม fix ปริมาณ ไม่เพิ่มขึ้น",
    resetTime: "1-2 สัปดาห์หยุดดื่ม → tolerance ลดลง"
  },
  {
    dailyIntake: 250,
    toleranceLevel: "moderate",
    description: "ดื่มปานกลาง (100-300mg/วัน)",
    effects: ["ต้องการมากขึ้นเพื่อ effect เดิม", "Withdrawal เริ่มรู้สึกถ้าขาด", "Sleep quality อาจลดลง"],
    recommendation: "พิจารณา caffeine break สัปดาห์ละ 1-2 วัน",
    resetTime: "1-2 สัปดาห์ → tolerance ลดลง 30-50%"
  },
  {
    dailyIntake: 400,
    toleranceLevel: "high",
    description: "ดื่มมาก (300-500mg/วัน) - Daily Limit!",
    effects: ["Tolerance สูง - 200mg อาจไม่รู้สึง", "Withdrawal ชัดเจนถ้าขาด", "Health risks เริ่มสูง", "Sleep แย่มาก"],
    recommendation: "ควร taper down ลง อย่างช้าๆ! ลด 25% ต่อสัปดาห์",
    resetTime: "2-4 สัปดาห์ → tolerance ลดลง 70-80%"
  },
  {
    dailyIntake: 600,
    toleranceLevel: "critical",
    description: "ดื่มมากเกินไป (>500mg/วัน) - DANGEROUS!",
    effects: ["Severe tolerance - ไม่รู้สึก effect", "Severe withdrawal symptoms", "Health risks สูงมาก", "Anxiety, Insomnia, Heart issues"],
    recommendation: "⚠️ ควรปรึกษาแพทย์! Taper อย่างช้าๆ ภายใน 4-6 สัปดาห์",
    resetTime: "1-2 เดือน → tolerance ลดลง 80-90%"
  }
]

// ข้อมูล Interaction กับสารอื่น
export interface DrugInteraction {
  substance: string
  type: "dangerous" | "caution" | "safe";
  effect: string;
  mechanism: string;
  advice: string;
}

export const DRUG_INTERACTIONS: DrugInteraction[] = [
  {
    substance: "แอลกอฮอล (Alcohol)",
    type: "caution",
    effect: "คาเฟอีน mask ความเมา → ดื่มเกินจริง",
    mechanism: "Caffeine is stimulant, Alcohol is depressant → mixed signals to brain",
    advice: "Avoid mixing. If must, limit caffeine when drinking alcohol."
  },
  {
    substance: "ยา NSAIDs (Ibuprofen, Naproxen)",
    type: "safe",
    effect: "ไม่มี interaction รุนแรง",
    mechanism: "Different metabolic pathways",
    advice: "Safe to take together with water."
  },
  {
    substance: "ยา Antibiotics (Ciprofloxacin, etc.)",
    type: "dangerous",
    effect: "ลดการขับคาเฟอีน → คาเฟอีนสะสม ↑↑",
    mechanism: "Inhibit CYP1A2 enzyme (caffeine metabolism)",
    advice: "ลด/งดคาเฟอีนขณะกินยาปฏิชีบน 询问医生!"
  },
  {
    substance: "ยากันซึม (Antidepressants - SSRI)",
    type: "caution",
    effect: "เพิ่ด risk of Serotonin Syndrome (หายาก)",
    mechanism: "Both affect serotonin/dopamine pathways",
    advice: "Moderate intake only. Monitor for anxiety/jitters."
  },
  {
    substance: "ยา Thyroid (Levothyroxine)",
    type: "dangerous",
    effect: "ลดการ absorb ยา → ยาไม่ work",
    mechanism: "Caffeine binds to thyroid medication in gut",
    advice: "รอ 1 ชม. หลังทานยาก่อนดื่มคาเฟอีน!"
  },
  {
    substance: "ยา Ephedrine/Pseudoephedrine",
    type: "dangerous",
    effect: "Stimulant stacking → หัวใจเต้นเร็วมาก, BP สูง",
    mechanism: "Both are CNS stimulants → additive effects",
    advice: "AVOID combining! Risk of heart attack/stroke."
  },
  {
    substance: "ยานอนหลับ / Sedatives",
    type: "dangerous",
    effect: "Counteract sedation → ยาไม่ work",
    mechanism: "Opposing effects on CNS",
    advice: "Avoid caffeine 6+ hours before bedtime medications."
  },
  {
    substance: "ยาเบาขา (Oral Contraceptives)",
    type: "caution",
    effect: "ลด metabolism คาเฟอีน → effect ยาวนานขึ้น",
    mechanism: "Estrogen inhibits CYP1A2 enzyme",
    advice: "May need to reduce caffeine intake by 25-30%."
  },
  {
    substance: "Supplement: L-Theanine (ในชาเขียว)",
    type: "safe",
    effect: "Smooth out jitters → focus without anxiety",
    mechanism: "L-Theanine increases GABA, counters caffeine stimulation",
    advice: "Great combo! Matcha naturally has both. Ratio 2:1 (L-theanine:Caffeine) ideal."
  },
  {
    substance: "Creatine Supplement",
    type: "safe",
    effect: "No significant interaction",
    mechanism: "Different pathways entirely",
    advice: "Safe to combine. Both popular for athletes."
  }
]

// Fun Facts
export interface CaffeineFact {
  fact: string;
  source?: string;
  category: "science" | "history" | "fun" | "health";
}

export const CAFFEINE_FACTS: CaffeineFact[] = [
  { fact: "คาเฟอีนเป็นสารที่บริโภคมากที่สุดในโลก - ~87% ของคนทั่วโลกดื่มทุกวัน", category: "science" },
  { fact: "คนไทยดื่มกาแฟเฉลี่ย 2.5 แก้ว/วัน (สูงกว่า global average)", category: "fun" },
  { fact: "Dark roast มีคาเฟอีนน้อยกว่า Light roast! (การคั่วทำให้สลาย)", category: "science" },
  { fact: "Decaf ไม่ได้ 'ไม่มี' คาเฟอีน - ยังมี 2-12 mg per cup", category: "science" },
  { fact: "Espresso มีคาเฟอีนต่อ oz สูงกว่า Drip coffee แต่ total น้อยกว่า (ขนาดเล็กกว่า)", category: "science" },
  { fact: "คาเฟอีนเริ่มใช้ครั้งแรก ~2737 BC ใน Ethiopia (legend of Kaldi)", category: "history" },
  { fact: "Finland ดื่มกาแฟเยอะที่สุดในโลก - 12kg/person/year!", category: "fun" },
  { fact: "คาเฟอีนอยู่ใน Guayusa, Yerba Mate, Guarana ด้วย (ไม่ใช่แค่กาแฟ/ชา)", category: "science" },
  { fact: "พื้นที่ปลูกกาแฟิน้อยลงเรื่อยๆ เนื่องจาก Climate Change - ราคาอาจขึ้น", category: "health" },
  { fact: "Caffeine's LD50 (lethal dose) ≈ 150-200 mg/kg - ต้องดื่ม ~100 cups ในครั้งเดียว!", category: "science" },
  { fact: "Queen Christina of Sweden เคยสาบาน caffeine ในศตวรรษที่ 17", category: "history" },
  { fact: "คาเฟอีนช่วยพักผ่อน muscles หลัง workout 40%", category: "health" },
  { fact: "Coffee อาจ reduce risk of Type 2 Diabetes ถึง 25-30%", category: "health" },
  { fact: "ช่วง 1700s Europe มี 'Coffee Houses' เป็น hub ของ intellectual discussion", category: "history" },
  { fact: "Instant coffee ถูกประดิษฐ์ใน 1901 โดย Satori Kato (Japanese scientist)", category: "history" }
]

// Helper functions
export function getBloodLevelCategory(mgPerLiter: number): BloodCaffeineLevel {
  if (mgPerLiter <= 0) return BLOOD_CAFFEINE_LEVELS[0]
  if (mgPerLiter < 3) return BLOOD_CAFFEINE_LEVELS[1]
  if (mgPerLiter < 6) return BLOOD_CAFFEINE_LEVELS[2]
  if (mgPerLiter < 12) return BLOOD_CAFFEINE_LEVELS[3]
  if (mgPerLiter < 20) return BLOOD_CAFFEINE_LEVELS[4]
  return BLOOD_CAFFEINE_LEVELS[5]
}

export function estimateBloodLevel(totalCaffeineMg: number, bodyWeightKg: number = 65): number {
  // Rough estimation: Vd of caffeine ~0.5-0.7 L/kg
  // Assuming average distribution and peak concentration
  const volumeOfDistribution = bodyWeightKg * 0.6 // liters
  return totalCaffeineMg / volumeOfDistribution // mg/L
}
