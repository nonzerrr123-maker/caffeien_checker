"use client"

import * as React from "react"
import { useCaffeineStore } from "@/lib/store"
import { drinks, categories, type Drink } from "@/lib/caffeine-data"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Coffee,
  Edit3,
  Plus,
  Zap,
  CheckCircle2,
  X,
  Sparkles,
  Heart,
  Star,
  Search,
  Grid3X3,
  List,
  ChevronDown,
  Filter,
} from "lucide-react"

interface AddCaffeinePopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: "calculator" | "custom" | null
  onModeChange?: (mode: "calculator" | "custom") => void
}

// Favorite drinks data (most popular) - as Drink type
const favoriteDrinks: Drink[] = [
  { id: "fav-americano", name: "Americano", nameTh: "อเมริกาโน", caffeinePerServing: 95, servingSize: "1 แก้ว", category: "coffee", icon: "☕" },
  { id: "fav-latte", name: "Latte", nameTh: "ลาเต้", caffeinePerServing: 63, servingSize: "1 แก้ว", category: "coffee", icon: "☕" },
  { id: "fav-green-tea", name: "Green Tea", nameTh: "ชาเขียว", caffeinePerServing: 28, servingSize: "1 แก้ว", category: "tea", icon: "🍵" },
  { id: "fav-thai-tea", name: "Thai Milk Tea", nameTh: "ชาไทย", caffeinePerServing: 47, servingSize: "1 แก้ว", category: "tea", icon: "🧋" },
  { id: "fav-matcha", name: "Matcha", nameTh: "มัทฉะ", caffeinePerServing: 70, servingSize: "1 แก้ว", category: "tea", icon: "🍵" },
  { id: "fav-red-bull", name: "Red Bull", nameTh: "เรดบูลล์", caffeinePerServing: 80, servingSize: "1 กระป๊บ", category: "energy", icon: "⚡" },
]

// Category icons and colors
const categoryConfig = {
  coffee: { 
    icon: "☕", 
    label: "กาแฟ", 
    color: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    textColor: "text-amber-700 dark:text-amber-300",
  },
  tea: { 
    icon: "🍵", 
    label: "ชา", 
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  energy: { 
    icon: "⚡", 
    label: "พลังงาน", 
    color: "from-blue-400 to-cyan-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  other: { 
    icon: "🥤", 
    label: "อื่นๆ", 
    color: "from-purple-400 to-pink-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    textColor: "text-purple-700 dark:text-purple-300",
  },
}

export function AddCaffeinePopup({ 
  open, 
  onOpenChange,
  mode = "calculator",
  onModeChange
}: AddCaffeinePopupProps) {
  const { addEntry } = useCaffeineStore()
  
  // Form state for custom input
  const [drinkName, setDrinkName] = React.useState("")
  const [caffeineAmount, setCaffeineAmount] = React.useState<number>(0)
  const [category, setCategory] = React.useState<Drink["category"]>("other")
  
  // Success state
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [lastAddedDrink, setLastAddedDrink] = React.useState<string>("")
  
  // UI state
  const [selectedCategory, setSelectedCategory] = React.useState<Drink["category"] | "favorites">("favorites")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")

  // Reset form when popup opens
  React.useEffect(() => {
    if (open) {
      setShowSuccess(false)
      setDrinkName("")
      setCaffeineAmount(0)
      setSelectedCategory("favorites")
      setSearchQuery("")
    }
  }, [open])

  // Filter drinks by category and search
  const getFilteredDrinks = () => {
    let filtered = drinks
    
    // Filter by category if not showing favorites
    if (selectedCategory !== "favorites") {
      filtered = filtered.filter(d => d.category === selectedCategory)
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(query) || 
        d.nameTh.includes(query)
      )
    }
    
    return filtered
  }

  const handleQuickAdd = (drink: Drink) => {
    addEntry(drink, 1)
    
    setLastAddedDrink(drink.nameTh)
    setShowSuccess(true)
    
    // Auto close after success animation
    setTimeout(() => {
      setShowSuccess(false)
      onOpenChange(false)
    }, 1500)
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!drinkName || caffeineAmount <= 0) return

    const categoryIcons = {
      coffee: "☕",
      tea: "🍵",
      energy: "⚡",
      other: "🥤",
    }

    const customDrink: Drink = {
      id: `custom-${Date.now()}`,
      name: drinkName,
      nameTh: drinkName,
      caffeinePerServing: caffeineAmount,
      servingSize: "1 หน่วย",
      category,
      icon: categoryIcons[category],
    }

    addEntry(customDrink, 1)
    
    setLastAddedDrink(drinkName)
    setShowSuccess(true)
    
    // Auto close after success animation
    setTimeout(() => {
      setShowSuccess(false)
      onOpenChange(false)
      // Reset form
      setDrinkName("")
      setCaffeineAmount(0)
    }, 1500)
  }

  const filteredDrinks = getFilteredDrinks()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 shadow-2xl max-h-[85vh]">
        {/* Decorative Header */}
        <div className="relative bg-gradient-to-r from-warm-400 via-warm-500 to-warm-600 p-5 text-white shrink-0">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 left-4 w-20 h-20 rounded-full bg-white blur-xl"></div>
            <div className="absolute bottom-2 right-4 w-16 h-16 rounded-full bg-white blur-lg"></div>
          </div>
          
          <DialogHeader className="relative z-10">
            <DialogTitle className="flex items-center justify-center gap-2 text-white text-xl font-bold">
              <Sparkles className="h-6 w-6" />
              เพิ่มคาเฟอีน
              <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
            </DialogTitle>
            <p className="text-center text-white/80 text-sm mt-1">
              เลือกเครื่องดื่มโปรดของคุณ ☕
            </p>
          </DialogHeader>

          {/* Floating Icons */}
          <Coffee className="absolute top-4 right-6 h-8 w-8 text-white/20 rotate-12" />
          <Heart className="absolute bottom-4 left-6 h-6 w-6 text-white/20 -rotate-12" />
        </div>

        {/* Content */}
        <div className="flex flex-col overflow-hidden">
          {/* Mode Tabs */}
          {onModeChange && (
            <div className="flex gap-2 p-3 bg-muted/30 border-b border-border/20 shrink-0">
              <button
                onClick={() => onModeChange("calculator")}
                className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                  mode === "calculator"
                    ? "bg-gradient-to-r from-warm-400 to-warm-500 text-white shadow-md"
                    : "bg-background text-muted-foreground hover:text-foreground border border-border/50"
                }`}
              >
                <Coffee className="h-4 w-4" />
                เลือกเครื่องดื่ม
              </button>
              <button
                onClick={() => onModeChange("custom")}
                className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                  mode === "custom"
                    ? "bg-gradient-to-r from-warm-400 to-warm-500 text-white shadow-md"
                    : "bg-background text-muted-foreground hover:text-foreground border border-border/50"
                }`}
              >
                <Edit3 className="h-4 w-4" />
                กรอกเอง
              </button>
            </div>
          )}

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1">
            {/* Success State */}
            {showSuccess ? (
              <div className="py-16 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 via-green-400 to-teal-400 flex items-center justify-center shadow-lg animate-bounce">
                  <CheckCircle2 className="h-12 w-12 text-white" />
                </div>
                <h3 className="font-bold text-xl text-foreground mb-2">เพิ่มสำเร็จ! 🎉</h3>
                <p className="text-muted-foreground font-medium">{lastAddedDrink}</p>
                <p className="text-xs text-muted-foreground mt-2">ถูกบันทึกในประวัติแล้ว</p>
                
                {/* Confetti-like decoration */}
                <div className="flex justify-center gap-3 mt-6">
                  {[Star, Heart, Sparkles, Coffee].map((Icon, i) => (
                    <Icon key={i} className={`h-6 w-6 animate-bounce`} style={{ 
                      animationDelay: `${i * 150}ms`,
                      color: ['#FBBF24', '#EC4899', '#8B5CF6', '#B8860B'][i]
                    }} />
                  ))}
                </div>
              </div>
            ) : mode === "calculator" ? (
              /* Calculator Mode */
              <div className="p-4 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาเครื่องดื่ม..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-border/50 focus:border-warm-400 focus:ring-warm-400/20"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Category Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  <button
                    onClick={() => setSelectedCategory("favorites")}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-xs whitespace-nowrap transition-all shrink-0 ${
                      selectedCategory === "favorites"
                        ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md"
                        : "bg-muted hover:bg-accent text-muted-foreground"
                    }`}
                  >
                    <Star className={`h-3.5 w-3.5 ${selectedCategory === "favorites" ? "fill-white" : ""}`} />
                    ถูกใจ
                  </button>
                  
                  {(Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-xs whitespace-nowrap transition-all shrink-0 ${
                        selectedCategory === cat
                          ? `bg-gradient-to-r ${categoryConfig[cat].color} text-white shadow-md`
                          : "bg-muted hover:bg-accent text-muted-foreground"
                      }`}
                    >
                      <span>{categoryConfig[cat].icon}</span>
                      {categoryConfig[cat].label}
                    </button>
                  ))}
                </div>

                {/* View Toggle & Count */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {selectedCategory === "favorites" ? "⭐ เครื่องดื่มยอดนิยม" : `${categoryConfig[selectedCategory]?.icon} ${categoryConfig[selectedCategory]?.label}`}
                    <Badge variant="secondary" className="ml-2 text-[10px]">
                      {filteredDrinks.length} รายการ
                    </Badge>
                  </p>
                  
                  <div className="flex gap-1 p-1 bg-muted rounded-lg">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded ${viewMode === "grid" ? "bg-background shadow-sm" : ""}`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded ${viewMode === "list" ? "background shadow-sm" : ""}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Favorites Section (when favorites is selected) */}
                {selectedCategory === "favorites" && !searchQuery && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-warm-600 flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      เครื่องดื่มที่คุณอาจชอบ
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2.5">
                      {favoriteDrinks.map((drink) => (
                        <button
                          key={drink.id}
                          onClick={() => handleQuickAdd(drink)}
                          className="group relative p-3 rounded-xl bg-gradient-to-br from-warm-50 to-orange-50/50 dark:from-warm-900/20 dark:to-orange-900/10 border border-warm-200/50 hover:border-warm-400 hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
                        >
                          {/* Favorite star badge */}
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                            <Star className="h-3 w-3 fill-white text-white" />
                          </div>
                          
                          <div className="flex items-start gap-2.5">
                            <span className="text-2xl group-hover:scale-110 transition-transform">{drink.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate group-hover:text-warm-700 transition-colors">
                                {drink.nameTh}
                              </p>
                              <Badge variant="secondary" className="mt-1.5 text-[10px] font-mono px-1.5 py-0 bg-warm-200/80 text-warm-700 hover:bg-warm-300/80">
                                <Zap className="h-2.5 w-2.5 mr-0.5" />
                                {drink.caffeinePerServing} mg
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Color accent bar at bottom */}
                          <div className={`absolute bottom-0 left-2 right-2 h-1 rounded-full bg-gradient-to-r ${categoryConfig[drink.category]?.color} opacity-60 group-hover:opacity-100 transition-opacity`}></div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category Drinks Grid/List */}
                <div className={
                  viewMode === "grid" 
                    ? "grid grid-cols-2 gap-2.5" 
                    : "space-y-2"
                }>
                  {filteredDrinks.map((drink) => (
                    <button
                      key={drink.id}
                      onClick={() => handleQuickAdd(drink)}
                      className={`group relative rounded-xl bg-background border border-border/50 hover:border-warm-300 hover:shadow-md transition-all duration-200 active:scale-[0.98] ${
                        viewMode === "grid" ? "p-3" : "p-3 flex items-center gap-3 w-full"
                      }`}
                    >
                      {/* Color accent bar (for grid view) */}
                      {viewMode === "grid" && (
                        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r ${categoryConfig[drink.category]?.color}`}></div>
                      )}
                      
                      <div className={viewMode === "grid" ? "flex items-start gap-2.5 mt-1" : "flex items-center gap-3 flex-1"}>
                        <span className={`${
                          viewMode === "grid" ? "text-2xl" : "text-xl"
                        } group-hover:scale-110 transition-transform`}>
                          {drink.icon}
                        </span>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`font-medium text-foreground truncate group-hover:text-warm-600 transition-colors ${
                              viewMode === "grid" ? "text-sm" : "text-sm"
                            }`}>
                              {drink.nameTh}
                            </p>
                            
                            {viewMode === "list" && (
                              <Badge variant="outline" className="text-[10px] shrink-0">
                                {drink.servingSize}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className={`font-mono px-1.5 py-0 bg-warm-100 text-warm-600 hover:bg-warm-200 ${
                              viewMode === "grid" ? "text-[10px]" : "text-[10px]"
                            }`}>
                              <Zap className="h-2.5 w-2.5 mr-0.5" />
                              {drink.caffeinePerServing} mg
                            </Badge>
                            
                            {viewMode === "grid" && (
                              <span className="text-[9px] text-muted-foreground">
                                {drink.servingSize}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick add indicator */}
                      <div className={`absolute ${
                        viewMode === "grid" ? "bottom-2 right-2" : "right-3"
                      } opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <Plus className="h-4 w-4 text-warm-500" />
                      </div>
                    </button>
                  ))}
                </div>

                {/* No results */}
                {filteredDrinks.length === 0 && (
                  <div className="py-8 text-center">
                    <Coffee className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">ไม่พบเครื่องดื่มที่ค้นหา</p>
                    <p className="text-xs text-muted-foreground mt-1">ลองคำหาสั้นๆ หรือเลือกหมวดหมู่อื่น</p>
                  </div>
                )}
              </div>
            ) : (
              /* Custom Input Mode */
              <form onSubmit={handleCustomSubmit} className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Edit3 className="h-4 w-4 text-warm-500" />
                  <span>กรอกรายละเอียดเครื่องดื่ม</span>
                </div>

                {/* Drink Name */}
                <div className="space-y-2">
                  <Label htmlFor="popup-name" className="text-sm font-medium text-foreground">
                    ชื่อเครื่องดื่ม *
                  </Label>
                  <Input
                    id="popup-name"
                    placeholder="เช่น กาแฟสตาร์บัคส์, ชาไทยร้าน..."
                    value={drinkName}
                    onChange={(e) => setDrinkName(e.target.value)}
                    required
                    className="h-12 rounded-xl border-border/50 focus:border-warm-400 focus:ring-warm-400/20"
                  />
                </div>

                {/* Caffeine Amount & Category Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="popup-caffeine" className="text-sm font-medium text-foreground">
                      คาเฟอีน (mg) *
                    </Label>
                    <Input
                      id="popup-caffeine"
                      type="number"
                      min={0}
                      max={2000}
                      step={1}
                      placeholder="0"
                      value={caffeineAmount || ""}
                      onChange={(e) => setCaffeineAmount(Number(e.target.value) || 0)}
                      required
                      className="h-12 rounded-xl border-border/50 focus:border-warm-400 focus:ring-warm-400/20 font-mono text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="popup-category" className="text-sm font-medium text-foreground">
                      หมวดหมู่
                    </Label>
                    <Select value={category} onValueChange={(v) => setCategory(v as any)}>
                      <SelectTrigger id="popup-category" className="h-12 rounded-xl border-border/50 focus:border-warm-400">
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

                {/* Submit Button */}
                <Button 
                  type="submit"
                  disabled={!drinkName || caffeineAmount <= 0}
                  className="w-full h-13 golden-button rounded-xl text-base font-semibold py-6"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  เพิ่มในประวัติ
                </Button>

                {/* Helper Text */}
                <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                  💡 ไม่รู้ค่า? ค้นหา "caffeine in [ชื่อเครื่องดื่ม]"
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Close Button (only show when not in success state) */}
        {!showSuccess && (
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        )}
      </DialogContent>
    </Dialog>
  )
}
