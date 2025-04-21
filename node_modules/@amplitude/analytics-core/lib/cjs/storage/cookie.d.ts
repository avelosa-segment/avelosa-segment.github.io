import { Storage, CookieStorageOptions } from '../types/storage';
export declare class CookieStorage<T> implements Storage<T> {
    options: CookieStorageOptions;
    private static testValue;
    constructor(options?: CookieStorageOptions);
    isEnabled(): Promise<boolean>;
    get(key: string): Promise<T | undefined>;
    getRaw(key: string): Promise<string | undefined>;
    set(key: string, value: T | null): Promise<void>;
    remove(key: string): Promise<void>;
    reset(): Promise<void>;
}
//# sourceMappingURL=cookie.d.ts.map