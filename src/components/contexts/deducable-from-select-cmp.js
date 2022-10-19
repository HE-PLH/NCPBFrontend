import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {ShowAppDialogContext} from "./contexts";


export default function DeducableFromSelection(props) {
    const {deducableFromSelect} = useContext(ShowAppDialogContext);


    return (
        <>
            {props.dv ? <>
                    <input
                            defaultValue={props.dv}
                            // onChange={(e) => SetVaccineName(e.target.value)}
                            className="form-control"
                            id=""
                            placeholder={"Enter "+props.tt}
                        />
                </> :

                <>
                    <input
                            defaultValue={deducableFromSelect?deducableFromSelect[props.tt]:""}
                            // onChange={(e) => SetVaccineName(e.target.value)}
                            className="form-control"
                            id=""
                            placeholder={"Enter "+props.tt}
                        />
                </>
                }

            </>)
            }