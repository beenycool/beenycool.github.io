import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const KeyboardShortcuts = ({ open, onOpenChange }) => {
  // Detect platform (Mac vs Windows/Linux)
  const [platform, setPlatform] = React.useState('default');
  const [copied, setCopied] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('general');

  useEffect(() => {
    // Detect platform based on userAgent
    if (typeof navigator !== 'undefined') {
      setPlatform(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent) ? 'mac' : 'default');
    }
  }, []);

  // Get the command key symbol based on platform
  const cmdKey = platform === 'mac' ? '⌘' : 'Ctrl';
  const altKey = platform === 'mac' ? '⌥' : 'Alt';
  const shiftKey = platform === 'mac' ? '⇧' : 'Shift';

  const allShortcuts = {
    general: [
      { keys: [cmdKey, 'Enter'], description: 'Submit for marking' },
      { keys: [cmdKey, shiftKey, 'R'], description: 'Reset form' },
      { keys: [cmdKey, '.'], description: 'Toggle advanced options' },
      { keys: [cmdKey, '/'], description: 'Toggle help guide' },
      { keys: [cmdKey, 'K'], description: 'Toggle keyboard shortcuts' },
      { keys: ['Tab'], description: 'Navigate between form fields' },
      { keys: ['Esc'], description: 'Close popups/dialogs' },
    ],
    editing: [
      { keys: [cmdKey, 'A'], description: 'Select all text' },
      { keys: [cmdKey, 'Z'], description: 'Undo last change' },
      { keys: [cmdKey, shiftKey, 'Z'], description: 'Redo last change' },
      { keys: [cmdKey, 'X'], description: 'Cut selected text' },
      { keys: [cmdKey, 'C'], description: 'Copy selected text' },
      { keys: [cmdKey, 'V'], description: 'Paste from clipboard' },
    ],
    feedback: [
      { keys: [cmdKey, 'P'], description: 'Print feedback' },
      { keys: [cmdKey, 'S'], description: 'Save as PDF' },
      { keys: [cmdKey, shiftKey, 'C'], description: 'Copy feedback to clipboard' },
      { keys: [cmdKey, 'E'], description: 'Share via email' },
      { keys: ['1-9'], description: 'Switch between models' },
    ],
  };

  const copyAllShortcuts = () => {
    // Format shortcuts for copying
    const formattedShortcuts = Object.entries(allShortcuts)
      .map(([category, shortcuts]) => {
        return `## ${category.charAt(0).toUpperCase() + category.slice(1)} Shortcuts\n\n` + 
          shortcuts.map(s => `${s.keys.join(' + ')}: ${s.description}`).join('\n');
      })
      .join('\n\n');
    
    navigator.clipboard.writeText(formattedShortcuts);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Keyboard Shortcuts</span>
            <Badge variant="outline" className="ml-2">
              {platform === 'mac' ? 'macOS' : 'Windows/Linux'}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Use these shortcuts to work more efficiently with the AI Marker
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="mt-4" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="editing">Editing</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>
          
          {Object.entries(allShortcuts).map(([category, shortcuts]) => (
            <TabsContent key={category} value={category} className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{shortcut.description}</span>
                  <div className="flex items-center space-x-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <React.Fragment key={keyIndex}>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-xs font-mono">
                          {key}
                        </kbd>
                        {keyIndex < shortcut.keys.length - 1 && (
                          <span className="text-gray-500">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-4 flex justify-end">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center gap-1" 
            onClick={copyAllShortcuts}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied' : 'Copy All'}</span>
          </Button>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <p>Tip: You can press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-xs font-mono inline-block">{cmdKey}+K</kbd> anytime to open this shortcuts guide.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcuts; 