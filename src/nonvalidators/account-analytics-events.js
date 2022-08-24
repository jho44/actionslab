'use strict';

const ModelBase = require('./base');

module.exports = ModelBase.extend({
  tableName: 'accounts_analytics_events',
  hasTimestamps: ['date_created', 'date_modified'],
  serialize: function () {
    return {
      id: this.get('analytics_event_id'),
      date_created: this.get('date_created'),
      date_modified: this.get('date_modified')
    };
  }
});
// another smol change