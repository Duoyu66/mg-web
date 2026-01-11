import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { frontendRoadmap, backendRoadmap, RoadmapNode } from './data';
import { CheckCircle2, Circle, ArrowRight, Laptop, Server } from 'lucide-react';

// Grid Configuration
const GRID = {
  NODE_WIDTH: 260,
  NODE_HEIGHT: 120,
  GAP_X: 60,
  GAP_Y: 80,
  PADDING: 40
};

const RoadmapPage = () => {
  const [activeTab, setActiveTab] = useState<'frontend' | 'backend'>('frontend');
  
  const currentRoadmap = activeTab === 'frontend' ? frontendRoadmap : backendRoadmap;

  // Calculate canvas size
  const maxRow = Math.max(...currentRoadmap.map(n => n.row));
  const maxCol = Math.max(...currentRoadmap.map(n => n.col));
  
  // Center alignment offset
  // Assuming max 3 columns for now based on data
  const totalWidth = maxCol * GRID.NODE_WIDTH + (maxCol - 1) * GRID.GAP_X;
  const totalHeight = maxRow * GRID.NODE_HEIGHT + (maxRow - 1) * GRID.GAP_Y;
  
  const canvasWidth = totalWidth + GRID.PADDING * 2;
  const canvasHeight = totalHeight + GRID.PADDING * 2;

  // Helper to get node center coordinates
  const getNodeCenter = (row: number, col: number) => {
    const x = GRID.PADDING + (col - 1) * (GRID.NODE_WIDTH + GRID.GAP_X) + GRID.NODE_WIDTH / 2;
    const y = GRID.PADDING + (row - 1) * (GRID.NODE_HEIGHT + GRID.GAP_Y) + GRID.NODE_HEIGHT / 2;
    return { x, y };
  };

  // Helper to get connection points (bottom of source, top of target)
  const getConnectionPoints = (source: RoadmapNode, target: RoadmapNode) => {
    const sourceCenter = getNodeCenter(source.row, source.col);
    const targetCenter = getNodeCenter(target.row, target.col);
    
    return {
      x1: sourceCenter.x,
      y1: sourceCenter.y + GRID.NODE_HEIGHT / 2, // Bottom of source
      x2: targetCenter.x,
      y2: targetCenter.y - GRID.NODE_HEIGHT / 2  // Top of target
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            开发者学习路线
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            系统化的学习路径，助你从入门到精通。跟随路线图，掌握核心技术栈。
          </p>
          
          {/* Tab Switcher */}
          <div className="inline-flex bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('frontend')}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300
                ${activeTab === 'frontend' 
                  ? 'bg-primary-500 text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}
              `}
            >
              <Laptop size={18} />
              前端开发
            </button>
            <button
              onClick={() => setActiveTab('backend')}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300
                ${activeTab === 'backend' 
                  ? 'bg-primary-500 text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}
              `}
            >
              <Server size={18} />
              后端开发
            </button>
          </div>
        </div>

        {/* Roadmap Canvas */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <div 
            className="relative mx-auto my-8"
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
              
              {currentRoadmap.map(node => {
                if (!node.next) return null;
                return node.next.map(nextId => {
                  const targetNode = currentRoadmap.find(n => n.id === nextId);
                  if (!targetNode) return null;
                  
                  const { x1, y1, x2, y2 } = getConnectionPoints(node, targetNode);
                  
                  // Calculate control points for smooth bezier curve
                  const midY = (y1 + y2) / 2;
                  
                  return (
                    <g key={`${node.id}-${nextId}`}>
                      <path
                        d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
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
            {currentRoadmap.map((node, index) => {
              const { x, y } = getNodeCenter(node.row, node.col);
              const Icon = node.icon;
              
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="absolute z-10"
                  style={{
                    left: x - GRID.NODE_WIDTH / 2,
                    top: y - GRID.NODE_HEIGHT / 2,
                    width: GRID.NODE_WIDTH,
                    height: GRID.NODE_HEIGHT,
                  }}
                >
                  <div 
                    className={`
                      w-full h-full p-4 rounded-xl border-2 transition-all duration-300 group cursor-pointer hover:shadow-lg
                      ${node.status === 'completed' 
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800' 
                        : node.status === 'learning'
                          ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className={`
                        p-2 rounded-lg 
                        ${node.status === 'completed' ? 'bg-green-100 text-green-600' : 
                          node.status === 'learning' ? 'bg-blue-100 text-blue-600' : 
                          'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}
                      `}>
                        <Icon size={20} />
                      </div>
                      
                      {node.status === 'completed' && (
                        <CheckCircle2 size={18} className="text-green-500" />
                      )}
                      {node.status === 'learning' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-medium">
                          进行中
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-1">
                      {node.title}
                      {node.type === 'milestone' && (
                        <span className="text-amber-500">★</span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
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
