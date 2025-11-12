export default function MiniMap({ planets, selected, onSelect }) {
  return (
    <div className="absolute bottom-3 left-3 h-16 w-full max-w-96 bg-black/60 rounded-lg overflow-x-auto whitespace-nowrap p-2 flex items-center gap-3">
      {planets.map((planet, i) => {
        const x = planet.distance * 4;
        const isActive = planet.name === selected;

        return (
          <div
            key={i}
            className={`w-6 h-6 rounded-full cursor-pointer transition-transform duration-200 bg-gray-800 border border-white hover:-translate-y-1/2 hover:scale-130 ${
              isActive
                ? "shadow-[0_0_12px_#00ffff] animate-[pulse_1.2s_infinite_ease-in-out]"
                : ""
            }`}
            style={{
              left: `${x}px`,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundImage: `url(${planet.textureUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={() => onSelect(planet)}
            title={planet.name}
          />
        );
      })}
    </div>
  );
}
