import requestClient from '@/utils/requestClient';

export interface SandboxExecuteRequest {
    code: string;
    language: 'javascript' | 'java';
    input?: string;
    timeout?: number; // 超时时间（毫秒），默认 5000ms
}

export interface SandboxExecuteResponse {
    success: boolean;
    output?: string;
    error?: string;
    executionTime?: number; // 执行时间（毫秒）
    memoryUsage?: number; // 内存使用（KB）
}

/**
 * 在沙箱环境中执行代码
 * @param request 执行请求参数
 * @returns 执行结果
 */
// 后端统一响应格式
interface RResponse<T> {
    code: number;
    message: string;
    data: T;
}

export const executeCodeInSandbox = async (
    request: SandboxExecuteRequest
): Promise<SandboxExecuteResponse> => {
    try {
        // 调用后端沙箱 API
        const response = await requestClient.post<RResponse<string>>(
            '/api/sandbox/execute',
            {
                code: request.code,
                language: request.language,
                input: request.input,
                timeout: request.timeout || 5000,
            }
        );

        // requestClient 的响应拦截器已经返回了 res.data，所以 response 就是 R 对象
        // 提取 data 字段（后端返回的是字符串）
        const rResponse = response as unknown as RResponse<string>;
        if (rResponse && 'data' in rResponse && rResponse.data) {
            return {
                success: true,
                output: rResponse.data,
            };
        }
        
        // 如果没有 data 字段，可能是直接返回的结果（兼容处理）
        return {
            success: true,
            output: response as unknown as string,
        };
    } catch (error) {
        // 处理网络错误或超时
        if (error instanceof Error) {
            if (error.message.includes('timeout')) {
                return {
                    success: false,
                    error: '代码执行超时，请检查是否有死循环或无限递归',
                };
            }
            return {
                success: false,
                error: error.message || '代码执行失败',
            };
        }
        return {
            success: false,
            error: '未知错误',
        };
    }
};

export interface BatchTestRequest {
    code: string;
    language: 'javascript' | 'java';
    testCases: Array<{
        input: string;
        expectedOutput: string;
    }>;
    timeout?: number; // 超时时间（毫秒），默认 5000ms
}

export interface BatchTestResult {
    input: string;
    expectedOutput: string;
    actualOutput?: string;
    success: boolean;
    error?: string;
    executionTime?: number; // 执行时间（毫秒）
    memoryUsage?: number; // 内存使用（KB）
}

export interface BatchTestResponse {
    total: number; // 总测试用例数
    passed: number; // 通过的测试用例数
    failed: number; // 失败的测试用例数
    results: BatchTestResult[]; // 测试结果数组
    totalExecutionTime?: number; // 总执行时间（毫秒）
}

/**
 * 批量执行测试用例（使用后端批量测试接口）
 * @param request 批量测试请求参数
 * @returns 批量测试结果
 */
export const executeBatchTests = async (
    request: BatchTestRequest
): Promise<BatchTestResponse> => {
    try {
        const response = await requestClient.post<RResponse<BatchTestResponse>>(
            '/api/sandbox/batch-test',
            {
                code: request.code,
                language: request.language,
                testCases: request.testCases,
                timeout: request.timeout || 5000,
            }
        );

        // requestClient 的响应拦截器已经返回了 res.data，所以 response 就是 R 对象
        // 提取 data 字段
        const rResponse = response as unknown as RResponse<BatchTestResponse>;
        if (rResponse && 'data' in rResponse) {
            return rResponse.data;
        }
        
        // 如果没有 data 字段，可能是直接返回的结果（兼容处理）
        return response as unknown as BatchTestResponse;
    } catch (error) {
        // 处理网络错误或超时
        if (error instanceof Error) {
            throw new Error(error.message || '批量测试执行失败');
        }
        throw new Error('未知错误');
    }
};

/**
 * 批量执行测试用例（旧版本，逐个调用，已废弃，建议使用 executeBatchTests）
 * @param code 用户代码
 * @param language 编程语言
 * @param testCases 测试用例数组
 * @returns 执行结果数组
 * @deprecated 请使用 executeBatchTests 以获得更好的性能
 */
export const executeTestCases = async (
    code: string,
    language: 'javascript' | 'java',
    testCases: Array<{ input: string; expectedOutput: string }>
): Promise<Array<SandboxExecuteResponse & { input: string; expectedOutput: string }>> => {
    const results = await Promise.all(
        testCases.map(async (testCase) => {
            const result = await executeCodeInSandbox({
                code,
                language,
                input: testCase.input,
            });
            return {
                ...result,
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
            };
        })
    );

    return results;
};

