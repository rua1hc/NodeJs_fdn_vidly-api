const ObjectId = require("mongoose").Types.ObjectId;

module.exports = function (req, res, next) {
    if (!validateObjectId(req.params.id))
        return res.status(404).send("Invalid ID");

    next();
};

const validateObjectId = (id) => {
    return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
};
