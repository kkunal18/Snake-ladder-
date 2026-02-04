const board = document.getElementById('board');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const p1Token = document.getElementById('p1-token');
const p2Token = document.getElementById('p2-token');
const dice1Obj = document.getElementById('dice-1');
const dice2Obj = document.getElementById('dice-2');
const diceP1Wrapper = document.getElementById('dice-p1');
const diceP2Wrapper = document.getElementById('dice-p2');

let currentPlayer = Math.floor(Math.random() * 2) + 1;
let playerPositions = { 1: 0, 2: 0 };
let playerCheckpoints = { 1: 0, 2: 0 };
let playerUnlocked = { 1: false, 2: false };
let isRolling = false;

// Snake and Ladder definitions
// Ladders: start < end (Black)
const ladders = {
    4: 25,
    13: 46,
    33: 49,
    50: 69,
    62: 81
};

// Snakes: start > end
// Special snakes (Spots): 25: 5, 99: 78
const snakes = {
    27: 7,
    43: 18,
    54: 31,
    66: 45,
    76: 58,
    99: 41 // Special one
};
// We will manually define colors for snakes in the draw function

// Create board cells
function createBoard() {
    for (let i = 100; i >= 1; i--) {
        const row = Math.floor((i - 1) / 10);
        const col = (i - 1) % 10;

        let displayNum = i;
        // Boustrophedon (snake-like) numbering
        // Actually, for simplicity in 10x10, let's just use standard grid mapping
        // But traditional boards zigzag.
    }

    // Simpler board generation for standard 1-100 visual
    for (let r = 9; r >= 0; r--) {
        for (let c = 0; c < 10; c++) {
            let actualColumn = r % 2 === 0 ? c : 9 - c;
            let num = r * 10 + actualColumn + 1;

            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${num}`;
            cell.textContent = num;
            board.appendChild(cell);
        }
    }
}

function getCellCenter(num) {
    if (num === 0) return { x: 0, y: 0 }; // Starting position off-board
    const cell = document.getElementById(`cell-${num}`);
    const rect = cell.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();
    return {
        x: rect.left - boardRect.left + rect.width / 2,
        y: rect.top - boardRect.top + rect.height / 2
    };
}

function updateTokenPositions() {
    const bRect = board.getBoundingClientRect();

    [1, 2].forEach(p => {
        const pos = playerPositions[p];
        const token = p === 1 ? p1Token : p2Token;

        if (pos === 0) {
            // Off-board starting positions
            if (p === 1) {
                token.style.bottom = '-10%';
                token.style.right = '0';
                token.style.left = 'auto';
                token.style.top = 'auto';
            } else {
                token.style.bottom = '-10%';
                token.style.left = '0';
                token.style.top = 'auto';
            }
        } else {
            const center = getCellCenter(pos);
            token.style.left = `${center.x - bRect.width * 0.02}px`;
            token.style.top = `${center.y - bRect.height * 0.02}px`;
        }
    });
}

function drawSnakesAndLadders() {
    canvas.width = board.clientWidth;
    canvas.height = board.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Ladders (Black)
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';

    Object.entries(ladders).forEach(([start, end]) => {
        const s = getCellCenter(parseInt(start));
        const e = getCellCenter(end);

        // Simple ladder drawing
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(e.x, e.y);
        ctx.stroke();

        // Rungs
        ctx.lineWidth = 2;
        const steps = 5;
        for (let i = 1; i < steps; i++) {
            const x = s.x + (e.x - s.x) * (i / steps);
            const y = s.y + (e.y - s.y) * (i / steps);
            const dx = (e.x - s.x);
            const dy = (e.y - s.y);
            const angle = Math.atan2(dy, dx) + Math.PI / 2;
            const size = 10;
            ctx.beginPath();
            ctx.moveTo(x - Math.cos(angle) * size, y - Math.sin(angle) * size);
            ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
            ctx.stroke();
        }
        ctx.lineWidth = 8;
    });

    // Draw Snakes
    const snakeColors = [
        '#228B22', // ForestGreen
        '#32CD32', // LimeGreen (Special 1)
        '#006400', // DarkGreen
        '#9ACD32', // YellowGreen (Special 2)
        '#556B2F', // DarkOliveGreen
        '#6B8E23'  // OliveDrab
    ];

    let i = 0;
    Object.entries(snakes).forEach(([start, end]) => {
        const s = getCellCenter(parseInt(start));
        const e = getCellCenter(end);
        const color = snakeColors[i % snakeColors.length];
        const isSpecial = (i === 1 || i === 3); // Light green ones

        ctx.strokeStyle = color;
        ctx.lineWidth = 10;

        // Draw wavy snake
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        const cp1x = s.x + (e.x - s.x) * 0.3 + 30;
        const cp1y = s.y + (e.y - s.y) * 0.3 - 30;
        const cp2x = s.x + (e.x - s.x) * 0.7 - 30;
        const cp2y = s.y + (e.y - s.y) * 0.7 + 30;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, e.x, e.y);
        ctx.stroke();

        // Draw spots for special snakes
        if (isSpecial) {
            ctx.save();
            ctx.setLineDash([5, 10]);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.restore();
        }

        // Snake head
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 8, 0, Math.PI * 2);
        ctx.fill();

        i++;
    });
}

function updateDiceDots(diceNum, value) {
    const dotContainer = document.querySelector(`#dice-${diceNum} .dot-container`);
    dotContainer.innerHTML = '';

    const dotPositions = {
        1: [4],
        2: [0, 8],
        3: [0, 4, 8],
        4: [0, 2, 6, 8],
        5: [0, 2, 4, 6, 8],
        6: [0, 2, 3, 5, 6, 8]
    };

    for (let i = 0; i < 9; i++) {
        const dot = document.createElement('div');
        if (dotPositions[value].includes(i)) {
            dot.className = 'dot';
        }
        dotContainer.appendChild(dot);
    }
}

async function rollDice() {
    if (isRolling) return;
    isRolling = true;

    const diceWrapper = currentPlayer === 1 ? diceP1Wrapper : diceP2Wrapper;
    const diceObj = currentPlayer === 1 ? dice1Obj : dice2Obj;

    const rollValue = await new Promise(resolve => {
        let rv = 0;
        let count = 0;
        const interval = setInterval(() => {
            rv = Math.floor(Math.random() * 6) + 1;
            updateDiceDots(currentPlayer, rv);
            count++;
            if (count >= 10) {
                clearInterval(interval);
                resolve(rv);
            }
        }, 50);
    });

    // Unlock logic
    if (!playerUnlocked[currentPlayer]) {
        if (rollValue === 1) {
            playerUnlocked[currentPlayer] = true;
            playerPositions[currentPlayer] = 1;
            playerCheckpoints[currentPlayer] = 1;
            updateTokenPositions();
            showStatus(currentPlayer, "UNLOCKED! + CHECKPOINT", 1500);
            // Extra turn on 1 (unlock) is like a ladder/6? 
            // The prompt says "once unlocked its free to go with old rules"
            // Usually unlock doesn't give extra turn unless it's a 6, but here 1 is the key.
            // Let's stick to simple unlock and switch turn unless user likes extra turn on unlock.
            // Wait, rolling a 1 also sets checkpoint in old rules.
            switchTurn();
        } else {
            showStatus(currentPlayer, "NEED A 1 TO START", 1500);
            switchTurn();
        }
        isRolling = false;
        return;
    }

    const moveResult = await movePlayer(currentPlayer, rollValue);

    // Checkpoint logic: roll a 1
    if (rollValue === 1) {
        playerCheckpoints[currentPlayer] = playerPositions[currentPlayer];
        showStatus(currentPlayer, "CHECKPOINT SET!", 1500);
    }

    // Extra turn on 6 or ladder
    let extraTurn = (rollValue === 6 || (moveResult && moveResult.climbedLadder));

    if (rollValue === 6 && (!moveResult || !moveResult.climbedLadder)) {
        showStatus(currentPlayer, "ROLLED 6! +1 TURN", 1500);
    }

    if (playerPositions[currentPlayer] < 100 && !extraTurn) {
        switchTurn();
    }
    isRolling = false;
}

function showStatus(player, message, duration) {
    const label = document.querySelector(`#p${player}-info .status-label`);
    if (!label) return;

    label.textContent = message;
    label.classList.add('active');

    setTimeout(() => {
        if (label.textContent === message) {
            label.textContent = '';
            label.classList.remove('active');
        }
    }, duration);
}

function switchTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    diceP1Wrapper.classList.toggle('hidden', currentPlayer === 2);
    diceP2Wrapper.classList.toggle('hidden', currentPlayer === 1);
}

async function movePlayer(player, steps) {
    let currentPos = playerPositions[player];
    let targetPos = currentPos + steps;
    let climbedLadder = false;

    if (targetPos > 100) return { climbedLadder: false };

    // Step by step move
    for (let i = currentPos + 1; i <= targetPos; i++) {
        playerPositions[player] = i;
        updateTokenPositions();
        await new Promise(r => setTimeout(r, 200));
    }

    // Check for snakes or ladders
    if (ladders[targetPos]) {
        playerPositions[player] = ladders[targetPos];
        climbedLadder = true;
        showStatus(player, "CLIMBED LADDER! +1 TURN", 1500);
        updateTokenPositions();
        await new Promise(r => setTimeout(r, 500));
    } else if (snakes[targetPos]) {
        const snakeTail = snakes[targetPos];
        const checkpoint = playerCheckpoints[player];

        // If checkpoint is higher than snake tail, stop at checkpoint
        if (checkpoint > snakeTail && checkpoint < targetPos) {
            playerPositions[player] = checkpoint;
            showStatus(player, "SAVED BY CHECKPOINT!", 1500);
        } else {
            playerPositions[player] = snakeTail;
            showStatus(player, "OOPS! SNAKE BIT YOU", 1500);
        }

        updateTokenPositions();
        await new Promise(r => setTimeout(r, 500));
    }

    if (playerPositions[player] === 100) {
        showWinner(player);
    }
    return { climbedLadder };
}

function showWinner(player) {
    const overlay = document.getElementById('overlay');
    const winnerText = document.getElementById('winner-text');
    const loser = player === 1 ? 2 : 1;

    document.querySelector(`#p${player}-info .status-label`).textContent = 'WINNER';
    document.querySelector(`#p${loser}-info .status-label`).textContent = 'LOSER';

    winnerText.textContent = `Player ${player} Wins!`;
    overlay.classList.remove('hidden');
}

// Initial setup
window.addEventListener('resize', () => {
    drawSnakesAndLadders();
    updateTokenPositions();
});

createBoard();
setTimeout(() => {
    drawSnakesAndLadders();
    updateTokenPositions();
    updateDiceDots(1, 1);
    updateDiceDots(2, 1);
    // Start with the randomly selected player
    diceP1Wrapper.classList.toggle('hidden', currentPlayer === 2);
    diceP2Wrapper.classList.toggle('hidden', currentPlayer === 1);
}, 100);

dice1Obj.addEventListener('click', rollDice);
dice2Obj.addEventListener('click', rollDice);
