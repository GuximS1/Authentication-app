import React, { useState } from "react";
import classes from "./Card.module.scss";
import { useForm, SubmitHandler } from "react-hook-form";
import router from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useStore } from "../../database/token";
type Props = {};
import { gql, useMutation } from "@apollo/client";
interface FormValues {
  email: string;
  password: string;
  confirmpassword: string;
}
const REGISTER = gql`
  mutation Register($email: String!, $password: String!) {
    register(data: { email: $email, password: $password }) {
      accessToken
      refreshToken
    }
  }
`;
const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    confirmpassword: yup
      .string()
      .min(6)
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  })
  .required();

function Register({}: Props) {
  const { accessToken, setAccessToken } = useStore();
  const [REGISTER_ACCESS] = useMutation(REGISTER);

  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const response = await REGISTER_ACCESS({
      variables: {
        email: data.email,
        password: data.password,
      },
    });
    router.push("./Complete");
    setAccessToken(response.data.register.accessToken);
  };

  return (
    <div className={classes.register}>
      <h1>Register</h1>
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
          {...register("password", {
            required: true,
          })}
          placeholder="Password"
          className={classes.textarea}
        />
        {<p style={{ color: "red" }}>{errors.password?.message}</p>}

        <input
          type="password"
          {...register("confirmpassword", {
            required: true,
          })}
          placeholder="Password Confirmation"
          className={classes.textarea}
        />
        {<p style={{ color: "red" }}>{errors.confirmpassword?.message}</p>}

        {passwordConfirmation !== "" && (
          <h1 style={{ color: "red" }}>{passwordConfirmation}</h1>
        )}
        <input type="submit" value="Register" className={classes.button} />
      </form>
    </div>
  );
}

export default Register;
