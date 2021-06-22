import React, { useState, useEffect } from "react"
import { Form, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import Message from "../components/Message"
import FormContainer from "../components/FormContainer"
import Meta from "../components/Meta"
import CheckoutSteps from "../components/CheckoutSteps"
import { saveShippingAddress } from "../actions/cartActions"

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const [address, setAddress] = useState(
    shippingAddress.address ? shippingAddress.address : ""
  )
  const [city, setCity] = useState(
    shippingAddress.city ? shippingAddress.city : ""
  )
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode ? shippingAddress.postalCode : ""
  )
  const [country, setCountry] = useState(
    shippingAddress.country ? shippingAddress.country : ""
  )

  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    if (!userInfo) {
      history.push("/login?redirect=shipping")
    }
  }, [userInfo, history])

  const submitHandler = (e) => {
    e.preventDefault()
    if (
      !address.trim() ||
      !city.trim() ||
      !postalCode.trim() ||
      !country.trim()
    ) {
      setMessage("Fields can not be empty")
    } else {
      dispatch(saveShippingAddress({ address, city, postalCode, country }))
      history.push("/payment")
    }
  }

  return (
    <FormContainer>
      <Meta title="Shipping Details" />
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      {message && <Message variant="danger">{message}</Message>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            autoComplete="off"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city"
            autoComplete="off"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="postalCode">
          <Form.Label>PostalCode</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter postalCode"
            autoComplete="off"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter country"
            autoComplete="off"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen
