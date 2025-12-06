// @ts-ignore
//找出data树结构每个子树的topping为xxx的子树
export const  searchToppingData = (data: any, topping: string) => {
    console.log("执行了")
    for (const comment of data) {
        if (comment.topping === topping) {
            console.log("找到了1", comment);
            return comment;
        }
        // 如果存在子评论，递归调用searchToppingData
        if (comment.children && comment.children.length > 0) {
            // @ts-ignore
            const result = searchToppingData(comment.children, topping);
            if (result) {
                console.log("找到了2", result);
                return result;
            }
        }
    }
    console.log("没找到");
    return null; // 如果未找到匹配的顶级或子级评论，则返回null
};
