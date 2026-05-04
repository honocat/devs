import { useState } from "react";

import AppInfo from "@/components/AppInfo";
import GeneratedPass from "@/components/GeneratedPass";
import PassLength from "@/components/PassLength";
import PassOptions from "@/components/PassOptions";
import GenerateButton from "@/components/GenerateButton";

import { Card, CardContent } from "@/components/ui/card";

function App() {
  const [pass, setPass] = useState("");
  const [length, setLength] = useState(20);
  const [options, setOptions] = useState({
    num: true,
    sym: true,
    low: true,
    upp: true,
  });

  // if (!options.num && !options.sym && !options.low && !options.upp) {
  //   setOptions({
  //     ...options,
  //     num: true,
  //   });
  // }

  const characters = {
    numbers: "0123456789",
    symbols: "!$%&|[](){}:;.,*+-#@<>~",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  };

  const generatePass = () => {
    let generatedPass = "";
    let c = "";

    options.num ? (c += characters.numbers) : (c += "");
    options.sym ? (c += characters.symbols) : (c += "");
    options.low ? (c += characters.lowercase) : (c += "");
    options.upp ? (c += characters.uppercase) : (c += "");

    for (let i = 0; i < length; i++) {
      let randomC = c[Math.floor(Math.random() * c.length)];
      generatedPass += randomC;
    }

    if (options.num || options.sym || options.low || options.upp) {
      setPass(generatedPass);
    } else {
      setPass("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto">
          <AppInfo />
          <CardContent className="space-y-6">
            {/* パスワード表示部分 */}
            <GeneratedPass pass={pass} />

            {/* パスワードの長さ設定 */}
            <PassLength
              length={length}
              setLength={setLength}
              generatePass={generatePass}
            />

            {/* パスワードオプション */}
            <PassOptions options={options} setOptions={setOptions} />

            {/* 生成ボタン */}
            <GenerateButton generatePass={generatePass} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
