(() => {
  const baseQuestions = window.QUIZ_DATA || [], $ = id => document.getElementById(id);
  let questions = baseQuestions.slice();
  const screens = ['welcomeScreen','quizScreen','resultsScreen'], letters = ['A','B','C','D','E','F','G','H','Y','N'];
  let state = freshState(), selected = [], tick, transitionTimer, countdownTimer, transitioning = false;
  function freshState(){return {index:0,correct:0,answered:[],elapsed:0,flags:[],shuffle:false,pauseWrong:true,mode:'full',order:baseQuestions.map(q=>q.number)}}
  function shuffled(items){const copy=items.slice();for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy}
  function applyOrder(){const byNumber=new Map(baseQuestions.map(q=>[q.number,q]));questions=(state.order||baseQuestions.map(q=>q.number)).map(n=>byNumber.get(n)).filter(Boolean)}
  function show(id){screens.forEach(x=>$(x).classList.toggle('active',x===id));window.scrollTo({top:0,behavior:'smooth'})}
  function formatTime(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
  function persist(){localStorage.setItem('pyquest-progress',JSON.stringify(state))}
  function restore(){try{return JSON.parse(localStorage.getItem('pyquest-progress'))}catch(e){return null}}
  function startTimer(){clearInterval(tick);tick=setInterval(()=>{state.elapsed++;$('timer').textContent=formatTime(state.elapsed);if(state.elapsed%5===0)persist()},1000)}
  function tone(ok){if(localStorage.getItem('pyquest-muted')==='1')return;try{const a=new AudioContext(),o=a.createOscillator(),g=a.createGain();o.frequency.value=ok?620:180;g.gain.value=.035;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.09)}catch(e){}}
  function begin(resume){if(!resume){state=freshState();state.shuffle=$('shuffleToggle').checked;state.pauseWrong=$('pauseWrongToggle').checked;if(state.shuffle)state.order=shuffled(state.order);persist()}applyOrder();show('quizScreen');startTimer();renderQuestion()}
  function renderQuestion(){
    clearTimeout(transitionTimer);clearInterval(countdownTimer);transitioning=false;
    const q=questions[state.index];selected=[];
    renderLetterButtons();
    $('questionCounter').textContent='Question '+(state.index+1)+' of '+questions.length;
    $('questionBadge').textContent='QUESTION '+String(q.number).padStart(2,'0');$('questionText').textContent=q.text;
    $('progressBar').style.width=(state.index/questions.length*100)+'%';$('timer').textContent=formatTime(state.elapsed);$('answeredCount').textContent=state.answered.length+' answered';
    $('flagButton').classList.toggle('flagged',state.flags.includes(q.number));$('flagButton').textContent=state.flags.includes(q.number)?'★ Flagged':'☆ Flag';
    const slots=q.answer.length;
    $('answerTitle').textContent=slots===1?'Select one answer':'Build a '+slots+'-part answer';
    $('answerHint').textContent=slots===1?'Choose the best answer below.':'Select '+slots+' letters in the correct order.';
    $('feedback').className='feedback';$('feedback').textContent='';$('nextButton').hidden=true;$('submitButton').hidden=false;setLocked(false);drawAnswer();
  }
  function drawAnswer(){
    $('answerDisplay').replaceChildren();
    if(!selected.length){const span=document.createElement('span');span.textContent='Choose below';$('answerDisplay').appendChild(span)}
    selected.forEach(x=>{const b=document.createElement('b');b.className='answer-token';b.textContent=x;$('answerDisplay').appendChild(b)});
    $('submitButton').disabled=selected.length!==questions[state.index].answer.length;
  }
  function setLocked(locked){document.querySelectorAll('#letterGrid button,#undoButton,#clearButton').forEach(b=>b.disabled=locked)}
  function selectLetter(letter){
    const limit=questions[state.index].answer.length;
    if(limit===1)selected=[letter];
    else if(selected.length<limit)selected.push(letter);
    drawAnswer();
  }
  function renderLetterButtons(){
    $('letterGrid').replaceChildren();
    const buttonLetters=state.shuffle?shuffled(letters):letters;
    buttonLetters.forEach(letter=>{const b=document.createElement('button');b.type='button';b.textContent=letter;b.setAttribute('aria-label','Select '+letter);b.onclick=()=>selectLetter(letter);$('letterGrid').appendChild(b)});
  }
  function submit(){
    const q=questions[state.index],answer=selected.join(''),ok=answer===q.answer;
    if(transitioning)return;transitioning=true;
    if(ok)state.correct++;state.answered.push({number:q.number,response:answer,answer:q.answer,correct:ok});persist();tone(ok);setLocked(true);$('submitButton').hidden=true;
    $('feedback').className='feedback show '+(ok?'good':'bad');
    const message=ok?'Correct — nicely done.':'Not quite. The original answer key gives: '+q.answer;
    if(!ok&&state.pauseWrong){
      $('feedback').textContent=message+' Take your time and review the answer above.';
      $('nextButton').hidden=false;$('nextButton').textContent=state.index===questions.length-1?'See results →':'Continue when ready →';
      return;
    }
    let remaining=3;
    const updateFeedback=()=>{$('feedback').textContent=message+' Next question in '+remaining+'…'};
    updateFeedback();
    countdownTimer=setInterval(()=>{remaining--;if(remaining>0)updateFeedback();else clearInterval(countdownTimer)},1000);
    transitionTimer=setTimeout(next,3000);
  }
  function next(){if(state.index<questions.length-1){state.index++;persist();renderQuestion()}else finish()}
  function finish(){
    clearInterval(tick);localStorage.removeItem('pyquest-progress');const total=state.answered.length,percent=total?Math.round(state.correct/total*100):0,wrong=state.answered.filter(x=>!x.correct);
    if(state.mode==='full'){const best=Math.max(Number(localStorage.getItem('pyquest-best')||0),percent);localStorage.setItem('pyquest-best',best)}
    $('finalPercent').textContent=percent+'%';$('finalScore').textContent=state.correct+' / '+total+' correct';$('correctStat').textContent=state.correct;$('wrongStat').textContent=wrong.length;$('timeStat').textContent=formatTime(state.elapsed);document.querySelector('.score-ring').style.setProperty('--score',percent+'%');
    $('reviewButton').hidden=!wrong.length;$('reviewButton').textContent=wrong.length?'Retest '+wrong.length+' wrong question'+(wrong.length===1?'':'s'):'No wrong questions';
    show('resultsScreen');
  }
  function retestWrong(){
    const wrongNumbers=state.answered.filter(x=>!x.correct).map(x=>x.number);
    if(!wrongNumbers.length)return;
    const shuffle=state.shuffle,pauseWrong=state.pauseWrong;
    state=freshState();state.mode='review';state.shuffle=shuffle;state.pauseWrong=pauseWrong;state.order=shuffle?shuffled(wrongNumbers):wrongNumbers;
    persist();applyOrder();show('quizScreen');startTimer();renderQuestion();
  }
  $('startButton').onclick=()=>begin(false);$('resumeButton').onclick=()=>begin(true);$('submitButton').onclick=submit;$('nextButton').onclick=next;
  $('undoButton').onclick=()=>{selected.pop();drawAnswer()};$('clearButton').onclick=()=>{selected=[];drawAnswer()};
  $('flagButton').onclick=()=>{const n=questions[state.index].number;state.flags=state.flags.includes(n)?state.flags.filter(x=>x!==n):state.flags.concat(n);persist();$('flagButton').classList.toggle('flagged',state.flags.includes(n));$('flagButton').textContent=state.flags.includes(n)?'★ Flagged':'☆ Flag'};
  $('exitButton').onclick=()=>{if(transitioning)return;persist();clearInterval(tick);show('welcomeScreen');$('resumeButton').hidden=false};$('retryButton').onclick=()=>begin(false);
  $('reviewButton').onclick=retestWrong;
  $('soundButton').onclick=()=>{const muted=localStorage.getItem('pyquest-muted')==='1';localStorage.setItem('pyquest-muted',muted?'0':'1');$('soundButton').textContent=muted?'♪':'×'};
  function setTheme(theme){document.documentElement.dataset.theme=theme;localStorage.setItem('pyquest-theme',theme);$('themeButton').textContent=theme==='dark'?'☀':'☾';$('themeButton').setAttribute('aria-label',theme==='dark'?'Use light mode':'Use dark mode')}
  $('themeButton').onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
  setTheme(localStorage.getItem('pyquest-theme')||((window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'));
  const saved=restore();if(saved&&saved.answered&&saved.answered.length<(saved.order||baseQuestions).length){state=saved;if(state.pauseWrong===undefined)state.pauseWrong=true;applyOrder();$('resumeButton').hidden=false;$('shuffleToggle').checked=Boolean(state.shuffle);$('pauseWrongToggle').checked=state.pauseWrong!==false}const best=localStorage.getItem('pyquest-best');$('bestScore').textContent=best?best+'%':'—';
})();
