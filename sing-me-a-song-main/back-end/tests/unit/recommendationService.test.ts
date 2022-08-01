import { jest } from "@jest/globals";

import recommendationFactory from "../factories/recommendationFactory.js";
import { recommendationRepository } from '../../src/repositories/recommendationRepository.js';
import { CreateRecommendationData, recommendationService } from "../../src/services/recommendationsService.js";

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

describe('recommendationsService test suite', ()=> {
    it('should create a recommendation', async ()=> {
        const recomendation: CreateRecommendationData = recommendationFactory.generateRecommendation();
        
        jest.spyOn(recommendationRepository, 'findByName').mockImplementationOnce(():any => {});
        jest.spyOn(recommendationRepository, 'create').mockResolvedValueOnce(null);

        await recommendationService.insert(recomendation);
        expect(recommendationRepository.findByName).toBeCalled();
        expect(recommendationRepository.create).toBeCalled();
    });

    it('should not create a recommendation if it already exists', async ()=> {
        const recomendation: CreateRecommendationData = recommendationFactory.generateRecommendation();
        
        jest.spyOn(recommendationRepository, 'findByName').mockImplementationOnce(():any => {
            return {
                id: 1,
                name: recomendation.name,
                youtubeLink: recomendation.youtubeLink,
                score: 0
            }
        });
        
        const promise = recommendationService.insert(recomendation);
        expect(promise).rejects.toEqual({ message: 'Recommendations names must be unique', type: 'conflict' });
        expect(recommendationRepository.findByName).toBeCalled();
    });
    
    it('should create upvote a recommendation', async ()=> {
        const recomendation: CreateRecommendationData = recommendationFactory.generateRecommendation();
        
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(():any => {
            return {
                id: 1,
                name: recomendation.name,
                youtubeLink: recomendation.youtubeLink,
                score: 0
            }
        });
        jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(():any => {
            return {
                id: 1,
                name: recomendation.name,
                youtubeLink: recomendation.youtubeLink,
                score: 1
            }
        });

        await recommendationService.upvote(1);
        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
    });
    
    it('should create downvote a recommendation', async ()=> {
        const recomendation: CreateRecommendationData = recommendationFactory.generateRecommendation();
        
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(():any => {
            return {
                id: 1,
                name: recomendation.name,
                youtubeLink: recomendation.youtubeLink,
                score: 0
            }
        });
        jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(():any => {
            return {
                id: 1,
                name: recomendation.name,
                youtubeLink: recomendation.youtubeLink,
                score: -1
            }
        });

        await recommendationService.downvote(1);
        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
    });

    it('should not create downvote a recommendation if it has a score less than -5', async ()=> {
        const recomendation: CreateRecommendationData = recommendationFactory.generateRecommendation();
        
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(():any => {
            return {
                id: 1,
                name: recomendation.name,
                youtubeLink: recomendation.youtubeLink,
                score: -5
            }
        });
        jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(():any => {
            return {
                id: 1,
                name: recomendation.name,
                youtubeLink: recomendation.youtubeLink,
                score: -6
            }
        });
        jest.spyOn(recommendationRepository, 'remove').mockResolvedValueOnce(null);

        await recommendationService.downvote(1);
        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
        expect(recommendationRepository.remove).toBeCalled();
    });

    it('should return all recommendations', async ()=> {
        jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([]);

        const promise = await recommendationService.get();
        expect(recommendationRepository.findAll).toBeCalled();
        expect(promise).toEqual([]);
    });

    it('should return a recommendation by id', async ()=> {
        const recomendation: CreateRecommendationData = recommendationFactory.generateRecommendation();
        
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(():any => {
            return {
                id: 1,
                name: recomendation.name,
                youtubeLink: recomendation.youtubeLink,
                score: 0
            }
        });

        const promise = await recommendationService.getById(1);
        expect(recommendationRepository.find).toBeCalled();
        expect(promise).toEqual({
            id: 1,
            name: recomendation.name,
            youtubeLink: recomendation.youtubeLink,
            score: 0
        });
    });

    it('should return recommendations according to the score', async ()=> {
        const amount = 10;
        jest.spyOn(recommendationRepository, 'getAmountByScore').mockResolvedValueOnce([]);

        const promise = await recommendationService.getTop(amount);
        expect(recommendationRepository.getAmountByScore).toBeCalled();
        expect(promise).toEqual([]);
    });
});
