"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttributionTrackingConfig = exports.getPageViewTrackingConfig = exports.getElementInteractionsConfig = exports.isElementInteractionsEnabled = exports.isSessionTrackingEnabled = exports.isPageViewTrackingEnabled = exports.isFormInteractionTrackingEnabled = exports.isFileDownloadTrackingEnabled = exports.isAttributionTrackingEnabled = void 0;
var tslib_1 = require("tslib");
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
var isAttributionTrackingEnabled = function (autocapture) {
    return isTrackingEnabled(autocapture, 'attribution');
};
exports.isAttributionTrackingEnabled = isAttributionTrackingEnabled;
var isFileDownloadTrackingEnabled = function (autocapture) {
    return isTrackingEnabled(autocapture, 'fileDownloads');
};
exports.isFileDownloadTrackingEnabled = isFileDownloadTrackingEnabled;
var isFormInteractionTrackingEnabled = function (autocapture) {
    return isTrackingEnabled(autocapture, 'formInteractions');
};
exports.isFormInteractionTrackingEnabled = isFormInteractionTrackingEnabled;
var isPageViewTrackingEnabled = function (autocapture) {
    return isTrackingEnabled(autocapture, 'pageViews');
};
exports.isPageViewTrackingEnabled = isPageViewTrackingEnabled;
var isSessionTrackingEnabled = function (autocapture) {
    return isTrackingEnabled(autocapture, 'sessions');
};
exports.isSessionTrackingEnabled = isSessionTrackingEnabled;
/**
 * Returns true if
 * 1. autocapture === true
 * 2. if autocapture.elementInteractions === true
 * 3. if autocapture.elementInteractions === object
 * otherwise returns false
 */
var isElementInteractionsEnabled = function (autocapture) {
    if (typeof autocapture === 'boolean') {
        return autocapture;
    }
    if (typeof autocapture === 'object' &&
        (autocapture.elementInteractions === true || typeof autocapture.elementInteractions === 'object')) {
        return true;
    }
    return false;
};
exports.isElementInteractionsEnabled = isElementInteractionsEnabled;
var getElementInteractionsConfig = function (config) {
    if ((0, exports.isElementInteractionsEnabled)(config.autocapture) &&
        typeof config.autocapture === 'object' &&
        typeof config.autocapture.elementInteractions === 'object') {
        return config.autocapture.elementInteractions;
    }
    return undefined;
};
exports.getElementInteractionsConfig = getElementInteractionsConfig;
var getPageViewTrackingConfig = function (config) {
    var trackOn = function () { return false; };
    var trackHistoryChanges = undefined;
    var eventType;
    var pageCounter = config.pageCounter;
    var isDefaultPageViewTrackingEnabled = (0, exports.isPageViewTrackingEnabled)(config.defaultTracking);
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
exports.getPageViewTrackingConfig = getPageViewTrackingConfig;
var getAttributionTrackingConfig = function (config) {
    if ((0, exports.isAttributionTrackingEnabled)(config.defaultTracking) &&
        config.defaultTracking &&
        typeof config.defaultTracking === 'object' &&
        config.defaultTracking.attribution &&
        typeof config.defaultTracking.attribution === 'object') {
        return tslib_1.__assign({}, config.defaultTracking.attribution);
    }
    return {};
};
exports.getAttributionTrackingConfig = getAttributionTrackingConfig;
//# sourceMappingURL=default-tracking.js.map