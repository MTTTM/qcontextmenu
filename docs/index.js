!(function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ?
        (module.exports = e()) :
        "function" == typeof define && define.amd ?
        define(e) :
        ((t =
                "undefined" != typeof globalThis ? globalThis : t || self).ContextMenu =
            e());
})(this, function() {
    "use strict";
    var t = function(t, e) {
        var n = Date.now();
        return function() {
            var i = this,
                o = arguments,
                s = Date.now();
            t.apply(i, o), s - n >= e && (t.apply(i, o), (n = Date.now()));
        };
    };

    function e(t) {
        if (!(this instanceof e)) throw "Constructor must be instantiated";
        let n = this._create_menu_box(t);
        return (this.menu = n), this.init(), this;
    }
    return (
        (e.prototype.init = function() {
            let t = this;
            (this.menu.onblur = function() {
                t.hide();
            }),
            (this.menu._self = this),
            (t._data = []),
            (t._x = 0),
            (t._y = 0);
            let e = t.hide.bind(this);
            document.removeEventListener("click", e),
                document.addEventListener("click", e),
                window.removeEventListener("blur", e),
                window.addEventListener("blur", e),
                t._bindEvent();
        }),
        (e.prototype._bindEvent = function() {
            let e = t.bind(this);
            this.menu.addEventListener("mousemove", e(this.menuItemHoverEvent, 300));
        }),
        (e.prototype.menuItemHoverEvent = function(t) {
            let e = t.target,
                n = e.lastChild;
            e &&
                e.tagName &&
                "menu-item" === e.tagName.toLocaleLowerCase() &&
                n &&
                n.tagName &&
                "menu" === n.tagName.toLocaleLowerCase() &&
                this._self._computedSubMenuPos(n);
        }),
        (e.prototype._create_menu_box = function(t) {
            let e = document.createElement("menu");
            return t.appendChild(e), e;
        }),
        (e.prototype._create_menu_item = function(t, e) {
            let n = document.createElement("menu-item");
            return (
                (n.style.cssText =
                    "\n  padding: 5px 15px;\n  cursor: pointer;\n  display: block;\n  text-align: center;\n  transition: all 0.2s ease 0s;\n  position:relative;\n  "),
                (n.innerHTML = t.text),
                e ? e.appendChild(n) : this.menu.appendChild(n),
                (n.cusData = t),
                n
            );
        }),
        (e.prototype._computedSubMenuPos = function(t) {
            let e = window.getComputedStyle(this.menu),
                n = parseInt(e.width),
                i = parseInt(e.width),
                o = window.innerWidth,
                s = window.innerHeight;
            (t.style.cssText =
                "\n              top: 0px;\n              left: 150px;\n              display: none;\n              position: absolute;\n              "),
            this._x + n > o - 30 &&
                (t.style.cssText = `\n              top: 0px;\n              left: ${-n}px;\n              display: none;\n              position: absolute;\n              `),
                this._y + i > s - i &&
                (t.style.cssText = `\n              top:auto;\n              bottom:0;\n              left: ${-n}px;\n              display: none;\n              position: absolute;\n              `);
        }),
        (e.prototype._computedMenuPos = function() {
            const t = this.menu;
            let e = window.getComputedStyle(this.menu),
                n = parseInt(e.width),
                i = parseInt(e.width),
                o = window.innerWidth,
                s = window.innerHeight;
            (t.style.cssText = `\n              top:${this._y}px;\n              left: ${this._x}px;\n              display: none;\n              position: absolute;\n              `),
            this._x + n > o - 30 && (t.style.left = o - n + "px"),
                this._y + i > s - i && ((t.style.bottom = 0), (t.style.top = "auto"));
        }),
        (e.prototype._update_submenu = function(t, e) {
            let n = e,
                i = this._create_menu_box(n);
            n.appendChild(i),
                t.children.forEach((t) => {
                    let e = this._create_menu_item(t, i);
                    t.children && this._update_submenu(t, e);
                });
        }),
        (e.prototype._update_menu = function() {
            (this.menu.innerHTML = ""),
            this._data.forEach((t) => {
                let e = this._create_menu_item(t);
                t.children && this._update_submenu(t, e);
            });
        }),
        (e.prototype.show = function(t, e) {
            (this._x = parseInt(e.x)),
            (this._y = parseInt(e.y)),
            t && ((this._data = t()), this._update_menu()),
                this._computedMenuPos(this.menu),
                (this.menu.style.display = "block");
        }),
        (e.prototype.hide = function() {
            this.menu.style.display = "none";
        }),
        e
    );
});