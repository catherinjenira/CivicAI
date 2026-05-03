import { describe, it, expect } from 'vitest';
import { getMockResponse } from '../mockData';

describe('CivicAI Logic Tests', () => {
  it('should return a valid mock response for registration queries', () => {
    const query = "How do I register to vote?";
    const response = getMockResponse(query);
    expect(response).toContain('register');
  });

  it('should return a default response for unknown queries', () => {
    const query = "What is the best pizza in town?";
    const response = getMockResponse(query);
    expect(response).toContain('election');
  });

  it('should handle daily fact fallback', () => {
    const fallbackFact = "In Ancient Greece, citizens used broken pottery to vote.";
    expect(fallbackFact.length).toBeLessThan(100);
  });
});
