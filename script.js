// 定义难度级别
const difficulties = {
    easy: { min: 1, max: 10, operations: ['+', '-'] },
    medium: { min: 10, max: 50, operations: ['+', '-', '*'] },
    hard: { min: 50, max: 100, operations: ['+', '-', '*', '/'] }
};

// DOM元素
const startBtn = document.getElementById('start-btn');
const submitBtn = document.getElementById('submit-btn');
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const starsEl = document.getElementById('stars');
const difficultySelect = document.getElementById('difficulty');
const questionArea = document.querySelector('.question-area');
const wrongQuestionsBtn = document.getElementById('wrong-questions-btn');
const historyBtn = document.getElementById('history-btn');
const wrongQuestionsModal = document.getElementById('wrong-questions-modal');
const historyModal = document.getElementById('history-modal');
const wrongQuestionsList = document.getElementById('wrong-questions-list');
const historyList = document.getElementById('history-list');
const closeButtons = document.querySelectorAll('.close');

// 游戏状态
let currentQuestion = null;
let score = 0;
let time = 0;
let stars = parseInt(localStorage.getItem('stars')) || 0;
let timer = null;

// 初始化
starsEl.textContent = stars;

// 生成随机题目
function generateQuestion() {
    const difficulty = difficulties[difficultySelect.value];
    const num1 = Math.floor(Math.random() * (difficulty.max - difficulty.min + 1)) + difficulty.min;
    const num2 = Math.floor(Math.random() * (difficulty.max - difficulty.min + 1)) + difficulty.min;
    const operation = difficulty.operations[Math.floor(Math.random() * difficulty.operations.length)];
    
    let question = `${num1} ${operation} ${num2}`;
    let answer;
    
    switch(operation) {
        case '+': answer = num1 + num2; break;
        case '-': answer = num1 - num2; break;
        case '*': answer = num1 * num2; break;
        case '/': 
            // 确保除法结果是整数
            question = `${num1 * num2} / ${num1}`;
            answer = num2;
            break;
    }
    
    return { question, answer };
}

// 开始游戏
function startGame() {
    score = 0;
    time = 0;
    scoreEl.textContent = score;
    timeEl.textContent = time;
    questionArea.classList.remove('hidden');
    startBtn.textContent = '重新开始';
    
    // 开始计时
    timer = setInterval(() => {
        time++;
        timeEl.textContent = time;
    }, 1000);
    
    nextQuestion();
}

// 下一题
function nextQuestion() {
    currentQuestion = generateQuestion();
    questionEl.textContent = currentQuestion.question + ' = ?';
    answerEl.value = '';
    feedbackEl.textContent = '';
    answerEl.focus();
}

// 检查答案
function checkAnswer() {
    const userAnswer = parseInt(answerEl.value);
    if (isNaN(userAnswer)) {
        feedbackEl.textContent = '请输入有效的数字!';
        return;
    }
    
    const isCorrect = userAnswer === currentQuestion.answer;
    if (isCorrect) {
        score++;
        stars++;
        starsEl.textContent = stars;
        localStorage.setItem('stars', stars);
        feedbackEl.textContent = '正确!';
        feedbackEl.className = 'correct';
    } else {
        // 记录错题
        const wrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions')) || [];
        wrongQuestions.push({
            question: currentQuestion.question,
            userAnswer,
            correctAnswer: currentQuestion.answer,
            timestamp: new Date().toLocaleString()
        });
        localStorage.setItem('wrongQuestions', JSON.stringify(wrongQuestions));
        
        feedbackEl.textContent = `错误! 正确答案是 ${currentQuestion.answer}`;
        feedbackEl.className = 'wrong';
    }
    
    // 记录历史
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.push({
        score,
        time,
        isCorrect,
        question: currentQuestion.question,
        answer: currentQuestion.answer,
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('history', JSON.stringify(history));
    
    setTimeout(nextQuestion, 1500);
}

// 显示错题本
function showWrongQuestions() {
    const wrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions')) || [];
    wrongQuestionsList.innerHTML = wrongQuestions.length ? 
        wrongQuestions.map(q => `
            <div class="wrong-item">
                <div>题目: ${q.question} = ?</div>
                <div>你的答案: ${q.userAnswer}</div>
                <div>正确答案: ${q.correctAnswer}</div>
                <div>时间: ${q.timestamp}</div>
            </div>
        `).join('') : 
        '<p>还没有错题记录</p>';
    wrongQuestionsModal.classList.remove('hidden');
}

// 显示历史记录
function showHistory() {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    historyList.innerHTML = history.length ? 
        history.map(h => `
            <div class="history-item">
                <div>得分: ${h.score} | 用时: ${h.time}秒</div>
                <div>题目: ${h.question} = ${h.answer}</div>
                <div>结果: ${h.isCorrect ? '正确' : '错误'}</div>
                <div>时间: ${h.timestamp}</div>
            </div>
        `).join('') : 
        '<p>还没有练习记录</p>';
    historyModal.classList.remove('hidden');
}

// 关闭弹窗
function closeModal() {
    wrongQuestionsModal.classList.add('hidden');
    historyModal.classList.add('hidden');
}

// 事件监听
startBtn.addEventListener('click', startGame);
submitBtn.addEventListener('click', checkAnswer);
answerEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});
wrongQuestionsBtn.addEventListener('click', showWrongQuestions);
historyBtn.addEventListener('click', showHistory);
closeButtons.forEach(btn => btn.addEventListener('click', closeModal));

// 点击弹窗外部关闭
window.addEventListener('click', (e) => {
    if (e.target === wrongQuestionsModal || e.target === historyModal) {
        closeModal();
    }
});
