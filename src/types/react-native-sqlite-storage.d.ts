declare module 'react-native-sqlite-storage' {
  export interface SQLiteDatabase {
    executeSql(sql: string, params?: any[]): Promise<[any]>;
  }

  export function DEBUG(debug: boolean): void;
  export function enablePromise(enable: boolean): void;
  export function openDatabase(
    name: string,
    version: string,
    displayName: string,
    size: number
  ): Promise<SQLiteDatabase>;

  export default {
    DEBUG,
    enablePromise,
    openDatabase,
  };
}
