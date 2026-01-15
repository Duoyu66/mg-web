import React, { useState, useRef } from 'react';
import { exercises } from './data';
import { Check, X, Star, MoreHorizontal, List, Square, ChevronDown } from 'lucide-react';
import { Button, Modal, Statistic } from 'antd';
import fightingSvg from "./img/fighting.svg";

const QuestionCard = ({
  exercise,
  qIndex,
  userAnswer,
  isSubmitted,
  isCorrect,
  getOptionClass,
  handleOptionClick,
  handleSubmit,
  questionRef,
  viewMode,
}) => (
  <div
    ref={questionRef}
    className="p-8 relative"
  >
    {(qIndex === 0 || viewMode === 'single') && (
      <div className="mb-6 absolute top-0 left-0 right-0">
        <img src="https://static.nowcoder.com/fe/file/oss/1668063570640XIBVS.png" alt="background" className="w-full " />
      </div>
    )}
    <div className="flex justify-between items-start mb-4">
      <div>
        <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
          {exercise.type === 'single' ? '单选题' : '多选题'}
        </span>
        <h3 className="text-lg font-semibold text-gray-800 mt-3">
          {qIndex + 1}. {exercise.question}
        </h3>
      </div>
      <div className="flex items-center gap-3 text-gray-400">
        <button className="hover:text-amber-500"><Star size={18} /></button>
        <button className="hover:text-gray-600"><MoreHorizontal size={20} /></button>
      </div>
    </div>
    
    <div className="space-y-3">
      {exercise.options.map((option, oIndex) => (
        <div
          key={oIndex}
          onClick={() => handleOptionClick(qIndex, oIndex)}
          className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${getOptionClass(qIndex, oIndex)}`}
        >
          <div className="w-6 text-center flex-shrink-0 font-semibold text-gray-500 mr-4">
            {String.fromCharCode(65 + oIndex)}
          </div>
          <span className="text-gray-700">{option}</span>
        </div>
      ))}
    </div>

    {isSubmitted ? (
      <div className="mt-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-2">答案解析</h4>
        <p className="text-gray-600 leading-relaxed">{exercise.explanation}</p>
        <div className="mt-3 font-semibold">
          {isCorrect(qIndex) 
            ? <span className="text-green-600 flex items-center"><Check size={16} className="mr-1"/>回答正确</span> 
            : <span className="text-red-600 flex items-center"><X size={16} className="mr-1"/>回答错误</span>
          }
        </div>
      </div>
    ) : (
      <div className="mt-6 text-right">
        <button
          onClick={() => handleSubmit(qIndex)}
          disabled={userAnswer === null || (Array.isArray(userAnswer) && userAnswer.length === 0)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          提交
        </button>
      </div>
    )}
  </div>
);

const ExercisePage = () => {
  const [viewMode, setViewMode] = useState<'list' | 'single'>('list');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | number[] | null)[]>(Array(exercises.length).fill(null));
  const [submittedQuestions, setSubmittedQuestions] = useState<boolean[]>(Array(exercises.length).fill(false));
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isPaused, setIsPaused] = useState(false);
  const [deadline, setDeadline] = useState(Date.now() + 1000 * 60 * 30); // 30 minutes
  const [pauseTime, setPauseTime] = useState(0);

  const [isCardExpanded, setIsCardExpanded] = useState(true);

  const togglePause = () => {
    if (isPaused) {
      const remainingTime = pauseTime - Date.now();
      setDeadline(Date.now() + remainingTime);
    } else {
      setPauseTime(deadline);
    }
    setIsPaused(!isPaused);
  };

  const handleOptionClick = (questionIndex: number, optionIndex: number) => {
    if (submittedQuestions[questionIndex]) return;

    const newAnswers = [...userAnswers];
    const currentAnswer = newAnswers[questionIndex];
    const exercise = exercises[questionIndex];

    if (exercise.type === 'single') {
      newAnswers[questionIndex] = optionIndex;
    } else {
      const answerSet = new Set(Array.isArray(currentAnswer) ? currentAnswer : []);
      if (answerSet.has(optionIndex)) {
        answerSet.delete(optionIndex);
      } else {
        answerSet.add(optionIndex);
      }
      newAnswers[questionIndex] = Array.from(answerSet).sort();
    }
    setUserAnswers(newAnswers);
  };

  const handleSubmit = (questionIndex: number) => {
    const newSubmitted = [...submittedQuestions];
    newSubmitted[questionIndex] = true;
    setSubmittedQuestions(newSubmitted);
  };

  const isCorrect = (index: number) => {
    const userAnswer = userAnswers[index];
    const correctAnswer = exercises[index].answer;
    if (userAnswer === null) return false;
    if (Array.isArray(correctAnswer)) {
      return JSON.stringify(userAnswer) === JSON.stringify(correctAnswer.sort());
    }
    return userAnswer === correctAnswer;
  };

  const getOptionClass = (questionIndex: number, optionIndex: number) => {
    const userAnswer = userAnswers[questionIndex];
    const exercise = exercises[questionIndex];
    const isSelected = Array.isArray(userAnswer) ? userAnswer.includes(optionIndex) : userAnswer === optionIndex;

    if (submittedQuestions[questionIndex]) {
      const correctAnswer = exercise.answer;
      const isCorrectAnswer = Array.isArray(correctAnswer) ? correctAnswer.includes(optionIndex) : correctAnswer === optionIndex;
      if (isCorrectAnswer) return 'bg-green-50 border-green-300 text-green-800';
      if (isSelected) return 'bg-red-100 border-red-400 text-red-800';
    }
    if (isSelected) return 'bg-blue-100 border-blue-400';
    return 'border-transparent hover:bg-gray-100';
  };

  const scrollToQuestion = (index: number) => {
    if (viewMode === 'list') {
      questionRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      setCurrentQuestionIndex(index);
    }
  };

  const completionPercentage = (submittedQuestions.filter(Boolean).length / exercises.length) * 100;

  return (
    <>
      <div className="w-full bg-white shadow-md h-16 flex items-center justify-between px-6 fixed top-0 left-0 z-10">
        <Button type="link">
          {/* <LeftOutlined /> */}
          返回
        </Button>
        <div className="text-lg font-bold">练习模式</div>
        <div className="flex items-center gap-4">
          <div onClick={togglePause} className="cursor-pointer">
            <Statistic.Countdown
              format="mm:ss"
              value={isPaused ? pauseTime : deadline}
            />
          </div>
        </div>
      </div>
      <div className="flex min-h-screen bg-gray-50 font-sans pt-16">
        <aside className="w-72 bg-white p-6 sticky top-16 h-[calc(100vh-4rem)] flex flex-col">
          <div 
            className="flex justify-between items-center cursor-pointer mb-6"
            onClick={() => setIsCardExpanded(!isCardExpanded)}
          >
            <h2 className="text-lg font-semibold">答题卡</h2>
            <ChevronDown 
              size={20} 
              className={`transition-transform duration-300 ${isCardExpanded ? 'rotate-180' : ''}`} 
            />
          </div>
          {isCardExpanded && (
            <div className="grid grid-cols-5 gap-3">
              {exercises.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToQuestion(index)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 text-sm font-medium transition-all duration-200 ${
                    submittedQuestions[index] && userAnswers[index] !== null
                      ? isCorrect(index)
                        ? 'bg-green-100 border-green-400 text-green-700'
                        : 'bg-red-100 border-red-400 text-red-700'
                      : currentQuestionIndex === index && viewMode === 'single'
                      ? 'bg-blue-500 border-blue-600 text-white'
                      : userAnswers[index] !== null
                      ? 'bg-teal-400 border-teal-500 text-white'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
          <div className="mt-auto pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-gray-600">
                <span>完成进度</span>
                <span>{Math.round(completionPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-10">
          <div className="max-w-4xl mx-auto">
            {viewMode === 'list' ? (
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
                {exercises.map((exercise, qIndex) => (
                  <QuestionCard
                    key={exercise.id}
                    exercise={exercise}
                    qIndex={qIndex}
                    userAnswer={userAnswers[qIndex]}
                    isSubmitted={submittedQuestions[qIndex]}
                    isCorrect={isCorrect}
                  getOptionClass={getOptionClass}
                  handleOptionClick={handleOptionClick}
                  handleSubmit={handleSubmit}
                  questionRef={(el) => (questionRefs.current[qIndex] = el)}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200">
              <QuestionCard
                key={exercises[currentQuestionIndex].id}
                exercise={exercises[currentQuestionIndex]}
                qIndex={currentQuestionIndex}
                userAnswer={userAnswers[currentQuestionIndex]}
                isSubmitted={submittedQuestions[currentQuestionIndex]}
                isCorrect={isCorrect}
                getOptionClass={getOptionClass}
                handleOptionClick={handleOptionClick}
                handleSubmit={handleSubmit}
                questionRef={null} // questionRef is not needed in single view mode
                viewMode={viewMode}
              />
            </div>
          )}
          </div>
        </main>

        <aside className="w-24 bg-white p-4 sticky top-16 h-[calc(100vh-4rem)] flex flex-col items-center gap-4">
          <button 
            onClick={() => setViewMode('list')}
            className={`w-16 h-16 flex flex-col items-center justify-center rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            <List size={20} />
            <span className="text-xs mt-1">列表</span>
          </button>
          <button 
            onClick={() => setViewMode('single')}
            className={`w-16 h-16 flex flex-col items-center justify-center rounded-lg transition-colors ${viewMode === 'single' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            <Square size={20} />
            <span className="text-xs mt-1">单题</span>
          </button>
        </aside>
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
            继续练习
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ExercisePage;
