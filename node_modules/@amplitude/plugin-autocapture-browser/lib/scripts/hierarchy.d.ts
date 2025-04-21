import { JSONValue } from './helpers';
import { Hierarchy, HierarchyNode } from './typings/autocapture';
export declare function getElementProperties(element: Element | null): HierarchyNode | null;
export declare function getAncestors(targetEl: Element | null): Element[];
export declare const getHierarchy: (element: Element | null) => Hierarchy;
export declare function ensureListUnderLimit(list: Hierarchy | JSONValue[], bytesLimit: number): Hierarchy | JSONValue[];
/**
 * Converts a JSON-compatible value to a Python-compatible string representation.
 * This function handles various data types and ensures proper escaping and formatting.
 *
 * @param value - The value to be converted (can be any JSON-compatible type)
 * @param nested - Indicates if the value is nested within another structure (default: false)
 * @returns A string representation of the value compatible with Python, or null if conversion fails
 */
export declare function ensureUnicodePythonCompatible(value: HierarchyNode | JSONValue | null, nested?: boolean): string | null;
//# sourceMappingURL=hierarchy.d.ts.map