"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Quiz.module.css";

function Quiz({ quiz = [] }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userScore, setUserScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    if (quiz.length === 0) {
        return null;
    }

    const currentQuestion = quiz[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.length - 1;

    function handleAnswerSelect(answerIndex) {
        if (selectedAnswer !== null) return; // Prevent multiple selections

        setSelectedAnswer(answerIndex);
        setShowExplanation(true);

        if (answerIndex === currentQuestion.correctAnswer) {
            setUserScore(userScore + 1);
        }
    }

    function handleNext() {
        if (isLastQuestion) {
            setIsComplete(true);
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        }
    }

    function handleRestart() {
        setCurrentQuestionIndex(0);
        setUserScore(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setIsComplete(false);
    }

    if (isComplete) {
        return (
            <motion.div
                className={styles.quiz}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                <div className={styles.results}>
                    <h3>Quiz completato!</h3>
                    <p className={styles.score}>
                        Hai risposto correttamente a <strong>{userScore}</strong> su <strong>{quiz.length}</strong> domande
                    </p>
                    <p className={styles.percentage}>
                        {Math.round((userScore / quiz.length) * 100)}%
                    </p>
                    <button className={styles.restartButton} onClick={handleRestart}>
                        Ricomincia
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={styles.quiz}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className={styles.header}>
                <span className={styles.progress}>
                    Domanda {currentQuestionIndex + 1} di {quiz.length}
                </span>
                <div className={styles.progressBar}>
                    <motion.div
                        className={styles.progressFill}
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestionIndex + 1) / quiz.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <h3 className={styles.question}>{currentQuestion.question}</h3>

                    <div className={styles.options}>
                        {currentQuestion.options.map((option, index) => {
                            const isCorrect = index === currentQuestion.correctAnswer;
                            const isSelected = selectedAnswer === index;
                            const isWrong = isSelected && !isCorrect;

                            return (
                                <motion.button
                                    key={index}
                                    className={`${styles.option} ${isSelected
                                        ? isCorrect
                                            ? styles.correct
                                            : styles.wrong
                                        : selectedAnswer !== null && isCorrect
                                            ? styles.correct
                                            : ''
                                        }`}
                                    onClick={() => handleAnswerSelect(index)}
                                    disabled={selectedAnswer !== null}
                                    whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                                    whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {option}
                                </motion.button>
                            );
                        })}
                    </div>

                    <AnimatePresence>
                        {showExplanation && (
                            <motion.div
                                className={styles.explanation}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p>{currentQuestion.explanation}</p>
                                <button
                                    className={styles.nextButton}
                                    onClick={handleNext}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isLastQuestion ? "Vedi risultati" : "Prossima domanda"}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}

export default Quiz;