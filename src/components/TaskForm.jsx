import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color';

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(task);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: new Date(value) }));
  };

  const handleColorChange = (color) => {
    setFormData(prev => ({ ...prev, color: color.hex }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Task name"
      />
      <div className="flex space-x-2">
        <input
          type="date"
          name="start"
          value={formData.start.toISOString().split('T')[0]}
          onChange={handleDateChange}
          className="p-2 border rounded"
        />
        <input
          type="date"
          name="end"
          value={formData.end.toISOString().split('T')[0]}
          onChange={handleDateChange}
          className="p-2 border rounded"
        />
      </div>
      <input
        type="number"
        name="progress"
        value={formData.progress}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Progress (%)"
        min="0"
        max="100"
      />
      <div>
        <button
          type="button"
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-2 border rounded"
          style={{ backgroundColor: formData.color }}
        >
          {showColorPicker ? 'Close Color Picker' : 'Choose Color'}
        </button>
        {showColorPicker && (
          <ChromePicker
            color={formData.color}
            onChange={handleColorChange}
          />
        )}
      </div>
      <div className="flex space-x-2">
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Save</button>
        <button type="button" onClick={onCancel} className="p-2 bg-gray-300 rounded">Cancel</button>
      </div>
    </form>
  );
};

TaskForm.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
    progress: PropTypes.number.isRequired,
    color: PropTypes.string,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default TaskForm;