// process-handler.ts
import { extractLabelsFromImage, validateResponseFormat } from './image-labeling';
import { semanticSearch } from './outfit-matching';
import { chatCompletionTextAndImage, chatCompletionTextOnly } from './utils';
import { getItemsByIds } from './item';

const handleSuggestionMatching = async (suggested_label_strings: string[], max_num_item: number): Promise<string[]> => {
    /* TODO: This server action handles the matching process of multiple textual suggestions to multiple items.
       You should utilize semanticSearch() to obtain the suggestions and determine the final output format. */
};

const handleInputToSuggestions = async (image_url: string, textual_info: string, max_num_suggestion: number): Promise<string[]> => {
    /* TODO: This server action handles different cases of user input.
       There might be three cases:
       1. image only
       2. textual information only (skip)
       3. image and textual information (skip)
       You should utilize chatCompletionTextAndImage() and chatCompletionTextOnly() to deal with the three cases mentioned above. */
};

const handleRequest = async (image_url: string, textual_info: string, max_num_suggestion: number, max_num_item: number): Promise<Item[]> => {
    /* TODO: This server action handles the thorough process of a user request, which is the function that covers the whole scope.
       You should utilize handleInputToSuggestions() to obtain textual suggestion strings and retrieve the IDs of the target items by handleSuggestionMatching().
       Lastly, use getItemsByIds() to retrieve the items to return. */
};

export { handleRequest };