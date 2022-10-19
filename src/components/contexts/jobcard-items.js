import React, {useEffect, useState} from "react";
import Methods from "../../utils/utilities";
import {Box, Card, Grid, Container, Typography, Avatar, Stack, Button} from '@mui/material';

export default function JobCardItems(props) {
    const [list, setList] = useState([{index: 0}]);
    const [update, setUpdate] = useState(false);
    let index = 1;

    useEffect(()=>{
        let tmp = [], index;
        if (props.dv) {
            for (let i in props.dv) {
                if (props.dv.hasOwnProperty(i)) {
                    // console.log(props.dv[i].Name, props.dv[i])
                    tmp.push({index:index, field: true, val: props.dv[i].Name})
                }
                index++;
            }
            setList(tmp);
        }else {
            setList([{tmp}]);
        }
        console.log(props.dv)
    }, [props.dv]);
    function clicked(e, index) {
        let temp = [...list];
        console.log(list.length);
        // Methods.insert_into_array(temp, index, {index: list.length});
        setList([...list, {index: list.length}]);
    }

    function del_clicked(e, index) {
        Methods.removeNode(e.target.parentElement)
    }

    return (
        <>
            {list.map((item) => <Card className={'singleAmenity'} key={item.index}>
                <input className={'amenity-item check'} type={'checkbox'} checked={item.field==="Active"?"true": "false"}/>
                <input className={'amenity-item txt form-control'} type={'text'} defaultValue={item.val}/>
                <Button variant="contained" className="add_amenity" onClick={(e) => clicked(e, item.index)}>Add Item</Button>
                <Button className="remove-amenity" onClick={(e) => del_clicked(e, item.index)}>X</Button>
            </Card>)}
        </>
    )
}