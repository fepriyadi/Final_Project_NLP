import { z } from "zod";

const positive = "Positive";
const neutral = "Neutral";
const irrelevant = "Irrelevant";
const sarcastic = "Sarcastic Negative";
const negative = "Genuine Negative";

export const reviewRequestSchema = z.object({
    review_text: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    model: z.string().min(1).optional(),
});

export const csvRowSchema = z.object({
    review_text: z.string().min(1),
    rating: z.coerce.number().int().min(1).max(5),
});

export const analysisResultSchema = z.object({
    predicted_sentiment: z.enum([
        positive,
        neutral,
        irrelevant,
        sarcastic,
        negative,
    ]),
    rating_sentiment: z.enum([
        positive,
        neutral,
        irrelevant,
        sarcastic,
        negative,
    ]),
    is_consistent: z.boolean(),
    explanation: z.string().min(1),
    confidence_percentage: z.number(),
});

export const predictedSentimentConfidenceSchema = z.object({
    method: z.literal("predicted_sentiment_logprobs"),
    matched_text: z.string().nullable(),
    score_percentage: z.number().int().min(0).max(100).nullable(),
    average_logprob: z.number().nullable(),
    min_logprob: z.number().nullable(),
    token_count: z.number().int().min(0),
});

export const analysisApiResultSchema = analysisResultSchema.extend({
    predicted_sentiment_confidence:
        predictedSentimentConfidenceSchema.optional(),
});

export const batchRequestSchema = z.object({
    reviews: z.array(reviewRequestSchema).min(1),
    model: z.string().min(1).optional(),
});

export const scrapingRequestSchema = z.object({
    url: z.string().url(),
    total_reviews: z.number().int().min(1).max(100),
    model: z.string().min(1).optional(),
});
