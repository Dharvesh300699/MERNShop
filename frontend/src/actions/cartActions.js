import axios from "axios";
import * as actionTypes from "./actionTypes";

export const addToCart = (id, qty) => {
  return async (dispatch, getState) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      dispatch({
        type: actionTypes.CART_ADD_ITEM,
        payload: {
          product: data._id,
          name: data.name,
          image: data.image,
          price: data.price,
          countInStock: data.countInStock,
          qty,
        },
      });

      localStorage.setItem(
        "cartItems",
        JSON.stringify(getState().cart.cartItems)
      );
    } catch (error) {
      dispatch({
        type: actionTypes.CART_ITEM_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
};

export const removeFromCart = (id) => {
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.CART_REMOVE_ITEM,
      payload: id,
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  };
};

export const saveShippingAddress = (data) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.CART_SAVE_SHIPPING_ADDRESS,
      payload: data,
    });
    localStorage.setItem("shippingAddress", JSON.stringify(data));
  };
};

export const savePaymentMethod = (data) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.CART_SAVE_PAYMENT_METHOD,
      payload: data,
    });
    localStorage.setItem("paymentMethod", JSON.stringify(data));
  };
};

export const cartReset = () => {
  return (dispatch) => {
    if (localStorage.getItem("cartItems")) {
      localStorage.removeItem("cartItems");
    }

    if (localStorage.getItem("paymentMethod")) {
      localStorage.removeItem("paymentMethod");
    }

    if (localStorage.getItem("shippingAddress")) {
      localStorage.removeItem("shippingAddress");
    }

    dispatch({ type: actionTypes.CART_RESET });
  };
};
