"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import OpenAI from 'openai';
import { getSubjectGuidance } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ClipboardPaste, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  // Form state
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [subject, setSubject] = useState("english");
  const [examBoard, setExamBoard] = useState("aqa");
  const [userType, setUserType] = useState("student");
  const [marksOutOf, setMarksOutOf] = useState("");
  const [markScheme, setMarkScheme] = useState("");
  const [image, setImage] = useState(null);
  
  // UI state
  const [showHowTo, setShowHowTo] = useState(false);
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
      
      if (!client.apiKey || client.baseURL !== 'https://openrouter.ai/api/v1') {
        throw new Error('Client configuration failed');
      }
      
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
    if (!answer) return;
    
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
    if (detected) {
      setSubject(detected);
      setDetectedSubject(detected);
    }
  }, [answer]);

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
  };

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
        message: `Image "${file.name}" loaded successfully. Click 'Get Feedback' to process.`
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-4 md:p-6"
    >
      <Card className="w-full shadow-lg rounded-xl bg-gradient-to-br from-blue-50/50 to-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            GCSE AI Marker
          </CardTitle>
          <CardDescription className="text-center text-base text-gray-600">
            Submit your answer for instant feedback
          </CardDescription>
          <div className="flex justify-center mt-3">
            <Button
              variant="link"
              onClick={() => setShowHowTo(!showHowTo)}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              {showHowTo ? 'Hide' : 'Show'} How to Use
            </Button>
          </div>
        </CardHeader>
        
        <AnimatePresence>
          {showHowTo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="px-6 pb-6"
            >
              <Card className="bg-blue-50/50 border-blue-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 text-lg text-blue-800">How to Use the GCSE AI Marker:</h3>
                  <ol className="list-decimal pl-5 space-y-3 text-base text-gray-700">
                    <li>Enter the question in the "Question" field</li>
                    <li>Type or paste your answer in the "Your Answer" text area</li>
                    <li>Select appropriate subject, exam board, and user type</li>
                    <li>For handwritten answers:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Click "Upload Image"</li>
                        <li>Select a clear photo of your answer</li>
                        <li>The text will be automatically extracted and added to your answer</li>
                      </ul>
                    </li>
                    <li>Click "Get Feedback" to receive a detailed assessment</li>
                  </ol>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <CardContent className="space-y-6 p-6">
          {/* Form Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Question Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Question</label>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the question text"
                />
              </div>

              {/* Answer Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Your Answer</label>
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="min-h-[150px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type or paste your answer here"
                />
              </div>
            </div>

            {/* Configuration Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                  {detectedSubject && (
                    <span className="ml-2 text-xs text-blue-600">
                      (Auto-detected: {SUBJECTS.find(s => s.value === detectedSubject)?.label})
                    </span>
                  )}
                </label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((subj) => (
                      <SelectItem key={subj.value} value={subj.value}>{subj.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Exam Board</label>
                <Select value={examBoard} onValueChange={setExamBoard}>
                  <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select exam board" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXAM_BOARDS.map((board) => (
                      <SelectItem key={board.value} value={board.value}>{board.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">User Type</label>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Marks Out Of</label>
                <input
                  type="number"
                  value={marksOutOf}
                  onChange={(e) => setMarksOutOf(e.target.value)}
                  min="1"
                  max="100"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g. 10"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Mark Scheme (optional)</label>
                <input
                  type="text"
                  value={markScheme}
                  onChange={(e) => setMarkScheme(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Key marking points"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload Handwritten Answer (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {image && (
                <p className="text-sm text-green-600 mt-1">
                  Image loaded: {image.name} ({(image.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button
              onClick={resetForm}
              type="button"
              variant="outline"
              className="w-full sm:w-1/3 border-blue-300 text-blue-700 hover:bg-blue-50"
              disabled={loading}
            >
              Reset Form
            </Button>
            
            <Button
              onClick={handleSubmitForMarking}
              disabled={loading || !answer}
              className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Get Feedback'
              )}
            </Button>
          </div>

          {/* Status Messages */}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          
          {success && !error && (
            <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success.message}</AlertDescription>
            </Alert>
          )}

          {/* Feedback Display */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200"
            >
              <h3 className="text-lg font-semibold mb-4">Feedback:</h3>
              <ReactMarkdown className="prose max-w-none">
                {feedback}
              </ReactMarkdown>
              {grade && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md flex items-center">
                  <span className="font-medium mr-2">Predicted Grade:</span>
                  <span className="text-xl font-bold text-blue-700">{grade}</span>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center p-6 pt-0">
          <p className="text-xs text-gray-500">
            This AI marker provides guidance based on GCSE standards but is not a substitute for official marking.
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AIMarker;