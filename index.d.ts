type FunctionArray = Array<() => any>;

type TestComponent = {
  withMocks(mocks: FunctionArray): TestComponent;
  withProps(props: { [key: string]: any }): TestComponent;
  withTriggers(triggers: FunctionArray): TestComponent;
  mount(): Promise<void>;
};

type Provider<P> = {
  component: React.ComponentType<P>;
  props: P;
  children: React.ComponentType<any>[];
}

export = kompot; 
export as namespace kompot;

declare namespace kompot {
  function spy(id: string, getReturnValue?: (args: any[]) => any, stringifyArgs?: (args: any[]) => string[]): () => any;
  function spyOn(obj: object, methodName: string, spyId: string, stringifyArgs?: (args: any[]) => string[]): void;
  function kompotRequire(pathToComponent: string): { [key: string]: TestComponent };
  function init(): void;
  function expect<T>(value: T): jest.Matchers<T> & Detox.Expect<T> & {notToHaveBeenCalled(): Promise<void>};
  function mockFetchUrl(url: string, cb: (url?: string) => Response): void;
  function useMocks(getMocks: () => {[key: string]: () => void}): void;
  function registerProviders<P>(provider: Provider<P>): void;

  const savedComponentRef: React.RefObject<any> | null;
  const componentProps: {[key: string]: any};

}
