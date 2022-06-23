function ContextMenu(container) {
    let self = this;
    if (!(this instanceof ContextMenu)) {
        throw "Constructor must be instantiated";
    }
    let menuDom = this._create_menu_box(container);
    this.menu = menuDom;
    this._init();
    return self;
}
ContextMenu.prototype._init = function() {
    let self = this;
    this.menu._self = this;
    self._data = [];
    self._x = 0; //鼠标X位置
    self._y = 0; //鼠标Y位置
    //获取最近的符合要求的父节点
    self.__getParentDom = self._getParent();
    //绑定事件
    self._blurHideCallback = self.hide.bind(this);
    //body点击
    document.removeEventListener("click", self._blurHideCallback);
    document.addEventListener("click", self._blurHideCallback);
    self._bindEvent();

};
ContextMenu.prototype._bindEvent = function() {
    this._menuItemHoverEvent();
    this.menu.addEventListener("click", this._menuItemClickEvent);
};
ContextMenu.prototype._getParent = function(max) {
    let index = 0;
    let maxCheck = (max && max > 0) ? max : 100;

    function getP(child, fn) {
        index++;
        if (index >= maxCheck) {
            return null;
        }
        let parentNode = child.parentNode;
        if (parentNode) {
            if (fn(parentNode)) {
                return parentNode
            } else {
                return getP(parentNode, fn);
            }
        }
    }
    return getP
}
ContextMenu.prototype._menuItemHoverEvent = function(e) {
    this.menu.onmouseover = function(e) {
        let target = e.target;
        if (target.tagName.toLocaleLowerCase() === "menu-item") {
            const subMenu = target.querySelector("menu");
            if (subMenu) {
                this._self._computedSubMenuPos(subMenu, target);
                subMenu.style.display = "block";
            }
            let borders = target.parentElement.querySelectorAll("menu-item");
            for (let i = 0; i < borders.length; i++) {
                if (borders[i]) {
                    if (borders[i] && borders[i] !== target) {
                        const subMenu = borders[i].querySelector("menu");
                        subMenu && (subMenu.style.display = "none");
                    }
                }
            }
        }
    }
    this.menu.onmouseleave = function(e) {
        let arr = document.querySelectorAll("menu");
        for (let i = 0; i < arr.length; i++) {
            arr[i].style.display = "none";
        }
    }
    this.menu.oncontextmenu = function(e) {
        e.stopPropagation();
        e.preventDefault();
    }
};
ContextMenu.prototype._menuItemClickEvent = function(e) {
    e.stopPropagation();
    let target = e.target;
    let matchDom = target.tagName.toLocaleLowerCase() === "menu-item" ? target :
        this.self.__getParentDom(target, function(parent) {
            return parent.tagName.toLocaleLowerCase() === "menu-item";
        })
    if (matchDom) {
        if (typeof matchDom.cusData.callback === "function") {
            matchDom.cusData.callback(matchDom.cusData);
        }
    }
    this.self.hide();
};
ContextMenu.prototype._create_menu_box = function(container) {
    let menuDom = document.createElement("menu");
    menuDom.self = this;
    menuDom.style.display = "none";
    menuDom.style.width = "150px";
    container.appendChild(menuDom);
    return menuDom;
};
/**
     item:
     {
        target: "edit",
        text: "编辑节点",
        callback: function(node) {
            console.log(node);
    }}
**/
ContextMenu.prototype._create_menu_item = function(item, menuItemBox) {
    let menuItemDom = document.createElement("menu-item");
    menuItemDom.style.cssText = `
  padding: 5px 10px 5px 15px;
  cursor: pointer;
  display: block;
  text-align: left;
  position:relative;
  white-space:nowrap;
  width:150px;
  `;
    menuItemDom.innerHTML = item.text;
    if (menuItemBox) {
        menuItemBox.appendChild(menuItemDom);
    } else {
        this.menu.appendChild(menuItemDom);
    }
    //设置自定义数据
    menuItemDom.cusData = item;
    return menuItemDom;
};
//计算二级目录定位
ContextMenu.prototype._computedSubMenuPos = function(box, parentBox) {
    //父节点的属性
    let parentMenuStyle = window.getComputedStyle(this.menu);
    let parentMenuWidth = parseInt(parentMenuStyle.width);
    //  let parentMenuHeight = parseInt(parentMenuStyle.width);

    //子节点的属性
    let menuStyle = window.getComputedStyle(box);
    let menuWidth = parseInt(menuStyle.width);
    let menuHeight = parseInt(menuStyle.width);

    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;
    box.style.cssText = `
              top: 0px;
              left: ${menuWidth}px;
              position: absolute;
              width: 150px;
              padding: 5px 0px;
              z-index: 9999;
              background: rgb(255, 255, 255);
              box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
              border-radius: 5px;
              font-size: 12px;
              width:150px;
              display: none;
              `;
    //只修正必要的样式
    if (this._x + menuWidth + parentMenuWidth > winWidth - 30) {
        box.style.left = `${-menuWidth}px`;
    }
    //只修正必要的样式
    if (this._y + menuHeight > winHeight - menuHeight) {
        box.style.top = `auto`;
        box.style.bottom = "0px";
    }
};
//计算二级菜单的位置
ContextMenu.prototype._computedMenuPos = function() {
    const box = this.menu;
    let menuStyle = window.getComputedStyle(this.menu);
    let menuWidth = parseInt(menuStyle.width);
    let menuHeight = this.menu.getBoundingClientRect().height;
    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;
    console.log("menuHeight", menuHeight)
    box.style.cssText = `
              top:${this._y}px;
              left: ${this._x}px;
              display: none;
              position: fixed;
              width: 150px;
              padding: 5px 0px;
              z-index: 9999;
              background: rgb(255, 255, 255);
              box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
              border-radius: 5px;
              font-size: 12px;
              display: none;
              `;
    if (this._x + menuWidth > winWidth - 30) {
        box.style.left = winWidth - menuWidth + "px";
    }
    if (this._y + menuHeight > winHeight - menuHeight) {
        box.style.bottom = 0;
        box.style.top = "auto";
    }
};
ContextMenu.prototype._update_submenu = function(item, menuItemBox) {
    let menuItemDom = menuItemBox;
    let box = this._create_menu_box(menuItemDom);
    menuItemDom.appendChild(box);
    item.children.forEach((sItem) => {
        let newMenuItem = this._create_menu_item(sItem, box);
        if (sItem.children) {
            this._update_submenu(sItem, newMenuItem);
        }
    });
};
ContextMenu.prototype._update_menu = function() {
    this.menu.innerHTML = "";
    this._data.forEach((item) => {
        let menuItemDom = this._create_menu_item(item);
        if (item.children) {
            this._update_submenu(item, menuItemDom);
        }
    });
};
/**
 * data  ()=>[]
 * arg2 {x,y}
 * **/
ContextMenu.prototype.show = function(data, posObj) {
    //更新坐标位置
    this._x = parseInt(posObj.x);
    this._y = parseInt(posObj.y);
    //重要，请勿删除
    this.menu.style.display = "block";
    if (typeof data === "function") {
        this._data = data();
        if (this._data && Array.isArray(this._data)) {
            this._update_menu();
        } else {
            throw "Please return an array when the data parameter is a function";
        }
    } else if (Array.isArray(data)) {
        this._data = [...data];
        this._update_menu();
    } else {
        throw "Please check if the parameter is wrong, it should be an array and an object";
    }
    console.log("this.menu", this.menu.style.display)
    this._computedMenuPos(this.menu);
    this.menu.style.display = "block";
};
ContextMenu.prototype.hide = function() {
    this.menu.style.display = "none";
};
ContextMenu.prototype.destroy = function() {
    this.menu.style.display = "none";
    this.menu.parentNode.removeChild(this.menu);
    document.removeEventListener("click", self._blurHideCallback);
};

export default ContextMenu;