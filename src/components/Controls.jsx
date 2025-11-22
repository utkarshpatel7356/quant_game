export default function Controls({ onBuy, onSell, onClose, position }) {
    return (
      <div className="flex justify-center gap-4 mt-6">
        {/* BUY BUTTON: Only enabled if we have NO position */}
        <button
          className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold transition text-white shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={onBuy}
          disabled={position !== null}
        >
          BUY (LONG)
        </button>
  
        {/* SELL BUTTON: Enabled if NO position (to Short) OR if LONG (to sell-to-close) */}
        <button
          className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-semibold transition text-white shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={onSell}
          disabled={position === "SHORT"}
        >
          SELL (SHORT)
        </button>
  
        {/* CLOSE BUTTON: Enabled if we have ANY position (Long or Short) */}
        <button
          className="bg-yellow-600 hover:bg-yellow-700 px-8 py-3 rounded-lg font-semibold transition text-white shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={onClose}
          disabled={position === null}
        >
          CLOSE POSITION
        </button>
      </div>
    );
  }