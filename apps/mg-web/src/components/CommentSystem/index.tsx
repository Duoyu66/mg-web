import React, { useState, useMemo } from 'react';
import { Avatar, Button, Tag, Input, message, Typography } from 'antd';
import {
  LikeOutlined,
  LikeFilled,
  MessageOutlined,
  FireOutlined,
  PushpinOutlined,
  CaretDownOutlined,
  CaretUpOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const { TextArea } = Input;
const { Text } = Typography;

export interface CommentUser {
  id: string;
  nickname: string;
  avatar: string;
  isVip?: boolean;
}

export interface CommentData {
  id: string;
  userInfo: CommentUser;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  isTop?: boolean;
  isEssence?: boolean;
  replies?: CommentData[];
}

interface CommentSystemProps {
  comments: CommentData[];
  currentUser?: CommentUser;
  onSubmit?: (content: string, parentId?: string) => void;
  onLike?: (commentId: string) => void;
  className?: string;
  repliesPageSize?: number;
}

const flattenReplies = (list: CommentData[] = []): CommentData[] => {
  const out: CommentData[] = [];
  const stack: CommentData[] = [...list];
  while (stack.length) {
    const cur = stack.shift()!;
    out.push(cur);
    if (cur.replies && cur.replies.length) {
      stack.push(...cur.replies);
    }
  }
  return out;
};

const CommentItem: React.FC<{
  item: CommentData;
  onReply: (item: CommentData) => void;
  onLike: (id: string) => void;
  depth?: number;
  repliesPageSize: number;
  disableNestedExpansions?: boolean;
}> = ({ item, onReply, onLike, depth = 0, repliesPageSize, disableNestedExpansions = false }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [visibleReplies, setVisibleReplies] = useState(0);

  const actions = [
    <span key="like" onClick={() => onLike(item.id)} style={{ cursor: 'pointer' }}>
      {item.isLiked ? <LikeFilled style={{ color: '#1890ff' }} /> : <LikeOutlined />}
      <span style={{ paddingLeft: 8 }}>{item.likes > 0 ? item.likes : ''}</span>
    </span>,
    <span key="reply" onClick={() => setShowReplyInput(!showReplyInput)} style={{ cursor: 'pointer' }}>
      <MessageOutlined />
      <span style={{ paddingLeft: 8 }}>回复</span>
    </span>,
  ];

  const isChild = depth > 0;
  const indentClass = depth === 0 ? 'py-4 border-b border-gray-100' : 'mt-4';
  const directReplies = item.replies || [];
  const flatReplies = useMemo(() => (depth === 0 ? flattenReplies(directReplies) : directReplies), [directReplies, depth]);
  const replyCount = flatReplies.length;
  const remaining = Math.max(replyCount - visibleReplies, 0);

  return (
    <div className={`comment-item ${indentClass}`}>
      <div className="flex gap-4">
        <Avatar src={item.userInfo.avatar} size={isChild ? 32 : 40}>
          {item.userInfo.nickname[0]}
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Text strong className="text-gray-800">{item.userInfo.nickname}</Text>
            {item.userInfo.isVip && (
              <Tag color="gold" className="mr-0 text-[10px] px-1 leading-4 h-5">VIP</Tag>
            )}
            <Text type="secondary" className="text-xs ml-2">
              {dayjs(item.createdAt).fromNow()}
            </Text>
            
            {!isChild && (
              <div className="flex gap-1 ml-auto">
                {item.isTop && (
                  <Tag color="red" icon={<PushpinOutlined />}>置顶</Tag>
                )}
                {item.isEssence && (
                  <Tag color="orange" icon={<FireOutlined />}>精华</Tag>
                )}
              </div>
            )}
          </div>

          <div className="text-gray-700 text-base leading-relaxed mb-2">
            {item.content}
          </div>

          <div className="flex items-center gap-6 text-gray-500 text-sm">
            {actions}
          </div>

          <AnimatePresence>
            {showReplyInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <div className="flex gap-2">
                  <TextArea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`回复 @${item.userInfo.nickname}...`}
                    autoSize={{ minRows: 2, maxRows: 4 }}
                  />
                  <Button 
                    type="primary" 
                    onClick={() => {
                      onReply({ ...item, content: replyContent });
                      setReplyContent('');
                      setShowReplyInput(false);
                    }}
                  >
                    发送
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {replyCount > 0 && remaining > 0 && (
        <div className={`mt-3 ${depth === 0 ? 'pl-12' : ''}`}>
          <Button
            type="text"
            onClick={() => setVisibleReplies(v => Math.min(v + repliesPageSize, replyCount))}
            className="text-gray-500 hover:text-blue-500 hover:bg-blue-50"
          >
            {visibleReplies === 0 ? (
              <>展开 {remaining} 条回复 <CaretDownOutlined /></>
            ) : (
              <>继续展开 {remaining} 条回复 <CaretDownOutlined /></>
            )}
          </Button>
        </div>
      )}
      <AnimatePresence>
            {replyCount > 0 && visibleReplies > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-3 overflow-hidden ${depth === 0 ? 'pl-12' : ''}`}
              >
                {flatReplies.slice(0, visibleReplies).map((reply) => (
                  <CommentItem
                    key={reply.id}
                    item={reply}
                    onReply={onReply}
                    onLike={onLike}
                    depth={depth + 1}
                    repliesPageSize={repliesPageSize}
                    disableNestedExpansions={true}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
    </div>
  );
};

const CommentSystem: React.FC<CommentSystemProps> = ({ 
  comments, 
  currentUser, 
  onSubmit, 
  onLike,
  className,
  repliesPageSize
}) => {
  const [content, setContent] = useState('');
  const [expanded, setExpanded] = useState(false);
  const pageSize = repliesPageSize ?? 5;

  const sortedComments = useMemo(() => {
    return [...comments].sort((a, b) => {
      if (a.isTop !== b.isTop) return a.isTop ? -1 : 1;
      if (a.isEssence !== b.isEssence) return a.isEssence ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [comments]);

  const visibleComments = expanded ? sortedComments : sortedComments.slice(0, 3);
  const hiddenCount = sortedComments.length - 3;

  const handleMainSubmit = () => {
    if (!content.trim()) return message.warning('请输入评论内容');
    onSubmit?.(content);
    setContent('');
    message.success('评论发表成功');
  };

  const handleReply = (targetItem: CommentData) => {
     message.success(`已回复 ${targetItem.userInfo.nickname}`);
     onSubmit?.(targetItem.content, targetItem.id);
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
        全部评论 <span className="text-gray-400 font-normal text-sm">({comments.length})</span>
      </h3>

      <div className="flex gap-4 mb-8">
        <Avatar 
          src={currentUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"} 
          size={48} 
        />
        <div className="flex-1">
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你的评论..."
            autoSize={{ minRows: 3, maxRows: 6 }}
            className="mb-3"
          />
          <div className="flex justify-end">
            <Button type="primary" size="large" onClick={handleMainSubmit}>
              发表评论
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {visibleComments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CommentItem 
                item={comment} 
                onReply={handleReply} 
                onLike={(id) => onLike?.(id)}
                depth={0}
                repliesPageSize={pageSize}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {comments.length > 3 && (
        <div className="mt-6 text-center">
          <Button 
            type="text" 
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 hover:text-blue-500 hover:bg-blue-50"
          >
            {expanded ? (
              <>收起评论 <CaretUpOutlined /></>
            ) : (
              <>展开剩余 {hiddenCount} 条评论 <CaretDownOutlined /></>
            )}
          </Button>
        </div>
      )}
      
      {comments.length === 0 && (
        <div className="text-center text-gray-400 py-10">
          暂无评论，快来抢沙发吧~
        </div>
      )}
    </div>
  );
};

export default CommentSystem;
