"use client"

import * as React from "react"
import { useCaffeineStore, type SensitivityLevel, type Gender, SENSITIVITY_LIMITS } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  User,
  Scale,
  HeartPulse,
  Baby,
  AlertCircle,
  Save,
  CheckCircle2,
} from "lucide-react"

export function SettingsPanel() {
  const { settings, updateSettings, resetSettings, getDailyProgress } = useCaffeineStore()
  const dailyProgress = getDailyProgress()
  
  // Local state for form
  const [formData, setFormData] = React.useState({
    firstName: settings.firstName,
    lastName: settings.lastName,
    gender: settings.gender,
    age: settings.age,
    bodyWeight: settings.bodyWeight,
    customLimit: settings.customLimit,
    sensitivityLevel: settings.sensitivityLevel,
  })
  
  const [saved, setSaved] = React.useState(false)
  const [showCustomLimit, setShowCustomLimit] = React.useState(
    settings.sensitivityLevel === 'custom'
  )

  // Update local form when settings change from outside
  React.useEffect(() => {
    setFormData({
      firstName: settings.firstName,
      lastName: settings.lastName,
      gender: settings.gender,
      age: settings.age,
      bodyWeight: settings.bodyWeight,
      customLimit: settings.customLimit,
      sensitivityLevel: settings.sensitivityLevel,
    })
    setShowCustomLimit(settings.sensitivityLevel === 'custom')
  }, [settings])

  const handleSave = () => {
    updateSettings({
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      age: formData.age,
      bodyWeight: formData.bodyWeight,
      customLimit: formData.customLimit,
      sensitivityLevel: formData.sensitivityLevel,
    })
    
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Get sensitivity info
  const getSensitivityInfo = (level: SensitivityLevel) => {
    switch (level) {
      case "normal":
        return {
          label: "ไม่แพ้-ไม่ไวต่อคาเฟอีน",
          description: "คนปกติที่ดื่มคาเฟอีนเป็นประจำ",
          limit: SENSITIVITY_LIMITS.normal,
          color: "text-emerald-600 dark:text-emerald-400",
          bgColor: "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800",
        }
      case "sensitive":
        return {
          label: "ไวต่อคาเฟอีน",
          description: "รู้สึกกระชับ / ใจสั่น / นอนไม่หลับง่าย",
          limit: SENSITIVITY_LIMITS.sensitive,
          color: "text-amber-600 dark:text-amber-400",
          bgColor: "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800",
        }
      case "pregnant":
        return {
          label: "ตั้งครรภ์/ให้นมบุตร",
          description: "แนะนำโดย WHO สำหรับคนตั้งครรภ์",
          limit: SENSITIVITY_LIMITS.pregnant,
          color: "text-pink-600 dark:text-pink-400",
          bgColor: "bg-pink-50 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800",
        }
      case "custom":
        return {
          label: "กำหนดเอง",
          description: `ขีดจำกัด ${formData.customLimit} mg`,
          limit: formData.customLimit,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
        }
    }
  }

  const currentSensitivityInfo = getSensitivityInfo(formData.sensitivityLevel)

  // Calculate current effective limit
  const getCurrentLimit = () => {
    switch (formData.sensitivityLevel) {
      case "sensitive": return SENSITIVITY_LIMITS.sensitive
      case "pregnant": return SENSITIVITY_LIMITS.pregnant
      case "custom": return formData.customLimit
      default: return SENSITIVITY_LIMITS.normal
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">ตั้งค่าส่วนบุคคล</h1>
        <p className="text-sm text-muted-foreground mt-1">
          ปรับแต่งตามความต้องการของคุณ
        </p>
      </div>

      {/* Limit Setting Card - Matching Design */}
      <Card className="warm-card overflow-hidden border-0">
        <CardContent className="p-5 space-y-4">
          {/* Current Limit Display */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Label className="text-base font-semibold text-foreground">
                กำหนดขีดจำกัด
              </Label>
              <p className="text-sm text-muted-foreground mt-0.5">
                จำนวนคาเฟอีนสูงสุดที่บริโภต่อวันได้
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-warm-500">
                {getCurrentLimit()}
              </span>
              <span className="text-sm text-muted-foreground ml-1">มก.</span>
            </div>
          </div>

          {/* Custom Limit Input - Show when custom selected */}
          {(showCustomLimit || formData.sensitivityLevel === 'custom') && (
            <div className="space-y-2 pt-3 border-t border-border/50">
              <Label htmlFor="custom-limit" className="text-sm text-muted-foreground">
                กำหนดขีดจำกัดเอง (มก.)
              </Label>
              <Input
                id="custom-limit"
                type="number"
                min={25}
                max={1000}
                value={formData.customLimit}
                onChange={(e) => setFormData({ ...formData, customLimit: Math.max(25, Number(e.target.value) || 400) })}
                className="h-12 text-lg font-semibold text-center"
              />
              <p className="text-xs text-muted-foreground text-center">
                แนะนำ: ผู้ใหญ่ไม่เกิน 400 มก./วัน • เด็กไม่เกิน 100 มก./วัน • คนตั้งครรภ์ไม่เกิน 200 มก./วัน
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personal Info Card - Matching Design */}
      <Card className="warm-card overflow-hidden border-0">
        <CardContent className="p-5 space-y-4">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="first-name" className="text-sm font-medium text-foreground">
              ชื่อ
            </Label>
            <Input
              id="first-name"
              type="text"
              placeholder="กรอกชื่อ"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="h-11"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="last-name" className="text-sm font-medium text-foreground">
              นามสกุล
            </Label>
            <Input
              id="last-name"
              type="text"
              placeholder="กรอกนามสกุล"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="h-11"
            />
          </div>

          {/* Gender Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              เพศ
            </Label>
            <Select 
              value={formData.gender} 
              onValueChange={(value) => setFormData({ ...formData, gender: value as Gender })}
            >
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="เลือกเพศ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">ชาย</SelectItem>
                <SelectItem value="female">หญิง</SelectItem>
                <SelectItem value="other">อื่นๆ</SelectItem>
                <SelectItem value="prefer_not_to_say">ไม่ระบุ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age Input */}
          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium text-foreground">
              อายุ (ปี)
            </Label>
            <Input
              id="age"
              type="number"
              min={1}
              max={120}
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: Math.max(1, Math.min(120, Number(e.target.value) || 25)) })}
              className="h-11 text-center font-semibold"
            />
            <p className="text-xs text-muted-foreground">
              กรอกอายุจริงของคุณ • ช่วยคำนวณขีดจำกัดที่เหมาะสม
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sensitivity Level Card - Matching Design */}
      <Card className="warm-card overflow-hidden border-0">
        <CardContent className="p-5 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              ความไวต่อคาเฟอีน-ความแพ้
            </Label>
            
            <Select 
              value={formData.sensitivityLevel} 
              onValueChange={(value) => {
                setFormData({ ...formData, sensitivityLevel: value as SensitivityLevel })
                setShowCustomLimit(value === 'custom')
              }}
            >
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="เลือกระดับความไว" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-500" />
                    ไม่แพ้-ไม่ไวต่อคาเฟอีน
                  </span>
                </SelectItem>
                <SelectItem value="sensitive">
                  <span className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    ไวต่อคาเฟอีน
                  </span>
                </SelectItem>
                <SelectItem value="pregnant">
                  <span className="flex items-center gap-2">
                    <Baby className="h-4 w-4 text-pink-500" />
                    ตั้งครรภ์/ให้นมบุตร
                  </span>
                </SelectItem>
                <SelectItem value="custom">
                  <span className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-blue-500" />
                    กำหนดเอง
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Info Box for Selected Sensitivity */}
            <div className={`p-4 rounded-xl border ${currentSensitivityInfo.bgColor}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${currentSensitivityInfo.color}`}>
                    {currentSensitivityInfo.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentSensitivityInfo.description}
                  </p>
                </div>
                <Badge variant="outline" className="font-mono font-bold flex-shrink-0">
                  ≤{currentSensitivityInfo.limit} มก.
                </Badge>
              </div>
            </div>

            {/* Helper Text */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              คุณ-ลบ: ไม่แพ้-ไม่ไวต่อคาเฟอีน • คนไว: 200 มก./วัน • คนตั้งครรภ์: ไม่เกิน 200 มก./วัน
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              คุณ-ลบเพิ่มเติม: ไม่แพ้-ไม่ไวต่อคาเฟอีน • หากมีอาการผิดปกติหลังดื่มคาเฟอีน ควรปรึกษาแพทย์
              หรือลองเปลี่ยนเป็นดื่มคาเฟอีนน้อยลง
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Body Weight Card */}
      <Card className="warm-card overflow-hidden border-0">
        <CardContent className="p-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="body-weight" className="text-sm font-medium text-foreground">
              น้ำหนักตัว (กิโลกรัม)
            </Label>
            <Input
              id="body-weight"
              type="number"
              min={30}
              max={300}
              value={formData.bodyWeight}
              onChange={(e) => setFormData({ ...formData, bodyWeight: Math.max(30, Number(e.target.value) || 65) })}
              className="h-11 text-center text-lg font-semibold"
            />

            {/* Weight-based recommendation */}
            <div className="p-3 rounded-xl bg-warm-50 dark:bg-warm-900/20 border border-warm-200 dark:border-warm-700/50">
              <p className="text-xs text-muted-foreground mb-1">
                💡 ขีดจำกัดแนะนำตามน้ำหนัก (~5.7mg/kg)
              </p>
              <p className="font-bold text-xl text-warm-500">
                {(formData.bodyWeight * 5.7).toFixed(0)} มก./วัน
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        {/* Save Button - Golden Style Matching Design */}
        <Button 
          onClick={handleSave}
          className={`golden-button w-full h-12 rounded-xl font-semibold text-base ${
            saved ? 'bg-emerald-500 hover:bg-emerald-600' : ''
          }`}
        >
          {saved ? (
            <>
              <CheckCircle2 className="h-5 w-5 mr-2" />
              บันทึกสำเร็จ!
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              บันทึกการตั้งค่า
            </>
          )}
        </Button>

        {/* Reset Button */}
        <Button 
          variant="outline" 
          onClick={() => {
            resetSettings()
            setSaved(false)
          }}
          className="w-full h-11 rounded-xl border-border/50 hover:bg-accent transition-all font-medium"
        >
          รีเซ็ตค่าตั้งต้น
        </Button>
      </div>

      {/* Current Status Summary */}
      <Card className={`warm-card overflow-hidden border-0 ${
        dailyProgress.status === 'exceeded' 
          ? 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/10'
          : dailyProgress.status === 'high'
            ? 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/10'
            : 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/10'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">วันนี้บริโภคไปแล้ว</p>
              <p className={`font-bold text-2xl mt-0.5 ${
                dailyProgress.status === 'exceeded' 
                  ? 'text-red-500' 
                  : dailyProgress.status === 'high'
                    ? 'text-amber-500'
                    : 'text-emerald-500'
              }`}>
                {dailyProgress.current} มก.
              </p>
            </div>
            
            <div className="text-right">
              <Badge 
                variant={dailyProgress.status === 'exceeded' ? 'destructive' : 'secondary'}
                className="text-sm px-3 py-1"
              >
                {dailyProgress.percentage}%
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                จากขีดจำกัด {dailyProgress.limit} มก.
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-2 bg-white/60 dark:bg-black/20 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                dailyProgress.status === 'exceeded' 
                  ? 'bg-red-500' 
                  : dailyProgress.status === 'high'
                    ? 'bg-amber-500'
                    : dailyProgress.status === 'moderate'
                      ? 'bg-blue-500'
                      : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(dailyProgress.percentage, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
