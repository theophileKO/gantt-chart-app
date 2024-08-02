import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import TaskForm from './TaskForm';
import { addTask } from '../store/tasksSlice';

const AddTaskButton = () => {
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();

  const handleAddTask = (task) => {
    dispatch(addTask(task));
    setShowForm(false);
  };

  return (
    <div>
      <button onClick={() => setShowForm(true)} className="p-2 bg-blue-500 text-white rounded">
        Add Task
      </button>
      {showForm && (
        <div className="modal">
          <TaskForm 
            task={{ id: null, name: '', start: new Date(), end: new Date(), progress: 0, color: '#3498db', parentId: null }}
            onSubmit={handleAddTask}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default AddTaskButton;
