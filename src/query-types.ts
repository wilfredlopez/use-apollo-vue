export type Maybe<T> = T | null
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  //eslint-disable-next-line
  DateTime: any
  //eslint-disable-next-line
  Upload: any
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

//eslint-disable-next-line
export type OperationVariables = {
  //eslint-disable-next-line
  [key: string]: any
}
