// app.js (kompatibilan s index.html)

let provider;
let signer;
let contract;
let currentAccount;

// Adresa i ABI pametnog ugovora
const contractAddress = '0x92Bc0869199985551aa455268Eda8fC4Bd8104B8';
const contractABI = [

  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'ERC721IncorrectOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ERC721InsufficientApproval',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'approver',
        type: 'address',
      },
    ],
    name: 'ERC721InvalidApprover',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'ERC721InvalidOperator',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'ERC721InvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'ERC721InvalidReceiver',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'ERC721InvalidSender',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ERC721NonexistentToken',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'winner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'uri',
        type: 'string',
      },
    ],
    name: 'BadgeMinted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_fromTokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_toTokenId',
        type: 'uint256',
      },
    ],
    name: 'BatchMetadataUpdate',
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
        name: '_tokenId',
        type: 'uint256',
      },
    ],
    name: 'MetadataUpdate',
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
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
    inputs: [],
    name: 'renounceOwnership',
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
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
  {
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
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
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
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
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
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
// 🖼️ Dohvaćanje NFT informacija
async function getNFTInfo() {
  const gameId = document.getElementById('nft-game-id').value;
  try {
    const owner = await contract.ownerOf(gameId);
    const uri = await contract.tokenURI(gameId);

    // Zamijeni ipfs:// s HTTP gateway URL-om
    const httpUri = uri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
    const response = await fetch(httpUri);
    const metadata = await response.json();

    const name = metadata.name || 'Nepoznato ime';
    const description = metadata.description || 'Bez opisa';
    const image = metadata.image || '';
    const imageIpfsUri = metadata.image;
    const imageHttpUri = imageIpfsUri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
    document.getElementById('nft-image').src = imageHttpUri;
    console.log('Korišteni image URI:', imageHttpUri);
    console.log(document.getElementById('nft-image'));

    document.getElementById('nft-output').innerText = `🎟️ Vlasnik: ${owner}\n🧾 URI: ${uri}\n📛 Naziv: ${name}\n📝 Opis: ${description}`;
    const imgElement = document.getElementById('nft-image');
    imgElement.src = image;
    imgElement.style.display = 'block';
  } catch (err) {
    alert(err.reason || err.message);
  }
}
