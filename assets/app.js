(() => {
  const questions = window.QUIZ_DATA || [], $ = id => document.getElementById(id);
  const screens = ['welcomeScreen','quizScreen','resultsScreen'], letters = ['A','B','C','D','E','F','G','H','Y','N'];
  let state = freshState(), selected = [], tick;
  function freshState(){return {index:0,correct:0,answered:[],elapsed:0,flags:[]}}
  function show(id){screens.forEach(x=>$(x).classList.toggle('active',x===id));window.scrollTo({top:0,behavior:'smooth'})}
  function formatTime(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
  function persist(){localStorage.setItem('pyquest-progress',JSON.stringify(state))}
  function restore(){try{return JSON.parse(localStorage.getItem('pyquest-progress'))}catch(e){return null}}
  function startTimer(){clearInterval(tick);tick=setInterval(()=>{state.elapsed++;$('timer').textContent=formatTime(state.elapsed);if(state.elapsed%5===0)persist()},1000)}
  function tone(ok){if(localStorage.getItem('pyquest-muted')==='1')return;try{const a=new AudioContext(),o=a.createOscillator(),g=a.createGain();o.frequency.value=ok?620:180;g.gain.value=.035;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.09)}catch(e){}}
  function begin(resume){if(!resume){state=freshState();persist()}show('quizScreen');startTimer();renderQuestion()}
  function renderQuestion(){
    const q=questions[state.index];selected=[];
    $('questionCounter').textContent='Question '+(state.index+1)+' of '+questions.length;
    $('questionBadge').textContent='QUESTION '+String(q.number).padStart(2,'0');$('questionText').textContent=q.text;
    $('progressBar').style.width=(state.index/questions.length*100)+'%';$('timer').textContent=formatTime(state.elapsed);$('answeredCount').textContent=state.answered.length+' answered';
    $('flagButton').classList.toggle('flagged',state.flags.includes(q.number));$('flagButton').textContent=state.flags.includes(q.number)?'★ Flagged':'☆ Flag';
    $('feedback').className='feedback';$('feedback').textContent='';$('nextButton').hidden=true;$('submitButton').hidden=false;setLocked(false);drawAnswer();
  }
  function drawAnswer(){
    $('answerDisplay').replaceChildren();
    if(!selected.length){const span=document.createElement('span');span.textContent='Choose below';$('answerDisplay').appendChild(span)}
    selected.forEach(x=>{const b=document.createElement('b');b.className='answer-token';b.textContent=x;$('answerDisplay').appendChild(b)});
    $('submitButton').disabled=!selected.length;
  }
  function setLocked(locked){document.querySelectorAll('#letterGrid button,#undoButton,#clearButton').forEach(b=>b.disabled=locked)}
  function submit(){
    const q=questions[state.index],answer=selected.join(''),ok=answer===q.answer;
    if(ok)state.correct++;state.answered.push({number:q.number,response:answer,answer:q.answer,correct:ok});persist();tone(ok);setLocked(true);$('submitButton').hidden=true;
    $('feedback').className='feedback show '+(ok?'good':'bad');$('feedback').textContent=ok?'Correct — nicely done.':'Not quite. The original answer key gives: '+q.answer;
    $('nextButton').hidden=false;$('nextButton').textContent=state.index===questions.length-1?'See results →':'Next question →';
  }
  function next(){if(state.index<questions.length-1){state.index++;persist();renderQuestion()}else finish()}
  function finish(){
    clearInterval(tick);localStorage.removeItem('pyquest-progress');const total=state.answered.length,percent=total?Math.round(state.correct/total*100):0,best=Math.max(Number(localStorage.getItem('pyquest-best')||0),percent);
    localStorage.setItem('pyquest-best',best);$('finalPercent').textContent=percent+'%';$('finalScore').textContent=state.correct+' / '+total+' correct';$('correctStat').textContent=state.correct;$('wrongStat').textContent=total-state.correct;$('timeStat').textContent=formatTime(state.elapsed);document.querySelector('.score-ring').style.setProperty('--score',percent+'%');show('resultsScreen');
  }
  letters.forEach(letter=>{const b=document.createElement('button');b.type='button';b.textContent=letter;b.setAttribute('aria-label','Add '+letter);b.onclick=()=>{selected.push(letter);drawAnswer()};$('letterGrid').appendChild(b)});
  $('startButton').onclick=()=>begin(false);$('resumeButton').onclick=()=>begin(true);$('submitButton').onclick=submit;$('nextButton').onclick=next;
  $('undoButton').onclick=()=>{selected.pop();drawAnswer()};$('clearButton').onclick=()=>{selected=[];drawAnswer()};
  $('flagButton').onclick=()=>{const n=questions[state.index].number;state.flags=state.flags.includes(n)?state.flags.filter(x=>x!==n):state.flags.concat(n);persist();renderQuestion()};
  $('exitButton').onclick=()=>{persist();clearInterval(tick);show('welcomeScreen');$('resumeButton').hidden=false};$('retryButton').onclick=()=>begin(false);
  $('reviewButton').onclick=()=>{const missed=state.answered.filter(x=>!x.correct);alert(missed.length?'You missed questions: '+missed.map(x=>x.number).join(', ')+'.':'No missed questions to review.')};
  $('soundButton').onclick=()=>{const muted=localStorage.getItem('pyquest-muted')==='1';localStorage.setItem('pyquest-muted',muted?'0':'1');$('soundButton').textContent=muted?'♪':'×'};
  const saved=restore();if(saved&&saved.answered&&saved.answered.length<questions.length){state=saved;$('resumeButton').hidden=false}const best=localStorage.getItem('pyquest-best');$('bestScore').textContent=best?best+'%':'—';
})();
