// app.js (kompatibilan s index.html)

let provider;
let signer;
let contract;
let currentAccount;

// Adresa i ABI pametnog ugovora
const contractAddress = '0xb4cA6A78278721c058957e9134f0A173045b3295';
const contractABI = [

  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'gameId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
    ],
    name: 'GameCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'gameId',
        type: 'uint256',
      },
    ],
    name: 'GameDraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'gameId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'joiner',
        type: 'address',
      },
    ],
    name: 'GameJoined',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'gameId',
        type: 'uint256',
      },
    ],
    name: 'GameReset',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'gameId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'winner',
        type: 'address',
      },
    ],
    name: 'GameWon',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'gameId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'row',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'col',
        type: 'uint8',
      },
    ],
    name: 'MoveMade',
    type: 'event',
  },
  {
    inputs: [],
    name: 'createGame',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'gameId',
        type: 'uint256',
      },
    ],
    name: 'joinGame',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'gameId',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'row',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'col',
        type: 'uint8',
      },
    ],
    name: 'makeMove',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'gameId',
        type: 'uint256',
      },
    ],
    name: 'resetGame',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'gameCounter',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'games',
    outputs: [
      {
        internalType: 'address',
        name: 'playerX',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'playerO',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'currentPlayer',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'active',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'stake',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'gameId',
        type: 'uint256',
      },
    ],
    name: 'getBoard',
    outputs: [
      {
        internalType: 'enum TicTacToe.Mark[3][3]',
        name: '',
        type: 'uint8[3][3]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'gameId',
        type: 'uint256',
      },
    ],
    name: 'getGameInfo',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },

];

// 🔗 Povezivanje s MetaMask novčanikom
async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    signer = provider.getSigner();
    currentAccount = await signer.getAddress();
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    document.getElementById('wallet-address').innerText = `Wallet: ${currentAccount}`;

    contract.on('GameWon', (gameId, winner) => {
      const activeGameId = document.getElementById('status-game-id').value;
      if (gameId.toString() === activeGameId) {
        const winnerShort = `${winner.substring(0, 6)}...${winner.slice(-4)}`;
        document.getElementById('game-winner-output').innerText = `🎉 Igra #${gameId} je gotova!\nPobjednik: ${winnerShort}`;
      }
    });

    contract.on('GameDraw', (gameId) => {
      const activeGameId = document.getElementById('status-game-id').value;
      if (gameId.toString() === activeGameId) {
        document.getElementById('game-winner-output').innerText = `🤝 Igra #${gameId} završila je neriješeno!`;
      }
    });
  } else {
    alert('MetaMask nije pronađen');
  }
}

// 🎮 Kreiranje nove igre
async function createGame() {
  const stake = document.getElementById('stake').value;
  const tx = await contract.createGame({ value: ethers.utils.parseEther(stake) });
  const receipt = await tx.wait();
  const gameId = receipt.events.find((e) => e.event === 'GameCreated').args.gameId.toString();
  document.getElementById('created-game-id').innerText = gameId;
}

// 📥 Pridruživanje postojećoj igri
async function joinGame() {
  const gameId = document.getElementById('game-id').value;
  const stake = document.getElementById('join-stake').value;
  try {
    const tx = await contract.joinGame(gameId, { value: ethers.utils.parseEther(stake) });
    await tx.wait();
    alert(`Pridružen si igri #${gameId}`);
  } catch (err) {
    alert(err.reason || err.message);
  }
}

// ✅ Slanje poteza
async function makeMove() {
  const gameId = document.getElementById('move-game-id').value;
  const row = parseInt(document.getElementById('row').value);
  const col = parseInt(document.getElementById('col').value);
  try {
    const tx = await contract.makeMove(gameId, row, col);
    await tx.wait();
    alert('Potez poslan!');
  } catch (err) {
    alert(err.reason || err.message);
  }
}

// 📋 Dohvaćanje ploče
async function getBoard() {
  const gameId = document.getElementById('board-game-id').value;
  const board = await contract.getBoard(gameId);
  let output = '';
  for (let i = 0; i < 3; i++) {
    let row = '';
    for (let j = 0; j < 3; j++) {
      const mark = board[i][j];
      row += mark === 1 ? 'X' : mark === 2 ? 'O' : '-';
      row += ' ';
    }
    output += `${row.trim()}\n`;
  }
  document.getElementById('board-output').innerText = output;
}

// 🏆 Dohvaćanje statusa igre
async function getGameStatus() {
  const gameId = document.getElementById('status-game-id').value;
  const info = await contract.getGameInfo(gameId);
  const [playerX, playerO, currentPlayer, active, stake] = info;
  let statusText = `Igra aktivna: ${active}\n`;
  statusText += `X: ${playerX}\nO: ${playerO}\nNa potezu: ${currentPlayer}`;
  document.getElementById('game-status-output').innerText = statusText;
}

// 🔄 Resetiranje igre
async function resetGame() {
  const gameId = document.getElementById('reset-game-id').value;
  try {
    const tx = await contract.resetGame(gameId);
    await tx.wait();
    alert('Igra je resetirana.');
  } catch (err) {
    alert(err.reason || err.message);
  }
}
