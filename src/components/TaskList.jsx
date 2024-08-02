import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { ChevronRight, ChevronDown, Plus, Edit, Trash } from 'lucide-react';
import { toggleTaskCollapse, addTask, updateTask, deleteTask } from '../store/tasksSlice';
import TaskForm from './TaskForm';

const TaskList = ({ tasks }) => {
  const dispatch = useDispatch();
  const [editingTaskId, setEditingTaskId] = useState(null);

  const handleAddTask = (parentId = null) => {
    const newTask = {
      id: Date.now(),
      name: 'New Task',
      start: new Date(),
      end: new Date(new Date().setDate(new Date().getDate() + 7)),
      progress: 0,
      parentId,
      collapsed: false,
      color: '#3498db',
    };
    dispatch(addTask(newTask));
    setEditingTaskId(newTask.id);
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
  };

  const handleUpdateTask = (updatedTask) => {
    dispatch(updateTask(updatedTask));
    setEditingTaskId(null);
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId));
  };

  const renderTask = (task, depth = 0) => (
    <div key={task.id} className="task-item mb-2" style={{ paddingLeft: `${depth * 20}px` }}>
      {editingTaskId === task.id ? (
        <TaskForm task={task} onSubmit={handleUpdateTask} onCancel={() => setEditingTaskId(null)} />
      ) : (
        <div className="flex items-center">
          {task.subtasks && task.subtasks.length > 0 && (
            <button 
              onClick={() => dispatch(toggleTaskCollapse(task.id))} 
              className="mr-2"
            >
              {task.collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
          <div className="flex-grow">{task.name}</div>
          <div className="flex items-center">
            <button onClick={() => handleEditTask(task)} className="mr-2">
              <Edit size={16} />
            </button>
            <button onClick={() => handleDeleteTask(task.id)} className="mr-2">
              <Trash size={16} />
            </button>
            <button onClick={() => handleAddTask(task.id)}>
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}
      {!task.collapsed && task.subtasks && (
        <div className="ml-4 mt-2">
          {task.subtasks.map(subtask => renderTask(subtask, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="task-list w-1/3 pr-4 overflow-y-auto" style={{ maxHeight: '600px' }}>
      <button
        onClick={() => handleAddTask()}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded flex items-center"
      >
        <Plus size={16} className="mr-2" /> Add Task
      </button>
      {tasks.map(task => renderTask(task))}
    </div>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
    progress: PropTypes.number.isRequired,
    color: PropTypes.string,
    parentId: PropTypes.number,
    collapsed: PropTypes.bool,
    subtasks: PropTypes.array
  })).isRequired
};

export default TaskList;