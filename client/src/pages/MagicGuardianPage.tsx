import React, { useState } from 'react';

const MagicGuardianPage: React.FC = () => {
  const [treasure, setTreasure] = useState('Moeda de Ouro');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">

        <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
          O Guardião Mágico das Variáveis
        </h1>

        <p className="text-lg mb-6">
          Em programação, uma "variável" é como um guardião mágico. A missão dele é proteger um tesouro. Este tesouro pode mudar, mas o guardião sempre saberá qual é o tesouro atual.
        </p>

        {/* Placeholder for the image */}
        <div className="my-6">
          <img
            src="/magic_guardian.png"
            alt="Guardião Mágico"
            className="w-48 h-48 mx-auto object-cover rounded-full border-4 border-indigo-500"
            // Simple placeholder styling if the image is not found
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none'; // Hide broken image icon
              const placeholder = document.createElement('div');
              placeholder.className = 'w-48 h-48 mx-auto rounded-full border-4 border-indigo-500 flex items-center justify-center bg-gray-200 dark:bg-gray-700';
              placeholder.innerText = 'Imagem do Guardião';
              target.parentNode?.insertBefore(placeholder, target);
            }}
          />
        </div>

        {/* Placeholder for the audio narration */}
        <div className="my-6">
          <p className="mb-2">Ouça a história:</p>
          <audio controls className="mx-auto">
            <source src="/magic_guardian_narration.mp3" type="audio/mpeg" />
            Seu navegador não suporta o elemento de áudio.
          </audio>
        </div>

        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            O Tesouro do Guardião é:
          </h2>
          <p className="text-3xl font-mono p-4 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-md">
            {treasure}
          </p>
        </div>

        <div className="mt-8">
          <p className="text-lg mb-4">Vamos trocar o tesouro que o guardião protege!</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setTreasure('Poção Mágica')}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
            >
              Dar Poção Mágica
            </button>
            <button
              onClick={() => setTreasure('Cristal de Luz')}
              className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
            >
              Dar Cristal de Luz
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MagicGuardianPage;
