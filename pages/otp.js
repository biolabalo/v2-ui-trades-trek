import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const VerificationCodeInput = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(58);
  const [clipboard, setClipboard] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCodeChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  const handleKeyPress = (key) => {
    const emptyIndex = code.findIndex((digit) => digit === '');
    if (emptyIndex !== -1) {
      handleCodeChange(emptyIndex, key);
    }
  };

  const handleBackspace = () => {
    const lastFilledIndex = code.findLastIndex((digit) => digit !== '');
    if (lastFilledIndex !== -1) {
      handleCodeChange(lastFilledIndex, '');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <button className="mr-4">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Verification</h1>
        </div>

        <p className="mb-6">
          Enter the One-time 6-digit code sent to you at o***11@gmail.com
        </p>

        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <div className="flex justify-between mb-4">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                className="w-12 h-12 text-center bg-transparent border-2 border-gray-700 rounded"
              />
            ))}
          </div>
          <p className="text-center text-gray-400">
            Did not get the code? Resend in {timer} secs
          </p>
        </div>

        <div className="bg-gray-800 p-2 rounded-lg mb-6">
          <p className="text-center text-gray-400">Copied on clipboard</p>
          <p className="text-center text-xl">{clipboard}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className="bg-gray-700 rounded-lg p-4 text-center"
            >
              <div className="text-xl">{num}</div>
              <div className="text-xs text-gray-400">
                {num === 1 ? '' : num === 2 ? 'ABC' : num === 3 ? 'DEF' : num === 4 ? 'GHI' : num === 5 ? 'JKL' : num === 6 ? 'MNO' : num === 7 ? 'PQRS' : num === 8 ? 'TUV' : 'WXYZ'}
              </div>
            </button>
          ))}
          <button
            onClick={() => handleKeyPress('0')}
            className="bg-gray-700 rounded-lg p-4 text-center"
          >
            <div className="text-xl">0</div>
          </button>
          <button
            onClick={handleBackspace}
            className="bg-gray-700 rounded-lg p-4 text-center"
          >
            <div className="text-xl">⌫</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationCodeInput;