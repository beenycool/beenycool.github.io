"use client";
import * as React from 'react';
import { useState, useEffect, useCallback, useRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import 'katex/dist/katex.min.css'; // Add import for KaTeX CSS
import remarkMath from 'remark-math'; // Add import for remark-math plugin
import rehypeKatex from 'rehype-katex'; // Add import for rehype-katex plugin
import { getSubjectGuidance } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { SelectItem as SelectItem } from "@/components/ui/select"; // Changed alias to SelectItem
import { Loader2, Upload, AlertTriangle, CheckCircle2, RefreshCw, HelpCircle, ChevronDown, ChevronRight, Save, Share2, ExternalLink, Settings, FilePlus, ChevronUp, Zap, X, Keyboard, Pause } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import debounce from 'lodash.debounce';
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { 
  Copy, Mail, Twitter, Facebook, Download, 
  Printer, Code
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSubjectDetection, useBackendStatus } from './aimarker-hooks';
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";
import { Info, Maximize, Minimize, Moon, Sun, UploadCloud, User } from "lucide-react"; // Added Maximize, Minimize, Moon, Sun, UploadCloud, User
import { useHotkeys } from "react-hotkeys-hook";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"; // ADDED Dialog for OCR Preview
import Papa from 'papaparse'; // Import PapaParse

// Import API helper functions from separate file
import { getApiBaseUrl, constructApiUrl, isGitHubPages as isGHPagesHelper } from '@/lib/api-helpers'; // Renamed import

// API URL for our backend
// NEXT_PUBLIC_API_BASE_URL should be set in your environment variables.
// For GitHub Pages, it should point to your Render backend.
// For local development, it can point to your local backend.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3003'; // Fallback for local if not set

// Determine if running on GitHub Pages using the helper
const isGHPages = isGHPagesHelper();

// Constants moved to a separate section for easier management
const HISTORY_LIMIT = 10; // Define the maximum number of history items to keep

const SUBJECTS = [ 
  { value: "english", label: "English" }, 
  { value: "maths", label: "Maths", hasTiers: true }, 
  { value: "science", label: "Science", hasTiers: true }, 
  { value: "history", label: "History" }, 
  { value: "geography", label: "Geography" }, 
  { value: "computerScience", label: "Computer Science" }, 
  { value: "businessStudies", label: "Business Studies" }];

const EXAM_BOARDS = [
  { value: "aqa", label: "AQA" },
  { value: "edexcel", label: "Edexcel" },
  { value: "ocr", label: "OCR" },
  { value: "wjec", label: "WJEC" }
];

const USER_TYPES = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" }
];

const AI_MODELS = [
  { value: "o3", label: "O3", description: "Most powerful model, but heavily rate limited." },
  { value: "o4-mini", label: "O4 Mini", description: "Delivers compareable performance to o3, but much faster" },
  { value: "xai/grok-3", label: "Grok-3", description: "X AI Model (Grok)" },
  { value: "xai/grok-3-mini", label: "Grok-3 Mini", description: "Smaller, faster X AI Model" },
  { value: "gemini-2.5-flash-preview-05-20", label: "Gemini 2.5 Flash Preview", description: "Best quality with faster response times" },
  { value: "microsoft/mai-ds-r1:free", label: "R1 (thinking model)", description: "Most thorough reasoning process (may take 1-2 minutes)" }, // Unlimited (OpenRouter, no usage limits)
  { value: "deepseek/deepseek-chat-v3-0324:free", label: "V3 (balanced model)", description: "Balanced speed and quality" },
  { value: "google/gemini-2.0-flash-exp:free", label: "Gemini 2.0 Flash (OCR only)", description: "Special model for OCR with exam board OCR" }
];

// Add fallback models for when primary models are rate limited
const FALLBACK_MODELS = {
  "gemini-2.5-flash-preview-05-20": "deepseek/deepseek-chat-v3-0324:free",
  "deepseek/deepseek-chat-v3-0324:free": "microsoft/mai-ds-r1:free",
  "microsoft/mai-ds-r1:free": "gemini-2.5-flash-preview-05-20", // Fallback to Gemini Flash (was Gemini Pro)
  "o3": "o4-mini", // Fallback for O3
  "o4-mini": "deepseek/deepseek-chat-v3-0324:free", // Fallback for O4 Mini
  "xai/grok-3": "deepseek/deepseek-chat-v3-0324:free", // Fallback for Grok-3
  "google/gemini-2.0-flash-exp:free": "deepseek/deepseek-chat-v3-0324:free" // Fallback for Gemini 2.0 Flash
};

// Define model-specific rate limits (in milliseconds)
// Based on GitHub Copilot Pro rate limits
const MODEL_RATE_LIMITS = {
  // Standard models
  "gemini-2.5-flash-preview-05-20": 60000, // 1 minute
  "deepseek/deepseek-chat-v3-0324:free": 10000, // 10 seconds
  
  // DeepSeek-R1 and MAI-DS-R1: 1 request per minute
  "microsoft/mai-ds-r1:free": 60000, // 1 minute
  
  // OpenRouter Masr1
  "openrouter/masr1": 30000, // 30 seconds
  
  // Models with 8k/4k token limits
  "o3": 60000, // 1 minute
  "o4-mini": 30000, // 30 seconds
  "o4": 60000, // 1 minute
  
  // xAI Grok-3
  "xai/grok-3": 60000, // 1 minute
  
  // Gemini 2.0 Flash (for OCR only)
  "google/gemini-2.0-flash-exp:free": 60000 // 1 minute
};

// Define specific models for specific tasks
const TASK_SPECIFIC_MODELS = {
  "image_processing": {
    "default": "gemini-2.5-flash-preview-05-20",
    "ocr": "google/gemini-2.0-flash-exp:free" // Special case for OCR exam board
  },
  "subject_assessment": "gemini-2.5-flash-preview-05-20" // Use Gemini 2.5 Flash for subject assessments
};

// Define default thinking budgets for models that support it
const DEFAULT_THINKING_BUDGETS = {
  "gemini-2.5-flash-preview-05-20": 1024,
  "microsoft/mai-ds-r1:free": 0,
  "o3": 4000,
  "o4-mini": 4000,
  "xai/grok-3": 2048,
  "google/gemini-2.0-flash-exp:free": 1024
};

const subjectKeywords = {
  english: ['shakespeare', 'poem', 'poetry', 'novel', 'character', 'theme', 'literature'],
  maths: ['equation', 'solve', 'calculate', 'algebra', 'geometry', 'trigonometry', 'formula'],
  science: ['experiment', 'hypothesis', 'cell', 'atom', 'energy', 'physics', 'chemistry', 'biology'],
  history: ['war', 'battle', 'king', 'queen', 'century', 'revolution', 'empire', 'historical'],
  geography: ['map', 'climate', 'population', 'country', 'city', 'river', 'mountain', 'ecosystem'],
  computerScience: ['programming', 'algorithm', 'code', 'computer', 'software', 'hardware'],
  businessStudies: ['business', 'market', 'finance', 'profit', 'enterprise', 'economy']
};

// Add question types for English subject
const QUESTION_TYPES = {
  english: {
    aqa: [
      { value: "general", label: "General Assessment" },
      { value: "paper1q3", label: "Paper 1, Question 3 (Structure)" },
      { value: "paper1q4", label: "Paper 1, Question 4 (Evaluation)" },
      { value: "paper2q2", label: "Paper 2, Question 2 (Summary)" },
      { value: "paper2q5", label: "Paper 2, Question 5 (Writing)" }
    ],
    edexcel: [
      { value: "general", label: "General Assessment" }
    ],
    ocr: [
      { value: "general", label: "General Assessment" }
    ],
    wjec: [
      { value: "general", label: "General Assessment" }
    ]
  }
};

// Simple placeholder function since we removed the test button
const testMarkSchemeGeneration = () => {
  toast.info("Test generation functionality has been removed");
};

// Add function to automatically detect total marks from question
const detectTotalMarksFromQuestion = (questionText) => {
  if (!questionText) return null;
  
  // Common patterns for total marks in GCSE questions
  const patterns = [
    /\[(\d+) marks?\]/i,                 // [8 marks]
    /\((\d+) marks?\)/i,                 // (8 marks)
    /worth (\d+) marks?/i,               // worth 8 marks
    /for (\d+) marks?/i,                 // for 8 marks
    /total (?:of )?(\d+) marks?/i,       // total of 8 marks
    /\[Total:? (\d+)(?:\s*marks?)?\]/i,  // [Total: 8] or [Total: 8 marks]
    /\(Total:? (\d+)(?:\s*marks?)?\)/i,  // (Total: 8) or (Total: 8 marks)
    /^(\d+) marks?:?/i,                  // 8 marks: at start of line
    /\[(\d+)(?:\s*m)\]/i,                // [8m]
    /\((\d+)(?:\s*m)\)/i                 // (8m)
  ];
  
  for (const pattern of patterns) {
    const match = questionText.match(pattern);
    if (match && match[1]) {
      const marks = parseInt(match[1]);
      if (!isNaN(marks) && marks > 0) {
        console.log(`Detected ${marks} total marks from question`);
        
        // Show a toast notification to inform the user
        if (typeof toast !== 'undefined') {
          toast.info(`Automatically detected ${marks} total marks from the question`);
        }
        
        return marks.toString();
      }
    }
  }
  
  return null;
};

// Helper function to copy feedback to clipboard
const copyFeedbackToClipboard = (feedback) => {
  if (feedback) {
    navigator.clipboard.writeText(feedback);
    alert("Feedback copied to clipboard!");
  }
};

// Enhanced Backend Status Checker Component
const BackendStatusChecker = ({ onStatusChange }) => {
  const [status, setStatus] = useState('checking'); // 'checking', 'online', 'offline', 'error', 'rate_limited', 'waking_up'
  const [statusDetail, setStatusDetail] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [wakeupProgress, setWakeupProgress] = useState(0);
  const [wakeupAttempts, setWakeupAttempts] = useState(0);
  const wakeupTimerRef = useRef(null);
  const { checkBackendStatus } = useBackendStatus(API_BASE_URL);
  
  const checkStatus = useCallback(async () => {
    try {
      setStatus('checking');
      
      // Check if the backend is reachable
      const result = await checkBackendStatus();
      setLastChecked(new Date().toLocaleTimeString());
      
      if (!result.ok) {
        // If it's a timeout, assume the server is waking up
        if (result.status === 'timeout') {
          setStatus('waking_up');
          setStatusDetail('Server is waking up...');
          setIsWakingUp(true);
          setWakeupProgress(0);
          
          // Start a progress timer for visual feedback - max 50 seconds for wakeup
          clearInterval(wakeupTimerRef.current);
          wakeupTimerRef.current = setInterval(() => {
            setWakeupProgress(prev => {
              const newProgress = prev + 2; // Increment by 2% every second
              if (newProgress >= 100) {
                clearInterval(wakeupTimerRef.current);
                return 100;
              }
              return newProgress;
            });
          }, 1000);
          
          // Schedule an automatic recheck after 10 seconds
          setTimeout(() => {
            checkStatus();
          }, 10000);
        } else {
          setStatus(result.status || 'error');
          setStatusDetail(result.error);
          setIsWakingUp(false);
          clearInterval(wakeupTimerRef.current);
        }
        
        if (onStatusChange) onStatusChange(result.status || 'error', result.data);
        
        // Store status in window object for other components to access
        if (typeof window !== 'undefined') {
          window.BACKEND_STATUS = { 
            status: result.status || 'error', 
            lastChecked: new Date().toLocaleTimeString() 
          };
        }
        
        return;
      }
      
      // All checks passed
      setStatus('online');
      setStatusDetail(null);
      setIsWakingUp(false);
      setWakeupAttempts(0);
      clearInterval(wakeupTimerRef.current);
      
      // Store status in window object for other components to access
      if (typeof window !== 'undefined') {
        window.BACKEND_STATUS = { 
          status: 'online', 
          lastChecked: new Date().toLocaleTimeString() 
        };
      }
      
      if (onStatusChange) onStatusChange('online', result.data);
      
    } catch (error) {
      console.error('Backend status check failed:', error);
      
      if (error.name === 'AbortError') {
        setStatus('timeout');
        setStatusDetail('Connection timed out');
      } else {
        setStatus('error');
        setStatusDetail(error.message);
      }
      
      // Store status in window object
      if (typeof window !== 'undefined') {
        window.BACKEND_STATUS = { 
          status: error.name === 'AbortError' ? 'timeout' : 'error',
          lastChecked: new Date().toLocaleTimeString(),
          error: error.message
        };
      }
      
      if (onStatusChange) onStatusChange(error.name === 'AbortError' ? 'timeout' : 'error');
    }
  }, [checkBackendStatus, onStatusChange]);
  
  // Automatic status check on component mount
  useEffect(() => {
    checkStatus();
    
    // Set up interval to check status every 60 seconds
    const intervalId = setInterval(() => {
      checkStatus();
    }, 60000);
    
    return () => {
      clearInterval(intervalId);
      clearInterval(wakeupTimerRef.current);
    };
  }, [checkStatus]);
  
  // Manual refresh handler
  const handleRefresh = useCallback(() => {
    checkStatus();
  }, [checkStatus]);
  
  // Skip rendering if online
  if (status === 'online') return null;
  
  // Render a prominent notification when backend is offline
  return (
    <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-300">
              {status === 'waking_up' ? 'Backend Server is Starting Up' : 'Backend Server is Offline'}
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              {status === 'waking_up' 
                ? 'This can take up to 30-60 seconds as the server initializes.'
                : 'The backend server is currently offline. Click the button to wake it up.'}
            </p>
          </div>
        </div>
        
        <div className="w-full sm:w-auto">
          <Button
            onClick={handleRefresh}
            disabled={isWakingUp && wakeupProgress < 95}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white"
          >
            {isWakingUp ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Waking Up... ({Math.min(wakeupProgress, 95)}%)
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                {wakeupAttempts > 0 ? 'Try Again' : 'Wake Up API'}
              </>
            )}
          </Button>
        </div>
      </div>
      
      {isWakingUp && (
        <div className="mt-3">
          <div className="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2.5">
            <div 
              className="bg-amber-500 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(wakeupProgress, 95)}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {statusDetail && (
        <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
          Details: {statusDetail}
        </p>
      )}
      
      <p className="mt-3 text-xs text-amber-700 dark:text-amber-400 italic">
        The backend API automatically spins down after periods of inactivity to save resources. 
        This is why it may take up to a minute to "wake up" when you first visit the site.
      </p>
    </div>
  );
};

// Add a better success alert component with animations
const EnhancedAlert = ({ success, error, onRetryAction }) => { // Added onRetryAction prop
  if (!success && !error) return null;

  if (success) {
    return (
      <Alert className="mb-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle className="text-green-800 dark:text-green-300 ml-2">Success</AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-400 ml-2">
          {success.message}
        </AlertDescription>
      </Alert>
    );
  }

  // For error messages
  const isApiError = error.type === 'api_error' || error.message?.includes('API') || error.message?.includes('backend');
  const isRateLimited = error.type?.startsWith('rate_limit') || error.message?.includes('rate limit') || error.message?.toLowerCase().includes('too many requests');
  
  let title = 'Error';
  if (isApiError) title = 'API Error';
  else if (error.type === 'rate_limit_with_fallback') title = 'Rate Limited (Fallback Available)';
  else if (error.type === 'rate_limit_wait') title = 'Rate Limited (Please Wait)';
  else if (isRateLimited) title = 'Rate Limited';
  
  return (
    <Alert className={`mb-4 ${
      isRateLimited 
        ? 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-900' 
        : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900'
    }`}>
      {isRateLimited 
        ? <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        : <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
      }
      <AlertTitle className={`${
        isRateLimited 
          ? 'text-amber-800 dark:text-amber-300' 
          : 'text-red-800 dark:text-red-300'
        } ml-2 flex items-center gap-2`}
      >
        {title}
        {error.code && <span className="text-xs opacity-75">({error.code})</span>}
      </AlertTitle>
      <AlertDescription className={`${
        isRateLimited 
          ? 'text-amber-700 dark:text-amber-400' 
          : 'text-red-700 dark:text-red-400'
        } ml-2 flex flex-col gap-2`}
      >
        <span>{error.message}</span>
        
        {isApiError && (
          <span className="text-sm">
            The backend API service may be offline or starting up. This is normal as the server goes to sleep after periods of inactivity.
          </span>
        )}
        
        {/* MODIFIED Retry options based on error type */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {error.type === 'rate_limit_with_fallback' && error.fallbackModel && error.onRetryFallback && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-7 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300"
              onClick={() => error.onRetryFallback(error.fallbackModel)}
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Try with a different model
            </Button>
          )}

          {error.type === 'rate_limit_wait' && error.waitTime && error.onRetry && (
             <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-7 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300"
              onClick={() => {
                toast.info(`Retrying in ${error.waitTime} seconds...`);
                setTimeout(() => error.onRetry(), error.waitTime * 1000);
              }}
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Retry in {error.waitTime}s
            </Button>
          )}

          {(error.type === 'api_error' || error.type === 'network' || error.type === 'timeout') && error.onRetry && (
            <Button 
              size="sm" 
              variant="outline" 
              className={`text-xs h-7 ${
                isRateLimited 
                  ? 'border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300' 
                  : 'border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900 text-red-800 dark:text-red-300'
              }`}
              onClick={error.onRetry === true ? () => window.location.reload() : error.onRetry}
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Try with a different model
            </Button>
          )}
          
          {isApiError && onRetryAction && typeof onRetryAction.checkBackendStatus === 'function' && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-7 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-800 dark:text-blue-300"
              onClick={() => onRetryAction.checkBackendStatus()}
            >
              <Zap className="h-3 w-3 mr-1" /> Check Server Status
            </Button>
            )}
          </div>
      </AlertDescription>
    </Alert>
  );
};

// Add a progress indicator component
const ProgressIndicator = ({ loading, progress }) => {
  // Don't show if not loading or if progress is empty (stream finished)
  if (!loading || !progress) return null;
  
  return (
    <div className="absolute inset-0 bg-black/5 dark:bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-50 rounded-lg">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg flex flex-col items-center gap-2 min-w-[200px]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm font-medium">{progress || "Processing..."}</p>
      </div>
    </div>
  );
};

// Enhanced Markdown component with LaTeX support
const MathMarkdown = ({ children }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        // You can customize components if needed
        h1: ({ node, ...props }) => <h1 className="text-xl my-3 font-bold" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-lg my-3 font-bold" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-base my-2.5 font-semibold" {...props} />,
        p: ({ node, ...props }) => <p className="my-2" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
        li: ({ node, ...props }) => <li className="ml-2 my-1" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
        em: ({ node, ...props }) => <em className="italic" {...props} />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

// Enhanced feedback sharing functionality
const shareFeedback = (feedback, method, grade) => {
  const title = `GCSE Grade ${grade} Feedback`;
  const cleanFeedback = feedback.replace(/\[GRADE:\d\]/g, '');
  
  switch (method) {
    case 'clipboard':
      navigator.clipboard.writeText(cleanFeedback);
      return 'Feedback copied to clipboard!';
    case 'email':
      const emailSubject = encodeURIComponent(title);
      const emailBody = encodeURIComponent(cleanFeedback);
      window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`);
      return 'Email client opened';
    case 'twitter':
      const tweetText = encodeURIComponent(`I received a Grade ${grade} on my GCSE assessment! #GCSE #Education`);
      window.open(`https://twitter.com/intent/tweet?text=${tweetText}`);
      return 'Twitter share opened';
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`);
      return 'Facebook share opened';
    default:
      return '';
  }
};

// Improved PDF export function using html2canvas and jsPDF
const saveFeedbackAsPdf = async (feedbackElement, grade) => {
  try {
    const html2canvasModule = await import('html2canvas');
    const jsPDFModule = await import('jspdf');
    
    const html2canvas = html2canvasModule.default;
    const jsPDF = jsPDFModule.default;
    
    const feedbackContainer = feedbackElement.current;
    if (!feedbackContainer) {
      toast.error("Feedback element not found for PDF export.");
      return;
    }
    
    // Slightly increase scale for better quality, ensure all content is captured
    const canvas = await html2canvas(feedbackContainer, {
      scale: 2.5, // Increased scale
      useCORS: true,
      logging: false,
      scrollY: -window.scrollY, // Capture full element even if scrolled
      windowWidth: feedbackContainer.scrollWidth,
      windowHeight: feedbackContainer.scrollHeight,
      backgroundColor: window.getComputedStyle(document.documentElement).getPropertyValue('--card').trim() || '#ffffff', // Use theme background
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4', true); // Added 'true' for better compression
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = (pdfHeight - imgHeight * ratio) / 2; // Center vertically too
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`GCSE_Grade${grade || 'N/A'}_Feedback.pdf`);
    
    toast.success('Feedback saved as PDF');
    return 'Feedback saved as PDF';
  } catch (error) {
    console.error('Error saving PDF:', error);
    toast.error('Could not generate PDF. Please try again.');
  }
};

// Improved print functionality
const printFeedback = (feedbackElement) => {
  try {
    const printWindow = window.open('', '_blank');
    const feedbackHTML = feedbackElement.current.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GCSE Assessment Feedback</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .feedback-container { max-width: 800px; margin: 0 auto; }
            h1, h2, h3 { color: #333; }
            ul { padding-left: 20px; }
            li { margin-bottom: 5px; }
            .grade { display: inline-block; width: 40px; height: 40px; 
                    background: #f0f0f0; border-radius: 50%; text-align: center; 
                    line-height: 40px; font-weight: bold; font-size: 20px; 
                    margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="feedback-container">
            <h1>GCSE Assessment Feedback</h1>
            ${feedbackHTML}
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    return 'Print dialog opened';
  } catch (error) {
    console.error('Error printing feedback:', error);
    alert('Could not open print dialog. Please try again or use another method to save the feedback.');
  }
};

// Add this new component
const MotionListItem = forwardRef(({ children, ...props }, ref) => (
  <motion.li ref={ref} {...props}>
    {children}
  </motion.li>
));
MotionListItem.displayName = 'MotionListItem';

// Enhanced Feedback UI component
const EnhancedFeedback = ({ 
  feedback, 
  grade, 
  modelName, 
  achievedMarks, 
  totalMarks, 
  hasMarkScheme,
  onAskFollowUp = () => {},
  followUpEnabled = true
}) => {
  const feedbackRef = useRef(null);
  const [shareMessage, setShareMessage] = useState(null);
  
  const handleShare = (method) => {
    const message = shareFeedback(feedback, method, grade);
    setShareMessage(message);
    setTimeout(() => setShareMessage(null), 2000);
  };
  
  const handleSaveAsPdf = async () => {
    const message = await saveFeedbackAsPdf(feedbackRef, grade);
    setShareMessage(message);
    setTimeout(() => setShareMessage(null), 2000);
  };
  
  const handlePrint = () => {
    const message = printFeedback(feedbackRef);
    setShareMessage(message);
    setTimeout(() => setShareMessage(null), 2000);
  };
  
  return (
    <div className="relative">
      {shareMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1.5 rounded text-sm z-10"
        >
          {shareMessage}
        </motion.div>
      )}
      
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          {/* START MODIFIED SECTION */}
          {grade && (
            <div className="flex flex-col items-start gap-2 mr-2">
              <div className="inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-bold rounded-md shadow-md">
                Grade: {grade}
              </div>
              {achievedMarks && totalMarks && (
                <div className="inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-br from-green-600 to-teal-600 dark:from-green-500 dark:to-teal-500 text-white font-bold rounded-md shadow-md">
                  Mark: {achievedMarks}/{totalMarks}
                </div>
              )}
            </div>
          )}
          {/* END MODIFIED SECTION */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              Feedback
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                by {modelName}
              </span>
              {hasMarkScheme && (
                <Badge variant="outline" className="ml-2 px-1.5 py-0 text-[10px] bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-900/50">
                  Mark Scheme Analysis
                </Badge>
              )}
            </h3>
            {/* REMOVED existing score display as it's now combined with grade */}
            {/* {achievedMarks && totalMarks && (
              <div className="mt-1 flex items-center">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mr-1.5">Score:</span>
                <div className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                  {achievedMarks}/{totalMarks} marks
                </div>
              </div>
            )} */}
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <RefreshCw className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Try a different model</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share feedback</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Share Feedback</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleShare('clipboard')}>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy to clipboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('email')}>
                <Mail className="mr-2 h-4 w-4" />
                <span>Share via email</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('twitter')}>
                <Twitter className="mr-2 h-4 w-4" />
                <span>Share on Twitter</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('facebook')}>
                <Facebook className="mr-2 h-4 w-4" />
                <span>Share on Facebook</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSaveAsPdf}>
                <Download className="mr-2 h-4 w-4" />
                <span>Save as PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                <span>Print feedback</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div 
        ref={feedbackRef}
        className="prose prose-sm dark:prose-invert prose-p:my-2 prose-h1:text-xl prose-h1:my-3 prose-h2:text-lg prose-h2:my-3 prose-h3:text-base prose-h3:font-semibold prose-h3:my-2.5 max-w-none bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800"
      >
        <MathMarkdown>{feedback}</MathMarkdown>
      </div>

      {followUpEnabled && (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
            <div>
              <h4 className="text-base font-semibold mb-1 flex items-center">
                <HelpCircle className="h-4 w-4 mr-1.5 text-primary" />
                Need more help understanding this feedback?
              </h4>
              <p className="text-sm text-muted-foreground">
                Ask a follow-up question about anything you didn't understand in the feedback.
              </p>
            </div>
            <Button
              onClick={onAskFollowUp}
              className="whitespace-nowrap"
            >
              Ask Follow-Up Question
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Add this component for displaying the Model Thinking Process
const ModelThinkingBox = ({ thinking, loading }) => {
  // If loading and no thinking content yet, show a generic loading message
  if (loading && (!thinking || thinking.length === 0)) {
    return (
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg p-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-3" />
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Model is thinking...</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Please wait while the AI processes your request.</p>
      </div>
    );
  }

  // If there is thinking content, display it
  return (
    <AnimatePresence>
      {(thinking && thinking.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md flex flex-col items-center justify-center z-10 rounded-lg p-6 shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center mb-3">
            <Zap className="h-6 w-6 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Model Thinking Process</h3>
          </div>
          <ScrollArea className="h-[120px] w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-3 text-sm">
            <ul className="space-y-1.5 text-gray-700 dark:text-gray-300">
              {thinking.map((thought, index) => (
                <MotionListItem
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{thought}</span>
                </MotionListItem>
              ))}
            </ul>
          </ScrollArea>
          {loading && (
            <div className="flex items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
              <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
              Still processing...
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// New FeedbackDisplay component to organize the tab content
const FeedbackDisplay = ({ 
  loading, 
  feedback, 
  grade, 
  selectedModel, 
  modelThinking, 
  achievedMarks, 
  totalMarks, 
  processingProgress,
  setActiveTab,
  markScheme,
  onAskFollowUp,
  followUpEnabled = true
}) => {
  // Get the model name for display
  const modelName = AI_MODELS.find(m => m.value === selectedModel)?.label || 'AI';
  
  return (
    <div className="relative">
      {/* Main loading indicator */}
      <ProgressIndicator loading={loading} progress={processingProgress} />
      
      {/* Thinking Box for specific models */}
      {(loading || modelThinking) && selectedModel === "microsoft/mai-ds-r1:free" && (
        <ModelThinkingBox thinking={modelThinking} loading={loading} />
      )}
      
      {/* Feedback content when available */}
      {feedback ? (
        <EnhancedFeedback 
          feedback={feedback} 
          grade={grade} 
          modelName={modelName}
          achievedMarks={achievedMarks}
          totalMarks={totalMarks}
          hasMarkScheme={!!markScheme}
          onAskFollowUp={onAskFollowUp}
          followUpEnabled={followUpEnabled}
        />
      ) : loading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-lg bg-muted/20">
          <h3 className="text-lg font-medium">Generating Feedback...</h3>
          <p className="text-muted-foreground max-w-md mt-2">
            Please wait while the AI analyzes your answer. This may take up to 90 seconds depending on the model selected.
          </p>
        </div>
      ) : (
        <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-lg bg-muted/20">
          <div className="mb-4 p-3 rounded-full bg-muted">
            <HelpCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No Feedback Yet</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Enter your question and answer in the Answer tab, then click "Mark Answer" to receive AI feedback and a GCSE grade.
          </p>
          <Button
            variant="outline"
            onClick={() => setActiveTab("answer")}
            className="text-sm"
          >
            Go to Answer Tab
          </Button>
        </div>
      )}
    </div>
  );
};

// Add a hook to detect viewport size
const useViewport = () => {
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      // Initial call
      handleResize();
      
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  return viewportSize;
};

// Add QuickGuide component definition before the main component
const QuickGuide = ({ onClose }) => {
  return (
    <div className="mb-6 bg-white dark:bg-gray-900 rounded-lg border shadow-sm overflow-hidden">
      <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900 p-3">
        <div className="flex items-center gap-2">
          <div className="text-lg font-semibold text-blue-800 dark:text-blue-300">Quick Guide</div>
          <div className="text-sm text-blue-600 dark:text-blue-400">How to use the GCSE AI Marker</div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 h-8 w-8 p-0 rounded-full"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <div className="p-4">
        <ol className="space-y-2">
          <li className="flex gap-3">
            <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-medium">1</div>
            <p className="text-gray-700 dark:text-gray-300">Enter your question and answer in the text boxes.</p>
          </li>
          <li className="flex gap-3">
            <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-medium">2</div>
            <p className="text-gray-700 dark:text-gray-300">Select the subject, exam board, and question type.</p>
          </li>
          <li className="flex gap-3">
            <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-medium">3</div>
            <p className="text-gray-700 dark:text-gray-300">Click "Mark Answer" to get AI feedback.</p>
          </li>
          <li className="flex gap-3">
            <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-medium">4</div>
            <p className="text-gray-700 dark:text-gray-300">Review the feedback and grade provided.</p>
          </li>
          <li className="flex gap-3">
            <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-medium">5</div>
            <p className="text-gray-700 dark:text-gray-300">Optionally save, share or print your feedback.</p>
          </li>
        </ol>
        <div className="mt-6 pt-4 border-t border-border">
          <h3 className="font-medium text-base mb-3 text-gray-800 dark:text-gray-200">Quick Tips</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li className="flex items-start">
              <ChevronRight className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" />
              <span>Enter both the question and your full answer for accurate marking.</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" />
              <span>Select the correct subject and exam board for tailored feedback.</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" />
              <span>For image uploads, ensure the text is clear and readable.</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" />
              <span>The AI models are good, but always cross-reference with official materials.</span>
            </li>
             <li className="flex items-start">
              <ChevronRight className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" />
              <span>Wait for the backend to wake up when you first visit the site (may take up to 60 seconds)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Define keys for localStorage
const LOCALSTORAGE_KEYS = {
  QUESTION: 'aimarker_question',
  ANSWER: 'aimarker_answer',
  SUBJECT: 'aimarker_subject',
  EXAM_BOARD: 'aimarker_examBoard',
  MODEL: 'aimarker_model',
  TIER: 'aimarker_tier',
};

// ADDED: Enhanced Bulk Item Preview Dialog component
const BulkItemPreviewDialog = ({ open, onOpenChange, item, onClose }) => {
  if (!item) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Item {item.itemIndex + 1} Details</DialogTitle>
          <DialogDescription>
            Full question, answer and feedback details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="border-b pb-2">
            <h3 className="font-medium text-lg">Question</h3>
            <p className="mt-1">{item.question}</p>
          </div>
          
          <div className="border-b pb-2">
            <h3 className="font-medium text-lg">Answer</h3>
            <p className="mt-1">{item.answer}</p>
          </div>
          
          <div className="border-b pb-2">
            <h3 className="font-medium text-lg">Feedback</h3>
            {item.error ? (
              <Alert variant="destructive" className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{item.error}</AlertDescription>
              </Alert>
            ) : (
              <div className="mt-1 prose prose-sm dark:prose-invert max-w-none">
                <MathMarkdown>{item.feedback}</MathMarkdown>
              </div>
            )}
          </div>
          
          {!item.error && (
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <span className="font-medium mr-2">Grade:</span>
                <div className="inline-flex items-center justify-center h-8 w-8 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-bold rounded-full shadow-md">
                  {item.grade || 'N/A'}
                </div>
              </div>
              
              {item.achievedMarks && item.totalMarks && (
                <div className="flex items-center">
                  <span className="font-medium mr-2">Marks:</span>
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                    {item.achievedMarks}/{item.totalMarks}
                  </span>
                </div>
              )}
              
              {item.modelName && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Model:</span> {AI_MODELS.find(m => m.value === item.modelName)?.label || item.modelName}
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// MODIFIED: BatchProcessingControls component with parallelism setting
const BatchProcessingControls = ({ 
  isProcessing, 
  progress, 
  onPause, 
  onResume, 
  onCancel, 
  isPaused,
  parallelism,
  onParallelismChange
}) => {
  return (
    <div className="flex flex-col space-y-3 mt-2 mb-4">
      <div className="w-full bg-muted rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${Math.round((progress.processed / progress.total) * 100)}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Processing {progress.processed} of {progress.total} items</span>
        <span>{Math.round((progress.processed / progress.total) * 100)}% complete</span>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex items-center gap-2">
          <Label htmlFor="parallelism" className="text-xs whitespace-nowrap">Parallel Tasks:</Label>
          <Select
            value={parallelism.toString()}
            onValueChange={(value) => onParallelismChange(parseInt(value))}
            disabled={isProcessing}
          >
            <SelectTrigger className="h-7 w-16 text-xs">
              <SelectValue placeholder={parallelism} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          {isPaused ? (
            <Button size="sm" variant="outline" onClick={onResume} disabled={!isProcessing}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Resume
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={onPause} disabled={!isProcessing}>
              <Pause className="mr-1.5 h-3.5 w-3.5" />
              Pause
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={onCancel} disabled={!isProcessing}>
            <X className="mr-1.5 h-3.5 w-3.5" />
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

// Enhanced AIMarker component with mobile responsiveness
const AIMarker = () => {
  // console.log('AIMarker component is rendering', { window: typeof window !== 'undefined' ? window.location.hostname : 'SSR' });
  
  useEffect(() => {
    console.log(`Using API URL: ${API_BASE_URL}`, `GitHub Pages: ${isGHPages}`);
    if (typeof window !== 'undefined' && !window.BACKEND_STATUS) {
      window.BACKEND_STATUS = { status: 'checking', lastChecked: null };
    }
  }, []);
  
  // State for form inputs and data
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [subject, setSubject] = useState("english");
  const [examBoard, setExamBoard] = useState("aqa");
  const [questionType, setQuestionType] = useState("general"); // Not persisted for now, resets with subject/board
  const [userType, setUserType] = useState("student"); // Not persisted for now
  const [markScheme, setMarkScheme] = useState("");
  const [image, setImage] = useState(null);
  const [activeTab, setActiveTab] = useState("answer");
  const [customSubject, setCustomSubject] = useState("");
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [customSubjects, setCustomSubjects] = useState([]);
  const [allSubjects, setAllSubjects] = useState(SUBJECTS);
  const customSubjectInputRef = useRef(null);
  const [totalMarks, setTotalMarks] = useState("");
  const [textExtract, setTextExtract] = useState("");
  const [relevantMaterial, setRelevantMaterial] = useState("");
  const [relevantMaterialImage, setRelevantMaterialImage] = useState(null);
  const [relevantMaterialImageBase64, setRelevantMaterialImageBase64] = useState(null);
  const [relevantMaterialImageLoading, setRelevantMaterialImageLoading] = useState(false);
  const [modelThinking, setModelThinking] = useState("");
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [isGitHubPages, setIsGitHubPages] = useState(false);
  const [tier, setTier] = useState("higher"); 
  const [achievedMarks, setAchievedMarks] = useState(null); 
  const [ocrTextPreview, setOcrTextPreview] = useState("");
  const [showOcrPreviewDialog, setShowOcrPreviewDialog] = useState(false);
  const [hasExtractedText, setHasExtractedText] = useState(false);  // Add this line

  // ADDED: State for Subject Guidance Dialog
  const [showSubjectGuidanceDialog, setShowSubjectGuidanceDialog] = useState(false);
  const [currentSubjectGuidance, setCurrentSubjectGuidance] = useState("");

  const { checkBackendStatus: refreshBackendStatusHook } = useBackendStatus(API_BASE_URL); // Alias for clarity

  // ADDED: State for Bulk Assessment
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkItems, setBulkItems] = useState([]); // Array of {question, answer, subject?, examBoard?, ...}
  const [bulkResults, setBulkResults] = useState([]); // Array of {itemIndex, feedback, grade, error?
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkSettingPreference, setBulkSettingPreference] = useState('global'); // 'global' or 'file'
  const [bulkProgress, setBulkProgress] = useState({ processed: 0, total: 0, currentItem: null });
  const bulkFileUploadRef = useRef(null);
  
  // ADDED: State for Bulk Item Preview
  const [previewItem, setPreviewItem] = useState(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  
  // ADDED: State for batch processing controls
  const [isBulkProcessingPaused, setIsBulkProcessingPaused] = useState(false);
  const bulkProcessingRef = useRef({ cancel: false, pause: false });
  
  // ADDED: State for parallel processing
  const [parallelProcessing, setParallelProcessing] = useState(1);
  
  // ADDED: State for follow-up dialog
  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [followUpResponse, setFollowUpResponse] = useState("");
  const [followUpLoading, setFollowUpLoading] = useState(false);
  
  // Handle image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      // Clear previous preview and reset model visibility
      setOcrTextPreview("");
      setHasExtractedText(false);
    }
  };
  
  // Handle relevant material image upload
  const handleRelevantMaterialImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setRelevantMaterialImage(selectedImage);
      setRelevantMaterialImageLoading(true);
      
      // Convert image to base64 for Gemini API
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setRelevantMaterialImageBase64(base64String);
        setRelevantMaterialImageLoading(false);
        toast.success("Image added as relevant material");
      };
      reader.onerror = () => {
        setRelevantMaterialImageLoading(false);
        toast.error("Failed to process image");
      };
      reader.readAsDataURL(selectedImage);
    }
  };
  
  // MODIFIED: Handle image processing - convert to text using AI OCR
  const handleProcessImage = async () => {
    if (!selectedImage) {
      toast.error("Please upload an image first");
      return;
    }

    try {
      toast.info("Processing image...");
      
      setProcessingStep("reading_image");
      setIsProcessing(true);
      setProcessingProgress(10);
      
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      // Select the appropriate model for image processing based on exam board
      let ocrModel;
      if (examBoard === "ocr") {
        ocrModel = TASK_SPECIFIC_MODELS.image_processing.ocr;
        toast.info("Using OCR-specific model for processing");
      } else {
        ocrModel = TASK_SPECIFIC_MODELS.image_processing.default;
      }
      
      // Add the selected model to the form data
      formData.append('model', ocrModel);
      
      // Use the CORRECT backend URL when on GitHub Pages
      const isGitHubPagesEnv = typeof window !== 'undefined' && 
        (window.location.hostname.includes('github.io') || window.location.hostname === 'beenycool.github.io');
        
      // Always use the remote server for GitHub Pages since GitHub Pages can't handle file uploads
      // The backend server REQUIRES the /api prefix in the URL
      const apiUrl = isGitHubPagesEnv 
        ? 'https://beenycool-github-io.onrender.com/api/github/completions'
        : constructApiUrl('github/completions');
      
      setProcessingStep("analyzing_content");
      setProcessingProgress(30);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OCR failed: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      
      // Add detailed debugging for API response
      console.log("API Response received:", data);
      if (data.choices && data.choices[0]) {
        console.log("First choice:", data.choices[0]);
        if (data.choices[0].message) {
          console.log("Message content:", data.choices[0].message.content);
        }
      }
      
      if (data.text && data.text.trim() !== "") {
        setOcrTextPreview(data.text);
        setShowOcrPreviewDialog(true);
        toast.success("Image processed. Review extracted text.");
      } else {
        toast.warning("No text detected in image, or extracted text is empty.");
        setOcrTextPreview(""); // Clear preview if no text
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setError({
        type: "api",
        message: `Failed to process image: ${error.message}`
      });
      toast.error("Failed to process image: " + error.message);
    } finally {
      setImageLoading(false);
    }
  };

  // ADDED: Handle OCR text confirmation
  const handleConfirmOcrText = () => {
    if (ocrTextPreview) {
      setAnswer(prev => {
        const separator = prev.trim() ? '\n\n' : '';
        return prev + separator + ocrTextPreview;
      });
      setHasExtractedText(true);  // Set to true when text is confirmed
      toast.success("Text added to answer field.");
    }
    setShowOcrPreviewDialog(false);
    // setOcrTextPreview(""); // Optionally clear preview after adding
  };
  
  // UI state
  const [showGuide, setShowGuide] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [detectedSubject, setDetectedSubject] = useState(null);
  const [shortcutFeedback, setShortcutFeedback] = useState(null);
  const [processingProgress, setProcessingProgress] = useState("");
  const [history, setHistory] = useState([]);
  
  // API and rate limiting
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [dailyRequests, setDailyRequests] = useState(0); // This seems locally managed, let's use getRequestTokens for display
  const [lastRequestDate, setLastRequestDate] = useState(new Date().toDateString());
  
  // Model options for testing:
  // "deepseek/deepseek-chat-v3-0324:free" - Balanced model
  // "microsoft/mai-ds-r1:free" - Thinking model
  // "xai/grok-3" - X AI model
  // "o4-mini" - O4 mini model
  // "gemini-2.5-flash-preview-04-17" - Gemini 2.5 Flash
  const [selectedModel, setSelectedModel] = useState("deepseek/deepseek-chat-v3-0324:free");
  
  const [modelLastRequestTimes, setModelLastRequestTimes] = useState({});
  const [imageLoading, setImageLoading] = useState(false);
  const [backendError, setBackendError] = useState(false);
  const helpButtonRef = useRef(null);
  const questionInputRef = useRef(null);
  const answerInputRef = useRef(null);
  const marksInputRef = useRef(null);
  const markSchemeButtonRef = useRef(null);
  const submitButtonRef = useRef(null);
  const hasManuallySetSubject = useRef(false);
  const backendStatusRef = useRef('checking');
  const currentModelForRequestRef = useRef(null);
  const [backendUpdated, setBackendUpdated] = useState(false);
  const [autoMaxTokens, setAutoMaxTokens] = useState(true);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [remainingRequestTokens, setRemainingRequestTokens] = useState(0);
  const [thinkingBudget, setThinkingBudget] = useState(DEFAULT_THINKING_BUDGETS["deepseek/deepseek-chat-v3-0324:free"] || 1024);
  const [enableThinkingBudget, setEnableThinkingBudget] = useState(true);

  // Define the missing setCurrentModelForRequest function
  const setCurrentModelForRequest = (model) => {
    currentModelForRequestRef.current = model;
    
    // Update thinking budget based on the selected model
    if (enableThinkingBudget && DEFAULT_THINKING_BUDGETS[model]) {
      setThinkingBudget(DEFAULT_THINKING_BUDGETS[model]);
    }
    
    // Track the last request time for this model
    setModelLastRequestTimes(prev => ({
      ...prev,
      [model]: Date.now()
    }));
  };

  // Debounced save function for question and answer
  const debouncedSaveDraft = useCallback(
    (q, a) => {
      const debouncedFn = debounce((question, answer) => {
        localStorage.setItem(LOCALSTORAGE_KEYS.QUESTION, question);
        localStorage.setItem(LOCALSTORAGE_KEYS.ANSWER, answer);
        // console.log('Draft saved');
      }, 1500);
      debouncedFn(q, a);
    },
    [] // No dependencies needed with this approach
  );

  // Effect for auto-saving question and answer drafts
  useEffect(() => {
    if (question || answer) { // Only save if there's content
      debouncedSaveDraft(question, answer);
    }
  }, [question, answer, debouncedSaveDraft]);

  // Token management for rate limiting
  const getRequestTokens = useCallback(() => {
    const stored = localStorage.getItem('requestTokens');
    const now = new Date().toDateString();
    let tokens = stored ? JSON.parse(stored) : { count: 500, lastReset: now };
    if (tokens.lastReset !== now) {
      tokens = { count: 500, lastReset: now };
    }
    // Don't set localStorage here, do it in consumeToken or a dedicated update function
    // localStorage.setItem('requestTokens', JSON.stringify(tokens)); 
    return tokens;
  }, []);

  // Effect for loading persistent user preferences and drafts on initial mount
  useEffect(() => {
    // Load drafts
    const savedQuestion = localStorage.getItem(LOCALSTORAGE_KEYS.QUESTION);
    const savedAnswer = localStorage.getItem(LOCALSTORAGE_KEYS.ANSWER);
    if (savedQuestion) setQuestion(savedQuestion);
    if (savedAnswer) setAnswer(savedAnswer);

    // Load preferences
    const savedSubject = localStorage.getItem(LOCALSTORAGE_KEYS.SUBJECT);
    if (savedSubject && SUBJECTS.find(s => s.value === savedSubject)) {
      setSubject(savedSubject);
    }
    const savedExamBoard = localStorage.getItem(LOCALSTORAGE_KEYS.EXAM_BOARD);
    if (savedExamBoard && EXAM_BOARDS.find(eb => eb.value === savedExamBoard)) {
      setExamBoard(savedExamBoard);
    }

    let initialModel = "gemini-2.5-flash-preview-05-20"; // Default model
    const savedModel = localStorage.getItem(LOCALSTORAGE_KEYS.MODEL);
    if (savedModel && AI_MODELS.find(m => m.value === savedModel)) {
      initialModel = savedModel;
    }

    if (selectedModel !== initialModel) {
      setSelectedModel(initialModel);
    }
    currentModelForRequestRef.current = initialModel;
    
    // Set thinking budget based on the effectively loaded model
    setThinkingBudget(DEFAULT_THINKING_BUDGETS[initialModel] || 1024);

    const savedTier = localStorage.getItem(LOCALSTORAGE_KEYS.TIER);
    if (savedTier === "higher" || savedTier === "foundation") {
      setTier(savedTier);
    }

    // Initialize remaining tokens display
    const tokens = getRequestTokens(); 
    setRemainingRequestTokens(tokens.count);

  }, [getRequestTokens, selectedModel]); // Added selectedModel to dependencies

  // Effects for saving preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEYS.SUBJECT, subject);
  }, [subject]);

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEYS.EXAM_BOARD, examBoard);
  }, [examBoard]);

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEYS.MODEL, selectedModel);
    // Update thinking budget when model changes
    setThinkingBudget(DEFAULT_THINKING_BUDGETS[selectedModel] || 1024);
    // Keep the reference updated with the current model
    currentModelForRequestRef.current = selectedModel;
  }, [selectedModel]);

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEYS.TIER, tier);
  }, [tier]);

  // ADDED: Effect to initialize and update remaining tokens display
  useEffect(() => {
    const tokens = getRequestTokens();
    setRemainingRequestTokens(tokens.count);
  }, [getRequestTokens]);

  const consumeToken = useCallback(() => {
    const tokens = getRequestTokens();
    if (tokens.count <= 0) return false;
    tokens.count -= 1;
    localStorage.setItem('requestTokens', JSON.stringify(tokens));
    setRemainingRequestTokens(tokens.count); // Update display state
    return true;
  }, [getRequestTokens]);

  // Handler for backend status changes
  const handleBackendStatusChange = useCallback((status, data) => {
    console.log('Backend status changed:', status, data);
    backendStatusRef.current = status;
    // setBackendUpdated(prev => !prev); // REMOVE THIS LINE to prevent potential loop
    
    // If backend is offline, show appropriate error
    if (status === 'offline' || status === 'error') {
      setBackendError(true);
    } else {
      setBackendError(false);
    }
  }, []);

  // Fix: Using custom hooks for subject classification and backend status
  const { classifySubjectAI, debouncedClassifySubject } = useSubjectDetection(subjectKeywords, loading);
  const { checkBackendStatus } = useBackendStatus(API_BASE_URL);

  // Special handling for GitHub Pages environment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isGitHubPagesHost = window.location.hostname.includes('github.io') || 
                               window.location.hostname === 'beenycool.github.io';
      setIsGitHubPages(isGitHubPagesHost);
      
      if (isGitHubPagesHost) {
        console.log('Running on GitHub Pages - simulating online status for UI rendering (mount effect)');
        backendStatusRef.current = 'online';
        // REMOVED: setBackendUpdated(prev => !prev); // This was likely causing the loop
      }
    }
  }, []); // Empty dependency array to run only on mount

  // Effect for automatic subject detection based on question and answer
  useEffect(() => {
    if (question.length > 20 && !hasManuallySetSubject.current && !loading) {
      // Ensure both question and answer are passed for detection
      debouncedClassifySubject(question + " " + answer, subject, hasManuallySetSubject, allSubjects, setSubject, setDetectedSubject, setSuccess);
    }
  // Add answer to dependency array
  }, [question, answer, debouncedClassifySubject, subject, loading, allSubjects, setDetectedSubject, setSuccess, hasManuallySetSubject]);

  // ======== MAIN FUNCTIONS ========
  // Add the missing addCustomSubject function
  const addCustomSubject = () => {
    if (!customSubject.trim()) return;
    
    const newSubjectValue = customSubject.toLowerCase().replace(/\s+/g, '');
    const newSubject = {
      value: newSubjectValue,
      label: customSubject.trim()
    };
    
    // Add to both state arrays
    setCustomSubjects(prev => [...prev, newSubject]);
    setAllSubjects(prev => [...prev, newSubject]);
    
    // Set as current selection
    setSubject(newSubjectValue);
    hasManuallySetSubject.current = true;
    
    // Reset custom subject input and hide the add input
    setCustomSubject('');
    setIsAddingSubject(false);
    
    // Focus back on the select after adding
    setTimeout(() => {
      if (customSubjectInputRef.current) {
        customSubjectInputRef.current.blur();
      }
    }, 10);
  };

  // Submit handler
// Define the prompt building functions
  const buildSystemPrompt = () => {
    // System prompt logic based on component state
    console.log("AIMarker state for system prompt:", { subject, examBoard, questionType, userType, markScheme, totalMarks, textExtract, relevantMaterial, tier, allSubjects });
    let prompt = `You are an AI assistant specialized in educational assessment.`;
    if (userType) prompt += ` You are acting as a ${userType}.`;
    if (subject) prompt += ` Your current task is to assess a piece of work for the subject: ${subject}.`;
    if (allSubjects && allSubjects.find(s => s.value === subject)?.hasTiers && tier) {
      prompt += ` The work is for the ${tier} tier.`;
    }
    if (examBoard) prompt += ` The examination board is ${examBoard}.`;
    if (questionType && questionType !== "general") {
      const selectedQuestionType = QUESTION_TYPES[subject]?.[examBoard]?.find(qt => qt.value === questionType);
      if (selectedQuestionType) {
        prompt += ` Specifically, this is for ${selectedQuestionType.label}.`;
      }
    }
    if (totalMarks) prompt += ` The question is out of ${totalMarks} marks.`;
    if (markScheme) prompt += `\n\nThe following mark scheme should be used as a guide if available:\n\`\`\`\n${markScheme}\n\`\`\`\n`;
    if (textExtract) prompt += `\n\nA text extract has been provided and may be relevant:\n\`\`\`\n${textExtract}\n\`\`\`\n`;
    if (relevantMaterial) prompt += `\n\nOther relevant material to consider:\n\`\`\`\n${relevantMaterial}\n\`\`\`\n`;
    prompt += "\nYour primary goal is to provide constructive feedback and a grade based on the user's answer to the question. Adhere to the provided mark scheme if available."
    return prompt;
  };

  const buildUserPrompt = () => {
    // User prompt logic based on component state
    console.log("AIMarker state for user prompt:", { question, answer, totalMarks, subject, examBoard, questionType, textExtract, relevantMaterial, relevantMaterialImageBase64 });
    let prompt = "Please assess the following student's answer.\n\n";

    if (question) {
      prompt += `**Question:**\n${question}\n\n`;
    } else {
      prompt += "**Question:** [Not explicitly provided, infer from context if possible or provide general feedback on the answer below.]\n\n";
    }

    if (answer) {
      prompt += `**Student's Answer:**\n${answer}\n\n`;
    } else {
      // This case should ideally be caught by validation, but as a fallback:
      prompt += "**Student's Answer:** [No answer provided. Please indicate that an answer is needed for assessment.]\n\n";
      return prompt; // Early exit if no answer
    }

    if (totalMarks) {
      prompt += `The question is out of **${totalMarks} marks**.\n\n`;
    }

    if (textExtract) {
      prompt += `**Provided Text Extract (for context):**\n\`\`\`\n${textExtract}\n\`\`\`\n\n`;
    }

    if (relevantMaterial) {
      prompt += `**Other Provided Relevant Material (for context):**\n\`\`\`\n${relevantMaterial}\n\`\`\`\n\n`;
    }
    
    if (relevantMaterialImageBase64) {
        prompt += `**An image has also been provided with relevant material.** Please consider this in your assessment.\n\n`;
    }

    prompt += "Based on all the information provided (including the system prompt context like subject, exam board, and mark scheme if available), please provide:\n";
    prompt += "1.  **Overall Feedback:** Constructive comments on the student's performance, highlighting strengths and areas for improvement.\n";
    prompt += "2.  **Mark Allocation (if applicable):** If a total mark is specified, suggest a mark out of the total. Briefly justify your mark allocation against the mark scheme or assessment criteria.\n";
    prompt += "3.  **Specific Pointers:** Bullet points on specific aspects of the answer, referencing parts of the mark scheme or good practice where appropriate.\n";
    prompt += "4.  **Actionable Advice:** Suggestions for how the student can improve in the future.\n\n";
    prompt += "Present the feedback clearly and concisely. If a mark scheme was provided in the system prompt, ensure your feedback aligns with it.";
    return prompt;
  };
  const handleSubmitForMarking = useCallback(async () => {
    // Clear previous feedback and errors
    setFeedback(""); // Clear feedback before streaming
    setGrade("");
    setError(null);
    setSuccess(null);
    setModelThinking("");
    setAchievedMarks(null);
    // Determine the model to use for this request
    const modelForSubjectAssessment = TASK_SPECIFIC_MODELS.subject_assessment;
    const effectiveModel = subject && modelForSubjectAssessment ? modelForSubjectAssessment : selectedModel;
    setCurrentModelForRequest(effectiveModel);

    // Validate inputs
    if (!answer) {
      setError({ type: "validation", message: "Please enter an answer to be marked" });
      return;
    }

    setLoading(true);
    setActiveTab("feedback");
    setSuccess({ message: "Initiating request..." }); // Initial message

    // Backend status check (simplified for brevity, assuming it's handled)
    const backendStatus = await checkBackendStatus(selectedModel);
    if (!backendStatus.ok) {
      setLoading(false);
      setError({ type: "network", message: `Backend connection error: ${backendStatus.error}. Please try again.`, retry: true });
      return;
    }

    // Rate limiting checks
    const now = Date.now();
    const modelRateLimit = MODEL_RATE_LIMITS[currentModelForRequestRef.current] || 10000;
    const modelLastRequestTime = modelLastRequestTimes[currentModelForRequestRef.current] || 0;

    if (now - modelLastRequestTime < modelRateLimit) {
      setLoading(false);
      const waitTimeSeconds = Math.ceil((modelRateLimit - (now - modelLastRequestTime)) / 1000);
      const fallback = FALLBACK_MODELS[currentModelForRequestRef.current];
      if (fallback) {
        setError({
          type: "rate_limit_with_fallback",
          message: `${AI_MODELS.find(m => m.value === currentModelForRequestRef.current)?.label} is rate limited. Try fallback or wait ${waitTimeSeconds}s.`,
          fallbackModel: fallback,
          onRetryFallback: (newModel) => {
            setSelectedModel(newModel); // This will trigger a re-render and user can click submit again
            toast.info(`Switched to ${AI_MODELS.find(m => m.value === newModel)?.label}. Click "Get Feedback" again.`);
          },
          onRetry: () => handleSubmitForMarking(),
          waitTime: waitTimeSeconds
        });
      } else {
        setError({
          type: "rate_limit_wait",
          message: `${AI_MODELS.find(m => m.value === currentModelForRequestRef.current)?.label} is limited. Wait ${waitTimeSeconds}s.`,
          waitTime: waitTimeSeconds,
          onRetry: () => handleSubmitForMarking()
        });
      }
      return;
    }
     // Token consumption check
    if (!consumeToken()) {
      setLoading(false);
      setError({ type: "rate_limit", message: "Daily request limit reached (500/day)" });
      return;
    }


    setModelLastRequestTimes(prev => ({ ...prev, [currentModelForRequestRef.current]: now }));
    setLastRequestTime(now); // Update general last request time

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt();

    setProcessingProgress("Sending request to AI model...");
    setSuccess({ message: `Processing with ${AI_MODELS.find(m => m.value === currentModelForRequestRef.current)?.label || currentModelForRequestRef.current}...` });
    
          try {        // Record user event - with error handling for missing endpoint        try {          const eventApiUrl = constructApiUrl('auth/events');          console.log('Sending event to:', eventApiUrl);                    const eventResponse = await fetch(eventApiUrl, {            method: 'POST',            headers: { 'Content-Type': 'application/json' },            body: JSON.stringify({              eventType: 'question_submitted_stream',              eventData: {                model: currentModelForRequestRef.current,                questionLength: question?.length || 0,                answerLength: answer?.length || 0,                subject: subject              }            })          });                    if (!eventResponse.ok) {            console.warn(`Event recording failed with status: ${eventResponse.status}`);            // Continue with the main request even if event recording fails          }        } catch (eventError) {          console.warn("Failed to record user event:", eventError);          // For GitHub Pages static export, this is expected and we can ignore it          console.log('Note: In static export mode, some API failures are expected');        }
      
      const requestBodyPayload = {
        model: currentModelForRequestRef.current.startsWith("openai/") || currentModelForRequestRef.current.startsWith("xai/") 
          ? currentModelForRequestRef.current 
          : "xai/grok-3", // Default to Grok if model pattern doesn't match
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        top_p: 1.0,
        stream: true
      };
      
      // Add image if relevant for Gemini (assuming /api/github/completions handles this)
      if (currentModelForRequestRef.current.startsWith("gemini") && relevantMaterialImage && relevantMaterialImageBase64) {
        // The backend /api/github/completions needs to be adapted to pass this to Gemini if it's the intermediary
        // For simplicity, we assume the backend handles this structure.
        // This part might need adjustment based on how the backend expects image data for Gemini streams.
        requestBodyPayload.messages[1].content += "\n\nIMAGE PROVIDED: An image has been attached. Please analyze this image.";
        // The actual image data would need to be handled by the backend if it's proxying to Gemini.
        // If hitting Gemini directly, the payload structure for images with streaming would be different.
        // For this exercise, we'll assume the backend's /github/completions is smart enough.
      }


             // Use the CORRECT backend URL when on GitHub Pages
      const isGitHubPagesEnv = typeof window !== 'undefined' && 
        (window.location.hostname.includes('github.io') || window.location.hostname === 'beenycool.github.io');
        
      // Always use the remote server for GitHub Pages
      // The backend server REQUIRES the /api prefix in the URL
      const completionsApiUrl = isGitHubPagesEnv 
        ? 'https://beenycool-github-io.onrender.com/api/github/completions'
        : constructApiUrl('github/completions');
      
      console.log('Sending completions request to:', completionsApiUrl);
      
      const response = await fetch(completionsApiUrl, {        method: 'POST',        headers: {          'Content-Type': 'application/json',          'Accept': 'text/event-stream',        },        body: JSON.stringify(requestBodyPayload),      });

      if (!response.ok) {
        const errorStatus = response.status;
        const errorText = await response.text();
        console.error(`GitHub API error: ${errorStatus}`, errorText);
        
        // Try to parse as JSON for structured error messages
        let parsedError = null;
        try {
          parsedError = JSON.parse(errorText);
        } catch (e) {
          // Not JSON, use as plain text
        }
        
        // Handle specific error codes
        if (errorStatus === 401) {
          setError({
            type: "api_error",
            message: "Authentication error with GitHub API. Please try a different model.",
            onRetry: () => {
              setSelectedModel("deepseek/deepseek-chat-v3-0324:free");
              setCurrentModelForRequest("deepseek/deepseek-chat-v3-0324:free");
              handleProcessImage();
            }
          });
        } else if (errorStatus === 404) {
          // 404 commonly means the GitHub API key is missing or the endpoint is not available
          setError({
            type: "api_error",
            message: "GitHub API is not available. Please try a different model.",
            onRetry: () => {
              setSelectedModel("deepseek/deepseek-chat-v3-0324:free");
              setCurrentModelForRequest("deepseek/deepseek-chat-v3-0324:free");
              handleProcessImage();
            }
          });
        } else {
          const errorMessage = parsedError?.error || parsedError?.message || errorText || "Unknown error";
          setError({ 
            type: "api_error", 
            message: `API error (${errorStatus}): ${errorMessage}`,
            onRetry: errorStatus >= 500 ? () => handleProcessImage() : undefined 
          });
        }
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        let parsedError = { message: `API request failed: ${response.status}` };
        try { parsedError = JSON.parse(errorText); } catch (e) { /* ignore */ }
        
        const fallback = FALLBACK_MODELS[currentModelForRequestRef.current];
        if (response.status === 429 && fallback) {
            setError({
                type: "rate_limit_with_fallback",
                message: `Model ${AI_MODELS.find(m => m.value === currentModelForRequestRef.current)?.label} API rate limited. Error: ${parsedError.error || errorText}`,
                fallbackModel: fallback,
                onRetryFallback: (newModel) => { setSelectedModel(newModel); toast.info(`Switched to ${AI_MODELS.find(m => m.value === newModel)?.label}. Click "Get Feedback" again.`); },
                onRetry: () => handleSubmitForMarking()
            });
        } else {
            setError({ type: "api_error", message: `API Error: ${parsedError.error || errorText}`, onRetry: handleSubmitForMarking });
        }
        setLoading(false);
        setProcessingProgress("");
        return;
      }

      setProcessingProgress("Receiving feedback stream...");
      setModelThinking("Receiving stream..."); // Indicate stream has started

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedChunk = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          // Don't show "Stream finished" message as it overlaps with content
          setProcessingProgress("");
          setModelThinking("Stream complete.");
          break; // Exit while loop
        }

        accumulatedChunk += decoder.decode(value, { stream: true });
        let errorEncounteredInStream = false;
        let newlineIndex;
        while ((newlineIndex = accumulatedChunk.indexOf('\n\n')) >= 0) {
            const eventBlock = accumulatedChunk.substring(0, newlineIndex);
            accumulatedChunk = accumulatedChunk.substring(newlineIndex + 2);

            const lines = eventBlock.split('\n');
            for (const line of lines) {
                if (line.startsWith('event: error')) {
                    // Improved SSE error event handling
                    console.error("SSE stream error event received:", eventBlock);
                    const errorDataLineContent = lines.find(l => l.startsWith('data: '))?.substring(6);
                    let errorMessage = "Error in stream";
                    if (errorDataLineContent) {
                        try {
                            const parsedError = JSON.parse(errorDataLineContent);
                            errorMessage = parsedError.error || (parsedError.message || "Unknown error from stream");
                        } catch (e) {
                            errorMessage = "Malformed error data in stream";
                        }
                    }
                    setError({ type: "api_stream_error", message: errorMessage, onRetry: handleSubmitForMarking });
                    errorEncounteredInStream = true;
                    break; // Break from inner for-loop (lines)
                } else if (line.startsWith('data: ')) {
                    const jsonDataString = line.substring(6);
                    if (jsonDataString.trim() === '[DONE]') {
                        console.log('Stream signaled DONE.');
                        // This might indicate the end of the stream from the source,
                        // but the outer reader.read() loop will handle the actual 'done' state.
                        continue;
                    }
                    try {
                        const parsedData = JSON.parse(jsonDataString);
                        if (parsedData.choices && parsedData.choices[0] && parsedData.choices[0].delta && parsedData.choices[0].delta.content) {
                            setFeedback(prev => prev + parsedData.choices[0].delta.content);
                        } else if (parsedData.text) { 
                             setFeedback(prev => prev + parsedData.text);
                        }
                    } catch (e) {
                        console.warn('Failed to parse streamed JSON data:', jsonDataString, e);
                    }
                }
            } // End of for-loop (lines)
            if (errorEncounteredInStream) break; // Break from inner while-loop (eventBlock processing)
        } // End of inner while-loop (eventBlock processing)

        if (errorEncounteredInStream) {
             setLoading(false); // Ensure loading is stopped
             setProcessingProgress("Error occurred during stream.");
             setModelThinking("Error processing stream.");
             // Cleanly close the reader if possible
             if (reader && typeof reader.cancel === 'function') {
                reader.cancel().catch(cancelError => console.warn("Error cancelling reader:", cancelError));
             }
             break; // Break from outer while-loop (reader.read())
        }
      } // End of outer while (true) for SSE stream
      // Success message will be set in the useEffect after parsing
    } catch (error) {
      console.error("Error during streaming submission:", error);
      setError({ type: "api_error", message: `Streaming Error: ${error.message}`, onRetry: handleSubmitForMarking });
      setProcessingProgress("Error occurred.");
      setModelThinking("Error during stream.");
    } finally {
      // setLoading will be set to false in the useEffect after feedback processing
      // This ensures history saving and parsing happens *after* all stream data is in.
    }
  }, [
    answer, question, subject, examBoard, questionType, userType, markScheme, totalMarks,
    textExtract, relevantMaterial, selectedModel, tier, 
    // Removed allSubjects, API_BASE_URL as they are outer scope values
    // Removed lastRequestDate, lastRequestTime, setDailyRequests, setLastRequestDate as they are not used directly
    modelLastRequestTimes, consumeToken,
    buildSystemPrompt, buildUserPrompt, // Assuming these are stable or correctly memoized
    relevantMaterialImage, relevantMaterialImageBase64, // Added image dependencies
    enableThinkingBudget, thinkingBudget, // Added thinking budget dependencies
    // No need for setFeedback, setGrade etc. here as they are handled by stream or useEffect
    setLoading, setActiveTab, 
    setModelLastRequestTimes, autoMaxTokens, maxTokens, 
    setSelectedModel, // Keep if used in onRetryFallback
    checkBackendStatus, // Added dependency
    setCurrentModelForRequest
  ]);

  // useEffect for post-processing feedback after streaming is complete and saving to history
  useEffect(() => {
    if (!loading && feedback.trim() !== "" && !error) { // Process only when loading is false, feedback is present, and no error
      let currentFeedback = feedback;
      let extractedGrade = "";
      let extractedMarkSchemeText = ""; // Renamed to avoid conflict with markScheme state if it's input
      let extractedAchievedMarks = null;

      const gradeMatch = currentFeedback.match(/\[GRADE:(\d+)\]/i);
      if (gradeMatch && gradeMatch[1]) {
        extractedGrade = gradeMatch[1];
        currentFeedback = currentFeedback.replace(gradeMatch[0], "").trim();
      }

      const marksMatch = currentFeedback.match(/\[MARKS:(\d+)\/(\d+)\]/i);
      if (marksMatch && marksMatch[1]) {
        extractedAchievedMarks = marksMatch[1];
        // If totalMarks wasn't set from input, try to get it from here
        if (!totalMarks && marksMatch[2]) {
          setTotalMarks(marksMatch[2]); // Update totalMarks state if detected
        }
        currentFeedback = currentFeedback.replace(marksMatch[0], "").trim();
      }
      
      // Assuming mark scheme is part of the main feedback body if not input separately
      // This parsing might need to be more robust depending on AI output format
      const markSchemePattern = /Mark Scheme:([\s\S]+?)(?=\n\n[A-Z]|Grade:|Marks:|$)/i; // More robust regex
      const markSchemeMatch = currentFeedback.match(markSchemePattern);
      if (markSchemeMatch && markSchemeMatch[1]) {
          extractedMarkSchemeText = markSchemeMatch[1].trim();
          // Remove it from the main feedback to avoid duplication if you display them separately
          // currentFeedback = currentFeedback.replace(markSchemeMatch[0], "").trim();
      }


      setGrade(extractedGrade);
      setAchievedMarks(extractedAchievedMarks);
      // If you have a separate state for the parsed mark scheme text:
      // setParsedMarkScheme(extractedMarkSchemeText);
      // For now, we assume `feedback` state holds the primary text, and `markScheme` state is for input.
      // If the AI generates a mark scheme and it's not from input, you might want to store it.
      // For this task, we'll assume the main `feedback` state contains everything not explicitly parsed out.
      
      setSuccess({ message: "Feedback processed and displayed!" });
      setProcessingProgress(""); // Clear progress
      setLoading(false); // Ensure loading is false

      // Save to history
      const newHistoryItem = {
        id: Date.now(),
        question,
        answer,
        feedback: feedback, // Full streamed feedback
        grade: extractedGrade,
        achievedMarks: extractedAchievedMarks,
        totalMarks: totalMarks || (marksMatch && marksMatch[2] ? marksMatch[2] : null), // Save total marks used
        markSchemeOutput: extractedMarkSchemeText, // Store the AI generated mark scheme if parsed
        subject, examBoard, questionType, userType,
        model: currentModelForRequestRef.current, // Use the model that was actually used
        tier,
        timestamp: new Date().toISOString(),
        relevantMaterial: relevantMaterial || "",
        markSchemeInput: markScheme || "", // This is the user-inputted mark scheme
        relevantMaterialImagePreview: relevantMaterialImage || null, // Save image if present
        settings: { autoMaxTokens, maxTokens, enableThinkingBudget, thinkingBudget } // Add relevant settings
      };
      setHistory(prevHistory => [newHistoryItem, ...prevHistory.slice(0, HISTORY_LIMIT - 1)]);

    } else if (loading && error) { // If an error occurred during loading/streaming
        setLoading(false); // Ensure loading is stopped on error too
        setProcessingProgress("Error occurred.");
    }
  }, [loading, feedback, error, question, answer, subject, examBoard, questionType, userType, markScheme, totalMarks, relevantMaterial, selectedModel, tier, autoMaxTokens, maxTokens, enableThinkingBudget, thinkingBudget, relevantMaterialImage, setHistory, setGrade, setAchievedMarks, setTotalMarks, setSuccess, setLoading, setProcessingProgress]);

  const generateMarkScheme = async () => {
    // Check if we have a question
    if (!question) {
      setError({
        type: "validation",
        message: "Please enter a question to generate a mark scheme"
      });
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess({
      message: "Generating mark scheme..."
    });
    
    // Variables for retry logic
    let retryCount = 0;
    const maxRetries = 3;
    let successFlag = false;
    const failedModels = new Set();
    const modelsToTry = [selectedModel, ...Object.values(FALLBACK_MODELS)];
    
    try {
      // We'll start with the selected model and fall back to others if needed
      let currentModel = selectedModel;
      let modelLabel = AI_MODELS.find(m => m.value === currentModel)?.label || currentModel;
      
      // Detect total marks if not already set
      const detectedMarks = !totalMarks ? detectTotalMarksFromQuestion(question) : null;
      const marksToUse = totalMarks || detectedMarks;

      const systemPrompt = `You are an experienced GCSE examiner for ${subject}. Create a detailed mark scheme for the provided question based on ${examBoard} examination standards. 
      Include clear assessment objectives, point-by-point criteria, level descriptors if applicable, and a total mark allocation. ${marksToUse ? `The question is out of ${marksToUse} marks.` : ''}
      IMPORTANT: Please provide the mark scheme in plain text format only. Do NOT use any Markdown formatting (e.g., no headings, bold text, lists, etc.).`;
      
      const userPrompt = `Please create a detailed mark scheme for this GCSE ${subject} question for the ${examBoard} exam board:
      
      QUESTION: ${question}
      ${marksToUse ? `
TOTAL MARKS: ${marksToUse}` : ''}
      
      FORMAT YOUR RESPONSE AS A PROFESSIONAL MARK SCHEME WITH:
      1. Clear assessment criteria
      2. Point-by-point allocation of marks
      3. Examples of acceptable answers where appropriate
      4. Level descriptors for extended responses
      5. Total mark allocation`;
      
      let response;
      let data;

      if (currentModel === "gemini-2.5-flash-preview-05-20") {
        const requestBody = {
          contents: [
            {
              parts: [
                {
                  text: `System: ${systemPrompt}\n\nUser: ${userPrompt}`
                }
              ]
            }
          ],
          generationConfig: { // Added generationConfig for consistency, can be tuned
            temperature: 0.3
          }
        };
         // Add thinking config if enabled (though less critical for mark scheme generation)
        if (enableThinkingBudget && thinkingBudget > 0 && DEFAULT_THINKING_BUDGETS[currentModel]) {
          requestBody.config = {
            thinkingConfig: {
              thinkingBudget: thinkingBudget
            }
          };
        }
        
        try {
          // Use the CORRECT backend URL when on GitHub Pages
          const isGitHubPagesEnv = typeof window !== 'undefined' && 
            (window.location.hostname.includes('github.io') || window.location.hostname === 'beenycool.github.io');
            
                     // Always use the remote server for GitHub Pages
           // The backend server REQUIRES the /api prefix in the URL
           const geminiApiUrl = isGitHubPagesEnv 
             ? 'https://beenycool-github-io.onrender.com/api/gemini/generate'
             : constructApiUrl('gemini/generate');
          
          console.log('Sending Gemini generate request to:', geminiApiUrl);
          
          response = await fetch(geminiApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
            signal: AbortSignal.timeout(60000)
          });
          
          // If we get a 400 error with the specific model ID, try the fallback endpoint
          if (!response.ok && response.status === 400) {
            const errorText = await response.text();
            if (errorText.includes("not a valid model ID")) {
              console.warn(`Model ${currentModel} not supported by direct Gemini API, falling back to standard chat API`);
              
              // Fallback to using the standard chat API endpoint
              // Use the CORRECT backend URL when on GitHub Pages
              const isGitHubPagesEnv = typeof window !== 'undefined' && 
                (window.location.hostname.includes('github.io') || window.location.hostname === 'beenycool.github.io');
                
                             // Always use the remote server for GitHub Pages
               // The backend server REQUIRES the /api prefix in the URL
              const chatApiUrl = isGitHubPagesEnv 
                ? 'https://beenycool-github-io.onrender.com/api/chat/completions'
                : constructApiUrl('chat/completions');
              
              console.log('Falling back to chat completions API:', chatApiUrl);
              
              response = await fetch(chatApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  model: FALLBACK_MODELS[currentModel], // Use a fallback model
                  messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                  ],
                  temperature: 0.3
                }),
                signal: AbortSignal.timeout(60000)
              });
            } else {
              throw new Error(`Mark scheme generation failed with Gemini API: ${errorText}`);
            }
          }
        } catch (error) {
          throw error; // Re-throw to be handled by the main try/catch
        }
      } else if (currentModel.startsWith("openai/") || currentModel.startsWith("xai/")) {
        // GitHub models API for GitHub and Grok models
        // Use the CORRECT backend URL when on GitHub Pages
        const isGitHubPagesEnv = typeof window !== 'undefined' && 
          (window.location.hostname.includes('github.io') || window.location.hostname === 'beenycool.github.io');
          
                 // Always use the remote server for GitHub Pages
         // The backend server REQUIRES the /api prefix in the URL
        const githubApiUrl = isGitHubPagesEnv 
          ? 'https://beenycool-github-io.onrender.com/api/github/completions'
          : constructApiUrl('github/completions');
        
        console.log('Sending GitHub completions request to:', githubApiUrl);
        
        response = await fetch(githubApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: currentModel.startsWith("openai/") || currentModel.startsWith("xai/") 
              ? currentModel 
              : "xai/grok-3", // Default to Grok if model pattern doesn't match
            messages: [
              { role: "system", content: systemPrompt }, // Changed from "developer" to "system" for compatibility
              { role: "user", content: userPrompt }
            ],
            temperature: 0.7,
            top_p: 1.0
          }),
          signal: AbortSignal.timeout(60000) // 60 second timeout
        });
      } else {
        const chatApiUrl = constructApiUrl('chat/completions');
        console.log('Sending chat completions request to:', chatApiUrl);
        
        response = await fetch(chatApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: currentModel,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: 0.3
          }),
          signal: AbortSignal.timeout(60000) // 60 second timeout
        });
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Unknown error occurred";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error?.message || errorJson.message || JSON.stringify(errorJson);
        } catch (e) {
          errorMessage = errorText || response.statusText;
        }
        
        throw new Error(`Mark scheme generation failed: ${errorMessage}`);
      }
      
      data = await response.json();
      
      // Extract the response content
      let markSchemeText = "";
      
      // Log the data structure for debugging
      console.log("API response format:", Object.keys(data).join(", "));
      
      try {
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
          // Gemini API format
          if (data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
            markSchemeText = data.candidates[0].content.parts[0].text;
            console.log("Using data.candidates[0].content.parts[0].text format");
          } else if (typeof data.candidates[0].content.text === 'string') {
            markSchemeText = data.candidates[0].content.text;
            console.log("Using data.candidates[0].content.text format");
          }
        } else if (data.choices && data.choices[0] && data.choices[0].message) {
          // Standard OpenAI-compatible API format
          markSchemeText = data.choices[0].message.content;
          console.log("Using data.choices[0].message.content format");
        } else if (data.content) {
          // Simple content format
          markSchemeText = data.content;
          console.log("Using data.content format");
        } else if (typeof data === 'object' && Object.keys(data).length > 0) {
          // Try to extract any text content from unknown format
          const extractTextFromObject = (obj) => {
            if (typeof obj === 'string') return obj;
            if (!obj || typeof obj !== 'object') return '';
            
            // Check for content key
            if (obj.content && typeof obj.content === 'string') return obj.content;
            
            // Check for text key
            if (obj.text && typeof obj.text === 'string') return obj.text;
            
            // Check for message.content
            if (obj.message && obj.message.content && typeof obj.message.content === 'string') {
              return obj.message.content;
            }
            
            // Try to find any string that might be the content
            for (const key in obj) {
              if (typeof obj[key] === 'string' && obj[key].length > 100) {
                return obj[key]; // Assumes large string is content
              }
              
              if (typeof obj[key] === 'object') {
                const extracted = extractTextFromObject(obj[key]);
                if (extracted) return extracted;
              }
            }
            
            return '';
          };
          
          markSchemeText = extractTextFromObject(data);
          if (markSchemeText) {
            console.log("Extracted content from unknown format");
          }
        }
      } catch (e) {
        console.error("Error parsing API response:", e);
      }
      
      if (!markSchemeText) {
        console.warn("Unexpected API response format for mark scheme:", data);
        throw new Error("Unable to extract mark scheme text from API response");
      }
      
      // Update the mark scheme field
      setMarkScheme(markSchemeText);
      setSuccess({
        message: "Mark scheme generated successfully!"
      });
      successFlag = true;
      
    } catch (error) {
      console.error("Error generating mark scheme:", error);
      
      if (error.name === 'AbortError') {
        setError({
          type: "timeout", 
          message: "Mark scheme generation timed out.",
          onRetry: generateMarkScheme
        });
      } else {
        setError({
          type: "api_error",
          message: `Failed to generate mark scheme: ${error.message}`,
          onRetry: generateMarkScheme
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setMarkScheme("");
    setImage(null);
    setTextExtract("");
    setRelevantMaterial("");
    setRelevantMaterialImage(null);
    setRelevantMaterialImageBase64(null);
    setTotalMarks("");
    setFeedback("");
    setGrade("");
    setAchievedMarks(null);
    setError(null);
    setSuccess(null);
    // Clear drafts from localStorage
    localStorage.removeItem(LOCALSTORAGE_KEYS.QUESTION);
    localStorage.removeItem(LOCALSTORAGE_KEYS.ANSWER);
    // Optionally reset preferences to default if desired, or leave them persisted
    // setSubject("english"); localStorage.setItem(LOCALSTORAGE_KEYS.SUBJECT, "english");
    // setExamBoard("aqa"); localStorage.setItem(LOCALSTORAGE_KEYS.EXAM_BOARD, "aqa");
    // setSelectedModel("google/gemini-2.5-pro-exp-03-25"); localStorage.setItem(LOCALSTORAGE_KEYS.MODEL, "google/gemini-2.5-pro-exp-03-25");
    // setTier("higher"); localStorage.setItem(LOCALSTORAGE_KEYS.TIER, "higher");

    toast.success("Form has been reset and drafts cleared");
  };

  // TopBar component
  const TopBar = ({ version = "2.1.0", backendStatus, remainingTokens }) => {
    return (
      <div className="sticky top-0 z-10 flex items-center justify-between py-2 px-4 border-b border-border bg-card shadow-sm backdrop-blur-sm bg-opacity-90">
        <div className="flex items-center space-x-4">
          <div className="font-semibold text-xl">AI GCSE Marker</div>
          <div className="text-xs text-muted-foreground hidden sm:block">v{version}</div>
          {backendStatus && (
            <div className="hidden sm:flex items-center space-x-1">
              <div className={`h-2 w-2 rounded-full ${
                backendStatus === 'online' ? 'bg-green-500' : 
                backendStatus === 'rate_limited' ? 'bg-yellow-500' : 
                'bg-red-500'
              }`}></div>
              <div className="text-xs text-muted-foreground">{
                backendStatus === 'online' ? 'API Connected' : 
                backendStatus === 'rate_limited' ? 'API Rate Limited' : // More specific message
                'API Offline'
              }</div>
            </div>
          )}
           {/* ADDED: Remaining Tokens Display */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-xs text-muted-foreground hidden sm:flex items-center">
                  <Zap size={12} className="mr-1" /> 
                  <span>{remainingTokens} requests left</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {/* Removed: <p>Daily request limit: 500. Resets midnight.</p> */}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setShowKeyboardShortcuts(true)}
          >
            <Keyboard size={18} />
            <span className="sr-only">Keyboard shortcuts</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setShowGuide(!showGuide)}
            // ref={node => setHelpButtonRef(node)} // Ref seems unused here, can be removed if showHelp is also unused.
          >
            <HelpCircle size={18} />
            <span className="sr-only">Help</span>
          </Button>
        </div>
      </div>
    );
  };

  // ADDED: Function to show subject guidance
  const handleShowSubjectGuidance = () => {
    const guidance = getSubjectGuidance(subject, examBoard);
    setCurrentSubjectGuidance(guidance || "No specific guidance available for the current selection.");
    setShowSubjectGuidanceDialog(true);
  };

  // ADDED: Handler for bulk file upload
  const handleBulkFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBulkFile(file);
      const fileType = file.name.split('.').pop().toLowerCase();
      // Show appropriate message based on file type
      toast.info(`File "${file.name}" selected. Ready to process.`);
      // Clear previous bulk items and results
      setBulkItems([]);
      setBulkResults([]);
    }
  };

  // Function to process a single bulk item - Defined within AIMarker component scope
  const processSingleBulkItem = async (itemData, itemIndex, totalItemsInBulk) => {
    toast.info(`Processing item ${itemIndex + 1}/${totalItemsInBulk}: ${itemData.question?.substring(0,30)}...`);

    const currentModelForItem = itemData.model;
    const modelRateLimit = MODEL_RATE_LIMITS[currentModelForItem] || 10000;
    const now = Date.now();

    const globalLastReqTime = modelLastRequestTimes['global_request_time'] || 0;
    if (now - globalLastReqTime < 5000) {
      const waitTime = Math.ceil((5000 - (now - globalLastReqTime)) / 1000);
      toast.warning(`Global rate limit: Waiting ${waitTime}s.`);
      await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
    }

    const modelLastReq = modelLastRequestTimes[currentModelForItem] || 0;
    if (now - modelLastReq < modelRateLimit) {
      const waitTime = Math.ceil((modelRateLimit - (now - modelLastReq)) / 1000);
      toast.warning(`Rate limit for ${AI_MODELS.find(m => m.value === currentModelForItem)?.label || currentModelForItem}: Waiting ${waitTime}s.`);
      await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
    }
    
    setModelLastRequestTimes(prev => ({ 
      ...prev, 
      [currentModelForItem]: Date.now(),
      'global_request_time': Date.now() 
    }));

    // Optional: Consume token if daily limits apply to bulk items
    // if (!consumeToken()) { 
    //   return { error: "Daily request limit reached.", feedback: null, grade: null, modelName: currentModelForItem };
    // }

    const buildSystemPromptForItem = () => {
      let basePrompt = `You are an experienced GCSE ${itemData.subject} examiner. Your task is to provide detailed, constructive feedback for ${itemData.userType === 'teacher' ? 'assessment purposes' : 'student learning'} following these guidelines:\n\n1. ASSESSMENT CRITERIA:\n- Accuracy of content (subject knowledge)\n- Clarity and structure of response\n- Use of evidence/examples\n- Depth of analysis (where applicable)\n- Technical accuracy (spelling, grammar, terminology)`;
      const currentSubjectDetails = allSubjects.find(s => s.value === itemData.subject);
      if (currentSubjectDetails?.hasTiers) {
        basePrompt += `\n- This is a ${itemData.tier?.toUpperCase()} tier question`;
      }
      basePrompt += `\n\n2. FEEDBACK STRUCTURE:\na) Performance overview that addresses the overall quality of the answer (2-3 sentences)\nb) 3-4 specific strengths with concrete examples from the student's work, using phrases like "You demonstrated...", "Your analysis of...", or "I was particularly impressed by..."\nc) 3-4 specific areas for improvement using the "WWW/EBI" format (What Went Well/Even Better If), with each point structured as:\n   * Clear identification of the issue\n   * Evidence from the student's work\n   * Specific, achievable action to improve\n   * Link to how this would affect their grade\nd) Clear progression pathway that explains exactly what would be needed to achieve the next grade level\ne) GCSE grade (9-1) in the format: [GRADE:X] where X is the grade number, with a brief justification of the grade awarded`;
      
      // Check for detected marks if totalMarks is not provided
      const detectedMarks = !itemData.totalMarks ? detectTotalMarksFromQuestion(itemData.question) : null;
      const marksToUse = itemData.totalMarks || detectedMarks;
      
          if (marksToUse) {
      basePrompt += `\nf) Marks achieved in the format: [MARKS:Y/${marksToUse}] where Y is the number of marks achieved`;
    }
    
    // Add mark scheme analysis instructions if provided
    if (itemData.markScheme) {
      basePrompt += `\n\n3. MARK SCHEME ANALYSIS:
- Approach the mark scheme like an examiner, using precise analytical language
- Assess each assessment objective (AO) point-by-point with specific examples:
  * For each point awarded: "Credit given for [specific criteria] as evidenced by [exact quote/reference from answer]"
  * For each point missed: "No credit for [specific criteria] because [specific explanation]"
- Follow a structured marking pattern using annotations: 
  * ✓ = criterion fully met with specific highlighted evidence
  * ~ = criterion partially met with explanation of what's missing
  * ✗ = criterion not met with specific guidance for improvement
- Use precise examiner language (e.g., "demonstrates comprehensive understanding," "shows limited analysis," "lacks sufficient development")
- Award marks according to level descriptors, explaining why the answer falls into a particular band
- Clearly justify the final mark total with reference to the mark scheme bands`;
    }
    
    if (itemData.subject === "maths") {
        basePrompt += `\n\n4. MATHEMATICAL NOTATION:\n- Use LaTeX notation for mathematical expressions enclosed in $ $ for inline formulas and as separate blocks for complex formulas\n- Example inline: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$\n- Example block:\n$$\nx = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\n$$\n- Format solutions step-by-step with clear explanations\n- Number equations and reference them in your feedback`;
      } else {
        basePrompt += `\n\n4. SUBJECT-SPECIFIC GUIDANCE:\n${getSubjectGuidance(itemData.subject, itemData.examBoard)}\n
5. PROFESSIONAL MARKING APPROACH:
- Use exam board-specific terminology and assessment language
- Focus on assessment objectives (AOs) relevant to ${itemData.subject}
- Implement a tiered marking approach - first identify the band/level, then refine the exact mark within that band
- Use marginal annotations to highlight specific points (e.g., "AO2 - Strong analysis here", "Limited evidence", "Good application of knowledge")
- Balance critical assessment with encouraging language that motivates improvement
- Ensure developmental feedback is specific and actionable
- Apply a consistent marking standard throughout the assessment
- Acknowledge partial understanding where appropriate`;
      }
      if (currentModelForItem === "microsoft/mai-ds-r1:free") { 
        basePrompt += `\n\n5. THINKING PROCESS:\n- First, analyze the student's answer carefully...\n- Mark your thinking process with [THINKING] and your final feedback with [FEEDBACK]`;
      }
      return basePrompt;
    };

    const buildUserPromptForItem = () => {
      let userPromptText = `Please mark this GCSE ${itemData.subject} answer.\n\nQUESTION:\n${itemData.question}\n\nSTUDENT ANSWER:\n${itemData.answer}\n\n`;
      
      // Check for detected marks if totalMarks is not provided
      const detectedMarks = !itemData.totalMarks ? detectTotalMarksFromQuestion(itemData.question) : null;
      const marksToUse = itemData.totalMarks || detectedMarks;
      
      if (marksToUse) {
        userPromptText += `TOTAL MARKS: ${marksToUse}\n\n`;
      }
      
      userPromptText += `INSTRUCTIONS:\n1. Mark this answer as an experienced GCSE ${itemData.subject} examiner would for the ${itemData.examBoard} exam board\n2. Follow a methodical assessment process aligned with official marking standards\n3. Use professional examiner language and annotation techniques throughout\n4. Provide detailed, constructive feedback with specific evidence from the student's work\n5. Structure feedback using the WWW/EBI format (What Went Well/Even Better If)\n6. Assign a GCSE grade (9-1) in the format [GRADE:X] with clear justification\n7. Include specific guidance for improving to the next grade level${itemData.markScheme ? `\n8. Apply a rigorous mark-by-mark assessment using the provided mark scheme\n9. Annotate each assessment point with appropriate symbols (✓, ~, ✗)\n10. Reference specific mark scheme criteria and bands in your assessment\n11. Demonstrate clear reasoning for each mark awarded or withheld` : ''}`;
      
      if (marksToUse) {
        userPromptText += `\n4. Assign marks in the format [MARKS:Y/${marksToUse}]`;
      }
      
      return userPromptText;
    };

    try {
      const systemPromptContent = buildSystemPromptForItem();
      const userPromptContent = buildUserPromptForItem();

      let response;
      
      if (currentModelForItem.startsWith("openai/") || currentModelForItem.startsWith("xai/")) {
        // GitHub models API for GitHub and Grok models
        response = await fetch(`${API_BASE_URL}/api/github/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: currentModelForItem.startsWith("openai/") || currentModelForItem.startsWith("xai/") 
              ? currentModelForItem 
              : "xai/grok-3", // Default to Grok if model pattern doesn't match
            messages: [{ role: "system", content: systemPromptContent }, { role: "user", content: userPromptContent }],
            max_tokens: autoMaxTokens ? undefined : maxTokens, 
            temperature: 0.7,
            top_p: 1.0
          }),
        });
      } else {
        // Standard API for other models
        response = await fetch(`${API_BASE_URL}/api/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: currentModelForItem,
            messages: [{ role: "system", content: systemPromptContent }, { role: "user", content: userPromptContent }],
            max_tokens: autoMaxTokens ? undefined : maxTokens, 
            temperature: 0.7
          }),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        let parsedErrorMessage = errorText;
        try { parsedErrorMessage = JSON.parse(errorText).error?.message || JSON.parse(errorText).message || errorText; } catch(e){}
        // Consider fallback model logic for bulk items here if desired.
        return { error: `API Error (Item ${itemIndex + 1}): ${parsedErrorMessage} (Model: ${currentModelForItem})`, feedback: null, grade: null, modelName: currentModelForItem };
      }

      const responseData = await response.json();
      let apiResponseContent = responseData.choices?.[0]?.message?.content || responseData.content || responseData.text || responseData.answer || responseData.response || "";
      let itemModelThinking = [];

      if (currentModelForItem === "microsoft/mai-ds-r1:free") {
        const thinkingBlockMatch = apiResponseContent.match(/\[THINKING\]([\s\S]*?)(?:\[FEEDBACK\]|$)/i);
        if (thinkingBlockMatch?.[1]) {
          itemModelThinking = thinkingBlockMatch[1].trim().split(/\n\s*\n/).map(s => s.trim());
          const feedbackBlockMatch = apiResponseContent.match(/\[FEEDBACK\]([\s\S]*?)$/i);
          apiResponseContent = feedbackBlockMatch?.[1]?.trim() || apiResponseContent; 
        }
      }

      const gradeValueMatch = apiResponseContent.match(/\[GRADE:(\d+)\]/i);
      const itemGrade = gradeValueMatch?.[1] || null;
      const marksValueMatch = apiResponseContent.match(/\[MARKS:(\d+)\/(\d+)\]/i);
      const itemAchievedMarks = marksValueMatch?.[1] || null;
      const itemTotalMarks = marksValueMatch?.[2] || itemData.totalMarks;
      
      const finalFeedback = apiResponseContent.replace(/\[GRADE:\d+\]/gi, '').replace(/\[MARKS:\d+\/\d+\]/gi, '').trim();
      
      return {
        feedback: finalFeedback,
        grade: itemGrade,
        achievedMarks: itemAchievedMarks,
        totalMarks: itemTotalMarks,
        modelThinking: itemModelThinking,
        modelName: currentModelForItem,
        error: null
      };
    } catch (error) {
      console.error(`Error in processSingleBulkItem (Item ${itemIndex + 1}):`, error);
      return { error: `Processing failed (Item ${itemIndex + 1}): ${error.message}`, feedback: null, grade: null, modelName: currentModelForItem };
    }
  };

  // MODIFIED: handleProcessBulkFile - to support multiple file formats
  const handleProcessBulkFile = async () => {
    if (!bulkFile) {
      toast.error("Please select a file for bulk processing.");
      return;
    }
    if (bulkProcessing) {
      toast.warning("Bulk processing is already active.");
      return;
    }

    // Reset control flags
    bulkProcessingRef.current = { cancel: false, pause: false };
    setIsBulkProcessingPaused(false);
    
    setBulkProcessing(true);
    setBulkResults([]);
    setBulkProgress({ processed: 0, total: 0, currentItem: null });
    setActiveTab("bulk");

    try {
      toast.info(`Initiating bulk processing for: "${bulkFile.name}"...`);
      
      // Determine file type by extension
      const fileType = bulkFile.name.split('.').pop().toLowerCase();
      
      // Process based on file type
      if (fileType === 'csv') {
        // Process CSV file with PapaParse
        if (typeof Papa === 'undefined') {
          toast.error("CSV Parsing library (PapaParse) is not available. Please ensure it's installed.");
          setBulkProcessing(false);
          return;
        }
        
        Papa.parse(bulkFile, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            await processParseResults(results.data);
          },
          error: (error) => {
            console.error("CSV parsing error:", error);
            toast.error(`CSV parsing failed: ${error.message}`);
            setBulkResults([{ itemIndex: -1, error: `CSV parsing error: ${error.message}` }]);
            setBulkProcessing(false);
          }
        });
      } else if (fileType === 'json') {
        // Process JSON file
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const jsonData = JSON.parse(e.target.result);
            // Handle both array and object formats
            const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
            await processParseResults(dataArray);
          } catch (error) {
            console.error("JSON parsing error:", error);
            toast.error(`JSON parsing failed: ${error.message}`);
            setBulkResults([{ itemIndex: -1, error: `JSON parsing error: ${error.message}` }]);
            setBulkProcessing(false);
          }
        };
        reader.onerror = (error) => {
          console.error("File reading error:", error);
          toast.error(`File reading failed: ${error.message}`);
          setBulkProcessing(false);
        };
        reader.readAsText(bulkFile);
      } else if (fileType === 'txt') {
        // Process plain text file - assume one question/answer pair per line with tab or comma separation
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const textData = e.target.result;
            const lines = textData.split(/\r?\n/).filter(line => line.trim() !== '');
            
            const parsedItems = lines.map((line, idx) => {
              // Try to split by tab first, then by comma if no tab
              const parts = line.includes('\t') ? line.split('\t') : line.split(',');
              
              if (parts.length < 2) {
                return { error: `Line ${idx + 1}: Could not parse question and answer` };
              }
              
              return {
                question: parts[0].trim(),
                answer: parts[1].trim(),
                // Optional fields if provided in subsequent columns
                subjectFromFile: parts[2]?.trim(),
                examBoardFromFile: parts[3]?.trim(),
                modelFromFile: parts[4]?.trim(),
                tierFromFile: parts[5]?.trim(),
                totalMarksFromFile: parts[6]?.trim()
              };
            }).filter(item => !item.error && item.question && item.answer);
            
            if (parsedItems.length === 0) {
              toast.error("No valid items found in the text file. Format should be: Question[tab]Answer");
              setBulkProcessing(false);
              return;
            }
            
            await processParseResults(parsedItems);
          } catch (error) {
            console.error("Text parsing error:", error);
            toast.error(`Text parsing failed: ${error.message}`);
            setBulkResults([{ itemIndex: -1, error: `Text parsing error: ${error.message}` }]);
            setBulkProcessing(false);
          }
        };
        reader.onerror = (error) => {
          console.error("File reading error:", error);
          toast.error(`File reading failed: ${error.message}`);
          setBulkProcessing(false);
        };
        reader.readAsText(bulkFile);
      } else {
        toast.error(`Unsupported file format: .${fileType}. Please use CSV, JSON, or TXT files.`);
        setBulkProcessing(false);
      }
    } catch (error) {
      console.error("Bulk processing setup error:", error);
      toast.error(`Bulk processing setup failed: ${error.message}`);
      setBulkResults(prev => [...prev, { itemIndex: -1, error: error.message }]);
      setBulkProcessing(false);
      setBulkProgress(prev => ({ ...prev, currentItem: null }));
    }
    
    // MODIFIED: Process parsed data with parallel processing
    async function processParseResults(parsedItems) {
      const validItems = parsedItems.map((item, idx) => ({
        id: `item-${idx}`,
        question: item.Question || item.question,
        answer: item.Answer || item.answer,
        subjectFromFile: item.Subject || item.subject || item.subjectFromFile,
        examBoardFromFile: item.ExamBoard || item.examBoard || item.examBoardFromFile,
        modelFromFile: item.Model || item.model || item.modelFromFile,
        tierFromFile: item.Tier || item.tier || item.tierFromFile,
        totalMarksFromFile: item.TotalMarks || item.totalMarks || item.totalMarksFromFile
      })).filter(item => item.question && item.question.trim() !== '' && item.answer && item.answer.trim() !== '');

      if (validItems.length === 0) {
        toast.error("No valid items found in the file. Each item must have Question and Answer fields.");
        setBulkProcessing(false);
        return;
      }

      setBulkItems(validItems);
      setBulkProgress(prev => ({ ...prev, total: validItems.length, processed: 0, currentItem: null }));

      // Track active and completed tasks
      let results = [];
      let activeTaskCount = 0;
      let nextItemIndex = 0;
      let completedCount = 0;
      
      // Process items in parallel based on parallelism setting
      const processNextItems = async () => {
        // Continue processing until all items are processed or cancelled
        while (nextItemIndex < validItems.length && !bulkProcessingRef.current.cancel) {
          // Check if processing is paused
          if (bulkProcessingRef.current.pause) {
            await new Promise(resolve => setTimeout(resolve, 500));
            continue;
          }
          
          // Check if we've reached the parallelism limit
          if (activeTaskCount >= parallelProcessing) {
            await new Promise(resolve => setTimeout(resolve, 100));
            continue;
          }
          
          // Start a new task
          const itemIndex = nextItemIndex++;
          activeTaskCount++;
          
          // Process the item
          processItem(itemIndex).then(() => {
            activeTaskCount--;
            completedCount++;
            
            // Update progress
            setBulkProgress(prev => ({ 
              ...prev, 
              processed: completedCount,
              currentItem: nextItemIndex < validItems.length ? nextItemIndex : null
            }));
            
            // Check if we're done
            if (completedCount >= validItems.length || nextItemIndex >= validItems.length) {
              if (!bulkProcessingRef.current.cancel) {
                toast.success("Bulk processing complete!");
              }
              setBulkProcessing(false);
              setIsBulkProcessingPaused(false);
            }
          });
        }
      };
      
      // Process a single item
      const processItem = async (itemIndex) => {
        const currentItem = validItems[itemIndex];
        
        // Check if cancelled
        if (bulkProcessingRef.current.cancel) {
          return;
        }
        
        const itemPayload = {
          question: currentItem.question,
          answer: currentItem.answer,
          subject: bulkSettingPreference === 'file' && currentItem.subjectFromFile ? currentItem.subjectFromFile : subject,
          examBoard: bulkSettingPreference === 'file' && currentItem.examBoardFromFile ? currentItem.examBoardFromFile : examBoard,
          model: bulkSettingPreference === 'file' && currentItem.modelFromFile && AI_MODELS.find(m => m.value === currentItem.modelFromFile) ? currentItem.modelFromFile : selectedModel,
          tier: bulkSettingPreference === 'file' && currentItem.tierFromFile ? currentItem.tierFromFile : tier,
          totalMarks: bulkSettingPreference === 'file' && currentItem.totalMarksFromFile ? currentItem.totalMarksFromFile : totalMarks,
          userType: userType,
        };
        
        const result = await processSingleBulkItem(itemPayload, itemIndex, validItems.length);
        
        // Add result to the results array
        results.push({
          itemIndex: itemIndex,
          question: currentItem.question,
          answer: currentItem.answer,
          feedback: result.feedback,
          grade: result.grade,
          achievedMarks: result.achievedMarks,
          totalMarks: result.totalMarks,
          modelName: result.modelName,
          error: result.error
        });
        
        // Update the results state
        setBulkResults([...results]);
      };
      
      // Start processing
      processNextItems();
    }
  };

  // ADDED: Handlers for batch processing controls
  const handlePauseBulkProcessing = () => {
    bulkProcessingRef.current.pause = true;
    setIsBulkProcessingPaused(true);
    toast.info("Bulk processing paused. Will complete current item before stopping.");
  };

  const handleResumeBulkProcessing = () => {
    bulkProcessingRef.current.pause = false;
    setIsBulkProcessingPaused(false);
    toast.info("Bulk processing resumed.");
  };

  const handleCancelBulkProcessing = () => {
    bulkProcessingRef.current.cancel = true;
    bulkProcessingRef.current.pause = false; // Unpause if paused to allow cancellation
    toast.info("Cancelling bulk processing after current item completes...");
  };

  // ADDED: Handler for viewing full item details
  const handleViewItemDetails = (item) => {
    setPreviewItem(item);
    setShowPreviewDialog(true);
  };

  // ADDED: Handler for changing parallelism
  const handleParallelismChange = (value) => {
    setParallelProcessing(value);
    toast.info(`Parallel processing set to ${value} simultaneous tasks`);
  };
  
  // ADDED: Handler for asking follow-up questions
  const handleAskFollowUp = () => {
    setShowFollowUpDialog(true);
    setFollowUpQuestion("");
    setFollowUpResponse("");
    // Use a different model for follow-up questions if the current one has issues
    // Prioritize the faster model for follow-ups
    if (selectedModel === "microsoft/mai-ds-r1:free") {
      const fastModel = "gemini-2.5-flash-preview-05-20";
      console.log(`Temporarily switching from ${selectedModel} to ${fastModel} for follow-up`);
      setSelectedModel(fastModel);
    }
  };
  
  // ADDED: Handler for submitting follow-up questions
  const handleSubmitFollowUp = async () => {
    if (!followUpQuestion.trim()) {
      toast.error("Please enter a question");
      return;
    }
    
    setFollowUpLoading(true);
    
    try {
      // Check if there are enough tokens
      if (!consumeToken()) {
        setFollowUpLoading(false);
        toast.error("Daily request limit reached");
        return;
      }
      
      // Check if backend is online
      if (backendStatusRef.current !== 'online') {
        setFollowUpLoading(false);
        toast.error("Backend API is not available. Please check connection status.");
        return;
      }
      
      console.log("Submitting follow-up question:", followUpQuestion);
      
      // Build the prompt for the follow-up question
      const promptText = `You previously provided feedback on a student's GCSE ${subject} answer, giving them a grade ${grade || 'N/A'}. 
The student has a follow-up question about your feedback: "${followUpQuestion}"

Your feedback was:
---
${feedback}
---

Please respond to their question clearly and constructively. Keep your answer concise but helpful. Remember you're speaking directly to the student.`;
      
      // Make a request to the API
      let response;
      
      // Use different endpoints and request formats based on the model
      if (selectedModel === "gemini-2.5-flash-preview-05-20") {
        // Format for Gemini direct API
        const requestBody = {
          contents: [
            {
              parts: [
                {
                  text: promptText
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7
          }
        };
        
        // Add thinking config if enabled
        if (enableThinkingBudget && thinkingBudget > 0) {
          requestBody.config = {
            thinkingConfig: {
              thinkingBudget: thinkingBudget
            }
          };
        }
        
        console.log("Sending follow-up to Gemini API:", requestBody);
        
        const maxRetriesFollowUp = 3;
        let retryCountFollowUp = 0;
        let successFollowUp = false;
        
        while (retryCountFollowUp < maxRetriesFollowUp && !successFollowUp) {
          try {
            response = await fetch(`${API_BASE_URL}/api/gemini/generate`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
              signal: AbortSignal.timeout(60000)
            });
            successFollowUp = true; // If fetch is successful, mark as success
          } catch (error) {
            if (error.name === 'AbortError' || (error.message && error.message.toLowerCase().includes('timeout'))) {
              retryCountFollowUp++;
              console.log(`Retrying Gemini API request in handleSubmitFollowUp (${retryCountFollowUp}/${maxRetriesFollowUp})...`);
              if (retryCountFollowUp < maxRetriesFollowUp) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
              } else {
                // If all retries fail, rethrow the error or handle it as a final failure
                throw error;
              }
            } else {
              throw error; // For non-timeout errors, rethrow immediately
            }
          }
        }
      } else if (selectedModel.startsWith("openai/") || selectedModel.startsWith("xai/")) {
        // GitHub models API for GitHub and Grok models
        response = await fetch(`${API_BASE_URL}/api/github/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: selectedModel.startsWith("openai/") || selectedModel.startsWith("xai/") 
              ? selectedModel 
              : "xai/grok-3", // Default to Grok if model pattern doesn't match
            messages: [
              {
                role: "system",
                content: `You are an AI tutor helping a student understand their GCSE feedback. Be clear, concise, and supportive.`
              },
              {
                role: "user",
                content: promptText
              }
            ],
            max_tokens: autoMaxTokens ? undefined : maxTokens,
            temperature: 0.7,
            top_p: 1.0
          }),
          // Add a timeout
          signal: AbortSignal.timeout(60000)
        });
      } else {
        // Standard API request for other models
        response = await fetch(`${API_BASE_URL}/api/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              {
                role: "system",
                content: `You are an AI tutor helping a student understand their GCSE feedback. Be clear, concise, and supportive.`
              },
              {
                role: "user",
                content: promptText
              }
            ],
            max_tokens: autoMaxTokens ? undefined : maxTokens,
            temperature: 0.7
          }),
          // Add a timeout
          signal: AbortSignal.timeout(60000)
        });
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response for follow-up:", errorText);
        let errorMessage = "Error processing follow-up question";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error?.message || errorJson.message || errorText;
        } catch (e) {
          errorMessage = errorText;
        }
        throw new Error(errorMessage);
      }
      
      const responseData = await response.json();
      console.log("Follow-up response data:", responseData);
      
      let responseContent = "";
      
      // Handle different API response formats
      if (selectedModel === "gemini-2.5-flash-preview-05-20") {
        // Extract content from Gemini API response
        if (responseData.candidates && responseData.candidates[0] && responseData.candidates[0].content) {
          const content = responseData.candidates[0].content;
          if (content.parts && content.parts[0] && content.parts[0].text) {
            responseContent = content.parts[0].text;
          }
        }
      } else {
        // Standard API response format
        responseContent = responseData.choices?.[0]?.message?.content || 
                         responseData.content || 
                         responseData.text || 
                         responseData.answer || 
                         responseData.response || "";
      }
      
      if (!responseContent) {
        console.error("Empty or missing response content:", responseData);
        throw new Error("Received empty response from API");
      }
      
      setFollowUpResponse(responseContent);
      
    } catch (error) {
      console.error('Error processing follow-up question:', error);
      
      // Handle different error types
      if (error.name === 'AbortError') {
        toast.error("The request timed out. The server took too long to respond.");
      } else if (error.message.includes("rate limit") || error.message.includes("429")) {
        toast.error(`Rate limit exceeded. Please try again in a minute or try a different model.`);
      } else {
        toast.error(`Failed to process follow-up: ${error.message}`);
      }
      
      // Set a basic response to indicate the error
      setFollowUpResponse("I'm sorry, I couldn't process your question due to a technical issue. Please try again later or try a different model.");
    } finally {
      setFollowUpLoading(false);
    }
  };

      // Add a function to create a middleware API endpoint in Next.js    const createMiddlewareApiEndpoint = async () => {        try {            // Check if we're running in a browser environment            if (typeof window === 'undefined') return false;                        // Check if we're in static export mode            const isStaticExport = process.env.IS_STATIC_EXPORT === 'true';                        if (isStaticExport) {                console.log('Running in static export mode - API calls redirected to backend');        console.log(`Using API base URL: ${API_BASE_URL}`);        return true;            }                        try {        // Only try to use local API in development mode        const response = await fetch('/api/create-middleware', {                  method: 'POST',                  headers: {                      'Content-Type': 'application/json',                  },                  body: JSON.stringify({                      type: 'api_middleware',                      endpoints: ['auth/events', 'github/completions', 'chat/completions']                  })              });                            if (response.ok) {                  console.log('Successfully created middleware API endpoints');                  return true;              }      } catch (localApiError) {        console.warn('Local API middleware creation failed, falling back to remote API:', localApiError.message);                // If local API fails, try to check if the remote API is available        try {          const healthCheckUrl = constructApiUrl('health');          const healthCheck = await fetch(healthCheckUrl, {             method: 'GET',            headers: { 'Content-Type': 'application/json' }          });                    if (healthCheck.ok) {            console.log('Remote API is available, will use it instead of local API');            return true;          }        } catch (remoteApiError) {          console.error('Remote API health check failed:', remoteApiError.message);        }      }            return false;        } catch (error) {            console.error('Failed to create middleware API endpoint:', error);            // In static export, we want to gracefully handle this error            if (process.env.IS_STATIC_EXPORT === 'true') {                console.log('Running in static export mode - ignoring API middleware creation failure');                return true;            }            return false;        }    };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar version="2.1.3" backendStatus={backendStatusRef.current} remainingTokens={remainingRequestTokens} />
      
      {/* ADDED: OCR Preview Dialog (Sheet was mentioned, but Dialog is simpler here) */}
      <Dialog open={showOcrPreviewDialog} onOpenChange={(open) => {
        if (!open) {
          // If dialog is closed without confirming, reset the state
          setHasExtractedText(false);
        }
        setShowOcrPreviewDialog(open);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Review Extracted Text</DialogTitle>
            <DialogDescription>
              Review the text extracted from the image. You can edit it here before adding to your answer.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] w-full rounded-md border p-3 my-4">
            <Textarea 
              value={ocrTextPreview}
              onChange={(e) => setOcrTextPreview(e.target.value)}
              className="min-h-[280px] text-sm"
              placeholder="No text extracted or an error occurred."
            />
          </ScrollArea>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => {
              setShowOcrPreviewDialog(false);
              setHasExtractedText(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleConfirmOcrText}>Add to Answer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADDED: Subject Guidance Dialog */}
      <Dialog open={showSubjectGuidanceDialog} onOpenChange={setShowSubjectGuidanceDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Subject Specific Guidance</DialogTitle>
            <DialogDescription>
              Guidance for {allSubjects.find(s => s.value === subject)?.label} - {EXAM_BOARDS.find(eb => eb.value === examBoard)?.label}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] w-full rounded-md border p-3 my-4">
            <MathMarkdown>{currentSubjectGuidance}</MathMarkdown>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setShowSubjectGuidanceDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {showGuide && <QuickGuide onClose={() => setShowGuide(false)} />}
        
        {/* Backend alerts */}
        <EnhancedAlert 
          success={success} 
          error={error} 
          onRetryAction={{ 
            checkBackendStatus: refreshBackendStatusHook, 
            // setSelectedModel, // Pass if needed for manual model switch from alert
            // handleSubmitForMarking, // Pass if specific retries from alert need it
            // generateMarkScheme  // Pass if specific retries from alert need it
          }}
        />
        
        {/* Backend Status Checker */}
        <BackendStatusChecker onStatusChange={handleBackendStatusChange} />
        
        {detectedSubject && !hasManuallySetSubject.current && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm text-primary">
                Subject detected: <strong>{
                  allSubjects.find(s => s.value === detectedSubject)?.label || 'Unknown'
                }</strong>
              </span>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7 border-primary/20 hover:bg-primary/10"
                onClick={() => {
                  setSubject(detectedSubject);
                  hasManuallySetSubject.current = true;
                  setDetectedSubject(null); // Add this line to hide the notification
                }}
              >
                Accept
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7 text-muted-foreground"
                onClick={() => setDetectedSubject(null)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}
        
        {/* Keyboard shortcuts feedback */}
        <AnimatePresence>
          {shortcutFeedback && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed top-4 right-4 bg-background border border-border shadow-md text-foreground px-3 py-2 rounded-md z-50 text-sm"
            >
              {shortcutFeedback}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keyboard Shortcuts Dialog */}
        <KeyboardShortcuts 
          open={showKeyboardShortcuts} 
          onOpenChange={setShowKeyboardShortcuts} 
        />
        
        {/* Main UI content tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-12 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3"> {/* MODIFIED: Added Bulk Mark Tab */} 
                <TabsTrigger value="answer">Answer</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
                <TabsTrigger value="bulk">
                  Bulk Mark
                  <Badge variant="outline" className="ml-2 text-amber-600 border-amber-400 bg-amber-50 dark:bg-amber-900/30 text-xs font-semibold">Very Beta</Badge>
                </TabsTrigger> {/* ADDED */} 
              </TabsList>
              <TabsContent value="answer" className="pt-4 space-y-4">
                {/* Question input */}
                <div className="space-y-2">
                  <Label htmlFor="question" className="flex items-center justify-between">
                    <div>
                      <span>Question</span>
                      <span className="text-muted-foreground text-xs ml-1">(Required)</span>
                    </div>
                    <Badge variant="outline" className="font-normal text-xs">GCSE Level</Badge>
                  </Label>
                  <Textarea
                    id="question"
                    placeholder="Enter the question here..."
                    className="min-h-[60px]"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    ref={questionInputRef}
                  />
                </div>
                
                {/* Answer input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="answer">
                      <span>Your Answer</span>
                      <span className="text-muted-foreground text-xs ml-1">(Required)</span>
                    </Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => document.getElementById('image-upload').click()}
                      className="text-xs h-7 ml-2"
                      disabled={imageLoading}
                    >
                      {imageLoading ? (
                        <><Loader2 className="mr-1 h-3 w-3 animate-spin" /> Processing...</>
                      ) : (
                        <><Upload className="mr-1 h-3 w-3" /> Upload Image</>
                      )}
                    </Button>
                  </div>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={imageLoading}
                  />
                  <Textarea
                    id="answer"
                    placeholder="Enter your answer here..."
                    className="min-h-[150px]"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    ref={answerInputRef}
                  />
                  {image && !imageLoading && (
                    <div className="mt-2 flex items-center">
                      <Badge variant="outline" className="text-xs">
                        {image.name} ({Math.round(image.size / 1024)} KB)
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 ml-2"
                        onClick={() => setImage(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 ml-2"
                        onClick={handleProcessImage}
                      >
                        Process Image
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Meta inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Subject selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                    <Label htmlFor="subject" className="text-sm">Subject</Label>
                        <Button variant="link" size="sm" className="text-xs h-7 px-1 text-muted-foreground hover:text-primary" onClick={handleShowSubjectGuidance} tabIndex={-1}>
                            <HelpCircle className="mr-1 h-3 w-3" /> View Guidance
                        </Button>
                    </div>
                    <Select
                      value={subject}
                      onValueChange={(value) => {
                        if (value === 'custom') {
                          setIsAddingSubject(true);
                          return;
                        }
                        setSubject(value);
                        hasManuallySetSubject.current = true;
                        // Reset question type if subject changes, as types are subject-specific
                        setQuestionType("general"); 
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Common Subjects</SelectLabel>
                          {allSubjects.map((subj) => (
                            <SelectItem key={subj.value} value={subj.value}>
                              {subj.label}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom" className="text-primary">
                            + Add Custom Subject
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    
                    {isAddingSubject && (
                      <div className="mt-2 flex">
                        <Input
                          ref={customSubjectInputRef}
                          value={customSubject}
                          onChange={(e) => setCustomSubject(e.target.value)}
                          placeholder="Enter subject name"
                          className="text-sm"
                        />
                        <Button
                          size="sm"
                          className="ml-2 px-2"
                          onClick={addCustomSubject}
                          disabled={!customSubject.trim()}
                        >
                          Add
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="ml-1 px-2"
                          onClick={() => setIsAddingSubject(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Exam board selector */}
                  <div className="space-y-2">
                     <div className="flex items-center justify-between">
                    <Label htmlFor="examBoard" className="text-sm">Exam Board</Label>
                        {/* Can add another View Guidance button here if desired, or rely on the one by Subject */}
                    </div>
                    <Select
                      value={examBoard}
                      onValueChange={setExamBoard} // examBoard is now persisted
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an exam board" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXAM_BOARDS.map((board) => (
                          <SelectItem key={board.value} value={board.value}>
                            {board.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Tier selector - only for subjects with tiers */}
                  {allSubjects.find(s => s.value === subject)?.hasTiers && (
                    <div className="space-y-2">
                      <Label className="text-sm">Tier</Label>
                      <div className="flex space-x-2">
                        <Button
                          variant={tier === "higher" ? "default" : "outline"}
                          size="sm"
                          className="flex-1"
                          onClick={() => setTier("higher")} // tier is now persisted
                        >
                          Higher
                        </Button>
                        <Button
                          variant={tier === "foundation" ? "default" : "outline"}
                          size="sm"
                          className="flex-1"
                          onClick={() => setTier("foundation")} // tier is now persisted
                        >
                          Foundation
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Question type selector - conditionally show for English/AQA */}
                  {subject === "english" && examBoard === "aqa" && (
                    <div className="space-y-2">
                      <Label htmlFor="questionType" className="text-sm">Question Type</Label>
                      <Select
                        value={questionType}
                        onValueChange={setQuestionType} // Not persisted, but good practice to have handler
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                        <SelectContent>
                          {QUESTION_TYPES.english.aqa.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {/* User type selector */}
                  <div className="space-y-2">
                    <Label htmlFor="userType" className="text-sm">I am a</Label>
                    <Select
                      value={userType}
                      onValueChange={setUserType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        {USER_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Advanced Options */}
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="text-xs"
                  >
                    {showAdvancedOptions ? <ChevronUp className="mr-1 h-3 w-3" /> : <ChevronDown className="mr-1 h-3 w-3" />}
                    Advanced Options
                  </Button>
                  
                  {showAdvancedOptions && (
                    <div className="mt-3 space-y-4 border p-4 rounded-md bg-muted border-border">
                      {/* Mark scheme section */}
                      <div className="space-y-2">
                                                  <div className="flex justify-between items-center">
                            <div>
                              <Label htmlFor="markScheme" className="text-sm">Mark Scheme <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                Adding a mark scheme will enhance feedback with detailed criteria analysis
                              </div>
                            </div>
                            <div className="flex gap-2">

                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-7"
                              onClick={generateMarkScheme}
                              disabled={loading || !question || backendStatusRef.current !== 'online'}
                              ref={markSchemeButtonRef}
                            >
                              {loading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <FilePlus className="mr-1 h-3 w-3" />}
                              Generate
                            </Button>
                          </div>
                        </div>
                        <Textarea
                          id="markScheme"
                          placeholder="Enter mark scheme details..."
                          className="min-h-[100px]"
                          value={markScheme}
                          onChange={(e) => setMarkScheme(e.target.value)}
                        />
                      </div>
                      
                      {/* Total marks */}
                      <div className="space-y-2">
                        <Label htmlFor="totalMarks" className="text-sm">
                          Total Marks <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Input
                          id="totalMarks"
                          type="number"
                          placeholder="e.g., 20"
                          value={totalMarks}
                          onChange={(e) => setTotalMarks(e.target.value)}
                          className="max-w-[120px]"
                          ref={marksInputRef}
                        />
                        <p className="text-xs text-muted-foreground">
                          If not provided, system will attempt to detect total marks from the question (like "8 marks" or "[Total: 10]").
                        </p>
                      </div>
                      
                      {/* Text extract - mainly for English */}
                      {subject === "english" && (
                        <div className="space-y-2">
                          <Label htmlFor="textExtract" className="text-sm">
                            Text Extract <span className="text-muted-foreground text-xs">(Optional)</span>
                          </Label>
                          <Textarea
                            id="textExtract"
                            placeholder="Enter any text extract the question refers to..."
                            className="min-h-[100px]"
                            value={textExtract}
                            onChange={(e) => setTextExtract(e.target.value)}
                          />
                        </div>
                      )}
                      
                      {/* Relevant material */}
                      <div className="space-y-2">
                        <Label htmlFor="relevantMaterial" className="text-sm">
                          Relevant Material <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Textarea
                          id="relevantMaterial"
                          placeholder="Enter any additional context, notes or material..."
                          className="min-h-[100px]"
                          value={relevantMaterial}
                          onChange={(e) => setRelevantMaterial(e.target.value)}
                        />
                        {/* Add image upload for relevant material */}
                        <div className="mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Add image as relevant material
                            </span>
                            {selectedModel !== "gemini-2.5-flash-preview-05-20" && (
                              <Badge variant="outline" className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50">
                                Only works with Gemini 2.5 Flash
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => document.getElementById('relevant-material-image').click()}
                              className="text-xs h-7"
                              disabled={selectedModel !== "gemini-2.5-flash-preview-05-20" || relevantMaterialImageLoading}
                            >
                              {relevantMaterialImageLoading ? (
                                <><Loader2 className="mr-1 h-3 w-3 animate-spin" /> Processing...</>
                              ) : (
                                <><Upload className="mr-1 h-3 w-3" /> Upload Image</>
                              )}
                            </Button>
                            {selectedModel !== "gemini-2.5-flash-preview-05-20" && (
                              <Button
                                variant="link"
                                size="sm"
                                className="text-xs h-7 text-amber-600 dark:text-amber-400 px-0"
                                onClick={() => {
                                  setSelectedModel("gemini-2.5-flash-preview-05-20");
                                  setHasExtractedText(true);
                                }}
                              >
                                Switch to Gemini 2.5 Flash
                              </Button>
                            )}
                          </div>
                          <input
                            type="file"
                            id="relevant-material-image"
                            accept="image/*"
                            className="hidden"
                            onChange={handleRelevantMaterialImageChange}
                            disabled={selectedModel !== "gemini-2.5-flash-preview-05-20" || relevantMaterialImageLoading}
                          />
                          {relevantMaterialImage && (
                            <div className="mt-2 flex items-center">
                              <Badge variant="outline" className="text-xs">
                                {relevantMaterialImage.name} ({Math.round(relevantMaterialImage.size / 1024)} KB)
                              </Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 ml-2"
                                onClick={() => setRelevantMaterialImage(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* AI Model Selection */}
                      {hasExtractedText && (
                        <div className="space-y-2">
                          <Label htmlFor="aiModel" className="text-sm">
                            AI Model <span className="text-muted-foreground text-xs">(Optional)</span>
                          </Label>
                          {!hasExtractedText ? (
                            <div className="text-sm text-muted-foreground bg-muted/20 rounded-md p-3 flex items-center">
                              <Info className="h-4 w-4 mr-2 text-primary" />
                              <span>Upload and process an image to enable model selection</span>
                            </div>
                          ) : (
                            <Select
                              value={selectedModel}
                              onValueChange={(value) => {
                                const now = Date.now();
                                const modelRateLimit = MODEL_RATE_LIMITS[value] || 10000; // Renamed for clarity
                                const lastModelRequestTime = modelLastRequestTimes[value] || 0; // Renamed for clarity
                                const timeSinceLastRequest = now - lastModelRequestTime; // Renamed for clarity

                                // Always update the selected model in the UI first
                                setSelectedModel(value);
                                setThinkingBudget(DEFAULT_THINKING_BUDGETS[value] || 1024);
                                
                                // Then, if rate limited, show a toast. 
                                // The actual API call will be blocked later if they try to use it.
                                if (timeSinceLastRequest < modelRateLimit) {
                                  const waitTimeSeconds = Math.ceil((modelRateLimit - timeSinceLastRequest) / 1000);
                                  toast.warning(`${AI_MODELS.find(m => m.value === value)?.label || value} was used recently. Actual use might be rate-limited for ${waitTimeSeconds} more seconds.`);
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select AI model" />
                              </SelectTrigger>
                              <SelectContent>
                                {AI_MODELS.map((model) => (
                                  <SelectItem key={model.value} value={model.value} className="py-2">
                                    <div className="flex flex-col">
                                      <span>{model.label}</span>
                                      <span className="text-xs text-muted-foreground">{model.description}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          
                          {selectedModel === "gemini-2.5-flash-preview-05-20" && hasExtractedText && (
                            <div className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              <span>Uses direct Gemini API with custom key, may need backend updates</span>
                            </div>
                          )}
                        </div>
                      )}
                      {/* ADDED: UI for Token Limits */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                           <Label htmlFor="autoMaxTokens" className="text-sm flex items-center">
                            Automatic Max Tokens
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-3 w-3 ml-1.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <p>When enabled, the AI will automatically determine the appropriate maximum number of tokens for the response. Disable to set a custom limit.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                          <Switch
                            id="autoMaxTokens"
                            checked={autoMaxTokens}
                            onCheckedChange={setAutoMaxTokens}
                          />
                        </div>
                      </div>

                      {!autoMaxTokens && (
                        <div className="space-y-2 mt-3">
                          <Label htmlFor="maxTokensSlider" className="text-sm">
                            Max Tokens: {maxTokens}
                          </Label>
                          <div className="flex items-center gap-3">
                            <Slider
                              id="maxTokensSlider"
                              min={256}
                              max={8192}
                              step={128} // Adjusted step for finer control
                              value={[maxTokens]}
                              onValueChange={(value) => setMaxTokens(value[0])}
                              className="flex-grow"
                            />
                            <Input
                              id="maxTokensInput"
                              type="number"
                              value={maxTokens}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val)) {
                                  if (val >= 256 && val <= 8192) {
                                    setMaxTokens(val);
                                  } else if (val < 256) {
                                    setMaxTokens(256);
                                  } else if (val > 8192) {
                                    setMaxTokens(8192);
                                  }
                                } else if (e.target.value === '') {
                                   setMaxTokens(256); // Default to min if empty
                                }
                              }}
                              className="w-24 text-sm h-9"
                              min={256}
                              max={8192}
                              step={128}
                            />
                          </div>
                           <p className="text-xs text-muted-foreground">
                            Defines the maximum length of the AI's response. (Min: 256, Max: 8192). Default is 2048.
                          </p>
                        </div>
                      )}
                      
                      {/* Add Thinking Budget control for Gemini 2.5 */}
                      {selectedModel === "gemini-2.5-flash-preview-05-20" && (
                        <div className="space-y-2 pt-2 border-t border-border mt-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="enableThinkingBudget" className="text-sm flex items-center">
                              Enable Thinking Budget
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-3 w-3 ml-1.5 text-muted-foreground cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-xs">
                                    <p>When enabled, the model will use a thinking budget to solve more complex tasks. This may improve answer quality but might increase response time.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Switch
                              id="enableThinkingBudget"
                              checked={enableThinkingBudget}
                              onCheckedChange={setEnableThinkingBudget}
                            />
                          </div>
                          
                          {enableThinkingBudget && (
                            <div className="space-y-2 mt-3">
                              <Label htmlFor="thinkingBudgetSlider" className="text-sm">
                                Thinking Budget: {thinkingBudget}
                              </Label>
                              <div className="flex items-center gap-3">
                                <Slider
                                  id="thinkingBudgetSlider"
                                  min={512}
                                  max={24576}
                                  step={512}
                                  value={[thinkingBudget]}
                                  onValueChange={(value) => setThinkingBudget(value[0])}
                                  className="flex-grow"
                                />
                                <Input
                                  id="thinkingBudgetInput"
                                  type="number"
                                  value={thinkingBudget}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val)) {
                                      if (val >= 0 && val <= 24576) { // Max is 24576
                                        setThinkingBudget(val);
                                      } else if (val < 0) {
                                        setThinkingBudget(0);
                                      } else if (val > 24576) { // Max is 24576
                                        setThinkingBudget(24576); // Max is 24576
                                      }
                                    } else if (e.target.value === '') {
                                      setThinkingBudget(0); // Default to 0 if empty
                                    }
                                  }}
                                  className="w-24 text-sm h-9"
                                  min={0}
                                  max={24576} // Max is 24576
                                  step={512}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Defines the maximum tokens used for thinking. Higher values may improve quality for complex tasks. (Min: 0, Max: 24576)
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Submit button */}
                <div className="space-y-2">
                  <Button 
                    ref={submitButtonRef} // ADDED REF
                    onClick={handleSubmitForMarking}
                    disabled={loading || !answer || backendStatusRef.current !== 'online'}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : backendStatusRef.current !== 'online' ? (
                      <>
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Wake up API first
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Mark Answer
                      </>
                    )}
                  </Button>
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetForm}
                      className="text-xs"
                      disabled={loading}
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Reset Form
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="feedback" className="pt-4 relative">
                <FeedbackDisplay 
                  loading={loading} 
                  feedback={feedback} 
                  grade={grade} 
                  selectedModel={selectedModel} 
                  modelThinking={modelThinking} 
                  achievedMarks={achievedMarks} 
                  totalMarks={totalMarks} 
                  processingProgress={processingProgress}
                  setActiveTab={setActiveTab}
                  markScheme={markScheme}
                  onAskFollowUp={handleAskFollowUp}
                  followUpEnabled={!!feedback && backendStatusRef.current === 'online'}
                />
              </TabsContent>

              {/* ADDED: TabsContent for 'bulk' */}
              <TabsContent value="bulk" className="pt-4 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Bulk Assessment Processing</CardTitle>
                    <CardDescription>
                      Upload a file containing multiple questions and answers to mark in bulk.
                      Supported formats: CSV, JSON, and TXT files.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bulk-file-upload">Upload File</Label>
                      <Input 
                        id="bulk-file-upload" 
                        type="file" 
                        accept=".csv,.json,.txt" 
                        onChange={handleBulkFileChange} 
                        ref={bulkFileUploadRef} 
                        disabled={bulkProcessing}
                      />
                      {bulkFile && <p className="text-sm text-muted-foreground">Selected file: {bulkFile.name}</p>}
                      <p className="text-xs text-muted-foreground">
                        <strong>Format requirements:</strong><br />
                        - CSV: Include 'Question' and 'Answer' columns<br />
                        - JSON: Array of objects with 'question' and 'answer' properties<br />
                        - TXT: One item per line with question and answer separated by tab or comma
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Settings Preference</Label>
                      <Select value={bulkSettingPreference} onValueChange={setBulkSettingPreference} disabled={bulkProcessing}>
                        <SelectTrigger className="w-[280px]">
                          <SelectValue placeholder="Choose settings source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="global">Use Global Settings (from Answer tab)</SelectItem>
                          <SelectItem value="file">Use Settings from File (if available)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        If 'Use Settings from File' is chosen and a setting is missing for an item, global settings will be used as a fallback.
                      </p>
                    </div>
                    
                    {/* MODIFIED: Batch processing controls with parallelism */}
                    {bulkProcessing && bulkProgress.total > 0 && (
                      <BatchProcessingControls 
                        isProcessing={bulkProcessing}
                        progress={bulkProgress}
                        onPause={handlePauseBulkProcessing}
                        onResume={handleResumeBulkProcessing}
                        onCancel={handleCancelBulkProcessing}
                        isPaused={isBulkProcessingPaused}
                        parallelism={parallelProcessing}
                        onParallelismChange={handleParallelismChange}
                      />
                    )}

                    {/* ADDED: Parallelism setting when not processing */}
                    {!bulkProcessing && (
                      <div className="flex items-center gap-2">
                        <Label htmlFor="parallelism-setting" className="text-sm whitespace-nowrap">Parallel Processing:</Label>
                        <Select
                          id="parallelism-setting"
                          value={parallelProcessing.toString()}
                          onValueChange={(value) => setParallelProcessing(parseInt(value))}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder={parallelProcessing} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 task</SelectItem>
                            <SelectItem value="2">2 tasks</SelectItem>
                            <SelectItem value="3">3 tasks</SelectItem>
                            <SelectItem value="4">4 tasks</SelectItem>
                          </SelectContent>
                        </Select>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              <p>Process multiple items simultaneously to speed up bulk marking. Higher values may increase API rate limiting.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                    
                    <Button 
                      onClick={handleProcessBulkFile} 
                      disabled={!bulkFile || bulkProcessing || backendStatusRef.current !== 'online'}
                      className="w-full sm:w-auto"
                    >
                      {bulkProcessing ? (
                        <React.Fragment>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                          {isBulkProcessingPaused ? "Paused" : `Processing (${bulkProgress.processed}/${bulkProgress.total})...`}
                        </React.Fragment>
                      ) : backendStatusRef.current !== 'online' ? (
                        <React.Fragment>
                          <AlertTriangle className="mr-2 h-4 w-4" /> API Offline
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <UploadCloud className="mr-2 h-4 w-4" /> Process File
                        </React.Fragment>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Display Bulk Processing Results */}
                {(bulkProcessing || bulkResults.length > 0) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Bulk Results</CardTitle>
                      {bulkProcessing && bulkProgress.total > 0 && (
                        <CardDescription>
                          Processing item {bulkProgress.currentItem || '-'} of {bulkProgress.total}. Processed: {bulkProgress.processed}.
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      {bulkResults.length === 0 && bulkProcessing && (
                        <div className="flex items-center justify-center p-6 text-muted-foreground">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          <span>Waiting for results...</span>
                        </div>
                      )}
                      {bulkResults.length > 0 && (
                        <ScrollArea className="h-[400px] w-full">
                          <div className="space-y-4 pr-4">
                            {bulkResults.map((result, index) => (
                              <div key={index} className="p-3 border rounded-md bg-muted/30">
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-semibold text-sm">
                                    Item {result.itemIndex + 1}: {result.question ? result.question.substring(0, 100) + (result.question.length > 100 ? '...' : '') : 'N/A'}
                                  </h4>
                                  {result.grade && (
                                    <div className="inline-flex items-center justify-center h-6 w-6 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-bold rounded-full text-xs shadow-sm">
                                      {result.grade}
                                    </div>
                                  )}
                                </div>
                                {result.error ? (
                                  <Alert variant="destructive" className="py-2 px-3">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle className="text-xs">Error</AlertTitle>
                                    <AlertDescription className="text-xs">{result.error}</AlertDescription>
                                  </Alert>
                                ) : (
                                  <div className="text-xs">
                                    <p className="mt-1">
                                      <strong>Feedback Summary:</strong> {result.feedback ? result.feedback.substring(0, 150) + (result.feedback.length > 150 ? '...' : '') : 'N/A'}
                                    </p>
                                    {/* ADDED: View full details button */}
                                    <Button 
                                      variant="link" 
                                      size="sm" 
                                      className="p-0 h-auto mt-1 text-xs" 
                                      onClick={() => handleViewItemDetails(result)}
                                    >
                                      <ExternalLink className="h-3 w-3 mr-1" /> 
                                      View Full Details
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <ScrollBar orientation="vertical" />
                        </ScrollArea>
                      )}
                    </CardContent>
                    {bulkResults.length > 0 && (
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setBulkResults([])}
                          disabled={bulkProcessing}
                        >
                          <X className="h-4 w-4 mr-1" /> Clear Results
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => {
                            // Create CSV content
                            const csvContent = [
                              ["Item", "Question", "Answer", "Grade", "Marks", "Total Marks", "Feedback"].join(","),
                              ...bulkResults.map((item, index) => [
                                index + 1,
                                `"${item.question?.replace(/"/g, '""') || ''}"`,
                                `"${item.answer?.replace(/"/g, '""') || ''}"`,
                                item.grade || 'N/A',
                                item.achievedMarks || '',
                                item.totalMarks || '',
                                `"${item.feedback?.replace(/"/g, '""') || item.error?.replace(/"/g, '""') || ''}"`,
                              ].join(","))
                            ].join("\n");
                            
                            // Create download link
                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.setAttribute('href', url);
                            link.setAttribute('download', `bulk-results-${new Date().toISOString().split('T')[0]}.csv`);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            
                            toast.success("Results downloaded as CSV file");
                          }}
                          disabled={bulkProcessing || bulkResults.length === 0}
                        >
                          <Download className="h-4 w-4 mr-1" /> Download Results
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* ADDED: Bulk Item Preview Dialog */}
      <BulkItemPreviewDialog 
        open={showPreviewDialog} 
        onOpenChange={setShowPreviewDialog} 
        item={previewItem} 
        onClose={() => setShowPreviewDialog(false)}
      />
      
      {/* ADDED: Follow-up Question Dialog */}
      <Dialog open={showFollowUpDialog} onOpenChange={setShowFollowUpDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ask a Follow-Up Question</DialogTitle>
            <DialogDescription>
              Need clarification about your feedback? Ask the AI for more help.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
                      <div className="space-y-2">
            <Label htmlFor="follow-up-question">Your Question</Label>
            <Textarea
              id="follow-up-question"
              placeholder="e.g., Can you explain more about why I lost marks on the first point? What would a better answer look like?"
              value={followUpQuestion}
              onChange={(e) => setFollowUpQuestion(e.target.value)}
              className="min-h-[100px]"
              disabled={followUpLoading}
            />
          </div>
          
          {/* Add model selector for follow-up */}
          <div className="space-y-2">
            <Label htmlFor="follow-up-model">Model to use</Label>
            <Select
              value={selectedModel}
              onValueChange={(value) => {
                // Check for rate limiting when switching models
                const now = Date.now();
                const modelLimit = MODEL_RATE_LIMITS[value] || 10000;
                const lastModelRequest = modelLastRequestTimes[value] || 0;
                const timeSince = now - lastModelRequest;
                
                if (timeSince < modelLimit) {
                  const waitTime = Math.ceil((modelLimit - timeSince) / 1000);
                  toast.warning(`Model was used recently. Switching anyway, but response may be delayed.`);
                }
                setSelectedModel(value);
                // Update thinking budget when model changes for follow-up
                setThinkingBudget(DEFAULT_THINKING_BUDGETS[value] || 1024);
              }}
              disabled={followUpLoading}
            >
              <SelectTrigger id="follow-up-model" className="w-full">
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((model) => (
                  <SelectItem key={model.value} value={model.value} className="py-2">
                    <div className="flex flex-col">
                      <span>{model.label}</span>
                      <span className="text-xs text-muted-foreground">{model.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">If one model isn't responding, try another model for this follow-up.</p>
          </div>
            
            {followUpResponse && (
              <div className="space-y-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Label>AI Response</Label>
                <div className="p-4 rounded-md bg-muted/30 border border-border min-h-[100px]">
                  <MathMarkdown>{followUpResponse}</MathMarkdown>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 justify-between sm:justify-end">
            {followUpLoading && (
              <div className="flex items-center text-muted-foreground text-sm">
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Processing your question...
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowFollowUpDialog(false)} disabled={followUpLoading}>
                Close
              </Button>
              {!followUpResponse && (
                <Button onClick={handleSubmitFollowUp} disabled={followUpLoading || !followUpQuestion.trim()}>
                  {followUpLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Get Answer'
                  )}
                </Button>
              )}
              {followUpResponse && !followUpLoading && (
                <Button onClick={() => {
                  setFollowUpQuestion("");
                  setFollowUpResponse("");
                }}>
                  Ask Another Question
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AIMarker;