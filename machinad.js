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
  // these 2 instances act as enums for reference equality to decide on our current state
  var Success = {};
  var Failure = {};

  var eitherCtor = function(_m, _a) {
    var res = {
      m: _m,
      a: _a
    };

    res.bind = function(f) { return window.either.bind(f, res); };
    res.map = function(f) { return window.either.map(res, f); };
    res.ap = function(mf) { return window.either.ap(mf, res); };
    return res;
  };

  /* alternative instance */
  var alt = function(f1, f2) {
    return function(a) {
      var resultf1 = f1(a);
      return resultf1 !== undefined && resultf1.m !== Failure ? resultf1 : f2(a);
    };
  };

  /* monad instance */
  var bind = function(f, m) { // I'm auto-returning non-monads into the monadic case with the assumption it's a `success`
    return m !== undefined && m.m !== Failure ? f(m.m === Success ? m.a : m) : m; // innocent until proven guilty
  };
  var ret = function(a) { return eitherCtor(Success, a); };
  var success = window.success = function(a) { return eitherCtor(Success, a); };
  var failure = window.failure = function(a) { return eitherCtor(Failure, a); };

  /* monad utility functions */
  var kleisli = function(f1, f2) { return function(a) { return bind(f2, bind(f1, a)); }; };

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

  /* recursive kleisli fold until alternative is chosen */
  var until = function(f, p) {
    return function(a) {
      return kleisli(f, alt(p, until(f, p)))(a);
    };
  };

  var disregard = function(f1, f2) {
    return function(a) {
      return bind(function(b) { return bind(f2, ret(a));}, bind(f1, ret(a)));
    };
  };

  (function(a, k, u, d) {
    (function() {
      this.or = function(f2) { return a(this, f2); };
      this.then = function(f2) { return k(this, f2); };
      this.until = function(p) { return u(this, p); };
      this.disregard = function(f2) { return d(this, f2); };
    }).call(Function.prototype);
  })(alt, kleisli, until, disregard);

  window.either = {
    ret: ret,
    success: success,
    failure: failure,
    map: map,
    bind: bind,
    kleisli: kleisli,
    liftM2: liftM2,
    ap: ap,
    alt: alt,
    until: until,
    disregard: disregard
  };

}).call({});
