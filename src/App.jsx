import { useState, useEffect } from "react";

function App() {
  const [passwordLength, setPasswordLength] = useState(8);
  const [password, setPassword] = useState("");

  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);

  const [regenerate, setRegenerate] = useState(false);
  const [copyPassword, setCopyPassword] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(password);
    setCopyPassword(true);
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
    <div className="container">
      <header className="flex">
        <div>
          <img src="data:image/png;base64,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" />
        </div>
        <hgroup>
          <h1>Passmate</h1>
          <h2>Random Password Generator</h2>
        </hgroup>
      </header>

      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label>
        Password Length
        <input
          type="number"
          name="password_length"
          value={passwordLength}
          onChange={(e) => setPasswordLength(Number(e.target.value))}
          onBlur={(e) => {
            const value = Number(e.target.value);
            if (value < 4) {
              setPasswordLength(4);
            } else if (value > 24) {
              setPasswordLength(24);
            }
          }}
        />
      </label>

      <label>
        {passwordLength < 8
          ? "Weak"
          : passwordLength >= 8 && passwordLength < 16
          ? "Good"
          : "Strong"}
        <input
          type="range"
          min={4}
          max={24}
          title={passwordLength}
          value={passwordLength}
          onChange={(e) => setPasswordLength(Number(e.target.value))}
        />
      </label>

      <section className="grid">
        <label>
          <input
            type="checkbox"
            name="uppercase"
            checked={uppercase}
            disabled={!lowercase && !numbers && !symbols}
            onChange={(e) => setUppercase(e.target.checked)}
          />
          Uppercase
        </label>

        <label>
          <input
            type="checkbox"
            name="lowercase"
            checked={lowercase}
            disabled={!uppercase && !numbers && !symbols}
            onChange={(e) => setLowercase(e.target.checked)}
          />
          Lowercase
        </label>

        <label>
          <input
            type="checkbox"
            name="numbers"
            checked={numbers}
            disabled={!uppercase && !lowercase && !symbols}
            onChange={(e) => setNumbers(e.target.checked)}
          />
          Numbers
        </label>

        <label>
          <input
            type="checkbox"
            name="symbols"
            checked={symbols}
            disabled={!uppercase && !lowercase && !numbers}
            onChange={(e) => setSymbols(e.target.checked)}
          />
          Symbols
        </label>
      </section>
      <section className="grid">
        <button onClick={handleCopy} title="Copy">
          Copy Password
        </button>
        <button
          className="secondary"
          onClick={handleRegenerate}
          title="Regenerate"
        >
          Regenerate
        </button>
      </section>
      <dialog open={copyPassword}>
        <article>
          <header>
            <button
              onClick={() => setCopyPassword(false)}
              aria-label="Close"
              rel="prev"
            ></button>
            <p>
              <strong>✅ Password Copied Successfully </strong>
            </p>
          </header>
          <p>Password has been copied successfully to your clipboard.</p>
        </article>
      </dialog>
    </div>
  );
}

export default App;
