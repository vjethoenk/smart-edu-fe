"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import BookIcon from "@/public/icons/book.svg";
import CapIcon from "@/public/icons/mu.svg";
import Image from "next/image";

interface SplashScreenProps {
  finishLoading: () => void;
}

// 1. Hàm tạo dữ liệu hạt tuyết ngẫu nhiên để không bị trùng lặp khi re-render
const generateParticles = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    size: Math.random() * 6 + 2, // Làm hạt nhỏ lại một chút cho tinh tế
    left: Math.random() * 100, // Phủ toàn bộ chiều ngang 0-100%
    // ⬇️ GIẢM THỜI GIAN: Bay nhanh hơn (từ 3s đến 7s thay vì 10s-18s)
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 5,
    initialY: 110, // Bắt đầu ngay dưới mép màn hình
  }));
};

export default function SmartEduSplashScreen({
  finishLoading,
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(generateParticles(30));
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(finishLoading, 500);
    }, 5000);
    return () => clearTimeout(timer);
  }, [finishLoading]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#3525cd] via-[#4f46e5] to-[#1a116b]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:40px_40px] opacity-30"></div>

          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                y: "110vh",
                x: `${particle.left}vw`,
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                y: "-20vh",
                opacity: [0, 0.4, 0],
                scale: [0.5, 1.2, 0.8],
                x: [
                  `${particle.left}vw`,
                  `${particle.left + (Math.random() * 4 - 2)}vw`,
                  `${particle.left}vw`,
                ],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "linear",
              }}
              className="absolute bg-white rounded-full blur-[2px] pointer-events-none"
              style={{
                width: particle.size,
                height: particle.size,
                left: 0,
                top: 0,
                willChange: "transform, opacity",
              }}
            />
          ))}

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-12 relative group">
              <div className="absolute -inset-8 bg-[#6bff8f]/20 blur-3xl rounded-full opacity-50 transition-opacity duration-1000 group-hover:opacity-100"></div>

              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl"
              >
                <div className="flex flex-col items-center justify-center text-[#6bff8f]">
                  <div className="relative h-[60px] w-[70px] flex items-center justify-center filter drop-shadow-[0_0_8px_rgba(107,255,143,0.5)]">
                    <Image
                      src={BookIcon}
                      alt="Book Icon"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transformOrigin: "center center" }}
                  >
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#006e2f] text-white w-[32px] h-[32px] rounded-full flex items-center justify-center shadow-lg transform rotate-12 border-2 border-[#6bff8f]/50">
                      <div className="relative w-6 h-6">
                        <Image
                          src={CapIcon}
                          alt="Cap Icon"
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <div className="absolute -inset-4 border-2 border-dashed border-white/10 rounded-full animate-[spin_15s_linear_infinite]"></div>
              <div className="absolute -inset-6 border border-white/5 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
            </div>

            <div className="text-center space-y-4">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.3,
                }}
                className="text-5xl md:text-6xl font-black tracking-tighter text-white font-headline"
              >
                Smart-Edu
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 0.8 }}
                className="text-lg md:text-xl font-light tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white/40 via-white to-white/40 bg-[length:200%_auto] animate-[shimmer_5s_linear_infinite]"
              >
                Kiến tạo tương lai của trí tuệ
              </motion.p>
            </div>

            <div className="mt-24 flex flex-col items-center gap-6">
              <div className="w-56 h-[1.5px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ x: "-110%" }}
                  animate={{ x: "210%" }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="h-full bg-[#6bff8f] w-1/3 rounded-full shadow-[0_0_15px_rgba(107,255,143,0.8)]"
                />
              </div>
              <span className="text-xs font-medium tracking-[0.3em] text-white/40 uppercase">
                Đang thiết lập không gian học tập...
              </span>
            </div>
          </div>

          <footer className="fixed bottom-8 w-full text-center z-20">
            <p className="text-[11px] text-white/15 tracking-widest uppercase font-mono">
              © 2026 Nguyễn Thế Việt Hoàng
            </p>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
