import styles from './index.module.css'
import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import type {DrawerProps} from 'antd';
import {Button, Checkbox, Drawer, Modal, Radio, Statistic, Tag, Flex, Progress, message} from "antd";
import { LeftOutlined, RightOutlined, PaperClipOutlined } from '@ant-design/icons';
import {useSubmitFinalScore} from "@/pages/front-end/question/hooks/useSubmitFinalScore";
import {useAddRecordOrError} from "@/pages/front-end/question/hooks/useAddRecordOrError";
import {useDeleteRecord} from "@/pages/front-end/question/hooks/useDeleteRecord";
import Prism from "prismjs";
import 'prismjs/themes/prism-okaidia.css'
import 'prismjs/components/'
import "prismjs/components/prism-java" // 引入Java样式
import "prismjs/components/prism-bash.min.js" // 引入Bash样式
import "prismjs/components/prism-typescript" // 引入TypeScript样式
import "prismjs/plugins/line-numbers/prism-line-numbers.min.css" // 行号插件的样式
import "prismjs/plugins/line-numbers/prism-line-numbers.min.js" // 行号插件
import "prismjs/plugins/toolbar/prism-toolbar.min.css"
import "prismjs/plugins/toolbar/prism-toolbar.min.js"
import "prismjs/plugins/show-language/prism-show-language.min.js"
import fightingSvg from './img/fighting.svg'
// Wave 组件占位，后续可替换为本地组件
import  QICon from "./img/q.svg";
import  SnoICon from "./img/sNo.svg";
import  SyesICon     from "./img/sYes.svg";

const {Countdown} = Statistic;

const ExamPage = () => {
    const nav = useNavigate()
    const location = useLocation();
    const allQuestion = location.state;
    const userId = localStorage.getItem("userId");
    const {questionList, firstQuestion, questionTypeList, difficulty, num} = allQuestion
    const submitFinalScoreMutation = useSubmitFinalScore();
    const addRecordMutation = useAddRecordOrError();
    const deleteRecordMutation = useDeleteRecord();
    const [passedMinutes, setPassedMinutes] = useState(0);
    const [modeTime, setModeTime]: any = useState(() => {
        switch (num) {
            case 15:
                return 20
            case 30:
                return 35
            case 50:
                return 60
            default:
                break;
        }
    })//简单20、中等40、困难80
    const [deadline, setDeadline]: any = useState(Date.now() + 1000 * 60 * modeTime)
    const [questionIndex, setQuestionIndex] = useState(0);
    const [questionType, setQuestionType] = useState({
        img: '',
        type: ''
    })
    let array: any = []
    for (let i = 0; i < questionList.length; i++) {
        let item = {
            questionId: questionList[i].id,
            answer: '',
            difficulty: questionList[i].difficulty
        }
        array.push(item)
    }
    const [answer, setAnswer]: any = useState({
        userId: userId,
        numAll: num,
        difficulty: difficulty,
        time: 0,
        doneList: array

    })
    const [question, setQuestion]: any = useState(firstQuestion);
    const [options, setOptions]: any = useState([])
    const [incompleteVisible, setIncompleteVisible] = useState(false)
    const [remainingMin, setRemainingMin] = useState(0)
    const [emptyAnswersCount, setEmptyAnswersCount] = useState(num)//初始化未做题目数
    const [tagColor, setTagColor] = useState('success');
    const [submitLoading,setSubmitLoading] = useState(false)
    const [percent, setPercent] = useState<number>(0);
    const [showStar,setShowStar] = useState(firstQuestion.collection=='1')
    useEffect(() => {
        let type = questionTypeList.find((item: any) => {
            return item.value == question.type
        })
        setQuestionType({
            type: type.name,
            img: type.img
        })
        setShowStar(questionList[questionIndex].collection=='1')
        setOptions(question.items.map((item: any, index: number) => {
            return {
                label: `${item.optionName}：${item.optionValue}`,
                value: item.optionName,
            }
        }))
        switch (question.difficulty) {
            case 'easy':
                setTagColor('success')
                break;
            case 'medium':
                setTagColor('warning')
                break;
            case 'hard':
                setTagColor('error')
                break;
            default:
                break;
        }
    }, [questionIndex])
    useEffect(()=>{
        // getQuestionErrorOrRecord({
        //     id:userId,
        //     type:'1',
        //     current:'1',
        //     pageSize:'20'
        // }).then(res=>{
        //     console.log('收藏---',res)
        // })
        let count = answer.doneList.filter((element: any) => element.answer == '').length;
        setEmptyAnswersCount(count)
        setPercent((num-count)/num *100)
    },[answer.doneList])
    // 更新问题并触发语法高亮
    const nextQuestion = () => {
        const nextIndex = questionIndex + 1;
        setQuestionIndex(nextIndex);
        setQuestion(questionList[nextIndex]);
    };

    const addCollection = () =>{
        let data = {
            userId: userId,
            type:'1',//1是收藏
            questionId: questionList[questionIndex].id,
            questionName: questionList[questionIndex].title,
        }
        //添加收藏
        addRecordMutation.mutate(data,{
            onSuccess:(res:any)=>{
                if (res.status) {
                    message.success("收藏成功~") 
                    questionList[questionIndex].collection='1'
                    setShowStar(true)
                }else{
                    message.error(res.msg)
                }
            }
        })
    }
    const deleteCollection = () => {
        let data = {
            userId: userId,
            type:'-1',//-1取消收藏
            questionId: questionList[questionIndex].id,
        }
        deleteRecordMutation.mutate(data,{
            onSuccess:(res:any)=>{
                if (res.status) {
                    message.warning("已取消收藏") 
                    questionList[questionIndex].collection='-1'
                    setShowStar(false)
                }else{
                    message.error(res.msg)
                }
            }
        })
    }

    const prevQuestion = () => {
        const prevIndex = questionIndex - 1;
        setQuestionIndex(prevIndex);
        setQuestion(questionList[prevIndex]);
    };
    const appointQuestion: any = (index: number) => {
        setQuestionIndex(index);
        setQuestion(questionList[index]);
        onClose()
    }
    const handleOk = () => {
        setIncompleteVisible(false)
        if ((difficulty == 'easy' && passedMinutes <= 3) ||
            (difficulty == 'medium' && passedMinutes <= 10) ||
            (difficulty == 'hard' && passedMinutes <= 20)) {
            return
        }
        submitFinalScoreMutation.mutate(answer,{
            onSuccess:(res:any)=>{
                if (res.status) {
                    nav('/question/finishPage', {state: res.data})
                }
            }
        })
    }

    const handleCancel = () => {
        setIncompleteVisible(false)
    }
    const submitAnwser = () => {
        setSubmitLoading(true)
        // console.log('anwser',answer);
        // if (difficulty == 'easy' && passedMinutes <= 3) {
        //     setRemainingMin(3)
        //     setIncompleteVisible(true)
        //     setSubmitLoading(false)
        //     return
        // } else if (difficulty == 'medium' && passedMinutes <= 10) {
        //     setRemainingMin(10)
        //     setIncompleteVisible(true)
        //     setSubmitLoading(false)
        //     return
        // } else if (difficulty == 'hard' && passedMinutes <= 20) {
        //     setRemainingMin(20)
        //     setIncompleteVisible(true)
        //     setSubmitLoading(false)
        //     return
        // }
        if (emptyAnswersCount > 0) {
            setIncompleteVisible(true)
            setSubmitLoading(false)
        } else {
            submitFinalScoreMutation.mutate(answer,{
                onSuccess:(res:any)=>{
                    if (res.status) {
                        nav('/question/finishPage', {state: res.data})
                    }
                },
                onSettled:()=>{
                    setSubmitLoading(false)
                }
            })
        }
    }
    const radioChange = (e: any) => {
        console.log('e', e);
        setAnswer((prevState: any) => ({
            ...prevState,
            doneList: prevState.doneList.map((item: any, i: number) =>
                i === questionIndex ? {...item, answer: e.target.value} : item
            )
        }));
    };
    const checkboxChange = (checkedValues: any) => {
        console.log('checked = ', checkedValues);
        setAnswer((prevState: any) => ({
            ...prevState,
            doneList: prevState.doneList.map((item: any, i: number) =>
                i === questionIndex ? {...item, answer: checkedValues.join('')} : item
            )
        }));
    }
    const onFinish = () => {
        console.log('时间到');
        //倒计时结束直接交卷
        submitFinalScoreMutation.mutate(answer,{
            onSuccess:(res:any)=>{
                if (res.status) {
                    nav('/question/finishPage', {state: res.data})
                }
            }
        })
    }
    const getPassedTime = (time: any) => {
        const remainingTime = deadline - Date.now();
        const seconds = Math.floor(remainingTime / 1000);
        setAnswer((prevState: any) => ({
            ...prevState,
            time: modeTime * 60 - seconds
        }));
        setPassedMinutes((modeTime * 60 - seconds) / 60);
    };
    const formatProgress:any=(percent:number)=>{
        return percent==100 ? '已完成' : `待做${emptyAnswersCount}题`
    }
    const content: any = {
        __html: question.content
    };
    // 使用 useEffect 处理 Prism 语法高亮
    useEffect(() => {
        Prism.highlightAll(); // 只有当问题内容更新时才会执行
    }, [question.content]);
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState<DrawerProps['placement']>('bottom');
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const goQuestionHome=()=>{
        nav('/question/questionHome')
    }
    return (
        <div className={styles['main_box']}>
            <div className={styles['question_box']}>
                <div className={styles['question_title']}>
                    <div className={styles['titleDiv']}>
                        <Tag icon={<PaperClipOutlined />} bordered={false} color="blue">
                        {question.questionType == '1' ? '单选题' : '不定项选择'}
                        </Tag>
                        {questionIndex + 1}、 {question.title}
                    </div>
                    <div className={styles['tags']}>
                        <Tag style={{marginRight: 20}} icon={<img src={questionType.img} alt=""/>} color="default">
                            {questionType.type}
                        </Tag>
                        <Tag color={tagColor}>{question.difficulty}</Tag>

                    </div>
                    <div className={styles['waveStyle']} style={{width: '100%'}}>
                        <div className={styles['waveStyle']} />
                    </div>
                </div>
                <div className={styles['progressStyle']}>
                    <Flex vertical gap="small">
                        <Flex vertical gap="small">
                            <Progress percent={percent} 
                            format={formatProgress}  type="circle" />
                        </Flex>
                    </Flex>
                    <Countdown format='mm:ss' onChange={getPassedTime} className={styles['countDownDiv']} value={deadline}
                            onFinish={onFinish}/>
                    
                </div>
                <div style={{backgroundColor: '#f7f9fe'}}>
                    <div className={styles['myStyleOnly']}>
                        <div className={`${styles['my-line-numbers']} line-numbers pre-mac`}
                             dangerouslySetInnerHTML={content}>
                        </div>
                    </div>
                </div>
                <div className={styles['optionsStyle']}>
                    {
                        question.questionType == '1' ?
                            <Radio.Group className={styles['radioStyle']}
                                         onChange={radioChange}
                                         value={answer.doneList[questionIndex]?.answer}
                                         options={options}
                            /> :
                            <Checkbox.Group className={styles['radioStyle']}
                                            options={options}
                                            value={answer.doneList[questionIndex]?.answer}
                                            onChange={checkboxChange}/>

                    }
                </div>

            </div>
            <Modal
                open={incompleteVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div className={styles['modalDiv']}>
                    <img src={fightingSvg} alt=""/>
                </div>
                <div className={styles['modalDiv']}>
                    {
                        // remainingMin ? 
                        // <span>当前模式最短作答时间为<span className={styles['modalSpan']}>{remainingMin}分钟</span>，请稍后重新提交答案。</span> :
                        <span>您当前还有<span className={styles['modalSpan']}>{emptyAnswersCount}道</span>题目未作答，确定交卷吗？</span>
                    }
                </div>
            </Modal>
            <Drawer
                title="答题卡"
                placement={placement}
                closable={false}
                onClose={onClose}
                open={open}
                key={placement}  
                className={styles['drawerStyle']}
            >
                <div className={styles['answerSheet']}>
                    {questionList.map((item: any, index: number) => (
                        <div key={item.id} onClick={() => appointQuestion(index)}
                             className={`${styles['sheetDiv']} 
                             ${styles[questionIndex == index ? 'picked' : '']} 
                             ${styles[answer.doneList.find((ele:any)=>item.id==ele.questionId).answer ? 'finished' : '']}`}>
                            <span>{index + 1}</span>
                        </div>
                    ))}
                </div>
            </Drawer>
            <div className={styles['bottomDiv']}>
                <div className={styles['inBox']}>
                    <div onClick={showDrawer} className={styles['qCard']}>
                        <img src={QICon} style={{marginRight: 5}} alt="q"/>答题卡
                    </div>
                    <div className={styles['btnGroup']}>
                        <div className={styles['collectDiv']}>
                            {
                                showStar ? <img src={SyesICon} onClick={deleteCollection} className={styles['collectStyle']} alt="yes"/> :
                                <img src={SnoICon} onClick={addCollection} className={styles['collectStyle']} alt="no"/>
                            }
                        </div>
                        <Button onClick={goQuestionHome} type="default" className={styles['btnItem']}>返回刷题主页</Button>
                        <Button disabled={questionIndex == 0} onClick={prevQuestion} type="primary" className={styles['btnItem']}>
                            <LeftOutlined/>
                            <span className={styles['contentSpan']}>上一题</span>
                        </Button>
                        <Button disabled={questionIndex == questionList.length - 1} onClick={nextQuestion} type="primary" className={styles['btnItem']}>
                            <span className={styles['contentSpan']}>下一题</span><RightOutlined/>
                        </Button>



                    </div>
                    <Button className={styles['diyBtn']} loading={submitLoading} style={{justifySelf: 'flex-end',marginRight:15}} onClick={submitAnwser} type="primary"
                            danger={true}>立即交卷</Button>
                </div>

            </div>
        </div>

    );
};

export default ExamPage;
