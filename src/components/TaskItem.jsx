import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { ChevronDown, ChevronRight, Edit, Trash } from 'lucide-react';
import { updateTask, deleteTask } from '../store/tasksSlice';
import TaskForm from './TaskForm';

const TaskItem = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();

  const handleToggleExpand = () => setIsExpanded(!isExpanded);

  const handleEdit = () => setIsEditing(true);

  const handleDelete = () => dispatch(deleteTask(task.id));

  const handleUpdate = (updatedTask) => {
    dispatch(updateTask(updatedTask));
    setIsEditing(false);
  };

  if (isEditing) {
    return <TaskForm task={task} onSubmit={handleUpdate} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <div className="task-item mb-2">
      <div className="flex items-center">
        {task.subtasks.length > 0 && (
          <button onClick={handleToggleExpand} className="mr-2">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
        <div className="flex-grow">{task.name}</div>
        <button onClick={handleEdit} className="mr-2 text-blue-500">
          <Edit size={16} />
        </button>
        <button onClick={handleDelete} className="text-red-500">
          <Trash size={16} />
        </button>
      </div>
      {isExpanded && task.subtasks.length > 0 && (
        <div className="ml-4 mt-2">
          {task.subtasks.map(subtask => (
            <TaskItem key={subtask.id} task={subtask} />
          ))}
        </div>
      )}
    </div>
  );
};

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
    color: PropTypes.string.isRequired,
    subtasks: PropTypes.array.isRequired,
  }).isRequired,
};

export default TaskItem;