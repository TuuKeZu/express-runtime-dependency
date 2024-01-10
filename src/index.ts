export class MultipartNetworkRequest {
    #requestInitialized: [any, any] | undefined;
    #requestHandled: [any, any] | undefined;
    #requestFinished: [any, any] | undefined;
    #requestError: number | null;

    constructor() {
        this.#requestError = null;
    }

    init(): MultipartNetworkRequest {
        if (!process.send) console.warn('Missing parent process for MultipartNetworkRequest analytics')
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

    onRequestError(statusCode: number, details?: any) {
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

        if (process.send) process.send(analytics);
    }
}

export interface AnalyticsPacket {
    type: AnalyticsPacketType;
    status: RequestStatus;
    error?: number;
    totalTime: number;
}
export enum AnalyticsPacketType {
    MultipartNetworkRequest
}

export enum RequestStatus {
    Success = 'SUCCESS',
    Error = 'ERROR'
}

export class MultipartNetworkRequestAnalytics implements AnalyticsPacket {
    type = AnalyticsPacketType.MultipartNetworkRequest;
    status: RequestStatus;
    error?: number;
    handleTime: number;
    processingTime: number;
    totalTime: number;

    constructor(options: {
        status: RequestStatus,
        error?: number,
        handleTime: number,
        processingTime: number,
        totalTime: number,
    }) {
        this.status = options.status;
        this.error = options.error;
        this.handleTime = options.handleTime;
        this.processingTime = options.processingTime;
        this.totalTime = options.totalTime;
    }
}