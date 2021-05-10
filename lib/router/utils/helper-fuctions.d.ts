import { Observable } from "rxjs";
export declare const pathMatchKey: {
    delimiter: string;
    name: string;
    prefix: string;
    optional: boolean;
    partial: boolean;
    pattern: string;
    repeat: boolean;
};
export declare const stringToHTML: (str: string) => Element;
export declare const guardHandler: (guardExist: () => boolean | Observable<boolean> | Promise<boolean>, initiator: "parent" | "child") => Promise<any>;
export declare const routStringFormatter: (routePath: string) => string;
