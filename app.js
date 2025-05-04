let contract;
let signer;

const CONTRACT_ADDRESS = '0x8e88a9E66496C269bd4338E1CD6B8D329C8d3916'; // zamijeni ako deployaš novi
const CONTRACT_ABI = [
  // Samo jedan sloj objekata, bez dodatne [] unutar
  {
    anonymous: false,
    inputs: [],
    name: 'GameDraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{
      indexed: false, internalType: 'address', name: 'playerO', type: 'address',
    }],
    name: 'GameJoined',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{
      indexed: false, internalType: 'address', name: 'winner', type: 'address',
    }],
    name: 'GameWon',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false, internalType: 'address', name: 'player', type: 'address',
      },
      {
        indexed: false, internalType: 'uint8', name: 'row', type: 'uint8',
      },
      {
        indexed: false, internalType: 'uint8', name: 'col', type: 'uint8',
      },
    ],
    name: 'MoveMade',
    type: 'event',
  },
  {
    inputs: [],
    name: 'joinGame',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint8', name: 'row', type: 'uint8' },
      { internalType: 'uint8', name: 'col', type: 'uint8' },
    ],
    name: 'makeMove',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'board',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentPlayer',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'gameActive',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'playerO',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'playerX',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stake',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      const address = await signer.getAddress();
      document.getElementById('wallet-address').innerText = `Povezano: ${address}`;

      contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      console.log('Uspješno povezan s ugovorom.');
    } catch (err) {
      console.error('Greška prilikom povezivanja:', err);
      alert('Neuspješno povezivanje s MetaMaskom.');
    }
  } else {
    alert('MetaMask nije instaliran!');
  }
}

async function joinGame() {
  if (!contract) {
    alert('Prvo se moraš povezati s MetaMaskom!');
    return;
  }
  try {
    const stake = await contract.stake();
    const tx = await contract.joinGame({ value: stake });
    await tx.wait();
    alert('Uspješno si se pridružio igri!');
  } catch (err) {
    console.error('Greška prilikom pridruživanja:', err);
    alert(`Greška: ${err?.reason}` || err.message);
  }
}

async function makeMove() {
  if (!contract) {
    alert('Prvo se moraš povezati s MetaMaskom!');
    return;
  }
  const row = parseInt(document.getElementById('row').value);
  const col = parseInt(document.getElementById('col').value);
  try {
    const tx = await contract.makeMove(row, col);
    await tx.wait();
    alert('Potez zabilježen!');
  } catch (err) {
    console.error('Greška kod poteza:', err);
    alert(`Greška kod poteza: ${err?.reason}` || err.message);
  }
}

async function getBoard() {
  if (!contract) {
    alert('Prvo se moraš povezati s MetaMaskom!');
    return;
  }
  let output = '';
  for (let row = 0; row < 3; row++) {
    let line = '';
    for (let col = 0; col < 3; col++) {
      const cell = await contract.board(row, col);
      line += `${cell.toString()} `;
    }
    output += `${line.trim()}\n`;
  }
  document.getElementById('board-output').innerText = output;
}
