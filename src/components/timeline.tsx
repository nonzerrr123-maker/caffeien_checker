"use client"

import * as React from "react"
import { useCaffeineStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  Trash2, 
  Coffee, 
  Clock, 
  Zap,
  History,
  X,
  Calendar,
  TrendingUp,
  Award,
  ChevronLeft,
  ChevronRight,
  Star,
  Flame,
  Target,
} from "lucide-react"

// Date range types
type DateRange = "today" | "yesterday" | "week" | "month"

interface DateRangeOption {
  id: DateRange
  label: string
  icon: React.ReactNode
  description: string
}

const dateRangeOptions: DateRangeOption[] = [
  { 
    id: "today", 
    label: "วันนี้", 
    icon: <Star className="h-4 w-4" />, 
    description: "บันทึกวันนี้" 
  },
  { 
    id: "yesterday", 
    label: "เมื่อวาน", 
    icon: <ChevronLeft className="h-4 w-4" />, 
    description: "เมื่อวานนี้" 
  },
  { 
    id: "week", 
    label: "7 วัน", 
    icon: <Calendar className="h-4 w-4" />, 
    description: "7 วันที่ผ่านมา" 
  },
  { 
    id: "month", 
    label: "30 วัน", 
    icon: <TrendingUp className="h-4 w-4" />, 
    description: "30 วันที่ผ่านมา" 
  },
]

export function Timeline() {
  const { entries, removeEntry, clearAllEntries } = useCaffeineStore()
  const [selectedRange, setSelectedRange] = React.useState<DateRange>("today")
  
  // Get entries based on selected date range
  const getEntriesByRange = React.useCallback((): typeof entries => {
    const now = new Date()
    
    switch (selectedRange) {
      case "today": {
        const startOfToday = new Date(now)
        startOfToday.setHours(0, 0, 0, 0)
        return entries.filter(e => e.timeAdded >= startOfToday.getTime())
          .sort((a, b) => b.timeAdded - a.timeAdded)
      }
      
      case "yesterday": {
        const startOfYesterday = new Date(now)
        startOfYesterday.setDate(startOfYesterday.getDate() - 1)
        startOfYesterday.setHours(0, 0, 0, 0)
        
        const endOfYesterday = new Date(now)
        endOfYesterday.setHours(0, 0, 0, 0)
        
        return entries.filter(e => 
          e.timeAdded >= startOfYesterday.getTime() && e.timeAdded < endOfYesterday.getTime()
        ).sort((a, b) => b.timeAdded - a.timeAdded)
      }
      
      case "week": {
        const weekAgo = new Date(now)
        weekAgo.setDate(weekAgo.getDate() - 7)
        return entries.filter(e => e.timeAdded >= weekAgo.getTime())
          .sort((a, b) => b.timeAdded - a.timeAdded)
      }
      
      case "month": {
        const monthAgo = new Date(now)
        monthAgo.setDate(monthAgo.getDate() - 30)
        return entries.filter(e => e.timeAdded >= monthAgo.getTime())
          .sort((a, b) => b.timeAdded - a.timeAdded)
      }
      
      default:
        return []
    }
  }, [entries, selectedRange])
  
  const filteredEntries = getEntriesByRange()

  // Calculate statistics
  const calculateStats = () => {
    // Get unique days with entries
    const uniqueDays = new Set<string>()
    let totalCaffeine = 0
    let totalEntries = 0
    
    entries.forEach(entry => {
      const date = new Date(entry.timeAdded)
      const dateStr = date.toLocaleDateString('th-TH')
      uniqueDays.add(dateStr)
      if (entry.timeAdded > 0) {
        totalCaffeine += entry.totalCaffeine
        totalEntries++
      }
    })
    
    return {
      totalDays: uniqueDays.size,
      totalCaffeine,
      totalEntries,
      avgPerDay: uniqueDays.size > 0 ? totalCaffeine / uniqueDays.size : 0,
      avgPerEntry: totalEntries > 0 ? totalCaffeine / totalEntries : 0,
    }
  }
  
  const stats = calculateStats()
  
  // Group entries by date (for week/month view)
  const groupEntriesByDate = () => {
    const groups: Record<string, typeof filteredEntries> = {}
    
    filteredEntries.forEach(entry => {
      const date = new Date(entry.timeAdded)
      const dateStr = date.toLocaleDateString('th-TH', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
      
      if (!groups[dateStr]) {
        groups[dateStr] = []
      }
      groups[dateStr].push(entry)
    })
    
    return groups
  }

  // Format time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("th-TH", { 
      hour: "2-digit", 
      minute: "2-digit" 
    })
  }

  // Format relative time
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (minutes < 1) return "เมื่อสักครู่"
    if (minutes < 60) return `${minutes} นาทีที่แล้ว`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`
    
    const days = Math.floor(hours / 24)
    return `${days} วันที่แล้ว`
  }

  // Total caffeine for current filter
  const totalFilteredCaffeine = filteredEntries.reduce((sum, e) => sum + e.totalCaffeine, 0)

  // Check if entry is from today
  const isToday = (timestamp: number) => {
    const today = new Date()
    const entryDate = new Date(timestamp)
    return today.toDateString() === entryDate.toDateString()
  }

  return (
    <div className="space-y-4">
      {/* Header with Stats */}
      <Card className="warm-card overflow-hidden border-0 bg-gradient-to-br from-warm-50 via-warm-100/50 to-warm-50 dark:from-warm-900/20 dark:via-warm-800/10 dark:to-warm-900/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <div className="p-1.5 rounded-lg bg-warm-200/60 dark:bg-warm-700/40">
                <History className="h-5 w-5 text-warm-500" />
              </div>
              ประวัติคาเฟอีน
              <Badge variant="secondary" className="bg-warm-200/80 text-warm-700 text-xs font-normal ml-1">
                📅 {stats.totalDays} วัน
              </Badge>
            </CardTitle>
            
            {/* Clear All Button - Only show for today */}
            {selectedRange === "today" && filteredEntries.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2 text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    ลบทั้งหมด
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>ลบประวัติทั้งหมด?</AlertDialogTitle>
                    <AlertDialogDescription>
                      การกระทำนี้ไม่สามารถย้อนกลับได้ ประวัติการดื่มทั้งหมดในวันนี้จะถูกลบ
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={clearAllEntries}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      ลบทั้งหมด
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardHeader>

        {/* Stats Grid */}
        <CardContent className="pt-0">
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center p-2 rounded-xl bg-white/60 dark:bg-black/20">
              <Flame className="h-4 w-4 mx-auto text-orange-500 mb-1" />
              <p className="text-[10px] text-muted-foreground">วันที่ดื่ม</p>
              <p className="font-bold text-sm text-orange-600">{stats.totalDays}</p>
            </div>
            
            <div className="text-center p-2 rounded-xl bg-white/60 dark:bg-black/20">
              <Zap className="h-4 w-4 mx-auto text-warm-500 mb-1" />
              <p className="text-[10px] text-muted-foreground">รวมทั้งหมด</p>
              <p className="font-bold text-sm text-warm-600">{Math.round(stats.totalCaffeine)} mg</p>
            </div>
            
            <div className="text-center p-2 rounded-xl bg-white/60 dark:bg-black/20">
              <Coffee className="h-4 w-4 mx-auto text-emerald-500 mb-1" />
              <p className="text-[10px] text-muted-foreground">รายการ</p>
              <p className="font-bold text-sm text-emerald-600">{stats.totalEntries}</p>
            </div>
            
            <div className="text-center p-2 rounded-xl bg-white/60 dark:bg-black/20">
              <Target className="h-4 w-4 mx-auto text-violet-500 mb-1" />
              <p className="text-[10px] text-muted-foreground">เฉลี่ย/วัน</p>
              <p className="font-bold text-sm text-violet-600">{Math.round(stats.avgPerDay)} mg</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Range Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {dateRangeOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedRange(option.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 ${
              selectedRange === option.id
                ? 'bg-gradient-to-r from-warm-400 to-warm-500 text-white shadow-md scale-105'
                : 'bg-card border border-border/50 hover:border-warm-300 hover:bg-accent/50 text-foreground'
            }`}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      {/* Current Range Summary */}
      {filteredEntries.length > 0 && (
        <Card className="warm-card overflow-hidden border-0 bg-gradient-to-r from-violet-50/80 to-purple-50/80 dark:from-violet-950/20 dark:to-purple-950/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-violet-500" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {selectedRange === "today" && "📊 สรุปวันนี้"}
                  {selectedRange === "yesterday" && "📊 สรุปเมื่อวาน"}
                  {selectedRange === "week" && "📊 สรุป 7 วัน"}
                  {selectedRange === "month" && "📊 สรุป 30 วัน"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {filteredEntries.length} รายการ • {totalFilteredCaffeine.toFixed(0)} mg รวม
                </p>
              </div>
            </div>
            <Badge 
              variant="secondary" 
              className={`font-mono font-bold ${
                totalFilteredCaffeine > 400 ? 'bg-red-100 text-red-700' :
                totalFilteredCaffeine > 200 ? 'bg-amber-100 text-amber-700' :
                'bg-emerald-100 text-emerald-700'
              }`}
            >
              {totalFilteredCaffeine.toFixed(0)} mg
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredEntries.length === 0 ? (
        <Card className="border-dashed border-2 border-border/30 bg-muted/20">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-warm-100 dark:bg-warm-900/30 flex items-center justify-center animate-pulse">
              <History className="h-8 w-8 text-warm-400" />
            </div>
            <p className="text-muted-foreground font-medium">
              {selectedRange === "today" && "ยังไม่มีประวัติวันนี้"}
              {selectedRange === "yesterday" && "ไม่มีประวัติเมื่อวาน"}
              {(selectedRange === "week" || selectedRange === "month") && "ไม่มีประวัติในช่วงนี้"}
            </p>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
              {selectedRange === "today" 
                ? "เมื่อคุณคำนวณคาเฟอีน จะถูกบันทึกที่นี่ ☕"
                : "ลองเลือกช่วงเวลาอื่น หรือเริ่มบันทึกใหม่ 📝"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Timeline Entries */
        <ScrollArea className="max-h-[500px] overflow-y-auto">
          <div className="space-y-4 pr-2">
            {/* For week/month view, group by date */}
            {(selectedRange === "week" || selectedRange === "month") ? (
              Object.entries(groupEntriesByDate()).map(([dateStr, dayEntries]) => (
                <div key={dateStr}>
                  {/* Date Header */}
                  <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-2 px-1">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {dateStr}
                      <Badge variant="outline" className="ml-auto text-[10px]">
                        {dayEntries.reduce((sum, e) => sum + e.totalCaffeine, 0).toFixed(0)} mg
                      </Badge>
                    </p>
                  </div>
                  
                  {/* Entries for this day */}
                  <div className="space-y-2 mt-2">
                    {dayEntries.map((entry, index) => (
                      <TimelineEntry 
                        key={entry.id} 
                        entry={entry} 
                        index={index}
                        formatTime={formatTime}
                        formatRelativeTime={formatRelativeTime}
                        isToday={isToday(entry.timeAdded)}
                        onRemove={() => removeEntry(entry.id)}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : /* For today/yesterday view, flat list */
              filteredEntries.map((entry, index) => (
                <TimelineEntry 
                  key={entry.id} 
                  entry={entry} 
                  index={index}
                  formatTime={formatTime}
                  formatRelativeTime={formatRelativeTime}
                  isToday={isToday(entry.timeAdded)}
                  onRemove={() => removeEntry(entry.id)}
                />
              ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

// Individual Timeline Entry Component
function TimelineEntry({ 
  entry, 
  index, 
  formatTime, 
  formatRelativeTime, 
  isToday,
  onRemove 
}: { 
  entry: ReturnType<typeof useCaffeineStore extends infer S ? () => any : never>[number]
  index: number
  formatTime: (ts: number) => string
  formatRelativeTime: (ts: number) => string
  isToday: boolean
  onRemove: () => void
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)

  return (
    <Card 
      className={`border-border/30 animate-in slide-in-from-right-${Math.min(index * 2, 10)} duration-300 transition-all hover:shadow-md ${
        index === 0 && isToday ? 'ring-2 ring-warm-300/50 bg-gradient-to-r from-warm-50/50 to-transparent' : ''
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Icon & Time */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <span className="text-2xl">{entry.drink.icon}</span>
              <div className="w-px h-full bg-border min-h-[20px]" />
              <Clock className="h-3.5 w-3.5 text-muted-foreground mt-1" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold truncate">{entry.drink.nameTh}</h4>
                {index === 0 && isToday && (
                  <Badge className="bg-warm-400 text-white text-[9px] px-1.5 h-4 animate-pulse">
                    ล่าสุด
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs shrink-0">
                  {formatTime(entry.timestamp)}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mt-0.5">
                {entry.drink.name} • {entry.servingCount} × {entry.drink.servingSize}
              </p>

              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5 bg-primary/10 rounded-md px-2 py-1">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  <span className="font-bold text-sm text-primary">
                    {entry.totalCaffeine.toFixed(0)} mg
                  </span>
                </div>
                
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(entry.timeAdded)}
                </span>
              </div>
            </div>
          </div>

          {/* Delete Button */}
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="shrink-0 h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1 shrink-0">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setShowDeleteConfirm(false)}
              >
                ยกเลิก
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="h-7 text-xs"
                onClick={() => {
                  onRemove()
                  setShowDeleteConfirm(false)
                }}
              >
                ลบ
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
