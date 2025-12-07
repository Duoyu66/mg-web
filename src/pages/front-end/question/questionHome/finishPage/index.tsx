import styles from './index.module.css'
import AcIcon from './img/ac.png'
import RageIcon from './img/rate.png'
import TimeIcon from './img/time.png'
import ScoreIcon from "./img/scoreBottom.svg";
import LineIcon from "./img/line.svg";
import {Button} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import {InfoCircleOutlined} from "@ant-design/icons";
import {useState} from "react";

const FinishPage = () => {
    const location = useLocation()
    const nav = useNavigate()
    const data = {
        score: 99,
        acNum: 30,
        allNum: 50,
        time: 5252,

    }
    const [result,setResult] = useState({
        score:location.state.score,
        acNum: location.state.acNum,
        allNum: location.state.allNum,
        time: location.state.time,
        ranking:location.state.ranking
    })

    const  formatTime=(seconds:number)=> {
        // 计算分钟和秒数
        const minutes = Math.floor(seconds / 60); // 获取分钟数
        const remainingSeconds = seconds % 60; // 获取剩余的秒数

        // 补全为两位数
        const formattedMinutes = String(minutes).padStart(2, '0'); // 分钟补零
        const formattedSeconds = String(remainingSeconds).padStart(2, '0'); // 秒数补零

        // 返回格式化后的时间
        return [formattedMinutes,formattedSeconds];
    }

    return <div className={styles['main-box']}>
        <div className={styles['content']}>
            <div className={styles['topScoreStyle']}>
                <span className={styles['myScore']}> {result.score}分</span>
                <img src={LineIcon} alt="line"/>
                <div className={styles['tipStyle']}>
                    <InfoCircleOutlined />您本次成绩在本站超越了{result.ranking}%的小伙伴~
                </div>
            </div>
            <ul className={styles['contentUl']}>
                <li className={styles['contentLi']}>
                    <div className={styles['liLeft']}>
                        <img src={AcIcon} alt=""/>
                    </div>
                    <div className={styles['liRight']}>
                        <div className={styles['topStyle']}>
                            <span className={styles['rateStyle']}>  {(result.acNum / result.allNum * 100).toFixed(2)}</span>
                            <span className={styles['rateStyleLittle']}>%</span>
                        </div>
                        <div className={styles['bottomStyle']}>
                            正确率
                        </div>
                    </div>
                </li>
                <li className={styles['contentLi']}>
                    <div className={styles['liLeft']}>
                        <img src={RageIcon} alt=""/>

                    </div>
                    <div className={styles['liRight']}>
                        <div className={styles['topStyle']}>
                            <span className={styles['rateStyle']}>{result.acNum}</span>
                            <span className={styles['rateStyleLittle']}>/ {result.allNum}</span>
                        </div>
                        <div className={styles['bottomStyle']}>
                            答对题目数
                        </div>
                    </div>
                </li>

                <li className={styles['contentLi']}>
                    <div className={styles['liLeft']}>
                        <img src={TimeIcon} alt=""/>
                    </div>
                    <div className={styles['liRight']}>
                        <div className={styles['topStyle']}>
                            <span className={styles['rateStyle']}>{formatTime(result.time)[0]}</span>
                            <span className={styles['rateStyleLittle']}>分钟 </span>
                            <span className={styles['rateStyle']}> {formatTime(result.time)[1]} </span>
                            <span className={styles['rateStyleLittle']}> 秒</span>
                        </div>
                        <div className={styles['bottomStyle']}>
                            本次用时
                        </div>
                    </div>
                </li>
            </ul>

       <div style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>


           {/*<span  className={styles['back']}>回顾试卷</span>*/}
           <span onClick={()=>nav("/front/question/questionHome")} className={styles['back']}>返回刷题页</span>
       </div>
        </div>
    </div>
}
export default FinishPage
