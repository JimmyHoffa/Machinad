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
