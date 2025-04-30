"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import OpenAI from 'openai';
import { getSubjectGuidance } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ClipboardPaste } from "lucide-react";

const AIMarker = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("english");
  const [detectedSubject, setDetectedSubject] = useState(null);
  const [showHowTo, setShowHowTo] = useState(false);
  const [examBoard, setExamBoard] = useState("aqa");
  const [grade, setGrade] = useState("");
  const [image, setImage] = useState(null);
  const [markScheme, setMarkScheme] = useState("");
  const [marksOutOf, setMarksOutOf] = useState("");
  const [userType, setUserType] = useState("student");
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState("google/gemini-2.5-pro-exp-03-25");
  const [thinking, setThinking] = useState(false);

  const [openai, setOpenai] = useState(null);

  useEffect(() => {
    const config = {
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '',
      defaultHeaders: {
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
        'X-Title': 'GCSE AI Marker',
      },
    };
    
    if (config.apiKey) {
      setOpenai(new OpenAI(config));
    } else {
      console.error('OpenRouter API key not configured');
    }
  }, []);

  useEffect(() => {
    if (!answer) return;
    
    const answerLower = answer.toLowerCase();
    const subjectKeywords = {
      english: ['shakespeare', 'poem', 'poetry', 'novel', 'character', 'theme', 'literature'],
      maths: ['equation', 'solve', 'calculate', 'algebra', 'geometry', 'trigonometry', 'formula'],
      science: ['experiment', 'hypothesis', 'cell', 'atom', 'energy', 'physics', 'chemistry', 'biology'],
      history: ['war', 'battle', 'king', 'queen', 'century', 'revolution', 'empire', 'historical'],
      geography: ['map', 'climate', 'population', 'country', 'city', 'river', 'mountain', 'ecosystem'],
      computerScience: ['programming', 'algorithm', 'code', 'computer', 'software', 'hardware'],
      businessStudies: ['business', 'market', 'finance', 'profit', 'enterprise', 'economy']
    };
    
    for (const [subj, keywords] of Object.entries(subjectKeywords)) {
      if (keywords.some(keyword => answerLower.includes(keyword))) {
        setSubject(subj);
        setDetectedSubject(subj);
        break;
      }
    }
  }, [answer]);

  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [dailyRequests, setDailyRequests] = useState(0);
  const [lastRequestDate, setLastRequestDate] = useState(new Date().toDateString());

  const handleSubmitForMarking = async () => {
    const now = Date.now();
    const today = new Date().toDateString();
    
    // Reset counter if new day
    if (today !== lastRequestDate) {
      setDailyRequests(0);
      setLastRequestDate(today);
    }
    
    // Check rate limits based on model
    if (selectedModel.includes('gemini') && now - lastRequestTime < 60000) {
      setError({
        type: "rate_limit",
        message: "Please wait at least 1 minute between Gemini requests"
      });
      return;
    }
    
    if (selectedModel.includes('deepseek') && dailyRequests >= 500) {
      setError({
        type: "rate_limit",
        message: "Daily DeepSeek request limit reached (500/day)"
      });
      return;
    }

    setLoading(true);
    setFeedback("");
    setGrade("");
    setError(null);
    setLastRequestTime(now);
    
    // Basic validation
    if (!answer) {
      setError({
        type: "validation",
        message: "Please enter an answer to be marked"
      });
      setLoading(false);
      return;
    }
    
    try {
      if (!openai) {
        setError({
          type: "initialization",
          message: "AI service not initialized. Please refresh the page."
        });
        setLoading(false);
        return;
      }
      
      if (image) {
        // Convert image to base64
        const reader = new FileReader();
        const imageBase64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.readAsDataURL(image);
        });
        
        // Process image with gemini-2.0-flash-exp:free
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
        
        const imageText = imageCompletion.choices[0].message.content;
        setAnswer(prev => prev ? `${prev}\n${imageText}` : imageText);
      }
       
      let content = `Please mark this ${examBoard.toUpperCase()} ${subject} GCSE response:\n\nQuestion: ${question}\n\nAnswer: ${answer}`;
      if (marksOutOf) {
        content += `\n\nThis question is out of ${marksOutOf} marks.`;
      }
       
      if (markScheme) {
        content += `\n\nMark Scheme: ${markScheme}`;
      }
       
      const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.5-pro-exp-03-25',
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
   ${getSubjectGuidance(subject, examBoard)}

Example feedback for reference:
"Your analysis of the poem's structure is insightful (strength). You correctly identified the rhyme scheme (evidence). To improve, try linking this to the poem's themes (suggestion). Your grade is 6 - with more thematic links you could reach 7."`
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: 0.7,
        max_tokens: 4000, // Increased from 1000
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      });

      console.log("API Response:", completion); // Full response log
      const data = completion;
      if (data.choices && data.choices[0].message.content) {
        const content = data.choices[0].message.content;
        console.log("Full AI response:", {
          length: content.length,
          preview: content.substring(0, 100) + (content.length > 100 ? "..." : "")
        });
        setFeedback(content);
        
        // Extract the grade from the content
        const gradeMatch = content.match(/grade\s*:?\s*([1-9])/i);
        if (gradeMatch && gradeMatch[1]) {
          setGrade(gradeMatch[1]);
        }
      }
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
      setThinking(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-4"
    >
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">GCSE AI Marker</CardTitle>
          <CardDescription className="text-center">Submit your answer for instant feedback</CardDescription>
          <div className="flex justify-center mt-2">
            <Button
              variant="link"
              onClick={() => setShowHowTo(!showHowTo)}
              className="text-sm"
            >
              {showHowTo ? 'Hide' : 'Show'} How to Use
            </Button>
          </div>
        </CardHeader>
        
        {showHowTo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-6 pb-4"
          >
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">How to Use the GCSE AI Marker:</h3>
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  <li>Enter the question in the "Question" field</li>
                  <li>Type or paste your answer in the "Your Answer" text area</li>
                  <li>For handwritten answers:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Click "Upload Image"</li>
                      <li>Select a clear photo of your answer</li>
                      <li>The text will be automatically extracted and added to your answer</li>
                    </ul>
                  </li>
                  <li>The AI will detect the subject based on your answer's content</li>
                  <li>Select your exam board for more accurate feedback</li>
                  <li>Add mark scheme details if available</li>
                  <li>Click "Submit for Marking" to get detailed feedback and grade</li>
                </ol>
                <div className="mt-3 space-y-1 text-sm">
                  <p className="text-blue-700 font-medium">Tips for best results:</p>
                  <ul className="list-disc pl-5 text-blue-700">
                    <li>Ensure photos are well-lit and in focus</li>
                    <li>Include the question for more relevant feedback</li>
                    <li>Provide mark scheme details when available</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">User Type</label>
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <div className="relative">
                <Select value={subject} onValueChange={(value) => {
                  setSubject(value);
                  setDetectedSubject(null);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="maths">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="geography">Geography</SelectItem>
                    <SelectItem value="computerScience">Computer Science</SelectItem>
                    <SelectItem value="businessStudies">Business Studies</SelectItem>
                  </SelectContent>
                </Select>
                {detectedSubject && (
                  <div className="absolute -bottom-5 left-0 text-xs text-blue-600">
                    AI detected: {detectedSubject}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">AI Model</label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google/gemini-2.5-pro-exp-03-25">Gemini Pro</SelectItem>
                    <SelectItem value="deepseek/deepseek-r1:free">DeepSeek R1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Exam Board</label>
              <Select value={examBoard} onValueChange={setExamBoard}>
                <SelectTrigger>
                  <SelectValue placeholder="Select board" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aqa">AQA</SelectItem>
                  <SelectItem value="edexcel">Edexcel</SelectItem>
                  <SelectItem value="ocr">OCR</SelectItem>
                  <SelectItem value="wjec">WJEC</SelectItem>
                  <SelectItem value="cie">CIE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Question</label>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-7 h-6 w-6 p-0"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    setQuestion(text);
                  } catch (err) {
                    console.error('Failed to read clipboard:', err);
                  }
                }}
              >
                <ClipboardPaste className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-7 h-6 w-6 p-0"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    setMarkScheme(text);
                  } catch (err) {
                    console.error('Failed to read clipboard:', err);
                  }
                }}
              >
                <ClipboardPaste className="h-4 w-4" />
              </Button>
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type or paste the question here..."
                className="min-h-20"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Your Answer</label>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-7 h-6 w-6 p-0"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    setAnswer(text);
                  } catch (err) {
                    console.error('Failed to read clipboard:', err);
                  }
                }}
              >
                <ClipboardPaste className="h-4 w-4" />
              </Button>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type or paste your answer here..."
                className="min-h-32"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Upload Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mark Scheme (optional)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (!e.target.files?.[0]) return;
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      const imageBase64 = await new Promise((resolve) => {
                        reader.onload = () => resolve(reader.result.split(',')[1]);
                        reader.readAsDataURL(file);
                      });
                      
                      const imageCompletion = await openai.chat.completions.create({
                        model: 'google/gemini-2.0-flash-exp:free',
                        messages: [{
                          role: "user",
                          content: [{
                            type: "text",
                            text: "Convert this mark scheme image to text with autocorrection. Return only the corrected text."
                          }, {
                            type: "image_url",
                            image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
                          }]
                        }],
                        max_tokens: 2000
                      });
                      
                      setMarkScheme(imageCompletion.choices[0].message.content);
                    }}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMarkScheme("")}
                  >
                    Clear
                  </Button>
                </div>
                <Textarea
                  value={markScheme}
                  onChange={(e) => setMarkScheme(e.target.value)}
                  placeholder="Paste mark scheme or assessment criteria here..."
                  className="min-h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Marks Out Of (optional)</label>
                <input
                  type="number"
                  value={marksOutOf}
                  onChange={(e) => setMarksOutOf(e.target.value)}
                  placeholder="e.g. 10"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>
          
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-4 bg-gray-50 rounded-lg"
            >
              <h3 className="font-semibold mb-2">AI Feedback:</h3>
              <div className="prose max-w-none">
                <ReactMarkdown>{feedback}</ReactMarkdown>
              </div>
              {grade && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="font-medium">Estimated Grade: <span className="text-blue-700">{grade}</span></p>
                </div>
              )}
            </motion.div>
          )}
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={handleSubmitForMarking} 
              className="w-full" 
              disabled={!answer || loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="animate-pulse">
                    {['Analyzing...', 'Thinking...', 'Evaluating...', 'Almost done...'][Math.floor(Math.random() * 4)]}
                  </span>
                </div>
              ) : "Submit for Marking"}
            </Button>
          </motion.div>
        </CardContent>
        
        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-6 pb-4"
          >
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error.type === "network" ? "Connection Issue" :
                       error.type === "rate_limit" ? "Too Many Requests" :
                       error.type === "auth" ? "Authentication Error" :
                       error.type === "validation" ? "Missing Information" :
                       "Something Went Wrong"}
                    </h3>
                    <p className="text-sm text-red-700 mt-1">{error.message}</p>
                  </div>
                </div>
                <div className="mt-3 prose max-w-none">
                  <ReactMarkdown>{feedback}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default AIMarker;