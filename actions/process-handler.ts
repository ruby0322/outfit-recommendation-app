// process-handler.ts
import { extractLabelsFromImage, validateResponseFormat } from './image-labeling';
import { semanticSearch } from './outfit-matching';
import { chatCompletionTextAndImage, chatCompletionTextOnly } from './utils';
import { getItemsByIds } from './item';
import { ItemTable } from '@/type';

const handleSuggestionMatching = async (suggested_label_strings: string[], max_num_item: number): Promise<string[] | null> => {
    try {
        let allMatchedItemIds: string[] = [];
        for (const label of suggested_label_strings) {
            const matchedItemIds = await semanticSearch(label);
            allMatchedItemIds = allMatchedItemIds.concat(matchedItemIds);
        }
        // 確保返回的項目 ID 不超過 max_num_item 並且是唯一的
        const uniqueItemIds = Array.from(new Set(allMatchedItemIds));
        return uniqueItemIds.slice(0, max_num_item);
    } catch (error) {
        console.error('Error in handleSuggestionMatching:', error);
        return [];
    }
    // TODO: Need to fix return format.
};

const handleInputToSuggestions = async (image_url: string, textual_info: string, max_num_suggestion: number): Promise<string[] | null> => {
    try {
        let suggestedLabelStrings: string[] = [];
        const model = "gpt-4o-mini";

        if (image_url && textual_info) {
            const response = await chatCompletionTextAndImage(model, textual_info, image_url);
            if (response) {
                suggestedLabelStrings = response.split('\n').slice(0, max_num_suggestion);
            }
        } else if (image_url) {
            const labels = await extractLabelsFromImage(image_url);
            const labelsArray = labels.split(',').map(label => label.trim());
            const response = await chatCompletionTextOnly(model, labelsArray.join(' '));
            if (response) {
                suggestedLabelStrings = response.split('\n').slice(0, max_num_suggestion);
            }
        } else if (textual_info) {
            // （跳過處理）
            return [];
        }
        
        return suggestedLabelStrings as string[];
    } catch (error) {
        console.error('Error in handleInputToSuggestions:', error);
        return [];
    }
};

const handleRequest = async (image_url: string, textual_info: string, max_num_suggestion: number, max_num_item: number): Promise<ItemTable[] | null> => {
    try {
        const suggestedLabelStrings = await handleInputToSuggestions(image_url, textual_info, max_num_suggestion);

        if (!suggestedLabelStrings || suggestedLabelStrings.length === 0) {
            return null;
        }
        const matchedItemIds = await handleSuggestionMatching(suggestedLabelStrings, max_num_item);
        if (!matchedItemIds || matchedItemIds.length === 0) {
            return null;
        }
        const items = await getItemsByIds(matchedItemIds);
        return items;

        // TODO: Need to fix return format.
    } catch (error) {
        console.error('Error in handleRequest:', error);
        return [];
    }
};
export { handleSuggestionMatching, handleInputToSuggestions, handleRequest };