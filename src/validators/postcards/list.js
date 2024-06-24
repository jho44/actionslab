'use strict';

const Joi        = require('joi');
const Validators = require('@lob/validators');

const AddressFilterValidator  = require('../addresses/filter');
const ExposeNCOA              = require('../expose-ncoa');
const InternalEventsValidator = require('../internal-events');
const LobJoi                  = require('../../libraries/joi');
const MailTypeValidator       = require('../mail-type');
const PaginationBeforeAfter   = require('../pagination-before-after');
const Postcard                = require('../../models/postcard');
const BatchValidator          = require('../batch/batch-id');

const VALID_STATUSES = Object.values(Postcard.STATUSES);

module.exports = PaginationBeforeAfter.keys({
  include: Joi.array().items(Joi.string()).optional()
    .description('Request that the response include the total count by specifying <code>include[]=total_count</code>.'),
  metadata: Validators.MetadataList,
  date_created: Validators.DateFilter,
  size: Joi.array().min(1).items(LobJoi.postcardSize().size())
    .description(`
    The postcard sizes to be returned. Must be a non-empty string array of valid sizes.
    Acceptable values are <code>4x6</code>, <code>6x9</code>, and <code>6x11</code>.
  `),
  scheduled: Joi.boolean().optional()
    .description(`
    Set <code>scheduled</code> to <code>true</code> to only return orders (past or future) where <code>send_date</code>
    is greater than <code>date_created</code>. Set scheduled to <code>false</code> to only return orders where
    <code>send_date</code> is equal to <code>date_created</code>.
  `),
  send_date: Validators.DateFilter,
  mail_type: MailTypeValidator,
  status: Joi.when('$auth.credentials.account.admin', {
    is: true,
    then: Joi.alternatives().try(
      Joi.string().valid(VALID_STATUSES),
      Joi.array().items(Joi.string().valid(VALID_STATUSES)).min(1)
    ),
    otherwise: Joi.forbidden()
  }),
  api_key: Joi.when('$auth.credentials.account.admin', {
    is: true,
    then: Joi.string().optional(),
    otherwise: Joi.forbidden()
  }),
  account: Joi.when('$auth.credentials.account.admin', {
    is: true,
    then: Joi.string().optional(),
    otherwise: Joi.forbidden()
  }),
  feature_flags: Joi.when('$auth.credentials.account.admin', {
    is: true,
    then: Joi.object().pattern(/\w/, Joi.boolean()).max(1),
    otherwise: Joi.forbidden()
  }),
  accounts: Joi.when('$auth.credentials.account.admin', {
    is: true,
    then: Joi.array().items(Joi.string()).min(1),
    otherwise: Joi.forbidden()
  }),
  mode: Joi.when('$auth.credentials.account.admin', {
    is: true,
    then: Joi.string().valid('test', 'live', 'all').optional(),
    otherwise: Joi.forbidden()
  }),
  html_front: Joi.when('$auth.credentials.account.admin', {
    is: true,
    then: Joi.boolean().optional(),
    otherwise: Joi.forbidden()
  }),
  html_back: Joi.when('$auth.credentials.account.admin', {
    is: true,
    then: Joi.boolean().optional(),
    otherwise: Joi.forbidden()
  }),
  setting: Joi.when('$auth.credentials.account.admin', {
    is: true,
    then: Joi.string().optional(),
    otherwise: Joi.forbidden()
  }),
  to: AddressFilterValidator,
  starting_after: Joi.when('$auth.credentials.account.admin', {
    is: true,
    then: Joi.string().optional(),
    otherwise: Joi.forbidden()
  }),
  ending_before: Joi.when('$auth.credentials.account.admin', {
    is: true,
    then: Joi.string().optional(),
    otherwise: Joi.forbidden()
  }),
  internal_events: InternalEventsValidator,
  sort_by: Joi.object().keys({
    date_created: Joi.string().valid('asc', 'desc').optional(),
    send_date: Joi.string().valid('asc', 'desc').optional()
  }).max(1)
    .description(`
    Sorts postcards in a desired order. <code>sort_by</code> accepts an object with the key being
    either <code>date_created</code> or <code>send_date</code> and the value being either
    <code>asc</code> or <code>desc</code>.
  `),
  expose_ncoa: ExposeNCOA,
  batch: BatchValidator
})
  .options({
    language: {
      object: {
        nand: '!!before and after cannot be provided together'
      }
    }
  });