import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Form, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import Message from "../components/Message"
import Loader from "../components/Loader"
import Meta from "../components/Meta"
import FormContainer from "../components/FormContainer"
import * as actionTypes from "../actions/actionTypes"
import { createProduct } from "../actions/productActions"

const ProductCreateScreen = ({ history }) => {
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("")
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [message, setMessage] = useState("")

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productCreate = useSelector((state) => state.productCreate)

  const { loading, success, error } = productCreate

  const formData = new FormData()

  useEffect(() => {
    if (!userInfo) {
      history.push("/login")
    } else if (!userInfo.user.isAdmin) {
      history.push("/home")
    } else {
      if (success) {
        history.push("/admin/productlist")
        dispatch({ type: actionTypes.PRODUCT_CREATE_RESET })
      }
    }
  }, [userInfo, success, dispatch, history])

  const submitHandler = (e) => {
    e.preventDefault()
    if (
      !name.trim() ||
      !description.trim() ||
      !category.trim() ||
      !brand.trim()
    ) {
      setMessage("Fields can not be empty!")
    } else {
      setMessage("")

      formData.set("name", name)
      formData.set("description", description)
      formData.set("category", category)
      formData.set("brand", brand)
      formData.set("price", price.toString())
      formData.set("countInStock", countInStock.toString())
      formData.set("image", image)

      dispatch(createProduct(formData))
    }
  }

  const imageFileHandler = (event) => {
    setImage(event.target.files[0])
  }

  return (
    <>
      <Meta title="Create Product" />
      <Link to="/admin/productlist" className="btn btn-dark my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Create Product</h1>
        {message && <Message variant="danger">{message}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                autoComplete="off"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                autoComplete="off"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                autoComplete="off"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="countInStock">
              <Form.Label>CountInStock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter countInStock"
                autoComplete="off"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                autoComplete="off"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.File
                label="Choose File"
                onChange={imageFileHandler}
              ></Form.File>
            </Form.Group>
            <Button type="submit" variant="primary">
              Create
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default ProductCreateScreen
