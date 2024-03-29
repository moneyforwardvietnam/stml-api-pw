export const CONTRACT_TYPES_ERROR_WrongTennantUserID = {
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