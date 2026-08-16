export interface ServiceResponse<T> {
  success: boolean;
  codeResult: number;
  message?: string;
  element?: T;
  codeTransacc: number;
}
