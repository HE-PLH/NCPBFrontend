import Methods, {arraylify, CasualTable, createDomElement, displayTable, objectionalize} from "./utilities";
// import recharts from 'recharts'
import axios from "axios";
// import {JSIndividualReports} from "../../pages/reports/js-reports";

let DataView1 = {},
    DataView2 = {},
    DataView3 = {},
    DataView4 = {};

let Settings = {
    default: {
        column_width: 25,
        row_width: 100,
        font_size: 14,
        background: {
            row_even: "gray",
            row_odd: "white",
        }
    }
};
let global_start = 0, column_created = 1;

function table_setup(columns, rows) {
    let table_width = columns * 100,//`${}`;
        column_width = table_width / columns;
    document.querySelectorAll(".main-tbl").forEach(function (e) {
        for (let i in e["children"]) {
            if (e["children"].hasOwnProperty(i)) {
                if (e["children"][i].classList.contains("main-columns")) {
                    e["children"][i].style.width = `${100}px`;
                }
            }
        }
    })
}

function separator_setup(height_len, col_height) {
    // console.log(height_len)
    let all, h, col = ".tr-cols";
    all = height_len ? height_len : document.querySelectorAll(col).length / document.querySelectorAll(".th-cols").length + 1;
    h = col_height ? col_height * all : (document.defaultView.getComputedStyle(document.querySelector(col)).height.split("px")[0] * all);
    document.querySelectorAll("div .main-tbl .cs").forEach(function (e) {
        e.style.height = `${h}px`
    })
}

function setWindowTitle(title) {
    let element = document.querySelector(".inert");
    element.innerText = Methods.capitalize(title) + " Form";
}

function RemoveData() {

}/*

// function initiateSelectElement(records_array, column, initial_value, green_light ? obj[field_] : "") {
function initiateSelectElement(records_array, column, initial_value) {
    let c = `<select name="${column}" class="in input">`, record = {};
    let opt = ``;
    if (initial_value) {
        let txt = `${initial_value} - ${value}`;
        record = records_array[0];
        c += `<option>${txt}</option>`;
    }
    for (let i = 0; i < records_array.length; i++) {
        record = records_array[i];
        if (record.id === initial_value) {
            c = `<option>${record.if = d}</option>`
        }
        c += `<option>${record.id} - ${record.name}</option>`;
    }
    c += `</select></div></div>`;
    return c;
}*/


function ColumnsView(all_columns, rendered_columns, type_options) {
    this.all_columns = all_columns;
    this.columns = rendered_columns;
    this.container = document.querySelector(".column-change-interface ul");
    this.type_options = type_options;
    this.render = () => {
        if (this.container) {
            let cont = this.container.querySelector("li .col-settings");
            if (cont) {
                cont.innerHTML = "";
            }
            this.container.innerHTML = "";

            this.container.innerHTML += `
        <li class="col-settings">
                        <div class="column-view-cont setting">
                            <div class="column-view-title fill_width align_center_left">
                                <svg class="ic in search-icon" viewBox="0 0 24 24" height="100%" width="24px">
                                    <use xlink:href="../media/icons/icons.svg#done"></use>
                                </svg>
                                <label>Column</label>
                            </div>
                            <div class="column-view-tab-cont fill_width">
                                <div class="tab column-view-tabs-all tab-selected align_center">all(${this.all_columns.length})</div>
                                <div class="tab column-view-tabs-rendered align_center">rendered(${this.columns.length - 1})</div>
                            </div>
                            <div class="column-view fill_width">
                                ${this.add_fields(this.all_columns.length)}
                            </div>
                            <div draggable="true" class="separator rs fill_width fill-width in"></div>
                            <div class="column-new-column fill_width">
                                <div class="add-new-col-cont fill_height">
                                    <button class="add-btn add-new-col-button fill_height align_center">
                                        <svg class="ic in search-icon" viewBox="0 0 24 24" height="100%" width="24px">
                                            <use xlink:href="../media/icons/icons.svg#edit"></use>
                                        </svg>
                                        Add new
                                    </button>
                                </div>
                            </div>                           
                        </div>   
                                            
                    </li>                
                       
        `;
            this.update_btns();
        }
    };

    this.add_fields = (no_of_fields, first_title) => {
        let row_lst = ``;
        let option_lst = ``;

        for (let i = 0; i < this.type_options.length; i++) {
            option_lst += `<option>${this.type_options[i]}</option>`
        }

        for (let i = 0; i < no_of_fields; i++) {
            row_lst += `<div class="column-view-row">
                                    <div class="column-view-checkbox-cont in fill_height _col"><input class="column-view-checkbox" type="checkbox"/></div>
                                    <div class="column-view-column-title-cont fill_height in _col"><input value="${first_title || this.all_columns[i].title}" class="column-view-column-title" type="text"/></div>
                                    <div draggable="true" class="separator cs fill_height fill-height"></div>
                                    <div class="column-view-column-type-cont fill_height in _col">
                                        <select class="column-view-column-type _col">
                                            ${option_lst}
                                        </select>
                                    </div>
                                    <div draggable="true" class="separator cs fill_height fill-height"></div>
                                </div>`;
        }
        return row_lst
    };

    this.update_btns = () => {
        let opts = this.container.querySelectorAll(".col-settings .column-view .column-view-row select");
        for (let i = 0; i < this.all_columns.length; i++) {
            opts[i].value = this.all_columns[i].type || "text";
            let cb = opts[i].parentElement.parentNode.querySelector("input");
            Methods.find(this.columns, this.all_columns[i].title) ? cb.checked = true : cb.checked = false;
        }
    };

    this.inert_checkbox = (rendered) => {
        let cbs = this.container.querySelectorAll(".col-settings .column-view .column-view-row .column-view-checkbox");
        for (let i = 0; i < rendered.length; i++) {
            cbs[i].readonly = true;
        }
    };
    this.update_tabs = (rendered) => {
        let opts = this.container.querySelectorAll(".col-settings .column-view-tab-cont .tab");
        opts[0].innerHTML = `all(${this.all_columns.length})`;
        opts[1].innerHTML = `rendered(${rendered.length - 1})`;
    };

    this.showAllColumns = () => {
        this.container.querySelectorAll(".col-settings .column-view .column-view-row").forEach(function (e) {
            e.style.display = "flex";
            (e.querySelector(".column-view-checkbox").style.pointerEvents = "auto");
        })
    };
    this.showOnlyRenderedColumns = () => {
        this.container.querySelectorAll(".col-settings .column-view .column-view-row").forEach(function (e) {
            e.querySelector("input").checked ? e.style.display = "flex" : e.style.display = "none";
            (e.querySelector(".column-view-checkbox").style.pointerEvents = "none");
        })
    };
}

function Row(data, column_titles, column_list, classes, action_btns) {
    this.data = data;
    this.columns = column_titles;
    this.column_list = column_list;
    this.init = (child, cls, cls_cont) => {
        let td, ch = child || 'li',
            ch_class = cls ? cls : `${classes[ch]}`,
            ch_class_cont = cls_cont ? cls_cont : classes["div"];
        for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i] === "Actions") {
                if (!global_start) {
                    this.column_list[this.columns[i]].innerHTML += `
<div class = '${ch_class_cont} action_cont'>
    <${ch} class = '${ch_class} action'>
    Actions
    </${ch}}>
</div>`;
                } else {
                    this.column_list[this.columns[i]].innerHTML += `
<div class = '${ch_class_cont} align_center'>
    <${ch} class = '${ch_class}'>
        ${action_btns}
    </${ch}}>
</div>`;
                }
                global_start = 1;
            } else {
                td = this.data[this.columns[i]];
                this.column_list[this.columns[i]].innerHTML += `<div class = '${ch_class_cont}'><${ch} class = '${ch_class}'>${td}</${ch}}></div>`;
            }
        }
    };
}


function make_id(row_data, field) {
    if (row_data[field]) {
        row_data[field] = row_data[field].split(">>")[0].trim();
    }
}

function option_selectors(obj, field) {
    let c = ``;
	// console.log(DataView.Driver_default, DataView.Vehicle_default)
    obj.map((record) => {
        if (field === record.Id) {
            c = `<option>${field} >> ${record.Name || ""}</option>` + c;
        }else if (DataView.Driver_default === record.Driver_id) {
            c = `<option>${record.Id} >> ${record.Name || ""}</option>`+c;
        }else if (DataView.Vehicle_default === record.Vehicle_id) {
            c = `<option>${record.Id} >> ${record.Name || ""}</option>`+c;
        }else{
			c += `<option>${record.Id} >> ${record.Name || ""}</option>`;
		}
    });
    return c;
}

function make_name(row_data, field) {
    if (row_data[field]) {
        row_data[field] = row_data[field].split(">>")[1].trim();
    }
}

function make_amount_a_number(row_data, field) {
    if (row_data[field]) {
        row_data[field] = parseFloat(row_data[field].toString().replace(/,|\s/g, ''));
    }
}

export function DataViewRenderer(info = {
    container: null,
    data: null,
    columns_to_display: null,
    all_columns: null,
    rows_to_display: null,
    tbl: null,
    row_start: null,
    colours: null,
}) {
    this.data = info.data;
    this.colours = info.colours;
    this.all_columns = info.all_columns;
    let columns = [];
    this.columns_to_display = info.columns_to_display;
    this.rows_to_display = info.rows_to_display;
    this.row_start = info.row_start;
    this.container = info.container;
    this.maximum_rows_on_init = this.data ? this.data.length >= 30 ? 30 : this.data.length : null;
    let column_view = null;
    let column_list = {};
    this.previous_rows_displayed = [];
    this.action_list = null;
    let action_list_first;
    this.col_height = 40;
    this.tbl = info.tbl || "Drivers";
    this.column_types = ["text", "number", "currency"];
    this.nodataImg = "../sources/imgs/picture1.png";
    this.action_btns = (id) => {
        return `
<input class="checkbox" width="14px" data-id = ${id} type="checkbox" height="12px"/>
<svg viewBox="0 0 24 24" class="ic fav" width="14px" height="12px"><use xlink:href="../media/icons/icons.svg#edit"></use></svg>
<svg viewBox="0 0 24 24" class="ic info" width="14px" height="12px"><use xlink:href="../media/icons/icons.svg#info"></use></svg>
`;
    };

    this.classes = {
        table: 'main-tbl',
        th: 'main-th',
        tbody: 'main-tbody',
        td: 'main-tr-columns',
        ul: 'main-columns',
        li: 'main-td-rows',
        div: 'tr-cols',
        th_cont: 'th-cols',
        actions: 'actions',
    };
    let createRow = (row_data, child, cls, class_cont) => {
        new Row(row_data, columns, column_list, this.classes, this.action_btns()).init(child, cls, class_cont);
    };

    let new_row = (row_data) => {
        return createDomElement({
            name: "div",
            class: `${this.classes["div"]} added`,
            innerHTML: `<li class = '${this.classes["li"]}'>${this.action_btns(row_data["_id"])}</li>`
        })
    };

    this.request_post = function (row_data, tbl, q) {
        let rd = {};
        for (let i in row_data) {
            if (row_data.hasOwnProperty(i)) {
                rd[i] = row_data[i];
            }
        }
        let self = this;
        axios.post(`https://vms-master.herokuapp.com/api/${tbl || "drivers"}/${q}`, [rd])
            .then(function (response) {
                alert(`${response.data.info}`);
                if (q === "add") {
                    self.add(row_data);
                }
            });
    };
    this.pre_add = (row_data, max_col = {}) => {
        //manual prepend of new added row
        this.action_list.appendChild(new_row(row_data));
        //add the action btns
        let field = "", len = 0;
        for (let i = 1; i < columns.length; i++) {
            field = row_data[columns[i]];
            if (field !== null) {
                len = field.length > columns[i].length ? field.length : columns[i].length;
                max_col[i - 1] = len > max_col[i - 1] ? len : max_col[i - 1];
            }
            Methods.presert(createDomElement({
                name: "div",
                class: `${this.classes["div"]} added`,
                innerHTML: `<li class = '${this.classes["li"]}'>${field}</li}>`
            }), column_list[i - 1], column_list[i - 1]["children"][1]);
        }
        /*Methods.presert(new_row(row_data), this.action_list, action_list_first);
        //add the other main tr columns
        for (let i = 1; i < columns.length; i++) {

        }*/
        this.rows_to_display++;
    };

    this.adjustWidths = function (max_field_lengths) {
        for (let i = 1; i < column_list.length; i++) {
            column_list[i].style.width = `${max_field_lengths[i] * 12}px`;
        }
    };

    this.add = (row_data, max_col = {}) => {
        //manual append of new added row
        //add the action btns
        this.action_list.appendChild(new_row(row_data));
        //add the other main tr columns
        let field = "", len = 0;
        for (let i = 1; i < columns.length; i++) {
            field = row_data[columns[i]];
            if (field !== null) {
                len = field.length > columns[i].length ? field.length : columns[i].length;
                max_col[i - 1] = len > max_col[i - 1] ? len : max_col[i - 1];
            }
            column_list[i - 1].appendChild(createDomElement({
                name: "div",
                class: `${this.classes["div"]} added`,
                innerHTML: `<li class = '${this.classes["li"]}'>${field}</li}>`
            }));
        }
        this.rows_to_display++;
        return max_col;
    };

    this.add_window_setup = async (obj, _id) => {
        this.updating = !!obj;
        if (this.updating) {
            this.updating_id = _id;
        }
        setWindowTitle(this.tbl);
        let field_cont = document.querySelector(".window-column-display");
        let col_cont = document.querySelector(".window_body_left_bottom");
        col_cont.innerHTML = "";
        field_cont.innerHTML = "";
        let struct = ``, lst = `<ol>`;
        let selectibles = ["Expense"];

        for (let i = 0; i < columns.length - 1; i++) {
            let ttl = this.all_columns[i]["title"];
            // let field_ = columns[i];
            let field_ = ttl;
            let green_light = obj && obj[field_] !== undefined;
            switch (ttl) {
                case "Start_time":
                case "End_time":
                case "Time":
                    let title = ttl;
                    struct += `<div class="fill_width field">
                            <div class="field_title">${title}: </div>
                            <div class="field_input"><input type="time" value="${green_light ? obj[field_] : ""}" name="${ttl}" class="in input time-select"/></div>
                            </div>`;
                    break;
                case "Start_date":
                case "End_date":
                case "Date":
                    let date = ttl;
                    struct += `<div class="fill_width field">
                            <div class="field_title">${date}: </div>
                            <div class="field_input"><input type="date" value="${green_light ? obj[field_] : ""}" name="${ttl}" class="in input time-select"/></div>
                            </div>`;
                    break;
                case "Id":
                    let is_drivers = this.tbl === "drivers";
                    let is_vehicles = this.tbl === "vehicles";


                    if ((is_drivers || is_vehicles)) {
                        let title = is_drivers ? "Driver National Id" : is_vehicles ? "Vehicle Number Plate" : "";
                        if (green_light) {
                            struct += `<div class="fill_width field">
                            <div class="field_title">${title}: </div>
                            <div class="field_input">
                            <input type="text" value="${obj[field_]}" name="${ttl}" class="in input time-select"/>
                            </div></div>`;
                        } else {
                            struct += `<div class="fill_width field">
                            <div class="field_title">${title}: </div>
                            <div class="field_input">
                            <input type="text" name="${ttl}" class="in input time-select"/>
                            </div></div>`;
                        }
                    } else {
                        let title = "Unique Id";
                        if (green_light) {
                            struct += `<div class="fill_width field">
                            <div class="field_title">${title}: </div>
                            <div class="field_input">
                            <input type="text" value="${green_light ? obj[field_] : ""}" name="${ttl}" class="in input time-select"/>
                            <div class="auto-generate-id">A</div>
                            </div></div>`;
                        } else {
                            struct += `<div class="fill_width field">
                            <div class="field_title">${title}: </div>
                            <div class="field_input">
                            <input type="text" value="${green_light ? obj[field_] : ""}" name="${ttl}" class="in input time-select"/>
                            <div class="auto-generate-id">A</div>
                            </div></div>`;
                        }

                    }

                    break;
                case "_id":

                    break;
                case "__v":

                    break;
                case "Driver_id":
                    let column = "Driver Id Number";
                    axios.get(`https://vms-master.herokuapp.com/api/${"drivers"}`)
                        .then(function (response) {
                            let d = response.data.info;
                            if (d.length) {
                                let c = `<div class="fill_width field">
                            <div class="field_title">${column}: </div>
                            <div class="field_input">` + `<select name="${ttl}" class="in input">`;
                                c += option_selectors(d, `${green_light ? obj[field_] : ""}`);
                                c += `</select></div></div>`;

                                field_cont.innerHTML += c;
                            }
                        });
                    break;
                case "TyreId":
                    let colm = "Tyre Serial Number";
                    axios.get(`https://vms-master.herokuapp.com/api/${"tyres"}`)
                        .then(function (response) {
                            let d = response.data.info;
                            if (d.length) {
                                let c = `<div class="fill_width field">
                            <div class="field_title">${colm}: </div>
                            <div class="field_input">` + `<select name="${ttl}" class="in input">`;
                                c += option_selectors(d, `${green_light ? obj[field_] : ""}`);
                                c += `</select></div></div>`;

                                field_cont.innerHTML += c;
                            }
                        });
                    break;
                case "Number":
                    let _col = "Phone Number";
                    struct += `<div class="fill_width field">
                            <div class="field_title">${_col}: </div>
                            <div class="field_input">
                            <input type="${this.all_columns[i]["Type"]}" name="${ttl}" value="${green_light ? obj[field_] : ""}" class="in input"/>
                            </div></div>`;
                    break;
                case "Vehicle_id":
                    let col = "Vehicle Number Plate";
                    axios.get(`https://vms-master.herokuapp.com/api/${"vehicles"}`)
                        .then(function (response) {
                            let d = response.data.info;
                            if (d.length) {
                                let c = `<div class="fill_width field">
                            <div class="field_title">${col}: </div>
                            <div class="field_input">` + `<select name="${ttl}" class="in input">`;
                                c += option_selectors(d, `${green_light ? obj[field_] : ""}`);
                                c += `</select></div></div>`;

                                field_cont.innerHTML += c;
                            }
                        });
                    break;
                case "EmployeeRole":
                    let __col = "Role Of Employee";
                    axios.get(`https://vms-master.herokuapp.com/api/${"employees/roles"}`)
                        .then(function (response) {
                            let d = response.data.info;
                            if (d.length) {
                                let c = `<div class="fill_width field">
                            <div class="field_title">${__col}: </div>
                            <div class="field_input">` + `<select name="${ttl}" class="in input">`;
                                c += option_selectors(d, `${green_light ? obj[field_] : ""}`);
                                c += `</select></div></div>`;

                                field_cont.innerHTML += c;
                            }
                        });
                    break;
                case "Trip_id":
                    let cols = "Trip Id";
                    axios.get(`https://vms-master.herokuapp.com/api/${"trips"}`)
                        .then(function (response) {
                            let d = response.data.info;
                            if (d.length) {
                                DataView.Driver_default = green_light ? d["Driver_id"]:"";
                                DataView.Vehicle_default = green_light ? d["Vehicle_id"] : "";
                                let c = `<div class="fill_width field">
                            <div class="field_title">${cols}: </div>
                            <div class="field_input"><select name="${ttl}" class="in input">`;
                                c += option_selectors(d, `${green_light ? obj[field_] : ""}`);
                                c += `</select></div></div>`;
                                field_cont.innerHTML += c;
                            }
                        });
                    break;
                case "Type":
                    if (this.tbl === "income") {
                        let colm = "Income Type";
                        axios.get(`https://vms-master.herokuapp.com/api/${"income-types"}`)
                            .then(function (response) {
                                let d = response.data.info;
                                if (d.length) {
                                    let c = `<div class="fill_width field">
                            <div class="field_title">${colm}: </div>
                            <div class="field_input">` + `<select name="${ttl}" class="in input">`;
                                    c += option_selectors(d, `${green_light ? obj[field_] : ""}`);
                                    c += `</select></div></div>`;

                                    field_cont.innerHTML += c;
                                }
                            });
                    } else if (this.tbl === "expenses") {
                        let colm = "Expense Type";
                        axios.get(`https://vms-master.herokuapp.com/api/${"expense-types"}`)
                            .then(function (response) {
                                let d = response.data.info;
                                if (d.length) {
                                    let c = `<div class="fill_width field">
                            <div class="field_title">${colm}: </div>
                            <div class="field_input">` + `<select name="${ttl}" class="in input">`;
                                    c += option_selectors(d, `${green_light ? obj[field_] : ""}`);
                                    c += `</select></div></div>`;

                                    field_cont.innerHTML += c;
                                }
                            });
                    } else if (this.tbl === "vehicles/maintenance") {
                        let colm = "Maintenance Type";
                        axios.get(`https://vms-master.herokuapp.com/api/${"vehicles/maintenance-types"}`)
                            .then(function (response) {
                                let d = response.data.info;
                                if (d.length) {
                                    let c = `<div class="fill_width field">
                            <div class="field_title">${colm}: </div>
                            <div class="field_input">` + `<select name="${ttl}" class="in input">`;
                                    c += option_selectors(d, `${green_light ? obj[field_] : ""}`);
                                    c += `</select></div></div>`;

                                    field_cont.innerHTML += c;
                                }
                            });
                    }

                    break;
                default:
                    struct += `<div class="fill_width field">
                            <div class="field_title">${ttl}: </div>
                            <div class="field_input">
                            <input type="${this.all_columns[i]["Type"]}" name="${ttl}" value="${green_light ? obj[field_] : ""}" class="in input"/>
                            </div></div>`;

                    break;
            }
            lst += `<li>${columns[i]}</li>`
        }
        field_cont.innerHTML += struct;
        col_cont.innerHTML += lst + `</ol>`;

    };

    this.add_report_window_setup = (e) => {
        let field_cont = document.querySelector(".window-column-display");
        let col_cont = document.querySelector(".window_body_left_bottom");
        col_cont.innerHTML = "";
        field_cont.innerHTML = "";
        let struct = `<h3>${this.tbl}</h3><table class="report-table"><thead><th>field</th><th>value</th></thead>`,
            lst = `<ol>`;
        let index = Methods.getIndex(e.parentElement.parentElement) - 1;
        let cls = (document.querySelector(".main-tbl")["children"]);
        let id = "";
        for (let i in cls) {
            if (cls.hasOwnProperty(i)) {
                if (cls[i].tagName !== "DIV") {
                    let elem = cls[i]["children"][index];
                    let field = cls[i]["children"][0].innerText;
                    if (field === "Actions") continue;
                    let value = elem.querySelector("li").innerText;
                    if (field === "Id") {
                        id = value;
                    }
                    struct += `<tr class="_field">
                            <td class = "_field-display-title">${field}</td>
                            <td class="_field-display-value">${value}</td>
                            </tr>`;

                    lst += `<li>${field}</li>`
                }
            }
        }

        if (this.tbl === "trips") {
            let start = document.querySelector(".date-selector-start-input");
            let end = document.querySelector(".date-selector-end-input");
            if (start || end) {
                start = start.value;
                end = end.value;
                let rd = {
                    Start_date: start,
                    End_date: end,
                    Id: id
                };
                /*axios.post(`https://vms-master.herokuapp.com/api/${"trips"}/${"individualreports"}`, [rd])
                    .then(function (response) {
                        if (response.data.info.length > 0) {
                            let income = 0;
                        }
                        // field_cont.innerHTML += struct;
                        field_cont.innerHTML += JSIndividualReports.trips(response.data, id);
                        let container = document.querySelector(".i-report-container");
                        let els = ``;
                        for (let i in response.data.info.docs) {
                            if (response.data.info.docs.hasOwnProperty(i)) {
                                if (i.indexOf("sum") > -1||i.indexOf("count") > -1) {
                                    continue;
                                }
                                container.innerHTML+=`<div class="break" style="page-break-before:always;page-break-after:always">&nbsp;</div> </div><div class="individual-report-item-title">
                                            ${Methods.capitalize(i)}
                                        </div>`;
                                container.appendChild(displayTable(response.data.info.docs[i]));

                            }

                        }

                    });*/
            }
        } else if (this.tbl === "vehicles") {
            let start = document.querySelector(".date-selector-start-input");
            let end = document.querySelector(".date-selector-end-input");
            if (start || end) {
                start = start.value;
                end = end.value;
                let rd = {
                    Start_date: start,
                    End_date: end,
                    Id: id
                };
                /*axios.post(`https://vms-master.herokuapp.com/api/${"vehicles"}/${"individualreports"}`, [rd])
                    .then(function (response) {
                        if (response.data.info.length > 0) {
                            let income = 0;
                        }
                        // field_cont.innerHTML += struct;
                        field_cont.innerHTML += JSIndividualReports.vehicles(response.data, id);
                        let container = document.querySelector(".i-report-container");
                        let els = ``;
                        for (let i in response.data.info.docs) {
                            if (response.data.info.docs.hasOwnProperty(i)) {
                                if (i.indexOf("sum") > -1||i.indexOf("count") > -1) {
                                    continue;
                                }
                                container.innerHTML+=`<div class="break" style="page-break-before:always;page-break-after:always">&nbsp;</div> <div class="individual-report-item-title">
                                            ${Methods.capitalize(i)}
                                        </div>`;
                                container.appendChild(displayTable(response.data.info.docs[i]));
                            }
                            
                        }

                    });*/
            }

        } else {
            field_cont.innerHTML += struct;
            col_cont.innerHTML += lst + `</ol>`;
        }

    };


    this.add_row_in_window = () => {
        //submit form
        let form = document.querySelectorAll(".window-column-display .field"), row_data = {};

        form.forEach(function (inp) {
            let input = inp.querySelector(".input");
            row_data[input.name] = `${input.value}`
        });

        make_id(row_data, "Trip_id");
        make_name(row_data, "Type");
        make_id(row_data, "Driver_id");
        make_id(row_data, "Vehicle_id");
        make_amount_a_number(row_data, "Amount");
        let filled = true;
        for (let i in row_data) {
            if (row_data.hasOwnProperty(i)) {
                if (row_data[i] === "") {
                    filled = false;
                    break;
                }
            }
        }

        if (filled) {
            let q = "add";
            if (this.updating) {
                q = "update";
                row_data._id = this.updating_id;
            } else {
                q = "add"
            }
            this.request_post(row_data, this.tbl, q);

            /*form.forEach(function (inp) {
                inp.querySelector(".input").value = "";
            });*/
        } else {
            alert("kindly fill all fields")
        }
    };


    this.remove = () => {
        new RemoveData();
    };

    this.init = (colors) => {
        let table = createDomElement({name: "div", class: this.classes["table"]});
        global_start = 0;
        if (this.container) {
            this.container.innerHTML = "";
            this.container.appendChild((table));
            // console.log(document.querySelector(".add-new-row-button"))
            // document.querySelector(".add-new-row-button").style.visibility = "visible";
            if (this.data) {
                if (!(this.all_columns)) {
                    this.all_columns = [];
                    for (let i in this.data[0]) {
                        if (this.data[0].hasOwnProperty(i)) {
                            this.all_columns.push(i);
                        }
                    }
                }
                columns = arraylify(this.all_columns);

                if (!this.columns_to_display) {
                    this.columns_to_display = columns;
                }

                Methods.addToIndex(columns, "Actions", 0);

                //add the actions column

                column_list["Actions"] = createDomElement({name: "ol", class: this.classes["ul"], start: "1"});

                //add columns
                this.add_column_in_table(1, columns.length);
                //add the thead row
                createRow(objectionalize(columns), "li", this.classes["th"], `${this.classes["div"]}`);

                //add the other tr rows
                for (let i = 0; i < this.maximum_rows_on_init; i++) {
                    createRow(this.data[i], 'li', this.classes["li"]);
                }
                //add the separator column - resize on each column ending
                let count = 0;
                for (let i in column_list) {
                    let ul = column_list[i];
                    ul.style.color = colors[count];
                    table.appendChild(ul);
                    if (ul.tagName !== "OL") {
                        table.innerHTML += `<div draggable="true" class="separator cs fill_height fill-height in"></div>`;
                    }
                    count++;
                }

                //append the table to container

                //set column width of table
                // table_setup(columns.length,this.data.length);

                //console.log(table)
                //set separator-resize height

                render_columns_view();
                this.rows_to_display++;
                // console.log(this.rows_to_display)
                this.limit_rows_to(this.rows_to_display);

                //compulsory bindings

                this.bindings();

                column_list = document.querySelectorAll("div .main-tbl ul");
                this.action_list = document.querySelectorAll("div .main-tbl ol")[0];
                action_list_first = this.action_list["children"][1];
            } else {
                table.style.width = `${100}%`;
                let d = createDomElement({name: "div", class: "align_center fill_width"});
                d.innerHTML += `<img class="align_top_right" src=${this.nodataImg}>`;
                table.appendChild(d)
            }
        }

    };

    this.add_column_in_table = (start, number_of_cols) => {
        for (let i = start, ul; i < number_of_cols; i++) {
            ul = createDomElement({name: "ul", class: this.classes["ul"], creator: columns[i]});
            this.include_column(ul, columns[i]);
            column_list[columns[i]] = ul;
        }
    };

    let render_columns_view = () => {
        column_view = new ColumnsView(this.all_columns, columns, this.column_types);
        column_view.render();
    };

    this.bindings = () => {
        let _this = this;
        document.querySelector(".show-rows-body select").onchange = function (e) {
            _this.rows_to_display = parseInt(e.target.value.split(">>")[1]);
            // console.log(document.querySelector(".show-rows-from-cont input"));
            _this.row_start = parseInt(document.querySelector(".show-rows-from-cont input").value) || 1;
            _this.limit_rows_to(_this.rows_to_display);
        }
    };

    this.update_col_view_tabs = () => {
        column_view.update_tabs(this.columns_to_display);
    };

    this.finish_setup = () => {
        separator_setup(this.action_list["children"].length, this.col_height);
        // this.limit_rows_to(30);
        this.previous_rows_displayed = [0, 30];
    };

    this.smarterDrag = () => {

    };

    this.add_column_in_column_view = () => {
        //not optimised
        let title = `new columns${column_created}`;
        columns.push(title);
        this.all_columns.push({title: title, type: this.column_types[0]});
        column_view.all_columns = this.all_columns;
        let c_view = document.querySelector(".column-view");
        c_view.innerHTML += column_view.add_fields(1, title);
        c_view["children"][c_view["children"].length - 1].scrollIntoView(false);
        let ul = createDomElement({name: "ul", class: this.classes["ul"], creator: title});
        let table = this.container.querySelector(".main-tbl"), len = column_list[0]["children"].length;
        table.appendChild(ul);
        ul.innerHTML += `<div class = '${this.classes["div"]}'><li class = '${this.classes["th"]}'>${title}</li></div>`;
        for (let i = 1; i < len; i++) {
            ul.innerHTML += `<div class = '${this.classes["div"]}'><li class = '${this.classes["li"]}'></li></div>`;
        }
        ul.scrollIntoView(false);
        this.include_column(ul, title);
        column_list[column_list.length - 1] = ul;
        column_view.update_btns();
        this.update_col_view_tabs();
        table.innerHTML += `<div draggable="true" class="separator cs fill_height fill-height in"></div>`;
        this.limit_rows_to(this.rows_to_display);
        separator_setup(len, 40);
        column_created++;
    };

    this.column_view_show_all = () => {
        column_view.showAllColumns();
    };


    this.column_view_show_rendered = () => {
        column_view.showOnlyRenderedColumns();
    };

    this.update_title_edit = (el) => {
        this.findColumnByFieldIndex(Methods.getIndex(el.parentElement.parentNode) - 2)["children"][0].innerHTML = el.value;
    };

    this.include_column = (col, title) => {
        //include column
        //console.log(col,title,this.columns_to_display)
        col.style.display = Methods.find(this.columns_to_display, title) ? "block" : "none";
    };
    this.findColumnByFieldIndex = (index) => {
        return this.container.querySelectorAll("ul")[index];
    };
    this.limit_rows_to = (limit) => {
        console.time("limiting rows");
        let all = this.container.querySelector(".main-tbl")["children"], len = all[0] ? all[0]["children"].length : 0,
            col, s, b;
        this.row_start = this.row_start ? this.row_start : 0;
        b = this.row_start + limit;
        for (let i in all) {
            if (all.hasOwnProperty(i)) {
                col = all[i];
                s = col["children"];
                if (col.tagName === "UL" || col.tagName === "OL") {
                    for (let j = this.previous_rows_displayed[0]; j < this.previous_rows_displayed[1]; j++) {
                        s[j].style.display = "none";
                    }
                    for (let j = this.row_start; j < b; j++) {
                        s[j].style.display = "block";
                    }
                    s[0].style.display = "block";
                }
            }
        }

        // all[0].setAttribute("start", this.row_start);
        all[0].setAttribute("start", 1);
        separator_setup(b > len ? 1 : limit, this.col_height);
        this.previous_rows_displayed = [this.row_start, b];
        //start !== 0 ? b > 0 ? b : 1 : limit
    }
}
