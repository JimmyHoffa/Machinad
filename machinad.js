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

(function() {
    this.m_ = {};

    /* canContinue: error monad gate, and general monad validator */
    this.m_.canContinue = function(m) { return m !== undefined && m.m !== undefined && m.m === Success && m.a !== undefined; };

    /* functor instance */
    this.m_.map = function(m, f) { return m.m === Failure ? new m.m.f(m.a) : new m.m.f(f(m.a)); };

    /* applicative instance; ret = return = pure */
    this.m_.ret = function(a) { return new success(a); };
    this.m_.ap = function(mf, ma) {
        return
             mf.m === Failure ? new mf.m.f(mf.a) :
            (ma.m === Failure ? new ma.m.f(ma.a) :
                                new success(mf.a(ma.a)));
    };

    /* alternative instance */
    this.m_.alternative = function(f1, f2) {
        return function(a) {
            var resultf1 = f1(a);
            if (resultf1.m === Success) return resultf1;
            return f2(a);
        };
    };

    /* monad instance */
    this.m_.bind = function(f, m) { return m_.canContinue(m) ? f(m.a) : m; };
    this.m_.kleisli = function(f1, f2) { return function(a) { return m_.bind(f2, f1(a)) }; };

    /* error monad's monadic actions, and some english verbiage aliases */
    this.m_.until = function(f, p) {
        return function(a) {
            var result = f(a);
            var goodResult = result;
            while(m_.bind(p, result).m === Failure) {
                if (result.m === Failure) return goodResult;
                else goodResult = result;
                result = m_.bind(f, result);
            }
            return result;
        };
    };

    this.m_.run = function(f, a) { return m_.bind(f, m_.ret(a)); };

    this.m_.or = this.m_.alternative;
    this.m_.then = this.m_.kleisli;


   (function() {
       this.or = function(f2) { return m_.or(this, f2); };
       this.then = function(f2) { return m_.then(this, f2); };
       this.until = function(p) { return m_.until(this, p); };
   }).call(Function.prototype);

    var either = function(m, a) { this.m = m; this.a = a; };

    var Success = {}
    var Failure = {}

    Success.f = this.success = function(a) { return new either(Success, a); };
    Failure.f = this.failure = function(a) { return new either(Failure, a); };

}).call(this);
