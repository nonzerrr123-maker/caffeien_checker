"use client"

import * as React from "react"
import { useCaffeineStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Moon, 
  Bed, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Info,
  Coffee
} from "lucide-react"

export function SleepImpact() {
  const { settings, getSleepImpact, getTotalCaffeineToday, entries, updateSettings } = useCaffeineStore()
  const sleepData = getSleepImpact()
  const totalCaffeine = getTotalCaffeineToday()
  
  // Calculate time until bedtime
  const now = new Date()
  const [sleepHour, sleepMin] = settings.sleepTime.split(":").map(Number)
  const bedtime = new Date(now)
  bedtime.setHours(sleepHour, sleepMin, 0, 0)
  
  if (bedtime.getTime() <= now.getTime()) {
    bedtime.setDate(bedtime.getDate() + 1)
  }
  
  const msUntilBedtime = bedtime.getTime() - now.getTime()
  const hoursUntilBedtime = Math.floor(msUntilBedtime / (1000 * 60 * 60))
  const minsUntilBedtime = Math.floor((msUntilBedtime % (1000 * 60 * 60)) / (1000 * 60))

  // No entries today
  if (entries.length === 0 || totalCaffeine === 0) {
    return (
      <Card className="border-dashed border-2 border-border/30 bg-muted/20">
        <CardContent className="py-8 text-center">
          <Moon className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground font-medium">ยังไม่มีข้อมูลการดื่ม</p>
          <p className="text-sm text-muted-foreground mt-1">
            เพิ่มเครื่องดื่มเพื่อวิเคราะห์ผลกระทบการนอน
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Status Card */}
      <Card className={`border-border/50 shadow-sm overflow-hidden ${
        !sleepData.canSleepNow 
          ? 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20 border-red-200/50 dark:border-red-800/30'
          : 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border-emerald-200/50 dark:border-emerald-800/30'
      }`}>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`p-3 rounded-2xl shrink-0 ${
              !sleepData.canSleepNow 
                ? 'bg-red-100 dark:bg-red-900/40' 
                : 'bg-emerald-100 dark:bg-emerald-900/40'
            }`}>
              {!sleepData.canSleepNow ? (
                <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-400" />
              ) : (
                <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-lg ${
                !sleepData.canSleepNow 
                  ? 'text-red-800 dark:text-red-300' 
                  : 'text-emerald-800 dark:text-emerald-300'
              }`}>
                {!sleepData.canSleepNow ? '⚠️ ควรหยุดดื่มก่อนนอน' : '✅ พร้อมนอนหลับได้'}
              </h3>
              
              <p className={`mt-1 text-sm ${
                !sleepData.canSleepNow 
                  ? 'text-red-700 dark:text-red-400' 
                  : 'text-emerald-700 dark:text-emerald-400'
              }`}>
                {!sleepData.canSleepNow 
                  ? `เวลานอน (${settings.sleepTime}) ยังมีคาเฟอีน ~${sleepData.caffeineAtBedtime} mg`
                  : `เวลานอน (${settings.sleepTime}) คาเฟอีนจะลดเหลือ ~${sleepData.caffeineAtBedtime} mg`
                }
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white/60 dark:bg-black/20 rounded-xl p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Clock className="h-3.5 w-3.5" />
                    เวลาถึงนอน
                  </div>
                  <p className="font-bold text-base">
                    {hoursUntilBedtime > 0 && `${hoursUntilBedtime} ชม.`}
                    {minsUntilBedtime > 0 && ` ${minsUntilBedtime} นาที`}
                    {hoursUntilBedtime === 0 && minsUntilBedtime === 0 && 'เร็วๆ นี้'}
                  </p>
                </div>

                <div className="bg-white/60 dark:bg-black/20 rounded-xl p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Coffee className="h-3.5 w-3.5" />
                    คาเฟอีนตอนนอน
                  </div>
                  <p className={`font-bold text-base ${
                    sleepData.caffeineAtBedtime > 100 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    ~{sleepData.caffeineAtBedtime} mg
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Bed className="h-5 w-5 text-primary" />
            คำแนะนำการนอน
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Recommended Stop Time */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-3">
              <Moon className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">ควรหยุดดื่มก่อน</p>
                <p className="font-bold text-xl">{sleepData.recommendedStopTime}</p>
              </div>
            </div>
            <Badge variant={sleepData.hoursUntilSafe <= 4 ? "destructive" : "secondary"}>
              {sleepData.hoursUntilSafe} ชม. ก่อนนอน
            </Badge>
          </div>

          {/* Tips List */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Half-life ของคาเฟอีน</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ทุก 5 ชั่วโมง คาเฟอีนจะลดลงครึ่งหนึ่ง ดังนั้นถ้าดื่ม 200mg เมื่อ 2 ทุ่ม 
                  เวลา 7 ทุ่มจะเหลือ ~50mg
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">ระดับปลอดภัยสำหรับการนอน</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ควรให้คาเฟอีนในร่างกายต่ำกว่า 50mg ก่อนเวลานอน 
                  เพื่อไม่กระทบคุณภาพการนอน
                </p>
              </div>
            </div>

            {sleepData.caffeineAtBedtime > 100 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200/50">
                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-red-800 dark:text-red-300">⚠️ เตือน!</p>
                  <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">
                    คาเฟอีนสูงกว่า 100mg ตอนนอนอาจทำให้:
                    <br />• หลับยาก / นอนไม่หลับ
                    <br />• คุณภาพการนอนลดลง
                    <br />• ตื่นกลางคืนบ่อย
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Edit Sleep Time */}
          <div className="pt-3 border-t border-border/30">
            <label className="text-sm font-medium text-muted-foreground block mb-2">
              ตั้งเวลานอน: {settings.sleepTime}
            </label>
            <input
              type="time"
              value={settings.sleepTime}
              onChange={(e) => updateSettings({ sleepTime: e.target.value })}
              className="w-full h-11 px-4 rounded-xl bg-background border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
