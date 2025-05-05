import axios from "axios";

export async function imgUrl2Base64(url:string|undefined): Promise<Buffer|undefined> {
    if (url && /https?:\/\/.+\.(?:jpg|png|svg)/.test(url)) {
        const res = await axios.get(url, { responseType: 'arraybuffer' });
    
        const contentType:string = res.headers['content-type'];
        if (contentType.startsWith('image/'))
            return Buffer.from(res.data, 'binary');
    }

    return undefined;
}