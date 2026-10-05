import { GameLinkClient as gl } from "./gamelink.js?v=44bdd90734fe";
// @__NO_SIDE_EFFECTS__
function rs(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const Q = {}, _t = [], Ge = () => {
}, ii = () => !1, Cn = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Mn = (e) => e.startsWith("onUpdate:"), ve = Object.assign, os = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, ml = Object.prototype.hasOwnProperty, G = (e, t) => ml.call(e, t), H = Array.isArray, dt = (e) => Xt(e) === "[object Map]", pn = (e) => Xt(e) === "[object Set]", Ts = (e) => Xt(e) === "[object Date]", j = (e) => typeof e == "function", ae = (e) => typeof e == "string", Je = (e) => typeof e == "symbol", X = (e) => e !== null && typeof e == "object", li = (e) => (X(e) || j(e)) && j(e.then) && j(e.catch), ri = Object.prototype.toString, Xt = (e) => ri.call(e), vl = (e) => Xt(e).slice(8, -1), oi = (e) => Xt(e) === "[object Object]", us = (e) => ae(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Nt = /* @__PURE__ */ rs(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Sn = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, bl = /-\w/g, Ne = Sn(
  (e) => e.replace(bl, (t) => t.slice(1).toUpperCase())
), yl = /\B([A-Z])/g, Ct = Sn(
  (e) => e.replace(yl, "-$1").toLowerCase()
), ui = Sn((e) => e.charAt(0).toUpperCase() + e.slice(1)), kn = Sn(
  (e) => e ? `on${ui(e)}` : ""
), Ze = (e, t) => !Object.is(e, t), an = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, ci = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, cs = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let Es;
const Tn = () => Es || (Es = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Ot(e) {
  if (H(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], i = ae(s) ? Cl(s) : Ot(s);
      if (i)
        for (const l in i)
          t[l] = i[l];
    }
    return t;
  } else if (ae(e) || X(e))
    return e;
}
const _l = /;(?![^(]*\))/g, xl = /:([^]+)/, wl = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function Cl(e) {
  const t = {};
  return e.replace(wl, (n) => n.startsWith("/*") ? "" : n).split(_l).forEach((n) => {
    if (n) {
      const s = n.split(xl);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function He(e) {
  let t = "";
  if (ae(e))
    t = e;
  else if (H(e))
    for (let n = 0; n < e.length; n++) {
      const s = He(e[n]);
      s && (t += s + " ");
    }
  else if (X(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const Ml = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Sl = /* @__PURE__ */ rs(Ml);
function ai(e) {
  return !!e || e === "";
}
function Tl(e, t, n) {
  if (e.length !== t.length) return !1;
  let s = !0;
  for (let i = 0; s && i < e.length; i++)
    s = En(e[i], t[i], n);
  return s;
}
function As(e, t, n) {
  if (e.size !== t.size) return !1;
  const s = Array.from(t), i = new Uint8Array(s.length);
  for (const l of e) {
    let r = -1;
    for (let o = 0; o < s.length; o++)
      if (!i[o] && En(l, s[o], n)) {
        r = o;
        break;
      }
    if (r < 0) return !1;
    i[r] = 1;
  }
  return !0;
}
function El(e, t, n) {
  let s = dt(e), i = dt(t);
  if (s || i || (s = pn(e), i = pn(t), s || i))
    return s && i ? As(e, t, n) : !1;
  const l = Object.keys(e).length, r = Object.keys(t).length;
  if (l !== r)
    return !1;
  for (const o in e) {
    const u = e.hasOwnProperty(o), p = t.hasOwnProperty(o);
    if (u && !p || !u && p || !En(e[o], t[o], n))
      return !1;
  }
  return String(e) === String(t);
}
function Is(e, t, n, s) {
  n || (n = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()]);
  const [i, l] = n;
  if (i.has(e) || l.has(t))
    return i.get(e) === t && l.get(t) === e;
  i.set(e, t), l.set(t, e);
  const r = s(e, t, n);
  return i.delete(e), l.delete(t), r;
}
function En(e, t, n) {
  if (e === t) return !0;
  let s = Ts(e), i = Ts(t);
  return s || i ? s && i ? e.getTime() === t.getTime() : !1 : (s = Je(e), i = Je(t), s || i ? e === t : (s = H(e), i = H(t), s || i ? s && i ? Is(e, t, n, Tl) : !1 : (s = X(e), i = X(t), s || i ? !s || !i ? !1 : Is(e, t, n, El) : String(e) === String(t))));
}
const fi = (e) => !!(e && e.__v_isRef === !0), he = (e) => ae(e) ? e : e == null ? "" : H(e) || X(e) && (e.toString === ri || !j(e.toString)) ? fi(e) ? he(e.value) : JSON.stringify(e, di, 2) : String(e), di = (e, t) => fi(t) ? di(e, t.value) : dt(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, i], l) => (n[Ln(s, l) + " =>"] = i, n),
    {}
  )
} : pn(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => Ln(n))
} : Je(t) ? Ln(t) : X(t) && !H(t) && !oi(t) ? String(t) : t, Ln = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    Je(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
let ge;
class Al {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !t && ge && (ge.active ? (this.parent = ge, this.index = (ge.scopes || (ge.scopes = [])).push(
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
        const i = this.scopes.slice();
        for (t = 0, n = i.length; t < n; t++)
          i[t].resume();
      }
      const s = this.effects.slice();
      for (t = 0, n = s.length; t < n; t++)
        s[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = ge;
      try {
        return ge = this, t();
      } finally {
        ge = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = ge, ge = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (ge === this)
        ge = this.prevScope;
      else {
        let t = ge;
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
        const i = this.scopes.slice();
        for (n = 0, s = i.length; n < s; n++)
          i[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const i = this.parent.scopes.pop();
        i && i !== this && (this.parent.scopes[this.index] = i, i.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function Il() {
  return ge;
}
let ne;
const Hn = /* @__PURE__ */ new WeakSet();
class hi {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, ge && (ge.active ? ge.effects.push(this) : this.flags &= -2);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Hn.has(this) && (Hn.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || gi(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Os(this), mi(this);
    const t = ne, n = je;
    ne = this, je = !0;
    try {
      return this.fn();
    } finally {
      vi(this), ne = t, je = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        ds(t);
      this.deps = this.depsTail = void 0, Os(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Hn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Zn(this) && this.run();
  }
  get dirty() {
    return Zn(this);
  }
}
let pi = 0, jt, Vt;
function gi(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = Vt, Vt = e;
    return;
  }
  e.next = jt, jt = e;
}
function as() {
  pi++;
}
function fs() {
  if (--pi > 0)
    return;
  if (Vt) {
    let t = Vt;
    for (Vt = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; jt; ) {
    let t = jt;
    for (jt = void 0; t; ) {
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
function mi(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function vi(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const i = s.prevDep;
    s.version === -1 ? (s === n && (n = i), ds(s), Ol(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = i;
  }
  e.deps = t, e.depsTail = n;
}
function Zn(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (bi(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function bi(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === zt) || (e.globalVersion = zt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Zn(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = ne, s = je;
  ne = e, je = !0;
  try {
    mi(e);
    const i = e.fn(e._value);
    (t.version === 0 || Ze(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    ne = n, je = s, vi(e), e.flags &= -3;
  }
}
function ds(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: i } = e;
  if (s && (s.nextSub = i, e.prevSub = void 0), i && (i.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let l = n.computed.deps; l; l = l.nextDep)
      ds(l, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ol(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let je = !0;
const yi = [];
function lt() {
  yi.push(je), je = !1;
}
function rt() {
  const e = yi.pop();
  je = e === void 0 ? !0 : e;
}
function Os(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = ne;
    ne = void 0;
    try {
      t();
    } finally {
      ne = n;
    }
  }
}
let zt = 0;
class Pl {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class hs {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!ne || !je || ne === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== ne)
      n = this.activeLink = new Pl(ne, this), ne.deps ? (n.prevDep = ne.depsTail, ne.depsTail.nextDep = n, ne.depsTail = n) : ne.deps = ne.depsTail = n, _i(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = ne.depsTail, n.nextDep = void 0, ne.depsTail.nextDep = n, ne.depsTail = n, ne.deps === n && (ne.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, zt++, this.notify(t);
  }
  notify(t) {
    as();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      fs();
    }
  }
}
function _i(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        _i(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const Gn = /* @__PURE__ */ new WeakMap(), xt = /* @__PURE__ */ Symbol(
  ""
), Jn = /* @__PURE__ */ Symbol(
  ""
), qt = /* @__PURE__ */ Symbol(
  ""
);
function _e(e, t, n) {
  if (je && ne) {
    let s = Gn.get(e);
    s || Gn.set(e, s = /* @__PURE__ */ new Map());
    let i = s.get(n);
    i || (s.set(n, i = new hs()), i.map = s, i.key = n), i.track();
  }
}
function st(e, t, n, s, i, l) {
  const r = Gn.get(e);
  if (!r) {
    zt++;
    return;
  }
  const o = (u) => {
    u && u.trigger();
  };
  if (as(), t === "clear")
    r.forEach(o);
  else {
    const u = H(e), p = u && us(n);
    if (u && n === "length") {
      const d = Number(s);
      r.forEach((g, _) => {
        (_ === "length" || _ === qt || !Je(_) && _ >= d) && o(g);
      });
    } else
      switch ((n !== void 0 || r.has(void 0)) && o(r.get(n)), p && o(r.get(qt)), t) {
        case "add":
          u ? p && o(r.get("length")) : (o(r.get(xt)), dt(e) && o(r.get(Jn)));
          break;
        case "delete":
          u || (o(r.get(xt)), dt(e) && o(r.get(Jn)));
          break;
        case "set":
          dt(e) && o(r.get(xt));
          break;
      }
  }
  fs();
}
function St(e) {
  const t = /* @__PURE__ */ Z(e);
  return t === e || (_e(t, "iterate", qt), /* @__PURE__ */ ke(e)) ? t : /* @__PURE__ */ Ye(e) ? /* @__PURE__ */ ht(e) ? t.map((n) => pt(Le(n))) : t.map(pt) : t.map(Le);
}
function An(e) {
  return _e(e = /* @__PURE__ */ Z(e), "iterate", qt), e;
}
function ze(e, t) {
  return /* @__PURE__ */ Ye(e) ? pt(/* @__PURE__ */ ht(e) ? Le(t) : t) : Le(t);
}
const Rl = {
  __proto__: null,
  [Symbol.iterator]() {
    return Nn(this, Symbol.iterator, (e) => ze(this, e));
  },
  concat(...e) {
    return St(this).concat(
      ...e.map((t) => H(t) ? St(t) : t)
    );
  },
  entries() {
    return Nn(this, "entries", (e) => (e[1] = ze(this, e[1]), e));
  },
  every(e, t) {
    return et(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return et(
      this,
      "filter",
      e,
      t,
      (n) => n.map((s) => ze(this, s)),
      arguments
    );
  },
  find(e, t) {
    return et(
      this,
      "find",
      e,
      t,
      (n) => ze(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return et(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return et(
      this,
      "findLast",
      e,
      t,
      (n) => ze(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return et(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return et(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return jn(this, "includes", e);
  },
  indexOf(...e) {
    return jn(this, "indexOf", e);
  },
  join(e) {
    return St(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return jn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return et(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return Dt(this, "pop");
  },
  push(...e) {
    return Dt(this, "push", e);
  },
  reduce(e, ...t) {
    return Ps(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Ps(this, "reduceRight", e, t);
  },
  shift() {
    return Dt(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return et(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return Dt(this, "splice", e);
  },
  toReversed() {
    return St(this).toReversed();
  },
  toSorted(e) {
    return St(this).toSorted(e);
  },
  toSpliced(...e) {
    return St(this).toSpliced(...e);
  },
  unshift(...e) {
    return Dt(this, "unshift", e);
  },
  values() {
    return Nn(this, "values", (e) => ze(this, e));
  }
};
function Nn(e, t, n) {
  const s = An(e), i = s[t]();
  return s !== e && !/* @__PURE__ */ ke(e) && (i._next = i.next, i.next = () => {
    const l = i._next();
    return l.done || (l.value = n(l.value)), l;
  }), i;
}
const $l = Array.prototype;
function et(e, t, n, s, i, l) {
  const r = An(e), o = r !== e && !/* @__PURE__ */ ke(e), u = r[t];
  if (u !== $l[t]) {
    const g = u.apply(e, l);
    return o ? Le(g) : g;
  }
  let p = n;
  r !== e && (o ? p = function(g, _) {
    return n.call(this, ze(e, g), _, e);
  } : n.length > 2 && (p = function(g, _) {
    return n.call(this, g, _, e);
  }));
  const d = u.call(r, p, s);
  return o && i ? i(d) : d;
}
function Ps(e, t, n, s) {
  const i = An(e), l = i !== e && !/* @__PURE__ */ ke(e);
  let r = n, o = !1;
  i !== e && (l ? (o = s.length === 0, r = function(p, d, g) {
    return o && (o = !1, p = ze(e, p)), n.call(this, p, ze(e, d), g, e);
  }) : n.length > 3 && (r = function(p, d, g) {
    return n.call(this, p, d, g, e);
  }));
  const u = i[t](r, ...s);
  return o ? ze(e, u) : u;
}
function jn(e, t, n) {
  const s = /* @__PURE__ */ Z(e);
  _e(s, "iterate", qt);
  const i = s[t](...n);
  return (i === -1 || i === !1) && /* @__PURE__ */ vs(n[0]) ? (n[0] = /* @__PURE__ */ Z(n[0]), s[t](...n)) : i;
}
function Dt(e, t, n = []) {
  lt(), as();
  const s = (/* @__PURE__ */ Z(e))[t].apply(e, n);
  return fs(), rt(), s;
}
const Dl = /* @__PURE__ */ rs("__proto__,__v_isRef,__isVue"), xi = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Je)
);
function Fl(e) {
  Je(e) || (e = String(e));
  const t = /* @__PURE__ */ Z(this);
  return _e(t, "has", e), t.hasOwnProperty(e);
}
class wi {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, s) {
    if (n === "__v_skip") return t.__v_skip;
    const i = this._isReadonly, l = this._isShallow;
    if (n === "__v_isReactive")
      return !i;
    if (n === "__v_isReadonly")
      return i;
    if (n === "__v_isShallow")
      return l;
    if (n === "__v_raw")
      return s === (i ? l ? Wl : Ti : l ? Si : Mi).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const r = H(t);
    if (!i) {
      let u;
      if (r && (u = Rl[n]))
        return u;
      if (n === "hasOwnProperty")
        return Fl;
    }
    const o = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ xe(t) ? t : s
    );
    if ((Je(n) ? xi.has(n) : Dl(n)) || (i || _e(t, "get", n), l))
      return o;
    if (/* @__PURE__ */ xe(o)) {
      const u = r && us(n) ? o : o.value;
      return i && X(u) ? /* @__PURE__ */ Xn(u) : u;
    }
    return X(o) ? i ? /* @__PURE__ */ Xn(o) : /* @__PURE__ */ gs(o) : o;
  }
}
class Ci extends wi {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, i) {
    let l = t[n];
    const r = H(t) && us(n);
    if (!this._isShallow) {
      const p = /* @__PURE__ */ Ye(l);
      if (!/* @__PURE__ */ ke(s) && !/* @__PURE__ */ Ye(s) && (l = /* @__PURE__ */ Z(l), s = /* @__PURE__ */ Z(s)), !r && /* @__PURE__ */ xe(l) && !/* @__PURE__ */ xe(s))
        return p || (l.value = s), !0;
    }
    const o = r ? Number(n) < t.length : G(t, n), u = Reflect.set(
      t,
      n,
      s,
      /* @__PURE__ */ xe(t) ? t : i
    );
    return t === /* @__PURE__ */ Z(i) && u && (o ? Ze(s, l) && st(t, "set", n, s) : st(t, "add", n, s)), u;
  }
  deleteProperty(t, n) {
    const s = G(t, n);
    t[n];
    const i = Reflect.deleteProperty(t, n);
    return i && s && st(t, "delete", n, void 0), i;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!Je(n) || !xi.has(n)) && _e(t, "has", n), s;
  }
  ownKeys(t) {
    return _e(
      t,
      "iterate",
      H(t) ? "length" : xt
    ), Reflect.ownKeys(t);
  }
}
class kl extends wi {
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
const Ll = /* @__PURE__ */ new Ci(), Hl = /* @__PURE__ */ new kl(), Nl = /* @__PURE__ */ new Ci(!0);
const Yn = (e) => e, sn = (e) => Reflect.getPrototypeOf(e);
function jl(e, t, n) {
  return function(...s) {
    const i = this.__v_raw, l = /* @__PURE__ */ Z(i), r = dt(l), o = e === "entries" || e === Symbol.iterator && r, u = e === "keys" && r, p = i[e](...s), d = n ? Yn : t ? pt : Le;
    return !t && _e(
      l,
      "iterate",
      u ? Jn : xt
    ), ve(
      // inheriting all iterator properties
      Object.create(p),
      {
        // iterator protocol
        next() {
          const { value: g, done: _ } = p.next();
          return _ ? { value: g, done: _ } : {
            value: o ? [d(g[0]), d(g[1])] : d(g),
            done: _
          };
        }
      }
    );
  };
}
function ln(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Vl(e, t) {
  const n = {
    get(i) {
      const l = this.__v_raw, r = /* @__PURE__ */ Z(l), o = /* @__PURE__ */ Z(i);
      e || (Ze(i, o) && _e(r, "get", i), _e(r, "get", o));
      const { has: u } = sn(r), p = t ? Yn : e ? pt : Le;
      if (u.call(r, i))
        return p(l.get(i));
      if (u.call(r, o))
        return p(l.get(o));
      l !== r && l.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !e && _e(/* @__PURE__ */ Z(i), "iterate", xt), i.size;
    },
    has(i) {
      const l = this.__v_raw, r = /* @__PURE__ */ Z(l), o = /* @__PURE__ */ Z(i);
      return e || (Ze(i, o) && _e(r, "has", i), _e(r, "has", o)), i === o ? l.has(i) : l.has(i) || l.has(o);
    },
    forEach(i, l) {
      const r = this, o = r.__v_raw, u = /* @__PURE__ */ Z(o), p = t ? Yn : e ? pt : Le;
      return !e && _e(u, "iterate", xt), o.forEach((d, g) => i.call(l, p(d), p(g), r));
    }
  };
  return ve(
    n,
    e ? {
      add: ln("add"),
      set: ln("set"),
      delete: ln("delete"),
      clear: ln("clear")
    } : {
      add(i) {
        const l = /* @__PURE__ */ Z(this), r = sn(l), o = /* @__PURE__ */ Z(i), u = !t && !/* @__PURE__ */ ke(i) && !/* @__PURE__ */ Ye(i) ? o : i;
        return r.has.call(l, u) || Ze(i, u) && r.has.call(l, i) || Ze(o, u) && r.has.call(l, o) || (l.add(u), st(l, "add", u, u)), this;
      },
      set(i, l) {
        !t && !/* @__PURE__ */ ke(l) && !/* @__PURE__ */ Ye(l) && (l = /* @__PURE__ */ Z(l));
        const r = /* @__PURE__ */ Z(this), { has: o, get: u } = sn(r);
        let p = o.call(r, i);
        p || (i = /* @__PURE__ */ Z(i), p = o.call(r, i));
        const d = u.call(r, i);
        return r.set(i, l), p ? Ze(l, d) && st(r, "set", i, l) : st(r, "add", i, l), this;
      },
      delete(i) {
        const l = /* @__PURE__ */ Z(this), { has: r, get: o } = sn(l);
        let u = r.call(l, i);
        u || (i = /* @__PURE__ */ Z(i), u = r.call(l, i)), o && o.call(l, i);
        const p = l.delete(i);
        return u && st(l, "delete", i, void 0), p;
      },
      clear() {
        const i = /* @__PURE__ */ Z(this), l = i.size !== 0, r = i.clear();
        return l && st(
          i,
          "clear",
          void 0,
          void 0
        ), r;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((i) => {
    n[i] = jl(i, e, t);
  }), n;
}
function ps(e, t) {
  const n = Vl(e, t);
  return (s, i, l) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? s : Reflect.get(
    G(n, i) && i in s ? n : s,
    i,
    l
  );
}
const Kl = {
  get: /* @__PURE__ */ ps(!1, !1)
}, Ul = {
  get: /* @__PURE__ */ ps(!1, !0)
}, Bl = {
  get: /* @__PURE__ */ ps(!0, !1)
};
const Mi = /* @__PURE__ */ new WeakMap(), Si = /* @__PURE__ */ new WeakMap(), Ti = /* @__PURE__ */ new WeakMap(), Wl = /* @__PURE__ */ new WeakMap();
function zl(e) {
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
function gs(e) {
  return /* @__PURE__ */ Ye(e) ? e : ms(
    e,
    !1,
    Ll,
    Kl,
    Mi
  );
}
// @__NO_SIDE_EFFECTS__
function ql(e) {
  return ms(
    e,
    !1,
    Nl,
    Ul,
    Si
  );
}
// @__NO_SIDE_EFFECTS__
function Xn(e) {
  return ms(
    e,
    !0,
    Hl,
    Bl,
    Ti
  );
}
function ms(e, t, n, s, i) {
  if (!X(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const l = i.get(e);
  if (l)
    return l;
  const r = zl(vl(e));
  if (r === 0)
    return e;
  const o = new Proxy(
    e,
    r === 2 ? s : n
  );
  return i.set(e, o), o;
}
// @__NO_SIDE_EFFECTS__
function ht(e) {
  return /* @__PURE__ */ Ye(e) ? /* @__PURE__ */ ht(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Ye(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function ke(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function vs(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function Z(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ Z(t) : e;
}
function Zl(e) {
  return !G(e, "__v_skip") && Object.isExtensible(e) && ci(e, "__v_skip", !0), e;
}
const Le = (e) => X(e) ? /* @__PURE__ */ gs(e) : e, pt = (e) => X(e) ? /* @__PURE__ */ Xn(e) : e;
// @__NO_SIDE_EFFECTS__
function xe(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function ie(e) {
  return Ei(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Gl(e) {
  return Ei(e, !0);
}
function Ei(e, t) {
  return /* @__PURE__ */ xe(e) ? e : new Jl(e, t);
}
class Jl {
  constructor(t, n) {
    this.dep = new hs(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : /* @__PURE__ */ Z(t), this._value = n ? t : Le(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || /* @__PURE__ */ ke(t) || /* @__PURE__ */ Ye(t);
    t = s ? t : /* @__PURE__ */ Z(t), Ze(t, n) && (this._rawValue = t, this._value = s ? t : Le(t), this.dep.trigger());
  }
}
function Ai(e) {
  return /* @__PURE__ */ xe(e) ? e.value : e;
}
const Yl = {
  get: (e, t, n) => t === "__v_raw" ? e : Ai(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const i = e[t];
    return /* @__PURE__ */ xe(i) && !/* @__PURE__ */ xe(n) ? (i.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function Ii(e) {
  return /* @__PURE__ */ ht(e) ? e : new Proxy(e, Yl);
}
class Xl {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new hs(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = zt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    ne !== this)
      return gi(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return bi(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function Ql(e, t, n = !1) {
  let s, i;
  return j(e) ? s = e : (s = e.get, i = e.set), new Xl(s, i, n);
}
const rn = {}, gn = /* @__PURE__ */ new WeakMap();
let yt;
function er(e, t = !1, n = yt) {
  if (n) {
    let s = gn.get(n);
    s || gn.set(n, s = []), s.push(e);
  }
}
function tr(e, t, n = Q) {
  const { immediate: s, deep: i, once: l, scheduler: r, augmentJob: o, call: u } = n, p = (F) => i ? F : /* @__PURE__ */ ke(F) || i === !1 || i === 0 ? it(F, 1) : it(F);
  let d, g, _, P, K = !1, R = !1;
  if (/* @__PURE__ */ xe(e) ? (g = () => e.value, K = /* @__PURE__ */ ke(e)) : /* @__PURE__ */ ht(e) ? (g = () => p(e), K = !0) : H(e) ? (R = !0, K = e.some((F) => /* @__PURE__ */ ht(F) || /* @__PURE__ */ ke(F)), g = () => e.map((F) => {
    if (/* @__PURE__ */ xe(F))
      return F.value;
    if (/* @__PURE__ */ ht(F))
      return p(F);
    if (j(F))
      return u ? u(F, 2) : F();
  })) : j(e) ? t ? g = u ? () => u(e, 2) : e : g = () => {
    if (_) {
      lt();
      try {
        _();
      } finally {
        rt();
      }
    }
    const F = yt;
    yt = d;
    try {
      return u ? u(e, 3, [P]) : e(P);
    } finally {
      yt = F;
    }
  } : g = Ge, t && i) {
    const F = g, L = i === !0 ? 1 / 0 : i;
    g = () => it(F(), L);
  }
  const ee = Il(), Y = () => {
    d.stop(), ee && ee.active && os(ee.effects, d);
  };
  if (l && t) {
    const F = t;
    t = (...L) => {
      const fe = F(...L);
      return Y(), fe;
    };
  }
  let V = R ? new Array(e.length).fill(rn) : rn;
  const U = (F) => {
    if (!(!(d.flags & 1) || !d.dirty && !F))
      if (t) {
        const L = d.run();
        if (F || i || K || (R ? L.some((fe, se) => Ze(fe, V[se])) : Ze(L, V))) {
          _ && _();
          const fe = yt;
          yt = d;
          try {
            const se = [
              L,
              // pass undefined as the old value when it's changed for the first time
              V === rn ? void 0 : R && V[0] === rn ? [] : V,
              P
            ];
            V = L, u ? u(t, 3, se) : (
              // @ts-expect-error
              t(...se)
            );
          } finally {
            yt = fe;
          }
        }
      } else
        d.run();
  };
  return o && o(U), d = new hi(g), d.scheduler = r ? () => r(U, !1) : U, P = (F) => er(F, !1, d), _ = d.onStop = () => {
    const F = gn.get(d);
    if (F) {
      if (u)
        u(F, 4);
      else
        for (const L of F) L();
      gn.delete(d);
    }
  }, t ? s ? U(!0) : V = d.run() : r ? r(U.bind(null, !0), !0) : d.run(), Y.pause = d.pause.bind(d), Y.resume = d.resume.bind(d), Y.stop = Y, Y;
}
function it(e, t = 1 / 0, n) {
  if (t <= 0 || !X(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, /* @__PURE__ */ xe(e))
    it(e.value, t, n);
  else if (H(e))
    for (let s = 0; s < e.length; s++)
      it(e[s], t, n);
  else if (pn(e) || dt(e))
    e.forEach((s) => {
      it(s, t, n);
    });
  else if (oi(e)) {
    for (const s in e)
      it(e[s], t, n);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && it(e[s], t, n);
  }
  return e;
}
function Qt(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (i) {
    In(i, t, n);
  }
}
function Ve(e, t, n, s) {
  if (j(e)) {
    const i = Qt(e, t, n, s);
    return i && li(i) && i.catch((l) => {
      In(l, t, n);
    }), i;
  }
  if (H(e)) {
    const i = [];
    for (let l = 0; l < e.length; l++)
      i.push(Ve(e[l], t, n, s));
    return i;
  }
}
function In(e, t, n, s = !0) {
  const i = t ? t.vnode : null, { errorHandler: l, throwUnhandledErrorInProduction: r } = t && t.appContext.config || Q;
  if (t) {
    let o = t.parent;
    const u = t.proxy, p = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; o; ) {
      const d = o.ec;
      if (d) {
        for (let g = 0; g < d.length; g++)
          if (d[g](e, u, p) === !1)
            return;
      }
      o = o.parent;
    }
    if (l) {
      lt(), Qt(l, null, 10, [
        e,
        u,
        p
      ]), rt();
      return;
    }
  }
  nr(e, n, i, s, r);
}
function nr(e, t, n, s = !0, i = !1) {
  if (i)
    throw e;
  console.error(e);
}
const Me = [];
let We = -1;
const At = [];
let ft = null, Tt = 0;
const Oi = /* @__PURE__ */ Promise.resolve();
let mn = null;
function Pi(e) {
  const t = mn || Oi;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function sr(e) {
  let t = We + 1, n = Me.length;
  for (; t < n; ) {
    const s = t + n >>> 1, i = Me[s], l = Zt(i);
    l < e || l === e && i.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function bs(e) {
  if (!(e.flags & 1)) {
    const t = Zt(e), n = Me[Me.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Zt(n) ? Me.push(e) : Me.splice(sr(t), 0, e), e.flags |= 1, Ri();
  }
}
function Ri() {
  mn || (mn = Oi.then(Di));
}
function ir(e) {
  if (!H(e))
    ft && e.id === -1 ? ft.splice(Tt + 1, 0, e) : e.flags & 1 || (At.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      At.push(e[t]);
  Ri();
}
function Rs(e, t, n = We + 1) {
  for (; n < Me.length; n++) {
    const s = Me[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid)
        continue;
      Me.splice(n, 1), n--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2);
    }
  }
}
function $i(e) {
  if (At.length) {
    const t = [...new Set(At)].sort(
      (n, s) => Zt(n) - Zt(s)
    );
    if (At.length = 0, ft) {
      for (let n = 0; n < t.length; n++)
        ft.push(t[n]);
      return;
    }
    for (ft = t, Tt = 0; Tt < ft.length; Tt++) {
      const n = ft[Tt];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    ft = null, Tt = 0;
  }
}
const Zt = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Di(e) {
  try {
    for (We = 0; We < Me.length; We++) {
      const t = Me[We];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), Qt(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; We < Me.length; We++) {
      const t = Me[We];
      t && (t.flags &= -2);
    }
    We = -1, Me.length = 0, $i(), mn = null, (Me.length || At.length) && Di();
  }
}
let Fe = null, Fi = null;
function vn(e) {
  const t = Fe;
  return Fe = e, Fi = e && e.type.__scopeId || null, t;
}
function lr(e, t = Fe, n) {
  if (!t || e._n)
    return e;
  const s = (...i) => {
    s._d && Us(-1);
    const l = vn(t), r = wt.length;
    let o;
    try {
      o = e(...i);
    } finally {
      for (let u = wt.length; u > r; u--) ll();
      vn(l), s._d && Us(1);
    }
    return o;
  };
  return s._n = !0, s._c = !0, s._d = !0, s;
}
function rr(e, t) {
  if (Fe === null)
    return e;
  const n = Fn(Fe), s = e.dirs || (e.dirs = []);
  for (let i = 0; i < t.length; i++) {
    let [l, r, o, u = Q] = t[i];
    l && (j(l) && (l = {
      mounted: l,
      updated: l
    }), l.deep && it(r), s.push({
      dir: l,
      instance: n,
      value: r,
      oldValue: void 0,
      arg: o,
      modifiers: u
    }));
  }
  return e;
}
function vt(e, t, n, s) {
  const i = e.dirs, l = t && t.dirs;
  for (let r = 0; r < i.length; r++) {
    const o = i[r];
    l && (o.oldValue = l[r].value);
    let u = o.dir[s];
    u && (lt(), Ve(u, n, 8, [
      e.el,
      o,
      e,
      t
    ]), rt());
  }
}
function or(e, t) {
  if (Te) {
    let n = Te.provides;
    const s = Te.parent && Te.parent.provides;
    s === n && (n = Te.provides = Object.create(s)), n[e] = t;
  }
}
function fn(e, t, n = !1) {
  const s = no();
  if (s || It) {
    let i = It ? It._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (i && e in i)
      return i[e];
    if (arguments.length > 1)
      return n && j(t) ? t.call(s && s.proxy) : t;
  }
}
const ur = /* @__PURE__ */ Symbol.for("v-scx"), cr = () => fn(ur);
function dn(e, t, n) {
  return ki(e, t, n);
}
function ki(e, t, n = Q) {
  const { immediate: s, deep: i, flush: l, once: r } = n, o = ve({}, n), u = t && s || !t && l !== "post";
  let p;
  if (Yt) {
    if (l === "sync") {
      const P = cr();
      p = P.__watcherHandles || (P.__watcherHandles = []);
    } else if (!u) {
      const P = () => {
      };
      return P.stop = Ge, P.resume = Ge, P.pause = Ge, P;
    }
  }
  const d = Te;
  o.call = (P, K, R) => Ve(P, d, K, R);
  let g = !1;
  l === "post" ? o.scheduler = (P) => {
    Oe(P, d && d.suspense);
  } : l !== "sync" && (g = !0, o.scheduler = (P, K) => {
    K ? P() : bs(P);
  }), o.augmentJob = (P) => {
    t && (P.flags |= 4), g && (P.flags |= 2, d && (P.id = d.uid, P.i = d));
  };
  const _ = tr(e, t, o);
  return Yt && (p ? p.push(_) : u && _()), _;
}
function ar(e, t, n) {
  const s = this.proxy, i = ae(e) ? e.includes(".") ? Li(s, e) : () => s[e] : e.bind(s, s);
  let l;
  j(t) ? l = t : (l = t.handler, n = t);
  const r = en(this), o = ki(i, l.bind(s), n);
  return r(), o;
}
function Li(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let i = 0; i < n.length && s; i++)
      s = s[n[i]];
    return s;
  };
}
const fr = /* @__PURE__ */ Symbol("_vte"), On = (e) => e.__isTeleport, Vn = /* @__PURE__ */ Symbol("_leaveCb");
function dr(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const n of e)
      if (n.type !== ot) {
        t = n;
        break;
      }
  }
  return t;
}
function Hi(e) {
  if (!_s(e))
    return On(e.type) && e.children ? dr(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: n } = e;
  if (n) {
    if (t & 16)
      return n[0];
    if (t & 32 && j(n.default))
      return n.default();
  }
}
function ys(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const n = e.component.subTree;
    ys(
      On(n.type) && Hi(n) || n,
      t
    );
  } else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function Pn(e, t) {
  return j(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    ve({ name: e.name }, t, { setup: e })
  ) : e;
}
function Ni(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function $s(e, t) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
const bn = /* @__PURE__ */ new WeakMap();
function Kt(e, t, n, s, i = !1) {
  if (H(e)) {
    e.forEach(
      (R, ee) => Kt(
        R,
        t && (H(t) ? t[ee] : t),
        n,
        s,
        i
      )
    );
    return;
  }
  if (Ut(s) && !i) {
    s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && Kt(e, t, n, s.component.subTree);
    return;
  }
  const l = s.shapeFlag & 4 ? Fn(s.component) : s.el, r = i ? null : l, { i: o, r: u } = e, p = t && t.r, d = o.refs === Q ? o.refs = {} : o.refs, g = o.setupState, _ = /* @__PURE__ */ Z(g), P = g === Q ? ii : (R) => $s(d, R) ? !1 : G(_, R), K = (R, ee) => !(ee && $s(d, ee));
  if (p != null && p !== u) {
    if (Ds(t), ae(p))
      d[p] = null, P(p) && (g[p] = null);
    else if (/* @__PURE__ */ xe(p)) {
      const R = t;
      K(p, R.k) && (p.value = null), R.k && (d[R.k] = null);
    }
  }
  if (j(u))
    Qt(u, o, 12, [r, d]);
  else {
    const R = ae(u), ee = /* @__PURE__ */ xe(u);
    if (R || ee) {
      const Y = () => {
        if (e.f) {
          const V = R ? P(u) ? g[u] : d[u] : K() || !e.k ? u.value : d[e.k];
          if (i)
            H(V) && os(V, l);
          else if (H(V))
            V.includes(l) || V.push(l);
          else if (R)
            d[u] = [l], P(u) && (g[u] = d[u]);
          else {
            const U = [l];
            K(u, e.k) && (u.value = U), e.k && (d[e.k] = U);
          }
        } else R ? (d[u] = r, P(u) && (g[u] = r)) : ee && (K(u, e.k) && (u.value = r), e.k && (d[e.k] = r));
      };
      if (r) {
        const V = () => {
          Y(), bn.delete(e);
        };
        V.id = -1, bn.set(e, V), Oe(V, n);
      } else
        Ds(e), Y();
    }
  }
}
function Ds(e) {
  const t = bn.get(e);
  t && (t.flags |= 8, bn.delete(e));
}
Tn().requestIdleCallback;
Tn().cancelIdleCallback;
const Ut = (e) => !!e.type.__asyncLoader, _s = (e) => e.type.__isKeepAlive;
function hr(e, t) {
  ji(e, "a", t);
}
function pr(e, t) {
  ji(e, "da", t);
}
function ji(e, t, n = Te) {
  const s = e.__wdc || (e.__wdc = () => {
    let i = n;
    for (; i; ) {
      if (i.isDeactivated)
        return;
      i = i.parent;
    }
    return e();
  });
  if (Rn(t, s, n), n) {
    let i = n.parent;
    for (; i && i.parent; )
      _s(i.parent.vnode) && gr(s, t, n, i), i = i.parent;
  }
}
function gr(e, t, n, s) {
  const i = Rn(
    t,
    e,
    s,
    !0
    /* prepend */
  );
  Vi(() => {
    os(s[t], i);
  }, n);
}
function Rn(e, t, n = Te, s = !1) {
  if (n) {
    const i = n[e] || (n[e] = []), l = t.__weh || (t.__weh = (...r) => {
      lt();
      const o = en(n), u = Ve(t, n, e, r);
      return o(), rt(), u;
    });
    return s ? i.unshift(l) : i.push(l), l;
  }
}
const ut = (e) => (t, n = Te) => {
  (!Yt || e === "sp") && Rn(e, (...s) => t(...s), n);
}, mr = ut("bm"), xs = ut("m"), vr = ut(
  "bu"
), br = ut("u"), ws = ut(
  "bum"
), Vi = ut("um"), yr = ut(
  "sp"
), _r = ut("rtg"), xr = ut("rtc");
function wr(e, t = Te) {
  Rn("ec", e, t);
}
const Cr = /* @__PURE__ */ Symbol.for("v-ndc");
function yn(e, t, n, s) {
  let i;
  const l = n, r = H(e);
  if (r || ae(e)) {
    const o = r && /* @__PURE__ */ ht(e);
    let u = !1, p = !1;
    o && (u = !/* @__PURE__ */ ke(e), p = /* @__PURE__ */ Ye(e), e = An(e)), i = new Array(e.length);
    for (let d = 0, g = e.length; d < g; d++)
      i[d] = t(
        u ? p ? pt(Le(e[d])) : Le(e[d]) : e[d],
        d,
        void 0,
        l
      );
  } else if (typeof e == "number") {
    i = new Array(e);
    for (let o = 0; o < e; o++)
      i[o] = t(o + 1, o, void 0, l);
  } else if (X(e))
    if (e[Symbol.iterator])
      i = Array.from(
        e,
        (o, u) => t(o, u, void 0, l)
      );
    else {
      const o = Object.keys(e);
      i = new Array(o.length);
      for (let u = 0, p = o.length; u < p; u++) {
        const d = o[u];
        i[u] = t(e[d], d, u, l);
      }
    }
  else
    i = [];
  return i;
}
const Qn = (e) => e ? cl(e) ? Fn(e) : Qn(e.parent) : null, Bt = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ ve(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => Qn(e.parent),
    $root: (e) => Qn(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => Ui(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      bs(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = Pi.bind(e.proxy)),
    $watch: (e) => ar.bind(e)
  })
), Kn = (e, t) => e !== Q && !e.__isScriptSetup && G(e, t), Mr = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: s, data: i, props: l, accessCache: r, type: o, appContext: u } = e;
    if (t[0] !== "$") {
      const _ = r[t];
      if (_ !== void 0)
        switch (_) {
          case 1:
            return s[t];
          case 2:
            return i[t];
          case 4:
            return n[t];
          case 3:
            return l[t];
        }
      else {
        if (Kn(s, t))
          return r[t] = 1, s[t];
        if (i !== Q && G(i, t))
          return r[t] = 2, i[t];
        if (G(l, t))
          return r[t] = 3, l[t];
        if (n !== Q && G(n, t))
          return r[t] = 4, n[t];
        es && (r[t] = 0);
      }
    }
    const p = Bt[t];
    let d, g;
    if (p)
      return t === "$attrs" && _e(e.attrs, "get", ""), p(e);
    if (
      // css module (injected by vue-loader)
      (d = o.__cssModules) && (d = d[t])
    )
      return d;
    if (n !== Q && G(n, t))
      return r[t] = 4, n[t];
    if (
      // global properties
      g = u.config.globalProperties, G(g, t)
    )
      return g[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: i, ctx: l } = e;
    return Kn(i, t) ? (i[t] = n, !0) : s !== Q && G(s, t) ? (s[t] = n, !0) : G(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (l[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: i, props: l, type: r }
  }, o) {
    let u;
    return !!(n[o] || e !== Q && o[0] !== "$" && G(e, o) || Kn(t, o) || G(l, o) || G(s, o) || G(Bt, o) || G(i.config.globalProperties, o) || (u = r.__cssModules) && u[o]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : G(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function Fs(e) {
  return H(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let es = !0;
function Sr(e) {
  const t = Ui(e), n = e.proxy, s = e.ctx;
  es = !1, t.beforeCreate && ks(t.beforeCreate, e, "bc");
  const {
    // state
    data: i,
    computed: l,
    methods: r,
    watch: o,
    provide: u,
    inject: p,
    // lifecycle
    created: d,
    beforeMount: g,
    mounted: _,
    beforeUpdate: P,
    updated: K,
    activated: R,
    deactivated: ee,
    beforeDestroy: Y,
    beforeUnmount: V,
    destroyed: U,
    unmounted: F,
    render: L,
    renderTracked: fe,
    renderTriggered: se,
    errorCaptured: be,
    serverPrefetch: Ke,
    // public API
    expose: W,
    inheritAttrs: oe,
    // assets
    components: Ee,
    directives: Re,
    filters: Ue
  } = t;
  if (p && Tr(p, s, null), r)
    for (const T in r) {
      const $ = r[T];
      j($) && (s[T] = $.bind(n));
    }
  if (i) {
    const T = i.call(n, n);
    X(T) && (e.data = /* @__PURE__ */ gs(T));
  }
  if (es = !0, l)
    for (const T in l) {
      const $ = l[T], ue = j($) ? $.bind(n, n) : j($.get) ? $.get.bind(n, n) : Ge, we = !j($) && j($.set) ? $.set.bind(n) : Ge, $e = Pe({
        get: ue,
        set: we
      });
      Object.defineProperty(s, T, {
        enumerable: !0,
        configurable: !0,
        get: () => $e.value,
        set: (Ae) => $e.value = Ae
      });
    }
  if (o)
    for (const T in o)
      Ki(o[T], s, n, T);
  if (u) {
    const T = j(u) ? u.call(n) : u;
    Reflect.ownKeys(T).forEach(($) => {
      or($, T[$]);
    });
  }
  d && ks(d, e, "c");
  function A(T, $) {
    H($) ? $.forEach((ue) => T(ue.bind(n))) : $ && T($.bind(n));
  }
  if (A(mr, g), A(xs, _), A(vr, P), A(br, K), A(hr, R), A(pr, ee), A(wr, be), A(xr, fe), A(_r, se), A(ws, V), A(Vi, F), A(yr, Ke), H(W))
    if (W.length) {
      const T = e.exposed || (e.exposed = {});
      W.forEach(($) => {
        Object.defineProperty(T, $, {
          get: () => n[$],
          set: (ue) => n[$] = ue,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  L && e.render === Ge && (e.render = L), oe != null && (e.inheritAttrs = oe), Ee && (e.components = Ee), Re && (e.directives = Re), Ke && Ni(e);
}
function Tr(e, t, n = Ge) {
  H(e) && (e = ts(e));
  for (const s in e) {
    const i = e[s];
    let l;
    X(i) ? "default" in i ? l = fn(
      i.from || s,
      i.default,
      !0
    ) : l = fn(i.from || s) : l = fn(i), /* @__PURE__ */ xe(l) ? Object.defineProperty(t, s, {
      enumerable: !0,
      configurable: !0,
      get: () => l.value,
      set: (r) => l.value = r
    }) : t[s] = l;
  }
}
function ks(e, t, n) {
  Ve(
    H(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function Ki(e, t, n, s) {
  let i = s.includes(".") ? Li(n, s) : () => n[s];
  if (ae(e)) {
    const l = t[e];
    j(l) && dn(i, l);
  } else if (j(e))
    dn(i, e.bind(n));
  else if (X(e))
    if (H(e))
      e.forEach((l) => Ki(l, t, n, s));
    else {
      const l = j(e.handler) ? e.handler.bind(n) : t[e.handler];
      j(l) && dn(i, l, e);
    }
}
function Ui(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: i,
    optionsCache: l,
    config: { optionMergeStrategies: r }
  } = e.appContext, o = l.get(t);
  let u;
  return o ? u = o : !i.length && !n && !s ? u = t : (u = {}, i.length && i.forEach(
    (p) => _n(u, p, r, !0)
  ), _n(u, t, r)), X(t) && l.set(t, u), u;
}
function _n(e, t, n, s = !1) {
  const { mixins: i, extends: l } = t;
  l && _n(e, l, n, !0), i && i.forEach(
    (r) => _n(e, r, n, !0)
  );
  for (const r in t)
    if (!(s && r === "expose")) {
      const o = Er[r] || n && n[r];
      e[r] = o ? o(e[r], t[r]) : t[r];
    }
  return e;
}
const Er = {
  data: Ls,
  props: Hs,
  emits: Hs,
  // objects
  methods: Lt,
  computed: Lt,
  // lifecycle
  beforeCreate: Ce,
  created: Ce,
  beforeMount: Ce,
  mounted: Ce,
  beforeUpdate: Ce,
  updated: Ce,
  beforeDestroy: Ce,
  beforeUnmount: Ce,
  destroyed: Ce,
  unmounted: Ce,
  activated: Ce,
  deactivated: Ce,
  errorCaptured: Ce,
  serverPrefetch: Ce,
  // assets
  components: Lt,
  directives: Lt,
  // watch
  watch: Ir,
  // provide / inject
  provide: Ls,
  inject: Ar
};
function Ls(e, t) {
  return t ? e ? function() {
    return ve(
      j(e) ? e.call(this, this) : e,
      j(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function Ar(e, t) {
  return Lt(ts(e), ts(t));
}
function ts(e) {
  if (H(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function Ce(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Lt(e, t) {
  return e ? ve(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Hs(e, t) {
  return e ? H(e) && H(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : ve(
    /* @__PURE__ */ Object.create(null),
    Fs(e),
    Fs(t ?? {})
  ) : t;
}
function Ir(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = ve(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = Ce(e[s], t[s]);
  return n;
}
function Bi() {
  return {
    app: null,
    config: {
      isNativeTag: ii,
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
let Or = 0;
function Pr(e, t) {
  return function(s, i = null) {
    j(s) || (s = ve({}, s)), i != null && !X(i) && (i = null);
    const l = Bi(), r = /* @__PURE__ */ new WeakSet(), o = [];
    let u = !1;
    const p = l.app = {
      _uid: Or++,
      _component: s,
      _props: i,
      _container: null,
      _context: l,
      _instance: null,
      version: uo,
      get config() {
        return l.config;
      },
      set config(d) {
      },
      use(d, ...g) {
        return r.has(d) || (d && j(d.install) ? (r.add(d), d.install(p, ...g)) : j(d) && (r.add(d), d(p, ...g))), p;
      },
      mixin(d) {
        return l.mixins.includes(d) || l.mixins.push(d), p;
      },
      component(d, g) {
        return g ? (l.components[d] = g, p) : l.components[d];
      },
      directive(d, g) {
        return g ? (l.directives[d] = g, p) : l.directives[d];
      },
      mount(d, g, _) {
        if (!u) {
          const P = p._ceVNode || q(s, i);
          return P.appContext = l, _ === !0 ? _ = "svg" : _ === !1 && (_ = void 0), e(P, d, _), u = !0, p._container = d, d.__vue_app__ = p, Fn(P.component);
        }
      },
      onUnmount(d) {
        o.push(d);
      },
      unmount() {
        u && (Ve(
          o,
          p._instance,
          16
        ), e(null, p._container), delete p._container.__vue_app__);
      },
      provide(d, g) {
        return l.provides[d] = g, p;
      },
      runWithContext(d) {
        const g = It;
        It = p;
        try {
          return d();
        } finally {
          It = g;
        }
      }
    };
    return p;
  };
}
let It = null;
const Rr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Ne(t)}Modifiers`] || e[`${Ct(t)}Modifiers`];
function $r(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || Q;
  let i = n;
  const l = t.startsWith("update:"), r = l && Rr(s, t.slice(7));
  r && (r.trim && (i = n.map((d) => ae(d) ? d.trim() : d)), r.number && (i = i.map(cs)));
  let o, u = s[o = kn(t)] || // also try camelCase event handler (#2249)
  s[o = kn(Ne(t))];
  !u && l && (u = s[o = kn(Ct(t))]), u && Ve(
    u,
    e,
    6,
    i
  );
  const p = s[o + "Once"];
  if (p) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[o])
      return;
    e.emitted[o] = !0, Ve(
      p,
      e,
      6,
      i
    );
  }
}
const Dr = /* @__PURE__ */ new WeakMap();
function Wi(e, t, n = !1) {
  const s = n ? Dr : t.emitsCache, i = s.get(e);
  if (i !== void 0)
    return i;
  const l = e.emits;
  let r = {}, o = !1;
  if (!j(e)) {
    const u = (p) => {
      const d = Wi(p, t, !0);
      d && (o = !0, ve(r, d));
    };
    !n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
  }
  return !l && !o ? (X(e) && s.set(e, null), null) : (H(l) ? l.forEach((u) => r[u] = null) : ve(r, l), X(e) && s.set(e, r), r);
}
function $n(e, t) {
  return !e || !Cn(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), G(e, t[0].toLowerCase() + t.slice(1)) || G(e, Ct(t)) || G(e, t));
}
function Ns(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: i,
    propsOptions: [l],
    slots: r,
    attrs: o,
    emit: u,
    render: p,
    renderCache: d,
    props: g,
    data: _,
    setupState: P,
    ctx: K,
    inheritAttrs: R
  } = e, ee = vn(e);
  let Y, V;
  try {
    if (n.shapeFlag & 4) {
      const F = i || s, L = F;
      Y = qe(
        p.call(
          L,
          F,
          d,
          g,
          P,
          _,
          K
        )
      ), V = o;
    } else {
      const F = t;
      Y = qe(
        F.length > 1 ? F(
          g,
          { attrs: o, slots: r, emit: u }
        ) : F(
          g,
          null
        )
      ), V = t.props ? o : Fr(o);
    }
  } catch (F) {
    wt.length = 0, In(F, e, 1), Y = q(ot);
  }
  let U = Y;
  if (V && R !== !1) {
    const F = Object.keys(V), { shapeFlag: L } = U;
    F.length && L & 7 && (l && F.some(Mn) && (V = kr(
      V,
      l
    )), U = Pt(U, V, !1, !0));
  }
  if (n.dirs && (U = Pt(U, null, !1, !0), U.dirs = U.dirs ? U.dirs.concat(n.dirs) : n.dirs), n.transition) {
    const F = On(U.type) && Hi(U) || U;
    ys(F, n.transition);
  }
  return Y = U, vn(ee), Y;
}
const Fr = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || Cn(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, kr = (e, t) => {
  const n = {};
  for (const s in e)
    (!Mn(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function Lr(e, t, n) {
  const { props: s, children: i, component: l } = e, { props: r, children: o, patchFlag: u } = t, p = l.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && u >= 0) {
    if (u & 1024)
      return !0;
    if (u & 16)
      return s ? js(s, r, p) : !!r;
    if (u & 8) {
      const d = t.dynamicProps;
      for (let g = 0; g < d.length; g++) {
        const _ = d[g];
        if (zi(r, s, _) && !$n(p, _))
          return !0;
      }
    }
  } else
    return (i || o) && (!o || !o.$stable) ? !0 : s === r ? !1 : s ? r ? js(s, r, p) : !0 : !!r;
  return !1;
}
function js(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let i = 0; i < s.length; i++) {
    const l = s[i];
    if (zi(t, e, l) && !$n(n, l))
      return !0;
  }
  return !1;
}
function zi(e, t, n) {
  const s = e[n], i = t[n];
  return n === "style" && X(s) && X(i) ? !En(s, i) : s !== i;
}
function Hr({ vnode: e, parent: t, suspense: n }, s) {
  for (; t; ) {
    const i = t.subTree;
    if (i.suspense && i.suspense.activeBranch === e && (i.suspense.vnode.el = i.el = s, e = i), i === e)
      (e = t.vnode).el = s, t = t.parent;
    else
      break;
  }
  n && n.activeBranch === e && (n.vnode.el = s);
}
const qi = {}, Zi = () => Object.create(qi), Gi = (e) => Object.getPrototypeOf(e) === qi;
function Nr(e, t, n, s = !1) {
  const i = {}, l = Zi();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), Ji(e, t, i, l);
  for (const r in e.propsOptions[0])
    r in i || (i[r] = void 0);
  n ? e.props = s ? i : /* @__PURE__ */ ql(i) : e.type.props ? e.props = i : e.props = l, e.attrs = l;
}
function jr(e, t, n, s) {
  const {
    props: i,
    attrs: l,
    vnode: { patchFlag: r }
  } = e, o = /* @__PURE__ */ Z(i), [u] = e.propsOptions;
  let p = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (s || r > 0) && !(r & 16)
  ) {
    if (r & 8) {
      const d = e.vnode.dynamicProps;
      for (let g = 0; g < d.length; g++) {
        let _ = d[g];
        if ($n(e.emitsOptions, _))
          continue;
        const P = t[_];
        if (u)
          if (G(l, _))
            P !== l[_] && (l[_] = P, p = !0);
          else {
            const K = Ne(_);
            i[K] = ns(
              u,
              o,
              K,
              P,
              e,
              !1
            );
          }
        else
          P !== l[_] && (l[_] = P, p = !0);
      }
    }
  } else {
    Ji(e, t, i, l) && (p = !0);
    let d;
    for (const g in o)
      (!t || // for camelCase
      !G(t, g) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((d = Ct(g)) === g || !G(t, d))) && (u ? n && // for camelCase
      (n[g] !== void 0 || // for kebab-case
      n[d] !== void 0) && (i[g] = ns(
        u,
        o,
        g,
        void 0,
        e,
        !0
      )) : delete i[g]);
    if (l !== o)
      for (const g in l)
        (!t || !G(t, g)) && (delete l[g], p = !0);
  }
  p && st(e.attrs, "set", "");
}
function Ji(e, t, n, s) {
  const [i, l] = e.propsOptions;
  let r = !1, o;
  if (t)
    for (let u in t) {
      if (Nt(u))
        continue;
      const p = t[u];
      let d;
      i && G(i, d = Ne(u)) ? !l || !l.includes(d) ? n[d] = p : (o || (o = {}))[d] = p : $n(e.emitsOptions, u) || (!(u in s) || p !== s[u]) && (s[u] = p, r = !0);
    }
  if (l) {
    const u = /* @__PURE__ */ Z(n), p = o || Q;
    for (let d = 0; d < l.length; d++) {
      const g = l[d];
      n[g] = ns(
        i,
        u,
        g,
        p[g],
        e,
        !G(p, g)
      );
    }
  }
  return r;
}
function ns(e, t, n, s, i, l) {
  const r = e[n];
  if (r != null) {
    const o = G(r, "default");
    if (o && s === void 0) {
      const u = r.default;
      if (r.type !== Function && !r.skipFactory && j(u)) {
        const { propsDefaults: p } = i;
        if (n in p)
          s = p[n];
        else {
          const d = en(i);
          s = p[n] = u.call(
            null,
            t
          ), d();
        }
      } else
        s = u;
      i.ce && i.ce._setProp(n, s);
    }
    r[
      0
      /* shouldCast */
    ] && (l && !o ? s = !1 : r[
      1
      /* shouldCastTrue */
    ] && (s === "" || s === Ct(n)) && (s = !0));
  }
  return s;
}
const Vr = /* @__PURE__ */ new WeakMap();
function Yi(e, t, n = !1) {
  const s = n ? Vr : t.propsCache, i = s.get(e);
  if (i)
    return i;
  const l = e.props, r = {}, o = [];
  let u = !1;
  if (!j(e)) {
    const d = (g) => {
      u = !0;
      const [_, P] = Yi(g, t, !0);
      ve(r, _), P && o.push(...P);
    };
    !n && t.mixins.length && t.mixins.forEach(d), e.extends && d(e.extends), e.mixins && e.mixins.forEach(d);
  }
  if (!l && !u)
    return X(e) && s.set(e, _t), _t;
  if (H(l))
    for (let d = 0; d < l.length; d++) {
      const g = Ne(l[d]);
      Vs(g) && (r[g] = Q);
    }
  else if (l)
    for (const d in l) {
      const g = Ne(d);
      if (Vs(g)) {
        const _ = l[d], P = r[g] = H(_) || j(_) ? { type: _ } : ve({}, _), K = P.type;
        let R = !1, ee = !0;
        if (H(K))
          for (let Y = 0; Y < K.length; ++Y) {
            const V = K[Y], U = j(V) && V.name;
            if (U === "Boolean") {
              R = !0;
              break;
            } else U === "String" && (ee = !1);
          }
        else
          R = j(K) && K.name === "Boolean";
        P[
          0
          /* shouldCast */
        ] = R, P[
          1
          /* shouldCastTrue */
        ] = ee, (R || G(P, "default")) && o.push(g);
      }
    }
  const p = [r, o];
  return X(e) && s.set(e, p), p;
}
function Vs(e) {
  return e[0] !== "$" && !Nt(e);
}
const Cs = (e) => e === "_" || e === "_ctx" || e === "$stable", Ms = (e) => H(e) ? e.map(qe) : [qe(e)], Kr = (e, t, n) => {
  if (t._n)
    return t;
  const s = lr((...i) => Ms(t(...i)), n);
  return s._c = !1, s;
}, Xi = (e, t, n) => {
  const s = e._ctx;
  for (const i in e) {
    if (Cs(i)) continue;
    const l = e[i];
    if (j(l))
      t[i] = Kr(i, l, s);
    else if (l != null) {
      const r = Ms(l);
      t[i] = () => r;
    }
  }
}, Qi = (e, t) => {
  const n = Ms(t);
  e.slots.default = () => n;
}, el = (e, t, n) => {
  for (const s in t)
    (n || !Cs(s)) && (e[s] = t[s]);
}, Ur = (e, t, n) => {
  const s = e.slots = Zi();
  if (e.vnode.shapeFlag & 32) {
    const i = t._;
    i ? (el(s, t, n), n && ci(s, "_", i, !0)) : Xi(t, s);
  } else t && Qi(e, t);
}, Br = (e, t, n) => {
  const { vnode: s, slots: i } = e;
  let l = !0, r = Q;
  if (s.shapeFlag & 32) {
    const o = t._;
    o ? n && o === 1 ? l = !1 : el(i, t, n) : (l = !t.$stable, Xi(t, i)), r = t;
  } else t && (Qi(e, t), r = { default: 1 });
  if (l)
    for (const o in i)
      !Cs(o) && r[o] == null && delete i[o];
}, Oe = Gr;
function Wr(e) {
  return zr(e);
}
function zr(e, t) {
  const n = Tn();
  n.__VUE__ = !0;
  const {
    insert: s,
    remove: i,
    patchProp: l,
    createElement: r,
    createText: o,
    createComment: u,
    setText: p,
    setElementText: d,
    parentNode: g,
    nextSibling: _,
    setScopeId: P = Ge,
    insertStaticContent: K
  } = e, R = (c, f, m, x = null, v = null, b = null, E = void 0, S = null, M = !!f.dynamicChildren) => {
    if (c === f)
      return;
    c && !Ft(c, f) && (x = mt(c), Ae(c, v, b, !0), c = null), f.patchFlag === -2 && (M = !1, f.dynamicChildren = null), f.dynamicChildren && c && c.dynamicChildren && c.dynamicChildren.hasOnce && (f.dynamicChildren === _t && (f.dynamicChildren = []), f.dynamicChildren.hasOnce = !0);
    const { type: y, ref: k, shapeFlag: I } = f;
    switch (y) {
      case Dn:
        ee(c, f, m, x);
        break;
      case ot:
        Y(c, f, m, x);
        break;
      case Bn:
        c == null && V(f, m, x, E);
        break;
      case Se:
        Ee(
          c,
          f,
          m,
          x,
          v,
          b,
          E,
          S,
          M
        );
        break;
      default:
        I & 1 ? L(
          c,
          f,
          m,
          x,
          v,
          b,
          E,
          S,
          M
        ) : I & 6 ? Re(
          c,
          f,
          m,
          x,
          v,
          b,
          E,
          S,
          M
        ) : (I & 64 || I & 128) && y.process(
          c,
          f,
          m,
          x,
          v,
          b,
          E,
          S,
          M,
          Xe
        );
    }
    k != null && v ? Kt(k, c && c.ref, b, f || c, !f) : k == null && c && c.ref != null && Kt(c.ref, null, b, c, !0);
  }, ee = (c, f, m, x) => {
    if (c == null)
      s(
        f.el = o(f.children),
        m,
        x
      );
    else {
      const v = f.el = c.el;
      f.children !== c.children && p(v, f.children);
    }
  }, Y = (c, f, m, x) => {
    c == null ? s(
      f.el = u(f.children || ""),
      m,
      x
    ) : f.el = c.el;
  }, V = (c, f, m, x) => {
    [c.el, c.anchor] = K(
      c.children,
      f,
      m,
      x,
      c.el,
      c.anchor
    );
  }, U = ({ el: c, anchor: f }, m, x) => {
    let v;
    for (; c && c !== f; )
      v = _(c), s(c, m, x), c = v;
    s(f, m, x);
  }, F = ({ el: c, anchor: f }) => {
    let m;
    for (; c && c !== f; )
      m = _(c), i(c), c = m;
    i(f);
  }, L = (c, f, m, x, v, b, E, S, M) => {
    if (f.type === "svg" ? E = "svg" : f.type === "math" && (E = "mathml"), c == null)
      fe(
        f,
        m,
        x,
        v,
        b,
        E,
        S,
        M
      );
    else {
      const y = c.el && c.el._isVueCE ? c.el : null;
      try {
        y && y._beginPatch(), Ke(
          c,
          f,
          v,
          b,
          E,
          S,
          M
        );
      } finally {
        y && y._endPatch();
      }
    }
  }, fe = (c, f, m, x, v, b, E, S) => {
    let M, y;
    const { props: k, shapeFlag: I, transition: D, dirs: a } = c;
    if (M = c.el = r(
      c.type,
      b,
      k && k.is,
      k
    ), I & 8 ? d(M, c.children) : I & 16 && be(
      c.children,
      M,
      null,
      x,
      v,
      Un(c, b),
      E,
      S
    ), a && vt(c, null, x, "created"), se(M, c, c.scopeId, E, x), k) {
      for (const w in k)
        w !== "value" && !Nt(w) && l(M, w, null, k[w], b, x);
      "value" in k && l(M, "value", null, k.value, b), (y = k.onVnodeBeforeMount) && Be(y, x, c);
    }
    a && vt(c, null, x, "beforeMount");
    const h = qr(v, D);
    h && D.beforeEnter(M), s(M, f, m), ((y = k && k.onVnodeMounted) || h || a) && Oe(() => {
      y && Be(y, x, c), h && D.enter(M), a && vt(c, null, x, "mounted");
    }, v);
  }, se = (c, f, m, x, v) => {
    if (m && P(c, m), x)
      for (let b = 0; b < x.length; b++)
        P(c, x[b]);
    if (v) {
      let b = v.subTree;
      if (f === b || il(b.type) && (b.ssContent === f || b.ssFallback === f)) {
        const E = v.vnode;
        se(
          c,
          E,
          E.scopeId,
          E.slotScopeIds,
          v.parent
        );
      }
    }
  }, be = (c, f, m, x, v, b, E, S, M = 0) => {
    for (let y = M; y < c.length; y++) {
      const k = c[y] = S ? nt(c[y]) : qe(c[y]);
      R(
        null,
        k,
        f,
        m,
        x,
        v,
        b,
        E,
        S
      );
    }
  }, Ke = (c, f, m, x, v, b, E) => {
    const S = f.el = c.el;
    let { patchFlag: M, dynamicChildren: y, dirs: k } = f;
    M |= c.patchFlag & 16;
    const I = c.props || Q, D = f.props || Q;
    let a;
    if (m && bt(m, !1), (a = D.onVnodeBeforeUpdate) && Be(a, m, f, c), k && vt(f, c, m, "beforeUpdate"), m && bt(m, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    y && (!c.dynamicChildren || c.dynamicChildren.length !== y.length) && (M = 0, E = !1, y = null), (I.innerHTML && D.innerHTML == null || I.textContent && D.textContent == null) && d(S, ""), y ? W(
      c.dynamicChildren,
      y,
      S,
      m,
      x,
      Un(f, v),
      b
    ) : E || $(
      c,
      f,
      S,
      null,
      m,
      x,
      Un(f, v),
      b,
      !1
    ), M > 0) {
      if (M & 16)
        oe(S, I, D, m, v);
      else if (M & 2 && I.class !== D.class && l(S, "class", null, D.class, v), M & 4 && l(S, "style", I.style, D.style, v), M & 8) {
        const h = f.dynamicProps;
        for (let w = 0; w < h.length; w++) {
          const O = h[w], N = I[O], B = D[O];
          (B !== N || O === "value") && l(S, O, N, B, v, m);
        }
      }
      M & 1 && c.children !== f.children && d(S, f.children);
    } else !E && y == null && oe(S, I, D, m, v);
    ((a = D.onVnodeUpdated) || k) && Oe(() => {
      a && Be(a, m, f, c), k && vt(f, c, m, "updated");
    }, x);
  }, W = (c, f, m, x, v, b, E) => {
    for (let S = 0; S < f.length; S++) {
      const M = c[S], y = f[S], k = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        M.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (M.type === Se || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Ft(M, y) || // - In the case of a component, it could contain anything.
        M.shapeFlag & 198) ? g(M.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          m
        )
      );
      R(
        M,
        y,
        k,
        null,
        x,
        v,
        b,
        E,
        !0
      );
    }
  }, oe = (c, f, m, x, v) => {
    if (f !== m) {
      if (f !== Q)
        for (const b in f)
          !Nt(b) && !(b in m) && l(
            c,
            b,
            f[b],
            null,
            v,
            x
          );
      for (const b in m) {
        if (Nt(b)) continue;
        const E = m[b], S = f[b];
        E !== S && b !== "value" && l(c, b, S, E, v, x);
      }
      "value" in m && l(c, "value", f.value, m.value, v);
    }
  }, Ee = (c, f, m, x, v, b, E, S, M) => {
    const y = f.el = c ? c.el : o(""), k = f.anchor = c ? c.anchor : o("");
    let { patchFlag: I, dynamicChildren: D, slotScopeIds: a } = f;
    a && (S = S ? S.concat(a) : a), c == null ? (s(y, m, x), s(k, m, x), be(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      f.children || [],
      m,
      k,
      v,
      b,
      E,
      S,
      M
    )) : I > 0 && I & 64 && D && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    c.dynamicChildren && c.dynamicChildren.length === D.length ? (W(
      c.dynamicChildren,
      D,
      m,
      v,
      b,
      E,
      S
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (f.key != null || v && f === v.subTree) && tl(
      c,
      f,
      !0
      /* shallow */
    )) : $(
      c,
      f,
      m,
      k,
      v,
      b,
      E,
      S,
      M
    );
  }, Re = (c, f, m, x, v, b, E, S, M) => {
    f.slotScopeIds = S, c == null ? f.shapeFlag & 512 ? v.ctx.activate(
      f,
      m,
      x,
      E,
      M
    ) : Ue(
      f,
      m,
      x,
      v,
      b,
      E,
      M
    ) : gt(c, f, M);
  }, Ue = (c, f, m, x, v, b, E) => {
    const S = c.component = to(
      c,
      x,
      v
    );
    if (_s(c) && (S.ctx.renderer = Xe), so(S, !1, E), S.asyncDep) {
      if (v && v.registerDep(S, A, E), !c.el) {
        const M = S.subTree = q(ot);
        Y(null, M, f, m), c.placeholder = M.el;
      }
    } else
      A(
        S,
        c,
        f,
        m,
        v,
        b,
        E
      );
  }, gt = (c, f, m) => {
    const x = f.component = c.component;
    if (Lr(c, f, m))
      if (x.asyncDep && !x.asyncResolved) {
        f.el = c.el, T(x, f, m);
        return;
      } else
        x.next = f, x.update();
    else
      f.el = c.el, x.vnode = f;
  }, A = (c, f, m, x, v, b, E) => {
    const S = () => {
      if (c.isMounted) {
        let { next: I, bu: D, u: a, parent: h, vnode: w } = c;
        {
          const J = nl(c);
          if (J) {
            I && (I.el = w.el, T(c, I, E)), J.asyncDep.then(() => {
              Oe(() => {
                c.isUnmounted || y();
              }, v);
            });
            return;
          }
        }
        let O = I, N;
        bt(c, !1), I ? (I.el = w.el, T(c, I, E)) : I = w, D && an(D), (N = I.props && I.props.onVnodeBeforeUpdate) && Be(N, h, I, w), bt(c, !0);
        const B = Ns(c), z = c.subTree;
        c.subTree = B, R(
          z,
          B,
          // parent may have changed if it's in a teleport
          g(z.el),
          // anchor may have changed if it's in a fragment
          mt(z),
          c,
          v,
          b
        ), I.el = B.el, O === null && Hr(c, B.el), a && Oe(a, v), (N = I.props && I.props.onVnodeUpdated) && Oe(
          () => Be(N, h, I, w),
          v
        );
      } else {
        let I;
        const { el: D, props: a } = f, { bm: h, m: w, parent: O, root: N, type: B } = c, z = Ut(f);
        bt(c, !1), h && an(h), !z && (I = a && a.onVnodeBeforeMount) && Be(I, O, f), bt(c, !0);
        {
          N.ce && N.ce._hasShadowRoot() && N.ce._injectChildStyle(
            B,
            c.parent ? c.parent.type : void 0
          );
          const J = c.subTree = Ns(c);
          R(
            null,
            J,
            m,
            x,
            c,
            v,
            b
          ), f.el = J.el;
        }
        if (w && Oe(w, v), !z && (I = a && a.onVnodeMounted)) {
          const J = f;
          Oe(
            () => Be(I, O, J),
            v
          );
        }
        (f.shapeFlag & 256 || O && Ut(O.vnode) && O.vnode.shapeFlag & 256) && c.a && Oe(c.a, v), c.isMounted = !0, f = m = x = null;
      }
    };
    c.scope.on();
    const M = c.effect = new hi(S);
    c.scope.off();
    const y = c.update = M.run.bind(M), k = c.job = M.runIfDirty.bind(M);
    k.i = c, k.id = c.uid, M.scheduler = () => bs(k), bt(c, !0), y();
  }, T = (c, f, m) => {
    f.component = c;
    const x = c.vnode.props;
    c.vnode = f, c.next = null, jr(c, f.props, x, m), Br(c, f.children, m), lt(), Rs(c), rt();
  }, $ = (c, f, m, x, v, b, E, S, M = !1) => {
    const y = c && c.children, k = c ? c.shapeFlag : 0, I = f.children, { patchFlag: D, shapeFlag: a } = f;
    if (D > 0) {
      if (D & 128) {
        we(
          y,
          I,
          m,
          x,
          v,
          b,
          E,
          S,
          M
        );
        return;
      } else if (D & 256) {
        ue(
          y,
          I,
          m,
          x,
          v,
          b,
          E,
          S,
          M
        );
        return;
      }
    }
    a & 8 ? (k & 16 && ct(y, v, b), I !== y && d(m, I)) : k & 16 ? a & 16 ? we(
      y,
      I,
      m,
      x,
      v,
      b,
      E,
      S,
      M
    ) : ct(y, v, b, !0) : (k & 8 && d(m, ""), a & 16 && be(
      I,
      m,
      x,
      v,
      b,
      E,
      S,
      M
    ));
  }, ue = (c, f, m, x, v, b, E, S, M) => {
    c = c || _t, f = f || _t;
    const y = c.length, k = f.length, I = Math.min(y, k);
    let D;
    for (D = 0; D < I; D++) {
      const a = f[D] = M ? nt(f[D]) : qe(f[D]);
      R(
        c[D],
        a,
        m,
        null,
        v,
        b,
        E,
        S,
        M
      );
    }
    y > k ? ct(
      c,
      v,
      b,
      !0,
      !1,
      I
    ) : be(
      f,
      m,
      x,
      v,
      b,
      E,
      S,
      M,
      I
    );
  }, we = (c, f, m, x, v, b, E, S, M) => {
    let y = 0;
    const k = f.length;
    let I = c.length - 1, D = k - 1;
    for (; y <= I && y <= D; ) {
      const a = c[y], h = f[y] = M ? nt(f[y]) : qe(f[y]);
      if (Ft(a, h))
        R(
          a,
          h,
          m,
          null,
          v,
          b,
          E,
          S,
          M
        );
      else
        break;
      y++;
    }
    for (; y <= I && y <= D; ) {
      const a = c[I], h = f[D] = M ? nt(f[D]) : qe(f[D]);
      if (Ft(a, h))
        R(
          a,
          h,
          m,
          null,
          v,
          b,
          E,
          S,
          M
        );
      else
        break;
      I--, D--;
    }
    if (y > I) {
      if (y <= D) {
        const a = D + 1, h = a < k ? f[a].el : x;
        for (; y <= D; )
          R(
            null,
            f[y] = M ? nt(f[y]) : qe(f[y]),
            m,
            h,
            v,
            b,
            E,
            S,
            M
          ), y++;
      }
    } else if (y > D)
      for (; y <= I; )
        Ae(c[y], v, b, !0), y++;
    else {
      const a = y, h = y, w = /* @__PURE__ */ new Map();
      for (y = h; y <= D; y++) {
        const re = f[y] = M ? nt(f[y]) : qe(f[y]);
        re.key != null && w.set(re.key, y);
      }
      let O, N = 0;
      const B = D - h + 1;
      let z = !1, J = 0;
      const le = new Array(B);
      for (y = 0; y < B; y++) le[y] = 0;
      for (y = a; y <= I; y++) {
        const re = c[y];
        if (N >= B) {
          Ae(re, v, b, !0);
          continue;
        }
        let te;
        if (re.key != null)
          te = w.get(re.key);
        else
          for (O = h; O <= D; O++)
            if (le[O - h] === 0 && Ft(re, f[O])) {
              te = O;
              break;
            }
        te === void 0 ? Ae(re, v, b, !0) : (le[te - h] = y + 1, te >= J ? J = te : z = !0, R(
          re,
          f[te],
          m,
          null,
          v,
          b,
          E,
          S,
          M
        ), N++);
      }
      const ye = z ? Zr(le) : _t;
      for (O = ye.length - 1, y = B - 1; y >= 0; y--) {
        const re = h + y, te = f[re], Qe = f[re + 1], at = re + 1 < k ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          Qe.el || sl(Qe)
        ) : x;
        le[y] === 0 ? R(
          null,
          te,
          m,
          at,
          v,
          b,
          E,
          S,
          M
        ) : z && (O < 0 || y !== ye[O] ? $e(te, m, at, 2) : O--);
      }
    }
  }, $e = (c, f, m, x, v = null) => {
    const { el: b, type: E, transition: S, children: M, shapeFlag: y } = c;
    if (y & 6) {
      $e(c.component.subTree, f, m, x);
      return;
    }
    if (y & 128) {
      c.suspense.move(f, m, x);
      return;
    }
    if (y & 64) {
      E.move(c, f, m, Xe);
      return;
    }
    if (E === Se) {
      s(b, f, m);
      for (let I = 0; I < M.length; I++)
        $e(M[I], f, m, x);
      s(c.anchor, f, m);
      return;
    }
    if (E === Bn) {
      U(c, f, m);
      return;
    }
    if (x !== 2 && y & 1 && S)
      if (x === 0)
        S.persisted && !b[Vn] ? s(b, f, m) : (S.beforeEnter(b), s(b, f, m), Oe(() => S.enter(b), v));
      else {
        const { leave: I, delayLeave: D, afterLeave: a } = S, h = () => {
          c.ctx.isUnmounted ? i(b) : s(b, f, m);
        }, w = () => {
          const O = b._isLeaving || !!b[Vn];
          b._isLeaving && b[Vn](
            !0
            /* cancelled */
          ), S.persisted && !O ? h() : I(b, () => {
            h(), a && a();
          });
        };
        D ? D(b, h, w) : w();
      }
    else
      s(b, f, m);
  }, Ae = (c, f, m, x = !1, v = !1) => {
    const {
      type: b,
      props: E,
      ref: S,
      children: M,
      dynamicChildren: y,
      shapeFlag: k,
      patchFlag: I,
      dirs: D,
      cacheIndex: a,
      memo: h
    } = c;
    if ((I === -2 || y && y.hasOnce) && (v = !1), S != null && (lt(), Kt(S, null, m, c, !0), rt()), a != null && (!c.ctx || c.ctx === f) && (f.renderCache[a] = void 0), k & 256) {
      f.ctx.deactivate(c);
      return;
    }
    const w = k & 1 && D, O = !Ut(c);
    let N;
    if (O && (N = E && E.onVnodeBeforeUnmount) && Be(N, f, c), k & 6)
      Ie(c.component, m, x);
    else {
      if (k & 128) {
        c.suspense.unmount(m, x);
        return;
      }
      w && vt(c, null, f, "beforeUnmount"), k & 64 ? c.type.remove(
        c,
        f,
        m,
        Xe,
        x
      ) : y && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !y.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (b !== Se || I > 0 && I & 64) ? ct(
        y,
        f,
        m,
        !1,
        !0
      ) : (b === Se && I & 384 || !v && k & 16) && ct(M, f, m), x && Rt(c);
    }
    const B = h != null && a == null;
    (O && (N = E && E.onVnodeUnmounted) || w || B) && Oe(() => {
      N && Be(N, f, c), w && vt(c, null, f, "unmounted"), B && (c.el = null);
    }, m);
  }, Rt = (c) => {
    const { type: f, el: m, anchor: x, transition: v } = c;
    if (f === Se) {
      tn(m, x);
      return;
    }
    if (f === Bn) {
      F(c), v && !v.persisted && v.afterLeave && v.afterLeave();
      return;
    }
    const b = () => {
      i(m), v && !v.persisted && v.afterLeave && v.afterLeave();
    };
    if (c.shapeFlag & 1 && v && !v.persisted) {
      const { leave: E, delayLeave: S } = v, M = () => E(m, b);
      S ? S(c.el, b, M) : M();
    } else
      b();
  }, tn = (c, f) => {
    let m;
    for (; c !== f; )
      m = _(c), i(c), c = m;
    i(f);
  }, Ie = (c, f, m) => {
    const { bum: x, scope: v, job: b, subTree: E, um: S, m: M, a: y } = c;
    Ks(M), Ks(y), x && an(x), v.stop(), b ? (b.flags |= 8, Ae(E, c, f, m)) : c.vnode.el && E && (E.transition = c.vnode.transition, Ae(E, c, f, m)), S && Oe(S, f), Oe(() => {
      c.isUnmounted = !0;
    }, f);
  }, ct = (c, f, m, x = !1, v = !1, b = 0) => {
    for (let E = b; E < c.length; E++)
      Ae(c[E], f, m, x, v);
  }, mt = (c) => {
    if (c.shapeFlag & 6)
      return mt(c.component.subTree);
    if (c.shapeFlag & 128)
      return c.suspense.next();
    const f = _(c.anchor || c.el), m = f && f[fr];
    return m ? _(m) : f;
  };
  let $t = !1;
  const nn = (c, f, m) => {
    let x;
    c == null ? f._vnode && (Ae(f._vnode, null, null, !0), x = f._vnode.component) : R(
      f._vnode || null,
      c,
      f,
      null,
      null,
      null,
      m
    ), f._vnode = c, $t || ($t = !0, Rs(x), $i(), $t = !1);
  }, Xe = {
    p: R,
    um: Ae,
    m: $e,
    r: Rt,
    mt: Ue,
    mc: be,
    pc: $,
    pbc: W,
    n: mt,
    o: e
  };
  return {
    render: nn,
    hydrate: void 0,
    createApp: Pr(nn)
  };
}
function Un({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function bt({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function qr(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function tl(e, t, n = !1) {
  const s = e.children, i = t.children;
  if (H(s) && H(i))
    for (let l = 0; l < s.length; l++) {
      const r = s[l];
      let o = i[l];
      o.shapeFlag & 1 && !o.dynamicChildren && ((o.patchFlag <= 0 || o.patchFlag === 32) && (o = i[l] = nt(i[l]), o.el = r.el), !n && o.patchFlag !== -2 && tl(r, o)), o.type === Dn && (o.patchFlag === -1 && (o = i[l] = nt(o)), o.el = r.el), o.type === ot && !o.el && (o.el = r.el);
    }
}
function Zr(e) {
  const t = e.slice(), n = [0];
  let s, i, l, r, o;
  const u = e.length;
  for (s = 0; s < u; s++) {
    const p = e[s];
    if (p !== 0) {
      if (i = n[n.length - 1], e[i] < p) {
        t[s] = i, n.push(s);
        continue;
      }
      for (l = 0, r = n.length - 1; l < r; )
        o = l + r >> 1, e[n[o]] < p ? l = o + 1 : r = o;
      p < e[n[l]] && (l > 0 && (t[s] = n[l - 1]), n[l] = s);
    }
  }
  for (l = n.length, r = n[l - 1]; l-- > 0; )
    n[l] = r, r = t[r];
  return n;
}
function nl(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : nl(t);
}
function Ks(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function sl(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  return t ? sl(t.subTree) : null;
}
const il = (e) => e.__isSuspense;
function Gr(e, t) {
  t && t.pendingBranch ? H(e) ? t.effects.push(...e) : t.effects.push(e) : ir(e);
}
const Se = /* @__PURE__ */ Symbol.for("v-fgt"), Dn = /* @__PURE__ */ Symbol.for("v-txt"), ot = /* @__PURE__ */ Symbol.for("v-cmt"), Bn = /* @__PURE__ */ Symbol.for("v-stc"), wt = [];
let De = null;
function ce(e = !1) {
  wt.push(De = e ? null : []);
}
function ll() {
  wt.pop(), De = wt[wt.length - 1] || null;
}
let Gt = 1;
function Us(e, t = !1) {
  Gt += e, e < 0 && De && t && (De.hasOnce = !0);
}
function rl(e) {
  return e.dynamicChildren = Gt > 0 ? De || _t : null, ll(), Gt > 0 && De && De.push(e), e;
}
function pe(e, t, n, s, i, l) {
  return rl(
    C(
      e,
      t,
      n,
      s,
      i,
      l,
      !0
    )
  );
}
function ss(e, t, n, s, i) {
  return rl(
    q(
      e,
      t,
      n,
      s,
      i,
      !0
    )
  );
}
function ol(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Ft(e, t) {
  return e.type === t.type && e.key === t.key;
}
const ul = ({ key: e }) => e ?? null, hn = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? ae(e) || /* @__PURE__ */ xe(e) || j(e) ? { i: Fe, r: e, k: t, f: !!n } : e : null);
function C(e, t = null, n = null, s = 0, i = null, l = e === Se ? 0 : 1, r = !1, o = !1) {
  const u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && ul(t),
    ref: t && hn(t),
    scopeId: Fi,
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
    shapeFlag: l,
    patchFlag: s,
    dynamicProps: i,
    dynamicChildren: null,
    appContext: null,
    ctx: Fe
  };
  return o ? (xn(u, n), l & 128 && e.normalize(u)) : n && (u.shapeFlag |= ae(n) ? 8 : 16), Gt > 0 && // avoid a block node from tracking itself
  !r && // has current parent block
  De && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (u.patchFlag > 0 || l & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  u.patchFlag !== 32 && De.push(u), u;
}
const q = Jr;
function Jr(e, t = null, n = null, s = 0, i = null, l = !1) {
  if ((!e || e === Cr) && (e = ot), ol(e)) {
    const o = Pt(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && xn(o, n), Gt > 0 && !l && De && (o.shapeFlag & 6 ? De[De.indexOf(e)] = o : De.push(o)), o.patchFlag = -2, o;
  }
  if (oo(e) && (e = e.__vccOpts), t) {
    t = Yr(t);
    let { class: o, style: u } = t;
    o && !ae(o) && (t.class = He(o)), X(u) && (/* @__PURE__ */ vs(u) && !H(u) && (u = ve({}, u)), t.style = Ot(u));
  }
  const r = ae(e) ? 1 : il(e) ? 128 : On(e) ? 64 : X(e) ? 4 : j(e) ? 2 : 0;
  return C(
    e,
    t,
    n,
    s,
    i,
    r,
    l,
    !0
  );
}
function Yr(e) {
  return e ? /* @__PURE__ */ vs(e) || Gi(e) ? ve({}, e) : e : null;
}
function Pt(e, t, n = !1, s = !1) {
  const { props: i, ref: l, patchFlag: r, children: o, transition: u } = e, p = t ? Xr(i || {}, t) : i, d = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: p,
    key: p && ul(p),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && l ? H(l) ? l.concat(hn(t)) : [l, hn(t)] : hn(t)
    ) : l,
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
    patchFlag: t && e.type !== Se ? r === -1 ? 16 : r | 16 : r,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: u,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && Pt(e.ssContent),
    ssFallback: e.ssFallback && Pt(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce,
    cacheIndex: e.cacheIndex
  };
  return u && s && ys(
    d,
    u.clone(d)
  ), d;
}
function me(e = " ", t = 0) {
  return q(Dn, null, e, t);
}
function Wt(e = "", t = !1) {
  return t ? (ce(), ss(ot, null, e)) : q(ot, null, e);
}
function qe(e) {
  return e == null || typeof e == "boolean" ? q(ot) : H(e) ? q(
    Se,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : ol(e) ? nt(e) : q(Dn, null, String(e));
}
function nt(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : Pt(e);
}
function xn(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (H(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const i = t.default;
      i && (i._c && (i._d = !1), xn(e, i()), i._c && (i._d = !0));
      return;
    } else {
      n = 32;
      const i = t._;
      !i && !Gi(t) ? t._ctx = Fe : i === 3 && Fe && (Fe.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (j(t)) {
    if (s & 65) {
      xn(e, { default: t });
      return;
    }
    t = { default: t, _ctx: Fe }, n = 32;
  } else
    t = String(t), s & 64 ? (n = 16, t = [me(t)]) : n = 8;
  e.children = t, e.shapeFlag |= n;
}
function Xr(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const i in s)
      if (i === "class")
        t.class !== s.class && (t.class = He([t.class, s.class]));
      else if (i === "style")
        t.style = Ot([t.style, s.style]);
      else if (Cn(i)) {
        const l = t[i], r = s[i];
        r && l !== r && !(H(l) && l.includes(r)) ? t[i] = l ? [].concat(l, r) : r : r == null && l == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !Mn(i) && (t[i] = r);
      } else i !== "" && (t[i] = s[i]);
  }
  return t;
}
function Be(e, t, n, s = null) {
  Ve(e, t, 7, [
    n,
    s
  ]);
}
const Qr = Bi();
let eo = 0;
function to(e, t, n) {
  const s = e.type, i = (t ? t.appContext : e.appContext) || Qr, l = {
    uid: eo++,
    vnode: e,
    type: s,
    parent: t,
    appContext: i,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new Al(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(i.provides),
    ids: t ? t.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: Yi(s, i),
    emitsOptions: Wi(s, i),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: Q,
    // inheritAttrs
    inheritAttrs: s.inheritAttrs,
    // state
    ctx: Q,
    data: Q,
    props: Q,
    attrs: Q,
    slots: Q,
    refs: Q,
    setupState: Q,
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
  return l.ctx = { _: l }, l.root = t ? t.root : l, l.emit = $r.bind(null, l), e.ce && e.ce(l), l;
}
let Te = null;
const no = () => Te || Fe;
let wn, Jt;
{
  const e = Tn(), t = (n, s) => {
    let i;
    return (i = e[n]) || (i = e[n] = []), i.push(s), (l) => {
      i.length > 1 ? i.forEach((r) => r(l)) : i[0](l);
    };
  };
  wn = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => Te = n
  ), Jt = t(
    "__VUE_SSR_SETTERS__",
    (n) => Yt = n
  );
}
const en = (e) => {
  const t = Te;
  return wn(e), e.scope.on(), () => {
    e.scope.off(), wn(t);
  };
}, Bs = () => {
  Te && Te.scope.off(), wn(null);
};
function cl(e) {
  return e.vnode.shapeFlag & 4;
}
let Yt = !1;
function so(e, t = !1, n = !1) {
  t && Jt(t);
  const { props: s, children: i } = e.vnode, l = cl(e);
  Nr(e, s, l, t), Ur(e, i, n || t);
  const r = l ? io(e, t) : void 0;
  return t && Jt(!1), r;
}
function io(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Mr);
  const { setup: s } = n;
  if (s) {
    lt();
    const i = e.setupContext = s.length > 1 ? ro(e) : null, l = en(e), r = Qt(
      s,
      e,
      0,
      [
        e.props,
        i
      ]
    ), o = li(r);
    if (rt(), l(), (o || e.sp) && !Ut(e) && Ni(e), o) {
      if (r.then(Bs, Bs), t)
        return r.then((u) => {
          Jt(!0);
          try {
            Ws(e, u, t);
          } finally {
            Jt(!1);
          }
        }).catch((u) => {
          In(u, e, 0);
        });
      e.asyncDep = r;
    } else
      Ws(e, r);
  } else
    al(e);
}
function Ws(e, t, n) {
  j(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : X(t) && (e.setupState = Ii(t)), al(e);
}
function al(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || Ge);
  {
    const i = en(e);
    lt();
    try {
      Sr(e);
    } finally {
      rt(), i();
    }
  }
}
const lo = {
  get(e, t) {
    return _e(e, "get", ""), e[t];
  }
};
function ro(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, lo),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function Fn(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(Ii(Zl(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in Bt)
        return Bt[n](e);
    },
    has(t, n) {
      return n in t || n in Bt;
    }
  })) : e.proxy;
}
function oo(e) {
  return j(e) && "__vccOpts" in e;
}
const Pe = (e, t) => /* @__PURE__ */ Ql(e, t, Yt), uo = "3.5.43";
let is;
const zs = typeof window < "u" && window.trustedTypes;
if (zs)
  try {
    is = /* @__PURE__ */ zs.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const fl = is ? (e) => is.createHTML(e) : (e) => e, co = "http://www.w3.org/2000/svg", ao = "http://www.w3.org/1998/Math/MathML", tt = typeof document < "u" ? document : null, qs = tt && /* @__PURE__ */ tt.createElement("template"), fo = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const i = t === "svg" ? tt.createElementNS(co, e) : t === "mathml" ? tt.createElementNS(ao, e) : n ? tt.createElement(e, { is: n }) : tt.createElement(e);
    return e === "select" && s && s.multiple != null && i.setAttribute("multiple", s.multiple), i;
  },
  createText: (e) => tt.createTextNode(e),
  createComment: (e) => tt.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => tt.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, s, i, l) {
    const r = n ? n.previousSibling : t.lastChild;
    if (i && (i === l || i.nextSibling))
      for (; t.insertBefore(i.cloneNode(!0), n), !(i === l || !(i = i.nextSibling)); )
        ;
    else {
      qs.innerHTML = fl(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const o = qs.content;
      if (s === "svg" || s === "mathml") {
        const u = o.firstChild;
        for (; u.firstChild; )
          o.appendChild(u.firstChild);
        o.removeChild(u);
      }
      t.insertBefore(o, n);
    }
    return [
      // first
      r ? r.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, ho = /* @__PURE__ */ Symbol("_vtc");
function po(e, t, n) {
  const s = e[ho];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const Zs = /* @__PURE__ */ Symbol("_vod"), go = /* @__PURE__ */ Symbol("_vsh"), mo = /* @__PURE__ */ Symbol(""), vo = /(?:^|;)\s*display\s*:/;
function bo(e, t, n) {
  const s = e.style, i = ae(n);
  let l = !1;
  if (n && !i) {
    if (t)
      if (ae(t))
        for (const r of t.split(";")) {
          const o = r.slice(0, r.indexOf(":")).trim();
          n[o] == null && Ht(s, o, "");
        }
      else
        for (const r in t)
          n[r] == null && Ht(s, r, "");
    for (const r in n) {
      r === "display" && (l = !0);
      const o = n[r];
      o != null ? _o(
        e,
        r,
        !ae(t) && t ? t[r] : void 0,
        o
      ) || Ht(s, r, o) : Ht(s, r, "");
    }
  } else if (i) {
    if (t !== n) {
      const r = s[mo];
      r && (n += ";" + r), s.cssText = n, l = vo.test(n);
    }
  } else t && e.removeAttribute("style");
  Zs in e && (e[Zs] = l ? s.display : "", e[go] && (s.display = "none"));
}
const on = /\s*!important$/;
function Ht(e, t, n) {
  if (H(n))
    n.forEach((s) => Ht(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    on.test(n) ? e.setProperty(t, n.replace(on, ""), "important") : e.setProperty(t, n);
  else {
    const s = yo(e, t);
    on.test(n) ? e.setProperty(
      Ct(s),
      n.replace(on, ""),
      "important"
    ) : e[s] = n;
  }
}
const Gs = ["Webkit", "Moz", "ms"], Wn = {};
function yo(e, t) {
  const n = Wn[t];
  if (n)
    return n;
  let s = Ne(t);
  if (s !== "filter" && s in e)
    return Wn[t] = s;
  s = ui(s);
  for (let i = 0; i < Gs.length; i++) {
    const l = Gs[i] + s;
    if (l in e)
      return Wn[t] = l;
  }
  return t;
}
function _o(e, t, n, s) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && ae(s) && n === s;
}
const Js = "http://www.w3.org/1999/xlink";
function Ys(e, t, n, s, i, l = Sl(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Js, t.slice(6, t.length)) : e.setAttributeNS(Js, t, n) : n == null || l && !ai(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    l ? "" : Je(n) ? String(n) : n
  );
}
function Xs(e, t, n, s, i) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? fl(n) : n);
    return;
  }
  const l = e.tagName;
  if (t === "value" && l !== "PROGRESS" && // custom elements may use _value internally
  !l.includes("-")) {
    const o = l === "OPTION" ? e.getAttribute("value") || "" : e.value, u = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (o !== u || !("_value" in e)) && (e.value = u), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let r = !1;
  if (n === "" || n == null) {
    const o = typeof e[t];
    o === "boolean" ? n = ai(n) : n == null && o === "string" ? (n = "", r = !0) : o === "number" && (n = 0, r = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  r && e.removeAttribute(i || t);
}
function Et(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function xo(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const Qs = /* @__PURE__ */ Symbol("_vei");
function wo(e, t, n, s, i = null) {
  const l = e[Qs] || (e[Qs] = {}), r = l[t];
  if (s && r)
    r.value = s;
  else {
    const [o, u] = So(t);
    if (s) {
      const p = l[t] = Ao(
        s,
        i
      );
      Et(e, o, p, u);
    } else r && (xo(e, o, r, u), l[t] = void 0);
  }
}
const Co = /(Once|Passive|Capture)$/, Mo = /^on:?(?:Once|Passive|Capture)$/;
function So(e) {
  let t, n;
  for (; (n = e.match(Co)) && !Mo.test(e); )
    t || (t = {}), e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : Ct(e.slice(2)), t];
}
let zn = 0;
const To = /* @__PURE__ */ Promise.resolve(), Eo = () => zn || (To.then(() => zn = 0), zn = Date.now());
function Ao(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    const i = n.value;
    if (H(i)) {
      const l = s.stopImmediatePropagation;
      s.stopImmediatePropagation = () => {
        l.call(s), s._stopped = !0;
      };
      const r = i.slice(), o = [s];
      for (let u = 0; u < r.length && !s._stopped; u++) {
        const p = r[u];
        p && Ve(
          p,
          t,
          5,
          o
        );
      }
    } else
      Ve(
        i,
        t,
        5,
        [s]
      );
  };
  return n.value = e, n.attached = Eo(), n;
}
const ei = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Io = (e, t, n, s, i, l) => {
  const r = i === "svg";
  t === "class" ? po(e, s, r) : t === "style" ? bo(e, n, s) : Cn(t) ? Mn(t) || wo(e, t, n, s, l) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Oo(e, t, s, r)) ? (Xs(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Ys(e, t, s, r, l, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (Po(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !ae(s))) ? Xs(e, Ne(t), s, l, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), Ys(e, t, s, r));
};
function Oo(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && ei(t) && j(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const i = e.tagName;
    if (i === "IMG" || i === "VIDEO" || i === "CANVAS" || i === "SOURCE")
      return !1;
  }
  return ei(t) && ae(n) ? !1 : t in e;
}
function Po(e, t) {
  const n = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!n)
    return !1;
  const s = Ne(t);
  return Array.isArray(n) ? n.some((i) => Ne(i) === s) : Object.keys(n).some((i) => Ne(i) === s);
}
const ti = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return H(t) ? (n) => an(t, n) : t;
};
function Ro(e) {
  e.target.composing = !0;
}
function ni(e) {
  const t = e.target;
  t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
const un = /* @__PURE__ */ Symbol("_assign"), cn = /* @__PURE__ */ Symbol("_initialValue");
function qn(e, t, n) {
  return t && (e = e.trim()), n && (e = cs(e)), e;
}
const $o = {
  created(e, { modifiers: { lazy: t, trim: n, number: s } }, i) {
    e.parentNode && (e.type === "text" ? e[cn] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[cn] = e.defaultValue.replace(/\r\n?/g, `
`))), e[un] = ti(i);
    const l = s || i.props && i.props.type === "number";
    Et(e, t ? "change" : "input", (r) => {
      r.target.composing || e[un](qn(e.value, n, l));
    }), (n || l) && Et(e, "change", () => {
      e.value = qn(e.value, n, l);
    }), t || (Et(e, "compositionstart", Ro), Et(e, "compositionend", ni), Et(e, "change", ni));
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(e, { value: t, modifiers: { trim: n, number: s } }) {
    const i = t ?? "", l = e[cn];
    delete e[cn], l !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== l ? e[un](qn(e.value, n, s)) : e.value = i;
  },
  beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: s, trim: i, number: l } }, r) {
    if (e[un] = ti(r), e.composing) return;
    const o = (l || e.type === "number") && !/^0\d/.test(e.value) ? cs(e.value) : e.value, u = t ?? "";
    if (o === u)
      return;
    const p = e.getRootNode();
    (p instanceof Document || p instanceof ShadowRoot) && p.activeElement === e && e.type !== "range" && (s && t === n || i && e.value.trim() === u) || (e.value = u);
  }
}, Do = ["ctrl", "shift", "alt", "meta"], Fo = {
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
  exact: (e, t) => Do.some((n) => e[`${n}Key`] && !t.includes(n))
}, kt = (e, t) => {
  if (!e) return e;
  const n = e._withMods || (e._withMods = {}), s = t.join(".");
  return n[s] || (n[s] = ((i, ...l) => {
    for (let r = 0; r < t.length; r++) {
      const o = Fo[t[r]];
      if (o && o(i, t)) return;
    }
    return e(i, ...l);
  }));
}, ko = /* @__PURE__ */ ve({ patchProp: Io }, fo);
let si;
function Lo() {
  return si || (si = Wr(ko));
}
const Ho = ((...e) => {
  const t = Lo().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const i = jo(s);
    if (!i) return;
    const l = t._component;
    !j(l) && !l.render && !l.template && (l.template = i.innerHTML), i.nodeType === 1 && (i.textContent = "");
    const r = n(i, !1, No(i));
    return i instanceof Element && (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")), r;
  }, t;
});
function No(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function jo(e) {
  return ae(e) ? document.querySelector(e) : e;
}
const Ss = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, i] of t)
    n[s] = i;
  return n;
}, Vo = {}, Ko = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.7",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
};
function Uo(e, t) {
  return ce(), pe("svg", Ko, [...t[0] || (t[0] = [
    C("path", { d: "m8 15 1-4 7-7 3 3-7 7-4 1zm6-9 3 3" }, null, -1),
    C("path", { d: "M5 13c-2 1-2 4 1 5 3 1 7-2 9 0 2 2-1 4-4 3M4 8h2M5 7v2" }, null, -1)
  ])]);
}
const ls = /* @__PURE__ */ Ss(Vo, [["render", Uo]]), Bo = {
  class: "gl-icon",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.75",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true",
  focusable: "false"
}, Wo = ["cx", "cy"], zo = ["d"], qo = /* @__PURE__ */ Pn({
  __name: "UiIcon",
  props: {
    name: {},
    value: {}
  },
  setup(e) {
    const t = { menu: "M4 6h16M4 12h16M4 18h16", close: "m6 6 12 12M6 18 18 6", invite: "M15 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0M4 21v-2a6 6 0 0 1 9-5.2M18 14v8M14 18h8", copy: "M9 9h11v12H9zM5 15H3V3h12v2", exit: "M10 4H4v16h6M10 12h11m-4-4 4 4-4 4", download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5", help: "M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4M12 17h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0", refresh: "M20 7v5h-5M4 17v-5h5M5 8a8 8 0 0 1 13-3l2 3M4 16l2 3a8 8 0 0 0 13-3", pan: "M12 3v18M3 12h18m-12-6 3-3 3 3m-6 12 3 3 3-3M6 9l-3 3 3 3m12-6 3 3-3 3", pen: "m4 16-1 5 5-1L20 8a3 3 0 0 0-4-4ZM14 6l4 4", pencil: "m4 15-1 6 6-1L21 8l-5-5ZM13 6l5 5M4 15l5 5", marker: "m5 14 9-11 7 6-9 11ZM5 14l7 6-8 1-2-2ZM12 6l7 6", highlighter: "m7 13 7-10 7 5-7 10ZM7 13l7 5-3 3H4v-4ZM3 22h18", spray: "M5 10h9v11H5zM7 10V6h5v4M8 6V3h3M16 4h.01M20 2h.01M20 6h.01M18 9h.01", neon: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z", crayon: "m4 15 10-10 5 5L9 20H4ZM14 5l4-3 4 4-3 4M7 12l5 5", eraser: "m4 16 9-11a2 2 0 0 1 3 0l5 5a2 2 0 0 1 0 3l-8 8H8l-4-4a1 1 0 0 1 0-1ZM9 10l8 8M13 21h8", undo: "M3 4v6h6M3 10c3-7 17-6 17 3 0 5-5 7-10 6", redo: "M21 4v6h-6M21 10C18 3 4 4 4 13c0 5 5 7 10 6", plus: "M12 5v14M5 12h14", minus: "M5 12h14", target: "M12 2v4M12 18v4M2 12h4M18 12h4M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0M12 12h.01", check: "m5 12 4 4L19 6", play: "m8 4 12 8-12 8Z", trash: "M3 6h18M8 6V3h8v3M5 6l1 15h12l1-15M10 10v7M14 10v7", volume: "m3 9 5 0 5-5v16l-5-5H3ZM16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14", muted: "m3 9 5 0 5-5v16l-5-5H3ZM17 9l5 6M17 15l5-6", plane: "m22 2-7 20-4-9-9-4ZM11 13l6-6" }, n = { 1: [[12, 12]], 2: [[7, 7], [17, 17]], 3: [[7, 7], [12, 12], [17, 17]], 4: [[7, 7], [17, 7], [7, 17], [17, 17]], 5: [[7, 7], [17, 7], [12, 12], [7, 17], [17, 17]], 6: [[7, 6], [17, 6], [7, 12], [17, 12], [7, 18], [17, 18]] };
    return (s, i) => (ce(), pe("svg", Bo, [
      e.name === "dice" ? (ce(), pe(Se, { key: 0 }, [
        i[0] || (i[0] = C("rect", {
          x: "2",
          y: "2",
          width: "20",
          height: "20",
          rx: "4"
        }, null, -1)),
        (ce(!0), pe(Se, null, yn(n[e.value || 5], (l, r) => (ce(), pe("circle", {
          key: r,
          cx: l[0],
          cy: l[1],
          r: "1.3",
          fill: "currentColor",
          stroke: "none"
        }, null, 8, Wo))), 128))
      ], 64)) : (ce(), pe("path", {
        key: 1,
        d: t[e.name] || t.help
      }, null, 8, zo))
    ]));
  }
}), de = /* @__PURE__ */ Ss(qo, [["__scopeId", "data-v-8fcd069f"]]), Zo = { class: "doodle-tools" }, Go = { class: "tool-group" }, Jo = { class: "doodle-palette" }, Yo = ["aria-label", "onClick"], Xo = {
  class: "brush-picker",
  role: "group",
  "aria-label": "选择笔刷"
}, Qo = ["aria-pressed", "aria-label", "title", "onClick"], eu = { class: "tool-group size-group" }, tu = { class: "tool-actions" }, nu = ["aria-pressed"], su = ["aria-pressed"], iu = ["aria-pressed"], lu = ["disabled"], ru = ["disabled"], ou = ["disabled"], uu = { class: "paper-caption" }, cu = { class: "view-controls" }, au = { class: "paper-corner" }, fu = { class: "doodle-footer" }, du = "#f8f9fd", hu = /* @__PURE__ */ Pn({
  __name: "DoodleCanvas",
  props: {
    client: {},
    self: {},
    members: {},
    topicRound: {}
  },
  setup(e, { expose: t }) {
    const n = e, s = ["#26332f", "#f06b53", "#f3a83b", "#edcf51", "#77ae73", "#50a9a1", "#5d83c8", "#a279c7", "#e783a5", "#ffffff"], i = /* @__PURE__ */ ie(), l = /* @__PURE__ */ ie(), r = /* @__PURE__ */ ie(s[0]), o = /* @__PURE__ */ ie(7), u = /* @__PURE__ */ ie("pen"), p = /* @__PURE__ */ ie("pen"), d = [
      { id: "pen", name: "圆头笔" },
      { id: "pencil", name: "铅笔" },
      { id: "marker", name: "马克笔" },
      { id: "highlighter", name: "荧光笔" },
      { id: "spray", name: "喷枪" },
      { id: "neon", name: "霓虹笔" },
      { id: "crayon", name: "蜡笔" }
    ], g = /* @__PURE__ */ ie([]), _ = /* @__PURE__ */ ie([]), P = /* @__PURE__ */ ie([]), K = /* @__PURE__ */ ie(!1), R = /* @__PURE__ */ ie(!1), ee = Pe(() => _.value.length > 0), Y = Pe(() => P.value.length > 0), V = s;
    let U = null, F, L = null, fe = !1;
    const se = /* @__PURE__ */ new Set(), be = /* @__PURE__ */ new Set();
    let Ke = 0;
    const W = /* @__PURE__ */ ie({ x: 0, y: 0, zoom: 1 }), oe = /* @__PURE__ */ new Map();
    let Ee = !1, Re = !1, Ue = 0;
    const gt = Pe(() => `${Math.round(W.value.zoom * 100)}%`), A = Pe(() => ({ backgroundSize: `${24 * W.value.zoom}px ${24 * W.value.zoom}px`, backgroundPosition: `${W.value.x}px ${W.value.y}px` }));
    function T() {
      Ue || (Ue = requestAnimationFrame(() => {
        Ue = 0, Ie();
      }));
    }
    function $(a, h) {
      const w = i.value.getBoundingClientRect(), O = h || { x: w.width / 2, y: w.height / 2 }, N = W.value, B = Math.max(0.15, Math.min(5, N.zoom * a)), z = B / N.zoom;
      W.value = { x: O.x - (O.x - N.x) * z, y: O.y - (O.y - N.y) * z, zoom: B }, T();
    }
    function ue() {
      W.value = { x: 0, y: 0, zoom: 1 }, T();
    }
    function we(a) {
      a.preventDefault();
      const h = i.value.getBoundingClientRect();
      a.ctrlKey || a.metaKey ? $(Math.exp(-a.deltaY * 0.01), { x: a.clientX - h.left, y: a.clientY - h.top }) : (W.value.x -= a.deltaX, W.value.y -= a.deltaY, T());
    }
    function $e(a) {
      const h = i.value.getBoundingClientRect();
      return { x: a.clientX - h.left, y: a.clientY - h.top };
    }
    function Ae(a) {
      a.code === "Space" && (Re = !1);
    }
    function Rt() {
      Mt(), oe.clear(), Ee = !1, Re = !1;
    }
    function tn(a, h, w = 0) {
      const O = h.points;
      if (!O.length) return;
      a.save(), a.globalCompositeOperation = h.color === "erase" ? "destination-out" : h.brush === "highlighter" ? "multiply" : "source-over", a.strokeStyle = h.color === "erase" ? "#000" : h.color, a.fillStyle = a.strokeStyle;
      const N = h.width * (h.brush === "marker" ? 1.65 : h.brush === "highlighter" ? 3.2 : 1);
      if (a.lineWidth = N, a.lineCap = "round", a.lineJoin = "round", a.globalAlpha = h.brush === "pencil" ? 0.62 : h.brush === "marker" ? 0.58 : h.brush === "highlighter" ? 0.3 : h.brush === "crayon" ? 0.82 : 1, h.brush === "neon" && (a.shadowColor = h.color, a.shadowBlur = Math.max(5, h.width * 1.5)), h.brush === "spray") {
        const B = [...h.id].reduce((le, ye) => le * 31 + ye.charCodeAt(0) | 0, 7), z = (le, ye, re) => {
          const te = Math.sin(B * 1e-3 + le * 78.233 + ye * 39.425 + re * 11.73) * 43758.5453;
          return te - Math.floor(te);
        }, J = O.length === 1 ? 0 : Math.max(1, w);
        for (let le = J; le < O.length; le++) {
          const ye = O[Math.max(0, le - 1)], re = O[le];
          for (let te = 0; te < 16; te++) {
            const Qe = z(le, te, 0), at = N * (1.6 + z(le, te, 1) * 1.4), dl = ye.x + (re.x - ye.x) * Qe + (z(le, te, 2) - 0.5) * at, hl = ye.y + (re.y - ye.y) * Qe + (z(le, te, 3) - 0.5) * at, pl = 0.9 + z(le, te, 4) * Math.max(1.5, h.width * 0.28);
            a.beginPath(), a.arc(dl, hl, pl, 0, Math.PI * 2), a.fill();
          }
        }
      } else {
        const B = O.length === 1 ? 0 : Math.max(1, w);
        a.beginPath(), a.moveTo(O[Math.max(0, B - 1)].x, O[Math.max(0, B - 1)].y);
        for (let z = B; z < O.length; z++) a.lineTo(O[z].x, O[z].y);
        a.stroke(), (O.length === 1 || O.every((z) => z.x === O[0].x && z.y === O[0].y)) && (a.beginPath(), a.arc(O[0].x, O[0].y, N / 2, 0, Math.PI * 2), a.fill()), h.brush === "crayon" && (a.globalAlpha = 0.22, a.lineWidth = Math.max(1, h.width * 0.22), a.setLineDash([1, Math.max(2, h.width * 0.5)]), a.stroke(), a.setLineDash([]));
      }
      a.restore();
    }
    function Ie() {
      if (!i.value || !U) return;
      const a = i.value.getBoundingClientRect(), h = Math.min(devicePixelRatio || 1, 2), w = Math.max(1, Math.floor(a.width * h)), O = Math.max(1, Math.floor(a.height * h));
      (i.value.width !== w || i.value.height !== O) && (i.value.width = w, i.value.height = O), U.setTransform(h, 0, 0, h, 0, 0), U.clearRect(0, 0, a.width, a.height);
      for (const N of g.value) tn(U, mt(N));
      L && tn(U, mt(L));
    }
    function ct(a) {
      const h = $e(a), w = W.value;
      return { x: (h.x - w.x) / w.zoom, y: (h.y - w.y) / w.zoom };
    }
    function mt(a) {
      const h = W.value;
      return { ...a, width: a.width * h.zoom, points: a.points.map((w) => ({ x: w.x * h.zoom + h.x, y: w.y * h.zoom + h.y })) };
    }
    function $t(a) {
      if (n.topicRound && !(a.button !== 0 && a.button !== 1 && a.pointerType !== "touch")) {
        if (a.preventDefault(), i.value.setPointerCapture(a.pointerId), oe.set(a.pointerId, $e(a)), oe.size > 1) {
          L && L.points.length < 4 ? (be.add(L.id), n.client?.send("doodle-cancel", { id: L.id }, { reliability: "reliable" }), L = null, fe = !1, K.value = !1, T()) : Mt(), Ee = !0;
          return;
        }
        Ee = u.value === "pan" || Re || a.button === 1, !Ee && (fe = !0, K.value = !0, L = { id: `${n.self.id}:${crypto.randomUUID()}`, owner: n.self.id, name: n.self.name, space: "world", round: n.topicRound, color: u.value === "eraser" ? "erase" : r.value, width: u.value === "eraser" ? o.value * 3 : o.value, brush: u.value === "eraser" ? "pen" : p.value, points: [ct(a)] }, Ke = performance.now(), n.client?.send("doodle-progress", L, { reliability: "unreliable" }), T());
      }
    }
    function nn(a) {
      if (!oe.has(a.pointerId)) return;
      a.preventDefault();
      const h = [...oe.values()], w = oe.get(a.pointerId), O = $e(a);
      if (oe.set(a.pointerId, O), oe.size >= 2) {
        const J = [...oe.values()], le = h[0], ye = h[1], re = J[0], te = J[1], Qe = { x: (le.x + ye.x) / 2, y: (le.y + ye.y) / 2 }, at = { x: (re.x + te.x) / 2, y: (re.y + te.y) / 2 };
        $(Math.hypot(re.x - te.x, re.y - te.y) / Math.max(1, Math.hypot(le.x - ye.x, le.y - ye.y)), Qe), W.value.x += at.x - Qe.x, W.value.y += at.y - Qe.y, T();
        return;
      }
      if (Ee) {
        W.value.x += O.x - w.x, W.value.y += O.y - w.y, T();
        return;
      }
      if (!fe || !L) return;
      const N = ct(a), B = L.points[L.points.length - 1];
      if (Math.hypot(N.x - B.x, N.y - B.y) * W.value.zoom < 1) return;
      if (L.points.length >= 320) {
        const J = L;
        Mt(), fe = !0, K.value = !0, L = { ...J, id: `${n.self.id}:${crypto.randomUUID()}`, points: [B] };
      }
      L.points.push(N), T();
      const z = performance.now();
      z - Ke >= 40 && (Ke = z, n.client?.send("doodle-progress", L, { reliability: "unreliable" }));
    }
    function Xe(a) {
      oe.has(a.pointerId) && (Mt(), oe.delete(a.pointerId), oe.size || (Ee = !1));
    }
    function Mt() {
      if (!fe || !L) return;
      fe = !1;
      const a = L;
      L = null, a.points.length === 1 && a.points.push({ ...a.points[0] }), g.value.push(a), g.value.length > 600 && g.value.shift(), se.add(a.id), _.value.push(a.id), P.value = [], K.value = !1, n.client?.send("doodle-stroke", a, { reliability: "reliable" }), Ie();
    }
    function c(a, h = !0) {
      if (typeof a.id == "string" && be.has(a.id) || n.topicRound > 0 && a.round !== n.topicRound || typeof a.id != "string" || typeof a.owner != "string" || typeof a.color != "string" || !Array.isArray(a.points) || !a.points.length || a.points.length > 320 || se.has(a.id) || typeof a.width != "number" || !Number.isFinite(a.width) || a.width < 1 || a.width > 100 || a.color !== "erase" && !/^#[\da-f]{6}$/i.test(a.color)) return;
      const w = ["pen", "pencil", "marker", "highlighter", "spray", "neon", "crayon"];
      if (typeof a.brush != "string" || !w.includes(a.brush)) return;
      const O = a.points.filter((J) => !!J && typeof J == "object" && Number.isFinite(J.x) && Number.isFinite(J.y) && Math.abs(J.x) < 1e12 && Math.abs(J.y) < 1e12);
      if (!O.length) return;
      const N = a.space === "world" ? O : O.map((J) => ({ x: J.x * 1e3, y: J.y * 650 })), B = { space: "world", id: a.id, owner: a.owner, name: typeof a.name == "string" ? a.name.slice(0, 32) : "朋友", color: a.color, width: a.width, brush: a.brush, points: N }, z = g.value.findIndex((J) => J.id === B.id);
      z >= 0 ? g.value[z] = B : g.value.push(B), h && se.add(B.id), g.value.length > 600 && g.value.shift(), Ie();
    }
    function f(a) {
      for (const h of a) h && typeof h == "object" && c(h);
    }
    function m(a) {
      be.add(a), x(a);
    }
    function x(a) {
      g.value = g.value.filter((h) => h.id !== a), _.value = _.value.filter((h) => h !== a), se.delete(a), Ie();
    }
    function v() {
      const a = [..._.value].reverse().findIndex((N) => g.value.some((B) => B.id === N));
      if (a < 0) return;
      const h = _.value[_.value.length - 1 - a], w = g.value.findIndex((N) => N.id === h), [O] = g.value.splice(w, 1);
      _.value = _.value.filter((N) => N !== h), O && (P.value.push(O), se.delete(h), n.client?.send("doodle-undo", { id: h }, { reliability: "reliable" })), Ie();
    }
    function b() {
      const a = P.value.pop();
      a && (g.value.push(a), se.add(a.id), _.value.push(a.id), n.client?.send("doodle-stroke", a, { reliability: "reliable" }), Ie());
    }
    function E() {
      g.value.length && (g.value = [], _.value = [], P.value = [], se.clear(), n.client?.send("doodle-clear", {}, { reliability: "reliable" }), Ie());
    }
    function S() {
      g.value = [], _.value = [], P.value = [], se.clear(), Ie();
    }
    function M() {
      L && (be.add(L.id), n.client?.send("doodle-cancel", { id: L.id }, { reliability: "reliable" })), L = null, fe = !1, K.value = !1, oe.clear(), Ee = !1, S();
    }
    function y(a) {
      const h = g.value.filter((w) => se.has(w.id));
      for (let w = 0; w < h.length; w += 5) n.client?.send("doodle-snapshot", { strokes: h.slice(w, w + 5) }, { target: a, reliability: "reliable" });
    }
    function k(a) {
      n.client?.send("doodle-request", {}, { target: a, reliability: "reliable" }), y(a);
    }
    function I() {
      if (!i.value) return;
      Mt(), Ie();
      const a = document.createElement("canvas");
      a.width = i.value.width, a.height = i.value.height;
      const h = a.getContext("2d");
      h.fillStyle = du, h.fillRect(0, 0, a.width, a.height), h.drawImage(i.value, 0, 0);
      const w = document.createElement("a");
      w.download = `gamelink-doodle-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.png`, w.href = a.toDataURL("image/png"), w.click();
    }
    function D(a) {
      a.target instanceof HTMLInputElement || (a.code === "Space" && (a.preventDefault(), Re = !0), a.key.toLowerCase() === "h" && (u.value = "pan"), a.key.toLowerCase() === "b" && (u.value = "pen"), (a.metaKey || a.ctrlKey) && a.key.toLowerCase() === "z" && (a.preventDefault(), a.shiftKey ? b() : v()), (a.metaKey || a.ctrlKey) && a.key.toLowerCase() === "y" && (a.preventDefault(), b()), a.key === "Escape" && (R.value = !1));
    }
    return xs(() => {
      U = i.value.getContext("2d"), F = new ResizeObserver(Ie), F.observe(l.value), addEventListener("keydown", D), addEventListener("keyup", Ae), addEventListener("blur", Rt), Ie();
      for (const a of n.client?.members || []) a.id !== n.self.id && n.client?.peerStates.get(a.id) === "connected" && k(a.id);
    }), ws(() => {
      F?.disconnect(), cancelAnimationFrame(Ue), removeEventListener("keydown", D), removeEventListener("keyup", Ae), removeEventListener("blur", Rt);
    }), dn(() => n.members, () => Pi(Ie), { deep: !0 }), t({ cancelStroke: m, addRemote: c, addSnapshot: f, removeStroke: x, clearRemote: S, clearForTopic: M, sendSnapshot: y, handshake: k }), (a, h) => (ce(), pe("section", {
      class: "doodle-workspace",
      onContextmenu: h[12] || (h[12] = kt(() => {
      }, ["prevent"])),
      onSelectstart: h[13] || (h[13] = kt(() => {
      }, ["prevent"])),
      onDragstart: h[14] || (h[14] = kt(() => {
      }, ["prevent"]))
    }, [
      C("aside", Zo, [
        C("div", Go, [
          h[15] || (h[15] = C("small", null, "画笔颜色", -1)),
          C("div", Jo, [
            (ce(!0), pe(Se, null, yn(Ai(V), (w) => (ce(), pe("button", {
              key: w,
              class: He({ selected: r.value === w && u.value === "pen" }),
              style: Ot({ "--swatch": w }),
              "aria-label": `选择颜色 ${w}`,
              onClick: (O) => {
                r.value = w, u.value = "pen";
              }
            }, null, 14, Yo))), 128))
          ])
        ]),
        h[19] || (h[19] = C("i", { class: "tool-divider" }, null, -1)),
        C("div", Xo, [
          (ce(), pe(Se, null, yn(d, (w) => C("button", {
            key: w.id,
            class: He({ selected: p.value === w.id && u.value === "pen" }),
            "aria-pressed": p.value === w.id && u.value === "pen",
            "aria-label": w.name,
            title: w.name,
            onClick: (O) => {
              p.value = w.id, u.value = "pen";
            }
          }, [
            q(de, {
              name: w.id
            }, null, 8, ["name"]),
            C("small", null, he(w.name), 1)
          ], 10, Qo)), 64))
        ]),
        C("div", eu, [
          C("small", null, [
            h[16] || (h[16] = me("粗细 ", -1)),
            C("b", null, he(o.value), 1)
          ]),
          rr(C("input", {
            "onUpdate:modelValue": h[0] || (h[0] = (w) => o.value = w),
            type: "range",
            min: "2",
            max: "24",
            "aria-label": "笔刷粗细"
          }, null, 512), [
            [
              $o,
              o.value,
              void 0,
              { number: !0 }
            ]
          ])
        ]),
        h[20] || (h[20] = C("i", { class: "tool-divider" }, null, -1)),
        C("div", tu, [
          C("button", {
            class: He(["gl-action", { active: u.value === "pan" }]),
            "aria-pressed": u.value === "pan",
            "aria-label": "移动画布",
            title: "移动画布 H / 空格",
            onClick: h[1] || (h[1] = (w) => u.value = "pan")
          }, [
            q(de, { name: "pan" })
          ], 10, nu),
          C("button", {
            class: He(["gl-action", { active: u.value === "pen" }]),
            "aria-pressed": u.value === "pen",
            "aria-label": "画笔",
            title: "画笔",
            onClick: h[2] || (h[2] = (w) => u.value = "pen")
          }, [
            q(de, { name: "pen" })
          ], 10, su),
          C("button", {
            class: He(["gl-action", { active: u.value === "eraser" }]),
            "aria-pressed": u.value === "eraser",
            "aria-label": "橡皮擦",
            title: "橡皮擦",
            onClick: h[3] || (h[3] = (w) => u.value = "eraser")
          }, [
            q(de, { name: "eraser" })
          ], 10, iu),
          C("button", {
            class: "gl-action",
            disabled: !ee.value,
            "aria-label": "撤销",
            title: "撤销 Ctrl/⌘ Z",
            onClick: v
          }, [
            q(de, { name: "undo" })
          ], 8, lu),
          C("button", {
            class: "gl-action",
            disabled: !Y.value,
            "aria-label": "重做",
            title: "重做 Ctrl/⌘ Shift Z",
            onClick: b
          }, [
            q(de, { name: "redo" })
          ], 8, ru)
        ]),
        h[21] || (h[21] = C("i", { class: "tool-divider" }, null, -1)),
        C("button", {
          class: "gl-action clear-button",
          disabled: !g.value.length,
          onClick: E
        }, [
          q(de, { name: "trash" }),
          h[17] || (h[17] = me("清空画布", -1))
        ], 8, ou),
        C("button", {
          class: "gl-action save-button",
          onClick: I
        }, [
          q(de, { name: "download" }),
          h[18] || (h[18] = me("保存视野", -1))
        ])
      ]),
      C("div", {
        ref_key: "wrap",
        ref: l,
        class: He(["paper-wrap", { drawing: K.value, panning: u.value === "pan" }]),
        style: Ot(A.value)
      }, [
        C("div", uu, [
          h[22] || (h[22] = C("span", null, "无限画室 / INFINITE STUDIO", -1)),
          C("span", null, he(g.value.length) + " 笔创作", 1)
        ]),
        C("canvas", {
          ref_key: "canvas",
          ref: i,
          class: "shared-canvas",
          onPointerdown: $t,
          onPointermove: nn,
          onPointerup: Xe,
          onPointercancel: Xe,
          onLostpointercapture: Xe,
          onWheel: we,
          onContextmenu: h[4] || (h[4] = kt(() => {
          }, ["prevent"]))
        }, null, 544),
        g.value.length ? Wt("", !0) : (ce(), pe("div", {
          key: 0,
          class: "paper-empty",
          onClick: h[5] || (h[5] = (w) => R.value = !0)
        }, [
          C("span", null, [
            q(ls)
          ]),
          h[23] || (h[23] = C("b", null, "在这里，让想象铺开", -1)),
          h[24] || (h[24] = C("small", null, "单指绘画 · 双指移动与缩放 · 每个人都有自己的视角", -1))
        ])),
        C("div", cu, [
          C("button", {
            class: "gl-action",
            "aria-label": "缩小",
            onClick: h[6] || (h[6] = (w) => $(1 / 1.25))
          }, [
            q(de, { name: "minus" })
          ]),
          C("span", null, he(gt.value), 1),
          C("button", {
            class: "gl-action",
            "aria-label": "放大",
            onClick: h[7] || (h[7] = (w) => $(1.25))
          }, [
            q(de, { name: "plus" })
          ]),
          C("button", {
            class: "gl-action origin-button",
            onClick: ue
          }, [
            q(de, { name: "target" }),
            h[25] || (h[25] = me("回到原点", -1))
          ])
        ]),
        C("div", au, he(Math.round(-W.value.x / W.value.zoom)) + ", " + he(Math.round(-W.value.y / W.value.zoom)), 1)
      ], 6),
      C("footer", fu, [
        C("span", null, [
          h[26] || (h[26] = C("i", null, null, -1)),
          me(" " + he(g.value.length ? "共同创作中" : "画纸已准备好"), 1)
        ]),
        h[28] || (h[28] = C("span", null, "双指移动 / 缩放 · 保留最近 600 笔", -1)),
        C("button", {
          class: "gl-action",
          onClick: h[8] || (h[8] = (w) => R.value = !R.value)
        }, [
          q(de, { name: "help" }),
          h[27] || (h[27] = me("使用说明", -1))
        ])
      ]),
      R.value ? (ce(), pe("div", {
        key: 0,
        class: "help-overlay",
        onClick: h[11] || (h[11] = kt((w) => R.value = !1, ["self"]))
      }, [
        C("article", null, [
          C("button", {
            class: "gl-action help-close",
            "aria-label": "关闭说明",
            onClick: h[9] || (h[9] = (w) => R.value = !1)
          }, [
            q(de, { name: "close" })
          ]),
          h[30] || (h[30] = C("small", null, "MAKE A MARK", -1)),
          h[31] || (h[31] = C("h2", null, [
            me("一起画，"),
            C("em", null, "一起玩。")
          ], -1)),
          h[32] || (h[32] = C("p", null, "单指或鼠标绘画；双指拖动和捏合缩放。选择移动工具后，单指也可以拖动画布。电脑可按住空格拖动，滚轮平移，Ctrl/⌘ + 滚轮缩放。视角只影响自己，回到原点可找到朋友的第一笔。每个人的笔画会实时同步给房间里的朋友，新加入的人也会收到当前画布。", -1)),
          h[33] || (h[33] = C("p", null, "工具栏可切换圆头笔、铅笔、马克笔、荧光笔、喷枪、霓虹笔和蜡笔。选颜色与粗细；橡皮擦会擦掉经过的画迹。撤销仅撤回自己的最近一笔，清空会清除所有人的画布。", -1)),
          h[34] || (h[34] = C("p", null, [
            me("用 "),
            C("kbd", null, "⌘/Ctrl Z"),
            me(" 撤销，"),
            C("kbd", null, "Shift ⌘/Ctrl Z"),
            me(" 重做。保存视野会导出当前看到的区域。")
          ], -1)),
          C("button", {
            class: "gl-action help-done",
            onClick: h[10] || (h[10] = (w) => R.value = !1)
          }, [
            q(de, { name: "play" }),
            h[29] || (h[29] = me("开始涂鸦", -1))
          ])
        ])
      ])) : Wt("", !0)
    ], 32));
  }
}), pu = ["disabled", "title"], gu = {
  method: "dialog",
  class: "room-invite-panel"
}, mu = {
  class: "gl-action room-invite-close",
  "aria-label": "关闭"
}, vu = ["value"], bu = /* @__PURE__ */ Pn({
  __name: "RoomInviteButton",
  props: {
    gameId: {},
    roomCode: {},
    memberCount: {},
    maxMembers: {},
    variant: { default: "battle" }
  },
  setup(e) {
    const t = e, n = /* @__PURE__ */ ie(), s = /* @__PURE__ */ ie(!1), i = Pe(() => {
      if (!t.roomCode) return "";
      const u = new URL("/", window.location.href);
      return u.hash = `/invite?${new URLSearchParams({ gameid: t.gameId, room: t.roomCode }).toString()}`, u.href;
    }), l = Pe(() => t.memberCount >= t.maxMembers);
    async function r() {
      if (!(!i.value || l.value)) {
        s.value = !1, n.value?.showModal();
        try {
          await navigator.clipboard.writeText(i.value), s.value = !0;
        } catch {
          s.value = !1;
        }
      }
    }
    async function o() {
      try {
        await navigator.clipboard.writeText(i.value), s.value = !0;
      } catch {
        s.value = !1;
      }
    }
    return (u, p) => (ce(), pe(Se, null, [
      C("button", {
        class: He(["gl-action room-invite-trigger", `invite-${e.variant}`]),
        type: "button",
        disabled: !e.roomCode || l.value,
        title: l.value ? "房间已满，无法邀请" : "生成并复制房间邀请链接",
        onClick: r
      }, [
        q(de, { name: "invite" }),
        p[1] || (p[1] = me("邀请", -1))
      ], 10, pu),
      C("dialog", {
        ref_key: "dialog",
        ref: n,
        class: "room-invite-dialog",
        "aria-labelledby": "room-invite-title"
      }, [
        C("form", gu, [
          C("button", mu, [
            q(de, { name: "close" })
          ]),
          p[2] || (p[2] = C("small", null, "GAMELINK / ROOM INVITE", -1)),
          p[3] || (p[3] = C("h2", { id: "room-invite-title" }, "邀请好友加入", -1)),
          p[4] || (p[4] = C("p", null, "分享链接，好友打开后会自动加入房间。", -1)),
          C("input", {
            value: i.value,
            readonly: "",
            "aria-label": "房间邀请链接",
            onFocus: p[0] || (p[0] = (d) => d.target.select())
          }, null, 40, vu),
          C("button", {
            type: "button",
            class: "gl-action room-invite-copy",
            onClick: o
          }, [
            q(de, {
              name: s.value ? "check" : "copy"
            }, null, 8, ["name"]),
            me(he(s.value ? "已复制邀请链接" : "复制邀请链接"), 1)
          ])
        ])
      ], 512)
    ], 64));
  }
}), yu = /* @__PURE__ */ Ss(bu, [["__scopeId", "data-v-5bb541c6"]]), _u = { class: "doodle-app" }, xu = { class: "doodle-header" }, wu = {
  class: "doodle-brand",
  href: "/"
}, Cu = { class: "brand-mark" }, Mu = { class: "doodle-room" }, Su = { class: "doodle-members" }, Tu = ["title"], Eu = ["title"], Au = {
  key: 1,
  class: "doodle-connect"
}, Iu = { class: "connect-star" }, Ou = ["href"], Pu = {
  key: 2,
  class: "doodle-toast"
}, Ru = /* @__PURE__ */ Pn({
  __name: "DoodlePage",
  setup(e) {
    const t = /* @__PURE__ */ Gl(), n = /* @__PURE__ */ ie(), s = /* @__PURE__ */ ie(), i = /* @__PURE__ */ ie([]), l = /* @__PURE__ */ ie(""), r = /* @__PURE__ */ ie(!1), o = /* @__PURE__ */ ie("/"), u = /* @__PURE__ */ ie("正在连接"), p = /* @__PURE__ */ ie({}), d = /* @__PURE__ */ ie(), g = ["会飞的房子", "深海邮局", "一只迷路的月亮", "机器人野餐", "云朵动物园", "会说话的植物", "外星人的早餐", "雨天的游乐园", "穿靴子的章鱼", "未来城市的公园", "巨型甜甜圈", "森林里的小火车", "海盗猫的宝藏", "会跳舞的冰箱", "太空中的水族馆", "蘑菇旅馆", "隐形人的宠物", "会发光的鲸鱼", "龙的生日派对", "倒着长的树", "糖果做的城堡", "小熊的发明", "海底火山餐厅", "一只戴眼镜的青蛙", "时间旅行书店", "火星上的菜市场", "会唱歌的雨伞", "雪人的夏日假期", "口袋里的小宇宙", "魔法师的工作桌", "长颈鹿开飞机", "夜晚的灯塔", "住在茶杯里的精灵", "会生气的山", "水母城市", "云上的篮球场", "章鱼理发店", "月球温室", "古怪的超级英雄", "最奇妙的交通工具"], _ = /* @__PURE__ */ ie({ round: 0, topic: "", seed: "", topicIndex: -1, leaderId: "", endsAt: 0 }), P = /* @__PURE__ */ ie(Date.now()), K = Pe(() => [...i.value].sort((A, T) => A.id.localeCompare(T.id))[0]?.id || ""), R = Pe(() => !!s.value && K.value === s.value.id), ee = Pe(() => Math.max(0, Math.ceil((_.value.endsAt - P.value) / 1e3))), Y = Pe(() => _.value.round ? `${Math.floor(ee.value / 60)}:${String(ee.value % 60).padStart(2, "0")}` : "--:--"), V = Pe(() => i.value.length), U = Pe(() => _.value.topic || (V.value > 1 ? "正在同步房间主题…" : "正在抽取主题…")), F = Pe(() => {
      const A = i.value.filter((T) => T.id !== s.value?.id && p.value[T.id] === "connected").length;
      return V.value <= 1 ? "等朋友加入" : `${A}/${V.value - 1} 位朋友已连接`;
    });
    async function L() {
      try {
        await t.value?.leave();
      } finally {
        window.location.assign(o.value);
      }
    }
    function fe(A, T, $) {
      let ue = 2166136261;
      for (const $e of `${A}:${T}`) ue = Math.imul(ue ^ $e.charCodeAt(0), 16777619);
      let we = (ue >>> 0) % g.length;
      return we === $ && (we = (we + 1) % g.length), we;
    }
    function se() {
      if (!R.value) return;
      const A = _.value.seed || crypto.getRandomValues(new Uint32Array(2)).join("-"), T = _.value.round + 1, $ = fe(A, T, _.value.topicIndex), ue = { round: T, topic: g[$], seed: A, topicIndex: $, leaderId: s.value?.id || "preview", endsAt: Date.now() + 9e4 };
      be(ue), t.value?.send("doodle-topic-state", ue, { reliability: "reliable" });
    }
    function be(A) {
      if (A.round < _.value.round) return;
      if (A.round === _.value.round) {
        if (_.value.round === 0) {
          _.value = A;
          return;
        }
        if (A.leaderId !== K.value) return;
        _.value = A;
        return;
      }
      const T = _.value.round > 0;
      _.value = A, T && d.value?.clearForTopic(), T && window.setTimeout(() => t.value?.send("doodle-request", {}, { reliability: "reliable" }), 250);
    }
    function Ke() {
      R.value ? se() : t.value?.send("doodle-topic-skip", {}, { reliability: "reliable" });
    }
    function W(A) {
      if (R.value && _.value.round) {
        const T = { ..._.value, leaderId: s.value.id };
        _.value = T, t.value?.send("doodle-topic-state", T, { ...A ? { target: A } : {}, reliability: "reliable" });
      } else t.value?.send("doodle-topic-request", {}, { ...A ? { target: A } : {}, reliability: "reliable" });
    }
    function oe() {
      P.value = Date.now(), R.value && (!_.value.round && Date.now() - gt > 2500 || _.value.round > 0 && ee.value === 0 ? se() : _.value.leaderId !== s.value?.id && W()), ++Ue % 3 === 0 && W();
    }
    function Ee(A) {
      if (!i.value.some(($) => $.id === A.from)) return;
      const T = A.payload;
      A.kind === "doodle-stroke" ? d.value?.addRemote(T) : A.kind === "doodle-progress" ? d.value?.addRemote(T, !1) : A.kind === "doodle-cancel" && typeof T?.id == "string" ? d.value?.cancelStroke(T.id) : A.kind === "doodle-undo" && typeof T?.id == "string" ? d.value?.removeStroke(T.id) : A.kind === "doodle-clear" ? d.value?.clearRemote() : A.kind === "doodle-request" ? d.value?.sendSnapshot(A.from) : A.kind === "doodle-snapshot" && Array.isArray(T?.strokes) ? d.value?.addSnapshot(T.strokes) : A.kind === "doodle-topic-request" && R.value && _.value.round ? t.value?.send("doodle-topic-state", _.value, { target: A.from, reliability: "reliable" }) : A.kind === "doodle-topic-state" && (A.from === K.value || _.value.round === 0) && T?.leaderId === A.from && typeof T?.topic == "string" && Number.isInteger(T?.round) && typeof T?.seed == "string" && typeof T?.leaderId == "string" && Number.isFinite(T?.endsAt) ? be(T) : A.kind === "doodle-topic-skip" && R.value && se();
    }
    let Re = 0, Ue = 0, gt = Date.now();
    return xs(async () => {
      if (!new URLSearchParams(location.search).has("room")) {
        s.value = { id: "preview", name: "访客", virtual_ip: "", endpoint: "" }, i.value = [s.value], r.value = !0, u.value = "单人预览", se(), Re = window.setInterval(oe, 1e3);
        return;
      }
      try {
        const A = gl.fromLocation();
        if (A.gameId !== "gamelink-doodle") throw new Error("此页面只支持多人涂鸦房间。");
        t.value = A, o.value = `${A.serverUrl}/`, A.on("members", ($) => {
          i.value = $;
          const ue = new Set($.map((we) => we.id));
          p.value = Object.fromEntries(Object.entries(p.value).filter(([we]) => ue.has(we)));
        }), A.on("peer-state", ($) => {
          p.value = { ...p.value, [$.peerId]: $.state };
        }), A.on("peer-ready", ($) => {
          d.value?.handshake($.peerId), W($.peerId);
        }), A.on("message", Ee), A.on("error", ($) => {
          l.value = $.message, u.value = "连接异常";
        }), A.on("room-closed", () => {
          r.value = !1, l.value = "房间已关闭，请返回大厅重新加入。";
        });
        const T = await A.joinFromLocation();
        n.value = T.room, s.value = T.self_member, i.value = T.room.members, r.value = !0, u.value = "已加入房间", gt = Date.now();
        for (const [$, ue] of A.peerStates) ue === "connected" && (d.value?.handshake($), W($));
        Re = window.setInterval(oe, 1e3);
      } catch (A) {
        t.value?.dispose(), l.value = A instanceof Error ? A.message : String(A);
      }
    }), ws(() => {
      window.clearInterval(Re), t.value?.dispose();
    }), (A, T) => (ce(), pe("main", _u, [
      C("header", xu, [
        C("a", wu, [
          C("span", Cu, [
            q(ls)
          ]),
          T[1] || (T[1] = C("span", null, [
            C("b", null, "一起涂鸦"),
            C("small", null, "DRAW SOMETHING TOGETHER")
          ], -1))
        ]),
        C("div", Mu, [
          T[2] || (T[2] = C("span", { class: "live-dot" }, null, -1)),
          C("b", null, he(n.value?.code || (t.value ? "——" : "预览")), 1),
          C("span", null, he(F.value), 1)
        ]),
        C("div", {
          class: He(["doodle-topic", { "topic-waiting": !_.value.topic }])
        }, [
          C("small", null, "共同主题 · 第 " + he(_.value.round || 1) + " 题", 1),
          C("b", null, he(U.value), 1),
          C("span", null, he(Y.value), 1)
        ], 2),
        C("div", Su, [
          (ce(!0), pe(Se, null, yn(i.value.slice(0, 8), ($, ue) => (ce(), pe("span", {
            key: $.id,
            title: $.name,
            style: Ot({ "--member-color": ["#f3a48e", "#82afdb", "#97bd87", "#c59bd7", "#e7bd68", "#6fbdb0", "#dc91a7", "#91a4d6"][ue] })
          }, he($.name.slice(0, 1)), 13, Tu))), 128)),
          C("small", null, he(V.value) + " 人", 1)
        ]),
        n.value ? (ce(), ss(yu, {
          key: 0,
          variant: "doodle",
          "game-id": "gamelink-doodle",
          "room-code": n.value.code,
          "member-count": V.value,
          "max-members": 4
        }, null, 8, ["room-code", "member-count"])) : Wt("", !0),
        C("button", {
          class: "gl-action doodle-next-topic",
          title: R.value ? "随机抽取下一题" : "请求房间抽取下一题",
          onClick: Ke
        }, [
          q(de, { name: "refresh" }),
          T[3] || (T[3] = me("换个主题", -1))
        ], 8, Eu),
        C("button", {
          class: "gl-action doodle-exit",
          onClick: L
        }, [
          q(de, { name: "exit" }),
          T[4] || (T[4] = me("退出房间", -1))
        ])
      ]),
      r.value && s.value ? (ce(), ss(hu, {
        key: 0,
        ref_key: "canvas",
        ref: d,
        client: t.value,
        self: s.value,
        members: i.value,
        "topic-round": _.value.round
      }, null, 8, ["client", "self", "members", "topic-round"])) : (ce(), pe("section", Au, [
        C("span", Iu, [
          q(ls)
        ]),
        C("b", null, he(l.value || "正在铺开画纸…"), 1),
        C("small", null, he(l.value ? "检查房间链接或网络后重试" : u.value), 1),
        l.value ? (ce(), pe("a", {
          key: 0,
          href: o.value
        }, "返回游戏大厅", 8, Ou)) : Wt("", !0)
      ])),
      l.value && r.value ? (ce(), pe("div", Pu, [
        me(he(l.value), 1),
        C("button", {
          class: "gl-action",
          onClick: T[0] || (T[0] = ($) => l.value = "")
        }, [
          q(de, { name: "close" })
        ])
      ])) : Wt("", !0)
    ]));
  }
});
Ho(Ru).mount("#app");
