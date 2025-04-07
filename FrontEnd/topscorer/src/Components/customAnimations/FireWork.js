import React from "react";
import { Fireworks } from "@fireworks-js/react";

const FireworksComponent = () => {
  const options = {
    opacity: 0.5,
    sound: {
      enabled: true,
      volume: {
        min: 0.5,
        max: 10,
      },
      files: ["/sounds/explosive.mp3"], // Path to your sound file
    },
  };

  const style = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 10,
    pointerEvents: "none", // So it doesn't block clicks
  };

  return (
    <>
      <Fireworks options={options} style={style} />
    </>
  );
};

export default FireworksComponent;
