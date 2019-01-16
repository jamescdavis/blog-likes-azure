const azure = require('azure-storage');

const tableService = azure.createTableService(
  ServiceClient.DEVSTORE_STORAGE_ACCOUNT,
  ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY,
  ServiceClient.DEVSTORE_TABLE_HOST
);

const tableName = 'ghostlikes';

module.exports = function (context, req) {
  context.log('Start AddLike');

  let postName = req.params.postName;

  if (!postName) {
    context.res = {
      status: 400,
      body: 'Please pass a postName in the request body'
    };
    context.done();
  }

  tableService.retrieveEntity(tableName, 'Partition', postName, function(error, result, response) {
    let likes = 0;

    if (error) {

    } else if (result) {
      likes = response.body.likes;
    }

    const entity = {
      RowKey: postName,
      PartitionKey: 'Partition'
      likes: likes + 1
    };

    // Use { echoContent: true } if you want to return the created item including the Timestamp & etag
    tableService.insertOrReplaceEntity(tableName, entity, { echoContent: true }, function (error, result, response) {
      if (!error) {
        context.res.status(201).json(response);
      } else {
        context.res.status(500).json({ error: error });
      }
    });
  });
};
