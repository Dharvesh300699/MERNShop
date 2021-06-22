import * as actionTypes from "../actions/actionTypes"

export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.ORDER_CREATE_REQUEST:
      return { loading: true }
    case actionTypes.ORDER_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        order: action.payload,
      }
    case actionTypes.ORDER_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case actionTypes.ORDER_CREATE_RESET:
      return {}
    default:
      return state
  }
}

export const orderDetailsReducer = (
  state = { order: { orderItems: [], shippingAddress: {} } },
  action
) => {
  switch (action.type) {
    case actionTypes.ORDER_DETAILS_REQUEST:
      return {
        ...state,
        order: { ...state.order },
        loading: true,
      }
    case actionTypes.ORDER_DETAILS_SUCCESS:
      return {
        ...state,
        order: {
          ...state.order,
          ...action.payload,
          orderItems: action.payload.orderItems,
          shippingAddress: action.payload.shippingAddress,
        },
        loading: false,
      }
    case actionTypes.ORDER_DETAILS_FAIL:
      return {
        ...state,
        order: { ...state.order },
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export const orderPayReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.ORDER_PAY_REQUEST:
      return {
        loading: true,
      }
    case actionTypes.ORDER_PAY_SUCCESS:
      return {
        loading: false,
        success: true,
      }
    case actionTypes.ORDER_PAY_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case actionTypes.ORDER_PAY_RESET:
      return {}
    default:
      return state
  }
}

export const orderListMyReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case actionTypes.ORDER_LIST_MY_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case actionTypes.ORDER_LIST_MY_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload,
      }
    case actionTypes.ORDER_LIST_MY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case actionTypes.ORDER_LIST_MY_RESET:
      return {
        orders: [],
      }
    default:
      return state
  }
}

export const orderListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case actionTypes.ORDER_LIST_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case actionTypes.ORDER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload,
      }
    case actionTypes.ORDER_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case actionTypes.ORDER_LIST_RESET:
      return {
        orders: [],
      }
    default:
      return state
  }
}

export const orderDeliverReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.ORDER_DELIVER_REQUEST:
      return {
        loading: true,
      }
    case actionTypes.ORDER_DELIVER_SUCCESS:
      return {
        loading: false,
        success: true,
      }
    case actionTypes.ORDER_DELIVER_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case actionTypes.ORDER_DELIVER_RESET:
      return {}
    default:
      return state
  }
}
