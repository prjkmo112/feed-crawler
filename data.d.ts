export interface FeedResult {
    title: string;
    link?: string;
    description?: string;
    icon?: string;
    items: Array<{
        id: string;
        title: string;
        link: string;
        description?: string;
        content?: string;
        pubDate?: string;
        author?: string;
        originData: string;
    }>;
}