"use client";
import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import 'katex/dist/katex.min.css'; // Add import for KaTeX CSS
import remarkMath from 'remark-math'; // Add import for remark-math plugin
import rehypeKatex from 'rehype-katex'; // Add import for rehype-katex plugin
import OpenAI from 'openai';
import { getSubjectGuidance } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Loader2, Upload, AlertTriangle, CheckCircle2, RefreshCw, HelpCircle, ChevronDown, ChevronRight, Save, Share2, ExternalLink, Settings, FilePlus, ChevronUp, Zap, X, Keyboard } from "lucide-react";
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

// API URL for our backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
  (typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:3003'  // Local development 
      : 'https://beenycool-github-io.onrender.com'); // Production fallback

// Log the API URL for debugging
console.log('Using API URL:', API_BASE_URL);

// Constants moved to a separate section for easier management
const SUBJECTS = [
  { value: "english", label: "English" },
  { value: "maths", label: "Maths" },
  { value: "science", label: "Science" },
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
  { value: "google/gemini-2.5-pro-exp-03-25", label: "Gemini 2.5 Pro (smartest, 1rpm limit)", description: "Best quality but limited to 1 request per minute" },
  { value: "deepseek/deepseek-r1:free", label: "Thinking Model (takes longer)", description: "More thorough reasoning process" },
  { value: "deepseek/deepseek-chat-v3-0324:free", label: "Good All-Rounder", description: "Balanced speed and quality" },
  { value: "google/gemini-2.0-flash-exp:free", label: "Fast Response", description: "Quick responses, suitable for shorter answers" },
  { value: "anthropic/claude-3-sonnet", label: "Claude 3 Sonnet", description: "Good analysis with advanced reasoning" },
];

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

// Helper function to copy feedback to clipboard
const copyFeedbackToClipboard = (feedback) => {
  if (feedback) {
    navigator.clipboard.writeText(feedback);
    alert("Feedback copied to clipboard!");
  }
};

// Enhanced Backend Status Checker Component
const BackendStatusChecker = ({ onStatusChange }) => {
  const [status, setStatus] = useState('checking'); // 'checking', 'online', 'offline', 'error', 'rate_limited'
  const [statusDetail, setStatusDetail] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [wakeupProgress, setWakeupProgress] = useState(0);
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
        return;
      }
      
      // All checks passed
      setStatus('online');
      setStatusDetail(null);
      setIsWakingUp(false);
      clearInterval(wakeupTimerRef.current);
      
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
      
      if (onStatusChange) onStatusChange(error.name === 'AbortError' ? 'timeout' : 'error');
    }
  }, [checkBackendStatus, onStatusChange]);
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (wakeupTimerRef.current) {
        clearInterval(wakeupTimerRef.current);
      }
    };
  }, []);
  
  // Check status on mount and periodically
  useEffect(() => {
    checkStatus();
    
    // Set up periodic checking
    const interval = setInterval(checkStatus, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [checkStatus]);
  
  // Return status badge component
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            onClick={checkStatus}
            className={`inline-flex items-center h-6 px-2 rounded text-xs font-medium ${
              status === 'checking' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' :
              status === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              status === 'waking_up' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
              status === 'rate_limited' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
              status === 'offline' || status === 'timeout' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full mr-1.5 ${
              status === 'checking' ? 'bg-gray-500 dark:bg-gray-400' :
              status === 'online' ? 'bg-green-500 dark:bg-green-400' :
              status === 'waking_up' ? 'bg-blue-500 dark:bg-blue-400' :
              status === 'rate_limited' ? 'bg-amber-500 dark:bg-amber-400' :
              status === 'offline' || status === 'timeout' ? 'bg-orange-500 dark:bg-orange-400' :
              'bg-red-500 dark:bg-red-400'
            }`} />
            {status === 'checking' ? 'Checking' :
             status === 'online' ? 'Online' :
             status === 'waking_up' ? 'Waking Up' :
             status === 'rate_limited' ? 'Rate Limited' :
             status === 'offline' || status === 'timeout' ? 'Starting Up' :
             'Error'}
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">{
              status === 'checking' ? 'Checking backend status...' :
              status === 'online' ? 'Backend is online and ready' :
              status === 'waking_up' ? 'Backend is starting up (may take up to 50 seconds)' :
              status === 'rate_limited' ? 'API rate limit reached' :
              status === 'offline' || status === 'timeout' ? 'Backend is starting up after inactivity' :
              'Backend error detected'
            }</p>
            {statusDetail && <p className="text-xs opacity-80">{statusDetail}</p>}
            {isWakingUp && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                <div className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full" style={{ width: `${wakeupProgress}%` }}></div>
              </div>
            )}
            {lastChecked && <p className="text-xs opacity-70">Last checked: {lastChecked}</p>}
            <p className="text-xs italic">Click to check again</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Add a better success alert component with animations
const EnhancedAlert = ({ success, error }) => {
  if (!success && !error) return null;
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4 animate-in fade-in slide-in-from-top-5 duration-300">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          {error.message}
          {(error.retry || error.type === "network" || error.type === "timeout" || error.type === "api_error") && (
            <div className="mt-1 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleSubmitForMarking}
                disabled={loading}
              >
                Retry
              </Button>
              {error.type === "network" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(API_BASE_URL, '_blank')}
                >
                  Check Backend
                </Button>
              )}
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (success) {
    return (
      <Alert className="mb-4 animate-in fade-in slide-in-from-top-5 duration-300 bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:border-green-900 dark:text-green-300">
        {success.icon === 'detection' ? (
          <motion.div
            initial={{ rotate: -30, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Zap className="h-4 w-4" />
          </motion.div>
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        <AlertTitle>{success.title || "Success"}</AlertTitle>
        <AlertDescription className="flex flex-col">
          <span>{success.message}</span>
          {success.detail && (
            <span className="text-xs opacity-80 mt-0.5">{success.detail}</span>
          )}
          {success.action && (
            <div className="mt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={success.action.onClick}
              >
                {success.action.label}
              </Button>
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
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
    // Dynamically import the libraries (only load when needed)
    const html2canvasModule = await import('html2canvas');
    const jsPDFModule = await import('jspdf');
    
    const html2canvas = html2canvasModule.default;
    const jsPDF = jsPDFModule.default;
    
    const feedbackContainer = feedbackElement.current;
    if (!feedbackContainer) return;
    
    const canvas = await html2canvas(feedbackContainer, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    
    pdf.addImage(imgData, 'PNG', imgX, 0, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`GCSE_Grade${grade}_Feedback.pdf`);
    
    return 'Feedback saved as PDF';
  } catch (error) {
    console.error('Error saving PDF:', error);
    alert('Could not generate PDF. Please try again or use another method to save the feedback.');
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
const EnhancedFeedback = ({ feedback, grade, modelName }) => {
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
          {grade && (
            <div className="inline-flex items-center justify-center h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-bold rounded-full shadow-md">
              {grade}
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Feedback
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              by {modelName}
            </span>
          </h3>
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
const QuickGuide = () => {
  return (
    <Card className="w-full p-4 rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle>Quick Guide</CardTitle>
        <CardDescription>How to use the GCSE AI Marker</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>1.</strong> Enter your question and answer in the text boxes.</p>
          <p><strong>2.</strong> Select the subject, exam board, and question type.</p>
          <p><strong>3.</strong> Click "Mark Answer" to get AI feedback.</p>
          <p><strong>4.</strong> Review the feedback and grade provided.</p>
          <p><strong>5.</strong> Optionally save, share or print your feedback.</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced AIMarker component with mobile responsiveness
const AIMarker = () => {
  // State for form inputs and data
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [subject, setSubject] = useState("english");
  const [examBoard, setExamBoard] = useState("aqa");
  const [questionType, setQuestionType] = useState("general");
  const [userType, setUserType] = useState("student");
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
  const [modelThinking, setModelThinking] = useState("");
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  
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
  const [openai, setOpenai] = useState(null);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [dailyRequests, setDailyRequests] = useState(0);
  const [lastRequestDate, setLastRequestDate] = useState(new Date().toDateString());
  const [selectedModel, setSelectedModel] = useState("google/gemini-2.5-pro-exp-03-25");
  const [imageLoading, setImageLoading] = useState(false);
  const [backendError, setBackendError] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [helpButtonRef, setHelpButtonRef] = useState(null);
  const [questionInputRef, setQuestionInputRef] = useState(null);
  const [answerInputRef, setAnswerInputRef] = useState(null);
  const [marksInputRef, setMarksInputRef] = useState(null);
  const [markSchemeButtonRef, setMarkSchemeButtonRef] = useState(null);
  const hasManuallySetSubject = useRef(false);
  const backendStatusRef = useRef('checking');

  // Fix: Using custom hooks for subject classification and backend status
  const { classifySubjectAI, debouncedClassifySubject } = useSubjectDetection(subjectKeywords, loading);
  const { checkBackendStatus } = useBackendStatus(API_BASE_URL);

  // ======== MAIN FUNCTIONS ========
  // Submit handler
  const handleSubmitForMarking = useCallback(async () => {
    // Clear previous feedback and errors
    setFeedback("");
    setGrade("");
    setError(null);
    setSuccess(null);
    setModelThinking("");
    
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
    setSuccess({
      message: "Checking backend status..."
    });
    
    // Use the global checkBackendStatus instead of redefining it
    const backendStatus = await checkBackendStatus(selectedModel);
    if (!backendStatus.ok) {
      setLoading(false);
      setError({
        type: "network",
        message: `Backend connection error: ${backendStatus.error}. Render's free tier servers may take up to 50 seconds to wake up after inactivity. Please try again in a minute.`,
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
    
    // Special rate limit for Gemini 2.5 Pro
    if (selectedModel === "google/gemini-2.5-pro-exp-03-25" && now - lastRequestTime < 60000) {
      setLoading(false);
      setError({
        type: "rate_limit",
        message: "Gemini 2.5 Pro is limited to 1 request per minute. Please wait or select a different model."
      });
      return;
    } else if (selectedModel !== "google/gemini-2.5-pro-exp-03-25" && now - lastRequestTime < 10000) {
      setLoading(false);
      setError({
        type: "rate_limit",
        message: "Please wait at least 10 seconds between requests"
      });
      return;
    }
    
    const getRequestTokens = () => {
      const stored = localStorage.getItem('requestTokens');
      const now = new Date().toDateString();
      let tokens = stored ? JSON.parse(stored) : { count: 500, lastReset: now };
      if (tokens.lastReset !== now) {
        tokens = { count: 500, lastReset: now };
      }
      localStorage.setItem('requestTokens', JSON.stringify(tokens));
      return tokens;
    };

    const consumeToken = () => {
      const tokens = getRequestTokens();
      if (tokens.count <= 0) return false;
      tokens.count -= 1;
      localStorage.setItem('requestTokens', JSON.stringify(tokens));
      return true;
    };

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
- Technical accuracy (spelling, grammar, terminology)

2. FEEDBACK STRUCTURE:
a) Summary of performance (1-2 sentences)
b) 2-3 specific strengths with examples
c) 2-3 areas for improvement with ${userType === 'teacher' ? 'marking criteria' : 'actionable suggestions'}
d) One specific ${userType === 'teacher' ? 'assessment note' : '"next step" for the student'}
e) GCSE grade (9-1) in the format: [GRADE:X] where X is the grade number

3. TONE & STYLE:
- ${userType === 'teacher' ? 'Professional and assessment-focused' : 'Approachable and encouraging'}
- Specific praise ("Excellent use of terminology when...")
- Constructive criticism ${userType === 'teacher' ? '("This meets level 3 criteria because...")' : '("Consider expanding on...")'}
- Avoid vague statements - always reference the answer`;

      // Add math-specific LaTeX formatting instructions
      if (subject === "maths") {
        basePrompt += `\n\n4. MATHEMATICAL NOTATION:
- Use LaTeX notation for mathematical expressions enclosed in ( ) for inline formulas and as separate blocks for complex formulas
- Example inline: ( x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} )
- Example block:
$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$
- Format solutions step-by-step with clear explanations
- Number equations and reference them in your feedback`;
      } else {
        basePrompt += `\n\n4. SUBJECT-SPECIFIC GUIDANCE:
${getSubjectGuidance(subject, examBoard)}`;
      }

      // Add thinking model specific instructions
      if (selectedModel === "deepseek/deepseek-r1:free") {
        basePrompt += `\n\n5. THINKING PROCESS:
- First, analyze the student's answer carefully and identify key strengths and weaknesses
- For each section of the answer, evaluate both content accuracy and quality of explanation
- Consider what evidence supports each point you make in your feedback
- Show your reasoning for the grade assigned by comparing to GCSE standards
- Mark your thinking process with [THINKING] and your final feedback with [FEEDBACK]`;
      }

      return basePrompt;
    };

    const systemPrompt = buildSystemPrompt();

    // Set loading state
    setSuccess({
      message: "Processing request..."
    });
    setLastRequestTime(now);
    setDailyRequests((prev) => {
      const newCount = prev + 1;
      localStorage.setItem('dailyRequests', newCount.toString());
      return newCount;
    });

    let answerToMark = answer;

    // Process image if uploaded
    if (image) {
      // Inline image processing function
      const processImage = async (imageFile) => {
        setImageLoading(true);
        if (!imageFile) return null;
        
        try {
          const reader = new FileReader();
          const imageBase64 = await new Promise((resolve) => {
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(imageFile);
          });
          
          setSuccess({
            message: "Processing your image... Please wait."
          });
          
          // Use our backend API directly instead of OpenAI client
          const response = await fetch(`${API_BASE_URL}/api/image/extract`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({ image_base64: imageBase64 })
          });
          
          if (!response.ok) {
            throw new Error(`Image processing failed: ${response.statusText}`);
          }
          
          const data = await response.json();
          const extractedText = data.text;
          
          // Auto-fill the answer field with the extracted text
          setAnswer(prev => prev ? `${prev}\n${extractedText}` : extractedText);
          
          setSuccess({
            message: "Image processed successfully! Text has been added to your answer."
          });
          
          setTimeout(() => {
            setSuccess(null);
          }, 3000);
          
          return extractedText;
        } catch (error) {
          console.error("Error processing image:", error);
          setError({
            type: "image_processing",
            message: "Failed to process the image. Please try again or enter text manually."
          });
          return null;
        } finally {
          setImageLoading(false);
          setImage(null); // Clear the image after processing
        }
      };
      
      const imageText = await processImage(image);
      if (imageText) {
        answerToMark = answer ? `${answer}\n${imageText}` : imageText;
        setAnswer(answerToMark); // UI sync
      }
    }

    // Build prompt for AI
    let content = `Please mark this ${examBoard.toUpperCase()} ${subject} GCSE response:\n\nQuestion: ${question}\n\nAnswer: ${answerToMark}`;
    if (markScheme) content += `\n\nMark Scheme: ${markScheme}`;
    if (totalMarks) content += `\n\nMarks Available: ${totalMarks}`;
    if (textExtract) content += `\n\nText Extract: ${textExtract}`;
    if (relevantMaterial) content += `\n\nRelevant Material: ${relevantMaterial}`;
    
    // Add specific question type information
    if (subject === "english" && examBoard === "aqa" && questionType !== "general") {
      content += `\n\nQuestion Type: AQA English ${questionType === "paper1q3" ? "Paper 1, Question 3 (Structure Analysis)" : 
      questionType === "paper1q4" ? "Paper 1, Question 4 (Evaluation)" :
      questionType === "paper2q2" ? "Paper 2, Question 2 (Summary)" : 
      "Paper 2, Question 5 (Writing)"}`;
    }
     
    // Get AI feedback
    let completion;
    try {
      // Create an AbortController to handle timeouts
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 150000); // Increased to 150 second timeout for slower models
      
      setSuccess({
        message: "Analyzing answer... (this may take up to 90 seconds)"
      });

      let retryCount = 0;
      const maxRetries = 2; // Try up to 3 times total (initial + 2 retries)
      let requestError = null;

      while (retryCount <= maxRetries) {
        try {
          if (selectedModel === "deepseek/deepseek-r1:free") {
            // Streaming request implementation
            const response = await fetch(`${API_BASE_URL}/api/chat/completions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              mode: 'cors',
              body: JSON.stringify({
                model: selectedModel,
                messages: [
                  {
                    role: "system",
                    content: systemPrompt + "\nIMPORTANT: Please show your reasoning step-by-step. Prefix your thinking process with '[THINKING]' and your final answer with '[FEEDBACK]'."
                  },
                  {
                    role: "user",
                    content: content
                  }
                ],
                temperature: 0.7,
                max_tokens: 4000,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                stream: true
              }),
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(
                errorData.message || 
                `API request failed: ${response.status} ${response.statusText}`
              );
            }

            // Process the streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let fullResponse = "";
            let thinking = "";
            let finalFeedback = "";
            let inThinkingMode = false;
            let inFeedbackMode = false;
            
            try {
              setSuccess({
                message: "Receiving response stream..."
              });
              
              let lastProgressUpdate = Date.now();
              
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n\n');
                
                // Update progress message periodically to show the system is still working
                const now = Date.now();
                if (now - lastProgressUpdate > 3000) {
                  setSuccess({
                    message: `Processing response: ${thinking.length > 0 ? Math.min(99, Math.floor(thinking.length / 50)) : 0}%`
                  });
                  lastProgressUpdate = now;
                }
                
                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    const data = line.substring(6);
                    if (data === '[DONE]') continue;
                    
                    try {
                      const parsedData = JSON.parse(data);
                      const content = parsedData.choices[0]?.delta?.content || "";
                      fullResponse += content;
                      
                      // Check for thinking mode markers
                      if (content.includes('[THINKING]')) {
                        inThinkingMode = true;
                        inFeedbackMode = false;
                      } else if (content.includes('[FEEDBACK]')) {
                        inThinkingMode = false;
                        inFeedbackMode = true;
                      }
                      
                      // Process content based on current mode
                      if (inThinkingMode) {
                        // Remove the thinking marker from the first part
                        const cleanedContent = content.replace('[THINKING]', '');
                        thinking += cleanedContent;
                        setModelThinking(thinking);
                      } else if (inFeedbackMode) {
                        // Remove the feedback marker from the first part
                        const cleanedContent = content.replace('[FEEDBACK]', '');
                        finalFeedback += cleanedContent;
                      } else {
                        // If no markers yet, add to thinking until we figure out which mode we're in
                        thinking += content;
                        setModelThinking(thinking);
                      }
                    } catch (e) {
                      console.error('Error parsing stream data:', e);
                      // Continue processing even if there's an error with a particular chunk
                    }
                  }
                }
              }
              
              // If we never saw a feedback marker, use the full response
              if (!inFeedbackMode && fullResponse) {
                // Try to find the feedback section automatically
                const feedbackIndex = fullResponse.indexOf('[FEEDBACK]');
                if (feedbackIndex >= 0) {
                  finalFeedback = fullResponse.substring(feedbackIndex + 10); // +10 to skip [FEEDBACK]
                } else {
                  finalFeedback = fullResponse;
                }
              }
              
              setFeedback(finalFeedback.trim());
              
              const gradeMatch = finalFeedback.match(/\[GRADE:(\d)\]/);
              if (gradeMatch && gradeMatch[1]) {
                setGrade(gradeMatch[1]);
              }
            } catch (error) {
              console.error("Streaming error:", error);
              
              // Determine what kind of error occurred
              let errorMessage = "Error processing response stream.";
              if (error.name === 'AbortError') {
                errorMessage = "Stream timed out. The model is taking too long to respond.";
              } else if (error.name === 'SyntaxError') {
                errorMessage = "Invalid data received from server. The model might not support streaming.";
              } else if (error.message.includes('network')) {
                errorMessage = "Network error during streaming. Please check your connection.";
              }
              
              // If we have partial results, still show them
              if (finalFeedback || fullResponse) {
                setFeedback(finalFeedback || fullResponse || "Partial feedback received due to streaming error.");
                setError({ 
                  type: "streaming", 
                  message: `${errorMessage} Showing partial results.` 
                });
              } else {
                setError({ 
                  type: "streaming", 
                  message: errorMessage + " Please try again or select a different model."
                });
              }
            }
            
            // Handle successful response and break the retry loop
            break;
          } else {
            // Regular non-streaming request with enhanced timeout handling
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Request timeout - server taking too long to respond')), 120000);
            });
            
            const fetchPromise = fetch(`${API_BASE_URL}/api/chat/completions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              mode: 'cors',
              body: JSON.stringify({
                model: selectedModel,
                messages: [
                  {
                    role: "system",
                    content: systemPrompt
                  },
                  {
                    role: "user",
                    content: content
                  }
                ],
                temperature: 0.7,
                max_tokens: 4000,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                stream: false
              }),
              signal: controller.signal
            });
            
            // Race between the fetch and a timeout
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            
            clearTimeout(timeoutId);

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(
                errorData.message || 
                `API request failed: ${response.status} ${response.statusText}`
              );
            }

            completion = await response.json();
            
            if (completion.choices && completion.choices[0].message.content) {
              const content = completion.choices[0].message.content;
              setFeedback(content);
              
              const gradeMatch = content.match(/\[GRADE:(\d)\]/);
              if (gradeMatch && gradeMatch[1]) {
                setGrade(gradeMatch[1]);
              }
              
              // Successfully received response, no need to retry
              break;
            } else {
              throw new Error("Received empty or invalid response from the API");
            }
          }
        } catch (error) {
          requestError = error;
          
          // Check if it's a retriable error
          if (retryCount === maxRetries || 
              (error.name !== 'AbortError' && 
               !error.message.includes('NetworkError') && 
               !error.message.includes('Failed to fetch') &&
               !error.message.includes('timeout') && 
               !error.message.includes('500') && 
               !error.message.includes('503'))) {
            break; // Don't retry for non-retriable errors or if we've hit max retries
          }
          
          retryCount++;
          
          // Add a progress message with attempt number
          setSuccess({
            message: `Request failed, retrying (attempt ${retryCount} of ${maxRetries})...`
          });
          
          // Add an increasing delay between retries
          const retryDelay = 3000 * retryCount;
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
      
      // If all retries failed, throw the last error
      if (requestError && retryCount > maxRetries) {
        throw requestError;
      }
    } catch (error) {
      console.error("Error submitting for marking:", error);
      
      let errorMessage = error.message;
      
      // Check if it's an abort error (timeout)
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. The server took too long to respond. Please try again with a faster model.';
      }
      // Check for network errors
      else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Network error. Please check your internet connection and try again. Note that Render\'s free tier servers may take up to 50 seconds to wake up after inactivity.';
      }
      // Check for server errors
      else if (error.message.includes('500') || error.message.includes('503')) {
        errorMessage = 'Server error. The backend service might be unavailable or still starting up. If this persists, please wait a minute and try again.';
      }
      // Check for model errors
      else if (error.message.includes('not a valid model ID')) {
        errorMessage = 'The selected model is not available on the backend. Please try a different model.';
      }
      
      setError({
        type: error.name === 'AbortError' ? 'timeout' : 'api_error',
        message: `Failed to get feedback: ${errorMessage}`
      });
      
      setLoading(false);
      return;
    }
    
    // Automatically switch to feedback tab
    setActiveTab("feedback");
    setLoading(false);
    
    setSuccess({
      message: "Answer marked successfully!"
    });
  }, [
    answer, 
    examBoard, 
    checkBackendStatus,
    lastRequestDate, 
    lastRequestTime, 
    markScheme, 
    question, 
    selectedModel, 
    subject, 
    textExtract, 
    relevantMaterial, 
    totalMarks, 
    userType,
    questionType
  ]);

  // Effect for analyzing answer content - fixed to properly use the hook
  useEffect(() => {
    if (!answer || answer.length < 20 || hasManuallySetSubject.current) return;
    
    // Call the debounced function with all required parameters
    debouncedClassifySubject(
      answer, 
      subject, 
      hasManuallySetSubject, 
      allSubjects, 
      setSubject, 
      setDetectedSubject, 
      setSuccess
    );
    
    // Cleanup function
    return () => {
      // This pattern ensures the debounce function is properly canceled
      if (typeof debouncedClassifySubject.cancel === 'function') {
        debouncedClassifySubject.cancel();
      }
    };
  }, [answer, debouncedClassifySubject, subject, allSubjects]);

  // ======== EFFECTS & INITIALIZATION ========
  // Initialize OpenAI client
  useEffect(() => {
    // No need to use an API key anymore since the backend handles that
    try {
      // Initialize with empty key since we're using our backend
      const client = new OpenAI({
        apiKey: 'sk-not-needed',
        baseURL: `${API_BASE_URL}/api`,
        dangerouslyAllowBrowser: true
      });
      
      setOpenai(client);
    } catch (error) {
      console.error('OpenAI client initialization failed:', error);
      setError({
        type: 'initialization',
        message: 'AI service initialization failed. Please refresh the page.'
      });
    }
  }, []);
  
  // Load saved form data from session storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedForm = sessionStorage.getItem('aiMarkerFormData');
        if (savedForm) {
          const formData = JSON.parse(savedForm);
          setQuestion(formData.question || "");
          setAnswer(formData.answer || "");
          setSubject(formData.subject || "english");
          setExamBoard(formData.examBoard || "aqa");
          setUserType(formData.userType || "student");
          setMarkScheme(formData.markScheme || "");
          setTotalMarks(formData.totalMarks || "");
          setTextExtract(formData.textExtract || "");
          setRelevantMaterial(formData.relevantMaterial || "");
          setQuestionType(formData.questionType || "general");
          // Don't restore selected model to prevent rate limit issues
          
          // Check if we have saved subjects
          if (formData.customSubjects && formData.customSubjects.length > 0) {
            setCustomSubjects(formData.customSubjects);
            setAllSubjects([...SUBJECTS, ...formData.customSubjects]);
          }
          
          setSuccess({
            message: "Previous work restored from your last session"
          });
          setTimeout(() => {
            setSuccess(null);
          }, 3000);
        }
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    }
  }, []);
  
  // Save form data to session storage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const formData = {
        question,
        answer,
        subject,
        examBoard,
        userType,
        markScheme,
        totalMarks,
        textExtract,
        relevantMaterial,
        customSubjects,
        questionType
      };
      
      try {
        sessionStorage.setItem('aiMarkerFormData', JSON.stringify(formData));
      } catch (error) {
        console.error("Error saving form data:", error);
      }
    }
  }, [question, answer, subject, examBoard, userType, markScheme, totalMarks, textExtract, relevantMaterial, customSubjects, questionType]);

  // Reset form - moved up to fix ReferenceError
  const resetForm = useCallback(() => {
    setQuestion("");
    setAnswer("");
    setFeedback("");
    setGrade("");
    setError(null);
    setSuccess(null);
    setImage(null);
    setMarkScheme("");
    setActiveTab("answer");
    setTotalMarks("");
    setTextExtract("");
    setRelevantMaterial("");
  }, []);

  // Add keyboard shortcuts for common actions
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!loading && answer) {
          handleSubmitForMarking();
          setShortcutFeedback("Submitted for marking");
        }
        e.preventDefault();
      }
      
      // Ctrl/Cmd + Shift + R to reset form
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'r') {
        resetForm();
        setShortcutFeedback("Form reset");
        e.preventDefault();
      }
      
      // Ctrl/Cmd + . to toggle advanced options
      if ((e.ctrlKey || e.metaKey) && e.key === '.') {
        setShowAdvancedOptions(prev => !prev);
        setShortcutFeedback("Toggled advanced options");
        e.preventDefault();
      }
      
      // Ctrl/Cmd + / to toggle help guide
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        setShowHelp(prev => !prev);
        setShortcutFeedback("Toggled help guide");
        e.preventDefault();
      }
      
      // Keyboard shortcut for keyboard shortcuts dialog - Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        setShowKeyboardShortcuts(prev => !prev);
        setShortcutFeedback("Toggled keyboard shortcuts");
        e.preventDefault();
      }
      
      // Clear shortcut feedback after 2 seconds
      setTimeout(() => {
        setShortcutFeedback(null);
      }, 2000);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, answer, handleSubmitForMarking, resetForm]);

  // Focus custom subject input when adding a new subject
  useEffect(() => {
    if (isAddingSubject && customSubjectInputRef.current) {
      customSubjectInputRef.current.focus();
    }
  }, [isAddingSubject]);

  // Add missing image handling functions
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleProcessImage = async () => {
    if (!image) return;
    
    setImageLoading(true);
    
    try {
      const reader = new FileReader();
      const imageBase64 = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(image);
      });
      
      setSuccess({
        message: "Processing your image... Please wait."
      });
      
      // Use our backend API directly instead of OpenAI client
      const response = await fetch(`${API_BASE_URL}/api/image/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({ image_base64: imageBase64 })
      });
      
      if (!response.ok) {
        throw new Error(`Image processing failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      const extractedText = data.text;
      
      // Auto-fill the answer field with the extracted text
      setAnswer(prev => prev ? `${prev}\n${extractedText}` : extractedText);
      
      setSuccess({
        message: "Image processed successfully! Text has been added to your answer."
      });
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Error processing image:", error);
      setError({
        type: "image_processing",
        message: "Failed to process the image. Please try again or enter text manually."
      });
    } finally {
      setImageLoading(false);
      setImage(null); // Clear the image after processing
    }
  };

  // Add missing function to handle custom subject addition
  const addCustomSubject = () => {
    if (!customSubject.trim()) return;
    
    const newSubject = {
      value: customSubject.toLowerCase().replace(/\s+/g, ''),
      label: customSubject.trim()
    };
    
    const updatedCustomSubjects = [...customSubjects, newSubject];
    setCustomSubjects(updatedCustomSubjects);
    setAllSubjects([...SUBJECTS, ...updatedCustomSubjects]);
    setSubject(newSubject.value);
    setIsAddingSubject(false);
    setCustomSubject("");
    
    setSuccess({
      message: `Added custom subject: ${newSubject.label}`
    });
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  // Improve the mark scheme generation function
  const generateMarkScheme = async () => {
    if (!question) {
      setError({
        type: "validation",
        message: "Please enter a question first to generate a mark scheme"
      });
      return;
    }
    
    setLoading(true);
    setSuccess({
      message: "Generating mark scheme with relevant Assessment Objectives..."
    });
    
    let retryCount = 0;
    const maxRetries = 2; // Try up to 3 times total (initial + 2 retries)
    
    while (retryCount <= maxRetries) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          body: JSON.stringify({
            model: "google/gemini-pro:free", // Use a faster model for mark scheme generation
            messages: [
              {
                role: "system",
                content: `You are an expert in GCSE ${subject} for the ${examBoard.toUpperCase()} exam board. Generate a concise mark scheme with relevant Assessment Objectives (AOs) for the following question. Format using bullet points and include key marking criteria.`
              },
              {
                role: "user",
                content: question
              }
            ],
            max_tokens: 1500
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        
        const data = await response.json();
        const generatedMarkScheme = data?.choices?.[0]?.message?.content || "No mark scheme generated. Please try again.";
        
        setMarkScheme(generatedMarkScheme);
        setSuccess({
          message: "Mark scheme generated successfully!"
        });
        
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
        
        break; // Success, exit the retry loop
      } catch (error) {
        console.error("Error generating mark scheme:", error);
        
        if (retryCount === maxRetries) {
          setError({
            type: "api_error",
            message: `Failed to generate mark scheme. Backend service may be starting up. Please try again in a minute.`,
            retry: true
          });
        } else {
          setSuccess({
            message: `Retrying mark scheme generation (${retryCount + 1}/${maxRetries})...`
          });
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 3000 * (retryCount + 1)));
        }
        
        retryCount++;
      }
    }
    
    setLoading(false);
  };

  // Add this component for displaying the Model Thinking Process
  const ModelThinkingBox = ({ thinking, loading }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    if (!thinking && !loading) return null;
    
    return (
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Model Thinking Process</div>
            {loading && !thinking ? (
              <Badge variant="outline" className="ml-2 px-1.5 py-0 text-xs bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                <Loader2 className="mr-1 h-3 w-3 animate-spin" /> 
                Processing...
              </Badge>
            ) : (
              <Badge variant="outline" className="ml-2 px-1.5 py-0 text-xs">Step-by-Step Reasoning</Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 rounded-full"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 
              <ChevronUp size={16} className="text-gray-500 dark:text-gray-400" /> :
              <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
            }
          </Button>
        </div>
        <div 
          className={`overflow-y-auto text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap transition-all duration-300 font-mono border border-gray-100 dark:border-gray-800 p-2 rounded bg-white dark:bg-gray-950 ${
            isExpanded ? 'max-h-[500px]' : 'max-h-48'
          }`}
        >
          {loading && !thinking ? (
            <div className="flex flex-col items-center justify-center py-4 text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin mb-2" />
              <span>Waiting for the model to start thinking...</span>
            </div>
          ) : thinking ? (
            // Process and display thinking, ensuring we only show the [THINKING] part
            thinking.includes('[THINKING]') 
              ? thinking.split('[THINKING]')[1].split('[FEEDBACK]')[0] 
              : thinking
          ) : (
            "Waiting for model's thinking process..."
          )}
        </div>
      </div>
    );
  };

  // TopBar component
  const TopBar = ({ version = "2.1.0", backendStatus }) => {
    return (
      <div className="flex items-center justify-between py-2 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="flex items-center space-x-4">
          <div className="font-semibold text-xl">AI GCSE Marker</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">v{version}</div>
          {backendStatus && (
            <div className="hidden sm:flex items-center space-x-1">
              <div className={`h-2 w-2 rounded-full ${
                backendStatus === 'online' ? 'bg-green-500' : 
                backendStatus === 'rate_limited' ? 'bg-yellow-500' : 
                'bg-red-500'
              }`}></div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{
                backendStatus === 'online' ? 'API Connected' : 
                backendStatus === 'rate_limited' ? 'Rate Limited' : 
                'API Offline'
              }</div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setShowKeyboardShortcuts(true)}
                >
                  <Keyboard size={18} />
                  <span className="sr-only">Keyboard shortcuts</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Keyboard shortcuts</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setShowGuide(!showGuide)}
                  ref={node => setHelpButtonRef(node)}
                >
                  <HelpCircle size={18} />
                  <span className="sr-only">Help</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help & tips</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <TopBar version="2.1.1" backendStatus={backendStatusRef.current} />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {showGuide && <QuickGuide />}
        
        {/* Backend alerts */}
        <EnhancedAlert success={success} error={error} />
        
        {detectedSubject && !hasManuallySetSubject.current && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Subject detected: <strong>{
                  allSubjects.find(s => s.value === detectedSubject)?.label || 'Unknown'
                }</strong>
              </span>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900"
                onClick={() => {
                  setSubject(detectedSubject);
                  hasManuallySetSubject.current = true;
                }}
              >
                Accept
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7 text-gray-500"
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
              className="fixed top-4 right-4 bg-black bg-opacity-80 text-white px-3 py-2 rounded shadow-lg z-50 text-sm"
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
        
        {/* ... existing code ... */}
      </div>
    </div>
  );
};

export default AIMarker;