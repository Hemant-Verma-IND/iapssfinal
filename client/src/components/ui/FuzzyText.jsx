import React, { useRef, useEffect, useState } from "react";

const FuzzyText = ({
  children,
  baseIntensity = 0.2,
  hoverIntensity = 0.5,
  enableHover = true,
  fontSize = "clamp(6rem, 15vw, 10rem)",
  fontWeight = 900,
  fontFamily = "inherit",
  color = "#fff",
}) => {
  const id = useRef(`fuzzy-${Math.random().toString(36).slice(2, 9)}`).current;
  const turbulenceRef = useRef(null);
  const displacementRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const requestRef = useRef();

  useEffect(() => {
    // Animation Loop
    const animate = () => {
      // 1. Randomize the "Seed" creates the static movement
      if (turbulenceRef.current) {
        // baseFrequency="0.8" creates tight static noise.
        // We modify seed to make it 'dance'.
        turbulenceRef.current.setAttribute(
          "seed",
          Math.round(Math.random() * 1000)
        );
      }

      // 2. Control Intensity (Lerp for smooth transition or direct swap)
      // "scale" determines how far pixels are pushed apart.
      if (displacementRef.current) {
        const targetScale =
          isHovered && enableHover ? hoverIntensity * 50 : baseIntensity * 50;

        // Read current scale, smooth it towards target
        let currentScale = parseFloat(
          displacementRef.current.getAttribute("scale") || 0
        );
        const lerpFactor = 0.1; // Smoothness speed
        currentScale += (targetScale - currentScale) * lerpFactor;

        displacementRef.current.setAttribute("scale", currentScale);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isHovered, baseIntensity, hoverIntensity, enableHover]);

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. The Visible Text */}
      <h1
        style={{
          fontFamily,
          fontSize,
          fontWeight,
          color,
          margin: 0,
          lineHeight: 1,
          position: "relative",
          zIndex: 2,
          // APPLY THE FILTER HERE
          filter: `url(#${id})`,
        }}
      >
        {children}
      </h1>

      {/* 2. The Invisible SVG Filter Definition */}
      <svg style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}>
        <defs>
          <filter id={id}>
            {/* Creates the static noise texture */}
            {/* baseFrequency X Y: High X creates horizontal lines, High Y creates dots */}
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="3.5 0.05"
              numOctaves="1"
              result="noise"
            />

            {/* Uses the noise to displace the text pixels */}
            <feDisplacementMap
              ref={displacementRef}
              in="SourceGraphic"
              in2="noise"
              scale={baseIntensity * 50}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default FuzzyText;
