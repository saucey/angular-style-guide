import { Injectable, Optional } from "@angular/core";
import { Endpoint, Question, Category } from "../models";

type Questions = Question[];
type Endpoints = Endpoint[];
type Categories = Category[];

const questionsData: Questions = require('../datasets/questions.json');
const endpointsData: Endpoints = require('../datasets/endpoints.json');
const categoriesData: Categories = require('../datasets/categories.json');

console.log('questionsData', questionsData);

@Injectable()
export class FNOLDataService {

    questions: Questions;
    categories: Categories;
    endpoints: Endpoints;

    // Inject external data sources that can be mocked for unit tests
    constructor(@Optional() questions: Questions,
                @Optional() categories: Categories,
                @Optional() endpoints: Endpoints) {

        this.questions = questions || questionsData;
        this.endpoints = endpoints || endpointsData;
        this.categories = categories || categoriesData;

        console.log('constructor', this);
    }

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
