// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicTacToe is ERC721URIStorage, Ownable {
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
    uint256 private _tokenIdCounter;

    mapping(uint256 => Game) public games;

    event GameCreated(uint256 gameId, address creator);
    event GameJoined(uint256 gameId, address joiner);
    event MoveMade(uint256 gameId, address player, uint8 row, uint8 col);
    event GameWon(uint256 gameId, address winner);
    event GameDraw(uint256 gameId);
    event GameReset(uint256 gameId);
    event BadgeMinted(address winner, uint256 tokenId, string uri);

    constructor() ERC721("TicTacToeBadge", "TTTB") Ownable(msg.sender) {}

    modifier onlyPlayers(uint256 gameId) {
        require(
            msg.sender == games[gameId].playerX || msg.sender == games[gameId].playerO,
            "Nisi igrac u ovoj igri"
        );
        _;
    }

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

    function joinGame(uint256 gameId) external payable {
        Game storage game = games[gameId];
        require(game.playerO == address(0), "Igra vec ima 2 igraca");
        require(msg.value == game.stake, "Ulog mora biti isti");
        require(msg.sender != game.playerX, "Ne mozes igrati sam protiv sebe");
        game.playerO = msg.sender;
        emit GameJoined(gameId, msg.sender);
    }

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

            // isplata  2 * stake, ne sve iz ugovora!!
            payable(msg.sender).transfer(game.stake * 2);

            emit GameWon(gameId, msg.sender);

            // Mintanje NFT badge pobjedniku
            if (msg.sender == game.playerX) {
                mintBadge(msg.sender, "ipfs://bafkreifd5n4iqiiadqr7p2jkw5mowaezapikestmha6xn2gyympmjg3beq");
            } else {
                mintBadge(msg.sender, "ipfs://bafkreic3gxxd3bl4kdjnesnjcnxh7o5vwert4r2tosfeubdycisxloiwzy");
            }

        } else if (isDraw(game.board)) {
            game.active = false;
            payable(game.playerX).transfer(game.stake);
            payable(game.playerO).transfer(game.stake);
            emit GameDraw(gameId);
        } else {
            game.currentPlayer = (game.currentPlayer == game.playerX)
                ? game.playerO
                : game.playerX;
        }
    }

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

    function isDraw(Mark[3][3] memory board) internal pure returns (bool) {
        for (uint8 i = 0; i < 3; i++) {
            for (uint8 j = 0; j < 3; j++) {
                if (board[i][j] == Mark.Empty) return false;
            }
        }
        return true;
    }

    function getBoard(uint256 gameId) external view returns (Mark[3][3] memory) {
        return games[gameId].board;
    }

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

    // Mintanje NFT badgea pobjedniku
    function mintBadge(address to, string memory tokenURI) internal {
        require(to != address(0), "Adresa nije ispravna"); // Dodatna zaštita
        uint256 newTokenId = _tokenIdCounter;
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        emit BadgeMinted(to, newTokenId, tokenURI);
        _tokenIdCounter++;
    }

    // Sprječavanje slučajnih uloga direktno na ugovor
    receive() external payable {
        revert("Direktan ETH nije dozvoljen");
    }

    // Sprječavanje poziva nepostojećih funkcija
    fallback() external payable {
        revert("Pozvana nepoznata funkcija");
    }
}

