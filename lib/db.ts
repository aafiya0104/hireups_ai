import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cache;
}

export async function connectToDatabase(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return false;
  }

  if (cache.conn) {
    return true;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, {
        dbName: process.env.MONGODB_DB ?? "hireups_ai",
      })
      .then((instance) => instance)
      .catch((error) => {
        cache.promise = null;
        throw error;
      });
  }

  try {
    cache.conn = await cache.promise;
    return true;
  } catch (error) {
    console.error("MongoDB connection failed, falling back to static data.", error);
    return false;
  }
}
