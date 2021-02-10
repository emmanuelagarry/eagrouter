export interface Context {
    new (path: string, state?: any): Context;
    [idx: string]: any;
    save?: () => void;
    pushState?: () => void;
    handled?: boolean;
    canonicalPath?: string;
    path?: string;
    querystring?: string;
    pathname?: string;
    state?: any;
    title?: string;
    params?: any;
  }



  