import React from 'react'
import style from '../Cricket/cricket.module.css'

function Cricket() {
  return (
    <>
        <div className={style.maindiv}>
            <div className={style.teamslogo}>
                <div className={style.tone}>
                    <div className={style.img1}>
                        <img src='https://imgeng.jagran.com/images/2023/nov/Rohit-Sharma-profile1700142481090.jpg'></img>
                    </div>
                    <div className={style.score}>
                        <p>234/5 </p>  
                        <p className={style.over}>20.1</p>
                    </div>
                </div>
                <div className={style.ttwo}>
                    <div className={style.img2}>
                        <img src='https://admin.thecricketer.com/weblab/Sites/96c8b790-b593-bfda-0ba4-ecd3a9fdefc2/resources/images/site/kanewilliamsonheadshot-min.jpg'></img>
                    </div>
                    <div className={style.score}>
                        <p>234/5</p>   
                        <p className={style.over}>22.3</p>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Cricket