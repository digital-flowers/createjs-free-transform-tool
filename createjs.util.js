createjs = createjs || {};

createjs.util = createjs.util || {};
// Populate the class2type map

createjs.util.class2type = {};

// See test/unit/core.js for details concerning isFunction.
// Since version 1.3, DOM methods and functions like alert
// aren't supported. They return false on IE (#2968).
createjs.util.isFunction = function(obj) {
    return this.type(obj) === "function";
};

createjs.util.isArray = Array.isArray;

createjs.util.isWindow = function(obj) {
    return obj !== null && obj === obj.window;
};

createjs.util.isNumeric = function(obj) {
    return !isNaN(parseFloat(obj)) && isFinite(obj);
};

createjs.util.type = function(obj) {
    if (obj === null) {
        return String(obj);
    }
    // Support: Safari <= 5.1 (functionish RegExp)
    return typeof obj === "object" || typeof obj === "function" ? createjs.util.class2type[createjs.util.core_toString.call(obj)] || "object" : typeof obj;
};

createjs.util.isPlainObject = function(obj) {
    // Not plain objects:
    // - Any object or value whose internal [[Class]] property is not "[object Object]"
    // - DOM nodes
    // - window
    if (createjs.util.type(obj) !== "object" || obj.nodeType || createjs.util.isWindow(obj)) {
        return false;
    }

    // Support: Firefox <20
    // The try/catch suppresses exceptions thrown when attempting to access
    // the "constructor" property of certain host objects, ie. |window.location|
    // https://bugzilla.mozilla.org/show_bug.cgi?id=814622
    try {
        if (obj.constructor &&
                !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
            return false;
        }
    } catch (e) {
        return false;
    }

    // If the function hasn't returned already, we're confident that
    // |obj| is a plain object, created by {} or constructed with new Object
    return true;
};

createjs.util.isEmptyObject = function(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
};

createjs.util.drawGrid = function(graphics, width, height, x, y, lineWidth, lineColor) {
    graphics.setStrokeStyle(lineWidth)
            .beginStroke(lineColor);
    // vertical lines 
    var cellWidth = width / x;
    for (var i = 0; i <= x; i++) {
        graphics.moveTo(i * cellWidth, 0)
                .lineTo(i * cellWidth, height);
    }
    // horzntal lines 
    var cellHeight = height / y;
    for (var i = 0; i <= y; i++) {
        graphics.moveTo(0, i * cellHeight)
                .lineTo(width, i * cellHeight);
    }
    graphics.endStroke();
};

createjs.util.drawCross = function(graphics, width, height, lineColor) {
    graphics.setStrokeStyle(2)
            .beginStroke(lineColor)
            .moveTo(0, height / 2)
            .lineTo(width, height / 2)
            .moveTo(width / 2, 0)
            .lineTo(width / 2, height);
};

createjs.util.rotatePoint = function(point, center, angle) {
    var angleInRadians = angle * (Math.PI / 180);
    var cosTheta = Math.cos(angleInRadians);
    var sinTheta = Math.sin(angleInRadians);
    return {x: (cosTheta * (point.x - center.x) - sinTheta * (point.y - center.y) + center.x), y: (sinTheta * (point.x - center.x) + cosTheta * (point.y - center.y) + center.y)};
};

createjs.util.addEvent = function(html_element, event_name, event_function) {
    if (html_element.addEventListener) { // Modern
        html_element.addEventListener(event_name, event_function, false);
    } else if (html_element.attachEvent) { // Internet Explorer
        html_element.attachEvent("on" + event_name, event_function);
    } else { // others
        html_element["on" + event_name] = event_function;
    }
};

createjs.Graphics.prototype.dashedLineTo = function(x1, y1, x2, y2, dashLen) {
    this.moveTo(x1, y1);

    var dX = x2 - x1;
    var dY = y2 - y1;
    var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
    var dashX = dX / dashes;
    var dashY = dY / dashes;

    var q = 0;
    while (q++ < dashes) {
        x1 += dashX;
        y1 += dashY;
        this[q % 2 === 0 ? 'moveTo' : 'lineTo'](x1, y1);
    }
    this[q % 2 === 0 ? 'moveTo' : 'lineTo'](x2, y2);
    return this;
};
createjs.Graphics.prototype.drawDashedRect = function(x1, y1, w, h, dashLen) {
    this.moveTo(x1, y1);
    var x2 = x1 + w;
    var y2 = y1 + h;
    this.dashedLineTo(x1, y1, x2, y1, dashLen);
    this.dashedLineTo(x2, y1, x2, y2, dashLen);
    this.dashedLineTo(x2, y2, x1, y2, dashLen);
    this.dashedLineTo(x1, x2, x1, y1, dashLen);
    return this;
};
createjs.util.extend = function() {
    var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

    // Handle a deep copy situation
    if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && !createjs.util.isFunction(target)) {
        target = {};
    }

    // extend createjs.util itself if only one argument is passed
    if (length === i) {
        target = this;
        --i;
    }

    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[ i ]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[ name ];
                copy = options[ name ];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if (deep && copy && (createjs.util.isPlainObject(copy) || (copyIsArray = createjs.util.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && createjs.util.isArray(src) ? src : [];

                    } else {
                        clone = src && createjs.util.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[ name ] = createjs.util.extend(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[ name ] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};
createjs.util.isArraylike = function(obj) {
    var length = obj.length,
            type = jQuery.type(obj);

    if (createjs.util.isWindow(obj)) {
        return false;
    }

    if (obj.nodeType === 1 && length) {
        return true;
    }

    return type === "array" || type !== "function" &&
            (length === 0 ||
                    typeof length === "number" && length > 0 && (length - 1) in obj);
};
// args is for internal usage only
createjs.util.each = function(obj, callback, args) {
    var value, i = 0, length = obj.length, isArray = createjs.util.isArraylike(obj);

    if (args) {
        if (isArray) {
            for (; i < length; i++) {
                value = callback.apply(obj[ i ], args);

                if (value === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                value = callback.apply(obj[ i ], args);

                if (value === false) {
                    break;
                }
            }
        }

        // A special, fast, case for the most common use of each
    } else {
        if (isArray) {
            for (; i < length; i++) {
                value = callback.call(obj[ i ], i, obj[ i ]);

                if (value === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                value = callback.call(obj[ i ], i, obj[ i ]);

                if (value === false) {
                    break;
                }
            }
        }
    }

    return obj;
};

createjs.util.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    createjs.util.class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

createjs.util.clone = function(object, recursive, extend) {
    extend = extend || {};
    var o = createjs.util.extend(true, extend, object);
    o.children = o.children || [];
    if (o.graphics) {
        o.graphics = createjs.util.clone(o.graphics, true);
    }
    if (recursive) {
        for (var i = 0; i < o.children.length; i++) {
            o.children[i] = createjs.util.clone(o.children[i], recursive);
            o.children[i].parent = o;
        }
    }
    return o;
};
createjs.util.core_toString = createjs.util.class2type.toString;

createjs.util.getRelativeConcatenatedMatrix = function(o, parent, matrix) {
    if (matrix) {
        matrix.identity();
    } else {
        matrix = new createjs.Matrix2D();
    }
    do {
        matrix.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY).prependProperties(o.alpha, o.shadow, o.compositeOperation);
        o = o.parent;
    } while (o != parent);
    return matrix;
};

createjs.util.hexToRgb = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return {
        red: parseInt(result[1], 16),
        green: parseInt(result[2], 16),
        blue: parseInt(result[3], 16),
        alpha: 1
    };
};

createjs.util.parseColor = function(colorString) {
    if (colorString.indexOf("#") >= 0) {
        return createjs.util.hexToRgb(colorString);
    }
    var colorsOnly = colorString.substring(colorString.indexOf('(') + 1, colorString.lastIndexOf(')')).split(/,\s*/);
    return {
        red: Number(colorsOnly[0]),
        green: Number(colorsOnly[1]),
        blue: Number(colorsOnly[2]),
        alpha: Number(colorsOnly[3] || "1")
    };
};

createjs.util.toLetters = function(num) {
    "use strict";
    var mod = num % 26;
    var pow = num / 26 | 0;
    var out = mod ? String.fromCharCode(64 + mod) : (pow--, 'Z');
    return pow ? createjs.util.toLetters(pow) + out : out;
};

createjs.util.fromLetters = function(str) {
    "use strict";
    var out = 0, len = str.length, pos = len;
    while ((pos -= 1) > -1) {
        out += (str.charCodeAt(pos) - 64) * Math.pow(26, len - 1 - pos);
    }
    return out;
};