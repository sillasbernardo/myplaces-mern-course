import React, { useState, useContext } from 'react';

import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import { useForm } from '../../shared/hooks/form-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_HASSPACE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/Validators';
import { useHttpClient } from '../../shared/hooks/http-hooks';

import './Authentication.css';
import { AuthContext } from '../../shared/context/auth-context';

const Authentication = () => {
  /* Logged in | Logged out context */
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [loginState, loginInputHandler] = useForm(
    {
      email_login: {
        value: '',
        isValid: false,
      },
      password_login: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const [registerState, registerInputHandler] = useForm(
    {
      name_register: {
        value: '',
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
      username_register: {
        value: '',
        isValid: false,
      },
      email_register: {
        value: '',
        isValid: false,
      },
      password_register: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const [registerActive, setRegisterActive] = useState(false);
  const handleSwitchRegister = () => {
    setRegisterActive(true);
  };
  const handleSwitchLogin = () => {
    setRegisterActive(false);
  };

  /* Register handler */
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    console.log(registerState.inputs);
    try {
      const formData = new FormData();
      formData.append(
        'name_register',
        registerState.inputs.name_register.value
      );
      formData.append(
        'username_register',
        registerState.inputs.username_register.value
      );
      formData.append(
        'email_register',
        registerState.inputs.email_register.value
      );
      formData.append(
        'password_register',
        registerState.inputs.password_register.value
      );
      formData.append('image', registerState.inputs.image.value);

      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/users/signup',
        'POST',
        formData
      );

      auth.login(responseData.userId, responseData.token);
    } catch (error) {}
  };

  /* Login handler */
  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/users/login',
        'POST',
        JSON.stringify({
          email_login: loginState.inputs.email_login.value,
          password_login: loginState.inputs.password_login.value,
        }),
        {
          'Content-Type': 'application/json',
        }
      );

      auth.login(responseData.userId, responseData.token);
    } catch (error) {}
  };

  if (registerActive) {
    return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        <div className="register-form">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="title-form">
            <span>Need an acount?</span>
            <span>Register now</span>
          </div>
          <form onSubmit={handleRegisterSubmit}>
            <Input
              id="name_register"
              element="input"
              type="text"
              label="Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Name cannot be empty."
              initialValue={registerState.inputs.name_register.value}
              initialValid={registerState.inputs.name_register.isValid}
              onInput={registerInputHandler}
            />
            <ImageUpload
              id="image"
              center
              onInput={registerInputHandler}
              errorText="Please provide an image."
            />
            <Input
              id="username_register"
              element="input"
              type="text"
              label="Username"
              validators={[VALIDATOR_HASSPACE()]}
              errorText="No spaces are permitted."
              initialValue={registerState.inputs.username_register.value}
              initialValid={registerState.inputs.username_register.isValid}
              onInput={registerInputHandler}
            />
            <Input
              id="email_register"
              element="input"
              type="text"
              label="E-mail"
              validators={[VALIDATOR_EMAIL()]}
              errorText="The e-mail inserted is not supported."
              initialValue={registerState.inputs.email_register.value}
              initialValid={registerState.inputs.email_register.isValid}
              onInput={registerInputHandler}
              enableAtList={true}
            />
            <Input
              id="password_register"
              element="input"
              type="password"
              label="Password"
              validators={[VALIDATOR_MINLENGTH(8)]}
              errorText="Password does not meet mininum required. (8 characters)"
              initialValue={registerState.inputs.password_register.value}
              initialValid={registerState.inputs.password_register.isValid}
              onInput={registerInputHandler}
            />
            <Button type="submit" disabled={!registerState.isValid}>
              REGISTER
            </Button>
            <hr></hr>
            <Button type="submit" onClick={handleSwitchLogin}>
              ALREADY HAVE ACCOUNT?
            </Button>
          </form>
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />

        <div className="login-form">
          <div className="title-form">
            <span>Already a member?</span>
            <span>Login</span>
          </div>
          <form onSubmit={handleLoginSubmit}>
            <Input
              id="email_login"
              element="input"
              type="text"
              label="Email"
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email."
              initialValue={loginState.inputs.email_login.value}
              initialValid={loginState.inputs.email_login.isValid}
              onInput={loginInputHandler}
              enableAtList={true}
            />
            <Input
              id="password_login"
              element="input"
              type="password"
              label="Password"
              validators={[VALIDATOR_MINLENGTH(8)]}
              errorText="Please enter a valid password (at least 8 characters)."
              onInput={loginInputHandler}
              initialValue={loginState.inputs.password_login.value}
              initialValid={loginState.inputs.password_login.isValid}
            />
            <Button type="submit" disabled={!loginState.isValid}>
              LOGIN
            </Button>
            <hr></hr>
            <Button
              id="registerSwitch"
              type="submit"
              onClick={handleSwitchRegister}
            >
              NEED AN ACCOUNT?
            </Button>
          </form>
        </div>
      </React.Fragment>
    );
  }
};

export default Authentication;
