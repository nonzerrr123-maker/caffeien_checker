"use client"

import * as React from "react"
import { useCaffeineStore } from "@/lib/store"
import {
  CAFFEINE_FACTS,
} from "@/lib/caffeine-science"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Award,
  RefreshCw,
  Sparkles,
  Target,
  Clock,
  Zap
} from "lucide-react"

interface Insight {
  id: string
  type: "tip" | "warning" | "achievement" | "fact" | "recommendation";
  title: string;
  description: string;
  icon: React.ReactNode;
  priority: "high" | "medium" | "low";
}

export function Insights() {
  const { 
    getEntriesToday, 
    getTotalCaffeineToday, 
    settings, 
    getCurrentCaffeineLevel,
    entries,
    getDailyProgress,
    getSleepImpact
  } = useCaffeineStore()
  
  const [currentFactIndex, setCurrentFactIndex] = React.useState(0)
  
  const todayEntries = getEntriesToday()
  const totalCaffeine = getTotalCaffeineToday()
  const currentLevel = getCurrentCaffeineLevel()
  const dailyProgress = getDailyProgress()
  const sleepImpact = getSleepImpact()

  // Generate personalized insights based on user data
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = []

    // 1. Daily Progress Insight
    if (dailyProgress.percentage >= 100) {
      insights.push({
        id: "over-limit",
        type: "warning",
        title: "⚠️ เกินขีดจำกัดแล้ว!",
        description: `วันนี้บริโภคคาเฟอีน ${dailyProgress.current} mg เกินขีดจำกัด ${dailyProgress.limit} mg แล้ว หยุดดื่มเพื่อสุขภาพ`,
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        priority: "high"
      })
    } else if (dailyProgress.percentage >= 75) {
      insights.push({
        id: "near-limit",
        type: "warning",
        title: "📊 ใกล้ขีดจำกัดแล้ว",
        description: `บริโภคไปแล้ว ${dailyProgress.percentage}% (${dailyProgress.current}/${dailyProgress.limit} mg) ระวังอย่าเพิ่ม`,
        icon: <TrendingUp className="h-5 w-5 text-yellow-500" />,
        priority: "medium"
      })
    } else if (totalCaffeine > 0 && dailyProgress.status === 'safe') {
      insights.push({
        id: "good-progress",
        type: "achievement",
        title: "🎯 ใช้อยู่ในขีดจำกัดปลอดภัย",
        description: `วันนี้บริโภค ${dailyProgress.current} mg (${dailyProgress.percentage}% ของขีดจำกัด) - ดีมาก!`,
        icon: <Award className="h-5 w-5 text-emerald-500" />,
        priority: "low"
      })
    }

    // 2. Sleep Impact Insight
    if (!sleepImpact.canSleepNow && totalCaffeine > 0) {
      insights.push({
        id: "sleep-warning",
        type: "warning",
        title: "😴 กระทบการนอน",
        description: `เวลา ${settings.sleepTime} จะมีคาเฟอีน ~${sleepImpact.caffeineAtBedtime} mg ควรหยุดดื่มก่อน ${sleepImpact.recommendedStopTime}`,
        icon: <Clock className="h-5 w-5 text-orange-500" />,
        priority: "high"
      })
    } else if (sleepImpact.canSleepNow && totalCaffeine > 0) {
      insights.push({
        id: "sleep-ok",
        type: "tip",
        title: "😴 พร้อมนอนได้",
        description: `เวลานอน (${settings.sleepTime}) คาเฟอีนจะลดเหลือ <50mg - ไม่กระทบคุณภาพการนอน`,
        icon: <Sparkles className="h-5 w-5 text-blue-500" />,
        priority: "low"
      })
    }

    // 3. Timing Pattern Insights
    if (todayEntries.length >= 2) {
      const sortedByTime = [...todayEntries].sort((a, b) => a.timestamp - b.timestamp)
      const firstDrink = new Date(sortedByTime[0].timestamp)
      const lastDrink = new Date(sortedByTime[sortedByTime.length - 1].timestamp)
      
      // Late drinking check
      if (lastDrink.getHours() >= parseInt(settings.sleepTime.split(':')[0]) - 4) {
        insights.push({
          id: "late-drinking",
          type: "recommendation",
          title: "🕐 ดื่มช้าเกินไป?",
          description: `รายการสุดท้ายเวลา ${lastDrink.toLocaleTimeString('th-TH')} - ใกล้เวลานอนเกินไป ควรดื่มเร็วขึ้น`,
          icon: <Target className="h-5 w-5 text-purple-500" />,
          priority: "medium"
        })
      }
      
      // Spacing check
      if (sortedByTime.length >= 3) {
        let minGap = Infinity
        for (let i = 1; i < sortedByTime.length; i++) {
          const gap = sortedByTime[i].timestamp - sortedByTime[i-1].timestamp
          minGap = Math.min(minGap, gap)
        }
        
        if (minGap < 60 * 60 * 1000) { // less than 1 hour
          insights.push({
            id: "too-frequent",
            type: "recommendation",
            title: "⚡ ดื่มถี่เกินไป?",
            description: "ระยะห่างระหว่างแก้วน้อยกว่า 1 ชม. - ควรเว้นระยะ 2-3 ชม. เพื่อให้ร่างกาย process ได้ทัน",
            icon: <Zap className="h-5 w-5 text-yellow-500" />,
            priority: "medium"
          })
        }
      }
    }

    // 4. Body Weight Adjustment
    const idealLimit = settings.bodyWeight * 5.7
    if (Math.abs(settings.bodyWeight - 65) > 15) {
      insights.push({
        id: "weight-adjustment",
        type: "tip",
        title: "⚖️ ขีดจำกัดตามน้ำหนัก",
        description: `น้ำหนัก ${settings.bodyWeight}kg → ขีดจำกัดแนะนำ ~${idealLimit.toFixed(0)}mg (5.7mg/kg)`,
        icon: <Target className="h-5 w-5 text-indigo-500" />,
        priority: "low"
      })
    }

    // 5. Sensitivity-based tips
    if (settings.sensitivityLevel === 'sensitive') {
      insights.push({
        id: "sensitive-tip",
        type: "tip",
        title: "🧬 Sensitive Mode Active",
        description: "คุณตั้งค่า sensitive mode - ระวัง jitters, anxiety, insomnia ถ้าเกิน 100mg",
        icon: <Lightbulb className="h-5 w-5 text-cyan-500" />,
        priority: "medium"
      })
    }

    return insights.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }

  const insights = generateInsights()

  // Get random fact
  const currentFact = CAFFEINE_FACTS[currentFactIndex % CAFFEINE_FACTS.length]

  const nextFact = () => {
    setCurrentFactIndex(prev => prev + 1)
  }

  // Category colors for facts
  const factCategoryColors: Record<string, string> = {
    science: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    history: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
    fun: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
    health: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
  }

  return (
    <div className="space-y-6">
      {/* Personalized Insights */}
      {insights.length > 0 ? (
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Sparkles className="h-5 w-5 text-primary" />
              Insights ส่วนตัว ({insights.length})
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {insights.map((insight) => (
              <div 
                key={insight.id}
                className={`p-4 rounded-xl border transition-all animate-in fade-in slide-in-from-right-2 duration-300 ${
                  insight.type === 'warning' 
                    ? 'bg-red-50 dark:bg-red-950/20 border-red-200/30 dark:border-red-800/20'
                    : insight.type === 'achievement'
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/30 dark:border-emerald-800/20'
                      : insight.type === 'recommendation'
                        ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200/30 dark:border-blue-800/20'
                        : 'bg-muted/50 border-border/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">{insight.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-sm ${
                      insight.type === 'warning' ? 'text-red-800 dark:text-red-300' :
                      insight.type === 'achievement' ? 'text-emerald-800 dark:text-emerald-300' :
                      'text-foreground'
                    }`}>
                      {insight.title}
                    </h4>
                    <p className={`text-sm mt-1 ${
                      insight.type === 'warning' ? 'text-red-600 dark:text-red-400' :
                      insight.type === 'achievement' ? 'text-emerald-600 dark:text-emerald-400' :
                      'text-muted-foreground'
                    }`}>
                      {insight.description}
                    </p>
                  </div>
                  
                  {/* Priority Badge */}
                  <Badge 
                    variant={insight.priority === 'high' ? 'destructive' : 'secondary'}
                    className="shrink-0 text-[10px]"
                  >
                    {insight.priority === 'high' ? 'สำคัญ' : insight.priority === 'medium' ? 'แนะนำ' : 'info'}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        /* No Data State */
        <Card className="border-dashed border-2 border-border/30 bg-muted/20">
          <CardContent className="py-10 text-center">
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground font-medium">ยังไม่มีข้อมูลสำหรับวิเคราะห์</p>
            <p className="text-sm text-muted-foreground mt-1">
              เพิ่มเครื่องดื่มเพื่อรับ Insights ส่วนตัว
            </p>
          </CardContent>
        </Card>
      )}

      {/* Fun Fact Section */}
      <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20 border-violet-200/30 dark:border-violet-800/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Lightbulb className="h-5 w-5 text-primary" />
              รู้จักคาเฟอีน?
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextFact}
              className="h-8 w-8 p-0 hover:bg-accent"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3 animate-in fade-in duration-300" key={currentFactIndex}>
            <Badge 
              variant="secondary" 
              className={`text-xs ${factCategoryColors[currentFact.category]}`}
            >
              {currentFact.category === 'science' ? '🔬 Science' :
               currentFact.category === 'history' ? '📜 History' :
               currentFact.category === 'fun' ? '😄 Fun Fact' : '💪 Health'}
            </Badge>
            
            <p className="text-sm leading-relaxed">
              {currentFact.fact}
            </p>
            
            {currentFact.source && (
              <p className="text-xs text-muted-foreground italic mt-2">
                Source: {currentFact.source}
              </p>
            )}
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-border/20">
            {CAFFEINE_FACTS.slice(0, 8).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentFactIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentFactIndex % CAFFEINE_FACTS.length
                    ? 'bg-primary w-6'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-center text-muted-foreground mt-2">
            {currentFactIndex + 1} / {CAFFEINE_FACTS.length} facts
          </p>
        </CardContent>
      </Card>

      {/* Quick Stats Summary */}
      {entries.length > 0 && (
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <TrendingUp className="h-5 w-5 text-primary" />
              สรุปวันนี้
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">แก้วทั้งหมด</p>
                <p className="font-bold text-2xl text-primary">{todayEntries.length}</p>
              </div>
              
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">คาเฟอีนรวม</p>
                <p className="font-bold text-2xl text-primary">{totalCaffeine.toFixed(0)}<span className="text-sm ml-1">mg</span></p>
              </div>
              
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">ระดับปัจจุบัน</p>
                <p className="font-bold text-lg text-foreground">{currentLevel.toFixed(0)}<span className="text-xs ml-1">mg</span></p>
              </div>
              
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant={
                  dailyProgress.status === 'exceeded' ? 'destructive' :
                  dailyProgress.status === 'high' ? 'secondary' : 'default'
                }>
                  {dailyProgress.status === 'exceeded' ? 'เกิน' :
                   dailyProgress.status === 'high' ? 'สูง' :
                   dailyProgress.status === 'moderate' ? 'ปานกลาง' : 'ปลอดภัย'}
                </Badge>
              </div>
            </div>

            {/* Average per drink */}
            <div className="mt-3 pt-3 border-t border-border/20 text-center">
              <p className="text-xs text-muted-foreground">
                เฉลี่ย {(totalCaffeine / todayEntries.length).toFixed(0)} mg/แก้ว • 
                ขีดจำกัด {dailyProgress.limit} mg/วัน
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
