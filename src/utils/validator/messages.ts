import Joi from "joi";

export const postMessageSchema = Joi.object({
    chat_id: Joi.string().required(),
    content: Joi.string().required(),
});

export const patchMessageStatusSchema = Joi.object({
    status: Joi.string().valid("delivered", "read", "failed").required(),
});
