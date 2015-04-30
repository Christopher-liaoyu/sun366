define("cobble/function/jquerify", ["require", "exports", "module"],
function() {
    "use strict";
    function e(e) {
        return e.faker || e.element
    }
    var t = $.prototype,
    n = {
        on: function() {
            return t.on.apply(e(this), arguments),
            this
        },
        off: function() {
            return t.off.apply(e(this), arguments),
            this
        },
        emit: function(n, i) {
            var r = this,
            o = e(r);
            if (o) {
                if (!n[$.expando]) n = "string" === $.type(n) ? $.Event(n) : $.Event(null, n);
                n.cobble = r;
                var a = [n];
                if (i) a.push(i);
                var s = r[$.camelCase("on-" + n.type)];
                if ($.isFunction(s) && s.apply(r, a) === !1) n.preventDefault();
                if (!n.isPropagationStopped()) t.trigger.apply(o, a);
                return n
            }
        },
        before: function(t) {
            e(this).before(t)
        },
        after: function(t) {
            e(this).after(t)
        },
        appendTo: function(t) {
            e(this).appendTo(t)
        },
        prependTo: function(t) {
            e(this).prependTo(t)
        }
    };
    return function(e) {
        $.each(n,
        function(t, n) {
            if (null == e[t]) e[t] = n
        });
    }
}),
define("cobble/function/lifeCycle", ["require", "exports"],
function(require, exports) {
    "use strict";
    exports.init = function(e, t) {
        var n = e.constructor,
        i = "__cobble__" + n.prototype.type,
        r = t.element;
        if (r && r.data(i)) e = r.data(i);
        else if ($.extend(e, n.defaultOptions, t), e.init(), r) r.data(i, e);
        return e
    },
    exports.dispose = function(e) {
        var t = "__cobble__" + e.constructor.prototype.type,
        n = e.element;
        if (n) n.removeData(t)
    }
}),
define("cobble/form/Validator", ["require", "exports", "module", "../function/jquerify", "../function/lifeCycle"],
function(require) {
    "use strict";
    function e(e) {
        return r.init(this, e)
    }
    function t(e, t) {
        if (e.length > 0) {
            var n = e[0].element;
            if (n.is(":hidden")) n = n.parent();
            var i = n.offset().top;
            if (t > 0) i -= t;
            window.scrollTo(window.scrollX, i)
        }
    }
    function n(e) {
        var t = $.Deferred();
        return $.when.apply($, e).done(function() {
            t.resolve(arguments)
        }),
        t
    }
    var i = require("../function/jquerify"),
    r = require("../function/lifeCycle");
    e.prototype = {
        constructor: e,
        type: "Validator",
        init: function() {
            var e = this,
            t = e.element,
            n = "FORM" === t.prop("tagName") ? t: t.find("form");
            if (n.length > 0) n.attr("novalidate", "novalidate").on("submit" + o, $.proxy(e.validate, e));
            var i = e.groupSelector;
            if (t.on("focusin" + o,
            function(t) {
                var n = $(t.target).closest(i),
                r = [e.successClass, e.errorClass, e.requiredClass].join(" ");
                n.removeClass($.trim(r))
            }), e.realtime) t.on("focusout" + o,
            function(t) {
                var n = $(t.target),
                i = n.prop("name");
                if (!i) n = n.find("[name]"),
                i = n.prop("name");
                if (i) e.validate(i)
            })
        },
        validate: function(e, i) {
            var r = this,
            o = r.emit("beforeValidate");
            if (!o.isDefaultPrevented()) {
                var a, s = r.element,
                c = r.groupSelector;
                if ("string" === $.type(e)) e = [e];
                if ($.isArray(e)) a = $.map(e,
                function(e) {
                    return s.find('[name="' + e + '"]').closest(c)
                });
                else if (a = s.find(c), "boolean" === $.type(e)) i = e;
                var u = [],
                l = [];
                $.each(a,
                function(e, t) {
                    var n = r.validateGroup($(t));
                    if (n) {
                        if (n.promise) l.push(n),
                        n = n.data;
                        $.merge(u, n)
                    }
                });
                var e = [],
                d = [],
                f = function() {
                    if ($.each(u,
                    function(t, n) {
                        if (n.error) d.push(n);
                        e.push(n.element.prop("name"))
                    }), i) t(d, r.scrollGap);
                    r.emit("afterValidate", {
                        fields: e,
                        errors: d
                    })
                };
                if (l.length > 0) return n(l).done(f);
                else return f(),
                0 === d.length
            }
        },
        validateGroup: function(t) {
            if (t.is(":visible")) {
                var i = this,
                r = [],
                o = [],
                a = [];
                if (t.find("[name]").each(function(t) {
                    var n, s = this,
                    c = s.name,
                    u = $(s);
                    if (!s.disabled) {
                        var l, d = i.fields[c];
                        if (d) l = !0,
                        d = $.extend(!0, {},
                        d);
                        else l = !1,
                        d = {};
                        if (!d.type) d.type = u.attr("type") || "text";
                        d.form = i.element,
                        d.value = $.trim(s.value);
                        var f;
                        if ($.each(e.type[d.type] || [],
                        function(t, n) {
                            var i = e.attr[n](u, d);
                            if (i === !1) return f = n,
                            !1;
                            else if ("" === d.value && "required" === n) return ! 1
                        }), f && d.errors) {
                            if (n = d.errors[f], !n) throw new Error(c + " 字段 " + f + " 类型错误信息未定义")
                        } else {
                            var m = d.custom;
                            if ($.isFunction(m)) {
                                var p = $.Deferred(),
                                h = m(u,
                                function(e) {
                                    p.resolve(e)
                                });
                                n = null == h || h.done ? p: h
                            }
                        }
                    }
                    if (l) if (t = r.push({
                        element: u,
                        error: n
                    }), n && n.promise) o.push(n),
                    a.push(t - 1)
                }), o.length > 0) {
                    var s = n(o).done(function(e) {
                        $.each(e,
                        function(e, t) {
                            r[a[e]].error = t
                        }),
                        i.refreshGroup(t, r)
                    });
                    return s.data = r,
                    s
                } else return i.refreshGroup(t, r),
                r
            }
        },
        refreshGroup: function(e, t) {
            var n = this,
            i = n.successClass,
            r = n.errorClass;
            $.each(t,
            function(t, o) {
                var a = o.element,
                s = o.error;
                if (s && "string" === $.type(s)) {
                    e.removeClass(i).addClass(r);
                    var c = n.errorSelector;
                    if (c) {
                        var u = n.renderTemplate;
                        if ($.isFunction(u)) s = u({
                            text: s
                        },
                        n.errorTemplate);
                        var l = e.find(c).eq(t);
                        l.html(s);
                        var d = n.errorPlacement;
                        if ($.isFunction(d)) d(a, l)
                    }
                } else o.error = "",
                e.removeClass(r).addClass(i)
            })
        },
        dispose: function() {
            var e = this;
            r.dispose(e),
            e.element.off(o),
            e.element = null
        }
    },
    i(e.prototype),
    e.defaultOptions = {
        realtime: !1,
        scrollGap: 100,
        groupSelector: ".form-group",
        successClass: "has-success",
        errorClass: "has-error",
        errorSelector: ".error",
        errorTemplate: '<i class="icon icon-times-circle"></i>&nbsp;${text}',
        requiredClass: "has-required",
        requiredSelector: ".required",
        requiredTemplate: "${text}",
        renderTemplate: function(e, t) {
            return t.replace(/\${(\w+)}/g,
            function(t, n) {
                return e[n] || ""
            })
        },
        errorPlacement: function(e, t) {
            if ("hidden" === e.prop("type")) e = e.parent();
            t.css({
                position: "static",
                width: "auto"
            });
            var n = t.outerWidth(!0) + 5;
            t.css({
                position: "absolute",
                width: n
            });
            var i = e.parent();
            if (i.is(".placeholder-wrapper")) e = i;
            var r = e.position();
            t.css({
                left: r.left + e.outerWidth() - 37,
                top: r.top - t.outerHeight() + 8
            })
        }
    },
    e.type = {
        text: ["required", "pattern", "min", "max", "minlength", "maxlength"],
        hidden: ["required"],
        password: ["required", "pattern", "minlength", "maxlength", "equals"],
        number: ["required", "pattern", "min", "max", "step"],
        range: ["required", "pattern", "min", "max", "step"],
        tel: ["required", "pattern"],
        url: ["required", "pattern"],
        email: ["required", "pattern"],
        mobile: ["required", "pattern"],
        money: ["required", "pattern", "min", "max"],
        idcard: ["required", "pattern"],
        "int": ["required", "pattern", "min", "max"],
        internationalMobile: ["required", "pattern"]
    },
    e.attr = {
        required: function(e, t) {
            if (t.value.length > 0) return ! 0;
            else if ("required" === e.attr("required")) return ! 1
        },
        pattern: function(t, n) {
            var i = t.attr("pattern") || e.pattern[n.type];
            if ("string" === $.type(i)) i = new RegExp(i);
            if (i) return i.test(n.value);
            else return void 0
        },
        minlength: function(e, t) {
            var n = e.attr("minlength");
            if ($.isNumeric(n)) return t.value.length >= +n;
            else return void 0
        },
        maxlength: function(e, t) {
            var n = e.attr("maxlength");
            if ($.isNumeric(n)) return t.value.length <= +n;
            else return void 0
        },
        min: function(e, t) {
            var n = e.attr("min");
            if ($.isNumeric(n)) return t.value >= +n;
            else return void 0
        },
        max: function(e, t) {
            var n = e.attr("max");
            if ($.isNumeric(n)) return t.value <= +n;
            else return void 0
        },
        step: function(e, t) {
            var n = e.attr("min") || 1,
            i = e.attr("step");
            if ($.isNumeric(i)) return (t.value - n) % i === 0;
            else return void 0
        },
        equals: function(e, t) {
            var n = e.attr("equals");
            if (n) {
                var i = t.form.find('[name="' + n + '"]');
                return t.value === $.trim(i.val())
            }
        }
    },
    e.pattern = {
        number: /^[\d.]*$/,
        "int": /^\d+$/,
        url: /^(?:(?:0\d{2,3}[- ]?[1-9]\d{6,7})|(?:[48]00[- ]?[1-9]\d{6}))$/,
        tel: /^(?:(?:0\d{2,3}[- ]?[1-9]\d{6,7})|(?:[48]00[- ]?[1-9]\d{6}))$/,
        mobile: /^1[3-9]\d{9}$/,
        email: /^(?:[a-z0-9]+[_\-+.]+)*[a-z0-9]+@(?:([a-z0-9]+-?)*[a-z0-9]+.)+([a-z]{2,})+$/i,
        money: /^[\d.]*$/,
        idcard: /(^\d{15}$)|(^\d{17}([0-9]|X)$)/i,
        internationalMobile: /^\d{7,20}$/
    };
    var o = ".cobble_form_validator";
    return e
}),
define("cobble/function/init", ["require", "exports", "module"],
function() {
    "use strict";
    return function(e) {
        return function(t, n) {
            var i = [];
            return t.each(function() {
                i.push(new e($.extend({
                    element: $(this)
                },
                n)))
            }),
            i
        }
    }
}),
define("cobble/function/replaceWith", ["require"],
function() {
    "use strict";
    return function(e, t) {
        e = e[0],
        t = t[0],
        e.parentNode.replaceChild(t, e)
    }
}),
define("cobble/function/around", ["require", "exports", "module"],
function() {
    "use strict";
    return function(e, t, n, i) {
        var r = "string" === $.type(t),
        o = r ? e[t] : e;
        if (!r) i = n,
        n = t;
        var a = function() {
            var e, t = arguments;
            if ($.isFunction(n)) e = n.apply(this, t);
            if (e !== !1) {
                if ($.isFunction(o)) e = o.apply(this, t);
                if ($.isFunction(i)) {
                    var r = i.apply(this, t);
                    if ("undefined" !== $.type(r)) e = r
                }
                return e
            }
        };
        return r ? e[t] = a: a
    }
}),
define("cobble/util/input", ["require", "exports", "module", "../function/around"],
function(require, exports) {
    "use strict";
    function e() {}
    function t(e) {
        var t = e.val(),
        i = !1;
        e.on("propertychange" + o,
        function(n) {
            if (i) return void(i = !1);
            if ("value" === n.originalEvent.propertyName) {
                var r = e.val();
                if (r !== t) e.trigger("input"),
                t = r
            }
        }),
        n(e, "val",
        function() {
            if (0 !== arguments.length) i = !0
        })
    }
    var n = require("../function/around"),
    i = $('<input type="text" />')[0],
    r = "oninput" in i;
    i = null;
    var o = ".cobble_util_input";
    exports.init = r ? e: t,
    exports.dispose = function(e) {
        e.off(o)
    }
}),
define("cobble/helper/Placeholder", ["require", "exports", "module", "../function/init", "../function/jquerify", "../function/lifeCycle", "../function/replaceWith", "../util/input"],
function(require) {
    "use strict";
    function e(e) {
        return i.init(this, e)
    }
    var t = require("../function/init"),
    n = require("../function/jquerify"),
    i = require("../function/lifeCycle"),
    r = require("../function/replaceWith"),
    o = require("../util/input");
    e.prototype = {
        constructor: e,
        type: "Placeholder",
        init: function() {
            var e = this,
            t = e.element,
            n = t.attr("placeholder");
            if (null == e.value) e.value = n || "";
            var i;
            if (c) if (e.nativeFirst) i = "native";
            else if (n) t.removeAttr("placeholder");
            if (!i) i = e.simple ? "simple": "complex";
            if (i = u[i], $.extend(e, i), i.init) e.init();
            if (e.refresh) e.refresh()
        }
    },
    n(e.prototype),
    e.defaultOptions = {
        simple: !1,
        nativeFirst: !0,
        simpleClass: "placeholder-active",
        placeholderSelector: ".placeholder",
        template: '<div class="placeholder-wrapper"><div class="placeholder"></div></div>'
    },
    e.init = t(e);
    var a = ".cobble_helper_placeholder",
    s = $('<input type="text" />')[0],
    c = "placeholder" in s;
    s = null;
    var u = {
        "native": {
            show: $.noop,
            hide: $.noop,
            refresh: $.noop,
            dispose: function() {
                var e = this;
                i.dispose(e),
                e.element = null
            }
        },
        simple: {
            init: function() {
                var e = this,
                t = $.proxy(e.refresh, e);
                e.element.on("focus" + a, t).on("blur" + a, t)
            },
            show: function() {
                var e = this;
                e.element.addClass(e.simpleClass).val(e.value)
            },
            hide: function() {
                var e = this;
                e.element.removeClass(e.simpleClass).val("")
            },
            refresh: function() {
                var e = this,
                t = e.element;
                if (document.activeElement === t[0]) {
                    if (t.hasClass(e.simpleClass)) e.hide()
                } else if (!t.val()) e.show()
            },
            dispose: function() {
                var e = this;
                i.dispose(e),
                e.element.off(a),
                e.element = null
            }
        },
        complex: {
            init: function() {
                var e = this,
                t = e.element,
                n = $(e.template);
                r(t, n),
                n.append(t),
                e.faker = n.find(e.placeholderSelector);
                var i = $.proxy(e.refresh, e);
                o.init(t),
                t.on("focus" + a, i).on("blur" + a, i).on("input" + a, i)
            },
            show: function() {
                var e = this;
                e.faker.html(e.value).show()
            },
            hide: function() {
                this.faker.hide()
            },
            refresh: function() {
                var e = this,
                t = e.element.val();
                if ($.trim(t)) e.hide();
                else e.show()
            },
            dispose: function() {
                var e = this;
                i.dispose(e);
                var t = e.element;
                o.dispose(t),
                t.off(a),
                e.faker = e.element = null
            }
        }
    };
    return e
}),
define("cobble/util/url", ["require", "exports", "module"],
function(require, exports) {
    "use strict";
    exports.parseQuery = function(e) {
        var t = {};
        if ("string" === $.type(e) && e.length > 1) {
            var n = 0,
            i = e.charAt(0);
            if ("?" === i) n = 1;
            else if ("#" === i) {
                n = 1;
                var r = e.charAt(1);
                if ("/" === r) n = 2
            }
            if (n > 0) e = e.substr(n);
            $.each(e.split("&"),
            function(e, n) {
                var i = n.split("=");
                if (2 === i.length) {
                    var r = $.trim(i[0]);
                    if (r) t[r] = decodeURIComponent($.trim(i[1]))
                }
            })
        }
        return t
    },
    exports.getOrigin = function(e) {
        if (!e) e = document.URL;
        return exports.parse(e).origin
    },
    exports.parse = function(e) {
        var t = e.match(/^(http[s]?:\/\/[^/] + )(\ / [ ^ ?] + ) ? (\ ? . + ) ? /);return{origin:t[1]||"",pathname:t[2]||"",search:t[3]||""}}}),define("common/component / CodeButton ",["require "],function(){"use strict ";function e(e){$.extend(this,e),this.init()}return e.prototype={init:function(){var e=this,t=e.element;e.isCounting=!1,e.origin=t.html();var n=function(){t.prop("disabled ",!0);var n=e.send();if(n)n.done(function(n){if(0===n.code)e.countDown(60);else t.prop("disabled ",!1)});else t.prop("disabled ",!1)};if(e.container)e.container.on("click ",function(e){if(e.target===t[0])n()});else t.click(n)},countDown:function(e){var t=this,n=this.element;t.isCounting=!0;var i=function(e){if(n.html(e+"秒后再次发送"),$.isFunction(t.onTextChange))t.onTextChange()};n.prop("disabled ",!0),t.timer=setInterval(function(){if(e--,e>0)i(e);else{if(t.isCounting=!1,clearInterval(t.timer),n.html(t.origin),n.prop("disabled ",!1),$.isFunction(t.onTextChange))t.onTextChange();if($.isFunction(t.onFinish))t.onFinish()}},1e3),i(e)},dispose:function(){if(this.element.off(),this.timer)clearInterval(this.timer)}},e}),define("common / component / SaveButton ",["require "],function(){"use strict ";function e(e){$.extend(this,e),this.init()}return e.prototype={init:function(){var e=this,t=e.element,n=t.html();if("BUTTON "!==t.prop("tagName "))throw new Error("SaveButton必须使用button标签");var i=function(){var i=e.save();if(i)t.focus(),t.prop("disabled ",!0),t.html(e.saveText||"正在保存..."),i.done(function(){t.prop("disabled ",!1),t.html(n)});return!1};if(t.click(i),e.form)e.form.submit(function(){return i(),!1})}},e}),define("common / errorCode ",["require ","exports "],function(require,exports){"use strict ";exports[100001]="数据库连接错误",exports[100002]="数据库查询错误",exports[100003]="请求参数错误",exports[100004]="没找到对应的Action ",exports[100005]="没找到对应的Service ",exports[100006]="服务器调用错误",exports[100007]="数据库存储错误",exports[100008]="数据库更新支付类型错误",exports[100009]="未知的用户",exports[100010]="支付密码错误",exports[100011]="交易错误",exports[100012]="课程不存在",exports[100013]="课程订单不存在",exports[100014]="购买重复",exports[100015]="余额不足",exports[100016]="订单不存在",exports[100017]="金额错误",exports[100018]="用户不存在",exports[100019]="请求方法错误",exports[100020]="用户非法",exports[100021]="课时不足",exports[100022]="本周你已提现，一周只可提现一次",exports[100023]="认证的key失败",exports[100024]="预约时间错误",exports[100025]="数据库错误",exports[100026]="取消订单理由错误",exports[100027]="取消订单失败",exports[100028]="支付密码不能和登录密码相同",exports[100029]="没有权限访问",exports[100030]="优惠券不存在",exports[100031]="优惠券已被使用",exports[100032]="老师详情未找到",exports[100033]="此优惠券已过期",exports[100039]="班课已经开课，不能再提交订单",exports[100040]="班课已报满",exports[100041]="订单已取消",exports[100043]="商品已下架",exports[100044]="用户没有设置可上门授课范围为全国或者全省权限",exports[100045]="老师已经暂停本节班课招生，请联系老师继续招生",exports[100046]="班课包含违规信息，暂时无法报名",exports[100047]="班课已经到达上课时间，暂时无法报名",exports[100048]="老师已经删除本节班课，请联系老师重新开课",exports[100049]="老师已失效，暂时无法报名",exports[100052]="该订单存在冻结金额（余额、优惠券或奖学金），暂无法修改价格。如需修改，请联系学生重新下单",exports[12e4]="你不能跟自己聊天哦",exports[200001]="评论已存在",exports[200002]="权限错误",exports[200003]="评论删除错误",exports[200010]="你已连续10次输错密码，请确认后重新输入",exports[3e5]="修改日期错误",exports[4e5]="搜索服务连接失败",exports[5e5]="发送者或接受者为空",exports[6e5]="消息参数错误",exports[7e5]="未知错误",exports[991001]="输入文本过长",exports[991103]="班课已经开班，只可以修改最大学生数，其他都不能修改哦"}),define("common / store ",["require ","exports "],function(require,exports){"use strict ";var e={},t={},n={};exports.set=function(n,i){if("string "===$.type(n)){if(void 0!==e[n])t[n]=e[n];e[n]=i}else if($.isPlainObject(n))$.each(n,function(e,t){exports.set(e,t)})},exports.get=function(t){return t?e[t]:e},exports.isChange=function(n){var i=e[n],r=t[n];return void 0!==r&&i!==r},exports.onChange=function(e,t){var i=n[e];if(!$.isArray(i))i=[],n[e]=i;i.push(t)},exports.fireChange=function(){$.each(e,function(e){if(exports.isChange(e)){var i=n[e];if(i)$.each(i,function(e,t){if($.isFunction(t))t()});t[e]=void 0}})}}),define("common / service ",["require ","exports ",". / errorCode ",". / store "],function(require,exports){"use strict ";function e(e,t){var n=e.code;if(0!==n){var i;if(t&&(i=t[n])){if($.isFunction(i))i(e)}else{var a=r[n]||e.msg;if(!a)a=[],$.each(e.data||{},function(e,t){if(t)a.push(t)}),a=a.join(" < br / >");if(a)if(6!=o.get("user ").type)alert({title:"温馨提示",content:a,width:400})}}return e}function t(t,n,i){i=i||{},n=n||{};var r=o.get("user ").number||0;return n._user_number=r,$.extend(n,o.get("monkey ")),$.ajax({url:t,data:n,method:"post ",dataType:"json ",async:i.sync?!1:!0}).pipe(function(t){return e(t,i.errorHandler)})}function n(e,t,n){return $.ajax({url:e,data:t,dataType:"jsonp ",timeout:n})}function i(e){var t=o.get("im_url ");if(t)e.url=decodeURIComponent(t)}var r=require(". / errorCode "),o=require(". / store ");exports.post=t,exports.getRegionList=function(e){var n={p_id:e.id,level:e.level};if(!e.includeSubway)n.exclude_subway=1;return t(" / area / list ",n).done(function(e){return{code:0,data:{list:e}}})},exports.getIndustryList=function(e){var n={p_id:e.id};return t(" / industry / list ",n).done(function(e){return{code:0,data:{list:e}}})},exports.getJobList=function(e){var n={p_id:e.id};return t(" / job / list ",n).done(function(e){return{code:0,data:{list:e}}})},exports.setVideoCourseInfo=function(e,n){return t(" / video_course / setcourseinfo ",{user_number:e.userNumber,number:e.number,title:e.title,portrait:e.portrait,introduce:e.introduce,price:e.price,expire_time:e.expireTime,subject_id:e.subjectId,language:e.language,label_ids:e.labelIds},n)},exports.setVideoCourseBrief=function(e,n){return t(" / video_course / setcoursebrief ",{user_number:e.userNumber,number:e.number,brief:e.brief},n)},exports.getVideoCourseUploadUrl=function(e){var n={title:e.fileName,total_size:e.fileSize,user_number:e.userNumber,uploadtype:1};return t(" / video_course / getuploadurl ",n)},exports.getVideoCourseResumeUploadUrl=function(e){return t(" / video_course / getresumeuploadurl ",{user_number:e.userNumber,video_id:e.videoId})},exports.setVideoCourseSection=function(e){return t(" / video_course / setvideoinfo ",{user_number:e.userNumber,number:e.number,section_id:e.sectionId,video_id:e.videoId,name:e.name,file_name:e.fileName,index:e.index,pay_status:e.payStatus,type:e.type})},exports.setAllVideoCourseSection=function(e){return t(" / video_course / resetvideopos ",{user_number:e.userNumber,number:e.number,section_ids:e.sectionIds})},exports.saveVideoCourse=function(e){return t(" / video_course / setcoursestatus ",{user_number:e.userNumber,number:e.number,type:e.type})},exports.addFreeVideoCourse=function(e,n){return t(" / video_course / addfree ",{course_number:e.courseNumber},{sync:!0,errorHandler:n&&n.errorHandler})},exports.viewTeacher=function(e){return t(" / track / teacher_view ",{identity:e.teacherId})},exports.delInviteComment=function(e){return t(" / comment / del ",{comment_id:e.commentId})},exports.praiseTeacher=function(e){return t(" / teacher / praise ",{teacher_id:e})},exports.addFavouriteTeacher=function(e){return t(" / student_center / addFavouriteTeacher ",{teacher_id:e})},exports.delFavouriteTeacher=function(e){return t(" / student_center / delFavouriteTeacher ",{teacher_id:e})},exports.recommendAddRecord=function(e){return t(" / recommend / addRecord ",{teacher_id:e.teacherId,user_name:e.userName,mobile:e.mobile,course_name:e.courseName,lesson_way:e.lessonWay,info:e.info})},exports.sendComment=function(e,n,i){return t(e,n,i)},exports.getLessons=function(e){return t(" / lesson / reserveLessonAjaxCal ",{purchase_id:e.purchaseId,start_date:e.startDate,end_date:e.endDate})},exports.getCourseRepeatTimes=function(e){return t(" / lesson / reserveLessonAjaxTimes ",{purchase_id:e.purchaseId,start_time:e.startTime,end_time:e.endTime,interval:e.interval})},exports.checkReserve=function(e){return t(" / lesson / reserveLessonAjaxCheckForm ",{purchase_id:e.purchaseId,start_time:e.startTime,end_time:e.endTime,interval:e.interval,repeat_times:e.repeatTimes,note:e.note,address:e.locationAddr})},exports.reserve=function(e){return t(" / lesson / reserveLessonAjaxForm ",{purchase_id:e.purchaseId,start_time:e.startTime,end_time:e.endTime,interval:e.interval,repeat_times:e.repeatTimes,note:e.note,use_regular_addr:e.addrRadio,address_id:e.addressId,area_id:e.areaId,address:e.locationAddr,lng:e.lng,lat:e.lat,as_regular_address:e.asRegularAddress})},exports.getStudentLessons=function(e){return t(" / lesson / studentLessons ",{start_time:e.startDate+"00 : 00 : 00 ",end_time:e.endDate+"00 : 00 : 00 "})},exports.getTeacherLessons=function(e){return t(" / lesson / teacherLessons ",{start_time:e.startDate+"00 : 00 : 00 ",end_time:e.endDate+"00 : 00 : 00 "})},exports.getTeacherList=function(e){return t(" / student_center / teacher ",{page:e.page,status:e.status})},exports.getStudentList=function(e){return t(" / teacher_center / student ",{page:e.page,status:e.status})},exports.cancelOrderByUrl=function(e){var n=e.url;return delete e.url,t(n,e)},exports.getTeacherOrderList=function(e){return t(" / lesson / myTeacherDetail ",{teacher_number:e.number,status:e.status})},exports.getStudentOrderList=function(e){return t(" / lesson / myStudentDetail ",{student_number:e.number,status:e.status})},exports.validateMobile=function(e){return t(" / user / validateMobile ",{mobile:e.mobile},{sync:!0})},exports.Password=function(e){return t(" / user / validatePassword ",{mobile:e.password},{sync:!0})},exports.validateEmail=function(e){return t(" / user / validateEmail ",{mobile:e.email},{sync:!0})},exports.sendMobileCode=function(e){return t(" / teacher_center / account_ajax ? action = verifymobile ",{mobile:e.mobile})},exports.sendPayMobileCode=function(e){return t(" / user / verify_mobile ",{mobile:e.mobile})},exports.sendEmailCode=function(e){return t(" / teacher_center / account_ajax ? action = verifyemail ",{email:e.email})},exports.getCourseList=function(){return t(" / lesson / list ")},exports.getSubjectList=function(e){return t(" / subject / getList ",{id:e.id})},exports.getTeacherCourseList=function(e){return t(" / teacher / courseList ",{teacher_number:e.teacherNum,page:e.page,page_size:e.pageSize,course_type:e.courseType,sort_by:e.sortBy,is_default:e.isDefault,render_type:"ajax_tpl ",is_preview:e.isPreview})},exports.getTeacherVideoPhotoList=function(e){return t(" / teacher / videoPhotoList ",{teacher_number:e.teacherNum,page:e.page,page_size:e.pageSize,show_type:e.showType,render_type:"ajax_tpl "})},exports.getTeacherCommentList=function(e){return t(" / comment / fromStudentAjax ",{teacher_number:e.teacherNum,page:e.page,page_size:e.pageSize,face_type:e.face,comment_type:e.comment,render_type:"ajax_tpl ",sort_by:e.sortBy})},exports.getCourseCommentList=function(e){return t(" / comment / fromClassStudentAjax ",{teacher_number:e.teacherNum,page:e.page,page_size:e.pageSize,face_type:e.face,number:e.number,comment_type:e.comment,render_type:"ajax_tpl "})},exports.getUserType=function(){return t(" / user / roles ")},exports.getUserBasicInfo=function(e){var n;if(e&&null!=e.userId&&null!=e.userType)n={user_id:e.userId,user_type:e.userType};return t(" / user / basicInfo ",n)},exports.sendInviteCode=function(e){var n=$.extend(e.formData||{},{invite_code:e.inviteCode,role:e.role});return t(" / user / switch_role_ajax ",n)},exports.switchRole=function(e){return t(" / user / switch_role_ajax ",{role:e.role,invite_code:e.inviteCode})},exports.getUploadVideoUrl=function(e){var n={name:e.fileName,total_size:e.fileSize};if(e.chunk)n.uploadtype=1;return t(" / video / getUploadUrl ",n)},exports.getResumeUploadVideoUrl=function(e){return t(" / video / getResumeUploadUrl / "+e.id,{name:e.fileName,total_size:e.fileSize,uploadtype:1})},exports.sendNormalSMSCode=function(e){return t(" / auth / sendNormalSMSCode ",{mobile:e.mobile})},exports.sendSMSCode=function(e){return t(" / auth / sendSMSCode2 ",{mobile:e.mobile,captcha:e.captcha,type:e.type})},exports.sendLoginSMSCode=function(e){return t(" / auth / sendLoginSMSCode ",{mobile:e.mobile})},exports.loginByPassword=function(e){return t(" / auth / signin_ajax ",{usertype:e.userType,username:e.mobile,password:e.password,remember_me:e.rememberMe,next:e.next})},exports.loginBySms=function(e){return t(" / auth / signin_mobile_ajax ",{usertype:e.userType,username:e.mobile,verifycode:e.code,remember_me:e.rememberMe})},exports.verifyNormalSMSCode=function(e){return t(" / auth / verifyNormalSMSCode ",{mobile:e.mobile,code:e.code})},exports.checkNormalSMSCode=function(e){return t(" / auth / checkNormalSMSCode ",{mobile:e.mobile,code:e.code})},exports.createVideo=function(e){return t(" / video / create / "+e.id,{title:e.title,category:e.category,labels:e.labels})},exports.editCourse=function(e){var n={subject_id:e.subjectId,name:e.name};if(null!=e.id)n.id=e.id;if($.isNumeric(e.teacher))n.teacher=e.teacher;if($.isNumeric(e.student))n.student=e.student;if($.isNumeric(e.discuss))n.discuss=e.discuss;if($.isNumeric(e.online))n.online=e.online;return t(" / teacher_center / editCourse ",n)},exports.editCombo=function(e){var n={hours:e.hours,discount:e.discount,name:e.name};if(null!=e.id)n.id=e.id;return t(" / teacher_center / editCombo ",n)},exports.delCourse=function(e){return t(" / teacher_center / delCourse ",{id:e.id})},exports.delCombo=function(e){return t(" / teacher_center / delCombo ",{id:e.id})},exports.delVideo=function(e){return t(" / video / delete / "+e.id)},exports.editVideo=function(e){return t(" / video / rename / "+e.id,{title:e.name})},exports.getTeacherBusyDate=function(e){return t(" / teacher / busyDate ",{teacher_number:e.number,start:e.start,end:e.end})},exports.setTeacherBusyDate=function(e){return t(" / teacher_center / upsertUsabletime ",{weeks:e.weeks,description:e.descript})},exports.editTeacherExperience=function(e,n){var i={start_year:e.startYear,start_month:e.startMonth,end_year:e.endYear,end_month:e.endMonth,content:e.content};if(null!=e.id)i.id=e.id;return t(" / teacher_bio / upsert ",i,n)},exports.delTeacherExperience=function(e){return t(" / teacher_bio / delete ",{id:e.id})},exports.editTeacherSuccess=function(e,n){var i={year:e.year,month:e.month,title:e.title,content:e.content};if(null!=e.id)i.id=e.id;return t(" / teacher_case / upsert ",i,n)},exports.delTeacherSuccess=function(e){return t(" / teacher_case / delete ",{id:e.id})},exports.editTeacherOtherInfo=function(e,n){return t(" / teacher_center / upsertOtherInfo ",{other_info:e.content},n)},exports.editTeacherPhoto=function(e){var n={title:e.title};if(null!=e)n.id=e.id;if(null!=e.attachmentId)n.attachment_id=e.attachmentId;return t(" / photo / upsert ",n)},exports.delPhoto=function(e){return t(" / photo / delete ",{id:e.id})},exports.getSuggestion=function(e){var t=o.get("env "),i={dev:"http: //suggestion.genshuixue.com/s",test:"http://beta.suggestion.genshuixue.com/s",beta:"http://beta.suggestion.genshuixue.com/s",www:"http://suggestion.genshuixue.com/s"},r=i[t]||i.www;return n(r,e)},exports.fetchadvertisement=function(e){var t=$.param({ss:e.cityId,p:e.adId}),i=o.get("env"),r={dev:"//test-p-gat.genshuixue.com/p.json",test:"//test-p-gat.genshuixue.com/p.json",beta:"//p-gat.genshuixue.com/p.json",www:"//p-gat.genshuixue.com/p.json"},a=r[i]||r.www;return n(a,t,2e3)},exports.editTeacherBaseInfo=function(e,n){return t("/teacher_center/upsertBasic",{realname:e.realname,sex:e.sex,nickname:e.nickname,introduction:e.shortIntroduce,birthday:e.birthday,constellation:e.constellation,category:e.category,degree:e.eduBack,school:e.school,major:e.major,regions:e.regions,domain:e.privateDomain},n)},exports.editStudentBaseInfo=function(e,n){return t("/student_center/upsertBasic",{realname:e.realname,nickname:e.nickname,sex:e.sex,birthday:e.birthday,short_introduce:e.introduce,location:e.areaId,address:e.address,lng:e.lng,lat:e.lat,subjects:e.subjects},n)},exports.editStudentBackground=function(e){return t("/student_center/upsertBackground",{colleges:e.universitys,senior_schools:e.seniors,special_schools:e.technicals,middle_schools:e.juniors,primary_schools:e.primarys})},exports.editTeacherBackgroundInfo=function(e,n){return t("/teacher_center/upsertBackground",{school_age:e.schoolAge,institution:e.institution,tags:e.tags},n)},exports.editStudentWork=function(e){return t("/student_center/upsertWork",{companys:e.companys})},exports.togglePrivateProtected=function(e){return t("/teacher_center/togglePrivateProtected",{bitwise:e.bitwise})},exports.getMessageList=function(e){return t("/message/secretary",{page:e.page})},exports.sendTeacherRecover=function(e){return t("/teacher/report",{teacher_number:e.number,content:e.content,name:e.name,contact:e.contact})},exports.sendOrgRecover=function(e){return t("/org/report",{org_id:e.orgId,content:e.content,name:e.name,contact:e.contact})},exports.verifyCertNumber=function(e){return t("/teacher_center/verifyCertNumber",{number:e.number,type:e.type},{sync:!0})},exports.bindBankCard=function(e,n){return t("/account/addBankCard",{owner_name:e.owner_name,mobile:e.mobile,id_number:e.id_number,card_num:e.card_num,bank_no:e.bank_no,region:[e.province,e.city].join("_"),sms_code:e.sms_code,id:e.id,token:e.token,third_type:e.third_type},n)},exports.sendBindCardSMSCode=function(e,n){return t("/account/verifyBankCard",{owner_name:e.owner_name,id_number:e.id_number,bank_no:e.bank_no,mobile:e.mobile,card_num:e.card_num},n)},exports.unBindBankCard=function(e){return t("/account/delBankCard",{id:e.id,pay_password:e.pay_password})},exports.createClassPurchase=function(e,n){var i={course_number:e.courseNumber,total_prices:e.totalPrice,pay_money:e.payPrice,name:e.name,student:e.studentName,is_self:e.isSelf?1:0};if(e.note)i.note=e.note;return t("/pay/createClassPurchase",i,n)},exports.createRecharge=function(e){var n="bank"===e.payWay,i={money:e.money,pay_type:n?3:2};if(n)i.bank_no=e.bankNo;return t("/account/createRecharge",i,{sync:!0})},exports.payPurchase=function(e,n){var i={purchase_id:e.purchaseId};if(0==e.money)i.pay_type="1:0";else{var r=[];if("alipay"===e.payWay)r.push("2:"+e.money);else if("wechat"===e.payWay)r.push("30:"+e.money);else if("bank"===e.payWay){if(r.push("3:"+e.money),e.bankName)i.bank_no=e.bankName}else if("creditCard"===e.payWay){if(r.push("7:"+e.money),e.bankName)i.bank_no=e.bankName}else if("moto"===e.payWay)if(r.push((void 0!==e.third_type?e.third_type:"11")+":"+e.money),e.bankName)i.bank_no=e.bankName;i.pay_type=r.join("_")}return i.card_name=e.bankName,i.unique_id=e.cardId,i.card_type=e.cardType,i.exp=e.expireYear+"-"+e.expireMonth,i.cvv=e.cvv,i.owner_name=e.ownerName,i.owner_id=e.ownerId,i.owner_mobile=e.ownerMobile,i.trade_code=e.code,i.cash_type=e.cashType,i.money=e.money,i.third_type=e.third_type,i.token=e.token,t("/pay/thirdPartyPay",i,{sync:!0,errorHandler:n&&n.errorHandler})},exports.getCourseCombo=function(e){return t("/pay/combo",{teacher_number:e.teacherNum})},exports.checkFavCode=function(e){return t("/pay/checkFavCode",{fav_code:e.code,pay_money:e.pay_money,teacher_id:e.teacher_id,lesson_way:e.lesson_way,course_type:e.course_type,subject_id:e.subject_id})},exports.invite=function(e){return t("/invite/sendMobile",{code:e.code,mobiles:e.mobiles})},exports.saveAvatar=function(e){return t("/user/upsertAvatar",{storage_id:e.id,role:e.userType})},exports.saveNewpwd=function(e){return t("/teacher_center/account_ajax?action=savenewpwd",{old_password:e.old_password,password:e.password,password_confirm:e.password_confirm})},exports.savePhone=function(e){return t("/teacher_center/account_ajax?action=savephone",{mobile:e.oldMobile,current_verify_code:e.oldVerifyCode,new_mobile:e.newMobile,captcha_name:"wyj",captcha:e.captcha,verify_code:e.newVerifyCode})},exports.saveNewemail=function(e){return t("/teacher_center/account_ajax?action=savenewemail",{new_email:e.new_email,mobile:e.mobile,password:e.password,verify_code:e.verify_code})},exports.saveEmail=function(e){return t("/teacher_center/account_ajax?action=saveemail",{password:e.password,mobile:e.mobile,email:e.email,new_email:e.new_email,verify_code:e.verify_code})},exports.setPayPassword=function(e){return t("/user/upsert_pay_password",{mobile:e.mobile,verify_code:e.verifyCode,current_pay_password:e.currentPayPassword,pay_password:e.payPassword,pay_password_confirm:e.payPasswordConfirm})},exports.resetPayPassword=function(e){var n={mobile:e.mobile,verify_code:e.verify_code,captcha:e.captcha,card:e.card,next:e.next};if(e.check)n.check=1;else n.check=0,n.pay_password=e.password,n.pay_password_confirm=e.password_confirm;return t("/user/reset_pay_password",n)},exports.upsertCert=function(e){return t("/teacher_center/upsertCert",{id:e.id,type:e.type,storage_id:e.storage_id,idnumber:e.idnumber,name:e.name})},exports.createWithdraw=function(e){return t("/pay/createDrawCash",{card_id:e.cardId,money:e.money,pay_password:e.payPassword})},exports.checkMobileRegister=function(e){return t("/auth/checkMobile",{mobile:e.mobile})},exports.registerSimply=function(e){return t("/auth/registerStudentByMobile",{name:e.name,mobile:e.mobile,code:e.code})},exports.registerTeacher=function(e){return t("/auth/signup_teacher_ajax",{verifycode:e.verifycode,mobile:e.mobile,email:e.email,password:e.password,password_confirm:e.password_confirm,captcha:e.captcha,invitecode:e.invitecode,next:e.next})},exports.registerStudent=function(e){return t("/auth/signup_student_ajax",{verifycode:e.verifycode,mobile:e.mobile,email:e.email,password:e.password,password_confirm:e.password_confirm,captcha:e.captcha,invitecode:e.invitecode,next:e.next,province:e.province,city:e.city,school:e.school,cooperation:e.cooperation})},exports.teacherConfirmScheduleCheck=function(e){return t("/lesson/teacherConfirmReserveCheck",{lesson_id:e.lessonId})},exports.teacherConfirmSchedule=function(e){return t("/lesson/teacherConfirmReserve",{lesson_id:e.lessonId})},exports.studentConfirmScheduleCheck=function(e){return t("/lesson/studentConfirmReserveCheck",{lesson_id:e.lessonId})
    },
    exports.studentConfirmSchedule = function(e) {
        return t("/lesson/studentConfirmReserve", {
            lesson_id: e.lessonId
        })
    },
    exports.confirmPaySchedule = function(e) {
        return t(e.url, {
            lesson_id: e.lessonId
        })
    },
    exports.ratingSchedule = function(e) {
        return t("/lesson/rating", {
            lesson_id: e.lessonId,
            rating: e.rating
        })
    },
    exports.getScheduleList = function(e) {
        return t(e.url, {
            day: e.day
        })
    },
    exports.getLunchCount = function() {
        return t("/activity/countInfo?type=2&activity_id=ground003&has_total=1", {
            activity_id: "ground003"
        })
    },
    exports.sentLunchCount = function() {
        return t("/activity/registerUser?activity_id=ground003&type=2&channel_id=pc001&has_total=1", {
            activity_id: "ground003"
        })
    },
    exports.getImInfo = function(e) {
        var n = {
            user_number: e.userNumber,
            user_role: e.userType,
            auth_token: e.authToken
        };
        return i(n),
        t("/im/userInfo", n)
    },
    exports.getKFImInfo = function(e) {
        var n = {
            user_number: e.userNumber,
            user_role: e.userType,
            auth_token: e.authToken
        };
        return i(n),
        t("/custom_im/userInfo", n)
    },
    exports.getLastContacts = function(e) {
        var n = {
            curr_user_name: e.imUsername
        };
        return i(n),
        t("/im/lastContacts", n)
    },
    exports.addContact = function(e) {
        var n = {
            im_user_name: e.imUsername,
            curr_user_name: e.currentName
        };
        return i(n),
        t("/im/addContact", n)
    },
    exports.delContact = function(e) {
        var n = {
            roster_list: e.imUsername,
            curr_user_name: e.currentName
        };
        return i(n),
        t("/im/delContact", n)
    },
    exports.getMyContacts = function(e) {
        var n = {
            curr_user_name: e.imUsername,
            target_type: e.target_type
        };
        return i(n),
        t("/im/myContacts", n)
    },
    exports.getOrgRoomUrl = function(e) {
        var t = o.get("env"),
        i = {
            test: "http://test-i.genshuixue.com/api/orgOnlineCourse.do",
            beta: "http://beta-i.genshuixue.com/api/orgOnlineCourse.do",
            www: "http://i.genshuixue.com/api/orgOnlineCourse.do"
        },
        r = i[t] || i.www;
        return n(r, {
            org_id: e.orgId
        })
    },
    exports.getMyInstitution = function(e) {
        var n = {
            im_user_name: e.imUsername
        };
        return i(n),
        t("/im/myInstitution", n)
    },
    exports.getFriendInfo = function(e) {
        var n = {
            user_number: e.userNumber,
            user_role: e.userType
        };
        return i(n),
        t("/im/getUserInfo", n)
    },
    exports.getRosterList = function(e) {
        var n = {
            roster_list: e.imUsername
        };
        return i(n),
        t("/im/rosterList", n)
    },
    exports.getHistory = function(e) {
        var n = {
            im_user_name: e.imUsername,
            curr_user_name: e.currentName,
            page: e.pages,
            timestamp: e.timeStamp,
            chat_type: e.chatType,
            group_id: e.groupId
        };
        return i(n),
        t("/im/history", n)
    },
    exports.getMyGroup = function(e) {
        return t("/im/myGroup", {
            curr_user_name: e.imUsername
        })
    },
    exports.getGroupInfo = function(e) {
        return t("/im/getGroupInfo", {
            im_group_id: e.groupId
        })
    },
    exports.getGroupMembers = function(e) {
        return t("/im/getGroupMembers", {
            im_group_id: e.groupId
        })
    },
    exports.setGroupName = function(e) {
        return t("/im/setGroupName", {
            curr_user_name: e.imUsername,
            im_group_id: e.groupId,
            groupname: e.groupName
        })
    },
    exports.setMsgStatus = function(e) {
        return t("/im/setMsgStatus", {
            curr_user_name: e.imUsername,
            im_group_id: e.groupId,
            msg_status: e.msgStatus
        })
    },
    exports.quitGroup = function(e) {
        return t("/im/quitGroup", {
            curr_user_name: e.imUsername,
            im_group_id: e.groupId
        })
    },
    exports.dissolveGroup = function(e) {
        return t("/im/dissolveGroup", {
            curr_user_name: e.imUsername,
            im_group_id: e.groupId
        })
    },
    exports.setOnlineStatus = function(e) {
        var n = {
            id: e.id,
            status: e.status
        };
        return i(n),
        t("/custom_im/setOnlineStatus", n)
    },
    exports.setOriginPage = function(e) {
        var n = {
            curr_user_name: e.imUsername,
            origin_page: e.origin_page
        };
        return i(n),
        t("/custom_im/setOriginPage", n)
    },
    exports.addKFContact = function(e) {
        var n = {
            id: e.id,
            im_user_name: e.imUsername
        };
        return i(n),
        t("/custom_im/addContact", n)
    },
    exports.getUserInfoKF = function(e) {
        var n = {
            im_user_name: e.imUsername
        };
        return i(n),
        t("/custom_im/getUserInfo", n)
    },
    exports.getFirstText = function() {
        var e = {};
        return i(e),
        t("/custom_im/getFirstText", e)
    },
    exports.getServiceLastContacts = function(e) {
        var n = {
            curr_user_name: e.currentName
        };
        return i(n),
        t("/custom_im/lastContacts", n)
    },
    exports.serviceContacts = function(e) {
        var n = {
            id: e.id,
            im_user_name: e.imUsername
        };
        return i(n),
        t("/custom_im/serviceContacts", n)
    },
    exports.checkService = function(e) {
        var n = {
            im_user_name: e.imUsername,
            curr_user_name: e.currentName
        };
        return i(n),
        t("/custom_im/checkService", n)
    },
    exports.getUserCustom = function(e) {
        var n = {
            im_user_name: e.imUsername
        };
        return i(n),
        t("/custom_im/getUserCustom", n)
    },
    exports.isMyCustom = function(e) {
        var n = {
            im_user_name: e.imUsername,
            id: e.id
        };
        return i(n),
        t("/custom_im/isMyCustom", n)
    },
    exports.createKFConn = function(e) {
        var n = {
            id: e.id,
            im_user_name: e.imUsername
        };
        return i(n),
        t("/custom_im/createConn", n)
    },
    exports.closeService = function(e) {
        var n = {
            id: e.id,
            im_user_name: e.imUsername
        };
        return i(n),
        t("/custom_im/close", n)
    },
    exports.getQuickReply = function() {
        var e = {};
        return i(e),
        t("/custom_im/getQuickReply", e)
    },
    exports.addQuickReply = function(e) {
        var n = {
            text: e.text
        };
        return i(n),
        t("/custom_im/addQuickReply", n)
    },
    exports.delQuickReply = function(e) {
        var n = {
            id: e.id
        };
        return i(n),
        t("/custom_im/delQuickReply", n)
    },
    exports.modQuickReply = function(e) {
        var n = {
            id: e.id,
            text: e.text
        };
        return i(n),
        t("/custom_im/modQuickReply", n)
    },
    exports.customHeartbeat = function(e) {
        var n = {
            id: e.id
        };
        return i(n),
        t("/custom_im/heartbeat", n)
    },
    exports.checkexApply = function() {
        return t("/activity/countInfo?type=1&activity_id=ground002&has_total=1", {
            activity_id: "ground002"
        })
    },
    exports.userexApply = function() {
        return t("/activity/registerUser?type=1&activity_id=ground002&has_total=1&channel_id=pc001", {
            activity_id: "ground002"
        })
    },
    exports.checkipApply = function() {
        return t("/activity/countInfo?type=1&activity_id=ground001&has_total=1", {
            activity_id: "ground001"
        })
    },
    exports.useripApply = function() {
        return t("/activity/registerUser?type=1&activity_id=ground001&has_total=1&channel_id=pc001", {
            activity_id: "ground001"
        })
    },
    exports.getInviteCommentInfo = function(e) {
        return t("/teacher/getInviteCommentInfo", {
            teacher_id: e.teacherId
        })
    },
    exports.sendInviteCommentInfo = function(e, n) {
        return t("/teacher/postComment", {
            name: e.userName,
            teacher_number: e.teacherNumber,
            teacher_course_id: e.courseId,
            lesson_way: e.lessonWay,
            teach_hours: e.lessonTime,
            face_type: e.faceType,
            desc_match: e.descMatch,
            teach_result: e.teachResult,
            service_attitude: e.serviceAttitude,
            info: e.commentInfo,
            photo_list: e.photoList
        },
        n)
    },
    exports.sectime = function() {
        return t("/activity/sectime?type=1&activity_id=ground001&has_total=1&channel_id=pc001", {
            activity_id: "ground004"
        })
    },
    exports.overviewAudit = function(e) {
        return t("/teacher_center/overview", e)
    },
    exports.getPrize = function(e) {
        return t("/activity/getPrize", e)
    },
    exports.getPrizeRecord = function(e) {
        return t("/activity/prizeRecord", e)
    },
    exports.getCashbackRecord = function(e) {
        return t("/activity/cashBackRecord", e)
    },
    exports.sendCashBackInvite = function(e) {
        return t("/activity/smsInvite", {
            mobile: e.mobile
        })
    },
    exports.checkCourseRepeat = function(e, n) {
        return t("/pay/ifCanBuy", {
            course_number: e.courseNumber
        },
        {
            sync: !0,
            errorHandler: n && n.errorHandler
        })
    },
    exports.getClassCourseList = function(e) {
        return t("/teacher_center/classCourseList", e)
    },
    exports.classCourseAudit = function(e, n) {
        return t("/class_course/submitAudit", {
            number: e.number
        },
        n)
    },
    exports.classCourseRevokeAudit = function(e) {
        return t("/class_course/revokeAudit", {
            number: e.number
        })
    },
    exports.statusClassCourse = function(e) {
        return t("/class_course/status", {
            number: e.number,
            op: e.op
        })
    },
    exports.copyClassCourse = function(e) {
        return t("/class_course/copy", {
            number: e.number
        })
    },
    exports.delClassCourse = function(e) {
        return t("/class_course/delete", {
            number: e.number
        })
    },
    exports.upsertClassCourse = function(e, n) {
        return t("/class_course/upsert", {
            subject_id: e.subjectId,
            name: e.name,
            price: e.price,
            original_price: e.originalPrice,
            max_student: e.maxStudent,
            min_student: e.minStudent,
            introduction: e.introduction,
            student_desc: e.studentDesc,
            target: e.target,
            lesson_way: e.lessonWay,
            user_address_id: e.addressId,
            area_id: e.areaId,
            address: e.address,
            lng: e.lng,
            lat: e.lat,
            as_regular_address: e.asRegularAddress,
            number: e.number,
            class_type: e.classType
        },
        n)
    },
    exports.upsertClassCoursePhoto = function(e, n) {
        return t("/photo/upsertClassCoursePhoto", {
            number: e.courseNumber,
            id: e.id,
            storage_id: e.storage_id,
            title: e.title
        },
        n)
    },
    exports.delClassCoursePhoto = function(e) {
        return t("/photo/delClassCoursePhoto", {
            number: e.courseNumber,
            id: e.id
        })
    },
    exports.classCourseSchedule = function(e, n) {
        return t("/class_course/schedule", {
            number: e.number,
            arrangement: e.arrangement,
            retire_flag: e.retire_flag,
            retire_length: e.retire_length,
            chaban_flag: e.chaban_flag,
            chaban_price: e.chaban_price,
            chaban_quota: e.chaban_quota,
            chaban_price_flag: e.chaban_price_flag,
            confirm_flag: e.confirm_flag,
            schedules: e.schedules
        },
        n)
    },
    exports.classCourseScheduleDelete = function(e) {
        return t("/class_course_schedule/delete", {
            id: e.id
        })
    },
    exports.changeOrderMoney = function(e) {
        return t("/pay/changeMoney", {
            purchase_id: e.purchaseId,
            pay_money: e.payMoney
        })
    },
    exports.baiduVideo = function(e) {
        return t(e.url, {
            url: e.url
        })
    },
    exports.resetPassword = function(e) {
        return t("/user/reset_password", e)
    },
    exports.updateReservedLesson = function(e, n) {
        return t("/lesson/updateReserveTime", {
            lesson_id: e.lesson_id,
            purchase_id: e.purchase_id,
            start_time: e.start_time,
            end_time: e.end_time,
            force: e.force,
            max_hours: e.max_hours
        },
        n)
    },
    exports.createPurchase = function(e, n) {
        return t("/pay/createProductPurchase", {
            type: e.type,
            course_id: e.courseId,
            combo_id: e.comboId,
            hours: e.hours,
            lesson_way: e.lessonWay,
            course_number: e.courseNumber,
            is_self: e.isSelf,
            area_id: e.areaId,
            address: e.locationAddr,
            lng: e.lng,
            lat: e.lat,
            note: e.note,
            student_name: e.studentName,
            name: e.name,
            pay_type: e.payType,
            pay_password: e.payPassword,
            activity_id: e.activityId
        },
        n)
    },
    exports.saveMessageSetting = function(e) {
        return t("/message/setting", {
            submit_order: e.submit_order,
            pay_order: e.pay_order,
            cancel_order: e.cancel_order,
            reserve_course: e.reserve_course,
            confirm_course: e.confirm_course,
            cancel_course: e.cancel_course,
            remind_1day_before: e.remind_1day_before,
            remind_1hour_before: e.remind_1hour_before,
            submit_class_order: e.submit_class_order,
            pay_class_order: e.pay_class_order,
            cancel_class_order: e.cancel_class_order,
            full_class: e.full_class,
            receive_offline_message: e.receive_offline_message,
            pay_course: e.pay_course
        })
    },
    exports.sendPaySms = function(e) {
        return t("/pay/motoPayVerify", {
            card_name: e.bankName.toUpperCase(),
            unique_id: e.cardId,
            card_type: e.cardType,
            exp: e.expireYear + "-" + e.expireMonth,
            cvv: e.cvv,
            owner_name: e.ownerName,
            owner_id: e.ownerId,
            owner_mobile: e.ownerMobile,
            purchase_id: e.purchaseId,
            money: e.money,
            cash_type: e.cashType
        })
    },
    exports.getCardIndex = function(e) {
        return t("/pay/cardIndex", {
            card_name: e.bankName.toUpperCase(),
            card_type: e.cardType
        })
    },
    exports.saveUserConfig = function(e) {
        return t("/user/setConfig", e)
    },
    exports.validateCaptcha = function(e, n) {
        return t("/captcha/validate", e, n)
    },
    exports.getInternationalCode = function() {
        return t("/index/getInternationalCode")
    },
    exports.sendVoiceSMS = function(e) {
        return t("/auth/sendVoiceSMS", {
            mobile: e.mobile,
            captcha: e.captcha
        })
    },
    exports.quickLesson = function(e) {
        return t("/lesson/qreserveLesson", {
            teacher_number: e.teacherNum,
            qreserve_sign: e.qreserveSign,
            remind: e.remind
        })
    },
    exports.clientLogin = function(e) {
        return t("/Auth/signin_client_ajax", {
            username: e.phoneNo,
            password: e.password,
            usertype: e.usertype
        })
    },
    exports.onlineTeacherCourse = function(e) {
        return t("/Video/quickTeacher", {
            username: e.username
        })
    },
    exports.onlineStudentCourse = function(e) {
        return t("/Video/quickStudent", {
            username: e.username
        })
    },
    exports.lastContacts = function(e) {
        return t("/im/lastContacts", {
            curr_user_name: e.username
        })
    },
    exports.teacherContacts = function(e) {
        return t("/im/myContacts", {
            username: e.username
        })
    },
    exports.courseClassify = function(e) {
        return t("/teacher_center/subjectRecommend", {
            keyword: e.keyword
        })
    },
    exports.applyFreeTutor = function(e) {
        return t("/activity/frTutor", {
            name: e.name,
            tel: e.telephone,
            QQ: e.qq,
            add: e.address,
            gra: e.grade,
            sub: e.subject,
            other: e.other
        })
    },
    exports.upsertAddress = function(e) {
        return t("/teacher_center/upsertAddress", {
            address_id: e.addressId,
            area_id: e.areaId,
            address: e.locationAddr,
            lng: e.lng,
            lat: e.lat,
            as_regular_address: e.asRegularAddress
        })
    },
    exports.delAddress = function(e) {
        return t("/teacher_center/delAddress", {
            address_id: e.addressId
        })
    },
    exports.setDefaultAddress = function(e) {
        return t("/teacher_center/setDefaultAddress", {
            address_id: e.addressId
        })
    },
    exports.checkAddress = function(e) {
        return t("/teacher_center/checkAddress", {
            city_id: e.cityId,
            area_name: e.areaName
        })
    },
    exports.commentThumbUp = function(e) {
        return t("/site_thumb/do", {
            type: 1,
            action: 1,
            id: e.id
        })
    },
    exports.getVideoCourseOrderList = function(e) {
        return t("/teacher_center/videoCourseOrderList", {
            course_number: e.courseNumber
        })
    },
    exports.checkVideoCourse = function(e, n) {
        return t("/video_course/check", {
            course_number: e.courseNumber,
            section_id: e.sectionId,
            index: e.index
        },
        n)
    },
    exports.checkin = function(e) {
        return t("/teacher_center/checkin", {
            mood: e.mood,
            text: e.text
        })
    },
    exports.getCheckinCalendar = function(e) {
        return t("/teacher_center/getCheckinCalendar", {
            month: e.month
        })
    },
    exports.signupBySns = function(e, n) {
        var i = {
            type: e.type,
            mobile: e.mobile,
            verifycode: e.code
        };
        if (e.password) i.password = e.password;
        return t("/social_accounts_login/signup_ajax", i, {
            errorHandler: n && n.errorHandler
        })
    },
    exports.quitSignupBySns = function() {
        return t("/social_accounts_login/destroy_ajax")
    },
    exports.unbindAccount = function(e) {
        return t("/social_accounts_login/unbind_ajax", {
            type: e.type
        })
    },
    exports.rebindAccount = function() {
        return t("/social_accounts_login/rebind_ajax")
    },
    exports.getWechatInfo = function() {
        return t("/social_accounts_login/wechat_qrcode")
    },
    exports.delCommentImg = function(e) {
        return t("/photo/delStorage?call_from=comment&storage_id=" + e.storageId)
    },
    exports.getOrgCoupon = function(e) {
        return t("/org/getOrgCoupon", {
            coupon_id: e.couponId,
            source_id: e.sourceId
        })
    },
    exports.getCourseStudentList = function(e) {
        return t("/teacher_center/courseList", {
            keyword: e.keyword
        })
    },
    exports.getStudentVIPOrderList = function(e) {
        return t("/teacher_center/orderForm", {
            user_num: e.userNumber,
            display_name: e.displayName
        })
    },
    exports.getCourseTeacherList = function(e) {
        return t("/student_center/courseList", {
            keyword: e.keyword
        })
    },
    exports.getTeacherVIPOrderList = function(e) {
        return t("/student_center/orderForm", {
            user_num: e.userNumber,
            display_name: e.displayName
        })
    },
    exports.checkPayPurchaseStatus = function(e, n) {
        return t("/pay/checkPurchaseStatus", {
            purchase_id: e.purchaseId
        },
        n)
    },
    exports.getSchoolList = function(e) {
        return t("/student_center/school", {
            pid: e.pid,
            type: e.type
        })
    },
    exports.getDepartmentList = function(e) {
        return t("/student_center/department", {
            school_id: e.schoolId
        })
    },
    exports.delStudentBackground = function(e) {
        return t("/student_center/delBackground", {
            id: e.id
        })
    },
    exports.delStudentWork = function(e) {
        return t("/student_center/delWork", {
            id: e.id
        })
    },
    exports.getPrimarySuggestion = function(e) {
        var t = o.get("env"),
        i = {
            test: "http://beta.suggestion.genshuixue.com/school",
            beta: "http://beta.suggestion.genshuixue.com/school",
            www: "http://suggestion.genshuixue.com/school"
        },
        r = i[t] || i.www;
        return n(r, e)
    },
    exports.getCompanySuggestion = function(e) {
        var t = o.get("env"),
        i = {
            test: "http://beta.suggestion.genshuixue.com/company",
            beta: "http://beta.suggestion.genshuixue.com/company",
            www: "http://suggestion.genshuixue.com/company"
        },
        r = i[t] || i.www;
        return n(r, e)
    },
    exports.getEnroll = function() {
        return t("/student_center/joinActivity")
    },
    exports.getPhotoList = function(e) {
        return t("/photo/list_admin", {
            page: e.page,
            page_size: e.pageSize
        })
    },
    exports.getAddressSuggestion = function(e) {
        return n("http://api.map.baidu.com/place/v2/suggestion", {
            query: e.query,
            region: e.region,
            output: "json",
            ak: "EMB0bKIvMeOd70lyyG92BZlu"
        })
    },
    exports.getCashHistoryList = function(e) {
        var n = o.get("user").type;
        return t("/student_center/cashAjax", {
            page: e.page,
            size: e.pageSize,
            user_type: n
        })
    }
}),
define("common/function/wechatQrcode", ["require", "exports", "module", "../service", "cobble/util/url"],
function(require) {
    "use strict";
    var e = require("../service"),
    t = require("cobble/util/url");
    return function(n, i) {
        require(["js!https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js"],
        function() {
            e.getWechatInfo({
                type: i
            }).done(function(e) {
                if (0 === e.code) {
                    var i = e.data,
                    r = i.host,
                    o = t.getOrigin(r);
                    if (0 === o.indexOf("http:")) o = "https" + o.substr(4);
                    new WxLogin({
                        id: n,
                        appid: "wxc141277bb62cfd84",
                        scope: "snsapi_login",
                        redirect_uri: encodeURIComponent(r),
                        state: i.redirect,
                        style: "",
                        href: o + "/asset/css/common/component/wechatQrcode.css"
                    }),
                    $("#" + n + " iframe").height(159)
                }
            })
        })
    }
}),
define("common/form", ["require", "exports", "cobble/form/Validator"],
function(require, exports) {
    "use strict";
    function e(e) {
        var t = {},
        n = e.find("[name]");
        return n.each(function() {
            var e = this.name,
            n = this.value,
            i = "radio" === this.type || "checkbox" === this.type;
            if (i) {
                if (this.checked) t[e] = n
            } else {
                var r = t[e];
                if (null == r) t[e] = n;
                else r = t[e] = [r],
                r.push(n)
            }
        }),
        $.each(t,
        function(e, n) {
            t[e] = $.isArray(n) ? n.join(",") : $.trim(n)
        }),
        t
    }
    function t(e, t) {
        $.each(t,
        function(t, i) {
            if (i) {
                var r = e.find('[name="' + t + '"]'),
                o = r.closest(".form-group");
                o.removeClass("has-success").addClass("has-error");
                var a = o.find(".error");
                a.html(i),
                n.defaultOptions.errorPlacement(r, a)
            }
        })
    }
    var n = require("cobble/form/Validator");
    exports.parse = function(t) {
        return e(t)
    },
    exports.get = function(n, i) {
        return $.ajax({
            url: i,
            type: "get",
            dataType: "json",
            data: n.jquery ? e(n) : n
        }).done(function(e) {
            if (e.code) {
                var i = e.data;
                if (i) t(n, i)
            }
            return e
        })
    },
    exports.post = function(n, i) {
        return $.ajax({
            url: i,
            type: "post",
            dataType: "json",
            data: n.jquery ? e(n) : n
        }).done(function(e) {
            if (e.code) {
                var i = e.data;
                if (i) t(n, i)
            }
            return e
        })
    }
}),
define("cobble/function/split", ["require", "exports", "module"],
function() {
    "use strict";
    return function(e, t) {
        var n = [];
        return $.each(e.split(t),
        function(e, t) {
            if (t = $.trim(t)) n.push(t)
        }),
        n
    }
}),
define("cobble/function/contains", ["require", "exports", "module"],
function() {
    "use strict";
    return function(e, t) {
        if (e = e.jquery ? e[0] : e, t = t.jquery ? t[0] : t, e === t) return ! 0;
        else return $.contains(e, t)
    }
}),
define("cobble/util/instance", ["require", "exports", "module"],
function(require, exports) {
    exports.window = $(window),
    exports.document = $(document),
    exports.html = $(document.documentElement),
    exports.body = $(document.body)
}),
define("cobble/helper/Popup", ["require", "exports", "module", "../function/split", "../function/contains", "../function/jquerify", "../function/lifeCycle", "../util/instance"],
function(require) {
    "use strict";
    function e(e) {
        return h.init(this, e)
    }
    function t(e, t) {
        return function(n) {
            var i = n.data,
            r = i.cache;
            if (!$.isFunction(t) || t(i, n)) l(i, i.show.delay, b[e] || {},
            function() {
                r.timeStamp = n.timeStamp || +new Date,
                r.showBy = e,
                i.open(n)
            })
        }
    }
    function n(e, t) {
        return function(n) {
            var i = n.data,
            r = i.cache,
            o = n.timeStamp || +new Date;
            if (! (r.showBy === e && o - r.timeStamp < 50)) if (!$.isFunction(t) || t(i, n)) l(i, i.hide.delay, _[e] || {},
            function() {
                r.timeStamp = o,
                r.hideBy = e,
                i.close(n)
            })
        }
    }
    function i(e, t) {
        $.each(e.cache.showTrigger,
        function(n, i) {
            v[i][t](e)
        })
    }
    function r(e, t) {
        $.each(e.cache.hideTrigger,
        function(n, i) {
            y[i][t](e)
        })
    }
    function o(e, t) {
        if (e) e.type = t;
        else e = t;
        return e
    }
    function a(e, t) {
        var n = e.layer,
        i = e.cache.target = t && t.target,
        r = n.data(w);
        if (r) {
            if (r.layer === i) return ! 1;
            r.close()
        }
        return e.emit(o(t, "beforeShow"))
    }
    function s(e) {
        i(e, "off"),
        r(e, "on");
        var t = e.cache.target;
        if (t) e.layer.data(w, {
            element: t,
            close: $.proxy(e.close, e)
        });
        return e.emit("afterShow")
    }
    function c(e, t) {
        return e.emit(o(t, "beforeHide"))
    }
    function u(e) {
        return e.layer.removeData(w),
        r(e, "off"),
        i(e, "on"),
        e.emit("afterHide")
    }
    function l(e, t, n, i) {
        var r = e.cache;
        if (t > 0) {
            if (r.delayTimer) return;
            var o = n.on,
            a = n.off,
            s = function() {
                if (d(e)) {
                    if ($.isFunction(a)) a(e, s);
                    return ! 0
                }
            };
            if (r.delayTimer = setTimeout(function() {
                if (s()) i()
            },
            t), $.isFunction(o)) o(e, s)
        } else i()
    }
    function d(e) {
        var t = e.cache;
        if (t && t.delayTimer) return clearTimeout(t.delayTimer),
        t.delayTimer = null,
        !0;
        else return void 0
    }
    var f = require("../function/split"),
    m = require("../function/contains"),
    p = require("../function/jquerify"),
    h = require("../function/lifeCycle"),
    g = require("../util/instance");
    e.prototype = {
        constructor: e,
        type: "Popup",
        init: function() {
            var e = this,
            t = e.show,
            n = e.hide;
            e.cache = {
                showTrigger: t.trigger ? f(t.trigger, ",") : [],
                hideTrigger: n.trigger ? f(n.trigger, ",") : []
            };
            var o = e.hidden = e.layer.is(":hidden"),
            a = o ? i: r;
            a(e, "on")
        },
        open: function() {
            var e = this,
            t = a(e, arguments[0]);
            if (!t.isDefaultPrevented()) {
                var n = e.show.animation;
                if ($.isFunction(n)) n.call(e);
                else e.layer.show();
                e.hidden = !1,
                s(e, t)
            }
        },
        close: function() {
            var e = this;
            if (!e.hidden) {
                var t = c(e, arguments[0]);
                if (!t.isDefaultPrevented()) {
                    var n = e.hide.animation;
                    if ($.isFunction(n)) n.call(e);
                    else e.layer.hide();
                    e.hidden = !0,
                    u(e)
                }
            }
        },
        dispose: function() {
            var e = this;
            h.dispose(e),
            e.close(),
            i(e, "off"),
            e.element = e.layer = e.cache = null
        }
    },
    p(e.prototype),
    e.defaultOptions = {
        show: {},
        hide: {}
    };
    var v = {
        focus: {
            on: function(e) {
                e.element.on("focus", e, v.focus.handler)
            },
            off: function(e) {
                e.element.off("focus", v.focus.handler)
            },
            handler: t("focus")
        },
        click: {
            on: function(e) {
                e.element.on("click", e, v.click.handler)
            },
            off: function(e) {
                e.element.off("click", v.click.handler)
            },
            handler: t("click")
        },
        over: {
            on: function(e) {
                e.element.on("mouseenter", e, v.over.handler)
            },
            off: function(e) {
                e.element.off("mouseenter", v.over.handler)
            },
            handler: t("over")
        },
        context: {
            on: function(e) {
                e.element.on("contextmenu", e, v.context.handler)
            },
            off: function(e) {
                e.element.off("contextmenu", v.context.handler)
            },
            handler: t("context")
        }
    },
    y = {
        blur: {
            on: function(e) {
                e.element.on("blur", e, y.blur.handler)
            },
            off: function(e) {
                e.element.off("blur", y.blur.handler)
            },
            handler: n("blur")
        },
        click: {
            on: function(e) {
                g.document.on("click", e, e.cache.clickHandler = y.click.handler())
            },
            off: function(e) {
                var t = e.cache;
                g.document.off("click", t.clickHandler),
                t.clickHandler = null
            },
            handler: function() {
                return n("click",
                function(e, t) {
                    return ! m(e.layer, t.target)
                })
            }
        },
        out: {
            on: function(e) {
                var t = y.out.handler;
                e.element.on("mouseleave", e, t),
                e.layer.on("mouseleave", e, t)
            },
            off: function(e) {
                var t = y.out.handler;
                e.element.off("mouseleave", t),
                e.layer.off("mouseleave", t)
            },
            handler: n("out",
            function(e, t) {
                var n = t.relatedTarget;
                return null == n ? !0 : !m(e.element, n) && !m(e.layer, n)
            })
        },
        context: {
            on: function(e) {
                g.document.on("contextmenu", e, e.cache.contextHandler = y.context.handler())
            },
            off: function(e) {
                var t = e.cache;
                g.document.off("contextmenu", t.contextHandler),
                t.contextHandler = null
            },
            handler: function() {
                return n("context",
                function(e, t) {
                    return ! m(e.layer, t.target)
                })
            }
        }
    },
    b = {
        over: {
            on: function(e, t) {
                e.element.on("mouseleave", t)
            },
            off: function(e, t) {
                e.element.off("mouseleave", t)
            }
        }
    },
    _ = {
        out: {
            on: function(e, t) {
                e.element.on("mouseenter", t),
                e.layer.on("mouseenter", t)
            },
            off: function(e, t) {
                e.element.off("mouseenter", t),
                e.layer.off("mouseenter", t)
            }
        }
    },
    w = "__currentSource__";
    return e
}),
define("cobble/ui/ComboBox", ["require", "exports", "module", "../function/jquerify", "../function/lifeCycle", "../helper/Popup"],
function(require) {
    "use strict";
    function e(e) {
        return i.init(this, e)
    }
    function t(e) {
        var t = e.element || e.button,
        n = e.openClass,
        i = e.show,
        o = e.hide;
        if (!i.trigger) i.trigger = "click";
        if (!o.trigger) o.trigger = "click";
        var a = i.animation;
        if ($.isFunction(a)) i.animation = $.proxy(a, e);
        if (a = o.animation, $.isFunction(a)) o.animation = $.proxy(a, e);
        return new r({
            element: e.button,
            layer: e.menu,
            show: i,
            hide: o,
            onBeforeShow: function(t) {
                e.emit(t)
            },
            onBeforeHide: function(t) {
                e.emit(t)
            },
            onAfterShow: function(i) {
                if (n) t.addClass(n);
                e.emit(i)
            },
            onAfterHide: function(i) {
                if (n) t.removeClass(n);
                e.emit(i)
            }
        })
    }
    var n = require("../function/jquerify"),
    i = require("../function/lifeCycle"),
    r = require("../helper/Popup");
    e.prototype = {
        constructor: e,
        type: "ComboBox",
        init: function() {
            var e = this;
            e.popup = t(e);
            var n = e.menu;
            if (null == e.value) {
                var i = n.find("." + e.activeClass);
                if (1 === i.length) e.value = i.data("value")
            }
            if (e.data) n.html(e.renderTemplate(e.data, e.template));
            if (null != e.value) e.setValue(e.value, {
                force: !0,
                silence: !0
            });
            n.on("click" + o, "[data-value]",
            function() {
                e.setValue($(this).data("value")),
                e.close()
            })
        },
        getValue: function() {
            return this.value
        },
        setValue: function(e, t) {
            var n, i = this,
            r = i.menu,
            o = r.find('[data-value="' + e + '"]');
            if (1 === o.length) {
                if (n = o.data(), null == n.text) n.text = o.html()
            } else n = {};
            if (t = t || {},
            t.force || e != i.value) {
                var a = i.activeClass;
                if (a) r.find("." + a).removeClass(a);
                if (1 === o.length) {
                    if (i.value = e, a) o.addClass(a)
                } else i.value = null;
                if (!t.silence) i.emit("change", n)
            }
            if ($.isFunction(i.setText)) i.setText(n.text || i.defaultText)
        },
        refresh: function(e) {
            var t = this,
            n = t.value,
            i = {};
            if (e) {
                var r = e.data;
                if (r) t.menu.html(t.renderTemplate(r, t.template));
                if ("value" in e) n = e.value,
                i.force = !0
            }
            t.setValue(n, i)
        },
        open: function() {
            this.popup.open()
        },
        close: function() {
            this.popup.close()
        },
        dispose: function() {
            var e = this;
            i.dispose(e),
            e.menu.off(o),
            e.popup.dispose(),
            e.popup = e.button = e.menu = null
        }
    },
    n(e.prototype),
    e.defaultOptions = {
        show: {},
        hide: {}
    };
    var o = ".cobble_ui_combobox";
    return e
}),
define("cobble/form/Select", ["require", "exports", "module", "../ui/ComboBox", "../function/jquerify", "../function/lifeCycle"],
function(require) {
    "use strict";
    function e(e) {
        return i.init(this, e)
    }
    var t = require("../ui/ComboBox"),
    n = require("../function/jquerify"),
    i = require("../function/lifeCycle");
    return e.prototype = {
        constructor: e,
        type: "Select",
        init: function() {
            var e = this,
            n = e.element,
            i = '<input type="hidden" name="' + e.name + '"';
            if (null != e.value) i += ' value="' + e.value + '"';
            if (n.attr("required")) i += " required";
            i += " />";
            var r = e.input = $(i);
            n.append(r),
            e.comboBox = new t({
                element: n,
                button: n.find(e.buttonSelector),
                menu: n.find(e.menuSelector),
                data: e.data,
                value: e.value,
                defaultText: e.defaultText,
                template: e.template,
                renderTemplate: e.renderTemplate,
                activeClass: e.activeClass,
                openClass: e.openClass,
                setText: $.proxy(e.setText, e),
                onChange: function(t, n) {
                    if (e.setValue(n.value), !e.silence) e.emit("change", n)
                },
                onAfterShow: function() {
                    n.trigger("focusin")
                },
                onAfterHide: function() {
                    n.trigger("focusout")
                }
            })
        },
        getValue: function() {
            return this.value
        },
        setValue: function(e, t) {
            var n = this;
            if (t = t || {},
            t.force || e != n.value) n.value = e,
            n.input.val(null == e ? "": e),
            n.silence = t.silence,
            n.comboBox.setValue(e),
            delete n.silence
        },
        refresh: function(e) {
            this.comboBox.refresh(e)
        },
        dispose: function() {
            var e = this;
            i.dispose(e),
            e.comboBox.dispose(),
            e.input = e.element = e.comboBox = null
        }
    },
    n(e.prototype),
    e.defaultOptions = {
        defaultText: "请选择",
        buttonSelector: ".btn-default",
        menuSelector: ".dropdown-menu",
        labelSelector: ".btn-default span",
        activeClass: "active",
        openClass: "open",
        renderTemplate: function(e) {
            var t = [];
            return $.each(e,
            function(e, n) {
                var i = [];
                $.each(n,
                function(e, t) {
                    if ("text" !== e && null != t) i.push("data-" + e + '="' + t + '"')
                }),
                t.push("<li " + i.join(" ") + ">" + n.text + "</li>")
            }),
            t.join("")
        },
        setText: function(e) {
            this.element.find(this.labelSelector).html(e)
        }
    },
    e
}),
define("common/component/RegionSelect", ["require", "cobble/form/Select", "common/service", "common/store"],
function(require) {
    "use strict";
    function e(e) {
        $.extend(this, e),
        this.init()
    }
    function t(e, t) {
        setTimeout(function() {
            e.resolve(t)
        },
        0)
    }
    function n() {
        var e = $.Deferred();
        if (d) t(e, $.extend(!0, [], d));
        else u.getRegionList({
            level: 1
        }).done(function(n) {
            d = n,
            t(e, $.extend(!0, [], n))
        });
        return e
    }
    function i(e) {
        var n = $.Deferred();
        if (!e) t(n, []);
        else if (f[e]) t(n, $.extend(!0, [], f[e]));
        else u.getRegionList({
            id: e,
            level: 2
        }).done(function(i) {
            f[e] = i,
            t(n, $.extend(!0, [], i))
        });
        return n
    }
    function r(e) {
        var n = $.Deferred();
        if (!e) t(n, []);
        else if (m[e]) t(n, $.extend(!0, [], m[e]));
        else u.getRegionList({
            id: e,
            level: 3
        }).done(function(i) {
            m[e] = i,
            t(n, $.extend(!0, [], i))
        });
        return n
    }
    function o(e) {
        var n = $.Deferred();
        if (!e) t(n, []);
        else if (p[e]) t(n, $.extend(!0, [], p[e]));
        else u.getRegionList({
            id: e,
            level: 4
        }).done(function(i) {
            p[e] = i,
            t(n, $.extend(!0, [], i))
        });
        return n
    }
    function a(e) {
        return $.map(e || [],
        function(e) {
            return {
                text: e.name,
                value: e.id
            }
        })
    }
    function s(e, t, n) {
        e.refresh({
            data: a(t),
            value: null != n ? n: null
        })
    }
    var c = require("cobble/form/Select"),
    u = require("common/service"),
    l = require("common/store");
    e.prototype = {
        init: function() {
            var e = this,
            t = e.element,
            n = e.prefix || "";
            e.provinceSelect = new c({
                element: t.find(".province"),
                defaultText: e.provinceText || "- 省 -",
                name: n + "province",
                onChange: function(t, n) {
                    if (i(n.value).done(function(t) {
                        if ("1" == l.get("user").globalDistrict) if (e.eachAll && t.length > 1) t.unshift({
                            id: n.value,
                            name: "全省"
                        });
                        s(e.citySelect, t, 1 === t.length ? t[0].id: null)
                    }), $.isFunction(e.onProvinceChange)) e.onProvinceChange(n)
                }
            }),
            e.citySelect = new c({
                element: t.find(".city"),
                defaultText: e.cityText || "- 市 -",
                name: n + "city",
                onChange: function(t, n) {
                    if (r(n.value).done(function(t) {
                        if (e.eachAll) t.unshift({
                            id: n.value,
                            name: "全市"
                        });
                        s(e.areaSelect, t, null)
                    }), $.isFunction(e.onCityChange)) e.onCityChange(n)
                }
            }),
            e.areaSelect = new c({
                element: t.find(".area"),
                defaultText: e.areaText || "- 区 -",
                name: n + "area",
                onChange: function(t, n) {
                    if (o(n.value).done(function(t) {
                        if (e.eachAll) t.unshift({
                            id: n.value,
                            name: "全部"
                        });
                        s(e.countrySelect, t, null)
                    }), $.isFunction(e.onAreaChange)) e.onAreaChange(n)
                }
            }),
            e.countrySelect = new c({
                element: t.find(".country"),
                defaultText: e.countrySelect || "- 商圈 -",
                name: n + "country",
                onChange: function(t, n) {
                    if ($.isFunction(e.onCountryChange)) e.onCountryChange(n)
                }
            }),
            e.refresh()
        },
        refresh: function(e) {
            var t = this;
            if (e) $.extend(t, e);
            var a = t.provinceSelect.onChange,
            c = t.citySelect.onChange,
            u = t.areaSelect.onChange,
            d = t.countrySelect.onChange;
            t.provinceSelect.onChange = t.citySelect.onChange = t.areaSelect.onChange = t.countrySelect.onChange = null,
            $.when(n(), i(t.provinceId), r(t.cityId), o(t.areaId)).done(function(e, n, i, r) {
                if ("1" == l.get("user").globalDistrict) if (t.eachAll) e.unshift({
                    id: 0,
                    name: "全国"
                });
                if (s(t.provinceSelect, e, t.provinceId), s(t.citySelect, n, t.cityId), s(t.areaSelect, i, t.areaId), s(t.countrySelect, r, t.countryId), t.provinceSelect.onChange = a, t.citySelect.onChange = c, t.areaSelect.onChange = u, t.countrySelect.onChange = d, $.isFunction(t.callback)) t.callback()
            })
        }
    };
    var d = null,
    f = {},
    m = {},
    p = {};
    return e
}),
define("cobble/util/etpl", [],
function() {
    function e(e, t) {
        for (var n in t) if (t.hasOwnProperty(n)) e[n] = t[n];
        return e
    }
    function t() {
        this.raw = [],
        this.length = 0
    }
    function n() {
        return "___" + T++
    }
    function i(e, t) {
        var n = new Function;
        n.prototype = t.prototype,
        e.prototype = new n,
        e.prototype.constructor = e
    }
    function r(e) {
        return P[e]
    }
    function o(e) {
        return '"' + e.replace(/\x5C/g, "\\\\").replace(/"/g, '\\"').replace(/\x0A/g, "\\n").replace(/\x09/g, "\\t").replace(/\x0D/g, "\\r") + '"'
    }
    function a(e) {
        return e.replace(/[\^\[\]\$\(\)\{\}\?\*\.\+]/g,
        function(e) {
            return "\\" + e
        })
    }
    function s(e) {
        var t = arguments;
        return e.replace(/\{([0-9]+)\}/g,
        function(e, n) {
            return t[n - 0 + 1]
        })
    }
    function c(e) {
        return e = e.replace(/^\s*\*/, ""),
        s('gv({0},["{1}"])', o(e), e.replace(/\[['"]?([^'"]+)['"]?\]/g,
        function(e, t) {
            return "." + t
        }).split(".").join('","'))
    }
    function u(e, t, n, i, r, o) {
        for (var a = n.length,
        s = e.split(t), c = 0, u = [], l = 0, d = s.length; d > l; l++) {
            var f = s[l];
            if (l) {
                var m = 1;
                for (c++;;) {
                    var p = f.indexOf(n);
                    if (0 > p) {
                        u.push(c > 1 && m ? t: "", f);
                        break;
                    }
                    if (c = i ? c - 1 : 0, u.push(c > 0 && m ? t: "", f.slice(0, p), c > 0 ? n: ""), f = f.slice(p + a), m = 0, 0 === c) break;
                }
                if (0 === c) r(u.join("")),
                o(f),
                u = []
            } else f && o(f)
        }
        if (c > 0 && u.length > 0) o(t),
        o(u.join(""))
    }
    function l(e, t, n) {
        var i, r = [],
        a = t.options,
        s = "",
        d = "",
        f = "",
        m = "";
        if (n) s = "ts(",
        d = ")",
        f = M,
        m = q,
        i = a.defaultFilter;
        return u(e, a.variableOpen, a.variableClose, 1,
        function(e) {
            if (n && e.indexOf("|") < 0 && i) e += "|" + i;
            var o = e.indexOf("|"),
            a = (o > 0 ? e.slice(0, o) : e).replace(/^\s+/, "").replace(/\s+$/, ""),
            u = o > 0 ? e.slice(o + 1) : "",
            p = 0 === a.indexOf("*"),
            h = [p ? "": s, c(a), p ? "": d];
            if (u) {
                u = l(u, t);
                for (var g = u.split("|"), v = 0, y = g.length; y > v; v++) {
                    var b = g[v];
                    if (/^\s*([a-z0-9_-]+)(\((.*)\))?\s*$/i.test(b)) {
                        if (h.unshift('fs["' + RegExp.$1 + '"]('), RegExp.$3) h.push(",", RegExp.$3);
                        h.push(")")
                    }
                }
            }
            r.push(f, h.join(""), m)
        },
        function(e) {
            r.push(f, n ? o(e) : e, m)
        }),
        r.join("")
    }
    function d(e, t) {
        this.value = e,
        this.engine = t
    }
    function f(e, t) {
        this.value = e,
        this.engine = t,
        this.children = [],
        this.cloneProps = []
    }
    function m(e, t) {
        var n = e.stack,
        i = t ? n.find(function(e) {
            return e instanceof t
        }) : n.bottom();
        if (i) {
            for (var r; (r = n.top()) !== i;) {
                if (!r.autoClose) throw new Error(r.type + " must be closed manually: " + r.value);
                r.autoClose(e)
            }
            i.close(e)
        }
        return i
    }
    function p(e, t) {
        if (!/^\s*([a-z0-9\/_-]+)\s*(\(\s*master\s*=\s*([a-z0-9\/_-]+)\s*\))?\s*/i.test(e)) throw new Error("Invalid " + this.type + " syntax: " + e);
        this.master = RegExp.$3,
        this.name = RegExp.$1,
        f.call(this, e, t),
        this.blocks = {}
    }
    function h(e, t) {
        if (!/^\s*([a-z0-9\/_-]+)\s*$/i.test(e)) throw new Error("Invalid " + this.type + " syntax: " + e);
        this.name = RegExp.$1,
        f.call(this, e, t),
        this.cloneProps = ["name"]
    }
    function g(e, t) {
        if (!/^\s*([a-z0-9\/_-]+)\s*$/i.test(e)) throw new Error("Invalid " + this.type + " syntax: " + e);
        this.name = RegExp.$1,
        f.call(this, e, t),
        this.cloneProps = ["name", "state", "blocks"],
        this.blocks = {}
    }
    function v(e, t) {
        if (!/^\s*([a-z0-9_]+)\s*=([\s\S]*)$/i.test(e)) throw new Error("Invalid " + this.type + " syntax: " + e);
        this.name = RegExp.$1,
        this.expr = RegExp.$2,
        f.call(this, e, t),
        this.cloneProps = ["name", "expr"]
    }
    function y(e, t) {
        if (!/^\s*([a-z0-9_-]+)\s*(\(([\s\S]*)\))?\s*$/i.test(e)) throw new Error("Invalid " + this.type + " syntax: " + e);
        this.name = RegExp.$1,
        this.args = RegExp.$3,
        f.call(this, e, t),
        this.cloneProps = ["name", "args"]
    }
    function b(e, t) {
        if (!/^\s*([a-z0-9\/_-]+)\s*(\(([\s\S]*)\))?\s*$/i.test(e)) throw new Error("Invalid " + this.type + " syntax: " + e);
        this.name = RegExp.$1,
        this.args = RegExp.$3,
        f.call(this, e, t),
        this.cloneProps = ["name", "args"]
    }
    function _(e, t) {
        var n = new RegExp(s("^\\s*({0}[\\s\\S]+{1})\\s+as\\s+{0}([0-9a-z_]+){1}\\s*(,\\s*{0}([0-9a-z_]+){1})?\\s*$", a(t.options.variableOpen), a(t.options.variableClose)), "i");
        if (!n.test(e)) throw new Error("Invalid " + this.type + " syntax: " + e);
        this.list = RegExp.$1,
        this.item = RegExp.$2,
        this.index = RegExp.$4,
        f.call(this, e, t),
        this.cloneProps = ["list", "item", "index"]
    }
    function w(e, t) {
        f.call(this, e, t)
    }
    function x(e, t) {
        w.call(this, e, t)
    }
    function C(e, t) {
        f.call(this, e, t)
    }
    function $(e, t) {
        t.target = e;
        var n = t.engine,
        i = e.name;
        if (n.targets[i]) switch (n.options.namingConflict) {
        case "override":
            n.targets[i] = e,
            t.targets.push(i);
        case "ignore":
            break;
        default:
            throw new Error("Target exists: " + i)
        } else n.targets[i] = e,
        t.targets.push(i)
    }
    function k(e, t) {
        j[e] = t,
        t.prototype.type = e
    }
    function S(t) {
        this.options = {
            commandOpen: "<!--",
            commandClose: "-->",
            commandSyntax: /^\s*(\/)?([a-z]+)\s*(?::([\s\S]*))?$/,
            variableOpen: "${",
            variableClose: "}",
            defaultFilter: "html"
        },
        this.config(t),
        this.targets = {},
        this.filters = e({},
        N)
    }
    function I(e, n) {
        function i() {
            var e;
            if (p.length > 0 && (e = p.join(""))) {
                var t = new d(e, n);
                if (t.beforeAdd(l), c.top().addChild(t), p = [], n.options.strip && l.current instanceof f) t.value = e.replace(/^[\x20\t\r]*\n/, "");
                l.current = t
            }
        }
        var r, o = n.options.commandOpen,
        a = n.options.commandClose,
        s = n.options.commandSyntax,
        c = new t,
        l = {
            engine: n,
            targets: [],
            stack: c,
            target: null
        },
        p = [];
        return u(e, o, a, 0,
        function(e) {
            var t = s.exec(e);
            if (t && (r = j[t[2].toLowerCase()]) && "function" == typeof r) {
                i();
                var c = l.current;
                if (n.options.strip && c instanceof d) c.value = c.value.replace(/\r?\n[\x20\t]*$/, "\n");
                if (t[1]) c = m(l, r);
                else {
                    if (c = new r(t[3], n), "function" == typeof c.beforeOpen) c.beforeOpen(l);
                    c.open(l)
                }
                l.current = c
            } else if (!/^\s*\/\//.test(e)) p.push(o, e, a);
            r = null
        },
        function(e) {
            p.push(e)
        }),
        i(),
        m(l),
        l.targets
    }
    t.prototype = {
        push: function(e) {
            this.raw[this.length++] = e
        },
        pop: function() {
            if (this.length > 0) {
                var e = this.raw[--this.length];
                return this.raw.length = this.length,
                e
            }
        },
        top: function() {
            return this.raw[this.length - 1]
        },
        bottom: function() {
            return this.raw[0]
        },
        find: function(e) {
            for (var t = this.length; t--;) {
                var n = this.raw[t];
                if (e(n)) return n
            }
        }
    };
    var T = 178245,
    P = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    },
    N = {
        html: function(e) {
            return e.replace(/[&<>"']/g, r)
        },
        url: encodeURIComponent,
        raw: function(e) {
            return e
        }
    },
    R = 'var r="";',
    M = "r+=",
    q = ";",
    D = "return r;";
    if ("undefined" != typeof navigator && /msie\s*([0-9]+)/i.test(navigator.userAgent) && RegExp.$1 - 0 < 8) R = "var r=[],ri=0;",
    M = "r[ri++]=",
    D = 'return r.join("");';
    d.prototype = {
        getRendererBody: function() {
            var e = this.value,
            t = this.engine.options;
            if (!e || t.strip && /^\s*$/.test(e)) return "";
            else return l(e, this.engine, 1)
        },
        clone: function() {
            return this
        }
    },
    f.prototype = {
        addChild: function(e) {
            this.children.push(e)
        },
        open: function(e) {
            var t = e.stack.top();
            t && t.addChild(this),
            e.stack.push(this)
        },
        close: function(e) {
            if (e.stack.top() === this) e.stack.pop()
        },
        getRendererBody: function() {
            for (var e = [], t = this.children, n = 0; n < t.length; n++) e.push(t[n].getRendererBody());
            return e.join("")
        },
        clone: function() {
            for (var e = new this.constructor(this.value, this.engine), t = 0, n = this.children.length; n > t; t++) e.addChild(this.children[t].clone());
            for (var t = 0,
            n = this.cloneProps.length; n > t; t++) {
                var i = this.cloneProps[t];
                e[i] = this[i]
            }
            return e
        }
    };
    var O = 'data=data||{};var v={},fs=engine.filters,hg=typeof data.get=="function",gv=function(n,ps){var p=ps[0],d=v[p];if(d==null){if(hg){return data.get(n);}d=data[p];}for(var i=1,l=ps.length;i<l;i++)if(d!=null)d = d[ps[i]];return d;},ts=function(s){if(typeof s==="string"){return s;}if(s==null){s="";}return ""+s;};';
    i(p, f),
    i(h, f),
    i(g, f),
    i(v, f),
    i(y, f),
    i(b, f),
    i(_, f),
    i(w, f),
    i(x, w),
    i(C, w);
    var A = {
        READING: 1,
        READED: 2,
        APPLIED: 3,
        READY: 4
    };
    g.prototype.applyMaster = p.prototype.applyMaster = function(e) {
        function t(e) {
            var i = e.children;
            if (i instanceof Array) for (var r = 0,
            o = i.length; o > r; r++) {
                var a = i[r];
                if (a instanceof h && n[a.name]) a = i[r] = n[a.name];
                t(a)
            }
        }
        if (this.state >= A.APPLIED) return 1;
        var n = this.blocks,
        i = this.engine.targets[e];
        if (i && i.applyMaster(i.master)) return this.children = i.clone().children,
        t(this),
        this.state = A.APPLIED,
        1;
        else return void 0
    },
    p.prototype.isReady = function() {
        function e(i) {
            for (var r = 0,
            o = i.children.length; o > r; r++) {
                var a = i.children[r];
                if (a instanceof g) {
                    var s = t.targets[a.name];
                    n = n && s && s.isReady(t)
                } else if (a instanceof f) e(a)
            }
        }
        if (this.state >= A.READY) return 1;
        var t = this.engine,
        n = 1;
        if (this.applyMaster(this.master)) return e(this),
        n && (this.state = A.READY),
        n;
        else return void 0
    },
    p.prototype.getRenderer = function() {
        if (this.renderer) return this.renderer;
        if (this.isReady()) {
            var e = new Function("data", "engine", [O, R, this.getRendererBody(), D].join("\n")),
            t = this.engine;
            return this.renderer = function(n) {
                return e(n, t)
            },
            this.renderer
        }
        return null
    },
    p.prototype.open = function(e) {
        m(e),
        f.prototype.open.call(this, e),
        this.state = A.READING,
        $(this, e)
    },
    v.prototype.open = b.prototype.open = function(e) {
        e.stack.top().addChild(this)
    },
    h.prototype.open = function(e) {
        f.prototype.open.call(this, e),
        (e.imp || e.target).blocks[this.name] = this
    },
    x.prototype.open = function(e) {
        var t = new C;
        t.open(e);
        var n = m(e, w);
        n.addChild(this),
        e.stack.push(this)
    },
    C.prototype.open = function(e) {
        var t = m(e, w);
        t.addChild(this),
        e.stack.push(this)
    },
    g.prototype.open = function(e) {
        this.parent = e.stack.top(),
        this.target = e.target,
        f.prototype.open.call(this, e),
        this.state = A.READING,
        e.imp = this
    },
    b.prototype.close = v.prototype.close = function() {},
    g.prototype.close = function(e) {
        f.prototype.close.call(this, e),
        this.state = A.READED,
        e.imp = null
    },
    p.prototype.close = function(e) {
        f.prototype.close.call(this, e),
        this.state = this.master ? A.READED: A.APPLIED,
        e.target = null
    },
    g.prototype.autoClose = function(e) {
        var t = this.parent.children;
        t.push.apply(t, this.children),
        this.children.length = 0;
        for (var n in this.blocks) this.target.blocks[n] = this.blocks[n];
        this.blocks = {},
        this.close(e)
    },
    b.prototype.beforeOpen = g.prototype.beforeOpen = v.prototype.beforeOpen = _.prototype.beforeOpen = y.prototype.beforeOpen = h.prototype.beforeOpen = w.prototype.beforeOpen = d.prototype.beforeAdd = function(e) {
        if (!e.stack.bottom()) {
            var t = new p(n(), e.engine);
            t.open(e)
        }
    },
    g.prototype.getRendererBody = function() {
        return this.applyMaster(this.name),
        f.prototype.getRendererBody.call(this)
    },
    b.prototype.getRendererBody = function() {
        return s("{0}engine.render({2},{{3}}){1}", M, q, o(this.name), l(this.args, this.engine).replace(/(^|,)\s*([a-z0-9_]+)\s*=/gi,
        function(e, t, n) {
            return (t || "") + o(n) + ":"
        }))
    },
    v.prototype.getRendererBody = function() {
        if (this.expr) return s("v[{0}]={1};", o(this.name), l(this.expr, this.engine));
        else return ""
    },
    w.prototype.getRendererBody = function() {
        return s("if({0}){{1}}", l(this.value, this.engine), f.prototype.getRendererBody.call(this))
    },
    C.prototype.getRendererBody = function() {
        return s("}else{{0}", f.prototype.getRendererBody.call(this))
    },
    _.prototype.getRendererBody = function() {
        return s('var {0}={1};if({0} instanceof Array)for (var {4}=0,{5}={0}.length;{4}<{5};{4}++){v[{2}]={4};v[{3}]={0}[{4}];{6}}else if(typeof {0}==="object")for(var {4} in {0}){v[{2}]={4};v[{3}]={0}[{4}];{6}}', n(), l(this.list, this.engine), o(this.index || n()), o(this.item), n(), n(), f.prototype.getRendererBody.call(this))
    },
    y.prototype.getRendererBody = function() {
        var e = this.args;
        return s("{2}fs[{5}]((function(){{0}{4}{1}})(){6}){3}", R, D, M, q, f.prototype.getRendererBody.call(this), o(this.name), e ? "," + l(e, this.engine) : "")
    };
    var j = {};
    k("target", p),
    k("block", h),
    k("import", g),
    k("use", b),
    k("var", v),
    k("for", _),
    k("if", w),
    k("elif", x),
    k("else", C),
    k("filter", y),
    S.prototype.config = function(t) {
        e(this.options, t)
    },
    S.prototype.compile = S.prototype.parse = function(e) {
        if (e) {
            var t = I(e, this);
            if (t.length) return this.targets[t[0]].getRenderer()
        }
        return new Function('return ""')
    },
    S.prototype.getRenderer = function(e) {
        var t = this.targets[e];
        if (t) return t.getRenderer();
        else return void 0
    },
    S.prototype.render = function(e, t) {
        var n = this.getRenderer(e);
        if (n) return n(t);
        else return ""
    },
    S.prototype.addFilter = function(e, t) {
        if ("function" == typeof t) this.filters[e] = t
    };
    var L = new S;
    return L.Engine = S,
    L
}),
define("common/component/Captcha", ["require", "cobble/form/Validator", "common/service"],
function(require) {
    "use strict";
    function e(e) {
        $.extend(this, e),
        this.init()
    }
    function t() {
        var e = this;
        return {
            captcha: {
                errors: {
                    required: "请输入验证码",
                    minlength: "请输入 4 位验证码",
                    maxlength: "请输入 4 位验证码"
                },
                custom: function(t, n) {
                    var r = {
                        captcha: e.newCaptcha,
                        captcha_name: e.captchaName
                    };
                    if ($.isFunction(e.onBeforeValidate)) e.onBeforeValidate();
                    i.validateCaptcha(r, {
                        errorHandler: {
                            1 : function() {}
                        }
                    }).done(function(e) {
                        if (0 === e.code) n();
                        else n("请输入正确的验证码")
                    })
                }
            }
        }
    }
    var n = require("cobble/form/Validator"),
    i = require("common/service");
    return e.prototype = {
        init: function() {
            var e = this,
            i = e.element,
            r = i.find('input[name="captcha"]');
            e.input = r,
            e.captchaName = e.captchaName || "",
            e.newCaptcha = "",
            e.isValid = !1,
            e.needAuth = !0,
            e.captchaValidator = new n({
                element: i,
                fields: t.call(e),
                onAfterValidate: function(t, n) {
                    if (0 === n.errors.length) {
                        if (e.needAuth = !1, e.isValid = !0, $.isFunction(e.onValid)) e.onValid()
                    } else if (e.isValid = !1, $.isFunction(e.onInvalid)) e.onInvalid()
                }
            });
            var o;
            e.element.on("click", ".btn-change-captcha",
            function() {
                if (e.captchaName) $(".captcha-image").prop("src", "/captcha?captcha_name=" + e.captchaName + "&" + $.now());
                else $(".captcha-image").prop("src", "/captcha?" + $.now());
                if ($.isFunction(e.onBeforeValidate)) e.onBeforeValidate();
                e.needAuth = !0,
                r.val("")
            }),
            r.on("blur",
            function(t) {
                var n = $(t.currentTarget);
                if (e.newCaptcha = n.val(), o != e.newCaptcha || e.needAuth) e.captchaValidator.validate();
                return o = n.val(),
                !1
            })
        },
        validate: function() {
            return this.captchaValidator.validate(),
            this.isValid
        },
        getValue: function() {
            return this.input.val()
        }
    },
    e
}),
define("common/component/MobileInput", ["require", "exports", "common/service", "cobble/ui/ComboBox", "cobble/util/etpl"],
function(require) {
    "use strict";
    function e(e) {
        $.extend(this, e),
        this.init()
    }
    var t = require("common/service"),
    n = require("cobble/ui/ComboBox"),
    i = require("cobble/util/etpl"),
    r = i.compile('<!-- for: ${list} as ${item} --><li data-value="${item.value}" data-valuecode="${item.valueCode}" data-text="${item.text}" data-pic="${item.pic}" data-code="${item.code}"><i class="icon icon-check"></i>${item.text}</li><!-- /for -->'),
    o = !1;
    return e.prototype = {
        init: function() {
            var e = this,
            i = e.element;
            e.wrapper = i.find(".wrapper");
            var o = i.find(".flag"),
            a = i.find(".tel-code"),
            s = i.find('input[name="mobile"]');
            e.mobile = s;
            var c = new n({
                element: i.find(".tel-code-select"),
                button: i.find(".trigger"),
                menu: i.find(".dropdown-menu"),
                activeClass: "active",
                data: null,
                renderTemplate: function(e) {
                    return r({
                        list: e
                    })
                },
                onChange: function(t, n) {
                    if (o.prop("src", n.pic), e.value = n.valuecode, e.code = n.code, "+86" !== n.code) {
                        var i = e.value.length;
                        s.attr("pattern", "^\\d{" + (7 - i) + "," + (20 - i) + "}$")
                    } else s.removeAttr("pattern");
                    if (a.text(n.code), $.isFunction(e.onChange)) e.onChange()
                }
            });
            e.select = c,
            t.getInternationalCode().done(function(t) {
                if (0 === t.code) {
                    var n = t.data;
                    $.each(n,
                    function(e, t) {
                        var n = t.value;
                        t.value = e,
                        t.valueCode = n
                    }),
                    e.data = n,
                    c.refresh({
                        data: n
                    }),
                    c.setValue(0)
                }
            })
        },
        getValue: function() {
            return this.value
        },
        getMobile: function() {
            var e;
            if (this.isInternational()) e = this.value + this.mobile.val();
            else e = this.mobile.val();
            return $.trim(e)
        },
        isInternational: function() {
            return void 0 === this.code ? !1 : "+86" !== this.code
        },
        disableInternational: function() {
            this.wrapper.removeClass("enable-international"),
            this.wrapper.addClass("disable-international"),
            this.code = "+86",
            this.mobile.removeAttr("pattern"),
            this.mobile.val("")
        },
        enableInternational: function() {
            if (this.wrapper.removeClass("disable-international"), this.wrapper.addClass("enable-international"), !o && this.data) this.select.refresh({
                data: this.data.slice(1)
            }),
            o = !0;
            this.select.setValue(1),
            this.mobile.val("")
        }
    },
    e
}),
define("static/register", ["require", "exports", "cobble/form/Validator", "cobble/helper/Placeholder", "cobble/util/url", "common/component/CodeButton", "common/component/SaveButton", "common/function/wechatQrcode", "common/form", "common/service", "common/store", "common/component/RegionSelect", "cobble/ui/ComboBox", "cobble/util/etpl", "common/component/Captcha", "common/component/MobileInput"],
function(require, exports) {
    "use strict";
    function e() {
        var e = y.find("#box-header h1");
        if ("teacher" == b) b = "teacher",
        e.html("老师注册")
    }
    function t() {
        for (var e = location.href,
        t = e.split("&"), n = e.split("next="), i = "", r = 0; r < t.length; r++) if (t[r].indexOf("invite_code") > -1) {
            var o = t[r].split("=");
            i = o[1]
        }
        if (n[1]) w.val(decodeURIComponent(n[1])),
        $(".login-in").each(function(e, t) {
            var i = $(t),
            r = i.attr("href");
            i.attr("href", r + "?next=" + n[1])
        });
        if (i) v.find("input").click(),
        v.next().show(),
        _.val(encodeURIComponent(i))
    }
    function n() {
        var e = y.find(".city-select");
        new T({
            element: e,
            provinceText: "请选择",
            cityText: "请选择",
            onProvinceChange: function(e) {
                a = e.text
            },
            onCityChange: function(e) {
                if (e.value) r = e.value,
                o = e.text
            }
        })
    }
    function i(e, t) {
        if (!c.getMobile()) alert("请输入手机号");
        else alert({
            title: "获取语音校验码",
            content: "校验码将以电话形式通知到你，请注意接听",
            buttons: [{
                text: "获取",
                type: "primary",
                handler: function() {
                    if (this.hide(), e === !0) g.sendSMSCode({
                        mobile: c.getMobile(),
                        captcha: s.getValue(),
                        type: "activity-voice"
                    }).done(function(e) {
                        if (t.resolve) t.resolve(e)
                    });
                    else g.sendVoiceSMS({
                        mobile: c.getMobile(),
                        captcha: s.getValue()
                    })
                }
            },
            {
                text: "取消",
                handler: function() {
                    this.hide()
                }
            }]
        })
    }
    var r, o, a, s, c, u = require("cobble/form/Validator"),
    l = require("cobble/helper/Placeholder"),
    d = require("cobble/util/url"),
    f = require("common/component/CodeButton"),
    m = require("common/component/SaveButton"),
    p = require("common/function/wechatQrcode"),
    h = require("common/form"),
    g = require("common/service"),
    v = ($("#entrance"), $("#hasinvitecode")),
    y = $("#main"),
    b = y.find("#register-box").data("identity"),
    _ = y.find('input[name="invitecode"]'),
    w = (y.find('input[name="verifycode"]'), y.find('input[name="email"]'), y.find('input[name="password"]'), y.find('input[name="next"]')),
    x = (y.find(".btn-primary"), y.find("#verify-code-error")),
    C = y.find("#mobile-error"),
    k = y.find(".invite-code-error"),
    S = y.find("#verifycodebutton"),
    I = require("common/store"),
    T = require("common/component/RegionSelect"),
    P = (require("cobble/ui/ComboBox"), require("cobble/util/etpl"), require("common/component/Captcha")),
    N = require("common/component/MobileInput");
    exports.init = function() {
        var v = I.get("isArtActivity"),
        _ = I.get("isForceVoice");
        e();
        var w = y.find("#box-header h1").html();
        if ("老师注册" == w) p("wechat-login", 0);
        else p("wechat-login", 2);
        var T, R;
        c = new N({
            element: y.find("#mobile"),
            onChange: function() {
                if (c.isInternational()) T.parent().hide();
                else if (R.isCounting) T.parent().show()
            }
        });
        var M = new u({
            realtime: !0,
            element: $("#register-form"),
            fields: {
                invitecode: {
                    errors: {
                        required: "请输入邀请码"
                    }
                },
                mobile: {
                    errors: {
                        required: "请输入手机号",
                        pattern: "请输入正确的手机号"
                    }
                },
                verifycode: {
                    errors: {
                        required: "请输入校验码",
                        pattern: "请输入校验码"
                    }
                },
                email: {
                    errors: {
                        required: "请输入邮箱",
                        pattern: "邮箱格式错误"
                    }
                },
                password: {
                    custom: function(e) {
                        var t = $.trim(e.val());
                        if (!t) return "请输入密码";
                        var n = t.length;
                        if (8 > n || n > 16) return "请输入 8-16 位密码";
                        var i = (/\d/.test(t) ? 1 : 0) + (/[a-z]/i.test(t) ? 1 : 0) + (/[^1-9a-z]/.test(t) ? 1 : 0);
                        if (2 > i) return "数字、字母、字符至少包含两种";
                        else return ! 0
                    }
                },
                password_confirm: {
                    errors: {
                        required: "请输入密码",
                        equals: "两次输入的密码不一致"
                    }
                },
                school: {
                    errors: {
                        required: "请输入学校"
                    }
                }
            }
        }),
        q = new m({
            element: y.find(".btn-primary"),
            saveText: "正在发送...",
            save: function() {
                var e = M.validate();
                if (e = s.validate() && e) {
                    var t = h.parse(M.element);
                    if (t.mobile = c.getMobile(), v) if (void 0 === r) return void alert("请选择省份城市");
                    else t.province = a,
                    t.city = o,
                    t.cooperation = "ChengDuArt";
                    if ("老师注册" == w) b = "teacher",
                    g.registerTeacher(t).done(function(e) {
                        if (0 === e.code) success("注册成功",
                        function() {
                            location.href = e.data.redirect_url
                        })
                    });
                    else g.registerStudent(t).done(function(e) {
                        if (0 === e.code) success("注册成功",
                        function() {
                            location.href = e.data.redirect_url
                        })
                    })
                }
            }
        });
        if (y.on("click", ".btn-change-captcha",
        function() {
            $(".captcha-image").prop("src", "/captcha?" + $.now())
        }).on("click", ".other-login .icon",
        function() {
            var e = $(this),
            t = e.data("way"),
            n = d.parseQuery(location.search);
            location.href = "/connect/login/" + t + "/" + n.user_type
        }).on("click", "#hasinvitecode .form-checkbox",
        function() {
            var e = $(this),
            t = e.parent().next(),
            n = e.find("input");
            if (n.is(":checked")) t.show();
            else t.hide()
        }).on("blur", 'input[name="mobile"]',
        function() {
            if (M.validate("mobile")) {
                O();
                var e = $(this);
                g.checkMobileRegister({
                    mobile: c.getMobile()
                }).done(function(t) {
                    if (0 === t.code) {
                        var n = t.data;
                        if (n.exist) {
                            var i = e.parents(".form-group");
                            i.find(".error").html('<i class="icon icon-times-circle"></i>  手机号已存在'),
                            i.removeClass("has-success").addClass("has-error")
                        }
                    }
                })
            } else A()
        }).on("click", ".wechat .help",
        function() {
            y.find("#wechat-login").hide(),
            y.find(".wechat-help").show(),
            $(this).removeClass("help").addClass("scan").text("扫码登录")
        }).on("click", ".wechat .scan",
        function() {
            y.find("#wechat-login").show(),
            y.find(".wechat-help").hide(),
            $(this).removeClass("scan").addClass("help").text("使用帮助")
        }), _) T = y.find(".voice-code-btn");
        else T = y.find(".voice-code-link span"),
        T.on("click", i);
        l.init(y.find("[placeholder]"));
        var D = y.find("#verify-code");
        if (_) R = new f({
            element: T,
            send: function() {
                var e = $.Deferred();
                return i(!0, e),
                e.promise()
            },
            onTextChange: function() {
                D.outerWidth(260 - R.element.outerWidth())
            }
        });
        else R = new f({
            element: S,
            send: function() {
                if (!c.isInternational()) T.parent().show();
                return D.width(102),
                g.sendSMSCode({
                    mobile: c.getMobile(),
                    captcha: s.getValue()
                })
            },
            onTextChange: function() {
                D.outerWidth(260 - R.element.outerWidth())
            }
        });
        s = new P({
            element: y.find("#captcha"),
            onBeforeValidate: function() {
                A()
            },
            onValid: function() {
                O()
            },
            onInvalid: function() {
                A()
            }
        });
        var O = function() {
            if (!R.isCounting) if (M.validate("mobile") && s.isValid) R.element.prop("disabled", !1)
        },
        A = function() {
            if (!R.isCounting) R.element.prop("disabled", !0)
        };
        if (x.css({
            position: "absolute",
            width: "200px",
            left: "100px",
            top: "-50px"
        }), C.css({
            position: "absolute",
            width: "200px",
            right: "-110px",
            top: "-30px"
        }), k.each(function(e, t) {
            $(t).css({
                position: "absolute",
                width: "110px",
                left: "245px",
                top: "-22px"
            })
        }), $(document).keyup(function(e) {
            if (13 == e.keyCode) q.save()
        }), t(), v) n()
    }
});