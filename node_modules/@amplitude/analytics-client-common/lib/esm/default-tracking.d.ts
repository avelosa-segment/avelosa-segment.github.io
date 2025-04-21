import { AttributionOptions, AutocaptureOptions, BrowserOptions, PageTrackingOptions, ElementInteractionsOptions } from '@amplitude/analytics-types';
export declare const isAttributionTrackingEnabled: (autocapture: AutocaptureOptions | boolean | undefined) => boolean;
export declare const isFileDownloadTrackingEnabled: (autocapture: AutocaptureOptions | boolean | undefined) => boolean;
export declare const isFormInteractionTrackingEnabled: (autocapture: AutocaptureOptions | boolean | undefined) => boolean;
export declare const isPageViewTrackingEnabled: (autocapture: AutocaptureOptions | boolean | undefined) => boolean;
export declare const isSessionTrackingEnabled: (autocapture: AutocaptureOptions | boolean | undefined) => boolean;
/**
 * Returns true if
 * 1. autocapture === true
 * 2. if autocapture.elementInteractions === true
 * 3. if autocapture.elementInteractions === object
 * otherwise returns false
 */
export declare const isElementInteractionsEnabled: (autocapture: AutocaptureOptions | boolean | undefined) => boolean;
export declare const getElementInteractionsConfig: (config: BrowserOptions) => ElementInteractionsOptions | undefined;
export declare const getPageViewTrackingConfig: (config: BrowserOptions) => PageTrackingOptions;
export declare const getAttributionTrackingConfig: (config: BrowserOptions) => AttributionOptions;
//# sourceMappingURL=default-tracking.d.ts.map