import {useNavigate} from "react-router-dom";
import   HandIcon from "./img/hand.svg";
import  ArrowIcon from "./img/rightArrow.svg";

const QuestionNav = () => {
    const nav = useNavigate()
    const goQuestionHome = () => {
        nav('/question/questionHome')
    }
    return <div className="w-full min-h-screen flex flex-col items-center text-[#4c4948]">

        <div className="w-full max-w-[900px]">
            <div className="pt-4 h-[45px] text-[#2e51b3] flex justify-center items-center text-2xl font-bold gap-2">
                <div className="w-9 h-9 rounded-md bg-primary-500 text-white font-bold flex items-center justify-center">mg</div>
                <span>木瓜一块八</span>
            </div>
            <div className="mt-12 w-20 origin-bottom animate-bounce"><img className="w-20" src={HandIcon} alt="hand"/></div>
            <div className="text-[64px] font-bold">你好，</div>
            <div className="text-[64px] font-bold">欢迎探索在线刷题系统</div>

            <div className="w-full flex items-center">

                <div onClick={goQuestionHome} className="mt-4 p-5 pr-2 pb-10 w-[300px] h-[145px] border border-[#b8afaf] bg-white backdrop-blur transition-all duration-300 ease-in-out rounded-2xl hover:-translate-y-1 hover:cursor-pointer">
                    <div className="text-[20px] font-bold text-[#2e51b3]">在线刷题系统</div>
                    <div className="text-[#7c7070]">在线刷题包含海量题目、等级成长系统，快来网上冲浪吧</div>
                    <div className="mt-2 flex justify-between items-center">
                        立即体验 <img src={ArrowIcon} alt="arrow"/>
                    </div>


                </div>
                {/*<button onClick={goQuestionHome}>去刷题</button>*/}

            </div>
        </div>


    </div>
}
export default QuestionNav
