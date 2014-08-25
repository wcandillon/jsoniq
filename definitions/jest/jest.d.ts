declare var jest: Jest;
declare function pit(name: string, fn: any): void;


interface Jest {
  autoMockOff(): void
  autoMockOn(): void
  clearAllTimers(): void
  dontMock(moduleName: string): void
  genMockFromModule(moduleObj: Object): Object
  genMockFunction(): MockFunction
  genMockFn(): MockFunction
  mock(moduleName: string): void
  runAllTicks(): void
  runAllTimers(): void
  runOnlyPendingTimers(): void
  setMock(moduleName: string, moduleExports: Object): void
}

interface MockFunction {
  (...arguments): any
  mock: {
    calls: Array<Array<any>>
    instances: Array<Object>
  }
  mockClear(): void
  mockImplementation(fn: Function): MockFunction
  mockImpl(fn: Function): MockFunction
  mockReturnThis(): MockFunction
  mockReturnValue(value: any): MockFunction
  mockReturnValueOnce(value: any): MockFunction
}

