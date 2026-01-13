import OSS from 'ali-oss'

const client = new OSS({
    // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
    // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
    endpoint: 'https://img.pawpaw18.cn/',
    accessKeyId: "LTAI5tBf7fmKxKYRaoMRw6N",
    accessKeySecret: "8ORIIeR1ZM8JDoG2QQ757hlZizM5ir",
    // 填写Bucket名称。
    bucket: "pawpaw18-img",
    secure: true,
    cname: true // 使用自定义域名时需要开启
});

/**
 * 上传文件到阿里云OSS
 * @param file 文件对象 (File 或 Blob)
 * @param folder 可选，文件夹路径，如 'articles/images/'
 * @returns Promise<string> 返回OSS的完整URL
 */
export const uploadOssFile = async (file: File | Blob, folder: string = 'articles/images/'): Promise<string> => {
    try {
        if (!(file instanceof Blob)) {
            throw new Error('上传文件类型不正确');
        }
        // 生成唯一文件名：时间戳 + 随机数 + 原文件名
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 9);
        const originalName = file instanceof File ? file.name : 'image';
        const ext = originalName.includes('.') ? (originalName.split('.').pop() || 'jpg') : 'jpg';
        const fileName = `${folder}${timestamp}_${random}.${ext}`;

        // 上传到OSS
        const result = await client.put(fileName, file);
        
        // 返回完整的OSS URL
        return result.url;
    } catch (e) {
        console.error('OSS upload error:', e);
        throw new Error('图片上传失败，请重试');
    }
}

