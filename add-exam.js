const API_URL='https://script.google.com/macros/s/AKfycbzG8ts6SLQiPYbsFqkEBjK9X_hRLdixMoGBIY6ucybGVcQpR14BGhXB73K9vhtftSkhiQ/exec';
let choiceCounter=0;
let tfCounter=0;
let completeCounter=0;
let mixedCounter=0;
let extractCounter=0;
function cleanText(value){return String(value||'').trim().replace(/[()]/g,'')}
function safeText(value){return cleanText(value).replace(/\//g,'-').replace(/_/g,'-')}
function createOptionHTML(number){return `<div class="option"><input class="choice-option" placeholder="اختيار ${number}"><select class="correct-answer"><option value="">ليست الصحيحة</option><option value="yes">صحيحة</option></select></div>`}
function addChoiceQuestion(){
choiceCounter++;
const div=document.createElement('div');
div.className='question';
div.innerHTML=`<div class="question-title">سؤال اختيار من متعدد ${choiceCounter}</div><label>السؤال</label><input class="choice-question" placeholder="مثال: من عاصمة مصر؟"><label>الاختيارات</label><div class="options">${createOptionHTML(1)}${createOptionHTML(2)}${createOptionHTML(3)}</div><button type="button" class="add" onclick="addChoiceOption(this)">＋ إضافة اختيار</button><button type="button" class="delete" onclick="this.closest('.question').remove()">حذف السؤال</button>`;
document.getElementById('choiceQuestions').appendChild(div);
div.addEventListener('change',function(event){
if(event.target.classList.contains('correct-answer')&&event.target.value==='yes'){
div.querySelectorAll('.correct-answer').forEach(function(select){if(select!==event.target)select.value=''});
}
});
}
function addChoiceOption(button){
const question=button.closest('.question');
const options=question.querySelector('.options');
const number=options.querySelectorAll('.option').length+1;
const div=document.createElement('div');
div.className='option';
div.innerHTML=createOptionHTML(number);
options.appendChild(div);
}
function addTFQuestion(){
tfCounter++;
const div=document.createElement('div');
div.className='question';
div.innerHTML=`<div class="question-title">سؤال صح وخطأ ${tfCounter}</div><label>السؤال</label><input class="tf-question" placeholder="مثال: عاصمة مصر القاهرة"><label>الإجابة الصحيحة</label><select class="tf-answer"><option value="">اختر</option><option value="صح">صح</option><option value="خطأ">خطأ</option></select><button type="button" class="delete" onclick="this.closest('.question').remove()">حذف السؤال</button>`;
document.getElementById('tfQuestions').appendChild(div);
}
function addCompleteQuestion(){
completeCounter++;
const div=document.createElement('div');
div.className='question';
div.innerHTML=`<div class="question-title">سؤال أكمل ${completeCounter}</div><label>السؤال</label><input class="complete-question" placeholder="مثال: عاصمة مصر هي ........"><div class="small">لا توجد إجابة صحيحة مخزنة لهذا النوع، ويتم تصحيحه يدويًا.</div><button type="button" class="delete" onclick="this.closest('.question').remove()">حذف السؤال</button>`;
document.getElementById('completeQuestions').appendChild(div);
}
function addMixedQuestion(){
mixedCounter++;
const div=document.createElement('div');
div.className='question';
div.innerHTML=`<div class="question-title">مجموعة متنوعة ${mixedCounter}</div><label>نوع السؤال</label><input class="mixed-type" placeholder="مثال: ما النتائج المترتبة"><label>الأسئلة</label><textarea class="mixed-questions" placeholder="السؤال الأول&#10;السؤال الثاني&#10;السؤال الثالث"></textarea><div class="small">اكتب كل سؤال في سطر مستقل.</div><button type="button" class="delete" onclick="this.closest('.question').remove()">حذف المجموعة</button>`;
document.getElementById('mixedQuestions').appendChild(div);
}
function addExtractQuestion(){
extractCounter++;
const div=document.createElement('div');
div.className='question';
div.innerHTML=`<div class="question-title">فقرة استخراج ${extractCounter}</div><label>الفقرة</label><textarea class="extract-passage" placeholder="اكتب الفقرة هنا"></textarea><label>أسئلة الاستخراج</label><textarea class="extract-questions" placeholder="فاعل مرفوع&#10;مفعول به&#10;مبتدأ"></textarea><div class="small">اكتب كل سؤال في سطر مستقل.</div><button type="button" class="delete" onclick="this.closest('.question').remove()">حذف الفقرة</button>`;
document.getElementById('extractQuestions').appendChild(div);
}
function buildColumnC(){
const result=[];
document.querySelectorAll('#choiceQuestions .question').forEach(function(question){
const q=safeText(question.querySelector('.choice-question').value);
const options=Array.from(question.querySelectorAll('.choice-option')).map(input=>safeText(input.value)).filter(Boolean);
const correctSelect=Array.from(question.querySelectorAll('.correct-answer')).find(select=>select.value==='yes');
let correct='';
if(correctSelect){
const row=correctSelect.closest('.option');
const input=row.querySelector('.choice-option');
correct=safeText(input.value);
}
if(q&&options.length&&correct)result.push('('+q+'_'+options.join('-')+'/'+correct+')');
});
return result.join('');
}
function buildColumnD(){
const result=[];
document.querySelectorAll('#tfQuestions .question').forEach(function(question){
const q=safeText(question.querySelector('.tf-question').value);
const answer=question.querySelector('.tf-answer').value;
if(q&&answer)result.push('('+q+'/'+answer+')');
});
return result.join('');
}
function buildColumnE(){
const result=[];
document.querySelectorAll('#completeQuestions .question').forEach(function(question){
const q=safeText(question.querySelector('.complete-question').value);
if(q)result.push('('+q+')');
});
return result.join('');
}
function buildColumnF(){
const result=[];
document.querySelectorAll('#mixedQuestions .question').forEach(function(question){
const type=safeText(question.querySelector('.mixed-type').value);
const questions=question.querySelector('.mixed-questions').value.split(/\r?\n/).map(x=>safeText(x)).filter(Boolean);
if(type&&questions.length)result.push('('+type+'_'+questions.join('-')+')');
});
return result.join('');
}
function buildColumnG(){
const result=[];
document.querySelectorAll('#extractQuestions .question').forEach(function(question){
const passage=safeText(question.querySelector('.extract-passage').value);
const questions=question.querySelector('.extract-questions').value.split(/\r?\n/).map(x=>safeText(x)).filter(Boolean);
if(passage&&questions.length)result.push('('+passage+')'+'('+questions.join('-')+')');
});
return result.join('');
}
async function saveExam(){
const teacher=document.getElementById('teacher').value.trim();
const subject=document.getElementById('subject').value.trim();
const duration=document.getElementById('duration').value.trim();
const title=document.getElementById('title').value.trim();
if(!teacher){showStatus('اكتب اسم المعلم.',false);return}
if(!subject){showStatus('اكتب المادة.',false);return}
if(!duration){showStatus('اكتب المدة الزمنية.',false);return}
if(!title){showStatus('اكتب عنوان الاختبار.',false);return}
const data={C:buildColumnC(),D:buildColumnD(),E:buildColumnE(),F:buildColumnF(),G:buildColumnG()};
if(!data.C&&!data.D&&!data.E&&!data.F&&!data.G){showStatus('لم تتم إضافة أي سؤال.',false);return}
const button=document.getElementById('saveButton');
button.disabled=true;
button.textContent='⏳ جاري الحفظ...';
try{
const response=await fetch(API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'saveExam',teacher:teacher,subject:subject,duration:duration,title:title,data:data})});
const responseText=await response.text();
let result;
try{
result=JSON.parse(responseText);
}catch(error){
console.log('رد Google Apps Script:',responseText);
throw new Error('تم حفظ الاختبار لكن تعذر قراءة نتيجة Google Apps Script.');
}
if(!result.success)throw new Error(result.message||'فشل حفظ الاختبار.');
document.getElementById('examNumber').value=result.examNumber||'';
document.getElementById('resultExamNumber').textContent=result.examNumber||'';
document.getElementById('result').style.display='block';
showStatus(result.message||'تم إضافة الاختبار بنجاح. رقم الاختبار: '+result.examNumber,true);
button.disabled=true;
button.textContent='✅ تم حفظ الاختبار';
}catch(error){
showStatus(error.message||'حدث خطأ أثناء الحفظ.',false);
button.disabled=false;
button.textContent='💾 حفظ الاختبار';
}
}
function showStatus(message,success){
const box=document.getElementById('status');
box.className='status '+(success?'success':'error');
box.textContent=message;
box.style.display='block';
box.scrollIntoView({behavior:'smooth',block:'center'});
}