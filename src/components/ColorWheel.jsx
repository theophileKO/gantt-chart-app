// src/components/ColorWheel.jsx
import React from 'react';
import { ChromePicker } from 'react-color';
import { useDispatch } from 'react-redux';
import { setDefaultTaskColor } from '../store/uiSlice';

const ColorWheel = ({ onClose }) => {
  const dispatch = useDispatch();

  const handleColorChange = (color) => {
    dispatch(setDefaultTaskColor(color.hex));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg">
        <ChromePicker onChange={handleColorChange} />
        <button 
          onClick={onClose}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ColorWheel;
