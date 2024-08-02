import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentDate, setView, setTimelineRange } from '../store/uiSlice';
import TaskList from './TaskList';
import Timeline from './Timeline';
import ExportOptions from './ExportOptions';
import { 
  addMonths, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval,
  addDays, addWeeks, startOfDay, endOfDay, addQuarters, startOfYear, endOfYear
} from 'date-fns';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

const GanttChart = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks);
  const { currentDate, view } = useSelector(state => state.ui);
  const chartRef = useRef(null);
  const [timelineStart, setTimelineStart] = useState(startOfYear(currentDate));
  const [timelineEnd, setTimelineEnd] = useState(endOfYear(currentDate));

  useEffect(() => {
    if (tasks.length > 0) {
      const taskStartDates = tasks.map(task => new Date(task.start));
      const taskEndDates = tasks.map(task => new Date(task.end));
      const earliestDate = new Date(Math.min(...taskStartDates));
      const latestDate = new Date(Math.max(...taskEndDates));
      setTimelineStart(startOfDay(earliestDate));
      setTimelineEnd(endOfDay(latestDate));
    }
  }, [tasks]);

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
      newEnd = addMonths(newStart, 11);
    }
    setTimelineStart(newStart);
    setTimelineEnd(newEnd);
    dispatch(setCurrentDate(newStart));
  };

  const handleViewChange = (newView) => {
    dispatch(setView(newView));
    let newStart = startOfYear(currentDate);
    let newEnd;
    if (newView === 'year') {
      newEnd = endOfYear(newStart);
    } else if (newView === 'quarter') {
      newEnd = addQuarters(newStart, 1);
    } else if (newView === 'month') {
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

  return (
    <div id="gantt-chart" className="gantt-chart p-6 bg-white rounded-lg shadow-lg" ref={chartRef}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Gantt Chart</h1>
        <ExportOptions chartRef={chartRef} />
      </div>
      
      <div className="flex items-center justify-between mb-4">
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
      
      <div className="flex">
        <TaskList tasks={tasks} />
        <Timeline
          tasks={tasks}
          start={timelineStart}
          end={timelineEnd}
          currentDate={currentDate}
          view={view}
        />
      </div>
    </div>
  );
};

export default GanttChart;