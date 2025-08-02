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
    let selectedBlockElement = null; // The DOM element selected for placing
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
                
                cell.addEventListener('click', () => handleGridCellClick(i, j));
                
                gameGridElement.appendChild(cell);
            }
            grid.push(row);
        }
    }

    function updateScores() {
        currentScore = grid.flat().reduce((sum, value) => sum + (value || 0), 0);
        currentScoreValueElement.textContent = currentScore;
        if (currentScore > highScore) {
            highScore = currentScore;
            highScoreValueElement.textContent = highScore;
        }

        // Highlight the highest number on the grid
        highlightHighestBlock();
    }
    
    function highlightHighestBlock() {
        let highestValue = 0;
        let highestBlockCell = null;
        
        // Remove existing highlights
        document.querySelectorAll('.grid-cell.highest').forEach(cell => cell.classList.remove('highest'));

        grid.forEach((row, i) => {
            row.forEach((value, j) => {
                if (value !== null && value > highestValue) {
                    highestValue = value;
                    highestBlockCell = gameGridElement.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                }
            });
        });

        if (highestBlockCell) {
            highestBlockCell.classList.add('highest');
        }
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
            
            blockElement.addEventListener('click', () => handleDropZoneClick(blockElement));
            
            dropZoneElement.appendChild(blockElement);
            dropZoneBlocks.push(blockElement);
        }
    }

    function handleDropZoneClick(block) {
        // Remove highlight from previous selected block
        if (selectedBlockElement) {
            selectedBlockElement.classList.remove('selected');
        }
        
        // Set new selected block
        selectedBlockElement = block;
        selectedBlockElement.classList.add('selected');
        
        console.log(`Block with value ${block.dataset.value} is selected.`);
    }

    function handleGridCellClick(row, column) {
        if (!selectedBlockElement) {
            console.log('No block is selected in the drop zone.');
            return;
        }

        // Handle the "Miss" block placement
        if (selectedBlockElement.dataset.isMiss === 'true') {
            // A "Miss" block is just removed, as per the rules
            removeBlockFromDropZone(selectedBlockElement);
            selectedBlockElement = null; // Unselect the block
            return;
        }

        const blockValue = parseInt(selectedBlockElement.dataset.value);
        placeBlockInGrid(blockValue, column);
        
        // Block is placed, so remove it from the drop zone
        removeBlockFromDropZone(selectedBlockElement);
        selectedBlockElement = null; // Unselect the block
    }
    
    function removeBlockFromDropZone(block) {
        const index = dropZoneBlocks.indexOf(block);
        if (index > -1) {
            dropZoneBlocks.splice(index, 1);
        }
        block.remove();
    }

    function placeBlockInGrid(value, column) {
        let rowIndex = -1;
        for (let i = grid.length - 1; i >= 0; i--) {
            if (grid[i][column] === null) {
                rowIndex = i;
                break;
            }
        }

        if (rowIndex !== -1) {
            console.log(`Placing block ${value} at grid[${rowIndex}][${column}]`);
            grid[rowIndex][column] = value;
            
            // Update the visual representation of the grid
            const cell = gameGridElement.querySelector(`[data-row="${rowIndex}"][data-col="${column}"]`);
            cell.textContent = value;
            cell.style.backgroundColor = blockColors[value];
            
            // Start the merge process from the newly placed block
            checkMerge(rowIndex, column);

            updateScores();
        } else {
            console.log(`Column ${column} is full. Block not placed.`);
            // You might want to add a visual or sound cue here
        }
    }

    function checkMerge(row, col) {
        const value = grid[row][col];
        if (value === null) return;
        
        const neighbors = [
            { r: row - 1, c: col }, // Above
            { r: row + 1, c: col }, // Below
            { r: row, c: col - 1 }, // Left
            { r: row, c: col + 1 }  // Right
        ];
        
        let merged = false;
        
        neighbors.forEach(neighbor => {
            const { r, c } = neighbor;
            if (r >= 0 && r < 5 && c >= 0 && c < 5 && grid[r][c] === value) {
                // Perform merge
                const mergedValue = value * 2;
                
                // Clear the original cells
                grid[row][col] = null;
                grid[r][c] = null;
                
                const cell1 = gameGridElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                cell1.textContent = '';
                cell1.style.backgroundColor = '';

                const cell2 = gameGridElement.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                cell2.textContent = '';
                cell2.style.backgroundColor = '';
                
                // Find the new lowest position for the merged block in the same column as one of the original blocks
                let newCol = col;
                let newRowIndex = -1;
                for (let i = grid.length - 1; i >= 0; i--) {
                    if (grid[i][newCol] === null) {
                        newRowIndex = i;
                        break;
                    }
                }
                
                if (newRowIndex !== -1) {
                    grid[newRowIndex][newCol] = mergedValue;
                    const newCell = gameGridElement.querySelector(`[data-row="${newRowIndex}"][data-col="${newCol}"]`);
                    newCell.textContent = mergedValue;
                    newCell.style.backgroundColor = blockColors[mergedValue];

                    // Recursively check for new merges
                    checkMerge(newRowIndex, newCol);
                }

                merged = true;
            }
        });

        if (merged) {
            // After all merges, re-arrange the grid so blocks fall down
            gravity();
        }
    }

    function gravity() {
        for (let col = 0; col < 5; col++) {
            let emptySpaces = [];
            for (let row = 4; row >= 0; row--) {
                if (grid[row][col] === null) {
                    emptySpaces.push(row);
                } else if (emptySpaces.length > 0) {
                    // Move the block down
                    const newRow = emptySpaces.shift();
                    const oldRow = row;
                    
                    // Update grid data
                    grid[newRow][col] = grid[oldRow][col];
                    grid[oldRow][col] = null;
                    
                    // Update DOM
                    const oldCell = gameGridElement.querySelector(`[data-row="${oldRow}"][data-col="${col}"]`);
                    const newCell = gameGridElement.querySelector(`[data-row="${newRow}"][data-col="${col}"]`);

                    newCell.textContent = oldCell.textContent;
                    newCell.style.backgroundColor = oldCell.style.backgroundColor;
                    
                    oldCell.textContent = '';
                    oldCell.style.backgroundColor = '';

                    emptySpaces.push(oldRow);
                }
            }
        }
        updateScores();
    }

    initializeGame();
});

