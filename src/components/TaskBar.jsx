import React from 'react';
import PropTypes from 'prop-types';
import { formatDistanceStrict } from 'date-fns';

const TaskBar = ({ task }) => {
  const duration = formatDistanceStrict(task.start, task.end);

  return (
    <div className="task-bar relative bg-blue-500 text-white text-xs p-1 rounded overflow-hidden h-full">
      <div 
        className="task-progress absolute top-0 left-0 bottom-0 bg-blue-700"
        style={{ width: `${task.progress}%` }}
      />
      <div className="relative z-10 flex justify-between items-center h-full">
        <span className="truncate mr-1">{task.name}</span>
        <span className="whitespace-nowrap">{duration}</span>
      </div>
    </div>
  );
};

TaskBar.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
    progress: PropTypes.number.isRequired,
    color: PropTypes.string
  }).isRequired
};

export default TaskBar;