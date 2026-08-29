"use client"

import * as React from "react"
import { type Drink } from "@/lib/caffeine-data"
import { useCaffeineStore } from "@/lib/store"
import { DrinkSelector } from "./drink-selector"
import { CaffeineChart } from "./caffeine-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Coffee, Calculator, RotateCcw, Save, CheckCircle2, Sparkles } from "lucide-react"

interface CaffeineCalculatorProps {
  className?: string
}

export function CaffeineCalculator({ className }: CaffeineCalculatorProps) {
  const [selectedDrink, setSelectedDrink] = React.useState<Drink | null>(null)
  const [servingCount, setServingCount] = React.useState<number>(1)
  const [showResult, setShowResult] = React.useState<boolean>(false)
  const [savedToHistory, setSavedToHistory] = React.useState<boolean>(false)
  
  const addEntry = useCaffeineStore((state) => state.addEntry)

  const totalCaffeine = selectedDrink 
    ? selectedDrink.caffeinePerServing * servingCount 
    : 0

  const handleCalculate = () => {
    if (selectedDrink && totalCaffeine > 0) {
      // Add to history/store
      addEntry(selectedDrink, servingCount)
      setSavedToHistory(true)
      
      setShowResult(true)
      // Scroll to result
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }, 100)
    }
  }

  const handleReset = () => {
    setSelectedDrink(null)
    setServingCount(1)
    setShowResult(false)
    setSavedToHistory(false)
  }

  return (
    <div className={className}>
      {/* Header - Warm Theme */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-warm-400/20 to-warm-500/20 mb-4">
          <Coffee className="h-8 w-8 text-warm-500" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
          ☕ คำนวณคาเฟอีน
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
          เลือกเครื่องดื่มที่คุณต้องการดื่ม
          <br className="hidden sm:block" />
          แล้วเราจะบอกปริมาณคาเฟอีนให้คุณ
        </p>
      </div>

      {/* Calculator Form - Warm Theme */}
      <Card className="warm-card overflow-hidden border-0 mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <div className="p-1.5 rounded-lg bg-warm-100 dark:bg-warm-900/30">
              <Calculator className="h-4 w-4 text-warm-500" />
            </div>
            เลือกเครื่องดื่ม
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DrinkSelector
            selectedDrink={selectedDrink}
            onDrinkChange={setSelectedDrink}
            servingCount={servingCount}
            onServingCountChange={setServingCount}
          />

          <Separator className="my-5 bg-border/50" />

          {/* Action Buttons - Warm Theme */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleCalculate}
              disabled={!selectedDrink || totalCaffeine === 0}
              className="golden-button w-full h-12 text-base font-semibold rounded-xl"
              size="lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              คำนวณเลย!
            </Button>
            
            <Button 
              onClick={handleReset}
              variant="outline" 
              className="w-full h-12 text-base font-medium border-border/50 hover:bg-accent transition-all duration-300 rounded-xl"
              size="lg"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              เริ่มใหม่
            </Button>
          </div>

          {/* Quick Summary - Warm Theme */}
          {totalCaffeine > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-warm-50 to-warm-100 dark:from-warm-900/20 dark:to-warm-800/20 border border-warm-200/50 dark:border-warm-700/30 text-center animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">คาเฟอีนทั้งหมด</p>
                {savedToHistory && (
                  <Badge variant="secondary" className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 animate-in fade-in zoom-in duration-300 border-0">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    บันทึกแล้ว
                  </Badge>
                )}
              </div>
              <p className="text-3xl font-extrabold text-warm-500 mt-1">
                {totalCaffeine.toFixed(1)} <span className="text-lg font-semibold">มก.</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1.5">
                จาก {servingCount} {selectedDrink?.servingSize} {selectedDrink?.nameTh}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result Section */}
      {showResult && totalCaffeine > 0 && (
        <div id="result-section" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CaffeineChart caffeineAmount={totalCaffeine} />
        </div>
      )}

      {/* Empty State - Warm Theme */}
      {!showResult && (
        <Card className="warm-card overflow-hidden border-2 border-dashed border-border/30 bg-warm-50/30 dark:bg-warm-900/10">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-warm-100 dark:bg-warm-900/30 flex items-center justify-center">
              <Coffee className="h-8 w-8 text-warm-400" />
            </div>
            <p className="text-foreground font-medium text-base">เลือกเครื่องดื่มและกดคำนวณ</p>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
              เพื่อดูกราฟระดับคาเฟอีนของคุณและเวลาที่คาเฟอีนจะหมดฤทธิ์
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
