import { useEffect, useState } from "react";

function getWindowDimensions(): { width: number, height: number } {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}
export function useWindowDimensions(): { width: number, height: number } {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    const handleResize = () => setWindowDimensions(getWindowDimensions());

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
