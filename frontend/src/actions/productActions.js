import axios from "axios"
import * as actionTypes from "./actionTypes"

export const listProducts = (keyword = "", pageNumber = 1) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionTypes.PRODUCT_LIST_REQUEST })

      const { data } = await axios.get(
        `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
      )
      dispatch({ type: actionTypes.PRODUCT_LIST_SUCCESS, payload: data })
    } catch (error) {
      dispatch({
        type: actionTypes.PRODUCT_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }
}

export const listProductDetails = (id) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionTypes.PRODUCT_DETAILS_REQUEST })

      const { data } = await axios.get(`/api/products/${id}`)
      dispatch({ type: actionTypes.PRODUCT_DETAILS_SUCCESS, payload: data })
    } catch (error) {
      dispatch({
        type: actionTypes.PRODUCT_DETAILS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }
}

export const deleteProduct = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actionTypes.PRODUCT_DELETE_REQUEST })

      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      await axios.delete(`/api/products/${id}`, config)
      dispatch({ type: actionTypes.PRODUCT_DELETE_SUCCESS })
    } catch (error) {
      dispatch({
        type: actionTypes.PRODUCT_DELETE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }
}

export const createProduct = (formData) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actionTypes.PRODUCT_CREATE_REQUEST })

      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      await axios.post(`/api/products`, formData, config)
      dispatch({ type: actionTypes.PRODUCT_CREATE_SUCCESS })
    } catch (error) {
      dispatch({
        type: actionTypes.PRODUCT_CREATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }
}

export const updateProduct = (product, id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actionTypes.PRODUCT_UPDATE_REQUEST })

      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      await axios.put(`/api/products/${id}`, product, config)

      dispatch({
        type: actionTypes.PRODUCT_UPDATE_SUCCESS,
      })
    } catch (error) {
      dispatch({
        type: actionTypes.PRODUCT_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }
}

export const createProductReview = (productId, review) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actionTypes.PRODUCT_CREATE_REVIEW_REQUEST })

      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      await axios.post(`/api/products/${productId}/reviews`, review, config)

      dispatch({
        type: actionTypes.PRODUCT_CREATE_REVIEW_SUCCESS,
      })
    } catch (error) {
      dispatch({
        type: actionTypes.PRODUCT_CREATE_REVIEW_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }
}

export const listTopProducts = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionTypes.PRODUCT_TOP_REQUEST })

      const { data } = await axios.get(`/api/products/top`)
      dispatch({ type: actionTypes.PRODUCT_TOP_SUCCESS, payload: data })
    } catch (error) {
      dispatch({
        type: actionTypes.PRODUCT_TOP_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }
}
