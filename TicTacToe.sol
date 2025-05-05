// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TicTacToe {
    enum Mark { Empty, X, O }

    struct Game {
        address playerX;
        address playerO;
        address currentPlayer;
        Mark[3][3] board;
        bool active;
        uint256 stake;
    }

    uint256 public gameCounter;
    mapping(uint256 => Game) public games;

    event GameCreated(uint256 gameId, address creator);
    event GameJoined(uint256 gameId, address joiner);
    event MoveMade(uint256 gameId, address player, uint8 row, uint8 col);
    event GameWon(uint256 gameId, address winner);
    event GameDraw(uint256 gameId);
    event GameReset(uint256 gameId);

    /// Provjerava je li posiljatelj jedan od igraca
    modifier onlyPlayers(uint256 gameId) {
        require(
            msg.sender == games[gameId].playerX || msg.sender == games[gameId].playerO,
            "Nisi igrac u ovoj igri"
        );
        _;
    }

    /// Kreira novu igru s ulogom
    function createGame() external payable returns (uint256) {
        require(msg.value > 0, "Ulog je obavezan");

        gameCounter++;
        Game storage game = games[gameCounter];
        game.playerX = msg.sender;
        game.currentPlayer = msg.sender;
        game.active = true;
        game.stake = msg.value;

        emit GameCreated(gameCounter, msg.sender);
        return gameCounter;
    }

    /// Pridruzivanje drugog igraca igri uz isti ulog
    function joinGame(uint256 gameId) external payable {
        Game storage game = games[gameId];
        require(game.playerO == address(0), "Igra vec ima 2 igraca");
        require(msg.value == game.stake, "Ulog mora biti isti");
        require(msg.sender != game.playerX, "Ne mozes igrati sam protiv sebe");
        game.playerO = msg.sender;
        emit GameJoined(gameId, msg.sender);
    }

    /// Izvodenje poteza
    function makeMove(uint256 gameId, uint8 row, uint8 col) external onlyPlayers(gameId) {
        Game storage game = games[gameId];
        require(game.active, "Igra nije aktivna");
        require(msg.sender == game.currentPlayer, "Nisi na potezu");
        require(row < 3 && col < 3, "Neispravna pozicija");
        require(game.board[row][col] == Mark.Empty, "Polje zauzeto");

        Mark mark = msg.sender == game.playerX ? Mark.X : Mark.O;
        game.board[row][col] = mark;

        emit MoveMade(gameId, msg.sender, row, col);

        if (checkWin(game.board, mark)) {
            game.active = false;
            payable(msg.sender).transfer(address(this).balance);
            emit GameWon(gameId, msg.sender);
        } else if (isDraw(game.board)) {
            game.active = false;
            payable(game.playerX).transfer(game.stake);
            payable(game.playerO).transfer(game.stake);
            emit GameDraw(gameId);
        } else {
            // Promjena igraca na potezu
            game.currentPlayer = (game.currentPlayer == game.playerX)
                ? game.playerO
                : game.playerX;
        }
    }

    /// Resetiranje igre (dozvoljeno tek nakon zavrsetka)
    function resetGame(uint256 gameId) external onlyPlayers(gameId) {
        Game storage game = games[gameId];
        require(!game.active, "Igra je vec aktivna");

        for (uint8 i = 0; i < 3; i++) {
            for (uint8 j = 0; j < 3; j++) {
                game.board[i][j] = Mark.Empty;
            }
        }

        game.currentPlayer = game.playerX;
        game.active = true;

        emit GameReset(gameId);
    }

    /// Provjera pobjede
    function checkWin(Mark[3][3] memory board, Mark mark) internal pure returns (bool) {
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

    /// Provjera je li nerijeseno (sva polja puna, nema pobjednika)
    function isDraw(Mark[3][3] memory board) internal pure returns (bool) {
        for (uint8 i = 0; i < 3; i++) {
            for (uint8 j = 0; j < 3; j++) {
                if (board[i][j] == Mark.Empty) return false;
            }
        }
        return true;
    }

    /// Dohvat stanja ploce
    function getBoard(uint256 gameId) external view returns (Mark[3][3] memory) {
        return games[gameId].board;
    }

    /// Dohvat osnovnih informacija o igri
    function getGameInfo(uint256 gameId)
        external
        view
        returns (address, address, address, bool, uint256)
    {
        Game storage game = games[gameId];
        return (
            game.playerX,
            game.playerO,
            game.currentPlayer,
            game.active,
            game.stake
        );
    }
}
