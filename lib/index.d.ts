export declare class MultipartNetworkRequest {
    #private;
    constructor();
    init(): MultipartNetworkRequest;
    onRequestHandled(): void;
    onRequestFinished(): void;
    onRequestError(statusCode: number, details?: any): void;
}
export interface AnalyticsPacket {
    type: AnalyticsPacketType;
    status: RequestStatus;
    error?: number;
    totalTime: number;
}
export declare enum AnalyticsPacketType {
    MultipartNetworkRequest = 0
}
export declare enum RequestStatus {
    Success = "SUCCESS",
    Error = "ERROR"
}
export declare class MultipartNetworkRequestAnalytics implements AnalyticsPacket {
    type: AnalyticsPacketType;
    status: RequestStatus;
    error?: number;
    handleTime: number;
    processingTime: number;
    totalTime: number;
    constructor(options: {
        status: RequestStatus;
        error?: number;
        handleTime: number;
        processingTime: number;
        totalTime: number;
    });
}
