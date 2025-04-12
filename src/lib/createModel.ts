import { Model, Schema } from 'mongoose';
import { tenantService } from './multiTenancy';

export function createModel<T>(name: string, schema: Schema) {
  return async (schoolId?: string): Promise<Model<T>> => {
    const connection = await tenantService.getConnection(schoolId);
    return connection.model<T>(name, schema);
  };
}
