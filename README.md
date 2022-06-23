# QContextMenu

* Support html tags
* Number of dynamic menus
* Simple packaging
* Unlimited levels
* Browser boundary recognition and adaptation
* [demo](https://mtttm.github.io/qcontextmenu/)

## License
BSD 3-Clause License

## Installation
```javascript
 npm i qcontextmenu
```

## Usage

``` javascript
  import ContextMenu from "qcontextmenu";
  let menuTool = new ContextMenu(document.body);
  window.oncontextmenu = function(e) {
            e.preventDefault();
            let x = e.clientX;
            let y = e.clientY;
            menuTool.show(function() {
                return [{
                    target: "edit",
                    text: "<b>edinode</b>wireless level",
                    callback: function(node) {
                        console.log(node);
                    },
                    children: [{
                        target: "edit",
                        text: "edinode2",
                        callback: function(node) {
                            console.log(node);
                        },
                        children: [{
                            target: "edit",
                            text: "edinode3",
                            callback: function(node) {
                                console.log(node);
                            },

                        }, {
                            target: "addChild",
                            text: "addChild",
                            callback: function(node) {
                                console.log(node);
                            },
                        }, {
                            target: "addBrother",
                            text: "addBrother",
                            callback: function(node) {
                                console.log(node);
                            },
                        }, ]
                    }]
                }, {
                    target: "addChild",
                    text: "addChild",
                    callback: function(node) {
                        console.log(node);
                    },
                }, {
                    target: "addBrother",
                    text: "addBrother",
                    callback: function(node) {
                        console.log(node);
                    },
                }, {
                    target: "noThing",
                    text: "noThing",
                    callback: function(node) {
                        console.log("do nothing callback", node);
                    },
                }]

            }, {
                x: x + "px",
                y: y + "px"
            })
        };
```