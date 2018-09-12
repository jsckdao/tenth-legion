
export class Application {

  Controller = (op?) => {
    return (constructor) =>  {
      return constructor;
    }
  };

  POST = (path?: string, op?) => {
    return (target, propertyKey: string, descriptor: PropertyDescriptor) => {

      return target;
    };
  }

  GET = this.POST;

  PUT = this.POST;

  DELETE = this.POST;
}
