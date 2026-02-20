"use client";

import { useState } from "react";

export default function Home() {
  const [jsonInput, setJsonInput] = useState("");
  const [partyId, setPartyId] = useState("");
  const [result, setResult] = useState("");

  const storeData = async () => {
    try {
      const response = await fetch("http://localhost:3001/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: JSON.parse(jsonInput),
          partyId,
        }),
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch {
      setResult("Invalid JSON or API error");
    }
  };

  const decryptData = async () => {
    const response = await fetch(
      `http://localhost:3001/decrypt/${partyId}`
    );
    const data = await response.json();
    setResult(JSON.stringify(data, null, 2));
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Secure Transaction Service 🔐</h1>

      <input
        placeholder="Party ID"
        value={partyId}
        onChange={(e) => setPartyId(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder='{"amount":100}'
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        rows={5}
        cols={40}
      />

      <br /><br />

      <button onClick={storeData}>
        Encrypt & Store
      </button>

      <button onClick={decryptData} style={{ marginLeft: 10 }}>
        Decrypt
      </button>

      <pre>{result}</pre>
    </div>
  );
}
