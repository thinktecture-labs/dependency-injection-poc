import { Container } from './container';

// Demo Classes
class Service {
  public foo = 'I am a property of Service';
}

class ServiceMock {
  public foo = 'I am the mocked Service';
}

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
