import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";

import { recommendationRepository } from '../../src/repositories/recommendationRepository.js';
import { CreateRecommendationData, recommendationService } from "../../src/services/recommendationsService.js";

describe('recommendationsService test suite', ()=> {
    it('should create a recommendation', async ()=> {
        jest.spyOn(recommendationRepository, 'findByName').mockImplementationOnce(():any => {});
        jest.spyOn(recommendationRepository, 'create').mockResolvedValueOnce(null);

        const recomendation: CreateRecommendationData = {
            name: 'test',
            youtubeLink: `https://www.youtube.com/watch?v=${faker.lorem.word(11)}`
        };
        await recommendationService.insert(recomendation);

        expect(recommendationRepository.findByName).toBeCalled();
        expect(recommendationRepository.create).toBeCalled();
    });

    it('should not create a recommendation if it already exists', async ()=> {
        const recomendation: CreateRecommendationData = {
            name: 'test',
            youtubeLink: `https://www.youtube.com/watch?v=${faker.lorem.word(11)}`
        };

        jest.spyOn(recommendationRepository, 'findByName').mockImplementationOnce(():any => {
            return {
                id: 1,
                name: recomendation.name,
                youtubeLink: recomendation.youtubeLink,
                score: 0
            }
        });
        jest.spyOn(recommendationRepository, 'create').mockResolvedValueOnce(null);
        
        const promise = await recommendationService.insert(recomendation);
        expect(recommendationRepository.findByName).toBeCalled();
        expect(recommendationRepository.create).not.toBeCalled();
        expect(promise).rejects.toEqual({ message: 'Recommendations names must be unique', type: 'conflict' });
    });

    it('should create upvote a recommendation', async ()=> {});
    it('should create downvote a recommendation', async ()=> {});
});
