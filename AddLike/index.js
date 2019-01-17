const azure = require('azure-storage');

const tableService = azure.createTableService();
const tableName = 'bloglikes';

module.exports = function (context, req) {
  context.log('Start AddLike');

  let postName = req.params.postName;

  if (!postName) {
    context.res = {
      status: 400,
      body: 'Please pass a postName as a parameter'
    };

    return context.done();
  }

  tableService.retrieveEntity(tableName, 'Partition', postName, function(error, result, response) {
    let likes = 0;

    if (error && error.code !== "ResourceNotFound") {
      context.res.status(500).json({ error: error });
    }

    if (result) {
      likes = response.body.likes;
    }

    const entity = {
      RowKey: postName,
      PartitionKey: 'Partition',
      likes: likes + 1
    };

    // Use { echoContent: true } if you want to return the created item including the Timestamp & etag
    tableService.insertOrReplaceEntity(tableName, entity, { echoContent: true }, function (error, result, response) {
      if (!error) {
        context.res.status(201).json(result);
      } else {
        context.res.status(500).json({ error: error });
      }
    });
  });
};
