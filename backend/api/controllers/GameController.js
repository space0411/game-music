/**
 * GameController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    /**
    * read game
    *
    * (POST /api/v1/game/read)
    */
    read: async (req, res) => {
        const body = req.body;

        let page = body.page || 1;
        let rowsOnPage = body.rowsOnPage || 20;

        let skip = (page - 1) * 20;
        let limit = rowsOnPage;
        let totalRows = 0;

        let foundTable = [];

        try {
            const temp = await Game.find({
                where: { deletedAt: 0 }
            });
            totalRows = temp.length;
            console.log('totalRows', totalRows);
            foundTable = await Game.find({
                where: { deletedAt: 0 },
                skip: skip,
                limit: limit,
                sort: 'id DESC'
            });
            // await Promise.all(foundTable.map(async (element) => {
            //     element['childlist'] = await ChildGame.find({
            //         where: { deletedAt: 0, type: element.id }
            //     });
            // }));
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
            list: foundTable
        };
        return res.status(200).json(Res.success(outData, { message: sails.__('readGameSuccess') }));
    },

    /**
     * Create Game
     *
     * (POST /api/v1/game/create)
     */
    create: async (req, res) => {
        const body = req.body;
        let created;
        try {
            created = await Game.create(body).fetch();
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
        return res.status(200).json(Res.success(created, { message: sails.__('createGameSuccess') }));


    },

    /**
    * Upload Game Image
    *
    * (POST /api/v1/game/image)
    */
    image: async (req, res) => {
        var idProduct = req.param('id');
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
                    dirname: require('path').resolve(sails.config.appPath, 'assets/images/game')
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
                        url: filename.split('game\\')[1],
                        idProduct: idProduct
                    };
                    var create = await GameImage.create(imageData).fetch();
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
     * Update Game
     *
     * (POST /api/v1/game/update)
     */
    update: async (req, res) => {
        const body = req.body;
        const id = body.id;
        if (!id) {
            return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
        }

        let updated = [];

        try {
            updated = await Game.update({ id: id }).set(body).fetch();
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

        return res.status(200).json(Res.success(updated[0], { message: sails.__('updateGameSuccess') }));


    },

    /**
     * Remove Game
     *
     * (DELETE /api/v1/game/delete)
     */
    delete: async (req, res) => {
        const body = req.body;
        const id = body.id;
        if (!id) {
            return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
        }

        let deleted = [];
        try {
            deleted = await Game.update({ id: id }).set({ deletedAt: Date.now() }).fetch();
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

        console.log('deletedGame', deleted.id);
        return res.status(200).json(Res.success(undefined, { message: sails.__('deleteGameSuccess') }));

    }
};

