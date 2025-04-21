import { Campaign, Logger } from '@amplitude/analytics-types';
export interface Options {
    excludeReferrers?: (string | RegExp)[];
    initialEmptyValue?: string;
    resetSessionOnNewCampaign?: boolean;
}
export declare const isNewCampaign: (current: Campaign, previous: Campaign | undefined, options: Options, logger: Logger, isNewSession?: boolean) => boolean;
export declare const isExcludedReferrer: (excludeReferrers?: (string | RegExp)[], referringDomain?: string) => boolean;
export declare const createCampaignEvent: (campaign: Campaign, options: Options) => import("@amplitude/analytics-core").IdentifyEvent;
export declare const getDefaultExcludedReferrers: (cookieDomain: string | undefined) => RegExp[];
//# sourceMappingURL=helpers.d.ts.map