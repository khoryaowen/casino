import { CASINO_LAYOUT, type TableKind } from "@casino/shared";

/** Visual-only height; collision is 2D so this never leaves the client. */
const TABLE_HEIGHT = 1;

const TABLE_COLORS: Record<TableKind, string> = {
  blackjack: "#8b1e2d",
  roulette: "#1e4d8b",
  poker: "#5b2a86",
};

export function Tables() {
  return (
    <>
      {CASINO_LAYOUT.tables.map((table) => (
        <mesh
          key={table.id}
          position={[table.x, TABLE_HEIGHT / 2, table.z]}
          castShadow
          receiveShadow
        >
          {table.shape === "round" ? (
            <cylinderGeometry
              args={[table.width / 2, table.width / 2, TABLE_HEIGHT, 32]}
            />
          ) : (
            <boxGeometry args={[table.width, TABLE_HEIGHT, table.depth]} />
          )}
          <meshStandardMaterial color={TABLE_COLORS[table.kind]} />
        </mesh>
      ))}
    </>
  );
}
