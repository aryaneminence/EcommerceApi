const getAllUsersAggregation = () => {
    const pipeline = [
      {
        $match: {
          user_role: "user",
        },
      },
      {
        $lookup: {
          from: "licenses",
          localField: "_id",
          foreignField: "user_id",
          as: "license_details",
        },
      },
      
      
     
    ];
  
    return pipeline;
  };
  
  module.exports = {
    getAllUsersAggregation,
  };
  