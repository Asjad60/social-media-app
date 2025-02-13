import React, { useState } from "react";

const AnimationLine = () => {
  const [centerpointValue, setCenterpointValue] = useState(100);

  const handleMove = (e) => {
    const maxVal = 200;
    const minVal = 0;
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const clampedY = Math.min(maxVal, Math.max(minVal, relativeY));
    setCenterpointValue(clampedY);
  };

  return (
    <div>
      <div
        onMouseMove={handleMove}
        onMouseLeave={() => setCenterpointValue(100)}
      >
        <svg width="500" height="200">
          <path
            d={`M 10 100 Q 250 ${centerpointValue} 490 100`}
            stroke="black"
            fill="transparent"
            style={
              {
                // transition: "all 0.05s ease",
              }
            }
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default AnimationLine;
