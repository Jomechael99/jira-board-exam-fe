import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from "@/app/components/alert";

type Task = {
  uuid: string;
  description: string;
  status_id: number;
};

type TaskModalProps = {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (task: Task) => void;
};

const TaskModal = ({ task, isOpen, onClose, onUpdate }: TaskModalProps) => {
  const [statusId, setStatusId] = useState(task?.status_id || 1);
  const [description, setDescription] = useState(task?.description || '');
  const [alert, setAlert] = useState(false);
  const [isRequired, setIsRequired] = useState(false);

  useEffect(() => {
    if (task) {
      setStatusId(task.status.id);
      setDescription(task.description);
    }
  }, [task]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusId(Number(e.target.value));
  };

  const handleUpdate = async () => {
    if (task) {
      if (!description.trim()) {
        setIsRequired(true);
        return;
      }
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.put(apiUrl  + 'api/v1/task/' + task.uuid, {
          status_id: statusId,
          description: description
        });
        if (response.status === 200) {
          onUpdate({ ...task, status_id: statusId, description: description });
          onClose();
          window.location.reload()
        }
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  if (!isOpen || !task) return null;

  return (
    <dialog
      id="modal"
      className={`modal modal-bottom sm:modal-middle ${isOpen ? 'modal-open' : ''}`}
    >
      <div className="modal-box">
        <div className="flex item-center">
          <h5 className="text-lg font-bold place-items-center">Edit Task</h5>
        </div>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text text-lg font-bold">Description</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            className={`input input-bordered w-full max-w-xs ${isRequired ? 'input-error' : ''}`}
            required
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (e.target.value.trim()) {
                setIsRequired(false);
              }
            }}
          />
          <p
            className={`text-red-500 text-xs italic ${isRequired ? '' : 'hidden'} `}
          >
            Please input a description
          </p>
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text text-lg font-bold">Status</span>
          </div>
          <select
            defaultValue={task.status.id}
            onChange={handleStatusChange}
            className="select select-bordered w-full max-w-xs"
          >
            <option value={0} disabled>Please select option</option>
            <option value={1}>Backlog</option>
            <option value={2}>In progress</option>
            <option value={3}>Done</option>
          </select>
        </label>
        <div className="modal-action">
          <button className="btn btn-info" onClick={handleUpdate}>
            Update
          </button>
          <button
            className="btn"
            onClick={() => {
              setDescription(task.description);
              setStatusId(task.status_id);
              setIsRequired(false);
              setAlert(false);
              onClose();
            }}
          >
            Close
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-2 ">
          <Alert isHidden={alert} message="Successfully Updated" />
        </div>
      </div>
    </dialog>
  );
};

export default TaskModal;
