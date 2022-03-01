import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import classes from "./Card.module.scss";
import { useStore } from "../../database/token";
import SingleUser from "./SingleUser";
type Props = {};

export const USERS = gql`
  query {
    users {
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

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];
function Users({}: Props) {
  const [id, setId] = useState("");
  const { accessToken } = useStore();
  const { loading, error, data, refetch } = useQuery(USERS, {
    context: {
      headers: {
        authorization: "bearer " + accessToken,
      },
    },
  });

  function selectHandler(event: React.ChangeEvent<HTMLSelectElement>) {
    setId(event.target.value);
    console.log(event.target.value);
  }
  if (loading) return <h1>Is loading....</h1>;
  return (
    <div
      className={classes.card}
      style={{ marginTop: "30vh", marginLeft: "27%" }}
    >
      <div className={classes.box}>
        <select onChange={selectHandler} defaultValue="-">
          <option value="-">Select email</option>
          {data.users.map((item: any) => {
            return (
              <option key={Math.random()} value={item.id}>
                {item.email}
              </option>
            );
          })}
        </select>
      </div>
      <div>
        <SingleUser id={id} />
      </div>
    </div>
  );
}

export default Users;
