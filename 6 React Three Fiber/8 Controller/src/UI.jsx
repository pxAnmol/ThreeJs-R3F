import { useKeyboardControls } from "@react-three/drei";

const UI = () => {
  const { forward, backward, left, right, jump } = useKeyboardControls(
    (state) => state
  );

  return (
    <div className="interface fixed top-0 left-0 w-full h-full pointer-events-none">
      <div className="controls absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
        {/* W key */}
        <div className="flex justify-center mb-2">
          <div
            className={`w-8 h-8 flex items-center justify-center ${
              forward ? "bg-white/50" : "bg-white/10"
            } border-2 border-white/20 rounded-lg text-white font-bold`}
          ></div>
        </div>

        {/* A S D keys */}
        <div className="flex gap-2 mb-2">
          <div
            className={`w-8 h-8 flex items-center justify-center ${
              left ? "bg-white/50" : "bg-white/10"
            } border-2 border-white/20 rounded-lg text-white font-bold`}
          ></div>
          <div
            className={`w-8 h-8 flex items-center justify-center ${
              backward ? "bg-white/50" : "bg-white/10"
            } border-2 border-white/20 rounded-lg text-white font-bold`}
          ></div>
          <div
            className={`w-8 h-8 flex items-center justify-center ${
              right ? "bg-white/50" : "bg-white/10"
            } border-2 border-white/20 rounded-lg text-white font-bold`}
          ></div>
        </div>

        {/* Spacebar */}
        <div
          className={`w-32 h-8 flex items-center justify-center ${
            jump ? "bg-white/50" : "bg-white/10"
          } border-2 border-white/20 rounded-lg text-white font-bold`}
        ></div>
      </div>
    </div>
  );
};

export default UI;
