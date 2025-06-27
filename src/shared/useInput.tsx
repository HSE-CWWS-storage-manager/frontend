import React, {type ReactNode, useState} from "react";

function useInput(placeholder: string, type: React.HTMLInputTypeAttribute = "text"): [ReactNode, string, React.Dispatch<React.SetStateAction<string>>] {
    const [input, setInput] = useState<string>("");

    const inputElement =
        <input
            type={type}
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
        />

    return [inputElement, input, setInput];
}

export default useInput;