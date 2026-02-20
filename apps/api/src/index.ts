import Fastify from "fastify";
import cors from "@fastify/cors";
import { encrypt, decrypt } from "@repo/crypto";

const fastify = Fastify({ logger: true });

// Enable CORS
fastify.register(cors, {
  origin: true,
});

// Temporary in-memory storage
const db: Record<string, string> = {};

// Store encrypted data
fastify.post("/store", async (request: any, reply) => {
  const { payload, partyId } = request.body;

  if (!payload || !partyId) {
    return reply.status(400).send({ error: "payload and partyId required" });
  }

  const encrypted = encrypt(JSON.stringify(payload));
  db[partyId] = encrypted;

  return { encrypted };
});

// Retrieve encrypted data
fastify.get("/retrieve/:partyId", async (request: any) => {
  const { partyId } = request.params;
  return { encrypted: db[partyId] };
});

// Decrypt data
fastify.get("/decrypt/:partyId", async (request: any, reply) => {
  const { partyId } = request.params;

  const encrypted = db[partyId];
  if (!encrypted) {
    return reply.status(404).send({ error: "Not found" });
  }

  const decrypted = decrypt(encrypted);
  return { decrypted: JSON.parse(decrypted) };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001 });
    console.log("API running on http://localhost:3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
