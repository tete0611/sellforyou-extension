// 라이브러리 실행해보기
// (function (e, t) {
//   "undefined" == typeof window &&
//     (window = {
//       ctrl: {},
//       lib: {},
//     }),
//     !window.ctrl && (window.ctrl = {}),
//     !window.lib && (window.lib = {}),
//     (function (e, t) {
//       function o() {
//         var e = {},
//           t = new c(function (t, o) {
//             (e.resolve = t), (e.reject = o);
//           });
//         return (e.promise = t), e;
//       }
//       function n(e, t) {
//         for (var o in t) void 0 === e[o] && (e[o] = t[o]);
//         return e;
//       }
//       function r(e) {
//         var t = [];
//         for (var o in e) e[o] && t.push(o + "=" + encodeURIComponent(e[o]));
//         return t.join("&");
//       }
//       function i(e) {
//         return "[object Object]" == {}.toString.call(e);
//       }
//       function s(e) {
//         var t = new RegExp("(?:^|;\\s*)" + e + "\\=([^;]+)(?:;\\s*|$)").exec(document.cookie);
//         return t ? t[1] : void 0;
//       }
//       function a(e, t, o) {
//         var n = new Date();
//         n.setTime(n.getTime() - 864e5);
//         (document.cookie = e + "=;path=/;domain=." + t + ";expires=" + n.toGMTString()),
//           (document.cookie = e + "=;path=/;domain=." + o + "." + t + ";expires=" + n.toGMTString());
//       }
//       function p(e, t) {
//         function o(e) {
//           for (var t = (e = (e || 0).toString()).split("."), o = ["", "0", "00", "000", "0000"].reverse(), n = 0; n < t.length; n++) {
//             var r = t[n].length;
//             t[n] = o[r] + t[n];
//           }
//           return t.join("");
//         }
//         var n = o(e),
//           r = o(t);
//         return n == r ? 0 : n > r ? 1 : r > n ? -1 : void 0;
//       }
//       function u(e) {
//         (this.id = "" + new Date().getTime() + ++_),
//           (this.params = n(e || {}, {
//             v: "*",
//             data: {},
//             type: "get",
//             dataType: "jsonp",
//           })),
//           (this.params.type = this.params.type.toLowerCase()),
//           "object" == typeof this.params.data && (this.params.data = JSON.stringify(this.params.data)),
//           (this.middlewares = f.slice(0));
//       }
//       var c = e.Promise,
//         d = (
//           c || {
//             resolve: function () {},
//           }
//         ).resolve();
//       String.prototype.trim ||
//         (String.prototype.trim = function () {
//           return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
//         });
//       var l = {
//           useJsonpResultType: !1,
//           safariGoLogin: !0,
//           useAlipayJSBridge: !1,
//         },
//         f = [],
//         m = {
//           ERROR: -1,
//           SUCCESS: 0,
//           TOKEN_EXPIRED: 1,
//           SESSION_EXPIRED: 2,
//         };
//       (function () {
//         var t = e.location.hostname;
//         if (!t) {
//           var o = e.parent.location.hostname;
//           o && ~o.indexOf("zebra.alibaba-inc.com") && (t = o);
//         }
//         var n = new RegExp(
//             "([^.]*?)\\.?((?:" + ["taobao.net", "taobao.com", "tmall.com", "tmall.hk", "alibaba-inc.com"].join(")|(?:").replace(/\./g, "\\.") + "))",
//             "i"
//           ),
//           r = t.match(n) || [],
//           i = r[2] || "taobao.com",
//           s = r[1] || "m";
//         "taobao.net" !== i || ("x" !== s && "waptest" !== s && "daily" !== s)
//           ? "taobao.net" === i && "demo" === s
//             ? (s = "demo")
//             : "alibaba-inc.com" === i && "zebra" === s
//             ? (s = "zebra")
//             : "waptest" !== s && "wapa" !== s && "m" !== s && (s = "m")
//           : (s = "waptest");
//         var a = "h5api";
//         "taobao.net" === i && "waptest" === s && (a = "acs"), (l.mainDomain = i), (l.subDomain = s), (l.prefix = a);
//       })(),
//         (function () {
//           var t = e.navigator.userAgent,
//             o = t.match(/WindVane[\/\s]([\d\.\_]+)/);
//           o && (l.WindVaneVersion = o[1]);
//           var n = t.match(/AliApp\(([^\/]+)\/([\d\.\_]+)\)/i);
//           n && ((l.AliAppName = n[1]), (l.AliAppVersion = n[2]));
//           var r = t.match(/AMapClient\/([\d\.\_]+)/i);
//           r && ((l.AliAppName = "AMAP"), (l.AliAppVersion = r[1]));
//         })();
//       var h = /[Android|Adr]/.test(e.navigator.userAgent),
//         g =
//           ("AP" === l.AliAppName && p(l.AliAppVersion, "10.1.2") >= 0) ||
//           ("KB" === l.AliAppName && p(l.AliAppVersion, "7.1.62") >= 0) ||
//           (h && "AMAP" === l.AliAppName && p(l.AliAppVersion, "1.0.1") >= 0),
//         _ = 0;
//       (u.prototype.use = function (e) {
//         if (!e) throw new Error("middleware is undefined");
//         return this.middlewares.push(e), this;
//       }),
//         (u.prototype.__processRequestMethod = function (e) {
//           var t = this.params,
//             o = this.options;
//           "get" === t.type && "jsonp" === t.dataType
//             ? (o.getJSONP = !0)
//             : "get" === t.type && "originaljsonp" === t.dataType
//             ? (o.getOriginalJSONP = !0)
//             : "get" === t.type && "json" === t.dataType
//             ? (o.getJSON = !0)
//             : "post" === t.type && (o.postJSON = !0),
//             e();
//         }),
//         (u.prototype.__processRequestType = function (o) {
//           var n = this,
//             r = this.params,
//             s = this.options;
//           if (
//             (!0 === l.H5Request && (s.H5Request = !0), !0 === l.WindVaneRequest && (s.WindVaneRequest = !0), !1 === s.H5Request && !0 === s.WindVaneRequest)
//           ) {
//             if (!g && (!t.windvane || parseFloat(s.WindVaneVersion) < 5.4)) throw new Error("WINDVANE_NOT_FOUND::缺少WindVane环境");
//             if (g && !e.AlipayJSBridge)
//               throw new Error("ALIPAY_NOT_READY::支付宝通道未准备好，支付宝请见 https://lark.alipay.com/mtbsdkdocs/mtopjssdkdocs/pucq6z");
//           } else if (!0 === s.H5Request) s.WindVaneRequest = !1;
//           else if (
//             void 0 === s.WindVaneRequest &&
//             void 0 === s.H5Request &&
//             (t.windvane && parseFloat(s.WindVaneVersion) >= 5.4
//               ? ((s.WindVaneRequest = !0), window.self !== window.top && (s.H5Request = !0))
//               : (s.H5Request = !0),
//             g)
//           ) {
//             if (((s.WindVaneRequest = s.H5Request = void 0), e.AlipayJSBridge))
//               if (i(r.data)) s.WindVaneRequest = !0;
//               else
//                 try {
//                   i(JSON.parse(r.data)) ? (s.WindVaneRequest = !0) : (s.H5Request = !0);
//                 } catch (e) {
//                   s.H5Request = !0;
//                 }
//             else s.H5Request = !0;
//             "AMAP" !== l.AliAppName || r.useNebulaJSbridgeWithAMAP || ((s.WindVaneRequest = s.H5Request = void 0), (s.H5Request = !0));
//           }
//           var a = e.navigator.userAgent.toLowerCase();
//           return (
//             a.indexOf("youku") > -1 && s.mainDomain.indexOf("youku.com") < 0 && ((s.WindVaneRequest = !1), (s.H5Request = !0)),
//             s.mainDomain.indexOf("youku.com") > -1 && a.indexOf("youku") < 0 && ((s.WindVaneRequest = !1), (s.H5Request = !0)),
//             o
//               ? o().then(function () {
//                   var e = s.retJson.ret;
//                   if (
//                     (e instanceof Array && (e = e.join(",")),
//                     (!0 === s.WindVaneRequest && g && s.retJson.error) ||
//                       !e ||
//                       e.indexOf("PARAM_PARSE_ERROR") > -1 ||
//                       e.indexOf("HY_FAILED") > -1 ||
//                       e.indexOf("HY_NO_HANDLER") > -1 ||
//                       e.indexOf("HY_CLOSED") > -1 ||
//                       e.indexOf("HY_EXCEPTION") > -1 ||
//                       e.indexOf("HY_NO_PERMISSION") > -1)
//                   ) {
//                     if (!g || !isNaN(s.retJson.error) || -1 !== s.retJson.error.indexOf("FAIL_SYS_ACCESS_DENIED"))
//                       return (
//                         g && i(r.data) && (r.data = JSON.stringify(r.data)),
//                         (l.H5Request = !0),
//                         n.__sequence([n.__processRequestType, n.__processToken, n.__processRequestUrl, n.middlewares, n.__processRequest])
//                       );
//                     void 0 === s.retJson.api &&
//                       void 0 === s.retJson.v &&
//                       ((s.retJson.api = r.api),
//                       (s.retJson.v = r.v),
//                       (s.retJson.ret = [s.retJson.error + "::" + s.retJson.errorMessage]),
//                       (s.retJson.data = {}));
//                   }
//                 })
//               : void 0
//           );
//         });
//       var v = "_m_h5_c",
//         y = "_m_h5_tk";
//       (u.prototype.__getTokenFromAlipay = function () {
//         var t = o(),
//           n = this.options,
//           r = (e.navigator.userAgent, !!location.protocol.match(/^https?\:$/));
//         return (
//           !0 === n.useAlipayJSBridge && !r && g && e.AlipayJSBridge && e.AlipayJSBridge.call
//             ? e.AlipayJSBridge.call(
//                 "getMtopToken",
//                 function (e) {
//                   e && e.token && (n.token = e.token), t.resolve();
//                 },
//                 function () {
//                   t.resolve();
//                 }
//               )
//             : t.resolve(),
//           t.promise
//         );
//       }),
//         (u.prototype.__getTokenFromCookie = function () {
//           var e = this.options;
//           return e.CDR && s(v) ? (e.token = s(v).split(";")[0]) : (e.token = e.token || s(y)), e.token && (e.token = e.token.split("_")[0]), c.resolve();
//         }),
//         (u.prototype.__waitWKWebViewCookie = function (t) {
//           var o = this.options;
//           o.waitWKWebViewCookieFn && o.H5Request && e.webkit && e.webkit.messageHandlers ? o.waitWKWebViewCookieFn(t) : t();
//         }),
//         (u.prototype.__processToken = function (e) {
//           var t = this,
//             o = this.options;
//           return (
//             this.params,
//             o.token && delete o.token,
//             !0 !== o.WindVaneRequest
//               ? d
//                   .then(function () {
//                     return t.__getTokenFromAlipay();
//                   })
//                   .then(function () {
//                     return t.__getTokenFromCookie();
//                   })
//                   .then(e)
//                   .then(function () {
//                     var e = o.retJson,
//                       n = e.ret;
//                     if (
//                       (n instanceof Array && (n = n.join(",")),
//                       n.indexOf("TOKEN_EMPTY") > -1 ||
//                         ((!0 === o.CDR || !0 === o.syncCookieMode) && n.indexOf("ILLEGAL_ACCESS") > -1) ||
//                         n.indexOf("TOKEN_EXOIRED") > -1)
//                     ) {
//                       if (((o.maxRetryTimes = o.maxRetryTimes || 5), (o.failTimes = o.failTimes || 0), o.H5Request && ++o.failTimes < o.maxRetryTimes)) {
//                         var r = [t.__waitWKWebViewCookie, t.__processToken, t.__processRequestUrl, t.middlewares, t.__processRequest];
//                         if (!0 === o.syncCookieMode && t.constructor.__cookieProcessorId !== t.id)
//                           if (t.constructor.__cookieProcessor) {
//                             r = [
//                               function (e) {
//                                 var o = function () {
//                                   (t.constructor.__cookieProcessor = null), (t.constructor.__cookieProcessorId = null), e();
//                                 };
//                                 t.constructor.__cookieProcessor ? t.constructor.__cookieProcessor.then(o).catch(o) : e();
//                               },
//                               t.__waitWKWebViewCookie,
//                               t.__processToken,
//                               t.__processRequestUrl,
//                               t.middlewares,
//                               t.__processRequest,
//                             ];
//                           } else (t.constructor.__cookieProcessor = t.__requestProcessor), (t.constructor.__cookieProcessorId = t.id);
//                         return t.__sequence(r);
//                       }
//                       o.maxRetryTimes > 0 && (a(v, o.pageDomain, "*"), a(y, o.mainDomain, o.subDomain), a("_m_h5_tk_enc", o.mainDomain, o.subDomain)),
//                         (e.retType = m.TOKEN_EXPIRED);
//                     }
//                   })
//               : void e()
//           );
//         }),
//         (u.prototype.__processRequestUrl = function (t) {
//           var o = this.params,
//             n = this.options;
//           if (n.hostSetting && n.hostSetting[e.location.hostname]) {
//             var r = n.hostSetting[e.location.hostname];
//             r.prefix && (n.prefix = r.prefix), r.subDomain && (n.subDomain = r.subDomain), r.mainDomain && (n.mainDomain = r.mainDomain);
//           }
//           if (!0 === n.H5Request) {
//             var i =
//                 "//" +
//                 (n.prefix ? n.prefix + "." : "") +
//                 (n.subDomain ? n.subDomain + "." : "") +
//                 n.mainDomain +
//                 "/h5/" +
//                 o.api.toLowerCase() +
//                 "/" +
//                 o.v.toLowerCase() +
//                 "/",
//               s = o.appKey || ("waptest" === n.subDomain ? "4272" : "12574478"),
//               a = new Date().getTime(),
//               p = (function (e) {
//                 function t(e, t) {
//                   return (e << t) | (e >>> (32 - t));
//                 }
//                 function o(e, t) {
//                   var o, n, r, i, s;
//                   return (
//                     (r = 2147483648 & e),
//                     (i = 2147483648 & t),
//                     (s = (1073741823 & e) + (1073741823 & t)),
//                     (o = 1073741824 & e) & (n = 1073741824 & t)
//                       ? 2147483648 ^ s ^ r ^ i
//                       : o | n
//                       ? 1073741824 & s
//                         ? 3221225472 ^ s ^ r ^ i
//                         : 1073741824 ^ s ^ r ^ i
//                       : s ^ r ^ i
//                   );
//                 }
//                 function n(e, n, r, i, s, a, p) {
//                   return (
//                     (e = o(
//                       e,
//                       o(
//                         o(
//                           (function (e, t, o) {
//                             return (e & t) | (~e & o);
//                           })(n, r, i),
//                           s
//                         ),
//                         p
//                       )
//                     )),
//                     o(t(e, a), n)
//                   );
//                 }
//                 function r(e, n, r, i, s, a, p) {
//                   return (
//                     (e = o(
//                       e,
//                       o(
//                         o(
//                           (function (e, t, o) {
//                             return (e & o) | (t & ~o);
//                           })(n, r, i),
//                           s
//                         ),
//                         p
//                       )
//                     )),
//                     o(t(e, a), n)
//                   );
//                 }
//                 function i(e, n, r, i, s, a, p) {
//                   return (
//                     (e = o(
//                       e,
//                       o(
//                         o(
//                           (function (e, t, o) {
//                             return e ^ t ^ o;
//                           })(n, r, i),
//                           s
//                         ),
//                         p
//                       )
//                     )),
//                     o(t(e, a), n)
//                   );
//                 }
//                 function s(e, n, r, i, s, a, p) {
//                   return (
//                     (e = o(
//                       e,
//                       o(
//                         o(
//                           (function (e, t, o) {
//                             return t ^ (e | ~o);
//                           })(n, r, i),
//                           s
//                         ),
//                         p
//                       )
//                     )),
//                     o(t(e, a), n)
//                   );
//                 }
//                 function a(e) {
//                   var t,
//                     o = "",
//                     n = "";
//                   for (t = 0; 3 >= t; t++) o += (n = "0" + ((e >>> (8 * t)) & 255).toString(16)).substr(n.length - 2, 2);
//                   return o;
//                 }
//                 var p, u, c, d, l, f, m, h, g, _;
//                 for (
//                   _ = (function (e) {
//                     for (var t, o = e.length, n = o + 8, r = 16 * ((n - (n % 64)) / 64 + 1), i = new Array(r - 1), s = 0, a = 0; o > a; )
//                       (s = (a % 4) * 8), (i[(t = (a - (a % 4)) / 4)] = i[t] | (e.charCodeAt(a) << s)), a++;
//                     return (s = (a % 4) * 8), (i[(t = (a - (a % 4)) / 4)] = i[t] | (128 << s)), (i[r - 2] = o << 3), (i[r - 1] = o >>> 29), i;
//                   })(
//                     (e = (function (e) {
//                       e = e.replace(/\r\n/g, "\n");
//                       for (var t = "", o = 0; o < e.length; o++) {
//                         var n = e.charCodeAt(o);
//                         128 > n
//                           ? (t += String.fromCharCode(n))
//                           : n > 127 && 2048 > n
//                           ? ((t += String.fromCharCode((n >> 6) | 192)), (t += String.fromCharCode((63 & n) | 128)))
//                           : ((t += String.fromCharCode((n >> 12) | 224)),
//                             (t += String.fromCharCode(((n >> 6) & 63) | 128)),
//                             (t += String.fromCharCode((63 & n) | 128)));
//                       }
//                       return t;
//                     })(e))
//                   ),
//                     f = 1732584193,
//                     m = 4023233417,
//                     h = 2562383102,
//                     g = 271733878,
//                     p = 0;
//                   p < _.length;
//                   p += 16
//                 )
//                   (u = f),
//                     (c = m),
//                     (d = h),
//                     (l = g),
//                     (f = n(f, m, h, g, _[p + 0], 7, 3614090360)),
//                     (g = n(g, f, m, h, _[p + 1], 12, 3905402710)),
//                     (h = n(h, g, f, m, _[p + 2], 17, 606105819)),
//                     (m = n(m, h, g, f, _[p + 3], 22, 3250441966)),
//                     (f = n(f, m, h, g, _[p + 4], 7, 4118548399)),
//                     (g = n(g, f, m, h, _[p + 5], 12, 1200080426)),
//                     (h = n(h, g, f, m, _[p + 6], 17, 2821735955)),
//                     (m = n(m, h, g, f, _[p + 7], 22, 4249261313)),
//                     (f = n(f, m, h, g, _[p + 8], 7, 1770035416)),
//                     (g = n(g, f, m, h, _[p + 9], 12, 2336552879)),
//                     (h = n(h, g, f, m, _[p + 10], 17, 4294925233)),
//                     (m = n(m, h, g, f, _[p + 11], 22, 2304563134)),
//                     (f = n(f, m, h, g, _[p + 12], 7, 1804603682)),
//                     (g = n(g, f, m, h, _[p + 13], 12, 4254626195)),
//                     (h = n(h, g, f, m, _[p + 14], 17, 2792965006)),
//                     (f = r(f, (m = n(m, h, g, f, _[p + 15], 22, 1236535329)), h, g, _[p + 1], 5, 4129170786)),
//                     (g = r(g, f, m, h, _[p + 6], 9, 3225465664)),
//                     (h = r(h, g, f, m, _[p + 11], 14, 643717713)),
//                     (m = r(m, h, g, f, _[p + 0], 20, 3921069994)),
//                     (f = r(f, m, h, g, _[p + 5], 5, 3593408605)),
//                     (g = r(g, f, m, h, _[p + 10], 9, 38016083)),
//                     (h = r(h, g, f, m, _[p + 15], 14, 3634488961)),
//                     (m = r(m, h, g, f, _[p + 4], 20, 3889429448)),
//                     (f = r(f, m, h, g, _[p + 9], 5, 568446438)),
//                     (g = r(g, f, m, h, _[p + 14], 9, 3275163606)),
//                     (h = r(h, g, f, m, _[p + 3], 14, 4107603335)),
//                     (m = r(m, h, g, f, _[p + 8], 20, 1163531501)),
//                     (f = r(f, m, h, g, _[p + 13], 5, 2850285829)),
//                     (g = r(g, f, m, h, _[p + 2], 9, 4243563512)),
//                     (h = r(h, g, f, m, _[p + 7], 14, 1735328473)),
//                     (f = i(f, (m = r(m, h, g, f, _[p + 12], 20, 2368359562)), h, g, _[p + 5], 4, 4294588738)),
//                     (g = i(g, f, m, h, _[p + 8], 11, 2272392833)),
//                     (h = i(h, g, f, m, _[p + 11], 16, 1839030562)),
//                     (m = i(m, h, g, f, _[p + 14], 23, 4259657740)),
//                     (f = i(f, m, h, g, _[p + 1], 4, 2763975236)),
//                     (g = i(g, f, m, h, _[p + 4], 11, 1272893353)),
//                     (h = i(h, g, f, m, _[p + 7], 16, 4139469664)),
//                     (m = i(m, h, g, f, _[p + 10], 23, 3200236656)),
//                     (f = i(f, m, h, g, _[p + 13], 4, 681279174)),
//                     (g = i(g, f, m, h, _[p + 0], 11, 3936430074)),
//                     (h = i(h, g, f, m, _[p + 3], 16, 3572445317)),
//                     (m = i(m, h, g, f, _[p + 6], 23, 76029189)),
//                     (f = i(f, m, h, g, _[p + 9], 4, 3654602809)),
//                     (g = i(g, f, m, h, _[p + 12], 11, 3873151461)),
//                     (h = i(h, g, f, m, _[p + 15], 16, 530742520)),
//                     (f = s(f, (m = i(m, h, g, f, _[p + 2], 23, 3299628645)), h, g, _[p + 0], 6, 4096336452)),
//                     (g = s(g, f, m, h, _[p + 7], 10, 1126891415)),
//                     (h = s(h, g, f, m, _[p + 14], 15, 2878612391)),
//                     (m = s(m, h, g, f, _[p + 5], 21, 4237533241)),
//                     (f = s(f, m, h, g, _[p + 12], 6, 1700485571)),
//                     (g = s(g, f, m, h, _[p + 3], 10, 2399980690)),
//                     (h = s(h, g, f, m, _[p + 10], 15, 4293915773)),
//                     (m = s(m, h, g, f, _[p + 1], 21, 2240044497)),
//                     (f = s(f, m, h, g, _[p + 8], 6, 1873313359)),
//                     (g = s(g, f, m, h, _[p + 15], 10, 4264355552)),
//                     (h = s(h, g, f, m, _[p + 6], 15, 2734768916)),
//                     (m = s(m, h, g, f, _[p + 13], 21, 1309151649)),
//                     (f = s(f, m, h, g, _[p + 4], 6, 4149444226)),
//                     (g = s(g, f, m, h, _[p + 11], 10, 3174756917)),
//                     (h = s(h, g, f, m, _[p + 2], 15, 718787259)),
//                     (m = s(m, h, g, f, _[p + 9], 21, 3951481745)),
//                     (f = o(f, u)),
//                     (m = o(m, c)),
//                     (h = o(h, d)),
//                     (g = o(g, l));
//                 return (a(f) + a(m) + a(h) + a(g)).toLowerCase();
//               })(n.token + "&" + a + "&" + s + "&" + o.data),
//               u = {
//                 jsv: "2.5.1",
//                 appKey: s,
//                 t: a,
//                 sign: p,
//               },
//               c = {
//                 data: o.data,
//                 ua: o.ua,
//               };
//             Object.keys(o).forEach(function (e) {
//               void 0 === u[e] && void 0 === c[e] && "headers" !== e && "ext_headers" !== e && "ext_querys" !== e && (u[e] = o[e]);
//             }),
//               o.ext_querys &&
//                 Object.keys(o.ext_querys).forEach(function (e) {
//                   u[e] = o.ext_querys[e];
//                 }),
//               n.getJSONP ? (u.type = "jsonp") : n.getOriginalJSONP ? (u.type = "originaljsonp") : (n.getJSON || n.postJSON) && (u.type = "originaljson"),
//               void 0 !== o.valueType &&
//                 ("original" === o.valueType
//                   ? n.getJSONP || n.getOriginalJSONP
//                     ? (u.type = "originaljsonp")
//                     : (n.getJSON || n.postJSON) && (u.type = "originaljson")
//                   : "string" === o.valueType && (n.getJSONP || n.getOriginalJSONP ? (u.type = "jsonp") : (n.getJSON || n.postJSON) && (u.type = "json"))),
//               !0 === n.useJsonpResultType && "originaljson" === u.type && delete u.type,
//               n.dangerouslySetProtocol && (i = n.dangerouslySetProtocol + ":" + i),
//               (n.querystring = u),
//               (n.postdata = c),
//               (n.path = i);
//           }
//           t();
//         }),
//         (u.prototype.__processUnitPrefix = function (e) {
//           e();
//         });
//       var w = 0;
//       (u.prototype.__requestJSONP = function (e) {
//         function t(e) {
//           if ((u && clearTimeout(u), c.parentNode && c.parentNode.removeChild(c), "TIMEOUT" === e))
//             window[p] = function () {
//               window[p] = void 0;
//               try {
//                 delete window[p];
//               } catch (e) {}
//             };
//           else {
//             window[p] = void 0;
//             try {
//               delete window[p];
//             } catch (e) {}
//           }
//         }
//         var n = o(),
//           i = this.params,
//           s = this.options,
//           a = i.timeout || 2e4,
//           p = "mtopjsonp" + (i.jsonpIncPrefix || "") + ++w,
//           u = setTimeout(function () {
//             e(s.timeoutErrMsg || "TIMEOUT::接口超时"), t("TIMEOUT");
//           }, a);
//         s.querystring.callback = p;
//         var c = document.createElement("script");
//         return (
//           (c.src = s.path + "?" + r(s.querystring) + "&" + r(s.postdata)),
//           (c.async = !0),
//           (c.onerror = function () {
//             t("ABORT"), e(s.abortErrMsg || "ABORT::接口异常退出");
//           }),
//           (window[p] = function () {
//             (s.results = Array.prototype.slice.call(arguments)), t(), n.resolve();
//           }),
//           (function (e) {
//             (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0] || document.firstElementChild || document).appendChild(e);
//           })(c),
//           n.promise
//         );
//       }),
//         (u.prototype.__requestJSON = function (t) {
//           function n(e) {
//             d && clearTimeout(d), "TIMEOUT" === e && u.abort();
//           }
//           var i = o(),
//             a = this.params,
//             p = this.options,
//             u = new e.XMLHttpRequest(),
//             c = a.timeout || 2e4,
//             d = setTimeout(function () {
//               t(p.timeoutErrMsg || "TIMEOUT::接口超时"), n("TIMEOUT");
//             }, c);
//           p.CDR && s(v) && (p.querystring.c = decodeURIComponent(s(v))),
//             (u.onreadystatechange = function () {
//               if (4 == u.readyState) {
//                 var e,
//                   o,
//                   r = u.status;
//                 if ((r >= 200 && 300 > r) || 304 == r) {
//                   n(), (e = u.responseText), (o = u.getAllResponseHeaders() || "");
//                   try {
//                     ((e = /^\s*$/.test(e) ? {} : JSON.parse(e)).responseHeaders = o), (p.results = [e]), i.resolve();
//                   } catch (e) {
//                     t("PARSE_JSON_ERROR::解析JSON失败");
//                   }
//                 } else n("ABORT"), t(p.abortErrMsg || "ABORT::接口异常退出");
//               }
//             });
//           var l,
//             f,
//             m = p.path + "?" + r(p.querystring);
//           p.getJSON ? ((l = "GET"), (m += "&" + r(p.postdata))) : p.postJSON && ((l = "POST"), (f = r(p.postdata))),
//             u.open(l, m, !0),
//             (u.withCredentials = !0),
//             u.setRequestHeader("Accept", "application/json"),
//             u.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//           var h = a.ext_headers || a.headers;
//           if (h) for (var g in h) u.setRequestHeader(g, h[g]);
//           return u.send(f), i.promise;
//         }),
//         (u.prototype.__requestWindVane = function (e) {
//           function n(e) {
//             (s.results = [e]), r.resolve();
//           }
//           var r = o(),
//             i = this.params,
//             s = this.options,
//             a = i.data,
//             p = i.api,
//             u = i.v,
//             c = s.postJSON ? 1 : 0,
//             d = s.getJSON || s.postJSON || s.getOriginalJSONP ? "originaljson" : "";
//           void 0 !== i.valueType && ("original" === i.valueType ? (d = "originaljson") : "string" === i.valueType && (d = "")),
//             !0 === s.useJsonpResultType && (d = "");
//           var l,
//             f,
//             m = "https" === location.protocol ? 1 : 0,
//             h = i.isSec || 0,
//             g = i.sessionOption || "AutoLoginOnly",
//             _ = i.ecode || 0,
//             v = i.ext_headers || {},
//             y = i.ext_querys || {};
//           (l = 2 * (f = void 0 !== i.timer ? parseInt(i.timer) : void 0 !== i.timeout ? parseInt(i.timeout) : 2e4)),
//             !0 === i.needLogin && void 0 === i.sessionOption && (g = "AutoLoginAndManualLogin"),
//             void 0 !== i.secType && void 0 === i.isSec && (h = i.secType);
//           var w = {
//             api: p,
//             v: u,
//             post: String(c),
//             type: d,
//             isHttps: String(m),
//             ecode: String(_),
//             isSec: String(h),
//             param: JSON.parse(a),
//             timer: f,
//             sessionOption: g,
//             ext_headers: v,
//             ext_querys: y,
//           };
//           return (
//             i.ttid && !0 === s.dangerouslySetWVTtid && (w.ttid = i.ttid),
//             Object.assign && i.dangerouslySetWindvaneParams && Object.assign(w, i.dangerouslySetWindvaneParams),
//             t.windvane.call("MtopWVPlugin", "send", w, n, n, l),
//             r.promise
//           );
//         }),
//         (u.prototype.__requestAlipay = function (t) {
//           var n = o(),
//             r = this.params,
//             s = this.options,
//             a = {
//               apiName: r.api,
//               apiVersion: r.v,
//               needEcodeSign: "1" === String(r.ecode),
//               usePost: !!s.postJSON,
//             };
//           return (
//             i(r.data) || (r.data = JSON.parse(r.data)),
//             (a.data = r.data),
//             r.ttid && !0 === s.dangerouslySetWVTtid && (a.ttid = r.ttid),
//             (s.getJSON || s.postJSON || s.getOriginalJSONP) && (a.type = "originaljson"),
//             void 0 !== r.valueType && ("original" === r.valueType ? (a.type = "originaljson") : "string" === r.valueType && delete a.type),
//             !0 === s.useJsonpResultType && delete a.type,
//             Object.assign && r.dangerouslySetAlipayParams && Object.assign(a, r.dangerouslySetAlipayParams),
//             e.AlipayJSBridge.call("mtop", a, function (e) {
//               (s.results = [e]), n.resolve();
//             }),
//             n.promise
//           );
//         }),
//         (u.prototype.__processRequest = function (e, t) {
//           var o = this;
//           return d
//             .then(function () {
//               var e = o.options;
//               if (e.H5Request && (e.getJSONP || e.getOriginalJSONP)) return o.__requestJSONP(t);
//               if (e.H5Request && (e.getJSON || e.postJSON)) return o.__requestJSON(t);
//               if (e.WindVaneRequest) return g ? o.__requestAlipay(t) : o.__requestWindVane(t);
//               throw new Error("UNEXCEPT_REQUEST::错误的请求类型");
//             })
//             .then(e)
//             .then(function () {
//               var e = o.options,
//                 t = (o.params, e.results[0]),
//                 n = (t && t.ret) || [];
//               (t.ret = n), n instanceof Array && (n = n.join(","));
//               var r = t.c;
//               e.CDR &&
//                 r &&
//                 (function (e, t, o) {
//                   var n = o || {};
//                   document.cookie =
//                     e
//                       .replace(/[^+#$&^`|]/g, encodeURIComponent)
//                       .replace("(", "%28")
//                       .replace(")", "%29") +
//                     "=" +
//                     t.replace(/[^+#$&\/:<-\[\]-}]/g, encodeURIComponent) +
//                     (n.domain ? ";domain=" + n.domain : "") +
//                     (n.path ? ";path=" + n.path : "") +
//                     (n.secure ? ";secure" : "") +
//                     (n.httponly ? ";HttpOnly" : "");
//                 })(v, r, {
//                   domain: e.pageDomain,
//                   path: "/",
//                 }),
//                 n.indexOf("SUCCESS") > -1 ? (t.retType = m.SUCCESS) : (t.retType = m.ERROR),
//                 (e.retJson = t);
//             });
//         }),
//         (u.prototype.__sequence = function (e) {
//           var t = this,
//             n = [],
//             r = [];
//           e.forEach(function e(i) {
//             if (i instanceof Array) i.forEach(e);
//             else {
//               var s,
//                 a = o(),
//                 p = o();
//               n.push(function () {
//                 return (
//                   (a = o()),
//                   (s = i.call(
//                     t,
//                     function (e) {
//                       return a.resolve(e), p.promise;
//                     },
//                     function (e) {
//                       return a.reject(e), p.promise;
//                     }
//                   )) &&
//                     (s = s.catch(function (e) {
//                       a.reject(e);
//                     })),
//                   a.promise
//                 );
//               }),
//                 r.push(function (e) {
//                   return p.resolve(e), s;
//                 });
//             }
//           });
//           for (var i, s = d; (i = n.shift()); ) s = s.then(i);
//           for (; (i = r.pop()); ) s = s.then(i);
//           return s;
//         });
//       var R = function (e) {
//           e();
//         },
//         S = function (e) {
//           e();
//         };
//       (u.prototype.request = function (o) {
//         var r = this;
//         if (((this.options = n(o || {}, l)), !c)) {
//           var i = "当前浏览器不支持Promise，请在windows对象上挂载Promise对象";
//           throw (
//             ((t.mtop = {
//               ERROR: i,
//             }),
//             new Error(i))
//           );
//         }
//         var s = c
//           .resolve([R, S])
//           .then(function (e) {
//             var t = e[0],
//               o = e[1];
//             return r.__sequence([
//               t,
//               r.__processRequestMethod,
//               r.__processRequestType,
//               r.__processToken,
//               r.__processRequestUrl,
//               r.middlewares,
//               r.__processRequest,
//               o,
//             ]);
//           })
//           .then(function () {
//             var e = r.options.retJson;
//             return e.retType !== m.SUCCESS ? c.reject(e) : r.options.successCallback ? void r.options.successCallback(e) : c.resolve(e);
//           })
//           .catch(function (e) {
//             var o;
//             return (
//               e instanceof Error
//                 ? (console.error(e.stack),
//                   (o = {
//                     ret: [e.message],
//                     stack: [e.stack],
//                     retJson: m.ERROR,
//                   }))
//                 : (o =
//                     "string" == typeof e
//                       ? {
//                           ret: [e],
//                           retJson: m.ERROR,
//                         }
//                       : void 0 !== e
//                       ? e
//                       : r.options.retJson),
//               t.mtop.errorListener &&
//                 t.mtop.errorListener({
//                   api: r.params.api,
//                   v: r.params.v,
//                   retJson: o,
//                 }),
//               r.options.failureCallback ? void r.options.failureCallback(o) : c.reject(o)
//             );
//           });
//         return (
//           this.__processRequestType(),
//           r.options.H5Request &&
//             (r.constructor.__firstProcessor || (r.constructor.__firstProcessor = s),
//             (R = function (e) {
//               r.constructor.__firstProcessor.then(e).catch(e);
//             })),
//           (("get" === this.params.type && "json" === this.params.dataType) || "post" === this.params.type) &&
//             ((o.pageDomain =
//               o.pageDomain ||
//               (function (e) {
//                 try {
//                   return ".com" !== e.substring(e.lastIndexOf("."))
//                     ? (e.split(".") || []).length <= 3
//                       ? e
//                       : e.split(".").slice(1).join(".")
//                     : e.substring(e.lastIndexOf(".", e.lastIndexOf(".") - 1) + 1);
//                 } catch (t) {
//                   return e.substring(e.lastIndexOf(".", e.lastIndexOf(".") - 1) + 1);
//                 }
//               })(e.location.hostname)),
//             o.mainDomain !== o.pageDomain && ((o.maxRetryTimes = 4), (o.CDR = !0))),
//           (this.__requestProcessor = s),
//           s
//         );
//       }),
//         (t.mtop = function (e) {
//           return new u(e);
//         }),
//         (t.mtop.request = function (e, t, o) {
//           var n = {
//             H5Request: e.H5Request,
//             WindVaneRequest: e.WindVaneRequest,
//             LoginRequest: e.LoginRequest,
//             AntiCreep: e.AntiCreep,
//             AntiFlood: e.AntiFlood,
//             successCallback: t,
//             failureCallback: o || t,
//           };
//           return new u(e).request(n);
//         }),
//         (t.mtop.H5Request = function (e, t, o) {
//           var n = {
//             H5Request: !0,
//             successCallback: t,
//             failureCallback: o || t,
//           };
//           return new u(e).request(n);
//         }),
//         (t.mtop.middlewares = f),
//         (t.mtop.config = l),
//         (t.mtop.RESPONSE_TYPE = m),
//         (t.mtop.CLASS = u);
//     })(window, window.lib || (window.lib = {})),
//     (function (e, t) {
//       function o(e) {
//         return e.preventDefault(), !1;
//       }
//       function n(t, n) {
//         var r = this,
//           i = e.dpr || 1,
//           s = document.createElement("div"),
//           a = document.documentElement.getBoundingClientRect(),
//           p = Math.max(a.width, window.innerWidth) / i,
//           u = Math.max(a.height, window.innerHeight) / i;
//         s.style.cssText = [
//           "-webkit-transform:scale(" + i + ") translateZ(0)",
//           "-ms-transform:scale(" + i + ") translateZ(0)",
//           "transform:scale(" + i + ") translateZ(0)",
//           "-webkit-transform-origin:0 0",
//           "-ms-transform-origin:0 0",
//           "transform-origin:0 0",
//           "width:" + p + "px",
//           "height:" + u + "px",
//           "z-index:999999",
//           "position:" + (p > 800 ? "fixed" : "absolute"),
//           "left:0",
//           "top:0px",
//           "background:" + (p > 800 ? "rgba(0,0,0,.5)" : "#FFF"),
//           "display:none",
//         ].join(";");
//         var c = document.createElement("div");
//         (c.style.cssText = [
//           "width:100%",
//           "height:52px",
//           "background:#EEE",
//           "line-height:52px",
//           "text-align:left",
//           "box-sizing:border-box",
//           "padding-left:20px",
//           "position:absolute",
//           "left:0",
//           "top:0",
//           "font-size:16px",
//           "font-weight:bold",
//           "color:#333",
//         ].join(";")),
//           (c.innerText = t);
//         var d = document.createElement("a");
//         (d.style.cssText = ["display:block", "position:absolute", "right:0", "top:0", "height:52px", "line-height:52px", "padding:0 20px", "color:#999"].join(
//           ";"
//         )),
//           (d.innerText = "关闭");
//         var l = document.createElement("iframe");
//         (l.style.cssText = ["width:100%", "height:100%", "border:0", "overflow:hidden"].join(";")),
//           p > 800 &&
//             ((c.style.cssText = [
//               "width:370px",
//               "height:52px",
//               "background:#EEE",
//               "line-height:52px",
//               "text-align:left",
//               "box-sizing:border-box",
//               "padding-left:20px",
//               "position:absolute",
//               "left:" + (p / 2 - 185) + "px",
//               "top:40px",
//               "font-size:16px",
//               "font-weight:bold",
//               "color:#333",
//             ].join(";")),
//             (l.style.cssText = [
//               "position:absolute",
//               "top:92px",
//               "left:" + (p / 2 - 185) + "px",
//               "width:370px",
//               "height:480px",
//               "border:0",
//               "background:#FFF",
//               "overflow:hidden",
//             ].join(";"))),
//           c.appendChild(d),
//           s.appendChild(c),
//           s.appendChild(l),
//           (s.className = "J_MIDDLEWARE_FRAME_WIDGET"),
//           document.body.appendChild(s),
//           (l.src = n),
//           d.addEventListener(
//             "click",
//             function () {
//               r.hide();
//               var e = document.createEvent("HTMLEvents");
//               e.initEvent("close", !1, !1), s.dispatchEvent(e);
//             },
//             !1
//           ),
//           (this.addEventListener = function () {
//             s.addEventListener.apply(s, arguments);
//           }),
//           (this.removeEventListener = function () {
//             s.removeEventListener.apply(s, arguments);
//           }),
//           (this.show = function () {
//             document.addEventListener("touchmove", o, !1), (s.style.display = "block"), window.scrollTo(0, 0);
//           }),
//           (this.hide = function () {
//             document.removeEventListener("touchmove", o), window.scrollTo(0, -a.top), s.parentNode && s.parentNode.removeChild(s);
//           });
//       }
//       if (!t || !t.mtop || t.mtop.ERROR) throw new Error("Mtop 初始化失败！");
//       var r = e.Promise,
//         i = t.mtop.CLASS,
//         s = t.mtop.config,
//         a = t.mtop.RESPONSE_TYPE;
//       t.mtop.middlewares.push(function (e) {
//         var o = this,
//           n = this.options,
//           r = this.params;
//         console.log("test", this.options);
//         console.log("test3", this.params); //여기서 data값을 body로 가져와야함 (이스케이프 때문)

//         return e().then(function () {
//           var e = n.retJson,
//             i = e.ret,
//             p = navigator.userAgent.toLowerCase(),
//             u = p.indexOf("safari") > -1 && p.indexOf("chrome") < 0 && p.indexOf("qqbrowser") < 0;
//           if (
//             (i instanceof Array && (i = i.join(",")),
//             (i.indexOf("SESSION_EXPIRED") > -1 || i.indexOf("SID_INVALID") > -1 || i.indexOf("AUTH_REJECT") > -1 || i.indexOf("NEED_LOGIN") > -1) &&
//               ((e.retType = a.SESSION_EXPIRED), !n.WindVaneRequest && (!0 === s.LoginRequest || !0 === n.LoginRequest || !0 === r.needLogin)))
//           ) {
//             if (!t.login) throw new Error("LOGIN_NOT_FOUND::缺少lib.login");
//             if (!0 !== n.safariGoLogin || !u || "taobao.com" === n.pageDomain)
//               return t.login
//                 .goLoginAsync()
//                 .then(function (e) {
//                   return o.__sequence([o.__processToken, o.__processRequestUrl, o.__processUnitPrefix, o.middlewares, o.__processRequest]);
//                 })
//                 .catch(function (e) {
//                   throw "CANCEL" === e ? new Error("LOGIN_CANCEL::用户取消登录") : new Error("LOGIN_FAILURE::用户登录失败");
//                 });
//             t.login.goLogin();
//           }
//         });
//       }),
//         (t.mtop.loginRequest = function (e, t, o) {
//           var n = {
//             LoginRequest: !0,
//             H5Request: !0,
//             successCallback: t,
//             failureCallback: o || t,
//           };
//           return new i(e).request(n);
//         }),
//         (t.mtop.antiFloodRequest = function (e, t, o) {
//           var n = {
//             AntiFlood: !0,
//             successCallback: t,
//             failureCallback: o || t,
//           };
//           return new i(e).request(n);
//         }),
//         t.mtop.middlewares.push(function (e) {
//           var t = this.options;
//           return (
//             this.params,
//             !0 !== t.H5Request || (!0 !== s.AntiFlood && !0 !== t.AntiFlood)
//               ? void e()
//               : e().then(function () {
//                   var e = t.retJson,
//                     o = e.ret;
//                   o instanceof Array && (o = o.join(",")),
//                     o.indexOf("FAIL_SYS_USER_VALIDATE") > -1 &&
//                       e.data.url &&
//                       (t.AntiFloodReferer
//                         ? (location.href = e.data.url.replace(/(http_referer=).+/, "$1" + t.AntiFloodReferer))
//                         : (location.href = e.data.url));
//                 })
//           );
//         }),
//         (t.mtop.antiCreepRequest = function (e, t, o) {
//           var n = {
//             AntiCreep: !0,
//             successCallback: t,
//             failureCallback: o || t,
//           };
//           return new i(e).request(n);
//         }),
//         t.mtop.middlewares.push(function (t) {
//           var o = this,
//             i = this.options,
//             a = this.params;
//           console.log("test", this.options);

//           return (
//             !1 !== i.AntiCreep && (i.AntiCreep = !0),
//             (!0 !== a.forceAntiCreep && !0 !== i.H5Request) || (!0 !== s.AntiCreep && !0 !== i.AntiCreep)
//               ? void t()
//               : t().then(function () {
//                   var t = i.retJson,
//                     s = t.ret;
//                   if ((s instanceof Array && (s = s.join(",")), (s.indexOf("RGV587_ERROR::SM") > -1 || s.indexOf("ASSIST_FLAG") > -1) && t.data.url)) {
//                     var p = "_m_h5_smt",
//                       u = (function (e) {
//                         var t = new RegExp("(?:^|;\\s*)" + e + "\\=([^;]+)(?:;\\s*|$)").exec(document.cookie);
//                         return t ? t[1] : void 0;
//                       })(p),
//                       c = !1;
//                     if (!0 === i.saveAntiCreepToken && u) for (var d in (u = JSON.parse(u))) a[d] && (c = !0);
//                     if (!0 === i.saveAntiCreepToken && u && !c) {
//                       for (var d in u) a[d] = u[d];
//                       return o.__sequence([o.__processToken, o.__processRequestUrl, o.__processUnitPrefix, o.middlewares, o.__processRequest]);
//                     }
//                     return new r(function (r, s) {
//                       function u() {
//                         d.removeEventListener("close", u), e.removeEventListener("message", c), s("USER_INPUT_CANCEL::用户取消输入");
//                       }
//                       function c(t) {
//                         var n;
//                         try {
//                           n = JSON.parse(t.data) || {};
//                         } catch (e) {}
//                         if (n && "child" === n.type) {
//                           var l;
//                           d.removeEventListener("close", u), e.removeEventListener("message", c), d.hide();
//                           try {
//                             for (var f in ("string" == typeof (l = JSON.parse(decodeURIComponent(n.content))) && (l = JSON.parse(l)), l)) a[f] = l[f];
//                             !0 === i.saveAntiCreepToken
//                               ? ((document.cookie = p + "=" + JSON.stringify(l) + ";"), e.location.reload())
//                               : o.__sequence([o.__processToken, o.__processRequestUrl, o.__processUnitPrefix, o.middlewares, o.__processRequest]).then(r);
//                           } catch (e) {
//                             s("USER_INPUT_FAILURE::用户输入失败");
//                           }
//                         }
//                       }
//                       var d = new n("", t.data.url);
//                       d.addEventListener("close", u, !1), e.addEventListener("message", c, !1), d.show();
//                     });
//                   }
//                 })
//           );
//         });
//     })(window, window.lib || (window.lib = {})),
//     (e.exports = window.lib.mtop);
// })();

//mtop.js express network 내용중 n.H5Request 또는 2147483648 하위 항목중 특정 function 안의 내용 복사 해당 function이름은 암호화 되어서 md5Customized라고 적혀있지 않음
function md5Customized(e) {
	function t(e, t) {
		return (e << t) | (e >>> (32 - t));
	}
	function o(e, t) {
		var o, n, r, i, s;
		return (
			(r = 2147483648 & e),
			(i = 2147483648 & t),
			(s = (1073741823 & e) + (1073741823 & t)),
			(o = 1073741824 & e) & (n = 1073741824 & t)
				? 2147483648 ^ s ^ r ^ i
				: o | n
					? 1073741824 & s
						? 3221225472 ^ s ^ r ^ i
						: 1073741824 ^ s ^ r ^ i
					: s ^ r ^ i
		);
	}
	function n(e, n, r, i, s, a, p) {
		return (
			(e = o(
				e,
				o(
					o(
						(function (e, t, o) {
							return (e & t) | (~e & o);
						})(n, r, i),
						s,
					),
					p,
				),
			)),
			o(t(e, a), n)
		);
	}
	function r(e, n, r, i, s, a, p) {
		return (
			(e = o(
				e,
				o(
					o(
						(function (e, t, o) {
							return (e & o) | (t & ~o);
						})(n, r, i),
						s,
					),
					p,
				),
			)),
			o(t(e, a), n)
		);
	}
	function i(e, n, r, i, s, a, p) {
		return (
			(e = o(
				e,
				o(
					o(
						(function (e, t, o) {
							return e ^ t ^ o;
						})(n, r, i),
						s,
					),
					p,
				),
			)),
			o(t(e, a), n)
		);
	}
	function s(e, n, r, i, s, a, p) {
		return (
			(e = o(
				e,
				o(
					o(
						(function (e, t, o) {
							return t ^ (e | ~o);
						})(n, r, i),
						s,
					),
					p,
				),
			)),
			o(t(e, a), n)
		);
	}
	function a(e) {
		var t,
			o = '',
			n = '';
		for (t = 0; 3 >= t; t++) o += (n = '0' + ((e >>> (8 * t)) & 255).toString(16)).substr(n.length - 2, 2);
		return o;
	}
	var p, u, c, d, l, f, m, h, g, _;
	for (
		_ = (function (e) {
			for (
				var t, o = e.length, n = o + 8, r = 16 * ((n - (n % 64)) / 64 + 1), i = new Array(r - 1), s = 0, a = 0;
				o > a;

			)
				(s = (a % 4) * 8), (i[(t = (a - (a % 4)) / 4)] = i[t] | (e.charCodeAt(a) << s)), a++;
			return (
				(s = (a % 4) * 8),
				(i[(t = (a - (a % 4)) / 4)] = i[t] | (128 << s)),
				(i[r - 2] = o << 3),
				(i[r - 1] = o >>> 29),
				i
			);
		})(
			(e = (function (e) {
				e = e.replace(/\r\n/g, '\n');
				for (var t = '', o = 0; o < e.length; o++) {
					var n = e.charCodeAt(o);
					128 > n
						? (t += String.fromCharCode(n))
						: n > 127 && 2048 > n
							? ((t += String.fromCharCode((n >> 6) | 192)), (t += String.fromCharCode((63 & n) | 128)))
							: ((t += String.fromCharCode((n >> 12) | 224)),
								(t += String.fromCharCode(((n >> 6) & 63) | 128)),
								(t += String.fromCharCode((63 & n) | 128)));
				}
				return t;
			})(e)),
		),
			f = 1732584193,
			m = 4023233417,
			h = 2562383102,
			g = 271733878,
			p = 0;
		p < _.length;
		p += 16
	)
		(u = f),
			(c = m),
			(d = h),
			(l = g),
			(f = n(f, m, h, g, _[p + 0], 7, 3614090360)),
			(g = n(g, f, m, h, _[p + 1], 12, 3905402710)),
			(h = n(h, g, f, m, _[p + 2], 17, 606105819)),
			(m = n(m, h, g, f, _[p + 3], 22, 3250441966)),
			(f = n(f, m, h, g, _[p + 4], 7, 4118548399)),
			(g = n(g, f, m, h, _[p + 5], 12, 1200080426)),
			(h = n(h, g, f, m, _[p + 6], 17, 2821735955)),
			(m = n(m, h, g, f, _[p + 7], 22, 4249261313)),
			(f = n(f, m, h, g, _[p + 8], 7, 1770035416)),
			(g = n(g, f, m, h, _[p + 9], 12, 2336552879)),
			(h = n(h, g, f, m, _[p + 10], 17, 4294925233)),
			(m = n(m, h, g, f, _[p + 11], 22, 2304563134)),
			(f = n(f, m, h, g, _[p + 12], 7, 1804603682)),
			(g = n(g, f, m, h, _[p + 13], 12, 4254626195)),
			(h = n(h, g, f, m, _[p + 14], 17, 2792965006)),
			(f = r(f, (m = n(m, h, g, f, _[p + 15], 22, 1236535329)), h, g, _[p + 1], 5, 4129170786)),
			(g = r(g, f, m, h, _[p + 6], 9, 3225465664)),
			(h = r(h, g, f, m, _[p + 11], 14, 643717713)),
			(m = r(m, h, g, f, _[p + 0], 20, 3921069994)),
			(f = r(f, m, h, g, _[p + 5], 5, 3593408605)),
			(g = r(g, f, m, h, _[p + 10], 9, 38016083)),
			(h = r(h, g, f, m, _[p + 15], 14, 3634488961)),
			(m = r(m, h, g, f, _[p + 4], 20, 3889429448)),
			(f = r(f, m, h, g, _[p + 9], 5, 568446438)),
			(g = r(g, f, m, h, _[p + 14], 9, 3275163606)),
			(h = r(h, g, f, m, _[p + 3], 14, 4107603335)),
			(m = r(m, h, g, f, _[p + 8], 20, 1163531501)),
			(f = r(f, m, h, g, _[p + 13], 5, 2850285829)),
			(g = r(g, f, m, h, _[p + 2], 9, 4243563512)),
			(h = r(h, g, f, m, _[p + 7], 14, 1735328473)),
			(f = i(f, (m = r(m, h, g, f, _[p + 12], 20, 2368359562)), h, g, _[p + 5], 4, 4294588738)),
			(g = i(g, f, m, h, _[p + 8], 11, 2272392833)),
			(h = i(h, g, f, m, _[p + 11], 16, 1839030562)),
			(m = i(m, h, g, f, _[p + 14], 23, 4259657740)),
			(f = i(f, m, h, g, _[p + 1], 4, 2763975236)),
			(g = i(g, f, m, h, _[p + 4], 11, 1272893353)),
			(h = i(h, g, f, m, _[p + 7], 16, 4139469664)),
			(m = i(m, h, g, f, _[p + 10], 23, 3200236656)),
			(f = i(f, m, h, g, _[p + 13], 4, 681279174)),
			(g = i(g, f, m, h, _[p + 0], 11, 3936430074)),
			(h = i(h, g, f, m, _[p + 3], 16, 3572445317)),
			(m = i(m, h, g, f, _[p + 6], 23, 76029189)),
			(f = i(f, m, h, g, _[p + 9], 4, 3654602809)),
			(g = i(g, f, m, h, _[p + 12], 11, 3873151461)),
			(h = i(h, g, f, m, _[p + 15], 16, 530742520)),
			(f = s(f, (m = i(m, h, g, f, _[p + 2], 23, 3299628645)), h, g, _[p + 0], 6, 4096336452)),
			(g = s(g, f, m, h, _[p + 7], 10, 1126891415)),
			(h = s(h, g, f, m, _[p + 14], 15, 2878612391)),
			(m = s(m, h, g, f, _[p + 5], 21, 4237533241)),
			(f = s(f, m, h, g, _[p + 12], 6, 1700485571)),
			(g = s(g, f, m, h, _[p + 3], 10, 2399980690)),
			(h = s(h, g, f, m, _[p + 10], 15, 4293915773)),
			(m = s(m, h, g, f, _[p + 1], 21, 2240044497)),
			(f = s(f, m, h, g, _[p + 8], 6, 1873313359)),
			(g = s(g, f, m, h, _[p + 15], 10, 4264355552)),
			(h = s(h, g, f, m, _[p + 6], 15, 2734768916)),
			(m = s(m, h, g, f, _[p + 13], 21, 1309151649)),
			(f = s(f, m, h, g, _[p + 4], 6, 4149444226)),
			(g = s(g, f, m, h, _[p + 11], 10, 3174756917)),
			(h = s(h, g, f, m, _[p + 2], 15, 718787259)),
			(m = s(m, h, g, f, _[p + 9], 21, 3951481745)),
			(f = o(f, u)),
			(m = o(m, c)),
			(h = o(h, d)),
			(g = o(g, l));
	return (a(f) + a(m) + a(h) + a(g)).toLowerCase();
}

// 브라우저 쿠키정보 가져오기
function getCookie(cookieName) {
	let cookieValue = '';

	if (document.cookie) {
		let array = document.cookie.split(escape(cookieName) + '=');

		if (array.length >= 2) {
			let arraySub = array[1].split(';');

			cookieValue = unescape(arraySub[0]);
		}
	}

	return cookieValue;
}

// AJAX Content-Type가 application/x-www-form-urlencoded인 경우, JSON Object를 Encode하는 과정이 필요함
function urlEncodedObject(urlEncodedData) {
	let urlEncodedContent = [];

	for (let property in urlEncodedData) {
		let encodedKey = encodeURIComponent(property);
		let encodedValue = encodeURIComponent(urlEncodedData[property]);

		urlEncodedContent.push(encodedKey + '=' + encodedValue);
	}

	return urlEncodedContent.join('&');
}

// XHR Request (응답 데이터 문자열 형식)
function request(url, opts) {
	// 지연 응답에 따른 Promise 처리
	return new Promise(function (resolve, reject) {
		// 자바스크립트 내장 객체로 생성
		let xhr = new XMLHttpRequest();

		// 새로운 요청 생성
		xhr.open(opts.method, url);

		// 쿠키 값을 그대로 유지할 것인지
		xhr.withCredentials = true;

		// 헤더 정보가 명시되어 있다면 객체를 순회하면서 헤더 정보를 설정
		if (opts.headers) {
			Object.keys(opts.headers).map((v) => {
				xhr.setRequestHeader(v, opts.headers[v]);
			});
		}

		// fetch.then() (응답 데이터가 존재하는 경우)
		xhr.onload = function () {
			resolve(xhr.response);
		};

		// fetch.catch() (응답 데이터가 존재하지 않을 경우)
		xhr.onerror = function () {
			reject({
				status: this.status,
				statusText: xhr.statusText,
				data: 'rejected',
			});
		};

		// send 메서드는 fetch(url)과 동일한 기능
		xhr.send(opts.body);
	});
}

// 알리익스프레스 배송비 크롤링
async function getShippingInfo(productId, minPrice, maxPrice, ext) {
	// ext 값의 escape 맞춰주기 위한 작업
	const ext2 = JSON.stringify(ext);

	//application > 쿠키 > https://ko.aliexpress.com 클릭 후 tk 검색
	const token = getCookie('_m_h5_tk');

	const time = new Date().getTime();

	// 고정값
	const appKey = '12574478';

	// escape 문법에 주의 (Object Property가 문자열 형태로 암호화에 사용되므로 규격을 반드시 확인)
	const body = {
		data: `{\"productId\":\"${productId}\",\"country\":\"KR\",\"lang\":\"ko_KR\",\"locale\":\"ko_KR\",\"_lang\":\"ko_KR\",\"minPrice\":${minPrice},\"maxPrice\":${maxPrice},\"tradeCurrency\":\"KRW\",\"_currency\":\"KRW\",\"quantity\":1,\"clientType\":\"pc\",\"userScene\":\"PC_DETAIL_SHIPPING_PANEL\",\"ext\":${ext2}}`,
	};

	// 암호화된 해시 생성
	const sign = md5Customized(`${token.split('_')[0]}&${time}&${appKey}&${body.data}`);

	// 알리익스프레스 배송비 목록 API (URL 변경될 가능성 있음)
	const dataResp = await request(
		`https://acs.aliexpress.com/h5/mtop.aliexpress.itemdetail.queryexpression/1.0/?jsv=2.5.1&appKey=${appKey}&t=${time}&sign=${sign}&api=mtop.aliexpress.itemdetail.queryExpression&v=1.0&type=originaljson&dataType=jsonp`,
		{
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
			},

			body: urlEncodedObject(body),
			method: 'POST',
		},
	);

	// 이전에 fetch로 쐈을 때 흔적
	// const dataJson = await dataResp.json();

	// XHR 요청은 응답이 문자열 형식이므로 파싱 과정 필요
	const dataJson = JSON.parse(dataResp);

	// 데이터 정상 수신 여부 확인
	console.log('shipdata', dataJson);

	return dataJson.data.data.deliveryExpressionResponse;
}

// 알리익스프레스 페이지 삽입 스크립트
async function main() {
	// 데이터가 로드될 때까지 루프를 반복함
	while (true) {
		try {
			let json = {};

			//알리의 모든 페이지 정보에서 itemScene과 관련된 곳에서 ext를 찾음
			console.log('페이지정보', window.runParams.data);

			if (!window._dida_config_) {
				if (!window.runParams.data.abTestComponent) {
					json = {
						pageType: 1,
						shippingModule: window.runParams.data.shippingModule,
						commonModule: window.runParams.data.commonModule,
						descriptionModule: window.runParams.data.descriptionModule,
						imageModule: window.runParams.data.imageModule,
						priceModule: window.runParams.data.priceModule,
						skuModule: window.runParams.data.skuModule,
						titleModule: window.runParams.data.titleModule,
						specsModule: window.runParams.data.specsModule,
					};
				} else {
					//여기부턴 구조가 아예다르네 ..^^
					json = {
						pageType: 3,
						shippingModule: window.runParams.data.i18nComponent.i18nMap.ShippingModule, //일단...
						commonModule: window.runParams.data.productInfoComponent, // productid만 일단 매칭시켜둠, 카테고리도 여기있음;
						descriptionModule: window.runParams.data.productDescComponent, //descriptionUrl 만 있네 얘는 productId , sellerAdminSeq는 사라짐
						imageModule: window.runParams.data.imageComponent, //얘는 비슷하게있네
						priceModule: window.runParams.data.priceComponent, //얘는 여기에 sku도 있고 꽤 많이있음 . -> discountPrice , skuJson,skuPriceList
						skuModule: window.runParams.data.skuComponent, //얘는 i18nMap 과 skumodule의 위치가 다름 type 1에선 depth가 반대인데 얜 뭐다있노;
						titleModule: window.runParams.data.i18nComponent.i18nMap.TitleModule, //일단..
						specsModule: window.runParams.data.productPropComponent, //일단....
					};
				}
			} else {
				json = {
					pageType: 2,
					shippingModule: window._dida_config_._init_data_.data.data.shipping_2262.fields,
					commonModule: window._dida_config_._init_data_.data.data.actionButtons_2260.fields,
					descriptionModule: window._dida_config_._init_data_.data.data.description_2253.fields,
					imageModule: window._dida_config_._init_data_.data.data.imageView_2247.fields,
					priceModule: window._dida_config_._init_data_.data.data.price_2256.fields,
					skuModule: window._dida_config_._init_data_.data.data.sku_2257.fields,
					titleModule: window._dida_config_._init_data_.data.data.titleBanner_2440.fields,
					specsModule: window._dida_config_._init_data_.data.data.specsInfo_2263.fields,
				};
			}

			if (
				json['shippingModule'] &&
				json['commonModule'] &&
				json['descriptionModule'] &&
				json['imageModule'] &&
				json['priceModule'] &&
				json['titleModule'] &&
				json['specsModule']
			) {
				if (json['pageType'] === 3) {
					const productId = json['commonModule'].id.toString();

					const minPrice = json['priceModule']['discountPrice'].hasOwnProperty('minActivityAmount')
						? json['priceModule']['discountPrice'].minActivityAmount.value
						: json['priceModule']['discountPrice'].minAmount.value;
					const maxPrice = json['priceModule']['discountPrice'].hasOwnProperty('maxActivityAmount')
						? json['priceModule']['discountPrice'].maxActivityAmount.value
						: json['priceModule']['discountPrice'].maxAmount.value;

					const extList = JSON.parse(json.priceModule.skuJson);
					const ext = extList.find((v) => v.skuVal.availQuantity !== 0)?.freightExt; //품절 아닌 임의의 옵션 ext 정보

					json['shippingModule']['generalFreightInfo'] = await getShippingInfo(productId, minPrice, maxPrice, ext); //bizdata
				} else if (json['pageType'] !== 3) {
					const productId = json['commonModule'].productId.toString();

					const minPrice = json['priceModule'].hasOwnProperty('minActivityAmount')
						? json['priceModule'].minActivityAmount.value
						: json['priceModule'].minAmount.value;
					const maxPrice = json['priceModule'].hasOwnProperty('maxActivityAmount')
						? json['priceModule'].maxActivityAmount.value
						: json['priceModule'].maxAmount.value;

					const ext = json.skuModule.skuPriceList.find((v) => v.skuVal.availQuantity !== 0)?.freightExt; // 품절 아닌 임의의 옵션의 ext 정보

					json['shippingModule']['generalFreightInfo'] = await getShippingInfo(productId, minPrice, maxPrice, ext); //bizdata
				}

				sessionStorage.setItem('sfy-express-item', JSON.stringify(json));

				break;
			}
			await new Promise((resolve) => setTimeout(resolve, 1000));
		} catch (e) {
			console.log(e);

			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}
}

main();
