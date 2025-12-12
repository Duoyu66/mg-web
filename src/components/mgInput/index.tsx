import { useState } from "react";
import { Button, Mentions } from "antd";
import type { MentionsProps } from "antd";
import { Smile, Image as ImageIcon, ArrowUpDown } from "lucide-react";
import EmojiPicker from "../EmojiPicker";
import "./mentions.css";

type MentionOption = NonNullable<MentionsProps["options"]>[number];

interface CommentInputProps {
  avatarUrl?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  mentionUsers: MentionsProps["options"];
  onSelectMention: (option: MentionOption) => void;
  onSearchMention: (text: string) => void;
  placeholder?: string;
  isSubmitDisabled?: boolean;
  minRows?: number;
  maxRows?: number;
}

export default function CommentInput({
  avatarUrl = "https://img.pawpaw18.cn/user-img/default-avatar.jpg",
  value,
  onChange,
  onSubmit,
  mentionUsers = [],
  onSelectMention,
  onSearchMention,
  placeholder = "快来和大家讨论吧~ 输入 @ 可以提及用户",
  isSubmitDisabled,
  minRows = 3,
  maxRows = 6,
}: CommentInputProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <div className="flex items-start gap-3 mb-3">
      <img
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        src={avatarUrl}
        alt="我的头像"
      />
      <div className="flex-1">
        <Mentions
          value={value}
          onChange={(val) => onChange(val)}
          placeholder={placeholder}
          autoSize={{ minRows, maxRows }}
          className="mb-2 comment-mentions"
          options={mentionUsers}
          prefix="@"
          split=""
          filterOption={false}
          onSelect={onSelectMention}
          onSearch={onSearchMention}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <Smile className="w-4 h-4" />
              <span className="text-sm">表情</span>
            </button>
            <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm">图片</span>
            </button>
            <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              <ArrowUpDown className="w-4 h-4" />
              <span className="text-sm">切换</span>
            </button>
          </div>
          <Button type="primary" onClick={onSubmit} disabled={isSubmitDisabled}>
            发布
          </Button>
        </div>
        {showEmojiPicker && (
          <div className="mt-2">
            <EmojiPicker
              onSelect={(emoji: string) => {
                onChange(value + emoji);
                setShowEmojiPicker(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}