import xml2js from 'xml2js';
import { FeedResult } from '../data';
import Crawler from './Crawler';
import { $Enums } from 'prisma/main-mysql/generated';

class XmlCralwer extends Crawler {
    public type: $Enums.datasource_type = "xml";

    constructor(url:string) {
        super(url);
    }

    async follow():Promise<FeedResult> {
        const root = await this.getData();
        
        return {
            ...this.getInfo(root),
            items: this.getItemList(root).map((item:object) => ({
                id: this.getItemId(item),
                title: this.getItemTitle(item),
                link: this.getItemLink(item),
                description: this.getItemDescription(item),
                content: this.getItemContent(item),
                pubDate: this.getItemPubDate(item),
                originData: JSON.stringify(item),
            })),
        };
    }

    getInfo(xml:any) {
        return {
            title: this.getTitle(xml),
            description: this.getDescription(xml),
            icon: this.getIcon(xml),
            link: this.urlInfo.href,
        };
    }

    async getData() {
        const { data } = await this.sendAxios();
        const xml = await xml2js.parseStringPromise(data);

        return this.getRoot(xml);
    }

    private getProperty(data:any, key:string):string {
        if (data[key]) {
            if (typeof data[key][0] === 'string')
                return data[key][0];
    
            if (typeof data[key][0] === "object" && data[key][0]['$']) {
                // a tag
                if (typeof data[key][0]['$'].href === "string")
                    return data[key][0]['$'].href;

                // html type
                if (data[key][0]['$']['type'] === "html")
                    return data[key][0]['_'];
            }
        }

        return '';
    }

    protected getRoot(xml:any):any {
        if (xml.rss) {
            // RSS
            if (xml.rss.channel)
                return xml.rss.channel[0];
        } else if (xml.feed) {
            // Atom
            return xml.feed;
        } else if (xml.opml) {
            // OPML
            if (xml.opml.body && xml.opml.body[0].outline)
                return xml.opml.body[0].outline[0];
        } else if (xml.rss2) {
            // RSS2
            if (xml.rss2.channel)
                return xml.rss2.channel[0];
        }

        return xml;
    }

    protected getTitle(xml:any):string { return this.getProperty(xml, "title"); }
    protected getIcon(xml:any):string { return this.getProperty(xml, "icon"); }
    protected getLogo(xml:any):string { return this.getProperty(xml, "logo"); }
    protected getDescription(xml:any):string { 
        return this.getProperty(xml, "description") || this.getProperty(xml, "subtitle") || this.getProperty(xml, "summary");
    }

    protected getItemList(xml:any):any[] {
        return xml.items;
    }

    protected getItemId(item:any):string { return this.getProperty(item, "id"); }
    protected getItemTitle(item:any):string { return this.getProperty(item, "title"); }
    protected getItemLink(item:any):string { return this.getProperty(item, "link"); }
    protected getItemDescription(item:any):string { return this.getProperty(item, "description"); }
    protected getItemContent(item:any):string { return this.getProperty(item, "content"); }
    protected getItemPubDate(item:any):string { return this.getProperty(item, "pubDate"); }
    protected getItemAuthor(item:any):string { return this.getProperty(item, "author"); }
}

export default XmlCralwer;