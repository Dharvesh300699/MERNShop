import React, { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import Message from "../components/Message"
import Loader from "../components/Loader"
import Meta from "../components/Meta"
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions"
import { cartReset } from "../actions/cartActions"
import * as actionTypes from "../actions/actionTypes"

const OrderScreen = ({ history, match }) => {
  const orderId = match.params.id

  const [sdkReady, setSdkReady] = useState(true)
  const [localError, setLocalError] = useState(null)
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  useEffect(() => {
    if (userInfo) {
      if (
        order.orderItems.length === 0 ||
        order._id !== orderId ||
        successPay ||
        successDeliver
      ) {
        dispatch(getOrderDetails(orderId))
      }

      if (successPay) {
        dispatch({ type: actionTypes.ORDER_PAY_RESET })
        dispatch({ type: actionTypes.ORDER_CREATE_RESET })
        dispatch(cartReset())
      }
      if (successDeliver) {
        dispatch({ type: actionTypes.ORDER_DELIVER_RESET })
      }
    } else {
      history.push("/login")
    }
  }, [
    dispatch,
    history,
    orderId,
    order._id,
    order.orderItems,
    successPay,
    successDeliver,
    userInfo,
  ])

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.type = "text/javascript"
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(orderId))
  }

  const paymentHandler = async () => {
    try {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      )

      if (!res) {
        setSdkReady(false)
        return
      } else {
        setSdkReady(true)
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      }
      const result = await axios.get(
        `/api/orders/${orderId}/razorOrder`,
        config
      )

      const { amount, id: order_id, currency } = result.data
      const KEY_ID = await axios.get("/api/config/razorPay")

      const options = {
        key: KEY_ID,
        amount: amount.toString(),
        currency: currency,
        name: "PROSHOP",
        description: "Thanks for shopping with us.",
        image:
          "https://res.cloudinary.com/dswp5qfpm/image/upload/v1623813881/ecommerce/shopping_rjxaee.png",
        order_id: order_id,
        handler: async function (response) {
          const successData = {
            orderCreationId: order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          }

          const { data } = await axios.post(
            "/api/orders/success",
            successData,
            config
          )
          dispatch(payOrder(orderId, data))
        },
        prefill: {
          name: order.user?.name,
          email: order.user?.email,
        },
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (error) {
      setLocalError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    }
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <Meta title="Order Details" />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Order ID: </strong>
                {order._id}
              </p>
              <p>
                <strong>Name: </strong>
                {order.user?.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user?.email}`}>{order.user?.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt.substring(0, 10)}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Paid on {order.paidAt.substring(0, 10)}
                </Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item) => (
                    <ListGroup.Item key={item.product}>
                      <Row>
                        <Col md={3}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col md={5}>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x &#8377;{item.price} = &#8377;
                          {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>&#8377;{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>&#8377;{order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>&#8377;{order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>&#8377;{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {!sdkReady && (
                    <Message variant="danger">
                      Unable to proceed! Are you online?
                    </Message>
                  )}
                  {localError && (
                    <Message variant="danger">{localError}</Message>
                  )}
                  <Button className="btn btn-block" onClick={paymentHandler}>
                    Pay Now
                  </Button>
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.user.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
