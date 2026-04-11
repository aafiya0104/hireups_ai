"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface RadarData {
  label: string;
  user: number;
  community: number;
}

const data: RadarData[] = [
  { label: "Algorithms", user: 92, community: 65 },
  { label: "System Design", user: 78, community: 50 },
  { label: "Soft Skills", user: 85, community: 70 },
  { label: "Tooling", user: 65, community: 60 },
  { label: "Core CS", user: 88, community: 55 },
];

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

export default function SkillRadarChart() {
  const size = 250;
  const center = size / 2;
  const radius = center - 40; // leave room for labels
  const levels = 4;
  const angleStep = 360 / data.length;

  // Generate web background
  const gridPolygons = useMemo(() => {
    let grids = [];
    for (let level = 1; level <= levels; level++) {
      const r = (radius / levels) * level;
      let points = "";
      for (let i = 0; i < data.length; i++) {
        const { x, y } = polarToCartesian(center, center, r, i * angleStep);
        points += `${x},${y} `;
      }
      grids.push(points.trim());
    }
    return grids;
  }, [center, radius, angleStep]);

  // Generate axes lines
  const axes = useMemo(() => {
    let axesLines = [];
    for (let i = 0; i < data.length; i++) {
      const { x, y } = polarToCartesian(center, center, radius, i * angleStep);
      axesLines.push({ x1: center, y1: center, x2: x, y2: y });
    }
    return axesLines;
  }, [center, radius, angleStep]);

  // Generate data polygon
  const userPolygon = useMemo(() => {
    let points = "";
    for (let i = 0; i < data.length; i++) {
      const r = (data[i].user / 100) * radius;
      const { x, y } = polarToCartesian(center, center, r, i * angleStep);
      points += `${x},${y} `;
    }
    return points.trim();
  }, [center, radius, angleStep]);

  const communityPolygon = useMemo(() => {
    let points = "";
    for (let i = 0; i < data.length; i++) {
      const r = (data[i].community / 100) * radius;
      const { x, y } = polarToCartesian(center, center, r, i * angleStep);
      points += `${x},${y} `;
    }
    return points.trim();
  }, [center, radius, angleStep]);

  // Generate label positions
  const labels = useMemo(() => {
    let labelsPos = [];
    for (let i = 0; i < data.length; i++) {
      // push labels out further
      const { x, y } = polarToCartesian(center, center, radius + 25, i * angleStep);
      labelsPos.push({ x, y, label: data[i].label, user: data[i].user, community: data[i].community });
    }
    return labelsPos;
  }, [center, radius, angleStep]);

  return (
    <div 
      onClick={() => toast.success("Opening detailed skill analysis visualization...")}
      className="h-full flex flex-col items-center justify-center relative cursor-pointer group hover:scale-[1.02] transition-transform"
    >
      <h3 className="w-full text-left text-sm text-gray-400 font-sans mb-1 absolute top-0 left-0">Skill Hexagon Tracker</h3>
      <div className="absolute top-0 right-0 flex flex-col gap-1 text-[10px] items-end font-sans">
         <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#b9f0d7] shadow-[0_0_5px_#b9f0d7]"></span> <span className="text-white">You</span></div>
         <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#6666ff]"></span> <span className="text-gray-400">Avg Peer</span></div>
      </div>
      
      <div className="relative mt-8" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background Web */}
          {gridPolygons.map((points, idx) => (
            <polygon
              key={idx}
              points={points}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}

          {/* Axes */}
          {axes.map((line, idx) => (
            <line
              key={idx}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          ))}

          {/* Community Data Polygon */}
          <motion.polygon
            points={communityPolygon}
            fill="rgba(102, 102, 255, 0.15)"
            stroke="#6666ff"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ scale: 0, opacity: 0, transformOrigin: `${center}px ${center}px` }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, type: "spring", bounce: 0.3, delay: 0.2 }}
          />

          {/* User Data Polygon */}
          <motion.polygon
            points={userPolygon}
            fill="rgba(185, 240, 215, 0.25)"
            stroke="#b9f0d7"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0, transformOrigin: `${center}px ${center}px` }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          />
          
          {/* Glowing Shadow for User Node edges */}
          <motion.polygon
            points={userPolygon}
            fill="transparent"
            stroke="#b9f0d7"
            strokeWidth="8"
            className="blur-md opacity-40"
            initial={{ scale: 0, opacity: 0, transformOrigin: `${center}px ${center}px` }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          />

          {/* Points on the axes for User */}
          {labels.map((item, idx) => {
             const r = (item.user / 100) * radius;
             const { x, y } = polarToCartesian(center, center, r, idx * angleStep);
             return (
              <motion.circle 
                key={`user-${idx}`} 
                cx={x} cy={y} r={4} 
                fill="#b9f0d7"
                initial={{ r: 0 }}
                animate={{ r: 4 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
              />
             )
          })}
          
          {/* Points on the axes for Community */}
          {labels.map((item, idx) => {
             const r = (item.community / 100) * radius;
             const { x, y } = polarToCartesian(center, center, r, idx * angleStep);
             return (
              <motion.circle 
                key={`com-${idx}`} 
                cx={x} cy={y} r={3} 
                fill="#6666ff"
                initial={{ r: 0 }}
                animate={{ r: 3 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
              />
             )
          })}

          {/* Labels */}
          {labels.map((item, idx) => (
             <g key={`lbl-${idx}`}>
                <text
                  x={item.x}
                  y={item.y}
                  fill="#9ca3af"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="font-sans"
                >
                  {item.label}
                </text>
             </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
