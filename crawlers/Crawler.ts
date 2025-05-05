import axios from "axios";
import { FeedResult } from "data";
import { parserProc } from 'modules/utils';
import { $Enums } from "prisma/main-mysql/generated";


interface Info {
    title: string;
    description: string;
    icon: string;
    link: string;
}

abstract class Crawler {
    abstract type: $Enums.datasource_type;
    public urlInfo: parserProc.ParsedUrl;

    constructor(url: string) {
        this.urlInfo = parserProc.parseUrl(url);
    }

    abstract follow(): Promise<FeedResult>;
    abstract getInfo(content: any): Info;
    abstract getData(): Promise<any>;

    async sendAxios() {
        const content = await axios.get(this.urlInfo.href, {
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'accept-encoding': 'gzip, deflate, br, zstd',
                'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'none',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
            }
        });

        return content;
    }
}

export default Crawler;