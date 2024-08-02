// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logout } from '../redux/authSlice';

const Dashboard = () => {
  const [charts, setCharts] = useState([]);
  const [newChartName, setNewChartName] = useState('');
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchCharts();
    }
  }, [token, navigate]);

  const fetchCharts = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/charts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCharts(response.data);
    } catch (error) {
      console.error('Error fetching charts:', error);
    }
  };

  const handleCreateChart = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/charts', 
        { name: newChartName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCharts([...charts, response.data]);
      setNewChartName('');
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.username}</h1>
      <button onClick={handleLogout}>Logout</button>

      <h2>Your Gantt Charts</h2>
      <ul>
        {charts.map(chart => (
          <li key={chart._id}>
            <a href={`/chart/${chart._id}`}>{chart.name}</a>
          </li>
        ))}
      </ul>

      <h3>Create New Chart</h3>
      <form onSubmit={handleCreateChart}>
        <input
          type="text"
          value={newChartName}
          onChange={(e) => setNewChartName(e.target.value)}
          placeholder="Enter chart name"
          required
        />
        <button type="submit">Create Chart</button>
      </form>
    </div>
  );
};

export default Dashboard;