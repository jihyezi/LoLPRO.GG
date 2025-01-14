import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
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
        <div ref={ref} className={styles.wrapper2} style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
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
                <span className={styles.description} dangerouslySetInnerHTML={{ __html: description }} />


                <motion.div
                    className={styles.ctaButton}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={variants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ stiffness: 400, damping: 10, duration: 0.5, delay: 0.1, ease: "easeOut" }}
                >
                    {button}
                </motion.div>

            </motion.div>
        </div>
    );
};

export default ScrollAnimation;
