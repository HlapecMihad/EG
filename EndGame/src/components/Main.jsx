import Languages from "./Languages";
import Word from "./Word";
import Letter from "./Letter";
import { languages } from "../languages/languages";
import React from "react";
import { clsx } from "clsx";
import { getFarewellText, getRandomWord } from "../utils/utils";
import Confetti from "react-confetti";

export default function Main() {
	const [currentWord, setCurrentWord] = React.useState(() => getRandomWord());
	const [guessedLetters, setGuessedLetters] = React.useState([]);

	const alphabet = "abcdefghijklmnopqrstuvwxyz";

	const wrongGuessCount = guessedLetters.filter(
		(letter) => !currentWord.includes(letter)
	).length;

	const isGameWon = currentWord
		.split("")
		.every((letter) => guessedLetters.includes(letter));

	const isGameLost = wrongGuessCount >= languages.length - 1;

	const isGameOver = isGameWon || isGameLost;

	const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
	const isLastGuessIncorrect =
		lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

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

	const wordElements = currentWord.split("").map((letter, index) => {
		const letterClassName = clsx(
			isGameLost && !guessedLetters.includes(letter) && "missed-letter"
		);
		return (
			<span key={index} className={letterClassName}>
				{guessedLetters.includes(letter) || isGameLost
					? letter.toUpperCase()
					: ""}
			</span>
		);
	});

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
				disabled={isGameOver}
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

	const gameStatusClass = clsx("game-status", {
		won: isGameWon,
		lost: isGameLost,
		farewell: !isGameOver && isLastGuessIncorrect,
	});

	function renderGameStatus() {
		if (!isGameOver && isLastGuessIncorrect) {
			return (
				<p className="farewell-message">
					{getFarewellText(languages[wrongGuessCount - 1].name)}
				</p>
			);
		}

		if (isGameWon) {
			return (
				<>
					<h2>You win!</h2>
					<p>Well done! 🎉</p>
				</>
			);
		}
		if (isGameLost) {
			return (
				<>
					<h2>Game over!</h2>
					<p>You lose! Better start learning Assembly 😭</p>
				</>
			);
		}

		return null;
	}

	function startNewGame() {
		setCurrentWord(getRandomWord());
		setGuessedLetters([]);
	}

	return (
		<main>
			{isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}
			<div>
				<h1 className="instructions">Assembly: Endgame</h1>
				<p className="static-text">
					Guess the word in under 8 attempts to keep the programming world safe
					from Assembly!
				</p>
			</div>
			<section className={gameStatusClass}>{renderGameStatus()}</section>
			<section className="language-chips">
				<Languages languages={languageElements} />
			</section>
			<section className="word">
				<Word wordElements={wordElements} />
			</section>
			<section className="keyboard">
				<Letter keyboardElements={keyboardElements} />
			</section>
			{isGameOver && (
				<button onClick={startNewGame} className="new-game">
					New Game
				</button>
			)}
		</main>
	);
}
