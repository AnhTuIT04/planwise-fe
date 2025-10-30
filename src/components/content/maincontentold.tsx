'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { format, differenceInMinutes } from 'date-fns';
import TaskModal from '@/components/ui/TaskModal';

// === Interface ===
interface Subtask {
  id: number;
  text: string;
  status: 'pending' | 'finished';
}

interface Task {
  id: number;
  title: string;
  description: string;
  subtasks: Subtask[];
  priority: 'low' | 'medium' | 'high';
  startAt: string;
  finishAt: string;
  createdAt: string;
  createdBy: number;
  statusId: number;
  projectId: number | null;
  supervisor: number | null;
  sectionId: number;
  parentId: number | null;
  status: 'inprogress' | 'finished';
}

interface Section {
  id: number;
  title: string;
  tasks: Task[];
  indexTask: string; // '1,2,3'
}

// === Component ===
export default function MainContent() {
  const [sections, setSections] = useState<Section[]>([]);
  const [dragData, setDragData] = useState<{ task: Task; fromSectionId: number } | null>(null);
  const [dropTarget, setDropTarget] = useState<{ sectionId: number; taskId: number | null; position: 'before' |

 'after' } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // === Mock API Data ===
  useEffect(() => {
    const mockApiData: Section[] = [
      {
        id: 1,
        title: 'Default',
        indexTask: '1,2',
        tasks: [
          {
            id: 1,
            title: 'Sunsama Task 1',
            description: 'Mô tả chi tiết công việc 1...',
            subtasks: [
              { id: 101, text: 'Thiết kế giao diện chính', status: 'finished' },
              { id: 102, text: 'Viết API login', status: 'finished' },
              { id: 103, text: 'Kiểm thử chức năng đăng nhập', status: 'pending' },
            ],
            priority: 'high',
            startAt: '2025-10-15T14:00:00',
            finishAt: '2025-10-15T16:30:00',
            createdAt: '2025-10-14T10:00:00',
            createdBy: 1,
            statusId: 1,
            projectId: 1,
            supervisor: 2,
            sectionId: 1,
            parentId: null,
            status: 'inprogress',
          },
          {
            id: 2,
            title: 'Sunsama Task 2',
            description: 'Mô tả ngắn.',
            subtasks: [
              { id: 201, text: 'Cập nhật tài liệu', status: 'finished' },
            ],
            priority: 'medium',
            startAt: '2025-10-14T14:00:00',
            finishAt: '2025-10-14T14:45:00',
            createdAt: '2025-10-13T10:00:00',
            createdBy: 1,
            statusId: 2,
            projectId: 1,
            supervisor: 2,
            sectionId: 1,
            parentId: null,
            status: 'finished',
          },
        ],
      },
      {
        id: 2,
        title: 'School',
        indexTask: '3',
        tasks: [
          {
            id: 3,
            title: 'School Task 1',
            description: 'Mô tả chi tiết cho task school...',
            subtasks: [
              { id: 301, text: 'Chuẩn bị slide thuyết trình', status: 'pending' },
              { id: 302, text: 'Tập luyện thuyết trình', status: 'pending' },
            ],
            priority: 'low',
            startAt: '2025-10-16T09:00:00',
            finishAt: '2025-10-16T11:15:00',
            createdAt: '2025-10-15T08:00:00',
            createdBy: 1,
            statusId: 3,
            projectId: 2,
            supervisor: 3,
            sectionId: 2,
            parentId: null,
            status: 'inprogress',
          },
        ],
      },
      {
        id: 3,
        title: 'Testing',
        indexTask: '',
        tasks: [],
      },
    ];
    setSections(mockApiData);
  }, []);

  // === Drag & Drop ===
  const handleDragStart = (task: Task, sectionId: number) => (e: React.DragEvent) => {
    const data = { task, fromSectionId: sectionId };
    e.dataTransfer.setData('task', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
    setDragData(data);
    (e.target as HTMLElement).closest('.task-item')?.classList.add('opacity-50');
  };

  const handleDragEnd = () => {
    setDropTarget(null);
    setDragData(null);
  };

  const handleDragOverSection = (sectionId: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!dropTarget || dropTarget.sectionId !== sectionId) {
      setDropTarget({ sectionId, taskId: null, position: 'after' });
    }
  };

  const handleDragOverTask = (sectionId: number, taskId: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const position = y < rect.height / 2 ? 'before' : 'after';
    setDropTarget({ sectionId, taskId, position });
  };

  const handleDrop = (sectionId: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const dataStr = e.dataTransfer.getData('task');
    if (!dataStr) return;

    const { task, fromSectionId } = JSON.parse(dataStr);
    if (fromSectionId === sectionId && task.id === dropTarget?.taskId) return;

    setSections(prev => {
      const updated = prev.map(s => ({ ...s, tasks: [...s.tasks] }));
      const fromSection = updated.find(s => s.id === fromSectionId);
      const toSection = updated.find(s => s.id === sectionId);

      if (fromSection && toSection) {
        fromSection.tasks = fromSection.tasks.filter(t => t.id !== task.id);
        task.sectionId = sectionId;

        if (dropTarget?.taskId !== null) {
          const targetIndex = toSection.tasks.findIndex(t => t.id === dropTarget?.taskId);
          const insertIndex = dropTarget?.position === 'before' ? targetIndex : targetIndex + 1;
          toSection.tasks.splice(insertIndex, 0, task);
        } else {
          toSection.tasks.push(task);
        }

        // Cập nhật indexTask
        fromSection.indexTask = fromSection.tasks.map(t => t.id).join(',');
        toSection.indexTask = toSection.tasks.map(t => t.id).join(',');
      }
      return updated;
    });

    setDropTarget(null);
    setDragData(null);
  };

  // === Toggle Subtask ===
  const toggleTask = (sectionId: number|string, taskId: number|string) => {
    setSections(prev => {
      return prev.map(section => {
        if (section.id !== sectionId) return section;

        const updatedTasks: Task[] = section.tasks.map(task => {
          if (task.id !== taskId) return task;

          const newStatus = task.status === 'finished' ? 'inprogress' : 'finished';
          const updatedSubtasks: Subtask[] = task.subtasks.map(st => ({
            ...st,
            status: newStatus === 'finished' ? 'finished' : 'pending',
          }));

          return {
            ...task,
            subtasks: updatedSubtasks,
            status: newStatus,
          };
        });

        const newIndexTask = updatedTasks.map(t => t.id).join(',');

        // Đảm bảo trả về đúng kiểu Section
        return {
          ...section,
          tasks: updatedTasks,
          indexTask: newIndexTask,
        };
      });
    });
  }
  const toggleSubtask = (sectionId: number|string, taskId: number|string, subtaskId: number|string) => {
    setSections(prev => {
      return prev.map(section => {
        if (section.id !== sectionId) return section;

        const updatedTasks: Task[] = section.tasks.map(task => {
          if (task.id !== taskId) return task;

          const updatedSubtasks: Subtask[] = task.subtasks.map(st =>
            st.id === subtaskId
              ? { ...st, status: st.status === 'finished' ? 'pending' : 'finished' }
              : st
          );

          const allFinished = updatedSubtasks.every(st => st.status === 'finished');
          const newTaskStatus = allFinished ? 'finished' : 'inprogress';

          return {
            ...task,
            subtasks: updatedSubtasks,
            status: newTaskStatus,
          };
        });

        const newIndexTask = updatedTasks.map(t => t.id).join(',');

        // Đảm bảo trả về đúng kiểu Section
        return {
          ...section,
          tasks: updatedTasks,
          indexTask: newIndexTask,
        };
      });
    });
  };

  // === Save Task ===
  const handleSaveTask = (taskData: {
    title: string;
    description: string;
    startAt: string;
    finishAt: string;
    category: string;
    subtasks: string[];
  }) => {
    const subtasks = taskData.subtasks.map((text, i) => ({
      id: selectedTask?.subtasks[i]?.id || Date.now() + i,
      text,
      status: selectedTask?.subtasks[i]?.status || 'pending' as const,
    }));

    const newTask: Task = {
      id: selectedTask ? selectedTask.id : Date.now(),
      title: taskData.title,
      description: taskData.description,
      subtasks,
      priority: selectedTask?.priority || 'medium',
      startAt: taskData.startAt,
      finishAt: taskData.finishAt,
      createdAt: selectedTask?.createdAt || new Date().toISOString(),
      createdBy: selectedTask?.createdBy || 1,
      statusId: selectedTask?.statusId || 1,
      projectId: selectedTask?.projectId || null,
      supervisor: selectedTask?.supervisor || null,
      sectionId: selectedTask?.sectionId || sections.find(s => s.title === taskData.category)?.id || 1,
      parentId: selectedTask?.parentId || null,
      status: subtasks.every(st => st.status === 'finished') ? 'finished' : 'inprogress',
    };

    setSections(prev => {
      const updated = prev.map(section => {
        if (section.id !== newTask.sectionId) return section;
        let updatedTasks: Task[];
        if (selectedTask) {
          updatedTasks = section.tasks.map(t => t.id === selectedTask.id ? newTask : t);
        } else {
          updatedTasks = [...section.tasks, newTask];
        }
        return { ...section, tasks: updatedTasks, indexTask: updatedTasks.map(t => t.id).join(',') };
      });
      return updated;
    });

    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // === Open Modal ===
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // === Helpers ===
  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 1: return 'bg-blue-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getEstimatedTime = (startAt: string, finishAt: string) => {
    const start = new Date(startAt);
    const finish = new Date(finishAt);
    const totalMinutes = differenceInMinutes(finish, start);
    if (totalMinutes < 0) return '00:00';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // === Render ===
  return (
    <main className="flex-1 p-6" style={{ backgroundColor: '#F0F0F0' }}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <Button variant="outline" size="sm">Today</Button>
          <Button variant="outline" size="sm" className="ml-2">Filter</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sections.map(section => (
          <div
            key={section.id}
            className="bg-gray-50 p-4 rounded-lg border border-gray-300 relative"
            onDragOver={handleDragOverSection(section.id)}
            onDrop={handleDrop(section.id)}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-md font-semibold">{section.title}</h2>
            </div>
            <div className="mt-4 mb-3">
              <Button
                variant="full"
                size="lg"
                onClick={() => { setSelectedTask(null); setIsModalOpen(true); }}
              >
                + Add task
              </Button>
            </div>

            {section.tasks
              .sort((a, b) => {
                const order = section.indexTask.split(',').map(Number);
                return order.indexOf(a.id) - order.indexOf(b.id);
              })
              .map(task => {
                const isOverBefore = dropTarget?.sectionId === section.id && dropTarget.taskId === task.id && dropTarget.position === 'before';
                const isOverAfter = dropTarget?.sectionId === section.id && dropTarget.taskId === task.id && dropTarget.position === 'after';

                return (
                  <div
                    key={task.id}
                    className={`task-item mb-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all cursor-move relative
                      ${isOverBefore ? 'border-t-2 border-blue-500' : ''}
                      ${isOverAfter ? 'border-b-2 border-blue-500' : ''}`}
                    draggable
                    onDragStart={handleDragStart(task, section.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOverTask(section.id, task.id)}
                    onClick={(e) => {
                      if (e.target instanceof HTMLElement && e.target.closest('.subtask-checkbox')) return;
                      handleTaskClick(task);
                    }}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-xs text-gray-500 font-medium">
                          {format(new Date(task.startAt), 'HH:mm')}
                        </div>
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">{getEstimatedTime(task.startAt, task.finishAt)}</div>
                        <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mt-1">
                          {task.priority}
                        </div>
                      </div>
                    </div>

                    {/* Subtasks */}
                    <div className="space-y-1">
                      {task.subtasks.map(subtask => (
                        <label
                          key={subtask.id}
                          className="flex items-center gap-2 cursor-pointer select-none subtask-checkbox"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                              ${subtask.status === 'finished'
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-400 bg-white'
                              }`}
                            onClick={() => toggleSubtask(section.id, task.id, subtask.id)}
                          >
                            {subtask.status === 'finished' && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span
                            // className={`text-xs ${subtask.status === 'finished' ? 'text-gray-500 line-through' : 'text-gray-700'}`}
                            className='text-xs text-gray-700'
                          >
                            {subtask.text}
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-start">
                      <label
                        className="flex items-center gap-2 cursor-pointer select-none task-checkbox"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shadow-sm
                            ${task.status === 'finished' ? 'bg-green-500 border-green-500' : 'border-gray-400 bg-white'}`}
                          onClick={() => toggleTask(section.id, task.id)}
                        >
                          {task.status === 'finished' && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </label>
                    </div>
                    
                    {/* Status dot */}
                    <div className="flex justify-end mt-2">
                      <span className={`w-2 h-2 rounded-full ${getStatusColor(task.statusId)}`}></span>
                    </div>
                  </div>
                );
              })}
          </div>
        ))}

        <div className="p-4 flex justify-center">
          <Button variant="full" size="lg">+ Add Section</Button>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedTask(null); }}
        onSave={handleSaveTask}
        initialTask={selectedTask}
        sections={sections}
      />
    </main>
  );
}