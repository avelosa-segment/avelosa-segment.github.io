"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackActionClick = void 0;
var tslib_1 = require("tslib");
var rxjs_1 = require("rxjs");
var helpers_1 = require("../helpers");
var constants_1 = require("../constants");
function trackActionClick(_a) {
    var amplitude = _a.amplitude, allObservables = _a.allObservables, options = _a.options, getEventProperties = _a.getEventProperties, shouldTrackEvent = _a.shouldTrackEvent, shouldTrackActionClick = _a.shouldTrackActionClick;
    var clickObservable = allObservables.clickObservable, mutationObservable = allObservables.mutationObservable, navigateObservable = allObservables.navigateObservable;
    var filteredClickObservable = clickObservable.pipe((0, rxjs_1.filter)(function (click) {
        // Filter out regularly tracked click events that are already handled in trackClicks
        return !shouldTrackEvent('click', click.closestTrackedAncestor);
    }), (0, rxjs_1.map)(function (click) {
        // overwrite the closestTrackedAncestor with the closest element that is on the actionClickAllowlist
        var closestActionClickEl = (0, helpers_1.getClosestElement)(click.event.target, options.actionClickAllowlist);
        click.closestTrackedAncestor = closestActionClickEl;
        // overwrite the targetElementProperties with the properties of the closestActionClickEl
        if (click.closestTrackedAncestor !== null) {
            click.targetElementProperties = getEventProperties(click.type, click.closestTrackedAncestor);
        }
        return click;
    }), (0, rxjs_1.filter)(helpers_1.filterOutNonTrackableEvents), (0, rxjs_1.filter)(function (clickEvent) {
        // Only track change on elements that should be tracked
        return shouldTrackActionClick('click', clickEvent.closestTrackedAncestor);
    }));
    var changeObservables = [mutationObservable];
    /* istanbul ignore next */
    if (navigateObservable) {
        changeObservables.push(navigateObservable);
    }
    var mutationOrNavigate = rxjs_1.merge.apply(void 0, tslib_1.__spreadArray([], tslib_1.__read(changeObservables), false));
    var actionClicks = filteredClickObservable.pipe(
    // If a mutation occurs within 0.5 seconds of a click event (timeout({ first: 500 })), it emits the original first click event.
    // take 1 to only limit the action events in case there are multiple
    (0, rxjs_1.switchMap)(function (click) {
        return mutationOrNavigate.pipe((0, rxjs_1.take)(1), (0, rxjs_1.timeout)({ first: 500, with: function () { return rxjs_1.EMPTY; } }), // in case of timeout, map to empty to prevent any click from being emitted
        (0, rxjs_1.map)(function () { return click; }));
    }));
    return actionClicks.subscribe(function (actionClick) {
        /* istanbul ignore next */
        amplitude === null || amplitude === void 0 ? void 0 : amplitude.track(constants_1.AMPLITUDE_ELEMENT_CLICKED_EVENT, getEventProperties('click', actionClick.closestTrackedAncestor));
    });
}
exports.trackActionClick = trackActionClick;
//# sourceMappingURL=track-action-click.js.map