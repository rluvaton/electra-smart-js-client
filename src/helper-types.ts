export type SetOptional<Obj extends object, Keys extends keyof Obj> = Omit<Obj, Keys> & {
  [K in Keys]?: Obj[K];
};

/**
 * Just to express the type that is stringify
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Stringify<T> = string;
