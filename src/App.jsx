import { useState, useEffect, useRef } from "react";
import {
  SunIcon,
  MoonIcon,
  ArrowPathIcon,
  ClipboardIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const characters = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function App() {
  const [length, setLength] = useState(12);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [isDark, setIsDark] = useState(true);
  const iconRef = useRef(null);

  function generatePassword() {
    let charset = "";
    if (settings.uppercase) charset += characters.uppercase;
    if (settings.lowercase) charset += characters.lowercase;
    if (settings.numbers) charset += characters.numbers;
    if (settings.symbols) charset += characters.symbols;

    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }

  function getStrength() {
    if (length < 8) return { strength: "Weak", color: "bg-red-500", value: 33 };
    if (length < 12)
      return { strength: "Good", color: "bg-yellow-500", value: 66 };
    return { strength: "Strong", color: "bg-green-500", value: 100 };
  }

  useEffect(() => {
    generatePassword();
  }, [length, settings]);

  return (
    <div className={isDark ? "dark" : "light"}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 flex items-center justify-center md:p-4 p-2">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl md:p-8 p-2 w-full max-w-xl space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              🔐Passmate
            </h1>

            <button
              onClick={() => setIsDark((cur) => !cur)}
              className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <SunIcon className="w-6 h-6" />
              ) : (
                <MoonIcon className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Password Display */}
          <div className="relative">
            <input
              type="text"
              value={password}
              readOnly
              className="w-full p-5 bg-gray-50 dark:bg-gray-700 rounded-lg text-xl font-mono pr-28 text-gray-800 dark:text-gray-200"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <button
                onClick={() => {
                  generatePassword();
                  if (iconRef.current) {
                    iconRef.current.classList.toggle("rotate-90");
                  }
                }}
                ref={iconRef}
                className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                aria-label="Regenerate password"
              >
                <ArrowPathIcon className="w-6 h-6" />
              </button>
              <button
                onClick={copyToClipboard}
                className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                aria-label="Copy password"
              >
                {copied ? (
                  <CheckIcon className="w-6 h-6 text-green-500" />
                ) : (
                  <ClipboardIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Password Strength */}
          <div className="space-y-3">
            <div className="flex justify-between text-base text-gray-700 dark:text-gray-300">
              <span className="text-lg text-gray-700 dark:text-gray-300">
                Password Strength
              </span>
              <span className="text-lg text-gray-700 dark:text-gray-300">
                {getStrength().strength}
              </span>
            </div>
            <meter
              min="0"
              max="100"
              low="40"
              high="70"
              optimum="80"
              value={getStrength().value}
              className="w-full"
            />
          </div>

          {/* Length Controls */}
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <label className="text-lg text-gray-700 dark:text-gray-300">
                Password Length
              </label>
              <input
                type="number"
                min="4"
                max="50"
                value={length}
                onChange={(e) =>
                  setLength(
                    Math.max(4, Math.min(50, parseInt(e.target.value) || 4))
                  )
                }
                className="w-20 p-2 border dark:border-gray-600 rounded text-center bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>
            <input
              type="range"
              min="4"
              max="50"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Settings */}
          <div className="grid md:grid-cols-2 gap-y-2">
            {Object.keys(settings).map((key) => (
              <label
                className="flex cursor-pointer items-center space-x-3 text-lg text-gray-700 dark:text-gray-300"
                name={key}
                key={key}
              >
                <input
                  type="checkbox"
                  checked={settings[key]}
                  onChange={() =>
                    setSettings((prevSettings) => ({
                      ...prevSettings,
                      [key]: !prevSettings[key],
                    }))
                  }
                  disabled={
                    Object.values(settings).filter(Boolean).length === 1 &&
                    settings[key]
                  }
                  className="w-5 h-5 cursor-pointer rounded accent-blue-500"
                />
                <span className="text-transform: capitalize">{`include ${key} ${
                  key === "uppercase" || key === "lowercase" ? "letters" : ""
                } `}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
