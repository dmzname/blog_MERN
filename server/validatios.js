import {body} from 'express-validator';

export const loginValidation = [
    body('email', 'Invalid e-mail format.').isEmail(),
    body('password', 'Password must be at least 5 characters.').isLength({min: 5}),
];

export const authValidation = [
    body('fullName', 'Enter your name.').isLength({min: 3}),
    body('email', 'Invalid e-mail format.').isEmail(),
    body('password', 'Password must be at least 5 characters.').isLength({min: 5}),
    body('avatarUrl', 'No valid avatar link.').optional().isString(),
];

export const authEditValidation = [
    body('fullName', 'Enter your name.').isLength({min: 3}),
    body('email', 'Invalid e-mail format.').isEmail(),
    body('password', 'Password must be at least 5 characters.').optional().isLength({min: 5}),
    body('avatarUrl', 'No valid avatar link.').optional().isString(),
];

export const passwordEditValidation = [
    body('oldPassword', 'Password must be at least 5 characters.').isLength({min: 5}),
    body('newPassword', 'Password must be at least 5 characters.').isLength({min: 5}),
    body('confirmedPassword', 'Password must be at least 5 characters.').isLength({min: 5}),
];

export const postCreateValidation = [
    body('title', 'Enter article title.').isLength({min: 3}).isString(),
    body('text', 'Enter article text.').isLength({min: 10}).isString(),
    body('tags', 'Wrong tag format (specify array).').optional().isArray(),
    body('imageUrl', 'No valid image link.').optional().isString(),
];