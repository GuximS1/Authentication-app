/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import classes from "./Card.module.scss";
import { useStore } from "../../database/token";
import { useRouter } from "next/router";
import { gql, useMutation, useQuery } from "@apollo/client";
type Props = {};

export const ME = gql`
  query Me {
    me {
      id
      email
      profile {
        id
        name
        gender
        country
        image
      }
    }
  }
`;
const LOGOUT = gql`
  mutation {
    logout
  }
`;
function Profile({}: Props) {
  const router = useRouter();
  const [LOGOUT_ACCESS] = useMutation(LOGOUT);
  const { accessToken, setAccessToken } = useStore();
  const { loading, error, data, refetch } = useQuery(ME, {
    context: {
      headers: {
        authorization: "bearer " + accessToken,
      },
    },
  });
  useEffect(() => {
    refetch();
  }, []);
  console.log(data);

  function logOutHandler() {
    LOGOUT_ACCESS({
      context: {
        headers: {
          authorization: "bearer " + accessToken,
        },
      },
    });
    setAccessToken("");
    router.push("/");
  }
  function allUsersHandler() {
    router.push("./Users");
  }

  if (accessToken === "")
    return (
      <div style={{ textAlign: "center", marginTop: "20vh" }}>
        <h1>You have no authorization. Please log in!</h1>
        <button
          className={classes.button}
          style={{ width: "200px" }}
          onClick={() => {
            router.push("Login");
          }}
        >
          Login
        </button>
      </div>
    );
  else if (data?.me?.profile?.name === "") {
    router.push("/components/Complete");
  } else {
    return (
      <div className={classes.profile}>
        <div className={classes.content}>
          <img src={data?.me?.profile?.image} alt="img" />
          <div className={classes.texts}>
            <h1 style={{ margin: "auto" }}>{data?.me?.profile?.name}</h1>
            <h3 style={{ float: "left", margin: "auto" }}>
              {data?.me?.profile?.gender}
            </h3>
          </div>
        </div>
        <h3 style={{ float: "left", marginLeft: "40px" }}>
          {data?.me?.profile?.country}
        </h3>
        <input
          type="button"
          onClick={logOutHandler}
          value="Logout"
          className={classes.button}
          style={{ width: "90%", fontWeight: "bold" }}
        />
        <br />
        <br />
        <input
          type="button"
          onClick={allUsersHandler}
          value="Users"
          className={classes.usersButton}
          style={{ width: "50%", fontWeight: "bold" }}
        />
      </div>
    );
  }
  return <div></div>;
}

export default Profile;
