[[
    Problems: 
        * ppl mostly think in terms of frameworks today
        * hard to imagine a simple program's bootstrapping sequence

    Anecdotes:
        * coworker creates amazaing HttpClient abstraction
        * we use it in our classes by instantiating it -> bad
        
        * coworker "cringes when he sees/hears DI"
        * made him write Unit Tests. writes python script to unit test PHP API
        * learned to love DI

]]

# Hottopic: Dependency Injection - Let's Talk about it

## What is DI
> put the stuff that we need into the constructor and magically access them
* DI is a Design Pattern, based on the Inversion of Control principle
* Several ways of Injection (Constructor, Setter, ...)

## What is IoC
* broad principle
* take control from individual class
* give control to application
* essentially: make things pluggable
-> better name: Dependency Injection

## Why DI
* transparency -> we can easily see the dependencies of a class
* makes testing a whole lot easier

### Examples
```typescript
// Hide dependencies in {}
class FileWriter() { new SystemIO() }
class FileLogger() { new FileWriter() }
class AuthHandler()
class HttpClient()
class Communicator() { new HttpClient() }

class Consumer1() { new FileLogger(), new Communicator() }
class Consumer2() { new FileLogger(), new Communicator(), new AuthHandler() }
```

* we cannot know what Consumer1 or Consumer1 depend on
* consumers should not have to know about how to instantiate another Service class
* no way to replace an implementation (FileLogger vs ConsoleLogger)
* what if we want the same instance of a logger in multiple classes? singleton, yikes?
* possibly duplicate construction logic

[[maybe put ServiceLocator here to solve last 3 problems??]]

```typescript
const logger = new FileLogger(); // or new ConsoleLogger()
const communicator = new Communicator();
const auth = new AuthHandler();

new Consumer1(logger, communicator);
new Consumer2(logger, communicator, auth);
```

* easy to identify dependencies
* consumer does not know about the intricacies of instantiating a dependency
* easily replace a dependency (interfaces!)
* same instance goes to different consumers
* creation logic once where we bootstrap the app

## DI Containers
* The above example is a small project with very few classes, no DIC needed
* big projects with hundreds of classes and potentially different entry points dont need all classes
* ^ think API request to single controller (dispatcher has route definition, instantiates controller, needs deps and responds)

* somewhere we need to define how to instantiate a class, ideally only once (someone needs to know how to do it!)
* keep all construction logic in a single place
* just get an instance when we need it
* not concern ourselves with dependencies and creation

```typescript
const consumer1 = container.get(Consumer1);
```

## Let's build it!
STOP. DEMOTIME.

## Yup that was ez

## Quick Note on ServiceLocator
* old and wiser folks might point out that this is a Service Locator

```typescript
new Consumer(container) // This would be making use of a service locator
vs
new Consumer(container->get(Logger), container->get(Communicator))
```

## Automagic DI, or how it's done in Typescript

## Quick Interlude: Decorators
* Design Pattern
* General Idea: a function that wraps a function to prevent code duplication

```typescript
function getUserRoles(user): Role[] {
    if (!userExists(user) || !isLoggedIn(user)) {
        throw Error('The user does not exist or is not logged in');
    }
    ...
}

function getUserPermissions(user): Permission[] {
    if (!userExists(user) || !isLoggedIn(user)) {
        throw Error('The user does not exist or is not logged in');
    }
    ...
}
```

* Remove duplication:

```typescript
function LoggedInUser(target: any) {
    const user = getUserParam(target);
    if (!userExists(user) || !isLoggedIn(user)) {
        throw Error('The user does not exist or is not logged in');
    }
    return target;
}

@LoggedInUser
function getUserRoles(user: User): Role[] {
    ...
}

@LoggedInUser
function getUserPermissions(user: User): Permission[] {
    ...
}
```
* Class decorators decorate a class
* Decorators are an upcoming spec in JavaScript
* Built into Typescript already, enable with `enableDecoratorSupprt`

## Automagic DI with Decorators
* wouldnt it be awesome to not have to write construction logic outselves?
* construction logic is essentially listing dependencies taken from the container
* Goal: get list of constructor parameters
* Potential Solution: Turn class into a string, parse constructor
* Problem: what if we mangle the code, parameter names would change (remember AngularJS and the dependency list of strings?)
* Problem: JS has no types, type information will be lost
* there is a way in typescript to write type information of decorated classes
* Solution: emitDecoratorMetadata
* how do we access said metadata?
* Reflect API (upcoming spec once Decorators are in)
* For now use a preliminary implementation: reflect-metadata

## Let's get crackin
DEMOTIME
- show code generated from using decorators
- show code generated from emitDecoratorMetadata
- implement Injectable and improve container

