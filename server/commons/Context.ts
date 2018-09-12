import 'reflect-metadata';

interface ClsConfig {
  cls: any;
  injectPropsMap: Map<string, any>;
}

const injectSymbol = Symbol('inject');

function inject(op?) {
  let rv = Reflect.metadata(injectSymbol, op);
  return (target, propertyKey) => {
    target[propertyKey] = null;
    return rv(target, propertyKey);
  }
}

export class ApplicationContext {

  /**
   * 所有注册的组件
   */
  private components = new Map<string, ClsConfig>();

  private objects = new Map<string, any>();

  Component = (op?) => {
    return (constructor: Function) => {
      let cid = constructor.name + '-' + Math.random();
      constructor['_class_id'] = cid;
      let cfg = {
        cls: constructor,
        injectPropsMap: new Map<string, any>()
      };

      this.components.set(cid, cfg);

    }
  };

  Inject = inject;


  init() {
    this.components.forEach((val) => {
      let obj = new val.cls();
      this.objects.set(val.cls._class_id, obj);
    });

    this.objects.forEach(obj => {
      for (let key in obj) {
        let injectOption = Reflect.getMetadata(injectSymbol, obj, key);
        let injectCls = Reflect.getMetadata('design:type', obj, key);
        if (!injectCls || !injectCls._class_id || !this.objects.has(injectCls._class_id)) {
          throw new Error('can not be injected ');
        }
        obj[key] = this.objects.get(injectCls._class_id);
      }
    });
  }

  get(cls) {
    return this.objects.get(cls._class_id);
  }
}


