import { Container, Injectable } from './container';

// Demo Classes
class Service {
  public foo = 'I am a property of Service';
}

class ServiceMock {
  public foo = 'I am the mocked Service';
}

@Injectable()
class Consumer {
  constructor(private readonly service: Service) {}

  public consume(): void {
    console.log(this.service.foo);
  }
}

// Setup DI Container
const container = new Container();
container.provide(Service, ServiceMock);
container.provide(Consumer);

// Demo Application
const consumer = container.get(Consumer);
consumer.consume();
