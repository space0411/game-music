/**
 * DeveloperController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    /**
      * read developer
      *
      * (POST /api/v1/developer/read)
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
            const temp = await Developer.find({
                where: { deletedAt: 0 }
            });
            totalRows = temp.length;
            console.log('totalRows', totalRows);
            foundTable = await Developer.find({
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
     * Create Developer
     *
     * (POST /api/v1/developer/create)
     */
    create: async (req, res) => {
        const body = req.body;
        let created;
        try {
            created = await Developer.create(body).fetch();
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
    * Upload Developer Image
    *
    * (POST /api/v1/developer/image)
    */
    image: async (req, res) => {
        var idDeveloper = req.param('id');
        if (!idDeveloper) {
            return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
        }
        let created = [];
        try {
            req.file(`image`).upload({
                // don't allow the total upload size to exceed ~5MB
                maxBytes: 5000000,
                dirname: require('path').resolve(sails.config.appPath, 'assets/images/developer')
            }, async (err, uploadedFiles) => {
                if (err) { return res.serverError(err); }
                // If no files were uploaded, respond with an error.
                if (uploadedFiles.length === 0) {
                    return res.status(400).json(Res.error(undefined, { message: sails.__('nofilewasuploaded') }));
                }
                let filename = uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/') + 1);
                console.log('idDeveloper: ' + idDeveloper + " image " + filename);
                created = await Developer.update({ id: idDeveloper }).set({ image: filename.split('developer\\')[1] }).fetch();
            });

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
     * Update Developer
     *
     * (POST /api/v1/developer/update)
     */
    update: async (req, res) => {
        const body = req.body;
        const id = body.id;
        if (!id) {
            return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
        }

        let updated = [];

        try {
            updated = await Developer.update({ id: id }).set(body).fetch();
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
     * Remove Developer
     *
     * (DELETE /api/v1/developer/delete)
     */
    delete: async (req, res) => {
        const body = req.body;
        const id = body.id;
        if (!id) {
            return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
        }

        let deleted = [];
        try {
            deleted = await Developer.update({ id: id }).set({ deletedAt: Date.now() }).fetch();
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

