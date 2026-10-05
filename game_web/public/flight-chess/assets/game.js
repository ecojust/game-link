import { GameLinkClient as si } from "./gamelink.js?v=44bdd90734fe";
// @__NO_SIDE_EFFECTS__
function zn(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const ee = {}, pt = [], Ve = () => {
}, Gs = () => !1, gn = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), mn = (e) => e.startsWith("onUpdate:"), ae = Object.assign, Yn = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, ri = Object.prototype.hasOwnProperty, W = (e, t) => ri.call(e, t), D = Array.isArray, ot = (e) => Gt(e) === "[object Map]", ln = (e) => Gt(e) === "[object Set]", ms = (e) => Gt(e) === "[object Date]", H = (e) => typeof e == "function", te = (e) => typeof e == "string", Be = (e) => typeof e == "symbol", z = (e) => e !== null && typeof e == "object", Zs = (e) => (z(e) || H(e)) && H(e.then) && H(e.catch), qs = Object.prototype.toString, Gt = (e) => qs.call(e), ii = (e) => Gt(e).slice(8, -1), zs = (e) => Gt(e) === "[object Object]", Xn = (e) => te(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Ft = /* @__PURE__ */ zn(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), vn = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, li = /-\w/g, Ae = vn(
  (e) => e.replace(li, (t) => t.slice(1).toUpperCase())
), oi = /\B([A-Z])/g, ut = vn(
  (e) => e.replace(oi, "-$1").toLowerCase()
), Ys = vn((e) => e.charAt(0).toUpperCase() + e.slice(1)), En = vn(
  (e) => e ? `on${Ys(e)}` : ""
), Ke = (e, t) => !Object.is(e, t), An = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, Xs = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, ci = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let vs;
const yn = () => vs || (vs = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function _n(e) {
  if (D(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], r = te(s) ? di(s) : _n(s);
      if (r)
        for (const i in r)
          t[i] = r[i];
    }
    return t;
  } else if (te(e) || z(e))
    return e;
}
const fi = /;(?![^(]*\))/g, ui = /:([^]+)/, ai = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function di(e) {
  const t = {};
  return e.replace(ai, (n) => n.startsWith("/*") ? "" : n).split(fi).forEach((n) => {
    if (n) {
      const s = n.split(ui);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function yt(e) {
  let t = "";
  if (te(e))
    t = e;
  else if (D(e))
    for (let n = 0; n < e.length; n++) {
      const s = yt(e[n]);
      s && (t += s + " ");
    }
  else if (z(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const hi = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", pi = /* @__PURE__ */ zn(hi);
function Qs(e) {
  return !!e || e === "";
}
function gi(e, t, n) {
  if (e.length !== t.length) return !1;
  let s = !0;
  for (let r = 0; s && r < e.length; r++)
    s = bn(e[r], t[r], n);
  return s;
}
function ys(e, t, n) {
  if (e.size !== t.size) return !1;
  const s = Array.from(t), r = new Uint8Array(s.length);
  for (const i of e) {
    let l = -1;
    for (let o = 0; o < s.length; o++)
      if (!r[o] && bn(i, s[o], n)) {
        l = o;
        break;
      }
    if (l < 0) return !1;
    r[l] = 1;
  }
  return !0;
}
function mi(e, t, n) {
  let s = ot(e), r = ot(t);
  if (s || r || (s = ln(e), r = ln(t), s || r))
    return s && r ? ys(e, t, n) : !1;
  const i = Object.keys(e).length, l = Object.keys(t).length;
  if (i !== l)
    return !1;
  for (const o in e) {
    const f = e.hasOwnProperty(o), a = t.hasOwnProperty(o);
    if (f && !a || !f && a || !bn(e[o], t[o], n))
      return !1;
  }
  return String(e) === String(t);
}
function _s(e, t, n, s) {
  n || (n = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()]);
  const [r, i] = n;
  if (r.has(e) || i.has(t))
    return r.get(e) === t && i.get(t) === e;
  r.set(e, t), i.set(t, e);
  const l = s(e, t, n);
  return r.delete(e), i.delete(t), l;
}
function bn(e, t, n) {
  if (e === t) return !0;
  let s = ms(e), r = ms(t);
  return s || r ? s && r ? e.getTime() === t.getTime() : !1 : (s = Be(e), r = Be(t), s || r ? e === t : (s = D(e), r = D(t), s || r ? s && r ? _s(e, t, n, gi) : !1 : (s = z(e), r = z(t), s || r ? !s || !r ? !1 : _s(e, t, n, mi) : String(e) === String(t))));
}
const er = (e) => !!(e && e.__v_isRef === !0), he = (e) => te(e) ? e : e == null ? "" : D(e) || z(e) && (e.toString === qs || !H(e.toString)) ? er(e) ? he(e.value) : JSON.stringify(e, tr, 2) : String(e), tr = (e, t) => er(t) ? tr(e, t.value) : ot(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, r], i) => (n[In(s, i) + " =>"] = r, n),
    {}
  )
} : ln(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => In(n))
} : Be(t) ? In(t) : z(t) && !D(t) && !zs(t) ? String(t) : t, In = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    Be(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
let ue;
class vi {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !t && ue && (ue.active ? (this.parent = ue, this.index = (ue.scopes || (ue.scopes = [])).push(
      this
    ) - 1) : (this._active = !1, this._warnOnRun = !1));
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, n;
      if (this.scopes) {
        const s = this.scopes.slice();
        for (t = 0, n = s.length; t < n; t++)
          s[t].pause();
      }
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, n;
      if (this.scopes) {
        const r = this.scopes.slice();
        for (t = 0, n = r.length; t < n; t++)
          r[t].resume();
      }
      const s = this.effects.slice();
      for (t = 0, n = s.length; t < n; t++)
        s[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = ue;
      try {
        return ue = this, t();
      } finally {
        ue = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = ue, ue = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (ue === this)
        ue = this.prevScope;
      else {
        let t = ue;
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
      let n, s;
      for (n = 0, s = this.effects.length; n < s; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, s = this.cleanups.length; n < s; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        const r = this.scopes.slice();
        for (n = 0, s = r.length; n < s; n++)
          r[n].stop(!0);
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
function yi() {
  return ue;
}
let Q;
const $n = /* @__PURE__ */ new WeakSet();
class nr {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, ue && (ue.active ? ue.effects.push(this) : this.flags &= -2);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, $n.has(this) && ($n.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || rr(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, bs(this), ir(this);
    const t = Q, n = Ie;
    Q = this, Ie = !0;
    try {
      return this.fn();
    } finally {
      lr(this), Q = t, Ie = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        ts(t);
      this.deps = this.depsTail = void 0, bs(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? $n.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Hn(this) && this.run();
  }
  get dirty() {
    return Hn(this);
  }
}
let sr = 0, Nt, kt;
function rr(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = kt, kt = e;
    return;
  }
  e.next = Nt, Nt = e;
}
function Qn() {
  sr++;
}
function es() {
  if (--sr > 0)
    return;
  if (kt) {
    let t = kt;
    for (kt = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; Nt; ) {
    let t = Nt;
    for (Nt = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (s) {
          e || (e = s);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function ir(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function lr(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const r = s.prevDep;
    s.version === -1 ? (s === n && (n = r), ts(s), _i(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = r;
  }
  e.deps = t, e.depsTail = n;
}
function Hn(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (or(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function or(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Kt) || (e.globalVersion = Kt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Hn(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = Q, s = Ie;
  Q = e, Ie = !0;
  try {
    ir(e);
    const r = e.fn(e._value);
    (t.version === 0 || Ke(r, e._value)) && (e.flags |= 128, e._value = r, t.version++);
  } catch (r) {
    throw t.version++, r;
  } finally {
    Q = n, Ie = s, lr(e), e.flags &= -3;
  }
}
function ts(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: r } = e;
  if (s && (s.nextSub = r, e.prevSub = void 0), r && (r.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let i = n.computed.deps; i; i = i.nextDep)
      ts(i, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function _i(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let Ie = !0;
const cr = [];
function Qe() {
  cr.push(Ie), Ie = !1;
}
function et() {
  const e = cr.pop();
  Ie = e === void 0 ? !0 : e;
}
function bs(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = Q;
    Q = void 0;
    try {
      t();
    } finally {
      Q = n;
    }
  }
}
let Kt = 0;
class bi {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class ns {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!Q || !Ie || Q === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== Q)
      n = this.activeLink = new bi(Q, this), Q.deps ? (n.prevDep = Q.depsTail, Q.depsTail.nextDep = n, Q.depsTail = n) : Q.deps = Q.depsTail = n, fr(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = Q.depsTail, n.nextDep = void 0, Q.depsTail.nextDep = n, Q.depsTail = n, Q.deps === n && (Q.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, Kt++, this.notify(t);
  }
  notify(t) {
    Qn();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      es();
    }
  }
}
function fr(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        fr(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const Kn = /* @__PURE__ */ new WeakMap(), mt = /* @__PURE__ */ Symbol(
  ""
), Un = /* @__PURE__ */ Symbol(
  ""
), Ut = /* @__PURE__ */ Symbol(
  ""
);
function pe(e, t, n) {
  if (Ie && Q) {
    let s = Kn.get(e);
    s || Kn.set(e, s = /* @__PURE__ */ new Map());
    let r = s.get(n);
    r || (s.set(n, r = new ns()), r.map = s, r.key = n), r.track();
  }
}
function Xe(e, t, n, s, r, i) {
  const l = Kn.get(e);
  if (!l) {
    Kt++;
    return;
  }
  const o = (f) => {
    f && f.trigger();
  };
  if (Qn(), t === "clear")
    l.forEach(o);
  else {
    const f = D(e), a = f && Xn(n);
    if (f && n === "length") {
      const d = Number(s);
      l.forEach((p, O) => {
        (O === "length" || O === Ut || !Be(O) && O >= d) && o(p);
      });
    } else
      switch ((n !== void 0 || l.has(void 0)) && o(l.get(n)), a && o(l.get(Ut)), t) {
        case "add":
          f ? a && o(l.get("length")) : (o(l.get(mt)), ot(e) && o(l.get(Un)));
          break;
        case "delete":
          f || (o(l.get(mt)), ot(e) && o(l.get(Un)));
          break;
        case "set":
          ot(e) && o(l.get(mt));
          break;
      }
  }
  es();
}
function Mt(e) {
  const t = /* @__PURE__ */ B(e);
  return t === e || (pe(t, "iterate", Ut), /* @__PURE__ */ Te(e)) ? t : /* @__PURE__ */ We(e) ? /* @__PURE__ */ ct(e) ? t.map((n) => ft(Oe(n))) : t.map(ft) : t.map(Oe);
}
function xn(e) {
  return pe(e = /* @__PURE__ */ B(e), "iterate", Ut), e;
}
function De(e, t) {
  return /* @__PURE__ */ We(e) ? ft(/* @__PURE__ */ ct(e) ? Oe(t) : t) : Oe(t);
}
const xi = {
  __proto__: null,
  [Symbol.iterator]() {
    return Pn(this, Symbol.iterator, (e) => De(this, e));
  },
  concat(...e) {
    return Mt(this).concat(
      ...e.map((t) => D(t) ? Mt(t) : t)
    );
  },
  entries() {
    return Pn(this, "entries", (e) => (e[1] = De(this, e[1]), e));
  },
  every(e, t) {
    return Ze(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return Ze(
      this,
      "filter",
      e,
      t,
      (n) => n.map((s) => De(this, s)),
      arguments
    );
  },
  find(e, t) {
    return Ze(
      this,
      "find",
      e,
      t,
      (n) => De(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return Ze(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return Ze(
      this,
      "findLast",
      e,
      t,
      (n) => De(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return Ze(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return Ze(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Ln(this, "includes", e);
  },
  indexOf(...e) {
    return Ln(this, "indexOf", e);
  },
  join(e) {
    return Mt(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return Ln(this, "lastIndexOf", e);
  },
  map(e, t) {
    return Ze(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return $t(this, "pop");
  },
  push(...e) {
    return $t(this, "push", e);
  },
  reduce(e, ...t) {
    return xs(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return xs(this, "reduceRight", e, t);
  },
  shift() {
    return $t(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return Ze(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return $t(this, "splice", e);
  },
  toReversed() {
    return Mt(this).toReversed();
  },
  toSorted(e) {
    return Mt(this).toSorted(e);
  },
  toSpliced(...e) {
    return Mt(this).toSpliced(...e);
  },
  unshift(...e) {
    return $t(this, "unshift", e);
  },
  values() {
    return Pn(this, "values", (e) => De(this, e));
  }
};
function Pn(e, t, n) {
  const s = xn(e), r = s[t]();
  return s !== e && !/* @__PURE__ */ Te(e) && (r._next = r.next, r.next = () => {
    const i = r._next();
    return i.done || (i.value = n(i.value)), i;
  }), r;
}
const wi = Array.prototype;
function Ze(e, t, n, s, r, i) {
  const l = xn(e), o = l !== e && !/* @__PURE__ */ Te(e), f = l[t];
  if (f !== wi[t]) {
    const p = f.apply(e, i);
    return o ? Oe(p) : p;
  }
  let a = n;
  l !== e && (o ? a = function(p, O) {
    return n.call(this, De(e, p), O, e);
  } : n.length > 2 && (a = function(p, O) {
    return n.call(this, p, O, e);
  }));
  const d = f.call(l, a, s);
  return o && r ? r(d) : d;
}
function xs(e, t, n, s) {
  const r = xn(e), i = r !== e && !/* @__PURE__ */ Te(e);
  let l = n, o = !1;
  r !== e && (i ? (o = s.length === 0, l = function(a, d, p) {
    return o && (o = !1, a = De(e, a)), n.call(this, a, De(e, d), p, e);
  }) : n.length > 3 && (l = function(a, d, p) {
    return n.call(this, a, d, p, e);
  }));
  const f = r[t](l, ...s);
  return o ? De(e, f) : f;
}
function Ln(e, t, n) {
  const s = /* @__PURE__ */ B(e);
  pe(s, "iterate", Ut);
  const r = s[t](...n);
  return (r === -1 || r === !1) && /* @__PURE__ */ ls(n[0]) ? (n[0] = /* @__PURE__ */ B(n[0]), s[t](...n)) : r;
}
function $t(e, t, n = []) {
  Qe(), Qn();
  const s = (/* @__PURE__ */ B(e))[t].apply(e, n);
  return es(), et(), s;
}
const Mi = /* @__PURE__ */ zn("__proto__,__v_isRef,__isVue"), ur = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Be)
);
function Si(e) {
  Be(e) || (e = String(e));
  const t = /* @__PURE__ */ B(this);
  return pe(t, "has", e), t.hasOwnProperty(e);
}
class ar {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, s) {
    if (n === "__v_skip") return t.__v_skip;
    const r = this._isReadonly, i = this._isShallow;
    if (n === "__v_isReactive")
      return !r;
    if (n === "__v_isReadonly")
      return r;
    if (n === "__v_isShallow")
      return i;
    if (n === "__v_raw")
      return s === (r ? i ? Ri : gr : i ? pr : hr).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const l = D(t);
    if (!r) {
      let f;
      if (l && (f = xi[n]))
        return f;
      if (n === "hasOwnProperty")
        return Si;
    }
    const o = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ ge(t) ? t : s
    );
    if ((Be(n) ? ur.has(n) : Mi(n)) || (r || pe(t, "get", n), i))
      return o;
    if (/* @__PURE__ */ ge(o)) {
      const f = l && Xn(n) ? o : o.value;
      return r && z(f) ? /* @__PURE__ */ Bn(f) : f;
    }
    return z(o) ? r ? /* @__PURE__ */ Bn(o) : /* @__PURE__ */ rs(o) : o;
  }
}
class dr extends ar {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, r) {
    let i = t[n];
    const l = D(t) && Xn(n);
    if (!this._isShallow) {
      const a = /* @__PURE__ */ We(i);
      if (!/* @__PURE__ */ Te(s) && !/* @__PURE__ */ We(s) && (i = /* @__PURE__ */ B(i), s = /* @__PURE__ */ B(s)), !l && /* @__PURE__ */ ge(i) && !/* @__PURE__ */ ge(s))
        return a || (i.value = s), !0;
    }
    const o = l ? Number(n) < t.length : W(t, n), f = Reflect.set(
      t,
      n,
      s,
      /* @__PURE__ */ ge(t) ? t : r
    );
    return t === /* @__PURE__ */ B(r) && f && (o ? Ke(s, i) && Xe(t, "set", n, s) : Xe(t, "add", n, s)), f;
  }
  deleteProperty(t, n) {
    const s = W(t, n);
    t[n];
    const r = Reflect.deleteProperty(t, n);
    return r && s && Xe(t, "delete", n, void 0), r;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!Be(n) || !ur.has(n)) && pe(t, "has", n), s;
  }
  ownKeys(t) {
    return pe(
      t,
      "iterate",
      D(t) ? "length" : mt
    ), Reflect.ownKeys(t);
  }
}
class Ci extends ar {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return !0;
  }
  deleteProperty(t, n) {
    return !0;
  }
}
const Ti = /* @__PURE__ */ new dr(), Oi = /* @__PURE__ */ new Ci(), Ei = /* @__PURE__ */ new dr(!0);
const Vn = (e) => e, Yt = (e) => Reflect.getPrototypeOf(e);
function Ai(e, t, n) {
  return function(...s) {
    const r = this.__v_raw, i = /* @__PURE__ */ B(r), l = ot(i), o = e === "entries" || e === Symbol.iterator && l, f = e === "keys" && l, a = r[e](...s), d = n ? Vn : t ? ft : Oe;
    return !t && pe(
      i,
      "iterate",
      f ? Un : mt
    ), ae(
      // inheriting all iterator properties
      Object.create(a),
      {
        // iterator protocol
        next() {
          const { value: p, done: O } = a.next();
          return O ? { value: p, done: O } : {
            value: o ? [d(p[0]), d(p[1])] : d(p),
            done: O
          };
        }
      }
    );
  };
}
function Xt(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Ii(e, t) {
  const n = {
    get(r) {
      const i = this.__v_raw, l = /* @__PURE__ */ B(i), o = /* @__PURE__ */ B(r);
      e || (Ke(r, o) && pe(l, "get", r), pe(l, "get", o));
      const { has: f } = Yt(l), a = t ? Vn : e ? ft : Oe;
      if (f.call(l, r))
        return a(i.get(r));
      if (f.call(l, o))
        return a(i.get(o));
      i !== l && i.get(r);
    },
    get size() {
      const r = this.__v_raw;
      return !e && pe(/* @__PURE__ */ B(r), "iterate", mt), r.size;
    },
    has(r) {
      const i = this.__v_raw, l = /* @__PURE__ */ B(i), o = /* @__PURE__ */ B(r);
      return e || (Ke(r, o) && pe(l, "has", r), pe(l, "has", o)), r === o ? i.has(r) : i.has(r) || i.has(o);
    },
    forEach(r, i) {
      const l = this, o = l.__v_raw, f = /* @__PURE__ */ B(o), a = t ? Vn : e ? ft : Oe;
      return !e && pe(f, "iterate", mt), o.forEach((d, p) => r.call(i, a(d), a(p), l));
    }
  };
  return ae(
    n,
    e ? {
      add: Xt("add"),
      set: Xt("set"),
      delete: Xt("delete"),
      clear: Xt("clear")
    } : {
      add(r) {
        const i = /* @__PURE__ */ B(this), l = Yt(i), o = /* @__PURE__ */ B(r), f = !t && !/* @__PURE__ */ Te(r) && !/* @__PURE__ */ We(r) ? o : r;
        return l.has.call(i, f) || Ke(r, f) && l.has.call(i, r) || Ke(o, f) && l.has.call(i, o) || (i.add(f), Xe(i, "add", f, f)), this;
      },
      set(r, i) {
        !t && !/* @__PURE__ */ Te(i) && !/* @__PURE__ */ We(i) && (i = /* @__PURE__ */ B(i));
        const l = /* @__PURE__ */ B(this), { has: o, get: f } = Yt(l);
        let a = o.call(l, r);
        a || (r = /* @__PURE__ */ B(r), a = o.call(l, r));
        const d = f.call(l, r);
        return l.set(r, i), a ? Ke(i, d) && Xe(l, "set", r, i) : Xe(l, "add", r, i), this;
      },
      delete(r) {
        const i = /* @__PURE__ */ B(this), { has: l, get: o } = Yt(i);
        let f = l.call(i, r);
        f || (r = /* @__PURE__ */ B(r), f = l.call(i, r)), o && o.call(i, r);
        const a = i.delete(r);
        return f && Xe(i, "delete", r, void 0), a;
      },
      clear() {
        const r = /* @__PURE__ */ B(this), i = r.size !== 0, l = r.clear();
        return i && Xe(
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
    n[r] = Ai(r, e, t);
  }), n;
}
function ss(e, t) {
  const n = Ii(e, t);
  return (s, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? s : Reflect.get(
    W(n, r) && r in s ? n : s,
    r,
    i
  );
}
const $i = {
  get: /* @__PURE__ */ ss(!1, !1)
}, Pi = {
  get: /* @__PURE__ */ ss(!1, !0)
}, Li = {
  get: /* @__PURE__ */ ss(!0, !1)
};
const hr = /* @__PURE__ */ new WeakMap(), pr = /* @__PURE__ */ new WeakMap(), gr = /* @__PURE__ */ new WeakMap(), Ri = /* @__PURE__ */ new WeakMap();
function Fi(e) {
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
function rs(e) {
  return /* @__PURE__ */ We(e) ? e : is(
    e,
    !1,
    Ti,
    $i,
    hr
  );
}
// @__NO_SIDE_EFFECTS__
function Ni(e) {
  return is(
    e,
    !1,
    Ei,
    Pi,
    pr
  );
}
// @__NO_SIDE_EFFECTS__
function Bn(e) {
  return is(
    e,
    !0,
    Oi,
    Li,
    gr
  );
}
function is(e, t, n, s, r) {
  if (!z(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const i = r.get(e);
  if (i)
    return i;
  const l = Fi(ii(e));
  if (l === 0)
    return e;
  const o = new Proxy(
    e,
    l === 2 ? s : n
  );
  return r.set(e, o), o;
}
// @__NO_SIDE_EFFECTS__
function ct(e) {
  return /* @__PURE__ */ We(e) ? /* @__PURE__ */ ct(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function We(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Te(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function ls(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function B(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ B(t) : e;
}
function ki(e) {
  return !W(e, "__v_skip") && Object.isExtensible(e) && Xs(e, "__v_skip", !0), e;
}
const Oe = (e) => z(e) ? /* @__PURE__ */ rs(e) : e, ft = (e) => z(e) ? /* @__PURE__ */ Bn(e) : e;
// @__NO_SIDE_EFFECTS__
function ge(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function Se(e) {
  return mr(e, !1);
}
// @__NO_SIDE_EFFECTS__
function ji(e) {
  return mr(e, !0);
}
function mr(e, t) {
  return /* @__PURE__ */ ge(e) ? e : new Di(e, t);
}
class Di {
  constructor(t, n) {
    this.dep = new ns(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : /* @__PURE__ */ B(t), this._value = n ? t : Oe(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || /* @__PURE__ */ Te(t) || /* @__PURE__ */ We(t);
    t = s ? t : /* @__PURE__ */ B(t), Ke(t, n) && (this._rawValue = t, this._value = s ? t : Oe(t), this.dep.trigger());
  }
}
function St(e) {
  return /* @__PURE__ */ ge(e) ? e.value : e;
}
const Hi = {
  get: (e, t, n) => t === "__v_raw" ? e : St(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const r = e[t];
    return /* @__PURE__ */ ge(r) && !/* @__PURE__ */ ge(n) ? (r.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function vr(e) {
  return /* @__PURE__ */ ct(e) ? e : new Proxy(e, Hi);
}
class Ki {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new ns(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Kt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    Q !== this)
      return rr(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return or(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function Ui(e, t, n = !1) {
  let s, r;
  return H(e) ? s = e : (s = e.get, r = e.set), new Ki(s, r, n);
}
const Qt = {}, on = /* @__PURE__ */ new WeakMap();
let ht;
function Vi(e, t = !1, n = ht) {
  if (n) {
    let s = on.get(n);
    s || on.set(n, s = []), s.push(e);
  }
}
function Bi(e, t, n = ee) {
  const { immediate: s, deep: r, once: i, scheduler: l, augmentJob: o, call: f } = n, a = ($) => r ? $ : /* @__PURE__ */ Te($) || r === !1 || r === 0 ? lt($, 1) : lt($);
  let d, p, O, I, R = !1, _ = !1;
  if (/* @__PURE__ */ ge(e) ? (p = () => e.value, R = /* @__PURE__ */ Te(e)) : /* @__PURE__ */ ct(e) ? (p = () => a(e), R = !0) : D(e) ? (_ = !0, R = e.some(($) => /* @__PURE__ */ ct($) || /* @__PURE__ */ Te($)), p = () => e.map(($) => {
    if (/* @__PURE__ */ ge($))
      return $.value;
    if (/* @__PURE__ */ ct($))
      return a($);
    if (H($))
      return f ? f($, 2) : $();
  })) : H(e) ? t ? p = f ? () => f(e, 2) : e : p = () => {
    if (O) {
      Qe();
      try {
        O();
      } finally {
        et();
      }
    }
    const $ = ht;
    ht = d;
    try {
      return f ? f(e, 3, [I]) : e(I);
    } finally {
      ht = $;
    }
  } : p = Ve, t && r) {
    const $ = p, J = r === !0 ? 1 / 0 : r;
    p = () => lt($(), J);
  }
  const b = yi(), F = () => {
    d.stop(), b && b.active && Yn(b.effects, d);
  };
  if (i && t) {
    const $ = t;
    t = (...J) => {
      const le = $(...J);
      return F(), le;
    };
  }
  let A = _ ? new Array(e.length).fill(Qt) : Qt;
  const K = ($) => {
    if (!(!(d.flags & 1) || !d.dirty && !$))
      if (t) {
        const J = d.run();
        if ($ || r || R || (_ ? J.some((le, de) => Ke(le, A[de])) : Ke(J, A))) {
          O && O();
          const le = ht;
          ht = d;
          try {
            const de = [
              J,
              // pass undefined as the old value when it's changed for the first time
              A === Qt ? void 0 : _ && A[0] === Qt ? [] : A,
              I
            ];
            A = J, f ? f(t, 3, de) : (
              // @ts-expect-error
              t(...de)
            );
          } finally {
            ht = le;
          }
        }
      } else
        d.run();
  };
  return o && o(K), d = new nr(p), d.scheduler = l ? () => l(K, !1) : K, I = ($) => Vi($, !1, d), O = d.onStop = () => {
    const $ = on.get(d);
    if ($) {
      if (f)
        f($, 4);
      else
        for (const J of $) J();
      on.delete(d);
    }
  }, t ? s ? K(!0) : A = d.run() : l ? l(K.bind(null, !0), !0) : d.run(), F.pause = d.pause.bind(d), F.resume = d.resume.bind(d), F.stop = F, F;
}
function lt(e, t = 1 / 0, n) {
  if (t <= 0 || !z(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, /* @__PURE__ */ ge(e))
    lt(e.value, t, n);
  else if (D(e))
    for (let s = 0; s < e.length; s++)
      lt(e[s], t, n);
  else if (ln(e) || ot(e))
    e.forEach((s) => {
      lt(s, t, n);
    });
  else if (zs(e)) {
    for (const s in e)
      lt(e[s], t, n);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && lt(e[s], t, n);
  }
  return e;
}
function Zt(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (r) {
    wn(r, t, n);
  }
}
function $e(e, t, n, s) {
  if (H(e)) {
    const r = Zt(e, t, n, s);
    return r && Zs(r) && r.catch((i) => {
      wn(i, t, n);
    }), r;
  }
  if (D(e)) {
    const r = [];
    for (let i = 0; i < e.length; i++)
      r.push($e(e[i], t, n, s));
    return r;
  }
}
function wn(e, t, n, s = !0) {
  const r = t ? t.vnode : null, { errorHandler: i, throwUnhandledErrorInProduction: l } = t && t.appContext.config || ee;
  if (t) {
    let o = t.parent;
    const f = t.proxy, a = `https://vuejs.org/error-reference/#runtime-${n}`;
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
      Qe(), Zt(i, null, 10, [
        e,
        f,
        a
      ]), et();
      return;
    }
  }
  Wi(e, n, r, s, l);
}
function Wi(e, t, n, s = !0, r = !1) {
  if (r)
    throw e;
  console.error(e);
}
const ve = [];
let je = -1;
const Tt = [];
let it = null, Ct = 0;
const yr = /* @__PURE__ */ Promise.resolve();
let cn = null;
function Ji(e) {
  const t = cn || yr;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Gi(e) {
  let t = je + 1, n = ve.length;
  for (; t < n; ) {
    const s = t + n >>> 1, r = ve[s], i = Vt(r);
    i < e || i === e && r.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function os(e) {
  if (!(e.flags & 1)) {
    const t = Vt(e), n = ve[ve.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Vt(n) ? ve.push(e) : ve.splice(Gi(t), 0, e), e.flags |= 1, _r();
  }
}
function _r() {
  cn || (cn = yr.then(xr));
}
function Zi(e) {
  if (!D(e))
    it && e.id === -1 ? it.splice(Ct + 1, 0, e) : e.flags & 1 || (Tt.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      Tt.push(e[t]);
  _r();
}
function ws(e, t, n = je + 1) {
  for (; n < ve.length; n++) {
    const s = ve[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid)
        continue;
      ve.splice(n, 1), n--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2);
    }
  }
}
function br(e) {
  if (Tt.length) {
    const t = [...new Set(Tt)].sort(
      (n, s) => Vt(n) - Vt(s)
    );
    if (Tt.length = 0, it) {
      for (let n = 0; n < t.length; n++)
        it.push(t[n]);
      return;
    }
    for (it = t, Ct = 0; Ct < it.length; Ct++) {
      const n = it[Ct];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    it = null, Ct = 0;
  }
}
const Vt = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function xr(e) {
  try {
    for (je = 0; je < ve.length; je++) {
      const t = ve[je];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), Zt(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; je < ve.length; je++) {
      const t = ve[je];
      t && (t.flags &= -2);
    }
    je = -1, ve.length = 0, br(), cn = null, (ve.length || Tt.length) && xr();
  }
}
let Ue = null, wr = null;
function fn(e) {
  const t = Ue;
  return Ue = e, wr = e && e.type.__scopeId || null, t;
}
function qi(e, t = Ue, n) {
  if (!t || e._n)
    return e;
  const s = (...r) => {
    s._d && Ls(-1);
    const i = fn(t), l = vt.length;
    let o;
    try {
      o = e(...r);
    } finally {
      for (let f = vt.length; f > l; f--) Zr();
      fn(i), s._d && Ls(1);
    }
    return o;
  };
  return s._n = !0, s._c = !0, s._d = !0, s;
}
function at(e, t, n, s) {
  const r = e.dirs, i = t && t.dirs;
  for (let l = 0; l < r.length; l++) {
    const o = r[l];
    i && (o.oldValue = i[l].value);
    let f = o.dir[s];
    f && (Qe(), $e(f, n, 8, [
      e.el,
      o,
      e,
      t
    ]), et());
  }
}
function zi(e, t) {
  if (ye) {
    let n = ye.provides;
    const s = ye.parent && ye.parent.provides;
    s === n && (n = ye.provides = Object.create(s)), n[e] = t;
  }
}
function tn(e, t, n = !1) {
  const s = Jl();
  if (s || Ot) {
    let r = Ot ? Ot._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (r && e in r)
      return r[e];
    if (arguments.length > 1)
      return n && H(t) ? t.call(s && s.proxy) : t;
  }
}
const Yi = /* @__PURE__ */ Symbol.for("v-scx"), Xi = () => tn(Yi);
function Rn(e, t, n) {
  return Mr(e, t, n);
}
function Mr(e, t, n = ee) {
  const { immediate: s, deep: r, flush: i, once: l } = n, o = ae({}, n), f = t && s || !t && i !== "post";
  let a;
  if (Jt) {
    if (i === "sync") {
      const I = Xi();
      a = I.__watcherHandles || (I.__watcherHandles = []);
    } else if (!f) {
      const I = () => {
      };
      return I.stop = Ve, I.resume = Ve, I.pause = Ve, I;
    }
  }
  const d = ye;
  o.call = (I, R, _) => $e(I, d, R, _);
  let p = !1;
  i === "post" ? o.scheduler = (I) => {
    be(I, d && d.suspense);
  } : i !== "sync" && (p = !0, o.scheduler = (I, R) => {
    R ? I() : os(I);
  }), o.augmentJob = (I) => {
    t && (I.flags |= 4), p && (I.flags |= 2, d && (I.id = d.uid, I.i = d));
  };
  const O = Bi(e, t, o);
  return Jt && (a ? a.push(O) : f && O()), O;
}
function Qi(e, t, n) {
  const s = this.proxy, r = te(e) ? e.includes(".") ? Sr(s, e) : () => s[e] : e.bind(s, s);
  let i;
  H(t) ? i = t : (i = t.handler, n = t);
  const l = qt(this), o = Mr(r, i.bind(s), n);
  return l(), o;
}
function Sr(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let r = 0; r < n.length && s; r++)
      s = s[n[r]];
    return s;
  };
}
const el = /* @__PURE__ */ Symbol("_vte"), Mn = (e) => e.__isTeleport, Fn = /* @__PURE__ */ Symbol("_leaveCb");
function tl(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const n of e)
      if (n.type !== tt) {
        t = n;
        break;
      }
  }
  return t;
}
function Cr(e) {
  if (!fs(e))
    return Mn(e.type) && e.children ? tl(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: n } = e;
  if (n) {
    if (t & 16)
      return n[0];
    if (t & 32 && H(n.default))
      return n.default();
  }
}
function cs(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const n = e.component.subTree;
    cs(
      Mn(n.type) && Cr(n) || n,
      t
    );
  } else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function Sn(e, t) {
  return H(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    ae({ name: e.name }, t, { setup: e })
  ) : e;
}
function Tr(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function Ms(e, t) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
const un = /* @__PURE__ */ new WeakMap();
function jt(e, t, n, s, r = !1) {
  if (D(e)) {
    e.forEach(
      (_, b) => jt(
        _,
        t && (D(t) ? t[b] : t),
        n,
        s,
        r
      )
    );
    return;
  }
  if (Dt(s) && !r) {
    s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && jt(e, t, n, s.component.subTree);
    return;
  }
  const i = s.shapeFlag & 4 ? ds(s.component) : s.el, l = r ? null : i, { i: o, r: f } = e, a = t && t.r, d = o.refs === ee ? o.refs = {} : o.refs, p = o.setupState, O = /* @__PURE__ */ B(p), I = p === ee ? Gs : (_) => Ms(d, _) ? !1 : W(O, _), R = (_, b) => !(b && Ms(d, b));
  if (a != null && a !== f) {
    if (Ss(t), te(a))
      d[a] = null, I(a) && (p[a] = null);
    else if (/* @__PURE__ */ ge(a)) {
      const _ = t;
      R(a, _.k) && (a.value = null), _.k && (d[_.k] = null);
    }
  }
  if (H(f))
    Zt(f, o, 12, [l, d]);
  else {
    const _ = te(f), b = /* @__PURE__ */ ge(f);
    if (_ || b) {
      const F = () => {
        if (e.f) {
          const A = _ ? I(f) ? p[f] : d[f] : R() || !e.k ? f.value : d[e.k];
          if (r)
            D(A) && Yn(A, i);
          else if (D(A))
            A.includes(i) || A.push(i);
          else if (_)
            d[f] = [i], I(f) && (p[f] = d[f]);
          else {
            const K = [i];
            R(f, e.k) && (f.value = K), e.k && (d[e.k] = K);
          }
        } else _ ? (d[f] = l, I(f) && (p[f] = l)) : b && (R(f, e.k) && (f.value = l), e.k && (d[e.k] = l));
      };
      if (l) {
        const A = () => {
          F(), un.delete(e);
        };
        A.id = -1, un.set(e, A), be(A, n);
      } else
        Ss(e), F();
    }
  }
}
function Ss(e) {
  const t = un.get(e);
  t && (t.flags |= 8, un.delete(e));
}
yn().requestIdleCallback;
yn().cancelIdleCallback;
const Dt = (e) => !!e.type.__asyncLoader, fs = (e) => e.type.__isKeepAlive;
function nl(e, t) {
  Or(e, "a", t);
}
function sl(e, t) {
  Or(e, "da", t);
}
function Or(e, t, n = ye) {
  const s = e.__wdc || (e.__wdc = () => {
    let r = n;
    for (; r; ) {
      if (r.isDeactivated)
        return;
      r = r.parent;
    }
    return e();
  });
  if (Cn(t, s, n), n) {
    let r = n.parent;
    for (; r && r.parent; )
      fs(r.parent.vnode) && rl(s, t, n, r), r = r.parent;
  }
}
function rl(e, t, n, s) {
  const r = Cn(
    t,
    e,
    s,
    !0
    /* prepend */
  );
  Ir(() => {
    Yn(s[t], r);
  }, n);
}
function Cn(e, t, n = ye, s = !1) {
  if (n) {
    const r = n[e] || (n[e] = []), i = t.__weh || (t.__weh = (...l) => {
      Qe();
      const o = qt(n), f = $e(t, n, e, l);
      return o(), et(), f;
    });
    return s ? r.unshift(i) : r.push(i), i;
  }
}
const nt = (e) => (t, n = ye) => {
  (!Jt || e === "sp") && Cn(e, (...s) => t(...s), n);
}, il = nt("bm"), Er = nt("m"), ll = nt(
  "bu"
), ol = nt("u"), Ar = nt(
  "bum"
), Ir = nt("um"), cl = nt(
  "sp"
), fl = nt("rtg"), ul = nt("rtc");
function al(e, t = ye) {
  Cn("ec", e, t);
}
const dl = /* @__PURE__ */ Symbol.for("v-ndc");
function qe(e, t, n, s) {
  let r;
  const i = n, l = D(e);
  if (l || te(e)) {
    const o = l && /* @__PURE__ */ ct(e);
    let f = !1, a = !1;
    o && (f = !/* @__PURE__ */ Te(e), a = /* @__PURE__ */ We(e), e = xn(e)), r = new Array(e.length);
    for (let d = 0, p = e.length; d < p; d++)
      r[d] = t(
        f ? a ? ft(Oe(e[d])) : Oe(e[d]) : e[d],
        d,
        void 0,
        i
      );
  } else if (typeof e == "number") {
    r = new Array(e);
    for (let o = 0; o < e; o++)
      r[o] = t(o + 1, o, void 0, i);
  } else if (z(e))
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
const Wn = (e) => e ? Qr(e) ? ds(e) : Wn(e.parent) : null, Ht = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ ae(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => Wn(e.parent),
    $root: (e) => Wn(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => Pr(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      os(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = Ji.bind(e.proxy)),
    $watch: (e) => Qi.bind(e)
  })
), Nn = (e, t) => e !== ee && !e.__isScriptSetup && W(e, t), hl = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: s, data: r, props: i, accessCache: l, type: o, appContext: f } = e;
    if (t[0] !== "$") {
      const O = l[t];
      if (O !== void 0)
        switch (O) {
          case 1:
            return s[t];
          case 2:
            return r[t];
          case 4:
            return n[t];
          case 3:
            return i[t];
        }
      else {
        if (Nn(s, t))
          return l[t] = 1, s[t];
        if (r !== ee && W(r, t))
          return l[t] = 2, r[t];
        if (W(i, t))
          return l[t] = 3, i[t];
        if (n !== ee && W(n, t))
          return l[t] = 4, n[t];
        Jn && (l[t] = 0);
      }
    }
    const a = Ht[t];
    let d, p;
    if (a)
      return t === "$attrs" && pe(e.attrs, "get", ""), a(e);
    if (
      // css module (injected by vue-loader)
      (d = o.__cssModules) && (d = d[t])
    )
      return d;
    if (n !== ee && W(n, t))
      return l[t] = 4, n[t];
    if (
      // global properties
      p = f.config.globalProperties, W(p, t)
    )
      return p[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: r, ctx: i } = e;
    return Nn(r, t) ? (r[t] = n, !0) : s !== ee && W(s, t) ? (s[t] = n, !0) : W(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (i[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: r, props: i, type: l }
  }, o) {
    let f;
    return !!(n[o] || e !== ee && o[0] !== "$" && W(e, o) || Nn(t, o) || W(i, o) || W(s, o) || W(Ht, o) || W(r.config.globalProperties, o) || (f = l.__cssModules) && f[o]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : W(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function Cs(e) {
  return D(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let Jn = !0;
function pl(e) {
  const t = Pr(e), n = e.proxy, s = e.ctx;
  Jn = !1, t.beforeCreate && Ts(t.beforeCreate, e, "bc");
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
    mounted: O,
    beforeUpdate: I,
    updated: R,
    activated: _,
    deactivated: b,
    beforeDestroy: F,
    beforeUnmount: A,
    destroyed: K,
    unmounted: $,
    render: J,
    renderTracked: le,
    renderTriggered: de,
    errorCaptured: Me,
    serverPrefetch: st,
    // public API
    expose: Je,
    inheritAttrs: Ee,
    // assets
    components: _t,
    directives: bt,
    filters: At
  } = t;
  if (a && gl(a, s, null), l)
    for (const Y in l) {
      const G = l[Y];
      H(G) && (s[Y] = G.bind(n));
    }
  if (r) {
    const Y = r.call(n, n);
    z(Y) && (e.data = /* @__PURE__ */ rs(Y));
  }
  if (Jn = !0, i)
    for (const Y in i) {
      const G = i[Y], Pe = H(G) ? G.bind(n, n) : H(G.get) ? G.get.bind(n, n) : Ve, xt = !H(G) && H(G.set) ? G.set.bind(n) : Ve, Ge = Ce({
        get: Pe,
        set: xt
      });
      Object.defineProperty(s, Y, {
        enumerable: !0,
        configurable: !0,
        get: () => Ge.value,
        set: (_e) => Ge.value = _e
      });
    }
  if (o)
    for (const Y in o)
      $r(o[Y], s, n, Y);
  if (f) {
    const Y = H(f) ? f.call(n) : f;
    Reflect.ownKeys(Y).forEach((G) => {
      zi(G, Y[G]);
    });
  }
  d && Ts(d, e, "c");
  function oe(Y, G) {
    D(G) ? G.forEach((Pe) => Y(Pe.bind(n))) : G && Y(G.bind(n));
  }
  if (oe(il, p), oe(Er, O), oe(ll, I), oe(ol, R), oe(nl, _), oe(sl, b), oe(al, Me), oe(ul, le), oe(fl, de), oe(Ar, A), oe(Ir, $), oe(cl, st), D(Je))
    if (Je.length) {
      const Y = e.exposed || (e.exposed = {});
      Je.forEach((G) => {
        Object.defineProperty(Y, G, {
          get: () => n[G],
          set: (Pe) => n[G] = Pe,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  J && e.render === Ve && (e.render = J), Ee != null && (e.inheritAttrs = Ee), _t && (e.components = _t), bt && (e.directives = bt), st && Tr(e);
}
function gl(e, t, n = Ve) {
  D(e) && (e = Gn(e));
  for (const s in e) {
    const r = e[s];
    let i;
    z(r) ? "default" in r ? i = tn(
      r.from || s,
      r.default,
      !0
    ) : i = tn(r.from || s) : i = tn(r), /* @__PURE__ */ ge(i) ? Object.defineProperty(t, s, {
      enumerable: !0,
      configurable: !0,
      get: () => i.value,
      set: (l) => i.value = l
    }) : t[s] = i;
  }
}
function Ts(e, t, n) {
  $e(
    D(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function $r(e, t, n, s) {
  let r = s.includes(".") ? Sr(n, s) : () => n[s];
  if (te(e)) {
    const i = t[e];
    H(i) && Rn(r, i);
  } else if (H(e))
    Rn(r, e.bind(n));
  else if (z(e))
    if (D(e))
      e.forEach((i) => $r(i, t, n, s));
    else {
      const i = H(e.handler) ? e.handler.bind(n) : t[e.handler];
      H(i) && Rn(r, i, e);
    }
}
function Pr(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: r,
    optionsCache: i,
    config: { optionMergeStrategies: l }
  } = e.appContext, o = i.get(t);
  let f;
  return o ? f = o : !r.length && !n && !s ? f = t : (f = {}, r.length && r.forEach(
    (a) => an(f, a, l, !0)
  ), an(f, t, l)), z(t) && i.set(t, f), f;
}
function an(e, t, n, s = !1) {
  const { mixins: r, extends: i } = t;
  i && an(e, i, n, !0), r && r.forEach(
    (l) => an(e, l, n, !0)
  );
  for (const l in t)
    if (!(s && l === "expose")) {
      const o = ml[l] || n && n[l];
      e[l] = o ? o(e[l], t[l]) : t[l];
    }
  return e;
}
const ml = {
  data: Os,
  props: Es,
  emits: Es,
  // objects
  methods: Lt,
  computed: Lt,
  // lifecycle
  beforeCreate: me,
  created: me,
  beforeMount: me,
  mounted: me,
  beforeUpdate: me,
  updated: me,
  beforeDestroy: me,
  beforeUnmount: me,
  destroyed: me,
  unmounted: me,
  activated: me,
  deactivated: me,
  errorCaptured: me,
  serverPrefetch: me,
  // assets
  components: Lt,
  directives: Lt,
  // watch
  watch: yl,
  // provide / inject
  provide: Os,
  inject: vl
};
function Os(e, t) {
  return t ? e ? function() {
    return ae(
      H(e) ? e.call(this, this) : e,
      H(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function vl(e, t) {
  return Lt(Gn(e), Gn(t));
}
function Gn(e) {
  if (D(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function me(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Lt(e, t) {
  return e ? ae(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Es(e, t) {
  return e ? D(e) && D(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : ae(
    /* @__PURE__ */ Object.create(null),
    Cs(e),
    Cs(t ?? {})
  ) : t;
}
function yl(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = ae(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = me(e[s], t[s]);
  return n;
}
function Lr() {
  return {
    app: null,
    config: {
      isNativeTag: Gs,
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
let _l = 0;
function bl(e, t) {
  return function(s, r = null) {
    H(s) || (s = ae({}, s)), r != null && !z(r) && (r = null);
    const i = Lr(), l = /* @__PURE__ */ new WeakSet(), o = [];
    let f = !1;
    const a = i.app = {
      _uid: _l++,
      _component: s,
      _props: r,
      _container: null,
      _context: i,
      _instance: null,
      version: Xl,
      get config() {
        return i.config;
      },
      set config(d) {
      },
      use(d, ...p) {
        return l.has(d) || (d && H(d.install) ? (l.add(d), d.install(a, ...p)) : H(d) && (l.add(d), d(a, ...p))), a;
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
      mount(d, p, O) {
        if (!f) {
          const I = a._ceVNode || ce(s, r);
          return I.appContext = i, O === !0 ? O = "svg" : O === !1 && (O = void 0), e(I, d, O), f = !0, a._container = d, d.__vue_app__ = a, ds(I.component);
        }
      },
      onUnmount(d) {
        o.push(d);
      },
      unmount() {
        f && ($e(
          o,
          a._instance,
          16
        ), e(null, a._container), delete a._container.__vue_app__);
      },
      provide(d, p) {
        return i.provides[d] = p, a;
      },
      runWithContext(d) {
        const p = Ot;
        Ot = a;
        try {
          return d();
        } finally {
          Ot = p;
        }
      }
    };
    return a;
  };
}
let Ot = null;
const xl = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Ae(t)}Modifiers`] || e[`${ut(t)}Modifiers`];
function wl(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || ee;
  let r = n;
  const i = t.startsWith("update:"), l = i && xl(s, t.slice(7));
  l && (l.trim && (r = n.map((d) => te(d) ? d.trim() : d)), l.number && (r = r.map(ci)));
  let o, f = s[o = En(t)] || // also try camelCase event handler (#2249)
  s[o = En(Ae(t))];
  !f && i && (f = s[o = En(ut(t))]), f && $e(
    f,
    e,
    6,
    r
  );
  const a = s[o + "Once"];
  if (a) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[o])
      return;
    e.emitted[o] = !0, $e(
      a,
      e,
      6,
      r
    );
  }
}
const Ml = /* @__PURE__ */ new WeakMap();
function Rr(e, t, n = !1) {
  const s = n ? Ml : t.emitsCache, r = s.get(e);
  if (r !== void 0)
    return r;
  const i = e.emits;
  let l = {}, o = !1;
  if (!H(e)) {
    const f = (a) => {
      const d = Rr(a, t, !0);
      d && (o = !0, ae(l, d));
    };
    !n && t.mixins.length && t.mixins.forEach(f), e.extends && f(e.extends), e.mixins && e.mixins.forEach(f);
  }
  return !i && !o ? (z(e) && s.set(e, null), null) : (D(i) ? i.forEach((f) => l[f] = null) : ae(l, i), z(e) && s.set(e, l), l);
}
function Tn(e, t) {
  return !e || !gn(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), W(e, t[0].toLowerCase() + t.slice(1)) || W(e, ut(t)) || W(e, t));
}
function As(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: r,
    propsOptions: [i],
    slots: l,
    attrs: o,
    emit: f,
    render: a,
    renderCache: d,
    props: p,
    data: O,
    setupState: I,
    ctx: R,
    inheritAttrs: _
  } = e, b = fn(e);
  let F, A;
  try {
    if (n.shapeFlag & 4) {
      const $ = r || s, J = $;
      F = He(
        a.call(
          J,
          $,
          d,
          p,
          I,
          O,
          R
        )
      ), A = o;
    } else {
      const $ = t;
      F = He(
        $.length > 1 ? $(
          p,
          { attrs: o, slots: l, emit: f }
        ) : $(
          p,
          null
        )
      ), A = t.props ? o : Sl(o);
    }
  } catch ($) {
    vt.length = 0, wn($, e, 1), F = ce(tt);
  }
  let K = F;
  if (A && _ !== !1) {
    const $ = Object.keys(A), { shapeFlag: J } = K;
    $.length && J & 7 && (i && $.some(mn) && (A = Cl(
      A,
      i
    )), K = Et(K, A, !1, !0));
  }
  if (n.dirs && (K = Et(K, null, !1, !0), K.dirs = K.dirs ? K.dirs.concat(n.dirs) : n.dirs), n.transition) {
    const $ = Mn(K.type) && Cr(K) || K;
    cs($, n.transition);
  }
  return F = K, fn(b), F;
}
const Sl = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || gn(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, Cl = (e, t) => {
  const n = {};
  for (const s in e)
    (!mn(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function Tl(e, t, n) {
  const { props: s, children: r, component: i } = e, { props: l, children: o, patchFlag: f } = t, a = i.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && f >= 0) {
    if (f & 1024)
      return !0;
    if (f & 16)
      return s ? Is(s, l, a) : !!l;
    if (f & 8) {
      const d = t.dynamicProps;
      for (let p = 0; p < d.length; p++) {
        const O = d[p];
        if (Fr(l, s, O) && !Tn(a, O))
          return !0;
      }
    }
  } else
    return (r || o) && (!o || !o.$stable) ? !0 : s === l ? !1 : s ? l ? Is(s, l, a) : !0 : !!l;
  return !1;
}
function Is(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let r = 0; r < s.length; r++) {
    const i = s[r];
    if (Fr(t, e, i) && !Tn(n, i))
      return !0;
  }
  return !1;
}
function Fr(e, t, n) {
  const s = e[n], r = t[n];
  return n === "style" && z(s) && z(r) ? !bn(s, r) : s !== r;
}
function Ol({ vnode: e, parent: t, suspense: n }, s) {
  for (; t; ) {
    const r = t.subTree;
    if (r.suspense && r.suspense.activeBranch === e && (r.suspense.vnode.el = r.el = s, e = r), r === e)
      (e = t.vnode).el = s, t = t.parent;
    else
      break;
  }
  n && n.activeBranch === e && (n.vnode.el = s);
}
const Nr = {}, kr = () => Object.create(Nr), jr = (e) => Object.getPrototypeOf(e) === Nr;
function El(e, t, n, s = !1) {
  const r = {}, i = kr();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), Dr(e, t, r, i);
  for (const l in e.propsOptions[0])
    l in r || (r[l] = void 0);
  n ? e.props = s ? r : /* @__PURE__ */ Ni(r) : e.type.props ? e.props = r : e.props = i, e.attrs = i;
}
function Al(e, t, n, s) {
  const {
    props: r,
    attrs: i,
    vnode: { patchFlag: l }
  } = e, o = /* @__PURE__ */ B(r), [f] = e.propsOptions;
  let a = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (s || l > 0) && !(l & 16)
  ) {
    if (l & 8) {
      const d = e.vnode.dynamicProps;
      for (let p = 0; p < d.length; p++) {
        let O = d[p];
        if (Tn(e.emitsOptions, O))
          continue;
        const I = t[O];
        if (f)
          if (W(i, O))
            I !== i[O] && (i[O] = I, a = !0);
          else {
            const R = Ae(O);
            r[R] = Zn(
              f,
              o,
              R,
              I,
              e,
              !1
            );
          }
        else
          I !== i[O] && (i[O] = I, a = !0);
      }
    }
  } else {
    Dr(e, t, r, i) && (a = !0);
    let d;
    for (const p in o)
      (!t || // for camelCase
      !W(t, p) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((d = ut(p)) === p || !W(t, d))) && (f ? n && // for camelCase
      (n[p] !== void 0 || // for kebab-case
      n[d] !== void 0) && (r[p] = Zn(
        f,
        o,
        p,
        void 0,
        e,
        !0
      )) : delete r[p]);
    if (i !== o)
      for (const p in i)
        (!t || !W(t, p)) && (delete i[p], a = !0);
  }
  a && Xe(e.attrs, "set", "");
}
function Dr(e, t, n, s) {
  const [r, i] = e.propsOptions;
  let l = !1, o;
  if (t)
    for (let f in t) {
      if (Ft(f))
        continue;
      const a = t[f];
      let d;
      r && W(r, d = Ae(f)) ? !i || !i.includes(d) ? n[d] = a : (o || (o = {}))[d] = a : Tn(e.emitsOptions, f) || (!(f in s) || a !== s[f]) && (s[f] = a, l = !0);
    }
  if (i) {
    const f = /* @__PURE__ */ B(n), a = o || ee;
    for (let d = 0; d < i.length; d++) {
      const p = i[d];
      n[p] = Zn(
        r,
        f,
        p,
        a[p],
        e,
        !W(a, p)
      );
    }
  }
  return l;
}
function Zn(e, t, n, s, r, i) {
  const l = e[n];
  if (l != null) {
    const o = W(l, "default");
    if (o && s === void 0) {
      const f = l.default;
      if (l.type !== Function && !l.skipFactory && H(f)) {
        const { propsDefaults: a } = r;
        if (n in a)
          s = a[n];
        else {
          const d = qt(r);
          s = a[n] = f.call(
            null,
            t
          ), d();
        }
      } else
        s = f;
      r.ce && r.ce._setProp(n, s);
    }
    l[
      0
      /* shouldCast */
    ] && (i && !o ? s = !1 : l[
      1
      /* shouldCastTrue */
    ] && (s === "" || s === ut(n)) && (s = !0));
  }
  return s;
}
const Il = /* @__PURE__ */ new WeakMap();
function Hr(e, t, n = !1) {
  const s = n ? Il : t.propsCache, r = s.get(e);
  if (r)
    return r;
  const i = e.props, l = {}, o = [];
  let f = !1;
  if (!H(e)) {
    const d = (p) => {
      f = !0;
      const [O, I] = Hr(p, t, !0);
      ae(l, O), I && o.push(...I);
    };
    !n && t.mixins.length && t.mixins.forEach(d), e.extends && d(e.extends), e.mixins && e.mixins.forEach(d);
  }
  if (!i && !f)
    return z(e) && s.set(e, pt), pt;
  if (D(i))
    for (let d = 0; d < i.length; d++) {
      const p = Ae(i[d]);
      $s(p) && (l[p] = ee);
    }
  else if (i)
    for (const d in i) {
      const p = Ae(d);
      if ($s(p)) {
        const O = i[d], I = l[p] = D(O) || H(O) ? { type: O } : ae({}, O), R = I.type;
        let _ = !1, b = !0;
        if (D(R))
          for (let F = 0; F < R.length; ++F) {
            const A = R[F], K = H(A) && A.name;
            if (K === "Boolean") {
              _ = !0;
              break;
            } else K === "String" && (b = !1);
          }
        else
          _ = H(R) && R.name === "Boolean";
        I[
          0
          /* shouldCast */
        ] = _, I[
          1
          /* shouldCastTrue */
        ] = b, (_ || W(I, "default")) && o.push(p);
      }
    }
  const a = [l, o];
  return z(e) && s.set(e, a), a;
}
function $s(e) {
  return e[0] !== "$" && !Ft(e);
}
const us = (e) => e === "_" || e === "_ctx" || e === "$stable", as = (e) => D(e) ? e.map(He) : [He(e)], $l = (e, t, n) => {
  if (t._n)
    return t;
  const s = qi((...r) => as(t(...r)), n);
  return s._c = !1, s;
}, Kr = (e, t, n) => {
  const s = e._ctx;
  for (const r in e) {
    if (us(r)) continue;
    const i = e[r];
    if (H(i))
      t[r] = $l(r, i, s);
    else if (i != null) {
      const l = as(i);
      t[r] = () => l;
    }
  }
}, Ur = (e, t) => {
  const n = as(t);
  e.slots.default = () => n;
}, Vr = (e, t, n) => {
  for (const s in t)
    (n || !us(s)) && (e[s] = t[s]);
}, Pl = (e, t, n) => {
  const s = e.slots = kr();
  if (e.vnode.shapeFlag & 32) {
    const r = t._;
    r ? (Vr(s, t, n), n && Xs(s, "_", r, !0)) : Kr(t, s);
  } else t && Ur(e, t);
}, Ll = (e, t, n) => {
  const { vnode: s, slots: r } = e;
  let i = !0, l = ee;
  if (s.shapeFlag & 32) {
    const o = t._;
    o ? n && o === 1 ? i = !1 : Vr(r, t, n) : (i = !t.$stable, Kr(t, r)), l = t;
  } else t && (Ur(e, t), l = { default: 1 });
  if (i)
    for (const o in r)
      !us(o) && l[o] == null && delete r[o];
}, be = jl;
function Rl(e) {
  return Fl(e);
}
function Fl(e, t) {
  const n = yn();
  n.__VUE__ = !0;
  const {
    insert: s,
    remove: r,
    patchProp: i,
    createElement: l,
    createText: o,
    createComment: f,
    setText: a,
    setElementText: d,
    parentNode: p,
    nextSibling: O,
    setScopeId: I = Ve,
    insertStaticContent: R
  } = e, _ = (c, u, h, y = null, g = null, v = null, C = void 0, S = null, w = !!u.dynamicChildren) => {
    if (c === u)
      return;
    c && !Pt(c, u) && (y = ne(c), _e(c, g, v, !0), c = null), u.patchFlag === -2 && (w = !1, u.dynamicChildren = null), u.dynamicChildren && c && c.dynamicChildren && c.dynamicChildren.hasOnce && (u.dynamicChildren === pt && (u.dynamicChildren = []), u.dynamicChildren.hasOnce = !0);
    const { type: m, ref: k, shapeFlag: E } = u;
    switch (m) {
      case On:
        b(c, u, h, y);
        break;
      case tt:
        F(c, u, h, y);
        break;
      case nn:
        c == null && A(u, h, y, C);
        break;
      case ie:
        _t(
          c,
          u,
          h,
          y,
          g,
          v,
          C,
          S,
          w
        );
        break;
      default:
        E & 1 ? J(
          c,
          u,
          h,
          y,
          g,
          v,
          C,
          S,
          w
        ) : E & 6 ? bt(
          c,
          u,
          h,
          y,
          g,
          v,
          C,
          S,
          w
        ) : (E & 64 || E & 128) && m.process(
          c,
          u,
          h,
          y,
          g,
          v,
          C,
          S,
          w,
          Le
        );
    }
    k != null && g ? jt(k, c && c.ref, v, u || c, !u) : k == null && c && c.ref != null && jt(c.ref, null, v, c, !0);
  }, b = (c, u, h, y) => {
    if (c == null)
      s(
        u.el = o(u.children),
        h,
        y
      );
    else {
      const g = u.el = c.el;
      u.children !== c.children && a(g, u.children);
    }
  }, F = (c, u, h, y) => {
    c == null ? s(
      u.el = f(u.children || ""),
      h,
      y
    ) : u.el = c.el;
  }, A = (c, u, h, y) => {
    [c.el, c.anchor] = R(
      c.children,
      u,
      h,
      y,
      c.el,
      c.anchor
    );
  }, K = ({ el: c, anchor: u }, h, y) => {
    let g;
    for (; c && c !== u; )
      g = O(c), s(c, h, y), c = g;
    s(u, h, y);
  }, $ = ({ el: c, anchor: u }) => {
    let h;
    for (; c && c !== u; )
      h = O(c), r(c), c = h;
    r(u);
  }, J = (c, u, h, y, g, v, C, S, w) => {
    if (u.type === "svg" ? C = "svg" : u.type === "math" && (C = "mathml"), c == null)
      le(
        u,
        h,
        y,
        g,
        v,
        C,
        S,
        w
      );
    else {
      const m = c.el && c.el._isVueCE ? c.el : null;
      try {
        m && m._beginPatch(), st(
          c,
          u,
          g,
          v,
          C,
          S,
          w
        );
      } finally {
        m && m._endPatch();
      }
    }
  }, le = (c, u, h, y, g, v, C, S) => {
    let w, m;
    const { props: k, shapeFlag: E, transition: N, dirs: j } = c;
    if (w = c.el = l(
      c.type,
      v,
      k && k.is,
      k
    ), E & 8 ? d(w, c.children) : E & 16 && Me(
      c.children,
      w,
      null,
      y,
      g,
      kn(c, v),
      C,
      S
    ), j && at(c, null, y, "created"), de(w, c, c.scopeId, C, y), k) {
      for (const X in k)
        X !== "value" && !Ft(X) && i(w, X, null, k[X], v, y);
      "value" in k && i(w, "value", null, k.value, v), (m = k.onVnodeBeforeMount) && ke(m, y, c);
    }
    j && at(c, null, y, "beforeMount");
    const U = Nl(g, N);
    U && N.beforeEnter(w), s(w, u, h), ((m = k && k.onVnodeMounted) || U || j) && be(() => {
      m && ke(m, y, c), U && N.enter(w), j && at(c, null, y, "mounted");
    }, g);
  }, de = (c, u, h, y, g) => {
    if (h && I(c, h), y)
      for (let v = 0; v < y.length; v++)
        I(c, y[v]);
    if (g) {
      let v = g.subTree;
      if (u === v || Gr(v.type) && (v.ssContent === u || v.ssFallback === u)) {
        const C = g.vnode;
        de(
          c,
          C,
          C.scopeId,
          C.slotScopeIds,
          g.parent
        );
      }
    }
  }, Me = (c, u, h, y, g, v, C, S, w = 0) => {
    for (let m = w; m < c.length; m++) {
      const k = c[m] = S ? Ye(c[m]) : He(c[m]);
      _(
        null,
        k,
        u,
        h,
        y,
        g,
        v,
        C,
        S
      );
    }
  }, st = (c, u, h, y, g, v, C) => {
    const S = u.el = c.el;
    let { patchFlag: w, dynamicChildren: m, dirs: k } = u;
    w |= c.patchFlag & 16;
    const E = c.props || ee, N = u.props || ee;
    let j;
    if (h && dt(h, !1), (j = N.onVnodeBeforeUpdate) && ke(j, h, u, c), k && at(u, c, h, "beforeUpdate"), h && dt(h, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    m && (!c.dynamicChildren || c.dynamicChildren.length !== m.length) && (w = 0, C = !1, m = null), (E.innerHTML && N.innerHTML == null || E.textContent && N.textContent == null) && d(S, ""), m ? Je(
      c.dynamicChildren,
      m,
      S,
      h,
      y,
      kn(u, g),
      v
    ) : C || G(
      c,
      u,
      S,
      null,
      h,
      y,
      kn(u, g),
      v,
      !1
    ), w > 0) {
      if (w & 16)
        Ee(S, E, N, h, g);
      else if (w & 2 && E.class !== N.class && i(S, "class", null, N.class, g), w & 4 && i(S, "style", E.style, N.style, g), w & 8) {
        const U = u.dynamicProps;
        for (let X = 0; X < U.length; X++) {
          const q = U[X], re = E[q], fe = N[q];
          (fe !== re || q === "value") && i(S, q, re, fe, g, h);
        }
      }
      w & 1 && c.children !== u.children && d(S, u.children);
    } else !C && m == null && Ee(S, E, N, h, g);
    ((j = N.onVnodeUpdated) || k) && be(() => {
      j && ke(j, h, u, c), k && at(u, c, h, "updated");
    }, y);
  }, Je = (c, u, h, y, g, v, C) => {
    for (let S = 0; S < u.length; S++) {
      const w = c[S], m = u[S], k = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        w.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (w.type === ie || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Pt(w, m) || // - In the case of a component, it could contain anything.
        w.shapeFlag & 198) ? p(w.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          h
        )
      );
      _(
        w,
        m,
        k,
        null,
        y,
        g,
        v,
        C,
        !0
      );
    }
  }, Ee = (c, u, h, y, g) => {
    if (u !== h) {
      if (u !== ee)
        for (const v in u)
          !Ft(v) && !(v in h) && i(
            c,
            v,
            u[v],
            null,
            g,
            y
          );
      for (const v in h) {
        if (Ft(v)) continue;
        const C = h[v], S = u[v];
        C !== S && v !== "value" && i(c, v, S, C, g, y);
      }
      "value" in h && i(c, "value", u.value, h.value, g);
    }
  }, _t = (c, u, h, y, g, v, C, S, w) => {
    const m = u.el = c ? c.el : o(""), k = u.anchor = c ? c.anchor : o("");
    let { patchFlag: E, dynamicChildren: N, slotScopeIds: j } = u;
    j && (S = S ? S.concat(j) : j), c == null ? (s(m, h, y), s(k, h, y), Me(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      u.children || [],
      h,
      k,
      g,
      v,
      C,
      S,
      w
    )) : E > 0 && E & 64 && N && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    c.dynamicChildren && c.dynamicChildren.length === N.length ? (Je(
      c.dynamicChildren,
      N,
      h,
      g,
      v,
      C,
      S
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (u.key != null || g && u === g.subTree) && Br(
      c,
      u,
      !0
      /* shallow */
    )) : G(
      c,
      u,
      h,
      k,
      g,
      v,
      C,
      S,
      w
    );
  }, bt = (c, u, h, y, g, v, C, S, w) => {
    u.slotScopeIds = S, c == null ? u.shapeFlag & 512 ? g.ctx.activate(
      u,
      h,
      y,
      C,
      w
    ) : At(
      u,
      h,
      y,
      g,
      v,
      C,
      w
    ) : zt(c, u, w);
  }, At = (c, u, h, y, g, v, C) => {
    const S = c.component = Wl(
      c,
      y,
      g
    );
    if (fs(c) && (S.ctx.renderer = Le), Gl(S, !1, C), S.asyncDep) {
      if (g && g.registerDep(S, oe, C), !c.el) {
        const w = S.subTree = ce(tt);
        F(null, w, u, h), c.placeholder = w.el;
      }
    } else
      oe(
        S,
        c,
        u,
        h,
        g,
        v,
        C
      );
  }, zt = (c, u, h) => {
    const y = u.component = c.component;
    if (Tl(c, u, h))
      if (y.asyncDep && !y.asyncResolved) {
        u.el = c.el, Y(y, u, h);
        return;
      } else
        y.next = u, y.update();
    else
      u.el = c.el, y.vnode = u;
  }, oe = (c, u, h, y, g, v, C) => {
    const S = () => {
      if (c.isMounted) {
        let { next: E, bu: N, u: j, parent: U, vnode: X } = c;
        {
          const Fe = Wr(c);
          if (Fe) {
            E && (E.el = X.el, Y(c, E, C)), Fe.asyncDep.then(() => {
              be(() => {
                c.isUnmounted || m();
              }, g);
            });
            return;
          }
        }
        let q = E, re;
        dt(c, !1), E ? (E.el = X.el, Y(c, E, C)) : E = X, N && An(N), (re = E.props && E.props.onVnodeBeforeUpdate) && ke(re, U, E, X), dt(c, !0);
        const fe = As(c), Re = c.subTree;
        c.subTree = fe, _(
          Re,
          fe,
          // parent may have changed if it's in a teleport
          p(Re.el),
          // anchor may have changed if it's in a fragment
          ne(Re),
          c,
          g,
          v
        ), E.el = fe.el, q === null && Ol(c, fe.el), j && be(j, g), (re = E.props && E.props.onVnodeUpdated) && be(
          () => ke(re, U, E, X),
          g
        );
      } else {
        let E;
        const { el: N, props: j } = u, { bm: U, m: X, parent: q, root: re, type: fe } = c, Re = Dt(u);
        dt(c, !1), U && An(U), !Re && (E = j && j.onVnodeBeforeMount) && ke(E, q, u), dt(c, !0);
        {
          re.ce && re.ce._hasShadowRoot() && re.ce._injectChildStyle(
            fe,
            c.parent ? c.parent.type : void 0
          );
          const Fe = c.subTree = As(c);
          _(
            null,
            Fe,
            h,
            y,
            c,
            g,
            v
          ), u.el = Fe.el;
        }
        if (X && be(X, g), !Re && (E = j && j.onVnodeMounted)) {
          const Fe = u;
          be(
            () => ke(E, q, Fe),
            g
          );
        }
        (u.shapeFlag & 256 || q && Dt(q.vnode) && q.vnode.shapeFlag & 256) && c.a && be(c.a, g), c.isMounted = !0, u = h = y = null;
      }
    };
    c.scope.on();
    const w = c.effect = new nr(S);
    c.scope.off();
    const m = c.update = w.run.bind(w), k = c.job = w.runIfDirty.bind(w);
    k.i = c, k.id = c.uid, w.scheduler = () => os(k), dt(c, !0), m();
  }, Y = (c, u, h) => {
    u.component = c;
    const y = c.vnode.props;
    c.vnode = u, c.next = null, Al(c, u.props, y, h), Ll(c, u.children, h), Qe(), ws(c), et();
  }, G = (c, u, h, y, g, v, C, S, w = !1) => {
    const m = c && c.children, k = c ? c.shapeFlag : 0, E = u.children, { patchFlag: N, shapeFlag: j } = u;
    if (N > 0) {
      if (N & 128) {
        xt(
          m,
          E,
          h,
          y,
          g,
          v,
          C,
          S,
          w
        );
        return;
      } else if (N & 256) {
        Pe(
          m,
          E,
          h,
          y,
          g,
          v,
          C,
          S,
          w
        );
        return;
      }
    }
    j & 8 ? (k & 16 && P(m, g, v), E !== m && d(h, E)) : k & 16 ? j & 16 ? xt(
      m,
      E,
      h,
      y,
      g,
      v,
      C,
      S,
      w
    ) : P(m, g, v, !0) : (k & 8 && d(h, ""), j & 16 && Me(
      E,
      h,
      y,
      g,
      v,
      C,
      S,
      w
    ));
  }, Pe = (c, u, h, y, g, v, C, S, w) => {
    c = c || pt, u = u || pt;
    const m = c.length, k = u.length, E = Math.min(m, k);
    let N;
    for (N = 0; N < E; N++) {
      const j = u[N] = w ? Ye(u[N]) : He(u[N]);
      _(
        c[N],
        j,
        h,
        null,
        g,
        v,
        C,
        S,
        w
      );
    }
    m > k ? P(
      c,
      g,
      v,
      !0,
      !1,
      E
    ) : Me(
      u,
      h,
      y,
      g,
      v,
      C,
      S,
      w,
      E
    );
  }, xt = (c, u, h, y, g, v, C, S, w) => {
    let m = 0;
    const k = u.length;
    let E = c.length - 1, N = k - 1;
    for (; m <= E && m <= N; ) {
      const j = c[m], U = u[m] = w ? Ye(u[m]) : He(u[m]);
      if (Pt(j, U))
        _(
          j,
          U,
          h,
          null,
          g,
          v,
          C,
          S,
          w
        );
      else
        break;
      m++;
    }
    for (; m <= E && m <= N; ) {
      const j = c[E], U = u[N] = w ? Ye(u[N]) : He(u[N]);
      if (Pt(j, U))
        _(
          j,
          U,
          h,
          null,
          g,
          v,
          C,
          S,
          w
        );
      else
        break;
      E--, N--;
    }
    if (m > E) {
      if (m <= N) {
        const j = N + 1, U = j < k ? u[j].el : y;
        for (; m <= N; )
          _(
            null,
            u[m] = w ? Ye(u[m]) : He(u[m]),
            h,
            U,
            g,
            v,
            C,
            S,
            w
          ), m++;
      }
    } else if (m > N)
      for (; m <= E; )
        _e(c[m], g, v, !0), m++;
    else {
      const j = m, U = m, X = /* @__PURE__ */ new Map();
      for (m = U; m <= N; m++) {
        const xe = u[m] = w ? Ye(u[m]) : He(u[m]);
        xe.key != null && X.set(xe.key, m);
      }
      let q, re = 0;
      const fe = N - U + 1;
      let Re = !1, Fe = 0;
      const It = new Array(fe);
      for (m = 0; m < fe; m++) It[m] = 0;
      for (m = j; m <= E; m++) {
        const xe = c[m];
        if (re >= fe) {
          _e(xe, g, v, !0);
          continue;
        }
        let Ne;
        if (xe.key != null)
          Ne = X.get(xe.key);
        else
          for (q = U; q <= N; q++)
            if (It[q - U] === 0 && Pt(xe, u[q])) {
              Ne = q;
              break;
            }
        Ne === void 0 ? _e(xe, g, v, !0) : (It[Ne - U] = m + 1, Ne >= Fe ? Fe = Ne : Re = !0, _(
          xe,
          u[Ne],
          h,
          null,
          g,
          v,
          C,
          S,
          w
        ), re++);
      }
      const hs = Re ? kl(It) : pt;
      for (q = hs.length - 1, m = fe - 1; m >= 0; m--) {
        const xe = U + m, Ne = u[xe], ps = u[xe + 1], gs = xe + 1 < k ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          ps.el || Jr(ps)
        ) : y;
        It[m] === 0 ? _(
          null,
          Ne,
          h,
          gs,
          g,
          v,
          C,
          S,
          w
        ) : Re && (q < 0 || m !== hs[q] ? Ge(Ne, h, gs, 2) : q--);
      }
    }
  }, Ge = (c, u, h, y, g = null) => {
    const { el: v, type: C, transition: S, children: w, shapeFlag: m } = c;
    if (m & 6) {
      Ge(c.component.subTree, u, h, y);
      return;
    }
    if (m & 128) {
      c.suspense.move(u, h, y);
      return;
    }
    if (m & 64) {
      C.move(c, u, h, Le);
      return;
    }
    if (C === ie) {
      s(v, u, h);
      for (let E = 0; E < w.length; E++)
        Ge(w[E], u, h, y);
      s(c.anchor, u, h);
      return;
    }
    if (C === nn) {
      K(c, u, h);
      return;
    }
    if (y !== 2 && m & 1 && S)
      if (y === 0)
        S.persisted && !v[Fn] ? s(v, u, h) : (S.beforeEnter(v), s(v, u, h), be(() => S.enter(v), g));
      else {
        const { leave: E, delayLeave: N, afterLeave: j } = S, U = () => {
          c.ctx.isUnmounted ? r(v) : s(v, u, h);
        }, X = () => {
          const q = v._isLeaving || !!v[Fn];
          v._isLeaving && v[Fn](
            !0
            /* cancelled */
          ), S.persisted && !q ? U() : E(v, () => {
            U(), j && j();
          });
        };
        N ? N(v, U, X) : X();
      }
    else
      s(v, u, h);
  }, _e = (c, u, h, y = !1, g = !1) => {
    const {
      type: v,
      props: C,
      ref: S,
      children: w,
      dynamicChildren: m,
      shapeFlag: k,
      patchFlag: E,
      dirs: N,
      cacheIndex: j,
      memo: U
    } = c;
    if ((E === -2 || m && m.hasOnce) && (g = !1), S != null && (Qe(), jt(S, null, h, c, !0), et()), j != null && (!c.ctx || c.ctx === u) && (u.renderCache[j] = void 0), k & 256) {
      u.ctx.deactivate(c);
      return;
    }
    const X = k & 1 && N, q = !Dt(c);
    let re;
    if (q && (re = C && C.onVnodeBeforeUnmount) && ke(re, u, c), k & 6)
      T(c.component, h, y);
    else {
      if (k & 128) {
        c.suspense.unmount(h, y);
        return;
      }
      X && at(c, null, u, "beforeUnmount"), k & 64 ? c.type.remove(
        c,
        u,
        h,
        Le,
        y
      ) : m && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !m.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (v !== ie || E > 0 && E & 64) ? P(
        m,
        u,
        h,
        !1,
        !0
      ) : (v === ie && E & 384 || !g && k & 16) && P(w, u, h), y && M(c);
    }
    const fe = U != null && j == null;
    (q && (re = C && C.onVnodeUnmounted) || X || fe) && be(() => {
      re && ke(re, u, c), X && at(c, null, u, "unmounted"), fe && (c.el = null);
    }, h);
  }, M = (c) => {
    const { type: u, el: h, anchor: y, transition: g } = c;
    if (u === ie) {
      x(h, y);
      return;
    }
    if (u === nn) {
      $(c), g && !g.persisted && g.afterLeave && g.afterLeave();
      return;
    }
    const v = () => {
      r(h), g && !g.persisted && g.afterLeave && g.afterLeave();
    };
    if (c.shapeFlag & 1 && g && !g.persisted) {
      const { leave: C, delayLeave: S } = g, w = () => C(h, v);
      S ? S(c.el, v, w) : w();
    } else
      v();
  }, x = (c, u) => {
    let h;
    for (; c !== u; )
      h = O(c), r(c), c = h;
    r(u);
  }, T = (c, u, h) => {
    const { bum: y, scope: g, job: v, subTree: C, um: S, m: w, a: m } = c;
    Ps(w), Ps(m), y && An(y), g.stop(), v ? (v.flags |= 8, _e(C, c, u, h)) : c.vnode.el && C && (C.transition = c.vnode.transition, _e(C, c, u, h)), S && be(S, u), be(() => {
      c.isUnmounted = !0;
    }, u);
  }, P = (c, u, h, y = !1, g = !1, v = 0) => {
    for (let C = v; C < c.length; C++)
      _e(c[C], u, h, y, g);
  }, ne = (c) => {
    if (c.shapeFlag & 6)
      return ne(c.component.subTree);
    if (c.shapeFlag & 128)
      return c.suspense.next();
    const u = O(c.anchor || c.el), h = u && u[el];
    return h ? O(h) : u;
  };
  let se = !1;
  const rt = (c, u, h) => {
    let y;
    c == null ? u._vnode && (_e(u._vnode, null, null, !0), y = u._vnode.component) : _(
      u._vnode || null,
      c,
      u,
      null,
      null,
      null,
      h
    ), u._vnode = c, se || (se = !0, ws(y), br(), se = !1);
  }, Le = {
    p: _,
    um: _e,
    m: Ge,
    r: M,
    mt: At,
    mc: Me,
    pc: G,
    pbc: Je,
    n: ne,
    o: e
  };
  return {
    render: rt,
    hydrate: void 0,
    createApp: bl(rt)
  };
}
function kn({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function dt({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Nl(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Br(e, t, n = !1) {
  const s = e.children, r = t.children;
  if (D(s) && D(r))
    for (let i = 0; i < s.length; i++) {
      const l = s[i];
      let o = r[i];
      o.shapeFlag & 1 && !o.dynamicChildren && ((o.patchFlag <= 0 || o.patchFlag === 32) && (o = r[i] = Ye(r[i]), o.el = l.el), !n && o.patchFlag !== -2 && Br(l, o)), o.type === On && (o.patchFlag === -1 && (o = r[i] = Ye(o)), o.el = l.el), o.type === tt && !o.el && (o.el = l.el);
    }
}
function kl(e) {
  const t = e.slice(), n = [0];
  let s, r, i, l, o;
  const f = e.length;
  for (s = 0; s < f; s++) {
    const a = e[s];
    if (a !== 0) {
      if (r = n[n.length - 1], e[r] < a) {
        t[s] = r, n.push(s);
        continue;
      }
      for (i = 0, l = n.length - 1; i < l; )
        o = i + l >> 1, e[n[o]] < a ? i = o + 1 : l = o;
      a < e[n[i]] && (i > 0 && (t[s] = n[i - 1]), n[i] = s);
    }
  }
  for (i = n.length, l = n[i - 1]; i-- > 0; )
    n[i] = l, l = t[l];
  return n;
}
function Wr(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : Wr(t);
}
function Ps(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function Jr(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  return t ? Jr(t.subTree) : null;
}
const Gr = (e) => e.__isSuspense;
function jl(e, t) {
  t && t.pendingBranch ? D(e) ? t.effects.push(...e) : t.effects.push(e) : Zi(e);
}
const ie = /* @__PURE__ */ Symbol.for("v-fgt"), On = /* @__PURE__ */ Symbol.for("v-txt"), tt = /* @__PURE__ */ Symbol.for("v-cmt"), nn = /* @__PURE__ */ Symbol.for("v-stc"), vt = [];
let we = null;
function V(e = !1) {
  vt.push(we = e ? null : []);
}
function Zr() {
  vt.pop(), we = vt[vt.length - 1] || null;
}
let Bt = 1;
function Ls(e, t = !1) {
  Bt += e, e < 0 && we && t && (we.hasOnce = !0);
}
function qr(e) {
  return e.dynamicChildren = Bt > 0 ? we || pt : null, Zr(), Bt > 0 && we && we.push(e), e;
}
function Z(e, t, n, s, r, i) {
  return qr(
    L(
      e,
      t,
      n,
      s,
      r,
      i,
      !0
    )
  );
}
function zr(e, t, n, s, r) {
  return qr(
    ce(
      e,
      t,
      n,
      s,
      r,
      !0
    )
  );
}
function Yr(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Pt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const Xr = ({ key: e }) => e ?? null, sn = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? te(e) || /* @__PURE__ */ ge(e) || H(e) ? { i: Ue, r: e, k: t, f: !!n } : e : null);
function L(e, t = null, n = null, s = 0, r = null, i = e === ie ? 0 : 1, l = !1, o = !1) {
  const f = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Xr(t),
    ref: t && sn(t),
    scopeId: wr,
    slotScopeIds: null,
    children: n,
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
    patchFlag: s,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: Ue
  };
  return o ? (hn(f, n), i & 128 && e.normalize(f)) : n && (f.shapeFlag |= te(n) ? 8 : 16), Bt > 0 && // avoid a block node from tracking itself
  !l && // has current parent block
  we && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (f.patchFlag > 0 || i & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  f.patchFlag !== 32 && we.push(f), f;
}
const ce = Dl;
function Dl(e, t = null, n = null, s = 0, r = null, i = !1) {
  if ((!e || e === dl) && (e = tt), Yr(e)) {
    const o = Et(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && hn(o, n), Bt > 0 && !i && we && (o.shapeFlag & 6 ? we[we.indexOf(e)] = o : we.push(o)), o.patchFlag = -2, o;
  }
  if (Yl(e) && (e = e.__vccOpts), t) {
    t = Hl(t);
    let { class: o, style: f } = t;
    o && !te(o) && (t.class = yt(o)), z(f) && (/* @__PURE__ */ ls(f) && !D(f) && (f = ae({}, f)), t.style = _n(f));
  }
  const l = te(e) ? 1 : Gr(e) ? 128 : Mn(e) ? 64 : z(e) ? 4 : H(e) ? 2 : 0;
  return L(
    e,
    t,
    n,
    s,
    r,
    l,
    i,
    !0
  );
}
function Hl(e) {
  return e ? /* @__PURE__ */ ls(e) || jr(e) ? ae({}, e) : e : null;
}
function Et(e, t, n = !1, s = !1) {
  const { props: r, ref: i, patchFlag: l, children: o, transition: f } = e, a = t ? Ul(r || {}, t) : r, d = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: a,
    key: a && Xr(a),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && i ? D(i) ? i.concat(sn(t)) : [i, sn(t)] : sn(t)
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
    patchFlag: t && e.type !== ie ? l === -1 ? 16 : l | 16 : l,
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
  return f && s && cs(
    d,
    f.clone(d)
  ), d;
}
function dn(e = " ", t = 0) {
  return ce(On, null, e, t);
}
function Kl(e, t) {
  const n = ce(nn, null, e);
  return n.staticCount = t, n;
}
function rn(e = "", t = !1) {
  return t ? (V(), zr(tt, null, e)) : ce(tt, null, e);
}
function He(e) {
  return e == null || typeof e == "boolean" ? ce(tt) : D(e) ? ce(
    ie,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : Yr(e) ? Ye(e) : ce(On, null, String(e));
}
function Ye(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : Et(e);
}
function hn(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (D(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const r = t.default;
      r && (r._c && (r._d = !1), hn(e, r()), r._c && (r._d = !0));
      return;
    } else {
      n = 32;
      const r = t._;
      !r && !jr(t) ? t._ctx = Ue : r === 3 && Ue && (Ue.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (H(t)) {
    if (s & 65) {
      hn(e, { default: t });
      return;
    }
    t = { default: t, _ctx: Ue }, n = 32;
  } else
    t = String(t), s & 64 ? (n = 16, t = [dn(t)]) : n = 8;
  e.children = t, e.shapeFlag |= n;
}
function Ul(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const r in s)
      if (r === "class")
        t.class !== s.class && (t.class = yt([t.class, s.class]));
      else if (r === "style")
        t.style = _n([t.style, s.style]);
      else if (gn(r)) {
        const i = t[r], l = s[r];
        l && i !== l && !(D(i) && i.includes(l)) ? t[r] = i ? [].concat(i, l) : l : l == null && i == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !mn(r) && (t[r] = l);
      } else r !== "" && (t[r] = s[r]);
  }
  return t;
}
function ke(e, t, n, s = null) {
  $e(e, t, 7, [
    n,
    s
  ]);
}
const Vl = Lr();
let Bl = 0;
function Wl(e, t, n) {
  const s = e.type, r = (t ? t.appContext : e.appContext) || Vl, i = {
    uid: Bl++,
    vnode: e,
    type: s,
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
    scope: new vi(
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
    propsOptions: Hr(s, r),
    emitsOptions: Rr(s, r),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: ee,
    // inheritAttrs
    inheritAttrs: s.inheritAttrs,
    // state
    ctx: ee,
    data: ee,
    props: ee,
    attrs: ee,
    slots: ee,
    refs: ee,
    setupState: ee,
    setupContext: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
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
  return i.ctx = { _: i }, i.root = t ? t.root : i, i.emit = wl.bind(null, i), e.ce && e.ce(i), i;
}
let ye = null;
const Jl = () => ye || Ue;
let pn, Wt;
{
  const e = yn(), t = (n, s) => {
    let r;
    return (r = e[n]) || (r = e[n] = []), r.push(s), (i) => {
      r.length > 1 ? r.forEach((l) => l(i)) : r[0](i);
    };
  };
  pn = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => ye = n
  ), Wt = t(
    "__VUE_SSR_SETTERS__",
    (n) => Jt = n
  );
}
const qt = (e) => {
  const t = ye;
  return pn(e), e.scope.on(), () => {
    e.scope.off(), pn(t);
  };
}, Rs = () => {
  ye && ye.scope.off(), pn(null);
};
function Qr(e) {
  return e.vnode.shapeFlag & 4;
}
let Jt = !1;
function Gl(e, t = !1, n = !1) {
  t && Wt(t);
  const { props: s, children: r } = e.vnode, i = Qr(e);
  El(e, s, i, t), Pl(e, r, n || t);
  const l = i ? Zl(e, t) : void 0;
  return t && Wt(!1), l;
}
function Zl(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, hl);
  const { setup: s } = n;
  if (s) {
    Qe();
    const r = e.setupContext = s.length > 1 ? zl(e) : null, i = qt(e), l = Zt(
      s,
      e,
      0,
      [
        e.props,
        r
      ]
    ), o = Zs(l);
    if (et(), i(), (o || e.sp) && !Dt(e) && Tr(e), o) {
      if (l.then(Rs, Rs), t)
        return l.then((f) => {
          Wt(!0);
          try {
            Fs(e, f, t);
          } finally {
            Wt(!1);
          }
        }).catch((f) => {
          wn(f, e, 0);
        });
      e.asyncDep = l;
    } else
      Fs(e, l);
  } else
    ei(e);
}
function Fs(e, t, n) {
  H(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : z(t) && (e.setupState = vr(t)), ei(e);
}
function ei(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || Ve);
  {
    const r = qt(e);
    Qe();
    try {
      pl(e);
    } finally {
      et(), r();
    }
  }
}
const ql = {
  get(e, t) {
    return pe(e, "get", ""), e[t];
  }
};
function zl(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, ql),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function ds(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(vr(ki(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in Ht)
        return Ht[n](e);
    },
    has(t, n) {
      return n in t || n in Ht;
    }
  })) : e.proxy;
}
function Yl(e) {
  return H(e) && "__vccOpts" in e;
}
const Ce = (e, t) => /* @__PURE__ */ Ui(e, t, Jt), Xl = "3.5.43";
let qn;
const Ns = typeof window < "u" && window.trustedTypes;
if (Ns)
  try {
    qn = /* @__PURE__ */ Ns.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const ti = qn ? (e) => qn.createHTML(e) : (e) => e, Ql = "http://www.w3.org/2000/svg", eo = "http://www.w3.org/1998/Math/MathML", ze = typeof document < "u" ? document : null, ks = ze && /* @__PURE__ */ ze.createElement("template"), to = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const r = t === "svg" ? ze.createElementNS(Ql, e) : t === "mathml" ? ze.createElementNS(eo, e) : n ? ze.createElement(e, { is: n }) : ze.createElement(e);
    return e === "select" && s && s.multiple != null && r.setAttribute("multiple", s.multiple), r;
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
  insertStaticContent(e, t, n, s, r, i) {
    const l = n ? n.previousSibling : t.lastChild;
    if (r && (r === i || r.nextSibling))
      for (; t.insertBefore(r.cloneNode(!0), n), !(r === i || !(r = r.nextSibling)); )
        ;
    else {
      ks.innerHTML = ti(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const o = ks.content;
      if (s === "svg" || s === "mathml") {
        const f = o.firstChild;
        for (; f.firstChild; )
          o.appendChild(f.firstChild);
        o.removeChild(f);
      }
      t.insertBefore(o, n);
    }
    return [
      // first
      l ? l.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, no = /* @__PURE__ */ Symbol("_vtc");
function so(e, t, n) {
  const s = e[no];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const js = /* @__PURE__ */ Symbol("_vod"), ro = /* @__PURE__ */ Symbol("_vsh"), io = /* @__PURE__ */ Symbol(""), lo = /(?:^|;)\s*display\s*:/;
function oo(e, t, n) {
  const s = e.style, r = te(n);
  let i = !1;
  if (n && !r) {
    if (t)
      if (te(t))
        for (const l of t.split(";")) {
          const o = l.slice(0, l.indexOf(":")).trim();
          n[o] == null && Rt(s, o, "");
        }
      else
        for (const l in t)
          n[l] == null && Rt(s, l, "");
    for (const l in n) {
      l === "display" && (i = !0);
      const o = n[l];
      o != null ? fo(
        e,
        l,
        !te(t) && t ? t[l] : void 0,
        o
      ) || Rt(s, l, o) : Rt(s, l, "");
    }
  } else if (r) {
    if (t !== n) {
      const l = s[io];
      l && (n += ";" + l), s.cssText = n, i = lo.test(n);
    }
  } else t && e.removeAttribute("style");
  js in e && (e[js] = i ? s.display : "", e[ro] && (s.display = "none"));
}
const en = /\s*!important$/;
function Rt(e, t, n) {
  if (D(n))
    n.forEach((s) => Rt(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    en.test(n) ? e.setProperty(t, n.replace(en, ""), "important") : e.setProperty(t, n);
  else {
    const s = co(e, t);
    en.test(n) ? e.setProperty(
      ut(s),
      n.replace(en, ""),
      "important"
    ) : e[s] = n;
  }
}
const Ds = ["Webkit", "Moz", "ms"], jn = {};
function co(e, t) {
  const n = jn[t];
  if (n)
    return n;
  let s = Ae(t);
  if (s !== "filter" && s in e)
    return jn[t] = s;
  s = Ys(s);
  for (let r = 0; r < Ds.length; r++) {
    const i = Ds[r] + s;
    if (i in e)
      return jn[t] = i;
  }
  return t;
}
function fo(e, t, n, s) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && te(s) && n === s;
}
const Hs = "http://www.w3.org/1999/xlink";
function Ks(e, t, n, s, r, i = pi(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Hs, t.slice(6, t.length)) : e.setAttributeNS(Hs, t, n) : n == null || i && !Qs(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    i ? "" : Be(n) ? String(n) : n
  );
}
function Us(e, t, n, s, r) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? ti(n) : n);
    return;
  }
  const i = e.tagName;
  if (t === "value" && i !== "PROGRESS" && // custom elements may use _value internally
  !i.includes("-")) {
    const o = i === "OPTION" ? e.getAttribute("value") || "" : e.value, f = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (o !== f || !("_value" in e)) && (e.value = f), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let l = !1;
  if (n === "" || n == null) {
    const o = typeof e[t];
    o === "boolean" ? n = Qs(n) : n == null && o === "string" ? (n = "", l = !0) : o === "number" && (n = 0, l = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  l && e.removeAttribute(r || t);
}
function uo(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function ao(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const Vs = /* @__PURE__ */ Symbol("_vei");
function ho(e, t, n, s, r = null) {
  const i = e[Vs] || (e[Vs] = {}), l = i[t];
  if (s && l)
    l.value = s;
  else {
    const [o, f] = mo(t);
    if (s) {
      const a = i[t] = _o(
        s,
        r
      );
      uo(e, o, a, f);
    } else l && (ao(e, o, l, f), i[t] = void 0);
  }
}
const po = /(Once|Passive|Capture)$/, go = /^on:?(?:Once|Passive|Capture)$/;
function mo(e) {
  let t, n;
  for (; (n = e.match(po)) && !go.test(e); )
    t || (t = {}), e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : ut(e.slice(2)), t];
}
let Dn = 0;
const vo = /* @__PURE__ */ Promise.resolve(), yo = () => Dn || (vo.then(() => Dn = 0), Dn = Date.now());
function _o(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    const r = n.value;
    if (D(r)) {
      const i = s.stopImmediatePropagation;
      s.stopImmediatePropagation = () => {
        i.call(s), s._stopped = !0;
      };
      const l = r.slice(), o = [s];
      for (let f = 0; f < l.length && !s._stopped; f++) {
        const a = l[f];
        a && $e(
          a,
          t,
          5,
          o
        );
      }
    } else
      $e(
        r,
        t,
        5,
        [s]
      );
  };
  return n.value = e, n.attached = yo(), n;
}
const Bs = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, bo = (e, t, n, s, r, i) => {
  const l = r === "svg";
  t === "class" ? so(e, s, l) : t === "style" ? oo(e, n, s) : gn(t) ? mn(t) || ho(e, t, n, s, i) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : xo(e, t, s, l)) ? (Us(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Ks(e, t, s, l, i, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (wo(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !te(s))) ? Us(e, Ae(t), s, i, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), Ks(e, t, s, l));
};
function xo(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && Bs(t) && H(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const r = e.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE")
      return !1;
  }
  return Bs(t) && te(n) ? !1 : t in e;
}
function wo(e, t) {
  const n = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!n)
    return !1;
  const s = Ae(t);
  return Array.isArray(n) ? n.some((r) => Ae(r) === s) : Object.keys(n).some((r) => Ae(r) === s);
}
const Mo = ["ctrl", "shift", "alt", "meta"], So = {
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
  exact: (e, t) => Mo.some((n) => e[`${n}Key`] && !t.includes(n))
}, Co = (e, t) => {
  if (!e) return e;
  const n = e._withMods || (e._withMods = {}), s = t.join(".");
  return n[s] || (n[s] = ((r, ...i) => {
    for (let l = 0; l < t.length; l++) {
      const o = So[t[l]];
      if (o && o(r, t)) return;
    }
    return e(r, ...i);
  }));
}, To = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, Ws = (e, t) => {
  const n = e._withKeys || (e._withKeys = {}), s = t.join(".");
  return n[s] || (n[s] = ((r) => {
    if (!("key" in r))
      return;
    const i = ut(r.key);
    if (t.some(
      (l) => l === i || To[l] === i
    ))
      return e(r);
  }));
}, Oo = /* @__PURE__ */ ae({ patchProp: bo }, to);
let Js;
function Eo() {
  return Js || (Js = Rl(Oo));
}
const Ao = ((...e) => {
  const t = Eo().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const r = $o(s);
    if (!r) return;
    const i = t._component;
    !H(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
    const l = n(r, !1, Io(r));
    return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), l;
  }, t;
});
function Io(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function $o(e) {
  return te(e) ? document.querySelector(e) : e;
}
const Po = {
  class: "gl-icon",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.75",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true",
  focusable: "false"
}, Lo = ["cx", "cy"], Ro = ["d"], Fo = /* @__PURE__ */ Sn({
  __name: "UiIcon",
  props: {
    name: {},
    value: {}
  },
  setup(e) {
    const t = { menu: "M4 6h16M4 12h16M4 18h16", close: "m6 6 12 12M6 18 18 6", invite: "M15 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0M4 21v-2a6 6 0 0 1 9-5.2M18 14v8M14 18h8", copy: "M9 9h11v12H9zM5 15H3V3h12v2", exit: "M10 4H4v16h6M10 12h11m-4-4 4 4-4 4", download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5", help: "M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4M12 17h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0", refresh: "M20 7v5h-5M4 17v-5h5M5 8a8 8 0 0 1 13-3l2 3M4 16l2 3a8 8 0 0 0 13-3", pan: "M12 3v18M3 12h18m-12-6 3-3 3 3m-6 12 3 3 3-3M6 9l-3 3 3 3m12-6 3 3-3 3", pen: "m4 16-1 5 5-1L20 8a3 3 0 0 0-4-4ZM14 6l4 4", pencil: "m4 15-1 6 6-1L21 8l-5-5ZM13 6l5 5M4 15l5 5", marker: "m5 14 9-11 7 6-9 11ZM5 14l7 6-8 1-2-2ZM12 6l7 6", highlighter: "m7 13 7-10 7 5-7 10ZM7 13l7 5-3 3H4v-4ZM3 22h18", spray: "M5 10h9v11H5zM7 10V6h5v4M8 6V3h3M16 4h.01M20 2h.01M20 6h.01M18 9h.01", neon: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z", crayon: "m4 15 10-10 5 5L9 20H4ZM14 5l4-3 4 4-3 4M7 12l5 5", eraser: "m4 16 9-11a2 2 0 0 1 3 0l5 5a2 2 0 0 1 0 3l-8 8H8l-4-4a1 1 0 0 1 0-1ZM9 10l8 8M13 21h8", undo: "M3 4v6h6M3 10c3-7 17-6 17 3 0 5-5 7-10 6", redo: "M21 4v6h-6M21 10C18 3 4 4 4 13c0 5 5 7 10 6", plus: "M12 5v14M5 12h14", minus: "M5 12h14", target: "M12 2v4M12 18v4M2 12h4M18 12h4M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0M12 12h.01", check: "m5 12 4 4L19 6", play: "m8 4 12 8-12 8Z", trash: "M3 6h18M8 6V3h8v3M5 6l1 15h12l1-15M10 10v7M14 10v7", volume: "m3 9 5 0 5-5v16l-5-5H3ZM16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14", muted: "m3 9 5 0 5-5v16l-5-5H3ZM17 9l5 6M17 15l5-6", plane: "m22 2-7 20-4-9-9-4ZM11 13l6-6" }, n = { 1: [[12, 12]], 2: [[7, 7], [17, 17]], 3: [[7, 7], [12, 12], [17, 17]], 4: [[7, 7], [17, 7], [7, 17], [17, 17]], 5: [[7, 7], [17, 7], [12, 12], [7, 17], [17, 17]], 6: [[7, 6], [17, 6], [7, 12], [17, 12], [7, 18], [17, 18]] };
    return (s, r) => (V(), Z("svg", Po, [
      e.name === "dice" ? (V(), Z(ie, { key: 0 }, [
        r[0] || (r[0] = L("rect", {
          x: "2",
          y: "2",
          width: "20",
          height: "20",
          rx: "4"
        }, null, -1)),
        (V(!0), Z(ie, null, qe(n[e.value || 5], (i, l) => (V(), Z("circle", {
          key: l,
          cx: i[0],
          cy: i[1],
          r: "1.3",
          fill: "currentColor",
          stroke: "none"
        }, null, 8, Lo))), 128))
      ], 64)) : (V(), Z("path", {
        key: 1,
        d: t[e.name] || t.help
      }, null, 8, Ro))
    ]));
  }
}), ni = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, r] of t)
    n[s] = r;
  return n;
}, gt = /* @__PURE__ */ ni(Fo, [["__scopeId", "data-v-8fcd069f"]]), No = {
  class: "flight-board",
  viewBox: "0 0 600 600",
  role: "group",
  "aria-label": "飞行棋四方棋盘"
}, ko = ["opacity"], jo = ["x", "y", "fill"], Do = ["x", "y", "stroke"], Ho = ["cx", "cy", "stroke"], Ko = ["x", "y", "fill"], Uo = ["transform"], Vo = ["fill", "stroke"], Bo = ["fill"], Wo = ["d", "stroke"], Jo = ["cx", "cy", "fill"], Go = ["transform", "tabindex", "role", "aria-label", "onClick", "onKeydown"], Zo = ["fill"], qo = ["stroke"], zo = ["fill"], Yo = ["fill"], Xo = {
  class: "plane-number",
  x: "13",
  y: "15.5",
  "text-anchor": "middle"
}, Qo = /* @__PURE__ */ Sn({
  __name: "FlightBoard",
  props: {
    state: {},
    selfId: {}
  },
  emits: ["move"],
  setup(e) {
    const t = e, n = { red: "#cb716c", blue: "#638dbc", yellow: "#ba963f", green: "#669a81" }, s = ["red", "blue", "yellow", "green"], r = Array.from({ length: 52 }, (R, _) => {
      const b = (-135 + _ * 360 / 52) * Math.PI / 180;
      return { x: 300 + 216 * Math.cos(b), y: 300 + 216 * Math.sin(b) };
    }), i = [{ x: 24, y: 24 }, { x: 446, y: 24 }, { x: 446, y: 446 }, { x: 24, y: 446 }], l = (R) => t.state.players.find((_) => _.color === R), o = { red: 0, blue: 13, yellow: 26, green: 39 }, f = Object.fromEntries(["red", "blue", "yellow", "green"].map((R) => {
      const _ = r[(o[R] + 51) % 52], b = Array.from({ length: 6 }, (F, A) => ({ x: _.x + (300 - _.x) * (A === 5 ? 1 : (36 + A * 27) / 216), y: _.y + (300 - _.y) * (A === 5 ? 1 : (36 + A * 27) / 216) }));
      return [R, b];
    })), a = Object.fromEntries(s.map((R, _) => {
      const b = i[_];
      return [R, [{ x: b.x + 40, y: b.y + 42 }, { x: b.x + 90, y: b.y + 42 }, { x: b.x + 40, y: b.y + 85 }, { x: b.x + 90, y: b.y + 85 }]];
    })), d = Ce(() => t.state.players[t.state.turn]), p = (R, _) => t.state.phase === "move" && d.value?.id === t.selfId && d.value.id === R.id && R.planes[_] !== 57 && (R.planes[_] === -1 && t.state.dice === 6 || R.planes[_] >= 0 && R.planes[_] + t.state.dice <= 57);
    function O(R, _) {
      const b = R.planes[_], F = R.color;
      return b < 0 ? a[F]?.[_] || { x: 300, y: 300 } : b < 52 ? r[(b + ["red", "blue", "yellow", "green"].indexOf(F) * 13) % 52] : f[F]?.[Math.min(5, b - 52)] || { x: 300, y: 300 };
    }
    function I(R, _) {
      const b = O(R, _), F = t.state.players.flatMap(($) => $.planes.map((J, le) => ({ item: $, i: le, p: O($, le) }))).filter(($) => Math.hypot($.p.x - b.x, $.p.y - b.y) < 1), A = F.findIndex(($) => $.item.id === R.id && $.i === _), K = Math.max(0, A) / Math.max(1, F.length) * Math.PI * 2;
      return { x: b.x + (F.length > 1 ? Math.cos(K) * 15 : 0), y: b.y + (F.length > 1 ? Math.sin(K) * 15 : 0) };
    }
    return (R, _) => (V(), Z("svg", No, [
      _[2] || (_[2] = Kl('<defs><linearGradient id="tile-glaze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="white" stop-opacity=".55"></stop><stop offset="1" stop-color="white" stop-opacity="0"></stop></linearGradient><linearGradient id="board-surface" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff"></stop><stop offset="1" stop-color="#edf2fa"></stop></linearGradient><symbol id="aircraft" viewBox="-18 -20 36 40"><path d="M0 -18 C3 -18 4 -14 4 -10 L4 -4 L16 4 L16 8 L4 4 L3 12 L8 16 L8 18 L0 16 L-8 18 L-8 16 L-3 12 L-4 4 L-16 8 L-16 4 L-4 -4 L-4 -10 C-4 -14 -3 -18 0 -18Z" fill="currentColor" stroke="white" stroke-width="1.4" stroke-linejoin="round"></path><path d="M-2 -11 Q0 -15 2 -11 L2 -6 L-2 -6Z" fill="#223e60" opacity=".65"></path><path d="M0 -3 L0 12" stroke="white" stroke-opacity=".5" stroke-width="1.2"></path></symbol><pattern id="board-grain" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".7" fill="#274136" opacity=".07"></circle></pattern><filter id="plane-shadow" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#13221c" flood-opacity=".22"></feDropShadow></filter></defs><rect x="8" y="8" width="584" height="584" rx="18" fill="url(#board-surface)"></rect><rect x="14" y="14" width="572" height="572" rx="16" fill="none" stroke="#dbe4f0" stroke-width="1.5"></rect><circle cx="300" cy="300" r="193" fill="none" stroke="#e0e7f1" stroke-width="1"></circle><circle cx="300" cy="300" r="239" fill="none" stroke="#e8edf3" stroke-width="1"></circle><circle cx="300" cy="300" r="216" fill="none" stroke="#edf1f6" stroke-width="32"></circle>', 6)),
      (V(), Z(ie, null, qe(s, (b, F) => L("g", {
        key: b,
        opacity: l(b) ? 1 : 0.48
      }, [
        L("rect", {
          x: i[F].x,
          y: i[F].y,
          width: "130",
          height: "130",
          rx: "25",
          fill: n[b],
          opacity: ".12"
        }, null, 8, jo),
        L("rect", {
          x: i[F].x,
          y: i[F].y,
          width: "130",
          height: "130",
          rx: "25",
          fill: "none",
          stroke: n[b],
          "stroke-width": "1",
          "stroke-opacity": ".35"
        }, null, 8, Do),
        (V(!0), Z(ie, null, qe(St(a)[b], (A, K) => (V(), Z("circle", {
          key: K,
          cx: A.x,
          cy: A.y,
          r: "19",
          fill: "white",
          stroke: n[b],
          "stroke-opacity": ".22"
        }, null, 8, Ho))), 128)),
        L("text", {
          x: i[F].x + 65,
          y: i[F].y + 117,
          "text-anchor": "middle",
          fill: n[b],
          "font-size": "10",
          "font-weight": "700"
        }, he(l(b)?.name.slice(0, 9) || "空位"), 9, Ko)
      ], 8, ko)), 64)),
      (V(!0), Z(ie, null, qe(St(r), (b, F) => (V(), Z("g", {
        key: F,
        transform: `translate(${b.x} ${b.y}) rotate(${-45 + F * 360 / 52})`
      }, [
        _[0] || (_[0] = L("rect", {
          x: "-10",
          y: "-10",
          width: "20",
          height: "20",
          rx: "5",
          fill: "white"
        }, null, -1)),
        L("rect", {
          x: "-10",
          y: "-10",
          width: "20",
          height: "20",
          rx: "5",
          fill: n[s[F % 4]],
          "fill-opacity": ".22",
          stroke: n[s[F % 4]],
          "stroke-opacity": ".35",
          "stroke-width": ".8"
        }, null, 8, Vo),
        [0, 8, 13, 21, 26, 34, 39, 47].includes(F) ? (V(), Z("path", {
          key: 0,
          d: "M0 -6 L2 -2 L6 -2 L3 1 L4 5 L0 3 L-4 5 L-3 1 L-6 -2 L-2 -2Z",
          fill: n[s[F % 4]]
        }, null, 8, Bo)) : rn("", !0)
      ], 8, Uo))), 128)),
      (V(), Z(ie, null, qe(s, (b) => L("g", {
        key: `lane-${b}`
      }, [
        L("path", {
          d: `M ${St(f)[b][0].x} ${St(f)[b][0].y} L 300 300`,
          stroke: n[b],
          "stroke-width": "24",
          opacity: ".12"
        }, null, 8, Wo),
        (V(!0), Z(ie, null, qe(St(f)[b], (F, A) => (V(), Z("circle", {
          key: A,
          cx: F.x,
          cy: F.y,
          r: "9",
          fill: n[b],
          opacity: ".45",
          stroke: "white",
          "stroke-width": "2"
        }, null, 8, Jo))), 128))
      ])), 64)),
      _[3] || (_[3] = L("circle", {
        cx: "300",
        cy: "300",
        r: "47",
        fill: "white",
        stroke: "#e0e7f1",
        "stroke-width": "2"
      }, null, -1)),
      _[4] || (_[4] = L("path", {
        d: "M300 259 L341 300 L300 341 L259 300 Z",
        fill: "#edf2fb"
      }, null, -1)),
      _[5] || (_[5] = L("text", {
        x: "300",
        y: "293",
        "text-anchor": "middle",
        fill: "#596c8d",
        "font-size": "19"
      }, "✦", -1)),
      _[6] || (_[6] = L("text", {
        x: "300",
        y: "315",
        "text-anchor": "middle",
        fill: "#596c8d",
        "font-size": "10",
        "letter-spacing": "2"
      }, "归 航", -1)),
      (V(!0), Z(ie, null, qe(e.state.players, (b) => (V(), Z("g", {
        key: `planes-${b.id}`
      }, [
        (V(!0), Z(ie, null, qe(b.planes, (F, A) => (V(), Z("g", {
          key: A,
          class: yt(["plane-token", [`plane-${b.color}`, { selectable: p(b, A) }]]),
          transform: `translate(${I(b, A).x} ${I(b, A).y})`,
          tabindex: p(b, A) ? 0 : -1,
          role: p(b, A) ? "button" : void 0,
          "aria-label": `${b.name} 的第 ${A + 1} 架飞机${p(b, A) ? "，点击行棋" : ""}`,
          onClick: (K) => p(b, A) && R.$emit("move", A),
          onKeydown: [
            Ws((K) => p(b, A) && R.$emit("move", A), ["enter"]),
            Ws(Co((K) => p(b, A) && R.$emit("move", A), ["prevent"]), ["space"])
          ]
        }, [
          _[1] || (_[1] = L("circle", {
            class: "plane-hit",
            r: "23",
            fill: "transparent",
            stroke: "none"
          }, null, -1)),
          L("circle", {
            class: "plane-base",
            cy: "3",
            r: "18",
            fill: n[b.color]
          }, null, 8, Zo),
          L("circle", {
            class: "plane-top",
            r: "18",
            fill: "white",
            stroke: n[b.color],
            "stroke-width": "2"
          }, null, 8, qo),
          L("circle", {
            r: "14.5",
            fill: n[b.color],
            opacity: ".1",
            stroke: "none"
          }, null, 8, zo),
          L("use", {
            href: "#aircraft",
            x: "-16",
            y: "-19",
            width: "32",
            height: "36",
            style: _n({ color: n[b.color] })
          }, null, 4),
          L("circle", {
            cx: "13",
            cy: "13",
            r: "6",
            fill: n[b.color],
            stroke: "white",
            "stroke-width": "1"
          }, null, 8, Yo),
          L("text", Xo, he(A + 1), 1)
        ], 42, Go))), 128))
      ]))), 128)),
      _[7] || (_[7] = L("g", { class: "board-mark" }, [
        L("text", {
          x: "300",
          y: "52"
        }, "✈ FLIGHT CLUB"),
        L("text", {
          x: "300",
          y: "548"
        }, "顺时针飞行 · 星标安全格")
      ], -1))
    ]));
  }
}), ec = ["disabled", "title"], tc = {
  method: "dialog",
  class: "room-invite-panel"
}, nc = {
  class: "gl-action room-invite-close",
  "aria-label": "关闭"
}, sc = ["value"], rc = /* @__PURE__ */ Sn({
  __name: "RoomInviteButton",
  props: {
    gameId: {},
    roomCode: {},
    memberCount: {},
    maxMembers: {},
    variant: { default: "battle" }
  },
  setup(e) {
    const t = e, n = /* @__PURE__ */ Se(), s = /* @__PURE__ */ Se(!1), r = Ce(() => {
      if (!t.roomCode) return "";
      const f = new URL("/", window.location.href);
      return f.hash = `/invite?${new URLSearchParams({ gameid: t.gameId, room: t.roomCode }).toString()}`, f.href;
    }), i = Ce(() => t.memberCount >= t.maxMembers);
    async function l() {
      if (!(!r.value || i.value)) {
        s.value = !1, n.value?.showModal();
        try {
          await navigator.clipboard.writeText(r.value), s.value = !0;
        } catch {
          s.value = !1;
        }
      }
    }
    async function o() {
      try {
        await navigator.clipboard.writeText(r.value), s.value = !0;
      } catch {
        s.value = !1;
      }
    }
    return (f, a) => (V(), Z(ie, null, [
      L("button", {
        class: yt(["gl-action room-invite-trigger", `invite-${e.variant}`]),
        type: "button",
        disabled: !e.roomCode || i.value,
        title: i.value ? "房间已满，无法邀请" : "生成并复制房间邀请链接",
        onClick: l
      }, [
        ce(gt, { name: "invite" }),
        a[1] || (a[1] = dn("邀请", -1))
      ], 10, ec),
      L("dialog", {
        ref_key: "dialog",
        ref: n,
        class: "room-invite-dialog",
        "aria-labelledby": "room-invite-title"
      }, [
        L("form", tc, [
          L("button", nc, [
            ce(gt, { name: "close" })
          ]),
          a[2] || (a[2] = L("small", null, "GAMELINK / ROOM INVITE", -1)),
          a[3] || (a[3] = L("h2", { id: "room-invite-title" }, "邀请好友加入", -1)),
          a[4] || (a[4] = L("p", null, "分享链接，好友打开后会自动加入房间。", -1)),
          L("input", {
            value: r.value,
            readonly: "",
            "aria-label": "房间邀请链接",
            onFocus: a[0] || (a[0] = (d) => d.target.select())
          }, null, 40, sc),
          L("button", {
            type: "button",
            class: "gl-action room-invite-copy",
            onClick: o
          }, [
            ce(gt, {
              name: s.value ? "check" : "copy"
            }, null, 8, ["name"]),
            dn(he(s.value ? "已复制邀请链接" : "复制邀请链接"), 1)
          ])
        ])
      ], 512)
    ], 64));
  }
}), ic = /* @__PURE__ */ ni(rc, [["__scopeId", "data-v-5bb541c6"]]), lc = { class: "flight-game board-first" }, oc = { class: "flight-header" }, cc = {
  href: "/",
  class: "flight-brand"
}, fc = { class: "brand-plane" }, uc = { class: "flight-room" }, ac = {
  class: "compact-network",
  role: "status"
}, dc = {
  key: 0,
  class: "board-stage"
}, hc = {
  class: "board-turn",
  "aria-live": "polite"
}, pc = {
  key: 0,
  class: "flight-error",
  role: "alert"
}, gc = { class: "board-arena" }, mc = { class: "center-control" }, vc = ["disabled"], yc = ["disabled", "aria-label"], _c = {
  class: "players-strip",
  "aria-label": "玩家状态"
}, bc = ["title"], xc = {
  key: 1,
  class: "flight-loading"
}, wc = ["href"], Mc = /* @__PURE__ */ Sn({
  __name: "FlightChessPage",
  setup(e) {
    const t = ["red", "blue", "yellow", "green"], n = /* @__PURE__ */ new Set([0, 8, 13, 21, 26, 34, 39, 47]), s = { red: 0, blue: 13, yellow: 26, green: 39 }, r = () => ({ rev: 0, players: [], turn: 0, phase: "waiting", dice: 0, winner: null, notice: "等待第二位玩家加入" }), i = /* @__PURE__ */ ji(), l = /* @__PURE__ */ Se(), o = /* @__PURE__ */ Se(), f = /* @__PURE__ */ Se([]), a = /* @__PURE__ */ Se(r()), d = /* @__PURE__ */ Se(""), p = /* @__PURE__ */ Se("/"), O = /* @__PURE__ */ Se(!1), I = /* @__PURE__ */ Se(!1), R = /* @__PURE__ */ Se(!1), _ = /* @__PURE__ */ Se({}), b = (M) => M === J.value ? "你 · 本机" : _.value[M] === "connected" ? "已连接" : _.value[M] === "reconnecting" ? "重连中" : "连接中", F = Ce(() => a.value.players.filter((M) => M.id === J.value || _.value[M.id] === "connected").length), A = Ce(() => I.value || F.value === a.value.players.length), K = Ce(() => a.value.phase === "waiting" ? a.value.players.length >= 2 ? "两人即可出发" : "等一位朋友" : a.value.phase === "done" ? "本局结束" : de.value ? "轮到你了" : `等待 ${le.value?.name || "玩家"}`);
    let $ = 0;
    const J = Ce(() => o.value?.id || ""), le = Ce(() => a.value.players[a.value.turn]), de = Ce(() => le.value?.id === J.value), Me = Ce(() => a.value.phase === "roll" && de.value && !R.value && A.value), st = Ce(() => a.value.phase === "waiting" && a.value.players.length >= 2 && A.value);
    function Je(M, x) {
      return x.find((T) => T.id === M.id);
    }
    function Ee(M) {
      a.value = M, i.value && i.value.broadcast("ludo-state", M);
    }
    function _t(M) {
      if (!O.value) return;
      const x = JSON.parse(JSON.stringify(a.value)), T = x.players[x.turn]?.id;
      if (x.phase !== "waiting") {
        for (const se of M) se.id !== J.value && !Je(se, x.players) && i.value?.send("ludo-reject", { reason: "这局已经开始，下一局再来吧。" }, { target: se.id, reliability: "reliable" });
        const P = new Set(M.map((se) => se.id));
        x.players = x.players.filter((se) => P.has(se.id)), x.players.findIndex((se) => se.id === T) < 0 && T && (x.turn = Math.min(Math.max(0, x.turn), Math.max(0, x.players.length - 1)), x.phase = "roll", x.dice = 0, x.notice = `${T === J.value ? "一位玩家" : "当前玩家"}离开了房间，游戏继续`);
      } else
        x.players = [...M].sort((P, ne) => P.id.localeCompare(ne.id)).slice(0, 4).map((P, ne) => ({ id: P.id, name: P.name, color: t[ne], planes: [-1, -1, -1, -1] }));
      x.turn = Math.max(0, x.players.findIndex((P) => P.id === T)), x.notice = x.phase === "waiting" ? x.players.length >= 2 ? "飞行员到齐，可以开局" : "等待第二位玩家加入" : x.notice, JSON.stringify(x) !== JSON.stringify(a.value) && (x.rev++, Ee(x));
    }
    function bt(M) {
      if (!M || typeof M != "object") return !1;
      const x = M;
      return Number.isSafeInteger(x.rev) && x.rev >= 0 && Array.isArray(x.players) && x.players.length <= 4 && Number.isInteger(x.turn) && x.turn >= 0 && x.turn < Math.max(1, x.players.length) && ["waiting", "roll", "move", "done"].includes(x.phase) && Number.isInteger(x.dice) && x.dice >= 0 && x.dice <= 6 && (x.winner === null || typeof x.winner == "string") && x.players.every((T) => T && typeof T.id == "string" && typeof T.name == "string" && t.includes(T.color) && Array.isArray(T.planes) && T.planes.length === 4 && T.planes.every((P) => Number.isInteger(P) && P >= -1 && P <= 57));
    }
    function At(M) {
      const x = M.payload;
      if (!(!f.value.some((T) => T.id === M.from) || !x || typeof x != "object")) {
        if (M.kind === "ludo-reject" && typeof x?.reason == "string") {
          d.value = x.reason, _e();
          return;
        }
        if (M.kind === "ludo-state" && bt(x) && x.rev > a.value.rev && (a.value = x), M.kind === "ludo-request" && i.value?.send("ludo-state", a.value, { target: M.from, reliability: "reliable" }), M.kind === "ludo-start" && a.value.phase === "waiting" && a.value.players.length >= 2 && a.value.players.some((T) => T.id === M.from)) {
          const T = JSON.parse(JSON.stringify(a.value));
          T.phase = "roll", T.rev++, T.notice = `${T.players[T.turn].name}，掷出 6 让飞机起飞`, Ee(T);
        }
        M.kind === "ludo-action" && G(M.from, x);
      }
    }
    function zt() {
      if (!st.value) return;
      const M = JSON.parse(JSON.stringify(a.value));
      M.phase = "roll", M.notice = `${M.players[M.turn].name}，掷出 6 让飞机起飞`, M.rev++, Ee(M);
    }
    function oe(M) {
      if (!M.players.length) {
        M.phase = "waiting", M.turn = 0;
        return;
      }
      M.turn = (M.turn + 1) % M.players.length, M.phase = "roll", M.notice = `${M.players[M.turn].name} 的回合`;
    }
    function Y(M, x) {
      return M.planes.flatMap((T, P) => T === -1 && x === 6 || T >= 0 && T < 57 && T + x <= 57 ? [P] : []);
    }
    function G(M, x) {
      const T = JSON.parse(JSON.stringify(a.value)), P = T.players[T.turn];
      if (x.rev !== a.value.rev || !P || P.id !== M || T.phase === "waiting" || T.phase === "done") return;
      if (x.type === "roll" && T.phase === "roll") {
        if (!Number.isInteger(x.dice) || Number(x.dice) < 1 || Number(x.dice) > 6) return;
        T.dice = Number(x.dice), Y(P, T.dice).length ? (T.phase = "move", T.notice = `${P.name} 掷出 ${T.dice}，请选择一架飞机`) : T.dice === 6 ? T.notice = `${P.name} 掷出 6，没有可走的飞机，再掷一次` : oe(T), T.rev++, Ee(T);
        return;
      }
      if (x.type !== "move" || T.phase !== "move" || !Number.isInteger(x.plane)) return;
      const ne = Number(x.plane);
      if (!Y(P, T.dice).includes(ne)) return;
      const se = P.planes[ne], rt = se === -1 ? 0 : se + T.dice;
      P.planes[ne] = rt;
      let Le = 0;
      if (rt < 52) {
        const wt = (s[P.color] + rt) % 52;
        if (!n.has(wt))
          for (const u of T.players) u.id !== P.id && (u.planes = u.planes.map((h) => h >= 0 && h < 52 && (s[u.color] + h) % 52 === wt ? (Le++, -1) : h));
      }
      P.planes.every((wt) => wt === 57) ? (T.phase = "done", T.winner = P.id, T.notice = `${P.name} 的四架飞机全部到达终点，赢得本局！`) : T.dice === 6 || Le > 0 ? (T.phase = "roll", T.notice = Le ? `${P.name} 撞回 ${Le} 架对手飞机，再掷一次` : `${P.name} 掷出 6，再掷一次`) : oe(T), T.rev++, Ee(T);
    }
    function Pe(M, x) {
      if (!A.value) return;
      const T = { type: M, plane: x, rev: a.value.rev, dice: M === "roll" ? Math.floor(Math.random() * 6) + 1 : void 0 };
      G(J.value, T);
    }
    function xt() {
      Me.value && (R.value = !0, $ = window.setTimeout(() => {
        Pe("roll"), R.value = !1;
      }, 380));
    }
    function Ge(M) {
      a.value.phase === "move" && de.value && le.value && Y(le.value, a.value.dice).includes(M) && Pe("move", M);
    }
    async function _e() {
      try {
        await i.value?.leave();
      } finally {
        p.value && window.location.assign(p.value);
      }
    }
    return Er(async () => {
      if (!new URLSearchParams(location.search).has("room")) {
        I.value = !0, o.value = { id: "preview", name: "你", virtual_ip: "", endpoint: "" }, a.value = { rev: 1, players: [{ id: "preview", name: "你", color: "red", planes: [-1, -1, -1, -1] }], turn: 0, phase: "roll", dice: 0, winner: null, notice: "掷出 6，让第一架飞机起飞" }, O.value = !0;
        return;
      }
      try {
        const M = si.fromLocation();
        if (M.gameId !== "gamelink-flight-chess") throw new Error("此页面只支持飞行棋房间。");
        i.value = M, p.value = `${M.serverUrl}/`, M.on("room", (P) => {
          l.value = P;
        }), M.on("members", (P) => {
          f.value = P, _t(P);
        }), M.on("message", At), M.on("peer-state", (P) => {
          _.value = { ..._.value, [P.peerId]: P.state }, P.state === "connected" && M.send("ludo-request", {}, { target: P.peerId, reliability: "reliable" });
        }), M.on("error", (P) => {
          d.value = P.message;
        }), M.on("room-closed", () => {
          O.value = !1, d.value = "房间已关闭，请回到大厅重新加入。";
        });
        const x = new URLSearchParams(location.search).get("room")?.trim().toUpperCase();
        if (x) {
          const P = await fetch(`${M.serverUrl}/v1/rooms`);
          if (P.ok) {
            const se = (await P.json()).find((rt) => rt.code.toUpperCase() === x);
            if (se && se.game_id === "gamelink-flight-chess" && se.member_count >= Math.min(se.max_members, 4)) throw new Error("飞行棋房间已满，最多 4 位玩家。");
          }
        }
        const T = await M.joinFromLocation();
        l.value = T.room, o.value = T.self_member, f.value = T.room.members, a.value = { ...r(), players: [...f.value].sort((P, ne) => P.id.localeCompare(ne.id)).slice(0, 4).map((P, ne) => ({ id: P.id, name: P.name, color: t[ne], planes: [-1, -1, -1, -1] })), notice: f.value.length >= 2 ? "飞行员到齐，等待开局" : "等待第二位玩家加入" }, O.value = !0;
        for (const [P, ne] of M.peerStates)
          _.value[P] = ne, ne === "connected" && M.send("ludo-request", {}, { target: P, reliability: "reliable" });
      } catch (M) {
        i.value?.dispose(), d.value = M instanceof Error ? M.message : String(M);
      }
    }), Ar(() => {
      window.clearTimeout($), i.value?.dispose();
    }), (M, x) => (V(), Z("main", lc, [
      L("header", oc, [
        L("a", cc, [
          L("span", fc, [
            ce(gt, { name: "plane" })
          ]),
          x[0] || (x[0] = L("b", null, "飞行棋", -1))
        ]),
        L("div", uc, [
          x[1] || (x[1] = L("small", null, "房间", -1)),
          L("b", null, he(l.value?.code || "练习"), 1)
        ]),
        L("span", ac, he(I.value ? "单人练习" : `${F.value}/${a.value.players.length} 已连接`), 1),
        l.value && !I.value ? (V(), zr(ic, {
          key: 0,
          variant: "flight",
          "game-id": "gamelink-flight-chess",
          "room-code": l.value.code,
          "member-count": f.value.length,
          "max-members": 4
        }, null, 8, ["room-code", "member-count"])) : rn("", !0),
        L("button", {
          class: "gl-action flight-exit",
          onClick: _e
        }, [
          ce(gt, { name: "exit" }),
          x[2] || (x[2] = dn("退出", -1))
        ])
      ]),
      O.value ? (V(), Z("section", dc, [
        L("div", hc, [
          L("b", null, he(K.value), 1),
          L("span", null, he(A.value ? a.value.phase === "waiting" ? "2 人即可开始 · 最多 4 人" : a.value.notice : "等待连接恢复…"), 1)
        ]),
        d.value ? (V(), Z("p", pc, he(d.value), 1)) : rn("", !0),
        L("div", gc, [
          ce(Qo, {
            state: a.value,
            "self-id": J.value,
            onMove: Ge
          }, null, 8, ["state", "self-id"]),
          L("div", mc, [
            a.value.phase === "waiting" ? (V(), Z("button", {
              key: 0,
              class: "center-dice start-dice",
              disabled: !st.value,
              onClick: zt
            }, [
              ce(gt, { name: "plane" }),
              L("small", null, he(st.value ? `${a.value.players.length} 人开始` : a.value.players.length < 2 ? "等待朋友" : "连接中"), 1)
            ], 8, vc)) : (V(), Z("button", {
              key: 1,
              class: yt(["center-dice", { rolling: R.value, "is-mine": de.value && a.value.phase === "roll" }]),
              disabled: !Me.value,
              "aria-label": Me.value ? "掷骰子" : a.value.phase === "move" ? "请选择飞机" : "等待回合",
              onClick: xt
            }, [
              ce(gt, {
                name: "dice",
                value: a.value.dice || 5
              }, null, 8, ["value"]),
              L("small", null, he(R.value ? "掷骰中" : a.value.phase === "done" ? "已结束" : A.value ? de.value ? a.value.phase === "move" ? "选择飞机" : "掷骰子" : "等待对手" : "连接中"), 1)
            ], 10, yc))
          ])
        ]),
        L("div", _c, [
          (V(!0), Z(ie, null, qe(a.value.players, (T) => (V(), Z("div", {
            key: T.id,
            class: yt(["player-chip", [`roster-${T.color}`, { current: le.value?.id === T.id && a.value.phase !== "waiting" && a.value.phase !== "done" }]]),
            title: b(T.id)
          }, [
            x[3] || (x[3] = L("i", null, null, -1)),
            L("b", null, he(T.name) + he(T.id === J.value ? " · 你" : ""), 1),
            L("span", null, he(T.planes.filter((P) => P === 57).length) + "/4", 1),
            L("small", null, he(b(T.id)), 1)
          ], 10, bc))), 128))
        ]),
        x[4] || (x[4] = L("details", { class: "compact-rules" }, [
          L("summary", null, "玩法说明"),
          L("p", null, "2 人即可开局。掷出 6 起飞或再掷一次；点击亮起的飞机行棋。星标格安全，其他格撞回对手可再掷一次。刚好点数抵达终点，四架全部归航获胜。")
        ], -1))
      ])) : (V(), Z("section", xc, [
        x[5] || (x[5] = L("span", null, "✈", -1)),
        L("b", null, he(d.value || "正在加入房间…"), 1),
        d.value ? (V(), Z("a", {
          key: 0,
          href: p.value
        }, "返回大厅", 8, wc)) : rn("", !0)
      ]))
    ]));
  }
});
Ao(Mc).mount("#app");
