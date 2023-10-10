const Is = {
    array: array => array && array instanceof Array && Array.isArray(array),
    arrayLike: array => Array.isArray(array) || (array && array instanceof Object && array.hasOwnProperty('length') && typeof array.length === 'number'),
    boolean: bool => typeof bool === 'boolean',
    element: element => element && element instanceof Element,
    function: context => context && typeof context === 'function',
    jScript: jScript => jScript && window.jScript && jScript instanceof window.jScript,
    mobile: context => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test((context || window).navigator.userAgent),
    node: node => node && node instanceof Node,
    number: number => typeof number === 'number',
    parseNum: number => typeof parseInt(number) === 'number',
    object: object => object && object instanceof Object && !Array.isArray(object),
    string: string => typeof string === 'string',
};