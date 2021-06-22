import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Form, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import Message from "../components/Message"
import Loader from "../components/Loader"
import Meta from "../components/Meta"
import FormContainer from "../components/FormContainer"
import { getUserDetails, adminUpdateUser } from "../actions/userActions"
import * as actionTypes from "../actions/actionTypes"

const UserEditScreen = ({ history, match }) => {
  const userId = match.params.id
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const adminUpdate = useSelector((state) => state.adminUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = adminUpdate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (userInfo && userInfo.user.isAdmin) {
      if (successUpdate) {
        dispatch({ type: actionTypes.ADMIN_UPDATE_RESET })
        dispatch({ type: actionTypes.USER_DETAILS_RESET })
        history.push("/admin/userlist")
      } else {
        if (!user || user._id !== userId) {
          dispatch(getUserDetails(userId))
        } else {
          setName(user.name)
          setEmail(user.email)
          setIsAdmin(user.isAdmin)
        }
      }
    } else if (userInfo) {
      history.push("/")
    } else {
      history.push("/login")
    }
  }, [dispatch, user, userId, userInfo, history, successUpdate])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(adminUpdateUser({ name, email, isAdmin }, userId))
  }

  return (
    <>
      <Meta title="Edit User" />
      <Link to="/admin/userlist" className="btn btn-dark my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
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
            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="isAdmin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
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

export default UserEditScreen
