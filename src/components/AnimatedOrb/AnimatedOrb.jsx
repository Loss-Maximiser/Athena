import { motion } from "framer-motion";
import "./AnimatedOrb.css";

export default function AnimatedOrb() {
  return (
    <div className="athenaOrb">

      <div className="purpleGlow" />

      <motion.img
        src="/assets/athena.svg"
        alt="Athena Orb"
        className="orbSVG"
        animate={{
    rotate:[-4,4,-4],
    y:[-5,5,-5],
    scale:[1,1.03,1]
}}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

    </div>
  );
}