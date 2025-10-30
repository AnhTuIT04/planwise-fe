'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import TaskModal from '@/components/ui/TaskModal';
import {
  getAllProjects,
  getPersonalProject,
} from '@/lib/project';
import {
  createSection,
  updateSection,
} from '@/lib/section';
import {
  createTask,
  updateTask,
} from '@/lib/task';

// === Types ===
interface Subtask {
  id: string;
  text: string;
  status: 'TODO' | 'DONE';
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
  projectId: string;
  listOfTask: string;
  tasks: Task[];
}

interface Project {
  id: string;
  name: string;
  isPersonal: boolean;
  sections: Section[];
}

// === Component ===
export default function MainContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dragData, setDragData] = useState<{ task: Task; fromSectionId: string } | null>(null);
  const [dropTarget, setDropTarget] = useState<{ sectionId: string; taskId: string | null; position: 'before' | 'after' } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [fromSectionDrop, setFromSectionDrop] = useState<string | undefined>(undefined);
  const [toSectionDrop, setToSectionDrop] = useState<string | undefined>(undefined);
  const [sectionUpdate, setSectionUpdate] = useState<{
    from: { id: string; listOfTask: string };
    to?: { id: string; listOfTask: string };
  } | null>(null);
  // === Load Data ===
  // useEffect(() => {
  //   async function loadData() {
  //     setIsLoading(true);
  //     try {
  //       const [allRes, personalRes] = await Promise.all([
  //         getAllProjects(),
  //         getPersonalProject(),
  //       ]);

  //       const allProjects = allRes.data || [];
  //       const personalProject = personalRes.data;

  //       const combined: Project[] = personalProject
  //         ? [personalProject, ...allProjects.filter(p => p.id !== personalProject.id)]
  //         : allProjects;

  //       setProjects(combined);

  //       if (personalProject) {
  //         setSections(personalProject.sections);
  //         setSelectedProjectId(personalProject.id);
  //       } else if (allProjects.length > 0) {
  //         setSections(allProjects[0].sections);
  //         setSelectedProjectId(allProjects[0].id);
  //       }
  //     } catch (error) {
  //       toast.error("Failed to load projects");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   loadData();
  // }, []);
  useEffect(() => {
  async function loadData() {
    setIsLoading(true);
    try {
      const [allRes, personalRes] = await Promise.all([
        getAllProjects(),
        getPersonalProject(),
      ]);

      const allProjects = allRes.data || [];
      const personalProject = personalRes.data;

      const combined: Project[] = personalProject
        ? [personalProject, ...allProjects.filter(p => p.id !== personalProject.id)]
        : allProjects;

      setProjects(combined);

      let targetProject = personalProject;
      if (!targetProject && allProjects.length > 0) {
        targetProject = allProjects[0];
      }

      if (targetProject) {
        // === ĐỊNH NGHĨA KIỂU CHO TASK API ===
        interface RawTask {
          id: string;
          title: string;
          description: string | null;
          status: 'TODO' | 'DONE';
          priority: 'LOW' | 'MEDIUM' | 'HIGH' | null;
          startDate: string | null;
          dueDate: string | null;
          createdAt: string;
          updatedAt?: string;
          createdBy?: string;
          sectionId: string;
          parentTaskId: string | null; // <-- cho phép null
          supervisorId: string | null;
          projectId: string;
          assignees: { id: string }[];
        }

        // === HÀM TRANSFORM SECTION ===
        const transformSection = (section: any): Section => {
          const rawTasks: RawTask[] = section.tasks || [];

          const taskMap = new Map<string, Task>();
          const rootTasks: Task[] = [];
          const subtaskMap = new Map<string, Subtask[]>();

          rawTasks.forEach((raw: RawTask) => {
            const isSubtask = raw.parentTaskId !== null;

            if (isSubtask && raw.parentTaskId) {
              const sub: Subtask = {
                id: raw.id,
                text: raw.title,
                status: raw.status === 'DONE' ? 'DONE' : 'TODO',
              };

              if (!subtaskMap.has(raw.parentTaskId)) {
                subtaskMap.set(raw.parentTaskId, []);
              }
              subtaskMap.get(raw.parentTaskId)!.push(sub);
            } else if (!isSubtask) {
              // Task chính
              const task: Task = {
                id: raw.id,
                title: raw.title,
                description: raw.description || null,
                subTask: [],
                priority: raw.priority || null,
                startDate: raw.startDate || null,
                dueDate: raw.dueDate || null,
                createdAt: raw.createdAt,
                createdBy: raw.createdBy || '',
                status: raw.status || 'TODO',
                projectId: raw.projectId,
                sectionId: raw.sectionId,
                assigneeIds: raw.assignees?.map(a => a.id) || [],
              };
              taskMap.set(task.id, task);
              rootTasks.push(task);
              console.log(' Added root task:', task);
            }
          });
          rootTasks.forEach((task: Task) => {
            if (subtaskMap.has(task.id)) {
              task.subTask = subtaskMap.get(task.id)!;
            }
          });
          console.log(' taskMap', rootTasks);
          const order = section.listOfTask.replaceAll('\"', '')
            .split(',')
            .map((id: string) => id.trim())
            .filter((id: string) => id && taskMap.has(id));

          const orderedTasks = order.length > 0
            ? order.map((id: string) => taskMap.get(id)!)
            : rootTasks;

          const newListOfTask = orderedTasks.map((t: Task) => t.id).join(',');

          return {
            id: section.id,
            name: section.name,
            projectId: section.projectId,
            listOfTask: newListOfTask,
            tasks: orderedTasks,
          };
        };
        const transformedSections = targetProject.sections.map(transformSection);

        setSections(transformedSections);
        setSelectedProjectId(targetProject.id);
        console.log("transformedSections",transformedSections);
      }
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  }

  // loadData();
  let isMounted = true;
  loadData().finally(() => { if (isMounted) setIsLoading(false); });
  return () => { isMounted = false; };
}, []);
  useEffect(() => {
    if (!sectionUpdate) return;

    const { from, to } = sectionUpdate;
    const isPersonal = selectedProjectId === getPersonalProjectId();

    Promise.all([
      updateSection(from),
      to ? updateSection(to) : Promise.resolve()
    ]).then(() => {
      toast.success('Updated');
      setSectionUpdate(null);
    }).catch(() => {
      toast.error('Update failed');
      setSectionUpdate(null);
    });
  }, [sectionUpdate]);
  // === Drag & Drop ===
  const handleDragStart = (task: Task, sectionId: string) => (e: React.DragEvent) => {
    const data = { task, fromSectionId: sectionId };
    e.dataTransfer.setData('task', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
    setDragData(data);
    (e.currentTarget as HTMLElement).classList.add('opacity-50');
  };

  const handleDragEnd = () => {
    setDropTarget(null);
    setDragData(null);
    document.querySelectorAll('.task-item').forEach(el => el.classList.remove('opacity-50'));
  };

  const handleDragOverSection = (sectionId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!dropTarget || dropTarget.sectionId !== sectionId || dropTarget.taskId !== null) {
      setDropTarget({ sectionId, taskId: null, position: 'after' });
    }
  };

  const handleDragOverTask = (sectionId: string, taskId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const position = y < rect.height / 2 ? 'before' : 'after';
    setDropTarget({ sectionId, taskId, position });
  };

  const handleDrop = (sectionId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!dragData) return;

    const { task, fromSectionId } = dragData;
    const isSameSection = fromSectionId === sectionId;

    // Nếu không thay đổi vị trí
    if (isSameSection && dropTarget?.taskId === task.id) {
      setDropTarget(null);
      setDragData(null);
      return;
    }
    let newFromList = '';
    let newToList = '';
    setSections(prev => {
      const updated = prev.map(s => ({ ...s, tasks: [...s.tasks] }));
      const fromSection = updated.find(s => s.id === fromSectionId);
      const toSection = updated.find(s => s.id === sectionId);

      if (!fromSection || !toSection) return prev;

      // Xóa khỏi section cũ
      fromSection.tasks = fromSection.tasks.filter(t => t.id !== task.id);

      // Cập nhật sectionId
      task.sectionId = sectionId;

      // Thêm vào vị trí mới
      if (dropTarget?.taskId !== null) {
        const targetIndex = toSection.tasks.findIndex(t => t.id === dropTarget?.taskId);
        const insertIndex = dropTarget?.position === 'before' ? targetIndex : targetIndex + 1;
        toSection.tasks.splice(insertIndex, 0, task);
      } else {
        toSection.tasks.push(task);
      }

      // Cập nhật listOfTask
      fromSection.listOfTask = fromSection.tasks.map(t => t.id).join(',');
      newFromList = fromSection.tasks.map(t => t.id).join(',');
      toSection.listOfTask = toSection.tasks.map(t => t.id).join(',');
      newToList = toSection.tasks.map(t => t.id).join(',');
      setFromSectionDrop(newFromList);
      setToSectionDrop(newToList);
      setSectionUpdate({
    from: { id: fromSectionId, listOfTask: newFromList },
    ...(fromSectionId !== sectionId ? { to: { id: sectionId, listOfTask: newToList } } : {})
  });
      console.log("fromSectionNewList", fromSectionDrop, fromSection);
      console.log("toSectionNewList", toSectionDrop, toSection);
      return updated;
    });
    // Gọi API
    updateTask({
      id: task.id,
      sectionId,
      isPersonal: selectedProjectId === getPersonalProjectId(),
    }).then(res => {
      if (res.isSuccess) {
        toast.success("Task moved");
      } else {
        toast.error(res.message || "Failed to move");
      }
    }).catch(() => {
      toast.error("Failed to move task");
    });
    // setTimeout(() => {
    // updateSection({
    //   id: fromSectionId,
    //   // listOfTask: sections.find(s => s.id === fromSectionId)?.listOfTask || '',
    //   listOfTask: fromSectionDrop,
    // })
    //   .then(res => {
    //     if (!res.isSuccess) toast.error("Failed to update source section");
    //   })
    //   .catch(() => toast.error("Failed to update source section"));

    // // Cập nhật section đích (nếu khác)
    // if (fromSectionId !== sectionId) {
    //   updateSection({
    //     id: sectionId,
    //     // listOfTask: sections.find(s => s.id === sectionId)?.listOfTask || '',
    //     listOfTask: toSectionDrop,
    //   })
    //     .then(res => {
    //       if (!res.isSuccess) toast.error("Failed to update target section");
    //     })
    //     .catch(() => toast.error("Failed to update target section"));
    // }
    // console.log("fromSectionNewList", fromSectionDrop);
    // console.log("toSectionNewList", toSectionDrop);
    // }, 0);
    setDropTarget(null);
    setDragData(null);
  };

  // === Helpers ===
  const getPersonalProjectId = () => {
    return projects.find(p => p.isPersonal)?.id || null;
  };

  const toggleSubtask = async (sectionId: string, taskId: string, subtaskId: string) => {
    toast.info("Subtask toggle not implemented");
  };

  const toggleTaskStatus = async (sectionId: string, taskId: string) => {
    const task = sections.flatMap(s => s.tasks).find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';

    try {
      const res = await updateTask({
        id: taskId,
        status: newStatus,
        isPersonal: selectedProjectId === getPersonalProjectId(),
      });
      if (res.isSuccess) {
        setSections(prev =>
          prev.map(s =>
            s.id === sectionId
              ? {
                  ...s,
                  tasks: s.tasks.map(t =>
                    t.id === taskId ? { ...t, status: newStatus } : t
                  ),
                }
              : s
          )
        );
        toast.success("Task updated");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // === Save Task ===
  const handleSaveTask = async (taskData: {
    title: string;
    description: string;
    startDate: string;
    dueDate: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    sectionId: string;
    subtasks: string[];
  }) => {
    const payload = {
      ...taskData,
      projectId: selectedProjectId!,
      priority: taskData.priority,
      status: 'TODO' as const,
    };

    try {
      const res = selectedTask
        ? await updateTask({
            id: selectedTask.id,
            ...payload,
            isPersonal: selectedProjectId === getPersonalProjectId(),
          })
        : await createTask(payload);

      if (res.isSuccess) {
        toast.success(selectedTask ? "Task updated" : "Task created");
        setIsModalOpen(false);
        setSelectedTask(null);

        const project = projects.find(p => p.id === selectedProjectId);
        if (project) {
          setSections(project.sections);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save task");
    }
  };

  const handleAddSection = async () => {
    const name = prompt("Section name:");
    if (!name || !selectedProjectId) return;

    try {
      const res = await createSection({
        name,
        projectId: selectedProjectId,
      });
      if (res.isSuccess) {
        toast.success("Section created");
        const project = projects.find(p => p.id === selectedProjectId);
        if (project) setSections(project.sections);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // === Render ===
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Button variant="outline" size="sm">Today</Button>
          <Button variant="outline" size="sm" className="ml-2">Filter</Button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {projects.find(p => p.id === selectedProjectId)?.name || 'Tasks'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sections.map(section => (
          <div
            key={section.id}
            className="bg-white p-4 rounded-lg border"
            onDragOver={handleDragOverSection(section.id)}
            onDrop={handleDrop(section.id)}
          >
            <h2 className="font-semibold mb-3">{section.name}</h2>

            <Button
              className="w-full mb-3"
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedTask(null);
                setIsModalOpen(true);
              }}
            >
              + Add task
            </Button>

            <div className="space-y-2">
              {section.tasks
                .sort((a, b) => {
                  const order = section.listOfTask.split(',').filter(Boolean);
                  const aIndex = order.indexOf(a.id);
                  const bIndex = order.indexOf(b.id);
                  return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex);
                })
                .map(task => {
                  const isOverBefore = dropTarget?.sectionId === section.id && dropTarget.taskId === task.id && dropTarget.position === 'before';
                  const isOverAfter = dropTarget?.sectionId === section.id && dropTarget.taskId === task.id && dropTarget.position === 'after';

                  return (
                    <div
                      key={task.id}
                      className={`task-item p-3 bg-white border rounded mb-2 cursor-move transition-all relative
                        ${isOverBefore ? 'border-t-4 border-blue-500' : ''}
                        ${isOverAfter ? 'border-b-4 border-blue-500' : ''}`}
                      draggable
                      onDragStart={handleDragStart(task, section.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={e => handleDragOverTask(section.id, task.id)(e)}
                      onClick={() => {
                        setSelectedTask(task);
                        setIsModalOpen(true);
                      }}
                    >
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{task.title}</span>
                        <span className="text-xs text-gray-500">
                          {task.startDate && format(new Date(task.startDate), 'HH:mm')}
                        </span>
                      </div>

                      {task?.subTask?.length > 0 && (
                        
                        <div className="mt-2 space-y-1">
                          {task.subTask.map(st => (
                            <label key={st.id} className="flex items-center gap-2 text-xs" onClick={(e) => e.stopPropagation()}>
                              {/* <input
                                type="checkbox"
                                checked={st.status === 'DONE'}
                                onChange={() => toggleSubtask(section.id, task.id, st.id)}
                                className="w-3 h-3"
                              /> */}
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                                  ${st.status === 'DONE'
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-gray-400 bg-white'
                                  }`}
                                onClick={() => toggleSubtask(section.id, task.id, st.id)}
                              >
                                {st.status === 'DONE' && (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className={st.status === 'DONE' ? 'line-through' : ''}>
                                {st.text}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {task.priority}
                        </span>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            toggleTaskStatus(section.id, task.id);
                          }}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                            ${task.status === 'DONE' ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}
                        >
                          {task.status === 'DONE' && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}

        <div className="p-4 flex items-center justify-center">
          <Button variant="outline" onClick={handleAddSection}>
            + Add Section
          </Button>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        initialTask={selectedTask}
        sections={sections}
        projectId={selectedProjectId!}
        isPersonal={selectedProjectId === getPersonalProjectId()}
      />
    </main>
  );
}