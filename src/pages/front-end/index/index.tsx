import {ReactFlow} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {Button} from "antd";
import {useNavigate} from "react-router-dom";

const nodes = [
    {
        id: 'n1',
        position: {x: 0, y: 0},
        data: {label: '数据结构和算法'},
        style: {
            background: 'transparent',
            border: '3px solid #3b82f6'
        },
    },
    {
        id: 'n2',
        position: {x: -100, y: 100},
        data: {label: '线性结构'},
        style: {background: 'transparent'},
    },
    {
        id: 'n3',
        position: {x: 100, y: 100},
        data: {label: '非线性结构'},
        style: {background: 'transparent'},
    },
    {
        id: 'n4',
        position: {x: 0, y: 200},
        data: {label: '结束'},
        style: {background: 'transparent'},
    },
];

const edges = [
    {
        id: 'n1-n2',
        source: 'n1',
        target: 'n2',
        markerEnd: 'arrow', // 添加箭头
        style: {
            strokeDasharray: '5,5',
            stroke: '#3b82f6',
            strokeWidth: 2,
        },
        animated: true,
    },
    {
        id: 'n1-n3',
        source: 'n1',
        target: 'n3',
        markerEnd: 'arrow', // 添加箭头
        style: {
            strokeDasharray: '5,5',
            stroke: '#8f8f8f',
            strokeWidth: 2,

        },
        animated: true,
    },
    {
        id: 'n2-n4',
        source: 'n2',
        target: 'n4',
        markerEnd: 'arrow', // 添加箭头
        style: {
            strokeDasharray: '5,5',
            stroke: '#8f8f8f',
            strokeWidth: 2,
        },
        animated: true,
    },
    {
        id: 'n3-n4',
        source: 'n3',
        target: 'n4',
        markerEnd: 'arrow', // 添加箭头
        style: {
            strokeDasharray: '5,5',
            stroke: '#8f8f8f',
            strokeWidth: 2,
        },
        animated: true,
    },
];

export default function Index() {
    const navigate = useNavigate();
    const goHome = () => {
        navigate('/front/home')
    }
    return (
        <div className="w-full h-[100vh] flex flex-col items-center justify-start mt-60">

            <Button onClick={goHome}>去学习</Button>
            <div className="w-[500px] h-[350px] border bg-amber-200 rounded-md">

                <ReactFlow
                    style={{width: '500px', height: '500px'}}
                    nodes={nodes}
                    edges={edges}
                    fitView
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    panOnDrag={false}
                    zoomOnScroll={false}
                    zoomOnPinch={false}
                    panOnScroll={false}
                    // fitViewOptions={{padding: 0.2}}
                    proOptions={{hideAttribution: true}} // 可选：隐藏左下角的 logo
                />
            </div>

        </div>
    );
}