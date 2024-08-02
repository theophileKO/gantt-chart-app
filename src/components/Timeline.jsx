import React from 'react';
import PropTypes from 'prop-types';
import { eachMonthOfInterval, eachQuarterOfInterval, eachYearOfInterval, format, isSameMonth, isSameQuarter, isSameYear, differenceInDays, startOfYear, endOfYear } from 'date-fns';

const Timeline = ({ tasks, start, end, currentDate, view }) => {
  const getIntervals = () => {
    const adjustedStart = startOfYear(start);
    const adjustedEnd = endOfYear(end);
    switch(view) {
      case 'month':
        return eachMonthOfInterval({ start: adjustedStart, end: adjustedEnd });
      case 'quarter':
        return eachQuarterOfInterval({ start: adjustedStart, end: adjustedEnd });
      case 'year':
        return eachYearOfInterval({ start: adjustedStart, end: adjustedEnd });
      default:
        return eachMonthOfInterval({ start: adjustedStart, end: adjustedEnd });
    }
  };

  const intervals = getIntervals();

  const getTaskPosition = (task) => {
    const totalDays = differenceInDays(endOfYear(end), startOfYear(start));
    const startDiff = differenceInDays(task.start, startOfYear(start));
    const taskDuration = differenceInDays(task.end, task.start) + 1;
    
    const left = (startDiff / totalDays) * 100;
    const width = (taskDuration / totalDays) * 100;

    return { left: `${left}%`, width: `${width}%` };
  };

  const renderTimelineHeader = () => {
    return intervals.map((interval, index) => (
      <div 
        key={interval.toISOString()} 
        className={`timeline-header-cell text-center text-sm py-2 ${
          (view === 'month' && isSameMonth(interval, currentDate)) ||
          (view === 'quarter' && isSameQuarter(interval, currentDate)) ||
          (view === 'year' && isSameYear(interval, currentDate))
            ? 'bg-blue-100'
            : ''
        }`}
        style={{ width: `${100 / intervals.length}%` }}
      >
        {format(interval, view === 'month' ? 'MMM yyyy' : view === 'quarter' ? "'Q'Q yyyy" : 'yyyy')}
      </div>
    ));
  };

  const renderTask = (task, depth = 0) => (
    <React.Fragment key={task.id}>
      <div
        className="task-timeline-bar absolute rounded"
        style={{
          ...getTaskPosition(task),
          top: `${depth * 40 + 30}px`,
          height: '30px',
          backgroundColor: task.color || '#3498db',
        }}
      >
        <div className="task-label text-xs text-white p-1 truncate">
          {task.name} ({task.progress}%)
        </div>
      </div>
      {task.subtasks && task.subtasks.map(subtask => renderTask(subtask, depth + 1))}
    </React.Fragment>
  );

  return (
    <div className="timeline flex-grow overflow-x-auto">
      <div className="timeline-header flex sticky top-0 bg-white z-10">
        {renderTimelineHeader()}
      </div>
      <div className="timeline-body relative" style={{ minHeight: `${tasks.length * 40 + 50}px` }}>
        {tasks.map(task => renderTask(task))}
      </div>
    </div>
  );
};

Timeline.propTypes = {
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
  })).isRequired,
  start: PropTypes.instanceOf(Date).isRequired,
  end: PropTypes.instanceOf(Date).isRequired,
  currentDate: PropTypes.instanceOf(Date).isRequired,
  view: PropTypes.oneOf(['month', 'quarter', 'year']).isRequired
};

export default Timeline;