/**
 * ProductImage.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        url: { type: 'string' },
        idProduct: {
            model: 'product', 
            // columnName: 'idProduct'
        }
    },
    tableName: 'product_image',
};
