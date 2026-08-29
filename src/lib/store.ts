"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Drink } from "./caffeine-data"
import { calculateCaffeineLevel, getTimeToClear, CAFFEINE_CONSTANTS } from "./caffeine-data"

// ประเภทข้อมูล
export interface CaffeineEntry {
  id: string
  drink: Drink
  servingCount: number
  totalCaffeine: number // mg
  timestamp: number // Unix timestamp (ms)
  timeAdded: number // เวลาที่เพิ่ม (ms)
}

// Sensitivity levels
export type SensitivityLevel = "normal" | "sensitive" | "pregnant" | "custom"

// Gender options
export type Gender = "male" | "female" | "other" | "prefer_not_to_say"

export interface UserSettings {
  // Personal Info (NEW from design)
  firstName: string
  lastName: string
  gender: Gender
  age: number
  
  // Health Settings
  bodyWeight: number // kg
  sensitivityLevel: SensitivityLevel
  customLimit: number // mg (for custom sensitivity)
  sleepTime: string // HH:mm format
  notificationsEnabled: boolean
}

// ค่า default settings
const DEFAULT_SETTINGS: UserSettings = {
  // Personal Info
  firstName: "",
  lastName: "",
  gender: "prefer_not_to_say",
  age: 25,
  
  // Health Settings
  bodyWeight: 65, // kg
  sensitivityLevel: "normal",
  customLimit: 400,
  sleepTime: "23:00",
  notificationsEnabled: true,
}

// ค่า limit ตาม sensitivity level
export const SENSITIVITY_LIMITS = {
  normal: 400, // mg
  sensitive: 100, // mg
  pregnant: 200, // mg
} as const

// State types
interface CaffeineState {
  entries: CaffeineEntry[]
  settings: UserSettings
  
  // Actions - Entries
  addEntry: (drink: Drink, servingCount: number) => void
  removeEntry: (id: string) => void
  clearAllEntries: () => void
  
  // Actions - Settings
  updateSettings: (settings: Partial<UserSettings>) => void
  resetSettings: () => void
  
  // Computed values
  getTotalCaffeineToday: () => number
  getCurrentCaffeineLevel: () => number
  getEntriesToday: () => CaffeineEntry[]
  getSleepImpact: () => {
    canSleepNow: boolean
    caffeineAtBedtime: number
    recommendedStopTime: string
    hoursUntilSafe: number
  }
  getDailyProgress: () => {
    current: number
    limit: number
    percentage: number
    status: "safe" | "moderate" | "high" | "exceeded"
  }
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Get start of today in ms
function getStartOfToday(): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now.getTime()
}

export const useCaffeineStore = create<CaffeineState>()(
  persist(
    (set, get) => ({
      entries: [],
      settings: DEFAULT_SETTINGS,

      // Add entry
      addEntry: (drink, servingCount) => {
        const totalCaffeine = drink.caffeinePerServing * servingCount
        const entry: CaffeineEntry = {
          id: generateId(),
          drink,
          servingCount,
          totalCaffeine,
          timestamp: Date.now(),
          timeAdded: Date.now(),
        }
        
        set((state) => ({
          entries: [...state.entries, entry]
        }))
      },

      // Remove entry
      removeEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id)
        }))
      },

      // Clear all entries
      clearAllEntries: () => {
        set({ entries: [] })
      },

      // Update settings
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }))
      },

      // Reset settings
      resetSettings: () => {
        set({ settings: DEFAULT_SETTINGS })
      },

      // Get total caffeine today
      getTotalCaffeineToday: () => {
        const state = get()
        const todayStart = getStartOfToday()
        return state.entries
          .filter((e) => e.timestamp >= todayStart)
          .reduce((sum, e) => sum + e.totalCaffeine, 0)
      },

      // Get current caffeine level (considering decay)
      getCurrentCaffeineLevel: () => {
        const state = get()
        const now = Date.now()
        let totalLevel = 0

        state.entries.forEach((entry) => {
          const minutesElapsed = (now - entry.timestamp) / (1000 * 60)
          if (minutesElapsed >= 0) {
            totalLevel += calculateCaffeineLevel(entry.totalCaffeine, minutesElapsed)
          }
        })

        return totalLevel
      },

      // Get today's entries
      getEntriesToday: () => {
        const state = get()
        const todayStart = getStartOfToday()
        return state.entries
          .filter((e) => e.timestamp >= todayStart)
          .sort((a, b) => b.timestamp - a.timestamp)
      },

      // Get sleep impact analysis
      getSleepImpact: () => {
        const state = get()
        const [sleepHour, sleepMin] = state.settings.sleepTime.split(":").map(Number)
        const now = new Date()
        
        // Calculate bedtime today
        const bedtime = new Date(now)
        bedtime.setHours(sleepHour, sleepMin, 0, 0)
        
        // If already past bedtime, use tomorrow's bedtime
        if (bedtime.getTime() <= now.getTime()) {
          bedtime.setDate(bedtime.getDate() + 1)
        }

        const msUntilBedtime = bedtime.getTime() - now.getTime()
        const minutesUntilBedtime = msUntilBedtime / (1000 * 60)

        // Calculate caffeine at bedtime
        let caffeineAtBedtime = 0
        state.entries.forEach((entry) => {
          const minutesFromEntryToBedtime = 
            (bedtime.getTime() - entry.timestamp) / (1000 * 60)
          if (minutesFromEntryToBedtime > 0) {
            caffeineAtBedtime += calculateCaffeineLevel(
              entry.totalCaffeine, 
              minutesFromEntryToBedtime
            )
          }
        })

        // Find when caffeine will be below threshold (<50mg for good sleep)
        const SLEEP_THRESHOLD = 50
        let hoursUntilSafe = 0
        for (let h = 0; h <= 12; h++) {
          let futureCaffeine = 0
          const futureTime = new Date(now.getTime() + h * 60 * 60 * 1000)
          
          state.entries.forEach((entry) => {
            const minutesElapsed = (futureTime.getTime() - entry.timestamp) / (1000 * 60)
            if (minutesElapsed > 0) {
              futureCaffeine += calculateCaffeineLevel(entry.totalCaffeine, minutesElapsed)
            }
          })

          if (futureCaffeine < SLEEP_THRESHOLD) {
            hoursUntilSafe = h
            break
          }
          hoursUntilSafe = h
        }

        // Recommended stop time
        const recommendedStopTime = new Date(
          bedtime.getTime() - (hoursUntilSafe || 6) * 60 * 60 * 1000
        )
        const recHours = recommendedStopTime.getHours().toString().padStart(2, '0')
        const recMins = recommendedStopTime.getMinutes().toString().padStart(2, '0')

        return {
          canSleepNow: caffeineAtBedtime < SLEEP_THRESHOLD,
          caffeineAtBedtime: Math.round(caffeineAtBedtime),
          recommendedStopTime: `${recHours}:${recMins}`,
          hoursUntilSafe: Math.ceil(hoursUntilSafe),
        }
      },

      // Get daily progress
      getDailyProgress: () => {
        const state = get()
        const current = state.getTotalCaffeineToday()
        
        // Determine limit based on sensitivity
        let limit: number
        switch (state.settings.sensitivityLevel) {
          case "sensitive":
            limit = SENSITIVITY_LIMITS.sensitive
            break
          case "pregnant":
            limit = SENSITIVITY_LIMITS.pregnant
            break
          case "custom":
            limit = state.settings.customLimit
            break
          default:
            limit = SENSITIVITY_LIMITS.normal
        }

        // Adjust for body weight (roughly 5.7mg/kg is considered safe upper limit)
        const weightAdjustedLimit = Math.min(limit, state.settings.bodyWeight * 5.7)
        const effectiveLimit = Math.min(limit, weightAdjustedLimit)

        const percentage = (current / effectiveLimit) * 100
        
        let status: "safe" | "moderate" | "high" | "exceeded"
        if (percentage < 50) status = "safe"
        else if (percentage < 75) status = "moderate"
        else if (percentage < 100) status = "high"
        else status = "exceeded"

        return {
          current: Math.round(current),
          limit: Math.round(effectiveLimit),
          percentage: Math.round(percentage),
          status,
        }
      },
    }),
    {
      name: "caffeine-calculator-storage",
      version: 1,
    }
  )
)
