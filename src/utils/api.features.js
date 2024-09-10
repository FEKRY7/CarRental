class ApiFeatures {
  constructor(mongooseQuery, queryData) {
    this.mongooseQuery = mongooseQuery;
    this.queryData = queryData;
  }

  pagination = () => {
    let { page, limit } = this.queryData;
    if (!page || page <= 0) page = 1;
    if (!limit || limit <= 0) page = 5;
    const skip = limit * (page - 1);

    this.mongooseQuery.skip(skip).limit(limit);
    return this;
  };
  filter = () => {
    const exculdedFilterData = ["sort", "page", "limit", "fields", "searchKey"];
    let queryCopy = { ...this.queryData };
    exculdedFilterData.forEach((ele) => {
      delete queryCopy[ele];
    });
    queryCopy = JSON.parse(
      JSON.stringify(queryCopy).replace(
        /lte|lt|gte|gt/g,
        (match) => `$${match}`
      )
    );
    this.mongooseQuery.find(queryCopy);
    return this;
  };
  sort = () => {
    if (this.queryData.sort) {
      this.mongooseQuery.sort(this.queryData.sort.replace(/,/g, " "));
    }
    return this;
  };
  search = () => {
    if (this.queryData.searchKey) {
      this.mongooseQuery.find({
        $or: [
          { name: { $regex: `${this.queryData.searchKey}` } },
          { descripition: { $regex: `${this.queryData.searchKey}` } },
        ],
      });
    }
    return this;
  };
  select = () => {
    if (this.queryData.fields) {
      this.mongooseQuery.select(this.queryData.fields.replace(/,/g, " "));
    }
    return this;
  };

  x = () => {
    return {
      totalResults: this.mongooseQuery.countDocuments(),
      currentpageNumber: this.pagination.page,
      totalPages: Math.ceil(
        this.mongooseQuery.countDocuments() / this.pagination.limit
      ),
      ResultsInPage: this.mongooseQuery.length,
    };
  };
}

module.exports = { ApiFeatures };
