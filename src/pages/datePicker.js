import {addDays} from "date-fns";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {DateRangePicker} from 'react-date-range';
import React, {useEffect, useState} from "react";
import Methods from "../utils/utilities";
import {Link as RouterLink} from "react-router-dom";
import Iconify from "../components/Iconify";
import {Button} from "@mui/material";


export default function DatePickerComponent(props) {
    function collapse(e) {
        Methods.toogle.display(document.querySelector(".picker-container"), "hide")
    }

    return (
        <div className="pick-date">
            <Button
                variant="outlined"
                component={RouterLink}
                color={"secondary"}
                sx={{"marginRight": "10px"}}
                to="#"
                startIcon={<Iconify icon="map:finance"/>}
                onClick={collapse}
            >
                Select Period
            </Button>
            <div className="picker-container hide">
                <_App setParentState={props.setParentState}/>
            </div>
        </div>
    )
}


function _App(props) {
    const [state, setState] = useState([]);

    useEffect(() => {
        if (state.length === 0) {
            // var date = new Date();
            // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            // var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            var curr = new Date; // get current date
            var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
            var last = first + 6; // last day is the first day + 6
            var firstDay = new Date(curr.setDate(first));
            firstDay = new Date("" + (firstDay.getMonth() + 1) + "/" + firstDay.getDate() + "/" + firstDay.getFullYear());
            var lastDay = new Date(curr.setDate(last));
            lastDay = new Date("" + (lastDay.getMonth() + 1) + "/" + lastDay.getDate() + "/" + lastDay.getFullYear());

            setState([
                {
                    startDate: firstDay,
                    endDate: lastDay,
                    key: "selection"
                }
            ]);
            props.setParentState([
                {
                    startDate: firstDay,
                    endDate: lastDay,
                    key: "selection"
                }
            ]);
        }
    }, [state, setState]);

    return (
        <div key={JSON.stringify(state)}>
            <DateRangePicker
                onChange={(item) => {
                    props.setParentState([item.selection]);
                    setState([item.selection])
                }}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={state}
                direction="horizontal"
            />
        </div>
    );
}