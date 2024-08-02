import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setZoomLevel } from '../store/uiSlice';

const TimelineSlider = () => {
  const zoomLevel = useSelector(state => state.ui.zoomLevel);
  const dispatch = useDispatch();

  const handleZoomChange = (e) => {
    dispatch(setZoomLevel(parseFloat(e.target.value)));
  };

  return (
    <div className="timeline-slider mb-4">
      <input
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        value={zoomLevel}
        onChange={handleZoomChange}
        className="w-full"
      />
      <div className="text-center">Zoom: {zoomLevel.toFixed(1)}x</div>
    </div>
  );
};

export default TimelineSlider;