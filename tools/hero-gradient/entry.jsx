import React from "react";
import { createRoot } from "react-dom/client";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

// Mounts a slow, soft ShaderGradient behind the homepage hero.
// ShaderGradient "Halo" preset (orange / tan / lavender) with grain. Uses 3D lighting (not 'env')
// so nothing is fetched from the network at runtime.
const mount = document.getElementById("hero-gradient");
if (mount) {
  const small = window.matchMedia("(max-width: 760px)").matches;
  createRoot(mount).render(
    <ShaderGradientCanvas
      style={{ position: "absolute", inset: 0 }}
      pixelDensity={small ? 0.8 : 1}
      fov={45}
      pointerEvents="none"
      lazyLoad={true}
    >
      <ShaderGradient
        control="props"
        type="plane"
        animate="on"
        uTime={0}
        uSpeed={0.4}
        uStrength={4}
        uDensity={1.3}
        uFrequency={5.5}
        uAmplitude={1}
        color1="#ff5005"
        color2="#dbba95"
        color3="#d0bce1"
        lightType="3d"
        brightness={1.2}
        reflection={0.1}
        grain="on"
        cAzimuthAngle={180}
        cPolarAngle={90}
        cDistance={3.6}
        cameraZoom={1}
        positionX={-1.4}
        positionY={0}
        positionZ={0}
        rotationX={0}
        rotationY={10}
        rotationZ={50}
        wireframe={false}
        enableTransition={false}
        enableCameraUpdate={false}
      />
    </ShaderGradientCanvas>
  );
  mount.setAttribute("data-ready", "1");
}
