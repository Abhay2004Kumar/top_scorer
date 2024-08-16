import React, { useEffect, useState } from 'react'
import style from '../Cricket/cricket.module.css'
import Horizontal from '../../Components/HorizontalGameopt/horizontal'
import Options from '../../Components/Live_Upcoming/Options'


function Cricket() {
    return (
        
        <>
     

        <div className={style.maindiv}>
         <Options/>
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
            {/* predictor box and current over */}
            <div className={style.predictorbox}>
                <div className={style.predic}>
                    <div className={style.win}></div>
                </div>
                <div className={style.currover}>
                    <div className={style.thisover}>
                        <div className={style.ball}></div>
                        <div className={style.ball}></div>
                        <div className={style.ball}></div>
                        <div className={style.ball}></div>
                        <div className={style.ball}></div>
                        <div className={style.ball}></div>
                    </div>
                    <div className={style.status}>
                        <p>Last Over 14 Runs 1 Wicket</p>
                    </div>
                </div>
            </div>
            {/* scorebox  */}
            <div className={style.scorebox}>
                <div className={style.scoretxt}>
                    <h3>Score Card</h3>
                </div>
                <div className={style.teamopt}>
                    <button>Australia</button>
                    <button>New Zealand</button>
                </div>
                <div className={style.performance}>
                <div class="table-container">
        <table class="live-match-table">
            <thead>
                <tr>
                    <th className={style.batman}>Batsman</th>
                    <th>R</th>
                    <th>B</th>
                    <th>4s</th>
                    <th>6s</th>
                    <th>S/R</th>
                </tr>
            </thead>
                    
            <tbody>
                <tr>
                    <td>Rohit Sharma</td>
                    <td>45</td>
                    <td>30</td>
                    <td>5</td>
                    <td>2</td>
                    <td>150.00</td>
                </tr>
                <tr style={{width:"100px"}}>

                </tr>
                <tr>
                    <td>Player 2</td>
                    <td>35</td>
                    <td>25</td>
                    <td>3</td>
                    <td>1</td>
                    <td>140.00</td>
                </tr>
                <tr>
                    <td>Player 3</td>
                    <td>50</td>
                    <td>32</td>
                    <td>7</td>
                    <td>3</td>
                    <td>156.25</td>
                </tr>
            
            </tbody>
        </table>
    </div>
                </div>
            </div>
            <div className={style.scorebox}>
                
                <div className={style.performance}>
                <div class="table-container">
        <table class="live-match-table">
            <thead>
                <tr>
                    <th className={style.batman}>Bowling</th>
                    <th>O</th>
                    <th>M</th>
                    <th>R</th>
                    <th>W</th>
                    <th>Econ</th>
                </tr>
            </thead>
                    
            <tbody>
                <tr>
                    <td>Rohit Sharma</td>
                    <td>45</td>
                    <td>30</td>
                    <td>5</td>
                    <td>2</td>
                    <td>150.00</td>
                </tr>
                <tr style={{width:"100px"}}>

                </tr>
                <tr>
                    <td>Player 2</td>
                    <td>35</td>
                    <td>25</td>
                    <td>3</td>
                    <td>1</td>
                    <td>140.00</td>
                </tr>
                <tr>
                    <td>Player 3</td>
                    <td>50</td>
                    <td>32</td>
                    <td>7</td>
                    <td>3</td>
                    <td>156.25</td>
                </tr>
            
            </tbody>
        </table>
    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Cricket