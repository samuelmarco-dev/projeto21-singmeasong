import supertest from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/database.js";
import recommendationFactory from "./factories/recommendationFactory.js";

beforeAll(async () => {
    await prisma.recommendation.deleteMany({});
});

describe('POST /recommendations/', ()=> {
    it('given a valid recommendation, give back 201', async()=> {
        const recommendation = recommendationFactory.generateRecommendation();
        const response = await supertest(app).post('/recommendations/').send(recommendation);

        expect(response.status).toBe(201);
    });
});

describe('GET /recommendations/', ()=> {
    it('find the last 10 recommendations', async()=> {
        const response = await supertest(app).get('/recommendations/');

        expect(response.status).toBe(200);
    });
});

describe('POST /recommendations/:id/upvote', ()=> {
    it('given a valid id, update the score of the recommendation as upvote', async()=> {
        const findRecommendation = await recommendationFactory.createRecommendationAndReturnId();
        const response = await supertest(app).post(`/recommendations/${findRecommendation.id}/upvote`);

        expect(response.status).toBe(200);
    });
});

describe('POST /recommendations/:id/downvote', ()=> {
    it('given a valid id, update the score of the recommendation as downvote', async()=> {
        const findRecommendation = await recommendationFactory.createRecommendationAndReturnId();
        const response = await supertest(app).post(`/recommendations/${findRecommendation.id}/downvote`);

        expect(response.status).toBe(200);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});
