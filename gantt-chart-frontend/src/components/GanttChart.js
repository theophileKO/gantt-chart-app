// src/components/GanttChart.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const GanttChart = () => {
  const [chart, setChart] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', startDate: '', endDate: '' });
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchChart();
  }, [id, token]);

  const fetchChart = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/charts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChart(response.data);
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Error fetching chart:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5001/api/charts/${id}/tasks`,
        newTask,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, response.data]);
      setNewTask({ name: '', startDate: '', endDate: '' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  if (!chart) return <div>Loading...</div>;

  return (
    <div className="gantt-chart">
      <h1>{chart.name}</h1>
      <div className="tasks">
        {tasks.map(task => (
          <div key={task._id} className="task">
            <span>{task.name}</span>
            <span>{new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          placeholder="Task name"
          required
        />
        <input
          type="date"
          value={newTask.startDate}
          onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
          required
        />
        <input
          type="date"
          value={newTask.endDate}
          onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
          required
        />
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default GanttChart;