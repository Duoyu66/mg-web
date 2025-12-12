import { useState, useEffect } from "react";
import { Button, Mentions } from "antd";
import type { MentionsOptionProps } from "antd/es/mentions";
import { Smile, Image as ImageIcon, ArrowUpDown } from "lucide-react";
import EmojiPicker from "../EmojiPicker";
import "./mentions.css";

type MentionOption = {
  value: string;
  label?: string;
  realValue?: string;
};

type MentionsWithDisplayProps = React.ComponentProps<typeof Mentions> & {
  displayTransform?: (value: string, option?: MentionOption) => string;
};

interface CommentInputProps {
  avatarUrl?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  mentionUsers: MentionOption[];
  onSelectMention: (option: MentionOption) => void;
  onSearchMention: (text: string) => void;
  displayTransform?: (value: string, option?: MentionOption) => string;
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
  displayTransform,
  placeholder = "快来和大家讨论吧~ 输入 @ 可以提及用户",
  isSubmitDisabled,
  minRows = 3,
  maxRows = 6,
}: CommentInputProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // 转换 options：将 value 设置为 label，这样插入到文本中的就是 label
  // 同时保留原始 value（真实ID）用于提交
  const transformedOptions = mentionUsers.map((user) => ({
    value: user.label || user.value, // 插入文本时使用 label
    label: user.label || user.value, // 下拉列表显示 label
  }));

  // 监听下拉框，当选项为空时立即隐藏下拉框
  useEffect(() => {
    const hideEmptyDropdown = () => {
      // 只在有下拉框时才执行检查
      const dropdowns = document.querySelectorAll('.ant-mentions-dropdown');
      if (dropdowns.length === 0) return;

      dropdowns.forEach((dropdown) => {
        const dropdownEl = dropdown as HTMLElement;
        const menu = dropdown.querySelector('.ant-mentions-dropdown-menu');
        
        if (!menu) {
          // 如果没有菜单元素，立即隐藏
          dropdownEl.style.display = 'none';
          dropdownEl.style.visibility = 'hidden';
          dropdownEl.style.opacity = '0';
          dropdownEl.classList.add('ant-mentions-dropdown-hidden');
          return;
        }

        // 检查是否有有效的菜单项（排除空状态提示和隐藏项）
        const allMenuItems = menu.querySelectorAll('.ant-mentions-dropdown-menu-item');
        const visibleMenuItems = Array.from(allMenuItems).filter((item) => {
          const el = item as HTMLElement;
          return (
            el.style.display !== 'none' &&
            !el.classList.contains('ant-mentions-dropdown-menu-item-empty') &&
            el.textContent?.trim() !== '' &&
            el.textContent?.trim() !== '无数据'
          );
        });
        
        const isEmpty = visibleMenuItems.length === 0;
        
        // 如果没有有效的菜单项，立即隐藏下拉框
        if (isEmpty) {
          dropdownEl.style.display = 'none';
          dropdownEl.style.visibility = 'hidden';
          dropdownEl.style.opacity = '0';
          dropdownEl.classList.add('ant-mentions-dropdown-hidden');
        } else {
          // 如果有有效的菜单项，确保下拉框显示
          dropdownEl.style.display = '';
          dropdownEl.style.visibility = '';
          dropdownEl.style.opacity = '';
          dropdownEl.classList.remove('ant-mentions-dropdown-hidden');
        }
      });
    };

    // 使用 MutationObserver 只监听下拉框的变化
    const observer = new MutationObserver((mutations) => {
      // 只在下拉框相关变化时执行
      const hasDropdownChange = mutations.some((mutation) => {
        const target = mutation.target as Element;
        return target.classList?.contains('ant-mentions-dropdown') ||
               target.closest('.ant-mentions-dropdown') !== null;
      });
      
      if (hasDropdownChange) {
        // 使用 requestAnimationFrame 避免阻塞输入
        requestAnimationFrame(() => {
          hideEmptyDropdown();
        });
      }
    });

    // 只监听下拉框容器
    const dropdownContainer = document.body;
    observer.observe(dropdownContainer, {
      childList: true,
      subtree: true,
      attributes: false, // 不监听属性变化，避免干扰
    });

    // 减少检查频率，避免干扰输入
    const interval = setInterval(() => {
      // 只在有下拉框时才检查
      if (document.querySelector('.ant-mentions-dropdown')) {
        hideEmptyDropdown();
      }
    }, 200);

    // 初始检查
    hideEmptyDropdown();

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [mentionUsers]);

  // 自定义 displayTransform：确保显示的是 label
  const handleDisplayTransform = (val: string, option?: MentionOption) => {
    if (displayTransform) {
      return displayTransform(val, option);
    }
    // 如果没有传入 displayTransform，尝试从原始数据中找到对应的 label
    const foundUser = mentionUsers.find((u) => u.value === val || u.label === val);
    return foundUser?.label || val;
  };

  const mentionProps: MentionsWithDisplayProps = {
    value,
    onChange: (val: string) => onChange(val),
    placeholder,
    autoSize: { minRows, maxRows },
    className: "mb-2 comment-mentions",
    options: transformedOptions.length > 0 ? transformedOptions : undefined, // 空数组时不显示下拉
    prefix: "@",
    split: "",
    filterOption: false,
    notFoundContent: null,
    displayTransform: handleDisplayTransform,
    onSelect: (option: MentionsOptionProps) => {
      // 找到原始用户数据（通过 label 匹配）
      const selectedLabel = String(option.label || option.value || "");
      const originalUser = mentionUsers.find(
        (u) => u.label === selectedLabel || u.value === selectedLabel
      );
      
      const normalized: MentionOption = {
        value: originalUser?.value || String(option.value ?? ""),
        label: originalUser?.label || selectedLabel,
      };
      onSelectMention(normalized);
      // 选择后清空搜索文本，允许再次 @
      onSearchMention("");
    },
    onSearch: (text: string) => {
      onSearchMention(text);
    },
  };

  return (
    <div className="flex items-start gap-3 mb-3">
      <img
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        src={avatarUrl}
        alt="我的头像"
      />
      <div className="flex-1">
        <Mentions {...mentionProps} />
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