import { BaseTransport, Payload, Response, Transport } from '@amplitude/analytics-core';
export declare class SendBeaconTransport extends BaseTransport implements Transport {
    send(serverUrl: string, payload: Payload): Promise<Response | null>;
}
//# sourceMappingURL=send-beacon.d.ts.map