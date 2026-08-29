"use client"

import * as React from "react"
import { useCaffeineStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Share2,
  Download,
  Copy,
  CheckCircle2,
  Image as ImageIcon,
  FileText
} from "lucide-react"

interface ShareExportProps {
  caffeineAmount?: number
}

export function ShareExport({ caffeineAmount }: ShareExportProps) {
  const { getEntriesToday, getTotalCaffeineToday, settings, getDailyProgress, entries } = useCaffeineStore()
  
  const [copied, setCopied] = React.useState(false)
  const todayEntries = getEntriesToday()
  const totalCaffeine = caffeineAmount || getTotalCaffeineToday()
  const dailyProgress = getDailyProgress()

  // Generate share text
  const generateShareText = () => {
    const date = new Date().toLocaleDateString("th-TH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    let text = `☕ Caffeine Report - ${date}\n`
    text += `${"─".repeat(30)}\n\n`
    
    if (todayEntries.length > 0) {
      text += `📊 วันนี้บริโภคคาเฟอีน: **${totalCaffeine.toFixed(0)} mg**\n`
      text += `📈 ใช้ไป: ${dailyProgress.percentage}% จากขีดจำกัด ${dailyProgress.limit} mg\n\n`
      
      text += `📝 รายการ:\n`
      todayEntries.forEach((entry, index) => {
        const time = new Date(entry.timestamp).toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        })
        text += `   ${index + 1}. ${entry.drink.icon} ${entry.drink.nameTh} - ${entry.totalCaffeine.toFixed(0)} mg (${time})\n`
      })
      
      text += `\n⚖️ การตั้งค่า:\n`
      text += `   • น้ำหนัก: ${settings.bodyWeight} kg\n`
      text += `   • Sensitivity: ${settings.sensitivityLevel}\n`
      text += `   • เวลานอน: ${settings.sleepTime}\n`
    } else {
      text += `ยังไม่มีข้อมูลการดื่มวันนี้\n`
    }

    text += `\n${"─".repeat(30)}\n`
    text += `🔗 คำนวณด้วย Caffeine Calculator`

    return text
  }

  // Copy to clipboard
  const handleCopyText = async () => {
    const text = generateShareText()
    
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement("textarea")
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Share via Web Share API
  const handleShare = async () => {
    const text = generateShareText()

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Caffeine Report",
          text: text,
        })
      } catch (err) {
        // User cancelled or error
        console.log("Share cancelled or failed")
      }
    } else {
      // Fallback to copy
      handleCopyText()
    }
  }

  // Download as text file
  const handleDownload = () => {
    const text = generateShareText()
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement("a")
    a.href = url
    a.download = `caffeine-report-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Capture screenshot (simplified - just shows alert)
  const handleScreenshot = () => {
    // In a real app, you'd use html2canvas or similar
    // For now, we'll show the share dialog which works well on mobile
    alert(
      "📸 ถ่ายภาพหน้าจอ\n\n" +
      "บนมือถือ: กดปุ่ม Power + Volume Down พร้อมกัน\n" +
      "บน PC: กด Windows + Shift + S (Snipping Tool)\n\n" +
      "หรือใช้ปุ่ม 'แชร์' ด้านล่างเพื่อแชร์ข้อความแทน!"
    )
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Share2 className="h-5 w-5 text-primary" />
          แชร์ & ส่งออก
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview */}
        <div className="p-4 rounded-xl bg-muted/50 border border-border/20 font-mono text-xs whitespace-pre-wrap max-h-48 overflow-y-auto">
          {generateShareText()}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Copy Text */}
          <Button 
            variant="outline" 
            onClick={handleCopyText}
            className="h-auto py-3 flex flex-col gap-1.5 hover:bg-accent transition-all"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="text-xs font-medium text-emerald-600">คัดลอกแล้ว!</span>
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" />
                <span className="text-xs font-medium">คัดลอกข้อความ</span>
              </>
            )}
          </Button>

          {/* Share */}
          <Button 
            variant="outline" 
            onClick={handleShare}
            className="h-auto py-3 flex flex-col gap-1.5 hover:bg-accent transition-all"
          >
            <Share2 className="h-5 w-5" />
            <span className="text-xs font-medium">แชร์</span>
          </Button>

          {/* Download */}
          <Button 
            variant="outline" 
            onClick={handleDownload}
            className="h-auto py-3 flex flex-col gap-1.5 hover:bg-accent transition-all"
          >
            <Download className="h-5 w-5" />
            <span className="text-xs font-medium">ดาวน์โหลด .txt</span>
          </Button>

          {/* Screenshot hint */}
          <Button 
            variant="outline" 
            onClick={handleScreenshot}
            className="h-auto py-3 flex flex-col gap-1.5 hover:bg-accent transition-all"
          >
            <ImageIcon className="h-5 w-5" />
            <span className="text-xs font-medium">ถ่ายภาพ</span>
          </Button>
        </div>

        {/* Quick Stats for Sharing */}
        {todayEntries.length > 0 && (
          <div className="pt-3 border-t border-border/30">
            <p className="text-xs text-muted-foreground mb-2">📌 สถิติด่วนสำหรับแชร์:</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="font-mono">
                ☕ {todayEntries.length} แก้ว
              </Badge>
              <Badge variant="secondary" className="font-mono">
                ⚡ {totalCaffeine.toFixed(0)} mg
              </Badge>
              <Badge 
                variant={dailyProgress.status === 'exceeded' ? 'destructive' : 'secondary'} 
                className="font-mono"
              >
                📈 {dailyProgress.percentage}%
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
