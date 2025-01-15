import React , {useState} from 'react';
import { useDrag } from 'react-dnd';
import axios from 'axios';
import TaskModal from "@/app/components/taskmodal";

const ItemTypes = {
  TASK: 'task',
};

const TaskCard = ({ task }: { task: Task }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);


  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: task,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const deleteButton = async (uuid: string) => {
    console.log(uuid);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.delete(apiUrl + 'api/v1/task/' + uuid);
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const displayTaskModal = () => {
    setIsModalOpen(true)
    console.log(isModalOpen)
  }

  const handleUpdate = (updatedTask: Task) => {
  };


  return (
    <div
      ref={drag}
      className={`card bg-white shadow-md rounded-lg p-4 ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">{task.description}</h3>
        <button
          className="bg-blue-500 text-white py-1 px-3 rounded"
          onClick={() => displayTaskModal()}
        >
          Edit
        </button>

        <button
          className="bg-blue-500 text-white py-1 px-3 rounded"
          onClick={() => deleteButton(task.uuid)}
        >
          Delete
        </button>
      </div>
      <TaskModal task={task} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUpdate={handleUpdate} />
    </div>
  );
};

export default TaskCard;
