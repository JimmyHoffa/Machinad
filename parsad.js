var p_ = {};

/* parser primitives */
p_.makeParseable = function(a) { return success({input: a.split(''), result: []}); };
p_.skip = function(a){ a.input.shift(1); return success(a); };
p_.take = function(a){ a.result.push(a.input.shift(1)); return success(a); };
p_.untake = function(a) { a.input.unshift(a.result.pop()); return success(a); };
p_.endOfParse = function(a) { return a.input.length < 1 ? success(a) : failure(a); };

/* character primitives */
p_.isChar = function(c) {
    return function(a) { return a.input[0] === c ? success(a) : failure(a); };
};

p_.isCharCI = function(c) { return p_.isChar(c.toUpperCase()).or(p_.isChar(c.toLowerCase())); };

p_.getChar = function(c) { return p_.isChar(c).then(p_.take); };

p_.getCharCI = function(c) { return p_.isCharCI(c).then(p_.take); };

p_.pushChar = function(c) {
    return function(a) { a.result.push(c); return success(a); };
};

/* string primitives */
p_.getString = function(s) {
    var s1 = s.split('');
    return (function(a) {s1 = JSON.parse(JSON.stringify(s)).split(''); return success(a); })
           .then(
               (function(a){ return p_.getChar(s1[0]).disregard(function(){s1.shift();})(a); })
               .until(function(a) { return s1.length < 1 ? success(a) : failure(a); }))
           .or(failure);
};


p_.getStringCI = function(s) {
    var s1 = s.split('');
    return (function(a) {s1 = JSON.parse(JSON.stringify(s)).split(''); return success(a); })
           .then(
               (function(a){ return p_.getCharCI(s1[0]).disregard(function(){s1.shift();})(a); })
               .until(function(a) { return s1.length < 1 ? success(a) : failure(a); }))
           .or(failure);
};

p_.skipString = function(s) {
    return function(a) {
        return p_.getString(s).then(function(b) { a.input = b.input; return success(a); })(a);
    };
};

p_.skipStringCI = function(s) {
    return function(a) {
        return p_.getStringCI(s).then(function(b) { a.input = b.input; return success(a); })(a);
    };
};

p_.pushString = function(s) {
    return function(a) {
        a.result = a.result.concat(s.split(''));
        return success(a);
    };
};

p_.replaceString = function(oldS, newS) { return p_.skipString(oldS).then(p_.pushString(newS)); };

p_.replaceStringCI = function(oldS, newS) { return p_.skipStringCI(oldS).then(p_.pushString(newS)); };

/* combinators */
p_.space = p_.isChar(' ');
p_.newLine = p_.isChar('\n').or(p_.isChar('\r'));
p_.tab = p_.isChar('\t');
p_.whiteSpace = p_.space.or(p_.newLine).or(p_.tab);

p_.isVowel = p_.isChar('a')
         .or(p_.isChar('e'))
         .or(p_.isChar('i'))
         .or(p_.isChar('o'))
         .or(p_.isChar('u'));
