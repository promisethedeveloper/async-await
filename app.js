let baseURL = "http://numbersapi.com/";
let favoriteNum = 30;
const singleNum = document.querySelector("p");

// PART 1 ****** NUMBER FACTS *******
//1.
async function getNumberFacts(favoriteNum) {
	let response = await axios.get(`${baseURL}${favoriteNum}?json`);
	try {
		singleNum.textContent = response.data.text;
	} catch (e) {
		console.log("Error", e);
	}
}
getNumberFacts(favoriteNum);

// Multiple numbers in a single request
let min = 1;
let max = 5;

// 2.
async function multiple(min, max) {
	let response = await axios.get(`${baseURL}${min}..${max}?json`);
	for (let i = min; i <= max; i++) {
		try {
			console.log(response.data[i]);
			const ul = document.querySelector(".multiple-res");
			const li = document.createElement("li");
			li.append(response.data[i]);
			ul.append(li);
		} catch (e) {
			console.log("Error", e);
		}
	}
}
multiple(min, max);

// 3;
async function fourfacts(favoriteNum) {
	let facts = await Promise.all(
		// The axios.get function runs 4 times because of {length: 4}
		Array.from({ length: 4 }, () => {
			return axios.get(`${baseURL}${favoriteNum}?json`);
		})
	);
	const span = document.querySelector("span");
	span.append(`${favoriteNum}`);
	for (let res of facts) {
		const ul = document.querySelector(".multiple-res-same-num");
		const li = document.createElement("li");
		li.append(res.data.text);
		ul.append(li);
	}
}
fourfacts(favoriteNum);

// PART 2 ****** DECK OF CARDS *******
// let response3 = axios
// 	.get("http://deckofcardsapi.com/api/deck/new/draw/?count=1")
// 	.then((res) => {
// 		const value = res.data.cards[0].value;
// 		const suit = res.data.cards[0].suit;
// 		console.log(`${value} of ${suit}`);
// 	});

async function deck() {
	let response = await axios.get(
		"http://deckofcardsapi.com/api/deck/new/draw/?count=1"
	);
	const value = response.data.cards[0].value;
	const suit = response.data.cards[0].suit;
	console.log(`${value} of ${suit}`);
}
deck();

let firstCard = null;
async function deckOfCards() {
	let response = await axios.get(
		"http://deckofcardsapi.com/api/deck/new/draw/?count=1"
	);
	let deckID = response.data.deck_id;
	firstCard = response.data.cards[0];
	let response2 = await axios.get(
		`http://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`
	);
	let secondCard = response2.data.cards[0];
	[firstCard, secondCard].forEach((el) => {
		console.log(`${el.value} of ${el.suit}`);
	});
}

// Hide the button
const btn = document.querySelector("button");
btn.style.visibility = "hidden";
let deckID = null;

async function showcards() {
	let response = await axios.get(
		"http://deckofcardsapi.com/api/deck/new/shuffle/"
	);
	deckID = response.data.deck_id;
	btn.style.visibility = "";
}

async function gimeACard() {
	let response = await axios.get(
		`http://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`
	);
	const img = document.createElement("img");
	let angle = Math.random() * 90 - 45;
	let randomX = Math.random() * 40 - 20;
	let randomY = Math.random() * 40 - 20;
	img.src = response.data.cards[0].image;
	img.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${angle}deg)`;
	const imgDiv = document.querySelector(".card-area");
	imgDiv.append(img);
	if (response.data.remaining === 0) {
		btn.removeEventListener("click", (btn.style.visibility = "hidden"));
	}
}

document.addEventListener("DOMContentLoaded", showcards);
btn.addEventListener("click", gimeACard);
