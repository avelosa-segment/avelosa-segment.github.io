import { ILogger } from '@amplitude/analytics-core';
import { BrowserStorage } from './browser-storage';
interface LocalStorageOptions {
    loggerProvider?: ILogger;
}
export declare class LocalStorage<T> extends BrowserStorage<T> {
    loggerProvider?: ILogger;
    constructor(config?: LocalStorageOptions);
    set(key: string, value: T): Promise<void>;
}
export {};
//# sourceMappingURL=local-storage.d.ts.map