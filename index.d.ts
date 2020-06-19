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

export function init(): void;
export function expect<T>(value: T): jest.Matchers<T> & Detox.Expect<T> & {notToHaveBeenCalled(): Promise<void>};
export function kompotRequire(pathToComponent: string): { [key: string]: TestComponent };

declare global {
  namespace kompot {
    function spy(id: string, getReturnValue?: (args: any[]) => any, stringifyArgs?: (args: any[]) => string[]): () => any;
    function spyOn(obj: object, methodName: string, spyId: string, stringifyArgs?: (args: any[]) => string[]): void;
    function mockFetchUrl(url: string, mockGenerator: (url?: string) => Response): void;
    function useMocks(getMocks: () => {[key: string]: () => Promise<void>}): void;
    function registerProviders<P>(provider: Provider<P>): void;
  
    const savedComponentRef: React.RefObject<any> | null;
    const componentProps: {[key: string]: any};
  }
}
