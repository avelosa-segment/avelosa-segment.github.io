import { Config } from '@amplitude/analytics-types';
import { CreateRemoteConfigFetch, RemoteConfigFetch as IRemoteConfigFetch, RemoteConfigAPIResponse, RemoteConfigMetric } from './types';
export declare const REMOTE_CONFIG_SERVER_URL = "https://sr-client-cfg.amplitude.com/config";
export declare const REMOTE_CONFIG_SERVER_URL_STAGING = "https://sr-client-cfg.stag2.amplitude.com/config";
export declare const REMOTE_CONFIG_SERVER_URL_EU = "https://sr-client-cfg.eu.amplitude.com/config";
export declare class RemoteConfigFetch<RemoteConfig extends {
    [key: string]: object;
}> implements IRemoteConfigFetch<RemoteConfig> {
    localConfig: Config;
    retryTimeout: number;
    attempts: number;
    lastFetchedSessionId: number | undefined;
    sessionTargetingMatch: boolean;
    configKeys: string[];
    metrics: RemoteConfigMetric;
    constructor({ localConfig, configKeys }: {
        localConfig: Config;
        configKeys: string[];
    });
    getRemoteConfig: <K extends keyof RemoteConfig>(configNamespace: string, key: K, sessionId?: number) => Promise<RemoteConfig[K] | undefined>;
    getServerUrl(): "https://sr-client-cfg.amplitude.com/config" | "https://sr-client-cfg.stag2.amplitude.com/config" | "https://sr-client-cfg.eu.amplitude.com/config";
    fetchWithTimeout: (sessionId?: number) => Promise<RemoteConfigAPIResponse<RemoteConfig> | void>;
    fetchRemoteConfig: (signal: AbortController['signal'], sessionId?: number) => Promise<RemoteConfigAPIResponse<RemoteConfig> | void>;
    retryFetch: (signal: AbortController['signal'], sessionId?: number) => Promise<RemoteConfigAPIResponse<RemoteConfig> | void>;
    parseAndStoreConfig: (res: Response) => Promise<RemoteConfigAPIResponse<RemoteConfig>>;
    completeRequest({ err, success }: {
        err?: string;
        success?: string;
    }): void;
}
export declare const createRemoteConfigFetch: CreateRemoteConfigFetch;
//# sourceMappingURL=remote-config.d.ts.map