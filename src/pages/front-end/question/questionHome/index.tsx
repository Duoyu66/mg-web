import ExamIcon from "./img/exam.svg";
import { useEffect, useState } from "react";
import { useGetExamList } from "@/pages/front-end/question/hooks/useGetExamList";
import { useGetQuestionType } from "@/pages/front-end/question/hooks/useGetQuestionType";
import { useGetLvInfo } from "@/pages/front-end/question/hooks/useGetLvInfo";
import { useAddLvExp } from "@/pages/front-end/question/hooks/useAddLvExp";
import {
  Button,
  Checkbox,
  Descriptions,
  notification,
  GetProp,
  Modal,
  Popconfirm,
  Progress,
  Radio,
  Skeleton,
  Tabs,
} from "antd";
import { useNavigate } from "react-router-dom";
import { themeColor } from "../../settings/theme";
import { DotChartOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import FighttingIcon from "./img/fightting.svg";
import InfoIcon from "./img/info.svg";
import FenXiIcon from "./img/fenxi.svg";
import RuKouIcon from "./img/rukou.svg";
import TypeIcon from "./img/type.svg";
import TipIcon from "./img/tip.svg";
import INavIcon from "./img/iNav.svg";
import PNavIcon from "./img/pNav.svg";
import TNavIcon from "./img/tNav.svg";

import LineChart from "@/pages/front-end/question/questionHome/chart/lineChart";
import RankingList from "@/pages/front-end/question/questionHome/rankingList";
import { lvData } from "@/pages/front-end/question/questionHome/lv/data";
import { coinChange } from "../../utils/tools";

const QuestionHome = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const { nickName, avatarUrl }: any = userInfo;
  const userId = "4500fbd3-5e3c-407b-b158-51e1ed19ee3a";
  const { data: typeRes, isLoading: laodingType } = useGetQuestionType({
    id: "4500fbd3-5e3c-407b-b158-51e1ed19ee3a",
  });
  const { data: lvInfoRes, refetch: refetchLvInfo } = useGetLvInfo({
    id: userId,
  });
  const getExamListMutation = useGetExamList();
  const addLvExpMutation = useAddLvExp();
  const nav = useNavigate();
  //类型列表
  const [typeList, setTypeList] = useState([]);
  const [userQuestionInfoObj, setUserQuestionInfoObj]: any = useState({});

  const [lvInfo, setLvInfo] = useState({
    lv: 0,
    exp: 0,
    nextLvExp: 0,
    lastLvExp: 0,
    dailySign: "0",
  });
  useEffect(() => {
    if (!lvInfoRes?.status) return;
    const exp = lvInfoRes.data.exp;
    let lv = 1; // 默认1级
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
      nextLvExp:
        lvData[nextLv - 1]?.children || lvData[lvData.length - 1].children, // 安全访问
      lastLvExp: lv > 1 ? lvData[lv - 2].children : 0, // 上一级经验
      dailySign: lvInfoRes.data.dailySign,
    }));
  }, [lvInfoRes]);
  const CustomDescription = () => (
    <div>
      <ul className="w-[445px] flex flex-wrap">
        <li className="flex justify-center items-center w-[100px]">
          简单题目积分
        </li>
        <li className="flex justify-center items-center w-[15px]">+</li>
        <li className="flex justify-center items-center w-[100px]">
          中等题目积分
        </li>
        <li className="flex justify-center items-center w-[15px]">+</li>
        <li className="flex justify-center items-center w-[100px]">
          困难题目积分
        </li>
        <li className="flex justify-center items-center w-[15px]">=</li>
        <li className="flex justify-center items-center w-[100px]">竞赛积分</li>

        <li className="flex justify-center items-center w-[100px]">
          {userQuestionInfoObj.qdScoreData.easyAcNum == null
            ? 0
            : userQuestionInfoObj.qdScoreData.easyAcNum}
          *1
        </li>
        <li className="flex justify-center items-center w-[15px]">+</li>
        <li className="flex justify-center items-center w-[100px]">
          {userQuestionInfoObj.qdScoreData.medAcNum == null
            ? 0
            : userQuestionInfoObj.qdScoreData.medAcNum}
          *2
        </li>
        <li className="flex justify-center items-center w-[15px]">+</li>
        <li className="flex justify-center items-center w-[100px]">
          {userQuestionInfoObj.qdScoreData.hardAcNum == null
            ? 0
            : userQuestionInfoObj.qdScoreData.hardAcNum}
          *3
        </li>
        <li className="flex justify-center items-center w-[15px]">=</li>
        <li className="flex justify-center items-center w-[100px]">
          {userQuestionInfoObj.qdScoreData.easyAcNum +
            userQuestionInfoObj.qdScoreData.medAcNum * 2 +
            userQuestionInfoObj.qdScoreData.hardAcNum * 3}
        </li>
        <li className="w-full">
          超越了本站 {userQuestionInfoObj.qdScoreData.surpass}% 的小伙伴~
        </li>
      </ul>
    </div>
  );
  const RateDescription = () => (
    <div>
      <ul className="w-[160px] flex flex-wrap">
        <li className="w-[75%] flex justify-center items-center">
          简单难度正确率:
        </li>
        <li className="w-[25%] flex justify-center items-center text-[#2e51b3] font-bold">
          {userQuestionInfoObj?.qdAcRateData?.easyAcRate}%
        </li>
        <li className="w-[75%] flex justify-center items-center">
          中等难度正确率:
        </li>
        <li className="w-[25%] flex justify-center items-center text-[#2e51b3] font-bold">
          {userQuestionInfoObj?.qdAcRateData?.mediumAcRate}%
        </li>
        <li className="w-[75%] flex justify-center items-center">
          困难难度正确率:
        </li>
        <li className="w-[25%] flex justify-center items-center text-[#2e51b3] font-bold">
          {userQuestionInfoObj?.qdAcRateData?.hardAcRate}%
        </li>
      </ul>
    </div>
  );
  const ScoreDescription = () => (
    <div>
      <ul className="w-[160px] flex flex-wrap">
        <li className="w-[75%] flex justify-center items-center">
          简单难度平均分:
        </li>
        <li className="w-[25%] flex justify-center items-center text-[#2e51b3] font-bold">
          {userQuestionInfoObj.qdAveScoreData.aveEasyScore.toFixed(2)}
        </li>
        <li className="w-[75%] flex justify-center items-center">
          中等难度平均分:
        </li>
        <li className="w-[25%] flex justify-center items-center text-[#2e51b3] font-bold">
          {userQuestionInfoObj.qdAveScoreData.aveMediumScore.toFixed(2)}
        </li>
        <li className="w-[75%] flex justify-center items-center">
          困难难度平均分:
        </li>
        <li className="w-[25%] flex justify-center items-center text-[#2e51b3] font-bold">
          {userQuestionInfoObj.qdAveScoreData.aveHardScore.toFixed(2)}
        </li>
      </ul>
    </div>
  );
  const [examPloay, setExamPloay] = useState({
    userId: userId,
    types: [],
    num: 15,
    difficulty: "easy",
    typesList: [],
  });
  const typeChange: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues: any
  ) => {
    setExamPloay((prev: any) => ({
      ...prev,
      types: checkedValues,
    }));
  };
  const difficultyChange = (e: any) => {
    setExamPloay((prev: any) => ({
      ...prev,
      difficulty: e.target.value,
    }));
  };
  const numChange = (e: any) => {
    setExamPloay((prev: any) => ({
      ...prev,
      num: e.target.value,
    }));
  };
  useEffect(() => {
    if (typeRes && (typeRes as any).status) {
      const res: any = typeRes;
      const typesTemp: any = [];
      const typesValue: any = [];
      setUserQuestionInfoObj(res.data.userQuestionInfoDataDto);
      setTypeList(res.data.questionTypeList);
      for (let i = 0; i < res.data.questionTypeList.length; i++) {
        const itemObj = {
          label: "",
          value: "",
        };
        itemObj.label = res.data.questionTypeList[i].name;
        itemObj.value = res.data.questionTypeList[i].value;
        typesTemp.push(itemObj);
        typesValue.push(res.data.questionTypeList[i].value);
      }
      setExamPloay((prevState: any) => ({
        ...prevState,
        typesList: typesTemp,
        types: typesValue,
      }));
    }
  }, [typeRes]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    console.log("打开弹窗按钮被点击了");
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
    console.log("examPloay", examPloay);
    getExamListMutation.mutate(examPloay, {
      onSuccess: (res: any) => {
        if (res.status) {
          nav("/question/examPage", {
            state: {
              questionList: res.data,
              firstQuestion: res.data[0],
              questionTypeList: typeList,
              difficulty: examPloay.difficulty,
              num: examPloay.num,
            },
          });
        }
      },
    });
  };
  const tipStr = (rank: number) => {
    if (rank == 1) {
      return "超越巅峰榜第2名";
    } else if (rank == 2) {
      return "距离超越巅峰榜第1名";
    } else if (rank == 3) {
      return "距离超越巅峰榜第2名";
    } else if (rank > 3 && rank <= 10) {
      return "距离超越巅峰榜第3名";
    } else {
      return "距离超越巅峰榜第10名";
    }
  };
  const questionPart = () => (
    <div>
      <div className="text-[22px] font-bold text-[#4c4948] flex justify-start items-center my-[15px]">
        <img src={RuKouIcon} alt="入口" />
        快捷入口
      </div>
      <ul className="flex flex-wrap items-center">
        <li
          className="m-[12px_5px] bg-white transition-all duration-300 rounded-xl w-[150px] flex justify-around items-center hover:-translate-y-1 hover:scale-105 hover:shadow-[0_4px_10px_#00adff4d] hover:bg-[#2e51b3]"
          onClick={showModal}
        >
          <img src={ExamIcon} alt="考试" />
          <div className="px-[3px] w-[calc(100%-50px)] h-full">
            <span className="text-[16px] font-bold text-[#4c4948]">
              模拟考试
            </span>
            <span className="text-[12px] my-[5px] text-[#786f6f]">
              仿真冲刺
            </span>
          </div>
        </li>

        <li className="m-[12px_5px] mt-3 p-3 w-[150px] bg-white rounded-xl transition-all duration-300 ease-in-out flex justify-around items-center hover:-translate-y-1 hover:scale-105 hover:shadow-[0_4px_10px_#00adff4d] hover:bg-[#2e51b3]">
          <img src={ExamIcon} alt="考试" />
          <div className="px-[3px] w-[calc(100%-50px)] h-full">
            <span className="text-[16px] font-bold text-[#4c4948]">
              顺序练习
            </span>
            <span className="text-[12px] my-[5px] text-[#786f6f]">
              仿真冲刺
            </span>
          </div>
        </li>

        <li className="m-[12px_5px] mt-3 p-3 w-[150px] bg-white rounded-xl transition-all duration-300 ease-in-out flex justify-around items-center hover:-translate-y-1 hover:scale-105 hover:shadow-[0_4px_10px_#00adff4d] hover:bg-[#2e51b3]">
          <img src={ExamIcon} alt="考试" />
          <div className="px-[3px] w-[calc(100%-50px)] h-full">
            <span className="text-[16px] font-bold text-[#4c4948]">
              我的错题
            </span>
            <span className="text-[12px] my-[5px] text-[#786f6f]">
              仿真冲刺
            </span>
          </div>
        </li>
        <li className="m-[12px_5px] bg-white transition-all duration-300 rounded-xl w-[150px] flex justify-around items-center hover:-translate-y-1 hover:scale-105 hover:shadow-[0_4px_10px_#00adff4d] hover:bg-[#2e51b3]">
          <img src={ExamIcon} alt="考试" />
          <div className="px-[3px] w-[calc(100%-50px)] h-full">
            <span className="text-[16px] font-bold text-[#4c4948]">
              我的收藏
            </span>
            <span className="text-[12px] my-[5px] text-[#786f6f]">
              仿真冲刺
            </span>
          </div>
        </li>
        <li className="m-[12px_5px] mt-3 p-3 w-[150px] bg-white rounded-xl transition-all duration-300 ease-in-out flex justify-around items-center hover:-translate-y-1 hover:scale-105 hover:shadow-[0_4px_10px_#00adff4d] hover:bg-[#2e51b3]">
          <img src={ExamIcon} alt="考试" />
          <div className="px-[3px] w-[calc(100%-50px)] h-full">
            <span className="text-[16px] font-bold text-[#4c4948]">
              我的考试
            </span>
            <span className="text-[12px] my-[5px] text-[#786f6f]">
              仿真冲刺
            </span>
          </div>
        </li>
      </ul>
      <div className="text-[22px] font-bold text-[#4c4948] flex justify-start items-center my-[15px]">
        <img src={TypeIcon} alt="类型" />
        专项练习
      </div>
      <ul className="flex flex-wrap items-start min-h-0">
        {laodingType &&
          [1, 2, 3, 4, 5, 6, 7, 8].map((item: any) => {
            return (
              <li key={item} className="m-[10px_12px] rounded-xl">
                <Skeleton.Node style={{ width: 180, height: 90 }} active={true}>
                  <DotChartOutlined
                    style={{ fontSize: 40, color: "#bfbfbf" }}
                  />
                </Skeleton.Node>
              </li>
            );
          })}

        {!laodingType &&
          typeList.map((item: any, index: number) => {
            return (
              <li className="bg-white flex flex-wrap min-w-[180px] h-[100px] m-[10px_12px] p-2 rounded-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:shadow-[0_4px_10px_#00adff4d] hover:bg-[#2e51b3]">
                <div className="w-[50px] mr-2 flex justify-center items-center">
                  <img src={item.img} alt="" />
                </div>
                <div>
                  <div className="text-[16px] font-bold text-[#4c4948]">
                    {item.name}
                  </div>
                  <div className="text-[12px] my-[5px] text-[#786f6f]">
                    {" "}
                    已完成{item.computedNum}/总共{item.allNum}
                  </div>
                  <Progress
                    percent={parseFloat(
                      ((item.computedNum / item.allNum) * 100).toFixed(2)
                    )}
                    percentPosition={{ align: "end", type: "outer" }}
                    size={[100, 15]}
                    strokeColor={themeColor}
                  />
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
  const userInfoPart = () => (
    <div>
      <div className="text-[22px] font-bold text-[#4c4948] flex justify-start items-center my-[15px]">
        <img src={FenXiIcon} alt="分析" />
        题目分析
      </div>

      {/*
                    1：您当前在本站的排名是第1名，超越巅峰榜第2名xxx分，继续加油吧！
                    2：您当前在本站的排名是第2名，距离超越巅峰榜第1名还差xxx分，继续加油吧！
                    3：您当前在本站的排名是第3名，距离超越巅峰榜第2名还差xxx分，继续加油吧！
                   3-10：您当前在本站的排名是第x名，距离超越巅峰榜第3名还差xxx分，继续加油吧！
                   >10：您当前在本站的排名是第x名，距离超越巅峰榜第10名(上榜)还差xxx分，继续加油吧！
                    */}
      <div className="overflow-hidden rounded-xl flex justify-around w-full">
        <ul className="rounded-xl bg-white w-[48%] flex flex-wrap">
          <li className="pb-[15px] flex flex-col justify-center items-center w-1/2">
            <span className="text-[36px] py-[15px] text-[#2e51b3]">
              {laodingType
                ? "--"
                : userQuestionInfoObj?.qdScoreData?.easyAcNum +
                  userQuestionInfoObj?.qdScoreData?.medAcNum * 2 +
                  userQuestionInfoObj?.qdScoreData?.hardAcNum * 3}
            </span>
            <span className="text-[18px] text-[#656a6a] flex justify-center items-center">
              竞赛积分
              <Popconfirm
                icon={null}
                trigger="hover"
                placement="top"
                title={null}
                showCancel={false}
                okButtonProps={{ style: { display: "none" } }} // 隐藏确定按钮
                description={<CustomDescription />}
              >
                <img src={InfoIcon} alt="info" />
              </Popconfirm>
            </span>
          </li>
          <li className="pb-[15px] flex flex-col justify-center items-center w-1/2">
            <span className="text-[36px] py-[15px] text-[#2e51b3]">
              {laodingType
                ? "--"
                : userQuestionInfoObj?.qdAcRateData?.allAcRate}
              %
            </span>
            <span className="text-[18px] text-[#656a6a] flex justify-center items-center">
              正确率
              <Popconfirm
                icon={null}
                trigger="hover"
                placement="top"
                title={null}
                showCancel={false}
                okButtonProps={{ style: { display: "none" } }} // 隐藏确定按钮
                description={<RateDescription />}
              >
                <img src={InfoIcon} alt="info" />
              </Popconfirm>
            </span>
          </li>
          <li className="pb-[15px] flex flex-col justify-center items-center w-1/2">
            <span className="text-[36px] py-[15px] text-[#2e51b3]">
              {laodingType
                ? "--"
                : userQuestionInfoObj?.qdProgressData?.completedNum}
              /
              {laodingType
                ? "--"
                : userQuestionInfoObj?.qdProgressData?.totalNum}
            </span>
            <span className="text-[18px] text-[#656a6a] flex justify-center items-center">
              练习进度{" "}
            </span>
          </li>
          <li className="pb-[15px] flex flex-col justify-center items-center w-1/2">
            <span className="text-[36px] py-[15px] text-[#2e51b3]">
              {laodingType
                ? "--"
                : userQuestionInfoObj?.qdAveScoreData?.aveAllScore}
            </span>
            <span className="text-[18px] text-[#656a6a] flex justify-center items-center">
              平均分
              <Popconfirm
                icon={null}
                trigger="hover"
                placement="top"
                title={null}
                showCancel={false}
                okButtonProps={{ style: { display: "none" } }} // 隐藏确定按钮
                description={<ScoreDescription />}
              >
                <img src={InfoIcon} alt="info" />
              </Popconfirm>
            </span>
          </li>
          {/*<li className={styles['questionInfoLi']}>  <span className={styles['valueLi']}>3.25%</span>*/}
          {/*    <span className={styles['titleLi']}>困难题目正确率 </span></li>*/}
        </ul>
        <div className="w-[48%] border-none rounded-xl bg-white">
          {!laodingType && (
            <LineChart
              data={Array.from(
                { length: 10 },
                (v, i) => userQuestionInfoObj?.qdChartData?.dataList[i] || null
              )}
            ></LineChart>
          )}
        </div>
      </div>
    </div>
  );
  const rangPart = () => (
    <div className="flex justify-start items-center">
      <RankingList></RankingList>
    </div>
  );
  const lvPart = () => (
    <div>
      <ul>
        <li>每日签到 10-20经验 type:1</li>
        <li>评论文章/留言 一条10经验（每天限10条）type:2</li>
        <li>考试分数 90+ 经验100 80+ 经验60 60+ 经验20 60- 10经验 type:3</li>
        <li>随机练习/专项练习 错误 1经验 正确3经验 type:4</li>
        <li>专项练习（某个专项全部完成） (1+题目总数量/100)*500经验 type:5</li>
        <li>
          周榜 第一1500经验 第二 1000经验 第三 800 第三到第十500经验 type:6
        </li>
        <li>
          月榜 第一3000经验 第二 2000经验 第三 1500 第三到第十1000经验 type:7
        </li>
      </ul>
      <ul>
        <li> ️⭐️：1级</li>
        <li> ️🌙：4级</li>
        <li> ️🌞：16级</li>
        <li> ️👑：64级</li>
      </ul>
      <Descriptions
        size="small"
        column={10}
        title="等级介绍"
        layout="vertical"
        bordered
        items={lvData}
      />
    </div>
  );
  const tabsItem: any = [
    {
      label: (
        <>
          <div className="flex items-center">
            <img src={INavIcon} alt="i" className="mr-2" /> 工作台
          </div>
        </>
      ),
      key: "work",
      children: userInfoPart(),
    },
    {
      label: (
        <>
          <div className="flex items-center">
            <img src={TNavIcon} alt="t" className="mr-2" /> 题库
          </div>
        </>
      ),
      key: "l",
      children: questionPart(),
    },
    {
      label: (
        <>
          <div className="flex items-center">
            <img src={INavIcon} alt="i" className="mr-2" /> 个人分析
          </div>
        </>
      ),
      key: "analysis",
      children: userInfoPart(),
    },
    {
      label: (
        <>
          <div className="flex items-center">
            <img src={PNavIcon} alt="p" className="mr-2" /> 排行榜
          </div>
        </>
      ),
      key: "s",
      children: rangPart(),
    },
    {
      label: (
        <>
          <div className="flex items-center">
            <img src={PNavIcon} alt="p" className="mr-2" /> 等级系统
          </div>
        </>
      ),
      key: "ss",
      children: lvPart(),
    },
  ];
  const [isSign, setIsSign] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (exp: number) => {
    console.log("直观性了");
    api.open({
      title: "签到提醒",
      showProgress: true,
      duration: 3,
      closeIcon: false,
      message: "签到提醒",
      description: `恭喜你，通过每日签到获得了${exp}经验值！`,
      icon: <CheckCircleTwoTone style={{ color: "#108ee9" }} />,
    });
  };
  const signBtn = () => {
    if (lvInfo.dailySign === "0") {
      const exp = Math.floor(Math.random() * (25 - 15 + 1)) + 15;

      addLvExpMutation.mutate(
        { type: "1", userId, exp },
        {
          onSuccess: (res: any) => {
            if (res.status) {
              openNotification(exp);
              refetchLvInfo();
            }
          },
        }
      );
      setIsSign(true);
    }
  };
  //

  return (
    <div className="pt-5 flex flex-col items-center min-h-screen overflow-auto">
      {/*<div className={loading ? '' : `${commonStyles['loaded']}`}>*/}
      {/*    <FullScreenLoading></FullScreenLoading>*/}
      {/*</div>*/}
      <div className="w-full max-w-[1200px] flex justify-between relative">
        {/*<div className={styles['contentLeft']}>*/}

        {/*</div>*/}
        <div className="absolute left-0 right-0 w-[300px] z-10">
          <div className="w-full flex justify-start pl-[15px] items-center">
            <img
              className="w-[60px] h-[60px] rounded-[12px] border border-[#e5e5e5]"
              src="https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg"
              alt=""
            />
            <div className="pl-[10px] w-[calc(100%-90px)] h-full">
              <span className="text-[22px] font-bold text-[#4c4948]">
                {nickName}
              </span>
              <span className="flex justify-start items-center">
                {" "}
                <span className="w-[50px] h-[18px] text-white text-[14px] mr-[10px] rounded-[3px_12px_12px_12px] bg-[#59e476] flex items-center justify-center">
                  Lv.{lvInfo.lv}
                </span>
                <span className="flex justify-start items-center">
                  {coinChange([1, 4, 16, 64], lvInfo.lv)}
                </span>
              </span>

              <span className="w-[90%] flex">
                <span className="flex justify-start items-center">
                  <Progress
                    percent={
                      ((lvInfo.exp - lvInfo.lastLvExp) /
                        (lvInfo.nextLvExp - lvInfo.lastLvExp)) *
                      100
                    }
                    showInfo={false}
                  />
                  <img src={TipIcon} alt="tip" />
                </span>

                {lvInfo.lv !== 100 ? (
                  <span className="text-[12px] text-[#73767c]">
                    距离Lv.{lvInfo.lv + 1} 还需{lvInfo.nextLvExp - lvInfo.exp}
                    经验值
                  </span>
                ) : (
                  <span className="text-[12px] text-[#73767c]">
                    距离Lv.max 还需{9999999 - lvInfo.exp}经验值
                  </span>
                )}
              </span>
            </div>
          </div>
          <div
            className="my-[15px] flex justify-around items-center h-[80px] rounded-[8px]"
            style={{
              backgroundImage:
                'url("https://www.mianshiya.com/_next/image?url=%2Fassets%2Fimages%2Fvip%2FnormalCard.png&w=750&q=75")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="p-[15px] w-[65%]">
              <span className="text-[22px] text-[#4c4948]">今日签到</span>
              <br />
              <span className="text-[12px] text-[#857c7c]">
                随机获取10-20经验值
              </span>
            </div>
            <div className="w-[35%]">
              {contextHolder}
              <div
                className="mx-2 px-[3px] py-[5px] font-bold rounded-full bg-[#43403a] border-2 border-[#ede9e6] text-[#ffecba] cursor-pointer transition-opacity duration-300 flex justify-center items-center hover:opacity-80"
                onClick={signBtn}
              >
                {lvInfo.dailySign === "0" ? "立即签到" : "今日已签到"}
              </div>
            </div>
          </div>  
          <Button onClick={() => nav("/")}>返回首页</Button>
          <div
            style={{ display: "none" }}
            className="w-full flex justify-start items-center"
          >
            {userQuestionInfoObj?.qdRankData === null ? (
              "您还未参加考试，快来挑战自己吧~"
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                您当前在本站的排名是第{" "}
                <span className="mx-[2px] text-[20px] font-bold text-[#2e51b3] flex justify-center items-center">
                  {userQuestionInfoObj?.qdRankData?.rankNum}
                </span>
                名，
                {tipStr(userQuestionInfoObj?.qdRankData?.rankNum)}
                <span className="mx-[2px] text-[20px] font-bold text-[#2e51b3] flex justify-center items-center">
                  {" "}
                  {userQuestionInfoObj?.qdRankData?.opponentName}
                </span>
                {userQuestionInfoObj?.qdRankData?.rankNum != 1 ? "还差" : ""}
                <span className="mx-[2px] text-[20px] font-bold text-[#2e51b3] flex justify-center items-center">
                  {" "}
                  {userQuestionInfoObj?.qdRankData?.differenceNum}
                </span>
                分，加油鸭！
              </div>
            )}

            <img
              src={FighttingIcon}
              style={{ marginLeft: "5px" }}
              alt="fighting"
            />
          </div>
        </div>
      </div>
      <Tabs
        className={`max-w-[1200px] w-full h-[calc(100vh-100px)]`}
        animated={true}
        tabPosition={"left"}
        tabBarStyle={{ width: 300, marginTop: 215 }}
        items={tabsItem}
      />
      <div
        style={{ display: "none" }}
        className="w-[calc(100%-300px)] px-[15px] pl-[50px] flex flex-col"
      ></div>

      {/*    模拟考试弹窗*/}

      <Modal
        footer={null}
        title="模拟考试"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="w-full h-[400px] flex flex-col">
          <div className="my-[15px] flex items-center">
            <span className="min-w-[120px] text-[18px] font-bold flex justify-start items-center">
              {" "}
              题目类型：
            </span>{" "}
            <Checkbox.Group
              options={examPloay.typesList}
              defaultValue={examPloay.typesList.map((item: any) => item.value)}
              onChange={typeChange}
            />
          </div>
          <div className="my-[15px] flex items-center">
            <span className="min-w-[120px] text-[18px] font-bold flex justify-start items-center">
              {" "}
              题目难度：
            </span>
            <Radio.Group
              name="radiogroup"
              defaultValue={"easy"}
              onChange={difficultyChange}
              options={[
                { value: "easy", label: "简单" },
                { value: "medium", label: "中等" },
                { value: "hard", label: "困难" },
              ]}
            />
          </div>
          <div className="my-[15px] flex items-center">
            <span className="min-w-[120px] text-[18px] font-bold flex justify-start items-center">
              {" "}
              题目数量：
            </span>

            <Radio.Group
              name="radiogroup"
              defaultValue={15}
              onChange={numChange}
              options={[
                { value: 15, label: "15道" },
                { value: 30, label: "30道" },
                { value: 50, label: "50道" },
              ]}
            />
          </div>
        </div>
        <Button
          loading={getExamListMutation.isPending}
          type="primary"
          className="block mx-auto"
          onClick={getExamListFn}
        >
          开始测试
        </Button>
      </Modal>
    </div>
  );
};
export default QuestionHome;
