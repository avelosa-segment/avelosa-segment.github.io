var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRemoteConfigFetch = exports.RemoteConfigFetch = exports.REMOTE_CONFIG_SERVER_URL_EU = exports.REMOTE_CONFIG_SERVER_URL_STAGING = exports.REMOTE_CONFIG_SERVER_URL = void 0;
var tslib_1 = require("tslib");
var analytics_core_1 = require("@amplitude/analytics-core");
var analytics_types_1 = require("@amplitude/analytics-types");
var UNEXPECTED_NETWORK_ERROR_MESSAGE = 'Network error occurred, remote config fetch failed';
var SUCCESS_REMOTE_CONFIG = 'Remote config successfully fetched';
var MAX_RETRIES_EXCEEDED_MESSAGE = 'Remote config fetch rejected due to exceeded retry count';
var TIMEOUT_MESSAGE = 'Remote config fetch rejected due to timeout after 5 seconds';
var UNEXPECTED_ERROR_MESSAGE = 'Unexpected error occurred';
exports.REMOTE_CONFIG_SERVER_URL = 'https://sr-client-cfg.amplitude.com/config';
exports.REMOTE_CONFIG_SERVER_URL_STAGING = 'https://sr-client-cfg.stag2.amplitude.com/config';
exports.REMOTE_CONFIG_SERVER_URL_EU = 'https://sr-client-cfg.eu.amplitude.com/config';
var RemoteConfigFetch = /** @class */ (function () {
    function RemoteConfigFetch(_a) {
        var localConfig = _a.localConfig, configKeys = _a.configKeys;
        var _this = this;
        this.retryTimeout = 1000;
        this.attempts = 0;
        this.sessionTargetingMatch = false;
        this.metrics = {};
        this.getRemoteConfig = function (configNamespace, key, sessionId) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fetchStartTime, configAPIResponse, remoteConfig;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchStartTime = Date.now();
                        return [4 /*yield*/, this.fetchWithTimeout(sessionId)];
                    case 1:
                        configAPIResponse = _a.sent();
                        if (configAPIResponse) {
                            remoteConfig = configAPIResponse.configs && configAPIResponse.configs[configNamespace];
                            if (remoteConfig) {
                                this.metrics.fetchTimeAPISuccess = Date.now() - fetchStartTime;
                                return [2 /*return*/, remoteConfig[key]];
                            }
                        }
                        this.metrics.fetchTimeAPIFail = Date.now() - fetchStartTime;
                        return [2 /*return*/, undefined];
                }
            });
        }); };
        this.fetchWithTimeout = function (sessionId) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var controller, timeoutId, remoteConfig;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        controller = new AbortController();
                        timeoutId = setTimeout(function () { return controller.abort(); }, 5000);
                        return [4 /*yield*/, this.fetchRemoteConfig(controller.signal, sessionId)];
                    case 1:
                        remoteConfig = _a.sent();
                        clearTimeout(timeoutId);
                        return [2 /*return*/, remoteConfig];
                }
            });
        }); };
        this.fetchRemoteConfig = function (signal, sessionId) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var urlParams, _a, _b, configKey, options, serverUrl, res, parsedStatus, e_1, knownError;
            var e_2, _c;
            var _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (sessionId === this.lastFetchedSessionId && this.attempts >= this.localConfig.flushMaxRetries) {
                            return [2 /*return*/, this.completeRequest({ err: MAX_RETRIES_EXCEEDED_MESSAGE })];
                        }
                        else if (signal.aborted) {
                            return [2 /*return*/, this.completeRequest({ err: TIMEOUT_MESSAGE })];
                        }
                        else if (sessionId !== this.lastFetchedSessionId) {
                            this.lastFetchedSessionId = sessionId;
                            this.attempts = 0;
                        }
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        urlParams = new URLSearchParams({
                            api_key: this.localConfig.apiKey,
                        });
                        try {
                            for (_a = tslib_1.__values(this.configKeys), _b = _a.next(); !_b.done; _b = _a.next()) {
                                configKey = _b.value;
                                urlParams.append('config_keys', configKey);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        if (sessionId) {
                            urlParams.set('session_id', String(sessionId));
                        }
                        options = {
                            headers: {
                                Accept: '*/*',
                            },
                            method: 'GET',
                        };
                        serverUrl = "".concat(this.getServerUrl(), "?").concat(urlParams.toString());
                        this.attempts += 1;
                        return [4 /*yield*/, fetch(serverUrl, tslib_1.__assign(tslib_1.__assign({}, options), { signal: signal }))];
                    case 2:
                        res = _e.sent();
                        if (res === null) {
                            return [2 /*return*/, this.completeRequest({ err: UNEXPECTED_ERROR_MESSAGE })];
                        }
                        parsedStatus = new analytics_core_1.BaseTransport().buildStatus(res.status);
                        switch (parsedStatus) {
                            case analytics_types_1.Status.Success:
                                this.attempts = 0;
                                return [2 /*return*/, this.parseAndStoreConfig(res)];
                            case analytics_types_1.Status.Failed:
                                return [2 /*return*/, this.retryFetch(signal, sessionId)];
                            default:
                                return [2 /*return*/, this.completeRequest({ err: UNEXPECTED_NETWORK_ERROR_MESSAGE })];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _e.sent();
                        knownError = e_1;
                        if (signal.aborted) {
                            return [2 /*return*/, this.completeRequest({ err: TIMEOUT_MESSAGE })];
                        }
                        return [2 /*return*/, this.completeRequest({ err: (_d = knownError.message) !== null && _d !== void 0 ? _d : UNEXPECTED_ERROR_MESSAGE })];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.retryFetch = function (signal, sessionId) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, _this.attempts * _this.retryTimeout); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.fetchRemoteConfig(signal, sessionId)];
                }
            });
        }); };
        this.parseAndStoreConfig = function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var remoteConfig;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, res.json()];
                    case 1:
                        remoteConfig = (_a.sent());
                        this.completeRequest({ success: SUCCESS_REMOTE_CONFIG });
                        return [2 /*return*/, remoteConfig];
                }
            });
        }); };
        this.localConfig = localConfig;
        this.configKeys = configKeys;
    }
    RemoteConfigFetch.prototype.getServerUrl = function () {
        if (this.localConfig.serverZone === analytics_types_1.ServerZone.STAGING) {
            return exports.REMOTE_CONFIG_SERVER_URL_STAGING;
        }
        if (this.localConfig.serverZone === analytics_types_1.ServerZone.EU) {
            return exports.REMOTE_CONFIG_SERVER_URL_EU;
        }
        return exports.REMOTE_CONFIG_SERVER_URL;
    };
    RemoteConfigFetch.prototype.completeRequest = function (_a) {
        var err = _a.err, success = _a.success;
        if (err) {
            throw new Error(err);
        }
        else if (success) {
            this.localConfig.loggerProvider.log(success);
        }
    };
    return RemoteConfigFetch;
}());
exports.RemoteConfigFetch = RemoteConfigFetch;
var createRemoteConfigFetch = function (_a) {
    var localConfig = _a.localConfig, configKeys = _a.configKeys;
    return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_b) {
            return [2 /*return*/, new RemoteConfigFetch({ localConfig: localConfig, configKeys: configKeys })];
        });
    });
};
exports.createRemoteConfigFetch = createRemoteConfigFetch;
//# sourceMappingURL=remote-config.js.map