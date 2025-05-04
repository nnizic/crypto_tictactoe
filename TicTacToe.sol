// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TicTacToe {
    address public playerX;
    address public playerO;
    address public currentPlayer;
    uint8[3][3] public board; // 0: prazno, 1: X, 2: O
    bool public gameActive;
    uint256 public stake;

    event GameJoined(address playerO);
    event MoveMade(address player, uint8 row, uint8 col);
    event GameWon(address winner);
    event GameDraw();

    constructor() payable {
        require(msg.value > 0, "Ulog je obavezan");
        playerX = msg.sender;
        currentPlayer = msg.sender;
        stake = msg.value;
        gameActive = true;
    }

    function joinGame() external payable {
        require(playerO == address(0), "Igra vec ima 2 igraca");
        require(msg.value == stake, "Ulog mora biti isti");
        playerO = msg.sender;
        emit GameJoined(playerO);
    }

    function makeMove(uint8 row, uint8 col) external {
        require(gameActive, "Igra nije aktivna");
        require(msg.sender == currentPlayer, "Nisi na potezu");
        require(row < 3 && col < 3, "Neispravna pozicija");
        require(board[row][col] == 0, "Polje zauzeto");

        uint8 mark = msg.sender == playerX ? 1 : 2;
        board[row][col] = mark;
        emit MoveMade(msg.sender, row, col);

        if (checkWin(mark)) {
            gameActive = false;
            payable(msg.sender).transfer(address(this).balance);
            emit GameWon(msg.sender);
        } else if (isDraw()) {
            gameActive = false;
            payable(playerX).transfer(stake);
            payable(playerO).transfer(stake);
            emit GameDraw();
        } else {
            currentPlayer = (currentPlayer == playerX) ? playerO : playerX;
        }
    }

    function checkWin(uint8 mark) internal view returns (bool) {
        for (uint8 i = 0; i < 3; i++) {
            if ((board[i][0] == mark && board[i][1] == mark && board[i][2] == mark) ||
                (board[0][i] == mark && board[1][i] == mark && board[2][i] == mark)) {
                return true;
            }
        }
        if ((board[0][0] == mark && board[1][1] == mark && board[2][2] == mark) ||
            (board[0][2] == mark && board[1][1] == mark && board[2][0] == mark)) {
            return true;
        }
        return false;
    }

    function isDraw() internal view returns (bool) {
        for (uint8 i = 0; i < 3; i++) {
            for (uint8 j = 0; j < 3; j++) {
                if (board[i][j] == 0) return false;
            }
        }
        return true;
    }
}
