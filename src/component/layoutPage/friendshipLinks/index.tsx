const FriendshipLinks = () => {
    const friendshipLinks = [
        {
            name: '木瓜一块八',
            url: 'https://www.pawpaw18.cn'
        },
        {
            name: '音乐盒',
            url: 'https://www.pawpaw18.cn/music/musicHome'
        },
    ]
    return (
        <div>   
        <span className="text-sm text-gray-500 dark:text-gray-400">木瓜生态</span>
        <ul>
            {friendshipLinks.map((item) => (
                <li  onClick={() => window.open(item.url, '_blank')} className=" text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 cursor-pointer" key={item.name}>{item.name}</li>
            ))}
        </ul>
        </div>
    )
}

export default FriendshipLinks;