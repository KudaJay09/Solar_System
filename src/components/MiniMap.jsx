export default function MiniMap({ planets, selected, onSelect }) {
  return (
    <div className="minimap">
      {planets.map((planet, i) => {
        const x = planet.distance * 4;
        const isActive = planet.name === selected;

        return (
          <div
            key={i}
            className={`minimap-dot ${isActive ? "active" : ""}`}
            style={{
              left: `${x}px`,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundImage: `url(${planet.textureUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "1px solid white",
            }}
            onClick={() => onSelect(planet)}
            title={planet.name}
          />
        );
      })}
    </div>
  );
}
