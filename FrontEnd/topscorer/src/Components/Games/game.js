import React from 'react'
import style from '../Games/game.module.css'
import { BiSolidCricketBall } from "react-icons/bi";

function Game() {
  return (
    <>
        <div className={style.option}>
        <BiSolidCricketBall style={{float:"left",marginRight:"3px "}}/>
            <b>Cricket</b>
        </div>
    </>
  )
}

export default Game