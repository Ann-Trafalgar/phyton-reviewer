(() => {
  const baseQuestions = window.QUIZ_DATA || [], $ = id => document.getElementById(id);
  const correctedQuestionText={
    57:`57. Question 57
You are developing a Python application for an online product distribution company.
You need the program to iterate through a list of products and escape when a target
product ID is found.
How should you complete the code? To answer, select the appropriate code segments in
the answer area.
NOTE: Each correct selection is worth one point.

Answer Area

productIdList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
index = 0
[1] . (index < 10):
    print(productIdList[index])
    if productIdList[index] == 6:
        [2] .
    else:
        [3] .

[1]
    A. while
    B. for
    C. if
    D. break

[2]
    A. while
    B. for
    C. if
    D. break

[3]
    A. continue
    B. break
    C. index += 1
    D. index = 1`};
  baseQuestions.forEach(question=>{if(correctedQuestionText[question.number])question.text=correctedQuestionText[question.number]});
  let questions = baseQuestions.slice();
  const screens = ['welcomeScreen','quizScreen','resultsScreen'], letters = ['A','B','C','D','E','F','G','H','Y','N'];
  let state = freshState(), selected = [], tick, transitionTimer, countdownTimer, transitioning = false;
  const oldShuffle=$('shuffleToggle'),shuffleLabel=oldShuffle.closest('.shuffle-option');
  shuffleLabel.classList.add('shuffle-mode-control');
  shuffleLabel.innerHTML='<span><strong>Shuffle mode</strong><small>Choose exactly what gets randomized</small></span><select id="shuffleMode" aria-label="Shuffle mode"><option value="off">Off</option><option value="questions">Questions only</option><option value="choices">Choices only</option><option value="both">Questions + choices</option></select>';
  const isDrag=q=>/drag\s+the\s+appropriate|move\s+(?:all|the\s+appropriate)|arrange\s+(?:all|the\s+code\s+segments|them)\s+in\s+the\s+correct\s+order/i.test(q.text);
  const isYesNo=q=>/select Yes if the statement is true/i.test(q.text);
  const isUnordered=q=>!isDrag(q)&&!isYesNo(q)&&/\b(?:choose|select)\s+(?:two|three|four)\b/i.test(q.text);
  function groupedChoices(q){
    return [...q.text.matchAll(/\n\[(\d+)\]\s*\n([\s\S]*?)(?=\n\[\d+\]\s*\n|$)/g)].map(group=>({
      number:group[1],
      options:[...group[2].matchAll(/(?:^|\n)\s*([A-H])\.\s+([\s\S]*?)(?=\n\s*[A-H]\.\s+|$)/g)].map(option=>({letter:option[1],text:option[2].trim()}))
    }));
  }
  const isDropdown=q=>!isDrag(q)&&!isYesNo(q)&&groupedChoices(q).length===q.answer.length&&q.answer.length>1;
  const codeIndentation={
    7:{'04 ':1,'07 ':2,'09 ':1,'10 ':1,'11 ':1},
    8:{'06 ':1,'07 ':2,'08 ':2,'09 ':1,'10 ':2,'11 ':2},
    15:{'02 ':1,'04 ':1,'05 ':1},
    23:{'02 ':1,'03 ':1},
    25:{'02 ':1,'03 ':1,'04 ':2,'05 ':2,'06 ':3},
    32:{'03 ':1,'05 ':1,'06 ':1,'07 ':2},
    34:{'print(p)':1},
    37:{'06 ':1,'07 ':1,'08 ':1,'09 ':1},
    39:{'02 ':1,'03 ':2,'04 ':1,'05 ':1},
    40:{'04 ':1,'06 ':1,'08 ':1,'10 ':1},
    46:{'02 ':1,'03 ':1,'04 ':2,'05 ':2},
    52:{'08 ':2,'10 ':2,'12 ':2},
    53:{'letter_grade = ‘F’':1},
    54:{'parts =':0,'[2] .':0,'[3] .':1,'employee_number = input':1,'parts = employee_number':1,'if len(parts) == 3:':1,'if len(parts[0])':2,'if parts[0].isdigit':3,'parts[2].isdigit':4,'[4] .':4,'print(valid)':1},
    55:{'answer = a**':1,'[2] .':1,'[3] .':1,'answer = “Result':2,'[4] .':1,'answer = -(-a)':2,'return answer':1},
    56:{'rating =':1,'if':1,'elif':1,'else':1,'return rating':1},
    57:{'print(product':1,'if product':1,'[3] .':1},
    58:{'count=0':1,'for':1,'[1] .':1,'if':2,'[2] .':2,'count += 1':3,'return count':1},
    60:{'days_rented +=1':1,'total = (days_rented * cost_per_day) * .7':1,'total = (days_rented * cost_per_day) * .5':1,'total = days_rented':1},
    61:{'[2] .':1,'current += value':1,'[3] .':1},
    62:{'average = 0.0':0,'rating =':1,'[1] .':2,'if rating':1,'break':2,'sum+=':1,'count+=':1,'average = float':1},
    63:{'score = int':1,'if score':1,'break':2,'sum += score':1,'count += 1':1},
    64:{'count += 1':1,'sum += employee':1},
    65:{'[1] .':1,'x = int':2,'break':2,'[2] .':1,'print(”Not':2},
    66:{'forward_name =':1,'for index':1,'[1] .':2,'forward_name +=':2,'[2] .':3,'return forward_name':1},
    67:{'[1] .':1,'print(“A required':2,'[2] .':1,'print(”The denominator':2,'else:':1,'return numerator':2},
    68:{'[1] .':1,'file = open':1,'[2] .':1,'file.close':1},
    69:{'digits = “1”':1,'digits = 2':1,'digits = “>2”':1},
    70:{'[1] .':1,'[2] .':2,'print( row*col':3,'print()':2},
    71:{'if salary':1,'[2] .':2,'salary_list[index] =':1},
    72:{'rate = 0':1,'[1] .':1,'rate = 10':2,'[2] .':1,'[3] .':1,'rate = 20':2,'else:':1,'rate = 50':2,'return rate':1},
    73:{'print(”The values':1,'print(“The values':1}
  };
  function indentCodeLines(q,text){
    const rules=codeIndentation[q.number];if(!rules)return text;
    let inChoices=false;
    return text.split('\n').map(line=>{
      if(/^\[1\]\s*$/.test(line))inChoices=true;
      if(inChoices)return line;
      const content=line.trimStart(),key=Object.keys(rules).sort((a,b)=>b.length-a.length).find(prefix=>content.startsWith(prefix));
      return key===undefined?line:'    '.repeat(rules[key])+content;
    }).join('\n');
  }
  function cleanQuestionText(q){
    let text=q.text.replace(new RegExp('^'+q.number+'\\.\\s*Question\\s*'+String(q.number).padStart(2,'0')+'\\s*\\n','i'),'');
    if(isDrag(q))text=text.split(/\n(?:Code Segments|Operations|Results|Data Types|Answer Area)\s*\n/i)[0].trimEnd();
    if(isDropdown(q))text=text.replace(/\n\[1\]\s*\n[\s\S]*$/,'').trimEnd();
    if(state.shuffleChoices&&!isDrag(q)&&!isDropdown(q)&&!isYesNo(q)){
      const choices=choiceSegments(q);
      if(choices.length){
        state.choiceOrders=state.choiceOrders||{};
        if(!state.choiceOrders[q.number])state.choiceOrders[q.number]=shuffled(choices.map(choice=>choice.letter));
        const byLetter=new Map(choices.map(choice=>[choice.letter,choice]));
        const formatted=choices.map((position,i)=>({label:position.letter,choice:byLetter.get(state.choiceOrders[q.number][i])})).filter(item=>item.choice).map(item=>'    '+item.label+'. '+item.choice.text.replace(/\n/g,'\n        ')).join('\n');
        text=text.split(/\nAnswer Area/i)[0].trimEnd()+'\n\nAnswer Area\n\n'+formatted;
      }
    }
    return indentCodeLines(q,text);
  }
  function choiceSegments(q){
    const source=q.text;
    return [...source.matchAll(/(?:^|\n)\s*(?:\[([A-H])\]|([A-H])\.)\s+([\s\S]*?)(?=\n\s*(?:(?:\[[A-H]\]|[A-H]\.)\s+|Answer Area(?:\s*\n|$))|$)/g)].map(m=>({letter:m[1]||m[2],text:m[3].trim()}));
  }
  function dragScaffold(q){return (q.text.split(/Answer Area/i).pop()||'').trim()}
  function freshState(){return {index:0,correct:0,answered:[],elapsed:0,flags:[],shuffleQuestions:false,shuffleChoices:false,choiceOrders:{},pauseWrong:true,mode:'full',order:baseQuestions.map(q=>q.number)}}
  function shuffled(items){const copy=items.slice();for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy}
  function applyOrder(){const byNumber=new Map(baseQuestions.map(q=>[q.number,q]));questions=(state.order||baseQuestions.map(q=>q.number)).map(n=>byNumber.get(n)).filter(Boolean)}
  function show(id){screens.forEach(x=>$(x).classList.toggle('active',x===id));window.scrollTo({top:0,behavior:'smooth'})}
  function formatTime(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
  function persist(){localStorage.setItem('pyquest-progress',JSON.stringify(state))}
  function restore(){try{return JSON.parse(localStorage.getItem('pyquest-progress'))}catch(e){return null}}
  function startTimer(){clearInterval(tick);tick=setInterval(()=>{state.elapsed++;$('timer').textContent=formatTime(state.elapsed);if(state.elapsed%5===0)persist()},1000)}
  function tone(ok){if(localStorage.getItem('pyquest-muted')==='1')return;try{const a=new AudioContext(),o=a.createOscillator(),g=a.createGain();o.frequency.value=ok?620:180;g.gain.value=.035;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.09)}catch(e){}}
  function begin(resume){if(!resume){state=freshState();const shuffleMode=$('shuffleMode').value;state.shuffleQuestions=shuffleMode==='questions'||shuffleMode==='both';state.shuffleChoices=shuffleMode==='choices'||shuffleMode==='both';state.pauseWrong=$('pauseWrongToggle').checked;if(state.shuffleQuestions)state.order=shuffled(state.order);persist()}applyOrder();show('quizScreen');startTimer();renderQuestion()}
  function renderQuestion(){
    clearTimeout(transitionTimer);clearInterval(countdownTimer);transitioning=false;
    const q=questions[state.index];selected=[];
    renderLetterButtons();
    $('questionCounter').textContent='Question '+(state.index+1)+' of '+questions.length;
    $('questionBadge').textContent='QUESTION '+String(q.number).padStart(2,'0');$('questionText').textContent=cleanQuestionText(q);
    $('progressBar').style.width=(state.index/questions.length*100)+'%';$('timer').textContent=formatTime(state.elapsed);$('answeredCount').textContent=state.answered.length+' answered';
    $('flagButton').classList.toggle('flagged',state.flags.includes(q.number));$('flagButton').textContent=state.flags.includes(q.number)?'★ Flagged':'☆ Flag';
    const slots=q.answer.length,drag=isDrag(q),yesNo=isYesNo(q),dropdown=isDropdown(q),unordered=isUnordered(q),panel=document.querySelector('.answer-panel');
    panel.classList.toggle('drag-mode',drag);panel.classList.toggle('yes-no-mode',yesNo);panel.classList.toggle('dropdown-mode',dropdown);
    $('answerTitle').textContent=drag?'Arrange the code':yesNo?'Choose Yes or No':dropdown?'Complete the code':slots===1?'Select one answer':unordered?'Choose '+slots+' answers':'Build a '+slots+'-part answer';
    $('answerHint').textContent=drag?'Drag each segment into the correct slot. You can also tap a segment.':yesNo?'Answer each statement below.':dropdown?'Choose the correct code for each numbered blank.':slots===1?'Choose the best answer below.':unordered?'Select '+slots+' answers. Order does not matter.':'Select '+slots+' letters in the correct order.';
    $('feedback').className='feedback';$('feedback').textContent='';$('nextButton').hidden=true;$('submitButton').hidden=false;setLocked(false);drawAnswer();
    renderPicker();
  }
  function jumpTo(idx){
    if(idx===state.index||transitioning)return;
    clearTimeout(transitionTimer);clearInterval(countdownTimer);transitioning=false;
    state.index=idx;persist();renderQuestion();
  }
  function renderPicker(){
    const grid=$('pickerGrid');if(!grid)return;
    grid.replaceChildren();
    questions.forEach((q,idx)=>{
      const b=document.createElement('button');b.type='button';b.textContent=q.number;
      b.setAttribute('aria-label','Go to question '+q.number);
      let cls='picker-btn';
      const record=state.answered.find(a=>a.number===q.number);
      if(record)cls+=recordIsCorrect(record)?' correct':' wrong';
      if(state.flags.includes(q.number))cls+=' flagged';
      if(idx===state.index)cls+=' current';
      b.className=cls;b.onclick=()=>jumpTo(idx);
      grid.appendChild(b);
    });
  }
  function drawAnswer(){
    const q=questions[state.index];
    if(isDrag(q)){drawDragAnswer(q);return}
    if(isYesNo(q)){drawYesNoAnswer(q);return}
    if(isDropdown(q)){drawDropdownAnswer(q);return}
    $('answerDisplay').replaceChildren();
    if(!selected.length){const span=document.createElement('span');span.textContent='Choose below';$('answerDisplay').appendChild(span)}
    selected.forEach(x=>{const b=document.createElement('b');b.className='answer-token';b.textContent=x;$('answerDisplay').appendChild(b)});
    $('submitButton').disabled=selected.length!==questions[state.index].answer.length;
  }
  function drawDragAnswer(q){
    const display=$('answerDisplay'),scaffold=dragScaffold(q),explicitSlots=[...scaffold.matchAll(/\[(\d+)\]\s*\./g)].length;display.replaceChildren();display.className='answer-display code-workspace';
    const addSlot=(parent,index)=>{const slot=document.createElement('span');slot.className='drop-slot'+(selected[index]?' filled':'');slot.dataset.index=index;slot.textContent=selected[index]?((choiceSegments(q).find(x=>x.letter===selected[index])||{}).text||selected[index]):'Drop code ['+(index+1)+']';slot.ondragover=e=>e.preventDefault();slot.ondrop=e=>{e.preventDefault();placeDrag(e.dataTransfer.getData('text/plain'),index)};slot.onclick=()=>{if(selected[index]){selected[index]='';drawAnswer()}};parent.appendChild(slot)};
    scaffold.split('\n').forEach(line=>{
      const range=line.match(/^\s*\[(\d+)-(\d+)\]\s*\.?\s*$/);
      if(range){for(let n=Number(range[1]);n<=Math.min(Number(range[2]),q.answer.length);n++){const row=document.createElement('div');row.className='code-line slot-line';addSlot(row,n-1);display.appendChild(row)}return}
      const row=document.createElement('div');row.className='code-line';let last=0;
      for(const match of line.matchAll(/\[(\d+)\]\s*\./g)){row.append(document.createTextNode(line.slice(last,match.index)));if(explicitSlots===1&&q.answer.length>1){for(let i=0;i<q.answer.length;i++)addSlot(row,i)}else addSlot(row,Number(match[1])-1);last=match.index+match[0].length}
      row.append(document.createTextNode(line.slice(last)));display.appendChild(row);
    });
    if(!display.querySelector('.drop-slot')){let row=display.lastElementChild;if(!row){row=document.createElement('div');row.className='code-line';display.appendChild(row)}if(row.lastChild&&row.lastChild.nodeType===3)row.lastChild.textContent=row.lastChild.textContent.replace(/\.\s*$/,'');for(let i=0;i<q.answer.length;i++)addSlot(row,i)}
    $('submitButton').disabled=selected.filter(Boolean).length!==q.answer.length;
  }
  function placeDrag(letter,index){
    if(!letter)return;
    if(index===undefined){const empty=Array.from({length:questions[state.index].answer.length},(_,i)=>i).find(i=>!selected[i]);if(empty!==undefined)selected[empty]=letter}else selected[index]=letter;
    drawAnswer();
  }
  function drawYesNoAnswer(q){
    const display=$('answerDisplay');display.replaceChildren();display.className='answer-display yes-no-summary';
    const span=document.createElement('span');span.textContent=selected.filter(Boolean).length+' of '+q.answer.length+' statements answered';display.appendChild(span);
    $('submitButton').disabled=selected.filter(Boolean).length!==q.answer.length;
  }
  function drawDropdownAnswer(q){
    const display=$('answerDisplay');display.replaceChildren();display.className='answer-display dropdown-summary';
    const span=document.createElement('span');span.textContent=selected.filter(Boolean).length+' of '+q.answer.length+' blanks completed';display.appendChild(span);
    $('submitButton').disabled=selected.filter(Boolean).length!==q.answer.length;
  }
  function dropdownCorrection(q){
    const groups=groupedChoices(q),lines=['Not quite. Check these dropdowns:'];
    q.answer.split('').forEach((correct,i)=>{
      if(selected[i]===correct)return;
      const group=groups[i],choice=group.options.find(option=>option.letter===correct);
      lines.push('Blank ['+group.number+']: '+(choice?choice.text:correct));
    });
    return lines.join('\n');
  }
  function dragCorrection(q){
    const byLetter=new Map(choiceSegments(q).map(segment=>[segment.letter,segment.text]));
    const correct=q.answer.split('').map((letter,index)=>{
      const segment=byLetter.get(letter)||letter;
      return (index+1)+'. '+segment;
    });
    return 'Not quite. The correct code segments are:\n'+correct.join('\n');
  }
  function effectiveAnswer(q){
    if(!state.shuffleChoices||isDrag(q)||isDropdown(q)||isYesNo(q))return q.answer;
    const choices=choiceSegments(q),order=(state.choiceOrders||{})[q.number];
    if(!choices.length||!order)return q.answer;
    const labels=choices.map(choice=>choice.letter);
    return q.answer.split('').map(original=>{const position=order.indexOf(original);return position>=0?labels[position]:original}).join('');
  }
  function correctPointCount(response,expected,unordered=false){
    if(unordered){
      const submitted=new Set(response.split(''));
      return [...new Set(expected.split(''))].reduce((points,correct)=>points+(submitted.has(correct)?1:0),0);
    }
    return expected.split('').reduce((points,correct,index)=>points+(response[index]===correct?1:0),0);
  }
  function recordQuestion(record){return baseQuestions.find(question=>question.number===record.number)}
  function recordPointCount(record){
    const question=recordQuestion(record);
    return correctPointCount(record.response||'',record.answer||'',Boolean(question&&isUnordered(question)));
  }
  function recordIsCorrect(record){return recordPointCount(record)===(record.answer||'').length}
  function setLocked(locked){document.querySelectorAll('#letterGrid button,#letterGrid select,#undoButton,#clearButton').forEach(b=>b.disabled=locked)}
  function selectLetter(letter){
    const question=questions[state.index],limit=question.answer.length;
    if(limit===1)selected=[letter];
    else if(isUnordered(question)&&selected.includes(letter))selected=selected.filter(item=>item!==letter);
    else if(selected.length<limit)selected.push(letter);
    if(isUnordered(question))renderLetterButtons();
    drawAnswer();
  }
  function renderLetterButtons(){
    $('letterGrid').replaceChildren();
    const q=questions[state.index];$('answerDisplay').className='answer-display';
    if(isDrag(q)){
      choiceSegments(q).forEach(item=>{const b=document.createElement('button');b.type='button';b.className='code-segment';b.draggable=true;b.textContent=item.text;b.ondragstart=e=>e.dataTransfer.setData('text/plain',item.letter);b.onclick=()=>placeDrag(item.letter);$('letterGrid').appendChild(b)});return;
    }
    if(isYesNo(q)){
      for(let i=0;i<q.answer.length;i++){const row=document.createElement('div');row.className='yes-no-row';const label=document.createElement('span');label.textContent='Statement '+(i+1);row.appendChild(label);[['Y','Yes'],['N','No']].forEach(([value,labelText])=>{const b=document.createElement('button');b.type='button';b.textContent=labelText;b.classList.toggle('selected',selected[i]===value);b.onclick=()=>{selected[i]=value;renderLetterButtons();drawAnswer()};row.appendChild(b)});$('letterGrid').appendChild(row)}return;
    }
    if(isDropdown(q)){
      groupedChoices(q).forEach((group,i)=>{const row=document.createElement('label');row.className='dropdown-row';const label=document.createElement('span');label.textContent='Blank ['+group.number+']';const select=document.createElement('select');select.setAttribute('aria-label','Choose code for blank '+group.number);select.innerHTML='<option value="">Choose code…</option>';group.options.forEach(item=>{const option=document.createElement('option');option.value=item.letter;option.textContent=item.text;option.selected=selected[i]===item.letter;select.appendChild(option)});select.onchange=()=>{selected[i]=select.value;drawAnswer()};row.append(label,select);$('letterGrid').appendChild(row)});return;
    }
    const availableLetters=choiceSegments(q).map(choice=>choice.letter),buttonLetters=availableLetters.length?availableLetters:letters;
    buttonLetters.forEach(letter=>{const b=document.createElement('button');b.type='button';b.textContent=letter;b.classList.toggle('selected',isUnordered(q)&&selected.includes(letter));b.setAttribute('aria-label','Select '+letter);b.onclick=()=>selectLetter(letter);$('letterGrid').appendChild(b)});
  }
  function submit(){
    const q=questions[state.index],answer=selected.join(''),expected=effectiveAnswer(q),unordered=isUnordered(q),points=correctPointCount(answer,expected,unordered),ok=points===expected.length;
    if(transitioning)return;transitioning=true;
    state.correct+=points;state.answered.push({number:q.number,response:answer,answer:expected,points:points,totalPoints:expected.length,correct:ok});persist();tone(ok);setLocked(true);$('submitButton').hidden=true;
    $('feedback').className='feedback show '+(ok?'good':'bad');
    const correction=isDropdown(q)?dropdownCorrection(q):isDrag(q)?dragCorrection(q):unordered?'Not quite. The correct answers are: '+expected.split('').join(' and '):'Not quite. The correct answer is: '+expected;
    const message=ok?'Correct — nicely done.':correction+(expected.length>1?'\nScore: '+points+' / '+expected.length+' points.':'');
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
    clearInterval(tick);localStorage.removeItem('pyquest-progress');
    const earnedPoints=state.answered.reduce((total,record)=>total+recordPointCount(record),0);
    const totalPoints=state.answered.reduce((total,record)=>total+(record.answer||'').length,0);
    const percent=totalPoints?Math.round(earnedPoints/totalPoints*100):0,wrong=state.answered.filter(record=>!recordIsCorrect(record));
    state.correct=earnedPoints;
    if(state.mode==='full'){const best=Math.max(Number(localStorage.getItem('pyquest-best')||0),percent);localStorage.setItem('pyquest-best',best)}
    $('finalPercent').textContent=percent+'%';$('finalScore').textContent=earnedPoints+' / '+totalPoints+' points';$('correctStat').textContent=earnedPoints;$('wrongStat').textContent=wrong.length;$('timeStat').textContent=formatTime(state.elapsed);document.querySelector('.score-ring').style.setProperty('--score',percent+'%');
    $('reviewButton').hidden=!wrong.length;$('reviewButton').textContent=wrong.length?'Retest '+wrong.length+' wrong question'+(wrong.length===1?'':'s'):'No wrong questions';
    show('resultsScreen');
  }
  function retestWrong(){
    const wrongNumbers=state.answered.filter(record=>!recordIsCorrect(record)).map(record=>record.number);
    if(!wrongNumbers.length)return;
    const shuffleQuestions=state.shuffleQuestions,shuffleChoices=state.shuffleChoices,pauseWrong=state.pauseWrong;
    state=freshState();state.mode='review';state.shuffleQuestions=shuffleQuestions;state.shuffleChoices=shuffleChoices;state.pauseWrong=pauseWrong;state.order=shuffleQuestions?shuffled(wrongNumbers):wrongNumbers;
    persist();applyOrder();show('quizScreen');startTimer();renderQuestion();
  }
  $('startButton').onclick=()=>begin(false);$('resumeButton').onclick=()=>begin(true);$('submitButton').onclick=submit;$('nextButton').onclick=next;
  $('undoButton').onclick=()=>{selected.pop();drawAnswer()};$('clearButton').onclick=()=>{selected=[];drawAnswer()};
  $('flagButton').onclick=()=>{const n=questions[state.index].number;state.flags=state.flags.includes(n)?state.flags.filter(x=>x!==n):state.flags.concat(n);persist();$('flagButton').classList.toggle('flagged',state.flags.includes(n));$('flagButton').textContent=state.flags.includes(n)?'★ Flagged':'☆ Flag';renderPicker()};
  $('exitButton').onclick=()=>{if(transitioning)return;persist();clearInterval(tick);show('welcomeScreen');$('resumeButton').hidden=false};$('retryButton').onclick=()=>begin(false);
  $('reviewButton').onclick=retestWrong;
  $('soundButton').onclick=()=>{const muted=localStorage.getItem('pyquest-muted')==='1';localStorage.setItem('pyquest-muted',muted?'0':'1');$('soundButton').textContent=muted?'♪':'×'};
  function setTheme(theme){document.documentElement.dataset.theme=theme;localStorage.setItem('pyquest-theme',theme);$('themeButton').textContent=theme==='dark'?'☀':'☾';$('themeButton').setAttribute('aria-label',theme==='dark'?'Use light mode':'Use dark mode')}
  $('themeButton').onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
  setTheme(localStorage.getItem('pyquest-theme')||((window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'));
  const saved=restore();if(saved&&saved.answered&&saved.answered.length<(saved.order||baseQuestions).length){state=saved;if(state.pauseWrong===undefined)state.pauseWrong=true;if(state.shuffleQuestions===undefined){state.shuffleQuestions=Boolean(state.shuffle);state.shuffleChoices=Boolean(state.shuffle)}applyOrder();$('resumeButton').hidden=false;$('shuffleMode').value=state.shuffleQuestions?(state.shuffleChoices?'both':'questions'):(state.shuffleChoices?'choices':'off');$('pauseWrongToggle').checked=state.pauseWrong!==false}const best=localStorage.getItem('pyquest-best');$('bestScore').textContent=best?best+'%':'—';
})();
