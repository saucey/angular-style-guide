import { Injectable, Optional } from "@angular/core";
import { Endpoint, Question, Category, FAQItem } from "../models";

type Questions = Array<Question>;
type Endpoints = Array<Endpoint>;
type Categories = Array<Category>;
type FAQItems = Array<FAQItem>;

interface FAQItemsObject {
    [categoryId: string]: FAQItem[];
}

const QUESTIONS_DATA: Questions = require('../datasets/questions.json');
const ENDPOINTS_DATA: Endpoints = require('../datasets/endpoints.json');
const CATEGORIES_DATA: Categories = require('../datasets/categories.json');
const FAQ_ITEMS_DATA: FAQItemsObject = require('../datasets/faq.json');

@Injectable()
export class FNOLDataService {

    questions: Questions;
    categories: Categories;
    endpoints: Endpoints;
    faqItems: FAQItemsObject;

    // Inject external data sources that can be mocked for unit tests
    constructor(@Optional() questions: Questions,
                @Optional() categories: Categories,
                @Optional() endpoints: Endpoints) {

        this.questions = questions || QUESTIONS_DATA;
        this.endpoints = endpoints || ENDPOINTS_DATA;
        this.categories = categories || CATEGORIES_DATA;
        this.faqItems =  FAQ_ITEMS_DATA;
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

    getAllFAQItems(): FAQItemsObject{
        return this.faqItems;
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

    getFAQItems(categoryId: string): FAQItems {
        return this.faqItems[categoryId];
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
