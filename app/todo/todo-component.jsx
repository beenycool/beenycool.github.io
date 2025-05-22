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
  Sparkles,
  ChevronDown,
  ListTodo
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  
  // State for subtasks
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [addingSubtaskFor, setAddingSubtaskFor] = useState(null);
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const [editSubtaskText, setEditSubtaskText] = useState('');
  const [expandedTodos, setExpandedTodos] = useState([]);

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      console.log('DEBUG: Raw savedTodos from localStorage:', savedTodos);
      try {
        const rawParsedTodos = JSON.parse(savedTodos);
        console.log('localStorage rawParsedTodos:', rawParsedTodos, 'Type:', typeof rawParsedTodos);
        const ensuredTodosArray = Array.isArray(rawParsedTodos) ? rawParsedTodos : [];
        console.log('localStorage ensuredTodosArray:', ensuredTodosArray, 'Type:', typeof ensuredTodosArray);

        const processedTodos = ensuredTodosArray.map(todo => {
          console.log('Processing todo from localStorage - todo:', todo, 'Type of todo.subtasks:', typeof todo.subtasks);
          const ensuredSubtasks = Array.isArray(todo.subtasks) ? todo.subtasks : [];
          return {
            ...todo,
            subtasks: ensuredSubtasks
          };
        });
        console.log('localStorage processedTodos for setTodos:', processedTodos);
        setTodos(processedTodos);
        
        // Initialize expanded state for todos with subtasks
        console.log('localStorage initialExpanded - processedTodos:', processedTodos, 'Type:', typeof processedTodos);
        const initialExpanded = processedTodos
          .filter(todo => {
            const subtasks = Array.isArray(todo.subtasks) ? todo.subtasks : [];
            return subtasks.length > 0;
           })
          .map(todo => todo.id);
        setExpandedTodos(initialExpanded);
      } catch (e) {
        console.error('DEBUG: Failed to parse todos from localStorage or process them:', e);
        setTodos([]); // Default to empty array on parsing error
        setExpandedTodos([]);
      }
    } else {
      // No saved todos, ensure todos is an empty array (already default state, but good for clarity)
      console.log('DEBUG: No saved todos found in localStorage. Initializing with empty array.');
      setTodos([]);
      setExpandedTodos([]);
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
      createdAt: Date.now(),
      subtasks: []
    };
    
    setTodos([newTodo, ...todos]);
    setNewTodoText('');
  };

  // Toggle a todo's completed status
  const toggleTodo = (id) => {
    setTodos(prevTodos => {
      console.log('toggleTodo - prevTodos:', prevTodos, 'Type:', typeof prevTodos);
      const currentTodos = Array.isArray(prevTodos) ? prevTodos : [];
      return currentTodos.map(todo => {
        if (todo.id === id) {
          console.log('toggleTodo - current todo.subtasks:', todo.subtasks, 'Type:', typeof todo.subtasks);
          const ensuredSubtasks = Array.isArray(todo.subtasks) ? todo.subtasks : [];
          const updatedSubtasks = todo.completed
            ? ensuredSubtasks
            : ensuredSubtasks.map(subtask => ({...subtask, completed: true}));
          
          return {
            ...todo,
            completed: !todo.completed,
            subtasks: updatedSubtasks
          };
        }
        return todo;
      });
    });
  };

  // Delete a todo
  const deleteTodo = (id) => {
    setTodos(prevTodos => {
      console.log('deleteTodo - prevTodos:', prevTodos, 'Type:', typeof prevTodos);
      const currentTodos = Array.isArray(prevTodos) ? prevTodos : [];
      return currentTodos.filter(todo => todo.id !== id);
    });
  };

  // Start editing a todo
  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  // Save edited todo
  const saveEdit = () => {
    if (editingId === null) return;
    
    setTodos(prevTodos => {
      console.log('saveEdit - prevTodos:', prevTodos, 'Type:', typeof prevTodos);
      const currentTodos = Array.isArray(prevTodos) ? prevTodos : [];
      return currentTodos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      );
    });
    
    setEditingId(null);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Toggle expanded state for a todo
  const toggleExpanded = (id) => {
    setExpandedTodos(prev => 
      prev.includes(id) 
        ? prev.filter(todoId => todoId !== id)
        : [...prev, id]
    );
  };

  // Add a subtask to a todo
  const addSubtask = (todoId) => {
    if (!newSubtaskText.trim()) return;
    
    setTodos(prevTodos => {
      console.log('addSubtask - prevTodos:', prevTodos, 'Type:', typeof prevTodos);
      const currentTodos = Array.isArray(prevTodos) ? prevTodos : [];
      return currentTodos.map(todo => {
        if (todo.id === todoId) {
          const newSubtask = {
            id: `${todoId}-sub-${Date.now()}`,
            text: newSubtaskText.trim(),
            completed: false,
            createdAt: Date.now()
          };
          console.log('addSubtask - current todo.subtasks:', todo.subtasks, 'Type:', typeof todo.subtasks);
          const ensuredSubtasks = Array.isArray(todo.subtasks) ? todo.subtasks : [];
          return {
            ...todo,
            subtasks: [...ensuredSubtasks, newSubtask]
          };
        }
        return todo;
      });
    });
    
    setNewSubtaskText('');
    setAddingSubtaskFor(null);
  };
  
  // Toggle a subtask's completed status
  const toggleSubtask = (todoId, subtaskId) => {
    setTodos(prevTodos => {
      console.log('toggleSubtask - prevTodos:', prevTodos, 'Type:', typeof prevTodos);
      const currentTodos = Array.isArray(prevTodos) ? prevTodos : [];
      return currentTodos.map(todo => {
        if (todo.id === todoId) {
          console.log('toggleSubtask - current todo.subtasks:', todo.subtasks, 'Type:', typeof todo.subtasks);
          const ensuredSubtasks = Array.isArray(todo.subtasks) ? todo.subtasks : [];
          const updatedSubtasks = ensuredSubtasks.map(subtask =>
            subtask.id === subtaskId
              ? {...subtask, completed: !subtask.completed}
              : subtask
          );
          
          // If all subtasks are complete, mark the todo as complete too
          const allComplete = updatedSubtasks.every(subtask => subtask.completed);
          
          return {
            ...todo,
            subtasks: updatedSubtasks,
            completed: allComplete ? true : todo.completed
          };
        }
        return todo;
      });
    });
  };
  
  // Delete a subtask
  const deleteSubtask = (todoId, subtaskId) => {
    setTodos(prevTodos => {
      console.log('deleteSubtask - prevTodos:', prevTodos, 'Type:', typeof prevTodos);
      const currentTodos = Array.isArray(prevTodos) ? prevTodos : [];
      return currentTodos.map(todo => {
        if (todo.id === todoId) {
          console.log('deleteSubtask - current todo.subtasks:', todo.subtasks, 'Type:', typeof todo.subtasks);
          const ensuredSubtasks = Array.isArray(todo.subtasks) ? todo.subtasks : [];
          return {
            ...todo,
            subtasks: ensuredSubtasks.filter(subtask => subtask.id !== subtaskId)
          };
        }
        return todo;
      });
    });
  };
  
  // Start editing a subtask
  const startEditingSubtask = (todoId, subtask) => {
    setEditingSubtaskId(subtask.id);
    setEditSubtaskText(subtask.text);
  };
  
  // Save edited subtask
  const saveSubtaskEdit = (todoId) => {
    if (editingSubtaskId === null) return;
    
    setTodos(prevTodos => {
      console.log('saveSubtaskEdit - prevTodos:', prevTodos, 'Type:', typeof prevTodos);
      const currentTodos = Array.isArray(prevTodos) ? prevTodos : [];
      return currentTodos.map(todo => {
        if (todo.id === todoId) {
          console.log('saveSubtaskEdit - current todo.subtasks:', todo.subtasks, 'Type:', typeof todo.subtasks);
          const ensuredSubtasks = Array.isArray(todo.subtasks) ? todo.subtasks : [];
          return {
            ...todo,
            subtasks: ensuredSubtasks.map(subtask =>
              subtask.id === editingSubtaskId
                ? {...subtask, text: editSubtaskText.trim()}
                : subtask
            )
          };
        }
        return todo;
      });
    });
    
    setEditingSubtaskId(null);
    setEditSubtaskText('');
  };
  
  // Cancel editing subtask
  const cancelSubtaskEdit = () => {
    setEditingSubtaskId(null);
    setEditSubtaskText('');
  };

  // Filter todos based on current filter
  console.log('filteredTodos - todos:', todos, 'Type:', typeof todos);
  const currentTodosForFilter = Array.isArray(todos) ? todos : [];
  const filteredTodos = currentTodosForFilter.filter(todo => {
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
                        
                        {(() => {
                          console.log('Render sortedTodos - sortedTodos:', sortedTodos, 'Type:', typeof sortedTodos);
                          const currentSortedTodos = Array.isArray(sortedTodos) ? sortedTodos : [];
                          return currentSortedTodos.map(todo => (
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
                              <div className="space-y-2">
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
                                        
                                        {(() => {
                                          console.log('Render Badge subtask count - todo.subtasks:', todo.subtasks, 'Type:', typeof todo.subtasks, 'for todo.id:', todo.id);
                                          const ensuredSubtasks = Array.isArray(todo.subtasks) ? todo.subtasks : [];
                                          return ensuredSubtasks.length > 0 && (
                                            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/50">
                                              <ListTodo className="h-3 w-3 mr-1" />
                                              {ensuredSubtasks.filter(st => st.completed).length}/{ensuredSubtasks.length}
                                            </Badge>
                                          );
                                        })()}
                                        
                                        <span className="flex items-center text-muted-foreground">
                                          <Calendar className="h-3 w-3 mr-0.5" />
                                          {formatDate(todo.createdAt)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex space-x-1 ml-2">
                                    {!todo.completed && (
                                      <>
                                        <Button 
                                          size="sm" 
                                          variant="ghost" 
                                          onClick={() => {
                                            setAddingSubtaskFor(todo.id);
                                            setNewSubtaskText('');
                                            if (!expandedTodos.includes(todo.id)) {
                                              toggleExpanded(todo.id);
                                            }
                                          }}
                                          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                          title="Add subtask"
                                        >
                                          <Plus className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="ghost" 
                                          onClick={() => startEditing(todo)}
                                          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                          title="Edit task"
                                        >
                                          <Edit2 className="h-4 w-4" />
                                        </Button>
                                      </>
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
                                
                                {/* Subtasks section */}
                                {(() => {
                                  console.log('Render Collapsible subtasks section - todo.subtasks:', todo.subtasks, 'Type:', typeof todo.subtasks, 'for todo.id:', todo.id);
                                  const ensuredSubtasksForCollapsible = Array.isArray(todo.subtasks) ? todo.subtasks : [];
                                  return ensuredSubtasksForCollapsible.length > 0 && (
                                    <Collapsible
                                      open={expandedTodos.includes(todo.id)}
                                      onOpenChange={() => toggleExpanded(todo.id)}
                                      className="ml-9 mt-2"
                                    >
                                      <div className="flex items-center">
                                        <CollapsibleTrigger asChild>
                                          <Button variant="ghost" size="sm" className="p-0 h-6 hover:bg-transparent">
                                            {expandedTodos.includes(todo.id) ? (
                                              <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground" />
                                            ) : (
                                              <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
                                            )}
                                            <span className="text-xs text-muted-foreground">
                                              {expandedTodos.includes(todo.id) ? 'Hide' : 'Show'} {ensuredSubtasksForCollapsible.length} subtask{ensuredSubtasksForCollapsible.length !== 1 ? 's' : ''}
                                            </span>
                                          </Button>
                                        </CollapsibleTrigger>
                                      </div>
                                      
                                      <CollapsibleContent className="mt-1">
                                        <div className="space-y-2 border-l-2 border-muted pl-3">
                                          {(() => {
                                            console.log('Render subtasks list - ensuredSubtasksForCollapsible:', ensuredSubtasksForCollapsible, 'Type:', typeof ensuredSubtasksForCollapsible, 'for todo.id:', todo.id);
                                            return ensuredSubtasksForCollapsible.map(subtask => (
                                              <div key={subtask.id} className={`py-1 px-2 rounded ${subtask.completed ? 'bg-muted/30' : 'bg-card'}`}>
                                                {editingSubtaskId === subtask.id ? (
                                                  <div className="flex items-center gap-2">
                                                    <Input
                                                      value={editSubtaskText}
                                                      onChange={(e) => setEditSubtaskText(e.target.value)}
                                                      onKeyDown={(e) => e.key === 'Enter' && saveSubtaskEdit(todo.id)}
                                                      autoFocus
                                                      className="flex-grow h-7 text-sm"
                                                    />
                                                    <div className="flex space-x-1">
                                                      <Button size="sm" variant="ghost" onClick={() => saveSubtaskEdit(todo.id)} className="h-7 w-7 p-0">
                                                        <Save className="h-3 w-3" />
                                                      </Button>
                                                      <Button size="sm" variant="ghost" onClick={cancelSubtaskEdit} className="h-7 w-7 p-0">
                                                        <X className="h-3 w-3" />
                                                      </Button>
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                      <button
                                                        onClick={() => toggleSubtask(todo.id, subtask.id)}
                                                        className="flex-shrink-0"
                                                      >
                                                        {subtask.completed ? (
                                                          <CheckCircle2 className="h-4 w-4 text-primary" />
                                                        ) : (
                                                          <Circle className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                                        )}
                                                      </button>
                                                      <span className={`text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                                                        {subtask.text}
                                                      </span>
                                                    </div>
                                                    
                                                    <div className="flex space-x-1">
                                                      {!subtask.completed && (
                                                        <Button
                                                          size="sm"
                                                          variant="ghost"
                                                          onClick={() => startEditingSubtask(todo.id, subtask)}
                                                          className="h-6 w-6 p-0"
                                                        >
                                                          <Edit2 className="h-3 w-3" />
                                                        </Button>
                                                      )}
                                                      <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => deleteSubtask(todo.id, subtask.id)}
                                                        className="h-6 w-6 p-0"
                                                      >
                                                        <Trash2 className="h-3 w-3" />
                                                      </Button>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            ));
                                          })()}
                                          
                                          {/* Add new subtask UI */}
                                          {addingSubtaskFor === todo.id && (
                                            <div className="flex items-center gap-2 mt-1">
                                              <Input
                                                value={newSubtaskText}
                                                onChange={(e) => setNewSubtaskText(e.target.value)}
                                                placeholder="Add new subtask..."
                                                className="flex-grow h-7 text-sm"
                                                onKeyDown={(e) => e.key === 'Enter' && addSubtask(todo.id)}
                                                autoFocus
                                              />
                                              <div className="flex space-x-1">
                                                <Button size="sm" variant="default" onClick={() => addSubtask(todo.id)} className="h-7">
                                                  <Plus className="h-3 w-3 mr-1" />
                                                  Add
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => setAddingSubtaskFor(null)} className="h-7 p-0 w-7">
                                                  <X className="h-3 w-3" />
                                                </Button>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </CollapsibleContent>
                                    </Collapsible>
                                  );
                                })()}
                              </div>
                            )}
                          </motion.div>
                        )); })()}
                      </AnimatePresence>
                    </div>
                  </ScrollArea>
                </CardContent>
                
                <CardFooter className="flex flex-wrap justify-between gap-2 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {(() => {
                        console.log('Footer items left - todos:', todos, 'Type:', typeof todos);
                        const currentTodos = Array.isArray(todos) ? todos : [];
                        return currentTodos.filter(t => !t.completed).length;
                      })()} items left
                    </Badge>
                    {(() => {
                      console.log('Footer completed count check - todos:', todos, 'Type:', typeof todos);
                      const currentTodos = Array.isArray(todos) ? todos : [];
                      return currentTodos.filter(t => t.completed).length > 0;
                    })() && (
                      <Badge variant="outline" className="bg-muted">
                        {(() => {
                          console.log('Footer completed count display - todos:', todos, 'Type:', typeof todos);
                          const currentTodos = Array.isArray(todos) ? todos : [];
                          return currentTodos.filter(t => t.completed).length;
                        })()} completed
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTodos(prevTodos => {
                      console.log('Footer clear completed - prevTodos:', prevTodos, 'Type:', typeof prevTodos);
                      const currentTodos = Array.isArray(prevTodos) ? prevTodos : [];
                      return currentTodos.filter(todo => !todo.completed);
                    })}
                    disabled={!(() => {
                      console.log('Footer clear completed (disabled check) - todos:', todos, 'Type:', typeof todos);
                      const currentTodos = Array.isArray(todos) ? todos : [];
                      return currentTodos.some(todo => todo.completed);
                    })()}
                    className={(() => {
                      console.log('Footer clear completed (className check) - todos:', todos, 'Type:', typeof todos);
                      const currentTodos = Array.isArray(todos) ? todos : [];
                      return currentTodos.some(todo => todo.completed);
                    })() ? 'hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50' : ''}
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