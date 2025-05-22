/**
 * Simple sanitization. It is not intended to sanitize
 * malicious element values.
 *
 * character | escaped
 *      <       &lt;
 *      >       &gt;
 *      (       &#40;
 *      )       &#41;
 *      #       &#35;
 *      &       &amp;
 *      "       &quot;
 *      '       &apos;
 */
// used for body text
const charsEscape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
}

const charsUnescape = {
    '&amp;': '&',
    '&#35;': '#',
    '&lt;': '<',
    '&gt;': '>',
    '&#40;': '(',
    '&#41;': ')',
    '&quot;': '"',
    '&apos;': "'",
    "&#31;": "\u001F"
}

// used in attribute values
const charsAttrEscape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
}

// sanitize body text
exports.sanitize = function sanitize(value, reverse, attribute) {
    if (typeof value !== 'string') {
        return value;
    }

    const chars = reverse ? charsUnescape : (attribute ? charsAttrEscape : charsEscape);
    
    for(const key in chars) {
        value = value.replaceAll(key, chars[key]);
    }

    return value;
};
