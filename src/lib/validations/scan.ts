import { z } from "zod/v4";

export const scanInputSchema = z.object({
  url: z.url("Please enter a valid URL"),
});

export type ScanInput = z.infer<typeof scanInputSchema>;
