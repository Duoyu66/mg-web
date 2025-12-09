import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {ConfigProvider, theme} from 'antd'
import App from './App.tsx'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ThemeProvider} from './components/context/ThemeContext'
import {useTheme} from './components/context/useTheme'
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
                "token": {
                    "colorPrimary": "#722ed1",
                    "colorInfo": "#722ed1",
                    "colorTextBase": "#535151",
                    "borderRadius": 12,
                    "colorSuccess": "#13c2c2"
                }
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
