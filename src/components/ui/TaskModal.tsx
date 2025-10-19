import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import Overlay from './Overlay';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: { title: string; description: string; startAt: string; finishAt: string; category: string; subtasks: string[] }) => void;
  initialTask?: Task | null;
  sectionId?: number | null;
}

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  startAt: string;
  finishAt: string;
  createdAt: string;
  createdBy: number;
  statusId: number;
  projectId: number | null;
  supervisor: number | null;
  sectionId: number;
}
const sections = [
    { id: 1, title: 'Default' },
    { id: 2, title: 'School' },
    { id: 3, title: 'Testing' },
  ];
export default function TaskModal({ isOpen, onClose, onSave, initialTask, sectionId }: TaskModalProps) {
  console.log("initialTask",initialTask);
  const [taskData, setTaskData] = useState({
    title: initialTask?.title || '',
    description: initialTask?.description || '',
    startAt: initialTask?.startAt.split('T')[0] || new Date().toISOString().split('T')[0],
    finishAt: initialTask?.finishAt.split('T')[0] || '',
    category: initialTask?.sectionId ? sections.find(s => s.id === initialTask.sectionId || s.id === sectionId)?.title || 'Default' : 'Default',
    subtasks: initialTask ? initialTask.title.split(',').map(t => ({ text: t.trim(), checked: false })) : [{ text: '', checked: false }],
  });

  // Mock sections (cần đồng bộ với MainContent)

  const [subtaskChecked, setSubtaskChecked] = useState<boolean[]>(taskData.subtasks.map(s => s.checked));
  const [commentText, setCommentText] = useState('');
  const [files, setFiles] = useState([{ name: 'COVER_LETTER.pdf', size: '117.2 kB' }]);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);

  useEffect(() => {
    setTaskData({
      title: initialTask?.title || '',
      description: initialTask?.description || '',
      startAt: initialTask?.startAt.split('T')[0] || new Date().toISOString().split('T')[0],
      finishAt: initialTask?.finishAt.split('T')[0] || '',
      category: initialTask?.sectionId ? sections.find(s => s.id === initialTask.sectionId)?.title || 'Default' : 'Default',
      subtasks: initialTask ? initialTask.title.split(',').map(t => ({ text: t.trim(), checked: false })) : [{ text: '', checked: false }],
    });
    setSubtaskChecked(taskData.subtasks.map(s => s.checked));
  }, [initialTask]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubtaskChange = (index: number, value: string) => {
    const newSubtasks = [...taskData.subtasks];
    newSubtasks[index].text = value;
    setTaskData(prev => ({ ...prev, subtasks: newSubtasks }));
  };

  const handleSubtaskCheck = (index: number) => {
    const newChecked = [...subtaskChecked];
    newChecked[index] = !newChecked[index];
    setSubtaskChecked(newChecked);
    const newSubtasks = [...taskData.subtasks];
    newSubtasks[index].checked = newChecked[index];
    setTaskData(prev => ({ ...prev, subtasks: newSubtasks }));
  };

  const addSubtask = () => {
    setTaskData(prev => ({ ...prev, subtasks: [...prev.subtasks, { text: '', checked: false }] }));
    setSubtaskChecked(prev => [...prev, false]);
  };

  const handleSave = () => {
    const filteredSubtasks = taskData.subtasks.filter(s => s.text.trim() !== '');
    onSave({
      title: taskData.title,
      description: taskData.description,
      startAt: `${taskData.startAt}T00:00`,
      finishAt: `${taskData.finishAt}T00:00`,
      category: taskData.category,
      subtasks: filteredSubtasks.map(s => s.text),
    });
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFiles(prev => [...prev, { name: file.name, size: `${(file.size / 1024).toFixed(1)} kB` }]);
    }
  };

  const handleDateSelect = (date: string, isStart: boolean) => {
    if (isStart) {
      setTaskData(prev => ({ ...prev, startAt: date }));
      setShowStartDatePicker(false);
    } else {
      setTaskData(prev => ({ ...prev, finishAt: date }));
      setShowDueDatePicker(false);
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Select date';
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date.toDateString() === today.toDateString()) return 'Today';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <Overlay isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg p-4 w-full max-w-md mx-auto shadow-lg z-50" onClick={handleModalClick}>
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-orange-500 font-medium"># {taskData.category}</span>
            <button
              className="text-gray-600 hover:underline"
              onClick={() => setShowStartDatePicker(true)}
            >
              Start: {formatDateDisplay(taskData.startAt)}
            </button>
            <button
              className="text-gray-600 hover:underline"
              onClick={() => setShowDueDatePicker(true)}
            >
              Due: {formatDateDisplay(taskData.finishAt)}
            </button>
            <button className="text-gray-600 hover:underline">Add subtasks</button>
            <div className="relative">
              <button className="text-gray-600 hover:underline">...</button>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            {/* <Checkbox checked={!!initialTask} onCheckedChange={() => {}} /> */}
            <Input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleInputChange}
              className="border-none text-lg font-medium focus:ring-0"
            />
            {/* <div className="text-gray-500 text-sm">ACTUAL | PLANNED</div> */}
          </div>

          {taskData.subtasks.map((subtask, index) => (
            <div key={index} className="flex items-center space-x-2 ml-6">
              {/* <Checkbox
                checked={subtaskChecked[index] || false}
                onCheckedChange={() => handleSubtaskCheck(index)}
              /> */}
              <Input
                type="text"
                value={subtask.text}
                onChange={(e) => handleSubtaskChange(index, e.target.value)}
                className="border-none focus:ring-0"
              />
            </div>
          ))}
          <button onClick={addSubtask} className="text-blue-500 text-sm ml-6">+ Add subtask</button>

          <div>
            <Label className="text-sm text-gray-600">Notes</Label>
            <Textarea
              name="description"
              value={taskData.description}
              onChange={handleInputChange}
              placeholder="Notes..."
              className="min-h-16 resize-none border-none focus:ring-0 text-sm"
            />
          </div>

          {/* <div>
            <Label className="text-sm text-gray-600">Comment</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={commentText}
                onChange={handleCommentChange}
                placeholder="Type a comment..."
                className="flex-1 border-gray-300 text-sm"
              />
              <input type="file" onChange={handleFileUpload} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer text-gray-500 hover:text-gray-700">
                <span className="material-icons">attach_file</span>
              </label>
            </div>
            {files.map((file, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                <span className="material-icons">description</span>
                <span>{file.name}</span>
                <span>{file.size}</span>
              </div>
            ))}
            <p className="text-xs text-gray-400 mt-1">Shift + Return to add a new line <span className="text-blue-500">@</span> to mention</p>
          </div> */}

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>

        {showStartDatePicker && (
          <Overlay isOpen={showStartDatePicker} onClose={() => setShowStartDatePicker(false)}>
            <div className="bg-white p-5 rounded-lg shadow-lg z-60" onClick={(e) => e.stopPropagation()}>
              <Label>Select Start Date</Label>
              <input
                type="date"
                onChange={(e) => handleDateSelect(e.target.value, true)}
                defaultValue={taskData.startAt}
                className="mt-2 p-2 border rounded w-full"
              />
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setShowStartDatePicker(false)}>
                  Close
                </Button>
              </div>
            </div>
          </Overlay>
        )}

        {showDueDatePicker && (
          <Overlay isOpen={showDueDatePicker} onClose={() => setShowDueDatePicker(false)}>
            <div className="bg-white p-5 rounded-lg shadow-lg z-60" onClick={(e) => e.stopPropagation()}>
              <Label>Select Due Date</Label>
              <input
                type="date"
                onChange={(e) => handleDateSelect(e.target.value, false)}
                defaultValue={taskData.finishAt}
                className="mt-2 p-2 border rounded w-full"
              />
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setShowDueDatePicker(false)}>
                  Close
                </Button>
              </div>
            </div>
          </Overlay>
        )}
      </div>
    </Overlay>
  );
}