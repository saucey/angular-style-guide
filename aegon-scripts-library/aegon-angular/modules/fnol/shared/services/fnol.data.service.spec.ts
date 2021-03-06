import { FNOLDataService } from "./fnol.data.service";
import { EndpointType } from "../models/";

const QUESTIONS = [
    {
        "id": "Q1",
        "type": "question",
        "title": "How are you?",
        "options": [
            {
                "label": "Good",
                "next": "END1"
            },
            {
                "label": "So so",
                "next": "Q2"
            }
        ]
    },
    {
        "id": "Q2",
        "title": "Are you sure?",
        "type": "endpoint",
        "options": [
            {
                "label": "No",
                "next": "END1"
            },
            {
                "label": "yes",
                "next": "END2"
            }
        ]
    }
];

const ENDPOINTS = [
    {
        "id": "END1",
        "type": ("phone" as EndpointType),
        "data": {
            "number": "630100033",
            "title": ""
        }
    },
    {
        "id": "END2",
        "type": ("link" as EndpointType),
        "data": {
            "url": "/example/page",
            "title": ""
        }
    }
];

describe('FNOL Data Service', () => {

    let fnolDataService: FNOLDataService;

    beforeEach(() => {
        fnolDataService = new FNOLDataService(QUESTIONS, [], ENDPOINTS);

    });

    describe('Getting QUESTIONS/ENDPOINTS', () => {

        it('is defined', () => {
            expect(fnolDataService).toBeDefined();
        });

        it('is gets QUESTIONS', () => {
            expect(fnolDataService.getQuestions()).toEqual(QUESTIONS);
        });

        it('is gets QUESTIONS', () => {
            expect(fnolDataService.getEndpoints()).toEqual(ENDPOINTS);
        });

    });

    describe('Getting single question/endpoint or next item', () => {

        it('is defined', () => {
            expect(fnolDataService.getQuestion('Q2')).toEqual({
                "id": "Q2",
                "title": "Are you sure?",
                "type": "endpoint",
                "options": [
                    {
                        "label": "No",
                        "next": "END1"
                    },
                    {
                        "label": "yes",
                        "next": "END2"
                    }
                ]
            });
        });

        it('is gets QUESTIONS', () => {
            expect(fnolDataService.getEndpoint('END1')).toEqual({
                "id": "END1",
                "type": "phone",
                "data": {
                    "number": "630100033",
                    "title": ""
                }
            });
        });

        it('is gets next with autodetect', () => {

            expect(fnolDataService.getStep('Q1')).toEqual({
                "id": "Q1",
                "type": "question",
                "title": "How are you?",
                "options": [
                    {
                        "label": "Good",
                        "next": "END1"
                    },
                    {
                        "label": "So so",
                        "next": "Q2"
                    }
                ]
            });

            expect(fnolDataService.getStep('END2')).toEqual({
                    "id": "END2",
                    "type": ("link" as EndpointType),
                    "data": {
                        "url": "/example/page",
                        "title": ""
                    }
                }
            );
        });
    });
});
