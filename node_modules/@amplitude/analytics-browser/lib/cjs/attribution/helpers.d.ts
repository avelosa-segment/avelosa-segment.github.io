import { ILogger } from '@amplitude/analytics-core';
import { Campaign } from './campaign';
export interface Options {
    excludeReferrers?: (string | RegExp)[];
    initialEmptyValue?: string;
    resetSessionOnNewCampaign?: boolean;
}
export declare const isNewCampaign: (current: Campaign, previous: Campaign | undefined, options: Options, logger: ILogger, isNewSession?: boolean) => boolean;
export declare const isExcludedReferrer: (excludeReferrers?: (string | RegExp)[], referringDomain?: string) => boolean;
export declare const createCampaignEvent: (campaign: Campaign, options: Options) => import("@amplitude/analytics-core").IdentifyEvent;
export declare const getDefaultExcludedReferrers: (cookieDomain: string | undefined) => RegExp[];
//# sourceMappingURL=helpers.d.ts.map