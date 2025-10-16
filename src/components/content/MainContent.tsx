'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { format, differenceInMinutes } from 'date-fns';
import TaskModal from '@/components/ui/TaskModal';

// Interface Task với sectionId
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
  sectionId: number; // Thêm sectionId
}

// Section giữ nguyên
interface Section {
  id: number;
  title: string;
  tasks: Task[];
}

export default function MainContent() {
  const [sections, setSections] = useState<Section[]>([]);
  const [dragData, setDragData] = useState<{ task: Task; fromSectionId: number } | null>(null);
  const [dropTarget, setDropTarget] = useState<{ sectionId: number; taskId: number | null; position: 'before' | 'after' } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // Lưu task được chọn để chỉnh sửa

  // Mock API data
  useEffect(() => {
    const mockApiData: Section[] = [
      {
        id: 1,
        title: 'Default',
        tasks: [
          {
            id: 1,
            title: 'Sunsama Task 1',
            description: 'Mô tả chi tiết công việc 1. Đây là mô tả dài để test độ dài nội dung, có thể rất dài và cần hiển thị đầy đủ mà không cắt.',
            priority: 'high',
            startAt: '2025-10-15T14:00:00',
            finishAt: '2025-10-15T16:30:00',
            createdAt: '2025-10-14T10:00:00',
            createdBy: 1,
            statusId: 1,
            projectId: 1,
            supervisor: 2,
            sectionId: 1,
          },
          {
            id: 2,
            title: 'Sunsama Task 2',
            description: 'Mô tả ngắn.',
            priority: 'medium',
            startAt: '2025-10-14T14:00:00',
            finishAt: '2025-10-14T14:45:00',
            createdAt: '2025-10-13T10:00:00',
            createdBy: 1,
            statusId: 2,
            projectId: 1,
            supervisor: 2,
            sectionId: 1,
          },
        ],
      },
      {
        id: 2,
        title: 'School',
        tasks: [
          {
            id: 3,
            title: 'School Task 1',
            description: 'Mô tả chi tiết cho task school, dài dòng để test hiển thị đầy đủ.',
            priority: 'low',
            startAt: '2025-10-16T09:00:00',
            finishAt: '2025-10-16T11:15:00',
            createdAt: '2025-10-15T08:00:00',
            createdBy: 1,
            statusId: 3,
            projectId: 2,
            supervisor: 3,
            sectionId: 2,
          },
        ],
      },
      {
        id: 3,
        title: 'Testing',
        tasks: [],
      },
    ];
    setSections(mockApiData);
  }, []);

  // Handle drag functions (giữ nguyên)
  const handleDragStart = (task: Task, sectionId: number) => (e: React.DragEvent) => {
    const data = { task, fromSectionId: sectionId };
    e.dataTransfer.setData('task', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
    setDragData(data);
    (e.target as HTMLElement).closest('.task-item')?.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).closest('.task-item')?.classList.remove('opacity-50');
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

  const handleDragEnterTask = (sectionId: number, taskId: number, position: 'before' | 'after') => () => {
    setDropTarget({ sectionId, taskId, position });
  };

  const handleDragLeaveTask = () => {};

  const handleDrop = (sectionId: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const dataStr = e.dataTransfer.getData('task');
    if (!dataStr) return;

    const { task, fromSectionId } = JSON.parse(dataStr);
    if (fromSectionId === sectionId && task.id === dropTarget?.taskId) return;

    setSections(prevSections => {
      const updatedSections = prevSections.map(s => ({ ...s, tasks: [...s.tasks] }));
      const fromSection = updatedSections.find(s => s.id === fromSectionId);
      const toSection = updatedSections.find(s => s.id === sectionId);

      if (fromSection && toSection) {
        fromSection.tasks = fromSection.tasks.filter(t => t.id !== task.id);
        task.sectionId = sectionId; // Cập nhật sectionId của task khi di chuyển

        if (dropTarget && dropTarget.taskId !== null) {
          const targetIndex = toSection.tasks.findIndex(t => t.id === dropTarget.taskId);
          if (targetIndex !== -1) {
            const insertIndex = dropTarget.position === 'before' ? targetIndex : targetIndex + 1;
            toSection.tasks.splice(insertIndex, 0, task);
          }
        } else {
          toSection.tasks.push(task);
        }
      }
      return updatedSections;
    });

    setDropTarget(null);
    setDragData(null);
  };

  // Handle save task (tạo mới hoặc cập nhật)
  const handleSaveTask = (taskData: { title: string; description: string; startAt: string; finishAt: string; category: string; subtasks: string[] }) => {
    const newOrUpdatedTask: Task = {
      id: selectedTask ? selectedTask.id : Date.now(), // Sử dụng ID hiện tại nếu chỉnh sửa
      title: taskData.title,
      description: taskData.description,
      priority: selectedTask?.priority || 'medium', // Giữ nguyên priority nếu có
      startAt: taskData.startAt,
      finishAt: taskData.finishAt,
      createdAt: selectedTask ? selectedTask.createdAt : new Date().toISOString(),
      createdBy: selectedTask ? selectedTask.createdBy : 1, // Giữ nguyên nếu chỉnh sửa
      statusId: selectedTask ? selectedTask.statusId : 1,
      projectId: selectedTask ? selectedTask.projectId : null,
      supervisor: selectedTask ? selectedTask.supervisor : null,
      sectionId: selectedTask ? selectedTask.sectionId : sections.find(s => s.title === taskData.category)?.id || 1, // Thêm sectionId
    };

    setSections(prev => {
      const updatedSections = prev.map(section => {
        if (section.id === newOrUpdatedTask.sectionId) {
          if (selectedTask) {
            // Cập nhật task hiện có
            const taskIndex = section.tasks.findIndex(t => t.id === selectedTask.id);
            if (taskIndex !== -1) {
              const updatedTasks = [...section.tasks];
              updatedTasks[taskIndex] = newOrUpdatedTask;
              return { ...section, tasks: updatedTasks };
            }
          } else {
            // Thêm task mới
            return { ...section, tasks: [...section.tasks, newOrUpdatedTask] };
          }
        }
        return section;
      });
      return updatedSections;
    });

    setIsModalOpen(false);
    setSelectedTask(null); // Reset sau khi lưu
  };

  // Open modal to edit existing task
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Get status color
  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 1: return 'bg-blue-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Hàm tính thời lượng theo hh:mm
  const getEstimatedTime = (startAt: string, finishAt: string) => {
    const start = new Date(startAt);
    const finish = new Date(finishAt);
    const totalMinutes = differenceInMinutes(finish, start);
    if (totalMinutes < 0) return '00:00';
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Hàm tính độ dài description
  const getDescriptionLength = (description: string) => {
    return `${description.length} ký tự`;
  };

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
              <Button variant="full" size="lg" onClick={() => { setSelectedTask(null); setIsModalOpen(true); }}>+ Add task</Button>
            </div>
            {section.tasks.map(task => {
              const isOverBefore = dropTarget?.sectionId === section.id && dropTarget.taskId === task.id && dropTarget.position === 'before';
              const isOverAfter = dropTarget?.sectionId === section.id && dropTarget.taskId === task.id && dropTarget.position === 'after';

              return (
                <div
                  key={task.id}
                  className={`task-item flex mb-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all cursor-move relative
                    ${isOverBefore ? 'border-t-2 border-blue-500' : ''}
                    ${isOverAfter ? 'border-b-2 border-blue-500' : ''}`}
                  draggable
                  onDragStart={handleDragStart(task, section.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOverTask(section.id, task.id)}
                  onDragEnter={handleDragEnterTask(section.id, task.id, 'before')}
                  onDragLeave={handleDragLeaveTask}
                  onClick={() => handleTaskClick(task)} // Mở modal khi click task
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="text-xs text-gray-500 font-medium">{format(new Date(task.startAt), 'HH:mm')}</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-normal">{task.title}</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <span className="text-xs text-gray-700">{task.description}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500">{getDescriptionLength(task.description)}</span>
                      <span className={`w-2 h-2 rounded-full ml-2 ${getStatusColor(task.statusId)}`}></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mb-1">
                      <span className="text-xs text-gray-400">{getEstimatedTime(task.startAt, task.finishAt)}</span>
                    </div>
                    <div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {task.priority}
                      </span>
                    </div>
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
        initialTask={selectedTask} // Truyền task hiện tại vào modal để chỉnh sửa
      />
    </main>
  );
}