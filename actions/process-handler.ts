// process-handler.ts
import { extractLabelsFromImage, validateResponseFormat } from './image-labeling';
import { semanticSearch } from './outfit-matching';
import { chatCompletionTextAndImage, chatCompletionTextOnly } from './utils';
import { getItemsByIds } from './item';
import { ItemsTable } from '@/type';

const handleSuggestionMatching = async (suggested_label_strings: string[], max_num_item: number): Promise<string[]> => {
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
};

const handleInputToSuggestions = async (image_url: string, textual_info: string, max_num_suggestion: number): Promise<string[]> => {
    try {
        let suggestedLabelStrings: string[] = [];
        const model = "gpt-4o";

        if (image_url && textual_info) {
            const response = await chatCompletionTextAndImage(model, textual_info, image_url);
            suggestedLabelStrings = response.split('\n').slice(0, max_num_suggestion);
        } else if (image_url) {
            const labels = await extractLabelsFromImage(image_url);
            const labelsArray = labels.split(',').map(label => label.trim());
            const response = await chatCompletionTextOnly(model, labelsArray.join(' '));
            suggestedLabelStrings = response.split('\n').slice(0, max_num_suggestion);
        } else if (textual_info) {
            // （跳過處理）
            return [];
        }
        
        return suggestedLabelStrings;
    } catch (error) {
        console.error('Error in handleInputToSuggestions:', error);
        return [];
    }
};

const handleRequest = async (image_url: string, textual_info: string, max_num_suggestion: number, max_num_item: number): Promise<ItemsTable[]> => {
    try {
        const suggestedLabelStrings = await handleInputToSuggestions(image_url, textual_info, max_num_suggestion);

        if (suggestedLabelStrings.length === 0) {
            return [];
        }
        const matchedItemIds = await handleSuggestionMatching(suggestedLabelStrings, max_num_item);
        if (matchedItemIds.length === 0) {
            return [];
        }
        const items = await getItemsByIds(matchedItemIds);
        return items;
    } catch (error) {
        console.error('Error in handleRequest:', error);
        return [];
    }
};
export { handleSuggestionMatching, handleInputToSuggestions, handleRequest };