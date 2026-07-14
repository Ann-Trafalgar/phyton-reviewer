<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="An 99-question Python knowledge challenge based on the supplied study materials.">
  <title>PyQuest - 99 Question Challenge</title><link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <div class="ambient ambient-one"></div><div class="ambient ambient-two"></div>
  <header class="topbar"><a class="brand" href="#" aria-label="PyQuest home"><span class="brand-mark">P</span><span>PyQuest</span></a><div class="top-actions"><span class="source-pill">99 programming questions</span><button class="icon-button" id="themeButton" type="button" aria-label="Toggle dark mode">☾</button><button class="icon-button" id="soundButton" type="button" aria-label="Toggle sound">♪</button></div></header>
  <main>
    <section class="screen welcome-screen active" id="welcomeScreen">
      <div class="hero-copy"><span class="eyebrow">INTRODUCTION TO PROGRAMMING USING PYTHON</span><h1>Ready to put your<br><span>Python knowledge</span> to the test?</h1><p>Work through all 99 questions from your study materials. Build answer sequences, get instant feedback, and track your best run.</p><label class="shuffle-option"><input id="shuffleToggle" type="checkbox"><span class="toggle-track"><i></i></span><span><strong>Shuffle mode</strong><small>Randomize questions and answer-button positions</small></span></label><label class="shuffle-option pause-option"><input id="pauseWrongToggle" type="checkbox" checked><span class="toggle-track"><i></i></span><span><strong>Pause after wrong answers</strong><small>Continue only when you are ready</small></span></label><div class="hero-actions"><button class="primary-button" id="startButton" type="button">Start all 99 <span>→</span></button><button class="secondary-button" id="newQuestionsButton" type="button">New Questions</button><button class="secondary-button" id="resumeButton" type="button" hidden>Resume run</button></div><div class="stats-strip"><div><strong>99</strong><span>Questions</span></div><div><strong id="bestScore">—</strong><span>Best score</span></div><div><strong>4</strong><span>Answer formats</span></div></div></div>
      <div class="hero-card" aria-hidden="true"><div class="floating-chip chip-one">if / else</div><div class="floating-chip chip-two">[ ]</div><div class="mock-card"><div class="mock-head"><span>QUESTION 01</span><span class="mock-timer">00:30</span></div><pre>Evaluate the following Python
arithmetic expression:

(3*(1+2)**2 - (2**2)*3)</pre><div class="mock-options"><span>A</span><span>B</span><span class="selected">C</span><span>D</span></div><div class="mock-progress"><i></i></div></div></div>
    </section>
    <section class="screen quiz-screen" id="quizScreen">
      <div class="quiz-topline"><div><span class="mini-label">PYTHON CHALLENGE</span><strong id="questionCounter">Question 1 of 99</strong></div><div class="timer" id="timer">00:00</div></div><div class="progress-track"><span id="progressBar"></span></div>
      <div class="quiz-layout"><article class="question-card"><div class="question-meta"><span id="questionBadge">QUESTION 01</span><button id="flagButton" type="button">☆ Flag</button></div><pre id="questionText"></pre></article>
        <aside class="answer-panel"><span class="mini-label">BUILD YOUR ANSWER</span><h2 id="answerTitle">Select one answer</h2><p id="answerHint">Choose the best answer below.</p><div class="answer-display" id="answerDisplay" aria-live="polite"><span>Choose below</span></div><div class="letter-grid" id="letterGrid"></div><div class="edit-row"><button id="undoButton" type="button">Undo</button><button id="clearButton" type="button">Clear</button></div><button class="submit-button" id="submitButton" type="button" disabled>Check answer</button><div class="feedback" id="feedback" role="status"></div><button class="next-button" id="nextButton" type="button" hidden>Next question →</button></aside></div>
        <aside class="picker-panel"><span class="mini-label">JUMP TO QUESTION</span><div class="picker-legend"><span><i class="dot dot-current"></i>Current</span><span><i class="dot dot-correct"></i>Correct</span><span><i class="dot dot-wrong"></i>Review</span><span><i class="dot dot-flag"></i>Flagged</span></div><div class="picker-grid" id="pickerGrid"></div></aside>
      <nav class="quiz-nav"><button id="exitButton" type="button">← Save & exit</button><span id="answeredCount">0 answered</span></nav>
    </section>
    <section class="screen results-screen" id="resultsScreen"><div class="results-card"><span class="eyebrow">CHALLENGE COMPLETE</span><h1>That was a serious<br>Python workout.</h1><div class="score-ring"><strong id="finalPercent">0%</strong><span id="finalScore">0 / 0 points</span></div><div class="result-stats"><div><strong id="correctStat">0</strong><span>Points</span></div><div><strong id="wrongStat">0</strong><span>Review</span></div><div><strong id="timeStat">00:00</strong><span>Total time</span></div></div><div class="results-actions"><button class="primary-button" id="retryButton" type="button">Try again</button><button class="secondary-button" id="reviewButton" type="button">Review missed</button></div></div></section>
  </main>
  <script src="data/questions.js"></script><script src="assets/app.js"></script>
</body>
</html>
