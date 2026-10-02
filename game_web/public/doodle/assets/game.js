import { GameLinkClient as ar } from "./gamelink.js";
// @__NO_SIDE_EFFECTS__
function ns(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const Q = {}, gt = [], He = () => {
}, Qs = () => !1, xn = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Sn = (e) => e.startsWith("onUpdate:"), ue = Object.assign, ss = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, dr = Object.prototype.hasOwnProperty, q = (e, t) => dr.call(e, t), D = Array.isArray, ft = (e) => Gt(e) === "[object Map]", dn = (e) => Gt(e) === "[object Set]", xs = (e) => Gt(e) === "[object Date]", j = (e) => typeof e == "function", te = (e) => typeof e == "string", ke = (e) => typeof e == "symbol", Z = (e) => e !== null && typeof e == "object", ei = (e) => (Z(e) || j(e)) && j(e.then) && j(e.catch), ti = Object.prototype.toString, Gt = (e) => ti.call(e), hr = (e) => Gt(e).slice(8, -1), ni = (e) => Gt(e) === "[object Object]", is = (e) => te(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Lt = /* @__PURE__ */ ns(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), wn = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, pr = /-\w/g, Ie = wn(
  (e) => e.replace(pr, (t) => t.slice(1).toUpperCase())
), gr = /\B([A-Z])/g, yt = wn(
  (e) => e.replace(gr, "-$1").toLowerCase()
), si = wn((e) => e.charAt(0).toUpperCase() + e.slice(1)), $n = wn(
  (e) => e ? `on${si(e)}` : ""
), Ne = (e, t) => !Object.is(e, t), fn = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, ii = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, rs = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let Ss;
const Cn = () => Ss || (Ss = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Mt(e) {
  if (D(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], i = te(s) ? yr(s) : Mt(s);
      if (i)
        for (const r in i)
          t[r] = i[r];
    }
    return t;
  } else if (te(e) || Z(e))
    return e;
}
const mr = /;(?![^(]*\))/g, vr = /:([^]+)/, br = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function yr(e) {
  const t = {};
  return e.replace(br, (n) => n.startsWith("/*") ? "" : n).split(mr).forEach((n) => {
    if (n) {
      const s = n.split(vr);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function qe(e) {
  let t = "";
  if (te(e))
    t = e;
  else if (D(e))
    for (let n = 0; n < e.length; n++) {
      const s = qe(e[n]);
      s && (t += s + " ");
    }
  else if (Z(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const _r = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", xr = /* @__PURE__ */ ns(_r);
function ri(e) {
  return !!e || e === "";
}
function Sr(e, t, n) {
  if (e.length !== t.length) return !1;
  let s = !0;
  for (let i = 0; s && i < e.length; i++)
    s = Tn(e[i], t[i], n);
  return s;
}
function ws(e, t, n) {
  if (e.size !== t.size) return !1;
  const s = Array.from(t), i = new Uint8Array(s.length);
  for (const r of e) {
    let l = -1;
    for (let o = 0; o < s.length; o++)
      if (!i[o] && Tn(r, s[o], n)) {
        l = o;
        break;
      }
    if (l < 0) return !1;
    i[l] = 1;
  }
  return !0;
}
function wr(e, t, n) {
  let s = ft(e), i = ft(t);
  if (s || i || (s = dn(e), i = dn(t), s || i))
    return s && i ? ws(e, t, n) : !1;
  const r = Object.keys(e).length, l = Object.keys(t).length;
  if (r !== l)
    return !1;
  for (const o in e) {
    const c = e.hasOwnProperty(o), p = t.hasOwnProperty(o);
    if (c && !p || !c && p || !Tn(e[o], t[o], n))
      return !1;
  }
  return String(e) === String(t);
}
function Cs(e, t, n, s) {
  n || (n = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()]);
  const [i, r] = n;
  if (i.has(e) || r.has(t))
    return i.get(e) === t && r.get(t) === e;
  i.set(e, t), r.set(t, e);
  const l = s(e, t, n);
  return i.delete(e), r.delete(t), l;
}
function Tn(e, t, n) {
  if (e === t) return !0;
  let s = xs(e), i = xs(t);
  return s || i ? s && i ? e.getTime() === t.getTime() : !1 : (s = ke(e), i = ke(t), s || i ? e === t : (s = D(e), i = D(t), s || i ? s && i ? Cs(e, t, n, Sr) : !1 : (s = Z(e), i = Z(t), s || i ? !s || !i ? !1 : Cs(e, t, n, wr) : String(e) === String(t))));
}
const li = (e) => !!(e && e.__v_isRef === !0), ae = (e) => te(e) ? e : e == null ? "" : D(e) || Z(e) && (e.toString === ti || !j(e.toString)) ? li(e) ? ae(e.value) : JSON.stringify(e, oi, 2) : String(e), oi = (e, t) => li(t) ? oi(e, t.value) : ft(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, i], r) => (n[Fn(s, r) + " =>"] = i, n),
    {}
  )
} : dn(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => Fn(n))
} : ke(t) ? Fn(t) : Z(t) && !D(t) && !ni(t) ? String(t) : t, Fn = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    ke(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
let ce;
class Cr {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !t && ce && (ce.active ? (this.parent = ce, this.index = (ce.scopes || (ce.scopes = [])).push(
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
      const n = ce;
      try {
        return ce = this, t();
      } finally {
        ce = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = ce, ce = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (ce === this)
        ce = this.prevScope;
      else {
        let t = ce;
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
function Tr() {
  return ce;
}
let ee;
const Dn = /* @__PURE__ */ new WeakSet();
class fi {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, ce && (ce.active ? ce.effects.push(this) : this.flags &= -2);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Dn.has(this) && (Dn.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || ui(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Ts(this), ai(this);
    const t = ee, n = Re;
    ee = this, Re = !0;
    try {
      return this.fn();
    } finally {
      di(this), ee = t, Re = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        fs(t);
      this.deps = this.depsTail = void 0, Ts(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Dn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Wn(this) && this.run();
  }
  get dirty() {
    return Wn(this);
  }
}
let ci = 0, jt, Nt;
function ui(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = Nt, Nt = e;
    return;
  }
  e.next = jt, jt = e;
}
function ls() {
  ci++;
}
function os() {
  if (--ci > 0)
    return;
  if (Nt) {
    let t = Nt;
    for (Nt = void 0; t; ) {
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
function ai(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function di(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const i = s.prevDep;
    s.version === -1 ? (s === n && (n = i), fs(s), Er(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = i;
  }
  e.deps = t, e.depsTail = n;
}
function Wn(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (hi(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function hi(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Vt) || (e.globalVersion = Vt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Wn(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = ee, s = Re;
  ee = e, Re = !0;
  try {
    ai(e);
    const i = e.fn(e._value);
    (t.version === 0 || Ne(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    ee = n, Re = s, di(e), e.flags &= -3;
  }
}
function fs(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: i } = e;
  if (s && (s.nextSub = i, e.prevSub = void 0), i && (i.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      fs(r, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function Er(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let Re = !0;
const pi = [];
function Ze() {
  pi.push(Re), Re = !1;
}
function Qe() {
  const e = pi.pop();
  Re = e === void 0 ? !0 : e;
}
function Ts(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = ee;
    ee = void 0;
    try {
      t();
    } finally {
      ee = n;
    }
  }
}
let Vt = 0;
class Mr {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class cs {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!ee || !Re || ee === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== ee)
      n = this.activeLink = new Mr(ee, this), ee.deps ? (n.prevDep = ee.depsTail, ee.depsTail.nextDep = n, ee.depsTail = n) : ee.deps = ee.depsTail = n, gi(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = ee.depsTail, n.nextDep = void 0, ee.depsTail.nextDep = n, ee.depsTail = n, ee.deps === n && (ee.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, Vt++, this.notify(t);
  }
  notify(t) {
    ls();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      os();
    }
  }
}
function gi(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        gi(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const zn = /* @__PURE__ */ new WeakMap(), vt = /* @__PURE__ */ Symbol(
  ""
), qn = /* @__PURE__ */ Symbol(
  ""
), Ut = /* @__PURE__ */ Symbol(
  ""
);
function de(e, t, n) {
  if (Re && ee) {
    let s = zn.get(e);
    s || zn.set(e, s = /* @__PURE__ */ new Map());
    let i = s.get(n);
    i || (s.set(n, i = new cs()), i.map = s, i.key = n), i.track();
  }
}
function Je(e, t, n, s, i, r) {
  const l = zn.get(e);
  if (!l) {
    Vt++;
    return;
  }
  const o = (c) => {
    c && c.trigger();
  };
  if (ls(), t === "clear")
    l.forEach(o);
  else {
    const c = D(e), p = c && is(n);
    if (c && n === "length") {
      const h = Number(s);
      l.forEach((g, E) => {
        (E === "length" || E === Ut || !ke(E) && E >= h) && o(g);
      });
    } else
      switch ((n !== void 0 || l.has(void 0)) && o(l.get(n)), p && o(l.get(Ut)), t) {
        case "add":
          c ? p && o(l.get("length")) : (o(l.get(vt)), ft(e) && o(l.get(qn)));
          break;
        case "delete":
          c || (o(l.get(vt)), ft(e) && o(l.get(qn)));
          break;
        case "set":
          ft(e) && o(l.get(vt));
          break;
      }
  }
  os();
}
function St(e) {
  const t = /* @__PURE__ */ z(e);
  return t === e || (de(t, "iterate", Ut), /* @__PURE__ */ Me(e)) ? t : /* @__PURE__ */ Ke(e) ? /* @__PURE__ */ ct(e) ? t.map((n) => ut(Ae(n))) : t.map(ut) : t.map(Ae);
}
function En(e) {
  return de(e = /* @__PURE__ */ z(e), "iterate", Ut), e;
}
function Le(e, t) {
  return /* @__PURE__ */ Ke(e) ? ut(/* @__PURE__ */ ct(e) ? Ae(t) : t) : Ae(t);
}
const Ar = {
  __proto__: null,
  [Symbol.iterator]() {
    return Ln(this, Symbol.iterator, (e) => Le(this, e));
  },
  concat(...e) {
    return St(this).concat(
      ...e.map((t) => D(t) ? St(t) : t)
    );
  },
  entries() {
    return Ln(this, "entries", (e) => (e[1] = Le(this, e[1]), e));
  },
  every(e, t) {
    return We(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return We(
      this,
      "filter",
      e,
      t,
      (n) => n.map((s) => Le(this, s)),
      arguments
    );
  },
  find(e, t) {
    return We(
      this,
      "find",
      e,
      t,
      (n) => Le(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return We(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return We(
      this,
      "findLast",
      e,
      t,
      (n) => Le(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return We(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return We(this, "forEach", e, t, void 0, arguments);
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
    return We(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return It(this, "pop");
  },
  push(...e) {
    return It(this, "push", e);
  },
  reduce(e, ...t) {
    return Es(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Es(this, "reduceRight", e, t);
  },
  shift() {
    return It(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return We(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return It(this, "splice", e);
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
    return It(this, "unshift", e);
  },
  values() {
    return Ln(this, "values", (e) => Le(this, e));
  }
};
function Ln(e, t, n) {
  const s = En(e), i = s[t]();
  return s !== e && !/* @__PURE__ */ Me(e) && (i._next = i.next, i.next = () => {
    const r = i._next();
    return r.done || (r.value = n(r.value)), r;
  }), i;
}
const Or = Array.prototype;
function We(e, t, n, s, i, r) {
  const l = En(e), o = l !== e && !/* @__PURE__ */ Me(e), c = l[t];
  if (c !== Or[t]) {
    const g = c.apply(e, r);
    return o ? Ae(g) : g;
  }
  let p = n;
  l !== e && (o ? p = function(g, E) {
    return n.call(this, Le(e, g), E, e);
  } : n.length > 2 && (p = function(g, E) {
    return n.call(this, g, E, e);
  }));
  const h = c.call(l, p, s);
  return o && i ? i(h) : h;
}
function Es(e, t, n, s) {
  const i = En(e), r = i !== e && !/* @__PURE__ */ Me(e);
  let l = n, o = !1;
  i !== e && (r ? (o = s.length === 0, l = function(p, h, g) {
    return o && (o = !1, p = Le(e, p)), n.call(this, p, Le(e, h), g, e);
  }) : n.length > 3 && (l = function(p, h, g) {
    return n.call(this, p, h, g, e);
  }));
  const c = i[t](l, ...s);
  return o ? Le(e, c) : c;
}
function jn(e, t, n) {
  const s = /* @__PURE__ */ z(e);
  de(s, "iterate", Ut);
  const i = s[t](...n);
  return (i === -1 || i === !1) && /* @__PURE__ */ hs(n[0]) ? (n[0] = /* @__PURE__ */ z(n[0]), s[t](...n)) : i;
}
function It(e, t, n = []) {
  Ze(), ls();
  const s = (/* @__PURE__ */ z(e))[t].apply(e, n);
  return os(), Qe(), s;
}
const Pr = /* @__PURE__ */ ns("__proto__,__v_isRef,__isVue"), mi = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(ke)
);
function Ir(e) {
  ke(e) || (e = String(e));
  const t = /* @__PURE__ */ z(this);
  return de(t, "has", e), t.hasOwnProperty(e);
}
class vi {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, s) {
    if (n === "__v_skip") return t.__v_skip;
    const i = this._isReadonly, r = this._isShallow;
    if (n === "__v_isReactive")
      return !i;
    if (n === "__v_isReadonly")
      return i;
    if (n === "__v_isShallow")
      return r;
    if (n === "__v_raw")
      return s === (i ? r ? Kr : xi : r ? _i : yi).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const l = D(t);
    if (!i) {
      let c;
      if (l && (c = Ar[n]))
        return c;
      if (n === "hasOwnProperty")
        return Ir;
    }
    const o = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ he(t) ? t : s
    );
    if ((ke(n) ? mi.has(n) : Pr(n)) || (i || de(t, "get", n), r))
      return o;
    if (/* @__PURE__ */ he(o)) {
      const c = l && is(n) ? o : o.value;
      return i && Z(c) ? /* @__PURE__ */ Jn(c) : c;
    }
    return Z(o) ? i ? /* @__PURE__ */ Jn(o) : /* @__PURE__ */ as(o) : o;
  }
}
class bi extends vi {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, i) {
    let r = t[n];
    const l = D(t) && is(n);
    if (!this._isShallow) {
      const p = /* @__PURE__ */ Ke(r);
      if (!/* @__PURE__ */ Me(s) && !/* @__PURE__ */ Ke(s) && (r = /* @__PURE__ */ z(r), s = /* @__PURE__ */ z(s)), !l && /* @__PURE__ */ he(r) && !/* @__PURE__ */ he(s))
        return p || (r.value = s), !0;
    }
    const o = l ? Number(n) < t.length : q(t, n), c = Reflect.set(
      t,
      n,
      s,
      /* @__PURE__ */ he(t) ? t : i
    );
    return t === /* @__PURE__ */ z(i) && c && (o ? Ne(s, r) && Je(t, "set", n, s) : Je(t, "add", n, s)), c;
  }
  deleteProperty(t, n) {
    const s = q(t, n);
    t[n];
    const i = Reflect.deleteProperty(t, n);
    return i && s && Je(t, "delete", n, void 0), i;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!ke(n) || !mi.has(n)) && de(t, "has", n), s;
  }
  ownKeys(t) {
    return de(
      t,
      "iterate",
      D(t) ? "length" : vt
    ), Reflect.ownKeys(t);
  }
}
class Rr extends vi {
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
const $r = /* @__PURE__ */ new bi(), Fr = /* @__PURE__ */ new Rr(), Dr = /* @__PURE__ */ new bi(!0);
const Gn = (e) => e, tn = (e) => Reflect.getPrototypeOf(e);
function Lr(e, t, n) {
  return function(...s) {
    const i = this.__v_raw, r = /* @__PURE__ */ z(i), l = ft(r), o = e === "entries" || e === Symbol.iterator && l, c = e === "keys" && l, p = i[e](...s), h = n ? Gn : t ? ut : Ae;
    return !t && de(
      r,
      "iterate",
      c ? qn : vt
    ), ue(
      // inheriting all iterator properties
      Object.create(p),
      {
        // iterator protocol
        next() {
          const { value: g, done: E } = p.next();
          return E ? { value: g, done: E } : {
            value: o ? [h(g[0]), h(g[1])] : h(g),
            done: E
          };
        }
      }
    );
  };
}
function nn(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function jr(e, t) {
  const n = {
    get(i) {
      const r = this.__v_raw, l = /* @__PURE__ */ z(r), o = /* @__PURE__ */ z(i);
      e || (Ne(i, o) && de(l, "get", i), de(l, "get", o));
      const { has: c } = tn(l), p = t ? Gn : e ? ut : Ae;
      if (c.call(l, i))
        return p(r.get(i));
      if (c.call(l, o))
        return p(r.get(o));
      r !== l && r.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !e && de(/* @__PURE__ */ z(i), "iterate", vt), i.size;
    },
    has(i) {
      const r = this.__v_raw, l = /* @__PURE__ */ z(r), o = /* @__PURE__ */ z(i);
      return e || (Ne(i, o) && de(l, "has", i), de(l, "has", o)), i === o ? r.has(i) : r.has(i) || r.has(o);
    },
    forEach(i, r) {
      const l = this, o = l.__v_raw, c = /* @__PURE__ */ z(o), p = t ? Gn : e ? ut : Ae;
      return !e && de(c, "iterate", vt), o.forEach((h, g) => i.call(r, p(h), p(g), l));
    }
  };
  return ue(
    n,
    e ? {
      add: nn("add"),
      set: nn("set"),
      delete: nn("delete"),
      clear: nn("clear")
    } : {
      add(i) {
        const r = /* @__PURE__ */ z(this), l = tn(r), o = /* @__PURE__ */ z(i), c = !t && !/* @__PURE__ */ Me(i) && !/* @__PURE__ */ Ke(i) ? o : i;
        return l.has.call(r, c) || Ne(i, c) && l.has.call(r, i) || Ne(o, c) && l.has.call(r, o) || (r.add(c), Je(r, "add", c, c)), this;
      },
      set(i, r) {
        !t && !/* @__PURE__ */ Me(r) && !/* @__PURE__ */ Ke(r) && (r = /* @__PURE__ */ z(r));
        const l = /* @__PURE__ */ z(this), { has: o, get: c } = tn(l);
        let p = o.call(l, i);
        p || (i = /* @__PURE__ */ z(i), p = o.call(l, i));
        const h = c.call(l, i);
        return l.set(i, r), p ? Ne(r, h) && Je(l, "set", i, r) : Je(l, "add", i, r), this;
      },
      delete(i) {
        const r = /* @__PURE__ */ z(this), { has: l, get: o } = tn(r);
        let c = l.call(r, i);
        c || (i = /* @__PURE__ */ z(i), c = l.call(r, i)), o && o.call(r, i);
        const p = r.delete(i);
        return c && Je(r, "delete", i, void 0), p;
      },
      clear() {
        const i = /* @__PURE__ */ z(this), r = i.size !== 0, l = i.clear();
        return r && Je(
          i,
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
  ].forEach((i) => {
    n[i] = Lr(i, e, t);
  }), n;
}
function us(e, t) {
  const n = jr(e, t);
  return (s, i, r) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? s : Reflect.get(
    q(n, i) && i in s ? n : s,
    i,
    r
  );
}
const Nr = {
  get: /* @__PURE__ */ us(!1, !1)
}, Hr = {
  get: /* @__PURE__ */ us(!1, !0)
}, kr = {
  get: /* @__PURE__ */ us(!0, !1)
};
const yi = /* @__PURE__ */ new WeakMap(), _i = /* @__PURE__ */ new WeakMap(), xi = /* @__PURE__ */ new WeakMap(), Kr = /* @__PURE__ */ new WeakMap();
function Vr(e) {
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
function as(e) {
  return /* @__PURE__ */ Ke(e) ? e : ds(
    e,
    !1,
    $r,
    Nr,
    yi
  );
}
// @__NO_SIDE_EFFECTS__
function Ur(e) {
  return ds(
    e,
    !1,
    Dr,
    Hr,
    _i
  );
}
// @__NO_SIDE_EFFECTS__
function Jn(e) {
  return ds(
    e,
    !0,
    Fr,
    kr,
    xi
  );
}
function ds(e, t, n, s, i) {
  if (!Z(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const r = i.get(e);
  if (r)
    return r;
  const l = Vr(hr(e));
  if (l === 0)
    return e;
  const o = new Proxy(
    e,
    l === 2 ? s : n
  );
  return i.set(e, o), o;
}
// @__NO_SIDE_EFFECTS__
function ct(e) {
  return /* @__PURE__ */ Ke(e) ? /* @__PURE__ */ ct(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Ke(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Me(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function hs(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function z(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ z(t) : e;
}
function Br(e) {
  return !q(e, "__v_skip") && Object.isExtensible(e) && ii(e, "__v_skip", !0), e;
}
const Ae = (e) => Z(e) ? /* @__PURE__ */ as(e) : e, ut = (e) => Z(e) ? /* @__PURE__ */ Jn(e) : e;
// @__NO_SIDE_EFFECTS__
function he(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function ne(e) {
  return Si(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Wr(e) {
  return Si(e, !0);
}
function Si(e, t) {
  return /* @__PURE__ */ he(e) ? e : new zr(e, t);
}
class zr {
  constructor(t, n) {
    this.dep = new cs(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : /* @__PURE__ */ z(t), this._value = n ? t : Ae(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || /* @__PURE__ */ Me(t) || /* @__PURE__ */ Ke(t);
    t = s ? t : /* @__PURE__ */ z(t), Ne(t, n) && (this._rawValue = t, this._value = s ? t : Ae(t), this.dep.trigger());
  }
}
function wi(e) {
  return /* @__PURE__ */ he(e) ? e.value : e;
}
const qr = {
  get: (e, t, n) => t === "__v_raw" ? e : wi(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const i = e[t];
    return /* @__PURE__ */ he(i) && !/* @__PURE__ */ he(n) ? (i.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function Ci(e) {
  return /* @__PURE__ */ ct(e) ? e : new Proxy(e, qr);
}
class Gr {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new cs(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Vt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    ee !== this)
      return ui(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return hi(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function Jr(e, t, n = !1) {
  let s, i;
  return j(e) ? s = e : (s = e.get, i = e.set), new Gr(s, i, n);
}
const sn = {}, hn = /* @__PURE__ */ new WeakMap();
let pt;
function Yr(e, t = !1, n = pt) {
  if (n) {
    let s = hn.get(n);
    s || hn.set(n, s = []), s.push(e);
  }
}
function Xr(e, t, n = Q) {
  const { immediate: s, deep: i, once: r, scheduler: l, augmentJob: o, call: c } = n, p = (I) => i ? I : /* @__PURE__ */ Me(I) || i === !1 || i === 0 ? Ye(I, 1) : Ye(I);
  let h, g, E, P, U = !1, w = !1;
  if (/* @__PURE__ */ he(e) ? (g = () => e.value, U = /* @__PURE__ */ Me(e)) : /* @__PURE__ */ ct(e) ? (g = () => p(e), U = !0) : D(e) ? (w = !0, U = e.some((I) => /* @__PURE__ */ ct(I) || /* @__PURE__ */ Me(I)), g = () => e.map((I) => {
    if (/* @__PURE__ */ he(I))
      return I.value;
    if (/* @__PURE__ */ ct(I))
      return p(I);
    if (j(I))
      return c ? c(I, 2) : I();
  })) : j(e) ? t ? g = c ? () => c(e, 2) : e : g = () => {
    if (E) {
      Ze();
      try {
        E();
      } finally {
        Qe();
      }
    }
    const I = pt;
    pt = h;
    try {
      return c ? c(e, 3, [P]) : e(P);
    } finally {
      pt = I;
    }
  } : g = He, t && i) {
    const I = g, N = i === !0 ? 1 / 0 : i;
    g = () => Ye(I(), N);
  }
  const F = Tr(), L = () => {
    h.stop(), F && F.active && ss(F.effects, h);
  };
  if (r && t) {
    const I = t;
    t = (...N) => {
      const le = I(...N);
      return L(), le;
    };
  }
  let V = w ? new Array(e.length).fill(sn) : sn;
  const K = (I) => {
    if (!(!(h.flags & 1) || !h.dirty && !I))
      if (t) {
        const N = h.run();
        if (I || i || U || (w ? N.some((le, se) => Ne(le, V[se])) : Ne(N, V))) {
          E && E();
          const le = pt;
          pt = h;
          try {
            const se = [
              N,
              // pass undefined as the old value when it's changed for the first time
              V === sn ? void 0 : w && V[0] === sn ? [] : V,
              P
            ];
            V = N, c ? c(t, 3, se) : (
              // @ts-expect-error
              t(...se)
            );
          } finally {
            pt = le;
          }
        }
      } else
        h.run();
  };
  return o && o(K), h = new fi(g), h.scheduler = l ? () => l(K, !1) : K, P = (I) => Yr(I, !1, h), E = h.onStop = () => {
    const I = hn.get(h);
    if (I) {
      if (c)
        c(I, 4);
      else
        for (const N of I) N();
      hn.delete(h);
    }
  }, t ? s ? K(!0) : V = h.run() : l ? l(K.bind(null, !0), !0) : h.run(), L.pause = h.pause.bind(h), L.resume = h.resume.bind(h), L.stop = L, L;
}
function Ye(e, t = 1 / 0, n) {
  if (t <= 0 || !Z(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, /* @__PURE__ */ he(e))
    Ye(e.value, t, n);
  else if (D(e))
    for (let s = 0; s < e.length; s++)
      Ye(e[s], t, n);
  else if (dn(e) || ft(e))
    e.forEach((s) => {
      Ye(s, t, n);
    });
  else if (ni(e)) {
    for (const s in e)
      Ye(e[s], t, n);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && Ye(e[s], t, n);
  }
  return e;
}
function Jt(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (i) {
    Mn(i, t, n);
  }
}
function $e(e, t, n, s) {
  if (j(e)) {
    const i = Jt(e, t, n, s);
    return i && ei(i) && i.catch((r) => {
      Mn(r, t, n);
    }), i;
  }
  if (D(e)) {
    const i = [];
    for (let r = 0; r < e.length; r++)
      i.push($e(e[r], t, n, s));
    return i;
  }
}
function Mn(e, t, n, s = !0) {
  const i = t ? t.vnode : null, { errorHandler: r, throwUnhandledErrorInProduction: l } = t && t.appContext.config || Q;
  if (t) {
    let o = t.parent;
    const c = t.proxy, p = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; o; ) {
      const h = o.ec;
      if (h) {
        for (let g = 0; g < h.length; g++)
          if (h[g](e, c, p) === !1)
            return;
      }
      o = o.parent;
    }
    if (r) {
      Ze(), Jt(r, null, 10, [
        e,
        c,
        p
      ]), Qe();
      return;
    }
  }
  Zr(e, n, i, s, l);
}
function Zr(e, t, n, s = !0, i = !1) {
  if (i)
    throw e;
  console.error(e);
}
const ge = [];
let De = -1;
const Tt = [];
let lt = null, wt = 0;
const Ti = /* @__PURE__ */ Promise.resolve();
let pn = null;
function Ei(e) {
  const t = pn || Ti;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Qr(e) {
  let t = De + 1, n = ge.length;
  for (; t < n; ) {
    const s = t + n >>> 1, i = ge[s], r = Bt(i);
    r < e || r === e && i.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function ps(e) {
  if (!(e.flags & 1)) {
    const t = Bt(e), n = ge[ge.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Bt(n) ? ge.push(e) : ge.splice(Qr(t), 0, e), e.flags |= 1, Mi();
  }
}
function Mi() {
  pn || (pn = Ti.then(Oi));
}
function el(e) {
  if (!D(e))
    lt && e.id === -1 ? lt.splice(wt + 1, 0, e) : e.flags & 1 || (Tt.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      Tt.push(e[t]);
  Mi();
}
function Ms(e, t, n = De + 1) {
  for (; n < ge.length; n++) {
    const s = ge[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid)
        continue;
      ge.splice(n, 1), n--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2);
    }
  }
}
function Ai(e) {
  if (Tt.length) {
    const t = [...new Set(Tt)].sort(
      (n, s) => Bt(n) - Bt(s)
    );
    if (Tt.length = 0, lt) {
      for (let n = 0; n < t.length; n++)
        lt.push(t[n]);
      return;
    }
    for (lt = t, wt = 0; wt < lt.length; wt++) {
      const n = lt[wt];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    lt = null, wt = 0;
  }
}
const Bt = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Oi(e) {
  try {
    for (De = 0; De < ge.length; De++) {
      const t = ge[De];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), Jt(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; De < ge.length; De++) {
      const t = ge[De];
      t && (t.flags &= -2);
    }
    De = -1, ge.length = 0, Ai(), pn = null, (ge.length || Tt.length) && Oi();
  }
}
let Ee = null, Pi = null;
function gn(e) {
  const t = Ee;
  return Ee = e, Pi = e && e.type.__scopeId || null, t;
}
function tl(e, t = Ee, n) {
  if (!t || e._n)
    return e;
  const s = (...i) => {
    s._d && Ns(-1);
    const r = gn(t), l = bt.length;
    let o;
    try {
      o = e(...i);
    } finally {
      for (let c = bt.length; c > l; c--) tr();
      gn(r), s._d && Ns(1);
    }
    return o;
  };
  return s._n = !0, s._c = !0, s._d = !0, s;
}
function nl(e, t) {
  if (Ee === null)
    return e;
  const n = Rn(Ee), s = e.dirs || (e.dirs = []);
  for (let i = 0; i < t.length; i++) {
    let [r, l, o, c = Q] = t[i];
    r && (j(r) && (r = {
      mounted: r,
      updated: r
    }), r.deep && Ye(l), s.push({
      dir: r,
      instance: n,
      value: l,
      oldValue: void 0,
      arg: o,
      modifiers: c
    }));
  }
  return e;
}
function dt(e, t, n, s) {
  const i = e.dirs, r = t && t.dirs;
  for (let l = 0; l < i.length; l++) {
    const o = i[l];
    r && (o.oldValue = r[l].value);
    let c = o.dir[s];
    c && (Ze(), $e(c, n, 8, [
      e.el,
      o,
      e,
      t
    ]), Qe());
  }
}
function sl(e, t) {
  if (me) {
    let n = me.provides;
    const s = me.parent && me.parent.provides;
    s === n && (n = me.provides = Object.create(s)), n[e] = t;
  }
}
function cn(e, t, n = !1) {
  const s = Zl();
  if (s || Et) {
    let i = Et ? Et._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (i && e in i)
      return i[e];
    if (arguments.length > 1)
      return n && j(t) ? t.call(s && s.proxy) : t;
  }
}
const il = /* @__PURE__ */ Symbol.for("v-scx"), rl = () => cn(il);
function un(e, t, n) {
  return Ii(e, t, n);
}
function Ii(e, t, n = Q) {
  const { immediate: s, deep: i, flush: r, once: l } = n, o = ue({}, n), c = t && s || !t && r !== "post";
  let p;
  if (qt) {
    if (r === "sync") {
      const P = rl();
      p = P.__watcherHandles || (P.__watcherHandles = []);
    } else if (!c) {
      const P = () => {
      };
      return P.stop = He, P.resume = He, P.pause = He, P;
    }
  }
  const h = me;
  o.call = (P, U, w) => $e(P, h, U, w);
  let g = !1;
  r === "post" ? o.scheduler = (P) => {
    ye(P, h && h.suspense);
  } : r !== "sync" && (g = !0, o.scheduler = (P, U) => {
    U ? P() : ps(P);
  }), o.augmentJob = (P) => {
    t && (P.flags |= 4), g && (P.flags |= 2, h && (P.id = h.uid, P.i = h));
  };
  const E = Xr(e, t, o);
  return qt && (p ? p.push(E) : c && E()), E;
}
function ll(e, t, n) {
  const s = this.proxy, i = te(e) ? e.includes(".") ? Ri(s, e) : () => s[e] : e.bind(s, s);
  let r;
  j(t) ? r = t : (r = t.handler, n = t);
  const l = Yt(this), o = Ii(i, r.bind(s), n);
  return l(), o;
}
function Ri(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let i = 0; i < n.length && s; i++)
      s = s[n[i]];
    return s;
  };
}
const ol = /* @__PURE__ */ Symbol("_vte"), An = (e) => e.__isTeleport, Nn = /* @__PURE__ */ Symbol("_leaveCb");
function fl(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const n of e)
      if (n.type !== et) {
        t = n;
        break;
      }
  }
  return t;
}
function $i(e) {
  if (!ms(e))
    return An(e.type) && e.children ? fl(e.children) : e;
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
function gs(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const n = e.component.subTree;
    gs(
      An(n.type) && $i(n) || n,
      t
    );
  } else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function Fi(e, t) {
  return j(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    ue({ name: e.name }, t, { setup: e })
  ) : e;
}
function Di(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function As(e, t) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
const mn = /* @__PURE__ */ new WeakMap();
function Ht(e, t, n, s, i = !1) {
  if (D(e)) {
    e.forEach(
      (w, F) => Ht(
        w,
        t && (D(t) ? t[F] : t),
        n,
        s,
        i
      )
    );
    return;
  }
  if (kt(s) && !i) {
    s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && Ht(e, t, n, s.component.subTree);
    return;
  }
  const r = s.shapeFlag & 4 ? Rn(s.component) : s.el, l = i ? null : r, { i: o, r: c } = e, p = t && t.r, h = o.refs === Q ? o.refs = {} : o.refs, g = o.setupState, E = /* @__PURE__ */ z(g), P = g === Q ? Qs : (w) => As(h, w) ? !1 : q(E, w), U = (w, F) => !(F && As(h, F));
  if (p != null && p !== c) {
    if (Os(t), te(p))
      h[p] = null, P(p) && (g[p] = null);
    else if (/* @__PURE__ */ he(p)) {
      const w = t;
      U(p, w.k) && (p.value = null), w.k && (h[w.k] = null);
    }
  }
  if (j(c))
    Jt(c, o, 12, [l, h]);
  else {
    const w = te(c), F = /* @__PURE__ */ he(c);
    if (w || F) {
      const L = () => {
        if (e.f) {
          const V = w ? P(c) ? g[c] : h[c] : U() || !e.k ? c.value : h[e.k];
          if (i)
            D(V) && ss(V, r);
          else if (D(V))
            V.includes(r) || V.push(r);
          else if (w)
            h[c] = [r], P(c) && (g[c] = h[c]);
          else {
            const K = [r];
            U(c, e.k) && (c.value = K), e.k && (h[e.k] = K);
          }
        } else w ? (h[c] = l, P(c) && (g[c] = l)) : F && (U(c, e.k) && (c.value = l), e.k && (h[e.k] = l));
      };
      if (l) {
        const V = () => {
          L(), mn.delete(e);
        };
        V.id = -1, mn.set(e, V), ye(V, n);
      } else
        Os(e), L();
    }
  }
}
function Os(e) {
  const t = mn.get(e);
  t && (t.flags |= 8, mn.delete(e));
}
Cn().requestIdleCallback;
Cn().cancelIdleCallback;
const kt = (e) => !!e.type.__asyncLoader, ms = (e) => e.type.__isKeepAlive;
function cl(e, t) {
  Li(e, "a", t);
}
function ul(e, t) {
  Li(e, "da", t);
}
function Li(e, t, n = me) {
  const s = e.__wdc || (e.__wdc = () => {
    let i = n;
    for (; i; ) {
      if (i.isDeactivated)
        return;
      i = i.parent;
    }
    return e();
  });
  if (On(t, s, n), n) {
    let i = n.parent;
    for (; i && i.parent; )
      ms(i.parent.vnode) && al(s, t, n, i), i = i.parent;
  }
}
function al(e, t, n, s) {
  const i = On(
    t,
    e,
    s,
    !0
    /* prepend */
  );
  ji(() => {
    ss(s[t], i);
  }, n);
}
function On(e, t, n = me, s = !1) {
  if (n) {
    const i = n[e] || (n[e] = []), r = t.__weh || (t.__weh = (...l) => {
      Ze();
      const o = Yt(n), c = $e(t, n, e, l);
      return o(), Qe(), c;
    });
    return s ? i.unshift(r) : i.push(r), r;
  }
}
const tt = (e) => (t, n = me) => {
  (!qt || e === "sp") && On(e, (...s) => t(...s), n);
}, dl = tt("bm"), vs = tt("m"), hl = tt(
  "bu"
), pl = tt("u"), bs = tt(
  "bum"
), ji = tt("um"), gl = tt(
  "sp"
), ml = tt("rtg"), vl = tt("rtc");
function bl(e, t = me) {
  On("ec", e, t);
}
const yl = /* @__PURE__ */ Symbol.for("v-ndc");
function Yn(e, t, n, s) {
  let i;
  const r = n, l = D(e);
  if (l || te(e)) {
    const o = l && /* @__PURE__ */ ct(e);
    let c = !1, p = !1;
    o && (c = !/* @__PURE__ */ Me(e), p = /* @__PURE__ */ Ke(e), e = En(e)), i = new Array(e.length);
    for (let h = 0, g = e.length; h < g; h++)
      i[h] = t(
        c ? p ? ut(Ae(e[h])) : Ae(e[h]) : e[h],
        h,
        void 0,
        r
      );
  } else if (typeof e == "number") {
    i = new Array(e);
    for (let o = 0; o < e; o++)
      i[o] = t(o + 1, o, void 0, r);
  } else if (Z(e))
    if (e[Symbol.iterator])
      i = Array.from(
        e,
        (o, c) => t(o, c, void 0, r)
      );
    else {
      const o = Object.keys(e);
      i = new Array(o.length);
      for (let c = 0, p = o.length; c < p; c++) {
        const h = o[c];
        i[c] = t(e[h], h, c, r);
      }
    }
  else
    i = [];
  return i;
}
const Xn = (e) => e ? lr(e) ? Rn(e) : Xn(e.parent) : null, Kt = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ ue(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => Xn(e.parent),
    $root: (e) => Xn(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => Hi(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      ps(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = Ei.bind(e.proxy)),
    $watch: (e) => ll.bind(e)
  })
), Hn = (e, t) => e !== Q && !e.__isScriptSetup && q(e, t), _l = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: s, data: i, props: r, accessCache: l, type: o, appContext: c } = e;
    if (t[0] !== "$") {
      const E = l[t];
      if (E !== void 0)
        switch (E) {
          case 1:
            return s[t];
          case 2:
            return i[t];
          case 4:
            return n[t];
          case 3:
            return r[t];
        }
      else {
        if (Hn(s, t))
          return l[t] = 1, s[t];
        if (i !== Q && q(i, t))
          return l[t] = 2, i[t];
        if (q(r, t))
          return l[t] = 3, r[t];
        if (n !== Q && q(n, t))
          return l[t] = 4, n[t];
        Zn && (l[t] = 0);
      }
    }
    const p = Kt[t];
    let h, g;
    if (p)
      return t === "$attrs" && de(e.attrs, "get", ""), p(e);
    if (
      // css module (injected by vue-loader)
      (h = o.__cssModules) && (h = h[t])
    )
      return h;
    if (n !== Q && q(n, t))
      return l[t] = 4, n[t];
    if (
      // global properties
      g = c.config.globalProperties, q(g, t)
    )
      return g[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: i, ctx: r } = e;
    return Hn(i, t) ? (i[t] = n, !0) : s !== Q && q(s, t) ? (s[t] = n, !0) : q(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (r[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: i, props: r, type: l }
  }, o) {
    let c;
    return !!(n[o] || e !== Q && o[0] !== "$" && q(e, o) || Hn(t, o) || q(r, o) || q(s, o) || q(Kt, o) || q(i.config.globalProperties, o) || (c = l.__cssModules) && c[o]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : q(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function Ps(e) {
  return D(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let Zn = !0;
function xl(e) {
  const t = Hi(e), n = e.proxy, s = e.ctx;
  Zn = !1, t.beforeCreate && Is(t.beforeCreate, e, "bc");
  const {
    // state
    data: i,
    computed: r,
    methods: l,
    watch: o,
    provide: c,
    inject: p,
    // lifecycle
    created: h,
    beforeMount: g,
    mounted: E,
    beforeUpdate: P,
    updated: U,
    activated: w,
    deactivated: F,
    beforeDestroy: L,
    beforeUnmount: V,
    destroyed: K,
    unmounted: I,
    render: N,
    renderTracked: le,
    renderTriggered: se,
    errorCaptured: Se,
    serverPrefetch: nt,
    // public API
    expose: G,
    inheritAttrs: re,
    // assets
    components: Oe,
    directives: Ve,
    filters: st
  } = t;
  if (p && Sl(p, s, null), l)
    for (const B in l) {
      const W = l[B];
      j(W) && (s[B] = W.bind(n));
    }
  if (i) {
    const B = i.call(n, n);
    Z(B) && (e.data = /* @__PURE__ */ as(B));
  }
  if (Zn = !0, r)
    for (const B in r) {
      const W = r[B], Ue = j(W) ? W.bind(n, n) : j(W.get) ? W.get.bind(n, n) : He, _t = !j(W) && j(W.set) ? W.set.bind(n) : He, Pe = mt({
        get: Ue,
        set: _t
      });
      Object.defineProperty(s, B, {
        enumerable: !0,
        configurable: !0,
        get: () => Pe.value,
        set: (ve) => Pe.value = ve
      });
    }
  if (o)
    for (const B in o)
      Ni(o[B], s, n, B);
  if (c) {
    const B = j(c) ? c.call(n) : c;
    Reflect.ownKeys(B).forEach((W) => {
      sl(W, B[W]);
    });
  }
  h && Is(h, e, "c");
  function oe(B, W) {
    D(W) ? W.forEach((Ue) => B(Ue.bind(n))) : W && B(W.bind(n));
  }
  if (oe(dl, g), oe(vs, E), oe(hl, P), oe(pl, U), oe(cl, w), oe(ul, F), oe(bl, Se), oe(vl, le), oe(ml, se), oe(bs, V), oe(ji, I), oe(gl, nt), D(G))
    if (G.length) {
      const B = e.exposed || (e.exposed = {});
      G.forEach((W) => {
        Object.defineProperty(B, W, {
          get: () => n[W],
          set: (Ue) => n[W] = Ue,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  N && e.render === He && (e.render = N), re != null && (e.inheritAttrs = re), Oe && (e.components = Oe), Ve && (e.directives = Ve), nt && Di(e);
}
function Sl(e, t, n = He) {
  D(e) && (e = Qn(e));
  for (const s in e) {
    const i = e[s];
    let r;
    Z(i) ? "default" in i ? r = cn(
      i.from || s,
      i.default,
      !0
    ) : r = cn(i.from || s) : r = cn(i), /* @__PURE__ */ he(r) ? Object.defineProperty(t, s, {
      enumerable: !0,
      configurable: !0,
      get: () => r.value,
      set: (l) => r.value = l
    }) : t[s] = r;
  }
}
function Is(e, t, n) {
  $e(
    D(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function Ni(e, t, n, s) {
  let i = s.includes(".") ? Ri(n, s) : () => n[s];
  if (te(e)) {
    const r = t[e];
    j(r) && un(i, r);
  } else if (j(e))
    un(i, e.bind(n));
  else if (Z(e))
    if (D(e))
      e.forEach((r) => Ni(r, t, n, s));
    else {
      const r = j(e.handler) ? e.handler.bind(n) : t[e.handler];
      j(r) && un(i, r, e);
    }
}
function Hi(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: i,
    optionsCache: r,
    config: { optionMergeStrategies: l }
  } = e.appContext, o = r.get(t);
  let c;
  return o ? c = o : !i.length && !n && !s ? c = t : (c = {}, i.length && i.forEach(
    (p) => vn(c, p, l, !0)
  ), vn(c, t, l)), Z(t) && r.set(t, c), c;
}
function vn(e, t, n, s = !1) {
  const { mixins: i, extends: r } = t;
  r && vn(e, r, n, !0), i && i.forEach(
    (l) => vn(e, l, n, !0)
  );
  for (const l in t)
    if (!(s && l === "expose")) {
      const o = wl[l] || n && n[l];
      e[l] = o ? o(e[l], t[l]) : t[l];
    }
  return e;
}
const wl = {
  data: Rs,
  props: $s,
  emits: $s,
  // objects
  methods: Ft,
  computed: Ft,
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
  components: Ft,
  directives: Ft,
  // watch
  watch: Tl,
  // provide / inject
  provide: Rs,
  inject: Cl
};
function Rs(e, t) {
  return t ? e ? function() {
    return ue(
      j(e) ? e.call(this, this) : e,
      j(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function Cl(e, t) {
  return Ft(Qn(e), Qn(t));
}
function Qn(e) {
  if (D(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function pe(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Ft(e, t) {
  return e ? ue(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function $s(e, t) {
  return e ? D(e) && D(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : ue(
    /* @__PURE__ */ Object.create(null),
    Ps(e),
    Ps(t ?? {})
  ) : t;
}
function Tl(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = ue(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = pe(e[s], t[s]);
  return n;
}
function ki() {
  return {
    app: null,
    config: {
      isNativeTag: Qs,
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
let El = 0;
function Ml(e, t) {
  return function(s, i = null) {
    j(s) || (s = ue({}, s)), i != null && !Z(i) && (i = null);
    const r = ki(), l = /* @__PURE__ */ new WeakSet(), o = [];
    let c = !1;
    const p = r.app = {
      _uid: El++,
      _component: s,
      _props: i,
      _container: null,
      _context: r,
      _instance: null,
      version: io,
      get config() {
        return r.config;
      },
      set config(h) {
      },
      use(h, ...g) {
        return l.has(h) || (h && j(h.install) ? (l.add(h), h.install(p, ...g)) : j(h) && (l.add(h), h(p, ...g))), p;
      },
      mixin(h) {
        return r.mixins.includes(h) || r.mixins.push(h), p;
      },
      component(h, g) {
        return g ? (r.components[h] = g, p) : r.components[h];
      },
      directive(h, g) {
        return g ? (r.directives[h] = g, p) : r.directives[h];
      },
      mount(h, g, E) {
        if (!c) {
          const P = p._ceVNode || Xe(s, i);
          return P.appContext = r, E === !0 ? E = "svg" : E === !1 && (E = void 0), e(P, h, E), c = !0, p._container = h, h.__vue_app__ = p, Rn(P.component);
        }
      },
      onUnmount(h) {
        o.push(h);
      },
      unmount() {
        c && ($e(
          o,
          p._instance,
          16
        ), e(null, p._container), delete p._container.__vue_app__);
      },
      provide(h, g) {
        return r.provides[h] = g, p;
      },
      runWithContext(h) {
        const g = Et;
        Et = p;
        try {
          return h();
        } finally {
          Et = g;
        }
      }
    };
    return p;
  };
}
let Et = null;
const Al = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Ie(t)}Modifiers`] || e[`${yt(t)}Modifiers`];
function Ol(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || Q;
  let i = n;
  const r = t.startsWith("update:"), l = r && Al(s, t.slice(7));
  l && (l.trim && (i = n.map((h) => te(h) ? h.trim() : h)), l.number && (i = i.map(rs)));
  let o, c = s[o = $n(t)] || // also try camelCase event handler (#2249)
  s[o = $n(Ie(t))];
  !c && r && (c = s[o = $n(yt(t))]), c && $e(
    c,
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
    e.emitted[o] = !0, $e(
      p,
      e,
      6,
      i
    );
  }
}
const Pl = /* @__PURE__ */ new WeakMap();
function Ki(e, t, n = !1) {
  const s = n ? Pl : t.emitsCache, i = s.get(e);
  if (i !== void 0)
    return i;
  const r = e.emits;
  let l = {}, o = !1;
  if (!j(e)) {
    const c = (p) => {
      const h = Ki(p, t, !0);
      h && (o = !0, ue(l, h));
    };
    !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  return !r && !o ? (Z(e) && s.set(e, null), null) : (D(r) ? r.forEach((c) => l[c] = null) : ue(l, r), Z(e) && s.set(e, l), l);
}
function Pn(e, t) {
  return !e || !xn(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), q(e, t[0].toLowerCase() + t.slice(1)) || q(e, yt(t)) || q(e, t));
}
function Fs(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: i,
    propsOptions: [r],
    slots: l,
    attrs: o,
    emit: c,
    render: p,
    renderCache: h,
    props: g,
    data: E,
    setupState: P,
    ctx: U,
    inheritAttrs: w
  } = e, F = gn(e);
  let L, V;
  try {
    if (n.shapeFlag & 4) {
      const I = i || s, N = I;
      L = je(
        p.call(
          N,
          I,
          h,
          g,
          P,
          E,
          U
        )
      ), V = o;
    } else {
      const I = t;
      L = je(
        I.length > 1 ? I(
          g,
          { attrs: o, slots: l, emit: c }
        ) : I(
          g,
          null
        )
      ), V = t.props ? o : Il(o);
    }
  } catch (I) {
    bt.length = 0, Mn(I, e, 1), L = Xe(et);
  }
  let K = L;
  if (V && w !== !1) {
    const I = Object.keys(V), { shapeFlag: N } = K;
    I.length && N & 7 && (r && I.some(Sn) && (V = Rl(
      V,
      r
    )), K = At(K, V, !1, !0));
  }
  if (n.dirs && (K = At(K, null, !1, !0), K.dirs = K.dirs ? K.dirs.concat(n.dirs) : n.dirs), n.transition) {
    const I = An(K.type) && $i(K) || K;
    gs(I, n.transition);
  }
  return L = K, gn(F), L;
}
const Il = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || xn(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, Rl = (e, t) => {
  const n = {};
  for (const s in e)
    (!Sn(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function $l(e, t, n) {
  const { props: s, children: i, component: r } = e, { props: l, children: o, patchFlag: c } = t, p = r.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && c >= 0) {
    if (c & 1024)
      return !0;
    if (c & 16)
      return s ? Ds(s, l, p) : !!l;
    if (c & 8) {
      const h = t.dynamicProps;
      for (let g = 0; g < h.length; g++) {
        const E = h[g];
        if (Vi(l, s, E) && !Pn(p, E))
          return !0;
      }
    }
  } else
    return (i || o) && (!o || !o.$stable) ? !0 : s === l ? !1 : s ? l ? Ds(s, l, p) : !0 : !!l;
  return !1;
}
function Ds(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let i = 0; i < s.length; i++) {
    const r = s[i];
    if (Vi(t, e, r) && !Pn(n, r))
      return !0;
  }
  return !1;
}
function Vi(e, t, n) {
  const s = e[n], i = t[n];
  return n === "style" && Z(s) && Z(i) ? !Tn(s, i) : s !== i;
}
function Fl({ vnode: e, parent: t, suspense: n }, s) {
  for (; t; ) {
    const i = t.subTree;
    if (i.suspense && i.suspense.activeBranch === e && (i.suspense.vnode.el = i.el = s, e = i), i === e)
      (e = t.vnode).el = s, t = t.parent;
    else
      break;
  }
  n && n.activeBranch === e && (n.vnode.el = s);
}
const Ui = {}, Bi = () => Object.create(Ui), Wi = (e) => Object.getPrototypeOf(e) === Ui;
function Dl(e, t, n, s = !1) {
  const i = {}, r = Bi();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), zi(e, t, i, r);
  for (const l in e.propsOptions[0])
    l in i || (i[l] = void 0);
  n ? e.props = s ? i : /* @__PURE__ */ Ur(i) : e.type.props ? e.props = i : e.props = r, e.attrs = r;
}
function Ll(e, t, n, s) {
  const {
    props: i,
    attrs: r,
    vnode: { patchFlag: l }
  } = e, o = /* @__PURE__ */ z(i), [c] = e.propsOptions;
  let p = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (s || l > 0) && !(l & 16)
  ) {
    if (l & 8) {
      const h = e.vnode.dynamicProps;
      for (let g = 0; g < h.length; g++) {
        let E = h[g];
        if (Pn(e.emitsOptions, E))
          continue;
        const P = t[E];
        if (c)
          if (q(r, E))
            P !== r[E] && (r[E] = P, p = !0);
          else {
            const U = Ie(E);
            i[U] = es(
              c,
              o,
              U,
              P,
              e,
              !1
            );
          }
        else
          P !== r[E] && (r[E] = P, p = !0);
      }
    }
  } else {
    zi(e, t, i, r) && (p = !0);
    let h;
    for (const g in o)
      (!t || // for camelCase
      !q(t, g) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((h = yt(g)) === g || !q(t, h))) && (c ? n && // for camelCase
      (n[g] !== void 0 || // for kebab-case
      n[h] !== void 0) && (i[g] = es(
        c,
        o,
        g,
        void 0,
        e,
        !0
      )) : delete i[g]);
    if (r !== o)
      for (const g in r)
        (!t || !q(t, g)) && (delete r[g], p = !0);
  }
  p && Je(e.attrs, "set", "");
}
function zi(e, t, n, s) {
  const [i, r] = e.propsOptions;
  let l = !1, o;
  if (t)
    for (let c in t) {
      if (Lt(c))
        continue;
      const p = t[c];
      let h;
      i && q(i, h = Ie(c)) ? !r || !r.includes(h) ? n[h] = p : (o || (o = {}))[h] = p : Pn(e.emitsOptions, c) || (!(c in s) || p !== s[c]) && (s[c] = p, l = !0);
    }
  if (r) {
    const c = /* @__PURE__ */ z(n), p = o || Q;
    for (let h = 0; h < r.length; h++) {
      const g = r[h];
      n[g] = es(
        i,
        c,
        g,
        p[g],
        e,
        !q(p, g)
      );
    }
  }
  return l;
}
function es(e, t, n, s, i, r) {
  const l = e[n];
  if (l != null) {
    const o = q(l, "default");
    if (o && s === void 0) {
      const c = l.default;
      if (l.type !== Function && !l.skipFactory && j(c)) {
        const { propsDefaults: p } = i;
        if (n in p)
          s = p[n];
        else {
          const h = Yt(i);
          s = p[n] = c.call(
            null,
            t
          ), h();
        }
      } else
        s = c;
      i.ce && i.ce._setProp(n, s);
    }
    l[
      0
      /* shouldCast */
    ] && (r && !o ? s = !1 : l[
      1
      /* shouldCastTrue */
    ] && (s === "" || s === yt(n)) && (s = !0));
  }
  return s;
}
const jl = /* @__PURE__ */ new WeakMap();
function qi(e, t, n = !1) {
  const s = n ? jl : t.propsCache, i = s.get(e);
  if (i)
    return i;
  const r = e.props, l = {}, o = [];
  let c = !1;
  if (!j(e)) {
    const h = (g) => {
      c = !0;
      const [E, P] = qi(g, t, !0);
      ue(l, E), P && o.push(...P);
    };
    !n && t.mixins.length && t.mixins.forEach(h), e.extends && h(e.extends), e.mixins && e.mixins.forEach(h);
  }
  if (!r && !c)
    return Z(e) && s.set(e, gt), gt;
  if (D(r))
    for (let h = 0; h < r.length; h++) {
      const g = Ie(r[h]);
      Ls(g) && (l[g] = Q);
    }
  else if (r)
    for (const h in r) {
      const g = Ie(h);
      if (Ls(g)) {
        const E = r[h], P = l[g] = D(E) || j(E) ? { type: E } : ue({}, E), U = P.type;
        let w = !1, F = !0;
        if (D(U))
          for (let L = 0; L < U.length; ++L) {
            const V = U[L], K = j(V) && V.name;
            if (K === "Boolean") {
              w = !0;
              break;
            } else K === "String" && (F = !1);
          }
        else
          w = j(U) && U.name === "Boolean";
        P[
          0
          /* shouldCast */
        ] = w, P[
          1
          /* shouldCastTrue */
        ] = F, (w || q(P, "default")) && o.push(g);
      }
    }
  const p = [l, o];
  return Z(e) && s.set(e, p), p;
}
function Ls(e) {
  return e[0] !== "$" && !Lt(e);
}
const ys = (e) => e === "_" || e === "_ctx" || e === "$stable", _s = (e) => D(e) ? e.map(je) : [je(e)], Nl = (e, t, n) => {
  if (t._n)
    return t;
  const s = tl((...i) => _s(t(...i)), n);
  return s._c = !1, s;
}, Gi = (e, t, n) => {
  const s = e._ctx;
  for (const i in e) {
    if (ys(i)) continue;
    const r = e[i];
    if (j(r))
      t[i] = Nl(i, r, s);
    else if (r != null) {
      const l = _s(r);
      t[i] = () => l;
    }
  }
}, Ji = (e, t) => {
  const n = _s(t);
  e.slots.default = () => n;
}, Yi = (e, t, n) => {
  for (const s in t)
    (n || !ys(s)) && (e[s] = t[s]);
}, Hl = (e, t, n) => {
  const s = e.slots = Bi();
  if (e.vnode.shapeFlag & 32) {
    const i = t._;
    i ? (Yi(s, t, n), n && ii(s, "_", i, !0)) : Gi(t, s);
  } else t && Ji(e, t);
}, kl = (e, t, n) => {
  const { vnode: s, slots: i } = e;
  let r = !0, l = Q;
  if (s.shapeFlag & 32) {
    const o = t._;
    o ? n && o === 1 ? r = !1 : Yi(i, t, n) : (r = !t.$stable, Gi(t, i)), l = t;
  } else t && (Ji(e, t), l = { default: 1 });
  if (r)
    for (const o in i)
      !ys(o) && l[o] == null && delete i[o];
}, ye = Wl;
function Kl(e) {
  return Vl(e);
}
function Vl(e, t) {
  const n = Cn();
  n.__VUE__ = !0;
  const {
    insert: s,
    remove: i,
    patchProp: r,
    createElement: l,
    createText: o,
    createComment: c,
    setText: p,
    setElementText: h,
    parentNode: g,
    nextSibling: E,
    setScopeId: P = He,
    insertStaticContent: U
  } = e, w = (f, a, m, _ = null, v = null, b = null, T = void 0, C = null, S = !!a.dynamicChildren) => {
    if (f === a)
      return;
    f && !Rt(f, a) && (_ = at(f), ve(f, v, b, !0), f = null), a.patchFlag === -2 && (S = !1, a.dynamicChildren = null), a.dynamicChildren && f && f.dynamicChildren && f.dynamicChildren.hasOnce && (a.dynamicChildren === gt && (a.dynamicChildren = []), a.dynamicChildren.hasOnce = !0);
    const { type: y, ref: R, shapeFlag: M } = a;
    switch (y) {
      case In:
        F(f, a, m, _);
        break;
      case et:
        L(f, a, m, _);
        break;
      case Kn:
        f == null && V(a, m, _, T);
        break;
      case Ce:
        Oe(
          f,
          a,
          m,
          _,
          v,
          b,
          T,
          C,
          S
        );
        break;
      default:
        M & 1 ? N(
          f,
          a,
          m,
          _,
          v,
          b,
          T,
          C,
          S
        ) : M & 6 ? Ve(
          f,
          a,
          m,
          _,
          v,
          b,
          T,
          C,
          S
        ) : (M & 64 || M & 128) && y.process(
          f,
          a,
          m,
          _,
          v,
          b,
          T,
          C,
          S,
          Be
        );
    }
    R != null && v ? Ht(R, f && f.ref, b, a || f, !a) : R == null && f && f.ref != null && Ht(f.ref, null, b, f, !0);
  }, F = (f, a, m, _) => {
    if (f == null)
      s(
        a.el = o(a.children),
        m,
        _
      );
    else {
      const v = a.el = f.el;
      a.children !== f.children && p(v, a.children);
    }
  }, L = (f, a, m, _) => {
    f == null ? s(
      a.el = c(a.children || ""),
      m,
      _
    ) : a.el = f.el;
  }, V = (f, a, m, _) => {
    [f.el, f.anchor] = U(
      f.children,
      a,
      m,
      _,
      f.el,
      f.anchor
    );
  }, K = ({ el: f, anchor: a }, m, _) => {
    let v;
    for (; f && f !== a; )
      v = E(f), s(f, m, _), f = v;
    s(a, m, _);
  }, I = ({ el: f, anchor: a }) => {
    let m;
    for (; f && f !== a; )
      m = E(f), i(f), f = m;
    i(a);
  }, N = (f, a, m, _, v, b, T, C, S) => {
    if (a.type === "svg" ? T = "svg" : a.type === "math" && (T = "mathml"), f == null)
      le(
        a,
        m,
        _,
        v,
        b,
        T,
        C,
        S
      );
    else {
      const y = f.el && f.el._isVueCE ? f.el : null;
      try {
        y && y._beginPatch(), nt(
          f,
          a,
          v,
          b,
          T,
          C,
          S
        );
      } finally {
        y && y._endPatch();
      }
    }
  }, le = (f, a, m, _, v, b, T, C) => {
    let S, y;
    const { props: R, shapeFlag: M, transition: u, dirs: d } = f;
    if (S = f.el = l(
      f.type,
      b,
      R && R.is,
      R
    ), M & 8 ? h(S, f.children) : M & 16 && Se(
      f.children,
      S,
      null,
      _,
      v,
      kn(f, b),
      T,
      C
    ), d && dt(f, null, _, "created"), se(S, f, f.scopeId, T, _), R) {
      for (const O in R)
        O !== "value" && !Lt(O) && r(S, O, null, R[O], b, _);
      "value" in R && r(S, "value", null, R.value, b), (y = R.onVnodeBeforeMount) && Fe(y, _, f);
    }
    d && dt(f, null, _, "beforeMount");
    const x = Ul(v, u);
    x && u.beforeEnter(S), s(S, a, m), ((y = R && R.onVnodeMounted) || x || d) && ye(() => {
      y && Fe(y, _, f), x && u.enter(S), d && dt(f, null, _, "mounted");
    }, v);
  }, se = (f, a, m, _, v) => {
    if (m && P(f, m), _)
      for (let b = 0; b < _.length; b++)
        P(f, _[b]);
    if (v) {
      let b = v.subTree;
      if (a === b || er(b.type) && (b.ssContent === a || b.ssFallback === a)) {
        const T = v.vnode;
        se(
          f,
          T,
          T.scopeId,
          T.slotScopeIds,
          v.parent
        );
      }
    }
  }, Se = (f, a, m, _, v, b, T, C, S = 0) => {
    for (let y = S; y < f.length; y++) {
      const R = f[y] = C ? Ge(f[y]) : je(f[y]);
      w(
        null,
        R,
        a,
        m,
        _,
        v,
        b,
        T,
        C
      );
    }
  }, nt = (f, a, m, _, v, b, T) => {
    const C = a.el = f.el;
    let { patchFlag: S, dynamicChildren: y, dirs: R } = a;
    S |= f.patchFlag & 16;
    const M = f.props || Q, u = a.props || Q;
    let d;
    if (m && ht(m, !1), (d = u.onVnodeBeforeUpdate) && Fe(d, m, a, f), R && dt(a, f, m, "beforeUpdate"), m && ht(m, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    y && (!f.dynamicChildren || f.dynamicChildren.length !== y.length) && (S = 0, T = !1, y = null), (M.innerHTML && u.innerHTML == null || M.textContent && u.textContent == null) && h(C, ""), y ? G(
      f.dynamicChildren,
      y,
      C,
      m,
      _,
      kn(a, v),
      b
    ) : T || W(
      f,
      a,
      C,
      null,
      m,
      _,
      kn(a, v),
      b,
      !1
    ), S > 0) {
      if (S & 16)
        re(C, M, u, m, v);
      else if (S & 2 && M.class !== u.class && r(C, "class", null, u.class, v), S & 4 && r(C, "style", M.style, u.style, v), S & 8) {
        const x = a.dynamicProps;
        for (let O = 0; O < x.length; O++) {
          const $ = x[O], H = M[$], k = u[$];
          (k !== H || $ === "value") && r(C, $, H, k, v, m);
        }
      }
      S & 1 && f.children !== a.children && h(C, a.children);
    } else !T && y == null && re(C, M, u, m, v);
    ((d = u.onVnodeUpdated) || R) && ye(() => {
      d && Fe(d, m, a, f), R && dt(a, f, m, "updated");
    }, _);
  }, G = (f, a, m, _, v, b, T) => {
    for (let C = 0; C < a.length; C++) {
      const S = f[C], y = a[C], R = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        S.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (S.type === Ce || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Rt(S, y) || // - In the case of a component, it could contain anything.
        S.shapeFlag & 198) ? g(S.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          m
        )
      );
      w(
        S,
        y,
        R,
        null,
        _,
        v,
        b,
        T,
        !0
      );
    }
  }, re = (f, a, m, _, v) => {
    if (a !== m) {
      if (a !== Q)
        for (const b in a)
          !Lt(b) && !(b in m) && r(
            f,
            b,
            a[b],
            null,
            v,
            _
          );
      for (const b in m) {
        if (Lt(b)) continue;
        const T = m[b], C = a[b];
        T !== C && b !== "value" && r(f, b, C, T, v, _);
      }
      "value" in m && r(f, "value", a.value, m.value, v);
    }
  }, Oe = (f, a, m, _, v, b, T, C, S) => {
    const y = a.el = f ? f.el : o(""), R = a.anchor = f ? f.anchor : o("");
    let { patchFlag: M, dynamicChildren: u, slotScopeIds: d } = a;
    d && (C = C ? C.concat(d) : d), f == null ? (s(y, m, _), s(R, m, _), Se(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      a.children || [],
      m,
      R,
      v,
      b,
      T,
      C,
      S
    )) : M > 0 && M & 64 && u && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    f.dynamicChildren && f.dynamicChildren.length === u.length ? (G(
      f.dynamicChildren,
      u,
      m,
      v,
      b,
      T,
      C
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (a.key != null || v && a === v.subTree) && Xi(
      f,
      a,
      !0
      /* shallow */
    )) : W(
      f,
      a,
      m,
      R,
      v,
      b,
      T,
      C,
      S
    );
  }, Ve = (f, a, m, _, v, b, T, C, S) => {
    a.slotScopeIds = C, f == null ? a.shapeFlag & 512 ? v.ctx.activate(
      a,
      m,
      _,
      T,
      S
    ) : st(
      a,
      m,
      _,
      v,
      b,
      T,
      S
    ) : Xt(f, a, S);
  }, st = (f, a, m, _, v, b, T) => {
    const C = f.component = Xl(
      f,
      _,
      v
    );
    if (ms(f) && (C.ctx.renderer = Be), Ql(C, !1, T), C.asyncDep) {
      if (v && v.registerDep(C, oe, T), !f.el) {
        const S = C.subTree = Xe(et);
        L(null, S, a, m), f.placeholder = S.el;
      }
    } else
      oe(
        C,
        f,
        a,
        m,
        v,
        b,
        T
      );
  }, Xt = (f, a, m) => {
    const _ = a.component = f.component;
    if ($l(f, a, m))
      if (_.asyncDep && !_.asyncResolved) {
        a.el = f.el, B(_, a, m);
        return;
      } else
        _.next = a, _.update();
    else
      a.el = f.el, _.vnode = a;
  }, oe = (f, a, m, _, v, b, T) => {
    const C = () => {
      if (f.isMounted) {
        let { next: M, bu: u, u: d, parent: x, vnode: O } = f;
        {
          const Y = Zi(f);
          if (Y) {
            M && (M.el = O.el, B(f, M, T)), Y.asyncDep.then(() => {
              ye(() => {
                f.isUnmounted || y();
              }, v);
            });
            return;
          }
        }
        let $ = M, H;
        ht(f, !1), M ? (M.el = O.el, B(f, M, T)) : M = O, u && fn(u), (H = M.props && M.props.onVnodeBeforeUpdate) && Fe(H, x, M, O), ht(f, !0);
        const k = Fs(f), J = f.subTree;
        f.subTree = k, w(
          J,
          k,
          // parent may have changed if it's in a teleport
          g(J.el),
          // anchor may have changed if it's in a fragment
          at(J),
          f,
          v,
          b
        ), M.el = k.el, $ === null && Fl(f, k.el), d && ye(d, v), (H = M.props && M.props.onVnodeUpdated) && ye(
          () => Fe(H, x, M, O),
          v
        );
      } else {
        let M;
        const { el: u, props: d } = a, { bm: x, m: O, parent: $, root: H, type: k } = f, J = kt(a);
        ht(f, !1), x && fn(x), !J && (M = d && d.onVnodeBeforeMount) && Fe(M, $, a), ht(f, !0);
        {
          H.ce && H.ce._hasShadowRoot() && H.ce._injectChildStyle(
            k,
            f.parent ? f.parent.type : void 0
          );
          const Y = f.subTree = Fs(f);
          w(
            null,
            Y,
            m,
            _,
            f,
            v,
            b
          ), a.el = Y.el;
        }
        if (O && ye(O, v), !J && (M = d && d.onVnodeMounted)) {
          const Y = a;
          ye(
            () => Fe(M, $, Y),
            v
          );
        }
        (a.shapeFlag & 256 || $ && kt($.vnode) && $.vnode.shapeFlag & 256) && f.a && ye(f.a, v), f.isMounted = !0, a = m = _ = null;
      }
    };
    f.scope.on();
    const S = f.effect = new fi(C);
    f.scope.off();
    const y = f.update = S.run.bind(S), R = f.job = S.runIfDirty.bind(S);
    R.i = f, R.id = f.uid, S.scheduler = () => ps(R), ht(f, !0), y();
  }, B = (f, a, m) => {
    a.component = f;
    const _ = f.vnode.props;
    f.vnode = a, f.next = null, Ll(f, a.props, _, m), kl(f, a.children, m), Ze(), Ms(f), Qe();
  }, W = (f, a, m, _, v, b, T, C, S = !1) => {
    const y = f && f.children, R = f ? f.shapeFlag : 0, M = a.children, { patchFlag: u, shapeFlag: d } = a;
    if (u > 0) {
      if (u & 128) {
        _t(
          y,
          M,
          m,
          _,
          v,
          b,
          T,
          C,
          S
        );
        return;
      } else if (u & 256) {
        Ue(
          y,
          M,
          m,
          _,
          v,
          b,
          T,
          C,
          S
        );
        return;
      }
    }
    d & 8 ? (R & 16 && it(y, v, b), M !== y && h(m, M)) : R & 16 ? d & 16 ? _t(
      y,
      M,
      m,
      _,
      v,
      b,
      T,
      C,
      S
    ) : it(y, v, b, !0) : (R & 8 && h(m, ""), d & 16 && Se(
      M,
      m,
      _,
      v,
      b,
      T,
      C,
      S
    ));
  }, Ue = (f, a, m, _, v, b, T, C, S) => {
    f = f || gt, a = a || gt;
    const y = f.length, R = a.length, M = Math.min(y, R);
    let u;
    for (u = 0; u < M; u++) {
      const d = a[u] = S ? Ge(a[u]) : je(a[u]);
      w(
        f[u],
        d,
        m,
        null,
        v,
        b,
        T,
        C,
        S
      );
    }
    y > R ? it(
      f,
      v,
      b,
      !0,
      !1,
      M
    ) : Se(
      a,
      m,
      _,
      v,
      b,
      T,
      C,
      S,
      M
    );
  }, _t = (f, a, m, _, v, b, T, C, S) => {
    let y = 0;
    const R = a.length;
    let M = f.length - 1, u = R - 1;
    for (; y <= M && y <= u; ) {
      const d = f[y], x = a[y] = S ? Ge(a[y]) : je(a[y]);
      if (Rt(d, x))
        w(
          d,
          x,
          m,
          null,
          v,
          b,
          T,
          C,
          S
        );
      else
        break;
      y++;
    }
    for (; y <= M && y <= u; ) {
      const d = f[M], x = a[u] = S ? Ge(a[u]) : je(a[u]);
      if (Rt(d, x))
        w(
          d,
          x,
          m,
          null,
          v,
          b,
          T,
          C,
          S
        );
      else
        break;
      M--, u--;
    }
    if (y > M) {
      if (y <= u) {
        const d = u + 1, x = d < R ? a[d].el : _;
        for (; y <= u; )
          w(
            null,
            a[y] = S ? Ge(a[y]) : je(a[y]),
            m,
            x,
            v,
            b,
            T,
            C,
            S
          ), y++;
      }
    } else if (y > u)
      for (; y <= M; )
        ve(f[y], v, b, !0), y++;
    else {
      const d = y, x = y, O = /* @__PURE__ */ new Map();
      for (y = x; y <= u; y++) {
        const X = a[y] = S ? Ge(a[y]) : je(a[y]);
        X.key != null && O.set(X.key, y);
      }
      let $, H = 0;
      const k = u - x + 1;
      let J = !1, Y = 0;
      const ie = new Array(k);
      for (y = 0; y < k; y++) ie[y] = 0;
      for (y = d; y <= M; y++) {
        const X = f[y];
        if (H >= k) {
          ve(X, v, b, !0);
          continue;
        }
        let fe;
        if (X.key != null)
          fe = O.get(X.key);
        else
          for ($ = x; $ <= u; $++)
            if (ie[$ - x] === 0 && Rt(X, a[$])) {
              fe = $;
              break;
            }
        fe === void 0 ? ve(X, v, b, !0) : (ie[fe - x] = y + 1, fe >= Y ? Y = fe : J = !0, w(
          X,
          a[fe],
          m,
          null,
          v,
          b,
          T,
          C,
          S
        ), H++);
      }
      const we = J ? Bl(ie) : gt;
      for ($ = we.length - 1, y = k - 1; y >= 0; y--) {
        const X = x + y, fe = a[X], rt = a[X + 1], en = X + 1 < R ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          rt.el || Qi(rt)
        ) : _;
        ie[y] === 0 ? w(
          null,
          fe,
          m,
          en,
          v,
          b,
          T,
          C,
          S
        ) : J && ($ < 0 || y !== we[$] ? Pe(fe, m, en, 2) : $--);
      }
    }
  }, Pe = (f, a, m, _, v = null) => {
    const { el: b, type: T, transition: C, children: S, shapeFlag: y } = f;
    if (y & 6) {
      Pe(f.component.subTree, a, m, _);
      return;
    }
    if (y & 128) {
      f.suspense.move(a, m, _);
      return;
    }
    if (y & 64) {
      T.move(f, a, m, Be);
      return;
    }
    if (T === Ce) {
      s(b, a, m);
      for (let M = 0; M < S.length; M++)
        Pe(S[M], a, m, _);
      s(f.anchor, a, m);
      return;
    }
    if (T === Kn) {
      K(f, a, m);
      return;
    }
    if (_ !== 2 && y & 1 && C)
      if (_ === 0)
        C.persisted && !b[Nn] ? s(b, a, m) : (C.beforeEnter(b), s(b, a, m), ye(() => C.enter(b), v));
      else {
        const { leave: M, delayLeave: u, afterLeave: d } = C, x = () => {
          f.ctx.isUnmounted ? i(b) : s(b, a, m);
        }, O = () => {
          const $ = b._isLeaving || !!b[Nn];
          b._isLeaving && b[Nn](
            !0
            /* cancelled */
          ), C.persisted && !$ ? x() : M(b, () => {
            x(), d && d();
          });
        };
        u ? u(b, x, O) : O();
      }
    else
      s(b, a, m);
  }, ve = (f, a, m, _ = !1, v = !1) => {
    const {
      type: b,
      props: T,
      ref: C,
      children: S,
      dynamicChildren: y,
      shapeFlag: R,
      patchFlag: M,
      dirs: u,
      cacheIndex: d,
      memo: x
    } = f;
    if ((M === -2 || y && y.hasOnce) && (v = !1), C != null && (Ze(), Ht(C, null, m, f, !0), Qe()), d != null && (!f.ctx || f.ctx === a) && (a.renderCache[d] = void 0), R & 256) {
      a.ctx.deactivate(f);
      return;
    }
    const O = R & 1 && u, $ = !kt(f);
    let H;
    if ($ && (H = T && T.onVnodeBeforeUnmount) && Fe(H, a, f), R & 6)
      be(f.component, m, _);
    else {
      if (R & 128) {
        f.suspense.unmount(m, _);
        return;
      }
      O && dt(f, null, a, "beforeUnmount"), R & 64 ? f.type.remove(
        f,
        a,
        m,
        Be,
        _
      ) : y && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !y.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (b !== Ce || M > 0 && M & 64) ? it(
        y,
        a,
        m,
        !1,
        !0
      ) : (b === Ce && M & 384 || !v && R & 16) && it(S, a, m), _ && Ot(f);
    }
    const k = x != null && d == null;
    ($ && (H = T && T.onVnodeUnmounted) || O || k) && ye(() => {
      H && Fe(H, a, f), O && dt(f, null, a, "unmounted"), k && (f.el = null);
    }, m);
  }, Ot = (f) => {
    const { type: a, el: m, anchor: _, transition: v } = f;
    if (a === Ce) {
      Zt(m, _);
      return;
    }
    if (a === Kn) {
      I(f), v && !v.persisted && v.afterLeave && v.afterLeave();
      return;
    }
    const b = () => {
      i(m), v && !v.persisted && v.afterLeave && v.afterLeave();
    };
    if (f.shapeFlag & 1 && v && !v.persisted) {
      const { leave: T, delayLeave: C } = v, S = () => T(m, b);
      C ? C(f.el, b, S) : S();
    } else
      b();
  }, Zt = (f, a) => {
    let m;
    for (; f !== a; )
      m = E(f), i(f), f = m;
    i(a);
  }, be = (f, a, m) => {
    const { bum: _, scope: v, job: b, subTree: T, um: C, m: S, a: y } = f;
    js(S), js(y), _ && fn(_), v.stop(), b ? (b.flags |= 8, ve(T, f, a, m)) : f.vnode.el && T && (T.transition = f.vnode.transition, ve(T, f, a, m)), C && ye(C, a), ye(() => {
      f.isUnmounted = !0;
    }, a);
  }, it = (f, a, m, _ = !1, v = !1, b = 0) => {
    for (let T = b; T < f.length; T++)
      ve(f[T], a, m, _, v);
  }, at = (f) => {
    if (f.shapeFlag & 6)
      return at(f.component.subTree);
    if (f.shapeFlag & 128)
      return f.suspense.next();
    const a = E(f.anchor || f.el), m = a && a[ol];
    return m ? E(m) : a;
  };
  let Pt = !1;
  const Qt = (f, a, m) => {
    let _;
    f == null ? a._vnode && (ve(a._vnode, null, null, !0), _ = a._vnode.component) : w(
      a._vnode || null,
      f,
      a,
      null,
      null,
      null,
      m
    ), a._vnode = f, Pt || (Pt = !0, Ms(_), Ai(), Pt = !1);
  }, Be = {
    p: w,
    um: ve,
    m: Pe,
    r: Ot,
    mt: st,
    mc: Se,
    pc: W,
    pbc: G,
    n: at,
    o: e
  };
  return {
    render: Qt,
    hydrate: void 0,
    createApp: Ml(Qt)
  };
}
function kn({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function ht({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Ul(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Xi(e, t, n = !1) {
  const s = e.children, i = t.children;
  if (D(s) && D(i))
    for (let r = 0; r < s.length; r++) {
      const l = s[r];
      let o = i[r];
      o.shapeFlag & 1 && !o.dynamicChildren && ((o.patchFlag <= 0 || o.patchFlag === 32) && (o = i[r] = Ge(i[r]), o.el = l.el), !n && o.patchFlag !== -2 && Xi(l, o)), o.type === In && (o.patchFlag === -1 && (o = i[r] = Ge(o)), o.el = l.el), o.type === et && !o.el && (o.el = l.el);
    }
}
function Bl(e) {
  const t = e.slice(), n = [0];
  let s, i, r, l, o;
  const c = e.length;
  for (s = 0; s < c; s++) {
    const p = e[s];
    if (p !== 0) {
      if (i = n[n.length - 1], e[i] < p) {
        t[s] = i, n.push(s);
        continue;
      }
      for (r = 0, l = n.length - 1; r < l; )
        o = r + l >> 1, e[n[o]] < p ? r = o + 1 : l = o;
      p < e[n[r]] && (r > 0 && (t[s] = n[r - 1]), n[r] = s);
    }
  }
  for (r = n.length, l = n[r - 1]; r-- > 0; )
    n[r] = l, l = t[l];
  return n;
}
function Zi(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : Zi(t);
}
function js(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function Qi(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  return t ? Qi(t.subTree) : null;
}
const er = (e) => e.__isSuspense;
function Wl(e, t) {
  t && t.pendingBranch ? D(e) ? t.effects.push(...e) : t.effects.push(e) : el(e);
}
const Ce = /* @__PURE__ */ Symbol.for("v-fgt"), In = /* @__PURE__ */ Symbol.for("v-txt"), et = /* @__PURE__ */ Symbol.for("v-cmt"), Kn = /* @__PURE__ */ Symbol.for("v-stc"), bt = [];
let xe = null;
function _e(e = !1) {
  bt.push(xe = e ? null : []);
}
function tr() {
  bt.pop(), xe = bt[bt.length - 1] || null;
}
let Wt = 1;
function Ns(e, t = !1) {
  Wt += e, e < 0 && xe && t && (xe.hasOnce = !0);
}
function nr(e) {
  return e.dynamicChildren = Wt > 0 ? xe || gt : null, tr(), Wt > 0 && xe && xe.push(e), e;
}
function Te(e, t, n, s, i, r) {
  return nr(
    A(
      e,
      t,
      n,
      s,
      i,
      r,
      !0
    )
  );
}
function sr(e, t, n, s, i) {
  return nr(
    Xe(
      e,
      t,
      n,
      s,
      i,
      !0
    )
  );
}
function ir(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Rt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const rr = ({ key: e }) => e ?? null, an = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? te(e) || /* @__PURE__ */ he(e) || j(e) ? { i: Ee, r: e, k: t, f: !!n } : e : null);
function A(e, t = null, n = null, s = 0, i = null, r = e === Ce ? 0 : 1, l = !1, o = !1) {
  const c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && rr(t),
    ref: t && an(t),
    scopeId: Pi,
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
    shapeFlag: r,
    patchFlag: s,
    dynamicProps: i,
    dynamicChildren: null,
    appContext: null,
    ctx: Ee
  };
  return o ? (yn(c, n), r & 128 && e.normalize(c)) : n && (c.shapeFlag |= te(n) ? 8 : 16), Wt > 0 && // avoid a block node from tracking itself
  !l && // has current parent block
  xe && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (c.patchFlag > 0 || r & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  c.patchFlag !== 32 && xe.push(c), c;
}
const Xe = zl;
function zl(e, t = null, n = null, s = 0, i = null, r = !1) {
  if ((!e || e === yl) && (e = et), ir(e)) {
    const o = At(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && yn(o, n), Wt > 0 && !r && xe && (o.shapeFlag & 6 ? xe[xe.indexOf(e)] = o : xe.push(o)), o.patchFlag = -2, o;
  }
  if (so(e) && (e = e.__vccOpts), t) {
    t = ql(t);
    let { class: o, style: c } = t;
    o && !te(o) && (t.class = qe(o)), Z(c) && (/* @__PURE__ */ hs(c) && !D(c) && (c = ue({}, c)), t.style = Mt(c));
  }
  const l = te(e) ? 1 : er(e) ? 128 : An(e) ? 64 : Z(e) ? 4 : j(e) ? 2 : 0;
  return A(
    e,
    t,
    n,
    s,
    i,
    l,
    r,
    !0
  );
}
function ql(e) {
  return e ? /* @__PURE__ */ hs(e) || Wi(e) ? ue({}, e) : e : null;
}
function At(e, t, n = !1, s = !1) {
  const { props: i, ref: r, patchFlag: l, children: o, transition: c } = e, p = t ? Gl(i || {}, t) : i, h = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: p,
    key: p && rr(p),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && r ? D(r) ? r.concat(an(t)) : [r, an(t)] : an(t)
    ) : r,
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
    patchFlag: t && e.type !== Ce ? l === -1 ? 16 : l | 16 : l,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: c,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && At(e.ssContent),
    ssFallback: e.ssFallback && At(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce,
    cacheIndex: e.cacheIndex
  };
  return c && s && gs(
    h,
    c.clone(h)
  ), h;
}
function ot(e = " ", t = 0) {
  return Xe(In, null, e, t);
}
function bn(e = "", t = !1) {
  return t ? (_e(), sr(et, null, e)) : Xe(et, null, e);
}
function je(e) {
  return e == null || typeof e == "boolean" ? Xe(et) : D(e) ? Xe(
    Ce,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : ir(e) ? Ge(e) : Xe(In, null, String(e));
}
function Ge(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : At(e);
}
function yn(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (D(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const i = t.default;
      i && (i._c && (i._d = !1), yn(e, i()), i._c && (i._d = !0));
      return;
    } else {
      n = 32;
      const i = t._;
      !i && !Wi(t) ? t._ctx = Ee : i === 3 && Ee && (Ee.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (j(t)) {
    if (s & 65) {
      yn(e, { default: t });
      return;
    }
    t = { default: t, _ctx: Ee }, n = 32;
  } else
    t = String(t), s & 64 ? (n = 16, t = [ot(t)]) : n = 8;
  e.children = t, e.shapeFlag |= n;
}
function Gl(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const i in s)
      if (i === "class")
        t.class !== s.class && (t.class = qe([t.class, s.class]));
      else if (i === "style")
        t.style = Mt([t.style, s.style]);
      else if (xn(i)) {
        const r = t[i], l = s[i];
        l && r !== l && !(D(r) && r.includes(l)) ? t[i] = r ? [].concat(r, l) : l : l == null && r == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !Sn(i) && (t[i] = l);
      } else i !== "" && (t[i] = s[i]);
  }
  return t;
}
function Fe(e, t, n, s = null) {
  $e(e, t, 7, [
    n,
    s
  ]);
}
const Jl = ki();
let Yl = 0;
function Xl(e, t, n) {
  const s = e.type, i = (t ? t.appContext : e.appContext) || Jl, r = {
    uid: Yl++,
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
    scope: new Cr(
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
    propsOptions: qi(s, i),
    emitsOptions: Ki(s, i),
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
  return r.ctx = { _: r }, r.root = t ? t.root : r, r.emit = Ol.bind(null, r), e.ce && e.ce(r), r;
}
let me = null;
const Zl = () => me || Ee;
let _n, zt;
{
  const e = Cn(), t = (n, s) => {
    let i;
    return (i = e[n]) || (i = e[n] = []), i.push(s), (r) => {
      i.length > 1 ? i.forEach((l) => l(r)) : i[0](r);
    };
  };
  _n = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => me = n
  ), zt = t(
    "__VUE_SSR_SETTERS__",
    (n) => qt = n
  );
}
const Yt = (e) => {
  const t = me;
  return _n(e), e.scope.on(), () => {
    e.scope.off(), _n(t);
  };
}, Hs = () => {
  me && me.scope.off(), _n(null);
};
function lr(e) {
  return e.vnode.shapeFlag & 4;
}
let qt = !1;
function Ql(e, t = !1, n = !1) {
  t && zt(t);
  const { props: s, children: i } = e.vnode, r = lr(e);
  Dl(e, s, r, t), Hl(e, i, n || t);
  const l = r ? eo(e, t) : void 0;
  return t && zt(!1), l;
}
function eo(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, _l);
  const { setup: s } = n;
  if (s) {
    Ze();
    const i = e.setupContext = s.length > 1 ? no(e) : null, r = Yt(e), l = Jt(
      s,
      e,
      0,
      [
        e.props,
        i
      ]
    ), o = ei(l);
    if (Qe(), r(), (o || e.sp) && !kt(e) && Di(e), o) {
      if (l.then(Hs, Hs), t)
        return l.then((c) => {
          zt(!0);
          try {
            ks(e, c, t);
          } finally {
            zt(!1);
          }
        }).catch((c) => {
          Mn(c, e, 0);
        });
      e.asyncDep = l;
    } else
      ks(e, l);
  } else
    or(e);
}
function ks(e, t, n) {
  j(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : Z(t) && (e.setupState = Ci(t)), or(e);
}
function or(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || He);
  {
    const i = Yt(e);
    Ze();
    try {
      xl(e);
    } finally {
      Qe(), i();
    }
  }
}
const to = {
  get(e, t) {
    return de(e, "get", ""), e[t];
  }
};
function no(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, to),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function Rn(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(Ci(Br(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in Kt)
        return Kt[n](e);
    },
    has(t, n) {
      return n in t || n in Kt;
    }
  })) : e.proxy;
}
function so(e) {
  return j(e) && "__vccOpts" in e;
}
const mt = (e, t) => /* @__PURE__ */ Jr(e, t, qt), io = "3.5.43";
let ts;
const Ks = typeof window < "u" && window.trustedTypes;
if (Ks)
  try {
    ts = /* @__PURE__ */ Ks.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const fr = ts ? (e) => ts.createHTML(e) : (e) => e, ro = "http://www.w3.org/2000/svg", lo = "http://www.w3.org/1998/Math/MathML", ze = typeof document < "u" ? document : null, Vs = ze && /* @__PURE__ */ ze.createElement("template"), oo = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const i = t === "svg" ? ze.createElementNS(ro, e) : t === "mathml" ? ze.createElementNS(lo, e) : n ? ze.createElement(e, { is: n }) : ze.createElement(e);
    return e === "select" && s && s.multiple != null && i.setAttribute("multiple", s.multiple), i;
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
  insertStaticContent(e, t, n, s, i, r) {
    const l = n ? n.previousSibling : t.lastChild;
    if (i && (i === r || i.nextSibling))
      for (; t.insertBefore(i.cloneNode(!0), n), !(i === r || !(i = i.nextSibling)); )
        ;
    else {
      Vs.innerHTML = fr(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const o = Vs.content;
      if (s === "svg" || s === "mathml") {
        const c = o.firstChild;
        for (; c.firstChild; )
          o.appendChild(c.firstChild);
        o.removeChild(c);
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
}, fo = /* @__PURE__ */ Symbol("_vtc");
function co(e, t, n) {
  const s = e[fo];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const Us = /* @__PURE__ */ Symbol("_vod"), uo = /* @__PURE__ */ Symbol("_vsh"), ao = /* @__PURE__ */ Symbol(""), ho = /(?:^|;)\s*display\s*:/;
function po(e, t, n) {
  const s = e.style, i = te(n);
  let r = !1;
  if (n && !i) {
    if (t)
      if (te(t))
        for (const l of t.split(";")) {
          const o = l.slice(0, l.indexOf(":")).trim();
          n[o] == null && Dt(s, o, "");
        }
      else
        for (const l in t)
          n[l] == null && Dt(s, l, "");
    for (const l in n) {
      l === "display" && (r = !0);
      const o = n[l];
      o != null ? mo(
        e,
        l,
        !te(t) && t ? t[l] : void 0,
        o
      ) || Dt(s, l, o) : Dt(s, l, "");
    }
  } else if (i) {
    if (t !== n) {
      const l = s[ao];
      l && (n += ";" + l), s.cssText = n, r = ho.test(n);
    }
  } else t && e.removeAttribute("style");
  Us in e && (e[Us] = r ? s.display : "", e[uo] && (s.display = "none"));
}
const rn = /\s*!important$/;
function Dt(e, t, n) {
  if (D(n))
    n.forEach((s) => Dt(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    rn.test(n) ? e.setProperty(t, n.replace(rn, ""), "important") : e.setProperty(t, n);
  else {
    const s = go(e, t);
    rn.test(n) ? e.setProperty(
      yt(s),
      n.replace(rn, ""),
      "important"
    ) : e[s] = n;
  }
}
const Bs = ["Webkit", "Moz", "ms"], Vn = {};
function go(e, t) {
  const n = Vn[t];
  if (n)
    return n;
  let s = Ie(t);
  if (s !== "filter" && s in e)
    return Vn[t] = s;
  s = si(s);
  for (let i = 0; i < Bs.length; i++) {
    const r = Bs[i] + s;
    if (r in e)
      return Vn[t] = r;
  }
  return t;
}
function mo(e, t, n, s) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && te(s) && n === s;
}
const Ws = "http://www.w3.org/1999/xlink";
function zs(e, t, n, s, i, r = xr(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Ws, t.slice(6, t.length)) : e.setAttributeNS(Ws, t, n) : n == null || r && !ri(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    r ? "" : ke(n) ? String(n) : n
  );
}
function qs(e, t, n, s, i) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? fr(n) : n);
    return;
  }
  const r = e.tagName;
  if (t === "value" && r !== "PROGRESS" && // custom elements may use _value internally
  !r.includes("-")) {
    const o = r === "OPTION" ? e.getAttribute("value") || "" : e.value, c = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (o !== c || !("_value" in e)) && (e.value = c), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let l = !1;
  if (n === "" || n == null) {
    const o = typeof e[t];
    o === "boolean" ? n = ri(n) : n == null && o === "string" ? (n = "", l = !0) : o === "number" && (n = 0, l = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  l && e.removeAttribute(i || t);
}
function Ct(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function vo(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const Gs = /* @__PURE__ */ Symbol("_vei");
function bo(e, t, n, s, i = null) {
  const r = e[Gs] || (e[Gs] = {}), l = r[t];
  if (s && l)
    l.value = s;
  else {
    const [o, c] = xo(t);
    if (s) {
      const p = r[t] = Co(
        s,
        i
      );
      Ct(e, o, p, c);
    } else l && (vo(e, o, l, c), r[t] = void 0);
  }
}
const yo = /(Once|Passive|Capture)$/, _o = /^on:?(?:Once|Passive|Capture)$/;
function xo(e) {
  let t, n;
  for (; (n = e.match(yo)) && !_o.test(e); )
    t || (t = {}), e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : yt(e.slice(2)), t];
}
let Un = 0;
const So = /* @__PURE__ */ Promise.resolve(), wo = () => Un || (So.then(() => Un = 0), Un = Date.now());
function Co(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    const i = n.value;
    if (D(i)) {
      const r = s.stopImmediatePropagation;
      s.stopImmediatePropagation = () => {
        r.call(s), s._stopped = !0;
      };
      const l = i.slice(), o = [s];
      for (let c = 0; c < l.length && !s._stopped; c++) {
        const p = l[c];
        p && $e(
          p,
          t,
          5,
          o
        );
      }
    } else
      $e(
        i,
        t,
        5,
        [s]
      );
  };
  return n.value = e, n.attached = wo(), n;
}
const Js = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, To = (e, t, n, s, i, r) => {
  const l = i === "svg";
  t === "class" ? co(e, s, l) : t === "style" ? po(e, n, s) : xn(t) ? Sn(t) || bo(e, t, n, s, r) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Eo(e, t, s, l)) ? (qs(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && zs(e, t, s, l, r, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (Mo(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !te(s))) ? qs(e, Ie(t), s, r, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), zs(e, t, s, l));
};
function Eo(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && Js(t) && j(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const i = e.tagName;
    if (i === "IMG" || i === "VIDEO" || i === "CANVAS" || i === "SOURCE")
      return !1;
  }
  return Js(t) && te(n) ? !1 : t in e;
}
function Mo(e, t) {
  const n = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!n)
    return !1;
  const s = Ie(t);
  return Array.isArray(n) ? n.some((i) => Ie(i) === s) : Object.keys(n).some((i) => Ie(i) === s);
}
const Ys = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return D(t) ? (n) => fn(t, n) : t;
};
function Ao(e) {
  e.target.composing = !0;
}
function Xs(e) {
  const t = e.target;
  t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
const ln = /* @__PURE__ */ Symbol("_assign"), on = /* @__PURE__ */ Symbol("_initialValue");
function Bn(e, t, n) {
  return t && (e = e.trim()), n && (e = rs(e)), e;
}
const Oo = {
  created(e, { modifiers: { lazy: t, trim: n, number: s } }, i) {
    e.parentNode && (e.type === "text" ? e[on] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[on] = e.defaultValue.replace(/\r\n?/g, `
`))), e[ln] = Ys(i);
    const r = s || i.props && i.props.type === "number";
    Ct(e, t ? "change" : "input", (l) => {
      l.target.composing || e[ln](Bn(e.value, n, r));
    }), (n || r) && Ct(e, "change", () => {
      e.value = Bn(e.value, n, r);
    }), t || (Ct(e, "compositionstart", Ao), Ct(e, "compositionend", Xs), Ct(e, "change", Xs));
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(e, { value: t, modifiers: { trim: n, number: s } }) {
    const i = t ?? "", r = e[on];
    delete e[on], r !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== r ? e[ln](Bn(e.value, n, s)) : e.value = i;
  },
  beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: s, trim: i, number: r } }, l) {
    if (e[ln] = Ys(l), e.composing) return;
    const o = (r || e.type === "number") && !/^0\d/.test(e.value) ? rs(e.value) : e.value, c = t ?? "";
    if (o === c)
      return;
    const p = e.getRootNode();
    (p instanceof Document || p instanceof ShadowRoot) && p.activeElement === e && e.type !== "range" && (s && t === n || i && e.value.trim() === c) || (e.value = c);
  }
}, Po = ["ctrl", "shift", "alt", "meta"], Io = {
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
  exact: (e, t) => Po.some((n) => e[`${n}Key`] && !t.includes(n))
}, $t = (e, t) => {
  if (!e) return e;
  const n = e._withMods || (e._withMods = {}), s = t.join(".");
  return n[s] || (n[s] = ((i, ...r) => {
    for (let l = 0; l < t.length; l++) {
      const o = Io[t[l]];
      if (o && o(i, t)) return;
    }
    return e(i, ...r);
  }));
}, Ro = /* @__PURE__ */ ue({ patchProp: To }, oo);
let Zs;
function $o() {
  return Zs || (Zs = Kl(Ro));
}
const Fo = ((...e) => {
  const t = $o().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const i = Lo(s);
    if (!i) return;
    const r = t._component;
    !j(r) && !r.render && !r.template && (r.template = i.innerHTML), i.nodeType === 1 && (i.textContent = "");
    const l = n(i, !1, Do(i));
    return i instanceof Element && (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")), l;
  }, t;
});
function Do(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function Lo(e) {
  return te(e) ? document.querySelector(e) : e;
}
const jo = { class: "doodle-tools" }, No = { class: "tool-group" }, Ho = { class: "doodle-palette" }, ko = ["aria-label", "onClick"], Ko = {
  class: "brush-picker",
  role: "group",
  "aria-label": "选择笔刷"
}, Vo = ["aria-label", "title", "onClick"], Uo = { class: "tool-group size-group" }, Bo = { class: "tool-actions" }, Wo = ["disabled"], zo = ["disabled"], qo = ["disabled"], Go = { class: "paper-caption" }, Jo = { class: "view-controls" }, Yo = { class: "paper-corner" }, Xo = { class: "doodle-footer" }, Zo = "#f8f9fd", Qo = /* @__PURE__ */ Fi({
  __name: "DoodleCanvas",
  props: {
    client: {},
    self: {},
    members: {}
  },
  setup(e, { expose: t }) {
    const n = e, s = ["#26332f", "#f06b53", "#f3a83b", "#edcf51", "#77ae73", "#50a9a1", "#5d83c8", "#a279c7", "#e783a5", "#ffffff"], i = /* @__PURE__ */ ne(), r = /* @__PURE__ */ ne(), l = /* @__PURE__ */ ne(s[0]), o = /* @__PURE__ */ ne(7), c = /* @__PURE__ */ ne("pen"), p = /* @__PURE__ */ ne("pen"), h = [
      { id: "pen", name: "圆头笔", icon: "✎" },
      { id: "pencil", name: "铅笔", icon: "／" },
      { id: "marker", name: "马克笔", icon: "▰" },
      { id: "highlighter", name: "荧光笔", icon: "▱" },
      { id: "spray", name: "喷枪", icon: "✺" },
      { id: "neon", name: "霓虹笔", icon: "✧" },
      { id: "crayon", name: "蜡笔", icon: "❋" }
    ], g = /* @__PURE__ */ ne([]), E = /* @__PURE__ */ ne([]), P = /* @__PURE__ */ ne([]), U = /* @__PURE__ */ ne(!1), w = /* @__PURE__ */ ne(!1), F = mt(() => E.value.length > 0), L = mt(() => P.value.length > 0), V = s;
    let K = null, I, N = null, le = !1;
    const se = /* @__PURE__ */ new Set(), Se = /* @__PURE__ */ new Set();
    let nt = 0;
    const G = /* @__PURE__ */ ne({ x: 0, y: 0, zoom: 1 }), re = /* @__PURE__ */ new Map();
    let Oe = !1, Ve = !1, st = 0;
    const Xt = mt(() => `${Math.round(G.value.zoom * 100)}%`), oe = mt(() => ({ backgroundSize: `${24 * G.value.zoom}px ${24 * G.value.zoom}px`, backgroundPosition: `${G.value.x}px ${G.value.y}px` }));
    function B() {
      st || (st = requestAnimationFrame(() => {
        st = 0, be();
      }));
    }
    function W(u, d) {
      const x = i.value.getBoundingClientRect(), O = d || { x: x.width / 2, y: x.height / 2 }, $ = G.value, H = Math.max(0.15, Math.min(5, $.zoom * u)), k = H / $.zoom;
      G.value = { x: O.x - (O.x - $.x) * k, y: O.y - (O.y - $.y) * k, zoom: H }, B();
    }
    function Ue() {
      G.value = { x: 0, y: 0, zoom: 1 }, B();
    }
    function _t(u) {
      u.preventDefault();
      const d = i.value.getBoundingClientRect();
      u.ctrlKey || u.metaKey ? W(Math.exp(-u.deltaY * 0.01), { x: u.clientX - d.left, y: u.clientY - d.top }) : (G.value.x -= u.deltaX, G.value.y -= u.deltaY, B());
    }
    function Pe(u) {
      const d = i.value.getBoundingClientRect();
      return { x: u.clientX - d.left, y: u.clientY - d.top };
    }
    function ve(u) {
      u.code === "Space" && (Ve = !1);
    }
    function Ot() {
      xt(), re.clear(), Oe = !1, Ve = !1;
    }
    function Zt(u, d, x = 0) {
      const O = d.points;
      if (!O.length) return;
      u.save(), u.globalCompositeOperation = d.color === "erase" ? "destination-out" : d.brush === "highlighter" ? "multiply" : "source-over", u.strokeStyle = d.color === "erase" ? "#000" : d.color, u.fillStyle = u.strokeStyle;
      const $ = d.width * (d.brush === "marker" ? 1.65 : d.brush === "highlighter" ? 3.2 : 1);
      if (u.lineWidth = $, u.lineCap = "round", u.lineJoin = "round", u.globalAlpha = d.brush === "pencil" ? 0.62 : d.brush === "marker" ? 0.58 : d.brush === "highlighter" ? 0.3 : d.brush === "crayon" ? 0.82 : 1, d.brush === "neon" && (u.shadowColor = d.color, u.shadowBlur = Math.max(5, d.width * 1.5)), d.brush === "spray") {
        const H = [...d.id].reduce((Y, ie) => Y * 31 + ie.charCodeAt(0) | 0, 7), k = (Y, ie, we) => {
          const X = Math.sin(H * 1e-3 + Y * 78.233 + ie * 39.425 + we * 11.73) * 43758.5453;
          return X - Math.floor(X);
        }, J = O.length === 1 ? 0 : Math.max(1, x);
        for (let Y = J; Y < O.length; Y++) {
          const ie = O[Math.max(0, Y - 1)], we = O[Y];
          for (let X = 0; X < 16; X++) {
            const fe = k(Y, X, 0), rt = $ * (1.6 + k(Y, X, 1) * 1.4), en = ie.x + (we.x - ie.x) * fe + (k(Y, X, 2) - 0.5) * rt, cr = ie.y + (we.y - ie.y) * fe + (k(Y, X, 3) - 0.5) * rt, ur = 0.9 + k(Y, X, 4) * Math.max(1.5, d.width * 0.28);
            u.beginPath(), u.arc(en, cr, ur, 0, Math.PI * 2), u.fill();
          }
        }
      } else {
        const H = O.length === 1 ? 0 : Math.max(1, x);
        u.beginPath(), u.moveTo(O[Math.max(0, H - 1)].x, O[Math.max(0, H - 1)].y);
        for (let k = H; k < O.length; k++) u.lineTo(O[k].x, O[k].y);
        u.stroke(), (O.length === 1 || O.every((k) => k.x === O[0].x && k.y === O[0].y)) && (u.beginPath(), u.arc(O[0].x, O[0].y, $ / 2, 0, Math.PI * 2), u.fill()), d.brush === "crayon" && (u.globalAlpha = 0.22, u.lineWidth = Math.max(1, d.width * 0.22), u.setLineDash([1, Math.max(2, d.width * 0.5)]), u.stroke(), u.setLineDash([]));
      }
      u.restore();
    }
    function be() {
      if (!i.value || !K) return;
      const u = i.value.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2), x = Math.max(1, Math.floor(u.width * d)), O = Math.max(1, Math.floor(u.height * d));
      (i.value.width !== x || i.value.height !== O) && (i.value.width = x, i.value.height = O), K.setTransform(d, 0, 0, d, 0, 0), K.clearRect(0, 0, u.width, u.height);
      for (const $ of g.value) Zt(K, at($));
      N && Zt(K, at(N));
    }
    function it(u) {
      const d = Pe(u), x = G.value;
      return { x: (d.x - x.x) / x.zoom, y: (d.y - x.y) / x.zoom };
    }
    function at(u) {
      const d = G.value;
      return { ...u, width: u.width * d.zoom, points: u.points.map((x) => ({ x: x.x * d.zoom + d.x, y: x.y * d.zoom + d.y })) };
    }
    function Pt(u) {
      if (!(u.button !== 0 && u.button !== 1 && u.pointerType !== "touch")) {
        if (u.preventDefault(), i.value.setPointerCapture(u.pointerId), re.set(u.pointerId, Pe(u)), re.size > 1) {
          N && N.points.length < 4 ? (Se.add(N.id), n.client?.send("doodle-cancel", { id: N.id }, { reliability: "reliable" }), N = null, le = !1, U.value = !1, B()) : xt(), Oe = !0;
          return;
        }
        Oe = c.value === "pan" || Ve || u.button === 1, !Oe && (le = !0, U.value = !0, N = { id: `${n.self.id}:${crypto.randomUUID()}`, owner: n.self.id, name: n.self.name, space: "world", color: c.value === "eraser" ? "erase" : l.value, width: c.value === "eraser" ? o.value * 3 : o.value, brush: c.value === "eraser" ? "pen" : p.value, points: [it(u)] }, nt = performance.now(), n.client?.send("doodle-progress", N, { reliability: "unreliable" }), B());
      }
    }
    function Qt(u) {
      if (!re.has(u.pointerId)) return;
      u.preventDefault();
      const d = [...re.values()], x = re.get(u.pointerId), O = Pe(u);
      if (re.set(u.pointerId, O), re.size >= 2) {
        const J = [...re.values()], Y = d[0], ie = d[1], we = J[0], X = J[1], fe = { x: (Y.x + ie.x) / 2, y: (Y.y + ie.y) / 2 }, rt = { x: (we.x + X.x) / 2, y: (we.y + X.y) / 2 };
        W(Math.hypot(we.x - X.x, we.y - X.y) / Math.max(1, Math.hypot(Y.x - ie.x, Y.y - ie.y)), fe), G.value.x += rt.x - fe.x, G.value.y += rt.y - fe.y, B();
        return;
      }
      if (Oe) {
        G.value.x += O.x - x.x, G.value.y += O.y - x.y, B();
        return;
      }
      if (!le || !N) return;
      const $ = it(u), H = N.points[N.points.length - 1];
      if (Math.hypot($.x - H.x, $.y - H.y) * G.value.zoom < 1) return;
      if (N.points.length >= 320) {
        const J = N;
        xt(), le = !0, U.value = !0, N = { ...J, id: `${n.self.id}:${crypto.randomUUID()}`, points: [H] };
      }
      N.points.push($), B();
      const k = performance.now();
      k - nt >= 40 && (nt = k, n.client?.send("doodle-progress", N, { reliability: "unreliable" }));
    }
    function Be(u) {
      re.has(u.pointerId) && (xt(), re.delete(u.pointerId), re.size || (Oe = !1));
    }
    function xt() {
      if (!le || !N) return;
      le = !1;
      const u = N;
      N = null, u.points.length === 1 && u.points.push({ ...u.points[0] }), g.value.push(u), g.value.length > 600 && g.value.shift(), se.add(u.id), E.value.push(u.id), P.value = [], U.value = !1, n.client?.send("doodle-stroke", u, { reliability: "reliable" }), be();
    }
    function f(u, d = !0) {
      if (typeof u.id == "string" && Se.has(u.id) || typeof u.id != "string" || typeof u.owner != "string" || typeof u.color != "string" || !Array.isArray(u.points) || !u.points.length || u.points.length > 320 || se.has(u.id) || typeof u.width != "number" || !Number.isFinite(u.width) || u.width < 1 || u.width > 100 || u.color !== "erase" && !/^#[\da-f]{6}$/i.test(u.color)) return;
      const x = ["pen", "pencil", "marker", "highlighter", "spray", "neon", "crayon"];
      if (typeof u.brush != "string" || !x.includes(u.brush)) return;
      const O = u.points.filter((J) => !!J && typeof J == "object" && Number.isFinite(J.x) && Number.isFinite(J.y) && Math.abs(J.x) < 1e12 && Math.abs(J.y) < 1e12);
      if (!O.length) return;
      const $ = u.space === "world" ? O : O.map((J) => ({ x: J.x * 1e3, y: J.y * 650 })), H = { space: "world", id: u.id, owner: u.owner, name: typeof u.name == "string" ? u.name.slice(0, 32) : "朋友", color: u.color, width: u.width, brush: u.brush, points: $ }, k = g.value.findIndex((J) => J.id === H.id);
      k >= 0 ? g.value[k] = H : g.value.push(H), d && se.add(H.id), g.value.length > 600 && g.value.shift(), be();
    }
    function a(u) {
      for (const d of u) d && typeof d == "object" && f(d);
    }
    function m(u) {
      Se.add(u), _(u);
    }
    function _(u) {
      g.value = g.value.filter((d) => d.id !== u), E.value = E.value.filter((d) => d !== u), se.delete(u), be();
    }
    function v() {
      const u = [...E.value].reverse().findIndex(($) => g.value.some((H) => H.id === $));
      if (u < 0) return;
      const d = E.value[E.value.length - 1 - u], x = g.value.findIndex(($) => $.id === d), [O] = g.value.splice(x, 1);
      E.value = E.value.filter(($) => $ !== d), O && (P.value.push(O), se.delete(d), n.client?.send("doodle-undo", { id: d }, { reliability: "reliable" })), be();
    }
    function b() {
      const u = P.value.pop();
      u && (g.value.push(u), se.add(u.id), E.value.push(u.id), n.client?.send("doodle-stroke", u, { reliability: "reliable" }), be());
    }
    function T() {
      g.value.length && (g.value = [], E.value = [], P.value = [], se.clear(), n.client?.send("doodle-clear", {}, { reliability: "reliable" }), be());
    }
    function C() {
      g.value = [], E.value = [], P.value = [], se.clear(), be();
    }
    function S(u) {
      const d = g.value.filter((x) => se.has(x.id));
      for (let x = 0; x < d.length; x += 5) n.client?.send("doodle-snapshot", { strokes: d.slice(x, x + 5) }, { target: u, reliability: "reliable" });
    }
    function y(u) {
      n.client?.send("doodle-request", {}, { target: u, reliability: "reliable" }), S(u);
    }
    function R() {
      if (!i.value) return;
      xt(), be();
      const u = document.createElement("canvas");
      u.width = i.value.width, u.height = i.value.height;
      const d = u.getContext("2d");
      d.fillStyle = Zo, d.fillRect(0, 0, u.width, u.height), d.drawImage(i.value, 0, 0);
      const x = document.createElement("a");
      x.download = `gamelink-doodle-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.png`, x.href = u.toDataURL("image/png"), x.click();
    }
    function M(u) {
      u.target instanceof HTMLInputElement || (u.code === "Space" && (u.preventDefault(), Ve = !0), u.key.toLowerCase() === "h" && (c.value = "pan"), u.key.toLowerCase() === "b" && (c.value = "pen"), (u.metaKey || u.ctrlKey) && u.key.toLowerCase() === "z" && (u.preventDefault(), u.shiftKey ? b() : v()), (u.metaKey || u.ctrlKey) && u.key.toLowerCase() === "y" && (u.preventDefault(), b()), u.key === "Escape" && (w.value = !1));
    }
    return vs(() => {
      K = i.value.getContext("2d"), I = new ResizeObserver(be), I.observe(r.value), addEventListener("keydown", M), addEventListener("keyup", ve), addEventListener("blur", Ot), be();
      for (const u of n.client?.members || []) u.id !== n.self.id && n.client?.peerStates.get(u.id) === "connected" && y(u.id);
    }), bs(() => {
      I?.disconnect(), cancelAnimationFrame(st), removeEventListener("keydown", M), removeEventListener("keyup", ve), removeEventListener("blur", Ot);
    }), un(() => n.members, () => Ei(be), { deep: !0 }), t({ cancelStroke: m, addRemote: f, addSnapshot: a, removeStroke: _, clearRemote: C, sendSnapshot: S, handshake: y }), (u, d) => (_e(), Te("section", {
      class: "doodle-workspace",
      onContextmenu: d[12] || (d[12] = $t(() => {
      }, ["prevent"])),
      onSelectstart: d[13] || (d[13] = $t(() => {
      }, ["prevent"])),
      onDragstart: d[14] || (d[14] = $t(() => {
      }, ["prevent"]))
    }, [
      A("aside", jo, [
        A("div", No, [
          d[15] || (d[15] = A("small", null, "画笔颜色", -1)),
          A("div", Ho, [
            (_e(!0), Te(Ce, null, Yn(wi(V), (x) => (_e(), Te("button", {
              key: x,
              class: qe({ selected: l.value === x && c.value === "pen" }),
              style: Mt({ "--swatch": x }),
              "aria-label": `选择颜色 ${x}`,
              onClick: (O) => {
                l.value = x, c.value = "pen";
              }
            }, null, 14, ko))), 128))
          ])
        ]),
        d[17] || (d[17] = A("i", { class: "tool-divider" }, null, -1)),
        A("div", Ko, [
          (_e(), Te(Ce, null, Yn(h, (x) => A("button", {
            key: x.id,
            class: qe({ selected: p.value === x.id && c.value === "pen" }),
            "aria-label": x.name,
            title: x.name,
            onClick: (O) => {
              p.value = x.id, c.value = "pen";
            }
          }, [
            A("i", null, ae(x.icon), 1),
            A("small", null, ae(x.name), 1)
          ], 10, Vo)), 64))
        ]),
        A("div", Uo, [
          A("small", null, [
            d[16] || (d[16] = ot("粗细 ", -1)),
            A("b", null, ae(o.value), 1)
          ]),
          nl(A("input", {
            "onUpdate:modelValue": d[0] || (d[0] = (x) => o.value = x),
            type: "range",
            min: "2",
            max: "24",
            "aria-label": "笔刷粗细"
          }, null, 512), [
            [
              Oo,
              o.value,
              void 0,
              { number: !0 }
            ]
          ])
        ]),
        d[18] || (d[18] = A("i", { class: "tool-divider" }, null, -1)),
        A("div", Bo, [
          A("button", {
            class: qe({ active: c.value === "pan" }),
            "aria-label": "移动画布",
            title: "移动画布 H / 空格",
            onClick: d[1] || (d[1] = (x) => c.value = "pan")
          }, "✥", 2),
          A("button", {
            class: qe({ active: c.value === "pen" }),
            "aria-label": "画笔",
            title: "画笔",
            onClick: d[2] || (d[2] = (x) => c.value = "pen")
          }, "✎", 2),
          A("button", {
            class: qe({ active: c.value === "eraser" }),
            "aria-label": "橡皮擦",
            title: "橡皮擦",
            onClick: d[3] || (d[3] = (x) => c.value = "eraser")
          }, "⌫", 2),
          A("button", {
            disabled: !F.value,
            "aria-label": "撤销",
            title: "撤销 Ctrl/⌘ Z",
            onClick: v
          }, "↶", 8, Wo),
          A("button", {
            disabled: !L.value,
            "aria-label": "重做",
            title: "重做 Ctrl/⌘ Shift Z",
            onClick: b
          }, "↷", 8, zo)
        ]),
        d[19] || (d[19] = A("i", { class: "tool-divider" }, null, -1)),
        A("button", {
          class: "clear-button",
          disabled: !g.value.length,
          onClick: T
        }, "清空画布", 8, qo),
        A("button", {
          class: "save-button",
          onClick: R
        }, "保存视野 ↓")
      ]),
      A("div", {
        ref_key: "wrap",
        ref: r,
        class: qe(["paper-wrap", { drawing: U.value, panning: c.value === "pan" }]),
        style: Mt(oe.value)
      }, [
        A("div", Go, [
          d[20] || (d[20] = A("span", null, "无限画室 / INFINITE STUDIO", -1)),
          A("span", null, ae(g.value.length) + " 笔创作", 1)
        ]),
        A("canvas", {
          ref_key: "canvas",
          ref: i,
          class: "shared-canvas",
          onPointerdown: Pt,
          onPointermove: Qt,
          onPointerup: Be,
          onPointercancel: Be,
          onLostpointercapture: Be,
          onWheel: _t,
          onContextmenu: d[4] || (d[4] = $t(() => {
          }, ["prevent"]))
        }, null, 544),
        g.value.length ? bn("", !0) : (_e(), Te("div", {
          key: 0,
          class: "paper-empty",
          onClick: d[5] || (d[5] = (x) => w.value = !0)
        }, [...d[21] || (d[21] = [
          A("span", null, "✳", -1),
          A("b", null, "在这里，让想象铺开", -1),
          A("small", null, "单指绘画 · 双指移动与缩放 · 每个人都有自己的视角", -1)
        ])])),
        A("div", Jo, [
          A("button", {
            "aria-label": "缩小",
            onClick: d[6] || (d[6] = (x) => W(1 / 1.25))
          }, "−"),
          A("span", null, ae(Xt.value), 1),
          A("button", {
            "aria-label": "放大",
            onClick: d[7] || (d[7] = (x) => W(1.25))
          }, "+"),
          A("button", {
            class: "origin-button",
            onClick: Ue
          }, "回到原点 ⌖")
        ]),
        A("div", Yo, ae(Math.round(-G.value.x / G.value.zoom)) + ", " + ae(Math.round(-G.value.y / G.value.zoom)), 1)
      ], 6),
      A("footer", Xo, [
        A("span", null, [
          d[22] || (d[22] = A("i", null, null, -1)),
          ot(" " + ae(g.value.length ? "共同创作中" : "画纸已准备好"), 1)
        ]),
        d[23] || (d[23] = A("span", null, "双指移动 / 缩放 · 保留最近 600 笔", -1)),
        A("button", {
          onClick: d[8] || (d[8] = (x) => w.value = !w.value)
        }, "使用说明 ?")
      ]),
      w.value ? (_e(), Te("div", {
        key: 0,
        class: "help-overlay",
        onClick: d[11] || (d[11] = $t((x) => w.value = !1, ["self"]))
      }, [
        A("article", null, [
          A("button", {
            class: "help-close",
            onClick: d[9] || (d[9] = (x) => w.value = !1)
          }, "×"),
          d[24] || (d[24] = A("small", null, "MAKE A MARK", -1)),
          d[25] || (d[25] = A("h2", null, [
            ot("一起画，"),
            A("em", null, "一起玩。")
          ], -1)),
          d[26] || (d[26] = A("p", null, "单指或鼠标绘画；双指拖动和捏合缩放。选择移动工具后，单指也可以拖动画布。电脑可按住空格拖动，滚轮平移，Ctrl/⌘ + 滚轮缩放。视角只影响自己，回到原点可找到朋友的第一笔。每个人的笔画会实时同步给房间里的朋友，新加入的人也会收到当前画布。", -1)),
          d[27] || (d[27] = A("p", null, "工具栏可切换圆头笔、铅笔、马克笔、荧光笔、喷枪、霓虹笔和蜡笔。选颜色与粗细；橡皮擦会擦掉经过的画迹。撤销仅撤回自己的最近一笔，清空会清除所有人的画布。", -1)),
          d[28] || (d[28] = A("p", null, [
            ot("用 "),
            A("kbd", null, "⌘/Ctrl Z"),
            ot(" 撤销，"),
            A("kbd", null, "Shift ⌘/Ctrl Z"),
            ot(" 重做。保存视野会导出当前看到的区域。")
          ], -1)),
          A("button", {
            class: "help-done",
            onClick: d[10] || (d[10] = (x) => w.value = !1)
          }, "开始涂鸦 ↗")
        ])
      ])) : bn("", !0)
    ], 32));
  }
}), ef = { class: "doodle-app" }, tf = { class: "doodle-header" }, nf = { class: "doodle-room" }, sf = { class: "doodle-members" }, rf = ["title"], lf = {
  key: 1,
  class: "doodle-connect"
}, of = ["href"], ff = {
  key: 2,
  class: "doodle-toast"
}, cf = /* @__PURE__ */ Fi({
  __name: "DoodlePage",
  setup(e) {
    const t = /* @__PURE__ */ Wr(), n = /* @__PURE__ */ ne(), s = /* @__PURE__ */ ne(), i = /* @__PURE__ */ ne([]), r = /* @__PURE__ */ ne(""), l = /* @__PURE__ */ ne(!1), o = /* @__PURE__ */ ne("/"), c = /* @__PURE__ */ ne("正在连接"), p = /* @__PURE__ */ ne({}), h = /* @__PURE__ */ ne(), g = mt(() => i.value.length), E = mt(() => {
      const w = i.value.filter((F) => F.id !== s.value?.id && p.value[F.id] === "connected").length;
      return g.value <= 1 ? "等朋友加入" : `${w}/${g.value - 1} 位朋友已连接`;
    });
    async function P() {
      try {
        await t.value?.leave();
      } finally {
        window.location.assign(o.value);
      }
    }
    function U(w) {
      if (!i.value.some((L) => L.id === w.from)) return;
      const F = w.payload;
      w.kind === "doodle-stroke" ? h.value?.addRemote(F) : w.kind === "doodle-progress" ? h.value?.addRemote(F, !1) : w.kind === "doodle-cancel" && typeof F?.id == "string" ? h.value?.cancelStroke(F.id) : w.kind === "doodle-undo" && typeof F?.id == "string" ? h.value?.removeStroke(F.id) : w.kind === "doodle-clear" ? h.value?.clearRemote() : w.kind === "doodle-request" ? h.value?.sendSnapshot(w.from) : w.kind === "doodle-snapshot" && Array.isArray(F?.strokes) && h.value?.addSnapshot(F.strokes);
    }
    return vs(async () => {
      if (!new URLSearchParams(location.search).has("room")) {
        s.value = { id: "preview", name: "访客", virtual_ip: "", endpoint: "" }, i.value = [s.value], l.value = !0, c.value = "单人预览";
        return;
      }
      try {
        const w = ar.fromLocation();
        if (w.gameId !== "gamelink-doodle") throw new Error("此页面只支持多人涂鸦房间。");
        t.value = w, o.value = `${w.serverUrl}/`, w.on("members", (L) => {
          i.value = L;
          const V = new Set(L.map((K) => K.id));
          p.value = Object.fromEntries(Object.entries(p.value).filter(([K]) => V.has(K)));
        }), w.on("peer-state", (L) => {
          p.value = { ...p.value, [L.peerId]: L.state };
        }), w.on("peer-state", (L) => {
          L.state === "connected" && h.value?.handshake(L.peerId);
        }), w.on("message", U), w.on("error", (L) => {
          r.value = L.message, c.value = "连接异常";
        }), w.on("room-closed", () => {
          l.value = !1, r.value = "房间已关闭，请返回大厅重新加入。";
        });
        const F = await w.joinFromLocation();
        n.value = F.room, s.value = F.self_member, i.value = F.room.members, l.value = !0, c.value = "已加入房间";
      } catch (w) {
        t.value?.dispose(), r.value = w instanceof Error ? w.message : String(w);
      }
    }), bs(() => t.value?.dispose()), (w, F) => (_e(), Te("main", ef, [
      A("header", tf, [
        F[2] || (F[2] = A("a", {
          class: "doodle-brand",
          href: "/"
        }, [
          A("span", { class: "brand-mark" }, "✳"),
          A("span", null, [
            A("b", null, "一起涂鸦"),
            A("small", null, "DRAW SOMETHING TOGETHER")
          ])
        ], -1)),
        A("div", nf, [
          F[1] || (F[1] = A("span", { class: "live-dot" }, null, -1)),
          A("b", null, ae(n.value?.code || (t.value ? "——" : "预览")), 1),
          A("span", null, ae(E.value), 1)
        ]),
        A("div", sf, [
          (_e(!0), Te(Ce, null, Yn(i.value.slice(0, 8), (L, V) => (_e(), Te("span", {
            key: L.id,
            title: L.name,
            style: Mt({ "--member-color": ["#f3a48e", "#82afdb", "#97bd87", "#c59bd7", "#e7bd68", "#6fbdb0", "#dc91a7", "#91a4d6"][V] })
          }, ae(L.name.slice(0, 1)), 13, rf))), 128)),
          A("small", null, ae(g.value) + " 人", 1)
        ]),
        A("button", {
          class: "doodle-exit",
          onClick: P
        }, "退出房间 ↗")
      ]),
      l.value && s.value ? (_e(), sr(Qo, {
        key: 0,
        ref_key: "canvas",
        ref: h,
        client: t.value,
        self: s.value,
        members: i.value
      }, null, 8, ["client", "self", "members"])) : (_e(), Te("section", lf, [
        F[3] || (F[3] = A("span", { class: "connect-star" }, "✳", -1)),
        A("b", null, ae(r.value || "正在铺开画纸…"), 1),
        A("small", null, ae(r.value ? "检查房间链接或网络后重试" : c.value), 1),
        r.value ? (_e(), Te("a", {
          key: 0,
          href: o.value
        }, "返回游戏大厅", 8, of)) : bn("", !0)
      ])),
      r.value && l.value ? (_e(), Te("div", ff, [
        ot(ae(r.value), 1),
        A("button", {
          onClick: F[0] || (F[0] = (L) => r.value = "")
        }, "×")
      ])) : bn("", !0)
    ]));
  }
});
Fo(cf).mount("#app");
