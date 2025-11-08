// src/pages/AboutPage.jsx
import React from "react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-gray-100 to-blue-50 text-gray-900 min-h-screen py-20 px-6 flex flex-col items-center">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/40 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200/30 blur-3xl rounded-full"></div>

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-5xl w-full bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200 p-10 md:p-16"
      >
        {/* Title */}
        <motion.h1
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-blue-700"
        >
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Hackathon 2026</span>
        </motion.h1>

        {/* Section 1: Introduction */}
        <motion.section
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            1. Introduction
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The National Institute of Technology, Silchar, established in 1967 as a Regional Engineering College,
            is one of India’s premier technical institutions. Upgraded to National Institute of Technology in 2002
            and declared an Institute of National Importance under the NIT Act of 2007, NIT Silchar stands out
            for its excellence in education, research, and innovation.
          </p>
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            Recognitions and Highlights of NIT Silchar:
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>
              Consistently ranked among top Indian institutes, with an NIRF Engineering Ranking of 40 and
              an Overall Category Ranking of 92 (2024).
            </li>
            <li>
              Internationally recognized — QS Asia University Ranking: 541 (2025), and Green Metric Global Ranking: 205th (2022).
            </li>
            <li>
              Hub for advanced research in emerging technologies.
            </li>
            <li>
              Active collaborations with national and international organizations.
            </li>
            <li>
              Rich legacy of producing technocrats and researchers contributing to industry and academia.
            </li>
          </ul>
        </motion.section>

        {/* Section 2: Objective */}
        <motion.section
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            2. Objective of the Event: Hackathon 2026
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The Hackathon aims to provide a national platform for students, researchers, and tech enthusiasts
            to showcase their coding and problem-solving skills. Participants will tackle real-world challenges
            using Artificial Intelligence (AI), Machine Learning (ML), and emerging technologies.
          </p>
        </motion.section>

        {/* Section 3: Key Goals */}
        <motion.section
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Key Goals:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Encourage innovation in AI/ML-driven solutions.</li>
            <li>Foster collaborative problem-solving among students and professionals.</li>
            <li>Identify and nurture creative thinkers in the tech community.</li>
            <li>Provide exposure to real-life problem-solving environments.</li>
          </ul>
        </motion.section>

        {/* Section 4: About NIT Silchar */}
        <motion.section
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About NIT Silchar</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            NIT Silchar is one of the 31 National Institutes of Technology in India.
            Known for its strong academic foundation, it continues to lead the way in research, innovation,
            and technology in Northeast India.
          </p>
          <a
            href="https://www.google.com/maps/place/National+Institute+of+Technology+Silchar/@24.7555,92.7977,17z"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300"
          >
            📍 View on Google Maps
          </a>
        </motion.section>
      </motion.div>
    </div>
  );
}
