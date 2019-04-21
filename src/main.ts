import { Container } from './container';

// Our first class Decorator
export function DecorateClass() {
  return function(target: any) {
    console.log(`Decorating ${target.name}`);
    return target;
  };
}

// Demo Classes
@DecorateClass()
class Service {
  public foo = 'I am a property of Service';
}

@DecorateClass()
class ServiceMock {
  public foo = 'I am the mocked Service';
}

@DecorateClass()
class Consumer {
  constructor(private readonly service: Service) {}

  public consume(): void {
    console.log(this.service.foo);
  }
}

// Setup DI Container
const container = new Container();
container.provide(Service, () => new ServiceMock());
container.provide(Consumer, c => new Consumer(c.get(Service)));

// Demo Application
const consumer = container.get(Consumer);
consumer.consume();
