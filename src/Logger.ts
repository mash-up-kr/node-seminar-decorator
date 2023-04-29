/**
 * 함수 시작, 성공, 에러 케이스에 대해서 로깅을 한다.
 */
export function Logger(methodName: string) {
  return (target: any, property: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const originalMethod = descriptor.value;
    //    ^^^^^^^^^ UserService.prototype.getUser
    descriptor.value = async function (...args: any[]) {
      try {
        console.log(methodName, 'start');
        const result = await originalMethod.apply(this, args);
        console.log(methodName, 'success');
        return result;
      } catch (e) {
        console.log(methodName, 'failure');
        throw e;
      }
    };
  };
}
