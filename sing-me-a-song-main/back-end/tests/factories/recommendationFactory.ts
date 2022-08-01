import { faker } from "@faker-js/faker";

import { prisma } from "../../src/database.js";

function generateRecommendation(){
    return {
        name: faker.lorem.words(),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.lorem.word(11)}`
    }
}

async function createRecommendationAndReturnId(){
    const recommendation = generateRecommendation();
    await prisma.recommendation.create({
        data: recommendation
    });

    return await prisma.recommendation.findUnique({
        where: { name: recommendation.name }
    });
}

async function createRecommendationForConflict(){
    const recommendation = generateRecommendation();
    await prisma.recommendation.create({
        data: recommendation
    });

    return recommendation;
}

async function createManyRecommendations() {
    await prisma.recommendation.createMany({
        data: [
            generateRecommendation(),
            generateRecommendation(),
            generateRecommendation(),
            generateRecommendation(),
            generateRecommendation()
        ]
    });
}

const recommendationFactory = {
    generateRecommendation,
    createRecommendationAndReturnId,
    createManyRecommendations,
    createRecommendationForConflict
}

export default recommendationFactory;
