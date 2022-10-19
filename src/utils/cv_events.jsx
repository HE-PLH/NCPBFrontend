import {globals} from "../utilities/globals.jsx";

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
        drag_start: false,
        id: null,
        element: null
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
    hover: {
        status: false,
    }
};

export let Touch = {
    clicking: {
        status: false,
        point: {
            x: 0, y: 0
        },
    },
    dragging: {
        status: false,
        point: {
            x: 0, y: 0
        },
        offset: {
            x: 0,
            y: 0
        }
    },

};

export let drag_start_flag = false;

export const is_swiping = (e)=>{
        if (e.changedTouches && e.changedTouches.length){
            const touch = e.changedTouches[0];
            Touch.dragging.status = true;
            Touch.dragging.point = {
                x: touch.clientX,
                y: touch.clientY
            };
            Touch.dragging.offset = {
                x: touch.clientX-Touch.clicking.point.x,
                y: touch.clientY-Touch.clicking.point.y
            };
            return true;
        }
        return false
};

export const is_dragging = ()=>{
    if(mouse.clicking.status) {
        mouse_is_down();
        if (!((mouse.moving.point.x === mouse.clicking.point.x) && (mouse.moving.point.y === mouse.clicking.point.y))) {
            mouse.dragging.status = true;
            drag_start_flag = true;
            mouse.dragging.offset = {
                x: mouse.moving.point.x - mouse.clicking.point.x,
                y: mouse.moving.point.y - mouse.clicking.point.y,
            };
            return true
        }
        return false
    }else return false
};

const mouse_is_down = ()=>{
    mouse.dragging.drag_start = !drag_start_flag;
};

export const on_start_click = (e)=>{
    mouse.releasing.status = false;
    mouse.clicking.status = true;
    mouse.clicking.point = {x: e.clientX, y: e.clientY};
    mouse_is_down();
};
export const on_late_click = (e)=>{
    mouse.releasing.status = false;
    // mouse.clicking.status = true;
    mouse.clicking.point = {x: e.clientX, y: e.clientY};
};
export const on_mouse_move = (e)=>{
    mouse.moving.status = true;
    mouse.moving.point = {x: e.clientX, y: e.clientY};
};

export const on_released = (e)=>{
    globals.c_change = false;
    mouse.hovering.status = false;
    mouse.moving.point = {x: e.clientX, y: e.clientY};
    drag_start_flag = false;
    mouse.hovering.status = false;
    mouse.moving.status = false;
    mouse.dragging.status = false;
    mouse.clicking.point = {x: e.clientX, y: e.clientY};
    mouse.releasing.status = true;
    mouse.clicking.status = false;
};

export const on_mouse_out = (e)=>{
    e.stopPropagation();
    mouse.hovering.status = true;
    mouse.hovering.point = {x: e.clientX, y: e.clientY};

};

export default mouse