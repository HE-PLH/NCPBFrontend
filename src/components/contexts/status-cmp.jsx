import React, {useEffect, useState} from "react";
import axios from "axios";

export default function Status(props) {
    const [cmp, setCmp] = useState([]);
    useEffect(() => {
        axios.get("http://127.0.0.1:9000/api/status").then((apId) => {
            setCmp(apId.data.info)
        })
    }, [props]);


    return (
        <>
            {props.dv ? <>
                    <option>Select {"Status"}</option>
                    {cmp.map((val, index) => {
                        if (val.Name === props.dv.Name) {
                            return <option key={index} selected value={val.Name}>{val.Name}</option>;
                        } else {
                            return <option key={index} value={val.Name}>{val.Name}</option>;
                        }
                    })}
                </> :

                <>
                    <option selected>Select {"Status"}</option>
                    {cmp.map((val, index) => {
                        return <option key={index} value={val.Name}>{val.Name}</option>;
                    })}
                </>
                }

            </>)
            }