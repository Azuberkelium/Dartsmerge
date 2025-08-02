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
    // Only add to the drop zone if there's space.
    if (dropZoneBlocks.length < 3) {
        const blockElement = document.createElement('div');
        blockElement.className = 'drop-zone-block';

        if (value === 'miss') {
            blockElement.textContent = 'Miss';
            blockElement.style.backgroundColor = blockColors['miss'];
            blockElement.dataset.value = 'miss';
            blockElement.dataset.isMiss = 'true';
        } else {
            blockElement.textContent = value;
            blockElement.style.backgroundColor = blockColors[value];
            blockElement.dataset.value = value;
            blockElement.dataset.isMiss = 'false';
        }

        // Add click listener to the block in the drop zone
        blockElement.addEventListener('click', () => {
            // Clear any previous selection
            if (selectedBlock) {
                selectedBlock.classList.remove('selected');
            }

            // If it's a miss block, handle its special behavior.
            if (blockElement.dataset.isMiss === 'true') {
                // Miss blocks just vanish when clicked.
                dropZoneElement.removeChild(blockElement);
                const index = dropZoneBlocks.indexOf(blockElement);
                if (index > -1) {
                    dropZoneBlocks.splice(index, 1);
                }
                selectedBlock = null;
            } else {
                // Select this block for placement.
                selectedBlock = blockElement;
                selectedBlock.classList.add('selected');
            }
        });

        dropZoneElement.appendChild(blockElement);
        dropZoneBlocks.push(blockElement);
    }
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
