/* eslint-disable @next/next/no-img-element */
import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useStore } from "../../database/token";
import classes from "./Card.module.scss";

interface prop {
  id: String;
}

const USER = gql`
  query ($id: String!) {
    user(id: $id) {
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

function SingleUser(props: prop) {
  const { accessToken } = useStore();
  const { data } = useQuery(USER, {
    variables: {
      id: props.id,
    },
    context: {
      headers: {
        authorization: "bearer " + accessToken,
      },
    },
  });
  const image =
    data?.user?.profile?.image === ""
      ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGjYKo8PP1bkCLZ-yJ9frIFNHomwkvaRIkT1Sq_95Sfex5wWpsgzAXZi7HYJlTPS8okec&usqp=CAU"
      : data?.user?.profile?.image ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGjYKo8PP1bkCLZ-yJ9frIFNHomwkvaRIkT1Sq_95Sfex5wWpsgzAXZi7HYJlTPS8okec&usqp=CAU";
  console.log(data);
  return (
    <div>
      <p>{data?.user?.email}</p>
      <div className={classes.content}>
        <img src={image} alt="img" />
        <div className={classes.texts}>
          <h1 style={{ margin: "auto" }}>
            {data?.user?.profile?.name === ""
              ? "NO NAME"
              : data?.user?.profile?.name || "NO NAME"}
          </h1>
          <h3 style={{ float: "left", margin: "auto" }}>
            {data?.user?.profile?.gender === ""
              ? "NO GENDER"
              : data?.user?.profile?.gender || "NO GENDER"}
          </h3>
        </div>
      </div>
      <h3 style={{ float: "left", marginLeft: "40px" }}>
        {data?.user?.profile?.country === ""
          ? "NO COUNTRY"
          : data?.user?.profile?.country || "NO COUNTRY"}
      </h3>
      <br />
      <br />
    </div>
  );
}

export default SingleUser;
