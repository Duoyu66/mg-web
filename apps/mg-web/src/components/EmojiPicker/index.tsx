import { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
    onSelect: (emoji: string) => void;
    className?: string;
}

// 100个常用表情及其描述
const emojis = [
    { emoji: '😀', desc: '大笑' }, { emoji: '😃', desc: '开心' }, { emoji: '😄', desc: '微笑' }, { emoji: '😁', desc: '咧嘴' }, { emoji: '😆', desc: '眯眼' },
    { emoji: '😅', desc: '苦笑' }, { emoji: '🤣', desc: '笑哭' }, { emoji: '😂', desc: '笑哭' }, { emoji: '🙂', desc: '微笑' }, { emoji: '🙃', desc: '倒笑' },
    { emoji: '😉', desc: '眨眼' }, { emoji: '😊', desc: '害羞' }, { emoji: '😇', desc: '天使' }, { emoji: '🥰', desc: '爱心' }, { emoji: '😍', desc: '花痴' },
    { emoji: '🤩', desc: '星星' }, { emoji: '😘', desc: '飞吻' }, { emoji: '😗', desc: '嘟嘴' }, { emoji: '😚', desc: '闭眼' }, { emoji: '😙', desc: '眨眼' },
    { emoji: '😋', desc: '好吃' }, { emoji: '😛', desc: '吐舌' }, { emoji: '😜', desc: '眨眼' }, { emoji: '🤪', desc: '疯狂' }, { emoji: '😝', desc: '闭眼' },
    { emoji: '🤑', desc: '金钱' }, { emoji: '🤗', desc: '拥抱' }, { emoji: '🤭', desc: '捂嘴' }, { emoji: '🤫', desc: '嘘' }, { emoji: '🤔', desc: '思考' },
    { emoji: '🤐', desc: '闭嘴' }, { emoji: '🤨', desc: '挑眉' }, { emoji: '😐', desc: '中性' }, { emoji: '😑', desc: '无语' }, { emoji: '😶', desc: '无嘴' },
    { emoji: '😏', desc: '得意' }, { emoji: '😒', desc: '白眼' }, { emoji: '🙄', desc: '翻眼' }, { emoji: '😬', desc: '尴尬' }, { emoji: '🤥', desc: '撒谎' },
    { emoji: '😌', desc: '安心' }, { emoji: '😔', desc: '沮丧' }, { emoji: '😪', desc: '困倦' }, { emoji: '🤤', desc: '流涎' }, { emoji: '😴', desc: '睡觉' },
    { emoji: '😷', desc: '口罩' }, { emoji: '🤒', desc: '发烧' }, { emoji: '🤕', desc: '受伤' }, { emoji: '🤢', desc: '恶心' }, { emoji: '🤮', desc: '呕吐' },
    { emoji: '🤧', desc: '打喷嚏' }, { emoji: '🥵', desc: '热' }, { emoji: '🥶', desc: '冷' }, { emoji: '😶‍🌫️', desc: '云雾' }, { emoji: '😵', desc: '头晕' },
    { emoji: '😵‍💫', desc: '眩晕' }, { emoji: '🤯', desc: '爆炸' }, { emoji: '🤠', desc: '牛仔' }, { emoji: '🥳', desc: '派对' }, { emoji: '😎', desc: '墨镜' },
    { emoji: '🤓', desc: '书呆子' }, { emoji: '🧐', desc: '单镜' }, { emoji: '😕', desc: '困惑' }, { emoji: '😟', desc: '担心' }, { emoji: '🙁', desc: '微皱' },
    { emoji: '☹️', desc: '皱眉' }, { emoji: '😮', desc: '惊讶' }, { emoji: '😯', desc: '震惊' }, { emoji: '😲', desc: '吃惊' }, { emoji: '😳', desc: '脸红' },
    { emoji: '🥺', desc: '恳求' }, { emoji: '😦', desc: '张嘴' }, { emoji: '😧', desc: '焦虑' }, { emoji: '😨', desc: '害怕' }, { emoji: '😰', desc: '冷汗' },
    { emoji: '😥', desc: '失望' }, { emoji: '😢', desc: '哭泣' }, { emoji: '😭', desc: '大哭' }, { emoji: '😱', desc: '尖叫' }, { emoji: '😖', desc: '困扰' },
    { emoji: '😣', desc: '痛苦' }, { emoji: '😞', desc: '失望' }, { emoji: '😓', desc: '流汗' }, { emoji: '😩', desc: '疲惫' }, { emoji: '😫', desc: '困倦' },
    { emoji: '🥱', desc: '打哈欠' }, { emoji: '😤', desc: '得意' }, { emoji: '😡', desc: '愤怒' }, { emoji: '😠', desc: '生气' }, { emoji: '🤬', desc: '骂人' },
    { emoji: '😈', desc: '恶魔' }, { emoji: '👿', desc: '愤怒' }, { emoji: '💀', desc: '骷髅' }, { emoji: '☠️', desc: '骷髅' }, { emoji: '💩', desc: '便便' },
    { emoji: '🤡', desc: '小丑' }, { emoji: '👹', desc: '妖怪' }, { emoji: '👺', desc: '天狗' }, { emoji: '👻', desc: '幽灵' }, { emoji: '👽', desc: '外星人' },
];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    // 点击外部关闭
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleEmojiClick = (emoji: string) => {
        onSelect(emoji);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={pickerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
            >
                <Smile className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    <div className="p-2 max-h-64 overflow-y-auto">
                        <div className="grid grid-cols-10 gap-1">
                            {emojis.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleEmojiClick(item.emoji)}
                                    className="w-7 h-7 flex items-center justify-center text-lg hover:bg-gray-100  mx-1  cursor-pointer   dark:hover:bg-gray-700 rounded transition-colors"
                                    title={item.desc}
                                >
                                    {item.emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmojiPicker;

