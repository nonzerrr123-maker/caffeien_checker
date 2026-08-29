"use client";

import * as React from "react";
import { CaffeineCalculator } from "@/components/caffeine-calculator";
import { CaffeineChart } from "@/components/caffeine-chart";
import { Timeline } from "@/components/timeline";
import { SleepImpact } from "@/components/sleep-impact";
import { SettingsPanel } from "@/components/settings-panel";
import { CustomInput } from "@/components/custom-input";
import { AddCaffeinePopup } from "@/components/add-caffeine-popup";
import { ComparisonMode } from "@/components/comparison-mode";
import { ShareExport } from "@/components/share-export";
import { HealthEffects } from "@/components/health-effects";
import { ToleranceTracker } from "@/components/tolerance-tracker";
import { Insights } from "@/components/insights";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCaffeineStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Coffee,
  Sun,
  Clock,
  BookOpen,
  History,
  Moon,
  Settings,
  GitCompareArrows,
  Share2,
  Zap,
  Activity,
  Shield,
  Sparkles,
  User,
  Plus,
  ChevronUp,
  X,
  Trash2,
  MinusCircle,
  ChevronRight,
  Heart,
  TrendingUp,
} from "lucide-react";

// Tab types - simplified
type TabId =
  | "today"
  | "timeline"
  | "health"
  | "sleep"
  | "settings"
  | "compare"
  | "share"
  | "tolerance"
  | "insights";

interface TabConfig {
  id: TabId;
  icon: React.ReactNode;
  label: string;
  badge?: number | string;
}

export default function Home() {
  const [activeTab, setActiveTab] = React.useState<TabId>("today");
  const [showAddPopup, setShowAddPopup] = React.useState(false);
  const [popupMode, setPopupMode] = React.useState<"calculator" | "custom">(
    "calculator",
  );
  const [showChart, setShowChart] = React.useState(false);
  const [lastAddedAmount, setLastAddedAmount] = React.useState(0);
  const [showEntriesList, setShowEntriesList] = React.useState(false);

  const {
    getEntriesToday,
    getTotalCaffeineToday,
    getDailyProgress,
    getCurrentCaffeineLevel,
    removeEntry,
    settings,
    entries,
  } = useCaffeineStore();

  // Real-time caffeine level (updates every second for decay visualization)
  const [currentLevel, setCurrentLevel] = React.useState(0);

  React.useEffect(() => {
    const updateLevel = () => {
      setCurrentLevel(getCurrentCaffeineLevel());
    };

    // Update immediately
    updateLevel();

    // Then update every 30 seconds for decay
    const interval = setInterval(updateLevel, 30000);
    return () => clearInterval(interval);
  }, [entries, getCurrentCaffeineLevel]);

  const todayEntries = getEntriesToday();
  const todayCount = todayEntries.length;
  const totalCaffeine = getTotalCaffeineToday();
  const dailyProgress = getDailyProgress();

  // Bottom Navigation Tabs - Icon Only (fits in one line)
  const navTabs: TabConfig[] = [
    {
      id: "today",
      icon: <Sun className="h-5 w-5" />,
      label: "วันนี้",
      badge: totalCaffeine > 0 ? `${Math.round(totalCaffeine)}` : undefined,
    },
    {
      id: "timeline",
      icon: <History className="h-5 w-5" />,
      label: "ประวัติ",
      badge: todayCount > 0 ? todayCount : undefined,
    },
    { id: "health", icon: <Activity className="h-5 w-5" />, label: "สุขภาพ" },
    { id: "sleep", icon: <Moon className="h-5 w-5" />, label: "การนอน" },
    {
      id: "settings",
      icon: <Settings className="h-5 w-5" />,
      label: "ตั้งค่า",
    },
  ];

  // More tabs (accessible via settings or swipe)
  const moreTabs: TabConfig[] = [
    {
      id: "compare",
      icon: <GitCompareArrows className="h-4 w-4" />,
      label: "เปรียบเทียบ",
    },
    { id: "share", icon: <Share2 className="h-4 w-4" />, label: "แชร์" },
    {
      id: "tolerance",
      icon: <Shield className="h-4 w-4" />,
      label: "Tolerance",
    },
    {
      id: "insights",
      icon: <Sparkles className="h-4 w-4" />,
      label: "Insights",
    },
  ];

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "today":
        return (
          <TodayDashboard
            onOpenAddPopup={(mode) => {
              setPopupMode(mode);
              setShowAddPopup(true);
            }}
            showChart={showChart}
            lastAddedAmount={lastAddedAmount}
            currentLevel={currentLevel}
            showEntriesList={showEntriesList}
            setShowEntriesList={setShowEntriesList}
          />
        );
      case "timeline":
        return <Timeline />;
      case "sleep":
        return <SleepImpact />;
      case "settings":
        return <SettingsPanel />;
      case "compare":
        return <ComparisonMode />;
      case "share":
        return <ShareExport caffeineAmount={totalCaffeine} />;
      case "health":
        return <HealthEffects />;
      case "tolerance":
        return <ToleranceTracker />;
      case "insights":
        return <Insights />;
      default:
        return (
          <TodayDashboard
            onOpenAddPopup={(mode) => {
              setPopupMode(mode);
              setShowAddPopup(true);
            }}
            showChart={showChart}
            lastAddedAmount={lastAddedAmount}
            currentLevel={currentLevel}
            showEntriesList={showEntriesList}
            setShowEntriesList={setShowEntriesList}
          />
        );
    }
  };

  // Today Dashboard Component with Popup integration
  function TodayDashboard({
    onOpenAddPopup,
    showChart,
    lastAddedAmount,
    currentLevel,
    showEntriesList,
    setShowEntriesList,
  }: {
    onOpenAddPopup: (mode: "calculator" | "custom") => void;
    showChart: boolean;
    lastAddedAmount: number;
    currentLevel: number;
    showEntriesList: boolean;
    setShowEntriesList: (show: boolean) => void;
  }) {
    const percentage = Math.min(
      (totalCaffeine / dailyProgress.limit) * 100,
      100,
    );
    const circumference = 2 * Math.PI * 70;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="space-y-5">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Caffeine Checker
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              จัดการพลังงานของคุณให้สมดุล
            </p>
          </div>

          {/* Profile Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warm-400 to-warm-500 flex items-center justify-center text-white font-semibold shadow-lg">
              {settings.firstName ? (
                settings.firstName.charAt(0).toUpperCase()
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background"></div>
          </div>
        </div>

        {/* Today's Consumption Card */}
        <Card className="warm-card overflow-hidden border-0">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  กำลังบริโภค:วันนี้
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  ขีดจำกัด {dailyProgress.limit} มก. ต่อวัน
                </p>
              </div>
              <Badge
                variant="secondary"
                className="bg-warm-100 text-warm-600 hover:bg-warm-200 px-3 py-1"
              >
                อัปเดต:ชั่วโมง
              </Badge>
            </div>

            {/* Circular Progress */}
            <div className="flex justify-center py-6">
              <div className="relative">
                <svg width="160" height="160" className="progress-ring">
                  <circle
                    cx="80"
                    cy="80"
                    r="72"
                    fill="none"
                    stroke="#F5F0E8"
                    strokeWidth="8"
                    opacity="0.5"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="72"
                    fill="none"
                    stroke={
                      dailyProgress.status === "exceeded"
                        ? "#DC2626"
                        : "#B8860B"
                    }
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="progress-ring-circle"
                    style={{
                      filter: "drop-shadow(0 2px 4px rgba(184, 134, 11, 0.3))",
                    }}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className={`text-4xl sm:text-5xl font-bold ${
                      dailyProgress.status === "exceeded"
                        ? "text-red-500"
                        : "text-warm-500"
                    }`}
                  >
                    {Math.round(totalCaffeine)}
                  </span>
                  <span className="text-sm text-muted-foreground mt-1">
                    มิลลิกรัม
                  </span>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              {dailyProgress.status === "exceeded"
                ? "⚠️ เกินขีดจำกัดแล้ว ควรหยุดดื่ม"
                : dailyProgress.status === "high"
                  ? "📊 ใกล้เกินขีดจำกัดแล้ว"
                  : dailyProgress.status === "moderate"
                    ? "✅ ยังอยู่ในเกณฑ์ปลอดภัย"
                    : "🌟 เริ่มต้นวันที่ดี"}
            </p>
            <p className="text-center text-xs text-muted-foreground mt-2">
              โอกาสเตือนการบริโภคเกินขีดจำกัด
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions - Open Popup */}
        <div className="grid grid-cols-2 gap-3">
          <Card
            className="warm-card overflow-hidden border-0 cursor-pointer hover:scale-[1.02] transition-transform active:scale-[0.98]"
            onClick={() => onOpenAddPopup("calculator")}
          >
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-warm-400 to-warm-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Coffee className="h-7 w-7 text-white" />
              </div>
              <span className="font-medium text-sm text-foreground mt-1">
                เลือกเครื่องดื่ม
              </span>
              <span className="text-xs text-muted-foreground">
                กาแฟ ชา มัทฉะ
              </span>
            </CardContent>
          </Card>

          <Card
            className="warm-card overflow-hidden border-0 cursor-pointer hover:scale-[1.02] transition-transform active:scale-[0.98]"
            onClick={() => onOpenAddPopup("custom")}
          >
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Edit3 className="h-7 w-7 text-white" />
              </div>
              <span className="font-medium text-sm text-foreground mt-1">
                กรอกเอง
              </span>
              <span className="text-xs text-muted-foreground">กำหนดค่าเอง</span>
            </CardContent>
          </Card>
        </div>

        {/* Today's Entries List - Real-time management */}
        {todayCount > 0 && (
          <Card className="warm-card overflow-hidden border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Clock className="h-5 w-5 text-warm-500" />
                  รายการวันนี้
                  <Badge
                    variant="secondary"
                    className="bg-warm-100 text-warm-600"
                  >
                    {todayCount} รายการ
                  </Badge>
                </h3>
                <button
                  onClick={() => setShowEntriesList(!showEntriesList)}
                  className="text-sm text-warm-500 hover:text-warm-600 font-medium flex items-center gap-1 transition-colors"
                >
                  {showEntriesList ? "ซ่อน" : "ดูทั้งหมด"}
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${showEntriesList ? "rotate-90" : ""}`}
                  />
                </button>
              </div>

              {/* Collapsible Entries */}
              {showEntriesList ? (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {todayEntries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-3 p-3 rounded-xl bg-background border border-border/30 group hover:border-warm-300 transition-all ${index === 0 ? "ring-2 ring-warm-200" : ""}`}
                    >
                      <span className="text-xl">{entry.drink.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {entry.drink.nameTh}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleTimeString(
                            "th-TH",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary font-mono font-bold"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          {entry.totalCaffeine.toFixed(0)}mg
                        </Badge>
                        <button
                          onClick={() => removeEntry(entry.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Compact view - just latest entry */
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-warm-50 to-orange-50/50 dark:from-warm-900/20 dark:to-orange-900/10 border border-warm-200/30">
                  <span className="text-2xl">
                    {todayEntries[0]?.drink.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {todayEntries[0]?.drink.nameTh}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ล่าสุด •{" "}
                      {new Date(
                        todayEntries[0]?.timestamp || 0,
                      ).toLocaleTimeString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Badge className="bg-gradient-to-r from-warm-400 to-warm-500 text-white font-mono font-bold">
                    +{todayEntries[0]?.totalCaffeine.toFixed(0)}mg
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Current Level Indicator - Real-time */}
        {totalCaffeine > 0 && (
          <Card className="warm-card overflow-hidden border-0 bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-950/20 dark:via-purple-950/10 dark:to-indigo-950/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-purple-500" />
                  ระดับคาเฟอีนตอนนี้
                </h4>
                <Badge variant="outline" className="text-xs font-mono">
                  ⚡ {Math.round(currentLevel)} mg
                </Badge>
              </div>

              {/* Progress bar showing decay */}
              <div className="relative h-2 bg-white/60 dark:bg-black/20 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${Math.min((currentLevel / totalCaffeine) * 100, 100)}%`,
                  }}
                />
              </div>

              <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
                💡 คาเฟอีนลดลงเรื่องๆ ตามเวลา (half-life ~5 ชม.)
              </p>
            </CardContent>
          </Card>
        )}

        {/* Chart Section - Shows after adding caffeine or when there are entries */}
        {(showChart && lastAddedAmount > 0) || totalCaffeine > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-warm-500" />
                กราฟคาเฟอีน
              </h3>
              <Badge variant="secondary" className="bg-warm-100 text-warm-600">
                📊 พยากรณ์ 12 ชม.
              </Badge>
            </div>
            <CaffeineChart
              caffeineAmount={Math.max(lastAddedAmount, totalCaffeine)}
              showCurrentTime={true}
            />
          </div>
        ) : null}

        {/* Know Caffeine Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground text-base">
              รู้จักคาเฟอีน
            </h3>
            <button
              onClick={() => setActiveTab("health")}
              className="text-sm text-warm-500 hover:text-warm-600 font-medium transition-colors"
            >
              ดูทั้งหมด →
            </button>
          </div>

          <Card
            className="warm-card overflow-hidden border-0 bg-gradient-to-br from-warm-50 to-warm-100 dark:from-warm-900/20 dark:to-warm-800/20 cursor-pointer hover:scale-[1.01] transition-transform"
            onClick={() => setActiveTab("health")}
          >
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-warm-200/60 dark:bg-warm-700/40 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-warm-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground text-sm">
                    คาเฟอีน คือ อะไร?
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    สารกระตุ้นระบบประสาทส่วนกลาง พบในกาแฟ ชา โกโก้
                    ช่วยเพิ่มความตื่นและสมาธิ
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-warm-200/50 dark:border-warm-700/30">
                📚 เรียนรู้เพิ่มเติมเกี่ยวกับผลกระทบของคาเฟอีนต่อร่างกาย →
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col warm-gradient">
      {/* Add Caffeine Popup */}
      <AddCaffeinePopup
        open={showAddPopup}
        onOpenChange={(open) => {
          setShowAddPopup(open);
          // Show chart when popup closes (after successful add)
          if (!open && entries.length > 0) {
            const latestEntry = entries[entries.length - 1];
            setLastAddedAmount(latestEntry.totalCaffeine);
            setShowChart(true);
          }
        }}
        mode={popupMode}
        onModeChange={setPopupMode}
      />

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 container mx-auto px-4 pt-4 pb-24 max-w-2xl overflow-y-auto">
        <div className="animate-in fade-in duration-200">
          {renderTabContent()}
        </div>
      </main>

      {/* Bottom Navigation Bar - Fixed at Bottom (Both Mobile & Desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border/50 safe-area-inset-bottom">
        <div className="container mx-auto max-w-2xl px-2 pb-[env(safe-area-inset-bottom)]">
          {/* Icon-Only Navigation - Fits in one line */}
          <div className="flex items-center justify-around py-2">
            {navTabs.map((tab) => (
              <BottomNavItem
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === tab.id}
                badge={tab.badge}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}

            {/* More Menu (for additional features) */}
            <BottomNavMoreButton
              moreTabs={moreTabs}
              activeTab={activeTab}
              onSelectTab={(id) => setActiveTab(id as TabId)}
            />
          </div>
        </div>
      </nav>
    </div>
  );
}

// Bottom Nav Item Component - Icon Only
function BottomNavItem({
  icon,
  label,
  isActive,
  onClick,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  badge?: number | string;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center gap-1 py-2 px-3 min-w-[56px] group"
    >
      <div
        className={`relative p-2 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        }`}
      >
        {icon}

        {/* Badge */}
        {badge !== undefined && (
          <span
            className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-[9px] font-bold flex items-center justify-center px-1 ${
              isActive
                ? "bg-primary-foreground text-primary"
                : "bg-red-500 text-white"
            }`}
          >
            {typeof badge === "number" && badge > 99 ? "99+" : badge}
          </span>
        )}
      </div>

      {/* Tooltip on Desktop */}
      <span className="hidden lg:block absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {label}
      </span>
    </button>
  );
}

// More Menu Button Component
function BottomNavMoreButton({
  moreTabs,
  activeTab,
  onSelectTab,
}: {
  moreTabs: TabConfig[];
  activeTab: TabId;
  onSelectTab: (id: TabId) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Check if any more tab is active
  const isMoreActive = moreTabs.some((t) => t.id === activeTab);

  React.useEffect(() => {
    if (!moreTabs.find((t) => t.id === activeTab)) {
      setIsOpen(false);
    }
  }, [activeTab]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all duration-200 ${
          isMoreActive || isOpen
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        }`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>

        {isMoreActive && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-foreground rounded-full"></span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[-1]"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute bottom-full right-0 mb-2 w-48 bg-card rounded-xl shadow-xl border border-border py-2 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
            <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              เมนูเพิ่มเติม
            </div>
            {moreTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onSelectTab(tab.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors text-left ${
                  activeTab === tab.id
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Edit3 icon import helper
function Edit3({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}
