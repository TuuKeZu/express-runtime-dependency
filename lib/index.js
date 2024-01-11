"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipartNetworkRequestAnalytics = exports.RequestStatus = exports.AnalyticsPacketType = exports.MultipartNetworkRequest = void 0;
class MultipartNetworkRequest {
    #requestInitialized;
    #requestHandled;
    #requestFinished;
    #requestError;
    constructor() {
        this.#requestError = null;
    }
    init() {
        if (!process.send)
            console.warn('Missing parent process for MultipartNetworkRequest analytics');
        this.#requestInitialized = process.hrtime();
        return this;
    }
    onRequestHandled() {
        this.#requestHandled = process.hrtime(this.#requestInitialized);
    }
    onRequestFinished() {
        this.#requestFinished = process.hrtime(this.#requestInitialized);
        this.#dispose();
    }
    onRequestError(statusCode, details) {
        this.#requestHandled = process.hrtime(this.#requestInitialized);
        this.#requestFinished = process.hrtime(this.#requestInitialized);
        this.#requestError = statusCode;
        this.#dispose();
    }
    #dispose() {
        const handleTime = Math.round((this.#requestHandled?.at(0) * 1000) + (this.#requestHandled?.at(1) / 1000000));
        const finishTime = Math.round((this.#requestFinished?.at(0) * 1000) + (this.#requestFinished?.at(1) / 1000000));
        const analytics = new MultipartNetworkRequestAnalytics({
            status: !this.#requestError ? RequestStatus.Success : RequestStatus.Error,
            error: this.#requestError ?? undefined,
            handleTime: handleTime,
            processingTime: finishTime - handleTime,
            totalTime: finishTime,
        });
        if (process.send)
            process.send(analytics);
    }
}
exports.MultipartNetworkRequest = MultipartNetworkRequest;
var AnalyticsPacketType;
(function (AnalyticsPacketType) {
    AnalyticsPacketType[AnalyticsPacketType["MultipartNetworkRequest"] = 0] = "MultipartNetworkRequest";
})(AnalyticsPacketType || (exports.AnalyticsPacketType = AnalyticsPacketType = {}));
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["Success"] = "SUCCESS";
    RequestStatus["Error"] = "ERROR";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
class MultipartNetworkRequestAnalytics {
    type = AnalyticsPacketType.MultipartNetworkRequest;
    status;
    error;
    handleTime;
    processingTime;
    totalTime;
    constructor(options) {
        this.status = options.status;
        this.error = options.error;
        this.handleTime = options.handleTime;
        this.processingTime = options.processingTime;
        this.totalTime = options.totalTime;
    }
}
exports.MultipartNetworkRequestAnalytics = MultipartNetworkRequestAnalytics;
