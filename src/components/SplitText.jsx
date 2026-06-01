import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const SplitText = ({
  text = '',
  className = '',
  delay = 50, // Thời gian trễ giữa các chữ cái (ms)
  duration = 0.8,
  from = { opacity: 0, y: 15 },
  to = { opacity: 1, y: 0 },
  tag = 'h1'
}) => {
  const ref = useRef(null);
  
  // Kích hoạt hiệu ứng 1 lần khi cuộn tới
  const isInView = useInView(ref, { once: true, margin: "0px" });
  
  // Linh hoạt chuyển đổi thẻ HTML (h1, p, div...) thành thẻ của motion
  const MotionTag = motion[tag] || motion.p;

  return (
    <MotionTag ref={ref} className={className}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={from}
          animate={isInView ? to : from}
          transition={{
            duration: duration,
            delay: index * (delay / 1000), // Framer motion dùng giây (s)
            ease: [0.215, 0.61, 0.355, 1] // Custom ease out mượt như power3 của GSAP
          }}
          style={{ 
            display: 'inline-block', 
            // Giữ lại khoảng trắng (space) giữa các từ
            whiteSpace: char === ' ' ? 'pre' : 'normal',
            willChange: 'transform, opacity'
          }}
        >
          {char}
        </motion.span>
      ))}
    </MotionTag>
  );
};

export default SplitText;