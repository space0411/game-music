/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {

    /**
    * read Product by Categories OR All product
    *
    * (POST /api/v1/product/read)
    */
    read: async (req, res) => {
        const body = req.body;
        const categoryId = body.type;

        let page = body.page || 1;
        let rowsOnPage = body.rowsOnPage || 20;

        let skip = (page - 1) * 20;
        let limit = rowsOnPage;
        let totalRows = 0;

        let foundTable = [];

        const where = {
            deletedAt: 0,
            type: categoryId
        };

        if (!categoryId) {
            delete where.type;
        }

        try {
            const temp = await Product.find({
                where
            });
            totalRows = temp.length;
            console.log('totalRows', totalRows);
            foundTable = await Product.find({
                where,
                skip: skip,
                limit: limit,
                sort: 'id ASC'
            });
        } catch (error) {
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }));
                default:
                    return res.serverError(error);
            }
        }

        var outData = {
            page: parseInt(page),
            totalRows: totalRows,
            list: foundTable,
            type: categoryId,
        };
        if (!categoryId) {
            delete outData.type;
        }
        return res.status(200).json(Res.success(outData, { message: sails.__('readProductSuccess') }));
    },

    mostpopular: async (req, res) => {

    },

    /**
     * Create Product
     *
     * (POST /api/v1/product/create)
     */
    create: async (req, res) => {
        const body = req.body;
        console.log('Create product', body);
        body['createdBy'] = req.user.id;
        let product;
        let flatform = [];
        let genre = [];
        try {
            product = await Product.create(body).fetch();
            const ff = body.flatform;
            if (ff) {
                let ffList = ff.split(',');
                for (let value of ffList) {
                    let f = await PlatformLink.create({ idProduct: product.id, idFlatform: parseInt(value.trim()) });
                    flatform.push(f);
                }
            }
            const g = body.genre;
            if (g) {
                let gList = g.split(',');
                for (let value of gList) {
                    let n = await GenreLink.create({ idProduct: product.id, idGenre: parseInt(value.trim()) });
                    genre.push(n);
                }
            }

        } catch (error) {
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }));
                default:
                    return res.serverError(error);
            }
        }
        var outData = {
            product: product,
            flatform: flatform,
            genre: genre
        }
        return res.status(200).json(Res.success(outData, { message: sails.__('createProductSuccess') }));
    },

    /**
    * Upload Product Image
    *
    * (POST /api/v1/product/image)
    */
    image: async (req, res) => {
        var idProduct = req.param('idProduct');
        var size = req.param('size') || 0;
        if (!idProduct && !size > 0) {
            return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
        }
        let created = [];
        try {
            for (var index = 0; index < size; index++) {
                req.file(`image${index}`).upload({
                    // don't allow the total upload size to exceed ~5MB
                    maxBytes: 5000000,
                    dirname: require('path').resolve(sails.config.appPath, 'assets/images/product')
                }, async (err, uploadedFiles) => {
                    if (err) { return res.serverError(err); }
                    // If no files were uploaded, respond with an error.
                    if (uploadedFiles.length === 0) {
                        return res.status(400).json(Res.error(undefined, { message: sails.__('nofilewasuploaded') }));
                    }
                    let filename = uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/') + 1);
                    console.log(filename);
                    //let uploadLocation = process.cwd() + '/assets/images/product/' + filename;
                    //console.log(uploadLocation);
                    const imageData = {
                        url: filename.split('product\\')[1],
                        idProduct: idProduct
                    };
                    var create = await ProductImage.create(imageData).fetch();
                    created.push(create);
                });
            }
            return res.status(200).json(Res.success(created, { message: sails.__('updateImageSuccess') }));
        } catch (error) {
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }));
                default:
                    return res.serverError(error);
            }
        }
    },
    /**
     * Update Product
     *
     * (POST /api/v1/product/update)
     */
    update: async (req, res) => {
        const body = req.body;
        const id = body.id;
        if (!id) {
            return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
        }

        let updated = [];

        try {
            updated = await Product.update({ id: id }).set(body).fetch();
        } catch (error) {
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }));
                default:
                    return res.serverError(error);
            }
        }

        return res.status(200).json(Res.success(updated[0], { message: sails.__('updateProductSuccess') }));


    },

    /**
     * Remove Product
     *
     * (DELETE /api/v1/product/delete)
     */
    delete: async (req, res) => {
        const body = req.body;
        const id = body.id;
        if (!id) {
            return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
        }

        let deleted = [];
        try {
            deleted = await Product.update({ id: id }).set({ deletedAt: Date.now() }).fetch();
        } catch (error) {
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }));
                default:
                    return res.serverError(error);
            }
        }

        console.log('deletedProduct', deleted.id);
        return res.status(200).json(Res.success(undefined, { message: sails.__('deleteProductSuccess') }));

    }
};

