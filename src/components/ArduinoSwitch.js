import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const ArduinoSwitch = ({ label, id }) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    socket.on('stateUpdated', (data) => {
      if (data.id === id) {
        setIsChecked(data.state === 1);
      }
    });

    fetch('http://localhost:5000/api/states')
      .then(response => response.json())
      .then(data => {
        const state = data.find(item => item._id === id);
        if (state) {
          setIsChecked(state.state === 1);
        }
      });

    return () => {
      socket.off('stateUpdated');
    };
  }, [id]);

  const toggleCheckbox = () => {
    const newState = isChecked ? 0 : 1;
    setIsChecked(!isChecked);
    const data = { id, state: newState };

    // Emit the state update via Socket.IO
    socket.emit('updateState', data);

    // Update the state via HTTP
    fetch(`http://localhost:5000/api/states/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h4 className="mb-2">{label}</h4>
      <label className="relative inline-block w-16 h-8">
        <input
          type="checkbox"
          className="opacity-0 w-0 h-0"
          checked={isChecked}
          onChange={toggleCheckbox}
          id={id}
        />
        <span className="slider block w-16 h-8 bg-gray-400 rounded-full cursor-pointer"></span>
        <span className={`slider-thumb block w-6 h-6 bg-white rounded-full absolute top-1 left-1 transition-transform ${isChecked ? 'transform translate-x-8' : ''}`}></span>
      </label>
    </div>
  );
};

export default ArduinoSwitch;
