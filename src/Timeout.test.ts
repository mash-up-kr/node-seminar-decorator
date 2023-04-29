import { Timeout, sleep } from './Timeout';

describe('Timeout', () => {
  it('works', async () => {
    class TimeoutTest {
      @Timeout(100)
      async takeValue() {
        await sleep(1000);
        console.log('takeValue Done');
      }
    }

    await new TimeoutTest().takeValue();
  });
});
