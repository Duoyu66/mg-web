import { Camera, Heart, Search, User,UmbrellaOff } from 'lucide-react';
const Message = () => (
    <div>
        <Camera size={24} />
        <Heart className="text-red-500" />
        <Search className="text-blue-500" />
        <User size={20} strokeWidth={1.5} />
        <UmbrellaOff/>
        我是消息 组件
    </div>
)
export default Message