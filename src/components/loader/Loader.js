import React from "react";
import styles from "./loader.module.css";

function Loader() {
  return (
    <div className={`${styles.loader} loader`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default Loader;
