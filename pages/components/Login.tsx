import React from "react";
import classes from "./Card.module.scss";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { useStore } from "../../database/token";
import { gql, useMutation } from "@apollo/client";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(data: { email: $email, password: $password }) {
      accessToken
      refreshToken
    }
  }
`;

import * as yup from "yup";
import swal from "sweetalert";

type Props = {};

interface FormValues {
  email: string;
  password: string;
}
const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  })
  .required();

function Login({}: Props) {
  const [LOGIN_ACCESS] = useMutation(LOGIN);
  const { setAccessToken } = useStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
    const response = await LOGIN_ACCESS({
      variables: {
        email: data.email,
        password: data.password,
      },
      onCompleted: (data) => {
        setAccessToken(data.login.accessToken);
        swal("Log in successfuly!");
      },
      onError: () => {
        swal("Wrong credentials!");
      },
    });

    // console.log(response.data.login.accessToken);
    if (data) router.push("./Profile");
  };
  return (
    <div className={classes.login}>
      <h1>Login</h1>
      <br />
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <input
          {...register("email", { required: true })}
          placeholder="E-mail"
          className={classes.textarea}
        />
        {<p style={{ color: "red" }}>{errors.email?.message}</p>}

        <input
          type="password"
          {...register("password", { required: true })}
          placeholder="Password"
          className={classes.textarea}
        />
        {<p style={{ color: "red" }}>{errors.password?.message}</p>}
        <br />

        <input type="submit" value="Login" className={classes.button} />
      </form>
    </div>
  );
}

export default Login;
