import { faker } from "@faker-js/faker";

function generateRecommendation(){
    return {
        name: faker.lorem.words(),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.datatype.string(11)}`,
    }
}

const recommendationFactory = {
    generateRecommendation
}

export default recommendationFactory;