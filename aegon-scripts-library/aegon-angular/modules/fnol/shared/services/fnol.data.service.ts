import { Injectable, Optional } from "@angular/core";
import { Endpoint, Question } from "../models";

type Questions = Question[];
type Endpoints = Endpoint[];

const questionsData: Questions = require('../datasets/questions.json');
const endpointsData: Endpoints = require('../datasets/endpoints.json');

@Injectable()
export class FNOLDataService {

    // Inject external data sources that can be mocked for unit tests
    constructor(@Optional() public questions: Questions = questionsData,
                @Optional() public endpoints: Endpoints = endpointsData) {

    }

    private getById(elements: any[], id: string) : any {
        return elements.find(el => el.id === id);
    }

    getQuestions(): Questions {
        return this.questions;
    }

    getEndpoints(): Endpoints {
        return this.endpoints;
    }

    getQuestion(id: string): Question {
        return this.getById(this.questions, id);
    }
    getEndpoint(id: string): Question {
        return this.getById(this.endpoints, id);
    }

    getNext(id: string) : Question | Endpoint {

        if (id.startsWith('Q')) {
            return this.getQuestion(id);
            
        } else if (id.startsWith('END')) {
            return this.getEndpoint(id);
            
        } else {
            throw new Error ('Couldn\'t find item for id:' + id);
        }
    }

}
