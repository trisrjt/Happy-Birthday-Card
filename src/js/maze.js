export class MazeGame {
    constructor(containerId, onSolved) {
        this.container = document.getElementById(containerId);
        this.onSolved = onSolved;
        this.width = 15;
        this.height = 15;
        this.cellSize = 25;
        this.grid = [];
        this.playerPos = { x: 1, y: 1 };
        this.goalPos = { x: 13, y: 13 };
        this.isSolved = false;

        if (window.innerWidth < 500) {
            this.cellSize = 20;
        }

        this.init();
    }

    init() {
        this.generateMaze();
        this.render();
        this.bindEvents();
    }

    generateMaze() {
        // Simple static maze for reliable experience
        // 0 = path, 1 = wall
        const layout = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];
        this.grid = layout;
    }

    render() {
        this.container.innerHTML = '';
        this.container.style.width = `${this.width * this.cellSize}px`;
        this.container.style.height = `${this.height * this.cellSize}px`;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = document.createElement('div');
                cell.className = `maze-cell ${this.grid[y][x] === 1 ? 'maze-wall' : 'maze-path'}`;
                cell.style.width = `${this.cellSize}px`;
                cell.style.height = `${this.cellSize}px`;
                cell.style.left = `${x * this.cellSize}px`;
                cell.style.top = `${y * this.cellSize}px`;
                this.container.appendChild(cell);
            }
        }

        const goal = document.createElement('div');
        goal.id = 'goal';
        goal.style.width = `${this.cellSize}px`;
        goal.style.height = `${this.cellSize}px`;
        goal.style.left = `${this.goalPos.x * this.cellSize}px`;
        goal.style.top = `${this.goalPos.y * this.cellSize}px`;
        this.container.appendChild(goal);

        this.player = document.createElement('div');
        this.player.id = 'player';
        this.player.style.width = `${this.cellSize}px`;
        this.player.style.height = `${this.cellSize}px`;
        this.updatePlayerPosition();
        this.container.appendChild(this.player);
    }

    updatePlayerPosition() {
        this.player.style.left = `${this.playerPos.x * this.cellSize}px`;
        this.player.style.top = `${this.playerPos.y * this.cellSize}px`;

        if (this.playerPos.x === this.goalPos.x && this.playerPos.y === this.goalPos.y) {
            if (!this.isSolved) {
                this.isSolved = true;
                setTimeout(() => this.onSolved(), 500);
            }
        }
    }

    move(dx, dy) {
        if (this.isSolved) return;
        const newX = this.playerPos.x + dx;
        const newY = this.playerPos.y + dy;

        if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.height) {
            if (this.grid[newY][newX] === 0) {
                this.playerPos.x = newX;
                this.playerPos.y = newY;
                this.updatePlayerPosition();
            }
        }
    }

    bindEvents() {
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp': this.move(0, -1); break;
                case 'ArrowDown': this.move(0, 1); break;
                case 'ArrowLeft': this.move(-1, 0); break;
                case 'ArrowRight': this.move(1, 0); break;
            }
        });

        document.getElementById('up-btn').addEventListener('click', () => this.move(0, -1));
        document.getElementById('down-btn').addEventListener('click', () => this.move(0, 1));
        document.getElementById('left-btn').addEventListener('click', () => this.move(-1, 0));
        document.getElementById('right-btn').addEventListener('click', () => this.move(1, 0));
    }
}
