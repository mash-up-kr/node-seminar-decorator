// 함수/메소드 시작, 종료, 에러시에 로그를 찍고싶다
// 함수/메소드에 Timeout을 걸고 싶다.
// 함수/메소드에 특정 조건에서 Retry를 걸고 싶다.
// 에러가 발생했을 때 따로 처리하는 공통로직을 만들고 싶다.
// Rate limiting, 쓰로틀링을 하고싶다.
// 서킷 브레이킹을 걸고 싶다.
import { Logger } from './Logger';
import { MemoizedByQuery } from './MemoizeByQuery';
import { User } from './User';

export type UserQuery = any;

export class UserService {
  //
  @Logger('getUser')
  async getUser(userId: string) {
    // log
    console.log('getUser is called');
    if (userId === '') {
      throw new Error(`User id sould not be empty string given: ${userId}`);
    }
    return {
      id: userId,
      name: '이현광',
    };
  }

  @Logger('updateUser')
  async updateUser(user: User) {
    console.log('updateUser is called');
    return user;
  }

  // 이런 쿼리는 여러번 불리면 DB에 부담을 많이 주니까
  // 이거는 쿼리를 기반으로해서 메모리에다가 캐싱을 한다.
  // 한번 쿼리된 아이는 다시 쿼리하지 않고 그대로 return한다.
  @Logger('getManyUser')
  @MemoizedByQuery.InMemory((query: UserQuery) => JSON.stringify(query))
  async getManyUser(query: UserQuery): Promise<User[]> {
    console.log('getManyUser is called');
    return [];
  }

  // 이런 쿼리는 여러번 불리면 DB에 부담을 많이 주니까
  // 이거는 쿼리를 기반으로해서 메모리에다가 캐싱을 한다.
  // 한번 쿼리된 아이는 다시 쿼리하지 않고 그대로 return한다.
  @Logger('getManyLecture')
  @MemoizedByQuery.Redis((query: UserQuery) => JSON.stringify(query))
  async getManyLecture(query: UserQuery): Promise<any[]> {
    console.log('getManyLecture is called');
    return [];
  }
}

// @tossteam/nestjs-aop 모듈 (오픈소스) <- 요거 쓰면 이제 NestJS 컨테이너 안에 있는 인스턴스 가져다 쓸 수 있음

// 건회: 데코레이터를 붙였으면, 테스트할 때 메소드랑 함께 테스트하는가?
// 보통 descriptor를 직접 바꾸는 식의 데코레이터는 메소드랑 함께 테스트해줘야 하긴 함.
// 근데 nestjs-aop라던가 Reflect-Metadata를 사용하는 데코레이터들이 있는데, 이건 메소드 그대로 남아있음.
// 데코레이터 구현 방법의 종류
// 1. descriptor.value = function (...args: any) { ... } 이런식으로 override하는거
// 참고로 1번은 오늘 이 레포지토리에서 구현한 방식

// 2. reflect.defineMetadata(key, value, target)  // 'reflect-metadata' 패키지를 사용
// 참고로 2번은 @tossteam/nestjs-aop모듈

// 1번으로 구현하게 되면 메소드가 서버 부트스트랩 되기전 (함수가 evaluation 될 때) wrapping되기 때문에 테스트환경에서 데코레이트 되어있음
// 2번으로 구현하게 되면 메소드가 런타임 (서버가 실행된 이후)에 wrapping되기 때문에 테스트 환경에서는 메소드가 그대로임
