import { UserQuery } from './index';

export const memoizeStorage = new Map<string, any>();

export function createMemoizeByQueryDecorator(storage: Map<string, any>) {
  return function MemoizeByQuery(keyGenerator: (query: UserQuery) => string) {
    return (target: any, property: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = descriptor.value;
      descriptor.value = async function (query: UserQuery) {
        const key = keyGenerator(query);
        if (!storage.has(key)) {
          console.log('🥺 Cache miss!!');
          const result = await originalMethod.apply(this, [query]);
          storage.set(key, result);
        }

        console.log('✨ Cache hit!!');
        return storage.get(key);
      };
    };
  };
}

declare const storageWithRedis: Map<string, any>;

export const MemoizedByQuery = {
  Redis: createMemoizeByQueryDecorator(storageWithRedis),
  InMemory: createMemoizeByQueryDecorator(new Map()),
};
