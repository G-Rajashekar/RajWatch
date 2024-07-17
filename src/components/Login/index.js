import React, {useState} from 'react'
import Cookies from 'js-cookie'
import {Redirect, useHistory} from 'react-router-dom'

import {
  AppContainer,
  FormContainer,
  LoginLogo,
  InputContainer,
  LoginButton,
  SubmitError,
  InputLabel,
  UserInput,
  CheckboxContainer,
  Checkbox,
  ShowPassword,
} from './styledComponents'

const Login = () => {
  const [loginDetails, setLoginDetails] = useState({
    username: '',
    password: '',
    showPassword: false,
    showSubmitError: false,
    errorMsg: '',
  })

  const history = useHistory()

  const onChangeHandler = event => {
    const {name, value} = event.target
    setLoginDetails(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const OnShowPassword = () => {
    setLoginDetails(prevState => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }))
  }

  const onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  const onSubmitFailure = errorMsg => {
    setLoginDetails(prevState => ({
      ...prevState,
      showSubmitError: true,
      errorMsg,
    }))
  }

  const submitForm = async event => {
    event.preventDefault()
    const {username, password} = loginDetails
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      onSubmitSuccess(data.jwt_token)
    } else {
      onSubmitFailure(data.error_msg)
    }
  }

  const renderUsernameField = () => {
    const {username} = loginDetails
    return (
      <>
        <InputLabel htmlFor="username">USERNAME</InputLabel>
        <UserInput
          type="text"
          id="username"
          value={username}
          name="username"
          onChange={onChangeHandler}
          placeholder="Username"
        />
      </>
    )
  }

  const renderPasswordField = () => {
    const {password, showPassword} = loginDetails
    const inputType = showPassword ? 'text' : 'password'
    return (
      <>
        <InputLabel htmlFor="password">PASSWORD</InputLabel>
        <UserInput
          type={inputType}
          id="password"
          value={password}
          name="password"
          onChange={onChangeHandler}
          placeholder="Password"
        />
        <CheckboxContainer>
          <Checkbox type="checkbox" id="checkbox" onChange={OnShowPassword} />
          <ShowPassword htmlFor="checkbox">Show Password</ShowPassword>
        </CheckboxContainer>
      </>
    )
  }

  const {showSubmitError, errorMsg} = loginDetails
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken !== undefined) {
    return <Redirect to="/" />
  }

  return (
    <AppContainer>
      <FormContainer onSubmit={submitForm}>
        <LoginLogo
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
          alt="website logo"
        />
        <InputContainer>{renderUsernameField()}</InputContainer>
        <InputContainer>{renderPasswordField()}</InputContainer>
        <LoginButton type="submit">Login</LoginButton>
        {showSubmitError && <SubmitError>*{errorMsg}</SubmitError>}
      </FormContainer>
    </AppContainer>
  )
}

export default Login
