var untake = function(a) {
    a.input.unshift(a.result.pop());
    return success(a);
};

var char = function(c) {
    return function(a) { return a.input[0] === c ? success(a) : failure(a); };
};

var getString = function(s) {
    var s1 = s.split('');
    return (function(a) {s1 = JSON.parse(JSON.stringify(s)).split(''); return success(a); })
           .then(
               (function(a){ return tryTake(s1[0])(a); })
               .then(function(a) { s1.shift(); return success(a); })
               .until(function(a) { return s1.length < 1 ? success(a) : failure(a); }))
           .or(
               (function(a) { return s1.length >= s.length ? failure(a) : success(a); })
               .then(untake)
               .then(function(a) { s1.unshift(a.input[0]); return success(a); })
               .until(failure)
           );
};

var skipString = function(s) {
    var i = s.length;
    return getString(s)
        .then(function(a) { i = s.length; return success(a); })
        .then(untake.then(skip).until(function(a) { return --i === 0 ? success(a) : failure(a); }));
};

var endOfParse = function(a) { return a.input.length < 1 ? success(a) : failure(a); };
var skip = function(a){ a.input.shift(1); return success(a); };
var take = function(a){ a.result.push(a.input.shift(1)); return success(a); };
var tryTake = function(c) { return char(c).then(take).or(failure); };
var pushChar = function(c) {
    return function(a) {
        a.result.push(c);
        return success(a);
    };
};

var pushString = function(s) {
    return function(a) {
        a.result = a.result.concat(s.split(''));
        return success(a);
    };
};

var makeParseable = function(a) { return success({input: a.split(''), result: []}); };

var space = char(' ');
var newLine = char('\n').or(char('\r'));
var tab = char('\t');
var whiteSpace = space.or(newLine).or(tab);

var vowel = char('a')
        .or(char('e'))
        .or(char('i'))
        .or(char('o'))
        .or(char('u'));
