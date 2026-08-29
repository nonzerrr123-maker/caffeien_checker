"use client"

import * as React from "react"
import { useCaffeineStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Edit3,
  Plus,
  Coffee,
  Zap,
  CheckCircle2
} from "lucide-react"

interface CustomInputProps {
  onAddComplete?: () => void
}

export function CustomInput({ onAddComplete }: CustomInputProps) {
  const { addEntry, settings } = useCaffeineStore()
  
  // Form state
  const [drinkName, setDrinkName] = React.useState("")
  const [caffeineAmount, setCaffeineAmount] = React.useState<number>(0)
  const [servingSize, setServingSize] = React.useState("1 แก้ว")
  const [category, setCategory] = React.useState<"coffee" | "tea" | "energy" | "other">("other")
  
  // Success state
  const [showSuccess, setShowSuccess] = React.useState(false)

  // Category icons
  const categoryIcons = {
    coffee: "☕",
    tea: "🍵",
    energy: "⚡",
    other: "🥤",
  }

  // Common custom drinks
  const commonDrinks = [
    { name: "Nescafe 3in1", caffeine: 80, size: "1 ซอง", category: "other" as const },
    { name: "Milo", caffeine: 5, size: "1 แก้ว", category: "other" as const },
    { name: "Ovaltine", caffeine: 4, size: "1 แก้ว", category: "other" as const },
    { name: "ชามะนาว", caffeine: 30, size: "1 แก้ว", category: "tea" as const },
    { name: "กาแฟโบราณ", caffeine: 100, size: "1 แก้ว", category: "coffee" as const },
  ]

  const handleQuickAdd = (drink: typeof commonDrinks[0]) => {
    const customDrink = {
      id: `custom-${Date.now()}`,
      name: drink.name,
      nameTh: drink.name,
      caffeinePerServing: drink.caffeine,
      servingSize: drink.size,
      category: drink.category,
      icon: categoryIcons[drink.category],
    }

    addEntry(customDrink, 1)
    
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      onAddComplete?.()
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!drinkName || caffeineAmount <= 0) return

    const customDrink = {
      id: `custom-${Date.now()}`,
      name: drinkName,
      nameTh: drinkName,
      caffeinePerServing: caffeineAmount,
      servingSize: servingSize || "1 หน่วย",
      category,
      icon: categoryIcons[category],
    }

    addEntry(customDrink, 1)
    
    // Reset form
    setDrinkName("")
    setCaffeineAmount(0)
    setServingSize("1 แก้ว")
    
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      onAddComplete?.()
    }, 1500)
  }

  return (
    <div className="space-y-4">
      {/* Quick Add Common Drinks */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Zap className="h-5 w-5 text-primary" />
            เพิ่มด่วน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {commonDrinks.map((drink) => (
              <Button
                key={drink.name}
                variant="outline"
                onClick={() => handleQuickAdd(drink)}
                className="h-auto py-3 px-3 flex flex-col gap-1 hover:bg-accent transition-all active:scale-[0.98]"
              >
                <span className="text-lg">{categoryIcons[drink.category]}</span>
                <span className="text-xs font-medium truncate">{drink.name}</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {drink.caffeine}mg
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Input Form */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Edit3 className="h-5 w-5 text-primary" />
            กรอกค่าเอง
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Success State */}
          {showSuccess ? (
            <div className="py-8 text-center animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-500 mb-3" />
              <p className="font-bold text-emerald-600 dark:text-emerald-400">เพิ่มสำเร็จ!</p>
              <p className="text-sm text-muted-foreground mt-1">
                ถูกบันทึกในประวัติแล้ว
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Drink Name */}
              <div className="space-y-2">
                <Label htmlFor="custom-name" className="text-sm text-muted-foreground">
                  ชื่อเครื่องดื่ม *
                </Label>
                <Input
                  id="custom-name"
                  placeholder="เช่น กาแฟสตาร์บัคส์, ชาไทยร้าน..."
                  value={drinkName}
                  onChange={(e) => setDrinkName(e.target.value)}
                  required
                  className="h-11 bg-background border-border/50 focus:border-primary/50"
                />
              </div>

              {/* Caffeine Amount & Category Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="custom-caffeine" className="text-sm text-muted-foreground">
                    คาเฟอีน (mg) *
                  </Label>
                  <Input
                    id="custom-caffeine"
                    type="number"
                    min={0}
                    max={1000}
                    step={1}
                    placeholder="0"
                    value={caffeineAmount || ""}
                    onChange={(e) => setCaffeineAmount(Number(e.target.value) || 0)}
                    required
                    className="h-11 bg-background border-border/50 focus:border-primary/50 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-category" className="text-sm text-muted-foreground">
                    หมวดหมู่
                  </Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as any)}>
                    <SelectTrigger id="custom-category" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coffee">☕ กาแฟ</SelectItem>
                      <SelectItem value="tea">🍵 ชา</SelectItem>
                      <SelectItem value="energy">⚡ พลังงาน</SelectItem>
                      <SelectItem value="other">🥤 อื่นๆ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Serving Size */}
              <div className="space-y-2">
                <Label htmlFor="custom-serving" className="text-sm text-muted-foreground">
                  ขนาด (ไม่บังคับ)
                </Label>
                <Input
                  id="custom-serving"
                  placeholder="เช่น 1 แก้ว, 500ml, 1 ขวด..."
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                  className="h-11 bg-background border-border/50 focus:border-primary/50"
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit"
                disabled={!drinkName || caffeineAmount <= 0}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all active:scale-[0.98]"
              >
                <Plus className="h-5 w-5 mr-2" />
                เพิ่มในประวัติ
              </Button>

              {/* Info */}
              <p className="text-xs text-center text-muted-foreground">
                💡 ไม่รู้ค่าคาเฟอีน? ลองค้นหา "caffeine in [ชื่อเครื่องดื่ม]"
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
