'use strict';

const JoiDateExtension = require('joi-date-extensions');
const Joi              = require('joi').extend(JoiDateExtension);

const AddressCreateValidator    = require('../addresses/create');
const CommonPropertiesValidator = require('../common-plcm');
const Config                    = require('../../../config');
const LetterPropertiesValidator = require('./properties');
const QRCodeValidator           = require('../qr-code');

const LetterCreateValidator = Joi.object().keys({
  description: Joi.string().max(255).optional()
    .description('An internal description that identifies this resource. Must be no longer than 255 characters.'),
  to: Joi.alternatives([AddressCreateValidator, Joi.string().max(20)]).required()
    .description(`
    Must either be an address ID or an inline object with correct address parameters. If an object is
    used, an address will be created, corrected, and standardized for free whenever possible using our
    US Address Verification engine (if it is a US address), and returned back with an ID. Depending on
    your <a href="https://dashboard.lob.com/#/settings/editions">Print & Mail Edition</a>, US addresses
    may also be run additionally through <a href="https://lob.com/docs#ncoa">National Change of Address (NCOA)</a>. Non-US addresses
    will be standardized into uppercase only. If a US address used does not meet your account’s
    <a href="https://dashboard.lob.com/#/settings/account">US Mail Strictness Setting</a>,
    the request will fail. Read more <a href="https://www.lob.com/guides#mailing_addresses">here</a>.
  `),
  from: Joi.when('$auth.credentials.request_types.international_A4_letters', {
    is: true,
    then: Joi.forbidden().default(null).options({
      language: {
        any: {
          unknown: 'is not allowed with A4 letters'
        }
      }
    }),
    otherwise: Joi.alternatives([AddressCreateValidator, Joi.string().max(20)]).required()
  })
    .description(`
    Must either be an address ID or an inline object with correct address parameters. Must be a US address unless using a <code>custom_envelope</code>.
    All addresses will be standardized into uppercase without being modified by verification.
  `),
  billing_group_id: Joi.when('$auth.credentials.account.admin', {
    is: true,
    then: Joi.string(),
    otherwise: Joi.when('$auth.credentials.features.billing_group_management', {
      is: true,
      then: Joi.string(),
      otherwise: Joi.forbidden()
    })
  }).description(`
    An optional string with the billing group ID to tag your usage with. Is used for billing purpose.
    Requires special activation to use. See <a href="#billing_groups">Billing Group</a> API for more information.
    `).optional(),
  send_date: Joi.date().iso().min('now').optional().when('$auth.credentials.privileged', {
    is: true,
    then: Joi.allow(null),
    otherwise: Joi.optional()
  })
    .options({ language: { date: { min: 'cannot be in the past' } } })
    .description(`
    A timestamp in ISO 8601 format which specifies a date after the current
    time and up to ${Config.SEND_DATE_LIMIT} days in the future to send the letter off for production.
    This will override any <a href="#cancellation">letter cancellation
    window</a> applied to the letter. Until the <code>send_date</code> has
    passed, the letter will be <a href="#letters_delete">cancelable</a>. If a
    date in the format <code>2017-11-01</code> is passed, it will evaluate to
    midnight UTC of that date (<code>2017-11-01T00:00:00.000Z</code>). If a
    datetime is passed, that exact time will be used. A <code>send_date</code>
    passed with no time zone will default to UTC, while a <code>send_date</code>
    passed with a time zone will be converted to UTC.
  `),
  target_delivery_date: Joi.when('$auth.credentials.features.allow_target_delivery_date', {
    is: true,
    then: Joi.date().utc().format('YYYY-MM-DD').min('now').optional(), // this is a date only string
    otherwise: Joi.forbidden()
  }),
  qr_code: Joi.optional().when('$auth.credentials.features.lob_qr_service', {
    is: true,
    then: QRCodeValidator,
    otherwise: Joi.forbidden()
  })
});

module.exports = LetterCreateValidator.concat(LetterPropertiesValidator).concat(CommonPropertiesValidator);