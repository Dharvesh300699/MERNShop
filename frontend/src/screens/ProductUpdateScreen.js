import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Form, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import Message from "../components/Message"
import Loader from "../components/Loader"
import FormContainer from "../components/FormContainer"
import Meta from "../components/Meta"
import * as actionTypes from "../actions/actionTypes"
import { updateProduct, listProductDetails } from "../actions/productActions"

const ProductUpdateScreen = ({ history, match }) => {
  const productId = match.params.id
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

  const productUpdate = useSelector((state) => state.productUpdate)

  const {
    loading: loadingUpdate,
    success: successUpdate,
    error: errorUpdate,
  } = productUpdate

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const formData = new FormData()

  useEffect(() => {
    if (!userInfo) {
      history.push("/login")
    } else if (!userInfo.user.isAdmin) {
      history.push("/home")
    } else {
      if (Object.keys(product).length === 1 || product._id !== productId) {
        dispatch(listProductDetails(productId))
      } else {
        setName(product.name)
        setDescription(product.description)
        setBrand(product.brand)
        setCountInStock(product.countInStock)
        setCategory(product.category)
        setPrice(product.price)
      }

      if (successUpdate) {
        history.push("/admin/productlist")
        dispatch({ type: actionTypes.PRODUCT_UPDATE_RESET })
      }
    }
  }, [userInfo, dispatch, history, product, successUpdate, productId])

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
      if (image) {
        formData.set("image", image)
      }

      dispatch(updateProduct(formData, productId))
    }
  }

  const imageFileHandler = (event) => {
    setImage(event.target.files[0])
  }

  return (
    <>
      <Meta title="Update Product" />
      <Link to="/admin/productlist" className="btn btn-dark my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Create Product</h1>
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loadingUpdate && <Loader />}
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
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default ProductUpdateScreen
