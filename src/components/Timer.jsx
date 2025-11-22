export default function Timer({ timeLeft }) {
    return (
      <div className="text-center text-2xl font-bold mt-4 text-blue-400">
        ⏱️ Time Left: {timeLeft}s
      </div>
    );
  }