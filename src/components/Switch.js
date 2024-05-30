import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://arduino-backend-127beb836b8c.herokuapp.com', { // Replace with your local IP address
  transports: ['websocket', 'polling', 'flashsocket']
});

const Switch = ({ label, id }) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    socket.on('stateUpdated', (data) => {
      if (data.id === id) {
        setIsChecked(data.state === 1);
      }
    });

    fetch('https://arduino-backend-127beb836b8c.herokuapp.com/api/states') // Replace with your local IP address
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
    fetch(`https://arduino-backend-127beb836b8c.herokuapp.com/api/states/${id}`, { // Replace with your local IP address
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <h4 className="mb-2 text-lg">{label}</h4>
      <label className="relative inline-block w-16 h-8">
        <input
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={toggleCheckbox}
          id={id}
        />
        <div className={`block w-16 h-8 rounded-full cursor-pointer transition-colors duration-300 ${isChecked ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        <div className={`dot absolute w-6 h-6 bg-white rounded-full transition-transform duration-300 top-1 ${isChecked ? 'transform translate-x-8' : ''}`}></div>
      </label>
    </div>
  );
};

export default Switch;