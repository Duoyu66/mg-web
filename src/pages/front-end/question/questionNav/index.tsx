import {useNavigate} from "react-router-dom";
import styles from './index.module.css'
import   HandIcon from "./img/hand.svg";
import  ArrowIcon from "./img/rightArrow.svg";

const QuestionNav = () => {
    const nav = useNavigate()
    const goQuestionHome = () => {
        nav('/question/questionHome')
    }
    return <div className={styles['main-box']}>

        <div className={styles['content-box']}>
            <div className={`${styles['headerBox']} flex items-center justify-center gap-2`}>
                <div className="w-9 h-9 rounded-md bg-primary-500 text-white font-bold flex items-center justify-center">mg</div>
                <span>木瓜一块八</span>
            </div>
            <div className={styles['handStyle']}><img src={HandIcon} alt="hand"/></div>
            <div className={styles['title']}>你好，</div>
            <div className={styles['title']}>欢迎探索在线刷题系统</div>

            <div className={styles['btnBox']}>

                <div onClick={goQuestionHome} className={styles['btnBoxItem']}>
                    <div className={styles['itemTitle']}>在线刷题系统</div>
                    <div className={styles['tip']}>在线刷题包含海量题目、等级成长系统，快来网上冲浪吧</div>
                    <div className={styles['go']}>
                        立即体验 <img src={ArrowIcon} alt="arrow"/>
                    </div>


                </div>
                {/*<button onClick={goQuestionHome}>去刷题</button>*/}

            </div>
        </div>


    </div>
}
export default QuestionNav
