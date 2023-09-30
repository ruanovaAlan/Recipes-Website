const BaseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension); //Extend the base Joi with the extension and sanitize-html

module.exports.recipeSchema = Joi.object({
    recipe: Joi.object({
        titulo: Joi.string().required().escapeHTML(),
        seccion: Joi.string().required(),
        tipo: Joi.string().required(),
        ingredientes: Joi.string().required().escapeHTML(),
        proceso: Joi.string().required().escapeHTML()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
});