import { useState, useRef, useCallback, useMemo } from 'react';
import { Button, Card, Space, Tag, message, Spin, Divider, Progress } from 'antd';
import { PlayCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined, StopOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { executeCodeInSandbox } from '@/api/sandbox';

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  status?: 'pending' | 'running' | 'passed' | 'failed';
}

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  functionTemplate: string;
}

// 示例题目数据
const sampleProblem: Problem = {
  id: '1',
  title: '两数之和',
  description: `给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。`,
  difficulty: 'easy',
  examples: [
    {
      input: 'nums = [2,7,11,15], target = 9',
      output: '[0,1]',
      explanation: '因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。'
    },
    {
      input: 'nums = [3,2,4], target = 6',
      output: '[1,2]'
    },
    {
      input: 'nums = [3,3], target = 6',
      output: '[0,1]'
    }
  ],
  constraints: [
    '2 <= nums.length <= 10⁴',
    '-10⁹ <= nums[i] <= 10⁹',
    '-10⁹ <= target <= 10⁹',
    '只会存在一个有效答案'
  ],
  functionTemplate: `function twoSum(nums, target) {
    // 在这里编写你的代码
    
}`,
};

const defaultTestCases: TestCase[] = [
  {
    id: '1',
    input: 'nums = [2,7,11,15], target = 9',
    expectedOutput: '[0,1]',
    status: 'pending'
  },
  {
    id: '2',
    input: 'nums = [3,2,4], target = 6',
    expectedOutput: '[1,2]',
    status: 'pending'
  },
  {
    id: '3',
    input: 'nums = [3,3], target = 6',
    expectedOutput: '[0,1]',
    status: 'pending'
  }
];

export default function CodeEdit() {
  // 根据语言获取函数模板
  const getFunctionTemplate = (language: 'javascript' | 'java'): string => {
    if (language === 'java') {
      return `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // 在这里编写你的代码
        
    }
}`;
    }
    return sampleProblem.functionTemplate;
  };

  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'java'>('javascript');
  const [code, setCode] = useState<string>(getFunctionTemplate('javascript'));
  const [testCases, setTestCases] = useState<TestCase[]>(defaultTestCases);
  const [isRunning, setIsRunning] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [testProgress, setTestProgress] = useState({ completed: 0, total: 0, passed: 0, failed: 0 });
  const [executeResult, setExecuteResult] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);
  const cancelRef = useRef(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const changeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 当切换语言时，更新代码模板
  const handleLanguageChange = useCallback((language: 'javascript' | 'java') => {
    setSelectedLanguage(language);
    setCode(getFunctionTemplate(language));
  }, []);

  // 优化代码变更处理，使用防抖减少频繁更新
  const handleCodeChange = useCallback((value: string | undefined) => {
    // 清除之前的定时器
    if (changeTimeoutRef.current) {
      clearTimeout(changeTimeoutRef.current);
    }
    
    // 立即更新编辑器内容（Monaco Editor 内部处理）
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== value) {
        // 只在值真正改变时更新
        setCode(value || '');
      }
    } else {
      // 如果编辑器还没挂载，直接更新
      setCode(value || '');
    }
  }, []);

  // 解析输入参数（简单实现，实际应该更健壮）
  const parseInput = (inputStr: string): { nums: number[]; target: number } => {
    // 解析类似 "nums = [2,7,11,15], target = 9" 的字符串
    const numsMatch = inputStr.match(/nums\s*=\s*\[([^\]]+)\]/);
    const targetMatch = inputStr.match(/target\s*=\s*(\d+)/);
    
    if (!numsMatch || !targetMatch) {
      throw new Error('Invalid input format');
    }
    
    const nums = numsMatch[1].split(',').map(n => parseInt(n.trim(), 10));
    const target = parseInt(targetMatch[1], 10);
    
    return { nums, target };
  };

  // 构建可执行的完整代码（包装用户代码）
  const buildExecutableCode = (testCase: TestCase): string => {
    // 解析输入
    const { nums, target } = parseInput(testCase.input);
    
    if (selectedLanguage === 'java') {
      // Java 代码包装
      // 将 JavaScript 数组格式转换为 Java 数组格式
      const javaArrayStr = '{' + nums.join(', ') + '}';
      return `
${code}

// 执行测试
public class Main {
    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] nums = ${javaArrayStr};
        int target = ${target};
        int[] result = solution.twoSum(nums, target);
        System.out.println(java.util.Arrays.toString(result));
    }
}
      `.trim();
    } else {
      // JavaScript 代码包装
      return `
${code}

// 执行测试
const result = twoSum(${JSON.stringify(nums)}, ${target});
JSON.stringify(result);
      `.trim();
    }
  };

  // 执行代码（使用沙箱环境）
  const executeCode = async (testCase: TestCase): Promise<string> => {
    // 构建可执行代码
    const executableCode = buildExecutableCode(testCase);
    
    // 调用沙箱 API 执行代码
    const response = await executeCodeInSandbox({
      code: executableCode,
      language: selectedLanguage,
      input: testCase.input,
      timeout: 5000, // 5秒超时
    });
    
    if (response.success && response.output) {
      return response.output;
    } else {
      throw new Error(response.error || '代码执行失败');
    }
  };

  // 比较输出结果
  const compareOutput = (actual: string, expected: string): boolean => {
    try {
      const actualParsed = JSON.parse(actual);
      const expectedParsed = JSON.parse(expected);
      
      // 对于数组，比较内容是否相同（忽略顺序）
      if (Array.isArray(actualParsed) && Array.isArray(expectedParsed)) {
        return JSON.stringify(actualParsed.sort()) === JSON.stringify(expectedParsed.sort());
      }
      
      return actual === expected;
    } catch {
      // 如果解析失败，直接比较字符串
      return actual.trim() === expected.trim();
    }
  };

  // 运行单个测试用例（不显示消息提示，用于批量执行）
  const runTestCaseSilent = async (testCase: TestCase): Promise<{ passed: boolean; actualOutput: string; error?: string }> => {
    try {
      const actualOutput = await executeCode(testCase);
      const passed = compareOutput(actualOutput, testCase.expectedOutput);
      return { passed, actualOutput };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '执行出错';
      return { passed: false, actualOutput: `错误: ${errorMessage}`, error: errorMessage };
    }
  };

  // 运行测试用例（带UI反馈，用于单个执行）
  const runTestCase = async (testCaseId: string) => {
    const testCase = testCases.find(tc => tc.id === testCaseId);
    if (!testCase) return;

    // 更新状态为运行中
    setTestCases(prev => prev.map(tc => 
      tc.id === testCaseId ? { ...tc, status: 'running' } : tc
    ));

    const result = await runTestCaseSilent(testCase);
    
    setTestCases(prev => prev.map(tc => 
      tc.id === testCaseId 
        ? { 
            ...tc, 
            actualOutput: result.actualOutput, 
            status: result.passed ? 'passed' : 'failed' 
          } 
        : tc
    ));

    if (result.passed) {
      message.success(`测试用例 ${testCaseId} 通过`);
    } else {
      message.error(`测试用例 ${testCaseId} 失败`);
    }
  };

  // 批量并发执行测试用例（使用单个执行接口）
  const runAllTests = async () => {
    setIsRunning(true);
    setIsCancelled(false);
    cancelRef.current = false;
    
    const total = testCases.length;
    let completed = 0;
    let passed = 0;
    let failed = 0;
    
    // 初始化所有测试用例状态为 pending
    setTestCases(prev => prev.map(tc => ({ ...tc, status: 'pending' as const, actualOutput: undefined })));
    setTestProgress({ completed: 0, total, passed: 0, failed: 0 });

    // 并发控制：每次最多并发执行的数量
    const CONCURRENT_LIMIT = 10;
    
    try {
      // 分批并发执行
      for (let i = 0; i < testCases.length; i += CONCURRENT_LIMIT) {
        // 检查是否已取消
        if (cancelRef.current) {
          break;
        }

        const batch = testCases.slice(i, i + CONCURRENT_LIMIT);
        
        // 更新当前批次状态为运行中
        setTestCases(prev => prev.map(tc => 
          batch.some(b => b.id === tc.id) ? { ...tc, status: 'running' } : tc
        ));

        // 并发执行当前批次
        const batchResults = await Promise.allSettled(
          batch.map(async (testCase) => {
            if (cancelRef.current) {
              return { testCase, result: null };
            }
            const result = await runTestCaseSilent(testCase);
            return { testCase, result };
          })
        );

        // 批量更新结果
        const updates: Array<{ id: string; status: 'passed' | 'failed'; actualOutput: string }> = [];
        
        batchResults.forEach((settledResult, index) => {
          if (settledResult.status === 'fulfilled' && settledResult.value.result) {
            const { testCase, result } = settledResult.value;
            const status = result.passed ? 'passed' : 'failed';
            updates.push({
              id: testCase.id,
              status,
              actualOutput: result.actualOutput
            });
            
            completed++;
            if (result.passed) {
              passed++;
            } else {
              failed++;
            }
          } else if (settledResult.status === 'rejected' || !settledResult.value.result) {
            const testCase = batch[index];
            updates.push({
              id: testCase.id,
              status: 'failed',
              actualOutput: '执行失败'
            });
            completed++;
            failed++;
          }
        });

        // 批量更新状态
        setTestCases(prev => prev.map(tc => {
          const update = updates.find(u => u.id === tc.id);
          if (update) {
            return { ...tc, status: update.status, actualOutput: update.actualOutput };
          }
          return tc;
        }));

        // 更新进度
        setTestProgress({ completed, total, passed, failed });
      }

      // 显示最终统计结果
      if (!cancelRef.current) {
        if (failed === 0) {
          message.success(`所有 ${total} 个测试用例全部通过！`);
        } else {
          message.warning(`测试完成：${passed} 个通过，${failed} 个失败`);
        }
      } else {
        message.info('测试已取消');
      }
    } catch (error) {
      message.error('批量测试执行出错');
      console.error(error);
    } finally {
      setIsRunning(false);
      setIsCancelled(false);
      cancelRef.current = false;
    }
  };

  // 取消测试执行
  const cancelTests = useCallback(() => {
    cancelRef.current = true;
    setIsCancelled(true);
    setIsRunning(false);
    setTestCases(prev => prev.map(tc => 
      tc.status === 'running' ? { ...tc, status: 'pending' as const } : tc
    ));
    message.info('正在取消测试...');
  }, []);

  // 提交代码
  const handleSubmit = async () => {
    setIsRunning(true);
    try {
      // 运行所有测试用例
      await runAllTests();
      
      // 检查是否全部通过
      const allPassed = testCases.every(tc => tc.status === 'passed');
      
      if (allPassed) {
        message.success('🎉 恭喜！所有测试用例通过！');
        // 这里可以调用后端 API 提交代码
        // await submitCode(code, selectedLanguage);
      } else {
        const failedCount = testCases.filter(tc => tc.status === 'failed').length;
        message.warning(`有 ${failedCount} 个测试用例未通过，请检查代码`);
      }
    } catch {
      message.error('提交失败，请重试');
    } finally {
      setIsRunning(false);
    }
  };

  // 运行代码（直接调用后端接口）
  const handleRun = useCallback(async () => {
    // 从编辑器获取最新代码
    const currentCode = editorRef.current?.getValue() || code;
    
    if (!currentCode || currentCode.trim().length === 0) {
      message.warning('代码不能为空');
      return;
    }

    setIsExecuting(true);
    setExecuteResult('');

    try {
      const response = await executeCodeInSandbox({
        code: currentCode,
        language: selectedLanguage,
        timeout: 5000,
      });

      if (response.success && response.output) {
        setExecuteResult(response.output);
        message.success('代码执行成功');
      } else {
        const errorMsg = response.error || '代码执行失败';
        setExecuteResult(`错误: ${errorMsg}`);
        message.error(errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '执行出错';
      setExecuteResult(`错误: ${errorMsg}`);
      message.error(errorMsg);
    } finally {
      setIsExecuting(false);
    }
  }, [code, selectedLanguage]);

  // 重置代码
  const handleReset = useCallback(() => {
    const template = getFunctionTemplate(selectedLanguage);
    setCode(template);
    // 直接更新编辑器内容，避免重新渲染
    if (editorRef.current) {
      editorRef.current.setValue(template);
    }
    setTestCases(defaultTestCases.map(tc => ({ ...tc, status: 'pending', actualOutput: undefined })));
    setExecuteResult('');
    message.info('代码已重置');
  }, [selectedLanguage]);

  const getDifficultyColor = useCallback((difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'green';
      case 'medium': return 'orange';
      case 'hard': return 'red';
      default: return 'default';
    }
  }, []);

  const getStatusIcon = useCallback((status?: TestCase['status']) => {
    switch (status) {
      case 'running':
        return <Spin size="small" />;
      case 'passed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'failed':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return null;
    }
  }, []);

  // 优化 Monaco Editor 配置选项
  const editorOptions = useMemo(() => ({
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on' as const,
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'on' as const,
    // 性能优化选项
    renderWhitespace: 'none' as const,
    renderLineHighlight: 'none' as const,
    occurrencesHighlight: 'off' as const,
    selectionHighlight: false,
    codeLens: false,
    quickSuggestions: {
      other: false,
      comments: false,
      strings: false,
    },
    suggestOnTriggerCharacters: false,
    acceptSuggestionOnEnter: 'on' as const,
    tabCompletion: 'off' as const,
    wordBasedSuggestions: 'off' as const,
    // 禁用一些可能影响性能的功能
    hover: {
      enabled: true,
      delay: 300,
    },
    // 优化滚动性能
    smoothScrolling: true,
    cursorBlinking: 'smooth' as const,
    cursorSmoothCaretAnimation: 'off' as const,
  }), []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold m-0">{sampleProblem.title}</h1>
          <Tag color={getDifficultyColor(sampleProblem.difficulty)}>
            {sampleProblem.difficulty === 'easy' ? '简单' : sampleProblem.difficulty === 'medium' ? '中等' : '困难'}
          </Tag>
          <Space>
            <Button 
              size="small" 
              onClick={() => handleLanguageChange('javascript')}
              type={selectedLanguage === 'javascript' ? 'primary' : 'default'}
            >
              JavaScript
            </Button>
            <Button 
              size="small" 
              onClick={() => handleLanguageChange('java')}
              type={selectedLanguage === 'java' ? 'primary' : 'default'}
            >
              Java
            </Button>
          </Space>
        </div>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleReset}
            disabled={isRunning}
          >
            重置
          </Button>
          {isRunning ? (
            <Button 
              icon={<StopOutlined />} 
              onClick={cancelTests}
              danger
            >
              取消
            </Button>
          ) : (
            <Button 
              icon={<PlayCircleOutlined />} 
              onClick={handleRun}
              loading={isExecuting}
              type="default"
            >
              运行
            </Button>
          )}
          <Button 
            type="primary" 
            onClick={handleSubmit}
            loading={isRunning}
            disabled={isRunning}
          >
            提交
          </Button>
        </Space>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：题目描述 */}
        <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">题目描述</h2>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {sampleProblem.description}
              </div>
            </div>

            <Divider />

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">示例</h2>
              {sampleProblem.examples.map((example, index) => (
                <div key={index} className="mb-4 p-3 bg-gray-50 rounded">
                  <div className="mb-2">
                    <strong>示例 {index + 1}:</strong>
                  </div>
                  <div className="text-sm mb-1">
                    <strong>输入:</strong> <code className="bg-white px-1 py-0.5 rounded">{example.input}</code>
                  </div>
                  <div className="text-sm mb-1">
                    <strong>输出:</strong> <code className="bg-white px-1 py-0.5 rounded">{example.output}</code>
                  </div>
                  {example.explanation && (
                    <div className="text-sm text-gray-600 mt-1">
                      <strong>解释:</strong> {example.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Divider />

            <div>
              <h2 className="text-lg font-semibold mb-3">约束条件</h2>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {sampleProblem.constraints.map((constraint, index) => (
                  <li key={index}>{constraint}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 中间：代码编辑器 */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 border-b border-gray-200">
            <Editor
              height="100%"
              language={selectedLanguage}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={editorOptions}
              loading={<div className="flex items-center justify-center h-full">加载编辑器...</div>}
              onMount={(editor) => {
                editorRef.current = editor;
                // 优化编辑器性能
                editor.updateOptions({
                  renderWhitespace: 'none',
                  renderLineHighlight: 'none',
                });
              }}
            />
          </div>

          {/* 底部：执行结果和测试用例 */}
          <div className="h-64 bg-white overflow-y-auto">
            <div className="p-4">
              {/* 执行结果区域 */}
              <div className="mb-4">
                <h3 className="text-base font-semibold mb-2">执行结果</h3>
                <div className="p-3 bg-gray-50 rounded border border-gray-200 min-h-[60px]">
                  {isExecuting ? (
                    <div className="flex items-center gap-2 text-gray-500">
                      <Spin size="small" />
                      <span>正在执行...</span>
                    </div>
                  ) : executeResult ? (
                    <pre className="text-sm font-mono whitespace-pre-wrap break-words m-0">
                      {executeResult}
                    </pre>
                  ) : (
                    <div className="text-gray-400 text-sm">点击"运行"按钮执行代码</div>
                  )}
                </div>
              </div>

              <Divider />

              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold">测试用例</h3>
                {testProgress.total > 0 && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-600">通过: {testProgress.passed}</span>
                    <span className="text-red-600">失败: {testProgress.failed}</span>
                    <span className="text-gray-600">总计: {testProgress.completed}/{testProgress.total}</span>
                  </div>
                )}
              </div>
              {isRunning && testProgress.total > 0 && (
                <div className="mb-4">
                  <Progress 
                    percent={Math.round((testProgress.completed / testProgress.total) * 100)} 
                    status={isCancelled ? 'exception' : 'active'}
                    format={() => `${testProgress.completed}/${testProgress.total}`}
                  />
                </div>
              )}
              <div className="space-y-3">
                {testCases.map((testCase) => (
                  <Card 
                    key={testCase.id} 
                    size="small"
                    className="mb-2"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(testCase.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-2">
                          <strong className="text-sm">输入:</strong>
                          <div className="mt-1 p-2 bg-gray-50 rounded text-sm font-mono">
                            {testCase.input}
                          </div>
                        </div>
                        <div className="mb-2">
                          <strong className="text-sm">期望输出:</strong>
                          <div className="mt-1 p-2 bg-gray-50 rounded text-sm font-mono">
                            {testCase.expectedOutput}
                          </div>
                        </div>
                        {testCase.actualOutput && (
                          <div>
                            <strong className="text-sm">实际输出:</strong>
                            <div className={`mt-1 p-2 rounded text-sm font-mono ${
                              testCase.status === 'passed' 
                                ? 'bg-green-50 text-green-800' 
                                : 'bg-red-50 text-red-800'
                            }`}>
                              {testCase.actualOutput}
                            </div>
                          </div>
                        )}
                      </div>
                      <Button 
                        size="small" 
                        onClick={() => runTestCase(testCase.id)}
                        loading={testCase.status === 'running'}
                        disabled={isRunning}
                      >
                        运行
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
