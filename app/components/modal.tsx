import { useState } from 'react';
import axios from 'axios';
import Alert from '@/app/components/alert';

const ButtonModal = ({
  isOpen,
  column,
  closeModal,
}: {
  isOpen: boolean;
  column: string;
  closeModal: () => void;
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [description, setDescription] = useState('');
  const [alert, setAlert] = useState(false);
  const [isRequired, setIsRequired] = useState(false);

  const columnToIdMap: { [key: string]: number } = {
    'Todo': 1,
    'Ready to do': 2,
    'In progress': 3,
    'Done': 4,
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!description.trim()) {
      setIsRequired(true);
      return;
    }
    try {
      const status_id = columnToIdMap[column];
      const response = await axios.post(apiUrl + `api/v1/task`, {
        description,
        status_id,
      });
      if (response.status === 201) {
        setDescription('');
        setAlert(true);
        setIsRequired(false);
        setTimeout(() => {
          setAlert(false);
          window.location.reload();
          closeModal();
        }, 500); // Display alert for 2 seconds before closing the modal
      }
    } catch (error) {
      setAlert(false);
      console.error('Error submitting form:', error);
    }
  };

  return (
    <dialog
      id="modal"
      className={`modal modal-bottom sm:modal-middle ${isOpen ? 'modal-open' : ''}`}
    >
      <div className="modal-box">
        <div className="flex item-center">
          <h5 className="text-lg font-bold place-items-center">Content</h5>
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
        <div className="modal-action">
          <button className="btn btn-info" onClick={handleSubmit}>
            Submit
          </button>
          <button
            className="btn"
            onClick={() => {
              setDescription('');
              setIsRequired(false);
              setAlert(false);
              closeModal();
            }}
          >
            Close
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-2 ">
          <Alert isHidden={alert} message="Successfully Inserted" />
        </div>
      </div>
    </dialog>
  );
};

export default ButtonModal;
