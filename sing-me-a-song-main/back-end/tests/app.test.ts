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

afterAll(async () => {
    await prisma.$disconnect();
});
