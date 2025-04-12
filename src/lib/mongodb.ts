import { MongoClient, MongoClientOptions } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

// Extract the base URI without the database name
const getBaseUri = () => {
  const uri = process.env.MONGODB_URI!;
  const [baseUri, query] = uri.split('?');
  const uriParts = baseUri.split('/');
  return `${uriParts.slice(0, -1).join('/')}/system-db?${query}`;
};

const uri = getBaseUri();
const options: MongoClientOptions = {
  ssl: true,
  tls: true,
  retryWrites: true,
  w: 'majority',
}

let client
let clientPromise: Promise<MongoClient>

// Define the type for the global variable
type MongoGlobal = typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo: MongoGlobal = global

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
