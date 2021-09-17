import React, {
  useState,
  useReducer,
  useEffect,
  useContext,
  useRef,
} from "react";
import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import { AuthContext } from "../../context/auth-context";
import Input from "../Input/Input";

const Login = () => {
  const { onLogin } = useContext(AuthContext);
  const emailRef = useRef();
  const passwordRef = useRef();
  const emailReducer = (state, action) => {
    if (action.type === "USER_INPUT") {
      return { value: action.val, isValid: action.val.includes("@") };
    }
    if (action.type === "INPUT_BLUR") {
      return { value: state.value, isValid: state.value.includes("@") };
    }
    return { value: "", isValid: false };
  };

  const passwordReducer = (state, action) => {
    if (action.type === "USER_INPUT") {
      return { value: action.val, isValid: action.val.trim().length > 6 };
    }
    if (action.type === "INPUT_BLUR") {
      return { value: state.value, isValid: state.value.trim().length > 6 };
    }
    return {
      value: "",
      isValid: false,
    };
  };
  const [formIsValid, setFormIsValid] = useState(false);
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const { isValid: validEmail } = emailState;
  const { isValid: validPassword } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("Form Validity Execute!");
      setFormIsValid(validEmail && validPassword);
    }, 500);
    return () => {
      clearTimeout(identifier);
      console.log("Cleanup");
    };
  }, [validEmail, validPassword]);

  const emailChangeHandler = (event) => {
    const { value } = event.target;
    dispatchEmail({ type: "USER_INPUT", val: value });
  };

  const passwordChangeHandler = (event) => {
    const { value } = event.target;
    dispatchPassword({ type: "USER_INPUT", val: value });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      onLogin(emailState.value, passwordState.value);
    } else if (!validEmail) {
      emailRef.current.focus();
    } else {
      passwordRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailRef}
          isValid={validEmail}
          label="E-mail"
          id="email"
          type="email"
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
          value={emailState.value}
        />
        <Input
          ref={passwordRef}
          isValid={validPassword}
          label="Password"
          id="password"
          type="password"
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
          value={passwordState.value}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
