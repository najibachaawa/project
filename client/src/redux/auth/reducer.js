import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,
    REGISTER_USER,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,
    LOGOUT_USER,
    FORGOT_PASSWORD,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_ERROR,
    RESET_PASSWORD,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_ERROR,
    SET_CURRENT_USER,
    SET_CURRENT_DATA
} from '../actions';

const isEmpty = require("is-empty");

const INIT_STATE = {
    user: localStorage.getItem('user_id'),
    forgotUserMail: '',
    newPassword: '',
    resetPasswordCode: '',
    loading: false,
    error: ''
};

export default (state = INIT_STATE, action) => {

    switch (action.type) {
        case LOGIN_USER:
            console.log("LOGIN IUSER")
          //    console.log(action.payload ,'PAYYYYYYYYLOAAD' ,action.payload.user)
            return { ...state, loading: true, user:"HHHHHHH", error: '' };
        case SET_CURRENT_DATA:
       return { ...state, loading: true, user:"HHHHHHH", error: '' };
        case LOGIN_USER_SUCCESS:
            console.log(action.payload ,'PAYYYYYYYYLOAAD' ,action.payload.user)
            return { ...state, loading: false/*.jwtToken*/,user:"DLOL", error: '' };
        case LOGIN_USER_ERROR:
            return { ...state, loading: false, user: '', error: action.payload.message };
        case SET_CURRENT_USER:
            return { ...state, isAuthenticated: !isEmpty(action.payload), user: action.payload};
        case FORGOT_PASSWORD:
            return { ...state, loading: true, error: '' };
        case FORGOT_PASSWORD_SUCCESS:
            return { ...state, loading: false, forgotUserMail: action.payload, error: '' };
        case FORGOT_PASSWORD_ERROR:
            return { ...state, loading: false, forgotUserMail: '', error: action.payload.message };
        case RESET_PASSWORD:
            return { ...state, loading: true, error: '' };
        case RESET_PASSWORD_SUCCESS:
            return { ...state, loading: false, newPassword: action.payload, resetPasswordCode: '', error: '' };
        case RESET_PASSWORD_ERROR:
            return { ...state, loading: false, newPassword: '', resetPasswordCode: '', error: action.payload.message };
        case REGISTER_USER:
            return { ...state, loading: true, error: '' };
        case REGISTER_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload/*.jwtToken*/, error: '' };
        case REGISTER_USER_ERROR:
            return { ...state, loading: false, user: '', error: action.payload.message };
        case LOGOUT_USER:
            return { ...state, user: null, error: '' };
        default: return { ...state };
    }
}
