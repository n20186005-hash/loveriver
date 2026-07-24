import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    summary: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    type: z.enum(["guide", "place", "route", "boat", "utility"]).default("guide"),
    keywords: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    station: z.string().optional(),
    duration: z.string().optional(),
    address: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    sourceLabel: z.string().optional(),
    sourceUrl: z.url().optional(),
  }),
});

export const collections = { pages };
