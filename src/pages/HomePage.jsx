// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-gray-100 to-blue-50 text-gray-900 min-h-screen flex flex-col items-center justify-center">
      {/* Soft glowing background circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/40 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200/30 blur-3xl rounded-full"></div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-start text-left w-full max-w-6xl px-6 py-20">
        {/* Background glow elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/40 blur-3xl rounded-full -z-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200/30 blur-3xl rounded-full -z-10"></div>
        <div className="absolute top-1/2 right-[-150px] w-80 h-80 bg-blue-300/25 blur-3xl rounded-full -z-10"></div>

        {/* Main heading */}
        <motion.h1
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-4"
        >
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
            Hackathon 2026
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl text-gray-700 mb-8 max-w-2xl"
        >
          The national-level coding competition hosted by{" "}
          <span className="text-blue-600 font-semibold">NIT Silchar</span>. Join
          us for three rounds of intense coding challenges and innovation!
        </motion.p>

        {/* Buttons */}
        {!isAuthenticated && (
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-start gap-4"
          >
            <Link to="/register">
              <Button
                variant="primary"
                className="text-lg px-8 py-3 flex items-center gap-2 hover:scale-105 transition-transform bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              >
                Register Your Team
                <ArrowRight
                  size={20}
                  className="ml-2 group-hover:translate-x-1 transition-transform duration-200"
                />
              </Button>
            </Link>
            <Link to="/login?type=team">
              <Button
                variant="outline"
                className="text-lg px-8 py-3 hover:scale-105 transition-transform border border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                Team Login
              </Button>
            </Link>
          </motion.div>
        )}

        {/* NIT Silchar link (Updated) */}
        <a
          href="https://www.nits.ac.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 text-blue-600 hover:text-teal-600 underline text-lg transition"
        >
          Know more about NIT Silchar
        </a>
      </section>

      {/* ================= Event Info Section ================= */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative z-10 mt-4 w-full text-center px-6"
      >
        <p className="text-lg font-medium text-gray-700">
          Event: <span className="text-blue-600">Jan - Feb 2026</span> |
          Registration Deadline:{" "}
          <span className="text-blue-600">30th Dec 2025</span>
        </p>
      </motion.section>

      {/* ================= Competition Structure (ADDED id="rounds") ================= */}
      <motion.section
        id="rounds" 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative z-10 mt-10 w-full max-w-6xl px-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900">
          Competition Structure
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Round 1 (Online)",
              date: "January 2026 (Second Week)",
              desc: "Screening round with MCQs, aptitude, and basic coding questions.",
              color:
                "from-blue-50 to-blue-100 border-blue-300 hover:shadow-blue-300/60",
            },
            {
              title: "Round 2 (Online)",
              date: "February 2026 (First Week)",
              desc: "Problem statements based on coding and AI/ML application.",
              color:
                "from-teal-50 to-teal-100 border-teal-300 hover:shadow-teal-300/60",
            },
            {
              title: "Round 3 (Offline at NIT Silchar)",
              date: "February 2026 (Last Week)",
              desc: "Final hackathon challenge with real-time problem-solving.",
              color:
                "from-indigo-50 to-indigo-100 border-indigo-300 hover:shadow-indigo-300/60",
            },
          ].map((round, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`bg-gradient-to-br ${round.color} border rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300`}
            >
              <h3 className="text-xl font-bold text-blue-700 mb-2">
                {round.title}
              </h3>
              <p className="font-semibold text-gray-800 mb-2">{round.date}</p>
              <p className="text-gray-600">{round.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= Prizes and Recognition (ADDED id="prizes") ================= */}
      <motion.section
        id="prizes"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative z-10 mt-16 w-full max-w-5xl px-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-yellow-500 to-orange-500 text-transparent bg-clip-text">
          Prizes and Recognition
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-400 text-center shadow-md hover:shadow-yellow-300/70 transition-all"
          >
            <h3 className="text-2xl font-bold text-yellow-600">1st Prize</h3>
            <p className="text-3xl font-extrabold mt-2 text-gray-800">
              ₹50,000
            </p>
            <p className="text-gray-600 mt-2">+ Certificate of Achievement</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 text-center shadow-md hover:shadow-gray-400/50 transition-all"
          >
            <h3 className="text-2xl font-bold text-gray-700">2nd Prize</h3>
            <p className="text-3xl font-extrabold mt-2 text-gray-800">
              ₹40,000
            </p>
            <p className="text-gray-600 mt-2">+ Certificate of Achievement</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-400 text-center shadow-md hover:shadow-orange-300/70 transition-all"
          >
            <h3 className="text-2xl font-bold text-orange-600">3rd Prize</h3>
            <p className="text-3xl font-extrabold mt-2 text-gray-800">
              ₹30,000
            </p>
            <p className="text-gray-600 mt-2">+ Certificate of Achievement</p>
          </motion.div>
        </div>

        <div className="mt-10 text-left space-y-2">
          <h3 className="text-2xl font-semibold text-blue-600">
            Certificates for Participants:
          </h3>
          <ul className="text-gray-700 list-disc list-inside">
            <li>Participation Certificate – All registered participants</li>
            <li>
              Appreciation Certificate – Participants securing at least 50%
              marks or ranking in the top 75%
            </li>
            <li>
              Outstanding Performance Certificate – Top 10% (those scoring ≥80%)
            </li>
          </ul>
        </div>
      </motion.section>

      {/* ================= FAQ Section ================= */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative z-10 mt-16 w-full max-w-4xl px-6"
      >
        <style>{`
          details summary {
            list-style: none;
          }
          details summary::-webkit-details-marker {
            display: none;
          }
          details summary::before {
            content: '▶';
            display: inline-block;
            margin-right: 10px;
            color: #2563eb;
            transition: transform 0.3s ease;
          }
          details[open] summary::before {
            transform: rotate(90deg);
          }
          details[open] {
            box-shadow: 0 0 15px rgba(37, 99, 235, 0.4);
            border-color: #2563eb;
          }
        `}</style>

        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-blue-600 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {[
            {
              q: "What is the team size?",
              a: "Participation is limited to teams of up to three (3) individuals. You can be from UG, PG, or PhD backgrounds.",
            },
            {
              q: "Who can participate?",
              a: "Students from UG, PG, or PhD backgrounds are welcome to participate.",
            },
            {
              q: "What is the registration fee?",
              a: "The registration fee is Rs. 2000 per team. Payment details are listed in the 'Registration' section.",
            },
            {
              q: "Is accommodation provided?",
              a: "Yes, free accommodation will be provided to participants during the final (offline) round at NIT Silchar.",
            },
            {
              q: "How many rounds are there?",
              a: "There are three rounds: Round 1 (Online Screening), Round 2 (Online Challenge), and Round 3 (Offline Final at NIT Silchar).",
            },
          ].map((item, i) => (
            <details
              key={i}
              className="border border-blue-200 rounded-xl bg-white text-left transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 focus-within:shadow-blue-200"
            >
              <summary className="cursor-pointer select-none font-semibold text-gray-800 px-4 py-3 text-lg hover:text-blue-600 transition">
                {item.q}
              </summary>
              <p className="px-6 pb-4 text-gray-600">{item.a}</p>
            </details>
          ))}
        </div>
      </motion.section>

      {/* ================= Footer ================= */}
      <footer className="relative z-10 w-full bg-gradient-to-r from-blue-100 to-blue-50 mt-20 py-8 text-center border-t border-gray-300">
        <p className="text-gray-600 text-sm md:text-base">
          Faculty & 3rd Year B.Tech Students of CSE Department, NIT Silchar
        </p>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          For any queries or clarifications, contact the coordinators: CR, Sec A
          & B, B.Tech (CSE), 3rd Year, NIT Silchar
        </p>

        <div className="flex justify-center mt-4 space-x-6">
          <a
            href="https://www.facebook.com/share/1GjVryHqa6/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:scale-110 transition"
          >
            <Facebook size={24} />
          </a>
          <a
            href="https://www.instagram.com/nitsilchar_?igsh=MWVwZnBld3k5Z2pwZA=="
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:scale-110 transition"
          >
            <Instagram size={24} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-500 hover:scale-110 transition"
          >
            <Twitter size={24} />
          </a>
          <a
            href="https://www.linkedin.com/school/national-institute-of-technology-silchar/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:scale-110 transition"
          >
            <Linkedin size={24} />
          </a>
        </div>

        <p className="text-gray-500 text-xs mt-6">
          © {new Date().getFullYear()} Hackathon 2026 | NIT Silchar
        </p>
      </footer>
    </div>
  );
}