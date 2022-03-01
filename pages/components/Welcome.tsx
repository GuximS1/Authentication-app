import React from "react";
import classes from "./Card.module.scss";
import { useRouter } from "next/router";
import { useStore } from "../../database/token";
type Props = {};

function Welcome({}: Props) {
  const router = useRouter();
  const { accessToken } = useStore();
  function registerHandler() {
    console.log("You want to register!");
    router.push("components/Register");
  }

  function loginHandler() {
    console.log("You want to login!");
    router.push("components/Login");
  }
  if (accessToken !== "") router.push("components/Profile");
  return (
    <div className={classes.profile} style={{ marginLeft: "0%" }}>
      <h1>Welcome</h1>
      <br />
      <form className={classes.welcome_form}>
        <input
          type="button"
          onClick={registerHandler}
          value="Register"
          className={classes.button1}
        />
        <input
          type="button"
          onClick={loginHandler}
          value="Login"
          className={classes.button2}
        />
      </form>
    </div>
  );
}

export default Welcome;
