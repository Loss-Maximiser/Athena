import React from "react";
import "./RotatingWreath.css";
import wreathImg from "../../assets/wreath-image.svg";

const RotatingWreath = () => {
  return (
    <img
      src={wreathImg}
      alt="Athena Wreath"
      className="animated-wreath"
    />
  );
};

export default RotatingWreath;