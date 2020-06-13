type TestComponent = {
  withMocks(mocks: any[]): TestComponent;
  withProps(props: { [key: string]: any }): TestComponent;
  withTriggers(triggers: any[]): TestComponent;
  mount(): Promise<void>;
};

export = kompot;
export as namespace kompot;

declare namespace kompot {
  function spy(id: string, getReturnValue?: (args: any[]) => any, stringifyArgs?: (args: any[]) => string[]): any
  function kompotRequire(pathToComponent: string): { [key: string]: TestComponent };
  function init(): void;
  function expect(value: any): jest.Matchers<any> & Detox.Expect<any>
}
