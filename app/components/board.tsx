'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Button from '@/app/components/button';
import ButtonModal from '@/app/components/modal';
import TaskCard from '@/app/components/card';
import axios from 'axios';

type Task = {
  uuid: string;
  description: string;
  status_id: number;
};

type TasksByStatus = {
  [key: string]: Task[];
  Todo: Task[];
  'Ready to do': Task[];
  'In progress': Task[];
  Done: Task[];
};

const ItemTypes = {
  TASK: 'task',
};

const Board = () => {
  const [tasks, setTasks] = useState<TasksByStatus>({
    Todo: [],
    'Ready to do': [],
    'In progress': [],
    Done: [],
  });

  const url = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url + 'api/v1/task');
        const tasksByStatus: TasksByStatus = {
          Todo: [],
          'Ready to do': [],
          'In progress': [],
          Done: [],
        };

        Object.values(response.data.data).forEach((task: any) => {
          if (task.status.id === 1) {
            tasksByStatus['Todo'].push(task);
          } else if (task.status.id === 2) {
            tasksByStatus['Ready to do'].push(task);
          } else if (task.status.id === 3) {
            tasksByStatus['In progress'].push(task);
          } else if (task.status.id === 4) {
            tasksByStatus['Done'].push(task);
          }
        });
        setTasks(tasksByStatus);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [url]);

  const [modalData, setModalData] = useState({
    isOpen: false,
    column: '',
  });

  const openModal = useCallback((column: string) => {
    setModalData({
      isOpen: true,
      column,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalData({
      isOpen: false,
      column: '',
    });
  }, []);

  const moveTask = useCallback(
    async (task: Task, newStatusId: number) => {
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        const oldColumn = Object.keys(updatedTasks).find((key) =>
          updatedTasks[key].some((t) => t.uuid === task.uuid)
        );
        const newColumn = Object.keys(updatedTasks).find(
          (key) => updatedTasks[key][0]?.status_id === newStatusId
        );

        if (oldColumn && newColumn) {
          updatedTasks[oldColumn] = updatedTasks[oldColumn].filter(
            (t) => t.uuid !== task.uuid
          );
          updatedTasks[newColumn].push({ ...task, status_id: newStatusId });
        }

        return updatedTasks;
      });

      try {
        const response = await axios.put(url + `api/v1/task/${task.uuid}`, {
          status_id: newStatusId,
        });
        if (response.status === 200) {
          window.location.reload();
        }
      } catch (error: any) {
        console.error(
          'Error updating task:',
          error.response ? error.response.data : error.message
        );
      }
    },
    [url]
  );

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      const oldColumn = Object.keys(updatedTasks).find((key) =>
        updatedTasks[key].some((t) => t.uuid === updatedTask.uuid)
      );
      const newColumn = Object.keys(updatedTasks).find(
        (key) => updatedTasks[key][0]?.status_id === updatedTask.status_id
      );

      if (oldColumn && newColumn) {
        updatedTasks[oldColumn] = updatedTasks[oldColumn].filter(
          (t) => t.uuid !== updatedTask.uuid
        );
        updatedTasks[newColumn].push(updatedTask);
      }

      return updatedTasks;
    });
  };

  const columns = useMemo(() => Object.keys(tasks), [tasks]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen p-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row space">
            {columns.map((column) => (
              <div key={column} className="flex-1">
                <h2 className="text-xl font-semibold">
                  {column.replace('-', ' ')}
                </h2>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            {columns.map((column) => (
              <Button
                key={column}
                column={column}
                openModal={() => openModal(column)}
              />
            ))}
          </div>
          <ButtonModal
            isOpen={modalData.isOpen}
            column={modalData.column}
            closeModal={closeModal}
          />
          <div className="my-1 border-t border-gray-300"></div>
          <div className="flex flex-col md:flex-row gap-2">
            {columns.map((column) => (
              <Column
                key={column}
                column={column}
                tasks={tasks[column]}
                moveTask={moveTask}
                onUpdate={handleTaskUpdate}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

const Column = ({
  column,
  tasks,
  moveTask,
  onUpdate,
}: {
  column: string;
  tasks: Task[];
  moveTask: (task: Task, newStatusId: number) => void;
  onUpdate: (task: Task) => void;
}) => {
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item: Task) => moveTask(item, columnToIdMap[column]),
  });

  // @ts-ignore
  return (
    <div ref={drop} className="flex-1 bg-gray-200 p-4 rounded-lg shadow">
      <ul id="todo-list" className="min-h-[200px] space-y-2">
        {tasks.map((task: Task) => (
          <TaskCard key={task.uuid} task={task} onUpdate={onUpdate} />
        ))}
      </ul>
    </div>
  );
};

const columnToIdMap: { [key: string]: number } = {
  Todo: 1,
  'Ready to do': 2,
  'In progress': 3,
  Done: 4,
};

export default Board;
