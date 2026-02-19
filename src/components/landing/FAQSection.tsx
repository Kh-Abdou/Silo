"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollReveal } from "./ScrollReveal"

interface FAQItem {
    question: string
    answer: string
}

const faqs: FAQItem[] = [
    {
        question: "What exactly is Silo?",
        answer: "Silo is a \"Second Brain\" tool designed to capture and organize your fragmented information flows. A centralized space where notes, links, and files are instantly structured in an intuitive way."
    },
    {
        question: "Who is it for?",
        answer: "For developers, creators, researchers, and anyone suffering from information overload. Ideal if you have too many open tabs or notes scattered across multiple platforms."
    },
    {
        question: "Does it work on my phone?",
        answer: "Yes, Silo is available via a native mobile application optimized for iOS and Android, as well as a responsive web interface for ultra-fast capture wherever you are."
    },
    {
        question: "Do I own my data?",
        answer: "Absolutely. Data sovereignty is at the heart of Silo. You can export your entire database in JSON format at any time without any restrictions."
    },
    {
        question: "Is it free?",
        answer: "Yes, Silo is entirely free and open-source. There are no premium plans or hidden costs. You can host it yourself or use our managed instance."
    }
]

function FAQItemComponent({
    faq,
    isOpen,
    onToggle,
    isDimmed,
    onHover
}: {
    faq: FAQItem,
    isOpen: boolean,
    onToggle: () => void,
    isDimmed: boolean,
    onHover: (hovering: boolean) => void
}) {
    return (
        <motion.div
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            initial={false}
            animate={{
                opacity: isDimmed ? 0.4 : 1,
                y: isOpen ? -2 : 0
            }}
            transition={{ duration: 0.3 }}
            className={`
                relative overflow-hidden rounded-2xl border transition-all duration-300
                ${isOpen
                    ? "bg-zinc-100/80 dark:bg-white/5 border-zinc-200 dark:border-white/20 shadow-inner"
                    : "bg-white dark:bg-white/[0.02] border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/15 hover:bg-zinc-100 dark:hover:bg-white/[0.04] shadow-sm hover:shadow-md dark:shadow-none"
                }
                backdrop-blur-md
            `}
        >
            <button
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${faq.question.replace(/\s+/g, '-').toLowerCase()}`}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
            >
                <span
                    id={`faq-question-${faq.question.replace(/\s+/g, '-').toLowerCase()}`}
                    className={`
                    text-base font-medium transition-colors duration-300
                    ${isOpen
                            ? "text-zinc-900 dark:text-white"
                            : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200"
                        }
                `}>
                    {faq.question}
                </span>

                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`
                        w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300
                        ${isOpen
                            ? "bg-zinc-200/50 dark:bg-white/10 border-zinc-300 dark:border-white/20 text-zinc-900 dark:text-white"
                            : "bg-zinc-100/50 dark:bg-white/5 border-zinc-200 dark:border-white/5 text-zinc-400 dark:text-zinc-500 group-hover:border-zinc-300 dark:group-hover:border-white/20 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                        }
                    `}
                >
                    <span className="material-symbols-outlined text-[20px] notranslate" translate="no">keyboard_arrow_down</span>
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        id={`faq-answer-${faq.question.replace(/\s+/g, '-').toLowerCase()}`}
                        role="region"
                        aria-labelledby={`faq-question-${faq.question.replace(/\s+/g, '-').toLowerCase()}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 pb-6 pt-0">
                            <div className="w-full h-[1px] bg-zinc-200 dark:bg-white/5 mb-6" />
                            <p className="text-sm font-normal text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    return (
        <section id="faq" className="px-6 py-24 border-t border-white/5 bg-transparent relative overflow-hidden">
            <div className="max-w-2xl mx-auto flex flex-col">

                {/* Header */}
                <ScrollReveal className="text-center mb-16 flex flex-col items-center">
                    <div className="inline-flex items-center rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100/50 dark:bg-white/5 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-6 backdrop-blur-md">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 mr-2 animate-pulse"></span>
                        Support & Info
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-600 dark:from-white dark:to-white/60 tracking-tight mb-4">
                        Frequently Asked Questions
                    </h2>

                    <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                        Everything you need to know about Silo's philosophy, data ownership, and future updates.
                    </p>
                </ScrollReveal>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <ScrollReveal key={index} delay={index * 0.1}>
                            <FAQItemComponent
                                faq={faq}
                                isOpen={openIndex === index}
                                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                                isDimmed={hoveredIndex !== null && hoveredIndex !== index}
                                onHover={(isHovering) => setHoveredIndex(isHovering ? index : null)}
                            />
                        </ScrollReveal>
                    ))}
                </div>
            </div>

            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        </section>
    )
}
