import { GameLinkClient as Qr } from "./gamelink.js";
// @__NO_SIDE_EFFECTS__
function Ws(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const s of e.split(",")) t[s] = 1;
  return (s) => s in t;
}
const X = {}, ht = [], Ve = () => {
}, Bn = () => !1, as = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), ds = (e) => e.startsWith("onUpdate:"), ce = Object.assign, Js = (e, t) => {
  const s = e.indexOf(t);
  s > -1 && e.splice(s, 1);
}, ei = Object.prototype.hasOwnProperty, B = (e, t) => ei.call(e, t), H = Array.isArray, lt = (e) => Jt(e) === "[object Map]", ns = (e) => Jt(e) === "[object Set]", dn = (e) => Jt(e) === "[object Date]", k = (e) => typeof e == "function", te = (e) => typeof e == "string", Be = (e) => typeof e == "symbol", G = (e) => e !== null && typeof e == "object", Wn = (e) => (G(e) || k(e)) && k(e.then) && k(e.catch), Jn = Object.prototype.toString, Jt = (e) => Jn.call(e), ti = (e) => Jt(e).slice(8, -1), qn = (e) => Jt(e) === "[object Object]", qs = (e) => te(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Lt = /* @__PURE__ */ Ws(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), hs = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((s) => t[s] || (t[s] = e(s)));
}, si = /-\w/g, Oe = hs(
  (e) => e.replace(si, (t) => t.slice(1).toUpperCase())
), ni = /\B([A-Z])/g, ft = hs(
  (e) => e.replace(ni, "-$1").toLowerCase()
), Gn = hs((e) => e.charAt(0).toUpperCase() + e.slice(1)), Ss = hs(
  (e) => e ? `on${Gn(e)}` : ""
), Ke = (e, t) => !Object.is(e, t), Cs = (e, ...t) => {
  for (let s = 0; s < e.length; s++)
    e[s](...t);
}, zn = (e, t, s, n = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: n,
    value: s
  });
}, ri = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let hn;
const ps = () => hn || (hn = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function gs(e) {
  if (H(e)) {
    const t = {};
    for (let s = 0; s < e.length; s++) {
      const n = e[s], r = te(n) ? ci(n) : gs(n);
      if (r)
        for (const i in r)
          t[i] = r[i];
    }
    return t;
  } else if (te(e) || G(e))
    return e;
}
const ii = /;(?![^(]*\))/g, li = /:([^]+)/, oi = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function ci(e) {
  const t = {};
  return e.replace(oi, (s) => s.startsWith("/*") ? "" : s).split(ii).forEach((s) => {
    if (s) {
      const n = s.split(li);
      n.length > 1 && (t[n[0].trim()] = n[1].trim());
    }
  }), t;
}
function Ot(e) {
  let t = "";
  if (te(e))
    t = e;
  else if (H(e))
    for (let s = 0; s < e.length; s++) {
      const n = Ot(e[s]);
      n && (t += n + " ");
    }
  else if (G(e))
    for (const s in e)
      e[s] && (t += s + " ");
  return t.trim();
}
const fi = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", ui = /* @__PURE__ */ Ws(fi);
function Yn(e) {
  return !!e || e === "";
}
function ai(e, t, s) {
  if (e.length !== t.length) return !1;
  let n = !0;
  for (let r = 0; n && r < e.length; r++)
    n = ms(e[r], t[r], s);
  return n;
}
function pn(e, t, s) {
  if (e.size !== t.size) return !1;
  const n = Array.from(t), r = new Uint8Array(n.length);
  for (const i of e) {
    let l = -1;
    for (let o = 0; o < n.length; o++)
      if (!r[o] && ms(i, n[o], s)) {
        l = o;
        break;
      }
    if (l < 0) return !1;
    r[l] = 1;
  }
  return !0;
}
function di(e, t, s) {
  let n = lt(e), r = lt(t);
  if (n || r || (n = ns(e), r = ns(t), n || r))
    return n && r ? pn(e, t, s) : !1;
  const i = Object.keys(e).length, l = Object.keys(t).length;
  if (i !== l)
    return !1;
  for (const o in e) {
    const f = e.hasOwnProperty(o), a = t.hasOwnProperty(o);
    if (f && !a || !f && a || !ms(e[o], t[o], s))
      return !1;
  }
  return String(e) === String(t);
}
function gn(e, t, s, n) {
  s || (s = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()]);
  const [r, i] = s;
  if (r.has(e) || i.has(t))
    return r.get(e) === t && i.get(t) === e;
  r.set(e, t), i.set(t, e);
  const l = n(e, t, s);
  return r.delete(e), i.delete(t), l;
}
function ms(e, t, s) {
  if (e === t) return !0;
  let n = dn(e), r = dn(t);
  return n || r ? n && r ? e.getTime() === t.getTime() : !1 : (n = Be(e), r = Be(t), n || r ? e === t : (n = H(e), r = H(t), n || r ? n && r ? gn(e, t, s, ai) : !1 : (n = G(e), r = G(t), n || r ? !n || !r ? !1 : gn(e, t, s, di) : String(e) === String(t))));
}
const Zn = (e) => !!(e && e.__v_isRef === !0), ae = (e) => te(e) ? e : e == null ? "" : H(e) || G(e) && (e.toString === Jn || !k(e.toString)) ? Zn(e) ? ae(e.value) : JSON.stringify(e, Xn, 2) : String(e), Xn = (e, t) => Zn(t) ? Xn(e, t.value) : lt(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (s, [n, r], i) => (s[Ts(n, i) + " =>"] = r, s),
    {}
  )
} : ns(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((s) => Ts(s))
} : Be(t) ? Ts(t) : G(t) && !H(t) && !qn(t) ? String(t) : t, Ts = (e, t = "") => {
  var s;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    Be(e) ? `Symbol(${(s = e.description) != null ? s : t})` : e
  );
};
let le;
class hi {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !t && le && (le.active ? (this.parent = le, this.index = (le.scopes || (le.scopes = [])).push(
      this
    ) - 1) : (this._active = !1, this._warnOnRun = !1));
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, s;
      if (this.scopes) {
        const n = this.scopes.slice();
        for (t = 0, s = n.length; t < s; t++)
          n[t].pause();
      }
      for (t = 0, s = this.effects.length; t < s; t++)
        this.effects[t].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, s;
      if (this.scopes) {
        const r = this.scopes.slice();
        for (t = 0, s = r.length; t < s; t++)
          r[t].resume();
      }
      const n = this.effects.slice();
      for (t = 0, s = n.length; t < s; t++)
        n[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const s = le;
      try {
        return le = this, t();
      } finally {
        le = s;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = le, le = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (le === this)
        le = this.prevScope;
      else {
        let t = le;
        for (; t; ) {
          if (t.prevScope === this) {
            t.prevScope = this.prevScope;
            break;
          }
          t = t.prevScope;
        }
      }
      this.prevScope = void 0;
    }
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let s, n;
      for (s = 0, n = this.effects.length; s < n; s++)
        this.effects[s].stop();
      for (this.effects.length = 0, s = 0, n = this.cleanups.length; s < n; s++)
        this.cleanups[s]();
      if (this.cleanups.length = 0, this.scopes) {
        const r = this.scopes.slice();
        for (s = 0, n = r.length; s < n; s++)
          r[s].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const r = this.parent.scopes.pop();
        r && r !== this && (this.parent.scopes[this.index] = r, r.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function pi() {
  return le;
}
let Z;
const Os = /* @__PURE__ */ new WeakSet();
class Qn {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, le && (le.active ? le.effects.push(this) : this.flags &= -2);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Os.has(this) && (Os.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || tr(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, mn(this), sr(this);
    const t = Z, s = Ee;
    Z = this, Ee = !0;
    try {
      return this.fn();
    } finally {
      nr(this), Z = t, Ee = s, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Ys(t);
      this.deps = this.depsTail = void 0, mn(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Os.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Fs(this) && this.run();
  }
  get dirty() {
    return Fs(this);
  }
}
let er = 0, Ft, Nt;
function tr(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = Nt, Nt = e;
    return;
  }
  e.next = Ft, Ft = e;
}
function Gs() {
  er++;
}
function zs() {
  if (--er > 0)
    return;
  if (Nt) {
    let t = Nt;
    for (Nt = void 0; t; ) {
      const s = t.next;
      t.next = void 0, t.flags &= -9, t = s;
    }
  }
  let e;
  for (; Ft; ) {
    let t = Ft;
    for (Ft = void 0; t; ) {
      const s = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (n) {
          e || (e = n);
        }
      t = s;
    }
  }
  if (e) throw e;
}
function sr(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function nr(e) {
  let t, s = e.depsTail, n = s;
  for (; n; ) {
    const r = n.prevDep;
    n.version === -1 ? (n === s && (s = r), Ys(n), gi(n)) : t = n, n.dep.activeLink = n.prevActiveLink, n.prevActiveLink = void 0, n = r;
  }
  e.deps = t, e.depsTail = s;
}
function Fs(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (rr(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function rr(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === kt) || (e.globalVersion = kt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Fs(e))))
    return;
  e.flags |= 2;
  const t = e.dep, s = Z, n = Ee;
  Z = e, Ee = !0;
  try {
    sr(e);
    const r = e.fn(e._value);
    (t.version === 0 || Ke(r, e._value)) && (e.flags |= 128, e._value = r, t.version++);
  } catch (r) {
    throw t.version++, r;
  } finally {
    Z = s, Ee = n, nr(e), e.flags &= -3;
  }
}
function Ys(e, t = !1) {
  const { dep: s, prevSub: n, nextSub: r } = e;
  if (n && (n.nextSub = r, e.prevSub = void 0), r && (r.prevSub = n, e.nextSub = void 0), s.subs === e && (s.subs = n, !n && s.computed)) {
    s.computed.flags &= -5;
    for (let i = s.computed.deps; i; i = i.nextDep)
      Ys(i, !0);
  }
  !t && !--s.sc && s.map && s.map.delete(s.key);
}
function gi(e) {
  const { prevDep: t, nextDep: s } = e;
  t && (t.nextDep = s, e.prevDep = void 0), s && (s.prevDep = t, e.nextDep = void 0);
}
let Ee = !0;
const ir = [];
function Xe() {
  ir.push(Ee), Ee = !1;
}
function Qe() {
  const e = ir.pop();
  Ee = e === void 0 ? !0 : e;
}
function mn(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const s = Z;
    Z = void 0;
    try {
      t();
    } finally {
      Z = s;
    }
  }
}
let kt = 0;
class mi {
  constructor(t, s) {
    this.sub = t, this.dep = s, this.version = s.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Zs {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!Z || !Ee || Z === this.computed)
      return;
    let s = this.activeLink;
    if (s === void 0 || s.sub !== Z)
      s = this.activeLink = new mi(Z, this), Z.deps ? (s.prevDep = Z.depsTail, Z.depsTail.nextDep = s, Z.depsTail = s) : Z.deps = Z.depsTail = s, lr(s);
    else if (s.version === -1 && (s.version = this.version, s.nextDep)) {
      const n = s.nextDep;
      n.prevDep = s.prevDep, s.prevDep && (s.prevDep.nextDep = n), s.prevDep = Z.depsTail, s.nextDep = void 0, Z.depsTail.nextDep = s, Z.depsTail = s, Z.deps === s && (Z.deps = n);
    }
    return s;
  }
  trigger(t) {
    this.version++, kt++, this.notify(t);
  }
  notify(t) {
    Gs();
    try {
      for (let s = this.subs; s; s = s.prevSub)
        s.sub.notify() && s.sub.dep.notify();
    } finally {
      zs();
    }
  }
}
function lr(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let n = t.deps; n; n = n.nextDep)
        lr(n);
    }
    const s = e.dep.subs;
    s !== e && (e.prevSub = s, s && (s.nextSub = e)), e.dep.subs = e;
  }
}
const Ns = /* @__PURE__ */ new WeakMap(), pt = /* @__PURE__ */ Symbol(
  ""
), js = /* @__PURE__ */ Symbol(
  ""
), Kt = /* @__PURE__ */ Symbol(
  ""
);
function de(e, t, s) {
  if (Ee && Z) {
    let n = Ns.get(e);
    n || Ns.set(e, n = /* @__PURE__ */ new Map());
    let r = n.get(s);
    r || (n.set(s, r = new Zs()), r.map = n, r.key = s), r.track();
  }
}
function Ze(e, t, s, n, r, i) {
  const l = Ns.get(e);
  if (!l) {
    kt++;
    return;
  }
  const o = (f) => {
    f && f.trigger();
  };
  if (Gs(), t === "clear")
    l.forEach(o);
  else {
    const f = H(e), a = f && qs(s);
    if (f && s === "length") {
      const d = Number(n);
      l.forEach((p, E) => {
        (E === "length" || E === Kt || !Be(E) && E >= d) && o(p);
      });
    } else
      switch ((s !== void 0 || l.has(void 0)) && o(l.get(s)), a && o(l.get(Kt)), t) {
        case "add":
          f ? a && o(l.get("length")) : (o(l.get(pt)), lt(e) && o(l.get(js)));
          break;
        case "delete":
          f || (o(l.get(pt)), lt(e) && o(l.get(js)));
          break;
        case "set":
          lt(e) && o(l.get(pt));
          break;
      }
  }
  zs();
}
function xt(e) {
  const t = /* @__PURE__ */ V(e);
  return t === e || (de(t, "iterate", Kt), /* @__PURE__ */ Se(e)) ? t : /* @__PURE__ */ We(e) ? /* @__PURE__ */ ot(e) ? t.map((s) => ct(Ce(s))) : t.map(ct) : t.map(Ce);
}
function ys(e) {
  return de(e = /* @__PURE__ */ V(e), "iterate", Kt), e;
}
function He(e, t) {
  return /* @__PURE__ */ We(e) ? ct(/* @__PURE__ */ ot(e) ? Ce(t) : t) : Ce(t);
}
const yi = {
  __proto__: null,
  [Symbol.iterator]() {
    return Es(this, Symbol.iterator, (e) => He(this, e));
  },
  concat(...e) {
    return xt(this).concat(
      ...e.map((t) => H(t) ? xt(t) : t)
    );
  },
  entries() {
    return Es(this, "entries", (e) => (e[1] = He(this, e[1]), e));
  },
  every(e, t) {
    return Ge(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return Ge(
      this,
      "filter",
      e,
      t,
      (s) => s.map((n) => He(this, n)),
      arguments
    );
  },
  find(e, t) {
    return Ge(
      this,
      "find",
      e,
      t,
      (s) => He(this, s),
      arguments
    );
  },
  findIndex(e, t) {
    return Ge(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return Ge(
      this,
      "findLast",
      e,
      t,
      (s) => He(this, s),
      arguments
    );
  },
  findLastIndex(e, t) {
    return Ge(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return Ge(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return As(this, "includes", e);
  },
  indexOf(...e) {
    return As(this, "indexOf", e);
  },
  join(e) {
    return xt(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return As(this, "lastIndexOf", e);
  },
  map(e, t) {
    return Ge(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return It(this, "pop");
  },
  push(...e) {
    return It(this, "push", e);
  },
  reduce(e, ...t) {
    return yn(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return yn(this, "reduceRight", e, t);
  },
  shift() {
    return It(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return Ge(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return It(this, "splice", e);
  },
  toReversed() {
    return xt(this).toReversed();
  },
  toSorted(e) {
    return xt(this).toSorted(e);
  },
  toSpliced(...e) {
    return xt(this).toSpliced(...e);
  },
  unshift(...e) {
    return It(this, "unshift", e);
  },
  values() {
    return Es(this, "values", (e) => He(this, e));
  }
};
function Es(e, t, s) {
  const n = ys(e), r = n[t]();
  return n !== e && !/* @__PURE__ */ Se(e) && (r._next = r.next, r.next = () => {
    const i = r._next();
    return i.done || (i.value = s(i.value)), i;
  }), r;
}
const vi = Array.prototype;
function Ge(e, t, s, n, r, i) {
  const l = ys(e), o = l !== e && !/* @__PURE__ */ Se(e), f = l[t];
  if (f !== vi[t]) {
    const p = f.apply(e, i);
    return o ? Ce(p) : p;
  }
  let a = s;
  l !== e && (o ? a = function(p, E) {
    return s.call(this, He(e, p), E, e);
  } : s.length > 2 && (a = function(p, E) {
    return s.call(this, p, E, e);
  }));
  const d = f.call(l, a, n);
  return o && r ? r(d) : d;
}
function yn(e, t, s, n) {
  const r = ys(e), i = r !== e && !/* @__PURE__ */ Se(e);
  let l = s, o = !1;
  r !== e && (i ? (o = n.length === 0, l = function(a, d, p) {
    return o && (o = !1, a = He(e, a)), s.call(this, a, He(e, d), p, e);
  }) : s.length > 3 && (l = function(a, d, p) {
    return s.call(this, a, d, p, e);
  }));
  const f = r[t](l, ...n);
  return o ? He(e, f) : f;
}
function As(e, t, s) {
  const n = /* @__PURE__ */ V(e);
  de(n, "iterate", Kt);
  const r = n[t](...s);
  return (r === -1 || r === !1) && /* @__PURE__ */ tn(s[0]) ? (s[0] = /* @__PURE__ */ V(s[0]), n[t](...s)) : r;
}
function It(e, t, s = []) {
  Xe(), Gs();
  const n = (/* @__PURE__ */ V(e))[t].apply(e, s);
  return zs(), Qe(), n;
}
const _i = /* @__PURE__ */ Ws("__proto__,__v_isRef,__isVue"), or = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Be)
);
function bi(e) {
  Be(e) || (e = String(e));
  const t = /* @__PURE__ */ V(this);
  return de(t, "has", e), t.hasOwnProperty(e);
}
class cr {
  constructor(t = !1, s = !1) {
    this._isReadonly = t, this._isShallow = s;
  }
  get(t, s, n) {
    if (s === "__v_skip") return t.__v_skip;
    const r = this._isReadonly, i = this._isShallow;
    if (s === "__v_isReactive")
      return !r;
    if (s === "__v_isReadonly")
      return r;
    if (s === "__v_isShallow")
      return i;
    if (s === "__v_raw")
      return n === (r ? i ? Ii : dr : i ? ar : ur).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(n) ? t : void 0;
    const l = H(t);
    if (!r) {
      let f;
      if (l && (f = yi[s]))
        return f;
      if (s === "hasOwnProperty")
        return bi;
    }
    const o = Reflect.get(
      t,
      s,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ he(t) ? t : n
    );
    if ((Be(s) ? or.has(s) : _i(s)) || (r || de(t, "get", s), i))
      return o;
    if (/* @__PURE__ */ he(o)) {
      const f = l && qs(s) ? o : o.value;
      return r && G(f) ? /* @__PURE__ */ Hs(f) : f;
    }
    return G(o) ? r ? /* @__PURE__ */ Hs(o) : /* @__PURE__ */ Qs(o) : o;
  }
}
class fr extends cr {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, s, n, r) {
    let i = t[s];
    const l = H(t) && qs(s);
    if (!this._isShallow) {
      const a = /* @__PURE__ */ We(i);
      if (!/* @__PURE__ */ Se(n) && !/* @__PURE__ */ We(n) && (i = /* @__PURE__ */ V(i), n = /* @__PURE__ */ V(n)), !l && /* @__PURE__ */ he(i) && !/* @__PURE__ */ he(n))
        return a || (i.value = n), !0;
    }
    const o = l ? Number(s) < t.length : B(t, s), f = Reflect.set(
      t,
      s,
      n,
      /* @__PURE__ */ he(t) ? t : r
    );
    return t === /* @__PURE__ */ V(r) && f && (o ? Ke(n, i) && Ze(t, "set", s, n) : Ze(t, "add", s, n)), f;
  }
  deleteProperty(t, s) {
    const n = B(t, s);
    t[s];
    const r = Reflect.deleteProperty(t, s);
    return r && n && Ze(t, "delete", s, void 0), r;
  }
  has(t, s) {
    const n = Reflect.has(t, s);
    return (!Be(s) || !or.has(s)) && de(t, "has", s), n;
  }
  ownKeys(t) {
    return de(
      t,
      "iterate",
      H(t) ? "length" : pt
    ), Reflect.ownKeys(t);
  }
}
class xi extends cr {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, s) {
    return !0;
  }
  deleteProperty(t, s) {
    return !0;
  }
}
const wi = /* @__PURE__ */ new fr(), Si = /* @__PURE__ */ new xi(), Ci = /* @__PURE__ */ new fr(!0);
const Ds = (e) => e, Yt = (e) => Reflect.getPrototypeOf(e);
function Ti(e, t, s) {
  return function(...n) {
    const r = this.__v_raw, i = /* @__PURE__ */ V(r), l = lt(i), o = e === "entries" || e === Symbol.iterator && l, f = e === "keys" && l, a = r[e](...n), d = s ? Ds : t ? ct : Ce;
    return !t && de(
      i,
      "iterate",
      f ? js : pt
    ), ce(
      // inheriting all iterator properties
      Object.create(a),
      {
        // iterator protocol
        next() {
          const { value: p, done: E } = a.next();
          return E ? { value: p, done: E } : {
            value: o ? [d(p[0]), d(p[1])] : d(p),
            done: E
          };
        }
      }
    );
  };
}
function Zt(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Oi(e, t) {
  const s = {
    get(r) {
      const i = this.__v_raw, l = /* @__PURE__ */ V(i), o = /* @__PURE__ */ V(r);
      e || (Ke(r, o) && de(l, "get", r), de(l, "get", o));
      const { has: f } = Yt(l), a = t ? Ds : e ? ct : Ce;
      if (f.call(l, r))
        return a(i.get(r));
      if (f.call(l, o))
        return a(i.get(o));
      i !== l && i.get(r);
    },
    get size() {
      const r = this.__v_raw;
      return !e && de(/* @__PURE__ */ V(r), "iterate", pt), r.size;
    },
    has(r) {
      const i = this.__v_raw, l = /* @__PURE__ */ V(i), o = /* @__PURE__ */ V(r);
      return e || (Ke(r, o) && de(l, "has", r), de(l, "has", o)), r === o ? i.has(r) : i.has(r) || i.has(o);
    },
    forEach(r, i) {
      const l = this, o = l.__v_raw, f = /* @__PURE__ */ V(o), a = t ? Ds : e ? ct : Ce;
      return !e && de(f, "iterate", pt), o.forEach((d, p) => r.call(i, a(d), a(p), l));
    }
  };
  return ce(
    s,
    e ? {
      add: Zt("add"),
      set: Zt("set"),
      delete: Zt("delete"),
      clear: Zt("clear")
    } : {
      add(r) {
        const i = /* @__PURE__ */ V(this), l = Yt(i), o = /* @__PURE__ */ V(r), f = !t && !/* @__PURE__ */ Se(r) && !/* @__PURE__ */ We(r) ? o : r;
        return l.has.call(i, f) || Ke(r, f) && l.has.call(i, r) || Ke(o, f) && l.has.call(i, o) || (i.add(f), Ze(i, "add", f, f)), this;
      },
      set(r, i) {
        !t && !/* @__PURE__ */ Se(i) && !/* @__PURE__ */ We(i) && (i = /* @__PURE__ */ V(i));
        const l = /* @__PURE__ */ V(this), { has: o, get: f } = Yt(l);
        let a = o.call(l, r);
        a || (r = /* @__PURE__ */ V(r), a = o.call(l, r));
        const d = f.call(l, r);
        return l.set(r, i), a ? Ke(i, d) && Ze(l, "set", r, i) : Ze(l, "add", r, i), this;
      },
      delete(r) {
        const i = /* @__PURE__ */ V(this), { has: l, get: o } = Yt(i);
        let f = l.call(i, r);
        f || (r = /* @__PURE__ */ V(r), f = l.call(i, r)), o && o.call(i, r);
        const a = i.delete(r);
        return f && Ze(i, "delete", r, void 0), a;
      },
      clear() {
        const r = /* @__PURE__ */ V(this), i = r.size !== 0, l = r.clear();
        return i && Ze(
          r,
          "clear",
          void 0,
          void 0
        ), l;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((r) => {
    s[r] = Ti(r, e, t);
  }), s;
}
function Xs(e, t) {
  const s = Oi(e, t);
  return (n, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? n : Reflect.get(
    B(s, r) && r in n ? s : n,
    r,
    i
  );
}
const Ei = {
  get: /* @__PURE__ */ Xs(!1, !1)
}, Ai = {
  get: /* @__PURE__ */ Xs(!1, !0)
}, Mi = {
  get: /* @__PURE__ */ Xs(!0, !1)
};
const ur = /* @__PURE__ */ new WeakMap(), ar = /* @__PURE__ */ new WeakMap(), dr = /* @__PURE__ */ new WeakMap(), Ii = /* @__PURE__ */ new WeakMap();
function Pi(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
// @__NO_SIDE_EFFECTS__
function Qs(e) {
  return /* @__PURE__ */ We(e) ? e : en(
    e,
    !1,
    wi,
    Ei,
    ur
  );
}
// @__NO_SIDE_EFFECTS__
function $i(e) {
  return en(
    e,
    !1,
    Ci,
    Ai,
    ar
  );
}
// @__NO_SIDE_EFFECTS__
function Hs(e) {
  return en(
    e,
    !0,
    Si,
    Mi,
    dr
  );
}
function en(e, t, s, n, r) {
  if (!G(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const i = r.get(e);
  if (i)
    return i;
  const l = Pi(ti(e));
  if (l === 0)
    return e;
  const o = new Proxy(
    e,
    l === 2 ? n : s
  );
  return r.set(e, o), o;
}
// @__NO_SIDE_EFFECTS__
function ot(e) {
  return /* @__PURE__ */ We(e) ? /* @__PURE__ */ ot(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function We(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Se(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function tn(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function V(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ V(t) : e;
}
function Ri(e) {
  return !B(e, "__v_skip") && Object.isExtensible(e) && zn(e, "__v_skip", !0), e;
}
const Ce = (e) => G(e) ? /* @__PURE__ */ Qs(e) : e, ct = (e) => G(e) ? /* @__PURE__ */ Hs(e) : e;
// @__NO_SIDE_EFFECTS__
function he(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function Fe(e) {
  return hr(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Li(e) {
  return hr(e, !0);
}
function hr(e, t) {
  return /* @__PURE__ */ he(e) ? e : new Fi(e, t);
}
class Fi {
  constructor(t, s) {
    this.dep = new Zs(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = s ? t : /* @__PURE__ */ V(t), this._value = s ? t : Ce(t), this.__v_isShallow = s;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const s = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Se(t) || /* @__PURE__ */ We(t);
    t = n ? t : /* @__PURE__ */ V(t), Ke(t, s) && (this._rawValue = t, this._value = n ? t : Ce(t), this.dep.trigger());
  }
}
function wt(e) {
  return /* @__PURE__ */ he(e) ? e.value : e;
}
const Ni = {
  get: (e, t, s) => t === "__v_raw" ? e : wt(Reflect.get(e, t, s)),
  set: (e, t, s, n) => {
    const r = e[t];
    return /* @__PURE__ */ he(r) && !/* @__PURE__ */ he(s) ? (r.value = s, !0) : Reflect.set(e, t, s, n);
  }
};
function pr(e) {
  return /* @__PURE__ */ ot(e) ? e : new Proxy(e, Ni);
}
class ji {
  constructor(t, s, n) {
    this.fn = t, this.setter = s, this._value = void 0, this.dep = new Zs(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = kt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !s, this.isSSR = n;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    Z !== this)
      return tr(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return rr(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function Di(e, t, s = !1) {
  let n, r;
  return k(e) ? n = e : (n = e.get, r = e.set), new ji(n, r, s);
}
const Xt = {}, rs = /* @__PURE__ */ new WeakMap();
let dt;
function Hi(e, t = !1, s = dt) {
  if (s) {
    let n = rs.get(s);
    n || rs.set(s, n = []), n.push(e);
  }
}
function ki(e, t, s = X) {
  const { immediate: n, deep: r, once: i, scheduler: l, augmentJob: o, call: f } = s, a = (P) => r ? P : /* @__PURE__ */ Se(P) || r === !1 || r === 0 ? it(P, 1) : it(P);
  let d, p, E, I, $ = !1, _ = !1;
  if (/* @__PURE__ */ he(e) ? (p = () => e.value, $ = /* @__PURE__ */ Se(e)) : /* @__PURE__ */ ot(e) ? (p = () => a(e), $ = !0) : H(e) ? (_ = !0, $ = e.some((P) => /* @__PURE__ */ ot(P) || /* @__PURE__ */ Se(P)), p = () => e.map((P) => {
    if (/* @__PURE__ */ he(P))
      return P.value;
    if (/* @__PURE__ */ ot(P))
      return a(P);
    if (k(P))
      return f ? f(P, 2) : P();
  })) : k(e) ? t ? p = f ? () => f(e, 2) : e : p = () => {
    if (E) {
      Xe();
      try {
        E();
      } finally {
        Qe();
      }
    }
    const P = dt;
    dt = d;
    try {
      return f ? f(e, 3, [I]) : e(I);
    } finally {
      dt = P;
    }
  } : p = Ve, t && r) {
    const P = p, W = r === !0 ? 1 / 0 : r;
    p = () => it(P(), W);
  }
  const x = pi(), L = () => {
    d.stop(), x && x.active && Js(x.effects, d);
  };
  if (i && t) {
    const P = t;
    t = (...W) => {
      const ne = P(...W);
      return L(), ne;
    };
  }
  let M = _ ? new Array(e.length).fill(Xt) : Xt;
  const K = (P) => {
    if (!(!(d.flags & 1) || !d.dirty && !P))
      if (t) {
        const W = d.run();
        if (P || r || $ || (_ ? W.some((ne, fe) => Ke(ne, M[fe])) : Ke(W, M))) {
          E && E();
          const ne = dt;
          dt = d;
          try {
            const fe = [
              W,
              // pass undefined as the old value when it's changed for the first time
              M === Xt ? void 0 : _ && M[0] === Xt ? [] : M,
              I
            ];
            M = W, f ? f(t, 3, fe) : (
              // @ts-expect-error
              t(...fe)
            );
          } finally {
            dt = ne;
          }
        }
      } else
        d.run();
  };
  return o && o(K), d = new Qn(p), d.scheduler = l ? () => l(K, !1) : K, I = (P) => Hi(P, !1, d), E = d.onStop = () => {
    const P = rs.get(d);
    if (P) {
      if (f)
        f(P, 4);
      else
        for (const W of P) W();
      rs.delete(d);
    }
  }, t ? n ? K(!0) : M = d.run() : l ? l(K.bind(null, !0), !0) : d.run(), L.pause = d.pause.bind(d), L.resume = d.resume.bind(d), L.stop = L, L;
}
function it(e, t = 1 / 0, s) {
  if (t <= 0 || !G(e) || e.__v_skip || (s = s || /* @__PURE__ */ new Map(), (s.get(e) || 0) >= t))
    return e;
  if (s.set(e, t), t--, /* @__PURE__ */ he(e))
    it(e.value, t, s);
  else if (H(e))
    for (let n = 0; n < e.length; n++)
      it(e[n], t, s);
  else if (ns(e) || lt(e))
    e.forEach((n) => {
      it(n, t, s);
    });
  else if (qn(e)) {
    for (const n in e)
      it(e[n], t, s);
    for (const n of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, n) && it(e[n], t, s);
  }
  return e;
}
function qt(e, t, s, n) {
  try {
    return n ? e(...n) : e();
  } catch (r) {
    vs(r, t, s);
  }
}
function Me(e, t, s, n) {
  if (k(e)) {
    const r = qt(e, t, s, n);
    return r && Wn(r) && r.catch((i) => {
      vs(i, t, s);
    }), r;
  }
  if (H(e)) {
    const r = [];
    for (let i = 0; i < e.length; i++)
      r.push(Me(e[i], t, s, n));
    return r;
  }
}
function vs(e, t, s, n = !0) {
  const r = t ? t.vnode : null, { errorHandler: i, throwUnhandledErrorInProduction: l } = t && t.appContext.config || X;
  if (t) {
    let o = t.parent;
    const f = t.proxy, a = `https://vuejs.org/error-reference/#runtime-${s}`;
    for (; o; ) {
      const d = o.ec;
      if (d) {
        for (let p = 0; p < d.length; p++)
          if (d[p](e, f, a) === !1)
            return;
      }
      o = o.parent;
    }
    if (i) {
      Xe(), qt(i, null, 10, [
        e,
        f,
        a
      ]), Qe();
      return;
    }
  }
  Ki(e, s, r, n, l);
}
function Ki(e, t, s, n = !0, r = !1) {
  if (r)
    throw e;
  console.error(e);
}
const ge = [];
let je = -1;
const Ct = [];
let rt = null, St = 0;
const gr = /* @__PURE__ */ Promise.resolve();
let is = null;
function Ui(e) {
  const t = is || gr;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Vi(e) {
  let t = je + 1, s = ge.length;
  for (; t < s; ) {
    const n = t + s >>> 1, r = ge[n], i = Ut(r);
    i < e || i === e && r.flags & 2 ? t = n + 1 : s = n;
  }
  return t;
}
function sn(e) {
  if (!(e.flags & 1)) {
    const t = Ut(e), s = ge[ge.length - 1];
    !s || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Ut(s) ? ge.push(e) : ge.splice(Vi(t), 0, e), e.flags |= 1, mr();
  }
}
function mr() {
  is || (is = gr.then(vr));
}
function Bi(e) {
  if (!H(e))
    rt && e.id === -1 ? rt.splice(St + 1, 0, e) : e.flags & 1 || (Ct.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      Ct.push(e[t]);
  mr();
}
function vn(e, t, s = je + 1) {
  for (; s < ge.length; s++) {
    const n = ge[s];
    if (n && n.flags & 2) {
      if (e && n.id !== e.uid)
        continue;
      ge.splice(s, 1), s--, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
    }
  }
}
function yr(e) {
  if (Ct.length) {
    const t = [...new Set(Ct)].sort(
      (s, n) => Ut(s) - Ut(n)
    );
    if (Ct.length = 0, rt) {
      for (let s = 0; s < t.length; s++)
        rt.push(t[s]);
      return;
    }
    for (rt = t, St = 0; St < rt.length; St++) {
      const s = rt[St];
      s.flags & 4 && (s.flags &= -2), s.flags & 8 || s(), s.flags &= -2;
    }
    rt = null, St = 0;
  }
}
const Ut = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function vr(e) {
  try {
    for (je = 0; je < ge.length; je++) {
      const t = ge[je];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), qt(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; je < ge.length; je++) {
      const t = ge[je];
      t && (t.flags &= -2);
    }
    je = -1, ge.length = 0, yr(), is = null, (ge.length || Ct.length) && vr();
  }
}
let Ue = null, _r = null;
function ls(e) {
  const t = Ue;
  return Ue = e, _r = e && e.type.__scopeId || null, t;
}
function Wi(e, t = Ue, s) {
  if (!t || e._n)
    return e;
  const n = (...r) => {
    n._d && Mn(-1);
    const i = ls(t), l = gt.length;
    let o;
    try {
      o = e(...r);
    } finally {
      for (let f = gt.length; f > l; f--) Jr();
      ls(i), n._d && Mn(1);
    }
    return o;
  };
  return n._n = !0, n._c = !0, n._d = !0, n;
}
function ut(e, t, s, n) {
  const r = e.dirs, i = t && t.dirs;
  for (let l = 0; l < r.length; l++) {
    const o = r[l];
    i && (o.oldValue = i[l].value);
    let f = o.dir[n];
    f && (Xe(), Me(f, s, 8, [
      e.el,
      o,
      e,
      t
    ]), Qe());
  }
}
function Ji(e, t) {
  if (me) {
    let s = me.provides;
    const n = me.parent && me.parent.provides;
    n === s && (s = me.provides = Object.create(n)), s[e] = t;
  }
}
function es(e, t, s = !1) {
  const n = Bl();
  if (n || Tt) {
    let r = Tt ? Tt._context.provides : n ? n.parent == null || n.ce ? n.vnode.appContext && n.vnode.appContext.provides : n.parent.provides : void 0;
    if (r && e in r)
      return r[e];
    if (arguments.length > 1)
      return s && k(t) ? t.call(n && n.proxy) : t;
  }
}
const qi = /* @__PURE__ */ Symbol.for("v-scx"), Gi = () => es(qi);
function Ms(e, t, s) {
  return br(e, t, s);
}
function br(e, t, s = X) {
  const { immediate: n, deep: r, flush: i, once: l } = s, o = ce({}, s), f = t && n || !t && i !== "post";
  let a;
  if (Wt) {
    if (i === "sync") {
      const I = Gi();
      a = I.__watcherHandles || (I.__watcherHandles = []);
    } else if (!f) {
      const I = () => {
      };
      return I.stop = Ve, I.resume = Ve, I.pause = Ve, I;
    }
  }
  const d = me;
  o.call = (I, $, _) => Me(I, d, $, _);
  let p = !1;
  i === "post" ? o.scheduler = (I) => {
    ve(I, d && d.suspense);
  } : i !== "sync" && (p = !0, o.scheduler = (I, $) => {
    $ ? I() : sn(I);
  }), o.augmentJob = (I) => {
    t && (I.flags |= 4), p && (I.flags |= 2, d && (I.id = d.uid, I.i = d));
  };
  const E = ki(e, t, o);
  return Wt && (a ? a.push(E) : f && E()), E;
}
function zi(e, t, s) {
  const n = this.proxy, r = te(e) ? e.includes(".") ? xr(n, e) : () => n[e] : e.bind(n, n);
  let i;
  k(t) ? i = t : (i = t.handler, s = t);
  const l = Gt(this), o = br(r, i.bind(n), s);
  return l(), o;
}
function xr(e, t) {
  const s = t.split(".");
  return () => {
    let n = e;
    for (let r = 0; r < s.length && n; r++)
      n = n[s[r]];
    return n;
  };
}
const Yi = /* @__PURE__ */ Symbol("_vte"), _s = (e) => e.__isTeleport, Is = /* @__PURE__ */ Symbol("_leaveCb");
function Zi(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const s of e)
      if (s.type !== et) {
        t = s;
        break;
      }
  }
  return t;
}
function wr(e) {
  if (!rn(e))
    return _s(e.type) && e.children ? Zi(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: s } = e;
  if (s) {
    if (t & 16)
      return s[0];
    if (t & 32 && k(s.default))
      return s.default();
  }
}
function nn(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const s = e.component.subTree;
    nn(
      _s(s.type) && wr(s) || s,
      t
    );
  } else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function Sr(e, t) {
  return k(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    ce({ name: e.name }, t, { setup: e })
  ) : e;
}
function Cr(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function _n(e, t) {
  let s;
  return !!((s = Object.getOwnPropertyDescriptor(e, t)) && !s.configurable);
}
const os = /* @__PURE__ */ new WeakMap();
function jt(e, t, s, n, r = !1) {
  if (H(e)) {
    e.forEach(
      (_, x) => jt(
        _,
        t && (H(t) ? t[x] : t),
        s,
        n,
        r
      )
    );
    return;
  }
  if (Dt(n) && !r) {
    n.shapeFlag & 512 && n.type.__asyncResolved && n.component.subTree.component && jt(e, t, s, n.component.subTree);
    return;
  }
  const i = n.shapeFlag & 4 ? cn(n.component) : n.el, l = r ? null : i, { i: o, r: f } = e, a = t && t.r, d = o.refs === X ? o.refs = {} : o.refs, p = o.setupState, E = /* @__PURE__ */ V(p), I = p === X ? Bn : (_) => _n(d, _) ? !1 : B(E, _), $ = (_, x) => !(x && _n(d, x));
  if (a != null && a !== f) {
    if (bn(t), te(a))
      d[a] = null, I(a) && (p[a] = null);
    else if (/* @__PURE__ */ he(a)) {
      const _ = t;
      $(a, _.k) && (a.value = null), _.k && (d[_.k] = null);
    }
  }
  if (k(f))
    qt(f, o, 12, [l, d]);
  else {
    const _ = te(f), x = /* @__PURE__ */ he(f);
    if (_ || x) {
      const L = () => {
        if (e.f) {
          const M = _ ? I(f) ? p[f] : d[f] : $() || !e.k ? f.value : d[e.k];
          if (r)
            H(M) && Js(M, i);
          else if (H(M))
            M.includes(i) || M.push(i);
          else if (_)
            d[f] = [i], I(f) && (p[f] = d[f]);
          else {
            const K = [i];
            $(f, e.k) && (f.value = K), e.k && (d[e.k] = K);
          }
        } else _ ? (d[f] = l, I(f) && (p[f] = l)) : x && ($(f, e.k) && (f.value = l), e.k && (d[e.k] = l));
      };
      if (l) {
        const M = () => {
          L(), os.delete(e);
        };
        M.id = -1, os.set(e, M), ve(M, s);
      } else
        bn(e), L();
    }
  }
}
function bn(e) {
  const t = os.get(e);
  t && (t.flags |= 8, os.delete(e));
}
ps().requestIdleCallback;
ps().cancelIdleCallback;
const Dt = (e) => !!e.type.__asyncLoader, rn = (e) => e.type.__isKeepAlive;
function Xi(e, t) {
  Tr(e, "a", t);
}
function Qi(e, t) {
  Tr(e, "da", t);
}
function Tr(e, t, s = me) {
  const n = e.__wdc || (e.__wdc = () => {
    let r = s;
    for (; r; ) {
      if (r.isDeactivated)
        return;
      r = r.parent;
    }
    return e();
  });
  if (bs(t, n, s), s) {
    let r = s.parent;
    for (; r && r.parent; )
      rn(r.parent.vnode) && el(n, t, s, r), r = r.parent;
  }
}
function el(e, t, s, n) {
  const r = bs(
    t,
    e,
    n,
    !0
    /* prepend */
  );
  Ar(() => {
    Js(n[t], r);
  }, s);
}
function bs(e, t, s = me, n = !1) {
  if (s) {
    const r = s[e] || (s[e] = []), i = t.__weh || (t.__weh = (...l) => {
      Xe();
      const o = Gt(s), f = Me(t, s, e, l);
      return o(), Qe(), f;
    });
    return n ? r.unshift(i) : r.push(i), i;
  }
}
const tt = (e) => (t, s = me) => {
  (!Wt || e === "sp") && bs(e, (...n) => t(...n), s);
}, tl = tt("bm"), Or = tt("m"), sl = tt(
  "bu"
), nl = tt("u"), Er = tt(
  "bum"
), Ar = tt("um"), rl = tt(
  "sp"
), il = tt("rtg"), ll = tt("rtc");
function ol(e, t = me) {
  bs("ec", e, t);
}
const cl = /* @__PURE__ */ Symbol.for("v-ndc");
function nt(e, t, s, n) {
  let r;
  const i = s, l = H(e);
  if (l || te(e)) {
    const o = l && /* @__PURE__ */ ot(e);
    let f = !1, a = !1;
    o && (f = !/* @__PURE__ */ Se(e), a = /* @__PURE__ */ We(e), e = ys(e)), r = new Array(e.length);
    for (let d = 0, p = e.length; d < p; d++)
      r[d] = t(
        f ? a ? ct(Ce(e[d])) : Ce(e[d]) : e[d],
        d,
        void 0,
        i
      );
  } else if (typeof e == "number") {
    r = new Array(e);
    for (let o = 0; o < e; o++)
      r[o] = t(o + 1, o, void 0, i);
  } else if (G(e))
    if (e[Symbol.iterator])
      r = Array.from(
        e,
        (o, f) => t(o, f, void 0, i)
      );
    else {
      const o = Object.keys(e);
      r = new Array(o.length);
      for (let f = 0, a = o.length; f < a; f++) {
        const d = o[f];
        r[f] = t(e[d], d, f, i);
      }
    }
  else
    r = [];
  return r;
}
const ks = (e) => e ? Yr(e) ? cn(e) : ks(e.parent) : null, Ht = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ ce(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => ks(e.parent),
    $root: (e) => ks(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => Ir(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      sn(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = Ui.bind(e.proxy)),
    $watch: (e) => zi.bind(e)
  })
), Ps = (e, t) => e !== X && !e.__isScriptSetup && B(e, t), fl = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: s, setupState: n, data: r, props: i, accessCache: l, type: o, appContext: f } = e;
    if (t[0] !== "$") {
      const E = l[t];
      if (E !== void 0)
        switch (E) {
          case 1:
            return n[t];
          case 2:
            return r[t];
          case 4:
            return s[t];
          case 3:
            return i[t];
        }
      else {
        if (Ps(n, t))
          return l[t] = 1, n[t];
        if (r !== X && B(r, t))
          return l[t] = 2, r[t];
        if (B(i, t))
          return l[t] = 3, i[t];
        if (s !== X && B(s, t))
          return l[t] = 4, s[t];
        Ks && (l[t] = 0);
      }
    }
    const a = Ht[t];
    let d, p;
    if (a)
      return t === "$attrs" && de(e.attrs, "get", ""), a(e);
    if (
      // css module (injected by vue-loader)
      (d = o.__cssModules) && (d = d[t])
    )
      return d;
    if (s !== X && B(s, t))
      return l[t] = 4, s[t];
    if (
      // global properties
      p = f.config.globalProperties, B(p, t)
    )
      return p[t];
  },
  set({ _: e }, t, s) {
    const { data: n, setupState: r, ctx: i } = e;
    return Ps(r, t) ? (r[t] = s, !0) : n !== X && B(n, t) ? (n[t] = s, !0) : B(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (i[t] = s, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: s, ctx: n, appContext: r, props: i, type: l }
  }, o) {
    let f;
    return !!(s[o] || e !== X && o[0] !== "$" && B(e, o) || Ps(t, o) || B(i, o) || B(n, o) || B(Ht, o) || B(r.config.globalProperties, o) || (f = l.__cssModules) && f[o]);
  },
  defineProperty(e, t, s) {
    return s.get != null ? e._.accessCache[t] = 0 : B(s, "value") && this.set(e, t, s.value, null), Reflect.defineProperty(e, t, s);
  }
};
function xn(e) {
  return H(e) ? e.reduce(
    (t, s) => (t[s] = null, t),
    {}
  ) : e;
}
let Ks = !0;
function ul(e) {
  const t = Ir(e), s = e.proxy, n = e.ctx;
  Ks = !1, t.beforeCreate && wn(t.beforeCreate, e, "bc");
  const {
    // state
    data: r,
    computed: i,
    methods: l,
    watch: o,
    provide: f,
    inject: a,
    // lifecycle
    created: d,
    beforeMount: p,
    mounted: E,
    beforeUpdate: I,
    updated: $,
    activated: _,
    deactivated: x,
    beforeDestroy: L,
    beforeUnmount: M,
    destroyed: K,
    unmounted: P,
    render: W,
    renderTracked: ne,
    renderTriggered: fe,
    errorCaptured: we,
    serverPrefetch: st,
    // public API
    expose: Je,
    inheritAttrs: Te,
    // assets
    components: mt,
    directives: yt,
    filters: At
  } = t;
  if (a && al(a, n, null), l)
    for (const z in l) {
      const J = l[z];
      k(J) && (n[z] = J.bind(s));
    }
  if (r) {
    const z = r.call(s, s);
    G(z) && (e.data = /* @__PURE__ */ Qs(z));
  }
  if (Ks = !0, i)
    for (const z in i) {
      const J = i[z], Ie = k(J) ? J.bind(s, s) : k(J.get) ? J.get.bind(s, s) : Ve, vt = !k(J) && k(J.set) ? J.set.bind(s) : Ve, qe = De({
        get: Ie,
        set: vt
      });
      Object.defineProperty(n, z, {
        enumerable: !0,
        configurable: !0,
        get: () => qe.value,
        set: (ye) => qe.value = ye
      });
    }
  if (o)
    for (const z in o)
      Mr(o[z], n, s, z);
  if (f) {
    const z = k(f) ? f.call(s) : f;
    Reflect.ownKeys(z).forEach((J) => {
      Ji(J, z[J]);
    });
  }
  d && wn(d, e, "c");
  function re(z, J) {
    H(J) ? J.forEach((Ie) => z(Ie.bind(s))) : J && z(J.bind(s));
  }
  if (re(tl, p), re(Or, E), re(sl, I), re(nl, $), re(Xi, _), re(Qi, x), re(ol, we), re(ll, ne), re(il, fe), re(Er, M), re(Ar, P), re(rl, st), H(Je))
    if (Je.length) {
      const z = e.exposed || (e.exposed = {});
      Je.forEach((J) => {
        Object.defineProperty(z, J, {
          get: () => s[J],
          set: (Ie) => s[J] = Ie,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  W && e.render === Ve && (e.render = W), Te != null && (e.inheritAttrs = Te), mt && (e.components = mt), yt && (e.directives = yt), st && Cr(e);
}
function al(e, t, s = Ve) {
  H(e) && (e = Us(e));
  for (const n in e) {
    const r = e[n];
    let i;
    G(r) ? "default" in r ? i = es(
      r.from || n,
      r.default,
      !0
    ) : i = es(r.from || n) : i = es(r), /* @__PURE__ */ he(i) ? Object.defineProperty(t, n, {
      enumerable: !0,
      configurable: !0,
      get: () => i.value,
      set: (l) => i.value = l
    }) : t[n] = i;
  }
}
function wn(e, t, s) {
  Me(
    H(e) ? e.map((n) => n.bind(t.proxy)) : e.bind(t.proxy),
    t,
    s
  );
}
function Mr(e, t, s, n) {
  let r = n.includes(".") ? xr(s, n) : () => s[n];
  if (te(e)) {
    const i = t[e];
    k(i) && Ms(r, i);
  } else if (k(e))
    Ms(r, e.bind(s));
  else if (G(e))
    if (H(e))
      e.forEach((i) => Mr(i, t, s, n));
    else {
      const i = k(e.handler) ? e.handler.bind(s) : t[e.handler];
      k(i) && Ms(r, i, e);
    }
}
function Ir(e) {
  const t = e.type, { mixins: s, extends: n } = t, {
    mixins: r,
    optionsCache: i,
    config: { optionMergeStrategies: l }
  } = e.appContext, o = i.get(t);
  let f;
  return o ? f = o : !r.length && !s && !n ? f = t : (f = {}, r.length && r.forEach(
    (a) => cs(f, a, l, !0)
  ), cs(f, t, l)), G(t) && i.set(t, f), f;
}
function cs(e, t, s, n = !1) {
  const { mixins: r, extends: i } = t;
  i && cs(e, i, s, !0), r && r.forEach(
    (l) => cs(e, l, s, !0)
  );
  for (const l in t)
    if (!(n && l === "expose")) {
      const o = dl[l] || s && s[l];
      e[l] = o ? o(e[l], t[l]) : t[l];
    }
  return e;
}
const dl = {
  data: Sn,
  props: Cn,
  emits: Cn,
  // objects
  methods: $t,
  computed: $t,
  // lifecycle
  beforeCreate: pe,
  created: pe,
  beforeMount: pe,
  mounted: pe,
  beforeUpdate: pe,
  updated: pe,
  beforeDestroy: pe,
  beforeUnmount: pe,
  destroyed: pe,
  unmounted: pe,
  activated: pe,
  deactivated: pe,
  errorCaptured: pe,
  serverPrefetch: pe,
  // assets
  components: $t,
  directives: $t,
  // watch
  watch: pl,
  // provide / inject
  provide: Sn,
  inject: hl
};
function Sn(e, t) {
  return t ? e ? function() {
    return ce(
      k(e) ? e.call(this, this) : e,
      k(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function hl(e, t) {
  return $t(Us(e), Us(t));
}
function Us(e) {
  if (H(e)) {
    const t = {};
    for (let s = 0; s < e.length; s++)
      t[e[s]] = e[s];
    return t;
  }
  return e;
}
function pe(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function $t(e, t) {
  return e ? ce(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Cn(e, t) {
  return e ? H(e) && H(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : ce(
    /* @__PURE__ */ Object.create(null),
    xn(e),
    xn(t ?? {})
  ) : t;
}
function pl(e, t) {
  if (!e) return t;
  if (!t) return e;
  const s = ce(/* @__PURE__ */ Object.create(null), e);
  for (const n in t)
    s[n] = pe(e[n], t[n]);
  return s;
}
function Pr() {
  return {
    app: null,
    config: {
      isNativeTag: Bn,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let gl = 0;
function ml(e, t) {
  return function(n, r = null) {
    k(n) || (n = ce({}, n)), r != null && !G(r) && (r = null);
    const i = Pr(), l = /* @__PURE__ */ new WeakSet(), o = [];
    let f = !1;
    const a = i.app = {
      _uid: gl++,
      _component: n,
      _props: r,
      _container: null,
      _context: i,
      _instance: null,
      version: Yl,
      get config() {
        return i.config;
      },
      set config(d) {
      },
      use(d, ...p) {
        return l.has(d) || (d && k(d.install) ? (l.add(d), d.install(a, ...p)) : k(d) && (l.add(d), d(a, ...p))), a;
      },
      mixin(d) {
        return i.mixins.includes(d) || i.mixins.push(d), a;
      },
      component(d, p) {
        return p ? (i.components[d] = p, a) : i.components[d];
      },
      directive(d, p) {
        return p ? (i.directives[d] = p, a) : i.directives[d];
      },
      mount(d, p, E) {
        if (!f) {
          const I = a._ceVNode || Ae(n, r);
          return I.appContext = i, E === !0 ? E = "svg" : E === !1 && (E = void 0), e(I, d, E), f = !0, a._container = d, d.__vue_app__ = a, cn(I.component);
        }
      },
      onUnmount(d) {
        o.push(d);
      },
      unmount() {
        f && (Me(
          o,
          a._instance,
          16
        ), e(null, a._container), delete a._container.__vue_app__);
      },
      provide(d, p) {
        return i.provides[d] = p, a;
      },
      runWithContext(d) {
        const p = Tt;
        Tt = a;
        try {
          return d();
        } finally {
          Tt = p;
        }
      }
    };
    return a;
  };
}
let Tt = null;
const yl = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Oe(t)}Modifiers`] || e[`${ft(t)}Modifiers`];
function vl(e, t, ...s) {
  if (e.isUnmounted) return;
  const n = e.vnode.props || X;
  let r = s;
  const i = t.startsWith("update:"), l = i && yl(n, t.slice(7));
  l && (l.trim && (r = s.map((d) => te(d) ? d.trim() : d)), l.number && (r = r.map(ri)));
  let o, f = n[o = Ss(t)] || // also try camelCase event handler (#2249)
  n[o = Ss(Oe(t))];
  !f && i && (f = n[o = Ss(ft(t))]), f && Me(
    f,
    e,
    6,
    r
  );
  const a = n[o + "Once"];
  if (a) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[o])
      return;
    e.emitted[o] = !0, Me(
      a,
      e,
      6,
      r
    );
  }
}
const _l = /* @__PURE__ */ new WeakMap();
function $r(e, t, s = !1) {
  const n = s ? _l : t.emitsCache, r = n.get(e);
  if (r !== void 0)
    return r;
  const i = e.emits;
  let l = {}, o = !1;
  if (!k(e)) {
    const f = (a) => {
      const d = $r(a, t, !0);
      d && (o = !0, ce(l, d));
    };
    !s && t.mixins.length && t.mixins.forEach(f), e.extends && f(e.extends), e.mixins && e.mixins.forEach(f);
  }
  return !i && !o ? (G(e) && n.set(e, null), null) : (H(i) ? i.forEach((f) => l[f] = null) : ce(l, i), G(e) && n.set(e, l), l);
}
function xs(e, t) {
  return !e || !as(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), B(e, t[0].toLowerCase() + t.slice(1)) || B(e, ft(t)) || B(e, t));
}
function Tn(e) {
  const {
    type: t,
    vnode: s,
    proxy: n,
    withProxy: r,
    propsOptions: [i],
    slots: l,
    attrs: o,
    emit: f,
    render: a,
    renderCache: d,
    props: p,
    data: E,
    setupState: I,
    ctx: $,
    inheritAttrs: _
  } = e, x = ls(e);
  let L, M;
  try {
    if (s.shapeFlag & 4) {
      const P = r || n, W = P;
      L = ke(
        a.call(
          W,
          P,
          d,
          p,
          I,
          E,
          $
        )
      ), M = o;
    } else {
      const P = t;
      L = ke(
        P.length > 1 ? P(
          p,
          { attrs: o, slots: l, emit: f }
        ) : P(
          p,
          null
        )
      ), M = t.props ? o : bl(o);
    }
  } catch (P) {
    gt.length = 0, vs(P, e, 1), L = Ae(et);
  }
  let K = L;
  if (M && _ !== !1) {
    const P = Object.keys(M), { shapeFlag: W } = K;
    P.length && W & 7 && (i && P.some(ds) && (M = xl(
      M,
      i
    )), K = Et(K, M, !1, !0));
  }
  if (s.dirs && (K = Et(K, null, !1, !0), K.dirs = K.dirs ? K.dirs.concat(s.dirs) : s.dirs), s.transition) {
    const P = _s(K.type) && wr(K) || K;
    nn(P, s.transition);
  }
  return L = K, ls(x), L;
}
const bl = (e) => {
  let t;
  for (const s in e)
    (s === "class" || s === "style" || as(s)) && ((t || (t = {}))[s] = e[s]);
  return t;
}, xl = (e, t) => {
  const s = {};
  for (const n in e)
    (!ds(n) || !(n.slice(9) in t)) && (s[n] = e[n]);
  return s;
};
function wl(e, t, s) {
  const { props: n, children: r, component: i } = e, { props: l, children: o, patchFlag: f } = t, a = i.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (s && f >= 0) {
    if (f & 1024)
      return !0;
    if (f & 16)
      return n ? On(n, l, a) : !!l;
    if (f & 8) {
      const d = t.dynamicProps;
      for (let p = 0; p < d.length; p++) {
        const E = d[p];
        if (Rr(l, n, E) && !xs(a, E))
          return !0;
      }
    }
  } else
    return (r || o) && (!o || !o.$stable) ? !0 : n === l ? !1 : n ? l ? On(n, l, a) : !0 : !!l;
  return !1;
}
function On(e, t, s) {
  const n = Object.keys(t);
  if (n.length !== Object.keys(e).length)
    return !0;
  for (let r = 0; r < n.length; r++) {
    const i = n[r];
    if (Rr(t, e, i) && !xs(s, i))
      return !0;
  }
  return !1;
}
function Rr(e, t, s) {
  const n = e[s], r = t[s];
  return s === "style" && G(n) && G(r) ? !ms(n, r) : n !== r;
}
function Sl({ vnode: e, parent: t, suspense: s }, n) {
  for (; t; ) {
    const r = t.subTree;
    if (r.suspense && r.suspense.activeBranch === e && (r.suspense.vnode.el = r.el = n, e = r), r === e)
      (e = t.vnode).el = n, t = t.parent;
    else
      break;
  }
  s && s.activeBranch === e && (s.vnode.el = n);
}
const Lr = {}, Fr = () => Object.create(Lr), Nr = (e) => Object.getPrototypeOf(e) === Lr;
function Cl(e, t, s, n = !1) {
  const r = {}, i = Fr();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), jr(e, t, r, i);
  for (const l in e.propsOptions[0])
    l in r || (r[l] = void 0);
  s ? e.props = n ? r : /* @__PURE__ */ $i(r) : e.type.props ? e.props = r : e.props = i, e.attrs = i;
}
function Tl(e, t, s, n) {
  const {
    props: r,
    attrs: i,
    vnode: { patchFlag: l }
  } = e, o = /* @__PURE__ */ V(r), [f] = e.propsOptions;
  let a = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (n || l > 0) && !(l & 16)
  ) {
    if (l & 8) {
      const d = e.vnode.dynamicProps;
      for (let p = 0; p < d.length; p++) {
        let E = d[p];
        if (xs(e.emitsOptions, E))
          continue;
        const I = t[E];
        if (f)
          if (B(i, E))
            I !== i[E] && (i[E] = I, a = !0);
          else {
            const $ = Oe(E);
            r[$] = Vs(
              f,
              o,
              $,
              I,
              e,
              !1
            );
          }
        else
          I !== i[E] && (i[E] = I, a = !0);
      }
    }
  } else {
    jr(e, t, r, i) && (a = !0);
    let d;
    for (const p in o)
      (!t || // for camelCase
      !B(t, p) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((d = ft(p)) === p || !B(t, d))) && (f ? s && // for camelCase
      (s[p] !== void 0 || // for kebab-case
      s[d] !== void 0) && (r[p] = Vs(
        f,
        o,
        p,
        void 0,
        e,
        !0
      )) : delete r[p]);
    if (i !== o)
      for (const p in i)
        (!t || !B(t, p)) && (delete i[p], a = !0);
  }
  a && Ze(e.attrs, "set", "");
}
function jr(e, t, s, n) {
  const [r, i] = e.propsOptions;
  let l = !1, o;
  if (t)
    for (let f in t) {
      if (Lt(f))
        continue;
      const a = t[f];
      let d;
      r && B(r, d = Oe(f)) ? !i || !i.includes(d) ? s[d] = a : (o || (o = {}))[d] = a : xs(e.emitsOptions, f) || (!(f in n) || a !== n[f]) && (n[f] = a, l = !0);
    }
  if (i) {
    const f = /* @__PURE__ */ V(s), a = o || X;
    for (let d = 0; d < i.length; d++) {
      const p = i[d];
      s[p] = Vs(
        r,
        f,
        p,
        a[p],
        e,
        !B(a, p)
      );
    }
  }
  return l;
}
function Vs(e, t, s, n, r, i) {
  const l = e[s];
  if (l != null) {
    const o = B(l, "default");
    if (o && n === void 0) {
      const f = l.default;
      if (l.type !== Function && !l.skipFactory && k(f)) {
        const { propsDefaults: a } = r;
        if (s in a)
          n = a[s];
        else {
          const d = Gt(r);
          n = a[s] = f.call(
            null,
            t
          ), d();
        }
      } else
        n = f;
      r.ce && r.ce._setProp(s, n);
    }
    l[
      0
      /* shouldCast */
    ] && (i && !o ? n = !1 : l[
      1
      /* shouldCastTrue */
    ] && (n === "" || n === ft(s)) && (n = !0));
  }
  return n;
}
const Ol = /* @__PURE__ */ new WeakMap();
function Dr(e, t, s = !1) {
  const n = s ? Ol : t.propsCache, r = n.get(e);
  if (r)
    return r;
  const i = e.props, l = {}, o = [];
  let f = !1;
  if (!k(e)) {
    const d = (p) => {
      f = !0;
      const [E, I] = Dr(p, t, !0);
      ce(l, E), I && o.push(...I);
    };
    !s && t.mixins.length && t.mixins.forEach(d), e.extends && d(e.extends), e.mixins && e.mixins.forEach(d);
  }
  if (!i && !f)
    return G(e) && n.set(e, ht), ht;
  if (H(i))
    for (let d = 0; d < i.length; d++) {
      const p = Oe(i[d]);
      En(p) && (l[p] = X);
    }
  else if (i)
    for (const d in i) {
      const p = Oe(d);
      if (En(p)) {
        const E = i[d], I = l[p] = H(E) || k(E) ? { type: E } : ce({}, E), $ = I.type;
        let _ = !1, x = !0;
        if (H($))
          for (let L = 0; L < $.length; ++L) {
            const M = $[L], K = k(M) && M.name;
            if (K === "Boolean") {
              _ = !0;
              break;
            } else K === "String" && (x = !1);
          }
        else
          _ = k($) && $.name === "Boolean";
        I[
          0
          /* shouldCast */
        ] = _, I[
          1
          /* shouldCastTrue */
        ] = x, (_ || B(I, "default")) && o.push(p);
      }
    }
  const a = [l, o];
  return G(e) && n.set(e, a), a;
}
function En(e) {
  return e[0] !== "$" && !Lt(e);
}
const ln = (e) => e === "_" || e === "_ctx" || e === "$stable", on = (e) => H(e) ? e.map(ke) : [ke(e)], El = (e, t, s) => {
  if (t._n)
    return t;
  const n = Wi((...r) => on(t(...r)), s);
  return n._c = !1, n;
}, Hr = (e, t, s) => {
  const n = e._ctx;
  for (const r in e) {
    if (ln(r)) continue;
    const i = e[r];
    if (k(i))
      t[r] = El(r, i, n);
    else if (i != null) {
      const l = on(i);
      t[r] = () => l;
    }
  }
}, kr = (e, t) => {
  const s = on(t);
  e.slots.default = () => s;
}, Kr = (e, t, s) => {
  for (const n in t)
    (s || !ln(n)) && (e[n] = t[n]);
}, Al = (e, t, s) => {
  const n = e.slots = Fr();
  if (e.vnode.shapeFlag & 32) {
    const r = t._;
    r ? (Kr(n, t, s), s && zn(n, "_", r, !0)) : Hr(t, n);
  } else t && kr(e, t);
}, Ml = (e, t, s) => {
  const { vnode: n, slots: r } = e;
  let i = !0, l = X;
  if (n.shapeFlag & 32) {
    const o = t._;
    o ? s && o === 1 ? i = !1 : Kr(r, t, s) : (i = !t.$stable, Hr(t, r)), l = t;
  } else t && (kr(e, t), l = { default: 1 });
  if (i)
    for (const o in r)
      !ln(o) && l[o] == null && delete r[o];
}, ve = Ll;
function Il(e) {
  return Pl(e);
}
function Pl(e, t) {
  const s = ps();
  s.__VUE__ = !0;
  const {
    insert: n,
    remove: r,
    patchProp: i,
    createElement: l,
    createText: o,
    createComment: f,
    setText: a,
    setElementText: d,
    parentNode: p,
    nextSibling: E,
    setScopeId: I = Ve,
    insertStaticContent: $
  } = e, _ = (c, u, h, v = null, g = null, y = null, O = void 0, T = null, S = !!u.dynamicChildren) => {
    if (c === u)
      return;
    c && !Pt(c, u) && (v = _e(c), ye(c, g, y, !0), c = null), u.patchFlag === -2 && (S = !1, u.dynamicChildren = null), u.dynamicChildren && c && c.dynamicChildren && c.dynamicChildren.hasOnce && (u.dynamicChildren === ht && (u.dynamicChildren = []), u.dynamicChildren.hasOnce = !0);
    const { type: m, ref: N, shapeFlag: A } = u;
    switch (m) {
      case ws:
        x(c, u, h, v);
        break;
      case et:
        L(c, u, h, v);
        break;
      case ts:
        c == null && M(u, h, v, O);
        break;
      case oe:
        mt(
          c,
          u,
          h,
          v,
          g,
          y,
          O,
          T,
          S
        );
        break;
      default:
        A & 1 ? W(
          c,
          u,
          h,
          v,
          g,
          y,
          O,
          T,
          S
        ) : A & 6 ? yt(
          c,
          u,
          h,
          v,
          g,
          y,
          O,
          T,
          S
        ) : (A & 64 || A & 128) && m.process(
          c,
          u,
          h,
          v,
          g,
          y,
          O,
          T,
          S,
          Pe
        );
    }
    N != null && g ? jt(N, c && c.ref, y, u || c, !u) : N == null && c && c.ref != null && jt(c.ref, null, y, c, !0);
  }, x = (c, u, h, v) => {
    if (c == null)
      n(
        u.el = o(u.children),
        h,
        v
      );
    else {
      const g = u.el = c.el;
      u.children !== c.children && a(g, u.children);
    }
  }, L = (c, u, h, v) => {
    c == null ? n(
      u.el = f(u.children || ""),
      h,
      v
    ) : u.el = c.el;
  }, M = (c, u, h, v) => {
    [c.el, c.anchor] = $(
      c.children,
      u,
      h,
      v,
      c.el,
      c.anchor
    );
  }, K = ({ el: c, anchor: u }, h, v) => {
    let g;
    for (; c && c !== u; )
      g = E(c), n(c, h, v), c = g;
    n(u, h, v);
  }, P = ({ el: c, anchor: u }) => {
    let h;
    for (; c && c !== u; )
      h = E(c), r(c), c = h;
    r(u);
  }, W = (c, u, h, v, g, y, O, T, S) => {
    if (u.type === "svg" ? O = "svg" : u.type === "math" && (O = "mathml"), c == null)
      ne(
        u,
        h,
        v,
        g,
        y,
        O,
        T,
        S
      );
    else {
      const m = c.el && c.el._isVueCE ? c.el : null;
      try {
        m && m._beginPatch(), st(
          c,
          u,
          g,
          y,
          O,
          T,
          S
        );
      } finally {
        m && m._endPatch();
      }
    }
  }, ne = (c, u, h, v, g, y, O, T) => {
    let S, m;
    const { props: N, shapeFlag: A, transition: F, dirs: j } = c;
    if (S = c.el = l(
      c.type,
      y,
      N && N.is,
      N
    ), A & 8 ? d(S, c.children) : A & 16 && we(
      c.children,
      S,
      null,
      v,
      g,
      $s(c, y),
      O,
      T
    ), j && ut(c, null, v, "created"), fe(S, c, c.scopeId, O, v), N) {
      for (const Y in N)
        Y !== "value" && !Lt(Y) && i(S, Y, null, N[Y], y, v);
      "value" in N && i(S, "value", null, N.value, y), (m = N.onVnodeBeforeMount) && Ne(m, v, c);
    }
    j && ut(c, null, v, "beforeMount");
    const U = $l(g, F);
    U && F.beforeEnter(S), n(S, u, h), ((m = N && N.onVnodeMounted) || U || j) && ve(() => {
      m && Ne(m, v, c), U && F.enter(S), j && ut(c, null, v, "mounted");
    }, g);
  }, fe = (c, u, h, v, g) => {
    if (h && I(c, h), v)
      for (let y = 0; y < v.length; y++)
        I(c, v[y]);
    if (g) {
      let y = g.subTree;
      if (u === y || Wr(y.type) && (y.ssContent === u || y.ssFallback === u)) {
        const O = g.vnode;
        fe(
          c,
          O,
          O.scopeId,
          O.slotScopeIds,
          g.parent
        );
      }
    }
  }, we = (c, u, h, v, g, y, O, T, S = 0) => {
    for (let m = S; m < c.length; m++) {
      const N = c[m] = T ? Ye(c[m]) : ke(c[m]);
      _(
        null,
        N,
        u,
        h,
        v,
        g,
        y,
        O,
        T
      );
    }
  }, st = (c, u, h, v, g, y, O) => {
    const T = u.el = c.el;
    let { patchFlag: S, dynamicChildren: m, dirs: N } = u;
    S |= c.patchFlag & 16;
    const A = c.props || X, F = u.props || X;
    let j;
    if (h && at(h, !1), (j = F.onVnodeBeforeUpdate) && Ne(j, h, u, c), N && ut(u, c, h, "beforeUpdate"), h && at(h, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    m && (!c.dynamicChildren || c.dynamicChildren.length !== m.length) && (S = 0, O = !1, m = null), (A.innerHTML && F.innerHTML == null || A.textContent && F.textContent == null) && d(T, ""), m ? Je(
      c.dynamicChildren,
      m,
      T,
      h,
      v,
      $s(u, g),
      y
    ) : O || J(
      c,
      u,
      T,
      null,
      h,
      v,
      $s(u, g),
      y,
      !1
    ), S > 0) {
      if (S & 16)
        Te(T, A, F, h, g);
      else if (S & 2 && A.class !== F.class && i(T, "class", null, F.class, g), S & 4 && i(T, "style", A.style, F.style, g), S & 8) {
        const U = u.dynamicProps;
        for (let Y = 0; Y < U.length; Y++) {
          const q = U[Y], se = A[q], ie = F[q];
          (ie !== se || q === "value") && i(T, q, se, ie, g, h);
        }
      }
      S & 1 && c.children !== u.children && d(T, u.children);
    } else !O && m == null && Te(T, A, F, h, g);
    ((j = F.onVnodeUpdated) || N) && ve(() => {
      j && Ne(j, h, u, c), N && ut(u, c, h, "updated");
    }, v);
  }, Je = (c, u, h, v, g, y, O) => {
    for (let T = 0; T < u.length; T++) {
      const S = c[T], m = u[T], N = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        S.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (S.type === oe || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Pt(S, m) || // - In the case of a component, it could contain anything.
        S.shapeFlag & 198) ? p(S.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          h
        )
      );
      _(
        S,
        m,
        N,
        null,
        v,
        g,
        y,
        O,
        !0
      );
    }
  }, Te = (c, u, h, v, g) => {
    if (u !== h) {
      if (u !== X)
        for (const y in u)
          !Lt(y) && !(y in h) && i(
            c,
            y,
            u[y],
            null,
            g,
            v
          );
      for (const y in h) {
        if (Lt(y)) continue;
        const O = h[y], T = u[y];
        O !== T && y !== "value" && i(c, y, T, O, g, v);
      }
      "value" in h && i(c, "value", u.value, h.value, g);
    }
  }, mt = (c, u, h, v, g, y, O, T, S) => {
    const m = u.el = c ? c.el : o(""), N = u.anchor = c ? c.anchor : o("");
    let { patchFlag: A, dynamicChildren: F, slotScopeIds: j } = u;
    j && (T = T ? T.concat(j) : j), c == null ? (n(m, h, v), n(N, h, v), we(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      u.children || [],
      h,
      N,
      g,
      y,
      O,
      T,
      S
    )) : A > 0 && A & 64 && F && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    c.dynamicChildren && c.dynamicChildren.length === F.length ? (Je(
      c.dynamicChildren,
      F,
      h,
      g,
      y,
      O,
      T
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (u.key != null || g && u === g.subTree) && Ur(
      c,
      u,
      !0
      /* shallow */
    )) : J(
      c,
      u,
      h,
      N,
      g,
      y,
      O,
      T,
      S
    );
  }, yt = (c, u, h, v, g, y, O, T, S) => {
    u.slotScopeIds = T, c == null ? u.shapeFlag & 512 ? g.ctx.activate(
      u,
      h,
      v,
      O,
      S
    ) : At(
      u,
      h,
      v,
      g,
      y,
      O,
      S
    ) : zt(c, u, S);
  }, At = (c, u, h, v, g, y, O) => {
    const T = c.component = Vl(
      c,
      v,
      g
    );
    if (rn(c) && (T.ctx.renderer = Pe), Wl(T, !1, O), T.asyncDep) {
      if (g && g.registerDep(T, re, O), !c.el) {
        const S = T.subTree = Ae(et);
        L(null, S, u, h), c.placeholder = S.el;
      }
    } else
      re(
        T,
        c,
        u,
        h,
        g,
        y,
        O
      );
  }, zt = (c, u, h) => {
    const v = u.component = c.component;
    if (wl(c, u, h))
      if (v.asyncDep && !v.asyncResolved) {
        u.el = c.el, z(v, u, h);
        return;
      } else
        v.next = u, v.update();
    else
      u.el = c.el, v.vnode = u;
  }, re = (c, u, h, v, g, y, O) => {
    const T = () => {
      if (c.isMounted) {
        let { next: A, bu: F, u: j, parent: U, vnode: Y } = c;
        {
          const Re = Vr(c);
          if (Re) {
            A && (A.el = Y.el, z(c, A, O)), Re.asyncDep.then(() => {
              ve(() => {
                c.isUnmounted || m();
              }, g);
            });
            return;
          }
        }
        let q = A, se;
        at(c, !1), A ? (A.el = Y.el, z(c, A, O)) : A = Y, F && Cs(F), (se = A.props && A.props.onVnodeBeforeUpdate) && Ne(se, U, A, Y), at(c, !0);
        const ie = Tn(c), $e = c.subTree;
        c.subTree = ie, _(
          $e,
          ie,
          // parent may have changed if it's in a teleport
          p($e.el),
          // anchor may have changed if it's in a fragment
          _e($e),
          c,
          g,
          y
        ), A.el = ie.el, q === null && Sl(c, ie.el), j && ve(j, g), (se = A.props && A.props.onVnodeUpdated) && ve(
          () => Ne(se, U, A, Y),
          g
        );
      } else {
        let A;
        const { el: F, props: j } = u, { bm: U, m: Y, parent: q, root: se, type: ie } = c, $e = Dt(u);
        at(c, !1), U && Cs(U), !$e && (A = j && j.onVnodeBeforeMount) && Ne(A, q, u), at(c, !0);
        {
          se.ce && se.ce._hasShadowRoot() && se.ce._injectChildStyle(
            ie,
            c.parent ? c.parent.type : void 0
          );
          const Re = c.subTree = Tn(c);
          _(
            null,
            Re,
            h,
            v,
            c,
            g,
            y
          ), u.el = Re.el;
        }
        if (Y && ve(Y, g), !$e && (A = j && j.onVnodeMounted)) {
          const Re = u;
          ve(
            () => Ne(A, q, Re),
            g
          );
        }
        (u.shapeFlag & 256 || q && Dt(q.vnode) && q.vnode.shapeFlag & 256) && c.a && ve(c.a, g), c.isMounted = !0, u = h = v = null;
      }
    };
    c.scope.on();
    const S = c.effect = new Qn(T);
    c.scope.off();
    const m = c.update = S.run.bind(S), N = c.job = S.runIfDirty.bind(S);
    N.i = c, N.id = c.uid, S.scheduler = () => sn(N), at(c, !0), m();
  }, z = (c, u, h) => {
    u.component = c;
    const v = c.vnode.props;
    c.vnode = u, c.next = null, Tl(c, u.props, v, h), Ml(c, u.children, h), Xe(), vn(c), Qe();
  }, J = (c, u, h, v, g, y, O, T, S = !1) => {
    const m = c && c.children, N = c ? c.shapeFlag : 0, A = u.children, { patchFlag: F, shapeFlag: j } = u;
    if (F > 0) {
      if (F & 128) {
        vt(
          m,
          A,
          h,
          v,
          g,
          y,
          O,
          T,
          S
        );
        return;
      } else if (F & 256) {
        Ie(
          m,
          A,
          h,
          v,
          g,
          y,
          O,
          T,
          S
        );
        return;
      }
    }
    j & 8 ? (N & 16 && D(m, g, y), A !== m && d(h, A)) : N & 16 ? j & 16 ? vt(
      m,
      A,
      h,
      v,
      g,
      y,
      O,
      T,
      S
    ) : D(m, g, y, !0) : (N & 8 && d(h, ""), j & 16 && we(
      A,
      h,
      v,
      g,
      y,
      O,
      T,
      S
    ));
  }, Ie = (c, u, h, v, g, y, O, T, S) => {
    c = c || ht, u = u || ht;
    const m = c.length, N = u.length, A = Math.min(m, N);
    let F;
    for (F = 0; F < A; F++) {
      const j = u[F] = S ? Ye(u[F]) : ke(u[F]);
      _(
        c[F],
        j,
        h,
        null,
        g,
        y,
        O,
        T,
        S
      );
    }
    m > N ? D(
      c,
      g,
      y,
      !0,
      !1,
      A
    ) : we(
      u,
      h,
      v,
      g,
      y,
      O,
      T,
      S,
      A
    );
  }, vt = (c, u, h, v, g, y, O, T, S) => {
    let m = 0;
    const N = u.length;
    let A = c.length - 1, F = N - 1;
    for (; m <= A && m <= F; ) {
      const j = c[m], U = u[m] = S ? Ye(u[m]) : ke(u[m]);
      if (Pt(j, U))
        _(
          j,
          U,
          h,
          null,
          g,
          y,
          O,
          T,
          S
        );
      else
        break;
      m++;
    }
    for (; m <= A && m <= F; ) {
      const j = c[A], U = u[F] = S ? Ye(u[F]) : ke(u[F]);
      if (Pt(j, U))
        _(
          j,
          U,
          h,
          null,
          g,
          y,
          O,
          T,
          S
        );
      else
        break;
      A--, F--;
    }
    if (m > A) {
      if (m <= F) {
        const j = F + 1, U = j < N ? u[j].el : v;
        for (; m <= F; )
          _(
            null,
            u[m] = S ? Ye(u[m]) : ke(u[m]),
            h,
            U,
            g,
            y,
            O,
            T,
            S
          ), m++;
      }
    } else if (m > F)
      for (; m <= A; )
        ye(c[m], g, y, !0), m++;
    else {
      const j = m, U = m, Y = /* @__PURE__ */ new Map();
      for (m = U; m <= F; m++) {
        const be = u[m] = S ? Ye(u[m]) : ke(u[m]);
        be.key != null && Y.set(be.key, m);
      }
      let q, se = 0;
      const ie = F - U + 1;
      let $e = !1, Re = 0;
      const Mt = new Array(ie);
      for (m = 0; m < ie; m++) Mt[m] = 0;
      for (m = j; m <= A; m++) {
        const be = c[m];
        if (se >= ie) {
          ye(be, g, y, !0);
          continue;
        }
        let Le;
        if (be.key != null)
          Le = Y.get(be.key);
        else
          for (q = U; q <= F; q++)
            if (Mt[q - U] === 0 && Pt(be, u[q])) {
              Le = q;
              break;
            }
        Le === void 0 ? ye(be, g, y, !0) : (Mt[Le - U] = m + 1, Le >= Re ? Re = Le : $e = !0, _(
          be,
          u[Le],
          h,
          null,
          g,
          y,
          O,
          T,
          S
        ), se++);
      }
      const fn = $e ? Rl(Mt) : ht;
      for (q = fn.length - 1, m = ie - 1; m >= 0; m--) {
        const be = U + m, Le = u[be], un = u[be + 1], an = be + 1 < N ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          un.el || Br(un)
        ) : v;
        Mt[m] === 0 ? _(
          null,
          Le,
          h,
          an,
          g,
          y,
          O,
          T,
          S
        ) : $e && (q < 0 || m !== fn[q] ? qe(Le, h, an, 2) : q--);
      }
    }
  }, qe = (c, u, h, v, g = null) => {
    const { el: y, type: O, transition: T, children: S, shapeFlag: m } = c;
    if (m & 6) {
      qe(c.component.subTree, u, h, v);
      return;
    }
    if (m & 128) {
      c.suspense.move(u, h, v);
      return;
    }
    if (m & 64) {
      O.move(c, u, h, Pe);
      return;
    }
    if (O === oe) {
      n(y, u, h);
      for (let A = 0; A < S.length; A++)
        qe(S[A], u, h, v);
      n(c.anchor, u, h);
      return;
    }
    if (O === ts) {
      K(c, u, h);
      return;
    }
    if (v !== 2 && m & 1 && T)
      if (v === 0)
        T.persisted && !y[Is] ? n(y, u, h) : (T.beforeEnter(y), n(y, u, h), ve(() => T.enter(y), g));
      else {
        const { leave: A, delayLeave: F, afterLeave: j } = T, U = () => {
          c.ctx.isUnmounted ? r(y) : n(y, u, h);
        }, Y = () => {
          const q = y._isLeaving || !!y[Is];
          y._isLeaving && y[Is](
            !0
            /* cancelled */
          ), T.persisted && !q ? U() : A(y, () => {
            U(), j && j();
          });
        };
        F ? F(y, U, Y) : Y();
      }
    else
      n(y, u, h);
  }, ye = (c, u, h, v = !1, g = !1) => {
    const {
      type: y,
      props: O,
      ref: T,
      children: S,
      dynamicChildren: m,
      shapeFlag: N,
      patchFlag: A,
      dirs: F,
      cacheIndex: j,
      memo: U
    } = c;
    if ((A === -2 || m && m.hasOnce) && (g = !1), T != null && (Xe(), jt(T, null, h, c, !0), Qe()), j != null && (!c.ctx || c.ctx === u) && (u.renderCache[j] = void 0), N & 256) {
      u.ctx.deactivate(c);
      return;
    }
    const Y = N & 1 && F, q = !Dt(c);
    let se;
    if (q && (se = O && O.onVnodeBeforeUnmount) && Ne(se, u, c), N & 6)
      b(c.component, h, v);
    else {
      if (N & 128) {
        c.suspense.unmount(h, v);
        return;
      }
      Y && ut(c, null, u, "beforeUnmount"), N & 64 ? c.type.remove(
        c,
        u,
        h,
        Pe,
        v
      ) : m && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !m.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (y !== oe || A > 0 && A & 64) ? D(
        m,
        u,
        h,
        !1,
        !0
      ) : (y === oe && A & 384 || !g && N & 16) && D(S, u, h), v && C(c);
    }
    const ie = U != null && j == null;
    (q && (se = O && O.onVnodeUnmounted) || Y || ie) && ve(() => {
      se && Ne(se, u, c), Y && ut(c, null, u, "unmounted"), ie && (c.el = null);
    }, h);
  }, C = (c) => {
    const { type: u, el: h, anchor: v, transition: g } = c;
    if (u === oe) {
      w(h, v);
      return;
    }
    if (u === ts) {
      P(c), g && !g.persisted && g.afterLeave && g.afterLeave();
      return;
    }
    const y = () => {
      r(h), g && !g.persisted && g.afterLeave && g.afterLeave();
    };
    if (c.shapeFlag & 1 && g && !g.persisted) {
      const { leave: O, delayLeave: T } = g, S = () => O(h, y);
      T ? T(c.el, y, S) : S();
    } else
      y();
  }, w = (c, u) => {
    let h;
    for (; c !== u; )
      h = E(c), r(c), c = h;
    r(u);
  }, b = (c, u, h) => {
    const { bum: v, scope: g, job: y, subTree: O, um: T, m: S, a: m } = c;
    An(S), An(m), v && Cs(v), g.stop(), y ? (y.flags |= 8, ye(O, c, u, h)) : c.vnode.el && O && (O.transition = c.vnode.transition, ye(O, c, u, h)), T && ve(T, u), ve(() => {
      c.isUnmounted = !0;
    }, u);
  }, D = (c, u, h, v = !1, g = !1, y = 0) => {
    for (let O = y; O < c.length; O++)
      ye(c[O], u, h, v, g);
  }, _e = (c) => {
    if (c.shapeFlag & 6)
      return _e(c.component.subTree);
    if (c.shapeFlag & 128)
      return c.suspense.next();
    const u = E(c.anchor || c.el), h = u && u[Yi];
    return h ? E(h) : u;
  };
  let ue = !1;
  const _t = (c, u, h) => {
    let v;
    c == null ? u._vnode && (ye(u._vnode, null, null, !0), v = u._vnode.component) : _(
      u._vnode || null,
      c,
      u,
      null,
      null,
      null,
      h
    ), u._vnode = c, ue || (ue = !0, vn(v), yr(), ue = !1);
  }, Pe = {
    p: _,
    um: ye,
    m: qe,
    r: C,
    mt: At,
    mc: we,
    pc: J,
    pbc: Je,
    n: _e,
    o: e
  };
  return {
    render: _t,
    hydrate: void 0,
    createApp: ml(_t)
  };
}
function $s({ type: e, props: t }, s) {
  return s === "svg" && e === "foreignObject" || s === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : s;
}
function at({ effect: e, job: t }, s) {
  s ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function $l(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Ur(e, t, s = !1) {
  const n = e.children, r = t.children;
  if (H(n) && H(r))
    for (let i = 0; i < n.length; i++) {
      const l = n[i];
      let o = r[i];
      o.shapeFlag & 1 && !o.dynamicChildren && ((o.patchFlag <= 0 || o.patchFlag === 32) && (o = r[i] = Ye(r[i]), o.el = l.el), !s && o.patchFlag !== -2 && Ur(l, o)), o.type === ws && (o.patchFlag === -1 && (o = r[i] = Ye(o)), o.el = l.el), o.type === et && !o.el && (o.el = l.el);
    }
}
function Rl(e) {
  const t = e.slice(), s = [0];
  let n, r, i, l, o;
  const f = e.length;
  for (n = 0; n < f; n++) {
    const a = e[n];
    if (a !== 0) {
      if (r = s[s.length - 1], e[r] < a) {
        t[n] = r, s.push(n);
        continue;
      }
      for (i = 0, l = s.length - 1; i < l; )
        o = i + l >> 1, e[s[o]] < a ? i = o + 1 : l = o;
      a < e[s[i]] && (i > 0 && (t[n] = s[i - 1]), s[i] = n);
    }
  }
  for (i = s.length, l = s[i - 1]; i-- > 0; )
    s[i] = l, l = t[l];
  return s;
}
function Vr(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : Vr(t);
}
function An(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function Br(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  return t ? Br(t.subTree) : null;
}
const Wr = (e) => e.__isSuspense;
function Ll(e, t) {
  t && t.pendingBranch ? H(e) ? t.effects.push(...e) : t.effects.push(e) : Bi(e);
}
const oe = /* @__PURE__ */ Symbol.for("v-fgt"), ws = /* @__PURE__ */ Symbol.for("v-txt"), et = /* @__PURE__ */ Symbol.for("v-cmt"), ts = /* @__PURE__ */ Symbol.for("v-stc"), gt = [];
let xe = null;
function Q(e = !1) {
  gt.push(xe = e ? null : []);
}
function Jr() {
  gt.pop(), xe = gt[gt.length - 1] || null;
}
let Vt = 1;
function Mn(e, t = !1) {
  Vt += e, e < 0 && xe && t && (xe.hasOnce = !0);
}
function qr(e) {
  return e.dynamicChildren = Vt > 0 ? xe || ht : null, Jr(), Vt > 0 && xe && xe.push(e), e;
}
function ee(e, t, s, n, r, i) {
  return qr(
    R(
      e,
      t,
      s,
      n,
      r,
      i,
      !0
    )
  );
}
function Fl(e, t, s, n, r) {
  return qr(
    Ae(
      e,
      t,
      s,
      n,
      r,
      !0
    )
  );
}
function Gr(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Pt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const zr = ({ key: e }) => e ?? null, ss = ({
  ref: e,
  ref_key: t,
  ref_for: s
}) => (typeof e == "number" && (e = "" + e), e != null ? te(e) || /* @__PURE__ */ he(e) || k(e) ? { i: Ue, r: e, k: t, f: !!s } : e : null);
function R(e, t = null, s = null, n = 0, r = null, i = e === oe ? 0 : 1, l = !1, o = !1) {
  const f = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && zr(t),
    ref: t && ss(t),
    scopeId: _r,
    slotScopeIds: null,
    children: s,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: i,
    patchFlag: n,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: Ue
  };
  return o ? (fs(f, s), i & 128 && e.normalize(f)) : s && (f.shapeFlag |= te(s) ? 8 : 16), Vt > 0 && // avoid a block node from tracking itself
  !l && // has current parent block
  xe && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (f.patchFlag > 0 || i & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  f.patchFlag !== 32 && xe.push(f), f;
}
const Ae = Nl;
function Nl(e, t = null, s = null, n = 0, r = null, i = !1) {
  if ((!e || e === cl) && (e = et), Gr(e)) {
    const o = Et(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return s && fs(o, s), Vt > 0 && !i && xe && (o.shapeFlag & 6 ? xe[xe.indexOf(e)] = o : xe.push(o)), o.patchFlag = -2, o;
  }
  if (zl(e) && (e = e.__vccOpts), t) {
    t = jl(t);
    let { class: o, style: f } = t;
    o && !te(o) && (t.class = Ot(o)), G(f) && (/* @__PURE__ */ tn(f) && !H(f) && (f = ce({}, f)), t.style = gs(f));
  }
  const l = te(e) ? 1 : Wr(e) ? 128 : _s(e) ? 64 : G(e) ? 4 : k(e) ? 2 : 0;
  return R(
    e,
    t,
    s,
    n,
    r,
    l,
    i,
    !0
  );
}
function jl(e) {
  return e ? /* @__PURE__ */ tn(e) || Nr(e) ? ce({}, e) : e : null;
}
function Et(e, t, s = !1, n = !1) {
  const { props: r, ref: i, patchFlag: l, children: o, transition: f } = e, a = t ? kl(r || {}, t) : r, d = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: a,
    key: a && zr(a),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      s && i ? H(i) ? i.concat(ss(t)) : [i, ss(t)] : ss(t)
    ) : i,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: o,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== oe ? l === -1 ? 16 : l | 16 : l,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: f,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && Et(e.ssContent),
    ssFallback: e.ssFallback && Et(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce,
    cacheIndex: e.cacheIndex
  };
  return f && n && nn(
    d,
    f.clone(d)
  ), d;
}
function Dl(e = " ", t = 0) {
  return Ae(ws, null, e, t);
}
function Hl(e, t) {
  const s = Ae(ts, null, e);
  return s.staticCount = t, s;
}
function In(e = "", t = !1) {
  return t ? (Q(), Fl(et, null, e)) : Ae(et, null, e);
}
function ke(e) {
  return e == null || typeof e == "boolean" ? Ae(et) : H(e) ? Ae(
    oe,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : Gr(e) ? Ye(e) : Ae(ws, null, String(e));
}
function Ye(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : Et(e);
}
function fs(e, t) {
  let s = 0;
  const { shapeFlag: n } = e;
  if (t == null)
    t = null;
  else if (H(t))
    s = 16;
  else if (typeof t == "object")
    if (n & 65) {
      const r = t.default;
      r && (r._c && (r._d = !1), fs(e, r()), r._c && (r._d = !0));
      return;
    } else {
      s = 32;
      const r = t._;
      !r && !Nr(t) ? t._ctx = Ue : r === 3 && Ue && (Ue.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (k(t)) {
    if (n & 65) {
      fs(e, { default: t });
      return;
    }
    t = { default: t, _ctx: Ue }, s = 32;
  } else
    t = String(t), n & 64 ? (s = 16, t = [Dl(t)]) : s = 8;
  e.children = t, e.shapeFlag |= s;
}
function kl(...e) {
  const t = {};
  for (let s = 0; s < e.length; s++) {
    const n = e[s];
    for (const r in n)
      if (r === "class")
        t.class !== n.class && (t.class = Ot([t.class, n.class]));
      else if (r === "style")
        t.style = gs([t.style, n.style]);
      else if (as(r)) {
        const i = t[r], l = n[r];
        l && i !== l && !(H(i) && i.includes(l)) ? t[r] = i ? [].concat(i, l) : l : l == null && i == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !ds(r) && (t[r] = l);
      } else r !== "" && (t[r] = n[r]);
  }
  return t;
}
function Ne(e, t, s, n = null) {
  Me(e, t, 7, [
    s,
    n
  ]);
}
const Kl = Pr();
let Ul = 0;
function Vl(e, t, s) {
  const n = e.type, r = (t ? t.appContext : e.appContext) || Kl, i = {
    uid: Ul++,
    vnode: e,
    type: n,
    parent: t,
    appContext: r,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new hi(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(r.provides),
    ids: t ? t.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: Dr(n, r),
    emitsOptions: $r(n, r),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: X,
    // inheritAttrs
    inheritAttrs: n.inheritAttrs,
    // state
    ctx: X,
    data: X,
    props: X,
    attrs: X,
    slots: X,
    refs: X,
    setupState: X,
    setupContext: null,
    // suspense related
    suspense: s,
    suspenseId: s ? s.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return i.ctx = { _: i }, i.root = t ? t.root : i, i.emit = vl.bind(null, i), e.ce && e.ce(i), i;
}
let me = null;
const Bl = () => me || Ue;
let us, Bt;
{
  const e = ps(), t = (s, n) => {
    let r;
    return (r = e[s]) || (r = e[s] = []), r.push(n), (i) => {
      r.length > 1 ? r.forEach((l) => l(i)) : r[0](i);
    };
  };
  us = t(
    "__VUE_INSTANCE_SETTERS__",
    (s) => me = s
  ), Bt = t(
    "__VUE_SSR_SETTERS__",
    (s) => Wt = s
  );
}
const Gt = (e) => {
  const t = me;
  return us(e), e.scope.on(), () => {
    e.scope.off(), us(t);
  };
}, Pn = () => {
  me && me.scope.off(), us(null);
};
function Yr(e) {
  return e.vnode.shapeFlag & 4;
}
let Wt = !1;
function Wl(e, t = !1, s = !1) {
  t && Bt(t);
  const { props: n, children: r } = e.vnode, i = Yr(e);
  Cl(e, n, i, t), Al(e, r, s || t);
  const l = i ? Jl(e, t) : void 0;
  return t && Bt(!1), l;
}
function Jl(e, t) {
  const s = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, fl);
  const { setup: n } = s;
  if (n) {
    Xe();
    const r = e.setupContext = n.length > 1 ? Gl(e) : null, i = Gt(e), l = qt(
      n,
      e,
      0,
      [
        e.props,
        r
      ]
    ), o = Wn(l);
    if (Qe(), i(), (o || e.sp) && !Dt(e) && Cr(e), o) {
      if (l.then(Pn, Pn), t)
        return l.then((f) => {
          Bt(!0);
          try {
            $n(e, f, t);
          } finally {
            Bt(!1);
          }
        }).catch((f) => {
          vs(f, e, 0);
        });
      e.asyncDep = l;
    } else
      $n(e, l);
  } else
    Zr(e);
}
function $n(e, t, s) {
  k(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : G(t) && (e.setupState = pr(t)), Zr(e);
}
function Zr(e, t, s) {
  const n = e.type;
  e.render || (e.render = n.render || Ve);
  {
    const r = Gt(e);
    Xe();
    try {
      ul(e);
    } finally {
      Qe(), r();
    }
  }
}
const ql = {
  get(e, t) {
    return de(e, "get", ""), e[t];
  }
};
function Gl(e) {
  const t = (s) => {
    e.exposed = s || {};
  };
  return {
    attrs: new Proxy(e.attrs, ql),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function cn(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(pr(Ri(e.exposed)), {
    get(t, s) {
      if (s in t)
        return t[s];
      if (s in Ht)
        return Ht[s](e);
    },
    has(t, s) {
      return s in t || s in Ht;
    }
  })) : e.proxy;
}
function zl(e) {
  return k(e) && "__vccOpts" in e;
}
const De = (e, t) => /* @__PURE__ */ Di(e, t, Wt), Yl = "3.5.43";
let Bs;
const Rn = typeof window < "u" && window.trustedTypes;
if (Rn)
  try {
    Bs = /* @__PURE__ */ Rn.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const Xr = Bs ? (e) => Bs.createHTML(e) : (e) => e, Zl = "http://www.w3.org/2000/svg", Xl = "http://www.w3.org/1998/Math/MathML", ze = typeof document < "u" ? document : null, Ln = ze && /* @__PURE__ */ ze.createElement("template"), Ql = {
  insert: (e, t, s) => {
    t.insertBefore(e, s || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, s, n) => {
    const r = t === "svg" ? ze.createElementNS(Zl, e) : t === "mathml" ? ze.createElementNS(Xl, e) : s ? ze.createElement(e, { is: s }) : ze.createElement(e);
    return e === "select" && n && n.multiple != null && r.setAttribute("multiple", n.multiple), r;
  },
  createText: (e) => ze.createTextNode(e),
  createComment: (e) => ze.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => ze.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, s, n, r, i) {
    const l = s ? s.previousSibling : t.lastChild;
    if (r && (r === i || r.nextSibling))
      for (; t.insertBefore(r.cloneNode(!0), s), !(r === i || !(r = r.nextSibling)); )
        ;
    else {
      Ln.innerHTML = Xr(
        n === "svg" ? `<svg>${e}</svg>` : n === "mathml" ? `<math>${e}</math>` : e
      );
      const o = Ln.content;
      if (n === "svg" || n === "mathml") {
        const f = o.firstChild;
        for (; f.firstChild; )
          o.appendChild(f.firstChild);
        o.removeChild(f);
      }
      t.insertBefore(o, s);
    }
    return [
      // first
      l ? l.nextSibling : t.firstChild,
      // last
      s ? s.previousSibling : t.lastChild
    ];
  }
}, eo = /* @__PURE__ */ Symbol("_vtc");
function to(e, t, s) {
  const n = e[eo];
  n && (t = (t ? [t, ...n] : [...n]).join(" ")), t == null ? e.removeAttribute("class") : s ? e.setAttribute("class", t) : e.className = t;
}
const Fn = /* @__PURE__ */ Symbol("_vod"), so = /* @__PURE__ */ Symbol("_vsh"), no = /* @__PURE__ */ Symbol(""), ro = /(?:^|;)\s*display\s*:/;
function io(e, t, s) {
  const n = e.style, r = te(s);
  let i = !1;
  if (s && !r) {
    if (t)
      if (te(t))
        for (const l of t.split(";")) {
          const o = l.slice(0, l.indexOf(":")).trim();
          s[o] == null && Rt(n, o, "");
        }
      else
        for (const l in t)
          s[l] == null && Rt(n, l, "");
    for (const l in s) {
      l === "display" && (i = !0);
      const o = s[l];
      o != null ? oo(
        e,
        l,
        !te(t) && t ? t[l] : void 0,
        o
      ) || Rt(n, l, o) : Rt(n, l, "");
    }
  } else if (r) {
    if (t !== s) {
      const l = n[no];
      l && (s += ";" + l), n.cssText = s, i = ro.test(s);
    }
  } else t && e.removeAttribute("style");
  Fn in e && (e[Fn] = i ? n.display : "", e[so] && (n.display = "none"));
}
const Qt = /\s*!important$/;
function Rt(e, t, s) {
  if (H(s))
    s.forEach((n) => Rt(e, t, n));
  else if (s == null && (s = ""), t.startsWith("--"))
    Qt.test(s) ? e.setProperty(t, s.replace(Qt, ""), "important") : e.setProperty(t, s);
  else {
    const n = lo(e, t);
    Qt.test(s) ? e.setProperty(
      ft(n),
      s.replace(Qt, ""),
      "important"
    ) : e[n] = s;
  }
}
const Nn = ["Webkit", "Moz", "ms"], Rs = {};
function lo(e, t) {
  const s = Rs[t];
  if (s)
    return s;
  let n = Oe(t);
  if (n !== "filter" && n in e)
    return Rs[t] = n;
  n = Gn(n);
  for (let r = 0; r < Nn.length; r++) {
    const i = Nn[r] + n;
    if (i in e)
      return Rs[t] = i;
  }
  return t;
}
function oo(e, t, s, n) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && te(n) && s === n;
}
const jn = "http://www.w3.org/1999/xlink";
function Dn(e, t, s, n, r, i = ui(t)) {
  n && t.startsWith("xlink:") ? s == null ? e.removeAttributeNS(jn, t.slice(6, t.length)) : e.setAttributeNS(jn, t, s) : s == null || i && !Yn(s) ? e.removeAttribute(t) : e.setAttribute(
    t,
    i ? "" : Be(s) ? String(s) : s
  );
}
function Hn(e, t, s, n, r) {
  if (t === "innerHTML" || t === "textContent") {
    s != null && (e[t] = t === "innerHTML" ? Xr(s) : s);
    return;
  }
  const i = e.tagName;
  if (t === "value" && i !== "PROGRESS" && // custom elements may use _value internally
  !i.includes("-")) {
    const o = i === "OPTION" ? e.getAttribute("value") || "" : e.value, f = s == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(s);
    (o !== f || !("_value" in e)) && (e.value = f), s == null && e.removeAttribute(t), e._value = s;
    return;
  }
  let l = !1;
  if (s === "" || s == null) {
    const o = typeof e[t];
    o === "boolean" ? s = Yn(s) : s == null && o === "string" ? (s = "", l = !0) : o === "number" && (s = 0, l = !0);
  }
  try {
    e[t] = s;
  } catch {
  }
  l && e.removeAttribute(r || t);
}
function co(e, t, s, n) {
  e.addEventListener(t, s, n);
}
function fo(e, t, s, n) {
  e.removeEventListener(t, s, n);
}
const kn = /* @__PURE__ */ Symbol("_vei");
function uo(e, t, s, n, r = null) {
  const i = e[kn] || (e[kn] = {}), l = i[t];
  if (n && l)
    l.value = n;
  else {
    const [o, f] = po(t);
    if (n) {
      const a = i[t] = yo(
        n,
        r
      );
      co(e, o, a, f);
    } else l && (fo(e, o, l, f), i[t] = void 0);
  }
}
const ao = /(Once|Passive|Capture)$/, ho = /^on:?(?:Once|Passive|Capture)$/;
function po(e) {
  let t, s;
  for (; (s = e.match(ao)) && !ho.test(e); )
    t || (t = {}), e = e.slice(0, e.length - s[1].length), t[s[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : ft(e.slice(2)), t];
}
let Ls = 0;
const go = /* @__PURE__ */ Promise.resolve(), mo = () => Ls || (go.then(() => Ls = 0), Ls = Date.now());
function yo(e, t) {
  const s = (n) => {
    if (!n._vts)
      n._vts = Date.now();
    else if (n._vts <= s.attached)
      return;
    const r = s.value;
    if (H(r)) {
      const i = n.stopImmediatePropagation;
      n.stopImmediatePropagation = () => {
        i.call(n), n._stopped = !0;
      };
      const l = r.slice(), o = [n];
      for (let f = 0; f < l.length && !n._stopped; f++) {
        const a = l[f];
        a && Me(
          a,
          t,
          5,
          o
        );
      }
    } else
      Me(
        r,
        t,
        5,
        [n]
      );
  };
  return s.value = e, s.attached = mo(), s;
}
const Kn = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, vo = (e, t, s, n, r, i) => {
  const l = r === "svg";
  t === "class" ? to(e, n, l) : t === "style" ? io(e, s, n) : as(t) ? ds(t) || uo(e, t, s, n, i) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : _o(e, t, n, l)) ? (Hn(e, t, n), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Dn(e, t, n, l, i, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (bo(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !te(n))) ? Hn(e, Oe(t), n, i, t) : (t === "true-value" ? e._trueValue = n : t === "false-value" && (e._falseValue = n), Dn(e, t, n, l));
};
function _o(e, t, s, n) {
  if (n)
    return !!(t === "innerHTML" || t === "textContent" || t in e && Kn(t) && k(s));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const r = e.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE")
      return !1;
  }
  return Kn(t) && te(s) ? !1 : t in e;
}
function bo(e, t) {
  const s = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!s)
    return !1;
  const n = Oe(t);
  return Array.isArray(s) ? s.some((r) => Oe(r) === n) : Object.keys(s).some((r) => Oe(r) === n);
}
const xo = ["ctrl", "shift", "alt", "meta"], wo = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, t) => xo.some((s) => e[`${s}Key`] && !t.includes(s))
}, So = (e, t) => {
  if (!e) return e;
  const s = e._withMods || (e._withMods = {}), n = t.join(".");
  return s[n] || (s[n] = ((r, ...i) => {
    for (let l = 0; l < t.length; l++) {
      const o = wo[t[l]];
      if (o && o(r, t)) return;
    }
    return e(r, ...i);
  }));
}, Co = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, Un = (e, t) => {
  const s = e._withKeys || (e._withKeys = {}), n = t.join(".");
  return s[n] || (s[n] = ((r) => {
    if (!("key" in r))
      return;
    const i = ft(r.key);
    if (t.some(
      (l) => l === i || Co[l] === i
    ))
      return e(r);
  }));
}, To = /* @__PURE__ */ ce({ patchProp: vo }, Ql);
let Vn;
function Oo() {
  return Vn || (Vn = Il(To));
}
const Eo = ((...e) => {
  const t = Oo().createApp(...e), { mount: s } = t;
  return t.mount = (n) => {
    const r = Mo(n);
    if (!r) return;
    const i = t._component;
    !k(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
    const l = s(r, !1, Ao(r));
    return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), l;
  }, t;
});
function Ao(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function Mo(e) {
  return te(e) ? document.querySelector(e) : e;
}
const Io = {
  class: "flight-board",
  viewBox: "0 0 600 600",
  role: "group",
  "aria-label": "飞行棋四方棋盘"
}, Po = ["opacity"], $o = ["x", "y", "fill"], Ro = ["x", "y", "stroke"], Lo = ["cx", "cy", "stroke"], Fo = ["x", "y", "fill"], No = ["transform"], jo = ["fill"], Do = {
  key: 0,
  d: "M0 -7 L2 -2 L7 -2 L3 1 L4 6 L0 3 L-4 6 L-3 1 L-7 -2 L-2 -2Z",
  fill: "white",
  stroke: "#ffffff88",
  "stroke-width": ".7"
}, Ho = {
  key: 1,
  d: "M-3 -1 L0 2 L3 -1",
  fill: "none",
  stroke: "white",
  "stroke-opacity": ".65",
  "stroke-width": "1.5",
  "stroke-linecap": "round"
}, ko = ["d", "stroke"], Ko = ["cx", "cy", "fill"], Uo = ["transform", "tabindex", "role", "aria-label", "onClick", "onKeydown"], Vo = ["fill"], Bo = ["stroke"], Wo = ["fill"], Jo = ["fill"], qo = {
  class: "plane-number",
  x: "13",
  y: "15.5",
  "text-anchor": "middle"
}, Go = /* @__PURE__ */ Sr({
  __name: "FlightBoard",
  props: {
    state: {},
    selfId: {}
  },
  emits: ["move"],
  setup(e) {
    const t = e, s = { red: "#e75b4f", blue: "#4784c5", yellow: "#eab844", green: "#52a77a" }, n = ["red", "blue", "yellow", "green"], r = Array.from({ length: 52 }, ($, _) => {
      const x = (-135 + _ * 360 / 52) * Math.PI / 180;
      return { x: 300 + 216 * Math.cos(x), y: 300 + 216 * Math.sin(x) };
    }), i = [{ x: 24, y: 24 }, { x: 446, y: 24 }, { x: 446, y: 446 }, { x: 24, y: 446 }], l = ($) => t.state.players.find((_) => _.color === $), o = { red: 0, blue: 13, yellow: 26, green: 39 }, f = Object.fromEntries(["red", "blue", "yellow", "green"].map(($) => {
      const _ = r[(o[$] + 51) % 52], x = Array.from({ length: 6 }, (L, M) => ({ x: _.x + (300 - _.x) * (M === 5 ? 1 : (36 + M * 27) / 216), y: _.y + (300 - _.y) * (M === 5 ? 1 : (36 + M * 27) / 216) }));
      return [$, x];
    })), a = Object.fromEntries(n.map(($, _) => {
      const x = i[_];
      return [$, [{ x: x.x + 40, y: x.y + 42 }, { x: x.x + 90, y: x.y + 42 }, { x: x.x + 40, y: x.y + 85 }, { x: x.x + 90, y: x.y + 85 }]];
    })), d = De(() => t.state.players[t.state.turn]), p = ($, _) => t.state.phase === "move" && d.value?.id === t.selfId && d.value.id === $.id && $.planes[_] !== 57 && ($.planes[_] === -1 && t.state.dice === 6 || $.planes[_] >= 0 && $.planes[_] + t.state.dice <= 57);
    function E($, _) {
      const x = $.planes[_], L = $.color;
      return x < 0 ? a[L]?.[_] || { x: 300, y: 300 } : x < 52 ? r[(x + ["red", "blue", "yellow", "green"].indexOf(L) * 13) % 52] : f[L]?.[Math.min(5, x - 52)] || { x: 300, y: 300 };
    }
    function I($, _) {
      const x = E($, _), L = t.state.players.flatMap((P) => P.planes.map((W, ne) => ({ item: P, i: ne, p: E(P, ne) }))).filter((P) => Math.hypot(P.p.x - x.x, P.p.y - x.y) < 1), M = L.findIndex((P) => P.item.id === $.id && P.i === _), K = Math.max(0, M) / Math.max(1, L.length) * Math.PI * 2;
      return { x: x.x + (L.length > 1 ? Math.cos(K) * 15 : 0), y: x.y + (L.length > 1 ? Math.sin(K) * 15 : 0) };
    }
    return ($, _) => (Q(), ee("svg", Io, [
      _[4] || (_[4] = Hl('<defs><linearGradient id="tile-glaze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="white" stop-opacity=".55"></stop><stop offset="1" stop-color="white" stop-opacity="0"></stop></linearGradient><linearGradient id="board-surface" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff"></stop><stop offset="1" stop-color="#edf2fa"></stop></linearGradient><symbol id="aircraft" viewBox="-18 -20 36 40"><path d="M0 -18 C3 -18 4 -14 4 -10 L4 -4 L16 4 L16 8 L4 4 L3 12 L8 16 L8 18 L0 16 L-8 18 L-8 16 L-3 12 L-4 4 L-16 8 L-16 4 L-4 -4 L-4 -10 C-4 -14 -3 -18 0 -18Z" fill="currentColor" stroke="white" stroke-width="1.4" stroke-linejoin="round"></path><path d="M-2 -11 Q0 -15 2 -11 L2 -6 L-2 -6Z" fill="#223e60" opacity=".65"></path><path d="M0 -3 L0 12" stroke="white" stroke-opacity=".5" stroke-width="1.2"></path></symbol><pattern id="board-grain" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".7" fill="#274136" opacity=".07"></circle></pattern><filter id="plane-shadow" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#13221c" flood-opacity=".22"></feDropShadow></filter></defs><rect x="8" y="8" width="584" height="584" rx="18" fill="url(#board-surface)"></rect><rect x="8" y="8" width="584" height="584" rx="18" fill="url(#board-grain)"></rect><rect x="14" y="14" width="572" height="572" rx="16" fill="none" stroke="#dbe4f0" stroke-width="1.5"></rect><circle cx="300" cy="300" r="193" fill="none" stroke="#e0e7f1" stroke-width="1"></circle><circle cx="300" cy="300" r="239" fill="none" stroke="#e0e7f1" stroke-width="1" stroke-dasharray="3 7"></circle><circle cx="300" cy="300" r="216" fill="none" stroke="#e5ebf4" stroke-width="36"></circle>', 7)),
      (Q(), ee(oe, null, nt(n, (x, L) => R("g", {
        key: x,
        opacity: l(x) ? 1 : 0.48
      }, [
        R("rect", {
          x: i[L].x,
          y: i[L].y,
          width: "130",
          height: "130",
          rx: "25",
          fill: s[x],
          opacity: ".12"
        }, null, 8, $o),
        R("rect", {
          x: i[L].x,
          y: i[L].y,
          width: "130",
          height: "130",
          rx: "25",
          fill: "none",
          stroke: s[x],
          "stroke-width": "2"
        }, null, 8, Ro),
        (Q(!0), ee(oe, null, nt(wt(a)[x], (M, K) => (Q(), ee("circle", {
          key: K,
          cx: M.x,
          cy: M.y,
          r: "19",
          fill: "white",
          stroke: s[x],
          "stroke-opacity": ".22"
        }, null, 8, Lo))), 128)),
        R("text", {
          x: i[L].x + 65,
          y: i[L].y + 117,
          "text-anchor": "middle",
          fill: s[x],
          "font-size": "10",
          "font-weight": "700"
        }, ae(l(x)?.name.slice(0, 9) || "空位 · 无需等满"), 9, Fo)
      ], 8, Po)), 64)),
      (Q(!0), ee(oe, null, nt(wt(r), (x, L) => (Q(), ee("g", {
        key: L,
        transform: `translate(${x.x} ${x.y}) rotate(${-45 + L * 360 / 52})`
      }, [
        _[0] || (_[0] = R("rect", {
          x: "-11.5",
          y: "-12",
          width: "23",
          height: "29",
          rx: "6",
          fill: "#a8b9d0",
          opacity: ".48"
        }, null, -1)),
        _[1] || (_[1] = R("rect", {
          x: "-11.5",
          y: "-15",
          width: "23",
          height: "29",
          rx: "6",
          fill: "white",
          stroke: "#ccd7e5",
          "stroke-width": ".7"
        }, null, -1)),
        R("rect", {
          x: "-9",
          y: "-12.5",
          width: "18",
          height: "24",
          rx: "4",
          fill: s[n[L % 4]]
        }, null, 8, jo),
        _[2] || (_[2] = R("rect", {
          x: "-9",
          y: "-12.5",
          width: "18",
          height: "24",
          rx: "4",
          fill: "url(#tile-glaze)"
        }, null, -1)),
        [0, 8, 13, 21, 26, 34, 39, 47].includes(L) ? (Q(), ee("path", Do)) : (Q(), ee("path", Ho))
      ], 8, No))), 128)),
      (Q(), ee(oe, null, nt(n, (x) => R("g", {
        key: `lane-${x}`
      }, [
        R("path", {
          d: `M ${wt(f)[x][0].x} ${wt(f)[x][0].y} L 300 300`,
          stroke: s[x],
          "stroke-width": "24",
          opacity: ".12"
        }, null, 8, ko),
        (Q(!0), ee(oe, null, nt(wt(f)[x], (L, M) => (Q(), ee("circle", {
          key: M,
          cx: L.x,
          cy: L.y,
          r: "9",
          fill: s[x],
          opacity: ".7",
          stroke: "white",
          "stroke-width": "2"
        }, null, 8, Ko))), 128))
      ])), 64)),
      _[5] || (_[5] = R("circle", {
        cx: "300",
        cy: "300",
        r: "47",
        fill: "white",
        stroke: "#e0e7f1",
        "stroke-width": "2"
      }, null, -1)),
      _[6] || (_[6] = R("path", {
        d: "M300 259 L341 300 L300 341 L259 300 Z",
        fill: "#edf2fb"
      }, null, -1)),
      _[7] || (_[7] = R("text", {
        x: "300",
        y: "293",
        "text-anchor": "middle",
        fill: "#596c8d",
        "font-size": "19"
      }, "✦", -1)),
      _[8] || (_[8] = R("text", {
        x: "300",
        y: "315",
        "text-anchor": "middle",
        fill: "#596c8d",
        "font-size": "10",
        "letter-spacing": "2"
      }, "归 航", -1)),
      (Q(!0), ee(oe, null, nt(e.state.players, (x) => (Q(), ee("g", {
        key: `planes-${x.id}`
      }, [
        (Q(!0), ee(oe, null, nt(x.planes, (L, M) => (Q(), ee("g", {
          key: M,
          class: Ot(["plane-token", [`plane-${x.color}`, { selectable: p(x, M) }]]),
          transform: `translate(${I(x, M).x} ${I(x, M).y})`,
          tabindex: p(x, M) ? 0 : -1,
          role: p(x, M) ? "button" : void 0,
          "aria-label": `${x.name} 的第 ${M + 1} 架飞机${p(x, M) ? "，点击行棋" : ""}`,
          onClick: (K) => p(x, M) && $.$emit("move", M),
          onKeydown: [
            Un((K) => p(x, M) && $.$emit("move", M), ["enter"]),
            Un(So((K) => p(x, M) && $.$emit("move", M), ["prevent"]), ["space"])
          ]
        }, [
          _[3] || (_[3] = R("circle", {
            class: "plane-hit",
            r: "23",
            fill: "transparent",
            stroke: "none"
          }, null, -1)),
          R("circle", {
            class: "plane-base",
            cy: "3",
            r: "18",
            fill: s[x.color]
          }, null, 8, Vo),
          R("circle", {
            class: "plane-top",
            r: "18",
            fill: "white",
            stroke: s[x.color],
            "stroke-width": "2"
          }, null, 8, Bo),
          R("circle", {
            r: "14.5",
            fill: s[x.color],
            opacity: ".1",
            stroke: "none"
          }, null, 8, Wo),
          R("use", {
            href: "#aircraft",
            x: "-16",
            y: "-19",
            width: "32",
            height: "36",
            style: gs({ color: s[x.color] })
          }, null, 4),
          R("circle", {
            cx: "13",
            cy: "13",
            r: "6",
            fill: s[x.color],
            stroke: "white",
            "stroke-width": "1"
          }, null, 8, Jo),
          R("text", qo, ae(M + 1), 1)
        ], 42, Uo))), 128))
      ]))), 128)),
      _[9] || (_[9] = R("g", { class: "board-mark" }, [
        R("text", {
          x: "300",
          y: "52"
        }, "✈ FLIGHT CLUB"),
        R("text", {
          x: "300",
          y: "548"
        }, "顺时针飞行 · 星标安全格")
      ], -1))
    ]));
  }
}), zo = { class: "flight-game board-first" }, Yo = { class: "flight-header" }, Zo = { class: "flight-room" }, Xo = {
  class: "compact-network",
  role: "status"
}, Qo = {
  key: 0,
  class: "board-stage"
}, ec = {
  class: "board-turn",
  "aria-live": "polite"
}, tc = {
  key: 0,
  class: "flight-error",
  role: "alert"
}, sc = { class: "board-arena" }, nc = { class: "center-control" }, rc = ["disabled"], ic = ["disabled", "aria-label"], lc = {
  class: "players-strip",
  "aria-label": "玩家状态"
}, oc = ["title"], cc = {
  key: 1,
  class: "flight-loading"
}, fc = ["href"], uc = /* @__PURE__ */ Sr({
  __name: "FlightChessPage",
  setup(e) {
    const t = ["red", "blue", "yellow", "green"], s = /* @__PURE__ */ new Set([0, 8, 13, 21, 26, 34, 39, 47]), n = { red: 0, blue: 13, yellow: 26, green: 39 }, r = () => ({ rev: 0, players: [], turn: 0, phase: "waiting", dice: 0, winner: null, notice: "等待第二位玩家加入" }), i = /* @__PURE__ */ Li(), l = /* @__PURE__ */ Fe(), o = /* @__PURE__ */ Fe(), f = /* @__PURE__ */ Fe([]), a = /* @__PURE__ */ Fe(r()), d = /* @__PURE__ */ Fe(""), p = /* @__PURE__ */ Fe("/"), E = /* @__PURE__ */ Fe(!1), I = /* @__PURE__ */ Fe(!1), $ = /* @__PURE__ */ Fe(!1), _ = /* @__PURE__ */ Fe({}), x = (C) => C === W.value ? "你 · 本机" : _.value[C] === "connected" ? "已连接" : _.value[C] === "reconnecting" ? "重连中" : "连接中", L = De(() => a.value.players.filter((C) => C.id === W.value || _.value[C.id] === "connected").length), M = De(() => I.value || L.value === a.value.players.length), K = De(() => a.value.phase === "waiting" ? a.value.players.length >= 2 ? "两人即可出发" : "等一位朋友" : a.value.phase === "done" ? "本局结束" : fe.value ? "轮到你了" : `等待 ${ne.value?.name || "玩家"}`);
    let P = 0;
    const W = De(() => o.value?.id || ""), ne = De(() => a.value.players[a.value.turn]), fe = De(() => ne.value?.id === W.value), we = De(() => a.value.phase === "roll" && fe.value && !$.value && M.value), st = De(() => a.value.phase === "waiting" && a.value.players.length >= 2 && M.value);
    function Je(C, w) {
      return w.find((b) => b.id === C.id);
    }
    function Te(C) {
      a.value = C, i.value && i.value.broadcast("ludo-state", C);
    }
    function mt(C) {
      if (!E.value) return;
      const w = JSON.parse(JSON.stringify(a.value)), b = w.players[w.turn]?.id;
      if (w.phase !== "waiting") {
        for (const ue of C) ue.id !== W.value && !Je(ue, w.players) && i.value?.send("ludo-reject", { reason: "这局已经开始，下一局再来吧。" }, { target: ue.id, reliability: "reliable" });
        const D = new Set(C.map((ue) => ue.id));
        w.players = w.players.filter((ue) => D.has(ue.id)), w.players.findIndex((ue) => ue.id === b) < 0 && b && (w.turn = Math.min(Math.max(0, w.turn), Math.max(0, w.players.length - 1)), w.phase = "roll", w.dice = 0, w.notice = `${b === W.value ? "一位玩家" : "当前玩家"}离开了房间，游戏继续`);
      } else
        w.players = [...C].sort((D, _e) => D.id.localeCompare(_e.id)).slice(0, 4).map((D, _e) => ({ id: D.id, name: D.name, color: t[_e], planes: [-1, -1, -1, -1] }));
      w.turn = Math.max(0, w.players.findIndex((D) => D.id === b)), w.notice = w.phase === "waiting" ? w.players.length >= 2 ? "飞行员到齐，可以开局" : "等待第二位玩家加入" : w.notice, JSON.stringify(w) !== JSON.stringify(a.value) && (w.rev++, Te(w));
    }
    function yt(C) {
      if (!C || typeof C != "object") return !1;
      const w = C;
      return Number.isSafeInteger(w.rev) && w.rev >= 0 && Array.isArray(w.players) && w.players.length <= 4 && Number.isInteger(w.turn) && w.turn >= 0 && w.turn < Math.max(1, w.players.length) && ["waiting", "roll", "move", "done"].includes(w.phase) && Number.isInteger(w.dice) && w.dice >= 0 && w.dice <= 6 && (w.winner === null || typeof w.winner == "string") && w.players.every((b) => b && typeof b.id == "string" && typeof b.name == "string" && t.includes(b.color) && Array.isArray(b.planes) && b.planes.length === 4 && b.planes.every((D) => Number.isInteger(D) && D >= -1 && D <= 57));
    }
    function At(C) {
      const w = C.payload;
      if (!(!f.value.some((b) => b.id === C.from) || !w || typeof w != "object")) {
        if (C.kind === "ludo-reject" && typeof w?.reason == "string") {
          d.value = w.reason, ye();
          return;
        }
        if (C.kind === "ludo-state" && yt(w) && w.rev > a.value.rev && (a.value = w), C.kind === "ludo-request" && i.value?.send("ludo-state", a.value, { target: C.from, reliability: "reliable" }), C.kind === "ludo-start" && a.value.phase === "waiting" && a.value.players.length >= 2 && a.value.players.some((b) => b.id === C.from)) {
          const b = JSON.parse(JSON.stringify(a.value));
          b.phase = "roll", b.rev++, b.notice = `${b.players[b.turn].name}，掷出 6 让飞机起飞`, Te(b);
        }
        C.kind === "ludo-action" && J(C.from, w);
      }
    }
    function zt() {
      if (!st.value) return;
      const C = JSON.parse(JSON.stringify(a.value));
      C.phase = "roll", C.notice = `${C.players[C.turn].name}，掷出 6 让飞机起飞`, C.rev++, Te(C);
    }
    function re(C) {
      if (!C.players.length) {
        C.phase = "waiting", C.turn = 0;
        return;
      }
      C.turn = (C.turn + 1) % C.players.length, C.phase = "roll", C.notice = `${C.players[C.turn].name} 的回合`;
    }
    function z(C, w) {
      return C.planes.flatMap((b, D) => b === -1 && w === 6 || b >= 0 && b < 57 && b + w <= 57 ? [D] : []);
    }
    function J(C, w) {
      const b = JSON.parse(JSON.stringify(a.value)), D = b.players[b.turn];
      if (w.rev !== a.value.rev || !D || D.id !== C || b.phase === "waiting" || b.phase === "done") return;
      if (w.type === "roll" && b.phase === "roll") {
        if (!Number.isInteger(w.dice) || Number(w.dice) < 1 || Number(w.dice) > 6) return;
        b.dice = Number(w.dice), z(D, b.dice).length ? (b.phase = "move", b.notice = `${D.name} 掷出 ${b.dice}，请选择一架飞机`) : b.dice === 6 ? b.notice = `${D.name} 掷出 6，没有可走的飞机，再掷一次` : re(b), b.rev++, Te(b);
        return;
      }
      if (w.type !== "move" || b.phase !== "move" || !Number.isInteger(w.plane)) return;
      const _e = Number(w.plane);
      if (!z(D, b.dice).includes(_e)) return;
      const ue = D.planes[_e], _t = ue === -1 ? 0 : ue + b.dice;
      D.planes[_e] = _t;
      let Pe = 0;
      if (_t < 52) {
        const bt = (n[D.color] + _t) % 52;
        if (!s.has(bt))
          for (const u of b.players) u.id !== D.id && (u.planes = u.planes.map((h) => h >= 0 && h < 52 && (n[u.color] + h) % 52 === bt ? (Pe++, -1) : h));
      }
      D.planes.every((bt) => bt === 57) ? (b.phase = "done", b.winner = D.id, b.notice = `${D.name} 的四架飞机全部到达终点，赢得本局！`) : b.dice === 6 || Pe > 0 ? (b.phase = "roll", b.notice = Pe ? `${D.name} 撞回 ${Pe} 架对手飞机，再掷一次` : `${D.name} 掷出 6，再掷一次`) : re(b), b.rev++, Te(b);
    }
    function Ie(C, w) {
      if (!M.value) return;
      const b = { type: C, plane: w, rev: a.value.rev, dice: C === "roll" ? Math.floor(Math.random() * 6) + 1 : void 0 };
      J(W.value, b);
    }
    function vt() {
      we.value && ($.value = !0, P = window.setTimeout(() => {
        Ie("roll"), $.value = !1;
      }, 380));
    }
    function qe(C) {
      a.value.phase === "move" && fe.value && ne.value && z(ne.value, a.value.dice).includes(C) && Ie("move", C);
    }
    async function ye() {
      try {
        await i.value?.leave();
      } finally {
        p.value && window.location.assign(p.value);
      }
    }
    return Or(async () => {
      if (!new URLSearchParams(location.search).has("room")) {
        I.value = !0, o.value = { id: "preview", name: "你", virtual_ip: "", endpoint: "" }, a.value = { rev: 1, players: [{ id: "preview", name: "你", color: "red", planes: [-1, -1, -1, -1] }], turn: 0, phase: "roll", dice: 0, winner: null, notice: "掷出 6，让第一架飞机起飞" }, E.value = !0;
        return;
      }
      try {
        const C = Qr.fromLocation();
        if (C.gameId !== "gamelink-flight-chess") throw new Error("此页面只支持飞行棋房间。");
        i.value = C, p.value = `${C.serverUrl}/`, C.on("room", (b) => {
          l.value = b;
        }), C.on("members", (b) => {
          f.value = b, mt(b);
        }), C.on("message", At), C.on("peer-state", (b) => {
          _.value = { ..._.value, [b.peerId]: b.state }, b.state === "connected" && C.send("ludo-request", {}, { target: b.peerId, reliability: "reliable" });
        }), C.on("error", (b) => {
          d.value = b.message;
        }), C.on("room-closed", () => {
          E.value = !1, d.value = "房间已关闭，请回到大厅重新加入。";
        });
        const w = await C.joinFromLocation();
        if (l.value = w.room, o.value = w.self_member, f.value = w.room.members, f.value.length > 4) {
          d.value = "飞行棋房间最多 4 位玩家。", await C.leave();
          return;
        }
        a.value = { ...r(), players: [...f.value].sort((b, D) => b.id.localeCompare(D.id)).slice(0, 4).map((b, D) => ({ id: b.id, name: b.name, color: t[D], planes: [-1, -1, -1, -1] })), notice: f.value.length >= 2 ? "飞行员到齐，等待开局" : "等待第二位玩家加入" }, E.value = !0;
        for (const [b, D] of C.peerStates)
          _.value[b] = D, D === "connected" && C.send("ludo-request", {}, { target: b, reliability: "reliable" });
      } catch (C) {
        i.value?.dispose(), d.value = C instanceof Error ? C.message : String(C);
      }
    }), Er(() => {
      window.clearTimeout(P), i.value?.dispose();
    }), (C, w) => (Q(), ee("main", zo, [
      R("header", Yo, [
        w[1] || (w[1] = R("a", {
          href: "/",
          class: "flight-brand"
        }, [
          R("span", { class: "brand-plane" }, "✈"),
          R("b", null, "飞行棋")
        ], -1)),
        R("div", Zo, [
          w[0] || (w[0] = R("small", null, "房间", -1)),
          R("b", null, ae(l.value?.code || "练习"), 1)
        ]),
        R("span", Xo, ae(I.value ? "单人练习" : `${L.value}/${a.value.players.length} 已连接`), 1),
        R("button", {
          class: "flight-exit",
          onClick: ye
        }, "退出 ↗")
      ]),
      E.value ? (Q(), ee("section", Qo, [
        R("div", ec, [
          R("b", null, ae(K.value), 1),
          R("span", null, ae(M.value ? a.value.phase === "waiting" ? "2 人即可开始 · 最多 4 人" : a.value.notice : "等待连接恢复…"), 1)
        ]),
        d.value ? (Q(), ee("p", tc, ae(d.value), 1)) : In("", !0),
        R("div", sc, [
          Ae(Go, {
            state: a.value,
            "self-id": W.value,
            onMove: qe
          }, null, 8, ["state", "self-id"]),
          R("div", nc, [
            a.value.phase === "waiting" ? (Q(), ee("button", {
              key: 0,
              class: "center-dice start-dice",
              disabled: !st.value,
              onClick: zt
            }, [
              w[2] || (w[2] = R("span", null, "✈", -1)),
              R("small", null, ae(st.value ? `${a.value.players.length} 人开始` : a.value.players.length < 2 ? "等待朋友" : "连接中"), 1)
            ], 8, rc)) : (Q(), ee("button", {
              key: 1,
              class: Ot(["center-dice", { rolling: $.value, "is-mine": fe.value && a.value.phase === "roll" }]),
              disabled: !we.value,
              "aria-label": we.value ? "掷骰子" : a.value.phase === "move" ? "请选择飞机" : "等待回合",
              onClick: vt
            }, [
              R("span", null, ae(a.value.dice ? ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][a.value.dice] : "⚄"), 1),
              R("small", null, ae($.value ? "掷骰中" : a.value.phase === "done" ? "已结束" : M.value ? fe.value ? a.value.phase === "move" ? "选择飞机" : "掷骰子" : "等待对手" : "连接中"), 1)
            ], 10, ic))
          ])
        ]),
        R("div", lc, [
          (Q(!0), ee(oe, null, nt(a.value.players, (b) => (Q(), ee("div", {
            key: b.id,
            class: Ot(["player-chip", [`roster-${b.color}`, { current: ne.value?.id === b.id && a.value.phase !== "waiting" && a.value.phase !== "done" }]]),
            title: x(b.id)
          }, [
            w[3] || (w[3] = R("i", null, null, -1)),
            R("b", null, ae(b.name) + ae(b.id === W.value ? " · 你" : ""), 1),
            R("span", null, ae(b.planes.filter((D) => D === 57).length) + "/4", 1),
            R("small", null, ae(x(b.id)), 1)
          ], 10, oc))), 128))
        ]),
        w[4] || (w[4] = R("details", { class: "compact-rules" }, [
          R("summary", null, "玩法说明"),
          R("p", null, "2 人即可开局。掷出 6 起飞或再掷一次；点击亮起的飞机行棋。星标格安全，其他格撞回对手可再掷一次。刚好点数抵达终点，四架全部归航获胜。")
        ], -1))
      ])) : (Q(), ee("section", cc, [
        w[5] || (w[5] = R("span", null, "✈", -1)),
        R("b", null, ae(d.value || "正在加入房间…"), 1),
        d.value ? (Q(), ee("a", {
          key: 0,
          href: p.value
        }, "返回大厅", 8, fc)) : In("", !0)
      ]))
    ]));
  }
});
Eo(uc).mount("#app");
