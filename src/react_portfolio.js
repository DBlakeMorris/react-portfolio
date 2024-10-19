'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Particles from "react-particles"
import { loadSlim } from "tsparticles-slim"
import type { Engine } from "tsparticles-engine"
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom'

const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "#000000",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: "#ffffff",
          },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 5 },
          },
        },
        detectRetina: true,
      }}
      className="fixed inset-0 z-0"
    />
  )
}

const TextAnimation = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="text-white font-bold"
    >
      {children}
    </motion.div>
  )
}

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])

  return (
    <motion.section
      id={id}
      className="py-20 min-h-screen flex flex-col justify-center relative z-10"
      style={{ opacity }}
    >
      <div className="container mx-auto px-4">
        <TextAnimation>
          <h2 className="text-4xl font-sans mb-8 text-white font-bold tracking-tight uppercase">{title}</h2>
        </TextAnimation>
        {children}
      </div>
    </motion.section>
  )
}

const SkillBar = ({ skill, level }: { skill: string; level: number }) => (
  <motion.div
    className="mb-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="mb-1">
      <span className="text-base font-medium text-white">{skill}</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <motion.div
        className="bg-white h-2.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${level}%` }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
      ></motion.div>
    </div>
  </motion.div>
)

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 }
    )

    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section)
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setActiveSection(sectionId)
  }

  const navItems = ['home', 'about', 'experience', 'education', 'skills']

  return (
    <Router>
      <div className="bg-black text-white min-h-screen font-sans relative">
        <ParticleBackground />
        <header className={`fixed top-0 left-0 right-0 ${isScrolled ? 'bg-black' : 'bg-transparent'} transition-colors duration-300 z-20`}>
          <nav className="container mx-auto px-4 py-4">
            <div className="flex justify-center items-center relative">
              <button
                className="lg:hidden absolute left-0 text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? 'Close' : 'Menu'}
              </button>
              <ul className={`${isMobileMenuOpen ? 'flex' : 'hidden'} lg:flex flex-row justify-center items-center space-x-4 w-full lg:w-auto absolute lg:relative top-full left-0 right-0 bg-black lg:bg-transparent py-4 lg:py-0`}>
                {navItems.map((section) => (
                  <li key={section}>
                    <Link
                      to={`#${section}`}
                      onClick={() => scrollToSection(section)}
                      className={`text-xs sm:text-sm uppercase tracking-wider hover:text-gray-300 transition-colors ${
                        activeSection === section ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      {section}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </header>

        <main className="relative z-10">
          <Routes>
            <Route path="/" element={
              <>
                <Section id="home" title="">
                  <div className="text-center">
                    <TextAnimation>
                      <h1 className="text-4xl md:text-6xl font-serif mb-4">Dan Blake Morris</h1>
                    </TextAnimation>
                    <p className="text-xl mb-8">NLP & ML Engineer</p>
                    <motion.a
                      href="mailto:danielblakemorris@gmail.com"
                      className="bg-white text-black px-6 py-2 md:px-8 md:py-3 rounded-full hover:bg-gray-200 transition-colors text-sm md:text-base"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Request Copy of Resume
                    </motion.a>
                  </div>
                </Section>
                <Section id="about" title="About Me">
                  <motion.div
                    className="bg-gray-900 bg-opacity-50 p-6 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="mb-4">
                      A leading Natural Language Processing (NLP) Engineer on LinkedIn and proven Data Science and Machine Learning
                      (ML) specialist with over 4 years of end-to-end experience in training, evaluating, testing and deploying
                      large scale models/systems. Experienced in orchestrating complicated data pipelines, system engineering on 
                      large-scale datasets and focused on building data pipelines, ML frameworks, information retrieval systems 
                      and custom LLMs.
                    </p>
                    <ul className="list-disc list-inside mb-4">
                      <li>An engineer at heart who likes to fix more than he breaks</li>
                      <li>Researching and democratising niche text analytics understanding with DKIT and the Hugging Face community</li>
                      <li>Consulted across the board, from startups to Fortune 10 Technology firms</li>
                    </ul>
                    <motion.a
                      href="https://www.linkedin.com/in/daniel-blake-morris"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-300 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Connect on LinkedIn
                    </motion.a>
                  </motion.div>
                </Section>
                <Section id="experience" title="Experience">
                  <div className="space-y-8">
                    <motion.div
                      className="bg-gray-900 bg-opacity-50 p-6 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="text-xl font-semibold mb-2">Language Data Scientist</h3>
                      <p className="text-gray-400 mb-2">Sept - Present</p>
                      <p className="mb-4">Reddit</p>
                      <ul className="list-disc list-inside">
                        <li>Developed NLP/ML models, and custom LLMs improving content moderation and recommendation systems</li>
                        <li>Collaborated in curating datasets for training Reddit-specific language models, performing fine-tuning and reinforcement learning to teach language models to interact with new information architectures</li>
                      </ul>
                    </motion.div>
                    <motion.div
                      className="bg-gray-900 bg-opacity-50 p-6 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <h3 className="text-xl font-semibold mb-2">Senior ML & NLP Engineer</h3>
                      <p className="text-gray-400 mb-2">Jan - July 2024</p>
                      <p className="mb-4">ISx4</p>
                      <ul className="list-disc list-inside">
                        <li>Spearheaded all NLP and ML initiatives across product teams, driven fast strategic prototyping and delivered innovative solutions</li>
                        <li>Authored and presented Generative AI research papers with Queen's University Belfast and DKIT</li>
                        <li>Mentored data scientists in NLP and ML end-to-end development</li>
                      </ul>
                    </motion.div>
                    <motion.div
                      className="bg-gray-900 bg-opacity-50 p-6 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <h3 className="text-xl font-semibold mb-2">ML & NLP Scientist/Engineer</h3>
                      <p className="text-gray-400 mb-2">Oct 2022 - Jan 2024</p>
                      <p className="mb-4">Loughborough University with SVGC Ltd</p>
                      <ul className="list-disc list-inside">
                        <li>Developed and managed multiple AI-related projects in a Knowledge Transfer Partnership (KTP) in collaboration with SVGC Ltd</li>
                        <li>Conducted thorough requirements analyses, user experience assessments, presented to stakeholders and researched to inform, develop and train NLP/ML solutions for government clients</li>
                      </ul>
                    </motion.div>
                    <motion.div
                      className="bg-gray-900 bg-opacity-50 p-6 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <h3 className="text-xl font-semibold mb-2">NLP Researcher</h3>
                      <p className="text-gray-400 mb-2">Oct 2020 - Oct 2022</p>
                      <p className="mb-4">Lancaster University</p>
                      <ul className="list-disc list-inside">
                        <li>Volunteered to contribute to Linguistics research groups, leading end-to-end development of NLU and NLP models for diverse funded projects, from research to evaluation</li>
                      </ul>
                    </motion.div>
                  </div>
                </Section>
                <Section id="education" title="Education">
                  <motion.div
                    className="bg-gray-900 bg-opacity-50 p-6 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-xl font-semibold mb-2">Master's in Computational Linguistics</h3>
                    <p className="text-gray-400 mb-2">Graduated 2022</p>
                    <p className="mb-4">Lancaster University</p>
                    <p>Specialisation in: Natural Language Processing, Knowledge Graphs & Ontologies, Discourse Analysis, Corpus Linguistics</p>
                  </motion.div>
                </Section>
                <Section id="skills" title="Skills">
                  <motion.div
                    className="bg-gray-900 bg-opacity-50 p-6 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.
