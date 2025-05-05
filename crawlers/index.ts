import { $Enums } from "prisma/main-mysql/generated";
import Crawler from "./Crawler";
import XmlCralwer from "./XmlCralwer";
import { exceptionProc } from "modules/utils";

function getCrawlerInstance(type: $Enums.datasource_type, url: string): Crawler {
    if (type === "xml")
        return new XmlCralwer(url);
    else
        throw exceptionProc.common(`Unsupported crawler type : ${type}`);
}

export {
    Crawler,
    XmlCralwer,
    getCrawlerInstance,
};