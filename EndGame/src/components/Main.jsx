import Languages from "./Languages";
import Word from "./Word";
import Letter from "./Letter";
import { languages } from "../languages/languages";
import React from "react";
import { clsx } from "clsx";

export default function Main() {
	const [currentWord, setCurrentWord] = React.useState("react");
	const [guessedLetters, setGuessedLetters] = React.useState([]);

	const alphabet = "abcdefghijklmnopqrstuvwxyz";

	const wrongGuessCount = guessedLetters.filter(
		(letter) => !currentWord.includes(letter)
	).length;

	console.log(wrongGuessCount);

	const languageElements = languages.map((lang, index) => {
		const isLanguageLost = index < wrongGuessCount;
		const styles = {
			backgroundColor: lang.backgroundColor,
			color: lang.color,
		};

		const className = clsx("chip", isLanguageLost && "lost");

		return (
			<span className={className} style={styles} key={lang.name}>
				{lang.name}
			</span>
		);
	});

	const wordElements = currentWord.split("").map((letter, index) => (
		<span key={index} className="word-letter">
			{guessedLetters.includes(letter) ? letter.toUpperCase() : ""}
		</span>
	));

	const keyboardElements = alphabet.split("").map((letter) => {
		const isGuessed = guessedLetters.includes(letter);
		const isCorrect = isGuessed && currentWord.includes(letter);
		const isWrong = isGuessed && !currentWord.includes(letter);
		const className = clsx({
			correct: isCorrect,
			wrong: isWrong,
		});

		return (
			<button
				className={className}
				key={letter}
				onClick={() => clickedLetter(letter)}
			>
				{letter.toUpperCase()}
			</button>
		);
	});

	function clickedLetter(letter) {
		setGuessedLetters((prevLetters) =>
			prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
		);
	}

	return (
		<main>
			<div>
				<h1 className="instructions">Assembly: Endgame</h1>
				<p className="static-text">
					Guess the word in under 8 attempts to keep the programming world safe
					from Assembly!
				</p>
			</div>
			<section className="game-status">
				<h2>You win!</h2>
				<p>Well done! 🎉</p>
			</section>
			<section className="language-chips">
				<Languages languages={languageElements} />
			</section>
			<section className="word">
				<Word wordElements={wordElements} />
			</section>
			<section className="keyboard">
				<Letter keyboardElements={keyboardElements} />
			</section>
			<button className="new-game">New Game</button>
		</main>
	);
}
