import { User } from './User';

async function getUser(userId: string) {
  // log
  console.log('getUser is called');
  if (userId === '') {
    throw new Error(`User id sould not be empty string given: ${userId}`);
  }
  return Promise.resolve({
    id: userId,
    name: '이현광',
  });
}

async function updateUser(user: User) {
  // log
  return Promise.resolve(user);
}

// Wrapper function (함수) => 함수

type Wrap = <A extends any[], R>(fn: (...args: A) => Promise<R>, ...args: any[]) => (...args: A) => Promise<R>;

const withLogger: Wrap = (fn: any, methodName: string) => {
  return async (...args: any[]) => {
    try {
      console.log(methodName, 'Wrapped!');
      const result = await fn(...args);
      console.log(methodName, 'success');
      return result;
    } catch (e) {
      console.log(methodName, 'failed');
      throw e;
    }
  };
};

export const getUserWithLogger = withLogger(getUser);
