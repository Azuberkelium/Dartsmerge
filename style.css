body {
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #2c3e50;
    color: #ecf0f1;
    margin: 0;
    padding: 20px;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
}

.score-container {
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: 500px;
    margin-bottom: 20px;
}

.score-box {
    text-align: center;
    background-color: #34495e;
    padding: 10px 20px;
    border-radius: 8px;
}

#game-grid {
    display: grid;
    grid-template-columns: repeat(5, 80px);
    grid-template-rows: repeat(5, 80px);
    gap: 5px;
    background-color: #34495e;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.grid-cell {
    width: 80px;
    height: 80px;
    background-color: #465a6f;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.grid-cell:hover {
    transform: scale(1.05);
}

.grid-cell.highest {
    animation: glow-highest 1.5s infinite alternate;
}

@keyframes glow-highest {
    from { box-shadow: 0 0 15px 5px rgba(255, 215, 0, 0.7); }
    to { box-shadow: 0 0 25px 8px rgba(255, 215, 0, 1); }
}

.drop-zone-container, .block-selection-container {
    margin-top: 20px;
    text-align: center;
}

#drop-zone {
    display: flex;
    gap: 10px;
    min-height: 80px;
    background-color: #34495e;
    border: 2px dashed #95a5a6;
    padding: 10px;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 500px;
}

.drop-zone-block, .number-block {
    width: 70px;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    font-weight: bold;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease-in-out;
}

.drop-zone-block.selected {
    box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.7);
    border: 2px solid white;
}

.drop-zone-block:hover, .number-block:hover {
    transform: scale(1.1);
}

.block-selection {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-top: 10px;
    width: 100%;
    max-width: 500px;
}
