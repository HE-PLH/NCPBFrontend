import {v4 as uuidv4} from 'uuid';
/*
***************************************
 ==== 7. CONSTANT VARIABLES
***************************************
*/
import Methods, {createDomElement, printIndividual} from "./utilities";
// import index from "recharts/demo/component/index";

const CTRL = 17;
const SHIFT = 16;
const DEL = 46;
const D = 68;
const Z = 90;


/*
***************************************
 ==== 7. GLOBAL VARIABLES
***************************************
*/
let focusedElements = [];
let currentBeingTyped = [];
let deleted = [];
let els = [];
let redone = [];
let sequencedKeys = [];
let previous_width = 400;
let orient = "";
let g_timer = false;
let menu_show = false;
let seprator = {
    pw: 0,
    lftw: 0,
}, h;
let dragger = {
    pl: 0,
    pt: 0,
};
let lft;
let right;
let mouse = {
    clicking: {
        status: false,
        point: {
            x: 0,
            y: 0
        },
    },
    dragging: {
        status: false,
        offset: {
            x: 0,
            y: 0
        },
        draggable: false,
        drag_start: {
            status: false,
            element: "",
        },
        elementClass: "",
    },
    hovering: {
        status: false,
        point: {
            x: 0,
            y: 0
        },
        droppable: "",
        dropUl: "",
        carrying: false,
    },
    releasing: {
        status: false,
        point: {
            x: 0,
            y: 0
        },
    },
    moving: {
        status: false,
        point: {
            x: 0,
            y: 0
        },
    },
};
let global_log_depth = 5, svg_list = ["twitter", "arrow", "done", "success", "facebook", "github"];


function Compressed_layout(parentClass, cls, data) {
    this.parentContainer = document.querySelector(`.${parentClass}`);
    this.currentWindowData = data || document.querySelector(`.${cls}`);
    this.listContainer = createDomElement({name: "ul", class: "ul_main"});
    this.init = () => {
        this.parentContainer.style.overflow = "hidden";
        let cont = createDomElement({name: "div", class: "compressed_layout"});
        loop(this.currentWindowData['children'], this.listContainer);
        cont.appendChild(this.listContainer);
        this.parentContainer.appendChild(cont);
        let my_con = document.querySelector('.compressed_layout');
    };

    function loop(links, ul) {
        for (let obj in links) {
            if (links.hasOwnProperty(obj)) {
                let li = createDomElement({name: "li", class: "list_item", appendTo: ul, creator: links[obj]}),
                    title = links[obj].classList[0],
                    svg_title = links[obj]["title"] ? links[obj]["title"] : "";
                createDomElement({
                    name: "div",
                    class: "layout_title clickable align_center",
                    appendTo: li,
                    innerHTML: title
                });
                let ic = createDomElement({name: "div", class: "icon align_center", prependTo: li});
                if (Methods.find(svg_list, svg_title)) {
                    let svg = `<svg viewBox="0 0 24 24" class="ic" width="24px" height="24px">
                                <use xlink:href="../sources/icons/icons.svg#${svg_title}"></use>
                            </svg>`;
                    ic.innerHTML += (svg);
                }
                if (links[obj]['children'] && links[obj]['children'].length > 0) {
                    createDomElement({name: "div", class: "arrow", prependTo: li});
                    let ul2 = createDomElement({name: "ul", appendTo: li});
                    li.classList += " carrying";
                    loop(links[obj]['children'], ul2);
                }

            }
        }
    }
}


/*
***************************************
 ==== 7. EVENTS
 ***************************************
 */


export function Events() {
    this.default = () => {
        window.addEventListener("keydown", function (e) {
            new KeyEventHandler(e, "key_down");
        });
        window.addEventListener("keyup", function (e) {
            new KeyEventHandler(e, "key_up");
        });
        window.addEventListener("mousedown", function (e) {
            new MouseEventHandler(e, "mouse_down");
        });
        window.onclick = (e) => {
            new MouseEventHandler(e, "mouse_click");
        };
        window.addEventListener("mousemove", function (e) {
            new MouseEventHandler(e, "mouse_move");
        });
        window.addEventListener("mouseup", function (e) {
            new MouseEventHandler(e, "mouse_up");
        });
        window.addEventListener("mouseover", function (e) {
            new MouseEventHandler(e, "mouse_over");
        });
        window.addEventListener("mouseenter", function (e) {
            new MouseEventHandler(e, "mouse_enter");
        });
        window.addEventListener("mouseleave", function (e) {
            new MouseEventHandler(e, "mouse_blur");
        });

        if (document.querySelector(".column-view-column-title")) {
            console.log("hi");
            document.querySelector(".column-view-column-title").onkeyup = function (e) {
                let p = DataView.findColumnByFieldIndex(Methods.getIndex(e.target.parentElement.parentNode));
                p.innerHTML = "";
                p.innerHTML = e.target.value;
            }
        }

    };


    function KeyEventHandler(element, event) {
        this.el = element.target;
        this.handleKeys = () => {
            // console.log(this.key);
        };

        this.handleKeyUpUpdates = () => {
            if (this.el.classList.contains("column-view-column-title")) {
                DataView.update_title_edit(this.el);
            }
        };

        this.def = () => {
            this.key = element.keyCode;
            if (event === "key_down") {
                if (!Methods.find(sequencedKeys, this.key)) {
                    sequencedKeys.push(this.key);
                }
                this.handleKeys();
            } else if (event === "key_up") {
                this.handleKeyUpUpdates();
                Methods.remove(sequencedKeys, this.key)
            }
        };
        this.def();
    }

    function MouseEventHandler(element, event) {
        this.el = element.target;
        this.event = event;

        this.handleHovering = () => {

        };

        this.separatedWindowDrag = (orientation, direction, column_resizer, rightR) => {
            if (mouse.dragging.drag_start) {
                right = this.el.nextElementSibling;
                lft = this.el.previousElementSibling;
                if (right) {
                    seprator.rightw = right[`client${orientation}`];
                } else {
                    seprator.rightw = null;
                }
                if (lft) {
                    seprator.lftw = lft[`client${orientation}`];
                } else {
                    seprator.lftw = null;
                }
                if (lft) {
                    seprator.pw = lft.parentElement[`client${orientation}`];
                } else {
                    seprator.pw = null;
                }
                orient = orientation.toLowerCase();
                if (right) {
                    right.style.transition = "0s width";
                }
                if (lft) {
                    lft.style.transition = "0s width";
                }
            } else {
                if (!column_resizer) {
                    let lft_w = seprator.lftw + mouse.dragging.offset[direction],
                        right_w = seprator.rightw - mouse.dragging.offset[direction];
                    if (right_w > 60 && lft_w > 60) {
                        lft.style[orient] = `${100 * lft_w / seprator.pw}%`;
                        right.style[orient] = `${100 * right_w / seprator.pw}%`;
                    }
                } else if (!rightR) {
                    let lft_w = !seprator.lftw ? null : seprator.lftw + mouse.dragging.offset[direction];
                    if (15 < lft_w) {
                        lft.style[orient] = `${lft_w}px`;
                    }
                } else {
                    let right_w = !seprator.rightw ? null : seprator.rightw - mouse.dragging.offset[direction];
                    if (100 <= right_w) {
                        if (100 < right_w) {
                            if (!menu_show) {
                                menu_show = true;
                            }
                        }
                    } else {
                        if (menu_show) {
                            menu_show = false;
                        }
                    }
                    if (right_w > 50) {
                        right.style[orient] = `${right_w}px`;
                    }
                    right.parentElement.querySelector(".settings-title").style.display = menu_show ? "block" : "none";
                }
            }
        };

        this.mouse_down = () => {
            if (g_timer) {
                mouse.dragging.drag_start = false;
            } else {
                if (this.el["draggable"]) {
                    mouse.dragging.drag_start = true;
                    mouse.dragging.draggable = true;
                    mouse.dragging.element = this.el;
                } else {
                    mouse.dragging.draggable = false;
                }

            }
        };

        this.mouse_over = () => {

        };

        this.released = () => {

        };

        this.click = () => {
            if (this.el.classList.contains("tab")) {
                Methods.addClass("tab", [this.el], "tab-selected", "tab-selected");
                if (this.el.classList.contains("column-view-tabs-rendered")) {
                    DataView.column_view_show_rendered()
                } else if (this.el.classList.contains("column-view-tabs-all")) {
                    DataView.column_view_show_all()
                }
            }
            if (this.el.id === "summary") {
                Methods.toogle.display(document.getElementById("main-body"));
                Methods.toogle.classes(this.el.querySelector(".ic"), "arrow-up", "arrow-down")
            }
            if (this.el.classList.contains("add-new-row")) {
                DataView.add_window_setup();
                document.querySelector(".window").style.display = "block";
            }

            if (this.el.classList.contains("add-new-col-button")) {
                DataView.add_column_in_column_view();
            }

            if (this.el.classList.contains("ok")) {
                DataView.add_row_in_window();
            }

            if (this.el.classList.contains("individual-print")) {
                printIndividual(false, ".window-column-display");
            }

            if (this.el.classList.contains("info")) {
                DataView.add_report_window_setup(this.el);
                document.querySelector(".window").style.display = "block";
            }
            if (this.el.classList.contains("cancel") || this.el.classList.contains("window_close")) {
                document.querySelector(".window").style.display = "none";
            }
            if (this.el.classList.contains("auto-generate-id")) {
                this.el.parentElement.querySelector(".input").value = uuidv4();
            }
            if (this.el.classList.contains("circle") || this.el.classList.contains("menu-btn")) {
                let elem = document.querySelector(".column-change-interface");
                if (elem.clientWidth > 0) {
                    previous_width = elem.clientWidth;
                    elem.style.width = `${0}`;
                    elem.style.height = `${0}`;
                    (elem.parentNode.querySelector(".separator")).style.height = `${0}`;
                    (elem.parentNode.querySelector(".settings-title")).style.display = "none";
                    elem.style.transition = ".3s width cubic-bezier(0.8, 0.65, 1, 0.46)";
                } else if (elem.clientWidth <= 0) {
                    elem.style.width = `${previous_width}px`;
                    elem.style.height = `${500}px`;
                    (elem.parentNode.querySelector(".separator")).style.height = `${500}px`;
                    if (menu_show) {
                        (elem.parentNode.querySelector(".settings-title")).style.display = "block";
                    }
                    elem.style.transition = ".3s width cubic-bezier(0, 0.96, 0, 0.97)";
                }
            }

            if (this.el.classList.contains("fav")) {
                let lst = (document.querySelector(".main-tbl")["children"]);
                let index = Methods.getIndex(this.el.parentElement.parentElement) - 1;
                let obj = {};
                let _id = lst[0]["children"][index].querySelector(".checkbox").getAttribute("data-id");
                for (let i in lst) {
                    if (lst.hasOwnProperty(i)) {
                        if (lst[i].tagName !== "DIV") {
                            let elem = lst[i]["children"][index];
                            let field = lst[i]["children"][0].innerText;
                            if (field === "Actions") continue;
                            obj[field] = elem.querySelector("li").innerText;
                        }
                    }
                }

                DataView.add_window_setup(obj, _id);
                document.querySelector(".window").style.display = "block";
            }
            if (this.el.classList.contains("record-delete")) {
                let lst = document.querySelectorAll(".checkbox");

                let element;
                let records = [];
                for (let i = 0; i < lst.length; i++) {
                    element = lst[i];
                    if (element.checked) {
                        records.push(element.getAttribute("data-id"))
                    }

                }

                records.forEach((record) => {
                    DataView.request_post({"_id": record}, DataView.tbl, "delete");
                });


            }

            if (this.el.classList.contains("checkbox")) {
                let lst = (document.querySelector(".main-tbl")["children"]);
                let color;
                if (els.length > 0) {
                    color = !els[0].checked ? "initial" : "lightblue";
                    for (let i = 1; i < els.length; i++) {
                        els[i].style.backgroundColor = color;
                    }
                }
                els = [];
                els.push(this.el);
                let index = Methods.getIndex(this.el.parentElement.parentElement) - 1;
                color = this.el.checked ? "lightblue" : "initial";
                for (let i in lst) {
                    if (lst.hasOwnProperty(i)) {
                        if (lst[i].tagName !== "DIV") {
                            let elem = lst[i]["children"][index];
                            elem.style.backgroundColor = color;
                            els.push(elem);
                        }
                    }
                }
                let t = document.querySelector(".record-delete");
                if (this.checked) {
                    t.style.display = "flex";
                }else {
                    let any = false;
                    for (const element of lst[0].querySelectorAll(".checkbox")) {
                        if (element.checked) {
                            any = true;
                            break;
                        }
                    }
                    any?t.style.display = "flex":t.style.display = "none";
                }
//                 document.querySelector(".main-tbl").forEach(function (e) {
// console.log(e)
//                 })
            }
            if (this.el.classList.contains("column-view-checkbox")) {
                let field_column = this.el.parentNode.parentNode,
                    title = field_column.querySelector("div .column-view-column-title").value;
                if (!Methods.find(DataView.columns_to_display, title)) {
                    DataView.columns_to_display.push(title);
                } else {
                    Methods.remove(DataView.columns_to_display, title);
                }
                let col = DataView.findColumnByFieldIndex(Methods.getIndex(field_column) - 1);

                //some error here
                col = col === undefined ? DataView.findColumnByFieldIndex(Methods.getIndex(field_column) - 2) : col;

                DataView.include_column(col, title);
                DataView.include_column(col.nextElementSibling, title);
                DataView.update_col_view_tabs();
            }

        };


        this.normal_drag = function () {
            let wnd, isWindow;
            isWindow = mouse.dragging.element.classList.contains("window_title");
            if (mouse.dragging.drag_start) {
                if (isWindow) {
                    mouse.dragging.elementClass = "window";
                    wnd = mouse.dragging.element.parentNode.parentElement;
                }
                dragger.pl = wnd.offsetLeft;
                dragger.pt = wnd.offsetTop;
            }
            wnd = document.querySelector(`.${mouse.dragging.elementClass}`);
            Methods.changeClassProperty(`.${mouse.dragging.elementClass}`, [wnd], "left", `${100 * (dragger.pl + mouse.dragging.offset.x) / window.innerWidth}%`);
            Methods.changeClassProperty(`.${mouse.dragging.elementClass}`, [wnd], "top", `${100 * (dragger.pt + mouse.dragging.offset.y) / window.innerHeight}%`);

            //Methods.changeClassProperty(`.${element}`,[document.querySelector(`.${element}`)],"left",`${100*right_w/seprator.pw}%`);
        };

        this.drag = () => {
            element.preventDefault();
            if (mouse.dragging.draggable === true) {
                mouse.dragging.offset = {
                    x: mouse.moving.point.x - mouse.clicking.point.x,
                    y: mouse.moving.point.y - mouse.clicking.point.y,

                };

                if (mouse.dragging.element) {
                    //two window separator
                    if (mouse.dragging.element.classList.contains("separator")) {
                        if (mouse.dragging.element.classList.contains("fill_width")) {
                            if (mouse.dragging.element.classList.contains("rs")) {
                                if (mouse.dragging.element.classList.contains("r")) {
                                    this.separatedWindowDrag("Height", "y", true, true);
                                } else {
                                    this.separatedWindowDrag("Height", "y", true);
                                }
                            } else {
                                this.separatedWindowDrag("Height", "y");
                            }
                        } else if (mouse.dragging.element.classList.contains("fill_height")) {
                            if (mouse.dragging.element.classList.contains("cs")) {
                                if (mouse.dragging.element.classList.contains("c")) {
                                    this.separatedWindowDrag("Width", "x", true, true);
                                } else {
                                    this.separatedWindowDrag("Width", "x", true);
                                }
                            } else {
                                this.separatedWindowDrag("Width", "x");
                            }
                        }
                    }
                    if (mouse.dragging.element.classList.contains("normal_drag")) {
                        this.normal_drag(this.el);
                    }
                }

            }
        };


        this.init = (event, element) => {
            if (event === "mouse_down") {
                mouse.releasing.status = false;
                mouse.clicking.status = true;
                mouse.clicking.point = {x: element.clientX, y: element.clientY};
            } else if (event === "mouse_move") {
                mouse.moving.status = true;
                mouse.moving.point = {x: element.clientX, y: element.clientY};
            } else if (event === "mouse_up") {
                g_timer = false;
                mouse.hovering.status = false;
                mouse.moving.status = false;
                mouse.dragging.status = false;
                mouse.clicking.point = {x: element.clientX, y: element.clientY};
                mouse.releasing.status = true;
                mouse.clicking.status = false;

            } else if (event === "mouse_over") {
                mouse.hovering.status = true;
                mouse.hovering.point = {x: element.clientX, y: element.clientY};
                this.mouse_over()
            } else if (event === "mouse_click") {
                this.click();
            } else if (event === "mouse_enter") {
                console.log(this.el)
            } else if (event === "mouse_blur") {
                console.log(this.el)
            }
            //mouseup
            if (mouse.releasing.status && !mouse.moving.status) {
                this.released();
            }

            //mousedown
            if (mouse.clicking.status) {
                this.mouse_down();
            }
            //drag
            if (mouse.moving.status && mouse.clicking.status &&
                !((mouse.moving.point.x === mouse.clicking.point.x) &&
                    (mouse.moving.point.y === mouse.clicking.point.y))) {
                mouse.dragging.status = true;
                g_timer = true;
                this.drag();
            }
            //hovering
            if (mouse.hovering.status) {
                this.handleHovering();
            }
        };
        this.init(this.event, element);

    }
}

let side_nav = `
<div title = "twitter" class="dashboard"></div>
<div title = "twitter" class="customer">
    <div title = "twitter" class="add" link=""></div>
    <div title = "twitter" class="view" link=""></div>
</div>
<div title = "done" class="supplier">  
    <div title = "twitter" class="view" link=""></div>
</div>
</div>
    <div title = "twitter" class="view" link=""></div>
</div>
<div title = "success" class="products">
    <div title = "twitter" class="add" link=""></div>
    <div title = "twitter" class="view" link=""></div>
</div>
<div title = "facebook" class="orders">
    <div title = "twitter" class="add" link=""><div title = "facebook" class="orders">
    <div title = "twitter" class="add" link=""></div>
    <div title = "twitter" class="view" link=""></div>
</div></div>
    <div title = "twitter" class="view" link=""></div>
</div>
`;




/*
* let indexes = [], element;
                let records = [];
                for (let i = 0; i < lst.length; i++) {
                    element = lst[i];
                    if (element.checked) {
                        indexes.push(i);
                        records.push(element.getAttribute("data-id"))
                    }

                }
                let cont = (document.querySelector(".main-tbl")["children"]);
                indexes.forEach((index) => {
                    let temp = {};
                    for (let i in cont) {
                        if (cont.hasOwnProperty(i)) {
                            if (cont[i].tagName !== "DIV") {
                                let title = cont[i]["children"][0].innerText;
                                if (title === "Actions") continue;
                                let elem = cont[i]["children"][index + 1];
                                temp[title] = elem.innerText;
                            }
                        }
                    }
                    records.push(temp);
                });*/