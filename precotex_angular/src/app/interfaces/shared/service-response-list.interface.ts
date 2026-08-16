export interface ServiceResponseList<T> {
  success: boolean;
  codeResult: number;
  message: string;
  elements?: T[];
  totalElements: number;
}
