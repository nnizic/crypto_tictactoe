🕹️ Web3 Tic-Tac-Toe (Križić-Kružić)
Jednostavna decentralizirana igra križić-kružić implementirana pomoću Ethereum pametnih ugovora, ethers.js i MetaMask novčanika.

🚀 Značajke
Igrači se pridružuju igri uplatom istog uloga (stake)

Igra koristi pametni ugovor za upravljanje pravilima igre

Prikaz trenutnog stanja ploče (board)

MetaMask integracija za upravljanje identitetom i transakcijama

🛠️ Tehnologije
Solidity – Pametni ugovori

ethers.js – Interakcija s Ethereumom u pregledniku

MetaMask – Web3 novčanik

Remix IDE – Deploy i testiranje pametnih ugovora

📦 Instalacija i pokretanje
Kloniraj repozitorij:

bash
Copy
Edit
git clone https://github.com/tvoje-korisnicko-ime/web3-tictactoe.git
cd web3-tictactoe
Otvori index.html u pregledniku:

Preporuka je korištenje lokalnog servera, npr:

bash
Copy
Edit

# ako koristiš Python

python3 -m http.server 3000
I otvori u pregledniku: http://localhost:3000

Spoji MetaMask i prebaci se na odgovarajući network (npr. Sepolia ili Localhost)

📄 Upute za korištenje
Klikni “Poveži MetaMask” – MetaMask će zatražiti autorizaciju

Klikni “Pridruži se igri” – ulog mora odgovarati vrijednosti definiranoj u pametnom ugovoru (stake)

Koristi unos redaka/stupaca i klikni “Potez” da odigraš potez

Klikni “Dohvati ploču” da vidiš trenutno stanje ploče

⚠️ Napomene
Oba igrača moraju uplatiti identičan stake, inače pametni ugovor odbacuje transakciju ("Ulog mora biti isti")

Igra koristi brojeve za prikaz ploče:

0 – prazno

1 – igrač X

2 – igrač O

📁 Struktura

```
web3-tictactoe/
│
├── index.html # Klijent (frontend)
├── app.js # logika aplikacije u pregledniku (ethers.js)
├── contract.sol # (opcionalno) Solidity pametni ugovor
└── README.md # ovaj dokument
```

📜 Organizacija

FIPU - BlockChain Aplikacije 2025.
