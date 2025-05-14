"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Keyboard as KeyboardIcon } from "lucide-react";

// Keyboard shortcut component
export function KeyboardShortcuts({ open, onOpenChange }) {
  const shortcuts = [
    { keys: ["Ctrl", "Enter"], description: "Submit for marking" },
    { keys: ["Ctrl", "Shift", "R"], description: "Reset form" },
    { keys: ["Ctrl", "."], description: "Toggle advanced options" },
    { keys: ["Ctrl", "/"], description: "Toggle help guide" },
    { keys: ["Ctrl", "K"], description: "Open shortcuts dialog" },
    { keys: ["Tab"], description: "Navigate between fields" },
    { keys: ["Esc"], description: "Close dialogs" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyboardIcon className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to quickly navigate and use the application.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800"
              >
                <span className="text-sm">{shortcut.description}</span>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((key, keyIndex) => (
                    <span key={keyIndex}>
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-xs">
                        {key}
                      </kbd>
                      {keyIndex < shortcut.keys.length - 1 && (
                        <span className="mx-1 text-gray-400">+</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 