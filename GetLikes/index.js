const azure = require('azure-storage');

const tableService = azure.createTableService();
const tableName = 'bloglikes';

module.exports = function (context, req) {
  context.log('Start GetLikes');

  let postName = req.params.postName;

  if (!postName) {
    context.res = {
      status: 400,
      body: 'Please pass a postName in the request body'
    };
    context.done();
  }

  // return item with RowKey 'id'
  tableService.retrieveEntity(tableName, 'Partition', postName, function (error, result, response) {
    if (!error) {
      context.res.status(201).json(result);
    } else {
      context.res.status(500).json({ error: error });
    }
  });
};
