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
    let draggedBlockElement = null; // The DOM element being dragged
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
                
                // Allow dropping on the grid cells
                cell.addEventListener('dragover', e => {
                    e.preventDefault();
                    cell.style.backgroundColor = '#ddd'; // Visual cue for dropping
                });
                
                cell.addEventListener('dragleave', e => {
                    cell.style.backgroundColor = '#eee';
                });
                
                cell.addEventListener('drop', e => handleDrop(e, j));
                
                gameGridElement.appendChild(cell);
            }
            grid.push(row);
        }
    }

    function updateScores() {
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
            blockElement.addEventListener('dragstart', e => {
                console.log('Drag started!');
                draggedBlockElement = blockElement;
                e.dataTransfer.setData('text/plain', blockElement.dataset.value);
            });
            
            blockElement.addEventListener('dragend', () => {
                console.log('Drag ended.');
                draggedBlockElement = null;
            });
            
            dropZoneElement.appendChild(blockElement);
            dropZoneBlocks.push(blockElement);
        }
    }

    function handleDrop(e, column) {
        e.preventDefault(); // Prevents default browser drop behavior
        const cell = e.target;
        cell.style.backgroundColor = '#eee'; // Reset visual cue
        
        if (!draggedBlockElement) return;
        
        console.log(`Dropped block with value ${draggedBlockElement.dataset.value} into column ${column}`);

        // Handle the "Miss" block drop
        if (draggedBlockElement.dataset.isMiss === 'true') {
            removeBlockFromDropZone(draggedBlockElement);
            return;
        }

        // Handle dropping a regular number block
        const blockValue = parseInt(draggedBlockElement.dataset.value);
        placeBlockInGrid(blockValue, column);
        removeBlockFromDropZone(draggedBlockElement);
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


