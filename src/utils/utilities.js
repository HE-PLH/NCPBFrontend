import {format} from "date-fns";
import React from "react";
import axios from "axios";
import UploadImage from "../components/upload-images-component";
import {Typography} from '@mui/material';
import {IKImage, IKContext, IKUpload} from 'imagekitio-react'
import Roles from "../components/contexts/roles-cmp";
import Status from "../components/contexts/status-cmp";
import {getRole} from "./common";
import Conditions from "../components/contexts/conditions-cmp";
import UserId from "../components/contexts/User-cmp";
import MessageType from "../components/contexts/message-type-cmp";
import SiteId from "../components/contexts/siteId-cmp";
import ProjectId from "../components/contexts/projectId-cmp";
import SuppliesId from "../components/contexts/suppliesId-cmp";
import SuppliesItemName from "../components/contexts/SuppliesName-cmp";
import DivisionId from "../components/contexts/MatchId-cmp";
import ItemsId from "../components/contexts/itemsId-cmp";
import InvoiceId from "../components/contexts/invoiceId-cmp";
import DeducableFromSelection from "../components/contexts/deducable-from-select-cmp";
import OddItemsCmp from "../components/contexts/odd-items-cmp";
import UploadFile from "../components/upload-file-cmp";
// import ObjectEditor from 'react-object-editor-mui'

let Methods = {
    toCamelCase: function (str) {
        return str
            .replace(/\s(.)/g, function ($1) {
                return $1.toUpperCase();
            })
            .replace(/\s/g, '')
            .replace(/^(.)/, function ($1) {
                return $1.toLowerCase();
            });
    },
    reverse_contains: function (txt, tst) {
        tst = tst.toUpperCase();
        txt = txt.toUpperCase();
        let len = tst.length;
        let flag = false;
        if (txt.substr(txt.length - len, len) === tst) {
            flag = true;
        }
        return flag;
    },
    capitalize: function (txt) {
        return txt[0].toUpperCase() + txt.slice(1, txt.length)
    },

    find: function (array, item) {
        if (array.length > 0) {
            return array.find(i => i === item) === item;
        }
    },
    remove: function (array, item) {
        if (Methods.find(array, item)) {
            array.splice(array.indexOf(item), 1);
        }
    },

    addToIndex: function (array, item, index) {
        array.splice(index, 0, item);
    },

    removeNode: function (element) {
        element.parentNode.removeChild(element);
    },
    reverse: function (str, separator, joiner, fromRight) {
        return str.split(`${separator || " "}`).reverse().join(`${joiner || " "}`)//.substr(0,str.length-1-(fromRight||0));
    },
    insert_into_array: function (array, index, item) {
        array.splice(index, 0, item);
    },
    presert: function (concernedNode, concerned_parent, nodeAfter) {
        try {
            nodeAfter = concerned_parent.contains(nodeAfter) ? nodeAfter : null;
            concerned_parent.insertBefore(concernedNode, nodeAfter)
        } catch (e) {
            console.log("shit, a parent on a child?")
        }
    },
    getClassProperty: function (cls, property) {
        document.querySelectorAll(`${cls}`).forEach(function (el) {
            return el.style[`${property}`];
        })
    },
    changeClassProperty: function (cls, elements, property, newValue, oldValue) {
        document.querySelectorAll(`${cls}`).forEach(function (el) {
            Methods.find(elements, el) ? el.style[`${property}`] = newValue : el.style[`${property}`] = oldValue || el.style[`${property}`];
        })
    },

    addClass: function (cls, elements, newValue, oldValue) {
        document.querySelectorAll(`.${cls}`).forEach(function (el) {
            Methods.find(elements, el) ? el.classList.add(newValue) : el.classList.remove(oldValue);
        })
    },

    formatDate: function (d) {
        return ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
            d.getFullYear();// + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    },

    toogle: {
        display: function (element, start_state) {
            let display = element.style.display;
            display = display === "block" ? "none" : "block";
            element.style.display = display;
        },
        classes: function (element, class1, class2) {
            let cls = element.classList;
            if (cls.contains(`${class1}`)) {
                element.classList.remove(`${class1}`);
                element.classList.add(`${class2}`);
            } else if (cls.contains(`${class2}`)) {
                element.classList.remove(`${class2}`);
                element.classList.add(`${class1}`);
            } else {
                console.log("what?")
            }
        }
    },
    getIndex: (element) => {
        let i = 0;
        while ((element = element.previousSibling) !== null) {
            i++
        }
        return i;
    },
    getOffset: (el) => {
        return {
            top: window.scrollY + el.getBoundingClientRect().top,
            left: window.scrollX + el.getBoundingClientRect().left
        };
    },
    toNumber: (n) => {
        return isNaN(parseFloat(n)) ? 0 : parseFloat(n);
    },

    numberWithCommas: (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    getDate: (str) => {
        let obj = {};
        let date = new Date();

        switch (str) {
            case "This Month":
                obj.Start_date = new Date(date.getFullYear(), date.getMonth(), 1);
                obj.End_date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                break;
            case "Last Month":
                obj.End_date = new Date(date.setDate(0));
                obj.Start_date = new Date(date.setDate(1));
                break;

            case "This Year":
                obj.Start_date = new Date(date.getFullYear(), 0, 1);
                obj.End_date = new Date(date.getFullYear(), 11, 31);
                break;

            case "Last Year":
                obj.Start_date = new Date(date.getFullYear() - 1, 0, 1);
                obj.End_date = new Date(date.getFullYear() - 1, 11, 31);
                break;
        }

        // console.log(obj)
        return obj;
    },

    searchIntoArray: (array, my_query, field, specific_field = false) => {
        if (specific_field) {
            return array.filter((record) => {
                let flag = false;
                if (record[field].toString().toLowerCase().trim() === (my_query.toString().toLowerCase().trim())) {
                    flag = true;
                }
                return flag
            });
        } else {
            return array.filter((record) => {
                let flag = false;
                for (let i in record) {
                    if (record.hasOwnProperty(i)) {
                        if (i !== "_id") {
                            if (record[i].toString().toLowerCase().indexOf(my_query) > -1) {
                                flag = true;
                                break;
                            }
                        }
                    }
                }
                return flag
            });
        }
    },
    sort_array(array = [], sortItem) {
        array.sort((item1, item2) => {
            if (item1[sortItem] < item2[sortItem]) {
                return -1;
            }
            if (item1[sortItem] > item2[sortItem]) {
                return 1;
            }
            return 0;
        });
        return array;
    },
    getFields: (tableHead, defaultObject, supplyItemName = false) => {
        let cmp = [];
        console.log(defaultObject)
        tableHead.map((item) => {
            switch (item.id) {
                case "Status":
                    cmp.push(<div key={item.id} className="mb-3 master">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                            {"Status"} *
                        </label>
                        {getRole() === "Super Admin" ?
                            <select
                                defaultValue="{webUserSelected}"
                                // onChange={(e) => handleWebUserChange(e.target.value)}
                                className="form-select"
                                aria-label="Default select example"
                            >
                                <Status
                                    dv={defaultObject ? {"Id": defaultObject["Status"]} : item.defaultValue ? item.defaultValue : ""}/>
                            </select> :
                            <input
                                value={defaultObject ? {Name: defaultObject["Status"]}.Name : item.defaultValue ? item.defaultValue.Status.Name : "Inactive"}
                                disabled
                                // onChange={(e) => SetVaccineName(e.target.value)}
                                type="text"
                                className="form-control"
                                id=""
                                placeholder={"Enter " + item.id}
                            />
                        }</div>);
                    break;

                case "Prediction":
                    cmp.push(<div key={item.id} className="mb-3 master">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                            {"Prediction"} *
                        </label>
                        {getRole() === "Super Admin" ?
                            <select
                                defaultValue="{webUserSelected}"
                                // onChange={(e) => handleWebUserChange(e.target.value)}
                                className="form-select"
                                aria-label="Default select example"
                            >
                                <OddItemsCmp
                                    dv={defaultObject ? {"Id": defaultObject[""]} : item.defaultValue ? item.defaultValue : ""}/>
                            </select> :
                            <input
                                value={defaultObject ? {Name: defaultObject["Prediction"]}.Name : item.defaultValue ? item.defaultValue.Prediction.Name : "Inactive"}
                                disabled
                                // onChange={(e) => SetVaccineName(e.target.value)}
                                type="text"
                                className="form-control"
                                id=""
                                placeholder={"Enter " + item.id}
                            />
                        }</div>);
                    break;
                case "Image":
                    cmp.push(
                        <div key={item.id} className="mb-3 master">
                            <label htmlFor="exampleFormControlInput1" className="form-label">
                                {item.id}
                            </label>
                            <UploadImage
                                dv={defaultObject ? defaultObject : item.defaultValue ? item.defaultValue : ""}/>
                        </div>
                    );
                    break;

                    case "File":
                    cmp.push(
                        <div key={item.id} className="mb-3 master">
                            <label htmlFor="exampleFormControlInput1" className="form-label">
                                {item.id}
                            </label>
                            <UploadFile
                                dv={defaultObject ? defaultObject : item.defaultValue ? item.defaultValue : ""}/>
                        </div>
                    );
                    break;
//Message
                case "Date":
                case "Start_date":
                case "End_date":
                    cmp.push(<div key={item.id} className="mb-3 master">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                            {item.id + "*"}
                        </label>
                        <input
                            defaultValue={defaultObject ? defaultObject[item.id] : item.defaultValue ? item.defaultValue : ""}
                            // onChange={(e) => SetVaccineName(e.target.value)}
                            type="date"
                            className="form-control"
                            id=""
                            placeholder={"Enter " + item.id}
                        />

                    </div>);
                    break;
                case "Time":
                case "Start_time":
                case "End_time":
                    cmp.push(<div key={item.id} className="mb-3 master">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                            {item.id + "*"}
                        </label>
                        <input
                            defaultValue={defaultObject ? defaultObject[item.id] : item.defaultValue ? item.defaultValue : ""}
                            // onChange={(e) => SetVaccineName(e.target.value)}
                            type="time"
                            className="form-control"
                            id=""
                            placeholder={"Enter " + item.id}
                        />

                    </div>);
                    break;

                case "Message":
                    cmp.push(<div key={item.id} className="mb-3 master">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                            {item.id + "*"}
                        </label>
                        <textarea
                            defaultValue={defaultObject ? defaultObject[item.id] : item.defaultValue ? item.defaultValue : ""}
                            // onChange={(e) => SetVaccineName(e.target.value)}
                            className="form-control txtarea"
                            id=""
                            placeholder={"Enter " + item.id}
                        />

                    </div>);
                    break;


                case "Quantity":
                    cmp.push(<div key={item.id} className="mb-3 master">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                            {item.id + "*"}
                        </label>

                        <DeducableFromSelection
                            dv={defaultObject ? defaultObject[item.id] : item.defaultValue ? item.defaultValue : ""}
                            tt={item.id}/>
                    </div>);
                    break;

                case "EntryPrice":
                    cmp.push(<div key={item.id} className="mb-3 master">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                            {item.id + "*"}
                        </label>

                        <DeducableFromSelection
                            dv={defaultObject ? defaultObject[item.id] : item.defaultValue ? item.defaultValue : ""}
                            tt={"Amount"}/>
                    </div>);
                    break;

                case "Role":
                    cmp.push(<div key={item.id} className="mb-3 master">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                            {"Role"} *
                        </label>
                        {console.log(defaultObject)}
                        {getRole() === "Super Admin" ?
                            <select
                                defaultValue="{webUserSelected}"
                                // onChange={(e) => handleWebUserChange(e.target.value)}
                                className="form-select"
                                aria-label="Default select example"
                            >

                                <Roles
                                    dv={defaultObject ? {Name: defaultObject["Role"]} : item.defaultValue ? item.defaultValue : ""}/>

                                }
                            </select> : <input
                                value={defaultObject ? {Name: defaultObject["Role"]}.Name : item.defaultValue ? item.defaultValue.Role.Name : "Tenant"}
                                // onChange={(e) => SetVaccineName(e.target.value)}
                                disabled
                                type="text"
                                className="form-control"
                                id=""
                                placeholder={"Enter " + item.id}
                            />
                        }</div>);
                    break;

                case "MessageType":
                    cmp.push(<div key={item.id} className="mb-3 master">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                            {"MessageType"} *
                        </label>
                        {console.log(defaultObject)}
                        {getRole() === "Super Admin" ?
                            <select
                                defaultValue="{webUserSelected}"
                                // onChange={(e) => handleWebUserChange(e.target.value)}
                                className="form-select"
                                aria-label="Default select example"
                            >

                                <MessageType
                                    dv={defaultObject ? {Name: defaultObject["MessageType"]} : item.defaultValue ? item.defaultValue : ""}/>

                                }
                            </select> : <input
                                value={defaultObject ? {Name: defaultObject["MessageType"]}.Name : item.defaultValue ? item.defaultValue.Role.Name : "Internal Message"}
                                // onChange={(e) => SetVaccineName(e.target.value)}
                                disabled
                                type="text"
                                className="form-control"
                                id=""
                                placeholder={"Enter " + item.id}
                            />
                        }</div>);
                    break;


                case "UserId":
                    cmp.push(<div key={item.id} className="mb-3 master">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                            {item.id + "*"}
                        </label>
                        <select
                            defaultValue="{webUserSelected}"
                            // onChange={(e) => handleWebUserChange(e.target.value)}
                            className="form-select"
                            aria-label="Default select example"
                        >
                            <UserId
                                dv={defaultObject ? {"Id": defaultObject["UserId"]} : item.defaultValue ? item.defaultValue : ""}/>
                        </select></div>);
                    break;

                case "LogsType":
                    console.log(item)
                    cmp.push(<div key={item.id} className="mb-3 master">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                            {"LogsType"} *
                        </label>
                        {getRole() === "Super Admin" ?
                            <select
                                // value={item.defaultValue?item.defaultValue:""}
                                // onChange={(e) => handleWebUserChange(e.target.value)}
                                className="form-select"
                                aria-label="Default select example"
                            >
                                <SiteId
                                    dv={defaultObject ? {"Id": defaultObject["LogsType"]} : item.defaultValue ? item.defaultValue : ""}/>
                            </select> :
                            <>
                                <input
                                    value={defaultObject ? {Name: defaultObject["LogsType"]}.Name : item.defaultValue ? item.defaultValue.LogsType : ""}
                                    // onChange={(e) => SetVaccineName(e.target.value)}
                                    disabled
                                    type="text"
                                    className="form-control"
                                    id=""
                                    placeholder={"Enter " + item.id}
                                />
                            </>
                        }
                    </div>);
                    break;

                case "items":
                    console.log(item)
                    cmp.push(<div key={item.id} className="mb-3 master">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                            {"items"} *
                        </label>
                        {getRole() === "Super Admin" ?
                            <ItemsId
                                dv={defaultObject ? {"Id": defaultObject["items"]}.Id : item.defaultValue ? item.defaultValue : ""}/>
                            :
                            <>
                                <input
                                    value={defaultObject ? {Name: defaultObject["items"]}.Name : item.defaultValue ? item.defaultValue.items : ""}
                                    // onChange={(e) => SetVaccineName(e.target.value)}
                                    disabled
                                    type="text"
                                    className="form-control"
                                    id=""
                                    placeholder={"Enter " + item.id}
                                />
                            </>
                        }
                    </div>);
                    break;

                case "Privilege":
                    console.log(item)
                    cmp.push(<div key={item.id} className="mb-3 master">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                            {"Privilege"} *
                        </label>
                        {getRole() === "Super Admin" ?
                            <select
                                // value={item.defaultValue?item.defaultValue:""}
                                // onChange={(e) => handleWebUserChange(e.target.value)}
                                className="form-select"
                                aria-label="Default select example"
                            >
                                <ProjectId
                                    dv={defaultObject ? {"Id": defaultObject["Privilege"]} : item.defaultValue ? item.defaultValue : ""}/>
                            </select> :
                            <>
                                <input
                                    value={defaultObject ? {Name: defaultObject["Privilege"]}.Name : item.defaultValue ? item.defaultValue.Privilege : ""}
                                    // onChange={(e) => SetVaccineName(e.target.value)}
                                    disabled
                                    type="text"
                                    className="form-control"
                                    id=""
                                    placeholder={"Enter " + item.id}
                                />
                            </>
                        }
                    </div>);
                    break;

                case "InvoiceId":
                    console.log(item)
                    cmp.push(<div key={item.id} className="mb-3 master">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                            {"InvoiceId"} *
                        </label>
                        {getRole() === "Super Admin" ?
                            <select
                                // value={item.defaultValue?item.defaultValue:""}
                                // onChange={(e) => handleWebUserChange(e.target.value)}
                                className="form-select"
                                aria-label="Default select example"
                            >
                                <InvoiceId
                                    dv={defaultObject ? {"Id": defaultObject["InvoiceId"]} : item.defaultValue ? item.defaultValue : ""}/>
                            </select> :
                            <>
                                <input
                                    value={defaultObject ? {Name: defaultObject["InvoiceId"]}.Name : item.defaultValue ? item.defaultValue.InvoiceId : ""}
                                    // onChange={(e) => SetVaccineName(e.target.value)}
                                    disabled
                                    type="text"
                                    className="form-control"
                                    id=""
                                    placeholder={"Enter " + item.id}
                                />
                            </>
                        }
                    </div>);
                    break;

                case "DivisionId":
                    cmp.push(<div key={item.id} className="mb-3 master">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                            {"DivisionId"} *
                        </label>
                        {getRole() === "Super Admin" ?
                            <select
                                // value={item.defaultValue?item.defaultValue:""}
                                // onChange={(e) => handleWebUserChange(e.target.value)}
                                className="form-select"
                                aria-label="Default select example"
                            >
                                <DivisionId
                                    dv={defaultObject ? {"Id": defaultObject["DivisionId"]} : item.defaultValue ? item.defaultValue : ""}/>
                            </select> :
                            <>
                                <input
                                    value={defaultObject ? {Name: defaultObject["DivisionId"]}.Name : item.defaultValue ? item.defaultValue.DivisionId : ""}
                                    // onChange={(e) => SetVaccineName(e.target.value)}
                                    disabled
                                    type="text"
                                    className="form-control"
                                    id=""
                                    placeholder={"Enter " + item.id}
                                />
                            </>
                        }
                    </div>);
                    break;

                case "SuppliesId":
                    console.log(item)
                    cmp.push(<div key={item.id} className="mb-3 master">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                            {"SuppliesId"} *
                        </label>
                        {getRole() === "Super Admin" ?
                            <select
                                // value={item.defaultValue?item.defaultValue:""}
                                // onChange={(e) => handleWebUserChange(e.target.value)}
                                className="form-select"
                                aria-label="Default select example"
                            >
                                <SuppliesId
                                    dv={defaultObject ? {"Id": defaultObject["SuppliesId"]} : item.defaultValue ? item.defaultValue : ""}/>
                            </select> :
                            <>
                                <input
                                    value={defaultObject ? {Name: defaultObject["SuppliesId"]}.Name : item.defaultValue ? item.defaultValue.SuppliesId : ""}
                                    // onChange={(e) => SetVaccineName(e.target.value)}
                                    disabled
                                    type="text"
                                    className="form-control"
                                    id=""
                                    placeholder={"Enter " + item.id}
                                />
                            </>
                        }
                    </div>);
                    break;
                case "HouseId":
                    console.log(item.defaultValue)
                    cmp.push(<div key={item.id} className="mb-3 master">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                            {"HouseId"} *
                        </label>
                        {getRole() === "Super Admin" ?
                            <select
                                // value={item.defaultValue?item.defaultValue:""}
                                // onChange={(e) => handleWebUserChange(e.target.value)}
                                className="form-select"
                                aria-label="Default select example"
                            >
                                <HouseId
                                    dv={defaultObject ? {"Id": defaultObject["HouseId"]} : item.defaultValue ? item.defaultValue : ""}/>
                            </select> :
                            <input
                                value={defaultObject ? {Name: defaultObject["HouseId"]}.Name : item.defaultValue ? item.defaultValue.HouseId : ""}
                                // onChange={(e) => SetVaccineName(e.target.value)}
                                disabled
                                type="text"
                                className="form-control"
                                id=""
                                placeholder={"Enter " + item.id}
                            />
                        }
                    </div>);
                    break;
                case "Amenities":
                    cmp.push(<div key={item.id} className="mb-3 master amenities-cont">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                            {item.id + "*"}
                        </label>
                        <Amenities dv={defaultObject ? (defaultObject[item.id]) : ""}/>
                        {/*<input
                            defaultValue={defaultObject ? JSON.stringify(defaultObject[item.id]) : ""}
                            // onChange={(e) => SetVaccineName(e.target.value)}
                            type="text"
                            className="form-control"
                            id=""
                            placeholder={"Enter " + item.id}
                        />*/}
                    </div>);
                    break;

                case "Features":
                    cmp.push(<div key={item.id} className="mb-3 master amenities-cont form-control">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                            {item.id + "*"}
                        </label>
                        <Features dv={defaultObject ? (defaultObject[item.id]) : ""}/>
                        {/*<input
                            defaultValue={defaultObject ? JSON.stringify(defaultObject[item.id]) : ""}
                            // onChange={(e) => SetVaccineName(e.target.value)}
                            type="text"
                            className="form-control"
                            id=""
                            placeholder={"Enter " + item.id}
                        />*/}
                    </div>);
                    break;
                case "undefined":
                    break;
                case "IsVerified":
                    cmp.push(<div key={item.id} className="mb-3 master">
                        <label htmlFor="exampleFormControlInput1" className="form-label">
                            {item.id + "*"}
                        </label>
                        {getRole() === "Super Admin" ?
                            <input
                                defaultValue={defaultObject ? {Name: defaultObject["IsVerified"]}.Name : item.defaultValue ? item.defaultValue.Role.Name : "No"}
                                // onChange={(e) => SetVaccineName(e.target.value)}
                                type="text"
                                className="form-control"
                                placeholder={"Enter " + item.id}
                            /> : <input
                                value={defaultObject ? {Name: defaultObject["IsVerified"]}.Name : item.defaultValue ? item.defaultValue.IsVerified.Name : "No"}
                                // onChange={(e) => SetVaccineName(e.target.value)}
                                disabled
                                type="text"
                                className="form-control"
                                placeholder={"Enter " + item.id}
                            />
                        }

                    </div>);
                    break;
                default:
                    if (item.id.indexOf("Condition") !== -1) {
                        cmp.push(<div key={item.id} className="mb-3 master">
                            <label htmlFor="exampleFormControlInput1" className="form-label">
                                {item.id + "*"}
                            </label>
                            <select
                                defaultValue="{webUserSelected}"
                                // onChange={(e) => handleWebUserChange(e.target.value)}
                                className="form-select"
                                aria-label="Default select example"
                            >
                                <Conditions
                                    dv={defaultObject ? {Name: defaultObject[item.id]} : item.defaultValue ? item.defaultValue : ""}/>
                            </select>
                        </div>)
                    } else {
                        if (item.id === "Name") {
                            if (supplyItemName) {
                                cmp.push(<div key={item.id} className="mb-3 master">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">
                                        {"Name"} *
                                    </label>
                                    {getRole() === "Super Admin" ?

                                        <SuppliesItemName
                                            dv={defaultObject ? {"Name": defaultObject["Name"]} : item.defaultValue ? item.defaultValue : ""}/>
                                        :
                                        <>
                                            <input
                                                value={defaultObject ? {Name: defaultObject["Name"]}.Name : item.defaultValue ? item.defaultValue.Name : ""}
                                                // onChange={(e) => SetVaccineName(e.target.value)}
                                                disabled
                                                type="text"
                                                className="form-control"
                                                id=""
                                                placeholder={"Enter " + item.id}
                                            />
                                        </>
                                    }
                                </div>);
                            } else {
                                cmp.push(<div key={item.id} className="mb-3 master">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">
                                        {item.id + "*"}
                                    </label>
                                    <input
                                        defaultValue={defaultObject ? defaultObject[item.id] : ""}
                                        // onChange={(e) => SetVaccineName(e.target.value)}
                                        type="text"
                                        className="form-control"
                                        placeholder={"Enter " + item.id}
                                    />

                                </div>)
                            }
                        } else {
                            cmp.push(<div key={item.id} className="mb-3 master">
                                <label htmlFor="exampleFormControlInput1" className="form-label">
                                    {item.id + "*"}
                                </label>
                                <input
                                    defaultValue={defaultObject ? defaultObject[item.id] : ""}
                                    // onChange={(e) => SetVaccineName(e.target.value)}
                                    type="text"
                                    className="form-control"
                                    placeholder={"Enter " + item.id}
                                />

                            </div>)
                        }
                    }
            }
        });
        return cmp

    },
    convertObject(Features) {
        let f = (Features);
        let tmp = "";
        for (let i in f) {
            tmp += i + "=" + f[i] + ",";
        }
        return tmp
        // JSON.stringify(Features).replace(/{"/g, "-").replace(/}"/g, "").replace(/":"/g, "=")

    }
};

export function createDomElement(args = {
    name: null,
    id: null,
    creator: null,
    innerHTML: null,
    start: null,
    appendTo: null,
    prependTo: null,
    display: null
}) {
    let el = document.createElement(args.name);
    if (args.class) {
        el.classList += args.class;
    }
    if (args.id) {
        el.id = args.id;
    }
    if (args.creator) {
        el.creator = args.creator;
    }
    if (args.innerHTML) {
        el.innerHTML = args.innerHTML;
    }
    if (args.value) {
        el.value = args.value;
    }
    if (args.start) {
        el.start = `args.start||1`;
    }
    if (args.appendTo) {
        args.appendTo.appendChild(el);
    }
    if (args.prependTo) {
        args.prependTo.prepend(el);
    }
    if (args.display) {
        args.display.style = `${args.display}`;
    }
    return el;
}

export function setAttributesTo(attr, el1, el2) {
    function f(el1, el2) {
        for (let i in el1) {
            if (el1.hasOwnProperty(i)) {
                el1[i][`${attr}`] = el2[i];
                if (el1[i].querySelector("ul") && el1[i].querySelector("ul")["children"].length > 0) {
                    f(el1[i].querySelector("ul")["children"], el2[i]["children"]);
                }
            }
        }
    }

    el1[`${attr}`] = el2;
    f(el1.querySelector("ul")["children"], el2["children"]);
}

export function objectionalize(array) {
    let v = {};
    for (let i = 0; i < array.length; i++) {
        v[array[i]] = array[i];
    }
    return v;
}

export function arraylify(obj) {
    let v = [];
    for (let i = 0; i < obj.length; i++) {
        v[i] = obj[i].title;
    }
    return v;
}

export function quantity_array(array) {
    let v = [];
    for (let i = 0; i < array.length; i++) {
        v.push(0);
    }
    return v;
}

function getLetterHead() {
    return (
        `<div>
<img src="ncpb_logo.jpg">
</div>`
    )
}

export function printInvoice(el, selector) {
    let divContents = el ? el.innerHTML : document.querySelector(selector).innerHTML;
    let a = window.open('', 'NCPBEnterprisesLimited', 'height=500, width=800');
    // a.document.title('NCPB');
    a.document.write('<html>');
    a.document.write('<head>' +
        '<title>' +
        'NCPB' +
        '</title>' +
        '<meta name="viewport" content="width=device-width, initial-scale=1" />' +
        '<link rel="stylesheet" type="text/css" href="/print-invoice.css" media="all" />' +
        '</head>');
    a.document.write('<body >');
    a.document.write(divContents);
    a.document.write('</body></html>');
    a.document.close();
    a.focus();
    setTimeout(function () {
        a.print();
    }, 3000);

}

export function printElement(el, selector) {
    // let data = document.querySelector(selector).innerHTML;
    let divContents = el ? el.innerHTML : document.querySelector(selector).innerHTML;
    let a = window.open('', 'National Cereals and Produce Board', 'height=800, width=1200');
    a.document.write('<html>');
    a.document.write('<head>' +
        '<meta name="viewport" content="width=device-width, initial-scale=1" />' +
        '<link rel="stylesheet" type="text/css" href="/App_print.css" media="all" />' +
        '</head>');
    a.document.write('<body >');
    a.document.write(divContents);
    a.document.write('</body></html>');
    a.document.close();
    a.focus();
    setTimeout(function () {
        a.print();
    }, 3000);

}



export const loader = () => {
    return `<div key={item.id} class="loader_cont fill_height fill_width">
                            <svg class="loader">
                                <circle r="21" cx="20px" cy="20px" />
                            </svg>
                        </div>`
};
export default Methods
