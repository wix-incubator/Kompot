type FunctionArray = Array<() => any>;

type TestComponent = {
  withMocks(mocks: FunctionArray): TestComponent;
  withProps(props: { [key: string]: any }): TestComponent;
  withTriggers(triggers: FunctionArray): TestComponent;
  mount(): Promise<void>;
};

export = kompot;
export as namespace kompot;

declare namespace kompot {
  function spy(id: string, getReturnValue?: (args: any[]) => any, stringifyArgs?: (args: any[]) => string[]): any
  function kompotRequire(pathToComponent: string): { [key: string]: TestComponent };
  function init(): void;
  function expect<T>(value: T): jest.Matchers<T> & Detox.Expect<T> & {notToHaveBeenCalled(): Promise<void>}
}
