"use client"

import * as React from "react"
import { useCaffeineStore } from "@/lib/store"
import {
  TOLERANCE_LEVELS,
  WITHDRAWAL_SYMPTOMS,
  DRUG_INTERACTIONS,
} from "@/lib/caffeine-science"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  TrendingUp,
  TrendingDown,
  Calendar,
  Pill,
  Clock,
  Shield,
  Zap
} from "lucide-react"

export function ToleranceTracker() {
  const { getTotalCaffeineToday, settings, entries } = useCaffeineStore()
  
  const [showWithdrawal, setShowWithdrawal] = React.useState(false)
  const [showInteractions, setShowInteractions] = React.useState(false)
  
  // Calculate average daily intake (simplified - using today's data as proxy)
  const todayTotal = getTotalCaffeineToday()
  
  // Get tolerance level based on estimated daily intake
  // In real app, this would calculate from historical data
  const getToleranceLevel = () => {
    // Use a weighted average: 70% today + 30% assumption of typical intake
    const estimatedDaily = todayTotal > 0 ? todayTotal : 100
    
    if (estimatedDaily <= 25) return TOLERANCE_LEVELS[0]
    if (estimatedDaily <= 100) return TOLERANCE_LEVELS[1]
    if (estimatedDaily <= 300) return TOLERANCE_LEVELS[2]
    if (estimatedDaily <= 500) return TOLERANCE_LEVELS[3]
    return TOLERANCE_LEVELS[4]
  }
  
  const toleranceInfo = getToleranceLevel()

  // Tolerance level colors
  const toleranceColors: Record<string, string> = {
    none: "text-emerald-600 dark:text-emerald-400",
    low: "text-green-600 dark:text-green-400", 
    moderate: "text-yellow-600 dark:text-yellow-400",
    high: "text-orange-600 dark:text-orange-400",
    critical: "text-red-600 dark:text-red-400"
  }

  const toleranceBgColors: Record<string, string> = {
    none: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-800/30",
    low: "bg-green-50 dark:bg-green-950/30 border-green-200/50 dark:border-green-800/30",
    moderate: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200/50 dark:border-yellow-800/30",
    high: "bg-orange-50 dark:bg-orange-950/30 border-orange-200/50 dark:border-orange-800/30",
    critical: "bg-red-50 dark:bg-red-950/30 border-red-200/50 dark:border-red-800/30"
  }

  return (
    <div className="space-y-6">
      {/* Current Tolerance Status */}
      <Card className={`border-border/50 shadow-sm ${toleranceBgColors[toleranceInfo.toleranceLevel]}`}>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`p-3 rounded-2xl shrink-0 ${
              toleranceInfo.toleranceLevel === 'critical' ? 'bg-red-100 dark:bg-red-900/40' :
              toleranceInfo.toleranceLevel === 'high' ? 'bg-orange-100 dark:bg-orange-900/40' :
              toleranceInfo.toleranceLevel === 'moderate' ? 'bg-yellow-100 dark:bg-yellow-900/40' :
              'bg-emerald-100 dark:bg-emerald-900/40'
            }`}>
              {toleranceInfo.toleranceLevel === 'critical' || toleranceInfo.toleranceLevel === 'high' 
                ? <AlertTriangle className={`h-7 w-7 ${toleranceColors[toleranceInfo.toleranceLevel]}`} />
                : <Shield className={`h-7 w-7 ${toleranceColors[toleranceInfo.toleranceLevel]}`} />
              }
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-xl ${toleranceColors[toleranceInfo.toleranceLevel]}`}>
                ระดับ Tolerance: {toleranceInfo.toleranceLevel.toUpperCase()}
              </h3>
              
              <p className="text-sm text-muted-foreground mt-1">
                {toleranceInfo.description}
              </p>

              {/* Effects */}
              <ul className="mt-3 space-y-1.5">
                {toleranceInfo.effects.map((effect, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Zap className={`h-4 w-4 mt-0.5 shrink-0 ${
                      effect.includes('Sensitive') || effect.includes('ชัดเจน') 
                        ? 'text-green-500' 
                        : effect.includes('Severe') || effect.includes('Health risks')
                          ? 'text-red-500'
                          : 'text-yellow-500'
                    }`} />
                    <span>{effect}</span>
                  </li>
                ))}
              </ul>

              {/* Recommendation */}
              <div className="mt-4 p-3 rounded-lg bg-background/60 backdrop-blur-sm border border-border/20">
                <p className="text-sm">
                  <strong className="text-primary">💡 แนะนำ:</strong> {toleranceInfo.recommendation}
                </p>
              </div>

              {/* Reset Time */}
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span><strong>Reset Time:</strong> {toleranceInfo.resetTime}</span>
              </div>
            </div>
          </div>

          {/* Visual Scale */}
          <div className="mt-5 pt-4 border-t border-border/20">
            <p className="text-xs text-muted-foreground mb-3">📊 Tolerance Scale</p>
            <div className="grid grid-cols-5 gap-2">
              {TOLERANCE_LEVELS.map((level, idx) => (
                <div 
                  key={idx}
                  className={`p-2 rounded-lg text-center transition-all ${
                    level.toleranceLevel === toleranceInfo.toleranceLevel
                      ? `ring-2 ring-primary ${toleranceBgColors[level.toleranceLevel]}`
                      : 'bg-muted/50 opacity-60'
                  }`}
                >
                  <div className="text-lg mb-1">
                    {level.toleranceLevel === 'critical' ? '☠️' :
                     level.toleranceLevel === 'high' ? '⚠️' :
                     level.toleranceLevel === 'moderate' ? '⚡' :
                     level.toleranceLevel === 'low' ? '🙂' : '😇'}
                  </div>
                  <p className="text-[10px] font-medium truncate">{level.toleranceLevel}</p>
                  <p className="text-[9px] text-muted-foreground">≤{level.dailyIntake}mg</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Symptoms */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <Button
            variant="ghost"
            onClick={() => setShowWithdrawal(!showWithdrawal)}
            className="w-full justify-between h-auto py-2 px-0 hover:bg-transparent"
          >
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <TrendingDown className="h-5 w-5 text-primary" />
              อาการขาดคาเฟอีน (Withdrawal)
            </CardTitle>
            {showWithdrawal ? <ChevronDown className="h-5 w-5" /> : <ChevronDown className="h-5 w-5 rotate-[-90deg]" />}
          </Button>
        </CardHeader>
        
        {showWithdrawal && (
          <CardContent className="pt-0 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-sm text-muted-foreground">
              ⚠️ อาการขาดคาเฟอีนเริ่มขึ้น <strong>12-24 ชั่วโมง</strong> หลังจากหยุดดื่ม และอาจนานถึง <strong>2-9 วัน</strong>
            </p>

            {/* Symptoms by Severity */}
            <div className="space-y-3">
              {/* Severe */}
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200/30 dark:border-red-800/20">
                <h5 className="font-semibold text-sm text-red-700 dark:text-red-300 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> รุนแรง (Severe)
                </h5>
                {WITHDRAWAL_SYMPTOMS.filter(s => s.severity === 'severe').map((symptom, idx) => (
                  <div key={idx} className="text-sm text-red-600 dark:text-red-400 last:mb-0 mb-2 pb-2 border-b border-red-200/20 last:border-0 last:pb-0">
                    <strong>• {symptom.symptom}</strong>
                    <span className="block text-xs mt-0.5 text-muted-foreground">
                      ระยะเวลา: {symptom.timing} | ใช้เวลา: {symptom.duration}
                    </span>
                    <span className="block text-xs mt-0.5 text-blue-600 dark:text-blue-400">
                      💊 Relief: {symptom.relief}
                    </span>
                  </div>
                ))}
              </div>

              {/* Moderate */}
              <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200/30 dark:border-yellow-800/20">
                <h5 className="font-semibold text-sm text-yellow-700 dark:text-yellow-300 mb-2 flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> ปานกลาง (Moderate)
                </h5>
                {WITHDRAWAL_SYMPTOMS.filter(s => s.severity === 'moderate').map((symptom, idx) => (
                  <div key={idx} className="text-sm text-yellow-700 dark:text-yellow-400 last:mb-0 mb-2 pb-2 border-b border-yellow-200/20 last:border-0 last:pb-0">
                    <strong>• {symptom.symptom}</strong>
                    <span className="block text-xs mt-0.5 text-muted-foreground">
                      ระยะเวลา: {symptom.timing} | ใช้เวลา: {symptom.duration}
                    </span>
                    <span className="block text-xs mt-0.5 text-blue-600 dark:text-blue-400">
                      💊 Relief: {symptom.relief}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mild */}
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200/30 dark:border-green-800/20">
                <h5 className="font-semibold text-sm text-green-700 dark:text-green-300 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> เบา (Mild)
                </h5>
                {WITHDRAWAL_SYMPTOMS.filter(s => s.severity === 'mild').map((symptom, idx) => (
                  <div key={idx} className="text-sm text-green-700 dark:text-green-400 last:mb-0 mb-2 pb-2 border-b border-green-200/20 last:border-0 last:pb-0">
                    <strong>• {symptom.symptom}</strong>
                    <span className="block text-xs mt-0.5 text-muted-foreground">
                      ระยะเวลา: {symptom.timing} | ใช้เวลา: {symptom.duration}
                    </span>
                    <span className="block text-xs mt-0.5 text-blue-600 dark:text-blue-400">
                      💊 Relief: {symptom.relief}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Taper */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200/30 dark:border-blue-800/20">
              <h5 className="font-semibold text-sm text-blue-800 dark:text-blue-300 mb-2">
                📋 วิธีลดคาเฟอีนอย่างปลอดภัย (Tapering)
              </h5>
              <ol className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-decimal list-inside">
                <li>ลด 25% ของปริมาณที่ดื่มต่อสัปดาห์</li>
                <li>เพิ่มน้ำดื่ม (8-10 แก้ว/วัน)</li>
                <li>นอนเพิ่ม (7-8 ชม./คืน)</li>
                <li>ออกกำลังกายเบาๆ (walk, yoga)</li>
                <li>รับประทาน B-Vitamins, Magnesium</li>
                <li>พัก 2-4 สัปดาห์ → tolerance ลดลง 70-80%</li>
              </ol>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Drug Interactions */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <Button
            variant="ghost"
            onClick={() => setShowInteractions(!showInteractions)}
            className="w-full justify-between h-auto py-2 px-0 hover:bg-transparent"
          >
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Pill className="h-5 w-5 text-primary" />
              ปฏิสัมพันธ์กับยา/สารอื่น
            </CardTitle>
            {showInteractions ? <ChevronDown className="h-5 w-5" /> : <ChevronDown className="h-5 w-5 rotate-[-90deg]" />}
          </Button>
        </CardHeader>
        
        {showInteractions && (
          <CardContent className="pt-0 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Dangerous Interactions */}
            <div className="space-y-2">
              <Badge variant="destructive" className="text-xs px-3 py-1">
                ☠️ อันตราย - หลีกเลี่ยง!
              </Badge>
              {DRUG_INTERACTIONS.filter(i => i.type === 'dangerous').map((interaction, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200/30 dark:border-red-800/20">
                  <h6 className="font-semibold text-sm text-red-800 dark:text-red-300">
                    {interaction.substance}
                  </h6>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                    {interaction.effect}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    Mechanism: {interaction.mechanism}
                  </p>
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-2">
                    ✅ {interaction.advice}
                  </p>
                </div>
              ))}
            </div>

            {/* Caution Interactions */}
            <div className="space-y-2 pt-2">
              <Badge variant="secondary" className="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                ⚠️ ระวัง - ดูอาการ
              </Badge>
              {DRUG_INTERACTIONS.filter(i => i.type === 'caution').map((interaction, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200/30 dark:border-yellow-800/20">
                  <h6 className="font-semibold text-sm text-yellow-800 dark:text-yellow-300">
                    {interaction.substance}
                  </h6>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                    {interaction.effect}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    Mechanism: {interaction.mechanism}
                  </p>
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-2">
                    ✅ {interaction.advice}
                  </p>
                </div>
              ))}
            </div>

            {/* Safe Combinations */}
            <div className="space-y-2 pt-2">
              <Badge variant="secondary" className="text-xs px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                ✅ ปลอดภัย - ผสมได้
              </Badge>
              {DRUG_INTERACTIONS.filter(i => i.type === 'safe').map((interaction, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200/30 dark:border-green-800/20">
                  <h6 className="font-semibold text-sm text-green-800 dark:text-green-300">
                    {interaction.substance}
                  </h6>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    {interaction.effect}
                  </p>
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-2">
                    💡 {interaction.advice}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

// Helper component for chevron icon
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}
