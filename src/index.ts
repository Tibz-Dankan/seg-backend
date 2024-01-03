import { server } from "./app";
import { generateSendTokensOnAppStart } from "./controllers/tokenController";

const startApp = () => {
  const PORT = 3000 || process.env.PORT;

  server.listen(PORT, () => {
    console.log(`SEG server running on port ${PORT}`);
  });
  generateSendTokensOnAppStart();
};

startApp();
