interface Token<T> extends Function {
  new (...args: any[]): T;
}

type Factory<T> = (container: Container) => T;

interface Item<T> {
  factory: Factory<T>;
  instance?: T;
}

export class Container {
  private readonly container = new Map<Function, Item<any>>();

  provide<T>(token: Token<T>, factory: Factory<T>) {
    this.container.set(token, { factory });
  }

  get<T>(token: Token<T>): T {
    const item = this.container.get(token);
    if (!item) {
      throw new Error(`Nothing found for token ${token.name}`);
    }
  
    const { factory, instance } = item;
  
    if (!instance) {
      const newInstance = factory(this);
      this.container.set(token, { factory, instance: newInstance });
      return newInstance;
    }
  
    return instance;
  }
}
