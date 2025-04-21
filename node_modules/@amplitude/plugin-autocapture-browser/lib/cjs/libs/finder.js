"use strict";
/* istanbul ignore file */
Object.defineProperty(exports, "__esModule", { value: true });
exports.finder = void 0;
var tslib_1 = require("tslib");
var config;
var rootDocument;
function finder(input, options) {
    if (input.nodeType !== Node.ELEMENT_NODE) {
        throw new Error("Can't generate CSS selector for non-element node type.");
    }
    if ('html' === input.tagName.toLowerCase()) {
        return 'html';
    }
    var defaults = {
        root: document.body,
        idName: function (_name) { return true; },
        className: function (_name) { return true; },
        tagName: function (_name) { return true; },
        attr: function (_name, _value) { return false; },
        seedMinLength: 1,
        optimizedMinLength: 2,
        threshold: 1000,
        maxNumberOfTries: 10000,
    };
    config = tslib_1.__assign(tslib_1.__assign({}, defaults), options);
    rootDocument = findRootDocument(config.root, defaults);
    var path = bottomUpSearch(input, 'all', function () {
        return bottomUpSearch(input, 'two', function () { return bottomUpSearch(input, 'one', function () { return bottomUpSearch(input, 'none'); }); });
    });
    if (path) {
        var optimized = sort(optimize(path, input));
        if (optimized.length > 0) {
            path = optimized[0];
        }
        return selector(path);
    }
    else {
        throw new Error("Selector was not found.");
    }
}
exports.finder = finder;
function findRootDocument(rootNode, defaults) {
    if (rootNode.nodeType === Node.DOCUMENT_NODE) {
        return rootNode;
    }
    if (rootNode === defaults.root) {
        return rootNode.ownerDocument;
    }
    return rootNode;
}
function bottomUpSearch(input, limit, fallback) {
    var path = null;
    var stack = [];
    var current = input;
    var i = 0;
    var _loop_1 = function () {
        var e_1, _a;
        var level = maybe(id(current)) || maybe.apply(void 0, tslib_1.__spreadArray([], tslib_1.__read(attr(current)), false)) || maybe.apply(void 0, tslib_1.__spreadArray([], tslib_1.__read(classNames(current)), false)) ||
            maybe(tagName(current)) || [any()];
        var nth = index(current);
        if (limit == 'all') {
            if (nth) {
                level = level.concat(level.filter(dispensableNth).map(function (node) { return nthChild(node, nth); }));
            }
        }
        else if (limit == 'two') {
            level = level.slice(0, 1);
            if (nth) {
                level = level.concat(level.filter(dispensableNth).map(function (node) { return nthChild(node, nth); }));
            }
        }
        else if (limit == 'one') {
            var _b = tslib_1.__read((level = level.slice(0, 1)), 1), node = _b[0];
            if (nth && dispensableNth(node)) {
                level = [nthChild(node, nth)];
            }
        }
        else if (limit == 'none') {
            level = [any()];
            if (nth) {
                level = [nthChild(level[0], nth)];
            }
        }
        try {
            for (var level_1 = (e_1 = void 0, tslib_1.__values(level)), level_1_1 = level_1.next(); !level_1_1.done; level_1_1 = level_1.next()) {
                var node = level_1_1.value;
                node.level = i;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (level_1_1 && !level_1_1.done && (_a = level_1.return)) _a.call(level_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        stack.push(level);
        if (stack.length >= config.seedMinLength) {
            path = findUniquePath(stack, fallback);
            if (path) {
                return "break";
            }
        }
        current = current.parentElement;
        i++;
    };
    while (current) {
        var state_1 = _loop_1();
        if (state_1 === "break")
            break;
    }
    if (!path) {
        path = findUniquePath(stack, fallback);
    }
    if (!path && fallback) {
        return fallback();
    }
    return path;
}
function findUniquePath(stack, fallback) {
    var e_2, _a;
    // Check first the total number of combinations first since generating the combinations can cause memory exhaustion
    var numCombinations = stack.reduce(function (acc, i) { return acc * i.length; }, 1);
    if (numCombinations > config.threshold) {
        return fallback ? fallback() : null;
    }
    var paths = sort(combinations(stack));
    try {
        for (var paths_1 = tslib_1.__values(paths), paths_1_1 = paths_1.next(); !paths_1_1.done; paths_1_1 = paths_1.next()) {
            var candidate = paths_1_1.value;
            if (unique(candidate)) {
                return candidate;
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (paths_1_1 && !paths_1_1.done && (_a = paths_1.return)) _a.call(paths_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return null;
}
function selector(path) {
    var node = path[0];
    var query = node.name;
    for (var i = 1; i < path.length; i++) {
        var level = path[i].level || 0;
        if (node.level === level - 1) {
            query = "".concat(path[i].name, " > ").concat(query);
        }
        else {
            query = "".concat(path[i].name, " ").concat(query);
        }
        node = path[i];
    }
    return query;
}
function penalty(path) {
    return path.map(function (node) { return node.penalty; }).reduce(function (acc, i) { return acc + i; }, 0);
}
function unique(path) {
    var css = selector(path);
    switch (rootDocument.querySelectorAll(css).length) {
        case 0:
            throw new Error("Can't select any node with this selector: ".concat(css));
        case 1:
            return true;
        default:
            return false;
    }
}
function id(input) {
    var elementId = input.getAttribute('id');
    if (elementId && config.idName(elementId)) {
        return {
            name: '#' + CSS.escape(elementId),
            penalty: 0,
        };
    }
    return null;
}
function attr(input) {
    var attrs = Array.from(input.attributes).filter(function (attr) { return config.attr(attr.name, attr.value); });
    return attrs.map(function (attr) { return ({
        name: "[".concat(CSS.escape(attr.name), "=\"").concat(CSS.escape(attr.value), "\"]"),
        penalty: 0.5,
    }); });
}
function classNames(input) {
    var names = Array.from(input.classList).filter(config.className);
    return names.map(function (name) { return ({
        name: '.' + CSS.escape(name),
        penalty: 1,
    }); });
}
function tagName(input) {
    var name = input.tagName.toLowerCase();
    if (config.tagName(name)) {
        return {
            name: name,
            penalty: 2,
        };
    }
    return null;
}
function any() {
    return {
        name: '*',
        penalty: 3,
    };
}
function index(input) {
    var parent = input.parentNode;
    if (!parent) {
        return null;
    }
    var child = parent.firstChild;
    if (!child) {
        return null;
    }
    var i = 0;
    while (child) {
        if (child.nodeType === Node.ELEMENT_NODE) {
            i++;
        }
        if (child === input) {
            break;
        }
        child = child.nextSibling;
    }
    return i;
}
function nthChild(node, i) {
    return {
        name: node.name + ":nth-child(".concat(i, ")"),
        penalty: node.penalty + 1,
    };
}
function dispensableNth(node) {
    return node.name !== 'html' && !node.name.startsWith('#');
}
function maybe() {
    var level = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        level[_i] = arguments[_i];
    }
    var list = level.filter(notEmpty);
    if (list.length > 0) {
        return list;
    }
    return null;
}
function notEmpty(value) {
    return value !== null && value !== undefined;
}
function combinations(stack, path) {
    var _a, _b, node, e_3_1;
    var e_3, _c;
    if (path === void 0) { path = []; }
    return tslib_1.__generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!(stack.length > 0)) return [3 /*break*/, 9];
                _d.label = 1;
            case 1:
                _d.trys.push([1, 6, 7, 8]);
                _a = tslib_1.__values(stack[0]), _b = _a.next();
                _d.label = 2;
            case 2:
                if (!!_b.done) return [3 /*break*/, 5];
                node = _b.value;
                return [5 /*yield**/, tslib_1.__values(combinations(stack.slice(1, stack.length), path.concat(node)))];
            case 3:
                _d.sent();
                _d.label = 4;
            case 4:
                _b = _a.next();
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 8];
            case 6:
                e_3_1 = _d.sent();
                e_3 = { error: e_3_1 };
                return [3 /*break*/, 8];
            case 7:
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_3) throw e_3.error; }
                return [7 /*endfinally*/];
            case 8: return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, path];
            case 10:
                _d.sent();
                _d.label = 11;
            case 11: return [2 /*return*/];
        }
    });
}
function sort(paths) {
    return tslib_1.__spreadArray([], tslib_1.__read(paths), false).sort(function (a, b) { return penalty(a) - penalty(b); });
}
function optimize(path, input, scope) {
    var i, newPath, newPathKey;
    if (scope === void 0) { scope = {
        counter: 0,
        visited: new Map(),
    }; }
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(path.length > 2 && path.length > config.optimizedMinLength)) return [3 /*break*/, 5];
                i = 1;
                _a.label = 1;
            case 1:
                if (!(i < path.length - 1)) return [3 /*break*/, 5];
                if (scope.counter > config.maxNumberOfTries) {
                    return [2 /*return*/]; // Okay At least I tried!
                }
                scope.counter += 1;
                newPath = tslib_1.__spreadArray([], tslib_1.__read(path), false);
                newPath.splice(i, 1);
                newPathKey = selector(newPath);
                if (scope.visited.has(newPathKey)) {
                    return [2 /*return*/];
                }
                if (!(unique(newPath) && same(newPath, input))) return [3 /*break*/, 4];
                return [4 /*yield*/, newPath];
            case 2:
                _a.sent();
                scope.visited.set(newPathKey, true);
                return [5 /*yield**/, tslib_1.__values(optimize(newPath, input, scope))];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/];
        }
    });
}
function same(path, input) {
    return rootDocument.querySelector(selector(path)) === input;
}
//# sourceMappingURL=finder.js.map