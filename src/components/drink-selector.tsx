"use client"

import * as React from "react"
import { drinks, categories, type Drink } from "@/lib/caffeine-data"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface DrinkSelectorProps {
  selectedDrink: Drink | null
  onDrinkChange: (drink: Drink) => void
  servingCount: number
  onServingCountChange: (count: number) => void
}

export function DrinkSelector({
  selectedDrink,
  onDrinkChange,
  servingCount,
  onServingCountChange,
}: DrinkSelectorProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")

  // Filter drinks by category
  const filteredDrinks = selectedCategory === "all" 
    ? drinks 
    : drinks.filter(drink => drink.category === selectedCategory)

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">หมวดหมู่</Label>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === "all" ? "default" : "outline"}
            className={`cursor-pointer transition-all duration-200 px-3 py-1.5 text-sm ${
              selectedCategory === "all" 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "hover:bg-accent hover:text-accent-foreground"
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            📋 ทั้งหมด
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 px-3 py-1.5 text-sm ${
                selectedCategory === cat.id 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.icon} {cat.nameTh}
            </Badge>
          ))}
        </div>
      </div>

      {/* Drink Selection */}
      <div className="space-y-2">
        <Label htmlFor="drink-select" className="text-sm font-medium text-muted-foreground">
          เลือกเครื่องดื่ม
        </Label>
        <Select 
          value={selectedDrink?.id || ""} 
          onValueChange={(value) => {
            const drink = drinks.find(d => d.id === value)
            if (drink) onDrinkChange(drink)
          }}
        >
          <SelectTrigger id="drink-select" className="w-full h-12 bg-background border-border/50 focus:border-primary/50 transition-colors">
            <SelectValue placeholder="เลือกเครื่องดื่ม..." />
          </SelectTrigger>
          <SelectContent className="max-h-64 overflow-y-auto">
            {filteredDrinks.map((drink) => (
              <SelectItem key={drink.id} value={drink.id} className="py-2.5">
                <span className="flex items-center gap-2">
                  <span className="text-lg">{drink.icon}</span>
                  <span>{drink.nameTh}</span>
                  <span className="text-muted-foreground text-xs ml-auto">
                    ({drink.caffeinePerServing} mg/{drink.servingSize})
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Serving Count */}
      <div className="space-y-2">
        <Label htmlFor="serving-count" className="text-sm font-medium text-muted-foreground">
          จำนวน (แก้ว/ขวด)
        </Label>
        <Input
          id="serving-count"
          type="number"
          min={0.25}
          max={20}
          step={0.25}
          value={servingCount}
          onChange={(e) => onServingCountChange(Math.max(0.25, parseFloat(e.target.value) || 1))}
          className="h-12 bg-background border-border/50 focus:border-primary/50 transition-colors text-center text-lg font-semibold"
        />
      </div>

      {/* Selected Drink Info */}
      {selectedDrink && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/30 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{selectedDrink.icon}</span>
            <div>
              <p className="font-semibold text-base">{selectedDrink.nameTh}</p>
              <p className="text-sm text-muted-foreground">{selectedDrink.name}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-background/50 rounded-lg p-2.5 text-center">
              <p className="text-muted-foreground text-xs">คาเฟอีน/หน่วย</p>
              <p className="font-bold text-primary text-lg">{selectedDrink.caffeinePerServing} mg</p>
            </div>
            <div className="bg-background/50 rounded-lg p-2.5 text-center">
              <p className="text-muted-foreground text-xs">ขนาด</p>
              <p className="font-bold text-foreground text-lg">{selectedDrink.servingSize}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border/30 text-center">
            <p className="text-sm text-muted-foreground">คาเฟอีนทั้งหมด</p>
            <p className="font-extrabold text-2xl text-primary">
              {(selectedDrink.caffeinePerServing * servingCount).toFixed(1)} mg
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
