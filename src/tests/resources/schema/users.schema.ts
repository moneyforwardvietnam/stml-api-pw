export const USER_GET_SUCCESS = {
    "type": "object",
    "properties": {
        "data": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": { "type": "string" },
                    "name": { "type": "string" },
                    "email": { "type": "string", "format": "email" }
                },
                "required": ["id", "name", "email"]
            }
        },
        "paging": {
            "type": "object",
            "properties": {
                "total": { "type": "integer" }
            },
            "required": ["total"]
        }
    },
    "required": ["data", "paging"]
};