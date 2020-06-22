
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
//import { auth } from '../../helpers/Firebase';
import { login, signup, password_reset, password_change } from "./auth"

import { ACCESS_TOKEN } from '../../constants/defaultValues'

import {
    LOGIN_USER,
    REGISTER_USER,
    LOGOUT_USER,
    FORGOT_PASSWORD,
    RESET_PASSWORD,
} from '../actions';

import {
    loginUserSuccess,
    loginUserError,
    registerUserSuccess,
    registerUserError,
    forgotPasswordSuccess,
    forgotPasswordError,
    resetPasswordSuccess,
    resetPasswordError
} from './actions';


export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

/*const loginWithEmailPasswordAsync = async (email, password) =>
    await auth.signInWithEmailAndPassword(email, password)
        .then(authUser => authUser)
        .catch(error => error);
*/


function* loginWithEmailPassword({ payload }) {
    const { email, password } = payload.user;
    const { history } = payload;
    try {
        
        //const loginUser = yield call(loginWithEmailPasswordAsync, email, password);
        const loginUser = yield call(login , { 
            "email": email, 
            "password": password
        }) 
        // Hard coded values smell. But this should do it. 
        
        if (!loginUser.message) {
          /*  localStorage.setItem(ACCESS_TOKEN, loginUser.jwtToken);
            yield put(loginUserSuccess(loginUser.jwtToken));
            localStorage.setItem("role", loginUser.role);
            localStorage.setItem("email", loginUser.email);
            localStorage.setItem("name", loginUser.name);*/
            history.push('/');
        } else {
            yield put(loginUserError(loginUser.message));
        }
    } catch (error) {
        yield put(loginUserError(error));

    }
}


export function* watchRegisterUser() {
    yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}

/*
const registerWithEmailPasswordAsync = async (email, password) =>
    await auth.createUserWithEmailAndPassword(email, password)
        .then(authUser => authUser)
        .catch(error => error);
*/

function* registerWithEmailPassword({ payload }) {
    const { email, password, name } = payload.user;
    const { history } = payload
    try {
        const registerUser = yield call(signup , { 
            "email": email,
            "password": password,
            "name": name
        });

        if (!registerUser.message) {
            localStorage.setItem(ACCESS_TOKEN, registerUser.jwtToken);
            localStorage.setItem("user", registerUser.user);
            yield put(registerUserSuccess(registerUser.jwtToken));
            history.push('/')
        } else {
            yield put(registerUserError(registerUser.message));
        }
    } catch (error) {
        yield put(registerUserError(error));
    }
}



export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
}

/*
const logoutAsync = async (history) => {
    await auth.signOut().then(authUser => authUser).catch(error => error);
    history.push('/')
}
*/

function* logout({ payload }) {
    const { history } = payload
    try {
        // yield call(logoutAsync, history);
        localStorage.clear();
        history.push('/')
    } catch (error) {
    }
}

export function* watchForgotPassword() {
    yield takeEvery(FORGOT_PASSWORD, forgotPassword);
}

/*
const forgotPasswordAsync = async (email) => {
    return await auth.sendPasswordResetEmail(email)
        .then(user => user)
        .catch(error => error);
}
*/

function* forgotPassword({ payload }) {
    const { email } = payload.forgotUserMail;
    try {
        
        const forgotPasswordStatus = yield call(password_reset , { 
            "email": email
        });


        if (forgotPasswordStatus.status) {
            yield put(forgotPasswordSuccess("success"));
        } else {
            yield put(forgotPasswordError(forgotPasswordStatus.message));
        }

    } catch (error) {
        yield put(forgotPasswordError(error));

    }
}

export function* watchResetPassword() {
    yield takeEvery(RESET_PASSWORD, resetPassword);
}

/*
const resetPasswordAsync = async (resetPasswordCode, newPassword) => {
    return await auth.confirmPasswordReset(resetPasswordCode, newPassword)
        .then(user => user)
        .catch(error => error);
}
*/

function* resetPassword({ payload }) {
    const { newPassword, resetPasswordCode } = payload;
    try {
        
        const resetPasswordStatus = yield call(password_change, resetPasswordCode, newPassword);
        if (!resetPasswordStatus) {
            yield put(resetPasswordSuccess("success"));
        } else {
            yield put(resetPasswordError(resetPasswordStatus.message));
        }
        
    } catch (error) {
        yield put(resetPasswordError(error));
    }
}

export default function* rootSaga() {
    yield all([
        fork(watchLoginUser),
        fork(watchLogoutUser),
        fork(watchRegisterUser),
        fork(watchForgotPassword),
        fork(watchResetPassword),
    ]);
}