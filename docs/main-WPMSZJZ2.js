var qd = Object.defineProperty,
	Zd = Object.defineProperties;
var Yd = Object.getOwnPropertyDescriptors;
var Da = Object.getOwnPropertySymbols;
var Qd = Object.prototype.hasOwnProperty,
	Kd = Object.prototype.propertyIsEnumerable;
var wa = (e, t, r) =>
		t in e
			? qd(e, t, {
					enumerable: !0,
					configurable: !0,
					writable: !0,
					value: r,
				})
			: (e[t] = r),
	g = (e, t) => {
		for (var r in (t ||= {})) Qd.call(t, r) && wa(e, r, t[r]);
		if (Da) for (var r of Da(t)) Kd.call(t, r) && wa(e, r, t[r]);
		return e;
	},
	V = (e, t) => Zd(e, Yd(t));
var Ea = null;
var No = 1,
	Ca = Symbol("SIGNAL");
function ee(e) {
	let t = Ea;
	return (Ea = e), t;
}
var Ia = {
	version: 0,
	lastCleanEpoch: 0,
	dirty: !1,
	producerNode: void 0,
	producerLastReadVersion: void 0,
	producerIndexOfThis: void 0,
	nextProducerIndex: 0,
	liveConsumerNode: void 0,
	liveConsumerIndexOfThis: void 0,
	consumerAllowSignalWrites: !1,
	consumerIsAlwaysLive: !1,
	producerMustRecompute: () => !1,
	producerRecomputeValue: () => {},
	consumerMarkedDirty: () => {},
	consumerOnSignalRead: () => {},
};
function Jd(e) {
	if (!(Po(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === No)) {
		if (!e.producerMustRecompute(e) && !Ro(e)) {
			(e.dirty = !1), (e.lastCleanEpoch = No);
			return;
		}
		e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = No);
	}
}
function ba(e) {
	return e && (e.nextProducerIndex = 0), ee(e);
}
function Ma(e, t) {
	if (
		(ee(t),
		!(
			!e ||
			e.producerNode === void 0 ||
			e.producerIndexOfThis === void 0 ||
			e.producerLastReadVersion === void 0
		))
	) {
		if (Po(e))
			for (let r = e.nextProducerIndex; r < e.producerNode.length; r++)
				Oo(e.producerNode[r], e.producerIndexOfThis[r]);
		for (; e.producerNode.length > e.nextProducerIndex; )
			e.producerNode.pop(),
				e.producerLastReadVersion.pop(),
				e.producerIndexOfThis.pop();
	}
}
function Ro(e) {
	er(e);
	for (let t = 0; t < e.producerNode.length; t++) {
		let r = e.producerNode[t],
			n = e.producerLastReadVersion[t];
		if (n !== r.version || (Jd(r), n !== r.version)) return !0;
	}
	return !1;
}
function Ta(e) {
	if ((er(e), Po(e)))
		for (let t = 0; t < e.producerNode.length; t++)
			Oo(e.producerNode[t], e.producerIndexOfThis[t]);
	(e.producerNode.length =
		e.producerLastReadVersion.length =
		e.producerIndexOfThis.length =
			0),
		e.liveConsumerNode &&
			(e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
}
function Oo(e, t) {
	if ((Xd(e), er(e), e.liveConsumerNode.length === 1))
		for (let n = 0; n < e.producerNode.length; n++)
			Oo(e.producerNode[n], e.producerIndexOfThis[n]);
	let r = e.liveConsumerNode.length - 1;
	if (
		((e.liveConsumerNode[t] = e.liveConsumerNode[r]),
		(e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[r]),
		e.liveConsumerNode.length--,
		e.liveConsumerIndexOfThis.length--,
		t < e.liveConsumerNode.length)
	) {
		let n = e.liveConsumerIndexOfThis[t],
			o = e.liveConsumerNode[t];
		er(o), (o.producerIndexOfThis[n] = t);
	}
}
function Po(e) {
	return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function er(e) {
	(e.producerNode ??= []),
		(e.producerIndexOfThis ??= []),
		(e.producerLastReadVersion ??= []);
}
function Xd(e) {
	(e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
}
function ef() {
	throw new Error();
}
var tf = ef;
function Sa(e) {
	tf = e;
}
function w(e) {
	return typeof e == "function";
}
function wt(e) {
	let r = e((n) => {
		Error.call(n), (n.stack = new Error().stack);
	});
	return (
		(r.prototype = Object.create(Error.prototype)),
		(r.prototype.constructor = r),
		r
	);
}
var tr = wt(
	(e) =>
		function (r) {
			e(this),
				(this.message = r
					? `${r.length} errors occurred during unsubscription:
${r.map((n, o) => `${o + 1}) ${n.toString()}`).join(`
  `)}`
					: ""),
				(this.name = "UnsubscriptionError"),
				(this.errors = r);
		},
);
function an(e, t) {
	if (e) {
		let r = e.indexOf(t);
		0 <= r && e.splice(r, 1);
	}
}
var U = class e {
	constructor(t) {
		(this.initialTeardown = t),
			(this.closed = !1),
			(this._parentage = null),
			(this._finalizers = null);
	}
	unsubscribe() {
		let t;
		if (!this.closed) {
			this.closed = !0;
			let { _parentage: r } = this;
			if (r)
				if (((this._parentage = null), Array.isArray(r)))
					for (let i of r) i.remove(this);
				else r.remove(this);
			let { initialTeardown: n } = this;
			if (w(n))
				try {
					n();
				} catch (i) {
					t = i instanceof tr ? i.errors : [i];
				}
			let { _finalizers: o } = this;
			if (o) {
				this._finalizers = null;
				for (let i of o)
					try {
						xa(i);
					} catch (s) {
						(t = t ?? []),
							s instanceof tr
								? (t = [...t, ...s.errors])
								: t.push(s);
					}
			}
			if (t) throw new tr(t);
		}
	}
	add(t) {
		var r;
		if (t && t !== this)
			if (this.closed) xa(t);
			else {
				if (t instanceof e) {
					if (t.closed || t._hasParent(this)) return;
					t._addParent(this);
				}
				(this._finalizers =
					(r = this._finalizers) !== null && r !== void 0
						? r
						: []).push(t);
			}
	}
	_hasParent(t) {
		let { _parentage: r } = this;
		return r === t || (Array.isArray(r) && r.includes(t));
	}
	_addParent(t) {
		let { _parentage: r } = this;
		this._parentage = Array.isArray(r) ? (r.push(t), r) : r ? [r, t] : t;
	}
	_removeParent(t) {
		let { _parentage: r } = this;
		r === t ? (this._parentage = null) : Array.isArray(r) && an(r, t);
	}
	remove(t) {
		let { _finalizers: r } = this;
		r && an(r, t), t instanceof e && t._removeParent(this);
	}
};
U.EMPTY = (() => {
	let e = new U();
	return (e.closed = !0), e;
})();
var Fo = U.EMPTY;
function nr(e) {
	return (
		e instanceof U ||
		(e && "closed" in e && w(e.remove) && w(e.add) && w(e.unsubscribe))
	);
}
function xa(e) {
	w(e) ? e() : e.unsubscribe();
}
var ye = {
	onUnhandledError: null,
	onStoppedNotification: null,
	Promise: void 0,
	useDeprecatedSynchronousErrorHandling: !1,
	useDeprecatedNextContext: !1,
};
var Et = {
	setTimeout(e, t, ...r) {
		let { delegate: n } = Et;
		return n?.setTimeout
			? n.setTimeout(e, t, ...r)
			: setTimeout(e, t, ...r);
	},
	clearTimeout(e) {
		let { delegate: t } = Et;
		return (t?.clearTimeout || clearTimeout)(e);
	},
	delegate: void 0,
};
function rr(e) {
	Et.setTimeout(() => {
		let { onUnhandledError: t } = ye;
		if (t) t(e);
		else throw e;
	});
}
function cn() {}
var Aa = ko("C", void 0, void 0);
function _a(e) {
	return ko("E", void 0, e);
}
function Na(e) {
	return ko("N", e, void 0);
}
function ko(e, t, r) {
	return { kind: e, value: t, error: r };
}
var rt = null;
function Ct(e) {
	if (ye.useDeprecatedSynchronousErrorHandling) {
		let t = !rt;
		if ((t && (rt = { errorThrown: !1, error: null }), e(), t)) {
			let { errorThrown: r, error: n } = rt;
			if (((rt = null), r)) throw n;
		}
	} else e();
}
function Ra(e) {
	ye.useDeprecatedSynchronousErrorHandling &&
		rt &&
		((rt.errorThrown = !0), (rt.error = e));
}
var ot = class extends U {
		constructor(t) {
			super(),
				(this.isStopped = !1),
				t
					? ((this.destination = t), nr(t) && t.add(this))
					: (this.destination = of);
		}
		static create(t, r, n) {
			return new It(t, r, n);
		}
		next(t) {
			this.isStopped ? jo(Na(t), this) : this._next(t);
		}
		error(t) {
			this.isStopped
				? jo(_a(t), this)
				: ((this.isStopped = !0), this._error(t));
		}
		complete() {
			this.isStopped
				? jo(Aa, this)
				: ((this.isStopped = !0), this._complete());
		}
		unsubscribe() {
			this.closed ||
				((this.isStopped = !0),
				super.unsubscribe(),
				(this.destination = null));
		}
		_next(t) {
			this.destination.next(t);
		}
		_error(t) {
			try {
				this.destination.error(t);
			} finally {
				this.unsubscribe();
			}
		}
		_complete() {
			try {
				this.destination.complete();
			} finally {
				this.unsubscribe();
			}
		}
	},
	nf = Function.prototype.bind;
function Lo(e, t) {
	return nf.call(e, t);
}
var Vo = class {
		constructor(t) {
			this.partialObserver = t;
		}
		next(t) {
			let { partialObserver: r } = this;
			if (r.next)
				try {
					r.next(t);
				} catch (n) {
					or(n);
				}
		}
		error(t) {
			let { partialObserver: r } = this;
			if (r.error)
				try {
					r.error(t);
				} catch (n) {
					or(n);
				}
			else or(t);
		}
		complete() {
			let { partialObserver: t } = this;
			if (t.complete)
				try {
					t.complete();
				} catch (r) {
					or(r);
				}
		}
	},
	It = class extends ot {
		constructor(t, r, n) {
			super();
			let o;
			if (w(t) || !t)
				o = {
					next: t ?? void 0,
					error: r ?? void 0,
					complete: n ?? void 0,
				};
			else {
				let i;
				this && ye.useDeprecatedNextContext
					? ((i = Object.create(t)),
						(i.unsubscribe = () => this.unsubscribe()),
						(o = {
							next: t.next && Lo(t.next, i),
							error: t.error && Lo(t.error, i),
							complete: t.complete && Lo(t.complete, i),
						}))
					: (o = t);
			}
			this.destination = new Vo(o);
		}
	};
function or(e) {
	ye.useDeprecatedSynchronousErrorHandling ? Ra(e) : rr(e);
}
function rf(e) {
	throw e;
}
function jo(e, t) {
	let { onStoppedNotification: r } = ye;
	r && Et.setTimeout(() => r(e, t));
}
var of = { closed: !0, next: cn, error: rf, complete: cn };
var bt = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function te(e) {
	return e;
}
function $o(...e) {
	return Uo(e);
}
function Uo(e) {
	return e.length === 0
		? te
		: e.length === 1
			? e[0]
			: function (r) {
					return e.reduce((n, o) => o(n), r);
				};
}
var R = (() => {
	class e {
		constructor(r) {
			r && (this._subscribe = r);
		}
		lift(r) {
			let n = new e();
			return (n.source = this), (n.operator = r), n;
		}
		subscribe(r, n, o) {
			let i = af(r) ? r : new It(r, n, o);
			return (
				Ct(() => {
					let { operator: s, source: a } = this;
					i.add(
						s
							? s.call(i, a)
							: a
								? this._subscribe(i)
								: this._trySubscribe(i),
					);
				}),
				i
			);
		}
		_trySubscribe(r) {
			try {
				return this._subscribe(r);
			} catch (n) {
				r.error(n);
			}
		}
		forEach(r, n) {
			return (
				(n = Oa(n)),
				new n((o, i) => {
					let s = new It({
						next: (a) => {
							try {
								r(a);
							} catch (c) {
								i(c), s.unsubscribe();
							}
						},
						error: i,
						complete: o,
					});
					this.subscribe(s);
				})
			);
		}
		_subscribe(r) {
			var n;
			return (n = this.source) === null || n === void 0
				? void 0
				: n.subscribe(r);
		}
		[bt]() {
			return this;
		}
		pipe(...r) {
			return Uo(r)(this);
		}
		toPromise(r) {
			return (
				(r = Oa(r)),
				new r((n, o) => {
					let i;
					this.subscribe(
						(s) => (i = s),
						(s) => o(s),
						() => n(i),
					);
				})
			);
		}
	}
	return (e.create = (t) => new e(t)), e;
})();
function Oa(e) {
	var t;
	return (t = e ?? ye.Promise) !== null && t !== void 0 ? t : Promise;
}
function sf(e) {
	return e && w(e.next) && w(e.error) && w(e.complete);
}
function af(e) {
	return (e && e instanceof ot) || (sf(e) && nr(e));
}
function Bo(e) {
	return w(e?.lift);
}
function x(e) {
	return (t) => {
		if (Bo(t))
			return t.lift(function (r) {
				try {
					return e(r, this);
				} catch (n) {
					this.error(n);
				}
			});
		throw new TypeError("Unable to lift unknown Observable type");
	};
}
function A(e, t, r, n, o) {
	return new Ho(e, t, r, n, o);
}
var Ho = class extends ot {
	constructor(t, r, n, o, i, s) {
		super(t),
			(this.onFinalize = i),
			(this.shouldUnsubscribe = s),
			(this._next = r
				? function (a) {
						try {
							r(a);
						} catch (c) {
							t.error(c);
						}
					}
				: super._next),
			(this._error = o
				? function (a) {
						try {
							o(a);
						} catch (c) {
							t.error(c);
						} finally {
							this.unsubscribe();
						}
					}
				: super._error),
			(this._complete = n
				? function () {
						try {
							n();
						} catch (a) {
							t.error(a);
						} finally {
							this.unsubscribe();
						}
					}
				: super._complete);
	}
	unsubscribe() {
		var t;
		if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
			let { closed: r } = this;
			super.unsubscribe(),
				!r &&
					((t = this.onFinalize) === null ||
						t === void 0 ||
						t.call(this));
		}
	}
};
function Mt() {
	return x((e, t) => {
		let r = null;
		e._refCount++;
		let n = A(t, void 0, void 0, void 0, () => {
			if (!e || e._refCount <= 0 || 0 < --e._refCount) {
				r = null;
				return;
			}
			let o = e._connection,
				i = r;
			(r = null),
				o && (!i || o === i) && o.unsubscribe(),
				t.unsubscribe();
		});
		e.subscribe(n), n.closed || (r = e.connect());
	});
}
var Tt = class extends R {
	constructor(t, r) {
		super(),
			(this.source = t),
			(this.subjectFactory = r),
			(this._subject = null),
			(this._refCount = 0),
			(this._connection = null),
			Bo(t) && (this.lift = t.lift);
	}
	_subscribe(t) {
		return this.getSubject().subscribe(t);
	}
	getSubject() {
		let t = this._subject;
		return (
			(!t || t.isStopped) && (this._subject = this.subjectFactory()),
			this._subject
		);
	}
	_teardown() {
		this._refCount = 0;
		let { _connection: t } = this;
		(this._subject = this._connection = null), t?.unsubscribe();
	}
	connect() {
		let t = this._connection;
		if (!t) {
			t = this._connection = new U();
			let r = this.getSubject();
			t.add(
				this.source.subscribe(
					A(
						r,
						void 0,
						() => {
							this._teardown(), r.complete();
						},
						(n) => {
							this._teardown(), r.error(n);
						},
						() => this._teardown(),
					),
				),
			),
				t.closed && ((this._connection = null), (t = U.EMPTY));
		}
		return t;
	}
	refCount() {
		return Mt()(this);
	}
};
var Pa = wt(
	(e) =>
		function () {
			e(this),
				(this.name = "ObjectUnsubscribedError"),
				(this.message = "object unsubscribed");
		},
);
var ne = (() => {
		class e extends R {
			constructor() {
				super(),
					(this.closed = !1),
					(this.currentObservers = null),
					(this.observers = []),
					(this.isStopped = !1),
					(this.hasError = !1),
					(this.thrownError = null);
			}
			lift(r) {
				let n = new ir(this, this);
				return (n.operator = r), n;
			}
			_throwIfClosed() {
				if (this.closed) throw new Pa();
			}
			next(r) {
				Ct(() => {
					if ((this._throwIfClosed(), !this.isStopped)) {
						this.currentObservers ||
							(this.currentObservers = Array.from(
								this.observers,
							));
						for (let n of this.currentObservers) n.next(r);
					}
				});
			}
			error(r) {
				Ct(() => {
					if ((this._throwIfClosed(), !this.isStopped)) {
						(this.hasError = this.isStopped = !0),
							(this.thrownError = r);
						let { observers: n } = this;
						for (; n.length; ) n.shift().error(r);
					}
				});
			}
			complete() {
				Ct(() => {
					if ((this._throwIfClosed(), !this.isStopped)) {
						this.isStopped = !0;
						let { observers: r } = this;
						for (; r.length; ) r.shift().complete();
					}
				});
			}
			unsubscribe() {
				(this.isStopped = this.closed = !0),
					(this.observers = this.currentObservers = null);
			}
			get observed() {
				var r;
				return (
					((r = this.observers) === null || r === void 0
						? void 0
						: r.length) > 0
				);
			}
			_trySubscribe(r) {
				return this._throwIfClosed(), super._trySubscribe(r);
			}
			_subscribe(r) {
				return (
					this._throwIfClosed(),
					this._checkFinalizedStatuses(r),
					this._innerSubscribe(r)
				);
			}
			_innerSubscribe(r) {
				let { hasError: n, isStopped: o, observers: i } = this;
				return n || o
					? Fo
					: ((this.currentObservers = null),
						i.push(r),
						new U(() => {
							(this.currentObservers = null), an(i, r);
						}));
			}
			_checkFinalizedStatuses(r) {
				let { hasError: n, thrownError: o, isStopped: i } = this;
				n ? r.error(o) : i && r.complete();
			}
			asObservable() {
				let r = new R();
				return (r.source = this), r;
			}
		}
		return (e.create = (t, r) => new ir(t, r)), e;
	})(),
	ir = class extends ne {
		constructor(t, r) {
			super(), (this.destination = t), (this.source = r);
		}
		next(t) {
			var r, n;
			(n =
				(r = this.destination) === null || r === void 0
					? void 0
					: r.next) === null ||
				n === void 0 ||
				n.call(r, t);
		}
		error(t) {
			var r, n;
			(n =
				(r = this.destination) === null || r === void 0
					? void 0
					: r.error) === null ||
				n === void 0 ||
				n.call(r, t);
		}
		complete() {
			var t, r;
			(r =
				(t = this.destination) === null || t === void 0
					? void 0
					: t.complete) === null ||
				r === void 0 ||
				r.call(t);
		}
		_subscribe(t) {
			var r, n;
			return (n =
				(r = this.source) === null || r === void 0
					? void 0
					: r.subscribe(t)) !== null && n !== void 0
				? n
				: Fo;
		}
	};
var W = class extends ne {
	constructor(t) {
		super(), (this._value = t);
	}
	get value() {
		return this.getValue();
	}
	_subscribe(t) {
		let r = super._subscribe(t);
		return !r.closed && t.next(this._value), r;
	}
	getValue() {
		let { hasError: t, thrownError: r, _value: n } = this;
		if (t) throw r;
		return this._throwIfClosed(), n;
	}
	next(t) {
		super.next((this._value = t));
	}
};
var ue = new R((e) => e.complete());
function Fa(e) {
	return e && w(e.schedule);
}
function ka(e) {
	return e[e.length - 1];
}
function La(e) {
	return w(ka(e)) ? e.pop() : void 0;
}
function Ue(e) {
	return Fa(ka(e)) ? e.pop() : void 0;
}
function Va(e, t, r, n) {
	function o(i) {
		return i instanceof r
			? i
			: new r(function (s) {
					s(i);
				});
	}
	return new (r || (r = Promise))(function (i, s) {
		function a(l) {
			try {
				u(n.next(l));
			} catch (d) {
				s(d);
			}
		}
		function c(l) {
			try {
				u(n.throw(l));
			} catch (d) {
				s(d);
			}
		}
		function u(l) {
			l.done ? i(l.value) : o(l.value).then(a, c);
		}
		u((n = n.apply(e, t || [])).next());
	});
}
function ja(e) {
	var t = typeof Symbol == "function" && Symbol.iterator,
		r = t && e[t],
		n = 0;
	if (r) return r.call(e);
	if (e && typeof e.length == "number")
		return {
			next: function () {
				return (
					e && n >= e.length && (e = void 0),
					{ value: e && e[n++], done: !e }
				);
			},
		};
	throw new TypeError(
		t ? "Object is not iterable." : "Symbol.iterator is not defined.",
	);
}
function it(e) {
	return this instanceof it ? ((this.v = e), this) : new it(e);
}
function $a(e, t, r) {
	if (!Symbol.asyncIterator)
		throw new TypeError("Symbol.asyncIterator is not defined.");
	var n = r.apply(e, t || []),
		o,
		i = [];
	return (
		(o = {}),
		s("next"),
		s("throw"),
		s("return"),
		(o[Symbol.asyncIterator] = function () {
			return this;
		}),
		o
	);
	function s(f) {
		n[f] &&
			(o[f] = function (h) {
				return new Promise(function (E, F) {
					i.push([f, h, E, F]) > 1 || a(f, h);
				});
			});
	}
	function a(f, h) {
		try {
			c(n[f](h));
		} catch (E) {
			d(i[0][3], E);
		}
	}
	function c(f) {
		f.value instanceof it
			? Promise.resolve(f.value.v).then(u, l)
			: d(i[0][2], f);
	}
	function u(f) {
		a("next", f);
	}
	function l(f) {
		a("throw", f);
	}
	function d(f, h) {
		f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
	}
}
function Ua(e) {
	if (!Symbol.asyncIterator)
		throw new TypeError("Symbol.asyncIterator is not defined.");
	var t = e[Symbol.asyncIterator],
		r;
	return t
		? t.call(e)
		: ((e = typeof ja == "function" ? ja(e) : e[Symbol.iterator]()),
			(r = {}),
			n("next"),
			n("throw"),
			n("return"),
			(r[Symbol.asyncIterator] = function () {
				return this;
			}),
			r);
	function n(i) {
		r[i] =
			e[i] &&
			function (s) {
				return new Promise(function (a, c) {
					(s = e[i](s)), o(a, c, s.done, s.value);
				});
			};
	}
	function o(i, s, a, c) {
		Promise.resolve(c).then(function (u) {
			i({ value: u, done: a });
		}, s);
	}
}
var sr = (e) => e && typeof e.length == "number" && typeof e != "function";
function ar(e) {
	return w(e?.then);
}
function cr(e) {
	return w(e[bt]);
}
function ur(e) {
	return Symbol.asyncIterator && w(e?.[Symbol.asyncIterator]);
}
function lr(e) {
	return new TypeError(
		`You provided ${e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
	);
}
function cf() {
	return typeof Symbol != "function" || !Symbol.iterator
		? "@@iterator"
		: Symbol.iterator;
}
var dr = cf();
function fr(e) {
	return w(e?.[dr]);
}
function hr(e) {
	return $a(this, arguments, function* () {
		let r = e.getReader();
		try {
			for (;;) {
				let { value: n, done: o } = yield it(r.read());
				if (o) return yield it(void 0);
				yield yield it(n);
			}
		} finally {
			r.releaseLock();
		}
	});
}
function pr(e) {
	return w(e?.getReader);
}
function z(e) {
	if (e instanceof R) return e;
	if (e != null) {
		if (cr(e)) return uf(e);
		if (sr(e)) return lf(e);
		if (ar(e)) return df(e);
		if (ur(e)) return Ba(e);
		if (fr(e)) return ff(e);
		if (pr(e)) return hf(e);
	}
	throw lr(e);
}
function uf(e) {
	return new R((t) => {
		let r = e[bt]();
		if (w(r.subscribe)) return r.subscribe(t);
		throw new TypeError(
			"Provided object does not correctly implement Symbol.observable",
		);
	});
}
function lf(e) {
	return new R((t) => {
		for (let r = 0; r < e.length && !t.closed; r++) t.next(e[r]);
		t.complete();
	});
}
function df(e) {
	return new R((t) => {
		e.then(
			(r) => {
				t.closed || (t.next(r), t.complete());
			},
			(r) => t.error(r),
		).then(null, rr);
	});
}
function ff(e) {
	return new R((t) => {
		for (let r of e) if ((t.next(r), t.closed)) return;
		t.complete();
	});
}
function Ba(e) {
	return new R((t) => {
		pf(e, t).catch((r) => t.error(r));
	});
}
function hf(e) {
	return Ba(hr(e));
}
function pf(e, t) {
	var r, n, o, i;
	return Va(this, void 0, void 0, function* () {
		try {
			for (r = Ua(e); (n = yield r.next()), !n.done; ) {
				let s = n.value;
				if ((t.next(s), t.closed)) return;
			}
		} catch (s) {
			o = { error: s };
		} finally {
			try {
				n && !n.done && (i = r.return) && (yield i.call(r));
			} finally {
				if (o) throw o.error;
			}
		}
		t.complete();
	});
}
function J(e, t, r, n = 0, o = !1) {
	let i = t.schedule(function () {
		r(), o ? e.add(this.schedule(null, n)) : this.unsubscribe();
	}, n);
	if ((e.add(i), !o)) return i;
}
function gr(e, t = 0) {
	return x((r, n) => {
		r.subscribe(
			A(
				n,
				(o) => J(n, e, () => n.next(o), t),
				() => J(n, e, () => n.complete(), t),
				(o) => J(n, e, () => n.error(o), t),
			),
		);
	});
}
function mr(e, t = 0) {
	return x((r, n) => {
		n.add(e.schedule(() => r.subscribe(n), t));
	});
}
function Ha(e, t) {
	return z(e).pipe(mr(t), gr(t));
}
function za(e, t) {
	return z(e).pipe(mr(t), gr(t));
}
function Ga(e, t) {
	return new R((r) => {
		let n = 0;
		return t.schedule(function () {
			n === e.length
				? r.complete()
				: (r.next(e[n++]), r.closed || this.schedule());
		});
	});
}
function Wa(e, t) {
	return new R((r) => {
		let n;
		return (
			J(r, t, () => {
				(n = e[dr]()),
					J(
						r,
						t,
						() => {
							let o, i;
							try {
								({ value: o, done: i } = n.next());
							} catch (s) {
								r.error(s);
								return;
							}
							i ? r.complete() : r.next(o);
						},
						0,
						!0,
					);
			}),
			() => w(n?.return) && n.return()
		);
	});
}
function vr(e, t) {
	if (!e) throw new Error("Iterable cannot be null");
	return new R((r) => {
		J(r, t, () => {
			let n = e[Symbol.asyncIterator]();
			J(
				r,
				t,
				() => {
					n.next().then((o) => {
						o.done ? r.complete() : r.next(o.value);
					});
				},
				0,
				!0,
			);
		});
	});
}
function qa(e, t) {
	return vr(hr(e), t);
}
function Za(e, t) {
	if (e != null) {
		if (cr(e)) return Ha(e, t);
		if (sr(e)) return Ga(e, t);
		if (ar(e)) return za(e, t);
		if (ur(e)) return vr(e, t);
		if (fr(e)) return Wa(e, t);
		if (pr(e)) return qa(e, t);
	}
	throw lr(e);
}
function L(e, t) {
	return t ? Za(e, t) : z(e);
}
function y(...e) {
	let t = Ue(e);
	return L(e, t);
}
function St(e, t) {
	let r = w(e) ? e : () => e,
		n = (o) => o.error(r());
	return new R(t ? (o) => t.schedule(n, 0, o) : n);
}
function zo(e) {
	return !!e && (e instanceof R || (w(e.lift) && w(e.subscribe)));
}
var Ne = wt(
	(e) =>
		function () {
			e(this),
				(this.name = "EmptyError"),
				(this.message = "no elements in sequence");
		},
);
function T(e, t) {
	return x((r, n) => {
		let o = 0;
		r.subscribe(
			A(n, (i) => {
				n.next(e.call(t, i, o++));
			}),
		);
	});
}
var { isArray: gf } = Array;
function mf(e, t) {
	return gf(t) ? e(...t) : e(t);
}
function Ya(e) {
	return T((t) => mf(e, t));
}
var { isArray: vf } = Array,
	{ getPrototypeOf: yf, prototype: Df, keys: wf } = Object;
function Qa(e) {
	if (e.length === 1) {
		let t = e[0];
		if (vf(t)) return { args: t, keys: null };
		if (Ef(t)) {
			let r = wf(t);
			return { args: r.map((n) => t[n]), keys: r };
		}
	}
	return { args: e, keys: null };
}
function Ef(e) {
	return e && typeof e == "object" && yf(e) === Df;
}
function Ka(e, t) {
	return e.reduce((r, n, o) => ((r[n] = t[o]), r), {});
}
function yr(...e) {
	let t = Ue(e),
		r = La(e),
		{ args: n, keys: o } = Qa(e);
	if (n.length === 0) return L([], t);
	let i = new R(Cf(n, t, o ? (s) => Ka(o, s) : te));
	return r ? i.pipe(Ya(r)) : i;
}
function Cf(e, t, r = te) {
	return (n) => {
		Ja(
			t,
			() => {
				let { length: o } = e,
					i = new Array(o),
					s = o,
					a = o;
				for (let c = 0; c < o; c++)
					Ja(
						t,
						() => {
							let u = L(e[c], t),
								l = !1;
							u.subscribe(
								A(
									n,
									(d) => {
										(i[c] = d),
											l || ((l = !0), a--),
											a || n.next(r(i.slice()));
									},
									() => {
										--s || n.complete();
									},
								),
							);
						},
						n,
					);
			},
			n,
		);
	};
}
function Ja(e, t, r) {
	e ? J(r, e, t) : t();
}
function Xa(e, t, r, n, o, i, s, a) {
	let c = [],
		u = 0,
		l = 0,
		d = !1,
		f = () => {
			d && !c.length && !u && t.complete();
		},
		h = (F) => (u < n ? E(F) : c.push(F)),
		E = (F) => {
			i && t.next(F), u++;
			let N = !1;
			z(r(F, l++)).subscribe(
				A(
					t,
					(C) => {
						o?.(C), i ? h(C) : t.next(C);
					},
					() => {
						N = !0;
					},
					void 0,
					() => {
						if (N)
							try {
								for (u--; c.length && u < n; ) {
									let C = c.shift();
									s ? J(t, s, () => E(C)) : E(C);
								}
								f();
							} catch (C) {
								t.error(C);
							}
					},
				),
			);
		};
	return (
		e.subscribe(
			A(t, h, () => {
				(d = !0), f();
			}),
		),
		() => {
			a?.();
		}
	);
}
function B(e, t, r = 1 / 0) {
	return w(t)
		? B((n, o) => T((i, s) => t(n, i, o, s))(z(e(n, o))), r)
		: (typeof t == "number" && (r = t), x((n, o) => Xa(n, o, e, r)));
}
function Go(e = 1 / 0) {
	return B(te, e);
}
function ec() {
	return Go(1);
}
function xt(...e) {
	return ec()(L(e, Ue(e)));
}
function Dr(e) {
	return new R((t) => {
		z(e()).subscribe(t);
	});
}
function re(e, t) {
	return x((r, n) => {
		let o = 0;
		r.subscribe(A(n, (i) => e.call(t, i, o++) && n.next(i)));
	});
}
function Be(e) {
	return x((t, r) => {
		let n = null,
			o = !1,
			i;
		(n = t.subscribe(
			A(r, void 0, void 0, (s) => {
				(i = z(e(s, Be(e)(t)))),
					n
						? (n.unsubscribe(), (n = null), i.subscribe(r))
						: (o = !0);
			}),
		)),
			o && (n.unsubscribe(), (n = null), i.subscribe(r));
	});
}
function tc(e, t, r, n, o) {
	return (i, s) => {
		let a = r,
			c = t,
			u = 0;
		i.subscribe(
			A(
				s,
				(l) => {
					let d = u++;
					(c = a ? e(c, l, d) : ((a = !0), l)), n && s.next(c);
				},
				o &&
					(() => {
						a && s.next(c), s.complete();
					}),
			),
		);
	};
}
function He(e, t) {
	return w(t) ? B(e, t, 1) : B(e, 1);
}
function ze(e) {
	return x((t, r) => {
		let n = !1;
		t.subscribe(
			A(
				r,
				(o) => {
					(n = !0), r.next(o);
				},
				() => {
					n || r.next(e), r.complete();
				},
			),
		);
	});
}
function Re(e) {
	return e <= 0
		? () => ue
		: x((t, r) => {
				let n = 0;
				t.subscribe(
					A(r, (o) => {
						++n <= e && (r.next(o), e <= n && r.complete());
					}),
				);
			});
}
function Wo(e) {
	return T(() => e);
}
function wr(e = If) {
	return x((t, r) => {
		let n = !1;
		t.subscribe(
			A(
				r,
				(o) => {
					(n = !0), r.next(o);
				},
				() => (n ? r.complete() : r.error(e())),
			),
		);
	});
}
function If() {
	return new Ne();
}
function st(e) {
	return x((t, r) => {
		try {
			t.subscribe(r);
		} finally {
			r.add(e);
		}
	});
}
function be(e, t) {
	let r = arguments.length >= 2;
	return (n) =>
		n.pipe(
			e ? re((o, i) => e(o, i, n)) : te,
			Re(1),
			r ? ze(t) : wr(() => new Ne()),
		);
}
function At(e) {
	return e <= 0
		? () => ue
		: x((t, r) => {
				let n = [];
				t.subscribe(
					A(
						r,
						(o) => {
							n.push(o), e < n.length && n.shift();
						},
						() => {
							for (let o of n) r.next(o);
							r.complete();
						},
						void 0,
						() => {
							n = null;
						},
					),
				);
			});
}
function qo(e, t) {
	let r = arguments.length >= 2;
	return (n) =>
		n.pipe(
			e ? re((o, i) => e(o, i, n)) : te,
			At(1),
			r ? ze(t) : wr(() => new Ne()),
		);
}
function Zo(e, t) {
	return x(tc(e, t, arguments.length >= 2, !0));
}
function Yo(...e) {
	let t = Ue(e);
	return x((r, n) => {
		(t ? xt(e, r, t) : xt(e, r)).subscribe(n);
	});
}
function oe(e, t) {
	return x((r, n) => {
		let o = null,
			i = 0,
			s = !1,
			a = () => s && !o && n.complete();
		r.subscribe(
			A(
				n,
				(c) => {
					o?.unsubscribe();
					let u = 0,
						l = i++;
					z(e(c, l)).subscribe(
						(o = A(
							n,
							(d) => n.next(t ? t(c, d, l, u++) : d),
							() => {
								(o = null), a();
							},
						)),
					);
				},
				() => {
					(s = !0), a();
				},
			),
		);
	});
}
function Qo(e) {
	return x((t, r) => {
		z(e).subscribe(A(r, () => r.complete(), cn)),
			!r.closed && t.subscribe(r);
	});
}
function H(e, t, r) {
	let n = w(e) || t || r ? { next: e, error: t, complete: r } : e;
	return n
		? x((o, i) => {
				var s;
				(s = n.subscribe) === null || s === void 0 || s.call(n);
				let a = !0;
				o.subscribe(
					A(
						i,
						(c) => {
							var u;
							(u = n.next) === null ||
								u === void 0 ||
								u.call(n, c),
								i.next(c);
						},
						() => {
							var c;
							(a = !1),
								(c = n.complete) === null ||
									c === void 0 ||
									c.call(n),
								i.complete();
						},
						(c) => {
							var u;
							(a = !1),
								(u = n.error) === null ||
									u === void 0 ||
									u.call(n, c),
								i.error(c);
						},
						() => {
							var c, u;
							a &&
								((c = n.unsubscribe) === null ||
									c === void 0 ||
									c.call(n)),
								(u = n.finalize) === null ||
									u === void 0 ||
									u.call(n);
						},
					),
				);
			})
		: te;
}
var D = class extends Error {
	constructor(t, r) {
		super(Ur(t, r)), (this.code = t);
	}
};
function Ur(e, t) {
	return `${`NG0${Math.abs(e)}`}${t ? ": " + t : ""}`;
}
function k(e) {
	for (let t in e) if (e[t] === k) return t;
	throw Error("Could not find renamed property on target object.");
}
function ie(e) {
	if (typeof e == "string") return e;
	if (Array.isArray(e)) return "[" + e.map(ie).join(", ") + "]";
	if (e == null) return "" + e;
	if (e.overriddenName) return `${e.overriddenName}`;
	if (e.name) return `${e.name}`;
	let t = e.toString();
	if (t == null) return "" + t;
	let r = t.indexOf(`
`);
	return r === -1 ? t : t.substring(0, r);
}
function nc(e, t) {
	return e == null || e === ""
		? t === null
			? ""
			: t
		: t == null || t === ""
			? e
			: e + " " + t;
}
var bf = k({ __forward_ref__: k });
function Fc(e) {
	return (
		(e.__forward_ref__ = Fc),
		(e.toString = function () {
			return ie(this());
		}),
		e
	);
}
function de(e) {
	return kc(e) ? e() : e;
}
function kc(e) {
	return (
		typeof e == "function" &&
		e.hasOwnProperty(bf) &&
		e.__forward_ref__ === Fc
	);
}
function Lc(e) {
	return e && !!e.ɵproviders;
}
var Mf = k({ ɵcmp: k }),
	Tf = k({ ɵdir: k }),
	Sf = k({ ɵpipe: k }),
	xf = k({ ɵmod: k }),
	Tr = k({ ɵfac: k }),
	un = k({ __NG_ELEMENT_ID__: k }),
	rc = k({ __NG_ENV_ID__: k });
function jc(e) {
	return typeof e == "string" ? e : e == null ? "" : String(e);
}
function Af(e) {
	return typeof e == "function"
		? e.name || e.toString()
		: typeof e == "object" && e != null && typeof e.type == "function"
			? e.type.name || e.type.toString()
			: jc(e);
}
function _f(e, t) {
	let r = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
	throw new D(-200, `Circular dependency in DI detected for ${e}${r}`);
}
function ki(e, t) {
	throw new D(-201, !1);
}
function Nf(e, t) {
	e == null && Rf(t, e, null, "!=");
}
function Rf(e, t, r, n) {
	throw new Error(
		`ASSERTION ERROR: ${e}` +
			(n == null ? "" : ` [Expected=> ${r} ${n} ${t} <=Actual]`),
	);
}
function m(e) {
	return {
		token: e.token,
		providedIn: e.providedIn || null,
		factory: e.factory,
		value: void 0,
	};
}
function Br(e) {
	return oc(e, $c) || oc(e, Uc);
}
function Vc(e) {
	return Br(e) !== null;
}
function oc(e, t) {
	return e.hasOwnProperty(t) ? e[t] : null;
}
function Of(e) {
	let t = e && (e[$c] || e[Uc]);
	return t || null;
}
function ic(e) {
	return e && (e.hasOwnProperty(sc) || e.hasOwnProperty(Pf)) ? e[sc] : null;
}
var $c = k({ ɵprov: k }),
	sc = k({ ɵinj: k }),
	Uc = k({ ngInjectableDef: k }),
	Pf = k({ ngInjectorDef: k }),
	S = (function (e) {
		return (
			(e[(e.Default = 0)] = "Default"),
			(e[(e.Host = 1)] = "Host"),
			(e[(e.Self = 2)] = "Self"),
			(e[(e.SkipSelf = 4)] = "SkipSelf"),
			(e[(e.Optional = 8)] = "Optional"),
			e
		);
	})(S || {}),
	ai;
function Ff() {
	return ai;
}
function le(e) {
	let t = ai;
	return (ai = e), t;
}
function Bc(e, t, r) {
	let n = Br(e);
	if (n && n.providedIn == "root")
		return n.value === void 0 ? (n.value = n.factory()) : n.value;
	if (r & S.Optional) return null;
	if (t !== void 0) return t;
	ki(e, "Injector");
}
var ln = globalThis;
var b = class {
	constructor(t, r) {
		(this._desc = t),
			(this.ngMetadataName = "InjectionToken"),
			(this.ɵprov = void 0),
			typeof r == "number"
				? (this.__NG_ELEMENT_ID__ = r)
				: r !== void 0 &&
					(this.ɵprov = m({
						token: this,
						providedIn: r.providedIn || "root",
						factory: r.factory,
					}));
	}
	get multi() {
		return this;
	}
	toString() {
		return `InjectionToken ${this._desc}`;
	}
};
var kf = {},
	hn = kf,
	Lf = "__NG_DI_FLAG__",
	Sr = "ngTempTokenPath",
	jf = "ngTokenPath",
	Vf = /\n/gm,
	$f = "\u0275",
	ac = "__source",
	dn;
function Ge(e) {
	let t = dn;
	return (dn = e), t;
}
function Uf(e, t = S.Default) {
	if (dn === void 0) throw new D(-203, !1);
	return dn === null
		? Bc(e, void 0, t)
		: dn.get(e, t & S.Optional ? null : void 0, t);
}
function v(e, t = S.Default) {
	return (Ff() || Uf)(de(e), t);
}
function p(e, t = S.Default) {
	return v(e, Hr(t));
}
function Hr(e) {
	return typeof e > "u" || typeof e == "number"
		? e
		: 0 |
				(e.optional && 8) |
				(e.host && 1) |
				(e.self && 2) |
				(e.skipSelf && 4);
}
function ci(e) {
	let t = [];
	for (let r = 0; r < e.length; r++) {
		let n = de(e[r]);
		if (Array.isArray(n)) {
			if (n.length === 0) throw new D(900, !1);
			let o,
				i = S.Default;
			for (let s = 0; s < n.length; s++) {
				let a = n[s],
					c = Bf(a);
				typeof c == "number"
					? c === -1
						? (o = a.token)
						: (i |= c)
					: (o = a);
			}
			t.push(v(o, i));
		} else t.push(v(n));
	}
	return t;
}
function Bf(e) {
	return e[Lf];
}
function Hf(e, t, r, n) {
	let o = e[Sr];
	throw (
		(t[ac] && o.unshift(t[ac]),
		(e.message = zf(
			`
` + e.message,
			o,
			r,
			n,
		)),
		(e[jf] = o),
		(e[Sr] = null),
		e)
	);
}
function zf(e, t, r, n = null) {
	e =
		e &&
		e.charAt(0) ===
			`
` &&
		e.charAt(1) == $f
			? e.slice(2)
			: e;
	let o = ie(t);
	if (Array.isArray(t)) o = t.map(ie).join(" -> ");
	else if (typeof t == "object") {
		let i = [];
		for (let s in t)
			if (t.hasOwnProperty(s)) {
				let a = t[s];
				i.push(
					s +
						":" +
						(typeof a == "string" ? JSON.stringify(a) : ie(a)),
				);
			}
		o = `{${i.join(", ")}}`;
	}
	return `${r}${n ? "(" + n + ")" : ""}[${o}]: ${e.replace(
		Vf,
		`
  `,
	)}`;
}
function Li(e) {
	return { toString: e }.toString();
}
var Hc = (function (e) {
		return (
			(e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e
		);
	})(Hc || {}),
	Te = (function (e) {
		return (
			(e[(e.Emulated = 0)] = "Emulated"),
			(e[(e.None = 2)] = "None"),
			(e[(e.ShadowDom = 3)] = "ShadowDom"),
			e
		);
	})(Te || {}),
	pn = {},
	Ft = [],
	qe = (function (e) {
		return (
			(e[(e.None = 0)] = "None"),
			(e[(e.SignalBased = 1)] = "SignalBased"),
			(e[(e.HasDecoratorInputTransform = 2)] =
				"HasDecoratorInputTransform"),
			e
		);
	})(qe || {});
function zc(e, t, r) {
	let n = e.length;
	for (;;) {
		let o = e.indexOf(t, r);
		if (o === -1) return o;
		if (o === 0 || e.charCodeAt(o - 1) <= 32) {
			let i = t.length;
			if (o + i === n || e.charCodeAt(o + i) <= 32) return o;
		}
		r = o + 1;
	}
}
function ui(e, t, r) {
	let n = 0;
	for (; n < r.length; ) {
		let o = r[n];
		if (typeof o == "number") {
			if (o !== 0) break;
			n++;
			let i = r[n++],
				s = r[n++],
				a = r[n++];
			e.setAttribute(t, s, a, i);
		} else {
			let i = o,
				s = r[++n];
			Wf(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), n++;
		}
	}
	return n;
}
function Gf(e) {
	return e === 3 || e === 4 || e === 6;
}
function Wf(e) {
	return e.charCodeAt(0) === 64;
}
function ji(e, t) {
	if (!(t === null || t.length === 0))
		if (e === null || e.length === 0) e = t.slice();
		else {
			let r = -1;
			for (let n = 0; n < t.length; n++) {
				let o = t[n];
				typeof o == "number"
					? (r = o)
					: r === 0 ||
						(r === -1 || r === 2
							? cc(e, r, o, null, t[++n])
							: cc(e, r, o, null, null));
			}
		}
	return e;
}
function cc(e, t, r, n, o) {
	let i = 0,
		s = e.length;
	if (t === -1) s = -1;
	else
		for (; i < e.length; ) {
			let a = e[i++];
			if (typeof a == "number") {
				if (a === t) {
					s = -1;
					break;
				} else if (a > t) {
					s = i - 1;
					break;
				}
			}
		}
	for (; i < e.length; ) {
		let a = e[i];
		if (typeof a == "number") break;
		if (a === r) {
			if (n === null) {
				o !== null && (e[i + 1] = o);
				return;
			} else if (n === e[i + 1]) {
				e[i + 2] = o;
				return;
			}
		}
		i++, n !== null && i++, o !== null && i++;
	}
	s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
		e.splice(i++, 0, r),
		n !== null && e.splice(i++, 0, n),
		o !== null && e.splice(i++, 0, o);
}
var Gc = "ng-template";
function qf(e, t, r) {
	let n = 0,
		o = !0;
	for (; n < e.length; ) {
		let i = e[n++];
		if (typeof i == "string" && o) {
			let s = e[n++];
			if (r && i === "class" && zc(s.toLowerCase(), t, 0) !== -1)
				return !0;
		} else if (i === 1) {
			for (; n < e.length && typeof (i = e[n++]) == "string"; )
				if (i.toLowerCase() === t) return !0;
			return !1;
		} else typeof i == "number" && (o = !1);
	}
	return !1;
}
function Wc(e) {
	return e.type === 4 && e.value !== Gc;
}
function Zf(e, t, r) {
	let n = e.type === 4 && !r ? Gc : e.value;
	return t === n;
}
function Yf(e, t, r) {
	let n = 4,
		o = e.attrs || [],
		i = Jf(o),
		s = !1;
	for (let a = 0; a < t.length; a++) {
		let c = t[a];
		if (typeof c == "number") {
			if (!s && !De(n) && !De(c)) return !1;
			if (s && De(c)) continue;
			(s = !1), (n = c | (n & 1));
			continue;
		}
		if (!s)
			if (n & 4) {
				if (
					((n = 2 | (n & 1)),
					(c !== "" && !Zf(e, c, r)) || (c === "" && t.length === 1))
				) {
					if (De(n)) return !1;
					s = !0;
				}
			} else {
				let u = n & 8 ? c : t[++a];
				if (n & 8 && e.attrs !== null) {
					if (!qf(e.attrs, u, r)) {
						if (De(n)) return !1;
						s = !0;
					}
					continue;
				}
				let l = n & 8 ? "class" : c,
					d = Qf(l, o, Wc(e), r);
				if (d === -1) {
					if (De(n)) return !1;
					s = !0;
					continue;
				}
				if (u !== "") {
					let f;
					d > i ? (f = "") : (f = o[d + 1].toLowerCase());
					let h = n & 8 ? f : null;
					if ((h && zc(h, u, 0) !== -1) || (n & 2 && u !== f)) {
						if (De(n)) return !1;
						s = !0;
					}
				}
			}
	}
	return De(n) || s;
}
function De(e) {
	return (e & 1) === 0;
}
function Qf(e, t, r, n) {
	if (t === null) return -1;
	let o = 0;
	if (n || !r) {
		let i = !1;
		for (; o < t.length; ) {
			let s = t[o];
			if (s === e) return o;
			if (s === 3 || s === 6) i = !0;
			else if (s === 1 || s === 2) {
				let a = t[++o];
				for (; typeof a == "string"; ) a = t[++o];
				continue;
			} else {
				if (s === 4) break;
				if (s === 0) {
					o += 4;
					continue;
				}
			}
			o += i ? 1 : 2;
		}
		return -1;
	} else return Xf(t, e);
}
function Kf(e, t, r = !1) {
	for (let n = 0; n < t.length; n++) if (Yf(e, t[n], r)) return !0;
	return !1;
}
function Jf(e) {
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (Gf(r)) return t;
	}
	return e.length;
}
function Xf(e, t) {
	let r = e.indexOf(4);
	if (r > -1)
		for (r++; r < e.length; ) {
			let n = e[r];
			if (typeof n == "number") return -1;
			if (n === t) return r;
			r++;
		}
	return -1;
}
function uc(e, t) {
	return e ? ":not(" + t.trim() + ")" : t;
}
function eh(e) {
	let t = e[0],
		r = 1,
		n = 2,
		o = "",
		i = !1;
	for (; r < e.length; ) {
		let s = e[r];
		if (typeof s == "string")
			if (n & 2) {
				let a = e[++r];
				o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
			} else n & 8 ? (o += "." + s) : n & 4 && (o += " " + s);
		else
			o !== "" && !De(s) && ((t += uc(i, o)), (o = "")),
				(n = s),
				(i = i || !De(n));
		r++;
	}
	return o !== "" && (t += uc(i, o)), t;
}
function th(e) {
	return e.map(eh).join(",");
}
function nh(e) {
	let t = [],
		r = [],
		n = 1,
		o = 2;
	for (; n < e.length; ) {
		let i = e[n];
		if (typeof i == "string")
			o === 2 ? i !== "" && t.push(i, e[++n]) : o === 8 && r.push(i);
		else {
			if (!De(o)) break;
			o = i;
		}
		n++;
	}
	return { attrs: t, classes: r };
}
function pe(e) {
	return Li(() => {
		let t = Kc(e),
			r = V(g({}, t), {
				decls: e.decls,
				vars: e.vars,
				template: e.template,
				consts: e.consts || null,
				ngContentSelectors: e.ngContentSelectors,
				onPush: e.changeDetection === Hc.OnPush,
				directiveDefs: null,
				pipeDefs: null,
				dependencies: (t.standalone && e.dependencies) || null,
				getStandaloneInjector: null,
				signals: e.signals ?? !1,
				data: e.data || {},
				encapsulation: e.encapsulation || Te.Emulated,
				styles: e.styles || Ft,
				_: null,
				schemas: e.schemas || null,
				tView: null,
				id: "",
			});
		Jc(r);
		let n = e.dependencies;
		return (
			(r.directiveDefs = dc(n, !1)),
			(r.pipeDefs = dc(n, !0)),
			(r.id = ih(r)),
			r
		);
	});
}
function rh(e) {
	return ct(e) || qc(e);
}
function oh(e) {
	return e !== null;
}
function lc(e, t) {
	if (e == null) return pn;
	let r = {};
	for (let n in e)
		if (e.hasOwnProperty(n)) {
			let o = e[n],
				i,
				s,
				a = qe.None;
			Array.isArray(o)
				? ((a = o[0]), (i = o[1]), (s = o[2] ?? i))
				: ((i = o), (s = o)),
				t
					? ((r[i] = a !== qe.None ? [n, a] : n), (t[i] = s))
					: (r[i] = n);
		}
	return r;
}
function Vi(e) {
	return Li(() => {
		let t = Kc(e);
		return Jc(t), t;
	});
}
function ct(e) {
	return e[Mf] || null;
}
function qc(e) {
	return e[Tf] || null;
}
function Zc(e) {
	return e[Sf] || null;
}
function Yc(e) {
	let t = ct(e) || qc(e) || Zc(e);
	return t !== null ? t.standalone : !1;
}
function Qc(e, t) {
	let r = e[xf] || null;
	if (!r && t === !0)
		throw new Error(`Type ${ie(e)} does not have '\u0275mod' property.`);
	return r;
}
function Kc(e) {
	let t = {};
	return {
		type: e.type,
		providersResolver: null,
		factory: null,
		hostBindings: e.hostBindings || null,
		hostVars: e.hostVars || 0,
		hostAttrs: e.hostAttrs || null,
		contentQueries: e.contentQueries || null,
		declaredInputs: t,
		inputTransforms: null,
		inputConfig: e.inputs || pn,
		exportAs: e.exportAs || null,
		standalone: e.standalone === !0,
		signals: e.signals === !0,
		selectors: e.selectors || Ft,
		viewQuery: e.viewQuery || null,
		features: e.features || null,
		setInput: null,
		findHostDirectiveDefs: null,
		hostDirectives: null,
		inputs: lc(e.inputs, t),
		outputs: lc(e.outputs),
		debugInfo: null,
	};
}
function Jc(e) {
	e.features?.forEach((t) => t(e));
}
function dc(e, t) {
	if (!e) return null;
	let r = t ? Zc : rh;
	return () => (typeof e == "function" ? e() : e).map((n) => r(n)).filter(oh);
}
function ih(e) {
	let t = 0,
		r = [
			e.selectors,
			e.ngContentSelectors,
			e.hostVars,
			e.hostAttrs,
			e.consts,
			e.vars,
			e.decls,
			e.encapsulation,
			e.standalone,
			e.signals,
			e.exportAs,
			JSON.stringify(e.inputs),
			JSON.stringify(e.outputs),
			Object.getOwnPropertyNames(e.type.prototype),
			!!e.contentQueries,
			!!e.viewQuery,
		].join("|");
	for (let o of r) t = (Math.imul(31, t) + o.charCodeAt(0)) << 0;
	return (t += 2147483648), "c" + t;
}
var ke = 0,
	_ = 1,
	I = 2,
	Q = 3,
	Ee = 4,
	Ie = 5,
	xr = 6,
	fc = 7,
	Ze = 8,
	kt = 9,
	Oe = 10,
	Ce = 11,
	gn = 12,
	hc = 13,
	bn = 14,
	Se = 15,
	$i = 16,
	_t = 17,
	Ui = 18,
	zr = 19,
	Xc = 20,
	fn = 21,
	Ko = 22,
	ut = 23,
	lt = 25,
	eu = 1;
var dt = 7,
	Ar = 8,
	_r = 9,
	fe = 10,
	Bi = (function (e) {
		return (
			(e[(e.None = 0)] = "None"),
			(e[(e.HasTransplantedViews = 2)] = "HasTransplantedViews"),
			e
		);
	})(Bi || {});
function Ot(e) {
	return Array.isArray(e) && typeof e[eu] == "object";
}
function Le(e) {
	return Array.isArray(e) && e[eu] === !0;
}
function tu(e) {
	return (e.flags & 4) !== 0;
}
function Hi(e) {
	return e.componentOffset > -1;
}
function sh(e) {
	return (e.flags & 1) === 1;
}
function Mn(e) {
	return !!e.template;
}
function ah(e) {
	return (e[I] & 512) !== 0;
}
function Lt(e, t) {
	let r = e.hasOwnProperty(Tr);
	return r ? e[Tr] : null;
}
var li = class {
	constructor(t, r, n) {
		(this.previousValue = t),
			(this.currentValue = r),
			(this.firstChange = n);
	}
	isFirstChange() {
		return this.firstChange;
	}
};
function nu(e, t, r, n) {
	t !== null ? t.applyValueToInputSignal(t, n) : (e[r] = n);
}
function Gr() {
	return ru;
}
function ru(e) {
	return e.type.prototype.ngOnChanges && (e.setInput = uh), ch;
}
Gr.ngInherit = !0;
function ch() {
	let e = iu(this),
		t = e?.current;
	if (t) {
		let r = e.previous;
		if (r === pn) e.previous = t;
		else for (let n in t) r[n] = t[n];
		(e.current = null), this.ngOnChanges(t);
	}
}
function uh(e, t, r, n, o) {
	let i = this.declaredInputs[n],
		s = iu(e) || lh(e, { previous: pn, current: null }),
		a = s.current || (s.current = {}),
		c = s.previous,
		u = c[i];
	(a[i] = new li(u && u.currentValue, r, c === pn)), nu(e, t, o, r);
}
var ou = "__ngSimpleChanges__";
function iu(e) {
	return e[ou] || null;
}
function lh(e, t) {
	return (e[ou] = t);
}
var pc = null;
var We = function (e, t, r) {
		pc?.(e, t, r);
	},
	su = "svg",
	dh = "math",
	fh = !1;
function hh() {
	return fh;
}
function Pe(e) {
	for (; Array.isArray(e); ) e = e[ke];
	return e;
}
function ph(e, t) {
	return Pe(t[e]);
}
function je(e, t) {
	return Pe(t[e.index]);
}
function gh(e, t) {
	return e.data[t];
}
function Tn(e, t) {
	let r = t[e];
	return Ot(r) ? r : r[ke];
}
function zi(e) {
	return (e[I] & 128) === 128;
}
function mh(e) {
	return Le(e[Q]);
}
function gc(e, t) {
	return t == null ? null : e[t];
}
function au(e) {
	e[_t] = 0;
}
function vh(e) {
	e[I] & 1024 || ((e[I] |= 1024), zi(e) && mn(e));
}
function cu(e) {
	return e[I] & 9216 || e[ut]?.dirty;
}
function di(e) {
	cu(e)
		? mn(e)
		: e[I] & 64 &&
			(hh()
				? ((e[I] |= 1024), mn(e))
				: e[Oe].changeDetectionScheduler?.notify());
}
function mn(e) {
	e[Oe].changeDetectionScheduler?.notify();
	let t = vn(e);
	for (; t !== null && !(t[I] & 8192 || ((t[I] |= 8192), !zi(t))); )
		t = vn(t);
}
function yh(e, t) {
	if ((e[I] & 256) === 256) throw new D(911, !1);
	e[fn] === null && (e[fn] = []), e[fn].push(t);
}
function vn(e) {
	let t = e[Q];
	return Le(t) ? t[Q] : t;
}
var O = { lFrame: gu(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function Dh() {
	return O.lFrame.elementDepthCount;
}
function wh() {
	O.lFrame.elementDepthCount++;
}
function Eh() {
	O.lFrame.elementDepthCount--;
}
function uu() {
	return O.bindingsEnabled;
}
function Ch() {
	return O.skipHydrationRootTNode !== null;
}
function Ih(e) {
	return O.skipHydrationRootTNode === e;
}
function bh() {
	O.skipHydrationRootTNode = null;
}
function he() {
	return O.lFrame.lView;
}
function Wr() {
	return O.lFrame.tView;
}
function Qe() {
	let e = lu();
	for (; e !== null && e.type === 64; ) e = e.parent;
	return e;
}
function lu() {
	return O.lFrame.currentTNode;
}
function Mh() {
	let e = O.lFrame,
		t = e.currentTNode;
	return e.isParent ? t : t.parent;
}
function qr(e, t) {
	let r = O.lFrame;
	(r.currentTNode = e), (r.isParent = t);
}
function du() {
	return O.lFrame.isParent;
}
function Th() {
	O.lFrame.isParent = !1;
}
function Sh(e) {
	return (O.lFrame.bindingIndex = e);
}
function xh() {
	return O.lFrame.bindingIndex++;
}
function Ah() {
	return O.lFrame.inI18n;
}
function _h(e, t) {
	let r = O.lFrame;
	(r.bindingIndex = r.bindingRootIndex = e), fi(t);
}
function Nh() {
	return O.lFrame.currentDirectiveIndex;
}
function fi(e) {
	O.lFrame.currentDirectiveIndex = e;
}
function fu(e) {
	O.lFrame.currentQueryIndex = e;
}
function Rh(e) {
	let t = e[_];
	return t.type === 2 ? t.declTNode : t.type === 1 ? e[Ie] : null;
}
function hu(e, t, r) {
	if (r & S.SkipSelf) {
		let o = t,
			i = e;
		for (; (o = o.parent), o === null && !(r & S.Host); )
			if (((o = Rh(i)), o === null || ((i = i[bn]), o.type & 10))) break;
		if (o === null) return !1;
		(t = o), (e = i);
	}
	let n = (O.lFrame = pu());
	return (n.currentTNode = t), (n.lView = e), !0;
}
function Gi(e) {
	let t = pu(),
		r = e[_];
	(O.lFrame = t),
		(t.currentTNode = r.firstChild),
		(t.lView = e),
		(t.tView = r),
		(t.contextLView = e),
		(t.bindingIndex = r.bindingStartIndex),
		(t.inI18n = !1);
}
function pu() {
	let e = O.lFrame,
		t = e === null ? null : e.child;
	return t === null ? gu(e) : t;
}
function gu(e) {
	let t = {
		currentTNode: null,
		isParent: !0,
		lView: null,
		tView: null,
		selectedIndex: -1,
		contextLView: null,
		elementDepthCount: 0,
		currentNamespace: null,
		currentDirectiveIndex: -1,
		bindingRootIndex: -1,
		bindingIndex: -1,
		currentQueryIndex: 0,
		parent: e,
		child: null,
		inI18n: !1,
	};
	return e !== null && (e.child = t), t;
}
function mu() {
	let e = O.lFrame;
	return (O.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var vu = mu;
function Wi() {
	let e = mu();
	(e.isParent = !0),
		(e.tView = null),
		(e.selectedIndex = -1),
		(e.contextLView = null),
		(e.elementDepthCount = 0),
		(e.currentDirectiveIndex = -1),
		(e.currentNamespace = null),
		(e.bindingRootIndex = -1),
		(e.bindingIndex = -1),
		(e.currentQueryIndex = 0);
}
function qi() {
	return O.lFrame.selectedIndex;
}
function ft(e) {
	O.lFrame.selectedIndex = e;
}
function yu() {
	O.lFrame.currentNamespace = su;
}
function Oh() {
	return O.lFrame.currentNamespace;
}
var Du = !0;
function wu() {
	return Du;
}
function Eu(e) {
	Du = e;
}
function Ph(e, t, r) {
	let { ngOnChanges: n, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
	if (n) {
		let s = ru(t);
		(r.preOrderHooks ??= []).push(e, s),
			(r.preOrderCheckHooks ??= []).push(e, s);
	}
	o && (r.preOrderHooks ??= []).push(0 - e, o),
		i &&
			((r.preOrderHooks ??= []).push(e, i),
			(r.preOrderCheckHooks ??= []).push(e, i));
}
function Cu(e, t) {
	for (let r = t.directiveStart, n = t.directiveEnd; r < n; r++) {
		let i = e.data[r].type.prototype,
			{
				ngAfterContentInit: s,
				ngAfterContentChecked: a,
				ngAfterViewInit: c,
				ngAfterViewChecked: u,
				ngOnDestroy: l,
			} = i;
		s && (e.contentHooks ??= []).push(-r, s),
			a &&
				((e.contentHooks ??= []).push(r, a),
				(e.contentCheckHooks ??= []).push(r, a)),
			c && (e.viewHooks ??= []).push(-r, c),
			u &&
				((e.viewHooks ??= []).push(r, u),
				(e.viewCheckHooks ??= []).push(r, u)),
			l != null && (e.destroyHooks ??= []).push(r, l);
	}
}
function Er(e, t, r) {
	Iu(e, t, 3, r);
}
function Cr(e, t, r, n) {
	(e[I] & 3) === r && Iu(e, t, r, n);
}
function Jo(e, t) {
	let r = e[I];
	(r & 3) === t && ((r &= 16383), (r += 1), (e[I] = r));
}
function Iu(e, t, r, n) {
	let o = n !== void 0 ? e[_t] & 65535 : 0,
		i = n ?? -1,
		s = t.length - 1,
		a = 0;
	for (let c = o; c < s; c++)
		if (typeof t[c + 1] == "number") {
			if (((a = t[c]), n != null && a >= n)) break;
		} else
			t[c] < 0 && (e[_t] += 65536),
				(a < i || i == -1) &&
					(Fh(e, r, t, c), (e[_t] = (e[_t] & 4294901760) + c + 2)),
				c++;
}
function mc(e, t) {
	We(4, e, t);
	let r = ee(null);
	try {
		t.call(e);
	} finally {
		ee(r), We(5, e, t);
	}
}
function Fh(e, t, r, n) {
	let o = r[n] < 0,
		i = r[n + 1],
		s = o ? -r[n] : r[n],
		a = e[s];
	o
		? e[I] >> 14 < e[_t] >> 16 &&
			(e[I] & 3) === t &&
			((e[I] += 16384), mc(a, i))
		: mc(a, i);
}
var Pt = -1,
	yn = class {
		constructor(t, r, n) {
			(this.factory = t),
				(this.resolving = !1),
				(this.canSeeViewProviders = r),
				(this.injectImpl = n);
		}
	};
function kh(e) {
	return e instanceof yn;
}
function Lh(e) {
	return (e.flags & 8) !== 0;
}
function jh(e) {
	return (e.flags & 16) !== 0;
}
function bu(e) {
	return e !== Pt;
}
function Nr(e) {
	return e & 32767;
}
function Vh(e) {
	return e >> 16;
}
function Rr(e, t) {
	let r = Vh(e),
		n = t;
	for (; r > 0; ) (n = n[bn]), r--;
	return n;
}
var hi = !0;
function vc(e) {
	let t = hi;
	return (hi = e), t;
}
var $h = 256,
	Mu = $h - 1,
	Tu = 5,
	Uh = 0,
	Me = {};
function Bh(e, t, r) {
	let n;
	typeof r == "string"
		? (n = r.charCodeAt(0) || 0)
		: r.hasOwnProperty(un) && (n = r[un]),
		n == null && (n = r[un] = Uh++);
	let o = n & Mu,
		i = 1 << o;
	t.data[e + (o >> Tu)] |= i;
}
function Su(e, t) {
	let r = xu(e, t);
	if (r !== -1) return r;
	let n = t[_];
	n.firstCreatePass &&
		((e.injectorIndex = t.length),
		Xo(n.data, e),
		Xo(t, null),
		Xo(n.blueprint, null));
	let o = Zi(e, t),
		i = e.injectorIndex;
	if (bu(o)) {
		let s = Nr(o),
			a = Rr(o, t),
			c = a[_].data;
		for (let u = 0; u < 8; u++) t[i + u] = a[s + u] | c[s + u];
	}
	return (t[i + 8] = o), i;
}
function Xo(e, t) {
	e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function xu(e, t) {
	return e.injectorIndex === -1 ||
		(e.parent && e.parent.injectorIndex === e.injectorIndex) ||
		t[e.injectorIndex + 8] === null
		? -1
		: e.injectorIndex;
}
function Zi(e, t) {
	if (e.parent && e.parent.injectorIndex !== -1)
		return e.parent.injectorIndex;
	let r = 0,
		n = null,
		o = t;
	for (; o !== null; ) {
		if (((n = Ou(o)), n === null)) return Pt;
		if ((r++, (o = o[bn]), n.injectorIndex !== -1))
			return n.injectorIndex | (r << 16);
	}
	return Pt;
}
function Hh(e, t, r) {
	Bh(e, t, r);
}
function Au(e, t, r) {
	if (r & S.Optional || e !== void 0) return e;
	ki(t, "NodeInjector");
}
function _u(e, t, r, n) {
	if (
		(r & S.Optional && n === void 0 && (n = null), !(r & (S.Self | S.Host)))
	) {
		let o = e[kt],
			i = le(void 0);
		try {
			return o ? o.get(t, n, r & S.Optional) : Bc(t, n, r & S.Optional);
		} finally {
			le(i);
		}
	}
	return Au(n, t, r);
}
function Nu(e, t, r, n = S.Default, o) {
	if (e !== null) {
		if (t[I] & 2048 && !(n & S.Self)) {
			let s = Zh(e, t, r, n, Me);
			if (s !== Me) return s;
		}
		let i = Ru(e, t, r, n, Me);
		if (i !== Me) return i;
	}
	return _u(t, r, n, o);
}
function Ru(e, t, r, n, o) {
	let i = Wh(r);
	if (typeof i == "function") {
		if (!hu(t, e, n)) return n & S.Host ? Au(o, r, n) : _u(t, r, n, o);
		try {
			let s;
			if (((s = i(n)), s == null && !(n & S.Optional))) ki(r);
			else return s;
		} finally {
			vu();
		}
	} else if (typeof i == "number") {
		let s = null,
			a = xu(e, t),
			c = Pt,
			u = n & S.Host ? t[Se][Ie] : null;
		for (
			(a === -1 || n & S.SkipSelf) &&
			((c = a === -1 ? Zi(e, t) : t[a + 8]),
			c === Pt || !Dc(n, !1)
				? (a = -1)
				: ((s = t[_]), (a = Nr(c)), (t = Rr(c, t))));
			a !== -1;

		) {
			let l = t[_];
			if (yc(i, a, l.data)) {
				let d = zh(a, t, r, s, n, u);
				if (d !== Me) return d;
			}
			(c = t[a + 8]),
				c !== Pt && Dc(n, t[_].data[a + 8] === u) && yc(i, a, t)
					? ((s = l), (a = Nr(c)), (t = Rr(c, t)))
					: (a = -1);
		}
	}
	return o;
}
function zh(e, t, r, n, o, i) {
	let s = t[_],
		a = s.data[e + 8],
		c = n == null ? Hi(a) && hi : n != s && (a.type & 3) !== 0,
		u = o & S.Host && i === a,
		l = Gh(a, s, r, c, u);
	return l !== null ? Dn(t, s, l, a) : Me;
}
function Gh(e, t, r, n, o) {
	let i = e.providerIndexes,
		s = t.data,
		a = i & 1048575,
		c = e.directiveStart,
		u = e.directiveEnd,
		l = i >> 20,
		d = n ? a : a + l,
		f = o ? a + l : u;
	for (let h = d; h < f; h++) {
		let E = s[h];
		if ((h < c && r === E) || (h >= c && E.type === r)) return h;
	}
	if (o) {
		let h = s[c];
		if (h && Mn(h) && h.type === r) return c;
	}
	return null;
}
function Dn(e, t, r, n) {
	let o = e[r],
		i = t.data;
	if (kh(o)) {
		let s = o;
		s.resolving && _f(Af(i[r]));
		let a = vc(s.canSeeViewProviders);
		s.resolving = !0;
		let c,
			u = s.injectImpl ? le(s.injectImpl) : null,
			l = hu(e, n, S.Default);
		try {
			(o = e[r] = s.factory(void 0, i, e, n)),
				t.firstCreatePass && r >= n.directiveStart && Ph(r, i[r], t);
		} finally {
			u !== null && le(u), vc(a), (s.resolving = !1), vu();
		}
	}
	return o;
}
function Wh(e) {
	if (typeof e == "string") return e.charCodeAt(0) || 0;
	let t = e.hasOwnProperty(un) ? e[un] : void 0;
	return typeof t == "number" ? (t >= 0 ? t & Mu : qh) : t;
}
function yc(e, t, r) {
	let n = 1 << e;
	return !!(r[t + (e >> Tu)] & n);
}
function Dc(e, t) {
	return !(e & S.Self) && !(e & S.Host && t);
}
var at = class {
	constructor(t, r) {
		(this._tNode = t), (this._lView = r);
	}
	get(t, r, n) {
		return Nu(this._tNode, this._lView, t, Hr(n), r);
	}
};
function qh() {
	return new at(Qe(), he());
}
function Yi(e) {
	return Li(() => {
		let t = e.prototype.constructor,
			r = t[Tr] || pi(t),
			n = Object.prototype,
			o = Object.getPrototypeOf(e.prototype).constructor;
		for (; o && o !== n; ) {
			let i = o[Tr] || pi(o);
			if (i && i !== r) return i;
			o = Object.getPrototypeOf(o);
		}
		return (i) => new i();
	});
}
function pi(e) {
	return kc(e)
		? () => {
				let t = pi(de(e));
				return t && t();
			}
		: Lt(e);
}
function Zh(e, t, r, n, o) {
	let i = e,
		s = t;
	for (; i !== null && s !== null && s[I] & 2048 && !(s[I] & 512); ) {
		let a = Ru(i, s, r, n | S.Self, Me);
		if (a !== Me) return a;
		let c = i.parent;
		if (!c) {
			let u = s[Xc];
			if (u) {
				let l = u.get(r, Me, n);
				if (l !== Me) return l;
			}
			(c = Ou(s)), (s = s[bn]);
		}
		i = c;
	}
	return o;
}
function Ou(e) {
	let t = e[_],
		r = t.type;
	return r === 2 ? t.declTNode : r === 1 ? e[Ie] : null;
}
function Yh(e) {
	return typeof e == "function";
}
function Qi(e, t) {
	e.forEach((r) => (Array.isArray(r) ? Qi(r, t) : t(r)));
}
function Pu(e, t, r) {
	t >= e.length ? e.push(r) : e.splice(t, 0, r);
}
function Or(e, t) {
	return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
var jt = new b("ENVIRONMENT_INITIALIZER"),
	Fu = new b("INJECTOR", -1),
	ku = new b("INJECTOR_DEF_TYPES"),
	Pr = class {
		get(t, r = hn) {
			if (r === hn) {
				let n = new Error(
					`NullInjectorError: No provider for ${ie(t)}!`,
				);
				throw ((n.name = "NullInjectorError"), n);
			}
			return r;
		}
	};
function Ut(e) {
	return { ɵproviders: e };
}
function Qh(...e) {
	return { ɵproviders: Lu(!0, e), ɵfromNgModule: !0 };
}
function Lu(e, ...t) {
	let r = [],
		n = new Set(),
		o,
		i = (s) => {
			r.push(s);
		};
	return (
		Qi(t, (s) => {
			let a = s;
			gi(a, i, [], n) && ((o ||= []), o.push(a));
		}),
		o !== void 0 && ju(o, i),
		r
	);
}
function ju(e, t) {
	for (let r = 0; r < e.length; r++) {
		let { ngModule: n, providers: o } = e[r];
		Ki(o, (i) => {
			t(i, n);
		});
	}
}
function gi(e, t, r, n) {
	if (((e = de(e)), !e)) return !1;
	let o = null,
		i = ic(e),
		s = !i && ct(e);
	if (!i && !s) {
		let c = e.ngModule;
		if (((i = ic(c)), i)) o = c;
		else return !1;
	} else {
		if (s && !s.standalone) return !1;
		o = e;
	}
	let a = n.has(o);
	if (s) {
		if (a) return !1;
		if ((n.add(o), s.dependencies)) {
			let c =
				typeof s.dependencies == "function"
					? s.dependencies()
					: s.dependencies;
			for (let u of c) gi(u, t, r, n);
		}
	} else if (i) {
		if (i.imports != null && !a) {
			n.add(o);
			let u;
			try {
				Qi(i.imports, (l) => {
					gi(l, t, r, n) && ((u ||= []), u.push(l));
				});
			} finally {
			}
			u !== void 0 && ju(u, t);
		}
		if (!a) {
			let u = Lt(o) || (() => new o());
			t({ provide: o, useFactory: u, deps: Ft }, o),
				t({ provide: ku, useValue: o, multi: !0 }, o),
				t({ provide: jt, useValue: () => v(o), multi: !0 }, o);
		}
		let c = i.providers;
		if (c != null && !a) {
			let u = e;
			Ki(c, (l) => {
				t(l, u);
			});
		}
	} else return !1;
	return o !== e && e.providers !== void 0;
}
function Ki(e, t) {
	for (let r of e)
		Lc(r) && (r = r.ɵproviders), Array.isArray(r) ? Ki(r, t) : t(r);
}
var Kh = k({ provide: String, useValue: k });
function Vu(e) {
	return e !== null && typeof e == "object" && Kh in e;
}
function Jh(e) {
	return !!(e && e.useExisting);
}
function Xh(e) {
	return !!(e && e.useFactory);
}
function mi(e) {
	return typeof e == "function";
}
var Zr = new b("Set Injector scope."),
	Ir = {},
	ep = {},
	ei;
function Ji() {
	return ei === void 0 && (ei = new Pr()), ei;
}
var X = class {},
	wn = class extends X {
		get destroyed() {
			return this._destroyed;
		}
		constructor(t, r, n, o) {
			super(),
				(this.parent = r),
				(this.source = n),
				(this.scopes = o),
				(this.records = new Map()),
				(this._ngOnDestroyHooks = new Set()),
				(this._onDestroyHooks = []),
				(this._destroyed = !1),
				yi(t, (s) => this.processProvider(s)),
				this.records.set(Fu, Nt(void 0, this)),
				o.has("environment") && this.records.set(X, Nt(void 0, this));
			let i = this.records.get(Zr);
			i != null && typeof i.value == "string" && this.scopes.add(i.value),
				(this.injectorDefTypes = new Set(this.get(ku, Ft, S.Self)));
		}
		destroy() {
			this.assertNotDestroyed(), (this._destroyed = !0);
			try {
				for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
				let t = this._onDestroyHooks;
				this._onDestroyHooks = [];
				for (let r of t) r();
			} finally {
				this.records.clear(),
					this._ngOnDestroyHooks.clear(),
					this.injectorDefTypes.clear();
			}
		}
		onDestroy(t) {
			return (
				this.assertNotDestroyed(),
				this._onDestroyHooks.push(t),
				() => this.removeOnDestroy(t)
			);
		}
		runInContext(t) {
			this.assertNotDestroyed();
			let r = Ge(this),
				n = le(void 0),
				o;
			try {
				return t();
			} finally {
				Ge(r), le(n);
			}
		}
		get(t, r = hn, n = S.Default) {
			if ((this.assertNotDestroyed(), t.hasOwnProperty(rc)))
				return t[rc](this);
			n = Hr(n);
			let o,
				i = Ge(this),
				s = le(void 0);
			try {
				if (!(n & S.SkipSelf)) {
					let c = this.records.get(t);
					if (c === void 0) {
						let u = sp(t) && Br(t);
						u && this.injectableDefInScope(u)
							? (c = Nt(vi(t), Ir))
							: (c = null),
							this.records.set(t, c);
					}
					if (c != null) return this.hydrate(t, c);
				}
				let a = n & S.Self ? Ji() : this.parent;
				return (r = n & S.Optional && r === hn ? null : r), a.get(t, r);
			} catch (a) {
				if (a.name === "NullInjectorError") {
					if (((a[Sr] = a[Sr] || []).unshift(ie(t)), i)) throw a;
					return Hf(a, t, "R3InjectorError", this.source);
				} else throw a;
			} finally {
				le(s), Ge(i);
			}
		}
		resolveInjectorInitializers() {
			let t = Ge(this),
				r = le(void 0),
				n;
			try {
				let o = this.get(jt, Ft, S.Self);
				for (let i of o) i();
			} finally {
				Ge(t), le(r);
			}
		}
		toString() {
			let t = [],
				r = this.records;
			for (let n of r.keys()) t.push(ie(n));
			return `R3Injector[${t.join(", ")}]`;
		}
		assertNotDestroyed() {
			if (this._destroyed) throw new D(205, !1);
		}
		processProvider(t) {
			t = de(t);
			let r = mi(t) ? t : de(t && t.provide),
				n = np(t);
			if (!mi(t) && t.multi === !0) {
				let o = this.records.get(r);
				o ||
					((o = Nt(void 0, Ir, !0)),
					(o.factory = () => ci(o.multi)),
					this.records.set(r, o)),
					(r = t),
					o.multi.push(t);
			}
			this.records.set(r, n);
		}
		hydrate(t, r) {
			return (
				r.value === Ir && ((r.value = ep), (r.value = r.factory())),
				typeof r.value == "object" &&
					r.value &&
					ip(r.value) &&
					this._ngOnDestroyHooks.add(r.value),
				r.value
			);
		}
		injectableDefInScope(t) {
			if (!t.providedIn) return !1;
			let r = de(t.providedIn);
			return typeof r == "string"
				? r === "any" || this.scopes.has(r)
				: this.injectorDefTypes.has(r);
		}
		removeOnDestroy(t) {
			let r = this._onDestroyHooks.indexOf(t);
			r !== -1 && this._onDestroyHooks.splice(r, 1);
		}
	};
function vi(e) {
	let t = Br(e),
		r = t !== null ? t.factory : Lt(e);
	if (r !== null) return r;
	if (e instanceof b) throw new D(204, !1);
	if (e instanceof Function) return tp(e);
	throw new D(204, !1);
}
function tp(e) {
	if (e.length > 0) throw new D(204, !1);
	let r = Of(e);
	return r !== null ? () => r.factory(e) : () => new e();
}
function np(e) {
	if (Vu(e)) return Nt(void 0, e.useValue);
	{
		let t = rp(e);
		return Nt(t, Ir);
	}
}
function rp(e, t, r) {
	let n;
	if (mi(e)) {
		let o = de(e);
		return Lt(o) || vi(o);
	} else if (Vu(e)) n = () => de(e.useValue);
	else if (Xh(e)) n = () => e.useFactory(...ci(e.deps || []));
	else if (Jh(e)) n = () => v(de(e.useExisting));
	else {
		let o = de(e && (e.useClass || e.provide));
		if (op(e)) n = () => new o(...ci(e.deps));
		else return Lt(o) || vi(o);
	}
	return n;
}
function Nt(e, t, r = !1) {
	return { factory: e, value: t, multi: r ? [] : void 0 };
}
function op(e) {
	return !!e.deps;
}
function ip(e) {
	return (
		e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
	);
}
function sp(e) {
	return typeof e == "function" || (typeof e == "object" && e instanceof b);
}
function yi(e, t) {
	for (let r of e)
		Array.isArray(r) ? yi(r, t) : r && Lc(r) ? yi(r.ɵproviders, t) : t(r);
}
function Ve(e, t) {
	e instanceof wn && e.assertNotDestroyed();
	let r,
		n = Ge(e),
		o = le(void 0);
	try {
		return t();
	} finally {
		Ge(n), le(o);
	}
}
function wc(e, t = null, r = null, n) {
	let o = $u(e, t, r, n);
	return o.resolveInjectorInitializers(), o;
}
function $u(e, t = null, r = null, n, o = new Set()) {
	let i = [r || Ft, Qh(e)];
	return (
		(n = n || (typeof e == "object" ? void 0 : ie(e))),
		new wn(i, t || Ji(), n || null, o)
	);
}
var Bt = (() => {
	let t = class t {
		static create(n, o) {
			if (Array.isArray(n)) return wc({ name: "" }, o, n, "");
			{
				let i = n.name ?? "";
				return wc({ name: i }, n.parent, n.providers, i);
			}
		}
	};
	(t.THROW_IF_NOT_FOUND = hn),
		(t.NULL = new Pr()),
		(t.ɵprov = m({ token: t, providedIn: "any", factory: () => v(Fu) })),
		(t.__NG_ELEMENT_ID__ = -1);
	let e = t;
	return e;
})();
var Di;
function Uu(e) {
	Di = e;
}
function ap() {
	if (Di !== void 0) return Di;
	if (typeof document < "u") return document;
	throw new D(210, !1);
}
var Xi = new b("AppId", { providedIn: "root", factory: () => cp }),
	cp = "ng",
	es = new b("Platform Initializer"),
	Ke = new b("Platform ID", {
		providedIn: "platform",
		factory: () => "unknown",
	});
var ts = new b("CSP nonce", {
	providedIn: "root",
	factory: () =>
		ap().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
		null,
});
function Bu(e) {
	return e instanceof Function ? e() : e;
}
function Hu(e) {
	return (e.flags & 128) === 128;
}
var ht = (function (e) {
	return (
		(e[(e.Important = 1)] = "Important"),
		(e[(e.DashCase = 2)] = "DashCase"),
		e
	);
})(ht || {});
var zu = new Map(),
	up = 0;
function lp() {
	return up++;
}
function dp(e) {
	zu.set(e[zr], e);
}
function fp(e) {
	zu.delete(e[zr]);
}
var Ec = "__ngContext__";
function Vt(e, t) {
	Ot(t) ? ((e[Ec] = t[zr]), dp(t)) : (e[Ec] = t);
}
var hp;
function ns(e, t) {
	return hp(e, t);
}
function Rt(e, t, r, n, o) {
	if (n != null) {
		let i,
			s = !1;
		Le(n) ? (i = n) : Ot(n) && ((s = !0), (n = n[ke]));
		let a = Pe(n);
		e === 0 && r !== null
			? o == null
				? Yu(t, r, a)
				: Fr(t, r, a, o || null, !0)
			: e === 1 && r !== null
				? Fr(t, r, a, o || null, !0)
				: e === 2
					? _p(t, a, s)
					: e === 3 && t.destroyNode(a),
			i != null && Rp(t, e, i, r, o);
	}
}
function pp(e, t) {
	return e.createText(t);
}
function gp(e, t, r) {
	e.setValue(t, r);
}
function Gu(e, t, r) {
	return e.createElement(t, r);
}
function mp(e, t) {
	Wu(e, t), (t[ke] = null), (t[Ie] = null);
}
function vp(e, t, r, n, o, i) {
	(n[ke] = o), (n[Ie] = t), Yr(e, n, r, 1, o, i);
}
function Wu(e, t) {
	t[Oe].changeDetectionScheduler?.notify(), Yr(e, t, t[Ce], 2, null, null);
}
function yp(e) {
	let t = e[gn];
	if (!t) return ti(e[_], e);
	for (; t; ) {
		let r = null;
		if (Ot(t)) r = t[gn];
		else {
			let n = t[fe];
			n && (r = n);
		}
		if (!r) {
			for (; t && !t[Ee] && t !== e; ) Ot(t) && ti(t[_], t), (t = t[Q]);
			t === null && (t = e), Ot(t) && ti(t[_], t), (r = t && t[Ee]);
		}
		t = r;
	}
}
function Dp(e, t, r, n) {
	let o = fe + n,
		i = r.length;
	n > 0 && (r[o - 1][Ee] = t),
		n < i - fe
			? ((t[Ee] = r[o]), Pu(r, fe + n, t))
			: (r.push(t), (t[Ee] = null)),
		(t[Q] = r);
	let s = t[$i];
	s !== null && r !== s && wp(s, t);
	let a = t[Ui];
	a !== null && a.insertView(e), di(t), (t[I] |= 128);
}
function wp(e, t) {
	let r = e[_r],
		o = t[Q][Q][Se];
	t[Se] !== o && (e[I] |= Bi.HasTransplantedViews),
		r === null ? (e[_r] = [t]) : r.push(t);
}
function qu(e, t) {
	let r = e[_r],
		n = r.indexOf(t);
	r.splice(n, 1);
}
function wi(e, t) {
	if (e.length <= fe) return;
	let r = fe + t,
		n = e[r];
	if (n) {
		let o = n[$i];
		o !== null && o !== e && qu(o, n), t > 0 && (e[r - 1][Ee] = n[Ee]);
		let i = Or(e, fe + t);
		mp(n[_], n);
		let s = i[Ui];
		s !== null && s.detachView(i[_]),
			(n[Q] = null),
			(n[Ee] = null),
			(n[I] &= -129);
	}
	return n;
}
function Zu(e, t) {
	if (!(t[I] & 256)) {
		let r = t[Ce];
		r.destroyNode && Yr(e, t, r, 3, null, null), yp(t);
	}
}
function ti(e, t) {
	if (!(t[I] & 256)) {
		(t[I] &= -129),
			(t[I] |= 256),
			t[ut] && Ta(t[ut]),
			Cp(e, t),
			Ep(e, t),
			t[_].type === 1 && t[Ce].destroy();
		let r = t[$i];
		if (r !== null && Le(t[Q])) {
			r !== t[Q] && qu(r, t);
			let n = t[Ui];
			n !== null && n.detachView(e);
		}
		fp(t);
	}
}
function Ep(e, t) {
	let r = e.cleanup,
		n = t[fc];
	if (r !== null)
		for (let i = 0; i < r.length - 1; i += 2)
			if (typeof r[i] == "string") {
				let s = r[i + 3];
				s >= 0 ? n[s]() : n[-s].unsubscribe(), (i += 2);
			} else {
				let s = n[r[i + 1]];
				r[i].call(s);
			}
	n !== null && (t[fc] = null);
	let o = t[fn];
	if (o !== null) {
		t[fn] = null;
		for (let i = 0; i < o.length; i++) {
			let s = o[i];
			s();
		}
	}
}
function Cp(e, t) {
	let r;
	if (e != null && (r = e.destroyHooks) != null)
		for (let n = 0; n < r.length; n += 2) {
			let o = t[r[n]];
			if (!(o instanceof yn)) {
				let i = r[n + 1];
				if (Array.isArray(i))
					for (let s = 0; s < i.length; s += 2) {
						let a = o[i[s]],
							c = i[s + 1];
						We(4, a, c);
						try {
							c.call(a);
						} finally {
							We(5, a, c);
						}
					}
				else {
					We(4, o, i);
					try {
						i.call(o);
					} finally {
						We(5, o, i);
					}
				}
			}
		}
}
function Ip(e, t, r) {
	return bp(e, t.parent, r);
}
function bp(e, t, r) {
	let n = t;
	for (; n !== null && n.type & 40; ) (t = n), (n = t.parent);
	if (n === null) return r[ke];
	{
		let { componentOffset: o } = n;
		if (o > -1) {
			let { encapsulation: i } = e.data[n.directiveStart + o];
			if (i === Te.None || i === Te.Emulated) return null;
		}
		return je(n, r);
	}
}
function Fr(e, t, r, n, o) {
	e.insertBefore(t, r, n, o);
}
function Yu(e, t, r) {
	e.appendChild(t, r);
}
function Cc(e, t, r, n, o) {
	n !== null ? Fr(e, t, r, n, o) : Yu(e, t, r);
}
function Mp(e, t, r, n) {
	e.removeChild(t, r, n);
}
function rs(e, t) {
	return e.parentNode(t);
}
function Tp(e, t) {
	return e.nextSibling(t);
}
function Sp(e, t, r) {
	return Ap(e, t, r);
}
function xp(e, t, r) {
	return e.type & 40 ? je(e, r) : null;
}
var Ap = xp,
	Ic;
function Qu(e, t, r, n) {
	let o = Ip(e, n, t),
		i = t[Ce],
		s = n.parent || t[Ie],
		a = Sp(s, n, t);
	if (o != null)
		if (Array.isArray(r))
			for (let c = 0; c < r.length; c++) Cc(i, o, r[c], a, !1);
		else Cc(i, o, r, a, !1);
	Ic !== void 0 && Ic(i, n, t, r, o);
}
function br(e, t) {
	if (t !== null) {
		let r = t.type;
		if (r & 3) return je(t, e);
		if (r & 4) return Ei(-1, e[t.index]);
		if (r & 8) {
			let n = t.child;
			if (n !== null) return br(e, n);
			{
				let o = e[t.index];
				return Le(o) ? Ei(-1, o) : Pe(o);
			}
		} else {
			if (r & 32) return ns(t, e)() || Pe(e[t.index]);
			{
				let n = Ku(e, t);
				if (n !== null) {
					if (Array.isArray(n)) return n[0];
					let o = vn(e[Se]);
					return br(o, n);
				} else return br(e, t.next);
			}
		}
	}
	return null;
}
function Ku(e, t) {
	if (t !== null) {
		let n = e[Se][Ie],
			o = t.projection;
		return n.projection[o];
	}
	return null;
}
function Ei(e, t) {
	let r = fe + e + 1;
	if (r < t.length) {
		let n = t[r],
			o = n[_].firstChild;
		if (o !== null) return br(n, o);
	}
	return t[dt];
}
function _p(e, t, r) {
	let n = rs(e, t);
	n && Mp(e, n, t, r);
}
function os(e, t, r, n, o, i, s) {
	for (; r != null; ) {
		let a = n[r.index],
			c = r.type;
		if (
			(s && t === 0 && (a && Vt(Pe(a), n), (r.flags |= 2)),
			(r.flags & 32) !== 32)
		)
			if (c & 8) os(e, t, r.child, n, o, i, !1), Rt(t, e, o, a, i);
			else if (c & 32) {
				let u = ns(r, n),
					l;
				for (; (l = u()); ) Rt(t, e, o, l, i);
				Rt(t, e, o, a, i);
			} else c & 16 ? Np(e, t, n, r, o, i) : Rt(t, e, o, a, i);
		r = s ? r.projectionNext : r.next;
	}
}
function Yr(e, t, r, n, o, i) {
	os(r, n, e.firstChild, t, o, i, !1);
}
function Np(e, t, r, n, o, i) {
	let s = r[Se],
		c = s[Ie].projection[n.projection];
	if (Array.isArray(c))
		for (let u = 0; u < c.length; u++) {
			let l = c[u];
			Rt(t, e, o, l, i);
		}
	else {
		let u = c,
			l = s[Q];
		Hu(n) && (u.flags |= 128), os(e, t, u, l, o, i, !0);
	}
}
function Rp(e, t, r, n, o) {
	let i = r[dt],
		s = Pe(r);
	i !== s && Rt(t, e, n, i, o);
	for (let a = fe; a < r.length; a++) {
		let c = r[a];
		Yr(c[_], c, e, t, n, i);
	}
}
function Op(e, t, r) {
	e.setAttribute(t, "style", r);
}
function Ju(e, t, r) {
	r === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", r);
}
function Xu(e, t, r) {
	let { mergedAttrs: n, classes: o, styles: i } = r;
	n !== null && ui(e, t, n),
		o !== null && Ju(e, t, o),
		i !== null && Op(e, t, i);
}
var Ci = class {};
var Pp = "h",
	Fp = "b";
var kp = () => null;
function is(e, t, r = !1) {
	return kp(e, t, r);
}
var Ii = class {},
	kr = class {};
function Lp(e) {
	let t = Error(`No component factory found for ${ie(e)}.`);
	return (t[jp] = e), t;
}
var jp = "ngComponent";
var bi = class {
		resolveComponentFactory(t) {
			throw Lp(t);
		}
	},
	Qr = (() => {
		let t = class t {};
		t.NULL = new bi();
		let e = t;
		return e;
	})();
function Vp() {
	return ss(Qe(), he());
}
function ss(e, t) {
	return new Kr(je(e, t));
}
var Kr = (() => {
	let t = class t {
		constructor(n) {
			this.nativeElement = n;
		}
	};
	t.__NG_ELEMENT_ID__ = Vp;
	let e = t;
	return e;
})();
var En = class {};
var $p = (() => {
		let t = class t {};
		t.ɵprov = m({ token: t, providedIn: "root", factory: () => null });
		let e = t;
		return e;
	})(),
	ni = {};
function Lr(e, t, r, n, o = !1) {
	for (; r !== null; ) {
		let i = t[r.index];
		i !== null && n.push(Pe(i)), Le(i) && Up(i, n);
		let s = r.type;
		if (s & 8) Lr(e, t, r.child, n);
		else if (s & 32) {
			let a = ns(r, t),
				c;
			for (; (c = a()); ) n.push(c);
		} else if (s & 16) {
			let a = Ku(t, r);
			if (Array.isArray(a)) n.push(...a);
			else {
				let c = vn(t[Se]);
				Lr(c[_], c, a, n, !0);
			}
		}
		r = o ? r.projectionNext : r.next;
	}
	return n;
}
function Up(e, t) {
	for (let r = fe; r < e.length; r++) {
		let n = e[r],
			o = n[_].firstChild;
		o !== null && Lr(n[_], n, o, t);
	}
	e[dt] !== e[ke] && t.push(e[dt]);
}
var el = [];
function Bp(e) {
	return e[ut] ?? Hp(e);
}
function Hp(e) {
	let t = el.pop() ?? Object.create(Gp);
	return (t.lView = e), t;
}
function zp(e) {
	e.lView[ut] !== e && ((e.lView = null), el.push(e));
}
var Gp = V(g({}, Ia), {
	consumerIsAlwaysLive: !0,
	consumerMarkedDirty: (e) => {
		mn(e.lView);
	},
	consumerOnSignalRead() {
		this.lView[ut] = this;
	},
});
function tl(e) {
	return rl(e[gn]);
}
function nl(e) {
	return rl(e[Ee]);
}
function rl(e) {
	for (; e !== null && !Le(e); ) e = e[Ee];
	return e;
}
var Wp = "ngOriginalError";
function ri(e) {
	return e[Wp];
}
var Fe = class {
		constructor() {
			this._console = console;
		}
		handleError(t) {
			let r = this._findOriginalError(t);
			this._console.error("ERROR", t),
				r && this._console.error("ORIGINAL ERROR", r);
		}
		_findOriginalError(t) {
			let r = t && ri(t);
			for (; r && ri(r); ) r = ri(r);
			return r || null;
		}
	},
	ol = new b("", {
		providedIn: "root",
		factory: () => p(Fe).handleError.bind(void 0),
	});
var il = !1,
	qp = new b("", { providedIn: "root", factory: () => il });
var Jr = {};
function Sn(e = 1) {
	sl(Wr(), he(), qi() + e, !1);
}
function sl(e, t, r, n) {
	if (!n)
		if ((t[I] & 3) === 3) {
			let i = e.preOrderCheckHooks;
			i !== null && Er(t, i, r);
		} else {
			let i = e.preOrderHooks;
			i !== null && Cr(t, i, 0, r);
		}
	ft(r);
}
function xn(e, t = S.Default) {
	let r = he();
	if (r === null) return v(e, t);
	let n = Qe();
	return Nu(n, r, de(e), t);
}
function al(e, t, r, n, o, i) {
	let s = ee(null);
	try {
		let a = null;
		o & qe.SignalBased && (a = t[n][Ca]),
			a !== null && a.transformFn !== void 0 && (i = a.transformFn(i)),
			o & qe.HasDecoratorInputTransform &&
				(i = e.inputTransforms[n].call(t, i)),
			e.setInput !== null ? e.setInput(t, a, i, r, n) : nu(t, a, n, i);
	} finally {
		ee(s);
	}
}
function Zp(e, t) {
	let r = e.hostBindingOpCodes;
	if (r !== null)
		try {
			for (let n = 0; n < r.length; n++) {
				let o = r[n];
				if (o < 0) ft(~o);
				else {
					let i = o,
						s = r[++n],
						a = r[++n];
					_h(s, i);
					let c = t[i];
					a(2, c);
				}
			}
		} finally {
			ft(-1);
		}
}
function as(e, t, r, n, o, i, s, a, c, u, l) {
	let d = t.blueprint.slice();
	return (
		(d[ke] = o),
		(d[I] = n | 4 | 128 | 8 | 64),
		(u !== null || (e && e[I] & 2048)) && (d[I] |= 2048),
		au(d),
		(d[Q] = d[bn] = e),
		(d[Ze] = r),
		(d[Oe] = s || (e && e[Oe])),
		(d[Ce] = a || (e && e[Ce])),
		(d[kt] = c || (e && e[kt]) || null),
		(d[Ie] = i),
		(d[zr] = lp()),
		(d[xr] = l),
		(d[Xc] = u),
		(d[Se] = t.type == 2 ? e[Se] : d),
		d
	);
}
function cs(e, t, r, n, o) {
	let i = e.data[t];
	if (i === null) (i = Yp(e, t, r, n, o)), Ah() && (i.flags |= 32);
	else if (i.type & 64) {
		(i.type = r), (i.value = n), (i.attrs = o);
		let s = Mh();
		i.injectorIndex = s === null ? -1 : s.injectorIndex;
	}
	return qr(i, !0), i;
}
function Yp(e, t, r, n, o) {
	let i = lu(),
		s = du(),
		a = s ? i : i && i.parent,
		c = (e.data[t] = ng(e, a, r, t, n, o));
	return (
		e.firstChild === null && (e.firstChild = c),
		i !== null &&
			(s
				? i.child == null && c.parent !== null && (i.child = c)
				: i.next === null && ((i.next = c), (c.prev = i))),
		c
	);
}
function cl(e, t, r, n) {
	if (r === 0) return -1;
	let o = t.length;
	for (let i = 0; i < r; i++)
		t.push(n), e.blueprint.push(n), e.data.push(null);
	return o;
}
function ul(e, t, r, n, o) {
	let i = qi(),
		s = n & 2;
	try {
		ft(-1),
			s && t.length > lt && sl(e, t, lt, !1),
			We(s ? 2 : 0, o),
			r(n, o);
	} finally {
		ft(i), We(s ? 3 : 1, o);
	}
}
function ll(e, t, r) {
	if (tu(t)) {
		let n = ee(null);
		try {
			let o = t.directiveStart,
				i = t.directiveEnd;
			for (let s = o; s < i; s++) {
				let a = e.data[s];
				a.contentQueries && a.contentQueries(1, r[s], s);
			}
		} finally {
			ee(n);
		}
	}
}
function Qp(e, t, r) {
	uu() && (ag(e, t, r, je(r, t)), (r.flags & 64) === 64 && pl(e, t, r));
}
function Kp(e, t, r = je) {
	let n = t.localNames;
	if (n !== null) {
		let o = t.index + 1;
		for (let i = 0; i < n.length; i += 2) {
			let s = n[i + 1],
				a = s === -1 ? r(t, e) : e[s];
			e[o++] = a;
		}
	}
}
function dl(e) {
	let t = e.tView;
	return t === null || t.incompleteFirstPass
		? (e.tView = fl(
				1,
				null,
				e.template,
				e.decls,
				e.vars,
				e.directiveDefs,
				e.pipeDefs,
				e.viewQuery,
				e.schemas,
				e.consts,
				e.id,
			))
		: t;
}
function fl(e, t, r, n, o, i, s, a, c, u, l) {
	let d = lt + n,
		f = d + o,
		h = Jp(d, f),
		E = typeof u == "function" ? u() : u;
	return (h[_] = {
		type: e,
		blueprint: h,
		template: r,
		queries: null,
		viewQuery: a,
		declTNode: t,
		data: h.slice().fill(null, d),
		bindingStartIndex: d,
		expandoStartIndex: f,
		hostBindingOpCodes: null,
		firstCreatePass: !0,
		firstUpdatePass: !0,
		staticViewQueries: !1,
		staticContentQueries: !1,
		preOrderHooks: null,
		preOrderCheckHooks: null,
		contentHooks: null,
		contentCheckHooks: null,
		viewHooks: null,
		viewCheckHooks: null,
		destroyHooks: null,
		cleanup: null,
		contentQueries: null,
		components: null,
		directiveRegistry: typeof i == "function" ? i() : i,
		pipeRegistry: typeof s == "function" ? s() : s,
		firstChild: null,
		schemas: c,
		consts: E,
		incompleteFirstPass: !1,
		ssrId: l,
	});
}
function Jp(e, t) {
	let r = [];
	for (let n = 0; n < t; n++) r.push(n < e ? null : Jr);
	return r;
}
function Xp(e, t, r, n) {
	let i = n.get(qp, il) || r === Te.ShadowDom,
		s = e.selectRootElement(t, i);
	return eg(s), s;
}
function eg(e) {
	tg(e);
}
var tg = () => null;
function ng(e, t, r, n, o, i) {
	let s = t ? t.injectorIndex : -1,
		a = 0;
	return (
		Ch() && (a |= 128),
		{
			type: r,
			index: n,
			insertBeforeIndex: null,
			injectorIndex: s,
			directiveStart: -1,
			directiveEnd: -1,
			directiveStylingLast: -1,
			componentOffset: -1,
			propertyBindings: null,
			flags: a,
			providerIndexes: 0,
			value: o,
			attrs: i,
			mergedAttrs: null,
			localNames: null,
			initialInputs: void 0,
			inputs: null,
			outputs: null,
			tView: null,
			next: null,
			prev: null,
			projectionNext: null,
			child: null,
			parent: t,
			projection: null,
			styles: null,
			stylesWithoutHost: null,
			residualStyles: void 0,
			classes: null,
			classesWithoutHost: null,
			residualClasses: void 0,
			classBindings: 0,
			styleBindings: 0,
		}
	);
}
function bc(e, t, r, n, o) {
	for (let i in t) {
		if (!t.hasOwnProperty(i)) continue;
		let s = t[i];
		if (s === void 0) continue;
		n ??= {};
		let a,
			c = qe.None;
		Array.isArray(s) ? ((a = s[0]), (c = s[1])) : (a = s);
		let u = i;
		if (o !== null) {
			if (!o.hasOwnProperty(i)) continue;
			u = o[i];
		}
		e === 0 ? Mc(n, r, u, a, c) : Mc(n, r, u, a);
	}
	return n;
}
function Mc(e, t, r, n, o) {
	let i;
	e.hasOwnProperty(r) ? (i = e[r]).push(t, n) : (i = e[r] = [t, n]),
		o !== void 0 && i.push(o);
}
function rg(e, t, r) {
	let n = t.directiveStart,
		o = t.directiveEnd,
		i = e.data,
		s = t.attrs,
		a = [],
		c = null,
		u = null;
	for (let l = n; l < o; l++) {
		let d = i[l],
			f = r ? r.get(d) : null,
			h = f ? f.inputs : null,
			E = f ? f.outputs : null;
		(c = bc(0, d.inputs, l, c, h)), (u = bc(1, d.outputs, l, u, E));
		let F = c !== null && s !== null && !Wc(t) ? mg(c, l, s) : null;
		a.push(F);
	}
	c !== null &&
		(c.hasOwnProperty("class") && (t.flags |= 8),
		c.hasOwnProperty("style") && (t.flags |= 16)),
		(t.initialInputs = a),
		(t.inputs = c),
		(t.outputs = u);
}
function og(e, t, r, n) {
	if (uu()) {
		let o = n === null ? null : { "": -1 },
			i = ug(e, r),
			s,
			a;
		i === null ? (s = a = null) : ([s, a] = i),
			s !== null && hl(e, t, r, s, o, a),
			o && lg(r, n, o);
	}
	r.mergedAttrs = ji(r.mergedAttrs, r.attrs);
}
function hl(e, t, r, n, o, i) {
	for (let u = 0; u < n.length; u++) Hh(Su(r, t), e, n[u].type);
	fg(r, e.data.length, n.length);
	for (let u = 0; u < n.length; u++) {
		let l = n[u];
		l.providersResolver && l.providersResolver(l);
	}
	let s = !1,
		a = !1,
		c = cl(e, t, n.length, null);
	for (let u = 0; u < n.length; u++) {
		let l = n[u];
		(r.mergedAttrs = ji(r.mergedAttrs, l.hostAttrs)),
			hg(e, r, t, c, l),
			dg(c, l, o),
			l.contentQueries !== null && (r.flags |= 4),
			(l.hostBindings !== null ||
				l.hostAttrs !== null ||
				l.hostVars !== 0) &&
				(r.flags |= 64);
		let d = l.type.prototype;
		!s &&
			(d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
			((e.preOrderHooks ??= []).push(r.index), (s = !0)),
			!a &&
				(d.ngOnChanges || d.ngDoCheck) &&
				((e.preOrderCheckHooks ??= []).push(r.index), (a = !0)),
			c++;
	}
	rg(e, r, i);
}
function ig(e, t, r, n, o) {
	let i = o.hostBindings;
	if (i) {
		let s = e.hostBindingOpCodes;
		s === null && (s = e.hostBindingOpCodes = []);
		let a = ~t.index;
		sg(s) != a && s.push(a), s.push(r, n, i);
	}
}
function sg(e) {
	let t = e.length;
	for (; t > 0; ) {
		let r = e[--t];
		if (typeof r == "number" && r < 0) return r;
	}
	return 0;
}
function ag(e, t, r, n) {
	let o = r.directiveStart,
		i = r.directiveEnd;
	Hi(r) && pg(t, r, e.data[o + r.componentOffset]),
		e.firstCreatePass || Su(r, t),
		Vt(n, t);
	let s = r.initialInputs;
	for (let a = o; a < i; a++) {
		let c = e.data[a],
			u = Dn(t, e, a, r);
		if ((Vt(u, t), s !== null && gg(t, a - o, u, c, r, s), Mn(c))) {
			let l = Tn(r.index, t);
			l[Ze] = Dn(t, e, a, r);
		}
	}
}
function pl(e, t, r) {
	let n = r.directiveStart,
		o = r.directiveEnd,
		i = r.index,
		s = Nh();
	try {
		ft(i);
		for (let a = n; a < o; a++) {
			let c = e.data[a],
				u = t[a];
			fi(a),
				(c.hostBindings !== null ||
					c.hostVars !== 0 ||
					c.hostAttrs !== null) &&
					cg(c, u);
		}
	} finally {
		ft(-1), fi(s);
	}
}
function cg(e, t) {
	e.hostBindings !== null && e.hostBindings(1, t);
}
function ug(e, t) {
	let r = e.directiveRegistry,
		n = null,
		o = null;
	if (r)
		for (let i = 0; i < r.length; i++) {
			let s = r[i];
			if (Kf(t, s.selectors, !1))
				if ((n || (n = []), Mn(s)))
					if (s.findHostDirectiveDefs !== null) {
						let a = [];
						(o = o || new Map()),
							s.findHostDirectiveDefs(s, a, o),
							n.unshift(...a, s);
						let c = a.length;
						Mi(e, t, c);
					} else n.unshift(s), Mi(e, t, 0);
				else
					(o = o || new Map()),
						s.findHostDirectiveDefs?.(s, n, o),
						n.push(s);
		}
	return n === null ? null : [n, o];
}
function Mi(e, t, r) {
	(t.componentOffset = r), (e.components ??= []).push(t.index);
}
function lg(e, t, r) {
	if (t) {
		let n = (e.localNames = []);
		for (let o = 0; o < t.length; o += 2) {
			let i = r[t[o + 1]];
			if (i == null) throw new D(-301, !1);
			n.push(t[o], i);
		}
	}
}
function dg(e, t, r) {
	if (r) {
		if (t.exportAs)
			for (let n = 0; n < t.exportAs.length; n++) r[t.exportAs[n]] = e;
		Mn(t) && (r[""] = e);
	}
}
function fg(e, t, r) {
	(e.flags |= 1),
		(e.directiveStart = t),
		(e.directiveEnd = t + r),
		(e.providerIndexes = t);
}
function hg(e, t, r, n, o) {
	e.data[n] = o;
	let i = o.factory || (o.factory = Lt(o.type, !0)),
		s = new yn(i, Mn(o), xn);
	(e.blueprint[n] = s), (r[n] = s), ig(e, t, n, cl(e, r, o.hostVars, Jr), o);
}
function pg(e, t, r) {
	let n = je(t, e),
		o = dl(r),
		i = e[Oe].rendererFactory,
		s = 16;
	r.signals ? (s = 4096) : r.onPush && (s = 64);
	let a = us(
		e,
		as(e, o, null, s, n, t, null, i.createRenderer(n, r), null, null, null),
	);
	e[t.index] = a;
}
function gg(e, t, r, n, o, i) {
	let s = i[t];
	if (s !== null)
		for (let a = 0; a < s.length; ) {
			let c = s[a++],
				u = s[a++],
				l = s[a++],
				d = s[a++];
			al(n, r, c, u, l, d);
		}
}
function mg(e, t, r) {
	let n = null,
		o = 0;
	for (; o < r.length; ) {
		let i = r[o];
		if (i === 0) {
			o += 4;
			continue;
		} else if (i === 5) {
			o += 2;
			continue;
		}
		if (typeof i == "number") break;
		if (e.hasOwnProperty(i)) {
			n === null && (n = []);
			let s = e[i];
			for (let a = 0; a < s.length; a += 3)
				if (s[a] === t) {
					n.push(i, s[a + 1], s[a + 2], r[o + 1]);
					break;
				}
		}
		o += 2;
	}
	return n;
}
function vg(e, t, r, n) {
	return [e, !0, 0, t, null, n, null, r, null, null];
}
function gl(e, t) {
	let r = e.contentQueries;
	if (r !== null) {
		let n = ee(null);
		try {
			for (let o = 0; o < r.length; o += 2) {
				let i = r[o],
					s = r[o + 1];
				if (s !== -1) {
					let a = e.data[s];
					fu(i), a.contentQueries(2, t[s], s);
				}
			}
		} finally {
			ee(n);
		}
	}
}
function us(e, t) {
	return e[gn] ? (e[hc][Ee] = t) : (e[gn] = t), (e[hc] = t), t;
}
function Ti(e, t, r) {
	fu(0);
	let n = ee(null);
	try {
		t(e, r);
	} finally {
		ee(n);
	}
}
function yg(e, t) {
	let r = e[kt],
		n = r ? r.get(Fe, null) : null;
	n && n.handleError(t);
}
function ml(e, t, r, n, o) {
	for (let i = 0; i < r.length; ) {
		let s = r[i++],
			a = r[i++],
			c = r[i++],
			u = t[s],
			l = e.data[s];
		al(l, u, n, a, c, o);
	}
}
function Dg(e, t, r) {
	let n = ph(t, e);
	gp(e[Ce], n, r);
}
var wg = 100;
function Eg(e, t = !0) {
	let r = e[Oe],
		n = r.rendererFactory,
		o = !1;
	o || n.begin?.();
	try {
		Cg(e);
	} catch (i) {
		throw (t && yg(e, i), i);
	} finally {
		o || (n.end?.(), r.inlineEffectRunner?.flush());
	}
}
function Cg(e) {
	Si(e, 0);
	let t = 0;
	for (; cu(e); ) {
		if (t === wg) throw new D(103, !1);
		t++, Si(e, 1);
	}
}
function Ig(e, t, r, n) {
	let o = t[I];
	if ((o & 256) === 256) return;
	let i = !1;
	!i && t[Oe].inlineEffectRunner?.flush(), Gi(t);
	let s = null,
		a = null;
	!i && bg(e) && ((a = Bp(t)), (s = ba(a)));
	try {
		au(t), Sh(e.bindingStartIndex), r !== null && ul(e, t, r, 2, n);
		let c = (o & 3) === 3;
		if (!i)
			if (c) {
				let d = e.preOrderCheckHooks;
				d !== null && Er(t, d, null);
			} else {
				let d = e.preOrderHooks;
				d !== null && Cr(t, d, 0, null), Jo(t, 0);
			}
		if ((Mg(t), vl(t, 0), e.contentQueries !== null && gl(e, t), !i))
			if (c) {
				let d = e.contentCheckHooks;
				d !== null && Er(t, d);
			} else {
				let d = e.contentHooks;
				d !== null && Cr(t, d, 1), Jo(t, 1);
			}
		Zp(e, t);
		let u = e.components;
		u !== null && Dl(t, u, 0);
		let l = e.viewQuery;
		if ((l !== null && Ti(2, l, n), !i))
			if (c) {
				let d = e.viewCheckHooks;
				d !== null && Er(t, d);
			} else {
				let d = e.viewHooks;
				d !== null && Cr(t, d, 2), Jo(t, 2);
			}
		if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Ko])) {
			for (let d of t[Ko]) d();
			t[Ko] = null;
		}
		i || (t[I] &= -73);
	} catch (c) {
		throw (mn(t), c);
	} finally {
		a !== null && (Ma(a, s), zp(a)), Wi();
	}
}
function bg(e) {
	return e.type !== 2;
}
function vl(e, t) {
	for (let r = tl(e); r !== null; r = nl(r))
		for (let n = fe; n < r.length; n++) {
			let o = r[n];
			yl(o, t);
		}
}
function Mg(e) {
	for (let t = tl(e); t !== null; t = nl(t)) {
		if (!(t[I] & Bi.HasTransplantedViews)) continue;
		let r = t[_r];
		for (let n = 0; n < r.length; n++) {
			let o = r[n],
				i = o[Q];
			vh(o);
		}
	}
}
function Tg(e, t, r) {
	let n = Tn(t, e);
	yl(n, r);
}
function yl(e, t) {
	zi(e) && Si(e, t);
}
function Si(e, t) {
	let n = e[_],
		o = e[I],
		i = e[ut],
		s = !!(t === 0 && o & 16);
	if (
		((s ||= !!(o & 64 && t === 0)),
		(s ||= !!(o & 1024)),
		(s ||= !!(i?.dirty && Ro(i))),
		i && (i.dirty = !1),
		(e[I] &= -9217),
		s)
	)
		Ig(n, e, n.template, e[Ze]);
	else if (o & 8192) {
		vl(e, 1);
		let a = n.components;
		a !== null && Dl(e, a, 1);
	}
}
function Dl(e, t, r) {
	for (let n = 0; n < t.length; n++) Tg(e, t[n], r);
}
function wl(e) {
	for (e[Oe].changeDetectionScheduler?.notify(); e; ) {
		e[I] |= 64;
		let t = vn(e);
		if (ah(e) && !t) return e;
		e = t;
	}
	return null;
}
var $t = class {
		get rootNodes() {
			let t = this._lView,
				r = t[_];
			return Lr(r, t, r.firstChild, []);
		}
		constructor(t, r, n = !0) {
			(this._lView = t),
				(this._cdRefInjectingView = r),
				(this.notifyErrorHandler = n),
				(this._appRef = null),
				(this._attachedToViewContainer = !1);
		}
		get context() {
			return this._lView[Ze];
		}
		set context(t) {
			this._lView[Ze] = t;
		}
		get destroyed() {
			return (this._lView[I] & 256) === 256;
		}
		destroy() {
			if (this._appRef) this._appRef.detachView(this);
			else if (this._attachedToViewContainer) {
				let t = this._lView[Q];
				if (Le(t)) {
					let r = t[Ar],
						n = r ? r.indexOf(this) : -1;
					n > -1 && (wi(t, n), Or(r, n));
				}
				this._attachedToViewContainer = !1;
			}
			Zu(this._lView[_], this._lView);
		}
		onDestroy(t) {
			yh(this._lView, t);
		}
		markForCheck() {
			wl(this._cdRefInjectingView || this._lView);
		}
		detach() {
			this._lView[I] &= -129;
		}
		reattach() {
			di(this._lView), (this._lView[I] |= 128);
		}
		detectChanges() {
			(this._lView[I] |= 1024), Eg(this._lView, this.notifyErrorHandler);
		}
		checkNoChanges() {}
		attachToViewContainerRef() {
			if (this._appRef) throw new D(902, !1);
			this._attachedToViewContainer = !0;
		}
		detachFromAppRef() {
			(this._appRef = null), Wu(this._lView[_], this._lView);
		}
		attachToAppRef(t) {
			if (this._attachedToViewContainer) throw new D(902, !1);
			(this._appRef = t), di(this._lView);
		}
	},
	Xr = (() => {
		let t = class t {};
		t.__NG_ELEMENT_ID__ = Sg;
		let e = t;
		return e;
	})();
function Sg(e) {
	return xg(Qe(), he(), (e & 16) === 16);
}
function xg(e, t, r) {
	if (Hi(e) && !r) {
		let n = Tn(e.index, t);
		return new $t(n, n);
	} else if (e.type & 47) {
		let n = t[Se];
		return new $t(n, t);
	}
	return null;
}
var Tc = new Set();
function ls(e) {
	Tc.has(e) ||
		(Tc.add(e),
		performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
var xi = class extends ne {
	constructor(t = !1) {
		super(), (this.__isAsync = t);
	}
	emit(t) {
		super.next(t);
	}
	subscribe(t, r, n) {
		let o = t,
			i = r || (() => null),
			s = n;
		if (t && typeof t == "object") {
			let c = t;
			(o = c.next?.bind(c)),
				(i = c.error?.bind(c)),
				(s = c.complete?.bind(c));
		}
		this.__isAsync && ((i = oi(i)), o && (o = oi(o)), s && (s = oi(s)));
		let a = super.subscribe({ next: o, error: i, complete: s });
		return t instanceof U && t.add(a), a;
	}
};
function oi(e) {
	return (t) => {
		setTimeout(e, void 0, t);
	};
}
var we = xi;
function Sc(...e) {}
function Ag() {
	let e = typeof ln.requestAnimationFrame == "function",
		t = ln[e ? "requestAnimationFrame" : "setTimeout"],
		r = ln[e ? "cancelAnimationFrame" : "clearTimeout"];
	if (typeof Zone < "u" && t && r) {
		let n = t[Zone.__symbol__("OriginalDelegate")];
		n && (t = n);
		let o = r[Zone.__symbol__("OriginalDelegate")];
		o && (r = o);
	}
	return { nativeRequestAnimationFrame: t, nativeCancelAnimationFrame: r };
}
var j = class e {
		constructor({
			enableLongStackTrace: t = !1,
			shouldCoalesceEventChangeDetection: r = !1,
			shouldCoalesceRunChangeDetection: n = !1,
		}) {
			if (
				((this.hasPendingMacrotasks = !1),
				(this.hasPendingMicrotasks = !1),
				(this.isStable = !0),
				(this.onUnstable = new we(!1)),
				(this.onMicrotaskEmpty = new we(!1)),
				(this.onStable = new we(!1)),
				(this.onError = new we(!1)),
				typeof Zone > "u")
			)
				throw new D(908, !1);
			Zone.assertZonePatched();
			let o = this;
			(o._nesting = 0),
				(o._outer = o._inner = Zone.current),
				Zone.TaskTrackingZoneSpec &&
					(o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
				t &&
					Zone.longStackTraceZoneSpec &&
					(o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
				(o.shouldCoalesceEventChangeDetection = !n && r),
				(o.shouldCoalesceRunChangeDetection = n),
				(o.lastRequestAnimationFrameId = -1),
				(o.nativeRequestAnimationFrame =
					Ag().nativeRequestAnimationFrame),
				Rg(o);
		}
		static isInAngularZone() {
			return (
				typeof Zone < "u" && Zone.current.get("isAngularZone") === !0
			);
		}
		static assertInAngularZone() {
			if (!e.isInAngularZone()) throw new D(909, !1);
		}
		static assertNotInAngularZone() {
			if (e.isInAngularZone()) throw new D(909, !1);
		}
		run(t, r, n) {
			return this._inner.run(t, r, n);
		}
		runTask(t, r, n, o) {
			let i = this._inner,
				s = i.scheduleEventTask("NgZoneEvent: " + o, t, _g, Sc, Sc);
			try {
				return i.runTask(s, r, n);
			} finally {
				i.cancelTask(s);
			}
		}
		runGuarded(t, r, n) {
			return this._inner.runGuarded(t, r, n);
		}
		runOutsideAngular(t) {
			return this._outer.run(t);
		}
	},
	_g = {};
function ds(e) {
	if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
		try {
			e._nesting++, e.onMicrotaskEmpty.emit(null);
		} finally {
			if ((e._nesting--, !e.hasPendingMicrotasks))
				try {
					e.runOutsideAngular(() => e.onStable.emit(null));
				} finally {
					e.isStable = !0;
				}
		}
}
function Ng(e) {
	e.isCheckStableRunning ||
		e.lastRequestAnimationFrameId !== -1 ||
		((e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(
			ln,
			() => {
				e.fakeTopEventTask ||
					(e.fakeTopEventTask = Zone.root.scheduleEventTask(
						"fakeTopEventTask",
						() => {
							(e.lastRequestAnimationFrameId = -1),
								Ai(e),
								(e.isCheckStableRunning = !0),
								ds(e),
								(e.isCheckStableRunning = !1);
						},
						void 0,
						() => {},
						() => {},
					)),
					e.fakeTopEventTask.invoke();
			},
		)),
		Ai(e));
}
function Rg(e) {
	let t = () => {
		Ng(e);
	};
	e._inner = e._inner.fork({
		name: "angular",
		properties: { isAngularZone: !0 },
		onInvokeTask: (r, n, o, i, s, a) => {
			if (Og(a)) return r.invokeTask(o, i, s, a);
			try {
				return xc(e), r.invokeTask(o, i, s, a);
			} finally {
				((e.shouldCoalesceEventChangeDetection &&
					i.type === "eventTask") ||
					e.shouldCoalesceRunChangeDetection) &&
					t(),
					Ac(e);
			}
		},
		onInvoke: (r, n, o, i, s, a, c) => {
			try {
				return xc(e), r.invoke(o, i, s, a, c);
			} finally {
				e.shouldCoalesceRunChangeDetection && t(), Ac(e);
			}
		},
		onHasTask: (r, n, o, i) => {
			r.hasTask(o, i),
				n === o &&
					(i.change == "microTask"
						? ((e._hasPendingMicrotasks = i.microTask),
							Ai(e),
							ds(e))
						: i.change == "macroTask" &&
							(e.hasPendingMacrotasks = i.macroTask));
		},
		onHandleError: (r, n, o, i) => (
			r.handleError(o, i),
			e.runOutsideAngular(() => e.onError.emit(i)),
			!1
		),
	});
}
function Ai(e) {
	e._hasPendingMicrotasks ||
	((e.shouldCoalesceEventChangeDetection ||
		e.shouldCoalesceRunChangeDetection) &&
		e.lastRequestAnimationFrameId !== -1)
		? (e.hasPendingMicrotasks = !0)
		: (e.hasPendingMicrotasks = !1);
}
function xc(e) {
	e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function Ac(e) {
	e._nesting--, ds(e);
}
function Og(e) {
	return !Array.isArray(e) || e.length !== 1
		? !1
		: e[0].data?.__ignore_ng_zone__ === !0;
}
var El = (() => {
	let t = class t {
		constructor() {
			(this.handler = null), (this.internalCallbacks = []);
		}
		execute() {
			let n = [...this.internalCallbacks];
			this.internalCallbacks.length = 0;
			for (let i of n) i();
			return !!this.handler?.execute() || n.length > 0;
		}
		ngOnDestroy() {
			this.handler?.destroy(),
				(this.handler = null),
				(this.internalCallbacks.length = 0);
		}
	};
	t.ɵprov = m({ token: t, providedIn: "root", factory: () => new t() });
	let e = t;
	return e;
})();
function Pg(e, t) {
	let r = Tn(t, e),
		n = r[_];
	Fg(n, r);
	let o = r[ke];
	o !== null && r[xr] === null && (r[xr] = is(o, r[kt])), Cl(n, r, r[Ze]);
}
function Fg(e, t) {
	for (let r = t.length; r < e.blueprint.length; r++) t.push(e.blueprint[r]);
}
function Cl(e, t, r) {
	Gi(t);
	try {
		let n = e.viewQuery;
		n !== null && Ti(1, n, r);
		let o = e.template;
		o !== null && ul(e, t, o, 1, r),
			e.firstCreatePass && (e.firstCreatePass = !1),
			e.staticContentQueries && gl(e, t),
			e.staticViewQueries && Ti(2, e.viewQuery, r);
		let i = e.components;
		i !== null && kg(t, i);
	} catch (n) {
		throw (
			(e.firstCreatePass &&
				((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
			n)
		);
	} finally {
		(t[I] &= -5), Wi();
	}
}
function kg(e, t) {
	for (let r = 0; r < t.length; r++) Pg(e, t[r]);
}
function _i(e, t, r) {
	let n = r ? e.styles : null,
		o = r ? e.classes : null,
		i = 0;
	if (t !== null)
		for (let s = 0; s < t.length; s++) {
			let a = t[s];
			if (typeof a == "number") i = a;
			else if (i == 1) o = nc(o, a);
			else if (i == 2) {
				let c = a,
					u = t[++s];
				n = nc(n, c + ": " + u + ";");
			}
		}
	r ? (e.styles = n) : (e.stylesWithoutHost = n),
		r ? (e.classes = o) : (e.classesWithoutHost = o);
}
var jr = class extends Qr {
	constructor(t) {
		super(), (this.ngModule = t);
	}
	resolveComponentFactory(t) {
		let r = ct(t);
		return new Cn(r, this.ngModule);
	}
};
function _c(e) {
	let t = [];
	for (let r in e) {
		if (!e.hasOwnProperty(r)) continue;
		let n = e[r];
		n !== void 0 &&
			t.push({ propName: Array.isArray(n) ? n[0] : n, templateName: r });
	}
	return t;
}
function Lg(e) {
	let t = e.toLowerCase();
	return t === "svg" ? su : t === "math" ? dh : null;
}
var Ni = class {
		constructor(t, r) {
			(this.injector = t), (this.parentInjector = r);
		}
		get(t, r, n) {
			n = Hr(n);
			let o = this.injector.get(t, ni, n);
			return o !== ni || r === ni ? o : this.parentInjector.get(t, r, n);
		}
	},
	Cn = class extends kr {
		get inputs() {
			let t = this.componentDef,
				r = t.inputTransforms,
				n = _c(t.inputs);
			if (r !== null)
				for (let o of n)
					r.hasOwnProperty(o.propName) &&
						(o.transform = r[o.propName]);
			return n;
		}
		get outputs() {
			return _c(this.componentDef.outputs);
		}
		constructor(t, r) {
			super(),
				(this.componentDef = t),
				(this.ngModule = r),
				(this.componentType = t.type),
				(this.selector = th(t.selectors)),
				(this.ngContentSelectors = t.ngContentSelectors
					? t.ngContentSelectors
					: []),
				(this.isBoundToModule = !!r);
		}
		create(t, r, n, o) {
			o = o || this.ngModule;
			let i = o instanceof X ? o : o?.injector;
			i &&
				this.componentDef.getStandaloneInjector !== null &&
				(i = this.componentDef.getStandaloneInjector(i) || i);
			let s = i ? new Ni(t, i) : t,
				a = s.get(En, null);
			if (a === null) throw new D(407, !1);
			let c = s.get($p, null),
				u = s.get(El, null),
				l = s.get(Ci, null),
				d = {
					rendererFactory: a,
					sanitizer: c,
					inlineEffectRunner: null,
					afterRenderEventManager: u,
					changeDetectionScheduler: l,
				},
				f = a.createRenderer(null, this.componentDef),
				h = this.componentDef.selectors[0][0] || "div",
				E = n
					? Xp(f, n, this.componentDef.encapsulation, s)
					: Gu(f, h, Lg(h)),
				F = 512;
			this.componentDef.signals
				? (F |= 4096)
				: this.componentDef.onPush || (F |= 16);
			let N = null;
			E !== null && (N = is(E, s, !0));
			let C = fl(0, null, null, 1, 0, null, null, null, null, null, null),
				Y = as(null, C, null, F, null, null, d, f, s, null, N);
			Gi(Y);
			let on, $;
			try {
				let ce = this.componentDef,
					$e,
					sn = null;
				ce.findHostDirectiveDefs
					? (($e = []),
						(sn = new Map()),
						ce.findHostDirectiveDefs(ce, $e, sn),
						$e.push(ce))
					: ($e = [ce]);
				let Gd = jg(Y, E),
					Wd = Vg(Gd, E, ce, $e, Y, d, f);
				($ = gh(C, lt)),
					E && Bg(f, ce, E, n),
					r !== void 0 && Hg($, this.ngContentSelectors, r),
					(on = Ug(Wd, ce, $e, sn, Y, [zg])),
					Cl(C, Y, null);
			} finally {
				Wi();
			}
			return new Ri(this.componentType, on, ss($, Y), Y, $);
		}
	},
	Ri = class extends Ii {
		constructor(t, r, n, o, i) {
			super(),
				(this.location = n),
				(this._rootLView = o),
				(this._tNode = i),
				(this.previousInputValues = null),
				(this.instance = r),
				(this.hostView = this.changeDetectorRef =
					new $t(o, void 0, !1)),
				(this.componentType = t);
		}
		setInput(t, r) {
			let n = this._tNode.inputs,
				o;
			if (n !== null && (o = n[t])) {
				if (
					((this.previousInputValues ??= new Map()),
					this.previousInputValues.has(t) &&
						Object.is(this.previousInputValues.get(t), r))
				)
					return;
				let i = this._rootLView;
				ml(i[_], i, o, t, r), this.previousInputValues.set(t, r);
				let s = Tn(this._tNode.index, i);
				wl(s);
			}
		}
		get injector() {
			return new at(this._tNode, this._rootLView);
		}
		destroy() {
			this.hostView.destroy();
		}
		onDestroy(t) {
			this.hostView.onDestroy(t);
		}
	};
function jg(e, t) {
	let r = e[_],
		n = lt;
	return (e[n] = t), cs(r, n, 2, "#host", null);
}
function Vg(e, t, r, n, o, i, s) {
	let a = o[_];
	$g(n, e, t, s);
	let c = null;
	t !== null && (c = is(t, o[kt]));
	let u = i.rendererFactory.createRenderer(t, r),
		l = 16;
	r.signals ? (l = 4096) : r.onPush && (l = 64);
	let d = as(o, dl(r), null, l, o[e.index], e, i, u, null, null, c);
	return (
		a.firstCreatePass && Mi(a, e, n.length - 1), us(o, d), (o[e.index] = d)
	);
}
function $g(e, t, r, n) {
	for (let o of e) t.mergedAttrs = ji(t.mergedAttrs, o.hostAttrs);
	t.mergedAttrs !== null &&
		(_i(t, t.mergedAttrs, !0), r !== null && Xu(n, r, t));
}
function Ug(e, t, r, n, o, i) {
	let s = Qe(),
		a = o[_],
		c = je(s, o);
	hl(a, o, s, r, null, n);
	for (let l = 0; l < r.length; l++) {
		let d = s.directiveStart + l,
			f = Dn(o, a, d, s);
		Vt(f, o);
	}
	pl(a, o, s), c && Vt(c, o);
	let u = Dn(o, a, s.directiveStart + s.componentOffset, s);
	if (((e[Ze] = o[Ze] = u), i !== null)) for (let l of i) l(u, t);
	return ll(a, s, e), u;
}
function Bg(e, t, r, n) {
	if (n) ui(e, r, ["ng-version", "17.1.0"]);
	else {
		let { attrs: o, classes: i } = nh(t.selectors[0]);
		o && ui(e, r, o), i && i.length > 0 && Ju(e, r, i.join(" "));
	}
}
function Hg(e, t, r) {
	let n = (e.projection = []);
	for (let o = 0; o < t.length; o++) {
		let i = r[o];
		n.push(i != null ? Array.from(i) : null);
	}
}
function zg() {
	let e = Qe();
	Cu(he()[_], e);
}
var Kb = new RegExp(`^(\\d+)*(${Fp}|${Pp})*(.*)`);
var Gg = () => null;
function Nc(e, t) {
	return Gg(e, t);
}
function Rc(e, t) {
	return !t || t.firstChild === null || Hu(e);
}
function Wg(e, t, r, n = !0) {
	let o = t[_];
	if ((Dp(o, t, e, r), n)) {
		let s = Ei(r, e),
			a = t[Ce],
			c = rs(a, e[dt]);
		c !== null && vp(o, e[Ie], a, t, c, s);
	}
	let i = t[xr];
	i !== null && i.firstChild !== null && (i.firstChild = null);
}
var eo = (() => {
	let t = class t {};
	t.__NG_ELEMENT_ID__ = qg;
	let e = t;
	return e;
})();
function qg() {
	let e = Qe();
	return Yg(e, he());
}
var Zg = eo,
	Il = class extends Zg {
		constructor(t, r, n) {
			super(),
				(this._lContainer = t),
				(this._hostTNode = r),
				(this._hostLView = n);
		}
		get element() {
			return ss(this._hostTNode, this._hostLView);
		}
		get injector() {
			return new at(this._hostTNode, this._hostLView);
		}
		get parentInjector() {
			let t = Zi(this._hostTNode, this._hostLView);
			if (bu(t)) {
				let r = Rr(t, this._hostLView),
					n = Nr(t),
					o = r[_].data[n + 8];
				return new at(o, r);
			} else return new at(null, this._hostLView);
		}
		clear() {
			for (; this.length > 0; ) this.remove(this.length - 1);
		}
		get(t) {
			let r = Oc(this._lContainer);
			return (r !== null && r[t]) || null;
		}
		get length() {
			return this._lContainer.length - fe;
		}
		createEmbeddedView(t, r, n) {
			let o, i;
			typeof n == "number"
				? (o = n)
				: n != null && ((o = n.index), (i = n.injector));
			let s = Nc(this._lContainer, t.ssrId),
				a = t.createEmbeddedViewImpl(r || {}, i, s);
			return this.insertImpl(a, o, Rc(this._hostTNode, s)), a;
		}
		createComponent(t, r, n, o, i) {
			let s = t && !Yh(t),
				a;
			if (s) a = r;
			else {
				let E = r || {};
				(a = E.index),
					(n = E.injector),
					(o = E.projectableNodes),
					(i = E.environmentInjector || E.ngModuleRef);
			}
			let c = s ? t : new Cn(ct(t)),
				u = n || this.parentInjector;
			if (!i && c.ngModule == null) {
				let F = (s ? u : this.parentInjector).get(X, null);
				F && (i = F);
			}
			let l = ct(c.componentType ?? {}),
				d = Nc(this._lContainer, l?.id ?? null),
				f = d?.firstChild ?? null,
				h = c.create(u, o, f, i);
			return this.insertImpl(h.hostView, a, Rc(this._hostTNode, d)), h;
		}
		insert(t, r) {
			return this.insertImpl(t, r, !0);
		}
		insertImpl(t, r, n) {
			let o = t._lView;
			if (mh(o)) {
				let a = this.indexOf(t);
				if (a !== -1) this.detach(a);
				else {
					let c = o[Q],
						u = new Il(c, c[Ie], c[Q]);
					u.detach(u.indexOf(t));
				}
			}
			let i = this._adjustIndex(r),
				s = this._lContainer;
			return (
				Wg(s, o, i, n), t.attachToViewContainerRef(), Pu(ii(s), i, t), t
			);
		}
		move(t, r) {
			return this.insert(t, r);
		}
		indexOf(t) {
			let r = Oc(this._lContainer);
			return r !== null ? r.indexOf(t) : -1;
		}
		remove(t) {
			let r = this._adjustIndex(t, -1),
				n = wi(this._lContainer, r);
			n && (Or(ii(this._lContainer), r), Zu(n[_], n));
		}
		detach(t) {
			let r = this._adjustIndex(t, -1),
				n = wi(this._lContainer, r);
			return n && Or(ii(this._lContainer), r) != null ? new $t(n) : null;
		}
		_adjustIndex(t, r = 0) {
			return t ?? this.length + r;
		}
	};
function Oc(e) {
	return e[Ar];
}
function ii(e) {
	return e[Ar] || (e[Ar] = []);
}
function Yg(e, t) {
	let r,
		n = t[e.index];
	return (
		Le(n) ? (r = n) : ((r = vg(n, t, null, e)), (t[e.index] = r), us(t, r)),
		Kg(r, t, e, n),
		new Il(r, e, t)
	);
}
function Qg(e, t) {
	let r = e[Ce],
		n = r.createComment(""),
		o = je(t, e),
		i = rs(r, o);
	return Fr(r, i, n, Tp(r, o), !1), n;
}
var Kg = Jg;
function Jg(e, t, r, n) {
	if (e[dt]) return;
	let o;
	r.type & 8 ? (o = Pe(n)) : (o = Qg(t, r)), (e[dt] = o);
}
function Xg(e, t, r) {
	let n = e[t];
	return Object.is(n, r) ? !1 : ((e[t] = r), !0);
}
function em(e, t, r, n) {
	return Xg(e, xh(), r) ? t + jc(r) + n : Jr;
}
function Pc(e, t, r, n, o) {
	let i = t.inputs,
		s = o ? "class" : "style";
	ml(e, r, i[s], s, n);
}
function tm(e, t, r, n, o, i) {
	let s = t.consts,
		a = gc(s, o),
		c = cs(t, e, 2, n, a);
	return (
		og(t, r, c, gc(s, i)),
		c.attrs !== null && _i(c, c.attrs, !1),
		c.mergedAttrs !== null && _i(c, c.mergedAttrs, !0),
		t.queries !== null && t.queries.elementStart(t, c),
		c
	);
}
function G(e, t, r, n) {
	let o = he(),
		i = Wr(),
		s = lt + e,
		a = o[Ce],
		c = i.firstCreatePass ? tm(s, i, o, t, r, n) : i.data[s],
		u = nm(i, o, c, a, t, e);
	o[s] = u;
	let l = sh(c);
	return (
		qr(c, !0),
		Xu(a, u, c),
		(c.flags & 32) !== 32 && wu() && Qu(i, o, u, c),
		Dh() === 0 && Vt(u, o),
		wh(),
		l && (Qp(i, o, c), ll(i, c, o)),
		n !== null && Kp(o, c),
		G
	);
}
function q() {
	let e = Qe();
	du() ? Th() : ((e = e.parent), qr(e, !1));
	let t = e;
	Ih(t) && bh(), Eh();
	let r = Wr();
	return (
		r.firstCreatePass && (Cu(r, e), tu(e) && r.queries.elementEnd(e)),
		t.classesWithoutHost != null &&
			Lh(t) &&
			Pc(r, t, he(), t.classesWithoutHost, !0),
		t.stylesWithoutHost != null &&
			jh(t) &&
			Pc(r, t, he(), t.stylesWithoutHost, !1),
		q
	);
}
function se(e, t, r, n) {
	return G(e, t, r, n), q(), se;
}
var nm = (e, t, r, n, o, i) => (Eu(!0), Gu(n, o, Oh()));
var Vr = "en-US";
var rm = Vr;
function om(e) {
	Nf(e, "Expected localeId to be defined"),
		typeof e == "string" && (rm = e.toLowerCase().replace(/_/g, "-"));
}
function An(e) {
	return !!e && typeof e.then == "function";
}
function bl(e) {
	return !!e && typeof e.subscribe == "function";
}
function Je(e, t = "") {
	let r = he(),
		n = Wr(),
		o = e + lt,
		i = n.firstCreatePass ? cs(n, o, 1, t, null) : n.data[o],
		s = im(n, r, i, t, e);
	(r[o] = s), wu() && Qu(n, r, s, i), qr(i, !1);
}
var im = (e, t, r, n, o) => (Eu(!0), pp(t[Ce], n));
function Ht(e) {
	return Ml("", e, ""), Ht;
}
function Ml(e, t, r) {
	let n = he(),
		o = em(n, e, t, r);
	return o !== Jr && Dg(n, qi(), o), Ml;
}
var Ye = class {},
	In = class {};
var Oi = class extends Ye {
		constructor(t, r, n) {
			super(),
				(this._parent = r),
				(this._bootstrapComponents = []),
				(this.destroyCbs = []),
				(this.componentFactoryResolver = new jr(this));
			let o = Qc(t);
			(this._bootstrapComponents = Bu(o.bootstrap)),
				(this._r3Injector = $u(
					t,
					r,
					[
						{ provide: Ye, useValue: this },
						{
							provide: Qr,
							useValue: this.componentFactoryResolver,
						},
						...n,
					],
					ie(t),
					new Set(["environment"]),
				)),
				this._r3Injector.resolveInjectorInitializers(),
				(this.instance = this._r3Injector.get(t));
		}
		get injector() {
			return this._r3Injector;
		}
		destroy() {
			let t = this._r3Injector;
			!t.destroyed && t.destroy(),
				this.destroyCbs.forEach((r) => r()),
				(this.destroyCbs = null);
		}
		onDestroy(t) {
			this.destroyCbs.push(t);
		}
	},
	Pi = class extends In {
		constructor(t) {
			super(), (this.moduleType = t);
		}
		create(t) {
			return new Oi(this.moduleType, t, []);
		}
	};
var $r = class extends Ye {
	constructor(t) {
		super(),
			(this.componentFactoryResolver = new jr(this)),
			(this.instance = null);
		let r = new wn(
			[
				...t.providers,
				{ provide: Ye, useValue: this },
				{ provide: Qr, useValue: this.componentFactoryResolver },
			],
			t.parent || Ji(),
			t.debugName,
			new Set(["environment"]),
		);
		(this.injector = r),
			t.runEnvironmentInitializers && r.resolveInjectorInitializers();
	}
	destroy() {
		this.injector.destroy();
	}
	onDestroy(t) {
		this.injector.onDestroy(t);
	}
};
function fs(e, t, r = null) {
	return new $r({
		providers: e,
		parent: t,
		debugName: r,
		runEnvironmentInitializers: !0,
	}).injector;
}
var sm = (() => {
	let t = class t {
		constructor(n) {
			(this._injector = n), (this.cachedInjectors = new Map());
		}
		getOrCreateStandaloneInjector(n) {
			if (!n.standalone) return null;
			if (!this.cachedInjectors.has(n)) {
				let o = Lu(!1, n.type),
					i =
						o.length > 0
							? fs(
									[o],
									this._injector,
									`Standalone[${n.type.name}]`,
								)
							: null;
				this.cachedInjectors.set(n, i);
			}
			return this.cachedInjectors.get(n);
		}
		ngOnDestroy() {
			try {
				for (let n of this.cachedInjectors.values())
					n !== null && n.destroy();
			} finally {
				this.cachedInjectors.clear();
			}
		}
	};
	t.ɵprov = m({
		token: t,
		providedIn: "environment",
		factory: () => new t(v(X)),
	});
	let e = t;
	return e;
})();
function ge(e) {
	ls("NgStandalone"),
		(e.getStandaloneInjector = (t) =>
			t.get(sm).getOrCreateStandaloneInjector(e));
}
var to = (() => {
		let t = class t {
			log(n) {
				console.log(n);
			}
			warn(n) {
				console.warn(n);
			}
		};
		(t.ɵfac = function (o) {
			return new (o || t)();
		}),
			(t.ɵprov = m({
				token: t,
				factory: t.ɵfac,
				providedIn: "platform",
			}));
		let e = t;
		return e;
	})(),
	Fi = class {
		constructor(t, r) {
			(this.ngModuleFactory = t), (this.componentFactories = r);
		}
	},
	hs = (() => {
		let t = class t {
			compileModuleSync(n) {
				return new Pi(n);
			}
			compileModuleAsync(n) {
				return Promise.resolve(this.compileModuleSync(n));
			}
			compileModuleAndAllComponentsSync(n) {
				let o = this.compileModuleSync(n),
					i = Qc(n),
					s = Bu(i.declarations).reduce((a, c) => {
						let u = ct(c);
						return u && a.push(new Cn(u)), a;
					}, []);
				return new Fi(o, s);
			}
			compileModuleAndAllComponentsAsync(n) {
				return Promise.resolve(
					this.compileModuleAndAllComponentsSync(n),
				);
			}
			clearCache() {}
			clearCacheFor(n) {}
			getModuleId(n) {}
		};
		(t.ɵfac = function (o) {
			return new (o || t)();
		}),
			(t.ɵprov = m({ token: t, factory: t.ɵfac, providedIn: "root" }));
		let e = t;
		return e;
	})();
var zt = (() => {
	let t = class t {
		constructor() {
			(this.taskId = 0),
				(this.pendingTasks = new Set()),
				(this.hasPendingTasks = new W(!1));
		}
		get _hasPendingTasks() {
			return this.hasPendingTasks.value;
		}
		add() {
			this._hasPendingTasks || this.hasPendingTasks.next(!0);
			let n = this.taskId++;
			return this.pendingTasks.add(n), n;
		}
		remove(n) {
			this.pendingTasks.delete(n),
				this.pendingTasks.size === 0 &&
					this._hasPendingTasks &&
					this.hasPendingTasks.next(!1);
		}
		ngOnDestroy() {
			this.pendingTasks.clear(),
				this._hasPendingTasks && this.hasPendingTasks.next(!1);
		}
	};
	(t.ɵfac = function (o) {
		return new (o || t)();
	}),
		(t.ɵprov = m({ token: t, factory: t.ɵfac, providedIn: "root" }));
	let e = t;
	return e;
})();
var Tl = new b("");
var Sl = new b("Application Initializer"),
	xl = (() => {
		let t = class t {
			constructor() {
				(this.initialized = !1),
					(this.done = !1),
					(this.donePromise = new Promise((n, o) => {
						(this.resolve = n), (this.reject = o);
					})),
					(this.appInits = p(Sl, { optional: !0 }) ?? []);
			}
			runInitializers() {
				if (this.initialized) return;
				let n = [];
				for (let i of this.appInits) {
					let s = i();
					if (An(s)) n.push(s);
					else if (bl(s)) {
						let a = new Promise((c, u) => {
							s.subscribe({ complete: c, error: u });
						});
						n.push(a);
					}
				}
				let o = () => {
					(this.done = !0), this.resolve();
				};
				Promise.all(n)
					.then(() => {
						o();
					})
					.catch((i) => {
						this.reject(i);
					}),
					n.length === 0 && o(),
					(this.initialized = !0);
			}
		};
		(t.ɵfac = function (o) {
			return new (o || t)();
		}),
			(t.ɵprov = m({ token: t, factory: t.ɵfac, providedIn: "root" }));
		let e = t;
		return e;
	})(),
	no = new b("appBootstrapListener");
function am() {
	Sa(() => {
		throw new D(600, !1);
	});
}
function cm(e) {
	return e.isBoundToModule;
}
function um(e, t, r) {
	try {
		let n = r();
		return An(n)
			? n.catch((o) => {
					throw (t.runOutsideAngular(() => e.handleError(o)), o);
				})
			: n;
	} catch (n) {
		throw (t.runOutsideAngular(() => e.handleError(n)), n);
	}
}
var Gt = (() => {
	let t = class t {
		constructor() {
			(this._bootstrapListeners = []),
				(this._runningTick = !1),
				(this._destroyed = !1),
				(this._destroyListeners = []),
				(this._views = []),
				(this.internalErrorHandler = p(ol)),
				(this.afterRenderEffectManager = p(El)),
				(this.componentTypes = []),
				(this.components = []),
				(this.isStable = p(zt).hasPendingTasks.pipe(T((n) => !n))),
				(this._injector = p(X));
		}
		get destroyed() {
			return this._destroyed;
		}
		get injector() {
			return this._injector;
		}
		bootstrap(n, o) {
			let i = n instanceof kr;
			if (!this._injector.get(xl).done) {
				let h = !i && Yc(n),
					E = !1;
				throw new D(405, E);
			}
			let a;
			i
				? (a = n)
				: (a = this._injector.get(Qr).resolveComponentFactory(n)),
				this.componentTypes.push(a.componentType);
			let c = cm(a) ? void 0 : this._injector.get(Ye),
				u = o || a.selector,
				l = a.create(Bt.NULL, [], u, c),
				d = l.location.nativeElement,
				f = l.injector.get(Tl, null);
			return (
				f?.registerApplication(d),
				l.onDestroy(() => {
					this.detachView(l.hostView),
						si(this.components, l),
						f?.unregisterApplication(d);
				}),
				this._loadComponent(l),
				l
			);
		}
		tick() {
			if (this._runningTick) throw new D(101, !1);
			try {
				this._runningTick = !0;
				for (let n of this._views) n.detectChanges();
			} catch (n) {
				this.internalErrorHandler(n);
			} finally {
				try {
					let n = this.afterRenderEffectManager.execute();
				} catch (n) {
					this.internalErrorHandler(n);
				}
				this._runningTick = !1;
			}
		}
		attachView(n) {
			let o = n;
			this._views.push(o), o.attachToAppRef(this);
		}
		detachView(n) {
			let o = n;
			si(this._views, o), o.detachFromAppRef();
		}
		_loadComponent(n) {
			this.attachView(n.hostView), this.tick(), this.components.push(n);
			let o = this._injector.get(no, []);
			[...this._bootstrapListeners, ...o].forEach((i) => i(n));
		}
		ngOnDestroy() {
			if (!this._destroyed)
				try {
					this._destroyListeners.forEach((n) => n()),
						this._views.slice().forEach((n) => n.destroy());
				} finally {
					(this._destroyed = !0),
						(this._views = []),
						(this._bootstrapListeners = []),
						(this._destroyListeners = []);
				}
		}
		onDestroy(n) {
			return (
				this._destroyListeners.push(n),
				() => si(this._destroyListeners, n)
			);
		}
		destroy() {
			if (this._destroyed) throw new D(406, !1);
			let n = this._injector;
			n.destroy && !n.destroyed && n.destroy();
		}
		get viewCount() {
			return this._views.length;
		}
		warnIfDestroyed() {}
	};
	(t.ɵfac = function (o) {
		return new (o || t)();
	}),
		(t.ɵprov = m({ token: t, factory: t.ɵfac, providedIn: "root" }));
	let e = t;
	return e;
})();
function si(e, t) {
	let r = e.indexOf(t);
	r > -1 && e.splice(r, 1);
}
var lm = (() => {
	let t = class t {
		constructor() {
			(this.zone = p(j)), (this.applicationRef = p(Gt));
		}
		initialize() {
			this._onMicrotaskEmptySubscription ||
				(this._onMicrotaskEmptySubscription =
					this.zone.onMicrotaskEmpty.subscribe({
						next: () => {
							this.zone.run(() => {
								this.applicationRef.tick();
							});
						},
					}));
		}
		ngOnDestroy() {
			this._onMicrotaskEmptySubscription?.unsubscribe();
		}
	};
	(t.ɵfac = function (o) {
		return new (o || t)();
	}),
		(t.ɵprov = m({ token: t, factory: t.ɵfac, providedIn: "root" }));
	let e = t;
	return e;
})();
function dm(e) {
	return [
		{ provide: j, useFactory: e },
		{
			provide: jt,
			multi: !0,
			useFactory: () => {
				let t = p(lm, { optional: !0 });
				return () => t.initialize();
			},
		},
		{
			provide: jt,
			multi: !0,
			useFactory: () => {
				let t = p(gm);
				return () => {
					t.initialize();
				};
			},
		},
		{ provide: ol, useFactory: fm },
	];
}
function fm() {
	let e = p(j),
		t = p(Fe);
	return (r) => e.runOutsideAngular(() => t.handleError(r));
}
function hm(e) {
	let t = dm(() => new j(pm(e)));
	return Ut([[], t]);
}
function pm(e) {
	return {
		enableLongStackTrace: !1,
		shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
		shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
	};
}
var gm = (() => {
	let t = class t {
		constructor() {
			(this.subscription = new U()),
				(this.initialized = !1),
				(this.zone = p(j)),
				(this.pendingTasks = p(zt));
		}
		initialize() {
			if (this.initialized) return;
			this.initialized = !0;
			let n = null;
			!this.zone.isStable &&
				!this.zone.hasPendingMacrotasks &&
				!this.zone.hasPendingMicrotasks &&
				(n = this.pendingTasks.add()),
				this.zone.runOutsideAngular(() => {
					this.subscription.add(
						this.zone.onStable.subscribe(() => {
							j.assertNotInAngularZone(),
								queueMicrotask(() => {
									n !== null &&
										!this.zone.hasPendingMacrotasks &&
										!this.zone.hasPendingMicrotasks &&
										(this.pendingTasks.remove(n),
										(n = null));
								});
						}),
					);
				}),
				this.subscription.add(
					this.zone.onUnstable.subscribe(() => {
						j.assertInAngularZone(),
							(n ??= this.pendingTasks.add());
					}),
				);
		}
		ngOnDestroy() {
			this.subscription.unsubscribe();
		}
	};
	(t.ɵfac = function (o) {
		return new (o || t)();
	}),
		(t.ɵprov = m({ token: t, factory: t.ɵfac, providedIn: "root" }));
	let e = t;
	return e;
})();
function mm() {
	return (typeof $localize < "u" && $localize.locale) || Vr;
}
var ps = new b("LocaleId", {
	providedIn: "root",
	factory: () => p(ps, S.Optional | S.SkipSelf) || mm(),
});
var Al = new b("PlatformDestroyListeners");
var Mr = null;
function vm(e = [], t) {
	return Bt.create({
		name: t,
		providers: [
			{ provide: Zr, useValue: "platform" },
			{ provide: Al, useValue: new Set([() => (Mr = null)]) },
			...e,
		],
	});
}
function ym(e = []) {
	if (Mr) return Mr;
	let t = vm(e);
	return (Mr = t), am(), Dm(t), t;
}
function Dm(e) {
	e.get(es, null)?.forEach((r) => r());
}
function _l(e) {
	try {
		let { rootComponent: t, appProviders: r, platformProviders: n } = e,
			o = ym(n),
			i = [hm(), ...(r || [])],
			a = new $r({
				providers: i,
				parent: o,
				debugName: "",
				runEnvironmentInitializers: !1,
			}).injector,
			c = a.get(j);
		return c.run(() => {
			a.resolveInjectorInitializers();
			let u = a.get(Fe, null),
				l;
			c.runOutsideAngular(() => {
				l = c.onError.subscribe({
					next: (h) => {
						u.handleError(h);
					},
				});
			});
			let d = () => a.destroy(),
				f = o.get(Al);
			return (
				f.add(d),
				a.onDestroy(() => {
					l.unsubscribe(), f.delete(d);
				}),
				um(u, c, () => {
					let h = a.get(xl);
					return (
						h.runInitializers(),
						h.donePromise.then(() => {
							let E = a.get(ps, Vr);
							om(E || Vr);
							let F = a.get(Gt);
							return t !== void 0 && F.bootstrap(t), F;
						})
					);
				})
			);
		});
	} catch (t) {
		return Promise.reject(t);
	}
}
var gs = null;
function Wt() {
	return gs;
}
function Fl(e) {
	gs || (gs = e);
}
var ro = class {},
	K = new b("DocumentToken"),
	kl = (() => {
		let t = class t {
			historyGo(n) {
				throw new Error("Not implemented");
			}
		};
		(t.ɵfac = function (o) {
			return new (o || t)();
		}),
			(t.ɵprov = m({
				token: t,
				factory: () => p(bm),
				providedIn: "platform",
			}));
		let e = t;
		return e;
	})();
var bm = (() => {
	let t = class t extends kl {
		constructor() {
			super(),
				(this._doc = p(K)),
				(this._location = window.location),
				(this._history = window.history);
		}
		getBaseHrefFromDOM() {
			return Wt().getBaseHref(this._doc);
		}
		onPopState(n) {
			let o = Wt().getGlobalEventTarget(this._doc, "window");
			return (
				o.addEventListener("popstate", n, !1),
				() => o.removeEventListener("popstate", n)
			);
		}
		onHashChange(n) {
			let o = Wt().getGlobalEventTarget(this._doc, "window");
			return (
				o.addEventListener("hashchange", n, !1),
				() => o.removeEventListener("hashchange", n)
			);
		}
		get href() {
			return this._location.href;
		}
		get protocol() {
			return this._location.protocol;
		}
		get hostname() {
			return this._location.hostname;
		}
		get port() {
			return this._location.port;
		}
		get pathname() {
			return this._location.pathname;
		}
		get search() {
			return this._location.search;
		}
		get hash() {
			return this._location.hash;
		}
		set pathname(n) {
			this._location.pathname = n;
		}
		pushState(n, o, i) {
			this._history.pushState(n, o, i);
		}
		replaceState(n, o, i) {
			this._history.replaceState(n, o, i);
		}
		forward() {
			this._history.forward();
		}
		back() {
			this._history.back();
		}
		historyGo(n = 0) {
			this._history.go(n);
		}
		getState() {
			return this._history.state;
		}
	};
	(t.ɵfac = function (o) {
		return new (o || t)();
	}),
		(t.ɵprov = m({
			token: t,
			factory: () => new t(),
			providedIn: "platform",
		}));
	let e = t;
	return e;
})();
function Ll(e, t) {
	if (e.length == 0) return t;
	if (t.length == 0) return e;
	let r = 0;
	return (
		e.endsWith("/") && r++,
		t.startsWith("/") && r++,
		r == 2 ? e + t.substring(1) : r == 1 ? e + t : e + "/" + t
	);
}
function Nl(e) {
	let t = e.match(/#|\?|$/),
		r = (t && t.index) || e.length,
		n = r - (e[r - 1] === "/" ? 1 : 0);
	return e.slice(0, n) + e.slice(r);
}
function pt(e) {
	return e && e[0] !== "?" ? "?" + e : e;
}
var oo = (() => {
		let t = class t {
			historyGo(n) {
				throw new Error("Not implemented");
			}
		};
		(t.ɵfac = function (o) {
			return new (o || t)();
		}),
			(t.ɵprov = m({
				token: t,
				factory: () => p(jl),
				providedIn: "root",
			}));
		let e = t;
		return e;
	})(),
	Mm = new b("appBaseHref"),
	jl = (() => {
		let t = class t extends oo {
			constructor(n, o) {
				super(),
					(this._platformLocation = n),
					(this._removeListenerFns = []),
					(this._baseHref =
						o ??
						this._platformLocation.getBaseHrefFromDOM() ??
						p(K).location?.origin ??
						"");
			}
			ngOnDestroy() {
				for (; this._removeListenerFns.length; )
					this._removeListenerFns.pop()();
			}
			onPopState(n) {
				this._removeListenerFns.push(
					this._platformLocation.onPopState(n),
					this._platformLocation.onHashChange(n),
				);
			}
			getBaseHref() {
				return this._baseHref;
			}
			prepareExternalUrl(n) {
				return Ll(this._baseHref, n);
			}
			path(n = !1) {
				let o =
						this._platformLocation.pathname +
						pt(this._platformLocation.search),
					i = this._platformLocation.hash;
				return i && n ? `${o}${i}` : o;
			}
			pushState(n, o, i, s) {
				let a = this.prepareExternalUrl(i + pt(s));
				this._platformLocation.pushState(n, o, a);
			}
			replaceState(n, o, i, s) {
				let a = this.prepareExternalUrl(i + pt(s));
				this._platformLocation.replaceState(n, o, a);
			}
			forward() {
				this._platformLocation.forward();
			}
			back() {
				this._platformLocation.back();
			}
			getState() {
				return this._platformLocation.getState();
			}
			historyGo(n = 0) {
				this._platformLocation.historyGo?.(n);
			}
		};
		(t.ɵfac = function (o) {
			return new (o || t)(v(kl), v(Mm, 8));
		}),
			(t.ɵprov = m({ token: t, factory: t.ɵfac, providedIn: "root" }));
		let e = t;
		return e;
	})();
var _n = (() => {
	let t = class t {
		constructor(n) {
			(this._subject = new we()),
				(this._urlChangeListeners = []),
				(this._urlChangeSubscription = null),
				(this._locationStrategy = n);
			let o = this._locationStrategy.getBaseHref();
			(this._basePath = xm(Nl(Rl(o)))),
				this._locationStrategy.onPopState((i) => {
					this._subject.emit({
						url: this.path(!0),
						pop: !0,
						state: i.state,
						type: i.type,
					});
				});
		}
		ngOnDestroy() {
			this._urlChangeSubscription?.unsubscribe(),
				(this._urlChangeListeners = []);
		}
		path(n = !1) {
			return this.normalize(this._locationStrategy.path(n));
		}
		getState() {
			return this._locationStrategy.getState();
		}
		isCurrentPathEqualTo(n, o = "") {
			return this.path() == this.normalize(n + pt(o));
		}
		normalize(n) {
			return t.stripTrailingSlash(Sm(this._basePath, Rl(n)));
		}
		prepareExternalUrl(n) {
			return (
				n && n[0] !== "/" && (n = "/" + n),
				this._locationStrategy.prepareExternalUrl(n)
			);
		}
		go(n, o = "", i = null) {
			this._locationStrategy.pushState(i, "", n, o),
				this._notifyUrlChangeListeners(
					this.prepareExternalUrl(n + pt(o)),
					i,
				);
		}
		replaceState(n, o = "", i = null) {
			this._locationStrategy.replaceState(i, "", n, o),
				this._notifyUrlChangeListeners(
					this.prepareExternalUrl(n + pt(o)),
					i,
				);
		}
		forward() {
			this._locationStrategy.forward();
		}
		back() {
			this._locationStrategy.back();
		}
		historyGo(n = 0) {
			this._locationStrategy.historyGo?.(n);
		}
		onUrlChange(n) {
			return (
				this._urlChangeListeners.push(n),
				this._urlChangeSubscription ||
					(this._urlChangeSubscription = this.subscribe((o) => {
						this._notifyUrlChangeListeners(o.url, o.state);
					})),
				() => {
					let o = this._urlChangeListeners.indexOf(n);
					this._urlChangeListeners.splice(o, 1),
						this._urlChangeListeners.length === 0 &&
							(this._urlChangeSubscription?.unsubscribe(),
							(this._urlChangeSubscription = null));
				}
			);
		}
		_notifyUrlChangeListeners(n = "", o) {
			this._urlChangeListeners.forEach((i) => i(n, o));
		}
		subscribe(n, o, i) {
			return this._subject.subscribe({ next: n, error: o, complete: i });
		}
	};
	(t.normalizeQueryParams = pt),
		(t.joinWithSlash = Ll),
		(t.stripTrailingSlash = Nl),
		(t.ɵfac = function (o) {
			return new (o || t)(v(oo));
		}),
		(t.ɵprov = m({ token: t, factory: () => Tm(), providedIn: "root" }));
	let e = t;
	return e;
})();
function Tm() {
	return new _n(v(oo));
}
function Sm(e, t) {
	if (!e || !t.startsWith(e)) return t;
	let r = t.substring(e.length);
	return r === "" || ["/", ";", "?", "#"].includes(r[0]) ? r : t;
}
function Rl(e) {
	return e.replace(/\/index.html$/, "");
}
function xm(e) {
	if (new RegExp("^(https?:)?//").test(e)) {
		let [, r] = e.split(/\/\/[^\/]+/);
		return r;
	}
	return e;
}
function io(e, t) {
	t = encodeURIComponent(t);
	for (let r of e.split(";")) {
		let n = r.indexOf("="),
			[o, i] = n == -1 ? [r, ""] : [r.slice(0, n), r.slice(n + 1)];
		if (o.trim() === t) return decodeURIComponent(i);
	}
	return null;
}
var Vl = "browser",
	Am = "server";
function ys(e) {
	return e === Am;
}
var qt = class {};
var Rn = class {},
	ao = class {},
	gt = class e {
		constructor(t) {
			(this.normalizedNames = new Map()),
				(this.lazyUpdate = null),
				t
					? typeof t == "string"
						? (this.lazyInit = () => {
								(this.headers = new Map()),
									t
										.split(
											`
`,
										)
										.forEach((r) => {
											let n = r.indexOf(":");
											if (n > 0) {
												let o = r.slice(0, n),
													i = o.toLowerCase(),
													s = r.slice(n + 1).trim();
												this.maybeSetNormalizedName(
													o,
													i,
												),
													this.headers.has(i)
														? this.headers
																.get(i)
																.push(s)
														: this.headers.set(i, [
																s,
															]);
											}
										});
							})
						: typeof Headers < "u" && t instanceof Headers
							? ((this.headers = new Map()),
								t.forEach((r, n) => {
									this.setHeaderEntries(n, r);
								}))
							: (this.lazyInit = () => {
									(this.headers = new Map()),
										Object.entries(t).forEach(([r, n]) => {
											this.setHeaderEntries(r, n);
										});
								})
					: (this.headers = new Map());
		}
		has(t) {
			return this.init(), this.headers.has(t.toLowerCase());
		}
		get(t) {
			this.init();
			let r = this.headers.get(t.toLowerCase());
			return r && r.length > 0 ? r[0] : null;
		}
		keys() {
			return this.init(), Array.from(this.normalizedNames.values());
		}
		getAll(t) {
			return this.init(), this.headers.get(t.toLowerCase()) || null;
		}
		append(t, r) {
			return this.clone({ name: t, value: r, op: "a" });
		}
		set(t, r) {
			return this.clone({ name: t, value: r, op: "s" });
		}
		delete(t, r) {
			return this.clone({ name: t, value: r, op: "d" });
		}
		maybeSetNormalizedName(t, r) {
			this.normalizedNames.has(r) || this.normalizedNames.set(r, t);
		}
		init() {
			this.lazyInit &&
				(this.lazyInit instanceof e
					? this.copyFrom(this.lazyInit)
					: this.lazyInit(),
				(this.lazyInit = null),
				this.lazyUpdate &&
					(this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
					(this.lazyUpdate = null)));
		}
		copyFrom(t) {
			t.init(),
				Array.from(t.headers.keys()).forEach((r) => {
					this.headers.set(r, t.headers.get(r)),
						this.normalizedNames.set(r, t.normalizedNames.get(r));
				});
		}
		clone(t) {
			let r = new e();
			return (
				(r.lazyInit =
					this.lazyInit && this.lazyInit instanceof e
						? this.lazyInit
						: this),
				(r.lazyUpdate = (this.lazyUpdate || []).concat([t])),
				r
			);
		}
		applyUpdate(t) {
			let r = t.name.toLowerCase();
			switch (t.op) {
				case "a":
				case "s":
					let n = t.value;
					if ((typeof n == "string" && (n = [n]), n.length === 0))
						return;
					this.maybeSetNormalizedName(t.name, r);
					let o = (t.op === "a" ? this.headers.get(r) : void 0) || [];
					o.push(...n), this.headers.set(r, o);
					break;
				case "d":
					let i = t.value;
					if (!i)
						this.headers.delete(r), this.normalizedNames.delete(r);
					else {
						let s = this.headers.get(r);
						if (!s) return;
						(s = s.filter((a) => i.indexOf(a) === -1)),
							s.length === 0
								? (this.headers.delete(r),
									this.normalizedNames.delete(r))
								: this.headers.set(r, s);
					}
					break;
			}
		}
		setHeaderEntries(t, r) {
			let n = (Array.isArray(r) ? r : [r]).map((i) => i.toString()),
				o = t.toLowerCase();
			this.headers.set(o, n), this.maybeSetNormalizedName(t, o);
		}
		forEach(t) {
			this.init(),
				Array.from(this.normalizedNames.keys()).forEach((r) =>
					t(this.normalizedNames.get(r), this.headers.get(r)),
				);
		}
	};
var ws = class {
	encodeKey(t) {
		return $l(t);
	}
	encodeValue(t) {
		return $l(t);
	}
	decodeKey(t) {
		return decodeURIComponent(t);
	}
	decodeValue(t) {
		return decodeURIComponent(t);
	}
};
function Om(e, t) {
	let r = new Map();
	return (
		e.length > 0 &&
			e
				.replace(/^\?/, "")
				.split("&")
				.forEach((o) => {
					let i = o.indexOf("="),
						[s, a] =
							i == -1
								? [t.decodeKey(o), ""]
								: [
										t.decodeKey(o.slice(0, i)),
										t.decodeValue(o.slice(i + 1)),
									],
						c = r.get(s) || [];
					c.push(a), r.set(s, c);
				}),
		r
	);
}
var Pm = /%(\d[a-f0-9])/gi,
	Fm = {
		40: "@",
		"3A": ":",
		24: "$",
		"2C": ",",
		"3B": ";",
		"3D": "=",
		"3F": "?",
		"2F": "/",
	};
function $l(e) {
	return encodeURIComponent(e).replace(Pm, (t, r) => Fm[r] ?? t);
}
function so(e) {
	return `${e}`;
}
var Xe = class e {
	constructor(t = {}) {
		if (
			((this.updates = null),
			(this.cloneFrom = null),
			(this.encoder = t.encoder || new ws()),
			t.fromString)
		) {
			if (t.fromObject)
				throw new Error(
					"Cannot specify both fromString and fromObject.",
				);
			this.map = Om(t.fromString, this.encoder);
		} else
			t.fromObject
				? ((this.map = new Map()),
					Object.keys(t.fromObject).forEach((r) => {
						let n = t.fromObject[r],
							o = Array.isArray(n) ? n.map(so) : [so(n)];
						this.map.set(r, o);
					}))
				: (this.map = null);
	}
	has(t) {
		return this.init(), this.map.has(t);
	}
	get(t) {
		this.init();
		let r = this.map.get(t);
		return r ? r[0] : null;
	}
	getAll(t) {
		return this.init(), this.map.get(t) || null;
	}
	keys() {
		return this.init(), Array.from(this.map.keys());
	}
	append(t, r) {
		return this.clone({ param: t, value: r, op: "a" });
	}
	appendAll(t) {
		let r = [];
		return (
			Object.keys(t).forEach((n) => {
				let o = t[n];
				Array.isArray(o)
					? o.forEach((i) => {
							r.push({ param: n, value: i, op: "a" });
						})
					: r.push({ param: n, value: o, op: "a" });
			}),
			this.clone(r)
		);
	}
	set(t, r) {
		return this.clone({ param: t, value: r, op: "s" });
	}
	delete(t, r) {
		return this.clone({ param: t, value: r, op: "d" });
	}
	toString() {
		return (
			this.init(),
			this.keys()
				.map((t) => {
					let r = this.encoder.encodeKey(t);
					return this.map
						.get(t)
						.map((n) => r + "=" + this.encoder.encodeValue(n))
						.join("&");
				})
				.filter((t) => t !== "")
				.join("&")
		);
	}
	clone(t) {
		let r = new e({ encoder: this.encoder });
		return (
			(r.cloneFrom = this.cloneFrom || this),
			(r.updates = (this.updates || []).concat(t)),
			r
		);
	}
	init() {
		this.map === null && (this.map = new Map()),
			this.cloneFrom !== null &&
				(this.cloneFrom.init(),
				this.cloneFrom
					.keys()
					.forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
				this.updates.forEach((t) => {
					switch (t.op) {
						case "a":
						case "s":
							let r =
								(t.op === "a"
									? this.map.get(t.param)
									: void 0) || [];
							r.push(so(t.value)), this.map.set(t.param, r);
							break;
						case "d":
							if (t.value !== void 0) {
								let n = this.map.get(t.param) || [],
									o = n.indexOf(so(t.value));
								o !== -1 && n.splice(o, 1),
									n.length > 0
										? this.map.set(t.param, n)
										: this.map.delete(t.param);
							} else {
								this.map.delete(t.param);
								break;
							}
					}
				}),
				(this.cloneFrom = this.updates = null));
	}
};
var Es = class {
	constructor() {
		this.map = new Map();
	}
	set(t, r) {
		return this.map.set(t, r), this;
	}
	get(t) {
		return (
			this.map.has(t) || this.map.set(t, t.defaultValue()),
			this.map.get(t)
		);
	}
	delete(t) {
		return this.map.delete(t), this;
	}
	has(t) {
		return this.map.has(t);
	}
	keys() {
		return this.map.keys();
	}
};
function km(e) {
	switch (e) {
		case "DELETE":
		case "GET":
		case "HEAD":
		case "OPTIONS":
		case "JSONP":
			return !1;
		default:
			return !0;
	}
}
function Ul(e) {
	return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer;
}
function Bl(e) {
	return typeof Blob < "u" && e instanceof Blob;
}
function Hl(e) {
	return typeof FormData < "u" && e instanceof FormData;
}
function Lm(e) {
	return typeof URLSearchParams < "u" && e instanceof URLSearchParams;
}
var Nn = class e {
		constructor(t, r, n, o) {
			(this.url = r),
				(this.body = null),
				(this.reportProgress = !1),
				(this.withCredentials = !1),
				(this.responseType = "json"),
				(this.method = t.toUpperCase());
			let i;
			if (
				(km(this.method) || o
					? ((this.body = n !== void 0 ? n : null), (i = o))
					: (i = n),
				i &&
					((this.reportProgress = !!i.reportProgress),
					(this.withCredentials = !!i.withCredentials),
					i.responseType && (this.responseType = i.responseType),
					i.headers && (this.headers = i.headers),
					i.context && (this.context = i.context),
					i.params && (this.params = i.params),
					(this.transferCache = i.transferCache)),
				this.headers || (this.headers = new gt()),
				this.context || (this.context = new Es()),
				!this.params)
			)
				(this.params = new Xe()), (this.urlWithParams = r);
			else {
				let s = this.params.toString();
				if (s.length === 0) this.urlWithParams = r;
				else {
					let a = r.indexOf("?"),
						c = a === -1 ? "?" : a < r.length - 1 ? "&" : "";
					this.urlWithParams = r + c + s;
				}
			}
		}
		serializeBody() {
			return this.body === null
				? null
				: Ul(this.body) ||
					  Bl(this.body) ||
					  Hl(this.body) ||
					  Lm(this.body) ||
					  typeof this.body == "string"
					? this.body
					: this.body instanceof Xe
						? this.body.toString()
						: typeof this.body == "object" ||
							  typeof this.body == "boolean" ||
							  Array.isArray(this.body)
							? JSON.stringify(this.body)
							: this.body.toString();
		}
		detectContentTypeHeader() {
			return this.body === null || Hl(this.body)
				? null
				: Bl(this.body)
					? this.body.type || null
					: Ul(this.body)
						? null
						: typeof this.body == "string"
							? "text/plain"
							: this.body instanceof Xe
								? "application/x-www-form-urlencoded;charset=UTF-8"
								: typeof this.body == "object" ||
									  typeof this.body == "number" ||
									  typeof this.body == "boolean"
									? "application/json"
									: null;
		}
		clone(t = {}) {
			let r = t.method || this.method,
				n = t.url || this.url,
				o = t.responseType || this.responseType,
				i = t.body !== void 0 ? t.body : this.body,
				s =
					t.withCredentials !== void 0
						? t.withCredentials
						: this.withCredentials,
				a =
					t.reportProgress !== void 0
						? t.reportProgress
						: this.reportProgress,
				c = t.headers || this.headers,
				u = t.params || this.params,
				l = t.context ?? this.context;
			return (
				t.setHeaders !== void 0 &&
					(c = Object.keys(t.setHeaders).reduce(
						(d, f) => d.set(f, t.setHeaders[f]),
						c,
					)),
				t.setParams &&
					(u = Object.keys(t.setParams).reduce(
						(d, f) => d.set(f, t.setParams[f]),
						u,
					)),
				new e(r, n, i, {
					params: u,
					headers: c,
					context: l,
					reportProgress: a,
					responseType: o,
					withCredentials: s,
				})
			);
		}
	},
	Zt = (function (e) {
		return (
			(e[(e.Sent = 0)] = "Sent"),
			(e[(e.UploadProgress = 1)] = "UploadProgress"),
			(e[(e.ResponseHeader = 2)] = "ResponseHeader"),
			(e[(e.DownloadProgress = 3)] = "DownloadProgress"),
			(e[(e.Response = 4)] = "Response"),
			(e[(e.User = 5)] = "User"),
			e
		);
	})(Zt || {}),
	On = class {
		constructor(t, r = lo.Ok, n = "OK") {
			(this.headers = t.headers || new gt()),
				(this.status = t.status !== void 0 ? t.status : r),
				(this.statusText = t.statusText || n),
				(this.url = t.url || null),
				(this.ok = this.status >= 200 && this.status < 300);
		}
	},
	Cs = class e extends On {
		constructor(t = {}) {
			super(t), (this.type = Zt.ResponseHeader);
		}
		clone(t = {}) {
			return new e({
				headers: t.headers || this.headers,
				status: t.status !== void 0 ? t.status : this.status,
				statusText: t.statusText || this.statusText,
				url: t.url || this.url || void 0,
			});
		}
	},
	co = class e extends On {
		constructor(t = {}) {
			super(t),
				(this.type = Zt.Response),
				(this.body = t.body !== void 0 ? t.body : null);
		}
		clone(t = {}) {
			return new e({
				body: t.body !== void 0 ? t.body : this.body,
				headers: t.headers || this.headers,
				status: t.status !== void 0 ? t.status : this.status,
				statusText: t.statusText || this.statusText,
				url: t.url || this.url || void 0,
			});
		}
	},
	uo = class extends On {
		constructor(t) {
			super(t, 0, "Unknown Error"),
				(this.name = "HttpErrorResponse"),
				(this.ok = !1),
				this.status >= 200 && this.status < 300
					? (this.message = `Http failure during parsing for ${t.url || "(unknown url)"}`)
					: (this.message = `Http failure response for ${t.url || "(unknown url)"}: ${t.status} ${t.statusText}`),
				(this.error = t.error || null);
		}
	},
	lo = (function (e) {
		return (
			(e[(e.Continue = 100)] = "Continue"),
			(e[(e.SwitchingProtocols = 101)] = "SwitchingProtocols"),
			(e[(e.Processing = 102)] = "Processing"),
			(e[(e.EarlyHints = 103)] = "EarlyHints"),
			(e[(e.Ok = 200)] = "Ok"),
			(e[(e.Created = 201)] = "Created"),
			(e[(e.Accepted = 202)] = "Accepted"),
			(e[(e.NonAuthoritativeInformation = 203)] =
				"NonAuthoritativeInformation"),
			(e[(e.NoContent = 204)] = "NoContent"),
			(e[(e.ResetContent = 205)] = "ResetContent"),
			(e[(e.PartialContent = 206)] = "PartialContent"),
			(e[(e.MultiStatus = 207)] = "MultiStatus"),
			(e[(e.AlreadyReported = 208)] = "AlreadyReported"),
			(e[(e.ImUsed = 226)] = "ImUsed"),
			(e[(e.MultipleChoices = 300)] = "MultipleChoices"),
			(e[(e.MovedPermanently = 301)] = "MovedPermanently"),
			(e[(e.Found = 302)] = "Found"),
			(e[(e.SeeOther = 303)] = "SeeOther"),
			(e[(e.NotModified = 304)] = "NotModified"),
			(e[(e.UseProxy = 305)] = "UseProxy"),
			(e[(e.Unused = 306)] = "Unused"),
			(e[(e.TemporaryRedirect = 307)] = "TemporaryRedirect"),
			(e[(e.PermanentRedirect = 308)] = "PermanentRedirect"),
			(e[(e.BadRequest = 400)] = "BadRequest"),
			(e[(e.Unauthorized = 401)] = "Unauthorized"),
			(e[(e.PaymentRequired = 402)] = "PaymentRequired"),
			(e[(e.Forbidden = 403)] = "Forbidden"),
			(e[(e.NotFound = 404)] = "NotFound"),
			(e[(e.MethodNotAllowed = 405)] = "MethodNotAllowed"),
			(e[(e.NotAcceptable = 406)] = "NotAcceptable"),
			(e[(e.ProxyAuthenticationRequired = 407)] =
				"ProxyAuthenticationRequired"),
			(e[(e.RequestTimeout = 408)] = "RequestTimeout"),
			(e[(e.Conflict = 409)] = "Conflict"),
			(e[(e.Gone = 410)] = "Gone"),
			(e[(e.LengthRequired = 411)] = "LengthRequired"),
			(e[(e.PreconditionFailed = 412)] = "PreconditionFailed"),
			(e[(e.PayloadTooLarge = 413)] = "PayloadTooLarge"),
			(e[(e.UriTooLong = 414)] = "UriTooLong"),
			(e[(e.UnsupportedMediaType = 415)] = "UnsupportedMediaType"),
			(e[(e.RangeNotSatisfiable = 416)] = "RangeNotSatisfiable"),
			(e[(e.ExpectationFailed = 417)] = "ExpectationFailed"),
			(e[(e.ImATeapot = 418)] = "ImATeapot"),
			(e[(e.MisdirectedRequest = 421)] = "MisdirectedRequest"),
			(e[(e.UnprocessableEntity = 422)] = "UnprocessableEntity"),
			(e[(e.Locked = 423)] = "Locked"),
			(e[(e.FailedDependency = 424)] = "FailedDependency"),
			(e[(e.TooEarly = 425)] = "TooEarly"),
			(e[(e.UpgradeRequired = 426)] = "UpgradeRequired"),
			(e[(e.PreconditionRequired = 428)] = "PreconditionRequired"),
			(e[(e.TooManyRequests = 429)] = "TooManyRequests"),
			(e[(e.RequestHeaderFieldsTooLarge = 431)] =
				"RequestHeaderFieldsTooLarge"),
			(e[(e.UnavailableForLegalReasons = 451)] =
				"UnavailableForLegalReasons"),
			(e[(e.InternalServerError = 500)] = "InternalServerError"),
			(e[(e.NotImplemented = 501)] = "NotImplemented"),
			(e[(e.BadGateway = 502)] = "BadGateway"),
			(e[(e.ServiceUnavailable = 503)] = "ServiceUnavailable"),
			(e[(e.GatewayTimeout = 504)] = "GatewayTimeout"),
			(e[(e.HttpVersionNotSupported = 505)] = "HttpVersionNotSupported"),
			(e[(e.VariantAlsoNegotiates = 506)] = "VariantAlsoNegotiates"),
			(e[(e.InsufficientStorage = 507)] = "InsufficientStorage"),
			(e[(e.LoopDetected = 508)] = "LoopDetected"),
			(e[(e.NotExtended = 510)] = "NotExtended"),
			(e[(e.NetworkAuthenticationRequired = 511)] =
				"NetworkAuthenticationRequired"),
			e
		);
	})(lo || {});
function Ds(e, t) {
	return {
		body: t,
		headers: e.headers,
		context: e.context,
		observe: e.observe,
		params: e.params,
		reportProgress: e.reportProgress,
		responseType: e.responseType,
		withCredentials: e.withCredentials,
		transferCache: e.transferCache,
	};
}
var Is = (() => {
	let t = class t {
		constructor(n) {
			this.handler = n;
		}
		request(n, o, i = {}) {
			let s;
			if (n instanceof Nn) s = n;
			else {
				let u;
				i.headers instanceof gt
					? (u = i.headers)
					: (u = new gt(i.headers));
				let l;
				i.params &&
					(i.params instanceof Xe
						? (l = i.params)
						: (l = new Xe({ fromObject: i.params }))),
					(s = new Nn(n, o, i.body !== void 0 ? i.body : null, {
						headers: u,
						context: i.context,
						params: l,
						reportProgress: i.reportProgress,
						responseType: i.responseType || "json",
						withCredentials: i.withCredentials,
						transferCache: i.transferCache,
					}));
			}
			let a = y(s).pipe(He((u) => this.handler.handle(u)));
			if (n instanceof Nn || i.observe === "events") return a;
			let c = a.pipe(re((u) => u instanceof co));
			switch (i.observe || "body") {
				case "body":
					switch (s.responseType) {
						case "arraybuffer":
							return c.pipe(
								T((u) => {
									if (
										u.body !== null &&
										!(u.body instanceof ArrayBuffer)
									)
										throw new Error(
											"Response is not an ArrayBuffer.",
										);
									return u.body;
								}),
							);
						case "blob":
							return c.pipe(
								T((u) => {
									if (
										u.body !== null &&
										!(u.body instanceof Blob)
									)
										throw new Error(
											"Response is not a Blob.",
										);
									return u.body;
								}),
							);
						case "text":
							return c.pipe(
								T((u) => {
									if (
										u.body !== null &&
										typeof u.body != "string"
									)
										throw new Error(
											"Response is not a string.",
										);
									return u.body;
								}),
							);
						case "json":
						default:
							return c.pipe(T((u) => u.body));
					}
				case "response":
					return c;
				default:
					throw new Error(
						`Unreachable: unhandled observe type ${i.observe}}`,
					);
			}
		}
		delete(n, o = {}) {
			return this.request("DELETE", n, o);
		}
		get(n, o = {}) {
			return this.request("GET", n, o);
		}
		head(n, o = {}) {
			return this.request("HEAD", n, o);
		}
		jsonp(n, o) {
			return this.request("JSONP", n, {
				params: new Xe().append(o, "JSONP_CALLBACK"),
				observe: "body",
				responseType: "json",
			});
		}
		options(n, o = {}) {
			return this.request("OPTIONS", n, o);
		}
		patch(n, o, i = {}) {
			return this.request("PATCH", n, Ds(i, o));
		}
		post(n, o, i = {}) {
			return this.request("POST", n, Ds(i, o));
		}
		put(n, o, i = {}) {
			return this.request("PUT", n, Ds(i, o));
		}
	};
	(t.ɵfac = function (o) {
		return new (o || t)(v(Rn));
	}),
		(t.ɵprov = m({ token: t, factory: t.ɵfac }));
	let e = t;
	return e;
})();
function jm(e, t) {
	return t(e);
}
function Vm(e, t, r) {
	return (n, o) => Ve(r, () => t(n, (i) => e(i, o)));
}
var Wl = new b(""),
	$m = new b(""),
	Um = new b("");
var zl = (() => {
	let t = class t extends Rn {
		constructor(n, o) {
			super(),
				(this.backend = n),
				(this.injector = o),
				(this.chain = null),
				(this.pendingTasks = p(zt));
			let i = p(Um, { optional: !0 });
			this.backend = i ?? n;
		}
		handle(n) {
			if (this.chain === null) {
				let i = Array.from(
					new Set([
						...this.injector.get(Wl),
						...this.injector.get($m, []),
					]),
				);
				this.chain = i.reduceRight(
					(s, a) => Vm(s, a, this.injector),
					jm,
				);
			}
			let o = this.pendingTasks.add();
			return this.chain(n, (i) => this.backend.handle(i)).pipe(
				st(() => this.pendingTasks.remove(o)),
			);
		}
	};
	(t.ɵfac = function (o) {
		return new (o || t)(v(ao), v(X));
	}),
		(t.ɵprov = m({ token: t, factory: t.ɵfac }));
	let e = t;
	return e;
})();
var Bm = /^\)\]\}',?\n/;
function Hm(e) {
	return "responseURL" in e && e.responseURL
		? e.responseURL
		: /^X-Request-URL:/m.test(e.getAllResponseHeaders())
			? e.getResponseHeader("X-Request-URL")
			: null;
}
var Gl = (() => {
		let t = class t {
			constructor(n) {
				this.xhrFactory = n;
			}
			handle(n) {
				if (n.method === "JSONP") throw new D(-2800, !1);
				let o = this.xhrFactory;
				return (o.ɵloadImpl ? L(o.ɵloadImpl()) : y(null)).pipe(
					oe(
						() =>
							new R((s) => {
								let a = o.build();
								if (
									(a.open(n.method, n.urlWithParams),
									n.withCredentials &&
										(a.withCredentials = !0),
									n.headers.forEach((N, C) =>
										a.setRequestHeader(N, C.join(",")),
									),
									n.headers.has("Accept") ||
										a.setRequestHeader(
											"Accept",
											"application/json, text/plain, */*",
										),
									!n.headers.has("Content-Type"))
								) {
									let N = n.detectContentTypeHeader();
									N !== null &&
										a.setRequestHeader("Content-Type", N);
								}
								if (n.responseType) {
									let N = n.responseType.toLowerCase();
									a.responseType = N !== "json" ? N : "text";
								}
								let c = n.serializeBody(),
									u = null,
									l = () => {
										if (u !== null) return u;
										let N = a.statusText || "OK",
											C = new gt(
												a.getAllResponseHeaders(),
											),
											Y = Hm(a) || n.url;
										return (
											(u = new Cs({
												headers: C,
												status: a.status,
												statusText: N,
												url: Y,
											})),
											u
										);
									},
									d = () => {
										let {
												headers: N,
												status: C,
												statusText: Y,
												url: on,
											} = l(),
											$ = null;
										C !== lo.NoContent &&
											($ =
												typeof a.response > "u"
													? a.responseText
													: a.response),
											C === 0 && (C = $ ? lo.Ok : 0);
										let ce = C >= 200 && C < 300;
										if (
											n.responseType === "json" &&
											typeof $ == "string"
										) {
											let $e = $;
											$ = $.replace(Bm, "");
											try {
												$ =
													$ !== ""
														? JSON.parse($)
														: null;
											} catch (sn) {
												($ = $e),
													ce &&
														((ce = !1),
														($ = {
															error: sn,
															text: $,
														}));
											}
										}
										ce
											? (s.next(
													new co({
														body: $,
														headers: N,
														status: C,
														statusText: Y,
														url: on || void 0,
													}),
												),
												s.complete())
											: s.error(
													new uo({
														error: $,
														headers: N,
														status: C,
														statusText: Y,
														url: on || void 0,
													}),
												);
									},
									f = (N) => {
										let { url: C } = l(),
											Y = new uo({
												error: N,
												status: a.status || 0,
												statusText:
													a.statusText ||
													"Unknown Error",
												url: C || void 0,
											});
										s.error(Y);
									},
									h = !1,
									E = (N) => {
										h || (s.next(l()), (h = !0));
										let C = {
											type: Zt.DownloadProgress,
											loaded: N.loaded,
										};
										N.lengthComputable &&
											(C.total = N.total),
											n.responseType === "text" &&
												a.responseText &&
												(C.partialText =
													a.responseText),
											s.next(C);
									},
									F = (N) => {
										let C = {
											type: Zt.UploadProgress,
											loaded: N.loaded,
										};
										N.lengthComputable &&
											(C.total = N.total),
											s.next(C);
									};
								return (
									a.addEventListener("load", d),
									a.addEventListener("error", f),
									a.addEventListener("timeout", f),
									a.addEventListener("abort", f),
									n.reportProgress &&
										(a.addEventListener("progress", E),
										c !== null &&
											a.upload &&
											a.upload.addEventListener(
												"progress",
												F,
											)),
									a.send(c),
									s.next({ type: Zt.Sent }),
									() => {
										a.removeEventListener("error", f),
											a.removeEventListener("abort", f),
											a.removeEventListener("load", d),
											a.removeEventListener("timeout", f),
											n.reportProgress &&
												(a.removeEventListener(
													"progress",
													E,
												),
												c !== null &&
													a.upload &&
													a.upload.removeEventListener(
														"progress",
														F,
													)),
											a.readyState !== a.DONE &&
												a.abort();
									}
								);
							}),
					),
				);
			}
		};
		(t.ɵfac = function (o) {
			return new (o || t)(v(qt));
		}),
			(t.ɵprov = m({ token: t, factory: t.ɵfac }));
		let e = t;
		return e;
	})(),
	ql = new b("XSRF_ENABLED"),
	zm = "XSRF-TOKEN",
	Gm = new b("XSRF_COOKIE_NAME", { providedIn: "root", factory: () => zm }),
	Wm = "X-XSRF-TOKEN",
	qm = new b("XSRF_HEADER_NAME", { providedIn: "root", factory: () => Wm }),
	fo = class {},
	Zm = (() => {
		let t = class t {
			constructor(n, o, i) {
				(this.doc = n),
					(this.platform = o),
					(this.cookieName = i),
					(this.lastCookieString = ""),
					(this.lastToken = null),
					(this.parseCount = 0);
			}
			getToken() {
				if (this.platform === "server") return null;
				let n = this.doc.cookie || "";
				return (
					n !== this.lastCookieString &&
						(this.parseCount++,
						(this.lastToken = io(n, this.cookieName)),
						(this.lastCookieString = n)),
					this.lastToken
				);
			}
		};
		(t.ɵfac = function (o) {
			return new (o || t)(v(K), v(Ke), v(Gm));
		}),
			(t.ɵprov = m({ token: t, factory: t.ɵfac }));
		let e = t;
		return e;
	})();
function Ym(e, t) {
	let r = e.url.toLowerCase();
	if (
		!p(ql) ||
		e.method === "GET" ||
		e.method === "HEAD" ||
		r.startsWith("http://") ||
		r.startsWith("https://")
	)
		return t(e);
	let n = p(fo).getToken(),
		o = p(qm);
	return (
		n != null &&
			!e.headers.has(o) &&
			(e = e.clone({ headers: e.headers.set(o, n) })),
		t(e)
	);
}
function Zl(...e) {
	let t = [
		Is,
		Gl,
		zl,
		{ provide: Rn, useExisting: zl },
		{ provide: ao, useExisting: Gl },
		{ provide: Wl, useValue: Ym, multi: !0 },
		{ provide: ql, useValue: !0 },
		{ provide: fo, useClass: Zm },
	];
	for (let r of e) t.push(...r.ɵproviders);
	return Ut(t);
}
var Ts = class extends ro {
		constructor() {
			super(...arguments), (this.supportsDOMEvents = !0);
		}
	},
	Ss = class e extends Ts {
		static makeCurrent() {
			Fl(new e());
		}
		onAndCancel(t, r, n) {
			return (
				t.addEventListener(r, n),
				() => {
					t.removeEventListener(r, n);
				}
			);
		}
		dispatchEvent(t, r) {
			t.dispatchEvent(r);
		}
		remove(t) {
			t.parentNode && t.parentNode.removeChild(t);
		}
		createElement(t, r) {
			return (r = r || this.getDefaultDocument()), r.createElement(t);
		}
		createHtmlDocument() {
			return document.implementation.createHTMLDocument("fakeTitle");
		}
		getDefaultDocument() {
			return document;
		}
		isElementNode(t) {
			return t.nodeType === Node.ELEMENT_NODE;
		}
		isShadowRoot(t) {
			return t instanceof DocumentFragment;
		}
		getGlobalEventTarget(t, r) {
			return r === "window"
				? window
				: r === "document"
					? t
					: r === "body"
						? t.body
						: null;
		}
		getBaseHref(t) {
			let r = Jm();
			return r == null ? null : Xm(r);
		}
		resetBaseElement() {
			Pn = null;
		}
		getUserAgent() {
			return window.navigator.userAgent;
		}
		getCookie(t) {
			return io(document.cookie, t);
		}
	},
	Pn = null;
function Jm() {
	return (
		(Pn = Pn || document.querySelector("base")),
		Pn ? Pn.getAttribute("href") : null
	);
}
function Xm(e) {
	return new URL(e, document.baseURI).pathname;
}
var ev = (() => {
		let t = class t {
			build() {
				return new XMLHttpRequest();
			}
		};
		(t.ɵfac = function (o) {
			return new (o || t)();
		}),
			(t.ɵprov = m({ token: t, factory: t.ɵfac }));
		let e = t;
		return e;
	})(),
	xs = new b("EventManagerPlugins"),
	Jl = (() => {
		let t = class t {
			constructor(n, o) {
				(this._zone = o),
					(this._eventNameToPlugin = new Map()),
					n.forEach((i) => {
						i.manager = this;
					}),
					(this._plugins = n.slice().reverse());
			}
			addEventListener(n, o, i) {
				return this._findPluginFor(o).addEventListener(n, o, i);
			}
			getZone() {
				return this._zone;
			}
			_findPluginFor(n) {
				let o = this._eventNameToPlugin.get(n);
				if (o) return o;
				if (((o = this._plugins.find((s) => s.supports(n))), !o))
					throw new D(5101, !1);
				return this._eventNameToPlugin.set(n, o), o;
			}
		};
		(t.ɵfac = function (o) {
			return new (o || t)(v(xs), v(j));
		}),
			(t.ɵprov = m({ token: t, factory: t.ɵfac }));
		let e = t;
		return e;
	})(),
	ho = class {
		constructor(t) {
			this._doc = t;
		}
	},
	bs = "ng-app-id",
	Xl = (() => {
		let t = class t {
			constructor(n, o, i, s = {}) {
				(this.doc = n),
					(this.appId = o),
					(this.nonce = i),
					(this.platformId = s),
					(this.styleRef = new Map()),
					(this.hostNodes = new Set()),
					(this.styleNodesInDOM = this.collectServerRenderedStyles()),
					(this.platformIsServer = ys(s)),
					this.resetHostNodes();
			}
			addStyles(n) {
				for (let o of n)
					this.changeUsageCount(o, 1) === 1 && this.onStyleAdded(o);
			}
			removeStyles(n) {
				for (let o of n)
					this.changeUsageCount(o, -1) <= 0 && this.onStyleRemoved(o);
			}
			ngOnDestroy() {
				let n = this.styleNodesInDOM;
				n && (n.forEach((o) => o.remove()), n.clear());
				for (let o of this.getAllStyles()) this.onStyleRemoved(o);
				this.resetHostNodes();
			}
			addHost(n) {
				this.hostNodes.add(n);
				for (let o of this.getAllStyles()) this.addStyleToHost(n, o);
			}
			removeHost(n) {
				this.hostNodes.delete(n);
			}
			getAllStyles() {
				return this.styleRef.keys();
			}
			onStyleAdded(n) {
				for (let o of this.hostNodes) this.addStyleToHost(o, n);
			}
			onStyleRemoved(n) {
				let o = this.styleRef;
				o.get(n)?.elements?.forEach((i) => i.remove()), o.delete(n);
			}
			collectServerRenderedStyles() {
				let n = this.doc.head?.querySelectorAll(
					`style[${bs}="${this.appId}"]`,
				);
				if (n?.length) {
					let o = new Map();
					return (
						n.forEach((i) => {
							i.textContent != null && o.set(i.textContent, i);
						}),
						o
					);
				}
				return null;
			}
			changeUsageCount(n, o) {
				let i = this.styleRef;
				if (i.has(n)) {
					let s = i.get(n);
					return (s.usage += o), s.usage;
				}
				return i.set(n, { usage: o, elements: [] }), o;
			}
			getStyleElement(n, o) {
				let i = this.styleNodesInDOM,
					s = i?.get(o);
				if (s?.parentNode === n)
					return i.delete(o), s.removeAttribute(bs), s;
				{
					let a = this.doc.createElement("style");
					return (
						this.nonce && a.setAttribute("nonce", this.nonce),
						(a.textContent = o),
						this.platformIsServer && a.setAttribute(bs, this.appId),
						n.appendChild(a),
						a
					);
				}
			}
			addStyleToHost(n, o) {
				let i = this.getStyleElement(n, o),
					s = this.styleRef,
					a = s.get(o)?.elements;
				a ? a.push(i) : s.set(o, { elements: [i], usage: 1 });
			}
			resetHostNodes() {
				let n = this.hostNodes;
				n.clear(), n.add(this.doc.head);
			}
		};
		(t.ɵfac = function (o) {
			return new (o || t)(v(K), v(Xi), v(ts, 8), v(Ke));
		}),
			(t.ɵprov = m({ token: t, factory: t.ɵfac }));
		let e = t;
		return e;
	})(),
	Ms = {
		svg: "http://www.w3.org/2000/svg",
		xhtml: "http://www.w3.org/1999/xhtml",
		xlink: "http://www.w3.org/1999/xlink",
		xml: "http://www.w3.org/XML/1998/namespace",
		xmlns: "http://www.w3.org/2000/xmlns/",
		math: "http://www.w3.org/1998/MathML/",
	},
	_s = /%COMP%/g,
	ed = "%COMP%",
	tv = `_nghost-${ed}`,
	nv = `_ngcontent-${ed}`,
	rv = !0,
	ov = new b("RemoveStylesOnCompDestroy", {
		providedIn: "root",
		factory: () => rv,
	});
function iv(e) {
	return nv.replace(_s, e);
}
function sv(e) {
	return tv.replace(_s, e);
}
function td(e, t) {
	return t.map((r) => r.replace(_s, e));
}
var Yl = (() => {
		let t = class t {
			constructor(n, o, i, s, a, c, u, l = null) {
				(this.eventManager = n),
					(this.sharedStylesHost = o),
					(this.appId = i),
					(this.removeStylesOnCompDestroy = s),
					(this.doc = a),
					(this.platformId = c),
					(this.ngZone = u),
					(this.nonce = l),
					(this.rendererByCompId = new Map()),
					(this.platformIsServer = ys(c)),
					(this.defaultRenderer = new Fn(
						n,
						a,
						u,
						this.platformIsServer,
					));
			}
			createRenderer(n, o) {
				if (!n || !o) return this.defaultRenderer;
				this.platformIsServer &&
					o.encapsulation === Te.ShadowDom &&
					(o = V(g({}, o), { encapsulation: Te.Emulated }));
				let i = this.getOrCreateRenderer(n, o);
				return (
					i instanceof po
						? i.applyToHost(n)
						: i instanceof kn && i.applyStyles(),
					i
				);
			}
			getOrCreateRenderer(n, o) {
				let i = this.rendererByCompId,
					s = i.get(o.id);
				if (!s) {
					let a = this.doc,
						c = this.ngZone,
						u = this.eventManager,
						l = this.sharedStylesHost,
						d = this.removeStylesOnCompDestroy,
						f = this.platformIsServer;
					switch (o.encapsulation) {
						case Te.Emulated:
							s = new po(u, l, o, this.appId, d, a, c, f);
							break;
						case Te.ShadowDom:
							return new As(u, l, n, o, a, c, this.nonce, f);
						default:
							s = new kn(u, l, o, d, a, c, f);
							break;
					}
					i.set(o.id, s);
				}
				return s;
			}
			ngOnDestroy() {
				this.rendererByCompId.clear();
			}
		};
		(t.ɵfac = function (o) {
			return new (o || t)(
				v(Jl),
				v(Xl),
				v(Xi),
				v(ov),
				v(K),
				v(Ke),
				v(j),
				v(ts),
			);
		}),
			(t.ɵprov = m({ token: t, factory: t.ɵfac }));
		let e = t;
		return e;
	})(),
	Fn = class {
		constructor(t, r, n, o) {
			(this.eventManager = t),
				(this.doc = r),
				(this.ngZone = n),
				(this.platformIsServer = o),
				(this.data = Object.create(null)),
				(this.throwOnSyntheticProps = !0),
				(this.destroyNode = null);
		}
		destroy() {}
		createElement(t, r) {
			return r
				? this.doc.createElementNS(Ms[r] || r, t)
				: this.doc.createElement(t);
		}
		createComment(t) {
			return this.doc.createComment(t);
		}
		createText(t) {
			return this.doc.createTextNode(t);
		}
		appendChild(t, r) {
			(Ql(t) ? t.content : t).appendChild(r);
		}
		insertBefore(t, r, n) {
			t && (Ql(t) ? t.content : t).insertBefore(r, n);
		}
		removeChild(t, r) {
			t && t.removeChild(r);
		}
		selectRootElement(t, r) {
			let n = typeof t == "string" ? this.doc.querySelector(t) : t;
			if (!n) throw new D(-5104, !1);
			return r || (n.textContent = ""), n;
		}
		parentNode(t) {
			return t.parentNode;
		}
		nextSibling(t) {
			return t.nextSibling;
		}
		setAttribute(t, r, n, o) {
			if (o) {
				r = o + ":" + r;
				let i = Ms[o];
				i ? t.setAttributeNS(i, r, n) : t.setAttribute(r, n);
			} else t.setAttribute(r, n);
		}
		removeAttribute(t, r, n) {
			if (n) {
				let o = Ms[n];
				o ? t.removeAttributeNS(o, r) : t.removeAttribute(`${n}:${r}`);
			} else t.removeAttribute(r);
		}
		addClass(t, r) {
			t.classList.add(r);
		}
		removeClass(t, r) {
			t.classList.remove(r);
		}
		setStyle(t, r, n, o) {
			o & (ht.DashCase | ht.Important)
				? t.style.setProperty(r, n, o & ht.Important ? "important" : "")
				: (t.style[r] = n);
		}
		removeStyle(t, r, n) {
			n & ht.DashCase ? t.style.removeProperty(r) : (t.style[r] = "");
		}
		setProperty(t, r, n) {
			t != null && (t[r] = n);
		}
		setValue(t, r) {
			t.nodeValue = r;
		}
		listen(t, r, n) {
			if (
				typeof t == "string" &&
				((t = Wt().getGlobalEventTarget(this.doc, t)), !t)
			)
				throw new Error(`Unsupported event target ${t} for event ${r}`);
			return this.eventManager.addEventListener(
				t,
				r,
				this.decoratePreventDefault(n),
			);
		}
		decoratePreventDefault(t) {
			return (r) => {
				if (r === "__ngUnwrap__") return t;
				(this.platformIsServer
					? this.ngZone.runGuarded(() => t(r))
					: t(r)) === !1 && r.preventDefault();
			};
		}
	};
function Ql(e) {
	return e.tagName === "TEMPLATE" && e.content !== void 0;
}
var As = class extends Fn {
		constructor(t, r, n, o, i, s, a, c) {
			super(t, i, s, c),
				(this.sharedStylesHost = r),
				(this.hostEl = n),
				(this.shadowRoot = n.attachShadow({ mode: "open" })),
				this.sharedStylesHost.addHost(this.shadowRoot);
			let u = td(o.id, o.styles);
			for (let l of u) {
				let d = document.createElement("style");
				a && d.setAttribute("nonce", a),
					(d.textContent = l),
					this.shadowRoot.appendChild(d);
			}
		}
		nodeOrShadowRoot(t) {
			return t === this.hostEl ? this.shadowRoot : t;
		}
		appendChild(t, r) {
			return super.appendChild(this.nodeOrShadowRoot(t), r);
		}
		insertBefore(t, r, n) {
			return super.insertBefore(this.nodeOrShadowRoot(t), r, n);
		}
		removeChild(t, r) {
			return super.removeChild(this.nodeOrShadowRoot(t), r);
		}
		parentNode(t) {
			return this.nodeOrShadowRoot(
				super.parentNode(this.nodeOrShadowRoot(t)),
			);
		}
		destroy() {
			this.sharedStylesHost.removeHost(this.shadowRoot);
		}
	},
	kn = class extends Fn {
		constructor(t, r, n, o, i, s, a, c) {
			super(t, i, s, a),
				(this.sharedStylesHost = r),
				(this.removeStylesOnCompDestroy = o),
				(this.styles = c ? td(c, n.styles) : n.styles);
		}
		applyStyles() {
			this.sharedStylesHost.addStyles(this.styles);
		}
		destroy() {
			this.removeStylesOnCompDestroy &&
				this.sharedStylesHost.removeStyles(this.styles);
		}
	},
	po = class extends kn {
		constructor(t, r, n, o, i, s, a, c) {
			let u = o + "-" + n.id;
			super(t, r, n, i, s, a, c, u),
				(this.contentAttr = iv(u)),
				(this.hostAttr = sv(u));
		}
		applyToHost(t) {
			this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
		}
		createElement(t, r) {
			let n = super.createElement(t, r);
			return super.setAttribute(n, this.contentAttr, ""), n;
		}
	},
	av = (() => {
		let t = class t extends ho {
			constructor(n) {
				super(n);
			}
			supports(n) {
				return !0;
			}
			addEventListener(n, o, i) {
				return (
					n.addEventListener(o, i, !1),
					() => this.removeEventListener(n, o, i)
				);
			}
			removeEventListener(n, o, i) {
				return n.removeEventListener(o, i);
			}
		};
		(t.ɵfac = function (o) {
			return new (o || t)(v(K));
		}),
			(t.ɵprov = m({ token: t, factory: t.ɵfac }));
		let e = t;
		return e;
	})(),
	Kl = ["alt", "control", "meta", "shift"],
	cv = {
		"\b": "Backspace",
		"	": "Tab",
		"\x7F": "Delete",
		"\x1B": "Escape",
		Del: "Delete",
		Esc: "Escape",
		Left: "ArrowLeft",
		Right: "ArrowRight",
		Up: "ArrowUp",
		Down: "ArrowDown",
		Menu: "ContextMenu",
		Scroll: "ScrollLock",
		Win: "OS",
	},
	uv = {
		alt: (e) => e.altKey,
		control: (e) => e.ctrlKey,
		meta: (e) => e.metaKey,
		shift: (e) => e.shiftKey,
	},
	lv = (() => {
		let t = class t extends ho {
			constructor(n) {
				super(n);
			}
			supports(n) {
				return t.parseEventName(n) != null;
			}
			addEventListener(n, o, i) {
				let s = t.parseEventName(o),
					a = t.eventCallback(s.fullKey, i, this.manager.getZone());
				return this.manager
					.getZone()
					.runOutsideAngular(() =>
						Wt().onAndCancel(n, s.domEventName, a),
					);
			}
			static parseEventName(n) {
				let o = n.toLowerCase().split("."),
					i = o.shift();
				if (o.length === 0 || !(i === "keydown" || i === "keyup"))
					return null;
				let s = t._normalizeKey(o.pop()),
					a = "",
					c = o.indexOf("code");
				if (
					(c > -1 && (o.splice(c, 1), (a = "code.")),
					Kl.forEach((l) => {
						let d = o.indexOf(l);
						d > -1 && (o.splice(d, 1), (a += l + "."));
					}),
					(a += s),
					o.length != 0 || s.length === 0)
				)
					return null;
				let u = {};
				return (u.domEventName = i), (u.fullKey = a), u;
			}
			static matchEventFullKeyCode(n, o) {
				let i = cv[n.key] || n.key,
					s = "";
				return (
					o.indexOf("code.") > -1 && ((i = n.code), (s = "code.")),
					i == null || !i
						? !1
						: ((i = i.toLowerCase()),
							i === " "
								? (i = "space")
								: i === "." && (i = "dot"),
							Kl.forEach((a) => {
								if (a !== i) {
									let c = uv[a];
									c(n) && (s += a + ".");
								}
							}),
							(s += i),
							s === o)
				);
			}
			static eventCallback(n, o, i) {
				return (s) => {
					t.matchEventFullKeyCode(s, n) && i.runGuarded(() => o(s));
				};
			}
			static _normalizeKey(n) {
				return n === "esc" ? "escape" : n;
			}
		};
		(t.ɵfac = function (o) {
			return new (o || t)(v(K));
		}),
			(t.ɵprov = m({ token: t, factory: t.ɵfac }));
		let e = t;
		return e;
	})();
function nd(e, t) {
	return _l(g({ rootComponent: e }, dv(t)));
}
function dv(e) {
	return {
		appProviders: [...mv, ...(e?.providers ?? [])],
		platformProviders: gv,
	};
}
function fv() {
	Ss.makeCurrent();
}
function hv() {
	return new Fe();
}
function pv() {
	return Uu(document), document;
}
var gv = [
	{ provide: Ke, useValue: Vl },
	{ provide: es, useValue: fv, multi: !0 },
	{ provide: K, useFactory: pv, deps: [] },
];
var mv = [
	{ provide: Zr, useValue: "root" },
	{ provide: Fe, useFactory: hv, deps: [] },
	{ provide: xs, useClass: av, multi: !0, deps: [K, j, Ke] },
	{ provide: xs, useClass: lv, multi: !0, deps: [K] },
	Yl,
	Xl,
	Jl,
	{ provide: En, useExisting: Yl },
	{ provide: qt, useClass: ev, deps: [] },
	[],
];
function vv() {
	return new Ns(v(K));
}
var Ns = (() => {
	let t = class t {
		constructor(n) {
			this._doc = n;
		}
		getTitle() {
			return this._doc.title;
		}
		setTitle(n) {
			this._doc.title = n || "";
		}
	};
	(t.ɵfac = function (o) {
		return new (o || t)(v(K));
	}),
		(t.ɵprov = m({
			token: t,
			factory: function (o) {
				let i = null;
				return o ? (i = new o()) : (i = vv()), i;
			},
			providedIn: "root",
		}));
	let e = t;
	return e;
})();
var M = "primary",
	Kn = Symbol("RouteTitle"),
	ks = class {
		constructor(t) {
			this.params = t || {};
		}
		has(t) {
			return Object.prototype.hasOwnProperty.call(this.params, t);
		}
		get(t) {
			if (this.has(t)) {
				let r = this.params[t];
				return Array.isArray(r) ? r[0] : r;
			}
			return null;
		}
		getAll(t) {
			if (this.has(t)) {
				let r = this.params[t];
				return Array.isArray(r) ? r : [r];
			}
			return [];
		}
		get keys() {
			return Object.keys(this.params);
		}
	};
function Xt(e) {
	return new ks(e);
}
function Dv(e, t, r) {
	let n = r.path.split("/");
	if (
		n.length > e.length ||
		(r.pathMatch === "full" && (t.hasChildren() || n.length < e.length))
	)
		return null;
	let o = {};
	for (let i = 0; i < n.length; i++) {
		let s = n[i],
			a = e[i];
		if (s.startsWith(":")) o[s.substring(1)] = a;
		else if (s !== a.path) return null;
	}
	return { consumed: e.slice(0, n.length), posParams: o };
}
function wv(e, t) {
	if (e.length !== t.length) return !1;
	for (let r = 0; r < e.length; ++r) if (!Ae(e[r], t[r])) return !1;
	return !0;
}
function Ae(e, t) {
	let r = e ? Ls(e) : void 0,
		n = t ? Ls(t) : void 0;
	if (!r || !n || r.length != n.length) return !1;
	let o;
	for (let i = 0; i < r.length; i++)
		if (((o = r[i]), !cd(e[o], t[o]))) return !1;
	return !0;
}
function Ls(e) {
	return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
}
function cd(e, t) {
	if (Array.isArray(e) && Array.isArray(t)) {
		if (e.length !== t.length) return !1;
		let r = [...e].sort(),
			n = [...t].sort();
		return r.every((o, i) => n[i] === o);
	} else return e === t;
}
function nt(e) {
	return zo(e) ? e : An(e) ? L(Promise.resolve(e)) : y(e);
}
var Ev = { exact: ld, subset: dd },
	ud = { exact: Cv, subset: Iv, ignored: () => !0 };
function rd(e, t, r) {
	return (
		Ev[r.paths](e.root, t.root, r.matrixParams) &&
		ud[r.queryParams](e.queryParams, t.queryParams) &&
		!(r.fragment === "exact" && e.fragment !== t.fragment)
	);
}
function Cv(e, t) {
	return Ae(e, t);
}
function ld(e, t, r) {
	if (
		!vt(e.segments, t.segments) ||
		!vo(e.segments, t.segments, r) ||
		e.numberOfChildren !== t.numberOfChildren
	)
		return !1;
	for (let n in t.children)
		if (!e.children[n] || !ld(e.children[n], t.children[n], r)) return !1;
	return !0;
}
function Iv(e, t) {
	return (
		Object.keys(t).length <= Object.keys(e).length &&
		Object.keys(t).every((r) => cd(e[r], t[r]))
	);
}
function dd(e, t, r) {
	return fd(e, t, t.segments, r);
}
function fd(e, t, r, n) {
	if (e.segments.length > r.length) {
		let o = e.segments.slice(0, r.length);
		return !(!vt(o, r) || t.hasChildren() || !vo(o, r, n));
	} else if (e.segments.length === r.length) {
		if (!vt(e.segments, r) || !vo(e.segments, r, n)) return !1;
		for (let o in t.children)
			if (!e.children[o] || !dd(e.children[o], t.children[o], n))
				return !1;
		return !0;
	} else {
		let o = r.slice(0, e.segments.length),
			i = r.slice(e.segments.length);
		return !vt(e.segments, o) || !vo(e.segments, o, n) || !e.children[M]
			? !1
			: fd(e.children[M], t, i, n);
	}
}
function vo(e, t, r) {
	return t.every((n, o) => ud[r](e[o].parameters, n.parameters));
}
var et = class {
		constructor(t = new P([], {}), r = {}, n = null) {
			(this.root = t), (this.queryParams = r), (this.fragment = n);
		}
		get queryParamMap() {
			return (
				(this._queryParamMap ??= Xt(this.queryParams)),
				this._queryParamMap
			);
		}
		toString() {
			return Tv.serialize(this);
		}
	},
	P = class {
		constructor(t, r) {
			(this.segments = t),
				(this.children = r),
				(this.parent = null),
				Object.values(r).forEach((n) => (n.parent = this));
		}
		hasChildren() {
			return this.numberOfChildren > 0;
		}
		get numberOfChildren() {
			return Object.keys(this.children).length;
		}
		toString() {
			return yo(this);
		}
	},
	mt = class {
		constructor(t, r) {
			(this.path = t), (this.parameters = r);
		}
		get parameterMap() {
			return (
				(this._parameterMap ??= Xt(this.parameters)), this._parameterMap
			);
		}
		toString() {
			return pd(this);
		}
	};
function bv(e, t) {
	return vt(e, t) && e.every((r, n) => Ae(r.parameters, t[n].parameters));
}
function vt(e, t) {
	return e.length !== t.length ? !1 : e.every((r, n) => r.path === t[n].path);
}
function Mv(e, t) {
	let r = [];
	return (
		Object.entries(e.children).forEach(([n, o]) => {
			n === M && (r = r.concat(t(o, n)));
		}),
		Object.entries(e.children).forEach(([n, o]) => {
			n !== M && (r = r.concat(t(o, n)));
		}),
		r
	);
}
var ua = (() => {
		let t = class t {};
		(t.ɵfac = function (o) {
			return new (o || t)();
		}),
			(t.ɵprov = m({
				token: t,
				factory: () => new wo(),
				providedIn: "root",
			}));
		let e = t;
		return e;
	})(),
	wo = class {
		parse(t) {
			let r = new Vs(t);
			return new et(
				r.parseRootSegment(),
				r.parseQueryParams(),
				r.parseFragment(),
			);
		}
		serialize(t) {
			let r = `/${Ln(t.root, !0)}`,
				n = Av(t.queryParams),
				o = typeof t.fragment == "string" ? `#${Sv(t.fragment)}` : "";
			return `${r}${n}${o}`;
		}
	},
	Tv = new wo();
function yo(e) {
	return e.segments.map((t) => pd(t)).join("/");
}
function Ln(e, t) {
	if (!e.hasChildren()) return yo(e);
	if (t) {
		let r = e.children[M] ? Ln(e.children[M], !1) : "",
			n = [];
		return (
			Object.entries(e.children).forEach(([o, i]) => {
				o !== M && n.push(`${o}:${Ln(i, !1)}`);
			}),
			n.length > 0 ? `${r}(${n.join("//")})` : r
		);
	} else {
		let r = Mv(e, (n, o) =>
			o === M ? [Ln(e.children[M], !1)] : [`${o}:${Ln(n, !1)}`],
		);
		return Object.keys(e.children).length === 1 && e.children[M] != null
			? `${yo(e)}/${r[0]}`
			: `${yo(e)}/(${r.join("//")})`;
	}
}
function hd(e) {
	return encodeURIComponent(e)
		.replace(/%40/g, "@")
		.replace(/%3A/gi, ":")
		.replace(/%24/g, "$")
		.replace(/%2C/gi, ",");
}
function go(e) {
	return hd(e).replace(/%3B/gi, ";");
}
function Sv(e) {
	return encodeURI(e);
}
function js(e) {
	return hd(e)
		.replace(/\(/g, "%28")
		.replace(/\)/g, "%29")
		.replace(/%26/gi, "&");
}
function Do(e) {
	return decodeURIComponent(e);
}
function od(e) {
	return Do(e.replace(/\+/g, "%20"));
}
function pd(e) {
	return `${js(e.path)}${xv(e.parameters)}`;
}
function xv(e) {
	return Object.entries(e)
		.map(([t, r]) => `;${js(t)}=${js(r)}`)
		.join("");
}
function Av(e) {
	let t = Object.entries(e)
		.map(([r, n]) =>
			Array.isArray(n)
				? n.map((o) => `${go(r)}=${go(o)}`).join("&")
				: `${go(r)}=${go(n)}`,
		)
		.filter((r) => r);
	return t.length ? `?${t.join("&")}` : "";
}
var _v = /^[^\/()?;#]+/;
function Rs(e) {
	let t = e.match(_v);
	return t ? t[0] : "";
}
var Nv = /^[^\/()?;=#]+/;
function Rv(e) {
	let t = e.match(Nv);
	return t ? t[0] : "";
}
var Ov = /^[^=?&#]+/;
function Pv(e) {
	let t = e.match(Ov);
	return t ? t[0] : "";
}
var Fv = /^[^&#]+/;
function kv(e) {
	let t = e.match(Fv);
	return t ? t[0] : "";
}
var Vs = class {
	constructor(t) {
		(this.url = t), (this.remaining = t);
	}
	parseRootSegment() {
		return (
			this.consumeOptional("/"),
			this.remaining === "" ||
			this.peekStartsWith("?") ||
			this.peekStartsWith("#")
				? new P([], {})
				: new P([], this.parseChildren())
		);
	}
	parseQueryParams() {
		let t = {};
		if (this.consumeOptional("?"))
			do this.parseQueryParam(t);
			while (this.consumeOptional("&"));
		return t;
	}
	parseFragment() {
		return this.consumeOptional("#")
			? decodeURIComponent(this.remaining)
			: null;
	}
	parseChildren() {
		if (this.remaining === "") return {};
		this.consumeOptional("/");
		let t = [];
		for (
			this.peekStartsWith("(") || t.push(this.parseSegment());
			this.peekStartsWith("/") &&
			!this.peekStartsWith("//") &&
			!this.peekStartsWith("/(");

		)
			this.capture("/"), t.push(this.parseSegment());
		let r = {};
		this.peekStartsWith("/(") &&
			(this.capture("/"), (r = this.parseParens(!0)));
		let n = {};
		return (
			this.peekStartsWith("(") && (n = this.parseParens(!1)),
			(t.length > 0 || Object.keys(r).length > 0) && (n[M] = new P(t, r)),
			n
		);
	}
	parseSegment() {
		let t = Rs(this.remaining);
		if (t === "" && this.peekStartsWith(";")) throw new D(4009, !1);
		return this.capture(t), new mt(Do(t), this.parseMatrixParams());
	}
	parseMatrixParams() {
		let t = {};
		for (; this.consumeOptional(";"); ) this.parseParam(t);
		return t;
	}
	parseParam(t) {
		let r = Rv(this.remaining);
		if (!r) return;
		this.capture(r);
		let n = "";
		if (this.consumeOptional("=")) {
			let o = Rs(this.remaining);
			o && ((n = o), this.capture(n));
		}
		t[Do(r)] = Do(n);
	}
	parseQueryParam(t) {
		let r = Pv(this.remaining);
		if (!r) return;
		this.capture(r);
		let n = "";
		if (this.consumeOptional("=")) {
			let s = kv(this.remaining);
			s && ((n = s), this.capture(n));
		}
		let o = od(r),
			i = od(n);
		if (t.hasOwnProperty(o)) {
			let s = t[o];
			Array.isArray(s) || ((s = [s]), (t[o] = s)), s.push(i);
		} else t[o] = i;
	}
	parseParens(t) {
		let r = {};
		for (
			this.capture("(");
			!this.consumeOptional(")") && this.remaining.length > 0;

		) {
			let n = Rs(this.remaining),
				o = this.remaining[n.length];
			if (o !== "/" && o !== ")" && o !== ";") throw new D(4010, !1);
			let i;
			n.indexOf(":") > -1
				? ((i = n.slice(0, n.indexOf(":"))),
					this.capture(i),
					this.capture(":"))
				: t && (i = M);
			let s = this.parseChildren();
			(r[i] = Object.keys(s).length === 1 ? s[M] : new P([], s)),
				this.consumeOptional("//");
		}
		return r;
	}
	peekStartsWith(t) {
		return this.remaining.startsWith(t);
	}
	consumeOptional(t) {
		return this.peekStartsWith(t)
			? ((this.remaining = this.remaining.substring(t.length)), !0)
			: !1;
	}
	capture(t) {
		if (!this.consumeOptional(t)) throw new D(4011, !1);
	}
};
function gd(e) {
	return e.segments.length > 0 ? new P([], { [M]: e }) : e;
}
function md(e) {
	let t = {};
	for (let [n, o] of Object.entries(e.children)) {
		let i = md(o);
		if (n === M && i.segments.length === 0 && i.hasChildren())
			for (let [s, a] of Object.entries(i.children)) t[s] = a;
		else (i.segments.length > 0 || i.hasChildren()) && (t[n] = i);
	}
	let r = new P(e.segments, t);
	return Lv(r);
}
function Lv(e) {
	if (e.numberOfChildren === 1 && e.children[M]) {
		let t = e.children[M];
		return new P(e.segments.concat(t.segments), t.children);
	}
	return e;
}
function en(e) {
	return e instanceof et;
}
function jv(e, t, r = null, n = null) {
	let o = vd(e);
	return yd(o, t, r, n);
}
function vd(e) {
	let t;
	function r(i) {
		let s = {};
		for (let c of i.children) {
			let u = r(c);
			s[c.outlet] = u;
		}
		let a = new P(i.url, s);
		return i === e && (t = a), a;
	}
	let n = r(e.root),
		o = gd(n);
	return t ?? o;
}
function yd(e, t, r, n) {
	let o = e;
	for (; o.parent; ) o = o.parent;
	if (t.length === 0) return Os(o, o, o, r, n);
	let i = Vv(t);
	if (i.toRoot()) return Os(o, o, new P([], {}), r, n);
	let s = $v(i, o, e),
		a = s.processChildren
			? $n(s.segmentGroup, s.index, i.commands)
			: wd(s.segmentGroup, s.index, i.commands);
	return Os(o, s.segmentGroup, a, r, n);
}
function Eo(e) {
	return typeof e == "object" && e != null && !e.outlets && !e.segmentPath;
}
function Hn(e) {
	return typeof e == "object" && e != null && e.outlets;
}
function Os(e, t, r, n, o) {
	let i = {};
	n &&
		Object.entries(n).forEach(([c, u]) => {
			i[c] = Array.isArray(u) ? u.map((l) => `${l}`) : `${u}`;
		});
	let s;
	e === t ? (s = r) : (s = Dd(e, t, r));
	let a = gd(md(s));
	return new et(a, i, o);
}
function Dd(e, t, r) {
	let n = {};
	return (
		Object.entries(e.children).forEach(([o, i]) => {
			i === t ? (n[o] = r) : (n[o] = Dd(i, t, r));
		}),
		new P(e.segments, n)
	);
}
var Co = class {
	constructor(t, r, n) {
		if (
			((this.isAbsolute = t),
			(this.numberOfDoubleDots = r),
			(this.commands = n),
			t && n.length > 0 && Eo(n[0]))
		)
			throw new D(4003, !1);
		let o = n.find(Hn);
		if (o && o !== n.at(-1)) throw new D(4004, !1);
	}
	toRoot() {
		return (
			this.isAbsolute &&
			this.commands.length === 1 &&
			this.commands[0] == "/"
		);
	}
};
function Vv(e) {
	if (typeof e[0] == "string" && e.length === 1 && e[0] === "/")
		return new Co(!0, 0, e);
	let t = 0,
		r = !1,
		n = e.reduce((o, i, s) => {
			if (typeof i == "object" && i != null) {
				if (i.outlets) {
					let a = {};
					return (
						Object.entries(i.outlets).forEach(([c, u]) => {
							a[c] = typeof u == "string" ? u.split("/") : u;
						}),
						[...o, { outlets: a }]
					);
				}
				if (i.segmentPath) return [...o, i.segmentPath];
			}
			return typeof i != "string"
				? [...o, i]
				: s === 0
					? (i.split("/").forEach((a, c) => {
							(c == 0 && a === ".") ||
								(c == 0 && a === ""
									? (r = !0)
									: a === ".."
										? t++
										: a != "" && o.push(a));
						}),
						o)
					: [...o, i];
		}, []);
	return new Co(r, t, n);
}
var Kt = class {
	constructor(t, r, n) {
		(this.segmentGroup = t), (this.processChildren = r), (this.index = n);
	}
};
function $v(e, t, r) {
	if (e.isAbsolute) return new Kt(t, !0, 0);
	if (!r) return new Kt(t, !1, NaN);
	if (r.parent === null) return new Kt(r, !0, 0);
	let n = Eo(e.commands[0]) ? 0 : 1,
		o = r.segments.length - 1 + n;
	return Uv(r, o, e.numberOfDoubleDots);
}
function Uv(e, t, r) {
	let n = e,
		o = t,
		i = r;
	for (; i > o; ) {
		if (((i -= o), (n = n.parent), !n)) throw new D(4005, !1);
		o = n.segments.length;
	}
	return new Kt(n, !1, o - i);
}
function Bv(e) {
	return Hn(e[0]) ? e[0].outlets : { [M]: e };
}
function wd(e, t, r) {
	if (((e ??= new P([], {})), e.segments.length === 0 && e.hasChildren()))
		return $n(e, t, r);
	let n = Hv(e, t, r),
		o = r.slice(n.commandIndex);
	if (n.match && n.pathIndex < e.segments.length) {
		let i = new P(e.segments.slice(0, n.pathIndex), {});
		return (
			(i.children[M] = new P(e.segments.slice(n.pathIndex), e.children)),
			$n(i, 0, o)
		);
	} else
		return n.match && o.length === 0
			? new P(e.segments, {})
			: n.match && !e.hasChildren()
				? $s(e, t, r)
				: n.match
					? $n(e, 0, o)
					: $s(e, t, r);
}
function $n(e, t, r) {
	if (r.length === 0) return new P(e.segments, {});
	{
		let n = Bv(r),
			o = {};
		if (
			Object.keys(n).some((i) => i !== M) &&
			e.children[M] &&
			e.numberOfChildren === 1 &&
			e.children[M].segments.length === 0
		) {
			let i = $n(e.children[M], t, r);
			return new P(e.segments, i.children);
		}
		return (
			Object.entries(n).forEach(([i, s]) => {
				typeof s == "string" && (s = [s]),
					s !== null && (o[i] = wd(e.children[i], t, s));
			}),
			Object.entries(e.children).forEach(([i, s]) => {
				n[i] === void 0 && (o[i] = s);
			}),
			new P(e.segments, o)
		);
	}
}
function Hv(e, t, r) {
	let n = 0,
		o = t,
		i = { match: !1, pathIndex: 0, commandIndex: 0 };
	for (; o < e.segments.length; ) {
		if (n >= r.length) return i;
		let s = e.segments[o],
			a = r[n];
		if (Hn(a)) break;
		let c = `${a}`,
			u = n < r.length - 1 ? r[n + 1] : null;
		if (o > 0 && c === void 0) break;
		if (c && u && typeof u == "object" && u.outlets === void 0) {
			if (!sd(c, u, s)) return i;
			n += 2;
		} else {
			if (!sd(c, {}, s)) return i;
			n++;
		}
		o++;
	}
	return { match: !0, pathIndex: o, commandIndex: n };
}
function $s(e, t, r) {
	let n = e.segments.slice(0, t),
		o = 0;
	for (; o < r.length; ) {
		let i = r[o];
		if (Hn(i)) {
			let c = zv(i.outlets);
			return new P(n, c);
		}
		if (o === 0 && Eo(r[0])) {
			let c = e.segments[t];
			n.push(new mt(c.path, id(r[0]))), o++;
			continue;
		}
		let s = Hn(i) ? i.outlets[M] : `${i}`,
			a = o < r.length - 1 ? r[o + 1] : null;
		s && a && Eo(a)
			? (n.push(new mt(s, id(a))), (o += 2))
			: (n.push(new mt(s, {})), o++);
	}
	return new P(n, {});
}
function zv(e) {
	let t = {};
	return (
		Object.entries(e).forEach(([r, n]) => {
			typeof n == "string" && (n = [n]),
				n !== null && (t[r] = $s(new P([], {}), 0, n));
		}),
		t
	);
}
function id(e) {
	let t = {};
	return Object.entries(e).forEach(([r, n]) => (t[r] = `${n}`)), t;
}
function sd(e, t, r) {
	return e == r.path && Ae(t, r.parameters);
}
var Un = "imperative",
	Z = (function (e) {
		return (
			(e[(e.NavigationStart = 0)] = "NavigationStart"),
			(e[(e.NavigationEnd = 1)] = "NavigationEnd"),
			(e[(e.NavigationCancel = 2)] = "NavigationCancel"),
			(e[(e.NavigationError = 3)] = "NavigationError"),
			(e[(e.RoutesRecognized = 4)] = "RoutesRecognized"),
			(e[(e.ResolveStart = 5)] = "ResolveStart"),
			(e[(e.ResolveEnd = 6)] = "ResolveEnd"),
			(e[(e.GuardsCheckStart = 7)] = "GuardsCheckStart"),
			(e[(e.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
			(e[(e.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
			(e[(e.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
			(e[(e.ChildActivationStart = 11)] = "ChildActivationStart"),
			(e[(e.ChildActivationEnd = 12)] = "ChildActivationEnd"),
			(e[(e.ActivationStart = 13)] = "ActivationStart"),
			(e[(e.ActivationEnd = 14)] = "ActivationEnd"),
			(e[(e.Scroll = 15)] = "Scroll"),
			(e[(e.NavigationSkipped = 16)] = "NavigationSkipped"),
			e
		);
	})(Z || {}),
	ve = class {
		constructor(t, r) {
			(this.id = t), (this.url = r);
		}
	},
	zn = class extends ve {
		constructor(t, r, n = "imperative", o = null) {
			super(t, r),
				(this.type = Z.NavigationStart),
				(this.navigationTrigger = n),
				(this.restoredState = o);
		}
		toString() {
			return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
		}
	},
	yt = class extends ve {
		constructor(t, r, n) {
			super(t, r),
				(this.urlAfterRedirects = n),
				(this.type = Z.NavigationEnd);
		}
		toString() {
			return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
		}
	},
	me = (function (e) {
		return (
			(e[(e.Redirect = 0)] = "Redirect"),
			(e[(e.SupersededByNewNavigation = 1)] =
				"SupersededByNewNavigation"),
			(e[(e.NoDataFromResolver = 2)] = "NoDataFromResolver"),
			(e[(e.GuardRejected = 3)] = "GuardRejected"),
			e
		);
	})(me || {}),
	Us = (function (e) {
		return (
			(e[(e.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
			(e[(e.IgnoredByUrlHandlingStrategy = 1)] =
				"IgnoredByUrlHandlingStrategy"),
			e
		);
	})(Us || {}),
	tt = class extends ve {
		constructor(t, r, n, o) {
			super(t, r),
				(this.reason = n),
				(this.code = o),
				(this.type = Z.NavigationCancel);
		}
		toString() {
			return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
		}
	},
	Dt = class extends ve {
		constructor(t, r, n, o) {
			super(t, r),
				(this.reason = n),
				(this.code = o),
				(this.type = Z.NavigationSkipped);
		}
	},
	Gn = class extends ve {
		constructor(t, r, n, o) {
			super(t, r),
				(this.error = n),
				(this.target = o),
				(this.type = Z.NavigationError);
		}
		toString() {
			return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
		}
	},
	Io = class extends ve {
		constructor(t, r, n, o) {
			super(t, r),
				(this.urlAfterRedirects = n),
				(this.state = o),
				(this.type = Z.RoutesRecognized);
		}
		toString() {
			return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
		}
	},
	Bs = class extends ve {
		constructor(t, r, n, o) {
			super(t, r),
				(this.urlAfterRedirects = n),
				(this.state = o),
				(this.type = Z.GuardsCheckStart);
		}
		toString() {
			return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
		}
	},
	Hs = class extends ve {
		constructor(t, r, n, o, i) {
			super(t, r),
				(this.urlAfterRedirects = n),
				(this.state = o),
				(this.shouldActivate = i),
				(this.type = Z.GuardsCheckEnd);
		}
		toString() {
			return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
		}
	},
	zs = class extends ve {
		constructor(t, r, n, o) {
			super(t, r),
				(this.urlAfterRedirects = n),
				(this.state = o),
				(this.type = Z.ResolveStart);
		}
		toString() {
			return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
		}
	},
	Gs = class extends ve {
		constructor(t, r, n, o) {
			super(t, r),
				(this.urlAfterRedirects = n),
				(this.state = o),
				(this.type = Z.ResolveEnd);
		}
		toString() {
			return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
		}
	},
	Ws = class {
		constructor(t) {
			(this.route = t), (this.type = Z.RouteConfigLoadStart);
		}
		toString() {
			return `RouteConfigLoadStart(path: ${this.route.path})`;
		}
	},
	qs = class {
		constructor(t) {
			(this.route = t), (this.type = Z.RouteConfigLoadEnd);
		}
		toString() {
			return `RouteConfigLoadEnd(path: ${this.route.path})`;
		}
	},
	Zs = class {
		constructor(t) {
			(this.snapshot = t), (this.type = Z.ChildActivationStart);
		}
		toString() {
			return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
		}
	},
	Ys = class {
		constructor(t) {
			(this.snapshot = t), (this.type = Z.ChildActivationEnd);
		}
		toString() {
			return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
		}
	},
	Qs = class {
		constructor(t) {
			(this.snapshot = t), (this.type = Z.ActivationStart);
		}
		toString() {
			return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
		}
	},
	Ks = class {
		constructor(t) {
			(this.snapshot = t), (this.type = Z.ActivationEnd);
		}
		toString() {
			return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
		}
	};
var Wn = class {},
	qn = class {
		constructor(t) {
			this.url = t;
		}
	};
var Js = class {
		constructor() {
			(this.outlet = null),
				(this.route = null),
				(this.injector = null),
				(this.children = new Ao()),
				(this.attachRef = null);
		}
	},
	Ao = (() => {
		let t = class t {
			constructor() {
				this.contexts = new Map();
			}
			onChildOutletCreated(n, o) {
				let i = this.getOrCreateContext(n);
				(i.outlet = o), this.contexts.set(n, i);
			}
			onChildOutletDestroyed(n) {
				let o = this.getContext(n);
				o && ((o.outlet = null), (o.attachRef = null));
			}
			onOutletDeactivated() {
				let n = this.contexts;
				return (this.contexts = new Map()), n;
			}
			onOutletReAttached(n) {
				this.contexts = n;
			}
			getOrCreateContext(n) {
				let o = this.getContext(n);
				return o || ((o = new Js()), this.contexts.set(n, o)), o;
			}
			getContext(n) {
				return this.contexts.get(n) || null;
			}
		};
		(t.ɵfac = function (o) {
			return new (o || t)();
		}),
			(t.ɵprov = m({ token: t, factory: t.ɵfac, providedIn: "root" }));
		let e = t;
		return e;
	})(),
	bo = class {
		constructor(t) {
			this._root = t;
		}
		get root() {
			return this._root.value;
		}
		parent(t) {
			let r = this.pathFromRoot(t);
			return r.length > 1 ? r[r.length - 2] : null;
		}
		children(t) {
			let r = Xs(t, this._root);
			return r ? r.children.map((n) => n.value) : [];
		}
		firstChild(t) {
			let r = Xs(t, this._root);
			return r && r.children.length > 0 ? r.children[0].value : null;
		}
		siblings(t) {
			let r = ea(t, this._root);
			return r.length < 2
				? []
				: r[r.length - 2].children
						.map((o) => o.value)
						.filter((o) => o !== t);
		}
		pathFromRoot(t) {
			return ea(t, this._root).map((r) => r.value);
		}
	};
function Xs(e, t) {
	if (e === t.value) return t;
	for (let r of t.children) {
		let n = Xs(e, r);
		if (n) return n;
	}
	return null;
}
function ea(e, t) {
	if (e === t.value) return [t];
	for (let r of t.children) {
		let n = ea(e, r);
		if (n.length) return n.unshift(t), n;
	}
	return [];
}
var ae = class {
	constructor(t, r) {
		(this.value = t), (this.children = r);
	}
	toString() {
		return `TreeNode(${this.value})`;
	}
};
function Qt(e) {
	let t = {};
	return e && e.children.forEach((r) => (t[r.value.outlet] = r)), t;
}
var Mo = class extends bo {
	constructor(t, r) {
		super(t), (this.snapshot = r), da(this, t);
	}
	toString() {
		return this.snapshot.toString();
	}
};
function Ed(e) {
	let t = Gv(e),
		r = new W([new mt("", {})]),
		n = new W({}),
		o = new W({}),
		i = new W({}),
		s = new W(""),
		a = new tn(r, n, i, s, o, M, e, t.root);
	return (a.snapshot = t.root), new Mo(new ae(a, []), t);
}
function Gv(e) {
	let t = {},
		r = {},
		n = {},
		o = "",
		i = new Zn([], t, n, o, r, M, e, null, {});
	return new To("", new ae(i, []));
}
var tn = class {
	constructor(t, r, n, o, i, s, a, c) {
		(this.urlSubject = t),
			(this.paramsSubject = r),
			(this.queryParamsSubject = n),
			(this.fragmentSubject = o),
			(this.dataSubject = i),
			(this.outlet = s),
			(this.component = a),
			(this._futureSnapshot = c),
			(this.title = this.dataSubject?.pipe(T((u) => u[Kn])) ?? y(void 0)),
			(this.url = t),
			(this.params = r),
			(this.queryParams = n),
			(this.fragment = o),
			(this.data = i);
	}
	get routeConfig() {
		return this._futureSnapshot.routeConfig;
	}
	get root() {
		return this._routerState.root;
	}
	get parent() {
		return this._routerState.parent(this);
	}
	get firstChild() {
		return this._routerState.firstChild(this);
	}
	get children() {
		return this._routerState.children(this);
	}
	get pathFromRoot() {
		return this._routerState.pathFromRoot(this);
	}
	get paramMap() {
		return (
			(this._paramMap ??= this.params.pipe(T((t) => Xt(t)))),
			this._paramMap
		);
	}
	get queryParamMap() {
		return (
			(this._queryParamMap ??= this.queryParams.pipe(T((t) => Xt(t)))),
			this._queryParamMap
		);
	}
	toString() {
		return this.snapshot
			? this.snapshot.toString()
			: `Future(${this._futureSnapshot})`;
	}
};
function la(e, t, r = "emptyOnly") {
	let n,
		{ routeConfig: o } = e;
	return (
		t !== null &&
		(r === "always" ||
			o?.path === "" ||
			(!t.component && !t.routeConfig?.loadComponent))
			? (n = {
					params: g(g({}, t.params), e.params),
					data: g(g({}, t.data), e.data),
					resolve: g(
						g(g(g({}, e.data), t.data), o?.data),
						e._resolvedData,
					),
				})
			: (n = {
					params: g({}, e.params),
					data: g({}, e.data),
					resolve: g(g({}, e.data), e._resolvedData ?? {}),
				}),
		o && Id(o) && (n.resolve[Kn] = o.title),
		n
	);
}
var Zn = class {
		get title() {
			return this.data?.[Kn];
		}
		constructor(t, r, n, o, i, s, a, c, u) {
			(this.url = t),
				(this.params = r),
				(this.queryParams = n),
				(this.fragment = o),
				(this.data = i),
				(this.outlet = s),
				(this.component = a),
				(this.routeConfig = c),
				(this._resolve = u);
		}
		get root() {
			return this._routerState.root;
		}
		get parent() {
			return this._routerState.parent(this);
		}
		get firstChild() {
			return this._routerState.firstChild(this);
		}
		get children() {
			return this._routerState.children(this);
		}
		get pathFromRoot() {
			return this._routerState.pathFromRoot(this);
		}
		get paramMap() {
			return (this._paramMap ??= Xt(this.params)), this._paramMap;
		}
		get queryParamMap() {
			return (
				(this._queryParamMap ??= Xt(this.queryParams)),
				this._queryParamMap
			);
		}
		toString() {
			let t = this.url.map((n) => n.toString()).join("/"),
				r = this.routeConfig ? this.routeConfig.path : "";
			return `Route(url:'${t}', path:'${r}')`;
		}
	},
	To = class extends bo {
		constructor(t, r) {
			super(r), (this.url = t), da(this, r);
		}
		toString() {
			return Cd(this._root);
		}
	};
function da(e, t) {
	(t.value._routerState = e), t.children.forEach((r) => da(e, r));
}
function Cd(e) {
	let t =
		e.children.length > 0 ? ` { ${e.children.map(Cd).join(", ")} } ` : "";
	return `${e.value}${t}`;
}
function Ps(e) {
	if (e.snapshot) {
		let t = e.snapshot,
			r = e._futureSnapshot;
		(e.snapshot = r),
			Ae(t.queryParams, r.queryParams) ||
				e.queryParamsSubject.next(r.queryParams),
			t.fragment !== r.fragment && e.fragmentSubject.next(r.fragment),
			Ae(t.params, r.params) || e.paramsSubject.next(r.params),
			wv(t.url, r.url) || e.urlSubject.next(r.url),
			Ae(t.data, r.data) || e.dataSubject.next(r.data);
	} else
		(e.snapshot = e._futureSnapshot),
			e.dataSubject.next(e._futureSnapshot.data);
}
function ta(e, t) {
	let r = Ae(e.params, t.params) && bv(e.url, t.url),
		n = !e.parent != !t.parent;
	return r && !n && (!e.parent || ta(e.parent, t.parent));
}
function Id(e) {
	return typeof e.title == "string" || e.title === null;
}
var fa = (() => {
		let t = class t {
			constructor() {
				(this.activated = null),
					(this._activatedRoute = null),
					(this.name = M),
					(this.activateEvents = new we()),
					(this.deactivateEvents = new we()),
					(this.attachEvents = new we()),
					(this.detachEvents = new we()),
					(this.parentContexts = p(Ao)),
					(this.location = p(eo)),
					(this.changeDetector = p(Xr)),
					(this.environmentInjector = p(X)),
					(this.inputBinder = p(ha, { optional: !0 })),
					(this.supportsBindingToComponentInputs = !0);
			}
			get activatedComponentRef() {
				return this.activated;
			}
			ngOnChanges(n) {
				if (n.name) {
					let { firstChange: o, previousValue: i } = n.name;
					if (o) return;
					this.isTrackedInParentContexts(i) &&
						(this.deactivate(),
						this.parentContexts.onChildOutletDestroyed(i)),
						this.initializeOutletWithName();
				}
			}
			ngOnDestroy() {
				this.isTrackedInParentContexts(this.name) &&
					this.parentContexts.onChildOutletDestroyed(this.name),
					this.inputBinder?.unsubscribeFromRouteData(this);
			}
			isTrackedInParentContexts(n) {
				return this.parentContexts.getContext(n)?.outlet === this;
			}
			ngOnInit() {
				this.initializeOutletWithName();
			}
			initializeOutletWithName() {
				if (
					(this.parentContexts.onChildOutletCreated(this.name, this),
					this.activated)
				)
					return;
				let n = this.parentContexts.getContext(this.name);
				n?.route &&
					(n.attachRef
						? this.attach(n.attachRef, n.route)
						: this.activateWith(n.route, n.injector));
			}
			get isActivated() {
				return !!this.activated;
			}
			get component() {
				if (!this.activated) throw new D(4012, !1);
				return this.activated.instance;
			}
			get activatedRoute() {
				if (!this.activated) throw new D(4012, !1);
				return this._activatedRoute;
			}
			get activatedRouteData() {
				return this._activatedRoute
					? this._activatedRoute.snapshot.data
					: {};
			}
			detach() {
				if (!this.activated) throw new D(4012, !1);
				this.location.detach();
				let n = this.activated;
				return (
					(this.activated = null),
					(this._activatedRoute = null),
					this.detachEvents.emit(n.instance),
					n
				);
			}
			attach(n, o) {
				(this.activated = n),
					(this._activatedRoute = o),
					this.location.insert(n.hostView),
					this.inputBinder?.bindActivatedRouteToOutletComponent(this),
					this.attachEvents.emit(n.instance);
			}
			deactivate() {
				if (this.activated) {
					let n = this.component;
					this.activated.destroy(),
						(this.activated = null),
						(this._activatedRoute = null),
						this.deactivateEvents.emit(n);
				}
			}
			activateWith(n, o) {
				if (this.isActivated) throw new D(4013, !1);
				this._activatedRoute = n;
				let i = this.location,
					a = n.snapshot.component,
					c = this.parentContexts.getOrCreateContext(
						this.name,
					).children,
					u = new na(n, c, i.injector);
				(this.activated = i.createComponent(a, {
					index: i.length,
					injector: u,
					environmentInjector: o ?? this.environmentInjector,
				})),
					this.changeDetector.markForCheck(),
					this.inputBinder?.bindActivatedRouteToOutletComponent(this),
					this.activateEvents.emit(this.activated.instance);
			}
		};
		(t.ɵfac = function (o) {
			return new (o || t)();
		}),
			(t.ɵdir = Vi({
				type: t,
				selectors: [["router-outlet"]],
				inputs: { name: "name" },
				outputs: {
					activateEvents: "activate",
					deactivateEvents: "deactivate",
					attachEvents: "attach",
					detachEvents: "detach",
				},
				exportAs: ["outlet"],
				standalone: !0,
				features: [Gr],
			}));
		let e = t;
		return e;
	})(),
	na = class {
		constructor(t, r, n) {
			(this.route = t), (this.childContexts = r), (this.parent = n);
		}
		get(t, r) {
			return t === tn
				? this.route
				: t === Ao
					? this.childContexts
					: this.parent.get(t, r);
		}
	},
	ha = new b("");
function Wv(e, t, r) {
	let n = Yn(e, t._root, r ? r._root : void 0);
	return new Mo(n, t);
}
function Yn(e, t, r) {
	if (r && e.shouldReuseRoute(t.value, r.value.snapshot)) {
		let n = r.value;
		n._futureSnapshot = t.value;
		let o = qv(e, t, r);
		return new ae(n, o);
	} else {
		if (e.shouldAttach(t.value)) {
			let i = e.retrieve(t.value);
			if (i !== null) {
				let s = i.route;
				return (
					(s.value._futureSnapshot = t.value),
					(s.children = t.children.map((a) => Yn(e, a))),
					s
				);
			}
		}
		let n = Zv(t.value),
			o = t.children.map((i) => Yn(e, i));
		return new ae(n, o);
	}
}
function qv(e, t, r) {
	return t.children.map((n) => {
		for (let o of r.children)
			if (e.shouldReuseRoute(n.value, o.value.snapshot))
				return Yn(e, n, o);
		return Yn(e, n);
	});
}
function Zv(e) {
	return new tn(
		new W(e.url),
		new W(e.params),
		new W(e.queryParams),
		new W(e.fragment),
		new W(e.data),
		e.outlet,
		e.component,
		e,
	);
}
var bd = "ngNavigationCancelingError";
function Md(e, t) {
	let { redirectTo: r, navigationBehaviorOptions: n } = en(t)
			? { redirectTo: t, navigationBehaviorOptions: void 0 }
			: t,
		o = Td(!1, me.Redirect, t);
	return (o.url = r), (o.navigationBehaviorOptions = n), o;
}
function Td(e, t, r) {
	let n = new Error("NavigationCancelingError: " + (e || ""));
	return (n[bd] = !0), (n.cancellationCode = t), r && (n.url = r), n;
}
function Yv(e) {
	return Sd(e) && en(e.url);
}
function Sd(e) {
	return e && e[bd];
}
var Qv = (() => {
	let t = class t {};
	(t.ɵfac = function (o) {
		return new (o || t)();
	}),
		(t.ɵcmp = pe({
			type: t,
			selectors: [["ng-component"]],
			standalone: !0,
			features: [ge],
			decls: 1,
			vars: 0,
			template: function (o, i) {
				o & 1 && se(0, "router-outlet");
			},
			dependencies: [fa],
			encapsulation: 2,
		}));
	let e = t;
	return e;
})();
function Kv(e, t) {
	return (
		e.providers &&
			!e._injector &&
			(e._injector = fs(e.providers, t, `Route: ${e.path}`)),
		e._injector ?? t
	);
}
function pa(e) {
	let t = e.children && e.children.map(pa),
		r = t ? V(g({}, e), { children: t }) : g({}, e);
	return (
		!r.component &&
			!r.loadComponent &&
			(t || r.loadChildren) &&
			r.outlet &&
			r.outlet !== M &&
			(r.component = Qv),
		r
	);
}
function _e(e) {
	return e.outlet || M;
}
function Jv(e, t) {
	let r = e.filter((n) => _e(n) === t);
	return r.push(...e.filter((n) => _e(n) !== t)), r;
}
function Jn(e) {
	if (!e) return null;
	if (e.routeConfig?._injector) return e.routeConfig._injector;
	for (let t = e.parent; t; t = t.parent) {
		let r = t.routeConfig;
		if (r?._loadedInjector) return r._loadedInjector;
		if (r?._injector) return r._injector;
	}
	return null;
}
var Xv = (e, t, r, n) =>
		T(
			(o) => (
				new ra(
					t,
					o.targetRouterState,
					o.currentRouterState,
					r,
					n,
				).activate(e),
				o
			),
		),
	ra = class {
		constructor(t, r, n, o, i) {
			(this.routeReuseStrategy = t),
				(this.futureState = r),
				(this.currState = n),
				(this.forwardEvent = o),
				(this.inputBindingEnabled = i);
		}
		activate(t) {
			let r = this.futureState._root,
				n = this.currState ? this.currState._root : null;
			this.deactivateChildRoutes(r, n, t),
				Ps(this.futureState.root),
				this.activateChildRoutes(r, n, t);
		}
		deactivateChildRoutes(t, r, n) {
			let o = Qt(r);
			t.children.forEach((i) => {
				let s = i.value.outlet;
				this.deactivateRoutes(i, o[s], n), delete o[s];
			}),
				Object.values(o).forEach((i) => {
					this.deactivateRouteAndItsChildren(i, n);
				});
		}
		deactivateRoutes(t, r, n) {
			let o = t.value,
				i = r ? r.value : null;
			if (o === i)
				if (o.component) {
					let s = n.getContext(o.outlet);
					s && this.deactivateChildRoutes(t, r, s.children);
				} else this.deactivateChildRoutes(t, r, n);
			else i && this.deactivateRouteAndItsChildren(r, n);
		}
		deactivateRouteAndItsChildren(t, r) {
			t.value.component &&
			this.routeReuseStrategy.shouldDetach(t.value.snapshot)
				? this.detachAndStoreRouteSubtree(t, r)
				: this.deactivateRouteAndOutlet(t, r);
		}
		detachAndStoreRouteSubtree(t, r) {
			let n = r.getContext(t.value.outlet),
				o = n && t.value.component ? n.children : r,
				i = Qt(t);
			for (let s of Object.values(i))
				this.deactivateRouteAndItsChildren(s, o);
			if (n && n.outlet) {
				let s = n.outlet.detach(),
					a = n.children.onOutletDeactivated();
				this.routeReuseStrategy.store(t.value.snapshot, {
					componentRef: s,
					route: t,
					contexts: a,
				});
			}
		}
		deactivateRouteAndOutlet(t, r) {
			let n = r.getContext(t.value.outlet),
				o = n && t.value.component ? n.children : r,
				i = Qt(t);
			for (let s of Object.values(i))
				this.deactivateRouteAndItsChildren(s, o);
			n &&
				(n.outlet &&
					(n.outlet.deactivate(), n.children.onOutletDeactivated()),
				(n.attachRef = null),
				(n.route = null));
		}
		activateChildRoutes(t, r, n) {
			let o = Qt(r);
			t.children.forEach((i) => {
				this.activateRoutes(i, o[i.value.outlet], n),
					this.forwardEvent(new Ks(i.value.snapshot));
			}),
				t.children.length &&
					this.forwardEvent(new Ys(t.value.snapshot));
		}
		activateRoutes(t, r, n) {
			let o = t.value,
				i = r ? r.value : null;
			if ((Ps(o), o === i))
				if (o.component) {
					let s = n.getOrCreateContext(o.outlet);
					this.activateChildRoutes(t, r, s.children);
				} else this.activateChildRoutes(t, r, n);
			else if (o.component) {
				let s = n.getOrCreateContext(o.outlet);
				if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
					let a = this.routeReuseStrategy.retrieve(o.snapshot);
					this.routeReuseStrategy.store(o.snapshot, null),
						s.children.onOutletReAttached(a.contexts),
						(s.attachRef = a.componentRef),
						(s.route = a.route.value),
						s.outlet &&
							s.outlet.attach(a.componentRef, a.route.value),
						Ps(a.route.value),
						this.activateChildRoutes(t, null, s.children);
				} else {
					let a = Jn(o.snapshot);
					(s.attachRef = null),
						(s.route = o),
						(s.injector = a),
						s.outlet && s.outlet.activateWith(o, s.injector),
						this.activateChildRoutes(t, null, s.children);
				}
			} else this.activateChildRoutes(t, null, n);
		}
	},
	So = class {
		constructor(t) {
			(this.path = t), (this.route = this.path[this.path.length - 1]);
		}
	},
	Jt = class {
		constructor(t, r) {
			(this.component = t), (this.route = r);
		}
	};
function ey(e, t, r) {
	let n = e._root,
		o = t ? t._root : null;
	return jn(n, o, r, [n.value]);
}
function ty(e) {
	let t = e.routeConfig ? e.routeConfig.canActivateChild : null;
	return !t || t.length === 0 ? null : { node: e, guards: t };
}
function rn(e, t) {
	let r = Symbol(),
		n = t.get(e, r);
	return n === r ? (typeof e == "function" && !Vc(e) ? e : t.get(e)) : n;
}
function jn(
	e,
	t,
	r,
	n,
	o = { canDeactivateChecks: [], canActivateChecks: [] },
) {
	let i = Qt(t);
	return (
		e.children.forEach((s) => {
			ny(s, i[s.value.outlet], r, n.concat([s.value]), o),
				delete i[s.value.outlet];
		}),
		Object.entries(i).forEach(([s, a]) => Bn(a, r.getContext(s), o)),
		o
	);
}
function ny(
	e,
	t,
	r,
	n,
	o = { canDeactivateChecks: [], canActivateChecks: [] },
) {
	let i = e.value,
		s = t ? t.value : null,
		a = r ? r.getContext(e.value.outlet) : null;
	if (s && i.routeConfig === s.routeConfig) {
		let c = ry(s, i, i.routeConfig.runGuardsAndResolvers);
		c
			? o.canActivateChecks.push(new So(n))
			: ((i.data = s.data), (i._resolvedData = s._resolvedData)),
			i.component
				? jn(e, t, a ? a.children : null, n, o)
				: jn(e, t, r, n, o),
			c &&
				a &&
				a.outlet &&
				a.outlet.isActivated &&
				o.canDeactivateChecks.push(new Jt(a.outlet.component, s));
	} else
		s && Bn(t, a, o),
			o.canActivateChecks.push(new So(n)),
			i.component
				? jn(e, null, a ? a.children : null, n, o)
				: jn(e, null, r, n, o);
	return o;
}
function ry(e, t, r) {
	if (typeof r == "function") return r(e, t);
	switch (r) {
		case "pathParamsChange":
			return !vt(e.url, t.url);
		case "pathParamsOrQueryParamsChange":
			return !vt(e.url, t.url) || !Ae(e.queryParams, t.queryParams);
		case "always":
			return !0;
		case "paramsOrQueryParamsChange":
			return !ta(e, t) || !Ae(e.queryParams, t.queryParams);
		case "paramsChange":
		default:
			return !ta(e, t);
	}
}
function Bn(e, t, r) {
	let n = Qt(e),
		o = e.value;
	Object.entries(n).forEach(([i, s]) => {
		o.component
			? t
				? Bn(s, t.children.getContext(i), r)
				: Bn(s, null, r)
			: Bn(s, t, r);
	}),
		o.component
			? t && t.outlet && t.outlet.isActivated
				? r.canDeactivateChecks.push(new Jt(t.outlet.component, o))
				: r.canDeactivateChecks.push(new Jt(null, o))
			: r.canDeactivateChecks.push(new Jt(null, o));
}
function Xn(e) {
	return typeof e == "function";
}
function oy(e) {
	return typeof e == "boolean";
}
function iy(e) {
	return e && Xn(e.canLoad);
}
function sy(e) {
	return e && Xn(e.canActivate);
}
function ay(e) {
	return e && Xn(e.canActivateChild);
}
function cy(e) {
	return e && Xn(e.canDeactivate);
}
function uy(e) {
	return e && Xn(e.canMatch);
}
function xd(e) {
	return e instanceof Ne || e?.name === "EmptyError";
}
var mo = Symbol("INITIAL_VALUE");
function nn() {
	return oe((e) =>
		yr(e.map((t) => t.pipe(Re(1), Yo(mo)))).pipe(
			T((t) => {
				for (let r of t)
					if (r !== !0) {
						if (r === mo) return mo;
						if (r === !1 || r instanceof et) return r;
					}
				return !0;
			}),
			re((t) => t !== mo),
			Re(1),
		),
	);
}
function ly(e, t) {
	return B((r) => {
		let {
			targetSnapshot: n,
			currentSnapshot: o,
			guards: { canActivateChecks: i, canDeactivateChecks: s },
		} = r;
		return s.length === 0 && i.length === 0
			? y(V(g({}, r), { guardsResult: !0 }))
			: dy(s, n, o, e).pipe(
					B((a) => (a && oy(a) ? fy(n, i, e, t) : y(a))),
					T((a) => V(g({}, r), { guardsResult: a })),
				);
	});
}
function dy(e, t, r, n) {
	return L(e).pipe(
		B((o) => vy(o.component, o.route, r, t, n)),
		be((o) => o !== !0, !0),
	);
}
function fy(e, t, r, n) {
	return L(t).pipe(
		He((o) =>
			xt(
				py(o.route.parent, n),
				hy(o.route, n),
				my(e, o.path, r),
				gy(e, o.route, r),
			),
		),
		be((o) => o !== !0, !0),
	);
}
function hy(e, t) {
	return e !== null && t && t(new Qs(e)), y(!0);
}
function py(e, t) {
	return e !== null && t && t(new Zs(e)), y(!0);
}
function gy(e, t, r) {
	let n = t.routeConfig ? t.routeConfig.canActivate : null;
	if (!n || n.length === 0) return y(!0);
	let o = n.map((i) =>
		Dr(() => {
			let s = Jn(t) ?? r,
				a = rn(i, s),
				c = sy(a) ? a.canActivate(t, e) : Ve(s, () => a(t, e));
			return nt(c).pipe(be());
		}),
	);
	return y(o).pipe(nn());
}
function my(e, t, r) {
	let n = t[t.length - 1],
		i = t
			.slice(0, t.length - 1)
			.reverse()
			.map((s) => ty(s))
			.filter((s) => s !== null)
			.map((s) =>
				Dr(() => {
					let a = s.guards.map((c) => {
						let u = Jn(s.node) ?? r,
							l = rn(c, u),
							d = ay(l)
								? l.canActivateChild(n, e)
								: Ve(u, () => l(n, e));
						return nt(d).pipe(be());
					});
					return y(a).pipe(nn());
				}),
			);
	return y(i).pipe(nn());
}
function vy(e, t, r, n, o) {
	let i = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
	if (!i || i.length === 0) return y(!0);
	let s = i.map((a) => {
		let c = Jn(t) ?? o,
			u = rn(a, c),
			l = cy(u)
				? u.canDeactivate(e, t, r, n)
				: Ve(c, () => u(e, t, r, n));
		return nt(l).pipe(be());
	});
	return y(s).pipe(nn());
}
function yy(e, t, r, n) {
	let o = t.canLoad;
	if (o === void 0 || o.length === 0) return y(!0);
	let i = o.map((s) => {
		let a = rn(s, e),
			c = iy(a) ? a.canLoad(t, r) : Ve(e, () => a(t, r));
		return nt(c);
	});
	return y(i).pipe(nn(), Ad(n));
}
function Ad(e) {
	return $o(
		H((t) => {
			if (en(t)) throw Md(e, t);
		}),
		T((t) => t === !0),
	);
}
function Dy(e, t, r, n) {
	let o = t.canMatch;
	if (!o || o.length === 0) return y(!0);
	let i = o.map((s) => {
		let a = rn(s, e),
			c = uy(a) ? a.canMatch(t, r) : Ve(e, () => a(t, r));
		return nt(c);
	});
	return y(i).pipe(nn(), Ad(n));
}
var Qn = class {
		constructor(t) {
			this.segmentGroup = t || null;
		}
	},
	xo = class extends Error {
		constructor(t) {
			super(), (this.urlTree = t);
		}
	};
function Yt(e) {
	return St(new Qn(e));
}
function wy(e) {
	return St(new D(4e3, !1));
}
function Ey(e) {
	return St(Td(!1, me.GuardRejected));
}
var oa = class {
		constructor(t, r) {
			(this.urlSerializer = t), (this.urlTree = r);
		}
		lineralizeSegments(t, r) {
			let n = [],
				o = r.root;
			for (;;) {
				if (((n = n.concat(o.segments)), o.numberOfChildren === 0))
					return y(n);
				if (o.numberOfChildren > 1 || !o.children[M])
					return wy(t.redirectTo);
				o = o.children[M];
			}
		}
		applyRedirectCommands(t, r, n) {
			let o = this.applyRedirectCreateUrlTree(
				r,
				this.urlSerializer.parse(r),
				t,
				n,
			);
			if (r.startsWith("/")) throw new xo(o);
			return o;
		}
		applyRedirectCreateUrlTree(t, r, n, o) {
			let i = this.createSegmentGroup(t, r.root, n, o);
			return new et(
				i,
				this.createQueryParams(r.queryParams, this.urlTree.queryParams),
				r.fragment,
			);
		}
		createQueryParams(t, r) {
			let n = {};
			return (
				Object.entries(t).forEach(([o, i]) => {
					if (typeof i == "string" && i.startsWith(":")) {
						let a = i.substring(1);
						n[o] = r[a];
					} else n[o] = i;
				}),
				n
			);
		}
		createSegmentGroup(t, r, n, o) {
			let i = this.createSegments(t, r.segments, n, o),
				s = {};
			return (
				Object.entries(r.children).forEach(([a, c]) => {
					s[a] = this.createSegmentGroup(t, c, n, o);
				}),
				new P(i, s)
			);
		}
		createSegments(t, r, n, o) {
			return r.map((i) =>
				i.path.startsWith(":")
					? this.findPosParam(t, i, o)
					: this.findOrReturn(i, n),
			);
		}
		findPosParam(t, r, n) {
			let o = n[r.path.substring(1)];
			if (!o) throw new D(4001, !1);
			return o;
		}
		findOrReturn(t, r) {
			let n = 0;
			for (let o of r) {
				if (o.path === t.path) return r.splice(n), o;
				n++;
			}
			return t;
		}
	},
	ia = {
		matched: !1,
		consumedSegments: [],
		remainingSegments: [],
		parameters: {},
		positionalParamSegments: {},
	};
function Cy(e, t, r, n, o) {
	let i = ga(e, t, r);
	return i.matched
		? ((n = Kv(t, n)),
			Dy(n, t, r, o).pipe(T((s) => (s === !0 ? i : g({}, ia)))))
		: y(i);
}
function ga(e, t, r) {
	if (t.path === "**") return Iy(r);
	if (t.path === "")
		return t.pathMatch === "full" && (e.hasChildren() || r.length > 0)
			? g({}, ia)
			: {
					matched: !0,
					consumedSegments: [],
					remainingSegments: r,
					parameters: {},
					positionalParamSegments: {},
				};
	let o = (t.matcher || Dv)(r, e, t);
	if (!o) return g({}, ia);
	let i = {};
	Object.entries(o.posParams ?? {}).forEach(([a, c]) => {
		i[a] = c.path;
	});
	let s =
		o.consumed.length > 0
			? g(g({}, i), o.consumed[o.consumed.length - 1].parameters)
			: i;
	return {
		matched: !0,
		consumedSegments: o.consumed,
		remainingSegments: r.slice(o.consumed.length),
		parameters: s,
		positionalParamSegments: o.posParams ?? {},
	};
}
function Iy(e) {
	return {
		matched: !0,
		parameters: e.at(-1)?.parameters ?? {},
		consumedSegments: e,
		remainingSegments: [],
		positionalParamSegments: {},
	};
}
function ad(e, t, r, n) {
	return r.length > 0 && Ty(e, r, n)
		? {
				segmentGroup: new P(t, My(n, new P(r, e.children))),
				slicedSegments: [],
			}
		: r.length === 0 && Sy(e, r, n)
			? {
					segmentGroup: new P(e.segments, by(e, r, n, e.children)),
					slicedSegments: r,
				}
			: {
					segmentGroup: new P(e.segments, e.children),
					slicedSegments: r,
				};
}
function by(e, t, r, n) {
	let o = {};
	for (let i of r)
		if (_o(e, t, i) && !n[_e(i)]) {
			let s = new P([], {});
			o[_e(i)] = s;
		}
	return g(g({}, n), o);
}
function My(e, t) {
	let r = {};
	r[M] = t;
	for (let n of e)
		if (n.path === "" && _e(n) !== M) {
			let o = new P([], {});
			r[_e(n)] = o;
		}
	return r;
}
function Ty(e, t, r) {
	return r.some((n) => _o(e, t, n) && _e(n) !== M);
}
function Sy(e, t, r) {
	return r.some((n) => _o(e, t, n));
}
function _o(e, t, r) {
	return (e.hasChildren() || t.length > 0) && r.pathMatch === "full"
		? !1
		: r.path === "";
}
function xy(e, t, r, n) {
	return _e(e) !== n && (n === M || !_o(t, r, e)) ? !1 : ga(t, e, r).matched;
}
function Ay(e, t, r) {
	return t.length === 0 && !e.children[r];
}
var sa = class {};
function _y(e, t, r, n, o, i, s = "emptyOnly") {
	return new aa(e, t, r, n, o, s, i).recognize();
}
var Ny = 31,
	aa = class {
		constructor(t, r, n, o, i, s, a) {
			(this.injector = t),
				(this.configLoader = r),
				(this.rootComponentType = n),
				(this.config = o),
				(this.urlTree = i),
				(this.paramsInheritanceStrategy = s),
				(this.urlSerializer = a),
				(this.applyRedirects = new oa(
					this.urlSerializer,
					this.urlTree,
				)),
				(this.absoluteRedirectCount = 0),
				(this.allowRedirects = !0);
		}
		noMatchError(t) {
			return new D(4002, `'${t.segmentGroup}'`);
		}
		recognize() {
			let t = ad(this.urlTree.root, [], [], this.config).segmentGroup;
			return this.match(t).pipe(
				T((r) => {
					let n = new Zn(
							[],
							Object.freeze({}),
							Object.freeze(g({}, this.urlTree.queryParams)),
							this.urlTree.fragment,
							{},
							M,
							this.rootComponentType,
							null,
							{},
						),
						o = new ae(n, r),
						i = new To("", o),
						s = jv(
							n,
							[],
							this.urlTree.queryParams,
							this.urlTree.fragment,
						);
					return (
						(s.queryParams = this.urlTree.queryParams),
						(i.url = this.urlSerializer.serialize(s)),
						this.inheritParamsAndData(i._root, null),
						{ state: i, tree: s }
					);
				}),
			);
		}
		match(t) {
			return this.processSegmentGroup(
				this.injector,
				this.config,
				t,
				M,
			).pipe(
				Be((n) => {
					if (n instanceof xo)
						return (
							(this.urlTree = n.urlTree),
							this.match(n.urlTree.root)
						);
					throw n instanceof Qn ? this.noMatchError(n) : n;
				}),
			);
		}
		inheritParamsAndData(t, r) {
			let n = t.value,
				o = la(n, r, this.paramsInheritanceStrategy);
			(n.params = Object.freeze(o.params)),
				(n.data = Object.freeze(o.data)),
				t.children.forEach((i) => this.inheritParamsAndData(i, n));
		}
		processSegmentGroup(t, r, n, o) {
			return n.segments.length === 0 && n.hasChildren()
				? this.processChildren(t, r, n)
				: this.processSegment(t, r, n, n.segments, o, !0).pipe(
						T((i) => (i instanceof ae ? [i] : [])),
					);
		}
		processChildren(t, r, n) {
			let o = [];
			for (let i of Object.keys(n.children))
				i === "primary" ? o.unshift(i) : o.push(i);
			return L(o).pipe(
				He((i) => {
					let s = n.children[i],
						a = Jv(r, i);
					return this.processSegmentGroup(t, a, s, i);
				}),
				Zo((i, s) => (i.push(...s), i)),
				ze(null),
				qo(),
				B((i) => {
					if (i === null) return Yt(n);
					let s = _d(i);
					return Ry(s), y(s);
				}),
			);
		}
		processSegment(t, r, n, o, i, s) {
			return L(r).pipe(
				He((a) =>
					this.processSegmentAgainstRoute(
						a._injector ?? t,
						r,
						a,
						n,
						o,
						i,
						s,
					).pipe(
						Be((c) => {
							if (c instanceof Qn) return y(null);
							throw c;
						}),
					),
				),
				be((a) => !!a),
				Be((a) => {
					if (xd(a)) return Ay(n, o, i) ? y(new sa()) : Yt(n);
					throw a;
				}),
			);
		}
		processSegmentAgainstRoute(t, r, n, o, i, s, a) {
			return xy(n, o, i, s)
				? n.redirectTo === void 0
					? this.matchSegmentAgainstRoute(t, o, n, i, s)
					: this.allowRedirects && a
						? this.expandSegmentAgainstRouteUsingRedirect(
								t,
								o,
								r,
								n,
								i,
								s,
							)
						: Yt(o)
				: Yt(o);
		}
		expandSegmentAgainstRouteUsingRedirect(t, r, n, o, i, s) {
			let {
				matched: a,
				consumedSegments: c,
				positionalParamSegments: u,
				remainingSegments: l,
			} = ga(r, o, i);
			if (!a) return Yt(r);
			o.redirectTo.startsWith("/") &&
				(this.absoluteRedirectCount++,
				this.absoluteRedirectCount > Ny && (this.allowRedirects = !1));
			let d = this.applyRedirects.applyRedirectCommands(
				c,
				o.redirectTo,
				u,
			);
			return this.applyRedirects
				.lineralizeSegments(o, d)
				.pipe(
					B((f) => this.processSegment(t, n, r, f.concat(l), s, !1)),
				);
		}
		matchSegmentAgainstRoute(t, r, n, o, i) {
			let s = Cy(r, n, o, t, this.urlSerializer);
			return (
				n.path === "**" && (r.children = {}),
				s.pipe(
					oe((a) =>
						a.matched
							? ((t = n._injector ?? t),
								this.getChildConfig(t, n, o).pipe(
									oe(({ routes: c }) => {
										let u = n._loadedInjector ?? t,
											{
												consumedSegments: l,
												remainingSegments: d,
												parameters: f,
											} = a,
											h = new Zn(
												l,
												f,
												Object.freeze(
													g(
														{},
														this.urlTree
															.queryParams,
													),
												),
												this.urlTree.fragment,
												Py(n),
												_e(n),
												n.component ??
													n._loadedComponent ??
													null,
												n,
												Fy(n),
											),
											{
												segmentGroup: E,
												slicedSegments: F,
											} = ad(r, l, d, c);
										if (F.length === 0 && E.hasChildren())
											return this.processChildren(
												u,
												c,
												E,
											).pipe(
												T((C) =>
													C === null
														? null
														: new ae(h, C),
												),
											);
										if (c.length === 0 && F.length === 0)
											return y(new ae(h, []));
										let N = _e(n) === i;
										return this.processSegment(
											u,
											c,
											E,
											F,
											N ? M : i,
											!0,
										).pipe(
											T(
												(C) =>
													new ae(
														h,
														C instanceof ae
															? [C]
															: [],
													),
											),
										);
									}),
								))
							: Yt(r),
					),
				)
			);
		}
		getChildConfig(t, r, n) {
			return r.children
				? y({ routes: r.children, injector: t })
				: r.loadChildren
					? r._loadedRoutes !== void 0
						? y({
								routes: r._loadedRoutes,
								injector: r._loadedInjector,
							})
						: yy(t, r, n, this.urlSerializer).pipe(
								B((o) =>
									o
										? this.configLoader
												.loadChildren(t, r)
												.pipe(
													H((i) => {
														(r._loadedRoutes =
															i.routes),
															(r._loadedInjector =
																i.injector);
													}),
												)
										: Ey(r),
								),
							)
					: y({ routes: [], injector: t });
		}
	};
function Ry(e) {
	e.sort((t, r) =>
		t.value.outlet === M
			? -1
			: r.value.outlet === M
				? 1
				: t.value.outlet.localeCompare(r.value.outlet),
	);
}
function Oy(e) {
	let t = e.value.routeConfig;
	return t && t.path === "";
}
function _d(e) {
	let t = [],
		r = new Set();
	for (let n of e) {
		if (!Oy(n)) {
			t.push(n);
			continue;
		}
		let o = t.find((i) => n.value.routeConfig === i.value.routeConfig);
		o !== void 0 ? (o.children.push(...n.children), r.add(o)) : t.push(n);
	}
	for (let n of r) {
		let o = _d(n.children);
		t.push(new ae(n.value, o));
	}
	return t.filter((n) => !r.has(n));
}
function Py(e) {
	return e.data || {};
}
function Fy(e) {
	return e.resolve || {};
}
function ky(e, t, r, n, o, i) {
	return B((s) =>
		_y(e, t, r, n, s.extractedUrl, o, i).pipe(
			T(({ state: a, tree: c }) =>
				V(g({}, s), { targetSnapshot: a, urlAfterRedirects: c }),
			),
		),
	);
}
function Ly(e, t) {
	return B((r) => {
		let {
			targetSnapshot: n,
			guards: { canActivateChecks: o },
		} = r;
		if (!o.length) return y(r);
		let i = new Set(o.map((c) => c.route)),
			s = new Set();
		for (let c of i) if (!s.has(c)) for (let u of Nd(c)) s.add(u);
		let a = 0;
		return L(s).pipe(
			He((c) =>
				i.has(c)
					? jy(c, n, e, t)
					: ((c.data = la(c, c.parent, e).resolve), y(void 0)),
			),
			H(() => a++),
			At(1),
			B((c) => (a === s.size ? y(r) : ue)),
		);
	});
}
function Nd(e) {
	let t = e.children.map((r) => Nd(r)).flat();
	return [e, ...t];
}
function jy(e, t, r, n) {
	let o = e.routeConfig,
		i = e._resolve;
	return (
		o?.title !== void 0 && !Id(o) && (i[Kn] = o.title),
		Vy(i, e, t, n).pipe(
			T(
				(s) => (
					(e._resolvedData = s),
					(e.data = la(e, e.parent, r).resolve),
					null
				),
			),
		)
	);
}
function Vy(e, t, r, n) {
	let o = Ls(e);
	if (o.length === 0) return y({});
	let i = {};
	return L(o).pipe(
		B((s) =>
			$y(e[s], t, r, n).pipe(
				be(),
				H((a) => {
					i[s] = a;
				}),
			),
		),
		At(1),
		Wo(i),
		Be((s) => (xd(s) ? ue : St(s))),
	);
}
function $y(e, t, r, n) {
	let o = Jn(t) ?? n,
		i = rn(e, o),
		s = i.resolve ? i.resolve(t, r) : Ve(o, () => i(t, r));
	return nt(s);
}
function Fs(e) {
	return oe((t) => {
		let r = e(t);
		return r ? L(r).pipe(T(() => t)) : y(t);
	});
}
var Rd = (() => {
		let t = class t {
			buildTitle(n) {
				let o,
					i = n.root;
				for (; i !== void 0; )
					(o = this.getResolvedTitleForRoute(i) ?? o),
						(i = i.children.find((s) => s.outlet === M));
				return o;
			}
			getResolvedTitleForRoute(n) {
				return n.data[Kn];
			}
		};
		(t.ɵfac = function (o) {
			return new (o || t)();
		}),
			(t.ɵprov = m({
				token: t,
				factory: () => p(Uy),
				providedIn: "root",
			}));
		let e = t;
		return e;
	})(),
	Uy = (() => {
		let t = class t extends Rd {
			constructor(n) {
				super(), (this.title = n);
			}
			updateTitle(n) {
				let o = this.buildTitle(n);
				o !== void 0 && this.title.setTitle(o);
			}
		};
		(t.ɵfac = function (o) {
			return new (o || t)(v(Ns));
		}),
			(t.ɵprov = m({ token: t, factory: t.ɵfac, providedIn: "root" }));
		let e = t;
		return e;
	})(),
	ma = new b("", { providedIn: "root", factory: () => ({}) }),
	va = new b("ROUTES"),
	By = (() => {
		let t = class t {
			constructor() {
				(this.componentLoaders = new WeakMap()),
					(this.childrenLoaders = new WeakMap()),
					(this.compiler = p(hs));
			}
			loadComponent(n) {
				if (this.componentLoaders.get(n))
					return this.componentLoaders.get(n);
				if (n._loadedComponent) return y(n._loadedComponent);
				this.onLoadStartListener && this.onLoadStartListener(n);
				let o = nt(n.loadComponent()).pipe(
						T(Od),
						H((s) => {
							this.onLoadEndListener && this.onLoadEndListener(n),
								(n._loadedComponent = s);
						}),
						st(() => {
							this.componentLoaders.delete(n);
						}),
					),
					i = new Tt(o, () => new ne()).pipe(Mt());
				return this.componentLoaders.set(n, i), i;
			}
			loadChildren(n, o) {
				if (this.childrenLoaders.get(o))
					return this.childrenLoaders.get(o);
				if (o._loadedRoutes)
					return y({
						routes: o._loadedRoutes,
						injector: o._loadedInjector,
					});
				this.onLoadStartListener && this.onLoadStartListener(o);
				let s = Hy(o, this.compiler, n, this.onLoadEndListener).pipe(
						st(() => {
							this.childrenLoaders.delete(o);
						}),
					),
					a = new Tt(s, () => new ne()).pipe(Mt());
				return this.childrenLoaders.set(o, a), a;
			}
		};
		(t.ɵfac = function (o) {
			return new (o || t)();
		}),
			(t.ɵprov = m({ token: t, factory: t.ɵfac, providedIn: "root" }));
		let e = t;
		return e;
	})();
function Hy(e, t, r, n) {
	return nt(e.loadChildren()).pipe(
		T(Od),
		B((o) =>
			o instanceof In || Array.isArray(o)
				? y(o)
				: L(t.compileModuleAsync(o)),
		),
		T((o) => {
			n && n(e);
			let i,
				s,
				a = !1;
			return (
				Array.isArray(o)
					? ((s = o), (a = !0))
					: ((i = o.create(r).injector),
						(s = i.get(va, [], { optional: !0, self: !0 }).flat())),
				{ routes: s.map(pa), injector: i }
			);
		}),
	);
}
function zy(e) {
	return e && typeof e == "object" && "default" in e;
}
function Od(e) {
	return zy(e) ? e.default : e;
}
var ya = (() => {
		let t = class t {};
		(t.ɵfac = function (o) {
			return new (o || t)();
		}),
			(t.ɵprov = m({
				token: t,
				factory: () => p(Gy),
				providedIn: "root",
			}));
		let e = t;
		return e;
	})(),
	Gy = (() => {
		let t = class t {
			shouldProcessUrl(n) {
				return !0;
			}
			extract(n) {
				return n;
			}
			merge(n, o) {
				return n;
			}
		};
		(t.ɵfac = function (o) {
			return new (o || t)();
		}),
			(t.ɵprov = m({ token: t, factory: t.ɵfac, providedIn: "root" }));
		let e = t;
		return e;
	})(),
	Wy = new b("");
var qy = (() => {
	let t = class t {
		get hasRequestedNavigation() {
			return this.navigationId !== 0;
		}
		constructor() {
			(this.currentNavigation = null),
				(this.currentTransition = null),
				(this.lastSuccessfulNavigation = null),
				(this.events = new ne()),
				(this.transitionAbortSubject = new ne()),
				(this.configLoader = p(By)),
				(this.environmentInjector = p(X)),
				(this.urlSerializer = p(ua)),
				(this.rootContexts = p(Ao)),
				(this.location = p(_n)),
				(this.inputBindingEnabled = p(ha, { optional: !0 }) !== null),
				(this.titleStrategy = p(Rd)),
				(this.options = p(ma, { optional: !0 }) || {}),
				(this.paramsInheritanceStrategy =
					this.options.paramsInheritanceStrategy || "emptyOnly"),
				(this.urlHandlingStrategy = p(ya)),
				(this.createViewTransition = p(Wy, { optional: !0 })),
				(this.navigationId = 0),
				(this.afterPreactivation = () => y(void 0)),
				(this.rootComponentType = null);
			let n = (i) => this.events.next(new Ws(i)),
				o = (i) => this.events.next(new qs(i));
			(this.configLoader.onLoadEndListener = o),
				(this.configLoader.onLoadStartListener = n);
		}
		complete() {
			this.transitions?.complete();
		}
		handleNavigationRequest(n) {
			let o = ++this.navigationId;
			this.transitions?.next(
				V(g(g({}, this.transitions.value), n), { id: o }),
			);
		}
		setupNavigations(n, o, i) {
			return (
				(this.transitions = new W({
					id: 0,
					currentUrlTree: o,
					currentRawUrl: o,
					extractedUrl: this.urlHandlingStrategy.extract(o),
					urlAfterRedirects: this.urlHandlingStrategy.extract(o),
					rawUrl: o,
					extras: {},
					resolve: null,
					reject: null,
					promise: Promise.resolve(!0),
					source: Un,
					restoredState: null,
					currentSnapshot: i.snapshot,
					targetSnapshot: null,
					currentRouterState: i,
					targetRouterState: null,
					guards: { canActivateChecks: [], canDeactivateChecks: [] },
					guardsResult: null,
				})),
				this.transitions.pipe(
					re((s) => s.id !== 0),
					T((s) =>
						V(g({}, s), {
							extractedUrl: this.urlHandlingStrategy.extract(
								s.rawUrl,
							),
						}),
					),
					oe((s) => {
						this.currentTransition = s;
						let a = !1,
							c = !1;
						return y(s).pipe(
							H((u) => {
								this.currentNavigation = {
									id: u.id,
									initialUrl: u.rawUrl,
									extractedUrl: u.extractedUrl,
									trigger: u.source,
									extras: u.extras,
									previousNavigation: this
										.lastSuccessfulNavigation
										? V(
												g(
													{},
													this
														.lastSuccessfulNavigation,
												),
												{ previousNavigation: null },
											)
										: null,
								};
							}),
							oe((u) => {
								let l =
										!n.navigated ||
										this.isUpdatingInternalState() ||
										this.isUpdatedBrowserUrl(),
									d =
										u.extras.onSameUrlNavigation ??
										n.onSameUrlNavigation;
								if (!l && d !== "reload") {
									let f = "";
									return (
										this.events.next(
											new Dt(
												u.id,
												this.urlSerializer.serialize(
													u.rawUrl,
												),
												f,
												Us.IgnoredSameUrlNavigation,
											),
										),
										u.resolve(null),
										ue
									);
								}
								if (
									this.urlHandlingStrategy.shouldProcessUrl(
										u.rawUrl,
									)
								)
									return y(u).pipe(
										oe((f) => {
											let h =
												this.transitions?.getValue();
											return (
												this.events.next(
													new zn(
														f.id,
														this.urlSerializer.serialize(
															f.extractedUrl,
														),
														f.source,
														f.restoredState,
													),
												),
												h !==
												this.transitions?.getValue()
													? ue
													: Promise.resolve(f)
											);
										}),
										ky(
											this.environmentInjector,
											this.configLoader,
											this.rootComponentType,
											n.config,
											this.urlSerializer,
											this.paramsInheritanceStrategy,
										),
										H((f) => {
											(s.targetSnapshot =
												f.targetSnapshot),
												(s.urlAfterRedirects =
													f.urlAfterRedirects),
												(this.currentNavigation = V(
													g(
														{},
														this.currentNavigation,
													),
													{
														finalUrl:
															f.urlAfterRedirects,
													},
												));
											let h = new Io(
												f.id,
												this.urlSerializer.serialize(
													f.extractedUrl,
												),
												this.urlSerializer.serialize(
													f.urlAfterRedirects,
												),
												f.targetSnapshot,
											);
											this.events.next(h);
										}),
									);
								if (
									l &&
									this.urlHandlingStrategy.shouldProcessUrl(
										u.currentRawUrl,
									)
								) {
									let {
											id: f,
											extractedUrl: h,
											source: E,
											restoredState: F,
											extras: N,
										} = u,
										C = new zn(
											f,
											this.urlSerializer.serialize(h),
											E,
											F,
										);
									this.events.next(C);
									let Y = Ed(this.rootComponentType).snapshot;
									return (
										(this.currentTransition = s =
											V(g({}, u), {
												targetSnapshot: Y,
												urlAfterRedirects: h,
												extras: V(g({}, N), {
													skipLocationChange: !1,
													replaceUrl: !1,
												}),
											})),
										(this.currentNavigation.finalUrl = h),
										y(s)
									);
								} else {
									let f = "";
									return (
										this.events.next(
											new Dt(
												u.id,
												this.urlSerializer.serialize(
													u.extractedUrl,
												),
												f,
												Us.IgnoredByUrlHandlingStrategy,
											),
										),
										u.resolve(null),
										ue
									);
								}
							}),
							H((u) => {
								let l = new Bs(
									u.id,
									this.urlSerializer.serialize(
										u.extractedUrl,
									),
									this.urlSerializer.serialize(
										u.urlAfterRedirects,
									),
									u.targetSnapshot,
								);
								this.events.next(l);
							}),
							T(
								(u) => (
									(this.currentTransition = s =
										V(g({}, u), {
											guards: ey(
												u.targetSnapshot,
												u.currentSnapshot,
												this.rootContexts,
											),
										})),
									s
								),
							),
							ly(this.environmentInjector, (u) =>
								this.events.next(u),
							),
							H((u) => {
								if (
									((s.guardsResult = u.guardsResult),
									en(u.guardsResult))
								)
									throw Md(
										this.urlSerializer,
										u.guardsResult,
									);
								let l = new Hs(
									u.id,
									this.urlSerializer.serialize(
										u.extractedUrl,
									),
									this.urlSerializer.serialize(
										u.urlAfterRedirects,
									),
									u.targetSnapshot,
									!!u.guardsResult,
								);
								this.events.next(l);
							}),
							re((u) =>
								u.guardsResult
									? !0
									: (this.cancelNavigationTransition(
											u,
											"",
											me.GuardRejected,
										),
										!1),
							),
							Fs((u) => {
								if (u.guards.canActivateChecks.length)
									return y(u).pipe(
										H((l) => {
											let d = new zs(
												l.id,
												this.urlSerializer.serialize(
													l.extractedUrl,
												),
												this.urlSerializer.serialize(
													l.urlAfterRedirects,
												),
												l.targetSnapshot,
											);
											this.events.next(d);
										}),
										oe((l) => {
											let d = !1;
											return y(l).pipe(
												Ly(
													this
														.paramsInheritanceStrategy,
													this.environmentInjector,
												),
												H({
													next: () => (d = !0),
													complete: () => {
														d ||
															this.cancelNavigationTransition(
																l,
																"",
																me.NoDataFromResolver,
															);
													},
												}),
											);
										}),
										H((l) => {
											let d = new Gs(
												l.id,
												this.urlSerializer.serialize(
													l.extractedUrl,
												),
												this.urlSerializer.serialize(
													l.urlAfterRedirects,
												),
												l.targetSnapshot,
											);
											this.events.next(d);
										}),
									);
							}),
							Fs((u) => {
								let l = (d) => {
									let f = [];
									d.routeConfig?.loadComponent &&
										!d.routeConfig._loadedComponent &&
										f.push(
											this.configLoader
												.loadComponent(d.routeConfig)
												.pipe(
													H((h) => {
														d.component = h;
													}),
													T(() => {}),
												),
										);
									for (let h of d.children) f.push(...l(h));
									return f;
								};
								return yr(l(u.targetSnapshot.root)).pipe(
									ze(null),
									Re(1),
								);
							}),
							Fs(() => this.afterPreactivation()),
							oe(() => {
								let { currentSnapshot: u, targetSnapshot: l } =
										s,
									d = this.createViewTransition?.(
										this.environmentInjector,
										u.root,
										l.root,
									);
								return d ? L(d).pipe(T(() => s)) : y(s);
							}),
							T((u) => {
								let l = Wv(
									n.routeReuseStrategy,
									u.targetSnapshot,
									u.currentRouterState,
								);
								return (
									(this.currentTransition = s =
										V(g({}, u), { targetRouterState: l })),
									(this.currentNavigation.targetRouterState =
										l),
									s
								);
							}),
							H(() => {
								this.events.next(new Wn());
							}),
							Xv(
								this.rootContexts,
								n.routeReuseStrategy,
								(u) => this.events.next(u),
								this.inputBindingEnabled,
							),
							Re(1),
							H({
								next: (u) => {
									(a = !0),
										(this.lastSuccessfulNavigation =
											this.currentNavigation),
										this.events.next(
											new yt(
												u.id,
												this.urlSerializer.serialize(
													u.extractedUrl,
												),
												this.urlSerializer.serialize(
													u.urlAfterRedirects,
												),
											),
										),
										this.titleStrategy?.updateTitle(
											u.targetRouterState.snapshot,
										),
										u.resolve(!0);
								},
								complete: () => {
									a = !0;
								},
							}),
							Qo(
								this.transitionAbortSubject.pipe(
									H((u) => {
										throw u;
									}),
								),
							),
							st(() => {
								!a &&
									!c &&
									this.cancelNavigationTransition(
										s,
										"",
										me.SupersededByNewNavigation,
									),
									this.currentNavigation?.id === s.id &&
										(this.currentNavigation = null);
							}),
							Be((u) => {
								if (((c = !0), Sd(u)))
									this.events.next(
										new tt(
											s.id,
											this.urlSerializer.serialize(
												s.extractedUrl,
											),
											u.message,
											u.cancellationCode,
										),
									),
										Yv(u)
											? this.events.next(new qn(u.url))
											: s.resolve(!1);
								else {
									this.events.next(
										new Gn(
											s.id,
											this.urlSerializer.serialize(
												s.extractedUrl,
											),
											u,
											s.targetSnapshot ?? void 0,
										),
									);
									try {
										s.resolve(n.errorHandler(u));
									} catch (l) {
										this.options
											.resolveNavigationPromiseOnError
											? s.resolve(!1)
											: s.reject(l);
									}
								}
								return ue;
							}),
						);
					}),
				)
			);
		}
		cancelNavigationTransition(n, o, i) {
			let s = new tt(
				n.id,
				this.urlSerializer.serialize(n.extractedUrl),
				o,
				i,
			);
			this.events.next(s), n.resolve(!1);
		}
		isUpdatingInternalState() {
			return (
				this.currentTransition?.extractedUrl.toString() !==
				this.currentTransition?.currentUrlTree.toString()
			);
		}
		isUpdatedBrowserUrl() {
			return (
				this.urlHandlingStrategy
					.extract(this.urlSerializer.parse(this.location.path(!0)))
					.toString() !==
					this.currentTransition?.extractedUrl.toString() &&
				!this.currentTransition?.extras.skipLocationChange
			);
		}
	};
	(t.ɵfac = function (o) {
		return new (o || t)();
	}),
		(t.ɵprov = m({ token: t, factory: t.ɵfac, providedIn: "root" }));
	let e = t;
	return e;
})();
function Zy(e) {
	return e !== Un;
}
var Yy = (() => {
		let t = class t {};
		(t.ɵfac = function (o) {
			return new (o || t)();
		}),
			(t.ɵprov = m({
				token: t,
				factory: () => p(Qy),
				providedIn: "root",
			}));
		let e = t;
		return e;
	})(),
	ca = class {
		shouldDetach(t) {
			return !1;
		}
		store(t, r) {}
		shouldAttach(t) {
			return !1;
		}
		retrieve(t) {
			return null;
		}
		shouldReuseRoute(t, r) {
			return t.routeConfig === r.routeConfig;
		}
	},
	Qy = (() => {
		let t = class t extends ca {};
		(t.ɵfac = (() => {
			let n;
			return function (i) {
				return (n || (n = Yi(t)))(i || t);
			};
		})()),
			(t.ɵprov = m({ token: t, factory: t.ɵfac, providedIn: "root" }));
		let e = t;
		return e;
	})(),
	Pd = (() => {
		let t = class t {};
		(t.ɵfac = function (o) {
			return new (o || t)();
		}),
			(t.ɵprov = m({
				token: t,
				factory: () => p(Ky),
				providedIn: "root",
			}));
		let e = t;
		return e;
	})(),
	Ky = (() => {
		let t = class t extends Pd {
			constructor() {
				super(...arguments),
					(this.location = p(_n)),
					(this.urlSerializer = p(ua)),
					(this.options = p(ma, { optional: !0 }) || {}),
					(this.canceledNavigationResolution =
						this.options.canceledNavigationResolution || "replace"),
					(this.urlHandlingStrategy = p(ya)),
					(this.urlUpdateStrategy =
						this.options.urlUpdateStrategy || "deferred"),
					(this.currentUrlTree = new et()),
					(this.rawUrlTree = this.currentUrlTree),
					(this.currentPageId = 0),
					(this.lastSuccessfulId = -1),
					(this.routerState = Ed(null)),
					(this.stateMemento = this.createStateMemento());
			}
			getCurrentUrlTree() {
				return this.currentUrlTree;
			}
			getRawUrlTree() {
				return this.rawUrlTree;
			}
			restoredState() {
				return this.location.getState();
			}
			get browserPageId() {
				return this.canceledNavigationResolution !== "computed"
					? this.currentPageId
					: this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
			}
			getRouterState() {
				return this.routerState;
			}
			createStateMemento() {
				return {
					rawUrlTree: this.rawUrlTree,
					currentUrlTree: this.currentUrlTree,
					routerState: this.routerState,
				};
			}
			registerNonRouterCurrentEntryChangeListener(n) {
				return this.location.subscribe((o) => {
					o.type === "popstate" && n(o.url, o.state);
				});
			}
			handleRouterEvent(n, o) {
				if (n instanceof zn)
					this.stateMemento = this.createStateMemento();
				else if (n instanceof Dt) this.rawUrlTree = o.initialUrl;
				else if (n instanceof Io) {
					if (
						this.urlUpdateStrategy === "eager" &&
						!o.extras.skipLocationChange
					) {
						let i = this.urlHandlingStrategy.merge(
							o.finalUrl,
							o.initialUrl,
						);
						this.setBrowserUrl(i, o);
					}
				} else
					n instanceof Wn
						? ((this.currentUrlTree = o.finalUrl),
							(this.rawUrlTree = this.urlHandlingStrategy.merge(
								o.finalUrl,
								o.initialUrl,
							)),
							(this.routerState = o.targetRouterState),
							this.urlUpdateStrategy === "deferred" &&
								(o.extras.skipLocationChange ||
									this.setBrowserUrl(this.rawUrlTree, o)))
						: n instanceof tt &&
							  (n.code === me.GuardRejected ||
									n.code === me.NoDataFromResolver)
							? this.restoreHistory(o)
							: n instanceof Gn
								? this.restoreHistory(o, !0)
								: n instanceof yt &&
									((this.lastSuccessfulId = n.id),
									(this.currentPageId = this.browserPageId));
			}
			setBrowserUrl(n, o) {
				let i = this.urlSerializer.serialize(n);
				if (
					this.location.isCurrentPathEqualTo(i) ||
					o.extras.replaceUrl
				) {
					let s = this.browserPageId,
						a = g(
							g({}, o.extras.state),
							this.generateNgRouterState(o.id, s),
						);
					this.location.replaceState(i, "", a);
				} else {
					let s = g(
						g({}, o.extras.state),
						this.generateNgRouterState(
							o.id,
							this.browserPageId + 1,
						),
					);
					this.location.go(i, "", s);
				}
			}
			restoreHistory(n, o = !1) {
				if (this.canceledNavigationResolution === "computed") {
					let i = this.browserPageId,
						s = this.currentPageId - i;
					s !== 0
						? this.location.historyGo(s)
						: this.currentUrlTree === n.finalUrl &&
							s === 0 &&
							(this.resetState(n),
							this.resetUrlToCurrentUrlTree());
				} else
					this.canceledNavigationResolution === "replace" &&
						(o && this.resetState(n),
						this.resetUrlToCurrentUrlTree());
			}
			resetState(n) {
				(this.routerState = this.stateMemento.routerState),
					(this.currentUrlTree = this.stateMemento.currentUrlTree),
					(this.rawUrlTree = this.urlHandlingStrategy.merge(
						this.currentUrlTree,
						n.finalUrl ?? this.rawUrlTree,
					));
			}
			resetUrlToCurrentUrlTree() {
				this.location.replaceState(
					this.urlSerializer.serialize(this.rawUrlTree),
					"",
					this.generateNgRouterState(
						this.lastSuccessfulId,
						this.currentPageId,
					),
				);
			}
			generateNgRouterState(n, o) {
				return this.canceledNavigationResolution === "computed"
					? { navigationId: n, ɵrouterPageId: o }
					: { navigationId: n };
			}
		};
		(t.ɵfac = (() => {
			let n;
			return function (i) {
				return (n || (n = Yi(t)))(i || t);
			};
		})()),
			(t.ɵprov = m({ token: t, factory: t.ɵfac, providedIn: "root" }));
		let e = t;
		return e;
	})(),
	Vn = (function (e) {
		return (
			(e[(e.COMPLETE = 0)] = "COMPLETE"),
			(e[(e.FAILED = 1)] = "FAILED"),
			(e[(e.REDIRECTING = 2)] = "REDIRECTING"),
			e
		);
	})(Vn || {});
function Jy(e, t) {
	e.events
		.pipe(
			re(
				(r) =>
					r instanceof yt ||
					r instanceof tt ||
					r instanceof Gn ||
					r instanceof Dt,
			),
			T((r) =>
				r instanceof yt || r instanceof Dt
					? Vn.COMPLETE
					: (
								r instanceof tt
									? r.code === me.Redirect ||
										r.code === me.SupersededByNewNavigation
									: !1
						  )
						? Vn.REDIRECTING
						: Vn.FAILED,
			),
			re((r) => r !== Vn.REDIRECTING),
			Re(1),
		)
		.subscribe(() => {
			t();
		});
}
function Xy(e) {
	throw e;
}
var eD = {
		paths: "exact",
		fragment: "ignored",
		matrixParams: "ignored",
		queryParams: "exact",
	},
	tD = {
		paths: "subset",
		fragment: "ignored",
		matrixParams: "ignored",
		queryParams: "subset",
	},
	Fd = (() => {
		let t = class t {
			get currentUrlTree() {
				return this.stateManager.getCurrentUrlTree();
			}
			get rawUrlTree() {
				return this.stateManager.getRawUrlTree();
			}
			get events() {
				return this._events;
			}
			get routerState() {
				return this.stateManager.getRouterState();
			}
			constructor() {
				(this.disposed = !1),
					(this.isNgZoneEnabled = !1),
					(this.console = p(to)),
					(this.stateManager = p(Pd)),
					(this.options = p(ma, { optional: !0 }) || {}),
					(this.pendingTasks = p(zt)),
					(this.urlUpdateStrategy =
						this.options.urlUpdateStrategy || "deferred"),
					(this.navigationTransitions = p(qy)),
					(this.urlSerializer = p(ua)),
					(this.location = p(_n)),
					(this.urlHandlingStrategy = p(ya)),
					(this._events = new ne()),
					(this.errorHandler = this.options.errorHandler || Xy),
					(this.navigated = !1),
					(this.routeReuseStrategy = p(Yy)),
					(this.onSameUrlNavigation =
						this.options.onSameUrlNavigation || "ignore"),
					(this.config = p(va, { optional: !0 })?.flat() ?? []),
					(this.componentInputBindingEnabled = !!p(ha, {
						optional: !0,
					})),
					(this.eventsSubscription = new U()),
					(this.isNgZoneEnabled =
						p(j) instanceof j && j.isInAngularZone()),
					this.resetConfig(this.config),
					this.navigationTransitions
						.setupNavigations(
							this,
							this.currentUrlTree,
							this.routerState,
						)
						.subscribe({
							error: (n) => {
								this.console.warn(n);
							},
						}),
					this.subscribeToNavigationEvents();
			}
			subscribeToNavigationEvents() {
				let n = this.navigationTransitions.events.subscribe((o) => {
					try {
						let i = this.navigationTransitions.currentTransition,
							s = this.navigationTransitions.currentNavigation;
						if (i !== null && s !== null) {
							if (
								(this.stateManager.handleRouterEvent(o, s),
								o instanceof tt &&
									o.code !== me.Redirect &&
									o.code !== me.SupersededByNewNavigation)
							)
								this.navigated = !0;
							else if (o instanceof yt) this.navigated = !0;
							else if (o instanceof qn) {
								let a = this.urlHandlingStrategy.merge(
										o.url,
										i.currentRawUrl,
									),
									c = {
										info: i.extras.info,
										skipLocationChange:
											i.extras.skipLocationChange,
										replaceUrl:
											this.urlUpdateStrategy ===
												"eager" || Zy(i.source),
									};
								this.scheduleNavigation(a, Un, null, c, {
									resolve: i.resolve,
									reject: i.reject,
									promise: i.promise,
								});
							}
						}
						rD(o) && this._events.next(o);
					} catch (i) {
						this.navigationTransitions.transitionAbortSubject.next(
							i,
						);
					}
				});
				this.eventsSubscription.add(n);
			}
			resetRootComponentType(n) {
				(this.routerState.root.component = n),
					(this.navigationTransitions.rootComponentType = n);
			}
			initialNavigation() {
				this.setUpLocationChangeListener(),
					this.navigationTransitions.hasRequestedNavigation ||
						this.navigateToSyncWithBrowser(
							this.location.path(!0),
							Un,
							this.stateManager.restoredState(),
						);
			}
			setUpLocationChangeListener() {
				this.nonRouterCurrentEntryChangeSubscription ??=
					this.stateManager.registerNonRouterCurrentEntryChangeListener(
						(n, o) => {
							setTimeout(() => {
								this.navigateToSyncWithBrowser(
									n,
									"popstate",
									o,
								);
							}, 0);
						},
					);
			}
			navigateToSyncWithBrowser(n, o, i) {
				let s = { replaceUrl: !0 },
					a = i?.navigationId ? i : null;
				if (i) {
					let u = g({}, i);
					delete u.navigationId,
						delete u.ɵrouterPageId,
						Object.keys(u).length !== 0 && (s.state = u);
				}
				let c = this.parseUrl(n);
				this.scheduleNavigation(c, o, a, s);
			}
			get url() {
				return this.serializeUrl(this.currentUrlTree);
			}
			getCurrentNavigation() {
				return this.navigationTransitions.currentNavigation;
			}
			get lastSuccessfulNavigation() {
				return this.navigationTransitions.lastSuccessfulNavigation;
			}
			resetConfig(n) {
				(this.config = n.map(pa)), (this.navigated = !1);
			}
			ngOnDestroy() {
				this.dispose();
			}
			dispose() {
				this.navigationTransitions.complete(),
					this.nonRouterCurrentEntryChangeSubscription &&
						(this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
						(this.nonRouterCurrentEntryChangeSubscription =
							void 0)),
					(this.disposed = !0),
					this.eventsSubscription.unsubscribe();
			}
			createUrlTree(n, o = {}) {
				let {
						relativeTo: i,
						queryParams: s,
						fragment: a,
						queryParamsHandling: c,
						preserveFragment: u,
					} = o,
					l = u ? this.currentUrlTree.fragment : a,
					d = null;
				switch (c) {
					case "merge":
						d = g(g({}, this.currentUrlTree.queryParams), s);
						break;
					case "preserve":
						d = this.currentUrlTree.queryParams;
						break;
					default:
						d = s || null;
				}
				d !== null && (d = this.removeEmptyProps(d));
				let f;
				try {
					let h = i ? i.snapshot : this.routerState.snapshot.root;
					f = vd(h);
				} catch {
					(typeof n[0] != "string" || !n[0].startsWith("/")) &&
						(n = []),
						(f = this.currentUrlTree.root);
				}
				return yd(f, n, d, l ?? null);
			}
			navigateByUrl(n, o = { skipLocationChange: !1 }) {
				let i = en(n) ? n : this.parseUrl(n),
					s = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
				return this.scheduleNavigation(s, Un, null, o);
			}
			navigate(n, o = { skipLocationChange: !1 }) {
				return nD(n), this.navigateByUrl(this.createUrlTree(n, o), o);
			}
			serializeUrl(n) {
				return this.urlSerializer.serialize(n);
			}
			parseUrl(n) {
				try {
					return this.urlSerializer.parse(n);
				} catch {
					return this.urlSerializer.parse("/");
				}
			}
			isActive(n, o) {
				let i;
				if (
					(o === !0
						? (i = g({}, eD))
						: o === !1
							? (i = g({}, tD))
							: (i = o),
					en(n))
				)
					return rd(this.currentUrlTree, n, i);
				let s = this.parseUrl(n);
				return rd(this.currentUrlTree, s, i);
			}
			removeEmptyProps(n) {
				return Object.entries(n).reduce(
					(o, [i, s]) => (s != null && (o[i] = s), o),
					{},
				);
			}
			scheduleNavigation(n, o, i, s, a) {
				if (this.disposed) return Promise.resolve(!1);
				let c, u, l;
				a
					? ((c = a.resolve), (u = a.reject), (l = a.promise))
					: (l = new Promise((f, h) => {
							(c = f), (u = h);
						}));
				let d = this.pendingTasks.add();
				return (
					Jy(this, () => {
						queueMicrotask(() => this.pendingTasks.remove(d));
					}),
					this.navigationTransitions.handleNavigationRequest({
						source: o,
						restoredState: i,
						currentUrlTree: this.currentUrlTree,
						currentRawUrl: this.currentUrlTree,
						rawUrl: n,
						extras: s,
						resolve: c,
						reject: u,
						promise: l,
						currentSnapshot: this.routerState.snapshot,
						currentRouterState: this.routerState,
					}),
					l.catch((f) => Promise.reject(f))
				);
			}
		};
		(t.ɵfac = function (o) {
			return new (o || t)();
		}),
			(t.ɵprov = m({ token: t, factory: t.ɵfac, providedIn: "root" }));
		let e = t;
		return e;
	})();
function nD(e) {
	for (let t = 0; t < e.length; t++) if (e[t] == null) throw new D(4008, !1);
}
function rD(e) {
	return !(e instanceof Wn) && !(e instanceof qn);
}
var oD = new b("");
function kd(e, ...t) {
	return Ut([
		{ provide: va, multi: !0, useValue: e },
		[],
		{ provide: tn, useFactory: iD, deps: [Fd] },
		{ provide: no, multi: !0, useFactory: sD },
		t.map((r) => r.ɵproviders),
	]);
}
function iD(e) {
	return e.routerState.root;
}
function sD() {
	let e = p(Bt);
	return (t) => {
		let r = e.get(Gt);
		if (t !== r.components[0]) return;
		let n = e.get(Fd),
			o = e.get(aD);
		e.get(cD) === 1 && n.initialNavigation(),
			e.get(uD, null, S.Optional)?.setUpPreloading(),
			e.get(oD, null, S.Optional)?.init(),
			n.resetRootComponentType(r.componentTypes[0]),
			o.closed || (o.next(), o.complete(), o.unsubscribe());
	};
}
var aD = new b("", { factory: () => new ne() }),
	cD = new b("", { providedIn: "root", factory: () => 1 });
var uD = new b("");
var Ld = (() => {
	let t = class t {
		constructor(n) {
			this.http = n;
		}
		getCardInfo(n) {
			return this.http.get(`../../assets/json/${n}.json`);
		}
		getAlgorithmInfo(n) {}
	};
	(t.ɵfac = function (o) {
		return new (o || t)(v(Is));
	}),
		(t.ɵprov = m({ token: t, factory: t.ɵfac, providedIn: "root" }));
	let e = t;
	return e;
})();
var jd = (() => {
	let t = class t {
		constructor(n) {
			(this.jsonInfoService = n),
				(this.jsonFileName = ""),
				(this.title = ""),
				(this.description = "");
		}
		ngOnInit() {
			this.jsonInfoService
				.getCardInfo(this.jsonFileName)
				.subscribe((n) => {
					(this.title = n.title), (this.description = n.description);
				});
		}
	};
	(t.ɵfac = function (o) {
		return new (o || t)(xn(Ld));
	}),
		(t.ɵcmp = pe({
			type: t,
			selectors: [["app-menu-card"]],
			inputs: { jsonFileName: "jsonFileName" },
			standalone: !0,
			features: [ge],
			decls: 11,
			vars: 2,
			consts: [
				[1, "col"],
				[1, "card", "card-algorithm-type", "mx-auto"],
				[1, "card-body"],
				[1, "card-title", "text"],
				[1, "text"],
				[1, "card-footer"],
				[1, "btn", "menu-button", "text"],
			],
			template: function (o, i) {
				o & 1 &&
					(G(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h4", 3),
					Je(4),
					q(),
					G(5, "p", 4),
					Je(6),
					q()(),
					G(7, "div", 5)(8, "button", 6)(9, "strong"),
					Je(10, "Go"),
					q()()()()()),
					o & 2 && (Sn(4), Ht(i.title), Sn(2), Ht(i.description));
			},
			styles: [
				".btn[_ngcontent-%COMP%]{float:right;transition:.5s;background-color:#f26419}.btn[_ngcontent-%COMP%]:hover{transform:scale(1.1)}.card[_ngcontent-%COMP%]{width:20rem;height:17rem;top:1rem;background-color:#84a98c}",
			],
		}));
	let e = t;
	return e;
})();
var Vd = (() => {
	let t = class t {};
	(t.ɵfac = function (o) {
		return new (o || t)();
	}),
		(t.ɵcmp = pe({
			type: t,
			selectors: [["app-home-menu"]],
			standalone: !0,
			features: [ge],
			decls: 6,
			vars: 0,
			consts: [
				[1, "h-100", "main-bg"],
				[
					"id",
					"algorithmsMenu",
					1,
					"container-fluid",
					"position-absolute",
					2,
					"visibility",
					"visible",
					"opacity",
					"1",
					"padding-top",
					"20px",
				],
				[
					1,
					"row",
					"row-cols-1",
					"row-cols-lg-3",
					"row-cols-md-2",
					"g-4",
					2,
					"margin",
					"0",
				],
				["jsonFileName", "sorting_algorithm"],
				["jsonFileName", "searching_algorithm"],
				["jsonFileName", "pathfinding_algorithm"],
			],
			template: function (o, i) {
				o & 1 &&
					(G(0, "div", 0)(1, "div", 1)(2, "div", 2),
					se(3, "app-menu-card", 3)(4, "app-menu-card", 4)(
						5,
						"app-menu-card",
						5,
					),
					q()()());
			},
			dependencies: [jd],
		}));
	let e = t;
	return e;
})();
var $d = [{ path: "", component: Vd }];
var Ud = { providers: [kd($d), Zl()] };
var Bd = (() => {
	let t = class t {
		constructor() {
			this.title = "";
		}
	};
	(t.ɵfac = function (o) {
		return new (o || t)();
	}),
		(t.ɵcmp = pe({
			type: t,
			selectors: [["app-navbar"]],
			inputs: { title: "title" },
			standalone: !0,
			features: [ge],
			decls: 11,
			vars: 1,
			consts: [
				[1, "navbar"],
				[1, "container-fluid", "d-flex"],
				["href", "index.html", 1, "navbar-brand"],
				[
					"src",
					"assets/icon.png",
					"width",
					"50",
					"aria-label",
					"Logo",
					"alt",
					"Logo",
					1,
					"",
				],
				[1, "flex-grow-1", "text-center"],
				[
					"src",
					"assets/info-circle.svg",
					"height",
					"30",
					"width",
					"30",
					"data-bs-toggle",
					"modal",
					"data-bs-target",
					"#introModal",
					"aria-label",
					"Info",
					"alt",
					"Info",
					1,
					"navbar-image",
				],
				[1, "col-auto", "text-end"],
				[
					"xmlns",
					"http://www.w3.org/2000/svg",
					"height",
					"50",
					"fill",
					"white",
					"viewBox",
					"0 0 16 16",
					"data-bs-toggle",
					"modal",
					"data-bs-target",
					"#settingModal",
					1,
					"justify-content-end",
					"btn",
				],
				[
					"d",
					"M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z",
				],
				[
					"d",
					"M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z",
				],
			],
			template: function (o, i) {
				o & 1 &&
					(G(0, "nav", 0)(1, "div", 1)(2, "a", 2),
					se(3, "img", 3),
					q(),
					G(4, "h1", 4),
					Je(5),
					q(),
					se(6, "img", 5),
					G(7, "div", 6),
					yu(),
					G(8, "svg", 7),
					se(9, "path", 8)(10, "path", 9),
					q()()()()),
					o & 2 && (Sn(5), Ht(i.title));
			},
		}));
	let e = t;
	return e;
})();
var Hd = (() => {
	let t = class t {};
	(t.ɵfac = function (o) {
		return new (o || t)();
	}),
		(t.ɵcmp = pe({
			type: t,
			selectors: [["app-playbar"]],
			standalone: !0,
			features: [ge],
			decls: 3,
			vars: 0,
			consts: [
				[1, "navbar"],
				[1, "container-fluid", "d-flex"],
			],
			template: function (o, i) {
				o & 1 && (G(0, "nav", 0)(1, "div", 1), Je(2, "playbar"), q()());
			},
		}));
	let e = t;
	return e;
})();
var zd = (() => {
	let t = class t {
		constructor() {
			this.title = "algorithm-visualizer";
		}
	};
	(t.ɵfac = function (o) {
		return new (o || t)();
	}),
		(t.ɵcmp = pe({
			type: t,
			selectors: [["app-root"]],
			standalone: !0,
			features: [ge],
			decls: 5,
			vars: 0,
			consts: [
				[1, "d-flex", "flex-column", "min-vh-100", "vh-100"],
				["title", "blah"],
				[1, "container-fluid", "flex-remaining-height", "px-0"],
			],
			template: function (o, i) {
				o & 1 &&
					(G(0, "div", 0),
					se(1, "app-navbar", 1),
					G(2, "div", 2),
					se(3, "router-outlet"),
					q(),
					se(4, "app-playbar"),
					q());
			},
			dependencies: [fa, Bd, Hd],
		}));
	let e = t;
	return e;
})();
nd(zd, Ud).catch((e) => console.error(e));
