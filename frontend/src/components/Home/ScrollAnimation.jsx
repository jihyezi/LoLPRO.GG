import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import styles from "../../pages/Home.module.css";

const ScrollAnimation = ({ title, description, button }) => {
  return (
    <div>
      <AnimatedDiv title={title} description={description} button={button} />
    </div>
  );
};

const AnimatedDiv = ({ title, description, button }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
    rootMargin: "0px 0px -50px 0px",
  });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      ref={ref}
      className={styles.wrapper2}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <motion.span
        className={styles.title}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={variants}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {title}
      </motion.span>

      <motion.div
        className={styles.contentBox}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={variants}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <span
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </motion.div>

      <motion.div
        // className={styles.ctaButton}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={variants}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      >
        <Link
          to={
            button === "일정 확인하기"
              ? "/match"
              : button === "순위 보러가기"
              ? "/ranking"
              : ""
          }
          className={styles.ctaButton}
          style={{ textDecoration: "none" }}
          target="_blank"
        >
          {button}
        </Link>
      </motion.div>
    </div>
  );
};

export default ScrollAnimation;
