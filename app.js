function MedicalGame() {
    const [secretCodePassed, setSecretCodePassed] = React.useState(false);
    const [secretCode, setSecretCode] = React.useState(['S', '', '', 'V', '', 'R']);
    const [showError, setShowError] = React.useState(false);
    const [stage, setStage] = React.useState(0);
    const [showFinal, setShowFinal] = React.useState(false);
    const [showSpecialMessage, setShowSpecialMessage] = React.useState(false);
    const [hearts, setHearts] = React.useState([]);
    const [confetti, setConfetti] = React.useState([]);

    const correctCode = ['S', 'I', 'L', 'V', 'E', 'R'];
    const displayCode = ['S', '_', '_', 'V', '_', 'R'];

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (hearts.length < 12) {
                setHearts(prev => [...prev, {
                    id: Date.now(),
                    left: Math.random() * 100,
                    duration: 3 + Math.random() * 2
                }]);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [hearts]);

    const handleCodeInput = (index, value) => {
        if (displayCode[index] !== '_') return;

        const newCode = [...secretCode];
        newCode[index] = value.toUpperCase();
        setSecretCode(newCode);
        setShowError(false);

        if (value && index < 5) {
            let nextIndex = index + 1;
            while (nextIndex < 6 && displayCode[nextIndex] !== '_') {
                nextIndex++;
            }
            if (nextIndex < 6) {
                const nextInput = document.querySelector(`input[data-index="${nextIndex}"]`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !secretCode[index] && index > 0) {
            let prevIndex = index - 1;
            while (prevIndex >= 0 && displayCode[prevIndex] !== '_') {
                prevIndex--;
            }
            if (prevIndex >= 0) {
                const prevInput = document.querySelector(`input[data-index="${prevIndex}"]`);
                if (prevInput) {
                    prevInput.focus();
                    const newCode = [...secretCode];
                    newCode[prevIndex] = '';
                    setSecretCode(newCode);
                }
            }
        }
    };

    const checkSecretCode = () => {
        const isCorrect = secretCode.join('') === correctCode.join('');
        if (isCorrect) {
            setSecretCodePassed(true);
        } else {
            setShowError(true);
            const newCode = ['S', '', '', 'V', '', 'R'];
            setSecretCode(newCode);
            const firstEditableInput = document.querySelector('input[data-index="1"]');
            if (firstEditableInput) firstEditableInput.focus();
        }
    };

    const handleNext = () => {
        if (stage < stages.length - 1) {
            setStage(stage + 1);
        } else {
            setShowFinal(true);
        }
    };

    const removeHeart = (id) => {
        setHearts(prev => prev.filter(heart => heart.id !== id));
    };

    const createConfetti = () => {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const newConfetti = Array.from({ length: 50 }, (_, i) => ({
            id: Date.now() + i,
            left: Math.random() * 100,
            delay: Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 5 + 5
        }));
        setConfetti(newConfetti);
        setTimeout(() => setConfetti([]), 4000);
    };

    const handleShowMessage = () => {
        setShowSpecialMessage(true);
        createConfetti();
    };

    const stages = [
        {
            icon: "💉",
            title: "Initial Consultation",
            description: "Patient Prasad showing symptoms of sincere regret"
        },
        {
            icon: "🩺",
            title: "Heart Examination",
            description: "Checking emotional vital signs"
        },
        {
            icon: "💊",
            title: "Prescribed Care",
            description: "Administering special attention treatment"
        },
        {
            icon: "🏥",
            title: "Recovery Ward",
            description: "Monitoring healing progress"
        },
        {
            icon: "❤️",
            title: "Final Checkup",
            description: "Evaluating friendship restoration"
        }
    ];

    if (!secretCodePassed) {
        return (
            <div className="game-container secret-code-container">
                <div className="hospital-header">
                    <h1>Access Required</h1>
                    <p>Enter Secret Code to Proceed</p>
                </div>
                
                <div className="secret-code-section">
                    <div className="code-display">
                        {displayCode.map((letter, index) => (
                            <span key={index} className="code-letter">{letter}</span>
                        ))}
                    </div>
                    
                    <div className="code-input-container">
                        {secretCode.map((value, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={value}
                                data-index={index}
                                onChange={(e) => handleCodeInput(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="code-input"
                                disabled={displayCode[index] !== '_'}
                                autoFocus={index === 1}
                            />
                        ))}
                    </div>

                    {showError && (
                        <div className="error-message">
                            ❌ Incorrect Code. Please try again!
                        </div>
                    )}

                    <button 
                        className="medical-btn verify-btn"
                        onClick={checkSecretCode}
                    >
                        Verify Code 🔐
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="game-container">
            <div className="hospital-header">
                <h1>Silver Memorial Hospital</h1>
                <p>Department of Friendship & Care</p>
            </div>
            
            <div className="patient-info">
                <p><strong>Patient:</strong> Prasad Polnati</p>
                <p><strong>Attending Physician:</strong> Dr. Priyanka Silver</p>
                <p><strong>Department:</strong> Emotional Wellness</p>
            </div>

            {!showFinal ? (
                <div className="stage">
                    <h2>Medical Report - Session {stage + 1}</h2>
                    <div className="progress-bar">
                        {stages.map((_, index) => (
                            <div 
                                key={index}
                                className={`progress-dot ${index <= stage ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                    <div className="icon">{stages[stage].icon}</div>
                    <h3>{stages[stage].title}</h3>
                    <p>{stages[stage].description}</p>
                    <button className="medical-btn" onClick={handleNext}>
                        {stage === stages.length - 1 ? 'Complete Treatment' : 'Next Step'}
                    </button>
                </div>
            ) : (
                <div className="stage">
                    <h2>Treatment Summary 👩🏻‍⚕️</h2>
                    <div className="final-message">
                        <p>Dear Dr. Priyanka Silver,</p>
                        <p>After thorough examination of patient Prasad Polnati, we have diagnosed:</p>
                        <ul>
                            <li>Severe Case of Missing You Syndrome 💝</li>
                            <li>Acute Regretful Heart Condition 🥺</li>
                            <li>Chronic Need-Your-Forgiveness Disease 🙏</li>
                        </ul>

                        <p><strong>Recommended Treatment Plan:</strong></p>
                        <ul>
                            <li>Daily Doses of Your Beautiful Smile 😊</li>
                            <li>Regular Friendship Checkups 🩺</li>
                            <li>Continuous Care and Understanding 💕</li>
                        </ul>
                    </div>

                    <div className="treatment-summary">
                        <div className="summary-header">
                            📋 Special Treatment Notes
                        </div>
                        <div className="summary-content">
                            <button 
                                className="message-btn"
                                onClick={handleShowMessage}
                            >
                                Click to Read Personal Note 💌
                            </button>
                            
                            <div className={`special-message ${showSpecialMessage ? 'show' : ''}`}>
                                <h3 style={{color: '#db2777', marginBottom: '1rem'}}>
                                    Sorry Silver 💝
                                </h3>
                                <p style={{lineHeight: '1.6', fontSize: '1.1rem'}}>
                                    I never meant to hurt you. Please forgive me 👩🏻‍⚕️
                                    You're not just my doctor, but someone really special to me.
                                </p>
                                <div style={{marginTop: '1rem', fontSize: '1.2rem'}}>
                                    With deep regret and care<br/>
                                    Prasad Polnati 🙏
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {hearts.map(heart => (
                <div
                    key={heart.id}
                    className="floating-heart"
                    style={{
                        left: `${heart.left}%`,
                        fontSize: '1.5rem',
                        animationDuration: `${heart.duration}s`
                    }}
                    onAnimationEnd={() => removeHeart(heart.id)}
                >
                    ❤️
                </div>
            ))}

            {confetti.map(particle => (
                <div
                    key={particle.id}
                    className="confetti"
                    style={{
                        left: `${particle.left}%`,
                        backgroundColor: particle.color,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        animationDelay: `${particle.delay}s`
                    }}
                />
            ))}
        </div>
    );
}

ReactDOM.render(<MedicalGame />, document.getElementById('root'));