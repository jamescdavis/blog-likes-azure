const azure = require('azure-storage');

const tableService = azure.createTableService();
const tableName = 'bloglikes';

module.exports = function (context, req) {
  let postName = req.params.postName;

  if (!postName) {
    context.res = {
      status: 400,
      body: 'Please pass a postName as a parameter'
    };

    return context.done();
  }

  tableService.retrieveEntity(tableName, 'Partition', postName, function(error, result, response) {
    let likes = 1;

    if (error && error.code !== "ResourceNotFound") {
      context.res.status(500).json({ error: error });
    }

    if (result) {
      likes = response.body.likes + 1;
    }

    const entity = {
      RowKey: postName,
      PartitionKey: 'Partition',
      likes
    };

    // Use { echoContent: true } if you want to return the created item including the Timestamp & etag
    tableService.insertOrReplaceEntity(tableName, entity, { echoContent: true }, function (error, result, response) {
      if (!error) {
        context.res.status(201).json({ likes });
      } else {
        context.res.status(500).json({ error: error });
      }
    });
  });
};
