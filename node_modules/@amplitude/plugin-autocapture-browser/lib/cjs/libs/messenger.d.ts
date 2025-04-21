import { ILogger, Messenger, ActionType } from '@amplitude/analytics-core';
export type Action = 'ping' | 'pong' | 'page-loaded' | 'selector-loaded' | 'initialize-visual-tagging-selector' | 'close-visual-tagging-selector' | 'element-selected' | 'track-selector-mode-changed' | 'track-selector-moved';
interface InitializeVisualTaggingSelectorData {
    actionType: ActionType;
}
interface ElementSelectedData {
    '[Amplitude] Element Hierarchy'?: string;
    '[Amplitude] Element Tag'?: string;
    '[Amplitude] Element Text'?: string;
    '[Amplitude] Page URL'?: string;
    elementScreenshot?: Blob;
}
interface TrackSelectorModeChangedData {
    newMode: string;
    pageUrl?: string;
}
interface TrackSelectorMovedData {
    newEditorLocation: string;
    pageUrl?: string;
}
export type ActionData = {
    ping: null | undefined;
    pong: null | undefined;
    'page-loaded': null | undefined;
    'selector-loaded': null | undefined;
    'initialize-visual-tagging-selector': InitializeVisualTaggingSelectorData | null | undefined;
    'close-visual-tagging-selector': null | undefined;
    'element-selected': ElementSelectedData;
    'track-selector-mode-changed': TrackSelectorModeChangedData;
    'track-selector-moved': TrackSelectorMovedData;
};
export interface Message<A extends Action> {
    action: A;
    data?: ActionData[A];
}
export declare class WindowMessenger implements Messenger {
    endpoint: string;
    logger?: ILogger;
    requestCallbacks: {
        [id: string]: {
            resolve: (data: any) => void;
            reject: (data: any) => void;
        };
    };
    constructor({ origin }?: {
        origin?: string;
    });
    private notify;
    sendRequest(action: string, args: Record<string, any>, options?: {
        timeout: number;
    }): Promise<any>;
    private handleResponse;
    setup({ logger, endpoint, isElementSelectable, cssSelectorAllowlist, actionClickAllowlist, }?: {
        logger?: ILogger;
        endpoint?: string;
        isElementSelectable?: (action: InitializeVisualTaggingSelectorData['actionType'], element: Element) => boolean;
        cssSelectorAllowlist?: string[];
        actionClickAllowlist?: string[];
    }): void;
    private onSelect;
    private onTrack;
}
export {};
//# sourceMappingURL=messenger.d.ts.map