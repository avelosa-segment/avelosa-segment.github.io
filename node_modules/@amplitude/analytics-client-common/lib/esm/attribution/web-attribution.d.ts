import { BrowserConfig, Logger } from '@amplitude/analytics-types';
import { Campaign, Storage } from '@amplitude/analytics-types';
import { Options } from './helpers';
export declare class WebAttribution {
    options: Options;
    storage: Storage<Campaign>;
    storageKey: string;
    previousCampaign?: Campaign;
    currentCampaign: Campaign;
    shouldTrackNewCampaign: boolean;
    sessionTimeout: number;
    lastEventTime?: number;
    logger: Logger;
    constructor(options: Options, config: BrowserConfig);
    init(): Promise<void>;
    fetchCampaign(): Promise<[Campaign, Campaign | undefined]>;
    /**
     * This can be called when enable web attribution and either
     * 1. set a new session
     * 2. has new campaign and enable resetSessionOnNewCampaign
     */
    generateCampaignEvent(event_id?: number): import("@amplitude/analytics-core").IdentifyEvent;
    shouldSetSessionIdOnNewCampaign(): boolean;
}
//# sourceMappingURL=web-attribution.d.ts.map