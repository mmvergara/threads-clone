import { init } from "@paralleldrive/cuid2";

export const generateID = init({
  random: Math.random,
  length: 10,
  fingerprint: "happy birthday to you",
});
