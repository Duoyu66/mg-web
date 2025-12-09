const FriendshipLinks = () => {
    const friendshipLinks = [
        {
            name: '木瓜一块八',
            url: 'https://www.muguaketang.com'
        },
        {
            name: '音乐盒',
            url: 'https://www.muguaketang.com'
        },
    ]
    return (
        <div>   
    <span>木瓜生态</span>
    <ul>
   {friendshipLinks.map((item) => (
    <li key={item.name}>{item.name}</li>
   ))}
    </ul>
        </div>
    )
}

export default FriendshipLinks;