/*
* TODO: add slideDown function
* TODO: add slideUp function
* TODO: add fadeIn function
* TODO: add fadeOut function
* TODO: add toggleFade function
* TODO: add easingFunc
* */

/**
 * Check type helpers
 * @example
 * type.isString('val') will return => true
 *
 * @param {obj} any variable to check
 */
export const type = {};
['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'].forEach((name) => {
    type[`is${name}`] = obj => Object.prototype.toString.call(obj) === `[object ${name}]`;
});

// Better switch cases - https://hackernoon.com/rethinking-javascript-eliminate-the-switch-statement-for-better-code-5c81c044716d
/*
* TODO: add documentation
* */
export const executeIfFunction = (f) => {
    return type.isFunction(f) ? f() : f;
};

/*
* TODO: add documentation
* */
export const switchcase = cases => defaultCase => (key) => {
    return Object.prototype.hasOwnProperty.call(cases, key) ? cases[key] : defaultCase;
};

/*
* TODO: add documentation
* */
export const switchcaseF = cases => defaultCase => (key) => {
    return executeIfFunction(switchcase(cases)(defaultCase)(key));
};

/**
 * Checks for expected params (whether they exists and they're right type) before starting main process
 *
 * @example
 * checkExpectedParams({
 *     string: [var1, var2],
 *     array: [var3, var4],
 *     number: [var5],
 *     function: [var6],
 *     boolean: [var7],
 * });
 *
 * @param {Object} params, object with in such order: params type => array of params with this type.
 */
export const checkExpectedParams = (params) => {
    const types = el => switchcase({
        string: typeof el === 'string',
        number: typeof el === 'number',
        boolean: typeof el === 'boolean',
        function: typeof el === 'function',
        element: el instanceof Element,
        node: el.nodeType,
        array: Array.isArray(el),
        object: el instanceof Object && !(el instanceof Array),
    })(false);

    Object.keys(params)
        .forEach((key) => {
            if (!types(params[key])('array')) {
                throw new Error(`checkExpectedParams: You should pass values as an Array! Get: ${params[key]}`);
            }
            params[key].forEach((param) => {
                if (param === undefined || param === null) {
                    throw new Error('checkExpectedParams: Parameter is undefined!');
                }

                if (!types(param)(key)) {
                    console.log('Element with wrong type: ', param);
                    window.errorExpected = param;
                    throw new Error(`checkExpectedParams: Parameter has wrong type. See above or check 'window.errorExpected'.
                    (Expecting '${key}' type for '${Object.prototype.toString.call(param)}')!`);
                }
            });
        });
};

/**
 * Call passed functions whether condition result
 *
 * @param cond {Boolean}     Condition to check
 * @param f1 {Function}      First function to call if condition is true
 * @param f2 {Function|Null} Optional,second function to call if condition is false
 * @returns {*}              Result of executed function
 */
export const callIfTrue = (cond, f1, f2 = null) => {
    checkExpectedParams({
        boolean: [cond],
        function: [f1],
    });
    return cond ? f1() : executeIfFunction(f2);
};

/**
 * Flatten array using spread operator.
 * @example
 * flatten(['aa', 'ab', ['ac', 'ad']]) will return => ['aa', 'ab', 'ac', 'ad']
 *
 * @param {array} arr array to flatten
 */
export const flatten = arr => [].concat(...arr || []);

/**
 * Add class/classes to element.
 * @example
 * addClass(elem, 'your-class')
 * addClass(elem, ['your-class1', 'your-class2', 'your-class3'])
 *
 * @param {Element} el DOM HTML Element
 * @param {String||Array} classNames class or list of classes to add
 */
export const addClass = (el, classNames) => {
    checkExpectedParams({
        element: [el],
    });

    [].concat(classNames)
        .forEach((className) => {
            if (el.classList) {
                el.classList.add(className); // IE 10+
            } else {
                el.className += ` ${className}`; // IE 8+
            }
        });
};

/**
 * Remove element class/classes.
 *
 * @example
 * removeClass(elem, 'your-class')
 * removeClass(elem, ['your-class1', 'your-class2', 'your-class3'])
 *
 * @param {Element} el DOM HTML Element
 * @param {String||Array} classNames class or list of classes to remove
 */
export const removeClass = (el, classNames) => {
    checkExpectedParams({
        element: [el],
    });

    [].concat(classNames)
        .forEach((className) => {
            if (el.classList) {
                el.classList.remove(className); // IE 10+
            } else {
                el.className = el.className.replace(new RegExp(`(^|\\b)${className.split(' ')
                    .join('|')}(\\b|$)`, 'gi'), ' '); // IE 8+
            }
        });
};

/**
 * Checks if element has className.
 *
 * @example
 * hasClass(elem, 'your-class')
 *
 * @param {Element} el DOM HTML Element
 * @param {String} className class to check
 * @returns {Boolean} `true` or `false`
 */
export const hasClass = (el, className) => {
    checkExpectedParams({
        element: [el],
        string: [className],
    });

    if (el.classList) {
        return el.classList.contains(className); // IE 10+
    }

    // If anchor within a svg element in IE; https://caniuse.com/#search=classList
    const classProp = Object.prototype.toString.call(el) === '[object SVGAElement]' ? el.className.baseVal : el.className;

    return new RegExp(`(^| )${className}( |$)`, 'gi').test(classProp); // IE 8+ ?
};

/**
 * Switch element className.
 *
 * @example
 * toggleClass(elem, 'your-class')
 *
 * @param {Element} el DOM HTML Element
 * @param {String} className class to check
 * @returns {bool} `true` or `false`
 */
export const toggleClass = (el, className) => {
    checkExpectedParams({
        element: [el],
        string: [className],
    });

    if (hasClass(el, className)) {
        removeClass(el, className);
    } else {
        addClass(el, className);
    }
};

/**
 * Manage body overflow styles.
 *
 * @example
 * manageBodyOverflow('hidden')
 * manageBodyOverflow('visible')
 *
 * @param {String} state by default `value = null`, set `hidden` if you want to add overflow
 * @param {String} wrapper by default `value = site-wrapper`,
 * all wrapper selector
 * set `hidden` if you want to add overflow
 */
export const manageBodyOverflow = (state = null, wrapper = 'site-wrapper') => {
    const wrap = document.querySelector(`.${wrapper}`);
    if (state === 'hidden') {
        addClass(document.body, '-overflow-hidden');
        addClass(wrap, '-overflow-hidden');
    } else {
        removeClass(document.body, '-overflow-hidden');
        removeClass(wrap, '-overflow-hidden');
    }
};

/**
 * Add attributes list.
 *
 * @example
 * setAttributes(elem, {
 *   'role': 'button',
 *   'checked': 'true'
 * })
 *
 * @param {Element} el DOM HTML Element
 * @param {Object} attrs attributes example `{'role':'button', 'aria-hidden': true}`
 */
export const setAttributes = (el, attrs) => {
    checkExpectedParams({
        element: [el],
        object: [attrs],
    });

    Object
        .keys(attrs)
        .forEach((attribute) => {
            el.setAttribute(attribute, attrs[attribute]);
        });
};

/**
 * Remove attributes list from node.
 *
 * @example
 * removeAttributes(elem, ['role', 'aria-hidden', 'aria-controls'])
 *
 * @param {Element} el DOM HTML Element
 * @param {Array} attrsArray attributes array `['role', 'aria-hidden']`
 */
export const removeAttributes = (el, attrsArray) => {
    checkExpectedParams({
        element: [el],
        array: [attrsArray],
    });

    attrsArray.forEach((attribute) => {
        el.removeAttribute(attribute);
    });
};

/**
 * Return height or width contains elem + padding + margin + border.
 *
 * @example
 * outerHeight(elem, )
 *
 * @param {Element} el DOM node
 * @param {String} dimensionType String
 * @returns {Number} height element outer height
 */
const outerDimensions = (el, dimensionType) => {
    checkExpectedParams({
        element: [el],
        string: [dimensionType],
    });

    let value = el[`offset${dimensionType}`];
    const style = getComputedStyle(el);
    const margins = switchcase({
        Height: ['marginTop', 'marginBottom'],
        Width: ['marginLeft', 'marginRight'],
    })('Height');
    const [m1, m2] = margins(dimensionType);

    value += parseInt(style[m1], 10) + parseInt(style[m2], 10);
    return value;
};

/**
 * Return height contains elem + padding + margin + border.
 *
 * @example
 * outerHeight(elem)
 *
 * @param {Element} el DOM node
 * @returns {Number} height element outer height
 */
export const outerHeight = el => outerDimensions(el, 'Height');

/**
 * Return width contains elem + padding + margin + border.
 *
 * @example
 * outerWidth(elem)
 *
 * @param {Element} el DOM node
 * @returns {Number} width element outer width
 */
export const outerWidth = el => outerDimensions(el, 'Width');

/**
 * Get the next, previous or all siblings of an element
 * or retrieve siblings that match a given selector.
 * https://plainjs.com/javascript/traversing/get-siblings-of-an-element-40/
 *
 * @param  {Node} el DOM HTML Element
 * @param {Function} filter
 * @returns {Array} siblings array
 */
export const getSiblings = (el, filter) => {
    checkExpectedParams({
        node: [el],
        function: filter,
    });

    const siblings = [];
    let elem = el.parentElement.firstElementChild;
    do {
        if (!filter || filter(elem)) {
            siblings.push(elem);
        }
    } while ((elem = elem.nextElementSibling) !== null);
    return siblings;
};

/**
 * Find ancestor by className, works like parents() method in jQuery.
 * http://jsfiddle.net/8RfbT/69/
 *
 * @param {Element} el DOM HTML Element
 * @param {String} cls parent class
 * @returns {Node} parent node
 */
export const findAncestor = (el, cls) => {
    checkExpectedParams({
        element: [el],
        string: [cls],
    });

    let elem = el;
    while (!hasClass(elem, cls)) {
        if (elem === document.body) {
            elem = null;
            break;
        }
        elem = elem.parentNode;
    }

    return elem;
};

/**
 * Find ancestor by tagName
 *
 * @param {Element} el DOM HTML Element
 * @param {String} tagName
 * @returns {Node} parent node
 */
export const findAncestorByTag = (el, tagName) => {
    checkExpectedParams({
        element: [el],
        string: [tagName],
    });

    let elem = el;
    while (elem.tagName.toUpperCase() !== tagName.toUpperCase() && (elem = elem.parentNode)) ;
    return elem;
};

/**
 * Check the current matched element against a selector,
 * return true if element matches the given arguments.
 *
 * @example
 * matches(elem, '.my-class')
 *
 * @param {Element} el DOM HTML Element
 * @param {String} selector match class
 * @returns {bool} true or false
 */
export const matches = (el, selector) => {
    (el.matches
        || el.matchesSelector
        || el.msMatchesSelector
        || el.mozMatchesSelector
        || el.webkitMatchesSelector
        || el.oMatchesSelector)
        .call(el, selector);
};

/**
 * Get first focusable element inside node.
 *
 * @example
 * getFirstFocusableElement(elem)
 *
 * @param {Element|String} el parent selector to search focusable elements
 * @returns {Node} DOM Node
 */
export const getFirstFocusableElement = (el) => {
    const elem = type.isString(el) ? document.querySelector(el) : el;
    return elem.querySelector('a, input, select, button');
};

/**
 * Get last focusable element inside node.
 *
 * @example
 * getLastFocusableElement(elem)
 *
 * @param {Element|String} el parent selector to search focusable elements
 * @returns {Node} DOM Node
 */
export const getLastFocusableElement = (el) => {
    const elem = type.isString(el) ? document.querySelector(el) : el;
    const elemItems = elem.querySelectorAll('a, input, select, button');
    return elemItems[elemItems.length - 1];
};

/**
 * Generate unique ID.
 *
 * @example
 * getUniqId()
 *
 * @returns {Number} unique number
 */
export const getUniqId = () => Math.random()
    .toString(36)
    .substr(2, 16);

/**
 * Set tabindex to all focusable elements.
 *
 * @example
 * setTabindex(elem, 1)
 * setTabindex(elem, 0)
 *
 * @param {Element} el DOM HTML Element
 * @param {Number|String} index tabindex number
 */
export const setTabindex = (el, index) => {
    const elem = type.isString(el) ? document.querySelector(el) : el;
    const elemItems = elem.querySelectorAll('a, input, select, button');
    for (let i = 0; i < elemItems.length; i++) {
        elemItems[i].setAttribute('tabindex', parseInt(index, 10));
    }
};

/*
* TODO: add documentation
* */
export const toggleTabindex = (element) => {
    const state = element.getAttribute('tabindex') || 0;
    return element.setAttribute('tabindex', state < 0 ? 0 : -1);
};

/**
 * Add a11y aria attributes, dropdown pattern.
 *
 * @example
 * initAriaControls(elementToggle, elementTarget)
 * initAriaControls([elementToggle1, elementToggle2], elementTarget)
 * initAriaControls([elementToggle1, elementToggle2], '#target-selector')
 *
 * @param {(Node|Array)} toggles DOM Node or Nodes array -
 * Nodes or Node which will manipulate target element
 * @param {(Node|String)} target Dom Node or string - element which will be associated with toggles
 * @param {Array} exclude array of classes to exclude some attributes
 */
export const initAriaControls = (toggles, target, exclude = ['close', 'overlay', 'toggle']) => {
    const id = `relations-${getUniqId()}`;

    [].concat(toggles)
        .forEach((toggle) => {
            const attrs = {
                'aria-controls': id,
                'aria-expanded': false,
            };

            // Add 'aria-haspopup' if it's not a close btn or overlay
            const excluded = exclude.filter(word => toggle.className.indexOf(word) >= 0);
            if (!excluded.length) {
                attrs['aria-haspopup'] = true;
            }
            setAttributes(toggle, attrs);
        });

    const checkedTarget = type.isString(target) ? document.querySelector(target) : target;

    checkedTarget.id = id;
    checkedTarget.setAttribute('aria-hidden', true);
};

/**
 * Remove all Aria attributes inside element
 *
 * @example
 * removeAriaControls(elem)
 *
 * @param {Element} el DOM HTML Element
 */
export const removeAriaControls = (el) => {
    // Remove all aria controls from current element
    removeAttributes(el, ['aria-hidden', 'aria-expanded', 'aria-haspopup', 'aria-controls']);

    [].slice.call(el.querySelectorAll('*')).forEach((elem) => {
        // Remove all aria controls from each child
        removeAttributes(elem, ['aria-hidden', 'aria-expanded', 'aria-haspopup', 'aria-controls', 'id']);
    });
};

/**
 * Toggle attribute boolean state.
 *
 * @example
 * toggleAttribute(elem, 'aria-hidden')
 *
 * @param {Element} el DOM HTML Element
 * @param {String} attr attribute name
 */
export const toggleAttribute = (el, attr) => {
    checkExpectedParams({
        element: [el],
        string: [attr],
    });

    const value = el.getAttribute(attr) === 'true' ? 'false' : 'true';
    el.setAttribute(attr, value);
};

/**
 * Manage a11y aria attributes by state.
 * State value can be: `true`, `false`, `'opened'`, `'closed'`
 *
 * @example
 * setAriaControls(elemToggle, elemTarget, true)
 * setAriaControls(elemToggle, elemTarget, false)
 * setAriaControls(elemToggle, elemTarget, 'opened')
 * setAriaControls(elemToggle, elemTarget, 'closed')
 * setAriaControls([elemToggle1, elemToggle2], elemTarget, true)
 *
 * @param {(Element|Array)} toggles DOM Node or Nodes array -
 * Nodes or Node which will manipulate target element
 * @param {(Element|String)} target Dom Node or string - element which will be associated with toggles
 * @param {(String|boolean)} state set element state can be string or bool
 */
export const setAriaControls = (toggles, target, state) => {
    const ariaState = (state === 'opened' || state === true) ? 1 : 0;

    [].concat(toggles)
        .forEach((toggle) => {
            toggle.setAttribute('aria-expanded', (!!ariaState).toString());
        });

    target.setAttribute('aria-hidden', (!ariaState).toString());
};

/**
 * Toggle a11y aria controls, dropdown pattern
 *
 * @example
 * manageAriaControls(elemToggle, elemTarget)
 * manageAriaControls([elemToggle1, elemToggle2], elemTarget)
 *
 * @param {(Element|Array)} toggles DOM Node or Nodes array -
 * Nodes or Node which will manipulate target element
 * @param {Element} target Dom Node or string - element which will be associated with toggles
 */
export const manageAriaControls = (toggles, target) => {
    const targetAriaState = target.getAttribute('aria-hidden');
    [].concat(toggles)
        .forEach((toggle) => {
            setAriaControls(toggle, target, targetAriaState === 'true');
        });
};

/*
* TODO: add documentation
* */
export const getFocusableElements = (el, onlyTabbable = false) => {
    checkExpectedParams({
        element: [el],
        boolean: [onlyTabbable],
    });

    let focusableElementsString;
    if (onlyTabbable) {
        focusableElementsString = '[tabindex="0"]';
    } else {
        focusableElementsString = 'a[href],'
            + ' area[href],'
            + ' input:not([disabled]),'
            + ' select:not([disabled]),'
            + ' textarea:not([disabled]),'
            + ' button:not([disabled]),'
            + ' iframe,'
            + ' object,'
            + ' embed,'
            + ' [tabindex="0"],'
            + ' [contenteditable]';
    }

    return Array.prototype.slice.call(el.querySelectorAll(focusableElementsString));
};

/**
 * TODO: add documentation
 *
 * @param element
 * @param onlyTabbable
 */
export const getFocusableChildren = (element, onlyTabbable = false) => {
    return getFocusableElements(element, onlyTabbable)
        .filter(item => item.parentNode === element);
};

/*
* TODO: add documentation
* */
export const isFocusable = (node) => {
    const tags = ['a', 'button', 'select', 'input', 'textarea'];
    return tags.filter(tag => node.tagName.toLowerCase() === tag).length > 0;
};

/*
* TODO: add documentation
* */
export const setFirstElementFocus = (elements) => {
    const element = elements[0];
    element.focus();
};

/*
* TODO: add documentation
* */
export const setLastElementFocus = (elements) => {
    const element = elements[elements.length - 1];
    element.focus();
};

/*
* TODO: add documentation
* */
export const initFocusTrap = (element, event, onlyTabbable = false) => {
    const focusableElements = onlyTabbable ? getFocusableElements(element, true) : getFocusableElements(element);
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    // Listen for the Tab key
    if (event.keyCode === 9) {
        // If Shift + Tab
        if (event.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                event.preventDefault();
                // jump to the last focusable element
                lastFocusableElement.focus();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                event.preventDefault();
                // jump to the first focusable element
                firstFocusableElement.focus();
            }
        }
    }
};

/*
* TODO: add documentation
* */
export const generateHash = (str) => {
    let hash = 0;

    if (str.length === 0) {
        return hash;
    }

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash * 31) + char;
        hash |= 0;
    }

    return hash;
};

/**
 * Debounce execution of a function. Debouncing, unlike throttling,
 * guarantees that a function is only executed a single time, either at the
 * very beginning of a series of calls, or at the very end.
 *
 * @param  {Function} fn      A function to be executed after delay milliseconds. The `this` context and all arguments are
 *                             passed through, as-is, to `callback` when the debounced-function is executed.
 * @param  {Number}   delay   A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 *
 * @return {Function} A new, debounced function.
 */
export const debounce = (fn, delay) => {
    let timer = null;
    return () => {
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    };
};

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param {Function} fn         A function to be executed after delay milliseconds. The `this` context and all arguments are
 *                              passed through, as-is, to `callback` when the throttled-function is executed.
 * @param {Number}   threshold  A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param {Object}   scope      Optional, you can pass context for callback function.
 *
 * @return {Function} A new, throttled, function.
 */
export const throttle = (fn, threshold = 250, scope) => {
    let last;
    let deferTimer;
    return (...list) => {
        const context = scope || this;
        const now = +new Date();
        const args = list;
        if (last && now < last + threshold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(() => {
                last = now;
                fn.apply(context, args);
            }, threshold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
};

/*
* TODO: add documentation
* */
export const hasElement = (list, element) => {
    if (element !== null) {
        for (let i = 0; i < list.length; i++) {
            if (list[i] === element) {
                return list[i] === element;
            }
        }
    }
};

/**
 * Return array with given range
 *
 * @example
 * range(1, 20, true)
 *
 * @param {Number} left, start of the array
 * @param {String} right, end fo the array
 * @param {Boolean} inclusive, whether returned array should be inclusive or not
 * @returns {Array} generated array
 */
export const range = (left, right, inclusive = true) => {
    const arr = [];
    const asc = left < right;
    const ascEnd = asc ? right + 1 : right - 1;

    const end = !inclusive ? right : ascEnd;

    for (let i = left; asc ? i < end : i > end; asc ? i += 1 : i -= 1) {
        arr.push(i);
    }
    return arr;
};

/*
* TODO: add documentation
* */
export const extendDefaults = (...objects) => {
    const isObject = obj => obj && typeof obj === 'object';

    return objects.reduce((prev, obj) => {
        Object.keys(obj)
            .forEach((key) => {
                const previousValue = prev[key];
                const objectValue = obj[key];

                if (Array.isArray(previousValue) && Array.isArray(objectValue)) {
                    prev[key] = previousValue.concat(...objectValue);
                } else if (isObject(previousValue) && isObject(objectValue)) {
                    prev[key] = extendDefaults(previousValue, objectValue);
                } else {
                    prev[key] = objectValue;
                }
            });

        return prev;
    }, {});
};

/**
 * Inserting Node element after given element.
 *
 * @param {Node} newNode, new Node element to be inserted after refNode.
 * @param {Node} refNode, reference Node element for inserting.
 */
export const insertAfter = (newNode, refNode) => {
    checkExpectedParams({
        node: [newNode, refNode],
    });
    refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
};

/*
* TODO: add documentation
* */
export const manageTabindex = (el, value, depth = 0) => {
    checkExpectedParams({
        element: [el],
        number: [depth],
    });

    if (!depth) {
        return setTabindex(el, value);
    }

    [...el.children].forEach((child) => {
        if (isFocusable(child)) {
            child.setAttribute('tabindex', value);
        }

        if (depth > 1) {
            manageTabindex(child, value, depth - 1);
        }
    });
};

/*
* TODO: add documentation
* */
export const setChildrenTabindex = (element, value) => {
    [...element.children].forEach(child => (isFocusable(child) ? child.setAttribute('tabindex', value) : false));
};

// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Référence : https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
if (!Array.from) {
    Array.from = (function () {
        var toStr = Object.prototype.toString;
        var isCallable = function (fn) {
            return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
        };
        var toInteger = function (value) {
            var number = Number(value);
            if (isNaN(number)) {
                return 0;
            }
            if (number === 0 || !isFinite(number)) {
                return number;
            }
            return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var toLength = function (value) {
            var len = toInteger(value);
            return Math.min(Math.max(len, 0), maxSafeInteger);
        };

        // La propriété length de la méthode vaut 1.
        return function from(arrayLike/*, mapFn, thisArg */) {
            // 1. Soit C, la valeur this
            var C = this;

            // 2. Soit items le ToObject(arrayLike).
            var items = Object(arrayLike);

            // 3. ReturnIfAbrupt(items).
            if (arrayLike == null) {
                throw new TypeError('Array.from doit utiliser un objet semblable à un tableau - null ou undefined ne peuvent pas être utilisés');
            }

            // 4. Si mapfn est undefined, le mapping sera false.
            var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
            var T;
            if (typeof mapFn !== 'undefined') {
                // 5. sinon
                // 5. a. si IsCallable(mapfn) est false, on lève une TypeError.
                if (!isCallable(mapFn)) {
                    throw new TypeError('Array.from: lorsqu il est utilisé le deuxième argument doit être une fonction');
                }

                // 5. b. si thisArg a été fourni, T sera thisArg ; sinon T sera undefined.
                if (arguments.length > 2) {
                    T = arguments[2];
                }
            }

            // 10. Soit lenValue pour Get(items, "length").
            // 11. Soit len pour ToLength(lenValue).
            var len = toLength(items.length);

            // 13. Si IsConstructor(C) vaut true, alors
            // 13. a. Soit A le résultat de l'appel à la méthode interne [[Construct]] avec une liste en argument qui contient l'élément len.
            // 14. a. Sinon, soit A le résultat de ArrayCreate(len).
            var A = isCallable(C) ? Object(new C(len)) : new Array(len);

            // 16. Soit k égal à 0.
            var k = 0;  // 17. On répète tant que k < len…
            var kValue;
            while (k < len) {
                kValue = items[k];
                if (mapFn) {
                    A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                } else {
                    A[k] = kValue;
                }
                k += 1;
            }
            // 18. Soit putStatus égal à Put(A, "length", len, true).
            A.length = len;  // 20. On renvoie A.
            return A;
        };
    }());
}
