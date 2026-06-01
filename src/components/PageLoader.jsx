import { DotmHex9 } from "./ui/dotm-hex-9";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[99999] bg-[#000000] flex flex-col items-center justify-center">
      
      {/* Container của ma trận */}
      <DotmHex9
        size={80} // Tăng lên 80
        dotSize={8} // Tăng lên 8 cho rõ
        speed={1.2}
        bloom={true}
        opacityBase={0.1}
        opacityMid={0.5}
        opacityPeak={1}
        colorPreset="grad-aurora" 
      />
      
      {/* Dòng text trạng thái */}
      <p className="mt-10 text-teal-400 font-mono text-xs tracking-[0.5em] uppercase animate-pulse">
        Establishing Secure Connection...
      </p>
      
    </div>
  );
}