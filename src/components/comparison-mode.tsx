"use client"

import * as React from "react"
import { drinks, type Drink } from "@/lib/caffeine-data"
import {
  generateCaffeineGraphData,
  getTimeToClear,
} from "@/lib/caffeine-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { 
  GitCompareArrows,
  Trash2,
  Plus,
  TrendingUp
} from "lucide-react"

interface ComparisonDrink {
  drink: Drink
  servingCount: number
}

export function ComparisonMode() {
  const [comparisonList, setComparisonList] = React.useState<ComparisonDrink[]>([])
  const [selectedDrinkId, setSelectedDrinkId] = React.useState<string>("")
  
  // Chart config for multiple drinks
  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: Record<string, any> = {}
    const colors = [
      "var(--chart-1)",
      "var(--chart-2)", 
      "var(--chart-3)",
      "var(--chart-4)",
      "var(--chart-5)",
    ]
    
    comparisonList.forEach((item, index) => {
      config[`drink${index}`] = {
        label: `${item.drink.nameTh} (${item.servingCount}x)`,
        color: colors[index % colors.length],
      }
    })
    
    return config as ChartConfig
  }, [comparisonList])

  // Generate comparison data
  const comparisonData = React.useMemo(() => {
    if (comparisonList.length === 0) return []
    
    // Generate base time points (every 30 min for 12 hours)
    const dataPoints: { time: number; [key: string]: any }[] = []
    const totalMinutes = 12 * 60
    
    for (let minutes = 0; minutes <= totalMinutes; minutes += 30) {
      const point: any = { time: minutes }
      
      comparisonList.forEach((item, index) => {
        const caffeine = item.drink.caffeinePerServing * item.servingCount
        point[`drink${index}`] = Math.round(caffeine * Math.pow(0.5, (minutes / 60) / 5) * 
          (minutes <= 45 ? Math.pow(minutes / 45, 0.8) : 1))
      })
      
      dataPoints.push(point)
    }
    
    return dataPoints
  }, [comparisonList])

  // Add to comparison
  const handleAddComparison = () => {
    if (!selectedDrinkId || comparisonList.length >= 5) return
    
    const drink = drinks.find(d => d.id === selectedDrinkId)
    if (!drink) return

    // Check if already in list
    if (comparisonList.some(item => item.drink.id === selectedDrinkId)) return

    setComparisonList(prev => [...prev, { drink, servingCount: 1 }])
    setSelectedDrinkId("")
  }

  // Remove from comparison
  const handleRemove = (index: number) => {
    setComparisonList(prev => prev.filter((_, i) => i !== index))
  }

  // Update serving count
  const handleUpdateServing = (index: number, count: number) => {
    setComparisonList(prev => prev.map((item, i) => 
      i === index ? { ...item, servingCount: count } : item
    ))
  }

  // Format time axis
  const formatXAxis = (value: number) => {
    const hours = Math.floor(value / 60)
    const minutes = value % 60
    if (hours === 0) return `${minutes}น`
    if (minutes === 0) return `${hours}ชม`
    return `${hours}:${minutes.toString().padStart(2, '0')}`
  }

  // Clear all
  const handleClearAll = () => {
    setComparisonList([])
  }

  if (comparisonList.length === 0) {
    return (
      <Card className="border-dashed border-2 border-border/30 bg-muted/20">
        <CardContent className="py-10 text-center">
          <GitCompareArrows className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground font-medium text-lg">โหมดเปรียบเทียบ</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
            เลือกเครื่องดื่ม 2-5 ชนิด เพื่อเปรียบเทียบระดับคาเฟอีนในกราฟเดียวกัน
          </p>
          
          {/* Quick Selection */}
          <div className="mt-6 space-y-3">
            <Select value={selectedDrinkId} onValueChange={setSelectedDrinkId}>
              <SelectTrigger className="w-full max-w-xs mx-auto h-11">
                <SelectValue placeholder="เลือกเครื่องดื่มที่จะเปรียบเทียบ" />
              </SelectTrigger>
              <SelectContent>
                {drinks.map((drink) => (
                  <SelectItem key={drink.id} value={drink.id}>
                    <span className="flex items-center gap-2">
                      <span>{drink.icon}</span>
                      <span>{drink.nameTh}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {drink.caffeinePerServing}mg
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleAddComparison}
              disabled={!selectedDrinkId}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มเพื่อเปรียบเทียบ
            </Button>
          </div>

          {/* Suggested Comparisons */}
          <div className="mt-6 pt-6 border-t border-border/20">
            <p className="text-xs text-muted-foreground mb-3">🔥 เปรียบเทียบยอดนิยม:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                ["espresso", "drip-coffee", "matcha"],
                ["red-bull", "thai-milk-tea", "cola"],
              ].map((combo, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newItems = combo.map(id => {
                      const d = drinks.find(drink => drink.id === id)!
                      return { drink: d, servingCount: 1 }
                    })
                    setComparisonList(newItems)
                  }}
                  className="text-xs"
                >
                  {combo.map(id => drinks.find(d => d.id === id)?.icon).join(" vs ")}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <GitCompareArrows className="h-5 w-5 text-primary" />
              เปรียบเทียบ ({comparisonList.length}/5)
            </CardTitle>
            <div className="flex gap-2">
              {/* Add More */}
              {comparisonList.length < 5 && (
                <Select value={selectedDrinkId} onValueChange={setSelectedDrinkId}>
                  <SelectTrigger className="w-[180px] h-9 text-sm">
                    <SelectValue placeholder="+ เพิ่ม" />
                  </SelectTrigger>
                  <SelectContent>
                    {drinks
                      .filter(d => !comparisonList.some(item => item.drink.id === d.id))
                      .map((drink) => (
                        <SelectItem key={drink.id} value={drink.id}>
                          {drink.icon} {drink.nameTh}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearAll}
                className="text-destructive hover:text-destructive h-9 px-2"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                ลบทั้งหมด
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {/* Selected Drinks List */}
        <CardContent className="space-y-3">
          {comparisonList.map((item, index) => (
            <div 
              key={`${item.drink.id}-${index}`}
              className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/30 animate-in fade-in slide-in-from-left-2 duration-200"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div 
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: `var(--chart-${index + 1})` }}
                />
                
                <span className="text-lg">{item.drink.icon}</span>
                
                <div className="min-w-0">
                  <p className="font-medium truncate">{item.drink.nameTh}</p>
                  <p className="text-xs text-muted-foreground">
                    {(item.drink.caffeinePerServing * item.servingCount)} mg
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0.25}
                  max={10}
                  step={0.25}
                  value={item.servingCount}
                  onChange={(e) => handleUpdateServing(index, parseFloat(e.target.value) || 1)}
                  className="w-16 h-8 text-center text-sm rounded-md border border-border/50 bg-background focus:border-primary/50"
                />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Add Button */}
          {selectedDrinkId && comparisonList.length < 5 && (
            <Button 
              variant="outline" 
              onClick={handleAddComparison}
              className="w-full h-10 border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มอีกชนิด
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Comparison Chart */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <TrendingUp className="h-5 w-5 text-primary" />
            กราฟเปรียบเทียบคาเฟอีน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] sm:h-[350px] w-full">
            <AreaChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                {comparisonList.map((_, index) => (
                  <linearGradient key={`grad-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={`var(--chart-${index + 1})`} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={`var(--chart-${index + 1})`} stopOpacity={0.05}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis 
                dataKey="time" 
                tickFormatter={formatXAxis}
                interval={11}
                tick={{ fill: 'currentColor', fontSize: 11 }}
              />
              <YAxis 
                domain={[0, 'auto']}
                tickFormatter={(v) => `${v}mg`}
                tick={{ fill: 'currentColor', fontSize: 11 }}
                width={40}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => `เวลา ${formatXAxis(Number(label))}`}
                  />
                }
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                formatter={(value) => chartConfig[value]?.label || value}
              />
              {comparisonList.map((_, index) => (
                <Area
                  key={`area-${index}`}
                  type="monotone"
                  dataKey={`drink${index}`}
                  stroke={`var(--chart-${index + 1})`}
                  strokeWidth={2}
                  fill={`url(#gradient-${index})`}
                  dot={false}
                />
              ))}
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Summary Table */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 text-sm">📊 สรุปเปรียบเทียบ</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 pr-4 font-medium">เครื่องดื่ม</th>
                  <th className="text-right py-2 px-2 font-medium">คาเฟอีน</th>
                  <th className="text-right py-2 pl-2 font-medium">หมดฤทธิ</th>
                </tr>
              </thead>
              <tbody>
                {comparisonList.map((item, index) => {
                  const caffeine = item.drink.caffeinePerServing * item.servingCount
                  const clearTime = getTimeToClear(caffeine)
                  
                  return (
                    <tr key={index} className="border-b border-border/20 last:border-0">
                      <td className="py-2 pr-4">
                        <span className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: `var(--chart-${index + 1})` }}
                          />
                          {item.drink.icon} {item.drink.nameTh}
                          {item.servingCount > 1 && <span className="text-muted-foreground">×{item.servingCount}</span>}
                        </span>
                      </td>
                      <td className="text-right py-2 px-2 font-mono font-bold">{caffeine} mg</td>
                      <td className="text-right py-2 pl-2 text-muted-foreground">~{clearTime.hours} ชม.</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
