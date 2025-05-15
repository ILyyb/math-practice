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
const difficultySelect = document.getElementById('difficulty');
const questionArea = document.querySelector('.question-area');

// 游戏状态
let currentQuestion = null;
let score = 0;
let time = 0;
let timer = null;

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
    
    if (userAnswer === currentQuestion.answer) {
        score++;
        scoreEl.textContent = score;
        feedbackEl.textContent = '正确!';
        feedbackEl.className = 'correct';
    } else {
        feedbackEl.textContent = `错误! 正确答案是 ${currentQuestion.answer}`;
        feedbackEl.className = 'wrong';
    }
    
    setTimeout(nextQuestion, 1500);
}

// 事件监听
startBtn.addEventListener('click', startGame);
submitBtn.addEventListener('click', checkAnswer);
answerEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});
