"use client"

import * as React from "react"
import { useCaffeineStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  Brain,
  Heart,
  Baby,
  Droplets,
  Dumbbell,
  Scale,
  Moon,
  Activity,
  Zap,
  Coffee,
  Shield,
  Clock,
  Target,
  TrendingUp,
  Lightbulb,
  Skull,
  Gauge,
  Sparkles,
  Thermometer,
  Star,
} from "lucide-react"

// Caffeine Level Data with thresholds
const CAFFEINE_LEVELS = [
  {
    level: "none",
    icon: "😴",
    label: "ไม่ได้รับ",
    range: [0, 0],
    color: "emerald",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    textColor: "text-emerald-700 dark:text-emerald-300",
    borderColor: "border-emerald-200/50 dark:border-emerald-800/30",
    effects: ["ร่างกายพักผ่อนตามธรรมชาติ", "ไม่มีผลกระทบจากคาเฟอีน"],
    tip: "สมดุลสมบูรณ์ 💚"
  },
  {
    level: "low",
    icon: "🌤️",
    label: "ต่ำ (Light)",
    range: [1, 50],
    color: "green",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    textColor: "text-green-700 dark:text-green-300",
    borderColor: "border-green-200/50 dark:border-green-800/30",
    effects: [
      "รู้สึกตื่นขึ้นเล็กน้อย",
      "มีสมาธิดีขึ้น",
      "อารมณ์ดีขึ้น",
      "ไม่มีผลข้างเคียง",
    ],
    tip: "ระดับที่ดีเยี่ยม ✨"
  },
  {
    level: "moderate",
    icon: "☀️",
    label: "ปานกลาง (Moderate)",
    range: [51, 200],
    color: "yellow",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    textColor: "text-yellow-700 dark:text-yellow-300",
    borderColor: "border-yellow-200/50 dark:border-yellow-800/30",
    effects: [
      "ตื่นตัวชัดเจน",
      "สมาธิดี / ทำงานได้ดีขึ้น",
      "เพิ่มพละกำลังในการออกกำลังกาย",
      "เผาผลาญพลังงานเพิ่ม",
      "⚠️ อาจรู้สึกกระชับเล็กน้อย",
    ],
    tip: "ใช้ประโยชน์ได้เต็มที่ ☀️"
  },
  {
    level: "high",
    icon: "⚡",
    label: "สูง (High)",
    range: [201, 400],
    color: "orange",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    textColor: "text-orange-700 dark:text-orange-300",
    borderColor: "border-orange-200/50 dark:border-orange-800/30",
    effects: [
      "ตื่นตัวมาก / กระตุ้น",
      "อาจรู้สึก ใจสั่น เหนื่อย",
      "โอกาสนอนไม่หลับ",
      "กรดในกระเพาะอาหารเพิ่ม",
      "⚠️ ใกล้ขีดจำกัดวันแล้ว",
    ],
    tip: "ระวังอาการผิดปกติ ⚡"
  },
  {
    level: "danger",
    icon: "🚨",
    label: "อันตราย (Danger)",
    range: [401, Infinity],
    color: "red",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    textColor: "text-red-700 dark:text-red-300",
    borderColor: "border-red-200/50 dark:border-red-800/30",
    effects: [
      "❌ ใจสั่นเร็ว/ผิดจังหวะ",
      "❌ วิงเวียนศีรษะ คลื่นไส้",
      "❌ วิตก/กังวล/ตื่นเต้น",
      "❌ นอนไม่หลับเลย",
      "❌ กระเพาะอักเสบ",
      "🚨 เกินขีดจำกัดปลอดภัย!",
    ],
    tip: "หยุดดื่มทันที! 🚨"
  },
]

// System Effects Data
const SYSTEM_EFFECTS = [
  {
    id: "brain",
    name: "สมอง & ระบบประสาท",
    icon: <Brain className="h-5 w-5" />,
    emoji: "🧠",
    timing: "30-60 นาที หลังดื่ม",
    threshold: 50, // mg - start showing significant effects
    positive: [
      "บล็อก Adenosine → รู้สึกตื่น",
      "เพิ่ม Dopamine/Norepinephrine → อารมณ์ดี",
      "เพิ่มสมาธิและการทำงานของสมอง",
      "ลดความเสี่ยงโรค Parkinson/Alzheimer",
      "ช่วยป้องกันภาวะสมองเสื่อม",
    ],
    negative: [
      "ดื่มมาก → วิตก กังวล ตื่นเต้น",
      "ขาด → ปวดหัว รู้สึกอ่อนเพลีย",
      "นอนไม่หลับ → สมองไม่ได้พัก",
      "เสพติด → ต้องดื่มเพื่อการทำงานปกติ",
    ],
    science: "คาเฟอีนเป็น Antagonist ของ Adenosine Receptor ทำให้ไม่รู้สึกเหนื่อย และกระตุ้นระบบ Sympathetic Nervous System",
  },
  {
    id: "heart",
    name: "หัวใจ & ระบบไหลเลือด",
    icon: <Heart className="h-5 w-5" />,
    emoji: "❤️",
    timing: "15-45 นาที หลังดื่ม",
    threshold: 100,
    positive: [
      "เพิ่ม Heart Rate เล็กน้อย (ปกติ)",
      "ขยายหลอดเลือด → ทำงานได้ดีขึ้น",
      "ลดความเสี่ยงหัวใจล้มเหลว (ถ้าดื่มพอดี)",
      "ป้องกันโรคหลอดเลือดสมอง",
    ],
    negative: [
      "ดื่มมาก → หัวใจเต้นเร็ว/ผิดจังหวะ",
      "ความดันโลหิตสูงขึ้น",
      "อาจอันตรายถ้ามีโรคหัวใจอยู่แล้ว",
      "ใช้เวลา + Energy Drink = อันตรายมาก",
    ],
    science: "คาเฟอีนกระตุ้น Adrenaline Release → เพิ่ม Cardiac Output และ Blood Pressure ชั่วคราว",
  },
  {
    id: "metabolism",
    name: "เมแทบอลิซึม & น้ำหนัก",
    icon: <Scale className="h-5 w-5" />,
    emoji: "⚖️",
    timing: "1-3 ชั่วโมง หลังดื่ม",
    threshold: 75,
    positive: [
      "เพิ่ม Metabolic Rate 3-11%",
      "เผาผลาญไขมันเพิ่ม 10-29%",
      "ปรับปรุง Performance ในการออกกำลังกาย",
      "ลดความเสี่ยง Diabetes Type 2",
      "ช่วยควบคุมน้ำหนักระยะยาว",
    ],
    negative: [
      "ผลลดพุ่ง → ร่างกาย adapt ได้",
      "ดื่มกับนม/ของหวาน → แคลอรี่สูง",
      "อาจทำให้หิวน้อยเกินไป",
      "ถ้าดื่มตอนบ่าย → รบกวนการนอน → น้ำหนักขึ้น",
    ],
    science: "คาเฟอีนกระตุ้น Thermogenesis และ Lipolysis ผ่านการกระตุ้น Nervous System และ Epinephrine",
  },
  {
    id: "sleep",
    name: "การนอน & รอบ circadian",
    icon: <Moon className="h-5 w-5" />,
    emoji: "😴",
    timing: "6+ ชั่วโมง หลังดื่ม (Half-life)",
    threshold: 25, // Very sensitive to sleep
    positive: [
      "ตื่นเร็วขึ้น (ถ้าดื่มเช้า)",
      "ช่วย Combat Jet Lag (ถ้าใช้ถูกวิธี)",
      "Power Nap สั้นๆ มีประสิทธิภาพขึ้น",
    ],
    negative: [
      "❌ ทำลาย Deep Sleep และ REM Sleep",
      "❌ นอนไม่หลับ / หลับตืด",
      "❌ คุณภาพการนอนลดลงแม้หลับได้",
      "❌ รบกวน Melatonin Production",
      "Half-life 5-6 ชม. → ดื่มบ่าย = นอนไม่แผ่น",
    ],
    science: "คาเฟอีนแข่งขันกับ Adenosine ที่สะสมตลอดวัน ทำให้ Sleep Pressure ไม่เกิดขึ้น และลด Slow Wave Sleep",
  },
  {
    id: "digestive",
    name: "ระบบย่อยอาหาร",
    icon: <Droplets className="h-5 w-5" />,
    emoji: "💧",
    timing: "เริ่ม 10-30 นาที หลังดื่ม",
    threshold: 60,
    positive: [
      "กระตุ้นการขับถ่าย (Laxative Effect)",
      "ช่วย Liver Function บางอย่าง",
      "ลดความเสี่ยงตับอ่อน",
      "Gallstone Prevention",
    ],
    negative: [
      "กรดในกระเพาะเพิ่ม → Reflux/GERD",
      "อาจทำให้ถ่ายเหลวงเกินไป",
      "ดื่มว่างท้อง → กระตุ้กกรดมาก",
      "รบกวนการดูดซึม Iron/Calcium",
    ],
    science: "คาเฟอีนกระตุ้น Gastric Acid Secretion ผ่าน Gastrin Release และ relax Lower Esophageal Sphincter",
  },
  {
    id: "exercise",
    name: "การออกกำลังกาย & กล้ามเนื้อ",
    icon: <Dumbbell className="h-5 w-5" />,
    emoji: "💪",
    timing: "30-60 นาที ก่อน/ระหว่างออกกำลังกาย",
    threshold: 80,
    positive: [
      "เพิ่ม Endurance 11-12%",
      "ลดความรู้สึกเหนื่อย (RPE)",
      "เพิ่ม Fat Burning ระหว่างออกกำลังกาย",
      "เพิ่ม Power Output",
      "เร่ง Recovery เล็กน้อย",
    ],
    negative: [
      "ดื่มมาก → ใจสั่นเร็วเกินไป",
      "Dehydration Risk เพิ่ม",
      "อาจ Cramp ถ้าขาดน้ำ",
      "Tolerance เกิดเร็วในนักกีฬา",
    ],
    science: "คาเฟอีนกระตุ้น Calcium Release ในกล้ามเนื้อ → แรงหดเต้นแรงขึ้น และลดความรู้สึกเจ็บปวด",
  },
]

// Safe Guidelines
const SAFE_GUIDELINES = [
  {
    group: "ผู้ใหญ่ปกติ",
    limit: "≤400 mg/วัน",
    color: "emerald",
    tips: [
      "ไม่เกิน 3-4 ถ้วยกาแฟ/วัน",
      "หยุดดื่มก่อน 18:00 น.",
      "ไม่ดื่มเร็วกว่า 1 ถ้วย/ชม.",
    ],
  },
  {
    group: "คนไวต่อคาเฟอีน",
    limit: "≤100 mg/วัน",
    color: "amber",
    tips: [
      "1 ถ้วยเล็ก หรือน้อยกว่า",
      "หยุดดื่มก่อน 14:00 น.",
      "สังเกตอาการ หากมีให้หยุดทันที",
    ],
  },
  {
    group: "คนตั้งครรภ์/ให้นมบุตร",
    limit: "≤200 mg/วัน",
    color: "pink",
    tips: [
      "≈1-2 ถ้วยกาแฟ/วัน",
      "ส่งผลผ่านนมแม่ได้",
      "ปรึกษาแพทย์ก่อน",
    ],
  },
  {
    group: "เด็ก & วัยรุ่น",
    limit: "≤100 mg/วัน",
    color: "blue",
    tips: [
      "หลีกเลี่ยง Energy Drink",
      "ไม่ควรดื่มเลย ถ้าอายุ < 12 ปี",
      "จำกัด Soda ที่มีคาเฟอีน",
    ],
  },
]

export function HealthEffects() {
  const [expandedSystem, setExpandedSystem] = React.useState<string | null>(null)
  const [showAllLevels, setShowAllLevels] = React.useState(false)
  
  // Get current caffeine level from store
  const getCurrentCaffeineLevel = useCaffeineStore((state) => state.getCurrentCaffeineLevel)
  const currentCaffeine = React.useMemo(() => getCurrentCaffeineLevel(), [getCurrentCaffeineLevel])
  
  // Determine current level based on caffeine amount
  const getCurrentLevel = () => {
    for (const level of CAFFEINE_LEVELS) {
      if (currentCaffeine >= level.range[0] && currentCaffeine <= level.range[1]) {
        return level
      }
    }
    return CAFFEINE_LEVELS[0]
  }
  
  const currentLevel = getCurrentLevel()
  
  // Calculate percentage to next level or within current
  const getProgressToNextLevel = () => {
    const currentIndex = CAFFEINE_LEVELS.findIndex(l => l.level === currentLevel.level)
    if (currentIndex >= CAFFEINE_LEVELS.length - 1) return 100
    
    const nextLevel = CAFFEINE_LEVELS[currentIndex + 1]
    const rangeSize = nextLevel.range[0] - currentLevel.range[0]
    const progress = ((currentCaffeine - currentLevel.range[0]) / rangeSize) * 100
    
    return Math.min(Math.max(progress, 0), 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Activity className="h-6 w-6 text-warm-500" />
          ผลกระทบของคาเฟอีน
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          เข้าใจสิ่งที่เกิดขึ้นกับร่างกายของคุณ
        </p>
      </div>

      {/* Current Caffeine Status Card - Dynamic! */}
      <Card className={`warm-card overflow-hidden border-2 ${currentLevel.borderColor} ${currentLevel.bgColor}`}>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-2xl ${currentLevel.bgColor} flex items-center justify-center flex-shrink-0 border-2 ${currentLevel.borderColor}`}>
              <span className="text-3xl animate-pulse">{currentLevel.icon}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h2 className={`font-bold text-lg ${currentLevel.textColor}`}>
                  ระดับปัจจุบัน: {currentLevel.label}
                </h2>
                <Badge 
                  variant="secondary" 
                  className={`font-mono font-bold ${currentLevel.bgColor} ${currentLevel.textColor}`}
                >
                  <Gauge className="h-3 w-3 mr-1" />
                  {Math.round(currentCaffeine)} mg
                </Badge>
              </div>
              
              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-muted-foreground">ความเข้มข้น</span>
                  <span className={`text-xs font-medium ${currentLevel.textColor}`}>
                    {getProgressToNextLevel().toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      currentLevel.level === 'danger' ? 'bg-red-500' :
                      currentLevel.level === 'high' ? 'bg-orange-500' :
                      currentLevel.level === 'moderate' ? 'bg-yellow-500' :
                      currentLevel.level === 'low' ? 'bg-green-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${getProgressToNextLevel()}%` }}
                  />
                </div>
              </div>
              
              <p className={`text-sm font-medium ${currentLevel.textColor}`}>
                💡 {currentLevel.tip}
              </p>
            </div>
          </div>

          {/* Current Effects Preview */}
          <div className="mt-4 pt-4 border-t border-border/20">
            <p className="text-xs font-medium text-muted-foreground mb-2">ผลกระทบที่คุณกำลังได้รับ:</p>
            <ul className="space-y-1">
              {currentLevel.effects.slice(0, 3).map((effect, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <span className={
                    effect.startsWith("❌") || effect.startsWith("⚠️") 
                      ? "text-orange-500 mt-0.5" 
                      : "text-emerald-500 mt-0.5"
                  }>
                    •
                  </span>
                  <span className={currentLevel.textColor}>
                    {effect.replace(/^[❌⚠️]\s*/, "")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* What is Caffeine Section */}
      <Card className="warm-card overflow-hidden border-0 bg-gradient-to-br from-warm-50 to-warm-100 dark:from-warm-900/20 dark:to-warm-800/20">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-warm-200/60 dark:bg-warm-700/40 flex items-center justify-center flex-shrink-0">
              <Coffee className="h-7 w-7 text-warm-500" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg text-foreground mb-2">คาเฟอีน คืออะไร?</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                คาเฟอีน (<strong>Caffeine</strong> / <em>C8H10N4O2</em>) เป็นสารประกอบอินทรีย์ชนิดหนึ่งที่จัดอยู่ในกลุ่ม 
                <strong>Methylxanthine</strong> ทำหน้าที่เป็น<strong>สารกระตุ้นระบบประสาทส่วนกลาง</strong> (CNS Stimulant)
              </p>
              
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="p-2 rounded-lg bg-white/60 dark:bg-black/20 text-xs">
                  <span className="font-medium text-foreground">แหล่งที่พบ:</span>
                  <span className="text-muted-foreground ml-1">กาแฟ, ชา, โกโก้, กูวารานา</span>
                </div>
                <div className="p-2 rounded-lg bg-white/60 dark:bg-black/20 text-xs">
                  <span className="font-medium text-foreground">Half-life:</span>
                  <span className="text-muted-foreground ml-1">~5 ชั่วโมง (ผู้ใหญ่)</span>
                </div>
                <div className="p-2 rounded-lg bg-white/60 dark:bg-black/20 text-xs">
                  <span className="font-medium text-foreground">Peak:</span>
                  <span className="text-muted-foreground ml-1">30-60 นาที หลังดื่ม</span>
                </div>
                <div className="p-2 rounded-lg bg-white/60 dark:bg-black/20 text-xs">
                  <span className="font-medium text-foreground">Bioavailability:</span>
                  <span className="text-muted-foreground ml-1">~99% ดูดซึมได้</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Caffeine Levels Reference */}
      <Card className="warm-card overflow-hidden border-0">
        <CardHeader className="pb-3">
          <Button
            variant="ghost"
            onClick={() => setShowAllLevels(!showAllLevels)}
            className="w-full justify-between h-auto py-2 px-0 hover:bg-transparent"
          >
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Zap className="h-5 w-5 text-warm-500" />
              ระดับคาเฟอีนในร่างกาย
              <Badge variant="secondary" className="ml-2 bg-warm-100 text-warm-600">
                คุณอยู่: {currentLevel.icon}
              </Badge>
            </CardTitle>
            {showAllLevels ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </CardHeader>

        {showAllLevels && (
          <CardContent className="pt-0 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            {CAFFEINE_LEVELS.map((level) => (
              <div 
                key={level.level}
                className={`p-4 rounded-xl border transition-all ${
                  level.level === currentLevel.level 
                    ? `${level.bgColor} ${level.borderColor} ring-2 ring-offset-2 ring-warm-400` 
                    : `${level.bgColor} ${level.borderColor}`
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{level.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`font-semibold ${level.textColor}`}>
                        {level.label}
                        {level.level === currentLevel.level && (
                          <Badge className="ml-2 bg-warm-400 text-white text-[10px]">
                            <Thermometer className="h-2.5 w-2.5 mr-0.5" />
                            ปัจจุบัน
                          </Badge>
                        )}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {level.range[1] === Infinity ? `>${level.range[0]} mg` : `${level.range[0]}-${level.range[1]} mg`}
                      </Badge>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {level.effects.map((effect, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-1.5">
                          <span className={effect.startsWith("❌") || effect.startsWith("⚠️") ? "text-orange-500 mt-0.5" : "text-emerald-500 mt-0.5"}>
                            •
                          </span>
                          <span>{effect.replace(/^[❌⚠️]\s*/, "")}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* System-by-System Effects - Now shows relevance based on current level */}
      <Card className="warm-card overflow-hidden border-0">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Brain className="h-5 w-5 text-warm-500" />
            ผลกระทบตามระบบอวัยวะ
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            คลิกเพื่อดูรายละเอียด • <Sparkles className="h-3 w-3 inline text-warm-500" /> สัมพันธ์กับระดับ {Math.round(currentCaffeine)}mg ของคุณ
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          {SYSTEM_EFFECTS.map((system) => {
            // Determine if this system is significantly affected
            const isAffected = currentCaffeine >= system.threshold
            const intensity = Math.min(currentCaffeine / (system.threshold * 2) * 100, 100)
            
            return (
              <div key={system.id} className={`rounded-xl border overflow-hidden warm-card ${
              isAffected ? 'ring-2 ring-warm-300/50' : 'border-border/30'
            }`}>
                <button
                  onClick={() => setExpandedSystem(expandedSystem === system.id ? null : system.id)}
                  className="w-full p-4 flex items-center gap-3 hover:bg-accent/50 transition-colors text-left"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isAffected ? 'bg-warm-200 dark:bg-warm-700/40' : 'bg-warm-100 dark:bg-warm-900/30'
                  }`}>
                    {system.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-foreground">{system.name}</h4>
                      {isAffected && (
                        <Badge className="bg-warm-400 text-white text-[9px] px-1.5 h-4 animate-pulse">
                          ทำงาน
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{system.timing}</p>
                    
                    {/* Intensity indicator when affected */}
                    {isAffected && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-warm-400 to-warm-500 rounded-full transition-all duration-500"
                            style={{ width: `${intensity}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-warm-600 font-medium">
                          {intensity.toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {expandedSystem === system.id 
                    ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                    : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  }
                </button>

                {expandedSystem === system.id && (
                  <div className="px-4 pb-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Separator />
                    
                    {/* Positive */}
                    <div className="space-y-2">
                      <h5 className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        ผลบวก (+)
                      </h5>
                      <ul className="space-y-1.5 ml-6">
                        {system.positive.map((effect, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{effect}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Negative */}
                    <div className="space-y-2">
                      <h5 className="flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400">
                        <AlertTriangle className="h-4 w-4" />
                        ผลลบ (-)
                      </h5>
                      <ul className="space-y-1.5 ml-6">
                        {system.negative.map((effect, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <AlertTriangle className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
                            <span>{effect}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Science Note */}
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200/30 dark:border-blue-800/20">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        <strong className="flex items-center gap-1"><Lightbulb className="h-3.5 w-3.5" /> Mechanism:</strong>{' '}
                        {system.science}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Safe Consumption Guidelines */}
      <Card className="warm-card overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Shield className="h-5 w-5 text-emerald-500" />
            แนวทางการบริโภคอย่างปลอดภัย
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {SAFE_GUIDELINES.map((guideline, idx) => (
            <div key={idx} className={`p-4 rounded-xl bg-white/60 dark:bg-black/20 border transition-all ${
              // Highlight if user's daily total exceeds this guideline
              currentCaffeine > parseInt(guideline.limit.match(/\d+/)?.[0] || '999')
                ? 'border-red-300 bg-red-50/50'
                : 'border-border/30'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm text-foreground">{guideline.group}</h4>
                <Badge 
                  variant="secondary" 
                  className={`font-mono font-bold ${
                    guideline.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                    guideline.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                    guideline.color === 'pink' ? 'bg-pink-100 text-pink-700' :
                    'bg-blue-100 text-blue-700'
                  }`}
                >
                  {guideline.limit}
                </Badge>
              </div>
              <ul className="space-y-1">
                {guideline.tips.map((tip, tipIdx) => (
                  <li key={tipIdx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <Target className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Warning Signs */}
      <Card className="warm-card overflow-hidden border-0 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/10">
        <CardContent className="p-5">
          <h3 className="flex items-center gap-2 font-bold text-base text-red-700 dark:text-red-400 mb-3">
            <Skull className="h-5 w-5" />
            สัญญาณเตือน: ดื่มเกินไป!
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { symptom: "ใจสั่นเร็ว/ผิดจังหวะ", severity: "high", threshold: 200 },
              { symptom: "วิงเวียนศีรษะ คลื่นไส้รุนแรง", severity: "high", threshold: 250 },
              { symptom: "วิตก/กังวล/ตื่นเต้นมาก", severity: "medium", threshold: 150 },
              { symptom: "หายใจลำบาก/ปวดหน้าอก", severity: "danger", threshold: 350 },
              { symptom: "กล้ามเนื้อกระตุก/ชัก", severity: "danger", threshold: 400 },
              { symptom: "สับสน/หมดสติ", severity: "danger", threshold: 450 },
            ].map((item, idx) => {
              const isRelevant = currentCaffeine >= item.threshold
              return (
                <div key={idx} className={`p-3 rounded-lg flex items-center gap-2 transition-all ${
                  item.severity === 'danger' ? 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800' :
                  item.severity === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800' :
                  'bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800'
                } ${isRelevant ? 'ring-2 ring-offset-1 ring-red-300' : ''}`}>
                  <AlertTriangle className={`h-4 w-4 shrink-0 ${
                    item.severity === 'danger' ? 'text-red-600' :
                    item.severity === 'high' ? 'text-orange-600' :
                    'text-yellow-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    item.severity === 'danger' ? 'text-red-700 dark:text-red-300' :
                    item.severity === 'high' ? 'text-orange-700 dark:text-orange-300' :
                    'text-yellow-700 dark:text-yellow-300'
                  }`}>
                    {item.symptom}
                  </span>
                  {isRelevant && (
                    <Badge className="bg-red-500 text-white text-[8px] px-1 h-3 animate-pulse ml-auto">
                      ระวัง!
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300 font-medium">
              🚨 <strong>ถ้ามีอาการเหล่านี้:</strong> หยุดดื่มทันที → ดื่มน้ำมากๆ → ปรึกษาแพทย์หากอาการไม่ดีขึ้น
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="warm-card overflow-hidden border-0 bg-gradient-to-br from-warm-50 to-warm-100 dark:from-warm-900/20 dark:to-warm-800/20">
        <CardContent className="p-5">
          <h4 className="font-semibold text-base text-foreground mb-3 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-warm-500" />
            💡 Tips การดื่มอย่างมีสติ
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: <Clock className="h-4 w-4" />, tip: "ดื่มช่วงเช้า ก่อน 14:00 น.", detail: "ให้เวลาร่างกายขับออกก่อนนอน", priority: "high" },
              { icon: <Target className="h-4 w-4" />, tip: "จำกัด ≤400mg/วัน", detail: "ประมาณ 3-4 ถ้วยกาแฟ", priority: "high" },
              { icon: <Droplets className="h-4 w-4" />, tip: "ดื่มน้ำเพิ่ม", detail: "1 แก้วน้ำ ต่อ 1 แก้วกาแฟ", priority: "medium" },
              { icon: <TrendingUp className="h-4 w-4" />, tip: "Caffeine Break", detail: "หยุด 1-2 วัน/สัปดาห์ เพื่อ Reset", priority: "medium" },
              { icon: <Coffee className="h-4 w-4" />, tip: "ดื่มหลังอาหาร", detail: "ลดผลกระทบต่อกระเพาะ", priority: "low" },
              { icon: <Shield className="h-4 w-4" />, tip: "สังเกตตัวเอง", detail: "ถ้ามีอาการผิดปกติ ให้หยุด", priority: "high" },
            ].map((item, idx) => (
              <div key={idx} className={`p-3 rounded-xl bg-white/60 dark:bg-black/20 border transition-all hover:shadow-md ${
                item.priority === 'high' ? 'border-warm-300/50' : 'border-border/20'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`p-1.5 rounded-lg text-warm-500 ${
                    item.priority === 'high' ? 'bg-warm-200/80' : 'bg-warm-100 dark:bg-warm-900/30'
                  }`}>
                    {item.icon}
                  </div>
                  <span className="font-medium text-sm text-foreground">{item.tip}</span>
                  {item.priority === 'high' && (
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 ml-auto" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground ml-9">{item.detail}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
