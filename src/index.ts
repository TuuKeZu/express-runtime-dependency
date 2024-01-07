export class MultipartNetworkRequest {
    requestInitialized: [any, any] | undefined;
    requestHandled: [any, any] | undefined;
    requestFinished: [any, any] | undefined;
    requestError: number | null;

    constructor() {
        this.requestError = null;
    }

    init(): MultipartNetworkRequest {
        this.requestInitialized = process.hrtime();
        return this;
    }

    onRequestHandled() {
        this.requestHandled = process.hrtime(this.requestInitialized);
    }

    onRequestFinished() {
        this.requestFinished = process.hrtime(this.requestInitialized);
        this.dispose();
    }

    onRequestError(statusCode: number, details?: any) {
        this.requestHandled = process.hrtime(this.requestInitialized);
        this.requestFinished = process.hrtime(this.requestInitialized);
        this.requestError = statusCode;
        this.dispose();
    }

    dispose() {
        const handleTime = Math.round((this.requestHandled?.at(0) * 1000) + (this.requestHandled?.at(1) / 1000000));
        const finishTime = Math.round((this.requestFinished?.at(0) * 1000) + (this.requestFinished?.at(1) / 1000000));

        const analytics: MultipartNetworkRequestAnalytics = {
            status: !this.requestError ? RequestStatus.Success : RequestStatus.Error,
            error: this.requestError ?? undefined,
            handleTime: handleTime,
            processingTime: finishTime - handleTime,
            totalTime: finishTime,
        }

        console.log(analytics);
    }
}

export enum RequestStatus {
    Success = 'SUCCESS',
    Error = 'ERROR'
}

export interface MultipartNetworkRequestAnalytics {
    status: RequestStatus,
    error?: number,
    handleTime: number,
    processingTime: number,
    totalTime: number,
}