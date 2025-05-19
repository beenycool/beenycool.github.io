"use client"

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Sparkles } from 'lucide-react'

const variants = {
  initial: { 
    opacity: 0, 
    y: -20, 
    scale: 0.95 
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    transition: { 
      duration: 0.2,
      ease: [0.4, 0, 1, 1]
    }
  }
}

export function ChessNotification({ 
  title, 
  message, 
  variant = "default", 
  open, 
  onClose,
  duration = 5000
}) {
  useEffect(() => {
    if (open && duration) {
      const timer = setTimeout(() => {
        onClose?.()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [open, duration, onClose])
  
  // Get the appropriate styles based on the variant
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
      case "error":
        return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800"
      case "info":
        return "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
      case "special":
        return "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800"
      case "epic":
        return "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/40 border-amber-200 dark:border-amber-800"
      case "danger":
        return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
      default:
        return "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
    }
  }
  
  // Special icon based on variant
  const getIcon = () => {
    if (variant === "special" || variant === "epic") {
      return <Sparkles className="h-5 w-5 text-yellow-500" />
    }
    return null
  }
  
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`fixed top-4 right-4 z-50 max-w-md rounded-lg border p-4 shadow-md ${getVariantStyles()}`}
          role="alert"
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="flex items-start gap-3">
            {getIcon()}
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-gray-50">
                {title}
              </h3>
              <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                {message}
              </div>
            </div>
            <button
              type="button"
              className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => onClose?.()}
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 