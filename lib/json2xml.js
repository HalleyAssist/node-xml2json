var sanitizer = require('./sanitize.js')

module.exports = function (json, options) {
    if (json instanceof Buffer) {
        json = json.toString();
    }

    var obj = null;
    if (typeof(json) == 'string') {
        try {
            obj = JSON.parse(json);
        } catch(e) {
            throw new Error("The JSON structure is invalid");
        }
    } else {
        obj = json;
    }
    var toXml = new ToXml(options);
    toXml.parse(obj);
    return toXml.xml;
}

ToXml.prototype.parse = function(obj) {
    if (!obj) return;

    if(obj.$){
        for(const k in obj.$){
            const v = obj.$[k]
            if(!this.options.ignoreNull || v !== null){
                this.addAttr(k, v);
            }
        }
    }

    for(const k in obj){
        if(k === '$' || k === '$t') {
            if(k === '$t') this.addTextContent(obj.$t)
            continue
        }

        let v = obj[k]

        if(typeof v !== 'object') throw new Error(`Unexpected member ${k} of type ${typeof v}`)

        if(!Array.isArray(v)){
            v = [v]
        }
        for(const vv of v){
            this.openTag(k);
            this.parse(vv);
            this.closeTag(k);
        }
    }
};

ToXml.prototype.openTag = function(key) {
    this.completeTag();
    this.xml += '<' + key;
    this.tagIncomplete = true;
}
ToXml.prototype.addAttr = function(key, val) {
    if (this.options.sanitize) {
        val = sanitizer.sanitize(val, false, true);
    }
    this.xml += ' ' + key + '="' + val + '"';
}
ToXml.prototype.addTextContent = function(text) {
    this.completeTag();
    var newText = (this.options.sanitize ? sanitizer.sanitize(text) : text);
    this.xml += newText;
}
ToXml.prototype.closeTag = function(key) {
    this.completeTag();
    this.xml += '</' + key + '>';
}
ToXml.prototype.completeTag = function() {
    if (this.tagIncomplete) {
        this.xml += '>';
        this.tagIncomplete = false;
    }
}
function ToXml(options) {
    var defaultOpts = {
        sanitize: false,
        ignoreNull: false
    };

    if (options) {
        for (var opt in options) {
            defaultOpts[opt] = options[opt];
        }
    }

    this.options = defaultOpts;
    this.xml = '';
    this.tagIncomplete = false;
}
