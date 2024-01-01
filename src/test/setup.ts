import { beforeEach } from "vitest";
import { resetDB } from "./resetDB";

beforeEach(async () => {
  await resetDB();
});
