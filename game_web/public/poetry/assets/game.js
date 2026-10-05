import { GameLinkClient as ll } from "./gamelink.js?v=44bdd90734fe";
// @__NO_SIDE_EFFECTS__
function Yn(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const z = {}, pt = [], Le = () => {
}, Yi = () => !1, gn = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), mn = (e) => e.startsWith("onUpdate:"), se = Object.assign, Xn = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, sl = Object.prototype.hasOwnProperty, B = (e, t) => sl.call(e, t), N = Array.isArray, rt = (e) => Jt(e) === "[object Map]", on = (e) => Jt(e) === "[object Set]", yi = (e) => Jt(e) === "[object Date]", $ = (e) => typeof e == "function", ee = (e) => typeof e == "string", je = (e) => typeof e == "symbol", q = (e) => e !== null && typeof e == "object", Xi = (e) => (q(e) || $(e)) && $(e.then) && $(e.catch), Qi = Object.prototype.toString, Jt = (e) => Qi.call(e), al = (e) => Jt(e).slice(8, -1), er = (e) => Jt(e) === "[object Object]", Qn = (e) => ee(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Dt = /* @__PURE__ */ Yn(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), vn = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, ol = /-\w/g, Te = vn(
  (e) => e.replace(ol, (t) => t.slice(1).toUpperCase())
), ul = /\B([A-Z])/g, vt = vn(
  (e) => e.replace(ul, "-$1").toLowerCase()
), tr = vn((e) => e.charAt(0).toUpperCase() + e.slice(1)), On = vn(
  (e) => e ? `on${tr(e)}` : ""
), $e = (e, t) => !Object.is(e, t), En = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, nr = (e, t, n, i = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: i,
    value: n
  });
}, hl = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let bi;
const _n = () => bi || (bi = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function ei(e) {
  if (N(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const i = e[n], r = ee(i) ? dl(i) : ei(i);
      if (r)
        for (const l in r)
          t[l] = r[l];
    }
    return t;
  } else if (ee(e) || q(e))
    return e;
}
const cl = /;(?![^(]*\))/g, fl = /:([^]+)/, wl = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function dl(e) {
  const t = {};
  return e.replace(wl, (n) => n.startsWith("/*") ? "" : n).split(cl).forEach((n) => {
    if (n) {
      const i = n.split(fl);
      i.length > 1 && (t[i[0].trim()] = i[1].trim());
    }
  }), t;
}
function Ot(e) {
  let t = "";
  if (ee(e))
    t = e;
  else if (N(e))
    for (let n = 0; n < e.length; n++) {
      const i = Ot(e[n]);
      i && (t += i + " ");
    }
  else if (q(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const pl = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", gl = /* @__PURE__ */ Yn(pl);
function ir(e) {
  return !!e || e === "";
}
function ml(e, t, n) {
  if (e.length !== t.length) return !1;
  let i = !0;
  for (let r = 0; i && r < e.length; r++)
    i = yn(e[r], t[r], n);
  return i;
}
function xi(e, t, n) {
  if (e.size !== t.size) return !1;
  const i = Array.from(t), r = new Uint8Array(i.length);
  for (const l of e) {
    let a = -1;
    for (let o = 0; o < i.length; o++)
      if (!r[o] && yn(l, i[o], n)) {
        a = o;
        break;
      }
    if (a < 0) return !1;
    r[a] = 1;
  }
  return !0;
}
function vl(e, t, n) {
  let i = rt(e), r = rt(t);
  if (i || r || (i = on(e), r = on(t), i || r))
    return i && r ? xi(e, t, n) : !1;
  const l = Object.keys(e).length, a = Object.keys(t).length;
  if (l !== a)
    return !1;
  for (const o in e) {
    const h = e.hasOwnProperty(o), c = t.hasOwnProperty(o);
    if (h && !c || !h && c || !yn(e[o], t[o], n))
      return !1;
  }
  return String(e) === String(t);
}
function Mi(e, t, n, i) {
  n || (n = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()]);
  const [r, l] = n;
  if (r.has(e) || l.has(t))
    return r.get(e) === t && l.get(t) === e;
  r.set(e, t), l.set(t, e);
  const a = i(e, t, n);
  return r.delete(e), l.delete(t), a;
}
function yn(e, t, n) {
  if (e === t) return !0;
  let i = yi(e), r = yi(t);
  return i || r ? i && r ? e.getTime() === t.getTime() : !1 : (i = je(e), r = je(t), i || r ? e === t : (i = N(e), r = N(t), i || r ? i && r ? Mi(e, t, n, ml) : !1 : (i = q(e), r = q(t), i || r ? !i || !r ? !1 : Mi(e, t, n, vl) : String(e) === String(t))));
}
const rr = (e) => !!(e && e.__v_isRef === !0), Q = (e) => ee(e) ? e : e == null ? "" : N(e) || q(e) && (e.toString === Qi || !$(e.toString)) ? rr(e) ? Q(e.value) : JSON.stringify(e, lr, 2) : String(e), lr = (e, t) => rr(t) ? lr(e, t.value) : rt(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [i, r], l) => (n[In(i, l) + " =>"] = r, n),
    {}
  )
} : on(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => In(n))
} : je(t) ? In(t) : q(t) && !N(t) && !er(t) ? String(t) : t, In = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    je(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
let le;
class _l {
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
      let t, n;
      if (this.scopes) {
        const i = this.scopes.slice();
        for (t = 0, n = i.length; t < n; t++)
          i[t].pause();
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
      const i = this.effects.slice();
      for (t = 0, n = i.length; t < n; t++)
        i[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = le;
      try {
        return le = this, t();
      } finally {
        le = n;
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
      let n, i;
      for (n = 0, i = this.effects.length; n < i; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, i = this.cleanups.length; n < i; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        const r = this.scopes.slice();
        for (n = 0, i = r.length; n < i; n++)
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
function yl() {
  return le;
}
let Z;
const Pn = /* @__PURE__ */ new WeakSet();
class sr {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, le && (le.active ? le.effects.push(this) : this.flags &= -2);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Pn.has(this) && (Pn.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || or(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Si(this), ur(this);
    const t = Z, n = Ae;
    Z = this, Ae = !0;
    try {
      return this.fn();
    } finally {
      hr(this), Z = t, Ae = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        ii(t);
      this.deps = this.depsTail = void 0, Si(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Pn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    jn(this) && this.run();
  }
  get dirty() {
    return jn(this);
  }
}
let ar = 0, Nt, $t;
function or(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = $t, $t = e;
    return;
  }
  e.next = Nt, Nt = e;
}
function ti() {
  ar++;
}
function ni() {
  if (--ar > 0)
    return;
  if ($t) {
    let t = $t;
    for ($t = void 0; t; ) {
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
        } catch (i) {
          e || (e = i);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function ur(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function hr(e) {
  let t, n = e.depsTail, i = n;
  for (; i; ) {
    const r = i.prevDep;
    i.version === -1 ? (i === n && (n = r), ii(i), bl(i)) : t = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = r;
  }
  e.deps = t, e.depsTail = n;
}
function jn(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (cr(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function cr(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Ut) || (e.globalVersion = Ut, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !jn(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = Z, i = Ae;
  Z = e, Ae = !0;
  try {
    ur(e);
    const r = e.fn(e._value);
    (t.version === 0 || $e(r, e._value)) && (e.flags |= 128, e._value = r, t.version++);
  } catch (r) {
    throw t.version++, r;
  } finally {
    Z = n, Ae = i, hr(e), e.flags &= -3;
  }
}
function ii(e, t = !1) {
  const { dep: n, prevSub: i, nextSub: r } = e;
  if (i && (i.nextSub = r, e.prevSub = void 0), r && (r.prevSub = i, e.nextSub = void 0), n.subs === e && (n.subs = i, !i && n.computed)) {
    n.computed.flags &= -5;
    for (let l = n.computed.deps; l; l = l.nextDep)
      ii(l, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function bl(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let Ae = !0;
const fr = [];
function Ze() {
  fr.push(Ae), Ae = !1;
}
function ze() {
  const e = fr.pop();
  Ae = e === void 0 ? !0 : e;
}
function Si(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = Z;
    Z = void 0;
    try {
      t();
    } finally {
      Z = n;
    }
  }
}
let Ut = 0;
class xl {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class ri {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!Z || !Ae || Z === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== Z)
      n = this.activeLink = new xl(Z, this), Z.deps ? (n.prevDep = Z.depsTail, Z.depsTail.nextDep = n, Z.depsTail = n) : Z.deps = Z.depsTail = n, wr(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const i = n.nextDep;
      i.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = i), n.prevDep = Z.depsTail, n.nextDep = void 0, Z.depsTail.nextDep = n, Z.depsTail = n, Z.deps === n && (Z.deps = i);
    }
    return n;
  }
  trigger(t) {
    this.version++, Ut++, this.notify(t);
  }
  notify(t) {
    ti();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      ni();
    }
  }
}
function wr(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let i = t.deps; i; i = i.nextDep)
        wr(i);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const Un = /* @__PURE__ */ new WeakMap(), gt = /* @__PURE__ */ Symbol(
  ""
), Vn = /* @__PURE__ */ Symbol(
  ""
), Vt = /* @__PURE__ */ Symbol(
  ""
);
function ue(e, t, n) {
  if (Ae && Z) {
    let i = Un.get(e);
    i || Un.set(e, i = /* @__PURE__ */ new Map());
    let r = i.get(n);
    r || (i.set(n, r = new ri()), r.map = i, r.key = n), r.track();
  }
}
function Ge(e, t, n, i, r, l) {
  const a = Un.get(e);
  if (!a) {
    Ut++;
    return;
  }
  const o = (h) => {
    h && h.trigger();
  };
  if (ti(), t === "clear")
    a.forEach(o);
  else {
    const h = N(e), c = h && Qn(n);
    if (h && n === "length") {
      const f = Number(i);
      a.forEach((d, M) => {
        (M === "length" || M === Vt || !je(M) && M >= f) && o(d);
      });
    } else
      switch ((n !== void 0 || a.has(void 0)) && o(a.get(n)), c && o(a.get(Vt)), t) {
        case "add":
          h ? c && o(a.get("length")) : (o(a.get(gt)), rt(e) && o(a.get(Vn)));
          break;
        case "delete":
          h || (o(a.get(gt)), rt(e) && o(a.get(Vn)));
          break;
        case "set":
          rt(e) && o(a.get(gt));
          break;
      }
  }
  ni();
}
function xt(e) {
  const t = /* @__PURE__ */ V(e);
  return t === e || (ue(t, "iterate", Vt), /* @__PURE__ */ Me(e)) ? t : /* @__PURE__ */ Ue(e) ? /* @__PURE__ */ lt(e) ? t.map((n) => st(Se(n))) : t.map(st) : t.map(Se);
}
function bn(e) {
  return ue(e = /* @__PURE__ */ V(e), "iterate", Vt), e;
}
function De(e, t) {
  return /* @__PURE__ */ Ue(e) ? st(/* @__PURE__ */ lt(e) ? Se(t) : t) : Se(t);
}
const Ml = {
  __proto__: null,
  [Symbol.iterator]() {
    return Rn(this, Symbol.iterator, (e) => De(this, e));
  },
  concat(...e) {
    return xt(this).concat(
      ...e.map((t) => N(t) ? xt(t) : t)
    );
  },
  entries() {
    return Rn(this, "entries", (e) => (e[1] = De(this, e[1]), e));
  },
  every(e, t) {
    return Be(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return Be(
      this,
      "filter",
      e,
      t,
      (n) => n.map((i) => De(this, i)),
      arguments
    );
  },
  find(e, t) {
    return Be(
      this,
      "find",
      e,
      t,
      (n) => De(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return Be(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return Be(
      this,
      "findLast",
      e,
      t,
      (n) => De(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return Be(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return Be(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Fn(this, "includes", e);
  },
  indexOf(...e) {
    return Fn(this, "indexOf", e);
  },
  join(e) {
    return xt(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return Fn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return Be(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return Pt(this, "pop");
  },
  push(...e) {
    return Pt(this, "push", e);
  },
  reduce(e, ...t) {
    return Ci(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Ci(this, "reduceRight", e, t);
  },
  shift() {
    return Pt(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return Be(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return Pt(this, "splice", e);
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
    return Pt(this, "unshift", e);
  },
  values() {
    return Rn(this, "values", (e) => De(this, e));
  }
};
function Rn(e, t, n) {
  const i = bn(e), r = i[t]();
  return i !== e && !/* @__PURE__ */ Me(e) && (r._next = r.next, r.next = () => {
    const l = r._next();
    return l.done || (l.value = n(l.value)), l;
  }), r;
}
const Sl = Array.prototype;
function Be(e, t, n, i, r, l) {
  const a = bn(e), o = a !== e && !/* @__PURE__ */ Me(e), h = a[t];
  if (h !== Sl[t]) {
    const d = h.apply(e, l);
    return o ? Se(d) : d;
  }
  let c = n;
  a !== e && (o ? c = function(d, M) {
    return n.call(this, De(e, d), M, e);
  } : n.length > 2 && (c = function(d, M) {
    return n.call(this, d, M, e);
  }));
  const f = h.call(a, c, i);
  return o && r ? r(f) : f;
}
function Ci(e, t, n, i) {
  const r = bn(e), l = r !== e && !/* @__PURE__ */ Me(e);
  let a = n, o = !1;
  r !== e && (l ? (o = i.length === 0, a = function(c, f, d) {
    return o && (o = !1, c = De(e, c)), n.call(this, c, De(e, f), d, e);
  }) : n.length > 3 && (a = function(c, f, d) {
    return n.call(this, c, f, d, e);
  }));
  const h = r[t](a, ...i);
  return o ? De(e, h) : h;
}
function Fn(e, t, n) {
  const i = /* @__PURE__ */ V(e);
  ue(i, "iterate", Vt);
  const r = i[t](...n);
  return (r === -1 || r === !1) && /* @__PURE__ */ oi(n[0]) ? (n[0] = /* @__PURE__ */ V(n[0]), i[t](...n)) : r;
}
function Pt(e, t, n = []) {
  Ze(), ti();
  const i = (/* @__PURE__ */ V(e))[t].apply(e, n);
  return ni(), ze(), i;
}
const Cl = /* @__PURE__ */ Yn("__proto__,__v_isRef,__isVue"), dr = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(je)
);
function Tl(e) {
  je(e) || (e = String(e));
  const t = /* @__PURE__ */ V(this);
  return ue(t, "has", e), t.hasOwnProperty(e);
}
class pr {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, i) {
    if (n === "__v_skip") return t.__v_skip;
    const r = this._isReadonly, l = this._isShallow;
    if (n === "__v_isReactive")
      return !r;
    if (n === "__v_isReadonly")
      return r;
    if (n === "__v_isShallow")
      return l;
    if (n === "__v_raw")
      return i === (r ? l ? Nl : _r : l ? vr : mr).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(i) ? t : void 0;
    const a = N(t);
    if (!r) {
      let h;
      if (a && (h = Ml[n]))
        return h;
      if (n === "hasOwnProperty")
        return Tl;
    }
    const o = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ ce(t) ? t : i
    );
    if ((je(n) ? dr.has(n) : Cl(n)) || (r || ue(t, "get", n), l))
      return o;
    if (/* @__PURE__ */ ce(o)) {
      const h = a && Qn(n) ? o : o.value;
      return r && q(h) ? /* @__PURE__ */ Kn(h) : h;
    }
    return q(o) ? r ? /* @__PURE__ */ Kn(o) : /* @__PURE__ */ si(o) : o;
  }
}
class gr extends pr {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, i, r) {
    let l = t[n];
    const a = N(t) && Qn(n);
    if (!this._isShallow) {
      const c = /* @__PURE__ */ Ue(l);
      if (!/* @__PURE__ */ Me(i) && !/* @__PURE__ */ Ue(i) && (l = /* @__PURE__ */ V(l), i = /* @__PURE__ */ V(i)), !a && /* @__PURE__ */ ce(l) && !/* @__PURE__ */ ce(i))
        return c || (l.value = i), !0;
    }
    const o = a ? Number(n) < t.length : B(t, n), h = Reflect.set(
      t,
      n,
      i,
      /* @__PURE__ */ ce(t) ? t : r
    );
    return t === /* @__PURE__ */ V(r) && h && (o ? $e(i, l) && Ge(t, "set", n, i) : Ge(t, "add", n, i)), h;
  }
  deleteProperty(t, n) {
    const i = B(t, n);
    t[n];
    const r = Reflect.deleteProperty(t, n);
    return r && i && Ge(t, "delete", n, void 0), r;
  }
  has(t, n) {
    const i = Reflect.has(t, n);
    return (!je(n) || !dr.has(n)) && ue(t, "has", n), i;
  }
  ownKeys(t) {
    return ue(
      t,
      "iterate",
      N(t) ? "length" : gt
    ), Reflect.ownKeys(t);
  }
}
class Al extends pr {
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
const Ol = /* @__PURE__ */ new gr(), El = /* @__PURE__ */ new Al(), Il = /* @__PURE__ */ new gr(!0);
const Bn = (e) => e, Xt = (e) => Reflect.getPrototypeOf(e);
function Pl(e, t, n) {
  return function(...i) {
    const r = this.__v_raw, l = /* @__PURE__ */ V(r), a = rt(l), o = e === "entries" || e === Symbol.iterator && a, h = e === "keys" && a, c = r[e](...i), f = n ? Bn : t ? st : Se;
    return !t && ue(
      l,
      "iterate",
      h ? Vn : gt
    ), se(
      // inheriting all iterator properties
      Object.create(c),
      {
        // iterator protocol
        next() {
          const { value: d, done: M } = c.next();
          return M ? { value: d, done: M } : {
            value: o ? [f(d[0]), f(d[1])] : f(d),
            done: M
          };
        }
      }
    );
  };
}
function Qt(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Rl(e, t) {
  const n = {
    get(r) {
      const l = this.__v_raw, a = /* @__PURE__ */ V(l), o = /* @__PURE__ */ V(r);
      e || ($e(r, o) && ue(a, "get", r), ue(a, "get", o));
      const { has: h } = Xt(a), c = t ? Bn : e ? st : Se;
      if (h.call(a, r))
        return c(l.get(r));
      if (h.call(a, o))
        return c(l.get(o));
      l !== a && l.get(r);
    },
    get size() {
      const r = this.__v_raw;
      return !e && ue(/* @__PURE__ */ V(r), "iterate", gt), r.size;
    },
    has(r) {
      const l = this.__v_raw, a = /* @__PURE__ */ V(l), o = /* @__PURE__ */ V(r);
      return e || ($e(r, o) && ue(a, "has", r), ue(a, "has", o)), r === o ? l.has(r) : l.has(r) || l.has(o);
    },
    forEach(r, l) {
      const a = this, o = a.__v_raw, h = /* @__PURE__ */ V(o), c = t ? Bn : e ? st : Se;
      return !e && ue(h, "iterate", gt), o.forEach((f, d) => r.call(l, c(f), c(d), a));
    }
  };
  return se(
    n,
    e ? {
      add: Qt("add"),
      set: Qt("set"),
      delete: Qt("delete"),
      clear: Qt("clear")
    } : {
      add(r) {
        const l = /* @__PURE__ */ V(this), a = Xt(l), o = /* @__PURE__ */ V(r), h = !t && !/* @__PURE__ */ Me(r) && !/* @__PURE__ */ Ue(r) ? o : r;
        return a.has.call(l, h) || $e(r, h) && a.has.call(l, r) || $e(o, h) && a.has.call(l, o) || (l.add(h), Ge(l, "add", h, h)), this;
      },
      set(r, l) {
        !t && !/* @__PURE__ */ Me(l) && !/* @__PURE__ */ Ue(l) && (l = /* @__PURE__ */ V(l));
        const a = /* @__PURE__ */ V(this), { has: o, get: h } = Xt(a);
        let c = o.call(a, r);
        c || (r = /* @__PURE__ */ V(r), c = o.call(a, r));
        const f = h.call(a, r);
        return a.set(r, l), c ? $e(l, f) && Ge(a, "set", r, l) : Ge(a, "add", r, l), this;
      },
      delete(r) {
        const l = /* @__PURE__ */ V(this), { has: a, get: o } = Xt(l);
        let h = a.call(l, r);
        h || (r = /* @__PURE__ */ V(r), h = a.call(l, r)), o && o.call(l, r);
        const c = l.delete(r);
        return h && Ge(l, "delete", r, void 0), c;
      },
      clear() {
        const r = /* @__PURE__ */ V(this), l = r.size !== 0, a = r.clear();
        return l && Ge(
          r,
          "clear",
          void 0,
          void 0
        ), a;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((r) => {
    n[r] = Pl(r, e, t);
  }), n;
}
function li(e, t) {
  const n = Rl(e, t);
  return (i, r, l) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? i : Reflect.get(
    B(n, r) && r in i ? n : i,
    r,
    l
  );
}
const Fl = {
  get: /* @__PURE__ */ li(!1, !1)
}, kl = {
  get: /* @__PURE__ */ li(!1, !0)
}, Dl = {
  get: /* @__PURE__ */ li(!0, !1)
};
const mr = /* @__PURE__ */ new WeakMap(), vr = /* @__PURE__ */ new WeakMap(), _r = /* @__PURE__ */ new WeakMap(), Nl = /* @__PURE__ */ new WeakMap();
function $l(e) {
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
function si(e) {
  return /* @__PURE__ */ Ue(e) ? e : ai(
    e,
    !1,
    Ol,
    Fl,
    mr
  );
}
// @__NO_SIDE_EFFECTS__
function Hl(e) {
  return ai(
    e,
    !1,
    Il,
    kl,
    vr
  );
}
// @__NO_SIDE_EFFECTS__
function Kn(e) {
  return ai(
    e,
    !0,
    El,
    Dl,
    _r
  );
}
function ai(e, t, n, i, r) {
  if (!q(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const l = r.get(e);
  if (l)
    return l;
  const a = $l(al(e));
  if (a === 0)
    return e;
  const o = new Proxy(
    e,
    a === 2 ? i : n
  );
  return r.set(e, o), o;
}
// @__NO_SIDE_EFFECTS__
function lt(e) {
  return /* @__PURE__ */ Ue(e) ? /* @__PURE__ */ lt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Ue(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Me(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function oi(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function V(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ V(t) : e;
}
function Ll(e) {
  return !B(e, "__v_skip") && Object.isExtensible(e) && nr(e, "__v_skip", !0), e;
}
const Se = (e) => q(e) ? /* @__PURE__ */ si(e) : e, st = (e) => q(e) ? /* @__PURE__ */ Kn(e) : e;
// @__NO_SIDE_EFFECTS__
function ce(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function ne(e) {
  return yr(e, !1);
}
// @__NO_SIDE_EFFECTS__
function jl(e) {
  return yr(e, !0);
}
function yr(e, t) {
  return /* @__PURE__ */ ce(e) ? e : new Ul(e, t);
}
class Ul {
  constructor(t, n) {
    this.dep = new ri(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : /* @__PURE__ */ V(t), this._value = n ? t : Se(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, i = this.__v_isShallow || /* @__PURE__ */ Me(t) || /* @__PURE__ */ Ue(t);
    t = i ? t : /* @__PURE__ */ V(t), $e(t, n) && (this._rawValue = t, this._value = i ? t : Se(t), this.dep.trigger());
  }
}
function br(e) {
  return /* @__PURE__ */ ce(e) ? e.value : e;
}
const Vl = {
  get: (e, t, n) => t === "__v_raw" ? e : br(Reflect.get(e, t, n)),
  set: (e, t, n, i) => {
    const r = e[t];
    return /* @__PURE__ */ ce(r) && !/* @__PURE__ */ ce(n) ? (r.value = n, !0) : Reflect.set(e, t, n, i);
  }
};
function xr(e) {
  return /* @__PURE__ */ lt(e) ? e : new Proxy(e, Vl);
}
class Bl {
  constructor(t, n, i) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new ri(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ut - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = i;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    Z !== this)
      return or(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return cr(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function Kl(e, t, n = !1) {
  let i, r;
  return $(e) ? i = e : (i = e.get, r = e.set), new Bl(i, r, n);
}
const en = {}, un = /* @__PURE__ */ new WeakMap();
let dt;
function Wl(e, t = !1, n = dt) {
  if (n) {
    let i = un.get(n);
    i || un.set(n, i = []), i.push(e);
  }
}
function ql(e, t, n = z) {
  const { immediate: i, deep: r, once: l, scheduler: a, augmentJob: o, call: h } = n, c = (T) => r ? T : /* @__PURE__ */ Me(T) || r === !1 || r === 0 ? it(T, 1) : it(T);
  let f, d, M, S, H = !1, R = !1;
  if (/* @__PURE__ */ ce(e) ? (d = () => e.value, H = /* @__PURE__ */ Me(e)) : /* @__PURE__ */ lt(e) ? (d = () => c(e), H = !0) : N(e) ? (R = !0, H = e.some((T) => /* @__PURE__ */ lt(T) || /* @__PURE__ */ Me(T)), d = () => e.map((T) => {
    if (/* @__PURE__ */ ce(T))
      return T.value;
    if (/* @__PURE__ */ lt(T))
      return c(T);
    if ($(T))
      return h ? h(T, 2) : T();
  })) : $(e) ? t ? d = h ? () => h(e, 2) : e : d = () => {
    if (M) {
      Ze();
      try {
        M();
      } finally {
        ze();
      }
    }
    const T = dt;
    dt = f;
    try {
      return h ? h(e, 3, [S]) : e(S);
    } finally {
      dt = T;
    }
  } : d = Le, t && r) {
    const T = d, U = r === !0 ? 1 / 0 : r;
    d = () => it(T(), U);
  }
  const I = yl(), P = () => {
    f.stop(), I && I.active && Xn(I.effects, f);
  };
  if (l && t) {
    const T = t;
    t = (...U) => {
      const ae = T(...U);
      return P(), ae;
    };
  }
  let F = R ? new Array(e.length).fill(en) : en;
  const O = (T) => {
    if (!(!(f.flags & 1) || !f.dirty && !T))
      if (t) {
        const U = f.run();
        if (T || r || H || (R ? U.some((ae, oe) => $e(ae, F[oe])) : $e(U, F))) {
          M && M();
          const ae = dt;
          dt = f;
          try {
            const oe = [
              U,
              // pass undefined as the old value when it's changed for the first time
              F === en ? void 0 : R && F[0] === en ? [] : F,
              S
            ];
            F = U, h ? h(t, 3, oe) : (
              // @ts-expect-error
              t(...oe)
            );
          } finally {
            dt = ae;
          }
        }
      } else
        f.run();
  };
  return o && o(O), f = new sr(d), f.scheduler = a ? () => a(O, !1) : O, S = (T) => Wl(T, !1, f), M = f.onStop = () => {
    const T = un.get(f);
    if (T) {
      if (h)
        h(T, 4);
      else
        for (const U of T) U();
      un.delete(f);
    }
  }, t ? i ? O(!0) : F = f.run() : a ? a(O.bind(null, !0), !0) : f.run(), P.pause = f.pause.bind(f), P.resume = f.resume.bind(f), P.stop = P, P;
}
function it(e, t = 1 / 0, n) {
  if (t <= 0 || !q(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, /* @__PURE__ */ ce(e))
    it(e.value, t, n);
  else if (N(e))
    for (let i = 0; i < e.length; i++)
      it(e[i], t, n);
  else if (on(e) || rt(e))
    e.forEach((i) => {
      it(i, t, n);
    });
  else if (er(e)) {
    for (const i in e)
      it(e[i], t, n);
    for (const i of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, i) && it(e[i], t, n);
  }
  return e;
}
function Gt(e, t, n, i) {
  try {
    return i ? e(...i) : e();
  } catch (r) {
    xn(r, t, n);
  }
}
function Oe(e, t, n, i) {
  if ($(e)) {
    const r = Gt(e, t, n, i);
    return r && Xi(r) && r.catch((l) => {
      xn(l, t, n);
    }), r;
  }
  if (N(e)) {
    const r = [];
    for (let l = 0; l < e.length; l++)
      r.push(Oe(e[l], t, n, i));
    return r;
  }
}
function xn(e, t, n, i = !0) {
  const r = t ? t.vnode : null, { errorHandler: l, throwUnhandledErrorInProduction: a } = t && t.appContext.config || z;
  if (t) {
    let o = t.parent;
    const h = t.proxy, c = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; o; ) {
      const f = o.ec;
      if (f) {
        for (let d = 0; d < f.length; d++)
          if (f[d](e, h, c) === !1)
            return;
      }
      o = o.parent;
    }
    if (l) {
      Ze(), Gt(l, null, 10, [
        e,
        h,
        c
      ]), ze();
      return;
    }
  }
  Jl(e, n, r, i, a);
}
function Jl(e, t, n, i = !0, r = !1) {
  if (r)
    throw e;
  console.error(e);
}
const pe = [];
let ke = -1;
const Ct = [];
let nt = null, St = 0;
const Mr = /* @__PURE__ */ Promise.resolve();
let hn = null;
function Gl(e) {
  const t = hn || Mr;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Zl(e) {
  let t = ke + 1, n = pe.length;
  for (; t < n; ) {
    const i = t + n >>> 1, r = pe[i], l = Bt(r);
    l < e || l === e && r.flags & 2 ? t = i + 1 : n = i;
  }
  return t;
}
function ui(e) {
  if (!(e.flags & 1)) {
    const t = Bt(e), n = pe[pe.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Bt(n) ? pe.push(e) : pe.splice(Zl(t), 0, e), e.flags |= 1, Sr();
  }
}
function Sr() {
  hn || (hn = Mr.then(Tr));
}
function zl(e) {
  if (!N(e))
    nt && e.id === -1 ? nt.splice(St + 1, 0, e) : e.flags & 1 || (Ct.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      Ct.push(e[t]);
  Sr();
}
function Ti(e, t, n = ke + 1) {
  for (; n < pe.length; n++) {
    const i = pe[n];
    if (i && i.flags & 2) {
      if (e && i.id !== e.uid)
        continue;
      pe.splice(n, 1), n--, i.flags & 4 && (i.flags &= -2), i(), i.flags & 4 || (i.flags &= -2);
    }
  }
}
function Cr(e) {
  if (Ct.length) {
    const t = [...new Set(Ct)].sort(
      (n, i) => Bt(n) - Bt(i)
    );
    if (Ct.length = 0, nt) {
      for (let n = 0; n < t.length; n++)
        nt.push(t[n]);
      return;
    }
    for (nt = t, St = 0; St < nt.length; St++) {
      const n = nt[St];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    nt = null, St = 0;
  }
}
const Bt = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Tr(e) {
  try {
    for (ke = 0; ke < pe.length; ke++) {
      const t = pe[ke];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), Gt(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; ke < pe.length; ke++) {
      const t = pe[ke];
      t && (t.flags &= -2);
    }
    ke = -1, pe.length = 0, Cr(), hn = null, (pe.length || Ct.length) && Tr();
  }
}
let He = null, Ar = null;
function cn(e) {
  const t = He;
  return He = e, Ar = e && e.type.__scopeId || null, t;
}
function Yl(e, t = He, n) {
  if (!t || e._n)
    return e;
  const i = (...r) => {
    i._d && $i(-1);
    const l = cn(t), a = mt.length;
    let o;
    try {
      o = e(...r);
    } finally {
      for (let h = mt.length; h > a; h--) Yr();
      cn(l), i._d && $i(1);
    }
    return o;
  };
  return i._n = !0, i._c = !0, i._d = !0, i;
}
function ft(e, t, n, i) {
  const r = e.dirs, l = t && t.dirs;
  for (let a = 0; a < r.length; a++) {
    const o = r[a];
    l && (o.oldValue = l[a].value);
    let h = o.dir[i];
    h && (Ze(), Oe(h, n, 8, [
      e.el,
      o,
      e,
      t
    ]), ze());
  }
}
function Xl(e, t) {
  if (ge) {
    let n = ge.provides;
    const i = ge.parent && ge.parent.provides;
    i === n && (n = ge.provides = Object.create(i)), n[e] = t;
  }
}
function nn(e, t, n = !1) {
  const i = Js();
  if (i || Tt) {
    let r = Tt ? Tt._context.provides : i ? i.parent == null || i.ce ? i.vnode.appContext && i.vnode.appContext.provides : i.parent.provides : void 0;
    if (r && e in r)
      return r[e];
    if (arguments.length > 1)
      return n && $(t) ? t.call(i && i.proxy) : t;
  }
}
const Ql = /* @__PURE__ */ Symbol.for("v-scx"), es = () => nn(Ql);
function rn(e, t, n) {
  return Or(e, t, n);
}
function Or(e, t, n = z) {
  const { immediate: i, deep: r, flush: l, once: a } = n, o = se({}, n), h = t && i || !t && l !== "post";
  let c;
  if (qt) {
    if (l === "sync") {
      const S = es();
      c = S.__watcherHandles || (S.__watcherHandles = []);
    } else if (!h) {
      const S = () => {
      };
      return S.stop = Le, S.resume = Le, S.pause = Le, S;
    }
  }
  const f = ge;
  o.call = (S, H, R) => Oe(S, f, H, R);
  let d = !1;
  l === "post" ? o.scheduler = (S) => {
    me(S, f && f.suspense);
  } : l !== "sync" && (d = !0, o.scheduler = (S, H) => {
    H ? S() : ui(S);
  }), o.augmentJob = (S) => {
    t && (S.flags |= 4), d && (S.flags |= 2, f && (S.id = f.uid, S.i = f));
  };
  const M = ql(e, t, o);
  return qt && (c ? c.push(M) : h && M()), M;
}
function ts(e, t, n) {
  const i = this.proxy, r = ee(e) ? e.includes(".") ? Er(i, e) : () => i[e] : e.bind(i, i);
  let l;
  $(t) ? l = t : (l = t.handler, n = t);
  const a = Zt(this), o = Or(r, l.bind(i), n);
  return a(), o;
}
function Er(e, t) {
  const n = t.split(".");
  return () => {
    let i = e;
    for (let r = 0; r < n.length && i; r++)
      i = i[n[r]];
    return i;
  };
}
const ns = /* @__PURE__ */ Symbol("_vte"), Mn = (e) => e.__isTeleport, kn = /* @__PURE__ */ Symbol("_leaveCb");
function is(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const n of e)
      if (n.type !== Ye) {
        t = n;
        break;
      }
  }
  return t;
}
function Ir(e) {
  if (!ci(e))
    return Mn(e.type) && e.children ? is(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: n } = e;
  if (n) {
    if (t & 16)
      return n[0];
    if (t & 32 && $(n.default))
      return n.default();
  }
}
function hi(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const n = e.component.subTree;
    hi(
      Mn(n.type) && Ir(n) || n,
      t
    );
  } else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function Sn(e, t) {
  return $(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    se({ name: e.name }, t, { setup: e })
  ) : e;
}
function Pr(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function Ai(e, t) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
const fn = /* @__PURE__ */ new WeakMap();
function Ht(e, t, n, i, r = !1) {
  if (N(e)) {
    e.forEach(
      (R, I) => Ht(
        R,
        t && (N(t) ? t[I] : t),
        n,
        i,
        r
      )
    );
    return;
  }
  if (Lt(i) && !r) {
    i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && Ht(e, t, n, i.component.subTree);
    return;
  }
  const l = i.shapeFlag & 4 ? gi(i.component) : i.el, a = r ? null : l, { i: o, r: h } = e, c = t && t.r, f = o.refs === z ? o.refs = {} : o.refs, d = o.setupState, M = /* @__PURE__ */ V(d), S = d === z ? Yi : (R) => Ai(f, R) ? !1 : B(M, R), H = (R, I) => !(I && Ai(f, I));
  if (c != null && c !== h) {
    if (Oi(t), ee(c))
      f[c] = null, S(c) && (d[c] = null);
    else if (/* @__PURE__ */ ce(c)) {
      const R = t;
      H(c, R.k) && (c.value = null), R.k && (f[R.k] = null);
    }
  }
  if ($(h))
    Gt(h, o, 12, [a, f]);
  else {
    const R = ee(h), I = /* @__PURE__ */ ce(h);
    if (R || I) {
      const P = () => {
        if (e.f) {
          const F = R ? S(h) ? d[h] : f[h] : H() || !e.k ? h.value : f[e.k];
          if (r)
            N(F) && Xn(F, l);
          else if (N(F))
            F.includes(l) || F.push(l);
          else if (R)
            f[h] = [l], S(h) && (d[h] = f[h]);
          else {
            const O = [l];
            H(h, e.k) && (h.value = O), e.k && (f[e.k] = O);
          }
        } else R ? (f[h] = a, S(h) && (d[h] = a)) : I && (H(h, e.k) && (h.value = a), e.k && (f[e.k] = a));
      };
      if (a) {
        const F = () => {
          P(), fn.delete(e);
        };
        F.id = -1, fn.set(e, F), me(F, n);
      } else
        Oi(e), P();
    }
  }
}
function Oi(e) {
  const t = fn.get(e);
  t && (t.flags |= 8, fn.delete(e));
}
_n().requestIdleCallback;
_n().cancelIdleCallback;
const Lt = (e) => !!e.type.__asyncLoader, ci = (e) => e.type.__isKeepAlive;
function rs(e, t) {
  Rr(e, "a", t);
}
function ls(e, t) {
  Rr(e, "da", t);
}
function Rr(e, t, n = ge) {
  const i = e.__wdc || (e.__wdc = () => {
    let r = n;
    for (; r; ) {
      if (r.isDeactivated)
        return;
      r = r.parent;
    }
    return e();
  });
  if (Cn(t, i, n), n) {
    let r = n.parent;
    for (; r && r.parent; )
      ci(r.parent.vnode) && ss(i, t, n, r), r = r.parent;
  }
}
function ss(e, t, n, i) {
  const r = Cn(
    t,
    e,
    i,
    !0
    /* prepend */
  );
  Fr(() => {
    Xn(i[t], r);
  }, n);
}
function Cn(e, t, n = ge, i = !1) {
  if (n) {
    const r = n[e] || (n[e] = []), l = t.__weh || (t.__weh = (...a) => {
      Ze();
      const o = Zt(n), h = Oe(t, n, e, a);
      return o(), ze(), h;
    });
    return i ? r.unshift(l) : r.push(l), l;
  }
}
const Xe = (e) => (t, n = ge) => {
  (!qt || e === "sp") && Cn(e, (...i) => t(...i), n);
}, as = Xe("bm"), fi = Xe("m"), os = Xe(
  "bu"
), us = Xe("u"), wi = Xe(
  "bum"
), Fr = Xe("um"), hs = Xe(
  "sp"
), cs = Xe("rtg"), fs = Xe("rtc");
function ws(e, t = ge) {
  Cn("ec", e, t);
}
const ds = /* @__PURE__ */ Symbol.for("v-ndc");
function Wn(e, t, n, i) {
  let r;
  const l = n, a = N(e);
  if (a || ee(e)) {
    const o = a && /* @__PURE__ */ lt(e);
    let h = !1, c = !1;
    o && (h = !/* @__PURE__ */ Me(e), c = /* @__PURE__ */ Ue(e), e = bn(e)), r = new Array(e.length);
    for (let f = 0, d = e.length; f < d; f++)
      r[f] = t(
        h ? c ? st(Se(e[f])) : Se(e[f]) : e[f],
        f,
        void 0,
        l
      );
  } else if (typeof e == "number") {
    r = new Array(e);
    for (let o = 0; o < e; o++)
      r[o] = t(o + 1, o, void 0, l);
  } else if (q(e))
    if (e[Symbol.iterator])
      r = Array.from(
        e,
        (o, h) => t(o, h, void 0, l)
      );
    else {
      const o = Object.keys(e);
      r = new Array(o.length);
      for (let h = 0, c = o.length; h < c; h++) {
        const f = o[h];
        r[h] = t(e[f], f, h, l);
      }
    }
  else
    r = [];
  return r;
}
const qn = (e) => e ? tl(e) ? gi(e) : qn(e.parent) : null, jt = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ se(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => qn(e.parent),
    $root: (e) => qn(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => Dr(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      ui(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = Gl.bind(e.proxy)),
    $watch: (e) => ts.bind(e)
  })
), Dn = (e, t) => e !== z && !e.__isScriptSetup && B(e, t), ps = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: i, data: r, props: l, accessCache: a, type: o, appContext: h } = e;
    if (t[0] !== "$") {
      const M = a[t];
      if (M !== void 0)
        switch (M) {
          case 1:
            return i[t];
          case 2:
            return r[t];
          case 4:
            return n[t];
          case 3:
            return l[t];
        }
      else {
        if (Dn(i, t))
          return a[t] = 1, i[t];
        if (r !== z && B(r, t))
          return a[t] = 2, r[t];
        if (B(l, t))
          return a[t] = 3, l[t];
        if (n !== z && B(n, t))
          return a[t] = 4, n[t];
        Jn && (a[t] = 0);
      }
    }
    const c = jt[t];
    let f, d;
    if (c)
      return t === "$attrs" && ue(e.attrs, "get", ""), c(e);
    if (
      // css module (injected by vue-loader)
      (f = o.__cssModules) && (f = f[t])
    )
      return f;
    if (n !== z && B(n, t))
      return a[t] = 4, n[t];
    if (
      // global properties
      d = h.config.globalProperties, B(d, t)
    )
      return d[t];
  },
  set({ _: e }, t, n) {
    const { data: i, setupState: r, ctx: l } = e;
    return Dn(r, t) ? (r[t] = n, !0) : i !== z && B(i, t) ? (i[t] = n, !0) : B(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (l[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: i, appContext: r, props: l, type: a }
  }, o) {
    let h;
    return !!(n[o] || e !== z && o[0] !== "$" && B(e, o) || Dn(t, o) || B(l, o) || B(i, o) || B(jt, o) || B(r.config.globalProperties, o) || (h = a.__cssModules) && h[o]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : B(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function Ei(e) {
  return N(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let Jn = !0;
function gs(e) {
  const t = Dr(e), n = e.proxy, i = e.ctx;
  Jn = !1, t.beforeCreate && Ii(t.beforeCreate, e, "bc");
  const {
    // state
    data: r,
    computed: l,
    methods: a,
    watch: o,
    provide: h,
    inject: c,
    // lifecycle
    created: f,
    beforeMount: d,
    mounted: M,
    beforeUpdate: S,
    updated: H,
    activated: R,
    deactivated: I,
    beforeDestroy: P,
    beforeUnmount: F,
    destroyed: O,
    unmounted: T,
    render: U,
    renderTracked: ae,
    renderTriggered: oe,
    errorCaptured: fe,
    serverPrefetch: at,
    // public API
    expose: we,
    inheritAttrs: Qe,
    // assets
    components: _t,
    directives: ot,
    filters: et
  } = t;
  if (c && ms(c, i, null), a)
    for (const G in a) {
      const L = a[G];
      $(L) && (i[G] = L.bind(n));
    }
  if (r) {
    const G = r.call(n, n);
    q(G) && (e.data = /* @__PURE__ */ si(G));
  }
  if (Jn = !0, l)
    for (const G in l) {
      const L = l[G], ve = $(L) ? L.bind(n, n) : $(L.get) ? L.get.bind(n, n) : Le, yt = !$(L) && $(L.set) ? L.set.bind(n) : Le, Ee = xe({
        get: ve,
        set: yt
      });
      Object.defineProperty(i, G, {
        enumerable: !0,
        configurable: !0,
        get: () => Ee.value,
        set: (_e) => Ee.value = _e
      });
    }
  if (o)
    for (const G in o)
      kr(o[G], i, n, G);
  if (h) {
    const G = $(h) ? h.call(n) : h;
    Reflect.ownKeys(G).forEach((L) => {
      Xl(L, G[L]);
    });
  }
  f && Ii(f, e, "c");
  function Y(G, L) {
    N(L) ? L.forEach((ve) => G(ve.bind(n))) : L && G(L.bind(n));
  }
  if (Y(as, d), Y(fi, M), Y(os, S), Y(us, H), Y(rs, R), Y(ls, I), Y(ws, fe), Y(fs, ae), Y(cs, oe), Y(wi, F), Y(Fr, T), Y(hs, at), N(we))
    if (we.length) {
      const G = e.exposed || (e.exposed = {});
      we.forEach((L) => {
        Object.defineProperty(G, L, {
          get: () => n[L],
          set: (ve) => n[L] = ve,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  U && e.render === Le && (e.render = U), Qe != null && (e.inheritAttrs = Qe), _t && (e.components = _t), ot && (e.directives = ot), at && Pr(e);
}
function ms(e, t, n = Le) {
  N(e) && (e = Gn(e));
  for (const i in e) {
    const r = e[i];
    let l;
    q(r) ? "default" in r ? l = nn(
      r.from || i,
      r.default,
      !0
    ) : l = nn(r.from || i) : l = nn(r), /* @__PURE__ */ ce(l) ? Object.defineProperty(t, i, {
      enumerable: !0,
      configurable: !0,
      get: () => l.value,
      set: (a) => l.value = a
    }) : t[i] = l;
  }
}
function Ii(e, t, n) {
  Oe(
    N(e) ? e.map((i) => i.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function kr(e, t, n, i) {
  let r = i.includes(".") ? Er(n, i) : () => n[i];
  if (ee(e)) {
    const l = t[e];
    $(l) && rn(r, l);
  } else if ($(e))
    rn(r, e.bind(n));
  else if (q(e))
    if (N(e))
      e.forEach((l) => kr(l, t, n, i));
    else {
      const l = $(e.handler) ? e.handler.bind(n) : t[e.handler];
      $(l) && rn(r, l, e);
    }
}
function Dr(e) {
  const t = e.type, { mixins: n, extends: i } = t, {
    mixins: r,
    optionsCache: l,
    config: { optionMergeStrategies: a }
  } = e.appContext, o = l.get(t);
  let h;
  return o ? h = o : !r.length && !n && !i ? h = t : (h = {}, r.length && r.forEach(
    (c) => wn(h, c, a, !0)
  ), wn(h, t, a)), q(t) && l.set(t, h), h;
}
function wn(e, t, n, i = !1) {
  const { mixins: r, extends: l } = t;
  l && wn(e, l, n, !0), r && r.forEach(
    (a) => wn(e, a, n, !0)
  );
  for (const a in t)
    if (!(i && a === "expose")) {
      const o = vs[a] || n && n[a];
      e[a] = o ? o(e[a], t[a]) : t[a];
    }
  return e;
}
const vs = {
  data: Pi,
  props: Ri,
  emits: Ri,
  // objects
  methods: Ft,
  computed: Ft,
  // lifecycle
  beforeCreate: de,
  created: de,
  beforeMount: de,
  mounted: de,
  beforeUpdate: de,
  updated: de,
  beforeDestroy: de,
  beforeUnmount: de,
  destroyed: de,
  unmounted: de,
  activated: de,
  deactivated: de,
  errorCaptured: de,
  serverPrefetch: de,
  // assets
  components: Ft,
  directives: Ft,
  // watch
  watch: ys,
  // provide / inject
  provide: Pi,
  inject: _s
};
function Pi(e, t) {
  return t ? e ? function() {
    return se(
      $(e) ? e.call(this, this) : e,
      $(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function _s(e, t) {
  return Ft(Gn(e), Gn(t));
}
function Gn(e) {
  if (N(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function de(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Ft(e, t) {
  return e ? se(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Ri(e, t) {
  return e ? N(e) && N(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : se(
    /* @__PURE__ */ Object.create(null),
    Ei(e),
    Ei(t ?? {})
  ) : t;
}
function ys(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = se(/* @__PURE__ */ Object.create(null), e);
  for (const i in t)
    n[i] = de(e[i], t[i]);
  return n;
}
function Nr() {
  return {
    app: null,
    config: {
      isNativeTag: Yi,
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
let bs = 0;
function xs(e, t) {
  return function(i, r = null) {
    $(i) || (i = se({}, i)), r != null && !q(r) && (r = null);
    const l = Nr(), a = /* @__PURE__ */ new WeakSet(), o = [];
    let h = !1;
    const c = l.app = {
      _uid: bs++,
      _component: i,
      _props: r,
      _container: null,
      _context: l,
      _instance: null,
      version: Qs,
      get config() {
        return l.config;
      },
      set config(f) {
      },
      use(f, ...d) {
        return a.has(f) || (f && $(f.install) ? (a.add(f), f.install(c, ...d)) : $(f) && (a.add(f), f(c, ...d))), c;
      },
      mixin(f) {
        return l.mixins.includes(f) || l.mixins.push(f), c;
      },
      component(f, d) {
        return d ? (l.components[f] = d, c) : l.components[f];
      },
      directive(f, d) {
        return d ? (l.directives[f] = d, c) : l.directives[f];
      },
      mount(f, d, M) {
        if (!h) {
          const S = c._ceVNode || ie(i, r);
          return S.appContext = l, M === !0 ? M = "svg" : M === !1 && (M = void 0), e(S, f, M), h = !0, c._container = f, f.__vue_app__ = c, gi(S.component);
        }
      },
      onUnmount(f) {
        o.push(f);
      },
      unmount() {
        h && (Oe(
          o,
          c._instance,
          16
        ), e(null, c._container), delete c._container.__vue_app__);
      },
      provide(f, d) {
        return l.provides[f] = d, c;
      },
      runWithContext(f) {
        const d = Tt;
        Tt = c;
        try {
          return f();
        } finally {
          Tt = d;
        }
      }
    };
    return c;
  };
}
let Tt = null;
const Ms = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Te(t)}Modifiers`] || e[`${vt(t)}Modifiers`];
function Ss(e, t, ...n) {
  if (e.isUnmounted) return;
  const i = e.vnode.props || z;
  let r = n;
  const l = t.startsWith("update:"), a = l && Ms(i, t.slice(7));
  a && (a.trim && (r = n.map((f) => ee(f) ? f.trim() : f)), a.number && (r = r.map(hl)));
  let o, h = i[o = On(t)] || // also try camelCase event handler (#2249)
  i[o = On(Te(t))];
  !h && l && (h = i[o = On(vt(t))]), h && Oe(
    h,
    e,
    6,
    r
  );
  const c = i[o + "Once"];
  if (c) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[o])
      return;
    e.emitted[o] = !0, Oe(
      c,
      e,
      6,
      r
    );
  }
}
const Cs = /* @__PURE__ */ new WeakMap();
function $r(e, t, n = !1) {
  const i = n ? Cs : t.emitsCache, r = i.get(e);
  if (r !== void 0)
    return r;
  const l = e.emits;
  let a = {}, o = !1;
  if (!$(e)) {
    const h = (c) => {
      const f = $r(c, t, !0);
      f && (o = !0, se(a, f));
    };
    !n && t.mixins.length && t.mixins.forEach(h), e.extends && h(e.extends), e.mixins && e.mixins.forEach(h);
  }
  return !l && !o ? (q(e) && i.set(e, null), null) : (N(l) ? l.forEach((h) => a[h] = null) : se(a, l), q(e) && i.set(e, a), a);
}
function Tn(e, t) {
  return !e || !gn(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), B(e, t[0].toLowerCase() + t.slice(1)) || B(e, vt(t)) || B(e, t));
}
function Fi(e) {
  const {
    type: t,
    vnode: n,
    proxy: i,
    withProxy: r,
    propsOptions: [l],
    slots: a,
    attrs: o,
    emit: h,
    render: c,
    renderCache: f,
    props: d,
    data: M,
    setupState: S,
    ctx: H,
    inheritAttrs: R
  } = e, I = cn(e);
  let P, F;
  try {
    if (n.shapeFlag & 4) {
      const T = r || i, U = T;
      P = Ne(
        c.call(
          U,
          T,
          f,
          d,
          S,
          M,
          H
        )
      ), F = o;
    } else {
      const T = t;
      P = Ne(
        T.length > 1 ? T(
          d,
          { attrs: o, slots: a, emit: h }
        ) : T(
          d,
          null
        )
      ), F = t.props ? o : Ts(o);
    }
  } catch (T) {
    mt.length = 0, xn(T, e, 1), P = ie(Ye);
  }
  let O = P;
  if (F && R !== !1) {
    const T = Object.keys(F), { shapeFlag: U } = O;
    T.length && U & 7 && (l && T.some(mn) && (F = As(
      F,
      l
    )), O = At(O, F, !1, !0));
  }
  if (n.dirs && (O = At(O, null, !1, !0), O.dirs = O.dirs ? O.dirs.concat(n.dirs) : n.dirs), n.transition) {
    const T = Mn(O.type) && Ir(O) || O;
    hi(T, n.transition);
  }
  return P = O, cn(I), P;
}
const Ts = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || gn(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, As = (e, t) => {
  const n = {};
  for (const i in e)
    (!mn(i) || !(i.slice(9) in t)) && (n[i] = e[i]);
  return n;
};
function Os(e, t, n) {
  const { props: i, children: r, component: l } = e, { props: a, children: o, patchFlag: h } = t, c = l.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && h >= 0) {
    if (h & 1024)
      return !0;
    if (h & 16)
      return i ? ki(i, a, c) : !!a;
    if (h & 8) {
      const f = t.dynamicProps;
      for (let d = 0; d < f.length; d++) {
        const M = f[d];
        if (Hr(a, i, M) && !Tn(c, M))
          return !0;
      }
    }
  } else
    return (r || o) && (!o || !o.$stable) ? !0 : i === a ? !1 : i ? a ? ki(i, a, c) : !0 : !!a;
  return !1;
}
function ki(e, t, n) {
  const i = Object.keys(t);
  if (i.length !== Object.keys(e).length)
    return !0;
  for (let r = 0; r < i.length; r++) {
    const l = i[r];
    if (Hr(t, e, l) && !Tn(n, l))
      return !0;
  }
  return !1;
}
function Hr(e, t, n) {
  const i = e[n], r = t[n];
  return n === "style" && q(i) && q(r) ? !yn(i, r) : i !== r;
}
function Es({ vnode: e, parent: t, suspense: n }, i) {
  for (; t; ) {
    const r = t.subTree;
    if (r.suspense && r.suspense.activeBranch === e && (r.suspense.vnode.el = r.el = i, e = r), r === e)
      (e = t.vnode).el = i, t = t.parent;
    else
      break;
  }
  n && n.activeBranch === e && (n.vnode.el = i);
}
const Lr = {}, jr = () => Object.create(Lr), Ur = (e) => Object.getPrototypeOf(e) === Lr;
function Is(e, t, n, i = !1) {
  const r = {}, l = jr();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), Vr(e, t, r, l);
  for (const a in e.propsOptions[0])
    a in r || (r[a] = void 0);
  n ? e.props = i ? r : /* @__PURE__ */ Hl(r) : e.type.props ? e.props = r : e.props = l, e.attrs = l;
}
function Ps(e, t, n, i) {
  const {
    props: r,
    attrs: l,
    vnode: { patchFlag: a }
  } = e, o = /* @__PURE__ */ V(r), [h] = e.propsOptions;
  let c = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (i || a > 0) && !(a & 16)
  ) {
    if (a & 8) {
      const f = e.vnode.dynamicProps;
      for (let d = 0; d < f.length; d++) {
        let M = f[d];
        if (Tn(e.emitsOptions, M))
          continue;
        const S = t[M];
        if (h)
          if (B(l, M))
            S !== l[M] && (l[M] = S, c = !0);
          else {
            const H = Te(M);
            r[H] = Zn(
              h,
              o,
              H,
              S,
              e,
              !1
            );
          }
        else
          S !== l[M] && (l[M] = S, c = !0);
      }
    }
  } else {
    Vr(e, t, r, l) && (c = !0);
    let f;
    for (const d in o)
      (!t || // for camelCase
      !B(t, d) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((f = vt(d)) === d || !B(t, f))) && (h ? n && // for camelCase
      (n[d] !== void 0 || // for kebab-case
      n[f] !== void 0) && (r[d] = Zn(
        h,
        o,
        d,
        void 0,
        e,
        !0
      )) : delete r[d]);
    if (l !== o)
      for (const d in l)
        (!t || !B(t, d)) && (delete l[d], c = !0);
  }
  c && Ge(e.attrs, "set", "");
}
function Vr(e, t, n, i) {
  const [r, l] = e.propsOptions;
  let a = !1, o;
  if (t)
    for (let h in t) {
      if (Dt(h))
        continue;
      const c = t[h];
      let f;
      r && B(r, f = Te(h)) ? !l || !l.includes(f) ? n[f] = c : (o || (o = {}))[f] = c : Tn(e.emitsOptions, h) || (!(h in i) || c !== i[h]) && (i[h] = c, a = !0);
    }
  if (l) {
    const h = /* @__PURE__ */ V(n), c = o || z;
    for (let f = 0; f < l.length; f++) {
      const d = l[f];
      n[d] = Zn(
        r,
        h,
        d,
        c[d],
        e,
        !B(c, d)
      );
    }
  }
  return a;
}
function Zn(e, t, n, i, r, l) {
  const a = e[n];
  if (a != null) {
    const o = B(a, "default");
    if (o && i === void 0) {
      const h = a.default;
      if (a.type !== Function && !a.skipFactory && $(h)) {
        const { propsDefaults: c } = r;
        if (n in c)
          i = c[n];
        else {
          const f = Zt(r);
          i = c[n] = h.call(
            null,
            t
          ), f();
        }
      } else
        i = h;
      r.ce && r.ce._setProp(n, i);
    }
    a[
      0
      /* shouldCast */
    ] && (l && !o ? i = !1 : a[
      1
      /* shouldCastTrue */
    ] && (i === "" || i === vt(n)) && (i = !0));
  }
  return i;
}
const Rs = /* @__PURE__ */ new WeakMap();
function Br(e, t, n = !1) {
  const i = n ? Rs : t.propsCache, r = i.get(e);
  if (r)
    return r;
  const l = e.props, a = {}, o = [];
  let h = !1;
  if (!$(e)) {
    const f = (d) => {
      h = !0;
      const [M, S] = Br(d, t, !0);
      se(a, M), S && o.push(...S);
    };
    !n && t.mixins.length && t.mixins.forEach(f), e.extends && f(e.extends), e.mixins && e.mixins.forEach(f);
  }
  if (!l && !h)
    return q(e) && i.set(e, pt), pt;
  if (N(l))
    for (let f = 0; f < l.length; f++) {
      const d = Te(l[f]);
      Di(d) && (a[d] = z);
    }
  else if (l)
    for (const f in l) {
      const d = Te(f);
      if (Di(d)) {
        const M = l[f], S = a[d] = N(M) || $(M) ? { type: M } : se({}, M), H = S.type;
        let R = !1, I = !0;
        if (N(H))
          for (let P = 0; P < H.length; ++P) {
            const F = H[P], O = $(F) && F.name;
            if (O === "Boolean") {
              R = !0;
              break;
            } else O === "String" && (I = !1);
          }
        else
          R = $(H) && H.name === "Boolean";
        S[
          0
          /* shouldCast */
        ] = R, S[
          1
          /* shouldCastTrue */
        ] = I, (R || B(S, "default")) && o.push(d);
      }
    }
  const c = [a, o];
  return q(e) && i.set(e, c), c;
}
function Di(e) {
  return e[0] !== "$" && !Dt(e);
}
const di = (e) => e === "_" || e === "_ctx" || e === "$stable", pi = (e) => N(e) ? e.map(Ne) : [Ne(e)], Fs = (e, t, n) => {
  if (t._n)
    return t;
  const i = Yl((...r) => pi(t(...r)), n);
  return i._c = !1, i;
}, Kr = (e, t, n) => {
  const i = e._ctx;
  for (const r in e) {
    if (di(r)) continue;
    const l = e[r];
    if ($(l))
      t[r] = Fs(r, l, i);
    else if (l != null) {
      const a = pi(l);
      t[r] = () => a;
    }
  }
}, Wr = (e, t) => {
  const n = pi(t);
  e.slots.default = () => n;
}, qr = (e, t, n) => {
  for (const i in t)
    (n || !di(i)) && (e[i] = t[i]);
}, ks = (e, t, n) => {
  const i = e.slots = jr();
  if (e.vnode.shapeFlag & 32) {
    const r = t._;
    r ? (qr(i, t, n), n && nr(i, "_", r, !0)) : Kr(t, i);
  } else t && Wr(e, t);
}, Ds = (e, t, n) => {
  const { vnode: i, slots: r } = e;
  let l = !0, a = z;
  if (i.shapeFlag & 32) {
    const o = t._;
    o ? n && o === 1 ? l = !1 : qr(r, t, n) : (l = !t.$stable, Kr(t, r)), a = t;
  } else t && (Wr(e, t), a = { default: 1 });
  if (l)
    for (const o in r)
      !di(o) && a[o] == null && delete r[o];
}, me = js;
function Ns(e) {
  return $s(e);
}
function $s(e, t) {
  const n = _n();
  n.__VUE__ = !0;
  const {
    insert: i,
    remove: r,
    patchProp: l,
    createElement: a,
    createText: o,
    createComment: h,
    setText: c,
    setElementText: f,
    parentNode: d,
    nextSibling: M,
    setScopeId: S = Le,
    insertStaticContent: H
  } = e, R = (s, u, w, m = null, p = null, _ = null, x = void 0, b = null, y = !!u.dynamicChildren) => {
    if (s === u)
      return;
    s && !Rt(s, u) && (m = bt(s), _e(s, p, _, !0), s = null), u.patchFlag === -2 && (y = !1, u.dynamicChildren = null), u.dynamicChildren && s && s.dynamicChildren && s.dynamicChildren.hasOnce && (u.dynamicChildren === pt && (u.dynamicChildren = []), u.dynamicChildren.hasOnce = !0);
    const { type: v, ref: E, shapeFlag: C } = u;
    switch (v) {
      case An:
        I(s, u, w, m);
        break;
      case Ye:
        P(s, u, w, m);
        break;
      case $n:
        s == null && F(u, w, m, x);
        break;
      case he:
        _t(
          s,
          u,
          w,
          m,
          p,
          _,
          x,
          b,
          y
        );
        break;
      default:
        C & 1 ? U(
          s,
          u,
          w,
          m,
          p,
          _,
          x,
          b,
          y
        ) : C & 6 ? ot(
          s,
          u,
          w,
          m,
          p,
          _,
          x,
          b,
          y
        ) : (C & 64 || C & 128) && v.process(
          s,
          u,
          w,
          m,
          p,
          _,
          x,
          b,
          y,
          ct
        );
    }
    E != null && p ? Ht(E, s && s.ref, _, u || s, !u) : E == null && s && s.ref != null && Ht(s.ref, null, _, s, !0);
  }, I = (s, u, w, m) => {
    if (s == null)
      i(
        u.el = o(u.children),
        w,
        m
      );
    else {
      const p = u.el = s.el;
      u.children !== s.children && c(p, u.children);
    }
  }, P = (s, u, w, m) => {
    s == null ? i(
      u.el = h(u.children || ""),
      w,
      m
    ) : u.el = s.el;
  }, F = (s, u, w, m) => {
    [s.el, s.anchor] = H(
      s.children,
      u,
      w,
      m,
      s.el,
      s.anchor
    );
  }, O = ({ el: s, anchor: u }, w, m) => {
    let p;
    for (; s && s !== u; )
      p = M(s), i(s, w, m), s = p;
    i(u, w, m);
  }, T = ({ el: s, anchor: u }) => {
    let w;
    for (; s && s !== u; )
      w = M(s), r(s), s = w;
    r(u);
  }, U = (s, u, w, m, p, _, x, b, y) => {
    if (u.type === "svg" ? x = "svg" : u.type === "math" && (x = "mathml"), s == null)
      ae(
        u,
        w,
        m,
        p,
        _,
        x,
        b,
        y
      );
    else {
      const v = s.el && s.el._isVueCE ? s.el : null;
      try {
        v && v._beginPatch(), at(
          s,
          u,
          p,
          _,
          x,
          b,
          y
        );
      } finally {
        v && v._endPatch();
      }
    }
  }, ae = (s, u, w, m, p, _, x, b) => {
    let y, v;
    const { props: E, shapeFlag: C, transition: A, dirs: k } = s;
    if (y = s.el = a(
      s.type,
      _,
      E && E.is,
      E
    ), C & 8 ? f(y, s.children) : C & 16 && fe(
      s.children,
      y,
      null,
      m,
      p,
      Nn(s, _),
      x,
      b
    ), k && ft(s, null, m, "created"), oe(y, s, s.scopeId, x, m), E) {
      for (const J in E)
        J !== "value" && !Dt(J) && l(y, J, null, E[J], _, m);
      "value" in E && l(y, "value", null, E.value, _), (v = E.onVnodeBeforeMount) && Fe(v, m, s);
    }
    k && ft(s, null, m, "beforeMount");
    const j = Hs(p, A);
    j && A.beforeEnter(y), i(y, u, w), ((v = E && E.onVnodeMounted) || j || k) && me(() => {
      v && Fe(v, m, s), j && A.enter(y), k && ft(s, null, m, "mounted");
    }, p);
  }, oe = (s, u, w, m, p) => {
    if (w && S(s, w), m)
      for (let _ = 0; _ < m.length; _++)
        S(s, m[_]);
    if (p) {
      let _ = p.subTree;
      if (u === _ || zr(_.type) && (_.ssContent === u || _.ssFallback === u)) {
        const x = p.vnode;
        oe(
          s,
          x,
          x.scopeId,
          x.slotScopeIds,
          p.parent
        );
      }
    }
  }, fe = (s, u, w, m, p, _, x, b, y = 0) => {
    for (let v = y; v < s.length; v++) {
      const E = s[v] = b ? qe(s[v]) : Ne(s[v]);
      R(
        null,
        E,
        u,
        w,
        m,
        p,
        _,
        x,
        b
      );
    }
  }, at = (s, u, w, m, p, _, x) => {
    const b = u.el = s.el;
    let { patchFlag: y, dynamicChildren: v, dirs: E } = u;
    y |= s.patchFlag & 16;
    const C = s.props || z, A = u.props || z;
    let k;
    if (w && wt(w, !1), (k = A.onVnodeBeforeUpdate) && Fe(k, w, u, s), E && ft(u, s, w, "beforeUpdate"), w && wt(w, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    v && (!s.dynamicChildren || s.dynamicChildren.length !== v.length) && (y = 0, x = !1, v = null), (C.innerHTML && A.innerHTML == null || C.textContent && A.textContent == null) && f(b, ""), v ? we(
      s.dynamicChildren,
      v,
      b,
      w,
      m,
      Nn(u, p),
      _
    ) : x || L(
      s,
      u,
      b,
      null,
      w,
      m,
      Nn(u, p),
      _,
      !1
    ), y > 0) {
      if (y & 16)
        Qe(b, C, A, w, p);
      else if (y & 2 && C.class !== A.class && l(b, "class", null, A.class, p), y & 4 && l(b, "style", C.style, A.style, p), y & 8) {
        const j = u.dynamicProps;
        for (let J = 0; J < j.length; J++) {
          const W = j[J], te = C[W], re = A[W];
          (re !== te || W === "value") && l(b, W, te, re, p, w);
        }
      }
      y & 1 && s.children !== u.children && f(b, u.children);
    } else !x && v == null && Qe(b, C, A, w, p);
    ((k = A.onVnodeUpdated) || E) && me(() => {
      k && Fe(k, w, u, s), E && ft(u, s, w, "updated");
    }, m);
  }, we = (s, u, w, m, p, _, x) => {
    for (let b = 0; b < u.length; b++) {
      const y = s[b], v = u[b], E = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        y.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (y.type === he || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Rt(y, v) || // - In the case of a component, it could contain anything.
        y.shapeFlag & 198) ? d(y.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          w
        )
      );
      R(
        y,
        v,
        E,
        null,
        m,
        p,
        _,
        x,
        !0
      );
    }
  }, Qe = (s, u, w, m, p) => {
    if (u !== w) {
      if (u !== z)
        for (const _ in u)
          !Dt(_) && !(_ in w) && l(
            s,
            _,
            u[_],
            null,
            p,
            m
          );
      for (const _ in w) {
        if (Dt(_)) continue;
        const x = w[_], b = u[_];
        x !== b && _ !== "value" && l(s, _, b, x, p, m);
      }
      "value" in w && l(s, "value", u.value, w.value, p);
    }
  }, _t = (s, u, w, m, p, _, x, b, y) => {
    const v = u.el = s ? s.el : o(""), E = u.anchor = s ? s.anchor : o("");
    let { patchFlag: C, dynamicChildren: A, slotScopeIds: k } = u;
    k && (b = b ? b.concat(k) : k), s == null ? (i(v, w, m), i(E, w, m), fe(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      u.children || [],
      w,
      E,
      p,
      _,
      x,
      b,
      y
    )) : C > 0 && C & 64 && A && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    s.dynamicChildren && s.dynamicChildren.length === A.length ? (we(
      s.dynamicChildren,
      A,
      w,
      p,
      _,
      x,
      b
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (u.key != null || p && u === p.subTree) && Jr(
      s,
      u,
      !0
      /* shallow */
    )) : L(
      s,
      u,
      w,
      E,
      p,
      _,
      x,
      b,
      y
    );
  }, ot = (s, u, w, m, p, _, x, b, y) => {
    u.slotScopeIds = b, s == null ? u.shapeFlag & 512 ? p.ctx.activate(
      u,
      w,
      m,
      x,
      y
    ) : et(
      u,
      w,
      m,
      p,
      _,
      x,
      y
    ) : Ve(s, u, y);
  }, et = (s, u, w, m, p, _, x) => {
    const b = s.component = qs(
      s,
      m,
      p
    );
    if (ci(s) && (b.ctx.renderer = ct), Gs(b, !1, x), b.asyncDep) {
      if (p && p.registerDep(b, Y, x), !s.el) {
        const y = b.subTree = ie(Ye);
        P(null, y, u, w), s.placeholder = y.el;
      }
    } else
      Y(
        b,
        s,
        u,
        w,
        p,
        _,
        x
      );
  }, Ve = (s, u, w) => {
    const m = u.component = s.component;
    if (Os(s, u, w))
      if (m.asyncDep && !m.asyncResolved) {
        u.el = s.el, G(m, u, w);
        return;
      } else
        m.next = u, m.update();
    else
      u.el = s.el, m.vnode = u;
  }, Y = (s, u, w, m, p, _, x) => {
    const b = () => {
      if (s.isMounted) {
        let { next: C, bu: A, u: k, parent: j, vnode: J } = s;
        {
          const Pe = Gr(s);
          if (Pe) {
            C && (C.el = J.el, G(s, C, x)), Pe.asyncDep.then(() => {
              me(() => {
                s.isUnmounted || v();
              }, p);
            });
            return;
          }
        }
        let W = C, te;
        wt(s, !1), C ? (C.el = J.el, G(s, C, x)) : C = J, A && En(A), (te = C.props && C.props.onVnodeBeforeUpdate) && Fe(te, j, C, J), wt(s, !0);
        const re = Fi(s), Ie = s.subTree;
        s.subTree = re, R(
          Ie,
          re,
          // parent may have changed if it's in a teleport
          d(Ie.el),
          // anchor may have changed if it's in a fragment
          bt(Ie),
          s,
          p,
          _
        ), C.el = re.el, W === null && Es(s, re.el), k && me(k, p), (te = C.props && C.props.onVnodeUpdated) && me(
          () => Fe(te, j, C, J),
          p
        );
      } else {
        let C;
        const { el: A, props: k } = u, { bm: j, m: J, parent: W, root: te, type: re } = s, Ie = Lt(u);
        wt(s, !1), j && En(j), !Ie && (C = k && k.onVnodeBeforeMount) && Fe(C, W, u), wt(s, !0);
        {
          te.ce && te.ce._hasShadowRoot() && te.ce._injectChildStyle(
            re,
            s.parent ? s.parent.type : void 0
          );
          const Pe = s.subTree = Fi(s);
          R(
            null,
            Pe,
            w,
            m,
            s,
            p,
            _
          ), u.el = Pe.el;
        }
        if (J && me(J, p), !Ie && (C = k && k.onVnodeMounted)) {
          const Pe = u;
          me(
            () => Fe(C, W, Pe),
            p
          );
        }
        (u.shapeFlag & 256 || W && Lt(W.vnode) && W.vnode.shapeFlag & 256) && s.a && me(s.a, p), s.isMounted = !0, u = w = m = null;
      }
    };
    s.scope.on();
    const y = s.effect = new sr(b);
    s.scope.off();
    const v = s.update = y.run.bind(y), E = s.job = y.runIfDirty.bind(y);
    E.i = s, E.id = s.uid, y.scheduler = () => ui(E), wt(s, !0), v();
  }, G = (s, u, w) => {
    u.component = s;
    const m = s.vnode.props;
    s.vnode = u, s.next = null, Ps(s, u.props, m, w), Ds(s, u.children, w), Ze(), Ti(s), ze();
  }, L = (s, u, w, m, p, _, x, b, y = !1) => {
    const v = s && s.children, E = s ? s.shapeFlag : 0, C = u.children, { patchFlag: A, shapeFlag: k } = u;
    if (A > 0) {
      if (A & 128) {
        yt(
          v,
          C,
          w,
          m,
          p,
          _,
          x,
          b,
          y
        );
        return;
      } else if (A & 256) {
        ve(
          v,
          C,
          w,
          m,
          p,
          _,
          x,
          b,
          y
        );
        return;
      }
    }
    k & 8 ? (E & 16 && ht(v, p, _), C !== v && f(w, C)) : E & 16 ? k & 16 ? yt(
      v,
      C,
      w,
      m,
      p,
      _,
      x,
      b,
      y
    ) : ht(v, p, _, !0) : (E & 8 && f(w, ""), k & 16 && fe(
      C,
      w,
      m,
      p,
      _,
      x,
      b,
      y
    ));
  }, ve = (s, u, w, m, p, _, x, b, y) => {
    s = s || pt, u = u || pt;
    const v = s.length, E = u.length, C = Math.min(v, E);
    let A;
    for (A = 0; A < C; A++) {
      const k = u[A] = y ? qe(u[A]) : Ne(u[A]);
      R(
        s[A],
        k,
        w,
        null,
        p,
        _,
        x,
        b,
        y
      );
    }
    v > E ? ht(
      s,
      p,
      _,
      !0,
      !1,
      C
    ) : fe(
      u,
      w,
      m,
      p,
      _,
      x,
      b,
      y,
      C
    );
  }, yt = (s, u, w, m, p, _, x, b, y) => {
    let v = 0;
    const E = u.length;
    let C = s.length - 1, A = E - 1;
    for (; v <= C && v <= A; ) {
      const k = s[v], j = u[v] = y ? qe(u[v]) : Ne(u[v]);
      if (Rt(k, j))
        R(
          k,
          j,
          w,
          null,
          p,
          _,
          x,
          b,
          y
        );
      else
        break;
      v++;
    }
    for (; v <= C && v <= A; ) {
      const k = s[C], j = u[A] = y ? qe(u[A]) : Ne(u[A]);
      if (Rt(k, j))
        R(
          k,
          j,
          w,
          null,
          p,
          _,
          x,
          b,
          y
        );
      else
        break;
      C--, A--;
    }
    if (v > C) {
      if (v <= A) {
        const k = A + 1, j = k < E ? u[k].el : m;
        for (; v <= A; )
          R(
            null,
            u[v] = y ? qe(u[v]) : Ne(u[v]),
            w,
            j,
            p,
            _,
            x,
            b,
            y
          ), v++;
      }
    } else if (v > A)
      for (; v <= C; )
        _e(s[v], p, _, !0), v++;
    else {
      const k = v, j = v, J = /* @__PURE__ */ new Map();
      for (v = j; v <= A; v++) {
        const ye = u[v] = y ? qe(u[v]) : Ne(u[v]);
        ye.key != null && J.set(ye.key, v);
      }
      let W, te = 0;
      const re = A - j + 1;
      let Ie = !1, Pe = 0;
      const It = new Array(re);
      for (v = 0; v < re; v++) It[v] = 0;
      for (v = k; v <= C; v++) {
        const ye = s[v];
        if (te >= re) {
          _e(ye, p, _, !0);
          continue;
        }
        let Re;
        if (ye.key != null)
          Re = J.get(ye.key);
        else
          for (W = j; W <= A; W++)
            if (It[W - j] === 0 && Rt(ye, u[W])) {
              Re = W;
              break;
            }
        Re === void 0 ? _e(ye, p, _, !0) : (It[Re - j] = v + 1, Re >= Pe ? Pe = Re : Ie = !0, R(
          ye,
          u[Re],
          w,
          null,
          p,
          _,
          x,
          b,
          y
        ), te++);
      }
      const mi = Ie ? Ls(It) : pt;
      for (W = mi.length - 1, v = re - 1; v >= 0; v--) {
        const ye = j + v, Re = u[ye], vi = u[ye + 1], _i = ye + 1 < E ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          vi.el || Zr(vi)
        ) : m;
        It[v] === 0 ? R(
          null,
          Re,
          w,
          _i,
          p,
          _,
          x,
          b,
          y
        ) : Ie && (W < 0 || v !== mi[W] ? Ee(Re, w, _i, 2) : W--);
      }
    }
  }, Ee = (s, u, w, m, p = null) => {
    const { el: _, type: x, transition: b, children: y, shapeFlag: v } = s;
    if (v & 6) {
      Ee(s.component.subTree, u, w, m);
      return;
    }
    if (v & 128) {
      s.suspense.move(u, w, m);
      return;
    }
    if (v & 64) {
      x.move(s, u, w, ct);
      return;
    }
    if (x === he) {
      i(_, u, w);
      for (let C = 0; C < y.length; C++)
        Ee(y[C], u, w, m);
      i(s.anchor, u, w);
      return;
    }
    if (x === $n) {
      O(s, u, w);
      return;
    }
    if (m !== 2 && v & 1 && b)
      if (m === 0)
        b.persisted && !_[kn] ? i(_, u, w) : (b.beforeEnter(_), i(_, u, w), me(() => b.enter(_), p));
      else {
        const { leave: C, delayLeave: A, afterLeave: k } = b, j = () => {
          s.ctx.isUnmounted ? r(_) : i(_, u, w);
        }, J = () => {
          const W = _._isLeaving || !!_[kn];
          _._isLeaving && _[kn](
            !0
            /* cancelled */
          ), b.persisted && !W ? j() : C(_, () => {
            j(), k && k();
          });
        };
        A ? A(_, j, J) : J();
      }
    else
      i(_, u, w);
  }, _e = (s, u, w, m = !1, p = !1) => {
    const {
      type: _,
      props: x,
      ref: b,
      children: y,
      dynamicChildren: v,
      shapeFlag: E,
      patchFlag: C,
      dirs: A,
      cacheIndex: k,
      memo: j
    } = s;
    if ((C === -2 || v && v.hasOnce) && (p = !1), b != null && (Ze(), Ht(b, null, w, s, !0), ze()), k != null && (!s.ctx || s.ctx === u) && (u.renderCache[k] = void 0), E & 256) {
      u.ctx.deactivate(s);
      return;
    }
    const J = E & 1 && A, W = !Lt(s);
    let te;
    if (W && (te = x && x.onVnodeBeforeUnmount) && Fe(te, u, s), E & 6)
      tt(s.component, w, m);
    else {
      if (E & 128) {
        s.suspense.unmount(w, m);
        return;
      }
      J && ft(s, null, u, "beforeUnmount"), E & 64 ? s.type.remove(
        s,
        u,
        w,
        ct,
        m
      ) : v && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !v.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (_ !== he || C > 0 && C & 64) ? ht(
        v,
        u,
        w,
        !1,
        !0
      ) : (_ === he && C & 384 || !p && E & 16) && ht(y, u, w), m && zt(s);
    }
    const re = j != null && k == null;
    (W && (te = x && x.onVnodeUnmounted) || J || re) && me(() => {
      te && Fe(te, u, s), J && ft(s, null, u, "unmounted"), re && (s.el = null);
    }, w);
  }, zt = (s) => {
    const { type: u, el: w, anchor: m, transition: p } = s;
    if (u === he) {
      ut(w, m);
      return;
    }
    if (u === $n) {
      T(s), p && !p.persisted && p.afterLeave && p.afterLeave();
      return;
    }
    const _ = () => {
      r(w), p && !p.persisted && p.afterLeave && p.afterLeave();
    };
    if (s.shapeFlag & 1 && p && !p.persisted) {
      const { leave: x, delayLeave: b } = p, y = () => x(w, _);
      b ? b(s.el, _, y) : y();
    } else
      _();
  }, ut = (s, u) => {
    let w;
    for (; s !== u; )
      w = M(s), r(s), s = w;
    r(u);
  }, tt = (s, u, w) => {
    const { bum: m, scope: p, job: _, subTree: x, um: b, m: y, a: v } = s;
    Ni(y), Ni(v), m && En(m), p.stop(), _ ? (_.flags |= 8, _e(x, s, u, w)) : s.vnode.el && x && (x.transition = s.vnode.transition, _e(x, s, u, w)), b && me(b, u), me(() => {
      s.isUnmounted = !0;
    }, u);
  }, ht = (s, u, w, m = !1, p = !1, _ = 0) => {
    for (let x = _; x < s.length; x++)
      _e(s[x], u, w, m, p);
  }, bt = (s) => {
    if (s.shapeFlag & 6)
      return bt(s.component.subTree);
    if (s.shapeFlag & 128)
      return s.suspense.next();
    const u = M(s.anchor || s.el), w = u && u[ns];
    return w ? M(w) : u;
  };
  let Et = !1;
  const Yt = (s, u, w) => {
    let m;
    s == null ? u._vnode && (_e(u._vnode, null, null, !0), m = u._vnode.component) : R(
      u._vnode || null,
      s,
      u,
      null,
      null,
      null,
      w
    ), u._vnode = s, Et || (Et = !0, Ti(m), Cr(), Et = !1);
  }, ct = {
    p: R,
    um: _e,
    m: Ee,
    r: zt,
    mt: et,
    mc: fe,
    pc: L,
    pbc: we,
    n: bt,
    o: e
  };
  return {
    render: Yt,
    hydrate: void 0,
    createApp: xs(Yt)
  };
}
function Nn({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function wt({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Hs(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Jr(e, t, n = !1) {
  const i = e.children, r = t.children;
  if (N(i) && N(r))
    for (let l = 0; l < i.length; l++) {
      const a = i[l];
      let o = r[l];
      o.shapeFlag & 1 && !o.dynamicChildren && ((o.patchFlag <= 0 || o.patchFlag === 32) && (o = r[l] = qe(r[l]), o.el = a.el), !n && o.patchFlag !== -2 && Jr(a, o)), o.type === An && (o.patchFlag === -1 && (o = r[l] = qe(o)), o.el = a.el), o.type === Ye && !o.el && (o.el = a.el);
    }
}
function Ls(e) {
  const t = e.slice(), n = [0];
  let i, r, l, a, o;
  const h = e.length;
  for (i = 0; i < h; i++) {
    const c = e[i];
    if (c !== 0) {
      if (r = n[n.length - 1], e[r] < c) {
        t[i] = r, n.push(i);
        continue;
      }
      for (l = 0, a = n.length - 1; l < a; )
        o = l + a >> 1, e[n[o]] < c ? l = o + 1 : a = o;
      c < e[n[l]] && (l > 0 && (t[i] = n[l - 1]), n[l] = i);
    }
  }
  for (l = n.length, a = n[l - 1]; l-- > 0; )
    n[l] = a, a = t[a];
  return n;
}
function Gr(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : Gr(t);
}
function Ni(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function Zr(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  return t ? Zr(t.subTree) : null;
}
const zr = (e) => e.__isSuspense;
function js(e, t) {
  t && t.pendingBranch ? N(e) ? t.effects.push(...e) : t.effects.push(e) : zl(e);
}
const he = /* @__PURE__ */ Symbol.for("v-fgt"), An = /* @__PURE__ */ Symbol.for("v-txt"), Ye = /* @__PURE__ */ Symbol.for("v-cmt"), $n = /* @__PURE__ */ Symbol.for("v-stc"), mt = [];
let be = null;
function K(e = !1) {
  mt.push(be = e ? null : []);
}
function Yr() {
  mt.pop(), be = mt[mt.length - 1] || null;
}
let Kt = 1;
function $i(e, t = !1) {
  Kt += e, e < 0 && be && t && (be.hasOnce = !0);
}
function Xr(e) {
  return e.dynamicChildren = Kt > 0 ? be || pt : null, Yr(), Kt > 0 && be && be.push(e), e;
}
function X(e, t, n, i, r, l) {
  return Xr(
    D(
      e,
      t,
      n,
      i,
      r,
      l,
      !0
    )
  );
}
function ln(e, t, n, i, r) {
  return Xr(
    ie(
      e,
      t,
      n,
      i,
      r,
      !0
    )
  );
}
function Qr(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Rt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const el = ({ key: e }) => e ?? null, sn = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? ee(e) || /* @__PURE__ */ ce(e) || $(e) ? { i: He, r: e, k: t, f: !!n } : e : null);
function D(e, t = null, n = null, i = 0, r = null, l = e === he ? 0 : 1, a = !1, o = !1) {
  const h = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && el(t),
    ref: t && sn(t),
    scopeId: Ar,
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
    patchFlag: i,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: He
  };
  return o ? (dn(h, n), l & 128 && e.normalize(h)) : n && (h.shapeFlag |= ee(n) ? 8 : 16), Kt > 0 && // avoid a block node from tracking itself
  !a && // has current parent block
  be && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (h.patchFlag > 0 || l & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  h.patchFlag !== 32 && be.push(h), h;
}
const ie = Us;
function Us(e, t = null, n = null, i = 0, r = null, l = !1) {
  if ((!e || e === ds) && (e = Ye), Qr(e)) {
    const o = At(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && dn(o, n), Kt > 0 && !l && be && (o.shapeFlag & 6 ? be[be.indexOf(e)] = o : be.push(o)), o.patchFlag = -2, o;
  }
  if (Xs(e) && (e = e.__vccOpts), t) {
    t = Vs(t);
    let { class: o, style: h } = t;
    o && !ee(o) && (t.class = Ot(o)), q(h) && (/* @__PURE__ */ oi(h) && !N(h) && (h = se({}, h)), t.style = ei(h));
  }
  const a = ee(e) ? 1 : zr(e) ? 128 : Mn(e) ? 64 : q(e) ? 4 : $(e) ? 2 : 0;
  return D(
    e,
    t,
    n,
    i,
    r,
    a,
    l,
    !0
  );
}
function Vs(e) {
  return e ? /* @__PURE__ */ oi(e) || Ur(e) ? se({}, e) : e : null;
}
function At(e, t, n = !1, i = !1) {
  const { props: r, ref: l, patchFlag: a, children: o, transition: h } = e, c = t ? Bs(r || {}, t) : r, f = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: c,
    key: c && el(c),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && l ? N(l) ? l.concat(sn(t)) : [l, sn(t)] : sn(t)
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
    patchFlag: t && e.type !== he ? a === -1 ? 16 : a | 16 : a,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: h,
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
  return h && i && hi(
    f,
    h.clone(f)
  ), f;
}
function Ce(e = " ", t = 0) {
  return ie(An, null, e, t);
}
function Mt(e = "", t = !1) {
  return t ? (K(), ln(Ye, null, e)) : ie(Ye, null, e);
}
function Ne(e) {
  return e == null || typeof e == "boolean" ? ie(Ye) : N(e) ? ie(
    he,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : Qr(e) ? qe(e) : ie(An, null, String(e));
}
function qe(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : At(e);
}
function dn(e, t) {
  let n = 0;
  const { shapeFlag: i } = e;
  if (t == null)
    t = null;
  else if (N(t))
    n = 16;
  else if (typeof t == "object")
    if (i & 65) {
      const r = t.default;
      r && (r._c && (r._d = !1), dn(e, r()), r._c && (r._d = !0));
      return;
    } else {
      n = 32;
      const r = t._;
      !r && !Ur(t) ? t._ctx = He : r === 3 && He && (He.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if ($(t)) {
    if (i & 65) {
      dn(e, { default: t });
      return;
    }
    t = { default: t, _ctx: He }, n = 32;
  } else
    t = String(t), i & 64 ? (n = 16, t = [Ce(t)]) : n = 8;
  e.children = t, e.shapeFlag |= n;
}
function Bs(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const i = e[n];
    for (const r in i)
      if (r === "class")
        t.class !== i.class && (t.class = Ot([t.class, i.class]));
      else if (r === "style")
        t.style = ei([t.style, i.style]);
      else if (gn(r)) {
        const l = t[r], a = i[r];
        a && l !== a && !(N(l) && l.includes(a)) ? t[r] = l ? [].concat(l, a) : a : a == null && l == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !mn(r) && (t[r] = a);
      } else r !== "" && (t[r] = i[r]);
  }
  return t;
}
function Fe(e, t, n, i = null) {
  Oe(e, t, 7, [
    n,
    i
  ]);
}
const Ks = Nr();
let Ws = 0;
function qs(e, t, n) {
  const i = e.type, r = (t ? t.appContext : e.appContext) || Ks, l = {
    uid: Ws++,
    vnode: e,
    type: i,
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
    scope: new _l(
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
    propsOptions: Br(i, r),
    emitsOptions: $r(i, r),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: z,
    // inheritAttrs
    inheritAttrs: i.inheritAttrs,
    // state
    ctx: z,
    data: z,
    props: z,
    attrs: z,
    slots: z,
    refs: z,
    setupState: z,
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
  return l.ctx = { _: l }, l.root = t ? t.root : l, l.emit = Ss.bind(null, l), e.ce && e.ce(l), l;
}
let ge = null;
const Js = () => ge || He;
let pn, Wt;
{
  const e = _n(), t = (n, i) => {
    let r;
    return (r = e[n]) || (r = e[n] = []), r.push(i), (l) => {
      r.length > 1 ? r.forEach((a) => a(l)) : r[0](l);
    };
  };
  pn = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => ge = n
  ), Wt = t(
    "__VUE_SSR_SETTERS__",
    (n) => qt = n
  );
}
const Zt = (e) => {
  const t = ge;
  return pn(e), e.scope.on(), () => {
    e.scope.off(), pn(t);
  };
}, Hi = () => {
  ge && ge.scope.off(), pn(null);
};
function tl(e) {
  return e.vnode.shapeFlag & 4;
}
let qt = !1;
function Gs(e, t = !1, n = !1) {
  t && Wt(t);
  const { props: i, children: r } = e.vnode, l = tl(e);
  Is(e, i, l, t), ks(e, r, n || t);
  const a = l ? Zs(e, t) : void 0;
  return t && Wt(!1), a;
}
function Zs(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, ps);
  const { setup: i } = n;
  if (i) {
    Ze();
    const r = e.setupContext = i.length > 1 ? Ys(e) : null, l = Zt(e), a = Gt(
      i,
      e,
      0,
      [
        e.props,
        r
      ]
    ), o = Xi(a);
    if (ze(), l(), (o || e.sp) && !Lt(e) && Pr(e), o) {
      if (a.then(Hi, Hi), t)
        return a.then((h) => {
          Wt(!0);
          try {
            Li(e, h, t);
          } finally {
            Wt(!1);
          }
        }).catch((h) => {
          xn(h, e, 0);
        });
      e.asyncDep = a;
    } else
      Li(e, a);
  } else
    nl(e);
}
function Li(e, t, n) {
  $(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : q(t) && (e.setupState = xr(t)), nl(e);
}
function nl(e, t, n) {
  const i = e.type;
  e.render || (e.render = i.render || Le);
  {
    const r = Zt(e);
    Ze();
    try {
      gs(e);
    } finally {
      ze(), r();
    }
  }
}
const zs = {
  get(e, t) {
    return ue(e, "get", ""), e[t];
  }
};
function Ys(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, zs),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function gi(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(xr(Ll(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in jt)
        return jt[n](e);
    },
    has(t, n) {
      return n in t || n in jt;
    }
  })) : e.proxy;
}
function Xs(e) {
  return $(e) && "__vccOpts" in e;
}
const xe = (e, t) => /* @__PURE__ */ Kl(e, t, qt), Qs = "3.5.43";
let zn;
const ji = typeof window < "u" && window.trustedTypes;
if (ji)
  try {
    zn = /* @__PURE__ */ ji.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const il = zn ? (e) => zn.createHTML(e) : (e) => e, ea = "http://www.w3.org/2000/svg", ta = "http://www.w3.org/1998/Math/MathML", We = typeof document < "u" ? document : null, Ui = We && /* @__PURE__ */ We.createElement("template"), na = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, i) => {
    const r = t === "svg" ? We.createElementNS(ea, e) : t === "mathml" ? We.createElementNS(ta, e) : n ? We.createElement(e, { is: n }) : We.createElement(e);
    return e === "select" && i && i.multiple != null && r.setAttribute("multiple", i.multiple), r;
  },
  createText: (e) => We.createTextNode(e),
  createComment: (e) => We.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => We.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, i, r, l) {
    const a = n ? n.previousSibling : t.lastChild;
    if (r && (r === l || r.nextSibling))
      for (; t.insertBefore(r.cloneNode(!0), n), !(r === l || !(r = r.nextSibling)); )
        ;
    else {
      Ui.innerHTML = il(
        i === "svg" ? `<svg>${e}</svg>` : i === "mathml" ? `<math>${e}</math>` : e
      );
      const o = Ui.content;
      if (i === "svg" || i === "mathml") {
        const h = o.firstChild;
        for (; h.firstChild; )
          o.appendChild(h.firstChild);
        o.removeChild(h);
      }
      t.insertBefore(o, n);
    }
    return [
      // first
      a ? a.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, ia = /* @__PURE__ */ Symbol("_vtc");
function ra(e, t, n) {
  const i = e[ia];
  i && (t = (t ? [t, ...i] : [...i]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const Vi = /* @__PURE__ */ Symbol("_vod"), la = /* @__PURE__ */ Symbol("_vsh"), sa = /* @__PURE__ */ Symbol(""), aa = /(?:^|;)\s*display\s*:/;
function oa(e, t, n) {
  const i = e.style, r = ee(n);
  let l = !1;
  if (n && !r) {
    if (t)
      if (ee(t))
        for (const a of t.split(";")) {
          const o = a.slice(0, a.indexOf(":")).trim();
          n[o] == null && kt(i, o, "");
        }
      else
        for (const a in t)
          n[a] == null && kt(i, a, "");
    for (const a in n) {
      a === "display" && (l = !0);
      const o = n[a];
      o != null ? ha(
        e,
        a,
        !ee(t) && t ? t[a] : void 0,
        o
      ) || kt(i, a, o) : kt(i, a, "");
    }
  } else if (r) {
    if (t !== n) {
      const a = i[sa];
      a && (n += ";" + a), i.cssText = n, l = aa.test(n);
    }
  } else t && e.removeAttribute("style");
  Vi in e && (e[Vi] = l ? i.display : "", e[la] && (i.display = "none"));
}
const tn = /\s*!important$/;
function kt(e, t, n) {
  if (N(n))
    n.forEach((i) => kt(e, t, i));
  else if (n == null && (n = ""), t.startsWith("--"))
    tn.test(n) ? e.setProperty(t, n.replace(tn, ""), "important") : e.setProperty(t, n);
  else {
    const i = ua(e, t);
    tn.test(n) ? e.setProperty(
      vt(i),
      n.replace(tn, ""),
      "important"
    ) : e[i] = n;
  }
}
const Bi = ["Webkit", "Moz", "ms"], Hn = {};
function ua(e, t) {
  const n = Hn[t];
  if (n)
    return n;
  let i = Te(t);
  if (i !== "filter" && i in e)
    return Hn[t] = i;
  i = tr(i);
  for (let r = 0; r < Bi.length; r++) {
    const l = Bi[r] + i;
    if (l in e)
      return Hn[t] = l;
  }
  return t;
}
function ha(e, t, n, i) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && ee(i) && n === i;
}
const Ki = "http://www.w3.org/1999/xlink";
function Wi(e, t, n, i, r, l = gl(t)) {
  i && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Ki, t.slice(6, t.length)) : e.setAttributeNS(Ki, t, n) : n == null || l && !ir(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    l ? "" : je(n) ? String(n) : n
  );
}
function qi(e, t, n, i, r) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? il(n) : n);
    return;
  }
  const l = e.tagName;
  if (t === "value" && l !== "PROGRESS" && // custom elements may use _value internally
  !l.includes("-")) {
    const o = l === "OPTION" ? e.getAttribute("value") || "" : e.value, h = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (o !== h || !("_value" in e)) && (e.value = h), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let a = !1;
  if (n === "" || n == null) {
    const o = typeof e[t];
    o === "boolean" ? n = ir(n) : n == null && o === "string" ? (n = "", a = !0) : o === "number" && (n = 0, a = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  a && e.removeAttribute(r || t);
}
function ca(e, t, n, i) {
  e.addEventListener(t, n, i);
}
function fa(e, t, n, i) {
  e.removeEventListener(t, n, i);
}
const Ji = /* @__PURE__ */ Symbol("_vei");
function wa(e, t, n, i, r = null) {
  const l = e[Ji] || (e[Ji] = {}), a = l[t];
  if (i && a)
    a.value = i;
  else {
    const [o, h] = ga(t);
    if (i) {
      const c = l[t] = _a(
        i,
        r
      );
      ca(e, o, c, h);
    } else a && (fa(e, o, a, h), l[t] = void 0);
  }
}
const da = /(Once|Passive|Capture)$/, pa = /^on:?(?:Once|Passive|Capture)$/;
function ga(e) {
  let t, n;
  for (; (n = e.match(da)) && !pa.test(e); )
    t || (t = {}), e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : vt(e.slice(2)), t];
}
let Ln = 0;
const ma = /* @__PURE__ */ Promise.resolve(), va = () => Ln || (ma.then(() => Ln = 0), Ln = Date.now());
function _a(e, t) {
  const n = (i) => {
    if (!i._vts)
      i._vts = Date.now();
    else if (i._vts <= n.attached)
      return;
    const r = n.value;
    if (N(r)) {
      const l = i.stopImmediatePropagation;
      i.stopImmediatePropagation = () => {
        l.call(i), i._stopped = !0;
      };
      const a = r.slice(), o = [i];
      for (let h = 0; h < a.length && !i._stopped; h++) {
        const c = a[h];
        c && Oe(
          c,
          t,
          5,
          o
        );
      }
    } else
      Oe(
        r,
        t,
        5,
        [i]
      );
  };
  return n.value = e, n.attached = va(), n;
}
const Gi = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, ya = (e, t, n, i, r, l) => {
  const a = r === "svg";
  t === "class" ? ra(e, i, a) : t === "style" ? oa(e, n, i) : gn(t) ? mn(t) || wa(e, t, n, i, l) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : ba(e, t, i, a)) ? (qi(e, t, i), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Wi(e, t, i, a, l, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (xa(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !ee(i))) ? qi(e, Te(t), i, l, t) : (t === "true-value" ? e._trueValue = i : t === "false-value" && (e._falseValue = i), Wi(e, t, i, a));
};
function ba(e, t, n, i) {
  if (i)
    return !!(t === "innerHTML" || t === "textContent" || t in e && Gi(t) && $(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const r = e.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE")
      return !1;
  }
  return Gi(t) && ee(n) ? !1 : t in e;
}
function xa(e, t) {
  const n = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!n)
    return !1;
  const i = Te(t);
  return Array.isArray(n) ? n.some((r) => Te(r) === i) : Object.keys(n).some((r) => Te(r) === i);
}
const Ma = /* @__PURE__ */ se({ patchProp: ya }, na);
let Zi;
function Sa() {
  return Zi || (Zi = Ns(Ma));
}
const Ca = ((...e) => {
  const t = Sa().createApp(...e), { mount: n } = t;
  return t.mount = (i) => {
    const r = Aa(i);
    if (!r) return;
    const l = t._component;
    !$(l) && !l.render && !l.template && (l.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
    const a = n(r, !1, Ta(r));
    return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
  }, t;
});
function Ta(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function Aa(e) {
  return ee(e) ? document.querySelector(e) : e;
}
const Oa = {
  class: "gl-icon",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.75",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true",
  focusable: "false"
}, Ea = ["cx", "cy"], Ia = ["d"], Pa = /* @__PURE__ */ Sn({
  __name: "UiIcon",
  props: {
    name: {},
    value: {}
  },
  setup(e) {
    const t = { menu: "M4 6h16M4 12h16M4 18h16", close: "m6 6 12 12M6 18 18 6", invite: "M15 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0M4 21v-2a6 6 0 0 1 9-5.2M18 14v8M14 18h8", copy: "M9 9h11v12H9zM5 15H3V3h12v2", exit: "M10 4H4v16h6M10 12h11m-4-4 4 4-4 4", download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5", help: "M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4M12 17h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0", refresh: "M20 7v5h-5M4 17v-5h5M5 8a8 8 0 0 1 13-3l2 3M4 16l2 3a8 8 0 0 0 13-3", pan: "M12 3v18M3 12h18m-12-6 3-3 3 3m-6 12 3 3 3-3M6 9l-3 3 3 3m12-6 3 3-3 3", pen: "m4 16-1 5 5-1L20 8a3 3 0 0 0-4-4ZM14 6l4 4", pencil: "m4 15-1 6 6-1L21 8l-5-5ZM13 6l5 5M4 15l5 5", marker: "m5 14 9-11 7 6-9 11ZM5 14l7 6-8 1-2-2ZM12 6l7 6", highlighter: "m7 13 7-10 7 5-7 10ZM7 13l7 5-3 3H4v-4ZM3 22h18", spray: "M5 10h9v11H5zM7 10V6h5v4M8 6V3h3M16 4h.01M20 2h.01M20 6h.01M18 9h.01", neon: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z", crayon: "m4 15 10-10 5 5L9 20H4ZM14 5l4-3 4 4-3 4M7 12l5 5", eraser: "m4 16 9-11a2 2 0 0 1 3 0l5 5a2 2 0 0 1 0 3l-8 8H8l-4-4a1 1 0 0 1 0-1ZM9 10l8 8M13 21h8", undo: "M3 4v6h6M3 10c3-7 17-6 17 3 0 5-5 7-10 6", redo: "M21 4v6h-6M21 10C18 3 4 4 4 13c0 5 5 7 10 6", plus: "M12 5v14M5 12h14", minus: "M5 12h14", target: "M12 2v4M12 18v4M2 12h4M18 12h4M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0M12 12h.01", check: "m5 12 4 4L19 6", play: "m8 4 12 8-12 8Z", trash: "M3 6h18M8 6V3h8v3M5 6l1 15h12l1-15M10 10v7M14 10v7", volume: "m3 9 5 0 5-5v16l-5-5H3ZM16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14", muted: "m3 9 5 0 5-5v16l-5-5H3ZM17 9l5 6M17 15l5-6", plane: "m22 2-7 20-4-9-9-4ZM11 13l6-6" }, n = { 1: [[12, 12]], 2: [[7, 7], [17, 17]], 3: [[7, 7], [12, 12], [17, 17]], 4: [[7, 7], [17, 7], [7, 17], [17, 17]], 5: [[7, 7], [17, 7], [12, 12], [7, 17], [17, 17]], 6: [[7, 6], [17, 6], [7, 12], [17, 12], [7, 18], [17, 18]] };
    return (i, r) => (K(), X("svg", Oa, [
      e.name === "dice" ? (K(), X(he, { key: 0 }, [
        r[0] || (r[0] = D("rect", {
          x: "2",
          y: "2",
          width: "20",
          height: "20",
          rx: "4"
        }, null, -1)),
        (K(!0), X(he, null, Wn(n[e.value || 5], (l, a) => (K(), X("circle", {
          key: a,
          cx: l[0],
          cy: l[1],
          r: "1.3",
          fill: "currentColor",
          stroke: "none"
        }, null, 8, Ea))), 128))
      ], 64)) : (K(), X("path", {
        key: 1,
        d: t[e.name] || t.help
      }, null, 8, Ia))
    ]));
  }
}), rl = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [i, r] of t)
    n[i] = r;
  return n;
}, Je = /* @__PURE__ */ rl(Pa, [["__scopeId", "data-v-8fcd069f"]]), Ra = ["disabled", "title"], Fa = {
  method: "dialog",
  class: "room-invite-panel"
}, ka = {
  class: "gl-action room-invite-close",
  "aria-label": "关闭"
}, Da = ["value"], Na = /* @__PURE__ */ Sn({
  __name: "RoomInviteButton",
  props: {
    gameId: {},
    roomCode: {},
    memberCount: {},
    maxMembers: {},
    variant: { default: "battle" }
  },
  setup(e) {
    const t = e, n = /* @__PURE__ */ ne(), i = /* @__PURE__ */ ne(!1), r = xe(() => {
      if (!t.roomCode) return "";
      const h = new URL("/", window.location.href);
      return h.hash = `/invite?${new URLSearchParams({ gameid: t.gameId, room: t.roomCode }).toString()}`, h.href;
    }), l = xe(() => t.memberCount >= t.maxMembers);
    async function a() {
      if (!(!r.value || l.value)) {
        i.value = !1, n.value?.showModal();
        try {
          await navigator.clipboard.writeText(r.value), i.value = !0;
        } catch {
          i.value = !1;
        }
      }
    }
    async function o() {
      try {
        await navigator.clipboard.writeText(r.value), i.value = !0;
      } catch {
        i.value = !1;
      }
    }
    return (h, c) => (K(), X(he, null, [
      D("button", {
        class: Ot(["gl-action room-invite-trigger", `invite-${e.variant}`]),
        type: "button",
        disabled: !e.roomCode || l.value,
        title: l.value ? "房间已满，无法邀请" : "生成并复制房间邀请链接",
        onClick: a
      }, [
        ie(Je, { name: "invite" }),
        c[1] || (c[1] = Ce("邀请", -1))
      ], 10, Ra),
      D("dialog", {
        ref_key: "dialog",
        ref: n,
        class: "room-invite-dialog",
        "aria-labelledby": "room-invite-title"
      }, [
        D("form", Fa, [
          D("button", ka, [
            ie(Je, { name: "close" })
          ]),
          c[2] || (c[2] = D("small", null, "GAMELINK / ROOM INVITE", -1)),
          c[3] || (c[3] = D("h2", { id: "room-invite-title" }, "邀请好友加入", -1)),
          c[4] || (c[4] = D("p", null, "分享链接，好友打开后会自动加入房间。", -1)),
          D("input", {
            value: r.value,
            readonly: "",
            "aria-label": "房间邀请链接",
            onFocus: c[0] || (c[0] = (f) => f.target.select())
          }, null, 40, Da),
          D("button", {
            type: "button",
            class: "gl-action room-invite-copy",
            onClick: o
          }, [
            ie(Je, {
              name: i.value ? "check" : "copy"
            }, null, 8, ["name"]),
            Ce(Q(i.value ? "已复制邀请链接" : "复制邀请链接"), 1)
          ])
        ])
      ], 512)
    ], 64));
  }
}), $a = /* @__PURE__ */ rl(Na, [["__scopeId", "data-v-5bb541c6"]]), Ha = ["aria-label"], zi = /* @__PURE__ */ Sn({
  __name: "InkPad",
  props: {
    locked: { type: Boolean },
    strokes: {},
    readonly: { type: Boolean }
  },
  emits: ["change"],
  setup(e, { expose: t, emit: n }) {
    const i = e, r = n, l = /* @__PURE__ */ ne();
    let a = [], o = null, h;
    function c() {
      const I = l.value;
      if (!I) return;
      const P = I.getBoundingClientRect(), F = Math.min(devicePixelRatio, 2);
      I.width = Math.max(1, P.width * F), I.height = Math.max(1, P.height * F);
      const O = I.getContext("2d");
      O.scale(F, F), O.strokeStyle = "#213d50", O.lineWidth = i.readonly ? 2 : 3, O.lineCap = "round", O.lineJoin = "round";
      for (const T of a)
        O.beginPath(), T.forEach(([U, ae], oe) => {
          oe ? O.lineTo(U * P.width, ae * P.height) : (O.moveTo(U * P.width, ae * P.height), O.lineTo(U * P.width + 0.1, ae * P.height + 0.1));
        }), O.stroke();
    }
    function f(I) {
      const P = l.value.getBoundingClientRect();
      return [Math.max(0, Math.min(1, (I.clientX - P.left) / P.width)), Math.max(0, Math.min(1, (I.clientY - P.top) / P.height))];
    }
    function d(I) {
      i.locked || i.readonly || o !== null || a.length >= 80 || (I.preventDefault(), o = I.pointerId, l.value.setPointerCapture(o), a.push([f(I)]), c());
    }
    function M(I) {
      if (o !== I.pointerId || i.locked) return;
      const P = a[a.length - 1];
      P.length < 1500 && P.push(f(I)), c();
    }
    function S(I) {
      o === I.pointerId && (o = null, r("change", a.map((P) => [...P])));
    }
    function H() {
      i.locked || i.readonly || (a = [], c(), r("change", []));
    }
    function R() {
      i.locked || i.readonly || (a.pop(), c(), r("change", a.map((I) => [...I])));
    }
    return rn(() => i.strokes, (I) => {
      a = (I || []).map((P) => [...P]), c();
    }, { deep: !0 }), fi(() => {
      a = (i.strokes || []).map((I) => [...I]), h = new ResizeObserver(c), h.observe(l.value), c();
    }), wi(() => h?.disconnect()), t({ clear: H, undo: R }), (I, P) => (K(), X("canvas", {
      ref_key: "canvas",
      ref: l,
      class: Ot(["poem-ink", { "ink-readonly": e.readonly }]),
      "aria-label": e.readonly ? "手写答案" : "手写答题区",
      onPointerdown: d,
      onPointermove: M,
      onPointerup: S,
      onPointercancel: S,
      onLostpointercapture: S
    }, null, 42, Ha));
  }
}), La = /* @__PURE__ */ JSON.parse('[{"line":"床前□□光，疑是地上霜。","answer":"明月","title":"静夜思","author":"李白"},{"line":"白日依山尽，□□入海流。","answer":"黄河","title":"登鹳雀楼","author":"王之涣"},{"line":"春眠不觉晓，处处闻□鸟。","answer":"啼","title":"春晓","author":"孟浩然"},{"line":"举头望明月，低头思□□。","answer":"故乡","title":"静夜思","author":"李白"},{"line":"欲穷千里目，更上一□□。","answer":"层楼","title":"登鹳雀楼","author":"王之涣"},{"line":"谁知盘中餐，粒粒皆□□。","answer":"辛苦","title":"悯农·其二","author":"李绅"},{"line":"两岸猿声啼不住，轻舟已过□□山。","answer":"万重","title":"早发白帝城","author":"李白"},{"line":"飞流直下三千尺，疑是□□落九天。","answer":"银河","title":"望庐山瀑布","author":"李白"},{"line":"桃花潭水深千尺，不及□□送我情。","answer":"汪伦","title":"赠汪伦","author":"李白"},{"line":"孤帆远影碧空尽，唯见□□天际流。","answer":"长江","title":"黄鹤楼送孟浩然之广陵","author":"李白"},{"line":"不识□□真面目，只缘身在此山中。","answer":"庐山","title":"题西林壁","author":"苏轼"},{"line":"接天莲叶无穷碧，映日□□别样红。","answer":"荷花","title":"晓出净慈寺送林子方","author":"杨万里"},{"line":"小荷才露尖尖角，早有□□立上头。","answer":"蜻蜓","title":"小池","author":"杨万里"},{"line":"停车坐爱枫林晚，霜叶红于□□花。","answer":"二月","title":"山行","author":"杜牧"},{"line":"千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓□□雪。","answer":"寒江","title":"江雪","author":"柳宗元"},{"line":"遥知不是雪，为有□□来。","answer":"暗香","title":"梅花","author":"王安石"},{"line":"爆竹声中一岁除，春风送暖入□□。","answer":"屠苏","title":"元日","author":"王安石"},{"line":"海内存知己，□□若比邻。","answer":"天涯","title":"送杜少府之任蜀州","author":"王勃"},{"line":"但愿人长久，千里共□□。","answer":"婵娟","title":"水调歌头","author":"苏轼"},{"line":"山重水复疑无路，柳暗花明又一□。","answer":"村","title":"游山西村","author":"陆游"},{"line":"西陆蝉声□，南冠客思侵。","answer":"唱","title":"在岳咏蝉","author":"骆宾王"},{"line":"前不□□人，后不见来者。","answer":"见古","title":"登幽州台歌","author":"陈子昂"},{"line":"地犹鄹氏邑，宅即□□宫。","answer":"鲁王","title":"经邹鲁祭孔子而叹之","author":"明皇帝"},{"line":"黄河之水天上来，□□到海不复回。","answer":"奔流","title":"鼓吹曲辞 将进酒","author":"李白"},{"line":"秦时明月汉时关，□□长征人未还。","answer":"万里","title":"横吹曲辞 出塞 一","author":"王昌龄"},{"line":"黄砂直上白云间，一片□□万仞山。","answer":"孤城","title":"横吹曲辞 出塞","author":"王之涣"},{"line":"明月□天山，苍茫云海间。","answer":"出","title":"横吹曲辞 关山月","author":"李白"},{"line":"三日入厨下，洗手□□汤。","answer":"作羹","title":"新嫁娘词三首 三","author":"王建"},{"line":"寥落古行宫，□□寂寞红。","answer":"宫花","title":"故行宫","author":"王建"},{"line":"锦瑟无端五十弦，一弦□□思华年。","answer":"一柱","title":"锦瑟","author":"李商隐"},{"line":"本以□难饱，徒劳恨费声。","answer":"高","title":"蝉","author":"李商隐"},{"line":"向晚意不适，□□登古原。","answer":"驱车","title":"乐游原","author":"李商隐"},{"line":"君问归期未有期，巴山夜雨涨□□。","answer":"秋池","title":"夜雨寄北","author":"李商隐"},{"line":"元和天子神武姿，彼何人哉轩□□。","answer":"与羲","title":"韩碑","author":"李商隐"},{"line":"凄凉宝□□，羁泊欲穷年。","answer":"剑篇","title":"风雨","author":"李商隐"},{"line":"□□秦树久离居，双鲤迢迢一纸书。","answer":"嵩云","title":"寄令狐郎中","author":"李商隐"},{"line":"紫泉宫殿锁烟霞，欲取芜城作□□。","answer":"帝家","title":"隋宫","author":"李商隐"},{"line":"猿鸟犹疑畏简书，□□常为护储胥。","answer":"风云","title":"筹笔驿","author":"李商隐"},{"line":"昨夜星辰昨夜风，□□西畔桂堂东。","answer":"画楼","title":"无题二首 一","author":"李商隐"},{"line":"来是空言去□□，月斜楼上五更钟。","answer":"绝踪","title":"无题四首 一","author":"李商隐"},{"line":"飒飒东风细雨□，芙蓉塘外有轻雷。","answer":"来","title":"无题四首 二","author":"李商隐"},{"line":"□兴南游不戒严，九重谁省谏书函。","answer":"乘","title":"隋宫","author":"李商隐"},{"line":"高阁客竟去，□□花乱飞。","answer":"小园","title":"落花","author":"李商隐"},{"line":"□有云屏无限娇，凤城寒尽怕春宵。","answer":"为","title":"为有","author":"李商隐"},{"line":"相见□难别亦难，东风无力百花残。","answer":"时","title":"无题","author":"李商隐"},{"line":"瑶池□□绮窗开，黄竹歌声动地哀。","answer":"阿母","title":"瑶池","author":"李商隐"},{"line":"怅卧新春白袷□，白门寥落意多违。","answer":"衣","title":"春雨","author":"李商隐"},{"line":"云母屏风烛影深，长河□□晓星沈。","answer":"渐落","title":"常娥","author":"李商隐"},{"line":"凤尾香罗薄□□，碧文圆顶夜深缝。","answer":"几重","title":"无题二首 一","author":"李商隐"},{"line":"□帷深下莫愁堂，卧后清宵细细长。","answer":"重","title":"无题二首 二","author":"李商隐"},{"line":"宣室求贤访逐□，贾生才调更无伦。","answer":"臣","title":"贾生","author":"李商隐"},{"line":"□去波平槛，蝉休露满枝。","answer":"客","title":"凉思","author":"李商隐"},{"line":"残阳西入崦，□□访孤僧。","answer":"茅屋","title":"北青萝","author":"李商隐"},{"line":"折戟沈沙铁未销，自将磨洗认□□。","answer":"前朝","title":"赤壁","author":"李商隐"},{"line":"清瑟怨遥□，遶弦风雨哀。","answer":"夜","title":"章台夜思","author":"韦庄"},{"line":"谁谓伤心画不成，□□心逐世人情。","answer":"画人","title":"金陵图","author":"韦庄"},{"line":"江雨霏霏江□□，六朝如梦鸟空啼。","answer":"草齐","title":"台城","author":"韦庄"},{"line":"十二楼中尽晓□，望仙楼上望君王。","answer":"妆","title":"宫词","author":"薛逢"},{"line":"□气寒光集，微阳下楚丘。","answer":"露","title":"楚江怀古三首 一","author":"马戴"},{"line":"□□风雨定，晚见鴈行频。","answer":"灞原","title":"灞上秋居","author":"马戴"},{"line":"□□圣明天子事，景阳宫井又何人。","answer":"终是","title":"马嵬坡","author":"郑畋"},{"line":"前年伐□□，城上没全师。","answer":"月支","title":"没蕃故人","author":"张籍"},{"line":"□□黄莺儿，莫教枝上啼。","answer":"打起","title":"春怨","author":"金昌绪"},{"line":"□□最小偏怜女，嫁与黔娄百事乖。","answer":"谢公","title":"遣悲怀三首 一","author":"元稹"},{"line":"昔日戏言身后意，今朝□□眼前来。","answer":"皆到","title":"遣悲怀三首 二","author":"元稹"},{"line":"闲坐悲君亦自悲，百年都是几□□。","answer":"多时","title":"遣悲怀三首 三","author":"元稹"},{"line":"北斗七星高，□□夜带刀。","answer":"哥舒","title":"哥舒歌","author":"西鄙人"},{"line":"近寒食雨草萋萋，著麦苗风柳□□。","answer":"映堤","title":"杂诗 十三","author":"无名氏"},{"line":"闻道黄龙戍，频年□□兵。","answer":"不解","title":"杂诗三首 三","author":"沈佺期"},{"line":"卢家少妇郁□□，海燕双栖玳瑁梁。","answer":"金堂","title":"古意呈补阙乔知之","author":"沈佺期"},{"line":"客路青山外，行舟绿□□。","answer":"水前","title":"次北固山下","author":"王湾"},{"line":"隐隐飞桥隔野□，石矶西畔问渔船。","answer":"烟","title":"桃花谿","author":"张旭"},{"line":"下马□□酒，问君何所之。","answer":"饮君","title":"送别","author":"王维"},{"line":"圣代无隐者，英灵□□归。","answer":"尽来","title":"送綦毋潜落第还乡","author":"王维"},{"line":"言入黄花川，□□青谿水。","answer":"每逐","title":"青谿","author":"王维"},{"line":"斜阳照墟落，穷巷□□归。","answer":"牛羊","title":"渭川田家","author":"王维"},{"line":"艳色天下重，西施□□微。","answer":"宁久","title":"西施咏","author":"王维"},{"line":"少年□□二十时，步行夺得胡马射。","answer":"十五","title":"老将行","author":"王维"},{"line":"渔舟逐水爱山春，两岸桃花夹□□。","answer":"去津","title":"桃源行","author":"王维"},{"line":"□阳女儿对门居，才可容颜十五余。","answer":"洛","title":"洛阳女儿行","author":"王维"},{"line":"寒山转苍翠，秋水□□湲。","answer":"日潺","title":"辋川闲居赠裴秀才迪","author":"王维"},{"line":"晚年□□静，万事不关心。","answer":"唯好","title":"酬张少府","author":"王维"},{"line":"万壑树参天，千山响□□。","answer":"杜鹃","title":"送梓州李使君","author":"王维"},{"line":"昨夜裙带解，□□蟢子飞。","answer":"今朝","title":"玉台体十二首 十一","author":"权德舆"},{"line":"□石荦确行径微，黄昏到寺蝙蝠飞。","answer":"山","title":"山石","author":"韩愈"},{"line":"纤云四卷天无河，□□吹空月舒波。","answer":"清风","title":"八月十五夜赠张功曹","author":"韩愈"},{"line":"□□祭秩皆三公，四方环镇嵩当中。","answer":"五岳","title":"谒衡岳庙遂宿岳寺题门楼","author":"韩愈"},{"line":"碧阑干外绣帘垂，□□屏风画折枝。","answer":"猩血","title":"已凉","author":"韩偓"},{"line":"早被婵娟□，欲妆临镜慵。","answer":"误","title":"春宫怨","author":"杜荀鹤"},{"line":"洞房昨夜停红烛，□□堂前拜舅姑。","answer":"待晓","title":"近试上张籍水部","author":"朱庆余"},{"line":"清时有味是无能，闲爱□□静爱僧。","answer":"孤云","title":"将赴吴兴登乐游原一绝","author":"杜牧"},{"line":"东风不与周郎便，□□春深鏁二乔。","answer":"铜雀","title":"赤壁","author":"杜牧"},{"line":"烟笼□水月笼沙，夜泊秦淮近酒家。","answer":"寒","title":"泊秦淮","author":"杜牧"},{"line":"□□褭褭十三余，豆蔻梢头二月初。","answer":"娉娉","title":"赠别二首 一","author":"杜牧"},{"line":"多情却似总无情，□□尊前笑不成。","answer":"唯觉","title":"赠别二首 二","author":"杜牧"},{"line":"落魄江南载酒行，楚腰肠断掌□□。","answer":"中轻","title":"遣怀","author":"杜牧"},{"line":"红烛秋光冷□□，轻罗小扇扑流萤。","answer":"画屏","title":"秋夕","author":"杜牧"},{"line":"繁华事散逐□□，流水无情草自春。","answer":"香尘","title":"金谷园","author":"杜牧"},{"line":"□馆无良伴，凝情自悄然。","answer":"旅","title":"旅宿","author":"杜牧"},{"line":"遥夜泛清瑟，西风□□萝。","answer":"生翠","title":"早秋三首 一","author":"许浑"},{"line":"红叶晚□□，长亭酒一瓢。","answer":"萧萧","title":"秋日赴阙题潼关驿楼","author":"许浑"},{"line":"□□依依到谢家，小廊回合曲阑斜。","answer":"别梦","title":"寄人 一","author":"张泌"},{"line":"誓扫□□不顾身，五千貂锦丧胡尘。","answer":"匈奴","title":"陇西行四首 二","author":"陈陶"},{"line":"几回惊妾□，不得到辽西。","answer":"梦","title":"颂古三十二首  其二三","author":"释明辩"},{"line":"□湿罗巾梦不成，夜深前殿按歌声。","answer":"泪","title":"后宫词","author":"白居易"},{"line":"十年离乱后，长大□□逢。","answer":"一相","title":"喜见外弟又言别","author":"李益"},{"line":"嫁得□□贾，朝朝悮妾期。","answer":"瞿塘","title":"江南词","author":"李益"},{"line":"□□峰前沙似雪，受降城下月如霜。","answer":"回乐","title":"夜上受降城闻笛","author":"李益"},{"line":"鸣筝□粟柱，素手玉房前。","answer":"金","title":"听筝","author":"李端"},{"line":"世乱同南□，时清独北还。","answer":"去","title":"贼平后送人北归","author":"司空曙"},{"line":"故人江海别，几度□□川。","answer":"隔山","title":"云阳馆与韩绅宿别","author":"司空曙"},{"line":"静夜四无邻，荒居□□贫。","answer":"旧业","title":"喜外弟卢纶见宿","author":"司空曙"},{"line":"泠泠七丝上，静听松□□。","answer":"风寒","title":"听弹琴","author":"刘长卿"},{"line":"□云将野鹤，岂向人间住。","answer":"孤","title":"送方外上人","author":"刘长卿"},{"line":"苍苍□□寺，杳杳钟声晚。","answer":"竹林","title":"送灵澈上人","author":"刘长卿"},{"line":"乡心新岁切，天畔□□然。","answer":"独潸","title":"新年作","author":"刘长卿"},{"line":"古台摇落后，秋日□□心。","answer":"望乡","title":"秋日登吴公台上寺远眺寺即陈将吴明彻战场","author":"刘长卿"},{"line":"一路经行处，莓苔□□痕。","answer":"见履","title":"寻南溪常山道人隐居","author":"刘长卿"},{"line":"望君□水阔，挥手泪沾巾。","answer":"烟","title":"饯别王十一南游","author":"刘长卿"},{"line":"□涯岂料承优诏，世事空知学醉歌。","answer":"生","title":"江州重别薛六柳八二员外","author":"刘长卿"},{"line":"三年□□此栖迟，万古惟留楚客悲。","answer":"谪宦","title":"长沙过贾谊宅","author":"刘长卿"},{"line":"汉口夕阳斜渡鸟，□□秋水远连天。","answer":"洞庭","title":"自夏口至鹦鹉洲夕望岳阳寄源中丞","author":"刘长卿"},{"line":"莺啼□语报新年，马邑龙堆路几千。","answer":"燕","title":"赋得","author":"刘长卿"},{"line":"汉文皇帝有高台，此日□□曙色开。","answer":"登临","title":"九日登望仙台呈刘明府容","author":"崔曙"},{"line":"葡萄美酒夜光杯，欲饮□□马上催。","answer":"琵琶","title":"凉州词二首 一","author":"王翰"},{"line":"□□白云里，隐者自怡悦。","answer":"北山","title":"秋登兰山寄张五","author":"孟浩然"},{"line":"山光忽西□，池月渐东上。","answer":"落","title":"夏日南亭怀辛大","author":"孟浩然"},{"line":"夕阳度西岭，群壑倏□□。","answer":"已暝","title":"宿业师山房期丁大不至","author":"孟浩然"},{"line":"山寺□□昼已昏，渔梁渡头争渡喧。","answer":"钟鸣","title":"夜归鹿门山歌","author":"孟浩然"},{"line":"□□湖水平，涵虚混太清。","answer":"八月","title":"望洞庭湖赠张丞相","author":"孟浩然"},{"line":"一丘常欲卧，□□苦无资。","answer":"三径","title":"秦中感秋寄远上人","author":"孟浩然"},{"line":"山暝闻猿愁，□□急夜流。","answer":"沧江","title":"宿桐庐江寄广陵旧游","author":"孟浩然"},{"line":"木落□南度，北风江上寒。","answer":"雁","title":"早寒江上有怀","author":"孟浩然"},{"line":"□寂竟何待，朝朝空自归。","answer":"寂","title":"留别王侍御维","author":"孟浩然"},{"line":"□□愁春尽，开轩览物华。","answer":"林卧","title":"清明日宴梅道士房","author":"孟浩然"},{"line":"人事有代谢，往来□□今。","answer":"成古","title":"与诸子登岘山","author":"孟浩然"},{"line":"故人具鸡黍，邀我□□家。","answer":"至田","title":"过故人庄","author":"孟浩然"},{"line":"北阙休上书，□□归敝庐。","answer":"南山","title":"岁暮归南山","author":"孟浩然"},{"line":"迢递三巴路，羁危万□□。","answer":"里身","title":"岁除夜有怀","author":"孟浩然"},{"line":"春眠不觉晓，□□闻啼鸟。","answer":"处处","title":"春晓","author":"孟浩然"},{"line":"移舟泊烟渚，日暮□□新。","answer":"客愁","title":"宿建德江","author":"孟浩然"},{"line":"蚕丛及□□，开国何茫然。","answer":"鱼凫","title":"蜀道难","author":"李白"},{"line":"人生□□须尽欢，莫使金樽空对月。","answer":"得意","title":"将进酒","author":"李白"},{"line":"天秋月□□，城阙夜千重。","answer":"又满","title":"客夜与故人偶集","author":"戴叔伦"},{"line":"鹫翎金仆姑，燕尾□□弧。","answer":"绣蝥","title":"和张仆射塞下曲 一","author":"卢纶"},{"line":"林暗草□□，将军夜引弓。","answer":"惊风","title":"和张仆射塞下曲 二","author":"卢纶"},{"line":"月黑鴈飞高，单于夜□□。","answer":"遁逃","title":"和张仆射塞下曲 三","author":"卢纶"},{"line":"野幕□□筵，羌戎贺劳旋。","answer":"敞琼","title":"和张仆射塞下曲 四","author":"卢纶"},{"line":"云开远见汉阳城，□□孤帆一日程。","answer":"犹是","title":"晚次鄂州","author":"卢纶"},{"line":"□关衰草遍，离别自堪悲。","answer":"故","title":"李端公","author":"卢纶"},{"line":"□知香积寺，数里入云峰。","answer":"不","title":"过香积寺","author":"王维"},{"line":"空山新雨后，天气□□秋。","answer":"晚来","title":"山居秋暝","author":"王维"},{"line":"中岁颇好道，晚家南□□。","answer":"山陲","title":"终南别业","author":"王维"},{"line":"清川带长薄，车马□□闲。","answer":"去闲","title":"归嵩山作","author":"王维"},{"line":"太乙近天都，连山接□□。","answer":"海隅","title":"终南山","author":"王维"},{"line":"楚塞□□接，荆门九派通。","answer":"三湘","title":"汉江临泛","author":"王维"},{"line":"渭水自萦秦塞曲，□□旧遶汉宫斜。","answer":"黄山","title":"奉和圣制从蓬莱向兴庆阁道中留春雨中春望之作应制","author":"王维"},{"line":"绛帻鸡人送晓□，尚衣方进翠云裘。","answer":"筹","title":"和贾舍人早朝大明宫之作","author":"王维"},{"line":"洞门高阁霭余辉，桃李□□柳絮飞。","answer":"阴阴","title":"酬郭给事","author":"王维"},{"line":"积雨空林烟□□，蒸藜炊黍饷东菑。","answer":"火迟","title":"积雨辋川庄作","author":"王维"},{"line":"□山不见人，但闻人语响。","answer":"空","title":"辋川集 鹿柴","author":"王维"},{"line":"独坐幽□□，弹琴复长啸。","answer":"篁里","title":"辋川集 竹里馆","author":"王维"},{"line":"山中相送罢，日暮□□扉。","answer":"掩柴","title":"送别","author":"王维"},{"line":"君自故乡来，□□故乡事。","answer":"应知","title":"杂诗三首 二","author":"王维"},{"line":"红豆□□国，秋来发故枝。","answer":"生南","title":"相思","author":"王维"},{"line":"独在异乡为异客，□□佳节倍思亲。","answer":"每逢","title":"九月九日忆山东兄弟","author":"王维"},{"line":"渭城□雨浥轻尘，客舍青青杨柳春。","answer":"朝","title":"渭城曲","author":"王维"},{"line":"归山深浅去，□□丘壑美。","answer":"须尽","title":"崔九欲往南山马上口号与别","author":"裴迪"},{"line":"扣关无僮仆，窥室唯□□。","answer":"案几","title":"寻西山隐者不遇","author":"丘为"},{"line":"昔人已乘白云去，□□空余黄鹤楼。","answer":"此地","title":"黄鹤楼","author":"崔颢"},{"line":"□□太华俯咸京，天外三峰削不成。","answer":"岧嶤","title":"行经华阴","author":"崔颢"},{"line":"停船□借问，或恐是同乡。","answer":"暂","title":"长干曲四首 一","author":"崔颢"},{"line":"家临九江水，来去□□侧。","answer":"九江","title":"长干曲四首 二","author":"崔颢"},{"line":"燕台一望客心惊，箫鼓□□汉将营。","answer":"喧喧","title":"望蓟门","author":"祖咏"},{"line":"终南□岭秀，积雪浮云端。","answer":"阴","title":"终南望余雪","author":"祖咏"},{"line":"白日登山望烽火，黄昏饮马傍□□。","answer":"交河","title":"古从军行","author":"李颀"},{"line":"□人有酒欢今夕，请奏鸣琴广陵客。","answer":"主","title":"琴歌","author":"李颀"},{"line":"四月南风大麦黄，□□未落桐阴长。","answer":"枣花","title":"送陈章甫","author":"李颀"},{"line":"南山截竹为觱篥，□□本自龟兹出。","answer":"此乐","title":"听安万善吹觱篥歌","author":"李颀"},{"line":"男儿事长征，少小□□客。","answer":"幽燕","title":"古意","author":"李颀"},{"line":"蔡女□造胡笳声，一弹一十有八拍。","answer":"昔","title":"听董大弹胡笳声兼寄语弄房给事","author":"李颀"},{"line":"□闻游子唱离歌，昨夜微霜初渡河。","answer":"朝","title":"送魏万之京","author":"李颀"},{"line":"幽意无断绝，此去□□偶。","answer":"随所","title":"春泛若耶溪","author":"綦毋潜"},{"line":"蝉鸣空□□，八月萧关道。","answer":"桑林","title":"塞下曲四首 一","author":"王昌龄"},{"line":"饮马渡秋水，水寒风□□。","answer":"似刀","title":"塞下曲四首 二","author":"王昌龄"},{"line":"高卧□斋时，开帷月初吐。","answer":"南","title":"同从弟销南斋玩月忆山阴崔少府","author":"王昌龄"},{"line":"昨夜风开露□□，未央前殿月轮高。","answer":"井桃","title":"春宫曲","author":"王昌龄"},{"line":"闺中少妇不□□，春日凝妆上翠楼。","answer":"曾愁","title":"闺怨","author":"王昌龄"},{"line":"□雨连天夜入湖，平明送客楚山孤。","answer":"寒","title":"芙蓉楼送辛渐二首 一","author":"王昌龄"},{"line":"清溪深不测，□□唯孤云。","answer":"隐处","title":"宿王昌龄隐居","author":"常建"},{"line":"云想□裳花想容，春风拂槛露华浓。","answer":"衣","title":"清平调 一","author":"李白"},{"line":"一枝红艳露凝香，□□巫山枉断肠。","answer":"云雨","title":"清平调 二","author":"李白"},{"line":"名花倾国两相欢，□□君王带笑看。","answer":"常得","title":"清平调 三","author":"李白"},{"line":"少小离家老大回，□□难改鬓毛衰。","answer":"乡音","title":"还乡偶书  其二","author":"黄拱"},{"line":"□皇重色思倾国，御宇多年求不得。","answer":"汉","title":"长恨歌","author":"白居易"},{"line":"浔阳江头夜□□，枫叶荻花秋索索。","answer":"送客","title":"琵琶引","author":"白居易"},{"line":"离离原上草，□□一枯荣。","answer":"一岁","title":"赋得古原草送别","author":"白居易"},{"line":"时难年饥世业空，弟兄□□各西东。","answer":"羇旅","title":"自河南经乱关内阻饥兄弟离散各在一处因望月有感聊书所怀寄上浮梁大兄於潜七兄乌江十五兄兼示符离及下邽弟妹","author":"白居易"},{"line":"绿螘新醅酒，□□小火垆。","answer":"红泥","title":"问刘十九","author":"白居易"},{"line":"松下□□子，言师采药去。","answer":"问童","title":"寻隐者不遇","author":"贾岛"},{"line":"澹然□□对斜晖，曲岛苍茫接翠微。","answer":"空水","title":"利州南渡","author":"温庭筠"},{"line":"冰簟□床梦不成，碧天如水夜云轻。","answer":"银","title":"瑶瑟怨","author":"温庭筠"},{"line":"荒戍□黄叶，浩然离故关。","answer":"落","title":"送人东游","author":"温庭筠"},{"line":"苏武□销汉使前，古祠高树两茫然。","answer":"魂","title":"苏武庙","author":"温庭筠"},{"line":"岭外音书□，经年复历春。","answer":"绝","title":"渡汉江","author":"李频"},{"line":"□□未识绮罗香，拟托良媒益自伤。","answer":"蓬门","title":"贫女","author":"秦韬玉"},{"line":"几行归□□，片影独何之。","answer":"去尽","title":"孤鴈 二","author":"崔涂"},{"line":"迢遰三巴路，羇危□□身。","answer":"万里","title":"巴山道中除夜书怀","author":"崔涂"},{"line":"故国三千里，深宫二□□。","answer":"十年","title":"宫词二首 一","author":"张祜"},{"line":"□□宫树月痕过，媚眼唯看宿燕窠。","answer":"禁门","title":"赠内人","author":"张祜"},{"line":"□□斜照集灵台，红树花迎晓露开。","answer":"日光","title":"集灵台二首 一","author":"张祜"},{"line":"□国夫人承主恩，平明骑马入宫门。","answer":"虢","title":"集灵台二首 二","author":"张祜"},{"line":"金陵□□小山楼，一宿行人自可愁。","answer":"津渡","title":"题金陵渡","author":"张祜"},{"line":"□□花时闭院门，美人相并立琼轩。","answer":"寂寂","title":"宫词","author":"朱庆余"},{"line":"张生□□石鼓文，劝我试作石鼓歌。","answer":"手持","title":"石鼓歌","author":"韩愈"},{"line":"桂魄初生秋露微，轻罗已薄未□□。","answer":"更衣","title":"秋夜曲","author":"王涯"},{"line":"汲井□□齿，清心拂尘服。","answer":"漱寒","title":"晨诣超师院读禅经","author":"柳宗元"},{"line":"城上高楼接大荒，□□愁思正茫茫。","answer":"海天","title":"登柳州城楼寄漳汀封连四州","author":"柳宗元"},{"line":"久为簪组累，幸此□□谪。","answer":"南夷","title":"溪居","author":"柳宗元"},{"line":"千山鸟□□，万迳人踪灭。","answer":"飞绝","title":"江雪","author":"柳宗元"},{"line":"渔翁夜傍西岩宿，晓汲□□燃楚竹。","answer":"清湘","title":"渔翁","author":"柳宗元"},{"line":"天地英雄气，□□尚凛然。","answer":"千秋","title":"蜀先主庙","author":"刘禹锡"},{"line":"今夜鄜州月，闺中□□看。","answer":"只独","title":"月夜","author":"杜甫"},{"line":"国破山河在，□□草木深。","answer":"城春","title":"春望","author":"杜甫"},{"line":"花隐□垣暮，啾啾栖鸟过。","answer":"掖","title":"春宿左省","author":"杜甫"},{"line":"此道昔归顺，西郊□□繁。","answer":"胡正","title":"至德二载甫自京金光门出问道归凤翔乾元初从左拾遗移华州掾与亲故别因出此门有悲往事","author":"杜甫"},{"line":"戍鼓断□□，秋边一雁声。","answer":"人行","title":"月夜忆舍弟","author":"杜甫"},{"line":"凉风起天末，□□意如何。","answer":"君子","title":"天末忆李白","author":"杜甫"},{"line":"丞相祠堂何处寻，锦官□□柏森森。","answer":"城外","title":"蜀相","author":"杜甫"},{"line":"舍南舍北皆春水，但见□□日日来。","answer":"群鸥","title":"客至","author":"杜甫"},{"line":"西山□□三奇戍，南浦清江万里桥。","answer":"白雪","title":"野望","author":"杜甫"},{"line":"远送从此别，青山□□情。","answer":"空复","title":"奉济驿重送严公四韵","author":"杜甫"},{"line":"劒外□□收蓟北，初闻涕泪满衣裳。","answer":"忽传","title":"闻官军收河南河北","author":"杜甫"},{"line":"□急天高猨啸哀，渚清沙白鸟飞回。","answer":"风","title":"登高","author":"杜甫"},{"line":"他乡复行役，驻马别□□。","answer":"孤坟","title":"别房太尉墓","author":"杜甫"},{"line":"□近高楼伤客心，万方多难此登临。","answer":"花","title":"登楼","author":"杜甫"},{"line":"清秋幕府井梧寒，独宿□□蜡炬残。","answer":"江城","title":"宿府","author":"杜甫"},{"line":"细草微风岸，危樯独□□。","answer":"夜舟","title":"旅夜书怀","author":"杜甫"},{"line":"岁暮□□催短景，天涯霜雪霁寒宵。","answer":"阴阳","title":"阁夜","author":"杜甫"},{"line":"功盖三分□，名高八阵图。","answer":"国","title":"八阵图","author":"杜甫"},{"line":"□离东北风尘际，漂泊西南天地间。","answer":"支","title":"咏怀古迹五首 一","author":"杜甫"},{"line":"摇落深知宋玉悲，风流□□亦吾师。","answer":"儒雅","title":"咏怀古迹五首 二","author":"杜甫"},{"line":"群山□壑赴荆门，生长明妃尚有村。","answer":"万","title":"咏怀古迹五首 三","author":"杜甫"},{"line":"蜀主窥吴幸三□，崩年亦在永安宫。","answer":"峡","title":"咏怀古迹五首 四","author":"杜甫"},{"line":"诸葛大名垂宇宙，宗臣遗像肃□□。","answer":"清高","title":"咏怀古迹五首 五","author":"杜甫"},{"line":"歧王宅里寻常见，崔九□□几度闻。","answer":"堂前","title":"江南逢李龟年","author":"杜甫"},{"line":"昔闻洞庭水，□□岳阳楼。","answer":"今上","title":"登岳阳楼","author":"杜甫"},{"line":"虢国夫人承主恩，平明□□入宫门。","answer":"上马","title":"虢国夫人","author":"杜甫"},{"line":"海上生明月，天涯共□□。","answer":"此时","title":"望月怀远","author":"张九龄"},{"line":"阳月南飞□，传闻至此回。","answer":"雁","title":"题大庾岭北驿","author":"宋之问"},{"line":"□□音书断，经冬复历春。","answer":"岭外","title":"渡汉江","author":"宋之问"},{"line":"乡心□岁切，天畔独澘然。","answer":"新","title":"新年作","author":"宋之问"},{"line":"□阙辅三秦，风烟望五津。","answer":"城","title":"杜少府之任蜀州","author":"王勃"},{"line":"独有宦游人，偏惊□□新。","answer":"物候","title":"和晋陵陆丞早春游望","author":"杜审言"},{"line":"欲穷千里目，更上□□楼。","answer":"一层","title":"登楼","author":"朱斌"},{"line":"嗟君□□意何如，驻马衔桮问谪居。","answer":"此别","title":"送李少府贬峡中王少府贬长沙","author":"高适"},{"line":"岱宗夫如何，□□青未了。","answer":"齐鲁","title":"望岳","author":"杜甫"},{"line":"耶娘妻子走相□，尘埃不见咸阳桥。","answer":"送","title":"兵车行","author":"杜甫"},{"line":"人生不相见，动如□□商。","answer":"参与","title":"赠卫八处士","author":"杜甫"},{"line":"□月三日天气新，长安水边多丽人。","answer":"三","title":"丽人行","author":"杜甫"},{"line":"少陵野老吞声哭，春日潜行曲□□。","answer":"江曲","title":"哀江头","author":"杜甫"},{"line":"长安□头头白乌，夜飞延秋门上呼。","answer":"城","title":"哀王孙","author":"杜甫"},{"line":"绝代有佳人，□□在空谷。","answer":"幽居","title":"佳人","author":"杜甫"},{"line":"死别已吞声，□□常恻恻。","answer":"生别","title":"梦李白二首 一","author":"杜甫"},{"line":"浮云终日行，游子□□至。","answer":"久不","title":"梦李白二首 二","author":"杜甫"},{"line":"国初已来画鞍□，神妙独数江都王。","answer":"马","title":"韦讽录事宅观曹将军画马图","author":"杜甫"},{"line":"将军魏武之子□，于今为庶为清门。","answer":"孙","title":"丹青引赠曹将军霸","author":"杜甫"},{"line":"□我不乐思岳阳，身欲奋飞病在床。","answer":"今","title":"寄韩谏议","author":"杜甫"},{"line":"孔明庙前有老柏，□□青铜根如石。","answer":"柯如","title":"古柏行","author":"杜甫"},{"line":"昔有佳人公□□，一舞劒气动四方。","answer":"孙氏","title":"观公孙大娘弟子舞劒器行","author":"杜甫"},{"line":"秦时明月汉时关，□□征人尚未还。","answer":"万里","title":"杂曲歌辞 盖罗缝 一","author":"不详"},{"line":"回乐峰前沙似雪，受降□□月如霜。","answer":"城外","title":"杂曲歌辞 婆罗门","author":"杨敬述进"},{"line":"名花倾国两□□，长得君王带笑看。","answer":"相欢","title":"杂曲歌辞 清平调 三","author":"李白"},{"line":"谓城朝雨浥□□，客舍青青柳色春。","answer":"轻尘","title":"杂曲歌辞 渭城曲","author":"王维"},{"line":"劝君莫惜金□□，劝君惜取少年时。","answer":"缕衣","title":"杂曲歌辞 金缕衣","author":"不详"},{"line":"兰叶□□蕤，桂华秋皎洁。","answer":"春葳","title":"感遇十二首 一","author":"张九龄"},{"line":"幽林归独卧，滞虑洗□□。","answer":"孤清","title":"感遇十二首 二","author":"张九龄"},{"line":"孤鸿□上来，池潢不敢顾。","answer":"海","title":"感遇十二首 四","author":"张九龄"},{"line":"江南有丹橘，经冬犹□□。","answer":"绿林","title":"感遇十二首 七","author":"张九龄"},{"line":"移家虽□□，野径入桑麻。","answer":"带郭","title":"寻陆鸿渐不遇","author":"皎然"},{"line":"□晋楼船下益州，金陵王气黯然收。","answer":"西","title":"西塞山怀古","author":"刘禹锡"},{"line":"朱雀桥边野草花，乌衣巷口夕□□。","answer":"阳斜","title":"金陵五题 乌衣巷","author":"刘禹锡"},{"line":"新妆面面下朱楼，深锁春光一□□。","answer":"院愁","title":"和乐天春词","author":"刘禹锡"},{"line":"梧桐相待老，鸳鸯会□□。","answer":"双死","title":"列女操","author":"孟郊"},{"line":"慈母□中线，游子身上衣。","answer":"手","title":"游子吟","author":"孟郊"},{"line":"隠隠飞桥隔□□，石矶西畔问渔船。","answer":"野烟","title":"度南涧","author":"蔡襄"},{"line":"□□带茅茨，云霞生薜帷。","answer":"泉壑","title":"谷口书斋寄杨补阙","author":"钱起"},{"line":"上国随□□，来途若梦行。","answer":"缘住","title":"送僧归日本","author":"钱起"},{"line":"二月黄莺飞上林，□□紫禁晓阴阴。","answer":"春城","title":"赠阙下裴舍人","author":"钱起"},{"line":"月黑雁飞高，单于夜□□。","answer":"遁逃","title":"和张仆射塞下曲","author":"钱起"},{"line":"昔岁逢太平，山林□□年。","answer":"二十","title":"贼退示官吏","author":"元结"},{"line":"□风连日作大浪，不能废人运酒舫。","answer":"长","title":"石鱼湖上醉歌","author":"元结"},{"line":"月落乌啼霜□□，江枫渔父对愁眠。","answer":"满天","title":"枫桥夜泊","author":"张继"},{"line":"长簟迎风□，空城澹月华。","answer":"早","title":"酬程延秋夜即事见赠","author":"韩翃"},{"line":"仙台□□五城楼，风物凄凄宿雨收。","answer":"下见","title":"同题仙游观","author":"韩翃"},{"line":"春城无处不飞□，寒食东风御柳斜。","answer":"花","title":"寒食","author":"韩翃"},{"line":"去年□□逢君别，今日花开已一年。","answer":"花里","title":"寄李儋元锡","author":"韦应物"},{"line":"今朝□斋冷，忽念山中客。","answer":"郡","title":"寄全椒山中道士","author":"韦应物"},{"line":"□□属秋夜，散步咏凉天。","answer":"怀君","title":"秋夜寄丘二十二员外","author":"韦应物"},{"line":"楚江微雨里，□□暮钟时。","answer":"建业","title":"赋得暮雨送李胄","author":"韦应物"},{"line":"永日方戚□，出门复悠悠。","answer":"戚","title":"送杨氏女","author":"韦应物"},{"line":"客从东方来，衣上灞□□。","answer":"陵雨","title":"长安遇冯著","author":"韦应物"},{"line":"□帆逗淮镇，停舫临孤驿。","answer":"落","title":"夕次盱眙县","author":"韦应物"},{"line":"吏舍□终年，出郊旷清曙。","answer":"跼","title":"东郊","author":"韦应物"},{"line":"独怜□□涧边生，上有黄鹂深树鸣。","answer":"幽草","title":"滁州西涧","author":"韦应物"},{"line":"淑气催黄□，晴光照绿苹。","answer":"鸟","title":"和晋陵陆丞早春游望","author":"韦应物"},{"line":"□势如涌出，孤高耸天宫。","answer":"塔","title":"与高适薛据慈恩寺浮图","author":"岑参"},{"line":"□□卷地白草折，胡天八月即飞雪。","answer":"北风","title":"白雪歌送武判官归京","author":"岑参"},{"line":"□□城头夜吹角，轮台城北旄头落。","answer":"轮台","title":"轮台歌奉送封大夫出师西征","author":"岑参"},{"line":"走马川行雪□□，平沙莽莽黄入天。","answer":"海边","title":"走马川行奉送出师西征","author":"岑参"},{"line":"联步□□陛，分曹限紫微。","answer":"趋丹","title":"寄左省杜拾遗","author":"岑参"},{"line":"鸡鸣紫陌曙光寒，莺啭皇州春□□。","answer":"色阑","title":"奉和中书舍人贾至早朝大明宫","author":"岑参"},{"line":"□□东望路漫漫，双袖龙钟泪不干。","answer":"故园","title":"逢入京使","author":"岑参"},{"line":"调角断清秋，征人倚□□。","answer":"戍楼","title":"书边事","author":"张乔"},{"line":"□□清酒斗十千，玉盘珍羞直万钱。","answer":"金樽","title":"行路难三首 一","author":"李白"},{"line":"大道如青□，我独不得出。","answer":"天","title":"行路难三首 二","author":"李白"},{"line":"有耳莫洗颍川水，□□莫食首阳蕨。","answer":"有口","title":"行路难三首 三","author":"李白"},{"line":"□霜凄凄簟色寒，孤灯不明思欲绝。","answer":"微","title":"长相思","author":"李白"},{"line":"□□生白露，夜久侵罗袜。","answer":"玉阶","title":"玉阶怨","author":"李白"},{"line":"一枝□艳露凝香，云雨巫山枉断肠。","answer":"秾","title":"清平调词三首 二","author":"李白"},{"line":"举头望山月，低头□□乡。","answer":"思故","title":"静夜思","author":"李白"},{"line":"燕草如碧□，秦桑低绿枝。","answer":"丝","title":"春思","author":"李白"},{"line":"秦地罗敷女，□□绿水边。","answer":"采桑","title":"子夜吴歌 春歌","author":"李白"},{"line":"镜湖三百里，菡萏□□花。","answer":"发荷","title":"子夜吴歌 夏歌","author":"李白"},{"line":"长安一片月，万户捣□□。","answer":"衣声","title":"子夜吴歌 秋歌","author":"李白"},{"line":"明朝驿使发，一夜□□袍。","answer":"絮征","title":"子夜吴歌 冬歌","author":"李白"},{"line":"吾爱□□子，风流天下闻。","answer":"孟夫","title":"赠孟浩然","author":"李白"},{"line":"我本楚狂人，凤歌□□丘。","answer":"笑孔","title":"庐山谣寄卢侍御虚舟","author":"李白"},{"line":"天姥连天向□□，势拔五岳掩赤城。","answer":"天横","title":"梦游天姥吟留别","author":"李白"},{"line":"风吹柳花满店香，吴姬□□唤客尝。","answer":"压酒","title":"金陵酒肆留别","author":"李白"},{"line":"故人西辞黄鹤楼，□□三月下扬州。","answer":"烟花","title":"黄鹤楼送孟浩然之广陵","author":"李白"},{"line":"渡远□□外，来从楚国游。","answer":"荆门","title":"渡荆门送别","author":"李白"},{"line":"□□横北郭，白水遶东城。","answer":"青山","title":"送友人","author":"李白"},{"line":"长风万里送秋雁，对此可以酣□□。","answer":"高楼","title":"宣州谢朓楼饯别校书叔云","author":"李白"},{"line":"暮从碧山下，山月□□归。","answer":"随人","title":"下终南山过斛斯山人宿置酒","author":"李白"},{"line":"□凰台上凤凰游，凤去台空江自流。","answer":"凤","title":"登金陵凤凰台","author":"李白"},{"line":"朝辞白帝彩□□，千里江陵一日还。","answer":"云间","title":"早发白帝城","author":"李白"},{"line":"牛渚西□□，青天无片云。","answer":"江夜","title":"夜泊牛渚怀古","author":"李白"},{"line":"□□一壶酒，独酌无相亲。","answer":"花间","title":"月下独酌四首 一","author":"李白"},{"line":"蜀僧抱绿绮，西下□□峰。","answer":"峨眉","title":"听蜀僧濬弹琴","author":"李白"},{"line":"美人卷□□，深坐颦蛾眉。","answer":"珠帘","title":"怨情","author":"李白"},{"line":"江汉曾为客，□□每醉还。","answer":"相逢","title":"淮上喜会梁川故人","author":"韦应物"},{"line":"兵卫森画戟，宴寝凝□□。","answer":"清香","title":"郡斋雨中与诸文士燕集","author":"韦应物"},{"line":"凄凄去亲爱，泛泛□□雾。","answer":"入烟","title":"初发扬子寄元大校书","author":"韦应物"},{"line":"嫁得瞿塘贾，朝朝误□□。","answer":"妾期","title":"相和歌辞 江南曲","author":"李益"},{"line":"□□烟尘在东北，汉将辞家破残贼。","answer":"汉家","title":"相和歌辞 燕歌行","author":"高适"},{"line":"白日登山望□□，昏黄饮马傍交河。","answer":"烽火","title":"相和歌辞 从军行","author":"李颀"},{"line":"尔来四万八千岁，乃与秦塞通□□。","answer":"人烟","title":"相和歌辞 蜀道难","author":"李白"},{"line":"□帚平明金殿开，暂将团扇共裴回。","answer":"奉","title":"相和歌辞 长信怨 二","author":"王昌龄"},{"line":"却下水精帘，□□望秋月。","answer":"玲珑","title":"相和歌辞 玉阶怨","author":"李白"},{"line":"五月□施采，人看隘若邪。","answer":"西","title":"相和歌辞 子夜四时歌四首 夏歌","author":"李白"},{"line":"贞妇贵徇夫，舍生□□此。","answer":"亦如","title":"琴曲歌辞 列女操","author":"孟郊"},{"line":"犀筯厌饫久未下，鸾刀缕切空□□。","answer":"纷纶","title":"杂曲歌辞 丽人行","author":"杜甫"},{"line":"上有青冥之□□，下有绿水之波澜。","answer":"长天","title":"杂曲歌辞 长相思三首 一","author":"李白"},{"line":"日色已尽花□□，月明欲素愁不眠。","answer":"含烟","title":"杂曲歌辞 长相思三首 二","author":"李白"},{"line":"□尊清酒斗十千，玉盘珍羞直万钱。","answer":"金","title":"杂曲歌辞 行路难三首 一","author":"李白"},{"line":"昔时燕家重郭隗，拥篲□□无嫌猜。","answer":"折腰","title":"杂曲歌辞 行路难三首 二","author":"李白"},{"line":"陆机才多岂自保，李斯税驾苦□□。","answer":"不早","title":"杂曲歌辞 行路难三首 三","author":"李白"},{"line":"停舟暂借问，□□是同乡。","answer":"或恐","title":"杂曲歌辞 长干曲四首 一","author":"崔颢"},{"line":"家临九江□，去来九江侧。","answer":"水","title":"杂曲歌辞 长干曲四首 二","author":"崔颢"},{"line":"□□初覆额，折花门前剧。","answer":"妾发","title":"杂曲歌辞 长干行二首 一","author":"李白"},{"line":"□□小妇郁金堂，海燕双栖玳瑁梁。","answer":"卢家","title":"杂曲歌辞 独不见","author":"沈佺期"},{"line":"家住秦城邻汉苑，□□明月到胡天。","answer":"心随","title":"春思","author":"皇甫冉"},{"line":"更深□□半人家，北斗阑干南斗斜。","answer":"月色","title":"夜月","author":"刘方平"},{"line":"纱窗日落渐黄昏，金屋无人见□□。","answer":"泪痕","title":"春怨","author":"刘方平"},{"line":"黄河远上白云间，一片孤城万□□。","answer":"仞山","title":"凉州词二首 一","author":"王之涣"},{"line":"道由白云尽，□□青溪长。","answer":"春与","title":"阙题","author":"刘眘虚"},{"line":"□□金河复玉关，朝朝马策与刀环。","answer":"岁岁","title":"征怨","author":"柳中庸"},{"line":"故关衰草遍，离别正□□。","answer":"堪悲","title":"送李端","author":"严维"},{"line":"□楼天半起笙歌，风送宫嫔笑语和。","answer":"玉","title":"宫词五首 二","author":"顾况"},{"line":"那堪玄鬓影，来对□□吟。","answer":"白头","title":"在岳咏蝉","author":"骆宾王"},{"line":"叹凤嗟身□，伤麟怨道穷。","answer":"否","title":"经邹鲁祭孔子而叹之","author":"明皇帝"},{"line":"高堂明镜悲白发，□□青丝暮成雪。","answer":"朝如","title":"鼓吹曲辞 将进酒","author":"李白"},{"line":"□□龙城飞将在，不教胡马度阴山。","answer":"但使","title":"横吹曲辞 出塞 一","author":"王昌龄"},{"line":"羌笛何须怨杨柳，□□不度玉门关。","answer":"春风","title":"横吹曲辞 出塞","author":"王之涣"},{"line":"长风几万里，吹度玉□□。","answer":"门关","title":"横吹曲辞 关山月","author":"李白"},{"line":"未谙姑食性，□□小姑尝。","answer":"先遣","title":"新嫁娘词三首 三","author":"王建"},{"line":"白头宫女在，□□说玄宗。","answer":"闲坐","title":"故行宫","author":"王建"},{"line":"庄生晓梦迷蝴□，望帝春心托杜鹃。","answer":"蝶","title":"锦瑟","author":"李商隐"},{"line":"五更疎欲□，一树碧无情。","answer":"断","title":"蝉","author":"李商隐"},{"line":"□阳无限好，只是近黄昏。","answer":"夕","title":"乐游原","author":"李商隐"},{"line":"何当□剪西窗烛，却话巴山夜雨时。","answer":"共","title":"夜雨寄北","author":"李商隐"},{"line":"誓将上雪列圣耻，坐法宫中朝□□。","answer":"四夷","title":"韩碑","author":"李商隐"},{"line":"□□仍风雨，青楼自管弦。","answer":"黄叶","title":"风雨","author":"李商隐"},{"line":"休问梁园旧宾客，茂陵□□病相如。","answer":"秋雨","title":"寄令狐郎中","author":"李商隐"},{"line":"玉玺不缘归日□，锦帆应是到天涯。","answer":"角","title":"隋宫","author":"李商隐"},{"line":"徒令上将挥神笔，终见降王走□□。","answer":"传车","title":"筹笔驿","author":"李商隐"},{"line":"□无彩凤双飞翼，心有灵犀一点通。","answer":"身","title":"无题二首 一","author":"李商隐"},{"line":"□为远别啼难唤，书被催成墨未浓。","answer":"梦","title":"无题四首 一","author":"李商隐"},{"line":"金蟾啮鏁烧香入，□□牵丝汲井回。","answer":"玉虎","title":"无题四首 二","author":"李商隐"},{"line":"春风举国裁宫锦，□□障泥半作帆。","answer":"半作","title":"隋宫","author":"李商隐"},{"line":"参差连曲陌，□□送斜晖。","answer":"迢遰","title":"落花","author":"李商隐"},{"line":"无端嫁得金龟壻，辜负香衾事□□。","answer":"早朝","title":"为有","author":"李商隐"},{"line":"春蚕到死丝方□，蜡炬成灰泪始干。","answer":"尽","title":"无题","author":"李商隐"},{"line":"八骏日行三万里，□□何事不重来。","answer":"穆王","title":"瑶池","author":"李商隐"},{"line":"红楼隔雨相□□，珠箔飘灯独自归。","answer":"望冷","title":"春雨","author":"李商隐"},{"line":"□娥应悔偷灵药，碧海青天夜夜心。","answer":"常","title":"常娥","author":"李商隐"},{"line":"扇裁□□羞难掩，车走雷声语未通。","answer":"月魄","title":"无题二首 一","author":"李商隐"},{"line":"神女生涯原是梦，□□居处本无郎。","answer":"小姑","title":"无题二首 二","author":"李商隐"},{"line":"可怜夜半虚前席，□□苍生问鬼神。","answer":"不问","title":"贾生","author":"李商隐"},{"line":"永怀当□□，倚立自移时。","answer":"此节","title":"凉思","author":"李商隐"},{"line":"落叶人何在，寒云路□□。","answer":"几层","title":"北青萝","author":"李商隐"},{"line":"东风□与周郎便，铜雀春深锁二乔。","answer":"不","title":"赤壁","author":"李商隐"},{"line":"孤灯闻楚角，残月下□□。","answer":"章台","title":"章台夜思","author":"韦庄"},{"line":"君看六幅南朝事，老木□□满故城。","answer":"寒云","title":"金陵图","author":"韦庄"},{"line":"无情最是台□□，依旧烟笼十里堤。","answer":"城柳","title":"台城","author":"韦庄"},{"line":"锁衔金兽连环冷，水滴□□昼漏长。","answer":"铜龙","title":"宫词","author":"薛逢"},{"line":"猨啼洞庭□，人在木兰舟。","answer":"树","title":"楚江怀古三首 一","author":"马戴"},{"line":"落叶他乡树，□□独夜人。","answer":"寒灯","title":"灞上秋居","author":"马戴"},{"line":"蕃汉断消息，□□长别离。","answer":"死生","title":"没蕃故人","author":"张籍"},{"line":"啼时惊妾梦，不得□□西。","answer":"到辽","title":"春怨","author":"金昌绪"},{"line":"□□无衣搜画箧，泥他沽酒拔金钗。","answer":"顾我","title":"遣悲怀三首 一","author":"元稹"},{"line":"衣裳□施行看尽，针线犹存未忍开。","answer":"已","title":"遣悲怀三首 二","author":"元稹"},{"line":"邓攸□子寻知命，潘岳悼亡犹费词。","answer":"无","title":"遣悲怀三首 三","author":"元稹"},{"line":"至今窥牧马，□□过临洮。","answer":"不敢","title":"哥舒歌","author":"西鄙人"},{"line":"早是□□归未得，杜鹃休向耳边啼。","answer":"有家","title":"杂诗 十三","author":"无名氏"},{"line":"可怜闺里月，长在汉□□。","answer":"家营","title":"杂诗三首 三","author":"沈佺期"},{"line":"九月寒砧催木叶，十年□□忆辽阳。","answer":"征戍","title":"古意呈补阙乔知之","author":"沈佺期"},{"line":"潮平两岸阔，□□一帆悬。","answer":"风正","title":"次北固山下","author":"王湾"},{"line":"桃花尽日随流水，□□清谿何处边。","answer":"洞在","title":"桃花谿","author":"张旭"},{"line":"君言不得意，□□南山陲。","answer":"归卧","title":"送别","author":"王维"},{"line":"遂令东山客，不得顾□□。","answer":"采薇","title":"送綦毋潜落第还乡","author":"王维"},{"line":"□□将万转，趣途无百里。","answer":"随山","title":"青谿","author":"王维"},{"line":"野老念牧童，倚杖候□□。","answer":"荆扉","title":"渭川田家","author":"王维"},{"line":"朝仍越溪□，暮作吴宫妃。","answer":"女","title":"西施咏","author":"王维"},{"line":"射杀中山白额虎，肯数□□黄须儿。","answer":"邺下","title":"老将行","author":"王维"},{"line":"坐看□树不知远，行尽青溪不见人。","answer":"红","title":"桃源行","author":"王维"},{"line":"□人玉勒乘骢马，侍女金盘鲙鲤鱼。","answer":"良","title":"洛阳女儿行","author":"王维"},{"line":"倚杖□□外，临风听暮蝉。","answer":"柴门","title":"辋川闲居赠裴秀才迪","author":"王维"},{"line":"□□无长策，空知返旧林。","answer":"自顾","title":"酬张少府","author":"王维"},{"line":"山中一夜雨，树杪□□泉。","answer":"百重","title":"送梓州李使君","author":"王维"},{"line":"□□不可弃，莫是藁砧归。","answer":"铅华","title":"玉台体十二首 十一","author":"权德舆"},{"line":"升堂□□新雨足，芭蕉叶大支子肥。","answer":"坐阶","title":"山石","author":"韩愈"},{"line":"沙平水息声影绝，一桮□□君当歌。","answer":"相属","title":"八月十五夜赠张功曹","author":"韩愈"},{"line":"火维地荒足妖怪，天假神柄专□□。","answer":"其雄","title":"谒衡岳庙遂宿岳寺题门楼","author":"韩愈"},{"line":"八尺龙须方锦褥，□□天气未寒时。","answer":"已凉","title":"已凉","author":"韩偓"},{"line":"承恩不在貌，教妾若□□。","answer":"为容","title":"春宫怨","author":"杜荀鹤"},{"line":"欲把一麾江海去，乐游原上望□□。","answer":"昭陵","title":"将赴吴兴登乐游原一绝","author":"杜牧"},{"line":"商女不知亡国□，隔江犹唱后庭花。","answer":"恨","title":"泊秦淮","author":"杜牧"},{"line":"春风十里扬州路，□□珠帘总不如。","answer":"卷上","title":"赠别二首 一","author":"杜牧"},{"line":"蜡烛有心还惜别，□□垂泪到天明。","answer":"替人","title":"赠别二首 二","author":"杜牧"},{"line":"十年一觉扬州梦，赢得□□薄幸名。","answer":"青楼","title":"遣怀","author":"杜牧"},{"line":"天阶夜色凉□□，坐看牵牛织女星。","answer":"如水","title":"秋夕","author":"杜牧"},{"line":"日暮东风怨□□，落花犹似堕楼人。","answer":"啼鸟","title":"金谷园","author":"杜牧"},{"line":"寒灯思旧事，□□警愁眠。","answer":"断鴈","title":"旅宿","author":"杜牧"},{"line":"残萤委玉露，早鴈□□河。","answer":"拂银","title":"早秋三首 一","author":"许浑"},{"line":"残云□太华，疎雨过中条。","answer":"归","title":"秋日赴阙题潼关驿楼","author":"许浑"},{"line":"多情只有春庭月，犹为离人照□□。","answer":"落花","title":"寄人 一","author":"张泌"},{"line":"可怜无定河边骨，犹是□□梦里人。","answer":"春闺","title":"陇西行四首 二","author":"陈陶"},{"line":"红颜未老恩先断，□□薰笼坐到明。","answer":"斜倚","title":"后宫词","author":"白居易"},{"line":"问姓惊□□，称名忆旧容。","answer":"初见","title":"喜见外弟又言别","author":"李益"},{"line":"早知□有信，嫁与弄潮儿。","answer":"潮","title":"江南词","author":"李益"},{"line":"不知何处吹芦管，□□征人尽望乡。","answer":"一夜","title":"夜上受降城闻笛","author":"李益"},{"line":"欲得周郎顾，时时误□□。","answer":"拂弦","title":"听筝","author":"李端"},{"line":"他乡□白发，旧国见青山。","answer":"生","title":"贼平后送人北归","author":"司空曙"},{"line":"乍见□疑梦，相悲各问年。","answer":"翻","title":"云阳馆与韩绅宿别","author":"司空曙"},{"line":"雨中黄叶□，灯下白头人。","answer":"树","title":"喜外弟卢纶见宿","author":"司空曙"},{"line":"古调虽自爱，□□多不弹。","answer":"今人","title":"听弹琴","author":"刘长卿"},{"line":"□□沃洲山，时人已知处。","answer":"莫买","title":"送方外上人","author":"刘长卿"},{"line":"荷笠带夕阳，青山独□□。","answer":"归远","title":"送灵澈上人","author":"刘长卿"},{"line":"老至居人□，春归在客先。","answer":"下","title":"新年作","author":"刘长卿"},{"line":"□□人来少，云峰水隔深。","answer":"野寺","title":"秋日登吴公台上寺远眺寺即陈将吴明彻战场","author":"刘长卿"},{"line":"白云□静渚，春草闭闲门。","answer":"依","title":"寻南溪常山道人隐居","author":"刘长卿"},{"line":"飞鸟没何处，青山空□□。","answer":"向人","title":"饯别王十一南游","author":"刘长卿"},{"line":"江上月明胡□□，淮南木落楚山多。","answer":"鴈过","title":"江州重别薛六柳八二员外","author":"刘长卿"},{"line":"秋草独寻人去□，寒林空见日斜时。","answer":"后","title":"长沙过贾谊宅","author":"刘长卿"},{"line":"孤城背岭寒吹角，□□临江夜泊船。","answer":"独戍","title":"自夏口至鹦鹉洲夕望岳阳寄源中丞","author":"刘长卿"},{"line":"机中锦字论长恨，□□花枝笑独眠。","answer":"楼上","title":"赋得","author":"刘长卿"},{"line":"三晋云山皆北向，二陵□□自东来。","answer":"风雨","title":"九日登望仙台呈刘明府容","author":"崔曙"},{"line":"醉卧□场君莫笑，古来征战几人回。","answer":"沙","title":"凉州词二首 一","author":"王翰"},{"line":"□望试登高，心飞逐鸟灭。","answer":"相","title":"秋登兰山寄张五","author":"孟浩然"},{"line":"散发乘□□，开轩卧闲敞。","answer":"夕凉","title":"夏日南亭怀辛大","author":"孟浩然"},{"line":"松月生夜凉，□□满清听。","answer":"风泉","title":"宿业师山房期丁大不至","author":"孟浩然"},{"line":"人随沙路向江□，余亦乘舟归鹿门。","answer":"村","title":"夜归鹿门山歌","author":"孟浩然"},{"line":"气蒸云梦泽，□□岳阳城。","answer":"波撼","title":"望洞庭湖赠张丞相","author":"孟浩然"},{"line":"北土非□□，东林怀我师。","answer":"吾愿","title":"秦中感秋寄远上人","author":"孟浩然"},{"line":"风鸣两□□，月照一孤舟。","answer":"岸叶","title":"宿桐庐江寄广陵旧游","author":"孟浩然"},{"line":"□□襄水上，遥隔楚云端。","answer":"我家","title":"早寒江上有怀","author":"孟浩然"},{"line":"□□芳草去，惜与故人违。","answer":"欲寻","title":"留别王侍御维","author":"孟浩然"},{"line":"忽逢□鸟使，邀入赤松家。","answer":"青","title":"清明日宴梅道士房","author":"孟浩然"},{"line":"江山留胜迹，□□复登临。","answer":"我辈","title":"与诸子登岘山","author":"孟浩然"},{"line":"绿树村□□，青山郭外斜。","answer":"边合","title":"过故人庄","author":"孟浩然"},{"line":"不才明主□，多病故人疎。","answer":"弃","title":"岁暮归南山","author":"孟浩然"},{"line":"乱山残□□，孤灯异乡人。","answer":"雪夜","title":"岁除夜有怀","author":"孟浩然"},{"line":"夜来风雨声，□□知多少。","answer":"花落","title":"春晓","author":"孟浩然"},{"line":"野旷天低树，江清月□□。","answer":"近人","title":"宿建德江","author":"孟浩然"},{"line":"□来四万八千岁，不与秦塞通人烟。","answer":"尔","title":"蜀道难","author":"李白"},{"line":"钟鼓馔玉不足贵，但愿□□不愿醒。","answer":"长醉","title":"将进酒","author":"李白"},{"line":"还作江南会，翻疑梦□□。","answer":"里逢","title":"客夜与故人偶集","author":"戴叔伦"},{"line":"独立扬新令，□□共一呼。","answer":"千营","title":"和张仆射塞下曲 一","author":"卢纶"},{"line":"平明寻白羽，□□石棱中。","answer":"没在","title":"和张仆射塞下曲 二","author":"卢纶"},{"line":"欲将轻骑逐，大雪满□□。","answer":"弓刀","title":"和张仆射塞下曲 三","author":"卢纶"},{"line":"醉和□甲舞，雷鼓动山川。","answer":"金","title":"和张仆射塞下曲 四","author":"卢纶"},{"line":"估客□眠知浪静，舟人夜语觉潮生。","answer":"昼","title":"晚次鄂州","author":"卢纶"},{"line":"路出寒云外，□□暮雪时。","answer":"人归","title":"李端公","author":"卢纶"},{"line":"古木无人□，深山何处钟。","answer":"迳","title":"过香积寺","author":"王维"},{"line":"□月松间照，清泉石上流。","answer":"明","title":"山居秋暝","author":"王维"},{"line":"兴来每独往，胜事□□知。","answer":"空自","title":"终南别业","author":"王维"},{"line":"流水如有意，暮禽相□□。","answer":"与还","title":"归嵩山作","author":"王维"},{"line":"白云回望合，青霭□□无。","answer":"入看","title":"终南山","author":"王维"},{"line":"江流天地外，□□有无中。","answer":"山色","title":"汉江临泛","author":"王维"},{"line":"銮舆迥出千门柳，□□廻看上苑花。","answer":"阁道","title":"奉和圣制从蓬莱向兴庆阁道中留春雨中春望之作应制","author":"王维"},{"line":"九天阊阖开宫殿，□□衣冠拜冕旒。","answer":"万国","title":"和贾舍人早朝大明宫之作","author":"王维"},{"line":"禁里疎钟官舍晚，省中啼鸟吏□□。","answer":"人稀","title":"酬郭给事","author":"王维"},{"line":"漠漠水田飞白鹭，□□夏木啭黄鹂。","answer":"阴阴","title":"积雨辋川庄作","author":"王维"},{"line":"返景入深林，□□青苔上。","answer":"复照","title":"辋川集 鹿柴","author":"王维"},{"line":"深林人不知，□□来相照。","answer":"明月","title":"辋川集 竹里馆","author":"王维"},{"line":"□草明年绿，王孙归不归。","answer":"春","title":"送别","author":"王维"},{"line":"来日绮□□，寒梅着花未。","answer":"窗前","title":"杂诗三首 二","author":"王维"},{"line":"愿君□采撷，此物最相思。","answer":"多","title":"相思","author":"王维"},{"line":"遥知兄弟登高处，遍插□□少一人。","answer":"茱萸","title":"九月九日忆山东兄弟","author":"王维"},{"line":"劝君更尽一杯酒，西出□□无故人。","answer":"阳关","title":"渭城曲","author":"王维"},{"line":"莫学武陵人，□□桃源里。","answer":"暂游","title":"崔九欲往南山马上口号与别","author":"裴迪"},{"line":"若非巾□□，应是钓秋水。","answer":"柴车","title":"寻西山隐者不遇","author":"丘为"},{"line":"黄鹤一去不复□，白云千载空悠悠。","answer":"返","title":"黄鹤楼","author":"崔颢"},{"line":"武帝□□云欲散，仙人掌上雨初晴。","answer":"祠前","title":"行经华阴","author":"崔颢"},{"line":"同是□□人，自小不相识。","answer":"长干","title":"长干曲四首 二","author":"崔颢"},{"line":"万里寒光生积雪，三边□□动危旌。","answer":"曙色","title":"望蓟门","author":"祖咏"},{"line":"林表明霁色，□□增暮寒。","answer":"城中","title":"终南望余雪","author":"祖咏"},{"line":"行人刁斗风□□，公主琵琶幽怨多。","answer":"沙暗","title":"古从军行","author":"李颀"},{"line":"月照城头乌半飞，□□万树风入衣。","answer":"霜凄","title":"琴歌","author":"李颀"},{"line":"青山朝别暮还见，□□出门思旧乡。","answer":"嘶马","title":"送陈章甫","author":"李颀"},{"line":"流传□地曲转奇，凉州胡人为我吹。","answer":"汉","title":"听安万善吹觱篥歌","author":"李颀"},{"line":"赌胜马蹄下，由来轻□□。","answer":"七尺","title":"古意","author":"李颀"},{"line":"胡人落泪沾边草，□□断肠对归客。","answer":"汉使","title":"听董大弹胡笳声兼寄语弄房给事","author":"李颀"},{"line":"鸿鴈□堪愁里听，云山况是客中过。","answer":"不","title":"送魏万之京","author":"李颀"},{"line":"□□吹行舟，花路入溪口。","answer":"晚风","title":"春泛若耶溪","author":"綦毋潜"},{"line":"出塞□塞寒，处处黄芦草。","answer":"入","title":"塞下曲四首 一","author":"王昌龄"},{"line":"平沙日未没，黯黯见□□。","answer":"临洮","title":"塞下曲四首 二","author":"王昌龄"},{"line":"清辉□水木，演漾在窗户。","answer":"淡","title":"同从弟销南斋玩月忆山阴崔少府","author":"王昌龄"},{"line":"平阳歌舞新承□，帘外春寒赐锦袍。","answer":"宠","title":"春宫曲","author":"王昌龄"},{"line":"忽见陌头杨□□，悔教夫壻觅封侯。","answer":"柳色","title":"闺怨","author":"王昌龄"},{"line":"洛阳亲友如相□，一片冰心在玉壶。","answer":"问","title":"芙蓉楼送辛渐二首 一","author":"王昌龄"},{"line":"□□露微月，清光犹为君。","answer":"松际","title":"宿王昌龄隐居","author":"常建"},{"line":"若非群玉山头见，会向瑶台月□□。","answer":"下逢","title":"清平调 一","author":"李白"},{"line":"借问汉宫谁得似，可怜□□倚新妆。","answer":"飞燕","title":"清平调 二","author":"李白"},{"line":"解得春风无限恨，□□亭北倚阑干。","answer":"沈香","title":"清平调 三","author":"李白"},{"line":"儿童相见不相识，□□客从何处来。","answer":"借问","title":"还乡偶书  其二","author":"黄拱"},{"line":"□家有女初长成，养在深闺人未识。","answer":"杨","title":"长恨歌","author":"白居易"},{"line":"主人下马客在□，举酒欲饮无管弦。","answer":"船","title":"琵琶引","author":"白居易"},{"line":"野火烧不尽，□□吹又生。","answer":"春风","title":"赋得古原草送别","author":"白居易"},{"line":"田园寥落干戈后，骨肉□□道路中。","answer":"流离","title":"自河南经乱关内阻饥兄弟离散各在一处因望月有感聊书所怀寄上浮梁大兄於潜七兄乌江十五兄兼示符离及下邽弟妹","author":"白居易"},{"line":"晚来□□雪，能饮一杯无。","answer":"天欲","title":"问刘十九","author":"白居易"},{"line":"只在□山中，云深不知处。","answer":"此","title":"寻隐者不遇","author":"贾岛"},{"line":"波上马嘶看櫂去，□□人歇待船归。","answer":"柳边","title":"利州南渡","author":"温庭筠"},{"line":"□声远过潇湘去，十二楼中月自明。","answer":"雁","title":"瑶瑟怨","author":"温庭筠"},{"line":"高风汉阳渡，□□郢门山。","answer":"初日","title":"送人东游","author":"温庭筠"},{"line":"云边雁断胡天月，□□羊归塞草烟。","answer":"陇上","title":"苏武庙","author":"温庭筠"},{"line":"近乡情更怯，不敢□□人。","answer":"问来","title":"渡汉江","author":"李频"},{"line":"谁爱风流高格调，□□时世俭梳妆。","answer":"共怜","title":"贫女","author":"秦韬玉"},{"line":"□雨相呼失，寒塘独下迟。","answer":"暮","title":"孤鴈 二","author":"崔涂"},{"line":"乱山残雪夜，孤烛□□春。","answer":"异乡","title":"巴山道中除夜书怀","author":"崔涂"},{"line":"一声河□□，双泪落君前。","answer":"满子","title":"宫词二首 一","author":"张祜"},{"line":"斜拔玉钗灯影畔，剔开□□救飞蛾。","answer":"红焰","title":"赠内人","author":"张祜"},{"line":"□夜上皇新授箓，太真含笑入帘来。","answer":"昨","title":"集灵台二首 一","author":"张祜"},{"line":"□嫌脂粉汚颜色，淡扫蛾眉朝至尊。","answer":"却","title":"集灵台二首 二","author":"张祜"},{"line":"潮落□江斜月里，两三星火是瓜州。","answer":"夜","title":"题金陵渡","author":"张祜"},{"line":"含情欲说宫中事，□□前头不敢言。","answer":"鹦鹉","title":"宫词","author":"朱庆余"},{"line":"少陵□人谪仙死，才薄将奈石鼓何。","answer":"无","title":"石鼓歌","author":"韩愈"},{"line":"银筝夜久殷□□，心怯空房不忍归。","answer":"勤弄","title":"秋夜曲","author":"王涯"},{"line":"闲持贝叶□，步出东斋读。","answer":"书","title":"晨诣超师院读禅经","author":"柳宗元"},{"line":"惊风乱飐芙蓉□，密雨斜侵薜荔墙。","answer":"水","title":"登柳州城楼寄漳汀封连四州","author":"柳宗元"},{"line":"闲依农圃邻，□□山林客。","answer":"偶似","title":"溪居","author":"柳宗元"},{"line":"孤舟蓑笠翁，□□寒江雪。","answer":"独钓","title":"江雪","author":"柳宗元"},{"line":"回看天际下中流，岩上□□云相逐。","answer":"无心","title":"渔翁","author":"柳宗元"},{"line":"势分三足鼎，业复五□□。","answer":"铢钱","title":"蜀先主庙","author":"刘禹锡"},{"line":"遥怜小儿女，□□忆长安。","answer":"未解","title":"月夜","author":"杜甫"},{"line":"□时花溅泪，恨别鸟惊心。","answer":"感","title":"春望","author":"杜甫"},{"line":"星临万户□，月傍九霄多。","answer":"动","title":"春宿左省","author":"杜甫"},{"line":"至今残□□，应有未招魂。","answer":"破胆","title":"至德二载甫自京金光门出问道归凤翔乾元初从左拾遗移华州掾与亲故别因出此门有悲往事","author":"杜甫"},{"line":"露从今夜白，□□故乡明。","answer":"月是","title":"月夜忆舍弟","author":"杜甫"},{"line":"鸿雁几时到，江湖秋□□。","answer":"水多","title":"天末忆李白","author":"杜甫"},{"line":"映堦□草自春色，隔叶黄鹂空好音。","answer":"碧","title":"蜀相","author":"杜甫"},{"line":"花径不曾缘客扫，蓬门□□为君开。","answer":"今始","title":"客至","author":"杜甫"},{"line":"□□风尘诸弟隔，天涯涕泪一身遥。","answer":"海内","title":"野望","author":"杜甫"},{"line":"几时桮重□，昨夜月同行。","answer":"把","title":"奉济驿重送严公四韵","author":"杜甫"},{"line":"却看妻子愁□□，漫卷诗书喜欲狂。","answer":"何在","title":"闻官军收河南河北","author":"杜甫"},{"line":"无边落木萧□□，不尽长江衮衮来。","answer":"萧下","title":"登高","author":"杜甫"},{"line":"近泪无干土，低空有□□。","answer":"断云","title":"别房太尉墓","author":"杜甫"},{"line":"锦江春色来天地，□□浮云变古今。","answer":"玉垒","title":"登楼","author":"杜甫"},{"line":"永夜角声悲□□，中天月色好谁看。","answer":"自语","title":"宿府","author":"杜甫"},{"line":"□□平野阔，月涌大江流。","answer":"星垂","title":"旅夜书怀","author":"杜甫"},{"line":"□□鼓角声悲壮，三峡星河影动摇。","answer":"五更","title":"阁夜","author":"杜甫"},{"line":"江流□□转，遗恨失吞吴。","answer":"石不","title":"八阵图","author":"杜甫"},{"line":"□□楼台淹日月，五溪衣服共云山。","answer":"三峡","title":"咏怀古迹五首 一","author":"杜甫"},{"line":"怅望千秋一洒泪，□□异代不同时。","answer":"萧条","title":"咏怀古迹五首 二","author":"杜甫"},{"line":"一去□□连朔漠，独留青冢向黄昏。","answer":"紫台","title":"咏怀古迹五首 三","author":"杜甫"},{"line":"翠华想像空山里，玉殿虚无野□□。","answer":"寺中","title":"咏怀古迹五首 四","author":"杜甫"},{"line":"三分割据纡筹策，□□云霄一羽毛。","answer":"万古","title":"咏怀古迹五首 五","author":"杜甫"},{"line":"正是江南好风景，落花时节又□□。","answer":"逢君","title":"江南逢李龟年","author":"杜甫"},{"line":"吴楚□□坼，乾坤日夜浮。","answer":"东南","title":"登岳阳楼","author":"杜甫"},{"line":"却嫌脂粉涴颜色，澹埽蛾眉朝□□。","answer":"至尊","title":"虢国夫人","author":"杜甫"},{"line":"情人怨遥夜，竟夕起□□。","answer":"相思","title":"望月怀远","author":"张九龄"},{"line":"江静潮初落，林昏瘴□□。","answer":"不开","title":"题大庾岭北驿","author":"宋之问"},{"line":"与君□□意，同是宦游人。","answer":"离别","title":"杜少府之任蜀州","author":"王勃"},{"line":"云霞出海曙，梅柳渡□□。","answer":"江春","title":"和晋陵陆丞早春游望","author":"杜审言"},{"line":"□□啼猿数行泪，衡阳归雁几封书。","answer":"巫峡","title":"送李少府贬峡中王少府贬长沙","author":"高适"},{"line":"造化钟神秀，阴阳□□晓。","answer":"割昏","title":"望岳","author":"杜甫"},{"line":"牵衣□足阑道哭，哭声直上干云霄。","answer":"顿","title":"兵车行","author":"杜甫"},{"line":"今夕复□□，共此灯烛光。","answer":"何夕","title":"赠卫八处士","author":"杜甫"},{"line":"态浓意远淑且真，□□细腻骨肉匀。","answer":"肌理","title":"丽人行","author":"杜甫"},{"line":"江头宫殿锁千□，细柳新蒲为谁绿。","answer":"门","title":"哀江头","author":"杜甫"},{"line":"□向人家啄大屋，屋底达官走避胡。","answer":"又","title":"哀王孙","author":"杜甫"},{"line":"自云良家子，零落□□木。","answer":"依草","title":"佳人","author":"杜甫"},{"line":"□□瘴疠地，逐客无消息。","answer":"江南","title":"梦李白二首 一","author":"杜甫"},{"line":"□□频梦君，情亲见君意。","answer":"三夜","title":"梦李白二首 二","author":"杜甫"},{"line":"□军得名三十载，人间又见真乘黄。","answer":"将","title":"韦讽录事宅观曹将军画马图","author":"杜甫"},{"line":"英雄割据虽已矣，文彩□□犹尚存。","answer":"风流","title":"丹青引赠曹将军霸","author":"杜甫"},{"line":"美人娟娟隔秋水，濯足洞庭望□□。","answer":"八荒","title":"寄韩谏议","author":"杜甫"},{"line":"霜皮溜雨四十围，黛色□□二千尺。","answer":"参天","title":"古柏行","author":"杜甫"},{"line":"观者如山色沮丧，天地为之久□□。","answer":"低昂","title":"观公孙大娘弟子舞劒器行","author":"杜甫"},{"line":"但愿□庭神将在，不教胡马渡阴山。","answer":"龙","title":"杂曲歌辞 盖罗缝 一","author":"不详"},{"line":"解释春风无□□，沈香亭北倚阑干。","answer":"限恨","title":"杂曲歌辞 清平调 三","author":"李白"},{"line":"花开堪折直须折，莫待无花空□□。","answer":"折枝","title":"杂曲歌辞 金缕衣","author":"不详"},{"line":"欣欣此生意，自尔□□节。","answer":"为佳","title":"感遇十二首 一","author":"张九龄"},{"line":"持此□高鸟，因之传远情。","answer":"谢","title":"感遇十二首 二","author":"张九龄"},{"line":"侧见双翠鸟，巢在□□树。","answer":"三珠","title":"感遇十二首 四","author":"张九龄"},{"line":"岂伊地气暖，自有岁□□。","answer":"寒心","title":"感遇十二首 七","author":"张九龄"},{"line":"近种篱边菊，□□未著花。","answer":"秋来","title":"寻陆鸿渐不遇","author":"皎然"},{"line":"千寻铁锁沈江底，一片降旛出□□。","answer":"石头","title":"西塞山怀古","author":"刘禹锡"},{"line":"旧时王谢堂前燕，飞入□□百姓家。","answer":"寻常","title":"金陵五题 乌衣巷","author":"刘禹锡"},{"line":"行到中庭数花朵，□□飞上玉搔头。","answer":"蜻蜓","title":"和乐天春词","author":"刘禹锡"},{"line":"贞女贵狥夫，舍生□□此。","answer":"亦如","title":"列女操","author":"孟郊"},{"line":"临行密密缝，意恐□□归。","answer":"迟迟","title":"游子吟","author":"孟郊"},{"line":"桃花□□随流水，洞在清溪何处边。","answer":"尽日","title":"度南涧","author":"蔡襄"},{"line":"竹怜新雨后，山爱夕□□。","answer":"阳时","title":"谷口书斋寄杨补阙","author":"钱起"},{"line":"浮天沧□□，去世法舟轻。","answer":"海远","title":"送僧归日本","author":"钱起"},{"line":"长乐□声花外尽，龙池柳色雨中深。","answer":"钟","title":"赠阙下裴舍人","author":"钱起"},{"line":"泉源□庭户，洞壑当门前。","answer":"在","title":"贼退示官吏","author":"元结"},{"line":"我持长瓢坐巴丘，酌饮□□以散愁。","answer":"四坐","title":"石鱼湖上醉歌","author":"元结"},{"line":"姑苏城外寒山寺，□□钟声到客船。","answer":"夜半","title":"枫桥夜泊","author":"张继"},{"line":"星河秋一雁，□□夜千家。","answer":"砧杵","title":"酬程延秋夜即事见赠","author":"韩翃"},{"line":"□□遥连秦树晚，砧声近报汉宫秋。","answer":"山色","title":"同题仙游观","author":"韩翃"},{"line":"日暮汉宫传□□，轻烟散入五侯家。","answer":"蜡烛","title":"寒食","author":"韩翃"},{"line":"世事茫茫难自料，春愁黯黯独□□。","answer":"成眠","title":"寄李儋元锡","author":"韦应物"},{"line":"涧底束荆薪，归来煮□□。","answer":"白石","title":"寄全椒山中道士","author":"韦应物"},{"line":"山空松子落，□□应未眠。","answer":"幽人","title":"秋夜寄丘二十二员外","author":"韦应物"},{"line":"漠漠帆□□，冥冥鸟去迟。","answer":"来重","title":"赋得暮雨送李胄","author":"韦应物"},{"line":"女子今有行，大江□□舟。","answer":"溯轻","title":"送杨氏女","author":"韦应物"},{"line":"问客□□来，采山因买斧。","answer":"何为","title":"长安遇冯著","author":"韦应物"},{"line":"□浩风起波，冥冥日沈夕。","answer":"浩","title":"夕次盱眙县","author":"韦应物"},{"line":"杨柳散和风，青山□□虑。","answer":"澹吾","title":"东郊","author":"韦应物"},{"line":"春潮带雨晚来□，野渡无人舟自横。","answer":"急","title":"滁州西涧","author":"韦应物"},{"line":"忽闻□□调，归思欲沾巾。","answer":"歌苦","title":"和晋陵陆丞早春游望","author":"韦应物"},{"line":"登临出世界，磴道□□空。","answer":"盘虚","title":"与高适薛据慈恩寺浮图","author":"岑参"},{"line":"忽然一夜春风来，千树万树梨□□。","answer":"花开","title":"白雪歌送武判官归京","author":"岑参"},{"line":"羽书昨夜过渠黎，单于□□金山西。","answer":"已在","title":"轮台歌奉送封大夫出师西征","author":"岑参"},{"line":"一川碎石大如斗，随风□□石乱走。","answer":"满地","title":"走马川行奉送出师西征","author":"岑参"},{"line":"晓随□仗入，暮惹御香归。","answer":"天","title":"寄左省杜拾遗","author":"岑参"},{"line":"金阙晓钟开□□，玉阶仙仗拥千官。","answer":"万户","title":"奉和中书舍人贾至早朝大明宫","author":"岑参"},{"line":"马上相逢无纸笔，□□传语报平安。","answer":"凭君","title":"逢入京使","author":"岑参"},{"line":"□风对青冢，白日落梁州。","answer":"春","title":"书边事","author":"张乔"},{"line":"□□投筯不能食，拔劒四顾心茫然。","answer":"停杯","title":"行路难三首 一","author":"李白"},{"line":"羞逐长安社中儿，赤鸡□□赌梨栗。","answer":"白狗","title":"行路难三首 二","author":"李白"},{"line":"含光混世贵无名，何用孤高比□□。","answer":"云月","title":"行路难三首 三","author":"李白"},{"line":"卷帷□□空长叹，美人如花隔云端。","answer":"望月","title":"长相思","author":"李白"},{"line":"却下水晶帘，玲珑望□□。","answer":"秋月","title":"玉阶怨","author":"李白"},{"line":"当君怀归日，是妾断□□。","answer":"肠时","title":"春思","author":"李白"},{"line":"素手青条上，□□白日鲜。","answer":"红妆","title":"子夜吴歌 春歌","author":"李白"},{"line":"五月西施采，人看□□耶。","answer":"隘若","title":"子夜吴歌 夏歌","author":"李白"},{"line":"秋风吹□□，总是玉关情。","answer":"不尽","title":"子夜吴歌 秋歌","author":"李白"},{"line":"素手抽针冷，那堪□□刀。","answer":"把剪","title":"子夜吴歌 冬歌","author":"李白"},{"line":"□颜弃轩冕，白首卧松云。","answer":"红","title":"赠孟浩然","author":"李白"},{"line":"手持绿玉杖，朝别黄□□。","answer":"鹤楼","title":"庐山谣寄卢侍御虚舟","author":"李白"},{"line":"天台四万八千丈，对此□□东南倾。","answer":"欲倒","title":"梦游天姥吟留别","author":"李白"},{"line":"金陵子弟来相送，欲行□□各尽觞。","answer":"不行","title":"金陵酒肆留别","author":"李白"},{"line":"孤帆远影碧山尽，□□长江天际流。","answer":"唯见","title":"黄鹤楼送孟浩然之广陵","author":"李白"},{"line":"山随平野尽，江入大□□。","answer":"荒流","title":"渡荆门送别","author":"李白"},{"line":"此地一为别，孤蓬□□征。","answer":"万里","title":"送友人","author":"李白"},{"line":"蓬莱文章建□□，中间小谢又清发。","answer":"安骨","title":"宣州谢朓楼饯别校书叔云","author":"李白"},{"line":"却顾□□径，苍苍横翠微。","answer":"所来","title":"下终南山过斛斯山人宿置酒","author":"李白"},{"line":"吴宫花草埋幽径，晋代□□成古丘。","answer":"衣冠","title":"登金陵凤凰台","author":"李白"},{"line":"两岸猨声啼不尽，轻舟□□万重山。","answer":"已过","title":"早发白帝城","author":"李白"},{"line":"登舟望秋□，空忆谢将军。","answer":"月","title":"夜泊牛渚怀古","author":"李白"},{"line":"□杯邀明月，对影成三人。","answer":"举","title":"月下独酌四首 一","author":"李白"},{"line":"为我一挥手，如听万□□。","answer":"壑松","title":"听蜀僧濬弹琴","author":"李白"},{"line":"但见泪痕湿，□□心恨谁。","answer":"不知","title":"怨情","author":"李白"},{"line":"浮云一□□，流水十年间。","answer":"别后","title":"淮上喜会梁川故人","author":"韦应物"},{"line":"海上风雨至，逍遥池□□。","answer":"阁凉","title":"郡斋雨中与诸文士燕集","author":"韦应物"},{"line":"归棹洛阳人，残钟□□树。","answer":"广陵","title":"初发扬子寄元大校书","author":"韦应物"},{"line":"男儿本自重横行，□□非常赐颜色。","answer":"天子","title":"相和歌辞 燕歌行","author":"高适"},{"line":"行人刁斗风砂暗，公主□□幽怨多。","answer":"琵琶","title":"相和歌辞 从军行","author":"李颀"},{"line":"黄鹤之飞尚不得，猨猱□□愁攀缘。","answer":"欲度","title":"相和歌辞 蜀道难","author":"李白"},{"line":"玉颜□□寒鵶色，犹带昭阳日影来。","answer":"不及","title":"相和歌辞 长信怨 二","author":"王昌龄"},{"line":"黄门飞鞚不动尘，御厨□□送八珍。","answer":"丝络","title":"杂曲歌辞 丽人行","author":"杜甫"},{"line":"□□初停凤凰柱，蜀琴欲奏鸳鸯弦。","answer":"赵瑟","title":"杂曲歌辞 长相思三首 二","author":"李白"},{"line":"欲渡黄河冰塞川，将登□□雪暗天。","answer":"太行","title":"杂曲歌辞 行路难三首 一","author":"李白"},{"line":"昭王白骨萦蔓□，谁人更扫黄金台。","answer":"草","title":"杂曲歌辞 行路难三首 二","author":"李白"},{"line":"吴中张翰称达士，秋风□□江东行。","answer":"忽忆","title":"杂曲歌辞 行路难三首 三","author":"李白"},{"line":"□□长干人，生小不相识。","answer":"同是","title":"杂曲歌辞 长干曲四首 二","author":"崔颢"},{"line":"郎骑竹马来，遶床弄□□。","answer":"青梅","title":"杂曲歌辞 长干行二首 一","author":"李白"},{"line":"九月寒砧催下叶，十年□□忆辽阳。","answer":"征戍","title":"杂曲歌辞 独不见","author":"沈佺期"},{"line":"□问元戎窦车骑，何时反斾勒燕然。","answer":"为","title":"春思","author":"皇甫冉"},{"line":"今夜偏知春气暖，虫声□□绿窗纱。","answer":"新透","title":"夜月","author":"刘方平"},{"line":"寂寞空庭春欲晚，梨花□□不开门。","answer":"满地","title":"春怨","author":"刘方平"},{"line":"羌笛何须怨杨柳，春光□□玉门关。","answer":"不度","title":"凉州词二首 一","author":"王之涣"},{"line":"时有落花至，□□流水香。","answer":"远随","title":"阙题","author":"刘眘虚"},{"line":"三春白雪归青冢，万里□□遶黑山。","answer":"黄河","title":"征怨","author":"柳中庸"},{"line":"揜泣空相向，风尘□□期。","answer":"何所","title":"送李端","author":"严维"},{"line":"月殿影开闻夜漏，□□帘卷近银河。","answer":"水精","title":"宫词五首 二","author":"顾况"},{"line":"露重□□进，风多响易沈。","answer":"飞难","title":"在岳咏蝉","author":"骆宾王"},{"line":"今看两楹奠，□□梦时同。","answer":"当与","title":"经邹鲁祭孔子而叹之","author":"明皇帝"},{"line":"人生得意须尽□，莫使金尊空对月。","answer":"欢","title":"鼓吹曲辞 将进酒","author":"李白"},{"line":"汉下白登道，胡窥青□□。","answer":"海湾","title":"横吹曲辞 关山月","author":"李白"},{"line":"沧海□明珠有泪，蓝田日暖玉生烟。","answer":"月","title":"锦瑟","author":"李商隐"},{"line":"薄宦□犹泛，故园芜已平。","answer":"梗","title":"蝉","author":"李商隐"},{"line":"不据山河据平地，□□利矛日可麾。","answer":"长戈","title":"韩碑","author":"李商隐"},{"line":"□□遭薄俗，旧好隔良缘。","answer":"新知","title":"风雨","author":"李商隐"},{"line":"于今□□无萤火，终古垂杨有暮鸦。","answer":"腐草","title":"隋宫","author":"李商隐"},{"line":"管乐□才终不忝，关张无命欲何如。","answer":"有","title":"筹笔驿","author":"李商隐"},{"line":"隔座送钩春酒暖，□□射复蜡灯红。","answer":"分曹","title":"无题二首 一","author":"李商隐"},{"line":"蜡照半笼金□□，麝熏微度绣芙蓉。","answer":"翡翠","title":"无题四首 一","author":"李商隐"},{"line":"贾氏□帘韩掾少，宓妃留枕魏王才。","answer":"窥","title":"无题四首 二","author":"李商隐"},{"line":"肠断未忍扫，眼穿□□归。","answer":"仍欲","title":"落花","author":"李商隐"},{"line":"晓镜但愁云鬓改，夜吟应觉月□□。","answer":"光寒","title":"无题","author":"李商隐"},{"line":"远路□悲春晼晚，残宵犹得梦依稀。","answer":"应","title":"春雨","author":"李商隐"},{"line":"曾是寂寥金□□，断无消息石榴红。","answer":"烬暗","title":"无题二首 一","author":"李商隐"},{"line":"风波不信菱□□，月露谁教桂叶香。","answer":"枝弱","title":"无题二首 二","author":"李商隐"},{"line":"北斗兼春远，南陵寓□□。","answer":"使迟","title":"凉思","author":"李商隐"},{"line":"独敲初夜磬，闲倚□□藤。","answer":"一枝","title":"北青萝","author":"李商隐"},{"line":"芳草已云暮，故人□□来。","answer":"殊未","title":"章台夜思","author":"韦庄"},{"line":"云髻罢梳还对镜，罗衣□□更添香。","answer":"欲换","title":"宫词","author":"薛逢"},{"line":"广泽生明□，苍山夹乱流。","answer":"月","title":"楚江怀古三首 一","author":"马戴"},{"line":"空园白露滴，□□野僧隣。","answer":"孤壁","title":"灞上秋居","author":"马戴"},{"line":"无人收□□，归马识残旗。","answer":"废帐","title":"没蕃故人","author":"张籍"},{"line":"野蔬充膳甘长藿，落叶添薪仰□□。","answer":"古槐","title":"遣悲怀三首 一","author":"元稹"},{"line":"□□旧情怜婢仆，也曾因梦送钱财。","answer":"尚想","title":"遣悲怀三首 二","author":"元稹"},{"line":"同穴窅冥何所望，他生□□更难期。","answer":"缘会","title":"遣悲怀三首 三","author":"元稹"},{"line":"少妇今春意，良人□□情。","answer":"昨夜","title":"杂诗三首 三","author":"沈佺期"},{"line":"白狼河北音书断，丹凤城南秋□□。","answer":"夜长","title":"古意呈补阙乔知之","author":"沈佺期"},{"line":"海日生□□，江春入旧年。","answer":"残夜","title":"次北固山下","author":"王湾"},{"line":"但去□复问，白云无尽时。","answer":"莫","title":"送别","author":"王维"},{"line":"既至君门远，孰云□□非。","answer":"吾道","title":"送綦毋潜落第还乡","author":"王维"},{"line":"□喧乱石中，色静深松里。","answer":"声","title":"青谿","author":"王维"},{"line":"雉雊麦苗秀，蚕眠桑□□。","answer":"叶稀","title":"渭川田家","author":"王维"},{"line":"贱日□□众，贵来方悟稀。","answer":"岂殊","title":"西施咏","author":"王维"},{"line":"一身转战三千里，一劒曾当百□□。","answer":"万师","title":"老将行","author":"王维"},{"line":"□口潜行始隈隩，山开旷望旋平陆。","answer":"山","title":"桃源行","author":"王维"},{"line":"画阁朱楼尽□□，红桃绿柳垂簷向。","answer":"相望","title":"洛阳女儿行","author":"王维"},{"line":"渡头余落日，墟里□□烟。","answer":"上孤","title":"辋川闲居赠裴秀才迪","author":"王维"},{"line":"松风吹解带，山月□□琴。","answer":"照弹","title":"酬张少府","author":"王维"},{"line":"汉女输橦布，巴人□□田。","answer":"讼芋","title":"送梓州李使君","author":"王维"},{"line":"僧言古壁佛□□，以火来照所见稀。","answer":"画好","title":"山石","author":"韩愈"},{"line":"君歌□酸辞且苦，不能听终泪如雨。","answer":"声","title":"八月十五夜赠张功曹","author":"韩愈"},{"line":"喷云泄雾藏半腹，□□绝顶谁能穷。","answer":"虽有","title":"谒衡岳庙遂宿岳寺题门楼","author":"韩愈"},{"line":"风暖鸟声碎，日高花□□。","answer":"影重","title":"春宫怨","author":"杜荀鹤"},{"line":"远梦归侵晓，家书到□□。","answer":"隔年","title":"旅宿","author":"杜牧"},{"line":"高树□还密，远山晴更多。","answer":"晓","title":"早秋三首 一","author":"许浑"},{"line":"树色随山迥，河声□□遥。","answer":"入海","title":"秋日赴阙题潼关驿楼","author":"许浑"},{"line":"别来沧□□，语罢暮天钟。","answer":"海事","title":"喜见外弟又言别","author":"李益"},{"line":"晓月过残□，繁星宿故关。","answer":"垒","title":"贼平后送人北归","author":"司空曙"},{"line":"□□寒照雨，湿竹暗浮烟。","answer":"孤灯","title":"云阳馆与韩绅宿别","author":"司空曙"},{"line":"以我独沈久，愧君□□频。","answer":"相见","title":"喜外弟卢纶见宿","author":"司空曙"},{"line":"岭猨同旦暮，江柳□□烟。","answer":"共风","title":"新年作","author":"刘长卿"},{"line":"夕阳□□垒，寒磬满空林。","answer":"依旧","title":"秋日登吴公台上寺远眺寺即陈将吴明彻战场","author":"刘长卿"},{"line":"□□看松色，随山到水源。","answer":"过雨","title":"寻南溪常山道人隐居","author":"刘长卿"},{"line":"长江一帆远，□□五湖春。","answer":"落日","title":"饯别王十一南游","author":"刘长卿"},{"line":"寄身且喜沧洲近，顾影无如白□□。","answer":"发何","title":"江州重别薛六柳八二员外","author":"刘长卿"},{"line":"汉文有道恩犹□，湘水无情吊岂知。","answer":"薄","title":"长沙过贾谊宅","author":"刘长卿"},{"line":"贾谊上书忧汉室，□□谪去古今怜。","answer":"长沙","title":"自夏口至鹦鹉洲夕望岳阳寄源中丞","author":"刘长卿"},{"line":"为问元戎窦车骑，何时返斾勒□□。","answer":"燕然","title":"赋得","author":"刘长卿"},{"line":"□□令尹谁能识，河上仙翁去不回。","answer":"关门","title":"九日登望仙台呈刘明府容","author":"崔曙"},{"line":"愁因薄暮起，兴是清□□。","answer":"秋发","title":"秋登兰山寄张五","author":"孟浩然"},{"line":"荷风送香气，竹露滴□□。","answer":"清响","title":"夏日南亭怀辛大","author":"孟浩然"},{"line":"□□归欲尽，烟鸟栖初定。","answer":"樵人","title":"宿业师山房期丁大不至","author":"孟浩然"},{"line":"鹿门月照开烟树，□□庞公栖隐处。","answer":"忽到","title":"夜归鹿门山歌","author":"孟浩然"},{"line":"欲济无舟楫，端居耻□□。","answer":"圣明","title":"望洞庭湖赠张丞相","author":"孟浩然"},{"line":"黄金然桂尽，□□逐年衰。","answer":"壮志","title":"秦中感秋寄远上人","author":"孟浩然"},{"line":"建德非□□，维扬忆旧游。","answer":"吾土","title":"宿桐庐江寄广陵旧游","author":"孟浩然"},{"line":"乡泪客中□，孤帆天际看。","answer":"尽","title":"早寒江上有怀","author":"孟浩然"},{"line":"□□谁相假，知音世所稀。","answer":"当路","title":"留别王侍御维","author":"孟浩然"},{"line":"丹灶□□火，仙桃正落花。","answer":"初开","title":"清明日宴梅道士房","author":"孟浩然"},{"line":"水落鱼梁浅，天寒□□深。","answer":"梦泽","title":"与诸子登岘山","author":"孟浩然"},{"line":"开筵面场圃，把酒话□□。","answer":"桑麻","title":"过故人庄","author":"孟浩然"},{"line":"白发催年老，青阳□□除。","answer":"逼岁","title":"岁暮归南山","author":"孟浩然"},{"line":"□□骨肉远，转于奴仆亲。","answer":"渐与","title":"岁除夜有怀","author":"孟浩然"},{"line":"西当太白有鸟道，可以横绝峨□□。","answer":"眉巅","title":"蜀道难","author":"李白"},{"line":"陈王昔时宴平乐，□□十千恣讙谑。","answer":"斗酒","title":"将进酒","author":"李白"},{"line":"风枝惊暗□，露草覆寒蛩。","answer":"鹊","title":"客夜与故人偶集","author":"戴叔伦"},{"line":"三湘衰鬓逢秋色，万里□□对月明。","answer":"归心","title":"晚次鄂州","author":"卢纶"},{"line":"少孤为客早，多难识□□。","answer":"君迟","title":"李端公","author":"卢纶"},{"line":"泉声咽□□，日色冷青松。","answer":"危石","title":"过香积寺","author":"王维"},{"line":"竹喧□□女，莲动下渔舟。","answer":"归浣","title":"山居秋暝","author":"王维"},{"line":"□到水穷处，坐看云起时。","answer":"行","title":"终南别业","author":"王维"},{"line":"荒城临古渡，落日□□山。","answer":"满秋","title":"归嵩山作","author":"王维"},{"line":"分野中峰变，□□众壑殊。","answer":"阴晴","title":"终南山","author":"王维"},{"line":"郡邑□□浦，波澜动远空。","answer":"浮前","title":"汉江临泛","author":"王维"},{"line":"云里□□双凤阙，雨中春树万人家。","answer":"帝城","title":"奉和圣制从蓬莱向兴庆阁道中留春雨中春望之作应制","author":"王维"},{"line":"日色才临仙□□，香烟欲傍衮龙浮。","answer":"掌动","title":"和贾舍人早朝大明宫之作","author":"王维"},{"line":"晨摇玉佩趋金殿，□□天书拜琐闱。","answer":"夕奉","title":"酬郭给事","author":"王维"},{"line":"山中习静观朝槿，松下清斋折□□。","answer":"露葵","title":"积雨辋川庄作","author":"王维"},{"line":"差池不相见，黾勉空□□。","answer":"仰止","title":"寻西山隐者不遇","author":"丘为"},{"line":"晴川历历汉□□，春草萋萋鹦鹉洲。","answer":"阳树","title":"黄鹤楼","author":"崔颢"},{"line":"河山北枕秦关□，驿树西连汉畤平。","answer":"险","title":"行经华阴","author":"崔颢"},{"line":"沙场烽火连□□，海畔云山拥蓟城。","answer":"胡月","title":"望蓟门","author":"祖咏"},{"line":"野云万里无城郭，□□纷纷连大漠。","answer":"雨雪","title":"古从军行","author":"李颀"},{"line":"一声已动物□□，四座无言星欲稀。","answer":"皆静","title":"琴歌","author":"李颀"},{"line":"陈侯□□何坦荡，虬须虎眉仍大颡。","answer":"立身","title":"送陈章甫","author":"李颀"},{"line":"□□闻者多叹息，远客思乡皆泪垂。","answer":"傍邻","title":"听安万善吹觱篥歌","author":"李颀"},{"line":"杀人莫□□，须如猬毛磔。","answer":"敢前","title":"古意","author":"李颀"},{"line":"古戍苍苍烽火寒，大荒□□飞雪白。","answer":"沈沈","title":"听董大弹胡笳声兼寄语弄房给事","author":"李颀"},{"line":"□□树色催寒近，御苑砧声向晚多。","answer":"关城","title":"送魏万之京","author":"李颀"},{"line":"际夜转西壑，隔山□□斗。","answer":"望南","title":"春泛若耶溪","author":"綦毋潜"},{"line":"从来幽幷□，皆共尘沙老。","answer":"客","title":"塞下曲四首 一","author":"王昌龄"},{"line":"昔日长城战，咸言□□高。","answer":"意气","title":"塞下曲四首 二","author":"王昌龄"},{"line":"苒苒□盈虚，澄澄变今古。","answer":"几","title":"同从弟销南斋玩月忆山阴崔少府","author":"王昌龄"},{"line":"茅亭宿□□，药院滋苔纹。","answer":"花影","title":"宿王昌龄隐居","author":"常建"},{"line":"□生丽质难自弃，一朝选在君王侧。","answer":"天","title":"长恨歌","author":"白居易"},{"line":"醉不成欢惨将别，别时茫茫江□□。","answer":"浸月","title":"琵琶引","author":"白居易"},{"line":"远芳侵古道，晴翠□□城。","answer":"接荒","title":"赋得古原草送别","author":"白居易"},{"line":"吊影分为千里鴈，辞根□□九秋蓬。","answer":"散作","title":"自河南经乱关内阻饥兄弟离散各在一处因望月有感聊书所怀寄上浮梁大兄於潜七兄乌江十五兄兼示符离及下邽弟妹","author":"白居易"},{"line":"数丛沙草群□□，万顷江田一鹭飞。","answer":"鸥散","title":"利州南渡","author":"温庭筠"},{"line":"□上几人在，天涯孤櫂还。","answer":"江","title":"送人东游","author":"温庭筠"},{"line":"□□楼台非甲帐，去时冠劒是丁年。","answer":"廻日","title":"苏武庙","author":"温庭筠"},{"line":"敢将十指夸偏巧，不把□□鬬画长。","answer":"双眉","title":"贫女","author":"秦韬玉"},{"line":"□□低暗度，关月冷遥随。","answer":"渚云","title":"孤鴈 二","author":"崔涂"},{"line":"渐与骨肉远，转于□□亲。","answer":"僮仆","title":"巴山道中除夜书怀","author":"崔涂"},{"line":"周纲陵迟四□□，宣王愤起挥天戈。","answer":"海沸","title":"石鼓歌","author":"韩愈"},{"line":"真源了□□，妄迹世所逐。","answer":"无取","title":"晨诣超师院读禅经","author":"柳宗元"},{"line":"岭树重遮千里目，□□曲似九廻肠。","answer":"江流","title":"登柳州城楼寄漳汀封连四州","author":"柳宗元"},{"line":"晓耕翻□□，夜榜响溪石。","answer":"露草","title":"溪居","author":"柳宗元"},{"line":"得相能开国，生儿不□□。","answer":"象贤","title":"蜀先主庙","author":"刘禹锡"},{"line":"香雾云□□，清辉玉臂寒。","answer":"鬟湿","title":"月夜","author":"杜甫"},{"line":"烽火连三月，□□抵万金。","answer":"家书","title":"春望","author":"杜甫"},{"line":"不寝□□钥，因风想玉珂。","answer":"听金","title":"春宿左省","author":"杜甫"},{"line":"近得归京邑，□□岂至尊。","answer":"移官","title":"至德二载甫自京金光门出问道归凤翔乾元初从左拾遗移华州掾与亲故别因出此门有悲往事","author":"杜甫"},{"line":"有弟皆分散，无家问□□。","answer":"死生","title":"月夜忆舍弟","author":"杜甫"},{"line":"文章憎命达，□□喜人过。","answer":"魑魅","title":"天末忆李白","author":"杜甫"},{"line":"三顾频烦天下计，两朝□□老臣心。","answer":"开济","title":"蜀相","author":"杜甫"},{"line":"盘餐市远无兼味，□□家贫只旧醅。","answer":"樽酒","title":"客至","author":"杜甫"},{"line":"□□迟暮供多病，未有涓埃荅圣朝。","answer":"唯将","title":"野望","author":"杜甫"},{"line":"列郡讴□□，三朝出入荣。","answer":"歌惜","title":"奉济驿重送严公四韵","author":"杜甫"},{"line":"□□放歌须纵酒，青春作伴好还乡。","answer":"白日","title":"闻官军收河南河北","author":"杜甫"},{"line":"万里悲秋常作客，百年多病独□□。","answer":"登台","title":"登高","author":"杜甫"},{"line":"对碁□谢傅，把劒觅徐君。","answer":"陪","title":"别房太尉墓","author":"杜甫"},{"line":"□极朝廷终不改，西山寇盗莫相侵。","answer":"北","title":"登楼","author":"杜甫"},{"line":"风尘荏苒音书绝，关塞□□行路难。","answer":"萧条","title":"宿府","author":"杜甫"},{"line":"名岂文章著，□□老病休。","answer":"官因","title":"旅夜书怀","author":"杜甫"},{"line":"野哭几家闻战伐，夷歌数处起□□。","answer":"渔樵","title":"阁夜","author":"杜甫"},{"line":"□□事主终无赖，词客衰时且未还。","answer":"羯胡","title":"咏怀古迹五首 一","author":"杜甫"},{"line":"江山故宅空文藻，云雨□□岂梦思。","answer":"荒台","title":"咏怀古迹五首 二","author":"杜甫"},{"line":"画图□识春风面，环佩空归月夜魂。","answer":"省","title":"咏怀古迹五首 三","author":"杜甫"},{"line":"古庙杉松巢水鹤，□□伏腊走村翁。","answer":"岁时","title":"咏怀古迹五首 四","author":"杜甫"},{"line":"伯仲之间见伊吕，指挥若定失□□。","answer":"萧曹","title":"咏怀古迹五首 五","author":"杜甫"},{"line":"亲朋无□□，老病有孤舟。","answer":"一字","title":"登岳阳楼","author":"杜甫"},{"line":"灭烛怜光满，披衣□□滋。","answer":"觉露","title":"望月怀远","author":"张九龄"},{"line":"明朝望乡□，应见陇头梅。","answer":"处","title":"题大庾岭北驿","author":"宋之问"},{"line":"□内存知己，天涯若比隣。","answer":"海","title":"杜少府之任蜀州","author":"王勃"},{"line":"淑气催□□，晴光转绿苹。","answer":"黄鸟","title":"和晋陵陆丞早春游望","author":"杜审言"},{"line":"青枫江上秋天远，□□城边古木疎。","answer":"白帝","title":"送李少府贬峡中王少府贬长沙","author":"高适"},{"line":"荡胷生曾□，决眦入归鸟。","answer":"云","title":"望岳","author":"杜甫"},{"line":"道傍过者问行人，行人但云点□□。","answer":"行频","title":"兵车行","author":"杜甫"},{"line":"少壮能几时，鬓发各□□。","answer":"已苍","title":"赠卫八处士","author":"杜甫"},{"line":"绣罗衣裳照暮春，蹙金孔雀银□□。","answer":"麒麟","title":"丽人行","author":"杜甫"},{"line":"忆昔霓旌下□□，苑中万物生颜色。","answer":"南苑","title":"哀江头","author":"杜甫"},{"line":"金鞭□□九马死，骨肉不待同驰驱。","answer":"断折","title":"哀王孙","author":"杜甫"},{"line":"关中昔□□，兄弟遭杀戮。","answer":"丧败","title":"佳人","author":"杜甫"},{"line":"故人入我梦，明我□□忆。","answer":"长相","title":"梦李白二首 一","author":"杜甫"},{"line":"告归常局促，□□来不易。","answer":"苦道","title":"梦李白二首 二","author":"杜甫"},{"line":"曾貌□□照夜白，龙池十日飞霹雳。","answer":"先帝","title":"韦讽录事宅观曹将军画马图","author":"杜甫"},{"line":"□□初学卫夫人，但恨无过王右军。","answer":"学书","title":"丹青引赠曹将军霸","author":"杜甫"},{"line":"鸿飞□□日月白，青枫叶赤天雨霜。","answer":"冥冥","title":"寄韩谏议","author":"杜甫"},{"line":"君臣已与时际会，树木□□人爱惜。","answer":"犹为","title":"古柏行","author":"杜甫"},{"line":"□如雷霆收震怒，罢如江海凝清光。","answer":"来","title":"观公孙大娘弟子舞劒器行","author":"杜甫"},{"line":"谁知林栖者，闻风□□悦。","answer":"坐相","title":"感遇十二首 一","author":"张九龄"},{"line":"日夕□□意，人谁感至精。","answer":"怀空","title":"感遇十二首 二","author":"张九龄"},{"line":"矫矫珍木巅，得无金□□。","answer":"丸惧","title":"感遇十二首 四","author":"张九龄"},{"line":"□以荐嘉客，奈何阻重深。","answer":"可","title":"感遇十二首 七","author":"张九龄"},{"line":"扣门无犬吠，□□问西家。","answer":"欲去","title":"寻陆鸿渐不遇","author":"皎然"},{"line":"人世几回伤往□，山形依旧枕江流。","answer":"事","title":"西塞山怀古","author":"刘禹锡"},{"line":"波澜誓不起，□□井中水。","answer":"妾心","title":"列女操","author":"孟郊"},{"line":"谁言寸□□，报得三春晖。","answer":"草心","title":"游子吟","author":"孟郊"},{"line":"闲鹭栖常早，□□落更迟。","answer":"秋花","title":"谷口书斋寄杨补阙","author":"钱起"},{"line":"□月通禅观，鱼龙听梵声。","answer":"水","title":"送僧归日本","author":"钱起"},{"line":"阳和不散穷途恨，霄汉□□捧日新。","answer":"长怀","title":"赠阙下裴舍人","author":"钱起"},{"line":"□然遭世变，数岁亲戎旃。","answer":"忽","title":"贼退示官吏","author":"元结"},{"line":"□候看应晚，心期卧亦赊。","answer":"节","title":"酬程延秋夜即事见赠","author":"韩翃"},{"line":"疎松影落空□□，细草香闲小洞幽。","answer":"坛静","title":"同题仙游观","author":"韩翃"},{"line":"□□疾病思田里，邑有流亡愧俸钱。","answer":"身多","title":"寄李儋元锡","author":"韦应物"},{"line":"欲持一瓢酒，□□风雨夕。","answer":"远慰","title":"寄全椒山中道士","author":"韦应物"},{"line":"海门深不见，□□远含滋。","answer":"浦树","title":"赋得暮雨送李胄","author":"韦应物"},{"line":"尔辈况无恃，抚念益□□。","answer":"慈柔","title":"送杨氏女","author":"韦应物"},{"line":"冥冥□正开，飏飏燕新乳。","answer":"花","title":"长安遇冯著","author":"韦应物"},{"line":"人归山郭暗，雁下芦□□。","answer":"洲白","title":"夕次盱眙县","author":"韦应物"},{"line":"依丛适自憩，缘涧□□去。","answer":"还复","title":"东郊","author":"韦应物"},{"line":"突兀□□州，峥嵘如鬼工。","answer":"压神","title":"与高适薛据慈恩寺浮图","author":"岑参"},{"line":"散入珠帘湿罗幕，狐裘不煖锦□□。","answer":"衾薄","title":"白雪歌送武判官归京","author":"岑参"},{"line":"戍楼西望烟尘黑，汉兵屯在轮□□。","answer":"台北","title":"轮台歌奉送封大夫出师西征","author":"岑参"},{"line":"□奴草黄马正肥，金山西见烟尘飞。","answer":"匈","title":"走马川行奉送出师西征","author":"岑参"},{"line":"白发□花落，青云羡鸟飞。","answer":"悲","title":"寄左省杜拾遗","author":"岑参"},{"line":"花迎劒珮星初落，□□旌旗露未干。","answer":"柳拂","title":"奉和中书舍人贾至早朝大明宫","author":"岑参"},{"line":"大汉无兵阻，□□有客游。","answer":"穷边","title":"书边事","author":"张乔"},{"line":"欲渡□河冰塞川，将登太行雪满山。","answer":"黄","title":"行路难三首 一","author":"李白"},{"line":"弹劒作歌奏苦声，□□王门不称情。","answer":"曳裾","title":"行路难三首 二","author":"李白"},{"line":"吾观自古贤达人，□□不退皆殒身。","answer":"功成","title":"行路难三首 三","author":"李白"},{"line":"上有□□之长天，下有渌水之波澜。","answer":"青冥","title":"长相思","author":"李白"},{"line":"春风不相识，何事□□帏。","answer":"入罗","title":"春思","author":"李白"},{"line":"蚕饥妾欲去，五马莫□□。","answer":"留连","title":"子夜吴歌 春歌","author":"李白"},{"line":"□□不待月，归去越王家。","answer":"回舟","title":"子夜吴歌 夏歌","author":"李白"},{"line":"何日□胡虏，良人罢远征。","answer":"平","title":"子夜吴歌 秋歌","author":"李白"},{"line":"□缝寄远道，几日到临洮。","answer":"裁","title":"子夜吴歌 冬歌","author":"李白"},{"line":"醉月□□圣，迷花不事君。","answer":"频中","title":"赠孟浩然","author":"李白"},{"line":"五岳寻仙不辞远，一生□□名山游。","answer":"好入","title":"庐山谣寄卢侍御虚舟","author":"李白"},{"line":"我欲因之梦吴□，一夜飞度镜湖月。","answer":"越","title":"梦游天姥吟留别","author":"李白"},{"line":"请君试问东流水，别意□□谁短长。","answer":"与之","title":"金陵酒肆留别","author":"李白"},{"line":"月下□天镜，云生结海楼。","answer":"飞","title":"渡荆门送别","author":"李白"},{"line":"浮云游子意，□□故人情。","answer":"落日","title":"送友人","author":"李白"},{"line":"俱怀□□壮思飞，欲上青天览日月。","answer":"逸兴","title":"宣州谢朓楼饯别校书叔云","author":"李白"},{"line":"相携及田家，□□开荆扉。","answer":"童稚","title":"下终南山过斛斯山人宿置酒","author":"李白"},{"line":"三山半落青天外，□□中分白鹭洲。","answer":"二水","title":"登金陵凤凰台","author":"李白"},{"line":"余亦□高咏，斯人不可闻。","answer":"能","title":"夜泊牛渚怀古","author":"李白"},{"line":"月既不解饮，□□随我身。","answer":"影徒","title":"月下独酌四首 一","author":"李白"},{"line":"客心□□水，余响入霜钟。","answer":"洗流","title":"听蜀僧濬弹琴","author":"李白"},{"line":"欢笑情如□，萧疎鬓已斑。","answer":"旧","title":"淮上喜会梁川故人","author":"韦应物"},{"line":"□疴近消散，嘉宾复满堂。","answer":"烦","title":"郡斋雨中与诸文士燕集","author":"韦应物"},{"line":"今朝此为别，何处还□□。","answer":"相遇","title":"初发扬子寄元大校书","author":"韦应物"},{"line":"校尉羽书飞瀚□，单于猎火照狼山。","answer":"海","title":"相和歌辞 燕歌行","author":"高适"},{"line":"野营万里无城郭，雨雪□□连大漠。","answer":"纷纷","title":"相和歌辞 从军行","author":"李颀"},{"line":"但见□鸟号枯木，雄飞呼雌绕林间。","answer":"悲","title":"相和歌辞 蜀道难","author":"李白"},{"line":"愿随春风寄□□，忆君迢迢隔青天。","answer":"燕然","title":"杂曲歌辞 长相思三首 二","author":"李白"},{"line":"□□垂钓坐溪上，忽复乘舟梦日边。","answer":"闲来","title":"杂曲歌辞 行路难三首 一","author":"李白"},{"line":"同居长干里，□□无嫌猜。","answer":"两小","title":"杂曲歌辞 长干行二首 一","author":"李白"},{"line":"谁知含愁独不见，使妾明月照□□。","answer":"流黄","title":"杂曲歌辞 独不见","author":"沈佺期"},{"line":"闲门向山□，深柳读书堂。","answer":"路","title":"阙题","author":"刘眘虚"},{"line":"无人信高洁，谁为□□心。","answer":"表予","title":"在岳咏蝉","author":"骆宾王"},{"line":"□□我材必有用，千金散尽还复来。","answer":"天生","title":"鼓吹曲辞 将进酒","author":"李白"},{"line":"由来□□地，不见有人还。","answer":"征战","title":"横吹曲辞 关山月","author":"李白"},{"line":"此情可待成追□，只是当时已惘然。","answer":"忆","title":"锦瑟","author":"李商隐"},{"line":"烦君最相警，我亦举□□。","answer":"家清","title":"蝉","author":"李商隐"},{"line":"□得圣相相曰度，贼斫不死神扶持。","answer":"帝","title":"韩碑","author":"李商隐"},{"line":"心断新丰酒，销愁斗□□。","answer":"几千","title":"风雨","author":"李商隐"},{"line":"地下若逢陈后主，岂宜□□后庭花。","answer":"重问","title":"隋宫","author":"李商隐"},{"line":"他年锦里经祠庙，梁父□□恨有余。","answer":"吟成","title":"筹笔驿","author":"李商隐"},{"line":"嗟余□鼓应官去，走马兰台类断蓬。","answer":"听","title":"无题二首 一","author":"李商隐"},{"line":"□□已恨蓬山远，更隔蓬山一万重。","answer":"刘郎","title":"无题四首 一","author":"李商隐"},{"line":"春心□□花争发，一寸相思一寸灰。","answer":"莫共","title":"无题四首 二","author":"李商隐"},{"line":"□心向春尽，所得是沾衣。","answer":"芳","title":"落花","author":"李商隐"},{"line":"蓬山此去无多□，青鸟殷勤为探看。","answer":"路","title":"无题","author":"李商隐"},{"line":"玉珰缄札何由达，万里□□一雁飞。","answer":"云罗","title":"春雨","author":"李商隐"},{"line":"□道相思了无益，未妨惆怅是清狂。","answer":"直","title":"无题二首 二","author":"李商隐"},{"line":"天涯占梦数，□□有新知。","answer":"疑误","title":"凉思","author":"李商隐"},{"line":"世界□□里，吾宁爱与憎。","answer":"微尘","title":"北青萝","author":"李商隐"},{"line":"乡书不可寄，□□又南回。","answer":"秋雁","title":"章台夜思","author":"韦庄"},{"line":"遥窥正殿帘开处，袍袴宫人扫□□。","answer":"御床","title":"宫词","author":"薛逢"},{"line":"云中君不降，竟夕自□□。","answer":"悲秋","title":"楚江怀古三首 一","author":"马戴"},{"line":"寄卧郊扉□，何门致此身。","answer":"久","title":"灞上秋居","author":"马戴"},{"line":"欲祭疑君在，天涯哭□□。","answer":"此时","title":"没蕃故人","author":"张籍"},{"line":"今日□钱过十万，与君营奠复营斋。","answer":"俸","title":"遣悲怀三首 一","author":"元稹"},{"line":"诚知此恨人□□，贫贱夫妻百事哀。","answer":"人有","title":"遣悲怀三首 二","author":"元稹"},{"line":"唯将终夜长开眼，报荅□□未展眉。","answer":"平生","title":"遣悲怀三首 三","author":"元稹"},{"line":"谁能□旗鼓，一为取龙城。","answer":"将","title":"杂诗三首 三","author":"沈佺期"},{"line":"□□含愁独不见，更教明月照流黄。","answer":"谁谓","title":"古意呈补阙乔知之","author":"沈佺期"},{"line":"乡书何□□，归雁洛阳边。","answer":"处达","title":"次北固山下","author":"王湾"},{"line":"江淮度寒食，京洛□□衣。","answer":"缝春","title":"送綦毋潜落第还乡","author":"王维"},{"line":"漾漾泛菱荇，□□映葭苇。","answer":"澄澄","title":"青谿","author":"王维"},{"line":"田夫荷锄至，□□语依依。","answer":"相见","title":"渭川田家","author":"王维"},{"line":"邀人□香粉，不自著罗衣。","answer":"傅","title":"西施咏","author":"王维"},{"line":"□兵奋迅如霹雳，虏骑崩腾畏蒺藜。","answer":"汉","title":"老将行","author":"王维"},{"line":"遥看一处攒云树，□□千家散花竹。","answer":"近入","title":"桃源行","author":"王维"},{"line":"罗帏送上七香车，□□迎归九华帐。","answer":"宝扇","title":"洛阳女儿行","author":"王维"},{"line":"复值接舆醉，□□五柳前。","answer":"狂歌","title":"辋川闲居赠裴秀才迪","author":"王维"},{"line":"君问穷通理，□□入浦深。","answer":"渔歌","title":"酬张少府","author":"王维"},{"line":"文翁翻教授，□□倚先贤。","answer":"不敢","title":"送梓州李使君","author":"王维"},{"line":"铺床拂席置羹饭，□□亦足饱我饥。","answer":"疎粝","title":"山石","author":"韩愈"},{"line":"□庭连天九疑高，蛟龙出没猩鼯号。","answer":"洞","title":"八月十五夜赠张功曹","author":"韩愈"},{"line":"我来正逢秋雨节，□□晦昧无清风。","answer":"阴气","title":"谒衡岳庙遂宿岳寺题门楼","author":"韩愈"},{"line":"年年越溪女，□□采芙蓉。","answer":"相忆","title":"春宫怨","author":"杜荀鹤"},{"line":"湘江好烟月，□□钓鱼船。","answer":"门系","title":"旅宿","author":"杜牧"},{"line":"□南一叶下，自觉老烟波。","answer":"淮","title":"早秋三首 一","author":"许浑"},{"line":"帝乡明日到，□□梦渔樵。","answer":"犹自","title":"秋日赴阙题潼关驿楼","author":"许浑"},{"line":"明日巴陵道，秋山□□重。","answer":"又几","title":"喜见外弟又言别","author":"李益"},{"line":"寒禽与衰草，处处伴□□。","answer":"愁颜","title":"贼平后送人北归","author":"司空曙"},{"line":"更有明朝恨，□□惜共传。","answer":"离杯","title":"云阳馆与韩绅宿别","author":"司空曙"},{"line":"平生自有分，□□蔡家亲。","answer":"况是","title":"喜外弟卢纶见宿","author":"司空曙"},{"line":"□□长沙傅，从今又几年。","answer":"已是","title":"新年作","author":"刘长卿"},{"line":"惆怅□朝事，长江独至今。","answer":"南","title":"秋日登吴公台上寺远眺寺即陈将吴明彻战场","author":"刘长卿"},{"line":"溪花与□□，相对亦忘言。","answer":"禅意","title":"寻南溪常山道人隐居","author":"刘长卿"},{"line":"谁见汀□□，相思愁白苹。","answer":"洲上","title":"饯别王十一南游","author":"刘长卿"},{"line":"□□龙钟人共弃，媿君犹遣慎风波。","answer":"今日","title":"江州重别薛六柳八二员外","author":"刘长卿"},{"line":"□寂江山摇落处，怜君何事到天涯。","answer":"寂","title":"长沙过贾谊宅","author":"刘长卿"},{"line":"且欲近寻彭泽宰，□□共醉菊花杯。","answer":"陶然","title":"九日登望仙台呈刘明府容","author":"崔曙"},{"line":"时见归村人，沙行□□歇。","answer":"渡头","title":"秋登兰山寄张五","author":"孟浩然"},{"line":"欲取鸣琴弹，恨无□□赏。","answer":"知音","title":"夏日南亭怀辛大","author":"孟浩然"},{"line":"之子期宿来，孤琴候□□。","answer":"萝迳","title":"宿业师山房期丁大不至","author":"孟浩然"},{"line":"岩扉松径长寂寥，□□幽人夜来去。","answer":"惟有","title":"夜归鹿门山歌","author":"孟浩然"},{"line":"坐观垂钓者，空有□□情。","answer":"羡鱼","title":"望洞庭湖赠张丞相","author":"孟浩然"},{"line":"□夕凉风至，闻蝉但益悲。","answer":"日","title":"秦中感秋寄远上人","author":"孟浩然"},{"line":"还将□□泪，遥寄海西头。","answer":"两行","title":"宿桐庐江寄广陵旧游","author":"孟浩然"},{"line":"迷津欲有问，□□夕漫漫。","answer":"平海","title":"早寒江上有怀","author":"孟浩然"},{"line":"秪应守索寞，还掩故□□。","answer":"园扉","title":"留别王侍御维","author":"孟浩然"},{"line":"童颜若可驻，何惜□□霞。","answer":"醉流","title":"清明日宴梅道士房","author":"孟浩然"},{"line":"羊公碑字在，□□泪沾襟。","answer":"读罢","title":"与诸子登岘山","author":"孟浩然"},{"line":"□□重阳日，还来就菊花。","answer":"待到","title":"过故人庄","author":"孟浩然"},{"line":"永怀愁不寐，松月夜□□。","answer":"窗虚","title":"岁暮归南山","author":"孟浩然"},{"line":"那堪正飘泊，□□岁华新。","answer":"来日","title":"岁除夜有怀","author":"孟浩然"},{"line":"□之飞尚不得过，猨猱欲度愁攀援。","answer":"鹤","title":"蜀道难","author":"李白"},{"line":"主人何为言少钱，□□沽取对君酌。","answer":"径须","title":"将进酒","author":"李白"},{"line":"羁旅长堪醉，相留畏□□。","answer":"晓钟","title":"客夜与故人偶集","author":"戴叔伦"},{"line":"旧业已随征战尽，更堪□□鼓鼙声。","answer":"江上","title":"晚次鄂州","author":"卢纶"},{"line":"□泪空相向，风尘何处期。","answer":"掩","title":"李端公","author":"卢纶"}]'), an = La, Ke = 15;
function ja() {
  const e = Array.from({ length: an.length }, (t, n) => n);
  for (let t = e.length - 1; t > 0; t--) {
    const n = t + 1, i = Math.floor(4294967296 / n) * n;
    let r;
    do
      r = crypto.getRandomValues(new Uint32Array(1))[0];
    while (r >= i);
    const l = r % n;
    [e[t], e[l]] = [e[l], e[t]];
  }
  return e.slice(0, Ke);
}
const Ua = { class: "poem-app" }, Va = { class: "poem-header" }, Ba = { class: "poem-room" }, Ka = {
  key: 0,
  class: "poem-error",
  role: "alert"
}, Wa = {
  key: 1,
  class: "poem-content"
}, qa = { class: "poem-question" }, Ja = { class: "poem-progress" }, Ga = {
  key: 0,
  class: "poem-writing"
}, Za = { class: "poem-pad" }, za = {
  key: 0,
  class: "poem-sealed"
}, Ya = {
  key: 1,
  class: "poem-pad-hint"
}, Xa = { class: "poem-actions" }, Qa = ["disabled"], eo = ["disabled"], to = ["disabled"], no = {
  key: 1,
  class: "poem-note"
}, io = { class: "poem-correct" }, ro = { class: "poem-answers" }, lo = { key: 1 }, so = {
  key: 2,
  class: "poem-opening"
}, ao = {
  key: 3,
  class: "poem-finished"
}, oo = { class: "poem-members" }, uo = {
  key: 4,
  role: "alert"
}, ho = {
  key: 2,
  class: "poem-opening"
}, co = /* @__PURE__ */ Sn({
  __name: "PoetryPage",
  setup(e) {
    const t = /* @__PURE__ */ jl(), n = /* @__PURE__ */ ne([]), i = /* @__PURE__ */ ne(), r = /* @__PURE__ */ ne(""), l = /* @__PURE__ */ ne(!1), a = /* @__PURE__ */ ne(""), o = /* @__PURE__ */ ne(""), h = /* @__PURE__ */ ne("/"), c = /* @__PURE__ */ ne(), f = /* @__PURE__ */ ne({}), d = /* @__PURE__ */ ne({}), M = /* @__PURE__ */ ne([]), S = /* @__PURE__ */ ne(!1), H = /* @__PURE__ */ ne(!1), R = /* @__PURE__ */ ne(Date.now()), I = /* @__PURE__ */ ne(), P = xe(() => [...n.value].sort((g, s) => g.id.localeCompare(s.id))[0]?.id), F = xe(() => P.value === i.value?.id), O = xe(() => c.value?.players.filter((g) => n.value.some((s) => s.id === g.id)) || []), T = xe(() => O.value.some((g) => g.id === i.value?.id)), U = xe(() => an[c.value?.question ?? 0]), ae = xe(() => O.value.filter((g) => f.value[g.id]).length), oe = xe(() => ((c.value?.number || 1) - 1) % Ke + 1), fe = xe(() => c.value?.phase === "results" && oe.value === Ke), at = xe(() => Math.max(0, Math.ceil(((c.value?.nextAt || 0) - R.value) / 1e3)));
    let we, Qe = 0, _t = 0, ot = 0, et = !1;
    const Ve = /* @__PURE__ */ new Map();
    function Y(g, s, u) {
      t.value?.send("poem-" + g, s, { ...u ? { target: u } : {}, reliability: "reliable" });
    }
    async function G(g) {
      const s = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(g)));
      return [...new Uint8Array(s)].map((u) => u.toString(16).padStart(2, "0")).join("");
    }
    function L(g) {
      c.value && Y("state", { round: c.value, commits: f.value }, g);
    }
    function ve(g = !1) {
      if (!F.value || !n.value.length || !g && fe.value) return;
      const s = (c.value?.number || 0) + 1, u = !c.value || g ? ja() : c.value.deck, w = (s - 1) % Ke;
      Ee({ id: crypto.randomUUID(), number: s, question: u[w], deck: u, players: [...n.value], phase: "writing", nextAt: 0 }, {}), L();
    }
    function yt() {
      fe.value && (F.value ? ve(!0) : Y("replay", { id: c.value.id }));
    }
    function Ee(g, s) {
      if (!(c.value && g.number < c.value.number) && !(c.value && g.number === c.value.number && g.id !== c.value.id)) {
        if (g.id !== c.value?.id)
          M.value = [], S.value = !1, we = void 0, d.value = {}, f.value = {}, Ve.clear();
        else {
          const u = { writing: 0, revealing: 1, results: 2 };
          if (u[g.phase] < u[c.value.phase]) return;
        }
        c.value = g, f.value = { ...f.value, ...s }, g.phase !== "writing" && (S.value = !0, ut());
      }
    }
    function _e(g) {
      const s = g.reduce((w, m) => w + m.length, 0), u = Math.max(1, Math.ceil(s / 1200));
      return g.map((w) => w.filter((m, p) => p === 0 || p === w.length - 1 || p % u === 0).map(([m, p]) => [+m.toFixed(3), +p.toFixed(3)]));
    }
    async function zt() {
      if (S.value || H.value || !T.value || c.value?.phase !== "writing" || !M.value.length) return;
      H.value = !0;
      const g = c.value.id;
      try {
        const s = { strokes: _e(M.value), nonce: crypto.randomUUID() }, u = await G(s);
        if (c.value?.id !== g || et) return;
        we = s, S.value = !0, f.value = { ...f.value, [i.value.id]: u }, Y("commit", { id: g, hash: u }), tt();
      } catch {
        o.value = "提交失败，请重试。";
      } finally {
        H.value = !1;
      }
    }
    async function ut(g) {
      if (!we || !c.value || c.value.phase === "writing") return;
      d.value = { ...d.value, [i.value.id]: we.strokes };
      const s = JSON.stringify(we), u = Math.ceil(s.length / 6e3);
      for (let w = 0; w < u; w++) Y("answer", { id: c.value.id, index: w, total: u, data: s.slice(w * 6e3, (w + 1) * 6e3) }, g);
      tt();
    }
    function tt() {
      !F.value || !c.value || !O.value.length || (c.value.phase === "writing" && O.value.every((g) => f.value[g.id]) ? (c.value = { ...c.value, phase: "revealing" }, L(), ut()) : c.value.phase === "revealing" && O.value.every((g) => d.value[g.id]) && (c.value = { ...c.value, phase: "results", nextAt: oe.value === Ke ? 0 : Date.now() + 5e3 }, L()));
    }
    function ht(g) {
      return g && typeof g.id == "string" && g.id.length < 100 && Number.isInteger(g.number) && g.number > 0 && Number.isInteger(g.question) && g.question >= 0 && g.question < an.length && Array.isArray(g.deck) && g.deck.length === Ke && new Set(g.deck).size === Ke && g.deck.every((s) => Number.isInteger(s) && s >= 0 && s < an.length) && g.question === g.deck[(g.number - 1) % Ke] && ["writing", "revealing", "results"].includes(g.phase) && Number.isFinite(g.nextAt) && Array.isArray(g.players) && g.players.length > 0 && g.players.length <= 4 && g.players.every((s) => typeof s.id == "string" && typeof s.name == "string") && new Set(g.players.map((s) => s.id)).size === g.players.length;
    }
    function bt(g) {
      return g && typeof g.nonce == "string" && g.nonce.length < 100 && Array.isArray(g.strokes) && g.strokes.length > 0 && g.strokes.length <= 80 && g.strokes.reduce((s, u) => s + (Array.isArray(u) ? u.length : 1e4), 0) <= 1600 && g.strokes.every((s) => Array.isArray(s) && s.length > 0 && s.every((u) => Array.isArray(u) && u.length === 2 && u.every((w) => typeof w == "number" && Number.isFinite(w) && w >= 0 && w <= 1)));
    }
    async function Et(g) {
      if (et || !n.value.some((u) => u.id === g.from)) return;
      const s = g.payload;
      if (g.kind === "poem-request") {
        L(g.from), S.value && c.value?.phase === "writing" && we ? Y("commit", { id: c.value.id, hash: f.value[i.value.id] }, g.from) : c.value?.phase !== "writing" && ut(g.from);
        return;
      }
      if (g.kind === "poem-state" && (g.from === P.value || !c.value) && ht(s?.round)) {
        const u = {};
        for (const [w, m] of Object.entries(s.commits || {})) typeof m == "string" && /^[a-f0-9]{64}$/.test(m) && (u[w] = m);
        Ee(s.round, u);
        return;
      }
      if (!(!c.value || s?.id !== c.value.id || !O.value.some((u) => u.id === g.from))) {
        if (g.kind === "poem-replay" && F.value && fe.value) {
          ve(!0);
          return;
        }
        if (g.kind === "poem-commit" && c.value.phase === "writing" && typeof s.hash == "string" && /^[a-f0-9]{64}$/.test(s.hash) && !f.value[g.from] && (f.value = { ...f.value, [g.from]: s.hash }, F.value && L(), tt()), g.kind === "poem-answer" && c.value.phase !== "writing" && typeof s.data == "string" && s.data.length <= 6e3 && Number.isInteger(s.total) && s.total > 0 && s.total <= 12 && Number.isInteger(s.index) && s.index >= 0 && s.index < s.total) {
          let u = Ve.get(g.from);
          if ((!u || u.parts.length !== s.total) && (u = { parts: new Array(s.total).fill(""), at: Date.now() }, Ve.set(g.from, u)), u.parts[s.index] = s.data, u.parts.every(Boolean)) {
            const w = c.value.id;
            try {
              const m = JSON.parse(u.parts.join(""));
              bt(m) && await G(m) === f.value[g.from] && c.value?.id === w && (d.value = { ...d.value, [g.from]: m.strokes }, tt());
            } catch {
            }
            Ve.delete(g.from);
          }
        }
      }
    }
    function Yt() {
      if (l.value) {
        R.value = Date.now();
        for (const [g, s] of Ve) Date.now() - s.at > 3e4 && Ve.delete(g);
        F.value && (!c.value && Date.now() - ot > 2500 && ve(), tt(), c.value?.phase === "results" && !fe.value && at.value === 0 && ve()), ++_t % 2 === 0 && (F.value ? L() : Y("request", {}), we && c.value && (c.value.phase === "writing" ? Y("commit", { id: c.value.id, hash: f.value[i.value.id] }) : ut()));
      }
    }
    async function ct() {
      try {
        await t.value?.leave();
      } finally {
        location.assign(h.value);
      }
    }
    return fi(async () => {
      try {
        if (!location.search.includes("room="))
          i.value = { id: "practice", name: "你", virtual_ip: "", endpoint: "" }, n.value = [i.value], l.value = !0, ve();
        else {
          const g = ll.fromLocation();
          if (g.gameId !== "gamelink-poetry") throw Error("这不是诗词大会房间。");
          t.value = g, h.value = g.serverUrl + "/", g.on("members", (u) => {
            n.value = u, tt();
          }), g.on("message", (u) => {
            Et(u);
          }), g.on("peer-ready", (u) => {
            Y("request", {}, u.peerId), F.value && L(u.peerId), c.value?.phase !== "writing" && ut(u.peerId);
          }), g.on("error", (u) => a.value = u.message), g.on("room-closed", () => {
            l.value = !1, a.value = "房间已关闭，请返回大厅。";
          });
          const s = await g.joinFromLocation();
          if (et) {
            g.dispose();
            return;
          }
          i.value = s.self_member, n.value = s.room.members, r.value = s.room.code, l.value = !0, ot = Date.now(), Y("request", {});
        }
        Qe = window.setInterval(Yt, 500);
      } catch (g) {
        a.value = g instanceof Error ? g.message : String(g);
      }
    }), wi(() => {
      et = !0, clearInterval(Qe), t.value?.dispose();
    }), (g, s) => (K(), X("main", Ua, [
      D("header", Va, [
        s[4] || (s[4] = D("a", {
          href: "/",
          class: "poem-brand"
        }, [
          D("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "1.6",
            "aria-hidden": "true"
          }, [
            D("path", { d: "M5 3h14v18H5zM9 7h6M9 11h6m-6 4h4" })
          ]),
          D("b", null, "诗词大会")
        ], -1)),
        D("span", Ba, Q(r.value || "单人练习") + " · " + Q(n.value.length) + " 人", 1),
        r.value ? (K(), ln($a, {
          key: 0,
          "game-id": "gamelink-poetry",
          "room-code": r.value,
          "member-count": n.value.length,
          "max-members": 4
        }, null, 8, ["room-code", "member-count"])) : Mt("", !0),
        D("button", {
          class: "gl-action",
          onClick: ct
        }, [
          ie(Je, { name: "exit" }),
          s[3] || (s[3] = Ce("退出", -1))
        ])
      ]),
      a.value ? (K(), X("div", Ka, Q(a.value), 1)) : Mt("", !0),
      l.value && c.value ? (K(), X("section", Wa, [
        D("div", qa, [
          D("small", null, "第 " + Q(oe.value) + " / " + Q(br(Ke)) + " 题 · " + Q(c.value.phase === "results" ? "答案揭晓" : "诗句补全"), 1),
          D("h1", null, Q(U.value.line), 1),
          D("p", null, Q(U.value.author) + " ·《" + Q(U.value.title) + "》", 1)
        ]),
        D("div", Ja, [
          D("span", null, Q(c.value.phase === "writing" ? `${ae.value} / ${O.value.length} 人已交卷` : c.value.phase === "revealing" ? "所有人已交卷，正在打开答案…" : fe.value ? "本场 15 题已完成" : `${at.value} 秒后进入下一题`), 1),
          D("span", null, Q(c.value.phase === "writing" ? "手写缺失的字词" : "共同赏读，下一题见"), 1)
        ]),
        c.value.phase === "writing" ? (K(), X(he, { key: 0 }, [
          T.value ? (K(), X("section", Ga, [
            D("div", Za, [
              (K(), ln(zi, {
                ref_key: "pad",
                ref: I,
                key: c.value.id,
                locked: S.value || H.value,
                onChange: s[0] || (s[0] = (u) => M.value = u)
              }, null, 8, ["locked"])),
              S.value ? (K(), X("div", za, [
                ie(Je, { name: "check" }),
                s[5] || (s[5] = Ce("已交卷，笔迹已封存", -1))
              ])) : Mt("", !0),
              !M.value.length && !S.value ? (K(), X("span", Ya, "在这里手写答案")) : Mt("", !0)
            ]),
            D("div", Xa, [
              D("button", {
                class: "gl-action",
                disabled: S.value || H.value,
                onClick: s[1] || (s[1] = (u) => I.value?.undo())
              }, [
                ie(Je, { name: "undo" }),
                s[6] || (s[6] = Ce("撤销", -1))
              ], 8, Qa),
              D("button", {
                class: "gl-action",
                disabled: S.value || H.value,
                onClick: s[2] || (s[2] = (u) => I.value?.clear())
              }, [
                ie(Je, { name: "trash" }),
                s[7] || (s[7] = Ce("重写", -1))
              ], 8, eo),
              D("button", {
                class: "gl-action poem-submit",
                disabled: S.value || H.value || !M.value.length,
                onClick: zt
              }, [
                Ce(Q(S.value ? "已提交" : H.value ? "正在封存…" : "提交答案"), 1),
                ie(Je, { name: "check" })
              ], 8, to)
            ]),
            s[8] || (s[8] = D("p", { class: "poem-note" }, "提交后不可修改。所有人交卷后，才会公开笔迹与标准答案。", -1))
          ])) : (K(), X("p", no, "本题已开始，你将在下一题加入答题。"))
        ], 64)) : c.value.phase === "results" ? (K(), X(he, { key: 1 }, [
          D("div", io, [
            s[9] || (s[9] = D("small", null, "标准答案", -1)),
            D("strong", null, Q(U.value.answer), 1),
            D("p", null, Q(U.value.line.replace(/□+/, U.value.answer)), 1)
          ]),
          D("section", ro, [
            (K(!0), X(he, null, Wn(O.value, (u) => (K(), X("article", {
              key: u.id
            }, [
              D("header", null, [
                Ce(Q(u.name), 1),
                D("small", null, Q(u.id === i.value?.id ? "你的答案" : "手写答案"), 1)
              ]),
              d.value[u.id] ? (K(), ln(zi, {
                key: 0,
                strokes: d.value[u.id],
                readonly: ""
              }, null, 8, ["strokes"])) : (K(), X("p", lo, "正在同步笔迹…"))
            ]))), 128))
          ])
        ], 64)) : (K(), X("div", so, "正在揭晓 " + Q(Object.keys(d.value).length) + " / " + Q(O.value.length) + " 份答案", 1)),
        fe.value ? (K(), X("div", ao, [
          s[11] || (s[11] = D("h2", null, "十五题，一卷收笔。", -1)),
          s[12] || (s[12] = D("p", null, "本场答题完成，再随机抽取 15 道题继续挑战。", -1)),
          D("button", {
            class: "gl-action poem-submit",
            onClick: yt
          }, [
            ie(Je, { name: "refresh" }),
            s[10] || (s[10] = Ce("再来一场", -1))
          ])
        ])) : Mt("", !0),
        D("div", oo, [
          (K(!0), X(he, null, Wn(O.value, (u) => (K(), X("span", {
            key: u.id
          }, [
            D("i", {
              class: Ot({ done: f.value[u.id] })
            }, null, 2),
            Ce(Q(u.name), 1),
            D("small", null, Q(f.value[u.id] ? "已交卷" : "正在作答"), 1)
          ]))), 128))
        ]),
        o.value ? (K(), X("p", uo, Q(o.value), 1)) : Mt("", !0)
      ])) : (K(), X("div", ho, Q(a.value || "正在准备诗卷…"), 1))
    ]));
  }
});
Ca(co).mount("#app");
