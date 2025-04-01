import React, { useState, useCallback } from "react";

const DictionaryWidget = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [definitions, setDefinitions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDefinition = useCallback(async (word) => {
    if (!word.trim()) {
      setDefinitions([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError("No definitions found for this word.");
        } else {
          setError(`Error fetching definition: ${response.status}`);
        }
        setDefinitions([]);
      } else {
        const data = await response.json();
        setDefinitions(data);
      }
    } catch (err) {
      setError("Failed to fetch definition.");
      console.error("Dictionary API error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const debouncedFetch = useCallback(debounce(fetchDefinition, 500), [fetchDefinition]);

  const handleInputChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    debouncedFetch(newSearchTerm);
  };

  return (
    <div className="w-full h-[500px] bg-white rounded-xl shadow-lg border border-gray-300 p-4 overflow-y-auto flex flex-col">
      <h2 className="text-xl font-bold text-center text-blue-800 mb-3">📘 Dictionary</h2>
      <input
        type="text"
        placeholder="Search for a word..."
        value={searchTerm}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3 text-sm"
      />
      {loading && <p className="text-blue-500 text-sm text-center">Searching...</p>}
      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      <div className="flex-1 overflow-y-auto">
        {definitions.map((entry, index) => (
          <div key={index} className="mb-4">
            {/* Word */}
            {entry.word && <h3 className="text-lg font-semibold text-blue-700 mb-1">{entry.word}</h3>}

            {/* Origin */}
            {entry.origin && (
              <p className="text-xs text-gray-500 italic mb-2">Origin: {entry.origin}</p>
            )}

            {/* Phonetics */}
            {entry.phonetics?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {entry.phonetics.map((phonetic, pIndex) => (
                  <div key={pIndex} className="flex items-center gap-2">
                    {phonetic.audio && (
                      <audio controls src={phonetic.audio} className="h-6" preload="none"></audio>
                    )}
                    {phonetic.text && (
                      <span className="text-sm text-gray-700 italic">/{phonetic.text}/</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Meanings */}
            {entry.meanings.map((meaning, mIndex) => (
              <div key={mIndex} className="mb-3">
                <p className="text-sm font-medium text-purple-700 mb-1 capitalize">
                  {meaning.partOfSpeech}
                </p>
                <ul className="list-disc ml-4 text-sm text-gray-800">
                  {meaning.definitions.map((def, dIndex) => (
                    <li key={dIndex} className="mb-1">
                      {def.definition}
                      {def.example && (
                        <div className="text-xs italic text-gray-500">"{def.example}"</div>
                      )}
                      {def.synonyms?.length > 0 && (
                        <div className="text-xs text-green-700">
                          <strong>Synonyms:</strong> {def.synonyms.join(", ")}
                        </div>
                      )}
                      {def.antonyms?.length > 0 && (
                        <div className="text-xs text-red-700">
                          <strong>Antonyms:</strong> {def.antonyms.join(", ")}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DictionaryWidget;
