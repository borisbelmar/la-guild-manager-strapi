'use strict';

/**
 * static-party service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::static-party.static-party');
