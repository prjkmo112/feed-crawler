import base32Encode from "base32-encode";
import { getCrawlerInstance } from "crawlers";
import { dbMain } from "modules/dbConnector";
import { imgProc } from "modules/utils";
import { $Enums } from "prisma/main-mysql/generated";


export async function addDatasource(datasourceType:$Enums.datasource_type, url:string) {
    const CrawlerInstance = getCrawlerInstance(datasourceType, url);
    const content = await CrawlerInstance.getData();
    const info = CrawlerInstance.getInfo(content);
    const iconImg = await imgProc.imgUrl2Base64(info.icon);

    const buf = Buffer.from("0000 0000 0000 0000".replaceAll(" ", ""), 'utf-8');
    const sourceKey = base32Encode(buf, 'RFC3548', { padding: false });
    
    await dbMain.datasource.create({
        data: {
            title: info.title,
            sourcekey: sourceKey,
            type: datasourceType,
            url: info.link,
            description: info.description,
            icon: iconImg,
            isActivate: true
        }
    });
}