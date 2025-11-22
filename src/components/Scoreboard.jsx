export default function Scoreboard({ pnl, score, position, entryPrice, currentPrice }) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg mt-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-gray-400 text-sm">Current Price</div>
            <div className="text-2xl font-bold">${currentPrice.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Position</div>
            <div className="text-2xl font-bold">
              {position ? (
                <span className="text-green-400">{position}</span>
              ) : (
                <span className="text-gray-500">NONE</span>
              )}
            </div>
          </div>
          {entryPrice && (
            <div>
              <div className="text-gray-400 text-sm">Entry Price</div>
              <div className="text-xl font-bold">${entryPrice.toFixed(2)}</div>
            </div>
          )}
          <div>
            <div className="text-gray-400 text-sm">Unrealized P&L</div>
            <div className={`text-2xl font-bold ${pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
              ${pnl.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700 text-center">
          <div className="text-gray-400 text-sm">Total Score</div>
          <div className={`text-3xl font-bold ${score >= 0 ? "text-green-400" : "text-red-400"}`}>
            ${score.toFixed(2)}
          </div>
        </div>
      </div>
    );
  }