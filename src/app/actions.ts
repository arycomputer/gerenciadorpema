'use server';

import { suggestNextProduct } from '@/ai/flows/suggest-next-product';
import type { SuggestNextProductOutput } from '@/ai/flows/suggest-next-product';

export async function getSuggestionAction(
  currentOrder: string[],
  orderHistory: string[]
): Promise<SuggestNextProductOutput | null> {
  if (currentOrder.length === 0) {
    return null;
  }

  try {
    const suggestion = await suggestNextProduct({
      currentOrder,
      orderHistory,
    });
    return suggestion;
  } catch (error) {
    console.error('Error getting AI suggestion:', error);
    // In a real app, you might want to log this to a monitoring service
    return null;
  }
}
