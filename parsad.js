// DON'T BE A DICK TO RYAN SWINDLE PUBLIC LICENSE TERMS AND CONDITIONS FOR COPYING,
// DISTRIBUTION AND MODIFICATION
//
// 1. Do whatever you like with the original work, just don't be a dick.
//    Being a dick includes - but is not limited to - the following instances:
//
//   1a. Outright copyright infringement - Don't just copy this and change
//       the name.
//   1b. Selling the unmodified original with no work done what-so-ever,
//       that's REALLY being a dick.
//   1c. Modifying the original work to contain hidden harmful content. That
//       would make you a PROPER dick.
//   1d. Redistributing this work without modifications after removing or
//       tampering with this license.
//   1e. Claiming this work unmodified was written by anyone but Ryan Swindle.
//       That would make you a LYING dick.
//   1f. Not attributing some credit to Ryan Swindle somewhere in a derived work.
//       That's just being a SELFISH dick.
//
// 2. If you become rich through modifications, related works/services,
//    or supporting the original work, share the love. Only a dick would
//    make loads off this work and not buy the original works creator(s) a pint.
//
// 3. Code is provided with no warranty. Using somebody else's code and
//    bitching when it goes wrong makes you a DONKEY dick. Fix the problem
//    yourself. A non-dick would submit the fix back.
//
// 4. If you alter this work you are not obligated to maintain this license
//    in your modified or derived version, because I'm not a dick. You still
//    must follow 1f above in any derived works or modified forms of this.

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
