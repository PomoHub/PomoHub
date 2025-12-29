import { useState, useRef, useEffect } from 'react';
import { useNotes, Note } from '@/hooks/useNotes';
import { useTodos } from '@/hooks/useTodos';
import { Plus, Trash2, Save, FileText, Image as ImageIcon, Paperclip, PenTool, X, Play } from 'lucide-react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { cn } from '@/lib/utils';
import { open } from '@tauri-apps/plugin-dialog';

export function Notes() {
  const { notes, loading, addNote, updateNote, deleteNote } = useNotes();
  const { addTodo } = useTodos();
  
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'drawing'>('text');
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [drawing, setDrawing] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<string[]>([]);
  
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  useEffect(() => {
    if (activeTab === 'drawing' && drawing && canvasRef.current) {
        // Short timeout to ensure canvas is ready
        setTimeout(() => {
            try {
                if (canvasRef.current && drawing) {
                    const paths = JSON.parse(drawing);
                    canvasRef.current.loadPaths(paths);
                }
            } catch (e) {
                console.error("Failed to load drawing paths", e);
            }
        }, 100);
    }
  }, [activeTab, drawing]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setDrawing(null);
    setAttachments([]);
    setSelectedNote(null);
    setIsEditing(false);
    setActiveTab('text');
  };

  const handleEdit = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setDrawing(note.drawing);
    setAttachments(JSON.parse(note.attachments || '[]'));
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    let currentDrawing = drawing;
    if (canvasRef.current) {
        try {
            // Get paths from canvas if active
            const paths = await canvasRef.current.exportPaths();
            if (paths.length > 0) {
                currentDrawing = JSON.stringify(paths);
            }
        } catch (e) {
            console.error("Failed to export drawing", e);
        }
    }

    // Process Macros in Content
    let processedContent = content;
    const todoRegex = /@create-todo\[(.*?)\]/g;
    const taskRegex = /@create-task\[(.*?)\]/g;
    
    // Check for Todos
    let match;
    while ((match = todoRegex.exec(content)) !== null) {
        const todoText = match[1];
        if (todoText) {
            await addTodo(todoText);
            processedContent = processedContent.replace(match[0], `✅ [Todo Created: ${todoText}]`);
        }
    }
    
    // Check for Tasks (Same as todo for now)
    while ((match = taskRegex.exec(content)) !== null) {
        const taskText = match[1];
        if (taskText) {
            await addTodo(taskText);
            processedContent = processedContent.replace(match[0], `✅ [Task Created: ${taskText}]`);
        }
    }

    if (selectedNote) {
      await updateNote(selectedNote.id, title, processedContent, currentDrawing, attachments);
    } else {
      await addNote(title, processedContent, currentDrawing, attachments);
    }
    
    resetForm();
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote(id);
      if (selectedNote?.id === id) {
        resetForm();
      }
    }
  };

  const handleAddAttachment = async () => {
    try {
      const selected = await open({
        multiple: true,
        filters: [{
          name: 'Files',
          extensions: ['png', 'jpg', 'jpeg', 'pdf', 'txt', 'md']
        }]
      });

      if (selected) {
        const newFiles = Array.isArray(selected) ? selected : [selected];
        setAttachments(prev => [...prev, ...newFiles]);
      }
    } catch (error) {
      console.error('Failed to add attachment:', error);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="text-center py-8 text-zinc-500">Loading notes...</div>;
  }

  return (
    <div className="w-full h-[600px] flex gap-4">
      {/* Sidebar: Note List */}
      <div className="w-1/3 flex flex-col gap-4 border-r border-zinc-200 dark:border-zinc-800 pr-4">
        <button
          onClick={() => { resetForm(); setIsEditing(true); }}
          className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={18} />
          New Note
        </button>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => handleEdit(note)}
              className={cn(
                "p-3 rounded-xl border cursor-pointer transition-all hover:shadow-sm group relative",
                selectedNote?.id === note.id
                  ? "bg-indigo-50 border-indigo-500 dark:bg-indigo-900/20 dark:border-indigo-500/50"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700"
              )}
            >
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{note.title}</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-1">
                {note.content || (note.drawing ? 'Has drawing...' : 'No content')}
              </p>
              <button
                onClick={(e) => handleDelete(e, note.id)}
                className="absolute right-2 top-2 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          
          {notes.length === 0 && (
            <div className="text-center py-8 text-zinc-400 text-sm">
              No notes yet. Create one!
            </div>
          )}
        </div>
      </div>

      {/* Main Area: Editor */}
      <div className="flex-1 flex flex-col h-full bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {isEditing ? (
          <>
            {/* Toolbar */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-between items-center">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title"
                className="text-lg font-semibold bg-transparent border-none focus:outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 w-full"
              />
              <div className="flex items-center gap-2">
                 <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                  title="Save & Process Macros"
                >
                  <Save size={20} />
                </button>
                <button
                  onClick={resetForm}
                  className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <button
                onClick={() => setActiveTab('text')}
                className={cn(
                  "flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors",
                  activeTab === 'text'
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                )}
              >
                <FileText size={16} /> Text
              </button>
              <button
                onClick={() => setActiveTab('drawing')}
                className={cn(
                  "flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors",
                  activeTab === 'drawing'
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                )}
              >
                <PenTool size={16} /> Drawing
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden bg-white dark:bg-zinc-900">
              {activeTab === 'text' ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note here... Use @create-todo[Task Name] to create a task."
                  className="w-full h-full p-4 resize-none bg-transparent border-none focus:outline-none text-zinc-800 dark:text-zinc-200 leading-relaxed"
                />
              ) : (
                <div className="w-full h-full bg-white relative">
                   <ReactSketchCanvas
                        ref={canvasRef}
                        strokeWidth={4}
                        strokeColor="black"
                        canvasColor="transparent"
                        className="w-full h-full"
                    />
                    {/* Load drawing if exists and not yet loaded into canvas? 
                        ReactSketchCanvas loads paths via props or methods. 
                        For simplicity, we only save drawing when saving note. 
                        Loading existing drawing requires `loadPaths`.
                    */}
                    {drawing && (
                        <button 
                            onClick={() => canvasRef.current?.loadPaths(JSON.parse(drawing))}
                            className="absolute bottom-4 right-4 z-10 px-3 py-1 bg-zinc-100 text-xs rounded border shadow-sm"
                        >
                            Load Existing Drawing
                        </button>
                    )}
                </div>
              )}
            </div>

            {/* Attachments Bar */}
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-wrap gap-2 mb-2">
                {attachments.map((path, idx) => (
                  <div key={idx} className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-xs max-w-[200px]">
                    <Paperclip size={12} className="shrink-0" />
                    <span className="truncate flex-1">{path.split(/[/\\]/).pop()}</span>
                    <button onClick={() => removeAttachment(idx)} className="hover:text-red-500">
                        <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddAttachment}
                className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
              >
                <Paperclip size={14} />
                Attach File
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
            <FileText size={48} className="mb-4 opacity-20" />
            <p>Select a note to edit or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
