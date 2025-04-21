import { CreatePageViewTrackingPlugin, Options } from './typings/page-view-tracking';
export declare const defaultPageViewEvent = "[Amplitude] Page Viewed";
export declare const pageViewTrackingPlugin: CreatePageViewTrackingPlugin;
export declare const shouldTrackHistoryPageView: (trackingOption: Options['trackHistoryChanges'], newURLStr: string, oldURLStr: string) => boolean;
//# sourceMappingURL=page-view-tracking.d.ts.map