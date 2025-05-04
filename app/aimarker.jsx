"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import OpenAI from 'openai';
import { getSubjectGuidance } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, AlertTriangle, CheckCircle2, RefreshCw, HelpCircle, ChevronDown } from "lucide-react";
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

const subjectKeywords = {
  english: ['shakespeare', 'poem', 'poetry', 'novel', 'character', 'theme', 'literature'],
  maths: ['equation', 'solve', 'calculate', 'algebra', 'geometry', 'trigonometry', 'formula'],
  science: ['experiment', 'hypothesis', 'cell', 'atom', 'energy', 'physics', 'chemistry', 'biology'],
  history: ['war', 'battle', 'king', 'queen', 'century', 'revolution', 'empire', 'historical'],
  geography: ['map', 'climate', 'population', 'country', 'city', 'river', 'mountain', 'ecosystem'],
  computerScience: ['programming', 'algorithm', 'code', 'computer', 'software', 'hardware'],
  businessStudies: ['business', 'market', 'finance', 'profit', 'enterprise', 'economy']
};

const AIMarker = () => {
  // ======== STATE MANAGEMENT ========
  // Form state
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [subject, setSubject] = useState("english");
  const [examBoard, setExamBoard] = useState("aqa");
  const [userType, setUserType] = useState("student");
  const [marksOutOf, setMarksOutOf] = useState("");
  const [markScheme, setMarkScheme] = useState("");
  const [image, setImage] = useState(null);
  const [activeTab, setActiveTab] = useState("answer");
  
  // UI state
  const [showGuide, setShowGuide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [detectedSubject, setDetectedSubject] = useState(null);
  
  // API and rate limiting
  const [openai, setOpenai] = useState(null);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [dailyRequests, setDailyRequests] = useState(0);
  const [lastRequestDate, setLastRequestDate] = useState(new Date().toDateString());
  const selectedModel = "google/gemini-2.5-pro-exp-03-25"; // Could be made configurable

  // ======== EFFECTS & INITIALIZATION ========
  // Initialize OpenAI client
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('OpenRouter API key not configured');
      setError({
        type: 'config',
        message: 'API key not configured. Please contact support.'
      });
      return;
    }

    try {
      const client = new OpenAI({
        apiKey: apiKey,
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
        message: `Subject automatically detected as ${SUBJECTS.find(s => s.value === detected)?.label}`
      });
      
      // Auto-clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }
  }, [answer, subject]);

  // ======== HELPER FUNCTIONS ========
  // Process image upload
  const processImageUpload = useCallback(async (imageFile) => {
    if (!imageFile || !openai) return null;
    
    try {
      const reader = new FileReader();
      const imageBase64 = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(imageFile);
      });
      
      const imageCompletion = await openai.chat.completions.create({
        model: 'google/gemini-2.0-flash-exp:free',
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
      
      return imageCompletion.choices[0].message.content;
    } catch (error) {
      console.error("Error processing image:", error);
      setError({
        type: "image_processing",
        message: "Failed to process the image. Please try again or enter text manually."
      });
      return null;
    }
  }, [openai]);

  // Reset form
  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setFeedback("");
    setGrade("");
    setError(null);
    setSuccess(null);
    setImage(null);
    setActiveTab("answer");
  };

  // ======== MAIN FUNCTIONS ========
  // Submit handler
  const handleSubmitForMarking = async () => {
    // Clear previous feedback and errors
    setFeedback("");
    setGrade("");
    setError(null);
    setSuccess(null);
    
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
    
    if (now - lastRequestTime < 60000) {
      setError({
        type: "rate_limit",
        message: "Please wait at least 1 minute between requests"
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
      if (marksOutOf) content += `\n\nThis question is out of ${marksOutOf} marks.`;
      if (markScheme) content += `\n\nMark Scheme: ${markScheme}`;
       
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
        presence_penalty: 0
      });

      // Process response
      if (completion.choices && completion.choices[0].message.content) {
        const content = completion.choices[0].message.content;
        setFeedback(content);
        
        const gradeMatch = content.match(/grade\s*:?\s*([1-9])/i);
        if (gradeMatch && gradeMatch[1]) {
          setGrade(gradeMatch[1]);
        }
        
        // Automatically switch to feedback tab
        setActiveTab("feedback");
      }
      
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
  };

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
        message: `Image "${file.name}" loaded successfully. Click 'Mark My Answer' to process.`
      });
    }
  };

  // ======== JSX / UI COMPONENTS ========
  // Quick guide dropdown content
  const QuickGuide = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Card className="bg-blue-50 border-blue-200 shadow-sm">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-blue-800">Quick Guide:</h3>
              <ul className="mt-2 space-y-1 text-sm">
                <li className="flex items-start">
                  <span className="font-bold text-blue-700 mr-2">1.</span>
                  <span>Enter your question and answer in the appropriate fields</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-blue-700 mr-2">2.</span>
                  <span>Select your subject, exam board, and whether you're a student or teacher</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-blue-700 mr-2">3.</span>
                  <span>Add marks available and optional mark scheme details</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-blue-700 mr-2">4.</span>
                  <span>Click 'Mark My Answer' to receive detailed feedback</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-blue-800">Tips:</h3>
              <ul className="mt-2 space-y-1 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-700 mr-2">•</span>
                  <span>For handwritten answers, upload a clear photo</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-700 mr-2">•</span>
                  <span>The subject may be auto-detected from keywords in your answer</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-700 mr-2">•</span>
                  <span>Feedback includes strengths, areas for improvement and an estimated grade</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-2 sm:p-4 md:p-6"
    >
      <Card className="w-full shadow-lg rounded-xl bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-900/20 dark:to-blue-950/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
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
                    <HelpCircle size={18} className="text-blue-600 dark:text-blue-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>How to use this tool</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {showGuide && <QuickGuide />}
          
          {/* Subject Selector Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {SUBJECTS.map((s) => (
              <Badge
                key={s.value}
                variant={subject === s.value ? "default" : "outline"}
                className={`cursor-pointer ${
                  subject === s.value 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "hover:bg-blue-100 dark:hover:bg-blue-900/30"
                }`}
                onClick={() => setSubject(s.value)}
              >
                {s.label}
              </Badge>
            ))}
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
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success.message}</AlertDescription>
            </Alert>
          )}

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="answer">Your Answer</TabsTrigger>
              <TabsTrigger value="feedback" disabled={!feedback}>
                Feedback
                {grade && <span className="ml-2 py-0.5 px-2 text-xs bg-blue-100 text-blue-800 rounded-full">Grade: {grade}</span>}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="answer" className="space-y-4 mt-0">
              {/* Question Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Question</label>
                  <div className="flex items-center space-x-2">
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
                  className="min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the exam question here..."
                />
              </div>

              {/* Answer Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Your Answer</label>
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="min-h-[200px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type or paste your answer here..."
                />
              </div>

              {/* Advanced Options */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-3">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <ChevronDown size={16} className="mr-1" />
                    Advanced Options
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">
                      Marks Available
                    </label>
                    <input
                      type="number"
                      value={marksOutOf}
                      onChange={(e) => setMarksOutOf(e.target.value)}
                      min="1"
                      max="100"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-8 text-sm"
                      placeholder="e.g. 10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">
                      Mark Scheme (optional)
                    </label>
                    <input
                      type="text"
                      value={markScheme}
                      onChange={(e) => setMarkScheme(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-8 text-sm"
                      placeholder="Key marking points"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Upload Handwritten Answer
                  </label>
                  <label className="flex items-center justify-center w-full h-24 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-500 focus:outline-none">
                    <div className="flex flex-col items-center space-y-2">
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="font-medium text-sm text-gray-600">
                        {image ? image.name : "Drop files or click to upload"}
                      </span>
                      {image && (
                        <span className="text-xs text-green-600">
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
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <Button
                  onClick={resetForm}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  disabled={loading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                
                <Button
                  onClick={handleSubmitForMarking}
                  disabled={loading || !answer}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
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
              {feedback ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                >
                  {grade && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200 flex items-center justify-between">
                      <span className="font-medium text-gray-700">Grade:</span>
                      <span className="text-2xl font-bold text-blue-700">{grade}</span>
                    </div>
                  )}
                  
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Feedback:</h3>
                  <div className="prose prose-blue max-w-none">
                    <ReactMarkdown>{feedback}</ReactMarkdown>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Button 
                      onClick={() => setActiveTab("answer")}
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Back to Answer
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Feedback Yet</h3>
                  <p className="text-gray-500 mb-4">Submit your answer to receive detailed feedback</p>
                  <Button 
                    onClick={() => setActiveTab("answer")}
                    variant="secondary"
                  >
                    Go to Answer Form
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-center p-4 text-center">
          <p className="text-xs text-gray-500">
            This AI marker provides guidance based on GCSE criteria but should not replace official marking.
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AIMarker;