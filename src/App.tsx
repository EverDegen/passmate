import { useEffect, useState, useCallback, useRef } from "react";
import { ThemeProvider } from "@/components/theme-provder";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Clipboard, RefreshCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/theme-toggle";

interface Settings {
  uppercase: boolean;
  number: boolean;
  lowercase: boolean;
  symbol: boolean;
}

const initialSettings: Settings = {
  uppercase: true,
  number: true,
  lowercase: true,
  symbol: true,
};

const characters = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
} as const;

export default function App() {
  const [length, setLength] = useState(12);
  const [strength, setStrength] = useState(0);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const iconRef = useRef<HTMLButtonElement>(null);

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      console.error("Failed to copy password:", error);
    }
  };

  const generatePassword = useCallback(() => {
    let charset = "";
    if (settings.uppercase) charset += characters.uppercase;
    if (settings.lowercase) charset += characters.lowercase;
    if (settings.number) charset += characters.numbers;
    if (settings.symbol) charset += characters.symbols;

    if (charset === "") {
      setPassword("");
      return;
    }

    let result = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += charset.charAt(array[i] % charset.length);
    }
    setPassword(result);
  }, [length, settings]);

  const calculateStrength = useCallback((pass: string) => {
    let score = 0;

    // Length check
    if (pass.length >= 8) score += 20;
    if (pass.length >= 12) score += 10;

    // Complexity checks
    if (/[a-z]/.test(pass)) score += 10;
    if (/[A-Z]/.test(pass)) score += 15;
    if (/[0-9]/.test(pass)) score += 15;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;

    // Variety check
    const uniqueChars = new Set(pass).size;
    if (uniqueChars > 6) score += 10;

    // Prevent common patterns
    if (/^[A-Za-z]+\d+$/.test(pass)) score -= 10;
    if (/password/i.test(pass)) score -= 20;
    if (/12345/.test(pass)) score -= 20;

    return Math.max(0, Math.min(100, score));
  }, []);

  const getStrengthMessage = (strengthScore: number) =>
    strengthScore < 50 ? "Weak" : strengthScore < 90 ? "Medium" : "Strong";

  useEffect(() => {
    const newStrength = calculateStrength(password);
    setStrength(newStrength);
  }, [password, calculateStrength]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleLengthChange = (value: number[]) => {
    setLength(value[0]);
  };

  const handleInputLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(4, Math.min(50, parseInt(e.target.value) || 4));
    setLength(newValue);
  };

  const handleSettingChange = (key: keyof Settings) => {
    setSettings((prevSettings) => {
      // Prevent disabling all checkboxes
      if (
        Object.values(prevSettings).filter(Boolean).length === 1 &&
        prevSettings[key]
      ) {
        return prevSettings;
      }
      return {
        ...prevSettings,
        [key]: !prevSettings[key],
      };
    });
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="flex items-center justify-center h-screen p-2">
        <Card className="w-full max-w-[375px]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">🔐 Passmate</CardTitle>
                <CardDescription>Random Password Generator</CardDescription>
              </div>
              <ThemeToggle />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-5">
              <div className="flex items-end gap-2">
                <div className="w-full">
                  <Input
                    readOnly
                    placeholder="Your random password"
                    value={password}
                    className="font-mono cursor-copy"
                  />
                </div>

                <div className="flex gap-1">
                  <Button
                    className="cursor-pointer"
                    variant="outline"
                    size="icon"
                    onClick={copyPassword}
                    title="Copy password"
                  >
                    {copied ? <Check /> : <Clipboard />}
                  </Button>
                  <Button
                    ref={iconRef}
                    className="cursor-pointer"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      generatePassword();
                      if (iconRef.current) {
                        iconRef.current.classList.toggle("rotate-90");
                      }
                    }}
                    title="Generate new password"
                  >
                    <RefreshCcw />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full">
                <Progress value={strength} className="w-full" />
                <span className="w-max text-sm">
                  {getStrengthMessage(strength)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Slider
                  className="w-full cursor-ew-resize"
                  defaultValue={[12]}
                  max={50}
                  min={4}
                  step={1}
                  value={[length]}
                  onValueChange={handleLengthChange}
                  title="Adjust password length"
                />
                <Input
                  className="w-12"
                  min={4}
                  max={50}
                  value={length}
                  onChange={handleInputLengthChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="grid grid-cols-2 grid-rows-2 gap-2">
            {Object.keys(settings).map((key) => (
              <div key={key} className="flex items-center gap-1">
                <Checkbox
                  className="cursor-pointer"
                  checked={settings[key as keyof Settings]}
                  onCheckedChange={() =>
                    handleSettingChange(key as keyof Settings)
                  }
                  disabled={
                    Object.values(settings).filter(Boolean).length === 1 &&
                    settings[key as keyof Settings]
                  }
                  id={`checkbox-${key}`}
                />
                <Label
                  htmlFor={`checkbox-${key}`}
                  className="cursor-pointer capitalize"
                >
                  {key}
                </Label>
              </div>
            ))}
          </CardFooter>
        </Card>
      </main>
    </ThemeProvider>
  );
}
