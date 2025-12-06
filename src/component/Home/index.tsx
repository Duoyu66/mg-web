import {Button, Spin} from "antd";
import {useGetAcList} from "./hooks/useGetAcList";
import {useEffect, useState} from "react";
import {useTheme} from "../context/useTheme";

interface AcItem {
    id: string | number;
    name: string;
}

export default function Home() {
    const [acList, setAcList] = useState<AcItem[]>([]);
    const [page, setPage] = useState(0)
    const [pageSize] = useState(2)
    const {acData, data, isLoading} = useGetAcList({
        page,
        pageSize,
    });
    const {toggleTheme, theme: currentTheme} = useTheme();

    useEffect(() => {
        if (acData && acData?.length > 0) {
            if (page == 1) {
                setAcList(acData);
            } else {
                setAcList((prev) => [...prev, ...acData])
            }
        }
    }, [acData, page]);
    console.log("获取的data的值是", acData);

    const lookMore = () => {
        setPage((pre) => pre + 1)
    }

    return (
        <div
            className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 transition-colors duration-300">
            我是Home组件

            {/* --- {JSON.stringify(data)} */}
            <ul className="space-y-2">
                {acList &&
                    acList.length > 0 &&
                    acList.map((m: AcItem) => {
                        return <li key={m.id}
                                   className="p-2 bg-gray-100 dark:bg-gray-800 rounded transition-colors duration-300">{m.name}</li>;
                    })}
            </ul>
            {
                isLoading && <Spin size="large"/>
            }
            {(data?.data?.hasNext && !isLoading) ?
                <Button onClick={() => lookMore()}>查看更多</Button> : "暂时没有更多数据了"}
            <div
                className="w-[200px] h-[200px] border border-gray-300 dark:border-gray-600 bg-primary-500 dark:bg-primary-700 mt-4 transition-colors duration-300">

            </div>
            <Button onClick={toggleTheme} className="mt-4">
                {currentTheme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'}
            </Button>
        </div>
    );
}
