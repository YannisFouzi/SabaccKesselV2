import React from "react";

const DiceFace = ({ value }) => {
  const dotPositions = {
    1: ["center"],
    2: ["top-right", "bottom-left"],
    3: ["top-right", "center", "bottom-left"],
    4: ["top-left", "top-right", "bottom-left", "bottom-right"],
    5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
    6: [
      "top-left",
      "top-right",
      "middle-left",
      "middle-right",
      "bottom-left",
      "bottom-right",
    ],
  };

  const getPositionClass = (position) => {
    switch (position) {
      case "center":
        return "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
      case "top-left":
        return "absolute top-2 left-2";
      case "top-right":
        return "absolute top-2 right-2";
      case "middle-left":
        return "absolute top-1/2 left-2 -translate-y-1/2";
      case "middle-right":
        return "absolute top-1/2 right-2 -translate-y-1/2";
      case "bottom-left":
        return "absolute bottom-2 left-2";
      case "bottom-right":
        return "absolute bottom-2 right-2";
      default:
        return "";
    }
  };

  return (
    <div className="relative w-full h-full">
      {dotPositions[value]?.map((position, index) => (
        <div
          key={index}
          className={`w-2.5 h-2.5 rounded-full bg-current ${getPositionClass(
            position
          )}`}
        />
      ))}
    </div>
  );
};

export default DiceFace;
