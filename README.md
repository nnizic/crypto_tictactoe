# 🎮 Web3 Tic Tac Toe

Pametni ugovor i frontend aplikacija za decentraliziranu igru **Tic Tac Toe** s podrškom za:

- ✅ Više simultanih partija
- ✅ Uloge u ETH
- ✅ Detekciju pobjednika i isplatu nagrade
- ✅ Resetiranje igre

## 🧠 Tehnologije

- **Solidity** – pametni ugovor (`TicTacToe.sol`)
- **Remix IDE / Hardhat** – deploy i testiranje ugovora
- **MetaMask** – povezivanje korisnika
- **Ethers.js** – interakcija s ugovorom u `app.js`
- **HTML/CSS/JavaScript** – frontend

---

## 📄 TicTacToe.sol – funkcionalnosti

- `createGame()` – stvori novu partiju s ulogom (msg.value)
- `joinGame(gameId)` – pridruži se igri s istim ulogom
- `makeMove(gameId, row, col)` – odigraj potez
- `getGameStatus(gameId)` – dohvaća status igre
- `getCell(gameId, row, col)` – dohvaća stanje jedne ćelije
- `resetGame(gameId)` – resetira partiju
- Automatska isplata pobjedniku ili oba igrača (u slučaju remija)

---

## 🕹️ Korištenje

1. **Deploy pametnog ugovora**

   - Koristi Remix (https://remix.ethereum.org)
   - Uploadaj `TicTacToe.sol`
   - Deployaj na lokalnu mrežu (npr. Ganache ili Hardhat node)

2. **Konfiguriraj `app.js`**

   - Unesi adresu pametnog ugovora i ABI
   - Uvjeri se da MetaMask koristi istu mrežu kao tvoj backend

3. **Pokreni frontend**
   - Otvori `index.html` u pregledniku
   - Spoji se putem MetaMaska
   - Klikni `Stvori igru`, `Pridruži se`, igraj i pobijedi!

---

## 👥 Više istovremenih igara

Svaka partija ima jedinstveni `gameId`. Igrači mogu:

- Pratiti više aktivnih igara
- Igrati više puta bez redeployanja ugovora
- Promatrati ili resetirati partije u kojima su sudjelovali

---

## 🔒 Sigurnosne napomene

- Oba igrača moraju uplatiti točno isti iznos ETH-a
- Igra se ne može odigrati protiv samoga sebe
- Pobjednik automatski prima nagradu (2x ulog)
- Frontend provjerava status partije i ažurira prikaz

---

## 🛠️ Daljnji razvoj (moguće nadogradnje)

- Leaderboard / rang lista pobjednika
- NFT badge za pobjednike
- Podrška za igranje protiv računala (AI)
- Pohrana partija u IPFS / backend
- Mobilna verzija

---

## 📸 Screenshotovi

---

## 📃 Organizacija

FIPU
