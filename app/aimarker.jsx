"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import OpenAI from 'openai';
import { getSubjectGuidance } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, AlertTriangle, CheckCircle2, RefreshCw, HelpCircle, ChevronDown, ChevronRight, Save, Share2, ExternalLink, Settings, FilePlus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  { value: "deepseek/deepseek-v3:free", label: "Good All-Rounder", description: "Balanced speed and quality" }
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

// Helper function to save feedback as PDF - placeholder for actual implementation
const saveFeedbackAsPdf = () => {
  alert("PDF download feature will be added in the next update!");
};

// Helper function to copy feedback to clipboard
const copyFeedbackToClipboard = (feedback) => {
  if (feedback) {
    navigator.clipboard.writeText(feedback);
    alert("Feedback copied to clipboard!");
  }
};

const AIMarker = () => {
  // ======== STATE MANAGEMENT ========
  // Form state
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [subject, setSubject] = useState("english");
  const [examBoard, setExamBoard] = useState("aqa");
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
  
  // API and rate limiting
  const [openai, setOpenai] = useState(null);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [dailyRequests, setDailyRequests] = useState(0);
  const [lastRequestDate, setLastRequestDate] = useState(new Date().toDateString());
  const [selectedModel, setSelectedModel] = useState("google/gemini-2.5-pro-exp-03-25");

  // ======== HELPER FUNCTIONS ========
  // Reset form
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
  
  // Process image upload
  const processImageUpload = useCallback(async (imageFile) => {
    if (!imageFile || !openai) return null;
    
    try {
      const reader = new FileReader();
      const imageBase64 = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(imageFile);
      });
      
      setLoading(true);
      setSuccess({
        message: "Processing your image... Please wait."
      });
      
      const imageCompletion = await openai.chat.completions.create({
        model: 'google/gemini-2.0-flash-exp:free', // Always use Gemini Flash for image processing
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Convert this image to text with autocorrection for spelling and grammar. Return only the corrected text."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 2000
      });
      
      const extractedText = imageCompletion.choices[0].message.content;
      
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
      setLoading(false);
      setImage(null); // Clear the image after processing
    }
  }, [openai]);

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
    
    // Rate limiting checks
    const now = Date.now();
    const today = new Date().toDateString();
    
    if (today !== lastRequestDate) {
      setDailyRequests(0);
      setLastRequestDate(today);
    }
    
    // Special rate limit for Gemini 2.5 Pro
    if (selectedModel === "google/gemini-2.5-pro-exp-03-25" && now - lastRequestTime < 60000) {
      setError({
        type: "rate_limit",
        message: "Gemini 2.5 Pro is limited to 1 request per minute. Please wait or select a different model."
      });
      return;
    } else if (selectedModel !== "google/gemini-2.5-pro-exp-03-25" && now - lastRequestTime < 10000) {
      setError({
        type: "rate_limit",
        message: "Please wait at least 10 seconds between requests"
      });
      return;
    }
    
    if (dailyRequests >= 500) {
      setError({
        type: "rate_limit",
        message: "Daily request limit reached (500/day)"
      });
      return;
    }

    // Set loading state
    setLoading(true);
    setLastRequestTime(now);
    setDailyRequests(prev => prev + 1);
    
    try {
      // Check if OpenAI client is initialized
      if (!openai) {
        throw new Error("AI service not initialized");
      }
      
      // Process image if uploaded
      if (image) {
        const imageText = await processImageUpload(image);
        if (imageText) {
          setAnswer(prev => prev ? `${prev}\n${imageText}` : imageText);
        }
      }
       
      // Build prompt for AI
      let content = `Please mark this ${examBoard.toUpperCase()} ${subject} GCSE response:\n\nQuestion: ${question}\n\nAnswer: ${answer}`;
      if (markScheme) content += `\n\nMark Scheme: ${markScheme}`;
      if (totalMarks) content += `\n\nMarks Available: ${totalMarks}`;
      if (textExtract) content += `\n\nText Extract: ${textExtract}`;
      if (relevantMaterial) content += `\n\nRelevant Material: ${relevantMaterial}`;
       
      // Get AI feedback
      const completion = await openai.chat.completions.create({
        model: selectedModel,
        messages: [
          {
            role: "system",
            content: `You are an experienced GCSE ${subject} examiner. Your task is to provide detailed, constructive feedback for ${userType === 'teacher' ? 'assessment purposes' : 'student learning'} following these guidelines:

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
   e) GCSE grade (9-1) with brief justification

3. TONE & STYLE:
   - ${userType === 'teacher' ? 'Professional and assessment-focused' : 'Approachable and encouraging'}
   - Specific praise ("Excellent use of terminology when...")
   - Constructive criticism ${userType === 'teacher' ? '("This meets level 3 criteria because...")' : '("Consider expanding on...")'}
   - Avoid vague statements - always reference the answer

4. SUBJECT-SPECIFIC GUIDANCE:
   ${getSubjectGuidance(subject, examBoard)}`
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
        stream: selectedModel === "deepseek/deepseek-r1:free" // Only stream for thinking model
      });

      // Process response based on whether it's streamed or not
      if (selectedModel === "deepseek/deepseek-r1:free") {
        let fullResponse = "";
        let thinking = "";
        
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || "";
          fullResponse += content;
          
          // Show thinking in real-time for the thinking model
          if (content) {
            thinking += content;
            setModelThinking(thinking);
          }
        }
        
        setFeedback(fullResponse);
          
        const gradeMatch = fullResponse.match(/grade\s*:?\s*([1-9])/i);
        if (gradeMatch && gradeMatch[1]) {
          setGrade(gradeMatch[1]);
        }
      } else {
        // Regular non-streaming response handling
        if (completion.choices && completion.choices[0].message.content) {
          const content = completion.choices[0].message.content;
          setFeedback(content);
          
          const gradeMatch = content.match(/grade\s*:?\s*([1-9])/i);
          if (gradeMatch && gradeMatch[1]) {
            setGrade(gradeMatch[1]);
          }
        }
      }
      
      // Automatically switch to feedback tab
      setActiveTab("feedback");
      
      setSuccess({
        message: "Answer marked successfully!"
      });
    } catch (error) {
      console.error("Error marking work:", error);
      
      let errorMessage = "Sorry, there was an error processing your request.";
      let errorType = "api";
      
      if (error.message.includes("Network Error")) {
        errorMessage = "Network error. Please check your internet connection and try again.";
        errorType = "network";
      } else if (error.message.includes("rate limit")) {
        errorMessage = "We're getting too many requests. Please wait a moment and try again.";
        errorType = "rate_limit";
      } else if (error.message.includes("authentication")) {
        errorMessage = "Authentication error. Please contact support if this continues.";
        errorType = "auth";
      }
      
      setError({
        type: errorType,
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }, [answer, examBoard, image, lastRequestDate, lastRequestTime, dailyRequests, markScheme, openai, processImageUpload, question, selectedModel, subject, textExtract, relevantMaterial, totalMarks, userType]);

  // ======== EFFECTS & INITIALIZATION ========
  // Initialize OpenAI client
  useEffect(() => {
    // Use the environment API key
    const keyToUse = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    
    if (!keyToUse) {
      console.error('OpenRouter API key not configured');
      setError({
        type: 'config',
        message: 'API key not configured. Please set your OpenRouter API key as an environment variable.'
      });
      return;
    }

    try {
      const client = new OpenAI({
        apiKey: keyToUse,
        baseURL: 'https://openrouter.ai/api/v1',
        dangerouslyAllowBrowser: true,
        defaultHeaders: {
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
          'X-Title': 'GCSE AI Marker'
        }
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
        customSubjects
      };
      
      try {
        sessionStorage.setItem('aiMarkerFormData', JSON.stringify(formData));
      } catch (error) {
        console.error("Error saving form data:", error);
      }
    }
  }, [question, answer, subject, examBoard, userType, markScheme, totalMarks, textExtract, relevantMaterial, customSubjects]);

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
        setShowGuide(prev => !prev);
        setShortcutFeedback("Toggled help guide");
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

  // Detect subject from answer text
  useEffect(() => {
    if (!answer || answer.length < 20) return;
    
    const detectSubjectFromText = () => {
      const answerLower = answer.toLowerCase();
      
      for (const [subj, keywords] of Object.entries(subjectKeywords)) {
        if (keywords.some(keyword => answerLower.includes(keyword))) {
          return subj;
        }
      }
      return null;
    };
    
    const detected = detectSubjectFromText();
    if (detected && detected !== subject) {
      setSubject(detected);
      setDetectedSubject(detected);
      setSuccess({
        message: `Subject automatically detected as ${allSubjects.find(s => s.value === detected)?.label}`
      });
      
      // Auto-clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }
  }, [answer, subject, allSubjects]);

  // ======== HELPER FUNCTIONS ========
  // Add custom subject
  const addCustomSubject = useCallback(() => {
    if (customSubject.trim() === "") return;
    
    const newSubject = {
      value: customSubject.toLowerCase().replace(/\s+/g, ''),
      label: customSubject.trim()
    };
    
    setCustomSubjects([...customSubjects, newSubject]);
    setAllSubjects([...allSubjects, newSubject]);
    setSubject(newSubject.value);
    setCustomSubject("");
    setIsAddingSubject(false);
    
    setSuccess({
      message: `Added new subject: ${newSubject.label}`
    });
    
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  }, [customSubject, customSubjects, allSubjects, setCustomSubjects, setAllSubjects, setSubject, setCustomSubject, setIsAddingSubject, setSuccess]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError({
          type: "validation",
          message: "Image file is too large. Maximum size is 5MB."
        });
        return;
      }
      setImage(file);
      setSuccess({
        message: `Image "${file.name}" loaded. Click 'Process Image' to extract text.`
      });
    }
  };

  // Process uploaded image immediately
  const handleProcessImage = () => {
    if (image) {
      processImageUpload(image);
    }
  };

  // Toggle advanced options
  const toggleAdvancedOptions = useCallback(() => {
    setShowAdvancedOptions(!showAdvancedOptions);
  }, [showAdvancedOptions]);

  // ======== JSX / UI COMPONENTS ========
  // Quick guide dropdown content
  const QuickGuide = () => {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Card className="bg-gray-50 border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800 relative">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowGuide(false)}
            className="absolute right-2 top-2 h-7 w-7 rounded-full p-0"
            aria-label="Close guide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Quick Guide:</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="flex items-start">
                    <span className="font-bold text-gray-700 dark:text-gray-300 mr-2">1.</span>
                    <span className="text-gray-700 dark:text-gray-300">Enter your question and answer in the appropriate fields</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-gray-700 dark:text-gray-300 mr-2">2.</span>
                    <span className="text-gray-700 dark:text-gray-300">Select your subject, exam board, and whether you're a student or teacher</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-gray-700 dark:text-gray-300 mr-2">3.</span>
                    <span className="text-gray-700 dark:text-gray-300">Add marks available and optional mark scheme details</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-gray-700 dark:text-gray-300 mr-2">4.</span>
                    <span className="text-gray-700 dark:text-gray-300">Choose your preferred AI model (each has different strengths)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-gray-700 dark:text-gray-300 mr-2">5.</span>
                    <span className="text-gray-700 dark:text-gray-300">Click 'Mark My Answer' to receive detailed feedback</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Tips:</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="flex items-start">
                    <span className="text-gray-700 dark:text-gray-300 mr-2">•</span>
                    <span className="text-gray-700 dark:text-gray-300">For handwritten answers, upload a clear photo and click 'Process Image'</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-700 dark:text-gray-300 mr-2">•</span>
                    <span className="text-gray-700 dark:text-gray-300">The subject may be auto-detected from keywords in your answer</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-700 dark:text-gray-300 mr-2">•</span>
                    <span className="text-gray-700 dark:text-gray-300">Try different AI models to see which gives you the best feedback</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-700 dark:text-gray-300 mr-2">•</span>
                    <span className="text-gray-700 dark:text-gray-300">Feedback includes strengths, areas for improvement and an estimated grade</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Keyboard Shortcuts:</h3>
                <div className="mt-2 grid grid-cols-2 gap-y-1 gap-x-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Submit for marking:</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-xs">Ctrl+Enter</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Reset form:</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-xs">Ctrl+Shift+R</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Toggle advanced options:</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-xs">Ctrl+.</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Toggle help guide:</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-xs">Ctrl+/</kbd>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-2 sm:p-4 md:p-6"
    >
      {/* Keyboard shortcut feedback indicator */}
      <AnimatePresence>
        {shortcutFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-black/80 text-white px-4 py-2 rounded-md shadow-lg text-sm">
              {shortcutFeedback}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="w-full shadow-lg rounded-xl bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/20 dark:to-gray-950/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-400 dark:to-gray-600 bg-clip-text text-transparent">
                GCSE AI Marker
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Instant feedback on your GCSE answers
              </CardDescription>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowGuide(!showGuide)}
                    className="h-8 w-8 rounded-full p-0"
                  >
                    <HelpCircle size={18} className="text-gray-600 dark:text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>How to use this tool</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {showGuide && (
            <div className="guide-card">
              <QuickGuide />
            </div>
          )}
          
          {/* Subject Selector as Dropdown with Add Custom Option */}
          <div className="flex flex-wrap gap-2 pt-2">
            {!isAddingSubject ? (
              <>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="w-[180px] bg-white dark:bg-gray-900">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="max-h-[300px] overflow-y-auto">
                      {allSubjects.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                      <div className="border-t border-gray-200 dark:border-gray-800 my-1"></div>
                      <button
                        className="w-full py-1.5 px-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1.5"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsAddingSubject(true);
                        }}
                      >
                        <FilePlus className="h-4 w-4" /> Add custom subject
                      </button>
                    </div>
                  </SelectContent>
                </Select>
                
                {/* Model Selector */}
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-[280px] bg-white dark:bg-gray-900">
                    <div className="flex items-center">
                      <Settings className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                      <SelectValue placeholder="Select AI model" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        <div>
                          <div className="font-medium">{model.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{model.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            ) : (
              <div className="flex gap-2">
                <input
                  ref={customSubjectInputRef}
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Enter subject name"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addCustomSubject();
                    } else if (e.key === 'Escape') {
                      setIsAddingSubject(false);
                      setCustomSubject("");
                    }
                  }}
                />
                <Button 
                  size="sm" 
                  onClick={addCustomSubject}
                  disabled={!customSubject.trim()}
                >
                  Add
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsAddingSubject(false);
                    setCustomSubject("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {/* Status Messages */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          
          {success && !error && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:border-green-900 dark:text-green-300">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success.message}</AlertDescription>
            </Alert>
          )}

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="answer">Answer Sheet</TabsTrigger>
              <TabsTrigger value="feedback" disabled={!feedback}>
                Assessment
                {grade && <span className="ml-2 py-0.5 px-2 text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-full">Grade: {grade}</span>}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="answer" className="space-y-4 mt-0">
              {/* Question Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Question</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Marks:</label>
                      <input
                        type="number"
                        value={totalMarks}
                        onChange={(e) => setTotalMarks(e.target.value)}
                        placeholder="#"
                        min="1"
                        max="100"
                        className="w-16 h-8 px-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      />
                    </div>
                    
                    <Select value={examBoard} onValueChange={setExamBoard}>
                      <SelectTrigger className="h-8 w-[120px] text-xs">
                        <SelectValue placeholder="Exam Board" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXAM_BOARDS.map((board) => (
                          <SelectItem key={board.value} value={board.value}>{board.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={userType} onValueChange={setUserType}>
                      <SelectTrigger className="h-8 w-[100px] text-xs">
                        <SelectValue placeholder="I am a..." />
                      </SelectTrigger>
                      <SelectContent>
                        {USER_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[80px] focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  placeholder="Enter the exam question here..."
                />
              </div>

              {/* Answer Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Student Answer</label>
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="min-h-[200px] focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  placeholder="Type or paste your answer here..."
                />
              </div>

              {/* Advanced Options - Now properly collapsible */}
              <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <button 
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="w-full flex items-center justify-between mb-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <span className="flex items-center">
                    {showAdvancedOptions ? <ChevronDown size={16} className="mr-1" /> : <ChevronRight size={16} className="mr-1" />}
                    Advanced Options
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {showAdvancedOptions ? "Hide" : "Show"}
                  </Badge>
                </button>
                
                <AnimatePresence>
                  {showAdvancedOptions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                            Mark Scheme (optional)
                          </label>
                          <Textarea
                            value={markScheme}
                            onChange={(e) => setMarkScheme(e.target.value)}
                            className="min-h-[100px] focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            placeholder="Enter marking points or assessment criteria..."
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                            Text Extract (optional)
                          </label>
                          <Textarea
                            value={textExtract}
                            onChange={(e) => setTextExtract(e.target.value)}
                            className="min-h-[100px] focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            placeholder="Paste relevant text extract here..."
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                            Relevant Material (optional)
                          </label>
                          <Textarea
                            value={relevantMaterial}
                            onChange={(e) => setRelevantMaterial(e.target.value)}
                            className="min-h-[100px] focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            placeholder="Enter any relevant material or notes here..."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Upload Handwritten Answer
                          </label>
                          <div className="space-y-2">
                            <label className="flex items-center justify-center w-full h-24 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600">
                              <div className="flex flex-col items-center space-y-2">
                                <Upload className="w-6 h-6 text-gray-400" />
                                <span className="font-medium text-sm text-gray-600 dark:text-gray-400">
                                  {image ? image.name : "Drop files or click to upload"}
                                </span>
                                {image && (
                                  <span className="text-xs text-green-600 dark:text-green-400">
                                    ({(image.size / 1024).toFixed(1)} KB)
                                  </span>
                                )}
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                              />
                            </label>
                            
                            {image && (
                              <Button 
                                onClick={handleProcessImage}
                                variant="secondary"
                                className="w-full"
                                disabled={loading}
                              >
                                {loading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Converting Image...
                                  </>
                                ) : (
                                  <>Process Image</>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <Button
                  onClick={resetForm}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                  disabled={loading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                
                <Button
                  onClick={handleSubmitForMarking}
                  disabled={loading || !answer}
                  size="lg"
                  className="bg-gray-600 hover:bg-gray-700 text-white transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Mark My Answer'
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="feedback" className="space-y-4 mt-0">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                  <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">
                    Marking your answer...
                  </span>
                </div>
              ) : feedback ? (
                <>
                  {/* Model Thinking Box */}
                  {selectedModel === "deepseek/deepseek-r1:free" && modelThinking && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md">
                      <div className="flex items-center mb-2">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Model Thinking Process</div>
                        <Badge variant="outline" className="ml-2 px-1.5 py-0 text-xs">Reasoning</Badge>
                      </div>
                      <div className="max-h-48 overflow-y-auto text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                        {modelThinking}
                      </div>
                    </div>
                  )}
                  
                  <div className="relative">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        {grade && (
                          <div className="inline-flex items-center justify-center h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold rounded-full">
                            {grade}
                          </div>
                        )}
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                          Feedback
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyFeedbackToClipboard(feedback)}
                                className="h-8 w-8 p-0 rounded-full"
                              >
                                <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy to clipboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={saveFeedbackAsPdf}
                                className="h-8 w-8 p-0 rounded-full"
                              >
                                <Save className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Save as PDF</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    
                    <div className="prose prose-sm dark:prose-invert prose-p:my-2 prose-h1:text-xl prose-h1:my-3 prose-h2:text-lg prose-h2:my-3 prose-h3:text-base prose-h3:font-semibold prose-h3:my-2.5 max-w-none">
                      <ReactMarkdown>{feedback}</ReactMarkdown>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-3 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">No Feedback Yet</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-500 max-w-md">
                    Submit your answer for marking to see detailed feedback here. 
                    Your feedback will include strengths, areas for improvement, and an estimated grade.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4 p-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            This AI marker provides guidance based on GCSE criteria but should not replace official marking.
            Selected model: <span className="font-medium">{AI_MODELS.find(m => m.value === selectedModel)?.label || selectedModel}</span>
          </p>
          
          <Button
            variant="link"
            size="sm"
            className="text-xs text-gray-600 dark:text-gray-400"
            onClick={() => window.open('https://www.gov.uk/government/publications/gcse-9-to-1-qualification-level-conditions', '_blank')}
          >
            <ExternalLink size={12} className="mr-1" />
            GCSE Qualification Standards
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AIMarker;

