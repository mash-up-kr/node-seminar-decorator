export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
function createTimer(ms: number) {
  let timer: NodeJS.Timer;

  const timerPromise = new Promise(reject => {
    timer = setTimeout(() => {
      reject(new Error('timeout exceeded'));
    }, ms);
  });
  const clearTimer = () => clearTimeout(timer);

  return { clearTimer, timerPromise };
}

export function Timeout(timeoutMs: number) {
  return (target: any, property: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const { clearTimer, timerPromise } = createTimer(timeoutMs);
      const [result] = await Promise.all([originalMethod.apply(this, args).finally(clearTimer), timerPromise]);
      return result;
    };
  };
}
