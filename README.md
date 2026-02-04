# Snake & Ladder - 2 Player Game

A modern, web-based implementation of the classic Snake and Ladder board game, featuring advanced mechanics and a polished user interface.

Created by **Kunal Bansal**.

## 🎮 Game Overview

This is a 2-player game designed for a single device. Players take turns rolling a die to navigate their pawns from 0 to 100. The game includes traditional elements like snakes and ladders, along with unique strategic mechanics like **Checkpoints** and an **Unlock System**.

## ✨ Features

-   **Modern UI/UX**: Built with HTML5, CSS3, and Canvas for a premium look and feel.
-   **Unlock Mechanic**: Players must roll a **1** to unlock their pawn and start moving.
-   **Checkpoint System**: Rolling a **1** (after being unlocked) sets a checkpoint. If you're bitten by a snake, you stop at your highest checkpoint instead of falling all the way down to the tail.
-   **Extra Turns**:
    -   Roll a **6** to get another turn.
    -   Climb a **Ladder** to get another turn.
-   **Randomized Start**: The game randomly selects whether Player 1 or Player 2 starts first.
-   **Real-time Feedback**: Status labels inform players of game events (e.g., "UNLOCKED!", "SAVED BY CHECKPOINT!").
-   **Responsive Design**: The game board scales beautifully on various screen sizes.

## 🚀 How to Play

1.  **Start**: The game will randomly assign the first turn.
2.  **Unlock**: You must roll a **1** to get your pawn onto the board (Cell 1).
3.  **Navigate**: Roll the dice to move forward. Avoid snakes and aim for ladders!
4.  **Strategy**: Rolling a **1** is beneficial! It sets a "save point" that protects you from falling too far back when hit by a snake.
5.  **Win**: The first player to reach exactly cell **100** wins!

## 🛠️ Built With

-   **HTML5 & Semantic Elements**
-   **Vanilla CSS3** (Flexbox, Grid, Animations)
-   **Vanilla JavaScript** (ES6+, Canvas API)

---

### Special Thanks
Special thanks to all the players and testers who helped shape this version of the game!

Enjoy the game! 🎲🐍🪜
