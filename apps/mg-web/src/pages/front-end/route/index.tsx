import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { frontendRoadmap, backendRoadmap } from './data';
import type { RoadmapNode } from './data';
import { CheckCircle2, Laptop, Server, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GRID = {
  NODE_WIDTH: 240,
  NODE_HEIGHT: 108,
  GAP_X: 36,
  GAP_Y: 32,
  PADDING: 32,
  COLS: 3
};

const RoadmapPage = () => {
  const [activeTab, setActiveTab] = useState<'frontend' | 'backend'>('frontend');
  const navigate = useNavigate();
  
  const currentRoadmap = activeTab === 'frontend' ? frontendRoadmap : backendRoadmap;

  const orderedRoadmap = useMemo(
    () => [...currentRoadmap].sort((a, b) => a.order - b.order),
    [currentRoadmap]
  );
  
  const docsBaseUrl = 'http://localhost:3000';

  const rows = Math.ceil(orderedRoadmap.length / GRID.COLS);
  const canvasWidth = GRID.PADDING * 2 + GRID.COLS * GRID.NODE_WIDTH + (GRID.COLS - 1) * GRID.GAP_X;
  const canvasHeight = GRID.PADDING * 2 + rows * GRID.NODE_HEIGHT + (rows - 1) * GRID.GAP_Y;

  const getNodeRectByIndex = (index: number) => {
    const rowIndex = Math.floor(index / GRID.COLS);
    const colIndex = index % GRID.COLS;
    const left = GRID.PADDING + colIndex * (GRID.NODE_WIDTH + GRID.GAP_X);
    const top = GRID.PADDING + rowIndex * (GRID.NODE_HEIGHT + GRID.GAP_Y);
    const centerX = left + GRID.NODE_WIDTH / 2;
    const centerY = top + GRID.NODE_HEIGHT / 2;
    return { left, top, centerX, centerY, rowIndex, colIndex };
  };

  const indexById = useMemo(() => {
    const map = new Map<string, number>();
    orderedRoadmap.forEach((n, i) => map.set(n.id, i));
    return map;
  }, [orderedRoadmap]);

  const getConnectionPath = (source: RoadmapNode, target: RoadmapNode) => {
    const si = indexById.get(source.id);
    const ti = indexById.get(target.id);
    if (si == null || ti == null) return null;

    const s = getNodeRectByIndex(si);
    const t = getNodeRectByIndex(ti);

    const sameRow = s.rowIndex === t.rowIndex && t.colIndex > s.colIndex;
    const x1 = sameRow ? s.left + GRID.NODE_WIDTH : s.centerX;
    const y1 = sameRow ? s.centerY : s.top + GRID.NODE_HEIGHT;
    const x2 = sameRow ? t.left : t.centerX;
    const y2 = sameRow ? t.centerY : t.top;

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    const d = sameRow
      ? `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`
      : `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

    return d;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3 select-none"
          >
            开发者学习路线
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            按阶段梳理核心知识点，轻量直观的路线导航。
          </p>
          
          {/* Tab Switcher */}
          <div className="inline-flex bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('frontend')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
                ${activeTab === 'frontend' 
                  ? 'bg-primary-500 text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}
              `}
            >
              <Laptop size={16} />
              前端开发
            </button>
            <button
              onClick={() => setActiveTab('backend')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
                ${activeTab === 'backend' 
                  ? 'bg-primary-500 text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}
              `}
            >
              <Server size={16} />
              后端开发
            </button>
          </div>
        </div>

        {/* Roadmap Canvas */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <div 
            className="relative mx-auto my-6"
            style={{ 
              width: canvasWidth, 
              height: canvasHeight,
              minWidth: '100%' // Ensure it doesn't shrink too much
            }}
          >
            {/* SVG Connections Layer */}
            <svg 
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
              width={canvasWidth}
              height={canvasHeight}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                </marker>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>
              </defs>
              
              {orderedRoadmap.map(node => {
                if (!node.next) return null;
                return node.next.map(nextId => {
                  const targetNode = orderedRoadmap.find(n => n.id === nextId);
                  if (!targetNode) return null;
                  const d = getConnectionPath(node, targetNode);
                  if (!d) return null;
                  
                  return (
                    <g key={`${node.id}-${nextId}`}>
                      <path
                        d={d}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        markerEnd="url(#arrowhead)"
                        className="opacity-60"
                      />
                    </g>
                  );
                });
              })}
            </svg>

            {/* Nodes Layer */}
            {orderedRoadmap.map((node, index) => {
              const { left, top } = getNodeRectByIndex(index);
              const Icon = node.icon;
              
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="absolute z-10"
                  style={{
                    left,
                    top,
                    width: GRID.NODE_WIDTH,
                    height: GRID.NODE_HEIGHT,
                  }}
                >
                  <div 
                    className={`
                      w-full h-full p-3.5 rounded-xl border transition-all duration-300 group cursor-pointer hover:shadow-md active:scale-[0.99]
                      ${node.status === 'completed' 
                        ? 'bg-gradient-to-br from-green-50 to-white border-green-200 dark:from-green-900/10 dark:to-gray-900 dark:border-green-800' 
                        : node.status === 'learning'
                          ? 'bg-gradient-to-br from-blue-50 to-white border-blue-200 dark:from-blue-900/10 dark:to-gray-900 dark:border-blue-800'
                          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                      }
                    `}
                    onClick={() => {
                      const target = `${docsBaseUrl}/topic?track=${activeTab}&topic=${encodeURIComponent(node.id)}`;
                      window.open(target, '_blank');
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className={`
                        p-2 rounded-lg 
                        ${node.status === 'completed' ? 'bg-green-100 text-green-600' : 
                          node.status === 'learning' ? 'bg-blue-100 text-blue-600' : 
                          'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}
                      `}>
                        <Icon size={18} />
                      </div>
                      
                      {node.status === 'completed' && (
                        <CheckCircle2 size={16} className="text-green-500" />
                      )}
                      {node.status === 'learning' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-medium">
                          进行中
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-1">
                        {node.title}
                        {node.type === 'milestone' && (
                          <span className="text-amber-500">★</span>
                        )}
                      </h3>
                      <ArrowRight size={14} className="text-gray-300 dark:text-gray-700 group-hover:text-primary-500 transition-colors" />
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {node.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
