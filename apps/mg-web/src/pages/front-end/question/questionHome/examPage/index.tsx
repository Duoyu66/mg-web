
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import type { DrawerProps } from "antd";
import {
  Button,
  Checkbox,
  Drawer,
  Modal,
  Radio,
  Statistic,
  Tag,
  Flex,
  Progress,
  message,
} from "antd";
import {
  LeftOutlined,
  RightOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { useSubmitFinalScore } from "@/pages/front-end/question/hooks/useSubmitFinalScore";
import { useAddRecordOrError } from "@/pages/front-end/question/hooks/useAddRecordOrError";
import { useDeleteRecord } from "@/pages/front-end/question/hooks/useDeleteRecord";
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/";
import "prismjs/components/prism-java"; // 引入Java样式
import "prismjs/components/prism-bash.min.js"; // 引入Bash样式
import "prismjs/components/prism-typescript"; // 引入TypeScript样式
import "prismjs/plugins/line-numbers/prism-line-numbers.min.css"; // 行号插件的样式
import "prismjs/plugins/line-numbers/prism-line-numbers.min.js"; // 行号插件
import "prismjs/plugins/toolbar/prism-toolbar.min.css";
import "prismjs/plugins/toolbar/prism-toolbar.min.js";
import "prismjs/plugins/show-language/prism-show-language.min.js";
import fightingSvg from "./img/fighting.svg";
// Wave 组件占位，后续可替换为本地组件
import QICon from "./img/q.svg";
import SnoICon from "./img/sNo.svg";
import SyesICon from "./img/sYes.svg";

const { Countdown } = Statistic;

const ExamPage = () => {
  const nav = useNavigate();
  const location = useLocation();
  const allQuestion = location.state;
  const userId = localStorage.getItem("userId");
  const { questionList, firstQuestion, questionTypeList, difficulty, num } =
    allQuestion;
  const submitFinalScoreMutation = useSubmitFinalScore();
  const addRecordMutation = useAddRecordOrError();
  const deleteRecordMutation = useDeleteRecord();
  const [passedMinutes, setPassedMinutes] = useState(0);
  const [modeTime, setModeTime]: any = useState(() => {
    switch (num) {
      case 15:
        return 20;
      case 30:
        return 35;
      case 50:
        return 60;
      default:
        break;
    }
  }); //简单20、中等40、困难80
  const [deadline, setDeadline]: any = useState(
    Date.now() + 1000 * 60 * modeTime
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionType, setQuestionType] = useState({
    img: "",
    type: "",
  });
  const array: any = [];
  for (let i = 0; i < questionList.length; i++) {
    const item = {
      questionId: questionList[i].id,
      answer: "",
      difficulty: questionList[i].difficulty,
    };
    array.push(item);
  }
  const [answer, setAnswer]: any = useState({
    userId: userId,
    numAll: num,
    difficulty: difficulty,
    time: 0,
    doneList: array,
  });
  const [question, setQuestion]: any = useState(firstQuestion);
  const [options, setOptions]: any = useState([]);
  const [incompleteVisible, setIncompleteVisible] = useState(false);
  const [remainingMin, setRemainingMin] = useState(0);
  const [emptyAnswersCount, setEmptyAnswersCount] = useState(num); //初始化未做题目数
  const [tagColor, setTagColor] = useState("success");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [percent, setPercent] = useState<number>(0);
  const [showStar, setShowStar] = useState(firstQuestion.collection == "1");
  const [isPaused, setIsPaused] = useState(false);
  const [pauseTime, setPauseTime] = useState(0);
  useEffect(() => {
    const type = questionTypeList.find((item: any) => {
      return item.value == question.type;
    });
    setQuestionType({
      type: type.name,
      img: type.img,
    });
    setShowStar(questionList[questionIndex].collection == "1");
    setOptions(
      question.items.map((item: any, index: number) => {
        return {
          label: `${item.optionName}：${item.optionValue}`,
          value: item.optionName,
        };
      })
    );
    switch (question.difficulty) {
      case "easy":
        setTagColor("success");
        break;
      case "medium":
        setTagColor("warning");
        break;
      case "hard":
        setTagColor("error");
        break;
      default:
        break;
    }
  }, [questionIndex]);
  useEffect(() => {
    // getQuestionErrorOrRecord({
    //     id:userId,
    //     type:'1',
    //     current:'1',
    //     pageSize:'20'
    // }).then(res=>{
    //     console.log('收藏---',res)
    // })
    const count = answer.doneList.filter(
      (element: any) => element.answer == ""
    ).length;
    setEmptyAnswersCount(count);
    setPercent(((num - count) / num) * 100);
  }, [answer.doneList]);
  // 更新问题并触发语法高亮
  const nextQuestion = () => {
    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);
    setQuestion(questionList[nextIndex]);
  };

  const addCollection = () => {
    const data = {
      userId: userId,
      type: "1", //1是收藏
      questionId: questionList[questionIndex].id,
      questionName: questionList[questionIndex].title,
    };
    //添加收藏
    addRecordMutation.mutate(data, {
      onSuccess: (res: any) => {
        if (res.status) {
          message.success("收藏成功~");
          questionList[questionIndex].collection = "1";
          setShowStar(true);
        } else {
          message.error(res.msg);
        }
      },
    });
  };
  const deleteCollection = () => {
    const data = {
      userId: userId,
      type: "-1", //-1取消收藏
      questionId: questionList[questionIndex].id,
    };
    deleteRecordMutation.mutate(data, {
      onSuccess: (res: any) => {
        if (res.status) {
          message.warning("已取消收藏");
          questionList[questionIndex].collection = "-1";
          setShowStar(false);
        } else {
          message.error(res.msg);
        }
      },
    });
  };

  const prevQuestion = () => {
    const prevIndex = questionIndex - 1;
    setQuestionIndex(prevIndex);
    setQuestion(questionList[prevIndex]);
  };
  const appointQuestion: any = (index: number) => {
    setQuestionIndex(index);
    setQuestion(questionList[index]);
    onClose();
  };
  const handleOk = () => {
    setIncompleteVisible(false);
    if (
      (difficulty == "easy" && passedMinutes <= 3) ||
      (difficulty == "medium" && passedMinutes <= 10) ||
      (difficulty == "hard" && passedMinutes <= 20)
    ) {
      return;
    }
    submitFinalScoreMutation.mutate(answer, {
      onSuccess: (res: any) => {
        if (res.status) {
          nav("/question/finishPage", { state: res.data });
        }
      },
    });
  };

  const handleCancel = () => {
    setIncompleteVisible(false);
  };
  const submitAnwser = () => {
    setSubmitLoading(true);
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
      setIncompleteVisible(true);
      setSubmitLoading(false);
    } else {
      submitFinalScoreMutation.mutate(answer, {
        onSuccess: (res: any) => {
          if (res.status) {
            nav("/question/finishPage", { state: res.data });
          }
        },
        onSettled: () => {
          setSubmitLoading(false);
        },
      });
    }
  };
  const radioChange = (e: any) => {
    console.log("e", e);
    setAnswer((prevState: any) => ({
      ...prevState,
      doneList: prevState.doneList.map((item: any, i: number) =>
        i === questionIndex ? { ...item, answer: e.target.value } : item
      ),
    }));
  };
  const checkboxChange = (checkedValues: any) => {
    console.log("checked = ", checkedValues);
    setAnswer((prevState: any) => ({
      ...prevState,
      doneList: prevState.doneList.map((item: any, i: number) =>
        i === questionIndex ? { ...item, answer: checkedValues.join("") } : item
      ),
    }));
  };
  const onFinish = () => {
    console.log("时间到");
    //倒计时结束直接交卷
    submitFinalScoreMutation.mutate(answer, {
      onSuccess: (res: any) => {
        if (res.status) {
          nav("/question/finishPage", { state: res.data });
        }
      },
    });
  };
  const getPassedTime = (time: any) => {
    const remainingTime = deadline - Date.now();
    const seconds = Math.floor(remainingTime / 1000);
    setAnswer((prevState: any) => ({
      ...prevState,
      time: modeTime * 60 - seconds,
    }));
    setPassedMinutes((modeTime * 60 - seconds) / 60);
  };
  const formatProgress: any = (percent: number) => {
    return percent == 100 ? "已完成" : `待做${emptyAnswersCount}题`;
  };
  const content: any = {
    __html: question.content,
  };
  // 使用 useEffect 处理 Prism 语法高亮
  useEffect(() => {
    Prism.highlightAll(); // 只有当问题内容更新时才会执行
  }, [question.content]);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] =
    useState<DrawerProps["placement"]>("bottom");
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const goQuestionHome = () => {
    nav("/question/questionHome");
  };

  const togglePause = () => {
    if (isPaused) {
      const pausedDuration = Date.now() - pauseTime;
      setDeadline(deadline + pausedDuration);
      setIsPaused(false);
    } else {
      setPauseTime(Date.now());
      setIsPaused(true);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-start bg-[#F7F9FE] pb-[60px]">
      <div className="w-full bg-white shadow-md h-16 flex items-center justify-between px-6 fixed top-0 left-0 z-10">
        <Button onClick={goQuestionHome} type="link">
          <LeftOutlined />
          返回答题
        </Button>
        <div className="text-lg font-bold">2025年秋招-技术岗-第一批笔试</div>
        <div className="flex items-center gap-4">
          <Button onClick={submitAnwser} type="primary" danger>
            交卷
          </Button>
          <div onClick={togglePause} className="cursor-pointer">
            <Countdown
              format="mm:ss"
              onChange={getPassedTime}
              value={isPaused ? pauseTime : deadline}
              onFinish={onFinish}
            />
          </div>
        </div>
      </div>
      <div className="w-4/5 h-auto bg-white rounded-lg mt-20 pb-5">
        <div className="w-full h-[60px] border-b border-[#F0F2F5] flex items-center justify-between px-5 relative">
          <div className="text-base font-semibold text-[#333] flex items-center">
            <Tag icon={<PaperClipOutlined />} bordered={false} color="blue">
              {question.questionType == "1" ? "单选题" : "不定项选择"}
            </Tag>
            {questionIndex + 1}、 {question.title}
          </div>
          <div className="flex items-center">
            <Tag
              style={{ marginRight: 20 }}
              icon={<img src={questionType.img} alt="" />}
              color="default"
            >
              {questionType.type}
            </Tag>
            <Tag color={tagColor}>{question.difficulty}</Tag>
          </div>
          <div className="absolute bottom-[-1px] left-0 w-full h-[10px]" style={{ backgroundImage: 'url(./img/wave.svg)' }}>
            <div className="absolute bottom-[-1px] left-0 w-full h-[10px]" style={{ backgroundImage: 'url(./img/wave.svg)' }} />
          </div>
        </div>

        <div style={{ backgroundColor: "#f7f9fe" }}>
          <div className="p-5 bg-[#f7f9fe]">
            <div
              className="bg-[#2D2D2D] rounded-lg p-4 text-[#ccc] text-sm leading-6 whitespace-pre-wrap break-words line-numbers pre-mac"
              dangerouslySetInnerHTML={content}
            ></div>
          </div>
        </div>
        <div className="p-5">
          {question.questionType == "1" ? (
            <Radio.Group
              className="w-full flex flex-col"
              onChange={radioChange}
              value={answer.doneList[questionIndex]?.answer}
              options={options}
            />
          ) : (
            <Checkbox.Group
              className="w-full flex flex-col"
              options={options}
              value={answer.doneList[questionIndex]?.answer}
              onChange={checkboxChange}
            />
          )}
        </div>
      </div>
      <Modal open={incompleteVisible} onOk={handleOk} onCancel={handleCancel}>
        <div className="w-full flex items-center justify-center my-2.5">
          <img src={fightingSvg} alt="" />
        </div>
        <div className="w-full flex items-center justify-center my-2.5">
          {
            // remainingMin ?
            // <span>当前模式最短作答时间为<span className={styles['modalSpan']}>{remainingMin}分钟</span>，请稍后重新提交答案。</span> :
            <span>
              您当前还有
              <span className="text-red-500 text-lg mx-1">{emptyAnswersCount}道</span>
              题目未作答，确定交卷吗？
            </span>
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
        className="rounded-t-2xl"
      >
        <div className="w-full flex flex-wrap">
          {questionList.map((item: any, index: number) => (
            <div
              key={item.id}
              onClick={() => appointQuestion(index)}
              className={`w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center m-2.5 cursor-pointer ${
                questionIndex === index ? 'border-blue-700 text-blue-700' : ''
              } ${
                answer.doneList.find((ele: any) => item.id === ele.questionId)
                  .answer
                  ? 'bg-blue-100 border-blue-700'
                  : ''
              }`}
            >
              <span>{index + 1}</span>
            </div>
          ))}
        </div>
      </Drawer>
      <div className="w-full h-[60px] bg-white fixed bottom-0 left-0 shadow-[0_-2px_10px_0_rgba(0,0,0,0.1)]">
        <div className="w-4/5 h-full mx-auto flex items-center justify-between">
          <div onClick={showDrawer} className="flex items-center cursor-pointer">
            <img src={QICon} style={{ marginRight: 5 }} alt="q" />
            答题卡
          </div>
          <div className="flex items-center">
            <div className="mr-5">
              {showStar ? (
                <img
                  src={SyesICon}
                  onClick={deleteCollection}
                  className="w-6 h-6 cursor-pointer"
                  alt="yes"
                />
              ) : (
                <img
                  src={SnoICon}
                  onClick={addCollection}
                  className="w-6 h-6 cursor-pointer"
                  alt="no"
                />
              )}
            </div>
            <Button
              onClick={goQuestionHome}
              type="default"
              className="mx-2.5"
            >
              返回刷题主页
            </Button>
            <Button
              disabled={questionIndex == 0}
              onClick={prevQuestion}
              type="primary"
              className="mx-2.5"
            >
              <LeftOutlined />
              <span className="mx-1">上一题</span>
            </Button>
            <Button
              disabled={questionIndex == questionList.length - 1}
              onClick={nextQuestion}
              type="primary"
              className="mx-2.5"
            >
              <span className="mx-1">下一题</span>
              <RightOutlined />
            </Button>
          </div>
          <Button
            className="justify-self-end mr-4"
            loading={submitLoading}
            onClick={submitAnwser}
            type="primary"
            danger={true}
          >
            立即交卷
          </Button>
        </div>
      </div>
      <Modal
        open={isPaused}
        closable={false}
        footer={null}
        centered
        maskClosable={false}
      >
        <div className="flex flex-col items-center justify-center p-8">
          <img src={fightingSvg} alt="暂停" className="w-24 h-24 mb-4" />
          <div className="text-2xl font-bold mb-4">暂停中</div>
          <Button type="primary" onClick={togglePause}>
            继续答题
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ExamPage;
