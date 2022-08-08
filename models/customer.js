const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
    "Customer",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50,
        },
        isGold: {
            type: Boolean,
            default: false,
        },
        phone: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 20,
        },
    })
);

// ********* HELPER
function validateCustomer(customer) {
    const scheme = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        phone: Joi.string().min(3).max(20).required(),
        isGold: Joi.boolean(),
    });
    return scheme.validate({
        name: customer.name,
        phone: customer.phone,
        isGold: customer.isGold,
    });
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
