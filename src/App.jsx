import { useState, useEffect } from "react";
import CopyIcon from "./assets/copy.svg";
import RefreshIcon from "./assets/refresh.svg";

function App() {
  const [passwordLength, setPasswordLength] = useState(8);
  const [password, setPassword] = useState("");

  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);

  const [regenerate, setRegenerate] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(password);
    alert("Password copied to clipboard!");
  }

  function handleRegenerate() {
    setRegenerate((prev) => !prev);
  }

  useEffect(
    function () {
      function generateRandomString(
        length,
        uppercase,
        lowercase,
        numbers,
        symbols
      ) {
        const characterSets = {
          uppercase: Array.from({ length: 26 }, (_, i) =>
            String.fromCharCode(65 + i)
          ).join(""),
          lowercase: Array.from({ length: 26 }, (_, i) =>
            String.fromCharCode(97 + i)
          ).join(""),
          numbers: Array.from({ length: 10 }, (_, i) =>
            String.fromCharCode(48 + i)
          ).join(""),
          symbols: Array.from({ length: 94 }, (_, i) =>
            String.fromCharCode(33 + i)
          )
            .filter(
              (char) =>
                (char >= "!" && char <= "/") ||
                (char >= ":" && char <= "@") ||
                (char >= "[" && char <= "`") ||
                (char >= "{" && char <= "~")
            )
            .join(""),
        };

        let availableChars = "";

        if (uppercase) availableChars += characterSets.uppercase;
        if (lowercase) availableChars += characterSets.lowercase;
        if (numbers) availableChars += characterSets.numbers;
        if (symbols) availableChars += characterSets.symbols;

        let randomString = "";
        for (let i = 0; i < length; i++) {
          randomString += availableChars.charAt(
            Math.floor(Math.random() * availableChars.length)
          );
        }

        return randomString;
      }
      if (!uppercase && !lowercase && !numbers && !symbols) return;
      setPassword(
        generateRandomString(
          passwordLength,
          uppercase,
          lowercase,
          numbers,
          symbols
        )
      );
    },
    [passwordLength, uppercase, lowercase, numbers, symbols, regenerate]
  );

  return (
    <div className="wrapper">
      <h1 className="title">random password generator</h1>
      <div className="header">
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="icon" onClick={handleCopy} title="Copy">
          <img src={CopyIcon} alt="copy icon" />
        </button>
        <button className="icon" onClick={handleRegenerate} title="Regenerate">
          <img src={RefreshIcon} alt="refresh icon" />
        </button>
      </div>
      <div className="main">
        <div className="length-selector">
          <label htmlFor="input-length">password length</label>
          <input
            type="number"
            id="input-length"
            value={passwordLength}
            onChange={(e) => setPasswordLength(Number(e.target.value))}
            onBlur={(e) => {
              const value = Number(e.target.value);
              if (value < 8) {
                setPasswordLength(8);
              } else if (value > 24) {
                setPasswordLength(24);
              }
            }}
          />
          <input
            type="range"
            style={{
              accentColor:
                passwordLength <= 11
                  ? "red"
                  : passwordLength >= 12 && passwordLength < 16
                  ? "yellow"
                  : "green",
            }}
            min={8}
            max={24}
            title={passwordLength}
            value={passwordLength}
            onChange={(e) => setPasswordLength(Number(e.target.value))}
          />
        </div>
        <ul>
          <li>
            <input
              type="checkbox"
              id="uppercase"
              checked={uppercase}
              disabled={!lowercase && !numbers && !symbols}
              onChange={(e) => setUppercase(e.target.checked)}
            />
            <label htmlFor="uppercase">uppercase</label>
          </li>
          <li>
            <input
              type="checkbox"
              id="lowercase"
              checked={lowercase}
              disabled={!uppercase && !numbers && !symbols}
              onChange={(e) => setLowercase(e.target.checked)}
            />
            <label htmlFor="lowercase">lowercase</label>
          </li>
          <li>
            <input
              type="checkbox"
              id="numbers"
              checked={numbers}
              disabled={!uppercase && !lowercase && !symbols}
              onChange={(e) => setNumbers(e.target.checked)}
            />
            <label htmlFor="numbers">numbers</label>
          </li>
          <li>
            <input
              type="checkbox"
              id="symbols"
              checked={symbols}
              disabled={!uppercase && !lowercase && !numbers}
              onChange={(e) => setSymbols(e.target.checked)}
            />
            <label htmlFor="symbols">symbols</label>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
