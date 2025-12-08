 
import {Dropdown, MenuProps, Table, Tooltip} from "antd";
import {useEffect, useState} from "react";
import SwitchIcon from "./img/switch.svg";
import {getRankingList} from "@/pages/front-end/question/hooks/getRankingList";

const RankingList = () => {
    const text = 'Are you sure to delete this task?';
    const description = 'Delete the task';
    const columns: any = [
        {
            title: '排名',
            dataIndex: 'c',
            key: 'c',
            width: 50,
            align: 'center', // 水平居中
            render: (text: string, record: any, index: number) => index + 4 // 将索引
        },
        {
            title: '昵称',
            dataIndex: 'nickName',
            key: 'nickName',
            align: 'center', // 水平居中
            ellipsis: {
                showTitle: false,
            },
            width: 180,
            render: (text: string, record: any, index: number) => (
                <div className="flex items-center justify-start">
                    <img className="mr-1 w-[50px] h-[50px] rounded-full" src={record.avatarUrl} alt=""/>
                    <div className="flex flex-col justify-center items-start w-[calc(100%-50px)]">
                        <div className="flex justify-start w-full mb-1">
                            <Tooltip placement="topRight" title={record.nickName}>
                                <div className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                                     style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                    {record.nickName}
                                </div>
                            </Tooltip>
                        </div>
                        <span className="text-[12px] text-[#4c4948]"> 已参加竞赛 {record.examNum} 次</span>
                    </div>
                </div>
            )
        },
        {
            title: '竞赛得分',
            dataIndex: 'pointScore',
            key: 'pointScore',
            align: 'center', // 水平居中
        },
        {
            title: 'AC题目数量',
            dataIndex: 'num',
            key: 'num',
            align: 'center', // 水平居中
        },
        {
            title: '正确率',
            dataIndex: 'rate',
            key: 'rate',
            align: 'center', // 水平居中
            render: (text: string, record: any, index: number) => {
                return <div>
                    85.36%
                </div>
            }
        },
    ];
    const [rankList, setRankList]: any = useState([])
    const rankScoreList = [
        {
            id: 0,
            name: '墙头马上墙头马上墙头马上墙头马上墙头马上墙头马上墙头马上',
            score: 97.22,
            img: 'https://img.pawpaw18.cn/user-img/cbbabbc6352e4443b94732e43b908c44.png',
            num: 4352
        },

        {
            id: 1,
            name: 'chrilole',
            score: 98.38,
            img: 'https://img.pawpaw18.cn/user-img/ca61197887bf453ca3e94d67fcffb346.png',
            num: 152
        },
        {
            id: 2,
            name: '百米八秒的Rapper百米八秒的Rapper百米八秒的Rapper',
            score: 99.12,
            img: 'https://img.pawpaw18.cn/user-img/qiya.jpg',
            num: 2552
        },
        {
            id: 3,
            name: '小样肖恩',
            score: 96.15,
            img: 'https://img.pawpaw18.cn/user-img/cbbabbc6352e4443b94732e43b908c44.png',
            num: 252
        },
        {
            id: 4,
            name: '小样肖恩小样肖恩小样肖恩',
            score: 95.21,
            img: 'https://img.pawpaw18.cn/user-img/cbbabbc6352e4443b94732e43b908c44.png',
            num: 52
        },
        {
            id: 5,
            name: '喜羊羊',
            score: 94.84,
            img: 'https://img.pawpaw18.cn/user-img/cbbabbc6352e4443b94732e43b908c44.png',
            num: 752
        },
        {
            id: 6,
            name: '慢羊羊',
            score: 93.99,
            img: 'https://img.pawpaw18.cn/user-img/cbbabbc6352e4443b94732e43b908c44.png',
            num: 352
        },
        {
            id: 7,
            name: '暖羊羊',
            score: 92.74,
            img: 'https://img.pawpaw18.cn/user-img/cbbabbc6352e4443b94732e43b908c44.png',
            num: 172
        },
        {
            id: 8,
            name: '灰太狼',
            score: 91.12,
            img: 'https://img.pawpaw18.cn/user-img/cbbabbc6352e4443b94732e43b908c44.png',
            num: 552
        },
        {
            id: 9,
            name: '懒羊羊',
            score: 90.23,
            img: 'https://img.pawpaw18.cn/user-img/cbbabbc6352e4443b94732e43b908c44.png',
            num: 152
        },
        {
            id: 10,
            name: '沸羊羊',
            score: 89.84,
            img: 'https://img.pawpaw18.cn/user-img/cbbabbc6352e4443b94732e43b908c44.png',
            num: 155
        },
    ]
    const rankAcList: any = [
        {
            id: 0,
            name: '百米八秒的Rapper',
            score: 99.12,
            img: 'https://img.pawpaw18.cn/user-img/qiya.jpg',
            num: 2552
        },
        {
            id: 1,
            name: 'chrilole',
            score: 98.38,
            img: 'https://img.pawpaw18.cn/user-img/ca61197887bf453ca3e94d67fcffb346.png',
            num: 152
        },
        {
            id: 2,
            name: '墙头马上',
            score: 97.22,
            img: 'https://img.pawpaw18.cn/user-img/cbbabbc6352e4443b94732e43b908c44.png',
            num: 4352
        },
        {
            id: 3,
            name: '小样肖恩',
            score: 96.15,
            img: 'https://img.pawpaw18.cn/user-img/cbbabbc6352e4443b94732e43b908c44.png',
            num: 252
        },
        {
            id: 4,
            name: '小样肖恩小样肖恩小样肖恩',
            score: 95.21,
            img: 'https://img.pawpaw18.cn/user-img/cbbabbc6352e4443b94732e43b908c44.png',
            num: 52
        },
        {
            id: 5,
            name: '喜羊羊',
            score: 94.84,
            img: 'https://img.pawpaw18.cn/user-img/cbbabbc6352e4443b94732e43b908c44.png',
            num: 752
        },
        {
            id: 6,
            name: '慢羊羊',
            score: 93.99,
            img: 'https://img.pawpaw18.cn/user-img/cbbabbc6352e4443b94732e43b908c44.png',
            num: 352
        },
        {
            id: 7,
            name: '暖羊羊',
            score: 92.74,
            img: 'https://img.pawpaw18.cn/user-img/cbbabbc6352e4443b94732e43b908c44.png',
            num: 172
        },
        {
            id: 8,
            name: '灰太狼',
            score: 91.12,
            img: 'https://img.pawpaw18.cn/user-img/cbbabbc6352e4443b94732e43b908c44.png',
            num: 552
        },
        {
            id: 9,
            name: '懒羊羊',
            score: 90.23,
            img: 'https://img.pawpaw18.cn/user-img/cbbabbc6352e4443b94732e43b908c44.png',
            num: 152
        },
        {
            id: 10,
            name: '沸羊羊',
            score: 89.84,
            img: 'https://img.pawpaw18.cn/user-img/cbbabbc6352e4443b94732e43b908c44.png',
            num: 155
        },
    ]
    const textMap: any = {
        1: '巅峰赛积分榜',
        2: 'AC数量榜',
        3: '正确率榜'
    }
    const [showRankType, setShowRankType] = useState(1)
    const filteredColumns = columns.filter((column: any) => {
        if (column.key === 'num') {
            return showRankType === 2; // 只在 showRankType 为 1 时显示 AC题目数量
        }
        if (column.key === 'nickName') {
            return showRankType === 1; // 只在 showRankType 为 2 时显示 竞赛得分
        }
        if (column.key === 'rate') {
            return showRankType === 3; // 只在 showRankType 为 2 时显示 竞赛得分
        }
        return true; // 其他列始终显示
    });

    useEffect(() => {
        initData()
        // setRankList(rankAcList)
    }, []);
    const initData = () => {
        getRankingList().then(res => {
            if (res.status) {
                console.log("接口返回的shi:", res.data.pointList)
                if (res.data.pointList.length === 10) {
                    setRankList(res.data.pointList)
                } else {
                    let buArr = []
                    for (let i = 0; i < 10 - res.data.pointList.length; i++) {
                        console.log("长度是", 10 - res.data.pointList.length)
                        let item = {
                            avatarUrl: "https://img.pawpaw18.cn/user-img/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.svg",
                            nickName: '虚位以待',
                            examNum: '--',
                            pointScore: "--",
                            id: res.data.pointList.length + 1 + i
                        }
                        buArr.push(item)

                    }
                    setRankList([...res.data.pointList, ...buArr])
                }

            }
        })
    }

    const items: MenuProps['items'] = [
        {
            label: '竞赛榜',
            key: '1',
        },
        {
            label: 'AC数量榜',
            key: '2',
        },
        {
            label: '正确率榜',
            key: '3',
        },
    ];
    const handleMenuClick = (e: any) => {
        setShowRankType(e.key * 1)
        if (e.key == '1') {
            setRankList(rankAcList)
        } else if (e.key == '2') {
            setRankList(rankScoreList)
        }
    }
    const rankBox = (rankList:any) => (
        <div className="relative w-[48%] border border-red-500">
            <div className="flex w-full absolute left-[-25px] top-0 text-[20px] font-semibold text-[#bdc3c7]">
                <img src="https://static.leetcode.cn/cn-assets/webpack_bundles/images/china_map.e6e137c72.svg"
                     alt="" className="w-[62px] h-[30px]"/>{textMap[showRankType]}

            </div>
            {rankList.length > 0 ?
                <div>
                    <div className="w-full h-[200px] flex flex-col justify-start items-center mt-[10px]">
                        <div className="relative w-[90px] h-[90px] rounded-full flex justify-center items-center bg-gradient-to-b from-[#feea88] to-[#d7a807] shadow-[0_0_50px_rgba(0,0,0,0.15)]">
                            <img className="w-[calc(100%-10px)] h-[calc(100%-10px)] rounded-full bg-white/40 text-[#373737] text-[40px] opacity-75" src={rankList[0]?.avatarUrl} alt=""/>
                            <span className="absolute bottom-[-15px] bg-white rounded-lg px-2 py-0.5 text-[#ffa116] max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis">{rankList[0].nickName}</span>
                        </div>
                        <div className="flex w-full justify-around">
                            <div className="relative w-[90px] h-[90px] rounded-full flex justify-center items-center mt-[15px] bg-gradient-to-b from-white to-[#ababab] shadow-[0_0_50px_rgba(0,0,0,0.15)]">
                                <img className="w-[calc(100%-10px)] h-[calc(100%-10px)] rounded-full bg-white/40 text-[#373737] text-[40px] opacity-75" src={rankList[1]?.avatarUrl} alt=""/>
                                <span className="absolute bottom-[-15px] bg-white rounded-lg px-2 py-0.5 text-[#ffa116] max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis">{rankList[1].nickName}</span>
                            </div>
                            <div className="relative w-[90px] h-[90px] rounded-full flex justify-center items-center mt-[15px] bg-gradient-to-b from-[#facfa3] to-[#d77c44] shadow-[0_0_50px_rgba(0,0,0,0.15)]">
                                <img className="w-[calc(100%-10px)] h-[calc(100%-10px)] rounded-full bg-white/40 text-[#373737] text-[40px] opacity-75" src={rankList[2]?.avatarUrl} alt=""/>
                                <span className="absolute bottom-[-15px] bg-white rounded-lg px-2 py-0.5 text-[#ffa116] max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis">{rankList[2]?.nickName}</span>
                            </div>
                        </div>
                    </div>
                    <div className="my-[30px] mb-[20px] overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.15)]">
                        <Table size="small"
                               dataSource={rankList.slice(3)} columns={filteredColumns}
                               pagination={false}/>
                        <div className="flex justify-center items-center py-[15px] bg-white transition-all duration-300 hover:bg-[#fafafa]">
                    <span className="text-blue-600 transition-all duration-300 hover:text-[#2e51b3]">
                    显示更多
                </span></div>
                    </div>
                    <div className="mt-[5px] text-[12px] text-[#4c4948] mb-[30px]">
                        ①巅峰赛积分=在考试系统中，简单题目正确可获得1积分，中等题目正确可获得2积分，困难题目正确可获得3积分
                    </div>
                    {/*<div className={`${styles['tipStyle']} ${styles['tip']}`}>*/}
                    {/*    ②AC数量=简单题目正确数量*0.7+中等题目正确数量+困难题目正确数量*1.1*/}
                    {/*</div>*/}
                    {/*<div className={`${styles['tipStyle']} ${styles['tip']}`}>*/}
                    {/*    ③正确率=简单考试平均正确率*0.8+中等考试平均正确率*0.15+困难考试平均正确率*0.05*/}
                    {/*</div>*/}
                </div> : ''
            }
        </div>
    )
    return <div className="w-[98%] h-full flex justify-around items-center">
        <div style={{display: "none"}} className="w-[120px] absolute right-[10px] top-[10px]">
            <Dropdown menu={{
                items,
                onClick: handleMenuClick
            }} trigger={['click']}>
                <a onClick={(e) => e.preventDefault()}>
                 <span className="flex justify-center items-center text-blue-600 hover:text-[#2e51b3]">
                     <img src={SwitchIcon} alt="switch"/>
                     切换排行榜

                 </span>
                </a>
            </Dropdown>
        </div>

        {rankBox(rankList)}
        {rankBox(rankList)}
        {/*    <div style={{display: 'none'}} className={styles['bottomRank']}>*/}
        {/*        <div className={styles['headerTop']}>*/}
        {/*            <span style={{width: '50px', border: '1px solid red'}}>排名 </span>*/}
        {/*            <span style={{border: '1px solid red'}}>昵称</span>*/}
        {/*            <span>竞赛得分*/}

        {/*                        <Tooltip title="竞赛得分=简单考试平均分*0.8+中等考试平均分数*0.15+困难考试平均分*0.05"*/}
        {/*                                 color="purple">*/}
        {/*<InfoIcon className={styles['iconStyle']}></InfoIcon>*/}
        {/*    </Tooltip>*/}

        {/*              </span>*/}
        {/*        </div>*/}
        {/*        <ul className={styles['bottomRankUl']}>*/}

        {/*            {*/}
        {/*                rankList.slice(4).map((item: any, index: number) => {*/}
        {/*                    return <li key={item.id} className={styles['bottomRankLi']}>*/}
        {/*                        <span style={{*/}
        {/*                            width: '50px',*/}
        {/*                            border: '1px solid red',*/}
        {/*                            display: 'flex',*/}
        {/*                            justifyContent: 'center',*/}
        {/*                            alignItems: 'center'*/}
        {/*                        }}>{index + 4}</span>*/}
        {/*                        <div style={{width: '33%'}} className={styles['nickStyle']}>*/}
        {/*                            <img style={{marginRight: 15}} src={item.img} alt=""/>*/}
        {/*                            <span> {item.name} </span>*/}
        {/*                        </div>*/}


        {/*                        <span style={{width: '33%'}}*/}
        {/*                              className={styles['scoreStyle']}>{item.score}</span></li>*/}
        {/*                })*/}
        {/*            }*/}

        {/*        </ul>*/}
        {/*        <div className={styles['showMore']}>显示更多</div>*/}
        {/*    </div>*/}
    </div>
}
export default RankingList
