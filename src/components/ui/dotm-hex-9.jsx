import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Định nghĩa cấu trúc lưới lục giác: 5 hàng, số lượng chấm tương ứng
const ROW_COUNTS = [3, 4, 5, 4, 3];
const HEX_ROW_PITCH_RATIO = Math.sqrt(3) / 2; // Tỷ lệ khoảng cách chuẩn của lưới tổ ong

export function DotmHex9({
  dotSize = 6,
  cellPadding = 4, // Khoảng cách ngang (gap)
  speed = 1.4,
  bloom = true,
  opacityBase = 0.15,
  opacityPeak = 0.98,
  colorPreset = "grad-aurora",
}) {
  const [phase, setPhase] = useState(0);

  // Vòng lặp mô phỏng useCyclePhase của bản gốc
  useEffect(() => {
    let animationFrameId;
    let startTime;
    const cycleMsBase = 1650 / speed;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const currentPhase = (elapsed % cycleMsBase) / cycleMsBase;
      setPhase(currentPhase);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [speed]);

  // Thuật toán tính độ mờ ảo quét như radar (copy y nguyên logic toán học bản gốc)
  const calculateOpacity = (row, col) => {
    const count = ROW_COUNTS[row];
    const x = col - (count - 1) / 2;
    const y = (row - 2) * HEX_ROW_PITCH_RATIO;
    const angle = Math.atan2(y, x);
    const radius = Math.sqrt(x * x + y * y);

    if (radius < 0.1) {
      return 0.42 + Math.sin(phase * Math.PI * 2) * 0.2;
    }

    const rotation = phase * Math.PI * 2;
    const PETAL_WIDTH = 0.42;
    
    // Thuật toán tính toán độ sáng theo góc quay và bán kính
    const angularDistance = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
    const petalA = Math.max(0, 1 - angularDistance(angle, rotation) / PETAL_WIDTH);
    const petalB = Math.max(0, 1 - angularDistance(angle, rotation + Math.PI) / PETAL_WIDTH);
    const crossA = Math.max(0, 1 - angularDistance(angle, rotation + Math.PI / 2) / 0.52) * 0.46;
    const crossB = Math.max(0, 1 - angularDistance(angle, rotation + Math.PI * 1.5) / 0.52) * 0.46;
    const ring = (0.5 + 0.5 * Math.sin(phase * Math.PI * 2 - radius * 2.7)) * (radius > 1.3 ? 0.22 : 0.1);
    
    const petalPeak = Math.max(petalA, petalB);

    if (petalPeak > 0.92) return opacityPeak;
    
    const calculatedOpacity = opacityBase + petalPeak * 0.82 + crossA + crossB + ring;
    return Math.min(opacityPeak, Math.max(opacityBase, calculatedOpacity));
  };

  const gap = cellPadding;
  const rowGap = Math.max(1, (dotSize + gap) * HEX_ROW_PITCH_RATIO - dotSize);
  
  const colorKeyframes = colorPreset === "grad-aurora" 
    ? ["#2dd4bf", "#10b981", "#06b6d4", "#2dd4bf"] 
    : ["#2dd4bf"];

  return (
    <div 
      className="flex flex-col items-center justify-center" 
      style={{ gap: `${rowGap}px` }}
    >
      {ROW_COUNTS.map((count, row) => (
        <div 
          key={row} 
          className="flex justify-center"
          style={{ gap: `${gap}px` }}
        >
          {Array.from({ length: count }).map((_, col) => {
            const currentOpacity = calculateOpacity(row, col);
            
            return (
              <motion.div
                key={`${row}-${col}`}
                className="rounded-full"
                style={{
                  width: `${dotSize}px`,
                  height: `${dotSize}px`,
                  opacity: currentOpacity,
                  boxShadow: bloom 
                    ? `0 0 ${dotSize * 1.5}px rgba(45, 212, 191, ${currentOpacity * 0.8})` 
                    : "none"
                }}
                animate={{
                   backgroundColor: colorKeyframes
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}