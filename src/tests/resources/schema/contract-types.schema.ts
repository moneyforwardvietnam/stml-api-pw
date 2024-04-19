export const CONTRACT_TYPES_ERROR_InsufficientOfficePlan = {
    'type': 'object',
    'properties': {
        'errors': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'type': { 'type': 'string' },
                    'code': { 'type': 'string' },
                    'message': { 'type': 'string' },
                    'param': { 'type': 'string' }
                },
                'required': [
                    'code',
                    'message',
                    'param'
                ]
            }
        }
    },
    'required': ['errors']
};


export const CONTRACT_TYPE_ERROR_InvalidXToken = {
    'type': 'object',
    'properties': {
        'errors': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'type': { 'type': 'string' },
                    'code': { 'type': 'string' },
                    'message': { 'type': 'string' },
                    'param': { 'type': 'boolean' }
                },
                'required': [
                    'code',
                    'message',
                    'param'
                ]
            }
        }
    },
    'required': ['errors']
};

export const CONTRACT_TYPE_ERROR_InvalidXEmail = {
    'type': 'object',
    'properties': {
        'errors': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'type': { 'type': 'string' },
                    'code': { 'type': 'string' },
                    'message': { 'type': 'string' },
                    'param': { 'type': 'string' }
                },
                'required': [
                    'code',
                    'message',
                    'param'
                ]
            }
        }
    },
    'required': ['errors']
};

export const CONTRACT_TYPE_ERROR_Unauthenticated = {
    'type': 'object',
        'properties': {
        'errors': {
            'type': 'array',
                'items': {
                'type': 'object',
                    'properties': {
                    'type': { 'type': 'string' },
                    'code': { 'type': 'string' },
                    'message': { 'type': 'string' },
                    'param': { 'type': 'string' }
                },
                'required': [
                    'code',
                    'message',
                    'param'
                ]
            }
        }
    },
    'required': ['errors']
};

export const CONTRACT_TYPES_ERROR_WrongTennant = {
    'type': 'object',
    'properties': {
        'errors': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'type': { 'type': 'string' },
                    'code': { 'type': 'string' },
                    'message': { 'type': 'string' }
                },
                'required': [
                    'code',
                    'message'
                ]
            }
        }
    },
    'required': ['errors']
};

export const CONTRACT_TYPE_ERROR_Unauthorized = {
    'type': 'object',
    'properties': {
        'errors': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'type': { 'type': 'string' },
                    'code': { 'type': 'string' },
                    'message': { 'type': 'string' }
                },
                'required': [
                    'code',
                    'message'
                ]
            }
        }
    },
    'required': ['errors']
};

export const CONTRACT_TYPE_SUCCESS_ShowList = {
    "type": "object",
    "properties": {
        "data": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": { "type": "string" },
                    "name": { "type": "string" },
                    "description": { "type": "string" },
                    "is_default": { "type": "boolean" }
                },
                "required": ["id", "name", "description", "is_default"]
            }
        }
    },
    "required": ["data"]
};