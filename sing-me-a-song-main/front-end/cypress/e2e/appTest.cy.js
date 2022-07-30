/// <reference types="cypress" />
import { faker } from "@faker-js/faker";

const URL = "http://localhost:3000";
const RECOMMENDATIONS_NUMBERS = 0;

before(() => {
    cy.resetRecommendations();
});

describe('app test', ()=> {
    it('create a new recommendation', ()=> {
        const recommendation = {
            name: faker.lorem.words(),
            youtubeLink: `https://www.youtube.com/watch?v=${faker.lorem.word(11)}`
        };

        cy.visit(`${URL}/`);
        cy.get('article').should('have.length', RECOMMENDATIONS_NUMBERS);

        cy.get('#name').type(recommendation.name);
        cy.get('#link').type(recommendation.youtubeLink);

        cy.intercept('POST', '/recommendations').as('createRecommendation');
        cy.get('button[type=submit]').click();
        cy.wait('@createRecommendation');

        cy.url().should("equal", `${URL}/`);
        cy.get('article').should('have.length', (RECOMMENDATIONS_NUMBERS + 1));
    });

    it('find the last 10 recommendations', ()=> {
        cy.visit(`${URL}/`);

        cy.intercept('GET', '/recommendations').as('getAllRecommendations');
        cy.get('#home').click();
        cy.wait('@getAllRecommendations');
        
        cy.url().should("equal", `${URL}/`);
        cy.get('article').should('have.length', (RECOMMENDATIONS_NUMBERS + 1));
    });

    it('find a maximum of 10 recommendations sorted by score', ()=> {
        cy.visit(`${URL}/`);

        cy.intercept('GET', '/recommendations/top/10').as('getTopRecommendations');
        cy.get('#top').click();
        cy.wait('@getTopRecommendations');
        
        cy.url().should("equal", `${URL}/top`);
        cy.get('article').should('have.length', (RECOMMENDATIONS_NUMBERS + 1));
    });

    it('find a random recommendation', ()=> {
        cy.visit(`${URL}/`);

        cy.intercept('GET', '/recommendations/random').as('getRandomRecommendation');
        cy.get('#random').click();
        cy.wait('@getRandomRecommendation');
        
        cy.url().should("equal", `${URL}/random`);
        cy.get('article').should('have.length', (RECOMMENDATIONS_NUMBERS + 1));
    });
});

after(()=> {
    cy.resetRecommendations();
});
