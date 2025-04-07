import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export const Carousal1 = () => {
  return (
    <Carousel autoPlay="true" infiniteLoop="true">
    <div>
        <img src="https://img.freepik.com/free-photo/sports-tools_53876-138077.jpg" />
        <p className="legend">Legend 1</p>
    </div>
    <div>
        <img src="https://wallpaper.dog/large/989824.jpg" />
        <p className="legend">Legend 2</p>
    </div>
    <div>
        <img src="https://images.unsplash.com/photo-1721760886982-3c643f05813d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGJhZG1pbnRvbnxlbnwwfHwwfHx8MA%3D%3D" />
        <p className="legend">Legend 3</p>
    </div>
    </Carousel>
  )
}
