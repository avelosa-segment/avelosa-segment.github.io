import { __assign } from "tslib";
/**
 * Returns false if autocapture === false or if autocapture[event],
 * otherwise returns true
 */
var isTrackingEnabled = function (autocapture, event) {
    if (typeof autocapture === 'boolean') {
        return autocapture;
    }
    if ((autocapture === null || autocapture === void 0 ? void 0 : autocapture[event]) === false) {
        return false;
    }
    return true;
};
export var isAttributionTrackingEnabled = function (autocapture) {
    return isTrackingEnabled(autocapture, 'attribution');
};
export var isFileDownloadTrackingEnabled = function (autocapture) {
    return isTrackingEnabled(autocapture, 'fileDownloads');
};
export var isFormInteractionTrackingEnabled = function (autocapture) {
    return isTrackingEnabled(autocapture, 'formInteractions');
};
export var isPageViewTrackingEnabled = function (autocapture) {
    return isTrackingEnabled(autocapture, 'pageViews');
};
export var isSessionTrackingEnabled = function (autocapture) {
    return isTrackingEnabled(autocapture, 'sessions');
};
/**
 * Returns true if
 * 1. autocapture === true
 * 2. if autocapture.elementInteractions === true
 * 3. if autocapture.elementInteractions === object
 * otherwise returns false
 */
export var isElementInteractionsEnabled = function (autocapture) {
    if (typeof autocapture === 'boolean') {
        return autocapture;
    }
    if (typeof autocapture === 'object' &&
        (autocapture.elementInteractions === true || typeof autocapture.elementInteractions === 'object')) {
        return true;
    }
    return false;
};
export var getElementInteractionsConfig = function (config) {
    if (isElementInteractionsEnabled(config.autocapture) &&
        typeof config.autocapture === 'object' &&
        typeof config.autocapture.elementInteractions === 'object') {
        return config.autocapture.elementInteractions;
    }
    return undefined;
};
export var getPageViewTrackingConfig = function (config) {
    var trackOn = function () { return false; };
    var trackHistoryChanges = undefined;
    var eventType;
    var pageCounter = config.pageCounter;
    var isDefaultPageViewTrackingEnabled = isPageViewTrackingEnabled(config.defaultTracking);
    if (isDefaultPageViewTrackingEnabled) {
        trackOn = undefined;
        eventType = undefined;
        if (config.defaultTracking &&
            typeof config.defaultTracking === 'object' &&
            config.defaultTracking.pageViews &&
            typeof config.defaultTracking.pageViews === 'object') {
            if ('trackOn' in config.defaultTracking.pageViews) {
                trackOn = config.defaultTracking.pageViews.trackOn;
            }
            if ('trackHistoryChanges' in config.defaultTracking.pageViews) {
                trackHistoryChanges = config.defaultTracking.pageViews.trackHistoryChanges;
            }
            if ('eventType' in config.defaultTracking.pageViews && config.defaultTracking.pageViews.eventType) {
                eventType = config.defaultTracking.pageViews.eventType;
            }
        }
    }
    return {
        trackOn: trackOn,
        trackHistoryChanges: trackHistoryChanges,
        eventType: eventType,
        pageCounter: pageCounter,
    };
};
export var getAttributionTrackingConfig = function (config) {
    if (isAttributionTrackingEnabled(config.defaultTracking) &&
        config.defaultTracking &&
        typeof config.defaultTracking === 'object' &&
        config.defaultTracking.attribution &&
        typeof config.defaultTracking.attribution === 'object') {
        return __assign({}, config.defaultTracking.attribution);
    }
    return {};
};
//# sourceMappingURL=default-tracking.js.map