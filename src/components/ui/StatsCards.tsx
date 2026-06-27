import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, ShieldCheck, CreditCard } from 'lucide-react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

function AnimatedCounter({ value, duration = 1.5 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const totalMiliseconds = duration * 1000;
    
    // Calculate suitable steps for incrementing
    const stepsCount = 50; 
    const stepValue = Math.max(1, Math.ceil(end / stepsCount));
    const incrementTime = Math.max(15, Math.floor(totalMiliseconds / stepsCount));

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString('ro-RO')}</span>;
}

export default function StatsCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as any } }
  };

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto"
    >
      {/* Card 1: Absolvenți */}
      <motion.div
        variants={cardVariants}
        whileHover={{ 
          y: -6, 
          boxShadow: "0 20px 40px rgba(204, 0, 0, 0.08)", 
          borderColor: "rgba(204, 0, 0, 0.3)",
          backgroundColor: "rgba(255, 255, 255, 0.04)"
        }}
        transition={{ duration: 0.3 }}
        className="bg-white/[0.02] backdrop-blur-md border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-[24px] p-6 flex flex-col items-start transition-all"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-950/20 border border-red-500/20 text-[#cc0000] flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(204,0,0,0.1)]">
          <Users size={22} />
        </div>
        <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white flex items-baseline gap-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Peste <AnimatedCounter value={2000} />
        </h3>
        <p className="text-xs font-bold tracking-[0.18em] text-slate-400 uppercase mt-3" style={{ fontFamily: "'Inter', sans-serif" }}>
          Absolvenți au reușit!
        </p>
      </motion.div>

      {/* Card 2: Garanție */}
      <motion.div
        variants={cardVariants}
        whileHover={{ 
          y: -6, 
          boxShadow: "0 20px 40px rgba(204, 0, 0, 0.08)", 
          borderColor: "rgba(204, 0, 0, 0.3)",
          backgroundColor: "rgba(255, 255, 255, 0.04)"
        }}
        transition={{ duration: 0.3 }}
        className="bg-white/[0.02] backdrop-blur-md border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-[24px] p-6 flex flex-col items-start transition-all"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-950/20 border border-red-500/20 text-[#cc0000] flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(204,0,0,0.1)]">
          <ShieldCheck size={22} />
        </div>
        <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white flex items-baseline gap-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <AnimatedCounter value={14} /> Zile
        </h3>
        <p className="text-xs font-bold tracking-[0.18em] text-slate-400 uppercase mt-3" style={{ fontFamily: "'Inter', sans-serif" }}>
          Garanție Banii Înapoi
        </p>
      </motion.div>

      {/* Card 3: Plată în rate */}
      <motion.div
        variants={cardVariants}
        whileHover={{ 
          y: -6, 
          boxShadow: "0 20px 40px rgba(204, 0, 0, 0.08)", 
          borderColor: "rgba(204, 0, 0, 0.3)",
          backgroundColor: "rgba(255, 255, 255, 0.04)"
        }}
        transition={{ duration: 0.3 }}
        className="bg-white/[0.02] backdrop-blur-md border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-[24px] p-6 flex flex-col items-start transition-all col-span-1 sm:col-span-2 md:col-span-1"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-950/20 border border-red-500/20 text-[#cc0000] flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(204,0,0,0.1)]">
          <CreditCard size={22} />
        </div>
        <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Plată în Rate
        </h3>
        <p className="text-xs font-bold tracking-[0.18em] text-slate-400 uppercase mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
          Rate Egale Fără Dobândă
        </p>
      </motion.div>
    </motion.div>
  );
}
