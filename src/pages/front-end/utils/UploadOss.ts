import OSS from 'ali-oss'
export const uploadOssFile=(file:any)=>{
    put(file);
}
const client = new OSS({
    // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
    // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
    endpoint:'https://img.pawpaw18.cn/',

    accessKeyId: "LTAI5tBf7fmKxKYRaoMRw6N",
    accessKeySecret: "8ORIIeR1ZM8JDoG2QQ757hlZizM5ir",
    // 填写Bucket名称。
    bucket: "pawpaw18-img",

    secure:true
});


async function put (file:any) {
    try {
        // object表示上传到OSS的文件名称。
        // file表示浏览器中需要上传的文件，支持HTML5 file和Blob类型。
        const r1 = await client.put('object', file);
        console.log('put success: %j', r1);
        const r2 = await client.get('object');
        console.log('get success: %j', r2);
    } catch (e) {
        console.error('error: %j', e);
    }
}

