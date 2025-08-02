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
                
                // Now, when you click on a cell, we know its column
                cell.addEventListener('click', () => handleGridCellClick(j));
                
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

        highlightHighestBlock();
    }
    
    function highlightHighestBlock() {
        let highestValue = 0;
        let highestBlockCell = null;
        
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
        if (selectedBlockElement) {
            selectedBlockElement.classList.remove('selected');
        }
        
        selectedBlockElement = block;
        selectedBlockElement.classList.add('selected');
    }

    function handleGridCellClick(column) {
        if (!selectedBlockElement) {
            return;
        }

        if (selectedBlockElement.dataset.isMiss === 'true') {
            removeBlockFromDropZone(selectedBlockElement);
            selectedBlockElement = null;
            return;
        }

        const blockValue = parseInt(selectedBlockElement.dataset.value);
        placeBlockInGrid(blockValue, column);
        
        removeBlockFromDropZone(selectedBlockElement);
        selectedBlockElement = null;
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
            grid[rowIndex][column] = value;
            
            const cell = gameGridElement.querySelector(`[data-row="${rowIndex}"][data-col="${column}"]`);
            cell.textContent = value;
            cell.style.backgroundColor = blockColors[value];
            
            checkMerge(rowIndex, column);
        } else {
            console.log(`Column ${column} is full.`);
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
                const mergedValue = value * 2;
                
                grid[row][col] = null;
                grid[r][c] = null;
                
                const cell1 = gameGridElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                cell1.textContent = '';
                cell1.style.backgroundColor = '';

                const cell2 = gameGridElement.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                cell2.textContent = '';
                cell2.style.backgroundColor = '';
                
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

                    checkMerge(newRowIndex, newCol);
                }

                merged = true;
            }
        });

        if (merged) {
            gravity();
        } else {
            updateScores();
        }
    }

    function gravity() {
        for (let col = 0; col < 5; col++) {
            let emptySpaces = [];
            for (let row = 4; row >= 0; row--) {
                if (grid[row][col] === null) {
                    emptySpaces.push(row);
                } else if (emptySpaces.length > 0) {
                    const newRow = emptySpaces.shift();
                    const oldRow = row;
                    
                    grid[newRow][col] = grid[oldRow][col];
                    grid[oldRow][col] = null;
                    
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
