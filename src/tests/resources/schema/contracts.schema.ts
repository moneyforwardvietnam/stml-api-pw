export const DRAFT_CONTRACT_SUCCESS = {
    "type": "object",
    "properties": {
        "data": {
            "type": "object",
            "properties": {
                "id": { "type": "string" },
                "number": { "type": "string" },
                "name": { "type": "string" },
                "contract_type_id": { "type": "string" },
                "document_type_id": { "type": "string" },
                "person_in_charge": { "type": "string" },
                "document_id": { "type": "string" },
                "document": {
                    "type": "object",
                    "properties": {
                        "id": { "type": "string" },
                        "name": { "type": "string" },
                        "file_type": { "type": "string" },
                        "path": { "type": "string" }
                    }
                },
                "contract_fields": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": { "type": "string" },
                            "name": { "type": "string" },
                            "value": {
                                "type": "object",
                                "properties": {
                                    "data": { "type": ["null", "string", "boolean", "number"] }
                                }
                            },
                            "data_type": { "type": "string" },
                            "rule": { "type": "string" }
                        }
                    }
                },
                "multiple_contracts": { "type": ["null", "string", "boolean", "number"] },
                "created_at": { "type": "string", "format": "date-time" },
                "updated_at": { "type": "string", "format": "date-time" }
            },
            "required": ["id", "number", "name", "contract_type_id", "document_type_id", "person_in_charge", "document_id", "document", "contract_fields", "multiple_contracts", "created_at", "updated_at"]
        }
    },
    "required": ["data"]
};


export const SAVE_PARTNER_SUCCESS = {
    'type': 'object',
    'properties': {
        'data': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'id': { 'type': 'string' },
                    'name': { 'type': 'string' },
                    'representative_name': { 'type': 'string' },
                    'approvers': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'id': { 'type': 'string' },
                                'email': {
                                    'type': 'string',
                                    'format': 'email'
                                },
                                'name': { 'type': 'string' },
                                'company_name': { 'type': 'string' },
                                'access_key': { 'type': 'string' },
                                'locale': { 'type': 'string' }
                            },
                            'required': [
                                'id',
                                'email',
                                'name',
                                'company_name',
                                'access_key',
                                'locale'
                            ]
                        }
                    }
                },
                'required': [
                    'id',
                    'name',
                    'representative_name',
                    'approvers'
                ]
            }
        }
    },
    'required': ['data']
}