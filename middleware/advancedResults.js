const advancedResults = (model, populate) => async (req, res, next) => {
    console.log(req.query);
    let query;

    let reqQuery = {...req.query};

    const removeFields = ['select', 'sort', 'page', 'limit'];

    // loop over remove fields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);



    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`); 

    query = model.find(JSON.parse(queryStr));

    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    if(req.query.sort ){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }
    else{
        query = query.sort("-createdAt"); 
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments(query);

    query = query.skip(skip).limit(limit);

    if(populate){
        query = query.populate(populate);
    }

    const results = await query;

    const pagination = {};

    if(endIndex < total){
        pagination.next = {
            page_ : page +1, 
            limit
        }
    }

    if(skip > 0){
        pagination.prev = {
            page_ : page - 1,
            limit
        }
    }


    res.advancedResults = {
        success : true,
        count_all : total,
        count_local : results.length, 
        pagination,
        data : results
    }

    next();

};

module.exports = advancedResults;