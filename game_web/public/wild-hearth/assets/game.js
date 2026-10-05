import { GameLinkClient as Ns } from "./gamelink.js?v=44bdd90734fe";
// @__NO_SIDE_EFFECTS__
function Tr(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const ve = {}, Lt = [], dt = () => {
}, Ei = () => !1, Un = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Bn = (e) => e.startsWith("onUpdate:"), Ve = Object.assign, kr = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, js = Object.prototype.hasOwnProperty, ce = (e, t) => js.call(e, t), W = Array.isArray, kt = (e) => vn(e) === "[object Map]", Vt = (e) => vn(e) === "[object Set]", zr = (e) => vn(e) === "[object Date]", Z = (e) => typeof e == "function", ke = (e) => typeof e == "string", ht = (e) => typeof e == "symbol", de = (e) => e !== null && typeof e == "object", Ai = (e) => (de(e) || Z(e)) && Z(e.then) && Z(e.catch), $i = Object.prototype.toString, vn = (e) => $i.call(e), Us = (e) => vn(e).slice(8, -1), Oi = (e) => vn(e) === "[object Object]", Er = (e) => ke(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, tn = /* @__PURE__ */ Tr(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Kn = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, Bs = /-\w/g, it = Kn(
  (e) => e.replace(Bs, (t) => t.slice(1).toUpperCase())
), Ks = /\B([A-Z])/g, Nt = Kn(
  (e) => e.replace(Ks, "-$1").toLowerCase()
), Ii = Kn((e) => e.charAt(0).toUpperCase() + e.slice(1)), tr = Kn(
  (e) => e ? `on${Ii(e)}` : ""
), ft = (e, t) => !Object.is(e, t), En = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, Pi = (e, t, n, r = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: r,
    value: n
  });
}, Ri = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let qr;
const Wn = () => qr || (qr = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function rt(e) {
  if (W(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const r = e[n], i = ke(r) ? Js(r) : rt(r);
      if (i)
        for (const s in i)
          t[s] = i[s];
    }
    return t;
  } else if (ke(e) || de(e))
    return e;
}
const Ws = /;(?![^(]*\))/g, zs = /:([^]+)/, qs = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function Js(e) {
  const t = {};
  return e.replace(qs, (n) => n.startsWith("/*") ? "" : n).split(Ws).forEach((n) => {
    if (n) {
      const r = n.split(zs);
      r.length > 1 && (t[r[0].trim()] = r[1].trim());
    }
  }), t;
}
function Oe(e) {
  let t = "";
  if (ke(e))
    t = e;
  else if (W(e))
    for (let n = 0; n < e.length; n++) {
      const r = Oe(e[n]);
      r && (t += r + " ");
    }
  else if (de(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const Zs = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Gs = /* @__PURE__ */ Tr(Zs);
function Fi(e) {
  return !!e || e === "";
}
function Ys(e, t, n) {
  if (e.length !== t.length) return !1;
  let r = !0;
  for (let i = 0; r && i < e.length; i++)
    r = At(e[i], t[i], n);
  return r;
}
function Jr(e, t, n) {
  if (e.size !== t.size) return !1;
  const r = Array.from(t), i = new Uint8Array(r.length);
  for (const s of e) {
    let l = -1;
    for (let a = 0; a < r.length; a++)
      if (!i[a] && At(s, r[a], n)) {
        l = a;
        break;
      }
    if (l < 0) return !1;
    i[l] = 1;
  }
  return !0;
}
function Xs(e, t, n) {
  let r = kt(e), i = kt(t);
  if (r || i || (r = Vt(e), i = Vt(t), r || i))
    return r && i ? Jr(e, t, n) : !1;
  const s = Object.keys(e).length, l = Object.keys(t).length;
  if (s !== l)
    return !1;
  for (const a in e) {
    const o = e.hasOwnProperty(a), d = t.hasOwnProperty(a);
    if (o && !d || !o && d || !At(e[a], t[a], n))
      return !1;
  }
  return String(e) === String(t);
}
function Zr(e, t, n, r) {
  n || (n = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()]);
  const [i, s] = n;
  if (i.has(e) || s.has(t))
    return i.get(e) === t && s.get(t) === e;
  i.set(e, t), s.set(t, e);
  const l = r(e, t, n);
  return i.delete(e), s.delete(t), l;
}
function At(e, t, n) {
  if (e === t) return !0;
  let r = zr(e), i = zr(t);
  return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = ht(e), i = ht(t), r || i ? e === t : (r = W(e), i = W(t), r || i ? r && i ? Zr(e, t, n, Ys) : !1 : (r = de(e), i = de(t), r || i ? !r || !i ? !1 : Zr(e, t, n, Xs) : String(e) === String(t))));
}
function Qs(e, t) {
  return e.findIndex((n) => At(n, t));
}
const Li = (e) => !!(e && e.__v_isRef === !0), V = (e) => ke(e) ? e : e == null ? "" : W(e) || de(e) && (e.toString === $i || !Z(e.toString)) ? Li(e) ? V(e.value) : JSON.stringify(e, Di, 2) : String(e), Di = (e, t) => Li(t) ? Di(e, t.value) : kt(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [r, i], s) => (n[nr(r, s) + " =>"] = i, n),
    {}
  )
} : Vt(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => nr(n))
} : ht(t) ? nr(t) : de(t) && !W(t) && !Oi(t) ? String(t) : t, nr = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    ht(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
let He;
class el {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !t && He && (He.active ? (this.parent = He, this.index = (He.scopes || (He.scopes = [])).push(
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
        const r = this.scopes.slice();
        for (t = 0, n = r.length; t < n; t++)
          r[t].pause();
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
      const r = this.effects.slice();
      for (t = 0, n = r.length; t < n; t++)
        r[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = He;
      try {
        return He = this, t();
      } finally {
        He = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = He, He = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (He === this)
        He = this.prevScope;
      else {
        let t = He;
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
      let n, r;
      for (n = 0, r = this.effects.length; n < r; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, r = this.cleanups.length; n < r; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        const i = this.scopes.slice();
        for (n = 0, r = i.length; n < r; n++)
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
function tl() {
  return He;
}
let ye;
const rr = /* @__PURE__ */ new WeakSet();
class Hi {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, He && (He.active ? He.effects.push(this) : this.flags &= -2);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, rr.has(this) && (rr.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ni(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Gr(this), ji(this);
    const t = ye, n = st;
    ye = this, st = !0;
    try {
      return this.fn();
    } finally {
      Ui(this), ye = t, st = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Or(t);
      this.deps = this.depsTail = void 0, Gr(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? rr.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    hr(this) && this.run();
  }
  get dirty() {
    return hr(this);
  }
}
let Vi = 0, nn, rn;
function Ni(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = rn, rn = e;
    return;
  }
  e.next = nn, nn = e;
}
function Ar() {
  Vi++;
}
function $r() {
  if (--Vi > 0)
    return;
  if (rn) {
    let t = rn;
    for (rn = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; nn; ) {
    let t = nn;
    for (nn = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (r) {
          e || (e = r);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function ji(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ui(e) {
  let t, n = e.depsTail, r = n;
  for (; r; ) {
    const i = r.prevDep;
    r.version === -1 ? (r === n && (n = i), Or(r), nl(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = i;
  }
  e.deps = t, e.depsTail = n;
}
function hr(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Bi(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Bi(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === un) || (e.globalVersion = un, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !hr(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = ye, r = st;
  ye = e, st = !0;
  try {
    ji(e);
    const i = e.fn(e._value);
    (t.version === 0 || ft(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    ye = n, st = r, Ui(e), e.flags &= -3;
  }
}
function Or(e, t = !1) {
  const { dep: n, prevSub: r, nextSub: i } = e;
  if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
    n.computed.flags &= -5;
    for (let s = n.computed.deps; s; s = s.nextDep)
      Or(s, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function nl(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let st = !0;
const Ki = [];
function wt() {
  Ki.push(st), st = !1;
}
function xt() {
  const e = Ki.pop();
  st = e === void 0 ? !0 : e;
}
function Gr(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = ye;
    ye = void 0;
    try {
      t();
    } finally {
      ye = n;
    }
  }
}
let un = 0;
class rl {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Ir {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!ye || !st || ye === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== ye)
      n = this.activeLink = new rl(ye, this), ye.deps ? (n.prevDep = ye.depsTail, ye.depsTail.nextDep = n, ye.depsTail = n) : ye.deps = ye.depsTail = n, Wi(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const r = n.nextDep;
      r.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = r), n.prevDep = ye.depsTail, n.nextDep = void 0, ye.depsTail.nextDep = n, ye.depsTail = n, ye.deps === n && (ye.deps = r);
    }
    return n;
  }
  trigger(t) {
    this.version++, un++, this.notify(t);
  }
  notify(t) {
    Ar();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      $r();
    }
  }
}
function Wi(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let r = t.deps; r; r = r.nextDep)
        Wi(r);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const pr = /* @__PURE__ */ new WeakMap(), Dt = /* @__PURE__ */ Symbol(
  ""
), gr = /* @__PURE__ */ Symbol(
  ""
), cn = /* @__PURE__ */ Symbol(
  ""
);
function Ne(e, t, n) {
  if (st && ye) {
    let r = pr.get(e);
    r || pr.set(e, r = /* @__PURE__ */ new Map());
    let i = r.get(n);
    i || (r.set(n, i = new Ir()), i.map = r, i.key = n), i.track();
  }
}
function bt(e, t, n, r, i, s) {
  const l = pr.get(e);
  if (!l) {
    un++;
    return;
  }
  const a = (o) => {
    o && o.trigger();
  };
  if (Ar(), t === "clear")
    l.forEach(a);
  else {
    const o = W(e), d = o && Er(n);
    if (o && n === "length") {
      const c = Number(r);
      l.forEach((g, S) => {
        (S === "length" || S === cn || !ht(S) && S >= c) && a(g);
      });
    } else
      switch ((n !== void 0 || l.has(void 0)) && a(l.get(n)), d && a(l.get(cn)), t) {
        case "add":
          o ? d && a(l.get("length")) : (a(l.get(Dt)), kt(e) && a(l.get(gr)));
          break;
        case "delete":
          o || (a(l.get(Dt)), kt(e) && a(l.get(gr)));
          break;
        case "set":
          kt(e) && a(l.get(Dt));
          break;
      }
  }
  $r();
}
function jt(e) {
  const t = /* @__PURE__ */ ue(e);
  return t === e || (Ne(t, "iterate", cn), /* @__PURE__ */ tt(e)) ? t : /* @__PURE__ */ pt(e) ? /* @__PURE__ */ Et(e) ? t.map((n) => $t(nt(n))) : t.map($t) : t.map(nt);
}
function zn(e) {
  return Ne(e = /* @__PURE__ */ ue(e), "iterate", cn), e;
}
function ut(e, t) {
  return /* @__PURE__ */ pt(e) ? $t(/* @__PURE__ */ Et(e) ? nt(t) : t) : nt(t);
}
const il = {
  __proto__: null,
  [Symbol.iterator]() {
    return ir(this, Symbol.iterator, (e) => ut(this, e));
  },
  concat(...e) {
    return jt(this).concat(
      ...e.map((t) => W(t) ? jt(t) : t)
    );
  },
  entries() {
    return ir(this, "entries", (e) => (e[1] = ut(this, e[1]), e));
  },
  every(e, t) {
    return vt(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return vt(
      this,
      "filter",
      e,
      t,
      (n) => n.map((r) => ut(this, r)),
      arguments
    );
  },
  find(e, t) {
    return vt(
      this,
      "find",
      e,
      t,
      (n) => ut(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return vt(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return vt(
      this,
      "findLast",
      e,
      t,
      (n) => ut(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return vt(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return vt(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return sr(this, "includes", e);
  },
  indexOf(...e) {
    return sr(this, "indexOf", e);
  },
  join(e) {
    return jt(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return sr(this, "lastIndexOf", e);
  },
  map(e, t) {
    return vt(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return Zt(this, "pop");
  },
  push(...e) {
    return Zt(this, "push", e);
  },
  reduce(e, ...t) {
    return Yr(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Yr(this, "reduceRight", e, t);
  },
  shift() {
    return Zt(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return vt(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return Zt(this, "splice", e);
  },
  toReversed() {
    return jt(this).toReversed();
  },
  toSorted(e) {
    return jt(this).toSorted(e);
  },
  toSpliced(...e) {
    return jt(this).toSpliced(...e);
  },
  unshift(...e) {
    return Zt(this, "unshift", e);
  },
  values() {
    return ir(this, "values", (e) => ut(this, e));
  }
};
function ir(e, t, n) {
  const r = zn(e), i = r[t]();
  return r !== e && !/* @__PURE__ */ tt(e) && (i._next = i.next, i.next = () => {
    const s = i._next();
    return s.done || (s.value = n(s.value)), s;
  }), i;
}
const sl = Array.prototype;
function vt(e, t, n, r, i, s) {
  const l = zn(e), a = l !== e && !/* @__PURE__ */ tt(e), o = l[t];
  if (o !== sl[t]) {
    const g = o.apply(e, s);
    return a ? nt(g) : g;
  }
  let d = n;
  l !== e && (a ? d = function(g, S) {
    return n.call(this, ut(e, g), S, e);
  } : n.length > 2 && (d = function(g, S) {
    return n.call(this, g, S, e);
  }));
  const c = o.call(l, d, r);
  return a && i ? i(c) : c;
}
function Yr(e, t, n, r) {
  const i = zn(e), s = i !== e && !/* @__PURE__ */ tt(e);
  let l = n, a = !1;
  i !== e && (s ? (a = r.length === 0, l = function(d, c, g) {
    return a && (a = !1, d = ut(e, d)), n.call(this, d, ut(e, c), g, e);
  }) : n.length > 3 && (l = function(d, c, g) {
    return n.call(this, d, c, g, e);
  }));
  const o = i[t](l, ...r);
  return a ? ut(e, o) : o;
}
function sr(e, t, n) {
  const r = /* @__PURE__ */ ue(e);
  Ne(r, "iterate", cn);
  const i = r[t](...n);
  return (i === -1 || i === !1) && /* @__PURE__ */ Lr(n[0]) ? (n[0] = /* @__PURE__ */ ue(n[0]), r[t](...n)) : i;
}
function Zt(e, t, n = []) {
  wt(), Ar();
  const r = (/* @__PURE__ */ ue(e))[t].apply(e, n);
  return $r(), xt(), r;
}
const ll = /* @__PURE__ */ Tr("__proto__,__v_isRef,__isVue"), zi = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(ht)
);
function ol(e) {
  ht(e) || (e = String(e));
  const t = /* @__PURE__ */ ue(this);
  return Ne(t, "has", e), t.hasOwnProperty(e);
}
class qi {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, r) {
    if (n === "__v_skip") return t.__v_skip;
    const i = this._isReadonly, s = this._isShallow;
    if (n === "__v_isReactive")
      return !i;
    if (n === "__v_isReadonly")
      return i;
    if (n === "__v_isShallow")
      return s;
    if (n === "__v_raw")
      return r === (i ? s ? ml : Yi : s ? Gi : Zi).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(r) ? t : void 0;
    const l = W(t);
    if (!i) {
      let o;
      if (l && (o = il[n]))
        return o;
      if (n === "hasOwnProperty")
        return ol;
    }
    const a = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ je(t) ? t : r
    );
    if ((ht(n) ? zi.has(n) : ll(n)) || (i || Ne(t, "get", n), s))
      return a;
    if (/* @__PURE__ */ je(a)) {
      const o = l && Er(n) ? a : a.value;
      return i && de(o) ? /* @__PURE__ */ mr(o) : o;
    }
    return de(a) ? i ? /* @__PURE__ */ mr(a) : /* @__PURE__ */ Rr(a) : a;
  }
}
class Ji extends qi {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, r, i) {
    let s = t[n];
    const l = W(t) && Er(n);
    if (!this._isShallow) {
      const d = /* @__PURE__ */ pt(s);
      if (!/* @__PURE__ */ tt(r) && !/* @__PURE__ */ pt(r) && (s = /* @__PURE__ */ ue(s), r = /* @__PURE__ */ ue(r)), !l && /* @__PURE__ */ je(s) && !/* @__PURE__ */ je(r))
        return d || (s.value = r), !0;
    }
    const a = l ? Number(n) < t.length : ce(t, n), o = Reflect.set(
      t,
      n,
      r,
      /* @__PURE__ */ je(t) ? t : i
    );
    return t === /* @__PURE__ */ ue(i) && o && (a ? ft(r, s) && bt(t, "set", n, r) : bt(t, "add", n, r)), o;
  }
  deleteProperty(t, n) {
    const r = ce(t, n);
    t[n];
    const i = Reflect.deleteProperty(t, n);
    return i && r && bt(t, "delete", n, void 0), i;
  }
  has(t, n) {
    const r = Reflect.has(t, n);
    return (!ht(n) || !zi.has(n)) && Ne(t, "has", n), r;
  }
  ownKeys(t) {
    return Ne(
      t,
      "iterate",
      W(t) ? "length" : Dt
    ), Reflect.ownKeys(t);
  }
}
class al extends qi {
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
const ul = /* @__PURE__ */ new Ji(), cl = /* @__PURE__ */ new al(), fl = /* @__PURE__ */ new Ji(!0);
const vr = (e) => e, _n = (e) => Reflect.getPrototypeOf(e);
function dl(e, t, n) {
  return function(...r) {
    const i = this.__v_raw, s = /* @__PURE__ */ ue(i), l = kt(s), a = e === "entries" || e === Symbol.iterator && l, o = e === "keys" && l, d = i[e](...r), c = n ? vr : t ? $t : nt;
    return !t && Ne(
      s,
      "iterate",
      o ? gr : Dt
    ), Ve(
      // inheriting all iterator properties
      Object.create(d),
      {
        // iterator protocol
        next() {
          const { value: g, done: S } = d.next();
          return S ? { value: g, done: S } : {
            value: a ? [c(g[0]), c(g[1])] : c(g),
            done: S
          };
        }
      }
    );
  };
}
function wn(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function hl(e, t) {
  const n = {
    get(i) {
      const s = this.__v_raw, l = /* @__PURE__ */ ue(s), a = /* @__PURE__ */ ue(i);
      e || (ft(i, a) && Ne(l, "get", i), Ne(l, "get", a));
      const { has: o } = _n(l), d = t ? vr : e ? $t : nt;
      if (o.call(l, i))
        return d(s.get(i));
      if (o.call(l, a))
        return d(s.get(a));
      s !== l && s.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !e && Ne(/* @__PURE__ */ ue(i), "iterate", Dt), i.size;
    },
    has(i) {
      const s = this.__v_raw, l = /* @__PURE__ */ ue(s), a = /* @__PURE__ */ ue(i);
      return e || (ft(i, a) && Ne(l, "has", i), Ne(l, "has", a)), i === a ? s.has(i) : s.has(i) || s.has(a);
    },
    forEach(i, s) {
      const l = this, a = l.__v_raw, o = /* @__PURE__ */ ue(a), d = t ? vr : e ? $t : nt;
      return !e && Ne(o, "iterate", Dt), a.forEach((c, g) => i.call(s, d(c), d(g), l));
    }
  };
  return Ve(
    n,
    e ? {
      add: wn("add"),
      set: wn("set"),
      delete: wn("delete"),
      clear: wn("clear")
    } : {
      add(i) {
        const s = /* @__PURE__ */ ue(this), l = _n(s), a = /* @__PURE__ */ ue(i), o = !t && !/* @__PURE__ */ tt(i) && !/* @__PURE__ */ pt(i) ? a : i;
        return l.has.call(s, o) || ft(i, o) && l.has.call(s, i) || ft(a, o) && l.has.call(s, a) || (s.add(o), bt(s, "add", o, o)), this;
      },
      set(i, s) {
        !t && !/* @__PURE__ */ tt(s) && !/* @__PURE__ */ pt(s) && (s = /* @__PURE__ */ ue(s));
        const l = /* @__PURE__ */ ue(this), { has: a, get: o } = _n(l);
        let d = a.call(l, i);
        d || (i = /* @__PURE__ */ ue(i), d = a.call(l, i));
        const c = o.call(l, i);
        return l.set(i, s), d ? ft(s, c) && bt(l, "set", i, s) : bt(l, "add", i, s), this;
      },
      delete(i) {
        const s = /* @__PURE__ */ ue(this), { has: l, get: a } = _n(s);
        let o = l.call(s, i);
        o || (i = /* @__PURE__ */ ue(i), o = l.call(s, i)), a && a.call(s, i);
        const d = s.delete(i);
        return o && bt(s, "delete", i, void 0), d;
      },
      clear() {
        const i = /* @__PURE__ */ ue(this), s = i.size !== 0, l = i.clear();
        return s && bt(
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
    n[i] = dl(i, e, t);
  }), n;
}
function Pr(e, t) {
  const n = hl(e, t);
  return (r, i, s) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? r : Reflect.get(
    ce(n, i) && i in r ? n : r,
    i,
    s
  );
}
const pl = {
  get: /* @__PURE__ */ Pr(!1, !1)
}, gl = {
  get: /* @__PURE__ */ Pr(!1, !0)
}, vl = {
  get: /* @__PURE__ */ Pr(!0, !1)
};
const Zi = /* @__PURE__ */ new WeakMap(), Gi = /* @__PURE__ */ new WeakMap(), Yi = /* @__PURE__ */ new WeakMap(), ml = /* @__PURE__ */ new WeakMap();
function yl(e) {
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
function Rr(e) {
  return /* @__PURE__ */ pt(e) ? e : Fr(
    e,
    !1,
    ul,
    pl,
    Zi
  );
}
// @__NO_SIDE_EFFECTS__
function bl(e) {
  return Fr(
    e,
    !1,
    fl,
    gl,
    Gi
  );
}
// @__NO_SIDE_EFFECTS__
function mr(e) {
  return Fr(
    e,
    !0,
    cl,
    vl,
    Yi
  );
}
function Fr(e, t, n, r, i) {
  if (!de(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const s = i.get(e);
  if (s)
    return s;
  const l = yl(Us(e));
  if (l === 0)
    return e;
  const a = new Proxy(
    e,
    l === 2 ? r : n
  );
  return i.set(e, a), a;
}
// @__NO_SIDE_EFFECTS__
function Et(e) {
  return /* @__PURE__ */ pt(e) ? /* @__PURE__ */ Et(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function pt(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function tt(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Lr(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function ue(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ ue(t) : e;
}
function _l(e) {
  return !ce(e, "__v_skip") && Object.isExtensible(e) && Pi(e, "__v_skip", !0), e;
}
const nt = (e) => de(e) ? /* @__PURE__ */ Rr(e) : e, $t = (e) => de(e) ? /* @__PURE__ */ mr(e) : e;
// @__NO_SIDE_EFFECTS__
function je(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function _e(e) {
  return Xi(e, !1);
}
// @__NO_SIDE_EFFECTS__
function wl(e) {
  return Xi(e, !0);
}
function Xi(e, t) {
  return /* @__PURE__ */ je(e) ? e : new xl(e, t);
}
class xl {
  constructor(t, n) {
    this.dep = new Ir(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : /* @__PURE__ */ ue(t), this._value = n ? t : nt(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, r = this.__v_isShallow || /* @__PURE__ */ tt(t) || /* @__PURE__ */ pt(t);
    t = r ? t : /* @__PURE__ */ ue(t), ft(t, n) && (this._rawValue = t, this._value = r ? t : nt(t), this.dep.trigger());
  }
}
function C(e) {
  return /* @__PURE__ */ je(e) ? e.value : e;
}
const Ml = {
  get: (e, t, n) => t === "__v_raw" ? e : C(Reflect.get(e, t, n)),
  set: (e, t, n, r) => {
    const i = e[t];
    return /* @__PURE__ */ je(i) && !/* @__PURE__ */ je(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
  }
};
function Qi(e) {
  return /* @__PURE__ */ Et(e) ? e : new Proxy(e, Ml);
}
class Cl {
  constructor(t, n, r) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new Ir(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = un - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = r;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    ye !== this)
      return Ni(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return Bi(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function Sl(e, t, n = !1) {
  let r, i;
  return Z(e) ? r = e : (r = e.get, i = e.set), new Cl(r, i, n);
}
const xn = {}, Pn = /* @__PURE__ */ new WeakMap();
let Rt;
function Tl(e, t = !1, n = Rt) {
  if (n) {
    let r = Pn.get(n);
    r || Pn.set(n, r = []), r.push(e);
  }
}
function kl(e, t, n = ve) {
  const { immediate: r, deep: i, once: s, scheduler: l, augmentJob: a, call: o } = n, d = (H) => i ? H : /* @__PURE__ */ tt(H) || i === !1 || i === 0 ? _t(H, 1) : _t(H);
  let c, g, S, $, B = !1, F = !1;
  if (/* @__PURE__ */ je(e) ? (g = () => e.value, B = /* @__PURE__ */ tt(e)) : /* @__PURE__ */ Et(e) ? (g = () => d(e), B = !0) : W(e) ? (F = !0, B = e.some((H) => /* @__PURE__ */ Et(H) || /* @__PURE__ */ tt(H)), g = () => e.map((H) => {
    if (/* @__PURE__ */ je(H))
      return H.value;
    if (/* @__PURE__ */ Et(H))
      return d(H);
    if (Z(H))
      return o ? o(H, 2) : H();
  })) : Z(e) ? t ? g = o ? () => o(e, 2) : e : g = () => {
    if (S) {
      wt();
      try {
        S();
      } finally {
        xt();
      }
    }
    const H = Rt;
    Rt = c;
    try {
      return o ? o(e, 3, [$]) : e($);
    } finally {
      Rt = H;
    }
  } : g = dt, t && i) {
    const H = g, oe = i === !0 ? 1 / 0 : i;
    g = () => _t(H(), oe);
  }
  const z = tl(), q = () => {
    c.stop(), z && z.active && kr(z.effects, c);
  };
  if (s && t) {
    const H = t;
    t = (...oe) => {
      const Ie = H(...oe);
      return q(), Ie;
    };
  }
  let O = F ? new Array(e.length).fill(xn) : xn;
  const ee = (H) => {
    if (!(!(c.flags & 1) || !c.dirty && !H))
      if (t) {
        const oe = c.run();
        if (H || i || B || (F ? oe.some((Ie, J) => ft(Ie, O[J])) : ft(oe, O))) {
          S && S();
          const Ie = Rt;
          Rt = c;
          try {
            const J = [
              oe,
              // pass undefined as the old value when it's changed for the first time
              O === xn ? void 0 : F && O[0] === xn ? [] : O,
              $
            ];
            O = oe, o ? o(t, 3, J) : (
              // @ts-expect-error
              t(...J)
            );
          } finally {
            Rt = Ie;
          }
        }
      } else
        c.run();
  };
  return a && a(ee), c = new Hi(g), c.scheduler = l ? () => l(ee, !1) : ee, $ = (H) => Tl(H, !1, c), S = c.onStop = () => {
    const H = Pn.get(c);
    if (H) {
      if (o)
        o(H, 4);
      else
        for (const oe of H) oe();
      Pn.delete(c);
    }
  }, t ? r ? ee(!0) : O = c.run() : l ? l(ee.bind(null, !0), !0) : c.run(), q.pause = c.pause.bind(c), q.resume = c.resume.bind(c), q.stop = q, q;
}
function _t(e, t = 1 / 0, n) {
  if (t <= 0 || !de(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, /* @__PURE__ */ je(e))
    _t(e.value, t, n);
  else if (W(e))
    for (let r = 0; r < e.length; r++)
      _t(e[r], t, n);
  else if (Vt(e) || kt(e))
    e.forEach((r) => {
      _t(r, t, n);
    });
  else if (Oi(e)) {
    for (const r in e)
      _t(e[r], t, n);
    for (const r of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, r) && _t(e[r], t, n);
  }
  return e;
}
function mn(e, t, n, r) {
  try {
    return r ? e(...r) : e();
  } catch (i) {
    qn(i, t, n);
  }
}
function lt(e, t, n, r) {
  if (Z(e)) {
    const i = mn(e, t, n, r);
    return i && Ai(i) && i.catch((s) => {
      qn(s, t, n);
    }), i;
  }
  if (W(e)) {
    const i = [];
    for (let s = 0; s < e.length; s++)
      i.push(lt(e[s], t, n, r));
    return i;
  }
}
function qn(e, t, n, r = !0) {
  const i = t ? t.vnode : null, { errorHandler: s, throwUnhandledErrorInProduction: l } = t && t.appContext.config || ve;
  if (t) {
    let a = t.parent;
    const o = t.proxy, d = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; a; ) {
      const c = a.ec;
      if (c) {
        for (let g = 0; g < c.length; g++)
          if (c[g](e, o, d) === !1)
            return;
      }
      a = a.parent;
    }
    if (s) {
      wt(), mn(s, null, 10, [
        e,
        o,
        d
      ]), xt();
      return;
    }
  }
  El(e, n, i, r, l);
}
function El(e, t, n, r = !0, i = !1) {
  if (i)
    throw e;
  console.error(e);
}
const ze = [];
let at = -1;
const Wt = [];
let Tt = null, Ut = 0;
const es = /* @__PURE__ */ Promise.resolve();
let Rn = null;
function Dr(e) {
  const t = Rn || es;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Al(e) {
  let t = at + 1, n = ze.length;
  for (; t < n; ) {
    const r = t + n >>> 1, i = ze[r], s = fn(i);
    s < e || s === e && i.flags & 2 ? t = r + 1 : n = r;
  }
  return t;
}
function Hr(e) {
  if (!(e.flags & 1)) {
    const t = fn(e), n = ze[ze.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= fn(n) ? ze.push(e) : ze.splice(Al(t), 0, e), e.flags |= 1, ts();
  }
}
function ts() {
  Rn || (Rn = es.then(rs));
}
function $l(e) {
  if (!W(e))
    Tt && e.id === -1 ? Tt.splice(Ut + 1, 0, e) : e.flags & 1 || (Wt.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      Wt.push(e[t]);
  ts();
}
function Xr(e, t, n = at + 1) {
  for (; n < ze.length; n++) {
    const r = ze[n];
    if (r && r.flags & 2) {
      if (e && r.id !== e.uid)
        continue;
      ze.splice(n, 1), n--, r.flags & 4 && (r.flags &= -2), r(), r.flags & 4 || (r.flags &= -2);
    }
  }
}
function ns(e) {
  if (Wt.length) {
    const t = [...new Set(Wt)].sort(
      (n, r) => fn(n) - fn(r)
    );
    if (Wt.length = 0, Tt) {
      for (let n = 0; n < t.length; n++)
        Tt.push(t[n]);
      return;
    }
    for (Tt = t, Ut = 0; Ut < Tt.length; Ut++) {
      const n = Tt[Ut];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    Tt = null, Ut = 0;
  }
}
const fn = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function rs(e) {
  try {
    for (at = 0; at < ze.length; at++) {
      const t = ze[at];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), mn(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; at < ze.length; at++) {
      const t = ze[at];
      t && (t.flags &= -2);
    }
    at = -1, ze.length = 0, ns(), Rn = null, (ze.length || Wt.length) && rs();
  }
}
let et = null, is = null;
function Fn(e) {
  const t = et;
  return et = e, is = e && e.type.__scopeId || null, t;
}
function Ol(e, t = et, n) {
  if (!t || e._n)
    return e;
  const r = (...i) => {
    r._d && fi(-1);
    const s = Fn(t), l = Ht.length;
    let a;
    try {
      a = e(...i);
    } finally {
      for (let o = Ht.length; o > l; o--) Es();
      Fn(s), r._d && fi(1);
    }
    return a;
  };
  return r._n = !0, r._c = !0, r._d = !0, r;
}
function Il(e, t) {
  if (et === null)
    return e;
  const n = Qn(et), r = e.dirs || (e.dirs = []);
  for (let i = 0; i < t.length; i++) {
    let [s, l, a, o = ve] = t[i];
    s && (Z(s) && (s = {
      mounted: s,
      updated: s
    }), s.deep && _t(l), r.push({
      dir: s,
      instance: n,
      value: l,
      oldValue: void 0,
      arg: a,
      modifiers: o
    }));
  }
  return e;
}
function It(e, t, n, r) {
  const i = e.dirs, s = t && t.dirs;
  for (let l = 0; l < i.length; l++) {
    const a = i[l];
    s && (a.oldValue = s[l].value);
    let o = a.dir[r];
    o && (wt(), lt(o, n, 8, [
      e.el,
      a,
      e,
      t
    ]), xt());
  }
}
function Pl(e, t) {
  if (qe) {
    let n = qe.provides;
    const r = qe.parent && qe.parent.provides;
    r === n && (n = qe.provides = Object.create(r)), n[e] = t;
  }
}
function An(e, t, n = !1) {
  const r = Io();
  if (r || zt) {
    let i = zt ? zt._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
    if (i && e in i)
      return i[e];
    if (arguments.length > 1)
      return n && Z(t) ? t.call(r && r.proxy) : t;
  }
}
const Rl = /* @__PURE__ */ Symbol.for("v-scx"), Fl = () => An(Rl);
function sn(e, t, n) {
  return ss(e, t, n);
}
function ss(e, t, n = ve) {
  const { immediate: r, deep: i, flush: s, once: l } = n, a = Ve({}, n), o = t && r || !t && s !== "post";
  let d;
  if (pn) {
    if (s === "sync") {
      const $ = Fl();
      d = $.__watcherHandles || ($.__watcherHandles = []);
    } else if (!o) {
      const $ = () => {
      };
      return $.stop = dt, $.resume = dt, $.pause = dt, $;
    }
  }
  const c = qe;
  a.call = ($, B, F) => lt($, c, B, F);
  let g = !1;
  s === "post" ? a.scheduler = ($) => {
    We($, c && c.suspense);
  } : s !== "sync" && (g = !0, a.scheduler = ($, B) => {
    B ? $() : Hr($);
  }), a.augmentJob = ($) => {
    t && ($.flags |= 4), g && ($.flags |= 2, c && ($.id = c.uid, $.i = c));
  };
  const S = kl(e, t, a);
  return pn && (d ? d.push(S) : o && S()), S;
}
function Ll(e, t, n) {
  const r = this.proxy, i = ke(e) ? e.includes(".") ? ls(r, e) : () => r[e] : e.bind(r, r);
  let s;
  Z(t) ? s = t : (s = t.handler, n = t);
  const l = yn(this), a = ss(i, s.bind(r), n);
  return l(), a;
}
function ls(e, t) {
  const n = t.split(".");
  return () => {
    let r = e;
    for (let i = 0; i < n.length && r; i++)
      r = r[n[i]];
    return r;
  };
}
const St = /* @__PURE__ */ new WeakMap(), os = /* @__PURE__ */ Symbol("_vte"), Jn = (e) => e.__isTeleport, Ft = (e) => e && (e.disabled || e.disabled === ""), Dl = (e) => e && (e.defer || e.defer === ""), Qr = (e) => typeof SVGElement < "u" && e instanceof SVGElement, ei = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, yr = (e, t) => {
  const n = e && e.to;
  return ke(n) ? t ? t(n) : null : n;
}, Hl = {
  name: "Teleport",
  __isTeleport: !0,
  process(e, t, n, r, i, s, l, a, o, d) {
    const {
      mc: c,
      pc: g,
      pbc: S,
      o: { insert: $, querySelector: B, createText: F, createComment: z, parentNode: q }
    } = d, O = Ft(t.props);
    let { dynamicChildren: ee } = t;
    const H = (J, ie, X) => {
      J.shapeFlag & 16 && c(
        J.children,
        ie,
        X,
        i,
        s,
        l,
        a,
        o
      );
    }, oe = (J = t) => {
      const ie = Ft(J.props), X = J.target = yr(J.props, B), P = br(X, J, F, $);
      X && (l !== "svg" && Qr(X) ? l = "svg" : l !== "mathml" && ei(X) && (l = "mathml"), i && i.isCE && (i.ce._teleportTargets || (i.ce._teleportTargets = /* @__PURE__ */ new Set())).add(X), ie || (H(J, X, P), Xt(J, !1)));
    }, Ie = (J) => {
      const ie = () => {
        if (St.get(J) === ie) {
          if (St.delete(J), Ft(J.props)) {
            const X = q(J.el) || n;
            H(J, X, J.anchor), Xt(J, !0);
          }
          oe(J);
        }
      };
      St.set(J, ie), We(ie, s);
    };
    if (e == null) {
      const J = t.el = F(""), ie = t.anchor = F("");
      if ($(J, n, r), $(ie, n, r), Dl(t.props) || s && s.pendingBranch) {
        Ie(t);
        return;
      }
      O && (H(t, n, ie), Xt(t, !0)), oe();
    } else {
      t.el = e.el;
      const J = t.anchor = e.anchor, ie = St.get(e);
      if (ie) {
        ie.flags |= 8, St.delete(e), Ie(t);
        return;
      }
      t.targetStart = e.targetStart;
      const X = t.target = e.target, P = t.targetAnchor = e.targetAnchor, Re = Ft(e.props), fe = Re ? n : X, Ge = Re ? J : P;
      if (l === "svg" || Qr(X) ? l = "svg" : (l === "mathml" || ei(X)) && (l = "mathml"), ee ? (S(
        e.dynamicChildren,
        ee,
        fe,
        i,
        s,
        l,
        a
      ), Wr(e, t, !0)) : o || g(
        e,
        t,
        fe,
        Ge,
        i,
        s,
        l,
        a,
        !1
      ), O)
        Re ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : Mn(
          t,
          n,
          J,
          d,
          1
        );
      else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
        const be = yr(t.props, B);
        be && (t.target = be, Mn(
          t,
          be,
          null,
          d,
          0
        ));
      } else Re && Mn(
        t,
        X,
        P,
        d,
        1
      );
      Xt(t, O);
    }
  },
  remove(e, t, n, { um: r, o: { remove: i } }, s) {
    const {
      shapeFlag: l,
      children: a,
      anchor: o,
      targetStart: d,
      targetAnchor: c,
      target: g,
      props: S
    } = e, $ = Ft(S), B = s || !$, F = St.get(e);
    if (F && (F.flags |= 8, St.delete(e)), g && (i(d), i(c)), s && i(o), !F && ($ || g) && l & 16)
      for (let z = 0; z < a.length; z++) {
        const q = a[z];
        r(
          q,
          t,
          n,
          B,
          !!q.dynamicChildren
        );
      }
  },
  move: Mn,
  hydrate: Vl
};
function Mn(e, t, n, { o: { insert: r }, m: i }, s = 2) {
  s === 0 && r(e.targetAnchor, t, n);
  const { el: l, anchor: a, shapeFlag: o, children: d, props: c } = e, g = s === 2;
  if (g && r(l, t, n), !St.has(e) && (!g || Ft(c)) && o & 16)
    for (let S = 0; S < d.length; S++)
      i(
        d[S],
        t,
        n,
        2
      );
  g && r(a, t, n);
}
function Vl(e, t, n, r, i, s, {
  o: { nextSibling: l, parentNode: a, querySelector: o, insert: d, createText: c }
}, g) {
  function S(z, q) {
    let O = q;
    for (; O; ) {
      if (O && O.nodeType === 8) {
        if (O.data === "teleport start anchor")
          t.targetStart = O;
        else if (O.data === "teleport anchor") {
          t.targetAnchor = O, z._lpa = t.targetAnchor && l(t.targetAnchor);
          break;
        }
      }
      O = l(O);
    }
  }
  function $(z, q) {
    q.anchor = g(
      l(z),
      q,
      a(z),
      n,
      r,
      i,
      s
    );
  }
  const B = t.target = yr(
    t.props,
    o
  ), F = Ft(t.props);
  if (B) {
    const z = B._lpa || B.firstChild;
    t.shapeFlag & 16 && (F ? ($(e, t), S(B, z), t.targetAnchor || br(
      B,
      t,
      c,
      d,
      // if target is the same as the main view, insert anchors before current node
      // to avoid hydrating mismatch
      a(e) === B ? e : null
    )) : (t.anchor = l(e), S(B, z), t.targetAnchor || br(B, t, c, d), g(
      z && l(z),
      t,
      B,
      n,
      r,
      i,
      s
    ))), Xt(t, F);
  } else F && t.shapeFlag & 16 && ($(e, t), t.targetStart = e, t.targetAnchor = l(e));
  return t.anchor && l(t.anchor);
}
const Nl = Hl;
function Xt(e, t) {
  const n = e.ctx;
  if (n && n.ut) {
    let r, i;
    for (t ? (r = e.el, i = e.anchor) : (r = e.targetStart, i = e.targetAnchor); r && r !== i; )
      r.nodeType === 1 && r.setAttribute("data-v-owner", n.uid), r = r.nextSibling;
    n.ut();
  }
}
function br(e, t, n, r, i = null) {
  const s = t.targetStart = n(""), l = t.targetAnchor = n("");
  return s[os] = l, e && (r(s, e, i), r(l, e, i)), l;
}
const lr = /* @__PURE__ */ Symbol("_leaveCb");
function jl(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const n of e)
      if (n.type !== Mt) {
        t = n;
        break;
      }
  }
  return t;
}
function as(e) {
  if (!Nr(e))
    return Jn(e.type) && e.children ? jl(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: n } = e;
  if (n) {
    if (t & 16)
      return n[0];
    if (t & 32 && Z(n.default))
      return n.default();
  }
}
function Vr(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const n = e.component.subTree;
    Vr(
      Jn(n.type) && as(n) || n,
      t
    );
  } else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function Zn(e, t) {
  return Z(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    Ve({ name: e.name }, t, { setup: e })
  ) : e;
}
function us(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function ti(e, t) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
const Ln = /* @__PURE__ */ new WeakMap();
function ln(e, t, n, r, i = !1) {
  if (W(e)) {
    e.forEach(
      (F, z) => ln(
        F,
        t && (W(t) ? t[z] : t),
        n,
        r,
        i
      )
    );
    return;
  }
  if (on(r) && !i) {
    r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && ln(e, t, n, r.component.subTree);
    return;
  }
  const s = r.shapeFlag & 4 ? Qn(r.component) : r.el, l = i ? null : s, { i: a, r: o } = e, d = t && t.r, c = a.refs === ve ? a.refs = {} : a.refs, g = a.setupState, S = /* @__PURE__ */ ue(g), $ = g === ve ? Ei : (F) => ti(c, F) ? !1 : ce(S, F), B = (F, z) => !(z && ti(c, z));
  if (d != null && d !== o) {
    if (ni(t), ke(d))
      c[d] = null, $(d) && (g[d] = null);
    else if (/* @__PURE__ */ je(d)) {
      const F = t;
      B(d, F.k) && (d.value = null), F.k && (c[F.k] = null);
    }
  }
  if (Z(o))
    mn(o, a, 12, [l, c]);
  else {
    const F = ke(o), z = /* @__PURE__ */ je(o);
    if (F || z) {
      const q = () => {
        if (e.f) {
          const O = F ? $(o) ? g[o] : c[o] : B() || !e.k ? o.value : c[e.k];
          if (i)
            W(O) && kr(O, s);
          else if (W(O))
            O.includes(s) || O.push(s);
          else if (F)
            c[o] = [s], $(o) && (g[o] = c[o]);
          else {
            const ee = [s];
            B(o, e.k) && (o.value = ee), e.k && (c[e.k] = ee);
          }
        } else F ? (c[o] = l, $(o) && (g[o] = l)) : z && (B(o, e.k) && (o.value = l), e.k && (c[e.k] = l));
      };
      if (l) {
        const O = () => {
          q(), Ln.delete(e);
        };
        O.id = -1, Ln.set(e, O), We(O, n);
      } else
        ni(e), q();
    }
  }
}
function ni(e) {
  const t = Ln.get(e);
  t && (t.flags |= 8, Ln.delete(e));
}
Wn().requestIdleCallback;
Wn().cancelIdleCallback;
const on = (e) => !!e.type.__asyncLoader, Nr = (e) => e.type.__isKeepAlive;
function Ul(e, t) {
  cs(e, "a", t);
}
function Bl(e, t) {
  cs(e, "da", t);
}
function cs(e, t, n = qe) {
  const r = e.__wdc || (e.__wdc = () => {
    let i = n;
    for (; i; ) {
      if (i.isDeactivated)
        return;
      i = i.parent;
    }
    return e();
  });
  if (Gn(t, r, n), n) {
    let i = n.parent;
    for (; i && i.parent; )
      Nr(i.parent.vnode) && Kl(r, t, n, i), i = i.parent;
  }
}
function Kl(e, t, n, r) {
  const i = Gn(
    t,
    e,
    r,
    !0
    /* prepend */
  );
  fs(() => {
    kr(r[t], i);
  }, n);
}
function Gn(e, t, n = qe, r = !1) {
  if (n) {
    const i = n[e] || (n[e] = []), s = t.__weh || (t.__weh = (...l) => {
      wt();
      const a = yn(n), o = lt(t, n, e, l);
      return a(), xt(), o;
    });
    return r ? i.unshift(s) : i.push(s), s;
  }
}
const Ct = (e) => (t, n = qe) => {
  (!pn || e === "sp") && Gn(e, (...r) => t(...r), n);
}, Wl = Ct("bm"), jr = Ct("m"), zl = Ct(
  "bu"
), ql = Ct("u"), Ur = Ct(
  "bum"
), fs = Ct("um"), Jl = Ct(
  "sp"
), Zl = Ct("rtg"), Gl = Ct("rtc");
function Yl(e, t = qe) {
  Gn("ec", e, t);
}
const Xl = /* @__PURE__ */ Symbol.for("v-ndc");
function Be(e, t, n, r) {
  let i;
  const s = n, l = W(e);
  if (l || ke(e)) {
    const a = l && /* @__PURE__ */ Et(e);
    let o = !1, d = !1;
    a && (o = !/* @__PURE__ */ tt(e), d = /* @__PURE__ */ pt(e), e = zn(e)), i = new Array(e.length);
    for (let c = 0, g = e.length; c < g; c++)
      i[c] = t(
        o ? d ? $t(nt(e[c])) : nt(e[c]) : e[c],
        c,
        void 0,
        s
      );
  } else if (typeof e == "number") {
    i = new Array(e);
    for (let a = 0; a < e; a++)
      i[a] = t(a + 1, a, void 0, s);
  } else if (de(e))
    if (e[Symbol.iterator])
      i = Array.from(
        e,
        (a, o) => t(a, o, void 0, s)
      );
    else {
      const a = Object.keys(e);
      i = new Array(a.length);
      for (let o = 0, d = a.length; o < d; o++) {
        const c = a[o];
        i[o] = t(e[c], c, o, s);
      }
    }
  else
    i = [];
  return i;
}
const _r = (e) => e ? Is(e) ? Qn(e) : _r(e.parent) : null, an = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Ve(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => _r(e.parent),
    $root: (e) => _r(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => hs(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      Hr(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = Dr.bind(e.proxy)),
    $watch: (e) => Ll.bind(e)
  })
), or = (e, t) => e !== ve && !e.__isScriptSetup && ce(e, t), Ql = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: r, data: i, props: s, accessCache: l, type: a, appContext: o } = e;
    if (t[0] !== "$") {
      const S = l[t];
      if (S !== void 0)
        switch (S) {
          case 1:
            return r[t];
          case 2:
            return i[t];
          case 4:
            return n[t];
          case 3:
            return s[t];
        }
      else {
        if (or(r, t))
          return l[t] = 1, r[t];
        if (i !== ve && ce(i, t))
          return l[t] = 2, i[t];
        if (ce(s, t))
          return l[t] = 3, s[t];
        if (n !== ve && ce(n, t))
          return l[t] = 4, n[t];
        wr && (l[t] = 0);
      }
    }
    const d = an[t];
    let c, g;
    if (d)
      return t === "$attrs" && Ne(e.attrs, "get", ""), d(e);
    if (
      // css module (injected by vue-loader)
      (c = a.__cssModules) && (c = c[t])
    )
      return c;
    if (n !== ve && ce(n, t))
      return l[t] = 4, n[t];
    if (
      // global properties
      g = o.config.globalProperties, ce(g, t)
    )
      return g[t];
  },
  set({ _: e }, t, n) {
    const { data: r, setupState: i, ctx: s } = e;
    return or(i, t) ? (i[t] = n, !0) : r !== ve && ce(r, t) ? (r[t] = n, !0) : ce(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (s[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: s, type: l }
  }, a) {
    let o;
    return !!(n[a] || e !== ve && a[0] !== "$" && ce(e, a) || or(t, a) || ce(s, a) || ce(r, a) || ce(an, a) || ce(i.config.globalProperties, a) || (o = l.__cssModules) && o[a]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : ce(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function ri(e) {
  return W(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let wr = !0;
function eo(e) {
  const t = hs(e), n = e.proxy, r = e.ctx;
  wr = !1, t.beforeCreate && ii(t.beforeCreate, e, "bc");
  const {
    // state
    data: i,
    computed: s,
    methods: l,
    watch: a,
    provide: o,
    inject: d,
    // lifecycle
    created: c,
    beforeMount: g,
    mounted: S,
    beforeUpdate: $,
    updated: B,
    activated: F,
    deactivated: z,
    beforeDestroy: q,
    beforeUnmount: O,
    destroyed: ee,
    unmounted: H,
    render: oe,
    renderTracked: Ie,
    renderTriggered: J,
    errorCaptured: ie,
    serverPrefetch: X,
    // public API
    expose: P,
    inheritAttrs: Re,
    // assets
    components: fe,
    directives: Ge,
    filters: be
  } = t;
  if (d && to(d, r, null), l)
    for (const ne in l) {
      const se = l[ne];
      Z(se) && (r[ne] = se.bind(n));
    }
  if (i) {
    const ne = i.call(n, n);
    de(ne) && (e.data = /* @__PURE__ */ Rr(ne));
  }
  if (wr = !0, s)
    for (const ne in s) {
      const se = s[ne], k = Z(se) ? se.bind(n, n) : Z(se.get) ? se.get.bind(n, n) : dt, T = !Z(se) && Z(se.set) ? se.set.bind(n) : dt, N = Pe({
        get: k,
        set: T
      });
      Object.defineProperty(r, ne, {
        enumerable: !0,
        configurable: !0,
        get: () => N.value,
        set: (Q) => N.value = Q
      });
    }
  if (a)
    for (const ne in a)
      ds(a[ne], r, n, ne);
  if (o) {
    const ne = Z(o) ? o.call(n) : o;
    Reflect.ownKeys(ne).forEach((se) => {
      Pl(se, ne[se]);
    });
  }
  c && ii(c, e, "c");
  function Ee(ne, se) {
    W(se) ? se.forEach((k) => ne(k.bind(n))) : se && ne(se.bind(n));
  }
  if (Ee(Wl, g), Ee(jr, S), Ee(zl, $), Ee(ql, B), Ee(Ul, F), Ee(Bl, z), Ee(Yl, ie), Ee(Gl, Ie), Ee(Zl, J), Ee(Ur, O), Ee(fs, H), Ee(Jl, X), W(P))
    if (P.length) {
      const ne = e.exposed || (e.exposed = {});
      P.forEach((se) => {
        Object.defineProperty(ne, se, {
          get: () => n[se],
          set: (k) => n[se] = k,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  oe && e.render === dt && (e.render = oe), Re != null && (e.inheritAttrs = Re), fe && (e.components = fe), Ge && (e.directives = Ge), X && us(e);
}
function to(e, t, n = dt) {
  W(e) && (e = xr(e));
  for (const r in e) {
    const i = e[r];
    let s;
    de(i) ? "default" in i ? s = An(
      i.from || r,
      i.default,
      !0
    ) : s = An(i.from || r) : s = An(i), /* @__PURE__ */ je(s) ? Object.defineProperty(t, r, {
      enumerable: !0,
      configurable: !0,
      get: () => s.value,
      set: (l) => s.value = l
    }) : t[r] = s;
  }
}
function ii(e, t, n) {
  lt(
    W(e) ? e.map((r) => r.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function ds(e, t, n, r) {
  let i = r.includes(".") ? ls(n, r) : () => n[r];
  if (ke(e)) {
    const s = t[e];
    Z(s) && sn(i, s);
  } else if (Z(e))
    sn(i, e.bind(n));
  else if (de(e))
    if (W(e))
      e.forEach((s) => ds(s, t, n, r));
    else {
      const s = Z(e.handler) ? e.handler.bind(n) : t[e.handler];
      Z(s) && sn(i, s, e);
    }
}
function hs(e) {
  const t = e.type, { mixins: n, extends: r } = t, {
    mixins: i,
    optionsCache: s,
    config: { optionMergeStrategies: l }
  } = e.appContext, a = s.get(t);
  let o;
  return a ? o = a : !i.length && !n && !r ? o = t : (o = {}, i.length && i.forEach(
    (d) => Dn(o, d, l, !0)
  ), Dn(o, t, l)), de(t) && s.set(t, o), o;
}
function Dn(e, t, n, r = !1) {
  const { mixins: i, extends: s } = t;
  s && Dn(e, s, n, !0), i && i.forEach(
    (l) => Dn(e, l, n, !0)
  );
  for (const l in t)
    if (!(r && l === "expose")) {
      const a = no[l] || n && n[l];
      e[l] = a ? a(e[l], t[l]) : t[l];
    }
  return e;
}
const no = {
  data: si,
  props: li,
  emits: li,
  // objects
  methods: Qt,
  computed: Qt,
  // lifecycle
  beforeCreate: Ke,
  created: Ke,
  beforeMount: Ke,
  mounted: Ke,
  beforeUpdate: Ke,
  updated: Ke,
  beforeDestroy: Ke,
  beforeUnmount: Ke,
  destroyed: Ke,
  unmounted: Ke,
  activated: Ke,
  deactivated: Ke,
  errorCaptured: Ke,
  serverPrefetch: Ke,
  // assets
  components: Qt,
  directives: Qt,
  // watch
  watch: io,
  // provide / inject
  provide: si,
  inject: ro
};
function si(e, t) {
  return t ? e ? function() {
    return Ve(
      Z(e) ? e.call(this, this) : e,
      Z(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function ro(e, t) {
  return Qt(xr(e), xr(t));
}
function xr(e) {
  if (W(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function Ke(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Qt(e, t) {
  return e ? Ve(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function li(e, t) {
  return e ? W(e) && W(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : Ve(
    /* @__PURE__ */ Object.create(null),
    ri(e),
    ri(t ?? {})
  ) : t;
}
function io(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = Ve(/* @__PURE__ */ Object.create(null), e);
  for (const r in t)
    n[r] = Ke(e[r], t[r]);
  return n;
}
function ps() {
  return {
    app: null,
    config: {
      isNativeTag: Ei,
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
let so = 0;
function lo(e, t) {
  return function(r, i = null) {
    Z(r) || (r = Ve({}, r)), i != null && !de(i) && (i = null);
    const s = ps(), l = /* @__PURE__ */ new WeakSet(), a = [];
    let o = !1;
    const d = s.app = {
      _uid: so++,
      _component: r,
      _props: i,
      _container: null,
      _context: s,
      _instance: null,
      version: Ho,
      get config() {
        return s.config;
      },
      set config(c) {
      },
      use(c, ...g) {
        return l.has(c) || (c && Z(c.install) ? (l.add(c), c.install(d, ...g)) : Z(c) && (l.add(c), c(d, ...g))), d;
      },
      mixin(c) {
        return s.mixins.includes(c) || s.mixins.push(c), d;
      },
      component(c, g) {
        return g ? (s.components[c] = g, d) : s.components[c];
      },
      directive(c, g) {
        return g ? (s.directives[c] = g, d) : s.directives[c];
      },
      mount(c, g, S) {
        if (!o) {
          const $ = d._ceVNode || Me(r, i);
          return $.appContext = s, S === !0 ? S = "svg" : S === !1 && (S = void 0), e($, c, S), o = !0, d._container = c, c.__vue_app__ = d, Qn($.component);
        }
      },
      onUnmount(c) {
        a.push(c);
      },
      unmount() {
        o && (lt(
          a,
          d._instance,
          16
        ), e(null, d._container), delete d._container.__vue_app__);
      },
      provide(c, g) {
        return s.provides[c] = g, d;
      },
      runWithContext(c) {
        const g = zt;
        zt = d;
        try {
          return c();
        } finally {
          zt = g;
        }
      }
    };
    return d;
  };
}
let zt = null;
const oo = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${it(t)}Modifiers`] || e[`${Nt(t)}Modifiers`];
function ao(e, t, ...n) {
  if (e.isUnmounted) return;
  const r = e.vnode.props || ve;
  let i = n;
  const s = t.startsWith("update:"), l = s && oo(r, t.slice(7));
  l && (l.trim && (i = n.map((c) => ke(c) ? c.trim() : c)), l.number && (i = i.map(Ri)));
  let a, o = r[a = tr(t)] || // also try camelCase event handler (#2249)
  r[a = tr(it(t))];
  !o && s && (o = r[a = tr(Nt(t))]), o && lt(
    o,
    e,
    6,
    i
  );
  const d = r[a + "Once"];
  if (d) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[a])
      return;
    e.emitted[a] = !0, lt(
      d,
      e,
      6,
      i
    );
  }
}
const uo = /* @__PURE__ */ new WeakMap();
function gs(e, t, n = !1) {
  const r = n ? uo : t.emitsCache, i = r.get(e);
  if (i !== void 0)
    return i;
  const s = e.emits;
  let l = {}, a = !1;
  if (!Z(e)) {
    const o = (d) => {
      const c = gs(d, t, !0);
      c && (a = !0, Ve(l, c));
    };
    !n && t.mixins.length && t.mixins.forEach(o), e.extends && o(e.extends), e.mixins && e.mixins.forEach(o);
  }
  return !s && !a ? (de(e) && r.set(e, null), null) : (W(s) ? s.forEach((o) => l[o] = null) : Ve(l, s), de(e) && r.set(e, l), l);
}
function Yn(e, t) {
  return !e || !Un(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), ce(e, t[0].toLowerCase() + t.slice(1)) || ce(e, Nt(t)) || ce(e, t));
}
function oi(e) {
  const {
    type: t,
    vnode: n,
    proxy: r,
    withProxy: i,
    propsOptions: [s],
    slots: l,
    attrs: a,
    emit: o,
    render: d,
    renderCache: c,
    props: g,
    data: S,
    setupState: $,
    ctx: B,
    inheritAttrs: F
  } = e, z = Fn(e);
  let q, O;
  try {
    if (n.shapeFlag & 4) {
      const H = i || r, oe = H;
      q = ct(
        d.call(
          oe,
          H,
          c,
          g,
          $,
          S,
          B
        )
      ), O = a;
    } else {
      const H = t;
      q = ct(
        H.length > 1 ? H(
          g,
          { attrs: a, slots: l, emit: o }
        ) : H(
          g,
          null
        )
      ), O = t.props ? a : co(a);
    }
  } catch (H) {
    Ht.length = 0, qn(H, e, 1), q = Me(Mt);
  }
  let ee = q;
  if (O && F !== !1) {
    const H = Object.keys(O), { shapeFlag: oe } = ee;
    H.length && oe & 7 && (s && H.some(Bn) && (O = fo(
      O,
      s
    )), ee = qt(ee, O, !1, !0));
  }
  if (n.dirs && (ee = qt(ee, null, !1, !0), ee.dirs = ee.dirs ? ee.dirs.concat(n.dirs) : n.dirs), n.transition) {
    const H = Jn(ee.type) && as(ee) || ee;
    Vr(H, n.transition);
  }
  return q = ee, Fn(z), q;
}
const co = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || Un(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, fo = (e, t) => {
  const n = {};
  for (const r in e)
    (!Bn(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
  return n;
};
function ho(e, t, n) {
  const { props: r, children: i, component: s } = e, { props: l, children: a, patchFlag: o } = t, d = s.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && o >= 0) {
    if (o & 1024)
      return !0;
    if (o & 16)
      return r ? ai(r, l, d) : !!l;
    if (o & 8) {
      const c = t.dynamicProps;
      for (let g = 0; g < c.length; g++) {
        const S = c[g];
        if (vs(l, r, S) && !Yn(d, S))
          return !0;
      }
    }
  } else
    return (i || a) && (!a || !a.$stable) ? !0 : r === l ? !1 : r ? l ? ai(r, l, d) : !0 : !!l;
  return !1;
}
function ai(e, t, n) {
  const r = Object.keys(t);
  if (r.length !== Object.keys(e).length)
    return !0;
  for (let i = 0; i < r.length; i++) {
    const s = r[i];
    if (vs(t, e, s) && !Yn(n, s))
      return !0;
  }
  return !1;
}
function vs(e, t, n) {
  const r = e[n], i = t[n];
  return n === "style" && de(r) && de(i) ? !At(r, i) : r !== i;
}
function po({ vnode: e, parent: t, suspense: n }, r) {
  for (; t; ) {
    const i = t.subTree;
    if (i.suspense && i.suspense.activeBranch === e && (i.suspense.vnode.el = i.el = r, e = i), i === e)
      (e = t.vnode).el = r, t = t.parent;
    else
      break;
  }
  n && n.activeBranch === e && (n.vnode.el = r);
}
const ms = {}, ys = () => Object.create(ms), bs = (e) => Object.getPrototypeOf(e) === ms;
function go(e, t, n, r = !1) {
  const i = {}, s = ys();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), _s(e, t, i, s);
  for (const l in e.propsOptions[0])
    l in i || (i[l] = void 0);
  n ? e.props = r ? i : /* @__PURE__ */ bl(i) : e.type.props ? e.props = i : e.props = s, e.attrs = s;
}
function vo(e, t, n, r) {
  const {
    props: i,
    attrs: s,
    vnode: { patchFlag: l }
  } = e, a = /* @__PURE__ */ ue(i), [o] = e.propsOptions;
  let d = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (r || l > 0) && !(l & 16)
  ) {
    if (l & 8) {
      const c = e.vnode.dynamicProps;
      for (let g = 0; g < c.length; g++) {
        let S = c[g];
        if (Yn(e.emitsOptions, S))
          continue;
        const $ = t[S];
        if (o)
          if (ce(s, S))
            $ !== s[S] && (s[S] = $, d = !0);
          else {
            const B = it(S);
            i[B] = Mr(
              o,
              a,
              B,
              $,
              e,
              !1
            );
          }
        else
          $ !== s[S] && (s[S] = $, d = !0);
      }
    }
  } else {
    _s(e, t, i, s) && (d = !0);
    let c;
    for (const g in a)
      (!t || // for camelCase
      !ce(t, g) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((c = Nt(g)) === g || !ce(t, c))) && (o ? n && // for camelCase
      (n[g] !== void 0 || // for kebab-case
      n[c] !== void 0) && (i[g] = Mr(
        o,
        a,
        g,
        void 0,
        e,
        !0
      )) : delete i[g]);
    if (s !== a)
      for (const g in s)
        (!t || !ce(t, g)) && (delete s[g], d = !0);
  }
  d && bt(e.attrs, "set", "");
}
function _s(e, t, n, r) {
  const [i, s] = e.propsOptions;
  let l = !1, a;
  if (t)
    for (let o in t) {
      if (tn(o))
        continue;
      const d = t[o];
      let c;
      i && ce(i, c = it(o)) ? !s || !s.includes(c) ? n[c] = d : (a || (a = {}))[c] = d : Yn(e.emitsOptions, o) || (!(o in r) || d !== r[o]) && (r[o] = d, l = !0);
    }
  if (s) {
    const o = /* @__PURE__ */ ue(n), d = a || ve;
    for (let c = 0; c < s.length; c++) {
      const g = s[c];
      n[g] = Mr(
        i,
        o,
        g,
        d[g],
        e,
        !ce(d, g)
      );
    }
  }
  return l;
}
function Mr(e, t, n, r, i, s) {
  const l = e[n];
  if (l != null) {
    const a = ce(l, "default");
    if (a && r === void 0) {
      const o = l.default;
      if (l.type !== Function && !l.skipFactory && Z(o)) {
        const { propsDefaults: d } = i;
        if (n in d)
          r = d[n];
        else {
          const c = yn(i);
          r = d[n] = o.call(
            null,
            t
          ), c();
        }
      } else
        r = o;
      i.ce && i.ce._setProp(n, r);
    }
    l[
      0
      /* shouldCast */
    ] && (s && !a ? r = !1 : l[
      1
      /* shouldCastTrue */
    ] && (r === "" || r === Nt(n)) && (r = !0));
  }
  return r;
}
const mo = /* @__PURE__ */ new WeakMap();
function ws(e, t, n = !1) {
  const r = n ? mo : t.propsCache, i = r.get(e);
  if (i)
    return i;
  const s = e.props, l = {}, a = [];
  let o = !1;
  if (!Z(e)) {
    const c = (g) => {
      o = !0;
      const [S, $] = ws(g, t, !0);
      Ve(l, S), $ && a.push(...$);
    };
    !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  if (!s && !o)
    return de(e) && r.set(e, Lt), Lt;
  if (W(s))
    for (let c = 0; c < s.length; c++) {
      const g = it(s[c]);
      ui(g) && (l[g] = ve);
    }
  else if (s)
    for (const c in s) {
      const g = it(c);
      if (ui(g)) {
        const S = s[c], $ = l[g] = W(S) || Z(S) ? { type: S } : Ve({}, S), B = $.type;
        let F = !1, z = !0;
        if (W(B))
          for (let q = 0; q < B.length; ++q) {
            const O = B[q], ee = Z(O) && O.name;
            if (ee === "Boolean") {
              F = !0;
              break;
            } else ee === "String" && (z = !1);
          }
        else
          F = Z(B) && B.name === "Boolean";
        $[
          0
          /* shouldCast */
        ] = F, $[
          1
          /* shouldCastTrue */
        ] = z, (F || ce($, "default")) && a.push(g);
      }
    }
  const d = [l, a];
  return de(e) && r.set(e, d), d;
}
function ui(e) {
  return e[0] !== "$" && !tn(e);
}
const Br = (e) => e === "_" || e === "_ctx" || e === "$stable", Kr = (e) => W(e) ? e.map(ct) : [ct(e)], yo = (e, t, n) => {
  if (t._n)
    return t;
  const r = Ol((...i) => Kr(t(...i)), n);
  return r._c = !1, r;
}, xs = (e, t, n) => {
  const r = e._ctx;
  for (const i in e) {
    if (Br(i)) continue;
    const s = e[i];
    if (Z(s))
      t[i] = yo(i, s, r);
    else if (s != null) {
      const l = Kr(s);
      t[i] = () => l;
    }
  }
}, Ms = (e, t) => {
  const n = Kr(t);
  e.slots.default = () => n;
}, Cs = (e, t, n) => {
  for (const r in t)
    (n || !Br(r)) && (e[r] = t[r]);
}, bo = (e, t, n) => {
  const r = e.slots = ys();
  if (e.vnode.shapeFlag & 32) {
    const i = t._;
    i ? (Cs(r, t, n), n && Pi(r, "_", i, !0)) : xs(t, r);
  } else t && Ms(e, t);
}, _o = (e, t, n) => {
  const { vnode: r, slots: i } = e;
  let s = !0, l = ve;
  if (r.shapeFlag & 32) {
    const a = t._;
    a ? n && a === 1 ? s = !1 : Cs(i, t, n) : (s = !t.$stable, xs(t, i)), l = t;
  } else t && (Ms(e, t), l = { default: 1 });
  if (s)
    for (const a in i)
      !Br(a) && l[a] == null && delete i[a];
}, We = So;
function wo(e) {
  return xo(e);
}
function xo(e, t) {
  const n = Wn();
  n.__VUE__ = !0;
  const {
    insert: r,
    remove: i,
    patchProp: s,
    createElement: l,
    createText: a,
    createComment: o,
    setText: d,
    setElementText: c,
    parentNode: g,
    nextSibling: S,
    setScopeId: $ = dt,
    insertStaticContent: B
  } = e, F = (u, f, v, x = null, b = null, w = null, A = void 0, M = null, E = !!f.dynamicChildren) => {
    if (u === f)
      return;
    u && !Gt(u, f) && (x = me(u), Q(u, b, w, !0), u = null), f.patchFlag === -2 && (E = !1, f.dynamicChildren = null), f.dynamicChildren && u && u.dynamicChildren && u.dynamicChildren.hasOnce && (f.dynamicChildren === Lt && (f.dynamicChildren = []), f.dynamicChildren.hasOnce = !0);
    const { type: y, ref: j, shapeFlag: I } = f;
    switch (y) {
      case Xn:
        z(u, f, v, x);
        break;
      case Mt:
        q(u, f, v, x);
        break;
      case ur:
        u == null && O(f, v, x, A);
        break;
      case ge:
        fe(
          u,
          f,
          v,
          x,
          b,
          w,
          A,
          M,
          E
        );
        break;
      default:
        I & 1 ? oe(
          u,
          f,
          v,
          x,
          b,
          w,
          A,
          M,
          E
        ) : I & 6 ? Ge(
          u,
          f,
          v,
          x,
          b,
          w,
          A,
          M,
          E
        ) : (I & 64 || I & 128) && y.process(
          u,
          f,
          v,
          x,
          b,
          w,
          A,
          M,
          E,
          pe
        );
    }
    j != null && b ? ln(j, u && u.ref, w, f || u, !f) : j == null && u && u.ref != null && ln(u.ref, null, w, u, !0);
  }, z = (u, f, v, x) => {
    if (u == null)
      r(
        f.el = a(f.children),
        v,
        x
      );
    else {
      const b = f.el = u.el;
      f.children !== u.children && d(b, f.children);
    }
  }, q = (u, f, v, x) => {
    u == null ? r(
      f.el = o(f.children || ""),
      v,
      x
    ) : f.el = u.el;
  }, O = (u, f, v, x) => {
    [u.el, u.anchor] = B(
      u.children,
      f,
      v,
      x,
      u.el,
      u.anchor
    );
  }, ee = ({ el: u, anchor: f }, v, x) => {
    let b;
    for (; u && u !== f; )
      b = S(u), r(u, v, x), u = b;
    r(f, v, x);
  }, H = ({ el: u, anchor: f }) => {
    let v;
    for (; u && u !== f; )
      v = S(u), i(u), u = v;
    i(f);
  }, oe = (u, f, v, x, b, w, A, M, E) => {
    if (f.type === "svg" ? A = "svg" : f.type === "math" && (A = "mathml"), u == null)
      Ie(
        f,
        v,
        x,
        b,
        w,
        A,
        M,
        E
      );
    else {
      const y = u.el && u.el._isVueCE ? u.el : null;
      try {
        y && y._beginPatch(), X(
          u,
          f,
          b,
          w,
          A,
          M,
          E
        );
      } finally {
        y && y._endPatch();
      }
    }
  }, Ie = (u, f, v, x, b, w, A, M) => {
    let E, y;
    const { props: j, shapeFlag: I, transition: D, dirs: K } = u;
    if (E = u.el = l(
      u.type,
      w,
      j && j.is,
      j
    ), I & 8 ? c(E, u.children) : I & 16 && ie(
      u.children,
      E,
      null,
      x,
      b,
      ar(u, w),
      A,
      M
    ), K && It(u, null, x, "created"), J(E, u, u.scopeId, A, x), j) {
      for (const Y in j)
        Y !== "value" && !tn(Y) && s(E, Y, null, j[Y], w, x);
      "value" in j && s(E, "value", null, j.value, w), (y = j.onVnodeBeforeMount) && ot(y, x, u);
    }
    K && It(u, null, x, "beforeMount");
    const te = Mo(b, D);
    te && D.beforeEnter(E), r(E, f, v), ((y = j && j.onVnodeMounted) || te || K) && We(() => {
      y && ot(y, x, u), te && D.enter(E), K && It(u, null, x, "mounted");
    }, b);
  }, J = (u, f, v, x, b) => {
    if (v && $(u, v), x)
      for (let w = 0; w < x.length; w++)
        $(u, x[w]);
    if (b) {
      let w = b.subTree;
      if (f === w || ks(w.type) && (w.ssContent === f || w.ssFallback === f)) {
        const A = b.vnode;
        J(
          u,
          A,
          A.scopeId,
          A.slotScopeIds,
          b.parent
        );
      }
    }
  }, ie = (u, f, v, x, b, w, A, M, E = 0) => {
    for (let y = E; y < u.length; y++) {
      const j = u[y] = M ? yt(u[y]) : ct(u[y]);
      F(
        null,
        j,
        f,
        v,
        x,
        b,
        w,
        A,
        M
      );
    }
  }, X = (u, f, v, x, b, w, A) => {
    const M = f.el = u.el;
    let { patchFlag: E, dynamicChildren: y, dirs: j } = f;
    E |= u.patchFlag & 16;
    const I = u.props || ve, D = f.props || ve;
    let K;
    if (v && Pt(v, !1), (K = D.onVnodeBeforeUpdate) && ot(K, v, f, u), j && It(f, u, v, "beforeUpdate"), v && Pt(v, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    y && (!u.dynamicChildren || u.dynamicChildren.length !== y.length) && (E = 0, A = !1, y = null), (I.innerHTML && D.innerHTML == null || I.textContent && D.textContent == null) && c(M, ""), y ? P(
      u.dynamicChildren,
      y,
      M,
      v,
      x,
      ar(f, b),
      w
    ) : A || se(
      u,
      f,
      M,
      null,
      v,
      x,
      ar(f, b),
      w,
      !1
    ), E > 0) {
      if (E & 16)
        Re(M, I, D, v, b);
      else if (E & 2 && I.class !== D.class && s(M, "class", null, D.class, b), E & 4 && s(M, "style", I.style, D.style, b), E & 8) {
        const te = f.dynamicProps;
        for (let Y = 0; Y < te.length; Y++) {
          const re = te[Y], Se = I[re], $e = D[re];
          ($e !== Se || re === "value") && s(M, re, Se, $e, b, v);
        }
      }
      E & 1 && u.children !== f.children && c(M, f.children);
    } else !A && y == null && Re(M, I, D, v, b);
    ((K = D.onVnodeUpdated) || j) && We(() => {
      K && ot(K, v, f, u), j && It(f, u, v, "updated");
    }, x);
  }, P = (u, f, v, x, b, w, A) => {
    for (let M = 0; M < f.length; M++) {
      const E = u[M], y = f[M], j = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        E.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (E.type === ge || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Gt(E, y) || // - In the case of a component, it could contain anything.
        E.shapeFlag & 198) ? g(E.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          v
        )
      );
      F(
        E,
        y,
        j,
        null,
        x,
        b,
        w,
        A,
        !0
      );
    }
  }, Re = (u, f, v, x, b) => {
    if (f !== v) {
      if (f !== ve)
        for (const w in f)
          !tn(w) && !(w in v) && s(
            u,
            w,
            f[w],
            null,
            b,
            x
          );
      for (const w in v) {
        if (tn(w)) continue;
        const A = v[w], M = f[w];
        A !== M && w !== "value" && s(u, w, M, A, b, x);
      }
      "value" in v && s(u, "value", f.value, v.value, b);
    }
  }, fe = (u, f, v, x, b, w, A, M, E) => {
    const y = f.el = u ? u.el : a(""), j = f.anchor = u ? u.anchor : a("");
    let { patchFlag: I, dynamicChildren: D, slotScopeIds: K } = f;
    K && (M = M ? M.concat(K) : K), u == null ? (r(y, v, x), r(j, v, x), ie(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      f.children || [],
      v,
      j,
      b,
      w,
      A,
      M,
      E
    )) : I > 0 && I & 64 && D && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    u.dynamicChildren && u.dynamicChildren.length === D.length ? (P(
      u.dynamicChildren,
      D,
      v,
      b,
      w,
      A,
      M
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (f.key != null || b && f === b.subTree) && Wr(
      u,
      f,
      !0
      /* shallow */
    )) : se(
      u,
      f,
      v,
      j,
      b,
      w,
      A,
      M,
      E
    );
  }, Ge = (u, f, v, x, b, w, A, M, E) => {
    f.slotScopeIds = M, u == null ? f.shapeFlag & 512 ? b.ctx.activate(
      f,
      v,
      x,
      A,
      E
    ) : be(
      f,
      v,
      x,
      b,
      w,
      A,
      E
    ) : we(u, f, E);
  }, be = (u, f, v, x, b, w, A) => {
    const M = u.component = Oo(
      u,
      x,
      b
    );
    if (Nr(u) && (M.ctx.renderer = pe), Po(M, !1, A), M.asyncDep) {
      if (b && b.registerDep(M, Ee, A), !u.el) {
        const E = M.subTree = Me(Mt);
        q(null, E, f, v), u.placeholder = E.el;
      }
    } else
      Ee(
        M,
        u,
        f,
        v,
        b,
        w,
        A
      );
  }, we = (u, f, v) => {
    const x = f.component = u.component;
    if (ho(u, f, v))
      if (x.asyncDep && !x.asyncResolved) {
        f.el = u.el, ne(x, f, v);
        return;
      } else
        x.next = f, x.update();
    else
      f.el = u.el, x.vnode = f;
  }, Ee = (u, f, v, x, b, w, A) => {
    const M = () => {
      if (u.isMounted) {
        let { next: I, bu: D, u: K, parent: te, vnode: Y } = u;
        {
          const Je = Ss(u);
          if (Je) {
            I && (I.el = Y.el, ne(u, I, A)), Je.asyncDep.then(() => {
              We(() => {
                u.isUnmounted || y();
              }, b);
            });
            return;
          }
        }
        let re = I, Se;
        Pt(u, !1), I ? (I.el = Y.el, ne(u, I, A)) : I = Y, D && En(D), (Se = I.props && I.props.onVnodeBeforeUpdate) && ot(Se, te, I, Y), Pt(u, !0);
        const $e = oi(u), Xe = u.subTree;
        u.subTree = $e, F(
          Xe,
          $e,
          // parent may have changed if it's in a teleport
          g(Xe.el),
          // anchor may have changed if it's in a fragment
          me(Xe),
          u,
          b,
          w
        ), I.el = $e.el, re === null && po(u, $e.el), K && We(K, b), (Se = I.props && I.props.onVnodeUpdated) && We(
          () => ot(Se, te, I, Y),
          b
        );
      } else {
        let I;
        const { el: D, props: K } = f, { bm: te, m: Y, parent: re, root: Se, type: $e } = u, Xe = on(f);
        Pt(u, !1), te && En(te), !Xe && (I = K && K.onVnodeBeforeMount) && ot(I, re, f), Pt(u, !0);
        {
          Se.ce && Se.ce._hasShadowRoot() && Se.ce._injectChildStyle(
            $e,
            u.parent ? u.parent.type : void 0
          );
          const Je = u.subTree = oi(u);
          F(
            null,
            Je,
            v,
            x,
            u,
            b,
            w
          ), f.el = Je.el;
        }
        if (Y && We(Y, b), !Xe && (I = K && K.onVnodeMounted)) {
          const Je = f;
          We(
            () => ot(I, re, Je),
            b
          );
        }
        (f.shapeFlag & 256 || re && on(re.vnode) && re.vnode.shapeFlag & 256) && u.a && We(u.a, b), u.isMounted = !0, f = v = x = null;
      }
    };
    u.scope.on();
    const E = u.effect = new Hi(M);
    u.scope.off();
    const y = u.update = E.run.bind(E), j = u.job = E.runIfDirty.bind(E);
    j.i = u, j.id = u.uid, E.scheduler = () => Hr(j), Pt(u, !0), y();
  }, ne = (u, f, v) => {
    f.component = u;
    const x = u.vnode.props;
    u.vnode = f, u.next = null, vo(u, f.props, x, v), _o(u, f.children, v), wt(), Xr(u), xt();
  }, se = (u, f, v, x, b, w, A, M, E = !1) => {
    const y = u && u.children, j = u ? u.shapeFlag : 0, I = f.children, { patchFlag: D, shapeFlag: K } = f;
    if (D > 0) {
      if (D & 128) {
        T(
          y,
          I,
          v,
          x,
          b,
          w,
          A,
          M,
          E
        );
        return;
      } else if (D & 256) {
        k(
          y,
          I,
          v,
          x,
          b,
          w,
          A,
          M,
          E
        );
        return;
      }
    }
    K & 8 ? (j & 16 && G(y, b, w), I !== y && c(v, I)) : j & 16 ? K & 16 ? T(
      y,
      I,
      v,
      x,
      b,
      w,
      A,
      M,
      E
    ) : G(y, b, w, !0) : (j & 8 && c(v, ""), K & 16 && ie(
      I,
      v,
      x,
      b,
      w,
      A,
      M,
      E
    ));
  }, k = (u, f, v, x, b, w, A, M, E) => {
    u = u || Lt, f = f || Lt;
    const y = u.length, j = f.length, I = Math.min(y, j);
    let D;
    for (D = 0; D < I; D++) {
      const K = f[D] = E ? yt(f[D]) : ct(f[D]);
      F(
        u[D],
        K,
        v,
        null,
        b,
        w,
        A,
        M,
        E
      );
    }
    y > j ? G(
      u,
      b,
      w,
      !0,
      !1,
      I
    ) : ie(
      f,
      v,
      x,
      b,
      w,
      A,
      M,
      E,
      I
    );
  }, T = (u, f, v, x, b, w, A, M, E) => {
    let y = 0;
    const j = f.length;
    let I = u.length - 1, D = j - 1;
    for (; y <= I && y <= D; ) {
      const K = u[y], te = f[y] = E ? yt(f[y]) : ct(f[y]);
      if (Gt(K, te))
        F(
          K,
          te,
          v,
          null,
          b,
          w,
          A,
          M,
          E
        );
      else
        break;
      y++;
    }
    for (; y <= I && y <= D; ) {
      const K = u[I], te = f[D] = E ? yt(f[D]) : ct(f[D]);
      if (Gt(K, te))
        F(
          K,
          te,
          v,
          null,
          b,
          w,
          A,
          M,
          E
        );
      else
        break;
      I--, D--;
    }
    if (y > I) {
      if (y <= D) {
        const K = D + 1, te = K < j ? f[K].el : x;
        for (; y <= D; )
          F(
            null,
            f[y] = E ? yt(f[y]) : ct(f[y]),
            v,
            te,
            b,
            w,
            A,
            M,
            E
          ), y++;
      }
    } else if (y > D)
      for (; y <= I; )
        Q(u[y], b, w, !0), y++;
    else {
      const K = y, te = y, Y = /* @__PURE__ */ new Map();
      for (y = te; y <= D; y++) {
        const _ = f[y] = E ? yt(f[y]) : ct(f[y]);
        _.key != null && Y.set(_.key, y);
      }
      let re, Se = 0;
      const $e = D - te + 1;
      let Xe = !1, Je = 0;
      const Ot = new Array($e);
      for (y = 0; y < $e; y++) Ot[y] = 0;
      for (y = K; y <= I; y++) {
        const _ = u[y];
        if (Se >= $e) {
          Q(_, b, w, !0);
          continue;
        }
        let p;
        if (_.key != null)
          p = Y.get(_.key);
        else
          for (re = te; re <= D; re++)
            if (Ot[re - te] === 0 && Gt(_, f[re])) {
              p = re;
              break;
            }
        p === void 0 ? Q(_, b, w, !0) : (Ot[p - te] = y + 1, p >= Je ? Je = p : Xe = !0, F(
          _,
          f[p],
          v,
          null,
          b,
          w,
          A,
          M,
          E
        ), Se++);
      }
      const bn = Xe ? Co(Ot) : Lt;
      for (re = bn.length - 1, y = $e - 1; y >= 0; y--) {
        const _ = te + y, p = f[_], h = f[_ + 1], U = _ + 1 < j ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          h.el || Ts(h)
        ) : x;
        Ot[y] === 0 ? F(
          null,
          p,
          v,
          U,
          b,
          w,
          A,
          M,
          E
        ) : Xe && (re < 0 || y !== bn[re] ? N(p, v, U, 2) : re--);
      }
    }
  }, N = (u, f, v, x, b = null) => {
    const { el: w, type: A, transition: M, children: E, shapeFlag: y } = u;
    if (y & 6) {
      N(u.component.subTree, f, v, x);
      return;
    }
    if (y & 128) {
      u.suspense.move(f, v, x);
      return;
    }
    if (y & 64) {
      A.move(u, f, v, pe);
      return;
    }
    if (A === ge) {
      r(w, f, v);
      for (let I = 0; I < E.length; I++)
        N(E[I], f, v, x);
      r(u.anchor, f, v);
      return;
    }
    if (A === ur) {
      ee(u, f, v);
      return;
    }
    if (x !== 2 && y & 1 && M)
      if (x === 0)
        M.persisted && !w[lr] ? r(w, f, v) : (M.beforeEnter(w), r(w, f, v), We(() => M.enter(w), b));
      else {
        const { leave: I, delayLeave: D, afterLeave: K } = M, te = () => {
          u.ctx.isUnmounted ? i(w) : r(w, f, v);
        }, Y = () => {
          const re = w._isLeaving || !!w[lr];
          w._isLeaving && w[lr](
            !0
            /* cancelled */
          ), M.persisted && !re ? te() : I(w, () => {
            te(), K && K();
          });
        };
        D ? D(w, te, Y) : Y();
      }
    else
      r(w, f, v);
  }, Q = (u, f, v, x = !1, b = !1) => {
    const {
      type: w,
      props: A,
      ref: M,
      children: E,
      dynamicChildren: y,
      shapeFlag: j,
      patchFlag: I,
      dirs: D,
      cacheIndex: K,
      memo: te
    } = u;
    if ((I === -2 || y && y.hasOnce) && (b = !1), M != null && (wt(), ln(M, null, v, u, !0), xt()), K != null && (!u.ctx || u.ctx === f) && (f.renderCache[K] = void 0), j & 256) {
      f.ctx.deactivate(u);
      return;
    }
    const Y = j & 1 && D, re = !on(u);
    let Se;
    if (re && (Se = A && A.onVnodeBeforeUnmount) && ot(Se, f, u), j & 6)
      Ye(u.component, v, x);
    else {
      if (j & 128) {
        u.suspense.unmount(v, x);
        return;
      }
      Y && It(u, null, f, "beforeUnmount"), j & 64 ? u.type.remove(
        u,
        f,
        v,
        pe,
        x
      ) : y && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !y.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (w !== ge || I > 0 && I & 64) ? G(
        y,
        f,
        v,
        !1,
        !0
      ) : (w === ge && I & 384 || !b && j & 16) && G(E, f, v), x && he(u);
    }
    const $e = te != null && K == null;
    (re && (Se = A && A.onVnodeUnmounted) || Y || $e) && We(() => {
      Se && ot(Se, f, u), Y && It(u, null, f, "unmounted"), $e && (u.el = null);
    }, v);
  }, he = (u) => {
    const { type: f, el: v, anchor: x, transition: b } = u;
    if (f === ge) {
      De(v, x);
      return;
    }
    if (f === ur) {
      H(u), b && !b.persisted && b.afterLeave && b.afterLeave();
      return;
    }
    const w = () => {
      i(v), b && !b.persisted && b.afterLeave && b.afterLeave();
    };
    if (u.shapeFlag & 1 && b && !b.persisted) {
      const { leave: A, delayLeave: M } = b, E = () => A(v, w);
      M ? M(u.el, w, E) : E();
    } else
      w();
  }, De = (u, f) => {
    let v;
    for (; u !== f; )
      v = S(u), i(u), u = v;
    i(f);
  }, Ye = (u, f, v) => {
    const { bum: x, scope: b, job: w, subTree: A, um: M, m: E, a: y } = u;
    ci(E), ci(y), x && En(x), b.stop(), w ? (w.flags |= 8, Q(A, u, f, v)) : u.vnode.el && A && (A.transition = u.vnode.transition, Q(A, u, f, v)), M && We(M, f), We(() => {
      u.isUnmounted = !0;
    }, f);
  }, G = (u, f, v, x = !1, b = !1, w = 0) => {
    for (let A = w; A < u.length; A++)
      Q(u[A], f, v, x, b);
  }, me = (u) => {
    if (u.shapeFlag & 6)
      return me(u.component.subTree);
    if (u.shapeFlag & 128)
      return u.suspense.next();
    const f = S(u.anchor || u.el), v = f && f[os];
    return v ? S(v) : f;
  };
  let Ue = !1;
  const gt = (u, f, v) => {
    let x;
    u == null ? f._vnode && (Q(f._vnode, null, null, !0), x = f._vnode.component) : F(
      f._vnode || null,
      u,
      f,
      null,
      null,
      null,
      v
    ), f._vnode = u, Ue || (Ue = !0, Xr(x), ns(), Ue = !1);
  }, pe = {
    p: F,
    um: Q,
    m: N,
    r: he,
    mt: be,
    mc: ie,
    pc: se,
    pbc: P,
    n: me,
    o: e
  };
  return {
    render: gt,
    hydrate: void 0,
    createApp: lo(gt)
  };
}
function ar({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Pt({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Mo(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Wr(e, t, n = !1) {
  const r = e.children, i = t.children;
  if (W(r) && W(i))
    for (let s = 0; s < r.length; s++) {
      const l = r[s];
      let a = i[s];
      a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[s] = yt(i[s]), a.el = l.el), !n && a.patchFlag !== -2 && Wr(l, a)), a.type === Xn && (a.patchFlag === -1 && (a = i[s] = yt(a)), a.el = l.el), a.type === Mt && !a.el && (a.el = l.el);
    }
}
function Co(e) {
  const t = e.slice(), n = [0];
  let r, i, s, l, a;
  const o = e.length;
  for (r = 0; r < o; r++) {
    const d = e[r];
    if (d !== 0) {
      if (i = n[n.length - 1], e[i] < d) {
        t[r] = i, n.push(r);
        continue;
      }
      for (s = 0, l = n.length - 1; s < l; )
        a = s + l >> 1, e[n[a]] < d ? s = a + 1 : l = a;
      d < e[n[s]] && (s > 0 && (t[r] = n[s - 1]), n[s] = r);
    }
  }
  for (s = n.length, l = n[s - 1]; s-- > 0; )
    n[s] = l, l = t[l];
  return n;
}
function Ss(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : Ss(t);
}
function ci(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function Ts(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  return t ? Ts(t.subTree) : null;
}
const ks = (e) => e.__isSuspense;
function So(e, t) {
  t && t.pendingBranch ? W(e) ? t.effects.push(...e) : t.effects.push(e) : $l(e);
}
const ge = /* @__PURE__ */ Symbol.for("v-fgt"), Xn = /* @__PURE__ */ Symbol.for("v-txt"), Mt = /* @__PURE__ */ Symbol.for("v-cmt"), ur = /* @__PURE__ */ Symbol.for("v-stc"), Ht = [];
let Ze = null;
function R(e = !1) {
  Ht.push(Ze = e ? null : []);
}
function Es() {
  Ht.pop(), Ze = Ht[Ht.length - 1] || null;
}
let dn = 1;
function fi(e, t = !1) {
  dn += e, e < 0 && Ze && t && (Ze.hasOnce = !0);
}
function As(e) {
  return e.dynamicChildren = dn > 0 ? Ze || Lt : null, Es(), dn > 0 && Ze && Ze.push(e), e;
}
function L(e, t, n, r, i, s) {
  return As(
    m(
      e,
      t,
      n,
      r,
      i,
      s,
      !0
    )
  );
}
function $n(e, t, n, r, i) {
  return As(
    Me(
      e,
      t,
      n,
      r,
      i,
      !0
    )
  );
}
function $s(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Gt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const Os = ({ key: e }) => e ?? null, On = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? ke(e) || /* @__PURE__ */ je(e) || Z(e) ? { i: et, r: e, k: t, f: !!n } : e : null);
function m(e, t = null, n = null, r = 0, i = null, s = e === ge ? 0 : 1, l = !1, a = !1) {
  const o = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Os(t),
    ref: t && On(t),
    scopeId: is,
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
    shapeFlag: s,
    patchFlag: r,
    dynamicProps: i,
    dynamicChildren: null,
    appContext: null,
    ctx: et
  };
  return a ? (Hn(o, n), s & 128 && e.normalize(o)) : n && (o.shapeFlag |= ke(n) ? 8 : 16), dn > 0 && // avoid a block node from tracking itself
  !l && // has current parent block
  Ze && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (o.patchFlag > 0 || s & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  o.patchFlag !== 32 && Ze.push(o), o;
}
const Me = To;
function To(e, t = null, n = null, r = 0, i = null, s = !1) {
  if ((!e || e === Xl) && (e = Mt), $s(e)) {
    const a = qt(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && Hn(a, n), dn > 0 && !s && Ze && (a.shapeFlag & 6 ? Ze[Ze.indexOf(e)] = a : Ze.push(a)), a.patchFlag = -2, a;
  }
  if (Do(e) && (e = e.__vccOpts), t) {
    t = ko(t);
    let { class: a, style: o } = t;
    a && !ke(a) && (t.class = Oe(a)), de(o) && (/* @__PURE__ */ Lr(o) && !W(o) && (o = Ve({}, o)), t.style = rt(o));
  }
  const l = ke(e) ? 1 : ks(e) ? 128 : Jn(e) ? 64 : de(e) ? 4 : Z(e) ? 2 : 0;
  return m(
    e,
    t,
    n,
    r,
    i,
    l,
    s,
    !0
  );
}
function ko(e) {
  return e ? /* @__PURE__ */ Lr(e) || bs(e) ? Ve({}, e) : e : null;
}
function qt(e, t, n = !1, r = !1) {
  const { props: i, ref: s, patchFlag: l, children: a, transition: o } = e, d = t ? Eo(i || {}, t) : i, c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: d,
    key: d && Os(d),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && s ? W(s) ? s.concat(On(t)) : [s, On(t)] : On(t)
    ) : s,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: a,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== ge ? l === -1 ? 16 : l | 16 : l,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: o,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && qt(e.ssContent),
    ssFallback: e.ssFallback && qt(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce,
    cacheIndex: e.cacheIndex
  };
  return o && r && Vr(
    c,
    o.clone(c)
  ), c;
}
function Fe(e = " ", t = 0) {
  return Me(Xn, null, e, t);
}
function Te(e = "", t = !1) {
  return t ? (R(), $n(Mt, null, e)) : Me(Mt, null, e);
}
function ct(e) {
  return e == null || typeof e == "boolean" ? Me(Mt) : W(e) ? Me(
    ge,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : $s(e) ? yt(e) : Me(Xn, null, String(e));
}
function yt(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : qt(e);
}
function Hn(e, t) {
  let n = 0;
  const { shapeFlag: r } = e;
  if (t == null)
    t = null;
  else if (W(t))
    n = 16;
  else if (typeof t == "object")
    if (r & 65) {
      const i = t.default;
      i && (i._c && (i._d = !1), Hn(e, i()), i._c && (i._d = !0));
      return;
    } else {
      n = 32;
      const i = t._;
      !i && !bs(t) ? t._ctx = et : i === 3 && et && (et.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (Z(t)) {
    if (r & 65) {
      Hn(e, { default: t });
      return;
    }
    t = { default: t, _ctx: et }, n = 32;
  } else
    t = String(t), r & 64 ? (n = 16, t = [Fe(t)]) : n = 8;
  e.children = t, e.shapeFlag |= n;
}
function Eo(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    for (const i in r)
      if (i === "class")
        t.class !== r.class && (t.class = Oe([t.class, r.class]));
      else if (i === "style")
        t.style = rt([t.style, r.style]);
      else if (Un(i)) {
        const s = t[i], l = r[i];
        l && s !== l && !(W(s) && s.includes(l)) ? t[i] = s ? [].concat(s, l) : l : l == null && s == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !Bn(i) && (t[i] = l);
      } else i !== "" && (t[i] = r[i]);
  }
  return t;
}
function ot(e, t, n, r = null) {
  lt(e, t, 7, [
    n,
    r
  ]);
}
const Ao = ps();
let $o = 0;
function Oo(e, t, n) {
  const r = e.type, i = (t ? t.appContext : e.appContext) || Ao, s = {
    uid: $o++,
    vnode: e,
    type: r,
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
    scope: new el(
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
    propsOptions: ws(r, i),
    emitsOptions: gs(r, i),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: ve,
    // inheritAttrs
    inheritAttrs: r.inheritAttrs,
    // state
    ctx: ve,
    data: ve,
    props: ve,
    attrs: ve,
    slots: ve,
    refs: ve,
    setupState: ve,
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
  return s.ctx = { _: s }, s.root = t ? t.root : s, s.emit = ao.bind(null, s), e.ce && e.ce(s), s;
}
let qe = null;
const Io = () => qe || et;
let Vn, hn;
{
  const e = Wn(), t = (n, r) => {
    let i;
    return (i = e[n]) || (i = e[n] = []), i.push(r), (s) => {
      i.length > 1 ? i.forEach((l) => l(s)) : i[0](s);
    };
  };
  Vn = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => qe = n
  ), hn = t(
    "__VUE_SSR_SETTERS__",
    (n) => pn = n
  );
}
const yn = (e) => {
  const t = qe;
  return Vn(e), e.scope.on(), () => {
    e.scope.off(), Vn(t);
  };
}, di = () => {
  qe && qe.scope.off(), Vn(null);
};
function Is(e) {
  return e.vnode.shapeFlag & 4;
}
let pn = !1;
function Po(e, t = !1, n = !1) {
  t && hn(t);
  const { props: r, children: i } = e.vnode, s = Is(e);
  go(e, r, s, t), bo(e, i, n || t);
  const l = s ? Ro(e, t) : void 0;
  return t && hn(!1), l;
}
function Ro(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Ql);
  const { setup: r } = n;
  if (r) {
    wt();
    const i = e.setupContext = r.length > 1 ? Lo(e) : null, s = yn(e), l = mn(
      r,
      e,
      0,
      [
        e.props,
        i
      ]
    ), a = Ai(l);
    if (xt(), s(), (a || e.sp) && !on(e) && us(e), a) {
      if (l.then(di, di), t)
        return l.then((o) => {
          hn(!0);
          try {
            hi(e, o, t);
          } finally {
            hn(!1);
          }
        }).catch((o) => {
          qn(o, e, 0);
        });
      e.asyncDep = l;
    } else
      hi(e, l);
  } else
    Ps(e);
}
function hi(e, t, n) {
  Z(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : de(t) && (e.setupState = Qi(t)), Ps(e);
}
function Ps(e, t, n) {
  const r = e.type;
  e.render || (e.render = r.render || dt);
  {
    const i = yn(e);
    wt();
    try {
      eo(e);
    } finally {
      xt(), i();
    }
  }
}
const Fo = {
  get(e, t) {
    return Ne(e, "get", ""), e[t];
  }
};
function Lo(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, Fo),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function Qn(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(Qi(_l(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in an)
        return an[n](e);
    },
    has(t, n) {
      return n in t || n in an;
    }
  })) : e.proxy;
}
function Do(e) {
  return Z(e) && "__vccOpts" in e;
}
const Pe = (e, t) => /* @__PURE__ */ Sl(e, t, pn), Ho = "3.5.43";
let Cr;
const pi = typeof window < "u" && window.trustedTypes;
if (pi)
  try {
    Cr = /* @__PURE__ */ pi.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const Rs = Cr ? (e) => Cr.createHTML(e) : (e) => e, Vo = "http://www.w3.org/2000/svg", No = "http://www.w3.org/1998/Math/MathML", mt = typeof document < "u" ? document : null, gi = mt && /* @__PURE__ */ mt.createElement("template"), jo = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, r) => {
    const i = t === "svg" ? mt.createElementNS(Vo, e) : t === "mathml" ? mt.createElementNS(No, e) : n ? mt.createElement(e, { is: n }) : mt.createElement(e);
    return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
  },
  createText: (e) => mt.createTextNode(e),
  createComment: (e) => mt.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => mt.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, r, i, s) {
    const l = n ? n.previousSibling : t.lastChild;
    if (i && (i === s || i.nextSibling))
      for (; t.insertBefore(i.cloneNode(!0), n), !(i === s || !(i = i.nextSibling)); )
        ;
    else {
      gi.innerHTML = Rs(
        r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e
      );
      const a = gi.content;
      if (r === "svg" || r === "mathml") {
        const o = a.firstChild;
        for (; o.firstChild; )
          a.appendChild(o.firstChild);
        a.removeChild(o);
      }
      t.insertBefore(a, n);
    }
    return [
      // first
      l ? l.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, Uo = /* @__PURE__ */ Symbol("_vtc");
function Bo(e, t, n) {
  const r = e[Uo];
  r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const vi = /* @__PURE__ */ Symbol("_vod"), Ko = /* @__PURE__ */ Symbol("_vsh"), Wo = /* @__PURE__ */ Symbol(""), zo = /(?:^|;)\s*display\s*:/;
function qo(e, t, n) {
  const r = e.style, i = ke(n);
  let s = !1;
  if (n && !i) {
    if (t)
      if (ke(t))
        for (const l of t.split(";")) {
          const a = l.slice(0, l.indexOf(":")).trim();
          n[a] == null && en(r, a, "");
        }
      else
        for (const l in t)
          n[l] == null && en(r, l, "");
    for (const l in n) {
      l === "display" && (s = !0);
      const a = n[l];
      a != null ? Zo(
        e,
        l,
        !ke(t) && t ? t[l] : void 0,
        a
      ) || en(r, l, a) : en(r, l, "");
    }
  } else if (i) {
    if (t !== n) {
      const l = r[Wo];
      l && (n += ";" + l), r.cssText = n, s = zo.test(n);
    }
  } else t && e.removeAttribute("style");
  vi in e && (e[vi] = s ? r.display : "", e[Ko] && (r.display = "none"));
}
const Cn = /\s*!important$/;
function en(e, t, n) {
  if (W(n))
    n.forEach((r) => en(e, t, r));
  else if (n == null && (n = ""), t.startsWith("--"))
    Cn.test(n) ? e.setProperty(t, n.replace(Cn, ""), "important") : e.setProperty(t, n);
  else {
    const r = Jo(e, t);
    Cn.test(n) ? e.setProperty(
      Nt(r),
      n.replace(Cn, ""),
      "important"
    ) : e[r] = n;
  }
}
const mi = ["Webkit", "Moz", "ms"], cr = {};
function Jo(e, t) {
  const n = cr[t];
  if (n)
    return n;
  let r = it(t);
  if (r !== "filter" && r in e)
    return cr[t] = r;
  r = Ii(r);
  for (let i = 0; i < mi.length; i++) {
    const s = mi[i] + r;
    if (s in e)
      return cr[t] = s;
  }
  return t;
}
function Zo(e, t, n, r) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && ke(r) && n === r;
}
const yi = "http://www.w3.org/1999/xlink";
function bi(e, t, n, r, i, s = Gs(t)) {
  r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(yi, t.slice(6, t.length)) : e.setAttributeNS(yi, t, n) : n == null || s && !Fi(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    s ? "" : ht(n) ? String(n) : n
  );
}
function _i(e, t, n, r, i) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? Rs(n) : n);
    return;
  }
  const s = e.tagName;
  if (t === "value" && s !== "PROGRESS" && // custom elements may use _value internally
  !s.includes("-")) {
    const a = s === "OPTION" ? e.getAttribute("value") || "" : e.value, o = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (a !== o || !("_value" in e)) && (e.value = o), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let l = !1;
  if (n === "" || n == null) {
    const a = typeof e[t];
    a === "boolean" ? n = Fi(n) : n == null && a === "string" ? (n = "", l = !0) : a === "number" && (n = 0, l = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  l && e.removeAttribute(i || t);
}
function Fs(e, t, n, r) {
  e.addEventListener(t, n, r);
}
function Go(e, t, n, r) {
  e.removeEventListener(t, n, r);
}
const wi = /* @__PURE__ */ Symbol("_vei");
function Yo(e, t, n, r, i = null) {
  const s = e[wi] || (e[wi] = {}), l = s[t];
  if (r && l)
    l.value = r;
  else {
    const [a, o] = ea(t);
    if (r) {
      const d = s[t] = ra(
        r,
        i
      );
      Fs(e, a, d, o);
    } else l && (Go(e, a, l, o), s[t] = void 0);
  }
}
const Xo = /(Once|Passive|Capture)$/, Qo = /^on:?(?:Once|Passive|Capture)$/;
function ea(e) {
  let t, n;
  for (; (n = e.match(Xo)) && !Qo.test(e); )
    t || (t = {}), e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : Nt(e.slice(2)), t];
}
let fr = 0;
const ta = /* @__PURE__ */ Promise.resolve(), na = () => fr || (ta.then(() => fr = 0), fr = Date.now());
function ra(e, t) {
  const n = (r) => {
    if (!r._vts)
      r._vts = Date.now();
    else if (r._vts <= n.attached)
      return;
    const i = n.value;
    if (W(i)) {
      const s = r.stopImmediatePropagation;
      r.stopImmediatePropagation = () => {
        s.call(r), r._stopped = !0;
      };
      const l = i.slice(), a = [r];
      for (let o = 0; o < l.length && !r._stopped; o++) {
        const d = l[o];
        d && lt(
          d,
          t,
          5,
          a
        );
      }
    } else
      lt(
        i,
        t,
        5,
        [r]
      );
  };
  return n.value = e, n.attached = na(), n;
}
const xi = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, ia = (e, t, n, r, i, s) => {
  const l = i === "svg";
  t === "class" ? Bo(e, r, l) : t === "style" ? qo(e, n, r) : Un(t) ? Bn(t) || Yo(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : sa(e, t, r, l)) ? (_i(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && bi(e, t, r, l, s, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (la(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !ke(r))) ? _i(e, it(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), bi(e, t, r, l));
};
function sa(e, t, n, r) {
  if (r)
    return !!(t === "innerHTML" || t === "textContent" || t in e && xi(t) && Z(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const i = e.tagName;
    if (i === "IMG" || i === "VIDEO" || i === "CANVAS" || i === "SOURCE")
      return !1;
  }
  return xi(t) && ke(n) ? !1 : t in e;
}
function la(e, t) {
  const n = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!n)
    return !1;
  const r = it(t);
  return Array.isArray(n) ? n.some((i) => it(i) === r) : Object.keys(n).some((i) => it(i) === r);
}
const Mi = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return W(t) ? (n) => En(t, n) : t;
}, dr = /* @__PURE__ */ Symbol("_assign"), oa = {
  // <select multiple> value need to be deep traversed
  deep: !0,
  created(e, { value: t, modifiers: { number: n } }, r) {
    e._modelValue = t, Fs(e, "change", () => {
      const i = Array.prototype.filter.call(e.options, (o) => o.selected).map(
        (o) => n ? Ri(Nn(o)) : Nn(o)
      ), s = e.multiple, l = s ? Vt(e._modelValue) ? new Set(i) : i : i[0], a = e._pendingValue = [
        s,
        s ? W(l) ? i.slice() : i : l
      ];
      try {
        e[dr](l);
      } finally {
        Dr(() => {
          e._pendingValue === a && (e._pendingValue = void 0);
        });
      }
    }), e[dr] = Mi(r);
  },
  // set value in mounted & updated because <select> relies on its children
  // <option>s.
  mounted(e, { value: t }) {
    Ci(e, t);
  },
  beforeUpdate(e, { value: t }, n) {
    e._modelValue = t, e[dr] = Mi(n);
  },
  updated(e, { value: t }) {
    const n = e._pendingValue;
    e._pendingValue = void 0, (!n || n[0] !== e.multiple || !aa(t, n[1], n[0])) && Ci(e, t);
  }
};
function aa(e, t, n) {
  if (!n || W(e)) return At(e, t);
  if (Vt(e)) {
    if (e.size !== t.length) return !1;
    for (const r of t)
      if (!e.has(r)) return !1;
    return !0;
  }
  return !1;
}
function Ci(e, t) {
  const n = e.multiple, r = W(t);
  if (!(n && !r && !Vt(t))) {
    for (let i = 0, s = e.options.length; i < s; i++) {
      const l = e.options[i], a = Nn(l);
      if (n)
        if (r) {
          const o = typeof a;
          o === "string" || o === "number" ? l.selected = t.some((d) => String(d) === String(a)) : l.selected = Qs(t, a) > -1;
        } else
          l.selected = t.has(a);
      else if (At(Nn(l), t)) {
        e.selectedIndex !== i && (e.selectedIndex = i);
        return;
      }
    }
    !n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
  }
}
function Nn(e) {
  return "_value" in e ? e._value : e.value;
}
const ua = /* @__PURE__ */ Ve({ patchProp: ia }, jo);
let Si;
function ca() {
  return Si || (Si = wo(ua));
}
const fa = ((...e) => {
  const t = ca().createApp(...e), { mount: n } = t;
  return t.mount = (r) => {
    const i = ha(r);
    if (!i) return;
    const s = t._component;
    !Z(s) && !s.render && !s.template && (s.template = i.innerHTML), i.nodeType === 1 && (i.textContent = "");
    const l = n(i, !1, da(i));
    return i instanceof Element && (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")), l;
  }, t;
});
function da(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function ha(e) {
  return ke(e) ? document.querySelector(e) : e;
}
const pa = {
  class: "gl-icon",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.75",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true",
  focusable: "false"
}, ga = ["cx", "cy"], va = ["d"], ma = /* @__PURE__ */ Zn({
  __name: "UiIcon",
  props: {
    name: {},
    value: {}
  },
  setup(e) {
    const t = { menu: "M4 6h16M4 12h16M4 18h16", close: "m6 6 12 12M6 18 18 6", invite: "M15 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0M4 21v-2a6 6 0 0 1 9-5.2M18 14v8M14 18h8", copy: "M9 9h11v12H9zM5 15H3V3h12v2", exit: "M10 4H4v16h6M10 12h11m-4-4 4 4-4 4", download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5", help: "M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4M12 17h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0", refresh: "M20 7v5h-5M4 17v-5h5M5 8a8 8 0 0 1 13-3l2 3M4 16l2 3a8 8 0 0 0 13-3", pan: "M12 3v18M3 12h18m-12-6 3-3 3 3m-6 12 3 3 3-3M6 9l-3 3 3 3m12-6 3 3-3 3", pen: "m4 16-1 5 5-1L20 8a3 3 0 0 0-4-4ZM14 6l4 4", pencil: "m4 15-1 6 6-1L21 8l-5-5ZM13 6l5 5M4 15l5 5", marker: "m5 14 9-11 7 6-9 11ZM5 14l7 6-8 1-2-2ZM12 6l7 6", highlighter: "m7 13 7-10 7 5-7 10ZM7 13l7 5-3 3H4v-4ZM3 22h18", spray: "M5 10h9v11H5zM7 10V6h5v4M8 6V3h3M16 4h.01M20 2h.01M20 6h.01M18 9h.01", neon: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z", crayon: "m4 15 10-10 5 5L9 20H4ZM14 5l4-3 4 4-3 4M7 12l5 5", eraser: "m4 16 9-11a2 2 0 0 1 3 0l5 5a2 2 0 0 1 0 3l-8 8H8l-4-4a1 1 0 0 1 0-1ZM9 10l8 8M13 21h8", undo: "M3 4v6h6M3 10c3-7 17-6 17 3 0 5-5 7-10 6", redo: "M21 4v6h-6M21 10C18 3 4 4 4 13c0 5 5 7 10 6", plus: "M12 5v14M5 12h14", minus: "M5 12h14", target: "M12 2v4M12 18v4M2 12h4M18 12h4M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0M12 12h.01", check: "m5 12 4 4L19 6", play: "m8 4 12 8-12 8Z", trash: "M3 6h18M8 6V3h8v3M5 6l1 15h12l1-15M10 10v7M14 10v7", volume: "m3 9 5 0 5-5v16l-5-5H3ZM16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14", muted: "m3 9 5 0 5-5v16l-5-5H3ZM17 9l5 6M17 15l5-6", plane: "m22 2-7 20-4-9-9-4ZM11 13l6-6" }, n = { 1: [[12, 12]], 2: [[7, 7], [17, 17]], 3: [[7, 7], [12, 12], [17, 17]], 4: [[7, 7], [17, 7], [7, 17], [17, 17]], 5: [[7, 7], [17, 7], [12, 12], [7, 17], [17, 17]], 6: [[7, 6], [17, 6], [7, 12], [17, 12], [7, 18], [17, 18]] };
    return (r, i) => (R(), L("svg", pa, [
      e.name === "dice" ? (R(), L(ge, { key: 0 }, [
        i[0] || (i[0] = m("rect", {
          x: "2",
          y: "2",
          width: "20",
          height: "20",
          rx: "4"
        }, null, -1)),
        (R(!0), L(ge, null, Be(n[e.value || 5], (s, l) => (R(), L("circle", {
          key: l,
          cx: s[0],
          cy: s[1],
          r: "1.3",
          fill: "currentColor",
          stroke: "none"
        }, null, 8, ga))), 128))
      ], 64)) : (R(), L("path", {
        key: 1,
        d: t[e.name] || t.help
      }, null, 8, va))
    ]));
  }
}), Ls = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [r, i] of t)
    n[r] = i;
  return n;
}, Qe = /* @__PURE__ */ Ls(ma, [["__scopeId", "data-v-8fcd069f"]]), ya = ["disabled", "title"], ba = {
  method: "dialog",
  class: "room-invite-panel"
}, _a = {
  class: "gl-action room-invite-close",
  "aria-label": "关闭"
}, wa = ["value"], xa = /* @__PURE__ */ Zn({
  __name: "RoomInviteButton",
  props: {
    gameId: {},
    roomCode: {},
    memberCount: {},
    maxMembers: {},
    variant: { default: "battle" }
  },
  setup(e) {
    const t = e, n = /* @__PURE__ */ _e(), r = /* @__PURE__ */ _e(!1), i = Pe(() => {
      if (!t.roomCode) return "";
      const o = new URL("/", window.location.href);
      return o.hash = `/invite?${new URLSearchParams({ gameid: t.gameId, room: t.roomCode }).toString()}`, o.href;
    }), s = Pe(() => t.memberCount >= t.maxMembers);
    async function l() {
      if (!(!i.value || s.value)) {
        r.value = !1, n.value?.showModal();
        try {
          await navigator.clipboard.writeText(i.value), r.value = !0;
        } catch {
          r.value = !1;
        }
      }
    }
    async function a() {
      try {
        await navigator.clipboard.writeText(i.value), r.value = !0;
      } catch {
        r.value = !1;
      }
    }
    return (o, d) => (R(), L(ge, null, [
      m("button", {
        class: Oe(["gl-action room-invite-trigger", `invite-${e.variant}`]),
        type: "button",
        disabled: !e.roomCode || s.value,
        title: s.value ? "房间已满，无法邀请" : "生成并复制房间邀请链接",
        onClick: l
      }, [
        Me(Qe, { name: "invite" }),
        d[1] || (d[1] = Fe("邀请", -1))
      ], 10, ya),
      m("dialog", {
        ref_key: "dialog",
        ref: n,
        class: "room-invite-dialog",
        "aria-labelledby": "room-invite-title"
      }, [
        m("form", ba, [
          m("button", _a, [
            Me(Qe, { name: "close" })
          ]),
          d[2] || (d[2] = m("small", null, "GAMELINK / ROOM INVITE", -1)),
          d[3] || (d[3] = m("h2", { id: "room-invite-title" }, "邀请好友加入", -1)),
          d[4] || (d[4] = m("p", null, "分享链接，好友打开后会自动加入房间。", -1)),
          m("input", {
            value: i.value,
            readonly: "",
            "aria-label": "房间邀请链接",
            onFocus: d[0] || (d[0] = (c) => c.target.select())
          }, null, 40, wa),
          m("button", {
            type: "button",
            class: "gl-action room-invite-copy",
            onClick: a
          }, [
            Me(Qe, {
              name: r.value ? "check" : "copy"
            }, null, 8, ["name"]),
            Fe(V(r.value ? "已复制邀请链接" : "复制邀请链接"), 1)
          ])
        ])
      ], 512)
    ], 64));
  }
}), Ma = /* @__PURE__ */ Ls(xa, [["__scopeId", "data-v-5bb541c6"]]), Le = {
  warrior: { name: "铁卫战士", power: "坚壁", text: "获得 3 点护甲", target: !1 },
  mage: { name: "星焰法师", power: "火花", text: "对敌方英雄或随从造成 1 点伤害", target: !0 },
  hunter: { name: "荒野猎手", power: "精准射击", text: "对敌方英雄造成 2 点伤害", target: !0 },
  priest: { name: "晨光牧师", power: "愈合", text: "为任意英雄或随从恢复 3 点生命", target: !0 }
}, gn = Object.keys(Le), ae = (e, t, n, r, i, s, l = {}) => ({ id: e, name: t, cost: n, kind: "unit", attack: r, health: i, value: 0, text: s, ...l }), xe = (e, t, n, r, i, s, l = {}) => ({ id: e, name: t, cost: n, kind: r, attack: 0, health: 0, value: i, text: s, ...l }), er = [
  // 22 neutral units
  ae("sprite", "微光精灵", 1, 1, 2, "轻盈的荒野伙伴"),
  ae("wolf", "荒野猎狼", 2, 3, 2, "锋利的獠牙，脆弱的身躯"),
  ae("guard", "铁壁卫士", 2, 1, 4, "嘲讽 · 保护你的英雄", { trait: "taunt" }),
  ae("scout", "疾风斥候", 3, 2, 2, "冲锋 · 入场即可攻击", { trait: "charge" }),
  ae("knight", "暮色骑士", 4, 4, 5, "攻守兼备的战士"),
  ae("warden", "森林守望者", 5, 3, 7, "嘲讽 · 坚守防线", { trait: "taunt" }),
  ae("giant", "岩脊巨人", 6, 6, 7, "沉默的荒原守护者"),
  ae("scribe", "旅途抄写员", 2, 1, 2, "战吼：抽一张牌", { cry: "draw", cryValue: 1 }),
  ae("healer", "山谷医师", 3, 2, 3, "战吼：为自己英雄恢复 3 点生命", { cry: "heal", cryValue: 3 }),
  ae("sentinel", "琥珀哨兵", 3, 2, 3, "圣盾 · 抵挡一次伤害", { shield: !0 }),
  ae("runner", "沙地奔袭者", 4, 4, 2, "冲锋 · 入场即可攻击", { trait: "charge" }),
  ae("beetle", "甲壳虫", 1, 1, 3, "坚韧的小小旅伴"),
  ae("archer", "灰羽弓手", 3, 3, 2, "战吼：对生命最低的敌方英雄造成 2 点伤害", { cry: "damage", cryValue: 2 }),
  ae("shieldbearer", "古堡执盾者", 4, 2, 6, "嘲讽", { trait: "taunt" }),
  ae("spark", "余烬灵", 2, 2, 1, "亡语：对生命最低的敌方英雄造成 2 点伤害", { death: "damage", deathValue: 2 }),
  ae("scholar", "流浪学者", 4, 2, 4, "战吼：抽两张牌", { cry: "draw", cryValue: 2 }),
  ae("oracle", "星河先知", 5, 4, 4, "亡语：抽两张牌", { death: "draw", deathValue: 2 }),
  ae("phoenix", "铜翼幼鸟", 3, 3, 2, "亡语：召唤一个 1/2 微光精灵", { death: "summon", deathValue: 1 }),
  ae("colossus", "白银巨像", 7, 6, 7, "圣盾", { shield: !0 }),
  ae("titan", "荒原泰坦", 8, 8, 9, "嘲讽", { trait: "taunt" }),
  ae("veteran", "佣兵老兵", 3, 3, 4, "沉稳可靠的前线伙伴"),
  ae("protector", "遗迹守护者", 5, 3, 5, "嘲讽，圣盾", { trait: "taunt", shield: !0 }),
  // 8 class units
  ae("ironforge", "铸甲师", 3, 2, 4, "战吼：获得 4 点护甲", { hero: "warrior", cry: "armor", cryValue: 4 }),
  ae("ironlord", "钢铁统领", 6, 5, 7, "嘲讽；亡语：获得 5 点护甲", { hero: "warrior", trait: "taunt", death: "armor", deathValue: 5 }),
  ae("apprentice", "星焰学徒", 2, 2, 2, "战吼：对生命最低的敌方英雄造成 1 点伤害", { hero: "mage", cry: "damage", cryValue: 1 }),
  ae("arcanist", "秘法领航者", 5, 4, 5, "战吼：抽两张牌", { hero: "mage", cry: "draw", cryValue: 2 }),
  ae("hawk", "裂风战鹰", 3, 3, 2, "冲锋", { hero: "hunter", trait: "charge" }),
  ae("stalker", "荒林追猎者", 5, 5, 4, "亡语：对生命最低的敌方英雄造成 3 点伤害", { hero: "hunter", death: "damage", deathValue: 3 }),
  ae("acolyte", "晨光侍者", 2, 1, 4, "战吼：为自己英雄恢复 3 点生命", { hero: "priest", cry: "heal", cryValue: 3 }),
  ae("seraph", "黎明使者", 6, 4, 7, "圣盾；亡语：为自己英雄恢复 6 点生命", { hero: "priest", shield: !0, death: "heal", deathValue: 6 }),
  // 16 neutral spells
  xe("bolt", "烈焰箭", 2, "damage", 3, "对敌方英雄或随从造成 3 点伤害"),
  xe("meteor", "陨星", 5, "damage", 7, "对敌方英雄或随从造成 7 点伤害"),
  xe("spring", "复苏之泉", 2, "heal", 5, "为任意英雄或随从恢复 5 点生命"),
  xe("wisdom", "古卷启示", 2, "draw", 2, "抽两张牌"),
  xe("storm", "雷霆风暴", 4, "area", 2, "对所有敌方随从造成 2 点伤害"),
  xe("sting", "荆棘刺", 1, "damage", 2, "对敌方英雄或随从造成 2 点伤害"),
  xe("sunrise", "晨曦祝福", 1, "heal", 3, "为任意英雄或随从恢复 3 点生命"),
  xe("meditate", "静思", 1, "draw", 1, "抽一张牌"),
  xe("insight", "深层洞察", 4, "draw", 3, "抽三张牌"),
  xe("blessing", "勇气祝福", 2, "buff", 2, "为己方随从增加 2 攻击与 2 生命"),
  xe("growth", "巨木生长", 4, "buff", 4, "为己方随从增加 4 攻击与 4 生命"),
  xe("frost", "寒霜锁链", 2, "freeze", 0, "冻结敌方随从，跳过其下回合攻击"),
  xe("earthquake", "大地震颤", 6, "area", 4, "对所有敌方随从造成 4 点伤害"),
  xe("plating", "临时装甲", 2, "armor", 5, "自己英雄获得 5 点护甲"),
  xe("comet", "彗星冲击", 3, "damage", 4, "对敌方英雄或随从造成 4 点伤害"),
  xe("renewal", "生命回响", 4, "heal", 9, "为任意英雄或随从恢复 9 点生命"),
  // 8 class spells
  xe("bastion", "钢铁堡垒", 3, "armor", 8, "获得 8 点护甲", { hero: "warrior" }),
  xe("battlecry", "战意灌注", 2, "buff", 3, "为己方随从增加 3 攻击与 3 生命", { hero: "warrior" }),
  xe("inferno", "星焰爆裂", 4, "damage", 6, "对敌方英雄或随从造成 6 点伤害", { hero: "mage" }),
  xe("blizzard", "冰封领域", 5, "area", 3, "对所有敌方随从造成 3 点伤害并冻结", { hero: "mage" }),
  xe("snipe", "致命狙击", 3, "damage", 5, "对敌方英雄或随从造成 5 点伤害", { hero: "hunter" }),
  xe("hunt", "猎踪追寻", 2, "draw", 2, "抽两张牌", { hero: "hunter" }),
  xe("radiance", "圣光涌动", 2, "heal", 7, "为任意英雄或随从恢复 7 点生命", { hero: "priest" }),
  xe("sanctify", "圣化", 3, "buff", 3, "为己方随从增加 3 攻击与 3 生命并获得圣盾", { hero: "priest" })
], Ce = (e) => er.find((t) => t.id === e), Bt = (e) => `/wild-hearth/card-art/${e}.jpg`, Ca = ["aria-label"], Sa = { class: "card-cost" }, Ta = ["src", "alt"], ka = { class: "card-stats" }, Ea = { class: "card-origin" }, Sn = /* @__PURE__ */ Zn({
  __name: "CardFace",
  props: {
    card: {}
  },
  setup(e) {
    return (t, n) => (R(), L("article", {
      class: "spell-card card-face",
      "aria-label": `${e.card.name}，${e.card.cost} 费，${e.card.text}`
    }, [
      m("span", Sa, V(e.card.cost), 1),
      m("div", {
        class: Oe(["card-art", `art-${e.card.kind}`])
      }, [
        m("img", {
          src: C(Bt)(e.card.id),
          alt: e.card.name,
          loading: "lazy",
          decoding: "async"
        }, null, 8, Ta)
      ], 2),
      m("b", null, V(e.card.name), 1),
      m("p", null, V(e.card.text), 1),
      m("small", ka, V(e.card.kind === "unit" ? `${e.card.attack} 攻 / ${e.card.health} 血` : "法术"), 1),
      m("small", Ea, V(e.card.hero ? C(Le)[e.card.hero].name : "中立"), 1)
    ], 8, Ca));
  }
});
function Aa(e, t, n, r, i) {
  const s = /* @__PURE__ */ _e(!1), l = /* @__PURE__ */ _e(), a = /* @__PURE__ */ _e(), o = /* @__PURE__ */ _e([]), d = /* @__PURE__ */ _e([]), c = /* @__PURE__ */ _e(""), g = /* @__PURE__ */ _e(!1);
  let S, $ = 0, B = 0, F = 0;
  const z = /* @__PURE__ */ new Set(), q = (k, T) => {
    const N = window.setTimeout(() => {
      z.delete(N), k();
    }, T);
    z.add(N);
  }, O = () => Date.now() < $, ee = () => e.value.players.find((k) => k.id === t.value), H = Pe(() => a.value ? Ce(a.value) : void 0), oe = Pe(() => l.value?.kind === "card" && l.value.card ? Ce(l.value.card) : void 0), Ie = Pe(() => !!l.value?.active && (l.value.kind !== "card" || ["damage", "heal", "buff", "freeze"].includes(oe.value?.kind || ""))), J = Pe(() => {
    const k = l.value;
    if (!k) return "";
    const T = Math.max(40, Math.abs(k.at.y - k.origin.y) * 0.25);
    return `M ${k.origin.x} ${k.origin.y} Q ${(k.origin.x + k.at.x) / 2} ${Math.min(k.origin.y, k.at.y) - T} ${k.at.x} ${k.at.y}`;
  });
  function ie(k) {
    if (!k) return;
    const T = k.getBoundingClientRect();
    return { x: T.x + T.width / 2, y: T.y + T.height / 2 };
  }
  function X(k, T) {
    return [...document.querySelectorAll("[data-target-player]")].find((N) => N.dataset.targetPlayer === k && (N.dataset.targetUnit || "") === (T || "")) || null;
  }
  function P(k, T, N, Q) {
    if (!s.value || k.pointerType === "touch" || k.button !== 0 || !n.value || !r.value || O()) return;
    const he = ee();
    if (!he) return;
    const De = N === void 0 ? void 0 : he.hand[N], Ye = Q ? he.units.find((me) => me.uid === Q) : void 0;
    if (T === "card" && (!De || he.mana < Ce(De).cost || Ce(De).kind === "unit" && he.units.length >= 5) || T === "unit" && (!Ye?.ready || Ye.frozen) || T === "power" && (he.power || he.mana < 2 || !Le[he.hero].target)) return;
    const G = ie(k.currentTarget) || { x: k.clientX, y: k.clientY };
    l.value = { kind: T, index: N, uid: Q, card: De, start: { x: k.clientX, y: k.clientY }, at: { x: k.clientX, y: k.clientY }, origin: G, pointer: k.pointerId, rev: e.value.rev, active: !1, valid: !1 }, a.value = void 0;
  }
  function Re(k) {
    const T = l.value;
    if (!T || T.pointer !== k.pointerId || !T.active && Math.hypot(k.clientX - T.start.x, k.clientY - T.start.y) < 7) return;
    T.active || (T.active = !0, i.reset(), T.kind === "card" ? i.pick(T.index) : T.kind === "unit" ? i.selectUnit(T.uid) : i.power()), k.preventDefault(), T.at = { x: k.clientX, y: k.clientY }, T.target = void 0, T.valid = !1, g.value = !1;
    const N = document.elementFromPoint(k.clientX, k.clientY), Q = N?.closest("[data-target-player]");
    if (Ie.value)
      Q && i.canTarget(Q.dataset.targetPlayer, Q.dataset.targetUnit) && (T.target = { player: Q.dataset.targetPlayer, unit: Q.dataset.targetUnit }, T.valid = !0);
    else {
      const he = N?.closest("[data-summon-zone]"), De = N?.closest(".battle-stage");
      if (T.valid = oe.value?.kind === "unit" ? !!he : !!De && !N?.closest(".hand"), g.value = T.valid, oe.value?.kind === "unit" && he) {
        const Ye = [...he.querySelectorAll(".unit")], G = Ye.findIndex((me) => k.clientX < (ie(me)?.x || 0));
        T.position = G < 0 ? Ye.length : G;
      }
    }
  }
  function fe() {
    l.value?.active && ($ = Date.now() + 350, i.reset()), l.value = void 0, g.value = !1;
  }
  function Ge(k) {
    const T = l.value;
    if (!T || T.pointer !== k.pointerId) return;
    if (!T.active) {
      l.value = void 0;
      return;
    }
    Re(k), $ = Date.now() + 350;
    const N = T.valid && T.rev === e.value.rev && n.value && r.value, Q = T.target;
    l.value = void 0, g.value = !1, N ? Q ? i.target(Q.player, Q.unit) : i.play(T.position) : i.reset();
  }
  function be(k) {
    k.key === "Escape" && (fe(), i.reset(), a.value = void 0);
  }
  function we() {
    s.value = !!S?.matches, s.value || fe();
  }
  function Ee(k, T) {
    return !!l.value?.active && l.value.valid && l.value.target?.player === k && l.value.target?.unit === T;
  }
  function ne(k, T, N, Q) {
    if (!k) return;
    const he = ++B;
    o.value.push({ id: he, ...k, kind: T, text: N, card: Q }), q(() => o.value = o.value.filter((De) => De.id !== he), 1e3);
  }
  let se;
  return sn(e, (k) => {
    const T = se;
    if (se = JSON.parse(JSON.stringify(k)), !T || T.phase !== "battle" || k.rev === T.rev) return;
    l.value && l.value.rev !== k.rev && fe(), a.value = void 0, (k.round !== T.round || k.players[k.turn]?.id !== T.players[T.turn]?.id) && (c.value = k.players[k.turn]?.id === t.value ? "你的回合" : `${k.players[k.turn]?.name} 的回合`, clearTimeout(F), F = window.setTimeout(() => c.value = "", 1800));
    const N = [], Q = [], he = k.log.filter((G) => !T.log.includes(G));
    for (const G of k.players) {
      const me = er.find((Ue) => Ue.kind !== "unit" && he.includes(`${G.name} 使用${Ue.name}`));
      me && ne(ie(document.querySelector(".arena-divider")), "cast", "", me.id);
    }
    for (const G of k.players) {
      const me = T.players.find((pe) => pe.id === G.id);
      if (!me) continue;
      const Ue = ie(X(G.id)), gt = me.hp + me.armor - G.hp - G.armor;
      gt > 0 ? (ne(Ue, "damage", `−${gt}`), Ue && N.push({ point: Ue, enemy: G.id !== T.players[T.turn]?.id })) : G.hp > me.hp && ne(Ue, "heal", `+${G.hp - me.hp}`), G.armor > me.armor && ne(Ue, "shield", `+${G.armor - me.armor}`);
      for (const pe of G.units) {
        const Ae = me.units.find((f) => f.uid === pe.uid), u = ie(X(G.id, pe.uid)) || ie(X(G.id));
        if (!Ae) {
          Dr(() => ne(ie(X(G.id, pe.uid)), "summon", "", pe.card));
          continue;
        }
        Ae.health > pe.health && (ne(u, "damage", `−${Ae.health - pe.health}`), u && N.push({ point: u, enemy: G.id !== T.players[T.turn]?.id })), Ae.health < pe.health && ne(u, "heal", `+${pe.health - Ae.health}`), Ae.shield && !pe.shield && (ne(u, "shield", "破盾"), u && N.push({ point: u, enemy: G.id !== T.players[T.turn]?.id })), Ae.ready && !pe.ready && k.turn === T.turn && u && Q.push({ point: u, card: pe.card });
      }
      for (const pe of me.units.filter((Ae) => !G.units.some((u) => u.uid === Ae.uid))) {
        const Ae = ie(X(G.id, pe.uid));
        ne(Ae, "death", "", pe.card), Ae && N.push({ point: Ae, enemy: G.id !== T.players[T.turn]?.id }), pe.ready && G.id === T.players[T.turn]?.id && Ae && Q.push({ point: Ae, card: pe.card });
      }
    }
    const De = Q[0], Ye = N.find((G) => G.enemy);
    if (De && Ye) {
      const G = ++B;
      d.value.push({ id: G, from: De.point, to: Ye.point, card: De.card }), q(() => d.value = d.value.filter((me) => me.id !== G), 550);
    }
  }, { flush: "pre" }), sn([n, r], () => {
    (!n.value || !r.value) && fe();
  }), jr(() => {
    S = window.matchMedia("(min-width: 901px) and (pointer: fine)"), we(), S.addEventListener("change", we), window.addEventListener("pointermove", Re, { passive: !1 }), window.addEventListener("pointerup", Ge), window.addEventListener("pointercancel", fe), window.addEventListener("blur", fe), window.addEventListener("keydown", be);
  }), Ur(() => {
    S?.removeEventListener("change", we), window.removeEventListener("pointermove", Re), window.removeEventListener("pointerup", Ge), window.removeEventListener("pointercancel", fe), window.removeEventListener("blur", fe), window.removeEventListener("keydown", be), clearTimeout(F), z.forEach((k) => clearTimeout(k));
  }), { desktop: s, drag: l, dragCard: oe, hover: a, hoverCard: H, effects: o, flights: d, announcement: c, dropZone: g, aimed: Ie, arrow: J, blocked: O, highlight: Ee, cancel: fe, startCard: (k, T) => P(k, "card", T), startUnit: (k, T) => P(k, "unit", void 0, T), startPower: (k) => P(k, "power") };
}
const Tn = () => ({ rev: 0, phase: "waiting", turn: 0, round: 0, players: [], log: [], winner: "", deadline: 0, pile: [] });
function $a(e) {
  const t = [...e];
  for (let n = t.length - 1; n > 0; n--) {
    const r = Math.floor(Math.random() * (n + 1));
    [t[n], t[r]] = [t[r], t[n]];
  }
  return t;
}
function In(e) {
  return e.map((t, n) => {
    const r = t.hero && gn.includes(t.hero) ? t.hero : gn[n % 4];
    return { id: t.id, name: t.name, hero: r, hp: 30, armor: 0, mana: 0, maxMana: 0, hand: [], units: [], fatigue: 0, power: !1 };
  });
}
function Kt(e, t) {
  const n = Math.min(e.armor, t);
  e.armor -= n, e.hp -= t - n;
}
function Yt(e, t) {
  if (!(t <= 0)) {
    if (e.shield) {
      e.shield = !1;
      return;
    }
    e.health -= t;
  }
}
function jn(e, t, n = 1) {
  for (let r = 0; r < n; r++) {
    const i = e.pile.pop();
    i ? t.hand.length < 10 && t.hand.push(i) : (t.fatigue++, Kt(t, t.fatigue));
  }
}
function Ds(e, t, n = e.units.length) {
  e.units.length >= 5 || e.units.splice(n, 0, { uid: crypto.randomUUID(), card: t.id, attack: t.attack, health: t.health, maxHealth: t.health, ready: t.trait === "charge", shield: !!t.shield, frozen: !1 });
}
function Hs(e, t, n, r) {
  if (n === "draw" && jn(e, t, r), n === "heal" && (t.hp = Math.min(30, t.hp + r)), n === "armor" && (t.armor += r), n === "summon") for (let i = 0; i < r; i++) Ds(t, Ce("sprite"));
  if (n === "damage") {
    const i = e.players.filter((s) => s.id !== t.id && s.hp > 0).sort((s, l) => s.hp - l.hp)[0];
    i && Kt(i, r);
  }
}
function Vs(e) {
  const t = e.players[e.turn];
  t.maxMana = Math.min(10, t.maxMana + 1), t.mana = t.maxMana, t.power = !1, t.units.forEach((n) => {
    n.ready = !n.frozen, n.frozen = !1;
  }), jn(e, t), e.deadline = Date.now() + 6e4;
}
function Sr(e) {
  for (let n = 0; n < 25; n++) {
    const r = e.players.flatMap((i) => i.units.filter((s) => s.health <= 0 || i.hp <= 0).map((s) => ({ p: i, u: s })));
    if (!r.length) break;
    e.players.forEach((i) => i.units = i.hp > 0 ? i.units.filter((s) => s.health > 0) : []);
    for (const { p: i, u: s } of r) {
      const l = Ce(s.card);
      i.hp > 0 && l.death && (Hs(e, i, l.death, l.deathValue || 1), e.log.unshift(`${i.name} 的${l.name}触发亡语`));
    }
  }
  e.players.forEach((n) => {
    n.hp <= 0 && (n.units = []);
  });
  const t = e.players.filter((n) => n.hp > 0);
  t.length <= 1 && (e.phase = "done", e.winner = t[0]?.id || "", e.deadline = 0, e.log.unshift(t[0] ? `${t[0].name} 成为荒野之王` : "本局平局"));
}
function Ti(e) {
  for (let t = 0; t < e.players.length; t++)
    if (e.turn = (e.turn + 1) % e.players.length, e.turn === 0 && e.round++, e.players[e.turn].hp > 0 && (Vs(e), Sr(e), e.phase === "done" || e.players[e.turn].hp > 0))
      return;
  Sr(e);
}
function kn(e, t) {
  const { pile: n, players: r, ...i } = e;
  return { ...i, pileCount: n.length, players: r.map((s) => {
    const { hand: l, ...a } = s;
    return { ...a, units: s.units.map((o) => ({ ...o })), hand: s.id === t ? [...l] : [], handCount: l.length };
  }) };
}
function ki(e, t, n) {
  if (n.rev !== e.rev) return "状态已更新，请重新操作";
  if (n.type === "class") {
    const o = e.players.find((d) => d.id === t);
    return e.phase !== "waiting" || !o || !n.hero || !gn.includes(n.hero) ? "仅可在开局前选择职业" : (o.hero = n.hero, e.rev++, "");
  }
  if (n.type === "start")
    return e.phase !== "waiting" || e.players.length < 2 || e.players.length > 4 || !e.players.some((o) => o.id === t) ? "需要 2–4 位玩家" : (e.players = In(e.players), e.pile = $a(er.flatMap((o) => [o.id, o.id])), e.players.forEach((o) => jn(e, o, 4)), e.phase = "battle", e.round = 1, e.turn = 0, Vs(e), e.log = [`${e.players.length} 位英雄踏入荒野`], e.rev++, "");
  const r = e.players[e.turn];
  if (e.phase !== "battle" || !r || r.id !== t || r.hp <= 0) return "还没有轮到你";
  const i = e.players.find((o) => o.id === n.target && o.hp > 0), s = i?.units.find((o) => o.uid === n.targetUnit), l = !!i && (!n.targetUnit || !!s), a = l && i.id !== r.id;
  if (n.type === "end")
    return Ti(e), e.rev++, "";
  if (n.type === "power") {
    if (r.power || r.mana < 2) return "英雄技能需要 2 点法力，每回合一次";
    if (r.hero === "mage" && !a || r.hero === "hunter" && (!a || s) || r.hero === "priest" && !l) return "请选择有效目标";
    r.mana -= 2, r.power = !0, r.hero === "warrior" && (r.armor += 3), r.hero === "mage" && (s ? Yt(s, 1) : Kt(i, 1)), r.hero === "hunter" && Kt(i, 2), r.hero === "priest" && (s ? s.health = Math.min(s.maxHealth, s.health + 3) : i.hp = Math.min(30, i.hp + 3)), e.log.unshift(`${r.name} 使用${Le[r.hero].power}`);
  } else if (n.type === "play") {
    if (!Number.isInteger(n.card) || n.card < 0 || n.card >= r.hand.length) return "请选择手牌";
    const o = Ce(r.hand[n.card]);
    if (r.mana < o.cost) return "法力不足";
    if (o.kind === "unit" && r.units.length >= 5) return "场上最多五个随从";
    if (o.kind === "unit" && n.position !== void 0 && (!Number.isInteger(n.position) || n.position < 0 || n.position > r.units.length)) return "请选择有效的召唤位置";
    if (o.kind === "damage" && !a || o.kind === "freeze" && (!a || !s) || o.kind === "heal" && !l || o.kind === "buff" && (!s || i?.id !== r.id)) return "请选择有效目标";
    r.mana -= o.cost, r.hand.splice(n.card, 1), o.kind === "unit" && (Ds(r, o, n.position), o.cry && Hs(e, r, o.cry, o.cryValue || 1)), o.kind === "damage" && (s ? Yt(s, o.value) : Kt(i, o.value)), o.kind === "heal" && (s ? s.health = Math.min(s.maxHealth, s.health + o.value) : i.hp = Math.min(30, i.hp + o.value)), o.kind === "draw" && jn(e, r, o.value), o.kind === "armor" && (r.armor += o.value), o.kind === "buff" && (s.attack += o.value, s.health += o.value, s.maxHealth += o.value, o.id === "sanctify" && (s.shield = !0)), o.kind === "freeze" && (s.frozen = !0), o.kind === "area" && e.players.filter((d) => d.id !== r.id && d.hp > 0).forEach((d) => d.units.forEach((c) => {
      Yt(c, o.value), o.id === "blizzard" && (c.frozen = !0);
    })), e.log.unshift(`${r.name} 使用${o.name}`);
  } else if (n.type === "attack") {
    const o = r.units.find((d) => d.uid === n.unit);
    if (!a || !o?.ready || o.frozen) return "请选择可攻击的随从和敌方目标";
    if (i.units.some((d) => Ce(d.card).trait === "taunt") && (!s || Ce(s.card).trait !== "taunt")) return "先击败该玩家的嘲讽随从";
    o.ready = !1, s ? (Yt(s, o.attack), Yt(o, s.attack)) : Kt(i, o.attack), e.log.unshift(`${r.name} 指挥随从攻击 ${i.name}`);
  } else return "未知操作";
  return Sr(e), e.phase === "battle" && e.players[e.turn].hp <= 0 && Ti(e), e.log = e.log.slice(0, 12), e.rev++, "";
}
function Oa(e) {
  const t = e.players[e.turn], n = e.players.filter((a) => a.id !== t.id && a.hp > 0).sort((a, o) => a.hp - o.hp)[0], r = { rev: e.rev };
  if (!n) return { ...r, type: "end" };
  const i = n.units.find((a) => Ce(a.card).trait === "taunt"), s = t.units.find((a) => a.ready && !a.frozen);
  if (s) return { ...r, type: "attack", unit: s.uid, target: n.id, targetUnit: i?.uid };
  const l = t.hand.findIndex((a) => {
    const o = Ce(a);
    return o.cost <= t.mana && (o.kind !== "unit" || t.units.length < 5) && (o.kind !== "heal" || t.hp < 26) && (o.kind !== "buff" || t.units.length > 0) && (o.kind !== "freeze" || n.units.some((d) => !d.frozen)) && (o.kind !== "area" || e.players.some((d) => d.id !== t.id && d.units.length));
  });
  if (l >= 0) {
    const a = Ce(t.hand[l]), o = a.kind === "heal" || a.kind === "buff";
    return { ...r, type: "play", card: l, target: o ? t.id : n.id, targetUnit: a.kind === "buff" ? t.units[0]?.uid : a.kind === "freeze" ? n.units.find((d) => !d.frozen)?.uid : a.kind === "damage" ? i?.uid : void 0 };
  }
  return t.mana >= 2 && !t.power && (t.hero !== "priest" || t.hp < 30) ? { ...r, type: "power", target: t.hero === "priest" ? t.id : n.id } : { ...r, type: "end" };
}
const Ia = { class: "hearth-header" }, Pa = {
  href: "/",
  class: "hearth-brand"
}, Ra = { class: "room-tag" }, Fa = {
  key: 0,
  class: "hearth-rules"
}, La = {
  key: 1,
  class: "card-book"
}, Da = ["value"], Ha = { class: "book-grid" }, Va = {
  key: 2,
  class: "hearth-error",
  role: "alert"
}, Na = {
  key: 3,
  class: "hearth-table"
}, ja = { class: "battle-heading" }, Ua = { key: 0 }, Ba = {
  key: 0,
  class: "hearth-lobby"
}, Ka = { class: "lobby-players" }, Wa = { class: "hero-picker" }, za = ["onClick"], qa = ["disabled"], Ja = { class: "battle-stage" }, Za = {
  key: 0,
  class: "opponent-hand",
  "aria-hidden": "true"
}, Ga = ["data-target-player", "disabled", "onClick"], Ya = { class: "hero-avatar" }, Xa = ["src"], Qa = { class: "hero-hp" }, eu = {
  key: 1,
  class: "unit-row"
}, tu = ["data-target-player", "data-target-unit", "onMouseenter", "disabled", "onClick"], nu = ["src"], ru = {
  key: 0,
  class: "empty-field"
}, iu = { class: "arena-divider" }, su = {
  key: 0,
  class: "your-field"
}, lu = {
  key: 0,
  class: "summon-marker",
  "aria-hidden": "true"
}, ou = {
  key: 1,
  class: "summon-hint"
}, au = ["data-target-player", "data-target-unit", "onPointerdown", "onMouseenter", "disabled", "onClick"], uu = ["src"], cu = {
  key: 2,
  class: "empty-field"
}, fu = { class: "your-hero" }, du = ["data-target-player", "disabled"], hu = { class: "hero-avatar" }, pu = ["src"], gu = { class: "hero-hp" }, vu = { class: "mana" }, mu = {
  class: "mana-gems",
  "aria-hidden": "true"
}, yu = ["disabled", "title"], bu = ["disabled"], _u = { class: "hero-extra" }, wu = { class: "hand-heading" }, xu = { class: "hand" }, Mu = ["onPointerdown", "onMouseenter", "disabled", "onClick"], Cu = {
  key: 0,
  class: "selection-bar"
}, Su = ["disabled"], Tu = {
  key: 0,
  class: "victory"
}, ku = { key: 1 }, Eu = { class: "battle-log" }, Au = {
  key: 4,
  class: "hearth-loading"
}, $u = {
  key: 0,
  class: "battle-drag-layer",
  "aria-hidden": "true"
}, Ou = {
  key: 0,
  class: "aim-overlay"
}, Iu = {
  id: "hearth-arrowhead",
  markerWidth: "10",
  markerHeight: "10",
  refX: "7",
  refY: "3",
  orient: "auto"
}, Pu = ["fill"], Ru = ["d"], Fu = ["d"], Lu = ["cx", "cy"], Du = {
  class: "battle-effects",
  "aria-hidden": "true"
}, Hu = ["src"], Vu = ["src"], Nu = {
  key: 1,
  class: "card-inspect",
  "aria-hidden": "true"
}, ju = {
  key: 2,
  class: "turn-announcement",
  role: "status"
}, Uu = /* @__PURE__ */ Zn({
  __name: "WildHearthPage",
  setup(e) {
    const t = /* @__PURE__ */ wl(), n = /* @__PURE__ */ _e([]), r = /* @__PURE__ */ _e(""), i = /* @__PURE__ */ _e(""), s = /* @__PURE__ */ _e(""), l = /* @__PURE__ */ _e(!1), a = /* @__PURE__ */ _e(!1), o = /* @__PURE__ */ _e(""), d = /* @__PURE__ */ _e([]), c = /* @__PURE__ */ _e(kn(Tn(), "")), g = /* @__PURE__ */ _e(), S = /* @__PURE__ */ _e(""), $ = /* @__PURE__ */ _e(!1), B = /* @__PURE__ */ _e(!1), F = /* @__PURE__ */ _e(!1), z = /* @__PURE__ */ _e("all"), q = /* @__PURE__ */ _e(Date.now());
    let O = Tn(), ee = 0, H = 0, oe = 0, Ie = !1, J = !1;
    const ie = Pe(() => er.filter((_) => z.value === "all" || (z.value === "neutral" ? !_.hero : _.hero === z.value))), X = Pe(() => l.value || s.value === r.value), P = Pe(() => c.value.players.find((_) => _.id === r.value)), Re = Pe(() => c.value.players[c.value.turn]), fe = Pe(() => c.value.phase === "battle" && Re.value?.id === r.value), Ge = Pe(() => c.value.players.filter((_) => _.id !== r.value)), be = Pe(() => l.value || !!s.value && (s.value === r.value || d.value.includes(s.value)) && c.value.players.filter((_) => _.hp > 0).every((_) => n.value.some((p) => p.id === _.id) && (_.id === r.value || d.value.includes(_.id)))), we = Pe(() => g.value === void 0 ? void 0 : Ce(P.value?.hand[g.value] || "")), Ee = Pe(() => S.value || $.value || we.value && ["damage", "heal", "buff", "freeze"].includes(we.value.kind)), ne = Pe(() => Math.min(60, Math.max(0, Math.ceil((c.value.deadline - q.value) / 1e3)))), se = Pe(() => c.value.players.find((_) => _.id === c.value.winner)?.name || "无人"), k = Pe(() => c.value.phase === "waiting" ? n.value.length >= 2 ? "两人即可开始" : "等待一位朋友" : c.value.phase === "done" ? `${se.value} 获胜` : be.value ? fe.value ? "你的回合" : `${Re.value?.name} 的回合` : "等待玩家重新连接"), { desktop: T, drag: N, dragCard: Q, hover: he, hoverCard: De, effects: Ye, flights: G, announcement: me, dropZone: Ue, aimed: gt, arrow: pe, blocked: Ae, highlight: u, startCard: f, startUnit: v, startPower: x } = Aa(c, r, fe, be, { reset: M, pick: K, selectUnit: Se, power: $e, play: te, target: re, canTarget: Y }), b = (_) => Bt({ warrior: "ironlord", mage: "arcanist", hunter: "stalker", priest: "acolyte" }[_]), w = (_) => ({ "--fan-angle": `${(_ - ((P.value?.hand.length || 1) - 1) / 2) * 3.2}deg`, "--fan-lift": `${Math.abs(_ - ((P.value?.hand.length || 1) - 1) / 2) ** 2 * 2.5}px`, "--card-order": _, "--hand-count": P.value?.hand.length || 1 });
    function A(_, p, h) {
      t.value?.send("hearth-" + _, p, { reliability: "reliable", ...h ? { target: h } : {} });
    }
    function M() {
      g.value = void 0, S.value = "", $.value = !1;
    }
    function E() {
      i.value && X.value && sessionStorage.setItem("hearth-v4:" + i.value + ":" + r.value, JSON.stringify(O));
    }
    function y(_) {
      if (X.value) {
        c.value = kn(O, r.value), E();
        for (const p of n.value) p.id !== r.value && (!_ || _ === p.id) && A("view", kn(O, p.id), p.id);
      }
    }
    function j() {
      c.value.phase === "waiting" && (s.value = [...n.value].sort((_, p) => _.id.localeCompare(p.id))[0]?.id || "", X.value && (O.players = In(n.value.map((_) => ({ ..._, hero: c.value.players.find((p) => p.id === _.id)?.hero }))), O.rev = Math.max(O.rev, c.value.rev) + 1, y()));
    }
    function I(_, p) {
      if (!X.value || !be.value) return;
      const h = ki(O, _, p);
      if (h) {
        _ === r.value ? o.value = h : A("error", h, _);
        return;
      }
      o.value = "", y();
    }
    function D(_) {
      if (J || !be.value) return;
      M();
      const p = { ..._, rev: c.value.rev };
      X.value ? I(r.value, p) : (J = !0, A("action", p), window.setTimeout(() => {
        J = !1;
      }, 2500));
    }
    function K(_) {
      Ae() || !fe.value || !be.value || (M(), g.value = _, o.value = "");
    }
    function te(_) {
      !we.value || g.value === void 0 || ["damage", "heal", "buff", "freeze"].includes(we.value.kind) || D({ type: "play", card: g.value, ...typeof _ == "number" ? { position: _ } : {} });
    }
    function Y(_, p) {
      if (!fe.value || !be.value) return !1;
      const h = c.value.players.find((le) => le.id === _), U = h?.units.find((le) => le.uid === p);
      return !h || h.hp <= 0 || p && !U ? !1 : S.value ? _ !== r.value && (!h.units.some((le) => Ce(le.card).trait === "taunt") || !!U && Ce(U.card).trait === "taunt") : $.value ? P.value?.hero === "priest" || _ !== r.value && (P.value?.hero === "mage" || P.value?.hero === "hunter" && !p) : we.value?.kind === "heal" ? !0 : we.value?.kind === "buff" ? _ === r.value && !!U : !!we.value && _ !== r.value && (we.value.kind === "damage" || we.value.kind === "freeze" && !!U);
    }
    function re(_, p) {
      Y(_, p) && (S.value ? D({ type: "attack", unit: S.value, target: _, targetUnit: p }) : $.value ? D({ type: "power", target: _, targetUnit: p }) : D({ type: "play", card: g.value, target: _, targetUnit: p }));
    }
    function Se(_) {
      if (!(Ae() || !fe.value)) {
        if (we.value && ["heal", "buff"].includes(we.value.kind) || $.value && P.value?.hero === "priest") {
          re(r.value, _);
          return;
        }
        M(), S.value = _;
      }
    }
    function $e() {
      Ae() || !P.value || (M(), Le[P.value.hero].target ? $.value = !0 : D({ type: "power" }));
    }
    function Xe(_) {
      D({ type: "class", hero: _ });
    }
    function Je() {
      X.value && (O = Tn(), O.players = In(n.value.map((_) => ({ ..._, hero: c.value.players.find((p) => p.id === _.id)?.hero }))), O.rev = c.value.rev + 1, M(), y());
    }
    function Ot(_) {
      if (n.value.some((p) => p.id === _.from))
        try {
          if (_.kind === "hearth-request") {
            y(_.from);
            return;
          }
          if (_.kind === "hearth-action" && X.value) {
            const p = _.payload;
            p && Number.isSafeInteger(p.rev) && ["start", "end", "play", "attack", "power", "class"].includes(p.type) && I(_.from, p);
            return;
          }
          if (_.from !== s.value) return;
          if (_.kind === "hearth-error" && (o.value = String(_.payload), J = !1), _.kind === "hearth-view") {
            const p = _.payload;
            if (!p || !Number.isSafeInteger(p.rev) || p.rev < c.value.rev || !Array.isArray(p.players) || p.players.length > 4 || !["waiting", "battle", "done"].includes(p.phase)) return;
            const h = p.rev !== c.value.rev;
            c.value = p, J = !1, h && M(), i.value && sessionStorage.setItem("hearth-view-v4:" + i.value + ":" + r.value, JSON.stringify({ host: s.value, state: p }));
          }
        } catch {
          o.value = "同步数据异常，请等待重连";
        }
    }
    async function bn() {
      try {
        await t.value?.leave();
      } finally {
        location.assign("/");
      }
    }
    return jr(async () => {
      try {
        if (!new URLSearchParams(location.search).has("room"))
          l.value = !0, r.value = "you", n.value = [{ id: "you", name: "你" }, { id: "bot-1", name: "赤焰" }, { id: "bot-2", name: "霜羽" }, { id: "bot-3", name: "岩牙" }].map((_) => ({ ..._, virtual_ip: "", endpoint: "" })), s.value = "you", O.players = In(n.value), ki(O, "you", { type: "start", rev: 0 }), y(), a.value = !0;
        else {
          const _ = Ns.fromLocation();
          if (_.gameId !== "gamelink-wild-hearth") throw Error("房间类型不匹配");
          t.value = _, _.on("message", Ot), _.on("members", (le) => {
            n.value = le, a.value && j();
          }), _.on("peer-ready", (le) => {
            d.value = [.../* @__PURE__ */ new Set([...d.value, le.peerId])], A("request", {}, le.peerId), y(le.peerId);
          }), _.on("peer-state", (le) => {
            le.state !== "connected" && (d.value = d.value.filter((Jt) => Jt !== le.peerId));
          }), _.on("error", (le) => o.value = le.message), _.on("room-closed", () => {
            a.value = !1, o.value = "房间已关闭";
          });
          const p = await _.joinFromLocation();
          if (Ie) {
            _.dispose();
            return;
          }
          r.value = p.self_member.id, n.value = p.room.members, i.value = p.room.code, s.value = [...n.value].sort((le, Jt) => le.id.localeCompare(Jt.id))[0].id, a.value = !0;
          const h = sessionStorage.getItem("hearth-view-v4:" + i.value + ":" + r.value);
          if (h)
            try {
              const le = JSON.parse(h);
              c.value = le.state, s.value = le.host;
            } catch {
            }
          const U = sessionStorage.getItem("hearth-v4:" + i.value + ":" + r.value);
          if (U && X.value)
            try {
              O = JSON.parse(U), c.value = kn(O, r.value);
            } catch {
              O = Tn();
            }
          j(), A("request", {}), y();
          for (const [le, Jt] of _.peerStates) Jt === "connected" && d.value.push(le);
        }
        ee = window.setInterval(() => {
          if (q.value = Date.now(), !!X.value && (q.value - oe > 3e3 && (y(), oe = q.value), O.phase === "battle")) {
            if (!be.value) {
              O.deadline = Date.now() + 6e4, c.value.deadline = O.deadline;
              return;
            }
            l.value && O.players[O.turn].id !== r.value && q.value > H ? (I(O.players[O.turn].id, Oa(O)), H = q.value + 1100) : q.value >= O.deadline && I(O.players[O.turn].id, { type: "end", rev: O.rev });
          }
        }, 500);
      } catch (_) {
        o.value = _ instanceof Error ? _.message : String(_);
      }
    }), Ur(() => {
      Ie = !0, clearInterval(ee), t.value?.dispose();
    }), (_, p) => (R(), L("main", {
      class: Oe(["hearth", { "desktop-battle": C(T) && c.value.phase !== "waiting", "is-dragging": C(N)?.active }])
    }, [
      m("header", Ia, [
        m("a", Pa, [
          Me(Qe, { name: "neon" }),
          p[14] || (p[14] = m("span", null, [
            Fe("狂野炉石"),
            m("small", null, "WILD HEARTH")
          ], -1))
        ]),
        m("span", Ra, V(i.value || "单人练习") + " · " + V(n.value.length) + "/4", 1),
        i.value ? (R(), $n(Ma, {
          key: 0,
          "game-id": "gamelink-wild-hearth",
          "room-code": i.value,
          "member-count": n.value.length,
          "max-members": 4
        }, null, 8, ["room-code", "member-count"])) : Te("", !0),
        l.value ? (R(), L("button", {
          key: 1,
          class: "gl-action",
          onClick: Je
        }, "职业")) : Te("", !0),
        m("button", {
          class: "gl-action",
          onClick: p[0] || (p[0] = (h) => F.value = !F.value)
        }, [
          Me(Qe, { name: "copy" }),
          p[15] || (p[15] = Fe("图鉴", -1))
        ]),
        m("button", {
          class: "gl-action",
          onClick: p[1] || (p[1] = (h) => B.value = !B.value)
        }, [
          Me(Qe, { name: "help" }),
          p[16] || (p[16] = Fe("规则", -1))
        ]),
        m("button", {
          class: "gl-action",
          "aria-label": "退出游戏",
          onClick: bn
        }, [
          Me(Qe, { name: "exit" })
        ])
      ]),
      B.value ? (R(), L("section", Fa, [
        p[17] || (p[17] = m("b", null, "2–4 人混战 · 最后存活者获胜", -1)),
        p[18] || (p[18] = m("p", null, "每人 30 点生命，起手四张牌。从统一随机牌堆发牌，轮到你时抽一张牌、增加一个法力水晶（最多 10）并恢复法力；手牌最多 10 张，随从最多 5 个。随从入场需等下一回合攻击，冲锋除外。攻击随从会互相造成伤害；攻击有嘲讽随从的玩家时，必须先攻击其嘲讽随从。法术不受嘲讽限制。", -1)),
        p[19] || (p[19] = m("p", null, "四个职业的技能均消耗 2 法力，每回合一次：战士加 3 护甲；法师造成 1 点伤害；猎手对敌方英雄造成 2 点伤害；牧师治疗 3 点生命。圣盾抵挡一次伤害；冻结跳过下回合攻击；战吼在入场触发，亡语在随从死亡时触发。每回合 60 秒，超时自动结束；公共牌堆用尽后抽牌受到递增疲劳伤害。桌面拖动手牌到战场出牌，拖动随从到敌方目标攻击；有目标的法术和英雄技能拖向目标释放。松开到无效位置即可取消，Esc 也可取消。手机点选手牌或己方随从，再点击目标。", -1)),
        l.value ? (R(), L("button", {
          key: 0,
          class: "gl-action",
          onClick: p[2] || (p[2] = (h) => {
            Je(), B.value = !1;
          })
        }, "重新选择练习职业")) : Te("", !0),
        m("button", {
          class: "gl-action",
          onClick: p[3] || (p[3] = (h) => B.value = !1)
        }, "收起规则")
      ])) : Te("", !0),
      F.value ? (R(), L("section", La, [
        m("header", null, [
          p[22] || (p[22] = m("b", null, "卡牌图鉴 · 54 种", -1)),
          Il(m("select", {
            "onUpdate:modelValue": p[4] || (p[4] = (h) => z.value = h),
            "aria-label": "筛选卡牌职业"
          }, [
            p[20] || (p[20] = m("option", { value: "all" }, "所有卡牌", -1)),
            p[21] || (p[21] = m("option", { value: "neutral" }, "中立卡牌", -1)),
            (R(!0), L(ge, null, Be(C(gn), (h) => (R(), L("option", {
              key: h,
              value: h
            }, V(C(Le)[h].name), 9, Da))), 128))
          ], 512), [
            [oa, z.value]
          ]),
          m("button", {
            class: "gl-action",
            "aria-label": "关闭卡牌图鉴",
            onClick: p[5] || (p[5] = (h) => F.value = !1)
          }, [
            Me(Qe, { name: "close" })
          ])
        ]),
        m("div", Ha, [
          (R(!0), L(ge, null, Be(ie.value, (h) => (R(), $n(Sn, {
            key: h.id,
            card: h
          }, null, 8, ["card"]))), 128))
        ])
      ])) : Te("", !0),
      o.value ? (R(), L("p", Va, V(o.value), 1)) : Te("", !0),
      a.value ? (R(), L("section", Na, [
        m("div", ja, [
          p[23] || (p[23] = m("span", { class: "live-mark" }, null, -1)),
          m("b", null, V(k.value), 1),
          c.value.phase === "battle" ? (R(), L("span", Ua, "第 " + V(c.value.round) + " 轮 · " + V(ne.value) + " 秒", 1)) : Te("", !0)
        ]),
        c.value.phase === "waiting" ? (R(), L("div", Ba, [
          Me(Qe, { name: "neon" }),
          p[24] || (p[24] = m("h1", null, "一片荒野，等你来战", -1)),
          p[25] || (p[25] = m("p", null, "两人即可开始，最多四人自由混战。没有阵营，最后存活者获胜。", -1)),
          m("div", Ka, [
            (R(!0), L(ge, null, Be(n.value, (h) => (R(), L("span", {
              key: h.id
            }, [
              Fe(V(h.name), 1),
              m("small", null, V(c.value.players.find((U) => U.id === h.id)?.hero ? C(Le)[c.value.players.find((U) => U.id === h.id).hero].name : "选择职业中"), 1)
            ]))), 128)),
            (R(!0), L(ge, null, Be(Math.max(0, 4 - n.value.length), (h) => (R(), L("span", {
              key: h,
              class: "empty-seat"
            }, "等待加入"))), 128))
          ]),
          m("div", Wa, [
            (R(!0), L(ge, null, Be(C(gn), (h) => (R(), L("button", {
              key: h,
              class: Oe({ chosen: P.value?.hero === h }),
              onClick: (U) => Xe(h)
            }, [
              Me(Qe, {
                name: h === "warrior" ? "target" : h === "hunter" ? "plane" : h === "priest" ? "plus" : "neon"
              }, null, 8, ["name"]),
              m("b", null, V(C(Le)[h].name), 1),
              m("span", null, V(C(Le)[h].power) + " · 2 法力", 1),
              m("small", null, V(C(Le)[h].text), 1)
            ], 10, za))), 128))
          ]),
          p[26] || (p[26] = m("p", { class: "deck-note" }, "54 种卡牌各两张组成公共随机牌堆。轮到谁就给谁发一张，任何职业都能使用抽到的卡。职业只决定英雄技能，可以重复选择。", -1)),
          m("button", {
            class: "hearth-primary",
            disabled: n.value.length < 2 || n.value.length > 4 || !be.value,
            onClick: p[6] || (p[6] = (h) => D({ type: "start" }))
          }, V(n.value.length < 2 ? "等待一位朋友" : be.value ? `${n.value.length} 人开始混战` : "等待连接完成"), 9, qa)
        ])) : (R(), L(ge, { key: 1 }, [
          m("div", Ja, [
            p[35] || (p[35] = m("div", {
              class: "table-grain",
              "aria-hidden": "true"
            }, null, -1)),
            m("div", {
              class: "opponents",
              style: rt({ "--opponent-count": Ge.value.length })
            }, [
              (R(!0), L(ge, null, Be(Ge.value, (h) => (R(), L("article", {
                key: h.id,
                class: Oe(["hero-panel", { eliminated: h.hp <= 0, current: Re.value?.id === h.id }])
              }, [
                C(T) ? (R(), L("div", Za, [
                  (R(!0), L(ge, null, Be(Math.min(10, h.handCount), (U) => (R(), L("i", {
                    key: U,
                    style: rt({ "--back-angle": `${(U - (Math.min(10, h.handCount) + 1) / 2) * 7}deg` })
                  }, null, 4))), 128))
                ])) : Te("", !0),
                m("button", {
                  class: Oe(["hero-target", { targetable: Y(h.id), "drop-target": C(u)(h.id) }]),
                  "data-target-player": h.id,
                  disabled: !Y(h.id),
                  onClick: (U) => re(h.id)
                }, [
                  m("span", Ya, [
                    m("img", {
                      src: b(h.hero),
                      alt: "",
                      draggable: "false"
                    }, null, 8, Xa)
                  ]),
                  m("span", null, [
                    m("b", null, V(h.name), 1),
                    m("small", null, V(h.hp <= 0 ? "已出局" : `${C(Le)[h.hero].name} · ${h.mana}/${h.maxMana} 法力 · ${h.handCount} 手牌`), 1)
                  ]),
                  m("strong", Qa, [
                    Fe(V(Math.max(0, h.hp)), 1),
                    m("small", null, V(h.armor ? `护甲 ${h.armor}` : "生命"), 1)
                  ])
                ], 10, Ga),
                C(T) || h.units.length ? (R(), L("div", eu, [
                  (R(!0), L(ge, null, Be(h.units, (U) => (R(), L("button", {
                    key: U.uid,
                    class: Oe(["unit", { "drop-target": C(u)(h.id, U.uid), shield: U.shield, frozen: U.frozen, taunt: C(Ce)(U.card).trait === "taunt", targetable: Y(h.id, U.uid) }]),
                    "data-target-player": h.id,
                    "data-target-unit": U.uid,
                    onMouseenter: (le) => he.value = U.card,
                    onMouseleave: p[7] || (p[7] = (le) => he.value = void 0),
                    disabled: !Y(h.id, U.uid),
                    onClick: (le) => re(h.id, U.uid)
                  }, [
                    m("img", {
                      class: "unit-portrait",
                      src: C(Bt)(U.card),
                      alt: "",
                      draggable: "false",
                      loading: "lazy",
                      decoding: "async"
                    }, null, 8, nu),
                    m("b", null, V(C(Ce)(U.card).name), 1),
                    m("span", null, [
                      m("i", null, [
                        Fe(V(U.attack), 1),
                        p[27] || (p[27] = m("span", { class: "stat-label" }, " 攻", -1))
                      ]),
                      m("em", null, [
                        Fe(V(U.health), 1),
                        p[28] || (p[28] = m("span", { class: "stat-label" }, " 血", -1))
                      ])
                    ]),
                    m("small", null, V(U.frozen ? "冻结" : U.shield ? "圣盾" : C(Ce)(U.card).trait === "taunt" ? "嘲讽" : C(Ce)(U.card).trait === "charge" ? "冲锋" : "随从"), 1)
                  ], 42, tu))), 128)),
                  h.units.length ? Te("", !0) : (R(), L("span", ru, V(h.hp <= 0 ? "英雄已倒下" : "暂无随从"), 1))
                ])) : Te("", !0)
              ], 2))), 128))
            ], 4),
            m("div", iu, [
              p[29] || (p[29] = m("span", null, "荒野战场", -1)),
              m("small", null, V(C(T) ? C(N)?.active ? C(gt) ? "拖向发光目标，松开释放" : "拖入战场，松开出牌" : "拖动卡牌出牌 · 拖动随从攻击" : Ee.value ? "点击目标完成行动" : "最后存活的英雄获胜"), 1)
            ]),
            P.value ? (R(), L("section", su, [
              m("div", {
                class: Oe(["unit-row your-units", { "summon-zone-active": C(N)?.active && C(Q)?.kind === "unit", "drop-ready": C(Ue) }]),
                "data-summon-zone": "",
                style: rt({ "--insert-position": C(N)?.position ?? P.value.units.length, "--unit-count": P.value.units.length })
              }, [
                C(T) && C(Ue) && C(Q)?.kind === "unit" ? (R(), L("span", lu)) : Te("", !0),
                C(T) && C(N)?.active && C(Q)?.kind === "unit" ? (R(), L("span", ou, "松开召唤 · " + V(P.value.units.length) + " / 5", 1)) : Te("", !0),
                (R(!0), L(ge, null, Be(P.value.units, (h) => (R(), L("button", {
                  key: h.uid,
                  class: Oe(["unit", { "drop-target": C(u)(P.value.id, h.uid), targetable: Y(P.value.id, h.uid), shield: h.shield, frozen: h.frozen, available: fe.value && h.ready && !h.frozen, chosen: S.value === h.uid, taunt: C(Ce)(h.card).trait === "taunt" }]),
                  "data-target-player": P.value.id,
                  "data-target-unit": h.uid,
                  onPointerdown: (U) => C(v)(U, h.uid),
                  onMouseenter: (U) => he.value = h.card,
                  onMouseleave: p[8] || (p[8] = (U) => he.value = void 0),
                  disabled: !fe.value || !be.value || (!h.ready || h.frozen) && !Y(P.value.id, h.uid),
                  onClick: (U) => Se(h.uid)
                }, [
                  m("img", {
                    class: "unit-portrait",
                    src: C(Bt)(h.card),
                    alt: "",
                    draggable: "false",
                    loading: "lazy",
                    decoding: "async"
                  }, null, 8, uu),
                  m("b", null, V(C(Ce)(h.card).name), 1),
                  m("span", null, [
                    m("i", null, [
                      Fe(V(h.attack), 1),
                      p[30] || (p[30] = m("span", { class: "stat-label" }, " 攻", -1))
                    ]),
                    m("em", null, [
                      Fe(V(h.health), 1),
                      p[31] || (p[31] = m("span", { class: "stat-label" }, " 血", -1))
                    ])
                  ]),
                  m("small", null, V(h.frozen ? "冻结" : h.shield ? "圣盾" : h.ready ? "可攻击" : "休整中"), 1)
                ], 42, au))), 128)),
                P.value.units.length ? Te("", !0) : (R(), L("span", cu, "打出随从，建立你的战线"))
              ], 6),
              m("div", fu, [
                m("button", {
                  class: Oe(["hero-target", { targetable: Y(P.value.id), "drop-target": C(u)(P.value.id) }]),
                  "data-target-player": P.value.id,
                  disabled: !Y(P.value.id),
                  onClick: p[9] || (p[9] = (h) => re(P.value.id))
                }, [
                  m("span", hu, [
                    m("img", {
                      src: b(P.value.hero),
                      alt: "",
                      draggable: "false"
                    }, null, 8, pu)
                  ]),
                  m("span", null, [
                    m("b", null, V(P.value.name) + " · 你", 1),
                    m("small", null, V(C(Le)[P.value.hero].name) + " · " + V(c.value.pileCount) + " 张公共牌堆", 1)
                  ]),
                  m("strong", gu, [
                    Fe(V(Math.max(0, P.value.hp)), 1),
                    m("small", null, V(P.value.armor ? `护甲 ${P.value.armor}` : "生命"), 1)
                  ])
                ], 10, du),
                m("div", vu, [
                  m("div", mu, [
                    (R(!0), L(ge, null, Be(P.value.maxMana, (h) => (R(), L("i", {
                      key: h,
                      class: Oe({ spent: h > P.value.mana })
                    }, null, 2))), 128))
                  ]),
                  m("b", null, [
                    Fe(V(P.value.mana), 1),
                    m("small", null, "/ " + V(P.value.maxMana), 1)
                  ]),
                  p[32] || (p[32] = m("span", null, "法力水晶", -1))
                ]),
                m("button", {
                  class: Oe(["hero-power", { chosen: $.value }]),
                  onPointerdown: p[10] || (p[10] = //@ts-ignore
                  (...h) => C(x) && C(x)(...h)),
                  disabled: !fe.value || P.value.power || P.value.mana < 2 || !be.value,
                  onClick: $e,
                  title: C(Le)[P.value.hero].text
                }, [
                  Me(Qe, {
                    name: P.value.hero === "priest" ? "plus" : P.value.hero === "warrior" ? "target" : "neon"
                  }, null, 8, ["name"]),
                  Fe(V(C(Le)[P.value.hero].power) + " ", 1),
                  m("small", null, V(C(T) ? "2" : "2 法力"), 1)
                ], 42, yu),
                m("button", {
                  class: "hearth-primary end-turn",
                  disabled: !fe.value || !be.value,
                  onClick: p[11] || (p[11] = (h) => D({ type: "end" }))
                }, "结束回合", 8, bu)
              ]),
              m("div", _u, [
                m("span", null, V(C(Le)[P.value.hero].power) + "：" + V(C(Le)[P.value.hero].text), 1)
              ]),
              m("div", wu, [
                m("b", null, [
                  p[33] || (p[33] = Fe("你的手牌 ", -1)),
                  m("small", null, V(P.value.handCount) + " / 10", 1)
                ]),
                m("span", null, V(P.value.hp <= 0 ? "已出局，可以继续观战" : C(T) ? "拖动出牌 · 悬停查看" : "点选卡牌查看效果"), 1)
              ]),
              m("div", xu, [
                (R(!0), L(ge, null, Be(P.value.hand, (h, U) => (R(), L("button", {
                  key: `${U}-${h}`,
                  class: Oe(["card-button", { chosen: g.value === U, affordable: fe.value && be.value && P.value.mana >= C(Ce)(h).cost && (C(Ce)(h).kind !== "unit" || P.value.units.length < 5), "card-in-drag": C(N)?.active && C(N).kind === "card" && C(N).index === U }]),
                  style: rt(w(U)),
                  onPointerdown: (le) => C(f)(le, U),
                  onMouseenter: (le) => he.value = h,
                  onMouseleave: p[12] || (p[12] = (le) => he.value = void 0),
                  disabled: !fe.value || !be.value,
                  onClick: (le) => K(U)
                }, [
                  Me(Sn, {
                    card: C(Ce)(h)
                  }, null, 8, ["card"])
                ], 46, Mu))), 128))
              ]),
              we.value || S.value || $.value ? (R(), L("div", Cu, [
                m("span", null, V(we.value ? `${we.value.name} · ${we.value.text}` : $.value ? `${C(Le)[P.value.hero].power}：${C(Le)[P.value.hero].text}，点击目标` : "点击敌方英雄或随从进行攻击"), 1),
                we.value && !Ee.value ? (R(), L("button", {
                  key: 0,
                  class: "hearth-primary",
                  disabled: P.value.mana < we.value.cost,
                  onClick: p[13] || (p[13] = (h) => te())
                }, "打出卡牌", 8, Su)) : Te("", !0),
                m("button", {
                  class: "gl-action",
                  onClick: M
                }, [
                  Me(Qe, { name: "close" }),
                  p[34] || (p[34] = Fe("取消", -1))
                ])
              ])) : Te("", !0)
            ])) : Te("", !0)
          ]),
          c.value.phase === "done" ? (R(), L("div", Tu, [
            m("h2", null, V(se.value) + "获胜", 1),
            X.value ? (R(), L("button", {
              key: 0,
              class: "hearth-primary",
              onClick: Je
            }, "再来一局")) : (R(), L("p", ku, "等待房主开启下一局"))
          ])) : Te("", !0),
          m("details", Eu, [
            p[36] || (p[36] = m("summary", null, "战斗记录", -1)),
            (R(!0), L(ge, null, Be(c.value.log, (h, U) => (R(), L("p", { key: U }, V(h), 1))), 128))
          ])
        ], 64))
      ])) : (R(), L("p", Au, V(o.value || "正在进入荒野…"), 1)),
      (R(), $n(Nl, { to: "body" }, [
        C(T) && C(N)?.active ? (R(), L("div", $u, [
          C(gt) ? (R(), L("svg", Ou, [
            m("defs", null, [
              m("marker", Iu, [
                m("path", {
                  d: "M0,0 L0,6 L8,3 z",
                  fill: C(N).valid ? "#a9eda3" : "#e9b267"
                }, null, 8, Pu)
              ])
            ]),
            m("path", {
              class: "aim-shadow",
              d: C(pe)
            }, null, 8, Ru),
            m("path", {
              class: Oe(["aim-line", { valid: C(N).valid }]),
              d: C(pe),
              "marker-end": "url(#hearth-arrowhead)"
            }, null, 10, Fu),
            m("circle", {
              cx: C(N).at.x,
              cy: C(N).at.y,
              r: "22",
              class: Oe({ valid: C(N).valid })
            }, null, 10, Lu)
          ])) : Te("", !0),
          C(Q) ? (R(), L("div", {
            key: 1,
            class: Oe(["drag-card", { aiming: C(gt), valid: C(N).valid }]),
            style: rt({ left: `${C(N).at.x}px`, top: `${C(N).at.y}px` })
          }, [
            Me(Sn, { card: C(Q) }, null, 8, ["card"])
          ], 6)) : Te("", !0),
          m("span", {
            class: "drag-instruction",
            style: rt({ left: `${C(N).at.x}px`, top: `${C(N).at.y + 42}px` })
          }, V(C(N).valid ? "松开释放" : "移到发光目标 · Esc 取消"), 5)
        ])) : Te("", !0),
        m("div", Du, [
          (R(!0), L(ge, null, Be(C(Ye), (h) => (R(), L("span", {
            key: h.id,
            class: Oe(["battle-effect", h.kind]),
            style: rt({ left: `${h.x}px`, top: `${h.y}px` })
          }, [
            h.card ? (R(), L("img", {
              key: 0,
              src: C(Bt)(h.card),
              alt: ""
            }, null, 8, Hu)) : Te("", !0),
            Fe(V(h.text), 1)
          ], 6))), 128)),
          (R(!0), L(ge, null, Be(C(G), (h) => (R(), L("img", {
            key: h.id,
            class: "attack-flight",
            src: C(Bt)(h.card),
            alt: "",
            style: rt({ left: `${h.from.x}px`, top: `${h.from.y}px`, "--flight-x": `${h.to.x - h.from.x}px`, "--flight-y": `${h.to.y - h.from.y}px` })
          }, null, 12, Vu))), 128))
        ]),
        C(T) && C(De) && !C(N)?.active && !F.value ? (R(), L("div", Nu, [
          Me(Sn, { card: C(De) }, null, 8, ["card"])
        ])) : Te("", !0),
        C(me) && c.value.phase === "battle" ? (R(), L("div", ju, V(C(me)), 1)) : Te("", !0)
      ]))
    ], 2));
  }
});
fa(Uu).mount("#app");
