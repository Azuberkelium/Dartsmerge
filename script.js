Document.addEventListener('DOMContentLoaded', () => {

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
        // Clear the grid before recreating it
        while (gameGridElement.firstChild) {
            gameGridElement.firstChild.remove();
        }

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
                    // Add a visual cue for dropping
                    e.target.classList.add('drag-over');
                });
                
                cell.addEventListener('dragleave', e => {
                    // Remove the visual cue
                    e.target.classList.remove('drag-over');
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
                // Store the element being dragged
                draggedBlockElement = blockElement;
                e.dataTransfer.setData('text/plain', blockElement.dataset.value);
                // The `setTimeout` is necessary to ensure the class is added after the drag start
                setTimeout(() => blockElement.classList.add('dragging'), 0);
            });
            
            blockElement.addEventListener('dragend', () => {
                console.log('Drag ended.');
                // Reset the dragged block and remove the visual cue
                draggedBlockElement = null;
                blockElement.classList.remove('dragging');
            });
            
            dropZoneElement.appendChild(blockElement);
            dropZoneBlocks.push(blockElement);
        }
    }

    function handleDrop(e, column) {
        e.preventDefault(); // Prevents default browser drop behavior
        const cell = e.target;
        cell.classList.remove('drag-over'); // Reset visual cue
        
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
        // Find the lowest empty cell in the column
        let rowIndex = -1;
        for (let i = grid.length - 1; i >= 0; i--) {
            if (grid[i][column] === null) {
                rowIndex = i;
                break;
            }
        }

        // If there is an empty cell in the column, place the block
        if (rowIndex !== -1) {
            console.log(`Placing block ${value} at grid[${rowIndex}][${column}]`);
            grid[rowIndex][column] = value;
            
            // Update the visual representation of the grid
            const cell = gameGridElement.querySelector(`[data-row="${rowIndex}"][data-col="${column}"]`);
            cell.textContent = value;
            cell.style.backgroundColor = blockColors[value];
            
            // TODO: Implement merge logic here
            // checkMerge(rowIndex, column);
        } else {
            console.log(`Column ${column} is full. Block not placed.`);
            // You might want to add a visual or sound cue here
        }
    }

    initializeGame();
});

