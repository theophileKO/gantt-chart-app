import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentDate, setView, setTimelineRange } from '../store/uiSlice';
import TaskList from './TaskList';
import Timeline from './Timeline';
import ExportOptions from './ExportOptions';
import TaskForm from './TaskForm';
import { 
  addMonths, subMonths, startOfMonth, endOfMonth, addQuarters, subQuarters, startOfYear, endOfYear, addYears, subYears, addDays,
  max, min
} from 'date-fns';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { addTask } from '../store/tasksSlice';

const GanttChart = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks);
  const { currentDate, view } = useSelector(state => state.ui);
  const chartRef = useRef(null);
  const [timelineStart, setTimelineStart] = useState(startOfYear(currentDate));
  const [timelineEnd, setTimelineEnd] = useState(endOfYear(currentDate));
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [initialTaskDates, setInitialTaskDates] = useState({ start: new Date(), end: new Date() });
  const [highlightedDates, setHighlightedDates] = useState([]);

  useEffect(() => {
    if (tasks.length > 0) {
      const taskStartDates = tasks.map(task => new Date(task.start));
      const taskEndDates = tasks.map(task => new Date(task.end));
      const earliestDate = min(taskStartDates);
      const latestDate = max(taskEndDates);
      
      // Extend the timeline a bit to provide some padding
      const adjustedStart = startOfMonth(subMonths(earliestDate, 1));
      const adjustedEnd = endOfMonth(addMonths(latestDate, 1));
      setTimelineStart(adjustedStart);
      setTimelineEnd(adjustedEnd);
      
      dispatch(setTimelineRange({
        start: adjustedStart,
        end: adjustedEnd
      }));
    }
  }, [tasks, dispatch]);

  const handleNavigateTimeline = (direction) => {
    let newStart, newEnd;
    if (view === 'year') {
      newStart = direction === 'forward' ? addYears(timelineStart, 1) : subYears(timelineStart, 1);
      newEnd = endOfYear(newStart);
    } else if (view === 'quarter') {
      newStart = direction === 'forward' ? addQuarters(timelineStart, 1) : subQuarters(timelineStart, 1);
      newEnd = addQuarters(newStart, 1);
    } else if (view === 'month') {
      newStart = direction === 'forward' ? addMonths(timelineStart, 1) : subMonths(timelineStart, 1);
      newEnd = endOfMonth(newStart);
    }
    setTimelineStart(newStart);
    setTimelineEnd(newEnd);
    dispatch(setCurrentDate(newStart));
  };

  const handleViewChange = (newView) => {
    dispatch(setView(newView));
    let newStart, newEnd;
    if (newView === 'year') {
      newStart = startOfYear(currentDate);
      newEnd = endOfYear(newStart);
    } else if (newView === 'quarter') {
      newStart = startOfYear(currentDate);
      newEnd = addQuarters(newStart, 1);
    } else if (newView === 'month') {
      newStart = startOfYear(currentDate);
      newEnd = addMonths(newStart, 11);
    }
    setTimelineStart(newStart);
    setTimelineEnd(newEnd);
  };

  const handleZoom = (direction) => {
    if (direction === 'in') {
      if (view === 'year') dispatch(setView('quarter'));
      else if (view === 'quarter') dispatch(setView('month'));
    } else {
      if (view === 'month') dispatch(setView('quarter'));
      else if (view === 'quarter') dispatch(setView('year'));
    }
  };

  const handleAddTask = (task) => {
    dispatch(addTask(task));
    setShowTaskForm(false);
  };

  const handleTimelineClick = (date) => {
    setInitialTaskDates({ start: date, end: addDays(date, 7) }); // Default to a 1-week task duration
    setShowTaskForm(true);
    setHighlightedDates([date, addDays(date, 7)]);
  };

  return (
    <div id="gantt-chart" className="gantt-chart p-6 bg-white rounded-lg shadow-lg" ref={chartRef}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Gantt Chart</h1>
        <ExportOptions chartRef={chartRef} />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => handleNavigateTimeline('backward')}
          className="p-2 rounded-full hover:bg-gray-200 transition duration-150"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold">
            {timelineStart.toLocaleString('default', { month: 'short', year: 'numeric' })} - 
            {timelineEnd.toLocaleString('default', { month: 'short', year: 'numeric' })}
          </span>
          <select 
            value={view} 
            onChange={(e) => handleViewChange(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="month">Month</option>
            <option value="quarter">Quarter</option>
            <option value="year">Year</option>
          </select>
        </div>
        <button 
          onClick={() => handleNavigateTimeline('forward')}
          className="p-2 rounded-full hover:bg-gray-200 transition duration-150"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex justify-end mb-2">
        <button onClick={() => handleZoom('in')} className="mr-2 p-1 rounded hover:bg-gray-200">
          <ZoomIn size={20} />
        </button>
        <button onClick={() => handleZoom('out')} className="p-1 rounded hover:bg-gray-200">
          <ZoomOut size={20} />
        </button>
      </div>

      {showTaskForm && (
        <div className="mb-4">
          <TaskForm 
            task={{ id: null, name: '', start: initialTaskDates.start, end: initialTaskDates.end, progress: 0, color: '#3498db', parentId: null }}
            onSubmit={handleAddTask}
            onCancel={() => setShowTaskForm(false)}
          />
        </div>
      )}
      
      <div className="flex">
        <TaskList tasks={tasks} />
        <Timeline
          tasks={tasks}
          start={timelineStart}
          end={timelineEnd}
          currentDate={currentDate}
          view={view}
          onTimelineClick={handleTimelineClick}
          highlightedDates={highlightedDates}
        />
      </div>
    </div>
  );
};

export default GanttChart;
