SELECT *
FROM ${view_name}
WHERE embedding <#> ${query_embedding} < -${match_threshold}
ORDER BY embedding <#> ${query_embedding}
LIMIT ${max_item_count};