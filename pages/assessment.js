// Mattis&Co - AI Readiness Assessment Tool
// One-at-a-time flow with animations and score ring

document.addEventListener('DOMContentLoaded', function() {
    initAssessment();
});

// State
let currentQuestion = 1;
const totalQuestions = 6;
const answers = {};

function initAssessment() {
    const startBtn = document.getElementById('start-assessment');
    const retakeBtn = document.getElementById('retake-assessment');
    
    if (startBtn) {
        startBtn.addEventListener('click', startAssessment);
    }
    
    if (retakeBtn) {
        retakeBtn.addEventListener('click', retakeAssessment);
    }
    
    // Set up answer card listeners
    const answerCards = document.querySelectorAll('.answer-card');
    answerCards.forEach(card => {
        card.addEventListener('click', handleAnswerSelect);
    });
}

function startAssessment() {
    const startScreen = document.getElementById('assessment-start');
    const flowScreen = document.getElementById('assessment-flow');
    
    // Fade out start screen
    startScreen.style.opacity = '0';
    startScreen.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        startScreen.style.display = 'none';
        flowScreen.style.display = 'block';
        
        // Fade in flow screen
        setTimeout(() => {
            flowScreen.style.opacity = '1';
            flowScreen.style.transform = 'translateY(0)';
        }, 50);
    }, 300);
    
    // Reset state
    currentQuestion = 1;
    Object.keys(answers).forEach(key => delete answers[key]);
    updateProgress();
}

function handleAnswerSelect(e) {
    const card = e.currentTarget;
    const slide = card.closest('.question-slide');
    const questionNum = parseInt(slide.dataset.question);
    const value = parseInt(card.dataset.value);
    
    // Store answer
    answers[questionNum] = value;
    
    // Visual feedback - mark selected
    const siblingCards = slide.querySelectorAll('.answer-card');
    siblingCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    
    // Add pulse animation
    card.classList.add('pulse');
    setTimeout(() => card.classList.remove('pulse'), 300);
    
    // Auto-advance after brief delay
    setTimeout(() => {
        if (currentQuestion < totalQuestions) {
            goToQuestion(currentQuestion + 1);
        } else {
            showResults();
        }
    }, 400);
}

function goToQuestion(num) {
    const currentSlide = document.querySelector(`.question-slide[data-question="${currentQuestion}"]`);
    const nextSlide = document.querySelector(`.question-slide[data-question="${num}"]`);
    
    // Animate out current
    currentSlide.classList.remove('active');
    currentSlide.classList.add('exit');
    
    // Animate in next
    setTimeout(() => {
        currentSlide.classList.remove('exit');
        nextSlide.classList.add('active');
        currentQuestion = num;
        updateProgress();
    }, 250);
}

function updateProgress() {
    // Update progress bar fill
    const progressFill = document.getElementById('progress-fill');
    const percentage = ((currentQuestion - 1) / totalQuestions) * 100;
    progressFill.style.width = `${percentage}%`;
    
    // Update dots
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
        if (index < currentQuestion) {
            dot.classList.add('completed');
        } else {
            dot.classList.remove('completed');
        }
        if (index === currentQuestion - 1) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function showResults() {
    const flowScreen = document.getElementById('assessment-flow');
    const resultsScreen = document.getElementById('assessment-results');
    
    // Calculate score
    let totalScore = 0;
    Object.values(answers).forEach(val => totalScore += val);
    
    // Get result content
    const result = getResultContent(totalScore);
    
    // Fade out flow
    flowScreen.style.opacity = '0';
    flowScreen.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        flowScreen.style.display = 'none';
        resultsScreen.style.display = 'block';
        
        // Set content
        document.getElementById('results-level').textContent = result.level;
        document.getElementById('results-description').textContent = result.description;
        document.getElementById('results-implications').textContent = result.implications;
        document.getElementById('results-badge').textContent = result.badge;
        document.getElementById('results-badge').className = `results-badge ${result.badgeClass}`;
        
        // Fade in results
        setTimeout(() => {
            resultsScreen.style.opacity = '1';
            resultsScreen.style.transform = 'translateY(0)';
            
            // Animate score ring and number
            animateScoreRing(totalScore);
            animateScoreNumber(totalScore);
        }, 50);
    }, 300);
    
    // Scroll to results
    setTimeout(() => {
        document.getElementById('ai-readiness').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
}

function animateScoreRing(score) {
    const ring = document.getElementById('score-ring-fill');
    const circumference = 2 * Math.PI * 54; // r = 54
    const percentage = score / 24;
    const offset = circumference - (percentage * circumference);
    
    // Set initial state
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference;
    
    // Animate
    setTimeout(() => {
        ring.style.strokeDashoffset = offset;
    }, 100);
}

function animateScoreNumber(finalScore) {
    const element = document.getElementById('score-display');
    let currentScore = 0;
    const duration = 1200;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        currentScore = Math.round(eased * finalScore);
        
        element.textContent = currentScore;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function retakeAssessment() {
    const startScreen = document.getElementById('assessment-start');
    const flowScreen = document.getElementById('assessment-flow');
    const resultsScreen = document.getElementById('assessment-results');
    
    // Reset all answer cards
    document.querySelectorAll('.answer-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Reset all slides
    document.querySelectorAll('.question-slide').forEach((slide, index) => {
        slide.classList.remove('active', 'exit');
        if (index === 0) slide.classList.add('active');
    });
    
    // Reset state
    currentQuestion = 1;
    Object.keys(answers).forEach(key => delete answers[key]);
    
    // Reset progress
    document.getElementById('progress-fill').style.width = '0%';
    document.querySelectorAll('.progress-dot').forEach(dot => {
        dot.classList.remove('completed', 'active');
    });
    document.querySelector('.progress-dot[data-step="1"]').classList.add('active');
    
    // Fade out results
    resultsScreen.style.opacity = '0';
    resultsScreen.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        resultsScreen.style.display = 'none';
        startScreen.style.display = 'block';
        startScreen.style.opacity = '0';
        startScreen.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            startScreen.style.opacity = '1';
            startScreen.style.transform = 'translateY(0)';
        }, 50);
    }, 300);
    
    // Scroll to top of section
    document.getElementById('ai-readiness').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getResultContent(score) {
    if (score <= 8) {
        return {
            level: 'Foundational',
            badge: 'Early Stage',
            badgeClass: 'badge-foundational',
            description: 'Your organization is in the early stages of AI adoption. This isn\'t a weakness—it\'s an opportunity to build the right foundation from day one, avoiding the technical debt and governance gaps that plague companies who moved too fast.',
            implications: 'You have a clean slate. The priority is establishing AI governance and strategy before scaling investments. Companies at this stage who rush into pilots without a framework end up with fragmented tools and shadow AI. A 45-day sprint to define your AI operating model would give you the architecture to move fast without breaking things.'
        };
    } else if (score <= 14) {
        return {
            level: 'Emerging',
            badge: 'Building Momentum',
            badgeClass: 'badge-emerging',
            description: 'Your organization has started the AI journey but lacks the operating model to scale it. You likely have pockets of experimentation and growing awareness, but governance, talent, and infrastructure gaps are creating friction.',
            implications: 'The risk here is "pilot purgatory"—lots of experiments, few reaching production. You need to formalize governance, connect AI initiatives to business outcomes, and build the internal capability to sustain momentum. Most companies at this stage benefit from a structured assessment to identify what\'s blocking scale.'
        };
    } else if (score <= 19) {
        return {
            level: 'Advancing',
            badge: 'Scaling Up',
            badgeClass: 'badge-advancing',
            description: 'Your organization has meaningful AI capability and is moving toward enterprise-wide deployment. Governance structures exist, talent is developing, and some AI initiatives are delivering measurable value.',
            implications: 'The challenge now is scaling without losing control. Agentic AI, ethical frameworks, and human-AI workflow design become critical. Companies at this stage often need help architecting the next phase—moving from centralized AI teams to embedded capability across business units.'
        };
    } else {
        return {
            level: 'Leading',
            badge: 'Industry Leader',
            badgeClass: 'badge-leading',
            description: 'Your organization is among the most AI-mature in your industry. You have formal governance, embedded talent, mature infrastructure, and are likely already exploring agentic systems and advanced use cases.',
            implications: 'At this level, the conversation shifts to sustaining competitive advantage and managing second-order effects: AI ethics at scale, organizational change management, and preparing for regulatory evolution. You\'re also positioned to become an ecosystem leader—shaping how partners and suppliers integrate AI into shared workflows.'
        };
    }
}
