import React from 'react';
import { Fireworks } from '@fireworks-js/react';

const FireworksComponent = () => {
  const options = {
    opacity: 0.5,   // Transparency of fireworks
    // sound: {
    //   enabled: true,      // Enable sound
    //   files: [            // Optional: custom sound files
    //     'https://fireworks.js.org/sounds/explosion0.mp3',
    //     'https://fireworks.js.org/sounds/explosion1.mp3',
    //     'https://fireworks.js.org/sounds/explosion2.mp3'
    //   ],
    //   volume: 1,          // Volume level from 0 to 1
    // },
  };

  const style = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '150vh',
    zIndex: 10,
  };

  return <Fireworks options={options} style={style} />;
};

export default FireworksComponent;
