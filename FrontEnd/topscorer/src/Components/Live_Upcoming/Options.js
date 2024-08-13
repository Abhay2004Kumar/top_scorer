import React from 'react'
import style from '../Live_Upcoming/Options.module.css'

function Options() {
  return (
    <>
        <div className={style.box}>
            <button className={style.live}>
                <p>Live</p>
                <div className={style.icon}></div>
            </button>
            <button className={style.upcoming}>
                <p>Upcoming</p>
            </button>
            <button className={style.archived}>
                <p>Archived</p>
            </button>
        </div>
    </>
  )
}

export default Options