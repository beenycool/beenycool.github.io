"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  ChevronRight, 
  Calendar,
  ArrowLeft,
  CheckCheck,
  Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from 'next/link';

// Define Todo item structure
const TodoComponent = () => {
  // State
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [showCompleted, setShowCompleted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (e) {
        console.error('Failed to parse todos from localStorage:', e);
      }
    }
    
    // Add a small delay for animation purposes
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add a new todo
  const addTodo = () => {
    if (newTodoText.trim() === '') return;
    
    const newTodo = {
      id: Date.now().toString(),
      text: newTodoText.trim(),
      completed: false,
      priority,
      createdAt: Date.now()
    };
    
    setTodos([newTodo, ...todos]);
    setNewTodoText('');
  };

  // Toggle a todo's completed status
  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Start editing a todo
  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  // Save edited todo
  const saveEdit = () => {
    if (editingId === null) return;
    
    setTodos(
      todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      )
    );
    
    setEditingId(null);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return showCompleted ? true : !todo.completed;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Sort todos by priority and then by creation date
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    const priorityDiff = 
      priorityWeight[b.priority] - 
      priorityWeight[a.priority];
    
    if (priorityDiff !== 0) return priorityDiff;
    return b.createdAt - a.createdAt;
  });

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 dark:text-red-400';
      case 'medium': return 'text-yellow-500 dark:text-yellow-400';
      case 'low': return 'text-green-500 dark:text-green-400';
      default: return '';
    }
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/50';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/50';
      case 'low': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/50';
      default: return '';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between py-3 px-4 border-b border-border bg-background/90 shadow-sm backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <h1 className="font-bold text-xl flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
            Secret Todo List
          </h1>
        </div>
        <ThemeToggle />
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <AnimatePresence mode="wait">
          {isLoaded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="shadow-lg border-t-4 border-t-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl flex items-center">
                    <CheckCheck className="mr-2 h-6 w-6 text-primary" />
                    My Todo List
                  </CardTitle>
                  <CardDescription>
                    Keep track of your tasks and stay organized
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-5">
                  {/* Add new todo */}
                  <div className="space-y-2">
                    <Label htmlFor="new-todo" className="text-sm font-medium">Add New Task</Label>
                    <div className="flex flex-col md:flex-row gap-2">
                      <div className="flex-grow">
                        <Textarea
                          id="new-todo"
                          value={newTodoText}
                          onChange={(e) => setNewTodoText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), addTodo())}
                          placeholder="What needs to be done?"
                          className="min-h-[60px] resize-none"
                        />
                      </div>
                      <div className="flex gap-2 items-start">
                        <Select value={priority} onValueChange={(value) => setPriority(value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={addTodo} className="bg-primary hover:bg-primary/90">
                          <Plus className="mr-1 h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Filter options */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t">
                    <div className="flex flex-wrap space-x-2">
                      <Button 
                        variant={filter === 'all' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setFilter('all')}
                      >
                        All
                      </Button>
                      <Button 
                        variant={filter === 'active' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setFilter('active')}
                      >
                        Active
                      </Button>
                      <Button 
                        variant={filter === 'completed' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setFilter('completed')}
                      >
                        Completed
                      </Button>
                    </div>
                    
                    <div className="flex items-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowCompleted(!showCompleted)}
                              className={filter === 'completed' ? 'invisible' : ''}
                            >
                              {showCompleted ? 'Hide Completed' : 'Show Completed'}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{showCompleted ? 'Hide completed tasks from view' : 'Show completed tasks'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  
                  {/* Todo list */}
                  <ScrollArea className="h-[350px] pr-4">
                    <div className="space-y-3">
                      <AnimatePresence>
                        {sortedTodos.length === 0 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-10 text-center text-muted-foreground"
                          >
                            <div className="inline-flex rounded-full p-4 bg-muted/50">
                              <CheckCheck className="h-6 w-6 text-muted-foreground/70" />
                            </div>
                            <p className="mt-4">No tasks found. Add some tasks to get started!</p>
                          </motion.div>
                        )}
                        
                        {sortedTodos.map(todo => (
                          <motion.div
                            key={todo.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0, marginTop: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`border rounded-md p-3 ${
                              todo.completed 
                                ? 'bg-muted/50 border-muted' 
                                : 'bg-card border-border hover:border-primary/50 hover:shadow-sm transition-all'
                            }`}
                          >
                            {editingId === todo.id ? (
                              <div className="flex items-center gap-2">
                                <Textarea 
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), saveEdit())}
                                  autoFocus
                                  className="min-h-[60px] flex-grow"
                                />
                                <div className="flex flex-col space-y-2">
                                  <Button size="sm" variant="default" onClick={saveEdit}>
                                    <Save className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <button 
                                    onClick={() => toggleTodo(todo.id)}
                                    className="mt-1 flex-shrink-0 hover:scale-110 transition-transform"
                                    title={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                                  >
                                    {todo.completed ? (
                                      <CheckCircle2 className="h-6 w-6 text-primary" />
                                    ) : (
                                      <Circle className="h-6 w-6 text-muted-foreground hover:text-primary" />
                                    )}
                                  </button>
                                  
                                  <div className="space-y-2">
                                    <p className={`${todo.completed ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                                      {todo.text}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                      <Badge variant="outline" className={`${getPriorityBadgeColor(todo.priority)}`}>
                                        {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                                      </Badge>
                                      <span className="flex items-center text-muted-foreground">
                                        <Calendar className="h-3 w-3 mr-0.5" />
                                        {formatDate(todo.createdAt)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex space-x-1 ml-2">
                                  {!todo.completed && (
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      onClick={() => startEditing(todo)}
                                      className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                      title="Edit task"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={() => deleteTodo(todo.id)}
                                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                    title="Delete task"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </ScrollArea>
                </CardContent>
                
                <CardFooter className="flex flex-wrap justify-between gap-2 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {todos.filter(t => !t.completed).length} items left
                    </Badge>
                    {todos.filter(t => t.completed).length > 0 && (
                      <Badge variant="outline" className="bg-muted">
                        {todos.filter(t => t.completed).length} completed
                      </Badge>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setTodos(todos.filter(todo => !todo.completed))}
                    disabled={!todos.some(todo => todo.completed)}
                    className={todos.some(todo => todo.completed) ? 'hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50' : ''}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    Clear completed
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TodoComponent; 