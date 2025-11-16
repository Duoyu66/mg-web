import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {ConfigProvider, theme} from 'antd'
import App from './App.tsx'
import {QueryClientProvider, QueryClient} from '@tanstack/react-query'
import {ThemeProvider} from './component/context/ThemeContext.tsx'
import {useTheme} from './component/context/useTheme.ts'
import {BrowserRouter} from 'react-router-dom'
// 创建 QueryClient 实例
const queryClient = new QueryClient()

// 包装组件，使 Ant Design 能够响应主题变化
function AppWithTheme() {
    const {theme: currentTheme} = useTheme();
    const {defaultAlgorithm, darkAlgorithm} = theme;
    
    return (
        <ConfigProvider
            theme={{
                algorithm: currentTheme === 'dark' ? darkAlgorithm : defaultAlgorithm,
                token: {
                    // Seed Token，影响范围大
                    colorPrimary: '#10b981',
                    borderRadius: 8,
                },
            }}
        >
            <App/>
        </ConfigProvider>
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <AppWithTheme/>
                </ThemeProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
)
