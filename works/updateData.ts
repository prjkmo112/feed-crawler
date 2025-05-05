import 'tsconfig-paths/register';
import { compress } from '@mongodb-js/zstd';
import pLimit from 'p-limit';
import 'config/envConfig';
import { log } from 'modules/logger';
import { exceptionProc, parserProc } from 'modules/utils';
import { dbMain, DBMainPrisma } from 'modules/dbConnector';
import { getCrawlerInstance } from 'crawlers';


const ZSTD_COMPRESSED_LEVEL = process.env.ZSTD_COMPRESSED_LEVEL || 15;

interface ProcSiteObjReturnValue {
    datasource: DBMainPrisma.datasource;
    success: boolean;
}

async function procSiteObj(datasource: DBMainPrisma.datasource) {
    const CrawlerInstance = getCrawlerInstance(datasource.type, datasource.url);
    const res = await CrawlerInstance.follow();

    // save to db
    return dbMain.$transaction(async (tx) => {
        const sqlFormItems:DBMainPrisma.Prisma.crawled_dataCreateManyInput[] = [];

        for (const item of res.items) {
            const compressed = await compress(Buffer.from(item.originData), ZSTD_COMPRESSED_LEVEL);
            const description = item.description || `${item.content?.slice(0, 200)}`;
            const itemUrl = parserProc.parseUrl(item.link);

            sqlFormItems.push({
                sourceIdx: datasource.idx,
                datakey: `${itemUrl.hostname}${itemUrl.pathname}__${itemUrl.search}`,
                title: item.title,
                url: item.link,
                description: description,
                content: item.content,
                pubDate: item.pubDate,
                compressed: compressed,
            });
        }

        const limit = pLimit(5);
        await Promise.all(
            sqlFormItems.map((item) => {
                return limit(() => tx.crawled_data.upsert({
                    where: { datakey: item.datakey },
                    update: item,
                    create: item
                }));
            })
        );
    }, { maxWait: 1000 * 5, timeout: 1000 * 8 });
}

async function processWork(datasource: DBMainPrisma.datasource):Promise<ProcSiteObjReturnValue> {
    try {
        if (!datasource.url)
            throw exceptionProc.common('Invalid URL');

        await procSiteObj(datasource);

        return { success: true, datasource };
    } catch (error) {
        throw exceptionProc.common(error);
    }
}

export async function updateData() {
    try {
        // find all sites
        const sites = await dbMain.datasource.findMany({
            where: { isActivate: true }
        });

        log.info('Starting site processing in parellel...');
        const results = await Promise.allSettled(sites.map(processWork));
        log.info('All site processing completed.');

        for (const result of results) {
            if (result.status === 'fulfilled')
                log.info('Success: ', result.value.datasource.url);
            else
                log.error('Rejected:', result.reason);
        }
    } catch (error) {
        log.error('Error in fetchAllSites:', error);
    } finally {
        await dbMain.$disconnect();
        log.info('Disconnected from DB');
        process.exit(0);
    }
}