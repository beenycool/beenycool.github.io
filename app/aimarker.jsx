"use client";
import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import 'katex/dist/katex.min.css'; // Add import for KaTeX CSS
import remarkMath from 'remark-math'; // Add import for remark-math plugin
import rehypeKatex from 'rehype-katex'; // Add import for rehype-katex plugin
import { getSubjectGuidance } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
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

// API URL for our backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
  (typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:3003'  // Local development 
      : 'https://beenycool-github-io.onrender.com'); // Production fallback

// Log the API URL for debugging
console.log('Using API URL:', API_BASE_URL);

// Initialize default backend status
if (typeof window !== 'undefined') {
  window.BACKEND_STATUS = window.BACKEND_STATUS || { status: 'checking', lastChecked: null };
}

// Constants moved to a separate section for easier management
const SUBJECTS = [
  { value: "english", label: "English" },
  { value: "maths", label: "Maths", hasTiers: true },
  { value: "science", label: "Science", hasTiers: true },
  { value: "history", label: "History" },
  { value: "geography", label: "Geography" },
  { value: "computerScience", label: "Computer Science" },
  { value: "businessStudies", label: "Business Studies" }
];

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
  { value: "gemini-2.5-flash-preview-04-17", label: "Gemini 2.5 Flash Preview", description: "Best quality with faster response times" },
  { value: "google/gemini-2.5-pro:free", label: "Gemini 2.5 Pro", description: "Highest quality generation from Google" },
  { value: "microsoft/mai-ds-r1:free", label: "R1 (thinking model)", description: "Most thorough reasoning process (may take 1-2 minutes)" },
  { value: "deepseek/deepseek-chat-v3-0324:free", label: "V3 (balanced model)", description: "Balanced speed and quality" },
  { value: "openai/o3", label: "GitHub O3", description: "GitHub AI Model (O3)" },
  { value: "openai/o4-mini", label: "GitHub O4 Mini", description: "GitHub AI Model (O4 Mini)" },
  { value: "openai/o4", label: "GitHub O4", description: "GitHub AI Model (O4)" },
  { value: "xai/grok-3", label: "Grok-3", description: "X AI Model (Grok)" },
  { value: "openai/gpt-4.1", label: "GitHub GPT 4.1", description: "GitHub AI Model (GPT 4.1)" }
];

// Add fallback models for when primary models are rate limited
const FALLBACK_MODELS = {
  "gemini-2.5-flash-preview-04-17": "deepseek/deepseek-chat-v3-0324:free",
  "google/gemini-2.5-pro:free": "gemini-2.5-flash-preview-04-17", // Fallback for Gemini Pro
  "deepseek/deepseek-chat-v3-0324:free": "microsoft/mai-ds-r1:free",
  "microsoft/mai-ds-r1:free": "google/gemini-2.5-pro:free", // Fallback to Gemini Pro
  "openai/o3": "openai/o4-mini", // Fallback for O3
  "openai/o4-mini": "deepseek/deepseek-chat-v3-0324:free", // Fallback for O4 Mini
  "openai/o4": "openai/o3", // Fallback for O4
  "xai/grok-3": "deepseek/deepseek-chat-v3-0324:free", // Fallback for Grok-3
  "openai/gpt-4.1": "openai/o4" // Fallback for GPT 4.1
};

// Define model-specific rate limits (in milliseconds)
// Based on GitHub Copilot Pro rate limits
const MODEL_RATE_LIMITS = {
  // Standard models
  "gemini-2.5-flash-preview-04-17": 60000, // 1 minute
  "deepseek/deepseek-chat-v3-0324:free": 10000, // 10 seconds
  
  // DeepSeek-R1 and MAI-DS-R1: 1 request per minute (Copilot Pro)
  "microsoft/mai-ds-r1:free": 60000, // 1 minute (1 request per minute)
  
  // GitHub models (Copilot Pro rate limits)
  // Azure OpenAI o3: 1 request per minute 
  "openai/o3": 60000, // 1 minute (1 request per minute)
  
  // Azure OpenAI o4-mini: 2 requests per minute
  "openai/o4-mini": 30000, // 30 seconds (2 requests per minute)  
  // xAI Grok-3: 1 request per minute
  "xai/grok-3": 60000, // 1 minute (1 request per minute)
  
  // GPT 4.1 (assuming similar to o4)
  "openai/gpt-4.1": 60000 // 1 minute (1 request per minute)
};

// Define specific models for specific tasks
const TASK_SPECIFIC_MODELS = {
  "image_processing": "gemini-2.5-flash-preview-04-17" // Updated to use Gemini 2.5 Flash for image processing
};

// Define default thinking budgets for models that support it
const DEFAULT_THINKING_BUDGETS = {
  "gemini-2.5-flash-preview-04-17": 1024,
  "google/gemini-2.5-pro:free": 2048, // Added thinking budget for Gemini Pro
  "microsoft/mai-ds-r1:free": 0 // R1 thinking is handled differently via system prompt
  // GitHub models and Grok might not have a 'thinkingBudget' concept in the same way,
  // or it's controlled by different parameters. This can be added if their API supports it.
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
              <RefreshCw className="h-3 w-3 mr-1" /> Retry with {AI_MODELS.find(m => m.value === error.fallbackModel)?.label || error.fallbackModel}
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
              <RefreshCw className="h-3 w-3 mr-1" /> Try Again
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
  if (!loading) return null;
  
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
          {grade && achievedMarks && totalMarks && (
            <div className="flex flex-col items-start">
              <div className="inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-bold rounded-md shadow-md">
                {achievedMarks}/{totalMarks} marks (Grade: {grade})
              </div>
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
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{thought}</span>
                </motion.li>
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
      // Clear previous preview if any
      setOcrTextPreview("");
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
    if (!image) return;
    
    try {
      setImageLoading(true);
      toast.info("Processing image with AI OCR...", { duration: 5000 });
      
      const formData = new FormData();
      formData.append('image', image);
      
      const response = await fetch(`${API_BASE_URL}/api/ocr`, {
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
  
  // API and rate limiting
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [dailyRequests, setDailyRequests] = useState(0); // This seems locally managed, let's use getRequestTokens for display
  const [lastRequestDate, setLastRequestDate] = useState(new Date().toDateString());
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash-preview-04-17");
  const [modelLastRequestTimes, setModelLastRequestTimes] = useState({});
  const [imageLoading, setImageLoading] = useState(false);
  const [backendError, setBackendError] = useState(false);
  const [helpButtonRef, setHelpButtonRef] = useState(null);
  const [questionInputRef, setQuestionInputRef] = useState(null);
  const [answerInputRef, setAnswerInputRef] = useState(null);
  const [marksInputRef, setMarksInputRef] = useState(null);
  const [markSchemeButtonRef, setMarkSchemeButtonRef] = useState(null);
  const submitButtonRef = useRef(null); 
  const hasManuallySetSubject = useRef(false);
  const backendStatusRef = useRef('checking');
  const [backendUpdated, setBackendUpdated] = useState(false);
  const [autoMaxTokens, setAutoMaxTokens] = useState(true);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [remainingRequestTokens, setRemainingRequestTokens] = useState(0);
  const [thinkingBudget, setThinkingBudget] = useState(DEFAULT_THINKING_BUDGETS["gemini-2.5-flash-preview-04-17"] || 1024);
  const [enableThinkingBudget, setEnableThinkingBudget] = useState(true);

  // Debounced save function for question and answer
  const debouncedSaveDraft = useCallback(
    debounce((q, a) => {
      localStorage.setItem(LOCALSTORAGE_KEYS.QUESTION, q);
      localStorage.setItem(LOCALSTORAGE_KEYS.ANSWER, a);
      // console.log('Draft saved');
    }, 1500), // Save after 1.5 seconds of inactivity
    []
  );

  // Effect for auto-saving question and answer drafts
  useEffect(() => {
    if (question || answer) { // Only save if there's content
      debouncedSaveDraft(question, answer);
    }
  }, [question, answer, debouncedSaveDraft]);

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
    const savedModel = localStorage.getItem(LOCALSTORAGE_KEYS.MODEL);
    if (savedModel && AI_MODELS.find(m => m.value === savedModel)) {
      setSelectedModel(savedModel);
    }
    const savedTier = localStorage.getItem(LOCALSTORAGE_KEYS.TIER);
    if (savedTier === "higher" || savedTier === "foundation") {
      setTier(savedTier);
    }

    // Initialize remaining tokens display
    const tokens = getRequestTokens();
    setRemainingRequestTokens(tokens.count);

    // Add default thinking budget for selected model
    setThinkingBudget(DEFAULT_THINKING_BUDGETS[selectedModel] || 1024);

  }, []); // Empty dependency array means this runs once on mount

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
  }, [selectedModel]);

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEYS.TIER, tier);
  }, [tier]);

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
    setBackendUpdated(prev => !prev); // Toggle to force a re-render
    
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
        console.log('Running on GitHub Pages - simulating online status for UI rendering');
        backendStatusRef.current = 'online';
        // Force a re-render
        setBackendUpdated(prev => !prev);
      }
    }
  }, [setIsGitHubPages]);

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
  const handleSubmitForMarking = useCallback(async () => {
    // Clear previous feedback and errors
    setFeedback("");
    setGrade("");
    setError(null);
    setSuccess(null);
    setModelThinking("");
    setAchievedMarks(null); // Reset achieved marks
    
    // Validate inputs
    if (!answer) {
      setError({
        type: "validation",
        message: "Please enter an answer to be marked"
      });
      return;
    }
    
    // Check if backend is reachable
    setLoading(true);
    setActiveTab("feedback"); // Switch to feedback tab immediately to show progress
    setSuccess({
      message: "Checking backend status..."
    });
    
    // Use the global checkBackendStatus instead of redefining it
    const backendStatus = await checkBackendStatus(selectedModel);
    if (!backendStatus.ok) {
      setLoading(false);
      setError({
        type: "network",
        message: `Backend connection error: ${backendStatus.error}. The server may take up to 50 seconds to wake up after inactivity. Please try again in a minute.`,
        retry: true
      });
      return;
    }
    
    // Rate limiting checks
    const now = Date.now();
    const today = new Date().toDateString();
    
    if (today !== lastRequestDate) {
      setDailyRequests(0);
      setLastRequestDate(today);
      localStorage.setItem('lastRequestDate', today);
      localStorage.setItem('dailyRequests', '0');
    }
    
    // Get the rate limit for the selected model
    const modelRateLimit = MODEL_RATE_LIMITS[selectedModel] || 10000; // Default to 10 seconds
    const modelLastRequestTime = modelLastRequestTimes[selectedModel] || 0;
    const timeSinceLastModelRequest = now - modelLastRequestTime;
    
    if (timeSinceLastModelRequest < modelRateLimit) {
      setLoading(false);
      const waitTimeSeconds = Math.ceil((modelRateLimit - timeSinceLastModelRequest) / 1000);
      const fallback = FALLBACK_MODELS[selectedModel];
      if (fallback) {
      setError({
          type: "rate_limit_with_fallback",
          message: `${AI_MODELS.find(m => m.value === selectedModel)?.label || selectedModel} is rate limited. You can try a fallback model or wait ${waitTimeSeconds}s.`,
          fallbackModel: fallback,
          originalModel: selectedModel,
          onRetryFallback: (newModel) => { 
            toast.info(`Switching to ${AI_MODELS.find(m => m.value === newModel)?.label || newModel} and retrying.`);
            setSelectedModel(newModel); 
            // Wrap handleSubmitForMarking in a timeout to allow state to update
            setTimeout(() => handleSubmitForMarking(), 100); 
          },
          onRetry: () => handleSubmitForMarking(), // General retry still uses original model
          waitTime: waitTimeSeconds
        });
      } else {
        setError({
          type: "rate_limit_wait",
          message: `${AI_MODELS.find(m => m.value === selectedModel)?.label || selectedModel} is limited. Please wait ${waitTimeSeconds} more seconds.`,
          waitTime: waitTimeSeconds,
          onRetry: () => handleSubmitForMarking()
        });
      }
      return;
    } else if (now - lastRequestTime < 5000) {
      setLoading(false);
      setError({
        type: "rate_limit", // Generic rate limit, could be rate_limit_wait if we want a timed retry
        message: "Please wait at least 5 seconds between requests.",
        onRetry: () => handleSubmitForMarking()
      });
      return;
    }

    if (!consumeToken()) {
      setLoading(false);
      setError({ type: "rate_limit", message: "Daily request limit reached (500/day)" });
      return;
    }

    // Build system prompt
    const buildSystemPrompt = () => {
      let basePrompt = `You are an experienced GCSE ${subject} examiner. Your task is to provide detailed, constructive feedback for ${userType === 'teacher' ? 'assessment purposes' : 'student learning'} following these guidelines:

1. ASSESSMENT CRITERIA:
- Accuracy of content (subject knowledge)
- Clarity and structure of response
- Use of evidence/examples
- Depth of analysis (where applicable)
- Technical accuracy (spelling, grammar, terminology)`;

      // Add tier information for tiered subjects
      const currentSubject = allSubjects.find(s => s.value === subject);
      if (currentSubject?.hasTiers) {
        basePrompt += `\n- This is a ${tier.toUpperCase()} tier question`;
      }

      basePrompt += `\n\n2. FEEDBACK STRUCTURE:
a) Performance overview that addresses the overall quality of the answer (2-3 sentences)
b) 3-4 specific strengths with concrete examples from the student's work, using phrases like "You demonstrated...", "Your analysis of...", or "I was particularly impressed by..."
c) 3-4 specific areas for improvement using the "WWW/EBI" format (What Went Well/Even Better If), with each point structured as:
   * Clear identification of the issue
   * Evidence from the student's work
   * Specific, achievable action to improve
   * Link to how this would affect their grade
   If structural improvements are needed (e.g., unclear topic sentences, weak paragraph structure, lack of logical flow between points), suggest specific techniques like using PEEL (Point, Evidence, Explanation, Link) or improving transitions.
d) Clear progression pathway that explains exactly what would be needed to achieve the next grade level
e) GCSE grade (9-1) in the format: [GRADE:X] where X is the grade number, with a brief justification of the grade awarded`;

      // Add marks achieved format if total marks are provided or detected
      const detectedMarks = !totalMarks ? detectTotalMarksFromQuestion(question) : null;
      const marksToUse = totalMarks || detectedMarks;
      
      if (marksToUse) {
        basePrompt += `\nf) Marks achieved in the format: [MARKS:Y/${marksToUse}] where Y is the number of marks achieved`;
      }

      basePrompt += `\nIMPORTANT: The [GRADE:X] and [MARKS:Y/...] tags MUST be on their own separate lines and be the only content on those lines for parsing.`;

      basePrompt += `\ng) Technical Accuracy: A distinct section summarizing observations on spelling, grammar, punctuation, and use of specialist terminology. Provide examples if common errors are noted.`;

      // Add mark scheme analysis instructions if provided
      if (markScheme) {
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

      // Add math-specific LaTeX formatting instructions
      if (subject === "maths") {
        basePrompt += `\n\n4. MATHEMATICAL NOTATION:
- Use LaTeX notation for mathematical expressions enclosed in $ $ for inline formulas and as separate blocks for complex formulas
- Example inline: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$
- Example block:
$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$
- Format solutions step-by-step with clear explanations
- Number equations and reference them in your feedback`;
      } else {
        basePrompt += `\n\n4. SUBJECT-SPECIFIC GUIDANCE:
${getSubjectGuidance(subject, examBoard)}

5. PROFESSIONAL MARKING APPROACH:
- Use exam board-specific terminology and assessment language
- Focus on assessment objectives (AOs) relevant to ${subject}
- Implement a tiered marking approach - first identify the band/level, then refine the exact mark within that band
- Use marginal annotations to highlight specific points (e.g., "AO2 - Strong analysis here", "Limited evidence", "Good application of knowledge")
- Balance critical assessment with encouraging language that motivates improvement
- Ensure developmental feedback is specific and actionable
- Apply a consistent marking standard throughout the assessment
- Acknowledge partial understanding where appropriate
- When assessing analytical or evaluative skills (like AO3), if the student's response lacks depth in comparing factors, quantifying impacts, or weighing arguments, your feedback should:
    * Clearly identify this as an area for improvement.
    * Provide specific examples of phrases or approaches the student could use to demonstrate higher-level evaluation (e.g., "Compared to X, Y is more significant because...", "The scale of impact from Z is far greater due to...").
    * If relevant, model a brief example of such comparative or quantitative reasoning.`;
      }

      // Add thinking model specific instructions
      if (selectedModel === "microsoft/mai-ds-r1:free" || selectedModel === "deepseek/deepseek-r1:free") {
        basePrompt += `\n\n5. THINKING PROCESS:
- First, analyze the student's answer carefully and identify key strengths and weaknesses
- For each section of the answer, evaluate both content accuracy and quality of explanation
- Consider what evidence supports each point you make in your feedback
- Show your reasoning for the grade assigned by comparing to GCSE standards
- Mark your thinking process with [THINKING] and your final feedback with [FEEDBACK]`;
      }
      return basePrompt;
    };

    // Build user prompt with the question and answer
    const buildUserPrompt = () => {
      let userPrompt = `Please mark this GCSE ${subject} answer.\n\n`;
      
      // Add the question
      userPrompt += `QUESTION:\n${question}\n\n`;
      
      // Add the answer
      userPrompt += `STUDENT ANSWER:\n${answer}\n\n`;
      
      // Add any additional context
      if (markScheme) {
        userPrompt += `MARK SCHEME:\n${markScheme}\n\n`;
      }
      
      if (textExtract) {
        userPrompt += `TEXT EXTRACT:\n${textExtract}\n\n`;
      }
      
      if (relevantMaterial) {
        userPrompt += `RELEVANT MATERIAL:\n${relevantMaterial}\n\n`;
      }
      
      // Note about image if using Gemini 2.5 with image
      if (selectedModel === "gemini-2.5-flash-preview-04-17" && relevantMaterialImage) {
        userPrompt += `IMAGE PROVIDED: An image has been attached to this prompt as relevant material. Please analyze this image in relation to the student's answer.\n\n`;
      }
      
      // Check for detected marks if totalMarks is not provided
      const detectedMarks = !totalMarks ? detectTotalMarksFromQuestion(question) : null;
      const marksToUse = totalMarks || detectedMarks;
      
      if (marksToUse) {
        userPrompt += `TOTAL MARKS: ${marksToUse}\n\n`;
      }
      
      // Add specific instructions
      userPrompt += `INSTRUCTIONS:
1. Mark this answer as an experienced GCSE ${subject} examiner would for the ${examBoard} exam board
2. Follow a methodical assessment process aligned with official marking standards
3. Use professional examiner language and annotation techniques throughout
4. Provide detailed, constructive feedback with specific evidence from the student's work
5. Structure feedback using the WWW/EBI format (What Went Well/Even Better If)
6. Assign a GCSE grade (9-1) in the format [GRADE:X] with clear justification
7. Include specific guidance for improving to the next grade level
${markScheme ? `8. Apply a rigorous mark-by-mark assessment using the provided mark scheme
9. Annotate each assessment point with appropriate symbols (✓, ~, ✗)
10. Reference specific mark scheme criteria and bands in your assessment
11. Demonstrate clear reasoning for each mark awarded or withheld` : ''}`;

      if (marksToUse) {
        userPrompt += `\n4. Assign marks in the format [MARKS:Y/${marksToUse}]`;
      }
      
      return userPrompt;
    };

    try {
      const systemPrompt = buildSystemPrompt();
      const userPrompt = buildUserPrompt();
      
      setProcessingProgress("Sending request to AI model...");
      setSuccess({
        message: `Processing with ${AI_MODELS.find(m => m.value === selectedModel)?.label || selectedModel}...`
      });
      
      // Update last request time for rate limiting
      setLastRequestTime(now);
      setModelLastRequestTimes(prev => ({
        ...prev,
        [selectedModel]: now
      }));
      
      // For models that support thinking process, we'll capture it
      const captureThinking = selectedModel === "microsoft/mai-ds-r1:free";
      let thinkingSteps = [];
      
      // Make a request to the backend API
      let response;
      let responseData;

      // Use direct Gemini API for the new model
      if (selectedModel === "gemini-2.5-flash-preview-04-17") {
        setProcessingProgress("Sending request to direct Gemini API...");
        
        // Format request for the direct Gemini API
        const requestBody = {
          contents: [
            {
              parts: [
                {
                  text: `System: ${systemPrompt}\n\nUser: ${userPrompt}`
                }
              ]
            }
          ]
        };
        
        // Add image to the request if available
        if (relevantMaterialImage && relevantMaterialImageBase64) {
          setProcessingProgress("Including image in request to Gemini API...");
          console.log("Including relevant material image in the request");
          
          // Add image as a part in the first content item
          requestBody.contents[0].parts.push({
            inline_data: {
              mime_type: relevantMaterialImage.type,
              data: relevantMaterialImageBase64
            }
          });
          
          // Add a text part after the image explaining it's relevant material
          requestBody.contents[0].parts.push({
            text: "This image is provided as relevant material for the assessment. Please consider it when evaluating the student's answer."
          });
        }
        
        // Add thinking config if enabled
        if (enableThinkingBudget && thinkingBudget > 0) {
          requestBody.config = {
            thinkingConfig: {
              thinkingBudget: thinkingBudget
            }
          };
          
          console.log(`Using thinking budget of ${thinkingBudget} tokens for Gemini model`);
        }
        
        const maxRetries = 3;
        let retryCount = 0;
        let success = false;
        
        while (retryCount < maxRetries && !success) {
          try {
            response = await fetch(`${API_BASE_URL}/api/gemini/generate`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
              signal: AbortSignal.timeout(60000) // Ensure timeout is set for each attempt
            });
            success = true; // If fetch is successful, mark as success
          } catch (error) {
            if (error.name === 'AbortError' || (error.message && error.message.toLowerCase().includes('timeout'))) {
              retryCount++;
              console.log(`Retrying Gemini API request in handleSubmitForMarking (${retryCount}/${maxRetries})...`);
              if (retryCount < maxRetries) {
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
        // Use GitHub models API for GitHub and Grok models
        response = await fetch(`${API_BASE_URL}/api/github/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              {
                role: "developer",
                content: systemPrompt
              },
              {
                role: "user",
                content: userPrompt
              }
            ],
            max_tokens: autoMaxTokens ? undefined : maxTokens,
            temperature: 0.7
          }),
        });
      } else {
        // Use the standard API for other models
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
                content: systemPrompt
              },
              {
                role: "user",
                content: userPrompt
              }
            ],
            max_tokens: autoMaxTokens ? undefined : maxTokens,
            temperature: 0.7
          }),
        });
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        
        let errorMessage = "Unknown error occurred";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error?.message || errorJson.message || JSON.stringify(errorJson);
        } catch (e) {
          errorMessage = errorText || response.statusText;
        }
        
        // MODIFIED Error for response not OK
        const fallback = FALLBACK_MODELS[selectedModel];
        if (response.status === 429 && fallback) { // Specifically handle 429 for fallback
      setError({
            type: "rate_limit_with_fallback",
            message: `Model ${AI_MODELS.find(m => m.value === selectedModel)?.label || selectedModel} seems to be rate limited by the API. Try a fallback? Error: ${errorMessage}`,
            fallbackModel: fallback,
            originalModel: selectedModel,
            onRetryFallback: (newModel) => { 
              toast.info(`Switching to ${AI_MODELS.find(m => m.value === newModel)?.label || newModel} and retrying.`);
              setSelectedModel(newModel); 
              setTimeout(() => handleSubmitForMarking(), 100);
            },
            onRetry: () => handleSubmitForMarking()
          });
        } else {
      setError({
            type: "api_error",
            message: `Backend API error: ${errorMessage}`,
            onRetry: handleSubmitForMarking
          });
        }
        return; // Ensure we don't proceed after setting error
      }
      
      responseData = await response.json();
      
      // Extract the response content from various possible API response formats
      let responseContent = "";
      
      if (responseData.content) {
        responseContent = responseData.content;
        console.log("Using data.content format");
      } else if (responseData.choices && responseData.choices[0] && responseData.choices[0].message && responseData.choices[0].message.content) {
        responseContent = responseData.choices[0].message.content;
        console.log("Using data.choices[0].message.content format");
      } else if (responseData.choices && responseData.choices[0] && responseData.choices[0].text) {
        responseContent = responseData.choices[0].text;
        console.log("Using data.choices[0].text format");
      } else if (responseData.text || responseData.answer || responseData.response) {
        responseContent = responseData.text || responseData.answer || responseData.response;
        console.log("Using data.text/answer/response format");
      } else if (typeof responseData === 'object') {
        // Try to find content in the response object
        console.log("Attempting to find content in response object");
        
        // Try to extract content from any nested structure
        const extractContent = (obj) => {
          if (!obj || typeof obj !== 'object') return null;
          
          // Check for common content fields
          if (obj.content && typeof obj.content === 'string') return obj.content;
          if (obj.text && typeof obj.text === 'string') return obj.text;
          if (obj.message && obj.message.content) return obj.message.content;
          
          // Recursively check nested objects
          for (const key in obj) {
            if (typeof obj[key] === 'object') {
              const found = extractContent(obj[key]);
              if (found) return found;
            }
          }
          
          return null;
        };
        
        const extractedContent = extractContent(responseData);
        if (extractedContent) {
          responseContent = extractedContent;
          console.log("Found content in nested object:", responseContent.substring(0, 50) + "...");
        } else {
          // Last resort: try to stringify the object if it has any meaningful content
          console.warn("Unexpected API response format:", data);
          throw new Error("Unexpected API response format");
        }
      } else {
        console.warn("Unexpected API response format:", data);
        throw new Error("Unexpected API response format");
      }
      
      // If using a thinking model, extract the thinking process
      if (captureThinking) {
        // Check if there's a [THINKING] section
        const thinkingMatch = responseContent.match(/\[THINKING\]([\s\S]*?)(?:\[FEEDBACK\]|$)/i);
        if (thinkingMatch && thinkingMatch[1]) {
          const thinkingContent = thinkingMatch[1].trim();
          // Split into steps/points
          thinkingSteps = thinkingContent
            .split(/\n\s*\n|\r\n\s*\r\n/)
            .filter(step => step.trim().length > 0)
            .map(step => step.trim());
          
          setModelThinking(thinkingSteps);
          
          // Extract only the feedback part for the final response
          const feedbackMatch = responseContent.match(/\[FEEDBACK\]([\s\S]*?)$/i);
          if (feedbackMatch && feedbackMatch[1]) {
            responseContent = feedbackMatch[1].trim();
          }
        }
      }
      
      // Extract the grade from the response
      const gradeMatch = responseContent.match(/\[GRADE:(\d+)\]/i);
      if (gradeMatch && gradeMatch[1]) {
        setGrade(gradeMatch[1]);
      }
      
      // Extract marks if provided
      const marksMatch = responseContent.match(/\[MARKS:(\d+)\/(\d+)\]/i);
      if (marksMatch && marksMatch[1]) {
        setAchievedMarks(marksMatch[1]);
        // Set totalMarks if not already set (for display)
        if (!totalMarks && marksMatch[2]) {
          setTotalMarks(marksMatch[2]);
        }
      }
      
      // Clean up the response (remove the grade/marks tag)
      const cleanResponse = responseContent
        .replace(/\[GRADE:\d+\]/gi, '')
        .replace(/\[MARKS:\d+\/\d+\]/gi, '');
      
      setFeedback(cleanResponse);
        setSuccess({
        message: "Assessment completed successfully!"
      });
      
    } catch (error) {
      console.error("Error during assessment:", error);
      
      // Handle different error types
      if (error.name === 'AbortError') {
        setError({
          type: "timeout",
          message: "The request timed out. The server took too long to respond.",
          onRetry: handleSubmitForMarking
        });
      } else if (error.message.includes("rate limit") || error.message.includes("429")) {
        const fallback = FALLBACK_MODELS[selectedModel];
        if (fallback) {
          setError({
            type: "rate_limit_with_fallback",
            message: `Rate limit suspected for ${AI_MODELS.find(m => m.value === selectedModel)?.label || selectedModel}. Error: ${error.message}`,
            fallbackModel: fallback,
            originalModel: selectedModel,
            onRetryFallback: (newModel) => { 
              toast.info(`Switching to ${AI_MODELS.find(m => m.value === newModel)?.label || newModel} and retrying.`);
              setSelectedModel(newModel); 
              setTimeout(() => handleSubmitForMarking(), 100);
            },
            onRetry: () => handleSubmitForMarking()
          });
        } else {
           setError({
            type: "rate_limit", // Could be rate_limit_wait if a pattern for wait time is identified
            message: `Rate limit issue with ${AI_MODELS.find(m => m.value === selectedModel)?.label || selectedModel}. Error: ${error.message}`,
            onRetry: handleSubmitForMarking
          });
        }
      } else {
        setError({
          type: "api_error",
          message: `Error processing assessment: ${error.message}`,
          onRetry: handleSubmitForMarking
        });
      }
    } finally {
      setLoading(false);
      setProcessingProgress("");
    }
  }, [
    answer, question, subject, examBoard, questionType, userType, markScheme, totalMarks,
    textExtract, relevantMaterial, selectedModel, tier, allSubjects, API_BASE_URL,
    lastRequestDate, modelLastRequestTimes, lastRequestTime, consumeToken,
    setFeedback, setGrade, setError, setSuccess, setModelThinking, setAchievedMarks,
    setLoading, setActiveTab, setDailyRequests, setLastRequestDate, setLastRequestTime,
    setModelLastRequestTimes, autoMaxTokens, maxTokens, getRequestTokens, // Added getRequestTokens if used inside
    // Ensure setSelectedModel is in dependency array if used in retry logic like onRetryFallback
    setSelectedModel 
  ]);

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

      if (currentModel === "gemini-2.5-flash-preview-04-17") {
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
          response = await fetch(`${API_BASE_URL}/api/gemini/generate`, {
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
              response = await fetch(`${API_BASE_URL}/api/chat/completions`, {
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
        response = await fetch(`${API_BASE_URL}/api/github/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: currentModel,
            messages: [
              { role: "developer", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: 0.3
          }),
          signal: AbortSignal.timeout(60000) // 60 second timeout
        });
      } else {
        response = await fetch(`${API_BASE_URL}/api/chat/completions`, {
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
            model: currentModelForItem,
            messages: [{ role: "developer", content: systemPromptContent }, { role: "user", content: userPromptContent }],
            max_tokens: autoMaxTokens ? undefined : maxTokens, 
            temperature: 0.7
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
      const fastModel = "google/gemini-2.0-flash-exp:free";
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
      if (selectedModel === "gemini-2.5-flash-preview-04-17") {
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
            model: selectedModel,
            messages: [
              {
                role: "developer",
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
      if (selectedModel === "gemini-2.5-flash-preview-04-17") {
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar version="2.1.3" backendStatus={backendStatusRef.current} remainingTokens={remainingRequestTokens} />
      
      {/* ADDED: OCR Preview Dialog (Sheet was mentioned, but Dialog is simpler here) */}
      <Dialog open={showOcrPreviewDialog} onOpenChange={setShowOcrPreviewDialog}>
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
            <Button variant="outline" onClick={() => setShowOcrPreviewDialog(false)}>
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
                    ref={node => setQuestionInputRef(node)}
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
                    ref={node => setAnswerInputRef(node)}
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
                              ref={node => setMarkSchemeButtonRef(node)}
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
                          ref={node => setMarksInputRef(node)}
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
                            {selectedModel !== "gemini-2.5-flash-preview-04-17" && (
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
                              disabled={selectedModel !== "gemini-2.5-flash-preview-04-17" || relevantMaterialImageLoading}
                            >
                              {relevantMaterialImageLoading ? (
                                <><Loader2 className="mr-1 h-3 w-3 animate-spin" /> Processing...</>
                              ) : (
                                <><Upload className="mr-1 h-3 w-3" /> Upload Image</>
                              )}
                            </Button>
                            {selectedModel !== "gemini-2.5-flash-preview-04-17" && (
                              <Button
                                variant="link"
                                size="sm"
                                className="text-xs h-7 text-amber-600 dark:text-amber-400 px-0"
                                onClick={() => setSelectedModel("gemini-2.5-flash-preview-04-17")}
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
                            disabled={selectedModel !== "gemini-2.5-flash-preview-04-17" || relevantMaterialImageLoading}
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
                      <div className="space-y-2">
                        <Label htmlFor="aiModel" className="text-sm">
                          AI Model <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Select
                          value={selectedModel}
                          onValueChange={(value) => { // selectedModel is now persisted
                            const now = Date.now();
                            const modelLimit = MODEL_RATE_LIMITS[value] || 10000;
                            const lastModelRequest = modelLastRequestTimes[value] || 0;
                            const timeSince = now - lastModelRequest;
                            
                            if (timeSince < modelLimit) {
                              const waitTime = Math.ceil((modelLimit - timeSince) / 1000);
                              toast.warning(`${AI_MODELS.find(m => m.value === value)?.label || value} was used recently. Please wait ${waitTime} more seconds.`);
                              return;
                            }
                            setSelectedModel(value);
                            // Update thinking budget when model changes for follow-up
                            setThinkingBudget(DEFAULT_THINKING_BUDGETS[value] || 1024);
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
                        
                        {selectedModel === "gemini-2.5-flash-preview-04-17" && (
                          <div className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            <span>Uses direct Gemini API with custom key, may need backend updates</span>
                          </div>
                        )}
                      </div>
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
                      {selectedModel === "gemini-2.5-flash-preview-04-17" && (
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