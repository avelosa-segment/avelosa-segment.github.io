import { Logger } from './logger';
export type ActionType = 'click' | 'change';
/**
 * Default CSS selectors to define which elements on the page to track.
 * Extend this list to include additional elements to track. For example:
 * ```
 * autocapturePlugin({
 *    cssSelectorAllowlist: [...DEFAULT_CSS_SELECTOR_ALLOWLIST, ".my-class"],
 * })
 * ```
 */
export declare const DEFAULT_CSS_SELECTOR_ALLOWLIST: string[];
/**
 * Default prefix to allow the plugin to capture data attributes as an event property.
 */
export declare const DEFAULT_DATA_ATTRIBUTE_PREFIX = "data-amp-track-";
/**
 * Default list of elements on the page should be tracked when the page changes.
 */
export declare const DEFAULT_ACTION_CLICK_ALLOWLIST: string[];
export interface ElementInteractionsOptions {
    /**
     * List of CSS selectors to allow auto tracking on.
     * When provided, allow elements matching any selector to be tracked.
     * Default is ['a', 'button', 'input', 'select', 'textarea', 'label', '[data-amp-default-track]', '.amp-default-track'].
     */
    cssSelectorAllowlist?: string[];
    /**
     * List of page URLs to allow auto tracking on.
     * When provided, only allow tracking on these URLs.
     * Both full URLs and regex are supported.
     */
    pageUrlAllowlist?: (string | RegExp)[];
    /**
     * Function to determine whether an event should be tracked.
     * When provided, this function overwrites all other allowlists and configurations.
     * If the function returns true, the event will be tracked.
     * If the function returns false, the event will not be tracked.
     * @param actionType - The type of action that triggered the event.
     * @param element - The [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) that triggered the event.
     */
    shouldTrackEventResolver?: (actionType: ActionType, element: DomElement) => boolean;
    /**
     * Prefix for data attributes to allow auto collecting.
     * Default is 'data-amp-track-'.
     */
    dataAttributePrefix?: string;
    /**
     * Options for integrating visual tagging selector.
     */
    visualTaggingOptions?: {
        enabled?: boolean;
        messenger?: Messenger;
    };
    /**
     * Debounce time in milliseconds for tracking events.
     * This is used to detect rage clicks.
     */
    debounceTime?: number;
    /**
     * CSS selector allowlist for tracking clicks that result in a DOM change/navigation on elements not already allowed by the cssSelectorAllowlist
     */
    actionClickAllowlist?: string[];
}
export interface Messenger {
    logger?: Logger;
    setup: () => void;
}
type DomElement = typeof globalThis extends {
    Element: new (...args: any) => infer T;
} ? T : never;
export {};
//# sourceMappingURL=element-interactions.d.ts.map