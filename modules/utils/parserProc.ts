import { exceptionProc } from ".";

export interface ParsedUrl extends Partial<URL> {
    href: string;
    protocol: string;
    subdomain: string;
    domain: string;
    tld: string;
}

export function parseUrl(originUrl: string): ParsedUrl {
    const url = new URL(originUrl);

    const domains = url.host.split(".");

    if (!url.href || !url.host || !url.hostname || !url.pathname || !url.origin || domains.length < 2)
        throw exceptionProc.common("Invalid URL");

    return {
        href: url.href,
        host: url.host,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        origin: url.origin,
        protocol: url.protocol.replace(":", ""),
        subdomain: domains.length > 2 ? domains[0] : "www",
        domain: domains.join("."),
        tld: domains[domains.length - 1],
    };
}