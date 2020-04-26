import {Component, ComponentChild, RenderableProps} from 'preact';

//tslint:disable:max-classes-per-file

abstract class StaticComponent<P = any> extends Component<P, any> {
  public abstract render(props?: RenderableProps<P>, state?: any, context?: any): ComponentChild;

  public shouldComponentUpdate(): boolean {
    return false;
  }
}

export function createStaticComponent<P = any>(renderFn: StaticComponent<P>['render']) {
  return class StaticComponentImpl extends StaticComponent<P> {
    public render() {
      return renderFn.apply(this, arguments as any);
    }
  };
}
