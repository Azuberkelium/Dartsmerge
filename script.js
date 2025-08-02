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
    let draggedBlock = null; // The block being dragged
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
                cell.addEventListener('dragover', e => e.preventDefault()); // Allows us to drop
                cell.addEventListener('drop', () => handleDrop(j));
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

    // --- Game Logic Functions ---

    function handleBlockSelection(value) {
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
            
            // Set block to be draggable
            blockElement.setAttribute('draggable', 'true');
            
            // Add drag listeners
            blockElement.addEventListener('dragstart', () => {
                draggedBlock = blockElement;
                setTimeout(() => blockElement.classList.add('dragging'), 0);
            });
            
            blockElement.addEventListener('dragend', () => {
                setTimeout(() => blockElement.classList.remove('dragging'), 0);
                draggedBlock = null;
            });
            
            dropZoneElement.appendChild(blockElement);
            dropZoneBlocks.push(blockElement);
        }
    }

    function handleDrop(column) {
        if (!draggedBlock) return;

        // Handle the "Miss" block drop
        if (draggedBlock.dataset.isMiss === 'true') {
            removeBlockFromDropZone(draggedBlock);
            return;
        }

        // Handle dropping a regular number block
        const blockValue = parseInt(draggedBlock.dataset.value);
        placeBlockInGrid(blockValue, column);
        removeBlockFromDropZone(draggedBlock);
    }
    
    function removeBlockFromDropZone(block) {
        const index = dropZoneBlocks.indexOf(block);
        if (index > -1) {
            dropZoneBlocks.splice(index, 1);
        }
        block.remove();
    }

    function placeBlockInGrid(value, column) {
        // This is where the core placement and merge logic will go
        console.log(`Attempting to place block ${value} in column ${column}`);
    }

    initializeGame();
});
