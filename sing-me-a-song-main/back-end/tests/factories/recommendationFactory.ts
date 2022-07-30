import { faker } from "@faker-js/faker";

import { prisma } from "../../src/database.js";

function generateRecommendation(){
    return {
        name: faker.lorem.words(),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.datatype.string(11)}`,
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

const recommendationFactory = {
    generateRecommendation,
    createRecommendationAndReturnId
}

export default recommendationFactory;
