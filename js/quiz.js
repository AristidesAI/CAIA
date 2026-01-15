/**
 * CAIA Quiz Pro - Quiz Application
 * A static quiz application for CAIA exam preparation
 */

(function() {
  'use strict';

  // ============================================================================
  // State Management
  // ============================================================================

  const state = {
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswers: {},
    quizStartTime: null,
    quizEndTime: null,
    timerInterval: null,
    currentLevel: null,
    selectedTopics: [],
    quizQuestions: [],
    isReviewMode: false
  };

  // ============================================================================
  // DOM Elements
  // ============================================================================

  const elements = {
    // Views
    homeView: document.getElementById('home-view'),
    quizView: document.getElementById('quiz-view'),
    resultsView: document.getElementById('results-view'),

    // Navigation
    navLinks: document.querySelectorAll('.app-nav-link'),

    // Home view elements
    levelCards: document.querySelectorAll('.level-card'),
    startMixedQuiz: document.getElementById('start-mixed-quiz'),

    // Quiz view elements
    quizLevelBadge: document.getElementById('quiz-level-badge'),
    quizTopicBadge: document.getElementById('quiz-topic-badge'),
    timerDisplay: document.getElementById('timer-display'),
    currentQuestionNum: document.getElementById('current-question-num'),
    totalQuestions: document.getElementById('total-questions'),
    progressPercent: document.getElementById('progress-percent'),
    progressFill: document.getElementById('progress-fill'),
    questionText: document.getElementById('question-text'),
    answerOptions: document.getElementById('answer-options'),
    explanationBox: document.getElementById('explanation-box'),
    explanationIcon: document.getElementById('explanation-icon'),
    explanationTitle: document.getElementById('explanation-title'),
    explanationText: document.getElementById('explanation-text'),
    btnPrevious: document.getElementById('btn-previous'),
    btnNext: document.getElementById('btn-next'),
    btnFinish: document.getElementById('btn-finish'),
    questionDots: document.getElementById('question-dots'),

    // Results view elements
    resultsSubtitle: document.getElementById('results-subtitle'),
    scoreRingFill: document.getElementById('score-ring-fill'),
    scoreValue: document.getElementById('score-value'),
    correctCount: document.getElementById('correct-count'),
    incorrectCount: document.getElementById('incorrect-count'),
    timeTaken: document.getElementById('time-taken'),
    topicPerformance: document.getElementById('topic-performance'),
    questionReviewList: document.getElementById('question-review-list'),
    btnReviewAnswers: document.getElementById('btn-review-answers'),
    btnRetake: document.getElementById('btn-retake'),
    btnNewQuiz: document.getElementById('btn-new-quiz'),

    // Topic modal elements
    topicModalBackdrop: document.getElementById('topic-modal-backdrop'),
    topicModal: document.getElementById('topic-modal'),
    closeTopicModal: document.getElementById('close-topic-modal'),
    topicCheckboxes: document.getElementById('topic-checkboxes'),
    selectAllTopics: document.getElementById('select-all-topics'),
    startTopicQuiz: document.getElementById('start-topic-quiz')
  };

  // ============================================================================
  // Data Loading
  // ============================================================================

  function getBasePath() {
    // Get base path for GitHub Pages compatibility
    if (window.CAIA_BASE_PATH) {
      return window.CAIA_BASE_PATH;
    }
    const path = window.location.pathname;
    const basePath = path.split('/').slice(0, -1).join('/') || '';
    return basePath;
  }

  function getResourcePath(relativePath) {
    const base = getBasePath();
    if (base && !relativePath.startsWith('/')) {
      return base + '/' + relativePath;
    }
    return relativePath;
  }

  function showLoading() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.classList.remove('hidden');
    }
  }

  function hideLoading() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.classList.add('hidden');
    }
  }

  function showError(message) {
    console.error(message);
    hideLoading();
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    if (errorMessage && errorText) {
      errorText.textContent = message;
      errorMessage.classList.remove('hidden');
    } else {
      // Fallback: alert if error elements don't exist
      alert(message);
    }
  }

  function hideError() {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
      errorMessage.classList.add('hidden');
    }
  }

  async function loadQuestions() {
    showLoading();
    hideError();
    
    try {
      // Try multiple path variations for GitHub Pages compatibility
      const paths = [
        getResourcePath('data/questions/questions.json'),
        'data/questions/questions.json',
        './data/questions/questions.json',
        '/data/questions/questions.json'
      ];

      let response = null;
      let lastError = null;

      for (const path of paths) {
        try {
          response = await fetch(path);
          if (response.ok) {
            break;
          }
        } catch (err) {
          lastError = err;
          continue;
        }
      }

      if (!response || !response.ok) {
        throw new Error(`Failed to load questions. HTTP ${response ? response.status : 'network error'}`);
      }

      const data = await response.json();
      
      if (!data || !data.questions || !Array.isArray(data.questions)) {
        throw new Error('Invalid question data format');
      }

      state.questions = data.questions;
      updateHomeStats();
      hideLoading();
      return data;
    } catch (error) {
      console.error('Error loading questions:', error);
      showError(`Failed to load questions: ${error.message}. Please check your internet connection and refresh the page.`);
      return null;
    }
  }

  function updateHomeStats() {
    const level1Questions = state.questions.filter(q => q.level === 1);
    const level2Questions = state.questions.filter(q => q.level === 2);

    const level1Topics = new Set(level1Questions.map(q => q.topic));
    const level2Topics = new Set(level2Questions.map(q => q.topic));

    document.getElementById('level1-questions').textContent = level1Questions.length;
    document.getElementById('level2-questions').textContent = level2Questions.length;
    document.getElementById('level1-topics').textContent = level1Topics.size;
    document.getElementById('level2-topics').textContent = level2Topics.size;
  }

  // ============================================================================
  // View Management
  // ============================================================================

  function showView(viewName) {
    // Hide all views
    elements.homeView.classList.add('hidden');
    elements.quizView.classList.add('hidden');
    elements.resultsView.classList.add('hidden');

    // Update nav links
    elements.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.view === viewName) {
        link.classList.add('active');
      }
    });

    // Show selected view
    switch (viewName) {
      case 'home':
        elements.homeView.classList.remove('hidden');
        break;
      case 'quiz':
        elements.quizView.classList.remove('hidden');
        break;
      case 'results':
        elements.resultsView.classList.remove('hidden');
        break;
    }
  }

  // ============================================================================
  // Quiz Logic
  // ============================================================================

  function startQuiz(level = null, topics = []) {
    // Check if questions are loaded
    if (!state.questions || state.questions.length === 0) {
      showError('Questions are still loading. Please wait and try again.');
      return;
    }

    // Filter questions based on level and topics
    let filteredQuestions = [...state.questions];

    if (level !== null) {
      filteredQuestions = filteredQuestions.filter(q => q.level === level);
    }

    if (topics.length > 0) {
      filteredQuestions = filteredQuestions.filter(q => topics.includes(q.topic));
    }

    // Check if we have questions after filtering
    if (filteredQuestions.length === 0) {
      showError('No questions available for the selected level and topics. Please try different options.');
      return;
    }

    // Shuffle questions
    state.quizQuestions = shuffleArray(filteredQuestions);
    state.currentQuestionIndex = 0;
    state.selectedAnswers = {};
    state.currentLevel = level;
    state.selectedTopics = topics;
    state.isReviewMode = false;

    // Start timer
    state.quizStartTime = Date.now();
    startTimer();

    // Update UI
    elements.totalQuestions.textContent = state.quizQuestions.length;
    createQuestionDots();
    renderQuestion();
    showView('quiz');
  }

  function renderQuestion() {
    const question = state.quizQuestions[state.currentQuestionIndex];
    if (!question) return;

    // Update badges
    elements.quizLevelBadge.textContent = `Level ${question.level}`;
    elements.quizTopicBadge.textContent = question.topic;

    // Update question number and progress
    elements.currentQuestionNum.textContent = state.currentQuestionIndex + 1;
    const progress = ((state.currentQuestionIndex + 1) / state.quizQuestions.length) * 100;
    elements.progressPercent.textContent = `${Math.round(progress)}%`;
    elements.progressFill.style.width = `${progress}%`;

    // Update question text
    elements.questionText.textContent = question.question;

    // Render answer options
    const selectedAnswer = state.selectedAnswers[question.id];
    const optionLabels = ['A', 'B', 'C', 'D'];

    elements.answerOptions.innerHTML = question.options.map((option, index) => {
      const isSelected = selectedAnswer === index;
      const isCorrect = index === question.correctAnswer;
      const hasAnswered = selectedAnswer !== undefined;

      let optionClass = 'answer-option';
      if (hasAnswered || state.isReviewMode) {
        if (isCorrect) {
          optionClass += ' correct';
        } else if (isSelected && !isCorrect) {
          optionClass += ' incorrect';
        }
        if (isSelected) {
          optionClass += ' selected';
        }
      } else if (isSelected) {
        optionClass += ' selected';
      }

      return `
        <button class="${optionClass}" data-index="${index}" ${hasAnswered && !state.isReviewMode ? 'disabled' : ''}>
          <span class="option-label">${optionLabels[index]}</span>
          <span class="option-text">${option}</span>
          ${hasAnswered && isCorrect ? '<span class="option-icon correct-icon">&#10003;</span>' : ''}
          ${hasAnswered && isSelected && !isCorrect ? '<span class="option-icon incorrect-icon">&#10007;</span>' : ''}
        </button>
      `;
    }).join('');

    // Show/hide explanation
    if (selectedAnswer !== undefined || state.isReviewMode) {
      const isCorrect = selectedAnswer === question.correctAnswer;
      elements.explanationBox.classList.remove('hidden');
      elements.explanationIcon.innerHTML = isCorrect
        ? '<span class="text-success">&#10003;</span>'
        : '<span class="text-error">&#10007;</span>';
      elements.explanationTitle.textContent = isCorrect ? 'Correct!' : 'Incorrect';
      elements.explanationTitle.className = 'explanation-title ' + (isCorrect ? 'text-success' : 'text-error');
      elements.explanationText.textContent = question.explanation;
    } else {
      elements.explanationBox.classList.add('hidden');
    }

    // Update navigation buttons
    elements.btnPrevious.disabled = state.currentQuestionIndex === 0;

    const isLastQuestion = state.currentQuestionIndex === state.quizQuestions.length - 1;
    elements.btnNext.classList.toggle('hidden', isLastQuestion);
    elements.btnFinish.classList.toggle('hidden', !isLastQuestion);

    // Update question dots
    updateQuestionDots();
  }

  function selectAnswer(index) {
    const question = state.quizQuestions[state.currentQuestionIndex];
    if (state.selectedAnswers[question.id] !== undefined && !state.isReviewMode) {
      return; // Already answered
    }

    state.selectedAnswers[question.id] = index;
    renderQuestion();
  }

  function nextQuestion() {
    if (state.currentQuestionIndex < state.quizQuestions.length - 1) {
      state.currentQuestionIndex++;
      renderQuestion();
    }
  }

  function previousQuestion() {
    if (state.currentQuestionIndex > 0) {
      state.currentQuestionIndex--;
      renderQuestion();
    }
  }

  function goToQuestion(index) {
    if (index >= 0 && index < state.quizQuestions.length) {
      state.currentQuestionIndex = index;
      renderQuestion();
    }
  }

  function finishQuiz() {
    state.quizEndTime = Date.now();
    stopTimer();
    showResults();
  }

  // ============================================================================
  // Timer
  // ============================================================================

  function startTimer() {
    stopTimer();
    state.timerInterval = setInterval(updateTimerDisplay, 1000);
    updateTimerDisplay();
  }

  function stopTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  }

  function updateTimerDisplay() {
    const elapsed = Math.floor((Date.now() - state.quizStartTime) / 1000);
    elements.timerDisplay.textContent = formatTime(elapsed);
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // ============================================================================
  // Question Navigator
  // ============================================================================

  function createQuestionDots() {
    elements.questionDots.innerHTML = state.quizQuestions.map((_, index) => {
      return `<button class="question-dot" data-index="${index}">${index + 1}</button>`;
    }).join('');
  }

  function updateQuestionDots() {
    const dots = elements.questionDots.querySelectorAll('.question-dot');
    dots.forEach((dot, index) => {
      const question = state.quizQuestions[index];
      const isAnswered = state.selectedAnswers[question.id] !== undefined;
      const isCurrent = index === state.currentQuestionIndex;
      const isCorrect = state.selectedAnswers[question.id] === question.correctAnswer;

      dot.className = 'question-dot';
      if (isCurrent) dot.classList.add('current');
      if (isAnswered) {
        dot.classList.add('answered');
        if (isCorrect) {
          dot.classList.add('correct');
        } else {
          dot.classList.add('incorrect');
        }
      }
    });
  }

  // ============================================================================
  // Results
  // ============================================================================

  function showResults() {
    const results = calculateResults();

    // Update score ring
    const circumference = 2 * Math.PI * 70;
    const offset = circumference - (results.percentage / 100) * circumference;
    elements.scoreRingFill.style.strokeDashoffset = offset;

    // Update score display
    elements.scoreValue.textContent = `${results.percentage}%`;
    elements.correctCount.textContent = results.correct;
    elements.incorrectCount.textContent = results.incorrect;

    // Update time taken
    const timeTaken = Math.floor((state.quizEndTime - state.quizStartTime) / 1000);
    elements.timeTaken.textContent = formatTime(timeTaken);

    // Update subtitle based on score
    if (results.percentage >= 70) {
      elements.resultsSubtitle.textContent = 'Excellent work! You\'re well prepared!';
    } else if (results.percentage >= 50) {
      elements.resultsSubtitle.textContent = 'Good effort! Keep studying!';
    } else {
      elements.resultsSubtitle.textContent = 'Keep practicing! You\'ll improve!';
    }

    // Render topic performance
    renderTopicPerformance(results.byTopic);

    // Render question review
    renderQuestionReview();

    showView('results');
  }

  function calculateResults() {
    let correct = 0;
    let incorrect = 0;
    const byTopic = {};

    state.quizQuestions.forEach(question => {
      const answer = state.selectedAnswers[question.id];
      const isCorrect = answer === question.correctAnswer;

      if (isCorrect) {
        correct++;
      } else {
        incorrect++;
      }

      // Track by topic
      if (!byTopic[question.topic]) {
        byTopic[question.topic] = { correct: 0, total: 0 };
      }
      byTopic[question.topic].total++;
      if (isCorrect) {
        byTopic[question.topic].correct++;
      }
    });

    const percentage = Math.round((correct / state.quizQuestions.length) * 100);

    return { correct, incorrect, percentage, byTopic };
  }

  function renderTopicPerformance(byTopic) {
    const topicNames = Object.keys(byTopic).sort();

    elements.topicPerformance.innerHTML = topicNames.map(topic => {
      const data = byTopic[topic];
      const percentage = Math.round((data.correct / data.total) * 100);
      const barClass = percentage >= 70 ? 'progress-bar-success' : percentage >= 50 ? '' : 'progress-bar-error';

      return `
        <div class="topic-performance-item mb-4">
          <div class="flex justify-between text-sm mb-1">
            <span class="font-medium">${topic}</span>
            <span class="text-muted">${data.correct}/${data.total} (${percentage}%)</span>
          </div>
          <div class="progress-bar ${barClass}">
            <div class="progress-bar-fill" style="width: ${percentage}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderQuestionReview() {
    elements.questionReviewList.innerHTML = state.quizQuestions.map((question, index) => {
      const answer = state.selectedAnswers[question.id];
      const isCorrect = answer === question.correctAnswer;
      const statusClass = isCorrect ? 'correct' : 'incorrect';
      const statusIcon = isCorrect ? '&#10003;' : '&#10007;';

      return `
        <button class="question-review-item ${statusClass}" data-index="${index}">
          <span class="review-number">${index + 1}</span>
          <span class="review-question">${truncateText(question.question, 60)}</span>
          <span class="review-status">${statusIcon}</span>
        </button>
      `;
    }).join('');
  }

  // ============================================================================
  // Topic Modal
  // ============================================================================

  function showTopicModal(level) {
    state.currentLevel = level;

    // Get topics for this level
    const topics = [...new Set(
      state.questions
        .filter(q => q.level === level)
        .map(q => q.topic)
    )];

    // Render checkboxes
    elements.topicCheckboxes.innerHTML = topics.map(topic => {
      const count = state.questions.filter(q => q.level === level && q.topic === topic).length;
      return `
        <label class="form-check mb-3">
          <input type="checkbox" class="form-check-input topic-checkbox" value="${topic}" checked>
          <span class="form-check-label">${topic} (${count} questions)</span>
        </label>
      `;
    }).join('');

    // Show modal
    elements.topicModalBackdrop.classList.add('active');
    elements.topicModal.classList.add('active');
  }

  function hideTopicModal() {
    elements.topicModalBackdrop.classList.remove('active');
    elements.topicModal.classList.remove('active');
  }

  function getSelectedTopics() {
    const checkboxes = elements.topicCheckboxes.querySelectorAll('.topic-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.value);
  }

  function selectAllTopics() {
    const checkboxes = elements.topicCheckboxes.querySelectorAll('.topic-checkbox');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = !allChecked);
    elements.selectAllTopics.textContent = allChecked ? 'Select All' : 'Deselect All';
  }

  // ============================================================================
  // Utility Functions
  // ============================================================================

  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // showError is now defined in the Data Loading section above

  // ============================================================================
  // Event Listeners
  // ============================================================================

  function initEventListeners() {
    // Navigation
    elements.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = e.target.dataset.view;
        if (view === 'quiz' && state.quizQuestions.length === 0) {
          showView('home');
        } else if (view === 'results' && state.quizQuestions.length === 0) {
          showView('home');
        } else {
          showView(view);
        }
      });
    });

    // Level cards
    elements.levelCards.forEach(card => {
      card.addEventListener('click', () => {
        const level = parseInt(card.dataset.level);
        showTopicModal(level);
      });
    });

    // Start mixed quiz
    elements.startMixedQuiz.addEventListener('click', () => {
      startQuiz();
    });

    // Answer options (event delegation)
    elements.answerOptions.addEventListener('click', (e) => {
      const option = e.target.closest('.answer-option');
      if (option && !option.disabled) {
        const index = parseInt(option.dataset.index);
        selectAnswer(index);
      }
    });

    // Navigation buttons
    elements.btnPrevious.addEventListener('click', previousQuestion);
    elements.btnNext.addEventListener('click', nextQuestion);
    elements.btnFinish.addEventListener('click', finishQuiz);

    // Question dots (event delegation)
    elements.questionDots.addEventListener('click', (e) => {
      const dot = e.target.closest('.question-dot');
      if (dot) {
        const index = parseInt(dot.dataset.index);
        goToQuestion(index);
      }
    });

    // Topic modal
    elements.closeTopicModal.addEventListener('click', hideTopicModal);
    elements.topicModalBackdrop.addEventListener('click', (e) => {
      if (e.target === elements.topicModalBackdrop) {
        hideTopicModal();
      }
    });
    elements.selectAllTopics.addEventListener('click', selectAllTopics);
    elements.startTopicQuiz.addEventListener('click', () => {
      const topics = getSelectedTopics();
      if (topics.length === 0) {
        alert('Please select at least one topic.');
        return;
      }
      hideTopicModal();
      startQuiz(state.currentLevel, topics);
    });

    // Results actions
    elements.btnReviewAnswers.addEventListener('click', () => {
      state.isReviewMode = true;
      state.currentQuestionIndex = 0;
      renderQuestion();
      showView('quiz');
    });
    elements.btnRetake.addEventListener('click', () => {
      startQuiz(state.currentLevel, state.selectedTopics);
    });
    elements.btnNewQuiz.addEventListener('click', () => {
      showView('home');
    });

    // Question review list (event delegation)
    elements.questionReviewList.addEventListener('click', (e) => {
      const item = e.target.closest('.question-review-item');
      if (item) {
        const index = parseInt(item.dataset.index);
        state.isReviewMode = true;
        goToQuestion(index);
        showView('quiz');
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (elements.quizView.classList.contains('hidden')) return;

      switch (e.key) {
        case 'ArrowLeft':
          previousQuestion();
          break;
        case 'ArrowRight':
          nextQuestion();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          const index = parseInt(e.key) - 1;
          selectAnswer(index);
          break;
      }
    });
  }

  // ============================================================================
  // Initialization
  // ============================================================================

  async function init() {
    try {
      const data = await loadQuestions();
      if (!data) {
        // If loading failed, still initialize UI but show error
        console.warn('Questions failed to load, but continuing with UI initialization');
      }
      initEventListeners();
      showView('home');
    } catch (error) {
      console.error('Initialization error:', error);
      showError('Failed to initialize application. Please refresh the page.');
    }
  }

  // Start the application
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
