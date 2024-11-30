import Joi from "joi";

export const startChatSchema = Joi.object({
    participant: Joi.string().required()
});