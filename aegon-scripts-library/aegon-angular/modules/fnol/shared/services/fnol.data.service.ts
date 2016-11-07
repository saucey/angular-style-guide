import { Injectable, Optional } from "@angular/core";
import { Endpoint, Question, Category } from "../models";

type Questions = Array<Question>;
type Endpoints = Array<Endpoint>;
type Categories = Array<Category>;

const QUESTIONS_DATA: Questions = require('../datasets/questions.json');
const ENDPOINTS_DATA: Endpoints = require('../datasets/endpoints.json');
const CATEGORIES_DATA: Categories = require('../datasets/categories.json');

@Injectable()
export class FNOLDataService {

    questions: Questions;
    categories: Categories;
    endpoints: Endpoints;

    // Inject external data sources that can be mocked for unit tests
    constructor(@Optional() questions: Questions,
                @Optional() categories: Categories,
                @Optional() endpoints: Endpoints) {

        this.questions = questions || QUESTIONS_DATA;
        this.endpoints = endpoints || ENDPOINTS_DATA;
        this.categories = categories || CATEGORIES_DATA;
    }

    // Get element from collection by its id
    private getById<T>(elements: any[], id: string) : T {
        return elements.find(el => el.id === id);
    }

    getQuestions(): Questions {
        return this.questions;
    }

    getCategories(): Categories {
        return this.categories;
    }

    getEndpoints(): Endpoints {
        return this.endpoints;
    }

    getQuestion(id: string): Question {
        return this.getById<Question>(this.questions, id);
    }

    getEndpoint(id: string): Endpoint {
        return this.getById<Endpoint>(this.endpoints, id);
    }

    getCategory(id: string): Category {
        return this.getById<Category>(this.categories, id);
    }

    getStep(id: string) : Question | Endpoint {

        if (id.startsWith('Q')) {
            return this.getQuestion(id);
            
        } else if (id.startsWith('END')) {
            return this.getEndpoint(id);
            
        } else {
            throw new Error ('Couldn\'t find item for id:' + id);
        }
    }

}
