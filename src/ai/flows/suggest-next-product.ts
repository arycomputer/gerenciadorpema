'use server';

/**
 * @fileOverview Implements the SuggestNextProduct flow, which suggests the next product a customer might order based on their current order history.
 *   The prompt is updated to include all available product codes from the provided data.
 *
 * - suggestNextProduct - A function that suggests the next product based on order history.
 * - SuggestNextProductInput - The input type for the suggestNextProduct function.
 * - SuggestNextProductOutput - The return type for the suggestNextProduct function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNextProductInputSchema = z.object({
  orderHistory: z
    .array(z.string())
    .describe('The history of product codes ordered by the customer.'),
  currentOrder: z
    .array(z.string())
    .describe('The product codes of the items currently in the order.'),
});
export type SuggestNextProductInput = z.infer<typeof SuggestNextProductInputSchema>;

const SuggestNextProductOutputSchema = z.object({
  suggestedProductCode:
    z.string().describe('The product code of the suggested next product.'),
  confidence:
    z.number().min(0).max(1).describe('A confidence score (0 to 1) for the suggestion.'),
});
export type SuggestNextProductOutput = z.infer<typeof SuggestNextProductOutputSchema>;

export async function suggestNextProduct(
  input: SuggestNextProductInput
): Promise<SuggestNextProductOutput> {
  return suggestNextProductFlow(input);
}

const productCodes = [
  'AC', 'AS', 'ÇA', 'ÇG', 'ÇL', 'KS', 'FL', 'FU', 'SP', 'CL', 'CLZ', 'SPL', 'C1', 'PC',
  'PG', 'SL', 'MS', 'PM', 'BLC', 'BLO', 'BLP', 'BLS', 'CX', 'E', 'KBC', 'KBS', 'R', '4Q',
  'COS', 'TL', 'RJ', 'B', 'BGM', 'BG', 'V', 'Q', 'CQ', 'KC', 'FC', 'C', 'P', 'PN', 'PP', 'CS',
  'BR', 'CS/Q', 'Q/M', 'K/M/Q/P/T/BR/30', 'FC/Q', 'P/C/F/M/PN/K/30', 'Q/PP', 'BR/CR', 'CS/CAT',
  'CQ/O', 'P/CAT', 'BR/BC/PP/Q/CS/P/30', 'BR/CAT', 'PN/M', 'CQ/C/Q', 'K/Q', 'Q/P/C/O/25', 'KC/Q',
  'BR/BC/Q', 'KC/BC/C/P/CAT/BC/30', 'FC/PN', 'KC/C', 'CQ/CR/O/Q/25', 'CQ/T/CR/Q/25', 'CQ/BC/PN/CR/25',
  'Q/BR', 'Q/BC', 'PP/CS', 'P/BR/K/CAT/25', 'KC/BR', 'Q/CAT', 'Q/P/PP/CR/C/K/30', 'CQ/BC/CAT/CS/CR/Q/30',
  'K', 'FC/K/CAT/F/25', 'PP/BR', 'PN/Q', 'CQ/F/M/K/Q/BC/30', 'FC/F/Q/Q/F/F/30', 'FC/BR/CS/CR/PN/Q/30',
  'KC/Q/PN/CS/25', 'FC/BC/BR/M/T/K/30', 'CQ/BC/CR/PP/25', 'CS/Q/T/PP/25', 'KC/P/F/CR/PP/K/30', 'K/BC/T/C/K/Q/30',
  'FC/BC/Q/T/25', 'CQ/BC/CS/CR/K/Q/30', 'FC/Q/F/Q/25', 'Q/CS/CR/Q/25', 'Q/T', 'CQ/PN', 'CQ/O/BC/CR/25',
  'Q/P/BC/CAT/25', 'CQ/BC/K/CAT/25', 'COS/BC/BR/K/O/Q/30', 'C/BR', 'CS/CR'
];

const prompt = ai.definePrompt({
  name: 'suggestNextProductPrompt',
  input: {schema: SuggestNextProductInputSchema},
  output: {schema: SuggestNextProductOutputSchema},
  prompt: `You are a sales expert, knowing products that sell well together.

  Based on the customer's order history and current order, suggest the next product they are most likely to order.

  Order History: {{orderHistory}}
  Current Order: {{currentOrder}}

  Consider the following products:
  ${productCodes.join(', ')}

  Return the product code of the suggested product and a confidence score (0 to 1) for the suggestion.
  `,
});

const suggestNextProductFlow = ai.defineFlow(
  {
    name: 'suggestNextProductFlow',
    inputSchema: SuggestNextProductInputSchema,
    outputSchema: SuggestNextProductOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
