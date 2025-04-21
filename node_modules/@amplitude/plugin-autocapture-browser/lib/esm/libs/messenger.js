/* istanbul ignore file */
/* eslint-disable no-restricted-globals */
import { AMPLITUDE_ORIGIN, AMPLITUDE_VISUAL_TAGGING_SELECTOR_SCRIPT_URL, AMPLITUDE_VISUAL_TAGGING_HIGHLIGHT_CLASS, } from '../constants';
import { asyncLoadScript, generateUniqueId, getEventTagProps } from '../helpers';
// TODO: use MessageChannel instead of window.postMessage
var WindowMessenger = /** @class */ (function () {
    function WindowMessenger(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.origin, origin = _c === void 0 ? AMPLITUDE_ORIGIN : _c;
        var _this = this;
        this.endpoint = AMPLITUDE_ORIGIN;
        this.requestCallbacks = {};
        this.onSelect = function (data) {
            _this.notify({ action: 'element-selected', data: data });
        };
        this.onTrack = function (type, properties) {
            if (type === 'selector-mode-changed') {
                _this.notify({ action: 'track-selector-mode-changed', data: properties });
            }
            else if (type === 'selector-moved') {
                _this.notify({ action: 'track-selector-moved', data: properties });
            }
        };
        this.endpoint = origin;
    }
    WindowMessenger.prototype.notify = function (message) {
        var _a, _b, _c, _d;
        (_b = (_a = this.logger) === null || _a === void 0 ? void 0 : _a.debug) === null || _b === void 0 ? void 0 : _b.call(_a, 'Message sent: ', JSON.stringify(message));
        (_d = (_c = window.opener) === null || _c === void 0 ? void 0 : _c.postMessage) === null || _d === void 0 ? void 0 : _d.call(_c, message, this.endpoint);
    };
    // Send an async request to the parent window
    WindowMessenger.prototype.sendRequest = function (action, args, options) {
        var _this = this;
        if (options === void 0) { options = { timeout: 15000 }; }
        // Create Request ID
        var id = generateUniqueId();
        var request = {
            id: id,
            action: action,
            args: args,
        };
        // Create a Promise that will be resolved when the response is received
        var promise = new Promise(function (resolve, reject) {
            _this.requestCallbacks[id] = { resolve: resolve, reject: reject };
            // Send the request
            _this.notify(request);
            // Handle request timeouts
            if ((options === null || options === void 0 ? void 0 : options.timeout) > 0) {
                setTimeout(function () {
                    reject(new Error("".concat(action, " timed out (id: ").concat(id, ")")));
                    delete _this.requestCallbacks[id];
                }, options.timeout);
            }
        });
        return promise;
    };
    // Handle messages from the parent window
    WindowMessenger.prototype.handleResponse = function (response) {
        var _a;
        if (!this.requestCallbacks[response.id]) {
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.warn("No callback found for request id: ".concat(response.id));
            return;
        }
        this.requestCallbacks[response.id].resolve(response.responseData);
        delete this.requestCallbacks[response.id];
    };
    WindowMessenger.prototype.setup = function (_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, logger = _b.logger, endpoint = _b.endpoint, isElementSelectable = _b.isElementSelectable, cssSelectorAllowlist = _b.cssSelectorAllowlist, actionClickAllowlist = _b.actionClickAllowlist;
        this.logger = logger;
        // If endpoint is customized, don't override it.
        if (endpoint && this.endpoint === AMPLITUDE_ORIGIN) {
            this.endpoint = endpoint;
        }
        var amplitudeVisualTaggingSelectorInstance = null;
        // Attach Event Listener to listen for messages from the parent window
        window.addEventListener('message', function (event) {
            var _a, _b, _c, _d, _e;
            (_b = (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.debug) === null || _b === void 0 ? void 0 : _b.call(_a, 'Message received: ', JSON.stringify(event));
            // Only accept messages from the specified origin
            if (_this.endpoint !== event.origin) {
                return;
            }
            var eventData = event === null || event === void 0 ? void 0 : event.data;
            var action = eventData === null || eventData === void 0 ? void 0 : eventData.action;
            // Ignore messages without action
            if (!action) {
                return;
            }
            // If id exists, handle responses to previous requests
            if ('id' in eventData) {
                (_d = (_c = _this.logger) === null || _c === void 0 ? void 0 : _c.debug) === null || _d === void 0 ? void 0 : _d.call(_c, 'Received Response to previous request: ', JSON.stringify(event));
                _this.handleResponse(eventData);
                // If action exists, handle the action using existing handlers
            }
            else {
                if (action === 'ping') {
                    _this.notify({ action: 'pong' });
                }
                else if (action === 'initialize-visual-tagging-selector') {
                    var actionData_1 = eventData === null || eventData === void 0 ? void 0 : eventData.data;
                    asyncLoadScript(AMPLITUDE_VISUAL_TAGGING_SELECTOR_SCRIPT_URL)
                        .then(function () {
                        var _a;
                        // eslint-disable-next-line
                        amplitudeVisualTaggingSelectorInstance = (_a = window === null || window === void 0 ? void 0 : window.amplitudeVisualTaggingSelector) === null || _a === void 0 ? void 0 : _a.call(window, {
                            getEventTagProps: getEventTagProps,
                            isElementSelectable: function (element) {
                                if (isElementSelectable) {
                                    return isElementSelectable((actionData_1 === null || actionData_1 === void 0 ? void 0 : actionData_1.actionType) || 'click', element);
                                }
                                return true;
                            },
                            onTrack: _this.onTrack,
                            onSelect: _this.onSelect,
                            visualHighlightClass: AMPLITUDE_VISUAL_TAGGING_HIGHLIGHT_CLASS,
                            messenger: _this,
                            cssSelectorAllowlist: cssSelectorAllowlist,
                            actionClickAllowlist: actionClickAllowlist,
                        });
                        _this.notify({ action: 'selector-loaded' });
                    })
                        .catch(function () {
                        var _a;
                        (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.warn('Failed to initialize visual tagging selector');
                    });
                }
                else if (action === 'close-visual-tagging-selector') {
                    // eslint-disable-next-line
                    (_e = amplitudeVisualTaggingSelectorInstance === null || amplitudeVisualTaggingSelectorInstance === void 0 ? void 0 : amplitudeVisualTaggingSelectorInstance.close) === null || _e === void 0 ? void 0 : _e.call(amplitudeVisualTaggingSelectorInstance);
                }
            }
        });
        // Notify the parent window that the page has loaded
        this.notify({ action: 'page-loaded' });
    };
    return WindowMessenger;
}());
export { WindowMessenger };
//# sourceMappingURL=messenger.js.map