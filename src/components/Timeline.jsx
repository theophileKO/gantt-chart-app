// src/components/Timeline.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { eachMonthOfInterval, eachQuarterOfInterval, eachYearOfInterval, format, isSameMonth, isSameQuarter, isSameYear, differenceInDays, startOfYear, endOfYear, addDays } from 'date-fns';

const Timeline = ({ tasks, start, end, currentDate, view, onTimelineClick, highlightedDates }) => {
  const getIntervals = () => {
    switch(view) {
      case 'month':
        return eachMonthOfInterval({ start, end });
      case 'quarter':
        return eachQuarterOfInterval({ start, end });
      case 'year':
        return eachYearOfInterval({ start, end });
      default:
        return eachMonthOfInterval({ start, end });
    }
  };

  const intervals = getIntervals();

  const getTaskPosition = (task) => {
    const totalDays = differenceInDays(end, start) + 1;
    const taskStart = new Date(task.start);
    const taskEnd = new Date(task.end);

    // Ensure task dates are within the timeline range
    const adjustedTaskStart = taskStart < start ? start : taskStart;
    const adjustedTaskEnd = taskEnd > end ? end : taskEnd;

    const startDiff = differenceInDays(adjustedTaskStart, start);
    const taskDuration = differenceInDays(adjustedTaskEnd, adjustedTaskStart) + 1;

    const left = (startDiff / totalDays) * 100;
    const width = (taskDuration / totalDays) * 100;

    return { left: `${left}%`, width: `${width}%` };
  };

  const handleTimelineClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const totalDays = differenceInDays(end, start);
    const clickDate = addDays(start, Math.floor(clickX / rect.width * totalDays));

    onTimelineClick(clickDate);
  };

  const renderTimelineHeader = () => {
    return intervals.map((interval, index) => {
      const isHighlighted = highlightedDates.some(date => isSameMonth(date, interval) || isSameQuarter(date, interval) || isSameYear(date, interval));
      return (
        <div 
          key={interval.toISOString()} 
          className={`timeline-header-cell text-center text-sm py-2 ${isHighlighted ? 'bg-blue-100' : ''}`}
          style={{ width: `${100 / intervals.length}%` }}
        >
          {format(interval, view === 'month' ? 'MMM yyyy' : view === 'quarter' ? "'Q'Q yyyy" : 'yyyy')}
        </div>
      );
    });
  };

  const renderTask = (task, depth = 0) => (
    <div key={task.id} className="task-row" style={{ paddingLeft: `${depth * 20}px` }}>
      <div className="task-label">{task.name}</div>
      <div
        className="task-timeline-bar rounded"
        style={{
          ...getTaskPosition(task),
          height: '24px',
          backgroundColor: task.color || '#3498db',
        }}
      >
        <div className="task-label text-xs text-white p-1 truncate">
          {task.name}
        </div>
      </div>
      {task.subtasks && !task.collapsed && task.subtasks.map(subtask => renderTask(subtask, depth + 1))}
    </div>
  );

  return (
    <div className="timeline flex-grow overflow-x-auto" onClick={handleTimelineClick}>
      <div className="timeline-header flex sticky top-0 bg-white z-10">
        {renderTimelineHeader()}
      </div>
      <div className="timeline-body relative">
        {tasks.map(task => renderTask(task))}
      </div>
    </div>
  );
};

Timeline.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    color: PropTypes.string,
    parentId: PropTypes.number,
    collapsed: PropTypes.bool,
    subtasks: PropTypes.array
  })).isRequired,
  start: PropTypes.instanceOf(Date).isRequired,
  end: PropTypes.instanceOf(Date).isRequired,
  currentDate: PropTypes.instanceOf(Date).isRequired,
  view: PropTypes.oneOf(['month', 'quarter', 'year']).isRequired,
  onTimelineClick: PropTypes.func.isRequired,
  highlightedDates: PropTypes.arrayOf(PropTypes.instanceOf(Date))
};

Timeline.defaultProps = {
  highlightedDates: [],
};

export default Timeline;
