import {ACCESS_TOKEN, API_BASE_URL} from "../../constants/defaultValues"
import {SET_CURRENT_USER,SET_CURRENT_DATA} from '../actions'
import {request} from "../utils"

export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function login(loginRequest) {
    console.log("lOGIN")
    return request({
        url: API_BASE_URL + "/auth/login",
        method: 'POST',
        body: JSON.stringify({...loginRequest})
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/register",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}


export function password_reset(resetRequest) {
    return request({
        url: API_BASE_URL + "/auth/forgot_password",
        method: 'POST',
        body: JSON.stringify(resetRequest)
    });
}


export function password_change(resetToken, newPassword) {
    return request({
        url: API_BASE_URL + "/auth/change_password/" + resetToken,
        method: 'POST',
        body: JSON.stringify({
            "newPassword": newPassword
        })
    });
}


export const setCurrentUser = decoded => {
    
    return {
      type: SET_CURRENT_USER,
      payload: decoded
    };
  };
  export const setCurrentDataUser = payload => {
      console.log("SET CURRENT DATA")
    return {
      type: SET_CURRENT_DATA,
      payload
    };
  };