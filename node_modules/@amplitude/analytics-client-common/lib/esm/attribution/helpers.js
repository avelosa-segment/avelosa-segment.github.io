import { __assign, __read, __rest } from "tslib";
import { createIdentifyEvent, Identify } from '@amplitude/analytics-core';
import { BASE_CAMPAIGN } from './constants';
var domainWithoutSubdomain = function (domain) {
    var parts = domain.split('.');
    if (parts.length <= 2) {
        return domain;
    }
    return parts.slice(parts.length - 2, parts.length).join('.');
};
//Direct traffic mean no external referral, no UTMs, no click-ids, and no other customer identified marketing campaign url params.
var isDirectTraffic = function (current) {
    return Object.values(current).every(function (value) { return !value; });
};
export var isNewCampaign = function (current, previous, options, logger, isNewSession) {
    if (isNewSession === void 0) { isNewSession = true; }
    var referrer = current.referrer, referring_domain = current.referring_domain, currentCampaign = __rest(current, ["referrer", "referring_domain"]);
    var _a = previous || {}, _previous_referrer = _a.referrer, prevReferringDomain = _a.referring_domain, previousCampaign = __rest(_a, ["referrer", "referring_domain"]);
    if (isExcludedReferrer(options.excludeReferrers, current.referring_domain)) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        logger.debug("This is not a new campaign because ".concat(current.referring_domain, " is in the exclude referrer list."));
        return false;
    }
    //In the same session, direct traffic should not override or unset any persisting query params
    if (!isNewSession && isDirectTraffic(current) && previous) {
        logger.debug('This is not a new campaign because this is a direct traffic in the same session.');
        return false;
    }
    var hasNewCampaign = JSON.stringify(currentCampaign) !== JSON.stringify(previousCampaign);
    var hasNewDomain = domainWithoutSubdomain(referring_domain || '') !== domainWithoutSubdomain(prevReferringDomain || '');
    var result = !previous || hasNewCampaign || hasNewDomain;
    if (!result) {
        logger.debug("This is not a new campaign because it's the same as the previous one.");
    }
    else {
        logger.debug("This is a new campaign. An $identify event will be sent.");
    }
    return result;
};
export var isExcludedReferrer = function (excludeReferrers, referringDomain) {
    if (excludeReferrers === void 0) { excludeReferrers = []; }
    if (referringDomain === void 0) { referringDomain = ''; }
    return excludeReferrers.some(function (value) {
        return value instanceof RegExp ? value.test(referringDomain) : value === referringDomain;
    });
};
export var createCampaignEvent = function (campaign, options) {
    var campaignParameters = __assign(__assign({}, BASE_CAMPAIGN), campaign);
    var identifyEvent = Object.entries(campaignParameters).reduce(function (identify, _a) {
        var _b;
        var _c = __read(_a, 2), key = _c[0], value = _c[1];
        identify.setOnce("initial_".concat(key), (_b = value !== null && value !== void 0 ? value : options.initialEmptyValue) !== null && _b !== void 0 ? _b : 'EMPTY');
        if (value) {
            return identify.set(key, value);
        }
        return identify.unset(key);
    }, new Identify());
    return createIdentifyEvent(identifyEvent);
};
export var getDefaultExcludedReferrers = function (cookieDomain) {
    var domain = cookieDomain;
    if (domain) {
        if (domain.startsWith('.')) {
            domain = domain.substring(1);
        }
        return [new RegExp("".concat(domain.replace('.', '\\.'), "$"))];
    }
    return [];
};
//# sourceMappingURL=helpers.js.map