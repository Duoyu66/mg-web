import styles from './index.module.css'
import ExamIcon from "./img/exam.svg";
import {useEffect, useState} from "react";
import {reqGetExamList, useGetQuestionType, reqLvInfo, reqAddLvExp} from "@/pages/front-end/question/hooks/question";
import {Button, Checkbox, Descriptions,notification , GetProp, Modal, Popconfirm, Progress, Radio, Skeleton, Tabs} from "antd";
import {useNavigate} from "react-router-dom";
import {themeColor} from "../../settings/theme";
import {DotChartOutlined,CheckCircleTwoTone} from '@ant-design/icons'
import FighttingIcon from "./img/fightting.svg";
import InfoIcon from "./img/info.svg";
import FenXiIcon from "./img/fenxi.svg";    
import RuKouIcon from "./img/rukou.svg";
import  TypeIcon from "./img/type.svg";
import  TipIcon from "./img/tip.svg";
import   INavIcon from "./img/iNav.svg";
import  PNavIcon from "./img/pNav.svg";
import  TNavIcon from "./img/tNav.svg";

import LineChart from "@/pages/front-end/question/questionHome/chart/lineChart";
import RankingList from "@/pages/front-end/question/questionHome/rankingList";
import {lvData} from "@/pages/front-end/question/questionHome/lv/data";
import {coinChange} from "../../utils/tools";

const QuestionHome = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const { nickName, avatarUrl}: any = userInfo;
    const userId ='4500fbd3-5e3c-407b-b158-51e1ed19ee3a'
    const { data: typeRes, isLoading: laodingType } = useGetQuestionType({id: '4500fbd3-5e3c-407b-b158-51e1ed19ee3a'})
    const nav = useNavigate()
    //类型列表
    const [typeList, setTypeList] = useState([])
    const [userQuestionInfoObj, setUserQuestionInfoObj]: any = useState({})

    const [lvInfo, setLvInfo] = useState({
        lv: 0,
        exp: 0,
        nextLvExp: 0,
        lastLvExp: 0,
        dailySign:"0"
    })
    useEffect(() => {
        initLvInfo(userId)
    }, [])
    const initLvInfo = (userId: string) => {
        reqLvInfo({id: userId}).then(res => {
            const exp = res.data.exp;
            let lv = 1;    // 默认1级
            let nextLv = 1; // 默认下一级也是1级

            // 遍历等级数据（注意数组是从0开始的）
            for (let i = 0; i < lvData.length; i++) {
                if (exp >= lvData[i].children) {
                    // 当前等级不能超过100级（数组索引99）
                    lv = Math.min(i + 1, 100); // id = 数组索引 + 1
                } else {
                    // 下一等级也不能超过100级
                    nextLv = Math.min(i + 1, 100);
                    break;
                }
            }

            // 特殊处理满级情况
            if (lv === 100) {
                nextLv = 100; // 已经是最高级
            }

            setLvInfo((prevState: any) => ({
                ...prevState,
                lv: lv,
                exp: exp,
                nextLvExp: lvData[nextLv - 1]?.children || lvData[lvData.length - 1].children, // 安全访问
                lastLvExp: lv > 1 ? lvData[lv - 2].children : 0, // 上一级经验
                dailySign:res.data.dailySign
            }));
        });
    };
    const text = 'Are you sure to delete this task?';
    const CustomDescription = () => (
        <div>
            <ul className={styles['tipUl']}>
                <li className={styles['tipLiBig']}>简单题目积分</li>
                <li className={styles['tipLiSmall']}>+</li>
                <li className={styles['tipLiBig']}>中等题目积分</li>
                <li className={styles['tipLiSmall']}>+</li>
                <li className={styles['tipLiBig']}>困难题目积分</li>
                <li className={styles['tipLiSmall']}>=</li>
                <li className={styles['tipLiBig']}>竞赛积分</li>

                <li className={styles['tipLiBig']}>{userQuestionInfoObj.qdScoreData.easyAcNum == null ? 0 : userQuestionInfoObj.qdScoreData.easyAcNum}*1</li>
                <li className={styles['tipLiSmall']}>+</li>
                <li className={styles['tipLiBig']}>{userQuestionInfoObj.qdScoreData.medAcNum == null ? 0 : userQuestionInfoObj.qdScoreData.medAcNum}*2</li>
                <li className={styles['tipLiSmall']}>+</li>
                <li className={styles['tipLiBig']}>{userQuestionInfoObj.qdScoreData.hardAcNum == null ? 0 : userQuestionInfoObj.qdScoreData.hardAcNum}*3</li>
                <li className={styles['tipLiSmall']}>=</li>
                <li className={styles['tipLiBig']}>{userQuestionInfoObj.qdScoreData.easyAcNum + userQuestionInfoObj.qdScoreData.medAcNum * 2 + userQuestionInfoObj.qdScoreData.hardAcNum * 3}</li>
                <li className={styles['chao']}>超越了本站 {userQuestionInfoObj.qdScoreData.surpass}% 的小伙伴~</li>
            </ul>

        </div>
    );
    const RateDescription = () => (
        <div>
            <ul className={styles['tipRateUl']}>
                <li className={styles['rateBig']}>简单难度正确率:</li>
                <li className={styles['rateSmall']}>{userQuestionInfoObj?.qdAcRateData?.easyAcRate}%</li>
                <li className={styles['rateBig']}>中等难度正确率:</li>
                <li className={styles['rateSmall']}>{userQuestionInfoObj?.qdAcRateData?.mediumAcRate}%</li>
                <li className={styles['rateBig']}>困难难度正确率:</li>
                <li className={styles['rateSmall']}>{userQuestionInfoObj?.qdAcRateData?.hardAcRate}%</li>
            </ul>

        </div>
    );
    const ScoreDescription = () => (
        <div>
            <ul className={styles['tipScoreUl']}>
                <li className={styles['scoreBig']}>简单难度平均分:</li>
                <li className={styles['scoreSmall']}>{userQuestionInfoObj.qdAveScoreData.aveEasyScore.toFixed(2)}</li>
                <li className={styles['scoreBig']}>中等难度平均分:</li>
                <li className={styles['scoreSmall']}>{userQuestionInfoObj.qdAveScoreData.aveMediumScore.toFixed(2)}</li>
                <li className={styles['scoreBig']}>困难难度平均分:</li>
                <li className={styles['scoreSmall']}>{userQuestionInfoObj.qdAveScoreData.aveHardScore.toFixed(2)}</li>
            </ul>

        </div>
    );
    const [examPloay, setExamPloay] = useState({
        userId: userId,
        types: [],
        num: 15,
        difficulty: 'easy',
        typesList: []
    })
    const [loading, setLoading] = useState(false)
    const typeChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues: any) => {
        setExamPloay((prev: any) => ({
            ...prev,
            types: checkedValues
        }))
    };
    const difficultyChange = (e: any) => {
        setExamPloay((prev: any) => ({
            ...prev,
            difficulty: e.target.value
        }))
    };
    const numChange = (e: any) => {
        setExamPloay((prev: any) => ({
            ...prev,
            num: e.target.value
        }))
    };
    useEffect(() => {
        if (typeRes && (typeRes as any).status) {
            const res: any = typeRes
            let typesTemp: any = []
            let typesValue: any = []
            setUserQuestionInfoObj(res.data.userQuestionInfoDataDto)
            setTypeList(res.data.questionTypeList)
            for (let i = 0; i < res.data.questionTypeList.length; i++) {
                let itemObj = {
                    label: '',
                    value: ''
                }
                itemObj.label = res.data.questionTypeList[i].name
                itemObj.value = res.data.questionTypeList[i].value
                typesTemp.push(itemObj)
                typesValue.push(res.data.questionTypeList[i].value)
            }
            setExamPloay((prevState: any) => ({
                ...prevState,
                typesList: typesTemp,
                types: typesValue
            }))
        }
    }, [typeRes])
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        console.log("打开弹窗按钮被点击了")
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    //获取题目列表
    const getExamListFn = () => {
        setLoading(true)
        console.log('examPloay', examPloay)
        reqGetExamList(examPloay).then(res => {
            setLoading(false)
            if (res.status) {
                nav('/question/examPage', {
                    state: {
                        questionList: res.data,
                        firstQuestion: res.data[0],
                        questionTypeList: typeList,
                        difficulty: examPloay.difficulty,
                        num: examPloay.num,
                    }
                })
            }
        })
    }
    const tipStr = (rank: number) => {
        if (rank == 1) {
            return "超越巅峰榜第2名"
        } else if (rank == 2) {
            return "距离超越巅峰榜第1名"
        } else if (rank == 3) {
            return "距离超越巅峰榜第2名"
        } else if (rank > 3 && rank <= 10) {
            return "距离超越巅峰榜第3名"
        } else {
            return "距离超越巅峰榜第10名"
        }
    }
    const questionPart = () => (
        <div>
            <div className={styles['title']}>
                <img src={RuKouIcon} alt="入口"/>
                快捷入口
            </div>
            <ul className={styles['contentUl']}>
                <li className={styles['contentLi']} onClick={showModal}>
                    <img src={ExamIcon} alt="考试"/>
                    <div className={styles['liRight']} >
                        <span className={styles['tilte']}>模拟考试</span>
                        <span className={styles['subTilte']}>仿真冲刺</span>
                    </div>
                </li>

                <li className={styles['contentLi']}>
                    <img src={ExamIcon} alt="考试"/>
                    <div className={styles['liRight']}>
                        <span className={styles['tilte']}>顺序练习</span>
                        <span className={styles['subTilte']}>仿真冲刺</span>
                    </div>
                </li>


                <li className={styles['contentLi']}>
                    <img src={ExamIcon} alt="考试"/>
                    <div className={styles['liRight']}>
                        <span className={styles['tilte']}>我的错题</span>
                        <span className={styles['subTilte']}>仿真冲刺</span>
                    </div>
                </li>
                <li className={styles['contentLi']}>
                    <img src={ExamIcon} alt="考试"/>
                    <div className={styles['liRight']}>
                        <span className={styles['tilte']}>我的收藏</span>
                        <span className={styles['subTilte']}>仿真冲刺</span>
                    </div>
                </li>
                <li className={styles['contentLi']}>
                    <img src={ExamIcon} alt="考试"/>
                    <div className={styles['liRight']}>
                        <span className={styles['tilte']}>我的考试</span>
                        <span className={styles['subTilte']}>仿真冲刺</span>
                    </div>
                </li>

            </ul>
            <div className={styles['title']}>
                <img src={TypeIcon} alt="类型"/>
                专项练习
            </div>
            <ul className={styles['singleUl']}>
                {
                    laodingType && [1, 2, 3, 4, 5, 6, 7, 8].map((item: any) => {
                        return <li key={item} className={styles['singleLiLoading']}>
                            <Skeleton.Node style={{width: 180, height: 90}} active={true}>
                                <DotChartOutlined style={{fontSize: 40, color: '#bfbfbf'}}/>
                            </Skeleton.Node>
                        </li>
                    })
                }

                {
                    !laodingType && typeList.map((item: any, index: number) => {
                        return <li className={styles['singleLi']}>
                            <div className={styles['singleLiLeft']}>
                                <img src={item.img} alt=""/>
                            </div>
                            <div>
                                <div className={styles['tilte']}>
                                    {item.name}
                                </div>
                                <div
                                    className={styles['subTilte']}> 已完成{item.computedNum}/总共{item.allNum}</div>
                                <Progress
                                    percent={parseFloat(((item.computedNum / item.allNum) * 100).toFixed(2))}
                                    percentPosition={{align: 'end', type: 'outer'}}
                                    size={[100, 15]}
                                    strokeColor={themeColor}
                                />
                            </div>
                        </li>
                    })
                }
            </ul>

        </div>

    )
    const userInfoPart = () => (
        <div className={styles['tip']}>


            <div className={styles['title']}>
                <img src={FenXiIcon} alt="分析"/>
                题目分析
            </div>

            {/*
                    1：您当前在本站的排名是第1名，超越巅峰榜第2名xxx分，继续加油吧！
                    2：您当前在本站的排名是第2名，距离超越巅峰榜第1名还差xxx分，继续加油吧！
                    3：您当前在本站的排名是第3名，距离超越巅峰榜第2名还差xxx分，继续加油吧！
                   3-10：您当前在本站的排名是第x名，距离超越巅峰榜第3名还差xxx分，继续加油吧！
                   >10：您当前在本站的排名是第x名，距离超越巅峰榜第10名(上榜)还差xxx分，继续加油吧！
                    */}
            <div className={styles['questionInfo']}>
                <ul className={styles['questionInfoUl']}>
                    <li className={styles['questionInfoLi']}>
                                <span
                                    className={styles['valueLi']}>{laodingType ? "--" : userQuestionInfoObj?.qdScoreData?.easyAcNum + userQuestionInfoObj?.qdScoreData?.medAcNum * 2 + userQuestionInfoObj?.qdScoreData?.hardAcNum * 3}</span>
                        <span className={styles['titleLi']}>竞赛积分

                                       <Popconfirm
                                           icon={null}
                                           trigger="hover"
                                           placement="top"
                                           title={null}
                                           showCancel={false}
                                           okButtonProps={{style: {display: 'none'}}} // 隐藏确定按钮
                                           description={<CustomDescription/>}
                                       >
       <img src={InfoIcon} alt="info"/>
        </Popconfirm>
                                </span>
                    </li>
                    <li className={styles['questionInfoLi']}><span
                        className={styles['valueLi']}>{laodingType ? "--" : userQuestionInfoObj?.qdAcRateData?.allAcRate}%</span>
                        <span className={styles['titleLi']}>正确率

                                                       <Popconfirm
                                                           icon={null}
                                                           trigger="hover"
                                                           placement="top"
                                                           title={null}
                                                           showCancel={false}
                                                           okButtonProps={{style: {display: 'none'}}} // 隐藏确定按钮
                                                           description={<RateDescription/>}
                                                       >
       <img src={InfoIcon} alt="info"/>
        </Popconfirm>
                                </span></li>
                    <li className={styles['questionInfoLi']}><span
                        className={styles['valueLi']}>{laodingType ? "--" : userQuestionInfoObj?.qdProgressData?.completedNum}/{laodingType ? "--" : userQuestionInfoObj?.qdProgressData?.totalNum}</span>
                        <span className={styles['titleLi']}>练习进度 </span></li>
                    <li className={styles['questionInfoLi']}><span
                        className={styles['valueLi']}>{laodingType ? "--" : userQuestionInfoObj?.qdAveScoreData?.aveAllScore}</span>
                        <span className={styles['titleLi']}>平均分

                                                                 <Popconfirm
                                                                     icon={null}
                                                                     trigger="hover"
                                                                     placement="top"
                                                                     title={null}
                                                                     showCancel={false}
                                                                     okButtonProps={{style: {display: 'none'}}} // 隐藏确定按钮
                                                                     description={<ScoreDescription/>}
                                                                 >
       <img src={InfoIcon} alt="info"/>
        </Popconfirm></span></li>
                    {/*<li className={styles['questionInfoLi']}>  <span className={styles['valueLi']}>3.25%</span>*/}
                    {/*    <span className={styles['titleLi']}>困难题目正确率 </span></li>*/}
                </ul>
                <div className={styles['rBox']}>
                    {
                        !laodingType && <LineChart
                            data={Array.from({length: 10}, (v, i) => userQuestionInfoObj?.qdChartData?.dataList[i] || null)}></LineChart>
                    }

                </div>
            </div>


        </div>
    )
    const rangPart = () => (
        <div className={styles['rangListBox']}>
            <RankingList></RankingList>
        </div>
    )
    const lvPart = () => (
        <div>
            <ul>
                <li>每日签到 10-20经验 type:1</li>
                <li>评论文章/留言 一条10经验（每天限10条）type:2</li>
                <li>考试分数 90+ 经验100 80+ 经验60 60+ 经验20 60- 10经验 type:3</li>
                <li>随机练习/专项练习 错误 1经验 正确3经验 type:4</li>
                <li>专项练习（某个专项全部完成） (1+题目总数量/100)*500经验 type:5</li>
                <li>周榜 第一1500经验 第二 1000经验 第三 800 第三到第十500经验 type:6</li>
                <li>月榜 第一3000经验 第二 2000经验 第三 1500 第三到第十1000经验 type:7</li>
            </ul>
            <ul>
                <li> ️⭐️：1级</li>
                <li> ️🌙：4级</li>
                <li> ️🌞：16级</li>
                <li> ️👑：64级</li>
            </ul>
            <Descriptions size="small" column={10} title="等级介绍" layout="vertical" bordered items={lvData}/>
        </div>
    )
    const tabsItem: any = [
        {
            label: (
                <>
                    <img src={INavIcon} alt="i"/> 工作台
                </>
            ),
            key: "work",
            children: userInfoPart(),
        },
        {
            label: (
                <>
                    <img src={TNavIcon} alt="t"/> 题库
                </>
            ),
            key: "l",
            children: questionPart(),
        },
        {
            label: (
                <>
                    <img src={INavIcon} alt="i"/> 个人分析
                </>
            ),
            key: "analysis",
            children: userInfoPart(),
        },
        {
            label: (
                <>
                    <img src={PNavIcon} alt="p"/> 排行榜
                </>
            ),
            key: "s",
            children: rangPart(),
        }, {
            label: (
                <>
                    <img src={PNavIcon} alt="p"/> 等级系统
                </>
            ),
            key: "ss",
            children: lvPart(),
        },

    ]
    const [isSign, setIsSign] = useState(false)
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (exp:number) => {
        console.log("直观性了")
        api.open({
            showProgress:true,
            duration: 3,
            closeIcon:false,
            message: '签到提醒',
            description:
                `恭喜你，通过每日签到获得了${exp}经验值！`,
            icon: <CheckCircleTwoTone  style={{color: '#108ee9'}}/>,
        });
    };
    const signBtn = () => {

        if (lvInfo.dailySign==="0") {
            const exp = Math.floor(Math.random() * (25 - 15 + 1)) + 15;

            reqAddLvExp({type:"1",userId, exp}).then(res => {
                if (res.status) {
                    openNotification(exp)
                    initLvInfo(userId)
                }
            })
            setIsSign(true)
        }

    }
//

    return (
        <div className={styles['mainBox']}>

            {/*<div className={loading ? '' : `${commonStyles['loaded']}`}>*/}
            {/*    <FullScreenLoading></FullScreenLoading>*/}
            {/*</div>*/}
            <div className={styles['content']}>
                {/*<div className={styles['contentLeft']}>*/}


                {/*</div>*/}
                <div className={styles['info']}>
                    <div className={styles['topTitle']}>
                        <img src={avatarUrl} alt=""/>
                        <div className={styles['infoR']}>
                            <span className={styles['nickName']}>{nickName}</span>
                            <span className={styles['lvBox']}>     <span className={styles['lv']}>Lv.{lvInfo.lv}</span>
                                       <span
                                           className={styles['lvIcon']}>{coinChange([1, 4, 16, 64], lvInfo.lv)}</span>
                            </span>

                            <span className={styles['proBox']}>
                            <span className={styles['prBox']}>
                                    <Progress className={styles['progressBox']}
                                              percent={(lvInfo.exp - lvInfo.lastLvExp) / (lvInfo.nextLvExp - lvInfo.lastLvExp) * 100}
                                              showInfo={false}/>
                                <img src={TipIcon} alt="tip"/>
                            </span>

                                {lvInfo.lv !== 100 ? <span
                                        className={styles['tipBox']}>距离Lv.{lvInfo.lv + 1} 还需{lvInfo.nextLvExp - lvInfo.exp}经验值</span> :
                                    <span
                                        className={styles['tipBox']}>距离Lv.max 还需{9999999 - lvInfo.exp}经验值</span>

                                }

                            </span>
                        </div>

                    </div>
                    <div className={styles['signIn']}>
                        <div className={styles['signL']}>
                            <span className={styles['signTilte']}>今日签到</span><br/>
                            <span className={styles['signContent']}>随机获取10-20经验值</span>
                        </div>
                        <div className={styles['signR']}>
                            {contextHolder}
                            <div className={styles['signStyle']} onClick={signBtn}>{
                                lvInfo.dailySign==="0" ? "立即签到" : "今日已签到"
                            }</div>
                        </div>

                    </div>
                    <div style={{display: 'none'}} className={styles['tipContent']}>
                        {userQuestionInfoObj?.qdRankData === null ? "您还未参加考试，快来挑战自己吧~" : <div
                            style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}
                        >
                            您当前在本站的排名是第 <span
                            className={styles['hightValue']}>{userQuestionInfoObj?.qdRankData?.rankNum}</span>名，
                            {tipStr(userQuestionInfoObj?.qdRankData?.rankNum)}
                            <span
                                className={styles['hightValue']}> {userQuestionInfoObj?.qdRankData?.opponentName}</span>

                            {userQuestionInfoObj?.qdRankData?.rankNum != 1 ? "还差" : ""}
                            <span
                                className={styles['hightValue']}> {userQuestionInfoObj?.qdRankData?.differenceNum}</span>
                            分，加油鸭！
                        </div>}

                            <img src={FighttingIcon} style={{marginLeft: '5px'}} alt="fighting"/>
                    </div>
                </div>


            </div>
            <Tabs

                className={`${styles['myTabs']} ${isSign ? styles['newTabs'] : ''}`}
                animated={true}
                tabPlacement={"left"}
                items={tabsItem}
            />
            <div style={{display: 'none'}} className={styles['contentRight']}>

            </div>


            {/*    模拟考试弹窗*/}

            <Modal footer={null} title="模拟考试" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className={styles['modalDiv']}>
                    <div className={styles['itemStyle']}>
                        <span className={styles['typeStyle']}> 题目类型：</span> <Checkbox.Group
                        options={examPloay.typesList}
                        defaultValue={examPloay.typesList.map((item: any) => item.value)}
                        onChange={typeChange}/>
                    </div>
                    <div className={styles['itemStyle']}>

                        <span className={styles['typeStyle']}> 题目难度：</span>
                        <Radio.Group
                            name="radiogroup"
                            defaultValue={'easy'}
                            onChange={difficultyChange}
                            options={[
                                {value: 'easy', label: '简单'},
                                {value: 'medium', label: '中等'},
                                {value: 'hard', label: '困难'},
                            ]}
                        />
                    </div>
                    <div className={styles['itemStyle']}>
                        <span className={styles['typeStyle']}>   题目数量：</span>

                        <Radio.Group
                            name="radiogroup"
                            defaultValue={15}
                            onChange={numChange}
                            options={[
                                {value: 15, label: '15道'},
                                {value: 30, label: '30道'},
                                {value: 50, label: '50道'},
                            ]}
                        />
                    </div>
                </div>
                <Button loading={loading} type='primary' className={styles['startBtn']}
                        onClick={getExamListFn}>开始测试</Button>
            </Modal>
        </div>
    )
}
export default QuestionHome;
