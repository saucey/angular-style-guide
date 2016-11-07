import { Question } from "./question.model";
import { Endpoint } from "./endpoint.model";

export * from './question.model';
export * from './endpoint.model';
export * from './category.model';

export type Step = Question | Endpoint;
