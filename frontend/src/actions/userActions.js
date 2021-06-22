import * as actionTypes from "./actionTypes";
import axios from "axios";

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionTypes.USER_LOGIN_REQUEST });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/users/login",
        { email, password },
        config
      );

      dispatch({
        type: actionTypes.USER_LOGIN_SUCCESS,
        payload: data,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: actionTypes.USER_LOGIN_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
};

export const logout = () => {
  return (dispatch) => {
    if (localStorage.getItem("paymentMethod")) {
      localStorage.removeItem("paymentMethod");
    }

    if (localStorage.getItem("shippingAddress")) {
      localStorage.removeItem("shippingAddress");
    }

    if (localStorage.getItem("userInfo")) {
      localStorage.removeItem("userInfo");
    }

    if (localStorage.getItem("cartItems")) {
      localStorage.removeItem("cartItems");
    }

    dispatch({ type: actionTypes.USER_LOGOUT });
    dispatch({ type: actionTypes.USER_PROFILE_RESET });
    dispatch({ type: actionTypes.USER_DETAILS_RESET });
    dispatch({ type: actionTypes.ORDER_LIST_MY_RESET });
    dispatch({ type: actionTypes.ORDER_LIST_RESET });
    dispatch({ type: actionTypes.USER_LIST_RESET });
    document.location.href = "/login";
  };
};

export const register = (name, email, password) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionTypes.USER_REGISTER_REQUEST });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/users",
        { name, email, password },
        config
      );

      dispatch({
        type: actionTypes.USER_REGISTER_SUCCESS,
        payload: data,
      });

      dispatch({
        type: actionTypes.USER_LOGIN_SUCCESS,
        payload: data,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: actionTypes.USER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
};

export const getUserProfile = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actionTypes.USER_PROFILE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`/api/users/profile`, config);

      dispatch({
        type: actionTypes.USER_PROFILE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.USER_PROFILE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
};

export const updateUserProfile = (user) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actionTypes.USER_UPDATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(`/api/users/profile`, user, config);

      dispatch({
        type: actionTypes.USER_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.USER_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
};

export const listUsers = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actionTypes.USER_LIST_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`/api/users`, config);

      dispatch({
        type: actionTypes.USER_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.USER_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
};

export const deleteUser = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actionTypes.USER_DELETE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.delete(`/api/users/${id}`, config);

      dispatch({
        type: actionTypes.USER_DELETE_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.USER_DELETE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
};

export const getUserDetails = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actionTypes.USER_DETAILS_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`/api/users/${id}`, config);

      dispatch({
        type: actionTypes.USER_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.USER_DETAILS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
};

export const adminUpdateUser = (user, id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actionTypes.ADMIN_UPDATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(`/api/users/${id}`, user, config);

      dispatch({
        type: actionTypes.ADMIN_UPDATE_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.ADMIN_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
};
