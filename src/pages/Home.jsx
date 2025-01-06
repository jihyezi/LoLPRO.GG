import React from "react";
import Header from "../components/Home/Header";
import styles from "./Home.module.css"

const Home = () => {
    return (
        <div>
            <Header className={styles.Header} />
        </div>
    )
}

export default Home;