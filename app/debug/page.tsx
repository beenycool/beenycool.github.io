"use client";

import * as React from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useBackendStatus } from '../aimarker-hooks';

// API URL for backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
  (typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:3003'  // Local development 
      : 'https://beenycool-github-io.onrender.com'); // Production fallback

// Debug Page Component
export default function DebugPage() {
  const [backendStatus, setBackendStatus] = useState<string>('checking');
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("api-status");
  const [isLoading, setIsLoading] = useState(false);
  const { checkBackendStatus } = useBackendStatus(API_BASE_URL);

  // Check API status function
  const checkAPIStatus = async () => {
    console.log("=== API STATUS CHECK STARTED ===");
    console.log("Backend URL:", API_BASE_URL);
    
    setIsLoading(true);
    
    try {
      // First check if the API is responsive
      const backendResult = await checkBackendStatus();
      if (backendResult) {
        setBackendStatus(backendResult.ok ? 'online' : backendResult.status || 'error');
      } else {
        setBackendStatus('error');
      }
      setLastChecked(new Date().toLocaleTimeString());
      
      if (!backendResult || !backendResult.ok) {
        throw new Error(`Backend connection error: ${backendResult?.error || 'Unknown error'}`);
      }
      
      // Check API health
      toast.info("Checking API health...");
      const healthResponse = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
        mode: 'cors'
      }).catch(error => {
        console.error("Health check failed:", error);
        throw new Error(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      });
      
      console.log("Health response status:", healthResponse.status, healthResponse.statusText);
      
      if (!healthResponse.ok) {
        throw new Error(`API health check failed with status ${healthResponse.status}`);
      }
      
      const healthData = await healthResponse.json().catch(() => ({}));
      console.log("Health data:", healthData);
      
      // Check available models
      toast.info("Checking available models...");
      const modelsResponse = await fetch(`${API_BASE_URL}/api/models`, {
        method: 'GET',
        mode: 'cors'
      }).catch(error => {
        console.error("Models check failed:", error);
        throw new Error(`Models check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      });
      
      console.log("Models response status:", modelsResponse.status, modelsResponse.statusText);
      
      if (!modelsResponse.ok) {
        throw new Error(`API models check failed with status ${modelsResponse.status}`);
      }
      
      const modelsData = await modelsResponse.json().catch(() => ({}));
      console.log("Available models:", modelsData);
      
      // Display API status info in a toast
      let statusInfo = `✅ API is online
🔌 Connection: ${healthData.status || "Unknown"}
🔄 Version: ${healthData.version || "Unknown"}`;

      if (modelsData && modelsData.data) {
        statusInfo += `\n🤖 Models: ${modelsData.data.length || 0} available`;
      }
      
      toast.success(statusInfo, { duration: 5000 });
      
    } catch (error) {
      console.error("API status check error:", error);
      setBackendStatus('error');
      
      toast.error(`API Status Check Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      console.log("=== API STATUS CHECK COMPLETED ===");
      setIsLoading(false);
    }
  };

  // Test mark scheme generation function
  const testMarkSchemeGeneration = async () => {
    setIsLoading(true);
    const question = "Explain how the writer uses language features to create an atmosphere of tension in this extract.";
    const subject = "english";
    const examBoard = "aqa";
    
    console.log("=== TEST MARK SCHEME GENERATION STARTED ===");
    console.log("Question:", question);
    console.log("Subject:", subject);
    console.log("Exam board:", examBoard);
    console.log("Backend URL:", API_BASE_URL);
    
    toast.info("Testing mark scheme generation...");
    
    // Create a simplified test prompt
    const testPrompt = `Create a mark scheme for this GCSE ${subject} question: "${question}"`;
    console.log("Using simplified test prompt:", testPrompt);
    
    try {
      // First check if the API is responsive
      const healthCheck = await fetch(`${API_BASE_URL}/api/health`);
      console.log("API health check response:", healthCheck.status, await healthCheck.text());
      
      if (healthCheck.status !== 200) {
        throw new Error(`API health check failed with status ${healthCheck.status}`);
      }
      
      console.log("Health check successful, proceeding with mark scheme test");
      
      // Make a direct request to the backend
      const response = await fetch(`${API_BASE_URL}/api/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-exp:free",
          messages: [
            {
              role: "user",
              content: testPrompt
            }
          ],
          max_tokens: 1500
        }),
      });
      
      // Log the raw response for debugging
      const responseText = await response.clone().text();
      console.log("Test response status:", response.status);
      console.log("Test response raw:", responseText);
      
      if (!response.ok) {
        let errorMessage = "Unknown error";
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = JSON.stringify(errorData);
          console.error("Test response error:", errorMessage);
        } catch (parseError) {
          if (parseError instanceof Error) {
            console.error("Parse error:", parseError.message);
          }
          errorMessage = responseText || response.statusText;
          console.error("Test response error (text):", errorMessage);
        }
        
        throw new Error(`API request failed: ${response.status}. ${errorMessage}`);
      }
      
      // Try to parse the response as JSON, with fallback handling
      let testData;
      try {
        testData = JSON.parse(responseText);
        console.log("Test response parsed successfully:", testData);
      } catch (parseError) {
        if (parseError instanceof Error) {
          console.error("Failed to parse response as JSON:", parseError.message);
          throw new Error(`Failed to parse API response as JSON: ${parseError.message}`);
        }
        throw new Error("Failed to parse API response as JSON");
      }
      
      // Extract content from various possible response formats
      let markSchemeContent = "";
      
      if (testData.content) {
        markSchemeContent = testData.content;
      } else if (testData.choices && testData.choices[0] && testData.choices[0].message) {
        markSchemeContent = testData.choices[0].message.content;
      } else if (testData.text || testData.answer || testData.response) {
        markSchemeContent = testData.text || testData.answer || testData.response;
      } else if (typeof testData === "string") {
        markSchemeContent = testData;
      } else {
        console.log("Unknown response format:", testData);
        markSchemeContent = "Failed to extract proper content. Raw response: " + JSON.stringify(testData);
      }
      
      toast.success("Mark scheme generated successfully!");
      console.log("Extracted mark scheme content (first 100 chars):", markSchemeContent.substring(0, 100) + "...");
      
    } catch (error) {
      console.error("Test mark scheme generation error:", error);
      toast.error(`Test mark scheme generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      console.log("=== TEST MARK SCHEME GENERATION COMPLETED ===");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Debug Console</span>
            <Badge variant={backendStatus === 'online' ? 'default' : 'destructive'} 
                   className={backendStatus === 'online' ? 'bg-green-500' : ''}>
              {backendStatus}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This page contains debugging tools for the AI GCSE Marker application. 
            Use these tools to verify backend connectivity and API functionality.
          </p>
          
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm">
              <span className="font-medium">Backend URL:</span> {API_BASE_URL}
              {lastChecked && (
                <span className="ml-2 text-xs text-muted-foreground">
                  Last checked: {lastChecked}
                </span>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkAPIStatus}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Check Status
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="api-status">API Status</TabsTrigger>
              <TabsTrigger value="mark-scheme-test">Mark Scheme Test</TabsTrigger>
            </TabsList>
            
            <TabsContent value="api-status" className="p-4 border rounded-md mt-4">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-2 ${
                    backendStatus === 'online' ? 'bg-green-500' : 
                    backendStatus === 'checking' ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}></div>
                  <span className="font-medium">
                    Backend Status: {backendStatus.charAt(0).toUpperCase() + backendStatus.slice(1)}
                  </span>
                </div>
                
                <div className="p-3 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Connection Information</h3>
                  <pre className="text-xs bg-card p-2 rounded overflow-auto">
                    {JSON.stringify({
                      url: API_BASE_URL,
                      status: backendStatus,
                      lastChecked: lastChecked,
                      environment: typeof window !== 'undefined' ? window.location.hostname : 'SSR'
                    }, null, 2)}
                  </pre>
                </div>
                
                <div className="flex items-center">
                  {backendStatus === 'online' ? (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      <span>Backend is online and ready to use</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="mr-2 h-5 w-5" />
                      <span>
                        {backendStatus === 'checking' ? 'Checking backend status...' : 
                         'Backend is offline or experiencing issues'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="mark-scheme-test" className="p-4 border rounded-md mt-4">
              <div className="space-y-4">
                <p className="text-sm">
                  Test the mark scheme generation functionality by clicking the button below.
                  This will send a sample question to the API and verify the response.
                </p>
                
                <div className="p-3 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Test Parameters</h3>
                  <pre className="text-xs bg-card p-2 rounded overflow-auto">
                    {JSON.stringify({
                      question: "Explain how the writer uses language features to create an atmosphere of tension in this extract.",
                      subject: "english",
                      examBoard: "aqa",
                      model: "google/gemini-2.0-flash-exp:free"
                    }, null, 2)}
                  </pre>
                </div>
                
                <Button
                  onClick={testMarkSchemeGeneration}
                  disabled={isLoading || backendStatus !== 'online'}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Test Mark Scheme Generation"
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground">
                  Results will be displayed in the browser console and as toast notifications.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Debug page for GCSE AI Marker application</p>
      </div>
    </div>
  );
} 