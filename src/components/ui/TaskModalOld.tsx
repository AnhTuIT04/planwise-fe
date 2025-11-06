'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { format, addMinutes } from 'date-fns';
import { toast } from 'sonner';
import Overlay from './Overlay';
import { createTask, updateTask,deleteTask } from '@/lib/task';

// === Types ===
interface Subtask {
  id: string;
  text: string;
  status: 'TODO' | 'DONE';
  isNew?: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  subTask: Subtask[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | null;
  startDate: string | null;
  dueDate: string | null;
  createdAt: string;
  createdBy: string;
  status: 'TODO' | 'DONE';
  projectId: string;
  sectionId: string | null;
  assigneeIds: string[];
}

interface Section {
  id: string;
  name: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask: Task | null;
  sections: Section[];
  projectId: string;
  isPersonal?: boolean;
}

export default function TaskModal({
  isOpen,
  onClose,
  initialTask,
  sections,
  projectId,
  isPersonal = false,
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startAt, setStartAt] = useState('');
  const [finishAt, setFinishAt] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [priority, setPriority] = useState<'LOW' | 'HIGH'>('LOW'); // Thêm priority

  // === Khởi tạo dữ liệu ===
  useEffect(() => {
    if (!isOpen) return;

    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setStartAt(
        initialTask.startDate
          ? format(new Date(initialTask.startDate), "yyyy-MM-dd'T'HH:mm")
          : ''
      );
      setFinishAt(
        initialTask.dueDate
          ? format(new Date(initialTask.dueDate), "yyyy-MM-dd'T'HH:mm")
          : ''
      );
      setSectionId(initialTask.sectionId || sections[0]?.id || '');
      setPriority(initialTask.priority === 'HIGH' ? 'HIGH' : 'LOW');
      setSubtasks(
        // initialTask?.subTask?.length > 0
        //   ? initialTask.subTask
        //   : [{ id: crypto.randomUUID(), text: '', status: 'TODO' }]
        initialTask?.subTask?.length > 0
          ? initialTask.subTask.map((st: any) => ({
              id: st.id,
              text: st.title || st.text || '',
              status: st.status || 'TODO',
              isNew: false // đã tồn tại trên DB
            }))
          : [{ 
              id: crypto.randomUUID(), 
              text: '', 
              status: 'TODO',
              isNew: true
            }]
      );
    } else {
      // === Tạo mới: set thời gian mặc định ===
      const now = new Date();
      const start = format(now, "yyyy-MM-dd'T'HH:mm");
      const end = format(addMinutes(now, 30), "yyyy-MM-dd'T'HH:mm");

      setTitle('');
      setDescription('');
      setStartAt(start);
      setFinishAt(end);
      setSectionId(sections[0]?.id || '');
      setPriority('LOW');
      setSubtasks([{ id: crypto.randomUUID(), text: '', status: 'TODO' }]);
    }
  }, [initialTask, sections, isOpen]);

  // === Subtask handlers ===
  const updateSubtask = (id: string, text: string) => {
    setSubtasks(prev => prev.map(st => (st.id === id ? { ...st, text } : st)));
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(prev =>
      prev.map(st =>
        st.id === id
          ? { ...st, status: st.status === 'DONE' ? 'TODO' : 'DONE' }
          : st
      )
    );
  };

  const addSubtask = () => {
    setSubtasks(prev => [
      ...prev,
      { id: crypto.randomUUID(), text: '', status: 'TODO',isNew: true },
    ]);
  };

  const removeSubtask = async (id: string) => {
    const subtask = subtasks.find(st => st.id === id);
      if (!subtask) return;

      if (!subtask.isNew && id) {
        try {
          await deleteTask({ id, isPersonal, projectId });
          toast.success('Subtask deleted');
        } catch (error) {
          toast.error('Failed to delete subtask');
          return;
        }
      }
      setSubtasks(prev => prev.filter(st => st.id !== id));
  };

  // === Save Task ===
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!sectionId) {
      toast.error('Please select a section');
      return;
    }

    // const validSubtasks = subtasks
    //   .filter(st => st.text.trim()) 
    //   .map(st => ({
    //     // title: st.text,
    //     // status: st.status
    //     const { id, text, status, isNew } = st;
    //     const base = {
    //       title: text,
    //       status
    //     };
    //     // Chỉ gửi id nếu là subtask cũ
    //     return isNew ? base : { ...base, id };
    //   }));
    const validSubtasks = subtasks
    .filter(st => st.text.trim())
    .map(st => {
      const { id, text, status, isNew } = st;
      const base = {
        title: text,
        status
      };
      return isNew ? base : { ...base, taskId: id };
    });
    const payload = {
      title,
      description: description || undefined,
      startDate: startAt || undefined,
      dueDate: finishAt || undefined,
      sectionId,
      projectId,
      priority: priority as 'LOW' | 'HIGH',
      ...(validSubtasks.length > 0 && { subTask: validSubtasks }),
    };

    try {
      let res;
      if (initialTask) {
        res = await updateTask({
          id: initialTask.id,
          ...payload,
          isPersonal,
        });
      } else {
        res = await createTask(payload);
      }

      if (res.isSuccess) {
        toast.success(initialTask ? 'Task updated!' : 'Task created!');
        onClose();
      } else {
        toast.error(res.message || 'Failed to save task');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  // === Format time ===
  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    return format(new Date(dateStr), 'HH:mm');
  };

  if (!isOpen) return null;

  return (
    <Overlay isOpen={isOpen} onClose={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-purple-600 font-medium">
              # {sections.find(s => s.id === sectionId)?.name || 'Task'}
            </span>
            {startAt && (
              <span className="text-gray-600">
                {formatTime(startAt)} – {formatTime(finishAt)}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <Input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task title..."
            className="text-xl font-semibold border-none focus:ring-0 p-0"
          />

          {/* Priority - Dùng <select> như cũ */}
          <div>
            <Label className="text-sm text-gray-600">Priority</Label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as 'LOW' | 'HIGH')}
              className="mt-1 w-full p-2 border rounded-md text-sm"
            >
              <option value="LOW">Low</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* Subtasks */}
          <div className="space-y-2">
            {subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-3 group">
                <button
                  onClick={() => toggleSubtask(subtask.id)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${subtask.status === 'DONE'
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-gray-500'
                    }`}
                >
                  {subtask.status === 'DONE' && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <Input
                  value={subtask.text}
                  onChange={e => updateSubtask(subtask.id, e.target.value)}
                  placeholder="Subtask..."
                  className={`flex-1 border-none focus:ring-0 text-sm text-gray-700 `}
                />

                {/* {subtasks.length > 1 && ( */}
                  <button
                    type="button"
                    onClick={() => removeSubtask(subtask.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                {/* )} */}
              </div>
            ))}

            <button
              type="button"
              onClick={addSubtask}
              className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1 mt-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add subtask
            </button>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-sm text-gray-600">Notes</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add any notes..."
              className="mt-1 min-h-20 resize-none border-gray-200 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Time Pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Start</Label>
              <Input
                type="datetime-local"
                value={startAt}
                onChange={e => setStartAt(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600">Finish</Label>
              <Input
                type="datetime-local"
                value={finishAt}
                onChange={e => setFinishAt(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Section */}
          <div>
            <Label className="text-sm text-gray-600">Section</Label>
            <select
              value={sectionId}
              onChange={e => setSectionId(e.target.value)}
              className="mt-1 w-full p-2 border rounded-md text-sm"
            >
              {sections.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {initialTask ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </Overlay>
  );
}