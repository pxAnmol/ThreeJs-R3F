import { useKeyboardControls } from "@react-three/drei";

const UI = () => {
  const { forward, backward, left, right, jump } = useKeyboardControls(
    (state) => state
  );

  return (
    <div className="interface fixed top-0 left-0 w-full h-full pointer-events-none">
      <div className="controls absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center drop-shadow-lg">
        {/* W key */}
        <div className="flex justify-center mb-2">
          <div
            className={`w-8 h-8 flex items-center justify-center ${
              forward ? "bg-indigo-600" : "bg-zinc-800"
            } border-2 ${forward ? "border-indigo-400" : "border-indigo-900"} rounded-lg text-indigo-200 font-bold backdrop-blur-sm shadow-lg shadow-indigo-900/20`}
          ></div>
        </div>

        {/* A S D keys */}
        <div className="flex gap-2 mb-2">
          <div
            className={`w-8 h-8 flex items-center justify-center ${
              left ? "bg-indigo-600" : "bg-zinc-800"
            } border-2 ${left ? "border-indigo-400" : "border-indigo-900"} rounded-lg text-indigo-200 font-bold backdrop-blur-sm shadow-lg shadow-indigo-900/20`}
          ></div>
          <div
            className={`w-8 h-8 flex items-center justify-center ${
              backward ? "bg-indigo-600" : "bg-zinc-800"
            } border-2 ${backward ? "border-indigo-400" : "border-indigo-900"} rounded-lg text-indigo-200 font-bold backdrop-blur-sm shadow-lg shadow-indigo-900/20`}
          ></div>
          <div
            className={`w-8 h-8 flex items-center justify-center ${
              right ? "bg-indigo-600" : "bg-zinc-800"
            } border-2 ${right ? "border-indigo-400" : "border-indigo-900"} rounded-lg text-indigo-200 font-bold backdrop-blur-sm shadow-lg shadow-indigo-900/20`}
          ></div>
        </div>

        {/* Spacebar */}
        <div
          className={`w-32 h-8 flex items-center justify-center ${
            jump ? "bg-indigo-600" : "bg-zinc-800"
          } border-2 ${jump ? "border-indigo-400" : "border-indigo-900"} rounded-lg text-indigo-200 font-bold backdrop-blur-sm shadow-lg shadow-indigo-900/20`}
        ></div>
      </div>
    </div>
  );
};

export default UI;
