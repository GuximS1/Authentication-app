import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Complete from "./components/Complete";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Register from "./components/Register";
import Welcome from "./components/Welcome";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Welcome />
    </div>
  );
};

export default Home;
