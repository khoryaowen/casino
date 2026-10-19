import { createServer } from "node:http";
import { CASINO_STARTING_CHIPS } from "@casino/shared";

// note to self: 2567 is Colyseus's default port
const port = Number(process.env.PORT ?? 2567);

const server = createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({ status: "ok", startingChips: CASINO_STARTING_CHIPS }),
  );
});

server.listen(port, () => {
  console.log(`Server listening on https://localhost:${port}`);
});
