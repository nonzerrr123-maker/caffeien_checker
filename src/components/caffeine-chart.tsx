"use client"

import * as React from "react"
import {
  generateCaffeineGraphData,
  getTimeToClear,
  getPeakTime,
  CAFFEINE_CONSTANTS,
} from "@/lib/caffeine-data"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, Zap, Timer, Star, Coffee, Heart, Sparkles } from "lucide-react"

interface CaffeineChartProps {
  caffeineAmount: number // mg
  showCurrentTime?: boolean
}

const chartConfig = {
  level: {
    label: "ระดับคาเฟอีน",
    color: "#B8860B",
  },
} satisfies ChartConfig

// Cute animated coffee cup component
function AnimatedCoffeeIcon({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Coffee className="h-6 w-6 text-warm-500 animate-pulse" />
      <span className="absolute -top-1 -right-1 text-xs animate-bounce">☁️</span>
    </div>
  )
}

// Cute progress indicator
function CuteProgress({ value, max, label }: { value: number; max: number; label: string }) {
  const percentage = Math.min((value / max) * 100, 100)
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-medium text-warm-600">{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 bg-warm-100 dark:bg-warm-900/30 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-warm-400 to-warm-500 rounded-full transition-all duration-1000 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm" />
        </div>
      </div>
    </div>
  )
}

export function CaffeineChart({ caffeineAmount, showCurrentTime = true }: CaffeineChartProps) {
  const data = React.useMemo(() => 
    generateCaffeineGraphData(caffeineAmount), 
    [caffeineAmount]
  )
  
  const timeToClear = React.useMemo(() => 
    getTimeToClear(caffeineAmount), 
    [caffeineAmount]
  )
  
  const peakTime = getPeakTime()
  
  // Peak caffeine value
  const peakLevel = caffeineAmount
  
  // Current time in minutes for reference line
  const currentMinutes = React.useMemo(() => {
    const now = new Date()
    return now.getHours() * 60 + now.getMinutes()
  }, [])

  // Format time for X-axis - show actual clock time
  const formatXAxis = (value: number) => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const timeAtPoint = currentTime + value
    
    // Convert to hours and minutes (24h format)
    let hours = Math.floor(timeAtPoint / 60) % 24
    const minutes = Math.round(timeAtPoint % 60)
    
    if (hours < 0) hours += 24
    
    // Only show key time points
    if (minutes === 0 || value === 0 || value === data[data.length - 1]?.time) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }
    return ''
  }

  // Format Y-axis
  const formatYAxis = (value: number) => {
    return `${Math.round(value)}`
  }

  // Custom tooltip with cute styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const minutes = Number(label)
      const now = new Date()
      const futureTime = new Date(now.getTime() + minutes * 60 * 1000)
      const timeStr = futureTime.toLocaleTimeString('th-TH', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      
      return (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-warm-200/50 dark:border-warm-700/50">
          <p className="text-xs text-muted-foreground mb-1">🕐 เวลา {timeStr}</p>
          <p className="font-bold text-warm-600 text-lg">
            {Number(payload[0].value).toFixed(1)} <span className="text-sm font-normal">mg</span>
          </p>
          <div className="flex items-center gap-1 mt-2">
            <Sparkles className="h-3 w-3 text-warm-400" />
            <span className="text-xs text-muted-foreground">
              {Number(payload[0].value) > 100 ? '⚡ พลังงานสูง' : 
               Number(payload[0].value) > 50 ? '🌤️ ตื่นตัวดี' : 
               Number(payload[0].value) > 10 ? '😴 เริ่มผ่อนคลาย' : '💤 หมดฤทธิ์'}
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      {/* Header with cute decoration */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-warm-400/20 to-warm-500/20">
            <AnimatedCoffeeIcon />
          </div>
          <div>
            <h3 className="font-bold text-foreground flex items-center gap-1.5">
              กราฟคาเฟอีน
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            </h3>
            <p className="text-xs text-muted-foreground">วิถีชีวิตของคาเฟอีนในร่างกาย ✨</p>
          </div>
        </div>
        <Badge 
          variant="secondary" 
          className="bg-gradient-to-r from-warm-100 to-warm-200 text-warm-700 border-0 font-medium gap-1"
        >
          <Zap className="h-3 w-3" />
          {caffeineAmount} mg
        </Badge>
      </div>

      {/* Stats Cards - Cute Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        <Card className="warm-card overflow-hidden border-0 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/10 p-3">
          <div className="flex flex-col items-center text-center gap-1">
            <div className="p-2 rounded-full bg-pink-100 dark:bg-pink-900/40">
              <Heart className="h-4 w-4 text-pink-500" />
            </div>
            <p className="text-[10px] text-muted-foreground">จุดสูงสุด</p>
            <p className="font-bold text-base text-pink-600">{peakLevel.toFixed(0)}</p>
            <p className="text-[9px] text-muted-foreground">mg</p>
          </div>
        </Card>

        <Card className="warm-card overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/10 p-3">
          <div className="flex flex-col items-center text-center gap-1">
            <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/40">
              <Timer className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-[10px] text-muted-foreground">หมดฤทธิ์</p>
            <p className="font-bold text-base text-emerald-600">~{timeToClear.hours}ชม</p>
            <p className="text-[9px] text-muted-foreground">&lt;10 mg</p>
          </div>
        </Card>

        <Card className="warm-card overflow-hidden border-0 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/10 p-3">
          <div className="flex flex-col items-center text-center gap-1">
            <div className="p-2 rounded-full bg-violet-100 dark:bg-violet-900/40">
              <TrendingUp className="h-4 w-4 text-violet-500" />
            </div>
            <p className="text-[10px] text-muted-foreground">ถึงพีก</p>
            <p className="font-bold text-base text-violet-600">{peakTime.minutes}น</p>
            <p className="text-[9px] text-muted-foreground">หลังดื่ม</p>
          </div>
        </Card>
      </div>

      {/* Progress indicators */}
      <Card className="warm-card overflow-hidden border-0 p-4 space-y-3">
        <CuteProgress 
          value={caffeineAmount} 
          max={CAFFEINE_CONSTANTS.SAFE_DAILY_LIMIT_MG} 
          label="📊 ขีดจำกัดวันนี้ (400mg)" 
        />
        <CuteProgress 
          value={peakLevel} 
          max={200} 
          label="⚡ ระดับพลังงาน (max 200mg)" 
        />
      </Card>

      {/* Main Chart - Super Cute Design */}
      <Card className="warm-card overflow-hidden border-0">
        <CardContent className="pt-4">
          <ChartContainer config={chartConfig} className="h-[260px] sm:h-[300px] w-full">
            <AreaChart 
              data={data} 
              margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                {/* Main gradient - warm golden color */}
                <linearGradient id="caffeineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B8860B" stopOpacity={0.6}/>
                  <stop offset="50%" stopColor="#C9A55A" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#FAF7F2" stopOpacity={0.05}/>
                </linearGradient>
                
                {/* Glow effect for the line */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Soft grid */}
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#F5F0E8" 
                className="opacity-50"
              />
              
              {/* X-Axis with current time */}
              <XAxis 
                dataKey="time" 
                tickFormatter={formatXAxis}
                interval={11}
                className="text-xs"
                tick={{ fill: '#92400E', fontSize: 11 }}
                axisLine={{ stroke: '#F5F0E8' }}
                tickLine={false}
              />
              
              {/* Y-Axis */}
              <YAxis 
                domain={[0, Math.ceil(peakLevel / 20) * 20 || 100]}
                tickFormatter={formatYAxis}
                className="text-xs"
                tick={{ fill: '#92400E', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={35}
              />
              
              {/* Custom Tooltip */}
              <Tooltip content={<CustomTooltip />} />

              {/* Safe limit line - cute dashed style */}
              <ReferenceLine 
                y={CAFFEINE_CONSTANTS.SAFE_DAILY_LIMIT_MG} 
                stroke="#F87171" 
                strokeDasharray="6 4"
                strokeWidth={1.5}
                label={{ 
                  value: "🚨 ขีดจำกัด", 
                  position: "right", 
                  fontSize: 10, 
                  fill: "#EF4444",
                  offset: 10
                }}
                ifOverflow="extendDomain"
              />
              
              {/* Threshold line - cleared */}
              <ReferenceLine 
                y={10} 
                stroke="#34D399" 
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{ 
                  value: "😴 หมดฤทธิ์", 
                  position: "left", 
                  fontSize: 10, 
                  fill: "#10B981",
                  offset: 10
                }}
              />

              {/* Current time indicator */}
              {showCurrentTime && (
                <ReferenceLine 
                  x={0} 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  label={{ 
                    value: "📍 ตอนนี้", 
                    position: "top", 
                    fontSize: 10, 
                    fill: "#7C3AED",
                    offset: 5
                  }}
                />
              )}
              
              {/* Main area - smooth curve */}
              <Area
                type="monotone"
                dataKey="level"
                stroke="#B8860B"
                strokeWidth={3}
                fill="url(#caffeineGradient)"
                dot={false}
                activeDot={{
                  r: 7,
                  fill: "#B8860B",
                  stroke: "#FFFFFF",
                  strokeWidth: 3,
                  filter: "url(#glow)"
                } as React.CSSProperties & { r: number; fill: string; stroke: string; strokeWidth: number; filter: string }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Info Cards - Cute Row */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="warm-card overflow-hidden border-0 p-3 text-center bg-gradient-to-b from-amber-50/80 to-transparent">
          <Clock className="h-4 w-4 mx-auto text-amber-500 mb-1" />
          <p className="text-[10px] text-muted-foreground">ครึ่งชีวิต</p>
          <p className="font-bold text-sm text-amber-700">{CAFFEINE_CONSTANTS.HALF_LIFE_HOURS} ชม.</p>
        </Card>
        
        <Card className="warm-card overflow-hidden border-0 p-3 text-center bg-gradient-to-b from-orange-50/80 to-transparent">
          <Zap className="h-4 w-4 mx-auto text-orange-500 mb-1" />
          <p className="text-[10px] text-muted-foreground">ขีดจำกัด</p>
          <p className="font-bold text-sm text-orange-700">{CAFFEINE_CONSTANTS.SAFE_DAILY_LIMIT_MG} mg</p>
        </Card>
        
        <Card className="warm-card overflow-hidden border-0 p-3 text-center bg-gradient-to-b from-teal-50/80 to-transparent">
          <TrendingUp className="h-4 w-4 mx-auto text-teal-500 mb-1" />
          <p className="text-[10px] text-muted-foreground">ถึงพีก</p>
          <p className="font-bold text-sm text-teal-700">{CAFFEINE_CONSTANTS.PEAK_TIME_MINUTES} น.</p>
        </Card>
      </div>

      {/* Warning Cards - Cute alerts */}
      {caffeineAmount > CAFFEINE_CONSTANTS.SAFE_DAILY_LIMIT_MG && (
        <Card className="bg-gradient-to-r from-red-100 via-red-50 to-pink-100 dark:from-red-950/30 dark:via-red-900/20 dark:to-pink-950/30 border-2 border-red-300/50 dark:border-red-800/50 animate-pulse overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl animate-bounce">🚨</div>
              <div className="flex-1">
                <p className="font-bold text-red-700 dark:text-red-300 flex items-center gap-1.5">
                  อันตราย!
                  <span className="animate-ping inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                </p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  คาเฟอีน ({caffeineAmount.toFixed(0)} mg) เกินขีดจำกัดมาก!
                </p>
                <p className="text-xs text-red-500/80 mt-1">
                  💔 หยุดดื่มทันที ดื่มน้ำมากๆ และพักผ่อน
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {caffeineAmount > CAFFEINE_CONSTANTS.SAFE_DAILY_LIMIT_MG * 0.75 && 
       caffeineAmount <= CAFFEINE_CONSTANTS.SAFE_DAILY_LIMIT_MG && (
        <Card className="bg-gradient-to-r from-amber-100 via-yellow-50 to-orange-100 dark:from-amber-950/30 dark:via-yellow-900/20 dark:to-orange-950/30 border-2 border-amber-300/50 dark:border-amber-800/50 overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl animate-pulse">⚠️</div>
              <div className="flex-1">
                <p className="font-bold text-amber-700 dark:text-amber-300">ใกล้เกินขีดแล้ว!</p>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                  ใกล้ขีดจำกัด ({caffeineAmount.toFixed(0)} / {CAFFEINE_CONSTANTS.SAFE_DAILY_LIMIT_MG} mg)
                </p>
                <p className="text-xs text-amber-500/80 mt-1">
                  🤔 ควรระวังการบริโภคเพิ่มเติมนะ
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fun fact card */}
      <Card className="warm-card overflow-hidden border-0 bg-gradient-to-r from-purple-50/80 via-pink-50/50 to-violet-50/80 dark:from-purple-950/20 dark:via-pink-900/10 dark:to-violet-950/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <p className="font-semibold text-purple-700 dark:text-purple-300 text-sm">Did you know?</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 leading-relaxed">
                คาเฟอีนเริ่มทำงานภายใน {CAFFEINE_CONSTANTS.PEAK_TIME_MINUTES} นาที แต่จะหมดฤทธิ์完全 ต้องรอประมาณ {timeToClear.hours} ชั่วโมง! 
                ดังนั้นดื่มเช้าจะดีกว่านะ 🌅
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { PEAK_TIME_MINUTES }
const { PEAK_TIME_MINUTES } = CAFFEINE_CONSTANTS
