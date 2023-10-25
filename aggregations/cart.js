const mongoose = require('mongoose');

const getCartAggregation = (userId) => {
    const pipeline = [
        {
            $match: {
                user: mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: 'products',
                localField: 'items.product',
                foreignField: '_id',
                as: 'items.productDetails',
            },
        },
        {
            $project: {
                user: 0, 
            },
        },
    ];

    return pipeline;
};

module.exports = {
    getCartAggregation,
};
