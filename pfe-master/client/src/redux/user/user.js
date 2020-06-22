import {ACCESS_TOKEN, API_BASE_URL} from "../../constants/defaultValues"
import {request} from "../utils"

export const deleteUser = (id) => {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        method: "DELETE", 
        url: API_BASE_URL + "/user/" + id
    })
}

export const updateUser = (id, data) => {
    
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }
    return request({
        method: "PUT", 
        url: API_BASE_URL + "/user/" + id, 
        body: JSON.stringify(data)
    })
}


export const addUser = (data) => {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }
    return request({
        method: "POST", 
        url: API_BASE_URL + "/user", 
        body: JSON.stringify(data)
    })
}