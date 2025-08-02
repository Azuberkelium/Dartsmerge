document.addEventListener('DOMContentLoaded', () => {

    const blockColors = {
        2: '#FF6347',    // Tomato
        4: '#FF8C00',    // DarkOrange
        8: '#FFD700',    // Gold
        16: '#32CD32',   // LimeGreen
        32: '#00BFFF',   // DeepSkyBlue
        64: '#4B0082',   // Indigo
        128: '#8A2BE2',  // BlueViolet
        256: '#00CED1',  // DarkTurquoise
        512: '#DC143C',  // Crimson
        1024: '#ADFF2F', // GreenYellow
        2048: '#008080', // Teal
        4096: '#800080', // Purple
        'miss': '#696969' // DimGray
    };
    
    // Game state variables
    let grid = []; // 5x5 grid
    let dropZoneBlocks = [];
    let selectedBlock = null;
    let highScore = 0;
    let currentScore = 0;

    const gameGridElement = document.getElementById('game-grid');
    const dropZoneElement = document.getElementById('drop-zone');
    const blockSelectionElement = document.querySelector('.block-selection');
    const highScoreValueElement = document.getElementById('high-score-value');
    const currentScoreValueElement = document.getElementById('current-score-value');

    // --- Game Initialization ---
    function initializeGame() {
        createBlockSelection();
        createEmptyGrid();
        updateScores();
        fillDropZone();
    }

    function createBlockSelection() {
        const blockValues = Object.keys(blockColors).map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b);
        blockValues.forEach(value => {
            const block = document.createElement('div');
            block.className = 'number-block';
            block.style.backgroundColor = blockColors[value];
            block.textContent = value;
            block.dataset.value = value;
            blockSelectionElement.appendChild(block);

            block.addEventListener('click', () => handleBlockSelection(value));
        });

        const missBlock = document.createElement('div');
        missBlock.className = 'number-block';
        missBlock.style.backgroundColor = blockColors['miss'];
        missBlock.textContent = 'Miss';
        missBlock.dataset.value = 'miss';
        blockSelectionElement.appendChild(missBlock);

        missBlock.addEventListener('click', () => handleBlockSelection('miss'));
    }

    function createEmptyGrid() {
        grid = [];
        for (let i = 0; i < 5; i++) {
            const row = [];
            for (let j = 0; j < 5; j++) {
                row.push(null);
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => handleGridClick(j));
                gameGridElement.appendChild(cell);
            }
            grid.push(row);
        }
    }

    function updateScores() {
        // We'll calculate the total sum of the grid here later
        currentScoreValueElement.textContent = currentScore;
        highScoreValueElement.textContent = highScore;
    }

    // --- Game Logic Functions (to be filled in) ---

    function handleBlockSelection(value) {
        // Logic for when a block is clicked from the top selection
        // to add it to the drop zone.
    }

    function fillDropZone() {
        // Logic to fill the drop zone with blocks from the selection.
    }

    function handleGridClick(column) {
        // Logic for when a column in the grid is clicked.
        // This will place the selected drop zone block into the grid.
    }

    initializeGame();
});
