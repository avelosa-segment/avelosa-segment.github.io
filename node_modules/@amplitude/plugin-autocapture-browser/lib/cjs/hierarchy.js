"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureUnicodePythonCompatible = exports.ensureListUnderLimit = exports.getHierarchy = exports.getAncestors = exports.getElementProperties = void 0;
var tslib_1 = require("tslib");
var helpers_1 = require("./helpers");
var BLOCKED_ATTRIBUTES = [
    // Already captured elsewhere in the hierarchy object
    'id',
    'class',
    // non-useful and potentially large attribute
    'style',
    // sensitive as prefilled form data may populate this attribute
    'value',
    // DOM events
    'onclick',
    'onchange',
    'oninput',
    'onblur',
    'onsubmit',
    'onfocus',
    'onkeydown',
    'onkeyup',
    'onkeypress',
    // React specific
    'data-reactid',
    'data-react-checksum',
    'data-reactroot',
];
var SENSITIVE_ELEMENT_ATTRIBUTE_ALLOWLIST = ['type'];
var SVG_TAGS = ['svg', 'path', 'g'];
var HIGHLY_SENSITIVE_INPUT_TYPES = ['password', 'hidden'];
var MAX_ATTRIBUTE_LENGTH = 128;
var MAX_HIERARCHY_LENGTH = 1024;
function getElementProperties(element) {
    var e_1, _a;
    var _b, _c, _d, _e;
    if (element === null) {
        return null;
    }
    var tagName = String(element.tagName).toLowerCase();
    var properties = {
        tag: tagName,
    };
    var siblings = Array.from((_c = (_b = element.parentElement) === null || _b === void 0 ? void 0 : _b.children) !== null && _c !== void 0 ? _c : []);
    if (siblings.length) {
        properties.index = siblings.indexOf(element);
        properties.indexOfType = siblings.filter(function (el) { return el.tagName === element.tagName; }).indexOf(element);
    }
    var prevSiblingTag = (_e = (_d = element.previousElementSibling) === null || _d === void 0 ? void 0 : _d.tagName) === null || _e === void 0 ? void 0 : _e.toLowerCase();
    if (prevSiblingTag) {
        properties.prevSib = String(prevSiblingTag);
    }
    var id = element.getAttribute('id');
    if (id) {
        properties.id = String(id);
    }
    var classes = Array.from(element.classList);
    if (classes.length) {
        properties.classes = classes;
    }
    var attributes = {};
    var attributesArray = Array.from(element.attributes);
    var filteredAttributes = attributesArray.filter(function (attr) { return !BLOCKED_ATTRIBUTES.includes(attr.name); });
    var isSensitiveElement = !(0, helpers_1.isNonSensitiveElement)(element);
    // if input is hidden or password or for SVGs, skip attribute collection entirely
    if (!HIGHLY_SENSITIVE_INPUT_TYPES.includes(String(element.getAttribute('type'))) && !SVG_TAGS.includes(tagName)) {
        try {
            for (var filteredAttributes_1 = tslib_1.__values(filteredAttributes), filteredAttributes_1_1 = filteredAttributes_1.next(); !filteredAttributes_1_1.done; filteredAttributes_1_1 = filteredAttributes_1.next()) {
                var attr = filteredAttributes_1_1.value;
                // If sensitive element, only allow certain attributes
                if (isSensitiveElement && !SENSITIVE_ELEMENT_ATTRIBUTE_ALLOWLIST.includes(attr.name)) {
                    continue;
                }
                // Finally cast attribute value to string and limit attribute value length
                attributes[attr.name] = String(attr.value).substring(0, MAX_ATTRIBUTE_LENGTH);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (filteredAttributes_1_1 && !filteredAttributes_1_1.done && (_a = filteredAttributes_1.return)) _a.call(filteredAttributes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    if (Object.keys(attributes).length) {
        properties.attrs = attributes;
    }
    return properties;
}
exports.getElementProperties = getElementProperties;
function getAncestors(targetEl) {
    var ancestors = [];
    if (!targetEl) {
        return ancestors;
    }
    // Add self to the list of ancestors
    ancestors.push(targetEl);
    var current = targetEl.parentElement;
    while (current && current.tagName !== 'HTML') {
        ancestors.push(current);
        current = current.parentElement;
    }
    return ancestors;
}
exports.getAncestors = getAncestors;
// Get the DOM hierarchy of the element, starting from the target element to the root element.
var getHierarchy = function (element) {
    var hierarchy = [];
    if (!element) {
        return [];
    }
    // Get list of ancestors including itself and get properties at each level in the hierarchy
    var ancestors = getAncestors(element);
    hierarchy = ensureListUnderLimit(ancestors.map(function (el) { return getElementProperties(el); }), MAX_HIERARCHY_LENGTH);
    return hierarchy;
};
exports.getHierarchy = getHierarchy;
function ensureListUnderLimit(list, bytesLimit) {
    var numChars = 0;
    for (var i = 0; i < list.length; i++) {
        var node = list[i];
        if (node === null) {
            // simulate 'None' in python
            numChars += 4;
        }
        else {
            var value = ensureUnicodePythonCompatible(node);
            // Using Array.from(string).length instead of string.length
            // to correctly count Unicode characters (including emojis)
            numChars += value ? Array.from(value).length : 4;
        }
        if (numChars > bytesLimit) {
            return list.slice(0, i);
        }
    }
    return list;
}
exports.ensureListUnderLimit = ensureListUnderLimit;
/**
 * Converts a JSON-compatible value to a Python-compatible string representation.
 * This function handles various data types and ensures proper escaping and formatting.
 *
 * @param value - The value to be converted (can be any JSON-compatible type)
 * @param nested - Indicates if the value is nested within another structure (default: false)
 * @returns A string representation of the value compatible with Python, or null if conversion fails
 */
function ensureUnicodePythonCompatible(value, nested) {
    if (nested === void 0) { nested = false; }
    try {
        if (value == null) {
            // Handle null values
            if (nested) {
                return 'None'; // Represent null as 'None' in Python when nested
            }
            return null; // Return null for top-level null values
        }
        else if (typeof value === 'string') {
            if (nested) {
                // Escape special characters in nested strings
                value = value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r');
                // Handle quotes in the string
                if (value.includes('"')) {
                    return "'".concat(value, "'"); // Wrap in single quotes if it contains double quotes
                }
                if (value.includes("'")) {
                    return "\"".concat(value.replace(/'/g, "\\'"), "\""); // Wrap in double quotes and escape single quotes
                }
                return "'".concat(value, "'"); // Default to wrapping in single quotes
            }
            return value; // Return non-nested strings as-is
        }
        else if (typeof value === 'boolean') {
            // Convert boolean to Python-style capitalized string
            return value ? 'True' : 'False';
        }
        else if (Array.isArray(value)) {
            // Handle arrays by recursively converting each element
            var elements = value.map(function (o) { return ensureUnicodePythonCompatible(o, true); });
            return "[".concat(elements.join(', '), "]");
        }
        else if (typeof value === 'object') {
            // Handle objects (dictionaries in Python)
            var entries = Object.entries(value)
                .filter(function (_a) {
                var _b = tslib_1.__read(_a, 1), key = _b[0];
                return key != null;
            }) // Filter out null keys
                .map(function (_a) {
                var _b = tslib_1.__read(_a, 2), key = _b[0], val = _b[1];
                return "".concat(String(ensureUnicodePythonCompatible(key, true)), ": ").concat(String(ensureUnicodePythonCompatible(val, true)));
            });
            var result = "{".concat(entries.join(', '), "}");
            // Handle single quotes in the resulting string
            if (result.includes("\\'")) {
                result = result.replace(/'/g, "'").replace(/'/g, "\\'");
            }
            return result;
        }
        // For any other types, return their string representation;
        return value.toString();
    }
    catch (e) {
        // Return null if any error occurs during the conversion
        return null;
    }
}
exports.ensureUnicodePythonCompatible = ensureUnicodePythonCompatible;
//# sourceMappingURL=hierarchy.js.map