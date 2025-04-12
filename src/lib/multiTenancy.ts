import mongoose, { ConnectOptions } from 'mongoose';

interface TenantConnection {
  name: string;
  connection: mongoose.Connection;
}

class TenantService {
  private static instance: TenantService;
  private tenantConnections: Map<string, TenantConnection>;
  private defaultConnection: mongoose.Connection | null;

  private constructor() {
    this.tenantConnections = new Map();
    this.defaultConnection = null;
  }

  public static getInstance(): TenantService {
    if (!TenantService.instance) {
      TenantService.instance = new TenantService();
    }
    return TenantService.instance;
  }

  private getConnectionString(dbName?: string): string {
    const baseUri = process.env.MONGODB_URI!;
    if (!dbName) {
      // For system database, use system-db
      const [uri, query] = baseUri.split('?');
      const uriParts = uri.split('/');
      return `${uriParts.slice(0, -1).join('/')}/system-db?${query}`;
    }
    
    // For school databases
    const [uri, query] = baseUri.split('?');
    const uriParts = uri.split('/');
    return `${uriParts.slice(0, -1).join('/')}/school-${dbName}?${query}`;
  }

  async getConnection(schoolId?: string): Promise<mongoose.Connection> {
    const connectionOptions: ConnectOptions = {
      retryWrites: true,
      w: 'majority',
      ssl: true,
      tls: true,
    };

    // If no schoolId, return default connection (for super admin operations)
    if (!schoolId) {
      if (!this.defaultConnection) {
        const uri = this.getConnectionString(); // This will use system-db
        const conn = await mongoose.createConnection(uri, connectionOptions);
        this.defaultConnection = conn;
      }
      return this.defaultConnection;
    }

    // Check if connection exists
    const existingConnection = this.tenantConnections.get(schoolId);
    if (existingConnection) {
      return existingConnection.connection;
    }

    // Create new connection for tenant
    const uri = this.getConnectionString(schoolId);
    const connection = await mongoose.createConnection(uri, connectionOptions);

    this.tenantConnections.set(schoolId, {
      name: `school-${schoolId}`,
      connection,
    });

    return connection;
  }

  // Get all tenant connections
  getTenantConnections(): Map<string, TenantConnection> {
    return this.tenantConnections;
  }

  // Close all connections
  async closeAllConnections(): Promise<void> {
    if (this.defaultConnection) {
      await this.defaultConnection.close();
    }

    for (const [, tenant] of this.tenantConnections) {
      await tenant.connection.close();
    }

    this.tenantConnections.clear();
  }
}

export const tenantService = TenantService.getInstance();
