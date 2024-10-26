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

      <section>
        <h1>Random Password Generator</h1>

        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </section>

      <section>
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
      </section>
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
        <button onClick={handleRegenerate} title="Regenerate">
          Regenerate
        </button>
      </section>
    </div>
  );
}

export default App;
