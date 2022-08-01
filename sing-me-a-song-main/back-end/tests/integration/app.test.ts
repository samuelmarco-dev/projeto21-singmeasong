import { jest } from "@jest/globals";
import supertest from "supertest";

import recommendationFactory from "../factories/recommendationFactory.js";
import { prisma } from "../../src/database.js";
import app from "../../src/app.js";

beforeAll(async () => {
    await prisma.recommendation.deleteMany({});
});

describe('POST /recommendations/', ()=> {
    it('given a invalid input', async ()=> {
        const recommendation = {
            name: '', youtubeLink: ''
        };
        const response = await supertest(app).post('/recommendations').send(recommendation);

        expect(response.status).toBe(422);
    });
    
    it('given a valid recommendation, give back 201', async()=> {
        const recommendation = recommendationFactory.generateRecommendation();
        const response = await supertest(app).post('/recommendations/').send(recommendation);
        const create = await prisma.recommendation.findUnique({
            where: { name: recommendation.name }
        });

        expect(response.status).toBe(201);
        expect(create).not.toBeNull();
    });

    it('given a recommendation with a name that already exists, give back 409', async()=> {
        const recommendationExists = await recommendationFactory.createRecommendationForConflict();
        const response = await supertest(app).post('/recommendations/').send(recommendationExists);

        expect(response.status).toBe(409);
    });
});

describe('GET /recommendations/', ()=> {
    it('find the last 10 recommendations', async()=> {
        const response = await supertest(app).get('/recommendations/');

        expect(response.status).toBe(200);
    });
});

describe('GET /recommendation/:id', ()=> {
    it('find a recommendation by id', async()=> {
        const findRecommendation = await recommendationFactory.createRecommendationAndReturnId();
        const response = await supertest(app).get(`/recommendations/${findRecommendation.id}`);

        expect(response.status).toBe(200);
    });

    it('given a invalid id, give back 404', async()=> {
        const response = await supertest(app).get('/recommendations/0');

        expect(response.status).toBe(404);
    });
});

describe('GET /recommendations/top/:amount', ()=> {
    it('given a number, find the top recommendations', async()=> {
        await prisma.recommendation.deleteMany({});
        await recommendationFactory.createManyRecommendations();
        const response = await supertest(app).get('/recommendations/top/10');

        expect(response.body.length).toBe(5);
        expect(response.status).toBe(200);
    });
});

describe('POST /recommendations/:id/upvote', ()=> {
    it('given a valid id, update the score of the recommendation as upvote', async()=> {
        const findRecommendation = await recommendationFactory.createRecommendationAndReturnId();
        const response = await supertest(app).post(`/recommendations/${findRecommendation.id}/upvote`);

        expect(response.status).toBe(200);
        expect(findRecommendation).not.toBeNull();
    });

    it('given a invalid id, give back 404', async()=> {
        const response = await supertest(app).post('/recommendations/0/upvote');

        expect(response.status).toBe(404);
    });
});

describe('POST /recommendations/:id/downvote', ()=> {
    it('given a valid id, update the score of the recommendation as downvote', async()=> {
        const findRecommendation = await recommendationFactory.createRecommendationAndReturnId();
        const response = await supertest(app).post(`/recommendations/${findRecommendation.id}/downvote`);

        expect(response.status).toBe(200);
        expect(findRecommendation).not.toBeNull();
    });

    it('given a invalid id, give back 404', async()=> {
        const response = await supertest(app).post('/recommendations/0/downvote');

        expect(response.status).toBe(404);
    });
});

describe('GET /recommendations/random', ()=> {
    it('expect a random recommendation', async()=> {
        const response = await supertest(app).get('/recommendations/random');

        expect(response.status).toBe(200);
    });

    it('should not return a recommendation if no recommendations exist', async()=> {
        await prisma.recommendation.deleteMany({});
        const response = await supertest(app).get('/recommendations/random');

        expect(response.status).toBe(404);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});
