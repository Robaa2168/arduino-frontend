import React, { useEffect, useState } from 'react';
import Switch from './Switch';

const Home = () => {
  const [switches, setSwitches] = useState([]);

  useEffect(() => {
    fetch('https://arduino-backend-127beb836b8c.herokuapp.com/api/states')
      .then(response => response.json())
      .then(data => setSwitches(data));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Arduino Switches</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {switches.map((switchState) => (
          <Switch
            key={switchState._id}
            id={switchState._id}
            label={`Relay - ${switchState.value}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
