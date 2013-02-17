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

var makeMonadWithAlternative = function(m_, bind_, alt_, ret_) {
    (function() {
        /* monad instance */
        var bind = function(f, m) {
            return m !== undefined && m.m !== undefined && m.a !== undefined ? bind_(f, m) : m;
        };
        var ret = ret_;
        var kleisli = function(f1, f2) { return function(a) { return bind(f2, f1(a)) }; };

        var liftM2 = function(f, m1, m2) {
            return bind(function (fp) {
                return bind(function(a1) {
                    return bind(function(a2) {
                        return ret(fp(a1)(a2));
                    }, m2);
                }, m1);
            }, ret(f));
        };

        /* functor instance */
        var map = function(m, f) { return bind(function(a) { return ret(f(a)); }, m); };

        /* applicative instance; ret = return = pure */
        var ap = function(mf, ma) {
            return liftM2(function(a) { return a; }, mf, ma);
        };

        /* alternative instance */
        var alt = alt_;

        /* recursive kleisli fold until alternative is chosen */
        var until = function(f, p) {
            return function(a) {
                return kleisli(f, alt(p, until(f, p)))(a); 
            };
        };

        (function(a, k, u) {
            (function() {
                this.or = function(f2) { return a(this, f2); };
                this.then = function(f2) { return k(this, f2); };
                this.until = function(p) { return u(this, p); };
            }).call(Function.prototype);
        })(alt, kleisli, until);

        (function(b, r, m, a) {
            (function() {
                this.bind = function(f) { return b(f, this); };
                this.ret = function(a) { return r(a); };
                this.map = function(f) { return m(this, f); };
                this.ap = function(mf) { return a(mf, this); };
            }).call(m_.prototype);
        })(bind, ret, map, ap);

    }).call(m_.prototype);
};

// create the data type and monad instance
(function() {

    var either = function(m, a) {
        this.m = m;
        try { this.a = JSON.parse(JSON.stringify(a)); }
        catch(e) { this.a = $.extend(true, {}, a); }
    };

    var Success = {}
    var Failure = {}

    Success.f = this.success = function(a) { return new either(Success, a); };
    Failure.f = this.failure = function(a) { return new either(Failure, a); };

    var bind = function(f, m) { return m.m === Success ? f(m.a) : m; };
    var ret = function(a) { return new success(a); };

    var alt = function(f1, f2) {
        return function(a) {
            var resultf1 = f1(a);
            return resultf1.m === Success ? resultf1 : f2(a);
        };
    };

    makeMonadWithAlternative(either, bind, alt, ret);

})();
